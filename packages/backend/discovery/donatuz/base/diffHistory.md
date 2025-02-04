Generated with discovered.json: 0x1b9ec7685636b9b11ecacc48d76e97b517fe2dfd

# Diff at Tue, 04 Feb 2025 12:34:00 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@145553eed7ba44636411ecb25e4099728acd02f9 block: 25215421
- current block number: 25215421

## Description

Rename 'configure' permission to 'interact'

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 25215421 (main branch discovery), not current.

```diff
    contract AddressManager (0x5416B7421c42B9218B29f688C47a46020c23cF0d) {
    +++ description: Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts.
      issuedPermissions.0.permission:
-        "configure"
+        "interact"
    }
```

```diff
    contract ConduitMultisig3 (0x7dCe2FEE5e30EFf298cD3d9B92649f00EBDfc104) {
    +++ description: None
      receivedPermissions.3.permission:
-        "guard"
+        "interact"
      receivedPermissions.3.from:
-        "0xb765Df9d2925a82678F4B7bc60eF5294c1604514"
+        "0xa096dD38362bd2cE3C696474329989960722A7Fd"
      receivedPermissions.3.description:
+        "it can update the preconfer address, the batch submitter (Sequencer) address and the gas configuration of the system."
      receivedPermissions.2.permission:
-        "configure"
+        "interact"
      receivedPermissions.2.from:
-        "0xa096dD38362bd2cE3C696474329989960722A7Fd"
+        "0x5416B7421c42B9218B29f688C47a46020c23cF0d"
      receivedPermissions.2.description:
-        "it can update the preconfer address, the batch submitter (Sequencer) address and the gas configuration of the system."
+        "set and change address mappings."
      receivedPermissions.2.via:
+        [{"address":"0x85519ecD4E4c59E62B68dB2082dB1F5c75da1E15"}]
      receivedPermissions.1.permission:
-        "configure"
+        "guard"
      receivedPermissions.1.from:
-        "0x5416B7421c42B9218B29f688C47a46020c23cF0d"
+        "0xb765Df9d2925a82678F4B7bc60eF5294c1604514"
      receivedPermissions.1.description:
-        "set and change address mappings."
      receivedPermissions.1.via:
-        [{"address":"0x85519ecD4E4c59E62B68dB2082dB1F5c75da1E15"}]
    }
```

```diff
    contract ProxyAdmin (0x85519ecD4E4c59E62B68dB2082dB1F5c75da1E15) {
    +++ description: None
      directlyReceivedPermissions.0.permission:
-        "configure"
+        "interact"
    }
```

```diff
    contract SystemConfig (0xa096dD38362bd2cE3C696474329989960722A7Fd) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      issuedPermissions.0.permission:
-        "configure"
+        "interact"
    }
```

Generated with discovered.json: 0xbd20c81d1e26eac4a9aabd37f48d2932920f4987

# Diff at Mon, 20 Jan 2025 11:10:38 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@2c8b4f3d9910bb6371be9b4df87b70856e7d8c64 block: 25215421
- current block number: 25215421

## Description

Rerun on the same block number. Applies fixes to permissions and via field. Renames permission's target to to/from.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 25215421 (main branch discovery), not current.

```diff
    contract AddressManager (0x5416B7421c42B9218B29f688C47a46020c23cF0d) {
    +++ description: Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts.
      issuedPermissions.0.target:
-        "0x7dCe2FEE5e30EFf298cD3d9B92649f00EBDfc104"
      issuedPermissions.0.via.0.delay:
-        0
      issuedPermissions.0.via.0.description:
-        "set and change address mappings."
      issuedPermissions.0.to:
+        "0x7dCe2FEE5e30EFf298cD3d9B92649f00EBDfc104"
      issuedPermissions.0.description:
+        "set and change address mappings."
    }
```

