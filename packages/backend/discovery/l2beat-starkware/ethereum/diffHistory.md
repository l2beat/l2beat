Generated with discovered.json: 0x4366062c1000c56fc03c8be7cbdda3f57e701ee1

# Diff at Thu, 28 Mar 2024 09:13:10 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@867de6120241d47b66bf76f83c490408eb3595b0 block: 19468852
- current block number: 19531641

## Description

Update discovery to include the multisig threshold.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19468852 (main branch discovery), not current.

```diff
    contract SHARPVerifierGovernorMultisig (0x21F9eC47b19d95b5C2DDFB6Ae5D4F92fAdacAEc4) {
    +++ description: None
      upgradeability.threshold:
+        "2 of 3 (67%)"
    }
```

Generated with discovered.json: 0xaff8a6ad66c53b2303b9c9c77d308de4890151ad

# Diff at Tue, 19 Mar 2024 12:40:39 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@284847fdd85d7b4f5b56effe092db242cda5349d block: 19432182
- current block number: 19468852

## Description

Updated the names and references to new SHARP verfier contracts.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19432182 (main branch discovery), not current.

```diff
-   Status: DELETED
    contract CpuFrilessVerifier (0x03Fa911dfCa026D9C8Edb508851b390accF912e8)
    +++ description: None
```

```diff
-   Status: DELETED
    contract CpuConstraintPoly (0x0C099caf7a87e4eB28bcd8D0608063f8a69bb434)
    +++ description: None
```

```diff
-   Status: DELETED
    contract CpuFrilessVerifier (0x217750c27bE9147f9e358D9FF26a8224F8aCC214)
    +++ description: None
```

```diff
-   Status: DELETED
    contract CpuConstraintPoly (0x297951a67D1BF7795500C3802d21a8C846D9C962)
    +++ description: None
```

```diff
-   Status: DELETED
    contract CpuOods (0x3405F644F9390C3478f42Fd205CE6920CcAF3280)
    +++ description: None
```

```diff
-   Status: DELETED
    contract PoseidonPoseidonFullRoundKey0Column (0x37070Fd8051f63E5A6D7E87026e086Cc19db1aBe)
    +++ description: None
```

```diff
-   Status: DELETED
    contract FriStatementContract (0x3E6118DA317f7A433031F03bB71ab870d87dd2DD)
    +++ description: None
```

```diff
    contract GpsMemoryPageFactRegistry (0x40864568f679c10aC9e72211500096a5130770fA) {
    +++ description: None
      name:
-        "GpsMemoryPageFactRegistry"
+        "MemoryPageFactRegistry"
    }
```

```diff
-   Status: DELETED
    contract CpuOods (0x43A1C0bBa540e1C98d4b413F876250bdCFd0b9e0)
    +++ description: None
```

```diff
-   Status: DELETED
    contract CpuOods (0x4bf82e627D57cB3F455E740bcDA25848cDbd2FF7)
    +++ description: None
```

```diff
-   Status: DELETED
    contract CpuConstraintPoly (0x4CF5c11321d54b83bDAE84bBbd018c26621d2950)
    +++ description: None
```

```diff
-   Status: DELETED
    contract PoseidonPoseidonPartialRoundKey1Column (0x4d0E80AB34ee2B19295F2CaC3101d03452D874b8)
    +++ description: None
```

```diff
-   Status: DELETED
    contract PoseidonPoseidonFullRoundKey2Column (0x4FB05b7CC348C5a72C59a3f307baf66e3CA1F835)
    +++ description: None
```

```diff
-   Status: DELETED
    contract PedersenHashPointsYColumn (0x519DA5F74503dA351EbBED889111377d33096002)
    +++ description: None
```

```diff
-   Status: DELETED
    contract CpuOods (0x52314e0b25b024c34480Ac3c75cfE98c2Ed6aa4a)
    +++ description: None
```

```diff
-   Status: DELETED
    contract MerkleStatementContract (0x5899Efea757E0Dbd6d114b3375C23D7540f65fa4)
    +++ description: None
```

