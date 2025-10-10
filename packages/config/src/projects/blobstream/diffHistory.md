Generated with discovered.json: 0x3abffe99ba179e39c8eaca69f25dda0842c9f1f2

# Diff at Thu, 09 Oct 2025 10:29:48 GMT:

- author: Sergey Shemyakov (<sergey.shemyakov@l2beat.com>)
- comparing to: main@12129139e90294e347d7674255aee38ca0aef941 block: 1752069683
- current timestamp: 1760005725

## Description

Change in config: renamed Blobstream contracts on different chains to correctly fetch program hashes from different chains.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 1752069683 (main branch discovery), not current.

```diff
    contract ArbitrumBlobstream (arb1:0xA83ca7775Bc2889825BcDeDfFa5b758cf69e8794) {
    +++ description: The Blobstream DA bridge. This contract is used to bridge data commitments between Celestia and the destination chain. It specifies relayers that commit block ranges, but due to the lack of emitted events, there may be more relayers than are presented here.
      name:
-        "Blobstream"
+        "ArbitrumBlobstream"
    }
```

```diff
    contract BaseBlobstream (base:0xA83ca7775Bc2889825BcDeDfFa5b758cf69e8794) {
    +++ description: The Blobstream DA bridge. This contract is used to bridge data commitments between Celestia and the destination chain. It specifies relayers that commit block ranges, but due to the lack of emitted events, there may be more relayers than are presented here.
      name:
-        "Blobstream"
+        "BaseBlobstream"
    }
```

```diff
    contract EthereumBlobstream (eth:0x7Cf3876F681Dbb6EdA8f6FfC45D66B996Df08fAe) {
    +++ description: The Blobstream DA bridge. This contract is used to bridge data commitments between Celestia and the destination chain. It specifies relayers that commit block ranges, but due to the lack of emitted events, there may be more relayers than are presented here.
      name:
-        "Blobstream"
+        "EthereumBlobstream"
    }
```

Generated with discovered.json: 0x51067f2912e433dd919eeea316306a9a22f7fc73

# Diff at Wed, 03 Sep 2025 15:52:13 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@fbfe8da4086c70042fea30347d68132d3f574015 block: 1752069683
- current timestamp: 1752069683

## Description

Rerun to add References to entrypoints of shared modules

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 1752069683 (main branch discovery), not current.

```diff
+   Status: CREATED
    reference SP1VerifierGateway (arb1:0x3B6041173B80E77f038f3F2C0f9744f04837185e)
    +++ description: None
```

```diff
+   Status: CREATED
    reference SP1VerifierGateway (base:0x3B6041173B80E77f038f3F2C0f9744f04837185e)
    +++ description: None
```

```diff
+   Status: CREATED
    reference SP1VerifierGateway (eth:0x3B6041173B80E77f038f3F2C0f9744f04837185e)
    +++ description: None
```

Generated with discovered.json: 0x5dda0dcaefe0208fc640ee81aba950352ed4980d

# Diff at Mon, 01 Sep 2025 10:01:10 GMT:

Merge mark

Generated with discovered.json: 0x6f4fd115050d3c8a3466e49fde349551d356d5fd

# Diff at Mon, 14 Jul 2025 13:11:49 GMT:

- chain: ethereum
- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@9f4300dad2f3d080cd56fa311d4a848556c74e72 block: 22882089
- current block number: 22882089

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22882089 (main branch discovery), not current.

```diff
    EOA  (0x0449689f2ce80fE45B32092e0d878ad87F0156a9) {
    +++ description: None
      address:
-        "0x0449689f2ce80fE45B32092e0d878ad87F0156a9"
+        "eth:0x0449689f2ce80fE45B32092e0d878ad87F0156a9"
    }
```

```diff
    EOA  (0x1358eaCFE3a7F4FEB06c0Ae722072F134bcE7caf) {
    +++ description: None
      address:
-        "0x1358eaCFE3a7F4FEB06c0Ae722072F134bcE7caf"
+        "eth:0x1358eaCFE3a7F4FEB06c0Ae722072F134bcE7caf"
    }
```

```diff
    EOA  (0x3243552F3BcbcE720Db6f5ad0C1B7cd15458392D) {
    +++ description: None
      address:
-        "0x3243552F3BcbcE720Db6f5ad0C1B7cd15458392D"
+        "eth:0x3243552F3BcbcE720Db6f5ad0C1B7cd15458392D"
    }
```

```diff
    EOA  (0x45878fdF56B372D944c6Fc1865B7a65462f6D1b0) {
    +++ description: None
      address:
-        "0x45878fdF56B372D944c6Fc1865B7a65462f6D1b0"
+        "eth:0x45878fdF56B372D944c6Fc1865B7a65462f6D1b0"
    }
```

```diff
    EOA  (0x4983A5ebE79c0570aa368cE84f281A8aAc50cE4d) {
    +++ description: None
      address:
-        "0x4983A5ebE79c0570aa368cE84f281A8aAc50cE4d"
+        "eth:0x4983A5ebE79c0570aa368cE84f281A8aAc50cE4d"
    }
```

```diff
    EOA  (0x793979789Ec179183E396e76c1e241bE0c9eE899) {
    +++ description: None
      address:
-        "0x793979789Ec179183E396e76c1e241bE0c9eE899"
+        "eth:0x793979789Ec179183E396e76c1e241bE0c9eE899"
    }
```

```diff
    contract Blobstream (0x7Cf3876F681Dbb6EdA8f6FfC45D66B996Df08fAe) {
    +++ description: The Blobstream DA bridge. This contract is used to bridge data commitments between Celestia and the destination chain. It specifies relayers that commit block ranges, but due to the lack of emitted events, there may be more relayers than are presented here.
      address:
-        "0x7Cf3876F681Dbb6EdA8f6FfC45D66B996Df08fAe"
+        "eth:0x7Cf3876F681Dbb6EdA8f6FfC45D66B996Df08fAe"
      values.$admin.0:
-        "0x8bF34D8df1eF0A8A7f27fC587202848E528018E6"
+        "eth:0x8bF34D8df1eF0A8A7f27fC587202848E528018E6"
      values.$implementation:
-        "0x46EbfC399d3913BB9b99E73675722417F9c5d416"
+        "eth:0x46EbfC399d3913BB9b99E73675722417F9c5d416"
      values.$pastUpgrades.0.2.0:
-        "0x41a87C543EBcbD93706CF5260AD057D9eCBA1caE"
+        "eth:0x41a87C543EBcbD93706CF5260AD057D9eCBA1caE"
      values.$pastUpgrades.1.2.0:
-        "0x47fd660D5252Bd6F9D2c71507E46aa1d6e957c23"
+        "eth:0x47fd660D5252Bd6F9D2c71507E46aa1d6e957c23"
      values.$pastUpgrades.2.2.0:
-        "0x46EbfC399d3913BB9b99E73675722417F9c5d416"
+        "eth:0x46EbfC399d3913BB9b99E73675722417F9c5d416"
      values.accessControl.DEFAULT_ADMIN_ROLE.members.0:
-        "0x8bF34D8df1eF0A8A7f27fC587202848E528018E6"
+        "eth:0x8bF34D8df1eF0A8A7f27fC587202848E528018E6"
      values.accessControl.TIMELOCK_ROLE.members.0:
-        "0x8bF34D8df1eF0A8A7f27fC587202848E528018E6"
+        "eth:0x8bF34D8df1eF0A8A7f27fC587202848E528018E6"
      values.accessControl.GUARDIAN_ROLE.members.0:
-        "0x8bF34D8df1eF0A8A7f27fC587202848E528018E6"
+        "eth:0x8bF34D8df1eF0A8A7f27fC587202848E528018E6"
      values.guardians.0:
-        "0x8bF34D8df1eF0A8A7f27fC587202848E528018E6"
+        "eth:0x8bF34D8df1eF0A8A7f27fC587202848E528018E6"
      values.relayers.0:
-        "0x3243552f3bcbce720db6f5ad0c1b7cd15458392d"
+        "eth:0x3243552F3BcbcE720Db6f5ad0C1B7cd15458392D"
      values.relayers.1:
-        "0x9c0b0dbbae8a976ceea8c2a96f6d00c53839afdc"
+        "eth:0x9c0B0dBBAe8a976CEeA8C2A96F6D00c53839afDC"
      values.verifier:
-        "0x3B6041173B80E77f038f3F2C0f9744f04837185e"
+        "eth:0x3B6041173B80E77f038f3F2C0f9744f04837185e"
      implementationNames.0x7Cf3876F681Dbb6EdA8f6FfC45D66B996Df08fAe:
-        "ERC1967Proxy"
      implementationNames.0x46EbfC399d3913BB9b99E73675722417F9c5d416:
-        "SP1Blobstream"
      implementationNames.eth:0x7Cf3876F681Dbb6EdA8f6FfC45D66B996Df08fAe:
+        "ERC1967Proxy"
      implementationNames.eth:0x46EbfC399d3913BB9b99E73675722417F9c5d416:
+        "SP1Blobstream"
    }
```

```diff
    contract BlobstreamMultisig (0x8bF34D8df1eF0A8A7f27fC587202848E528018E6) {
    +++ description: None
      address:
-        "0x8bF34D8df1eF0A8A7f27fC587202848E528018E6"
+        "eth:0x8bF34D8df1eF0A8A7f27fC587202848E528018E6"
      values.$implementation:
-        "0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552"
+        "eth:0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552"
      values.$members.0:
-        "0x0449689f2ce80fE45B32092e0d878ad87F0156a9"
+        "eth:0x0449689f2ce80fE45B32092e0d878ad87F0156a9"
      values.$members.1:
-        "0x793979789Ec179183E396e76c1e241bE0c9eE899"
+        "eth:0x793979789Ec179183E396e76c1e241bE0c9eE899"
      values.$members.2:
-        "0x1358eaCFE3a7F4FEB06c0Ae722072F134bcE7caf"
+        "eth:0x1358eaCFE3a7F4FEB06c0Ae722072F134bcE7caf"
      values.$members.3:
-        "0x45878fdF56B372D944c6Fc1865B7a65462f6D1b0"
+        "eth:0x45878fdF56B372D944c6Fc1865B7a65462f6D1b0"
      values.$members.4:
-        "0x4983A5ebE79c0570aa368cE84f281A8aAc50cE4d"
+        "eth:0x4983A5ebE79c0570aa368cE84f281A8aAc50cE4d"
      values.$members.5:
-        "0x91D456f83f4a117B07866fdEdC29306f7E974e15"
+        "eth:0x91D456f83f4a117B07866fdEdC29306f7E974e15"
      implementationNames.0x8bF34D8df1eF0A8A7f27fC587202848E528018E6:
-        "GnosisSafeProxy"
      implementationNames.0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552:
-        "GnosisSafe"
      implementationNames.eth:0x8bF34D8df1eF0A8A7f27fC587202848E528018E6:
+        "GnosisSafeProxy"
      implementationNames.eth:0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552:
+        "GnosisSafe"
    }
```

```diff
    EOA  (0x91D456f83f4a117B07866fdEdC29306f7E974e15) {
    +++ description: None
      address:
-        "0x91D456f83f4a117B07866fdEdC29306f7E974e15"
+        "eth:0x91D456f83f4a117B07866fdEdC29306f7E974e15"
    }
```

```diff
    EOA  (0x9c0B0dBBAe8a976CEeA8C2A96F6D00c53839afDC) {
    +++ description: None
      address:
-        "0x9c0B0dBBAe8a976CEeA8C2A96F6D00c53839afDC"
+        "eth:0x9c0B0dBBAe8a976CEeA8C2A96F6D00c53839afDC"
    }
```

```diff
+   Status: CREATED
    contract Blobstream (0x7Cf3876F681Dbb6EdA8f6FfC45D66B996Df08fAe)
    +++ description: The Blobstream DA bridge. This contract is used to bridge data commitments between Celestia and the destination chain. It specifies relayers that commit block ranges, but due to the lack of emitted events, there may be more relayers than are presented here.
```

```diff
+   Status: CREATED
    contract BlobstreamMultisig (0x8bF34D8df1eF0A8A7f27fC587202848E528018E6)
    +++ description: None
```

Generated with discovered.json: 0x9d27b6ec9f3022b432c2a851bd92ca64e3d54ce0

# Diff at Mon, 14 Jul 2025 13:11:48 GMT:

- chain: arbitrum
- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@9f4300dad2f3d080cd56fa311d4a848556c74e72 block: 355902087
- current block number: 355902087

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 355902087 (main branch discovery), not current.

```diff
    EOA  (0x0449689f2ce80fE45B32092e0d878ad87F0156a9) {
    +++ description: None
      address:
-        "0x0449689f2ce80fE45B32092e0d878ad87F0156a9"
+        "arb1:0x0449689f2ce80fE45B32092e0d878ad87F0156a9"
    }
```

```diff
    EOA  (0x1358eaCFE3a7F4FEB06c0Ae722072F134bcE7caf) {
    +++ description: None
      address:
-        "0x1358eaCFE3a7F4FEB06c0Ae722072F134bcE7caf"
+        "arb1:0x1358eaCFE3a7F4FEB06c0Ae722072F134bcE7caf"
    }
```

```diff
    EOA  (0x3243552F3BcbcE720Db6f5ad0C1B7cd15458392D) {
    +++ description: None
      address:
-        "0x3243552F3BcbcE720Db6f5ad0C1B7cd15458392D"
+        "arb1:0x3243552F3BcbcE720Db6f5ad0C1B7cd15458392D"
    }
```

```diff
    EOA  (0x45878fdF56B372D944c6Fc1865B7a65462f6D1b0) {
    +++ description: None
      address:
-        "0x45878fdF56B372D944c6Fc1865B7a65462f6D1b0"
+        "arb1:0x45878fdF56B372D944c6Fc1865B7a65462f6D1b0"
    }
```

```diff
    EOA  (0x4983A5ebE79c0570aa368cE84f281A8aAc50cE4d) {
    +++ description: None
      address:
-        "0x4983A5ebE79c0570aa368cE84f281A8aAc50cE4d"
+        "arb1:0x4983A5ebE79c0570aa368cE84f281A8aAc50cE4d"
    }
```

```diff
    contract BlobstreamMultisig (0x738a9b55304f9fcF776B3BA285e50c0f9eF77997) {
    +++ description: None
      address:
-        "0x738a9b55304f9fcF776B3BA285e50c0f9eF77997"
+        "arb1:0x738a9b55304f9fcF776B3BA285e50c0f9eF77997"
      values.$implementation:
-        "0x3E5c63644E683549055b9Be8653de26E0B4CD36E"
+        "arb1:0x3E5c63644E683549055b9Be8653de26E0B4CD36E"
      values.$members.0:
-        "0x0449689f2ce80fE45B32092e0d878ad87F0156a9"
+        "arb1:0x0449689f2ce80fE45B32092e0d878ad87F0156a9"
      values.$members.1:
-        "0x91D456f83f4a117B07866fdEdC29306f7E974e15"
+        "arb1:0x91D456f83f4a117B07866fdEdC29306f7E974e15"
      values.$members.2:
-        "0x793979789Ec179183E396e76c1e241bE0c9eE899"
+        "arb1:0x793979789Ec179183E396e76c1e241bE0c9eE899"
      values.$members.3:
-        "0x4983A5ebE79c0570aa368cE84f281A8aAc50cE4d"
+        "arb1:0x4983A5ebE79c0570aa368cE84f281A8aAc50cE4d"
      values.$members.4:
-        "0x45878fdF56B372D944c6Fc1865B7a65462f6D1b0"
+        "arb1:0x45878fdF56B372D944c6Fc1865B7a65462f6D1b0"
      values.$members.5:
-        "0x1358eaCFE3a7F4FEB06c0Ae722072F134bcE7caf"
+        "arb1:0x1358eaCFE3a7F4FEB06c0Ae722072F134bcE7caf"
      implementationNames.0x738a9b55304f9fcF776B3BA285e50c0f9eF77997:
-        "GnosisSafeProxy"
      implementationNames.0x3E5c63644E683549055b9Be8653de26E0B4CD36E:
-        "GnosisSafeL2"
      implementationNames.arb1:0x738a9b55304f9fcF776B3BA285e50c0f9eF77997:
+        "GnosisSafeProxy"
      implementationNames.arb1:0x3E5c63644E683549055b9Be8653de26E0B4CD36E:
+        "GnosisSafeL2"
    }
```

```diff
    EOA  (0x793979789Ec179183E396e76c1e241bE0c9eE899) {
    +++ description: None
      address:
-        "0x793979789Ec179183E396e76c1e241bE0c9eE899"
+        "arb1:0x793979789Ec179183E396e76c1e241bE0c9eE899"
    }
```

```diff
    EOA  (0x91D456f83f4a117B07866fdEdC29306f7E974e15) {
    +++ description: None
      address:
-        "0x91D456f83f4a117B07866fdEdC29306f7E974e15"
+        "arb1:0x91D456f83f4a117B07866fdEdC29306f7E974e15"
    }
```

```diff
    EOA  (0x9c0B0dBBAe8a976CEeA8C2A96F6D00c53839afDC) {
    +++ description: None
      address:
-        "0x9c0B0dBBAe8a976CEeA8C2A96F6D00c53839afDC"
+        "arb1:0x9c0B0dBBAe8a976CEeA8C2A96F6D00c53839afDC"
    }
```

```diff
    contract Blobstream (0xA83ca7775Bc2889825BcDeDfFa5b758cf69e8794) {
    +++ description: The Blobstream DA bridge. This contract is used to bridge data commitments between Celestia and the destination chain. It specifies relayers that commit block ranges, but due to the lack of emitted events, there may be more relayers than are presented here.
      address:
-        "0xA83ca7775Bc2889825BcDeDfFa5b758cf69e8794"
+        "arb1:0xA83ca7775Bc2889825BcDeDfFa5b758cf69e8794"
      values.$admin.0:
-        "0x738a9b55304f9fcF776B3BA285e50c0f9eF77997"
+        "arb1:0x738a9b55304f9fcF776B3BA285e50c0f9eF77997"
      values.$implementation:
-        "0x46EbfC399d3913BB9b99E73675722417F9c5d416"
+        "arb1:0x46EbfC399d3913BB9b99E73675722417F9c5d416"
      values.$pastUpgrades.0.2.0:
-        "0x7C3A9b466FF5c02582fa32d4aD1b2Cb431fB7c9b"
+        "arb1:0x7C3A9b466FF5c02582fa32d4aD1b2Cb431fB7c9b"
      values.$pastUpgrades.1.2.0:
-        "0xfb19439fBa9f16aA720be6bE0e53465a9733C964"
+        "arb1:0xfb19439fBa9f16aA720be6bE0e53465a9733C964"
      values.$pastUpgrades.2.2.0:
-        "0x47fd660D5252Bd6F9D2c71507E46aa1d6e957c23"
+        "arb1:0x47fd660D5252Bd6F9D2c71507E46aa1d6e957c23"
      values.$pastUpgrades.3.2.0:
-        "0x46EbfC399d3913BB9b99E73675722417F9c5d416"
+        "arb1:0x46EbfC399d3913BB9b99E73675722417F9c5d416"
      values.accessControl.DEFAULT_ADMIN_ROLE.members.0:
-        "0x738a9b55304f9fcF776B3BA285e50c0f9eF77997"
+        "arb1:0x738a9b55304f9fcF776B3BA285e50c0f9eF77997"
      values.accessControl.TIMELOCK_ROLE.members.0:
-        "0x738a9b55304f9fcF776B3BA285e50c0f9eF77997"
+        "arb1:0x738a9b55304f9fcF776B3BA285e50c0f9eF77997"
      values.accessControl.GUARDIAN_ROLE.members.0:
-        "0x738a9b55304f9fcF776B3BA285e50c0f9eF77997"
+        "arb1:0x738a9b55304f9fcF776B3BA285e50c0f9eF77997"
      values.guardians.0:
-        "0x738a9b55304f9fcF776B3BA285e50c0f9eF77997"
+        "arb1:0x738a9b55304f9fcF776B3BA285e50c0f9eF77997"
      values.relayers.0:
-        "0x3243552f3bcbce720db6f5ad0c1b7cd15458392d"
+        "arb1:0x3243552F3BcbcE720Db6f5ad0C1B7cd15458392D"
      values.relayers.1:
-        "0x9c0b0dbbae8a976ceea8c2a96f6d00c53839afdc"
+        "arb1:0x9c0B0dBBAe8a976CEeA8C2A96F6D00c53839afDC"
      values.verifier:
-        "0x3B6041173B80E77f038f3F2C0f9744f04837185e"
+        "arb1:0x3B6041173B80E77f038f3F2C0f9744f04837185e"
      implementationNames.0xA83ca7775Bc2889825BcDeDfFa5b758cf69e8794:
-        "ERC1967Proxy"
      implementationNames.0x46EbfC399d3913BB9b99E73675722417F9c5d416:
-        "SP1Blobstream"
      implementationNames.arb1:0xA83ca7775Bc2889825BcDeDfFa5b758cf69e8794:
+        "ERC1967Proxy"
      implementationNames.arb1:0x46EbfC399d3913BB9b99E73675722417F9c5d416:
+        "SP1Blobstream"
    }
```

```diff
+   Status: CREATED
    contract BlobstreamMultisig (0x738a9b55304f9fcF776B3BA285e50c0f9eF77997)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Blobstream (0xA83ca7775Bc2889825BcDeDfFa5b758cf69e8794)
    +++ description: The Blobstream DA bridge. This contract is used to bridge data commitments between Celestia and the destination chain. It specifies relayers that commit block ranges, but due to the lack of emitted events, there may be more relayers than are presented here.
```

Generated with discovered.json: 0x43e4baab4cd1130f98dca78ee531f2194f3c10ca

# Diff at Mon, 14 Jul 2025 13:11:48 GMT:

- chain: base
- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@9f4300dad2f3d080cd56fa311d4a848556c74e72 block: 32640167
- current block number: 32640167

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 32640167 (main branch discovery), not current.

```diff
    EOA  (0x0449689f2ce80fE45B32092e0d878ad87F0156a9) {
    +++ description: None
      address:
-        "0x0449689f2ce80fE45B32092e0d878ad87F0156a9"
+        "base:0x0449689f2ce80fE45B32092e0d878ad87F0156a9"
    }
```

```diff
    EOA  (0x1358eaCFE3a7F4FEB06c0Ae722072F134bcE7caf) {
    +++ description: None
      address:
-        "0x1358eaCFE3a7F4FEB06c0Ae722072F134bcE7caf"
+        "base:0x1358eaCFE3a7F4FEB06c0Ae722072F134bcE7caf"
    }
```

```diff
    EOA  (0x3243552F3BcbcE720Db6f5ad0C1B7cd15458392D) {
    +++ description: None
      address:
-        "0x3243552F3BcbcE720Db6f5ad0C1B7cd15458392D"
+        "base:0x3243552F3BcbcE720Db6f5ad0C1B7cd15458392D"
    }
```

```diff
    EOA  (0x45878fdF56B372D944c6Fc1865B7a65462f6D1b0) {
    +++ description: None
      address:
-        "0x45878fdF56B372D944c6Fc1865B7a65462f6D1b0"
+        "base:0x45878fdF56B372D944c6Fc1865B7a65462f6D1b0"
    }
```

```diff
    EOA  (0x4983A5ebE79c0570aa368cE84f281A8aAc50cE4d) {
    +++ description: None
      address:
-        "0x4983A5ebE79c0570aa368cE84f281A8aAc50cE4d"
+        "base:0x4983A5ebE79c0570aa368cE84f281A8aAc50cE4d"
    }
```

```diff
    contract BlobstreamMultisig (0x6ABa5D2084362038C9640a8851ff3b8BCbA81Ca6) {
    +++ description: None
      address:
-        "0x6ABa5D2084362038C9640a8851ff3b8BCbA81Ca6"
+        "base:0x6ABa5D2084362038C9640a8851ff3b8BCbA81Ca6"
      values.$implementation:
-        "0xfb1bffC9d739B8D520DaF37dF666da4C687191EA"
+        "base:0xfb1bffC9d739B8D520DaF37dF666da4C687191EA"
      values.$members.0:
-        "0x0449689f2ce80fE45B32092e0d878ad87F0156a9"
+        "base:0x0449689f2ce80fE45B32092e0d878ad87F0156a9"
      values.$members.1:
-        "0x793979789Ec179183E396e76c1e241bE0c9eE899"
+        "base:0x793979789Ec179183E396e76c1e241bE0c9eE899"
      values.$members.2:
-        "0x1358eaCFE3a7F4FEB06c0Ae722072F134bcE7caf"
+        "base:0x1358eaCFE3a7F4FEB06c0Ae722072F134bcE7caf"
      values.$members.3:
-        "0x45878fdF56B372D944c6Fc1865B7a65462f6D1b0"
+        "base:0x45878fdF56B372D944c6Fc1865B7a65462f6D1b0"
      values.$members.4:
-        "0x4983A5ebE79c0570aa368cE84f281A8aAc50cE4d"
+        "base:0x4983A5ebE79c0570aa368cE84f281A8aAc50cE4d"
      values.$members.5:
-        "0x91D456f83f4a117B07866fdEdC29306f7E974e15"
+        "base:0x91D456f83f4a117B07866fdEdC29306f7E974e15"
      implementationNames.0x6ABa5D2084362038C9640a8851ff3b8BCbA81Ca6:
-        "GnosisSafeProxy"
      implementationNames.0xfb1bffC9d739B8D520DaF37dF666da4C687191EA:
-        "GnosisSafeL2"
      implementationNames.base:0x6ABa5D2084362038C9640a8851ff3b8BCbA81Ca6:
+        "GnosisSafeProxy"
      implementationNames.base:0xfb1bffC9d739B8D520DaF37dF666da4C687191EA:
+        "GnosisSafeL2"
    }
```

```diff
    EOA  (0x793979789Ec179183E396e76c1e241bE0c9eE899) {
    +++ description: None
      address:
-        "0x793979789Ec179183E396e76c1e241bE0c9eE899"
+        "base:0x793979789Ec179183E396e76c1e241bE0c9eE899"
    }
```

```diff
    EOA  (0x91D456f83f4a117B07866fdEdC29306f7E974e15) {
    +++ description: None
      address:
-        "0x91D456f83f4a117B07866fdEdC29306f7E974e15"
+        "base:0x91D456f83f4a117B07866fdEdC29306f7E974e15"
    }
```

```diff
    EOA  (0x9c0B0dBBAe8a976CEeA8C2A96F6D00c53839afDC) {
    +++ description: None
      address:
-        "0x9c0B0dBBAe8a976CEeA8C2A96F6D00c53839afDC"
+        "base:0x9c0B0dBBAe8a976CEeA8C2A96F6D00c53839afDC"
    }
```

```diff
    contract Blobstream (0xA83ca7775Bc2889825BcDeDfFa5b758cf69e8794) {
    +++ description: The Blobstream DA bridge. This contract is used to bridge data commitments between Celestia and the destination chain. It specifies relayers that commit block ranges, but due to the lack of emitted events, there may be more relayers than are presented here.
      address:
-        "0xA83ca7775Bc2889825BcDeDfFa5b758cf69e8794"
+        "base:0xA83ca7775Bc2889825BcDeDfFa5b758cf69e8794"
      values.$admin.0:
-        "0x6ABa5D2084362038C9640a8851ff3b8BCbA81Ca6"
+        "base:0x6ABa5D2084362038C9640a8851ff3b8BCbA81Ca6"
      values.$implementation:
-        "0x46EbfC399d3913BB9b99E73675722417F9c5d416"
+        "base:0x46EbfC399d3913BB9b99E73675722417F9c5d416"
      values.$pastUpgrades.0.2.0:
-        "0x7C3A9b466FF5c02582fa32d4aD1b2Cb431fB7c9b"
+        "base:0x7C3A9b466FF5c02582fa32d4aD1b2Cb431fB7c9b"
      values.$pastUpgrades.1.2.0:
-        "0xfb19439fBa9f16aA720be6bE0e53465a9733C964"
+        "base:0xfb19439fBa9f16aA720be6bE0e53465a9733C964"
      values.$pastUpgrades.2.2.0:
-        "0x47fd660D5252Bd6F9D2c71507E46aa1d6e957c23"
+        "base:0x47fd660D5252Bd6F9D2c71507E46aa1d6e957c23"
      values.$pastUpgrades.3.2.0:
-        "0x46EbfC399d3913BB9b99E73675722417F9c5d416"
+        "base:0x46EbfC399d3913BB9b99E73675722417F9c5d416"
      values.accessControl.DEFAULT_ADMIN_ROLE.members.0:
-        "0x6ABa5D2084362038C9640a8851ff3b8BCbA81Ca6"
+        "base:0x6ABa5D2084362038C9640a8851ff3b8BCbA81Ca6"
      values.accessControl.TIMELOCK_ROLE.members.0:
-        "0x6ABa5D2084362038C9640a8851ff3b8BCbA81Ca6"
+        "base:0x6ABa5D2084362038C9640a8851ff3b8BCbA81Ca6"
      values.accessControl.GUARDIAN_ROLE.members.0:
-        "0x6ABa5D2084362038C9640a8851ff3b8BCbA81Ca6"
+        "base:0x6ABa5D2084362038C9640a8851ff3b8BCbA81Ca6"
      values.guardians.0:
-        "0x6ABa5D2084362038C9640a8851ff3b8BCbA81Ca6"
+        "base:0x6ABa5D2084362038C9640a8851ff3b8BCbA81Ca6"
      values.relayers.0:
-        "0x3243552f3bcbce720db6f5ad0c1b7cd15458392d"
+        "base:0x3243552F3BcbcE720Db6f5ad0C1B7cd15458392D"
      values.relayers.1:
-        "0x9c0b0dbbae8a976ceea8c2a96f6d00c53839afdc"
+        "base:0x9c0B0dBBAe8a976CEeA8C2A96F6D00c53839afDC"
      values.verifier:
-        "0x3B6041173B80E77f038f3F2C0f9744f04837185e"
+        "base:0x3B6041173B80E77f038f3F2C0f9744f04837185e"
      implementationNames.0xA83ca7775Bc2889825BcDeDfFa5b758cf69e8794:
-        "ERC1967Proxy"
      implementationNames.0x46EbfC399d3913BB9b99E73675722417F9c5d416:
-        "SP1Blobstream"
      implementationNames.base:0xA83ca7775Bc2889825BcDeDfFa5b758cf69e8794:
+        "ERC1967Proxy"
      implementationNames.base:0x46EbfC399d3913BB9b99E73675722417F9c5d416:
+        "SP1Blobstream"
    }
```

```diff
+   Status: CREATED
    contract BlobstreamMultisig (0x6ABa5D2084362038C9640a8851ff3b8BCbA81Ca6)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Blobstream (0xA83ca7775Bc2889825BcDeDfFa5b758cf69e8794)
    +++ description: The Blobstream DA bridge. This contract is used to bridge data commitments between Celestia and the destination chain. It specifies relayers that commit block ranges, but due to the lack of emitted events, there may be more relayers than are presented here.
```

Generated with discovered.json: 0x86e04d0f154d1a3fed8857314ba4feb9a7679626

# Diff at Wed, 09 Jul 2025 15:10:15 GMT:

- chain: ethereum
- author: Sergey Shemyakov (<sergey.shemyakov@l2beat.com>)
- comparing to: main@b0f260a09a1907b9753f327752a82a61cb1f520e block: 22780026
- current block number: 22882089

## Description

Moved SP1 verifier into shared module.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22780026 (main branch discovery), not current.

```diff
-   Status: DELETED
    contract SP1Verifier (0x0459d576A6223fEeA177Fb3DF53C9c77BF84C459)
    +++ description: Verifier contract for SP1 proofs (v5.0.0).
```

```diff
-   Status: DELETED
    contract SP1VerifierGateway (0x3B6041173B80E77f038f3F2C0f9744f04837185e)
    +++ description: This contract is the router for zk proof verification. It stores the mapping between identifiers and the address of onchain verifier contracts, routing each identifier to the corresponding verifier contract.
```

```diff
-   Status: DELETED
    contract SP1VerifierGatewayMultisig (0xCafEf00d348Adbd57c37d1B77e0619C6244C6878)
    +++ description: None
```

Generated with discovered.json: 0x0373f823e23888e4d7442a0deacdbab5dbd61cfd

# Diff at Wed, 09 Jul 2025 15:10:14 GMT:

- chain: arbitrum
- author: Sergey Shemyakov (<sergey.shemyakov@l2beat.com>)
- comparing to: main@b0f260a09a1907b9753f327752a82a61cb1f520e block: 350984309
- current block number: 355902087

## Description

Moved SP1 verifier into shared module.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 350984309 (main branch discovery), not current.

```diff
-   Status: DELETED
    contract SP1Verifier (0x0459d576A6223fEeA177Fb3DF53C9c77BF84C459)
    +++ description: Verifier contract for SP1 proofs (v5.0.0).
```

```diff
-   Status: DELETED
    contract SP1VerifierGateway (0x3B6041173B80E77f038f3F2C0f9744f04837185e)
    +++ description: This contract is the router for zk proof verification. It stores the mapping between identifiers and the address of onchain verifier contracts, routing each identifier to the corresponding verifier contract.
```

```diff
-   Status: DELETED
    contract SP1VerifierGatewayMultisig (0xCafEf00d348Adbd57c37d1B77e0619C6244C6878)
    +++ description: None
```

Generated with discovered.json: 0x6f436f97d7d078850e7e8e1550d9a94cbab13314

# Diff at Wed, 09 Jul 2025 15:10:14 GMT:

- chain: base
- author: Sergey Shemyakov (<sergey.shemyakov@l2beat.com>)
- comparing to: main@b0f260a09a1907b9753f327752a82a61cb1f520e block: 32023954
- current block number: 32640167

## Description

Moved SP1 verifier into shared module.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 32023954 (main branch discovery), not current.

```diff
-   Status: DELETED
    contract SP1Verifier (0x0459d576A6223fEeA177Fb3DF53C9c77BF84C459)
    +++ description: Verifier contract for SP1 proofs (v5.0.0).
```

```diff
-   Status: DELETED
    contract SP1VerifierGateway (0x3B6041173B80E77f038f3F2C0f9744f04837185e)
    +++ description: This contract is the router for zk proof verification. It stores the mapping between identifiers and the address of onchain verifier contracts, routing each identifier to the corresponding verifier contract.
```

```diff
-   Status: DELETED
    contract SP1VerifierGatewayMultisig (0xCafEf00d348Adbd57c37d1B77e0619C6244C6878)
    +++ description: None
```

Generated with discovered.json: 0xde10e28cf1f424ab44461783e9831f0b003510f4

# Diff at Fri, 04 Jul 2025 12:18:55 GMT:

- chain: ethereum
- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@1f56dc47fe915564d4555300304da4d3bcbc087f block: 22780026
- current block number: 22780026

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22780026 (main branch discovery), not current.

```diff
    EOA  (0x3243552F3BcbcE720Db6f5ad0C1B7cd15458392D) {
    +++ description: None
      receivedPermissions.0.from:
-        "ethereum:0x7Cf3876F681Dbb6EdA8f6FfC45D66B996Df08fAe"
+        "eth:0x7Cf3876F681Dbb6EdA8f6FfC45D66B996Df08fAe"
    }
```

```diff
    contract BlobstreamMultisig (0x8bF34D8df1eF0A8A7f27fC587202848E528018E6) {
    +++ description: None
      receivedPermissions.0.from:
-        "ethereum:0x7Cf3876F681Dbb6EdA8f6FfC45D66B996Df08fAe"
+        "eth:0x7Cf3876F681Dbb6EdA8f6FfC45D66B996Df08fAe"
      receivedPermissions.1.from:
-        "ethereum:0x7Cf3876F681Dbb6EdA8f6FfC45D66B996Df08fAe"
+        "eth:0x7Cf3876F681Dbb6EdA8f6FfC45D66B996Df08fAe"
    }
```

```diff
    EOA  (0x9c0B0dBBAe8a976CEeA8C2A96F6D00c53839afDC) {
    +++ description: None
      receivedPermissions.0.from:
-        "ethereum:0x7Cf3876F681Dbb6EdA8f6FfC45D66B996Df08fAe"
+        "eth:0x7Cf3876F681Dbb6EdA8f6FfC45D66B996Df08fAe"
    }
```

```diff
    contract SP1VerifierGatewayMultisig (0xCafEf00d348Adbd57c37d1B77e0619C6244C6878) {
    +++ description: None
      receivedPermissions.0.from:
-        "ethereum:0x3B6041173B80E77f038f3F2C0f9744f04837185e"
+        "eth:0x3B6041173B80E77f038f3F2C0f9744f04837185e"
    }
```

Generated with discovered.json: 0xe1cd4082f74299474fee25d08a6085797aa6e0b5

# Diff at Fri, 04 Jul 2025 12:18:54 GMT:

- chain: arbitrum
- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@1f56dc47fe915564d4555300304da4d3bcbc087f block: 350984309
- current block number: 350984309

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 350984309 (main branch discovery), not current.

```diff
    EOA  (0x3243552F3BcbcE720Db6f5ad0C1B7cd15458392D) {
    +++ description: None
      receivedPermissions.0.from:
-        "arbitrum:0xA83ca7775Bc2889825BcDeDfFa5b758cf69e8794"
+        "arb1:0xA83ca7775Bc2889825BcDeDfFa5b758cf69e8794"
    }
```

