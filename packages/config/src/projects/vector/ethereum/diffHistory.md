Generated with discovered.json: 0x97495865273d3f7705063ebb73b8dfe772692ead

# Diff at Mon, 14 Jul 2025 12:46:41 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@9f4300dad2f3d080cd56fa311d4a848556c74e72 block: 22882091
- current block number: 22882091

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22882091 (main branch discovery), not current.

```diff
    contract Vector (0x02993cdC11213985b9B13224f3aF289F03bf298d) {
    +++ description: The Vector bridge contract that accepts and stores Avail data availability commitments on Ethereum.
      address:
-        "0x02993cdC11213985b9B13224f3aF289F03bf298d"
+        "eth:0x02993cdC11213985b9B13224f3aF289F03bf298d"
      values.$admin:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      values.$implementation:
-        "0xc6217f1549Cab6f22ac4AC56d42e6C248731a33D"
+        "eth:0xc6217f1549Cab6f22ac4AC56d42e6C248731a33D"
      values.$pastUpgrades.0.2.0:
-        "0x2434564f3524b44258B11643729343Ef57D60989"
+        "eth:0x2434564f3524b44258B11643729343Ef57D60989"
      values.$pastUpgrades.1.2.0:
-        "0xc6217f1549Cab6f22ac4AC56d42e6C248731a33D"
+        "eth:0xc6217f1549Cab6f22ac4AC56d42e6C248731a33D"
      values.accessControl.DEFAULT_ADMIN_ROLE.members.0:
-        "0xDEd0000E32f8F40414d3ab3a830f735a3553E18e"
+        "eth:0xDEd0000E32f8F40414d3ab3a830f735a3553E18e"
      values.accessControl.DEFAULT_ADMIN_ROLE.members.1:
-        "0x7F2f87B0Efc66Fea0b7c30C61654E53C37993666"
+        "eth:0x7F2f87B0Efc66Fea0b7c30C61654E53C37993666"
      values.accessControl.TIMELOCK_ROLE.members.0:
-        "0x7F2f87B0Efc66Fea0b7c30C61654E53C37993666"
+        "eth:0x7F2f87B0Efc66Fea0b7c30C61654E53C37993666"
      values.accessControl.GUARDIAN_ROLE.members.0:
-        "0x7F2f87B0Efc66Fea0b7c30C61654E53C37993666"
+        "eth:0x7F2f87B0Efc66Fea0b7c30C61654E53C37993666"
      values.gateway_deprecated:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      values.guardians.0:
-        "0x7F2f87B0Efc66Fea0b7c30C61654E53C37993666"
+        "eth:0x7F2f87B0Efc66Fea0b7c30C61654E53C37993666"
      values.relayers.0:
-        "0xC2ADCfccEE33A417064d1A45D3b202DE6d9fA474"
+        "eth:0xC2ADCfccEE33A417064d1A45D3b202DE6d9fA474"
      values.timelocks.0:
-        "0x7F2f87B0Efc66Fea0b7c30C61654E53C37993666"
+        "eth:0x7F2f87B0Efc66Fea0b7c30C61654E53C37993666"
      values.verifier:
-        "0x3B6041173B80E77f038f3F2C0f9744f04837185e"
+        "eth:0x3B6041173B80E77f038f3F2C0f9744f04837185e"
      implementationNames.0x02993cdC11213985b9B13224f3aF289F03bf298d:
-        "ERC1967Proxy"
      implementationNames.0xc6217f1549Cab6f22ac4AC56d42e6C248731a33D:
-        "SP1Vector"
      implementationNames.eth:0x02993cdC11213985b9B13224f3aF289F03bf298d:
+        "ERC1967Proxy"
      implementationNames.eth:0xc6217f1549Cab6f22ac4AC56d42e6C248731a33D:
+        "SP1Vector"
    }
```

```diff
    contract AvailBridgeV1 (0x054fd961708D8E2B9c10a63F6157c74458889F0a) {
    +++ description: Bridge contract that verifies merkle proofs of inclusion in the proven data of the eth:0x02993cdC11213985b9B13224f3aF289F03bf298d DA- and arbitrary message bridge. Also used for token- and arbitrary message transfers between Avail and Ethereum.
      address:
-        "0x054fd961708D8E2B9c10a63F6157c74458889F0a"
+        "eth:0x054fd961708D8E2B9c10a63F6157c74458889F0a"
      description:
-        "Bridge contract that verifies merkle proofs of inclusion in the proven data of the 0x02993cdC11213985b9B13224f3aF289F03bf298d DA- and arbitrary message bridge. Also used for token- and arbitrary message transfers between Avail and Ethereum."
+        "Bridge contract that verifies merkle proofs of inclusion in the proven data of the eth:0x02993cdC11213985b9B13224f3aF289F03bf298d DA- and arbitrary message bridge. Also used for token- and arbitrary message transfers between Avail and Ethereum."
      values.$admin:
-        "0x36194271a00dBBBae314E83dA56d0FF75fDa367B"
+        "eth:0x36194271a00dBBBae314E83dA56d0FF75fDa367B"
      values.$implementation:
-        "0x737539737b44493F65c17eAfE165197b6410d254"
+        "eth:0x737539737b44493F65c17eAfE165197b6410d254"
      values.$pastUpgrades.0.2.0:
-        "0x737539737b44493F65c17eAfE165197b6410d254"
+        "eth:0x737539737b44493F65c17eAfE165197b6410d254"
      values.accessControl.DEFAULT_ADMIN_ROLE.members.0:
-        "0x45828180bbE489350D621d002968A0585406d487"
+        "eth:0x45828180bbE489350D621d002968A0585406d487"
      values.accessControl.PAUSER_ROLE.members.0:
-        "0x1a5BA9447D02Ddaf7bcB5594Fc27dE2Daf588930"
+        "eth:0x1a5BA9447D02Ddaf7bcB5594Fc27dE2Daf588930"
      values.avail:
-        "0xEeB4d8400AEefafC1B2953e0094134A887C76Bd8"
+        "eth:0xEeB4d8400AEefafC1B2953e0094134A887C76Bd8"
      values.defaultAdmin:
-        "0x45828180bbE489350D621d002968A0585406d487"
+        "eth:0x45828180bbE489350D621d002968A0585406d487"
      values.defaultAdminAC.0:
-        "0x45828180bbE489350D621d002968A0585406d487"
+        "eth:0x45828180bbE489350D621d002968A0585406d487"
      values.feeRecipient:
-        "0x7F2f87B0Efc66Fea0b7c30C61654E53C37993666"
+        "eth:0x7F2f87B0Efc66Fea0b7c30C61654E53C37993666"
      values.owner:
-        "0x45828180bbE489350D621d002968A0585406d487"
+        "eth:0x45828180bbE489350D621d002968A0585406d487"
      values.pauserAC.0:
-        "0x1a5BA9447D02Ddaf7bcB5594Fc27dE2Daf588930"
+        "eth:0x1a5BA9447D02Ddaf7bcB5594Fc27dE2Daf588930"
      values.pendingDefaultAdmin.newAdmin:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      values.vectorx:
-        "0x02993cdC11213985b9B13224f3aF289F03bf298d"
+        "eth:0x02993cdC11213985b9B13224f3aF289F03bf298d"
      implementationNames.0x054fd961708D8E2B9c10a63F6157c74458889F0a:
-        "TransparentUpgradeableProxy"
      implementationNames.0x737539737b44493F65c17eAfE165197b6410d254:
-        "AvailBridgeV1"
      implementationNames.eth:0x054fd961708D8E2B9c10a63F6157c74458889F0a:
+        "TransparentUpgradeableProxy"
      implementationNames.eth:0x737539737b44493F65c17eAfE165197b6410d254:
+        "AvailBridgeV1"
    }
```

```diff
    contract Avail Multisig 2 (0x1a5BA9447D02Ddaf7bcB5594Fc27dE2Daf588930) {
    +++ description: None
      address:
-        "0x1a5BA9447D02Ddaf7bcB5594Fc27dE2Daf588930"
+        "eth:0x1a5BA9447D02Ddaf7bcB5594Fc27dE2Daf588930"
      values.$implementation:
-        "0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552"
+        "eth:0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552"
      values.$members.0:
-        "0xE458b870F2F59a49915591282f1Bb688901767AD"
+        "eth:0xE458b870F2F59a49915591282f1Bb688901767AD"
      values.$members.1:
-        "0x340e77D5e114A9D4891d3a1EbC7419CC85Ca8E4A"
+        "eth:0x340e77D5e114A9D4891d3a1EbC7419CC85Ca8E4A"
      values.$members.2:
-        "0xAD379D3275a18bd4BB741C3b291a3778D51c3304"
+        "eth:0xAD379D3275a18bd4BB741C3b291a3778D51c3304"
      values.$members.3:
-        "0x72Ff26D9517324eEFA89A48B75c5df41132c4f54"
+        "eth:0x72Ff26D9517324eEFA89A48B75c5df41132c4f54"
      values.$members.4:
-        "0x1fbABAbDcFE0b40a9B5D2aDB054fB74F8fE985f5"
+        "eth:0x1fbABAbDcFE0b40a9B5D2aDB054fB74F8fE985f5"
      implementationNames.0x1a5BA9447D02Ddaf7bcB5594Fc27dE2Daf588930:
-        "GnosisSafeProxy"
      implementationNames.0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552:
-        "GnosisSafe"
      implementationNames.eth:0x1a5BA9447D02Ddaf7bcB5594Fc27dE2Daf588930:
+        "GnosisSafeProxy"
      implementationNames.eth:0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552:
+        "GnosisSafe"
    }
```