```diff
-   Status: DELETED
    contract EcdsaPointsXColumn (0x593a71DC43e9B67FE009d7C76B6EfA925FB329B1)
    +++ description: None
```

```diff
-   Status: DELETED
    contract CairoBootloaderProgram (0x5d07afFAfc8721Ef3dEe4D11A2D1484CBf6A9dDf)
    +++ description: None
```

```diff
-   Status: DELETED
    contract CpuFrilessVerifier (0x630A97901Ac29590DF83f4A64B8D490D54caf239)
    +++ description: None
```

```diff
-   Status: DELETED
    contract CpuOods (0x68293272FEA2D6e74572BC18ffaD11F21344e090)
    +++ description: None
```

```diff
-   Status: DELETED
    contract CpuConstraintPoly (0x691ca565B7416B681e4f9Fb56A1283Ae8b34E55e)
    +++ description: None
```

```diff
    contract SHARPVerifier (0x6cB3EE90C50a38A0e4662bB7e7E6e40B91361BF6) {
    +++ description: None
      name:
-        "SHARPVerifier"
+        "OldSHARPVerifier"
      values.constructorArgs:
-        ["0x5d07afFAfc8721Ef3dEe4D11A2D1484CBf6A9dDf","0xFD14567eaf9ba941cB8c8a94eEC14831ca7fD1b4",["0x217750c27bE9147f9e358D9FF26a8224F8aCC214","0x630A97901Ac29590DF83f4A64B8D490D54caf239","0x8488e8f4e26eBa40faE229AB653d98E341cbE57B","0x9E614a417f8309575fC11b175A51599661f2Bd21","0xC879aF7D5eD80e4676C203FD300E640C297F31e3","0x78Af2BFB12Db15d35f7dE8DD77f29C299C78c590","0xe9664D230490d5A515ef7Ef30033d8075a8D0E24","0x03Fa911dfCa026D9C8Edb508851b390accF912e8"],"3178097804922730583543126053422762895998573737925004508949311089390705597156","2962621603719000361370283216422448934312521782617806945663080079725495842070"]
      values.memoryPageFactRegistry:
+        "0xFD14567eaf9ba941cB8c8a94eEC14831ca7fD1b4"
    }
```

```diff
-   Status: DELETED
    contract CpuFrilessVerifier (0x78Af2BFB12Db15d35f7dE8DD77f29C299C78c590)
    +++ description: None
```

```diff
-   Status: DELETED
    contract PoseidonPoseidonPartialRoundKey0Column (0x812c2AD2161D099724A99C8114c539b9e5b449cd)
    +++ description: None
```

```diff
-   Status: DELETED
    contract CpuFrilessVerifier (0x8488e8f4e26eBa40faE229AB653d98E341cbE57B)
    +++ description: None
```

```diff
-   Status: DELETED
    contract CpuOods (0x8518F459A698038B4CCED66C042c48C6bB5B17fe)
    +++ description: None
```

```diff
-   Status: DELETED
    contract CpuConstraintPoly (0x89B7a7276cBc8Cb35Ec11fAE9da83b20Db3edf20)
    +++ description: None
```

```diff
-   Status: DELETED
    contract CpuConstraintPoly (0x943248dA0FFd5834Da56c5AD5308E2E2991378EB)
    +++ description: None
```

```diff
-   Status: DELETED
    contract CpuFrilessVerifier (0x9E614a417f8309575fC11b175A51599661f2Bd21)
    +++ description: None
```

```diff
-   Status: DELETED
    contract PoseidonPoseidonFullRoundKey1Column (0xb4711a4614368516529d6118C97905aB4B28e267)
    +++ description: None
```

```diff
    contract GpsCairoBootloaderProgram (0xb4c61d092eCf1b69F1965F9D8DE639148ea26a40) {
    +++ description: None
      name:
-        "GpsCairoBootloaderProgram"
+        "CairoBootloaderProgram"
    }
```