```diff
    contract BlobstreamMultisig (0x738a9b55304f9fcF776B3BA285e50c0f9eF77997) {
    +++ description: None
      receivedPermissions.0.from:
-        "arbitrum:0xA83ca7775Bc2889825BcDeDfFa5b758cf69e8794"
+        "arb1:0xA83ca7775Bc2889825BcDeDfFa5b758cf69e8794"
      receivedPermissions.1.from:
-        "arbitrum:0xA83ca7775Bc2889825BcDeDfFa5b758cf69e8794"
+        "arb1:0xA83ca7775Bc2889825BcDeDfFa5b758cf69e8794"
    }
```

```diff
    EOA  (0x9c0B0dBBAe8a976CEeA8C2A96F6D00c53839afDC) {
    +++ description: None
      receivedPermissions.0.from:
-        "arbitrum:0xA83ca7775Bc2889825BcDeDfFa5b758cf69e8794"
+        "arb1:0xA83ca7775Bc2889825BcDeDfFa5b758cf69e8794"
    }
```

```diff
    contract SP1VerifierGatewayMultisig (0xCafEf00d348Adbd57c37d1B77e0619C6244C6878) {
    +++ description: None
      receivedPermissions.0.from:
-        "arbitrum:0x3B6041173B80E77f038f3F2C0f9744f04837185e"
+        "arb1:0x3B6041173B80E77f038f3F2C0f9744f04837185e"
    }
```

Generated with discovered.json: 0xf35068e1878a8e1d02de94675d64c3bd6ff1b501

# Diff at Wed, 25 Jun 2025 07:41:07 GMT:

- chain: base
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@4bade41aedf0f9269688f2c05f04d2992bb2ca38 block: 31127629
- current block number: 32023954

## Description

selector 0x1b34fe11 and respective verifier frozen.

## Watched changes

```diff
    contract SP1VerifierGateway (0x3B6041173B80E77f038f3F2C0f9744f04837185e) {
    +++ description: This contract is the router for zk proof verification. It stores the mapping between identifiers and the address of onchain verifier contracts, routing each identifier to the corresponding verifier contract.
+++ description: Verifiers that are routed to by their selector and not frozen.
      values.activeVerifiers.1:
-        {"selector":"0x1b34fe11","verifier":"0xE00a3cBFC45241b33c0A44C78e26168CBc55EC63"}
    }
```

```diff
-   Status: DELETED
    contract SP1Verifier (0xE00a3cBFC45241b33c0A44C78e26168CBc55EC63)
    +++ description: Verifier contract for SP1 proofs (v4.0.0-rc.3).
```

## Source code changes

```diff
.../dev/null                                       | 1432 --------------------
 .../SP1Verifier.sol}                               |    0
 2 files changed, 1432 deletions(-)
```

Generated with discovered.json: 0xb11ea8257080c573c50952b25dd02df3c3235b2b

# Diff at Wed, 25 Jun 2025 07:41:07 GMT:

- chain: ethereum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@4bade41aedf0f9269688f2c05f04d2992bb2ca38 block: 22643968
- current block number: 22780026

## Description

selector 0x1b34fe11 and respective verifier frozen.

## Watched changes

```diff
    contract SP1VerifierGateway (0x3B6041173B80E77f038f3F2C0f9744f04837185e) {
    +++ description: This contract is the router for zk proof verification. It stores the mapping between identifiers and the address of onchain verifier contracts, routing each identifier to the corresponding verifier contract.
+++ description: Verifiers that are routed to by their selector and not frozen.
      values.activeVerifiers.1:
-        {"selector":"0x1b34fe11","verifier":"0xE00a3cBFC45241b33c0A44C78e26168CBc55EC63"}
    }
```

```diff
-   Status: DELETED
    contract SP1Verifier (0xE00a3cBFC45241b33c0A44C78e26168CBc55EC63)
    +++ description: Verifier contract for SP1 proofs (v4.0.0-rc.3).
```

## Source code changes

```diff
.../dev/null                                       | 1432 --------------------
 .../SP1Verifier.sol}                               |    0
 2 files changed, 1432 deletions(-)
```

Generated with discovered.json: 0x6e2d453d59ab1b3e859f5745dac4dc5da3942180

# Diff at Wed, 25 Jun 2025 07:41:06 GMT:

- chain: arbitrum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@4bade41aedf0f9269688f2c05f04d2992bb2ca38 block: 343837105
- current block number: 350984309

## Description

selector 0x1b34fe11 and respective verifier frozen.

## Watched changes

```diff
    contract SP1VerifierGateway (0x3B6041173B80E77f038f3F2C0f9744f04837185e) {
    +++ description: This contract is the router for zk proof verification. It stores the mapping between identifiers and the address of onchain verifier contracts, routing each identifier to the corresponding verifier contract.
+++ description: Verifiers that are routed to by their selector and not frozen.
      values.activeVerifiers.1:
-        {"selector":"0x1b34fe11","verifier":"0xE00a3cBFC45241b33c0A44C78e26168CBc55EC63"}
    }
```

```diff
-   Status: DELETED
    contract SP1Verifier (0xE00a3cBFC45241b33c0A44C78e26168CBc55EC63)
    +++ description: Verifier contract for SP1 proofs (v4.0.0-rc.3).
```

## Source code changes

```diff
.../dev/null                                       | 1432 --------------------
 .../SP1Verifier.sol}                               |    0
 2 files changed, 1432 deletions(-)
```

Generated with discovered.json: 0x6576e88c1677d495e1b17865a0b23472b63b5368

# Diff at Fri, 06 Jun 2025 07:24:48 GMT:

- chain: arbitrum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@1eba1823c240619119cd080ff8cbb757c1c3feda block: 343837105
- current block number: 343837105

## Description

config: make sp1 gateway template more dynamic.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 343837105 (main branch discovery), not current.

```diff
    contract SP1Verifier (0x0459d576A6223fEeA177Fb3DF53C9c77BF84C459) {
    +++ description: Verifier contract for SP1 proofs (v5.0.0).
      description:
-        "Verifier contract for SP1 proofs."
+        "Verifier contract for SP1 proofs (v5.0.0)."
    }
```

```diff
    contract SP1VerifierGateway (0x3B6041173B80E77f038f3F2C0f9744f04837185e) {
    +++ description: This contract is the router for zk proof verification. It stores the mapping between identifiers and the address of onchain verifier contracts, routing each identifier to the corresponding verifier contract.
      values.oldVerifier:
-        {"verifier":"0xc350F063C13a3Ca21331610fe159E697a5c9c2FB","frozen":true}
      values.oldVerifier2:
-        {"verifier":"0x6B6A7Ded061567d8A56279801DEA5cFB79be5bFc","frozen":true}
      values.oldVerifier3:
-        {"prover":"0x6A87EFd4e6B2Db1ed73129A8b9c51aaA583d49e3","frozen":true}
      values.oldVerifier4:
-        {"verifier":"0x1764C29FBd94865198588f10FC75D4f6636d158d","frozen":true}
      values.oldVerifier5:
-        {"prover":"0xd2832Cf1fC8bA210FfABF62Db9A8781153131d16","frozen":true}
      values.oldVerifier6:
-        {"prover":"0xE00a3cBFC45241b33c0A44C78e26168CBc55EC63","frozen":false}
      values.verifier:
-        {"prover":"0x0459d576A6223fEeA177Fb3DF53C9c77BF84C459","frozen":false}
+++ description: Verifiers that are routed to by their selector and not frozen.
      values.activeVerifiers:
+        [{"selector":"0x1b34fe11","verifier":"0xE00a3cBFC45241b33c0A44C78e26168CBc55EC63"},{"selector":"0xd4e8ecd2","verifier":"0x0459d576A6223fEeA177Fb3DF53C9c77BF84C459"}]
+++ description: All verifiers that were ever routed to by this gateway.
      values.allVerifiers:
+        [{"selector":"0x8c5bc5e4","verifier":"0x331b350dDA287d0A65ce43103984CD44cb4Da9f0"},{"selector":"0x801c66ac","verifier":"0xfE2bb0Ad7F2c44Bd1289234Af08aD6FDEC0d54a2"},{"selector":"0xfedc1fcc","verifier":"0x36B353776AF6EF3A2bD707049e783F52c4209017"},{"selector":"0xc430ff7f","verifier":"0xc350F063C13a3Ca21331610fe159E697a5c9c2FB"},{"selector":"0xc865c1b6","verifier":"0x6B6A7Ded061567d8A56279801DEA5cFB79be5bFc"},{"selector":"0x4aca240a","verifier":"0x1764C29FBd94865198588f10FC75D4f6636d158d"},{"selector":"0x09069090","verifier":"0x6A87EFd4e6B2Db1ed73129A8b9c51aaA583d49e3"},{"selector":"0x54bdcae3","verifier":"0xd2832Cf1fC8bA210FfABF62Db9A8781153131d16"},{"selector":"0x1b34fe11","verifier":"0xE00a3cBFC45241b33c0A44C78e26168CBc55EC63"},{"selector":"0xd4e8ecd2","verifier":"0x0459d576A6223fEeA177Fb3DF53C9c77BF84C459"}]
      fieldMeta.oldVerifier:
-        {"description":"The verifier contract address for SP1, and whether it is frozen (true if frozen). This verifier route was frozen on 2024-09-04."}
      fieldMeta.oldVerifier2:
-        {"description":"The verifier contract address for SP1, and whether it is frozen (true if frozen). This prover route was frozen on 2024-09-21."}
      fieldMeta.oldVerifier3:
-        {"description":"The verifier contract address for SP1, and whether it is frozen (true if frozen). This prover route was frozen on 2024-11-01."}
      fieldMeta.oldVerifier4:
-        {"description":"The verifier contract address for SP1, and whether it is frozen (true if frozen). This prover route was frozen on 2024-11-08."}
      fieldMeta.oldVerifier5:
-        {"description":"The prover contract address for SP1, and whether it is frozen (true if frozen). This prover route was frozen on 2025-01-15."}
      fieldMeta.oldVerifier6:
-        {"description":"The prover contract address for SP1, and whether it is frozen (true if frozen)."}
      fieldMeta.verifier:
-        {"description":"The prover contract address for SP1, and whether it is frozen (true if frozen)."}
      fieldMeta.activeVerifiers:
+        {"description":"Verifiers that are routed to by their selector and not frozen."}
      fieldMeta.allVerifiers:
+        {"description":"All verifiers that were ever routed to by this gateway."}
    }
```

```diff
    contract SP1VerifierGatewayMultisig (0xCafEf00d348Adbd57c37d1B77e0619C6244C6878) {
    +++ description: None
      receivedPermissions.0.description:
-        "holds the power to affect the liveness and safety of the gateway - can transfer ownership, add and freeze verifier routes."
+        "affect the liveness and safety of the gateway - can transfer ownership, add and freeze verifier routes."
    }
```

```diff
+   Status: CREATED
    contract SP1Verifier (0xE00a3cBFC45241b33c0A44C78e26168CBc55EC63)
    +++ description: Verifier contract for SP1 proofs (v4.0.0-rc.3).
```

Generated with discovered.json: 0x9f9a70e7390c62681a4f2d0d33be357dfe856756

# Diff at Fri, 06 Jun 2025 07:24:48 GMT:

- chain: base
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@1eba1823c240619119cd080ff8cbb757c1c3feda block: 31127629
- current block number: 31127629

## Description

config: make sp1 gateway template more dynamic.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 31127629 (main branch discovery), not current.

```diff
    contract SP1Verifier (0x0459d576A6223fEeA177Fb3DF53C9c77BF84C459) {
    +++ description: Verifier contract for SP1 proofs (v5.0.0).
      description:
-        "Verifier contract for SP1 proofs."
+        "Verifier contract for SP1 proofs (v5.0.0)."
    }
```

```diff
    contract SP1VerifierGateway (0x3B6041173B80E77f038f3F2C0f9744f04837185e) {
    +++ description: This contract is the router for zk proof verification. It stores the mapping between identifiers and the address of onchain verifier contracts, routing each identifier to the corresponding verifier contract.
      values.oldVerifier:
-        {"verifier":"0xc350F063C13a3Ca21331610fe159E697a5c9c2FB","frozen":true}
      values.oldVerifier2:
-        {"verifier":"0x6B6A7Ded061567d8A56279801DEA5cFB79be5bFc","frozen":true}
      values.oldVerifier3:
-        {"prover":"0x6A87EFd4e6B2Db1ed73129A8b9c51aaA583d49e3","frozen":true}
      values.oldVerifier4:
-        {"verifier":"0x1764C29FBd94865198588f10FC75D4f6636d158d","frozen":true}
      values.oldVerifier5:
-        {"prover":"0xd2832Cf1fC8bA210FfABF62Db9A8781153131d16","frozen":true}
      values.oldVerifier6:
-        {"prover":"0xE00a3cBFC45241b33c0A44C78e26168CBc55EC63","frozen":false}
      values.verifier:
-        {"prover":"0x0459d576A6223fEeA177Fb3DF53C9c77BF84C459","frozen":false}
+++ description: Verifiers that are routed to by their selector and not frozen.
      values.activeVerifiers:
+        [{"selector":"0x1b34fe11","verifier":"0xE00a3cBFC45241b33c0A44C78e26168CBc55EC63"},{"selector":"0xd4e8ecd2","verifier":"0x0459d576A6223fEeA177Fb3DF53C9c77BF84C459"}]
+++ description: All verifiers that were ever routed to by this gateway.
      values.allVerifiers:
+        [{"selector":"0x8c5bc5e4","verifier":"0x331b350dDA287d0A65ce43103984CD44cb4Da9f0"},{"selector":"0x801c66ac","verifier":"0xfE2bb0Ad7F2c44Bd1289234Af08aD6FDEC0d54a2"},{"selector":"0xfedc1fcc","verifier":"0x36B353776AF6EF3A2bD707049e783F52c4209017"},{"selector":"0xc430ff7f","verifier":"0xc350F063C13a3Ca21331610fe159E697a5c9c2FB"},{"selector":"0xc865c1b6","verifier":"0x6B6A7Ded061567d8A56279801DEA5cFB79be5bFc"},{"selector":"0x4aca240a","verifier":"0x1764C29FBd94865198588f10FC75D4f6636d158d"},{"selector":"0x09069090","verifier":"0x6A87EFd4e6B2Db1ed73129A8b9c51aaA583d49e3"},{"selector":"0x54bdcae3","verifier":"0xd2832Cf1fC8bA210FfABF62Db9A8781153131d16"},{"selector":"0x1b34fe11","verifier":"0xE00a3cBFC45241b33c0A44C78e26168CBc55EC63"},{"selector":"0xd4e8ecd2","verifier":"0x0459d576A6223fEeA177Fb3DF53C9c77BF84C459"}]
      fieldMeta.oldVerifier:
-        {"description":"The verifier contract address for SP1, and whether it is frozen (true if frozen). This verifier route was frozen on 2024-09-04."}
      fieldMeta.oldVerifier2:
-        {"description":"The verifier contract address for SP1, and whether it is frozen (true if frozen). This prover route was frozen on 2024-09-21."}
      fieldMeta.oldVerifier3:
-        {"description":"The verifier contract address for SP1, and whether it is frozen (true if frozen). This prover route was frozen on 2024-11-01."}
      fieldMeta.oldVerifier4:
-        {"description":"The verifier contract address for SP1, and whether it is frozen (true if frozen). This prover route was frozen on 2024-11-08."}
      fieldMeta.oldVerifier5:
-        {"description":"The prover contract address for SP1, and whether it is frozen (true if frozen). This prover route was frozen on 2025-01-15."}
      fieldMeta.oldVerifier6:
-        {"description":"The prover contract address for SP1, and whether it is frozen (true if frozen)."}
      fieldMeta.verifier:
-        {"description":"The prover contract address for SP1, and whether it is frozen (true if frozen)."}
      fieldMeta.activeVerifiers:
+        {"description":"Verifiers that are routed to by their selector and not frozen."}
      fieldMeta.allVerifiers:
+        {"description":"All verifiers that were ever routed to by this gateway."}
    }
```

```diff
    contract SP1VerifierGatewayMultisig (0xCafEf00d348Adbd57c37d1B77e0619C6244C6878) {
    +++ description: None
      receivedPermissions.0.description:
-        "holds the power to affect the liveness and safety of the gateway - can transfer ownership, add and freeze verifier routes."
+        "affect the liveness and safety of the gateway - can transfer ownership, add and freeze verifier routes."
    }
```

```diff
+   Status: CREATED
    contract SP1Verifier (0xE00a3cBFC45241b33c0A44C78e26168CBc55EC63)
    +++ description: Verifier contract for SP1 proofs (v4.0.0-rc.3).
```

Generated with discovered.json: 0x37bae0bc8227eff9851f00de4d6fb05d039d364c

# Diff at Fri, 06 Jun 2025 07:24:48 GMT:

- chain: ethereum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@1eba1823c240619119cd080ff8cbb757c1c3feda block: 22631643
- current block number: 22643968

## Description

config: make sp1 gateway template more dynamic.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22631643 (main branch discovery), not current.

```diff
    contract SP1Verifier (0x0459d576A6223fEeA177Fb3DF53C9c77BF84C459) {
    +++ description: Verifier contract for SP1 proofs (v5.0.0).
      description:
-        "Verifier contract for SP1 proofs."
+        "Verifier contract for SP1 proofs (v5.0.0)."
    }
```

```diff
    contract SP1VerifierGateway (0x3B6041173B80E77f038f3F2C0f9744f04837185e) {
    +++ description: This contract is the router for zk proof verification. It stores the mapping between identifiers and the address of onchain verifier contracts, routing each identifier to the corresponding verifier contract.
      values.oldVerifier:
-        {"verifier":"0xc350F063C13a3Ca21331610fe159E697a5c9c2FB","frozen":true}
      values.oldVerifier2:
-        {"verifier":"0x6B6A7Ded061567d8A56279801DEA5cFB79be5bFc","frozen":true}
      values.oldVerifier3:
-        {"prover":"0x6A87EFd4e6B2Db1ed73129A8b9c51aaA583d49e3","frozen":true}
      values.oldVerifier4:
-        {"verifier":"0x1764C29FBd94865198588f10FC75D4f6636d158d","frozen":true}
      values.oldVerifier5:
-        {"prover":"0xd2832Cf1fC8bA210FfABF62Db9A8781153131d16","frozen":true}
      values.oldVerifier6:
-        {"prover":"0xE00a3cBFC45241b33c0A44C78e26168CBc55EC63","frozen":false}
      values.verifier:
-        {"prover":"0x0459d576A6223fEeA177Fb3DF53C9c77BF84C459","frozen":false}
+++ description: Verifiers that are routed to by their selector and not frozen.
      values.activeVerifiers:
+        [{"selector":"0xd4e8ecd2","verifier":"0x0459d576A6223fEeA177Fb3DF53C9c77BF84C459"},{"selector":"0x1b34fe11","verifier":"0xE00a3cBFC45241b33c0A44C78e26168CBc55EC63"}]
+++ description: All verifiers that were ever routed to by this gateway.
      values.allVerifiers:
+        [{"selector":"0x801c66ac","verifier":"0xfE2bb0Ad7F2c44Bd1289234Af08aD6FDEC0d54a2"},{"selector":"0x54bdcae3","verifier":"0xd2832Cf1fC8bA210FfABF62Db9A8781153131d16"},{"selector":"0xc865c1b6","verifier":"0x6B6A7Ded061567d8A56279801DEA5cFB79be5bFc"},{"selector":"0xd4e8ecd2","verifier":"0x0459d576A6223fEeA177Fb3DF53C9c77BF84C459"},{"selector":"0x09069090","verifier":"0x6A87EFd4e6B2Db1ed73129A8b9c51aaA583d49e3"},{"selector":"0x1b34fe11","verifier":"0xE00a3cBFC45241b33c0A44C78e26168CBc55EC63"},{"selector":"0xc430ff7f","verifier":"0xc350F063C13a3Ca21331610fe159E697a5c9c2FB"},{"selector":"0xfedc1fcc","verifier":"0x36B353776AF6EF3A2bD707049e783F52c4209017"},{"selector":"0x4aca240a","verifier":"0x1764C29FBd94865198588f10FC75D4f6636d158d"},{"selector":"0x8c5bc5e4","verifier":"0x331b350dDA287d0A65ce43103984CD44cb4Da9f0"}]
      fieldMeta.oldVerifier:
-        {"description":"The verifier contract address for SP1, and whether it is frozen (true if frozen). This verifier route was frozen on 2024-09-04."}
      fieldMeta.oldVerifier2:
-        {"description":"The verifier contract address for SP1, and whether it is frozen (true if frozen). This prover route was frozen on 2024-09-21."}
      fieldMeta.oldVerifier3:
-        {"description":"The verifier contract address for SP1, and whether it is frozen (true if frozen). This prover route was frozen on 2024-11-01."}
      fieldMeta.oldVerifier4:
-        {"description":"The verifier contract address for SP1, and whether it is frozen (true if frozen). This prover route was frozen on 2024-11-08."}
      fieldMeta.oldVerifier5:
-        {"description":"The prover contract address for SP1, and whether it is frozen (true if frozen). This prover route was frozen on 2025-01-15."}
      fieldMeta.oldVerifier6:
-        {"description":"The prover contract address for SP1, and whether it is frozen (true if frozen)."}
      fieldMeta.verifier:
-        {"description":"The prover contract address for SP1, and whether it is frozen (true if frozen)."}
      fieldMeta.activeVerifiers:
+        {"description":"Verifiers that are routed to by their selector and not frozen."}
      fieldMeta.allVerifiers:
+        {"description":"All verifiers that were ever routed to by this gateway."}
    }
```

```diff
    contract SP1VerifierGatewayMultisig (0xCafEf00d348Adbd57c37d1B77e0619C6244C6878) {
    +++ description: None
      receivedPermissions.0.description:
-        "holds the power to affect the liveness and safety of the gateway - can transfer ownership, add and freeze verifier routes."
+        "affect the liveness and safety of the gateway - can transfer ownership, add and freeze verifier routes."
    }
```

```diff
+   Status: CREATED
    contract SP1Verifier (0xE00a3cBFC45241b33c0A44C78e26168CBc55EC63)
    +++ description: Verifier contract for SP1 proofs (v4.0.0-rc.3).
```

Generated with discovered.json: 0x8fb0280a6b328feb10d4ec051d6a8f6d22ab0747

# Diff at Wed, 04 Jun 2025 13:45:01 GMT:

- chain: arbitrum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@243ef5b7e32e78ae0ff8985c4f129996d0c48c80 block: 325165450
- current block number: 343837105

## Description

programVKey changed. v5 verifier is now used (post plonky3 vulnerability).

## Watched changes

```diff
    contract SP1VerifierGateway (0x3B6041173B80E77f038f3F2C0f9744f04837185e) {
    +++ description: This contract is the router for zk proof verification. It stores the mapping between identifiers and the address of onchain verifier contracts, routing each identifier to the corresponding verifier contract.
      values.verifier.prover:
-        "0x0000000000000000000000000000000000000000"
+        "0x0459d576A6223fEeA177Fb3DF53C9c77BF84C459"
    }
```

```diff
    contract Blobstream (0xA83ca7775Bc2889825BcDeDfFa5b758cf69e8794) {
    +++ description: The Blobstream DA bridge. This contract is used to bridge data commitments between Celestia and the destination chain. It specifies relayers that commit block ranges, but due to the lack of emitted events, there may be more relayers than are presented here.
      values.blobstreamProgramVkey:
-        "0x00eaf7d396acac046b54bc8d5ba17d3f1c7374d7158ac01c76dfeca6103163eb"
+        "0x00de39c136b88dfeacb832629e21a9667935bc0e74aaa21292e4f237d79d0bef"
    }
```

```diff
+   Status: CREATED
    contract SP1Verifier (0x0459d576A6223fEeA177Fb3DF53C9c77BF84C459)
    +++ description: Verifier contract for SP1 proofs.
```

## Source code changes

```diff
.../blobstream/arbitrum/.flat/SP1Verifier.sol      | 1396 ++++++++++++++++++++
 1 file changed, 1396 insertions(+)
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 325165450 (main branch discovery), not current.

```diff
    contract SP1VerifierGateway (0x3B6041173B80E77f038f3F2C0f9744f04837185e) {
    +++ description: This contract is the router for zk proof verification. It stores the mapping between identifiers and the address of onchain verifier contracts, routing each identifier to the corresponding verifier contract.
      values.verifier.prover:
-        "0xE00a3cBFC45241b33c0A44C78e26168CBc55EC63"
+        "0x0000000000000000000000000000000000000000"
+++ description: The prover contract address for SP1, and whether it is frozen (true if frozen).
      values.oldVerifier6:
+        {"prover":"0xE00a3cBFC45241b33c0A44C78e26168CBc55EC63","frozen":false}
      fieldMeta.oldVerifier6:
+        {"description":"The prover contract address for SP1, and whether it is frozen (true if frozen)."}
    }
```

```diff
-   Status: DELETED
    contract SP1Verifier (0xE00a3cBFC45241b33c0A44C78e26168CBc55EC63)
    +++ description: Verifier contract for SP1 proofs.
```

Generated with discovered.json: 0x573ba4bfb7fa2c2db9f9c8ed9423b8ef1c9053c5

# Diff at Wed, 04 Jun 2025 13:45:01 GMT:

- chain: base
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@243ef5b7e32e78ae0ff8985c4f129996d0c48c80 block: 28782173
- current block number: 31127629

## Description

programVKey changed. v5 verifier is now used (post plonky3 vulnerability).

## Watched changes

```diff
    contract SP1VerifierGateway (0x3B6041173B80E77f038f3F2C0f9744f04837185e) {
    +++ description: This contract is the router for zk proof verification. It stores the mapping between identifiers and the address of onchain verifier contracts, routing each identifier to the corresponding verifier contract.
      values.verifier.prover:
-        "0x0000000000000000000000000000000000000000"
+        "0x0459d576A6223fEeA177Fb3DF53C9c77BF84C459"
    }
```

```diff
    contract Blobstream (0xA83ca7775Bc2889825BcDeDfFa5b758cf69e8794) {
    +++ description: The Blobstream DA bridge. This contract is used to bridge data commitments between Celestia and the destination chain. It specifies relayers that commit block ranges, but due to the lack of emitted events, there may be more relayers than are presented here.
      values.blobstreamProgramVkey:
-        "0x00eaf7d396acac046b54bc8d5ba17d3f1c7374d7158ac01c76dfeca6103163eb"
+        "0x00de39c136b88dfeacb832629e21a9667935bc0e74aaa21292e4f237d79d0bef"
    }
```

```diff
+   Status: CREATED
    contract SP1Verifier (0x0459d576A6223fEeA177Fb3DF53C9c77BF84C459)
    +++ description: Verifier contract for SP1 proofs.
```

## Source code changes

```diff
.../projects/blobstream/base/.flat/SP1Verifier.sol | 1396 ++++++++++++++++++++
 1 file changed, 1396 insertions(+)
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 28782173 (main branch discovery), not current.

```diff
    contract SP1VerifierGateway (0x3B6041173B80E77f038f3F2C0f9744f04837185e) {
    +++ description: This contract is the router for zk proof verification. It stores the mapping between identifiers and the address of onchain verifier contracts, routing each identifier to the corresponding verifier contract.
      values.verifier.prover:
-        "0xE00a3cBFC45241b33c0A44C78e26168CBc55EC63"
+        "0x0000000000000000000000000000000000000000"
+++ description: The prover contract address for SP1, and whether it is frozen (true if frozen).
      values.oldVerifier6:
+        {"prover":"0xE00a3cBFC45241b33c0A44C78e26168CBc55EC63","frozen":false}
      fieldMeta.oldVerifier6:
+        {"description":"The prover contract address for SP1, and whether it is frozen (true if frozen)."}
    }
```

```diff
-   Status: DELETED
    contract SP1Verifier (0xE00a3cBFC45241b33c0A44C78e26168CBc55EC63)
    +++ description: Verifier contract for SP1 proofs.
```

Generated with discovered.json: 0xbb6425d551336540c8458bee2f7182fc13e54989

# Diff at Wed, 04 Jun 2025 13:45:01 GMT:

- chain: ethereum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@243ef5b7e32e78ae0ff8985c4f129996d0c48c80 block: 22243970
- current block number: 22631643

## Description

programVKey changed. v5 verifier is now used (post plonky3 vulnerability).

## Watched changes

```diff
    contract SP1VerifierGateway (0x3B6041173B80E77f038f3F2C0f9744f04837185e) {
    +++ description: This contract is the router for zk proof verification. It stores the mapping between identifiers and the address of onchain verifier contracts, routing each identifier to the corresponding verifier contract.
      values.verifier.prover:
-        "0x0000000000000000000000000000000000000000"
+        "0x0459d576A6223fEeA177Fb3DF53C9c77BF84C459"
    }
```

```diff
    contract Blobstream (0x7Cf3876F681Dbb6EdA8f6FfC45D66B996Df08fAe) {
    +++ description: The Blobstream DA bridge. This contract is used to bridge data commitments between Celestia and the destination chain. It specifies relayers that commit block ranges, but due to the lack of emitted events, there may be more relayers than are presented here.
      values.blobstreamProgramVkey:
-        "0x00eaf7d396acac046b54bc8d5ba17d3f1c7374d7158ac01c76dfeca6103163eb"
+        "0x00de39c136b88dfeacb832629e21a9667935bc0e74aaa21292e4f237d79d0bef"
    }
```

```diff
+   Status: CREATED
    contract SP1Verifier (0x0459d576A6223fEeA177Fb3DF53C9c77BF84C459)
    +++ description: Verifier contract for SP1 proofs.
```

## Source code changes

```diff
.../blobstream/ethereum/.flat/SP1Verifier.sol      | 1396 ++++++++++++++++++++
 1 file changed, 1396 insertions(+)
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22243970 (main branch discovery), not current.

```diff
    contract SP1VerifierGateway (0x3B6041173B80E77f038f3F2C0f9744f04837185e) {
    +++ description: This contract is the router for zk proof verification. It stores the mapping between identifiers and the address of onchain verifier contracts, routing each identifier to the corresponding verifier contract.
      values.verifier.prover:
-        "0xE00a3cBFC45241b33c0A44C78e26168CBc55EC63"
+        "0x0000000000000000000000000000000000000000"
+++ description: The prover contract address for SP1, and whether it is frozen (true if frozen).
      values.oldVerifier6:
+        {"prover":"0xE00a3cBFC45241b33c0A44C78e26168CBc55EC63","frozen":false}
      fieldMeta.oldVerifier6:
+        {"description":"The prover contract address for SP1, and whether it is frozen (true if frozen)."}
    }
```

```diff
-   Status: DELETED
    contract SP1Verifier (0xE00a3cBFC45241b33c0A44C78e26168CBc55EC63)
    +++ description: Verifier contract for SP1 proofs.
```

Generated with discovered.json: 0x3040e5b02ef842a53e6f44614f98406be1c77bda

# Diff at Wed, 28 May 2025 11:34:26 GMT:

- chain: arbitrum
- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@13b95854804f5ec749939a5230d24dfeedf19d1e block: 325165450
- current block number: 325165450

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 325165450 (main branch discovery), not current.

```diff
    contract SP1Verifier (0xE00a3cBFC45241b33c0A44C78e26168CBc55EC63) {
    +++ description: Verifier contract for SP1 proofs.
      description:
-        "SP1Verifier is a contract used to verify proofs given public values and verification key."
+        "Verifier contract for SP1 proofs."
    }
```

Generated with discovered.json: 0x56ad0349e63b3c8ca43d6f9b9f8bd019364808fd

# Diff at Wed, 28 May 2025 11:34:26 GMT:

- chain: base
- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@13b95854804f5ec749939a5230d24dfeedf19d1e block: 28782173
- current block number: 28782173

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 28782173 (main branch discovery), not current.

```diff
    contract SP1Verifier (0xE00a3cBFC45241b33c0A44C78e26168CBc55EC63) {
    +++ description: Verifier contract for SP1 proofs.
      description:
-        "SP1Verifier is a contract used to verify proofs given public values and verification key."
+        "Verifier contract for SP1 proofs."
    }
```

Generated with discovered.json: 0xc9a395d1d891d1ad3fccd02217b8f84b15b88ea1

# Diff at Wed, 28 May 2025 11:34:26 GMT:

- chain: ethereum
- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@13b95854804f5ec749939a5230d24dfeedf19d1e block: 22243970
- current block number: 22243970

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22243970 (main branch discovery), not current.

```diff
    contract SP1Verifier (0xE00a3cBFC45241b33c0A44C78e26168CBc55EC63) {
    +++ description: Verifier contract for SP1 proofs.
      description:
-        "SP1Verifier is a contract used to verify proofs given public values and verification key."
+        "Verifier contract for SP1 proofs."
    }
```

Generated with discovered.json: 0x7b0bfb4b715bbfdaa55182df29f448ffd7123ac9

# Diff at Fri, 23 May 2025 09:41:14 GMT:

- chain: arbitrum
- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@69cd181abbc3c830a6caf2f4429b37cae72ffdb8 block: 325165450
- current block number: 325165450

## Description

Introduced .role field on each permission, defaulting to field name on which it was defined (with '.' prefix)

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 325165450 (main branch discovery), not current.

```diff
    EOA  (0x3243552F3BcbcE720Db6f5ad0C1B7cd15458392D) {
    +++ description: None
      receivedPermissions.0.role:
+        ".relayers"
    }
```

```diff
    contract BlobstreamMultisig (0x738a9b55304f9fcF776B3BA285e50c0f9eF77997) {
    +++ description: None
      receivedPermissions.1.role:
+        "admin"
      receivedPermissions.0.role:
+        ".guardians"
    }
```

```diff
    EOA  (0x9c0B0dBBAe8a976CEeA8C2A96F6D00c53839afDC) {
    +++ description: None
      receivedPermissions.0.role:
+        ".relayers"
    }
```

```diff
    contract SP1VerifierGatewayMultisig (0xCafEf00d348Adbd57c37d1B77e0619C6244C6878) {
    +++ description: None
      receivedPermissions.0.role:
+        ".owner"
    }
```

Generated with discovered.json: 0xc5d497c103fff6a12dc1d2fd27b6584b984ef295

# Diff at Fri, 23 May 2025 09:41:14 GMT:

- chain: base
- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@69cd181abbc3c830a6caf2f4429b37cae72ffdb8 block: 28782173
- current block number: 28782173

## Description

Introduced .role field on each permission, defaulting to field name on which it was defined (with '.' prefix)

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 28782173 (main branch discovery), not current.

```diff
    EOA  (0x3243552F3BcbcE720Db6f5ad0C1B7cd15458392D) {
    +++ description: None
      receivedPermissions.0.role:
+        ".relayers"
    }
```

```diff
    contract BlobstreamMultisig (0x6ABa5D2084362038C9640a8851ff3b8BCbA81Ca6) {
    +++ description: None
      receivedPermissions.1.role:
+        "admin"
      receivedPermissions.0.role:
+        ".guardians"
    }
```

```diff
    EOA  (0x9c0B0dBBAe8a976CEeA8C2A96F6D00c53839afDC) {
    +++ description: None
      receivedPermissions.0.role:
+        ".relayers"
    }
```

```diff
    contract SP1VerifierGatewayMultisig (0xCafEf00d348Adbd57c37d1B77e0619C6244C6878) {
    +++ description: None
      receivedPermissions.0.role:
+        ".owner"
    }
```

Generated with discovered.json: 0x26bda27592a7524893b18ad3c3dfaa1b58fdecbc

# Diff at Fri, 23 May 2025 09:41:14 GMT:

- chain: ethereum
- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@69cd181abbc3c830a6caf2f4429b37cae72ffdb8 block: 22243970
- current block number: 22243970

## Description

Introduced .role field on each permission, defaulting to field name on which it was defined (with '.' prefix)

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22243970 (main branch discovery), not current.

```diff
    EOA  (0x3243552F3BcbcE720Db6f5ad0C1B7cd15458392D) {
    +++ description: None
      receivedPermissions.0.role:
+        ".relayers"
    }
```

```diff
    contract BlobstreamMultisig (0x8bF34D8df1eF0A8A7f27fC587202848E528018E6) {
    +++ description: None
      receivedPermissions.1.role:
+        "admin"
      receivedPermissions.0.role:
+        ".guardians"
    }
```

```diff
    EOA  (0x9c0B0dBBAe8a976CEeA8C2A96F6D00c53839afDC) {
    +++ description: None
      receivedPermissions.0.role:
+        ".relayers"
    }
```

```diff
    contract SP1VerifierGatewayMultisig (0xCafEf00d348Adbd57c37d1B77e0619C6244C6878) {
    +++ description: None
      receivedPermissions.0.role:
+        ".owner"
    }
```

Generated with discovered.json: 0xaea9d63389eab81d2f2faa3634ce6c49375a407d

# Diff at Tue, 29 Apr 2025 08:19:22 GMT:

- chain: arbitrum
- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@ef7477af00fe0b57a2f7cacf7e958c12494af662 block: 325165450
- current block number: 325165450

## Description

Field .issuedPermissions is removed from the output as no longer needed. Added 'permissionsConfigHash' due to refactoring of the modelling process (into a separate command).

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 325165450 (main branch discovery), not current.

```diff
    contract SP1VerifierGateway (0x3B6041173B80E77f038f3F2C0f9744f04837185e) {
    +++ description: This contract is the router for zk proof verification. It stores the mapping between identifiers and the address of onchain verifier contracts, routing each identifier to the corresponding verifier contract.
      issuedPermissions:
-        [{"permission":"interact","to":"0xCafEf00d348Adbd57c37d1B77e0619C6244C6878","description":"holds the power to affect the liveness and safety of the gateway - can transfer ownership, add and freeze verifier routes.","via":[]}]
    }