```diff
    EOA  (0x1fbABAbDcFE0b40a9B5D2aDB054fB74F8fE985f5) {
    +++ description: None
      address:
-        "0x1fbABAbDcFE0b40a9B5D2aDB054fB74F8fE985f5"
+        "eth:0x1fbABAbDcFE0b40a9B5D2aDB054fB74F8fE985f5"
    }
```

```diff
    EOA  (0x340e77D5e114A9D4891d3a1EbC7419CC85Ca8E4A) {
    +++ description: None
      address:
-        "0x340e77D5e114A9D4891d3a1EbC7419CC85Ca8E4A"
+        "eth:0x340e77D5e114A9D4891d3a1EbC7419CC85Ca8E4A"
    }
```

```diff
    contract ProxyAdmin (0x36194271a00dBBBae314E83dA56d0FF75fDa367B) {
    +++ description: None
      address:
-        "0x36194271a00dBBBae314E83dA56d0FF75fDa367B"
+        "eth:0x36194271a00dBBBae314E83dA56d0FF75fDa367B"
      values.owner:
-        "0x45828180bbE489350D621d002968A0585406d487"
+        "eth:0x45828180bbE489350D621d002968A0585406d487"
      implementationNames.0x36194271a00dBBBae314E83dA56d0FF75fDa367B:
-        "ProxyAdmin"
      implementationNames.eth:0x36194271a00dBBBae314E83dA56d0FF75fDa367B:
+        "ProxyAdmin"
    }
```

```diff
    contract TimelockController (0x45828180bbE489350D621d002968A0585406d487) {
    +++ description: A timelock with access control. The current minimum delay is 1d.
      address:
-        "0x45828180bbE489350D621d002968A0585406d487"
+        "eth:0x45828180bbE489350D621d002968A0585406d487"
      values.accessControl.DEFAULT_ADMIN_ROLE.members.0:
-        "0x45828180bbE489350D621d002968A0585406d487"
+        "eth:0x45828180bbE489350D621d002968A0585406d487"
      values.accessControl.DEFAULT_ADMIN_ROLE.members.1:
-        "0x7F2f87B0Efc66Fea0b7c30C61654E53C37993666"
+        "eth:0x7F2f87B0Efc66Fea0b7c30C61654E53C37993666"
      values.accessControl.PROPOSER_ROLE.members.0:
-        "0x7F2f87B0Efc66Fea0b7c30C61654E53C37993666"
+        "eth:0x7F2f87B0Efc66Fea0b7c30C61654E53C37993666"
      values.accessControl.CANCELLER_ROLE.members.0:
-        "0x7F2f87B0Efc66Fea0b7c30C61654E53C37993666"
+        "eth:0x7F2f87B0Efc66Fea0b7c30C61654E53C37993666"
      values.accessControl.EXECUTOR_ROLE.members.0:
-        "0x7F2f87B0Efc66Fea0b7c30C61654E53C37993666"
+        "eth:0x7F2f87B0Efc66Fea0b7c30C61654E53C37993666"
      values.Canceller.0:
-        "0x7F2f87B0Efc66Fea0b7c30C61654E53C37993666"
+        "eth:0x7F2f87B0Efc66Fea0b7c30C61654E53C37993666"
      values.defaultAdminAC.0:
-        "0x45828180bbE489350D621d002968A0585406d487"
+        "eth:0x45828180bbE489350D621d002968A0585406d487"
      values.defaultAdminAC.1:
-        "0x7F2f87B0Efc66Fea0b7c30C61654E53C37993666"
+        "eth:0x7F2f87B0Efc66Fea0b7c30C61654E53C37993666"
      values.Executor.0:
-        "0x7F2f87B0Efc66Fea0b7c30C61654E53C37993666"
+        "eth:0x7F2f87B0Efc66Fea0b7c30C61654E53C37993666"
      values.Proposer.0:
-        "0x7F2f87B0Efc66Fea0b7c30C61654E53C37993666"
+        "eth:0x7F2f87B0Efc66Fea0b7c30C61654E53C37993666"
      implementationNames.0x45828180bbE489350D621d002968A0585406d487:
-        "TimelockController"
      implementationNames.eth:0x45828180bbE489350D621d002968A0585406d487:
+        "TimelockController"
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
    contract Avail Multisig 1 (0x7F2f87B0Efc66Fea0b7c30C61654E53C37993666) {
    +++ description: None
      address:
-        "0x7F2f87B0Efc66Fea0b7c30C61654E53C37993666"
+        "eth:0x7F2f87B0Efc66Fea0b7c30C61654E53C37993666"
      values.$implementation:
-        "0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552"
+        "eth:0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552"
      values.$members.0:
-        "0xE458b870F2F59a49915591282f1Bb688901767AD"
+        "eth:0xE458b870F2F59a49915591282f1Bb688901767AD"
      values.$members.1:
-        "0x340e77D5e114A9D4891d3a1EbC7419CC85Ca8E4A"
+        "eth:0x340e77D5e114A9D4891d3a1EbC7419CC85Ca8E4A"
      values.$members.2:
-        "0xAD379D3275a18bd4BB741C3b291a3778D51c3304"
+        "eth:0xAD379D3275a18bd4BB741C3b291a3778D51c3304"
      values.$members.3:
-        "0x72Ff26D9517324eEFA89A48B75c5df41132c4f54"
+        "eth:0x72Ff26D9517324eEFA89A48B75c5df41132c4f54"
      values.$members.4:
-        "0x1fbABAbDcFE0b40a9B5D2aDB054fB74F8fE985f5"
+        "eth:0x1fbABAbDcFE0b40a9B5D2aDB054fB74F8fE985f5"
      values.$members.5:
-        "0xBe1D614F13662Aff0a2Ec1e76f9c82D332Ae78A2"
+        "eth:0xBe1D614F13662Aff0a2Ec1e76f9c82D332Ae78A2"
      values.$members.6:
-        "0x4983A5ebE79c0570aa368cE84f281A8aAc50cE4d"
+        "eth:0x4983A5ebE79c0570aa368cE84f281A8aAc50cE4d"
      implementationNames.0x7F2f87B0Efc66Fea0b7c30C61654E53C37993666:
-        "GnosisSafeProxy"
      implementationNames.0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552:
-        "GnosisSafe"
      implementationNames.eth:0x7F2f87B0Efc66Fea0b7c30C61654E53C37993666:
+        "GnosisSafeProxy"
      implementationNames.eth:0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552:
+        "GnosisSafe"
    }
```

```diff
    EOA  (0xAD379D3275a18bd4BB741C3b291a3778D51c3304) {
    +++ description: None
      address:
-        "0xAD379D3275a18bd4BB741C3b291a3778D51c3304"
+        "eth:0xAD379D3275a18bd4BB741C3b291a3778D51c3304"
    }
```

```diff
    EOA  (0xBe1D614F13662Aff0a2Ec1e76f9c82D332Ae78A2) {
    +++ description: None
      address:
-        "0xBe1D614F13662Aff0a2Ec1e76f9c82D332Ae78A2"
+        "eth:0xBe1D614F13662Aff0a2Ec1e76f9c82D332Ae78A2"
    }
```

```diff
    EOA  (0xC2ADCfccEE33A417064d1A45D3b202DE6d9fA474) {
    +++ description: None
      address:
-        "0xC2ADCfccEE33A417064d1A45D3b202DE6d9fA474"
+        "eth:0xC2ADCfccEE33A417064d1A45D3b202DE6d9fA474"
    }
```

```diff
    EOA  (0xDEd0000E32f8F40414d3ab3a830f735a3553E18e) {
    +++ description: None
      address:
-        "0xDEd0000E32f8F40414d3ab3a830f735a3553E18e"
+        "eth:0xDEd0000E32f8F40414d3ab3a830f735a3553E18e"
    }
```

```diff
    EOA  (0xE458b870F2F59a49915591282f1Bb688901767AD) {
    +++ description: None
      address:
-        "0xE458b870F2F59a49915591282f1Bb688901767AD"
+        "eth:0xE458b870F2F59a49915591282f1Bb688901767AD"
    }
```