```diff
-   Status: DELETED
    contract CpuConstraintPoly (0xBE8bd7a41ba7DC7b995a53368e7fFE30Fd2BC447)
    +++ description: None
```

```diff
-   Status: DELETED
    contract PedersenHashPointsXColumn (0xc4f21318937017B8aBe5fDc0D48f58dBc1d18940)
    +++ description: None
```

```diff
-   Status: DELETED
    contract CpuFrilessVerifier (0xC879aF7D5eD80e4676C203FD300E640C297F31e3)
    +++ description: None
```

```diff
-   Status: DELETED
    contract CpuOods (0xc9E067AF5d00eb4aA2E73843ac36AfF83C5CeeD3)
    +++ description: None
```

```diff
-   Status: DELETED
    contract EcdsaPointsYColumn (0xcA59f6FD499ffF50c78Ffb420a9bcd0d273abf29)
    +++ description: None
```

```diff
-   Status: DELETED
    contract CpuConstraintPoly (0xd0aAdECA2d25AEFde0da214d27b04b6ea20D7418)
    +++ description: None
```

```diff
    contract GpsStatementVerifier (0xd51A3D50d4D2f99a345a66971E650EEA064DD8dF) {
    +++ description: None
      name:
-        "GpsStatementVerifier"
+        "SHARPVerifier"
      values.cairoVerifierContractAddresses:
-        ["0x5f1AbAA5d375Edb7bEd213855D44268B844CD65d","0x6097FC32a720D0DE369A67FecdBC91fE3C6Cc460","0xbF8D127efc09ed49C65f00355A0C5a5FF57D26cc","0x66F2345D003511a1A60D87E3984Bb8d12C21A970","0x8055948c530dbBc19cc350d53473EEe3a1e3d22B","0xD0fC19710c389ef4a7244656cB08db08eA9D88b4","0xaA2c9CDD4ceAebe9A35873B77F57FB47c3Ef11b9","0x28E3aD4201ba416B23d9950503dB28a9232BE32a"]
      values.cpuFrilessVerifiers:
+        ["0x5f1AbAA5d375Edb7bEd213855D44268B844CD65d","0x6097FC32a720D0DE369A67FecdBC91fE3C6Cc460","0xbF8D127efc09ed49C65f00355A0C5a5FF57D26cc","0x66F2345D003511a1A60D87E3984Bb8d12C21A970","0x8055948c530dbBc19cc350d53473EEe3a1e3d22B","0xD0fC19710c389ef4a7244656cB08db08eA9D88b4","0xaA2c9CDD4ceAebe9A35873B77F57FB47c3Ef11b9","0x28E3aD4201ba416B23d9950503dB28a9232BE32a"]
    }
```

```diff
-   Status: DELETED
    contract CpuFrilessVerifier (0xe9664D230490d5A515ef7Ef30033d8075a8D0E24)
    +++ description: None
```

```diff
-   Status: DELETED
    contract CpuOods (0xED219933b58e9c00E66682356588d42C7932EE8E)
    +++ description: None
```

```diff
    contract MemoryPageFactRegistry (0xFD14567eaf9ba941cB8c8a94eEC14831ca7fD1b4) {
    +++ description: None
      name:
-        "MemoryPageFactRegistry"
+        "OldMemoryPageFactRegistry"
    }
```

```diff
+   Status: CREATED
    contract CpuConstraintPoly (0x04bE0E2D5EcCC744BE21BFb28d91d4a3CBefA8EB)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Fri6_PoseidonPoseidonPartialRoundKey0Column (0x1Db84E79E8daEC762d6aDaa5bf358A4Ba001E975)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Fri1_PoseidonPoseidonFullRoundKey1Column (0x1E8E41141347E01f33d84718b7f4cEFB433D5a94)
    +++ description: None
```

```diff
+   Status: CREATED
    contract CpuConstraintPoly (0x1F038cdFeEE2Afa44a4213b12A6F0a5A7E6DE676)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Fri1_PoseidonPoseidonPartialRoundKey1Column (0x20F10963eBCA608f8B24a5AEE275861B20ec868E)
    +++ description: None
```