```

```diff
    contract Blobstream (0xA83ca7775Bc2889825BcDeDfFa5b758cf69e8794) {
    +++ description: The Blobstream DA bridge. This contract is used to bridge data commitments between Celestia and the destination chain. It specifies relayers that commit block ranges, but due to the lack of emitted events, there may be more relayers than are presented here.
      issuedPermissions:
-        [{"permission":"interact","to":"0x3243552F3BcbcE720Db6f5ad0C1B7cd15458392D","description":"it is a 'Relayer' and can call commitHeaderRange() to commit block ranges. Since adding and removing Relayers emits no events, there can be more relayers than are presented here.","via":[]},{"permission":"interact","to":"0x738a9b55304f9fcF776B3BA285e50c0f9eF77997","description":"can freeze the bridge contract and update the list of authorized relayers.","via":[]},{"permission":"interact","to":"0x9c0B0dBBAe8a976CEeA8C2A96F6D00c53839afDC","description":"it is a 'Relayer' and can call commitHeaderRange() to commit block ranges. Since adding and removing Relayers emits no events, there can be more relayers than are presented here.","via":[]},{"permission":"upgrade","to":"0x738a9b55304f9fcF776B3BA285e50c0f9eF77997","via":[]}]
    }
```

Generated with discovered.json: 0xcc53e2b9b62dcb60d2426e1af687795e56908584

# Diff at Tue, 29 Apr 2025 08:19:22 GMT:

- chain: base
- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@ef7477af00fe0b57a2f7cacf7e958c12494af662 block: 28782173
- current block number: 28782173

## Description

Field .issuedPermissions is removed from the output as no longer needed. Added 'permissionsConfigHash' due to refactoring of the modelling process (into a separate command).

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 28782173 (main branch discovery), not current.

```diff
    contract SP1VerifierGateway (0x3B6041173B80E77f038f3F2C0f9744f04837185e) {
    +++ description: This contract is the router for zk proof verification. It stores the mapping between identifiers and the address of onchain verifier contracts, routing each identifier to the corresponding verifier contract.
      issuedPermissions:
-        [{"permission":"interact","to":"0xCafEf00d348Adbd57c37d1B77e0619C6244C6878","description":"holds the power to affect the liveness and safety of the gateway - can transfer ownership, add and freeze verifier routes.","via":[]}]
    }
```

```diff
    contract Blobstream (0xA83ca7775Bc2889825BcDeDfFa5b758cf69e8794) {
    +++ description: The Blobstream DA bridge. This contract is used to bridge data commitments between Celestia and the destination chain. It specifies relayers that commit block ranges, but due to the lack of emitted events, there may be more relayers than are presented here.
      issuedPermissions:
-        [{"permission":"interact","to":"0x3243552F3BcbcE720Db6f5ad0C1B7cd15458392D","description":"it is a 'Relayer' and can call commitHeaderRange() to commit block ranges. Since adding and removing Relayers emits no events, there can be more relayers than are presented here.","via":[]},{"permission":"interact","to":"0x6ABa5D2084362038C9640a8851ff3b8BCbA81Ca6","description":"can freeze the bridge contract and update the list of authorized relayers.","via":[]},{"permission":"interact","to":"0x9c0B0dBBAe8a976CEeA8C2A96F6D00c53839afDC","description":"it is a 'Relayer' and can call commitHeaderRange() to commit block ranges. Since adding and removing Relayers emits no events, there can be more relayers than are presented here.","via":[]},{"permission":"upgrade","to":"0x6ABa5D2084362038C9640a8851ff3b8BCbA81Ca6","via":[]}]
    }
```

Generated with discovered.json: 0x3338a675716cac75e14522fe3f73f9f9f65fbc99

# Diff at Tue, 29 Apr 2025 08:19:22 GMT:

- chain: ethereum
- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@ef7477af00fe0b57a2f7cacf7e958c12494af662 block: 22243970
- current block number: 22243970

## Description

Field .issuedPermissions is removed from the output as no longer needed. Added 'permissionsConfigHash' due to refactoring of the modelling process (into a separate command).

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22243970 (main branch discovery), not current.

```diff
    contract SP1VerifierGateway (0x3B6041173B80E77f038f3F2C0f9744f04837185e) {
    +++ description: This contract is the router for zk proof verification. It stores the mapping between identifiers and the address of onchain verifier contracts, routing each identifier to the corresponding verifier contract.
      issuedPermissions:
-        [{"permission":"interact","to":"0xCafEf00d348Adbd57c37d1B77e0619C6244C6878","description":"holds the power to affect the liveness and safety of the gateway - can transfer ownership, add and freeze verifier routes.","via":[]}]
    }
```

```diff
    contract Blobstream (0x7Cf3876F681Dbb6EdA8f6FfC45D66B996Df08fAe) {
    +++ description: The Blobstream DA bridge. This contract is used to bridge data commitments between Celestia and the destination chain. It specifies relayers that commit block ranges, but due to the lack of emitted events, there may be more relayers than are presented here.
      issuedPermissions:
-        [{"permission":"interact","to":"0x3243552F3BcbcE720Db6f5ad0C1B7cd15458392D","description":"it is a 'Relayer' and can call commitHeaderRange() to commit block ranges. Since adding and removing Relayers emits no events, there can be more relayers than are presented here.","via":[]},{"permission":"interact","to":"0x8bF34D8df1eF0A8A7f27fC587202848E528018E6","description":"can freeze the bridge contract and update the list of authorized relayers.","via":[]},{"permission":"interact","to":"0x9c0B0dBBAe8a976CEeA8C2A96F6D00c53839afDC","description":"it is a 'Relayer' and can call commitHeaderRange() to commit block ranges. Since adding and removing Relayers emits no events, there can be more relayers than are presented here.","via":[]},{"permission":"upgrade","to":"0x8bF34D8df1eF0A8A7f27fC587202848E528018E6","via":[]}]
    }
```

Generated with discovered.json: 0xd5a26fc6626168a40133ce4b18c6dd254f2369bf

# Diff at Thu, 24 Apr 2025 10:31:46 GMT:

- chain: base
- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@564f772ef796772c9952d7432df8286347a08d9e block: 28782173
- current block number: 28782173

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 28782173 (main branch discovery), not current.

```diff
    contract SP1VerifierGateway (0x3B6041173B80E77f038f3F2C0f9744f04837185e) {
    +++ description: This contract is the router for zk proof verification. It stores the mapping between identifiers and the address of onchain verifier contracts, routing each identifier to the corresponding verifier contract.
+++ description: The verifier contract address for SP1, and whether it is frozen (true if frozen). This verifier route was frozen on 2024-09-04.
      values.oldVerifier:
-        ["0xc350F063C13a3Ca21331610fe159E697a5c9c2FB",true]
+        {"verifier":"0xc350F063C13a3Ca21331610fe159E697a5c9c2FB","frozen":true}
+++ description: The verifier contract address for SP1, and whether it is frozen (true if frozen). This prover route was frozen on 2024-09-21.
      values.oldVerifier2:
-        ["0x6B6A7Ded061567d8A56279801DEA5cFB79be5bFc",true]
+        {"verifier":"0x6B6A7Ded061567d8A56279801DEA5cFB79be5bFc","frozen":true}
+++ description: The verifier contract address for SP1, and whether it is frozen (true if frozen). This prover route was frozen on 2024-11-01.
      values.oldVerifier3:
-        ["0x6A87EFd4e6B2Db1ed73129A8b9c51aaA583d49e3",true]
+        {"prover":"0x6A87EFd4e6B2Db1ed73129A8b9c51aaA583d49e3","frozen":true}
+++ description: The verifier contract address for SP1, and whether it is frozen (true if frozen). This prover route was frozen on 2024-11-08.
      values.oldVerifier4:
-        ["0x1764C29FBd94865198588f10FC75D4f6636d158d",true]
+        {"verifier":"0x1764C29FBd94865198588f10FC75D4f6636d158d","frozen":true}
+++ description: The prover contract address for SP1, and whether it is frozen (true if frozen). This prover route was frozen on 2025-01-15.
      values.oldVerifier5:
-        ["0xd2832Cf1fC8bA210FfABF62Db9A8781153131d16",true]
+        {"prover":"0xd2832Cf1fC8bA210FfABF62Db9A8781153131d16","frozen":true}
+++ description: The prover contract address for SP1, and whether it is frozen (true if frozen).
      values.verifier:
-        ["0xE00a3cBFC45241b33c0A44C78e26168CBc55EC63",false]
+        {"prover":"0xE00a3cBFC45241b33c0A44C78e26168CBc55EC63","frozen":false}
    }
```

Generated with discovered.json: 0xe93f72ab077b2506409e8108b7aab9bc807ca636

# Diff at Thu, 24 Apr 2025 10:31:40 GMT:

- chain: arbitrum
- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@564f772ef796772c9952d7432df8286347a08d9e block: 325165450
- current block number: 325165450

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 325165450 (main branch discovery), not current.

```diff
    contract SP1VerifierGateway (0x3B6041173B80E77f038f3F2C0f9744f04837185e) {
    +++ description: This contract is the router for zk proof verification. It stores the mapping between identifiers and the address of onchain verifier contracts, routing each identifier to the corresponding verifier contract.
+++ description: The verifier contract address for SP1, and whether it is frozen (true if frozen). This verifier route was frozen on 2024-09-04.
      values.oldVerifier:
-        ["0xc350F063C13a3Ca21331610fe159E697a5c9c2FB",true]
+        {"verifier":"0xc350F063C13a3Ca21331610fe159E697a5c9c2FB","frozen":true}
+++ description: The verifier contract address for SP1, and whether it is frozen (true if frozen). This prover route was frozen on 2024-09-21.
      values.oldVerifier2:
-        ["0x6B6A7Ded061567d8A56279801DEA5cFB79be5bFc",true]
+        {"verifier":"0x6B6A7Ded061567d8A56279801DEA5cFB79be5bFc","frozen":true}
+++ description: The verifier contract address for SP1, and whether it is frozen (true if frozen). This prover route was frozen on 2024-11-01.
      values.oldVerifier3:
-        ["0x6A87EFd4e6B2Db1ed73129A8b9c51aaA583d49e3",true]
+        {"prover":"0x6A87EFd4e6B2Db1ed73129A8b9c51aaA583d49e3","frozen":true}
+++ description: The verifier contract address for SP1, and whether it is frozen (true if frozen). This prover route was frozen on 2024-11-08.
      values.oldVerifier4:
-        ["0x1764C29FBd94865198588f10FC75D4f6636d158d",true]
+        {"verifier":"0x1764C29FBd94865198588f10FC75D4f6636d158d","frozen":true}
+++ description: The prover contract address for SP1, and whether it is frozen (true if frozen). This prover route was frozen on 2025-01-15.
      values.oldVerifier5:
-        ["0xd2832Cf1fC8bA210FfABF62Db9A8781153131d16",true]
+        {"prover":"0xd2832Cf1fC8bA210FfABF62Db9A8781153131d16","frozen":true}
+++ description: The prover contract address for SP1, and whether it is frozen (true if frozen).
      values.verifier:
-        ["0xE00a3cBFC45241b33c0A44C78e26168CBc55EC63",false]
+        {"prover":"0xE00a3cBFC45241b33c0A44C78e26168CBc55EC63","frozen":false}
    }
```

Generated with discovered.json: 0xc84a11302acfdb57dd3d34d11f10beb0c9387d68

# Diff at Thu, 24 Apr 2025 10:29:51 GMT:

- chain: ethereum
- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@564f772ef796772c9952d7432df8286347a08d9e block: 22243970
- current block number: 22243970

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22243970 (main branch discovery), not current.

```diff
    contract SP1VerifierGateway (0x3B6041173B80E77f038f3F2C0f9744f04837185e) {
    +++ description: This contract is the router for zk proof verification. It stores the mapping between identifiers and the address of onchain verifier contracts, routing each identifier to the corresponding verifier contract.
+++ description: The verifier contract address for SP1, and whether it is frozen (true if frozen). This verifier route was frozen on 2024-09-04.
      values.oldVerifier:
-        ["0xc350F063C13a3Ca21331610fe159E697a5c9c2FB",true]
+        {"verifier":"0xc350F063C13a3Ca21331610fe159E697a5c9c2FB","frozen":true}
+++ description: The verifier contract address for SP1, and whether it is frozen (true if frozen). This prover route was frozen on 2024-09-21.
      values.oldVerifier2:
-        ["0x6B6A7Ded061567d8A56279801DEA5cFB79be5bFc",true]
+        {"verifier":"0x6B6A7Ded061567d8A56279801DEA5cFB79be5bFc","frozen":true}
+++ description: The verifier contract address for SP1, and whether it is frozen (true if frozen). This prover route was frozen on 2024-11-01.
      values.oldVerifier3:
-        ["0x6A87EFd4e6B2Db1ed73129A8b9c51aaA583d49e3",true]
+        {"prover":"0x6A87EFd4e6B2Db1ed73129A8b9c51aaA583d49e3","frozen":true}
+++ description: The verifier contract address for SP1, and whether it is frozen (true if frozen). This prover route was frozen on 2024-11-08.
      values.oldVerifier4:
-        ["0x1764C29FBd94865198588f10FC75D4f6636d158d",true]
+        {"verifier":"0x1764C29FBd94865198588f10FC75D4f6636d158d","frozen":true}
+++ description: The prover contract address for SP1, and whether it is frozen (true if frozen). This prover route was frozen on 2025-01-15.
      values.oldVerifier5:
-        ["0xd2832Cf1fC8bA210FfABF62Db9A8781153131d16",true]
+        {"prover":"0xd2832Cf1fC8bA210FfABF62Db9A8781153131d16","frozen":true}
+++ description: The prover contract address for SP1, and whether it is frozen (true if frozen).
      values.verifier:
-        ["0xE00a3cBFC45241b33c0A44C78e26168CBc55EC63",false]
+        {"prover":"0xE00a3cBFC45241b33c0A44C78e26168CBc55EC63","frozen":false}
    }
```

Generated with discovered.json: 0xa31e42da4308a670e82b27d394dee34016133d15

# Diff at Fri, 11 Apr 2025 06:41:38 GMT:

- chain: base
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@a946e9842245b891a11dfd66e5a103281bde27da block: 28449617
- current block number: 28782173

## Description

change vkey.

## Watched changes

```diff
    contract Blobstream (0xA83ca7775Bc2889825BcDeDfFa5b758cf69e8794) {
    +++ description: The Blobstream DA bridge. This contract is used to bridge data commitments between Celestia and the destination chain. It specifies relayers that commit block ranges, but due to the lack of emitted events, there may be more relayers than are presented here.
      values.blobstreamProgramVkey:
-        "0x00b6c8c78a73630fae80e45b2888a00d9ab0cc05a77cd7c027446a6ae2289928"
+        "0x00eaf7d396acac046b54bc8d5ba17d3f1c7374d7158ac01c76dfeca6103163eb"
    }
```

Generated with discovered.json: 0x972c90107f90203545ac85a02599c4abef87a64a

# Diff at Fri, 11 Apr 2025 06:41:35 GMT:

- chain: arbitrum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@a946e9842245b891a11dfd66e5a103281bde27da block: 322514614
- current block number: 325165450

## Description

change vkey.

## Watched changes

```diff
    contract Blobstream (0xA83ca7775Bc2889825BcDeDfFa5b758cf69e8794) {
    +++ description: The Blobstream DA bridge. This contract is used to bridge data commitments between Celestia and the destination chain. It specifies relayers that commit block ranges, but due to the lack of emitted events, there may be more relayers than are presented here.
      values.blobstreamProgramVkey:
-        "0x00b6c8c78a73630fae80e45b2888a00d9ab0cc05a77cd7c027446a6ae2289928"
+        "0x00eaf7d396acac046b54bc8d5ba17d3f1c7374d7158ac01c76dfeca6103163eb"
    }
```

Generated with discovered.json: 0x796594ca7c1797626d53971068b84f9439b0423c

# Diff at Fri, 11 Apr 2025 06:41:32 GMT:

- chain: ethereum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@a946e9842245b891a11dfd66e5a103281bde27da block: 22188818
- current block number: 22243970

## Description

change vkey.

## Watched changes

```diff
    contract Blobstream (0x7Cf3876F681Dbb6EdA8f6FfC45D66B996Df08fAe) {
    +++ description: The Blobstream DA bridge. This contract is used to bridge data commitments between Celestia and the destination chain. It specifies relayers that commit block ranges, but due to the lack of emitted events, there may be more relayers than are presented here.
      values.blobstreamProgramVkey:
-        "0x00b6c8c78a73630fae80e45b2888a00d9ab0cc05a77cd7c027446a6ae2289928"
+        "0x00eaf7d396acac046b54bc8d5ba17d3f1c7374d7158ac01c76dfeca6103163eb"
    }
```

Generated with discovered.json: 0x223b48d9dda015cbec48f8baff11716ec4147d18

# Diff at Fri, 04 Apr 2025 09:34:38 GMT:

- chain: base
- author: vincfurc (<10850139+vincfurc@users.noreply.github.com>)
- comparing to: main@a21404a14e50e9f638ddf1e6cb431ede2d3cc07a block: 28449617
- current block number: 28449617

## Description

Renamed SP1VerifierGatewayMultisig.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 28449617 (main branch discovery), not current.

```diff
    contract SP1VerifierGatewayMultisig (0xCafEf00d348Adbd57c37d1B77e0619C6244C6878) {
    +++ description: None
      name:
-        "Succinct Multisig 1"
+        "SP1VerifierGatewayMultisig"
    }
```

Generated with discovered.json: 0xe50b66669b7fd735e036eb3a243003a11677c469

# Diff at Fri, 04 Apr 2025 09:34:37 GMT:

- chain: arbitrum
- author: vincfurc (<10850139+vincfurc@users.noreply.github.com>)
- comparing to: main@a21404a14e50e9f638ddf1e6cb431ede2d3cc07a block: 322514614
- current block number: 322514614

## Description

Renamed SP1VerifierGatewayMultisig.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 322514614 (main branch discovery), not current.

```diff
    contract SP1VerifierGatewayMultisig (0xCafEf00d348Adbd57c37d1B77e0619C6244C6878) {
    +++ description: None
      name:
-        "Succinct Multisig 1"
+        "SP1VerifierGatewayMultisig"
    }
```

```diff
    contract SP1Verifier (0xE00a3cBFC45241b33c0A44C78e26168CBc55EC63) {
    +++ description: SP1Verifier is a contract used to verify proofs given public values and verification key.
      unverified:
-        true
      values.VERIFIER_HASH:
+        "0x1b34fe11a637737f0c75c88241669dcf9ca3c03713659265b8241f398a2d286d"
      values.VERSION:
+        "v4.0.0-rc.3"
      template:
+        "succinct/SP1Verifier"
      sourceHashes:
+        ["0xcc497e8b709d783cb24e3120d14c9fb3b015c3fe5ed7a57e0de6c38f9bfe937b"]
      description:
+        "SP1Verifier is a contract used to verify proofs given public values and verification key."
    }
```

Generated with discovered.json: 0x323c9fa17f2ae0e29e0318d475c6ced6c10996b5

# Diff at Thu, 03 Apr 2025 14:59:46 GMT:

- chain: arbitrum
- author: vincfurc (<10850139+vincfurc@users.noreply.github.com>)
- comparing to: main@87156896058912c79002d4129b054942ff1352e9 block: 305996466
- current block number: 322514614

## Description

Updated the blobstream template to ignore outdated gateway.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 305996466 (main branch discovery), not current.

```diff
-   Status: DELETED
    contract SuccinctFeeVault (0x296666e937b270193B960a7cEC526B351F353166)
    +++ description: None
```

```diff
    contract SP1VerifierGateway (0x3B6041173B80E77f038f3F2C0f9744f04837185e) {
    +++ description: This contract is the router for zk proof verification. It stores the mapping between identifiers and the address of onchain verifier contracts, routing each identifier to the corresponding verifier contract.
      name:
-        "SuccinctGatewaySP1"
+        "SP1VerifierGateway"
      template:
-        "succinct/SP1SuccinctGateway"
+        "succinct/SP1VerifierGateway"
      issuedPermissions.1:
-        {"permission":"interact","to":"0xE00a3cBFC45241b33c0A44C78e26168CBc55EC63","description":"can verify proofs for the header range [latestBlock, targetBlock] proof.","via":[]}
    }
```

```diff
-   Status: DELETED
    contract HeaderRangeVerifier (0x4d0C32ddA9De7CD89e198cFe5E01470A49b8acD3)
    +++ description: None
```

```diff
-   Status: DELETED
    contract SuccinctGateway (0x6c7a05e0AE641c6559fD76ac56641778B6eCd776)
    +++ description: Users could interact with this contract to request proofs onchain, emitting a RequestCall event for off-chain provers to consume. Now deprecated, SP1 is used instead.
```

```diff
    contract Blobstream (0xA83ca7775Bc2889825BcDeDfFa5b758cf69e8794) {
    +++ description: The Blobstream DA bridge. This contract is used to bridge data commitments between Celestia and the destination chain. It specifies relayers that commit block ranges, but due to the lack of emitted events, there may be more relayers than are presented here.
      values.gateway_deprecated:
-        "0x6c7a05e0AE641c6559fD76ac56641778B6eCd776"
    }
```

```diff
-   Status: DELETED
    contract SP1Verifier (0xd2832Cf1fC8bA210FfABF62Db9A8781153131d16)
    +++ description: None
```

```diff
-   Status: DELETED
    contract SuccinctGatewayMultisig (0xdC00f2469023a7b0b1D5b6abE2F736F90955e7F3)
    +++ description: None
```

```diff
    contract SP1Verifier (0xE00a3cBFC45241b33c0A44C78e26168CBc55EC63) {
    +++ description: None
      name:
-        ""
+        "SP1Verifier"
      receivedPermissions:
-        [{"permission":"interact","from":"0x3B6041173B80E77f038f3F2C0f9744f04837185e","description":"can verify proofs for the header range [latestBlock, targetBlock] proof."}]
    }
```

```diff
-   Status: DELETED
    contract NextHeaderVerifier (0xfEA1EFaE3cDe8C524168726a7fc46BF2134bb72C)
    +++ description: None
```

Generated with discovered.json: 0xe6b6d1fb25319c5ca8c0a9eea5285a2c2395a206

# Diff at Thu, 03 Apr 2025 14:55:24 GMT:

- chain: base
- author: vincfurc (<10850139+vincfurc@users.noreply.github.com>)
- comparing to: main@87156896058912c79002d4129b054942ff1352e9 block: 25417811
- current block number: 28449617

## Description

Updated the blobstream template to ignore outdated gateway.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 25417811 (main branch discovery), not current.

```diff
-   Status: DELETED
    contract SuccinctFeeVault (0x296666e937b270193B960a7cEC526B351F353166)
    +++ description: None
```

```diff
    contract SP1VerifierGateway (0x3B6041173B80E77f038f3F2C0f9744f04837185e) {
    +++ description: This contract is the router for zk proof verification. It stores the mapping between identifiers and the address of onchain verifier contracts, routing each identifier to the corresponding verifier contract.
      name:
-        "SuccinctGatewaySP1"
+        "SP1VerifierGateway"
      template:
-        "succinct/SP1SuccinctGateway"
+        "succinct/SP1VerifierGateway"
      issuedPermissions.1:
-        {"permission":"interact","to":"0xE00a3cBFC45241b33c0A44C78e26168CBc55EC63","description":"can verify proofs for the header range [latestBlock, targetBlock] proof.","via":[]}
    }
```

```diff
-   Status: DELETED
    contract SuccinctGateway (0x6c7a05e0AE641c6559fD76ac56641778B6eCd776)
    +++ description: Users could interact with this contract to request proofs onchain, emitting a RequestCall event for off-chain provers to consume. Now deprecated, SP1 is used instead.
```

```diff
    contract Blobstream (0xA83ca7775Bc2889825BcDeDfFa5b758cf69e8794) {
    +++ description: The Blobstream DA bridge. This contract is used to bridge data commitments between Celestia and the destination chain. It specifies relayers that commit block ranges, but due to the lack of emitted events, there may be more relayers than are presented here.
      values.gateway_deprecated:
-        "0x6c7a05e0AE641c6559fD76ac56641778B6eCd776"
    }
```

```diff
-   Status: DELETED
    contract SP1Verifier (0xd2832Cf1fC8bA210FfABF62Db9A8781153131d16)
    +++ description: None
```

```diff
-   Status: DELETED
    contract Succinct Multisig 2 (0xdC00f2469023a7b0b1D5b6abE2F736F90955e7F3)
    +++ description: None
```

```diff
    contract SP1Verifier (0xE00a3cBFC45241b33c0A44C78e26168CBc55EC63) {
    +++ description: SP1Verifier is a contract used to verify proofs given public values and verification key.
      receivedPermissions:
-        [{"permission":"interact","from":"0x3B6041173B80E77f038f3F2C0f9744f04837185e","description":"can verify proofs for the header range [latestBlock, targetBlock] proof."}]
      template:
+        "succinct/SP1Verifier"
      description:
+        "SP1Verifier is a contract used to verify proofs given public values and verification key."
    }
```

```diff
-   Status: DELETED
    contract NextHeaderVerifier (0xe859F565f4AdF7AAc3a94a6C6d89093d754Ec4f6)
    +++ description: None
```

```diff
-   Status: DELETED
    contract HeaderRangeVerifier (0xF2415C44F47983F7dD22003B46A034B1F1d04e44)
    +++ description: None
```

Generated with discovered.json: 0x2043d031c98129bdae0bf9f6e96b22611fbc73d3

# Diff at Thu, 03 Apr 2025 14:54:55 GMT:

- chain: ethereum
- author: vincfurc (<10850139+vincfurc@users.noreply.github.com>)
- comparing to: main@87156896058912c79002d4129b054942ff1352e9 block: 21686332
- current block number: 22188818

## Description

Updated the blobstream template to ignore outdated gateway.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21686332 (main branch discovery), not current.

```diff
-   Status: DELETED
    contract NextHeaderVerifier (0x037E57EF3a130CD23988a4Ed530d79d6f97a0f06)
    +++ description: None
```

```diff
-   Status: DELETED
    contract SuccinctFeeVault (0x296666e937b270193B960a7cEC526B351F353166)
    +++ description: None
```

```diff
    contract SP1VerifierGateway (0x3B6041173B80E77f038f3F2C0f9744f04837185e) {
    +++ description: This contract is the router for zk proof verification. It stores the mapping between identifiers and the address of onchain verifier contracts, routing each identifier to the corresponding verifier contract.
      name:
-        "SuccinctGatewaySP1"
+        "SP1VerifierGateway"
      template:
-        "succinct/SP1SuccinctGateway"
+        "succinct/SP1VerifierGateway"
      issuedPermissions.1:
-        {"permission":"interact","to":"0xE00a3cBFC45241b33c0A44C78e26168CBc55EC63","description":"can verify proofs for the header range [latestBlock, targetBlock] proof.","via":[]}
    }
```

```diff
-   Status: DELETED
    contract SuccinctGateway (0x6c7a05e0AE641c6559fD76ac56641778B6eCd776)
    +++ description: Users could interact with this contract to request proofs onchain, emitting a RequestCall event for off-chain provers to consume. Now deprecated, SP1 is used instead.
```

```diff
    contract Blobstream (0x7Cf3876F681Dbb6EdA8f6FfC45D66B996Df08fAe) {
    +++ description: The Blobstream DA bridge. This contract is used to bridge data commitments between Celestia and the destination chain. It specifies relayers that commit block ranges, but due to the lack of emitted events, there may be more relayers than are presented here.
      values.gateway_deprecated:
-        "0x6c7a05e0AE641c6559fD76ac56641778B6eCd776"
    }
```

```diff
    contract SP1VerifierGatewayMultisig (0xCafEf00d348Adbd57c37d1B77e0619C6244C6878) {
    +++ description: None
      name:
-        "SuccinctGatewaySP1Multisig"
+        "SP1VerifierGatewayMultisig"
    }
```

```diff
-   Status: DELETED
    contract SuccinctGatewayMultisig (0xd1999B562e74d9fbf57b4479b3fe8748BDF4e4A0)
    +++ description: None
```

```diff
-   Status: DELETED
    contract SP1Verifier (0xd2832Cf1fC8bA210FfABF62Db9A8781153131d16)
    +++ description: None
```

```diff
    contract SP1Verifier (0xE00a3cBFC45241b33c0A44C78e26168CBc55EC63) {
    +++ description: SP1Verifier is a contract used to verify proofs given public values and verification key.
      receivedPermissions:
-        [{"permission":"interact","from":"0x3B6041173B80E77f038f3F2C0f9744f04837185e","description":"can verify proofs for the header range [latestBlock, targetBlock] proof."}]
      template:
+        "succinct/SP1Verifier"
      description:
+        "SP1Verifier is a contract used to verify proofs given public values and verification key."
    }
```

```diff
-   Status: DELETED
    contract HeaderRangeVerifier (0xF33a22dFf8017813b95E5a05c9a97BaFE693001E)
    +++ description: None
```

Generated with discovered.json: 0x3fbb57d2e6463008d2c299a91ae842e4250d001a

# Diff at Tue, 18 Mar 2025 08:15:06 GMT:

- chain: base
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@4ef7a8dbcec1cd9fec77aae2b73d81347a4ffb13 block: 25417811
- current block number: 25417811

## Description

Config: change Multisig names.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 25417811 (main branch discovery), not current.

```diff
    contract Succinct Multisig 1 (0xCafEf00d348Adbd57c37d1B77e0619C6244C6878) {
    +++ description: None
      name:
-        "SuccinctGatewaySP1Multisig"
+        "Succinct Multisig 1"
    }
```

```diff
    contract Succinct Multisig 2 (0xdC00f2469023a7b0b1D5b6abE2F736F90955e7F3) {
    +++ description: None
      name:
-        "SuccinctGatewayMultisig"
+        "Succinct Multisig 2"
    }
```

Generated with discovered.json: 0x9dd21c538fc08d5789ca3e0eb8bf3fbf17169c37

# Diff at Tue, 18 Mar 2025 08:14:50 GMT:

- chain: arbitrum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@4ef7a8dbcec1cd9fec77aae2b73d81347a4ffb13 block: 305996466
- current block number: 305996466

## Description

Config: change Multisig names.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 305996466 (main branch discovery), not current.

```diff
    contract Succinct Multisig 1 (0xCafEf00d348Adbd57c37d1B77e0619C6244C6878) {
    +++ description: None
      name:
-        "SuccinctGatewaySP1Multisig"
+        "Succinct Multisig 1"
    }
```

Generated with discovered.json: 0xaf97545df0adb76e4fdc2d7ebaa18cf40888739d

# Diff at Tue, 04 Mar 2025 10:40:31 GMT:

- chain: base
- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@98d260b45fe0d2195ce5e629bd7b200c8706e8ba block: 25417811
- current block number: 25417811

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 25417811 (main branch discovery), not current.

```diff
    contract SuccinctFeeVault (0x296666e937b270193B960a7cEC526B351F353166) {
    +++ description: None
      sinceBlock:
+        9892035
    }
```

```diff
    contract SuccinctGatewaySP1 (0x3B6041173B80E77f038f3F2C0f9744f04837185e) {
    +++ description: This contract is the router for zk proof verification. It stores the mapping between identifiers and the address of onchain verifier contracts, routing each identifier to the corresponding verifier contract.
      sinceBlock:
+        16367160
    }
```

```diff
    contract BlobstreamMultisig (0x6ABa5D2084362038C9640a8851ff3b8BCbA81Ca6) {
    +++ description: None
      sinceBlock:
+        11858833
    }
```

```diff
    contract SuccinctGateway (0x6c7a05e0AE641c6559fD76ac56641778B6eCd776) {
    +++ description: Users could interact with this contract to request proofs onchain, emitting a RequestCall event for off-chain provers to consume. Now deprecated, SP1 is used instead.
      sinceBlock:
+        9892352
    }
```

```diff
    contract Blobstream (0xA83ca7775Bc2889825BcDeDfFa5b758cf69e8794) {
    +++ description: The Blobstream DA bridge. This contract is used to bridge data commitments between Celestia and the destination chain. It specifies relayers that commit block ranges, but due to the lack of emitted events, there may be more relayers than are presented here.
      sinceBlock:
+        11930930
    }
```

```diff
    contract SuccinctGatewaySP1Multisig (0xCafEf00d348Adbd57c37d1B77e0619C6244C6878) {
    +++ description: None
      sinceBlock:
+        18708503
    }
```

```diff
    contract SP1Verifier (0xd2832Cf1fC8bA210FfABF62Db9A8781153131d16) {
    +++ description: None
      sinceBlock:
+        21468906
    }
```

```diff
    contract SuccinctGatewayMultisig (0xdC00f2469023a7b0b1D5b6abE2F736F90955e7F3) {
    +++ description: None
      sinceBlock:
+        9889667
    }
```

```diff
    contract SP1Verifier (0xE00a3cBFC45241b33c0A44C78e26168CBc55EC63) {
    +++ description: None
      sinceBlock:
+        24580169
    }
```

```diff
    contract NextHeaderVerifier (0xe859F565f4AdF7AAc3a94a6C6d89093d754Ec4f6) {
    +++ description: None
      sinceBlock:
+        12175358
    }
```

```diff
    contract HeaderRangeVerifier (0xF2415C44F47983F7dD22003B46A034B1F1d04e44) {
    +++ description: None
      sinceBlock:
+        12175332
    }
```

Generated with discovered.json: 0xc75c52ffdbbeb06f7ab83949b3359ddd1988c723

# Diff at Tue, 04 Mar 2025 10:40:23 GMT:

- chain: arbitrum
- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@98d260b45fe0d2195ce5e629bd7b200c8706e8ba block: 305996466
- current block number: 305996466

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 305996466 (main branch discovery), not current.

```diff
    contract SuccinctFeeVault (0x296666e937b270193B960a7cEC526B351F353166) {
    +++ description: None
      sinceBlock:
+        175545872
    }
```

```diff
    contract SuccinctGatewaySP1 (0x3B6041173B80E77f038f3F2C0f9744f04837185e) {
    +++ description: This contract is the router for zk proof verification. It stores the mapping between identifiers and the address of onchain verifier contracts, routing each identifier to the corresponding verifier contract.
      sinceBlock:
+        226384983
    }
```

```diff
    contract HeaderRangeVerifier (0x4d0C32ddA9De7CD89e198cFe5E01470A49b8acD3) {
    +++ description: None
      sinceBlock:
+        193139337
    }
```

```diff
    contract SuccinctGateway (0x6c7a05e0AE641c6559fD76ac56641778B6eCd776) {
    +++ description: Users could interact with this contract to request proofs onchain, emitting a RequestCall event for off-chain provers to consume. Now deprecated, SP1 is used instead.
      sinceBlock:
+        188141651
    }
```

```diff
    contract BlobstreamMultisig (0x738a9b55304f9fcF776B3BA285e50c0f9eF77997) {
    +++ description: None
      sinceBlock:
+        190629615
    }
```

```diff
    contract Blobstream (0xA83ca7775Bc2889825BcDeDfFa5b758cf69e8794) {
    +++ description: The Blobstream DA bridge. This contract is used to bridge data commitments between Celestia and the destination chain. It specifies relayers that commit block ranges, but due to the lack of emitted events, there may be more relayers than are presented here.
      sinceBlock:
+        191198934
    }
```

```diff
    contract SuccinctGatewaySP1Multisig (0xCafEf00d348Adbd57c37d1B77e0619C6244C6878) {
    +++ description: None
      sinceBlock:
+        245028307
    }
```

```diff
    contract SP1Verifier (0xd2832Cf1fC8bA210FfABF62Db9A8781153131d16) {
    +++ description: None
      sinceBlock:
+        266979384
    }
```

```diff
    contract SuccinctGatewayMultisig (0xdC00f2469023a7b0b1D5b6abE2F736F90955e7F3) {
    +++ description: None
      sinceBlock:
+        69837457
    }
```

```diff
    contract  (0xE00a3cBFC45241b33c0A44C78e26168CBc55EC63) {
    +++ description: None
      sinceBlock:
+        291720238
    }
```

```diff
    contract NextHeaderVerifier (0xfEA1EFaE3cDe8C524168726a7fc46BF2134bb72C) {
    +++ description: None
      sinceBlock:
+        193139692
    }
```

Generated with discovered.json: 0x2bbbda81d063f4f78fcbf535622aa64fa96df05f

# Diff at Tue, 04 Mar 2025 10:39:00 GMT:

- chain: ethereum
- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@98d260b45fe0d2195ce5e629bd7b200c8706e8ba block: 21686332
- current block number: 21686332

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21686332 (main branch discovery), not current.

```diff
    contract NextHeaderVerifier (0x037E57EF3a130CD23988a4Ed530d79d6f97a0f06) {
    +++ description: None
      sinceBlock:
+        20027571
    }
```

```diff
    contract SuccinctFeeVault (0x296666e937b270193B960a7cEC526B351F353166) {
    +++ description: None
      sinceBlock:
+        19115866
    }
```

```diff
    contract SuccinctGatewaySP1 (0x3B6041173B80E77f038f3F2C0f9744f04837185e) {
    +++ description: This contract is the router for zk proof verification. It stores the mapping between identifiers and the address of onchain verifier contracts, routing each identifier to the corresponding verifier contract.
      sinceBlock:
+        20233410
    }