```diff
+   Status: CREATED
    contract Vector (0x02993cdC11213985b9B13224f3aF289F03bf298d)
    +++ description: The Vector bridge contract that accepts and stores Avail data availability commitments on Ethereum.
```

```diff
+   Status: CREATED
    contract AvailBridgeV1 (0x054fd961708D8E2B9c10a63F6157c74458889F0a)
    +++ description: Bridge contract that verifies merkle proofs of inclusion in the proven data of the eth:0x02993cdC11213985b9B13224f3aF289F03bf298d DA- and arbitrary message bridge. Also used for token- and arbitrary message transfers between Avail and Ethereum.
```

```diff
+   Status: CREATED
    contract Avail Multisig 2 (0x1a5BA9447D02Ddaf7bcB5594Fc27dE2Daf588930)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ProxyAdmin (0x36194271a00dBBBae314E83dA56d0FF75fDa367B)
    +++ description: None
```

```diff
+   Status: CREATED
    contract TimelockController (0x45828180bbE489350D621d002968A0585406d487)
    +++ description: A timelock with access control. The current minimum delay is 1d.
```

```diff
+   Status: CREATED
    contract Avail Multisig 1 (0x7F2f87B0Efc66Fea0b7c30C61654E53C37993666)
    +++ description: None
```

Generated with discovered.json: 0xf66dae769acb818d1676f99aaceffd4713363fa1

# Diff at Wed, 09 Jul 2025 15:10:16 GMT:

- author: Sergey Shemyakov (<sergeyshemyakov@gmx.de>)
- comparing to: main@b0f260a09a1907b9753f327752a82a61cb1f520e block: 22780010
- current block number: 22882091

## Description

Moved SP1 verifier into shared module.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22780010 (main branch discovery), not current.

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

Generated with discovered.json: 0x52dffbe8086134d943ce439f8f66d5c05da5d124

# Diff at Fri, 04 Jul 2025 12:19:26 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@1f56dc47fe915564d4555300304da4d3bcbc087f block: 22780010
- current block number: 22780010

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22780010 (main branch discovery), not current.

```diff
    contract Avail Multisig 2 (0x1a5BA9447D02Ddaf7bcB5594Fc27dE2Daf588930) {
    +++ description: None
      receivedPermissions.0.from:
-        "ethereum:0x054fd961708D8E2B9c10a63F6157c74458889F0a"
+        "eth:0x054fd961708D8E2B9c10a63F6157c74458889F0a"
    }
```

```diff
    contract ProxyAdmin (0x36194271a00dBBBae314E83dA56d0FF75fDa367B) {
    +++ description: None
      directlyReceivedPermissions.0.from:
-        "ethereum:0x054fd961708D8E2B9c10a63F6157c74458889F0a"
+        "eth:0x054fd961708D8E2B9c10a63F6157c74458889F0a"
    }
```

```diff
    contract TimelockController (0x45828180bbE489350D621d002968A0585406d487) {
    +++ description: A timelock with access control. The current minimum delay is 1d.
      directlyReceivedPermissions.0.from:
-        "ethereum:0x36194271a00dBBBae314E83dA56d0FF75fDa367B"
+        "eth:0x36194271a00dBBBae314E83dA56d0FF75fDa367B"
      directlyReceivedPermissions.1.from:
-        "ethereum:0x054fd961708D8E2B9c10a63F6157c74458889F0a"
+        "eth:0x054fd961708D8E2B9c10a63F6157c74458889F0a"
      directlyReceivedPermissions.2.from:
-        "ethereum:0x45828180bbE489350D621d002968A0585406d487"
+        "eth:0x45828180bbE489350D621d002968A0585406d487"
    }
```

```diff
    contract Avail Multisig 1 (0x7F2f87B0Efc66Fea0b7c30C61654E53C37993666) {
    +++ description: None
      receivedPermissions.0.from:
-        "ethereum:0x02993cdC11213985b9B13224f3aF289F03bf298d"
+        "eth:0x02993cdC11213985b9B13224f3aF289F03bf298d"
      receivedPermissions.1.via.0.address:
-        "ethereum:0x45828180bbE489350D621d002968A0585406d487"
+        "eth:0x45828180bbE489350D621d002968A0585406d487"
      receivedPermissions.1.from:
-        "ethereum:0x054fd961708D8E2B9c10a63F6157c74458889F0a"
+        "eth:0x054fd961708D8E2B9c10a63F6157c74458889F0a"
      receivedPermissions.2.from:
-        "ethereum:0x45828180bbE489350D621d002968A0585406d487"
+        "eth:0x45828180bbE489350D621d002968A0585406d487"
      receivedPermissions.3.from:
-        "ethereum:0x45828180bbE489350D621d002968A0585406d487"
+        "eth:0x45828180bbE489350D621d002968A0585406d487"
      receivedPermissions.4.via.0.address:
-        "ethereum:0x45828180bbE489350D621d002968A0585406d487"
+        "eth:0x45828180bbE489350D621d002968A0585406d487"
      receivedPermissions.4.from:
-        "ethereum:0x45828180bbE489350D621d002968A0585406d487"
+        "eth:0x45828180bbE489350D621d002968A0585406d487"
      receivedPermissions.5.from:
-        "ethereum:0x45828180bbE489350D621d002968A0585406d487"
+        "eth:0x45828180bbE489350D621d002968A0585406d487"
      receivedPermissions.6.from:
-        "ethereum:0x45828180bbE489350D621d002968A0585406d487"
+        "eth:0x45828180bbE489350D621d002968A0585406d487"
      receivedPermissions.7.from:
-        "ethereum:0x02993cdC11213985b9B13224f3aF289F03bf298d"
+        "eth:0x02993cdC11213985b9B13224f3aF289F03bf298d"
      receivedPermissions.8.via.1.address:
-        "ethereum:0x45828180bbE489350D621d002968A0585406d487"
+        "eth:0x45828180bbE489350D621d002968A0585406d487"
      receivedPermissions.8.via.0.address:
-        "ethereum:0x36194271a00dBBBae314E83dA56d0FF75fDa367B"
+        "eth:0x36194271a00dBBBae314E83dA56d0FF75fDa367B"
      receivedPermissions.8.from:
-        "ethereum:0x054fd961708D8E2B9c10a63F6157c74458889F0a"
+        "eth:0x054fd961708D8E2B9c10a63F6157c74458889F0a"
      directlyReceivedPermissions.0.from:
-        "ethereum:0x45828180bbE489350D621d002968A0585406d487"
+        "eth:0x45828180bbE489350D621d002968A0585406d487"
    }
```