```diff
+   Status: CREATED
    contract CpuFrilessVerifier1 (0x28E3aD4201ba416B23d9950503dB28a9232BE32a)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Fri1_PoseidonPoseidonFullRoundKey2Column (0x2b159027d7F0E23D5C15b0517e33DdA838C46045)
    +++ description: None
```

```diff
+   Status: CREATED
    contract CpuConstraintPoly (0x307982EB84858A04d32b5e0b72D152be5A3eEcEA)
    +++ description: None
```

```diff
+   Status: CREATED
    contract CpuOods (0x367B337Aa4A056CB78Fd74F94E283A73B27DfBB6)
    +++ description: None
```

```diff
+   Status: CREATED
    contract PedersenHashPointsXColumn (0x3d571a45D2B14FF423D2DC4A0e7a46e07D9682bB)
    +++ description: None
```

```diff
+   Status: CREATED
    contract CpuConstraintPoly (0x450909cC615036Ca4772dDDd8a69988B031811c9)
    +++ description: None
```

```diff
+   Status: CREATED
    contract CpuOods (0x473E7B002f9A3109fd0FcdA4597935E4E610f367)
    +++ description: None
```

```diff
+   Status: CREATED
    contract CpuOods (0x4D654CEd9cE0781986A4612C76e3e18D6D3B2fFB)
    +++ description: None
```

```diff
+   Status: CREATED
    contract CpuFrilessVerifier2 (0x5f1AbAA5d375Edb7bEd213855D44268B844CD65d)
    +++ description: None
```

```diff
+   Status: CREATED
    contract CpuFrilessVerifier3 (0x6097FC32a720D0DE369A67FecdBC91fE3C6Cc460)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Fri6_PoseidonPoseidonPartialRoundKey1Column (0x62960C874379653D7BBe3644Ac653736Da2eda12)
    +++ description: None
```

```diff
+   Status: CREATED
    contract MerkleStatementContract (0x634DCf4f1421Fc4D95A968A559a450ad0245804c)
    +++ description: None
```

```diff
+   Status: CREATED
    contract CpuFrilessVerifier4 (0x66F2345D003511a1A60D87E3984Bb8d12C21A970)
    +++ description: None
```

```diff
+   Status: CREATED
    contract CpuOods (0x697Ce81ea1732c74850Eef111EbC47c0FBd14a0a)
    +++ description: None
```

```diff
+   Status: CREATED
    contract CpuOods (0x704DFf65eD9b3d121d469b7A790A9927C853607F)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Fri1_PoseidonPoseidonPartialRoundKey0Column (0x75D887d2437eF87EA17B93143716BECD7BBbCa0a)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Fri1_PoseidonPoseidonFullRoundKey0Column (0x8004e851fa3F3C66A3c80e4F7E96559f4C3E16a6)
    +++ description: None
```

```diff
+   Status: CREATED
    contract CpuFrilessVerifier5 (0x8055948c530dbBc19cc350d53473EEe3a1e3d22B)
    +++ description: None
```

```diff
+   Status: CREATED
    contract CpuOods (0x88bA01753F2e96C3a00c6aaf76EaEB36Ccf715C1)
    +++ description: None
```

```diff
+   Status: CREATED
    contract EcdsaPointsYColumn (0x9e4FdD8ff1b11e8f788Af77caA4b0037c137EcC1)
    +++ description: None
```

```diff
+   Status: CREATED
    contract CpuFrilessVerifier6 (0xaA2c9CDD4ceAebe9A35873B77F57FB47c3Ef11b9)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Fri6_PoseidonPoseidonFullRoundKey2Column (0xB5A5759Dd063899F213eB9699906B445f855660D)
    +++ description: None
```

```diff
+   Status: CREATED
    contract CpuConstraintPoly (0xB62Dc40175812208f509B69506315A48C92fb15A)
    +++ description: None
```