```

```diff
    contract SuccinctGateway (0x6c7a05e0AE641c6559fD76ac56641778B6eCd776) {
    +++ description: Users could interact with this contract to request proofs onchain, emitting a RequestCall event for off-chain provers to consume. Now deprecated, SP1 is used instead.
      sinceBlock:
+        19115872
    }
```

```diff
    contract Blobstream (0x7Cf3876F681Dbb6EdA8f6FfC45D66B996Df08fAe) {
    +++ description: The Blobstream DA bridge. This contract is used to bridge data commitments between Celestia and the destination chain. It specifies relayers that commit block ranges, but due to the lack of emitted events, there may be more relayers than are presented here.
      sinceBlock:
+        20027685
    }
```

```diff
    contract BlobstreamMultisig (0x8bF34D8df1eF0A8A7f27fC587202848E528018E6) {
    +++ description: None
      sinceBlock:
+        20027494
    }
```

```diff
    contract SuccinctGatewaySP1Multisig (0xCafEf00d348Adbd57c37d1B77e0619C6244C6878) {
    +++ description: None
      sinceBlock:
+        20573748
    }
```

```diff
    contract SuccinctGatewayMultisig (0xd1999B562e74d9fbf57b4479b3fe8748BDF4e4A0) {
    +++ description: None
      sinceBlock:
+        16828272
    }
```

```diff
    contract SP1Verifier (0xd2832Cf1fC8bA210FfABF62Db9A8781153131d16) {
    +++ description: None
      sinceBlock:
+        21031662
    }
```

```diff
    contract SP1Verifier (0xE00a3cBFC45241b33c0A44C78e26168CBc55EC63) {
    +++ description: None
      sinceBlock:
+        21547470
    }
```

```diff
    contract HeaderRangeVerifier (0xF33a22dFf8017813b95E5a05c9a97BaFE693001E) {
    +++ description: None
      sinceBlock:
+        20027559
    }
```

Generated with discovered.json: 0xab070335bf656a277b62c714f8192d4ed60b43cb

# Diff at Fri, 14 Feb 2025 14:06:18 GMT:

- chain: arbitrum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@166dc249bfa78df836dc8592e4a420bb82432150 block: 298391608
- current block number: 305996466

## Description

made template more general to fit other projects.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 298391608 (main branch discovery), not current.

```diff
    contract SuccinctGatewaySP1 (0x3B6041173B80E77f038f3F2C0f9744f04837185e) {
    +++ description: This contract is the router for zk proof verification. It stores the mapping between identifiers and the address of onchain verifier contracts, routing each identifier to the corresponding verifier contract.
      description:
-        "This contract is the router for the bridge proofs verification. It stores the mapping between the identifier of the bridge circuit and the address of the onchain verifier contract."
+        "This contract is the router for zk proof verification. It stores the mapping between identifiers and the address of onchain verifier contracts, routing each identifier to the corresponding verifier contract."
      issuedPermissions.0.description:
-        "holds the power to affect the liveness and safety of the bridge - can transfer ownership, add and freeze verifier routes."
+        "holds the power to affect the liveness and safety of the gateway - can transfer ownership, add and freeze verifier routes."
    }
```

```diff
    contract SuccinctGatewaySP1Multisig (0xCafEf00d348Adbd57c37d1B77e0619C6244C6878) {
    +++ description: None
      receivedPermissions.0.description:
-        "holds the power to affect the liveness and safety of the bridge - can transfer ownership, add and freeze verifier routes."
+        "holds the power to affect the liveness and safety of the gateway - can transfer ownership, add and freeze verifier routes."
    }
```

Generated with discovered.json: 0x3ea0c741e72e31ba1ff94af21ec3f8113b4dea90

# Diff at Wed, 12 Feb 2025 09:05:07 GMT:

- chain: arbitrum
- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@554a6f0e6aa688c758b37653d0be7eb446f9152e block: 298391608
- current block number: 298391608

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 298391608 (main branch discovery), not current.

```diff
    contract SP1Verifier (0xd2832Cf1fC8bA210FfABF62Db9A8781153131d16) {
    +++ description: None
      name:
-        ""
+        "SP1Verifier"
    }
```

Generated with discovered.json: 0x1494e0b8fdf0458d1463dae2add4f13add5d56a5

# Diff at Tue, 11 Feb 2025 14:13:41 GMT:

- chain: base
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@5604bedbb0dabec83d300e0abeb3d8685929c5d3 block: 25417811
- current block number: 25417811

## Description

Made succinct gateway description more generic (to be used not only for blobstream).

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 25417811 (main branch discovery), not current.

```diff
    contract SuccinctGatewaySP1 (0x3B6041173B80E77f038f3F2C0f9744f04837185e) {
    +++ description: This contract is the router for zk proof verification. It stores the mapping between identifiers and the address of onchain verifier contracts, routing each identifier to the corresponding verifier contract.
      description:
-        "This contract is the router for the bridge proofs verification. It stores the mapping between the identifier of the bridge circuit and the address of the onchain verifier contract."
+        "This contract is the router for zk proof verification. It stores the mapping between identifiers and the address of onchain verifier contracts, routing each identifier to the corresponding verifier contract."
      issuedPermissions.0.description:
-        "holds the power to affect the liveness and safety of the bridge - can transfer ownership, add and freeze verifier routes."
+        "holds the power to affect the liveness and safety of the gateway - can transfer ownership, add and freeze verifier routes."
    }
```

```diff
    contract SuccinctGatewaySP1Multisig (0xCafEf00d348Adbd57c37d1B77e0619C6244C6878) {
    +++ description: None
      receivedPermissions.0.description:
-        "holds the power to affect the liveness and safety of the bridge - can transfer ownership, add and freeze verifier routes."
+        "holds the power to affect the liveness and safety of the gateway - can transfer ownership, add and freeze verifier routes."
    }
```

Generated with discovered.json: 0xc1bafb5831ea7f304925c6b267658445062e91b8

# Diff at Tue, 11 Feb 2025 14:13:36 GMT:

- chain: ethereum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@5604bedbb0dabec83d300e0abeb3d8685929c5d3 block: 21686332
- current block number: 21686332

## Description

Made succinct gateway description more generic (to be used not only for blobstream).

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21686332 (main branch discovery), not current.

```diff
    contract SuccinctGatewaySP1 (0x3B6041173B80E77f038f3F2C0f9744f04837185e) {
    +++ description: This contract is the router for zk proof verification. It stores the mapping between identifiers and the address of onchain verifier contracts, routing each identifier to the corresponding verifier contract.
      description:
-        "This contract is the router for the bridge proofs verification. It stores the mapping between the identifier of the bridge circuit and the address of the onchain verifier contract."
+        "This contract is the router for zk proof verification. It stores the mapping between identifiers and the address of onchain verifier contracts, routing each identifier to the corresponding verifier contract."
      issuedPermissions.0.description:
-        "holds the power to affect the liveness and safety of the bridge - can transfer ownership, add and freeze verifier routes."
+        "holds the power to affect the liveness and safety of the gateway - can transfer ownership, add and freeze verifier routes."
    }
```

```diff
    contract SuccinctGatewaySP1Multisig (0xCafEf00d348Adbd57c37d1B77e0619C6244C6878) {
    +++ description: None
      receivedPermissions.0.description:
-        "holds the power to affect the liveness and safety of the bridge - can transfer ownership, add and freeze verifier routes."
+        "holds the power to affect the liveness and safety of the gateway - can transfer ownership, add and freeze verifier routes."
    }
```

Generated with discovered.json: 0x8989dcedddeda69f9879338077be520e5819fa5e

# Diff at Tue, 04 Feb 2025 12:34:00 GMT:

- chain: base
- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@145553eed7ba44636411ecb25e4099728acd02f9 block: 25417811
- current block number: 25417811

## Description

Rename 'configure' permission to 'interact'

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 25417811 (main branch discovery), not current.

```diff
    contract SuccinctGatewaySP1 (0x3B6041173B80E77f038f3F2C0f9744f04837185e) {
    +++ description: This contract is the router for the bridge proofs verification. It stores the mapping between the identifier of the bridge circuit and the address of the onchain verifier contract.
      issuedPermissions.1.permission:
-        "configure"
+        "interact"
      issuedPermissions.0.permission:
-        "configure"
+        "interact"
    }
```

```diff
    contract BlobstreamMultisig (0x6ABa5D2084362038C9640a8851ff3b8BCbA81Ca6) {
    +++ description: None
      receivedPermissions.0.permission:
-        "configure"
+        "interact"
    }
```

```diff
    contract SuccinctGateway (0x6c7a05e0AE641c6559fD76ac56641778B6eCd776) {
    +++ description: Users could interact with this contract to request proofs onchain, emitting a RequestCall event for off-chain provers to consume. Now deprecated, SP1 is used instead.
      issuedPermissions.0.permission:
-        "configure"
+        "interact"
    }
```

```diff
    contract Blobstream (0xA83ca7775Bc2889825BcDeDfFa5b758cf69e8794) {
    +++ description: The Blobstream DA bridge. This contract is used to bridge data commitments between Celestia and the destination chain. It specifies relayers that commit block ranges, but due to the lack of emitted events, there may be more relayers than are presented here.
      issuedPermissions.2.permission:
-        "configure"
+        "interact"
      issuedPermissions.1.permission:
-        "configure"
+        "interact"
      issuedPermissions.0.permission:
-        "configure"
+        "interact"
    }
```

```diff
    contract SuccinctGatewaySP1Multisig (0xCafEf00d348Adbd57c37d1B77e0619C6244C6878) {
    +++ description: None
      receivedPermissions.0.permission:
-        "configure"
+        "interact"
    }
```

```diff
    contract SuccinctGatewayMultisig (0xdC00f2469023a7b0b1D5b6abE2F736F90955e7F3) {
    +++ description: None
      receivedPermissions.0.permission:
-        "configure"
+        "interact"
    }
```

```diff
    contract SP1Verifier (0xE00a3cBFC45241b33c0A44C78e26168CBc55EC63) {
    +++ description: None
      receivedPermissions.0.permission:
-        "configure"
+        "interact"
    }
```

Generated with discovered.json: 0x522856152af318b4b2449a97eb8b305cadcb435c

# Diff at Tue, 04 Feb 2025 12:33:53 GMT:

- chain: arbitrum
- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@145553eed7ba44636411ecb25e4099728acd02f9 block: 298391608
- current block number: 298391608

## Description

Rename 'configure' permission to 'interact'

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 298391608 (main branch discovery), not current.

```diff
    contract SuccinctGatewaySP1 (0x3B6041173B80E77f038f3F2C0f9744f04837185e) {
    +++ description: This contract is the router for the bridge proofs verification. It stores the mapping between the identifier of the bridge circuit and the address of the onchain verifier contract.
      issuedPermissions.1.permission:
-        "configure"
+        "interact"
      issuedPermissions.0.permission:
-        "configure"
+        "interact"
    }
```

```diff
    contract SuccinctGateway (0x6c7a05e0AE641c6559fD76ac56641778B6eCd776) {
    +++ description: Users could interact with this contract to request proofs onchain, emitting a RequestCall event for off-chain provers to consume. Now deprecated, SP1 is used instead.
      issuedPermissions.0.permission:
-        "configure"
+        "interact"
    }
```

```diff
    contract BlobstreamMultisig (0x738a9b55304f9fcF776B3BA285e50c0f9eF77997) {
    +++ description: None
      receivedPermissions.0.permission:
-        "configure"
+        "interact"
    }
```

```diff
    contract Blobstream (0xA83ca7775Bc2889825BcDeDfFa5b758cf69e8794) {
    +++ description: The Blobstream DA bridge. This contract is used to bridge data commitments between Celestia and the destination chain. It specifies relayers that commit block ranges, but due to the lack of emitted events, there may be more relayers than are presented here.
      issuedPermissions.2.permission:
-        "configure"
+        "interact"
      issuedPermissions.1.permission:
-        "configure"
+        "interact"
      issuedPermissions.0.permission:
-        "configure"
+        "interact"
    }
```

```diff
    contract SuccinctGatewaySP1Multisig (0xCafEf00d348Adbd57c37d1B77e0619C6244C6878) {
    +++ description: None
      receivedPermissions.0.permission:
-        "configure"
+        "interact"
    }
```

```diff
    contract SuccinctGatewayMultisig (0xdC00f2469023a7b0b1D5b6abE2F736F90955e7F3) {
    +++ description: None
      receivedPermissions.0.permission:
-        "configure"
+        "interact"
    }
```

```diff
    contract  (0xE00a3cBFC45241b33c0A44C78e26168CBc55EC63) {
    +++ description: None
      receivedPermissions.0.permission:
-        "configure"
+        "interact"
    }
```

Generated with discovered.json: 0x099ec9c5187e14fc6fad9484fabeee1b07479471

# Diff at Tue, 04 Feb 2025 12:30:50 GMT:

- chain: ethereum
- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@145553eed7ba44636411ecb25e4099728acd02f9 block: 21686332
- current block number: 21686332

## Description

Rename 'configure' permission to 'interact'

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21686332 (main branch discovery), not current.

```diff
    contract SuccinctGatewaySP1 (0x3B6041173B80E77f038f3F2C0f9744f04837185e) {
    +++ description: This contract is the router for the bridge proofs verification. It stores the mapping between the identifier of the bridge circuit and the address of the onchain verifier contract.
      issuedPermissions.1.permission:
-        "configure"
+        "interact"
      issuedPermissions.0.permission:
-        "configure"
+        "interact"
    }
```

```diff
    contract SuccinctGateway (0x6c7a05e0AE641c6559fD76ac56641778B6eCd776) {
    +++ description: Users could interact with this contract to request proofs onchain, emitting a RequestCall event for off-chain provers to consume. Now deprecated, SP1 is used instead.
      issuedPermissions.0.permission:
-        "configure"
+        "interact"
    }
```

```diff
    contract Blobstream (0x7Cf3876F681Dbb6EdA8f6FfC45D66B996Df08fAe) {
    +++ description: The Blobstream DA bridge. This contract is used to bridge data commitments between Celestia and the destination chain. It specifies relayers that commit block ranges, but due to the lack of emitted events, there may be more relayers than are presented here.
      issuedPermissions.2.permission:
-        "configure"
+        "interact"
      issuedPermissions.1.permission:
-        "configure"
+        "interact"
      issuedPermissions.0.permission:
-        "configure"
+        "interact"
    }
```

```diff
    contract BlobstreamMultisig (0x8bF34D8df1eF0A8A7f27fC587202848E528018E6) {
    +++ description: None
      receivedPermissions.0.permission:
-        "configure"
+        "interact"
    }
```

```diff
    contract SuccinctGatewaySP1Multisig (0xCafEf00d348Adbd57c37d1B77e0619C6244C6878) {
    +++ description: None
      receivedPermissions.0.permission:
-        "configure"
+        "interact"
    }
```

```diff
    contract SuccinctGatewayMultisig (0xd1999B562e74d9fbf57b4479b3fe8748BDF4e4A0) {
    +++ description: None
      receivedPermissions.0.permission:
-        "configure"
+        "interact"
    }
```

```diff
    contract SP1Verifier (0xE00a3cBFC45241b33c0A44C78e26168CBc55EC63) {
    +++ description: None
      receivedPermissions.0.permission:
-        "configure"
+        "interact"
    }
```

Generated with discovered.json: 0x14d9dfd5c0ad3deaecd8c56aaa609438c78c1674

# Diff at Thu, 23 Jan 2025 09:36:18 GMT:

- chain: base
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@c34926fa70131af78b4ff8ff2873e9c9f24dfc80 block: 25112167
- current block number: 25417811

## Description

blobstreamProgramVkey updated: The new key is not found anywhere yet, the old one was associated with v4.

## Watched changes

```diff
    contract Blobstream (0xA83ca7775Bc2889825BcDeDfFa5b758cf69e8794) {
    +++ description: The Blobstream DA bridge. This contract is used to bridge data commitments between Celestia and the destination chain. It specifies relayers that commit block ranges, but due to the lack of emitted events, there may be more relayers than are presented here.
      values.blobstreamProgramVkey:
-        "0x00e30cadab0b8ad6a5f115c5131a14afce4ec4bbf8acf7c821951778a2d97660"
+        "0x00b6c8c78a73630fae80e45b2888a00d9ab0cc05a77cd7c027446a6ae2289928"
    }
```

Generated with discovered.json: 0xe01368d776dbe1537f65b3e696dc57631eeab2c0

# Diff at Thu, 23 Jan 2025 09:36:10 GMT:

- chain: arbitrum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@c34926fa70131af78b4ff8ff2873e9c9f24dfc80 block: 295956426
- current block number: 298391608

## Description

blobstreamProgramVkey updated: The new key is not found anywhere yet, the old one was associated with v4.

## Watched changes

```diff
    contract Blobstream (0xA83ca7775Bc2889825BcDeDfFa5b758cf69e8794) {
    +++ description: The Blobstream DA bridge. This contract is used to bridge data commitments between Celestia and the destination chain. It specifies relayers that commit block ranges, but due to the lack of emitted events, there may be more relayers than are presented here.
      values.blobstreamProgramVkey:
-        "0x00e30cadab0b8ad6a5f115c5131a14afce4ec4bbf8acf7c821951778a2d97660"
+        "0x00b6c8c78a73630fae80e45b2888a00d9ab0cc05a77cd7c027446a6ae2289928"
    }
```

Generated with discovered.json: 0x16c2ce3a509897f80928eb58665e33b2cee953dc

# Diff at Thu, 23 Jan 2025 09:36:01 GMT:

- chain: ethereum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@c34926fa70131af78b4ff8ff2873e9c9f24dfc80 block: 21635651
- current block number: 21686332

## Description

blobstreamProgramVkey updated: The new key is not found anywhere yet, the old one was associated with v4.

## Watched changes

```diff
    contract Blobstream (0x7Cf3876F681Dbb6EdA8f6FfC45D66B996Df08fAe) {
    +++ description: The Blobstream DA bridge. This contract is used to bridge data commitments between Celestia and the destination chain. It specifies relayers that commit block ranges, but due to the lack of emitted events, there may be more relayers than are presented here.
      values.blobstreamProgramVkey:
-        "0x00e30cadab0b8ad6a5f115c5131a14afce4ec4bbf8acf7c821951778a2d97660"
+        "0x00b6c8c78a73630fae80e45b2888a00d9ab0cc05a77cd7c027446a6ae2289928"
    }
```

Generated with discovered.json: 0x3ebec00f52e1351871d613148a0ea8ec93a1b94b

# Diff at Mon, 20 Jan 2025 11:10:37 GMT:

- chain: base
- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@2c8b4f3d9910bb6371be9b4df87b70856e7d8c64 block: 25112167
- current block number: 25112167

## Description

Rerun on the same block number. Applies fixes to permissions and via field. Renames permission's target to to/from.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 25112167 (main branch discovery), not current.

```diff
    contract SuccinctGatewaySP1 (0x3B6041173B80E77f038f3F2C0f9744f04837185e) {
    +++ description: This contract is the router for the bridge proofs verification. It stores the mapping between the identifier of the bridge circuit and the address of the onchain verifier contract.
      issuedPermissions.1.target:
-        "0xE00a3cBFC45241b33c0A44C78e26168CBc55EC63"
      issuedPermissions.1.to:
+        "0xE00a3cBFC45241b33c0A44C78e26168CBc55EC63"
      issuedPermissions.1.description:
+        "can verify proofs for the header range [latestBlock, targetBlock] proof."
      issuedPermissions.0.target:
-        "0xCafEf00d348Adbd57c37d1B77e0619C6244C6878"
      issuedPermissions.0.to:
+        "0xCafEf00d348Adbd57c37d1B77e0619C6244C6878"
      issuedPermissions.0.description:
+        "holds the power to affect the liveness and safety of the bridge - can transfer ownership, add and freeze verifier routes."
    }
```

```diff
    contract BlobstreamMultisig (0x6ABa5D2084362038C9640a8851ff3b8BCbA81Ca6) {
    +++ description: None
      receivedPermissions.1.target:
-        "0xA83ca7775Bc2889825BcDeDfFa5b758cf69e8794"
      receivedPermissions.1.from:
+        "0xA83ca7775Bc2889825BcDeDfFa5b758cf69e8794"
      receivedPermissions.0.target:
-        "0xA83ca7775Bc2889825BcDeDfFa5b758cf69e8794"
      receivedPermissions.0.from:
+        "0xA83ca7775Bc2889825BcDeDfFa5b758cf69e8794"
    }
```

```diff
    contract SuccinctGateway (0x6c7a05e0AE641c6559fD76ac56641778B6eCd776) {
    +++ description: Users could interact with this contract to request proofs onchain, emitting a RequestCall event for off-chain provers to consume. Now deprecated, SP1 is used instead.
      issuedPermissions.0.target:
-        "0xdC00f2469023a7b0b1D5b6abE2F736F90955e7F3"
      issuedPermissions.0.to:
+        "0xdC00f2469023a7b0b1D5b6abE2F736F90955e7F3"
      issuedPermissions.0.description:
+        "can renounce and transfer ownership, add and remove default prover, set fee vault, and recover stuck ETH."
    }
```

```diff
    contract Blobstream (0xA83ca7775Bc2889825BcDeDfFa5b758cf69e8794) {
    +++ description: The Blobstream DA bridge. This contract is used to bridge data commitments between Celestia and the destination chain. It specifies relayers that commit block ranges, but due to the lack of emitted events, there may be more relayers than are presented here.
      issuedPermissions.3.target:
-        "0x6ABa5D2084362038C9640a8851ff3b8BCbA81Ca6"
      issuedPermissions.3.to:
+        "0x6ABa5D2084362038C9640a8851ff3b8BCbA81Ca6"
      issuedPermissions.2.target:
-        "0x9c0B0dBBAe8a976CEeA8C2A96F6D00c53839afDC"
      issuedPermissions.2.to:
+        "0x9c0B0dBBAe8a976CEeA8C2A96F6D00c53839afDC"
      issuedPermissions.2.description:
+        "it is a 'Relayer' and can call commitHeaderRange() to commit block ranges. Since adding and removing Relayers emits no events, there can be more relayers than are presented here."
      issuedPermissions.1.target:
-        "0x6ABa5D2084362038C9640a8851ff3b8BCbA81Ca6"
      issuedPermissions.1.to:
+        "0x6ABa5D2084362038C9640a8851ff3b8BCbA81Ca6"
      issuedPermissions.1.description:
+        "can freeze the bridge contract and update the list of authorized relayers."
      issuedPermissions.0.target:
-        "0x3243552F3BcbcE720Db6f5ad0C1B7cd15458392D"
      issuedPermissions.0.to:
+        "0x3243552F3BcbcE720Db6f5ad0C1B7cd15458392D"
      issuedPermissions.0.description:
+        "it is a 'Relayer' and can call commitHeaderRange() to commit block ranges. Since adding and removing Relayers emits no events, there can be more relayers than are presented here."
    }
```

```diff
    contract SuccinctGatewaySP1Multisig (0xCafEf00d348Adbd57c37d1B77e0619C6244C6878) {
    +++ description: None
      receivedPermissions.0.target:
-        "0x3B6041173B80E77f038f3F2C0f9744f04837185e"
      receivedPermissions.0.from:
+        "0x3B6041173B80E77f038f3F2C0f9744f04837185e"
    }
```

```diff
    contract SuccinctGatewayMultisig (0xdC00f2469023a7b0b1D5b6abE2F736F90955e7F3) {
    +++ description: None
      receivedPermissions.0.target:
-        "0x6c7a05e0AE641c6559fD76ac56641778B6eCd776"
      receivedPermissions.0.from:
+        "0x6c7a05e0AE641c6559fD76ac56641778B6eCd776"
    }
```

```diff
    contract SP1Verifier (0xE00a3cBFC45241b33c0A44C78e26168CBc55EC63) {
    +++ description: None
      receivedPermissions.0.target:
-        "0x3B6041173B80E77f038f3F2C0f9744f04837185e"
      receivedPermissions.0.from:
+        "0x3B6041173B80E77f038f3F2C0f9744f04837185e"
    }
```

Generated with discovered.json: 0x09025dd2bd5e6d3c8d7fe47ac565179d0073fd06

# Diff at Mon, 20 Jan 2025 11:10:28 GMT:

- chain: arbitrum
- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@2c8b4f3d9910bb6371be9b4df87b70856e7d8c64 block: 295956426
- current block number: 295956426

## Description

Rerun on the same block number. Applies fixes to permissions and via field. Renames permission's target to to/from.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 295956426 (main branch discovery), not current.

```diff
    contract SuccinctGatewaySP1 (0x3B6041173B80E77f038f3F2C0f9744f04837185e) {
    +++ description: This contract is the router for the bridge proofs verification. It stores the mapping between the identifier of the bridge circuit and the address of the onchain verifier contract.
      issuedPermissions.1.target:
-        "0xE00a3cBFC45241b33c0A44C78e26168CBc55EC63"
      issuedPermissions.1.to:
+        "0xE00a3cBFC45241b33c0A44C78e26168CBc55EC63"
      issuedPermissions.1.description:
+        "can verify proofs for the header range [latestBlock, targetBlock] proof."
      issuedPermissions.0.target:
-        "0xCafEf00d348Adbd57c37d1B77e0619C6244C6878"
      issuedPermissions.0.to:
+        "0xCafEf00d348Adbd57c37d1B77e0619C6244C6878"
      issuedPermissions.0.description:
+        "holds the power to affect the liveness and safety of the bridge - can transfer ownership, add and freeze verifier routes."
    }
```

```diff
    contract SuccinctGateway (0x6c7a05e0AE641c6559fD76ac56641778B6eCd776) {
    +++ description: Users could interact with this contract to request proofs onchain, emitting a RequestCall event for off-chain provers to consume. Now deprecated, SP1 is used instead.
      issuedPermissions.0.target:
-        "0xdC00f2469023a7b0b1D5b6abE2F736F90955e7F3"
      issuedPermissions.0.to:
+        "0xdC00f2469023a7b0b1D5b6abE2F736F90955e7F3"
      issuedPermissions.0.description:
+        "can renounce and transfer ownership, add and remove default prover, set fee vault, and recover stuck ETH."
    }
```

```diff
    contract BlobstreamMultisig (0x738a9b55304f9fcF776B3BA285e50c0f9eF77997) {
    +++ description: None
      receivedPermissions.1.target:
-        "0xA83ca7775Bc2889825BcDeDfFa5b758cf69e8794"
      receivedPermissions.1.from:
+        "0xA83ca7775Bc2889825BcDeDfFa5b758cf69e8794"
      receivedPermissions.0.target:
-        "0xA83ca7775Bc2889825BcDeDfFa5b758cf69e8794"
      receivedPermissions.0.from:
+        "0xA83ca7775Bc2889825BcDeDfFa5b758cf69e8794"
    }
```

```diff
    contract Blobstream (0xA83ca7775Bc2889825BcDeDfFa5b758cf69e8794) {
    +++ description: The Blobstream DA bridge. This contract is used to bridge data commitments between Celestia and the destination chain. It specifies relayers that commit block ranges, but due to the lack of emitted events, there may be more relayers than are presented here.
      issuedPermissions.3.target:
-        "0x738a9b55304f9fcF776B3BA285e50c0f9eF77997"
      issuedPermissions.3.to:
+        "0x738a9b55304f9fcF776B3BA285e50c0f9eF77997"
      issuedPermissions.2.target:
-        "0x9c0B0dBBAe8a976CEeA8C2A96F6D00c53839afDC"
      issuedPermissions.2.to:
+        "0x9c0B0dBBAe8a976CEeA8C2A96F6D00c53839afDC"
      issuedPermissions.2.description:
+        "it is a 'Relayer' and can call commitHeaderRange() to commit block ranges. Since adding and removing Relayers emits no events, there can be more relayers than are presented here."
      issuedPermissions.1.target:
-        "0x738a9b55304f9fcF776B3BA285e50c0f9eF77997"
      issuedPermissions.1.to:
+        "0x738a9b55304f9fcF776B3BA285e50c0f9eF77997"
      issuedPermissions.1.description:
+        "can freeze the bridge contract and update the list of authorized relayers."
      issuedPermissions.0.target:
-        "0x3243552F3BcbcE720Db6f5ad0C1B7cd15458392D"
      issuedPermissions.0.to:
+        "0x3243552F3BcbcE720Db6f5ad0C1B7cd15458392D"
      issuedPermissions.0.description:
+        "it is a 'Relayer' and can call commitHeaderRange() to commit block ranges. Since adding and removing Relayers emits no events, there can be more relayers than are presented here."
    }
```

```diff
    contract SuccinctGatewaySP1Multisig (0xCafEf00d348Adbd57c37d1B77e0619C6244C6878) {
    +++ description: None
      receivedPermissions.0.target:
-        "0x3B6041173B80E77f038f3F2C0f9744f04837185e"
      receivedPermissions.0.from:
+        "0x3B6041173B80E77f038f3F2C0f9744f04837185e"
    }
```

```diff
    contract SuccinctGatewayMultisig (0xdC00f2469023a7b0b1D5b6abE2F736F90955e7F3) {
    +++ description: None
      receivedPermissions.0.target:
-        "0x6c7a05e0AE641c6559fD76ac56641778B6eCd776"
      receivedPermissions.0.from:
+        "0x6c7a05e0AE641c6559fD76ac56641778B6eCd776"
    }
```

```diff
    contract  (0xE00a3cBFC45241b33c0A44C78e26168CBc55EC63) {
    +++ description: None
      receivedPermissions.0.target:
-        "0x3B6041173B80E77f038f3F2C0f9744f04837185e"
      receivedPermissions.0.from:
+        "0x3B6041173B80E77f038f3F2C0f9744f04837185e"
    }
```

Generated with discovered.json: 0xfd8c7ecff1a061e92b4848378cee6b1205033e35

# Diff at Mon, 20 Jan 2025 11:09:19 GMT:

- chain: ethereum
- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@2c8b4f3d9910bb6371be9b4df87b70856e7d8c64 block: 21635651
- current block number: 21635651

## Description

Rerun on the same block number. Applies fixes to permissions and via field. Renames permission's target to to/from.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21635651 (main branch discovery), not current.

```diff
    contract SuccinctGatewaySP1 (0x3B6041173B80E77f038f3F2C0f9744f04837185e) {
    +++ description: This contract is the router for the bridge proofs verification. It stores the mapping between the identifier of the bridge circuit and the address of the onchain verifier contract.
      issuedPermissions.1.target:
-        "0xE00a3cBFC45241b33c0A44C78e26168CBc55EC63"
      issuedPermissions.1.to:
+        "0xE00a3cBFC45241b33c0A44C78e26168CBc55EC63"
      issuedPermissions.1.description:
+        "can verify proofs for the header range [latestBlock, targetBlock] proof."
      issuedPermissions.0.target:
-        "0xCafEf00d348Adbd57c37d1B77e0619C6244C6878"
      issuedPermissions.0.to:
+        "0xCafEf00d348Adbd57c37d1B77e0619C6244C6878"
      issuedPermissions.0.description:
+        "holds the power to affect the liveness and safety of the bridge - can transfer ownership, add and freeze verifier routes."
    }
```

```diff
    contract SuccinctGateway (0x6c7a05e0AE641c6559fD76ac56641778B6eCd776) {
    +++ description: Users could interact with this contract to request proofs onchain, emitting a RequestCall event for off-chain provers to consume. Now deprecated, SP1 is used instead.
      issuedPermissions.0.target:
-        "0xd1999B562e74d9fbf57b4479b3fe8748BDF4e4A0"
      issuedPermissions.0.to:
+        "0xd1999B562e74d9fbf57b4479b3fe8748BDF4e4A0"
      issuedPermissions.0.description:
+        "can renounce and transfer ownership, add and remove default prover, set fee vault, and recover stuck ETH."
    }
```

```diff
    contract Blobstream (0x7Cf3876F681Dbb6EdA8f6FfC45D66B996Df08fAe) {
    +++ description: The Blobstream DA bridge. This contract is used to bridge data commitments between Celestia and the destination chain. It specifies relayers that commit block ranges, but due to the lack of emitted events, there may be more relayers than are presented here.
      issuedPermissions.3.target:
-        "0x8bF34D8df1eF0A8A7f27fC587202848E528018E6"
      issuedPermissions.3.to:
+        "0x8bF34D8df1eF0A8A7f27fC587202848E528018E6"
      issuedPermissions.2.target:
-        "0x9c0B0dBBAe8a976CEeA8C2A96F6D00c53839afDC"
      issuedPermissions.2.to:
+        "0x9c0B0dBBAe8a976CEeA8C2A96F6D00c53839afDC"
      issuedPermissions.2.description:
+        "it is a 'Relayer' and can call commitHeaderRange() to commit block ranges. Since adding and removing Relayers emits no events, there can be more relayers than are presented here."
      issuedPermissions.1.target:
-        "0x8bF34D8df1eF0A8A7f27fC587202848E528018E6"
      issuedPermissions.1.to:
+        "0x8bF34D8df1eF0A8A7f27fC587202848E528018E6"
      issuedPermissions.1.description:
+        "can freeze the bridge contract and update the list of authorized relayers."
      issuedPermissions.0.target:
-        "0x3243552F3BcbcE720Db6f5ad0C1B7cd15458392D"
      issuedPermissions.0.to:
+        "0x3243552F3BcbcE720Db6f5ad0C1B7cd15458392D"
      issuedPermissions.0.description:
+        "it is a 'Relayer' and can call commitHeaderRange() to commit block ranges. Since adding and removing Relayers emits no events, there can be more relayers than are presented here."
    }
```

```diff
    contract BlobstreamMultisig (0x8bF34D8df1eF0A8A7f27fC587202848E528018E6) {
    +++ description: None
      receivedPermissions.1.target:
-        "0x7Cf3876F681Dbb6EdA8f6FfC45D66B996Df08fAe"
      receivedPermissions.1.from:
+        "0x7Cf3876F681Dbb6EdA8f6FfC45D66B996Df08fAe"
      receivedPermissions.0.target:
-        "0x7Cf3876F681Dbb6EdA8f6FfC45D66B996Df08fAe"
      receivedPermissions.0.from:
+        "0x7Cf3876F681Dbb6EdA8f6FfC45D66B996Df08fAe"
    }
```

```diff
    contract SuccinctGatewaySP1Multisig (0xCafEf00d348Adbd57c37d1B77e0619C6244C6878) {
    +++ description: None
      receivedPermissions.0.target:
-        "0x3B6041173B80E77f038f3F2C0f9744f04837185e"
      receivedPermissions.0.from:
+        "0x3B6041173B80E77f038f3F2C0f9744f04837185e"
    }
```

```diff
    contract SuccinctGatewayMultisig (0xd1999B562e74d9fbf57b4479b3fe8748BDF4e4A0) {
    +++ description: None
      receivedPermissions.0.target:
-        "0x6c7a05e0AE641c6559fD76ac56641778B6eCd776"
      receivedPermissions.0.from:
+        "0x6c7a05e0AE641c6559fD76ac56641778B6eCd776"
    }
```

```diff
    contract SP1Verifier (0xE00a3cBFC45241b33c0A44C78e26168CBc55EC63) {
    +++ description: None
      receivedPermissions.0.target:
-        "0x3B6041173B80E77f038f3F2C0f9744f04837185e"
      receivedPermissions.0.from:
+        "0x3B6041173B80E77f038f3F2C0f9744f04837185e"
    }
```

Generated with discovered.json: 0x598612d118d939851b19435d5390a7fae553afb9

# Diff at Mon, 20 Jan 2025 09:25:54 GMT:

- chain: base
- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@82d3b5c180381f7d2d0e30406b2ac10025d0614f block: 25112167
- current block number: 25112167

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 25112167 (main branch discovery), not current.

```diff
    contract SuccinctGateway (0x6c7a05e0AE641c6559fD76ac56641778B6eCd776) {
    +++ description: Users could interact with this contract to request proofs onchain, emitting a RequestCall event for off-chain provers to consume. Now deprecated, SP1 is used instead.
      fieldMeta.headerRangeProvers.type:
+        "PERMISSION"
      fieldMeta.nextHeaderProvers.type:
+        "PERMISSION"
    }
```

Generated with discovered.json: 0xf4f7a07aa780a1e95f0e748cb84b132c3f2d4eb8

# Diff at Mon, 20 Jan 2025 09:25:46 GMT:

- chain: arbitrum
- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@82d3b5c180381f7d2d0e30406b2ac10025d0614f block: 295956426
- current block number: 295956426

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 295956426 (main branch discovery), not current.

```diff
    contract SuccinctGateway (0x6c7a05e0AE641c6559fD76ac56641778B6eCd776) {
    +++ description: Users could interact with this contract to request proofs onchain, emitting a RequestCall event for off-chain provers to consume. Now deprecated, SP1 is used instead.
      fieldMeta.headerRangeProvers.type:
+        "PERMISSION"
      fieldMeta.nextHeaderProvers.type:
+        "PERMISSION"
    }
```

Generated with discovered.json: 0xf53eab3132787e0bcb46a499a4cfb935af3baa3c

# Diff at Mon, 20 Jan 2025 09:24:33 GMT:

- chain: ethereum
- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@82d3b5c180381f7d2d0e30406b2ac10025d0614f block: 21635651
- current block number: 21635651

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21635651 (main branch discovery), not current.

```diff
    contract SuccinctGateway (0x6c7a05e0AE641c6559fD76ac56641778B6eCd776) {
    +++ description: Users could interact with this contract to request proofs onchain, emitting a RequestCall event for off-chain provers to consume. Now deprecated, SP1 is used instead.
      fieldMeta.headerRangeProvers.type:
+        "PERMISSION"
      fieldMeta.nextHeaderProvers.type:
+        "PERMISSION"
    }
