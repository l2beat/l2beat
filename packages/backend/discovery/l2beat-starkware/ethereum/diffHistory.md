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