```diff
+   Status: CREATED
    contract CpuOods (0xB640935b164024EF1BC0b9e176432c440a5cd4dc)
    +++ description: None
```

```diff
+   Status: CREATED
    contract CpuFrilessVerifier7 (0xbF8D127efc09ed49C65f00355A0C5a5FF57D26cc)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Fri6_PoseidonPoseidonFullRoundKey1Column (0xC2969a099F22430e20bcE237F469ac6F3101Ac5f)
    +++ description: None
```

```diff
+   Status: CREATED
    contract EcdsaPointsXColumn (0xcB799CbBd4f5F0a3b6bbd9b55F59E8b301A0286B)
    +++ description: None
```

```diff
+   Status: CREATED
    contract CpuOods (0xCC80e9E852cAE30E2d30d98ab2868648E84BF2A4)
    +++ description: None
```

```diff
+   Status: CREATED
    contract CpuConstraintPoly (0xcd96f43343Aa06d6ED0D412969c6D462fd17cF02)
    +++ description: None
```

```diff
+   Status: CREATED
    contract CpuFrilessVerifier8 (0xD0fC19710c389ef4a7244656cB08db08eA9D88b4)
    +++ description: None
```

```diff
+   Status: CREATED
    contract CpuConstraintPoly (0xDd4cBe8CC7f420A9576F93E1D1CcC501495B5253)
    +++ description: None
```

```diff
+   Status: CREATED
    contract FriStatementContract (0xDEf8A3b280A54eE7Ed4f72E1c7d6098ad8df44fb)
    +++ description: None
```

```diff
+   Status: CREATED
    contract CpuConstraintPoly (0xE5313feE344376D22A42C9F0919e7F0d43920CAc)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Fri6_PoseidonPoseidonFullRoundKey0Column (0xe7B835eA7e348B25aF2480272C4cA28429573293)
    +++ description: None
```

```diff
+   Status: CREATED
    contract PedersenHashPointsYColumn (0xFD12A123ecf4326E70A4D8b2bC260ec730BBE7Fd)
    +++ description: None
```

Generated with discovered.json: 0xbb98743c8594276adcd76e065855646cd7c5ccea

# Diff at Thu, 14 Mar 2024 08:53:25 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@0d9e81470e7f864bf251e22aca8c3ece6e6f4429 block: 19426040
- current block number: 19432182

## Description

Fetch addresses from GpsStatementVerifier that were internal.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19426040 (main branch discovery), not current.

```diff
    contract GpsStatementVerifier (0xd51A3D50d4D2f99a345a66971E650EEA064DD8dF) {
    +++ description: None
      values.bootloaderProgramContractAddress:
+        "0xb4c61d092eCf1b69F1965F9D8DE639148ea26a40"
      values.cairoVerifierContractAddresses:
+        ["0x5f1AbAA5d375Edb7bEd213855D44268B844CD65d","0x6097FC32a720D0DE369A67FecdBC91fE3C6Cc460","0xbF8D127efc09ed49C65f00355A0C5a5FF57D26cc","0x66F2345D003511a1A60D87E3984Bb8d12C21A970","0x8055948c530dbBc19cc350d53473EEe3a1e3d22B","0xD0fC19710c389ef4a7244656cB08db08eA9D88b4","0xaA2c9CDD4ceAebe9A35873B77F57FB47c3Ef11b9","0x28E3aD4201ba416B23d9950503dB28a9232BE32a"]
      values.memoryPageFactRegistry:
+        "0x40864568f679c10aC9e72211500096a5130770fA"
    }
```

```diff
+   Status: CREATED
    contract GpsMemoryPageFactRegistry (0x40864568f679c10aC9e72211500096a5130770fA)
    +++ description: None
```

```diff
+   Status: CREATED
    contract GpsCairoBootloaderProgram (0xb4c61d092eCf1b69F1965F9D8DE639148ea26a40)
    +++ description: None
```

Generated with discovered.json: 0x8f966e62bd027d2c699e581a404494171a98fecc