```

Generated with discovered.json: 0x033936bc27cb3f4400257157fea42bf0205fc92a

# Diff at Thu, 16 Jan 2025 12:10:00 GMT:

- chain: base
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@3513cb068688b9fa7f9ddd40447f5f70d088c2cf block: 25072565
- current block number: 25112167

## Description

New verifier added, old one frozen.

## Watched changes

```diff
    contract SuccinctGatewaySP1 (0x3B6041173B80E77f038f3F2C0f9744f04837185e) {
    +++ description: This contract is the router for the bridge proofs verification. It stores the mapping between the identifier of the bridge circuit and the address of the onchain verifier contract.
+++ description: The prover contract address for SP1, and whether it is frozen (true if frozen). This prover route was frozen on 2025-01-15.
      values.oldVerifier5.1:
-        false
+        true
    }
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 25072565 (main branch discovery), not current.

```diff
    contract SuccinctGatewaySP1 (0x3B6041173B80E77f038f3F2C0f9744f04837185e) {
    +++ description: This contract is the router for the bridge proofs verification. It stores the mapping between the identifier of the bridge circuit and the address of the onchain verifier contract.
      issuedPermissions.1.target:
-        "0xd2832Cf1fC8bA210FfABF62Db9A8781153131d16"
+        "0xE00a3cBFC45241b33c0A44C78e26168CBc55EC63"
+++ description: The prover contract address for SP1, and whether it is frozen (true if frozen).
      values.verifier.0:
-        "0xd2832Cf1fC8bA210FfABF62Db9A8781153131d16"
+        "0xE00a3cBFC45241b33c0A44C78e26168CBc55EC63"
+++ description: The prover contract address for SP1, and whether it is frozen (true if frozen). This prover route was frozen on 2025-01-15.
      values.oldVerifier5:
+        ["0xd2832Cf1fC8bA210FfABF62Db9A8781153131d16",false]
      fieldMeta.oldVerifier5:
+        {"description":"The prover contract address for SP1, and whether it is frozen (true if frozen). This prover route was frozen on 2025-01-15."}
    }
```

```diff
    contract SP1Verifier (0xd2832Cf1fC8bA210FfABF62Db9A8781153131d16) {
    +++ description: None
      receivedPermissions:
-        [{"permission":"configure","target":"0x3B6041173B80E77f038f3F2C0f9744f04837185e","description":"can verify proofs for the header range [latestBlock, targetBlock] proof."}]
    }
```

```diff
+   Status: CREATED
    contract SP1Verifier (0xE00a3cBFC45241b33c0A44C78e26168CBc55EC63)
    +++ description: None
```

Generated with discovered.json: 0xb9ccffd6d2e21579c4c48259739aa72df6b91bdd

# Diff at Thu, 16 Jan 2025 12:09:56 GMT:

- chain: arbitrum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@3513cb068688b9fa7f9ddd40447f5f70d088c2cf block: 295640184
- current block number: 295956426

## Description

New verifier added, old one frozen.

## Watched changes

```diff
    contract SuccinctGatewaySP1 (0x3B6041173B80E77f038f3F2C0f9744f04837185e) {
    +++ description: This contract is the router for the bridge proofs verification. It stores the mapping between the identifier of the bridge circuit and the address of the onchain verifier contract.
+++ description: The prover contract address for SP1, and whether it is frozen (true if frozen). This prover route was frozen on 2025-01-15.
      values.oldVerifier5.1:
-        false
+        true
    }
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 295640184 (main branch discovery), not current.

```diff
    contract SuccinctGatewaySP1 (0x3B6041173B80E77f038f3F2C0f9744f04837185e) {
    +++ description: This contract is the router for the bridge proofs verification. It stores the mapping between the identifier of the bridge circuit and the address of the onchain verifier contract.
      issuedPermissions.1.target:
-        "0xd2832Cf1fC8bA210FfABF62Db9A8781153131d16"
+        "0xE00a3cBFC45241b33c0A44C78e26168CBc55EC63"
+++ description: The prover contract address for SP1, and whether it is frozen (true if frozen).
      values.verifier.0:
-        "0xd2832Cf1fC8bA210FfABF62Db9A8781153131d16"
+        "0xE00a3cBFC45241b33c0A44C78e26168CBc55EC63"
+++ description: The prover contract address for SP1, and whether it is frozen (true if frozen). This prover route was frozen on 2025-01-15.
      values.oldVerifier5:
+        ["0xd2832Cf1fC8bA210FfABF62Db9A8781153131d16",false]
      fieldMeta.oldVerifier5:
+        {"description":"The prover contract address for SP1, and whether it is frozen (true if frozen). This prover route was frozen on 2025-01-15."}
    }
```

```diff
    contract  (0xd2832Cf1fC8bA210FfABF62Db9A8781153131d16) {
    +++ description: None
      receivedPermissions:
-        [{"permission":"configure","target":"0x3B6041173B80E77f038f3F2C0f9744f04837185e","description":"can verify proofs for the header range [latestBlock, targetBlock] proof."}]
    }
```

```diff
+   Status: CREATED
    contract  (0xE00a3cBFC45241b33c0A44C78e26168CBc55EC63)
    +++ description: None
```

Generated with discovered.json: 0x38336130d165bbbbafde106d7b0cc84281eaa0c3

# Diff at Thu, 16 Jan 2025 12:09:49 GMT:

- chain: ethereum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@3513cb068688b9fa7f9ddd40447f5f70d088c2cf block: 21629081
- current block number: 21635651

## Description

New verifier added, old one frozen.

## Watched changes

```diff
    contract SuccinctGatewaySP1 (0x3B6041173B80E77f038f3F2C0f9744f04837185e) {
    +++ description: This contract is the router for the bridge proofs verification. It stores the mapping between the identifier of the bridge circuit and the address of the onchain verifier contract.
+++ description: The prover contract address for SP1, and whether it is frozen (true if frozen). This prover route was frozen on 2025-01-15.
      values.oldVerifier5.1:
-        false
+        true
    }
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21629081 (main branch discovery), not current.

```diff
    contract SuccinctGatewaySP1 (0x3B6041173B80E77f038f3F2C0f9744f04837185e) {
    +++ description: This contract is the router for the bridge proofs verification. It stores the mapping between the identifier of the bridge circuit and the address of the onchain verifier contract.
      issuedPermissions.1.target:
-        "0xd2832Cf1fC8bA210FfABF62Db9A8781153131d16"
+        "0xE00a3cBFC45241b33c0A44C78e26168CBc55EC63"
+++ description: The prover contract address for SP1, and whether it is frozen (true if frozen).
      values.verifier.0:
-        "0xd2832Cf1fC8bA210FfABF62Db9A8781153131d16"
+        "0xE00a3cBFC45241b33c0A44C78e26168CBc55EC63"
+++ description: The prover contract address for SP1, and whether it is frozen (true if frozen). This prover route was frozen on 2025-01-15.
      values.oldVerifier5:
+        ["0xd2832Cf1fC8bA210FfABF62Db9A8781153131d16",false]
      fieldMeta.oldVerifier5:
+        {"description":"The prover contract address for SP1, and whether it is frozen (true if frozen). This prover route was frozen on 2025-01-15."}
    }
```

```diff
    contract SP1Verifier (0xd2832Cf1fC8bA210FfABF62Db9A8781153131d16) {
    +++ description: None
      receivedPermissions:
-        [{"permission":"configure","target":"0x3B6041173B80E77f038f3F2C0f9744f04837185e","description":"can verify proofs for the header range [latestBlock, targetBlock] proof."}]
    }
```

```diff
+   Status: CREATED
    contract SP1Verifier (0xE00a3cBFC45241b33c0A44C78e26168CBc55EC63)
    +++ description: None
```

Generated with discovered.json: 0x6286fe7d65df00c74c33fdfb8bdc278b379f5dac

# Diff at Wed, 15 Jan 2025 09:48:19 GMT:

- chain: base
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@3ea176aee1470e5ec80e65adfc81a954f84584d8 block: 24772641
- current block number: 25072565

## Description