```diff
    EOA  (0xC2ADCfccEE33A417064d1A45D3b202DE6d9fA474) {
    +++ description: None
      receivedPermissions.0.from:
-        "ethereum:0x02993cdC11213985b9B13224f3aF289F03bf298d"
+        "eth:0x02993cdC11213985b9B13224f3aF289F03bf298d"
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

Generated with discovered.json: 0xccefe72bba270d6cd83a92ea14867fe8e6fcc1ff

# Diff at Wed, 25 Jun 2025 07:40:40 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@4bade41aedf0f9269688f2c05f04d2992bb2ca38 block: 22631743
- current block number: 22780010

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

Generated with discovered.json: 0x3a2bf01a71949636bfe439e03ed22f95a8ea2ac0

# Diff at Fri, 06 Jun 2025 07:24:46 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@1eba1823c240619119cd080ff8cbb757c1c3feda block: 22631743
- current block number: 22631743

## Description

config: make sp1 gateway template more dynamic.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22631743 (main branch discovery), not current.

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
+        [{"selector":"0x801c66ac","verifier":"0xfE2bb0Ad7F2c44Bd1289234Af08aD6FDEC0d54a2"},{"selector":"0x8c5bc5e4","verifier":"0x331b350dDA287d0A65ce43103984CD44cb4Da9f0"},{"selector":"0xfedc1fcc","verifier":"0x36B353776AF6EF3A2bD707049e783F52c4209017"},{"selector":"0xc430ff7f","verifier":"0xc350F063C13a3Ca21331610fe159E697a5c9c2FB"},{"selector":"0xc865c1b6","verifier":"0x6B6A7Ded061567d8A56279801DEA5cFB79be5bFc"},{"selector":"0x4aca240a","verifier":"0x1764C29FBd94865198588f10FC75D4f6636d158d"},{"selector":"0x09069090","verifier":"0x6A87EFd4e6B2Db1ed73129A8b9c51aaA583d49e3"},{"selector":"0x54bdcae3","verifier":"0xd2832Cf1fC8bA210FfABF62Db9A8781153131d16"},{"selector":"0x1b34fe11","verifier":"0xE00a3cBFC45241b33c0A44C78e26168CBc55EC63"},{"selector":"0xd4e8ecd2","verifier":"0x0459d576A6223fEeA177Fb3DF53C9c77BF84C459"}]
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

Generated with discovered.json: 0xfe79ee39472d4ed1482b73e3ffc38ae10de8b32c

# Diff at Wed, 04 Jun 2025 14:03:29 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@243ef5b7e32e78ae0ff8985c4f129996d0c48c80 block: 22615832
- current block number: 22631743

## Description

SP1 verifier upgrade to v5 (plonky3 vuln related).

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22615832 (main branch discovery), not current.

```diff
    contract SP1VerifierGateway (0x3B6041173B80E77f038f3F2C0f9744f04837185e) {
    +++ description: This contract is the router for zk proof verification. It stores the mapping between identifiers and the address of onchain verifier contracts, routing each identifier to the corresponding verifier contract.
      values.verifier.prover:
-        "0xE00a3cBFC45241b33c0A44C78e26168CBc55EC63"
+        "0x0459d576A6223fEeA177Fb3DF53C9c77BF84C459"
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

```diff
+   Status: CREATED
    contract SP1Verifier (0x0459d576A6223fEeA177Fb3DF53C9c77BF84C459)
    +++ description: Verifier contract for SP1 proofs.
```

Generated with discovered.json: 0x233bb6f188823f54b8e41087c6ba0bc51c2bcbdb

# Diff at Mon, 02 Jun 2025 08:33:11 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@2fee84b782a329885c84742cf9cf43143842a2d5 block: 22431133
- current block number: 22615832

## Description

new program key for vector.

## Watched changes

```diff
    contract Vector (0x02993cdC11213985b9B13224f3aF289F03bf298d) {
    +++ description: The Vector bridge contract that accepts and stores Avail data availability commitments on Ethereum.
      values.vectorXProgramVkey:
-        "0x00e9bba2a9360f570b9ba99e5186825ac723bedebd486b6a818870c44e3e4d4f"
+        "0x0057b7de6dcd8ff25e7b41089f4b5fa586067fbb107756d1f66d92fe71dd6ad1"
    }
```

Generated with discovered.json: 0xcf56224779008bb8c4b22ccf91db002ed0eda00a

# Diff at Wed, 28 May 2025 11:34:04 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@13b95854804f5ec749939a5230d24dfeedf19d1e block: 22431133
- current block number: 22431133

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22431133 (main branch discovery), not current.

```diff
    contract SP1Verifier (0xE00a3cBFC45241b33c0A44C78e26168CBc55EC63) {
    +++ description: Verifier contract for SP1 proofs.
      description:
-        "SP1Verifier is a contract used to verify proofs given public values and verification key."
+        "Verifier contract for SP1 proofs."
    }
```

Generated with discovered.json: 0x03ffefff9b56f84592507ce6a53cd782d9f53103

# Diff at Fri, 23 May 2025 09:41:07 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@69cd181abbc3c830a6caf2f4429b37cae72ffdb8 block: 22431133
- current block number: 22431133

## Description

Introduced .role field on each permission, defaulting to field name on which it was defined (with '.' prefix)

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22431133 (main branch discovery), not current.

```diff
    contract Avail Multisig 2 (0x1a5BA9447D02Ddaf7bcB5594Fc27dE2Daf588930) {
    +++ description: None
      receivedPermissions.0.role:
+        ".pauserAC"
    }
```

```diff
    contract ProxyAdmin (0x36194271a00dBBBae314E83dA56d0FF75fDa367B) {
    +++ description: None
      directlyReceivedPermissions.0.role:
+        "admin"
    }
```

```diff
    contract TimelockController (0x45828180bbE489350D621d002968A0585406d487) {
    +++ description: A timelock with access control. The current minimum delay is 1d.
      directlyReceivedPermissions.2.role:
+        ".owner"
      directlyReceivedPermissions.1.role:
+        ".defaultAdminAC"
      directlyReceivedPermissions.0.role:
+        ".defaultAdminAC"
    }
```

```diff
    contract Avail Multisig 1 (0x7F2f87B0Efc66Fea0b7c30C61654E53C37993666) {
    +++ description: None
      receivedPermissions.8.permission:
-        "interact"
+        "upgrade"
      receivedPermissions.8.description:
-        "manage the pauser role and all other access control configurations, set the address of the target contract for DA verification, manage fees."
      receivedPermissions.8.via.1:
+        {"address":"0x36194271a00dBBBae314E83dA56d0FF75fDa367B"}
      receivedPermissions.8.role:
+        "admin"
      receivedPermissions.7.role:
+        ".timelocks"
      receivedPermissions.6.permission:
-        "upgrade"
+        "interact"
      receivedPermissions.6.via.1:
-        {"address":"0x36194271a00dBBBae314E83dA56d0FF75fDa367B"}
      receivedPermissions.6.description:
+        "manage the pauser role and all other access control configurations, set the address of the target contract for DA verification, manage fees."
      receivedPermissions.6.role:
+        ".defaultAdminAC"
      receivedPermissions.5.description:
-        "manage all access control roles."
+        "execute transactions that are ready."
      receivedPermissions.5.via:
-        [{"address":"0x45828180bbE489350D621d002968A0585406d487","delay":86400}]
      receivedPermissions.5.role:
+        ".Executor"
      receivedPermissions.4.role:
+        ".defaultAdminAC"
      receivedPermissions.4.via:
+        [{"address":"0x45828180bbE489350D621d002968A0585406d487","delay":86400}]
      receivedPermissions.3.from:
-        "0x45828180bbE489350D621d002968A0585406d487"
+        "0x02993cdC11213985b9B13224f3aF289F03bf298d"
      receivedPermissions.3.description:
-        "execute transactions that are ready."
+        "can freeze the Vector contract and update the list of authorized relayers."
      receivedPermissions.3.role:
+        ".guardians"
      receivedPermissions.2.from:
-        "0x02993cdC11213985b9B13224f3aF289F03bf298d"
+        "0x45828180bbE489350D621d002968A0585406d487"
      receivedPermissions.2.description:
-        "can freeze the Vector contract and update the list of authorized relayers."
+        "manage all access control roles."
      receivedPermissions.2.role:
+        ".defaultAdminAC"
      receivedPermissions.1.role:
+        ".Proposer"
      receivedPermissions.0.role:
+        ".Canceller"
      directlyReceivedPermissions.0.role:
+        ".Executor"
    }
```

```diff
    EOA  (0xC2ADCfccEE33A417064d1A45D3b202DE6d9fA474) {
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

Generated with discovered.json: 0x0882f58084771e2180bcc926a3664c01e8f1b95b

# Diff at Wed, 07 May 2025 10:16:04 GMT:

- author: Sergey Shemyakov (<sergey.shemyakov@l2beat.com>)
- comparing to: main@370d0c8c1e8a1a622701270cc075f9413ad76ecd block: 22423561
- current block number: 22431133

## Description

Updated owner of ProxyAdmin and 4/7 Avail multisig to the TimelockController.

## Watched changes

```diff
    contract ProxyAdmin (0x36194271a00dBBBae314E83dA56d0FF75fDa367B) {
    +++ description: None
      values.owner:
-        "0x7F2f87B0Efc66Fea0b7c30C61654E53C37993666"
+        "0x45828180bbE489350D621d002968A0585406d487"
    }
```

```diff
    contract TimelockController (0x45828180bbE489350D621d002968A0585406d487) {
    +++ description: A timelock with access control. The current minimum delay is 1d.
      directlyReceivedPermissions.2:
+        {"permission":"act","from":"0x36194271a00dBBBae314E83dA56d0FF75fDa367B"}
    }
```

```diff
    contract Avail Multisig 1 (0x7F2f87B0Efc66Fea0b7c30C61654E53C37993666) {
    +++ description: None
      receivedPermissions.6.via.1:
+        {"address":"0x36194271a00dBBBae314E83dA56d0FF75fDa367B"}
      receivedPermissions.6.via.0.address:
-        "0x36194271a00dBBBae314E83dA56d0FF75fDa367B"
+        "0x45828180bbE489350D621d002968A0585406d487"
      receivedPermissions.6.via.0.delay:
+        86400
      directlyReceivedPermissions.1:
-        {"permission":"act","from":"0x36194271a00dBBBae314E83dA56d0FF75fDa367B"}
    }
```

Generated with discovered.json: 0xd87bac7b9ea3ad62608d63633846ad55e909d162

# Diff at Tue, 06 May 2025 08:46:00 GMT:

- author: Sergey Shemyakov (<sergey.shemyakov@l2beat.com>)
- comparing to: main@76bab41abbae565c3c67522863645fa6d26e7444 block: 22417833
- current block number: 22423561

## Description

Finalized the transfer of admin and owner roles to a 1d timelock controller.

## Watched changes

```diff
    contract AvailBridgeV1 (0x054fd961708D8E2B9c10a63F6157c74458889F0a) {
    +++ description: Bridge contract that verifies merkle proofs of inclusion in the proven data of the 0x02993cdC11213985b9B13224f3aF289F03bf298d DA- and arbitrary message bridge. Also used for token- and arbitrary message transfers between Avail and Ethereum.
      values.accessControl.DEFAULT_ADMIN_ROLE.members.0:
-        "0x7F2f87B0Efc66Fea0b7c30C61654E53C37993666"
+        "0x45828180bbE489350D621d002968A0585406d487"
      values.defaultAdmin:
-        "0x7F2f87B0Efc66Fea0b7c30C61654E53C37993666"
+        "0x45828180bbE489350D621d002968A0585406d487"
      values.defaultAdminAC.0:
-        "0x7F2f87B0Efc66Fea0b7c30C61654E53C37993666"
+        "0x45828180bbE489350D621d002968A0585406d487"
      values.owner:
-        "0x7F2f87B0Efc66Fea0b7c30C61654E53C37993666"
+        "0x45828180bbE489350D621d002968A0585406d487"
      values.pendingDefaultAdmin.newAdmin:
-        "0x45828180bbE489350D621d002968A0585406d487"
+        "0x0000000000000000000000000000000000000000"
      values.pendingDefaultAdmin.schedule:
-        1746442211
+        0
    }
```

```diff
    contract TimelockController (0x45828180bbE489350D621d002968A0585406d487) {
    +++ description: A timelock with access control. The current minimum delay is 1d.
      directlyReceivedPermissions.1:
+        {"permission":"interact","from":"0x054fd961708D8E2B9c10a63F6157c74458889F0a","description":"manage the pauser role and all other access control configurations, set the address of the target contract for DA verification, manage fees."}
    }
```

```diff
    contract Avail Multisig 1 (0x7F2f87B0Efc66Fea0b7c30C61654E53C37993666) {
    +++ description: None
      receivedPermissions.8.permission:
-        "upgrade"
+        "interact"
      receivedPermissions.8.from:
-        "0x02993cdC11213985b9B13224f3aF289F03bf298d"
+        "0x054fd961708D8E2B9c10a63F6157c74458889F0a"
      receivedPermissions.8.description:
+        "manage the pauser role and all other access control configurations, set the address of the target contract for DA verification, manage fees."
      receivedPermissions.8.via:
+        [{"address":"0x45828180bbE489350D621d002968A0585406d487","delay":86400}]
      receivedPermissions.7.from:
-        "0x054fd961708D8E2B9c10a63F6157c74458889F0a"
+        "0x02993cdC11213985b9B13224f3aF289F03bf298d"
      receivedPermissions.7.via:
-        [{"address":"0x36194271a00dBBBae314E83dA56d0FF75fDa367B"}]
      receivedPermissions.6.permission:
-        "interact"
+        "upgrade"
      receivedPermissions.6.from:
-        "0x45828180bbE489350D621d002968A0585406d487"
+        "0x054fd961708D8E2B9c10a63F6157c74458889F0a"
      receivedPermissions.6.description:
-        "manage all access control roles."
      receivedPermissions.6.via.0.address:
-        "0x45828180bbE489350D621d002968A0585406d487"
+        "0x36194271a00dBBBae314E83dA56d0FF75fDa367B"
      receivedPermissions.6.via.0.delay:
-        86400
      receivedPermissions.5.from:
-        "0x054fd961708D8E2B9c10a63F6157c74458889F0a"
+        "0x45828180bbE489350D621d002968A0585406d487"
      receivedPermissions.5.description:
-        "manage the pauser role and all other access control configurations, set the address of the target contract for DA verification, manage fees."
+        "manage all access control roles."
      receivedPermissions.5.via:
+        [{"address":"0x45828180bbE489350D621d002968A0585406d487","delay":86400}]
    }
```

Generated with discovered.json: 0x82c8f962f3732fed1f41bdfffa07c044c93b6371

# Diff at Mon, 05 May 2025 14:37:14 GMT:

- author: Sergey Shemyakov (<sergey.shemyakov@l2beat.com>)
- comparing to: main@277ef8f5adf45205d5b920c1ebfc0f7db8d19aff block: 22336710
- current block number: 22417833

## Description

The Avail bridge default admin is scheduled to be changed to a timelock smart contract.

## Watched changes

```diff
    contract AvailBridgeV1 (0x054fd961708D8E2B9c10a63F6157c74458889F0a) {
    +++ description: Bridge contract that verifies merkle proofs of inclusion in the proven data of the 0x02993cdC11213985b9B13224f3aF289F03bf298d DA- and arbitrary message bridge. Also used for token- and arbitrary message transfers between Avail and Ethereum.
      values.pendingDefaultAdmin.newAdmin:
-        "0x0000000000000000000000000000000000000000"
+        "0x45828180bbE489350D621d002968A0585406d487"
      values.pendingDefaultAdmin.schedule:
-        0
+        1746442211
    }
```

```diff
    contract Avail Multisig 1 (0x7F2f87B0Efc66Fea0b7c30C61654E53C37993666) {
    +++ description: None
      receivedPermissions.8:
+        {"permission":"upgrade","from":"0x02993cdC11213985b9B13224f3aF289F03bf298d"}
      receivedPermissions.7:
+        {"permission":"upgrade","from":"0x054fd961708D8E2B9c10a63F6157c74458889F0a","via":[{"address":"0x36194271a00dBBBae314E83dA56d0FF75fDa367B"}]}
      receivedPermissions.6:
+        {"permission":"interact","from":"0x45828180bbE489350D621d002968A0585406d487","description":"manage all access control roles.","via":[{"address":"0x45828180bbE489350D621d002968A0585406d487","delay":86400}]}
      receivedPermissions.5:
+        {"permission":"interact","from":"0x054fd961708D8E2B9c10a63F6157c74458889F0a","description":"manage the pauser role and all other access control configurations, set the address of the target contract for DA verification, manage fees."}
      receivedPermissions.4:
+        {"permission":"interact","from":"0x45828180bbE489350D621d002968A0585406d487","description":"manage all access control roles."}
      receivedPermissions.3.permission:
-        "upgrade"
+        "interact"
      receivedPermissions.3.from:
-        "0x02993cdC11213985b9B13224f3aF289F03bf298d"
+        "0x45828180bbE489350D621d002968A0585406d487"
      receivedPermissions.3.description:
+        "execute transactions that are ready."
      receivedPermissions.2.permission:
-        "upgrade"
+        "interact"
      receivedPermissions.2.from:
-        "0x054fd961708D8E2B9c10a63F6157c74458889F0a"
+        "0x02993cdC11213985b9B13224f3aF289F03bf298d"
      receivedPermissions.2.via:
-        [{"address":"0x36194271a00dBBBae314E83dA56d0FF75fDa367B"}]
      receivedPermissions.2.description:
+        "can freeze the Vector contract and update the list of authorized relayers."
      receivedPermissions.1.from:
-        "0x054fd961708D8E2B9c10a63F6157c74458889F0a"
+        "0x45828180bbE489350D621d002968A0585406d487"
      receivedPermissions.1.description:
-        "manage the pauser role and all other access control configurations, set the address of the target contract for DA verification, manage fees."
+        "propose transactions."
      receivedPermissions.0.from:
-        "0x02993cdC11213985b9B13224f3aF289F03bf298d"
+        "0x45828180bbE489350D621d002968A0585406d487"
      receivedPermissions.0.description:
-        "can freeze the Vector contract and update the list of authorized relayers."
+        "cancel queued transactions."
      directlyReceivedPermissions.1:
+        {"permission":"act","from":"0x36194271a00dBBBae314E83dA56d0FF75fDa367B"}
      directlyReceivedPermissions.0.from:
-        "0x36194271a00dBBBae314E83dA56d0FF75fDa367B"
+        "0x45828180bbE489350D621d002968A0585406d487"
      directlyReceivedPermissions.0.delay:
+        86400
    }
```

```diff
+   Status: CREATED
    contract TimelockController (0x45828180bbE489350D621d002968A0585406d487)
    +++ description: A timelock with access control. The current minimum delay is 1d.
```

## Source code changes

```diff
.../vector/ethereum/.flat/TimelockController.sol   | 1011 ++++++++++++++++++++
 1 file changed, 1011 insertions(+)
```

Generated with discovered.json: 0x32ca68770b5d0acb9ebc1bfde30d37e23d12f7dc

# Diff at Tue, 29 Apr 2025 08:19:15 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@ef7477af00fe0b57a2f7cacf7e958c12494af662 block: 22336710
- current block number: 22336710

## Description

Field .issuedPermissions is removed from the output as no longer needed. Added 'permissionsConfigHash' due to refactoring of the modelling process (into a separate command).

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22336710 (main branch discovery), not current.

```diff
    contract Vector (0x02993cdC11213985b9B13224f3aF289F03bf298d) {
    +++ description: The Vector bridge contract that accepts and stores Avail data availability commitments on Ethereum.
      issuedPermissions:
-        [{"permission":"interact","to":"0x7F2f87B0Efc66Fea0b7c30C61654E53C37993666","description":"can freeze the Vector contract and update the list of authorized relayers.","via":[]},{"permission":"interact","to":"0xC2ADCfccEE33A417064d1A45D3b202DE6d9fA474","description":"can call commitHeaderRange() to commit block ranges to the Vector contract.","via":[]},{"permission":"upgrade","to":"0x7F2f87B0Efc66Fea0b7c30C61654E53C37993666","via":[]}]
    }
```

```diff
    contract AvailBridgeV1 (0x054fd961708D8E2B9c10a63F6157c74458889F0a) {
    +++ description: Bridge contract that verifies merkle proofs of inclusion in the proven data of the 0x02993cdC11213985b9B13224f3aF289F03bf298d DA- and arbitrary message bridge. Also used for token- and arbitrary message transfers between Avail and Ethereum.
      issuedPermissions:
-        [{"permission":"interact","to":"0x1a5BA9447D02Ddaf7bcB5594Fc27dE2Daf588930","description":"pause the bridge.","via":[]},{"permission":"interact","to":"0x7F2f87B0Efc66Fea0b7c30C61654E53C37993666","description":"manage the pauser role and all other access control configurations, set the address of the target contract for DA verification, manage fees.","via":[]},{"permission":"upgrade","to":"0x7F2f87B0Efc66Fea0b7c30C61654E53C37993666","via":[{"address":"0x36194271a00dBBBae314E83dA56d0FF75fDa367B"}]}]
    }
```

```diff
    contract SP1VerifierGateway (0x3B6041173B80E77f038f3F2C0f9744f04837185e) {
    +++ description: This contract is the router for zk proof verification. It stores the mapping between identifiers and the address of onchain verifier contracts, routing each identifier to the corresponding verifier contract.
      issuedPermissions:
-        [{"permission":"interact","to":"0xCafEf00d348Adbd57c37d1B77e0619C6244C6878","description":"holds the power to affect the liveness and safety of the gateway - can transfer ownership, add and freeze verifier routes.","via":[]}]
    }
```

Generated with discovered.json: 0x4f19e1c1a1b47fe77d64dbfe805e57c7762bc60d

# Diff at Thu, 24 Apr 2025 10:31:15 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@564f772ef796772c9952d7432df8286347a08d9e block: 22336710
- current block number: 22336710

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22336710 (main branch discovery), not current.

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

Generated with discovered.json: 0x485af2ff4d0ad4b48c69ddb1d6575cd1123f26cd

# Diff at Thu, 24 Apr 2025 05:13:24 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@6466cdaa8544f9f09e2fd2435efdaa3e02a1919f block: 22188870
- current block number: 22336710

## Description

Add the Avail bridge (uses vector and is shared by L2s for merkle proofs)... config: colorize, bridge is verified.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22188870 (main branch discovery), not current.

```diff
    contract Avail Multisig 1 (0x7F2f87B0Efc66Fea0b7c30C61654E53C37993666) {
    +++ description: None
      name:
-        "AvailMultisig"
+        "Avail Multisig 1"
      receivedPermissions.3:
+        {"permission":"upgrade","from":"0x02993cdC11213985b9B13224f3aF289F03bf298d"}
      receivedPermissions.2:
+        {"permission":"upgrade","from":"0x054fd961708D8E2B9c10a63F6157c74458889F0a","via":[{"address":"0x36194271a00dBBBae314E83dA56d0FF75fDa367B"}]}
      receivedPermissions.1.permission:
-        "upgrade"
+        "interact"
      receivedPermissions.1.from:
-        "0x02993cdC11213985b9B13224f3aF289F03bf298d"
+        "0x054fd961708D8E2B9c10a63F6157c74458889F0a"
      receivedPermissions.1.description:
+        "manage the pauser role and all other access control configurations, set the address of the target contract for DA verification, manage fees."
      directlyReceivedPermissions:
+        [{"permission":"act","from":"0x36194271a00dBBBae314E83dA56d0FF75fDa367B"}]
    }
```

```diff
+   Status: CREATED
    contract AvailBridgeV1 (0x054fd961708D8E2B9c10a63F6157c74458889F0a)
    +++ description: Bridge contract that verifies merkle proofs of inclusion in the proven data of the 0x02993cdC11213985b9B13224f3aF289F03bf298d DA- and arbitrary message bridge. Also used for token- and arbitrary message transfers between Avail and Ethereum.
```

```diff
+   Status: CREATED
    contract Avail Multisig 2 (0x1a5BA9447D02Ddaf7bcB5594Fc27dE2Daf588930)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ProxyAdmin (0x36194271a00dBBBae314E83dA56d0FF75fDa367B)
    +++ description: None
```

Generated with discovered.json: 0x194d174e8fec4d9db4b1fe53d82b96e689dc23a7

# Diff at Thu, 03 Apr 2025 14:55:22 GMT:

- author: vincfurc (<10850139+vincfurc@users.noreply.github.com>)
- comparing to: main@87156896058912c79002d4129b054942ff1352e9 block: 21635855
- current block number: 22188870

## Description

Renamed SP1SuccinctGateway to SP1VerifierGateway. vectorXProgramVkey changed.

## Watched changes

```diff
    contract Vector (0x02993cdC11213985b9B13224f3aF289F03bf298d) {
    +++ description: The Vector bridge contract that accepts and stores Avail data availability commitments on Ethereum.
      values.vectorXProgramVkey:
-        "0x00d0279ddadaccdbdb6142981d3830f9ada20ed4e2925ed186ae2be5806e3402"
+        "0x00e9bba2a9360f570b9ba99e5186825ac723bedebd486b6a818870c44e3e4d4f"
    }
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21635855 (main branch discovery), not current.

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
    contract SP1VerifierGatewayMultisig (0xCafEf00d348Adbd57c37d1B77e0619C6244C6878) {
    +++ description: None
      name:
-        "SuccinctGatewaySP1Multisig"
+        "SP1VerifierGatewayMultisig"
    }
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

Generated with discovered.json: 0xeb46411b3caad84170ba00ea3e1e21a9a6c1095b

# Diff at Tue, 04 Mar 2025 10:40:11 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@98d260b45fe0d2195ce5e629bd7b200c8706e8ba block: 21635855
- current block number: 21635855

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21635855 (main branch discovery), not current.

```diff
    contract Vector (0x02993cdC11213985b9B13224f3aF289F03bf298d) {
    +++ description: The Vector bridge contract that accepts and stores Avail data availability commitments on Ethereum.
      sinceBlock:
+        20235805
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
    contract AvailMultisig (0x7F2f87B0Efc66Fea0b7c30C61654E53C37993666) {
    +++ description: None
      sinceBlock:
+        19806461
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

Generated with discovered.json: 0x9d489ebdf0e1980b4299bc1541af8509618dbdb2

# Diff at Tue, 11 Feb 2025 14:13:40 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@5604bedbb0dabec83d300e0abeb3d8685929c5d3 block: 21635855
- current block number: 21635855

## Description

Made succinct gateway description more generic (to be used not only for blobstream).

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21635855 (main branch discovery), not current.

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

Generated with discovered.json: 0x0c64fc63bbdd5cad4a68f330fd16514d41b012ab

# Diff at Tue, 04 Feb 2025 12:33:21 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@145553eed7ba44636411ecb25e4099728acd02f9 block: 21635855
- current block number: 21635855

## Description

Rename 'configure' permission to 'interact'

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21635855 (main branch discovery), not current.

```diff
    contract Vector (0x02993cdC11213985b9B13224f3aF289F03bf298d) {
    +++ description: The Vector bridge contract that accepts and stores Avail data availability commitments on Ethereum.
      issuedPermissions.1.permission:
-        "configure"
+        "interact"
      issuedPermissions.0.permission:
-        "configure"
+        "interact"
    }
```

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
    contract AvailMultisig (0x7F2f87B0Efc66Fea0b7c30C61654E53C37993666) {
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
    contract SP1Verifier (0xE00a3cBFC45241b33c0A44C78e26168CBc55EC63) {
    +++ description: None
      receivedPermissions.0.permission:
-        "configure"
+        "interact"
    }
```

Generated with discovered.json: 0xd24662c1c9de18087685bcf760828453cabcc7e4

# Diff at Mon, 20 Jan 2025 11:10:20 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@2c8b4f3d9910bb6371be9b4df87b70856e7d8c64 block: 21635855
- current block number: 21635855

## Description

Rerun on the same block number. Applies fixes to permissions and via field. Renames permission's target to to/from.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21635855 (main branch discovery), not current.

```diff
    contract Vector (0x02993cdC11213985b9B13224f3aF289F03bf298d) {
    +++ description: The Vector bridge contract that accepts and stores Avail data availability commitments on Ethereum.
      issuedPermissions.2.target:
-        "0x7F2f87B0Efc66Fea0b7c30C61654E53C37993666"
      issuedPermissions.2.to:
+        "0x7F2f87B0Efc66Fea0b7c30C61654E53C37993666"
      issuedPermissions.1.target:
-        "0xC2ADCfccEE33A417064d1A45D3b202DE6d9fA474"
      issuedPermissions.1.to:
+        "0xC2ADCfccEE33A417064d1A45D3b202DE6d9fA474"
      issuedPermissions.1.description:
+        "can call commitHeaderRange() to commit block ranges to the Vector contract."
      issuedPermissions.0.target:
-        "0x7F2f87B0Efc66Fea0b7c30C61654E53C37993666"
      issuedPermissions.0.to:
+        "0x7F2f87B0Efc66Fea0b7c30C61654E53C37993666"
      issuedPermissions.0.description:
+        "can freeze the Vector contract and update the list of authorized relayers."
    }
```

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
    contract AvailMultisig (0x7F2f87B0Efc66Fea0b7c30C61654E53C37993666) {
    +++ description: None
      receivedPermissions.1.target:
-        "0x02993cdC11213985b9B13224f3aF289F03bf298d"
      receivedPermissions.1.from:
+        "0x02993cdC11213985b9B13224f3aF289F03bf298d"
      receivedPermissions.0.target:
-        "0x02993cdC11213985b9B13224f3aF289F03bf298d"
      receivedPermissions.0.from:
+        "0x02993cdC11213985b9B13224f3aF289F03bf298d"
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
    contract SP1Verifier (0xE00a3cBFC45241b33c0A44C78e26168CBc55EC63) {
    +++ description: None
      receivedPermissions.0.target:
-        "0x3B6041173B80E77f038f3F2C0f9744f04837185e"
      receivedPermissions.0.from:
+        "0x3B6041173B80E77f038f3F2C0f9744f04837185e"
    }
```

Generated with discovered.json: 0x597df2b9f6a80e61eec7ffdfe64a32b78a1ba709

# Diff at Thu, 16 Jan 2025 12:09:52 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@3513cb068688b9fa7f9ddd40447f5f70d088c2cf block: 21630305
- current block number: 21635855

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
discovery. Values are for block 21630305 (main branch discovery), not current.

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

Generated with discovered.json: 0x4dacf0edbf35077522b521884aad81792a036d93

# Diff at Wed, 15 Jan 2025 13:53:48 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@3ea176aee1470e5ec80e65adfc81a954f84584d8 block: 21585288
- current block number: 21630305

## Description

New relayer, new programVkey.

## Watched changes

```diff
    contract Vector (0x02993cdC11213985b9B13224f3aF289F03bf298d) {
    +++ description: The Vector bridge contract that accepts and stores Avail data availability commitments on Ethereum.
      values.isRelayerApproved:
-        false
+        true
      values.vectorXProgramVkey:
-        "0x00285180a989ed2d6aa8194220690d0d45f2907535d3d3c09e4cb29f6dbe3d4d"
+        "0x00d0279ddadaccdbdb6142981d3830f9ada20ed4e2925ed186ae2be5806e3402"
    }
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21585288 (main branch discovery), not current.

```diff
    contract Vector (0x02993cdC11213985b9B13224f3aF289F03bf298d) {
    +++ description: The Vector bridge contract that accepts and stores Avail data availability commitments on Ethereum.
      issuedPermissions.1.target:
-        "0x7F2f87B0Efc66Fea0b7c30C61654E53C37993666"
+        "0xC2ADCfccEE33A417064d1A45D3b202DE6d9fA474"
      issuedPermissions.0.target:
-        "0x44eB418A966ff47f5AF6f48AEa6Afde0bf193a8d"
+        "0x7F2f87B0Efc66Fea0b7c30C61654E53C37993666"
      values.isRelayerApproved:
-        true
+        false
      values.relayers.0:
-        "0x44eb418a966ff47f5af6f48aea6afde0bf193a8d"
+        "0xC2ADCfccEE33A417064d1A45D3b202DE6d9fA474"
    }
```

Generated with discovered.json: 0x69c3f8489c736f7f92feded9f8328a32067bed91

# Diff at Thu, 09 Jan 2025 06:59:49 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@edc6acaed84d40aabd5185e0a0b5ebaf1c90143b block: 21386151
- current block number: 21585288

## Description

AvailMultisig single signer rotated.

## Watched changes

```diff
    contract AvailMultisig (0x7F2f87B0Efc66Fea0b7c30C61654E53C37993666) {
    +++ description: None
      values.$members.6:
-        "0xb9274De2305B377b437a9297D6c84eBD69f7aaCE"
+        "0x4983A5ebE79c0570aa368cE84f281A8aAc50cE4d"
    }
```

Generated with discovered.json: 0x3623d610bce0f7225855a7008102a289a89e0d0d

# Diff at Thu, 12 Dec 2024 15:07:34 GMT:

- author: Michał Podsiadły (<michal.podsiadly@l2beat.com>)
- comparing to: main@675c2fed2e6fd64977d53add75705c1380efedb2 block: 21184939
- current block number: 21386151

## Description

Make Vector discovery-driven

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21184939 (main branch discovery), not current.

```diff
    contract Vector (0x02993cdC11213985b9B13224f3aF289F03bf298d) {
    +++ description: The Vector bridge contract that accepts and stores Avail data availability commitments on Ethereum.
      values.guardians:
+        ["0x7F2f87B0Efc66Fea0b7c30C61654E53C37993666"]
      values.timelocks:
+        ["0x7F2f87B0Efc66Fea0b7c30C61654E53C37993666"]
      description:
+        "The Vector bridge contract that accepts and stores Avail data availability commitments on Ethereum."
      issuedPermissions:
+        [{"permission":"configure","target":"0x44eB418A966ff47f5AF6f48AEa6Afde0bf193a8d","via":[]},{"permission":"configure","target":"0x7F2f87B0Efc66Fea0b7c30C61654E53C37993666","via":[]},{"permission":"upgrade","target":"0x7F2f87B0Efc66Fea0b7c30C61654E53C37993666","via":[]}]
    }
```

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
    contract AvailMultisig (0x7F2f87B0Efc66Fea0b7c30C61654E53C37993666) {
    +++ description: None
      receivedPermissions:
+        [{"permission":"configure","target":"0x02993cdC11213985b9B13224f3aF289F03bf298d","description":"can freeze the Vector contract and update the list of authorized relayers."},{"permission":"upgrade","target":"0x02993cdC11213985b9B13224f3aF289F03bf298d"}]
    }
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

Generated with discovered.json: 0x23f25fadc0df50db455a9050798d68335f58768a

# Diff at Thu, 28 Nov 2024 11:03:13 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@4e0645053ebfcfcef2e7fd8c8410bad53373a3c4 block: 21184939
- current block number: 21184939

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21184939 (main branch discovery), not current.

```diff
    contract Vector (0x02993cdC11213985b9B13224f3aF289F03bf298d) {
    +++ description: None
      issuedPermissions:
-        [{"permission":"upgrade","target":"0x0000000000000000000000000000000000000000","via":[]}]
    }
```

Generated with discovered.json: 0x6114f6566c4a9860fe0e5395e9f5826074d19140

# Diff at Thu, 14 Nov 2024 09:08:08 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@ea60800af45c71fbd5d292e0f4301ba9afda01fa block: 21122554
- current block number: 21184939

## Description

New verifier, zk catalog updated.

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
discovery. Values are for block 21122554 (main branch discovery), not current.

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
    contract SP1Verifier (0xc350F063C13a3Ca21331610fe159E697a5c9c2FB) {
    +++ description: None
      name:
-        "SP1Verifier_OLD"
+        "SP1Verifier"
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

Generated with discovered.json: 0x17e3f29f3916d42155d9374428d10c5e6c6b7eb2

# Diff at Tue, 05 Nov 2024 16:10:42 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@5e6ce51851b57187ccdd52c4944a82e2a8ab1e88 block: 21022907
- current block number: 21122554

## Description

Verifier program verification key changed, verifier implementation is the same.

## Watched changes

```diff
    contract Vector (0x02993cdC11213985b9B13224f3aF289F03bf298d) {
    +++ description: None
      values.vectorXProgramVkey:
-        "0x0003c5cf9260fcef3df6c79870952e1ce2f57595ac042ea868c9cbbcab548cf8"
+        "0x00285180a989ed2d6aa8194220690d0d45f2907535d3d3c09e4cb29f6dbe3d4d"
    }
```

Generated with discovered.json: 0xcccd51fbb01c8fd230c5f00ddbeb7a651eae76f6

# Diff at Tue, 22 Oct 2024 18:27:40 GMT:

- author: vincfurc (<10850139+vincfurc@users.noreply.github.com>)
- comparing to: main@c4e420ffba204be049626040a9ea287e023948f8 block: 20985031
- current block number: 21022907

## Description

Changed Vector name for consistency with blobstream.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20985031 (main branch discovery), not current.

```diff
    contract Vector (0x02993cdC11213985b9B13224f3aF289F03bf298d) {
    +++ description: None
      name:
-        "SP1Vector"
+        "Vector"
    }
```

Generated with discovered.json: 0xd280477a38c797769d7570dcd82e85f5e334b2f7

# Diff at Mon, 21 Oct 2024 11:11:53 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@8895d33866f5665c4c710f4ddaa32bfa63cc3c78 block: 20985031
- current block number: 20985031

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20985031 (main branch discovery), not current.

```diff
    contract SP1Vector (0x02993cdC11213985b9B13224f3aF289F03bf298d) {
    +++ description: None
      values.$pastUpgrades.1.2:
+        ["0xc6217f1549Cab6f22ac4AC56d42e6C248731a33D"]
      values.$pastUpgrades.1.1:
-        ["0xc6217f1549Cab6f22ac4AC56d42e6C248731a33D"]
+        "0x13d7977b9fca12882ea6ba47ce1b20a87de540c358b5e260584e0d921e786f5e"
      values.$pastUpgrades.0.2:
+        ["0x2434564f3524b44258B11643729343Ef57D60989"]
      values.$pastUpgrades.0.1:
-        ["0x2434564f3524b44258B11643729343Ef57D60989"]
+        "0x6c2c609d7a13fbdad53b1530d34d740ffa36653f29b5f14220429d7c0d6a3ffc"
    }
```

Generated with discovered.json: 0x406b9eecd2307e8fc04062b629a3c8c3d9458e09

# Diff at Thu, 17 Oct 2024 11:37:36 GMT:

- author: vincfurc (<10850139+vincfurc@users.noreply.github.com>)
- comparing to: main@fe31a2a15a0974a7184aa64dcbcb48891916f4f9 block: 20878383
- current block number: 20985031

## Description

Gave name to Avail multisig.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20878383 (main branch discovery), not current.

```diff
    contract AvailMultisig (0x7F2f87B0Efc66Fea0b7c30C61654E53C37993666) {
    +++ description: None
      name:
-        "GnosisSafe"
+        "AvailMultisig"
    }
```

Generated with discovered.json: 0x0651314515f38c5fb0ead4c76f7c53e53bc1f243

# Diff at Mon, 14 Oct 2024 10:57:46 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@1afc77ff111ceb0970e7d09efcc7b2f376b0c281 block: 20878383
- current block number: 20878383

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20878383 (main branch discovery), not current.

```diff
    contract SP1Vector (0x02993cdC11213985b9B13224f3aF289F03bf298d) {
    +++ description: None
      sourceHashes:
+        ["0xca64a552160ec278e1bacf8ca23e8c71f49012ace91a33141b797451f4683731","0x0e469131222e34f50c12fe74205439de113446461e0fbd31fff1a43b081dbbeb"]
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
    contract GnosisSafe (0x7F2f87B0Efc66Fea0b7c30C61654E53C37993666) {
    +++ description: None
      sourceHashes:
+        ["0x81a7349eebb98ac33b0bc6842e3cb258034a8f2a4ba004570bb8e2e25947f9ff","0xd42bbf9f7dcd3720a7fc6bdc6edfdfae8800a37d6dd4decfa0ef6ca4a2e88940"]
    }
```

```diff
    contract SP1Verifier_OLD (0xc350F063C13a3Ca21331610fe159E697a5c9c2FB) {
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

Generated with discovered.json: 0x7d9489c72ce965ec59331a95d7f397e78bb7e363

# Diff at Wed, 02 Oct 2024 14:22:48 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@d101c705b5f4fd0b3af2e251678b85e1005b31d8 block: 20871625
- current block number: 20878383

## Description

Config related.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20871625 (main branch discovery), not current.

```diff
    contract SP1Vector (0x02993cdC11213985b9B13224f3aF289F03bf298d) {
    +++ description: None
      values.$pastUpgrades:
+        [["2024-07-04T21:23:47.000Z",["0x2434564f3524b44258B11643729343Ef57D60989"]],["2024-07-20T01:29:35.000Z",["0xc6217f1549Cab6f22ac4AC56d42e6C248731a33D"]]]
    }
```

Generated with discovered.json: 0x62904dc488f9c12751a30fa4fc056944696bdb3a

# Diff at Tue, 01 Oct 2024 15:45:53 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@974999225bba0722b5e81edd4c1b80928d80ef33 block: 20735735
- current block number: 20871625

## Description

Vector proxy verified. New verifier.

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
 ...0x6B6A7Ded061567d8A56279801DEA5cFB79be5bFc.sol} |    0
 2 files changed, 1428 insertions(+)
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20735735 (main branch discovery), not current.

```diff
    contract SP1Vector (0x02993cdC11213985b9B13224f3aF289F03bf298d) {
    +++ description: None
      unverified:
-        true
    }
```

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

Generated with discovered.json: 0x6439fce17e3e9e6443d267d35aba6c3a3f3ca927

# Diff at Fri, 13 Sep 2024 08:14:09 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@db4bedcf90d9785b74ad29fd9c12386741eb1cd5 block: 20735735
- current block number: 20735735

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20735735 (main branch discovery), not current.

```diff
    contract SP1Vector (0x02993cdC11213985b9B13224f3aF289F03bf298d) {
    +++ description: None
      values.accessControl:
+        {"DEFAULT_ADMIN_ROLE":{"adminRole":"DEFAULT_ADMIN_ROLE","members":["0xDEd0000E32f8F40414d3ab3a830f735a3553E18e","0x7F2f87B0Efc66Fea0b7c30C61654E53C37993666"]},"TIMELOCK_ROLE":{"adminRole":"DEFAULT_ADMIN_ROLE","members":["0x7F2f87B0Efc66Fea0b7c30C61654E53C37993666"]},"GUARDIAN_ROLE":{"adminRole":"DEFAULT_ADMIN_ROLE","members":["0x7F2f87B0Efc66Fea0b7c30C61654E53C37993666"]}}
    }
```

```diff
+   Status: CREATED
    contract GnosisSafe (0x7F2f87B0Efc66Fea0b7c30C61654E53C37993666)
    +++ description: None
```

Generated with discovered.json: 0xc436404d20a195a814b6beef4caade0ec87eee63

# Diff at Thu, 12 Sep 2024 16:30:55 GMT:

- author: vincfurc (<10850139+vincfurc@users.noreply.github.com>)
- comparing to: main@a548a141184c0638644a7574ba789109e041cf23 block: 20735125
- current block number: 20735735

## Description

Update config to fetch relayers, ignore noisy values.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20735125 (main branch discovery), not current.

```diff
    contract SP1Vector (0x02993cdC11213985b9B13224f3aF289F03bf298d) {
    +++ description: None
      values.isRelayerApproved:
+        true
      values.relayers:
+        ["0x44eb418a966ff47f5af6f48aea6afde0bf193a8d"]
      template:
+        "succinct/SP1Vector"
    }
```

```diff
    contract SuccinctGatewaySP1Multisig (0xCafEf00d348Adbd57c37d1B77e0619C6244C6878) {
    +++ description: None
      name:
-        "GnosisSafe"
+        "SuccinctGatewaySP1Multisig"
    }
```

Generated with discovered.json: 0x34e799459a1f0f40298882ee5a06293de6b3511b

# Diff at Thu, 12 Sep 2024 14:28:29 GMT:

- author: vincfurc (<10850139+vincfurc@users.noreply.github.com>)
- current block number: 20735125

## Description

Provide description of changes. This section will be preserved.

## Initial discovery

```diff
+   Status: CREATED
    contract SP1Vector (0x02993cdC11213985b9B13224f3aF289F03bf298d)
    +++ description: None
```

```diff
+   Status: CREATED
    contract SuccinctGatewaySP1 (0x3B6041173B80E77f038f3F2C0f9744f04837185e)
    +++ description: None
```

```diff
+   Status: CREATED
    contract SP1Verifier (0x6B6A7Ded061567d8A56279801DEA5cFB79be5bFc)
    +++ description: None
```

```diff
+   Status: CREATED
    contract SP1Verifier_OLD (0xc350F063C13a3Ca21331610fe159E697a5c9c2FB)
    +++ description: None
```

```diff
+   Status: CREATED
    contract GnosisSafe (0xCafEf00d348Adbd57c37d1B77e0619C6244C6878)
    +++ description: None
```