# Diff at Wed, 13 Mar 2024 12:07:03 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@4f6a54f5fa748334d34176673b2c233534ce2fbc block: 19376058
- current block number: 19426040

## Description

This value always should've been `false`.
If it was `true` it would mean that no upgrades can be happen in the SHARPVerifier.
But that is not the case, there were upgrades happening while this was set to "`true`" in our discovered.json.
The reason for this mistake is that in the StarkWare Proxy handler the wrong slot was copied for the FINALIZATION flag.
So this is the value that is actually correct.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19376058 (main branch discovery), not current.

```diff
    contract SHARPVerifierProxy (0x47312450B3Ac8b5b8e247a6bB6d523e7605bDb60) {
    +++ description: None
      upgradeability.isFinal:
-        true
+        false
    }
```

Generated with discovered.json: 0xa365edf645a8b7c07fb86981c0293b69f7b70d1d

# Diff at Wed, 06 Mar 2024 12:15:21 GMT:

- author: Luca Donno (<donnoh99@gmail.com>)
- comparing to: main@cea88c5f3ff85fed5d72dadc72ae50315d0808d6 block: 19063965
- current block number: 19376058

## Description

Increased the program size. Some functions have been renamed. The `Address` library has been added. Facts are now both checked on the new contract or the old one, if the current one cannot find them. The usage of the old one has an expiration time. My understanding is that this is to enable a smoother transition to the new contract. `N_BUILTINS` have been increased by one, but not sure what it means. Some more info can be found here: <https://docs.cairo-lang.org/how_cairo_works/builtins.html#layout>.

The upgrade delay is now zero, meaning that the risk of many project is now affected.

## Watched changes

```diff
    contract SHARPVerifierProxy (0x47312450B3Ac8b5b8e247a6bB6d523e7605bDb60) {
    +++ description: None
      upgradeability.callImplementation:
-        "0x6cB3EE90C50a38A0e4662bB7e7E6e40B91361BF6"
+        "0xd51A3D50d4D2f99a345a66971E650EEA064DD8dF"
      upgradeability.upgradeDelay:
-        2419200
+        0
      values.callProxyImplementation:
-        "0x6cB3EE90C50a38A0e4662bB7e7E6e40B91361BF6"
+        "0xd51A3D50d4D2f99a345a66971E650EEA064DD8dF"
      values.getUpgradeActivationDelay:
-        2419200
+        0
    }
```

```diff
+   Status: CREATED
    contract GpsStatementVerifier (0xd51A3D50d4D2f99a345a66971E650EEA064DD8dF)
    +++ description: None
```

## Source code changes

```diff
.../ethereum/.code/GpsStatementVerifier/meta.txt   |   2 +
 .../starkware/solidity/components/FactRegistry.sol |  58 ++
 .../solidity/components/ReferableFactRegistry.sol  |  90 +++
 .../solidity/interfaces/IFactRegistry.sol          |  39 ++
 .../solidity/interfaces/IQueryableFactRegistry.sol |  30 +
 .../starkware/solidity/interfaces/Identity.sol     |  24 +
 .../starkware/solidity/libraries/Addresses.sol     |  58 ++
 .../solidity/verifier/PrimeFieldElement0.sol       | 104 +++
 .../verifier/cpu/CairoBootloaderProgram.sol        | 761 +++++++++++++++++++++
 .../verifier/cpu/CairoVerifierContract.sol         |  46 ++
 .../verifier/cpu/CpuPublicInputOffsetsBase.sol     |  45 ++
 .../verifier/cpu/MemoryPageFactRegistry.sol        | 273 ++++++++
 .../starkware/solidity/verifier/cpu/PageInfo.sol   |  31 +
 .../solidity/verifier/gps/GpsOutputParser.sol      | 294 ++++++++
 .../solidity/verifier/gps/GpsStatementVerifier.sol | 336 +++++++++
 15 files changed, 2191 insertions(+)
```

Generated with discovered.json: 0x41ebaeb687d81ee3b2d9b5dcb97e265f935903f6