New Vkey: [v4](https://github.com/succinctlabs/sp1-blobstream/blob/89e058052c0b691898c5b56a62a6fa0270b31627/contracts/script/UpdateVkey.s.sol#L26).

## Watched changes

```diff
    contract Blobstream (0xA83ca7775Bc2889825BcDeDfFa5b758cf69e8794) {
    +++ description: The Blobstream DA bridge. This contract is used to bridge data commitments between Celestia and the destination chain. It specifies relayers that commit block ranges, but due to the lack of emitted events, there may be more relayers than are presented here.
      values.blobstreamProgramVkey:
-        "0x00a6ea49173d4b0b544a24a5a7474e76d1fda8f0f7e541cbb294d2b7249d7bcb"
+        "0x00e30cadab0b8ad6a5f115c5131a14afce4ec4bbf8acf7c821951778a2d97660"
    }
```

Generated with discovered.json: 0xc85fe843d7daa3f1271d257125f4cc727226bf75

# Diff at Wed, 15 Jan 2025 09:47:59 GMT:

- chain: arbitrum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@3ea176aee1470e5ec80e65adfc81a954f84584d8 block: 293252435
- current block number: 295640184

## Description

New Vkey: [v4](https://github.com/succinctlabs/sp1-blobstream/blob/89e058052c0b691898c5b56a62a6fa0270b31627/contracts/script/UpdateVkey.s.sol#L26).

## Watched changes

```diff
    contract Blobstream (0xA83ca7775Bc2889825BcDeDfFa5b758cf69e8794) {
    +++ description: The Blobstream DA bridge. This contract is used to bridge data commitments between Celestia and the destination chain. It specifies relayers that commit block ranges, but due to the lack of emitted events, there may be more relayers than are presented here.
      values.blobstreamProgramVkey:
-        "0x00a6ea49173d4b0b544a24a5a7474e76d1fda8f0f7e541cbb294d2b7249d7bcb"
+        "0x00e30cadab0b8ad6a5f115c5131a14afce4ec4bbf8acf7c821951778a2d97660"
    }
```

Generated with discovered.json: 0xae65751f0532cda70552bc10859a5e05344a4db0

# Diff at Wed, 15 Jan 2025 09:47:41 GMT:

- chain: ethereum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@3ea176aee1470e5ec80e65adfc81a954f84584d8 block: 21579366
- current block number: 21629081

## Description

New Vkey: [v4](https://github.com/succinctlabs/sp1-blobstream/blob/89e058052c0b691898c5b56a62a6fa0270b31627/contracts/script/UpdateVkey.s.sol#L26).

## Watched changes

```diff
    contract Blobstream (0x7Cf3876F681Dbb6EdA8f6FfC45D66B996Df08fAe) {
    +++ description: The Blobstream DA bridge. This contract is used to bridge data commitments between Celestia and the destination chain. It specifies relayers that commit block ranges, but due to the lack of emitted events, there may be more relayers than are presented here.
      values.blobstreamProgramVkey:
-        "0x00a6ea49173d4b0b544a24a5a7474e76d1fda8f0f7e541cbb294d2b7249d7bcb"
+        "0x00e30cadab0b8ad6a5f115c5131a14afce4ec4bbf8acf7c821951778a2d97660"
    }
```

Generated with discovered.json: 0xdb2b5c704d7ff88d4e06fdd48ea0c7fa14ca5416

# Diff at Wed, 08 Jan 2025 11:10:38 GMT:

- chain: base
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@3e3597c92f09cb5fc5a7ac01db63929f663c026f block: 23434494
- current block number: 24772641

## Description

Remove relayer1 as it is no longer approved.

## Watched changes

```diff
    contract Blobstream (0xA83ca7775Bc2889825BcDeDfFa5b758cf69e8794) {
    +++ description: The Blobstream DA bridge. This contract is used to bridge data commitments between Celestia and the destination chain. It specifies relayers that commit block ranges, but due to the lack of emitted events, there may be more relayers than are presented here.
      values.isRelayer1Approved:
-        true
+        false
    }
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 23434494 (main branch discovery), not current.

```diff
    contract Blobstream (0xA83ca7775Bc2889825BcDeDfFa5b758cf69e8794) {
    +++ description: The Blobstream DA bridge. This contract is used to bridge data commitments between Celestia and the destination chain. It specifies relayers that commit block ranges, but due to the lack of emitted events, there may be more relayers than are presented here.
      issuedPermissions.4:
-        {"permission":"upgrade","target":"0x6ABa5D2084362038C9640a8851ff3b8BCbA81Ca6","via":[]}
      issuedPermissions.3.permission:
-        "configure"
+        "upgrade"
      issuedPermissions.3.target:
-        "0x9c0B0dBBAe8a976CEeA8C2A96F6D00c53839afDC"
+        "0x6ABa5D2084362038C9640a8851ff3b8BCbA81Ca6"
      issuedPermissions.2.target:
-        "0x6ABa5D2084362038C9640a8851ff3b8BCbA81Ca6"
+        "0x9c0B0dBBAe8a976CEeA8C2A96F6D00c53839afDC"
      issuedPermissions.1.target:
-        "0x44eB418A966ff47f5AF6f48AEa6Afde0bf193a8d"
+        "0x6ABa5D2084362038C9640a8851ff3b8BCbA81Ca6"
      values.relayers.2:
-        "0x9c0b0dbbae8a976ceea8c2a96f6d00c53839afdc"
      values.relayers.1:
-        "0x3243552f3bcbce720db6f5ad0c1b7cd15458392d"
+        "0x9c0b0dbbae8a976ceea8c2a96f6d00c53839afdc"
      values.relayers.0:
-        "0x44eb418a966ff47f5af6f48aea6afde0bf193a8d"
+        "0x3243552f3bcbce720db6f5ad0c1b7cd15458392d"
    }
```

Generated with discovered.json: 0xdec784644d4c02d5cdca179e038695d5b0d47320

# Diff at Wed, 08 Jan 2025 11:10:31 GMT:

- chain: arbitrum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@3e3597c92f09cb5fc5a7ac01db63929f663c026f block: 282615739
- current block number: 293252435

## Description

Remove relayer1 as it is no longer approved.

## Watched changes

```diff
    contract Blobstream (0xA83ca7775Bc2889825BcDeDfFa5b758cf69e8794) {
    +++ description: The Blobstream DA bridge. This contract is used to bridge data commitments between Celestia and the destination chain. It specifies relayers that commit block ranges, but due to the lack of emitted events, there may be more relayers than are presented here.
      values.isRelayer1Approved:
-        true
+        false
    }
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 282615739 (main branch discovery), not current.

```diff
    contract Blobstream (0xA83ca7775Bc2889825BcDeDfFa5b758cf69e8794) {
    +++ description: The Blobstream DA bridge. This contract is used to bridge data commitments between Celestia and the destination chain. It specifies relayers that commit block ranges, but due to the lack of emitted events, there may be more relayers than are presented here.
      issuedPermissions.4:
-        {"permission":"upgrade","target":"0x738a9b55304f9fcF776B3BA285e50c0f9eF77997","via":[]}
      issuedPermissions.3.permission:
-        "configure"
+        "upgrade"
      issuedPermissions.3.target:
-        "0x9c0B0dBBAe8a976CEeA8C2A96F6D00c53839afDC"
+        "0x738a9b55304f9fcF776B3BA285e50c0f9eF77997"
      issuedPermissions.2.target:
-        "0x738a9b55304f9fcF776B3BA285e50c0f9eF77997"
+        "0x9c0B0dBBAe8a976CEeA8C2A96F6D00c53839afDC"
      issuedPermissions.1.target:
-        "0x44eB418A966ff47f5AF6f48AEa6Afde0bf193a8d"
+        "0x738a9b55304f9fcF776B3BA285e50c0f9eF77997"
      values.relayers.2:
-        "0x9c0b0dbbae8a976ceea8c2a96f6d00c53839afdc"
      values.relayers.1:
-        "0x3243552f3bcbce720db6f5ad0c1b7cd15458392d"
+        "0x9c0b0dbbae8a976ceea8c2a96f6d00c53839afdc"
      values.relayers.0:
-        "0x44eb418a966ff47f5af6f48aea6afde0bf193a8d"
+        "0x3243552f3bcbce720db6f5ad0c1b7cd15458392d"
    }
```

Generated with discovered.json: 0x3fc6d16fd0bc56f6bef0d311321a3bb6e02d71f9

# Diff at Wed, 08 Jan 2025 11:10:26 GMT:

- chain: ethereum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@3e3597c92f09cb5fc5a7ac01db63929f663c026f block: 21435567
- current block number: 21579366

## Description

Remove relayer1 as it is no longer approved.

## Watched changes

```diff
    contract Blobstream (0x7Cf3876F681Dbb6EdA8f6FfC45D66B996Df08fAe) {
    +++ description: The Blobstream DA bridge. This contract is used to bridge data commitments between Celestia and the destination chain. It specifies relayers that commit block ranges, but due to the lack of emitted events, there may be more relayers than are presented here.
      values.isRelayer1Approved:
-        true
+        false
    }
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21435567 (main branch discovery), not current.

```diff
    contract Blobstream (0x7Cf3876F681Dbb6EdA8f6FfC45D66B996Df08fAe) {
    +++ description: The Blobstream DA bridge. This contract is used to bridge data commitments between Celestia and the destination chain. It specifies relayers that commit block ranges, but due to the lack of emitted events, there may be more relayers than are presented here.
      issuedPermissions.4:
-        {"permission":"upgrade","target":"0x8bF34D8df1eF0A8A7f27fC587202848E528018E6","via":[]}
      issuedPermissions.3.permission:
-        "configure"
+        "upgrade"
      issuedPermissions.3.target:
-        "0x9c0B0dBBAe8a976CEeA8C2A96F6D00c53839afDC"
+        "0x8bF34D8df1eF0A8A7f27fC587202848E528018E6"
      issuedPermissions.2.target:
-        "0x8bF34D8df1eF0A8A7f27fC587202848E528018E6"
+        "0x9c0B0dBBAe8a976CEeA8C2A96F6D00c53839afDC"
      issuedPermissions.1.target:
-        "0x44eB418A966ff47f5AF6f48AEa6Afde0bf193a8d"
+        "0x8bF34D8df1eF0A8A7f27fC587202848E528018E6"
      values.relayers.2:
-        "0x9c0b0dbbae8a976ceea8c2a96f6d00c53839afdc"
      values.relayers.1:
-        "0x3243552f3bcbce720db6f5ad0c1b7cd15458392d"
+        "0x9c0b0dbbae8a976ceea8c2a96f6d00c53839afdc"
      values.relayers.0:
-        "0x44eb418a966ff47f5af6f48aea6afde0bf193a8d"
+        "0x3243552f3bcbce720db6f5ad0c1b7cd15458392d"
    }
```

Generated with discovered.json: 0xc37c9a7827e8491dac4b8ea540fa17c6abe038e5

# Diff at Thu, 19 Dec 2024 11:57:29 GMT:

- chain: arbitrum
- author: Michał Podsiadły (<michal.podsiadly@l2beat.com>)
- comparing to: main@1e850509cf42792486a5c52f33b2bb56c3de2df1 block: 282615739
- current block number: 282615739

## Description

Discovery rerun on the same block number with only config-related changes.
Properly resolve $admin.
Resolve old Gateway owner's permissions.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 282615739 (main branch discovery), not current.

```diff
    contract HeaderRangeVerifier (0x4d0C32ddA9De7CD89e198cFe5E01470A49b8acD3) {
    +++ description: None
      name:
-        "headerRangeVerifier"
+        "HeaderRangeVerifier"
    }
```

```diff
    contract SuccinctGateway (0x6c7a05e0AE641c6559fD76ac56641778B6eCd776) {
    +++ description: Users could interact with this contract to request proofs onchain, emitting a RequestCall event for off-chain provers to consume. Now deprecated, SP1 is used instead.
      template:
+        "succinct/SuccinctGateway"
      description:
+        "Users could interact with this contract to request proofs onchain, emitting a RequestCall event for off-chain provers to consume. Now deprecated, SP1 is used instead."
      issuedPermissions:
+        [{"permission":"configure","target":"0xdC00f2469023a7b0b1D5b6abE2F736F90955e7F3","via":[]}]
    }
```

```diff
    contract BlobstreamMultisig (0x738a9b55304f9fcF776B3BA285e50c0f9eF77997) {
    +++ description: None
      receivedPermissions:
+        [{"permission":"configure","target":"0xA83ca7775Bc2889825BcDeDfFa5b758cf69e8794","description":"can freeze the bridge contract and update the list of authorized relayers."},{"permission":"upgrade","target":"0xA83ca7775Bc2889825BcDeDfFa5b758cf69e8794"}]
    }
```

```diff
    contract Blobstream (0xA83ca7775Bc2889825BcDeDfFa5b758cf69e8794) {
    +++ description: The Blobstream DA bridge. This contract is used to bridge data commitments between Celestia and the destination chain. It specifies relayers that commit block ranges, but due to the lack of emitted events, there may be more relayers than are presented here.
      values.$admin:
-        "0x0000000000000000000000000000000000000000"
+        ["0x738a9b55304f9fcF776B3BA285e50c0f9eF77997"]
      values.isRelayerApproved:
-        true
      values.relayers.2:
+        "0x9c0b0dbbae8a976ceea8c2a96f6d00c53839afdc"
      values.relayers.1:
+        "0x3243552f3bcbce720db6f5ad0c1b7cd15458392d"
      values.guardians:
+        ["0x738a9b55304f9fcF776B3BA285e50c0f9eF77997"]
      values.isRelayer1Approved:
+        true
      values.isRelayer2Approved:
+        true
      values.isRelayer3Approved:
+        true
      description:
+        "The Blobstream DA bridge. This contract is used to bridge data commitments between Celestia and the destination chain. It specifies relayers that commit block ranges, but due to the lack of emitted events, there may be more relayers than are presented here."
      issuedPermissions:
+        [{"permission":"configure","target":"0x3243552F3BcbcE720Db6f5ad0C1B7cd15458392D","via":[]},{"permission":"configure","target":"0x44eB418A966ff47f5AF6f48AEa6Afde0bf193a8d","via":[]},{"permission":"configure","target":"0x738a9b55304f9fcF776B3BA285e50c0f9eF77997","via":[]},{"permission":"configure","target":"0x9c0B0dBBAe8a976CEeA8C2A96F6D00c53839afDC","via":[]},{"permission":"upgrade","target":"0x738a9b55304f9fcF776B3BA285e50c0f9eF77997","via":[]}]
    }
```

```diff
    contract SuccinctGatewayMultisig (0xdC00f2469023a7b0b1D5b6abE2F736F90955e7F3) {
    +++ description: None
      receivedPermissions:
+        [{"permission":"configure","target":"0x6c7a05e0AE641c6559fD76ac56641778B6eCd776","description":"can renounce and transfer ownership, add and remove default prover, set fee vault, and recover stuck ETH."}]
    }
```

```diff
    contract NextHeaderVerifier (0xfEA1EFaE3cDe8C524168726a7fc46BF2134bb72C) {
    +++ description: None
      name:
-        "nextHeaderVerifier"
+        "NextHeaderVerifier"
    }
```

Generated with discovered.json: 0x59df2631957c2fcd2298bc15d340ec886934759c

# Diff at Thu, 19 Dec 2024 11:57:29 GMT:

- chain: base
- author: Michał Podsiadły (<michal.podsiadly@l2beat.com>)
- comparing to: main@1e850509cf42792486a5c52f33b2bb56c3de2df1 block: 23434494
- current block number: 23434494

## Description

Discovery rerun on the same block number with only config-related changes.
Properly resolve $admin.
Resolve old Gateway owner's permissions.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 23434494 (main branch discovery), not current.

```diff
    contract BlobstreamMultisig (0x6ABa5D2084362038C9640a8851ff3b8BCbA81Ca6) {
    +++ description: None
      receivedPermissions:
+        [{"permission":"configure","target":"0xA83ca7775Bc2889825BcDeDfFa5b758cf69e8794","description":"can freeze the bridge contract and update the list of authorized relayers."},{"permission":"upgrade","target":"0xA83ca7775Bc2889825BcDeDfFa5b758cf69e8794"}]
    }
```

```diff
    contract SuccinctGateway (0x6c7a05e0AE641c6559fD76ac56641778B6eCd776) {
    +++ description: Users could interact with this contract to request proofs onchain, emitting a RequestCall event for off-chain provers to consume. Now deprecated, SP1 is used instead.
      template:
+        "succinct/SuccinctGateway"
      description:
+        "Users could interact with this contract to request proofs onchain, emitting a RequestCall event for off-chain provers to consume. Now deprecated, SP1 is used instead."
      issuedPermissions:
+        [{"permission":"configure","target":"0xdC00f2469023a7b0b1D5b6abE2F736F90955e7F3","via":[]}]
    }
```

```diff
    contract Blobstream (0xA83ca7775Bc2889825BcDeDfFa5b758cf69e8794) {
    +++ description: The Blobstream DA bridge. This contract is used to bridge data commitments between Celestia and the destination chain. It specifies relayers that commit block ranges, but due to the lack of emitted events, there may be more relayers than are presented here.
      values.$admin:
-        "0x0000000000000000000000000000000000000000"
+        ["0x6ABa5D2084362038C9640a8851ff3b8BCbA81Ca6"]
      values.isRelayerApproved:
-        true
      values.relayers.2:
+        "0x9c0b0dbbae8a976ceea8c2a96f6d00c53839afdc"
      values.relayers.1:
+        "0x3243552f3bcbce720db6f5ad0c1b7cd15458392d"
      values.guardians:
+        ["0x6ABa5D2084362038C9640a8851ff3b8BCbA81Ca6"]
      values.isRelayer1Approved:
+        true
      values.isRelayer2Approved:
+        true
      values.isRelayer3Approved:
+        true
      description:
+        "The Blobstream DA bridge. This contract is used to bridge data commitments between Celestia and the destination chain. It specifies relayers that commit block ranges, but due to the lack of emitted events, there may be more relayers than are presented here."
      issuedPermissions:
+        [{"permission":"configure","target":"0x3243552F3BcbcE720Db6f5ad0C1B7cd15458392D","via":[]},{"permission":"configure","target":"0x44eB418A966ff47f5AF6f48AEa6Afde0bf193a8d","via":[]},{"permission":"configure","target":"0x6ABa5D2084362038C9640a8851ff3b8BCbA81Ca6","via":[]},{"permission":"configure","target":"0x9c0B0dBBAe8a976CEeA8C2A96F6D00c53839afDC","via":[]},{"permission":"upgrade","target":"0x6ABa5D2084362038C9640a8851ff3b8BCbA81Ca6","via":[]}]
    }
```

```diff
    contract SuccinctGatewayMultisig (0xdC00f2469023a7b0b1D5b6abE2F736F90955e7F3) {
    +++ description: None
      receivedPermissions:
+        [{"permission":"configure","target":"0x6c7a05e0AE641c6559fD76ac56641778B6eCd776","description":"can renounce and transfer ownership, add and remove default prover, set fee vault, and recover stuck ETH."}]
    }
```

```diff
    contract NextHeaderVerifier (0xe859F565f4AdF7AAc3a94a6C6d89093d754Ec4f6) {
    +++ description: None
      name:
-        "FunctionVerifier"
+        "NextHeaderVerifier"
    }
```

```diff
    contract HeaderRangeVerifier (0xF2415C44F47983F7dD22003B46A034B1F1d04e44) {
    +++ description: None
      name:
-        "FunctionVerifier"
+        "HeaderRangeVerifier"
    }
```

Generated with discovered.json: 0xec90d7cd820c3213f5679fe9b3f7a5531f428661

# Diff at Thu, 19 Dec 2024 11:57:28 GMT:

- chain: ethereum
- author: Michał Podsiadły (<michal.podsiadly@l2beat.com>)
- comparing to: main@1e850509cf42792486a5c52f33b2bb56c3de2df1 block: 21357513
- current block number: 21435567

## Description

Discovery rerun on the same block number with only config-related changes.
Properly resolve $admin.
Resolve old Gateway owner's permissions.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21357513 (main branch discovery), not current.

```diff
    contract NextHeaderVerifier (0x037E57EF3a130CD23988a4Ed530d79d6f97a0f06) {
    +++ description: None
      name:
-        "nextHeaderVerifier"
+        "NextHeaderVerifier"
    }
```

```diff
    contract SuccinctGateway (0x6c7a05e0AE641c6559fD76ac56641778B6eCd776) {
    +++ description: Users could interact with this contract to request proofs onchain, emitting a RequestCall event for off-chain provers to consume. Now deprecated, SP1 is used instead.
      template:
+        "succinct/SuccinctGateway"
      description:
+        "Users could interact with this contract to request proofs onchain, emitting a RequestCall event for off-chain provers to consume. Now deprecated, SP1 is used instead."
      issuedPermissions:
+        [{"permission":"configure","target":"0xd1999B562e74d9fbf57b4479b3fe8748BDF4e4A0","via":[]}]
    }
```

```diff
    contract Blobstream (0x7Cf3876F681Dbb6EdA8f6FfC45D66B996Df08fAe) {
    +++ description: The Blobstream DA bridge. This contract is used to bridge data commitments between Celestia and the destination chain. It specifies relayers that commit block ranges, but due to the lack of emitted events, there may be more relayers than are presented here.
      values.$admin:
-        "0x0000000000000000000000000000000000000000"
+        ["0x8bF34D8df1eF0A8A7f27fC587202848E528018E6"]
      values.isRelayerApproved:
-        true
      values.relayers.2:
+        "0x9c0b0dbbae8a976ceea8c2a96f6d00c53839afdc"
      values.relayers.1:
+        "0x3243552f3bcbce720db6f5ad0c1b7cd15458392d"
      values.guardians:
+        ["0x8bF34D8df1eF0A8A7f27fC587202848E528018E6"]
      values.isRelayer1Approved:
+        true
      values.isRelayer2Approved:
+        true
      values.isRelayer3Approved:
+        true
      description:
+        "The Blobstream DA bridge. This contract is used to bridge data commitments between Celestia and the destination chain. It specifies relayers that commit block ranges, but due to the lack of emitted events, there may be more relayers than are presented here."
      issuedPermissions:
+        [{"permission":"configure","target":"0x3243552F3BcbcE720Db6f5ad0C1B7cd15458392D","via":[]},{"permission":"configure","target":"0x44eB418A966ff47f5AF6f48AEa6Afde0bf193a8d","via":[]},{"permission":"configure","target":"0x8bF34D8df1eF0A8A7f27fC587202848E528018E6","via":[]},{"permission":"configure","target":"0x9c0B0dBBAe8a976CEeA8C2A96F6D00c53839afDC","via":[]},{"permission":"upgrade","target":"0x8bF34D8df1eF0A8A7f27fC587202848E528018E6","via":[]}]
    }
```

```diff
    contract BlobstreamMultisig (0x8bF34D8df1eF0A8A7f27fC587202848E528018E6) {
    +++ description: None
      receivedPermissions:
+        [{"permission":"configure","target":"0x7Cf3876F681Dbb6EdA8f6FfC45D66B996Df08fAe","description":"can freeze the bridge contract and update the list of authorized relayers."},{"permission":"upgrade","target":"0x7Cf3876F681Dbb6EdA8f6FfC45D66B996Df08fAe"}]
    }
```

```diff
    contract SuccinctGatewayMultisig (0xd1999B562e74d9fbf57b4479b3fe8748BDF4e4A0) {
    +++ description: None
      receivedPermissions:
+        [{"permission":"configure","target":"0x6c7a05e0AE641c6559fD76ac56641778B6eCd776","description":"can renounce and transfer ownership, add and remove default prover, set fee vault, and recover stuck ETH."}]
    }
```

```diff
    contract HeaderRangeVerifier (0xF33a22dFf8017813b95E5a05c9a97BaFE693001E) {
    +++ description: None
      name:
-        "headerRangeVerifier"
+        "HeaderRangeVerifier"
    }
```

Generated with discovered.json: 0xa1b5d233f3944b15389a548ed37dfd5e63fa0578

# Diff at Thu, 12 Dec 2024 15:07:35 GMT:

- chain: base
- author: Michał Podsiadły (<michal.podsiadly@l2beat.com>)
- comparing to: main@675c2fed2e6fd64977d53add75705c1380efedb2 block: 23434494
- current block number: 23434494

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 23434494 (main branch discovery), not current.

```diff
-   Status: DELETED
    contract SP1Verifier (0x1764C29FBd94865198588f10FC75D4f6636d158d)
    +++ description: None
```

```diff
    contract SuccinctGatewaySP1 (0x3B6041173B80E77f038f3F2C0f9744f04837185e) {
    +++ description: This contract is the router for the bridge proofs verification. It stores the mapping between the identifier of the bridge circuit and the address of the onchain verifier contract.
      description:
+        "This contract is the router for the bridge proofs verification. It stores the mapping between the identifier of the bridge circuit and the address of the onchain verifier contract."
      issuedPermissions:
+        [{"permission":"configure","target":"0xCafEf00d348Adbd57c37d1B77e0619C6244C6878","via":[]},{"permission":"configure","target":"0xd2832Cf1fC8bA210FfABF62Db9A8781153131d16","via":[]}]
    }
```

```diff
-   Status: DELETED
    contract SP1Verifier (0x6A87EFd4e6B2Db1ed73129A8b9c51aaA583d49e3)
    +++ description: None
```

```diff
-   Status: DELETED
    contract SP1Verifier (0x6B6A7Ded061567d8A56279801DEA5cFB79be5bFc)
    +++ description: None
```

```diff
-   Status: DELETED
    contract SP1Verifier (0xc350F063C13a3Ca21331610fe159E697a5c9c2FB)
    +++ description: None
```

```diff
    contract SuccinctGatewaySP1Multisig (0xCafEf00d348Adbd57c37d1B77e0619C6244C6878) {
    +++ description: None
      receivedPermissions:
+        [{"permission":"configure","target":"0x3B6041173B80E77f038f3F2C0f9744f04837185e","description":"holds the power to affect the liveness and safety of the bridge - can transfer ownership, add and freeze verifier routes."}]
    }
```

```diff
    contract SP1Verifier (0xd2832Cf1fC8bA210FfABF62Db9A8781153131d16) {
    +++ description: None
      receivedPermissions:
+        [{"permission":"configure","target":"0x3B6041173B80E77f038f3F2C0f9744f04837185e","description":"can verify proofs for the header range [latestBlock, targetBlock] proof."}]
    }
```

Generated with discovered.json: 0xd39227606f84756fb081b73d26ca8508301b491e

# Diff at Thu, 12 Dec 2024 15:07:34 GMT:

- chain: arbitrum
- author: Michał Podsiadły (<michal.podsiadly@l2beat.com>)
- comparing to: main@675c2fed2e6fd64977d53add75705c1380efedb2 block: 282615739
- current block number: 282615739

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 282615739 (main branch discovery), not current.

```diff
-   Status: DELETED
    contract SP1Verifier (0x1764C29FBd94865198588f10FC75D4f6636d158d)
    +++ description: None
```

```diff
    contract SuccinctGatewaySP1 (0x3B6041173B80E77f038f3F2C0f9744f04837185e) {
    +++ description: This contract is the router for the bridge proofs verification. It stores the mapping between the identifier of the bridge circuit and the address of the onchain verifier contract.
      description:
+        "This contract is the router for the bridge proofs verification. It stores the mapping between the identifier of the bridge circuit and the address of the onchain verifier contract."
      issuedPermissions:
+        [{"permission":"configure","target":"0xCafEf00d348Adbd57c37d1B77e0619C6244C6878","via":[]},{"permission":"configure","target":"0xd2832Cf1fC8bA210FfABF62Db9A8781153131d16","via":[]}]
    }
```

```diff
-   Status: DELETED
    contract SP1Verifier (0x6A87EFd4e6B2Db1ed73129A8b9c51aaA583d49e3)
    +++ description: None
```

```diff
-   Status: DELETED
    contract  (0x6B6A7Ded061567d8A56279801DEA5cFB79be5bFc)
    +++ description: None
```

```diff
-   Status: DELETED
    contract SP1Verifier (0xc350F063C13a3Ca21331610fe159E697a5c9c2FB)
    +++ description: None
```

```diff
    contract SuccinctGatewaySP1Multisig (0xCafEf00d348Adbd57c37d1B77e0619C6244C6878) {
    +++ description: None
      receivedPermissions:
+        [{"permission":"configure","target":"0x3B6041173B80E77f038f3F2C0f9744f04837185e","description":"holds the power to affect the liveness and safety of the bridge - can transfer ownership, add and freeze verifier routes."}]
    }
```

```diff
    contract  (0xd2832Cf1fC8bA210FfABF62Db9A8781153131d16) {
    +++ description: None
      receivedPermissions:
+        [{"permission":"configure","target":"0x3B6041173B80E77f038f3F2C0f9744f04837185e","description":"can verify proofs for the header range [latestBlock, targetBlock] proof."}]
    }
```

Generated with discovered.json: 0x6c31d7012ac6a6f2e93565687c3188ce01664396

# Diff at Thu, 12 Dec 2024 15:07:33 GMT:

- chain: ethereum
- author: Michał Podsiadły (<michal.podsiadly@l2beat.com>)
- comparing to: main@675c2fed2e6fd64977d53add75705c1380efedb2 block: 21357513
- current block number: 21357513

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21357513 (main branch discovery), not current.

```diff
-   Status: DELETED
    contract SP1Verifier (0x1764C29FBd94865198588f10FC75D4f6636d158d)
    +++ description: None
```

```diff
    contract SuccinctGatewaySP1 (0x3B6041173B80E77f038f3F2C0f9744f04837185e) {
    +++ description: This contract is the router for the bridge proofs verification. It stores the mapping between the identifier of the bridge circuit and the address of the onchain verifier contract.
      description:
+        "This contract is the router for the bridge proofs verification. It stores the mapping between the identifier of the bridge circuit and the address of the onchain verifier contract."
      issuedPermissions:
+        [{"permission":"configure","target":"0xCafEf00d348Adbd57c37d1B77e0619C6244C6878","via":[]},{"permission":"configure","target":"0xd2832Cf1fC8bA210FfABF62Db9A8781153131d16","via":[]}]
    }
```

```diff
-   Status: DELETED
    contract SP1Verifier (0x6A87EFd4e6B2Db1ed73129A8b9c51aaA583d49e3)
    +++ description: None
```

```diff
-   Status: DELETED
    contract SP1Verifier (0x6B6A7Ded061567d8A56279801DEA5cFB79be5bFc)
    +++ description: None
```

```diff
-   Status: DELETED
    contract SP1Verifier (0xc350F063C13a3Ca21331610fe159E697a5c9c2FB)
    +++ description: None
```

```diff
    contract SuccinctGatewaySP1Multisig (0xCafEf00d348Adbd57c37d1B77e0619C6244C6878) {
    +++ description: None
      receivedPermissions:
+        [{"permission":"configure","target":"0x3B6041173B80E77f038f3F2C0f9744f04837185e","description":"holds the power to affect the liveness and safety of the bridge - can transfer ownership, add and freeze verifier routes."}]
    }
```

```diff
    contract SP1Verifier (0xd2832Cf1fC8bA210FfABF62Db9A8781153131d16) {
    +++ description: None
      receivedPermissions:
+        [{"permission":"configure","target":"0x3B6041173B80E77f038f3F2C0f9744f04837185e","description":"can verify proofs for the header range [latestBlock, targetBlock] proof."}]
    }
```

Generated with discovered.json: 0x58b1c233533fe3790d77fb27e2f53ec183202e79

# Diff at Tue, 10 Dec 2024 11:09:13 GMT:

- chain: arbitrum
- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@9ed5a41ddcad978cfdf826bc7a4827bf4a91c814 block: 282615739
- current block number: 282615739

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 282615739 (main branch discovery), not current.

```diff
    contract headerRangeVerifier (0x4d0C32ddA9De7CD89e198cFe5E01470A49b8acD3) {
    +++ description: None
      name:
-        "FunctionVerifier"
+        "headerRangeVerifier"
    }
```

```diff
    contract nextHeaderVerifier (0xfEA1EFaE3cDe8C524168726a7fc46BF2134bb72C) {
    +++ description: None
      name:
-        "FunctionVerifier"
+        "nextHeaderVerifier"
    }
```

Generated with discovered.json: 0x6711f52bb7c3e867fca16392ebea36c7eb4152f6

# Diff at Tue, 10 Dec 2024 10:37:03 GMT:

- chain: ethereum
- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@9ed5a41ddcad978cfdf826bc7a4827bf4a91c814 block: 21357513
- current block number: 21357513

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21357513 (main branch discovery), not current.

```diff
    contract nextHeaderVerifier (0x037E57EF3a130CD23988a4Ed530d79d6f97a0f06) {
    +++ description: None
      name:
-        "FunctionVerifier"
+        "nextHeaderVerifier"
    }
```

```diff
    contract headerRangeVerifier (0xF33a22dFf8017813b95E5a05c9a97BaFE693001E) {
    +++ description: None
      name:
-        ""
+        "headerRangeVerifier"
    }
```

Generated with discovered.json: 0x00664097a7d1c6ccf5f2824f04f0e0b2a9ae3ff2

# Diff at Sun, 08 Dec 2024 11:45:48 GMT:

- chain: base
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@59fd7a30471906b5a479f280731621e94e22f17c block: 23259798
- current block number: 23434494

## Description

BlobstreamMultisig signer change.

## Watched changes

```diff
    contract BlobstreamMultisig (0x6ABa5D2084362038C9640a8851ff3b8BCbA81Ca6) {
    +++ description: None
      values.$members.4:
-        "0xA3fC931613a4E2440a199d47B0076e8b85F33099"
+        "0x4983A5ebE79c0570aa368cE84f281A8aAc50cE4d"
    }
```

Generated with discovered.json: 0x192b61dd04f6c257364807da8aea8986386d9358

# Diff at Sun, 08 Dec 2024 11:36:51 GMT:

- chain: ethereum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@59fd7a30471906b5a479f280731621e94e22f17c block: 21328604
- current block number: 21357513

## Description

BlobstreamMultisig signer change.

## Watched changes

```diff
    contract BlobstreamMultisig (0x8bF34D8df1eF0A8A7f27fC587202848E528018E6) {
    +++ description: None
      values.$members.4:
-        "0xA3fC931613a4E2440a199d47B0076e8b85F33099"
+        "0x4983A5ebE79c0570aa368cE84f281A8aAc50cE4d"
    }
```

Generated with discovered.json: 0x6e041fc1949d56d85654cf090fe0c5fa96b0cb79

# Diff at Sun, 08 Dec 2024 11:35:30 GMT:

- chain: arbitrum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@59fd7a30471906b5a479f280731621e94e22f17c block: 281224085
- current block number: 282615739

## Description

BlobstreamMultisig signer change.

## Watched changes

```diff
    contract BlobstreamMultisig (0x738a9b55304f9fcF776B3BA285e50c0f9eF77997) {
    +++ description: None
      values.$members.3:
-        "0xA3fC931613a4E2440a199d47B0076e8b85F33099"
+        "0x4983A5ebE79c0570aa368cE84f281A8aAc50cE4d"
    }
```

Generated with discovered.json: 0xdff17458ff82de3da00478196bff62b936e8b1a3

# Diff at Wed, 04 Dec 2024 10:43:57 GMT:

- chain: base
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@7dc480bf5499525d0b44afce03521538ecc8ec73 block: 22391049
- current block number: 23259798

## Description

Raise the max commitment size by one order of magnitude to 10000 celestia blocks.

## Watched changes

```diff
    contract Blobstream (0xA83ca7775Bc2889825BcDeDfFa5b758cf69e8794) {
    +++ description: None
      sourceHashes.1:
-        "0x424268ec553b52a09ec29bc220e95a4dc19def7e459d1cc8a541ee0e2fd578e9"
+        "0x13872c9ceb24afa3e0819f2d13957fab016c612859cc40f542ee250f53e03dac"
      values.$implementation:
-        "0x47fd660D5252Bd6F9D2c71507E46aa1d6e957c23"
+        "0x46EbfC399d3913BB9b99E73675722417F9c5d416"
      values.$pastUpgrades.3:
+        ["2024-12-02T19:09:23.000Z","0x972e1b10b3fd4c52bbd75c6215f12438b15229c9f609ad42273eb3985d8e4767",["0x46EbfC399d3913BB9b99E73675722417F9c5d416"]]
      values.$upgradeCount:
-        3
+        4
      values.DATA_COMMITMENT_MAX:
-        1000
+        10000
    }
```

## Source code changes

```diff
.../base/{.flat@22391049 => .flat}/Blobstream/SP1Blobstream.sol         | 2 +-
 1 file changed, 1 insertion(+), 1 deletion(-)
```

Generated with discovered.json: 0x39570decd9dd2f479dc1a9da99602516bacfa3ad

# Diff at Wed, 04 Dec 2024 10:42:23 GMT:

- chain: arbitrum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@7dc480bf5499525d0b44afce03521538ecc8ec73 block: 274315505
- current block number: 281224085

## Description

Raise the max commitment size by one order of magnitude to 10000 celestia blocks.

## Watched changes

```diff
    contract Blobstream (0xA83ca7775Bc2889825BcDeDfFa5b758cf69e8794) {
    +++ description: None
      sourceHashes.1:
-        "0x424268ec553b52a09ec29bc220e95a4dc19def7e459d1cc8a541ee0e2fd578e9"
+        "0x13872c9ceb24afa3e0819f2d13957fab016c612859cc40f542ee250f53e03dac"
      values.$implementation:
-        "0x47fd660D5252Bd6F9D2c71507E46aa1d6e957c23"
+        "0x46EbfC399d3913BB9b99E73675722417F9c5d416"
      values.$pastUpgrades.3:
+        ["2024-12-02T19:09:05.000Z","0x07dbff15e24a8c124a927a2881cb4d471ace180488a56a56b43b47d1da68a130",["0x46EbfC399d3913BB9b99E73675722417F9c5d416"]]
      values.$upgradeCount:
-        3
+        4
      values.DATA_COMMITMENT_MAX:
-        1000
+        10000
    }
```

## Source code changes

```diff
.../arbitrum/{.flat@274315505 => .flat}/Blobstream/SP1Blobstream.sol    | 2 +-
 1 file changed, 1 insertion(+), 1 deletion(-)
```

Generated with discovered.json: 0x5d5e8b89ea8fc6286182d1699103e9d882101c87

# Diff at Wed, 04 Dec 2024 10:41:31 GMT:

- chain: ethereum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@7dc480bf5499525d0b44afce03521538ecc8ec73 block: 21184621
- current block number: 21328604

## Description

Raise the max commitment size by one order of magnitude to 10000 celestia blocks.

## Watched changes

```diff
    contract Blobstream (0x7Cf3876F681Dbb6EdA8f6FfC45D66B996Df08fAe) {
    +++ description: None
      sourceHashes.1:
-        "0x424268ec553b52a09ec29bc220e95a4dc19def7e459d1cc8a541ee0e2fd578e9"
+        "0x13872c9ceb24afa3e0819f2d13957fab016c612859cc40f542ee250f53e03dac"
      values.$implementation:
-        "0x47fd660D5252Bd6F9D2c71507E46aa1d6e957c23"
+        "0x46EbfC399d3913BB9b99E73675722417F9c5d416"
      values.$pastUpgrades.2:
+        ["2024-12-02T19:08:47.000Z","0xcc2a77da632e84e5fb17e863ec744d5f0921b70c191487179dd9e28ab855a3be",["0x46EbfC399d3913BB9b99E73675722417F9c5d416"]]
      values.$upgradeCount:
-        2
+        3
      values.DATA_COMMITMENT_MAX:
-        1000
+        10000
    }
```

## Source code changes

```diff
.../ethereum/{.flat@21184621 => .flat}/Blobstream/SP1Blobstream.sol     | 2 +-
 1 file changed, 1 insertion(+), 1 deletion(-)
```

Generated with discovered.json: 0x547b05a005c5552c4a89ebadd7bc9431733e3279

# Diff at Thu, 28 Nov 2024 11:03:30 GMT:

- chain: base
- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@4e0645053ebfcfcef2e7fd8c8410bad53373a3c4 block: 22391049
- current block number: 22391049

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22391049 (main branch discovery), not current.

```diff
    contract Blobstream (0xA83ca7775Bc2889825BcDeDfFa5b758cf69e8794) {
    +++ description: None
      issuedPermissions:
-        [{"permission":"upgrade","target":"0x0000000000000000000000000000000000000000","via":[]}]
    }
```

Generated with discovered.json: 0xbdefc05aef6d5f51d59ef8704453de4bb799375e

# Diff at Thu, 28 Nov 2024 11:03:23 GMT:

- chain: arbitrum
- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@4e0645053ebfcfcef2e7fd8c8410bad53373a3c4 block: 274315505
- current block number: 274315505

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 274315505 (main branch discovery), not current.

```diff
    contract Blobstream (0xA83ca7775Bc2889825BcDeDfFa5b758cf69e8794) {
    +++ description: None
      issuedPermissions:
-        [{"permission":"upgrade","target":"0x0000000000000000000000000000000000000000","via":[]}]
    }
```

Generated with discovered.json: 0xa3ccb038f264b6b4cd3ff99683365ccd9a8fbc9f

# Diff at Thu, 28 Nov 2024 11:02:04 GMT:

- chain: ethereum
- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@4e0645053ebfcfcef2e7fd8c8410bad53373a3c4 block: 21184621
- current block number: 21184621

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21184621 (main branch discovery), not current.

```diff
    contract Blobstream (0x7Cf3876F681Dbb6EdA8f6FfC45D66B996Df08fAe) {
    +++ description: None
      issuedPermissions:
-        [{"permission":"upgrade","target":"0x0000000000000000000000000000000000000000","via":[]}]
    }
```

Generated with discovered.json: 0x3c8ca726c6b4c1ec9288d9eb6cc0d0b9ebac6855

# Diff at Thu, 14 Nov 2024 08:04:19 GMT:

- chain: ethereum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@ea60800af45c71fbd5d292e0f4301ba9afda01fa block: 21122534
- current block number: 21184621

## Description

Updated verifier discovery, old ones frozen (zk cat updated).

## Watched changes

```diff
    contract SuccinctGatewaySP1 (0x3B6041173B80E77f038f3F2C0f9744f04837185e) {
    +++ description: None
+++ description: The verifier contract address for SP1, and whether it is frozen (true if frozen). This prover route was frozen on 2024-11-08.
      values.oldVerifier4.1:
-        false
+        true
    }
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21122534 (main branch discovery), not current.

```diff
    contract SuccinctGatewaySP1 (0x3B6041173B80E77f038f3F2C0f9744f04837185e) {
    +++ description: None
+++ description: The prover contract address for SP1, and whether it is frozen (true if frozen).
      values.verifier.0:
-        "0x1764C29FBd94865198588f10FC75D4f6636d158d"
+        "0xd2832Cf1fC8bA210FfABF62Db9A8781153131d16"
+++ description: The verifier contract address for SP1, and whether it is frozen (true if frozen). This prover route was frozen on 2024-11-01.
      values.oldVerifier3:
+        ["0x6A87EFd4e6B2Db1ed73129A8b9c51aaA583d49e3",true]
+++ description: The verifier contract address for SP1, and whether it is frozen (true if frozen). This prover route was frozen on 2024-11-08.
      values.oldVerifier4:
+        ["0x1764C29FBd94865198588f10FC75D4f6636d158d",false]
      fieldMeta.oldVerifier3:
+        {"description":"The verifier contract address for SP1, and whether it is frozen (true if frozen). This prover route was frozen on 2024-11-01."}
      fieldMeta.oldVerifier4:
+        {"description":"The verifier contract address for SP1, and whether it is frozen (true if frozen). This prover route was frozen on 2024-11-08."}
    }
```

```diff
+   Status: CREATED
    contract SP1Verifier (0x6A87EFd4e6B2Db1ed73129A8b9c51aaA583d49e3)
    +++ description: None
```

```diff
+   Status: CREATED
    contract SP1Verifier (0xd2832Cf1fC8bA210FfABF62Db9A8781153131d16)
    +++ description: None
```

Generated with discovered.json: 0x28abb780d680f93714d4d31505503f243e16f77a

# Diff at Thu, 14 Nov 2024 08:04:13 GMT:

- chain: base
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@ea60800af45c71fbd5d292e0f4301ba9afda01fa block: 22016709
- current block number: 22391049

## Description

Updated verifier discovery, old ones frozen (zk cat updated).

## Watched changes

```diff
    contract SuccinctGatewaySP1 (0x3B6041173B80E77f038f3F2C0f9744f04837185e) {
    +++ description: None
+++ description: The verifier contract address for SP1, and whether it is frozen (true if frozen). This prover route was frozen on 2024-11-08.
      values.oldVerifier4.1:
-        false
+        true
    }
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22016709 (main branch discovery), not current.

```diff
    contract SuccinctGatewaySP1 (0x3B6041173B80E77f038f3F2C0f9744f04837185e) {
    +++ description: None
+++ description: The prover contract address for SP1, and whether it is frozen (true if frozen).
      values.verifier.0:
-        "0x1764C29FBd94865198588f10FC75D4f6636d158d"
+        "0xd2832Cf1fC8bA210FfABF62Db9A8781153131d16"
+++ description: The verifier contract address for SP1, and whether it is frozen (true if frozen). This prover route was frozen on 2024-11-01.
      values.oldVerifier3:
+        ["0x6A87EFd4e6B2Db1ed73129A8b9c51aaA583d49e3",true]
+++ description: The verifier contract address for SP1, and whether it is frozen (true if frozen). This prover route was frozen on 2024-11-08.
      values.oldVerifier4:
+        ["0x1764C29FBd94865198588f10FC75D4f6636d158d",false]
      fieldMeta.oldVerifier3:
+        {"description":"The verifier contract address for SP1, and whether it is frozen (true if frozen). This prover route was frozen on 2024-11-01."}
      fieldMeta.oldVerifier4:
+        {"description":"The verifier contract address for SP1, and whether it is frozen (true if frozen). This prover route was frozen on 2024-11-08."}
    }
```

```diff
+   Status: CREATED
    contract SP1Verifier (0x6A87EFd4e6B2Db1ed73129A8b9c51aaA583d49e3)
    +++ description: None
```

```diff
+   Status: CREATED
    contract SP1Verifier (0xd2832Cf1fC8bA210FfABF62Db9A8781153131d16)
    +++ description: None
```

Generated with discovered.json: 0x942a777848cc3746f394cf60639a0f944635f434

# Diff at Thu, 14 Nov 2024 08:04:06 GMT:

- chain: arbitrum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@ea60800af45c71fbd5d292e0f4301ba9afda01fa block: 271340080
- current block number: 274315505

## Description

Updated verifier discovery, old ones frozen (zk cat updated).

## Watched changes

```diff
    contract SuccinctGatewaySP1 (0x3B6041173B80E77f038f3F2C0f9744f04837185e) {
    +++ description: None
+++ description: The verifier contract address for SP1, and whether it is frozen (true if frozen). This prover route was frozen on 2024-11-08.
      values.oldVerifier4.1:
-        false
+        true
    }
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 271340080 (main branch discovery), not current.

```diff
    contract SuccinctGatewaySP1 (0x3B6041173B80E77f038f3F2C0f9744f04837185e) {
    +++ description: None
+++ description: The prover contract address for SP1, and whether it is frozen (true if frozen).
      values.verifier.0:
-        "0x1764C29FBd94865198588f10FC75D4f6636d158d"
+        "0xd2832Cf1fC8bA210FfABF62Db9A8781153131d16"
+++ description: The verifier contract address for SP1, and whether it is frozen (true if frozen). This prover route was frozen on 2024-11-01.
      values.oldVerifier3:
+        ["0x6A87EFd4e6B2Db1ed73129A8b9c51aaA583d49e3",true]
+++ description: The verifier contract address for SP1, and whether it is frozen (true if frozen). This prover route was frozen on 2024-11-08.
      values.oldVerifier4:
+        ["0x1764C29FBd94865198588f10FC75D4f6636d158d",false]
      fieldMeta.oldVerifier3:
+        {"description":"The verifier contract address for SP1, and whether it is frozen (true if frozen). This prover route was frozen on 2024-11-01."}
      fieldMeta.oldVerifier4:
+        {"description":"The verifier contract address for SP1, and whether it is frozen (true if frozen). This prover route was frozen on 2024-11-08."}
    }
```

```diff
+   Status: CREATED
    contract SP1Verifier (0x6A87EFd4e6B2Db1ed73129A8b9c51aaA583d49e3)
    +++ description: None
```

```diff
+   Status: CREATED
    contract  (0xd2832Cf1fC8bA210FfABF62Db9A8781153131d16)
    +++ description: None
```

Generated with discovered.json: 0xdb2b8749d56762083d1f791fd5e7d78856d33900

# Diff at Tue, 05 Nov 2024 16:07:18 GMT:

- chain: arbitrum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@5e6ce51851b57187ccdd52c4944a82e2a8ab1e88 block: 259634526
- current block number: 271340080

## Description

Verifier program verification key changed, verifier implementation is the same.

## Watched changes

```diff
    contract Blobstream (0xA83ca7775Bc2889825BcDeDfFa5b758cf69e8794) {
    +++ description: None
      values.blobstreamProgramVkey:
-        "0x0038c5c5568fe5e1ae267efb1298a7792d1cda00bccc2d1d4bfa4c1511e06380"
+        "0x00a6ea49173d4b0b544a24a5a7474e76d1fda8f0f7e541cbb294d2b7249d7bcb"
    }
```

Generated with discovered.json: 0x3559920eeb70540f587c5416dbefbb086792cf7a

# Diff at Tue, 05 Nov 2024 16:06:54 GMT:

- chain: ethereum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@5e6ce51851b57187ccdd52c4944a82e2a8ab1e88 block: 20878389
- current block number: 21122534

## Description

Verifier program verification key changed, verifier implementation is the same.

## Watched changes

```diff
    contract Blobstream (0x7Cf3876F681Dbb6EdA8f6FfC45D66B996Df08fAe) {
    +++ description: None
      values.blobstreamProgramVkey:
-        "0x0038c5c5568fe5e1ae267efb1298a7792d1cda00bccc2d1d4bfa4c1511e06380"
+        "0x00a6ea49173d4b0b544a24a5a7474e76d1fda8f0f7e541cbb294d2b7249d7bcb"
    }
```

Generated with discovered.json: 0x7b8f34d0c4647f4ec77d29bffed9a57fc20f7597

# Diff at Tue, 05 Nov 2024 16:06:30 GMT:

- chain: base
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@5e6ce51851b57187ccdd52c4944a82e2a8ab1e88 block: 20544837
- current block number: 22016709

## Description

Verifier program verification key changed, verifier implementation is the same.

## Watched changes

```diff
    contract Blobstream (0xA83ca7775Bc2889825BcDeDfFa5b758cf69e8794) {
    +++ description: None
      values.blobstreamProgramVkey:
-        "0x0038c5c5568fe5e1ae267efb1298a7792d1cda00bccc2d1d4bfa4c1511e06380"
+        "0x00a6ea49173d4b0b544a24a5a7474e76d1fda8f0f7e541cbb294d2b7249d7bcb"
    }
```

Generated with discovered.json: 0xcd8832638f2d8634b9cd1967ae4751cc49a98b29

# Diff at Mon, 21 Oct 2024 11:13:52 GMT:

- chain: base
- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@8895d33866f5665c4c710f4ddaa32bfa63cc3c78 block: 20544837
- current block number: 20544837

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20544837 (main branch discovery), not current.

```diff
    contract Blobstream (0xA83ca7775Bc2889825BcDeDfFa5b758cf69e8794) {
    +++ description: None
      values.$pastUpgrades.2.2:
+        ["0x47fd660D5252Bd6F9D2c71507E46aa1d6e957c23"]
      values.$pastUpgrades.2.1:
-        ["0x47fd660D5252Bd6F9D2c71507E46aa1d6e957c23"]
+        "0xd2efcdcc2ae2c8725a9d68bcce93edf7f4e2c5326ec75e9aea9cbdb6dfc7c6d3"
      values.$pastUpgrades.1.2:
+        ["0xfb19439fBa9f16aA720be6bE0e53465a9733C964"]
      values.$pastUpgrades.1.1:
-        ["0xfb19439fBa9f16aA720be6bE0e53465a9733C964"]
+        "0xcc77a9f79cc2dc869a5b2afcb9abe14014680e03797e00244a4580deb278eee8"
      values.$pastUpgrades.0.2:
+        ["0x7C3A9b466FF5c02582fa32d4aD1b2Cb431fB7c9b"]
      values.$pastUpgrades.0.1:
-        ["0x7C3A9b466FF5c02582fa32d4aD1b2Cb431fB7c9b"]
+        "0x4549f6dd026054361c6ec3372f446d9a594205d6a2681001f4d3567ef55d8d73"
    }
```

Generated with discovered.json: 0x1f792e6a4a7bdeb8d78e2da95b143a25b0d6353c

# Diff at Mon, 21 Oct 2024 11:13:00 GMT:

- chain: arbitrum
- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@8895d33866f5665c4c710f4ddaa32bfa63cc3c78 block: 259634526
- current block number: 259634526

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 259634526 (main branch discovery), not current.

```diff
    contract Blobstream (0xA83ca7775Bc2889825BcDeDfFa5b758cf69e8794) {
    +++ description: None
      values.$pastUpgrades.2.2:
+        ["0x47fd660D5252Bd6F9D2c71507E46aa1d6e957c23"]
      values.$pastUpgrades.2.1:
-        ["0x47fd660D5252Bd6F9D2c71507E46aa1d6e957c23"]
+        "0x746e21628ccec4d5b4da96595f852a6398defcc360cb9f13aa2d84ebe4e7403f"
      values.$pastUpgrades.1.2:
+        ["0xfb19439fBa9f16aA720be6bE0e53465a9733C964"]
      values.$pastUpgrades.1.1:
-        ["0xfb19439fBa9f16aA720be6bE0e53465a9733C964"]
+        "0xf45e346ddbedef1ea3f828954c979adcb205b4b1c0ca72e49e7e2ef5b1c43192"
      values.$pastUpgrades.0.2:
+        ["0x7C3A9b466FF5c02582fa32d4aD1b2Cb431fB7c9b"]
      values.$pastUpgrades.0.1:
-        ["0x7C3A9b466FF5c02582fa32d4aD1b2Cb431fB7c9b"]
+        "0x58059198a17ae1d8dd73b4d0f0ce7169f4e55d901a8fea59b4ef12d005a41f0a"
    }
```

Generated with discovered.json: 0x42d70b8b26b74662354fbbc6e987c17224c1e207

# Diff at Mon, 21 Oct 2024 11:04:47 GMT:

- chain: ethereum
- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@8895d33866f5665c4c710f4ddaa32bfa63cc3c78 block: 20878389
- current block number: 20878389

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20878389 (main branch discovery), not current.

```diff
    contract Blobstream (0x7Cf3876F681Dbb6EdA8f6FfC45D66B996Df08fAe) {
    +++ description: None
      values.$pastUpgrades.1.2:
+        ["0x47fd660D5252Bd6F9D2c71507E46aa1d6e957c23"]
      values.$pastUpgrades.1.1:
-        ["0x47fd660D5252Bd6F9D2c71507E46aa1d6e957c23"]
+        "0x2cbc956737b46bd304d04f3051a65e311686d35792c54c67030d0c5417e76508"
      values.$pastUpgrades.0.2:
+        ["0x41a87C543EBcbD93706CF5260AD057D9eCBA1caE"]
      values.$pastUpgrades.0.1:
-        ["0x41a87C543EBcbD93706CF5260AD057D9eCBA1caE"]
+        "0xf156e666fc403369415601ab683befc8e177f698b69a4c4c313706127ec18a86"
    }
```

Generated with discovered.json: 0x6bf6fde301170cfdd9f8a0308f2fee00cab96f7b

# Diff at Mon, 14 Oct 2024 10:59:32 GMT:

- chain: base
- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@1afc77ff111ceb0970e7d09efcc7b2f376b0c281 block: 20544837
- current block number: 20544837

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20544837 (main branch discovery), not current.

```diff
    contract SP1Verifier (0x1764C29FBd94865198588f10FC75D4f6636d158d) {
    +++ description: None
      sourceHashes:
+        ["0xeb051b88e210e28fd696d01528e3cc9a131a08d69e20bf1983ac8d90dd9b1f4f"]
    }
```

```diff
    contract SuccinctFeeVault (0x296666e937b270193B960a7cEC526B351F353166) {
    +++ description: None
      sourceHashes:
+        ["0x503f175ab3807eb7f958512d3dc2501bb2ab62286bcd8cd1f85d7d24b2ce90cc"]
    }
```

```diff
    contract SuccinctGatewaySP1 (0x3B6041173B80E77f038f3F2C0f9744f04837185e) {
    +++ description: None
      sourceHashes:
+        ["0xc651adcd746b8794c5b6c418aeb146f1b13b207cc9d2712ba66a42bd4b29af37"]
    }
```

```diff
    contract BlobstreamMultisig (0x6ABa5D2084362038C9640a8851ff3b8BCbA81Ca6) {
    +++ description: None
      sourceHashes:
+        ["0x81a7349eebb98ac33b0bc6842e3cb258034a8f2a4ba004570bb8e2e25947f9ff","0x59fe14e95a8aa7f52213f18bae5c9329cf583a7ba31194698b15eddb97d5e825"]
    }
```

```diff
    contract SP1Verifier (0x6B6A7Ded061567d8A56279801DEA5cFB79be5bFc) {
    +++ description: None
      sourceHashes:
+        ["0xabb95b2d66749481071b7a258a3305198760dbaf12d7411cfaba5e4c26cc3a65"]
    }
```

```diff
    contract SuccinctGateway (0x6c7a05e0AE641c6559fD76ac56641778B6eCd776) {
    +++ description: None
      sourceHashes:
+        ["0xa148b7dcb3095dbb66f26d1428d50a59e1cd1384c80b0efe88efead152e6ebe2"]
    }
```

```diff
    contract Blobstream (0xA83ca7775Bc2889825BcDeDfFa5b758cf69e8794) {
    +++ description: None
      sourceHashes:
+        ["0xc44a84c18fe7660acbe7750e0a14401b3a0a0ad97d8c81305bd879dca88d873b","0x424268ec553b52a09ec29bc220e95a4dc19def7e459d1cc8a541ee0e2fd578e9"]
    }
```

```diff
    contract SP1Verifier (0xc350F063C13a3Ca21331610fe159E697a5c9c2FB) {
    +++ description: None
      sourceHashes:
+        ["0x6e3bfeae0d549b79decfd956f551a8aeac66523cdd66da389ef55eb56ef72aac"]
    }
```

```diff
    contract SuccinctGatewaySP1Multisig (0xCafEf00d348Adbd57c37d1B77e0619C6244C6878) {
    +++ description: None
      sourceHashes:
+        ["0x81a7349eebb98ac33b0bc6842e3cb258034a8f2a4ba004570bb8e2e25947f9ff","0xd42bbf9f7dcd3720a7fc6bdc6edfdfae8800a37d6dd4decfa0ef6ca4a2e88940"]
    }
```

```diff
    contract SuccinctGatewayMultisig (0xdC00f2469023a7b0b1D5b6abE2F736F90955e7F3) {
    +++ description: None
      sourceHashes:
+        ["0x81a7349eebb98ac33b0bc6842e3cb258034a8f2a4ba004570bb8e2e25947f9ff","0x59fe14e95a8aa7f52213f18bae5c9329cf583a7ba31194698b15eddb97d5e825"]
    }
```

```diff
    contract FunctionVerifier (0xe859F565f4AdF7AAc3a94a6C6d89093d754Ec4f6) {
    +++ description: None
      sourceHashes:
+        ["0xa56a53a05b7201f86a6987201b5a99cb4f9e7fba1060ecf8290515990b6f6b5e"]
    }
```

```diff
    contract FunctionVerifier (0xF2415C44F47983F7dD22003B46A034B1F1d04e44) {
    +++ description: None
      sourceHashes:
+        ["0x205b995df6bf32d996abb3bf617459c0102ba36f15f7ec1b12994eba3346f12f"]
    }
```

Generated with discovered.json: 0x59c2f6bb3798716fe1d3280176a3368a0ed60606

# Diff at Mon, 14 Oct 2024 10:58:34 GMT:

- chain: arbitrum
- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@1afc77ff111ceb0970e7d09efcc7b2f376b0c281 block: 259634526
- current block number: 259634526

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 259634526 (main branch discovery), not current.

```diff
    contract SP1Verifier (0x1764C29FBd94865198588f10FC75D4f6636d158d) {
    +++ description: None
      sourceHashes:
+        ["0xeb051b88e210e28fd696d01528e3cc9a131a08d69e20bf1983ac8d90dd9b1f4f"]
    }
```

```diff
    contract SuccinctFeeVault (0x296666e937b270193B960a7cEC526B351F353166) {
    +++ description: None
      sourceHashes:
+        ["0x503f175ab3807eb7f958512d3dc2501bb2ab62286bcd8cd1f85d7d24b2ce90cc"]
    }
```

```diff
    contract SuccinctGatewaySP1 (0x3B6041173B80E77f038f3F2C0f9744f04837185e) {
    +++ description: None
      sourceHashes:
+        ["0xc651adcd746b8794c5b6c418aeb146f1b13b207cc9d2712ba66a42bd4b29af37"]
    }
```

```diff
    contract FunctionVerifier (0x4d0C32ddA9De7CD89e198cFe5E01470A49b8acD3) {
    +++ description: None
      sourceHashes:
+        ["0x205b995df6bf32d996abb3bf617459c0102ba36f15f7ec1b12994eba3346f12f"]
    }
```

```diff
    contract SuccinctGateway (0x6c7a05e0AE641c6559fD76ac56641778B6eCd776) {
    +++ description: None
      sourceHashes:
+        ["0xa148b7dcb3095dbb66f26d1428d50a59e1cd1384c80b0efe88efead152e6ebe2"]
    }
```

```diff
    contract BlobstreamMultisig (0x738a9b55304f9fcF776B3BA285e50c0f9eF77997) {
    +++ description: None
      sourceHashes:
+        ["0x81a7349eebb98ac33b0bc6842e3cb258034a8f2a4ba004570bb8e2e25947f9ff","0x59fe14e95a8aa7f52213f18bae5c9329cf583a7ba31194698b15eddb97d5e825"]
    }
```

```diff
    contract Blobstream (0xA83ca7775Bc2889825BcDeDfFa5b758cf69e8794) {
    +++ description: None
      sourceHashes:
+        ["0xc44a84c18fe7660acbe7750e0a14401b3a0a0ad97d8c81305bd879dca88d873b","0x424268ec553b52a09ec29bc220e95a4dc19def7e459d1cc8a541ee0e2fd578e9"]
    }
```

```diff
    contract SP1Verifier (0xc350F063C13a3Ca21331610fe159E697a5c9c2FB) {
    +++ description: None
      sourceHashes:
+        ["0x6e3bfeae0d549b79decfd956f551a8aeac66523cdd66da389ef55eb56ef72aac"]
    }
```

```diff
    contract SuccinctGatewaySP1Multisig (0xCafEf00d348Adbd57c37d1B77e0619C6244C6878) {
    +++ description: None
      sourceHashes:
+        ["0x81a7349eebb98ac33b0bc6842e3cb258034a8f2a4ba004570bb8e2e25947f9ff","0xd42bbf9f7dcd3720a7fc6bdc6edfdfae8800a37d6dd4decfa0ef6ca4a2e88940"]
    }
```

```diff
    contract SuccinctGatewayMultisig (0xdC00f2469023a7b0b1D5b6abE2F736F90955e7F3) {
    +++ description: None
      sourceHashes:
+        ["0x81a7349eebb98ac33b0bc6842e3cb258034a8f2a4ba004570bb8e2e25947f9ff","0x59fe14e95a8aa7f52213f18bae5c9329cf583a7ba31194698b15eddb97d5e825"]
    }
```

```diff
    contract FunctionVerifier (0xfEA1EFaE3cDe8C524168726a7fc46BF2134bb72C) {
    +++ description: None
      sourceHashes:
+        ["0xa56a53a05b7201f86a6987201b5a99cb4f9e7fba1060ecf8290515990b6f6b5e"]
    }
```

Generated with discovered.json: 0x73284c80daff75185d27f61cc2ed114b8f7716df

# Diff at Mon, 14 Oct 2024 10:49:53 GMT:

- chain: ethereum
- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@1afc77ff111ceb0970e7d09efcc7b2f376b0c281 block: 20878389
- current block number: 20878389

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20878389 (main branch discovery), not current.

```diff
    contract FunctionVerifier (0x037E57EF3a130CD23988a4Ed530d79d6f97a0f06) {
    +++ description: None
      sourceHashes:
+        ["0xa56a53a05b7201f86a6987201b5a99cb4f9e7fba1060ecf8290515990b6f6b5e"]
    }
```

```diff
    contract SP1Verifier (0x1764C29FBd94865198588f10FC75D4f6636d158d) {
    +++ description: None
      sourceHashes:
+        ["0xeb051b88e210e28fd696d01528e3cc9a131a08d69e20bf1983ac8d90dd9b1f4f"]
    }
```

```diff
    contract SuccinctFeeVault (0x296666e937b270193B960a7cEC526B351F353166) {
    +++ description: None
      sourceHashes:
+        ["0x503f175ab3807eb7f958512d3dc2501bb2ab62286bcd8cd1f85d7d24b2ce90cc"]
    }
```

```diff
    contract SuccinctGatewaySP1 (0x3B6041173B80E77f038f3F2C0f9744f04837185e) {
    +++ description: None
      sourceHashes:
+        ["0xc651adcd746b8794c5b6c418aeb146f1b13b207cc9d2712ba66a42bd4b29af37"]
    }
```

```diff
    contract SP1Verifier (0x6B6A7Ded061567d8A56279801DEA5cFB79be5bFc) {
    +++ description: None
      sourceHashes:
+        ["0xabb95b2d66749481071b7a258a3305198760dbaf12d7411cfaba5e4c26cc3a65"]
    }
```

```diff
    contract SuccinctGateway (0x6c7a05e0AE641c6559fD76ac56641778B6eCd776) {
    +++ description: None
      sourceHashes:
+        ["0xa148b7dcb3095dbb66f26d1428d50a59e1cd1384c80b0efe88efead152e6ebe2"]
    }
```

```diff
    contract Blobstream (0x7Cf3876F681Dbb6EdA8f6FfC45D66B996Df08fAe) {
    +++ description: None
      sourceHashes:
+        ["0xc44a84c18fe7660acbe7750e0a14401b3a0a0ad97d8c81305bd879dca88d873b","0x424268ec553b52a09ec29bc220e95a4dc19def7e459d1cc8a541ee0e2fd578e9"]
    }
```

```diff
    contract BlobstreamMultisig (0x8bF34D8df1eF0A8A7f27fC587202848E528018E6) {
    +++ description: None
      sourceHashes:
+        ["0x81a7349eebb98ac33b0bc6842e3cb258034a8f2a4ba004570bb8e2e25947f9ff","0xd42bbf9f7dcd3720a7fc6bdc6edfdfae8800a37d6dd4decfa0ef6ca4a2e88940"]
    }
```

```diff
    contract SP1Verifier (0xc350F063C13a3Ca21331610fe159E697a5c9c2FB) {
    +++ description: None
      sourceHashes:
+        ["0x6e3bfeae0d549b79decfd956f551a8aeac66523cdd66da389ef55eb56ef72aac"]
    }
```

```diff
    contract SuccinctGatewaySP1Multisig (0xCafEf00d348Adbd57c37d1B77e0619C6244C6878) {
    +++ description: None
      sourceHashes:
+        ["0x81a7349eebb98ac33b0bc6842e3cb258034a8f2a4ba004570bb8e2e25947f9ff","0xd42bbf9f7dcd3720a7fc6bdc6edfdfae8800a37d6dd4decfa0ef6ca4a2e88940"]
    }
```

```diff
    contract SuccinctGatewayMultisig (0xd1999B562e74d9fbf57b4479b3fe8748BDF4e4A0) {
    +++ description: None
      sourceHashes:
+        ["0x81a7349eebb98ac33b0bc6842e3cb258034a8f2a4ba004570bb8e2e25947f9ff","0xd42bbf9f7dcd3720a7fc6bdc6edfdfae8800a37d6dd4decfa0ef6ca4a2e88940"]
    }
```

Generated with discovered.json: 0x3a94a8b28edaa88a724e637b67fd3f1fc11e7976

# Diff at Wed, 02 Oct 2024 14:25:10 GMT:

- chain: ethereum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@d101c705b5f4fd0b3af2e251678b85e1005b31d8 block: 20871621
- current block number: 20878389

## Description

Config related.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20871621 (main branch discovery), not current.

```diff
    contract Blobstream (0x7Cf3876F681Dbb6EdA8f6FfC45D66B996Df08fAe) {
    +++ description: None
      values.$pastUpgrades:
+        [["2024-06-05T19:21:47.000Z",["0x41a87C543EBcbD93706CF5260AD057D9eCBA1caE"]],["2024-08-26T18:55:23.000Z",["0x47fd660D5252Bd6F9D2c71507E46aa1d6e957c23"]]]
    }
```

Generated with discovered.json: 0xf89ccb2be12746b4bec38d624d3e30104798ce9c

# Diff at Wed, 02 Oct 2024 14:23:55 GMT:

- chain: base
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@d101c705b5f4fd0b3af2e251678b85e1005b31d8 block: 20504067
- current block number: 20544837

## Description

Config related.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20504067 (main branch discovery), not current.

```diff
    contract Blobstream (0xA83ca7775Bc2889825BcDeDfFa5b758cf69e8794) {
    +++ description: None
      values.$pastUpgrades:
+        [["2024-03-17T04:53:27.000Z",["0x7C3A9b466FF5c02582fa32d4aD1b2Cb431fB7c9b"]],["2024-03-18T01:20:33.000Z",["0xfb19439fBa9f16aA720be6bE0e53465a9733C964"]],["2024-08-26T18:52:49.000Z",["0x47fd660D5252Bd6F9D2c71507E46aa1d6e957c23"]]]
    }
```

Generated with discovered.json: 0xa8fac87e1d40486f32dce5b155f9a6e3a8bc98dc

# Diff at Wed, 02 Oct 2024 14:23:43 GMT:

- chain: arbitrum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@d101c705b5f4fd0b3af2e251678b85e1005b31d8 block: 259311089
- current block number: 259634526

## Description

Config related.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 259311089 (main branch discovery), not current.

```diff
    contract Blobstream (0xA83ca7775Bc2889825BcDeDfFa5b758cf69e8794) {
    +++ description: None
      values.$pastUpgrades:
+        [["2024-03-17T04:51:20.000Z",["0x7C3A9b466FF5c02582fa32d4aD1b2Cb431fB7c9b"]],["2024-03-18T01:19:36.000Z",["0xfb19439fBa9f16aA720be6bE0e53465a9733C964"]],["2024-08-26T18:53:22.000Z",["0x47fd660D5252Bd6F9D2c71507E46aa1d6e957c23"]]]
    }
```

Generated with discovered.json: 0xbaaadc999e15bab5458f9d03f1ac9cea3dd706c0

# Diff at Tue, 01 Oct 2024 15:45:10 GMT:

- chain: ethereum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@974999225bba0722b5e81edd4c1b80928d80ef33 block: 20733790
- current block number: 20871621

## Description

New verifier.

## Watched changes

```diff
    contract SuccinctGatewaySP1 (0x3B6041173B80E77f038f3F2C0f9744f04837185e) {
    +++ description: None
+++ description: The verifier contract address for SP1, and whether it is frozen (true if frozen). This prover route was frozen on 2024-09-21.
      values.oldVerifier2.1:
-        false
+        true
+++ description: The prover contract address for SP1, and whether it is frozen (true if frozen).
      values.verifier.0:
-        "0x0000000000000000000000000000000000000000"
+        "0x1764C29FBd94865198588f10FC75D4f6636d158d"
    }
```

```diff
+   Status: CREATED
    contract SP1Verifier (0x1764C29FBd94865198588f10FC75D4f6636d158d)
    +++ description: None
```

## Source code changes

```diff
...-0x1764C29FBd94865198588f10FC75D4f6636d158d.sol | 1428 ++++++++++++++++++++
 1 file changed, 1428 insertions(+)
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20733790 (main branch discovery), not current.

```diff
    contract SuccinctGatewaySP1 (0x3B6041173B80E77f038f3F2C0f9744f04837185e) {
    +++ description: None
+++ description: The prover contract address for SP1, and whether it is frozen (true if frozen).
      values.verifier.0:
-        "0x6B6A7Ded061567d8A56279801DEA5cFB79be5bFc"
+        "0x0000000000000000000000000000000000000000"
+++ description: The verifier contract address for SP1, and whether it is frozen (true if frozen). This prover route was frozen on 2024-09-21.
      values.oldVerifier2:
+        ["0x6B6A7Ded061567d8A56279801DEA5cFB79be5bFc",false]
      fieldMeta.verifier.description:
-        "The verifier contract address for SP1, and whether it is frozen (true if frozen)."
+        "The prover contract address for SP1, and whether it is frozen (true if frozen)."
      fieldMeta.oldVerifier2:
+        {"description":"The verifier contract address for SP1, and whether it is frozen (true if frozen). This prover route was frozen on 2024-09-21."}
    }
```

Generated with discovered.json: 0x048bcfad6829c5ec110d72088a643485686bebb8

# Diff at Tue, 01 Oct 2024 15:44:57 GMT:

- chain: base
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@974999225bba0722b5e81edd4c1b80928d80ef33 block: 19672913
- current block number: 20504067

## Description

New verifier.

## Watched changes

```diff
    contract SuccinctGatewaySP1 (0x3B6041173B80E77f038f3F2C0f9744f04837185e) {
    +++ description: None
+++ description: The verifier contract address for SP1, and whether it is frozen (true if frozen). This prover route was frozen on 2024-09-21.
      values.oldVerifier2.1:
-        false
+        true
+++ description: The prover contract address for SP1, and whether it is frozen (true if frozen).
      values.verifier.0:
-        "0x0000000000000000000000000000000000000000"
+        "0x1764C29FBd94865198588f10FC75D4f6636d158d"
    }
```

```diff
+   Status: CREATED
    contract SP1Verifier (0x1764C29FBd94865198588f10FC75D4f6636d158d)
    +++ description: None
```

## Source code changes

```diff
...-0x1764C29FBd94865198588f10FC75D4f6636d158d.sol | 1428 ++++++++++++++++++++
 1 file changed, 1428 insertions(+)
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19672913 (main branch discovery), not current.

```diff
    contract SuccinctGatewaySP1 (0x3B6041173B80E77f038f3F2C0f9744f04837185e) {
    +++ description: None
+++ description: The prover contract address for SP1, and whether it is frozen (true if frozen).
      values.verifier.0:
-        "0x6B6A7Ded061567d8A56279801DEA5cFB79be5bFc"
+        "0x0000000000000000000000000000000000000000"
+++ description: The verifier contract address for SP1, and whether it is frozen (true if frozen). This prover route was frozen on 2024-09-21.
      values.oldVerifier2:
+        ["0x6B6A7Ded061567d8A56279801DEA5cFB79be5bFc",false]
      fieldMeta.verifier.description:
-        "The verifier contract address for SP1, and whether it is frozen (true if frozen)."
+        "The prover contract address for SP1, and whether it is frozen (true if frozen)."
      fieldMeta.oldVerifier2:
+        {"description":"The verifier contract address for SP1, and whether it is frozen (true if frozen). This prover route was frozen on 2024-09-21."}
    }
```

Generated with discovered.json: 0x7c625db0b4e4f64e52d05c87e29ca4fe2a1a4e54

# Diff at Tue, 01 Oct 2024 15:44:43 GMT:

- chain: arbitrum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@974999225bba0722b5e81edd4c1b80928d80ef33 block: 252706992
- current block number: 259311089

## Description

New verifier used, oldVerifier2 frozen.

## Watched changes

```diff
    contract SuccinctGatewaySP1 (0x3B6041173B80E77f038f3F2C0f9744f04837185e) {
    +++ description: None
+++ description: The verifier contract address for SP1, and whether it is frozen (true if frozen). This prover route was frozen on 2024-09-21.
      values.oldVerifier2.1:
-        false
+        true
+++ description: The prover contract address for SP1, and whether it is frozen (true if frozen).
      values.verifier.0:
-        "0x0000000000000000000000000000000000000000"
+        "0x1764C29FBd94865198588f10FC75D4f6636d158d"
    }
```

```diff
+   Status: CREATED
    contract SP1Verifier (0x1764C29FBd94865198588f10FC75D4f6636d158d)
    +++ description: None
```

## Source code changes

```diff
...-0x1764C29FBd94865198588f10FC75D4f6636d158d.sol | 1428 ++++++++++++++++++++
 ...0xc350F063C13a3Ca21331610fe159E697a5c9c2FB.sol} |    0
 2 files changed, 1428 insertions(+)
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 252706992 (main branch discovery), not current.

```diff
    contract SuccinctGatewaySP1 (0x3B6041173B80E77f038f3F2C0f9744f04837185e) {
    +++ description: None
+++ description: The prover contract address for SP1, and whether it is frozen (true if frozen).
      values.verifier.0:
-        "0x6B6A7Ded061567d8A56279801DEA5cFB79be5bFc"
+        "0x0000000000000000000000000000000000000000"
+++ description: The verifier contract address for SP1, and whether it is frozen (true if frozen). This prover route was frozen on 2024-09-21.
      values.oldVerifier2:
+        ["0x6B6A7Ded061567d8A56279801DEA5cFB79be5bFc",false]
      fieldMeta.verifier.description:
-        "The verifier contract address for SP1, and whether it is frozen (true if frozen)."
+        "The prover contract address for SP1, and whether it is frozen (true if frozen)."
      fieldMeta.oldVerifier2:
+        {"description":"The verifier contract address for SP1, and whether it is frozen (true if frozen). This prover route was frozen on 2024-09-21."}
    }
```

Generated with discovered.json: 0x34ba33bde71ea0790a85be3b1105b31083a46990

# Diff at Thu, 12 Sep 2024 16:05:19 GMT:

- chain: base
- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@a548a141184c0638644a7574ba789109e041cf23 block: 19672913
- current block number: 19672913

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19672913 (main branch discovery), not current.

```diff
    contract Blobstream (0xA83ca7775Bc2889825BcDeDfFa5b758cf69e8794) {
    +++ description: None
      values.accessControl:
+        {"DEFAULT_ADMIN_ROLE":{"adminRole":"DEFAULT_ADMIN_ROLE","members":["0x6ABa5D2084362038C9640a8851ff3b8BCbA81Ca6"]},"TIMELOCK_ROLE":{"adminRole":"DEFAULT_ADMIN_ROLE","members":["0x6ABa5D2084362038C9640a8851ff3b8BCbA81Ca6"]},"GUARDIAN_ROLE":{"adminRole":"DEFAULT_ADMIN_ROLE","members":["0x6ABa5D2084362038C9640a8851ff3b8BCbA81Ca6"]}}
    }
```

Generated with discovered.json: 0x56c0008468b22a60e944d905106604276ae22d99

# Diff at Thu, 12 Sep 2024 16:05:08 GMT:

- chain: arbitrum
- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@a548a141184c0638644a7574ba789109e041cf23 block: 252706992
- current block number: 252706992

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 252706992 (main branch discovery), not current.

```diff
    contract Blobstream (0xA83ca7775Bc2889825BcDeDfFa5b758cf69e8794) {
    +++ description: None
      values.accessControl:
+        {"DEFAULT_ADMIN_ROLE":{"adminRole":"DEFAULT_ADMIN_ROLE","members":["0x738a9b55304f9fcF776B3BA285e50c0f9eF77997"]},"TIMELOCK_ROLE":{"adminRole":"DEFAULT_ADMIN_ROLE","members":["0x738a9b55304f9fcF776B3BA285e50c0f9eF77997"]},"GUARDIAN_ROLE":{"adminRole":"DEFAULT_ADMIN_ROLE","members":["0x738a9b55304f9fcF776B3BA285e50c0f9eF77997"]}}
    }
```

Generated with discovered.json: 0x3eadd19bf219e615506b7a4f6cc2e2b18262c27c

# Diff at Thu, 12 Sep 2024 16:04:28 GMT:

- chain: ethereum
- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@a548a141184c0638644a7574ba789109e041cf23 block: 20733790
- current block number: 20733790

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20733790 (main branch discovery), not current.

```diff
    contract Blobstream (0x7Cf3876F681Dbb6EdA8f6FfC45D66B996Df08fAe) {
    +++ description: None
      values.accessControl:
+        {"DEFAULT_ADMIN_ROLE":{"adminRole":"DEFAULT_ADMIN_ROLE","members":["0x8bF34D8df1eF0A8A7f27fC587202848E528018E6"]},"TIMELOCK_ROLE":{"adminRole":"DEFAULT_ADMIN_ROLE","members":["0x8bF34D8df1eF0A8A7f27fC587202848E528018E6"]},"GUARDIAN_ROLE":{"adminRole":"DEFAULT_ADMIN_ROLE","members":["0x8bF34D8df1eF0A8A7f27fC587202848E528018E6"]}}
    }
```

Generated with discovered.json: 0xd4c0029f645491b799b2a19d83254da94077c26d

# Diff at Thu, 12 Sep 2024 09:59:43 GMT:

- chain: base
- author: Luca Donno (<donnoh99@gmail.com>)
- comparing to: main@21748f79216eb050ed17a98d0e8a74893f478f74 block: 19369265
- current block number: 19672913

## Description

Renames.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19369265 (main branch discovery), not current.

```diff
    contract SuccinctGatewaySP1 (0x3B6041173B80E77f038f3F2C0f9744f04837185e) {
    +++ description: None
      template:
-        "blobstream/SP1SuccinctGateway"
+        "succinct/SP1SuccinctGateway"
      values.blobstreamVerifier:
-        ["0x6B6A7Ded061567d8A56279801DEA5cFB79be5bFc",false]
      values.blobstreamVerifierOld:
-        ["0xc350F063C13a3Ca21331610fe159E697a5c9c2FB",true]
+++ description: The verifier contract address for SP1, and whether it is frozen (true if frozen). This verifier route was frozen on 2024-09-04.
      values.oldVerifier:
+        ["0xc350F063C13a3Ca21331610fe159E697a5c9c2FB",true]
+++ description: The verifier contract address for SP1, and whether it is frozen (true if frozen).
      values.verifier:
+        ["0x6B6A7Ded061567d8A56279801DEA5cFB79be5bFc",false]
      fieldMeta.blobstreamVerifierOld:
-        {"description":"The verifier contract address for Blobstream SP1, and whether it is frozen (true if frozen). This verifier route was frozen on 2024-09-04."}
      fieldMeta.blobstreamVerifier:
-        {"description":"The verifier contract address for Blobstream SP1, and whether it is frozen (true if frozen)."}
      fieldMeta.oldVerifier:
+        {"description":"The verifier contract address for SP1, and whether it is frozen (true if frozen). This verifier route was frozen on 2024-09-04."}
      fieldMeta.verifier:
+        {"description":"The verifier contract address for SP1, and whether it is frozen (true if frozen)."}
    }
```

```diff
    contract Blobstream (0xA83ca7775Bc2889825BcDeDfFa5b758cf69e8794) {
    +++ description: None
      template:
-        "blobstream/SP1Blobstream"
+        "succinct/SP1Blobstream"
    }
```

Generated with discovered.json: 0x3b8d2273e95552c643dd25b1e3aa0a2f3aae8ed8

# Diff at Thu, 12 Sep 2024 09:59:29 GMT:

- chain: arbitrum
- author: Luca Donno (<donnoh99@gmail.com>)
- comparing to: main@21748f79216eb050ed17a98d0e8a74893f478f74 block: 250294365
- current block number: 252706992

## Description

Renames.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 250294365 (main branch discovery), not current.

```diff
    contract SuccinctGatewaySP1 (0x3B6041173B80E77f038f3F2C0f9744f04837185e) {
    +++ description: None
      template:
-        "blobstream/SP1SuccinctGateway"
+        "succinct/SP1SuccinctGateway"
      values.blobstreamVerifier:
-        ["0x6B6A7Ded061567d8A56279801DEA5cFB79be5bFc",false]
      values.blobstreamVerifierOld:
-        ["0xc350F063C13a3Ca21331610fe159E697a5c9c2FB",true]
+++ description: The verifier contract address for SP1, and whether it is frozen (true if frozen). This verifier route was frozen on 2024-09-04.
      values.oldVerifier:
+        ["0xc350F063C13a3Ca21331610fe159E697a5c9c2FB",true]
+++ description: The verifier contract address for SP1, and whether it is frozen (true if frozen).
      values.verifier:
+        ["0x6B6A7Ded061567d8A56279801DEA5cFB79be5bFc",false]
      fieldMeta.blobstreamVerifierOld:
-        {"description":"The verifier contract address for Blobstream SP1, and whether it is frozen (true if frozen). This verifier route was frozen on 2024-09-04."}
      fieldMeta.blobstreamVerifier:
-        {"description":"The verifier contract address for Blobstream SP1, and whether it is frozen (true if frozen)."}
      fieldMeta.oldVerifier:
+        {"description":"The verifier contract address for SP1, and whether it is frozen (true if frozen). This verifier route was frozen on 2024-09-04."}
      fieldMeta.verifier:
+        {"description":"The verifier contract address for SP1, and whether it is frozen (true if frozen)."}
    }
```

```diff
    contract Blobstream (0xA83ca7775Bc2889825BcDeDfFa5b758cf69e8794) {
    +++ description: None
      template:
-        "blobstream/SP1Blobstream"
+        "succinct/SP1Blobstream"
    }
```

Generated with discovered.json: 0x284d08252aa2489c2c43f1a7fcee954f098d861a

# Diff at Thu, 12 Sep 2024 09:59:15 GMT:

- chain: ethereum
- author: Luca Donno (<donnoh99@gmail.com>)
- comparing to: main@21748f79216eb050ed17a98d0e8a74893f478f74 block: 20683436
- current block number: 20733790

## Description

Renames.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20683436 (main branch discovery), not current.

```diff
    contract SuccinctGatewaySP1 (0x3B6041173B80E77f038f3F2C0f9744f04837185e) {
    +++ description: None
      template:
-        "blobstream/SP1SuccinctGateway"
+        "succinct/SP1SuccinctGateway"
      values.blobstreamVerifier:
-        ["0x6B6A7Ded061567d8A56279801DEA5cFB79be5bFc",false]
      values.blobstreamVerifierOld:
-        ["0xc350F063C13a3Ca21331610fe159E697a5c9c2FB",true]
+++ description: The verifier contract address for SP1, and whether it is frozen (true if frozen). This verifier route was frozen on 2024-09-04.
      values.oldVerifier:
+        ["0xc350F063C13a3Ca21331610fe159E697a5c9c2FB",true]
+++ description: The verifier contract address for SP1, and whether it is frozen (true if frozen).
      values.verifier:
+        ["0x6B6A7Ded061567d8A56279801DEA5cFB79be5bFc",false]
      fieldMeta.blobstreamVerifierOld:
-        {"description":"The verifier contract address for Blobstream SP1, and whether it is frozen (true if frozen). This verifier route was frozen on 2024-09-04."}
      fieldMeta.blobstreamVerifier:
-        {"description":"The verifier contract address for Blobstream SP1, and whether it is frozen (true if frozen)."}
      fieldMeta.oldVerifier:
+        {"description":"The verifier contract address for SP1, and whether it is frozen (true if frozen). This verifier route was frozen on 2024-09-04."}
      fieldMeta.verifier:
+        {"description":"The verifier contract address for SP1, and whether it is frozen (true if frozen)."}
    }
```

```diff
    contract Blobstream (0x7Cf3876F681Dbb6EdA8f6FfC45D66B996Df08fAe) {
    +++ description: None
      template:
-        "blobstream/SP1Blobstream"
+        "succinct/SP1Blobstream"
    }
```

Generated with discovered.json: 0x10abadaa17757983f4466ea6755c97721a41100d

# Diff at Thu, 05 Sep 2024 09:18:11 GMT:

- chain: ethereum
- author: vincfurc (<10850139+vincfurc@users.noreply.github.com>)
- comparing to: main@6ec5206203571575116cf743c30b8a7c71ceafbb block: 20641123
- current block number: 20683436

## Description

New verifier version. Gateway route to old verifier route is frozen, and new route is added with identifier 0xc865c1b6.

## Watched changes

```diff
    contract SuccinctGatewaySP1 (0x3B6041173B80E77f038f3F2C0f9744f04837185e) {
    +++ description: None
+++ description: The verifier contract address for Blobstream SP1, and whether it is frozen (true if frozen).
      values.blobstreamVerifier.0:
-        "0x0000000000000000000000000000000000000000"
+        "0x6B6A7Ded061567d8A56279801DEA5cFB79be5bFc"
+++ description: The verifier contract address for Blobstream SP1, and whether it is frozen (true if frozen). This verifier route was frozen on 2024-09-04.
      values.blobstreamVerifierOld.1:
-        false
+        true
    }
```

```diff
+   Status: CREATED
    contract SP1Verifier (0x6B6A7Ded061567d8A56279801DEA5cFB79be5bFc)
    +++ description: None
```

## Source code changes

```diff
...-0x6B6A7Ded061567d8A56279801DEA5cFB79be5bFc.sol | 1427 ++++++++++++++++++++
 ...0xc350F063C13a3Ca21331610fe159E697a5c9c2FB.sol} |    0
 2 files changed, 1427 insertions(+)
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20641123 (main branch discovery), not current.

```diff
    contract SuccinctGatewaySP1 (0x3B6041173B80E77f038f3F2C0f9744f04837185e) {
    +++ description: None
+++ description: The verifier contract address for Blobstream SP1, and whether it is frozen (true if frozen).
      values.blobstreamVerifier.0:
-        "0xc350F063C13a3Ca21331610fe159E697a5c9c2FB"
+        "0x0000000000000000000000000000000000000000"
+++ description: The verifier contract address for Blobstream SP1, and whether it is frozen (true if frozen). This verifier route was frozen on 2024-09-04.
      values.blobstreamVerifierOld:
+        ["0xc350F063C13a3Ca21331610fe159E697a5c9c2FB",false]
      template:
+        "blobstream/SP1SuccinctGateway"
      fieldMeta:
+        {"blobstreamVerifierOld":{"description":"The verifier contract address for Blobstream SP1, and whether it is frozen (true if frozen). This verifier route was frozen on 2024-09-04."},"blobstreamVerifier":{"description":"The verifier contract address for Blobstream SP1, and whether it is frozen (true if frozen)."}}
    }
```

Generated with discovered.json: 0xa0600aa5c75af52b962365da504459ed78d5249a

# Diff at Thu, 05 Sep 2024 09:18:05 GMT:

- chain: base
- author: vincfurc (<10850139+vincfurc@users.noreply.github.com>)
- comparing to: main@6ec5206203571575116cf743c30b8a7c71ceafbb block: 19114152
- current block number: 19369265

## Description

New verifier version. Gateway route to old verifier route is frozen, and new route is added with identifier 0xc865c1b6.

## Watched changes

```diff
    contract SuccinctGatewaySP1 (0x3B6041173B80E77f038f3F2C0f9744f04837185e) {
    +++ description: None
+++ description: The verifier contract address for Blobstream SP1, and whether it is frozen (true if frozen).
      values.blobstreamVerifier.0:
-        "0x0000000000000000000000000000000000000000"
+        "0x6B6A7Ded061567d8A56279801DEA5cFB79be5bFc"
+++ description: The verifier contract address for Blobstream SP1, and whether it is frozen (true if frozen). This verifier route was frozen on 2024-09-04.
      values.blobstreamVerifierOld.1:
-        false
+        true
    }
```

```diff
+   Status: CREATED
    contract SP1Verifier (0x6B6A7Ded061567d8A56279801DEA5cFB79be5bFc)
    +++ description: None
```

## Source code changes

```diff
...-0x6B6A7Ded061567d8A56279801DEA5cFB79be5bFc.sol | 1427 ++++++++++++++++++++
 ...0xc350F063C13a3Ca21331610fe159E697a5c9c2FB.sol} |    0
 2 files changed, 1427 insertions(+)
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19114152 (main branch discovery), not current.

```diff
    contract SuccinctGatewaySP1 (0x3B6041173B80E77f038f3F2C0f9744f04837185e) {
    +++ description: None
+++ description: The verifier contract address for Blobstream SP1, and whether it is frozen (true if frozen).
      values.blobstreamVerifier.0:
-        "0xc350F063C13a3Ca21331610fe159E697a5c9c2FB"
+        "0x0000000000000000000000000000000000000000"
+++ description: The verifier contract address for Blobstream SP1, and whether it is frozen (true if frozen). This verifier route was frozen on 2024-09-04.
      values.blobstreamVerifierOld:
+        ["0xc350F063C13a3Ca21331610fe159E697a5c9c2FB",false]
      template:
+        "blobstream/SP1SuccinctGateway"
      fieldMeta:
+        {"blobstreamVerifierOld":{"description":"The verifier contract address for Blobstream SP1, and whether it is frozen (true if frozen). This verifier route was frozen on 2024-09-04."},"blobstreamVerifier":{"description":"The verifier contract address for Blobstream SP1, and whether it is frozen (true if frozen)."}}
    }
```

Generated with discovered.json: 0x27d781503a7821fdb523c9be91443e9eca1c3527

# Diff at Thu, 05 Sep 2024 09:17:59 GMT:

- chain: arbitrum
- author: vincfurc (<10850139+vincfurc@users.noreply.github.com>)
- comparing to: main@6ec5206203571575116cf743c30b8a7c71ceafbb block: 248266616
- current block number: 250294365

## Description

New verifier version. Gateway route to old verifier route is frozen, and new route is added with identifier 0xc865c1b6.

## Watched changes

```diff
    contract SuccinctGatewaySP1 (0x3B6041173B80E77f038f3F2C0f9744f04837185e) {
    +++ description: None
+++ description: The verifier contract address for Blobstream SP1, and whether it is frozen (true if frozen).
      values.blobstreamVerifier.0:
-        "0x0000000000000000000000000000000000000000"
+        "0x6B6A7Ded061567d8A56279801DEA5cFB79be5bFc"
+++ description: The verifier contract address for Blobstream SP1, and whether it is frozen (true if frozen). This verifier route was frozen on 2024-09-04.
      values.blobstreamVerifierOld.1:
-        false
+        true
    }
```

```diff
+   Status: CREATED
    contract  (0x6B6A7Ded061567d8A56279801DEA5cFB79be5bFc)
    +++ description: None
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 248266616 (main branch discovery), not current.

```diff
    contract SuccinctGatewaySP1 (0x3B6041173B80E77f038f3F2C0f9744f04837185e) {
    +++ description: None
+++ description: The verifier contract address for Blobstream SP1, and whether it is frozen (true if frozen).
      values.blobstreamVerifier.0:
-        "0xc350F063C13a3Ca21331610fe159E697a5c9c2FB"
+        "0x0000000000000000000000000000000000000000"
+++ description: The verifier contract address for Blobstream SP1, and whether it is frozen (true if frozen). This verifier route was frozen on 2024-09-04.
      values.blobstreamVerifierOld:
+        ["0xc350F063C13a3Ca21331610fe159E697a5c9c2FB",false]
      template:
+        "blobstream/SP1SuccinctGateway"
      fieldMeta:
+        {"blobstreamVerifierOld":{"description":"The verifier contract address for Blobstream SP1, and whether it is frozen (true if frozen). This verifier route was frozen on 2024-09-04."},"blobstreamVerifier":{"description":"The verifier contract address for Blobstream SP1, and whether it is frozen (true if frozen)."}}
    }
```

Generated with discovered.json: 0xe304a4299d879d9d83a90949b26d2781cd131aad

# Diff at Fri, 30 Aug 2024 11:34:31 GMT:

- chain: ethereum
- author: vincfurc (<10850139+vincfurc@users.noreply.github.com>)
- comparing to: main@15092f43b0444977eaee21a17c064e8a6944b864 block: 20218838
- current block number: 20641123

## Description

- The SP1 Verifier Gateway address is set in the Blobstream contract, and replaces the SuccinctGateway for routing to the correct verifier. The Guardian can update the SP1VerifierGateway address.
- RequestHeaderRange and NextHeaderRange functions deprecated, together with their functionIds. FunctionIds were previously used when calling the SuccinctGateway to identify which verifier to use for proof verification. Now the verifier selector is contained in the first 4 bytes of the proof.
- Verifier program verification key is now stored in the Blobstream contract and it is used in the verifier for proof verification. It can be updated by the Guardian.
- CommitHeaderRange has now a permissioned mode, due to onlyApprovedRelayer modifier. Guardian can approve authorised relayers and toggle the permissioned mode through checkRelayer updates (true for permissioned, false for permissionless).

- SP1VerifierGateway:  contract that verifies proofs by routing to the correct verifier based on the verifier selector contained in the first 4 bytes of the proof. It additionally checks that to see that the verifier route is not frozen. The owner of the contract can add and freeze routes.


## Watched changes

```diff
    contract Blobstream (0x7Cf3876F681Dbb6EdA8f6FfC45D66B996Df08fAe) {
    +++ description: None
      values.$implementation:
-        "0x41a87C543EBcbD93706CF5260AD057D9eCBA1caE"
+        "0x47fd660D5252Bd6F9D2c71507E46aa1d6e957c23"
      values.$upgradeCount:
-        1
+        2
      values.DATA_COMMITMENT_MAX:
-        10000
+        1000
      values.gateway:
-        "0x6c7a05e0AE641c6559fD76ac56641778B6eCd776"
      values.headerRangeFunctionId:
-        "0xdb3232748ba9f2906d9d2ce97d2fac3963d4346de23c30521f346e10ddad82f7"
      values.nextHeaderFunctionId:
-        "0xf7ab2ac6f5ccf2da79050efcc0dbdb06d5ae05a332f58076aeac7fc8c73811fe"
      values.VERSION:
-        "0.1.0"
+        "1.1.0"
      values.blobstreamProgramVkey:
+        "0x0038c5c5568fe5e1ae267efb1298a7792d1cda00bccc2d1d4bfa4c1511e06380"
      values.checkRelayer:
+        true
      values.gateway_deprecated:
+        "0x6c7a05e0AE641c6559fD76ac56641778B6eCd776"
      values.headerRangeFunctionId_deprecated:
+        "0xdb3232748ba9f2906d9d2ce97d2fac3963d4346de23c30521f346e10ddad82f7"
      values.isRelayerApproved:
+        true
      values.nextHeaderFunctionId_depcrecated:
+        "0xf7ab2ac6f5ccf2da79050efcc0dbdb06d5ae05a332f58076aeac7fc8c73811fe"
      values.verifier:
+        "0x3B6041173B80E77f038f3F2C0f9744f04837185e"
      errors:
-        {"isRelayerApproved":"Execution reverted"}
      derivedName:
-        "BlobstreamX"
+        "SP1Blobstream"
    }
```

```diff
+   Status: CREATED
    contract SuccinctGatewaySP1 (0x3B6041173B80E77f038f3F2C0f9744f04837185e)
    +++ description: None
```

```diff
+   Status: CREATED
    contract SP1Verifier (0xc350F063C13a3Ca21331610fe159E697a5c9c2FB)
    +++ description: None
```

```diff
+   Status: CREATED
    contract SuccinctGatewaySP1Multisig (0xCafEf00d348Adbd57c37d1B77e0619C6244C6878)
    +++ description: None
```

## Source code changes

```diff
.../Blobstream/SP1Blobstream.sol}                  |  431 +++---
 .../blobstream/ethereum/.flat/SP1Verifier.sol      | 1429 ++++++++++++++++++++
 .../ethereum/.flat/SuccinctGatewaySP1.sol          |  230 ++++
 .../SuccinctGatewaySP1Multisig/GnosisSafe.sol      |  952 +++++++++++++
 .../GnosisSafeProxy.p.sol                          |   34 +
 5 files changed, 2888 insertions(+), 188 deletions(-)
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20218838 (main branch discovery), not current.

```diff
    contract Blobstream (0x7Cf3876F681Dbb6EdA8f6FfC45D66B996Df08fAe) {
    +++ description: None
      name:
-        "BlobstreamX"
+        "Blobstream"
      values.accessControl:
-        {"DEFAULT_ADMIN_ROLE":{"adminRole":"DEFAULT_ADMIN_ROLE","members":["0x8bF34D8df1eF0A8A7f27fC587202848E528018E6"]},"TIMELOCK_ROLE":{"adminRole":"DEFAULT_ADMIN_ROLE","members":["0x8bF34D8df1eF0A8A7f27fC587202848E528018E6"]},"GUARDIAN_ROLE":{"adminRole":"DEFAULT_ADMIN_ROLE","members":["0x8bF34D8df1eF0A8A7f27fC587202848E528018E6"]}}
      values.relayers:
+        ["0x44eb418a966ff47f5af6f48aea6afde0bf193a8d"]
      template:
+        "blobstream/SP1Blobstream"
      errors:
+        {"isRelayerApproved":"Execution reverted"}
    }
```

```diff
    contract BlobstreamMultisig (0x8bF34D8df1eF0A8A7f27fC587202848E528018E6) {
    +++ description: None
      name:
-        "BlobstreamXMultisig"
+        "BlobstreamMultisig"
    }
```

```diff
    contract SuccinctGatewayMultisig (0xd1999B562e74d9fbf57b4479b3fe8748BDF4e4A0) {
    +++ description: None
      name:
-        "SuccinctMultisig"
+        "SuccinctGatewayMultisig"
    }
```

Generated with discovered.json: 0x1bc2d20712a069d6f9e52125dee9bde59b48e33f

# Diff at Fri, 30 Aug 2024 11:34:21 GMT:

- chain: base
- author: vincfurc (<10850139+vincfurc@users.noreply.github.com>)
- comparing to: main@15092f43b0444977eaee21a17c064e8a6944b864 block: 14061228
- current block number: 19114152

## Description

- The SP1 Verifier Gateway address is set in the Blobstream contract, and replaces the SuccinctGateway for routing to the correct verifier. The Guardian can update the SP1VerifierGateway address.
- RequestHeaderRange and NextHeaderRange functions deprecated, together with their functionIds. FunctionIds were previously used when calling the SuccinctGateway to identify which verifier to use for proof verification. Now the verifier selector is contained in the first 4 bytes of the proof.
- Verifier program verification key is now stored in the Blobstream contract and it is used in the verifier for proof verification. It can be updated by the Guardian.
- CommitHeaderRange has now a permissioned mode, due to onlyApprovedRelayer modifier. Guardian can approve authorised relayers and toggle the permissioned mode through checkRelayer updates (true for permissioned, false for permissionless).

- SP1VerifierGateway:  contract that verifies proofs by routing to the correct verifier based on the verifier selector contained in the first 4 bytes of the proof. It additionally checks that to see that the verifier route is not frozen. The owner of the contract can add and freeze routes.

## Watched changes

```diff
    contract Blobstream (0xA83ca7775Bc2889825BcDeDfFa5b758cf69e8794) {
    +++ description: None
      values.$implementation:
-        "0xfb19439fBa9f16aA720be6bE0e53465a9733C964"
+        "0x47fd660D5252Bd6F9D2c71507E46aa1d6e957c23"
      values.$upgradeCount:
-        2
+        3
      values.DATA_COMMITMENT_MAX:
-        10000
+        1000
      values.gateway:
-        "0x6c7a05e0AE641c6559fD76ac56641778B6eCd776"
      values.headerRangeFunctionId:
-        "0x46132c86ed84fdc655528f80f9291dd3116b04902036b96925edc78bbf52b8ca"
      values.nextHeaderFunctionId:
-        "0x2ce8ca4f509cb09415b5a6ca6afa265571dac0b9f6ddb46f487e017fec71cf25"
      values.VERSION:
-        "0.1.0"
+        "1.1.0"
      values.blobstreamProgramVkey:
+        "0x0038c5c5568fe5e1ae267efb1298a7792d1cda00bccc2d1d4bfa4c1511e06380"
      values.checkRelayer:
+        true
      values.gateway_deprecated:
+        "0x6c7a05e0AE641c6559fD76ac56641778B6eCd776"
      values.headerRangeFunctionId_deprecated:
+        "0x46132c86ed84fdc655528f80f9291dd3116b04902036b96925edc78bbf52b8ca"
      values.isRelayerApproved:
+        true
      values.nextHeaderFunctionId_depcrecated:
+        "0x2ce8ca4f509cb09415b5a6ca6afa265571dac0b9f6ddb46f487e017fec71cf25"
      values.verifier:
+        "0x3B6041173B80E77f038f3F2C0f9744f04837185e"
      errors:
-        {"isRelayerApproved":"Execution reverted"}
      derivedName:
-        "BlobstreamX"
+        "SP1Blobstream"
    }
```

```diff
+   Status: CREATED
    contract SuccinctGatewaySP1 (0x3B6041173B80E77f038f3F2C0f9744f04837185e)
    +++ description: None
```

```diff
+   Status: CREATED
    contract SP1Verifier (0xc350F063C13a3Ca21331610fe159E697a5c9c2FB)
    +++ description: None
```

```diff
+   Status: CREATED
    contract SuccinctGatewaySP1Multisig (0xCafEf00d348Adbd57c37d1B77e0619C6244C6878)
    +++ description: None
```

## Source code changes

```diff
.../Blobstream/SP1Blobstream.sol}                  |  431 +++---
 .../blobstream/base/.flat/SP1Verifier.sol          | 1429 ++++++++++++++++++++
 .../blobstream/base/.flat/SuccinctGatewaySP1.sol   |  230 ++++
 .../SuccinctGatewaySP1Multisig/GnosisSafe.sol      |  952 +++++++++++++
 .../GnosisSafeProxy.p.sol                          |   34 +
 5 files changed, 2888 insertions(+), 188 deletions(-)
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 14061228 (main branch discovery), not current.

```diff
    contract BlobstreamMultisig (0x6ABa5D2084362038C9640a8851ff3b8BCbA81Ca6) {
    +++ description: None
      name:
-        "BlobstreamXMultisig"
+        "BlobstreamMultisig"
    }
```

```diff
    contract Blobstream (0xA83ca7775Bc2889825BcDeDfFa5b758cf69e8794) {
    +++ description: None
      name:
-        "BlobstreamX"
+        "Blobstream"
      values.accessControl:
-        {"DEFAULT_ADMIN_ROLE":{"adminRole":"DEFAULT_ADMIN_ROLE","members":["0x6ABa5D2084362038C9640a8851ff3b8BCbA81Ca6"]},"TIMELOCK_ROLE":{"adminRole":"DEFAULT_ADMIN_ROLE","members":["0x6ABa5D2084362038C9640a8851ff3b8BCbA81Ca6"]},"GUARDIAN_ROLE":{"adminRole":"DEFAULT_ADMIN_ROLE","members":["0x6ABa5D2084362038C9640a8851ff3b8BCbA81Ca6"]}}
      values.relayers:
+        ["0x44eb418a966ff47f5af6f48aea6afde0bf193a8d"]
      template:
+        "blobstream/SP1Blobstream"
      errors:
+        {"isRelayerApproved":"Execution reverted"}
    }
```

```diff
    contract SuccinctGatewayMultisig (0xdC00f2469023a7b0b1D5b6abE2F736F90955e7F3) {
    +++ description: None
      name:
-        "SuccinctMultisig"
+        "SuccinctGatewayMultisig"
    }
```

Generated with discovered.json: 0x5b2c360f19f29887785ca845f03f2e00ce253980

# Diff at Fri, 30 Aug 2024 11:34:11 GMT:

- chain: arbitrum
- author: vincfurc (<10850139+vincfurc@users.noreply.github.com>)
- comparing to: main@15092f43b0444977eaee21a17c064e8a6944b864 block: 208089280
- current block number: 248266616

## Description

- The SP1 Verifier Gateway address is set in the Blobstream contract, and replaces the SuccinctGateway for routing to the correct verifier. The Guardian can update the SP1VerifierGateway address.
- RequestHeaderRange and NextHeaderRange functions deprecated, together with their functionIds. FunctionIds were previously used when calling the SuccinctGateway to identify which verifier to use for proof verification. Now the verifier selector is contained in the first 4 bytes of the proof.
- Verifier program verification key is now stored in the Blobstream contract and it is used in the verifier for proof verification. It can be updated by the Guardian.
- CommitHeaderRange has now a permissioned mode, due to onlyApprovedRelayer modifier. Guardian can approve authorised relayers and toggle the permissioned mode through checkRelayer updates (true for permissioned, false for permissionless).

- SP1VerifierGateway:  contract that verifies proofs by routing to the correct verifier based on the verifier selector contained in the first 4 bytes of the proof. It additionally checks that to see that the verifier route is not frozen. The owner of the contract can add and freeze routes.

## Watched changes

```diff
    contract Blobstream (0xA83ca7775Bc2889825BcDeDfFa5b758cf69e8794) {
    +++ description: None
      values.$implementation:
-        "0xfb19439fBa9f16aA720be6bE0e53465a9733C964"
+        "0x47fd660D5252Bd6F9D2c71507E46aa1d6e957c23"
      values.$upgradeCount:
-        2
+        3
      values.DATA_COMMITMENT_MAX:
-        10000
+        1000
      values.gateway:
-        "0x6c7a05e0AE641c6559fD76ac56641778B6eCd776"
      values.headerRangeFunctionId:
-        "0x949dc389c82c63394889813be437513ebc5d06f43bbc9c1e2eb4b791faade1a0"
      values.nextHeaderFunctionId:
-        "0x044611c8d01cf88e09811f3270a654e7faf319e96b38f3dd7f9d218c8bb4d0ef"
      values.VERSION:
-        "0.1.0"
+        "1.1.0"
      values.blobstreamProgramVkey:
+        "0x0038c5c5568fe5e1ae267efb1298a7792d1cda00bccc2d1d4bfa4c1511e06380"
      values.checkRelayer:
+        true
      values.gateway_deprecated:
+        "0x6c7a05e0AE641c6559fD76ac56641778B6eCd776"
      values.headerRangeFunctionId_deprecated:
+        "0x949dc389c82c63394889813be437513ebc5d06f43bbc9c1e2eb4b791faade1a0"
      values.isRelayerApproved:
+        true
      values.nextHeaderFunctionId_depcrecated:
+        "0x044611c8d01cf88e09811f3270a654e7faf319e96b38f3dd7f9d218c8bb4d0ef"
      values.verifier:
+        "0x3B6041173B80E77f038f3F2C0f9744f04837185e"
      errors:
-        {"isRelayerApproved":"Execution reverted"}
      derivedName:
-        "BlobstreamX"
+        "SP1Blobstream"
    }
```

```diff
+   Status: CREATED
    contract SuccinctGatewaySP1 (0x3B6041173B80E77f038f3F2C0f9744f04837185e)
    +++ description: None
```

```diff
+   Status: CREATED
    contract SP1Verifier (0xc350F063C13a3Ca21331610fe159E697a5c9c2FB)
    +++ description: None
```

```diff
+   Status: CREATED
    contract SuccinctGatewaySP1Multisig (0xCafEf00d348Adbd57c37d1B77e0619C6244C6878)
    +++ description: None
```

## Source code changes

```diff
.../Blobstream/SP1Blobstream.sol}                  |  431 +++---
 .../blobstream/arbitrum/.flat/SP1Verifier.sol      | 1429 ++++++++++++++++++++
 .../arbitrum/.flat/SuccinctGatewaySP1.sol          |  230 ++++
 .../SuccinctGatewaySP1Multisig/GnosisSafe.sol      |  952 +++++++++++++
 .../GnosisSafeProxy.p.sol                          |   34 +
 5 files changed, 2888 insertions(+), 188 deletions(-)
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 208089280 (main branch discovery), not current.

```diff
    contract BlobstreamMultisig (0x738a9b55304f9fcF776B3BA285e50c0f9eF77997) {
    +++ description: None
      name:
-        "BlobstreamXMultisig"
+        "BlobstreamMultisig"
    }
```

```diff
    contract Blobstream (0xA83ca7775Bc2889825BcDeDfFa5b758cf69e8794) {
    +++ description: None
      name:
-        "BlobstreamX"
+        "Blobstream"
      values.accessControl:
-        {"DEFAULT_ADMIN_ROLE":{"adminRole":"DEFAULT_ADMIN_ROLE","members":["0x738a9b55304f9fcF776B3BA285e50c0f9eF77997"]},"TIMELOCK_ROLE":{"adminRole":"DEFAULT_ADMIN_ROLE","members":["0x738a9b55304f9fcF776B3BA285e50c0f9eF77997"]},"GUARDIAN_ROLE":{"adminRole":"DEFAULT_ADMIN_ROLE","members":["0x738a9b55304f9fcF776B3BA285e50c0f9eF77997"]}}
      values.relayers:
+        ["0x44eb418a966ff47f5af6f48aea6afde0bf193a8d"]
      template:
+        "blobstream/SP1Blobstream"
      errors:
+        {"isRelayerApproved":"Execution reverted"}
    }
```

```diff
    contract SuccinctGatewayMultisig (0xdC00f2469023a7b0b1D5b6abE2F736F90955e7F3) {
    +++ description: None
      name:
-        "SuccinctMultisig"
+        "SuccinctGatewayMultisig"
    }
```

Generated with discovered.json: 0x14340fa4862502db24894812cdb94c8b61760717

# Diff at Fri, 23 Aug 2024 09:57:30 GMT:

- chain: base
- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@67597c7d6c810bc726594446890178150240711e block: 14061228
- current block number: 14061228

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 14061228 (main branch discovery), not current.

```diff
    contract BlobstreamX (0xA83ca7775Bc2889825BcDeDfFa5b758cf69e8794) {
    +++ description: None
      values.$upgradeCount:
+        2
    }
```

Generated with discovered.json: 0x1155d09f610a62ea87831e6583719e50f97da383

# Diff at Fri, 23 Aug 2024 09:56:58 GMT:

- chain: arbitrum
- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@67597c7d6c810bc726594446890178150240711e block: 208089280
- current block number: 208089280

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 208089280 (main branch discovery), not current.

```diff
    contract BlobstreamX (0xA83ca7775Bc2889825BcDeDfFa5b758cf69e8794) {
    +++ description: None
      values.$upgradeCount:
+        2
    }
```

Generated with discovered.json: 0xdff2e689e46248cfd5fbc9cdc194a60b93a1bf8c

# Diff at Fri, 23 Aug 2024 09:51:30 GMT:

- chain: ethereum
- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@67597c7d6c810bc726594446890178150240711e block: 20218838
- current block number: 20218838

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20218838 (main branch discovery), not current.

```diff
    contract BlobstreamX (0x7Cf3876F681Dbb6EdA8f6FfC45D66B996Df08fAe) {
    +++ description: None
      values.$upgradeCount:
+        1
    }
```

Generated with discovered.json: 0x804c9139ebaa21377c708ddf285fb1ef9f61c6dd

# Diff at Wed, 21 Aug 2024 10:07:52 GMT:

- chain: base
- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@2f6dde3357bf5d79196b6e94f79d853a6c4ec72b block: 14061228
- current block number: 14061228

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 14061228 (main branch discovery), not current.

```diff
    contract BlobstreamX (0xA83ca7775Bc2889825BcDeDfFa5b758cf69e8794) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x0000000000000000000000000000000000000000","via":[]}]
    }