```diff
    contract ConduitMultisig3 (0x7dCe2FEE5e30EFf298cD3d9B92649f00EBDfc104) {
    +++ description: None
      receivedPermissions.7.target:
-        "0xBbea8Cc549702F67cc082d2cAA9842Ba3767536B"
      receivedPermissions.7.from:
+        "0xBbea8Cc549702F67cc082d2cAA9842Ba3767536B"
      receivedPermissions.6.target:
-        "0xb765Df9d2925a82678F4B7bc60eF5294c1604514"
      receivedPermissions.6.from:
+        "0xb765Df9d2925a82678F4B7bc60eF5294c1604514"
      receivedPermissions.5.target:
-        "0xa096dD38362bd2cE3C696474329989960722A7Fd"
      receivedPermissions.5.from:
+        "0xa096dD38362bd2cE3C696474329989960722A7Fd"
      receivedPermissions.4.target:
-        "0x88dBaaeCDa265241a1BABe4A0ce69ad4957da8a2"
      receivedPermissions.4.from:
+        "0x88dBaaeCDa265241a1BABe4A0ce69ad4957da8a2"
      receivedPermissions.3.target:
-        "0xb765Df9d2925a82678F4B7bc60eF5294c1604514"
      receivedPermissions.3.from:
+        "0xb765Df9d2925a82678F4B7bc60eF5294c1604514"
      receivedPermissions.2.target:
-        "0xa096dD38362bd2cE3C696474329989960722A7Fd"
      receivedPermissions.2.from:
+        "0xa096dD38362bd2cE3C696474329989960722A7Fd"
      receivedPermissions.1.target:
-        "0x5416B7421c42B9218B29f688C47a46020c23cF0d"
      receivedPermissions.1.from:
+        "0x5416B7421c42B9218B29f688C47a46020c23cF0d"
      receivedPermissions.0.target:
-        "0x88dBaaeCDa265241a1BABe4A0ce69ad4957da8a2"
      receivedPermissions.0.from:
+        "0x88dBaaeCDa265241a1BABe4A0ce69ad4957da8a2"
      directlyReceivedPermissions.0.target:
-        "0x85519ecD4E4c59E62B68dB2082dB1F5c75da1E15"
      directlyReceivedPermissions.0.from:
+        "0x85519ecD4E4c59E62B68dB2082dB1F5c75da1E15"
    }
```

```diff
    contract ProxyAdmin (0x85519ecD4E4c59E62B68dB2082dB1F5c75da1E15) {
    +++ description: None
      directlyReceivedPermissions.4.target:
-        "0xBbea8Cc549702F67cc082d2cAA9842Ba3767536B"
      directlyReceivedPermissions.4.from:
+        "0xBbea8Cc549702F67cc082d2cAA9842Ba3767536B"
      directlyReceivedPermissions.3.target:
-        "0xb765Df9d2925a82678F4B7bc60eF5294c1604514"
      directlyReceivedPermissions.3.from:
+        "0xb765Df9d2925a82678F4B7bc60eF5294c1604514"
      directlyReceivedPermissions.2.target:
-        "0xa096dD38362bd2cE3C696474329989960722A7Fd"
      directlyReceivedPermissions.2.from:
+        "0xa096dD38362bd2cE3C696474329989960722A7Fd"
      directlyReceivedPermissions.1.target:
-        "0x88dBaaeCDa265241a1BABe4A0ce69ad4957da8a2"
      directlyReceivedPermissions.1.from:
+        "0x88dBaaeCDa265241a1BABe4A0ce69ad4957da8a2"
      directlyReceivedPermissions.0.target:
-        "0x5416B7421c42B9218B29f688C47a46020c23cF0d"
      directlyReceivedPermissions.0.from:
+        "0x5416B7421c42B9218B29f688C47a46020c23cF0d"
    }
```

```diff
    contract L2OutputOracle (0x88dBaaeCDa265241a1BABe4A0ce69ad4957da8a2) {
    +++ description: Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots.
      issuedPermissions.2.target:
-        "0x7dCe2FEE5e30EFf298cD3d9B92649f00EBDfc104"
      issuedPermissions.2.via.0.delay:
-        0
      issuedPermissions.2.to:
+        "0x7dCe2FEE5e30EFf298cD3d9B92649f00EBDfc104"
      issuedPermissions.1.target:
-        "0xfB04981fa938f03b82B4Ca8F5B1FAAA1A547306B"
      issuedPermissions.1.to:
+        "0xfB04981fa938f03b82B4Ca8F5B1FAAA1A547306B"
      issuedPermissions.0.target:
-        "0x7dCe2FEE5e30EFf298cD3d9B92649f00EBDfc104"
      issuedPermissions.0.to:
+        "0x7dCe2FEE5e30EFf298cD3d9B92649f00EBDfc104"
    }
```