```

Generated with discovered.json: 0xc3b7e205dc04bbd75b04fd895e2c37c04afad1ba

# Diff at Wed, 21 Aug 2024 10:07:24 GMT:

- chain: arbitrum
- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@2f6dde3357bf5d79196b6e94f79d853a6c4ec72b block: 208089280
- current block number: 208089280

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 208089280 (main branch discovery), not current.

```diff
    contract BlobstreamX (0xA83ca7775Bc2889825BcDeDfFa5b758cf69e8794) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x0000000000000000000000000000000000000000","via":[]}]
    }
```

Generated with discovered.json: 0x6eebfbd59cd1ce9f75fa84ec38c1fc51dbc81fee

# Diff at Wed, 21 Aug 2024 10:02:15 GMT:

- chain: ethereum
- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@2f6dde3357bf5d79196b6e94f79d853a6c4ec72b block: 20218838
- current block number: 20218838

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20218838 (main branch discovery), not current.

```diff
    contract BlobstreamX (0x7Cf3876F681Dbb6EdA8f6FfC45D66B996Df08fAe) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x0000000000000000000000000000000000000000","via":[]}]
    }
```

Generated with discovered.json: 0x8a16c522e63785ff3d9daf2c6fe3cfa751a29239

# Diff at Fri, 09 Aug 2024 10:13:59 GMT:

- chain: base
- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@1f0da1d0aab7bc6b3b5e54e7e93480bd98e57035 block: 14061228
- current block number: 14061228

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 14061228 (main branch discovery), not current.

```diff
    contract BlobstreamXMultisig (0x6ABa5D2084362038C9640a8851ff3b8BCbA81Ca6) {
    +++ description: None
      values.$multisigThreshold:
-        "4 of 6 (67%)"
      values.getOwners:
-        ["0x0449689f2ce80fE45B32092e0d878ad87F0156a9","0x793979789Ec179183E396e76c1e241bE0c9eE899","0x1358eaCFE3a7F4FEB06c0Ae722072F134bcE7caf","0x45878fdF56B372D944c6Fc1865B7a65462f6D1b0","0xA3fC931613a4E2440a199d47B0076e8b85F33099","0x91D456f83f4a117B07866fdEdC29306f7E974e15"]
      values.getThreshold:
-        4
      values.$members:
+        ["0x0449689f2ce80fE45B32092e0d878ad87F0156a9","0x793979789Ec179183E396e76c1e241bE0c9eE899","0x1358eaCFE3a7F4FEB06c0Ae722072F134bcE7caf","0x45878fdF56B372D944c6Fc1865B7a65462f6D1b0","0xA3fC931613a4E2440a199d47B0076e8b85F33099","0x91D456f83f4a117B07866fdEdC29306f7E974e15"]
      values.$threshold:
+        4
      values.multisigThreshold:
+        "4 of 6 (67%)"
    }