```diff
    contract SystemConfig (0xa096dD38362bd2cE3C696474329989960722A7Fd) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      issuedPermissions.2.target:
-        "0x7dCe2FEE5e30EFf298cD3d9B92649f00EBDfc104"
      issuedPermissions.2.via.0.delay:
-        0
      issuedPermissions.2.to:
+        "0x7dCe2FEE5e30EFf298cD3d9B92649f00EBDfc104"
      issuedPermissions.1.target:
-        "0x9C5657Fd52b200b3fE7652ADF20659ec071DD8b0"
      issuedPermissions.1.to:
+        "0x9C5657Fd52b200b3fE7652ADF20659ec071DD8b0"
      issuedPermissions.0.target:
-        "0x7dCe2FEE5e30EFf298cD3d9B92649f00EBDfc104"
      issuedPermissions.0.to:
+        "0x7dCe2FEE5e30EFf298cD3d9B92649f00EBDfc104"
      issuedPermissions.0.description:
+        "it can update the preconfer address, the batch submitter (Sequencer) address and the gas configuration of the system."
    }
```

```diff
    contract OptimismPortal (0xb765Df9d2925a82678F4B7bc60eF5294c1604514) {
    +++ description: The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals.
      issuedPermissions.1.target:
-        "0x7dCe2FEE5e30EFf298cD3d9B92649f00EBDfc104"
      issuedPermissions.1.via.0.delay:
-        0
      issuedPermissions.1.to:
+        "0x7dCe2FEE5e30EFf298cD3d9B92649f00EBDfc104"
      issuedPermissions.0.target:
-        "0x7dCe2FEE5e30EFf298cD3d9B92649f00EBDfc104"
      issuedPermissions.0.to:
+        "0x7dCe2FEE5e30EFf298cD3d9B92649f00EBDfc104"
    }
```

```diff
    contract L1StandardBridge (0xBbea8Cc549702F67cc082d2cAA9842Ba3767536B) {
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain.
      issuedPermissions.0.target:
-        "0x7dCe2FEE5e30EFf298cD3d9B92649f00EBDfc104"
      issuedPermissions.0.via.0.delay:
-        0
      issuedPermissions.0.via.0.description:
-        "upgrading the bridge implementation can give access to all funds escrowed therein."
      issuedPermissions.0.to:
+        "0x7dCe2FEE5e30EFf298cD3d9B92649f00EBDfc104"
      issuedPermissions.0.description:
+        "upgrading the bridge implementation can give access to all funds escrowed therein."
    }
```

Generated with discovered.json: 0xbc3b082bb8d644921e00d9f00e443b733a78955e

# Diff at Sat, 18 Jan 2025 17:10:15 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- current block number: 25215421

## Description

Initial discovery run: Standard opstack L3 Optimium on Base with 100% known shapes, practically no canonical TVL. The data commitments are correctly encoded for alt-DA mode with EigenDA (0x00 id byte) as target.

## Initial discovery

```diff
+   Status: CREATED
    contract L1CrossDomainMessenger (0x4A2b7478B9646c06C3517E6f06e1232684143C00)
    +++ description: Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function.
```

```diff
+   Status: CREATED
    contract AddressManager (0x5416B7421c42B9218B29f688C47a46020c23cF0d)
    +++ description: Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts.
```

```diff
+   Status: CREATED
    contract ConduitMultisig3 (0x7dCe2FEE5e30EFf298cD3d9B92649f00EBDfc104)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ProxyAdmin (0x85519ecD4E4c59E62B68dB2082dB1F5c75da1E15)
    +++ description: None
```

```diff
+   Status: CREATED
    contract L2OutputOracle (0x88dBaaeCDa265241a1BABe4A0ce69ad4957da8a2)
    +++ description: Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots.
```

```diff
+   Status: CREATED
    contract SystemConfig (0xa096dD38362bd2cE3C696474329989960722A7Fd)
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
```

```diff
+   Status: CREATED
    contract OptimismPortal (0xb765Df9d2925a82678F4B7bc60eF5294c1604514)
    +++ description: The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals.
```

```diff
+   Status: CREATED
    contract L1StandardBridge (0xBbea8Cc549702F67cc082d2cAA9842Ba3767536B)
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain.
```