```

```diff
    contract SuccinctMultisig (0xdC00f2469023a7b0b1D5b6abE2F736F90955e7F3) {
    +++ description: None
      values.$multisigThreshold:
-        "3 of 4 (75%)"
      values.getOwners:
-        ["0x72Ff26D9517324eEFA89A48B75c5df41132c4f54","0xBaB2c2aF5b91695e65955DA60d63aD1b2aE81126","0xa4ABEE02d42451Ba8c78b66361F53cb0C3dB3B65","0x19abbcEC005D4D83692f7A180125bF0FBd24253D"]
      values.getThreshold:
-        3
      values.$members:
+        ["0x72Ff26D9517324eEFA89A48B75c5df41132c4f54","0xBaB2c2aF5b91695e65955DA60d63aD1b2aE81126","0xa4ABEE02d42451Ba8c78b66361F53cb0C3dB3B65","0x19abbcEC005D4D83692f7A180125bF0FBd24253D"]
      values.$threshold:
+        3
      values.multisigThreshold:
+        "3 of 4 (75%)"
    }
```

Generated with discovered.json: 0x4c7a20502a211b09faf6b16b6ceec3ab43466504

# Diff at Fri, 09 Aug 2024 10:13:30 GMT:

- chain: arbitrum
- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@1f0da1d0aab7bc6b3b5e54e7e93480bd98e57035 block: 208089280
- current block number: 208089280

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 208089280 (main branch discovery), not current.

```diff
    contract BlobstreamXMultisig (0x738a9b55304f9fcF776B3BA285e50c0f9eF77997) {
    +++ description: None
      values.$multisigThreshold:
-        "4 of 6 (67%)"
      values.getOwners:
-        ["0x0449689f2ce80fE45B32092e0d878ad87F0156a9","0x91D456f83f4a117B07866fdEdC29306f7E974e15","0x793979789Ec179183E396e76c1e241bE0c9eE899","0xA3fC931613a4E2440a199d47B0076e8b85F33099","0x45878fdF56B372D944c6Fc1865B7a65462f6D1b0","0x1358eaCFE3a7F4FEB06c0Ae722072F134bcE7caf"]
      values.getThreshold:
-        4
      values.$members:
+        ["0x0449689f2ce80fE45B32092e0d878ad87F0156a9","0x91D456f83f4a117B07866fdEdC29306f7E974e15","0x793979789Ec179183E396e76c1e241bE0c9eE899","0xA3fC931613a4E2440a199d47B0076e8b85F33099","0x45878fdF56B372D944c6Fc1865B7a65462f6D1b0","0x1358eaCFE3a7F4FEB06c0Ae722072F134bcE7caf"]
      values.$threshold:
+        4
      values.multisigThreshold:
+        "4 of 6 (67%)"
    }
```

```diff
    contract SuccinctMultisig (0xdC00f2469023a7b0b1D5b6abE2F736F90955e7F3) {
    +++ description: None
      values.$multisigThreshold:
-        "3 of 4 (75%)"
      values.getOwners:
-        ["0x72Ff26D9517324eEFA89A48B75c5df41132c4f54","0xBaB2c2aF5b91695e65955DA60d63aD1b2aE81126","0xa4ABEE02d42451Ba8c78b66361F53cb0C3dB3B65","0x19abbcEC005D4D83692f7A180125bF0FBd24253D"]
      values.getThreshold:
-        3
      values.$members:
+        ["0x72Ff26D9517324eEFA89A48B75c5df41132c4f54","0xBaB2c2aF5b91695e65955DA60d63aD1b2aE81126","0xa4ABEE02d42451Ba8c78b66361F53cb0C3dB3B65","0x19abbcEC005D4D83692f7A180125bF0FBd24253D"]
      values.$threshold:
+        3
      values.multisigThreshold:
+        "3 of 4 (75%)"
    }
```

Generated with discovered.json: 0xfab91205fdc6c53d8cd592cc86b3839e173721ea

# Diff at Fri, 09 Aug 2024 10:08:53 GMT:

- chain: ethereum
- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@1f0da1d0aab7bc6b3b5e54e7e93480bd98e57035 block: 20218838
- current block number: 20218838

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20218838 (main branch discovery), not current.

```diff
    contract BlobstreamXMultisig (0x8bF34D8df1eF0A8A7f27fC587202848E528018E6) {
    +++ description: None
      values.$multisigThreshold:
-        "4 of 6 (67%)"
      values.getOwners:
-        ["0x0449689f2ce80fE45B32092e0d878ad87F0156a9","0x793979789Ec179183E396e76c1e241bE0c9eE899","0x1358eaCFE3a7F4FEB06c0Ae722072F134bcE7caf","0x45878fdF56B372D944c6Fc1865B7a65462f6D1b0","0xA3fC931613a4E2440a199d47B0076e8b85F33099","0x91D456f83f4a117B07866fdEdC29306f7E974e15"]
      values.getThreshold:
-        4
      values.$members:
+        ["0x0449689f2ce80fE45B32092e0d878ad87F0156a9","0x793979789Ec179183E396e76c1e241bE0c9eE899","0x1358eaCFE3a7F4FEB06c0Ae722072F134bcE7caf","0x45878fdF56B372D944c6Fc1865B7a65462f6D1b0","0xA3fC931613a4E2440a199d47B0076e8b85F33099","0x91D456f83f4a117B07866fdEdC29306f7E974e15"]
      values.$threshold:
+        4
      values.multisigThreshold:
+        "4 of 6 (67%)"
    }
```

```diff
    contract SuccinctMultisig (0xd1999B562e74d9fbf57b4479b3fe8748BDF4e4A0) {
    +++ description: None
      values.$multisigThreshold:
-        "3 of 4 (75%)"
      values.getOwners:
-        ["0x72Ff26D9517324eEFA89A48B75c5df41132c4f54","0xBaB2c2aF5b91695e65955DA60d63aD1b2aE81126","0xa4ABEE02d42451Ba8c78b66361F53cb0C3dB3B65","0x19abbcEC005D4D83692f7A180125bF0FBd24253D"]
      values.getThreshold:
-        3
      values.$members:
+        ["0x72Ff26D9517324eEFA89A48B75c5df41132c4f54","0xBaB2c2aF5b91695e65955DA60d63aD1b2aE81126","0xa4ABEE02d42451Ba8c78b66361F53cb0C3dB3B65","0x19abbcEC005D4D83692f7A180125bF0FBd24253D"]
      values.$threshold:
+        3
      values.multisigThreshold:
+        "3 of 4 (75%)"
    }
```

Generated with discovered.json: 0x9d5433ede5f09e4abfa6b2718f3d959c01c645fa

# Diff at Tue, 30 Jul 2024 11:17:34 GMT:

- chain: base
- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@b2b6471ff62871f4956541f42ec025c356c08f7e block: 14061228
- current block number: 14061228

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 14061228 (main branch discovery), not current.

```diff
    contract SuccinctGateway (0x6c7a05e0AE641c6559fD76ac56641778B6eCd776) {
    +++ description: None
      fieldMeta:
+        {"headerRangeProvers":{"severity":"LOW","description":"List of prover (relayer) addresses that are allowed to `fulfillCallback()`/`fulfillCall()` in the Succinctgateway for the headerRange function ID of BlobstreamX."},"nextHeaderProvers":{"severity":"LOW","description":"List of prover (relayer) addresses that are allowed to `fulfillCallback()`/`fulfillCall()` in the Succinctgateway for the nextHeader function ID of BlobstreamX."}}
    }
```

Generated with discovered.json: 0x4fca5e622ef070699be15d6c5c980cac2309d296

# Diff at Tue, 30 Jul 2024 11:17:05 GMT:

- chain: arbitrum
- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@b2b6471ff62871f4956541f42ec025c356c08f7e block: 208089280
- current block number: 208089280

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 208089280 (main branch discovery), not current.

```diff
    contract SuccinctGateway (0x6c7a05e0AE641c6559fD76ac56641778B6eCd776) {
    +++ description: None
      fieldMeta:
+        {"headerRangeProvers":{"severity":"LOW","description":"List of prover (relayer) addresses that are allowed to `fulfillCallback()`/`fulfillCall()` in the Succinctgateway for the headerRange function ID of BlobstreamX."},"nextHeaderProvers":{"severity":"LOW","description":"List of prover (relayer) addresses that are allowed to `fulfillCallback()`/`fulfillCall()` in the Succinctgateway for the nextHeader function ID of BlobstreamX."}}
    }
```

Generated with discovered.json: 0xcb79dcf1d50142e427f3184a7dc418e412ac8a5f

# Diff at Tue, 30 Jul 2024 11:11:10 GMT:

- chain: ethereum
- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@b2b6471ff62871f4956541f42ec025c356c08f7e block: 20218838
- current block number: 20218838

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20218838 (main branch discovery), not current.

```diff
    contract SuccinctGateway (0x6c7a05e0AE641c6559fD76ac56641778B6eCd776) {
    +++ description: None
      fieldMeta:
+        {"headerRangeProvers":{"severity":"LOW","description":"List of prover (relayer) addresses that are allowed to `fulfillCallback()`/`fulfillCall()` in the Succinctgateway for the headerRange function ID of BlobstreamX."},"nextHeaderProvers":{"severity":"LOW","description":"List of prover (relayer) addresses that are allowed to `fulfillCallback()`/`fulfillCall()` in the Succinctgateway for the nextHeader function ID of BlobstreamX."}}
    }
```

Generated with discovered.json: 0x48c882d83a8c23c8b1c61b255f6b2f15dda4addc

# Diff at Thu, 13 Jun 2024 21:20:54 GMT:

- chain: ethereum
- author: vincfurc (<10850139+vincfurc@users.noreply.github.com>)
- current block number: 20085541

## Description

Initial mainnet BlobstreamX discovery.

## Initial discovery

```diff
+   Status: CREATED
    contract FunctionVerifier (0x037E57EF3a130CD23988a4Ed530d79d6f97a0f06)
    +++ description: None
```

```diff
+   Status: CREATED
    contract SuccinctFeeVault (0x296666e937b270193B960a7cEC526B351F353166)
    +++ description: None
```

```diff
+   Status: CREATED
    contract SuccinctGateway (0x6c7a05e0AE641c6559fD76ac56641778B6eCd776)
    +++ description: None
```

```diff
+   Status: CREATED
    contract BlobstreamX (0x7Cf3876F681Dbb6EdA8f6FfC45D66B996Df08fAe)
    +++ description: None
```

```diff
+   Status: CREATED
    contract BlobstreamXMultisig (0x8bF34D8df1eF0A8A7f27fC587202848E528018E6)
    +++ description: None
```

```diff
+   Status: CREATED
    contract SuccinctMultisig (0xd1999B562e74d9fbf57b4479b3fe8748BDF4e4A0)
    +++ description: None
```

```diff
+   Status: CREATED
    contract  (0xF33a22dFf8017813b95E5a05c9a97BaFE693001E)
    +++ description: None
```

Generated with discovered.json: 0x7285e99c4ab1b39cc0094977b44e197d8e3bfdec

# Diff at Sun, 05 May 2024 12:28:41 GMT:

- chain: arbitrum
- author: vincfurc (<10850139+vincfurc@users.noreply.github.com>)
- comparing to: main@306760396dc5133ea2ec932bf81b9f36e88dbdd3 block: 197829534
- current block number: 208089280

## Description

A prover / relayer is added to the Succictgateway. It is whitelisted for both functionIds (headerRange and nextHeader) of BlobstreamX.
Same change as on Base.

## Watched changes

```diff
    contract SuccinctGateway (0x6c7a05e0AE641c6559fD76ac56641778B6eCd776) {
    +++ description: None
+++ description: List of prover (relayer) addresses that are allowed to `fulfillCallback()`/`fulfillCall()` in the Succinctgateway for the headerRange function ID of BlobstreamX.
+++ type: PERMISSION
+++ severity: LOW
      values.headerRangeProvers.1:
+        "0x3243552F3BcbcE720Db6f5ad0C1B7cd15458392D"
+++ description: List of prover (relayer) addresses that are allowed to `fulfillCallback()`/`fulfillCall()` in the Succinctgateway for the nextHeader function ID of BlobstreamX.
+++ type: PERMISSION
+++ severity: LOW
      values.nextHeaderProvers.1:
+        "0x3243552F3BcbcE720Db6f5ad0C1B7cd15458392D"
    }
```

```diff
    contract BlobstreamXMultisig (0x738a9b55304f9fcF776B3BA285e50c0f9eF77997) {
    +++ description: Admin of the BlobstreamX contract. VerifierOwner of the BlobstreamX functionIDs in the SuccinctGateway.
      values.nonce:
-        6
+        7
    }
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 197829534 (main branch discovery), not current.

```diff
    contract SuccinctGateway (0x6c7a05e0AE641c6559fD76ac56641778B6eCd776) {
    +++ description: None
+++ description: List of prover (relayer) addresses that are allowed to `fulfillCallback()`/`fulfillCall()` in the Succinctgateway for the headerRange function ID of BlobstreamX.
+++ type: PERMISSION
+++ severity: LOW
      values.headerRangeProvers:
+        ["0x44eB418A966ff47f5AF6f48AEa6Afde0bf193a8d"]
      values.headerRangeVerifierOwner:
+        "0x738a9b55304f9fcF776B3BA285e50c0f9eF77997"
+++ description: List of prover (relayer) addresses that are allowed to `fulfillCallback()`/`fulfillCall()` in the Succinctgateway for the nextHeader function ID of BlobstreamX.
+++ type: PERMISSION
+++ severity: LOW
      values.nextHeaderProvers:
+        ["0x44eB418A966ff47f5AF6f48AEa6Afde0bf193a8d"]
      values.nextHeaderVerifierOwner:
+        "0x738a9b55304f9fcF776B3BA285e50c0f9eF77997"
    }
```

```diff
    contract GnosisSafeL2 (0x738a9b55304f9fcF776B3BA285e50c0f9eF77997) {
    +++ description: None
      name:
-        "GnosisSafeL2"
+        "BlobstreamXMultisig"
    }
```

```diff
    contract GnosisSafeL2 (0xdC00f2469023a7b0b1D5b6abE2F736F90955e7F3) {
    +++ description: None
      name:
-        "GnosisSafeL2"
+        "SuccinctMultisig"
    }
```

Generated with discovered.json: 0x4b9f511ca9887f4a75d7e433e5398f5d19058446

# Diff at Sun, 05 May 2024 12:23:55 GMT:

- chain: base
- author: vincfurc (<10850139+vincfurc@users.noreply.github.com>)
- comparing to: main@306760396dc5133ea2ec932bf81b9f36e88dbdd3 block: 12726128
- current block number: 14061228

## Description

A prover / relayer is added to the Succictgateway. It is whitelisted for both functionIds (headerRange and nextHeader) of BlobstreamX.
Same change as on Arbitrum.

## Watched changes

```diff
    contract BlobstreamXMultisig (0x6ABa5D2084362038C9640a8851ff3b8BCbA81Ca6) {
    +++ description: Admin of the BlobstreamX contract. VerifierOwner of the BlobstreamX functionIDs in the SuccinctGateway.
      values.nonce:
-        6
+        7
    }
```

```diff
    contract SuccinctGateway (0x6c7a05e0AE641c6559fD76ac56641778B6eCd776) {
    +++ description: None
+++ description: List of prover (relayer) addresses that are allowed to `fulfillCallback()`/`fulfillCall()` in the Succinctgateway for the headerRange function ID of BlobstreamX.
+++ type: PERMISSION
+++ severity: LOW
      values.headerRangeProvers.1:
+        "0x3243552F3BcbcE720Db6f5ad0C1B7cd15458392D"
+++ description: List of prover (relayer) addresses that are allowed to `fulfillCallback()`/`fulfillCall()` in the Succinctgateway for the nextHeader function ID of BlobstreamX.
+++ type: PERMISSION
+++ severity: LOW
      values.nextHeaderProvers.1:
+        "0x3243552F3BcbcE720Db6f5ad0C1B7cd15458392D"
    }
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 12726128 (main branch discovery), not current.

```diff
-   Status: DELETED
    contract FunctionVerifier (0x294A466b50672029D0a8d7ad7E00AEfDeaE9f529)
    +++ description: None
```

```diff
    contract GnosisSafeL2 (0x6ABa5D2084362038C9640a8851ff3b8BCbA81Ca6) {
    +++ description: None
      name:
-        "GnosisSafeL2"
+        "BlobstreamXMultisig"
    }
```

```diff
    contract SuccinctGateway (0x6c7a05e0AE641c6559fD76ac56641778B6eCd776) {
    +++ description: None
      values.headerRangeVerifier:
-        "0x294A466b50672029D0a8d7ad7E00AEfDeaE9f529"
+        "0xF2415C44F47983F7dD22003B46A034B1F1d04e44"
      values.nextHeaderVerifier:
-        "0xeEadfac6E689443d237B10F78e8424579e2e0177"
+        "0xe859F565f4AdF7AAc3a94a6C6d89093d754Ec4f6"
+++ description: List of prover (relayer) addresses that are allowed to `fulfillCallback()`/`fulfillCall()` in the Succinctgateway for the headerRange function ID of BlobstreamX.
+++ type: PERMISSION
+++ severity: LOW
      values.headerRangeProvers:
+        ["0x44eB418A966ff47f5AF6f48AEa6Afde0bf193a8d"]
      values.headerRangeVerifierOwner:
+        "0x6ABa5D2084362038C9640a8851ff3b8BCbA81Ca6"
+++ description: List of prover (relayer) addresses that are allowed to `fulfillCallback()`/`fulfillCall()` in the Succinctgateway for the nextHeader function ID of BlobstreamX.
+++ type: PERMISSION
+++ severity: LOW
      values.nextHeaderProvers:
+        ["0x44eB418A966ff47f5AF6f48AEa6Afde0bf193a8d"]
      values.nextHeaderVerifierOwner:
+        "0x6ABa5D2084362038C9640a8851ff3b8BCbA81Ca6"
    }
```

```diff
    contract GnosisSafeL2 (0xdC00f2469023a7b0b1D5b6abE2F736F90955e7F3) {
    +++ description: None
      name:
-        "GnosisSafeL2"
+        "SuccinctMultisig"
    }
```

```diff
-   Status: DELETED
    contract FunctionVerifier (0xeEadfac6E689443d237B10F78e8424579e2e0177)
    +++ description: None
```

```diff
+   Status: CREATED
    contract FunctionVerifier (0xe859F565f4AdF7AAc3a94a6C6d89093d754Ec4f6)
    +++ description: None
```

```diff
+   Status: CREATED
    contract FunctionVerifier (0xF2415C44F47983F7dD22003B46A034B1F1d04e44)
    +++ description: None
```

Generated with discovered.json: 0xa83178f53f6a63952fe8b5488d76a52bd121cead

# Diff at Fri, 05 Apr 2024 11:41:00 GMT:

- chain: arbitrum
- author: sekuba (<sekuba@users.noreply.github.com>)
- comparing to: main@6e27442909c4cbe26f03c6413f64274ff68aa0d7 block: 197243619
- current block number: 197829534

## Description

No changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 197243619 (main branch discovery), not current.

```diff
    contract GnosisSafeL2 (0x738a9b55304f9fcF776B3BA285e50c0f9eF77997) {
    +++ description: None
      upgradeability.threshold:
+        "4 of 6 (67%)"
    }
```

```diff
    contract GnosisSafeL2 (0xdC00f2469023a7b0b1D5b6abE2F736F90955e7F3) {
    +++ description: None
      upgradeability.threshold:
+        "3 of 4 (75%)"
    }
```

Generated with discovered.json: 0xf4ce8849740c932ad0e0f9eb9bc6e239c3ae5dd0

# Diff at Thu, 04 Apr 2024 14:40:31 GMT:

- chain: base
- author: sekuba (<sekuba@users.noreply.github.com>)
- comparing to: main@0a9c7969ad2049584096c517179c4a4990f064bd block: 12672692
- current block number: 12726128

## Description

Threshold config related change. Onchain unchanged.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 12672692 (main branch discovery), not current.

```diff
    contract GnosisSafeL2 (0x6ABa5D2084362038C9640a8851ff3b8BCbA81Ca6) {
    +++ description: None
      upgradeability.threshold:
+        "4 of 6 (67%)"
    }
```

```diff
    contract GnosisSafeL2 (0xdC00f2469023a7b0b1D5b6abE2F736F90955e7F3) {
    +++ description: None
      upgradeability.threshold:
+        "3 of 4 (75%)"
    }
```

Generated with discovered.json: 0x2990628bad137a08bd1e6cf7186a0989a1dc8319

# Diff at Wed, 03 Apr 2024 18:46:58 GMT:

- chain: arbitrum
- author: vincfurc (<10850139+vincfurc@users.noreply.github.com>)
- current block number: 197243619

## Description

Provide description of changes. This section will be preserved.

## Initial discovery

```diff
+   Status: CREATED
    contract SuccinctFeeVault (0x296666e937b270193B960a7cEC526B351F353166)
    +++ description: None
```

```diff
+   Status: CREATED
    contract FunctionVerifier (0x4d0C32ddA9De7CD89e198cFe5E01470A49b8acD3)
    +++ description: None
```

```diff
+   Status: CREATED
    contract SuccinctGateway (0x6c7a05e0AE641c6559fD76ac56641778B6eCd776)
    +++ description: None
```

```diff
+   Status: CREATED
    contract GnosisSafeL2 (0x738a9b55304f9fcF776B3BA285e50c0f9eF77997)
    +++ description: None
```

```diff
+   Status: CREATED
    contract BlobstreamX (0xA83ca7775Bc2889825BcDeDfFa5b758cf69e8794)
    +++ description: None
```

```diff
+   Status: CREATED
    contract GnosisSafeL2 (0xdC00f2469023a7b0b1D5b6abE2F736F90955e7F3)
    +++ description: None
```

```diff
+   Status: CREATED
    contract FunctionVerifier (0xfEA1EFaE3cDe8C524168726a7fc46BF2134bb72C)
    +++ description: None
```

Generated with discovered.json: 0x2aff9bf22d03c54504e3e165ecb551663cc6317b

# Diff at Wed, 03 Apr 2024 08:59:00 GMT:

- chain: base
- author: vincfurc (<10850139+vincfurc@users.noreply.github.com>)
- current block number: 12672692

## Description

Initial discovery

## Initial discovery

```diff
+   Status: CREATED
    contract FunctionVerifier (0x294A466b50672029D0a8d7ad7E00AEfDeaE9f529)
    +++ description: None
```

```diff
+   Status: CREATED
    contract SuccinctFeeVault (0x296666e937b270193B960a7cEC526B351F353166)
    +++ description: None
```

```diff
+   Status: CREATED
    contract GnosisSafeL2 (0x6ABa5D2084362038C9640a8851ff3b8BCbA81Ca6)
    +++ description: None
```

```diff
+   Status: CREATED
    contract SuccinctGateway (0x6c7a05e0AE641c6559fD76ac56641778B6eCd776)
    +++ description: None
```

```diff
+   Status: CREATED
    contract BlobstreamX (0xA83ca7775Bc2889825BcDeDfFa5b758cf69e8794)
    +++ description: None
```

```diff
+   Status: CREATED
    contract GnosisSafeL2 (0xdC00f2469023a7b0b1D5b6abE2F736F90955e7F3)
    +++ description: None
```

```diff
+   Status: CREATED
    contract FunctionVerifier (0xeEadfac6E689443d237B10F78e8424579e2e0177)
    +++ description: None
```

