Generated with discovered.json: 0x1b18376d8b4d4f2de9dd7e54b7acddf3131bdafa

# Diff at Fri, 26 Sep 2025 12:48:15 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@ec4b16fd723bf2a8625a616c4b3a1119ce79fb29 block: 1756898514
- current timestamp: 1756898514

## Description

THIS DISCO WAS ARCHIVED: Kinto [sweeped all assets from the canonical bridge](https://etherscan.io/tx/0x3221f37f97d57bc47be2e17fe2be020d7fafbb22876a2ccb454ad586dec70c09) and [some socket vaults](https://app.blocksec.com/explorer/tx/eth/0x8fd5333f84e754ab23b3f973bebb2a669a767ec7b281fe7cd6f98a96aecb7cec), which were transfered to different Multisigs / EOAs. CVR frontend is up.
No rediscovery was possible because the Kinto rpc is already down.

Older update:
add new celestia nitro wasmmoduleroot

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 1756898514 (main branch discovery), not current.

```diff
    contract RollupProxy (eth:0x5073dA9cA4810f3E0aA01c20c7d9d02C3f522e11) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      usedTypes.0.arg.0x597de35fc2ee60e5b2840157370d037542d6a4bc587af7f88202636c54e6bd8d:
+        "Celestia Nitro ArbOS v40 wasmModuleRoot"
    }
```

Generated with discovered.json: 0x30e30174675f17935aae9f2e9d6eecea42855c62

# Diff at Wed, 03 Sep 2025 11:23:13 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@f81a67544a1eef3c7f105dd59187ddee7ac70879 block: 1755591879
- current timestamp: 1756898514

## Description

ms signer change.

## Watched changes

```diff
    contract Kinto Multisig (eth:0xf152Abda9E4ce8b134eF22Dc3C6aCe19C4895D82) {
    +++ description: None
      values.$members.0:
-        "eth:0x5D973Ea995d14799E528B14472346bfDE21eAe2e"
      values.$threshold:
-        3
+        2
      values.multisigThreshold:
-        "3 of 4 (75%)"
+        "2 of 3 (67%)"
    }
```

Generated with discovered.json: 0xb021dec618b02691ca9077f0709d194e055b6173

# Diff at Mon, 01 Sep 2025 10:01:10 GMT:

Merge mark

Generated with discovered.json: 0xe3e078f13aa8d0bf5991e086afc16eea660c8707

# Diff at Tue, 19 Aug 2025 08:25:41 GMT:

- chain: kinto
- author: Luca Donno (<donnoh99@gmail.com>)
- comparing to: main@0ed103f64e02fe332cd2478ee125c9e5f1d4c1d9 block: 1753449971
- current timestamp: 1755591879

## Description

Removed one KYC provider. There are now 6, down from 7.

## Watched changes

```diff
    contract KintoID (0xf369f78E3A0492CC4e96a90dae0728A38498e9c7) {
    +++ description: Manages Kinto's KYC system: The KYC_PROVIDER roles responsible for managing the KYC status and KYC metadata of user wallets. Each KintoWallet checks the KYC status of its user in this contract as part of the signature check.
      values.accessControl.KYC_PROVIDER_ROLE.members.0:
-        "kinto:0x52F09693c9eEaA93A64BA697e3d3e43a1eB65477"
+++ severity: HIGH
      values.KYC_PROVIDERs.0:
-        "kinto:0x52F09693c9eEaA93A64BA697e3d3e43a1eB65477"
    }
```

Generated with discovered.json: 0x80607f4d8cf5174b32d53d0c4c812bda2701cf64

# Diff at Fri, 25 Jul 2025 13:26:31 GMT:

- chain: ethereum
- author: Luca Donno (<donnoh99@gmail.com>)
- comparing to: main@346150684eb21ba72c2fd55d5ba7151717f34745 block: 22593509
- current block number: 22996446

## Description

    Kinto has added SC members to the validator list to satisfy the new stage 1 requirement.

## Watched changes

```diff
    EOA KintoFoundation (0x08E674c4538caE03B6c05405881dDCd95DcaF5a8) {
    +++ description: None
      receivedPermissions:
+        [{"permission":"validate","from":"eth:0x5073dA9cA4810f3E0aA01c20c7d9d02C3f522e11","description":"Can propose new state roots (called nodes) and challenge state roots on the host chain.","role":".validators"}]
    }
```

```diff
    EOA  (0x4a3BB34aDE10127752015A6aF6136da15fde636A) {
    +++ description: None
      receivedPermissions:
+        [{"permission":"validate","from":"eth:0x5073dA9cA4810f3E0aA01c20c7d9d02C3f522e11","description":"Can propose new state roots (called nodes) and challenge state roots on the host chain.","role":".validators","via":[{"address":"eth:0xD98B32e5D0Dcb5853e498225a15447a59b7a40e1"}]}]
    }
```

```diff
    contract RollupProxy (0x5073dA9cA4810f3E0aA01c20c7d9d02C3f522e11) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
+++ description: Increments on each Validator change.
      values.setValidatorCount:
-        4
+        5
      values.validators.0:
+        "eth:0x08E674c4538caE03B6c05405881dDCd95DcaF5a8"
      values.validators.3:
+        "eth:0x5FB5040dfC5B8b9Ea40dFBd881188Ec85cDC0621"
      values.validators.6:
+        "eth:0x94561e98DD5E55271f91A103e4979aa6C493745E"
      values.validators.7:
+        "eth:0xD98B32e5D0Dcb5853e498225a15447a59b7a40e1"
    }
```

```diff
    EOA Certora 1 (0x5FB5040dfC5B8b9Ea40dFBd881188Ec85cDC0621) {
    +++ description: None
      receivedPermissions:
+        [{"permission":"validate","from":"eth:0x5073dA9cA4810f3E0aA01c20c7d9d02C3f522e11","description":"Can propose new state roots (called nodes) and challenge state roots on the host chain.","role":".validators"}]
    }
```

```diff
    EOA  (0x8A577165f8ef813296043d5f75fF2F2F2349afFd) {
    +++ description: None
      receivedPermissions:
+        [{"permission":"validate","from":"eth:0x5073dA9cA4810f3E0aA01c20c7d9d02C3f522e11","description":"Can propose new state roots (called nodes) and challenge state roots on the host chain.","role":".validators","via":[{"address":"eth:0xD98B32e5D0Dcb5853e498225a15447a59b7a40e1"}]}]
    }
```

```diff
    EOA KintsugiFoundation (0x94561e98DD5E55271f91A103e4979aa6C493745E) {
    +++ description: None
      receivedPermissions:
+        [{"permission":"validate","from":"eth:0x5073dA9cA4810f3E0aA01c20c7d9d02C3f522e11","description":"Can propose new state roots (called nodes) and challenge state roots on the host chain.","role":".validators"}]
    }
```

```diff
    EOA  (0xad40f1440544475f4B70573a106F41dF1860598b) {
    +++ description: None
      receivedPermissions:
+        [{"permission":"validate","from":"eth:0x5073dA9cA4810f3E0aA01c20c7d9d02C3f522e11","description":"Can propose new state roots (called nodes) and challenge state roots on the host chain.","role":".validators","via":[{"address":"eth:0xD98B32e5D0Dcb5853e498225a15447a59b7a40e1"}]}]
    }
```

```diff
    EOA  (0xCb5BCC84741b379BFa0968b841C5de1fC9240CBd) {
    +++ description: None
      receivedPermissions:
+        [{"permission":"validate","from":"eth:0x5073dA9cA4810f3E0aA01c20c7d9d02C3f522e11","description":"Can propose new state roots (called nodes) and challenge state roots on the host chain.","role":".validators","via":[{"address":"eth:0xD98B32e5D0Dcb5853e498225a15447a59b7a40e1"}]}]
    }
```

```diff
    contract Turnkey Multisig (0xD98B32e5D0Dcb5853e498225a15447a59b7a40e1) {
    +++ description: None
      directlyReceivedPermissions:
+        [{"permission":"validate","from":"eth:0x5073dA9cA4810f3E0aA01c20c7d9d02C3f522e11","description":"Can propose new state roots (called nodes) and challenge state roots on the host chain.","role":".validators"}]
    }
```

```diff
    EOA  (0xDcbb957bF991A0b252Fd996946Ea27E51ECabA69) {
    +++ description: None
      receivedPermissions:
+        [{"permission":"validate","from":"eth:0x5073dA9cA4810f3E0aA01c20c7d9d02C3f522e11","description":"Can propose new state roots (called nodes) and challenge state roots on the host chain.","role":".validators","via":[{"address":"eth:0xD98B32e5D0Dcb5853e498225a15447a59b7a40e1"}]}]
    }
```

Generated with discovered.json: 0xd61dec63ecc31da86afb0b987cd2c49c7214bfb6

# Diff at Mon, 14 Jul 2025 12:46:56 GMT:

- chain: ethereum
- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@9f4300dad2f3d080cd56fa311d4a848556c74e72 block: 22593509
- current block number: 22593509

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22593509 (main branch discovery), not current.

```diff
    EOA Hypernative (0x082CBA3929aD00EbB6d81ebE57B0BD24fBF3Fc6B) {
    +++ description: None
      address:
-        "0x082CBA3929aD00EbB6d81ebE57B0BD24fBF3Fc6B"
+        "eth:0x082CBA3929aD00EbB6d81ebE57B0BD24fBF3Fc6B"
    }
```

```diff
    EOA KintoFoundation (0x08E674c4538caE03B6c05405881dDCd95DcaF5a8) {
    +++ description: None
      address:
-        "0x08E674c4538caE03B6c05405881dDCd95DcaF5a8"
+        "eth:0x08E674c4538caE03B6c05405881dDCd95DcaF5a8"
    }
```

```diff
    EOA  (0x09d34B74cd8B1c4394A3cD9630E1Ba027E6ED4F5) {
    +++ description: None
      address:
-        "0x09d34B74cd8B1c4394A3cD9630E1Ba027E6ED4F5"
+        "eth:0x09d34B74cd8B1c4394A3cD9630E1Ba027E6ED4F5"
    }
```

```diff
    contract Bridger (0x0f1b7bd7762662B23486320AA91F30312184f70C) {
    +++ description: Bridger gateway that can swap assets to 'L2 final assets' defined by the admin before bridging them to the L2. It does not have a function to bridge via the canonical bridge and uses the external socket bridge by default.
      address:
-        "0x0f1b7bd7762662B23486320AA91F30312184f70C"
+        "eth:0x0f1b7bd7762662B23486320AA91F30312184f70C"
      values.$admin:
-        "0xf152Abda9E4ce8b134eF22Dc3C6aCe19C4895D82"
+        "eth:0xf152Abda9E4ce8b134eF22Dc3C6aCe19C4895D82"
      values.$implementation:
-        "0xae2F80339Bdd9bd384502A62aEe956eAbF3796e6"
+        "eth:0xae2F80339Bdd9bd384502A62aEe956eAbF3796e6"
      values.$pastUpgrades.0.2.0:
-        "0x925eC66892261203536a4aede9CA8e8D0feeA4ad"
+        "eth:0x925eC66892261203536a4aede9CA8e8D0feeA4ad"
      values.$pastUpgrades.1.2.0:
-        "0x31a20f10c846BD3Ed41c6c05c340bFD7A57ECADA"
+        "eth:0x31a20f10c846BD3Ed41c6c05c340bFD7A57ECADA"
      values.$pastUpgrades.2.2.0:
-        "0xE3641CbDAc5477C350c8FeAAF52Ddc021451A2aA"
+        "eth:0xE3641CbDAc5477C350c8FeAAF52Ddc021451A2aA"
      values.$pastUpgrades.3.2.0:
-        "0x989b9f407687DA3050C957CfeF5E6c18BeE7cb9F"
+        "eth:0x989b9f407687DA3050C957CfeF5E6c18BeE7cb9F"
      values.$pastUpgrades.4.2.0:
-        "0x3636617973f25a512676cb06876f0C885568664a"
+        "eth:0x3636617973f25a512676cb06876f0C885568664a"
      values.$pastUpgrades.5.2.0:
-        "0x0210AE8703F8c9A88D7050825bd8001E359CB4BA"
+        "eth:0x0210AE8703F8c9A88D7050825bd8001E359CB4BA"
      values.$pastUpgrades.6.2.0:
-        "0x270f25127D7C48c956459e113aa81615CC30AeE2"
+        "eth:0x270f25127D7C48c956459e113aa81615CC30AeE2"
      values.$pastUpgrades.7.2.0:
-        "0xEEe82E92bA40A694409B4BDa3D7426188c61163e"
+        "eth:0xEEe82E92bA40A694409B4BDa3D7426188c61163e"
      values.$pastUpgrades.8.2.0:
-        "0x23559eB4Ad22c31940a929958B104821126F35b7"
+        "eth:0x23559eB4Ad22c31940a929958B104821126F35b7"
      values.$pastUpgrades.9.2.0:
-        "0x47e28e296BE2EE69b4579d5eecbABA38217a2b03"
+        "eth:0x47e28e296BE2EE69b4579d5eecbABA38217a2b03"
      values.$pastUpgrades.10.2.0:
-        "0x21D3921B50617BDef223207118950B0b577e4007"
+        "eth:0x21D3921B50617BDef223207118950B0b577e4007"
      values.$pastUpgrades.11.2.0:
-        "0xae2F80339Bdd9bd384502A62aEe956eAbF3796e6"
+        "eth:0xae2F80339Bdd9bd384502A62aEe956eAbF3796e6"
      values.angleSwapper:
-        "0xD253b62108d1831aEd298Fc2434A5A8e4E418053"
+        "eth:0xD253b62108d1831aEd298Fc2434A5A8e4E418053"
      values.DAI:
-        "0x6B175474E89094C44Da98b954EedeAC495271d0F"
+        "eth:0x6B175474E89094C44Da98b954EedeAC495271d0F"
      values.ETH:
-        "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE"
+        "eth:0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE"
      values.owner:
-        "0xf152Abda9E4ce8b134eF22Dc3C6aCe19C4895D82"
+        "eth:0xf152Abda9E4ce8b134eF22Dc3C6aCe19C4895D82"
      values.PERMIT2:
-        "0x000000000022D473030F116dDEE9F6B43aC78BA3"
+        "eth:0x000000000022D473030F116dDEE9F6B43aC78BA3"
      values.senderAccount:
-        "0x89A01e3B2C3A16c3960EADc2ceFcCf2D3AA3F82e"
+        "eth:0x89A01e3B2C3A16c3960EADc2ceFcCf2D3AA3F82e"
      values.SOLV_BTC:
-        "0x3647c54c4c2C65bC7a2D63c0Da2809B399DBBDC0"
+        "eth:0x3647c54c4c2C65bC7a2D63c0Da2809B399DBBDC0"
      values.SOLV_SFT_WRAP_ROUTER:
-        "0xe9eD7530427Cb41A56C9e004e00e074cCc168C44"
+        "eth:0xe9eD7530427Cb41A56C9e004e00e074cCc168C44"
      values.stUSD:
-        "0x0022228a2cc5E7eF0274A7Baa600d44da5aB5776"
+        "eth:0x0022228a2cc5E7eF0274A7Baa600d44da5aB5776"
      values.sUSDe:
-        "0x9D39A5DE30e57443BfF2A8307A4256c8797A3497"
+        "eth:0x9D39A5DE30e57443BfF2A8307A4256c8797A3497"
      values.swapRouter:
-        "0x0000000000001fF3684f28c67538d4D072C22734"
+        "eth:0x0000000000001fF3684f28c67538d4D072C22734"
      values.USDA:
-        "0x0000206329b97DB379d5E1Bf586BbDB969C63274"
+        "eth:0x0000206329b97DB379d5E1Bf586BbDB969C63274"
      values.USDC:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      values.USDe:
-        "0x4c9EDD5852cd905f086C759E8383e09bff1E68B3"
+        "eth:0x4c9EDD5852cd905f086C759E8383e09bff1E68B3"
      values.USDM:
-        "0x59D9356E565Ab3A36dD77763Fc0d87fEaf85508C"
+        "eth:0x59D9356E565Ab3A36dD77763Fc0d87fEaf85508C"
      values.WBTC:
-        "0x2f2a2543B76A4166549F7aaB2e75Bef0aefC5B0f"
+        "eth:0x2f2a2543B76A4166549F7aaB2e75Bef0aefC5B0f"
      values.WETH:
-        "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2"
+        "eth:0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2"
      values.wstETH:
-        "0x7f39C581F595B53c5cb19bD0b3f8dA6c935E2Ca0"
+        "eth:0x7f39C581F595B53c5cb19bD0b3f8dA6c935E2Ca0"
      values.wUSDM:
-        "0x57F5E098CaD7A3D1Eed53991D4d66C45C9AF7812"
+        "eth:0x57F5E098CaD7A3D1Eed53991D4d66C45C9AF7812"
      implementationNames.0x0f1b7bd7762662B23486320AA91F30312184f70C:
-        "UUPSProxy"
      implementationNames.0xae2F80339Bdd9bd384502A62aEe956eAbF3796e6:
-        "Bridger"
      implementationNames.eth:0x0f1b7bd7762662B23486320AA91F30312184f70C:
+        "UUPSProxy"
      implementationNames.eth:0xae2F80339Bdd9bd384502A62aEe956eAbF3796e6:
+        "Bridger"
    }
```

```diff
    contract Kinto Security Council (0x17Eb10e12a78f986C78F973Fc70eD88072B33B7d) {
    +++ description: None
      address:
-        "0x17Eb10e12a78f986C78F973Fc70eD88072B33B7d"
+        "eth:0x17Eb10e12a78f986C78F973Fc70eD88072B33B7d"
      values.$implementation:
-        "0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552"
+        "eth:0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552"
      values.$members.0:
-        "0xD98B32e5D0Dcb5853e498225a15447a59b7a40e1"
+        "eth:0xD98B32e5D0Dcb5853e498225a15447a59b7a40e1"
      values.$members.1:
-        "0x5FB5040dfC5B8b9Ea40dFBd881188Ec85cDC0621"
+        "eth:0x5FB5040dfC5B8b9Ea40dFBd881188Ec85cDC0621"
      values.$members.2:
-        "0xe52957E92a372d5a3B544F4C329b606f1A1b4bD2"
+        "eth:0xe52957E92a372d5a3B544F4C329b606f1A1b4bD2"
      values.$members.3:
-        "0x082CBA3929aD00EbB6d81ebE57B0BD24fBF3Fc6B"
+        "eth:0x082CBA3929aD00EbB6d81ebE57B0BD24fBF3Fc6B"
      values.$members.4:
-        "0x08E674c4538caE03B6c05405881dDCd95DcaF5a8"
+        "eth:0x08E674c4538caE03B6c05405881dDCd95DcaF5a8"
      values.$members.5:
-        "0xc1f4D15C16A1f3555E0a5F7AeFD1e17AD4aaf40B"
+        "eth:0xc1f4D15C16A1f3555E0a5F7AeFD1e17AD4aaf40B"
      values.$members.6:
-        "0x356000Cec4fC967f8FC372381D983426760A0391"
+        "eth:0x356000Cec4fC967f8FC372381D983426760A0391"
      values.$members.7:
-        "0x94561e98DD5E55271f91A103e4979aa6C493745E"
+        "eth:0x94561e98DD5E55271f91A103e4979aa6C493745E"
      implementationNames.0x17Eb10e12a78f986C78F973Fc70eD88072B33B7d:
-        "GnosisSafeProxy"
      implementationNames.0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552:
-        "GnosisSafe"
      implementationNames.eth:0x17Eb10e12a78f986C78F973Fc70eD88072B33B7d:
+        "GnosisSafeProxy"
      implementationNames.eth:0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552:
+        "GnosisSafe"
    }
```

```diff
    contract ValidatorUtils (0x2b0E04Dc90e3fA58165CB41E2834B44A56E766aF) {
    +++ description: This contract implements view only utilities for validators.
      address:
-        "0x2b0E04Dc90e3fA58165CB41E2834B44A56E766aF"
+        "eth:0x2b0E04Dc90e3fA58165CB41E2834B44A56E766aF"
      implementationNames.0x2b0E04Dc90e3fA58165CB41E2834B44A56E766aF:
-        "ValidatorUtils"
      implementationNames.eth:0x2b0E04Dc90e3fA58165CB41E2834B44A56E766aF:
+        "ValidatorUtils"
    }
```

```diff
    EOA Ankr (0x2bfDA59220413DEd39dD0E443620b5277EcE6348) {
    +++ description: None
      address:
-        "0x2bfDA59220413DEd39dD0E443620b5277EcE6348"
+        "eth:0x2bfDA59220413DEd39dD0E443620b5277EcE6348"
    }
```

```diff
    contract OneStepProver0 (0x2C1e1A31d2bC26f7BE3CAB5Cb0806641847B3C59) {
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
      address:
-        "0x2C1e1A31d2bC26f7BE3CAB5Cb0806641847B3C59"
+        "eth:0x2C1e1A31d2bC26f7BE3CAB5Cb0806641847B3C59"
      implementationNames.0x2C1e1A31d2bC26f7BE3CAB5Cb0806641847B3C59:
-        "OneStepProver0"
      implementationNames.eth:0x2C1e1A31d2bC26f7BE3CAB5Cb0806641847B3C59:
+        "OneStepProver0"
    }
```

```diff
    EOA  (0x340487b92808B84c2bd97C87B590EE81267E04a7) {
    +++ description: None
      address:
-        "0x340487b92808B84c2bd97C87B590EE81267E04a7"
+        "eth:0x340487b92808B84c2bd97C87B590EE81267E04a7"
    }
```

```diff
    EOA Caldera (0x356000Cec4fC967f8FC372381D983426760A0391) {
    +++ description: None
      address:
-        "0x356000Cec4fC967f8FC372381D983426760A0391"
+        "eth:0x356000Cec4fC967f8FC372381D983426760A0391"
    }
```

```diff
    EOA  (0x4a3BB34aDE10127752015A6aF6136da15fde636A) {
    +++ description: None
      address:
-        "0x4a3BB34aDE10127752015A6aF6136da15fde636A"
+        "eth:0x4a3BB34aDE10127752015A6aF6136da15fde636A"
    }
```

```diff
    contract RollupProxy (0x5073dA9cA4810f3E0aA01c20c7d9d02C3f522e11) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      address:
-        "0x5073dA9cA4810f3E0aA01c20c7d9d02C3f522e11"
+        "eth:0x5073dA9cA4810f3E0aA01c20c7d9d02C3f522e11"
      values.$admin:
-        "0x59B851c8b1643e0735Ec3F2f0e528f3d89c3408a"
+        "eth:0x59B851c8b1643e0735Ec3F2f0e528f3d89c3408a"
      values.$implementation.0:
-        "0x27Bb05e547CfC9b874f18b0F6F3FB62A58Be9CdB"
+        "eth:0x27Bb05e547CfC9b874f18b0F6F3FB62A58Be9CdB"
      values.$implementation.1:
-        "0xa6f528c65569d903C20e7D2639ad343128B4FD27"
+        "eth:0xa6f528c65569d903C20e7D2639ad343128B4FD27"
      values.$pastUpgrades.0.2.0:
-        "0x0aE4dD666748bF0F6dB5c149Eab1D8aD27820A6A"
+        "eth:0x0aE4dD666748bF0F6dB5c149Eab1D8aD27820A6A"
      values.$pastUpgrades.0.2.1:
-        "0x660ea1675F7323dC3Ba0c8dDFB593225Eb01E3C1"
+        "eth:0x660ea1675F7323dC3Ba0c8dDFB593225Eb01E3C1"
      values.$pastUpgrades.1.2.0:
-        "0x27Bb05e547CfC9b874f18b0F6F3FB62A58Be9CdB"
+        "eth:0x27Bb05e547CfC9b874f18b0F6F3FB62A58Be9CdB"
      values.$pastUpgrades.1.2.1:
-        "0xa6f528c65569d903C20e7D2639ad343128B4FD27"
+        "eth:0xa6f528c65569d903C20e7D2639ad343128B4FD27"
      values.anyTrustFastConfirmer:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      values.bridge:
-        "0x859a53Fe2C8DA961387030E7CB498D6D20d0B2DB"
+        "eth:0x859a53Fe2C8DA961387030E7CB498D6D20d0B2DB"
      values.challengeManager:
-        "0x6228e2FB8C561f1a5A963039Bc38Eb6D539A1A7F"
+        "eth:0x6228e2FB8C561f1a5A963039Bc38Eb6D539A1A7F"
      values.challenges.0.challenger:
-        "0x2bfDA59220413DEd39dD0E443620b5277EcE6348"
+        "eth:0x2bfDA59220413DEd39dD0E443620b5277EcE6348"
      values.challenges.0.asserter:
-        "0x64Cf65036a76E3827e448cadbc53D31EefDCE04a"
+        "eth:0x64Cf65036a76E3827e448cadbc53D31EefDCE04a"
      values.inbox:
-        "0xBFfaA85c1756472fFC37e6D172A7eC0538C14474"
+        "eth:0xBFfaA85c1756472fFC37e6D172A7eC0538C14474"
      values.loserStakeEscrow:
-        "0x09d34B74cd8B1c4394A3cD9630E1Ba027E6ED4F5"
+        "eth:0x09d34B74cd8B1c4394A3cD9630E1Ba027E6ED4F5"
      values.outbox:
-        "0x655761AD5FC251F414D6993A73184B0669F278c8"
+        "eth:0x655761AD5FC251F414D6993A73184B0669F278c8"
      values.owner:
-        "0x59B851c8b1643e0735Ec3F2f0e528f3d89c3408a"
+        "eth:0x59B851c8b1643e0735Ec3F2f0e528f3d89c3408a"
      values.rollupEventInbox:
-        "0x52EcE832AF3DF3125BbfD6423E0425dB3fA99D3F"
+        "eth:0x52EcE832AF3DF3125BbfD6423E0425dB3fA99D3F"
      values.sequencerInbox:
-        "0xF4Ef823D57819AC7202a081A5B49376BD28E7b3a"
+        "eth:0xF4Ef823D57819AC7202a081A5B49376BD28E7b3a"
      values.stakeToken:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      values.validators.0:
-        "0x2bfDA59220413DEd39dD0E443620b5277EcE6348"
+        "eth:0x2bfDA59220413DEd39dD0E443620b5277EcE6348"
      values.validators.1:
-        "0x58028fFbc25aE2e12b96276bDB125955F41D41f3"
+        "eth:0x58028fFbc25aE2e12b96276bDB125955F41D41f3"
      values.validators.2:
-        "0x64Cf65036a76E3827e448cadbc53D31EefDCE04a"
+        "eth:0x64Cf65036a76E3827e448cadbc53D31EefDCE04a"
      values.validators.3:
-        "0x944eB0a2829A859959586b10D54229278534a696"
+        "eth:0x944eB0a2829A859959586b10D54229278534a696"
      values.validators.4:
-        "0xe528E74302FFCF6F9F6a1c973968d98F0fDbad8f"
+        "eth:0xe528E74302FFCF6F9F6a1c973968d98F0fDbad8f"
      values.validatorUtils:
-        "0x2b0E04Dc90e3fA58165CB41E2834B44A56E766aF"
+        "eth:0x2b0E04Dc90e3fA58165CB41E2834B44A56E766aF"
      values.validatorWalletCreator:
-        "0x9CAd81628aB7D8e239F1A5B497313341578c5F71"
+        "eth:0x9CAd81628aB7D8e239F1A5B497313341578c5F71"
      implementationNames.0x5073dA9cA4810f3E0aA01c20c7d9d02C3f522e11:
-        "RollupProxy"
      implementationNames.0x27Bb05e547CfC9b874f18b0F6F3FB62A58Be9CdB:
-        "RollupAdminLogic"
      implementationNames.0xa6f528c65569d903C20e7D2639ad343128B4FD27:
-        "RollupUserLogic"
      implementationNames.eth:0x5073dA9cA4810f3E0aA01c20c7d9d02C3f522e11:
+        "RollupProxy"
      implementationNames.eth:0x27Bb05e547CfC9b874f18b0F6F3FB62A58Be9CdB:
+        "RollupAdminLogic"
      implementationNames.eth:0xa6f528c65569d903C20e7D2639ad343128B4FD27:
+        "RollupUserLogic"
    }
```

```diff
    contract RollupEventInbox (0x52EcE832AF3DF3125BbfD6423E0425dB3fA99D3F) {
    +++ description: Helper contract sending configuration data over the bridge during the systems initialization.
      address:
-        "0x52EcE832AF3DF3125BbfD6423E0425dB3fA99D3F"
+        "eth:0x52EcE832AF3DF3125BbfD6423E0425dB3fA99D3F"
      values.$admin:
-        "0x74C717C01425eb475A5fC55d2A4a9045fC9800df"
+        "eth:0x74C717C01425eb475A5fC55d2A4a9045fC9800df"
      values.$implementation:
-        "0x13BE515E44Eefaf3eBEFAD684F1FBB574Ac0A494"
+        "eth:0x13BE515E44Eefaf3eBEFAD684F1FBB574Ac0A494"
      values.$pastUpgrades.0.2.0:
-        "0x13BE515E44Eefaf3eBEFAD684F1FBB574Ac0A494"
+        "eth:0x13BE515E44Eefaf3eBEFAD684F1FBB574Ac0A494"
      values.bridge:
-        "0x859a53Fe2C8DA961387030E7CB498D6D20d0B2DB"
+        "eth:0x859a53Fe2C8DA961387030E7CB498D6D20d0B2DB"
      values.rollup:
-        "0x5073dA9cA4810f3E0aA01c20c7d9d02C3f522e11"
+        "eth:0x5073dA9cA4810f3E0aA01c20c7d9d02C3f522e11"
      implementationNames.0x52EcE832AF3DF3125BbfD6423E0425dB3fA99D3F:
-        "TransparentUpgradeableProxy"
      implementationNames.0x13BE515E44Eefaf3eBEFAD684F1FBB574Ac0A494:
-        "RollupEventInbox"
      implementationNames.eth:0x52EcE832AF3DF3125BbfD6423E0425dB3fA99D3F:
+        "TransparentUpgradeableProxy"
      implementationNames.eth:0x13BE515E44Eefaf3eBEFAD684F1FBB574Ac0A494:
+        "RollupEventInbox"
    }
```

```diff
    contract OneStepProverHostIo (0x551E2501074D80E22c5FfB69b5fd8ba2939593b7) {
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
      address:
-        "0x551E2501074D80E22c5FfB69b5fd8ba2939593b7"
+        "eth:0x551E2501074D80E22c5FfB69b5fd8ba2939593b7"
      implementationNames.0x551E2501074D80E22c5FfB69b5fd8ba2939593b7:
-        "OneStepProverHostIo"
      implementationNames.eth:0x551E2501074D80E22c5FfB69b5fd8ba2939593b7:
+        "OneStepProverHostIo"
    }
```

```diff
    EOA Hypernative2 (0x58028fFbc25aE2e12b96276bDB125955F41D41f3) {
    +++ description: None
      address:
-        "0x58028fFbc25aE2e12b96276bDB125955F41D41f3"
+        "eth:0x58028fFbc25aE2e12b96276bDB125955F41D41f3"
    }
```

```diff
    contract UpgradeExecutor (0x59B851c8b1643e0735Ec3F2f0e528f3d89c3408a) {
    +++ description: Central contract defining the access control permissions for upgrading the system contract implementations.
      address:
-        "0x59B851c8b1643e0735Ec3F2f0e528f3d89c3408a"
+        "eth:0x59B851c8b1643e0735Ec3F2f0e528f3d89c3408a"
      values.$admin:
-        "0x74C717C01425eb475A5fC55d2A4a9045fC9800df"
+        "eth:0x74C717C01425eb475A5fC55d2A4a9045fC9800df"
      values.$implementation:
-        "0x6c21303F5986180B1394d2C89f3e883890E2867b"
+        "eth:0x6c21303F5986180B1394d2C89f3e883890E2867b"
      values.$pastUpgrades.0.2.0:
-        "0x6c21303F5986180B1394d2C89f3e883890E2867b"
+        "eth:0x6c21303F5986180B1394d2C89f3e883890E2867b"
      values.accessControl.ADMIN_ROLE.members.0:
-        "0x59B851c8b1643e0735Ec3F2f0e528f3d89c3408a"
+        "eth:0x59B851c8b1643e0735Ec3F2f0e528f3d89c3408a"
      values.accessControl.EXECUTOR_ROLE.members.0:
-        "0x17Eb10e12a78f986C78F973Fc70eD88072B33B7d"
+        "eth:0x17Eb10e12a78f986C78F973Fc70eD88072B33B7d"
      values.executors.0:
-        "0x17Eb10e12a78f986C78F973Fc70eD88072B33B7d"
+        "eth:0x17Eb10e12a78f986C78F973Fc70eD88072B33B7d"
      implementationNames.0x59B851c8b1643e0735Ec3F2f0e528f3d89c3408a:
-        "TransparentUpgradeableProxy"
      implementationNames.0x6c21303F5986180B1394d2C89f3e883890E2867b:
-        "UpgradeExecutor"
      implementationNames.eth:0x59B851c8b1643e0735Ec3F2f0e528f3d89c3408a:
+        "TransparentUpgradeableProxy"
      implementationNames.eth:0x6c21303F5986180B1394d2C89f3e883890E2867b:
+        "UpgradeExecutor"
    }
```

```diff
    EOA  (0x5D973Ea995d14799E528B14472346bfDE21eAe2e) {
    +++ description: None
      address:
-        "0x5D973Ea995d14799E528B14472346bfDE21eAe2e"
+        "eth:0x5D973Ea995d14799E528B14472346bfDE21eAe2e"
    }
```

```diff
    EOA Certora 1 (0x5FB5040dfC5B8b9Ea40dFBd881188Ec85cDC0621) {
    +++ description: None
      address:
-        "0x5FB5040dfC5B8b9Ea40dFBd881188Ec85cDC0621"
+        "eth:0x5FB5040dfC5B8b9Ea40dFBd881188Ec85cDC0621"
    }
```

```diff
    contract ChallengeManager (0x6228e2FB8C561f1a5A963039Bc38Eb6D539A1A7F) {
    +++ description: Contract that allows challenging state roots. Can be called through the RollupProxy by Validators or the UpgradeExecutor.
      address:
-        "0x6228e2FB8C561f1a5A963039Bc38Eb6D539A1A7F"
+        "eth:0x6228e2FB8C561f1a5A963039Bc38Eb6D539A1A7F"
      values.$admin:
-        "0x74C717C01425eb475A5fC55d2A4a9045fC9800df"
+        "eth:0x74C717C01425eb475A5fC55d2A4a9045fC9800df"
      values.$implementation:
-        "0xd14D9d4c8985763B5037A4f253977e059385660c"
+        "eth:0xd14D9d4c8985763B5037A4f253977e059385660c"
      values.$pastUpgrades.0.2.0:
-        "0xEe9E5546A11Cb5b4A86e92DA05f2ef75C26E4754"
+        "eth:0xEe9E5546A11Cb5b4A86e92DA05f2ef75C26E4754"
      values.$pastUpgrades.1.2.0:
-        "0x122B88885F1f365B69CAd38B167B039fEd0Ba096"
+        "eth:0x122B88885F1f365B69CAd38B167B039fEd0Ba096"
      values.$pastUpgrades.2.2.0:
-        "0xd14D9d4c8985763B5037A4f253977e059385660c"
+        "eth:0xd14D9d4c8985763B5037A4f253977e059385660c"
      values.bridge:
-        "0x859a53Fe2C8DA961387030E7CB498D6D20d0B2DB"
+        "eth:0x859a53Fe2C8DA961387030E7CB498D6D20d0B2DB"
      values.osp:
-        "0xEd696D87C351C2ef687c1c484c3e297B276a40d1"
+        "eth:0xEd696D87C351C2ef687c1c484c3e297B276a40d1"
      values.resultReceiver:
-        "0x5073dA9cA4810f3E0aA01c20c7d9d02C3f522e11"
+        "eth:0x5073dA9cA4810f3E0aA01c20c7d9d02C3f522e11"
      values.sequencerInbox:
-        "0xF4Ef823D57819AC7202a081A5B49376BD28E7b3a"
+        "eth:0xF4Ef823D57819AC7202a081A5B49376BD28E7b3a"
      implementationNames.0x6228e2FB8C561f1a5A963039Bc38Eb6D539A1A7F:
-        "TransparentUpgradeableProxy"
      implementationNames.0xd14D9d4c8985763B5037A4f253977e059385660c:
-        "ChallengeManager"
      implementationNames.eth:0x6228e2FB8C561f1a5A963039Bc38Eb6D539A1A7F:
+        "TransparentUpgradeableProxy"
      implementationNames.eth:0xd14D9d4c8985763B5037A4f253977e059385660c:
+        "ChallengeManager"
    }
```

```diff
    EOA Caldera2 (0x64Cf65036a76E3827e448cadbc53D31EefDCE04a) {
    +++ description: None
      address:
-        "0x64Cf65036a76E3827e448cadbc53D31EefDCE04a"
+        "eth:0x64Cf65036a76E3827e448cadbc53D31EefDCE04a"
    }
```

```diff
    contract Outbox (0x655761AD5FC251F414D6993A73184B0669F278c8) {
    +++ description: Facilitates L2 to L1 contract calls: Messages initiated from L2 (for example withdrawal messages) eventually resolve in execution on L1.
      address:
-        "0x655761AD5FC251F414D6993A73184B0669F278c8"
+        "eth:0x655761AD5FC251F414D6993A73184B0669F278c8"
      values.$admin:
-        "0x74C717C01425eb475A5fC55d2A4a9045fC9800df"
+        "eth:0x74C717C01425eb475A5fC55d2A4a9045fC9800df"
      values.$implementation:
-        "0x2a6DD4433ffa96dc1755814FC0d9cc83A5F68DeC"
+        "eth:0x2a6DD4433ffa96dc1755814FC0d9cc83A5F68DeC"
      values.$pastUpgrades.0.2.0:
-        "0x2a6DD4433ffa96dc1755814FC0d9cc83A5F68DeC"
+        "eth:0x2a6DD4433ffa96dc1755814FC0d9cc83A5F68DeC"
      values.bridge:
-        "0x859a53Fe2C8DA961387030E7CB498D6D20d0B2DB"
+        "eth:0x859a53Fe2C8DA961387030E7CB498D6D20d0B2DB"
      values.l2ToL1Sender:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      values.rollup:
-        "0x5073dA9cA4810f3E0aA01c20c7d9d02C3f522e11"
+        "eth:0x5073dA9cA4810f3E0aA01c20c7d9d02C3f522e11"
      implementationNames.0x655761AD5FC251F414D6993A73184B0669F278c8:
-        "TransparentUpgradeableProxy"
      implementationNames.0x2a6DD4433ffa96dc1755814FC0d9cc83A5F68DeC:
-        "Outbox"
      implementationNames.eth:0x655761AD5FC251F414D6993A73184B0669F278c8:
+        "TransparentUpgradeableProxy"
      implementationNames.eth:0x2a6DD4433ffa96dc1755814FC0d9cc83A5F68DeC:
+        "Outbox"
    }
```

```diff
    contract ProxyAdmin (0x74C717C01425eb475A5fC55d2A4a9045fC9800df) {
    +++ description: None
      address:
-        "0x74C717C01425eb475A5fC55d2A4a9045fC9800df"
+        "eth:0x74C717C01425eb475A5fC55d2A4a9045fC9800df"
      values.owner:
-        "0x59B851c8b1643e0735Ec3F2f0e528f3d89c3408a"
+        "eth:0x59B851c8b1643e0735Ec3F2f0e528f3d89c3408a"
      implementationNames.0x74C717C01425eb475A5fC55d2A4a9045fC9800df:
-        "ProxyAdmin"
      implementationNames.eth:0x74C717C01425eb475A5fC55d2A4a9045fC9800df:
+        "ProxyAdmin"
    }
```

```diff
    contract OneStepProverMemory (0x778ca912Bd8b35dDA84852B47BA8624e08f640A6) {
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
      address:
-        "0x778ca912Bd8b35dDA84852B47BA8624e08f640A6"
+        "eth:0x778ca912Bd8b35dDA84852B47BA8624e08f640A6"
      implementationNames.0x778ca912Bd8b35dDA84852B47BA8624e08f640A6:
-        "OneStepProverMemory"
      implementationNames.eth:0x778ca912Bd8b35dDA84852B47BA8624e08f640A6:
+        "OneStepProverMemory"
    }
```

```diff
    contract ERC20Gateway (0x7870D5398DB488c669B406fBE57b8d05b6A35e42) {
    +++ description: Escrows deposited ERC-20 assets for the canonical Bridge. Upon depositing, a generic token representation will be minted at the destination. Withdrawals are initiated by the Outbox contract.
      address:
-        "0x7870D5398DB488c669B406fBE57b8d05b6A35e42"
+        "eth:0x7870D5398DB488c669B406fBE57b8d05b6A35e42"
      values.$admin:
-        "0x74C717C01425eb475A5fC55d2A4a9045fC9800df"
+        "eth:0x74C717C01425eb475A5fC55d2A4a9045fC9800df"
      values.$implementation:
-        "0xf43bce5D32742FFC862eA182b0b5544CbDBB0F02"
+        "eth:0xf43bce5D32742FFC862eA182b0b5544CbDBB0F02"
      values.$pastUpgrades.0.2.0:
-        "0xf43bce5D32742FFC862eA182b0b5544CbDBB0F02"
+        "eth:0xf43bce5D32742FFC862eA182b0b5544CbDBB0F02"
      values.counterpartGateway:
-        "0x87799989341A07F495287B1433eea98398FD73aA"
+        "eth:0x87799989341A07F495287B1433eea98398FD73aA"
      values.inbox:
-        "0xBFfaA85c1756472fFC37e6D172A7eC0538C14474"
+        "eth:0xBFfaA85c1756472fFC37e6D172A7eC0538C14474"
      values.l2BeaconProxyFactory:
-        "0xA07eeCA8dc436Be2DfBCb4F0C3aD1424c1876185"
+        "eth:0xA07eeCA8dc436Be2DfBCb4F0C3aD1424c1876185"
      values.router:
-        "0xD9041DeCaDcBA88844b373e7053B4AC7A3390D60"
+        "eth:0xD9041DeCaDcBA88844b373e7053B4AC7A3390D60"
      values.whitelist:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      implementationNames.0x7870D5398DB488c669B406fBE57b8d05b6A35e42:
-        "TransparentUpgradeableProxy"
      implementationNames.0xf43bce5D32742FFC862eA182b0b5544CbDBB0F02:
-        "L1ERC20Gateway"
      implementationNames.eth:0x7870D5398DB488c669B406fBE57b8d05b6A35e42:
+        "TransparentUpgradeableProxy"
      implementationNames.eth:0xf43bce5D32742FFC862eA182b0b5544CbDBB0F02:
+        "L1ERC20Gateway"
    }
```

```diff
    contract Bridge (0x859a53Fe2C8DA961387030E7CB498D6D20d0B2DB) {
    +++ description: Escrow contract for the project's gas token (can be different from ETH). Keeps a list of allowed Inboxes and Outboxes for canonical bridge messaging.
      address:
-        "0x859a53Fe2C8DA961387030E7CB498D6D20d0B2DB"
+        "eth:0x859a53Fe2C8DA961387030E7CB498D6D20d0B2DB"
      values.$admin:
-        "0x74C717C01425eb475A5fC55d2A4a9045fC9800df"
+        "eth:0x74C717C01425eb475A5fC55d2A4a9045fC9800df"
      values.$implementation:
-        "0x1c6ACCd9d66f3B993928E7439c9A2d67b94a445F"
+        "eth:0x1c6ACCd9d66f3B993928E7439c9A2d67b94a445F"
      values.$pastUpgrades.0.2.0:
-        "0x1c6ACCd9d66f3B993928E7439c9A2d67b94a445F"
+        "eth:0x1c6ACCd9d66f3B993928E7439c9A2d67b94a445F"
      values.activeOutbox:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
+++ description: Allowed to mint the gastoken on L2 and call `enqueueDelayedMessage()` on the bridge.
+++ severity: HIGH
      values.allowedDelayedInboxList.0:
-        "0xBFfaA85c1756472fFC37e6D172A7eC0538C14474"
+        "eth:0xBFfaA85c1756472fFC37e6D172A7eC0538C14474"
+++ description: Allowed to mint the gastoken on L2 and call `enqueueDelayedMessage()` on the bridge.
+++ severity: HIGH
      values.allowedDelayedInboxList.1:
-        "0x52EcE832AF3DF3125BbfD6423E0425dB3fA99D3F"
+        "eth:0x52EcE832AF3DF3125BbfD6423E0425dB3fA99D3F"
+++ description: Can make calls as the bridge, steal all funds.
+++ severity: HIGH
      values.allowedOutboxList.0:
-        "0x655761AD5FC251F414D6993A73184B0669F278c8"
+        "eth:0x655761AD5FC251F414D6993A73184B0669F278c8"
+++ description: All Inboxes that were ever set as allowed in the bridge.
+++ severity: HIGH
      values.inboxHistory.0:
-        "0xBFfaA85c1756472fFC37e6D172A7eC0538C14474"
+        "eth:0xBFfaA85c1756472fFC37e6D172A7eC0538C14474"
+++ description: All Inboxes that were ever set as allowed in the bridge.
+++ severity: HIGH
      values.inboxHistory.1:
-        "0x52EcE832AF3DF3125BbfD6423E0425dB3fA99D3F"
+        "eth:0x52EcE832AF3DF3125BbfD6423E0425dB3fA99D3F"
+++ description: All Outboxes that were ever set as allowed in the bridge.
+++ severity: HIGH
      values.outboxHistory.0:
-        "0x655761AD5FC251F414D6993A73184B0669F278c8"
+        "eth:0x655761AD5FC251F414D6993A73184B0669F278c8"
      values.rollup:
-        "0x5073dA9cA4810f3E0aA01c20c7d9d02C3f522e11"
+        "eth:0x5073dA9cA4810f3E0aA01c20c7d9d02C3f522e11"
      values.sequencerInbox:
-        "0xF4Ef823D57819AC7202a081A5B49376BD28E7b3a"
+        "eth:0xF4Ef823D57819AC7202a081A5B49376BD28E7b3a"
      implementationNames.0x859a53Fe2C8DA961387030E7CB498D6D20d0B2DB:
-        "TransparentUpgradeableProxy"
      implementationNames.0x1c6ACCd9d66f3B993928E7439c9A2d67b94a445F:
-        "Bridge"
      implementationNames.eth:0x859a53Fe2C8DA961387030E7CB498D6D20d0B2DB:
+        "TransparentUpgradeableProxy"
      implementationNames.eth:0x1c6ACCd9d66f3B993928E7439c9A2d67b94a445F:
+        "Bridge"
    }
```

```diff
    EOA  (0x87799989341A07F495287B1433eea98398FD73aA) {
    +++ description: None
      address:
-        "0x87799989341A07F495287B1433eea98398FD73aA"
+        "eth:0x87799989341A07F495287B1433eea98398FD73aA"
    }
```

```diff
    EOA  (0x89A01e3B2C3A16c3960EADc2ceFcCf2D3AA3F82e) {
    +++ description: None
      address:
-        "0x89A01e3B2C3A16c3960EADc2ceFcCf2D3AA3F82e"
+        "eth:0x89A01e3B2C3A16c3960EADc2ceFcCf2D3AA3F82e"
    }
```

```diff
    EOA  (0x8A577165f8ef813296043d5f75fF2F2F2349afFd) {
    +++ description: None
      address:
-        "0x8A577165f8ef813296043d5f75fF2F2F2349afFd"
+        "eth:0x8A577165f8ef813296043d5f75fF2F2F2349afFd"
    }
```

```diff
    EOA MamoriLabs3 (0x944eB0a2829A859959586b10D54229278534a696) {
    +++ description: None
      address:
-        "0x944eB0a2829A859959586b10D54229278534a696"
+        "eth:0x944eB0a2829A859959586b10D54229278534a696"
    }
```

```diff
    EOA KintsugiFoundation (0x94561e98DD5E55271f91A103e4979aa6C493745E) {
    +++ description: None
      address:
-        "0x94561e98DD5E55271f91A103e4979aa6C493745E"
+        "eth:0x94561e98DD5E55271f91A103e4979aa6C493745E"
    }
```

```diff
    EOA  (0xA07eeCA8dc436Be2DfBCb4F0C3aD1424c1876185) {
    +++ description: None
      address:
-        "0xA07eeCA8dc436Be2DfBCb4F0C3aD1424c1876185"
+        "eth:0xA07eeCA8dc436Be2DfBCb4F0C3aD1424c1876185"
    }
```

```diff
    contract OneStepProverMath (0xacED35d61f71A804E7627b5622c267C8Ac31d38e) {
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
      address:
-        "0xacED35d61f71A804E7627b5622c267C8Ac31d38e"
+        "eth:0xacED35d61f71A804E7627b5622c267C8Ac31d38e"
      implementationNames.0xacED35d61f71A804E7627b5622c267C8Ac31d38e:
-        "OneStepProverMath"
      implementationNames.eth:0xacED35d61f71A804E7627b5622c267C8Ac31d38e:
+        "OneStepProverMath"
    }
```

```diff
    EOA  (0xad40f1440544475f4B70573a106F41dF1860598b) {
    +++ description: None
      address:
-        "0xad40f1440544475f4B70573a106F41dF1860598b"
+        "eth:0xad40f1440544475f4B70573a106F41dF1860598b"
    }
```

```diff
    contract Inbox (0xBFfaA85c1756472fFC37e6D172A7eC0538C14474) {
    +++ description: Facilitates sending L1 to L2 messages like depositing ETH, but does not escrow funds.
      address:
-        "0xBFfaA85c1756472fFC37e6D172A7eC0538C14474"
+        "eth:0xBFfaA85c1756472fFC37e6D172A7eC0538C14474"
      values.$admin:
-        "0x74C717C01425eb475A5fC55d2A4a9045fC9800df"
+        "eth:0x74C717C01425eb475A5fC55d2A4a9045fC9800df"
      values.$implementation:
-        "0x296339ED40ec80746b239b04dE943bb8619784b7"
+        "eth:0x296339ED40ec80746b239b04dE943bb8619784b7"
      values.$pastUpgrades.0.2.0:
-        "0x1162084C3C6575121146582Db5BE43189e8CEe6b"
+        "eth:0x1162084C3C6575121146582Db5BE43189e8CEe6b"
      values.$pastUpgrades.1.2.0:
-        "0x518465d9f81bDE1e573f9bD2a6761F8ADaAFe73e"
+        "eth:0x518465d9f81bDE1e573f9bD2a6761F8ADaAFe73e"
      values.$pastUpgrades.2.2.0:
-        "0xc235c5194f2404234fc7C99b4dd15289BB735Cf5"
+        "eth:0xc235c5194f2404234fc7C99b4dd15289BB735Cf5"
      values.$pastUpgrades.3.2.0:
-        "0x296339ED40ec80746b239b04dE943bb8619784b7"
+        "eth:0x296339ED40ec80746b239b04dE943bb8619784b7"
      values.bridge:
-        "0x859a53Fe2C8DA961387030E7CB498D6D20d0B2DB"
+        "eth:0x859a53Fe2C8DA961387030E7CB498D6D20d0B2DB"
      values.getProxyAdmin:
-        "0x74C717C01425eb475A5fC55d2A4a9045fC9800df"
+        "eth:0x74C717C01425eb475A5fC55d2A4a9045fC9800df"
      values.sequencerInbox:
-        "0xF4Ef823D57819AC7202a081A5B49376BD28E7b3a"
+        "eth:0xF4Ef823D57819AC7202a081A5B49376BD28E7b3a"
      implementationNames.0xBFfaA85c1756472fFC37e6D172A7eC0538C14474:
-        "TransparentUpgradeableProxy"
      implementationNames.0x296339ED40ec80746b239b04dE943bb8619784b7:
-        "Inbox"
      implementationNames.eth:0xBFfaA85c1756472fFC37e6D172A7eC0538C14474:
+        "TransparentUpgradeableProxy"
      implementationNames.eth:0x296339ED40ec80746b239b04dE943bb8619784b7:
+        "Inbox"
    }
```

```diff
    EOA MamoriLabs (0xc1f4D15C16A1f3555E0a5F7AeFD1e17AD4aaf40B) {
    +++ description: None
      address:
-        "0xc1f4D15C16A1f3555E0a5F7AeFD1e17AD4aaf40B"
+        "eth:0xc1f4D15C16A1f3555E0a5F7AeFD1e17AD4aaf40B"
    }
```

```diff
    EOA  (0xc31C4549356d46c37021393EeEb6f704B38061eC) {
    +++ description: None
      address:
-        "0xc31C4549356d46c37021393EeEb6f704B38061eC"
+        "eth:0xc31C4549356d46c37021393EeEb6f704B38061eC"
    }
```

```diff
    EOA  (0xCb5BCC84741b379BFa0968b841C5de1fC9240CBd) {
    +++ description: None
      address:
-        "0xCb5BCC84741b379BFa0968b841C5de1fC9240CBd"
+        "eth:0xCb5BCC84741b379BFa0968b841C5de1fC9240CBd"
    }
```

```diff
    EOA  (0xD253b62108d1831aEd298Fc2434A5A8e4E418053) {
    +++ description: None
      address:
-        "0xD253b62108d1831aEd298Fc2434A5A8e4E418053"
+        "eth:0xD253b62108d1831aEd298Fc2434A5A8e4E418053"
    }
```

```diff
    contract GatewayRouter (0xD9041DeCaDcBA88844b373e7053B4AC7A3390D60) {
    +++ description: This routing contract maps tokens to the correct escrow (gateway) to be then bridged with canonical messaging.
      address:
-        "0xD9041DeCaDcBA88844b373e7053B4AC7A3390D60"
+        "eth:0xD9041DeCaDcBA88844b373e7053B4AC7A3390D60"
      values.$admin:
-        "0x74C717C01425eb475A5fC55d2A4a9045fC9800df"
+        "eth:0x74C717C01425eb475A5fC55d2A4a9045fC9800df"
      values.$implementation:
-        "0x6525137BfF366fbc0A89E3e5A4d244B5A0090a6D"
+        "eth:0x6525137BfF366fbc0A89E3e5A4d244B5A0090a6D"
      values.$pastUpgrades.0.2.0:
-        "0x6525137BfF366fbc0A89E3e5A4d244B5A0090a6D"
+        "eth:0x6525137BfF366fbc0A89E3e5A4d244B5A0090a6D"
      values.counterpartGateway:
-        "0x340487b92808B84c2bd97C87B590EE81267E04a7"
+        "eth:0x340487b92808B84c2bd97C87B590EE81267E04a7"
      values.defaultGateway:
-        "0x7870D5398DB488c669B406fBE57b8d05b6A35e42"
+        "eth:0x7870D5398DB488c669B406fBE57b8d05b6A35e42"
      values.inbox:
-        "0xBFfaA85c1756472fFC37e6D172A7eC0538C14474"
+        "eth:0xBFfaA85c1756472fFC37e6D172A7eC0538C14474"
      values.owner:
-        "0x59B851c8b1643e0735Ec3F2f0e528f3d89c3408a"
+        "eth:0x59B851c8b1643e0735Ec3F2f0e528f3d89c3408a"
      values.router:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      values.whitelist:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      implementationNames.0xD9041DeCaDcBA88844b373e7053B4AC7A3390D60:
-        "TransparentUpgradeableProxy"
      implementationNames.0x6525137BfF366fbc0A89E3e5A4d244B5A0090a6D:
-        "L1GatewayRouter"
      implementationNames.eth:0xD9041DeCaDcBA88844b373e7053B4AC7A3390D60:
+        "TransparentUpgradeableProxy"
      implementationNames.eth:0x6525137BfF366fbc0A89E3e5A4d244B5A0090a6D:
+        "L1GatewayRouter"
    }
```

```diff
    contract Turnkey Multisig (0xD98B32e5D0Dcb5853e498225a15447a59b7a40e1) {
    +++ description: None
      address:
-        "0xD98B32e5D0Dcb5853e498225a15447a59b7a40e1"
+        "eth:0xD98B32e5D0Dcb5853e498225a15447a59b7a40e1"
      values.$implementation:
-        "0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552"
+        "eth:0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552"
      values.$members.0:
-        "0xCb5BCC84741b379BFa0968b841C5de1fC9240CBd"
+        "eth:0xCb5BCC84741b379BFa0968b841C5de1fC9240CBd"
      values.$members.1:
-        "0xDcbb957bF991A0b252Fd996946Ea27E51ECabA69"
+        "eth:0xDcbb957bF991A0b252Fd996946Ea27E51ECabA69"
      values.$members.2:
-        "0x4a3BB34aDE10127752015A6aF6136da15fde636A"
+        "eth:0x4a3BB34aDE10127752015A6aF6136da15fde636A"
      values.$members.3:
-        "0xad40f1440544475f4B70573a106F41dF1860598b"
+        "eth:0xad40f1440544475f4B70573a106F41dF1860598b"
      values.$members.4:
-        "0x8A577165f8ef813296043d5f75fF2F2F2349afFd"
+        "eth:0x8A577165f8ef813296043d5f75fF2F2F2349afFd"
      implementationNames.0xD98B32e5D0Dcb5853e498225a15447a59b7a40e1:
-        "GnosisSafeProxy"
      implementationNames.0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552:
-        "GnosisSafe"
      implementationNames.eth:0xD98B32e5D0Dcb5853e498225a15447a59b7a40e1:
+        "GnosisSafeProxy"
      implementationNames.eth:0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552:
+        "GnosisSafe"
    }
```

```diff
    EOA  (0xDcbb957bF991A0b252Fd996946Ea27E51ECabA69) {
    +++ description: None
      address:
-        "0xDcbb957bF991A0b252Fd996946Ea27E51ECabA69"
+        "eth:0xDcbb957bF991A0b252Fd996946Ea27E51ECabA69"
    }
```

```diff
    EOA  (0xe27f3f6db6824def1738b2aACe2672aC59046a39) {
    +++ description: None
      address:
-        "0xe27f3f6db6824def1738b2aACe2672aC59046a39"
+        "eth:0xe27f3f6db6824def1738b2aACe2672aC59046a39"
    }
```

```diff
    EOA Venn2 (0xe528E74302FFCF6F9F6a1c973968d98F0fDbad8f) {
    +++ description: None
      address:
-        "0xe528E74302FFCF6F9F6a1c973968d98F0fDbad8f"
+        "eth:0xe528E74302FFCF6F9F6a1c973968d98F0fDbad8f"
    }
```

```diff
    EOA Venn/Ironblocks (0xe52957E92a372d5a3B544F4C329b606f1A1b4bD2) {
    +++ description: None
      address:
-        "0xe52957E92a372d5a3B544F4C329b606f1A1b4bD2"
+        "eth:0xe52957E92a372d5a3B544F4C329b606f1A1b4bD2"
    }
```

```diff
    contract OneStepProofEntry (0xEd696D87C351C2ef687c1c484c3e297B276a40d1) {
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
      address:
-        "0xEd696D87C351C2ef687c1c484c3e297B276a40d1"
+        "eth:0xEd696D87C351C2ef687c1c484c3e297B276a40d1"
      values.prover0:
-        "0x2C1e1A31d2bC26f7BE3CAB5Cb0806641847B3C59"
+        "eth:0x2C1e1A31d2bC26f7BE3CAB5Cb0806641847B3C59"
      values.proverHostIo:
-        "0x551E2501074D80E22c5FfB69b5fd8ba2939593b7"
+        "eth:0x551E2501074D80E22c5FfB69b5fd8ba2939593b7"
      values.proverMath:
-        "0xacED35d61f71A804E7627b5622c267C8Ac31d38e"
+        "eth:0xacED35d61f71A804E7627b5622c267C8Ac31d38e"
      values.proverMem:
-        "0x778ca912Bd8b35dDA84852B47BA8624e08f640A6"
+        "eth:0x778ca912Bd8b35dDA84852B47BA8624e08f640A6"
      implementationNames.0xEd696D87C351C2ef687c1c484c3e297B276a40d1:
-        "OneStepProofEntry"
      implementationNames.eth:0xEd696D87C351C2ef687c1c484c3e297B276a40d1:
+        "OneStepProofEntry"
    }
```

```diff
    contract Kinto Multisig (0xf152Abda9E4ce8b134eF22Dc3C6aCe19C4895D82) {
    +++ description: None
      address:
-        "0xf152Abda9E4ce8b134eF22Dc3C6aCe19C4895D82"
+        "eth:0xf152Abda9E4ce8b134eF22Dc3C6aCe19C4895D82"
      values.$implementation:
-        "0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552"
+        "eth:0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552"
      values.$members.0:
-        "0x5D973Ea995d14799E528B14472346bfDE21eAe2e"
+        "eth:0x5D973Ea995d14799E528B14472346bfDE21eAe2e"
      values.$members.1:
-        "0xc1f4D15C16A1f3555E0a5F7AeFD1e17AD4aaf40B"
+        "eth:0xc1f4D15C16A1f3555E0a5F7AeFD1e17AD4aaf40B"
      values.$members.2:
-        "0x94561e98DD5E55271f91A103e4979aa6C493745E"
+        "eth:0x94561e98DD5E55271f91A103e4979aa6C493745E"
      values.$members.3:
-        "0xc31C4549356d46c37021393EeEb6f704B38061eC"
+        "eth:0xc31C4549356d46c37021393EeEb6f704B38061eC"
      implementationNames.0xf152Abda9E4ce8b134eF22Dc3C6aCe19C4895D82:
-        "GnosisSafeProxy"
      implementationNames.0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552:
-        "GnosisSafe"
      implementationNames.eth:0xf152Abda9E4ce8b134eF22Dc3C6aCe19C4895D82:
+        "GnosisSafeProxy"
      implementationNames.eth:0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552:
+        "GnosisSafe"
    }
```

```diff
    contract SequencerInbox (0xF4Ef823D57819AC7202a081A5B49376BD28E7b3a) {
    +++ description: A sequencer (registered in this contract) can submit transaction batches or commitments here.
      address:
-        "0xF4Ef823D57819AC7202a081A5B49376BD28E7b3a"
+        "eth:0xF4Ef823D57819AC7202a081A5B49376BD28E7b3a"
      values.$admin:
-        "0x74C717C01425eb475A5fC55d2A4a9045fC9800df"
+        "eth:0x74C717C01425eb475A5fC55d2A4a9045fC9800df"
      values.$implementation:
-        "0xa5E09FfA33dd011F5B68aAA55F513D6773579f78"
+        "eth:0xa5E09FfA33dd011F5B68aAA55F513D6773579f78"
      values.$pastUpgrades.0.2.0:
-        "0x873484Ba63353C8b71210ce123B465512d408B27"
+        "eth:0x873484Ba63353C8b71210ce123B465512d408B27"
      values.$pastUpgrades.1.2.0:
-        "0x57411f5BA52531e8199066bC8EC650470A744883"
+        "eth:0x57411f5BA52531e8199066bC8EC650470A744883"
      values.$pastUpgrades.2.2.0:
-        "0xa5E09FfA33dd011F5B68aAA55F513D6773579f78"
+        "eth:0xa5E09FfA33dd011F5B68aAA55F513D6773579f78"
      values.batchPosterManager:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      values.batchPosters.0:
-        "0xe27f3f6db6824def1738b2aACe2672aC59046a39"
+        "eth:0xe27f3f6db6824def1738b2aACe2672aC59046a39"
      values.bridge:
-        "0x859a53Fe2C8DA961387030E7CB498D6D20d0B2DB"
+        "eth:0x859a53Fe2C8DA961387030E7CB498D6D20d0B2DB"
      values.reader4844:
-        "0x9098e513950bC43184d39F4E283ECa137A3AF247"
+        "eth:0x9098e513950bC43184d39F4E283ECa137A3AF247"
      values.rollup:
-        "0x5073dA9cA4810f3E0aA01c20c7d9d02C3f522e11"
+        "eth:0x5073dA9cA4810f3E0aA01c20c7d9d02C3f522e11"
      implementationNames.0xF4Ef823D57819AC7202a081A5B49376BD28E7b3a:
-        "TransparentUpgradeableProxy"
      implementationNames.0xa5E09FfA33dd011F5B68aAA55F513D6773579f78:
-        "SequencerInbox"
      implementationNames.eth:0xF4Ef823D57819AC7202a081A5B49376BD28E7b3a:
+        "TransparentUpgradeableProxy"
      implementationNames.eth:0xa5E09FfA33dd011F5B68aAA55F513D6773579f78:
+        "SequencerInbox"
    }
```

```diff
+   Status: CREATED
    contract Bridger (0x0f1b7bd7762662B23486320AA91F30312184f70C)
    +++ description: Bridger gateway that can swap assets to 'L2 final assets' defined by the admin before bridging them to the L2. It does not have a function to bridge via the canonical bridge and uses the external socket bridge by default.
```

```diff
+   Status: CREATED
    contract Kinto Security Council (0x17Eb10e12a78f986C78F973Fc70eD88072B33B7d)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ValidatorUtils (0x2b0E04Dc90e3fA58165CB41E2834B44A56E766aF)
    +++ description: This contract implements view only utilities for validators.
```

```diff
+   Status: CREATED
    contract OneStepProver0 (0x2C1e1A31d2bC26f7BE3CAB5Cb0806641847B3C59)
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
```

```diff
+   Status: CREATED
    contract RollupProxy (0x5073dA9cA4810f3E0aA01c20c7d9d02C3f522e11)
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
```

```diff
+   Status: CREATED
    contract RollupEventInbox (0x52EcE832AF3DF3125BbfD6423E0425dB3fA99D3F)
    +++ description: Helper contract sending configuration data over the bridge during the systems initialization.
```

```diff
+   Status: CREATED
    contract OneStepProverHostIo (0x551E2501074D80E22c5FfB69b5fd8ba2939593b7)
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
```

```diff
+   Status: CREATED
    contract UpgradeExecutor (0x59B851c8b1643e0735Ec3F2f0e528f3d89c3408a)
    +++ description: Central contract defining the access control permissions for upgrading the system contract implementations.
```

```diff
+   Status: CREATED
    contract ChallengeManager (0x6228e2FB8C561f1a5A963039Bc38Eb6D539A1A7F)
    +++ description: Contract that allows challenging state roots. Can be called through the RollupProxy by Validators or the UpgradeExecutor.
```

```diff
+   Status: CREATED
    contract Outbox (0x655761AD5FC251F414D6993A73184B0669F278c8)
    +++ description: Facilitates L2 to L1 contract calls: Messages initiated from L2 (for example withdrawal messages) eventually resolve in execution on L1.
```

```diff
+   Status: CREATED
    contract ProxyAdmin (0x74C717C01425eb475A5fC55d2A4a9045fC9800df)
    +++ description: None
```

```diff
+   Status: CREATED
    contract OneStepProverMemory (0x778ca912Bd8b35dDA84852B47BA8624e08f640A6)
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
```

```diff
+   Status: CREATED
    contract ERC20Gateway (0x7870D5398DB488c669B406fBE57b8d05b6A35e42)
    +++ description: Escrows deposited ERC-20 assets for the canonical Bridge. Upon depositing, a generic token representation will be minted at the destination. Withdrawals are initiated by the Outbox contract.
```

```diff
+   Status: CREATED
    contract Bridge (0x859a53Fe2C8DA961387030E7CB498D6D20d0B2DB)
    +++ description: Escrow contract for the project's gas token (can be different from ETH). Keeps a list of allowed Inboxes and Outboxes for canonical bridge messaging.
```

```diff
+   Status: CREATED
    contract OneStepProverMath (0xacED35d61f71A804E7627b5622c267C8Ac31d38e)
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
```

```diff
+   Status: CREATED
    contract Inbox (0xBFfaA85c1756472fFC37e6D172A7eC0538C14474)
    +++ description: Facilitates sending L1 to L2 messages like depositing ETH, but does not escrow funds.
```

```diff
+   Status: CREATED
    contract GatewayRouter (0xD9041DeCaDcBA88844b373e7053B4AC7A3390D60)
    +++ description: This routing contract maps tokens to the correct escrow (gateway) to be then bridged with canonical messaging.
```

```diff
+   Status: CREATED
    contract Turnkey Multisig (0xD98B32e5D0Dcb5853e498225a15447a59b7a40e1)
    +++ description: None
```

```diff
+   Status: CREATED
    contract OneStepProofEntry (0xEd696D87C351C2ef687c1c484c3e297B276a40d1)
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
```

```diff
+   Status: CREATED
    contract Kinto Multisig (0xf152Abda9E4ce8b134eF22Dc3C6aCe19C4895D82)
    +++ description: None
```

```diff
+   Status: CREATED
    contract SequencerInbox (0xF4Ef823D57819AC7202a081A5B49376BD28E7b3a)
    +++ description: A sequencer (registered in this contract) can submit transaction batches or commitments here.
```

Generated with discovered.json: 0xacd6b76e90149f6fd163a966f202893da69840e3

# Diff at Mon, 14 Jul 2025 12:46:55 GMT:

- chain: kinto
- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@9f4300dad2f3d080cd56fa311d4a848556c74e72 block: 884077
- current block number: 884077

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 884077 (main branch discovery), not current.

```diff
    contract NioGuardians (0x0100005D52Be9ab3ccE0C70Abf6F6FA2C48e91C9) {
    +++ description: Contract using NFTs as voting tokens to be used by Nio Guardians in the NioGovernor.
      address:
-        "0x0100005D52Be9ab3ccE0C70Abf6F6FA2C48e91C9"
+        "kinto:0x0100005D52Be9ab3ccE0C70Abf6F6FA2C48e91C9"
      values.eip712Domain.verifyingContract:
-        "0x0100005D52Be9ab3ccE0C70Abf6F6FA2C48e91C9"
+        "kinto:0x0100005D52Be9ab3ccE0C70Abf6F6FA2C48e91C9"
      values.owner:
-        "0x2e2B1c42E38f5af81771e65D87729E57ABD1337a"
+        "kinto:0x2e2B1c42E38f5af81771e65D87729E57ABD1337a"
      implementationNames.0x0100005D52Be9ab3ccE0C70Abf6F6FA2C48e91C9:
-        "NioGuardians"
      implementationNames.kinto:0x0100005D52Be9ab3ccE0C70Abf6F6FA2C48e91C9:
+        "NioGuardians"
    }
```

```diff
    contract NioGovernor (0x010600ff5f36C8eF3b6Aaf2A88C2DE85C798594a) {
    +++ description: Governance contract allowing token- and NFT based voting.
      address:
-        "0x010600ff5f36C8eF3b6Aaf2A88C2DE85C798594a"
+        "kinto:0x010600ff5f36C8eF3b6Aaf2A88C2DE85C798594a"
      values.accessManager:
-        "0xacC000818e5Bbd911D5d449aA81CB5cA24024739"
+        "kinto:0xacC000818e5Bbd911D5d449aA81CB5cA24024739"
      values.eip712Domain.verifyingContract:
-        "0x010600ff5f36C8eF3b6Aaf2A88C2DE85C798594a"
+        "kinto:0x010600ff5f36C8eF3b6Aaf2A88C2DE85C798594a"
      values.token:
-        "0x0100005D52Be9ab3ccE0C70Abf6F6FA2C48e91C9"
+        "kinto:0x0100005D52Be9ab3ccE0C70Abf6F6FA2C48e91C9"
      implementationNames.0x010600ff5f36C8eF3b6Aaf2A88C2DE85C798594a:
-        "NioGovernor"
      implementationNames.kinto:0x010600ff5f36C8eF3b6Aaf2A88C2DE85C798594a:
+        "NioGovernor"
    }
```

```diff
    contract Faucet (0x0719D47A213149E2Ef8d3f5afDaDA8a8E22dfc03) {
    +++ description: None
      address:
-        "0x0719D47A213149E2Ef8d3f5afDaDA8a8E22dfc03"
+        "kinto:0x0719D47A213149E2Ef8d3f5afDaDA8a8E22dfc03"
      values.$admin:
-        "0x2e2B1c42E38f5af81771e65D87729E57ABD1337a"
+        "kinto:0x2e2B1c42E38f5af81771e65D87729E57ABD1337a"
      values.$implementation:
-        "0x6F04c790db5e6Cc7c041E1B8a9440a5045dFC550"
+        "kinto:0x6F04c790db5e6Cc7c041E1B8a9440a5045dFC550"
      values.$pastUpgrades.0.2.0:
-        "0xB2f4c8E6D336DB09731A4D08BC087838b4841b06"
+        "kinto:0xB2f4c8E6D336DB09731A4D08BC087838b4841b06"
      values.$pastUpgrades.1.2.0:
-        "0xa0BB7432357634e66b9F56AED03e46c4abfFea49"
+        "kinto:0xa0BB7432357634e66b9F56AED03e46c4abfFea49"
      values.$pastUpgrades.2.2.0:
-        "0xAF79b543191C95df73B0332F449B59499162A8C3"
+        "kinto:0xAF79b543191C95df73B0332F449B59499162A8C3"
      values.$pastUpgrades.3.2.0:
-        "0x8202A71c1fD197d87081Afb056AA972C5B1d6d6c"
+        "kinto:0x8202A71c1fD197d87081Afb056AA972C5B1d6d6c"
      values.$pastUpgrades.4.2.0:
-        "0x8202A71c1fD197d87081Afb056AA972C5B1d6d6c"
+        "kinto:0x8202A71c1fD197d87081Afb056AA972C5B1d6d6c"
      values.$pastUpgrades.5.2.0:
-        "0xE0BE7E3696E284B56c285533690a76142226c490"
+        "kinto:0xE0BE7E3696E284B56c285533690a76142226c490"
      values.$pastUpgrades.6.2.0:
-        "0x7eBEDC4a52c0A778f4d8D55c7b4Fe735e224ABD2"
+        "kinto:0x7eBEDC4a52c0A778f4d8D55c7b4Fe735e224ABD2"
      values.$pastUpgrades.7.2.0:
-        "0x37783d44BfB9F1A012890EfA37D36098DC14C0cf"
+        "kinto:0x37783d44BfB9F1A012890EfA37D36098DC14C0cf"
      values.$pastUpgrades.8.2.0:
-        "0x6F04c790db5e6Cc7c041E1B8a9440a5045dFC550"
+        "kinto:0x6F04c790db5e6Cc7c041E1B8a9440a5045dFC550"
      values.kintoID:
-        "0xf369f78E3A0492CC4e96a90dae0728A38498e9c7"
+        "kinto:0xf369f78E3A0492CC4e96a90dae0728A38498e9c7"
      values.owner:
-        "0x2e2B1c42E38f5af81771e65D87729E57ABD1337a"
+        "kinto:0x2e2B1c42E38f5af81771e65D87729E57ABD1337a"
      values.walletFactory:
-        "0x8a4720488CA32f1223ccFE5A087e250fE3BC5D75"
+        "kinto:0x8a4720488CA32f1223ccFE5A087e250fE3BC5D75"
      implementationNames.0x0719D47A213149E2Ef8d3f5afDaDA8a8E22dfc03:
-        "SoraPFPProxy"
      implementationNames.0x6F04c790db5e6Cc7c041E1B8a9440a5045dFC550:
-        "Faucet"
      implementationNames.kinto:0x0719D47A213149E2Ef8d3f5afDaDA8a8E22dfc03:
+        "SoraPFPProxy"
      implementationNames.kinto:0x6F04c790db5e6Cc7c041E1B8a9440a5045dFC550:
+        "Faucet"
    }
```

```diff
    EOA KintoFoundation (0x08E674c4538caE03B6c05405881dDCd95DcaF5a8) {
    +++ description: None
      address:
-        "0x08E674c4538caE03B6c05405881dDCd95DcaF5a8"
+        "kinto:0x08E674c4538caE03B6c05405881dDCd95DcaF5a8"
    }
```

```diff
    contract SponsorPaymaster (0x1842a4EFf3eFd24c50B63c3CF89cECEe245Fc2bd) {
    +++ description: Paymaster used for user transactions eligible for sponsorship.
      address:
-        "0x1842a4EFf3eFd24c50B63c3CF89cECEe245Fc2bd"
+        "kinto:0x1842a4EFf3eFd24c50B63c3CF89cECEe245Fc2bd"
      values.$admin:
-        "0x2e2B1c42E38f5af81771e65D87729E57ABD1337a"
+        "kinto:0x2e2B1c42E38f5af81771e65D87729E57ABD1337a"
      values.$implementation:
-        "0x2A10b80bE8Ee546C52Fde9b58d65D089C6B929BB"
+        "kinto:0x2A10b80bE8Ee546C52Fde9b58d65D089C6B929BB"
      values.$pastUpgrades.0.2.0:
-        "0x1F9E60e0289b35325B25635B602d515179a7497d"
+        "kinto:0x1F9E60e0289b35325B25635B602d515179a7497d"
      values.$pastUpgrades.1.2.0:
-        "0xD2779fcE8766011c9E71b368786C5e4b4459F42c"
+        "kinto:0xD2779fcE8766011c9E71b368786C5e4b4459F42c"
      values.$pastUpgrades.2.2.0:
-        "0x0Df539ef2a0E0f1902F7D4363A79f55Ed93438b9"
+        "kinto:0x0Df539ef2a0E0f1902F7D4363A79f55Ed93438b9"
      values.$pastUpgrades.3.2.0:
-        "0x77222bdac39671db6C91c7fFc85E0909B76177c8"
+        "kinto:0x77222bdac39671db6C91c7fFc85E0909B76177c8"
      values.$pastUpgrades.4.2.0:
-        "0x2C759Af319BFE4BC6A12f6f64bE4258b223133C8"
+        "kinto:0x2C759Af319BFE4BC6A12f6f64bE4258b223133C8"
      values.$pastUpgrades.5.2.0:
-        "0xf7BbB5840f47499a0d930cF4764DF8e6f7239c55"
+        "kinto:0xf7BbB5840f47499a0d930cF4764DF8e6f7239c55"
      values.$pastUpgrades.6.2.0:
-        "0x8Fbd7D4e90C442172C2fD6bCB6d78C51D22C1557"
+        "kinto:0x8Fbd7D4e90C442172C2fD6bCB6d78C51D22C1557"
      values.$pastUpgrades.7.2.0:
-        "0x3515c8Ff44d5887768757371a0A031D06a3A6E7B"
+        "kinto:0x3515c8Ff44d5887768757371a0A031D06a3A6E7B"
      values.$pastUpgrades.8.2.0:
-        "0xEc6ec58fA1E78a488cd3975C0400D2CEa73f965f"
+        "kinto:0xEc6ec58fA1E78a488cd3975C0400D2CEa73f965f"
      values.$pastUpgrades.9.2.0:
-        "0x625D89063092d340B3F87C927DBc3d1a104E3d81"
+        "kinto:0x625D89063092d340B3F87C927DBc3d1a104E3d81"
      values.$pastUpgrades.10.2.0:
-        "0xAbB778766dea552533F2110A9FAE13f856108195"
+        "kinto:0xAbB778766dea552533F2110A9FAE13f856108195"
      values.$pastUpgrades.11.2.0:
-        "0x651c678A27edFC767a66b7C5db47d5e9d769DE6c"
+        "kinto:0x651c678A27edFC767a66b7C5db47d5e9d769DE6c"
      values.$pastUpgrades.12.2.0:
-        "0x4688f73064b7F13ED71861503ebfAe1D6B633486"
+        "kinto:0x4688f73064b7F13ED71861503ebfAe1D6B633486"
      values.$pastUpgrades.13.2.0:
-        "0xcbb3BA88bFD944860463585A557022fceE3Cc280"
+        "kinto:0xcbb3BA88bFD944860463585A557022fceE3Cc280"
      values.$pastUpgrades.14.2.0:
-        "0x2A10b80bE8Ee546C52Fde9b58d65D089C6B929BB"
+        "kinto:0x2A10b80bE8Ee546C52Fde9b58d65D089C6B929BB"
      values.appRegistry:
-        "0x5A2b641b84b0230C8e75F55d5afd27f4Dbd59d5b"
+        "kinto:0x5A2b641b84b0230C8e75F55d5afd27f4Dbd59d5b"
      values.entryPoint:
-        "0x2843C269D2a64eCfA63548E8B3Fc0FD23B7F70cb"
+        "kinto:0x2843C269D2a64eCfA63548E8B3Fc0FD23B7F70cb"
      values.kintoID:
-        "0xf369f78E3A0492CC4e96a90dae0728A38498e9c7"
+        "kinto:0xf369f78E3A0492CC4e96a90dae0728A38498e9c7"
      values.owner:
-        "0x2e2B1c42E38f5af81771e65D87729E57ABD1337a"
+        "kinto:0x2e2B1c42E38f5af81771e65D87729E57ABD1337a"
      values.walletFactory:
-        "0x8a4720488CA32f1223ccFE5A087e250fE3BC5D75"
+        "kinto:0x8a4720488CA32f1223ccFE5A087e250fE3BC5D75"
      implementationNames.0x1842a4EFf3eFd24c50B63c3CF89cECEe245Fc2bd:
-        "BlitkinProxy"
      implementationNames.0x2A10b80bE8Ee546C52Fde9b58d65D089C6B929BB:
-        "SponsorPaymaster"
      implementationNames.kinto:0x1842a4EFf3eFd24c50B63c3CF89cECEe245Fc2bd:
+        "BlitkinProxy"
      implementationNames.kinto:0x2A10b80bE8Ee546C52Fde9b58d65D089C6B929BB:
+        "SponsorPaymaster"
    }
```

```diff
    contract EntryPoint (0x2843C269D2a64eCfA63548E8B3Fc0FD23B7F70cb) {
    +++ description: Used as entrypoint to transact using smartwallets and UserOps.
      address:
-        "0x2843C269D2a64eCfA63548E8B3Fc0FD23B7F70cb"
+        "kinto:0x2843C269D2a64eCfA63548E8B3Fc0FD23B7F70cb"
      values.walletFactory:
-        "0x8a4720488CA32f1223ccFE5A087e250fE3BC5D75"
+        "kinto:0x8a4720488CA32f1223ccFE5A087e250fE3BC5D75"
      implementationNames.0x2843C269D2a64eCfA63548E8B3Fc0FD23B7F70cb:
-        "EntryPoint"
      implementationNames.kinto:0x2843C269D2a64eCfA63548E8B3Fc0FD23B7F70cb:
+        "EntryPoint"
    }
```

```diff
    EOA KintoSecurityCouncil_L2Alias (0x28fC10E12A78f986c78F973Fc70ED88072b34c8e) {
    +++ description: None
      address:
-        "0x28fC10E12A78f986c78F973Fc70ED88072b34c8e"
+        "kinto:0x28fC10E12A78f986c78F973Fc70ED88072b34c8e"
    }
```

```diff
    contract Kinto Multisig 2 (0x2e2B1c42E38f5af81771e65D87729E57ABD1337a) {
    +++ description: None
      address:
-        "0x2e2B1c42E38f5af81771e65D87729E57ABD1337a"
+        "kinto:0x2e2B1c42E38f5af81771e65D87729E57ABD1337a"
      values.$admin:
-        "0x8a4720488CA32f1223ccFE5A087e250fE3BC5D75"
+        "kinto:0x8a4720488CA32f1223ccFE5A087e250fE3BC5D75"
      values.$beacon:
-        "0x87f0eE85bF3198654900a422832157abBba30828"
+        "kinto:0x87f0eE85bF3198654900a422832157abBba30828"
      values.$implementation:
-        "0xbFE260680514e0D669fdC5A5f7334b97a5513d9D"
+        "kinto:0xbFE260680514e0D669fdC5A5f7334b97a5513d9D"
      values.$members.0:
-        "0x660ad4B5A74130a4796B4d54BC6750Ae93C86e6c"
+        "kinto:0x660ad4B5A74130a4796B4d54BC6750Ae93C86e6c"
      values.$members.1:
-        "0xc1f4D15C16A1f3555E0a5F7AeFD1e17AD4aaf40B"
+        "kinto:0xc1f4D15C16A1f3555E0a5F7AeFD1e17AD4aaf40B"
      values.$members.2:
-        "0x08E674c4538caE03B6c05405881dDCd95DcaF5a8"
+        "kinto:0x08E674c4538caE03B6c05405881dDCd95DcaF5a8"
      values.$members.3:
-        "0x94561e98DD5E55271f91A103e4979aa6C493745E"
+        "kinto:0x94561e98DD5E55271f91A103e4979aa6C493745E"
      values.$pastUpgrades.0.2.0:
-        "0xd87FB0bF3c38f216bD1604bFa4d262F95409227d"
+        "kinto:0xd87FB0bF3c38f216bD1604bFa4d262F95409227d"
      values.$pastUpgrades.1.2.0:
-        "0x893B0AeA9C45FA8d3b0FBbebd03d4220B9514599"
+        "kinto:0x893B0AeA9C45FA8d3b0FBbebd03d4220B9514599"
      values.$pastUpgrades.2.2.0:
-        "0xAe84C7E23240Dc11f0B2711C20aEDE81E5a28fF2"
+        "kinto:0xAe84C7E23240Dc11f0B2711C20aEDE81E5a28fF2"
      values.$pastUpgrades.3.2.0:
-        "0x9dd64eA97fFFB2CbCd9ea87b9082250Be50FC820"
+        "kinto:0x9dd64eA97fFFB2CbCd9ea87b9082250Be50FC820"
      values.$pastUpgrades.4.2.0:
-        "0x5248F94285c737Cd088c4d25bd68D45AFA258039"
+        "kinto:0x5248F94285c737Cd088c4d25bd68D45AFA258039"
      values.$pastUpgrades.5.2.0:
-        "0xA6ddF426008E8b7f1a70237bdEfafB5D928bA72E"
+        "kinto:0xA6ddF426008E8b7f1a70237bdEfafB5D928bA72E"
      values.$pastUpgrades.6.2.0:
-        "0xcF4046C914BB8E437ED07C6FD755f58f430C4DA6"
+        "kinto:0xcF4046C914BB8E437ED07C6FD755f58f430C4DA6"
      values.$pastUpgrades.7.2.0:
-        "0xe761f7d13d6e6D70848fcD2E6bAc211db3741BA6"
+        "kinto:0xe761f7d13d6e6D70848fcD2E6bAc211db3741BA6"
      values.$pastUpgrades.8.2.0:
-        "0xF75dAc825E27f1A146fbd5e18681892D5cbca9E8"
+        "kinto:0xF75dAc825E27f1A146fbd5e18681892D5cbca9E8"
      values.$pastUpgrades.9.2.0:
-        "0x1d1E45adFA23457be2A595601F993d8826f11D38"
+        "kinto:0x1d1E45adFA23457be2A595601F993d8826f11D38"
      values.$pastUpgrades.10.2.0:
-        "0xf411E206370B731D5461c6c70657aDC71F5aEF38"
+        "kinto:0xf411E206370B731D5461c6c70657aDC71F5aEF38"
      values.$pastUpgrades.11.2.0:
-        "0x43Ab055B44327EF3424b51e974960840d721e4D8"
+        "kinto:0x43Ab055B44327EF3424b51e974960840d721e4D8"
      values.$pastUpgrades.12.2.0:
-        "0x421459c9af07ccCadf6BCA52319835c2Bfb117e2"
+        "kinto:0x421459c9af07ccCadf6BCA52319835c2Bfb117e2"
      values.$pastUpgrades.13.2.0:
-        "0x8E495c2d6Be781Bd668632AA387e3e1027E80240"
+        "kinto:0x8E495c2d6Be781Bd668632AA387e3e1027E80240"
      values.$pastUpgrades.14.2.0:
-        "0x3deAbC32b749b95Df9B125822cCb123757c4d4F1"
+        "kinto:0x3deAbC32b749b95Df9B125822cCb123757c4d4F1"
      values.$pastUpgrades.15.2.0:
-        "0xa7040b6Ed2fC09C7485AA6A89fb2C320E2A739c3"
+        "kinto:0xa7040b6Ed2fC09C7485AA6A89fb2C320E2A739c3"
      values.$pastUpgrades.16.2.0:
-        "0xe1FcA7f6d88E30914089b600A73eeF72eaC7f601"
+        "kinto:0xe1FcA7f6d88E30914089b600A73eeF72eaC7f601"
      values.$pastUpgrades.17.2.0:
-        "0x3Ff8593329364dCDC7272fAcb853c8FeC2929B03"
+        "kinto:0x3Ff8593329364dCDC7272fAcb853c8FeC2929B03"
      values.$pastUpgrades.18.2.0:
-        "0xa158e30099C6F7D9546eF2a519F2118E46039307"
+        "kinto:0xa158e30099C6F7D9546eF2a519F2118E46039307"
      values.$pastUpgrades.19.2.0:
-        "0x2D669eB24988863aA0efA2D593DD40f174D8977B"
+        "kinto:0x2D669eB24988863aA0efA2D593DD40f174D8977B"
      values.$pastUpgrades.20.2.0:
-        "0x5844A1629fC51439187093eDFd8bBD57109D858D"
+        "kinto:0x5844A1629fC51439187093eDFd8bBD57109D858D"
      values.$pastUpgrades.21.2.0:
-        "0xa54Fe8f99dBB9EB64d7c4E243F3c6aa5De0483Df"
+        "kinto:0xa54Fe8f99dBB9EB64d7c4E243F3c6aa5De0483Df"
      values.$pastUpgrades.22.2.0:
-        "0xaF80B25F650A66F5F8e8bc67697C2160024b6Dcf"
+        "kinto:0xaF80B25F650A66F5F8e8bc67697C2160024b6Dcf"
      values.$pastUpgrades.23.2.0:
-        "0xB6026A3eB7ABee0fee3cAAb7BcfcBd6aDE5f0234"
+        "kinto:0xB6026A3eB7ABee0fee3cAAb7BcfcBd6aDE5f0234"
      values.$pastUpgrades.24.2.0:
-        "0x39aB919098fE67f305d097d76Df0Ae04af5e640b"
+        "kinto:0x39aB919098fE67f305d097d76Df0Ae04af5e640b"
      values.$pastUpgrades.25.2.0:
-        "0xdDB14fAD9060afCA4FC5E1Ec108261B465Df285F"
+        "kinto:0xdDB14fAD9060afCA4FC5E1Ec108261B465Df285F"
      values.$pastUpgrades.26.2.0:
-        "0x867969538512518e358b7b0296c4383f5bae4992"
+        "kinto:0x867969538512518e358b7b0296c4383f5bae4992"
      values.$pastUpgrades.27.2.0:
-        "0xFF41064cC2cF1A76F4FD4f2235c766FDDFb7DCE1"
+        "kinto:0xFF41064cC2cF1A76F4FD4f2235c766FDDFb7DCE1"
      values.$pastUpgrades.28.2.0:
-        "0xC99D77eF43FCA9D491c1f5B900F74649236055C3"
+        "kinto:0xC99D77eF43FCA9D491c1f5B900F74649236055C3"
      values.$pastUpgrades.29.2.0:
-        "0xB15Fc6227FD696C7AD53d25a9fEE6c4831c27b16"
+        "kinto:0xB15Fc6227FD696C7AD53d25a9fEE6c4831c27b16"
      values.$pastUpgrades.30.2.0:
-        "0x667a0A293B6a95841dB5f0Bbf0F02e8e5F71C8e5"
+        "kinto:0x667a0A293B6a95841dB5f0Bbf0F02e8e5F71C8e5"
      values.$pastUpgrades.31.2.0:
-        "0x1161a537aF45f4ca4AD984ECcf4a8E9692Bf2518"
+        "kinto:0x1161a537aF45f4ca4AD984ECcf4a8E9692Bf2518"
      values.$pastUpgrades.32.2.0:
-        "0xE90C1e020D9d2A74045A1365bd5abEe87Aee8D7C"
+        "kinto:0xE90C1e020D9d2A74045A1365bd5abEe87Aee8D7C"
      values.$pastUpgrades.33.2.0:
-        "0xbFE260680514e0D669fdC5A5f7334b97a5513d9D"
+        "kinto:0xbFE260680514e0D669fdC5A5f7334b97a5513d9D"
      values.appRegistry:
-        "0x5A2b641b84b0230C8e75F55d5afd27f4Dbd59d5b"
+        "kinto:0x5A2b641b84b0230C8e75F55d5afd27f4Dbd59d5b"
      values.entryPoint:
-        "0x2843C269D2a64eCfA63548E8B3Fc0FD23B7F70cb"
+        "kinto:0x2843C269D2a64eCfA63548E8B3Fc0FD23B7F70cb"
      values.factory:
-        "0x8a4720488CA32f1223ccFE5A087e250fE3BC5D75"
+        "kinto:0x8a4720488CA32f1223ccFE5A087e250fE3BC5D75"
      values.getAccessPoint:
-        "0x474ec69B0fD5Ebc1EfcFe18B2E8Eb510D755b8C7"
+        "kinto:0x474ec69B0fD5Ebc1EfcFe18B2E8Eb510D755b8C7"
      values.kintoID:
-        "0xf369f78E3A0492CC4e96a90dae0728A38498e9c7"
+        "kinto:0xf369f78E3A0492CC4e96a90dae0728A38498e9c7"
      values.recoverer:
-        "0xc1f4D15C16A1f3555E0a5F7AeFD1e17AD4aaf40B"
+        "kinto:0xc1f4D15C16A1f3555E0a5F7AeFD1e17AD4aaf40B"
      implementationNames.0x2e2B1c42E38f5af81771e65D87729E57ABD1337a:
-        "SafeBeaconProxy"
      implementationNames.0xbFE260680514e0D669fdC5A5f7334b97a5513d9D:
-        "KintoWallet"
      implementationNames.kinto:0x2e2B1c42E38f5af81771e65D87729E57ABD1337a:
+        "SafeBeaconProxy"
      implementationNames.kinto:0xbFE260680514e0D669fdC5A5f7334b97a5513d9D:
+        "KintoWallet"
    }
```

```diff
    contract Socket (0x3e9727470C66B1e77034590926CDe0242B5A3dCc) {
    +++ description: Central contract for bridging via the external socket bridge.
      address:
-        "0x3e9727470C66B1e77034590926CDe0242B5A3dCc"
+        "kinto:0x3e9727470C66B1e77034590926CDe0242B5A3dCc"
      values.capacitorFactory__:
-        "0x35B1Ca86D564e69FA38Ee456C12c78A62e78Aa4c"
+        "kinto:0x35B1Ca86D564e69FA38Ee456C12c78A62e78Aa4c"
      values.executionManager__:
-        "0xc8a4D2fd77c155fd52e65Ab07F337aBF84495Ead"
+        "kinto:0xc8a4D2fd77c155fd52e65Ab07F337aBF84495Ead"
      values.hasher__:
-        "0x9652Dd5e1388CA80712470122F27be0d1c33B48b"
+        "kinto:0x9652Dd5e1388CA80712470122F27be0d1c33B48b"
      values.nominee:
-        "0x0000000000000000000000000000000000000000"
+        "kinto:0x0000000000000000000000000000000000000000"
      values.owner:
-        "0x2e2B1c42E38f5af81771e65D87729E57ABD1337a"
+        "kinto:0x2e2B1c42E38f5af81771e65D87729E57ABD1337a"
      values.transmitManager__:
-        "0x6332e56A423480A211E301Cb85be12814e9238Bb"
+        "kinto:0x6332e56A423480A211E301Cb85be12814e9238Bb"
      implementationNames.0x3e9727470C66B1e77034590926CDe0242B5A3dCc:
-        "Socket"
      implementationNames.kinto:0x3e9727470C66B1e77034590926CDe0242B5A3dCc:
+        "Socket"
    }
```

```diff
    EOA  (0x474ec69B0fD5Ebc1EfcFe18B2E8Eb510D755b8C7) {
    +++ description: None
      address:
-        "0x474ec69B0fD5Ebc1EfcFe18B2E8Eb510D755b8C7"
+        "kinto:0x474ec69B0fD5Ebc1EfcFe18B2E8Eb510D755b8C7"
    }
```

```diff
    EOA  (0x52F09693c9eEaA93A64BA697e3d3e43a1eB65477) {
    +++ description: None
      address:
-        "0x52F09693c9eEaA93A64BA697e3d3e43a1eB65477"
+        "kinto:0x52F09693c9eEaA93A64BA697e3d3e43a1eB65477"
    }
```

```diff
    contract KintoAppRegistry (0x5A2b641b84b0230C8e75F55d5afd27f4Dbd59d5b) {
    +++ description: Central system contract defining addresses that are allowed to be called by EOAs. The modified Kinto node reads this configuration and drops all other transactions from EOAs (enforced by a modified state transition function). As a result, users can only transact using a canonical smart wallet.
      address:
-        "0x5A2b641b84b0230C8e75F55d5afd27f4Dbd59d5b"
+        "kinto:0x5A2b641b84b0230C8e75F55d5afd27f4Dbd59d5b"
      values.$admin:
-        "0xacC000818e5Bbd911D5d449aA81CB5cA24024739"
+        "kinto:0xacC000818e5Bbd911D5d449aA81CB5cA24024739"
      values.$implementation:
-        "0xb9cE6BC89b79c713f34fd15D82a70900fEFD0de1"
+        "kinto:0xb9cE6BC89b79c713f34fd15D82a70900fEFD0de1"
      values.$pastUpgrades.0.2.0:
-        "0xEDA88D4810E14aE4C384369CbC6F1510787Dc4fB"
+        "kinto:0xEDA88D4810E14aE4C384369CbC6F1510787Dc4fB"
      values.$pastUpgrades.1.2.0:
-        "0xA82F30210F7dB1642bc20a5adCECbB16f766435B"
+        "kinto:0xA82F30210F7dB1642bc20a5adCECbB16f766435B"
      values.$pastUpgrades.2.2.0:
-        "0xA82F30210F7dB1642bc20a5adCECbB16f766435B"
+        "kinto:0xA82F30210F7dB1642bc20a5adCECbB16f766435B"
      values.$pastUpgrades.3.2.0:
-        "0x60ce7AF33fB6BCA504058fc1F5BF0bc816AD7Fc1"
+        "kinto:0x60ce7AF33fB6BCA504058fc1F5BF0bc816AD7Fc1"
      values.$pastUpgrades.4.2.0:
-        "0xe1F135742dE49A5A3337A59440b1B7a986F634ea"
+        "kinto:0xe1F135742dE49A5A3337A59440b1B7a986F634ea"
      values.$pastUpgrades.5.2.0:
-        "0x48D2b947B1aa3A23A890dd456a404394fb2F1636"
+        "kinto:0x48D2b947B1aa3A23A890dd456a404394fb2F1636"
      values.$pastUpgrades.6.2.0:
-        "0x2542b185DFed7F6312CFE63eFC4e295DcC2AE154"
+        "kinto:0x2542b185DFed7F6312CFE63eFC4e295DcC2AE154"
      values.$pastUpgrades.7.2.0:
-        "0x4060d0628dda0BD6Cc65ef9cEe3Ac16cc0B41F1e"
+        "kinto:0x4060d0628dda0BD6Cc65ef9cEe3Ac16cc0B41F1e"
      values.$pastUpgrades.8.2.0:
-        "0x476ac3dEEe552acbc5a16f3Cb745C6EF8F597e9d"
+        "kinto:0x476ac3dEEe552acbc5a16f3Cb745C6EF8F597e9d"
      values.$pastUpgrades.9.2.0:
-        "0xdE7d1b7510435F3E849c4158D21788B82d7040D5"
+        "kinto:0xdE7d1b7510435F3E849c4158D21788B82d7040D5"
      values.$pastUpgrades.10.2.0:
-        "0x89C44a887bB582d2E708d6A452f67538b1A71087"
+        "kinto:0x89C44a887bB582d2E708d6A452f67538b1A71087"
      values.$pastUpgrades.11.2.0:
-        "0xe1E48162e1E18e04E6D073884396eFE2964D9225"
+        "kinto:0xe1E48162e1E18e04E6D073884396eFE2964D9225"
      values.$pastUpgrades.12.2.0:
-        "0x628D6a2546c00119aBC35262856B5abF6eea547b"
+        "kinto:0x628D6a2546c00119aBC35262856B5abF6eea547b"
      values.$pastUpgrades.13.2.0:
-        "0xc7e69C953418d746a0aa01b5Ddf12911cE90A27C"
+        "kinto:0xc7e69C953418d746a0aa01b5Ddf12911cE90A27C"
      values.$pastUpgrades.14.2.0:
-        "0xaE0Ed29500fd52311690b56A6FB901843163b7Be"
+        "kinto:0xaE0Ed29500fd52311690b56A6FB901843163b7Be"
      values.$pastUpgrades.15.2.0:
-        "0x9CB3aB22F17223b0A7Ae58BA31CcFf2A3EbE3411"
+        "kinto:0x9CB3aB22F17223b0A7Ae58BA31CcFf2A3EbE3411"
      values.$pastUpgrades.16.2.0:
-        "0xa592FB45C110F1540D1f13D6563Bb8E1a429Ab4a"
+        "kinto:0xa592FB45C110F1540D1f13D6563Bb8E1a429Ab4a"
      values.$pastUpgrades.17.2.0:
-        "0x3D87691B1f887206eAaB7cbfE9Ff067Dc129093B"
+        "kinto:0x3D87691B1f887206eAaB7cbfE9Ff067Dc129093B"
      values.$pastUpgrades.18.2.0:
-        "0xeC00432A044271A906427554906302e6408B5225"
+        "kinto:0xeC00432A044271A906427554906302e6408B5225"
      values.$pastUpgrades.19.2.0:
-        "0x226FCf8657ca310b375a7e23B87092cD1e3af92f"
+        "kinto:0x226FCf8657ca310b375a7e23B87092cD1e3af92f"
      values.$pastUpgrades.20.2.0:
-        "0xb94240Ff4aB45811c550ee3c5Ea19bC692210A29"
+        "kinto:0xb94240Ff4aB45811c550ee3c5Ea19bC692210A29"
      values.$pastUpgrades.21.2.0:
-        "0xb9cE6BC89b79c713f34fd15D82a70900fEFD0de1"
+        "kinto:0xb9cE6BC89b79c713f34fd15D82a70900fEFD0de1"
      values.getApproved.0:
-        "0x0000000000000000000000000000000000000000"
+        "kinto:0x0000000000000000000000000000000000000000"
      values.getApproved.1:
-        "0x0000000000000000000000000000000000000000"
+        "kinto:0x0000000000000000000000000000000000000000"
      values.getApproved.2:
-        "0x0000000000000000000000000000000000000000"
+        "kinto:0x0000000000000000000000000000000000000000"
      values.getApproved.3:
-        "0x0000000000000000000000000000000000000000"
+        "kinto:0x0000000000000000000000000000000000000000"
      values.getReservedContracts.0:
-        "0x2843C269D2a64eCfA63548E8B3Fc0FD23B7F70cb"
+        "kinto:0x2843C269D2a64eCfA63548E8B3Fc0FD23B7F70cb"
      values.getReservedContracts.1:
-        "0x0000000071727De22E5E9d8BAf0edAc6f37da032"
+        "kinto:0x0000000071727De22E5E9d8BAf0edAc6f37da032"
      values.getReservedContracts.2:
-        "0x4e59b44847b379578588920cA78FbF26c0B4956C"
+        "kinto:0x4e59b44847b379578588920cA78FbF26c0B4956C"
      values.getReservedContracts.3:
-        "0xf369f78E3A0492CC4e96a90dae0728A38498e9c7"
+        "kinto:0xf369f78E3A0492CC4e96a90dae0728A38498e9c7"
      values.getReservedContracts.4:
-        "0x8a4720488CA32f1223ccFE5A087e250fE3BC5D75"
+        "kinto:0x8a4720488CA32f1223ccFE5A087e250fE3BC5D75"
      values.getReservedContracts.5:
-        "0x1842a4EFf3eFd24c50B63c3CF89cECEe245Fc2bd"
+        "kinto:0x1842a4EFf3eFd24c50B63c3CF89cECEe245Fc2bd"
      values.getReservedContracts.6:
-        "0x5A2b641b84b0230C8e75F55d5afd27f4Dbd59d5b"
+        "kinto:0x5A2b641b84b0230C8e75F55d5afd27f4Dbd59d5b"
      values.getReservedContracts.7:
-        "0x88e03D41a6EAA9A0B93B0e2d6F1B34619cC4319b"
+        "kinto:0x88e03D41a6EAA9A0B93B0e2d6F1B34619cC4319b"
      values.getReservedContracts.8:
-        "0x06FcD8264caF5c28D86eb4630c20004aa1faAaA8"
+        "kinto:0x06FcD8264caF5c28D86eb4630c20004aa1faAaA8"
      values.getReservedContracts.9:
-        "0x340487b92808B84c2bd97C87B590EE81267E04a7"
+        "kinto:0x340487b92808B84c2bd97C87B590EE81267E04a7"
      values.getReservedContracts.10:
-        "0x87799989341A07F495287B1433eea98398FD73aA"
+        "kinto:0x87799989341A07F495287B1433eea98398FD73aA"
      values.getReservedContracts.11:
-        "0xd563ECBDF90EBA783d0a218EFf158C1263ad02BE"
+        "kinto:0xd563ECBDF90EBA783d0a218EFf158C1263ad02BE"
      values.getReservedContracts.12:
-        "0x8d2D899402ed84b6c0510bB1ad34ee436ADDD20d"
+        "kinto:0x8d2D899402ed84b6c0510bB1ad34ee436ADDD20d"
      values.getReservedContracts.13:
-        "0x000000000000000000000000000000000000006E"
+        "kinto:0x000000000000000000000000000000000000006E"
      values.getReservedContracts.14:
-        "0x000000000000000000000000000000000000006D"
+        "kinto:0x000000000000000000000000000000000000006D"
      values.getReservedContracts.15:
-        "0x000000000000000000000000000000000000006C"
+        "kinto:0x000000000000000000000000000000000000006C"
      values.getReservedContracts.16:
-        "0x0000000000000000000000000000000000000064"
+        "kinto:0x0000000000000000000000000000000000000064"
      values.getReservedContracts.17:
-        "0x0000000000000000000000000000000000000066"
+        "kinto:0x0000000000000000000000000000000000000066"
      values.getReservedContracts.18:
-        "0x00000000000000000000000000000000000000ff"
+        "kinto:0x00000000000000000000000000000000000000ff"
      values.getReservedContracts.19:
-        "0x0000000000000000000000000000000000000068"
+        "kinto:0x0000000000000000000000000000000000000068"
      values.getReservedContracts.20:
-        "0x0000000000000000000000000000000000000065"
+        "kinto:0x0000000000000000000000000000000000000065"
      values.getReservedContracts.21:
-        "0x0000000000000000000000000000000000000070"
+        "kinto:0x0000000000000000000000000000000000000070"
      values.getReservedContracts.22:
-        "0x000000000000000000000000000000000000006b"
+        "kinto:0x000000000000000000000000000000000000006b"
      values.getReservedContracts.23:
-        "0x0000000000000000000000000000000000000069"
+        "kinto:0x0000000000000000000000000000000000000069"
      values.getReservedContracts.24:
-        "0x0000000000000000000000000000000000000069"
+        "kinto:0x0000000000000000000000000000000000000069"
      values.getSystemApps.0:
-        "0x3e9727470C66B1e77034590926CDe0242B5A3dCc"
+        "kinto:0x3e9727470C66B1e77034590926CDe0242B5A3dCc"
      values.getSystemApps.1:
-        "0xD157904639E89df05e89e0DabeEC99aE3d74F9AA"
+        "kinto:0xD157904639E89df05e89e0DabeEC99aE3d74F9AA"
+++ description: Target contracts that are exempt from the STF-enforced rule that EOAs cannot make transactions. Must include ArbRetryableTx `0x000000000000000000000000000000000000006E`, EntryPoint `0x2843C269D2a64eCfA63548E8B3Fc0FD23B7F70cb`, ArbSys `0x0000000000000000000000000000000000000064`.
+++ severity: HIGH
      values.getSystemContracts.0:
-        "0x5A2b641b84b0230C8e75F55d5afd27f4Dbd59d5b"
+        "kinto:0x5A2b641b84b0230C8e75F55d5afd27f4Dbd59d5b"
+++ description: Target contracts that are exempt from the STF-enforced rule that EOAs cannot make transactions. Must include ArbRetryableTx `0x000000000000000000000000000000000000006E`, EntryPoint `0x2843C269D2a64eCfA63548E8B3Fc0FD23B7F70cb`, ArbSys `0x0000000000000000000000000000000000000064`.
+++ severity: HIGH
      values.getSystemContracts.1:
-        "0x2843C269D2a64eCfA63548E8B3Fc0FD23B7F70cb"
+        "kinto:0x2843C269D2a64eCfA63548E8B3Fc0FD23B7F70cb"
+++ description: Target contracts that are exempt from the STF-enforced rule that EOAs cannot make transactions. Must include ArbRetryableTx `0x000000000000000000000000000000000000006E`, EntryPoint `0x2843C269D2a64eCfA63548E8B3Fc0FD23B7F70cb`, ArbSys `0x0000000000000000000000000000000000000064`.
+++ severity: HIGH
      values.getSystemContracts.2:
-        "0x0000000071727De22E5E9d8BAf0edAc6f37da032"
+        "kinto:0x0000000071727De22E5E9d8BAf0edAc6f37da032"
+++ description: Target contracts that are exempt from the STF-enforced rule that EOAs cannot make transactions. Must include ArbRetryableTx `0x000000000000000000000000000000000000006E`, EntryPoint `0x2843C269D2a64eCfA63548E8B3Fc0FD23B7F70cb`, ArbSys `0x0000000000000000000000000000000000000064`.
+++ severity: HIGH
      values.getSystemContracts.3:
-        "0x000000000000000000000000000000000000006E"
+        "kinto:0x000000000000000000000000000000000000006E"
+++ description: Target contracts that are exempt from the STF-enforced rule that EOAs cannot make transactions. Must include ArbRetryableTx `0x000000000000000000000000000000000000006E`, EntryPoint `0x2843C269D2a64eCfA63548E8B3Fc0FD23B7F70cb`, ArbSys `0x0000000000000000000000000000000000000064`.
+++ severity: HIGH
      values.getSystemContracts.4:
-        "0x1842a4EFf3eFd24c50B63c3CF89cECEe245Fc2bd"
+        "kinto:0x1842a4EFf3eFd24c50B63c3CF89cECEe245Fc2bd"
+++ description: Target contracts that are exempt from the STF-enforced rule that EOAs cannot make transactions. Must include ArbRetryableTx `0x000000000000000000000000000000000000006E`, EntryPoint `0x2843C269D2a64eCfA63548E8B3Fc0FD23B7F70cb`, ArbSys `0x0000000000000000000000000000000000000064`.
+++ severity: HIGH
      values.getSystemContracts.5:
-        "0xf369f78E3A0492CC4e96a90dae0728A38498e9c7"
+        "kinto:0xf369f78E3A0492CC4e96a90dae0728A38498e9c7"
+++ description: Target contracts that are exempt from the STF-enforced rule that EOAs cannot make transactions. Must include ArbRetryableTx `0x000000000000000000000000000000000000006E`, EntryPoint `0x2843C269D2a64eCfA63548E8B3Fc0FD23B7F70cb`, ArbSys `0x0000000000000000000000000000000000000064`.
+++ severity: HIGH
      values.getSystemContracts.6:
-        "0x8a4720488CA32f1223ccFE5A087e250fE3BC5D75"
+        "kinto:0x8a4720488CA32f1223ccFE5A087e250fE3BC5D75"
+++ description: Target contracts that are exempt from the STF-enforced rule that EOAs cannot make transactions. Must include ArbRetryableTx `0x000000000000000000000000000000000000006E`, EntryPoint `0x2843C269D2a64eCfA63548E8B3Fc0FD23B7F70cb`, ArbSys `0x0000000000000000000000000000000000000064`.
+++ severity: HIGH
      values.getSystemContracts.7:
-        "0x5A2b641b84b0230C8e75F55d5afd27f4Dbd59d5b"
+        "kinto:0x5A2b641b84b0230C8e75F55d5afd27f4Dbd59d5b"
+++ description: Target contracts that are exempt from the STF-enforced rule that EOAs cannot make transactions. Must include ArbRetryableTx `0x000000000000000000000000000000000000006E`, EntryPoint `0x2843C269D2a64eCfA63548E8B3Fc0FD23B7F70cb`, ArbSys `0x0000000000000000000000000000000000000064`.
+++ severity: HIGH
      values.getSystemContracts.8:
-        "0x88e03D41a6EAA9A0B93B0e2d6F1B34619cC4319b"
+        "kinto:0x88e03D41a6EAA9A0B93B0e2d6F1B34619cC4319b"
+++ description: Target contracts that are exempt from the STF-enforced rule that EOAs cannot make transactions. Must include ArbRetryableTx `0x000000000000000000000000000000000000006E`, EntryPoint `0x2843C269D2a64eCfA63548E8B3Fc0FD23B7F70cb`, ArbSys `0x0000000000000000000000000000000000000064`.
+++ severity: HIGH
      values.getSystemContracts.9:
-        "0x06FcD8264caF5c28D86eb4630c20004aa1faAaA8"
+        "kinto:0x06FcD8264caF5c28D86eb4630c20004aa1faAaA8"
+++ description: Target contracts that are exempt from the STF-enforced rule that EOAs cannot make transactions. Must include ArbRetryableTx `0x000000000000000000000000000000000000006E`, EntryPoint `0x2843C269D2a64eCfA63548E8B3Fc0FD23B7F70cb`, ArbSys `0x0000000000000000000000000000000000000064`.
+++ severity: HIGH
      values.getSystemContracts.10:
-        "0x340487b92808B84c2bd97C87B590EE81267E04a7"
+        "kinto:0x340487b92808B84c2bd97C87B590EE81267E04a7"
+++ description: Target contracts that are exempt from the STF-enforced rule that EOAs cannot make transactions. Must include ArbRetryableTx `0x000000000000000000000000000000000000006E`, EntryPoint `0x2843C269D2a64eCfA63548E8B3Fc0FD23B7F70cb`, ArbSys `0x0000000000000000000000000000000000000064`.
+++ severity: HIGH
      values.getSystemContracts.11:
-        "0x87799989341A07F495287B1433eea98398FD73aA"
+        "kinto:0x87799989341A07F495287B1433eea98398FD73aA"
+++ description: Target contracts that are exempt from the STF-enforced rule that EOAs cannot make transactions. Must include ArbRetryableTx `0x000000000000000000000000000000000000006E`, EntryPoint `0x2843C269D2a64eCfA63548E8B3Fc0FD23B7F70cb`, ArbSys `0x0000000000000000000000000000000000000064`.
+++ severity: HIGH
      values.getSystemContracts.12:
-        "0xd563ECBDF90EBA783d0a218EFf158C1263ad02BE"
+        "kinto:0xd563ECBDF90EBA783d0a218EFf158C1263ad02BE"
+++ description: Target contracts that are exempt from the STF-enforced rule that EOAs cannot make transactions. Must include ArbRetryableTx `0x000000000000000000000000000000000000006E`, EntryPoint `0x2843C269D2a64eCfA63548E8B3Fc0FD23B7F70cb`, ArbSys `0x0000000000000000000000000000000000000064`.
+++ severity: HIGH
      values.getSystemContracts.13:
-        "0x8d2D899402ed84b6c0510bB1ad34ee436ADDD20d"
+        "kinto:0x8d2D899402ed84b6c0510bB1ad34ee436ADDD20d"
+++ description: Target contracts that are exempt from the STF-enforced rule that EOAs cannot make transactions. Must include ArbRetryableTx `0x000000000000000000000000000000000000006E`, EntryPoint `0x2843C269D2a64eCfA63548E8B3Fc0FD23B7F70cb`, ArbSys `0x0000000000000000000000000000000000000064`.
+++ severity: HIGH
      values.getSystemContracts.14:
-        "0x000000000000000000000000000000000000006E"
+        "kinto:0x000000000000000000000000000000000000006E"
+++ description: Target contracts that are exempt from the STF-enforced rule that EOAs cannot make transactions. Must include ArbRetryableTx `0x000000000000000000000000000000000000006E`, EntryPoint `0x2843C269D2a64eCfA63548E8B3Fc0FD23B7F70cb`, ArbSys `0x0000000000000000000000000000000000000064`.
+++ severity: HIGH
      values.getSystemContracts.15:
-        "0x4e59b44847b379578588920cA78FbF26c0B4956C"
+        "kinto:0x4e59b44847b379578588920cA78FbF26c0B4956C"
+++ description: Target contracts that are exempt from the STF-enforced rule that EOAs cannot make transactions. Must include ArbRetryableTx `0x000000000000000000000000000000000000006E`, EntryPoint `0x2843C269D2a64eCfA63548E8B3Fc0FD23B7F70cb`, ArbSys `0x0000000000000000000000000000000000000064`.
+++ severity: HIGH
      values.getSystemContracts.16:
-        "0x0000000000000000000000000000000000000064"
+        "kinto:0x0000000000000000000000000000000000000064"
+++ severity: HIGH
      values.owner:
-        "0xacC000818e5Bbd911D5d449aA81CB5cA24024739"
+        "kinto:0xacC000818e5Bbd911D5d449aA81CB5cA24024739"
      values.systemApps.0:
-        "0x3e9727470C66B1e77034590926CDe0242B5A3dCc"
+        "kinto:0x3e9727470C66B1e77034590926CDe0242B5A3dCc"
      values.systemApps.1:
-        "0xD157904639E89df05e89e0DabeEC99aE3d74F9AA"
+        "kinto:0xD157904639E89df05e89e0DabeEC99aE3d74F9AA"
      implementationNames.0x5A2b641b84b0230C8e75F55d5afd27f4Dbd59d5b:
-        "UUPSProxy"
      implementationNames.0xb9cE6BC89b79c713f34fd15D82a70900fEFD0de1:
-        "KintoAppRegistry"
      implementationNames.kinto:0x5A2b641b84b0230C8e75F55d5afd27f4Dbd59d5b:
+        "UUPSProxy"
      implementationNames.kinto:0xb9cE6BC89b79c713f34fd15D82a70900fEFD0de1:
+        "KintoAppRegistry"
    }
```

```diff
    EOA  (0x660ad4B5A74130a4796B4d54BC6750Ae93C86e6c) {
    +++ description: None
      address:
-        "0x660ad4B5A74130a4796B4d54BC6750Ae93C86e6c"
+        "kinto:0x660ad4B5A74130a4796B4d54BC6750Ae93C86e6c"
    }
```

```diff
    EOA  (0x6E09F8A68fB5278e0C33D239dC12B2Cec33F4aC7) {
    +++ description: None
      address:
-        "0x6E09F8A68fB5278e0C33D239dC12B2Cec33F4aC7"
+        "kinto:0x6E09F8A68fB5278e0C33D239dC12B2Cec33F4aC7"
    }
```

```diff
    EOA  (0x6E31039abF8d248aBed57E307C9E1b7530c269E4) {
    +++ description: None
      address:
-        "0x6E31039abF8d248aBed57E307C9E1b7530c269E4"
+        "kinto:0x6E31039abF8d248aBed57E307C9E1b7530c269E4"
    }
```

```diff
    EOA  (0x6fe642404B7B23F31251103Ca0efb538Ad4aeC07) {
    +++ description: None
      address:
-        "0x6fe642404B7B23F31251103Ca0efb538Ad4aeC07"
+        "kinto:0x6fe642404B7B23F31251103Ca0efb538Ad4aeC07"
    }
```

```diff
    contract BeaconKintoWallet (0x87f0eE85bF3198654900a422832157abBba30828) {
    +++ description: Beacon proxy for the KintoWallet smartwallet implementation that is used for all users.
      address:
-        "0x87f0eE85bF3198654900a422832157abBba30828"
+        "kinto:0x87f0eE85bF3198654900a422832157abBba30828"
      values.implementation:
-        "0xbFE260680514e0D669fdC5A5f7334b97a5513d9D"
+        "kinto:0xbFE260680514e0D669fdC5A5f7334b97a5513d9D"
      values.owner:
-        "0x8a4720488CA32f1223ccFE5A087e250fE3BC5D75"
+        "kinto:0x8a4720488CA32f1223ccFE5A087e250fE3BC5D75"
      implementationNames.0x87f0eE85bF3198654900a422832157abBba30828:
-        "UpgradeableBeacon"
      implementationNames.kinto:0x87f0eE85bF3198654900a422832157abBba30828:
+        "UpgradeableBeacon"
    }
```

```diff
    contract KintoWalletFactory (0x8a4720488CA32f1223ccFE5A087e250fE3BC5D75) {
    +++ description: Deploys new KintoWallet smartwallets for users upon passing KYC checks. Also manages the beacon implementation for all KintoWallets and their recovery logic. KintoWallets can be funded with ETH via this contract.
      address:
-        "0x8a4720488CA32f1223ccFE5A087e250fE3BC5D75"
+        "kinto:0x8a4720488CA32f1223ccFE5A087e250fE3BC5D75"
      values.$admin:
-        "0xacC000818e5Bbd911D5d449aA81CB5cA24024739"
+        "kinto:0xacC000818e5Bbd911D5d449aA81CB5cA24024739"
      values.$implementation:
-        "0x1Bc47279D052Edb9C1770242287eFC23317Ed675"
+        "kinto:0x1Bc47279D052Edb9C1770242287eFC23317Ed675"
      values.$pastUpgrades.0.2.0:
-        "0x9F8Af18f6C1E5E4DA42b33D283F23EB8C23DF505"
+        "kinto:0x9F8Af18f6C1E5E4DA42b33D283F23EB8C23DF505"
      values.$pastUpgrades.1.2.0:
-        "0xd6Dea5Ff03f099242DBDF737E25e4bf4B9d4f9f6"
+        "kinto:0xd6Dea5Ff03f099242DBDF737E25e4bf4B9d4f9f6"
      values.$pastUpgrades.2.2.0:
-        "0x652c9b99f916beb42ccb7883a725E2f9219095B4"
+        "kinto:0x652c9b99f916beb42ccb7883a725E2f9219095B4"
      values.$pastUpgrades.3.2.0:
-        "0x1b5976043578C6F4d2D1d17D3d4AE89Cf001B9d5"
+        "kinto:0x1b5976043578C6F4d2D1d17D3d4AE89Cf001B9d5"
      values.$pastUpgrades.4.2.0:
-        "0xc85dAbd4b238477A1d821111A6ec8BC94D9F6394"
+        "kinto:0xc85dAbd4b238477A1d821111A6ec8BC94D9F6394"
      values.$pastUpgrades.5.2.0:
-        "0x48525Ac956c946110e2358A7E8a7A3D8290676EC"
+        "kinto:0x48525Ac956c946110e2358A7E8a7A3D8290676EC"
      values.$pastUpgrades.6.2.0:
-        "0x63495C71a036Fb886e65b6F41BA2A26d406E8108"
+        "kinto:0x63495C71a036Fb886e65b6F41BA2A26d406E8108"
      values.$pastUpgrades.7.2.0:
-        "0x30D26e75D542Ba2A7e3B35BcC78FDC064B935D8B"
+        "kinto:0x30D26e75D542Ba2A7e3B35BcC78FDC064B935D8B"
      values.$pastUpgrades.8.2.0:
-        "0x7a4A12Aa90eF6F393777A0F2bA1512F4963f406a"
+        "kinto:0x7a4A12Aa90eF6F393777A0F2bA1512F4963f406a"
      values.$pastUpgrades.9.2.0:
-        "0x8eE847CCF9C6143e55Ac156c2Dee42c0928A3ccB"
+        "kinto:0x8eE847CCF9C6143e55Ac156c2Dee42c0928A3ccB"
      values.$pastUpgrades.10.2.0:
-        "0x37F7E177dA12063632cBB9bA964f4B7F71A8De1a"
+        "kinto:0x37F7E177dA12063632cBB9bA964f4B7F71A8De1a"
      values.$pastUpgrades.11.2.0:
-        "0x916FeD38032eC9f550b91da58A50D0487f12C098"
+        "kinto:0x916FeD38032eC9f550b91da58A50D0487f12C098"
      values.$pastUpgrades.12.2.0:
-        "0x7452748E16429FDa1501cD03D1289d4Fd262A0bb"
+        "kinto:0x7452748E16429FDa1501cD03D1289d4Fd262A0bb"
      values.$pastUpgrades.13.2.0:
-        "0x93378e7303804e80eafC4bbcC40dE9228c10fF73"
+        "kinto:0x93378e7303804e80eafC4bbcC40dE9228c10fF73"
      values.$pastUpgrades.14.2.0:
-        "0x880742Eac8DD7c5C40fD19dc00C0c4785C214bEE"
+        "kinto:0x880742Eac8DD7c5C40fD19dc00C0c4785C214bEE"
      values.$pastUpgrades.15.2.0:
-        "0x19D2dc7dF25E9711c9551bc07D4EbCac780b71d8"
+        "kinto:0x19D2dc7dF25E9711c9551bc07D4EbCac780b71d8"
      values.$pastUpgrades.16.2.0:
-        "0xB80A4b325bA44c441275853656F9239044a0D78a"
+        "kinto:0xB80A4b325bA44c441275853656F9239044a0D78a"
      values.$pastUpgrades.17.2.0:
-        "0xd2ecFd5Fc0985D217FD28705847f189F4990875f"
+        "kinto:0xd2ecFd5Fc0985D217FD28705847f189F4990875f"
      values.$pastUpgrades.18.2.0:
-        "0x1618A2F977F17f4AE8a3e08E79300f09677d18c2"
+        "kinto:0x1618A2F977F17f4AE8a3e08E79300f09677d18c2"
      values.$pastUpgrades.19.2.0:
-        "0x12FF2EF4291d7EF4e4B58B6274aa65A895a15259"
+        "kinto:0x12FF2EF4291d7EF4e4B58B6274aa65A895a15259"
      values.$pastUpgrades.20.2.0:
-        "0xD08bB7002FeDb550e458F1b3395F0E80AD7CE116"
+        "kinto:0xD08bB7002FeDb550e458F1b3395F0E80AD7CE116"
      values.$pastUpgrades.21.2.0:
-        "0x62Ee6192c4288f8482F8632cf44fd87c4c612ef6"
+        "kinto:0x62Ee6192c4288f8482F8632cf44fd87c4c612ef6"
      values.$pastUpgrades.22.2.0:
-        "0x872de68253938792e4e6402d05ef82d98DAAbCdd"
+        "kinto:0x872de68253938792e4e6402d05ef82d98DAAbCdd"
      values.$pastUpgrades.23.2.0:
-        "0x1Bc47279D052Edb9C1770242287eFC23317Ed675"
+        "kinto:0x1Bc47279D052Edb9C1770242287eFC23317Ed675"
      values.appRegistry:
-        "0x5A2b641b84b0230C8e75F55d5afd27f4Dbd59d5b"
+        "kinto:0x5A2b641b84b0230C8e75F55d5afd27f4Dbd59d5b"
      values.beacon:
-        "0x87f0eE85bF3198654900a422832157abBba30828"
+        "kinto:0x87f0eE85bF3198654900a422832157abBba30828"
      values.kintoID:
-        "0xf369f78E3A0492CC4e96a90dae0728A38498e9c7"
+        "kinto:0xf369f78E3A0492CC4e96a90dae0728A38498e9c7"
+++ severity: HIGH
      values.owner:
-        "0xacC000818e5Bbd911D5d449aA81CB5cA24024739"
+        "kinto:0xacC000818e5Bbd911D5d449aA81CB5cA24024739"
      values.rewardsDistributor:
-        "0xD157904639E89df05e89e0DabeEC99aE3d74F9AA"
+        "kinto:0xD157904639E89df05e89e0DabeEC99aE3d74F9AA"
      implementationNames.0x8a4720488CA32f1223ccFE5A087e250fE3BC5D75:
-        "BlitkinProxy"
      implementationNames.0x1Bc47279D052Edb9C1770242287eFC23317Ed675:
-        "KintoWalletFactory"
      implementationNames.kinto:0x8a4720488CA32f1223ccFE5A087e250fE3BC5D75:
+        "BlitkinProxy"
      implementationNames.kinto:0x1Bc47279D052Edb9C1770242287eFC23317Ed675:
+        "KintoWalletFactory"
    }
```

```diff
    contract BundleBulker (0x8d2D899402ed84b6c0510bB1ad34ee436ADDD20d) {
    +++ description: None
      address:
-        "0x8d2D899402ed84b6c0510bB1ad34ee436ADDD20d"
+        "kinto:0x8d2D899402ed84b6c0510bB1ad34ee436ADDD20d"
      values.entryPoint:
-        "0x2843C269D2a64eCfA63548E8B3Fc0FD23B7F70cb"
+        "kinto:0x2843C269D2a64eCfA63548E8B3Fc0FD23B7F70cb"
      implementationNames.0x8d2D899402ed84b6c0510bB1ad34ee436ADDD20d:
-        "BundleBulker"
      implementationNames.kinto:0x8d2D899402ed84b6c0510bB1ad34ee436ADDD20d:
+        "BundleBulker"
    }
```

```diff
    EOA KintsugiFoundation (0x94561e98DD5E55271f91A103e4979aa6C493745E) {
    +++ description: None
      address:
-        "0x94561e98DD5E55271f91A103e4979aa6C493745E"
+        "kinto:0x94561e98DD5E55271f91A103e4979aa6C493745E"
    }
```

```diff
    contract AccessManager (0xacC000818e5Bbd911D5d449aA81CB5cA24024739) {
    +++ description: OpenZeppelin AccessManager contract: Serves as a proxy contract defining the roles, permissions and delays to call functions in target contracts.
      address:
-        "0xacC000818e5Bbd911D5d449aA81CB5cA24024739"
+        "kinto:0xacC000818e5Bbd911D5d449aA81CB5cA24024739"
      values.accessControl.roles.ADMIN_ROLE.members.0.member:
-        "0x2e2B1c42E38f5af81771e65D87729E57ABD1337a"
+        "kinto:0x2e2B1c42E38f5af81771e65D87729E57ABD1337a"
      values.accessControl.roles.ADMIN_ROLE.members.1.member:
-        "0x28fC10E12A78f986c78F973Fc70ED88072b34c8e"
+        "kinto:0x28fC10E12A78f986c78F973Fc70ED88072b34c8e"
      values.accessControl.roles.NIO_GOVERNOR_ROLE.members.0.member:
-        "0x010600ff5f36C8eF3b6Aaf2A88C2DE85C798594a"
+        "kinto:0x010600ff5f36C8eF3b6Aaf2A88C2DE85C798594a"
      values.accessControl.roles.NIO_GOVERNOR_ROLE.members.1.member:
-        "0x2e2B1c42E38f5af81771e65D87729E57ABD1337a"
+        "kinto:0x2e2B1c42E38f5af81771e65D87729E57ABD1337a"
      values.accessControl.roles.UPGRADER_ROLE.members.0.member:
-        "0x28fC10E12A78f986c78F973Fc70ED88072b34c8e"
+        "kinto:0x28fC10E12A78f986c78F973Fc70ED88072b34c8e"
      values.accessControl.roles.SECURITY_COUNCIL_ROLE.members.0.member:
-        "0x28fC10E12A78f986c78F973Fc70ED88072b34c8e"
+        "kinto:0x28fC10E12A78f986c78F973Fc70ED88072b34c8e"
      values.accessControl.roles.RECOVERY_APPROVER_ROLE.members.0.member:
-        "0x2e2B1c42E38f5af81771e65D87729E57ABD1337a"
+        "kinto:0x2e2B1c42E38f5af81771e65D87729E57ABD1337a"
      values.accessControl.roles.SANCTIONER_ROLE.members.0.member:
-        "0x28fC10E12A78f986c78F973Fc70ED88072b34c8e"
+        "kinto:0x28fC10E12A78f986c78F973Fc70ED88072b34c8e"
      values.accessControl.roles.DEV_HELPER_ROLE.members.0.member:
-        "0x2e2B1c42E38f5af81771e65D87729E57ABD1337a"
+        "kinto:0x2e2B1c42E38f5af81771e65D87729E57ABD1337a"
      values.accessControl.targets.0x793500709506652Fcc61F0d2D0fDa605638D4293:
-        {"roleFunctions":{"NIO_GOVERNOR_ROLE":["sendFunds(address,uint256,address)","sendETH(uint256,address)","batchSendFunds(address[],uint256[],address[])"]}}
      values.accessControl.targets.0x8a4720488CA32f1223ccFE5A087e250fE3BC5D75:
-        {"roleFunctions":{"UPGRADER_ROLE":["upgradeAllWalletImplementations(address)","upgradeTo(address)"],"RECOVERY_APPROVER_ROLE":["approveWalletRecovery(address)"]},"adminDelay":1036800}
      values.accessControl.targets.0x5A2b641b84b0230C8e75F55d5afd27f4Dbd59d5b:
-        {"roleFunctions":{"UPGRADER_ROLE":["upgradeTo(address)"],"SECURITY_COUNCIL_ROLE":["updateSystemApps(address[])","updateSystemContracts(address[])","updateReservedContracts(address[])"],"DEV_HELPER_ROLE":["overrideChildToParentContract(address,address)"]},"adminDelay":1036800}
      values.accessControl.targets.0xf369f78E3A0492CC4e96a90dae0728A38498e9c7:
-        {"roleFunctions":{"UPGRADER_ROLE":["upgradeTo(address)"],"SANCTIONER_ROLE":["confirmSanction(address)"]},"adminDelay":1036800}
      values.accessControl.targets.kinto:0x793500709506652Fcc61F0d2D0fDa605638D4293:
+        {"roleFunctions":{"NIO_GOVERNOR_ROLE":["sendFunds(address,uint256,address)","sendETH(uint256,address)","batchSendFunds(address[],uint256[],address[])"]}}
      values.accessControl.targets.kinto:0x8a4720488CA32f1223ccFE5A087e250fE3BC5D75:
+        {"roleFunctions":{"UPGRADER_ROLE":["upgradeAllWalletImplementations(address)","upgradeTo(address)"],"RECOVERY_APPROVER_ROLE":["approveWalletRecovery(address)"]},"adminDelay":1036800}
      values.accessControl.targets.kinto:0x5A2b641b84b0230C8e75F55d5afd27f4Dbd59d5b:
+        {"roleFunctions":{"UPGRADER_ROLE":["upgradeTo(address)"],"SECURITY_COUNCIL_ROLE":["updateSystemApps(address[])","updateSystemContracts(address[])","updateReservedContracts(address[])"],"DEV_HELPER_ROLE":["overrideChildToParentContract(address,address)"]},"adminDelay":1036800}
      values.accessControl.targets.kinto:0xf369f78E3A0492CC4e96a90dae0728A38498e9c7:
+        {"roleFunctions":{"UPGRADER_ROLE":["upgradeTo(address)"],"SANCTIONER_ROLE":["confirmSanction(address)"]},"adminDelay":1036800}
+++ description: From the constructor args. Has the ADMIN_ROLE (0).
      values.initialAdminRole:
-        "0x2e2B1c42E38f5af81771e65D87729E57ABD1337a"
+        "kinto:0x2e2B1c42E38f5af81771e65D87729E57ABD1337a"
      values.kintoMultisig2Permission.0:
-        "0x2e2B1c42E38f5af81771e65D87729E57ABD1337a"
+        "kinto:0x2e2B1c42E38f5af81771e65D87729E57ABD1337a"
      values.OperationScheduled.0.target:
-        "0xacC000818e5Bbd911D5d449aA81CB5cA24024739"
+        "kinto:0xacC000818e5Bbd911D5d449aA81CB5cA24024739"
      values.OperationScheduled.0.caller:
-        "0x2e2B1c42E38f5af81771e65D87729E57ABD1337a"
+        "kinto:0x2e2B1c42E38f5af81771e65D87729E57ABD1337a"
      values.OperationScheduled.1.target:
-        "0xacC000818e5Bbd911D5d449aA81CB5cA24024739"
+        "kinto:0xacC000818e5Bbd911D5d449aA81CB5cA24024739"
      values.OperationScheduled.1.caller:
-        "0x2e2B1c42E38f5af81771e65D87729E57ABD1337a"
+        "kinto:0x2e2B1c42E38f5af81771e65D87729E57ABD1337a"
      values.OperationScheduled.2.target:
-        "0xacC000818e5Bbd911D5d449aA81CB5cA24024739"
+        "kinto:0xacC000818e5Bbd911D5d449aA81CB5cA24024739"
      values.OperationScheduled.2.caller:
-        "0x2e2B1c42E38f5af81771e65D87729E57ABD1337a"
+        "kinto:0x2e2B1c42E38f5af81771e65D87729E57ABD1337a"
      values.OperationScheduled.3.target:
-        "0xacC000818e5Bbd911D5d449aA81CB5cA24024739"
+        "kinto:0xacC000818e5Bbd911D5d449aA81CB5cA24024739"
      values.OperationScheduled.3.caller:
-        "0x2e2B1c42E38f5af81771e65D87729E57ABD1337a"
+        "kinto:0x2e2B1c42E38f5af81771e65D87729E57ABD1337a"
      values.OperationScheduled.4.target:
-        "0xacC000818e5Bbd911D5d449aA81CB5cA24024739"
+        "kinto:0xacC000818e5Bbd911D5d449aA81CB5cA24024739"
      values.OperationScheduled.4.caller:
-        "0x2e2B1c42E38f5af81771e65D87729E57ABD1337a"
+        "kinto:0x2e2B1c42E38f5af81771e65D87729E57ABD1337a"
      values.OperationScheduled.5.target:
-        "0x8a4720488CA32f1223ccFE5A087e250fE3BC5D75"
+        "kinto:0x8a4720488CA32f1223ccFE5A087e250fE3BC5D75"
      values.OperationScheduled.5.caller:
-        "0x28fC10E12A78f986c78F973Fc70ED88072b34c8e"
+        "kinto:0x28fC10E12A78f986c78F973Fc70ED88072b34c8e"
      values.OperationScheduled.6.target:
-        "0xf369f78E3A0492CC4e96a90dae0728A38498e9c7"
+        "kinto:0xf369f78E3A0492CC4e96a90dae0728A38498e9c7"
      values.OperationScheduled.6.caller:
-        "0x28fC10E12A78f986c78F973Fc70ED88072b34c8e"
+        "kinto:0x28fC10E12A78f986c78F973Fc70ED88072b34c8e"
      values.OperationScheduled.7.target:
-        "0xacC000818e5Bbd911D5d449aA81CB5cA24024739"
+        "kinto:0xacC000818e5Bbd911D5d449aA81CB5cA24024739"
      values.OperationScheduled.7.caller:
-        "0x2e2B1c42E38f5af81771e65D87729E57ABD1337a"
+        "kinto:0x2e2B1c42E38f5af81771e65D87729E57ABD1337a"
      values.OperationScheduled.8.target:
-        "0xacC000818e5Bbd911D5d449aA81CB5cA24024739"
+        "kinto:0xacC000818e5Bbd911D5d449aA81CB5cA24024739"
      values.OperationScheduled.8.caller:
-        "0x2e2B1c42E38f5af81771e65D87729E57ABD1337a"
+        "kinto:0x2e2B1c42E38f5af81771e65D87729E57ABD1337a"
      values.OperationScheduled.9.target:
-        "0xacC000818e5Bbd911D5d449aA81CB5cA24024739"
+        "kinto:0xacC000818e5Bbd911D5d449aA81CB5cA24024739"
      values.OperationScheduled.9.caller:
-        "0x2e2B1c42E38f5af81771e65D87729E57ABD1337a"
+        "kinto:0x2e2B1c42E38f5af81771e65D87729E57ABD1337a"
      values.OperationScheduled.10.target:
-        "0xacC000818e5Bbd911D5d449aA81CB5cA24024739"
+        "kinto:0xacC000818e5Bbd911D5d449aA81CB5cA24024739"
      values.OperationScheduled.10.caller:
-        "0x2e2B1c42E38f5af81771e65D87729E57ABD1337a"
+        "kinto:0x2e2B1c42E38f5af81771e65D87729E57ABD1337a"
      values.OperationScheduled.11.target:
-        "0xacC000818e5Bbd911D5d449aA81CB5cA24024739"
+        "kinto:0xacC000818e5Bbd911D5d449aA81CB5cA24024739"
      values.OperationScheduled.11.caller:
-        "0x2e2B1c42E38f5af81771e65D87729E57ABD1337a"
+        "kinto:0x2e2B1c42E38f5af81771e65D87729E57ABD1337a"
      values.OperationScheduled.12.target:
-        "0xacC000818e5Bbd911D5d449aA81CB5cA24024739"
+        "kinto:0xacC000818e5Bbd911D5d449aA81CB5cA24024739"
      values.OperationScheduled.12.caller:
-        "0x2e2B1c42E38f5af81771e65D87729E57ABD1337a"
+        "kinto:0x2e2B1c42E38f5af81771e65D87729E57ABD1337a"
      values.OperationScheduled.13.target:
-        "0xacC000818e5Bbd911D5d449aA81CB5cA24024739"
+        "kinto:0xacC000818e5Bbd911D5d449aA81CB5cA24024739"
      values.OperationScheduled.13.caller:
-        "0x2e2B1c42E38f5af81771e65D87729E57ABD1337a"
+        "kinto:0x2e2B1c42E38f5af81771e65D87729E57ABD1337a"
      values.OperationScheduled.14.target:
-        "0xacC000818e5Bbd911D5d449aA81CB5cA24024739"
+        "kinto:0xacC000818e5Bbd911D5d449aA81CB5cA24024739"
      values.OperationScheduled.14.caller:
-        "0x2e2B1c42E38f5af81771e65D87729E57ABD1337a"
+        "kinto:0x2e2B1c42E38f5af81771e65D87729E57ABD1337a"
      values.OperationScheduled.15.target:
-        "0xacC000818e5Bbd911D5d449aA81CB5cA24024739"
+        "kinto:0xacC000818e5Bbd911D5d449aA81CB5cA24024739"
      values.OperationScheduled.15.caller:
-        "0x2e2B1c42E38f5af81771e65D87729E57ABD1337a"
+        "kinto:0x2e2B1c42E38f5af81771e65D87729E57ABD1337a"
      values.RolesGranted.0.0.account:
-        "0x2e2B1c42E38f5af81771e65D87729E57ABD1337a"
+        "kinto:0x2e2B1c42E38f5af81771e65D87729E57ABD1337a"
      values.RolesGranted.0.1.account:
-        "0x28fC10E12A78f986c78F973Fc70ED88072b34c8e"
+        "kinto:0x28fC10E12A78f986c78F973Fc70ED88072b34c8e"
      values.RolesGranted.0.2.account:
-        "0x2e2B1c42E38f5af81771e65D87729E57ABD1337a"
+        "kinto:0x2e2B1c42E38f5af81771e65D87729E57ABD1337a"
      values.RolesGranted.0.3.account:
-        "0x2e2B1c42E38f5af81771e65D87729E57ABD1337a"
+        "kinto:0x2e2B1c42E38f5af81771e65D87729E57ABD1337a"
      values.RolesGranted.1635978423191113331.0.account:
-        "0x010600ff5f36C8eF3b6Aaf2A88C2DE85C798594a"
+        "kinto:0x010600ff5f36C8eF3b6Aaf2A88C2DE85C798594a"
      values.RolesGranted.1635978423191113331.1.account:
-        "0x0000000000000000000000000000000000000000"
+        "kinto:0x0000000000000000000000000000000000000000"
      values.RolesGranted.1635978423191113331.2.account:
-        "0x2e2B1c42E38f5af81771e65D87729E57ABD1337a"
+        "kinto:0x2e2B1c42E38f5af81771e65D87729E57ABD1337a"
      values.RolesGranted.8663528507529876195.0.account:
-        "0x2e2B1c42E38f5af81771e65D87729E57ABD1337a"
+        "kinto:0x2e2B1c42E38f5af81771e65D87729E57ABD1337a"
      values.RolesGranted.8663528507529876195.1.account:
-        "0x28fC10E12A78f986c78F973Fc70ED88072b34c8e"
+        "kinto:0x28fC10E12A78f986c78F973Fc70ED88072b34c8e"
      values.RolesGranted.8663528507529876195.2.account:
-        "0x28fC10E12A78f986c78F973Fc70ED88072b34c8e"
+        "kinto:0x28fC10E12A78f986c78F973Fc70ED88072b34c8e"
      values.RolesGranted.14661544942390944024.0.account:
-        "0x28fC10E12A78f986c78F973Fc70ED88072b34c8e"
+        "kinto:0x28fC10E12A78f986c78F973Fc70ED88072b34c8e"
      values.RolesGranted.14661544942390944024.1.account:
-        "0x28fC10E12A78f986c78F973Fc70ED88072b34c8e"
+        "kinto:0x28fC10E12A78f986c78F973Fc70ED88072b34c8e"
      values.RolesGranted.2827137176883084373.0.account:
-        "0x2e2B1c42E38f5af81771e65D87729E57ABD1337a"
+        "kinto:0x2e2B1c42E38f5af81771e65D87729E57ABD1337a"
      values.RolesGranted.565311800027786426.0.account:
-        "0x28fC10E12A78f986c78F973Fc70ED88072b34c8e"
+        "kinto:0x28fC10E12A78f986c78F973Fc70ED88072b34c8e"
      values.RolesGranted.12665434841745889720.0.account:
-        "0x2e2B1c42E38f5af81771e65D87729E57ABD1337a"
+        "kinto:0x2e2B1c42E38f5af81771e65D87729E57ABD1337a"
      values.RolesRevoked.1635978423191113331.0.account:
-        "0x0000000000000000000000000000000000000000"
+        "kinto:0x0000000000000000000000000000000000000000"
      values.RolesRevoked.8663528507529876195.0.account:
-        "0x2e2B1c42E38f5af81771e65D87729E57ABD1337a"
+        "kinto:0x2e2B1c42E38f5af81771e65D87729E57ABD1337a"
      values.securityCouncilPermission.0:
-        "0x28fC10E12A78f986c78F973Fc70ED88072b34c8e"
+        "kinto:0x28fC10E12A78f986c78F973Fc70ED88072b34c8e"
      values.TargetAdminDelayUpdated.0x8a4720488CA32f1223ccFE5A087e250fE3BC5D75:
-        {"delay":1036800,"since":1744732365}
      values.TargetAdminDelayUpdated.0xf369f78E3A0492CC4e96a90dae0728A38498e9c7:
-        {"delay":1036800,"since":1744732365}
      values.TargetAdminDelayUpdated.0x5A2b641b84b0230C8e75F55d5afd27f4Dbd59d5b:
-        {"delay":1036800,"since":1744732364}
      values.TargetAdminDelayUpdated.kinto:0x8a4720488CA32f1223ccFE5A087e250fE3BC5D75:
+        {"delay":1036800,"since":1744732365}
      values.TargetAdminDelayUpdated.kinto:0xf369f78E3A0492CC4e96a90dae0728A38498e9c7:
+        {"delay":1036800,"since":1744732365}
      values.TargetAdminDelayUpdated.kinto:0x5A2b641b84b0230C8e75F55d5afd27f4Dbd59d5b:
+        {"delay":1036800,"since":1744732364}
      values.TargetFunctionRoleUpdated.0x793500709506652Fcc61F0d2D0fDa605638D4293:
-        [{"selector":"0x8522d1b2","roleId":"1635978423191113331"},{"selector":"0xc664c714","roleId":"1635978423191113331"},{"selector":"0x9089e8ae","roleId":"1635978423191113331"}]
      values.TargetFunctionRoleUpdated.0x8a4720488CA32f1223ccFE5A087e250fE3BC5D75:
-        [{"selector":"0xf4f4b03a","roleId":"8663528507529876195"},{"selector":"0x3659cfe6","roleId":"8663528507529876195"},{"selector":"0x456cf492","roleId":"2827137176883084373"}]
      values.TargetFunctionRoleUpdated.0x5A2b641b84b0230C8e75F55d5afd27f4Dbd59d5b:
-        [{"selector":"0x3659cfe6","roleId":"8663528507529876195"},{"selector":"0xc233e2a3","roleId":"14661544942390944024"},{"selector":"0x0e6ff432","roleId":"14661544942390944024"},{"selector":"0x72592851","roleId":"14661544942390944024"},{"selector":"0x9a6896f6","roleId":"12665434841745889720"}]
      values.TargetFunctionRoleUpdated.0xf369f78E3A0492CC4e96a90dae0728A38498e9c7:
-        [{"selector":"0x3659cfe6","roleId":"8663528507529876195"},{"selector":"0xfb0b2940","roleId":"565311800027786426"}]
      values.TargetFunctionRoleUpdated.kinto:0x793500709506652Fcc61F0d2D0fDa605638D4293:
+        [{"selector":"0x8522d1b2","roleId":"1635978423191113331"},{"selector":"0xc664c714","roleId":"1635978423191113331"},{"selector":"0x9089e8ae","roleId":"1635978423191113331"}]
      values.TargetFunctionRoleUpdated.kinto:0x8a4720488CA32f1223ccFE5A087e250fE3BC5D75:
+        [{"selector":"0xf4f4b03a","roleId":"8663528507529876195"},{"selector":"0x3659cfe6","roleId":"8663528507529876195"},{"selector":"0x456cf492","roleId":"2827137176883084373"}]
      values.TargetFunctionRoleUpdated.kinto:0x5A2b641b84b0230C8e75F55d5afd27f4Dbd59d5b:
+        [{"selector":"0x3659cfe6","roleId":"8663528507529876195"},{"selector":"0xc233e2a3","roleId":"14661544942390944024"},{"selector":"0x0e6ff432","roleId":"14661544942390944024"},{"selector":"0x72592851","roleId":"14661544942390944024"},{"selector":"0x9a6896f6","roleId":"12665434841745889720"}]
      values.TargetFunctionRoleUpdated.kinto:0xf369f78E3A0492CC4e96a90dae0728A38498e9c7:
+        [{"selector":"0x3659cfe6","roleId":"8663528507529876195"},{"selector":"0xfb0b2940","roleId":"565311800027786426"}]
      implementationNames.0xacC000818e5Bbd911D5d449aA81CB5cA24024739:
-        "AccessManager"
      implementationNames.kinto:0xacC000818e5Bbd911D5d449aA81CB5cA24024739:
+        "AccessManager"
    }
```

```diff
    EOA  (0xb539019776eF803E89EC062Ad54cA24D1Fdb008a) {
    +++ description: None
      address:
-        "0xb539019776eF803E89EC062Ad54cA24D1Fdb008a"
+        "kinto:0xb539019776eF803E89EC062Ad54cA24D1Fdb008a"
    }
```

```diff
    EOA MamoriLabs (0xc1f4D15C16A1f3555E0a5F7AeFD1e17AD4aaf40B) {
    +++ description: None
      address:
-        "0xc1f4D15C16A1f3555E0a5F7AeFD1e17AD4aaf40B"
+        "kinto:0xc1f4D15C16A1f3555E0a5F7AeFD1e17AD4aaf40B"
    }
```

```diff
    contract KintoID (0xf369f78E3A0492CC4e96a90dae0728A38498e9c7) {
    +++ description: Manages Kinto's KYC system: The KYC_PROVIDER roles responsible for managing the KYC status and KYC metadata of user wallets. Each KintoWallet checks the KYC status of its user in this contract as part of the signature check.
      address:
-        "0xf369f78E3A0492CC4e96a90dae0728A38498e9c7"
+        "kinto:0xf369f78E3A0492CC4e96a90dae0728A38498e9c7"
      values.$admin:
-        "0x0000000000000000000000000000000000000000"
+        "kinto:0x0000000000000000000000000000000000000000"
      values.$implementation:
-        "0x1d61772AE2e157f9F6A4127526eD86AB5801a477"
+        "kinto:0x1d61772AE2e157f9F6A4127526eD86AB5801a477"
      values.$pastUpgrades.0.2.0:
-        "0xa3625A24376C2eac96eDcF353C88F3F3a1De030a"
+        "kinto:0xa3625A24376C2eac96eDcF353C88F3F3a1De030a"
      values.$pastUpgrades.1.2.0:
-        "0xd838189759e85Ac8673515FFd9c72cc854f360Fa"
+        "kinto:0xd838189759e85Ac8673515FFd9c72cc854f360Fa"
      values.$pastUpgrades.2.2.0:
-        "0x2AA456d97fB8f75283327458920D4daA2BFe363e"
+        "kinto:0x2AA456d97fB8f75283327458920D4daA2BFe363e"
      values.$pastUpgrades.3.2.0:
-        "0x41bC5c9B1FC8Ab95890De5339737Bc791421ea56"
+        "kinto:0x41bC5c9B1FC8Ab95890De5339737Bc791421ea56"
      values.$pastUpgrades.4.2.0:
-        "0xE5eBdFCB597DD84CFeA412278f1c46A0D83aaC39"
+        "kinto:0xE5eBdFCB597DD84CFeA412278f1c46A0D83aaC39"
      values.$pastUpgrades.5.2.0:
-        "0x074e5ECc285b90781f74e491F33fF37849F97220"
+        "kinto:0x074e5ECc285b90781f74e491F33fF37849F97220"
      values.$pastUpgrades.6.2.0:
-        "0xd3642f5CF57A5090F173294F68Df66583521FeA0"
+        "kinto:0xd3642f5CF57A5090F173294F68Df66583521FeA0"
      values.$pastUpgrades.7.2.0:
-        "0x7CFe474936fA50181ae7c2C43EeB8806e25bc983"
+        "kinto:0x7CFe474936fA50181ae7c2C43EeB8806e25bc983"
      values.$pastUpgrades.8.2.0:
-        "0xaa0726829d41E3C70B84Bc5390cce82afC56871A"
+        "kinto:0xaa0726829d41E3C70B84Bc5390cce82afC56871A"
      values.$pastUpgrades.9.2.0:
-        "0x4aC06254558e144C41461a319822993900cE2eE4"
+        "kinto:0x4aC06254558e144C41461a319822993900cE2eE4"
      values.$pastUpgrades.10.2.0:
-        "0x1d61772AE2e157f9F6A4127526eD86AB5801a477"
+        "kinto:0x1d61772AE2e157f9F6A4127526eD86AB5801a477"
      values.accessControl.DEFAULT_ADMIN_ROLE.members.0:
-        "0xacC000818e5Bbd911D5d449aA81CB5cA24024739"
+        "kinto:0xacC000818e5Bbd911D5d449aA81CB5cA24024739"
      values.accessControl.KYC_PROVIDER_ROLE.members.0:
-        "0x52F09693c9eEaA93A64BA697e3d3e43a1eB65477"
+        "kinto:0x52F09693c9eEaA93A64BA697e3d3e43a1eB65477"
      values.accessControl.KYC_PROVIDER_ROLE.members.1:
-        "0xb539019776eF803E89EC062Ad54cA24D1Fdb008a"
+        "kinto:0xb539019776eF803E89EC062Ad54cA24D1Fdb008a"
      values.accessControl.KYC_PROVIDER_ROLE.members.2:
-        "0x6E31039abF8d248aBed57E307C9E1b7530c269E4"
+        "kinto:0x6E31039abF8d248aBed57E307C9E1b7530c269E4"
      values.accessControl.KYC_PROVIDER_ROLE.members.3:
-        "0x6E09F8A68fB5278e0C33D239dC12B2Cec33F4aC7"
+        "kinto:0x6E09F8A68fB5278e0C33D239dC12B2Cec33F4aC7"
      values.accessControl.KYC_PROVIDER_ROLE.members.4:
-        "0x2e2B1c42E38f5af81771e65D87729E57ABD1337a"
+        "kinto:0x2e2B1c42E38f5af81771e65D87729E57ABD1337a"
      values.accessControl.KYC_PROVIDER_ROLE.members.5:
-        "0x6fe642404B7B23F31251103Ca0efb538Ad4aeC07"
+        "kinto:0x6fe642404B7B23F31251103Ca0efb538Ad4aeC07"
      values.accessControl.KYC_PROVIDER_ROLE.members.6:
-        "0xacC000818e5Bbd911D5d449aA81CB5cA24024739"
+        "kinto:0xacC000818e5Bbd911D5d449aA81CB5cA24024739"
      values.accessControl.UPGRADER_ROLE.members.0:
-        "0xacC000818e5Bbd911D5d449aA81CB5cA24024739"
+        "kinto:0xacC000818e5Bbd911D5d449aA81CB5cA24024739"
      values.accessControl.0x85f3421f6b5b49c1607af3732a481b7217b224e9d9648eb16c382bac95689ab0.members.0:
-        "0x6E09F8A68fB5278e0C33D239dC12B2Cec33F4aC7"
+        "kinto:0x6E09F8A68fB5278e0C33D239dC12B2Cec33F4aC7"
      values.accessControl.GOVERNANCE_ROLE.members.0:
-        "0xacC000818e5Bbd911D5d449aA81CB5cA24024739"
+        "kinto:0xacC000818e5Bbd911D5d449aA81CB5cA24024739"
+++ description: addresses confirmed sanctioned by the GOVERNANCE_ROLE.
      values.confirmedSanctions.0:
-        "0x2a14E7B96D2362bdf1Df8C0bB4544714e7601Af0"
+        "kinto:0x2a14E7B96D2362bdf1Df8C0bB4544714e7601Af0"
+++ description: addresses confirmed sanctioned by the GOVERNANCE_ROLE.
      values.confirmedSanctions.1:
-        "0xc1ad34Bd24180A15735dd7919C0F24A63e4017ff"
+        "kinto:0xc1ad34Bd24180A15735dd7919C0F24A63e4017ff"
+++ severity: HIGH
      values.DEFAULT_ADMINs.0:
-        "0xacC000818e5Bbd911D5d449aA81CB5cA24024739"
+        "kinto:0xacC000818e5Bbd911D5d449aA81CB5cA24024739"
      values.faucet:
-        "0x0719D47A213149E2Ef8d3f5afDaDA8a8E22dfc03"
+        "kinto:0x0719D47A213149E2Ef8d3f5afDaDA8a8E22dfc03"
      values.getApproved.0:
-        "0x0000000000000000000000000000000000000000"
+        "kinto:0x0000000000000000000000000000000000000000"
      values.getApproved.1:
-        "0x0000000000000000000000000000000000000000"
+        "kinto:0x0000000000000000000000000000000000000000"
      values.getApproved.2:
-        "0x0000000000000000000000000000000000000000"
+        "kinto:0x0000000000000000000000000000000000000000"
+++ severity: HIGH
      values.GOVERNANCErs.0:
-        "0xacC000818e5Bbd911D5d449aA81CB5cA24024739"
+        "kinto:0xacC000818e5Bbd911D5d449aA81CB5cA24024739"
+++ severity: HIGH
      values.KYC_PROVIDERs.0:
-        "0x52F09693c9eEaA93A64BA697e3d3e43a1eB65477"
+        "kinto:0x52F09693c9eEaA93A64BA697e3d3e43a1eB65477"
+++ severity: HIGH
      values.KYC_PROVIDERs.1:
-        "0xb539019776eF803E89EC062Ad54cA24D1Fdb008a"
+        "kinto:0xb539019776eF803E89EC062Ad54cA24D1Fdb008a"
+++ severity: HIGH
      values.KYC_PROVIDERs.2:
-        "0x6E31039abF8d248aBed57E307C9E1b7530c269E4"
+        "kinto:0x6E31039abF8d248aBed57E307C9E1b7530c269E4"
+++ severity: HIGH
      values.KYC_PROVIDERs.3:
-        "0x6E09F8A68fB5278e0C33D239dC12B2Cec33F4aC7"
+        "kinto:0x6E09F8A68fB5278e0C33D239dC12B2Cec33F4aC7"
+++ severity: HIGH
      values.KYC_PROVIDERs.4:
-        "0x2e2B1c42E38f5af81771e65D87729E57ABD1337a"
+        "kinto:0x2e2B1c42E38f5af81771e65D87729E57ABD1337a"
+++ severity: HIGH
      values.KYC_PROVIDERs.5:
-        "0x6fe642404B7B23F31251103Ca0efb538Ad4aeC07"
+        "kinto:0x6fe642404B7B23F31251103Ca0efb538Ad4aeC07"
+++ severity: HIGH
      values.KYC_PROVIDERs.6:
-        "0xacC000818e5Bbd911D5d449aA81CB5cA24024739"
+        "kinto:0xacC000818e5Bbd911D5d449aA81CB5cA24024739"
      values.pendingSanctions.0._to:
-        "0x8F14A1990cB5D327E545be6aF2a03B517aC58259"
+        "kinto:0x8F14A1990cB5D327E545be6aF2a03B517aC58259"
      values.pendingSanctions.1._to:
-        "0xE9Cb04a602cAA9D2C649dDE854Ab7389C98CF912"
+        "kinto:0xE9Cb04a602cAA9D2C649dDE854Ab7389C98CF912"
      values.pendingSanctions.2._to:
-        "0xC44F5CA2F187D5ece6864b8a31174C36dEFdC29c"
+        "kinto:0xC44F5CA2F187D5ece6864b8a31174C36dEFdC29c"
      values.pendingSanctions.3._to:
-        "0x505D435C8B66a7511dbec7f3C8DA6F1e67D50dDA"
+        "kinto:0x505D435C8B66a7511dbec7f3C8DA6F1e67D50dDA"
      values.pendingSanctions.4._to:
-        "0x5579CA784CdC93776b9c030618548f1317AB4c39"
+        "kinto:0x5579CA784CdC93776b9c030618548f1317AB4c39"
      values.pendingSanctions.5._to:
-        "0xc2811Dfd12FF70b229d26E465359664f9e60b9D2"
+        "kinto:0xc2811Dfd12FF70b229d26E465359664f9e60b9D2"
      values.pendingSanctions.6._to:
-        "0x7498cF5863fd745eE79d7F07516725b87fE9C8FB"
+        "kinto:0x7498cF5863fd745eE79d7F07516725b87fE9C8FB"
      values.pendingSanctions.7._to:
-        "0xf30BF377b3C4ed1f111E6E28CF26003CE5a682Cf"
+        "kinto:0xf30BF377b3C4ed1f111E6E28CF26003CE5a682Cf"
      values.pendingSanctions.8._to:
-        "0x1f16335Fd1dD3e8DCC8b401f5ae8BA57F8AD76a8"
+        "kinto:0x1f16335Fd1dD3e8DCC8b401f5ae8BA57F8AD76a8"
      values.pendingSanctions.9._to:
-        "0xcf011278736204F57B343568A8A8DC09f266a834"
+        "kinto:0xcf011278736204F57B343568A8A8DC09f266a834"
      values.pendingSanctions.10._to:
-        "0x3CfA8C0e6eEb1e601f76355A82f583232b186a7D"
+        "kinto:0x3CfA8C0e6eEb1e601f76355A82f583232b186a7D"
      values.pendingSanctions.11._to:
-        "0x19CC0e919b58e0d0eF7BaeBb103f72dee1031978"
+        "kinto:0x19CC0e919b58e0d0eF7BaeBb103f72dee1031978"
      values.pendingSanctions.12._to:
-        "0xc3106dd6f982d4269a6618E77f49927d44BCCafD"
+        "kinto:0xc3106dd6f982d4269a6618E77f49927d44BCCafD"
      values.pendingSanctions.13._to:
-        "0x2955ca0D791C30C16e7298B803BB116bED5d7269"
+        "kinto:0x2955ca0D791C30C16e7298B803BB116bED5d7269"
      values.pendingSanctions.14._to:
-        "0x015374c2Dc040eE1c40739936C72D5F035186f0f"
+        "kinto:0x015374c2Dc040eE1c40739936C72D5F035186f0f"
      values.pendingSanctions.15._to:
-        "0x5420f6C9Bc0495d24f35Ba25Be8e259693615625"
+        "kinto:0x5420f6C9Bc0495d24f35Ba25Be8e259693615625"
      values.pendingSanctions.16._to:
-        "0x60BF5eE1CBf2a18639412ce694FbCe1c8c3E6637"
+        "kinto:0x60BF5eE1CBf2a18639412ce694FbCe1c8c3E6637"
      values.pendingSanctions.17._to:
-        "0x76De7fC28E69bb78e6475C8Fd71B71793B663E31"
+        "kinto:0x76De7fC28E69bb78e6475C8Fd71B71793B663E31"
      values.pendingSanctions.18._to:
-        "0x927491618ECd06afBCEDeA84a2fEF71c991f00Eb"
+        "kinto:0x927491618ECd06afBCEDeA84a2fEF71c991f00Eb"
      values.pendingSanctions.19._to:
-        "0x52F09693c9eEaA93A64BA697e3d3e43a1eB65477"
+        "kinto:0x52F09693c9eEaA93A64BA697e3d3e43a1eB65477"
      values.pendingSanctions.20._to:
-        "0xca3E2E5c75121Cb46360E4459F6F94dCA6D868f4"
+        "kinto:0xca3E2E5c75121Cb46360E4459F6F94dCA6D868f4"
      values.pendingSanctions.21._to:
-        "0xa5AFC38dDBE6e2dda8dC7A4fdae380a9Dbe12a06"
+        "kinto:0xa5AFC38dDBE6e2dda8dC7A4fdae380a9Dbe12a06"
      values.pendingSanctions.22._to:
-        "0xe12BcEe0219f3c80FFF8C271D29e343bA42B814d"
+        "kinto:0xe12BcEe0219f3c80FFF8C271D29e343bA42B814d"
      values.pendingSanctions.23._to:
-        "0x3365dB4c3490AC6A43986Cfe2c26FE61B22aA917"
+        "kinto:0x3365dB4c3490AC6A43986Cfe2c26FE61B22aA917"
      values.pendingSanctions.24._to:
-        "0x0828b8Fe631347dA81a46E3D23394C3b18395aD4"
+        "kinto:0x0828b8Fe631347dA81a46E3D23394C3b18395aD4"
      values.pendingSanctions.25._to:
-        "0x2548e483ceeFBe4de727f2F853AF0124869Ae75E"
+        "kinto:0x2548e483ceeFBe4de727f2F853AF0124869Ae75E"
      values.pendingSanctions.26._to:
-        "0x463d21B0620C77620aeD87A769e5836132158855"
+        "kinto:0x463d21B0620C77620aeD87A769e5836132158855"
      values.pendingSanctions.27._to:
-        "0x504a1ef47bF87a550bebfBA6ffe58a3a57bADeB7"
+        "kinto:0x504a1ef47bF87a550bebfBA6ffe58a3a57bADeB7"
      values.pendingSanctions.28._to:
-        "0xb2c54B111705B23BCB4cf584C396982c3B613F99"
+        "kinto:0xb2c54B111705B23BCB4cf584C396982c3B613F99"
      values.pendingSanctions.29._to:
-        "0xE65a2Dee17190786c76f83e36F489a085690686C"
+        "kinto:0xE65a2Dee17190786c76f83e36F489a085690686C"
      values.pendingSanctions.30._to:
-        "0xC14051DBDc3459A6A353D887dDF68F2BE286FaD6"
+        "kinto:0xC14051DBDc3459A6A353D887dDF68F2BE286FaD6"
      values.pendingSanctions.31._to:
-        "0x1075d13CE70F8F4eB840c4c264b6c84C2CD4E785"
+        "kinto:0x1075d13CE70F8F4eB840c4c264b6c84C2CD4E785"
      values.pendingSanctions.32._to:
-        "0x24444de1eFf861197fd1393cF6081701237d3380"
+        "kinto:0x24444de1eFf861197fd1393cF6081701237d3380"
      values.pendingSanctions.33._to:
-        "0x4F5D61De15F7D9C933f78937295402b3E0D9AA6f"
+        "kinto:0x4F5D61De15F7D9C933f78937295402b3E0D9AA6f"
      values.pendingSanctions.34._to:
-        "0x92D620d0279359727A0128cC19b84EEF89621Fb4"
+        "kinto:0x92D620d0279359727A0128cC19b84EEF89621Fb4"
      values.pendingSanctions.35._to:
-        "0xCc946190D2F37497d21e10309a20D56CF240446B"
+        "kinto:0xCc946190D2F37497d21e10309a20D56CF240446B"
      values.pendingSanctions.36._to:
-        "0x9baE98859a9D5Ba64AD43E0C22F99d8BAd7FB554"
+        "kinto:0x9baE98859a9D5Ba64AD43E0C22F99d8BAd7FB554"
      values.pendingSanctions.37._to:
-        "0x3e7b92D14dfA2A891B69d73A9912C7bea9C86bDB"
+        "kinto:0x3e7b92D14dfA2A891B69d73A9912C7bea9C86bDB"
      values.pendingSanctions.38._to:
-        "0x102C7CAF21c4B1EF75c5d3EEEbe673E73c1706D3"
+        "kinto:0x102C7CAF21c4B1EF75c5d3EEEbe673E73c1706D3"
      values.pendingSanctions.39._to:
-        "0x275edFf82EB0c3845edaBa411D7A5bE31486C2B6"
+        "kinto:0x275edFf82EB0c3845edaBa411D7A5bE31486C2B6"
      values.pendingSanctions.40._to:
-        "0xdb563dA812f5d90727bb12a0959F5679B9a2Ea5F"
+        "kinto:0xdb563dA812f5d90727bb12a0959F5679B9a2Ea5F"
      values.pendingSanctions.41._to:
-        "0xdb563dA812f5d90727bb12a0959F5679B9a2Ea5F"
+        "kinto:0xdb563dA812f5d90727bb12a0959F5679B9a2Ea5F"
      values.pendingSanctions.42._to:
-        "0xfd1dCf92A221f333061575FD8B7D02b6E3A5957D"
+        "kinto:0xfd1dCf92A221f333061575FD8B7D02b6E3A5957D"
      values.pendingSanctions.43._to:
-        "0x574CFb5AA6F7A05B111Cd298b73A4123AAfdF97f"
+        "kinto:0x574CFb5AA6F7A05B111Cd298b73A4123AAfdF97f"
      values.pendingSanctions.44._to:
-        "0x49aEa6275e1D94Df2AC90c3ee4e4afd47e468d71"
+        "kinto:0x49aEa6275e1D94Df2AC90c3ee4e4afd47e468d71"
      values.pendingSanctions.45._to:
-        "0x3C9959C3EfEC9674926D86D8CAA814A486bA047B"
+        "kinto:0x3C9959C3EfEC9674926D86D8CAA814A486bA047B"
      values.pendingSanctions.46._to:
-        "0xBD85550C39dE4844E501A278D6b632FbE68cF70F"
+        "kinto:0xBD85550C39dE4844E501A278D6b632FbE68cF70F"
      values.pendingSanctions.47._to:
-        "0x1B2888e792e82fe352FC9D1E73cdc91C6217F55c"
+        "kinto:0x1B2888e792e82fe352FC9D1E73cdc91C6217F55c"
      values.pendingSanctions.48._to:
-        "0x93402720154e26A044E8389D2733F281fF830c5c"
+        "kinto:0x93402720154e26A044E8389D2733F281fF830c5c"
      values.pendingSanctions.49._to:
-        "0xcD984AD7eBB2ab7B2aE0afd967F371c6E24a4Bc6"
+        "kinto:0xcD984AD7eBB2ab7B2aE0afd967F371c6E24a4Bc6"
      values.pendingSanctions.50._to:
-        "0x493ff963FAAbbBeDBA2Aa19378bF8d8a0F0e2C5E"
+        "kinto:0x493ff963FAAbbBeDBA2Aa19378bF8d8a0F0e2C5E"
      values.pendingSanctions.51._to:
-        "0xbf3fBce48ff8a49918dD8578290814ea466aB79F"
+        "kinto:0xbf3fBce48ff8a49918dD8578290814ea466aB79F"
      values.pendingSanctions.52._to:
-        "0xD0aC63a724dCb105561F981c3D9dda033570193e"
+        "kinto:0xD0aC63a724dCb105561F981c3D9dda033570193e"
      values.pendingSanctions.53._to:
-        "0xf6f06e71eFB2671eAaBcf6E2C090357c995C495D"
+        "kinto:0xf6f06e71eFB2671eAaBcf6E2C090357c995C495D"
      values.pendingSanctions.54._to:
-        "0x1971eB33A28eCFa6BF701a6efec4255633F338FB"
+        "kinto:0x1971eB33A28eCFa6BF701a6efec4255633F338FB"
      values.pendingSanctions.55._to:
-        "0x9E292AFD2492f4ecBA6c1eb8B73BC87A5650eB8F"
+        "kinto:0x9E292AFD2492f4ecBA6c1eb8B73BC87A5650eB8F"
      values.pendingSanctions.56._to:
-        "0x7B31BC4FD8A00f734690AD0607903AA2C770a802"
+        "kinto:0x7B31BC4FD8A00f734690AD0607903AA2C770a802"
      values.pendingSanctions.57._to:
-        "0x99758a8519691B6bffEeD3976080c943634B7364"
+        "kinto:0x99758a8519691B6bffEeD3976080c943634B7364"
      values.pendingSanctions.58._to:
-        "0x81bb2B25eA1A01BADA25d41C67A34d81C9684712"
+        "kinto:0x81bb2B25eA1A01BADA25d41C67A34d81C9684712"
      values.pendingSanctions.59._to:
-        "0x6E6E2044A4cfeA057E02d6FB72c33Fc893A9B788"
+        "kinto:0x6E6E2044A4cfeA057E02d6FB72c33Fc893A9B788"
      values.pendingSanctions.60._to:
-        "0x467Fa5244cd8386581635646F12E13C05Ad0f41F"
+        "kinto:0x467Fa5244cd8386581635646F12E13C05Ad0f41F"
      values.pendingSanctions.61._to:
-        "0x933b0f5e531648Bef764b58Ff7782AfB13AB06D0"
+        "kinto:0x933b0f5e531648Bef764b58Ff7782AfB13AB06D0"
      values.pendingSanctions.62._to:
-        "0x615E981442C93325449cB379d991237a01c06b15"
+        "kinto:0x615E981442C93325449cB379d991237a01c06b15"
      values.pendingSanctions.63._to:
-        "0xA4EcEAB6C954C3b967cF18e947879A6708A96D5e"
+        "kinto:0xA4EcEAB6C954C3b967cF18e947879A6708A96D5e"
      values.pendingSanctions.64._to:
-        "0x45Ace2D41040B7267a465A4dF8733F3327EEFBb5"
+        "kinto:0x45Ace2D41040B7267a465A4dF8733F3327EEFBb5"
      values.pendingSanctions.65._to:
-        "0x3b2E6A063125c95f327aE214eD1F20B901801059"
+        "kinto:0x3b2E6A063125c95f327aE214eD1F20B901801059"
      values.pendingSanctions.66._to:
-        "0x02b308D92893E3d93a2cD1C6506a7935B369f2C9"
+        "kinto:0x02b308D92893E3d93a2cD1C6506a7935B369f2C9"
      values.pendingSanctions.67._to:
-        "0xa7E7870aFEe03C4768feDCb55db9bC11E1187356"
+        "kinto:0xa7E7870aFEe03C4768feDCb55db9bC11E1187356"
      values.pendingSanctions.68._to:
-        "0x9E33F1333587Ee7f96772523821187de185d2ead"
+        "kinto:0x9E33F1333587Ee7f96772523821187de185d2ead"
      values.pendingSanctions.69._to:
-        "0x10888fc193ec8a5b9ce29a0213473B2ceFA1E707"
+        "kinto:0x10888fc193ec8a5b9ce29a0213473B2ceFA1E707"
      values.pendingSanctions.70._to:
-        "0xC10730513A843fa0E2Fc223eC2AE3B6d3d002294"
+        "kinto:0xC10730513A843fa0E2Fc223eC2AE3B6d3d002294"
      values.pendingSanctions.71._to:
-        "0x504CC21F6343F966E672ce27054f9b7e546cd918"
+        "kinto:0x504CC21F6343F966E672ce27054f9b7e546cd918"
      values.pendingSanctions.72._to:
-        "0x01e523cC67e5d3459bE930837d89bccEA85Fd1DC"
+        "kinto:0x01e523cC67e5d3459bE930837d89bccEA85Fd1DC"
      values.pendingSanctions.73._to:
-        "0x4D836F0f988424f32065086D9A32644a7695e248"
+        "kinto:0x4D836F0f988424f32065086D9A32644a7695e248"
      values.pendingSanctions.74._to:
-        "0x6402119871Cc942Edc26e4815B99711750B87DBB"
+        "kinto:0x6402119871Cc942Edc26e4815B99711750B87DBB"
      values.pendingSanctions.75._to:
-        "0xB3902654321D214d2B7Ca531832d0EF19780fDef"
+        "kinto:0xB3902654321D214d2B7Ca531832d0EF19780fDef"
      values.pendingSanctions.76._to:
-        "0x7Faf6f69caD10Eaf3903847434bF92b4Bb6fC955"
+        "kinto:0x7Faf6f69caD10Eaf3903847434bF92b4Bb6fC955"
      values.pendingSanctions.77._to:
-        "0x47DBDEe9AD57e48b9F9a0F867712357Ffb5B489f"
+        "kinto:0x47DBDEe9AD57e48b9F9a0F867712357Ffb5B489f"
      values.pendingSanctions.78._to:
-        "0x985540465088C9c667690cC17BFf732fC703D2E5"
+        "kinto:0x985540465088C9c667690cC17BFf732fC703D2E5"
      values.pendingSanctions.79._to:
-        "0x6CDB95f68B61922d4fE0708e55792390D8c669e4"
+        "kinto:0x6CDB95f68B61922d4fE0708e55792390D8c669e4"
      values.pendingSanctions.80._to:
-        "0x75D9312845d38764229455Ea8d526A122b37768D"
+        "kinto:0x75D9312845d38764229455Ea8d526A122b37768D"
      values.pendingSanctions.81._to:
-        "0x6baa2c84A37999D264DA7bEe9639cDd3171c1397"
+        "kinto:0x6baa2c84A37999D264DA7bEe9639cDd3171c1397"
      values.pendingSanctions.82._to:
-        "0x8862Dd4657aBCdf04c96402cD4C3007511538500"
+        "kinto:0x8862Dd4657aBCdf04c96402cD4C3007511538500"
      values.pendingSanctions.83._to:
-        "0x89F6188006a35b9D0407c37f01FCa27AeD48CA3B"
+        "kinto:0x89F6188006a35b9D0407c37f01FCa27AeD48CA3B"
      values.pendingSanctions.84._to:
-        "0x9bC8048273BBa88f36c81a94EBde7ab5E0322e22"
+        "kinto:0x9bC8048273BBa88f36c81a94EBde7ab5E0322e22"
      values.pendingSanctions.85._to:
-        "0x23C1c317368AB6Dc5F92a496e08A79ceE6f90392"
+        "kinto:0x23C1c317368AB6Dc5F92a496e08A79ceE6f90392"
      values.pendingSanctions.86._to:
-        "0x6C38A71C9bd2cb9A262C5503E8D9D3D095386C00"
+        "kinto:0x6C38A71C9bd2cb9A262C5503E8D9D3D095386C00"
      values.pendingSanctions.87._to:
-        "0x0E00e97FefD00F71b54E038899a97b470D6f662F"
+        "kinto:0x0E00e97FefD00F71b54E038899a97b470D6f662F"
      values.pendingSanctions.88._to:
-        "0xdD330d70F14AEa4Ce7b9E777fDCC117321c74124"
+        "kinto:0xdD330d70F14AEa4Ce7b9E777fDCC117321c74124"
      values.pendingSanctions.89._to:
-        "0x2a14E7B96D2362bdf1Df8C0bB4544714e7601Af0"
+        "kinto:0x2a14E7B96D2362bdf1Df8C0bB4544714e7601Af0"
      values.pendingSanctions.90._to:
-        "0xc1ad34Bd24180A15735dd7919C0F24A63e4017ff"
+        "kinto:0xc1ad34Bd24180A15735dd7919C0F24A63e4017ff"
      values.pendingSanctions.91._to:
-        "0x2f3f40216112e54F8AC7668c364E459F156ed2af"
+        "kinto:0x2f3f40216112e54F8AC7668c364E459F156ed2af"
      values.pendingSanctions.92._to:
-        "0x60a05081683493b2932Df77eE5fac141D2329B89"
+        "kinto:0x60a05081683493b2932Df77eE5fac141D2329B89"
      values.pendingSanctions.93._to:
-        "0xfB474dDfDc91293aD2a37A58DC94D6505d2c88dF"
+        "kinto:0xfB474dDfDc91293aD2a37A58DC94D6505d2c88dF"
      values.pendingSanctions.94._to:
-        "0x2bf871ca38EbF4D6Ce0124d8551F236BA33F6e8A"
+        "kinto:0x2bf871ca38EbF4D6Ce0124d8551F236BA33F6e8A"
      values.pendingSanctions.95._to:
-        "0x0008970a4F2AdEe393A8C399Af7032D690a780E8"
+        "kinto:0x0008970a4F2AdEe393A8C399Af7032D690a780E8"
      values.pendingSanctions.96._to:
-        "0x01A50003561fF26e57BaFF15e0B7A93122d7A7fA"
+        "kinto:0x01A50003561fF26e57BaFF15e0B7A93122d7A7fA"
      values.pendingSanctions.97._to:
-        "0x01fEC93Ec45adf224000d02Ccff75431ef064415"
+        "kinto:0x01fEC93Ec45adf224000d02Ccff75431ef064415"
      values.pendingSanctions.98._to:
-        "0x03C1F121735Abf4B70645eFdc810Aa1721F13fBd"
+        "kinto:0x03C1F121735Abf4B70645eFdc810Aa1721F13fBd"
      values.pendingSanctions.99._to:
-        "0x043B9f49F00F91f49BcD545271236b12B5d7B371"
+        "kinto:0x043B9f49F00F91f49BcD545271236b12B5d7B371"
      values.pendingSanctions.100._to:
-        "0x05b66E614bb4E34F341f05811DcA098edA8dA168"
+        "kinto:0x05b66E614bb4E34F341f05811DcA098edA8dA168"
      values.pendingSanctions.101._to:
-        "0x06dE06782E4626962b5aEF4958dBb3C6df105614"
+        "kinto:0x06dE06782E4626962b5aEF4958dBb3C6df105614"
      values.pendingSanctions.102._to:
-        "0x07B69c2e2dE1e41EA60F6E5e382012774A61A80a"
+        "kinto:0x07B69c2e2dE1e41EA60F6E5e382012774A61A80a"
      values.pendingSanctions.103._to:
-        "0x07bAA7EFD71836c440115add44f433B660cf61b8"
+        "kinto:0x07bAA7EFD71836c440115add44f433B660cf61b8"
      values.pendingSanctions.104._to:
-        "0x08D43D53E1F92B16622c4Ba5a3862b280B6510c6"
+        "kinto:0x08D43D53E1F92B16622c4Ba5a3862b280B6510c6"
      values.pendingSanctions.105._to:
-        "0x08da15e0ab29A928b3fd02CbdDf44e14a1e9994d"
+        "kinto:0x08da15e0ab29A928b3fd02CbdDf44e14a1e9994d"
      values.pendingSanctions.106._to:
-        "0x09A95021fB4E9C7e391B3e7D4726748251C5d970"
+        "kinto:0x09A95021fB4E9C7e391B3e7D4726748251C5d970"
      values.pendingSanctions.107._to:
-        "0x0D757815a1997F98c07d4ffD781732e9D456F3A2"
+        "kinto:0x0D757815a1997F98c07d4ffD781732e9D456F3A2"
      values.pendingSanctions.108._to:
-        "0x0E084652CDc1a68f42218522b9A8a68FC4e6619f"
+        "kinto:0x0E084652CDc1a68f42218522b9A8a68FC4e6619f"
      values.pendingSanctions.109._to:
-        "0x0bF170f698a976ad14c79130aed5D3b0594B667E"
+        "kinto:0x0bF170f698a976ad14c79130aed5D3b0594B667E"
      values.pendingSanctions.110._to:
-        "0x0d95E6D05dcF62443C6925d97D70697ce26298F4"
+        "kinto:0x0d95E6D05dcF62443C6925d97D70697ce26298F4"
      values.pendingSanctions.111._to:
-        "0x115E3390F450dee7B66C06631d8DaC7daC38C80D"
+        "kinto:0x115E3390F450dee7B66C06631d8DaC7daC38C80D"
      values.pendingSanctions.112._to:
-        "0x158B49eCD928000B49036a4B3dD1E45ad7FEcEBE"
+        "kinto:0x158B49eCD928000B49036a4B3dD1E45ad7FEcEBE"
      values.pendingSanctions.113._to:
-        "0x1695b31503e1C49123c000ab24626750b858E972"
+        "kinto:0x1695b31503e1C49123c000ab24626750b858E972"
      values.pendingSanctions.114._to:
-        "0x1E25292Ed119b1ca6aEaaF11F520ff0bCb638740"
+        "kinto:0x1E25292Ed119b1ca6aEaaF11F520ff0bCb638740"
      values.pendingSanctions.115._to:
-        "0x1FdC05572B108616bb4E6f21068D31cc08Ffaa98"
+        "kinto:0x1FdC05572B108616bb4E6f21068D31cc08Ffaa98"
      values.pendingSanctions.116._to:
-        "0x1Ff8724D557ab6A50dc240A2EFAd8adb23E12E25"
+        "kinto:0x1Ff8724D557ab6A50dc240A2EFAd8adb23E12E25"
      values.pendingSanctions.117._to:
-        "0x1a3042689f2999BbEfedD132338D819C9dD62e08"
+        "kinto:0x1a3042689f2999BbEfedD132338D819C9dD62e08"
      values.pendingSanctions.118._to:
-        "0x1aA28cd209E8a44273E9FD8053b3385cE4861BBe"
+        "kinto:0x1aA28cd209E8a44273E9FD8053b3385cE4861BBe"
      values.pendingSanctions.119._to:
-        "0x1d8A54B1781CA484068761Ef329eF14B82C9F811"
+        "kinto:0x1d8A54B1781CA484068761Ef329eF14B82C9F811"
      values.pendingSanctions.120._to:
-        "0x1d9E490938feD3dF12A09528aa25ff6620d69d1b"
+        "kinto:0x1d9E490938feD3dF12A09528aa25ff6620d69d1b"
      values.pendingSanctions.121._to:
-        "0x1e9478A59d7182ddEd839bCc1aC7249D9c779003"
+        "kinto:0x1e9478A59d7182ddEd839bCc1aC7249D9c779003"
      values.pendingSanctions.122._to:
-        "0x21C5cD61d92b610DB88426Be3eecB2c2E915693f"
+        "kinto:0x21C5cD61d92b610DB88426Be3eecB2c2E915693f"
      values.pendingSanctions.123._to:
-        "0x2342Df696C6a3716315BFa4C07Bb8ee519D92289"
+        "kinto:0x2342Df696C6a3716315BFa4C07Bb8ee519D92289"
      values.pendingSanctions.124._to:
-        "0x23c48DE9c94873Ca477871987c5a6C691517cc7C"
+        "kinto:0x23c48DE9c94873Ca477871987c5a6C691517cc7C"
      values.pendingSanctions.125._to:
-        "0x258DcCC0802232B7C9BC9ee71fde382Ed88d7Ce0"
+        "kinto:0x258DcCC0802232B7C9BC9ee71fde382Ed88d7Ce0"
      values.pendingSanctions.126._to:
-        "0x26882fe190b0A5BF429A238a11A0e923BC23f7bc"
+        "kinto:0x26882fe190b0A5BF429A238a11A0e923BC23f7bc"
      values.pendingSanctions.127._to:
-        "0x273DDd44f634c71112D2244B59999eD9A9Dd0562"
+        "kinto:0x273DDd44f634c71112D2244B59999eD9A9Dd0562"
      values.pendingSanctions.128._to:
-        "0x28c6fFE7b230F54510247FE09e5CbaaAB314ee82"
+        "kinto:0x28c6fFE7b230F54510247FE09e5CbaaAB314ee82"
      values.pendingSanctions.129._to:
-        "0x298805bE3bbe036224BB11cE5007636423ca46F6"
+        "kinto:0x298805bE3bbe036224BB11cE5007636423ca46F6"
      values.pendingSanctions.130._to:
-        "0x2AC29F4a5bA804844fCb72c2E1d739C7F24fC749"
+        "kinto:0x2AC29F4a5bA804844fCb72c2E1d739C7F24fC749"
      values.pendingSanctions.131._to:
-        "0x2B5CA5A2ABd55846C02439Dd268Ae733F104C866"
+        "kinto:0x2B5CA5A2ABd55846C02439Dd268Ae733F104C866"
      values.pendingSanctions.132._to:
-        "0x2bD3B86856EEeC97CbC01150833aCc0771491049"
+        "kinto:0x2bD3B86856EEeC97CbC01150833aCc0771491049"
      values.pendingSanctions.133._to:
-        "0x2c0c5825cD05B58d504E76d0e0571b9Bc07DF2A3"
+        "kinto:0x2c0c5825cD05B58d504E76d0e0571b9Bc07DF2A3"
      values.pendingSanctions.134._to:
-        "0x2ed2A34623aF70467ef88E473a693F879176B5a2"
+        "kinto:0x2ed2A34623aF70467ef88E473a693F879176B5a2"
      values.pendingSanctions.135._to:
-        "0x30096fdCc337A5395d275ecba9d0558484baad31"
+        "kinto:0x30096fdCc337A5395d275ecba9d0558484baad31"
      values.pendingSanctions.136._to:
-        "0x326d76c60952e8a6A1c0af55D0F592E8c4E9597a"
+        "kinto:0x326d76c60952e8a6A1c0af55D0F592E8c4E9597a"
      values.pendingSanctions.137._to:
-        "0x3787445aa612a19D140840862cEf99694d9EA3De"
+        "kinto:0x3787445aa612a19D140840862cEf99694d9EA3De"
      values.pendingSanctions.138._to:
-        "0x3C43b337a56c5c9387614ebfAC01d3b5d0734Fcc"
+        "kinto:0x3C43b337a56c5c9387614ebfAC01d3b5d0734Fcc"
      values.pendingSanctions.139._to:
-        "0x3C9A0d73EF1a155e0b94CCc498068C1DB85fbEb5"
+        "kinto:0x3C9A0d73EF1a155e0b94CCc498068C1DB85fbEb5"
      values.pendingSanctions.140._to:
-        "0x3EA0B857a9579259096F067b6Dd914D1ae75C338"
+        "kinto:0x3EA0B857a9579259096F067b6Dd914D1ae75C338"
      values.pendingSanctions.141._to:
-        "0x3Ee9cE9503bAa9a3CD4807Fa0146F848e3120b50"
+        "kinto:0x3Ee9cE9503bAa9a3CD4807Fa0146F848e3120b50"
      values.pendingSanctions.142._to:
-        "0x3bB7Ff827729EB2F3cd419c67Fc3B151f22deDe7"
+        "kinto:0x3bB7Ff827729EB2F3cd419c67Fc3B151f22deDe7"
      values.pendingSanctions.143._to:
-        "0x3bFD323C9D44625D0B8A77ac19b13e75b9A0f2E4"
+        "kinto:0x3bFD323C9D44625D0B8A77ac19b13e75b9A0f2E4"
      values.pendingSanctions.144._to:
-        "0x3c500E160EaB2CD26027a3389b70ED4e17cd9544"
+        "kinto:0x3c500E160EaB2CD26027a3389b70ED4e17cd9544"
      values.pendingSanctions.145._to:
-        "0x3dec956335f3E48DC1Fb99DC9A2d21350a30e245"
+        "kinto:0x3dec956335f3E48DC1Fb99DC9A2d21350a30e245"
      values.pendingSanctions.146._to:
-        "0x3e8c3aB6C952d626A48EdBCA0fd86c891Ab3c63f"
+        "kinto:0x3e8c3aB6C952d626A48EdBCA0fd86c891Ab3c63f"
      values.pendingSanctions.147._to:
-        "0x403fA81DB3CB6095007E8377500E676cB7dbFcB9"
+        "kinto:0x403fA81DB3CB6095007E8377500E676cB7dbFcB9"
      values.pendingSanctions.148._to:
-        "0x414ded65867BdD1a2DcEcf730fBF4F92a72Ec55a"
+        "kinto:0x414ded65867BdD1a2DcEcf730fBF4F92a72Ec55a"
      values.pendingSanctions.149._to:
-        "0x41b6cBA6EDf1bD2BC61b80B228104bb27db3e504"
+        "kinto:0x41b6cBA6EDf1bD2BC61b80B228104bb27db3e504"
      values.pendingSanctions.150._to:
-        "0x42AAd1F0E18C9867Dd1bE8FB7E6f4119BAC62740"
+        "kinto:0x42AAd1F0E18C9867Dd1bE8FB7E6f4119BAC62740"
      values.pendingSanctions.151._to:
-        "0x437415907a0FdB07aeDCaBC085Cf940D370cfA6c"
+        "kinto:0x437415907a0FdB07aeDCaBC085Cf940D370cfA6c"
      values.pendingSanctions.152._to:
-        "0x4506633D9bBB3EA73c89ff4829695D67896104d4"
+        "kinto:0x4506633D9bBB3EA73c89ff4829695D67896104d4"
      values.pendingSanctions.153._to:
-        "0x459A9b243DE7aab18c60E25Ab0D6c99A445faC12"
+        "kinto:0x459A9b243DE7aab18c60E25Ab0D6c99A445faC12"
      values.pendingSanctions.154._to:
-        "0x47c33fd0772e8B103aBEe763d1C2FB864b665B3B"
+        "kinto:0x47c33fd0772e8B103aBEe763d1C2FB864b665B3B"
      values.pendingSanctions.155._to:
-        "0x4813eD84135cB27eC096d8b86eE35B8d62402c07"
+        "kinto:0x4813eD84135cB27eC096d8b86eE35B8d62402c07"
      values.pendingSanctions.156._to:
-        "0x483090b7B8AFBf4F9e650E5a45dbD013959d4867"
+        "kinto:0x483090b7B8AFBf4F9e650E5a45dbD013959d4867"
      values.pendingSanctions.157._to:
-        "0x4996Ea58A0E3cAB8A324366E9684d1E2e679ce67"
+        "kinto:0x4996Ea58A0E3cAB8A324366E9684d1E2e679ce67"
      values.pendingSanctions.158._to:
-        "0x49EbC2b33a410955D6291828af3f8EBeD3A1540e"
+        "kinto:0x49EbC2b33a410955D6291828af3f8EBeD3A1540e"
      values.pendingSanctions.159._to:
-        "0x4C2eEe16F3b55D45650c1a97bF329Fe810A517a2"
+        "kinto:0x4C2eEe16F3b55D45650c1a97bF329Fe810A517a2"
      values.pendingSanctions.160._to:
-        "0x4C403211d9BcAC321b683e0161CED2cE749FF0A4"
+        "kinto:0x4C403211d9BcAC321b683e0161CED2cE749FF0A4"
      values.pendingSanctions.161._to:
-        "0x4DF0384CA53D96bbED7452f10b9dDC325AF037c0"
+        "kinto:0x4DF0384CA53D96bbED7452f10b9dDC325AF037c0"
      values.pendingSanctions.162._to:
-        "0x4E56569186083eacEC60e38b9B76F1d7C6A03694"
+        "kinto:0x4E56569186083eacEC60e38b9B76F1d7C6A03694"
      values.pendingSanctions.163._to:
-        "0x4b2E0fDA7DB5Ab4f7471776F3A0e7E0D85444bFF"
+        "kinto:0x4b2E0fDA7DB5Ab4f7471776F3A0e7E0D85444bFF"
      values.pendingSanctions.164._to:
-        "0x4d38B797655D0B8F5E61a01A5a71A0346B98A3DD"
+        "kinto:0x4d38B797655D0B8F5E61a01A5a71A0346B98A3DD"
      values.pendingSanctions.165._to:
-        "0x4fc472c29A8cBED38ce871a4Caf6CbDd1Cfd3369"
+        "kinto:0x4fc472c29A8cBED38ce871a4Caf6CbDd1Cfd3369"
      values.pendingSanctions.166._to:
-        "0x52f6755e5b4dcf8a51B8E161B1D32038b3460BD9"
+        "kinto:0x52f6755e5b4dcf8a51B8E161B1D32038b3460BD9"
      values.pendingSanctions.167._to:
-        "0x533efF0d6Ee8cd7dEF21ea27BeC421Ef7b8cE796"
+        "kinto:0x533efF0d6Ee8cd7dEF21ea27BeC421Ef7b8cE796"
      values.pendingSanctions.168._to:
-        "0x5383b0425760763baaa92677464C4E723Cdba191"
+        "kinto:0x5383b0425760763baaa92677464C4E723Cdba191"
      values.pendingSanctions.169._to:
-        "0x5718c0f092Da70702A0fC284d5C86C3EeDa218Ae"
+        "kinto:0x5718c0f092Da70702A0fC284d5C86C3EeDa218Ae"
      values.pendingSanctions.170._to:
-        "0x579e88fF20811E8B7327A1b81d324E2302337E3B"
+        "kinto:0x579e88fF20811E8B7327A1b81d324E2302337E3B"
      values.pendingSanctions.171._to:
-        "0x585E38F443aFEA52D5DB05A273d0145Bd17887be"
+        "kinto:0x585E38F443aFEA52D5DB05A273d0145Bd17887be"
      values.pendingSanctions.172._to:
-        "0x59ED194974A49f7D817EC46bCE8E00A6F24133E1"
+        "kinto:0x59ED194974A49f7D817EC46bCE8E00A6F24133E1"
      values.pendingSanctions.173._to:
-        "0x5Da354DC30613Be81557323729b2bbE3D3D506d7"
+        "kinto:0x5Da354DC30613Be81557323729b2bbE3D3D506d7"
      values.pendingSanctions.174._to:
-        "0x5F0d5D4DA8692787F5267415DCc2494526E1C507"
+        "kinto:0x5F0d5D4DA8692787F5267415DCc2494526E1C507"
      values.pendingSanctions.175._to:
-        "0x5cCF7b5170F0292106A6df1F111958ff62e8Edd3"
+        "kinto:0x5cCF7b5170F0292106A6df1F111958ff62e8Edd3"
      values.pendingSanctions.176._to:
-        "0x60C460346394178b79CC9254D397B44a074e1dbD"
+        "kinto:0x60C460346394178b79CC9254D397B44a074e1dbD"
      values.pendingSanctions.177._to:
-        "0x6100c3fE678800EB6809DE473688b433eB081a5F"
+        "kinto:0x6100c3fE678800EB6809DE473688b433eB081a5F"
      values.pendingSanctions.178._to:
-        "0x61C81bBa4D9b4cc3BB109Fcf1482cb5Ce4b87205"
+        "kinto:0x61C81bBa4D9b4cc3BB109Fcf1482cb5Ce4b87205"
      values.pendingSanctions.179._to:
-        "0x62671619ccb07Db5f94A8381A308989C953A0Cc9"
+        "kinto:0x62671619ccb07Db5f94A8381A308989C953A0Cc9"
      values.pendingSanctions.180._to:
-        "0x634D84AFE8Bed2f308F99bdE4677A6D1F8DBfC6D"
+        "kinto:0x634D84AFE8Bed2f308F99bdE4677A6D1F8DBfC6D"
      values.pendingSanctions.181._to:
-        "0x63b6bbBcab97d26d87abfb2E68E63ebd7772C0cb"
+        "kinto:0x63b6bbBcab97d26d87abfb2E68E63ebd7772C0cb"
      values.pendingSanctions.182._to:
-        "0x660dD692777AF51FBFE15C5B47178994d825911a"
+        "kinto:0x660dD692777AF51FBFE15C5B47178994d825911a"
      values.pendingSanctions.183._to:
-        "0x685d6B0088397A00790DBDE7B3Ab8fAA7841a809"
+        "kinto:0x685d6B0088397A00790DBDE7B3Ab8fAA7841a809"
      values.pendingSanctions.184._to:
-        "0x6E944c6B214B215dfe053e7287f04f700a467DA8"
+        "kinto:0x6E944c6B214B215dfe053e7287f04f700a467DA8"
      values.pendingSanctions.185._to:
-        "0x6dc56C56e81EE1D496274f9349696657Dd005B0a"
+        "kinto:0x6dc56C56e81EE1D496274f9349696657Dd005B0a"
      values.pendingSanctions.186._to:
-        "0x6e77aE496c67441Ee772f88471b27Bf62Ef04d07"
+        "kinto:0x6e77aE496c67441Ee772f88471b27Bf62Ef04d07"
      values.pendingSanctions.187._to:
-        "0x70E21B6fB6835652642568Dd0143C2821e7EBC01"
+        "kinto:0x70E21B6fB6835652642568Dd0143C2821e7EBC01"
      values.pendingSanctions.188._to:
-        "0x72F50cBB3D4189179b1cC55435993eB3d0bF772C"
+        "kinto:0x72F50cBB3D4189179b1cC55435993eB3d0bF772C"
      values.pendingSanctions.189._to:
-        "0x72d47E7F0E341129Fd8815e84e396e86AF88484b"
+        "kinto:0x72d47E7F0E341129Fd8815e84e396e86AF88484b"
      values.pendingSanctions.190._to:
-        "0x73fcfBefa7e9650049c7BcA3c76F99D085Eaf462"
+        "kinto:0x73fcfBefa7e9650049c7BcA3c76F99D085Eaf462"
      values.pendingSanctions.191._to:
-        "0x74a6001A9b9f9AAb26A4eDEe55DB40413569255A"
+        "kinto:0x74a6001A9b9f9AAb26A4eDEe55DB40413569255A"
      values.pendingSanctions.192._to:
-        "0x773d712C230654121bE68D09C4ccaA9011d20895"
+        "kinto:0x773d712C230654121bE68D09C4ccaA9011d20895"
      values.pendingSanctions.193._to:
-        "0x79e0F3d1DCEab60D446D9296adA1c5c0D3368d0b"
+        "kinto:0x79e0F3d1DCEab60D446D9296adA1c5c0D3368d0b"
      values.pendingSanctions.194._to:
-        "0x7C92dEf48191e751C61F96d1B9A058546F8fc5bd"
+        "kinto:0x7C92dEf48191e751C61F96d1B9A058546F8fc5bd"
      values.pendingSanctions.195._to:
-        "0x7CB6AfA77bb4E67b4c24293D3B5C5052851b5EB0"
+        "kinto:0x7CB6AfA77bb4E67b4c24293D3B5C5052851b5EB0"
      values.pendingSanctions.196._to:
-        "0x8006D189F5311E28E7A43E843c9AF675CEBef4AF"
+        "kinto:0x8006D189F5311E28E7A43E843c9AF675CEBef4AF"
      values.pendingSanctions.197._to:
-        "0x80c5A724E484B2b96c61c45e06918D7B68dB256B"
+        "kinto:0x80c5A724E484B2b96c61c45e06918D7B68dB256B"
      values.pendingSanctions.198._to:
-        "0x81c0d080426CbEa108c1e74C712a6A2ceDAB89e1"
+        "kinto:0x81c0d080426CbEa108c1e74C712a6A2ceDAB89e1"
      values.pendingSanctions.199._to:
-        "0x81eEd39FC79B50DeBBcaEfc05221e9631Fb3b20f"
+        "kinto:0x81eEd39FC79B50DeBBcaEfc05221e9631Fb3b20f"
      values.pendingSanctions.200._to:
-        "0x83cCA28493b1940a16b6c22B77C7146C40463eD2"
+        "kinto:0x83cCA28493b1940a16b6c22B77C7146C40463eD2"
      values.pendingSanctions.201._to:
-        "0x8631D1Aa293c92A79C7717d933B785EcCF61b1ae"
+        "kinto:0x8631D1Aa293c92A79C7717d933B785EcCF61b1ae"
      values.pendingSanctions.202._to:
-        "0x894341e79e60b06C5D64684200BAb31C3c77AeF7"
+        "kinto:0x894341e79e60b06C5D64684200BAb31C3c77AeF7"
      values.pendingSanctions.203._to:
-        "0x89Ea92eF445cC8EC1055C8d243Ed50A2eF5FD77C"
+        "kinto:0x89Ea92eF445cC8EC1055C8d243Ed50A2eF5FD77C"
      values.pendingSanctions.204._to:
-        "0x8Cf85f74408Cb7e27cF0f52493c93fF6E150BAFa"
+        "kinto:0x8Cf85f74408Cb7e27cF0f52493c93fF6E150BAFa"
      values.pendingSanctions.205._to:
-        "0x8cc7888b6C9B9EF917CdE097210a7eB12ca8441e"
+        "kinto:0x8cc7888b6C9B9EF917CdE097210a7eB12ca8441e"
      values.pendingSanctions.206._to:
-        "0x8d2635Da6aB707E0370E2F55Bdd2D0b8dA0596A4"
+        "kinto:0x8d2635Da6aB707E0370E2F55Bdd2D0b8dA0596A4"
      values.pendingSanctions.207._to:
-        "0x8e31D4A303eDEeE7ca509CCC8D5965f50D6B25D8"
+        "kinto:0x8e31D4A303eDEeE7ca509CCC8D5965f50D6B25D8"
      values.pendingSanctions.208._to:
-        "0x90231e5318110108B4748c67c9119CD8Ef28D0f0"
+        "kinto:0x90231e5318110108B4748c67c9119CD8Ef28D0f0"
      values.pendingSanctions.209._to:
-        "0x917A716dA88cE955f56A2C61313eeB1a1C80eC5b"
+        "kinto:0x917A716dA88cE955f56A2C61313eeB1a1C80eC5b"
      values.pendingSanctions.210._to:
-        "0x91aDe5800dB3eBE7E103CFc05069487B00AE45ba"
+        "kinto:0x91aDe5800dB3eBE7E103CFc05069487B00AE45ba"
      values.pendingSanctions.211._to:
-        "0x92c248622427367b4cfa70e60C038c63B148C748"
+        "kinto:0x92c248622427367b4cfa70e60C038c63B148C748"
      values.pendingSanctions.212._to:
-        "0x9381d90765A0cE4BE62e4cE9f115291C6244862E"
+        "kinto:0x9381d90765A0cE4BE62e4cE9f115291C6244862E"
      values.pendingSanctions.213._to:
-        "0x95263Dab911Dd8B05ED1713f2549E9C8cf574323"
+        "kinto:0x95263Dab911Dd8B05ED1713f2549E9C8cf574323"
      values.pendingSanctions.214._to:
-        "0x9568D407b9BD55F20d20982306C6Feca5e43eb47"
+        "kinto:0x9568D407b9BD55F20d20982306C6Feca5e43eb47"
      values.pendingSanctions.215._to:
-        "0x962C00Ebc894Fb3e9B32AfE1dd1fa31A076e50e5"
+        "kinto:0x962C00Ebc894Fb3e9B32AfE1dd1fa31A076e50e5"
      values.pendingSanctions.216._to:
-        "0x96D4FD6006d1BBAF629feeAec1ddDB9D13bd5778"
+        "kinto:0x96D4FD6006d1BBAF629feeAec1ddDB9D13bd5778"
      values.pendingSanctions.217._to:
-        "0x9868A6E272365Ec421C3aF0690F5aa97121B91c4"
+        "kinto:0x9868A6E272365Ec421C3aF0690F5aa97121B91c4"
      values.pendingSanctions.218._to:
-        "0x9961e674Dc623dc69f6AF4fBF4E2F1FAbcbc44Ce"
+        "kinto:0x9961e674Dc623dc69f6AF4fBF4E2F1FAbcbc44Ce"
      values.pendingSanctions.219._to:
-        "0x9991bCFde3f20Cc14A893CcC3a32b81801C80253"
+        "kinto:0x9991bCFde3f20Cc14A893CcC3a32b81801C80253"
      values.pendingSanctions.220._to:
-        "0x9C31138FDb4baC14eAC4dbc0C4Ec8F1ea77E9682"
+        "kinto:0x9C31138FDb4baC14eAC4dbc0C4Ec8F1ea77E9682"
      values.pendingSanctions.221._to:
-        "0x9E339388d44B21E9d027ba95D71E08E75736CE0E"
+        "kinto:0x9E339388d44B21E9d027ba95D71E08E75736CE0E"
      values.pendingSanctions.222._to:
-        "0x9a46f537e8eA30BCCeDB0B7A2EBE03b16Df1170C"
+        "kinto:0x9a46f537e8eA30BCCeDB0B7A2EBE03b16Df1170C"
      values.pendingSanctions.223._to:
-        "0x9b70559E61949033dE5a90F58fD4ed051470B851"
+        "kinto:0x9b70559E61949033dE5a90F58fD4ed051470B851"
      values.pendingSanctions.224._to:
-        "0x9bfAd309FA457804B60FBec15Ec6D174111587f5"
+        "kinto:0x9bfAd309FA457804B60FBec15Ec6D174111587f5"
      values.pendingSanctions.225._to:
-        "0x9c41f1FB592aFE978726FCa785a8fD2b1c836006"
+        "kinto:0x9c41f1FB592aFE978726FCa785a8fD2b1c836006"
      values.pendingSanctions.226._to:
-        "0xA211445157D68B451006f8452eB7309A2313DC7a"
+        "kinto:0xA211445157D68B451006f8452eB7309A2313DC7a"
      values.pendingSanctions.227._to:
-        "0xA3a0A02e0866a95685062d7a1053912d6eda3E8B"
+        "kinto:0xA3a0A02e0866a95685062d7a1053912d6eda3E8B"
      values.pendingSanctions.228._to:
-        "0xA56c58a135fcE29642f7Fb8Cd4Df826Ee4f35528"
+        "kinto:0xA56c58a135fcE29642f7Fb8Cd4Df826Ee4f35528"
      values.pendingSanctions.229._to:
-        "0xA74B09B9f886ac101FDB1091147f4a67FE7c19e7"
+        "kinto:0xA74B09B9f886ac101FDB1091147f4a67FE7c19e7"
      values.pendingSanctions.230._to:
-        "0xA911DDC91FDBDBBe22dD219CA05DC8634e9255d2"
+        "kinto:0xA911DDC91FDBDBBe22dD219CA05DC8634e9255d2"
      values.pendingSanctions.231._to:
-        "0xA98522A6a33c97af048aB966460e3C57Cd44eB17"
+        "kinto:0xA98522A6a33c97af048aB966460e3C57Cd44eB17"
      values.pendingSanctions.232._to:
-        "0xAE932423eb4c00139dF70b2644CfF269b110E130"
+        "kinto:0xAE932423eb4c00139dF70b2644CfF269b110E130"
      values.pendingSanctions.233._to:
-        "0xAb96909d9a35150a249a55670e0bB8B8C583565b"
+        "kinto:0xAb96909d9a35150a249a55670e0bB8B8C583565b"
      values.pendingSanctions.234._to:
-        "0xB1bEaC3a3472436d9AA1f2D36aEaA2c215b66b9a"
+        "kinto:0xB1bEaC3a3472436d9AA1f2D36aEaA2c215b66b9a"
      values.pendingSanctions.235._to:
-        "0xB7522F061afb810b411a858769e2295A10080a32"
+        "kinto:0xB7522F061afb810b411a858769e2295A10080a32"
      values.pendingSanctions.236._to:
-        "0xB907Fd315C94FE2D2484B426f293D9980Da40A3d"
+        "kinto:0xB907Fd315C94FE2D2484B426f293D9980Da40A3d"
      values.pendingSanctions.237._to:
-        "0xB92293Fd1D65c09361f863bF4d202cff763CE9e4"
+        "kinto:0xB92293Fd1D65c09361f863bF4d202cff763CE9e4"
      values.pendingSanctions.238._to:
-        "0xBa5F9be8C94E2955deD0982Dc276023051bED0AA"
+        "kinto:0xBa5F9be8C94E2955deD0982Dc276023051bED0AA"
      values.pendingSanctions.239._to:
-        "0xBbaEb862386383C67045cF2e538b6f3BfA1e8f5a"
+        "kinto:0xBbaEb862386383C67045cF2e538b6f3BfA1e8f5a"
      values.pendingSanctions.240._to:
-        "0xC2068323986708a8b2480Bf491B4ad5921234EF7"
+        "kinto:0xC2068323986708a8b2480Bf491B4ad5921234EF7"
      values.pendingSanctions.241._to:
-        "0xC3124240b6faAC99FaCeaC43E9698efFc5A997ad"
+        "kinto:0xC3124240b6faAC99FaCeaC43E9698efFc5A997ad"
      values.pendingSanctions.242._to:
-        "0xC34bd93d87AB32D8fbb966A0666dAa1021A698c2"
+        "kinto:0xC34bd93d87AB32D8fbb966A0666dAa1021A698c2"
      values.pendingSanctions.243._to:
-        "0xC6235424501FF4dCEf8fC7C96DFD9474b40E95E6"
+        "kinto:0xC6235424501FF4dCEf8fC7C96DFD9474b40E95E6"
      values.pendingSanctions.244._to:
-        "0xC62595F9ec07A7b8FBE9BdC64926a80f1a7115bD"
+        "kinto:0xC62595F9ec07A7b8FBE9BdC64926a80f1a7115bD"
      values.pendingSanctions.245._to:
-        "0xC7370caAfFE87e1089b1E86f3D6dc6283effdb3E"
+        "kinto:0xC7370caAfFE87e1089b1E86f3D6dc6283effdb3E"
      values.pendingSanctions.246._to:
-        "0xCD856EfFC6ee06b8395bCD81d46884356680D658"
+        "kinto:0xCD856EfFC6ee06b8395bCD81d46884356680D658"
      values.pendingSanctions.247._to:
-        "0xCf4b2B67e584F71f0a888817Eab97061e0CcC139"
+        "kinto:0xCf4b2B67e584F71f0a888817Eab97061e0CcC139"
      values.pendingSanctions.248._to:
-        "0xCfcB156E4EB3f85A6FE1cec2DC83FBFEcF8Ee7FC"
+        "kinto:0xCfcB156E4EB3f85A6FE1cec2DC83FBFEcF8Ee7FC"
      values.pendingSanctions.249._to:
-        "0xD09E358552fC7Ce6F7E7BDDCE40e52fF1fE0745c"
+        "kinto:0xD09E358552fC7Ce6F7E7BDDCE40e52fF1fE0745c"
      values.pendingSanctions.250._to:
-        "0xD32f6b08314E52744d244c764d1DA85c04514f34"
+        "kinto:0xD32f6b08314E52744d244c764d1DA85c04514f34"
      values.pendingSanctions.251._to:
-        "0xD3Af5EAb05E1882439E8626F9102a0A0bDCa21DB"
+        "kinto:0xD3Af5EAb05E1882439E8626F9102a0A0bDCa21DB"
      values.pendingSanctions.252._to:
-        "0xD4a998c38f016cC342b7Abd9796113D596201be3"
+        "kinto:0xD4a998c38f016cC342b7Abd9796113D596201be3"
      values.pendingSanctions.253._to:
-        "0xD823abbe3EdAB9A7175EBbE13b2891A3356F06ab"
+        "kinto:0xD823abbe3EdAB9A7175EBbE13b2891A3356F06ab"
      values.pendingSanctions.254._to:
-        "0xD91110Bb87AEEFa8D74A274930804F7D61324f0E"
+        "kinto:0xD91110Bb87AEEFa8D74A274930804F7D61324f0E"
      values.pendingSanctions.255._to:
-        "0xDABa2f9fdEc6Bada2902B4453239332FE591d9ee"
+        "kinto:0xDABa2f9fdEc6Bada2902B4453239332FE591d9ee"
      values.pendingSanctions.256._to:
-        "0xDe2918Cb894ecC8BfD81eeD617DFF2a461700312"
+        "kinto:0xDe2918Cb894ecC8BfD81eeD617DFF2a461700312"
      values.pendingSanctions.257._to:
-        "0xE01874E2F6C78990F6a55Cb86B49ECCe070aEb0d"
+        "kinto:0xE01874E2F6C78990F6a55Cb86B49ECCe070aEb0d"
      values.pendingSanctions.258._to:
-        "0xE174390679C9Cb86e64131f9AA173FdC9C10b8af"
+        "kinto:0xE174390679C9Cb86e64131f9AA173FdC9C10b8af"
      values.pendingSanctions.259._to:
-        "0xE32AfFACe8f8f0f5A867FDe3d2C5ea1321dB83e8"
+        "kinto:0xE32AfFACe8f8f0f5A867FDe3d2C5ea1321dB83e8"
      values.pendingSanctions.260._to:
-        "0xE459e4bE9844131F5b26544cA60D56A034D26A3c"
+        "kinto:0xE459e4bE9844131F5b26544cA60D56A034D26A3c"
      values.pendingSanctions.261._to:
-        "0xE6f4103fCbdae587756C8273a440DFf8BA4Bb21a"
+        "kinto:0xE6f4103fCbdae587756C8273a440DFf8BA4Bb21a"
      values.pendingSanctions.262._to:
-        "0xE9D67E87DD59b29876CF0E1ace667cAE39210fa8"
+        "kinto:0xE9D67E87DD59b29876CF0E1ace667cAE39210fa8"
      values.pendingSanctions.263._to:
-        "0xEA240C87B28a5074abbb34058935AD26391e6126"
+        "kinto:0xEA240C87B28a5074abbb34058935AD26391e6126"
      values.pendingSanctions.264._to:
-        "0xF53eEd3bD238d4038e8e2699e832323A03500D0e"
+        "kinto:0xF53eEd3bD238d4038e8e2699e832323A03500D0e"
      values.pendingSanctions.265._to:
-        "0xF8e3A7C50095B105dd049643f32531cDE57eBDA7"
+        "kinto:0xF8e3A7C50095B105dd049643f32531cDE57eBDA7"
      values.pendingSanctions.266._to:
-        "0xF936497C1E9215fdf91E0332c6D6D50b528Df14d"
+        "kinto:0xF936497C1E9215fdf91E0332c6D6D50b528Df14d"
      values.pendingSanctions.267._to:
-        "0xFCF53d74a16e899b576eb86FDBb76006854Ef763"
+        "kinto:0xFCF53d74a16e899b576eb86FDBb76006854Ef763"
      values.pendingSanctions.268._to:
-        "0xFDFEb1b9F613E2CB841E493B5359c124De59499e"
+        "kinto:0xFDFEb1b9F613E2CB841E493B5359c124De59499e"
      values.pendingSanctions.269._to:
-        "0xFff5B9B7bf09DfC42865cDaDAA161f14Fd54498d"
+        "kinto:0xFff5B9B7bf09DfC42865cDaDAA161f14Fd54498d"
      values.pendingSanctions.270._to:
-        "0xaACA709AaD0E99891A16c4e2028Ad5053cEeB2b0"
+        "kinto:0xaACA709AaD0E99891A16c4e2028Ad5053cEeB2b0"
      values.pendingSanctions.271._to:
-        "0xaB769943901Bb757cf5048B122f4A2D5D0aEE957"
+        "kinto:0xaB769943901Bb757cf5048B122f4A2D5D0aEE957"
      values.pendingSanctions.272._to:
-        "0xaBA02c3024E1b5A8dfA53f7bD82d6B75B8C7Fea2"
+        "kinto:0xaBA02c3024E1b5A8dfA53f7bD82d6B75B8C7Fea2"
      values.pendingSanctions.273._to:
-        "0xaE815562105d42a06D06ff31139A63eE3F72128a"
+        "kinto:0xaE815562105d42a06D06ff31139A63eE3F72128a"
      values.pendingSanctions.274._to:
-        "0xaE8C34b3eB7bcc21085eB819d23afF8687B449fE"
+        "kinto:0xaE8C34b3eB7bcc21085eB819d23afF8687B449fE"
      values.pendingSanctions.275._to:
-        "0xaEB8b6bB09c44c6eE9524Bf6a7842531e8870217"
+        "kinto:0xaEB8b6bB09c44c6eE9524Bf6a7842531e8870217"
      values.pendingSanctions.276._to:
-        "0xaa7Fc1a0c9fcb6721a082740d7E4BC0885951d7a"
+        "kinto:0xaa7Fc1a0c9fcb6721a082740d7E4BC0885951d7a"
      values.pendingSanctions.277._to:
-        "0xac2ec1ec2E53098Ebbd36753187CDDf7E3d438AB"
+        "kinto:0xac2ec1ec2E53098Ebbd36753187CDDf7E3d438AB"
      values.pendingSanctions.278._to:
-        "0xb064e41602F2EA83741161A27DC045A6dD7F6b93"
+        "kinto:0xb064e41602F2EA83741161A27DC045A6dD7F6b93"
      values.pendingSanctions.279._to:
-        "0xb2F1d7867fD8d1501f5747676823f8d27a6a12f2"
+        "kinto:0xb2F1d7867fD8d1501f5747676823f8d27a6a12f2"
      values.pendingSanctions.280._to:
-        "0xb4696a1465286802b7Bc8E39120B10F951E07C4d"
+        "kinto:0xb4696a1465286802b7Bc8E39120B10F951E07C4d"
      values.pendingSanctions.281._to:
-        "0xb6753e1DEbD7e615bC9c89aF2D2b8580F6B06b13"
+        "kinto:0xb6753e1DEbD7e615bC9c89aF2D2b8580F6B06b13"
      values.pendingSanctions.282._to:
-        "0xbDbb9De0ee5c3CC100bf0DcF0e11881Ea568307D"
+        "kinto:0xbDbb9De0ee5c3CC100bf0DcF0e11881Ea568307D"
      values.pendingSanctions.283._to:
-        "0xbd0e49D0dA6F10e8A74964e8282B86900396f7A3"
+        "kinto:0xbd0e49D0dA6F10e8A74964e8282B86900396f7A3"
      values.pendingSanctions.284._to:
-        "0xc77D572231C4b8bfe3c4DB4aF478ad17FEBA0648"
+        "kinto:0xc77D572231C4b8bfe3c4DB4aF478ad17FEBA0648"
      values.pendingSanctions.285._to:
-        "0xc884086a4e38a1072a0B4ED81054E9eEc92637ae"
+        "kinto:0xc884086a4e38a1072a0B4ED81054E9eEc92637ae"
      values.pendingSanctions.286._to:
-        "0xcd82cdd2023BCc783bef35fDb86a70baA368c2c3"
+        "kinto:0xcd82cdd2023BCc783bef35fDb86a70baA368c2c3"
      values.pendingSanctions.287._to:
-        "0xd0FeC78B636fb50f4cBbf9408B5369f34A7E6060"
+        "kinto:0xd0FeC78B636fb50f4cBbf9408B5369f34A7E6060"
      values.pendingSanctions.288._to:
-        "0xd138D5DBA662DE76F6Ce4EB60CA486313Ab7d15C"
+        "kinto:0xd138D5DBA662DE76F6Ce4EB60CA486313Ab7d15C"
      values.pendingSanctions.289._to:
-        "0xd382432B50d12b5803A7D666662320ceEe22313f"
+        "kinto:0xd382432B50d12b5803A7D666662320ceEe22313f"
      values.pendingSanctions.290._to:
-        "0xd9E77167C8b13b9D1AFF04CC469Ad55BEeB78358"
+        "kinto:0xd9E77167C8b13b9D1AFF04CC469Ad55BEeB78358"
      values.pendingSanctions.291._to:
-        "0xdCfA8062948095423c6117a327949198519741b0"
+        "kinto:0xdCfA8062948095423c6117a327949198519741b0"
      values.pendingSanctions.292._to:
-        "0xdE2c001797a4a6e8784743FB1835F82efb95b18f"
+        "kinto:0xdE2c001797a4a6e8784743FB1835F82efb95b18f"
      values.pendingSanctions.293._to:
-        "0xdF45DcC1C326Af55ac389D09327d79699839E31b"
+        "kinto:0xdF45DcC1C326Af55ac389D09327d79699839E31b"
      values.pendingSanctions.294._to:
-        "0xdFc1f20b21259ee313d20D33D46D54691E4371CB"
+        "kinto:0xdFc1f20b21259ee313d20D33D46D54691E4371CB"
      values.pendingSanctions.295._to:
-        "0xda250570f0DBf9650C8f80989390e71118A64B51"
+        "kinto:0xda250570f0DBf9650C8f80989390e71118A64B51"
      values.pendingSanctions.296._to:
-        "0xe0d359F0f36d5eF22E1ee64135c572a076AaA826"
+        "kinto:0xe0d359F0f36d5eF22E1ee64135c572a076AaA826"
      values.pendingSanctions.297._to:
-        "0xe3f7A57629a00558EBD24100A9D26A66FD4EbAc3"
+        "kinto:0xe3f7A57629a00558EBD24100A9D26A66FD4EbAc3"
      values.pendingSanctions.298._to:
-        "0xe7e376c075D142f2b2A8de8708D723aC4a0d02aC"
+        "kinto:0xe7e376c075D142f2b2A8de8708D723aC4a0d02aC"
      values.pendingSanctions.299._to:
-        "0xeF4D08EbDAa2373Df18C12173898Ef09beb1Cd45"
+        "kinto:0xeF4D08EbDAa2373Df18C12173898Ef09beb1Cd45"
      values.pendingSanctions.300._to:
-        "0xeeAdb06d44f927b77C0bA23B257A4CfEa60EDfB7"
+        "kinto:0xeeAdb06d44f927b77C0bA23B257A4CfEa60EDfB7"
      values.pendingSanctions.301._to:
-        "0xf152EBa9da07Bec19fbd6078D9dB047E74687A6a"
+        "kinto:0xf152EBa9da07Bec19fbd6078D9dB047E74687A6a"
      values.pendingSanctions.302._to:
-        "0xf2670E8C64430F10163e53BD38e71741d18D7840"
+        "kinto:0xf2670E8C64430F10163e53BD38e71741d18D7840"
      values.pendingSanctions.303._to:
-        "0xf685Ca101dd7598Ec26244d8ff0f5abEa0F23509"
+        "kinto:0xf685Ca101dd7598Ec26244d8ff0f5abEa0F23509"
      values.pendingSanctions.304._to:
-        "0xfD73361D700410FC1513e91acf5E138d00a3dBe3"
+        "kinto:0xfD73361D700410FC1513e91acf5E138d00a3dBe3"
      values.pendingSanctions.305._to:
-        "0xfF4a476cf39589be4b6Ad7e4b36d7156710b5c3e"
+        "kinto:0xfF4a476cf39589be4b6Ad7e4b36d7156710b5c3e"
      values.pendingSanctions.306._to:
-        "0xfafdcA2FfEE318eaA4463003F6a99A16B8FEe45c"
+        "kinto:0xfafdcA2FfEE318eaA4463003F6a99A16B8FEe45c"
      values.pendingSanctions.307._to:
-        "0xfb02369649FABe532c600983C41840d54F4592a7"
+        "kinto:0xfb02369649FABe532c600983C41840d54F4592a7"
      values.pendingSanctions.308._to:
-        "0x127917d1A8308Da2a1400dB50346B4a3F17813d3"
+        "kinto:0x127917d1A8308Da2a1400dB50346B4a3F17813d3"
      values.pendingSanctions.309._to:
-        "0x69E657BD35BA291D6A299F47d10249F24C86edD8"
+        "kinto:0x69E657BD35BA291D6A299F47d10249F24C86edD8"
      values.pendingSanctions.310._to:
-        "0x32C4a3feAcff6592ed5a3878cFb839dD282f5807"
+        "kinto:0x32C4a3feAcff6592ed5a3878cFb839dD282f5807"
      values.pendingSanctions.311._to:
-        "0xC6138fB05b8c0536EB2Ea791D2504eA72420d7d7"
+        "kinto:0xC6138fB05b8c0536EB2Ea791D2504eA72420d7d7"
      values.pendingSanctions.312._to:
-        "0x2A2ad91467443Ef61c49d5957546554EDb90Fe8a"
+        "kinto:0x2A2ad91467443Ef61c49d5957546554EDb90Fe8a"
      values.pendingSanctions.313._to:
-        "0x73163b73F526F436DD3234a439c4b691f5Db6F0c"
+        "kinto:0x73163b73F526F436DD3234a439c4b691f5Db6F0c"
      values.pendingSanctions.314._to:
-        "0xFD357B4975C97d48DfC8C5D5E3130a5634b89B8D"
+        "kinto:0xFD357B4975C97d48DfC8C5D5E3130a5634b89B8D"
      values.pendingSanctions.315._to:
-        "0x4E5c14bc3E148C01d02f9086c889f6a7854eEa42"
+        "kinto:0x4E5c14bc3E148C01d02f9086c889f6a7854eEa42"
      values.pendingSanctions.316._to:
-        "0x96aA815610caed4095B525042156560Ac5dBC8e9"
+        "kinto:0x96aA815610caed4095B525042156560Ac5dBC8e9"
      values.pendingSanctions.317._to:
-        "0x65E24c0623336b5dae5b566Bb996863ffC36e877"
+        "kinto:0x65E24c0623336b5dae5b566Bb996863ffC36e877"
      values.pendingSanctions.318._to:
-        "0x2460b2b758ca5332725C9BebecAafd70eF004963"
+        "kinto:0x2460b2b758ca5332725C9BebecAafd70eF004963"
      values.pendingSanctions.319._to:
-        "0xbafC930Eff179386813D17AF4f70A7d367f37E55"
+        "kinto:0xbafC930Eff179386813D17AF4f70A7d367f37E55"
      values.pendingSanctions.320._to:
-        "0xB84a63047b0E7b6e1C670479C5ae682e6386d423"
+        "kinto:0xB84a63047b0E7b6e1C670479C5ae682e6386d423"
      values.pendingSanctions.321._to:
-        "0xf5B0cF796D4E58c74480Ddc20A701d7d159D7C70"
+        "kinto:0xf5B0cF796D4E58c74480Ddc20A701d7d159D7C70"
      values.pendingSanctions.322._to:
-        "0xcb1fb203B40de4EC7B685907D8901B249480e534"
+        "kinto:0xcb1fb203B40de4EC7B685907D8901B249480e534"
      values.pendingSanctions.323._to:
-        "0x5eD7850289599F6B2D54bEA67eBA966C4b7F0880"
+        "kinto:0x5eD7850289599F6B2D54bEA67eBA966C4b7F0880"
      values.pendingSanctions.324._to:
-        "0x7B33a8711b11e9db091451D01730E2640F331bB3"
+        "kinto:0x7B33a8711b11e9db091451D01730E2640F331bB3"
+++ description: addresses unsanctioned manually by any KYC_PROVIDER role. Mind that sanctions also expire if not confirmed (and those do not emit).
      values.removedSanctions.0:
-        "0x52F09693c9eEaA93A64BA697e3d3e43a1eB65477"
+        "kinto:0x52F09693c9eEaA93A64BA697e3d3e43a1eB65477"
+++ description: addresses unsanctioned manually by any KYC_PROVIDER role. Mind that sanctions also expire if not confirmed (and those do not emit).
      values.removedSanctions.1:
-        "0x015374c2Dc040eE1c40739936C72D5F035186f0f"
+        "kinto:0x015374c2Dc040eE1c40739936C72D5F035186f0f"
+++ description: addresses unsanctioned manually by any KYC_PROVIDER role. Mind that sanctions also expire if not confirmed (and those do not emit).
      values.removedSanctions.2:
-        "0xdb563dA812f5d90727bb12a0959F5679B9a2Ea5F"
+        "kinto:0xdb563dA812f5d90727bb12a0959F5679B9a2Ea5F"
+++ description: addresses unsanctioned manually by any KYC_PROVIDER role. Mind that sanctions also expire if not confirmed (and those do not emit).
      values.removedSanctions.3:
-        "0x49aEa6275e1D94Df2AC90c3ee4e4afd47e468d71"
+        "kinto:0x49aEa6275e1D94Df2AC90c3ee4e4afd47e468d71"
+++ description: addresses unsanctioned manually by any KYC_PROVIDER role. Mind that sanctions also expire if not confirmed (and those do not emit).
      values.removedSanctions.4:
-        "0x1B2888e792e82fe352FC9D1E73cdc91C6217F55c"
+        "kinto:0x1B2888e792e82fe352FC9D1E73cdc91C6217F55c"
+++ severity: HIGH
      values.UPGRADERs.0:
-        "0xacC000818e5Bbd911D5d449aA81CB5cA24024739"
+        "kinto:0xacC000818e5Bbd911D5d449aA81CB5cA24024739"
      values.walletFactory:
-        "0x8a4720488CA32f1223ccFE5A087e250fE3BC5D75"
+        "kinto:0x8a4720488CA32f1223ccFE5A087e250fE3BC5D75"
      implementationNames.0xf369f78E3A0492CC4e96a90dae0728A38498e9c7:
-        "BlitkinProxy"
      implementationNames.0x1d61772AE2e157f9F6A4127526eD86AB5801a477:
-        "KintoID"
      implementationNames.kinto:0xf369f78E3A0492CC4e96a90dae0728A38498e9c7:
+        "BlitkinProxy"
      implementationNames.kinto:0x1d61772AE2e157f9F6A4127526eD86AB5801a477:
+        "KintoID"
    }
```

```diff
+   Status: CREATED
    contract NioGuardians (0x0100005D52Be9ab3ccE0C70Abf6F6FA2C48e91C9)
    +++ description: Contract using NFTs as voting tokens to be used by Nio Guardians in the NioGovernor.
```

```diff
+   Status: CREATED
    contract NioGovernor (0x010600ff5f36C8eF3b6Aaf2A88C2DE85C798594a)
    +++ description: Governance contract allowing token- and NFT based voting.
```

```diff
+   Status: CREATED
    contract Faucet (0x0719D47A213149E2Ef8d3f5afDaDA8a8E22dfc03)
    +++ description: None
```

```diff
+   Status: CREATED
    contract SponsorPaymaster (0x1842a4EFf3eFd24c50B63c3CF89cECEe245Fc2bd)
    +++ description: Paymaster used for user transactions eligible for sponsorship.
```

```diff
+   Status: CREATED
    contract EntryPoint (0x2843C269D2a64eCfA63548E8B3Fc0FD23B7F70cb)
    +++ description: Used as entrypoint to transact using smartwallets and UserOps.
```

```diff
+   Status: CREATED
    contract Kinto Multisig 2 (0x2e2B1c42E38f5af81771e65D87729E57ABD1337a)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Socket (0x3e9727470C66B1e77034590926CDe0242B5A3dCc)
    +++ description: Central contract for bridging via the external socket bridge.
```

```diff
+   Status: CREATED
    contract KintoAppRegistry (0x5A2b641b84b0230C8e75F55d5afd27f4Dbd59d5b)
    +++ description: Central system contract defining addresses that are allowed to be called by EOAs. The modified Kinto node reads this configuration and drops all other transactions from EOAs (enforced by a modified state transition function). As a result, users can only transact using a canonical smart wallet.
```

```diff
+   Status: CREATED
    contract BeaconKintoWallet (0x87f0eE85bF3198654900a422832157abBba30828)
    +++ description: Beacon proxy for the KintoWallet smartwallet implementation that is used for all users.
```

```diff
+   Status: CREATED
    contract KintoWalletFactory (0x8a4720488CA32f1223ccFE5A087e250fE3BC5D75)
    +++ description: Deploys new KintoWallet smartwallets for users upon passing KYC checks. Also manages the beacon implementation for all KintoWallets and their recovery logic. KintoWallets can be funded with ETH via this contract.
```

```diff
+   Status: CREATED
    contract BundleBulker (0x8d2D899402ed84b6c0510bB1ad34ee436ADDD20d)
    +++ description: None
```

```diff
+   Status: CREATED
    contract AccessManager (0xacC000818e5Bbd911D5d449aA81CB5cA24024739)
    +++ description: OpenZeppelin AccessManager contract: Serves as a proxy contract defining the roles, permissions and delays to call functions in target contracts.
```

```diff
+   Status: CREATED
    contract KintoID (0xf369f78E3A0492CC4e96a90dae0728A38498e9c7)
    +++ description: Manages Kinto's KYC system: The KYC_PROVIDER roles responsible for managing the KYC status and KYC metadata of user wallets. Each KintoWallet checks the KYC status of its user in this contract as part of the signature check.
```

Generated with discovered.json: 0x908b7c5321bdc9dcdb6999a03d9825f83a26b6f4

# Diff at Fri, 04 Jul 2025 12:19:05 GMT:

- chain: ethereum
- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@1f56dc47fe915564d4555300304da4d3bcbc087f block: 22593509
- current block number: 22593509

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22593509 (main branch discovery), not current.

```diff
    contract Kinto Security Council (0x17Eb10e12a78f986C78F973Fc70eD88072B33B7d) {
    +++ description: None
      receivedPermissions.0.via.0.address:
-        "ethereum:0x59B851c8b1643e0735Ec3F2f0e528f3d89c3408a"
+        "eth:0x59B851c8b1643e0735Ec3F2f0e528f3d89c3408a"
      receivedPermissions.0.from:
-        "ethereum:0x5073dA9cA4810f3E0aA01c20c7d9d02C3f522e11"
+        "eth:0x5073dA9cA4810f3E0aA01c20c7d9d02C3f522e11"
      receivedPermissions.1.via.0.address:
-        "ethereum:0x59B851c8b1643e0735Ec3F2f0e528f3d89c3408a"
+        "eth:0x59B851c8b1643e0735Ec3F2f0e528f3d89c3408a"
      receivedPermissions.1.from:
-        "ethereum:0x5073dA9cA4810f3E0aA01c20c7d9d02C3f522e11"
+        "eth:0x5073dA9cA4810f3E0aA01c20c7d9d02C3f522e11"
      receivedPermissions.2.via.1.address:
-        "ethereum:0x59B851c8b1643e0735Ec3F2f0e528f3d89c3408a"
+        "eth:0x59B851c8b1643e0735Ec3F2f0e528f3d89c3408a"
      receivedPermissions.2.via.0.address:
-        "ethereum:0x74C717C01425eb475A5fC55d2A4a9045fC9800df"
+        "eth:0x74C717C01425eb475A5fC55d2A4a9045fC9800df"
      receivedPermissions.2.from:
-        "ethereum:0x52EcE832AF3DF3125BbfD6423E0425dB3fA99D3F"
+        "eth:0x52EcE832AF3DF3125BbfD6423E0425dB3fA99D3F"
      receivedPermissions.3.via.1.address:
-        "ethereum:0x59B851c8b1643e0735Ec3F2f0e528f3d89c3408a"
+        "eth:0x59B851c8b1643e0735Ec3F2f0e528f3d89c3408a"
      receivedPermissions.3.via.0.address:
-        "ethereum:0x74C717C01425eb475A5fC55d2A4a9045fC9800df"
+        "eth:0x74C717C01425eb475A5fC55d2A4a9045fC9800df"
      receivedPermissions.3.from:
-        "ethereum:0x59B851c8b1643e0735Ec3F2f0e528f3d89c3408a"
+        "eth:0x59B851c8b1643e0735Ec3F2f0e528f3d89c3408a"
      receivedPermissions.4.via.1.address:
-        "ethereum:0x59B851c8b1643e0735Ec3F2f0e528f3d89c3408a"
+        "eth:0x59B851c8b1643e0735Ec3F2f0e528f3d89c3408a"
      receivedPermissions.4.via.0.address:
-        "ethereum:0x74C717C01425eb475A5fC55d2A4a9045fC9800df"
+        "eth:0x74C717C01425eb475A5fC55d2A4a9045fC9800df"
      receivedPermissions.4.from:
-        "ethereum:0x6228e2FB8C561f1a5A963039Bc38Eb6D539A1A7F"
+        "eth:0x6228e2FB8C561f1a5A963039Bc38Eb6D539A1A7F"
      receivedPermissions.5.via.1.address:
-        "ethereum:0x59B851c8b1643e0735Ec3F2f0e528f3d89c3408a"
+        "eth:0x59B851c8b1643e0735Ec3F2f0e528f3d89c3408a"
      receivedPermissions.5.via.0.address:
-        "ethereum:0x74C717C01425eb475A5fC55d2A4a9045fC9800df"
+        "eth:0x74C717C01425eb475A5fC55d2A4a9045fC9800df"
      receivedPermissions.5.from:
-        "ethereum:0x655761AD5FC251F414D6993A73184B0669F278c8"
+        "eth:0x655761AD5FC251F414D6993A73184B0669F278c8"
      receivedPermissions.6.via.1.address:
-        "ethereum:0x59B851c8b1643e0735Ec3F2f0e528f3d89c3408a"
+        "eth:0x59B851c8b1643e0735Ec3F2f0e528f3d89c3408a"
      receivedPermissions.6.via.0.address:
-        "ethereum:0x74C717C01425eb475A5fC55d2A4a9045fC9800df"
+        "eth:0x74C717C01425eb475A5fC55d2A4a9045fC9800df"
      receivedPermissions.6.from:
-        "ethereum:0x7870D5398DB488c669B406fBE57b8d05b6A35e42"
+        "eth:0x7870D5398DB488c669B406fBE57b8d05b6A35e42"
      receivedPermissions.7.via.1.address:
-        "ethereum:0x59B851c8b1643e0735Ec3F2f0e528f3d89c3408a"
+        "eth:0x59B851c8b1643e0735Ec3F2f0e528f3d89c3408a"
      receivedPermissions.7.via.0.address:
-        "ethereum:0x74C717C01425eb475A5fC55d2A4a9045fC9800df"
+        "eth:0x74C717C01425eb475A5fC55d2A4a9045fC9800df"
      receivedPermissions.7.from:
-        "ethereum:0x859a53Fe2C8DA961387030E7CB498D6D20d0B2DB"
+        "eth:0x859a53Fe2C8DA961387030E7CB498D6D20d0B2DB"
      receivedPermissions.8.via.1.address:
-        "ethereum:0x59B851c8b1643e0735Ec3F2f0e528f3d89c3408a"
+        "eth:0x59B851c8b1643e0735Ec3F2f0e528f3d89c3408a"
      receivedPermissions.8.via.0.address:
-        "ethereum:0x74C717C01425eb475A5fC55d2A4a9045fC9800df"
+        "eth:0x74C717C01425eb475A5fC55d2A4a9045fC9800df"
      receivedPermissions.8.from:
-        "ethereum:0xBFfaA85c1756472fFC37e6D172A7eC0538C14474"
+        "eth:0xBFfaA85c1756472fFC37e6D172A7eC0538C14474"
      receivedPermissions.9.via.1.address:
-        "ethereum:0x59B851c8b1643e0735Ec3F2f0e528f3d89c3408a"
+        "eth:0x59B851c8b1643e0735Ec3F2f0e528f3d89c3408a"
      receivedPermissions.9.via.0.address:
-        "ethereum:0x74C717C01425eb475A5fC55d2A4a9045fC9800df"
+        "eth:0x74C717C01425eb475A5fC55d2A4a9045fC9800df"
      receivedPermissions.9.from:
-        "ethereum:0xD9041DeCaDcBA88844b373e7053B4AC7A3390D60"
+        "eth:0xD9041DeCaDcBA88844b373e7053B4AC7A3390D60"
      receivedPermissions.10.via.1.address:
-        "ethereum:0x59B851c8b1643e0735Ec3F2f0e528f3d89c3408a"
+        "eth:0x59B851c8b1643e0735Ec3F2f0e528f3d89c3408a"
      receivedPermissions.10.via.0.address:
-        "ethereum:0x74C717C01425eb475A5fC55d2A4a9045fC9800df"
+        "eth:0x74C717C01425eb475A5fC55d2A4a9045fC9800df"
      receivedPermissions.10.from:
-        "ethereum:0xF4Ef823D57819AC7202a081A5B49376BD28E7b3a"
+        "eth:0xF4Ef823D57819AC7202a081A5B49376BD28E7b3a"
      directlyReceivedPermissions.0.from:
-        "ethereum:0x59B851c8b1643e0735Ec3F2f0e528f3d89c3408a"
+        "eth:0x59B851c8b1643e0735Ec3F2f0e528f3d89c3408a"
    }
```

```diff
    EOA Ankr (0x2bfDA59220413DEd39dD0E443620b5277EcE6348) {
    +++ description: None
      receivedPermissions.0.from:
-        "ethereum:0x5073dA9cA4810f3E0aA01c20c7d9d02C3f522e11"
+        "eth:0x5073dA9cA4810f3E0aA01c20c7d9d02C3f522e11"
    }
```

```diff
    EOA Hypernative2 (0x58028fFbc25aE2e12b96276bDB125955F41D41f3) {
    +++ description: None
      receivedPermissions.0.from:
-        "ethereum:0x5073dA9cA4810f3E0aA01c20c7d9d02C3f522e11"
+        "eth:0x5073dA9cA4810f3E0aA01c20c7d9d02C3f522e11"
    }
```

```diff
    contract UpgradeExecutor (0x59B851c8b1643e0735Ec3F2f0e528f3d89c3408a) {
    +++ description: Central contract defining the access control permissions for upgrading the system contract implementations.
      directlyReceivedPermissions.0.from:
-        "ethereum:0x74C717C01425eb475A5fC55d2A4a9045fC9800df"
+        "eth:0x74C717C01425eb475A5fC55d2A4a9045fC9800df"
      directlyReceivedPermissions.1.from:
-        "ethereum:0x5073dA9cA4810f3E0aA01c20c7d9d02C3f522e11"
+        "eth:0x5073dA9cA4810f3E0aA01c20c7d9d02C3f522e11"
      directlyReceivedPermissions.2.from:
-        "ethereum:0x5073dA9cA4810f3E0aA01c20c7d9d02C3f522e11"
+        "eth:0x5073dA9cA4810f3E0aA01c20c7d9d02C3f522e11"
    }
```

```diff
    EOA Caldera2 (0x64Cf65036a76E3827e448cadbc53D31EefDCE04a) {
    +++ description: None
      receivedPermissions.0.from:
-        "ethereum:0x5073dA9cA4810f3E0aA01c20c7d9d02C3f522e11"
+        "eth:0x5073dA9cA4810f3E0aA01c20c7d9d02C3f522e11"
    }
```

```diff
    contract ProxyAdmin (0x74C717C01425eb475A5fC55d2A4a9045fC9800df) {
    +++ description: None
      directlyReceivedPermissions.0.from:
-        "ethereum:0x52EcE832AF3DF3125BbfD6423E0425dB3fA99D3F"
+        "eth:0x52EcE832AF3DF3125BbfD6423E0425dB3fA99D3F"
      directlyReceivedPermissions.1.from:
-        "ethereum:0x59B851c8b1643e0735Ec3F2f0e528f3d89c3408a"
+        "eth:0x59B851c8b1643e0735Ec3F2f0e528f3d89c3408a"
      directlyReceivedPermissions.2.from:
-        "ethereum:0x6228e2FB8C561f1a5A963039Bc38Eb6D539A1A7F"
+        "eth:0x6228e2FB8C561f1a5A963039Bc38Eb6D539A1A7F"
      directlyReceivedPermissions.3.from:
-        "ethereum:0x655761AD5FC251F414D6993A73184B0669F278c8"
+        "eth:0x655761AD5FC251F414D6993A73184B0669F278c8"
      directlyReceivedPermissions.4.from:
-        "ethereum:0x7870D5398DB488c669B406fBE57b8d05b6A35e42"
+        "eth:0x7870D5398DB488c669B406fBE57b8d05b6A35e42"
      directlyReceivedPermissions.5.from:
-        "ethereum:0x859a53Fe2C8DA961387030E7CB498D6D20d0B2DB"
+        "eth:0x859a53Fe2C8DA961387030E7CB498D6D20d0B2DB"
      directlyReceivedPermissions.6.from:
-        "ethereum:0xBFfaA85c1756472fFC37e6D172A7eC0538C14474"
+        "eth:0xBFfaA85c1756472fFC37e6D172A7eC0538C14474"
      directlyReceivedPermissions.7.from:
-        "ethereum:0xD9041DeCaDcBA88844b373e7053B4AC7A3390D60"
+        "eth:0xD9041DeCaDcBA88844b373e7053B4AC7A3390D60"
      directlyReceivedPermissions.8.from:
-        "ethereum:0xF4Ef823D57819AC7202a081A5B49376BD28E7b3a"
+        "eth:0xF4Ef823D57819AC7202a081A5B49376BD28E7b3a"
    }
```

```diff
    EOA MamoriLabs3 (0x944eB0a2829A859959586b10D54229278534a696) {
    +++ description: None
      receivedPermissions.0.from:
-        "ethereum:0x5073dA9cA4810f3E0aA01c20c7d9d02C3f522e11"
+        "eth:0x5073dA9cA4810f3E0aA01c20c7d9d02C3f522e11"
    }
```

```diff
    EOA  (0xe27f3f6db6824def1738b2aACe2672aC59046a39) {
    +++ description: None
      receivedPermissions.0.from:
-        "ethereum:0xF4Ef823D57819AC7202a081A5B49376BD28E7b3a"
+        "eth:0xF4Ef823D57819AC7202a081A5B49376BD28E7b3a"
    }
```

```diff
    EOA Venn2 (0xe528E74302FFCF6F9F6a1c973968d98F0fDbad8f) {
    +++ description: None
      receivedPermissions.0.from:
-        "ethereum:0x5073dA9cA4810f3E0aA01c20c7d9d02C3f522e11"
+        "eth:0x5073dA9cA4810f3E0aA01c20c7d9d02C3f522e11"
    }
```

```diff
    contract Kinto Multisig (0xf152Abda9E4ce8b134eF22Dc3C6aCe19C4895D82) {
    +++ description: None
      receivedPermissions.0.from:
-        "ethereum:0x0f1b7bd7762662B23486320AA91F30312184f70C"
+        "eth:0x0f1b7bd7762662B23486320AA91F30312184f70C"
    }
```

Generated with discovered.json: 0x75f684638761e90e73ec56062471ccffb58df287

# Diff at Thu, 03 Jul 2025 10:57:03 GMT:

- chain: kinto
- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@fa3b82adfb9dedeb2acea8fde7b79e65d59fb2b6 block: 884077
- current block number: 884077

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 884077 (main branch discovery), not current.

```diff
    contract BeaconKintoWallet (0x87f0eE85bF3198654900a422832157abBba30828) {
    +++ description: Beacon proxy for the KintoWallet smartwallet implementation that is used for all users.
      description:
-        "A beacon with an upgradeable implementation currently set as 0xbFE260680514e0D669fdC5A5f7334b97a5513d9D. Beacon proxy contracts pointing to this beacon will all use its implementation."
+        "Beacon proxy for the KintoWallet smartwallet implementation that is used for all users."
    }
```

Generated with discovered.json: 0x87162635161c8e2715f4691f8600aa3de1c604d0

# Diff at Wed, 18 Jun 2025 12:22:57 GMT:

- chain: kinto
- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@a8e4f22a1441bd5040898cc3d3d62b3582942b65 block: 879756
- current block number: 884077

## Description

dev helper role granted, no risk changes.

## Watched changes

```diff
    contract AccessManager (0xacC000818e5Bbd911D5d449aA81CB5cA24024739) {
    +++ description: OpenZeppelin AccessManager contract: Serves as a proxy contract defining the roles, permissions and delays to call functions in target contracts.
      values.accessControl.roles.DEV_HELPER_ROLE:
+        {"members":[{"member":"0x2e2B1c42E38f5af81771e65D87729E57ABD1337a","since":1749945326,"executionDelay":0}]}
+++ description: List of roles granted to accounts.
+++ severity: HIGH
      values.RolesGranted.12665434841745889720:
+        [{"account":"0x2e2B1c42E38f5af81771e65D87729E57ABD1337a","delay":0,"since":1749945326,"newMember":true}]
    }
```

Generated with discovered.json: 0x7f38d4698e2645d2a42e73762064032020b9125e

# Diff at Wed, 18 Jun 2025 12:22:57 GMT:

- chain: ethereum
- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@a8e4f22a1441bd5040898cc3d3d62b3582942b65 block: 22593509
- current block number: 22593509

## Description

config: wasmmoduleroot map updated.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22593509 (main branch discovery), not current.

```diff
    contract RollupProxy (0x5073dA9cA4810f3E0aA01c20c7d9d02C3f522e11) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      usedTypes.0.arg.0xdb698a2576298f25448bc092e52cf13b1e24141c997135d70f217d674bbeb69a:
+        "ArbOS v40 wasmModuleRoot"
    }
```

Generated with discovered.json: 0xdcda609e079286daaa7207e5afbf95c1184cefc3

# Diff at Mon, 09 Jun 2025 10:57:39 GMT:

- chain: kinto
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@7cc006dadcc55e6cce3be3eb03d491835943fb43 block: 877400
- current block number: 879756

## Description

new pending sanction (not confirmed by the Security Council).

## Watched changes

```diff
    contract KintoID (0xf369f78E3A0492CC4e96a90dae0728A38498e9c7) {
    +++ description: Manages Kinto's KYC system: The KYC_PROVIDER roles responsible for managing the KYC status and KYC metadata of user wallets. Each KintoWallet checks the KYC status of its user in this contract as part of the signature check.
+++ description: addresses sanctioned by any KYC_PROVIDER role.
      values.pendingSanctions.324:
+        {"_to":"0x19CC0e919b58e0d0eF7BaeBb103f72dee1031978","_timestamp":1706580004}
      values.pendingSanctions.323._to:
-        "0x19CC0e919b58e0d0eF7BaeBb103f72dee1031978"
+        "0x467Fa5244cd8386581635646F12E13C05Ad0f41F"
      values.pendingSanctions.323._timestamp:
-        1706580004
+        1718846703
      values.pendingSanctions.322._to:
-        "0x467Fa5244cd8386581635646F12E13C05Ad0f41F"
+        "0x70E21B6fB6835652642568Dd0143C2821e7EBC01"
      values.pendingSanctions.322._timestamp:
-        1718846703
+        1743368147
      values.pendingSanctions.321._to:
-        "0x70E21B6fB6835652642568Dd0143C2821e7EBC01"
+        "0x3CfA8C0e6eEb1e601f76355A82f583232b186a7D"
      values.pendingSanctions.321._timestamp:
-        1743368147
+        1706580004
      values.pendingSanctions.320._to:
-        "0x3CfA8C0e6eEb1e601f76355A82f583232b186a7D"
+        "0x275edFf82EB0c3845edaBa411D7A5bE31486C2B6"
      values.pendingSanctions.320._timestamp:
-        1706580004
+        1710367221
      values.pendingSanctions.319._to:
-        "0x275edFf82EB0c3845edaBa411D7A5bE31486C2B6"
+        "0x5718c0f092Da70702A0fC284d5C86C3EeDa218Ae"
      values.pendingSanctions.319._timestamp:
-        1710367221
+        1743368131
      values.pendingSanctions.318._to:
-        "0x5718c0f092Da70702A0fC284d5C86C3EeDa218Ae"
+        "0x83cCA28493b1940a16b6c22B77C7146C40463eD2"
      values.pendingSanctions.318._timestamp:
-        1743368131
+        1743368167
      values.pendingSanctions.317._to:
-        "0x83cCA28493b1940a16b6c22B77C7146C40463eD2"
+        "0xC62595F9ec07A7b8FBE9BdC64926a80f1a7115bD"
      values.pendingSanctions.317._timestamp:
-        1743368167
+        1743368220
      values.pendingSanctions.316._to:
-        "0xC62595F9ec07A7b8FBE9BdC64926a80f1a7115bD"
+        "0x685d6B0088397A00790DBDE7B3Ab8fAA7841a809"
      values.pendingSanctions.316._timestamp:
-        1743368220
+        1743368147
      values.pendingSanctions.315._to:
-        "0x685d6B0088397A00790DBDE7B3Ab8fAA7841a809"
+        "0x5cCF7b5170F0292106A6df1F111958ff62e8Edd3"
      values.pendingSanctions.315._timestamp:
-        1743368147
+        1743368131
      values.pendingSanctions.314._to:
-        "0x5cCF7b5170F0292106A6df1F111958ff62e8Edd3"
+        "0x81eEd39FC79B50DeBBcaEfc05221e9631Fb3b20f"
      values.pendingSanctions.314._timestamp:
-        1743368131
+        1743368167
      values.pendingSanctions.313._to:
-        "0x81eEd39FC79B50DeBBcaEfc05221e9631Fb3b20f"
+        "0x9961e674Dc623dc69f6AF4fBF4E2F1FAbcbc44Ce"
      values.pendingSanctions.313._timestamp:
-        1743368167
+        1743368190
      values.pendingSanctions.312._to:
-        "0x9961e674Dc623dc69f6AF4fBF4E2F1FAbcbc44Ce"
+        "0x8631D1Aa293c92A79C7717d933B785EcCF61b1ae"
      values.pendingSanctions.312._timestamp:
-        1743368190
+        1743368167
      values.pendingSanctions.311._to:
-        "0x8631D1Aa293c92A79C7717d933B785EcCF61b1ae"
+        "0xBD85550C39dE4844E501A278D6b632FbE68cF70F"
      values.pendingSanctions.311._timestamp:
-        1743368167
+        1716580853
      values.pendingSanctions.310._to:
-        "0xBD85550C39dE4844E501A278D6b632FbE68cF70F"
+        "0x4C2eEe16F3b55D45650c1a97bF329Fe810A517a2"
      values.pendingSanctions.310._timestamp:
-        1716580853
+        1743368117
      values.pendingSanctions.309._to:
-        "0x4C2eEe16F3b55D45650c1a97bF329Fe810A517a2"
+        "0x3Ee9cE9503bAa9a3CD4807Fa0146F848e3120b50"
      values.pendingSanctions.309._timestamp:
-        1743368117
+        1743368100
      values.pendingSanctions.308._to:
-        "0x3Ee9cE9503bAa9a3CD4807Fa0146F848e3120b50"
+        "0x3bB7Ff827729EB2F3cd419c67Fc3B151f22deDe7"
      values.pendingSanctions.307._to:
-        "0x3bB7Ff827729EB2F3cd419c67Fc3B151f22deDe7"
+        "0x5Da354DC30613Be81557323729b2bbE3D3D506d7"
      values.pendingSanctions.307._timestamp:
-        1743368100
+        1743368131
      values.pendingSanctions.306._to:
-        "0x5Da354DC30613Be81557323729b2bbE3D3D506d7"
+        "0x5383b0425760763baaa92677464C4E723Cdba191"
      values.pendingSanctions.305._to:
-        "0x5383b0425760763baaa92677464C4E723Cdba191"
+        "0x79e0F3d1DCEab60D446D9296adA1c5c0D3368d0b"
      values.pendingSanctions.305._timestamp:
-        1743368131
+        1743368167
      values.pendingSanctions.304._to:
-        "0x79e0F3d1DCEab60D446D9296adA1c5c0D3368d0b"
+        "0x4E56569186083eacEC60e38b9B76F1d7C6A03694"
      values.pendingSanctions.304._timestamp:
-        1743368167
+        1743368131
      values.pendingSanctions.303._to:
-        "0x4E56569186083eacEC60e38b9B76F1d7C6A03694"
+        "0x90231e5318110108B4748c67c9119CD8Ef28D0f0"
      values.pendingSanctions.303._timestamp:
-        1743368131
+        1743368190
      values.pendingSanctions.302._to:
-        "0x90231e5318110108B4748c67c9119CD8Ef28D0f0"
+        "0x9E339388d44B21E9d027ba95D71E08E75736CE0E"
      values.pendingSanctions.301._to:
-        "0x9E339388d44B21E9d027ba95D71E08E75736CE0E"
+        "0xE9D67E87DD59b29876CF0E1ace667cAE39210fa8"
      values.pendingSanctions.301._timestamp:
-        1743368190
+        1743368286
      values.pendingSanctions.300._to:
-        "0xE9D67E87DD59b29876CF0E1ace667cAE39210fa8"
+        "0x504a1ef47bF87a550bebfBA6ffe58a3a57bADeB7"
      values.pendingSanctions.300._timestamp:
-        1743368286
+        1707652818
      values.pendingSanctions.299._to:
-        "0x504a1ef47bF87a550bebfBA6ffe58a3a57bADeB7"
+        "0x6100c3fE678800EB6809DE473688b433eB081a5F"
      values.pendingSanctions.299._timestamp:
-        1707652818
+        1743368147
      values.pendingSanctions.298._to:
-        "0x6100c3fE678800EB6809DE473688b433eB081a5F"
+        "0x9c41f1FB592aFE978726FCa785a8fD2b1c836006"
      values.pendingSanctions.298._timestamp:
-        1743368147
+        1743368207
      values.pendingSanctions.297._to:
-        "0x9c41f1FB592aFE978726FCa785a8fD2b1c836006"
+        "0x9E292AFD2492f4ecBA6c1eb8B73BC87A5650eB8F"
      values.pendingSanctions.297._timestamp:
-        1743368207
+        1718846645
      values.pendingSanctions.296._to:
-        "0x9E292AFD2492f4ecBA6c1eb8B73BC87A5650eB8F"
+        "0xB1bEaC3a3472436d9AA1f2D36aEaA2c215b66b9a"
      values.pendingSanctions.296._timestamp:
-        1718846645
+        1743368207
      values.pendingSanctions.295._to:
-        "0xB1bEaC3a3472436d9AA1f2D36aEaA2c215b66b9a"
+        "0x89Ea92eF445cC8EC1055C8d243Ed50A2eF5FD77C"
      values.pendingSanctions.295._timestamp:
-        1743368207
+        1743368167
      values.pendingSanctions.294._to:
-        "0x89Ea92eF445cC8EC1055C8d243Ed50A2eF5FD77C"
+        "0xE01874E2F6C78990F6a55Cb86B49ECCe070aEb0d"
      values.pendingSanctions.294._timestamp:
-        1743368167
+        1743368286
      values.pendingSanctions.293._to:
-        "0xE01874E2F6C78990F6a55Cb86B49ECCe070aEb0d"
+        "0xE459e4bE9844131F5b26544cA60D56A034D26A3c"
      values.pendingSanctions.292._to:
-        "0xE459e4bE9844131F5b26544cA60D56A034D26A3c"
+        "0xE65a2Dee17190786c76f83e36F489a085690686C"
      values.pendingSanctions.292._timestamp:
-        1743368286
+        1707840030
      values.pendingSanctions.291._to:
-        "0xE65a2Dee17190786c76f83e36F489a085690686C"
+        "0x4b2E0fDA7DB5Ab4f7471776F3A0e7E0D85444bFF"
      values.pendingSanctions.291._timestamp:
-        1707840030
+        1743368131
      values.pendingSanctions.290._to:
-        "0x4b2E0fDA7DB5Ab4f7471776F3A0e7E0D85444bFF"
+        "0xf685Ca101dd7598Ec26244d8ff0f5abEa0F23509"
      values.pendingSanctions.290._timestamp:
-        1743368131
+        1743368491
      values.pendingSanctions.289._to:
-        "0xf685Ca101dd7598Ec26244d8ff0f5abEa0F23509"
+        "0xD3Af5EAb05E1882439E8626F9102a0A0bDCa21DB"
      values.pendingSanctions.289._timestamp:
-        1743368491
+        1743368220
      values.pendingSanctions.288._to:
-        "0xD3Af5EAb05E1882439E8626F9102a0A0bDCa21DB"
+        "0xbf3fBce48ff8a49918dD8578290814ea466aB79F"
      values.pendingSanctions.288._timestamp:
-        1743368220
+        1718846587
      values.pendingSanctions.287._to:
-        "0xbf3fBce48ff8a49918dD8578290814ea466aB79F"
+        "0x91aDe5800dB3eBE7E103CFc05069487B00AE45ba"
      values.pendingSanctions.287._timestamp:
-        1718846587
+        1743368190
      values.pendingSanctions.286._to:
-        "0x91aDe5800dB3eBE7E103CFc05069487B00AE45ba"
+        "0xA211445157D68B451006f8452eB7309A2313DC7a"
      values.pendingSanctions.286._timestamp:
-        1743368190
+        1743368207
      values.pendingSanctions.285._to:
-        "0xA211445157D68B451006f8452eB7309A2313DC7a"
+        "0x81bb2B25eA1A01BADA25d41C67A34d81C9684712"
      values.pendingSanctions.285._timestamp:
-        1743368207
+        1718846645
      values.pendingSanctions.284._to:
-        "0x81bb2B25eA1A01BADA25d41C67A34d81C9684712"
+        "0xDe2918Cb894ecC8BfD81eeD617DFF2a461700312"
      values.pendingSanctions.284._timestamp:
-        1718846645
+        1743368286
      values.pendingSanctions.283._to:
-        "0xDe2918Cb894ecC8BfD81eeD617DFF2a461700312"
+        "0x533efF0d6Ee8cd7dEF21ea27BeC421Ef7b8cE796"
      values.pendingSanctions.283._timestamp:
-        1743368286
+        1743368131
      values.pendingSanctions.282._to:
-        "0x533efF0d6Ee8cd7dEF21ea27BeC421Ef7b8cE796"
+        "0xF53eEd3bD238d4038e8e2699e832323A03500D0e"
      values.pendingSanctions.282._timestamp:
-        1743368131
+        1743368286
      values.pendingSanctions.281._to:
-        "0xF53eEd3bD238d4038e8e2699e832323A03500D0e"
+        "0x8d2635Da6aB707E0370E2F55Bdd2D0b8dA0596A4"
      values.pendingSanctions.281._timestamp:
-        1743368286
+        1743368167
      values.pendingSanctions.280._to:
-        "0x8d2635Da6aB707E0370E2F55Bdd2D0b8dA0596A4"
+        "0x962C00Ebc894Fb3e9B32AfE1dd1fa31A076e50e5"
      values.pendingSanctions.280._timestamp:
-        1743368167
+        1743368190
      values.pendingSanctions.279._to:
-        "0x962C00Ebc894Fb3e9B32AfE1dd1fa31A076e50e5"
+        "0xcD984AD7eBB2ab7B2aE0afd967F371c6E24a4Bc6"
      values.pendingSanctions.279._timestamp:
-        1743368190
+        1718846587
      values.pendingSanctions.278._to:
-        "0xcD984AD7eBB2ab7B2aE0afd967F371c6E24a4Bc6"
+        "0xBa5F9be8C94E2955deD0982Dc276023051bED0AA"
      values.pendingSanctions.278._timestamp:
-        1718846587
+        1743368207
      values.pendingSanctions.277._to:
-        "0xBa5F9be8C94E2955deD0982Dc276023051bED0AA"
+        "0x483090b7B8AFBf4F9e650E5a45dbD013959d4867"
      values.pendingSanctions.277._timestamp:
-        1743368207
+        1743368117
      values.pendingSanctions.276._to:
-        "0x483090b7B8AFBf4F9e650E5a45dbD013959d4867"
+        "0x99758a8519691B6bffEeD3976080c943634B7364"
      values.pendingSanctions.276._timestamp:
-        1743368117
+        1718846645
      values.pendingSanctions.275._to:
-        "0x99758a8519691B6bffEeD3976080c943634B7364"
+        "0x4506633D9bBB3EA73c89ff4829695D67896104d4"
      values.pendingSanctions.275._timestamp:
-        1718846645
+        1743368117
      values.pendingSanctions.274._to:
-        "0x4506633D9bBB3EA73c89ff4829695D67896104d4"
+        "0x1075d13CE70F8F4eB840c4c264b6c84C2CD4E785"
      values.pendingSanctions.274._timestamp:
-        1743368117
+        1708034428
      values.pendingSanctions.273._to:
-        "0x1075d13CE70F8F4eB840c4c264b6c84C2CD4E785"
+        "0xC44F5CA2F187D5ece6864b8a31174C36dEFdC29c"
      values.pendingSanctions.273._timestamp:
-        1708034428
+        1706139865
      values.pendingSanctions.272._to:
-        "0xC44F5CA2F187D5ece6864b8a31174C36dEFdC29c"
+        "0xC10730513A843fa0E2Fc223eC2AE3B6d3d002294"
      values.pendingSanctions.272._timestamp:
-        1706139865
+        1719715565
      values.pendingSanctions.271._to:
-        "0xC10730513A843fa0E2Fc223eC2AE3B6d3d002294"
+        "0x72F50cBB3D4189179b1cC55435993eB3d0bF772C"
      values.pendingSanctions.271._timestamp:
-        1719715565
+        1743368147
      values.pendingSanctions.270._to:
-        "0x72F50cBB3D4189179b1cC55435993eB3d0bF772C"
+        "0x505D435C8B66a7511dbec7f3C8DA6F1e67D50dDA"
      values.pendingSanctions.270._timestamp:
-        1743368147
+        1706148032
      values.pendingSanctions.269._to:
-        "0x505D435C8B66a7511dbec7f3C8DA6F1e67D50dDA"
+        "0xaE8C34b3eB7bcc21085eB819d23afF8687B449fE"
      values.pendingSanctions.269._timestamp:
-        1706148032
+        1743368466
      values.pendingSanctions.268._to:
-        "0xaE8C34b3eB7bcc21085eB819d23afF8687B449fE"
+        "0x01e523cC67e5d3459bE930837d89bccEA85Fd1DC"
      values.pendingSanctions.268._timestamp:
-        1743368466
+        1719715623
      values.pendingSanctions.267._to:
-        "0x01e523cC67e5d3459bE930837d89bccEA85Fd1DC"
+        "0xaB769943901Bb757cf5048B122f4A2D5D0aEE957"
      values.pendingSanctions.267._timestamp:
-        1719715623
+        1743368286
      values.pendingSanctions.266._to:
-        "0xaB769943901Bb757cf5048B122f4A2D5D0aEE957"
+        "0xDABa2f9fdEc6Bada2902B4453239332FE591d9ee"
      values.pendingSanctions.266._timestamp:
-        1743368286
+        1743368220
      values.pendingSanctions.265._to:
-        "0xDABa2f9fdEc6Bada2902B4453239332FE591d9ee"
+        "0xD91110Bb87AEEFa8D74A274930804F7D61324f0E"
      values.pendingSanctions.264._to:
-        "0xD91110Bb87AEEFa8D74A274930804F7D61324f0E"
+        "0xD4a998c38f016cC342b7Abd9796113D596201be3"
      values.pendingSanctions.263._to:
-        "0xD4a998c38f016cC342b7Abd9796113D596201be3"
+        "0xE174390679C9Cb86e64131f9AA173FdC9C10b8af"
      values.pendingSanctions.263._timestamp:
-        1743368220
+        1743368286
      values.pendingSanctions.262._to:
-        "0xE174390679C9Cb86e64131f9AA173FdC9C10b8af"
+        "0x4d38B797655D0B8F5E61a01A5a71A0346B98A3DD"
      values.pendingSanctions.262._timestamp:
-        1743368286
+        1743368131
      values.pendingSanctions.261._to:
-        "0x4d38B797655D0B8F5E61a01A5a71A0346B98A3DD"
+        "0x5579CA784CdC93776b9c030618548f1317AB4c39"
      values.pendingSanctions.261._timestamp:
-        1743368131
+        1706148032
      values.pendingSanctions.260._to:
-        "0x5579CA784CdC93776b9c030618548f1317AB4c39"
+        "0x74a6001A9b9f9AAb26A4eDEe55DB40413569255A"
      values.pendingSanctions.260._timestamp:
-        1706148032
+        1743368147
      values.pendingSanctions.259._to:
-        "0x74a6001A9b9f9AAb26A4eDEe55DB40413569255A"
+        "0xFff5B9B7bf09DfC42865cDaDAA161f14Fd54498d"
      values.pendingSanctions.259._timestamp:
-        1743368147
+        1743368286
      values.pendingSanctions.258._to:
-        "0xFff5B9B7bf09DfC42865cDaDAA161f14Fd54498d"
+        "0xb2F1d7867fD8d1501f5747676823f8d27a6a12f2"
      values.pendingSanctions.258._timestamp:
-        1743368286
+        1743368466
      values.pendingSanctions.257._to:
-        "0xb2F1d7867fD8d1501f5747676823f8d27a6a12f2"
+        "0x414ded65867BdD1a2DcEcf730fBF4F92a72Ec55a"
      values.pendingSanctions.257._timestamp:
-        1743368466
+        1743368117
      values.pendingSanctions.256._to:
-        "0x414ded65867BdD1a2DcEcf730fBF4F92a72Ec55a"
+        "0x917A716dA88cE955f56A2C61313eeB1a1C80eC5b"
      values.pendingSanctions.256._timestamp:
-        1743368117
+        1743368190
      values.pendingSanctions.255._to:
-        "0x917A716dA88cE955f56A2C61313eeB1a1C80eC5b"
+        "0x49EbC2b33a410955D6291828af3f8EBeD3A1540e"
      values.pendingSanctions.255._timestamp:
-        1743368190
+        1743368117
      values.pendingSanctions.254._to:
-        "0x49EbC2b33a410955D6291828af3f8EBeD3A1540e"
+        "0xaEB8b6bB09c44c6eE9524Bf6a7842531e8870217"
      values.pendingSanctions.254._timestamp:
-        1743368117
+        1743368466
      values.pendingSanctions.253._to:
-        "0xaEB8b6bB09c44c6eE9524Bf6a7842531e8870217"
+        "0x72d47E7F0E341129Fd8815e84e396e86AF88484b"
      values.pendingSanctions.253._timestamp:
-        1743368466
+        1743368147
      values.pendingSanctions.252._to:
-        "0x72d47E7F0E341129Fd8815e84e396e86AF88484b"
+        "0xaBA02c3024E1b5A8dfA53f7bD82d6B75B8C7Fea2"
      values.pendingSanctions.252._timestamp:
-        1743368147
+        1743368466
      values.pendingSanctions.251._to:
-        "0xaBA02c3024E1b5A8dfA53f7bD82d6B75B8C7Fea2"
+        "0x75D9312845d38764229455Ea8d526A122b37768D"
      values.pendingSanctions.251._timestamp:
-        1743368466
+        1719718623
      values.pendingSanctions.250._to:
-        "0x75D9312845d38764229455Ea8d526A122b37768D"
+        "0x96aA815610caed4095B525042156560Ac5dBC8e9"
      values.pendingSanctions.250._timestamp:
-        1719718623
+        1743394746
      values.pendingSanctions.249._to:
-        "0x96aA815610caed4095B525042156560Ac5dBC8e9"
+        "0xe12BcEe0219f3c80FFF8C271D29e343bA42B814d"
      values.pendingSanctions.249._timestamp:
-        1743394746
+        1707483639
      values.pendingSanctions.248._to:
-        "0xe12BcEe0219f3c80FFF8C271D29e343bA42B814d"
+        "0xC34bd93d87AB32D8fbb966A0666dAa1021A698c2"
      values.pendingSanctions.248._timestamp:
-        1707483639
+        1743368220
      values.pendingSanctions.247._to:
-        "0xC34bd93d87AB32D8fbb966A0666dAa1021A698c2"
+        "0xe0d359F0f36d5eF22E1ee64135c572a076AaA826"
      values.pendingSanctions.247._timestamp:
-        1743368220
+        1743368491
      values.pendingSanctions.246._to:
-        "0xe0d359F0f36d5eF22E1ee64135c572a076AaA826"
+        "0xFD357B4975C97d48DfC8C5D5E3130a5634b89B8D"
      values.pendingSanctions.246._timestamp:
-        1743368491
+        1743394746
      values.pendingSanctions.245._to:
-        "0xFD357B4975C97d48DfC8C5D5E3130a5634b89B8D"
+        "0x933b0f5e531648Bef764b58Ff7782AfB13AB06D0"
      values.pendingSanctions.245._timestamp:
-        1743394746
+        1718846703
      values.pendingSanctions.244._to:
-        "0x933b0f5e531648Bef764b58Ff7782AfB13AB06D0"
+        "0xA56c58a135fcE29642f7Fb8Cd4Df826Ee4f35528"
      values.pendingSanctions.244._timestamp:
-        1718846703
+        1743368207
      values.pendingSanctions.243._to:
-        "0xA56c58a135fcE29642f7Fb8Cd4Df826Ee4f35528"
+        "0x2a14E7B96D2362bdf1Df8C0bB4544714e7601Af0"
      values.pendingSanctions.243._timestamp:
-        1743368207
+        1734246668
      values.pendingSanctions.242._to:
-        "0x2a14E7B96D2362bdf1Df8C0bB4544714e7601Af0"
+        "0x52f6755e5b4dcf8a51B8E161B1D32038b3460BD9"
      values.pendingSanctions.242._timestamp:
-        1734246668
+        1743368131
      values.pendingSanctions.241._to:
-        "0x52f6755e5b4dcf8a51B8E161B1D32038b3460BD9"
+        "0xFDFEb1b9F613E2CB841E493B5359c124De59499e"
      values.pendingSanctions.241._timestamp:
-        1743368131
+        1743368286
      values.pendingSanctions.240._to:
-        "0xFDFEb1b9F613E2CB841E493B5359c124De59499e"
+        "0x7C92dEf48191e751C61F96d1B9A058546F8fc5bd"
      values.pendingSanctions.240._timestamp:
-        1743368286
+        1743368167
      values.pendingSanctions.239._to:
-        "0x7C92dEf48191e751C61F96d1B9A058546F8fc5bd"
+        "0x65E24c0623336b5dae5b566Bb996863ffC36e877"
      values.pendingSanctions.239._timestamp:
-        1743368167
+        1743394986
      values.pendingSanctions.238._to:
-        "0x65E24c0623336b5dae5b566Bb996863ffC36e877"
+        "0x493ff963FAAbbBeDBA2Aa19378bF8d8a0F0e2C5E"
      values.pendingSanctions.238._timestamp:
-        1743394986
+        1718846587
      values.pendingSanctions.237._to:
-        "0x493ff963FAAbbBeDBA2Aa19378bF8d8a0F0e2C5E"
+        "0x3bFD323C9D44625D0B8A77ac19b13e75b9A0f2E4"
      values.pendingSanctions.237._timestamp:
-        1718846587
+        1743368100
      values.pendingSanctions.236._to:
-        "0x3bFD323C9D44625D0B8A77ac19b13e75b9A0f2E4"
+        "0xFCF53d74a16e899b576eb86FDBb76006854Ef763"
      values.pendingSanctions.236._timestamp:
-        1743368100
+        1743368286
      values.pendingSanctions.235._to:
-        "0xFCF53d74a16e899b576eb86FDBb76006854Ef763"
+        "0xA4EcEAB6C954C3b967cF18e947879A6708A96D5e"
      values.pendingSanctions.235._timestamp:
-        1743368286
+        1719715444
      values.pendingSanctions.234._to:
-        "0xA4EcEAB6C954C3b967cF18e947879A6708A96D5e"
+        "0x89F6188006a35b9D0407c37f01FCa27AeD48CA3B"
      values.pendingSanctions.234._timestamp:
-        1719715444
+        1719718683
      values.pendingSanctions.233._to:
-        "0x89F6188006a35b9D0407c37f01FCa27AeD48CA3B"
+        "0xeeAdb06d44f927b77C0bA23B257A4CfEa60EDfB7"
      values.pendingSanctions.233._timestamp:
-        1719718683
+        1743368491
      values.pendingSanctions.232._to:
-        "0xeeAdb06d44f927b77C0bA23B257A4CfEa60EDfB7"
+        "0xeF4D08EbDAa2373Df18C12173898Ef09beb1Cd45"
      values.pendingSanctions.231._to:
-        "0xeF4D08EbDAa2373Df18C12173898Ef09beb1Cd45"
+        "0xE32AfFACe8f8f0f5A867FDe3d2C5ea1321dB83e8"
      values.pendingSanctions.231._timestamp:
-        1743368491
+        1743368286
      values.pendingSanctions.230._to:
-        "0xE32AfFACe8f8f0f5A867FDe3d2C5ea1321dB83e8"
+        "0x2A2ad91467443Ef61c49d5957546554EDb90Fe8a"
      values.pendingSanctions.230._timestamp:
-        1743368286
+        1743394746
      values.pendingSanctions.229._to:
-        "0x2A2ad91467443Ef61c49d5957546554EDb90Fe8a"
+        "0x985540465088C9c667690cC17BFf732fC703D2E5"
      values.pendingSanctions.229._timestamp:
-        1743394746
+        1719718623
      values.pendingSanctions.228._to:
-        "0x985540465088C9c667690cC17BFf732fC703D2E5"
+        "0xe3f7A57629a00558EBD24100A9D26A66FD4EbAc3"
      values.pendingSanctions.228._timestamp:
-        1719718623
+        1743368491
      values.pendingSanctions.227._to:
-        "0xe3f7A57629a00558EBD24100A9D26A66FD4EbAc3"
+        "0xA3a0A02e0866a95685062d7a1053912d6eda3E8B"
      values.pendingSanctions.227._timestamp:
-        1743368491
+        1743368207
      values.pendingSanctions.226._to:
-        "0xA3a0A02e0866a95685062d7a1053912d6eda3E8B"
+        "0xBbaEb862386383C67045cF2e538b6f3BfA1e8f5a"
      values.pendingSanctions.225._to:
-        "0xBbaEb862386383C67045cF2e538b6f3BfA1e8f5a"
+        "0x1f16335Fd1dD3e8DCC8b401f5ae8BA57F8AD76a8"
      values.pendingSanctions.225._timestamp:
-        1743368207
+        1706580004
      values.pendingSanctions.224._to:
-        "0x1f16335Fd1dD3e8DCC8b401f5ae8BA57F8AD76a8"
+        "0x2955ca0D791C30C16e7298B803BB116bED5d7269"
      values.pendingSanctions.223._to:
-        "0x2955ca0D791C30C16e7298B803BB116bED5d7269"
+        "0x92c248622427367b4cfa70e60C038c63B148C748"
      values.pendingSanctions.223._timestamp:
-        1706580004
+        1743368190
      values.pendingSanctions.222._to:
-        "0x92c248622427367b4cfa70e60C038c63B148C748"
+        "0x6E6E2044A4cfeA057E02d6FB72c33Fc893A9B788"
      values.pendingSanctions.222._timestamp:
-        1743368190
+        1718846703
      values.pendingSanctions.221._to:
-        "0x6E6E2044A4cfeA057E02d6FB72c33Fc893A9B788"
+        "0xf30BF377b3C4ed1f111E6E28CF26003CE5a682Cf"
      values.pendingSanctions.221._timestamp:
-        1718846703
+        1706580004
      values.pendingSanctions.220._to:
-        "0xf30BF377b3C4ed1f111E6E28CF26003CE5a682Cf"
+        "0xdCfA8062948095423c6117a327949198519741b0"
      values.pendingSanctions.220._timestamp:
-        1706580004
+        1743368491
      values.pendingSanctions.219._to:
-        "0xdCfA8062948095423c6117a327949198519741b0"
+        "0xd138D5DBA662DE76F6Ce4EB60CA486313Ab7d15C"
      values.pendingSanctions.218._to:
-        "0xd138D5DBA662DE76F6Ce4EB60CA486313Ab7d15C"
+        "0x326d76c60952e8a6A1c0af55D0F592E8c4E9597a"
      values.pendingSanctions.218._timestamp:
-        1743368491
+        1743368100
      values.pendingSanctions.217._to:
-        "0x326d76c60952e8a6A1c0af55D0F592E8c4E9597a"
+        "0xD09E358552fC7Ce6F7E7BDDCE40e52fF1fE0745c"
      values.pendingSanctions.217._timestamp:
-        1743368100
+        1743368220
      values.pendingSanctions.216._to:
-        "0xD09E358552fC7Ce6F7E7BDDCE40e52fF1fE0745c"
+        "0x60C460346394178b79CC9254D397B44a074e1dbD"
      values.pendingSanctions.216._timestamp:
-        1743368220
+        1743368147
      values.pendingSanctions.215._to:
-        "0x60C460346394178b79CC9254D397B44a074e1dbD"
+        "0x7CB6AfA77bb4E67b4c24293D3B5C5052851b5EB0"
      values.pendingSanctions.215._timestamp:
-        1743368147
+        1743368167
      values.pendingSanctions.214._to:
-        "0x7CB6AfA77bb4E67b4c24293D3B5C5052851b5EB0"
+        "0x8e31D4A303eDEeE7ca509CCC8D5965f50D6B25D8"
      values.pendingSanctions.213._to:
-        "0x8e31D4A303eDEeE7ca509CCC8D5965f50D6B25D8"
+        "0x8006D189F5311E28E7A43E843c9AF675CEBef4AF"
      values.pendingSanctions.212._to:
-        "0x8006D189F5311E28E7A43E843c9AF675CEBef4AF"
+        "0x894341e79e60b06C5D64684200BAb31C3c77AeF7"
      values.pendingSanctions.211._to:
-        "0x894341e79e60b06C5D64684200BAb31C3c77AeF7"
+        "0x9a46f537e8eA30BCCeDB0B7A2EBE03b16Df1170C"
      values.pendingSanctions.211._timestamp:
-        1743368167
+        1743368190
      values.pendingSanctions.210._to:
-        "0x9a46f537e8eA30BCCeDB0B7A2EBE03b16Df1170C"
+        "0x3C9A0d73EF1a155e0b94CCc498068C1DB85fbEb5"
      values.pendingSanctions.210._timestamp:
-        1743368190
+        1743368100
      values.pendingSanctions.209._to:
-        "0x3C9A0d73EF1a155e0b94CCc498068C1DB85fbEb5"
+        "0xE9Cb04a602cAA9D2C649dDE854Ab7389C98CF912"
      values.pendingSanctions.209._timestamp:
-        1743368100
+        1706139865
      values.pendingSanctions.208._to:
-        "0xE9Cb04a602cAA9D2C649dDE854Ab7389C98CF912"
+        "0x459A9b243DE7aab18c60E25Ab0D6c99A445faC12"
      values.pendingSanctions.208._timestamp:
-        1706139865
+        1743368117
      values.pendingSanctions.207._to:
-        "0x459A9b243DE7aab18c60E25Ab0D6c99A445faC12"
+        "0x3dec956335f3E48DC1Fb99DC9A2d21350a30e245"
      values.pendingSanctions.206._to:
-        "0x3dec956335f3E48DC1Fb99DC9A2d21350a30e245"
+        "0xaa7Fc1a0c9fcb6721a082740d7E4BC0885951d7a"
      values.pendingSanctions.206._timestamp:
-        1743368117
+        1743368466
      values.pendingSanctions.205._to:
-        "0xaa7Fc1a0c9fcb6721a082740d7E4BC0885951d7a"
+        "0x2B5CA5A2ABd55846C02439Dd268Ae733F104C866"
      values.pendingSanctions.205._timestamp:
-        1743368466
+        1743368100
      values.pendingSanctions.204._to:
-        "0x2B5CA5A2ABd55846C02439Dd268Ae733F104C866"
+        "0x73fcfBefa7e9650049c7BcA3c76F99D085Eaf462"
      values.pendingSanctions.204._timestamp:
-        1743368100
+        1743368147
      values.pendingSanctions.203._to:
-        "0x73fcfBefa7e9650049c7BcA3c76F99D085Eaf462"
+        "0x45Ace2D41040B7267a465A4dF8733F3327EEFBb5"
      values.pendingSanctions.203._timestamp:
-        1743368147
+        1719715444
      values.pendingSanctions.202._to:
-        "0x45Ace2D41040B7267a465A4dF8733F3327EEFBb5"
+        "0xCf4b2B67e584F71f0a888817Eab97061e0CcC139"
      values.pendingSanctions.202._timestamp:
-        1719715444
+        1743368220
      values.pendingSanctions.201._to:
-        "0xCf4b2B67e584F71f0a888817Eab97061e0CcC139"
+        "0x579e88fF20811E8B7327A1b81d324E2302337E3B"
      values.pendingSanctions.201._timestamp:
-        1743368220
+        1743368131
      values.pendingSanctions.200._to:
-        "0x579e88fF20811E8B7327A1b81d324E2302337E3B"
+        "0x76De7fC28E69bb78e6475C8Fd71B71793B663E31"
      values.pendingSanctions.200._timestamp:
-        1743368131
+        1707346822
      values.pendingSanctions.199._to:
-        "0x76De7fC28E69bb78e6475C8Fd71B71793B663E31"
+        "0x4C403211d9BcAC321b683e0161CED2cE749FF0A4"
      values.pendingSanctions.199._timestamp:
-        1707346822
+        1743368131
      values.pendingSanctions.198._to:
-        "0x4C403211d9BcAC321b683e0161CED2cE749FF0A4"
+        "0x7B31BC4FD8A00f734690AD0607903AA2C770a802"
      values.pendingSanctions.198._timestamp:
-        1743368131
+        1718846645
      values.pendingSanctions.197._to:
-        "0x7B31BC4FD8A00f734690AD0607903AA2C770a802"
+        "0x4E5c14bc3E148C01d02f9086c889f6a7854eEa42"
      values.pendingSanctions.197._timestamp:
-        1718846645
+        1743394746
      values.pendingSanctions.196._to:
-        "0x4E5c14bc3E148C01d02f9086c889f6a7854eEa42"
+        "0x2bD3B86856EEeC97CbC01150833aCc0771491049"
      values.pendingSanctions.196._timestamp:
-        1743394746
+        1743368100
      values.pendingSanctions.195._to:
-        "0x2bD3B86856EEeC97CbC01150833aCc0771491049"
+        "0x463d21B0620C77620aeD87A769e5836132158855"
      values.pendingSanctions.195._timestamp:
-        1743368100
+        1707627639
      values.pendingSanctions.194._to:
-        "0x463d21B0620C77620aeD87A769e5836132158855"
+        "0x4fc472c29A8cBED38ce871a4Caf6CbDd1Cfd3369"
      values.pendingSanctions.194._timestamp:
-        1707627639
+        1743368131
      values.pendingSanctions.193._to:
-        "0x4fc472c29A8cBED38ce871a4Caf6CbDd1Cfd3369"
+        "0xA911DDC91FDBDBBe22dD219CA05DC8634e9255d2"
      values.pendingSanctions.193._timestamp:
-        1743368131
+        1743368207
      values.pendingSanctions.192._to:
-        "0xA911DDC91FDBDBBe22dD219CA05DC8634e9255d2"
+        "0xB84a63047b0E7b6e1C670479C5ae682e6386d423"
      values.pendingSanctions.192._timestamp:
-        1743368207
+        1743394986
      values.pendingSanctions.191._to:
-        "0xB84a63047b0E7b6e1C670479C5ae682e6386d423"
+        "0xD0aC63a724dCb105561F981c3D9dda033570193e"
      values.pendingSanctions.191._timestamp:
-        1743394986
+        1718846587
      values.pendingSanctions.190._to:
-        "0xD0aC63a724dCb105561F981c3D9dda033570193e"
+        "0x81c0d080426CbEa108c1e74C712a6A2ceDAB89e1"
      values.pendingSanctions.190._timestamp:
-        1718846587
+        1743368167
      values.pendingSanctions.189._to:
-        "0x81c0d080426CbEa108c1e74C712a6A2ceDAB89e1"
+        "0xfb02369649FABe532c600983C41840d54F4592a7"
      values.pendingSanctions.189._timestamp:
-        1743368167
+        1743368523
      values.pendingSanctions.188._to:
-        "0xfb02369649FABe532c600983C41840d54F4592a7"
+        "0x660dD692777AF51FBFE15C5B47178994d825911a"
      values.pendingSanctions.188._timestamp:
-        1743368523
+        1743368147
      values.pendingSanctions.187._to:
-        "0x660dD692777AF51FBFE15C5B47178994d825911a"
+        "0xb4696a1465286802b7Bc8E39120B10F951E07C4d"
      values.pendingSanctions.187._timestamp:
-        1743368147
+        1743368466
      values.pendingSanctions.186._to:
-        "0xb4696a1465286802b7Bc8E39120B10F951E07C4d"
+        "0xfB474dDfDc91293aD2a37A58DC94D6505d2c88dF"
      values.pendingSanctions.186._timestamp:
-        1743368466
+        1738203485
      values.pendingSanctions.185._to:
-        "0xfB474dDfDc91293aD2a37A58DC94D6505d2c88dF"
+        "0xd382432B50d12b5803A7D666662320ceEe22313f"
      values.pendingSanctions.185._timestamp:
-        1738203485
+        1743368491
      values.pendingSanctions.184._to:
-        "0xd382432B50d12b5803A7D666662320ceEe22313f"
+        "0x298805bE3bbe036224BB11cE5007636423ca46F6"
      values.pendingSanctions.184._timestamp:
-        1743368491
+        1743368100
      values.pendingSanctions.183._to:
-        "0x298805bE3bbe036224BB11cE5007636423ca46F6"
+        "0xdFc1f20b21259ee313d20D33D46D54691E4371CB"
      values.pendingSanctions.183._timestamp:
-        1743368100
+        1743368491
      values.pendingSanctions.182._to:
-        "0xdFc1f20b21259ee313d20D33D46D54691E4371CB"
+        "0xC2068323986708a8b2480Bf491B4ad5921234EF7"
      values.pendingSanctions.182._timestamp:
-        1743368491
+        1743368220
      values.pendingSanctions.181._to:
-        "0xC2068323986708a8b2480Bf491B4ad5921234EF7"
+        "0xf2670E8C64430F10163e53BD38e71741d18D7840"
      values.pendingSanctions.181._timestamp:
-        1743368220
+        1743368491
      values.pendingSanctions.180._to:
-        "0xf2670E8C64430F10163e53BD38e71741d18D7840"
+        "0xb064e41602F2EA83741161A27DC045A6dD7F6b93"
      values.pendingSanctions.180._timestamp:
-        1743368491
+        1743368466
      values.pendingSanctions.179._to:
-        "0xb064e41602F2EA83741161A27DC045A6dD7F6b93"
+        "0xdE2c001797a4a6e8784743FB1835F82efb95b18f"
      values.pendingSanctions.179._timestamp:
-        1743368466
+        1743368491
      values.pendingSanctions.178._to:
-        "0xdE2c001797a4a6e8784743FB1835F82efb95b18f"
+        "0x80c5A724E484B2b96c61c45e06918D7B68dB256B"
      values.pendingSanctions.178._timestamp:
-        1743368491
+        1743368167
      values.pendingSanctions.177._to:
-        "0x80c5A724E484B2b96c61c45e06918D7B68dB256B"
+        "0x8Cf85f74408Cb7e27cF0f52493c93fF6E150BAFa"
      values.pendingSanctions.176._to:
-        "0x8Cf85f74408Cb7e27cF0f52493c93fF6E150BAFa"
+        "0x927491618ECd06afBCEDeA84a2fEF71c991f00Eb"
      values.pendingSanctions.176._timestamp:
-        1743368167
+        1707354023
      values.pendingSanctions.175._to:
-        "0x927491618ECd06afBCEDeA84a2fEF71c991f00Eb"
+        "0x8862Dd4657aBCdf04c96402cD4C3007511538500"
      values.pendingSanctions.175._timestamp:
-        1707354023
+        1719718683
      values.pendingSanctions.174._to:
-        "0x8862Dd4657aBCdf04c96402cD4C3007511538500"
+        "0x28c6fFE7b230F54510247FE09e5CbaaAB314ee82"
      values.pendingSanctions.174._timestamp:
-        1719718683
+        1743368100
      values.pendingSanctions.173._to:
-        "0x28c6fFE7b230F54510247FE09e5CbaaAB314ee82"
+        "0x2ed2A34623aF70467ef88E473a693F879176B5a2"
      values.pendingSanctions.172._to:
-        "0x2ed2A34623aF70467ef88E473a693F879176B5a2"
+        "0x6402119871Cc942Edc26e4815B99711750B87DBB"
      values.pendingSanctions.172._timestamp:
-        1743368100
+        1719718623
      values.pendingSanctions.171._to:
-        "0x6402119871Cc942Edc26e4815B99711750B87DBB"
+        "0x437415907a0FdB07aeDCaBC085Cf940D370cfA6c"
      values.pendingSanctions.171._timestamp:
-        1719718623
+        1743368117
      values.pendingSanctions.170._to:
-        "0x437415907a0FdB07aeDCaBC085Cf940D370cfA6c"
+        "0x773d712C230654121bE68D09C4ccaA9011d20895"
      values.pendingSanctions.170._timestamp:
-        1743368117
+        1743368167
      values.pendingSanctions.169._to:
-        "0x773d712C230654121bE68D09C4ccaA9011d20895"
+        "0x4813eD84135cB27eC096d8b86eE35B8d62402c07"
      values.pendingSanctions.169._timestamp:
-        1743368167
+        1743368117
      values.pendingSanctions.168._to:
-        "0x4813eD84135cB27eC096d8b86eE35B8d62402c07"
+        "0xc3106dd6f982d4269a6618E77f49927d44BCCafD"
      values.pendingSanctions.168._timestamp:
-        1743368117
+        1706580004
      values.pendingSanctions.167._to:
-        "0xc3106dd6f982d4269a6618E77f49927d44BCCafD"
+        "0x3EA0B857a9579259096F067b6Dd914D1ae75C338"
      values.pendingSanctions.167._timestamp:
-        1706580004
+        1743368100
      values.pendingSanctions.166._to:
-        "0x3EA0B857a9579259096F067b6Dd914D1ae75C338"
+        "0xA74B09B9f886ac101FDB1091147f4a67FE7c19e7"
      values.pendingSanctions.166._timestamp:
-        1743368100
+        1743368207
      values.pendingSanctions.165._to:
-        "0xA74B09B9f886ac101FDB1091147f4a67FE7c19e7"
+        "0x96D4FD6006d1BBAF629feeAec1ddDB9D13bd5778"
      values.pendingSanctions.165._timestamp:
-        1743368207
+        1743368190
      values.pendingSanctions.164._to:
-        "0x96D4FD6006d1BBAF629feeAec1ddDB9D13bd5778"
+        "0x4DF0384CA53D96bbED7452f10b9dDC325AF037c0"
      values.pendingSanctions.164._timestamp:
-        1743368190
+        1743368131
      values.pendingSanctions.163._to:
-        "0x4DF0384CA53D96bbED7452f10b9dDC325AF037c0"
+        "0x6e77aE496c67441Ee772f88471b27Bf62Ef04d07"
      values.pendingSanctions.163._timestamp:
-        1743368131
+        1743368147
      values.pendingSanctions.162._to:
-        "0x6e77aE496c67441Ee772f88471b27Bf62Ef04d07"
+        "0xC6235424501FF4dCEf8fC7C96DFD9474b40E95E6"
      values.pendingSanctions.162._timestamp:
-        1743368147
+        1743368220
      values.pendingSanctions.161._to:
-        "0xC6235424501FF4dCEf8fC7C96DFD9474b40E95E6"
+        "0xf152EBa9da07Bec19fbd6078D9dB047E74687A6a"
      values.pendingSanctions.161._timestamp:
-        1743368220
+        1743368491
      values.pendingSanctions.160._to:
-        "0xf152EBa9da07Bec19fbd6078D9dB047E74687A6a"
+        "0x9b70559E61949033dE5a90F58fD4ed051470B851"
      values.pendingSanctions.160._timestamp:
-        1743368491
+        1743368190
      values.pendingSanctions.159._to:
-        "0x9b70559E61949033dE5a90F58fD4ed051470B851"
+        "0x59ED194974A49f7D817EC46bCE8E00A6F24133E1"
      values.pendingSanctions.159._timestamp:
-        1743368190
+        1743368131
      values.pendingSanctions.158._to:
-        "0x59ED194974A49f7D817EC46bCE8E00A6F24133E1"
+        "0x015374c2Dc040eE1c40739936C72D5F035186f0f"
      values.pendingSanctions.158._timestamp:
-        1743368131
+        1706662831
      values.pendingSanctions.157._to:
-        "0x015374c2Dc040eE1c40739936C72D5F035186f0f"
+        "0xbd0e49D0dA6F10e8A74964e8282B86900396f7A3"
      values.pendingSanctions.157._timestamp:
-        1706662831
+        1743368466
      values.pendingSanctions.156._to:
-        "0xbd0e49D0dA6F10e8A74964e8282B86900396f7A3"
+        "0xB92293Fd1D65c09361f863bF4d202cff763CE9e4"
      values.pendingSanctions.156._timestamp:
-        1743368466
+        1743368207
      values.pendingSanctions.155._to:
-        "0xB92293Fd1D65c09361f863bF4d202cff763CE9e4"
+        "0x585E38F443aFEA52D5DB05A273d0145Bd17887be"
      values.pendingSanctions.155._timestamp:
-        1743368207
+        1743368131
      values.pendingSanctions.154._to:
-        "0x585E38F443aFEA52D5DB05A273d0145Bd17887be"
+        "0x95263Dab911Dd8B05ED1713f2549E9C8cf574323"
      values.pendingSanctions.154._timestamp:
-        1743368131
+        1743368190
      values.pendingSanctions.153._to:
-        "0x95263Dab911Dd8B05ED1713f2549E9C8cf574323"
+        "0x8cc7888b6C9B9EF917CdE097210a7eB12ca8441e"
      values.pendingSanctions.153._timestamp:
-        1743368190
+        1743368167
      values.pendingSanctions.152._to:
-        "0x8cc7888b6C9B9EF917CdE097210a7eB12ca8441e"
+        "0x10888fc193ec8a5b9ce29a0213473B2ceFA1E707"
      values.pendingSanctions.152._timestamp:
-        1743368167
+        1719715565
      values.pendingSanctions.151._to:
-        "0x10888fc193ec8a5b9ce29a0213473B2ceFA1E707"
+        "0x9868A6E272365Ec421C3aF0690F5aa97121B91c4"
      values.pendingSanctions.151._timestamp:
-        1719715565
+        1743368190
      values.pendingSanctions.150._to:
-        "0x9868A6E272365Ec421C3aF0690F5aa97121B91c4"
+        "0x61C81bBa4D9b4cc3BB109Fcf1482cb5Ce4b87205"
      values.pendingSanctions.150._timestamp:
-        1743368190
+        1743368147
      values.pendingSanctions.149._to:
-        "0x61C81bBa4D9b4cc3BB109Fcf1482cb5Ce4b87205"
+        "0x9E33F1333587Ee7f96772523821187de185d2ead"
      values.pendingSanctions.149._timestamp:
-        1743368147
+        1719715565
      values.pendingSanctions.148._to:
-        "0x9E33F1333587Ee7f96772523821187de185d2ead"
+        "0x23C1c317368AB6Dc5F92a496e08A79ceE6f90392"
      values.pendingSanctions.148._timestamp:
-        1719715565
+        1719718683
      values.pendingSanctions.147._to:
-        "0x23C1c317368AB6Dc5F92a496e08A79ceE6f90392"
+        "0xfd1dCf92A221f333061575FD8B7D02b6E3A5957D"
      values.pendingSanctions.147._timestamp:
-        1719718683
+        1710867621
      values.pendingSanctions.146._to:
-        "0xfd1dCf92A221f333061575FD8B7D02b6E3A5957D"
+        "0x3b2E6A063125c95f327aE214eD1F20B901801059"
      values.pendingSanctions.146._timestamp:
-        1710867621
+        1719715506
      values.pendingSanctions.145._to:
-        "0x3b2E6A063125c95f327aE214eD1F20B901801059"
+        "0xAb96909d9a35150a249a55670e0bB8B8C583565b"
      values.pendingSanctions.145._timestamp:
-        1719715506
+        1743368207
      values.pendingSanctions.144._to:
-        "0xAb96909d9a35150a249a55670e0bB8B8C583565b"
+        "0x9381d90765A0cE4BE62e4cE9f115291C6244862E"
      values.pendingSanctions.144._timestamp:
-        1743368207
+        1743368190
      values.pendingSanctions.143._to:
-        "0x9381d90765A0cE4BE62e4cE9f115291C6244862E"
+        "0xbDbb9De0ee5c3CC100bf0DcF0e11881Ea568307D"
      values.pendingSanctions.143._timestamp:
-        1743368190
+        1743368466
      values.pendingSanctions.142._to:
-        "0xbDbb9De0ee5c3CC100bf0DcF0e11881Ea568307D"
+        "0x41b6cBA6EDf1bD2BC61b80B228104bb27db3e504"
      values.pendingSanctions.142._timestamp:
-        1743368466
+        1743368117
      values.pendingSanctions.141._to:
-        "0x41b6cBA6EDf1bD2BC61b80B228104bb27db3e504"
+        "0xB907Fd315C94FE2D2484B426f293D9980Da40A3d"
      values.pendingSanctions.141._timestamp:
-        1743368117
+        1743368207
      values.pendingSanctions.140._to:
-        "0xB907Fd315C94FE2D2484B426f293D9980Da40A3d"
+        "0xF936497C1E9215fdf91E0332c6D6D50b528Df14d"
      values.pendingSanctions.140._timestamp:
-        1743368207
+        1743368286
      values.pendingSanctions.139._to:
-        "0xF936497C1E9215fdf91E0332c6D6D50b528Df14d"
+        "0xc77D572231C4b8bfe3c4DB4aF478ad17FEBA0648"
      values.pendingSanctions.139._timestamp:
-        1743368286
+        1743368466
      values.pendingSanctions.138._to:
-        "0xc77D572231C4b8bfe3c4DB4aF478ad17FEBA0648"
+        "0x69E657BD35BA291D6A299F47d10249F24C86edD8"
      values.pendingSanctions.138._timestamp:
-        1743368466
+        1743394623
      values.pendingSanctions.137._to:
-        "0x69E657BD35BA291D6A299F47d10249F24C86edD8"
+        "0xE6f4103fCbdae587756C8273a440DFf8BA4Bb21a"
      values.pendingSanctions.137._timestamp:
-        1743394623
+        1743368286
      values.pendingSanctions.136._to:
-        "0xE6f4103fCbdae587756C8273a440DFf8BA4Bb21a"
+        "0xAE932423eb4c00139dF70b2644CfF269b110E130"
      values.pendingSanctions.136._timestamp:
-        1743368286
+        1743368207
      values.pendingSanctions.135._to:
-        "0xAE932423eb4c00139dF70b2644CfF269b110E130"
+        "0x3C43b337a56c5c9387614ebfAC01d3b5d0734Fcc"
      values.pendingSanctions.135._timestamp:
-        1743368207
+        1743368100
      values.pendingSanctions.134._to:
-        "0x3C43b337a56c5c9387614ebfAC01d3b5d0734Fcc"
+        "0x9991bCFde3f20Cc14A893CcC3a32b81801C80253"
      values.pendingSanctions.134._timestamp:
-        1743368100
+        1743368190
      values.pendingSanctions.133._to:
-        "0x9991bCFde3f20Cc14A893CcC3a32b81801C80253"
+        "0x7Faf6f69caD10Eaf3903847434bF92b4Bb6fC955"
      values.pendingSanctions.133._timestamp:
-        1743368190
+        1719718623
      values.pendingSanctions.132._to:
-        "0x7Faf6f69caD10Eaf3903847434bF92b4Bb6fC955"
+        "0xC6138fB05b8c0536EB2Ea791D2504eA72420d7d7"
      values.pendingSanctions.132._timestamp:
-        1719718623
+        1743394623
      values.pendingSanctions.131._to:
-        "0xC6138fB05b8c0536EB2Ea791D2504eA72420d7d7"
+        "0x5F0d5D4DA8692787F5267415DCc2494526E1C507"
      values.pendingSanctions.131._timestamp:
-        1743394623
+        1743368131
      values.pendingSanctions.130._to:
-        "0x5F0d5D4DA8692787F5267415DCc2494526E1C507"
+        "0x127917d1A8308Da2a1400dB50346B4a3F17813d3"
      values.pendingSanctions.130._timestamp:
-        1743368131
+        1743394565
      values.pendingSanctions.129._to:
-        "0x127917d1A8308Da2a1400dB50346B4a3F17813d3"
+        "0xB7522F061afb810b411a858769e2295A10080a32"
      values.pendingSanctions.129._timestamp:
-        1743394565
+        1743368207
      values.pendingSanctions.128._to:
-        "0xB7522F061afb810b411a858769e2295A10080a32"
+        "0xA98522A6a33c97af048aB966460e3C57Cd44eB17"
      values.pendingSanctions.127._to:
-        "0xA98522A6a33c97af048aB966460e3C57Cd44eB17"
+        "0x2548e483ceeFBe4de727f2F853AF0124869Ae75E"
      values.pendingSanctions.127._timestamp:
-        1743368207
+        1707566427
      values.pendingSanctions.126._to:
-        "0x2548e483ceeFBe4de727f2F853AF0124869Ae75E"
+        "0xc2811Dfd12FF70b229d26E465359664f9e60b9D2"
      values.pendingSanctions.126._timestamp:
-        1707566427
+        1706148032
      values.pendingSanctions.125._to:
-        "0xc2811Dfd12FF70b229d26E465359664f9e60b9D2"
+        "0xD823abbe3EdAB9A7175EBbE13b2891A3356F06ab"
      values.pendingSanctions.125._timestamp:
-        1706148032
+        1743368220
      values.pendingSanctions.124._to:
-        "0xD823abbe3EdAB9A7175EBbE13b2891A3356F06ab"
+        "0x07B69c2e2dE1e41EA60F6E5e382012774A61A80a"
      values.pendingSanctions.124._timestamp:
-        1743368220
+        1743367391
      values.pendingSanctions.123._to:
-        "0x07B69c2e2dE1e41EA60F6E5e382012774A61A80a"
+        "0xC7370caAfFE87e1089b1E86f3D6dc6283effdb3E"
      values.pendingSanctions.123._timestamp:
-        1743367391
+        1743368220
      values.pendingSanctions.122._to:
-        "0xC7370caAfFE87e1089b1E86f3D6dc6283effdb3E"
+        "0xcd82cdd2023BCc783bef35fDb86a70baA368c2c3"
      values.pendingSanctions.122._timestamp:
-        1743368220
+        1743368466
      values.pendingSanctions.121._to:
-        "0xcd82cdd2023BCc783bef35fDb86a70baA368c2c3"
+        "0x9baE98859a9D5Ba64AD43E0C22F99d8BAd7FB554"
      values.pendingSanctions.121._timestamp:
-        1743368466
+        1710363512
      values.pendingSanctions.120._to:
-        "0x9baE98859a9D5Ba64AD43E0C22F99d8BAd7FB554"
+        "0x0828b8Fe631347dA81a46E3D23394C3b18395aD4"
      values.pendingSanctions.120._timestamp:
-        1710363512
+        1707498031
      values.pendingSanctions.119._to:
-        "0x0828b8Fe631347dA81a46E3D23394C3b18395aD4"
+        "0x30096fdCc337A5395d275ecba9d0558484baad31"
      values.pendingSanctions.119._timestamp:
-        1707498031
+        1743368100
      values.pendingSanctions.118._to:
-        "0x30096fdCc337A5395d275ecba9d0558484baad31"
+        "0x3787445aa612a19D140840862cEf99694d9EA3De"
      values.pendingSanctions.117._to:
-        "0x3787445aa612a19D140840862cEf99694d9EA3De"
+        "0xdF45DcC1C326Af55ac389D09327d79699839E31b"
      values.pendingSanctions.117._timestamp:
-        1743368100
+        1743368491
      values.pendingSanctions.116._to:
-        "0xdF45DcC1C326Af55ac389D09327d79699839E31b"
+        "0xdb563dA812f5d90727bb12a0959F5679B9a2Ea5F"
      values.pendingSanctions.116._timestamp:
-        1743368491
+        1710533543
      values.pendingSanctions.115._to:
-        "0xdb563dA812f5d90727bb12a0959F5679B9a2Ea5F"
+        "0x47c33fd0772e8B103aBEe763d1C2FB864b665B3B"
      values.pendingSanctions.115._timestamp:
-        1710533543
+        1743368117
      values.pendingSanctions.114._to:
-        "0x47c33fd0772e8B103aBEe763d1C2FB864b665B3B"
+        "0xda250570f0DBf9650C8f80989390e71118A64B51"
      values.pendingSanctions.114._timestamp:
-        1743368117
+        1743368491
      values.pendingSanctions.113._to:
-        "0xda250570f0DBf9650C8f80989390e71118A64B51"
+        "0x52F09693c9eEaA93A64BA697e3d3e43a1eB65477"
      values.pendingSanctions.113._timestamp:
-        1743368491
+        1707401778
      values.pendingSanctions.112._to:
-        "0x52F09693c9eEaA93A64BA697e3d3e43a1eB65477"
+        "0x9568D407b9BD55F20d20982306C6Feca5e43eb47"
      values.pendingSanctions.112._timestamp:
-        1707401778
+        1743368190
      values.pendingSanctions.111._to:
-        "0x9568D407b9BD55F20d20982306C6Feca5e43eb47"
+        "0xD32f6b08314E52744d244c764d1DA85c04514f34"
      values.pendingSanctions.111._timestamp:
-        1743368190
+        1743368220
      values.pendingSanctions.110._to:
-        "0xD32f6b08314E52744d244c764d1DA85c04514f34"
+        "0x6E944c6B214B215dfe053e7287f04f700a467DA8"
      values.pendingSanctions.110._timestamp:
-        1743368220
+        1743368147
      values.pendingSanctions.109._to:
-        "0x6E944c6B214B215dfe053e7287f04f700a467DA8"
+        "0x1d9E490938feD3dF12A09528aa25ff6620d69d1b"
      values.pendingSanctions.109._timestamp:
-        1743368147
+        1743367401
      values.pendingSanctions.108._to:
-        "0x1d9E490938feD3dF12A09528aa25ff6620d69d1b"
+        "0xdb563dA812f5d90727bb12a0959F5679B9a2Ea5F"
      values.pendingSanctions.108._timestamp:
-        1743367401
+        1710533376
      values.pendingSanctions.107._to:
-        "0xdb563dA812f5d90727bb12a0959F5679B9a2Ea5F"
+        "0x09A95021fB4E9C7e391B3e7D4726748251C5d970"
      values.pendingSanctions.107._timestamp:
-        1710533376
+        1743367391
      values.pendingSanctions.106._to:
-        "0x09A95021fB4E9C7e391B3e7D4726748251C5d970"
+        "0xF8e3A7C50095B105dd049643f32531cDE57eBDA7"
      values.pendingSanctions.106._timestamp:
-        1743367391
+        1743368286
      values.pendingSanctions.105._to:
-        "0xF8e3A7C50095B105dd049643f32531cDE57eBDA7"
+        "0xaACA709AaD0E99891A16c4e2028Ad5053cEeB2b0"
      values.pendingSanctions.104._to:
-        "0xaACA709AaD0E99891A16c4e2028Ad5053cEeB2b0"
+        "0x1695b31503e1C49123c000ab24626750b858E972"
      values.pendingSanctions.104._timestamp:
-        1743368286
+        1743367401
      values.pendingSanctions.103._to:
-        "0x1695b31503e1C49123c000ab24626750b858E972"
+        "0x42AAd1F0E18C9867Dd1bE8FB7E6f4119BAC62740"
      values.pendingSanctions.103._timestamp:
-        1743367401
+        1743368117
      values.pendingSanctions.102._to:
-        "0x42AAd1F0E18C9867Dd1bE8FB7E6f4119BAC62740"
+        "0xb2c54B111705B23BCB4cf584C396982c3B613F99"
      values.pendingSanctions.102._timestamp:
-        1743368117
+        1707739213
      values.pendingSanctions.101._to:
-        "0xb2c54B111705B23BCB4cf584C396982c3B613F99"
+        "0x3c500E160EaB2CD26027a3389b70ED4e17cd9544"
      values.pendingSanctions.101._timestamp:
-        1707739213
+        1743368117
      values.pendingSanctions.100._to:
-        "0x3c500E160EaB2CD26027a3389b70ED4e17cd9544"
+        "0xa5AFC38dDBE6e2dda8dC7A4fdae380a9Dbe12a06"
      values.pendingSanctions.100._timestamp:
-        1743368117
+        1707472806
      values.pendingSanctions.99._to:
-        "0xa5AFC38dDBE6e2dda8dC7A4fdae380a9Dbe12a06"
+        "0xac2ec1ec2E53098Ebbd36753187CDDf7E3d438AB"
      values.pendingSanctions.99._timestamp:
-        1707472806
+        1743368466
      values.pendingSanctions.98._to:
-        "0xac2ec1ec2E53098Ebbd36753187CDDf7E3d438AB"
+        "0x0E00e97FefD00F71b54E038899a97b470D6f662F"
      values.pendingSanctions.98._timestamp:
-        1743368466
+        1719718683
      values.pendingSanctions.97._to:
-        "0x0E00e97FefD00F71b54E038899a97b470D6f662F"
+        "0xd9E77167C8b13b9D1AFF04CC469Ad55BEeB78358"
      values.pendingSanctions.97._timestamp:
-        1719718683
+        1743368491
      values.pendingSanctions.96._to:
-        "0xd9E77167C8b13b9D1AFF04CC469Ad55BEeB78358"
+        "0x4F5D61De15F7D9C933f78937295402b3E0D9AA6f"
      values.pendingSanctions.96._timestamp:
-        1743368491
+        1708077610
      values.pendingSanctions.95._to:
-        "0x4F5D61De15F7D9C933f78937295402b3E0D9AA6f"
+        "0xcf011278736204F57B343568A8A8DC09f266a834"
      values.pendingSanctions.95._timestamp:
-        1708077610
+        1706580004
      values.pendingSanctions.94._to:
-        "0xcf011278736204F57B343568A8A8DC09f266a834"
+        "0x63b6bbBcab97d26d87abfb2E68E63ebd7772C0cb"
      values.pendingSanctions.94._timestamp:
-        1706580004
+        1743368147
      values.pendingSanctions.93._to:
-        "0x63b6bbBcab97d26d87abfb2E68E63ebd7772C0cb"
+        "0xf6f06e71eFB2671eAaBcf6E2C090357c995C495D"
      values.pendingSanctions.93._timestamp:
-        1743368147
+        1718846587
      values.pendingSanctions.92._to:
-        "0xf6f06e71eFB2671eAaBcf6E2C090357c995C495D"
+        "0x1971eB33A28eCFa6BF701a6efec4255633F338FB"
      values.pendingSanctions.92._timestamp:
-        1718846587
+        1718846645
      values.pendingSanctions.91._to:
-        "0x1971eB33A28eCFa6BF701a6efec4255633F338FB"
+        "0xfF4a476cf39589be4b6Ad7e4b36d7156710b5c3e"
      values.pendingSanctions.91._timestamp:
-        1718846645
+        1743368523
      values.pendingSanctions.90._to:
-        "0xfF4a476cf39589be4b6Ad7e4b36d7156710b5c3e"
+        "0x62671619ccb07Db5f94A8381A308989C953A0Cc9"
      values.pendingSanctions.90._timestamp:
-        1743368523
+        1743368147
      values.pendingSanctions.89._to:
-        "0x62671619ccb07Db5f94A8381A308989C953A0Cc9"
+        "0xb6753e1DEbD7e615bC9c89aF2D2b8580F6B06b13"
      values.pendingSanctions.89._timestamp:
-        1743368147
+        1743368466
      values.pendingSanctions.88._to:
-        "0xb6753e1DEbD7e615bC9c89aF2D2b8580F6B06b13"
+        "0xcb1fb203B40de4EC7B685907D8901B249480e534"
      values.pendingSanctions.88._timestamp:
-        1743368466
+        1743395045
      values.pendingSanctions.87._to:
-        "0xcb1fb203B40de4EC7B685907D8901B249480e534"
+        "0x2AC29F4a5bA804844fCb72c2E1d739C7F24fC749"
      values.pendingSanctions.87._timestamp:
-        1743395045
+        1743368100
      values.pendingSanctions.86._to:
-        "0x2AC29F4a5bA804844fCb72c2E1d739C7F24fC749"
+        "0x9C31138FDb4baC14eAC4dbc0C4Ec8F1ea77E9682"
      values.pendingSanctions.86._timestamp:
-        1743368100
+        1743368190
      values.pendingSanctions.85._to:
-        "0x9C31138FDb4baC14eAC4dbc0C4Ec8F1ea77E9682"
+        "0xCD856EfFC6ee06b8395bCD81d46884356680D658"
      values.pendingSanctions.85._timestamp:
-        1743368190
+        1743368220
      values.pendingSanctions.84._to:
-        "0xCD856EfFC6ee06b8395bCD81d46884356680D658"
+        "0xEA240C87B28a5074abbb34058935AD26391e6126"
      values.pendingSanctions.84._timestamp:
-        1743368220
+        1743368286
      values.pendingSanctions.83._to:
-        "0xEA240C87B28a5074abbb34058935AD26391e6126"
+        "0xf5B0cF796D4E58c74480Ddc20A701d7d159D7C70"
      values.pendingSanctions.83._timestamp:
-        1743368286
+        1743395045
      values.pendingSanctions.82._to:
-        "0xf5B0cF796D4E58c74480Ddc20A701d7d159D7C70"
+        "0x634D84AFE8Bed2f308F99bdE4677A6D1F8DBfC6D"
      values.pendingSanctions.82._timestamp:
-        1743395045
+        1743368147
      values.pendingSanctions.81._to:
-        "0x634D84AFE8Bed2f308F99bdE4677A6D1F8DBfC6D"
+        "0xca3E2E5c75121Cb46360E4459F6F94dCA6D868f4"
      values.pendingSanctions.81._timestamp:
-        1743368147
+        1707462016
      values.pendingSanctions.80._to:
-        "0xca3E2E5c75121Cb46360E4459F6F94dCA6D868f4"
+        "0x8F14A1990cB5D327E545be6aF2a03B517aC58259"
      values.pendingSanctions.80._timestamp:
-        1707462016
+        1706074667
      values.pendingSanctions.79._to:
-        "0x8F14A1990cB5D327E545be6aF2a03B517aC58259"
+        "0xfafdcA2FfEE318eaA4463003F6a99A16B8FEe45c"
      values.pendingSanctions.79._timestamp:
-        1706074667
+        1743368523
      values.pendingSanctions.78._to:
-        "0xfafdcA2FfEE318eaA4463003F6a99A16B8FEe45c"
+        "0x3e8c3aB6C952d626A48EdBCA0fd86c891Ab3c63f"
      values.pendingSanctions.78._timestamp:
-        1743368523
+        1743368117
      values.pendingSanctions.77._to:
-        "0x3e8c3aB6C952d626A48EdBCA0fd86c891Ab3c63f"
+        "0x6dc56C56e81EE1D496274f9349696657Dd005B0a"
      values.pendingSanctions.77._timestamp:
-        1743368117
+        1743368147
      values.pendingSanctions.76._to:
-        "0x6dc56C56e81EE1D496274f9349696657Dd005B0a"
+        "0xC3124240b6faAC99FaCeaC43E9698efFc5A997ad"
      values.pendingSanctions.76._timestamp:
-        1743368147
+        1743368220
      values.pendingSanctions.75._to:
-        "0xC3124240b6faAC99FaCeaC43E9698efFc5A997ad"
+        "0x403fA81DB3CB6095007E8377500E676cB7dbFcB9"
      values.pendingSanctions.75._timestamp:
-        1743368220
+        1743368117
      values.pendingSanctions.74._to:
-        "0x403fA81DB3CB6095007E8377500E676cB7dbFcB9"
+        "0x6CDB95f68B61922d4fE0708e55792390D8c669e4"
      values.pendingSanctions.74._timestamp:
-        1743368117
+        1719718623
      values.pendingSanctions.73._to:
-        "0x6CDB95f68B61922d4fE0708e55792390D8c669e4"
+        "0x574CFb5AA6F7A05B111Cd298b73A4123AAfdF97f"
      values.pendingSanctions.73._timestamp:
-        1719718623
+        1710932425
      values.pendingSanctions.72._to:
-        "0x574CFb5AA6F7A05B111Cd298b73A4123AAfdF97f"
+        "0x2c0c5825cD05B58d504E76d0e0571b9Bc07DF2A3"
      values.pendingSanctions.72._timestamp:
-        1710932425
+        1743368100
      values.pendingSanctions.71._to:
-        "0x2c0c5825cD05B58d504E76d0e0571b9Bc07DF2A3"
+        "0x1E25292Ed119b1ca6aEaaF11F520ff0bCb638740"
      values.pendingSanctions.71._timestamp:
-        1743368100
+        1743367401
      values.pendingSanctions.70._to:
-        "0x1E25292Ed119b1ca6aEaaF11F520ff0bCb638740"
+        "0xCfcB156E4EB3f85A6FE1cec2DC83FBFEcF8Ee7FC"
      values.pendingSanctions.70._timestamp:
-        1743367401
+        1743368220
      values.pendingSanctions.69._to:
-        "0xCfcB156E4EB3f85A6FE1cec2DC83FBFEcF8Ee7FC"
+        "0x4996Ea58A0E3cAB8A324366E9684d1E2e679ce67"
      values.pendingSanctions.69._timestamp:
-        1743368220
+        1743368117
      values.pendingSanctions.68._to:
-        "0x4996Ea58A0E3cAB8A324366E9684d1E2e679ce67"
+        "0x9bfAd309FA457804B60FBec15Ec6D174111587f5"
      values.pendingSanctions.68._timestamp:
-        1743368117
+        1743368207
      values.pendingSanctions.67._to:
-        "0x9bfAd309FA457804B60FBec15Ec6D174111587f5"
+        "0x1B2888e792e82fe352FC9D1E73cdc91C6217F55c"
      values.pendingSanctions.67._timestamp:
-        1743368207
+        1717533287
      values.pendingSanctions.66._to:
-        "0x1B2888e792e82fe352FC9D1E73cdc91C6217F55c"
+        "0x615E981442C93325449cB379d991237a01c06b15"
      values.pendingSanctions.66._timestamp:
-        1717533287
+        1719715389
      values.pendingSanctions.65._to:
-        "0x615E981442C93325449cB379d991237a01c06b15"
+        "0xB3902654321D214d2B7Ca531832d0EF19780fDef"
      values.pendingSanctions.65._timestamp:
-        1719715389
+        1719718623
      values.pendingSanctions.64._to:
-        "0xB3902654321D214d2B7Ca531832d0EF19780fDef"
+        "0x2bf871ca38EbF4D6Ce0124d8551F236BA33F6e8A"
      values.pendingSanctions.64._timestamp:
-        1719718623
+        1742239091
      values.pendingSanctions.63._to:
-        "0x2bf871ca38EbF4D6Ce0124d8551F236BA33F6e8A"
+        "0x3365dB4c3490AC6A43986Cfe2c26FE61B22aA917"
      values.pendingSanctions.63._timestamp:
-        1742239091
+        1707494421
      values.pendingSanctions.62._to:
-        "0x3365dB4c3490AC6A43986Cfe2c26FE61B22aA917"
+        "0x6baa2c84A37999D264DA7bEe9639cDd3171c1397"
      values.pendingSanctions.62._timestamp:
-        1707494421
+        1719718683
      values.pendingSanctions.61._to:
-        "0x6baa2c84A37999D264DA7bEe9639cDd3171c1397"
+        "0x258DcCC0802232B7C9BC9ee71fde382Ed88d7Ce0"
      values.pendingSanctions.61._timestamp:
-        1719718683
+        1743367401
      values.pendingSanctions.60._to:
-        "0x258DcCC0802232B7C9BC9ee71fde382Ed88d7Ce0"
+        "0xfD73361D700410FC1513e91acf5E138d00a3dBe3"
      values.pendingSanctions.60._timestamp:
-        1743367401
+        1743368523
      values.pendingSanctions.59._to:
-        "0xfD73361D700410FC1513e91acf5E138d00a3dBe3"
+        "0xbafC930Eff179386813D17AF4f70A7d367f37E55"
      values.pendingSanctions.59._timestamp:
-        1743368523
+        1743394986
      values.pendingSanctions.58._to:
-        "0xbafC930Eff179386813D17AF4f70A7d367f37E55"
+        "0x0E084652CDc1a68f42218522b9A8a68FC4e6619f"
      values.pendingSanctions.58._timestamp:
-        1743394986
+        1743367391
      values.pendingSanctions.57._to:
-        "0x0E084652CDc1a68f42218522b9A8a68FC4e6619f"
+        "0x73163b73F526F436DD3234a439c4b691f5Db6F0c"
      values.pendingSanctions.57._timestamp:
-        1743367391
+        1743394746
      values.pendingSanctions.56._to:
-        "0x73163b73F526F436DD3234a439c4b691f5Db6F0c"
+        "0x92D620d0279359727A0128cC19b84EEF89621Fb4"
      values.pendingSanctions.56._timestamp:
-        1743394746
+        1708164033
      values.pendingSanctions.55._to:
-        "0x92D620d0279359727A0128cC19b84EEF89621Fb4"
+        "0x504CC21F6343F966E672ce27054f9b7e546cd918"
      values.pendingSanctions.55._timestamp:
-        1708164033
+        1719715623
      values.pendingSanctions.54._to:
-        "0x504CC21F6343F966E672ce27054f9b7e546cd918"
+        "0x3C9959C3EfEC9674926D86D8CAA814A486bA047B"
      values.pendingSanctions.54._timestamp:
-        1719715623
+        1712740568
      values.pendingSanctions.53._to:
-        "0x3C9959C3EfEC9674926D86D8CAA814A486bA047B"
+        "0x07bAA7EFD71836c440115add44f433B660cf61b8"
      values.pendingSanctions.53._timestamp:
-        1712740568
+        1743367391
      values.pendingSanctions.52._to:
-        "0x07bAA7EFD71836c440115add44f433B660cf61b8"
+        "0x158B49eCD928000B49036a4B3dD1E45ad7FEcEBE"
      values.pendingSanctions.52._timestamp:
-        1743367391
+        1743367401
      values.pendingSanctions.51._to:
-        "0x158B49eCD928000B49036a4B3dD1E45ad7FEcEBE"
+        "0xdD330d70F14AEa4Ce7b9E777fDCC117321c74124"
      values.pendingSanctions.51._timestamp:
-        1743367401
+        1722940629
      values.pendingSanctions.50._to:
-        "0xdD330d70F14AEa4Ce7b9E777fDCC117321c74124"
+        "0x49aEa6275e1D94Df2AC90c3ee4e4afd47e468d71"
      values.pendingSanctions.50._timestamp:
-        1722940629
+        1712710928
      values.pendingSanctions.49._to:
-        "0x49aEa6275e1D94Df2AC90c3ee4e4afd47e468d71"
+        "0x93402720154e26A044E8389D2733F281fF830c5c"
      values.pendingSanctions.49._timestamp:
-        1712710928
+        1717937047
      values.pendingSanctions.48._to:
-        "0x93402720154e26A044E8389D2733F281fF830c5c"
+        "0x32C4a3feAcff6592ed5a3878cFb839dD282f5807"
      values.pendingSanctions.48._timestamp:
-        1717937047
+        1743394623
      values.pendingSanctions.47._to:
-        "0x32C4a3feAcff6592ed5a3878cFb839dD282f5807"
+        "0x273DDd44f634c71112D2244B59999eD9A9Dd0562"
      values.pendingSanctions.47._timestamp:
-        1743394623
+        1743367401
      values.pendingSanctions.46._to:
-        "0x273DDd44f634c71112D2244B59999eD9A9Dd0562"
+        "0xaE815562105d42a06D06ff31139A63eE3F72128a"
      values.pendingSanctions.46._timestamp:
-        1743367401
+        1743368466
      values.pendingSanctions.45._to:
-        "0xaE815562105d42a06D06ff31139A63eE3F72128a"
+        "0x7498cF5863fd745eE79d7F07516725b87fE9C8FB"
      values.pendingSanctions.45._timestamp:
-        1743368466
+        1706148032
      values.pendingSanctions.44._to:
-        "0x7498cF5863fd745eE79d7F07516725b87fE9C8FB"
+        "0x1e9478A59d7182ddEd839bCc1aC7249D9c779003"
      values.pendingSanctions.44._timestamp:
-        1706148032
+        1743367401
      values.pendingSanctions.43._to:
-        "0x1e9478A59d7182ddEd839bCc1aC7249D9c779003"
+        "0x23c48DE9c94873Ca477871987c5a6C691517cc7C"
      values.pendingSanctions.42._to:
-        "0x23c48DE9c94873Ca477871987c5a6C691517cc7C"
+        "0xc884086a4e38a1072a0B4ED81054E9eEc92637ae"
      values.pendingSanctions.42._timestamp:
-        1743367401
+        1743368466
      values.pendingSanctions.41._to:
-        "0xc884086a4e38a1072a0B4ED81054E9eEc92637ae"
+        "0xe7e376c075D142f2b2A8de8708D723aC4a0d02aC"
      values.pendingSanctions.41._timestamp:
-        1743368466
+        1743368491
      values.pendingSanctions.40._to:
-        "0xe7e376c075D142f2b2A8de8708D723aC4a0d02aC"
+        "0x7B33a8711b11e9db091451D01730E2640F331bB3"
      values.pendingSanctions.40._timestamp:
-        1743368491
+        1749084849
    }
```

Generated with discovered.json: 0x11972e4b90404c6b9e17a80de8930827c78ecc30

# Diff at Wed, 04 Jun 2025 09:32:34 GMT:

- chain: kinto
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@2c1561a0dd20d4853f867f43267ae9042bbca2cd block: 869343
- current block number: 877400

## Description

schedule tx for adding the Kinto Multisig 2 as DEV_HELPER_ROLE (can whitelist dev addresses through `overrideChildToParentContract()`).

```
Queued Operations:

Operation 0x25dbd4db143152f95eb6f98dbef40d34f2eabfc4a54c636315659867e0153a85:
    Nonce: 1
    Scheduled for: 2025-06-14T20:44:47.000Z
    Caller: Kinto Multisig 2 (0x2e2b1c42e38f5af81771e65d87729e57abd1337a)
    Target: AccessManager (0xacc000818e5bbd911d5d449aa81cb5ca24024739)
    Function: grantRole(DEV_HELPER_ROLE, Kinto Multisig 2 (0x2e2b1c42e38f5af81771e65d87729e57abd1337a), 0 (0s))
    Scheduled by Tx: https://explorer.kinto.xyz/tx/0x827821074c296a7d518a8a8d6a6a676840adfe5f6268408f4fc7c89b6ffdee57
```

## Watched changes

```diff
    contract AccessManager (0xacC000818e5Bbd911D5d449aA81CB5cA24024739) {
    +++ description: OpenZeppelin AccessManager contract: Serves as a proxy contract defining the roles, permissions and delays to call functions in target contracts.
      values.accessControl.targets.0x5A2b641b84b0230C8e75F55d5afd27f4Dbd59d5b.roleFunctions.DEV_HELPER_ROLE:
+        ["overrideChildToParentContract(address,address)"]
      values.AdditionalRoleLabels.DEV_HELPER_ROLE:
+        ["12665434841745889720"]
+++ description: List of scheduled operations.
+++ severity: HIGH
      values.OperationScheduled.15:
+        {"operationId":"0x0ad95e032eb7beede43f2741b7bcef6566a6163eaa1ac1ef42441f25193096d8","nonce":1,"schedule":1743464541,"caller":"0x2e2B1c42E38f5af81771e65D87729E57ABD1337a","target":"0xacC000818e5Bbd911D5d449aA81CB5cA24024739","data":"0x25c471a0000000000000000000000000000000000000000000000000783b0946b8c9d2e30000000000000000000000002e2b1c42e38f5af81771e65d87729e57abd1337a00000000000000000000000000000000000000000000000000000000000e8080"}
      values.OperationScheduled.14.operationId:
-        "0x0ad95e032eb7beede43f2741b7bcef6566a6163eaa1ac1ef42441f25193096d8"
+        "0xdc3e209a2fe4bae73e8fa0e602f61b887a4e123a18319283c3535622c64980f9"
      values.OperationScheduled.14.schedule:
-        1743464541
+        1744220010
      values.OperationScheduled.14.data:
-        "0x25c471a0000000000000000000000000000000000000000000000000783b0946b8c9d2e30000000000000000000000002e2b1c42e38f5af81771e65d87729e57abd1337a00000000000000000000000000000000000000000000000000000000000e8080"
+        "0x25c471a0000000000000000000000000000000000000000000000000273c0248976abc550000000000000000000000002e2b1c42e38f5af81771e65d87729e57abd1337a0000000000000000000000000000000000000000000000000000000000000000"
      values.OperationScheduled.13.operationId:
-        "0xdc3e209a2fe4bae73e8fa0e602f61b887a4e123a18319283c3535622c64980f9"
+        "0x1da4805821f761c940612ee65771335cc7ba51c99fad482463a23aca00081b5c"
      values.OperationScheduled.13.schedule:
-        1744220010
+        1748821945
      values.OperationScheduled.13.data:
-        "0x25c471a0000000000000000000000000000000000000000000000000273c0248976abc550000000000000000000000002e2b1c42e38f5af81771e65d87729e57abd1337a0000000000000000000000000000000000000000000000000000000000000000"
+        "0x08d6122d0000000000000000000000005a2b641b84b0230c8e75f55d5afd27f4dbd59d5b0000000000000000000000000000000000000000000000000000000000000060000000000000000000000000000000000000000000000000afc4a9e25c1e99b800000000000000000000000000000000000000000000000000000000000000019a6896f600000000000000000000000000000000000000000000000000000000"
      values.OperationScheduled.12.operationId:
-        "0x1da4805821f761c940612ee65771335cc7ba51c99fad482463a23aca00081b5c"
+        "0xdd5ae826ce8969e1e28b47bfb52c2ece6c9b94f3777698c30894e55dbc6fe8a0"
      values.OperationScheduled.12.schedule:
-        1748821945
+        1744220006
      values.OperationScheduled.12.data:
-        "0x08d6122d0000000000000000000000005a2b641b84b0230c8e75f55d5afd27f4dbd59d5b0000000000000000000000000000000000000000000000000000000000000060000000000000000000000000000000000000000000000000afc4a9e25c1e99b800000000000000000000000000000000000000000000000000000000000000019a6896f600000000000000000000000000000000000000000000000000000000"
+        "0x853551b8000000000000000000000000000000000000000000000000273c0248976abc55000000000000000000000000000000000000000000000000000000000000004000000000000000000000000000000000000000000000000000000000000000165245434f564552595f415050524f5645525f524f4c4500000000000000000000"
      values.OperationScheduled.11.operationId:
-        "0xdd5ae826ce8969e1e28b47bfb52c2ece6c9b94f3777698c30894e55dbc6fe8a0"
+        "0x25dbd4db143152f95eb6f98dbef40d34f2eabfc4a54c636315659867e0153a85"
      values.OperationScheduled.11.schedule:
-        1744220006
+        1749933887
      values.OperationScheduled.11.data:
-        "0x853551b8000000000000000000000000000000000000000000000000273c0248976abc55000000000000000000000000000000000000000000000000000000000000004000000000000000000000000000000000000000000000000000000000000000165245434f564552595f415050524f5645525f524f4c4500000000000000000000"
+        "0x25c471a0000000000000000000000000000000000000000000000000afc4a9e25c1e99b80000000000000000000000002e2b1c42e38f5af81771e65d87729e57abd1337a0000000000000000000000000000000000000000000000000000000000000000"
      values.TargetFunctionRoleUpdated.0x5A2b641b84b0230C8e75F55d5afd27f4Dbd59d5b.4:
+        {"selector":"0x72592851","roleId":"14661544942390944024"}
      values.TargetFunctionRoleUpdated.0x5A2b641b84b0230C8e75F55d5afd27f4Dbd59d5b.3.selector:
-        "0x72592851"
+        "0x9a6896f6"
      values.TargetFunctionRoleUpdated.0x5A2b641b84b0230C8e75F55d5afd27f4Dbd59d5b.3.roleId:
-        "14661544942390944024"
+        "12665434841745889720"
    }
```

Generated with discovered.json: 0x4a3039af29a11febd2d9a406817631010e2a8433

# Diff at Fri, 30 May 2025 05:37:52 GMT:

- chain: ethereum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@a4d8c436027d17df0f9b76843cd6deb1888fa381 block: 22437620
- current block number: 22593509

## Description

Signer change.

## Watched changes

```diff
    contract Kinto Multisig (0xf152Abda9E4ce8b134eF22Dc3C6aCe19C4895D82) {
    +++ description: None
      values.$members.4:
-        "0x5D973Ea995d14799E528B14472346bfDE21eAe2e"
      values.$members.3:
-        "0xc1f4D15C16A1f3555E0a5F7AeFD1e17AD4aaf40B"
+        "0x5D973Ea995d14799E528B14472346bfDE21eAe2e"
      values.$members.2:
-        "0x08E674c4538caE03B6c05405881dDCd95DcaF5a8"
+        "0xc1f4D15C16A1f3555E0a5F7AeFD1e17AD4aaf40B"
      values.multisigThreshold:
-        "3 of 5 (60%)"
+        "3 of 4 (75%)"
    }
```

Generated with discovered.json: 0x0d55b58ef42f554cb4ba970a0aeee7c474664639

# Diff at Tue, 27 May 2025 08:31:37 GMT:

- chain: ethereum
- author: Michał Podsiadły (<michal.podsiadly@l2beat.com>)
- comparing to: main@fd658a9ed4bbd45fc5705d23b1906ca057d0d8b0 block: 22437620
- current block number: 22437620

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22437620 (main branch discovery), not current.

```diff
    contract RollupProxy (0x5073dA9cA4810f3E0aA01c20c7d9d02C3f522e11) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      sourceHashes.2:
-        "0xb8da0b3748daac768860783e8555198fd2d1bbdffb775b81557a7124890c7eca"
      sourceHashes.1:
-        "0x9349e73cbc2d2b818c1d79711574ba210b56249d8d3845bc78c776caf8f8ff42"
+        "0xb8da0b3748daac768860783e8555198fd2d1bbdffb775b81557a7124890c7eca"
      sourceHashes.0:
-        "0x7ee21b18b2e18c636bfafc08ff72692cc43302b2599ba75f0abad67282866dd5"
+        "0x86c7032e0f4b5468f1eb92c79b73ab4c7f053fc7bdfc88fdd360e2fe7baa1072"
    }
```

Generated with discovered.json: 0x03d314ccfca269df4f0f7b53c93b276eaa3e7550

# Diff at Mon, 26 May 2025 15:36:34 GMT:

- chain: ethereum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@d675d0bd208eadc685b2cb489512b83f62c0890e block: 22437620
- current block number: 22437620

## Description

config related: naming.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22437620 (main branch discovery), not current.

```diff
    EOA Certora 1 (0x5FB5040dfC5B8b9Ea40dFBd881188Ec85cDC0621) {
    +++ description: None
      name:
-        "Certora"
+        "Certora 1"
    }
```

Generated with discovered.json: 0x4340646eb2a3815d44dc81fbaee1a5c3afc082e8

# Diff at Fri, 23 May 2025 09:41:17 GMT:

- chain: kinto
- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@69cd181abbc3c830a6caf2f4429b37cae72ffdb8 block: 869343
- current block number: 869343

## Description

Introduced .role field on each permission, defaulting to field name on which it was defined (with '.' prefix)

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 869343 (main branch discovery), not current.

```diff
    EOA KintoSecurityCouncil_L2Alias (0x28fC10E12A78f986c78F973Fc70ED88072b34c8e) {
    +++ description: None
      receivedPermissions.3.role:
+        ".securityCouncilPermission"
      receivedPermissions.2.role:
+        ".securityCouncilPermission"
      receivedPermissions.1.role:
+        ".securityCouncilPermission"
      receivedPermissions.0.role:
+        ".securityCouncilPermission"
    }
```

```diff
    contract Kinto Multisig 2 (0x2e2B1c42E38f5af81771e65D87729E57ABD1337a) {
    +++ description: None
      receivedPermissions.5.permission:
-        "interact"
+        "upgrade"
      receivedPermissions.5.from:
-        "0xacC000818e5Bbd911D5d449aA81CB5cA24024739"
+        "0x0719D47A213149E2Ef8d3f5afDaDA8a8E22dfc03"
      receivedPermissions.5.delay:
-        1036800
      receivedPermissions.5.description:
-        "change the configuration of all AccessManager permissions (minimum delay shown, the total delay can be longer for some operations)."
      receivedPermissions.5.role:
+        "admin"
      receivedPermissions.4.from:
-        "0x0719D47A213149E2Ef8d3f5afDaDA8a8E22dfc03"
+        "0x1842a4EFf3eFd24c50B63c3CF89cECEe245Fc2bd"
      receivedPermissions.4.role:
+        "admin"
      receivedPermissions.3.permission:
-        "upgrade"
+        "interact"
      receivedPermissions.3.from:
-        "0x1842a4EFf3eFd24c50B63c3CF89cECEe245Fc2bd"
+        "0xacC000818e5Bbd911D5d449aA81CB5cA24024739"
      receivedPermissions.3.delay:
+        1036800
      receivedPermissions.3.description:
+        "change the configuration of all AccessManager permissions (minimum delay shown, the total delay can be longer for some operations)."
      receivedPermissions.3.role:
+        ".kintoMultisig2Permission"
      receivedPermissions.2.from:
-        "0x0100005D52Be9ab3ccE0C70Abf6F6FA2C48e91C9"
+        "0xf369f78E3A0492CC4e96a90dae0728A38498e9c7"
      receivedPermissions.2.description:
-        "mint Nio Guardian NFTs to any address, inheriting the permissions of the NFT."
+        "manage the KYC status of any user (sanction status and KYC metadata) and mint/burn KintoID NFTs."
      receivedPermissions.2.role:
+        ".KYC_PROVIDERs"
      receivedPermissions.1.role:
+        ".kintoMultisig2Permission"
      receivedPermissions.0.from:
-        "0xf369f78E3A0492CC4e96a90dae0728A38498e9c7"
+        "0x0100005D52Be9ab3ccE0C70Abf6F6FA2C48e91C9"
      receivedPermissions.0.description:
-        "manage the KYC status of any user (sanction status and KYC metadata) and mint/burn KintoID NFTs."
+        "mint Nio Guardian NFTs to any address, inheriting the permissions of the NFT."
      receivedPermissions.0.role:
+        ".owner"
    }
```

```diff
    EOA  (0x52F09693c9eEaA93A64BA697e3d3e43a1eB65477) {
    +++ description: None
      receivedPermissions.0.role:
+        ".KYC_PROVIDERs"
    }
```

```diff
    EOA  (0x6E09F8A68fB5278e0C33D239dC12B2Cec33F4aC7) {
    +++ description: None
      receivedPermissions.0.role:
+        ".KYC_PROVIDERs"
    }
```

```diff
    EOA  (0x6E31039abF8d248aBed57E307C9E1b7530c269E4) {
    +++ description: None
      receivedPermissions.0.role:
+        ".KYC_PROVIDERs"
    }
```

```diff
    EOA  (0x6fe642404B7B23F31251103Ca0efb538Ad4aeC07) {
    +++ description: None
      receivedPermissions.0.role:
+        ".KYC_PROVIDERs"
    }
```

```diff
    contract KintoWalletFactory (0x8a4720488CA32f1223ccFE5A087e250fE3BC5D75) {
    +++ description: Deploys new KintoWallet smartwallets for users upon passing KYC checks. Also manages the beacon implementation for all KintoWallets and their recovery logic. KintoWallets can be funded with ETH via this contract.
      directlyReceivedPermissions.1.role:
+        "admin"
      directlyReceivedPermissions.0.role:
+        ".owner"
    }
```

```diff
    contract AccessManager (0xacC000818e5Bbd911D5d449aA81CB5cA24024739) {
    +++ description: OpenZeppelin AccessManager contract: Serves as a proxy contract defining the roles, permissions and delays to call functions in target contracts.
      directlyReceivedPermissions.7.role:
+        "admin"
      directlyReceivedPermissions.6.role:
+        "admin"
      directlyReceivedPermissions.5.permission:
-        "interact"
+        "upgrade"
      directlyReceivedPermissions.5.from:
-        "0x5A2b641b84b0230C8e75F55d5afd27f4Dbd59d5b"
+        "0xf369f78E3A0492CC4e96a90dae0728A38498e9c7"
      directlyReceivedPermissions.5.description:
-        "manage addresses that are callable by EOAs and other white-/blacklists that are enforced globally on the Kinto L2."
      directlyReceivedPermissions.5.role:
+        ".UPGRADERs"
      directlyReceivedPermissions.4.permission:
-        "upgrade"
+        "interact"
      directlyReceivedPermissions.4.description:
+        "manage the KYC status of any user (sanction status and KYC metadata) and mint/burn KintoID NFTs."
      directlyReceivedPermissions.4.role:
+        ".KYC_PROVIDERs"
      directlyReceivedPermissions.3.from:
-        "0x8a4720488CA32f1223ccFE5A087e250fE3BC5D75"
+        "0x5A2b641b84b0230C8e75F55d5afd27f4Dbd59d5b"
      directlyReceivedPermissions.3.description:
-        "update the central KintoWallet implementation of all users on Kinto L2 and approve specific wallets for recovery via the turnkey recoverer."
+        "manage addresses that are callable by EOAs and other white-/blacklists that are enforced globally on the Kinto L2."
      directlyReceivedPermissions.3.role:
+        ".owner"
      directlyReceivedPermissions.2.from:
-        "0xf369f78E3A0492CC4e96a90dae0728A38498e9c7"
+        "0x8a4720488CA32f1223ccFE5A087e250fE3BC5D75"
      directlyReceivedPermissions.2.description:
-        "manage the KYC status of any user (sanction status and KYC metadata) and mint/burn KintoID NFTs."
+        "update the central KintoWallet implementation of all users on Kinto L2 and approve specific wallets for recovery via the turnkey recoverer."
      directlyReceivedPermissions.2.role:
+        ".owner"
      directlyReceivedPermissions.1.role:
+        ".GOVERNANCErs"
      directlyReceivedPermissions.0.role:
+        ".DEFAULT_ADMINs"
    }
```

```diff
    EOA  (0xb539019776eF803E89EC062Ad54cA24D1Fdb008a) {
    +++ description: None
      receivedPermissions.0.role:
+        ".KYC_PROVIDERs"
    }
```

Generated with discovered.json: 0xdb4d7b711526cb99174a6046185a8b3f2d4fbc57

# Diff at Fri, 23 May 2025 09:41:17 GMT:

- chain: ethereum
- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@69cd181abbc3c830a6caf2f4429b37cae72ffdb8 block: 22437620
- current block number: 22437620

## Description

Introduced .role field on each permission, defaulting to field name on which it was defined (with '.' prefix)

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22437620 (main branch discovery), not current.

```diff
    contract Kinto Security Council (0x17Eb10e12a78f986C78F973Fc70eD88072B33B7d) {
    +++ description: None
      receivedPermissions.10.role:
+        "admin"
      receivedPermissions.9.role:
+        "admin"
      receivedPermissions.8.role:
+        "admin"
      receivedPermissions.7.role:
+        "admin"
      receivedPermissions.6.role:
+        "admin"
      receivedPermissions.5.role:
+        "admin"
      receivedPermissions.4.role:
+        "admin"
      receivedPermissions.3.role:
+        "admin"
      receivedPermissions.2.role:
+        "admin"
      receivedPermissions.1.role:
+        "admin"
      receivedPermissions.0.role:
+        ".owner"
      directlyReceivedPermissions.0.role:
+        ".executors"
    }
```

```diff
    EOA Ankr (0x2bfDA59220413DEd39dD0E443620b5277EcE6348) {
    +++ description: None
      receivedPermissions.0.role:
+        ".validators"
    }
```

```diff
    EOA Hypernative2 (0x58028fFbc25aE2e12b96276bDB125955F41D41f3) {
    +++ description: None
      receivedPermissions.0.role:
+        ".validators"
    }
```

```diff
    contract UpgradeExecutor (0x59B851c8b1643e0735Ec3F2f0e528f3d89c3408a) {
    +++ description: Central contract defining the access control permissions for upgrading the system contract implementations.
      directlyReceivedPermissions.2.role:
+        "admin"
      directlyReceivedPermissions.1.role:
+        ".owner"
      directlyReceivedPermissions.0.role:
+        ".owner"
    }
```

```diff
    EOA Caldera2 (0x64Cf65036a76E3827e448cadbc53D31EefDCE04a) {
    +++ description: None
      receivedPermissions.0.role:
+        ".validators"
    }
```

```diff
    contract ProxyAdmin (0x74C717C01425eb475A5fC55d2A4a9045fC9800df) {
    +++ description: None
      directlyReceivedPermissions.8.role:
+        "admin"
      directlyReceivedPermissions.7.role:
+        "admin"
      directlyReceivedPermissions.6.role:
+        "admin"
      directlyReceivedPermissions.5.role:
+        "admin"
      directlyReceivedPermissions.4.role:
+        "admin"
      directlyReceivedPermissions.3.role:
+        "admin"
      directlyReceivedPermissions.2.role:
+        "admin"
      directlyReceivedPermissions.1.role:
+        "admin"
      directlyReceivedPermissions.0.role:
+        "admin"
    }
```

```diff
    EOA MamoriLabs3 (0x944eB0a2829A859959586b10D54229278534a696) {
    +++ description: None
      receivedPermissions.0.role:
+        ".validators"
    }
```

```diff
    EOA  (0xe27f3f6db6824def1738b2aACe2672aC59046a39) {
    +++ description: None
      receivedPermissions.0.role:
+        ".batchPosters"
    }
```

```diff
    EOA Venn2 (0xe528E74302FFCF6F9F6a1c973968d98F0fDbad8f) {
    +++ description: None
      receivedPermissions.0.role:
+        ".validators"
    }
```

```diff
    contract Kinto Multisig (0xf152Abda9E4ce8b134eF22Dc3C6aCe19C4895D82) {
    +++ description: None
      receivedPermissions.0.role:
+        "admin"
    }
```

Generated with discovered.json: 0x103c138a292812ec1952a34ff51fa08fc037bb04

# Diff at Wed, 21 May 2025 13:29:58 GMT:

- chain: kinto
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@28ec750f325ec979450bcc4eaac304d60b8b1276 block: 850146
- current block number: 869343

## Description

two new scheduled ops:

```
============= Queued Operations and Pending Role Grant Delays =============

Queued Operations:

Operation 0x69b7415762436b7382a471e6bd835c18496843f284e45e2772b8fdca14129eda:
    Nonce: 1
    Scheduled for: 2025-06-01T23:52:24.000Z
    Caller: Kinto Multisig 2 (0x2e2b1c42e38f5af81771e65d87729e57abd1337a)
    Target: AccessManager (0xacc000818e5bbd911d5d449aa81cb5ca24024739)
    Function: labelRole(DEV_HELPER_ROLE, "DEV_HELPER_ROLE")
    Scheduled by Tx: https://explorer.kinto.xyz/tx/0x660eb4463bc00a727c981e88d2e6cf11290aa6b528f0499dd65c6d7c6b2c75b9

Operation 0x1da4805821f761c940612ee65771335cc7ba51c99fad482463a23aca00081b5c:
    Nonce: 1
    Scheduled for: 2025-06-01T23:52:25.000Z
    Caller: Kinto Multisig 2 (0x2e2b1c42e38f5af81771e65d87729e57abd1337a)
    Target: AccessManager (0xacc000818e5bbd911d5d449aa81cb5ca24024739)
    Function: setTargetFunctionRole(KintoAppRegistry (0x5a2b641b84b0230c8e75f55d5afd27f4dbd59d5b), [overrideChildToParentContract(address,address)], DEV_HELPER_ROLE)
    Scheduled by Tx: https://explorer.kinto.xyz/tx/0xf3c8ff8bfb8b7d123d8d99d694e7f2b7db4fca8e1e7676975cdd1dd89e7d6563
```

a new role is added with the target KintoAppRegistry.overrideChildToParentContract(). This allows managing child contracts for developers. these child contracts are automatically whitelisted for a certain developer if they have a parent who is whitelisted for this dev. since the system contract whitelist cannot be changed by this function, censorship by potential non-SC actors with this new role is not possible.

## Watched changes

```diff
    contract AccessManager (0xacC000818e5Bbd911D5d449aA81CB5cA24024739) {
    +++ description: OpenZeppelin AccessManager contract: Serves as a proxy contract defining the roles, permissions and delays to call functions in target contracts.
+++ description: List of scheduled operations.
+++ severity: HIGH
      values.OperationScheduled.14:
+        {"operationId":"0x0ad95e032eb7beede43f2741b7bcef6566a6163eaa1ac1ef42441f25193096d8","nonce":1,"schedule":1743464541,"caller":"0x2e2B1c42E38f5af81771e65D87729E57ABD1337a","target":"0xacC000818e5Bbd911D5d449aA81CB5cA24024739","data":"0x25c471a0000000000000000000000000000000000000000000000000783b0946b8c9d2e30000000000000000000000002e2b1c42e38f5af81771e65d87729e57abd1337a00000000000000000000000000000000000000000000000000000000000e8080"}
+++ description: List of scheduled operations.
+++ severity: HIGH
      values.OperationScheduled.13:
+        {"operationId":"0xdc3e209a2fe4bae73e8fa0e602f61b887a4e123a18319283c3535622c64980f9","nonce":1,"schedule":1744220010,"caller":"0x2e2B1c42E38f5af81771e65D87729E57ABD1337a","target":"0xacC000818e5Bbd911D5d449aA81CB5cA24024739","data":"0x25c471a0000000000000000000000000000000000000000000000000273c0248976abc550000000000000000000000002e2b1c42e38f5af81771e65d87729e57abd1337a0000000000000000000000000000000000000000000000000000000000000000"}
      values.OperationScheduled.12.operationId:
-        "0x0ad95e032eb7beede43f2741b7bcef6566a6163eaa1ac1ef42441f25193096d8"
+        "0x1da4805821f761c940612ee65771335cc7ba51c99fad482463a23aca00081b5c"
      values.OperationScheduled.12.schedule:
-        1743464541
+        1748821945
      values.OperationScheduled.12.data:
-        "0x25c471a0000000000000000000000000000000000000000000000000783b0946b8c9d2e30000000000000000000000002e2b1c42e38f5af81771e65d87729e57abd1337a00000000000000000000000000000000000000000000000000000000000e8080"
+        "0x08d6122d0000000000000000000000005a2b641b84b0230c8e75f55d5afd27f4dbd59d5b0000000000000000000000000000000000000000000000000000000000000060000000000000000000000000000000000000000000000000afc4a9e25c1e99b800000000000000000000000000000000000000000000000000000000000000019a6896f600000000000000000000000000000000000000000000000000000000"
      values.OperationScheduled.11.operationId:
-        "0xdc3e209a2fe4bae73e8fa0e602f61b887a4e123a18319283c3535622c64980f9"
+        "0xdd5ae826ce8969e1e28b47bfb52c2ece6c9b94f3777698c30894e55dbc6fe8a0"
      values.OperationScheduled.11.schedule:
-        1744220010
+        1744220006
      values.OperationScheduled.11.data:
-        "0x25c471a0000000000000000000000000000000000000000000000000273c0248976abc550000000000000000000000002e2b1c42e38f5af81771e65d87729e57abd1337a0000000000000000000000000000000000000000000000000000000000000000"
+        "0x853551b8000000000000000000000000000000000000000000000000273c0248976abc55000000000000000000000000000000000000000000000000000000000000004000000000000000000000000000000000000000000000000000000000000000165245434f564552595f415050524f5645525f524f4c4500000000000000000000"
      values.OperationScheduled.10.operationId:
-        "0xdd5ae826ce8969e1e28b47bfb52c2ece6c9b94f3777698c30894e55dbc6fe8a0"
+        "0xc961c36ac064bc0a4f2e0be23c833c3e8d938587ce2f328fb818b8045e1137b1"
      values.OperationScheduled.10.schedule:
-        1744220006
+        1743905986
      values.OperationScheduled.10.data:
-        "0x853551b8000000000000000000000000000000000000000000000000273c0248976abc55000000000000000000000000000000000000000000000000000000000000004000000000000000000000000000000000000000000000000000000000000000165245434f564552595f415050524f5645525f524f4c4500000000000000000000"
+        "0x25c471a000000000000000000000000000000000000000000000000000000000000000000000000000000000000000002e2b1c42e38f5af81771e65d87729e57abd1337a00000000000000000000000000000000000000000000000000000000000fd200"
      values.OperationScheduled.9.operationId:
-        "0xc961c36ac064bc0a4f2e0be23c833c3e8d938587ce2f328fb818b8045e1137b1"
+        "0x62d4f9252894204088abbb251d9eb3f66b47459f8151390f3152ce5d0d0b189f"
      values.OperationScheduled.9.schedule:
-        1743905986
+        1744220007
      values.OperationScheduled.9.data:
-        "0x25c471a000000000000000000000000000000000000000000000000000000000000000000000000000000000000000002e2b1c42e38f5af81771e65d87729e57abd1337a00000000000000000000000000000000000000000000000000000000000fd200"
+        "0x853551b800000000000000000000000000000000000000000000000007d8641643fe2cba0000000000000000000000000000000000000000000000000000000000000040000000000000000000000000000000000000000000000000000000000000000f53414e4354494f4e45525f524f4c450000000000000000000000000000000000"
      values.OperationScheduled.8.operationId:
-        "0x62d4f9252894204088abbb251d9eb3f66b47459f8151390f3152ce5d0d0b189f"
+        "0x1180e76c68ad305ca046e644a97adb50f9b79684c420e10fbd71a5b941badea5"
      values.OperationScheduled.8.schedule:
-        1744220007
+        1744220008
      values.OperationScheduled.8.data:
-        "0x853551b800000000000000000000000000000000000000000000000007d8641643fe2cba0000000000000000000000000000000000000000000000000000000000000040000000000000000000000000000000000000000000000000000000000000000f53414e4354494f4e45525f524f4c450000000000000000000000000000000000"
+        "0x08d6122d000000000000000000000000f369f78e3a0492cc4e96a90dae0728a38498e9c7000000000000000000000000000000000000000000000000000000000000006000000000000000000000000000000000000000000000000007d8641643fe2cba0000000000000000000000000000000000000000000000000000000000000001fb0b294000000000000000000000000000000000000000000000000000000000"
      values.OperationScheduled.7.operationId:
-        "0x1180e76c68ad305ca046e644a97adb50f9b79684c420e10fbd71a5b941badea5"
+        "0x2fad4066aacd2052b8b133e635b4d73fbbe42674134fd28b91b0191d4a2cfb0d"
      values.OperationScheduled.7.schedule:
-        1744220008
+        1743905137
      values.OperationScheduled.7.data:
-        "0x08d6122d000000000000000000000000f369f78e3a0492cc4e96a90dae0728a38498e9c7000000000000000000000000000000000000000000000000000000000000006000000000000000000000000000000000000000000000000007d8641643fe2cba0000000000000000000000000000000000000000000000000000000000000001fb0b294000000000000000000000000000000000000000000000000000000000"
+        "0xd22b59890000000000000000000000008a4720488ca32f1223ccfe5a087e250fe3bc5d7500000000000000000000000000000000000000000000000000000000000fd200"
      values.OperationScheduled.6.operationId:
-        "0x2fad4066aacd2052b8b133e635b4d73fbbe42674134fd28b91b0191d4a2cfb0d"
+        "0xa148a26d04bda6140c756b460fb9e37aecd93c69443af9f523d113d8593f8163"
      values.OperationScheduled.6.schedule:
-        1743905137
+        1744220011
      values.OperationScheduled.6.data:
-        "0xd22b59890000000000000000000000008a4720488ca32f1223ccfe5a087e250fe3bc5d7500000000000000000000000000000000000000000000000000000000000fd200"
+        "0x25c471a000000000000000000000000000000000000000000000000007d8641643fe2cba00000000000000000000000028fc10e12a78f986c78f973fc70ed88072b34c8e0000000000000000000000000000000000000000000000000000000000000000"
      values.OperationScheduled.5.operationId:
-        "0xa148a26d04bda6140c756b460fb9e37aecd93c69443af9f523d113d8593f8163"
+        "0x18198983d32863dcc0dbdc5fbaf362b9e46652dae6c457956e761db4b87b8e4e"
      values.OperationScheduled.5.schedule:
-        1744220011
+        1744220008
      values.OperationScheduled.5.data:
-        "0x25c471a000000000000000000000000000000000000000000000000007d8641643fe2cba00000000000000000000000028fc10e12a78f986c78f973fc70ed88072b34c8e0000000000000000000000000000000000000000000000000000000000000000"
+        "0x08d6122d0000000000000000000000008a4720488ca32f1223ccfe5a087e250fe3bc5d750000000000000000000000000000000000000000000000000000000000000060000000000000000000000000000000000000000000000000273c0248976abc550000000000000000000000000000000000000000000000000000000000000001456cf49200000000000000000000000000000000000000000000000000000000"
      values.OperationScheduled.4.operationId:
-        "0x18198983d32863dcc0dbdc5fbaf362b9e46652dae6c457956e761db4b87b8e4e"
+        "0x69b7415762436b7382a471e6bd835c18496843f284e45e2772b8fdca14129eda"
      values.OperationScheduled.4.schedule:
-        1744220008
+        1748821944
      values.OperationScheduled.4.data:
-        "0x08d6122d0000000000000000000000008a4720488ca32f1223ccfe5a087e250fe3bc5d750000000000000000000000000000000000000000000000000000000000000060000000000000000000000000000000000000000000000000273c0248976abc550000000000000000000000000000000000000000000000000000000000000001456cf49200000000000000000000000000000000000000000000000000000000"
+        "0x853551b8000000000000000000000000000000000000000000000000afc4a9e25c1e99b80000000000000000000000000000000000000000000000000000000000000040000000000000000000000000000000000000000000000000000000000000000f4445565f48454c5045525f524f4c450000000000000000000000000000000000"
    }
```

Generated with discovered.json: 0x0bae3346b6031c6b404caac70477c7fdbc38f44c

# Diff at Mon, 12 May 2025 13:18:51 GMT:

- chain: kinto
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@5e25d362b71032c18a3417a2307d6923e1b5a519 block: 850146
- current block number: 850146

## Description

replace medium severity everywhere.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 850146 (main branch discovery), not current.

```diff
    contract KintoID (0xf369f78E3A0492CC4e96a90dae0728A38498e9c7) {
    +++ description: Manages Kinto's KYC system: The KYC_PROVIDER roles responsible for managing the KYC status and KYC metadata of user wallets. Each KintoWallet checks the KYC status of its user in this contract as part of the signature check.
      fieldMeta.KYC_PROVIDERs.severity:
-        "MEDIUM"
+        "HIGH"
    }
```

Generated with discovered.json: 0x8a1ba9050b01b05066890629ae8b3cfd17ed588f

# Diff at Thu, 08 May 2025 10:05:22 GMT:

- chain: ethereum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@8e1926142ab0c57cc131de4d8da307e13d9af54d block: 22137242
- current block number: 22437620

## Description

Standard Orbit upgrade with minor changes.

## Watched changes

```diff
    contract Inbox (0xBFfaA85c1756472fFC37e6D172A7eC0538C14474) {
    +++ description: Facilitates sending L1 to L2 messages like depositing ETH, but does not escrow funds.
      sourceHashes.0:
-        "0x457c34030000c1767f1ef518c365b671181e9e701db9642be8572edc1c44068c"
+        "0xa1b21b35992f15b6195b22f1c21b8e944919e03edcdc8342a98fcee0ef3f44c0"
      values.$implementation:
-        "0xc235c5194f2404234fc7C99b4dd15289BB735Cf5"
+        "0x296339ED40ec80746b239b04dE943bb8619784b7"
      values.$pastUpgrades.3:
+        ["2024-05-03T15:22:59.000Z","0x3ad996252ae2a17bb0e7b5ec38eee0d104fd097da479cb3911b34d925f1750d7",["0x518465d9f81bDE1e573f9bD2a6761F8ADaAFe73e"]]
      values.$pastUpgrades.2.2:
-        "0x3ad996252ae2a17bb0e7b5ec38eee0d104fd097da479cb3911b34d925f1750d7"
+        "0xec98dd39612eb11b2d7e15fc9961c34aba0796fd078989942636728ebeb888e3"
      values.$pastUpgrades.2.1:
-        "2024-05-03T15:22:59.000Z"
+        ["0xc235c5194f2404234fc7C99b4dd15289BB735Cf5"]
      values.$pastUpgrades.2.0:
-        ["0x518465d9f81bDE1e573f9bD2a6761F8ADaAFe73e"]
+        "2024-05-08T00:06:47.000Z"
      values.$pastUpgrades.1.2:
-        "0xec98dd39612eb11b2d7e15fc9961c34aba0796fd078989942636728ebeb888e3"
+        "2023-12-15T02:37:35.000Z"
      values.$pastUpgrades.1.1:
-        ["0xc235c5194f2404234fc7C99b4dd15289BB735Cf5"]
+        "0xd51bb4d6150d5fbaa61cf5281598b18c4efba4284aecb4420fc8d834dba357d8"
      values.$pastUpgrades.1.0:
-        "2024-05-08T00:06:47.000Z"
+        ["0x1162084C3C6575121146582Db5BE43189e8CEe6b"]
      values.$pastUpgrades.0.2:
-        "2023-12-15T02:37:35.000Z"
+        "2025-05-06T15:50:47.000Z"
      values.$pastUpgrades.0.1:
-        "0xd51bb4d6150d5fbaa61cf5281598b18c4efba4284aecb4420fc8d834dba357d8"
+        "0xddb2100d0cbc866a1716fa96353d277877650256d07b0291b60814276f866e28"
      values.$pastUpgrades.0.0.0:
-        "0x1162084C3C6575121146582Db5BE43189e8CEe6b"
+        "0x296339ED40ec80746b239b04dE943bb8619784b7"
      values.$upgradeCount:
-        3
+        4
      implementationNames.0xc235c5194f2404234fc7C99b4dd15289BB735Cf5:
-        "Inbox"
      implementationNames.0x296339ED40ec80746b239b04dE943bb8619784b7:
+        "Inbox"
    }
```

```diff
    contract SequencerInbox (0xF4Ef823D57819AC7202a081A5B49376BD28E7b3a) {
    +++ description: A sequencer (registered in this contract) can submit transaction batches or commitments here.
      sourceHashes.0:
-        "0x50cf57b01499408fa99da27cf0fee96ec30f0d40667d1aa090c442bc80f0636b"
+        "0x6bb86ac4bd0d31e049f543fcf0a8f94c952252222f115246ef9d5b8104d803cc"
      values.$implementation:
-        "0x57411f5BA52531e8199066bC8EC650470A744883"
+        "0xa5E09FfA33dd011F5B68aAA55F513D6773579f78"
      values.$pastUpgrades.2:
+        ["2024-06-27T16:39:47.000Z","0x9226b704344df97784d15fc6cdbcfef620f393011c803879e7ec2e8c875665b0",["0x57411f5BA52531e8199066bC8EC650470A744883"]]
      values.$pastUpgrades.1.2:
-        "0x9226b704344df97784d15fc6cdbcfef620f393011c803879e7ec2e8c875665b0"
+        ["0x873484Ba63353C8b71210ce123B465512d408B27"]
      values.$pastUpgrades.1.1:
-        "2024-06-27T16:39:47.000Z"
+        "2023-12-15T02:37:35.000Z"
      values.$pastUpgrades.1.0:
-        ["0x57411f5BA52531e8199066bC8EC650470A744883"]
+        "0xd51bb4d6150d5fbaa61cf5281598b18c4efba4284aecb4420fc8d834dba357d8"
      values.$pastUpgrades.0.2:
-        ["0x873484Ba63353C8b71210ce123B465512d408B27"]
+        "2025-05-06T15:50:47.000Z"
      values.$pastUpgrades.0.1:
-        "2023-12-15T02:37:35.000Z"
+        "0xddb2100d0cbc866a1716fa96353d277877650256d07b0291b60814276f866e28"
      values.$pastUpgrades.0.0:
-        "0xd51bb4d6150d5fbaa61cf5281598b18c4efba4284aecb4420fc8d834dba357d8"
+        ["0xa5E09FfA33dd011F5B68aAA55F513D6773579f78"]
      values.$upgradeCount:
-        2
+        3
      values.reader4844:
-        "0x434345973Ebf8249398E1EeB03A62bE418B48a05"
+        "0x9098e513950bC43184d39F4E283ECa137A3AF247"
      implementationNames.0x57411f5BA52531e8199066bC8EC650470A744883:
-        "SequencerInbox"
      implementationNames.0xa5E09FfA33dd011F5B68aAA55F513D6773579f78:
+        "SequencerInbox"
    }
```

## Source code changes

```diff
.../{.flat@22137242 => .flat}/Inbox/Inbox.sol      | 91 +++++++++++++++++-----
 .../SequencerInbox/SequencerInbox.sol              | 24 ++++--
 2 files changed, 90 insertions(+), 25 deletions(-)
```

Generated with discovered.json: 0x85ab2089a51c02b1e8d6ede5299ee2d6a93c70ce

# Diff at Mon, 05 May 2025 15:56:36 GMT:

- chain: kinto
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@30ca054bbefa91d57a0e71a49c313444ab339496 block: 845013
- current block number: 850146

## Description

Config related: templatize 3 contracts and tighten discodriven permissions.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 845013 (main branch discovery), not current.

```diff
    contract KintoAppRegistry (0x5A2b641b84b0230C8e75F55d5afd27f4Dbd59d5b) {
    +++ description: Central system contract defining addresses that are allowed to be called by EOAs. The modified Kinto node reads this configuration and drops all other transactions from EOAs (enforced by a modified state transition function). As a result, users can only transact using a canonical smart wallet.
      template:
+        "kinto/KintoAppRegistry"
    }
```

```diff
    contract AccessManager (0xacC000818e5Bbd911D5d449aA81CB5cA24024739) {
    +++ description: OpenZeppelin AccessManager contract: Serves as a proxy contract defining the roles, permissions and delays to call functions in target contracts.
      description:
-        "Standard OpenZeppelin AccessManager contract: Serves as a proxy contract defining the roles, permissions and delays to call functions in target contracts."
+        "OpenZeppelin AccessManager contract: Serves as a proxy contract defining the roles, permissions and delays to call functions in target contracts."
      fieldMeta.RoleAdminChanged.severity:
+        "HIGH"
      fieldMeta.RoleGrantDelayChanged.severity:
+        "HIGH"
      fieldMeta.TargetAdminDelayUpdated.severity:
+        "HIGH"
      fieldMeta.TargetFunctionRoleUpdated.severity:
+        "HIGH"
      fieldMeta.AdditionalRoleLabels.severity:
+        "HIGH"
      fieldMeta.RolesGranted.severity:
+        "HIGH"
      template:
+        "kinto/AccessManager"
    }
```

```diff
    contract KintoID (0xf369f78E3A0492CC4e96a90dae0728A38498e9c7) {
    +++ description: Manages Kinto's KYC system: The KYC_PROVIDER roles responsible for managing the KYC status and KYC metadata of user wallets. Each KintoWallet checks the KYC status of its user in this contract as part of the signature check.
      template:
+        "kinto/KintoID"
    }
```

Generated with discovered.json: 0xc1c912747104b78ae0727cd4f22df842019a872b

# Diff at Fri, 02 May 2025 17:25:42 GMT:

- chain: ethereum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@c598e33a0c469175b7abbd6c2a13b47b63d6b6a4 block: 22137242
- current block number: 22137242

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22137242 (main branch discovery), not current.

```diff
    contract RollupProxy (0x5073dA9cA4810f3E0aA01c20c7d9d02C3f522e11) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      usedTypes.0.arg.0xaf1dbdfceb871c00bfbb1675983133df04f0ed04e89647812513c091e3a982b3:
+        "Celestia Nitro 3.3.2 wasmModuleRoot"
    }
```

Generated with discovered.json: 0xa1e826e1b1cced3b291cba940fd154066ed8f591

# Diff at Tue, 29 Apr 2025 09:37:43 GMT:

- chain: kinto
- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@ef7477af00fe0b57a2f7cacf7e958c12494af662 block: 845013
- current block number: 845013

## Description

Field .issuedPermissions is removed from the output as no longer needed. Added 'permissionsConfigHash' due to refactoring of the modelling process (into a separate command).

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 845013 (main branch discovery), not current.

```diff
    contract NioGuardians (0x0100005D52Be9ab3ccE0C70Abf6F6FA2C48e91C9) {
    +++ description: Contract using NFTs as voting tokens to be used by Nio Guardians in the NioGovernor.
      issuedPermissions:
-        [{"permission":"interact","to":"0x2e2B1c42E38f5af81771e65D87729E57ABD1337a","description":"mint Nio Guardian NFTs to any address, inheriting the permissions of the NFT.","via":[]}]
    }
```

```diff
    contract Faucet (0x0719D47A213149E2Ef8d3f5afDaDA8a8E22dfc03) {
    +++ description: None
      issuedPermissions:
-        [{"permission":"upgrade","to":"0x2e2B1c42E38f5af81771e65D87729E57ABD1337a","via":[]}]
    }
```

```diff
    contract SponsorPaymaster (0x1842a4EFf3eFd24c50B63c3CF89cECEe245Fc2bd) {
    +++ description: Paymaster used for user transactions eligible for sponsorship.
      issuedPermissions:
-        [{"permission":"upgrade","to":"0x2e2B1c42E38f5af81771e65D87729E57ABD1337a","via":[]}]
    }
```

```diff
    contract AccessManager (0xacC000818e5Bbd911D5d449aA81CB5cA24024739) {
    +++ description: Standard OpenZeppelin AccessManager contract: Serves as a proxy contract defining the roles, permissions and delays to call functions in target contracts.
      issuedPermissions:
-        [{"permission":"interact","to":"0x28fC10E12A78f986c78F973Fc70ED88072b34c8e","delay":604800,"description":"change the configuration of all AccessManager permissions (minimum delay shown, the total delay can be longer for some operations).","via":[]},{"permission":"interact","to":"0x28fC10E12A78f986c78F973Fc70ED88072b34c8e","delay":950400,"description":"manage the whitelisted addresses in the KintoAppRegistry which affects censorship on the entire rollup.","via":[]},{"permission":"interact","to":"0x28fC10E12A78f986c78F973Fc70ED88072b34c8e","delay":950400,"description":"upgrade the implementation of the core contracts KintoID, KintoAppRegistry and KintoWalletFactory.","via":[]},{"permission":"interact","to":"0x28fC10E12A78f986c78F973Fc70ED88072b34c8e","description":"confirm sanctions, making them permanent without providing an exit window.","via":[]},{"permission":"interact","to":"0x2e2B1c42E38f5af81771e65D87729E57ABD1337a","delay":1036800,"description":"change the configuration of all AccessManager permissions (minimum delay shown, the total delay can be longer for some operations).","via":[]},{"permission":"interact","to":"0x2e2B1c42E38f5af81771e65D87729E57ABD1337a","description":"approve smart wallet recoveries for any KintoWallet.","via":[]}]
    }
```

```diff
    contract KintoID (0xf369f78E3A0492CC4e96a90dae0728A38498e9c7) {
    +++ description: Manages Kinto's KYC system: The KYC_PROVIDER roles responsible for managing the KYC status and KYC metadata of user wallets. Each KintoWallet checks the KYC status of its user in this contract as part of the signature check.
      issuedPermissions:
-        [{"permission":"interact","to":"0x2e2B1c42E38f5af81771e65D87729E57ABD1337a","description":"manage the KYC status of any user (sanction status and KYC metadata) and mint/burn KintoID NFTs.","via":[]},{"permission":"interact","to":"0x52F09693c9eEaA93A64BA697e3d3e43a1eB65477","description":"manage the KYC status of any user (sanction status and KYC metadata) and mint/burn KintoID NFTs.","via":[]},{"permission":"interact","to":"0x6E09F8A68fB5278e0C33D239dC12B2Cec33F4aC7","description":"manage the KYC status of any user (sanction status and KYC metadata) and mint/burn KintoID NFTs.","via":[]},{"permission":"interact","to":"0x6E31039abF8d248aBed57E307C9E1b7530c269E4","description":"manage the KYC status of any user (sanction status and KYC metadata) and mint/burn KintoID NFTs.","via":[]},{"permission":"interact","to":"0x6fe642404B7B23F31251103Ca0efb538Ad4aeC07","description":"manage the KYC status of any user (sanction status and KYC metadata) and mint/burn KintoID NFTs.","via":[]},{"permission":"interact","to":"0xb539019776eF803E89EC062Ad54cA24D1Fdb008a","description":"manage the KYC status of any user (sanction status and KYC metadata) and mint/burn KintoID NFTs.","via":[]}]
    }
```

Generated with discovered.json: 0x013cd7169bb8d39db6d7c1b06f0426c64c1c238e

# Diff at Tue, 29 Apr 2025 09:37:43 GMT:

- chain: ethereum
- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@ef7477af00fe0b57a2f7cacf7e958c12494af662 block: 22137242
- current block number: 22137242

## Description

Field .issuedPermissions is removed from the output as no longer needed. Added 'permissionsConfigHash' due to refactoring of the modelling process (into a separate command).

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22137242 (main branch discovery), not current.

```diff
    contract Bridger (0x0f1b7bd7762662B23486320AA91F30312184f70C) {
    +++ description: Bridger gateway that can swap assets to 'L2 final assets' defined by the admin before bridging them to the L2. It does not have a function to bridge via the canonical bridge and uses the external socket bridge by default.
      issuedPermissions:
-        [{"permission":"upgrade","to":"0xf152Abda9E4ce8b134eF22Dc3C6aCe19C4895D82","via":[]}]
    }
```

```diff
    contract RollupProxy (0x5073dA9cA4810f3E0aA01c20c7d9d02C3f522e11) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      issuedPermissions:
-        [{"permission":"interact","to":"0x17Eb10e12a78f986C78F973Fc70eD88072B33B7d","description":"Pause and unpause and set important roles and parameters in the system contracts: Can delegate Sequencer management to a BatchPosterManager address, manage data availability, DACs and the fastConfirmer role, set the Sequencer-only window, introduce an allowList to the bridge and whitelist Inboxes/Outboxes.","via":[{"address":"0x59B851c8b1643e0735Ec3F2f0e528f3d89c3408a"}]},{"permission":"upgrade","to":"0x17Eb10e12a78f986C78F973Fc70eD88072B33B7d","via":[{"address":"0x59B851c8b1643e0735Ec3F2f0e528f3d89c3408a"}]},{"permission":"validate","to":"0x2bfDA59220413DEd39dD0E443620b5277EcE6348","description":"Can propose new state roots (called nodes) and challenge state roots on the host chain.","via":[]},{"permission":"validate","to":"0x58028fFbc25aE2e12b96276bDB125955F41D41f3","description":"Can propose new state roots (called nodes) and challenge state roots on the host chain.","via":[]},{"permission":"validate","to":"0x64Cf65036a76E3827e448cadbc53D31EefDCE04a","description":"Can propose new state roots (called nodes) and challenge state roots on the host chain.","via":[]},{"permission":"validate","to":"0x944eB0a2829A859959586b10D54229278534a696","description":"Can propose new state roots (called nodes) and challenge state roots on the host chain.","via":[]},{"permission":"validate","to":"0xe528E74302FFCF6F9F6a1c973968d98F0fDbad8f","description":"Can propose new state roots (called nodes) and challenge state roots on the host chain.","via":[]}]
    }
```

```diff
    contract RollupEventInbox (0x52EcE832AF3DF3125BbfD6423E0425dB3fA99D3F) {
    +++ description: Helper contract sending configuration data over the bridge during the systems initialization.
      issuedPermissions:
-        [{"permission":"upgrade","to":"0x17Eb10e12a78f986C78F973Fc70eD88072B33B7d","via":[{"address":"0x59B851c8b1643e0735Ec3F2f0e528f3d89c3408a"},{"address":"0x74C717C01425eb475A5fC55d2A4a9045fC9800df"}]}]
    }
```

```diff
    contract UpgradeExecutor (0x59B851c8b1643e0735Ec3F2f0e528f3d89c3408a) {
    +++ description: Central contract defining the access control permissions for upgrading the system contract implementations.
      issuedPermissions:
-        [{"permission":"upgrade","to":"0x17Eb10e12a78f986C78F973Fc70eD88072B33B7d","via":[{"address":"0x59B851c8b1643e0735Ec3F2f0e528f3d89c3408a"},{"address":"0x74C717C01425eb475A5fC55d2A4a9045fC9800df"}]}]
    }
```

```diff
    contract ChallengeManager (0x6228e2FB8C561f1a5A963039Bc38Eb6D539A1A7F) {
    +++ description: Contract that allows challenging state roots. Can be called through the RollupProxy by Validators or the UpgradeExecutor.
      issuedPermissions:
-        [{"permission":"upgrade","to":"0x17Eb10e12a78f986C78F973Fc70eD88072B33B7d","via":[{"address":"0x59B851c8b1643e0735Ec3F2f0e528f3d89c3408a"},{"address":"0x74C717C01425eb475A5fC55d2A4a9045fC9800df"}]}]
    }
```

```diff
    contract Outbox (0x655761AD5FC251F414D6993A73184B0669F278c8) {
    +++ description: Facilitates L2 to L1 contract calls: Messages initiated from L2 (for example withdrawal messages) eventually resolve in execution on L1.
      issuedPermissions:
-        [{"permission":"upgrade","to":"0x17Eb10e12a78f986C78F973Fc70eD88072B33B7d","via":[{"address":"0x59B851c8b1643e0735Ec3F2f0e528f3d89c3408a"},{"address":"0x74C717C01425eb475A5fC55d2A4a9045fC9800df"}]}]
    }
```

```diff
    contract ERC20Gateway (0x7870D5398DB488c669B406fBE57b8d05b6A35e42) {
    +++ description: Escrows deposited ERC-20 assets for the canonical Bridge. Upon depositing, a generic token representation will be minted at the destination. Withdrawals are initiated by the Outbox contract.
      issuedPermissions:
-        [{"permission":"upgrade","to":"0x17Eb10e12a78f986C78F973Fc70eD88072B33B7d","via":[{"address":"0x59B851c8b1643e0735Ec3F2f0e528f3d89c3408a"},{"address":"0x74C717C01425eb475A5fC55d2A4a9045fC9800df"}]}]
    }
```

```diff
    contract Bridge (0x859a53Fe2C8DA961387030E7CB498D6D20d0B2DB) {
    +++ description: Escrow contract for the project's gas token (can be different from ETH). Keeps a list of allowed Inboxes and Outboxes for canonical bridge messaging.
      issuedPermissions:
-        [{"permission":"upgrade","to":"0x17Eb10e12a78f986C78F973Fc70eD88072B33B7d","via":[{"address":"0x59B851c8b1643e0735Ec3F2f0e528f3d89c3408a"},{"address":"0x74C717C01425eb475A5fC55d2A4a9045fC9800df"}]}]
    }
```

```diff
    contract Inbox (0xBFfaA85c1756472fFC37e6D172A7eC0538C14474) {
    +++ description: Facilitates sending L1 to L2 messages like depositing ETH, but does not escrow funds.
      issuedPermissions:
-        [{"permission":"upgrade","to":"0x17Eb10e12a78f986C78F973Fc70eD88072B33B7d","via":[{"address":"0x59B851c8b1643e0735Ec3F2f0e528f3d89c3408a"},{"address":"0x74C717C01425eb475A5fC55d2A4a9045fC9800df"}]}]
    }
```

```diff
    contract GatewayRouter (0xD9041DeCaDcBA88844b373e7053B4AC7A3390D60) {
    +++ description: This routing contract maps tokens to the correct escrow (gateway) to be then bridged with canonical messaging.
      issuedPermissions:
-        [{"permission":"upgrade","to":"0x17Eb10e12a78f986C78F973Fc70eD88072B33B7d","via":[{"address":"0x59B851c8b1643e0735Ec3F2f0e528f3d89c3408a"},{"address":"0x74C717C01425eb475A5fC55d2A4a9045fC9800df"}]}]
    }
```

```diff
    contract SequencerInbox (0xF4Ef823D57819AC7202a081A5B49376BD28E7b3a) {
    +++ description: A sequencer (registered in this contract) can submit transaction batches or commitments here.
      issuedPermissions:
-        [{"permission":"sequence","to":"0xe27f3f6db6824def1738b2aACe2672aC59046a39","description":"Can submit transaction batches or commitments to the SequencerInbox contract on the host chain.","via":[]},{"permission":"upgrade","to":"0x17Eb10e12a78f986C78F973Fc70eD88072B33B7d","via":[{"address":"0x59B851c8b1643e0735Ec3F2f0e528f3d89c3408a"},{"address":"0x74C717C01425eb475A5fC55d2A4a9045fC9800df"}]}]
    }
```

Generated with discovered.json: 0xb5c6094116ea6f8338da407d47fd003faf141d93

# Diff at Mon, 28 Apr 2025 11:56:16 GMT:

- chain: kinto
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@640aad31846aa48203969768d234f58dfd9896e5 block: 838575
- current block number: 845013

## Description

config related (due to canActIndependently fix we merged).

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 838575 (main branch discovery), not current.

```diff
    contract Kinto Multisig 2 (0x2e2B1c42E38f5af81771e65D87729E57ABD1337a) {
    +++ description: None
      issuedPermissions:
-        [{"permission":"upgrade","to":"0x8a4720488CA32f1223ccFE5A087e250fE3BC5D75","via":[]}]
    }
```

```diff
    contract KintoAppRegistry (0x5A2b641b84b0230C8e75F55d5afd27f4Dbd59d5b) {
    +++ description: Central system contract defining addresses that are allowed to be called by EOAs. The modified Kinto node reads this configuration and drops all other transactions from EOAs (enforced by a modified state transition function). As a result, users can only transact using a canonical smart wallet.
      issuedPermissions:
-        [{"permission":"interact","to":"0xacC000818e5Bbd911D5d449aA81CB5cA24024739","description":"manage addresses that are callable by EOAs and other white-/blacklists that are enforced globally on the Kinto L2.","via":[]},{"permission":"upgrade","to":"0xacC000818e5Bbd911D5d449aA81CB5cA24024739","via":[]}]
    }
```

```diff
    contract BeaconKintoWallet (0x87f0eE85bF3198654900a422832157abBba30828) {
    +++ description: A beacon with an upgradeable implementation currently set as 0xbFE260680514e0D669fdC5A5f7334b97a5513d9D. Beacon proxy contracts pointing to this beacon will all use its implementation.
      issuedPermissions:
-        [{"permission":"interact","to":"0x8a4720488CA32f1223ccFE5A087e250fE3BC5D75","description":"change the beacon implementation.","via":[]}]
    }
```

```diff
    contract KintoWalletFactory (0x8a4720488CA32f1223ccFE5A087e250fE3BC5D75) {
    +++ description: Deploys new KintoWallet smartwallets for users upon passing KYC checks. Also manages the beacon implementation for all KintoWallets and their recovery logic. KintoWallets can be funded with ETH via this contract.
      issuedPermissions:
-        [{"permission":"interact","to":"0xacC000818e5Bbd911D5d449aA81CB5cA24024739","description":"update the central KintoWallet implementation of all users on Kinto L2 and approve specific wallets for recovery via the turnkey recoverer.","via":[]},{"permission":"upgrade","to":"0xacC000818e5Bbd911D5d449aA81CB5cA24024739","via":[]}]
      receivedPermissions:
-        [{"permission":"interact","from":"0x87f0eE85bF3198654900a422832157abBba30828","description":"change the beacon implementation."},{"permission":"upgrade","from":"0x2e2B1c42E38f5af81771e65D87729E57ABD1337a"}]
      directlyReceivedPermissions:
+        [{"permission":"interact","from":"0x87f0eE85bF3198654900a422832157abBba30828","description":"change the beacon implementation."},{"permission":"upgrade","from":"0x2e2B1c42E38f5af81771e65D87729E57ABD1337a"}]
    }
```

```diff
    contract AccessManager (0xacC000818e5Bbd911D5d449aA81CB5cA24024739) {
    +++ description: Standard OpenZeppelin AccessManager contract: Serves as a proxy contract defining the roles, permissions and delays to call functions in target contracts.
      receivedPermissions:
-        [{"permission":"interact","from":"0x5A2b641b84b0230C8e75F55d5afd27f4Dbd59d5b","description":"manage addresses that are callable by EOAs and other white-/blacklists that are enforced globally on the Kinto L2."},{"permission":"interact","from":"0x8a4720488CA32f1223ccFE5A087e250fE3BC5D75","description":"update the central KintoWallet implementation of all users on Kinto L2 and approve specific wallets for recovery via the turnkey recoverer."},{"permission":"interact","from":"0xf369f78E3A0492CC4e96a90dae0728A38498e9c7","description":"manage the KYC status of any user (sanction status and KYC metadata) and mint/burn KintoID NFTs."},{"permission":"interact","from":"0xf369f78E3A0492CC4e96a90dae0728A38498e9c7","description":"permissioned to call `confirmSanction()`, which makes a temporary sanction by a KYC_PROVIDER permanent and does not grant an exit window to the affected wallet."},{"permission":"interact","from":"0xf369f78E3A0492CC4e96a90dae0728A38498e9c7","description":"transfer KYC NFTs to a different address."},{"permission":"upgrade","from":"0x5A2b641b84b0230C8e75F55d5afd27f4Dbd59d5b"},{"permission":"upgrade","from":"0x8a4720488CA32f1223ccFE5A087e250fE3BC5D75"},{"permission":"upgrade","from":"0xf369f78E3A0492CC4e96a90dae0728A38498e9c7"}]
      directlyReceivedPermissions:
+        [{"permission":"interact","from":"0xf369f78E3A0492CC4e96a90dae0728A38498e9c7","description":"transfer KYC NFTs to a different address."},{"permission":"interact","from":"0xf369f78E3A0492CC4e96a90dae0728A38498e9c7","description":"permissioned to call `confirmSanction()`, which makes a temporary sanction by a KYC_PROVIDER permanent and does not grant an exit window to the affected wallet."},{"permission":"interact","from":"0xf369f78E3A0492CC4e96a90dae0728A38498e9c7","description":"manage the KYC status of any user (sanction status and KYC metadata) and mint/burn KintoID NFTs."},{"permission":"interact","from":"0x8a4720488CA32f1223ccFE5A087e250fE3BC5D75","description":"update the central KintoWallet implementation of all users on Kinto L2 and approve specific wallets for recovery via the turnkey recoverer."},{"permission":"upgrade","from":"0xf369f78E3A0492CC4e96a90dae0728A38498e9c7"},{"permission":"interact","from":"0x5A2b641b84b0230C8e75F55d5afd27f4Dbd59d5b","description":"manage addresses that are callable by EOAs and other white-/blacklists that are enforced globally on the Kinto L2."},{"permission":"upgrade","from":"0x5A2b641b84b0230C8e75F55d5afd27f4Dbd59d5b"},{"permission":"upgrade","from":"0x8a4720488CA32f1223ccFE5A087e250fE3BC5D75"}]
    }
```

```diff
    contract KintoID (0xf369f78E3A0492CC4e96a90dae0728A38498e9c7) {
    +++ description: Manages Kinto's KYC system: The KYC_PROVIDER roles responsible for managing the KYC status and KYC metadata of user wallets. Each KintoWallet checks the KYC status of its user in this contract as part of the signature check.
      issuedPermissions.9:
-        {"permission":"upgrade","to":"0xacC000818e5Bbd911D5d449aA81CB5cA24024739","via":[]}
      issuedPermissions.8:
-        {"permission":"interact","to":"0x6E31039abF8d248aBed57E307C9E1b7530c269E4","description":"manage the KYC status of any user (sanction status and KYC metadata) and mint/burn KintoID NFTs.","via":[]}
      issuedPermissions.7:
-        {"permission":"interact","to":"0xacC000818e5Bbd911D5d449aA81CB5cA24024739","description":"manage the KYC status of any user (sanction status and KYC metadata) and mint/burn KintoID NFTs.","via":[]}
      issuedPermissions.6:
-        {"permission":"interact","to":"0x6E09F8A68fB5278e0C33D239dC12B2Cec33F4aC7","description":"manage the KYC status of any user (sanction status and KYC metadata) and mint/burn KintoID NFTs.","via":[]}
      issuedPermissions.5.to:
-        "0xacC000818e5Bbd911D5d449aA81CB5cA24024739"
+        "0x6E31039abF8d248aBed57E307C9E1b7530c269E4"
      issuedPermissions.5.description:
-        "permissioned to call `confirmSanction()`, which makes a temporary sanction by a KYC_PROVIDER permanent and does not grant an exit window to the affected wallet."
+        "manage the KYC status of any user (sanction status and KYC metadata) and mint/burn KintoID NFTs."
      issuedPermissions.4.to:
-        "0x6fe642404B7B23F31251103Ca0efb538Ad4aeC07"
+        "0x6E09F8A68fB5278e0C33D239dC12B2Cec33F4aC7"
      issuedPermissions.3.to:
-        "0x52F09693c9eEaA93A64BA697e3d3e43a1eB65477"
+        "0x6fe642404B7B23F31251103Ca0efb538Ad4aeC07"
      issuedPermissions.2.to:
-        "0xacC000818e5Bbd911D5d449aA81CB5cA24024739"
+        "0x52F09693c9eEaA93A64BA697e3d3e43a1eB65477"
      issuedPermissions.2.description:
-        "transfer KYC NFTs to a different address."
+        "manage the KYC status of any user (sanction status and KYC metadata) and mint/burn KintoID NFTs."
    }
```

Generated with discovered.json: 0x70d1c95896534960241cb7c054aeab528c3a34b7

# Diff at Tue, 22 Apr 2025 13:32:35 GMT:

- chain: kinto
- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@f16e1f98aeb4d48badc7b90f065b978ee3b08e04 block: 838575
- current block number: 838575

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 838575 (main branch discovery), not current.

```diff
    contract AccessManager (0xacC000818e5Bbd911D5d449aA81CB5cA24024739) {
    +++ description: Standard OpenZeppelin AccessManager contract: Serves as a proxy contract defining the roles, permissions and delays to call functions in target contracts.
      values.kintoMultisig2Permission:
-        "0x2e2B1c42E38f5af81771e65D87729E57ABD1337a"
+        ["0x2e2B1c42E38f5af81771e65D87729E57ABD1337a"]
      values.securityCouncilPermission:
-        "0x28fC10E12A78f986c78F973Fc70ED88072b34c8e"
+        ["0x28fC10E12A78f986c78F973Fc70ED88072b34c8e"]
    }
```

Generated with discovered.json: 0x829ba9aab4cf209bfdb454b9f70af271365c954b

# Diff at Wed, 16 Apr 2025 13:12:35 GMT:

- chain: kinto
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@db872d8b788e204aeb64e983eeb7178891d61d76 block: 837019
- current block number: 838575

## Description

`l2b scankintoam`:

================ Compliance Report (Minimum 12d Delay) ================

All checked values meet the minimum 12-day delay requirement.

amazing

waiting for the pick values tool to add asserts and disco alerts for kinto.

## Watched changes

```diff
    contract AccessManager (0xacC000818e5Bbd911D5d449aA81CB5cA24024739) {
    +++ description: Standard OpenZeppelin AccessManager contract: Serves as a proxy contract defining the roles, permissions and delays to call functions in target contracts.
+++ description: CURRENT target admin delay, the access control handler shows the pending delay. Delays all config changes/additions in the AccessManager that affect this target. Must be >= 11d.
+++ severity: HIGH
      values.tadKintoAppRegistry:
-        950400
+        1036800
+++ description: CURRENT target admin delay, the access control handler shows the pending delay. Delays all config changes/additions in the AccessManager that affect this target. Must be >= 11d.
+++ severity: HIGH
      values.tadKintoID:
-        950400
+        1036800
+++ description: CURRENT target admin delay, the access control handler shows the pending delay. Delays all config changes/additions in the AccessManager that affect this target. Must be >= 11d.
+++ severity: HIGH
      values.tadKintoWalletFactory:
-        950400
+        1036800
    }
```

Generated with discovered.json: 0xac939f6101127611115f3f1fbbe449a8fda73cfc

# Diff at Tue, 15 Apr 2025 08:48:10 GMT:

- chain: kinto
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@7b0857850157d265e4d429d336d4517950f5340c block: 837019
- current block number: 837019

## Description

config related: beacon template match.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 837019 (main branch discovery), not current.

```diff
    contract BeaconKintoWallet (0x87f0eE85bF3198654900a422832157abBba30828) {
    +++ description: A beacon with an upgradeable implementation currently set as 0xbFE260680514e0D669fdC5A5f7334b97a5513d9D. Beacon proxy contracts pointing to this beacon will all use its implementation.
      description:
-        "Beacon proxy for the KintoWallet smartwallet implementation that is used for all users."
+        "A beacon with an upgradeable implementation currently set as 0xbFE260680514e0D669fdC5A5f7334b97a5513d9D. Beacon proxy contracts pointing to this beacon will all use its implementation."
      template:
+        "global/UpgradeableBeacon"
      issuedPermissions:
+        [{"permission":"interact","to":"0x8a4720488CA32f1223ccFE5A087e250fE3BC5D75","description":"change the beacon implementation.","via":[]}]
    }
```

```diff
    contract KintoWalletFactory (0x8a4720488CA32f1223ccFE5A087e250fE3BC5D75) {
    +++ description: Deploys new KintoWallet smartwallets for users upon passing KYC checks. Also manages the beacon implementation for all KintoWallets and their recovery logic. KintoWallets can be funded with ETH via this contract.
      receivedPermissions.1:
+        {"permission":"upgrade","from":"0x2e2B1c42E38f5af81771e65D87729E57ABD1337a"}
      receivedPermissions.0.permission:
-        "upgrade"
+        "interact"
      receivedPermissions.0.from:
-        "0x2e2B1c42E38f5af81771e65D87729E57ABD1337a"
+        "0x87f0eE85bF3198654900a422832157abBba30828"
      receivedPermissions.0.description:
+        "change the beacon implementation."
    }
```

Generated with discovered.json: 0x8dbbe54e20d2bea1b92910b5fcceb758cbe3ef7e

# Diff at Mon, 14 Apr 2025 13:35:24 GMT:

- chain: kinto
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@22d5bd9958c2ffcb130d83154e0650da7c63f262 block: 834543
- current block number: 837019

## Description

All AccessManager queued txs are executed. Except for the target delays that will take 1 more day, the L2 governance setup is complete.

```
Found 3 non-compliant value(s):

- Target Admin Delay: KintoWalletFactory (0x8a4720488ca32f1223ccfe5a087e250fe3bc5d75)
    Current: 950400 (11d)
    Required: >= 1036800 (12d)
    Details: Pending change: 12d effective 2025-04-15T15:52:45.000Z

- Target Admin Delay: KintoAppRegistry (0x5a2b641b84b0230c8e75f55d5afd27f4dbd59d5b)
    Current: 950400 (11d)
    Required: >= 1036800 (12d)
    Details: Pending change: 12d effective 2025-04-15T15:52:44.000Z

- Target Admin Delay: KintoID (0xf369f78e3a0492cc4e96a90dae0728a38498e9c7)
    Current: 950400 (11d)
    Required: >= 1036800 (12d)
    Details: Pending change: 12d effective 2025-04-15T15:52:45.000Z
```

## Watched changes

```diff
    contract Kinto Multisig 2 (0x2e2B1c42E38f5af81771e65D87729E57ABD1337a) {
    +++ description: None
      sourceHashes.0:
-        "0x5dd932e70772b9520e522fd66660bc292a8fc07ff9f9bd8da3b7c0f0bf59c89d"
+        "0xc04b35188931b9e8fc65adf08c2b701d5ec4d4776ecac7b19256f900184e935a"
      values.$implementation:
-        "0xE90C1e020D9d2A74045A1365bd5abEe87Aee8D7C"
+        "0xbFE260680514e0D669fdC5A5f7334b97a5513d9D"
      values.$pastUpgrades.33:
+        ["2024-05-31T19:14:54.000Z","0x36c58600e88f27fe63c85880d83f4b59d3dcbdb452fc4d8c493f765f49140f7d",["0x3Ff8593329364dCDC7272fAcb853c8FeC2929B03"]]
      values.$pastUpgrades.32.2:
-        "0x36c58600e88f27fe63c85880d83f4b59d3dcbdb452fc4d8c493f765f49140f7d"
+        "0x033e14c988ea46e1f6aa56bc4ce6e85c124cedeec4e1260f69add97f97a66286"
      values.$pastUpgrades.32.1.0:
-        "0x3Ff8593329364dCDC7272fAcb853c8FeC2929B03"
+        "0xdDB14fAD9060afCA4FC5E1Ec108261B465Df285F"
      values.$pastUpgrades.32.0:
-        "2024-05-31T19:14:54.000Z"
+        "2024-07-04T21:11:59.000Z"
      values.$pastUpgrades.31.2:
-        "0x033e14c988ea46e1f6aa56bc4ce6e85c124cedeec4e1260f69add97f97a66286"
+        "0x9a0a1e68a7096515886517da175cebb6bca1394817e4b82ef7a51a92854de83c"
      values.$pastUpgrades.31.1.0:
-        "0xdDB14fAD9060afCA4FC5E1Ec108261B465Df285F"
+        "0x43Ab055B44327EF3424b51e974960840d721e4D8"
      values.$pastUpgrades.31.0:
-        "2024-07-04T21:11:59.000Z"
+        "2024-05-22T23:17:34.000Z"
      values.$pastUpgrades.30.2:
-        "0x9a0a1e68a7096515886517da175cebb6bca1394817e4b82ef7a51a92854de83c"
+        ["0xaF80B25F650A66F5F8e8bc67697C2160024b6Dcf"]
      values.$pastUpgrades.30.1:
-        ["0x43Ab055B44327EF3424b51e974960840d721e4D8"]
+        "0x4b63dc55ffb56340d415484cb5215c8f35d05db8cab764b350872172ae75500d"
      values.$pastUpgrades.30.0:
-        "2024-05-22T23:17:34.000Z"
+        "2024-06-29T15:27:31.000Z"
      values.$pastUpgrades.29.2.0:
-        "0xaF80B25F650A66F5F8e8bc67697C2160024b6Dcf"
+        "0xd87FB0bF3c38f216bD1604bFa4d262F95409227d"
      values.$pastUpgrades.29.1:
-        "0x4b63dc55ffb56340d415484cb5215c8f35d05db8cab764b350872172ae75500d"
+        "0xb93d5f824b37c9ebd53ba4173510c3ed01c8279fa77897f718287d99f45144d7"
      values.$pastUpgrades.29.0:
-        "2024-06-29T15:27:31.000Z"
+        "2023-12-31T22:08:08.000Z"
      values.$pastUpgrades.28.2:
-        ["0xd87FB0bF3c38f216bD1604bFa4d262F95409227d"]
+        "2024-01-23T21:33:14.000Z"
      values.$pastUpgrades.28.1:
-        "0xb93d5f824b37c9ebd53ba4173510c3ed01c8279fa77897f718287d99f45144d7"
+        ["0xAe84C7E23240Dc11f0B2711C20aEDE81E5a28fF2"]
      values.$pastUpgrades.28.0:
-        "2023-12-31T22:08:08.000Z"
+        "0x414470a46d49f3adbea31b026b31ee0310bf5f14b6a047163b3ae2b2d1daee76"
      values.$pastUpgrades.27.2:
-        "2024-01-23T21:33:14.000Z"
+        ["0x667a0A293B6a95841dB5f0Bbf0F02e8e5F71C8e5"]
      values.$pastUpgrades.27.1:
-        ["0xAe84C7E23240Dc11f0B2711C20aEDE81E5a28fF2"]
+        "2024-08-27T16:05:25.000Z"
      values.$pastUpgrades.27.0:
-        "0x414470a46d49f3adbea31b026b31ee0310bf5f14b6a047163b3ae2b2d1daee76"
+        "0x2b935bf76847687fcd243758c04b4ab09489114b398400062a2f45a57ae64037"
      values.$pastUpgrades.26.2:
-        ["0x667a0A293B6a95841dB5f0Bbf0F02e8e5F71C8e5"]
+        "2024-02-15T06:48:10.000Z"
      values.$pastUpgrades.26.1:
-        "2024-08-27T16:05:25.000Z"
+        ["0x5248F94285c737Cd088c4d25bd68D45AFA258039"]
      values.$pastUpgrades.26.0:
-        "0x2b935bf76847687fcd243758c04b4ab09489114b398400062a2f45a57ae64037"
+        "0xe94e71b9178761f4e77efa1f8ac0db731607ee1efd75b8c68b632024edd26347"
      values.$pastUpgrades.25.2:
-        "2024-02-15T06:48:10.000Z"
+        "2024-05-24T01:55:24.000Z"
      values.$pastUpgrades.25.1.0:
-        "0x5248F94285c737Cd088c4d25bd68D45AFA258039"
+        "0x8E495c2d6Be781Bd668632AA387e3e1027E80240"
      values.$pastUpgrades.25.0:
-        "0xe94e71b9178761f4e77efa1f8ac0db731607ee1efd75b8c68b632024edd26347"
+        "0x76df358b38dd221b64d26546736753affa6a5f743664105039dd66e42c91a8f9"
      values.$pastUpgrades.24.2:
-        "2024-05-24T01:55:24.000Z"
+        ["0xB6026A3eB7ABee0fee3cAAb7BcfcBd6aDE5f0234"]
      values.$pastUpgrades.24.1:
-        ["0x8E495c2d6Be781Bd668632AA387e3e1027E80240"]
+        "0x2fac94819bd2af509b2ee22403fa3dbf56e5e46a95582af8174977988cebf294"
      values.$pastUpgrades.24.0:
-        "0x76df358b38dd221b64d26546736753affa6a5f743664105039dd66e42c91a8f9"
+        "2024-07-04T20:28:23.000Z"
      values.$pastUpgrades.23.2:
-        ["0xB6026A3eB7ABee0fee3cAAb7BcfcBd6aDE5f0234"]
+        "0x6307556dd70bee894ea0145fdc1e4f0044d7bedbd7ac3b25ae4b3b2d2a912ac5"
      values.$pastUpgrades.23.1:
-        "0x2fac94819bd2af509b2ee22403fa3dbf56e5e46a95582af8174977988cebf294"
+        ["0xa54Fe8f99dBB9EB64d7c4E243F3c6aa5De0483Df"]
      values.$pastUpgrades.23.0:
-        "2024-07-04T20:28:23.000Z"
+        "2024-06-15T22:07:48.000Z"
      values.$pastUpgrades.22.2:
-        "0x6307556dd70bee894ea0145fdc1e4f0044d7bedbd7ac3b25ae4b3b2d2a912ac5"
+        "2024-05-22T19:38:03.000Z"
      values.$pastUpgrades.22.1.0:
-        "0xa54Fe8f99dBB9EB64d7c4E243F3c6aa5De0483Df"
+        "0xF75dAc825E27f1A146fbd5e18681892D5cbca9E8"
      values.$pastUpgrades.22.0:
-        "2024-06-15T22:07:48.000Z"
+        "0xb8301be60b27d74a3cd93a176597b83d840390c34f35ed466f9c0b171904bf5d"
      values.$pastUpgrades.21.2:
-        "2024-05-22T19:38:03.000Z"
+        ["0xFF41064cC2cF1A76F4FD4f2235c766FDDFb7DCE1"]
      values.$pastUpgrades.21.1:
-        ["0xF75dAc825E27f1A146fbd5e18681892D5cbca9E8"]
+        "0xf7e3d8d5ddb65c6f03205fdf31223dcf00a488e884edd3f962478b3c56d230bb"
      values.$pastUpgrades.21.0:
-        "0xb8301be60b27d74a3cd93a176597b83d840390c34f35ed466f9c0b171904bf5d"
+        "2024-07-10T01:32:19.000Z"
      values.$pastUpgrades.20.2:
-        ["0xFF41064cC2cF1A76F4FD4f2235c766FDDFb7DCE1"]
+        "2024-09-20T16:00:22.000Z"
      values.$pastUpgrades.20.1:
-        "0xf7e3d8d5ddb65c6f03205fdf31223dcf00a488e884edd3f962478b3c56d230bb"
+        "0xcebb2902d18cd8a441747fb71e60ffd3d7bee0a66e8f763901cda3f81ab06a4d"
      values.$pastUpgrades.20.0:
-        "2024-07-10T01:32:19.000Z"
+        ["0xE90C1e020D9d2A74045A1365bd5abEe87Aee8D7C"]
      values.$pastUpgrades.19.2:
-        "2024-09-20T16:00:22.000Z"
+        "0x1bb7899ea6179a8bda54a07440e97b26a8b1205ca5dda1d61d186a96cc53d91f"
      values.$pastUpgrades.19.1:
-        "0xcebb2902d18cd8a441747fb71e60ffd3d7bee0a66e8f763901cda3f81ab06a4d"
+        ["0xA6ddF426008E8b7f1a70237bdEfafB5D928bA72E"]
      values.$pastUpgrades.19.0:
-        ["0xE90C1e020D9d2A74045A1365bd5abEe87Aee8D7C"]
+        "2024-04-29T23:39:05.000Z"
      values.$pastUpgrades.18.2:
-        "0x1bb7899ea6179a8bda54a07440e97b26a8b1205ca5dda1d61d186a96cc53d91f"
+        "2024-06-12T16:20:50.000Z"
      values.$pastUpgrades.18.1:
-        ["0xA6ddF426008E8b7f1a70237bdEfafB5D928bA72E"]
+        "0xed69774070322c707f1325542e505809f267ff84c27bf1f2b94acd6ef071a9d1"
      values.$pastUpgrades.18.0:
-        "2024-04-29T23:39:05.000Z"
+        ["0x5844A1629fC51439187093eDFd8bBD57109D858D"]
      values.$pastUpgrades.17.2:
-        "2024-06-12T16:20:50.000Z"
+        ["0x3deAbC32b749b95Df9B125822cCb123757c4d4F1"]
      values.$pastUpgrades.17.1:
-        "0xed69774070322c707f1325542e505809f267ff84c27bf1f2b94acd6ef071a9d1"
+        "0x7b8edbfb7a264c7bffbd818550f03bf610667cffb50556cd235733a93c87b5c9"
      values.$pastUpgrades.17.0:
-        ["0x5844A1629fC51439187093eDFd8bBD57109D858D"]
+        "2024-05-25T16:58:58.000Z"
      values.$pastUpgrades.16.2.0:
-        "0x3deAbC32b749b95Df9B125822cCb123757c4d4F1"
+        "0x1161a537aF45f4ca4AD984ECcf4a8E9692Bf2518"
      values.$pastUpgrades.16.1:
-        "0x7b8edbfb7a264c7bffbd818550f03bf610667cffb50556cd235733a93c87b5c9"
+        "2024-09-18T21:46:04.000Z"
      values.$pastUpgrades.16.0:
-        "2024-05-25T16:58:58.000Z"
+        "0x608c39049f980bfbbf9c7b906fe169958b276237fb9dad8ed8dedc600a168415"
      values.$pastUpgrades.15.2:
-        ["0x1161a537aF45f4ca4AD984ECcf4a8E9692Bf2518"]
+        "2024-05-23T00:36:09.000Z"
      values.$pastUpgrades.15.1:
-        "2024-09-18T21:46:04.000Z"
+        ["0x421459c9af07ccCadf6BCA52319835c2Bfb117e2"]
      values.$pastUpgrades.15.0:
-        "0x608c39049f980bfbbf9c7b906fe169958b276237fb9dad8ed8dedc600a168415"
+        "0x4534860f727b67344f7f32f4444e584b5bb32d5d34852903430558d31c8c618b"
      values.$pastUpgrades.14.2:
-        "2024-05-23T00:36:09.000Z"
+        "0x203e75dac211349a98abe410e4f91bb1f26389cf3af230cc29d4cfb4efe618d3"
      values.$pastUpgrades.14.1.0:
-        "0x421459c9af07ccCadf6BCA52319835c2Bfb117e2"
+        "0xbFE260680514e0D669fdC5A5f7334b97a5513d9D"
      values.$pastUpgrades.14.0:
-        "0x4534860f727b67344f7f32f4444e584b5bb32d5d34852903430558d31c8c618b"
+        "2025-04-11T14:53:11.000Z"
      values.$upgradeCount:
-        33
+        34
      values.RECOVERY_TIME:
-        604800
+        1036800
    }
```

```diff
    contract BeaconKintoWallet (0x87f0eE85bF3198654900a422832157abBba30828) {
    +++ description: Beacon proxy for the KintoWallet smartwallet implementation that is used for all users.
      values.implementation:
-        "0xE90C1e020D9d2A74045A1365bd5abEe87Aee8D7C"
+        "0xbFE260680514e0D669fdC5A5f7334b97a5513d9D"
    }
```

```diff
    contract KintoWalletFactory (0x8a4720488CA32f1223ccFE5A087e250fE3BC5D75) {
    +++ description: Deploys new KintoWallet smartwallets for users upon passing KYC checks. Also manages the beacon implementation for all KintoWallets and their recovery logic. KintoWallets can be funded with ETH via this contract.
      values.factoryWalletVersion:
-        34
+        35
    }
```

```diff
    contract KintoID (0xf369f78E3A0492CC4e96a90dae0728A38498e9c7) {
    +++ description: Manages Kinto's KYC system: The KYC_PROVIDER roles responsible for managing the KYC status and KYC metadata of user wallets. Each KintoWallet checks the KYC status of its user in this contract as part of the signature check.
      sourceHashes.0:
-        "0xa0df8ed25313dba8d27c8b016413aa2843d038de01ddb01afe28b1d745427dbb"
+        "0xce66d9a3bd58c2c9f8e48c03ed48f8ad7db1575dfaabe7a982cbd657b9577990"
      values.$implementation:
-        "0x4aC06254558e144C41461a319822993900cE2eE4"
+        "0x1d61772AE2e157f9F6A4127526eD86AB5801a477"
      values.$pastUpgrades.10:
+        ["2024-02-01T19:28:35.000Z","0x84b908e328466db6827fbfde299bd3084b48d27aac618ee825815f6ee590021d",["0xE5eBdFCB597DD84CFeA412278f1c46A0D83aaC39"]]
      values.$pastUpgrades.9.2:
-        "0x84b908e328466db6827fbfde299bd3084b48d27aac618ee825815f6ee590021d"
+        "0x452c7d1c49781ba0501dc0baba338ec790d9d73fbb65e8fab67b9313fe0bf633"
      values.$pastUpgrades.9.1.0:
-        "0xE5eBdFCB597DD84CFeA412278f1c46A0D83aaC39"
+        "0xa3625A24376C2eac96eDcF353C88F3F3a1De030a"
      values.$pastUpgrades.9.0:
-        "2024-02-01T19:28:35.000Z"
+        "2023-12-28T22:46:32.000Z"
      values.$pastUpgrades.8.2:
-        "0x452c7d1c49781ba0501dc0baba338ec790d9d73fbb65e8fab67b9313fe0bf633"
+        "2024-12-10T20:00:17.000Z"
      values.$pastUpgrades.8.1:
-        ["0xa3625A24376C2eac96eDcF353C88F3F3a1De030a"]
+        "0x9fa20142e6e04305e74314e6670ecbf65477f470a9251ec55dc52ddcd34940b1"
      values.$pastUpgrades.8.0:
-        "2023-12-28T22:46:32.000Z"
+        ["0xaa0726829d41E3C70B84Bc5390cce82afC56871A"]
      values.$pastUpgrades.7.2:
-        "2024-12-10T20:00:17.000Z"
+        "2024-01-15T16:36:39.000Z"
      values.$pastUpgrades.7.1:
-        "0x9fa20142e6e04305e74314e6670ecbf65477f470a9251ec55dc52ddcd34940b1"
+        ["0x2AA456d97fB8f75283327458920D4daA2BFe363e"]
      values.$pastUpgrades.7.0:
-        ["0xaa0726829d41E3C70B84Bc5390cce82afC56871A"]
+        "0x6bc0ebf4dca10e8817f37d144980b6908597ed327a05707ceda82f1398692959"
      values.$pastUpgrades.6.2:
-        "2024-01-15T16:36:39.000Z"
+        "2025-02-05T15:37:41.000Z"
      values.$pastUpgrades.6.1:
-        ["0x2AA456d97fB8f75283327458920D4daA2BFe363e"]
+        "0xee19b10811d98a79d18ea4dfd1684702c0e30070a2e3cf428de3799c257b83f8"
      values.$pastUpgrades.6.0:
-        "0x6bc0ebf4dca10e8817f37d144980b6908597ed327a05707ceda82f1398692959"
+        ["0x4aC06254558e144C41461a319822993900cE2eE4"]
      values.$pastUpgrades.5.2:
-        "2025-02-05T15:37:41.000Z"
+        ["0x1d61772AE2e157f9F6A4127526eD86AB5801a477"]
      values.$pastUpgrades.5.1:
-        "0xee19b10811d98a79d18ea4dfd1684702c0e30070a2e3cf428de3799c257b83f8"
+        "2025-04-11T14:53:11.000Z"
      values.$pastUpgrades.5.0:
-        ["0x4aC06254558e144C41461a319822993900cE2eE4"]
+        "0xd8aa458f29ed74a06b3f97a9455c2495bd8d32ea19cdc4764936a6b6e1d2404f"
      values.$upgradeCount:
-        10
+        11
      values.EXIT_WINDOW_PERIOD:
-        864000
+        1036800
    }
```

## Source code changes

```diff
.../kinto/kinto/{.flat@834543 => .flat}/KintoID/KintoID.sol         | 6 +++---
 .../kinto/kinto/{.flat@834543 => .flat}/KintoWallet/KintoWallet.sol | 2 +-
 2 files changed, 4 insertions(+), 4 deletions(-)
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 834543 (main branch discovery), not current.

```diff
    contract KintoSecurityCouncil_L2Alias (0x28fC10E12A78f986c78F973Fc70ED88072b34c8e) {
    +++ description: None
      receivedPermissions.3:
+        {"permission":"interact","from":"0xacC000818e5Bbd911D5d449aA81CB5cA24024739","delay":950400,"description":"manage the whitelisted addresses in the KintoAppRegistry which affects censorship on the entire rollup."}
      receivedPermissions.2.description:
-        "change the configuration of all AccessManager permissions. The total delay can depend on the target of the configuration."
+        "change the configuration of all AccessManager permissions (minimum delay shown, the total delay can be longer for some operations)."
      receivedPermissions.1.delay:
-        950400
      receivedPermissions.1.description:
-        "manage the whitelisted addresses in the KintoAppRegistry which affects censorship on the entire rollup."
+        "confirm sanctions, making them permanent without providing an exit window."
    }
```

```diff
    contract Kinto Multisig 2 (0x2e2B1c42E38f5af81771e65D87729E57ABD1337a) {
    +++ description: None
      receivedPermissions.5.description:
-        "change the configuration of all AccessManager permissions. The total delay can depend on the target of the configuration."
+        "change the configuration of all AccessManager permissions (minimum delay shown, the total delay can be longer for some operations)."
      receivedPermissions.1.from:
-        "0xf369f78E3A0492CC4e96a90dae0728A38498e9c7"
+        "0xacC000818e5Bbd911D5d449aA81CB5cA24024739"
      receivedPermissions.1.description:
-        "manage the KYC status of any user (sanction status and KYC metadata) and mint/burn KintoID NFTs."
+        "approve smart wallet recoveries for any KintoWallet."
      receivedPermissions.0.from:
-        "0xacC000818e5Bbd911D5d449aA81CB5cA24024739"
+        "0xf369f78E3A0492CC4e96a90dae0728A38498e9c7"
      receivedPermissions.0.delay:
-        604800
      receivedPermissions.0.description:
-        "upgrade the implementation of the core contracts KintoID, KintoAppRegistry and KintoWalletFactory."
+        "manage the KYC status of any user (sanction status and KYC metadata) and mint/burn KintoID NFTs."
    }
```

```diff
    contract AccessManager (0xacC000818e5Bbd911D5d449aA81CB5cA24024739) {
    +++ description: Standard OpenZeppelin AccessManager contract: Serves as a proxy contract defining the roles, permissions and delays to call functions in target contracts.
      issuedPermissions.5:
+        {"permission":"interact","to":"0x2e2B1c42E38f5af81771e65D87729E57ABD1337a","delay":1036800,"description":"change the configuration of all AccessManager permissions (minimum delay shown, the total delay can be longer for some operations).","via":[]}
      issuedPermissions.4.delay:
-        1036800
      issuedPermissions.4.description:
-        "change the configuration of all AccessManager permissions. The total delay can depend on the target of the configuration."
+        "approve smart wallet recoveries for any KintoWallet."
      issuedPermissions.3.delay:
-        604800
+        950400
      issuedPermissions.3.description:
-        "change the configuration of all AccessManager permissions. The total delay can depend on the target of the configuration."
+        "manage the whitelisted addresses in the KintoAppRegistry which affects censorship on the entire rollup."
      issuedPermissions.2.delay:
-        950400
+        604800
      issuedPermissions.2.description:
-        "manage the whitelisted addresses in the KintoAppRegistry which affects censorship on the entire rollup."
+        "change the configuration of all AccessManager permissions (minimum delay shown, the total delay can be longer for some operations)."
      issuedPermissions.1.to:
-        "0x2e2B1c42E38f5af81771e65D87729E57ABD1337a"
+        "0x28fC10E12A78f986c78F973Fc70ED88072b34c8e"
      issuedPermissions.1.delay:
-        604800
      issuedPermissions.1.description:
-        "upgrade the implementation of the core contracts KintoID, KintoAppRegistry and KintoWalletFactory."
+        "confirm sanctions, making them permanent without providing an exit window."
      values.edKintoMultisig2UPGRADER:
-        604800
+++ description: Current execution delay for target calls.
      values.edKintoMultisig2RECOVERY_APPROVER:
+        0
+++ description: Current execution delay for target calls.
      values.edScSANCTIONER:
+        0
      fieldMeta.edKintoMultisig2UPGRADER:
-        {"severity":"HIGH","description":"Current execution delay for target calls."}
      fieldMeta.edKintoMultisig2RECOVERY_APPROVER:
+        {"description":"Current execution delay for target calls."}
      fieldMeta.edScSANCTIONER:
+        {"description":"Current execution delay for target calls."}
    }
```

Generated with discovered.json: 0x5fe82d16fce68be5ddcf6ae92467e69733f2e713

# Diff at Fri, 11 Apr 2025 06:44:50 GMT:

- chain: kinto
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@a946e9842245b891a11dfd66e5a103281bde27da block: 788507
- current block number: 834543

## Description

delays increased:

================ Compliance Report (Minimum 12d Delay) ================

Found 5 non-compliant value(s):

- Non-AM Delay: KintoID.EXIT_WINDOW_PERIOD
    Current: 864000 (10d)
    Required: >= 1036800 (12d)

- Non-AM Delay: KintoWallet.RECOVERY_TIME (from Kinto Multisig 2 (Wallet) (0x2e2b1c42e38f5af81771e65d87729e57abd1337a))
    Current: 604800 (7d)
    Required: >= 1036800 (12d)

- Target Admin Delay: KintoWalletFactory (0x8a4720488ca32f1223ccfe5a087e250fe3bc5d75)
    Current: 950400 (11d)
    Required: >= 1036800 (12d)
    Details: Pending change: 12d effective 2025-04-15T15:52:45.000Z

- Target Admin Delay: KintoAppRegistry (0x5a2b641b84b0230c8e75f55d5afd27f4dbd59d5b)
    Current: 950400 (11d)
    Required: >= 1036800 (12d)
    Details: Pending change: 12d effective 2025-04-15T15:52:44.000Z

- Target Admin Delay: KintoID (0xf369f78e3a0492cc4e96a90dae0728a38498e9c7)
    Current: 950400 (11d)
    Required: >= 1036800 (12d)
    Details: Pending change: 12d effective 2025-04-15T15:52:45.000Z

Scan finished.

## Watched changes

```diff
    contract Kinto Multisig 2 (0x2e2B1c42E38f5af81771e65D87729E57ABD1337a) {
    +++ description: None
      receivedPermissions.5.permission:
-        "upgrade"
+        "interact"
      receivedPermissions.5.from:
-        "0x0719D47A213149E2Ef8d3f5afDaDA8a8E22dfc03"
+        "0xacC000818e5Bbd911D5d449aA81CB5cA24024739"
      receivedPermissions.5.delay:
+        1036800
      receivedPermissions.5.description:
+        "change the configuration of all AccessManager permissions. The total delay can depend on the target of the configuration."
      receivedPermissions.4.permission:
-        "interact"
+        "upgrade"
      receivedPermissions.4.from:
-        "0xacC000818e5Bbd911D5d449aA81CB5cA24024739"
+        "0x0719D47A213149E2Ef8d3f5afDaDA8a8E22dfc03"
      receivedPermissions.4.delay:
-        950400
      receivedPermissions.4.description:
-        "change the configuration of all AccessManager permissions. The total delay can depend on the target of the configuration."
    }
```

```diff
    contract AccessManager (0xacC000818e5Bbd911D5d449aA81CB5cA24024739) {
    +++ description: Standard OpenZeppelin AccessManager contract: Serves as a proxy contract defining the roles, permissions and delays to call functions in target contracts.
      issuedPermissions.4.delay:
-        950400
+        1036800
      values.accessControl.roles.ADMIN_ROLE.members.0.since:
-        1742514140
+        1744300560
      values.accessControl.roles.ADMIN_ROLE.members.0.executionDelay:
-        950400
+        1036800
      values.accessControl.roles.RECOVERY_APPROVER_ROLE:
+        {"members":[{"member":"0x2e2B1c42E38f5af81771e65D87729E57ABD1337a","since":1744300898,"executionDelay":0}]}
      values.accessControl.roles.SANCTIONER_ROLE:
+        {"members":[{"member":"0x28fC10E12A78f986c78F973Fc70ED88072b34c8e","since":1744300898,"executionDelay":0}]}
      values.accessControl.targets.0x8a4720488CA32f1223ccFE5A087e250fE3BC5D75.roleFunctions.RECOVERY_APPROVER_ROLE:
+        ["approveWalletRecovery(address)"]
      values.accessControl.targets.0x8a4720488CA32f1223ccFE5A087e250fE3BC5D75.adminDelay:
-        950400
+        1036800
      values.accessControl.targets.0x5A2b641b84b0230C8e75F55d5afd27f4Dbd59d5b.adminDelay:
-        950400
+        1036800
      values.accessControl.targets.0xf369f78E3A0492CC4e96a90dae0728A38498e9c7.roleFunctions.SANCTIONER_ROLE:
+        ["confirmSanction(address)"]
      values.accessControl.targets.0xf369f78E3A0492CC4e96a90dae0728A38498e9c7.adminDelay:
-        950400
+        1036800
      values.AdditionalRoleLabels.RECOVERY_APPROVER_ROLE:
+        ["2827137176883084373"]
      values.AdditionalRoleLabels.SANCTIONER_ROLE:
+        ["565311800027786426"]
+++ description: Current execution delay for target calls.
+++ severity: HIGH
      values.edKintoMultisig2ADMIN:
-        950400
+        1036800
+++ description: List of roles granted to accounts.
      values.RolesGranted.0.3:
+        {"account":"0x2e2B1c42E38f5af81771e65D87729E57ABD1337a","delay":0,"since":1729791296,"newMember":true}
      values.RolesGranted.0.2.delay:
-        0
+        1036800
      values.RolesGranted.0.2.since:
-        1729791296
+        1744300560
      values.RolesGranted.0.2.newMember:
-        true
+        false
+++ description: List of roles granted to accounts.
      values.RolesGranted.2827137176883084373:
+        [{"account":"0x2e2B1c42E38f5af81771e65D87729E57ABD1337a","delay":0,"since":1744300898,"newMember":true}]
+++ description: List of roles granted to accounts.
      values.RolesGranted.565311800027786426:
+        [{"account":"0x28fC10E12A78f986c78F973Fc70ED88072b34c8e","delay":0,"since":1744300898,"newMember":true}]
      values.TargetAdminDelayUpdated.0x8a4720488CA32f1223ccFE5A087e250fE3BC5D75.delay:
-        950400
+        1036800
      values.TargetAdminDelayUpdated.0x8a4720488CA32f1223ccFE5A087e250fE3BC5D75.since:
-        1742859194
+        1744732365
      values.TargetAdminDelayUpdated.0xf369f78E3A0492CC4e96a90dae0728A38498e9c7.delay:
-        950400
+        1036800
      values.TargetAdminDelayUpdated.0xf369f78E3A0492CC4e96a90dae0728A38498e9c7.since:
-        1742859192
+        1744732365
      values.TargetAdminDelayUpdated.0x5A2b641b84b0230C8e75F55d5afd27f4Dbd59d5b.delay:
-        950400
+        1036800
      values.TargetAdminDelayUpdated.0x5A2b641b84b0230C8e75F55d5afd27f4Dbd59d5b.since:
-        1742859193
+        1744732364
      values.TargetFunctionRoleUpdated.0x8a4720488CA32f1223ccFE5A087e250fE3BC5D75.2:
+        {"selector":"0xf4f4b03a","roleId":"8663528507529876195"}
      values.TargetFunctionRoleUpdated.0x8a4720488CA32f1223ccFE5A087e250fE3BC5D75.1.selector:
-        "0xf4f4b03a"
+        "0x3659cfe6"
      values.TargetFunctionRoleUpdated.0x8a4720488CA32f1223ccFE5A087e250fE3BC5D75.0.selector:
-        "0x3659cfe6"
+        "0x456cf492"
      values.TargetFunctionRoleUpdated.0x8a4720488CA32f1223ccFE5A087e250fE3BC5D75.0.roleId:
-        "8663528507529876195"
+        "2827137176883084373"
      values.TargetFunctionRoleUpdated.0xf369f78E3A0492CC4e96a90dae0728A38498e9c7.1:
+        {"selector":"0xfb0b2940","roleId":"565311800027786426"}
    }
```

Generated with discovered.json: 0x362ed92f20fee3d542594f797e9a54f10025b61d

# Diff at Thu, 10 Apr 2025 14:44:06 GMT:

- chain: kinto
- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@f38a3c9bf359344e4c4cd3006f58271cb8f78d15 block: 788507
- current block number: 788507

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 788507 (main branch discovery), not current.

```diff
    contract Kinto Multisig 2 (0x2e2B1c42E38f5af81771e65D87729E57ABD1337a) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","to":"0x8a4720488CA32f1223ccFE5A087e250fE3BC5D75","via":[]}]
    }
```

```diff
    contract KintoAppRegistry (0x5A2b641b84b0230C8e75F55d5afd27f4Dbd59d5b) {
    +++ description: Central system contract defining addresses that are allowed to be called by EOAs. The modified Kinto node reads this configuration and drops all other transactions from EOAs (enforced by a modified state transition function). As a result, users can only transact using a canonical smart wallet.
      issuedPermissions:
+        [{"permission":"interact","to":"0xacC000818e5Bbd911D5d449aA81CB5cA24024739","description":"manage addresses that are callable by EOAs and other white-/blacklists that are enforced globally on the Kinto L2.","via":[]},{"permission":"upgrade","to":"0xacC000818e5Bbd911D5d449aA81CB5cA24024739","via":[]}]
    }
```

```diff
    contract KintoWalletFactory (0x8a4720488CA32f1223ccFE5A087e250fE3BC5D75) {
    +++ description: Deploys new KintoWallet smartwallets for users upon passing KYC checks. Also manages the beacon implementation for all KintoWallets and their recovery logic. KintoWallets can be funded with ETH via this contract.
      directlyReceivedPermissions:
-        [{"permission":"upgrade","from":"0x2e2B1c42E38f5af81771e65D87729E57ABD1337a"}]
      issuedPermissions:
+        [{"permission":"interact","to":"0xacC000818e5Bbd911D5d449aA81CB5cA24024739","description":"update the central KintoWallet implementation of all users on Kinto L2 and approve specific wallets for recovery via the turnkey recoverer.","via":[]},{"permission":"upgrade","to":"0xacC000818e5Bbd911D5d449aA81CB5cA24024739","via":[]}]
      receivedPermissions:
+        [{"permission":"upgrade","from":"0x2e2B1c42E38f5af81771e65D87729E57ABD1337a"}]
    }
```

```diff
    contract AccessManager (0xacC000818e5Bbd911D5d449aA81CB5cA24024739) {
    +++ description: Standard OpenZeppelin AccessManager contract: Serves as a proxy contract defining the roles, permissions and delays to call functions in target contracts.
      directlyReceivedPermissions:
-        [{"permission":"interact","from":"0x5A2b641b84b0230C8e75F55d5afd27f4Dbd59d5b","description":"manage addresses that are callable by EOAs and other white-/blacklists that are enforced globally on the Kinto L2."},{"permission":"interact","from":"0x8a4720488CA32f1223ccFE5A087e250fE3BC5D75","description":"update the central KintoWallet implementation of all users on Kinto L2 and approve specific wallets for recovery via the turnkey recoverer."},{"permission":"interact","from":"0xf369f78E3A0492CC4e96a90dae0728A38498e9c7","description":"manage the KYC status of any user (sanction status and KYC metadata) and mint/burn KintoID NFTs."},{"permission":"interact","from":"0xf369f78E3A0492CC4e96a90dae0728A38498e9c7","description":"permissioned to call `confirmSanction()`, which makes a temporary sanction by a KYC_PROVIDER permanent and does not grant an exit window to the affected wallet."},{"permission":"interact","from":"0xf369f78E3A0492CC4e96a90dae0728A38498e9c7","description":"transfer KYC NFTs to a different address."},{"permission":"upgrade","from":"0x5A2b641b84b0230C8e75F55d5afd27f4Dbd59d5b"},{"permission":"upgrade","from":"0x8a4720488CA32f1223ccFE5A087e250fE3BC5D75"},{"permission":"upgrade","from":"0xf369f78E3A0492CC4e96a90dae0728A38498e9c7"}]
      receivedPermissions:
+        [{"permission":"interact","from":"0x5A2b641b84b0230C8e75F55d5afd27f4Dbd59d5b","description":"manage addresses that are callable by EOAs and other white-/blacklists that are enforced globally on the Kinto L2."},{"permission":"interact","from":"0x8a4720488CA32f1223ccFE5A087e250fE3BC5D75","description":"update the central KintoWallet implementation of all users on Kinto L2 and approve specific wallets for recovery via the turnkey recoverer."},{"permission":"interact","from":"0xf369f78E3A0492CC4e96a90dae0728A38498e9c7","description":"manage the KYC status of any user (sanction status and KYC metadata) and mint/burn KintoID NFTs."},{"permission":"interact","from":"0xf369f78E3A0492CC4e96a90dae0728A38498e9c7","description":"permissioned to call `confirmSanction()`, which makes a temporary sanction by a KYC_PROVIDER permanent and does not grant an exit window to the affected wallet."},{"permission":"interact","from":"0xf369f78E3A0492CC4e96a90dae0728A38498e9c7","description":"transfer KYC NFTs to a different address."},{"permission":"upgrade","from":"0x5A2b641b84b0230C8e75F55d5afd27f4Dbd59d5b"},{"permission":"upgrade","from":"0x8a4720488CA32f1223ccFE5A087e250fE3BC5D75"},{"permission":"upgrade","from":"0xf369f78E3A0492CC4e96a90dae0728A38498e9c7"}]
    }
```

```diff
    contract KintoID (0xf369f78E3A0492CC4e96a90dae0728A38498e9c7) {
    +++ description: Manages Kinto's KYC system: The KYC_PROVIDER roles responsible for managing the KYC status and KYC metadata of user wallets. Each KintoWallet checks the KYC status of its user in this contract as part of the signature check.
      issuedPermissions.9:
+        {"permission":"upgrade","to":"0xacC000818e5Bbd911D5d449aA81CB5cA24024739","via":[]}
      issuedPermissions.8:
+        {"permission":"interact","to":"0x6E31039abF8d248aBed57E307C9E1b7530c269E4","description":"manage the KYC status of any user (sanction status and KYC metadata) and mint/burn KintoID NFTs.","via":[]}
      issuedPermissions.7:
+        {"permission":"interact","to":"0xacC000818e5Bbd911D5d449aA81CB5cA24024739","description":"manage the KYC status of any user (sanction status and KYC metadata) and mint/burn KintoID NFTs.","via":[]}
      issuedPermissions.6:
+        {"permission":"interact","to":"0x6E09F8A68fB5278e0C33D239dC12B2Cec33F4aC7","description":"manage the KYC status of any user (sanction status and KYC metadata) and mint/burn KintoID NFTs.","via":[]}
      issuedPermissions.5.to:
-        "0x6E31039abF8d248aBed57E307C9E1b7530c269E4"
+        "0xacC000818e5Bbd911D5d449aA81CB5cA24024739"
      issuedPermissions.5.description:
-        "manage the KYC status of any user (sanction status and KYC metadata) and mint/burn KintoID NFTs."
+        "permissioned to call `confirmSanction()`, which makes a temporary sanction by a KYC_PROVIDER permanent and does not grant an exit window to the affected wallet."
      issuedPermissions.4.to:
-        "0x6E09F8A68fB5278e0C33D239dC12B2Cec33F4aC7"
+        "0x6fe642404B7B23F31251103Ca0efb538Ad4aeC07"
      issuedPermissions.3.to:
-        "0x6fe642404B7B23F31251103Ca0efb538Ad4aeC07"
+        "0x52F09693c9eEaA93A64BA697e3d3e43a1eB65477"
      issuedPermissions.2.to:
-        "0x52F09693c9eEaA93A64BA697e3d3e43a1eB65477"
+        "0xacC000818e5Bbd911D5d449aA81CB5cA24024739"
      issuedPermissions.2.description:
-        "manage the KYC status of any user (sanction status and KYC metadata) and mint/burn KintoID NFTs."
+        "transfer KYC NFTs to a different address."
    }
```

Generated with discovered.json: 0x349bfe68409185343c32d2813aff54cf2541aa22

# Diff at Mon, 31 Mar 2025 09:21:54 GMT:

- chain: kinto
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@71ffebe835be10b6d5d09ef65aa19b910de8a2ec block: 783310
- current block number: 788507

## Description

Kinto KYC providers sanction 229 addresses (none confirmed by SC so far).

New operations scheduled in the AccessManager:
- SANCTIONER_ROLE added: can confirm sanctions, is scheduled to be granted to the SC with 0 delay
- RECOVERY_APPROVER_ROLE added: can approve recoveries, is scheduled to be granted to the KintoMultisig2 with 0 delay (does not affect recovery time or cancelling a recovery)

## Watched changes

```diff
    contract AccessManager (0xacC000818e5Bbd911D5d449aA81CB5cA24024739) {
    +++ description: Standard OpenZeppelin AccessManager contract: Serves as a proxy contract defining the roles, permissions and delays to call functions in target contracts.
+++ description: List of scheduled operations.
+++ severity: HIGH
      values.OperationScheduled.12:
+        {"operationId":"0x0ad95e032eb7beede43f2741b7bcef6566a6163eaa1ac1ef42441f25193096d8","nonce":1,"schedule":1743464541,"caller":"0x2e2B1c42E38f5af81771e65D87729E57ABD1337a","target":"0xacC000818e5Bbd911D5d449aA81CB5cA24024739","data":"0x25c471a0000000000000000000000000000000000000000000000000783b0946b8c9d2e30000000000000000000000002e2b1c42e38f5af81771e65d87729e57abd1337a00000000000000000000000000000000000000000000000000000000000e8080"}
+++ description: List of scheduled operations.
+++ severity: HIGH
      values.OperationScheduled.11:
+        {"operationId":"0xdc3e209a2fe4bae73e8fa0e602f61b887a4e123a18319283c3535622c64980f9","nonce":1,"schedule":1744220010,"caller":"0x2e2B1c42E38f5af81771e65D87729E57ABD1337a","target":"0xacC000818e5Bbd911D5d449aA81CB5cA24024739","data":"0x25c471a0000000000000000000000000000000000000000000000000273c0248976abc550000000000000000000000002e2b1c42e38f5af81771e65d87729e57abd1337a0000000000000000000000000000000000000000000000000000000000000000"}
+++ description: List of scheduled operations.
+++ severity: HIGH
      values.OperationScheduled.10:
+        {"operationId":"0xdd5ae826ce8969e1e28b47bfb52c2ece6c9b94f3777698c30894e55dbc6fe8a0","nonce":1,"schedule":1744220006,"caller":"0x2e2B1c42E38f5af81771e65D87729E57ABD1337a","target":"0xacC000818e5Bbd911D5d449aA81CB5cA24024739","data":"0x853551b8000000000000000000000000000000000000000000000000273c0248976abc55000000000000000000000000000000000000000000000000000000000000004000000000000000000000000000000000000000000000000000000000000000165245434f564552595f415050524f5645525f524f4c4500000000000000000000"}
+++ description: List of scheduled operations.
+++ severity: HIGH
      values.OperationScheduled.9:
+        {"operationId":"0xc961c36ac064bc0a4f2e0be23c833c3e8d938587ce2f328fb818b8045e1137b1","nonce":1,"schedule":1743905986,"caller":"0x2e2B1c42E38f5af81771e65D87729E57ABD1337a","target":"0xacC000818e5Bbd911D5d449aA81CB5cA24024739","data":"0x25c471a000000000000000000000000000000000000000000000000000000000000000000000000000000000000000002e2b1c42e38f5af81771e65d87729e57abd1337a00000000000000000000000000000000000000000000000000000000000fd200"}
+++ description: List of scheduled operations.
+++ severity: HIGH
      values.OperationScheduled.8:
+        {"operationId":"0x62d4f9252894204088abbb251d9eb3f66b47459f8151390f3152ce5d0d0b189f","nonce":1,"schedule":1744220007,"caller":"0x2e2B1c42E38f5af81771e65D87729E57ABD1337a","target":"0xacC000818e5Bbd911D5d449aA81CB5cA24024739","data":"0x853551b800000000000000000000000000000000000000000000000007d8641643fe2cba0000000000000000000000000000000000000000000000000000000000000040000000000000000000000000000000000000000000000000000000000000000f53414e4354494f4e45525f524f4c450000000000000000000000000000000000"}
+++ description: List of scheduled operations.
+++ severity: HIGH
      values.OperationScheduled.7:
+        {"operationId":"0x1180e76c68ad305ca046e644a97adb50f9b79684c420e10fbd71a5b941badea5","nonce":1,"schedule":1744220008,"caller":"0x2e2B1c42E38f5af81771e65D87729E57ABD1337a","target":"0xacC000818e5Bbd911D5d449aA81CB5cA24024739","data":"0x08d6122d000000000000000000000000f369f78e3a0492cc4e96a90dae0728a38498e9c7000000000000000000000000000000000000000000000000000000000000006000000000000000000000000000000000000000000000000007d8641643fe2cba0000000000000000000000000000000000000000000000000000000000000001fb0b294000000000000000000000000000000000000000000000000000000000"}
      values.OperationScheduled.6.operationId:
-        "0x0ad95e032eb7beede43f2741b7bcef6566a6163eaa1ac1ef42441f25193096d8"
+        "0x2fad4066aacd2052b8b133e635b4d73fbbe42674134fd28b91b0191d4a2cfb0d"
      values.OperationScheduled.6.schedule:
-        1743464541
+        1743905137
      values.OperationScheduled.6.data:
-        "0x25c471a0000000000000000000000000000000000000000000000000783b0946b8c9d2e30000000000000000000000002e2b1c42e38f5af81771e65d87729e57abd1337a00000000000000000000000000000000000000000000000000000000000e8080"
+        "0xd22b59890000000000000000000000008a4720488ca32f1223ccfe5a087e250fe3bc5d7500000000000000000000000000000000000000000000000000000000000fd200"
      values.OperationScheduled.5.operationId:
-        "0xc961c36ac064bc0a4f2e0be23c833c3e8d938587ce2f328fb818b8045e1137b1"
+        "0xa148a26d04bda6140c756b460fb9e37aecd93c69443af9f523d113d8593f8163"
      values.OperationScheduled.5.schedule:
-        1743905986
+        1744220011
      values.OperationScheduled.5.data:
-        "0x25c471a000000000000000000000000000000000000000000000000000000000000000000000000000000000000000002e2b1c42e38f5af81771e65d87729e57abd1337a00000000000000000000000000000000000000000000000000000000000fd200"
+        "0x25c471a000000000000000000000000000000000000000000000000007d8641643fe2cba00000000000000000000000028fc10e12a78f986c78f973fc70ed88072b34c8e0000000000000000000000000000000000000000000000000000000000000000"
      values.OperationScheduled.4.operationId:
-        "0x2fad4066aacd2052b8b133e635b4d73fbbe42674134fd28b91b0191d4a2cfb0d"
+        "0x18198983d32863dcc0dbdc5fbaf362b9e46652dae6c457956e761db4b87b8e4e"
      values.OperationScheduled.4.schedule:
-        1743905137
+        1744220008
      values.OperationScheduled.4.data:
-        "0xd22b59890000000000000000000000008a4720488ca32f1223ccfe5a087e250fe3bc5d7500000000000000000000000000000000000000000000000000000000000fd200"
+        "0x08d6122d0000000000000000000000008a4720488ca32f1223ccfe5a087e250fe3bc5d750000000000000000000000000000000000000000000000000000000000000060000000000000000000000000000000000000000000000000273c0248976abc550000000000000000000000000000000000000000000000000000000000000001456cf49200000000000000000000000000000000000000000000000000000000"
    }
```

```diff
    contract KintoID (0xf369f78E3A0492CC4e96a90dae0728A38498e9c7) {
    +++ description: Manages Kinto's KYC system: The KYC_PROVIDER roles responsible for managing the KYC status and KYC metadata of user wallets. Each KintoWallet checks the KYC status of its user in this contract as part of the signature check.
+++ description: addresses sanctioned by any KYC_PROVIDER role.
      values.pendingSanctions.323:
+        {"_to":"0x19CC0e919b58e0d0eF7BaeBb103f72dee1031978","_timestamp":1706580004}
+++ description: addresses sanctioned by any KYC_PROVIDER role.
      values.pendingSanctions.322:
+        {"_to":"0x467Fa5244cd8386581635646F12E13C05Ad0f41F","_timestamp":1718846703}
+++ description: addresses sanctioned by any KYC_PROVIDER role.
      values.pendingSanctions.321:
+        {"_to":"0x70E21B6fB6835652642568Dd0143C2821e7EBC01","_timestamp":1743368147}
+++ description: addresses sanctioned by any KYC_PROVIDER role.
      values.pendingSanctions.320:
+        {"_to":"0x3CfA8C0e6eEb1e601f76355A82f583232b186a7D","_timestamp":1706580004}
+++ description: addresses sanctioned by any KYC_PROVIDER role.
      values.pendingSanctions.319:
+        {"_to":"0x275edFf82EB0c3845edaBa411D7A5bE31486C2B6","_timestamp":1710367221}
+++ description: addresses sanctioned by any KYC_PROVIDER role.
      values.pendingSanctions.318:
+        {"_to":"0x5718c0f092Da70702A0fC284d5C86C3EeDa218Ae","_timestamp":1743368131}
+++ description: addresses sanctioned by any KYC_PROVIDER role.
      values.pendingSanctions.317:
+        {"_to":"0x83cCA28493b1940a16b6c22B77C7146C40463eD2","_timestamp":1743368167}
+++ description: addresses sanctioned by any KYC_PROVIDER role.
      values.pendingSanctions.316:
+        {"_to":"0xC62595F9ec07A7b8FBE9BdC64926a80f1a7115bD","_timestamp":1743368220}
+++ description: addresses sanctioned by any KYC_PROVIDER role.
      values.pendingSanctions.315:
+        {"_to":"0x685d6B0088397A00790DBDE7B3Ab8fAA7841a809","_timestamp":1743368147}
+++ description: addresses sanctioned by any KYC_PROVIDER role.
      values.pendingSanctions.314:
+        {"_to":"0x5cCF7b5170F0292106A6df1F111958ff62e8Edd3","_timestamp":1743368131}
+++ description: addresses sanctioned by any KYC_PROVIDER role.
      values.pendingSanctions.313:
+        {"_to":"0x81eEd39FC79B50DeBBcaEfc05221e9631Fb3b20f","_timestamp":1743368167}
+++ description: addresses sanctioned by any KYC_PROVIDER role.
      values.pendingSanctions.312:
+        {"_to":"0x9961e674Dc623dc69f6AF4fBF4E2F1FAbcbc44Ce","_timestamp":1743368190}
+++ description: addresses sanctioned by any KYC_PROVIDER role.
      values.pendingSanctions.311:
+        {"_to":"0x8631D1Aa293c92A79C7717d933B785EcCF61b1ae","_timestamp":1743368167}
+++ description: addresses sanctioned by any KYC_PROVIDER role.
      values.pendingSanctions.310:
+        {"_to":"0xBD85550C39dE4844E501A278D6b632FbE68cF70F","_timestamp":1716580853}
+++ description: addresses sanctioned by any KYC_PROVIDER role.
      values.pendingSanctions.309:
+        {"_to":"0x4C2eEe16F3b55D45650c1a97bF329Fe810A517a2","_timestamp":1743368117}
+++ description: addresses sanctioned by any KYC_PROVIDER role.
      values.pendingSanctions.308:
+        {"_to":"0x3Ee9cE9503bAa9a3CD4807Fa0146F848e3120b50","_timestamp":1743368100}
+++ description: addresses sanctioned by any KYC_PROVIDER role.
      values.pendingSanctions.307:
+        {"_to":"0x3bB7Ff827729EB2F3cd419c67Fc3B151f22deDe7","_timestamp":1743368100}
+++ description: addresses sanctioned by any KYC_PROVIDER role.
      values.pendingSanctions.306:
+        {"_to":"0x5Da354DC30613Be81557323729b2bbE3D3D506d7","_timestamp":1743368131}
+++ description: addresses sanctioned by any KYC_PROVIDER role.
      values.pendingSanctions.305:
+        {"_to":"0x5383b0425760763baaa92677464C4E723Cdba191","_timestamp":1743368131}
+++ description: addresses sanctioned by any KYC_PROVIDER role.
      values.pendingSanctions.304:
+        {"_to":"0x79e0F3d1DCEab60D446D9296adA1c5c0D3368d0b","_timestamp":1743368167}
+++ description: addresses sanctioned by any KYC_PROVIDER role.
      values.pendingSanctions.303:
+        {"_to":"0x4E56569186083eacEC60e38b9B76F1d7C6A03694","_timestamp":1743368131}
+++ description: addresses sanctioned by any KYC_PROVIDER role.
      values.pendingSanctions.302:
+        {"_to":"0x90231e5318110108B4748c67c9119CD8Ef28D0f0","_timestamp":1743368190}
+++ description: addresses sanctioned by any KYC_PROVIDER role.
      values.pendingSanctions.301:
+        {"_to":"0x9E339388d44B21E9d027ba95D71E08E75736CE0E","_timestamp":1743368190}
+++ description: addresses sanctioned by any KYC_PROVIDER role.
      values.pendingSanctions.300:
+        {"_to":"0xE9D67E87DD59b29876CF0E1ace667cAE39210fa8","_timestamp":1743368286}
+++ description: addresses sanctioned by any KYC_PROVIDER role.
      values.pendingSanctions.299:
+        {"_to":"0x504a1ef47bF87a550bebfBA6ffe58a3a57bADeB7","_timestamp":1707652818}
+++ description: addresses sanctioned by any KYC_PROVIDER role.
      values.pendingSanctions.298:
+        {"_to":"0x6100c3fE678800EB6809DE473688b433eB081a5F","_timestamp":1743368147}
+++ description: addresses sanctioned by any KYC_PROVIDER role.
      values.pendingSanctions.297:
+        {"_to":"0x9c41f1FB592aFE978726FCa785a8fD2b1c836006","_timestamp":1743368207}
+++ description: addresses sanctioned by any KYC_PROVIDER role.
      values.pendingSanctions.296:
+        {"_to":"0x9E292AFD2492f4ecBA6c1eb8B73BC87A5650eB8F","_timestamp":1718846645}
+++ description: addresses sanctioned by any KYC_PROVIDER role.
      values.pendingSanctions.295:
+        {"_to":"0xB1bEaC3a3472436d9AA1f2D36aEaA2c215b66b9a","_timestamp":1743368207}
+++ description: addresses sanctioned by any KYC_PROVIDER role.
      values.pendingSanctions.294:
+        {"_to":"0x89Ea92eF445cC8EC1055C8d243Ed50A2eF5FD77C","_timestamp":1743368167}
+++ description: addresses sanctioned by any KYC_PROVIDER role.
      values.pendingSanctions.293:
+        {"_to":"0xE01874E2F6C78990F6a55Cb86B49ECCe070aEb0d","_timestamp":1743368286}
+++ description: addresses sanctioned by any KYC_PROVIDER role.
      values.pendingSanctions.292:
+        {"_to":"0xE459e4bE9844131F5b26544cA60D56A034D26A3c","_timestamp":1743368286}
+++ description: addresses sanctioned by any KYC_PROVIDER role.
      values.pendingSanctions.291:
+        {"_to":"0xE65a2Dee17190786c76f83e36F489a085690686C","_timestamp":1707840030}
+++ description: addresses sanctioned by any KYC_PROVIDER role.
      values.pendingSanctions.290:
+        {"_to":"0x4b2E0fDA7DB5Ab4f7471776F3A0e7E0D85444bFF","_timestamp":1743368131}
+++ description: addresses sanctioned by any KYC_PROVIDER role.
      values.pendingSanctions.289:
+        {"_to":"0xf685Ca101dd7598Ec26244d8ff0f5abEa0F23509","_timestamp":1743368491}
+++ description: addresses sanctioned by any KYC_PROVIDER role.
      values.pendingSanctions.288:
+        {"_to":"0xD3Af5EAb05E1882439E8626F9102a0A0bDCa21DB","_timestamp":1743368220}
+++ description: addresses sanctioned by any KYC_PROVIDER role.
      values.pendingSanctions.287:
+        {"_to":"0xbf3fBce48ff8a49918dD8578290814ea466aB79F","_timestamp":1718846587}
+++ description: addresses sanctioned by any KYC_PROVIDER role.
      values.pendingSanctions.286:
+        {"_to":"0x91aDe5800dB3eBE7E103CFc05069487B00AE45ba","_timestamp":1743368190}
+++ description: addresses sanctioned by any KYC_PROVIDER role.
      values.pendingSanctions.285:
+        {"_to":"0xA211445157D68B451006f8452eB7309A2313DC7a","_timestamp":1743368207}
+++ description: addresses sanctioned by any KYC_PROVIDER role.
      values.pendingSanctions.284:
+        {"_to":"0x81bb2B25eA1A01BADA25d41C67A34d81C9684712","_timestamp":1718846645}
+++ description: addresses sanctioned by any KYC_PROVIDER role.
      values.pendingSanctions.283:
+        {"_to":"0xDe2918Cb894ecC8BfD81eeD617DFF2a461700312","_timestamp":1743368286}
+++ description: addresses sanctioned by any KYC_PROVIDER role.
      values.pendingSanctions.282:
+        {"_to":"0x533efF0d6Ee8cd7dEF21ea27BeC421Ef7b8cE796","_timestamp":1743368131}
+++ description: addresses sanctioned by any KYC_PROVIDER role.
      values.pendingSanctions.281:
+        {"_to":"0xF53eEd3bD238d4038e8e2699e832323A03500D0e","_timestamp":1743368286}
+++ description: addresses sanctioned by any KYC_PROVIDER role.
      values.pendingSanctions.280:
+        {"_to":"0x8d2635Da6aB707E0370E2F55Bdd2D0b8dA0596A4","_timestamp":1743368167}
+++ description: addresses sanctioned by any KYC_PROVIDER role.
      values.pendingSanctions.279:
+        {"_to":"0x962C00Ebc894Fb3e9B32AfE1dd1fa31A076e50e5","_timestamp":1743368190}
+++ description: addresses sanctioned by any KYC_PROVIDER role.
      values.pendingSanctions.278:
+        {"_to":"0xcD984AD7eBB2ab7B2aE0afd967F371c6E24a4Bc6","_timestamp":1718846587}
+++ description: addresses sanctioned by any KYC_PROVIDER role.
      values.pendingSanctions.277:
+        {"_to":"0xBa5F9be8C94E2955deD0982Dc276023051bED0AA","_timestamp":1743368207}
+++ description: addresses sanctioned by any KYC_PROVIDER role.
      values.pendingSanctions.276:
+        {"_to":"0x483090b7B8AFBf4F9e650E5a45dbD013959d4867","_timestamp":1743368117}
+++ description: addresses sanctioned by any KYC_PROVIDER role.
      values.pendingSanctions.275:
+        {"_to":"0x99758a8519691B6bffEeD3976080c943634B7364","_timestamp":1718846645}
+++ description: addresses sanctioned by any KYC_PROVIDER role.
      values.pendingSanctions.274:
+        {"_to":"0x4506633D9bBB3EA73c89ff4829695D67896104d4","_timestamp":1743368117}
+++ description: addresses sanctioned by any KYC_PROVIDER role.
      values.pendingSanctions.273:
+        {"_to":"0x1075d13CE70F8F4eB840c4c264b6c84C2CD4E785","_timestamp":1708034428}
+++ description: addresses sanctioned by any KYC_PROVIDER role.
      values.pendingSanctions.272:
+        {"_to":"0xC44F5CA2F187D5ece6864b8a31174C36dEFdC29c","_timestamp":1706139865}
+++ description: addresses sanctioned by any KYC_PROVIDER role.
      values.pendingSanctions.271:
+        {"_to":"0xC10730513A843fa0E2Fc223eC2AE3B6d3d002294","_timestamp":1719715565}
+++ description: addresses sanctioned by any KYC_PROVIDER role.
      values.pendingSanctions.270:
+        {"_to":"0x72F50cBB3D4189179b1cC55435993eB3d0bF772C","_timestamp":1743368147}
+++ description: addresses sanctioned by any KYC_PROVIDER role.
      values.pendingSanctions.269:
+        {"_to":"0x505D435C8B66a7511dbec7f3C8DA6F1e67D50dDA","_timestamp":1706148032}
+++ description: addresses sanctioned by any KYC_PROVIDER role.
      values.pendingSanctions.268:
+        {"_to":"0xaE8C34b3eB7bcc21085eB819d23afF8687B449fE","_timestamp":1743368466}
+++ description: addresses sanctioned by any KYC_PROVIDER role.
      values.pendingSanctions.267:
+        {"_to":"0x01e523cC67e5d3459bE930837d89bccEA85Fd1DC","_timestamp":1719715623}
+++ description: addresses sanctioned by any KYC_PROVIDER role.
      values.pendingSanctions.266:
+        {"_to":"0xaB769943901Bb757cf5048B122f4A2D5D0aEE957","_timestamp":1743368286}
+++ description: addresses sanctioned by any KYC_PROVIDER role.
      values.pendingSanctions.265:
+        {"_to":"0xDABa2f9fdEc6Bada2902B4453239332FE591d9ee","_timestamp":1743368220}
+++ description: addresses sanctioned by any KYC_PROVIDER role.
      values.pendingSanctions.264:
+        {"_to":"0xD91110Bb87AEEFa8D74A274930804F7D61324f0E","_timestamp":1743368220}
+++ description: addresses sanctioned by any KYC_PROVIDER role.
      values.pendingSanctions.263:
+        {"_to":"0xD4a998c38f016cC342b7Abd9796113D596201be3","_timestamp":1743368220}
+++ description: addresses sanctioned by any KYC_PROVIDER role.
      values.pendingSanctions.262:
+        {"_to":"0xE174390679C9Cb86e64131f9AA173FdC9C10b8af","_timestamp":1743368286}
+++ description: addresses sanctioned by any KYC_PROVIDER role.
      values.pendingSanctions.261:
+        {"_to":"0x4d38B797655D0B8F5E61a01A5a71A0346B98A3DD","_timestamp":1743368131}
+++ description: addresses sanctioned by any KYC_PROVIDER role.
      values.pendingSanctions.260:
+        {"_to":"0x5579CA784CdC93776b9c030618548f1317AB4c39","_timestamp":1706148032}
+++ description: addresses sanctioned by any KYC_PROVIDER role.
      values.pendingSanctions.259:
+        {"_to":"0x74a6001A9b9f9AAb26A4eDEe55DB40413569255A","_timestamp":1743368147}
+++ description: addresses sanctioned by any KYC_PROVIDER role.
      values.pendingSanctions.258:
+        {"_to":"0xFff5B9B7bf09DfC42865cDaDAA161f14Fd54498d","_timestamp":1743368286}
+++ description: addresses sanctioned by any KYC_PROVIDER role.
      values.pendingSanctions.257:
+        {"_to":"0xb2F1d7867fD8d1501f5747676823f8d27a6a12f2","_timestamp":1743368466}
+++ description: addresses sanctioned by any KYC_PROVIDER role.
      values.pendingSanctions.256:
+        {"_to":"0x414ded65867BdD1a2DcEcf730fBF4F92a72Ec55a","_timestamp":1743368117}
+++ description: addresses sanctioned by any KYC_PROVIDER role.
      values.pendingSanctions.255:
+        {"_to":"0x917A716dA88cE955f56A2C61313eeB1a1C80eC5b","_timestamp":1743368190}
+++ description: addresses sanctioned by any KYC_PROVIDER role.
      values.pendingSanctions.254:
+        {"_to":"0x49EbC2b33a410955D6291828af3f8EBeD3A1540e","_timestamp":1743368117}
+++ description: addresses sanctioned by any KYC_PROVIDER role.
      values.pendingSanctions.253:
+        {"_to":"0xaEB8b6bB09c44c6eE9524Bf6a7842531e8870217","_timestamp":1743368466}
+++ description: addresses sanctioned by any KYC_PROVIDER role.
      values.pendingSanctions.252:
+        {"_to":"0x72d47E7F0E341129Fd8815e84e396e86AF88484b","_timestamp":1743368147}
+++ description: addresses sanctioned by any KYC_PROVIDER role.
      values.pendingSanctions.251:
+        {"_to":"0xaBA02c3024E1b5A8dfA53f7bD82d6B75B8C7Fea2","_timestamp":1743368466}
+++ description: addresses sanctioned by any KYC_PROVIDER role.
      values.pendingSanctions.250:
+        {"_to":"0x75D9312845d38764229455Ea8d526A122b37768D","_timestamp":1719718623}
+++ description: addresses sanctioned by any KYC_PROVIDER role.
      values.pendingSanctions.249:
+        {"_to":"0x96aA815610caed4095B525042156560Ac5dBC8e9","_timestamp":1743394746}
+++ description: addresses sanctioned by any KYC_PROVIDER role.
      values.pendingSanctions.248:
+        {"_to":"0xe12BcEe0219f3c80FFF8C271D29e343bA42B814d","_timestamp":1707483639}
+++ description: addresses sanctioned by any KYC_PROVIDER role.
      values.pendingSanctions.247:
+        {"_to":"0xC34bd93d87AB32D8fbb966A0666dAa1021A698c2","_timestamp":1743368220}
+++ description: addresses sanctioned by any KYC_PROVIDER role.
      values.pendingSanctions.246:
+        {"_to":"0xe0d359F0f36d5eF22E1ee64135c572a076AaA826","_timestamp":1743368491}
+++ description: addresses sanctioned by any KYC_PROVIDER role.
      values.pendingSanctions.245:
+        {"_to":"0xFD357B4975C97d48DfC8C5D5E3130a5634b89B8D","_timestamp":1743394746}
+++ description: addresses sanctioned by any KYC_PROVIDER role.
      values.pendingSanctions.244:
+        {"_to":"0x933b0f5e531648Bef764b58Ff7782AfB13AB06D0","_timestamp":1718846703}
+++ description: addresses sanctioned by any KYC_PROVIDER role.
      values.pendingSanctions.243:
+        {"_to":"0xA56c58a135fcE29642f7Fb8Cd4Df826Ee4f35528","_timestamp":1743368207}
+++ description: addresses sanctioned by any KYC_PROVIDER role.
      values.pendingSanctions.242:
+        {"_to":"0x2a14E7B96D2362bdf1Df8C0bB4544714e7601Af0","_timestamp":1734246668}
+++ description: addresses sanctioned by any KYC_PROVIDER role.
      values.pendingSanctions.241:
+        {"_to":"0x52f6755e5b4dcf8a51B8E161B1D32038b3460BD9","_timestamp":1743368131}
+++ description: addresses sanctioned by any KYC_PROVIDER role.
      values.pendingSanctions.240:
+        {"_to":"0xFDFEb1b9F613E2CB841E493B5359c124De59499e","_timestamp":1743368286}
+++ description: addresses sanctioned by any KYC_PROVIDER role.
      values.pendingSanctions.239:
+        {"_to":"0x7C92dEf48191e751C61F96d1B9A058546F8fc5bd","_timestamp":1743368167}
+++ description: addresses sanctioned by any KYC_PROVIDER role.
      values.pendingSanctions.238:
+        {"_to":"0x65E24c0623336b5dae5b566Bb996863ffC36e877","_timestamp":1743394986}
+++ description: addresses sanctioned by any KYC_PROVIDER role.
      values.pendingSanctions.237:
+        {"_to":"0x493ff963FAAbbBeDBA2Aa19378bF8d8a0F0e2C5E","_timestamp":1718846587}
+++ description: addresses sanctioned by any KYC_PROVIDER role.
      values.pendingSanctions.236:
+        {"_to":"0x3bFD323C9D44625D0B8A77ac19b13e75b9A0f2E4","_timestamp":1743368100}
+++ description: addresses sanctioned by any KYC_PROVIDER role.
      values.pendingSanctions.235:
+        {"_to":"0xFCF53d74a16e899b576eb86FDBb76006854Ef763","_timestamp":1743368286}
+++ description: addresses sanctioned by any KYC_PROVIDER role.
      values.pendingSanctions.234:
+        {"_to":"0xA4EcEAB6C954C3b967cF18e947879A6708A96D5e","_timestamp":1719715444}
+++ description: addresses sanctioned by any KYC_PROVIDER role.
      values.pendingSanctions.233:
+        {"_to":"0x89F6188006a35b9D0407c37f01FCa27AeD48CA3B","_timestamp":1719718683}
+++ description: addresses sanctioned by any KYC_PROVIDER role.
      values.pendingSanctions.232:
+        {"_to":"0xeeAdb06d44f927b77C0bA23B257A4CfEa60EDfB7","_timestamp":1743368491}
+++ description: addresses sanctioned by any KYC_PROVIDER role.
      values.pendingSanctions.231:
+        {"_to":"0xeF4D08EbDAa2373Df18C12173898Ef09beb1Cd45","_timestamp":1743368491}
+++ description: addresses sanctioned by any KYC_PROVIDER role.
      values.pendingSanctions.230:
+        {"_to":"0xE32AfFACe8f8f0f5A867FDe3d2C5ea1321dB83e8","_timestamp":1743368286}
+++ description: addresses sanctioned by any KYC_PROVIDER role.
      values.pendingSanctions.229:
+        {"_to":"0x2A2ad91467443Ef61c49d5957546554EDb90Fe8a","_timestamp":1743394746}
+++ description: addresses sanctioned by any KYC_PROVIDER role.
      values.pendingSanctions.228:
+        {"_to":"0x985540465088C9c667690cC17BFf732fC703D2E5","_timestamp":1719718623}
+++ description: addresses sanctioned by any KYC_PROVIDER role.
      values.pendingSanctions.227:
+        {"_to":"0xe3f7A57629a00558EBD24100A9D26A66FD4EbAc3","_timestamp":1743368491}
+++ description: addresses sanctioned by any KYC_PROVIDER role.
      values.pendingSanctions.226:
+        {"_to":"0xA3a0A02e0866a95685062d7a1053912d6eda3E8B","_timestamp":1743368207}
+++ description: addresses sanctioned by any KYC_PROVIDER role.
      values.pendingSanctions.225:
+        {"_to":"0xBbaEb862386383C67045cF2e538b6f3BfA1e8f5a","_timestamp":1743368207}
+++ description: addresses sanctioned by any KYC_PROVIDER role.
      values.pendingSanctions.224:
+        {"_to":"0x1f16335Fd1dD3e8DCC8b401f5ae8BA57F8AD76a8","_timestamp":1706580004}
+++ description: addresses sanctioned by any KYC_PROVIDER role.
      values.pendingSanctions.223:
+        {"_to":"0x2955ca0D791C30C16e7298B803BB116bED5d7269","_timestamp":1706580004}
+++ description: addresses sanctioned by any KYC_PROVIDER role.
      values.pendingSanctions.222:
+        {"_to":"0x92c248622427367b4cfa70e60C038c63B148C748","_timestamp":1743368190}
+++ description: addresses sanctioned by any KYC_PROVIDER role.
      values.pendingSanctions.221:
+        {"_to":"0x6E6E2044A4cfeA057E02d6FB72c33Fc893A9B788","_timestamp":1718846703}
+++ description: addresses sanctioned by any KYC_PROVIDER role.
      values.pendingSanctions.220:
+        {"_to":"0xf30BF377b3C4ed1f111E6E28CF26003CE5a682Cf","_timestamp":1706580004}
+++ description: addresses sanctioned by any KYC_PROVIDER role.
      values.pendingSanctions.219:
+        {"_to":"0xdCfA8062948095423c6117a327949198519741b0","_timestamp":1743368491}
+++ description: addresses sanctioned by any KYC_PROVIDER role.
      values.pendingSanctions.218:
+        {"_to":"0xd138D5DBA662DE76F6Ce4EB60CA486313Ab7d15C","_timestamp":1743368491}
+++ description: addresses sanctioned by any KYC_PROVIDER role.
      values.pendingSanctions.217:
+        {"_to":"0x326d76c60952e8a6A1c0af55D0F592E8c4E9597a","_timestamp":1743368100}
+++ description: addresses sanctioned by any KYC_PROVIDER role.
      values.pendingSanctions.216:
+        {"_to":"0xD09E358552fC7Ce6F7E7BDDCE40e52fF1fE0745c","_timestamp":1743368220}
+++ description: addresses sanctioned by any KYC_PROVIDER role.
      values.pendingSanctions.215:
+        {"_to":"0x60C460346394178b79CC9254D397B44a074e1dbD","_timestamp":1743368147}
+++ description: addresses sanctioned by any KYC_PROVIDER role.
      values.pendingSanctions.214:
+        {"_to":"0x7CB6AfA77bb4E67b4c24293D3B5C5052851b5EB0","_timestamp":1743368167}
+++ description: addresses sanctioned by any KYC_PROVIDER role.
      values.pendingSanctions.213:
+        {"_to":"0x8e31D4A303eDEeE7ca509CCC8D5965f50D6B25D8","_timestamp":1743368167}
+++ description: addresses sanctioned by any KYC_PROVIDER role.
      values.pendingSanctions.212:
+        {"_to":"0x8006D189F5311E28E7A43E843c9AF675CEBef4AF","_timestamp":1743368167}
+++ description: addresses sanctioned by any KYC_PROVIDER role.
      values.pendingSanctions.211:
+        {"_to":"0x894341e79e60b06C5D64684200BAb31C3c77AeF7","_timestamp":1743368167}
+++ description: addresses sanctioned by any KYC_PROVIDER role.
      values.pendingSanctions.210:
+        {"_to":"0x9a46f537e8eA30BCCeDB0B7A2EBE03b16Df1170C","_timestamp":1743368190}
+++ description: addresses sanctioned by any KYC_PROVIDER role.
      values.pendingSanctions.209:
+        {"_to":"0x3C9A0d73EF1a155e0b94CCc498068C1DB85fbEb5","_timestamp":1743368100}
+++ description: addresses sanctioned by any KYC_PROVIDER role.
      values.pendingSanctions.208:
+        {"_to":"0xE9Cb04a602cAA9D2C649dDE854Ab7389C98CF912","_timestamp":1706139865}
+++ description: addresses sanctioned by any KYC_PROVIDER role.
      values.pendingSanctions.207:
+        {"_to":"0x459A9b243DE7aab18c60E25Ab0D6c99A445faC12","_timestamp":1743368117}
+++ description: addresses sanctioned by any KYC_PROVIDER role.
      values.pendingSanctions.206:
+        {"_to":"0x3dec956335f3E48DC1Fb99DC9A2d21350a30e245","_timestamp":1743368117}
+++ description: addresses sanctioned by any KYC_PROVIDER role.
      values.pendingSanctions.205:
+        {"_to":"0xaa7Fc1a0c9fcb6721a082740d7E4BC0885951d7a","_timestamp":1743368466}
+++ description: addresses sanctioned by any KYC_PROVIDER role.
      values.pendingSanctions.204:
+        {"_to":"0x2B5CA5A2ABd55846C02439Dd268Ae733F104C866","_timestamp":1743368100}
+++ description: addresses sanctioned by any KYC_PROVIDER role.
      values.pendingSanctions.203:
+        {"_to":"0x73fcfBefa7e9650049c7BcA3c76F99D085Eaf462","_timestamp":1743368147}
+++ description: addresses sanctioned by any KYC_PROVIDER role.
      values.pendingSanctions.202:
+        {"_to":"0x45Ace2D41040B7267a465A4dF8733F3327EEFBb5","_timestamp":1719715444}
+++ description: addresses sanctioned by any KYC_PROVIDER role.
      values.pendingSanctions.201:
+        {"_to":"0xCf4b2B67e584F71f0a888817Eab97061e0CcC139","_timestamp":1743368220}
+++ description: addresses sanctioned by any KYC_PROVIDER role.
      values.pendingSanctions.200:
+        {"_to":"0x579e88fF20811E8B7327A1b81d324E2302337E3B","_timestamp":1743368131}
+++ description: addresses sanctioned by any KYC_PROVIDER role.
      values.pendingSanctions.199:
+        {"_to":"0x76De7fC28E69bb78e6475C8Fd71B71793B663E31","_timestamp":1707346822}
+++ description: addresses sanctioned by any KYC_PROVIDER role.
      values.pendingSanctions.198:
+        {"_to":"0x4C403211d9BcAC321b683e0161CED2cE749FF0A4","_timestamp":1743368131}
+++ description: addresses sanctioned by any KYC_PROVIDER role.
      values.pendingSanctions.197:
+        {"_to":"0x7B31BC4FD8A00f734690AD0607903AA2C770a802","_timestamp":1718846645}
+++ description: addresses sanctioned by any KYC_PROVIDER role.
      values.pendingSanctions.196:
+        {"_to":"0x4E5c14bc3E148C01d02f9086c889f6a7854eEa42","_timestamp":1743394746}
+++ description: addresses sanctioned by any KYC_PROVIDER role.
      values.pendingSanctions.195:
+        {"_to":"0x2bD3B86856EEeC97CbC01150833aCc0771491049","_timestamp":1743368100}
+++ description: addresses sanctioned by any KYC_PROVIDER role.
      values.pendingSanctions.194:
+        {"_to":"0x463d21B0620C77620aeD87A769e5836132158855","_timestamp":1707627639}
+++ description: addresses sanctioned by any KYC_PROVIDER role.
      values.pendingSanctions.193:
+        {"_to":"0x4fc472c29A8cBED38ce871a4Caf6CbDd1Cfd3369","_timestamp":1743368131}
+++ description: addresses sanctioned by any KYC_PROVIDER role.
      values.pendingSanctions.192:
+        {"_to":"0xA911DDC91FDBDBBe22dD219CA05DC8634e9255d2","_timestamp":1743368207}
+++ description: addresses sanctioned by any KYC_PROVIDER role.
      values.pendingSanctions.191:
+        {"_to":"0xB84a63047b0E7b6e1C670479C5ae682e6386d423","_timestamp":1743394986}
+++ description: addresses sanctioned by any KYC_PROVIDER role.
      values.pendingSanctions.190:
+        {"_to":"0xD0aC63a724dCb105561F981c3D9dda033570193e","_timestamp":1718846587}
+++ description: addresses sanctioned by any KYC_PROVIDER role.
      values.pendingSanctions.189:
+        {"_to":"0x81c0d080426CbEa108c1e74C712a6A2ceDAB89e1","_timestamp":1743368167}
+++ description: addresses sanctioned by any KYC_PROVIDER role.
      values.pendingSanctions.188:
+        {"_to":"0xfb02369649FABe532c600983C41840d54F4592a7","_timestamp":1743368523}
+++ description: addresses sanctioned by any KYC_PROVIDER role.
      values.pendingSanctions.187:
+        {"_to":"0x660dD692777AF51FBFE15C5B47178994d825911a","_timestamp":1743368147}
+++ description: addresses sanctioned by any KYC_PROVIDER role.
      values.pendingSanctions.186:
+        {"_to":"0xb4696a1465286802b7Bc8E39120B10F951E07C4d","_timestamp":1743368466}
+++ description: addresses sanctioned by any KYC_PROVIDER role.
      values.pendingSanctions.185:
+        {"_to":"0xfB474dDfDc91293aD2a37A58DC94D6505d2c88dF","_timestamp":1738203485}
+++ description: addresses sanctioned by any KYC_PROVIDER role.
      values.pendingSanctions.184:
+        {"_to":"0xd382432B50d12b5803A7D666662320ceEe22313f","_timestamp":1743368491}
+++ description: addresses sanctioned by any KYC_PROVIDER role.
      values.pendingSanctions.183:
+        {"_to":"0x298805bE3bbe036224BB11cE5007636423ca46F6","_timestamp":1743368100}
+++ description: addresses sanctioned by any KYC_PROVIDER role.
      values.pendingSanctions.182:
+        {"_to":"0xdFc1f20b21259ee313d20D33D46D54691E4371CB","_timestamp":1743368491}
+++ description: addresses sanctioned by any KYC_PROVIDER role.
      values.pendingSanctions.181:
+        {"_to":"0xC2068323986708a8b2480Bf491B4ad5921234EF7","_timestamp":1743368220}
+++ description: addresses sanctioned by any KYC_PROVIDER role.
      values.pendingSanctions.180:
+        {"_to":"0xf2670E8C64430F10163e53BD38e71741d18D7840","_timestamp":1743368491}
+++ description: addresses sanctioned by any KYC_PROVIDER role.
      values.pendingSanctions.179:
+        {"_to":"0xb064e41602F2EA83741161A27DC045A6dD7F6b93","_timestamp":1743368466}
+++ description: addresses sanctioned by any KYC_PROVIDER role.
      values.pendingSanctions.178:
+        {"_to":"0xdE2c001797a4a6e8784743FB1835F82efb95b18f","_timestamp":1743368491}
+++ description: addresses sanctioned by any KYC_PROVIDER role.
      values.pendingSanctions.177:
+        {"_to":"0x80c5A724E484B2b96c61c45e06918D7B68dB256B","_timestamp":1743368167}
+++ description: addresses sanctioned by any KYC_PROVIDER role.
      values.pendingSanctions.176:
+        {"_to":"0x8Cf85f74408Cb7e27cF0f52493c93fF6E150BAFa","_timestamp":1743368167}
+++ description: addresses sanctioned by any KYC_PROVIDER role.
      values.pendingSanctions.175:
+        {"_to":"0x927491618ECd06afBCEDeA84a2fEF71c991f00Eb","_timestamp":1707354023}
+++ description: addresses sanctioned by any KYC_PROVIDER role.
      values.pendingSanctions.174:
+        {"_to":"0x8862Dd4657aBCdf04c96402cD4C3007511538500","_timestamp":1719718683}
+++ description: addresses sanctioned by any KYC_PROVIDER role.
      values.pendingSanctions.173:
+        {"_to":"0x28c6fFE7b230F54510247FE09e5CbaaAB314ee82","_timestamp":1743368100}
+++ description: addresses sanctioned by any KYC_PROVIDER role.
      values.pendingSanctions.172:
+        {"_to":"0x2ed2A34623aF70467ef88E473a693F879176B5a2","_timestamp":1743368100}
+++ description: addresses sanctioned by any KYC_PROVIDER role.
      values.pendingSanctions.171:
+        {"_to":"0x6402119871Cc942Edc26e4815B99711750B87DBB","_timestamp":1719718623}
+++ description: addresses sanctioned by any KYC_PROVIDER role.
      values.pendingSanctions.170:
+        {"_to":"0x437415907a0FdB07aeDCaBC085Cf940D370cfA6c","_timestamp":1743368117}
+++ description: addresses sanctioned by any KYC_PROVIDER role.
      values.pendingSanctions.169:
+        {"_to":"0x773d712C230654121bE68D09C4ccaA9011d20895","_timestamp":1743368167}
+++ description: addresses sanctioned by any KYC_PROVIDER role.
      values.pendingSanctions.168:
+        {"_to":"0x4813eD84135cB27eC096d8b86eE35B8d62402c07","_timestamp":1743368117}
+++ description: addresses sanctioned by any KYC_PROVIDER role.
      values.pendingSanctions.167:
+        {"_to":"0xc3106dd6f982d4269a6618E77f49927d44BCCafD","_timestamp":1706580004}
+++ description: addresses sanctioned by any KYC_PROVIDER role.
      values.pendingSanctions.166:
+        {"_to":"0x3EA0B857a9579259096F067b6Dd914D1ae75C338","_timestamp":1743368100}
+++ description: addresses sanctioned by any KYC_PROVIDER role.
      values.pendingSanctions.165:
+        {"_to":"0xA74B09B9f886ac101FDB1091147f4a67FE7c19e7","_timestamp":1743368207}
+++ description: addresses sanctioned by any KYC_PROVIDER role.
      values.pendingSanctions.164:
+        {"_to":"0x96D4FD6006d1BBAF629feeAec1ddDB9D13bd5778","_timestamp":1743368190}
+++ description: addresses sanctioned by any KYC_PROVIDER role.
      values.pendingSanctions.163:
+        {"_to":"0x4DF0384CA53D96bbED7452f10b9dDC325AF037c0","_timestamp":1743368131}
+++ description: addresses sanctioned by any KYC_PROVIDER role.
      values.pendingSanctions.162:
+        {"_to":"0x6e77aE496c67441Ee772f88471b27Bf62Ef04d07","_timestamp":1743368147}
+++ description: addresses sanctioned by any KYC_PROVIDER role.
      values.pendingSanctions.161:
+        {"_to":"0xC6235424501FF4dCEf8fC7C96DFD9474b40E95E6","_timestamp":1743368220}
+++ description: addresses sanctioned by any KYC_PROVIDER role.
      values.pendingSanctions.160:
+        {"_to":"0xf152EBa9da07Bec19fbd6078D9dB047E74687A6a","_timestamp":1743368491}
+++ description: addresses sanctioned by any KYC_PROVIDER role.
      values.pendingSanctions.159:
+        {"_to":"0x9b70559E61949033dE5a90F58fD4ed051470B851","_timestamp":1743368190}
+++ description: addresses sanctioned by any KYC_PROVIDER role.
      values.pendingSanctions.158:
+        {"_to":"0x59ED194974A49f7D817EC46bCE8E00A6F24133E1","_timestamp":1743368131}
+++ description: addresses sanctioned by any KYC_PROVIDER role.
      values.pendingSanctions.157:
+        {"_to":"0x015374c2Dc040eE1c40739936C72D5F035186f0f","_timestamp":1706662831}
+++ description: addresses sanctioned by any KYC_PROVIDER role.
      values.pendingSanctions.156:
+        {"_to":"0xbd0e49D0dA6F10e8A74964e8282B86900396f7A3","_timestamp":1743368466}
+++ description: addresses sanctioned by any KYC_PROVIDER role.
      values.pendingSanctions.155:
+        {"_to":"0xB92293Fd1D65c09361f863bF4d202cff763CE9e4","_timestamp":1743368207}
+++ description: addresses sanctioned by any KYC_PROVIDER role.
      values.pendingSanctions.154:
+        {"_to":"0x585E38F443aFEA52D5DB05A273d0145Bd17887be","_timestamp":1743368131}
+++ description: addresses sanctioned by any KYC_PROVIDER role.
      values.pendingSanctions.153:
+        {"_to":"0x95263Dab911Dd8B05ED1713f2549E9C8cf574323","_timestamp":1743368190}
+++ description: addresses sanctioned by any KYC_PROVIDER role.
      values.pendingSanctions.152:
+        {"_to":"0x8cc7888b6C9B9EF917CdE097210a7eB12ca8441e","_timestamp":1743368167}
+++ description: addresses sanctioned by any KYC_PROVIDER role.
      values.pendingSanctions.151:
+        {"_to":"0x10888fc193ec8a5b9ce29a0213473B2ceFA1E707","_timestamp":1719715565}
+++ description: addresses sanctioned by any KYC_PROVIDER role.
      values.pendingSanctions.150:
+        {"_to":"0x9868A6E272365Ec421C3aF0690F5aa97121B91c4","_timestamp":1743368190}
+++ description: addresses sanctioned by any KYC_PROVIDER role.
      values.pendingSanctions.149:
+        {"_to":"0x61C81bBa4D9b4cc3BB109Fcf1482cb5Ce4b87205","_timestamp":1743368147}
+++ description: addresses sanctioned by any KYC_PROVIDER role.
      values.pendingSanctions.148:
+        {"_to":"0x9E33F1333587Ee7f96772523821187de185d2ead","_timestamp":1719715565}
+++ description: addresses sanctioned by any KYC_PROVIDER role.
      values.pendingSanctions.147:
+        {"_to":"0x23C1c317368AB6Dc5F92a496e08A79ceE6f90392","_timestamp":1719718683}
+++ description: addresses sanctioned by any KYC_PROVIDER role.
      values.pendingSanctions.146:
+        {"_to":"0xfd1dCf92A221f333061575FD8B7D02b6E3A5957D","_timestamp":1710867621}
+++ description: addresses sanctioned by any KYC_PROVIDER role.
      values.pendingSanctions.145:
+        {"_to":"0x3b2E6A063125c95f327aE214eD1F20B901801059","_timestamp":1719715506}
+++ description: addresses sanctioned by any KYC_PROVIDER role.
      values.pendingSanctions.144:
+        {"_to":"0xAb96909d9a35150a249a55670e0bB8B8C583565b","_timestamp":1743368207}
+++ description: addresses sanctioned by any KYC_PROVIDER role.
      values.pendingSanctions.143:
+        {"_to":"0x9381d90765A0cE4BE62e4cE9f115291C6244862E","_timestamp":1743368190}
+++ description: addresses sanctioned by any KYC_PROVIDER role.
      values.pendingSanctions.142:
+        {"_to":"0xbDbb9De0ee5c3CC100bf0DcF0e11881Ea568307D","_timestamp":1743368466}
+++ description: addresses sanctioned by any KYC_PROVIDER role.
      values.pendingSanctions.141:
+        {"_to":"0x41b6cBA6EDf1bD2BC61b80B228104bb27db3e504","_timestamp":1743368117}
+++ description: addresses sanctioned by any KYC_PROVIDER role.
      values.pendingSanctions.140:
+        {"_to":"0xB907Fd315C94FE2D2484B426f293D9980Da40A3d","_timestamp":1743368207}
+++ description: addresses sanctioned by any KYC_PROVIDER role.
      values.pendingSanctions.139:
+        {"_to":"0xF936497C1E9215fdf91E0332c6D6D50b528Df14d","_timestamp":1743368286}
+++ description: addresses sanctioned by any KYC_PROVIDER role.
      values.pendingSanctions.138:
+        {"_to":"0xc77D572231C4b8bfe3c4DB4aF478ad17FEBA0648","_timestamp":1743368466}
+++ description: addresses sanctioned by any KYC_PROVIDER role.
      values.pendingSanctions.137:
+        {"_to":"0x69E657BD35BA291D6A299F47d10249F24C86edD8","_timestamp":1743394623}
+++ description: addresses sanctioned by any KYC_PROVIDER role.
      values.pendingSanctions.136:
+        {"_to":"0xE6f4103fCbdae587756C8273a440DFf8BA4Bb21a","_timestamp":1743368286}
+++ description: addresses sanctioned by any KYC_PROVIDER role.
      values.pendingSanctions.135:
+        {"_to":"0xAE932423eb4c00139dF70b2644CfF269b110E130","_timestamp":1743368207}
+++ description: addresses sanctioned by any KYC_PROVIDER role.
      values.pendingSanctions.134:
+        {"_to":"0x3C43b337a56c5c9387614ebfAC01d3b5d0734Fcc","_timestamp":1743368100}
+++ description: addresses sanctioned by any KYC_PROVIDER role.
      values.pendingSanctions.133:
+        {"_to":"0x9991bCFde3f20Cc14A893CcC3a32b81801C80253","_timestamp":1743368190}
+++ description: addresses sanctioned by any KYC_PROVIDER role.
      values.pendingSanctions.132:
+        {"_to":"0x7Faf6f69caD10Eaf3903847434bF92b4Bb6fC955","_timestamp":1719718623}
+++ description: addresses sanctioned by any KYC_PROVIDER role.
      values.pendingSanctions.131:
+        {"_to":"0xC6138fB05b8c0536EB2Ea791D2504eA72420d7d7","_timestamp":1743394623}
+++ description: addresses sanctioned by any KYC_PROVIDER role.
      values.pendingSanctions.130:
+        {"_to":"0x5F0d5D4DA8692787F5267415DCc2494526E1C507","_timestamp":1743368131}
+++ description: addresses sanctioned by any KYC_PROVIDER role.
      values.pendingSanctions.129:
+        {"_to":"0x127917d1A8308Da2a1400dB50346B4a3F17813d3","_timestamp":1743394565}
+++ description: addresses sanctioned by any KYC_PROVIDER role.
      values.pendingSanctions.128:
+        {"_to":"0xB7522F061afb810b411a858769e2295A10080a32","_timestamp":1743368207}
+++ description: addresses sanctioned by any KYC_PROVIDER role.
      values.pendingSanctions.127:
+        {"_to":"0xA98522A6a33c97af048aB966460e3C57Cd44eB17","_timestamp":1743368207}
+++ description: addresses sanctioned by any KYC_PROVIDER role.
      values.pendingSanctions.126:
+        {"_to":"0x2548e483ceeFBe4de727f2F853AF0124869Ae75E","_timestamp":1707566427}
+++ description: addresses sanctioned by any KYC_PROVIDER role.
      values.pendingSanctions.125:
+        {"_to":"0xc2811Dfd12FF70b229d26E465359664f9e60b9D2","_timestamp":1706148032}
+++ description: addresses sanctioned by any KYC_PROVIDER role.
      values.pendingSanctions.124:
+        {"_to":"0xD823abbe3EdAB9A7175EBbE13b2891A3356F06ab","_timestamp":1743368220}
+++ description: addresses sanctioned by any KYC_PROVIDER role.
      values.pendingSanctions.123:
+        {"_to":"0x07B69c2e2dE1e41EA60F6E5e382012774A61A80a","_timestamp":1743367391}
+++ description: addresses sanctioned by any KYC_PROVIDER role.
      values.pendingSanctions.122:
+        {"_to":"0xC7370caAfFE87e1089b1E86f3D6dc6283effdb3E","_timestamp":1743368220}
+++ description: addresses sanctioned by any KYC_PROVIDER role.
      values.pendingSanctions.121:
+        {"_to":"0xcd82cdd2023BCc783bef35fDb86a70baA368c2c3","_timestamp":1743368466}
+++ description: addresses sanctioned by any KYC_PROVIDER role.
      values.pendingSanctions.120:
+        {"_to":"0x9baE98859a9D5Ba64AD43E0C22F99d8BAd7FB554","_timestamp":1710363512}
+++ description: addresses sanctioned by any KYC_PROVIDER role.
      values.pendingSanctions.119:
+        {"_to":"0x0828b8Fe631347dA81a46E3D23394C3b18395aD4","_timestamp":1707498031}
+++ description: addresses sanctioned by any KYC_PROVIDER role.
      values.pendingSanctions.118:
+        {"_to":"0x30096fdCc337A5395d275ecba9d0558484baad31","_timestamp":1743368100}
+++ description: addresses sanctioned by any KYC_PROVIDER role.
      values.pendingSanctions.117:
+        {"_to":"0x3787445aa612a19D140840862cEf99694d9EA3De","_timestamp":1743368100}
+++ description: addresses sanctioned by any KYC_PROVIDER role.
      values.pendingSanctions.116:
+        {"_to":"0xdF45DcC1C326Af55ac389D09327d79699839E31b","_timestamp":1743368491}
+++ description: addresses sanctioned by any KYC_PROVIDER role.
      values.pendingSanctions.115:
+        {"_to":"0xdb563dA812f5d90727bb12a0959F5679B9a2Ea5F","_timestamp":1710533543}
+++ description: addresses sanctioned by any KYC_PROVIDER role.
      values.pendingSanctions.114:
+        {"_to":"0x47c33fd0772e8B103aBEe763d1C2FB864b665B3B","_timestamp":1743368117}
+++ description: addresses sanctioned by any KYC_PROVIDER role.
      values.pendingSanctions.113:
+        {"_to":"0xda250570f0DBf9650C8f80989390e71118A64B51","_timestamp":1743368491}
+++ description: addresses sanctioned by any KYC_PROVIDER role.
      values.pendingSanctions.112:
+        {"_to":"0x52F09693c9eEaA93A64BA697e3d3e43a1eB65477","_timestamp":1707401778}
+++ description: addresses sanctioned by any KYC_PROVIDER role.
      values.pendingSanctions.111:
+        {"_to":"0x9568D407b9BD55F20d20982306C6Feca5e43eb47","_timestamp":1743368190}
+++ description: addresses sanctioned by any KYC_PROVIDER role.
      values.pendingSanctions.110:
+        {"_to":"0xD32f6b08314E52744d244c764d1DA85c04514f34","_timestamp":1743368220}
+++ description: addresses sanctioned by any KYC_PROVIDER role.
      values.pendingSanctions.109:
+        {"_to":"0x6E944c6B214B215dfe053e7287f04f700a467DA8","_timestamp":1743368147}
+++ description: addresses sanctioned by any KYC_PROVIDER role.
      values.pendingSanctions.108:
+        {"_to":"0x1d9E490938feD3dF12A09528aa25ff6620d69d1b","_timestamp":1743367401}
+++ description: addresses sanctioned by any KYC_PROVIDER role.
      values.pendingSanctions.107:
+        {"_to":"0xdb563dA812f5d90727bb12a0959F5679B9a2Ea5F","_timestamp":1710533376}
+++ description: addresses sanctioned by any KYC_PROVIDER role.
      values.pendingSanctions.106:
+        {"_to":"0x09A95021fB4E9C7e391B3e7D4726748251C5d970","_timestamp":1743367391}
+++ description: addresses sanctioned by any KYC_PROVIDER role.
      values.pendingSanctions.105:
+        {"_to":"0xF8e3A7C50095B105dd049643f32531cDE57eBDA7","_timestamp":1743368286}
+++ description: addresses sanctioned by any KYC_PROVIDER role.
      values.pendingSanctions.104:
+        {"_to":"0xaACA709AaD0E99891A16c4e2028Ad5053cEeB2b0","_timestamp":1743368286}
+++ description: addresses sanctioned by any KYC_PROVIDER role.
      values.pendingSanctions.103:
+        {"_to":"0x1695b31503e1C49123c000ab24626750b858E972","_timestamp":1743367401}
+++ description: addresses sanctioned by any KYC_PROVIDER role.
      values.pendingSanctions.102:
+        {"_to":"0x42AAd1F0E18C9867Dd1bE8FB7E6f4119BAC62740","_timestamp":1743368117}
+++ description: addresses sanctioned by any KYC_PROVIDER role.
      values.pendingSanctions.101:
+        {"_to":"0xb2c54B111705B23BCB4cf584C396982c3B613F99","_timestamp":1707739213}
+++ description: addresses sanctioned by any KYC_PROVIDER role.
      values.pendingSanctions.100:
+        {"_to":"0x3c500E160EaB2CD26027a3389b70ED4e17cd9544","_timestamp":1743368117}
+++ description: addresses sanctioned by any KYC_PROVIDER role.
      values.pendingSanctions.99:
+        {"_to":"0xa5AFC38dDBE6e2dda8dC7A4fdae380a9Dbe12a06","_timestamp":1707472806}
+++ description: addresses sanctioned by any KYC_PROVIDER role.
      values.pendingSanctions.98:
+        {"_to":"0xac2ec1ec2E53098Ebbd36753187CDDf7E3d438AB","_timestamp":1743368466}
+++ description: addresses sanctioned by any KYC_PROVIDER role.
      values.pendingSanctions.97:
+        {"_to":"0x0E00e97FefD00F71b54E038899a97b470D6f662F","_timestamp":1719718683}
+++ description: addresses sanctioned by any KYC_PROVIDER role.
      values.pendingSanctions.96:
+        {"_to":"0xd9E77167C8b13b9D1AFF04CC469Ad55BEeB78358","_timestamp":1743368491}
+++ description: addresses sanctioned by any KYC_PROVIDER role.
      values.pendingSanctions.95:
+        {"_to":"0x4F5D61De15F7D9C933f78937295402b3E0D9AA6f","_timestamp":1708077610}
      values.pendingSanctions.94._to:
-        "0x19CC0e919b58e0d0eF7BaeBb103f72dee1031978"
+        "0xcf011278736204F57B343568A8A8DC09f266a834"
      values.pendingSanctions.93._to:
-        "0x467Fa5244cd8386581635646F12E13C05Ad0f41F"
+        "0x63b6bbBcab97d26d87abfb2E68E63ebd7772C0cb"
      values.pendingSanctions.93._timestamp:
-        1718846703
+        1743368147
      values.pendingSanctions.92._to:
-        "0x3CfA8C0e6eEb1e601f76355A82f583232b186a7D"
+        "0xf6f06e71eFB2671eAaBcf6E2C090357c995C495D"
      values.pendingSanctions.92._timestamp:
-        1706580004
+        1718846587
      values.pendingSanctions.91._to:
-        "0x275edFf82EB0c3845edaBa411D7A5bE31486C2B6"
+        "0x1971eB33A28eCFa6BF701a6efec4255633F338FB"
      values.pendingSanctions.91._timestamp:
-        1710367221
+        1718846645
      values.pendingSanctions.90._to:
-        "0xBD85550C39dE4844E501A278D6b632FbE68cF70F"
+        "0xfF4a476cf39589be4b6Ad7e4b36d7156710b5c3e"
      values.pendingSanctions.90._timestamp:
-        1716580853
+        1743368523
      values.pendingSanctions.89._to:
-        "0x504a1ef47bF87a550bebfBA6ffe58a3a57bADeB7"
+        "0x62671619ccb07Db5f94A8381A308989C953A0Cc9"
      values.pendingSanctions.89._timestamp:
-        1707652818
+        1743368147
      values.pendingSanctions.88._to:
-        "0x9E292AFD2492f4ecBA6c1eb8B73BC87A5650eB8F"
+        "0xb6753e1DEbD7e615bC9c89aF2D2b8580F6B06b13"
      values.pendingSanctions.88._timestamp:
-        1718846645
+        1743368466
      values.pendingSanctions.87._to:
-        "0xE65a2Dee17190786c76f83e36F489a085690686C"
+        "0xcb1fb203B40de4EC7B685907D8901B249480e534"
      values.pendingSanctions.87._timestamp:
-        1707840030
+        1743395045
      values.pendingSanctions.86._to:
-        "0xbf3fBce48ff8a49918dD8578290814ea466aB79F"
+        "0x2AC29F4a5bA804844fCb72c2E1d739C7F24fC749"
      values.pendingSanctions.86._timestamp:
-        1718846587
+        1743368100
      values.pendingSanctions.85._to:
-        "0x81bb2B25eA1A01BADA25d41C67A34d81C9684712"
+        "0x9C31138FDb4baC14eAC4dbc0C4Ec8F1ea77E9682"
      values.pendingSanctions.85._timestamp:
-        1718846645
+        1743368190
      values.pendingSanctions.84._to:
-        "0xcD984AD7eBB2ab7B2aE0afd967F371c6E24a4Bc6"
+        "0xCD856EfFC6ee06b8395bCD81d46884356680D658"
      values.pendingSanctions.84._timestamp:
-        1718846587
+        1743368220
      values.pendingSanctions.83._to:
-        "0x99758a8519691B6bffEeD3976080c943634B7364"
+        "0xEA240C87B28a5074abbb34058935AD26391e6126"
      values.pendingSanctions.83._timestamp:
-        1718846645
+        1743368286
      values.pendingSanctions.82._to:
-        "0x1075d13CE70F8F4eB840c4c264b6c84C2CD4E785"
+        "0xf5B0cF796D4E58c74480Ddc20A701d7d159D7C70"
      values.pendingSanctions.82._timestamp:
-        1708034428
+        1743395045
      values.pendingSanctions.81._to:
-        "0xC44F5CA2F187D5ece6864b8a31174C36dEFdC29c"
+        "0x634D84AFE8Bed2f308F99bdE4677A6D1F8DBfC6D"
      values.pendingSanctions.81._timestamp:
-        1706139865
+        1743368147
      values.pendingSanctions.80._to:
-        "0xC10730513A843fa0E2Fc223eC2AE3B6d3d002294"
+        "0xca3E2E5c75121Cb46360E4459F6F94dCA6D868f4"
      values.pendingSanctions.80._timestamp:
-        1719715565
+        1707462016
      values.pendingSanctions.79._to:
-        "0x505D435C8B66a7511dbec7f3C8DA6F1e67D50dDA"
+        "0x8F14A1990cB5D327E545be6aF2a03B517aC58259"
      values.pendingSanctions.79._timestamp:
-        1706148032
+        1706074667
      values.pendingSanctions.78._to:
-        "0x01e523cC67e5d3459bE930837d89bccEA85Fd1DC"
+        "0xfafdcA2FfEE318eaA4463003F6a99A16B8FEe45c"
      values.pendingSanctions.78._timestamp:
-        1719715623
+        1743368523
      values.pendingSanctions.77._to:
-        "0x5579CA784CdC93776b9c030618548f1317AB4c39"
+        "0x3e8c3aB6C952d626A48EdBCA0fd86c891Ab3c63f"
      values.pendingSanctions.77._timestamp:
-        1706148032
+        1743368117
      values.pendingSanctions.76._to:
-        "0x75D9312845d38764229455Ea8d526A122b37768D"
+        "0x6dc56C56e81EE1D496274f9349696657Dd005B0a"
      values.pendingSanctions.76._timestamp:
-        1719718623
+        1743368147
      values.pendingSanctions.75._to:
-        "0xe12BcEe0219f3c80FFF8C271D29e343bA42B814d"
+        "0xC3124240b6faAC99FaCeaC43E9698efFc5A997ad"
      values.pendingSanctions.75._timestamp:
-        1707483639
+        1743368220
      values.pendingSanctions.74._to:
-        "0x933b0f5e531648Bef764b58Ff7782AfB13AB06D0"
+        "0x403fA81DB3CB6095007E8377500E676cB7dbFcB9"
      values.pendingSanctions.74._timestamp:
-        1718846703
+        1743368117
      values.pendingSanctions.73._to:
-        "0x2a14E7B96D2362bdf1Df8C0bB4544714e7601Af0"
+        "0x6CDB95f68B61922d4fE0708e55792390D8c669e4"
      values.pendingSanctions.73._timestamp:
-        1734246668
+        1719718623
      values.pendingSanctions.72._to:
-        "0x493ff963FAAbbBeDBA2Aa19378bF8d8a0F0e2C5E"
+        "0x574CFb5AA6F7A05B111Cd298b73A4123AAfdF97f"
      values.pendingSanctions.72._timestamp:
-        1718846587
+        1710932425
      values.pendingSanctions.71._to:
-        "0xA4EcEAB6C954C3b967cF18e947879A6708A96D5e"
+        "0x2c0c5825cD05B58d504E76d0e0571b9Bc07DF2A3"
      values.pendingSanctions.71._timestamp:
-        1719715444
+        1743368100
      values.pendingSanctions.70._to:
-        "0x89F6188006a35b9D0407c37f01FCa27AeD48CA3B"
+        "0x1E25292Ed119b1ca6aEaaF11F520ff0bCb638740"
      values.pendingSanctions.70._timestamp:
-        1719718683
+        1743367401
      values.pendingSanctions.69._to:
-        "0x985540465088C9c667690cC17BFf732fC703D2E5"
+        "0xCfcB156E4EB3f85A6FE1cec2DC83FBFEcF8Ee7FC"
      values.pendingSanctions.69._timestamp:
-        1719718623
+        1743368220
      values.pendingSanctions.68._to:
-        "0x1f16335Fd1dD3e8DCC8b401f5ae8BA57F8AD76a8"
+        "0x4996Ea58A0E3cAB8A324366E9684d1E2e679ce67"
      values.pendingSanctions.68._timestamp:
-        1706580004
+        1743368117
      values.pendingSanctions.67._to:
-        "0x2955ca0D791C30C16e7298B803BB116bED5d7269"
+        "0x9bfAd309FA457804B60FBec15Ec6D174111587f5"
      values.pendingSanctions.67._timestamp:
-        1706580004
+        1743368207
      values.pendingSanctions.66._to:
-        "0x6E6E2044A4cfeA057E02d6FB72c33Fc893A9B788"
+        "0x1B2888e792e82fe352FC9D1E73cdc91C6217F55c"
      values.pendingSanctions.66._timestamp:
-        1718846703
+        1717533287
      values.pendingSanctions.65._to:
-        "0xf30BF377b3C4ed1f111E6E28CF26003CE5a682Cf"
+        "0x615E981442C93325449cB379d991237a01c06b15"
      values.pendingSanctions.65._timestamp:
-        1706580004
+        1719715389
      values.pendingSanctions.64._to:
-        "0xE9Cb04a602cAA9D2C649dDE854Ab7389C98CF912"
+        "0xB3902654321D214d2B7Ca531832d0EF19780fDef"
      values.pendingSanctions.64._timestamp:
-        1706139865
+        1719718623
      values.pendingSanctions.63._to:
-        "0x45Ace2D41040B7267a465A4dF8733F3327EEFBb5"
+        "0x2bf871ca38EbF4D6Ce0124d8551F236BA33F6e8A"
      values.pendingSanctions.63._timestamp:
-        1719715444
+        1742239091
      values.pendingSanctions.62._to:
-        "0x76De7fC28E69bb78e6475C8Fd71B71793B663E31"
+        "0x3365dB4c3490AC6A43986Cfe2c26FE61B22aA917"
      values.pendingSanctions.62._timestamp:
-        1707346822
+        1707494421
      values.pendingSanctions.61._to:
-        "0x7B31BC4FD8A00f734690AD0607903AA2C770a802"
+        "0x6baa2c84A37999D264DA7bEe9639cDd3171c1397"
      values.pendingSanctions.61._timestamp:
-        1718846645
+        1719718683
      values.pendingSanctions.60._to:
-        "0x463d21B0620C77620aeD87A769e5836132158855"
+        "0x258DcCC0802232B7C9BC9ee71fde382Ed88d7Ce0"
      values.pendingSanctions.60._timestamp:
-        1707627639
+        1743367401
      values.pendingSanctions.59._to:
-        "0xD0aC63a724dCb105561F981c3D9dda033570193e"
+        "0xfD73361D700410FC1513e91acf5E138d00a3dBe3"
      values.pendingSanctions.59._timestamp:
-        1718846587
+        1743368523
      values.pendingSanctions.58._to:
-        "0xfB474dDfDc91293aD2a37A58DC94D6505d2c88dF"
+        "0xbafC930Eff179386813D17AF4f70A7d367f37E55"
      values.pendingSanctions.58._timestamp:
-        1738203485
+        1743394986
      values.pendingSanctions.57._to:
-        "0x927491618ECd06afBCEDeA84a2fEF71c991f00Eb"
+        "0x0E084652CDc1a68f42218522b9A8a68FC4e6619f"
      values.pendingSanctions.57._timestamp:
-        1707354023
+        1743367391
      values.pendingSanctions.56._to:
-        "0x8862Dd4657aBCdf04c96402cD4C3007511538500"
+        "0x73163b73F526F436DD3234a439c4b691f5Db6F0c"
      values.pendingSanctions.56._timestamp:
-        1719718683
+        1743394746
      values.pendingSanctions.55._to:
-        "0x6402119871Cc942Edc26e4815B99711750B87DBB"
+        "0x92D620d0279359727A0128cC19b84EEF89621Fb4"
      values.pendingSanctions.55._timestamp:
-        1719718623
+        1708164033
      values.pendingSanctions.54._to:
-        "0xc3106dd6f982d4269a6618E77f49927d44BCCafD"
+        "0x504CC21F6343F966E672ce27054f9b7e546cd918"
      values.pendingSanctions.54._timestamp:
-        1706580004
+        1719715623
      values.pendingSanctions.53._to:
-        "0x015374c2Dc040eE1c40739936C72D5F035186f0f"
+        "0x3C9959C3EfEC9674926D86D8CAA814A486bA047B"
      values.pendingSanctions.53._timestamp:
-        1706662831
+        1712740568
      values.pendingSanctions.52._to:
-        "0x10888fc193ec8a5b9ce29a0213473B2ceFA1E707"
+        "0x07bAA7EFD71836c440115add44f433B660cf61b8"
      values.pendingSanctions.52._timestamp:
-        1719715565
+        1743367391
      values.pendingSanctions.51._to:
-        "0x9E33F1333587Ee7f96772523821187de185d2ead"
+        "0x158B49eCD928000B49036a4B3dD1E45ad7FEcEBE"
      values.pendingSanctions.51._timestamp:
-        1719715565
+        1743367401
      values.pendingSanctions.50._to:
-        "0x23C1c317368AB6Dc5F92a496e08A79ceE6f90392"
+        "0xdD330d70F14AEa4Ce7b9E777fDCC117321c74124"
      values.pendingSanctions.50._timestamp:
-        1719718683
+        1722940629
      values.pendingSanctions.49._to:
-        "0xfd1dCf92A221f333061575FD8B7D02b6E3A5957D"
+        "0x49aEa6275e1D94Df2AC90c3ee4e4afd47e468d71"
      values.pendingSanctions.49._timestamp:
-        1710867621
+        1712710928
      values.pendingSanctions.48._to:
-        "0x3b2E6A063125c95f327aE214eD1F20B901801059"
+        "0x93402720154e26A044E8389D2733F281fF830c5c"
      values.pendingSanctions.48._timestamp:
-        1719715506
+        1717937047
      values.pendingSanctions.47._to:
-        "0x7Faf6f69caD10Eaf3903847434bF92b4Bb6fC955"
+        "0x32C4a3feAcff6592ed5a3878cFb839dD282f5807"
      values.pendingSanctions.47._timestamp:
-        1719718623
+        1743394623
      values.pendingSanctions.46._to:
-        "0x2548e483ceeFBe4de727f2F853AF0124869Ae75E"
+        "0x273DDd44f634c71112D2244B59999eD9A9Dd0562"
      values.pendingSanctions.46._timestamp:
-        1707566427
+        1743367401
      values.pendingSanctions.45._to:
-        "0xc2811Dfd12FF70b229d26E465359664f9e60b9D2"
+        "0xaE815562105d42a06D06ff31139A63eE3F72128a"
      values.pendingSanctions.45._timestamp:
-        1706148032
+        1743368466
      values.pendingSanctions.44._to:
-        "0x9baE98859a9D5Ba64AD43E0C22F99d8BAd7FB554"
+        "0x7498cF5863fd745eE79d7F07516725b87fE9C8FB"
      values.pendingSanctions.44._timestamp:
-        1710363512
+        1706148032
      values.pendingSanctions.43._to:
-        "0x0828b8Fe631347dA81a46E3D23394C3b18395aD4"
+        "0x1e9478A59d7182ddEd839bCc1aC7249D9c779003"
      values.pendingSanctions.43._timestamp:
-        1707498031
+        1743367401
      values.pendingSanctions.42._to:
-        "0xdb563dA812f5d90727bb12a0959F5679B9a2Ea5F"
+        "0x23c48DE9c94873Ca477871987c5a6C691517cc7C"
      values.pendingSanctions.42._timestamp:
-        1710533543
+        1743367401
      values.pendingSanctions.41._to:
-        "0x52F09693c9eEaA93A64BA697e3d3e43a1eB65477"
+        "0xc884086a4e38a1072a0B4ED81054E9eEc92637ae"
      values.pendingSanctions.41._timestamp:
-        1707401778
+        1743368466
      values.pendingSanctions.40._to:
-        "0xdb563dA812f5d90727bb12a0959F5679B9a2Ea5F"
+        "0xe7e376c075D142f2b2A8de8708D723aC4a0d02aC"
      values.pendingSanctions.40._timestamp:
-        1710533376
+        1743368491
      values.pendingSanctions.39._to:
-        "0xb2c54B111705B23BCB4cf584C396982c3B613F99"
+        "0x03C1F121735Abf4B70645eFdc810Aa1721F13fBd"
      values.pendingSanctions.39._timestamp:
-        1707739213
+        1743367391
      values.pendingSanctions.38._to:
-        "0xa5AFC38dDBE6e2dda8dC7A4fdae380a9Dbe12a06"
+        "0x6C38A71C9bd2cb9A262C5503E8D9D3D095386C00"
      values.pendingSanctions.38._timestamp:
-        1707472806
+        1719718683
      values.pendingSanctions.37._to:
-        "0x0E00e97FefD00F71b54E038899a97b470D6f662F"
+        "0x02b308D92893E3d93a2cD1C6506a7935B369f2C9"
      values.pendingSanctions.37._timestamp:
-        1719718683
+        1719715506
      values.pendingSanctions.36._to:
-        "0x4F5D61De15F7D9C933f78937295402b3E0D9AA6f"
+        "0x2342Df696C6a3716315BFa4C07Bb8ee519D92289"
      values.pendingSanctions.36._timestamp:
-        1708077610
+        1743367401
      values.pendingSanctions.35._to:
-        "0xcf011278736204F57B343568A8A8DC09f266a834"
+        "0x0bF170f698a976ad14c79130aed5D3b0594B667E"
      values.pendingSanctions.35._timestamp:
-        1706580004
+        1743367391
      values.pendingSanctions.34._to:
-        "0xf6f06e71eFB2671eAaBcf6E2C090357c995C495D"
+        "0xd0FeC78B636fb50f4cBbf9408B5369f34A7E6060"
      values.pendingSanctions.34._timestamp:
-        1718846587
+        1743368466
      values.pendingSanctions.33._to:
-        "0x1971eB33A28eCFa6BF701a6efec4255633F338FB"
+        "0xa7E7870aFEe03C4768feDCb55db9bC11E1187356"
      values.pendingSanctions.33._timestamp:
-        1718846645
+        1719715506
      values.pendingSanctions.32._to:
-        "0xca3E2E5c75121Cb46360E4459F6F94dCA6D868f4"
+        "0x4D836F0f988424f32065086D9A32644a7695e248"
      values.pendingSanctions.32._timestamp:
-        1707462016
+        1719718509
      values.pendingSanctions.31._to:
-        "0x8F14A1990cB5D327E545be6aF2a03B517aC58259"
+        "0x24444de1eFf861197fd1393cF6081701237d3380"
      values.pendingSanctions.31._timestamp:
-        1706074667
+        1708048804
      values.pendingSanctions.30._to:
-        "0x6CDB95f68B61922d4fE0708e55792390D8c669e4"
+        "0x1a3042689f2999BbEfedD132338D819C9dD62e08"
      values.pendingSanctions.30._timestamp:
-        1719718623
+        1743367401
      values.pendingSanctions.29._to:
-        "0x574CFb5AA6F7A05B111Cd298b73A4123AAfdF97f"
+        "0x0d95E6D05dcF62443C6925d97D70697ce26298F4"
      values.pendingSanctions.29._timestamp:
-        1710932425
+        1743367391
      values.pendingSanctions.28._to:
-        "0x1B2888e792e82fe352FC9D1E73cdc91C6217F55c"
+        "0x2460b2b758ca5332725C9BebecAafd70eF004963"
      values.pendingSanctions.28._timestamp:
-        1717533287
+        1743394986
      values.pendingSanctions.27._to:
-        "0x615E981442C93325449cB379d991237a01c06b15"
+        "0x47DBDEe9AD57e48b9F9a0F867712357Ffb5B489f"
      values.pendingSanctions.27._timestamp:
-        1719715389
+        1719718623
      values.pendingSanctions.26._to:
-        "0xB3902654321D214d2B7Ca531832d0EF19780fDef"
+        "0x5420f6C9Bc0495d24f35Ba25Be8e259693615625"
      values.pendingSanctions.26._timestamp:
-        1719718623
+        1707343233
      values.pendingSanctions.25._to:
-        "0x2bf871ca38EbF4D6Ce0124d8551F236BA33F6e8A"
+        "0xC14051DBDc3459A6A353D887dDF68F2BE286FaD6"
      values.pendingSanctions.25._timestamp:
-        1742239091
+        1707998409
      values.pendingSanctions.24._to:
-        "0x3365dB4c3490AC6A43986Cfe2c26FE61B22aA917"
+        "0x60a05081683493b2932Df77eE5fac141D2329B89"
      values.pendingSanctions.24._timestamp:
-        1707494421
+        1736789115
      values.pendingSanctions.23._to:
-        "0x6baa2c84A37999D264DA7bEe9639cDd3171c1397"
+        "0x9bC8048273BBa88f36c81a94EBde7ab5E0322e22"
      values.pendingSanctions.22._to:
-        "0x92D620d0279359727A0128cC19b84EEF89621Fb4"
+        "0x08da15e0ab29A928b3fd02CbdDf44e14a1e9994d"
      values.pendingSanctions.22._timestamp:
-        1708164033
+        1743367391
      values.pendingSanctions.21._to:
-        "0x504CC21F6343F966E672ce27054f9b7e546cd918"
+        "0x2f3f40216112e54F8AC7668c364E459F156ed2af"
      values.pendingSanctions.21._timestamp:
-        1719715623
+        1734613992
      values.pendingSanctions.20._to:
-        "0x3C9959C3EfEC9674926D86D8CAA814A486bA047B"
+        "0x06dE06782E4626962b5aEF4958dBb3C6df105614"
      values.pendingSanctions.20._timestamp:
-        1712740568
+        1743367391
      values.pendingSanctions.19._to:
-        "0xdD330d70F14AEa4Ce7b9E777fDCC117321c74124"
+        "0x3e7b92D14dfA2A891B69d73A9912C7bea9C86bDB"
      values.pendingSanctions.19._timestamp:
-        1722940629
+        1710363512
      values.pendingSanctions.18._to:
-        "0x49aEa6275e1D94Df2AC90c3ee4e4afd47e468d71"
+        "0x60BF5eE1CBf2a18639412ce694FbCe1c8c3E6637"
      values.pendingSanctions.18._timestamp:
-        1712710928
+        1707346822
      values.pendingSanctions.17._to:
-        "0x93402720154e26A044E8389D2733F281fF830c5c"
+        "0x01A50003561fF26e57BaFF15e0B7A93122d7A7fA"
      values.pendingSanctions.17._timestamp:
-        1717937047
+        1743367391
      values.pendingSanctions.16._to:
-        "0x7498cF5863fd745eE79d7F07516725b87fE9C8FB"
+        "0x1FdC05572B108616bb4E6f21068D31cc08Ffaa98"
      values.pendingSanctions.16._timestamp:
-        1706148032
+        1743367401
      values.pendingSanctions.15._to:
-        "0x6C38A71C9bd2cb9A262C5503E8D9D3D095386C00"
+        "0x0D757815a1997F98c07d4ffD781732e9D456F3A2"
      values.pendingSanctions.15._timestamp:
-        1719718683
+        1743367391
      values.pendingSanctions.14._to:
-        "0x02b308D92893E3d93a2cD1C6506a7935B369f2C9"
+        "0x1aA28cd209E8a44273E9FD8053b3385cE4861BBe"
      values.pendingSanctions.14._timestamp:
-        1719715506
+        1743367401
      values.pendingSanctions.13._to:
-        "0xa7E7870aFEe03C4768feDCb55db9bC11E1187356"
+        "0x01fEC93Ec45adf224000d02Ccff75431ef064415"
      values.pendingSanctions.13._timestamp:
-        1719715506
+        1743367391
      values.pendingSanctions.12._to:
-        "0x4D836F0f988424f32065086D9A32644a7695e248"
+        "0x21C5cD61d92b610DB88426Be3eecB2c2E915693f"
      values.pendingSanctions.12._timestamp:
-        1719718509
+        1743367401
      values.pendingSanctions.11._to:
-        "0x24444de1eFf861197fd1393cF6081701237d3380"
+        "0x0008970a4F2AdEe393A8C399Af7032D690a780E8"
      values.pendingSanctions.11._timestamp:
-        1708048804
+        1743365649
      values.pendingSanctions.10._to:
-        "0x47DBDEe9AD57e48b9F9a0F867712357Ffb5B489f"
+        "0x08D43D53E1F92B16622c4Ba5a3862b280B6510c6"
      values.pendingSanctions.10._timestamp:
-        1719718623
+        1743367391
      values.pendingSanctions.9._to:
-        "0x5420f6C9Bc0495d24f35Ba25Be8e259693615625"
+        "0xCc946190D2F37497d21e10309a20D56CF240446B"
      values.pendingSanctions.9._timestamp:
-        1707343233
+        1710360415
      values.pendingSanctions.8._to:
-        "0xC14051DBDc3459A6A353D887dDF68F2BE286FaD6"
+        "0x5eD7850289599F6B2D54bEA67eBA966C4b7F0880"
      values.pendingSanctions.8._timestamp:
-        1707998409
+        1743395045
      values.pendingSanctions.7._to:
-        "0x60a05081683493b2932Df77eE5fac141D2329B89"
+        "0x05b66E614bb4E34F341f05811DcA098edA8dA168"
      values.pendingSanctions.7._timestamp:
-        1736789115
+        1743367391
      values.pendingSanctions.6._to:
-        "0x9bC8048273BBa88f36c81a94EBde7ab5E0322e22"
+        "0x043B9f49F00F91f49BcD545271236b12B5d7B371"
      values.pendingSanctions.6._timestamp:
-        1719718683
+        1743367391
      values.pendingSanctions.5._to:
-        "0x2f3f40216112e54F8AC7668c364E459F156ed2af"
+        "0x102C7CAF21c4B1EF75c5d3EEEbe673E73c1706D3"
      values.pendingSanctions.5._timestamp:
-        1734613992
+        1710363512
      values.pendingSanctions.4._to:
-        "0x3e7b92D14dfA2A891B69d73A9912C7bea9C86bDB"
+        "0x115E3390F450dee7B66C06631d8DaC7daC38C80D"
      values.pendingSanctions.4._timestamp:
-        1710363512
+        1743367391
      values.pendingSanctions.3._to:
-        "0x60BF5eE1CBf2a18639412ce694FbCe1c8c3E6637"
+        "0x26882fe190b0A5BF429A238a11A0e923BC23f7bc"
      values.pendingSanctions.3._timestamp:
-        1707346822
+        1743367401
      values.pendingSanctions.2._to:
-        "0xCc946190D2F37497d21e10309a20D56CF240446B"
+        "0x1d8A54B1781CA484068761Ef329eF14B82C9F811"
      values.pendingSanctions.2._timestamp:
-        1710360415
+        1743367401
      values.pendingSanctions.1._to:
-        "0x102C7CAF21c4B1EF75c5d3EEEbe673E73c1706D3"
+        "0x1Ff8724D557ab6A50dc240A2EFAd8adb23E12E25"
      values.pendingSanctions.1._timestamp:
-        1710363512
+        1743367401
    }
```

Generated with discovered.json: 0x93bee956c70ecd4851466713c0456ac6a2688a62

# Diff at Fri, 28 Mar 2025 10:29:19 GMT:

- chain: kinto
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@279f845afa28d7cd0a0fe99f5744c0fe98cd5c86 block: 781473
- current block number: 783310

## Description

Ignore RewardsDistributor.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 781473 (main branch discovery), not current.

```diff
-   Status: DELETED
    contract BridgedKinto (0x010700808D59d2bb92257fCafACfe8e5bFF7aB87)
    +++ description: KINTO token contract.
```

```diff
-   Status: DELETED
    contract Treasury (0x793500709506652Fcc61F0d2D0fDa605638D4293)
    +++ description: Kinto Treasury.
```

```diff
    contract AccessManager (0xacC000818e5Bbd911D5d449aA81CB5cA24024739) {
    +++ description: Standard OpenZeppelin AccessManager contract: Serves as a proxy contract defining the roles, permissions and delays to call functions in target contracts.
      directlyReceivedPermissions.9:
-        {"permission":"upgrade","from":"0x8a4720488CA32f1223ccFE5A087e250fE3BC5D75"}
      directlyReceivedPermissions.8:
-        {"permission":"upgrade","from":"0x793500709506652Fcc61F0d2D0fDa605638D4293"}
      directlyReceivedPermissions.7.from:
-        "0x5A2b641b84b0230C8e75F55d5afd27f4Dbd59d5b"
+        "0x8a4720488CA32f1223ccFE5A087e250fE3BC5D75"
      directlyReceivedPermissions.6.permission:
-        "interact"
+        "upgrade"
      directlyReceivedPermissions.6.description:
-        "manage addresses that are callable by EOAs and other white-/blacklists that are enforced globally on the Kinto L2."
      directlyReceivedPermissions.5.permission:
-        "upgrade"
+        "interact"
      directlyReceivedPermissions.5.from:
-        "0xf369f78E3A0492CC4e96a90dae0728A38498e9c7"
+        "0x5A2b641b84b0230C8e75F55d5afd27f4Dbd59d5b"
      directlyReceivedPermissions.5.description:
+        "manage addresses that are callable by EOAs and other white-/blacklists that are enforced globally on the Kinto L2."
      directlyReceivedPermissions.4.permission:
-        "interact"
+        "upgrade"
      directlyReceivedPermissions.4.from:
-        "0x8a4720488CA32f1223ccFE5A087e250fE3BC5D75"
+        "0xf369f78E3A0492CC4e96a90dae0728A38498e9c7"
      directlyReceivedPermissions.4.description:
-        "update the central KintoWallet implementation of all users on Kinto L2 and approve specific wallets for recovery via the turnkey recoverer."
      directlyReceivedPermissions.3.from:
-        "0x793500709506652Fcc61F0d2D0fDa605638D4293"
+        "0x8a4720488CA32f1223ccFE5A087e250fE3BC5D75"
      directlyReceivedPermissions.3.description:
-        "send tokens and ETH from the Treasury to any address without delay."
+        "update the central KintoWallet implementation of all users on Kinto L2 and approve specific wallets for recovery via the turnkey recoverer."
    }
```

```diff
-   Status: DELETED
    contract RewardsDistributor (0xD157904639E89df05e89e0DabeEC99aE3d74F9AA)
    +++ description: None
```

Generated with discovered.json: 0x7d8888dd37ac334ba78ec5c7615681fda27b20f9

# Diff at Thu, 27 Mar 2025 09:06:27 GMT:

- chain: kinto
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@73b1a8c5f50d6fe327eed98ba839c3eed6ab6280 block: 778850
- current block number: 781473

## Description

BridgedKinto upgrade. AccessManager ready for stage 1 (incl queued transactions).
- ADMIN_ROLE grant to Kinto Multisig 2 canceled.
- 12d delays for execution and targetAdmin queued.

## Watched changes

```diff
    contract BridgedKinto (0x010700808D59d2bb92257fCafACfe8e5bFF7aB87) {
    +++ description: KINTO token contract.
      sourceHashes.1:
-        "0x7100558956c90af1deda7d8940594b34dfd14a466b66d3693f4219419308c9cd"
+        "0x01f873ab58dfa85af89a14ea5940a5d2d59c6c300d113b8e78d3ff47dbf70e4d"
      values.$implementation:
-        "0xF22F907b74CAB91864B7bEEcAdf762F464a96140"
+        "0xBe19941Dd429020A5B5d2704f953Fb0f7a3A3497"
      values.$pastUpgrades.9:
+        ["2025-03-26T22:14:03.000Z","0x3aa9d1b48b5f3f5d8b445cd0d0f21fd7c774a0dc2e601f12609759c44b366a26",["0xBe19941Dd429020A5B5d2704f953Fb0f7a3A3497"]]
      values.$upgradeCount:
-        9
+        10
    }
```

```diff
    contract AccessManager (0xacC000818e5Bbd911D5d449aA81CB5cA24024739) {
    +++ description: Standard OpenZeppelin AccessManager contract: Serves as a proxy contract defining the roles, permissions and delays to call functions in target contracts.
+++ description: List of scheduled operations.
+++ severity: HIGH
      values.OperationScheduled.6:
+        {"operationId":"0x0ad95e032eb7beede43f2741b7bcef6566a6163eaa1ac1ef42441f25193096d8","nonce":1,"schedule":1743464541,"caller":"0x2e2B1c42E38f5af81771e65D87729E57ABD1337a","target":"0xacC000818e5Bbd911D5d449aA81CB5cA24024739","data":"0x25c471a0000000000000000000000000000000000000000000000000783b0946b8c9d2e30000000000000000000000002e2b1c42e38f5af81771e65d87729e57abd1337a00000000000000000000000000000000000000000000000000000000000e8080"}
+++ description: List of scheduled operations.
+++ severity: HIGH
      values.OperationScheduled.5:
+        {"operationId":"0xc961c36ac064bc0a4f2e0be23c833c3e8d938587ce2f328fb818b8045e1137b1","nonce":1,"schedule":1743905986,"caller":"0x2e2B1c42E38f5af81771e65D87729E57ABD1337a","target":"0xacC000818e5Bbd911D5d449aA81CB5cA24024739","data":"0x25c471a000000000000000000000000000000000000000000000000000000000000000000000000000000000000000002e2b1c42e38f5af81771e65d87729e57abd1337a00000000000000000000000000000000000000000000000000000000000fd200"}
+++ description: List of scheduled operations.
+++ severity: HIGH
      values.OperationScheduled.4:
+        {"operationId":"0x2fad4066aacd2052b8b133e635b4d73fbbe42674134fd28b91b0191d4a2cfb0d","nonce":1,"schedule":1743905137,"caller":"0x2e2B1c42E38f5af81771e65D87729E57ABD1337a","target":"0xacC000818e5Bbd911D5d449aA81CB5cA24024739","data":"0xd22b59890000000000000000000000008a4720488ca32f1223ccfe5a087e250fe3bc5d7500000000000000000000000000000000000000000000000000000000000fd200"}
+++ description: List of scheduled operations.
+++ severity: HIGH
      values.OperationScheduled.3:
+        {"operationId":"0x8b8631e0ab585da013ce35fd8f3a27597f77e19c91ba1263b21cd7396f746d91","nonce":1,"schedule":1743955424,"caller":"0x28fC10E12A78f986c78F973Fc70ED88072b34c8e","target":"0xf369f78E3A0492CC4e96a90dae0728A38498e9c7","data":"0x3659cfe60000000000000000000000001d61772ae2e157f9f6a4127526ed86ab5801a477"}
+++ description: List of scheduled operations.
+++ severity: HIGH
      values.OperationScheduled.2:
+        {"operationId":"0x7efe7055898bb49bcf4b4bac2964df4814ca5698c700d895f669b8da3b83443a","nonce":1,"schedule":1743905135,"caller":"0x2e2B1c42E38f5af81771e65D87729E57ABD1337a","target":"0xacC000818e5Bbd911D5d449aA81CB5cA24024739","data":"0xd22b59890000000000000000000000005a2b641b84b0230c8e75f55d5afd27f4dbd59d5b00000000000000000000000000000000000000000000000000000000000fd200"}
+++ description: List of scheduled operations.
+++ severity: HIGH
      values.OperationScheduled.1:
+        {"operationId":"0x4a05b6df1acce9e22cf008555fa8d477bd9f116f261f267f95c2b463047e016a","nonce":1,"schedule":1743905136,"caller":"0x2e2B1c42E38f5af81771e65D87729E57ABD1337a","target":"0xacC000818e5Bbd911D5d449aA81CB5cA24024739","data":"0xd22b5989000000000000000000000000f369f78e3a0492cc4e96a90dae0728a38498e9c700000000000000000000000000000000000000000000000000000000000fd200"}
      values.OperationScheduled.0.operationId:
-        "0x0ad95e032eb7beede43f2741b7bcef6566a6163eaa1ac1ef42441f25193096d8"
+        "0x256b4be01a33f01810d8b7c1bb0e70df24b98d9f174b45ea4ea9f9f13a04990e"
      values.OperationScheduled.0.schedule:
-        1743464541
+        1743955424
      values.OperationScheduled.0.caller:
-        "0x2e2B1c42E38f5af81771e65D87729E57ABD1337a"
+        "0x28fC10E12A78f986c78F973Fc70ED88072b34c8e"
      values.OperationScheduled.0.target:
-        "0xacC000818e5Bbd911D5d449aA81CB5cA24024739"
+        "0x8a4720488CA32f1223ccFE5A087e250fE3BC5D75"
      values.OperationScheduled.0.data:
-        "0x25c471a0000000000000000000000000000000000000000000000000783b0946b8c9d2e30000000000000000000000002e2b1c42e38f5af81771e65d87729e57abd1337a00000000000000000000000000000000000000000000000000000000000e8080"
+        "0xf4f4b03a000000000000000000000000bfe260680514e0d669fdc5a5f7334b97a5513d9d"
    }
```

## Source code changes

```diff
.../kinto/{.flat@778850 => .flat}/BridgedKinto/BridgedKinto.sol      | 5 +++++
 1 file changed, 5 insertions(+)
```

Generated with discovered.json: 0x860f798971ee9f8ca5c2bb906627f0511e59de44

# Diff at Tue, 25 Mar 2025 11:49:20 GMT:

- chain: kinto
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@b4a04714c0219993c2a83e7714e82e32f8a106ba block: 773151
- current block number: 778850

## Description

BridgedKinto upgrade.

Current state of permissions in the AccessManager is unchanged.

waiting for:
queue operations for 12d values for:
- executionDelays for all non-SC actors for the roles UPGRADER_ROLE, ADMIN_ROLE and SECURITY_COUNCIL role
- targetAdminDelays for the 3 targets: KintoAppRegistry, KintoID, KintoWalletFactory
- KintoWallet.RECOVERY_TIME
- KintoID.EXIT_WINDOW_PERIOD

## Watched changes

```diff
    contract BridgedKinto (0x010700808D59d2bb92257fCafACfe8e5bFF7aB87) {
    +++ description: KINTO token contract.
      sourceHashes.1:
-        "0x8afd4a6a4dce2fedf29d5a78d35edbb8101e74ea5e923aebda93db04b4f44121"
+        "0x7100558956c90af1deda7d8940594b34dfd14a466b66d3693f4219419308c9cd"
      values.$implementation:
-        "0x6af53F698b87809d98CeAAfa848c73e192400E61"
+        "0xF22F907b74CAB91864B7bEEcAdf762F464a96140"
      values.$pastUpgrades.8:
+        ["2025-02-21T21:13:41.000Z","0xd65d8a3e984c6df5eb9bda4baee108c063c153abc195fbb9656b1d4b8236a1cb",["0xd70052c77dC9E5291c79842420a6d51010Ed014c"]]
      values.$pastUpgrades.7.2:
-        "2025-02-21T21:13:41.000Z"
+        "2024-06-29T15:10:34.000Z"
      values.$pastUpgrades.7.1.0:
-        "0xd70052c77dC9E5291c79842420a6d51010Ed014c"
+        "0x840670bC23d0f77474e43f8ee4A2Da617c7376F0"
      values.$pastUpgrades.7.0:
-        "0xd65d8a3e984c6df5eb9bda4baee108c063c153abc195fbb9656b1d4b8236a1cb"
+        "0xd8d8d68bef601e045e6b2bff422ebdb8857e554c568bece1148ee7a8bde6a865"
      values.$pastUpgrades.6.2:
-        "2024-06-29T15:10:34.000Z"
+        ["0xd70052c77dC9E5291c79842420a6d51010Ed014c"]
      values.$pastUpgrades.6.1:
-        ["0x840670bC23d0f77474e43f8ee4A2Da617c7376F0"]
+        "2025-03-19T21:51:53.000Z"
      values.$pastUpgrades.6.0:
-        "0xd8d8d68bef601e045e6b2bff422ebdb8857e554c568bece1148ee7a8bde6a865"
+        "0x0e582739f5a4d9605c001b7e2000de6140e478098f664ca7c907d7886bfd96f3"
      values.$pastUpgrades.5.2:
-        ["0xd70052c77dC9E5291c79842420a6d51010Ed014c"]
+        "0xb0828f7016e3452a4b32bf6d987b8a8e265c5bdf5fedbcc42b51940f17d18ab8"
      values.$pastUpgrades.5.1:
-        "2025-03-19T21:51:53.000Z"
+        ["0xAf968044D5DE68fE01B5a6517d0DbeE3caD8563a"]
      values.$pastUpgrades.5.0:
-        "0x0e582739f5a4d9605c001b7e2000de6140e478098f664ca7c907d7886bfd96f3"
+        "2024-12-18T00:08:48.000Z"
      values.$pastUpgrades.4.2:
-        "0xb0828f7016e3452a4b32bf6d987b8a8e265c5bdf5fedbcc42b51940f17d18ab8"
+        ["0x2D8Cb3A6cE18F78e479bbC5079865993324C51BA"]
      values.$pastUpgrades.4.1:
-        ["0xAf968044D5DE68fE01B5a6517d0DbeE3caD8563a"]
+        "0x2ede5a1db2f802171ef91a7693dc8313c822592a555e36ae1506ec468c897dd1"
      values.$pastUpgrades.4.0:
-        "2024-12-18T00:08:48.000Z"
+        "2024-06-20T23:33:48.000Z"
      values.$pastUpgrades.3.2.0:
-        "0x2D8Cb3A6cE18F78e479bbC5079865993324C51BA"
+        "0x6af53F698b87809d98CeAAfa848c73e192400E61"
      values.$pastUpgrades.3.1:
-        "0x2ede5a1db2f802171ef91a7693dc8313c822592a555e36ae1506ec468c897dd1"
+        "0xe01e30073eae9d9b6eb56ffce85389dbcafd04dcbbf007e05c77351182a4850c"
      values.$pastUpgrades.3.0:
-        "2024-06-20T23:33:48.000Z"
+        "2025-03-20T00:39:13.000Z"
      values.$pastUpgrades.2.2:
-        ["0x6af53F698b87809d98CeAAfa848c73e192400E61"]
+        "0xb70427666e80d6b474e9f29949fda22eb4fb50c9b548295f6d3f1a6f8a465561"
      values.$pastUpgrades.2.1:
-        "0xe01e30073eae9d9b6eb56ffce85389dbcafd04dcbbf007e05c77351182a4850c"
+        ["0xbE43c24500B855f0cc0D0F99361683B6C6ED73b8"]
      values.$pastUpgrades.2.0:
-        "2025-03-20T00:39:13.000Z"
+        "2024-07-10T20:17:25.000Z"
      values.$pastUpgrades.1.2:
-        "0xb70427666e80d6b474e9f29949fda22eb4fb50c9b548295f6d3f1a6f8a465561"
+        "2025-03-25T01:46:55.000Z"
      values.$pastUpgrades.1.1:
-        ["0xbE43c24500B855f0cc0D0F99361683B6C6ED73b8"]
+        "0x4c3e223697c1a08b1539359340534964303bba7cbc4519e70044c74ad19fd784"
      values.$pastUpgrades.1.0:
-        "2024-07-10T20:17:25.000Z"
+        ["0xF22F907b74CAB91864B7bEEcAdf762F464a96140"]
      values.$upgradeCount:
-        8
+        9
      values.VAULT:
+        "0x3De040ef2Fbf9158BADF559C5606d7706ca72309"
    }
```

```diff
    contract AccessManager (0xacC000818e5Bbd911D5d449aA81CB5cA24024739) {
    +++ description: Standard OpenZeppelin AccessManager contract: Serves as a proxy contract defining the roles, permissions and delays to call functions in target contracts.
      values.accessControl.roles.UPGRADER_ROLE.members.1:
-        {"member":"0x2e2B1c42E38f5af81771e65D87729E57ABD1337a","since":1733181166,"executionDelay":604800}
+++ description: List of roles revoked from accounts.
      values.RolesRevoked.8663528507529876195:
+        [{"roleId":"8663528507529876195","account":"0x2e2B1c42E38f5af81771e65D87729E57ABD1337a"}]
+++ description: CURRENT target admin delay, the access control handler shows the pending delay. Delays all config changes/additions in the AccessManager that affect this target. Must be >= 11d.
+++ severity: HIGH
      values.tadKintoAppRegistry:
-        0
+        950400
+++ description: CURRENT target admin delay, the access control handler shows the pending delay. Delays all config changes/additions in the AccessManager that affect this target. Must be >= 11d.
+++ severity: HIGH
      values.tadKintoID:
-        604800
+        950400
+++ description: CURRENT target admin delay, the access control handler shows the pending delay. Delays all config changes/additions in the AccessManager that affect this target. Must be >= 11d.
+++ severity: HIGH
      values.tadKintoWalletFactory:
-        604800
+        950400
    }
```

## Source code changes

```diff
.../kinto/{.flat@773151 => .flat}/BridgedKinto/BridgedKinto.sol     | 6 +++++-
 1 file changed, 5 insertions(+), 1 deletion(-)
```

Generated with discovered.json: 0x433020c537dbdf2e53a26994bff8c280032ed795

# Diff at Fri, 21 Mar 2025 14:35:20 GMT:

- chain: kinto
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@0cd49f2bd1f57cf090a4f7b659b8eb18c9783869 block: 772987
- current block number: 773151

## Description

Discovery rerun on the same block number with only config-related changes.

Rediscovered to properly handle canActIndependently on AccessManager thanks
to a source code fix.

Config: rename KintoAdminMultisig, edit config to treat it natively as a MS

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 772987 (main branch discovery), not current.

```diff
    contract Kinto Multisig 2 (0x2e2B1c42E38f5af81771e65D87729E57ABD1337a) {
    +++ description: None
      name:
-        "KintoAdminMultisig"
+        "Kinto Multisig 2"
      values.getOwners:
-        ["0x660ad4B5A74130a4796B4d54BC6750Ae93C86e6c","0xc1f4D15C16A1f3555E0a5F7AeFD1e17AD4aaf40B","0x08E674c4538caE03B6c05405881dDCd95DcaF5a8","0x94561e98DD5E55271f91A103e4979aa6C493745E"]
      values.$members:
+        ["0x94561e98DD5E55271f91A103e4979aa6C493745E","0x08E674c4538caE03B6c05405881dDCd95DcaF5a8","0x660ad4B5A74130a4796B4d54BC6750Ae93C86e6c","0xc1f4D15C16A1f3555E0a5F7AeFD1e17AD4aaf40B"]
+++ description: Current multisig threshold. Check the IMPROVISED mapping for the signer policy whenever this changes.
+++ severity: HIGH
      values.$threshold:
+        2
      fieldMeta:
+        {"$threshold":{"severity":"HIGH","description":"Current multisig threshold. Check the IMPROVISED mapping for the signer policy whenever this changes."}}
      usedTypes:
+        [{"typeCaster":"Mapping","arg":{"1":1,"2":1,"3":1,"4":2}}]
    }
```

```diff
    contract KintoAppRegistry (0x5A2b641b84b0230C8e75F55d5afd27f4Dbd59d5b) {
    +++ description: Central system contract defining addresses that are allowed to be called by EOAs. The modified Kinto node reads this configuration and drops all other transactions from EOAs (enforced by a modified state transition function). As a result, users can only transact using a canonical smart wallet.
      issuedPermissions:
-        [{"permission":"interact","to":"0xacC000818e5Bbd911D5d449aA81CB5cA24024739","description":"manage addresses that are callable by EOAs and other white-/blacklists that are enforced globally on the Kinto L2.","via":[]},{"permission":"upgrade","to":"0xacC000818e5Bbd911D5d449aA81CB5cA24024739","via":[]}]
    }
```

```diff
    contract Treasury (0x793500709506652Fcc61F0d2D0fDa605638D4293) {
    +++ description: Kinto Treasury.
      issuedPermissions:
-        [{"permission":"interact","to":"0xacC000818e5Bbd911D5d449aA81CB5cA24024739","description":"send tokens and ETH from the Treasury to any address without delay.","via":[]},{"permission":"upgrade","to":"0xacC000818e5Bbd911D5d449aA81CB5cA24024739","via":[]}]
    }
```

```diff
    contract KintoWalletFactory (0x8a4720488CA32f1223ccFE5A087e250fE3BC5D75) {
    +++ description: Deploys new KintoWallet smartwallets for users upon passing KYC checks. Also manages the beacon implementation for all KintoWallets and their recovery logic. KintoWallets can be funded with ETH via this contract.
      issuedPermissions:
-        [{"permission":"interact","to":"0xacC000818e5Bbd911D5d449aA81CB5cA24024739","description":"update the central KintoWallet implementation of all users on Kinto L2 and approve specific wallets for recovery via the turnkey recoverer.","via":[]},{"permission":"upgrade","to":"0xacC000818e5Bbd911D5d449aA81CB5cA24024739","via":[]}]
    }
```

```diff
    contract AccessManager (0xacC000818e5Bbd911D5d449aA81CB5cA24024739) {
    +++ description: Standard OpenZeppelin AccessManager contract: Serves as a proxy contract defining the roles, permissions and delays to call functions in target contracts.
      receivedPermissions:
-        [{"permission":"interact","from":"0x5A2b641b84b0230C8e75F55d5afd27f4Dbd59d5b","description":"manage addresses that are callable by EOAs and other white-/blacklists that are enforced globally on the Kinto L2."},{"permission":"interact","from":"0x793500709506652Fcc61F0d2D0fDa605638D4293","description":"send tokens and ETH from the Treasury to any address without delay."},{"permission":"interact","from":"0x8a4720488CA32f1223ccFE5A087e250fE3BC5D75","description":"update the central KintoWallet implementation of all users on Kinto L2 and approve specific wallets for recovery via the turnkey recoverer."},{"permission":"interact","from":"0xf369f78E3A0492CC4e96a90dae0728A38498e9c7","description":"manage the KYC status of any user (sanction status and KYC metadata) and mint/burn KintoID NFTs."},{"permission":"interact","from":"0xf369f78E3A0492CC4e96a90dae0728A38498e9c7","description":"permissioned to call `confirmSanction()`, which makes a temporary sanction by a KYC_PROVIDER permanent and does not grant an exit window to the affected wallet."},{"permission":"interact","from":"0xf369f78E3A0492CC4e96a90dae0728A38498e9c7","description":"transfer KYC NFTs to a different address."},{"permission":"upgrade","from":"0x5A2b641b84b0230C8e75F55d5afd27f4Dbd59d5b"},{"permission":"upgrade","from":"0x793500709506652Fcc61F0d2D0fDa605638D4293"},{"permission":"upgrade","from":"0x8a4720488CA32f1223ccFE5A087e250fE3BC5D75"},{"permission":"upgrade","from":"0xf369f78E3A0492CC4e96a90dae0728A38498e9c7"}]
      values.edKintoAdminMultisigADMIN:
-        950400
      values.edKintoAdminMultisigUPGRADER:
-        604800
      values.kintoAdminMultisigPermission:
-        "0x2e2B1c42E38f5af81771e65D87729E57ABD1337a"
+++ description: Current execution delay for target calls.
+++ severity: HIGH
      values.edKintoMultisig2ADMIN:
+        950400
+++ description: Current execution delay for target calls.
+++ severity: HIGH
      values.edKintoMultisig2UPGRADER:
+        604800
      values.kintoMultisig2Permission:
+        "0x2e2B1c42E38f5af81771e65D87729E57ABD1337a"
      fieldMeta.edKintoAdminMultisigUPGRADER:
-        {"severity":"HIGH","description":"Current execution delay for target calls."}
      fieldMeta.edKintoAdminMultisigADMIN:
-        {"severity":"HIGH","description":"Current execution delay for target calls."}
      fieldMeta.edKintoMultisig2UPGRADER:
+        {"severity":"HIGH","description":"Current execution delay for target calls."}
      fieldMeta.edKintoMultisig2ADMIN:
+        {"severity":"HIGH","description":"Current execution delay for target calls."}
      directlyReceivedPermissions:
+        [{"permission":"interact","from":"0xf369f78E3A0492CC4e96a90dae0728A38498e9c7","description":"transfer KYC NFTs to a different address."},{"permission":"interact","from":"0xf369f78E3A0492CC4e96a90dae0728A38498e9c7","description":"permissioned to call `confirmSanction()`, which makes a temporary sanction by a KYC_PROVIDER permanent and does not grant an exit window to the affected wallet."},{"permission":"interact","from":"0xf369f78E3A0492CC4e96a90dae0728A38498e9c7","description":"manage the KYC status of any user (sanction status and KYC metadata) and mint/burn KintoID NFTs."},{"permission":"interact","from":"0x793500709506652Fcc61F0d2D0fDa605638D4293","description":"send tokens and ETH from the Treasury to any address without delay."},{"permission":"interact","from":"0x8a4720488CA32f1223ccFE5A087e250fE3BC5D75","description":"update the central KintoWallet implementation of all users on Kinto L2 and approve specific wallets for recovery via the turnkey recoverer."},{"permission":"upgrade","from":"0xf369f78E3A0492CC4e96a90dae0728A38498e9c7"},{"permission":"interact","from":"0x5A2b641b84b0230C8e75F55d5afd27f4Dbd59d5b","description":"manage addresses that are callable by EOAs and other white-/blacklists that are enforced globally on the Kinto L2."},{"permission":"upgrade","from":"0x5A2b641b84b0230C8e75F55d5afd27f4Dbd59d5b"},{"permission":"upgrade","from":"0x793500709506652Fcc61F0d2D0fDa605638D4293"},{"permission":"upgrade","from":"0x8a4720488CA32f1223ccFE5A087e250fE3BC5D75"}]
    }
```

```diff
    contract KintoID (0xf369f78E3A0492CC4e96a90dae0728A38498e9c7) {
    +++ description: Manages Kinto's KYC system: The KYC_PROVIDER roles responsible for managing the KYC status and KYC metadata of user wallets. Each KintoWallet checks the KYC status of its user in this contract as part of the signature check.
      issuedPermissions.9:
-        {"permission":"upgrade","to":"0xacC000818e5Bbd911D5d449aA81CB5cA24024739","via":[]}
      issuedPermissions.8:
-        {"permission":"interact","to":"0x6E31039abF8d248aBed57E307C9E1b7530c269E4","description":"manage the KYC status of any user (sanction status and KYC metadata) and mint/burn KintoID NFTs.","via":[]}
      issuedPermissions.7:
-        {"permission":"interact","to":"0xacC000818e5Bbd911D5d449aA81CB5cA24024739","description":"manage the KYC status of any user (sanction status and KYC metadata) and mint/burn KintoID NFTs.","via":[]}
      issuedPermissions.6:
-        {"permission":"interact","to":"0x6E09F8A68fB5278e0C33D239dC12B2Cec33F4aC7","description":"manage the KYC status of any user (sanction status and KYC metadata) and mint/burn KintoID NFTs.","via":[]}
      issuedPermissions.5.to:
-        "0xacC000818e5Bbd911D5d449aA81CB5cA24024739"
+        "0x6E31039abF8d248aBed57E307C9E1b7530c269E4"
      issuedPermissions.5.description:
-        "permissioned to call `confirmSanction()`, which makes a temporary sanction by a KYC_PROVIDER permanent and does not grant an exit window to the affected wallet."
+        "manage the KYC status of any user (sanction status and KYC metadata) and mint/burn KintoID NFTs."
      issuedPermissions.4.to:
-        "0x6fe642404B7B23F31251103Ca0efb538Ad4aeC07"
+        "0x6E09F8A68fB5278e0C33D239dC12B2Cec33F4aC7"
      issuedPermissions.3.to:
-        "0x52F09693c9eEaA93A64BA697e3d3e43a1eB65477"
+        "0x6fe642404B7B23F31251103Ca0efb538Ad4aeC07"
      issuedPermissions.2.to:
-        "0xacC000818e5Bbd911D5d449aA81CB5cA24024739"
+        "0x52F09693c9eEaA93A64BA697e3d3e43a1eB65477"
      issuedPermissions.2.description:
-        "transfer KYC NFTs to a different address."
+        "manage the KYC status of any user (sanction status and KYC metadata) and mint/burn KintoID NFTs."
    }
```

Generated with discovered.json: 0x9c243f55a75514f7155771dc44fcfece48096fca

# Diff at Fri, 21 Mar 2025 09:58:16 GMT:

- chain: kinto
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@a4eed3e556a58bb9ab448d141c0407f67ca3ce31 block: 770292
- current block number: 772987

## Description

KINTO token upgrade (staking) and gov changes:
- KintoID.GOVERNANCE_ROLE removed from NioGovernor
- AccessManager execution delays and target delays increased to 11d (SCHEDULED)
- remove/change KintoAdminMultisig permissions (SCHEDULED)

the l2 gov system will be ready for full stage 1 review on 2025-03-31T23:42. the config, when including the scheduled ops, is complete.

```
============= Queued Delay/Config Changes and Queued Actions =============

Target KintoWalletFactory (0x8a4720488ca32f1223ccfe5a087e250fe3bc5d75) scheduled targetAdminDelay change:
  New targetAdminDelay: 950400 (11d) effective at 2025-03-24T23:33:14.000Z

Target KintoAppRegistry (0x5a2b641b84b0230c8e75f55d5afd27f4dbd59d5b) scheduled targetAdminDelay change:
  New targetAdminDelay: 604800 (7d) effective at 2025-03-23T23:34:54.000Z

Target KintoAppRegistry (0x5a2b641b84b0230c8e75f55d5afd27f4dbd59d5b) scheduled targetAdminDelay change:
  New targetAdminDelay: 950400 (11d) effective at 2025-03-24T23:33:13.000Z

Target KintoID (0xf369f78e3a0492cc4e96a90dae0728a38498e9c7) scheduled targetAdminDelay change:
  New targetAdminDelay: 950400 (11d) effective at 2025-03-24T23:33:12.000Z

Queued Operations:

Operation 0x0ad95e032eb7beede43f2741b7bcef6566a6163eaa1ac1ef42441f25193096d8:
    Nonce: 1
    Scheduled for: 2025-03-31T23:42:21.000Z
    Caller: KintoAdminMultisig (0x2e2b1c42e38f5af81771e65d87729e57abd1337a)
    Target: AccessManager (0xacc000818e5bbd911d5d449aa81cb5ca24024739)
    Function: grantRole(UPGRADER_ROLE, KintoAdminMultisig (0x2e2b1c42e38f5af81771e65d87729e57abd1337a), 950400 (11d))
```

## Watched changes

```diff
    contract NioGovernor (0x010600ff5f36C8eF3b6Aaf2A88C2DE85C798594a) {
    +++ description: Governance contract allowing token- and NFT based voting.
      receivedPermissions:
-        [{"permission":"interact","from":"0xf369f78E3A0492CC4e96a90dae0728A38498e9c7","description":"permissioned to call `confirmSanction()`, which makes a temporary sanction by a KYC_PROVIDER permanent and does not grant an exit window to the affected wallet."}]
    }
```

```diff
    contract BridgedKinto (0x010700808D59d2bb92257fCafACfe8e5bFF7aB87) {
    +++ description: KINTO token contract.
      sourceHashes.1:
-        "0xe15912dcb541011cee29f6046afcf500542e3763f530012c1ce71e54abd96545"
+        "0x8afd4a6a4dce2fedf29d5a78d35edbb8101e74ea5e923aebda93db04b4f44121"
      values.$implementation:
-        "0xd70052c77dC9E5291c79842420a6d51010Ed014c"
+        "0x6af53F698b87809d98CeAAfa848c73e192400E61"
      values.$pastUpgrades.7:
+        ["2025-02-21T21:13:41.000Z","0xd65d8a3e984c6df5eb9bda4baee108c063c153abc195fbb9656b1d4b8236a1cb",["0xd70052c77dC9E5291c79842420a6d51010Ed014c"]]
      values.$pastUpgrades.6:
+        ["2024-06-29T15:10:34.000Z","0xd8d8d68bef601e045e6b2bff422ebdb8857e554c568bece1148ee7a8bde6a865",["0x840670bC23d0f77474e43f8ee4A2Da617c7376F0"]]
      values.$pastUpgrades.5.2:
-        "2025-02-21T21:13:41.000Z"
+        ["0xd70052c77dC9E5291c79842420a6d51010Ed014c"]
      values.$pastUpgrades.5.1:
-        ["0xd70052c77dC9E5291c79842420a6d51010Ed014c"]
+        "2025-03-19T21:51:53.000Z"
      values.$pastUpgrades.5.0:
-        "0xd65d8a3e984c6df5eb9bda4baee108c063c153abc195fbb9656b1d4b8236a1cb"
+        "0x0e582739f5a4d9605c001b7e2000de6140e478098f664ca7c907d7886bfd96f3"
      values.$pastUpgrades.4.2:
-        "2024-06-29T15:10:34.000Z"
+        "0xb0828f7016e3452a4b32bf6d987b8a8e265c5bdf5fedbcc42b51940f17d18ab8"
      values.$pastUpgrades.4.1.0:
-        "0x840670bC23d0f77474e43f8ee4A2Da617c7376F0"
+        "0xAf968044D5DE68fE01B5a6517d0DbeE3caD8563a"
      values.$pastUpgrades.4.0:
-        "0xd8d8d68bef601e045e6b2bff422ebdb8857e554c568bece1148ee7a8bde6a865"
+        "2024-12-18T00:08:48.000Z"
      values.$pastUpgrades.3.2:
-        "0xb0828f7016e3452a4b32bf6d987b8a8e265c5bdf5fedbcc42b51940f17d18ab8"
+        ["0x2D8Cb3A6cE18F78e479bbC5079865993324C51BA"]
      values.$pastUpgrades.3.1:
-        ["0xAf968044D5DE68fE01B5a6517d0DbeE3caD8563a"]
+        "0x2ede5a1db2f802171ef91a7693dc8313c822592a555e36ae1506ec468c897dd1"
      values.$pastUpgrades.3.0:
-        "2024-12-18T00:08:48.000Z"
+        "2024-06-20T23:33:48.000Z"
      values.$pastUpgrades.2.2.0:
-        "0x2D8Cb3A6cE18F78e479bbC5079865993324C51BA"
+        "0x6af53F698b87809d98CeAAfa848c73e192400E61"
      values.$pastUpgrades.2.1:
-        "0x2ede5a1db2f802171ef91a7693dc8313c822592a555e36ae1506ec468c897dd1"
+        "0xe01e30073eae9d9b6eb56ffce85389dbcafd04dcbbf007e05c77351182a4850c"
      values.$pastUpgrades.2.0:
-        "2024-06-20T23:33:48.000Z"
+        "2025-03-20T00:39:13.000Z"
      values.$upgradeCount:
-        6
+        8
      values.STAKING:
+        "0x5A1e00984Af33BED5520Fd13e9c940F9f913cF10"
    }
```

```diff
    contract KintoSecurityCouncil_L2Alias (0x28fC10E12A78f986c78F973Fc70ED88072b34c8e) {
    +++ description: None
      receivedPermissions.1.delay:
-        604800
+        950400
    }
```

```diff
    contract KintoAdminMultisig (0x2e2B1c42E38f5af81771e65D87729E57ABD1337a) {
    +++ description: None
      receivedPermissions.5.permission:
-        "interact"
+        "upgrade"
      receivedPermissions.5.from:
-        "0xacC000818e5Bbd911D5d449aA81CB5cA24024739"
+        "0x0719D47A213149E2Ef8d3f5afDaDA8a8E22dfc03"
      receivedPermissions.5.description:
-        "change the configuration of all AccessManager permissions. The total delay can depend on the target of the configuration."
      receivedPermissions.4.permission:
-        "upgrade"
+        "interact"
      receivedPermissions.4.from:
-        "0x0719D47A213149E2Ef8d3f5afDaDA8a8E22dfc03"
+        "0xacC000818e5Bbd911D5d449aA81CB5cA24024739"
      receivedPermissions.4.delay:
+        950400
      receivedPermissions.4.description:
+        "change the configuration of all AccessManager permissions. The total delay can depend on the target of the configuration."
    }
```

```diff
    contract AccessManager (0xacC000818e5Bbd911D5d449aA81CB5cA24024739) {
    +++ description: Standard OpenZeppelin AccessManager contract: Serves as a proxy contract defining the roles, permissions and delays to call functions in target contracts.
      issuedPermissions.4.delay:
+        950400
      issuedPermissions.2.delay:
-        604800
+        950400
      values.accessControl.roles.ADMIN_ROLE.members.1.member:
-        "0x2e2B1c42E38f5af81771e65D87729E57ABD1337a"
+        "0x28fC10E12A78f986c78F973Fc70ED88072b34c8e"
      values.accessControl.roles.ADMIN_ROLE.members.1.since:
-        1729791296
+        1742341092
      values.accessControl.roles.ADMIN_ROLE.members.1.executionDelay:
-        0
+        604800
      values.accessControl.roles.ADMIN_ROLE.members.0.member:
-        "0x28fC10E12A78f986c78F973Fc70ED88072b34c8e"
+        "0x2e2B1c42E38f5af81771e65D87729E57ABD1337a"
      values.accessControl.roles.ADMIN_ROLE.members.0.since:
-        1742341092
+        1742514140
      values.accessControl.roles.ADMIN_ROLE.members.0.executionDelay:
-        604800
+        950400
      values.accessControl.roles.SECURITY_COUNCIL_ROLE.members.0.since:
-        1739472657
+        1742427194
      values.accessControl.roles.SECURITY_COUNCIL_ROLE.members.0.executionDelay:
-        604800
+        950400
      values.accessControl.targets.0x8a4720488CA32f1223ccFE5A087e250fE3BC5D75.adminDelay:
-        604800
+        950400
      values.accessControl.targets.0x5A2b641b84b0230C8e75F55d5afd27f4Dbd59d5b.adminDelay:
-        604800
+        950400
      values.accessControl.targets.0xf369f78E3A0492CC4e96a90dae0728A38498e9c7.adminDelay:
-        604800
+        950400
+++ description: Current execution delay for target calls.
+++ severity: HIGH
      values.edKintoAdminMultisigADMIN:
-        0
+        950400
+++ description: Current execution delay for target calls.
+++ severity: HIGH
      values.edScSECURITY_COUNCIL:
-        604800
+        950400
+++ description: List of scheduled operations.
+++ severity: HIGH
      values.OperationScheduled.0:
+        {"operationId":"0x0ad95e032eb7beede43f2741b7bcef6566a6163eaa1ac1ef42441f25193096d8","nonce":1,"schedule":1743464541,"caller":"0x2e2B1c42E38f5af81771e65D87729E57ABD1337a","target":"0xacC000818e5Bbd911D5d449aA81CB5cA24024739","data":"0x25c471a0000000000000000000000000000000000000000000000000783b0946b8c9d2e30000000000000000000000002e2b1c42e38f5af81771e65d87729e57abd1337a00000000000000000000000000000000000000000000000000000000000e8080"}
+++ description: List of roles granted to accounts.
      values.RolesGranted.0.2:
+        {"account":"0x2e2B1c42E38f5af81771e65D87729E57ABD1337a","delay":0,"since":1729791296,"newMember":true}
      values.RolesGranted.0.1.delay:
-        0
+        950400
      values.RolesGranted.0.1.since:
-        1729791296
+        1742514140
      values.RolesGranted.0.1.newMember:
-        true
+        false
+++ description: List of roles granted to accounts.
      values.RolesGranted.14661544942390944024.1:
+        {"account":"0x28fC10E12A78f986c78F973Fc70ED88072b34c8e","delay":950400,"since":1742427194,"newMember":false}
      values.TargetAdminDelayUpdated.0x8a4720488CA32f1223ccFE5A087e250fE3BC5D75.delay:
-        604800
+        950400
      values.TargetAdminDelayUpdated.0x8a4720488CA32f1223ccFE5A087e250fE3BC5D75.since:
-        1733613166
+        1742859194
      values.TargetAdminDelayUpdated.0xf369f78E3A0492CC4e96a90dae0728A38498e9c7.delay:
-        604800
+        950400
      values.TargetAdminDelayUpdated.0xf369f78E3A0492CC4e96a90dae0728A38498e9c7.since:
-        1739904656
+        1742859192
      values.TargetAdminDelayUpdated.0x5A2b641b84b0230C8e75F55d5afd27f4Dbd59d5b.delay:
-        604800
+        950400
      values.TargetAdminDelayUpdated.0x5A2b641b84b0230C8e75F55d5afd27f4Dbd59d5b.since:
-        1742772894
+        1742859193
    }
```

```diff
    contract KintoID (0xf369f78E3A0492CC4e96a90dae0728A38498e9c7) {
    +++ description: Manages Kinto's KYC system: The KYC_PROVIDER roles responsible for managing the KYC status and KYC metadata of user wallets. Each KintoWallet checks the KYC status of its user in this contract as part of the signature check.
      issuedPermissions.10:
-        {"permission":"upgrade","to":"0xacC000818e5Bbd911D5d449aA81CB5cA24024739","via":[]}
      issuedPermissions.9.permission:
-        "interact"
+        "upgrade"
      issuedPermissions.9.to:
-        "0x6E31039abF8d248aBed57E307C9E1b7530c269E4"
+        "0xacC000818e5Bbd911D5d449aA81CB5cA24024739"
      issuedPermissions.9.description:
-        "manage the KYC status of any user (sanction status and KYC metadata) and mint/burn KintoID NFTs."
      issuedPermissions.8.to:
-        "0xacC000818e5Bbd911D5d449aA81CB5cA24024739"
+        "0x6E31039abF8d248aBed57E307C9E1b7530c269E4"
      issuedPermissions.7.to:
-        "0x6E09F8A68fB5278e0C33D239dC12B2Cec33F4aC7"
+        "0xacC000818e5Bbd911D5d449aA81CB5cA24024739"
      issuedPermissions.6.to:
-        "0xacC000818e5Bbd911D5d449aA81CB5cA24024739"
+        "0x6E09F8A68fB5278e0C33D239dC12B2Cec33F4aC7"
      issuedPermissions.6.description:
-        "permissioned to call `confirmSanction()`, which makes a temporary sanction by a KYC_PROVIDER permanent and does not grant an exit window to the affected wallet."
+        "manage the KYC status of any user (sanction status and KYC metadata) and mint/burn KintoID NFTs."
      issuedPermissions.5.to:
-        "0x6fe642404B7B23F31251103Ca0efb538Ad4aeC07"
+        "0xacC000818e5Bbd911D5d449aA81CB5cA24024739"
      issuedPermissions.5.description:
-        "manage the KYC status of any user (sanction status and KYC metadata) and mint/burn KintoID NFTs."
+        "permissioned to call `confirmSanction()`, which makes a temporary sanction by a KYC_PROVIDER permanent and does not grant an exit window to the affected wallet."
      issuedPermissions.4.to:
-        "0x52F09693c9eEaA93A64BA697e3d3e43a1eB65477"
+        "0x6fe642404B7B23F31251103Ca0efb538Ad4aeC07"
      issuedPermissions.3.to:
-        "0xacC000818e5Bbd911D5d449aA81CB5cA24024739"
+        "0x52F09693c9eEaA93A64BA697e3d3e43a1eB65477"
      issuedPermissions.3.description:
-        "transfer KYC NFTs to a different address."
+        "manage the KYC status of any user (sanction status and KYC metadata) and mint/burn KintoID NFTs."
      issuedPermissions.2.to:
-        "0x2e2B1c42E38f5af81771e65D87729E57ABD1337a"
+        "0xacC000818e5Bbd911D5d449aA81CB5cA24024739"
      issuedPermissions.2.description:
-        "manage the KYC status of any user (sanction status and KYC metadata) and mint/burn KintoID NFTs."
+        "transfer KYC NFTs to a different address."
      issuedPermissions.1.to:
-        "0xb539019776eF803E89EC062Ad54cA24D1Fdb008a"
+        "0x2e2B1c42E38f5af81771e65D87729E57ABD1337a"
      issuedPermissions.0.to:
-        "0x010600ff5f36C8eF3b6Aaf2A88C2DE85C798594a"
+        "0xb539019776eF803E89EC062Ad54cA24D1Fdb008a"
      issuedPermissions.0.description:
-        "permissioned to call `confirmSanction()`, which makes a temporary sanction by a KYC_PROVIDER permanent and does not grant an exit window to the affected wallet."
+        "manage the KYC status of any user (sanction status and KYC metadata) and mint/burn KintoID NFTs."
      values.accessControl.GOVERNANCE_ROLE.members.1:
-        "0x010600ff5f36C8eF3b6Aaf2A88C2DE85C798594a"
+++ severity: HIGH
      values.GOVERNANCErs.1:
-        "0x010600ff5f36C8eF3b6Aaf2A88C2DE85C798594a"
    }
```

## Source code changes

```diff
.../kinto/{.flat@770292 => .flat}/BridgedKinto/BridgedKinto.sol      | 5 ++++-
 1 file changed, 4 insertions(+), 1 deletion(-)
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 770292 (main branch discovery), not current.

```diff
    contract NioGuardians (0x0100005D52Be9ab3ccE0C70Abf6F6FA2C48e91C9) {
    +++ description: Contract using NFTs as voting tokens to be used by Nio Guardians in the NioGovernor.
      category:
+        {"name":"Spam","priority":-1}
    }
```

```diff
    contract NioGovernor (0x010600ff5f36C8eF3b6Aaf2A88C2DE85C798594a) {
    +++ description: Governance contract allowing token- and NFT based voting.
      category:
+        {"name":"Spam","priority":-1}
    }
```

```diff
    contract Faucet (0x0719D47A213149E2Ef8d3f5afDaDA8a8E22dfc03) {
    +++ description: None
      category:
+        {"name":"Spam","priority":-1}
    }
```

```diff
    contract SponsorPaymaster (0x1842a4EFf3eFd24c50B63c3CF89cECEe245Fc2bd) {
    +++ description: Paymaster used for user transactions eligible for sponsorship.
      category:
+        {"name":"Spam","priority":-1}
    }
```

```diff
    contract EntryPoint (0x2843C269D2a64eCfA63548E8B3Fc0FD23B7F70cb) {
    +++ description: Used as entrypoint to transact using smartwallets and UserOps.
      description:
+        "Used as entrypoint to transact using smartwallets and UserOps."
    }
```

```diff
    contract KintoSecurityCouncil_L2Alias (0x28fC10E12A78f986c78F973Fc70ED88072b34c8e) {
    +++ description: None
      receivedPermissions:
+        [{"permission":"interact","from":"0xacC000818e5Bbd911D5d449aA81CB5cA24024739","delay":950400,"description":"upgrade the implementation of the core contracts KintoID, KintoAppRegistry and KintoWalletFactory."},{"permission":"interact","from":"0xacC000818e5Bbd911D5d449aA81CB5cA24024739","delay":604800,"description":"manage the whitelisted addresses in the KintoAppRegistry which affects censorship on the entire rollup."},{"permission":"interact","from":"0xacC000818e5Bbd911D5d449aA81CB5cA24024739","delay":604800,"description":"change the configuration of all AccessManager permissions. The total delay can depend on the target of the configuration."}]
    }
```

```diff
    contract KintoAdminMultisig (0x2e2B1c42E38f5af81771e65D87729E57ABD1337a) {
    +++ description: None
      issuedPermissions:
-        [{"permission":"upgrade","to":"0x8a4720488CA32f1223ccFE5A087e250fE3BC5D75","via":[]}]
      receivedPermissions.5:
+        {"permission":"interact","from":"0xacC000818e5Bbd911D5d449aA81CB5cA24024739","description":"change the configuration of all AccessManager permissions. The total delay can depend on the target of the configuration."}
      receivedPermissions.4:
+        {"permission":"upgrade","from":"0x0719D47A213149E2Ef8d3f5afDaDA8a8E22dfc03"}
      receivedPermissions.3.from:
-        "0x0719D47A213149E2Ef8d3f5afDaDA8a8E22dfc03"
+        "0x1842a4EFf3eFd24c50B63c3CF89cECEe245Fc2bd"
      receivedPermissions.2.permission:
-        "upgrade"
+        "interact"
      receivedPermissions.2.from:
-        "0x1842a4EFf3eFd24c50B63c3CF89cECEe245Fc2bd"
+        "0x0100005D52Be9ab3ccE0C70Abf6F6FA2C48e91C9"
      receivedPermissions.2.description:
+        "mint Nio Guardian NFTs to any address, inheriting the permissions of the NFT."
      receivedPermissions.1.from:
-        "0x0100005D52Be9ab3ccE0C70Abf6F6FA2C48e91C9"
+        "0xf369f78E3A0492CC4e96a90dae0728A38498e9c7"
      receivedPermissions.1.description:
-        "mint Nio Guardian NFTs to any address, inheriting the permissions of the NFT."
+        "manage the KYC status of any user (sanction status and KYC metadata) and mint/burn KintoID NFTs."
      receivedPermissions.0.from:
-        "0xf369f78E3A0492CC4e96a90dae0728A38498e9c7"
+        "0xacC000818e5Bbd911D5d449aA81CB5cA24024739"
      receivedPermissions.0.description:
-        "manage the KYC status of any user (sanction status and KYC metadata) and mint/burn KintoID NFTs."
+        "upgrade the implementation of the core contracts KintoID, KintoAppRegistry and KintoWalletFactory."
      receivedPermissions.0.delay:
+        604800
    }
```

```diff
-   Status: DELETED
    contract L2GatewayRouter (0x340487b92808B84c2bd97C87B590EE81267E04a7)
    +++ description: None
```

```diff
    contract Socket (0x3e9727470C66B1e77034590926CDe0242B5A3dCc) {
    +++ description: Central contract for bridging via the external socket bridge.
      description:
+        "Central contract for bridging via the external socket bridge."
      category:
+        {"name":"External Bridges","priority":1}
    }
```

```diff
    contract KintoAppRegistry (0x5A2b641b84b0230C8e75F55d5afd27f4Dbd59d5b) {
    +++ description: Central system contract defining addresses that are allowed to be called by EOAs. The modified Kinto node reads this configuration and drops all other transactions from EOAs (enforced by a modified state transition function). As a result, users can only transact using a canonical smart wallet.
      description:
-        "Central system contract defining addresses that are allowed to be called by EOAs. The modified Kinto node reads this configuration and drops all other transactions from EOAs (enforced by a modified state transition function). Accordingly, users can only transact from their smart wallets."
+        "Central system contract defining addresses that are allowed to be called by EOAs. The modified Kinto node reads this configuration and drops all other transactions from EOAs (enforced by a modified state transition function). As a result, users can only transact using a canonical smart wallet."
      fieldMeta.getSystemContracts.description:
-        "Contracts that are exempt from the STF-enforced rule that EOAs cannot call contracts. Must include ArbSys `0x0000000000000000000000000000000000000064` for ETH withdrawals from an EOA."
+        "Target contracts that are exempt from the STF-enforced rule that EOAs cannot make transactions. Must include ArbRetryableTx `0x000000000000000000000000000000000000006E`, EntryPoint `0x2843C269D2a64eCfA63548E8B3Fc0FD23B7F70cb`, ArbSys `0x0000000000000000000000000000000000000064`."
      category:
+        {"name":"Local Infrastructure","priority":5}
    }
```

```diff
    contract Treasury (0x793500709506652Fcc61F0d2D0fDa605638D4293) {
    +++ description: Kinto Treasury.
      category:
+        {"name":"Spam","priority":-1}
    }
```

```diff
-   Status: DELETED
    contract  (0x87799989341A07F495287B1433eea98398FD73aA)
    +++ description: None
```

```diff
    contract BeaconKintoWallet (0x87f0eE85bF3198654900a422832157abBba30828) {
    +++ description: Beacon proxy for the KintoWallet smartwallet implementation that is used for all users.
      description:
+        "Beacon proxy for the KintoWallet smartwallet implementation that is used for all users."
    }
```

```diff
-   Status: DELETED
    contract  (0x88e03D41a6EAA9A0B93B0e2d6F1B34619cC4319b)
    +++ description: None
```

```diff
    contract KintoWalletFactory (0x8a4720488CA32f1223ccFE5A087e250fE3BC5D75) {
    +++ description: Deploys new KintoWallet smartwallets for users upon passing KYC checks. Also manages the beacon implementation for all KintoWallets and their recovery logic. KintoWallets can be funded with ETH via this contract.
      description:
-        "Deploys new KintoWallet beacon proxies when users create a wallet. Also manages the beacon implementation for all KintoWallets and their recovery logic."
+        "Deploys new KintoWallet smartwallets for users upon passing KYC checks. Also manages the beacon implementation for all KintoWallets and their recovery logic. KintoWallets can be funded with ETH via this contract."
      receivedPermissions:
-        [{"permission":"upgrade","from":"0x2e2B1c42E38f5af81771e65D87729E57ABD1337a"}]
      directlyReceivedPermissions:
+        [{"permission":"upgrade","from":"0x2e2B1c42E38f5af81771e65D87729E57ABD1337a"}]
      category:
+        {"name":"Local Infrastructure","priority":5}
    }
```

```diff
    contract BundleBulker (0x8d2D899402ed84b6c0510bB1ad34ee436ADDD20d) {
    +++ description: None
      category:
+        {"name":"Spam","priority":-1}
    }
```

```diff
-   Status: DELETED
    contract ProxyAdmin (0x9eC0253E4174a14C0536261888416451A407Bf79)
    +++ description: None
```

```diff
    contract AccessManager (0xacC000818e5Bbd911D5d449aA81CB5cA24024739) {
    +++ description: Standard OpenZeppelin AccessManager contract: Serves as a proxy contract defining the roles, permissions and delays to call functions in target contracts.
      description:
-        "Standard OpenZeppelin AccessManager: Serves as a proxy contract defining the roles, permissions and delays to call functions in target contracts."
+        "Standard OpenZeppelin AccessManager contract: Serves as a proxy contract defining the roles, permissions and delays to call functions in target contracts."
+++ description: Current execution delay for target calls.
+++ severity: HIGH
      values.edKintoAdminMultisigADMIN:
+        0
+++ description: Current execution delay for target calls.
+++ severity: HIGH
      values.edKintoAdminMultisigUPGRADER:
+        604800
+++ description: Current execution delay for target calls.
+++ severity: HIGH
      values.edScADMIN:
+        604800
+++ description: Current execution delay for target calls.
+++ severity: HIGH
      values.edScSECURITY_COUNCIL:
+        604800
+++ description: Current execution delay for target calls.
+++ severity: HIGH
      values.edScUPGRADER:
+        950400
      values.kintoAdminMultisigPermission:
+        "0x2e2B1c42E38f5af81771e65D87729E57ABD1337a"
      values.securityCouncilPermission:
+        "0x28fC10E12A78f986c78F973Fc70ED88072b34c8e"
+++ description: CURRENT target admin delay, the access control handler shows the pending delay. Delays all config changes/additions in the AccessManager that affect this target. Must be >= 11d.
+++ severity: HIGH
      values.tadKintoAppRegistry:
+        0
+++ description: CURRENT target admin delay, the access control handler shows the pending delay. Delays all config changes/additions in the AccessManager that affect this target. Must be >= 11d.
+++ severity: HIGH
      values.tadKintoID:
+        604800
+++ description: CURRENT target admin delay, the access control handler shows the pending delay. Delays all config changes/additions in the AccessManager that affect this target. Must be >= 11d.
+++ severity: HIGH
      values.tadKintoWalletFactory:
+        604800
      fieldMeta.tadKintoWalletFactory:
+        {"severity":"HIGH","description":"CURRENT target admin delay, the access control handler shows the pending delay. Delays all config changes/additions in the AccessManager that affect this target. Must be >= 11d."}
      fieldMeta.tadKintoAppRegistry:
+        {"severity":"HIGH","description":"CURRENT target admin delay, the access control handler shows the pending delay. Delays all config changes/additions in the AccessManager that affect this target. Must be >= 11d."}
      fieldMeta.tadKintoID:
+        {"severity":"HIGH","description":"CURRENT target admin delay, the access control handler shows the pending delay. Delays all config changes/additions in the AccessManager that affect this target. Must be >= 11d."}
      fieldMeta.edKintoAdminMultisigUPGRADER:
+        {"severity":"HIGH","description":"Current execution delay for target calls."}
      fieldMeta.edKintoAdminMultisigADMIN:
+        {"severity":"HIGH","description":"Current execution delay for target calls."}
      fieldMeta.edScADMIN:
+        {"severity":"HIGH","description":"Current execution delay for target calls."}
      fieldMeta.edScUPGRADER:
+        {"severity":"HIGH","description":"Current execution delay for target calls."}
      fieldMeta.edScSECURITY_COUNCIL:
+        {"severity":"HIGH","description":"Current execution delay for target calls."}
      issuedPermissions:
+        [{"permission":"interact","to":"0x28fC10E12A78f986c78F973Fc70ED88072b34c8e","delay":950400,"description":"upgrade the implementation of the core contracts KintoID, KintoAppRegistry and KintoWalletFactory.","via":[]},{"permission":"interact","to":"0x2e2B1c42E38f5af81771e65D87729E57ABD1337a","delay":604800,"description":"upgrade the implementation of the core contracts KintoID, KintoAppRegistry and KintoWalletFactory.","via":[]},{"permission":"interact","to":"0x28fC10E12A78f986c78F973Fc70ED88072b34c8e","delay":604800,"description":"manage the whitelisted addresses in the KintoAppRegistry which affects censorship on the entire rollup.","via":[]},{"permission":"interact","to":"0x28fC10E12A78f986c78F973Fc70ED88072b34c8e","delay":604800,"description":"change the configuration of all AccessManager permissions. The total delay can depend on the target of the configuration.","via":[]},{"permission":"interact","to":"0x2e2B1c42E38f5af81771e65D87729E57ABD1337a","description":"change the configuration of all AccessManager permissions. The total delay can depend on the target of the configuration.","via":[]}]
      category:
+        {"name":"Governance","priority":3}
    }
```

```diff
    contract RewardsDistributor (0xD157904639E89df05e89e0DabeEC99aE3d74F9AA) {
    +++ description: None
      category:
+        {"name":"Spam","priority":-1}
    }
```

```diff
    contract KintoID (0xf369f78E3A0492CC4e96a90dae0728A38498e9c7) {
    +++ description: Manages Kinto's KYC system: The KYC_PROVIDER roles responsible for managing the KYC status and KYC metadata of user wallets. Each KintoWallet checks the KYC status of its user in this contract as part of the signature check.
      description:
-        "Manages Kinto's KYC system: The KYC_PROVIDER roles responsible for the KYC status and KYC metadata of user wallets."
+        "Manages Kinto's KYC system: The KYC_PROVIDER roles responsible for managing the KYC status and KYC metadata of user wallets. Each KintoWallet checks the KYC status of its user in this contract as part of the signature check."
      values.ownerOf:
-        ["0x660ad4B5A74130a4796B4d54BC6750Ae93C86e6c","0x0C1df30B4576A1A94D9528854516D4d425Cf9323","0x70E218164e6A59AE756107D0D6eC2c498110Bc2E"]
      category:
+        {"name":"Local Infrastructure","priority":5}
    }
```

Generated with discovered.json: 0xc5ef443f6f124d5cf1f9731e023d2edb89bfe916

# Diff at Wed, 19 Mar 2025 15:45:47 GMT:

- chain: kinto
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@4609d8355d7594946b66bef47876090fce6b0842 block: 769390
- current block number: 770292

## Description

Kinto gov update (copypasting from telegram):

KintoAdminMultisig (0x2e2B1c42E38f5af81771e65D87729E57ABD1337a):
roles held:
  ADMIN_ROLE: executionDelay: 0
  UPGRADER_ROLE: executionDelay: 604800 (7d)

SC-L2Alias (0x28fC10E12A78f986c78F973Fc70ED88072b34c8e):
roles held:
  ADMIN_ROLE: executionDelay: 604800 (7d)
  UPGRADER_ROLE: executionDelay: 950400 (11d)
  SECURITY_COUNCIL_ROLE: executionDelay: 604800 (7d)

targets:

KintoWalletFactory (0x8a4720488CA32f1223ccFE5A087e250fE3BC5D75):
targetAdminDelay: 604800 (7d)
roles: UPGRADER_ROLE (upgradeAllWalletImplementations(address), upgradeTo(address))

KintoID (0xf369f78E3A0492CC4e96a90dae0728A38498e9c7):
targetAdminDelay: 604800 (7d)
roles: UPGRADER_ROLE (upgradeTo(address))

KintoAppRegistry (0x5A2b641b84b0230C8e75F55d5afd27f4Dbd59d5b):
targetAdminDelay: 604800 (7d)
roles: 
  UPGRADER_ROLE (upgradeTo(address))
  SECURITY_COUNCIL_ROLE (updateSystemApps(address[]), updateSystemContracts(address[]), updateReservedContracts(address[]))

i found the following in the current deployment/config:

KintoID: GOVERNANCE_ROLE is held by the NioGovernor (only SecurityCouncil should be able to confirmSanction())

AccessManager: 
here i am assuming the KintoAdminMultisig will be removed? (see above, it could also be used with a min execution delay of 11d for its currently held 2 roles).

apart from that, the delay is still 7d for all targetAdminDelays and some executionDelays. the proposed solution here is to use a unified 11d or more for all of them, since the function selectors covered in the AccessManager are all either upgrades or touching the state transition function / KYC.

## Watched changes

```diff
    contract KintoAdminMultisig (0x2e2B1c42E38f5af81771e65D87729E57ABD1337a) {
    +++ description: None
      receivedPermissions.6:
-        {"permission":"upgrade","from":"0x0719D47A213149E2Ef8d3f5afDaDA8a8E22dfc03"}
      receivedPermissions.5:
-        {"permission":"upgrade","from":"0x1842a4EFf3eFd24c50B63c3CF89cECEe245Fc2bd"}
      receivedPermissions.4:
-        {"permission":"interact","from":"0x0100005D52Be9ab3ccE0C70Abf6F6FA2C48e91C9","description":"mint Nio Guardian NFTs to any address, inheriting the permissions of the NFT."}
      receivedPermissions.3.from:
-        "0xf369f78E3A0492CC4e96a90dae0728A38498e9c7"
+        "0x0719D47A213149E2Ef8d3f5afDaDA8a8E22dfc03"
      receivedPermissions.2.permission:
-        "interact"
+        "upgrade"
      receivedPermissions.2.from:
-        "0xf369f78E3A0492CC4e96a90dae0728A38498e9c7"
+        "0x1842a4EFf3eFd24c50B63c3CF89cECEe245Fc2bd"
      receivedPermissions.2.description:
-        "manage the KYC status of any user (sanction status and KYC metadata) and mint/burn KintoID NFTs."
      receivedPermissions.1.from:
-        "0xf369f78E3A0492CC4e96a90dae0728A38498e9c7"
+        "0x0100005D52Be9ab3ccE0C70Abf6F6FA2C48e91C9"
      receivedPermissions.1.description:
-        "permissioned to call `confirmSanction()`, which makes a temporary sanction by a KYC_PROVIDER permanent and does not grant an exit window to the affected wallet."
+        "mint Nio Guardian NFTs to any address, inheriting the permissions of the NFT."
      receivedPermissions.0.description:
-        "transfer KYC NFTs to a different address."
+        "manage the KYC status of any user (sanction status and KYC metadata) and mint/burn KintoID NFTs."
    }
```

```diff
    contract AccessManager (0xacC000818e5Bbd911D5d449aA81CB5cA24024739) {
    +++ description: Standard OpenZeppelin AccessManager: Serves as a proxy contract defining the roles, permissions and delays to call functions in target contracts.
      values.accessControl.roles.ADMIN_ROLE.members.1:
+        {"member":"0x2e2B1c42E38f5af81771e65D87729E57ABD1337a","since":1729791296,"executionDelay":0}
      values.accessControl.roles.ADMIN_ROLE.members.0.member:
-        "0x2e2B1c42E38f5af81771e65D87729E57ABD1337a"
+        "0x28fC10E12A78f986c78F973Fc70ED88072b34c8e"
      values.accessControl.roles.ADMIN_ROLE.members.0.since:
-        1729791296
+        1742341092
      values.accessControl.roles.ADMIN_ROLE.members.0.executionDelay:
-        0
+        604800
      values.accessControl.roles.UPGRADER_ROLE.members.1.member:
-        "0x28fC10E12A78f986c78F973Fc70ED88072b34c8e"
+        "0x2e2B1c42E38f5af81771e65D87729E57ABD1337a"
      values.accessControl.roles.UPGRADER_ROLE.members.1.since:
-        1740077455
+        1733181166
      values.accessControl.roles.UPGRADER_ROLE.members.0.member:
-        "0x2e2B1c42E38f5af81771e65D87729E57ABD1337a"
+        "0x28fC10E12A78f986c78F973Fc70ED88072b34c8e"
      values.accessControl.roles.UPGRADER_ROLE.members.0.since:
-        1733181166
+        1742340846
      values.accessControl.roles.UPGRADER_ROLE.members.0.executionDelay:
-        604800
+        950400
      values.accessControl.targets.0x5A2b641b84b0230C8e75F55d5afd27f4Dbd59d5b.adminDelay:
+        604800
+++ description: List of roles granted to accounts.
      values.RolesGranted.0.1:
+        {"account":"0x2e2B1c42E38f5af81771e65D87729E57ABD1337a","delay":0,"since":1729791296,"newMember":true}
      values.RolesGranted.0.0.account:
-        "0x2e2B1c42E38f5af81771e65D87729E57ABD1337a"
+        "0x28fC10E12A78f986c78F973Fc70ED88072b34c8e"
      values.RolesGranted.0.0.delay:
-        0
+        604800
      values.RolesGranted.0.0.since:
-        1729791296
+        1742341092
+++ description: List of roles granted to accounts.
      values.RolesGranted.8663528507529876195.2:
+        {"account":"0x28fC10E12A78f986c78F973Fc70ED88072b34c8e","delay":950400,"since":1742340846,"newMember":false}
      values.TargetAdminDelayUpdated.0x5A2b641b84b0230C8e75F55d5afd27f4Dbd59d5b:
+        {"delay":604800,"since":1742772894}
    }
```

```diff
    contract KintoID (0xf369f78E3A0492CC4e96a90dae0728A38498e9c7) {
    +++ description: Manages Kinto's KYC system: The KYC_PROVIDER roles responsible for the KYC status and KYC metadata of user wallets.
      issuedPermissions.13:
-        {"permission":"upgrade","to":"0xacC000818e5Bbd911D5d449aA81CB5cA24024739","via":[]}
      issuedPermissions.12:
-        {"permission":"interact","to":"0x6E31039abF8d248aBed57E307C9E1b7530c269E4","description":"manage the KYC status of any user (sanction status and KYC metadata) and mint/burn KintoID NFTs.","via":[]}
      issuedPermissions.11:
-        {"permission":"interact","to":"0xacC000818e5Bbd911D5d449aA81CB5cA24024739","description":"manage the KYC status of any user (sanction status and KYC metadata) and mint/burn KintoID NFTs.","via":[]}
      issuedPermissions.10.permission:
-        "interact"
+        "upgrade"
      issuedPermissions.10.to:
-        "0x6E09F8A68fB5278e0C33D239dC12B2Cec33F4aC7"
+        "0xacC000818e5Bbd911D5d449aA81CB5cA24024739"
      issuedPermissions.10.description:
-        "manage the KYC status of any user (sanction status and KYC metadata) and mint/burn KintoID NFTs."
      issuedPermissions.9.to:
-        "0xacC000818e5Bbd911D5d449aA81CB5cA24024739"
+        "0x6E31039abF8d248aBed57E307C9E1b7530c269E4"
      issuedPermissions.9.description:
-        "permissioned to call `confirmSanction()`, which makes a temporary sanction by a KYC_PROVIDER permanent and does not grant an exit window to the affected wallet."
+        "manage the KYC status of any user (sanction status and KYC metadata) and mint/burn KintoID NFTs."
      issuedPermissions.8.to:
-        "0x6fe642404B7B23F31251103Ca0efb538Ad4aeC07"
+        "0xacC000818e5Bbd911D5d449aA81CB5cA24024739"
      issuedPermissions.7.permission:
-        "upgrade"
+        "interact"
      issuedPermissions.7.to:
-        "0x2e2B1c42E38f5af81771e65D87729E57ABD1337a"
+        "0x6E09F8A68fB5278e0C33D239dC12B2Cec33F4aC7"
      issuedPermissions.7.description:
+        "manage the KYC status of any user (sanction status and KYC metadata) and mint/burn KintoID NFTs."
      issuedPermissions.6.to:
-        "0x52F09693c9eEaA93A64BA697e3d3e43a1eB65477"
+        "0xacC000818e5Bbd911D5d449aA81CB5cA24024739"
      issuedPermissions.6.description:
-        "manage the KYC status of any user (sanction status and KYC metadata) and mint/burn KintoID NFTs."
+        "permissioned to call `confirmSanction()`, which makes a temporary sanction by a KYC_PROVIDER permanent and does not grant an exit window to the affected wallet."
      issuedPermissions.5.to:
-        "0xacC000818e5Bbd911D5d449aA81CB5cA24024739"
+        "0x6fe642404B7B23F31251103Ca0efb538Ad4aeC07"
      issuedPermissions.5.description:
-        "transfer KYC NFTs to a different address."
+        "manage the KYC status of any user (sanction status and KYC metadata) and mint/burn KintoID NFTs."
      issuedPermissions.4.to:
-        "0x2e2B1c42E38f5af81771e65D87729E57ABD1337a"
+        "0x52F09693c9eEaA93A64BA697e3d3e43a1eB65477"
      issuedPermissions.3.to:
-        "0x2e2B1c42E38f5af81771e65D87729E57ABD1337a"
+        "0xacC000818e5Bbd911D5d449aA81CB5cA24024739"
      issuedPermissions.3.description:
-        "permissioned to call `confirmSanction()`, which makes a temporary sanction by a KYC_PROVIDER permanent and does not grant an exit window to the affected wallet."
+        "transfer KYC NFTs to a different address."
      issuedPermissions.2.to:
-        "0xb539019776eF803E89EC062Ad54cA24D1Fdb008a"
+        "0x2e2B1c42E38f5af81771e65D87729E57ABD1337a"
      issuedPermissions.1.to:
-        "0x010600ff5f36C8eF3b6Aaf2A88C2DE85C798594a"
+        "0xb539019776eF803E89EC062Ad54cA24D1Fdb008a"
      issuedPermissions.1.description:
-        "permissioned to call `confirmSanction()`, which makes a temporary sanction by a KYC_PROVIDER permanent and does not grant an exit window to the affected wallet."
+        "manage the KYC status of any user (sanction status and KYC metadata) and mint/burn KintoID NFTs."
      issuedPermissions.0.to:
-        "0x2e2B1c42E38f5af81771e65D87729E57ABD1337a"
+        "0x010600ff5f36C8eF3b6Aaf2A88C2DE85C798594a"
      issuedPermissions.0.description:
-        "transfer KYC NFTs to a different address."
+        "permissioned to call `confirmSanction()`, which makes a temporary sanction by a KYC_PROVIDER permanent and does not grant an exit window to the affected wallet."
      values.accessControl.DEFAULT_ADMIN_ROLE.members.1:
-        "0x2e2B1c42E38f5af81771e65D87729E57ABD1337a"
      values.accessControl.UPGRADER_ROLE.members.1:
-        "0x2e2B1c42E38f5af81771e65D87729E57ABD1337a"
      values.accessControl.GOVERNANCE_ROLE.members.2:
-        "0x2e2B1c42E38f5af81771e65D87729E57ABD1337a"
+++ severity: HIGH
      values.DEFAULT_ADMINs.1:
-        "0x2e2B1c42E38f5af81771e65D87729E57ABD1337a"
+++ severity: HIGH
      values.GOVERNANCErs.2:
-        "0x2e2B1c42E38f5af81771e65D87729E57ABD1337a"
+++ severity: HIGH
      values.UPGRADERs.1:
-        "0x2e2B1c42E38f5af81771e65D87729E57ABD1337a"
    }
```

Generated with discovered.json: 0x93bc9a372f00118ecee5260dfc00aad81444ff2b

# Diff at Wed, 19 Mar 2025 13:06:34 GMT:

- chain: kinto
- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@e950b6e93c84855ee2ec1740913b7b4c994b9ae2 block: 769390
- current block number: 769390

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 769390 (main branch discovery), not current.

```diff
    contract NioGovernor (0x010600ff5f36C8eF3b6Aaf2A88C2DE85C798594a) {
    +++ description: Governance contract allowing token- and NFT based voting.
      severity:
-        "HIGH"
    }
```

```diff
    contract KintoAdminMultisig (0x2e2B1c42E38f5af81771e65D87729E57ABD1337a) {
    +++ description: None
      severity:
-        "HIGH"
    }
```

```diff
    contract undefined (0x52F09693c9eEaA93A64BA697e3d3e43a1eB65477) {
    +++ description: None
      severity:
-        "MEDIUM"
    }
```

```diff
    contract undefined (0x6E09F8A68fB5278e0C33D239dC12B2Cec33F4aC7) {
    +++ description: None
      severity:
-        "MEDIUM"
    }
```

```diff
    contract undefined (0x6E31039abF8d248aBed57E307C9E1b7530c269E4) {
    +++ description: None
      severity:
-        "MEDIUM"
    }
```

```diff
    contract undefined (0x6fe642404B7B23F31251103Ca0efb538Ad4aeC07) {
    +++ description: None
      severity:
-        "MEDIUM"
    }
```

```diff
    contract AccessManager (0xacC000818e5Bbd911D5d449aA81CB5cA24024739) {
    +++ description: Standard OpenZeppelin AccessManager: Serves as a proxy contract defining the roles, permissions and delays to call functions in target contracts.
      severity:
-        "HIGH"
    }
```

```diff
    contract undefined (0xb539019776eF803E89EC062Ad54cA24D1Fdb008a) {
    +++ description: None
      severity:
-        "MEDIUM"
    }
```

Generated with discovered.json: 0x50b69d2756ef7f139a84961b247f987eef8aa556

# Diff at Tue, 18 Mar 2025 10:34:03 GMT:

- chain: kinto
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@8a389387016e20fe96cd5cb775e4b943b3aaa832 block: 763803
- current block number: 769390

## Description

New pending sanction (looks like a user that has not used their account in ~1y). Not confirmed yet by the SC.

## Watched changes

```diff
    contract KintoID (0xf369f78E3A0492CC4e96a90dae0728A38498e9c7) {
    +++ description: Manages Kinto's KYC system: The KYC_PROVIDER roles responsible for the KYC status and KYC metadata of user wallets.
+++ description: addresses sanctioned by any KYC_PROVIDER role.
      values.pendingSanctions.94:
+        {"_to":"0x19CC0e919b58e0d0eF7BaeBb103f72dee1031978","_timestamp":1706580004}
      values.pendingSanctions.93._to:
-        "0x19CC0e919b58e0d0eF7BaeBb103f72dee1031978"
+        "0x467Fa5244cd8386581635646F12E13C05Ad0f41F"
      values.pendingSanctions.93._timestamp:
-        1706580004
+        1718846703
      values.pendingSanctions.92._to:
-        "0x467Fa5244cd8386581635646F12E13C05Ad0f41F"
+        "0x3CfA8C0e6eEb1e601f76355A82f583232b186a7D"
      values.pendingSanctions.92._timestamp:
-        1718846703
+        1706580004
      values.pendingSanctions.91._to:
-        "0x3CfA8C0e6eEb1e601f76355A82f583232b186a7D"
+        "0x275edFf82EB0c3845edaBa411D7A5bE31486C2B6"
      values.pendingSanctions.91._timestamp:
-        1706580004
+        1710367221
      values.pendingSanctions.90._to:
-        "0x275edFf82EB0c3845edaBa411D7A5bE31486C2B6"
+        "0xBD85550C39dE4844E501A278D6b632FbE68cF70F"
      values.pendingSanctions.90._timestamp:
-        1710367221
+        1716580853
      values.pendingSanctions.89._to:
-        "0xBD85550C39dE4844E501A278D6b632FbE68cF70F"
+        "0x504a1ef47bF87a550bebfBA6ffe58a3a57bADeB7"
      values.pendingSanctions.89._timestamp:
-        1716580853
+        1707652818
      values.pendingSanctions.88._to:
-        "0x504a1ef47bF87a550bebfBA6ffe58a3a57bADeB7"
+        "0x9E292AFD2492f4ecBA6c1eb8B73BC87A5650eB8F"
      values.pendingSanctions.88._timestamp:
-        1707652818
+        1718846645
      values.pendingSanctions.87._to:
-        "0x9E292AFD2492f4ecBA6c1eb8B73BC87A5650eB8F"
+        "0xE65a2Dee17190786c76f83e36F489a085690686C"
      values.pendingSanctions.87._timestamp:
-        1718846645
+        1707840030
      values.pendingSanctions.86._to:
-        "0xE65a2Dee17190786c76f83e36F489a085690686C"
+        "0xbf3fBce48ff8a49918dD8578290814ea466aB79F"
      values.pendingSanctions.86._timestamp:
-        1707840030
+        1718846587
      values.pendingSanctions.85._to:
-        "0xbf3fBce48ff8a49918dD8578290814ea466aB79F"
+        "0x81bb2B25eA1A01BADA25d41C67A34d81C9684712"
      values.pendingSanctions.85._timestamp:
-        1718846587
+        1718846645
      values.pendingSanctions.84._to:
-        "0x81bb2B25eA1A01BADA25d41C67A34d81C9684712"
+        "0xcD984AD7eBB2ab7B2aE0afd967F371c6E24a4Bc6"
      values.pendingSanctions.84._timestamp:
-        1718846645
+        1718846587
      values.pendingSanctions.83._to:
-        "0xcD984AD7eBB2ab7B2aE0afd967F371c6E24a4Bc6"
+        "0x99758a8519691B6bffEeD3976080c943634B7364"
      values.pendingSanctions.83._timestamp:
-        1718846587
+        1718846645
      values.pendingSanctions.82._to:
-        "0x99758a8519691B6bffEeD3976080c943634B7364"
+        "0x1075d13CE70F8F4eB840c4c264b6c84C2CD4E785"
      values.pendingSanctions.82._timestamp:
-        1718846645
+        1708034428
      values.pendingSanctions.81._to:
-        "0x1075d13CE70F8F4eB840c4c264b6c84C2CD4E785"
+        "0xC44F5CA2F187D5ece6864b8a31174C36dEFdC29c"
      values.pendingSanctions.81._timestamp:
-        1708034428
+        1706139865
      values.pendingSanctions.80._to:
-        "0xC44F5CA2F187D5ece6864b8a31174C36dEFdC29c"
+        "0xC10730513A843fa0E2Fc223eC2AE3B6d3d002294"
      values.pendingSanctions.80._timestamp:
-        1706139865
+        1719715565
      values.pendingSanctions.79._to:
-        "0xC10730513A843fa0E2Fc223eC2AE3B6d3d002294"
+        "0x505D435C8B66a7511dbec7f3C8DA6F1e67D50dDA"
      values.pendingSanctions.79._timestamp:
-        1719715565
+        1706148032
      values.pendingSanctions.78._to:
-        "0x505D435C8B66a7511dbec7f3C8DA6F1e67D50dDA"
+        "0x01e523cC67e5d3459bE930837d89bccEA85Fd1DC"
      values.pendingSanctions.78._timestamp:
-        1706148032
+        1719715623
      values.pendingSanctions.77._to:
-        "0x01e523cC67e5d3459bE930837d89bccEA85Fd1DC"
+        "0x5579CA784CdC93776b9c030618548f1317AB4c39"
      values.pendingSanctions.77._timestamp:
-        1719715623
+        1706148032
      values.pendingSanctions.76._to:
-        "0x5579CA784CdC93776b9c030618548f1317AB4c39"
+        "0x75D9312845d38764229455Ea8d526A122b37768D"
      values.pendingSanctions.76._timestamp:
-        1706148032
+        1719718623
      values.pendingSanctions.75._to:
-        "0x75D9312845d38764229455Ea8d526A122b37768D"
+        "0xe12BcEe0219f3c80FFF8C271D29e343bA42B814d"
      values.pendingSanctions.75._timestamp:
-        1719718623
+        1707483639
      values.pendingSanctions.74._to:
-        "0xe12BcEe0219f3c80FFF8C271D29e343bA42B814d"
+        "0x933b0f5e531648Bef764b58Ff7782AfB13AB06D0"
      values.pendingSanctions.74._timestamp:
-        1707483639
+        1718846703
      values.pendingSanctions.73._to:
-        "0x933b0f5e531648Bef764b58Ff7782AfB13AB06D0"
+        "0x2a14E7B96D2362bdf1Df8C0bB4544714e7601Af0"
      values.pendingSanctions.73._timestamp:
-        1718846703
+        1734246668
      values.pendingSanctions.72._to:
-        "0x2a14E7B96D2362bdf1Df8C0bB4544714e7601Af0"
+        "0x493ff963FAAbbBeDBA2Aa19378bF8d8a0F0e2C5E"
      values.pendingSanctions.72._timestamp:
-        1734246668
+        1718846587
      values.pendingSanctions.71._to:
-        "0x493ff963FAAbbBeDBA2Aa19378bF8d8a0F0e2C5E"
+        "0xA4EcEAB6C954C3b967cF18e947879A6708A96D5e"
      values.pendingSanctions.71._timestamp:
-        1718846587
+        1719715444
      values.pendingSanctions.70._to:
-        "0xA4EcEAB6C954C3b967cF18e947879A6708A96D5e"
+        "0x89F6188006a35b9D0407c37f01FCa27AeD48CA3B"
      values.pendingSanctions.70._timestamp:
-        1719715444
+        1719718683
      values.pendingSanctions.69._to:
-        "0x89F6188006a35b9D0407c37f01FCa27AeD48CA3B"
+        "0x985540465088C9c667690cC17BFf732fC703D2E5"
      values.pendingSanctions.69._timestamp:
-        1719718683
+        1719718623
      values.pendingSanctions.68._to:
-        "0x985540465088C9c667690cC17BFf732fC703D2E5"
+        "0x1f16335Fd1dD3e8DCC8b401f5ae8BA57F8AD76a8"
      values.pendingSanctions.68._timestamp:
-        1719718623
+        1706580004
      values.pendingSanctions.67._to:
-        "0x1f16335Fd1dD3e8DCC8b401f5ae8BA57F8AD76a8"
+        "0x2955ca0D791C30C16e7298B803BB116bED5d7269"
      values.pendingSanctions.66._to:
-        "0x2955ca0D791C30C16e7298B803BB116bED5d7269"
+        "0x6E6E2044A4cfeA057E02d6FB72c33Fc893A9B788"
      values.pendingSanctions.66._timestamp:
-        1706580004
+        1718846703
      values.pendingSanctions.65._to:
-        "0x6E6E2044A4cfeA057E02d6FB72c33Fc893A9B788"
+        "0xf30BF377b3C4ed1f111E6E28CF26003CE5a682Cf"
      values.pendingSanctions.65._timestamp:
-        1718846703
+        1706580004
      values.pendingSanctions.64._to:
-        "0xf30BF377b3C4ed1f111E6E28CF26003CE5a682Cf"
+        "0xE9Cb04a602cAA9D2C649dDE854Ab7389C98CF912"
      values.pendingSanctions.64._timestamp:
-        1706580004
+        1706139865
      values.pendingSanctions.63._to:
-        "0xE9Cb04a602cAA9D2C649dDE854Ab7389C98CF912"
+        "0x45Ace2D41040B7267a465A4dF8733F3327EEFBb5"
      values.pendingSanctions.63._timestamp:
-        1706139865
+        1719715444
      values.pendingSanctions.62._to:
-        "0x45Ace2D41040B7267a465A4dF8733F3327EEFBb5"
+        "0x76De7fC28E69bb78e6475C8Fd71B71793B663E31"
      values.pendingSanctions.62._timestamp:
-        1719715444
+        1707346822
      values.pendingSanctions.61._to:
-        "0x76De7fC28E69bb78e6475C8Fd71B71793B663E31"
+        "0x7B31BC4FD8A00f734690AD0607903AA2C770a802"
      values.pendingSanctions.61._timestamp:
-        1707346822
+        1718846645
      values.pendingSanctions.60._to:
-        "0x7B31BC4FD8A00f734690AD0607903AA2C770a802"
+        "0x463d21B0620C77620aeD87A769e5836132158855"
      values.pendingSanctions.60._timestamp:
-        1718846645
+        1707627639
      values.pendingSanctions.59._to:
-        "0x463d21B0620C77620aeD87A769e5836132158855"
+        "0xD0aC63a724dCb105561F981c3D9dda033570193e"
      values.pendingSanctions.59._timestamp:
-        1707627639
+        1718846587
      values.pendingSanctions.58._to:
-        "0xD0aC63a724dCb105561F981c3D9dda033570193e"
+        "0xfB474dDfDc91293aD2a37A58DC94D6505d2c88dF"
      values.pendingSanctions.58._timestamp:
-        1718846587
+        1738203485
      values.pendingSanctions.57._to:
-        "0xfB474dDfDc91293aD2a37A58DC94D6505d2c88dF"
+        "0x927491618ECd06afBCEDeA84a2fEF71c991f00Eb"
      values.pendingSanctions.57._timestamp:
-        1738203485
+        1707354023
      values.pendingSanctions.56._to:
-        "0x927491618ECd06afBCEDeA84a2fEF71c991f00Eb"
+        "0x8862Dd4657aBCdf04c96402cD4C3007511538500"
      values.pendingSanctions.56._timestamp:
-        1707354023
+        1719718683
      values.pendingSanctions.55._to:
-        "0x8862Dd4657aBCdf04c96402cD4C3007511538500"
+        "0x6402119871Cc942Edc26e4815B99711750B87DBB"
      values.pendingSanctions.55._timestamp:
-        1719718683
+        1719718623
      values.pendingSanctions.54._to:
-        "0x6402119871Cc942Edc26e4815B99711750B87DBB"
+        "0xc3106dd6f982d4269a6618E77f49927d44BCCafD"
      values.pendingSanctions.54._timestamp:
-        1719718623
+        1706580004
      values.pendingSanctions.53._to:
-        "0xc3106dd6f982d4269a6618E77f49927d44BCCafD"
+        "0x015374c2Dc040eE1c40739936C72D5F035186f0f"
      values.pendingSanctions.53._timestamp:
-        1706580004
+        1706662831
      values.pendingSanctions.52._to:
-        "0x015374c2Dc040eE1c40739936C72D5F035186f0f"
+        "0x10888fc193ec8a5b9ce29a0213473B2ceFA1E707"
      values.pendingSanctions.52._timestamp:
-        1706662831
+        1719715565
      values.pendingSanctions.51._to:
-        "0x10888fc193ec8a5b9ce29a0213473B2ceFA1E707"
+        "0x9E33F1333587Ee7f96772523821187de185d2ead"
      values.pendingSanctions.50._to:
-        "0x9E33F1333587Ee7f96772523821187de185d2ead"
+        "0x23C1c317368AB6Dc5F92a496e08A79ceE6f90392"
      values.pendingSanctions.50._timestamp:
-        1719715565
+        1719718683
      values.pendingSanctions.49._to:
-        "0x23C1c317368AB6Dc5F92a496e08A79ceE6f90392"
+        "0xfd1dCf92A221f333061575FD8B7D02b6E3A5957D"
      values.pendingSanctions.49._timestamp:
-        1719718683
+        1710867621
      values.pendingSanctions.48._to:
-        "0xfd1dCf92A221f333061575FD8B7D02b6E3A5957D"
+        "0x3b2E6A063125c95f327aE214eD1F20B901801059"
      values.pendingSanctions.48._timestamp:
-        1710867621
+        1719715506
      values.pendingSanctions.47._to:
-        "0x3b2E6A063125c95f327aE214eD1F20B901801059"
+        "0x7Faf6f69caD10Eaf3903847434bF92b4Bb6fC955"
      values.pendingSanctions.47._timestamp:
-        1719715506
+        1719718623
      values.pendingSanctions.46._to:
-        "0x7Faf6f69caD10Eaf3903847434bF92b4Bb6fC955"
+        "0x2548e483ceeFBe4de727f2F853AF0124869Ae75E"
      values.pendingSanctions.46._timestamp:
-        1719718623
+        1707566427
      values.pendingSanctions.45._to:
-        "0x2548e483ceeFBe4de727f2F853AF0124869Ae75E"
+        "0xc2811Dfd12FF70b229d26E465359664f9e60b9D2"
      values.pendingSanctions.45._timestamp:
-        1707566427
+        1706148032
      values.pendingSanctions.44._to:
-        "0xc2811Dfd12FF70b229d26E465359664f9e60b9D2"
+        "0x9baE98859a9D5Ba64AD43E0C22F99d8BAd7FB554"
      values.pendingSanctions.44._timestamp:
-        1706148032
+        1710363512
      values.pendingSanctions.43._to:
-        "0x9baE98859a9D5Ba64AD43E0C22F99d8BAd7FB554"
+        "0x0828b8Fe631347dA81a46E3D23394C3b18395aD4"
      values.pendingSanctions.43._timestamp:
-        1710363512
+        1707498031
      values.pendingSanctions.42._to:
-        "0x0828b8Fe631347dA81a46E3D23394C3b18395aD4"
+        "0xdb563dA812f5d90727bb12a0959F5679B9a2Ea5F"
      values.pendingSanctions.42._timestamp:
-        1707498031
+        1710533543
      values.pendingSanctions.41._to:
-        "0xdb563dA812f5d90727bb12a0959F5679B9a2Ea5F"
+        "0x52F09693c9eEaA93A64BA697e3d3e43a1eB65477"
      values.pendingSanctions.41._timestamp:
-        1710533543
+        1707401778
      values.pendingSanctions.40._to:
-        "0x52F09693c9eEaA93A64BA697e3d3e43a1eB65477"
+        "0xdb563dA812f5d90727bb12a0959F5679B9a2Ea5F"
      values.pendingSanctions.40._timestamp:
-        1707401778
+        1710533376
      values.pendingSanctions.39._to:
-        "0xdb563dA812f5d90727bb12a0959F5679B9a2Ea5F"
+        "0xb2c54B111705B23BCB4cf584C396982c3B613F99"
      values.pendingSanctions.39._timestamp:
-        1710533376
+        1707739213
      values.pendingSanctions.38._to:
-        "0xb2c54B111705B23BCB4cf584C396982c3B613F99"
+        "0xa5AFC38dDBE6e2dda8dC7A4fdae380a9Dbe12a06"
      values.pendingSanctions.38._timestamp:
-        1707739213
+        1707472806
      values.pendingSanctions.37._to:
-        "0xa5AFC38dDBE6e2dda8dC7A4fdae380a9Dbe12a06"
+        "0x0E00e97FefD00F71b54E038899a97b470D6f662F"
      values.pendingSanctions.37._timestamp:
-        1707472806
+        1719718683
      values.pendingSanctions.36._to:
-        "0x0E00e97FefD00F71b54E038899a97b470D6f662F"
+        "0x4F5D61De15F7D9C933f78937295402b3E0D9AA6f"
      values.pendingSanctions.36._timestamp:
-        1719718683
+        1708077610
      values.pendingSanctions.35._to:
-        "0x4F5D61De15F7D9C933f78937295402b3E0D9AA6f"
+        "0xcf011278736204F57B343568A8A8DC09f266a834"
      values.pendingSanctions.35._timestamp:
-        1708077610
+        1706580004
      values.pendingSanctions.34._to:
-        "0xcf011278736204F57B343568A8A8DC09f266a834"
+        "0xf6f06e71eFB2671eAaBcf6E2C090357c995C495D"
      values.pendingSanctions.34._timestamp:
-        1706580004
+        1718846587
      values.pendingSanctions.33._to:
-        "0xf6f06e71eFB2671eAaBcf6E2C090357c995C495D"
+        "0x1971eB33A28eCFa6BF701a6efec4255633F338FB"
      values.pendingSanctions.33._timestamp:
-        1718846587
+        1718846645
      values.pendingSanctions.32._to:
-        "0x1971eB33A28eCFa6BF701a6efec4255633F338FB"
+        "0xca3E2E5c75121Cb46360E4459F6F94dCA6D868f4"
      values.pendingSanctions.32._timestamp:
-        1718846645
+        1707462016
      values.pendingSanctions.31._to:
-        "0xca3E2E5c75121Cb46360E4459F6F94dCA6D868f4"
+        "0x8F14A1990cB5D327E545be6aF2a03B517aC58259"
      values.pendingSanctions.31._timestamp:
-        1707462016
+        1706074667
      values.pendingSanctions.30._to:
-        "0x8F14A1990cB5D327E545be6aF2a03B517aC58259"
+        "0x6CDB95f68B61922d4fE0708e55792390D8c669e4"
      values.pendingSanctions.30._timestamp:
-        1706074667
+        1719718623
      values.pendingSanctions.29._to:
-        "0x6CDB95f68B61922d4fE0708e55792390D8c669e4"
+        "0x574CFb5AA6F7A05B111Cd298b73A4123AAfdF97f"
      values.pendingSanctions.29._timestamp:
-        1719718623
+        1710932425
      values.pendingSanctions.28._to:
-        "0x574CFb5AA6F7A05B111Cd298b73A4123AAfdF97f"
+        "0x1B2888e792e82fe352FC9D1E73cdc91C6217F55c"
      values.pendingSanctions.28._timestamp:
-        1710932425
+        1717533287
      values.pendingSanctions.27._to:
-        "0x1B2888e792e82fe352FC9D1E73cdc91C6217F55c"
+        "0x615E981442C93325449cB379d991237a01c06b15"
      values.pendingSanctions.27._timestamp:
-        1717533287
+        1719715389
      values.pendingSanctions.26._to:
-        "0x615E981442C93325449cB379d991237a01c06b15"
+        "0xB3902654321D214d2B7Ca531832d0EF19780fDef"
      values.pendingSanctions.26._timestamp:
-        1719715389
+        1719718623
      values.pendingSanctions.25._to:
-        "0xB3902654321D214d2B7Ca531832d0EF19780fDef"
+        "0x2bf871ca38EbF4D6Ce0124d8551F236BA33F6e8A"
      values.pendingSanctions.25._timestamp:
-        1719718623
+        1742239091
    }
```

Generated with discovered.json: 0x615130103cd713cddc9c2147ce69707534e36233

# Diff at Tue, 18 Mar 2025 08:15:31 GMT:

- chain: kinto
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@4ef7a8dbcec1cd9fec77aae2b73d81347a4ffb13 block: 763803
- current block number: 763803

## Description

Config: change Multisig names.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 763803 (main branch discovery), not current.

```diff
    contract KintsugiFoundation (0x94561e98DD5E55271f91A103e4979aa6C493745E) {
    +++ description: None
      name:
-        "MamoriLabs2"
+        "KintsugiFoundation"
    }
```

Generated with discovered.json: 0x20a6b60ce02d410121bd2ccce51af91c65edbeda

# Diff at Tue, 18 Mar 2025 08:13:00 GMT:

- chain: ethereum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@4ef7a8dbcec1cd9fec77aae2b73d81347a4ffb13 block: 21988484
- current block number: 21988484

## Description

Config: change Multisig names.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21988484 (main branch discovery), not current.

```diff
    contract Kinto Security Council (0x17Eb10e12a78f986C78F973Fc70eD88072B33B7d) {
    +++ description: None
      name:
-        "Kinto SecurityCouncil"
+        "Kinto Security Council"
    }
```

```diff
    contract Turnkey Multisig (0xD98B32e5D0Dcb5853e498225a15447a59b7a40e1) {
    +++ description: None
      name:
-        "TurnkeyMultisig"
+        "Turnkey Multisig"
    }
```

```diff
    contract Kinto Multisig (0xf152Abda9E4ce8b134eF22Dc3C6aCe19C4895D82) {
    +++ description: None
      name:
-        "BridgerOwnerMultisig"
+        "Kinto Multisig"
    }
```

Generated with discovered.json: 0xa7d9f420fdf8f9437f47c882c08bbe88c2fdadb3

# Diff at Mon, 10 Mar 2025 16:53:34 GMT:

- chain: ethereum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@ef4d1036423fe7d398c41e6cf238a209cc1ff8f3 block: 21988484
- current block number: 21988484

## Description

changed EOA signer of the Kinto SecurityCouncil.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21988484 (main branch discovery), not current.

```diff
    contract KintsugiFoundation (0x94561e98DD5E55271f91A103e4979aa6C493745E) {
    +++ description: None
      name:
-        "MamoriLabs2"
+        "KintsugiFoundation"
    }
```

Generated with discovered.json: 0x4d18726190c34736596855ef23ed853f1b25431c

# Diff at Fri, 07 Mar 2025 09:06:25 GMT:

- chain: ethereum
- author: Luca Donno (<donnoh99@gmail.com>)
- comparing to: main@454ef41fea41bcea030780b23fd1f11519ff78d2 block: 21872461
- current block number: 21988484

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21872461 (main branch discovery), not current.

```diff
    contract RollupProxy (0x5073dA9cA4810f3E0aA01c20c7d9d02C3f522e11) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      values.isPostBoLD:
+        false
    }
```

Generated with discovered.json: 0xa3d8f1aee8bb53b2fab30e3822288740bf1ca64c

# Diff at Thu, 06 Mar 2025 15:34:47 GMT:

- chain: kinto
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@64eed24a033030dd2d128180f3ee3f87c3c39f7c block: 762641
- current block number: 763116

## Description

config: updates timelock templates, added starknet proghashes to global config.

## Watched changes

```diff
    contract AccessManager (0xacC000818e5Bbd911D5d449aA81CB5cA24024739) {
    +++ description: Standard OpenZeppelin AccessManager: Serves as a proxy contract defining the roles, permissions and delays to call functions in target contracts.
      values.accessControl.roles.NIO_GOVERNOR_ROLE.members.1:
+        {"member":"0x2e2B1c42E38f5af81771e65D87729E57ABD1337a","since":1741118224,"executionDelay":0}
+++ description: List of roles granted to accounts.
      values.RolesGranted.1635978423191113331.2:
+        {"account":"0x2e2B1c42E38f5af81771e65D87729E57ABD1337a","delay":0,"since":1741118224,"newMember":true}
+++ description: List of roles granted to accounts.
      values.RolesGranted.1635978423191113331.1:
+        {"account":"0x0000000000000000000000000000000000000000","delay":0,"since":1741117274,"newMember":true}
+++ description: List of roles revoked from accounts.
      values.RolesRevoked.1635978423191113331:
+        [{"roleId":"1635978423191113331","account":"0x0000000000000000000000000000000000000000"}]
    }
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 762641 (main branch discovery), not current.

```diff
    contract NioGuardians (0x0100005D52Be9ab3ccE0C70Abf6F6FA2C48e91C9) {
    +++ description: Contract using NFTs as voting tokens to be used by Nio Guardians in the NioGovernor.
      sinceBlock:
+        234135
    }
```

```diff
    contract NioGovernor (0x010600ff5f36C8eF3b6Aaf2A88C2DE85C798594a) {
    +++ description: Governance contract allowing token- and NFT based voting.
      sinceBlock:
+        234141
    }
```

```diff
    contract BridgedKinto (0x010700808D59d2bb92257fCafACfe8e5bFF7aB87) {
    +++ description: KINTO token contract.
      sinceBlock:
+        181511
    }
```

```diff
    contract Faucet (0x0719D47A213149E2Ef8d3f5afDaDA8a8E22dfc03) {
    +++ description: None
      sinceBlock:
+        169
    }
```

```diff
    contract SponsorPaymaster (0x1842a4EFf3eFd24c50B63c3CF89cECEe245Fc2bd) {
    +++ description: Paymaster used for user transactions eligible for sponsorship.
      sinceBlock:
+        68
    }
```

```diff
    contract EntryPoint (0x2843C269D2a64eCfA63548E8B3Fc0FD23B7F70cb) {
    +++ description: None
      sinceBlock:
+        61
    }
```

```diff
    contract KintoAdminMultisig (0x2e2B1c42E38f5af81771e65D87729E57ABD1337a) {
    +++ description: None
      sinceBlock:
+        84
    }
```

```diff
    contract L2GatewayRouter (0x340487b92808B84c2bd97C87B590EE81267E04a7) {
    +++ description: None
      sinceBlock:
+        11
    }
```

```diff
    contract Socket (0x3e9727470C66B1e77034590926CDe0242B5A3dCc) {
    +++ description: None
      sinceBlock:
+        130639
    }
```

```diff
    contract KintoAppRegistry (0x5A2b641b84b0230C8e75F55d5afd27f4Dbd59d5b) {
    +++ description: Central system contract defining addresses that are allowed to be called by EOAs. The modified Kinto node reads this configuration and drops all other transactions from EOAs (enforced by a modified state transition function). Accordingly, users can only transact from their smart wallets.
      sinceBlock:
+        126
    }
```

```diff
    contract Treasury (0x793500709506652Fcc61F0d2D0fDa605638D4293) {
    +++ description: Kinto Treasury.
      sinceBlock:
+        205278
    }
```

```diff
    contract  (0x87799989341A07F495287B1433eea98398FD73aA) {
    +++ description: None
      sinceBlock:
+        11
    }
```

```diff
    contract BeaconKintoWallet (0x87f0eE85bF3198654900a422832157abBba30828) {
    +++ description: None
      sinceBlock:
+        65
    }
```

```diff
    contract  (0x88e03D41a6EAA9A0B93B0e2d6F1B34619cC4319b) {
    +++ description: None
      sinceBlock:
+        11
    }
```

```diff
    contract KintoWalletFactory (0x8a4720488CA32f1223ccFE5A087e250fE3BC5D75) {
    +++ description: Deploys new KintoWallet beacon proxies when users create a wallet. Also manages the beacon implementation for all KintoWallets and their recovery logic.
      sinceBlock:
+        64
    }
```

```diff
    contract BundleBulker (0x8d2D899402ed84b6c0510bB1ad34ee436ADDD20d) {
    +++ description: None
      sinceBlock:
+        129612
    }
```

```diff
    contract ProxyAdmin (0x9eC0253E4174a14C0536261888416451A407Bf79) {
    +++ description: None
      sinceBlock:
+        11
    }
```

```diff
    contract AccessManager (0xacC000818e5Bbd911D5d449aA81CB5cA24024739) {
    +++ description: Standard OpenZeppelin AccessManager: Serves as a proxy contract defining the roles, permissions and delays to call functions in target contracts.
      sinceBlock:
+        234140
    }
```

```diff
    contract RewardsDistributor (0xD157904639E89df05e89e0DabeEC99aE3d74F9AA) {
    +++ description: None
      sinceBlock:
+        185011
    }
```

```diff
    contract KintoID (0xf369f78E3A0492CC4e96a90dae0728A38498e9c7) {
    +++ description: Manages Kinto's KYC system: The KYC_PROVIDER roles responsible for the KYC status and KYC metadata of user wallets.
      sinceBlock:
+        59
    }
```

Generated with discovered.json: 0x350bab3c23cf9ecee648af508bd14b5cc255e8fe

# Diff at Thu, 06 Mar 2025 09:39:02 GMT:

- chain: ethereum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@7119c715545bc86a4194761f42815f811ac6307a block: 21872461
- current block number: 21872461

## Description

Config related: set severity for arbitrum inbox/outbox changes to high and add historical In- and Outboxes via events.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21872461 (main branch discovery), not current.

```diff
    contract Bridge (0x859a53Fe2C8DA961387030E7CB498D6D20d0B2DB) {
    +++ description: Escrow contract for the project's gas token (can be different from ETH). Keeps a list of allowed Inboxes and Outboxes for canonical bridge messaging.
+++ description: All Inboxes that were ever set as allowed in the bridge.
+++ severity: HIGH
      values.inboxHistory:
+        ["0xBFfaA85c1756472fFC37e6D172A7eC0538C14474","0x52EcE832AF3DF3125BbfD6423E0425dB3fA99D3F"]
+++ description: All Outboxes that were ever set as allowed in the bridge.
+++ severity: HIGH
      values.outboxHistory:
+        ["0x655761AD5FC251F414D6993A73184B0669F278c8"]
      fieldMeta:
+        {"allowedOutboxList":{"severity":"HIGH","description":"Can make calls as the bridge, steal all funds."},"outboxHistory":{"severity":"HIGH","description":"All Outboxes that were ever set as allowed in the bridge."},"allowedDelayedInboxList":{"severity":"HIGH","description":"Allowed to mint the gastoken on L2 and call `enqueueDelayedMessage()` on the bridge."},"inboxHistory":{"severity":"HIGH","description":"All Inboxes that were ever set as allowed in the bridge."}}
    }
```

Generated with discovered.json: 0x85641b329797b7e3abafd6c3cdc764983c7ee6e5

# Diff at Tue, 04 Mar 2025 13:35:18 GMT:

- chain: kinto
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@40abad0e9dad8439d751a811eb767233c5a70a2f block: 758248
- current block number: 762641

## Description

Add sanctions monitoring.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 758248 (main branch discovery), not current.

```diff
    contract KintoID (0xf369f78E3A0492CC4e96a90dae0728A38498e9c7) {
    +++ description: Manages Kinto's KYC system: The KYC_PROVIDER roles responsible for the KYC status and KYC metadata of user wallets.
+++ description: addresses confirmed sanctioned by the GOVERNANCE_ROLE.
      values.confirmedSanctions:
+        ["0x2a14E7B96D2362bdf1Df8C0bB4544714e7601Af0","0xc1ad34Bd24180A15735dd7919C0F24A63e4017ff"]
+++ description: addresses sanctioned by any KYC_PROVIDER role.
      values.pendingSanctions:
+        [{"_to":"0x8F14A1990cB5D327E545be6aF2a03B517aC58259","_timestamp":1706074667},{"_to":"0xE9Cb04a602cAA9D2C649dDE854Ab7389C98CF912","_timestamp":1706139865},{"_to":"0xC44F5CA2F187D5ece6864b8a31174C36dEFdC29c","_timestamp":1706139865},{"_to":"0x505D435C8B66a7511dbec7f3C8DA6F1e67D50dDA","_timestamp":1706148032},{"_to":"0x5579CA784CdC93776b9c030618548f1317AB4c39","_timestamp":1706148032},{"_to":"0xc2811Dfd12FF70b229d26E465359664f9e60b9D2","_timestamp":1706148032},{"_to":"0x7498cF5863fd745eE79d7F07516725b87fE9C8FB","_timestamp":1706148032},{"_to":"0xf30BF377b3C4ed1f111E6E28CF26003CE5a682Cf","_timestamp":1706580004},{"_to":"0x1f16335Fd1dD3e8DCC8b401f5ae8BA57F8AD76a8","_timestamp":1706580004},{"_to":"0xcf011278736204F57B343568A8A8DC09f266a834","_timestamp":1706580004},{"_to":"0x3CfA8C0e6eEb1e601f76355A82f583232b186a7D","_timestamp":1706580004},{"_to":"0x19CC0e919b58e0d0eF7BaeBb103f72dee1031978","_timestamp":1706580004},{"_to":"0xc3106dd6f982d4269a6618E77f49927d44BCCafD","_timestamp":1706580004},{"_to":"0x2955ca0D791C30C16e7298B803BB116bED5d7269","_timestamp":1706580004},{"_to":"0x015374c2Dc040eE1c40739936C72D5F035186f0f","_timestamp":1706662831},{"_to":"0x5420f6C9Bc0495d24f35Ba25Be8e259693615625","_timestamp":1707343233},{"_to":"0x60BF5eE1CBf2a18639412ce694FbCe1c8c3E6637","_timestamp":1707346822},{"_to":"0x76De7fC28E69bb78e6475C8Fd71B71793B663E31","_timestamp":1707346822},{"_to":"0x927491618ECd06afBCEDeA84a2fEF71c991f00Eb","_timestamp":1707354023},{"_to":"0x52F09693c9eEaA93A64BA697e3d3e43a1eB65477","_timestamp":1707401778},{"_to":"0xca3E2E5c75121Cb46360E4459F6F94dCA6D868f4","_timestamp":1707462016},{"_to":"0xa5AFC38dDBE6e2dda8dC7A4fdae380a9Dbe12a06","_timestamp":1707472806},{"_to":"0xe12BcEe0219f3c80FFF8C271D29e343bA42B814d","_timestamp":1707483639},{"_to":"0x3365dB4c3490AC6A43986Cfe2c26FE61B22aA917","_timestamp":1707494421},{"_to":"0x0828b8Fe631347dA81a46E3D23394C3b18395aD4","_timestamp":1707498031},{"_to":"0x2548e483ceeFBe4de727f2F853AF0124869Ae75E","_timestamp":1707566427},{"_to":"0x463d21B0620C77620aeD87A769e5836132158855","_timestamp":1707627639},{"_to":"0x504a1ef47bF87a550bebfBA6ffe58a3a57bADeB7","_timestamp":1707652818},{"_to":"0xb2c54B111705B23BCB4cf584C396982c3B613F99","_timestamp":1707739213},{"_to":"0xE65a2Dee17190786c76f83e36F489a085690686C","_timestamp":1707840030},{"_to":"0xC14051DBDc3459A6A353D887dDF68F2BE286FaD6","_timestamp":1707998409},{"_to":"0x1075d13CE70F8F4eB840c4c264b6c84C2CD4E785","_timestamp":1708034428},{"_to":"0x24444de1eFf861197fd1393cF6081701237d3380","_timestamp":1708048804},{"_to":"0x4F5D61De15F7D9C933f78937295402b3E0D9AA6f","_timestamp":1708077610},{"_to":"0x92D620d0279359727A0128cC19b84EEF89621Fb4","_timestamp":1708164033},{"_to":"0xCc946190D2F37497d21e10309a20D56CF240446B","_timestamp":1710360415},{"_to":"0x9baE98859a9D5Ba64AD43E0C22F99d8BAd7FB554","_timestamp":1710363512},{"_to":"0x3e7b92D14dfA2A891B69d73A9912C7bea9C86bDB","_timestamp":1710363512},{"_to":"0x102C7CAF21c4B1EF75c5d3EEEbe673E73c1706D3","_timestamp":1710363512},{"_to":"0x275edFf82EB0c3845edaBa411D7A5bE31486C2B6","_timestamp":1710367221},{"_to":"0xdb563dA812f5d90727bb12a0959F5679B9a2Ea5F","_timestamp":1710533376},{"_to":"0xdb563dA812f5d90727bb12a0959F5679B9a2Ea5F","_timestamp":1710533543},{"_to":"0xfd1dCf92A221f333061575FD8B7D02b6E3A5957D","_timestamp":1710867621},{"_to":"0x574CFb5AA6F7A05B111Cd298b73A4123AAfdF97f","_timestamp":1710932425},{"_to":"0x49aEa6275e1D94Df2AC90c3ee4e4afd47e468d71","_timestamp":1712710928},{"_to":"0x3C9959C3EfEC9674926D86D8CAA814A486bA047B","_timestamp":1712740568},{"_to":"0xBD85550C39dE4844E501A278D6b632FbE68cF70F","_timestamp":1716580853},{"_to":"0x1B2888e792e82fe352FC9D1E73cdc91C6217F55c","_timestamp":1717533287},{"_to":"0x93402720154e26A044E8389D2733F281fF830c5c","_timestamp":1717937047},{"_to":"0xcD984AD7eBB2ab7B2aE0afd967F371c6E24a4Bc6","_timestamp":1718846587},{"_to":"0x493ff963FAAbbBeDBA2Aa19378bF8d8a0F0e2C5E","_timestamp":1718846587},{"_to":"0xbf3fBce48ff8a49918dD8578290814ea466aB79F","_timestamp":1718846587},{"_to":"0xD0aC63a724dCb105561F981c3D9dda033570193e","_timestamp":1718846587},{"_to":"0xf6f06e71eFB2671eAaBcf6E2C090357c995C495D","_timestamp":1718846587},{"_to":"0x1971eB33A28eCFa6BF701a6efec4255633F338FB","_timestamp":1718846645},{"_to":"0x9E292AFD2492f4ecBA6c1eb8B73BC87A5650eB8F","_timestamp":1718846645},{"_to":"0x7B31BC4FD8A00f734690AD0607903AA2C770a802","_timestamp":1718846645},{"_to":"0x99758a8519691B6bffEeD3976080c943634B7364","_timestamp":1718846645},{"_to":"0x81bb2B25eA1A01BADA25d41C67A34d81C9684712","_timestamp":1718846645},{"_to":"0x6E6E2044A4cfeA057E02d6FB72c33Fc893A9B788","_timestamp":1718846703},{"_to":"0x467Fa5244cd8386581635646F12E13C05Ad0f41F","_timestamp":1718846703},{"_to":"0x933b0f5e531648Bef764b58Ff7782AfB13AB06D0","_timestamp":1718846703},{"_to":"0x615E981442C93325449cB379d991237a01c06b15","_timestamp":1719715389},{"_to":"0xA4EcEAB6C954C3b967cF18e947879A6708A96D5e","_timestamp":1719715444},{"_to":"0x45Ace2D41040B7267a465A4dF8733F3327EEFBb5","_timestamp":1719715444},{"_to":"0x3b2E6A063125c95f327aE214eD1F20B901801059","_timestamp":1719715506},{"_to":"0x02b308D92893E3d93a2cD1C6506a7935B369f2C9","_timestamp":1719715506},{"_to":"0xa7E7870aFEe03C4768feDCb55db9bC11E1187356","_timestamp":1719715506},{"_to":"0x9E33F1333587Ee7f96772523821187de185d2ead","_timestamp":1719715565},{"_to":"0x10888fc193ec8a5b9ce29a0213473B2ceFA1E707","_timestamp":1719715565},{"_to":"0xC10730513A843fa0E2Fc223eC2AE3B6d3d002294","_timestamp":1719715565},{"_to":"0x504CC21F6343F966E672ce27054f9b7e546cd918","_timestamp":1719715623},{"_to":"0x01e523cC67e5d3459bE930837d89bccEA85Fd1DC","_timestamp":1719715623},{"_to":"0x4D836F0f988424f32065086D9A32644a7695e248","_timestamp":1719718509},{"_to":"0x6402119871Cc942Edc26e4815B99711750B87DBB","_timestamp":1719718623},{"_to":"0xB3902654321D214d2B7Ca531832d0EF19780fDef","_timestamp":1719718623},{"_to":"0x7Faf6f69caD10Eaf3903847434bF92b4Bb6fC955","_timestamp":1719718623},{"_to":"0x47DBDEe9AD57e48b9F9a0F867712357Ffb5B489f","_timestamp":1719718623},{"_to":"0x985540465088C9c667690cC17BFf732fC703D2E5","_timestamp":1719718623},{"_to":"0x6CDB95f68B61922d4fE0708e55792390D8c669e4","_timestamp":1719718623},{"_to":"0x75D9312845d38764229455Ea8d526A122b37768D","_timestamp":1719718623},{"_to":"0x6baa2c84A37999D264DA7bEe9639cDd3171c1397","_timestamp":1719718683},{"_to":"0x8862Dd4657aBCdf04c96402cD4C3007511538500","_timestamp":1719718683},{"_to":"0x89F6188006a35b9D0407c37f01FCa27AeD48CA3B","_timestamp":1719718683},{"_to":"0x9bC8048273BBa88f36c81a94EBde7ab5E0322e22","_timestamp":1719718683},{"_to":"0x23C1c317368AB6Dc5F92a496e08A79ceE6f90392","_timestamp":1719718683},{"_to":"0x6C38A71C9bd2cb9A262C5503E8D9D3D095386C00","_timestamp":1719718683},{"_to":"0x0E00e97FefD00F71b54E038899a97b470D6f662F","_timestamp":1719718683},{"_to":"0xdD330d70F14AEa4Ce7b9E777fDCC117321c74124","_timestamp":1722940629},{"_to":"0x2a14E7B96D2362bdf1Df8C0bB4544714e7601Af0","_timestamp":1734246668},{"_to":"0xc1ad34Bd24180A15735dd7919C0F24A63e4017ff","_timestamp":1734613992},{"_to":"0x2f3f40216112e54F8AC7668c364E459F156ed2af","_timestamp":1734613992},{"_to":"0x60a05081683493b2932Df77eE5fac141D2329B89","_timestamp":1736789115},{"_to":"0xfB474dDfDc91293aD2a37A58DC94D6505d2c88dF","_timestamp":1738203485}]
+++ description: addresses unsanctioned manually by any KYC_PROVIDER role. Mind that sanctions also expire if not confirmed (and those do not emit).
      values.removedSanctions:
+        ["0x52F09693c9eEaA93A64BA697e3d3e43a1eB65477","0x015374c2Dc040eE1c40739936C72D5F035186f0f","0xdb563dA812f5d90727bb12a0959F5679B9a2Ea5F","0x49aEa6275e1D94Df2AC90c3ee4e4afd47e468d71","0x1B2888e792e82fe352FC9D1E73cdc91C6217F55c"]
      fieldMeta.pendingSanctions:
+        {"description":"addresses sanctioned by any KYC_PROVIDER role."}
      fieldMeta.removedSanctions:
+        {"description":"addresses unsanctioned manually by any KYC_PROVIDER role. Mind that sanctions also expire if not confirmed (and those do not emit)."}
      fieldMeta.confirmedSanctions:
+        {"description":"addresses confirmed sanctioned by the GOVERNANCE_ROLE."}
    }
```

Generated with discovered.json: 0x7e4c189edbbafb3e8c4f992b91ca6b2102ede1cd

# Diff at Tue, 04 Mar 2025 10:39:18 GMT:

- chain: ethereum
- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@98d260b45fe0d2195ce5e629bd7b200c8706e8ba block: 21872461
- current block number: 21872461

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21872461 (main branch discovery), not current.

```diff
    contract Bridger (0x0f1b7bd7762662B23486320AA91F30312184f70C) {
    +++ description: Bridger gateway that can swap assets to 'L2 final assets' defined by the admin before bridging them to the L2. It does not have a function to bridge via the canonical bridge and uses the external socket bridge by default.
      sinceBlock:
+        19419135
    }
```

```diff
    contract Kinto SecurityCouncil (0x17Eb10e12a78f986C78F973Fc70eD88072B33B7d) {
    +++ description: None
      sinceBlock:
+        18772804
    }
```

```diff
    contract ValidatorUtils (0x2b0E04Dc90e3fA58165CB41E2834B44A56E766aF) {
    +++ description: This contract implements view only utilities for validators.
      sinceBlock:
+        18736154
    }
```

```diff
    contract OneStepProver0 (0x2C1e1A31d2bC26f7BE3CAB5Cb0806641847B3C59) {
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
      sinceBlock:
+        21049963
    }
```

```diff
    contract RollupProxy (0x5073dA9cA4810f3E0aA01c20c7d9d02C3f522e11) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      sinceBlock:
+        18788587
    }
```

```diff
    contract RollupEventInbox (0x52EcE832AF3DF3125BbfD6423E0425dB3fA99D3F) {
    +++ description: Helper contract sending configuration data over the bridge during the systems initialization.
      sinceBlock:
+        18788587
    }
```

```diff
    contract OneStepProverHostIo (0x551E2501074D80E22c5FfB69b5fd8ba2939593b7) {
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
      sinceBlock:
+        21049966
    }
```

```diff
    contract UpgradeExecutor (0x59B851c8b1643e0735Ec3F2f0e528f3d89c3408a) {
    +++ description: Central contract defining the access control permissions for upgrading the system contract implementations.
      sinceBlock:
+        18788587
    }
```

```diff
    contract ChallengeManager (0x6228e2FB8C561f1a5A963039Bc38Eb6D539A1A7F) {
    +++ description: Contract that allows challenging state roots. Can be called through the RollupProxy by Validators or the UpgradeExecutor.
      sinceBlock:
+        18788587
    }
```

```diff
    contract Outbox (0x655761AD5FC251F414D6993A73184B0669F278c8) {
    +++ description: Facilitates L2 to L1 contract calls: Messages initiated from L2 (for example withdrawal messages) eventually resolve in execution on L1.
      sinceBlock:
+        18788587
    }
```

```diff
    contract ProxyAdmin (0x74C717C01425eb475A5fC55d2A4a9045fC9800df) {
    +++ description: None
      sinceBlock:
+        18788587
    }
```

```diff
    contract OneStepProverMemory (0x778ca912Bd8b35dDA84852B47BA8624e08f640A6) {
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
      sinceBlock:
+        21049964
    }
```

```diff
    contract ERC20Gateway (0x7870D5398DB488c669B406fBE57b8d05b6A35e42) {
    +++ description: Escrows deposited ERC-20 assets for the canonical Bridge. Upon depositing, a generic token representation will be minted at the destination. Withdrawals are initiated by the Outbox contract.
      sinceBlock:
+        18788729
    }
```

```diff
    contract Bridge (0x859a53Fe2C8DA961387030E7CB498D6D20d0B2DB) {
    +++ description: Escrow contract for the project's gas token (can be different from ETH). Keeps a list of allowed Inboxes and Outboxes for canonical bridge messaging.
      sinceBlock:
+        18788587
    }
```

```diff
    contract OneStepProverMath (0xacED35d61f71A804E7627b5622c267C8Ac31d38e) {
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
      sinceBlock:
+        21049965
    }
```

```diff
    contract Inbox (0xBFfaA85c1756472fFC37e6D172A7eC0538C14474) {
    +++ description: Facilitates sending L1 to L2 messages like depositing ETH, but does not escrow funds.
      sinceBlock:
+        18788587
    }
```

```diff
    contract GatewayRouter (0xD9041DeCaDcBA88844b373e7053B4AC7A3390D60) {
    +++ description: This routing contract maps tokens to the correct escrow (gateway) to be then bridged with canonical messaging.
      sinceBlock:
+        18788729
    }
```

```diff
    contract TurnkeyMultisig (0xD98B32e5D0Dcb5853e498225a15447a59b7a40e1) {
    +++ description: None
      sinceBlock:
+        20465349
    }
```

```diff
    contract OneStepProofEntry (0xEd696D87C351C2ef687c1c484c3e297B276a40d1) {
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
      sinceBlock:
+        21049967
    }
```

```diff
    contract BridgerOwnerMultisig (0xf152Abda9E4ce8b134eF22Dc3C6aCe19C4895D82) {
    +++ description: None
      sinceBlock:
+        16818229
    }
```

```diff
    contract SequencerInbox (0xF4Ef823D57819AC7202a081A5B49376BD28E7b3a) {
    +++ description: A sequencer (registered in this contract) can submit transaction batches or commitments here.
      sinceBlock:
+        18788587
    }
```

Generated with discovered.json: 0xac84dc83f9b9b311f6d34f246f5deb527c133141

# Diff at Thu, 27 Feb 2025 11:45:51 GMT:

- chain: ethereum
- author: Michał Podsiadły (<michal.podsiadly@l2beat.com>)
- comparing to: main@a4b50e45bb44f8ceeea29f9236088d26a843c885 block: 21872461
- current block number: 21872461

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21872461 (main branch discovery), not current.

```diff
    contract ERC20Gateway (0x7870D5398DB488c669B406fBE57b8d05b6A35e42) {
    +++ description: Escrows deposited ERC-20 assets for the canonical Bridge. Upon depositing, a generic token representation will be minted at the destination. Withdrawals are initiated by the Outbox contract.
      name:
-        "L1ERC20Gateway"
+        "ERC20Gateway"
      displayName:
-        "ERC20Gateway"
    }
```

```diff
    contract GatewayRouter (0xD9041DeCaDcBA88844b373e7053B4AC7A3390D60) {
    +++ description: This routing contract maps tokens to the correct escrow (gateway) to be then bridged with canonical messaging.
      name:
-        "L1GatewayRouter"
+        "GatewayRouter"
      displayName:
-        "GatewayRouter"
    }
```

Generated with discovered.json: 0x505af3caad8c9a7b11115942b44d2dfd09eaf642

# Diff at Mon, 24 Feb 2025 15:41:14 GMT:

- chain: kinto
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@cfe18eb30997850b8abc4c6e718cd2a363aa4309 block: 752779
- current block number: 758248

## Description

Config: added a single caldera multisig name.

## Watched changes

```diff
    contract BridgedKinto (0x010700808D59d2bb92257fCafACfe8e5bFF7aB87) {
    +++ description: KINTO token contract.
      sourceHashes.1:
-        "0x4f5f7229da06877c8ec759071cd3d1999f9680fa1d5a7e5d5381558383c25b22"
+        "0xe15912dcb541011cee29f6046afcf500542e3763f530012c1ce71e54abd96545"
      values.$implementation:
-        "0xAf968044D5DE68fE01B5a6517d0DbeE3caD8563a"
+        "0xd70052c77dC9E5291c79842420a6d51010Ed014c"
      values.$pastUpgrades.5:
+        ["2025-02-21T21:13:41.000Z","0xd65d8a3e984c6df5eb9bda4baee108c063c153abc195fbb9656b1d4b8236a1cb",["0xd70052c77dC9E5291c79842420a6d51010Ed014c"]]
      values.$upgradeCount:
-        5
+        6
      values.SALE:
+        "0x5a1E00884e35bF2dC39Af51712D08bEF24b1817f"
    }
```

## Source code changes

```diff
.../{.flat@752779 => .flat}/BridgedKinto/BridgedKinto.sol | 15 ++++-----------
 1 file changed, 4 insertions(+), 11 deletions(-)
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 752779 (main branch discovery), not current.

```diff
-   Status: DELETED
    contract  (0x35B1Ca86D564e69FA38Ee456C12c78A62e78Aa4c)
    +++ description: None
```

```diff
-   Status: DELETED
    contract SignatureVerifier (0x56Ac0e336f0c3620dCaF8d361E8E14eA73C31f5d)
    +++ description: None
```

```diff
-   Status: DELETED
    contract TransmitManager (0x6332e56A423480A211E301Cb85be12814e9238Bb)
    +++ description: None
```

```diff
-   Status: DELETED
    contract Hasher (0x9652Dd5e1388CA80712470122F27be0d1c33B48b)
    +++ description: None
```

```diff
-   Status: DELETED
    contract ExecutionManagerDF (0xc8a4D2fd77c155fd52e65Ab07F337aBF84495Ead)
    +++ description: None
```

Generated with discovered.json: 0x0ae6a9ab2d2bc26891a7a947c598d990fe1274b7

# Diff at Fri, 21 Feb 2025 14:07:53 GMT:

- chain: ethereum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@d219f271711b2cf7a164e3443bead5e4957d13a8 block: 21872461
- current block number: 21872461

## Description

Config related: Change some severities and add templates.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21872461 (main branch discovery), not current.

```diff
    contract RollupProxy (0x5073dA9cA4810f3E0aA01c20c7d9d02C3f522e11) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      category:
+        {"name":"Local Infrastructure","priority":5}
    }
```

```diff
    contract UpgradeExecutor (0x59B851c8b1643e0735Ec3F2f0e528f3d89c3408a) {
    +++ description: Central contract defining the access control permissions for upgrading the system contract implementations.
      category:
+        {"name":"Governance","priority":3}
    }
```

```diff
    contract ChallengeManager (0x6228e2FB8C561f1a5A963039Bc38Eb6D539A1A7F) {
    +++ description: Contract that allows challenging state roots. Can be called through the RollupProxy by Validators or the UpgradeExecutor.
      category:
+        {"name":"Local Infrastructure","priority":5}
    }
```

```diff
    contract Outbox (0x655761AD5FC251F414D6993A73184B0669F278c8) {
    +++ description: Facilitates L2 to L1 contract calls: Messages initiated from L2 (for example withdrawal messages) eventually resolve in execution on L1.
      category:
+        {"name":"Canonical Bridges","priority":2}
    }
```

```diff
    contract L1ERC20Gateway (0x7870D5398DB488c669B406fBE57b8d05b6A35e42) {
    +++ description: Escrows deposited ERC-20 assets for the canonical Bridge. Upon depositing, a generic token representation will be minted at the destination. Withdrawals are initiated by the Outbox contract.
      category:
+        {"name":"Canonical Bridges","priority":2}
    }
```

```diff
    contract Bridge (0x859a53Fe2C8DA961387030E7CB498D6D20d0B2DB) {
    +++ description: Escrow contract for the project's gas token (can be different from ETH). Keeps a list of allowed Inboxes and Outboxes for canonical bridge messaging.
      category:
+        {"name":"Local Infrastructure","priority":5}
    }
```

```diff
    contract Inbox (0xBFfaA85c1756472fFC37e6D172A7eC0538C14474) {
    +++ description: Facilitates sending L1 to L2 messages like depositing ETH, but does not escrow funds.
      category:
+        {"name":"Canonical Bridges","priority":2}
    }
```

```diff
    contract L1GatewayRouter (0xD9041DeCaDcBA88844b373e7053B4AC7A3390D60) {
    +++ description: This routing contract maps tokens to the correct escrow (gateway) to be then bridged with canonical messaging.
      category:
+        {"name":"External Bridges","priority":1}
    }
```

```diff
    contract SequencerInbox (0xF4Ef823D57819AC7202a081A5B49376BD28E7b3a) {
    +++ description: A sequencer (registered in this contract) can submit transaction batches or commitments here.
      category:
+        {"name":"Local Infrastructure","priority":5}
    }
```

Generated with discovered.json: 0x8cb093dd270747aeddf39826bc0b3b5f771e86e4

# Diff at Fri, 21 Feb 2025 13:25:34 GMT:

- chain: kinto
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@d219f271711b2cf7a164e3443bead5e4957d13a8 block: 748108
- current block number: 752779

## Description

Removed unnecessary NFT tracking from disco.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 748108 (main branch discovery), not current.

```diff
-   Status: DELETED
    contract KintoWallet (0x25EA8c663BA8cCd79284B8c4001e7A245071885c)
    +++ description: None
```

```diff
    contract KintoAppRegistry (0x5A2b641b84b0230C8e75F55d5afd27f4Dbd59d5b) {
    +++ description: Central system contract defining addresses that are allowed to be called by EOAs. The modified Kinto node reads this configuration and drops all other transactions from EOAs (enforced by a modified state transition function). Accordingly, users can only transact from their smart wallets.
      values.ownerOf:
-        ["0x2e2B1c42E38f5af81771e65D87729E57ABD1337a","0x2e2B1c42E38f5af81771e65D87729E57ABD1337a","0x2e2B1c42E38f5af81771e65D87729E57ABD1337a","0x25EA8c663BA8cCd79284B8c4001e7A245071885c"]
    }
```

```diff
    contract KintoWalletFactory (0x8a4720488CA32f1223ccFE5A087e250fE3BC5D75) {
    +++ description: Deploys new KintoWallet beacon proxies when users create a wallet. Also manages the beacon implementation for all KintoWallets and their recovery logic.
      receivedPermissions.1:
-        {"permission":"upgrade","from":"0x2e2B1c42E38f5af81771e65D87729E57ABD1337a"}
      receivedPermissions.0.from:
-        "0x25EA8c663BA8cCd79284B8c4001e7A245071885c"
+        "0x2e2B1c42E38f5af81771e65D87729E57ABD1337a"
    }
```

Generated with discovered.json: 0xd31287d41663554657fb31f66d2acb6db967628f

# Diff at Wed, 19 Feb 2025 13:59:28 GMT:

- chain: kinto
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@90e939c93581cd5b2e00d23bb3ba08dde38932e8 block: 742977
- current block number: 748108

## Description

Config related (better Access Manager event handling + new handler).

KintoID accessControl roles still configured wrong, Access Manager seems fine apart from the ADMIN_ROLE (see below).

Currently an example attack through Access Manager would be the ADMIN_ROLE granting SECURITY_COUNCIL_ROLE to any other address than SC and calling the restricted funcs in AppRegistry (there is no target delay and no role grant delay and ADMIN_ROLE is the roleAdmin for SECURITY_COUNCIL_ROLE).

### Current state of the Access Manager

**Actors and Their Roles:**

1. **KintoAdminMultisig** (0x2e2B1c42E38f5af81771e65D87729E57ABD1337a)
    - ADMIN_ROLE (delay: 0 days)
    - UPGRADER_ROLE (delay: 7 days)
        - KintoWalletFactory: `upgradeTo()`, `upgradeAllWalletImplementations()`
        - KintoAppRegistry: `upgradeTo()`
        - KintoID: `upgradeTo()`
2. **NioGovernor** (0x010600ff5f36C8eF3b6Aaf2A88C2DE85C798594a)
    - NIO_GOVERNOR_ROLE (delay: 3 days)
        - Treasury: `sendFunds()`, `sendETH()`, `batchSendFunds()`
3. **SC_l2alias** (0x28fC10E12A78f986c78F973Fc70ED88072b34c8e)
    - UPGRADER_ROLE (delay: 7 days)
        - Same targets as KintoAdminMultisig
    - SECURITY_COUNCIL_ROLE (delay: 7 days)
        - KintoAppRegistry: `updateSystemApps()`, `updateSystemContracts()`, `updateReservedContracts()`

**Roles and Their Targets:**

1. **ADMIN_ROLE**
    - Has administrative privileges over the AccessManager
2. **NIO_GOVERNOR_ROLE**
    - Treasury:
        - `sendFunds()`
        - `sendETH()`
        - `batchSendFunds()`
3. **UPGRADER_ROLE** (grant delay: 7 days)
    - KintoWalletFactory:
        - `upgradeTo()`
        - `upgradeAllWalletImplementations()`
    - KintoAppRegistry:
        - `upgradeTo()`
    - KintoID:
        - `upgradeTo()`
4. **SECURITY_COUNCIL_ROLE**
    - KintoAppRegistry:
        - `updateSystemApps()`
        - `updateSystemContracts()`
        - `updateReservedContracts()`

**Configuration Change Delays:**

- KintoWalletFactory admin delay: 7 days
- KintoID admin delay: 7 days
- UPGRADER_ROLE grant delay: 7 days

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 742977 (main branch discovery), not current.

```diff
    contract AccessManager (0xacC000818e5Bbd911D5d449aA81CB5cA24024739) {
    +++ description: Standard OpenZeppelin AccessManager: Serves as a proxy contract defining the roles, permissions and delays to call functions in target contracts.
+++ description: List of roles granted to accounts.
      values.RolesGranted.0:
-        {"account":"0x2e2B1c42E38f5af81771e65D87729E57ABD1337a","delay":0,"since":1729791296,"newMember":true}
+        [{"account":"0x2e2B1c42E38f5af81771e65D87729E57ABD1337a","delay":0,"since":1729791296,"newMember":true}]
+++ description: List of roles granted to accounts.
      values.RolesGranted.1635978423191113331:
-        {"account":"0x010600ff5f36C8eF3b6Aaf2A88C2DE85C798594a","delay":259200,"since":1729806574,"newMember":true}
+        [{"account":"0x010600ff5f36C8eF3b6Aaf2A88C2DE85C798594a","delay":259200,"since":1729806574,"newMember":true}]
+++ description: List of roles granted to accounts.
      values.RolesGranted.8663528507529876195:
-        {"account":"0x28fC10E12A78f986c78F973Fc70ED88072b34c8e","delay":604800,"since":1740077455,"newMember":true}
+        [{"account":"0x2e2B1c42E38f5af81771e65D87729E57ABD1337a","delay":604800,"since":1733181166,"newMember":true},{"account":"0x28fC10E12A78f986c78F973Fc70ED88072b34c8e","delay":604800,"since":1740077455,"newMember":true}]
+++ description: List of roles granted to accounts.
      values.RolesGranted.14661544942390944024:
-        {"account":"0x28fC10E12A78f986c78F973Fc70ED88072b34c8e","delay":604800,"since":1739472657,"newMember":true}
+        [{"account":"0x28fC10E12A78f986c78F973Fc70ED88072b34c8e","delay":604800,"since":1739472657,"newMember":true}]
      values.TargetFunctionRoleUpdated.0x793500709506652Fcc61F0d2D0fDa605638D4293:
-        {"selector":"0x9089e8ae","roleId":"1635978423191113331"}
+        [{"selector":"0x8522d1b2","roleId":"1635978423191113331"},{"selector":"0xc664c714","roleId":"1635978423191113331"},{"selector":"0x9089e8ae","roleId":"1635978423191113331"}]
      values.TargetFunctionRoleUpdated.0x8a4720488CA32f1223ccFE5A087e250fE3BC5D75:
-        {"selector":"0x3659cfe6","roleId":"8663528507529876195"}
+        [{"selector":"0xf4f4b03a","roleId":"8663528507529876195"},{"selector":"0x3659cfe6","roleId":"8663528507529876195"}]
      values.TargetFunctionRoleUpdated.0x5A2b641b84b0230C8e75F55d5afd27f4Dbd59d5b:
-        {"selector":"0x72592851","roleId":"14661544942390944024"}
+        [{"selector":"0x3659cfe6","roleId":"8663528507529876195"},{"selector":"0xc233e2a3","roleId":"14661544942390944024"},{"selector":"0x0e6ff432","roleId":"14661544942390944024"},{"selector":"0x72592851","roleId":"14661544942390944024"}]
      values.TargetFunctionRoleUpdated.0xf369f78E3A0492CC4e96a90dae0728A38498e9c7:
-        {"selector":"0x3659cfe6","roleId":"8663528507529876195"}
+        [{"selector":"0x3659cfe6","roleId":"8663528507529876195"}]
+++ description: List of roles revoked from accounts.
      values.RolesRevoked:
+        {}
      fieldMeta.RolesRevoked:
+        {"description":"List of roles revoked from accounts."}
    }
```

Generated with discovered.json: 0x561a917022e5b5e4148934a9059dfe12e2243921

# Diff at Tue, 18 Feb 2025 12:20:16 GMT:

- chain: kinto
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@aff7e43e1c06f559de916763e04088cc23b3e08e block: 735231
- current block number: 742977

## Description

SECURITY_COUNCIL_ROLE added to AccessManager and targets configured. SC granted multiple roles in KintoID while not removing the other actors.

Waiting for the access manager handler to be merged to clean up the discovery.

Config related changes due to editing some descriptions and new access manager handler.

## Watched changes

```diff
    contract AccessManager (0xacC000818e5Bbd911D5d449aA81CB5cA24024739) {
    +++ description: Standard OpenZeppelin AccessManager: Serves as a proxy contract defining the roles, permissions and delays to call functions in target contracts.
      receivedPermissions.9:
+        {"permission":"upgrade","from":"0xf369f78E3A0492CC4e96a90dae0728A38498e9c7"}
      receivedPermissions.8:
+        {"permission":"upgrade","from":"0x8a4720488CA32f1223ccFE5A087e250fE3BC5D75"}
      receivedPermissions.7:
+        {"permission":"upgrade","from":"0x793500709506652Fcc61F0d2D0fDa605638D4293"}
      receivedPermissions.6:
+        {"permission":"upgrade","from":"0x5A2b641b84b0230C8e75F55d5afd27f4Dbd59d5b"}
      receivedPermissions.5.permission:
-        "upgrade"
+        "interact"
      receivedPermissions.5.from:
-        "0x8a4720488CA32f1223ccFE5A087e250fE3BC5D75"
+        "0xf369f78E3A0492CC4e96a90dae0728A38498e9c7"
      receivedPermissions.5.description:
+        "transfer KYC NFTs to a different address."
      receivedPermissions.4.permission:
-        "upgrade"
+        "interact"
      receivedPermissions.4.from:
-        "0x793500709506652Fcc61F0d2D0fDa605638D4293"
+        "0xf369f78E3A0492CC4e96a90dae0728A38498e9c7"
      receivedPermissions.4.description:
+        "permissioned to call `confirmSanction()`, which makes a temporary sanction by a KYC_PROVIDER permanent and does not grant an exit window to the affected wallet."
      receivedPermissions.3.permission:
-        "upgrade"
+        "interact"
      receivedPermissions.3.from:
-        "0x5A2b641b84b0230C8e75F55d5afd27f4Dbd59d5b"
+        "0xf369f78E3A0492CC4e96a90dae0728A38498e9c7"
      receivedPermissions.3.description:
+        "manage the KYC status of any user (sanction status and KYC metadata) and mint/burn KintoID NFTs."
      values.accessControl.roles.UPGRADER_ROLE.members.1:
+        {"member":"0x28fC10E12A78f986c78F973Fc70ED88072b34c8e","since":1740077455,"executionDelay":604800}
      values.accessControl.roles.SECURITY_COUNCIL_ROLE:
+        {"members":[{"member":"0x28fC10E12A78f986c78F973Fc70ED88072b34c8e","since":1739472657,"executionDelay":604800}]}
      values.accessControl.targets.0x5A2b641b84b0230C8e75F55d5afd27f4Dbd59d5b.roleFunctions.SECURITY_COUNCIL_ROLE:
+        ["updateSystemApps(address[])","updateSystemContracts(address[])","updateReservedContracts(address[])"]
      values.accessControl.targets.0xf369f78E3A0492CC4e96a90dae0728A38498e9c7:
+        {"roleFunctions":{"UPGRADER_ROLE":["upgradeTo(address)"]},"adminDelay":604800}
      values.AdditionalRoleLabels.SECURITY_COUNCIL_ROLE:
+        ["14661544942390944024"]
      values.RolesGranted.8663528507529876195.account:
-        "0x2e2B1c42E38f5af81771e65D87729E57ABD1337a"
+        "0x28fC10E12A78f986c78F973Fc70ED88072b34c8e"
      values.RolesGranted.8663528507529876195.since:
-        1733181166
+        1740077455
+++ description: List of roles granted to accounts.
      values.RolesGranted.14661544942390944024:
+        {"account":"0x28fC10E12A78f986c78F973Fc70ED88072b34c8e","delay":604800,"since":1739472657,"newMember":true}
      values.TargetAdminDelayUpdated.0xf369f78E3A0492CC4e96a90dae0728A38498e9c7:
+        {"delay":604800,"since":1739904656}
      values.TargetFunctionRoleUpdated.0x5A2b641b84b0230C8e75F55d5afd27f4Dbd59d5b.selector:
-        "0x3659cfe6"
+        "0x72592851"
      values.TargetFunctionRoleUpdated.0x5A2b641b84b0230C8e75F55d5afd27f4Dbd59d5b.roleId:
-        "8663528507529876195"
+        "14661544942390944024"
      values.TargetFunctionRoleUpdated.0xf369f78E3A0492CC4e96a90dae0728A38498e9c7:
+        {"selector":"0x3659cfe6","roleId":"8663528507529876195"}
    }
```

```diff
    contract KintoID (0xf369f78E3A0492CC4e96a90dae0728A38498e9c7) {
    +++ description: Manages Kinto's KYC system: The KYC_PROVIDER roles responsible for the KYC status and KYC metadata of user wallets.
      issuedPermissions.13:
+        {"permission":"upgrade","to":"0xacC000818e5Bbd911D5d449aA81CB5cA24024739","via":[]}
      issuedPermissions.12:
+        {"permission":"upgrade","to":"0x2e2B1c42E38f5af81771e65D87729E57ABD1337a","via":[]}
      issuedPermissions.11:
+        {"permission":"interact","to":"0xb539019776eF803E89EC062Ad54cA24D1Fdb008a","description":"manage the KYC status of any user (sanction status and KYC metadata) and mint/burn KintoID NFTs.","via":[]}
      issuedPermissions.10:
+        {"permission":"interact","to":"0xacC000818e5Bbd911D5d449aA81CB5cA24024739","description":"transfer KYC NFTs to a different address.","via":[]}
      issuedPermissions.9.permission:
-        "upgrade"
+        "interact"
      issuedPermissions.9.to:
-        "0x2e2B1c42E38f5af81771e65D87729E57ABD1337a"
+        "0xacC000818e5Bbd911D5d449aA81CB5cA24024739"
      issuedPermissions.9.description:
+        "permissioned to call `confirmSanction()`, which makes a temporary sanction by a KYC_PROVIDER permanent and does not grant an exit window to the affected wallet."
      issuedPermissions.8.to:
-        "0xb539019776eF803E89EC062Ad54cA24D1Fdb008a"
+        "0xacC000818e5Bbd911D5d449aA81CB5cA24024739"
      values.accessControl.DEFAULT_ADMIN_ROLE.members.1:
+        "0xacC000818e5Bbd911D5d449aA81CB5cA24024739"
      values.accessControl.KYC_PROVIDER_ROLE.members.6:
+        "0xacC000818e5Bbd911D5d449aA81CB5cA24024739"
      values.accessControl.UPGRADER_ROLE.members.1:
+        "0xacC000818e5Bbd911D5d449aA81CB5cA24024739"
      values.accessControl.GOVERNANCE_ROLE.members.2:
+        "0xacC000818e5Bbd911D5d449aA81CB5cA24024739"
+++ severity: HIGH
      values.DEFAULT_ADMINs.1:
+        "0xacC000818e5Bbd911D5d449aA81CB5cA24024739"
+++ severity: HIGH
      values.GOVERNANCErs.2:
+        "0xacC000818e5Bbd911D5d449aA81CB5cA24024739"
+++ severity: MEDIUM
      values.KYC_PROVIDERs.6:
+        "0xacC000818e5Bbd911D5d449aA81CB5cA24024739"
+++ severity: HIGH
      values.UPGRADERs.1:
+        "0xacC000818e5Bbd911D5d449aA81CB5cA24024739"
    }
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 735231 (main branch discovery), not current.

```diff
    contract KintoAppRegistry (0x5A2b641b84b0230C8e75F55d5afd27f4Dbd59d5b) {
    +++ description: Central system contract defining addresses that are allowed to be called by EOAs. The modified Kinto node reads this configuration and drops all other transactions from EOAs (enforced by a modified state transition function). Accordingly, users can only transact from their smart wallets.
      fieldMeta.getSystemContracts.description:
-        "Contracts that are exempt from the STF-enforced rule that EOAs cannot call contracts."
+        "Contracts that are exempt from the STF-enforced rule that EOAs cannot call contracts. Must include ArbSys `0x0000000000000000000000000000000000000064` for ETH withdrawals from an EOA."
    }
```

```diff
    contract AccessManager (0xacC000818e5Bbd911D5d449aA81CB5cA24024739) {
    +++ description: Standard OpenZeppelin AccessManager: Serves as a proxy contract defining the roles, permissions and delays to call functions in target contracts.
      values.AdditionalRoles:
-        [{"roleId":"1635978423191113331","label":"NIO_GOVERNOR_ROLE"},{"roleId":"8663528507529876195","label":"UPGRADER_ROLE"}]
      values.accessControl:
+        {"roles":{"ADMIN_ROLE":{"members":[{"member":"0x2e2B1c42E38f5af81771e65D87729E57ABD1337a","since":1729791296,"executionDelay":0}]},"NIO_GOVERNOR_ROLE":{"members":[{"member":"0x010600ff5f36C8eF3b6Aaf2A88C2DE85C798594a","since":1729806574,"executionDelay":259200}]},"UPGRADER_ROLE":{"members":[{"member":"0x2e2B1c42E38f5af81771e65D87729E57ABD1337a","since":1733181166,"executionDelay":604800}],"grantDelay":604800}},"targets":{"0x793500709506652Fcc61F0d2D0fDa605638D4293":{"roleFunctions":{"NIO_GOVERNOR_ROLE":["sendFunds(address,uint256,address)","sendETH(uint256,address)","batchSendFunds(address[],uint256[],address[])"]}},"0x8a4720488CA32f1223ccFE5A087e250fE3BC5D75":{"roleFunctions":{"UPGRADER_ROLE":["upgradeAllWalletImplementations(address)","upgradeTo(address)"]},"adminDelay":604800},"0x5A2b641b84b0230C8e75F55d5afd27f4Dbd59d5b":{"roleFunctions":{"UPGRADER_ROLE":["upgradeTo(address)"]}}}}
+++ description: Roles (id : label) labeled apart from the standard roles PUBLIC_ROLE and ADMIN_ROLE.
      values.AdditionalRoleLabels:
+        {"NIO_GOVERNOR_ROLE":["1635978423191113331"],"UPGRADER_ROLE":["8663528507529876195"]}
      fieldMeta.AdditionalRoles:
-        {"description":"Roles (id : label) added apart from the standard roles PUBLIC_ROLE and ADMIN_ROLE."}
      fieldMeta.AdditionalRoleLabels:
+        {"description":"Roles (id : label) labeled apart from the standard roles PUBLIC_ROLE and ADMIN_ROLE."}
    }
```

```diff
+   Status: CREATED
    contract BeaconKintoWallet (0x87f0eE85bF3198654900a422832157abBba30828)
    +++ description: None
```

Generated with discovered.json: 0xb1e39ae79dd1d7444cfd8587ae5a4704d8b6b32b

# Diff at Tue, 18 Feb 2025 09:51:29 GMT:

- chain: ethereum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@aff7e43e1c06f559de916763e04088cc23b3e08e block: 21786850
- current block number: 21872461

## Description

Change descriptions.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21786850 (main branch discovery), not current.

```diff
    contract Bridger (0x0f1b7bd7762662B23486320AA91F30312184f70C) {
    +++ description: Bridger gateway that can swap assets to 'L2 final assets' defined by the admin before bridging them to the L2. It does not have a function to bridge via the canonical bridge and uses the external socket bridge by default.
      description:
-        "Bridger gateway that can swap assets to 'L2 final assets' before bridging them to the L2."
+        "Bridger gateway that can swap assets to 'L2 final assets' defined by the admin before bridging them to the L2. It does not have a function to bridge via the canonical bridge and uses the external socket bridge by default."
    }
```

Generated with discovered.json: 0x37b67b83806fca58df9b08c3cdaeedb5aa92e6c2

# Diff at Wed, 12 Feb 2025 11:32:56 GMT:

- chain: kinto
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@554a6f0e6aa688c758b37653d0be7eb446f9152e block: 725499
- current block number: 735231

## Description

Socket related contracts verified.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 725499 (main branch discovery), not current.

```diff
    contract KintoWallet (0x25EA8c663BA8cCd79284B8c4001e7A245071885c) {
    +++ description: None
      sourceHashes.0:
-        "0x5dd932e70772b9520e522fd66660bc292a8fc07ff9f9bd8da3b7c0f0bf59c89d"
+        "0xc495bc47dd31384c345f3838b96e95d73efd25ded667a30651c10ca67e13a1b4"
    }
```

```diff
    contract SignatureVerifier (0x56Ac0e336f0c3620dCaF8d361E8E14eA73C31f5d) {
    +++ description: None
      name:
-        ""
+        "SignatureVerifier"
      unverified:
-        true
      values.nominee:
+        "0x0000000000000000000000000000000000000000"
      values.owner:
+        "0x2e2B1c42E38f5af81771e65D87729E57ABD1337a"
      sourceHashes:
+        ["0x92dc8defa29353a843ae6cb6d7508811be7c65f617fe92ef87739ccdbc3fa95b"]
    }
```

```diff
    contract TransmitManager (0x6332e56A423480A211E301Cb85be12814e9238Bb) {
    +++ description: None
      name:
-        ""
+        "TransmitManager"
      unverified:
-        true
      values.chainSlug:
+        7887
      values.nominee:
+        "0x0000000000000000000000000000000000000000"
      values.owner:
+        "0x2e2B1c42E38f5af81771e65D87729E57ABD1337a"
      values.signatureVerifier__:
+        "0x56Ac0e336f0c3620dCaF8d361E8E14eA73C31f5d"
      values.socket__:
+        "0x3e9727470C66B1e77034590926CDe0242B5A3dCc"
      sourceHashes:
+        ["0x20fd759cdae5666df50f4b5723ba03796b69ef7b2b3ec33712cb158d77b97133"]
    }
```

```diff
    contract Hasher (0x9652Dd5e1388CA80712470122F27be0d1c33B48b) {
    +++ description: None
      name:
-        ""
+        "Hasher"
      unverified:
-        true
      values.nominee:
+        "0x0000000000000000000000000000000000000000"
      values.owner:
+        "0x2e2B1c42E38f5af81771e65D87729E57ABD1337a"
      sourceHashes:
+        ["0x621783ceb3c37cf9cd41112e917d760d40dbfa18e43c59f5c925fe9f7037f9be"]
    }
```

Generated with discovered.json: 0x738f727bc32927d8a352c81220441848b3a3eaf5

# Diff at Mon, 10 Feb 2025 19:05:29 GMT:

- chain: kinto
- author: Michał Podsiadły (<michal.podsiadly@l2beat.com>)
- comparing to: main@3756adff7c1ac86d8af3374a90a75c1999aae2b3 block: 725499
- current block number: 725499

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 725499 (main branch discovery), not current.

```diff
    contract KintoWallet (0x25EA8c663BA8cCd79284B8c4001e7A245071885c) {
    +++ description: None
      sourceHashes.0:
-        "0xc495bc47dd31384c345f3838b96e95d73efd25ded667a30651c10ca67e13a1b4"
+        "0x5dd932e70772b9520e522fd66660bc292a8fc07ff9f9bd8da3b7c0f0bf59c89d"
    }
```

Generated with discovered.json: 0xf270c35d33d74b2b86de2691d762798419508bf0

# Diff at Thu, 06 Feb 2025 08:52:34 GMT:

- chain: kinto
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@fa699ce266b15edb364aa471a661f580ea1a4529 block: 715537
- current block number: 725499

## Description

Small upgrade for KintoID: Intention here is assumed to want to remove the ability to effectively sanction wallets by just not bumping the `lastMonitoredAt` timestamp.
This issue is now fixed, but due to double multiplication by `1 days` (at definition of `EXIT_WINDOW_PERIOD` and again inside `isSanctionsMonitored()`) the heartbeat check now only fails after ~2367 years, making `isSanctionsMonitored()` return true for this very long time.

No gov changes yet.

## Watched changes

```diff
    contract KintoID (0xf369f78E3A0492CC4e96a90dae0728A38498e9c7) {
    +++ description: Manages Kinto's KYC system: The KYC_PROVIDER roles responsible for the KYC status and KYC metadata of user wallets.
      sourceHashes.1:
-        "0xdd266bc2e9cb84472ebc0a2583f1b1cbeb143cedb0763780f10d151ddff8f8ec"
+        "0xa0df8ed25313dba8d27c8b016413aa2843d038de01ddb01afe28b1d745427dbb"
      values.$implementation:
-        "0xaa0726829d41E3C70B84Bc5390cce82afC56871A"
+        "0x4aC06254558e144C41461a319822993900cE2eE4"
      values.$pastUpgrades.9:
+        ["2025-02-05T15:37:41.000Z","0xee19b10811d98a79d18ea4dfd1684702c0e30070a2e3cf428de3799c257b83f8",["0x4aC06254558e144C41461a319822993900cE2eE4"]]
      values.$upgradeCount:
-        9
+        10
    }
```

## Source code changes

```diff
discovery/kinto/kinto/{.flat@715537 => .flat}/KintoID/KintoID.sol | 8 ++++----
 1 file changed, 4 insertions(+), 4 deletions(-)
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 715537 (main branch discovery), not current.

```diff
    contract KintoWallet (0x25EA8c663BA8cCd79284B8c4001e7A245071885c) {
    +++ description: None
      sourceHashes.0:
-        "0x5dd932e70772b9520e522fd66660bc292a8fc07ff9f9bd8da3b7c0f0bf59c89d"
+        "0xc495bc47dd31384c345f3838b96e95d73efd25ded667a30651c10ca67e13a1b4"
    }
```

Generated with discovered.json: 0x1b42e603e4713a14ade31eaf3e26f9123526838d

# Diff at Tue, 04 Feb 2025 12:34:05 GMT:

- chain: kinto
- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@145553eed7ba44636411ecb25e4099728acd02f9 block: 715537
- current block number: 715537

## Description

Rename 'configure' permission to 'interact'

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 715537 (main branch discovery), not current.

```diff
    contract NioGuardians (0x0100005D52Be9ab3ccE0C70Abf6F6FA2C48e91C9) {
    +++ description: Contract using NFTs as voting tokens to be used by Nio Guardians in the NioGovernor.
      issuedPermissions.0.permission:
-        "configure"
+        "interact"
    }
```

```diff
    contract NioGovernor (0x010600ff5f36C8eF3b6Aaf2A88C2DE85C798594a) {
    +++ description: Governance contract allowing token- and NFT based voting.
      receivedPermissions.0.permission:
-        "configure"
+        "interact"
    }
```

```diff
    contract KintoAdminMultisig (0x2e2B1c42E38f5af81771e65D87729E57ABD1337a) {
    +++ description: None
      receivedPermissions.3.permission:
-        "configure"
+        "interact"
      receivedPermissions.2.permission:
-        "configure"
+        "interact"
      receivedPermissions.1.permission:
-        "configure"
+        "interact"
      receivedPermissions.0.permission:
-        "configure"
+        "interact"
    }
```

```diff
    contract KintoAppRegistry (0x5A2b641b84b0230C8e75F55d5afd27f4Dbd59d5b) {
    +++ description: Central system contract defining addresses that are allowed to be called by EOAs. The modified Kinto node reads this configuration and drops all other transactions from EOAs (enforced by a modified state transition function). Accordingly, users can only transact from their smart wallets.
      issuedPermissions.0.permission:
-        "configure"
+        "interact"
    }
```

```diff
    contract Treasury (0x793500709506652Fcc61F0d2D0fDa605638D4293) {
    +++ description: Kinto Treasury.
      issuedPermissions.0.permission:
-        "configure"
+        "interact"
    }
```

```diff
    contract KintoWalletFactory (0x8a4720488CA32f1223ccFE5A087e250fE3BC5D75) {
    +++ description: Deploys new KintoWallet beacon proxies when users create a wallet. Also manages the beacon implementation for all KintoWallets and their recovery logic.
      issuedPermissions.0.permission:
-        "configure"
+        "interact"
    }
```

```diff
    contract AccessManager (0xacC000818e5Bbd911D5d449aA81CB5cA24024739) {
    +++ description: Standard OpenZeppelin AccessManager: Serves as a proxy contract defining the roles, permissions and delays to call functions in target contracts.
      receivedPermissions.2.permission:
-        "configure"
+        "interact"
      receivedPermissions.1.permission:
-        "configure"
+        "interact"
      receivedPermissions.0.permission:
-        "configure"
+        "interact"
    }
```

```diff
    contract KintoID (0xf369f78E3A0492CC4e96a90dae0728A38498e9c7) {
    +++ description: Manages Kinto's KYC system: The KYC_PROVIDER roles responsible for the KYC status and KYC metadata of user wallets.
      issuedPermissions.8.permission:
-        "configure"
+        "interact"
      issuedPermissions.7.permission:
-        "configure"
+        "interact"
      issuedPermissions.6.permission:
-        "configure"
+        "interact"
      issuedPermissions.5.permission:
-        "configure"
+        "interact"
      issuedPermissions.4.permission:
-        "configure"
+        "interact"
      issuedPermissions.3.permission:
-        "configure"
+        "interact"
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

Generated with discovered.json: 0xa8e9417b7e0bc31807c08e40571ed161fafa578a

# Diff at Tue, 04 Feb 2025 12:31:35 GMT:

- chain: ethereum
- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@145553eed7ba44636411ecb25e4099728acd02f9 block: 21580548
- current block number: 21580548

## Description

Rename 'configure' permission to 'interact'

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21580548 (main branch discovery), not current.

```diff
    contract Kinto SecurityCouncil (0x17Eb10e12a78f986C78F973Fc70eD88072B33B7d) {
    +++ description: None
      receivedPermissions.0.permission:
-        "configure"
+        "interact"
    }
```

```diff
    contract RollupProxy (0x5073dA9cA4810f3E0aA01c20c7d9d02C3f522e11) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      issuedPermissions.0.permission:
-        "configure"
+        "interact"
    }
```

```diff
    contract UpgradeExecutor (0x59B851c8b1643e0735Ec3F2f0e528f3d89c3408a) {
    +++ description: Central contract defining the access control permissions for upgrading the system contract implementations.
      directlyReceivedPermissions.1.permission:
-        "configure"
+        "interact"
    }
```

Generated with discovered.json: 0xd34b17ff308ca2ac3515c18051460684b6c4b03b

# Diff at Wed, 29 Jan 2025 09:53:10 GMT:

- chain: kinto
- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@5741cb966172a3b26ba8279dd9fe4323805a53c2 block: 715537
- current block number: 715537

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 715537 (main branch discovery), not current.

```diff
    contract KintoWallet (0x25EA8c663BA8cCd79284B8c4001e7A245071885c) {
    +++ description: None
      sourceHashes.0:
-        "0xc495bc47dd31384c345f3838b96e95d73efd25ded667a30651c10ca67e13a1b4"
+        "0x5dd932e70772b9520e522fd66660bc292a8fc07ff9f9bd8da3b7c0f0bf59c89d"
    }
```

```diff
    contract KintoAdminMultisig (0x2e2B1c42E38f5af81771e65D87729E57ABD1337a) {
    +++ description: None
      receivedPermissions.6:
+        {"permission":"upgrade","from":"0xf369f78E3A0492CC4e96a90dae0728A38498e9c7"}
      receivedPermissions.5:
+        {"permission":"upgrade","from":"0x1842a4EFf3eFd24c50B63c3CF89cECEe245Fc2bd"}
      receivedPermissions.4.from:
-        "0xf369f78E3A0492CC4e96a90dae0728A38498e9c7"
+        "0x0719D47A213149E2Ef8d3f5afDaDA8a8E22dfc03"
      receivedPermissions.3.permission:
-        "upgrade"
+        "configure"
      receivedPermissions.3.from:
-        "0x1842a4EFf3eFd24c50B63c3CF89cECEe245Fc2bd"
+        "0xf369f78E3A0492CC4e96a90dae0728A38498e9c7"
      receivedPermissions.3.description:
+        "transfer KYC NFTs to a different address."
      receivedPermissions.2.permission:
-        "upgrade"
+        "configure"
      receivedPermissions.2.from:
-        "0x0719D47A213149E2Ef8d3f5afDaDA8a8E22dfc03"
+        "0xf369f78E3A0492CC4e96a90dae0728A38498e9c7"
      receivedPermissions.2.description:
+        "permissioned to call `confirmSanction()`, which makes a temporary sanction by a KYC_PROVIDER permanent and does not grant an exit window to the affected wallet."
    }
```

```diff
    contract KintoID (0xf369f78E3A0492CC4e96a90dae0728A38498e9c7) {
    +++ description: Manages Kinto's KYC system: The KYC_PROVIDER roles responsible for the KYC status and KYC metadata of user wallets.
      issuedPermissions.9:
+        {"permission":"upgrade","to":"0x2e2B1c42E38f5af81771e65D87729E57ABD1337a","via":[]}
      issuedPermissions.8:
+        {"permission":"configure","to":"0xb539019776eF803E89EC062Ad54cA24D1Fdb008a","description":"manage the KYC status of any user (sanction status and KYC metadata) and mint/burn KintoID NFTs.","via":[]}
      issuedPermissions.7.permission:
-        "upgrade"
+        "configure"
      issuedPermissions.7.to:
-        "0x2e2B1c42E38f5af81771e65D87729E57ABD1337a"
+        "0x6fe642404B7B23F31251103Ca0efb538Ad4aeC07"
      issuedPermissions.7.description:
+        "manage the KYC status of any user (sanction status and KYC metadata) and mint/burn KintoID NFTs."
      issuedPermissions.6.to:
-        "0xb539019776eF803E89EC062Ad54cA24D1Fdb008a"
+        "0x6E31039abF8d248aBed57E307C9E1b7530c269E4"
      issuedPermissions.5.to:
-        "0x6fe642404B7B23F31251103Ca0efb538Ad4aeC07"
+        "0x6E09F8A68fB5278e0C33D239dC12B2Cec33F4aC7"
      issuedPermissions.4.to:
-        "0x6E31039abF8d248aBed57E307C9E1b7530c269E4"
+        "0x52F09693c9eEaA93A64BA697e3d3e43a1eB65477"
      issuedPermissions.3.to:
-        "0x6E09F8A68fB5278e0C33D239dC12B2Cec33F4aC7"
+        "0x2e2B1c42E38f5af81771e65D87729E57ABD1337a"
      issuedPermissions.3.description:
-        "manage the KYC status of any user (sanction status and KYC metadata) and mint/burn KintoID NFTs."
+        "transfer KYC NFTs to a different address."
      issuedPermissions.2.to:
-        "0x52F09693c9eEaA93A64BA697e3d3e43a1eB65477"
+        "0x2e2B1c42E38f5af81771e65D87729E57ABD1337a"
      issuedPermissions.2.description:
-        "manage the KYC status of any user (sanction status and KYC metadata) and mint/burn KintoID NFTs."
+        "permissioned to call `confirmSanction()`, which makes a temporary sanction by a KYC_PROVIDER permanent and does not grant an exit window to the affected wallet."
    }
```

Generated with discovered.json: 0x7a1cb8aa68644700fdd613745f9578b0e0d306a3

# Diff at Tue, 28 Jan 2025 14:56:03 GMT:

- chain: kinto
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@b60bc0e936cb7b213e24f14ed69abaff22493651 block: 696015
- current block number: 715537

## Description

flagged this with mat, i cannot see any upgrade from here on blockscout.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 696015 (main branch discovery), not current.

```diff
    contract KintoWallet (0x25EA8c663BA8cCd79284B8c4001e7A245071885c) {
    +++ description: None
      sourceHashes.0:
-        "0x5dd932e70772b9520e522fd66660bc292a8fc07ff9f9bd8da3b7c0f0bf59c89d"
+        "0xc495bc47dd31384c345f3838b96e95d73efd25ded667a30651c10ca67e13a1b4"
    }
```

Generated with discovered.json: 0x1e4b495aeaa68ce66965abedeae0ad84c3cef489

# Diff at Mon, 27 Jan 2025 08:46:07 GMT:

- chain: kinto
- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@19f9c78c593bd40f9a0b28c3dce98eac1bd1d1b8 block: 696015
- current block number: 696015

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 696015 (main branch discovery), not current.

```diff
    contract AccessManager (0xacC000818e5Bbd911D5d449aA81CB5cA24024739) {
    +++ description: Standard OpenZeppelin AccessManager: Serves as a proxy contract defining the roles, permissions and delays to call functions in target contracts.
      values.RoleGrantDelayChanged.8663528507529876195.roleId:
-        "8663528507529876195"
      values.RolesGranted.0.roleId:
-        0
      values.RolesGranted.1635978423191113331.roleId:
-        "1635978423191113331"
      values.RolesGranted.8663528507529876195.roleId:
-        "8663528507529876195"
      values.TargetAdminDelayUpdated.0x8a4720488CA32f1223ccFE5A087e250fE3BC5D75.target:
-        "0x8a4720488CA32f1223ccFE5A087e250fE3BC5D75"
      values.TargetFunctionRoleUpdated.0x793500709506652Fcc61F0d2D0fDa605638D4293.target:
-        "0x793500709506652Fcc61F0d2D0fDa605638D4293"
      values.TargetFunctionRoleUpdated.0x8a4720488CA32f1223ccFE5A087e250fE3BC5D75.target:
-        "0x8a4720488CA32f1223ccFE5A087e250fE3BC5D75"
      values.TargetFunctionRoleUpdated.0x5A2b641b84b0230C8e75F55d5afd27f4Dbd59d5b.target:
-        "0x5A2b641b84b0230C8e75F55d5afd27f4Dbd59d5b"
    }
```

Generated with discovered.json: 0x3b90c528a7e398c505007bb8ada131133fc280af

# Diff at Mon, 20 Jan 2025 11:10:43 GMT:

- chain: kinto
- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@2c8b4f3d9910bb6371be9b4df87b70856e7d8c64 block: 696015
- current block number: 696015

## Description

Rerun on the same block number. Applies fixes to permissions and via field. Renames permission's target to to/from.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 696015 (main branch discovery), not current.

```diff
    contract NioGuardians (0x0100005D52Be9ab3ccE0C70Abf6F6FA2C48e91C9) {
    +++ description: Contract using NFTs as voting tokens to be used by Nio Guardians in the NioGovernor.
      issuedPermissions.0.target:
-        "0x2e2B1c42E38f5af81771e65D87729E57ABD1337a"
      issuedPermissions.0.to:
+        "0x2e2B1c42E38f5af81771e65D87729E57ABD1337a"
      issuedPermissions.0.description:
+        "mint Nio Guardian NFTs to any address, inheriting the permissions of the NFT."
    }
```

```diff
    contract NioGovernor (0x010600ff5f36C8eF3b6Aaf2A88C2DE85C798594a) {
    +++ description: Governance contract allowing token- and NFT based voting.
      receivedPermissions.0.target:
-        "0xf369f78E3A0492CC4e96a90dae0728A38498e9c7"
      receivedPermissions.0.from:
+        "0xf369f78E3A0492CC4e96a90dae0728A38498e9c7"
    }
```

```diff
    contract Faucet (0x0719D47A213149E2Ef8d3f5afDaDA8a8E22dfc03) {
    +++ description: None
      issuedPermissions.0.target:
-        "0x2e2B1c42E38f5af81771e65D87729E57ABD1337a"
      issuedPermissions.0.to:
+        "0x2e2B1c42E38f5af81771e65D87729E57ABD1337a"
    }
```

```diff
    contract SponsorPaymaster (0x1842a4EFf3eFd24c50B63c3CF89cECEe245Fc2bd) {
    +++ description: Paymaster used for user transactions eligible for sponsorship.
      issuedPermissions.0.target:
-        "0x2e2B1c42E38f5af81771e65D87729E57ABD1337a"
      issuedPermissions.0.to:
+        "0x2e2B1c42E38f5af81771e65D87729E57ABD1337a"
    }
```

```diff
    contract KintoWallet (0x25EA8c663BA8cCd79284B8c4001e7A245071885c) {
    +++ description: None
      issuedPermissions.0.target:
-        "0x8a4720488CA32f1223ccFE5A087e250fE3BC5D75"
      issuedPermissions.0.to:
+        "0x8a4720488CA32f1223ccFE5A087e250fE3BC5D75"
    }
```

```diff
    contract KintoAdminMultisig (0x2e2B1c42E38f5af81771e65D87729E57ABD1337a) {
    +++ description: None
      issuedPermissions.0.target:
-        "0x8a4720488CA32f1223ccFE5A087e250fE3BC5D75"
      issuedPermissions.0.to:
+        "0x8a4720488CA32f1223ccFE5A087e250fE3BC5D75"
      receivedPermissions.4.target:
-        "0xf369f78E3A0492CC4e96a90dae0728A38498e9c7"
      receivedPermissions.4.from:
+        "0xf369f78E3A0492CC4e96a90dae0728A38498e9c7"
      receivedPermissions.3.target:
-        "0x1842a4EFf3eFd24c50B63c3CF89cECEe245Fc2bd"
      receivedPermissions.3.from:
+        "0x1842a4EFf3eFd24c50B63c3CF89cECEe245Fc2bd"
      receivedPermissions.2.target:
-        "0x0719D47A213149E2Ef8d3f5afDaDA8a8E22dfc03"
      receivedPermissions.2.from:
+        "0x0719D47A213149E2Ef8d3f5afDaDA8a8E22dfc03"
      receivedPermissions.1.target:
-        "0xf369f78E3A0492CC4e96a90dae0728A38498e9c7"
      receivedPermissions.1.from:
+        "0xf369f78E3A0492CC4e96a90dae0728A38498e9c7"
      receivedPermissions.0.target:
-        "0x0100005D52Be9ab3ccE0C70Abf6F6FA2C48e91C9"
      receivedPermissions.0.from:
+        "0x0100005D52Be9ab3ccE0C70Abf6F6FA2C48e91C9"
    }
```

```diff
    contract L2GatewayRouter (0x340487b92808B84c2bd97C87B590EE81267E04a7) {
    +++ description: None
      issuedPermissions.0.target:
-        "0x88e03D41a6EAA9A0B93B0e2d6F1B34619cC4319b"
      issuedPermissions.0.via.0.delay:
-        0
      issuedPermissions.0.to:
+        "0x88e03D41a6EAA9A0B93B0e2d6F1B34619cC4319b"
    }
```

```diff
    contract KintoAppRegistry (0x5A2b641b84b0230C8e75F55d5afd27f4Dbd59d5b) {
    +++ description: Central system contract defining addresses that are allowed to be called by EOAs. The modified Kinto node reads this configuration and drops all other transactions from EOAs (enforced by a modified state transition function). Accordingly, users can only transact from their smart wallets.
      issuedPermissions.1.target:
-        "0xacC000818e5Bbd911D5d449aA81CB5cA24024739"
      issuedPermissions.1.to:
+        "0xacC000818e5Bbd911D5d449aA81CB5cA24024739"
      issuedPermissions.0.target:
-        "0xacC000818e5Bbd911D5d449aA81CB5cA24024739"
      issuedPermissions.0.to:
+        "0xacC000818e5Bbd911D5d449aA81CB5cA24024739"
      issuedPermissions.0.description:
+        "manage addresses that are callable by EOAs and other white-/blacklists that are enforced globally on the Kinto L2."
    }
```

```diff
    contract Treasury (0x793500709506652Fcc61F0d2D0fDa605638D4293) {
    +++ description: Kinto Treasury.
      issuedPermissions.1.target:
-        "0xacC000818e5Bbd911D5d449aA81CB5cA24024739"
      issuedPermissions.1.to:
+        "0xacC000818e5Bbd911D5d449aA81CB5cA24024739"
      issuedPermissions.0.target:
-        "0xacC000818e5Bbd911D5d449aA81CB5cA24024739"
      issuedPermissions.0.to:
+        "0xacC000818e5Bbd911D5d449aA81CB5cA24024739"
      issuedPermissions.0.description:
+        "send tokens and ETH from the Treasury to any address without delay."
    }
```

```diff
    contract  (0x87799989341A07F495287B1433eea98398FD73aA) {
    +++ description: None
      issuedPermissions.0.target:
-        "0x88e03D41a6EAA9A0B93B0e2d6F1B34619cC4319b"
      issuedPermissions.0.via.0.delay:
-        0
      issuedPermissions.0.to:
+        "0x88e03D41a6EAA9A0B93B0e2d6F1B34619cC4319b"
    }
```

```diff
    contract  (0x88e03D41a6EAA9A0B93B0e2d6F1B34619cC4319b) {
    +++ description: None
      issuedPermissions.0.target:
-        "0x88e03D41a6EAA9A0B93B0e2d6F1B34619cC4319b"
      issuedPermissions.0.via.0.delay:
-        0
      issuedPermissions.0.to:
+        "0x88e03D41a6EAA9A0B93B0e2d6F1B34619cC4319b"
      receivedPermissions.2.target:
-        "0x88e03D41a6EAA9A0B93B0e2d6F1B34619cC4319b"
      receivedPermissions.2.from:
+        "0x88e03D41a6EAA9A0B93B0e2d6F1B34619cC4319b"
      receivedPermissions.1.target:
-        "0x87799989341A07F495287B1433eea98398FD73aA"
      receivedPermissions.1.from:
+        "0x87799989341A07F495287B1433eea98398FD73aA"
      receivedPermissions.0.target:
-        "0x340487b92808B84c2bd97C87B590EE81267E04a7"
      receivedPermissions.0.from:
+        "0x340487b92808B84c2bd97C87B590EE81267E04a7"
      directlyReceivedPermissions.0.target:
-        "0x9eC0253E4174a14C0536261888416451A407Bf79"
      directlyReceivedPermissions.0.from:
+        "0x9eC0253E4174a14C0536261888416451A407Bf79"
    }
```

```diff
    contract KintoWalletFactory (0x8a4720488CA32f1223ccFE5A087e250fE3BC5D75) {
    +++ description: Deploys new KintoWallet beacon proxies when users create a wallet. Also manages the beacon implementation for all KintoWallets and their recovery logic.
      issuedPermissions.1.target:
-        "0xacC000818e5Bbd911D5d449aA81CB5cA24024739"
      issuedPermissions.1.to:
+        "0xacC000818e5Bbd911D5d449aA81CB5cA24024739"
      issuedPermissions.0.target:
-        "0xacC000818e5Bbd911D5d449aA81CB5cA24024739"
      issuedPermissions.0.to:
+        "0xacC000818e5Bbd911D5d449aA81CB5cA24024739"
      issuedPermissions.0.description:
+        "update the central KintoWallet implementation of all users on Kinto L2 and approve specific wallets for recovery via the turnkey recoverer."
      receivedPermissions.1.target:
-        "0x2e2B1c42E38f5af81771e65D87729E57ABD1337a"
      receivedPermissions.1.from:
+        "0x2e2B1c42E38f5af81771e65D87729E57ABD1337a"
      receivedPermissions.0.target:
-        "0x25EA8c663BA8cCd79284B8c4001e7A245071885c"
      receivedPermissions.0.from:
+        "0x25EA8c663BA8cCd79284B8c4001e7A245071885c"
    }
```

```diff
    contract ProxyAdmin (0x9eC0253E4174a14C0536261888416451A407Bf79) {
    +++ description: None
      directlyReceivedPermissions.2.target:
-        "0x88e03D41a6EAA9A0B93B0e2d6F1B34619cC4319b"
      directlyReceivedPermissions.2.from:
+        "0x88e03D41a6EAA9A0B93B0e2d6F1B34619cC4319b"
      directlyReceivedPermissions.1.target:
-        "0x87799989341A07F495287B1433eea98398FD73aA"
      directlyReceivedPermissions.1.from:
+        "0x87799989341A07F495287B1433eea98398FD73aA"
      directlyReceivedPermissions.0.target:
-        "0x340487b92808B84c2bd97C87B590EE81267E04a7"
      directlyReceivedPermissions.0.from:
+        "0x340487b92808B84c2bd97C87B590EE81267E04a7"
    }
```

```diff
    contract AccessManager (0xacC000818e5Bbd911D5d449aA81CB5cA24024739) {
    +++ description: Standard OpenZeppelin AccessManager: Serves as a proxy contract defining the roles, permissions and delays to call functions in target contracts.
      receivedPermissions.5.target:
-        "0x8a4720488CA32f1223ccFE5A087e250fE3BC5D75"
      receivedPermissions.5.from:
+        "0x8a4720488CA32f1223ccFE5A087e250fE3BC5D75"
      receivedPermissions.4.target:
-        "0x793500709506652Fcc61F0d2D0fDa605638D4293"
      receivedPermissions.4.from:
+        "0x793500709506652Fcc61F0d2D0fDa605638D4293"
      receivedPermissions.3.target:
-        "0x5A2b641b84b0230C8e75F55d5afd27f4Dbd59d5b"
      receivedPermissions.3.from:
+        "0x5A2b641b84b0230C8e75F55d5afd27f4Dbd59d5b"
      receivedPermissions.2.target:
-        "0x8a4720488CA32f1223ccFE5A087e250fE3BC5D75"
      receivedPermissions.2.from:
+        "0x8a4720488CA32f1223ccFE5A087e250fE3BC5D75"
      receivedPermissions.1.target:
-        "0x793500709506652Fcc61F0d2D0fDa605638D4293"
      receivedPermissions.1.from:
+        "0x793500709506652Fcc61F0d2D0fDa605638D4293"
      receivedPermissions.0.target:
-        "0x5A2b641b84b0230C8e75F55d5afd27f4Dbd59d5b"
      receivedPermissions.0.from:
+        "0x5A2b641b84b0230C8e75F55d5afd27f4Dbd59d5b"
    }
```

```diff
    contract KintoID (0xf369f78E3A0492CC4e96a90dae0728A38498e9c7) {
    +++ description: Manages Kinto's KYC system: The KYC_PROVIDER roles responsible for the KYC status and KYC metadata of user wallets.
      issuedPermissions.7.target:
-        "0x2e2B1c42E38f5af81771e65D87729E57ABD1337a"
      issuedPermissions.7.to:
+        "0x2e2B1c42E38f5af81771e65D87729E57ABD1337a"
      issuedPermissions.6.target:
-        "0xb539019776eF803E89EC062Ad54cA24D1Fdb008a"
      issuedPermissions.6.to:
+        "0xb539019776eF803E89EC062Ad54cA24D1Fdb008a"
      issuedPermissions.6.description:
+        "manage the KYC status of any user (sanction status and KYC metadata) and mint/burn KintoID NFTs."
      issuedPermissions.5.target:
-        "0x6fe642404B7B23F31251103Ca0efb538Ad4aeC07"
      issuedPermissions.5.to:
+        "0x6fe642404B7B23F31251103Ca0efb538Ad4aeC07"
      issuedPermissions.5.description:
+        "manage the KYC status of any user (sanction status and KYC metadata) and mint/burn KintoID NFTs."
      issuedPermissions.4.target:
-        "0x6E31039abF8d248aBed57E307C9E1b7530c269E4"
      issuedPermissions.4.to:
+        "0x6E31039abF8d248aBed57E307C9E1b7530c269E4"
      issuedPermissions.4.description:
+        "manage the KYC status of any user (sanction status and KYC metadata) and mint/burn KintoID NFTs."
      issuedPermissions.3.target:
-        "0x6E09F8A68fB5278e0C33D239dC12B2Cec33F4aC7"
      issuedPermissions.3.to:
+        "0x6E09F8A68fB5278e0C33D239dC12B2Cec33F4aC7"
      issuedPermissions.3.description:
+        "manage the KYC status of any user (sanction status and KYC metadata) and mint/burn KintoID NFTs."
      issuedPermissions.2.target:
-        "0x52F09693c9eEaA93A64BA697e3d3e43a1eB65477"
      issuedPermissions.2.to:
+        "0x52F09693c9eEaA93A64BA697e3d3e43a1eB65477"
      issuedPermissions.2.description:
+        "manage the KYC status of any user (sanction status and KYC metadata) and mint/burn KintoID NFTs."
      issuedPermissions.1.target:
-        "0x2e2B1c42E38f5af81771e65D87729E57ABD1337a"
      issuedPermissions.1.to:
+        "0x2e2B1c42E38f5af81771e65D87729E57ABD1337a"
      issuedPermissions.1.description:
+        "manage the KYC status of any user (sanction status and KYC metadata) and mint/burn KintoID NFTs."
      issuedPermissions.0.target:
-        "0x010600ff5f36C8eF3b6Aaf2A88C2DE85C798594a"
      issuedPermissions.0.to:
+        "0x010600ff5f36C8eF3b6Aaf2A88C2DE85C798594a"
      issuedPermissions.0.description:
+        "permissioned to call `confirmSanction()`, which makes a temporary sanction by a KYC_PROVIDER permanent and does not grant an exit window to the affected wallet."
    }
```

Generated with discovered.json: 0x4e8a5917ca4010498cbdaea6d35e04be8e1b2abb

# Diff at Mon, 20 Jan 2025 11:09:38 GMT:

- chain: ethereum
- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@2c8b4f3d9910bb6371be9b4df87b70856e7d8c64 block: 21580548
- current block number: 21580548

## Description

Rerun on the same block number. Applies fixes to permissions and via field. Renames permission's target to to/from.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21580548 (main branch discovery), not current.

```diff
    contract Bridger (0x0f1b7bd7762662B23486320AA91F30312184f70C) {
    +++ description: Bridger gateway that can swap assets to 'L2 final assets' before bridging them to the L2.
      issuedPermissions.0.target:
-        "0xf152Abda9E4ce8b134eF22Dc3C6aCe19C4895D82"
      issuedPermissions.0.to:
+        "0xf152Abda9E4ce8b134eF22Dc3C6aCe19C4895D82"
    }
```

```diff
    contract Kinto SecurityCouncil (0x17Eb10e12a78f986C78F973Fc70eD88072B33B7d) {
    +++ description: None
      receivedPermissions.10.target:
-        "0xF4Ef823D57819AC7202a081A5B49376BD28E7b3a"
      receivedPermissions.10.from:
+        "0xF4Ef823D57819AC7202a081A5B49376BD28E7b3a"
      receivedPermissions.9.target:
-        "0xD9041DeCaDcBA88844b373e7053B4AC7A3390D60"
      receivedPermissions.9.from:
+        "0xD9041DeCaDcBA88844b373e7053B4AC7A3390D60"
      receivedPermissions.8.target:
-        "0xBFfaA85c1756472fFC37e6D172A7eC0538C14474"
      receivedPermissions.8.from:
+        "0xBFfaA85c1756472fFC37e6D172A7eC0538C14474"
      receivedPermissions.7.target:
-        "0x859a53Fe2C8DA961387030E7CB498D6D20d0B2DB"
      receivedPermissions.7.from:
+        "0x859a53Fe2C8DA961387030E7CB498D6D20d0B2DB"
      receivedPermissions.6.target:
-        "0x7870D5398DB488c669B406fBE57b8d05b6A35e42"
      receivedPermissions.6.from:
+        "0x7870D5398DB488c669B406fBE57b8d05b6A35e42"
      receivedPermissions.5.target:
-        "0x655761AD5FC251F414D6993A73184B0669F278c8"
      receivedPermissions.5.from:
+        "0x655761AD5FC251F414D6993A73184B0669F278c8"
      receivedPermissions.4.target:
-        "0x6228e2FB8C561f1a5A963039Bc38Eb6D539A1A7F"
      receivedPermissions.4.from:
+        "0x6228e2FB8C561f1a5A963039Bc38Eb6D539A1A7F"
      receivedPermissions.3.target:
-        "0x59B851c8b1643e0735Ec3F2f0e528f3d89c3408a"
      receivedPermissions.3.from:
+        "0x59B851c8b1643e0735Ec3F2f0e528f3d89c3408a"
      receivedPermissions.2.target:
-        "0x52EcE832AF3DF3125BbfD6423E0425dB3fA99D3F"
      receivedPermissions.2.from:
+        "0x52EcE832AF3DF3125BbfD6423E0425dB3fA99D3F"
      receivedPermissions.1.target:
-        "0x5073dA9cA4810f3E0aA01c20c7d9d02C3f522e11"
      receivedPermissions.1.from:
+        "0x5073dA9cA4810f3E0aA01c20c7d9d02C3f522e11"
      receivedPermissions.0.target:
-        "0x5073dA9cA4810f3E0aA01c20c7d9d02C3f522e11"
      receivedPermissions.0.from:
+        "0x5073dA9cA4810f3E0aA01c20c7d9d02C3f522e11"
      directlyReceivedPermissions.0.target:
-        "0x59B851c8b1643e0735Ec3F2f0e528f3d89c3408a"
      directlyReceivedPermissions.0.from:
+        "0x59B851c8b1643e0735Ec3F2f0e528f3d89c3408a"
    }
```

```diff
    contract RollupProxy (0x5073dA9cA4810f3E0aA01c20c7d9d02C3f522e11) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      issuedPermissions.6.target:
-        "0xe528E74302FFCF6F9F6a1c973968d98F0fDbad8f"
      issuedPermissions.6.to:
+        "0xe528E74302FFCF6F9F6a1c973968d98F0fDbad8f"
      issuedPermissions.6.description:
+        "Can propose new state roots (called nodes) and challenge state roots on the host chain."
      issuedPermissions.5.target:
-        "0x944eB0a2829A859959586b10D54229278534a696"
      issuedPermissions.5.to:
+        "0x944eB0a2829A859959586b10D54229278534a696"
      issuedPermissions.5.description:
+        "Can propose new state roots (called nodes) and challenge state roots on the host chain."
      issuedPermissions.4.target:
-        "0x64Cf65036a76E3827e448cadbc53D31EefDCE04a"
      issuedPermissions.4.to:
+        "0x64Cf65036a76E3827e448cadbc53D31EefDCE04a"
      issuedPermissions.4.description:
+        "Can propose new state roots (called nodes) and challenge state roots on the host chain."
      issuedPermissions.3.target:
-        "0x58028fFbc25aE2e12b96276bDB125955F41D41f3"
      issuedPermissions.3.to:
+        "0x58028fFbc25aE2e12b96276bDB125955F41D41f3"
      issuedPermissions.3.description:
+        "Can propose new state roots (called nodes) and challenge state roots on the host chain."
      issuedPermissions.2.target:
-        "0x2bfDA59220413DEd39dD0E443620b5277EcE6348"
      issuedPermissions.2.to:
+        "0x2bfDA59220413DEd39dD0E443620b5277EcE6348"
      issuedPermissions.2.description:
+        "Can propose new state roots (called nodes) and challenge state roots on the host chain."
      issuedPermissions.1.target:
-        "0x17Eb10e12a78f986C78F973Fc70eD88072B33B7d"
      issuedPermissions.1.via.0.delay:
-        0
      issuedPermissions.1.to:
+        "0x17Eb10e12a78f986C78F973Fc70eD88072B33B7d"
      issuedPermissions.0.target:
-        "0x17Eb10e12a78f986C78F973Fc70eD88072B33B7d"
      issuedPermissions.0.via.0.delay:
-        0
      issuedPermissions.0.via.0.description:
-        "Pause and unpause and set important roles and parameters in the system contracts: Can delegate Sequencer management to a BatchPosterManager address, manage data availability, DACs and the fastConfirmer role, set the Sequencer-only window, introduce an allowList to the bridge and whitelist Inboxes/Outboxes."
      issuedPermissions.0.to:
+        "0x17Eb10e12a78f986C78F973Fc70eD88072B33B7d"
      issuedPermissions.0.description:
+        "Pause and unpause and set important roles and parameters in the system contracts: Can delegate Sequencer management to a BatchPosterManager address, manage data availability, DACs and the fastConfirmer role, set the Sequencer-only window, introduce an allowList to the bridge and whitelist Inboxes/Outboxes."
    }
```

```diff
    contract RollupEventInbox (0x52EcE832AF3DF3125BbfD6423E0425dB3fA99D3F) {
    +++ description: Helper contract sending configuration data over the bridge during the systems initialization.
      issuedPermissions.0.target:
-        "0x17Eb10e12a78f986C78F973Fc70eD88072B33B7d"
      issuedPermissions.0.via.1.delay:
-        0
      issuedPermissions.0.via.0.delay:
-        0
      issuedPermissions.0.to:
+        "0x17Eb10e12a78f986C78F973Fc70eD88072B33B7d"
    }
```

```diff
    contract UpgradeExecutor (0x59B851c8b1643e0735Ec3F2f0e528f3d89c3408a) {
    +++ description: Central contract defining the access control permissions for upgrading the system contract implementations.
      issuedPermissions.0.target:
-        "0x17Eb10e12a78f986C78F973Fc70eD88072B33B7d"
      issuedPermissions.0.via.1.delay:
-        0
      issuedPermissions.0.via.0.delay:
-        0
      issuedPermissions.0.to:
+        "0x17Eb10e12a78f986C78F973Fc70eD88072B33B7d"
      directlyReceivedPermissions.2.target:
-        "0x5073dA9cA4810f3E0aA01c20c7d9d02C3f522e11"
      directlyReceivedPermissions.2.from:
+        "0x5073dA9cA4810f3E0aA01c20c7d9d02C3f522e11"
      directlyReceivedPermissions.1.target:
-        "0x5073dA9cA4810f3E0aA01c20c7d9d02C3f522e11"
      directlyReceivedPermissions.1.from:
+        "0x5073dA9cA4810f3E0aA01c20c7d9d02C3f522e11"
      directlyReceivedPermissions.0.target:
-        "0x74C717C01425eb475A5fC55d2A4a9045fC9800df"
      directlyReceivedPermissions.0.from:
+        "0x74C717C01425eb475A5fC55d2A4a9045fC9800df"
    }
```

```diff
    contract ChallengeManager (0x6228e2FB8C561f1a5A963039Bc38Eb6D539A1A7F) {
    +++ description: Contract that allows challenging state roots. Can be called through the RollupProxy by Validators or the UpgradeExecutor.
      issuedPermissions.0.target:
-        "0x17Eb10e12a78f986C78F973Fc70eD88072B33B7d"
      issuedPermissions.0.via.1.delay:
-        0
      issuedPermissions.0.via.0.delay:
-        0
      issuedPermissions.0.to:
+        "0x17Eb10e12a78f986C78F973Fc70eD88072B33B7d"
    }
```

```diff
    contract Outbox (0x655761AD5FC251F414D6993A73184B0669F278c8) {
    +++ description: Facilitates L2 to L1 contract calls: Messages initiated from L2 (for example withdrawal messages) eventually resolve in execution on L1.
      issuedPermissions.0.target:
-        "0x17Eb10e12a78f986C78F973Fc70eD88072B33B7d"
      issuedPermissions.0.via.1.delay:
-        0
      issuedPermissions.0.via.0.delay:
-        0
      issuedPermissions.0.to:
+        "0x17Eb10e12a78f986C78F973Fc70eD88072B33B7d"
    }
```

```diff
    contract ProxyAdmin (0x74C717C01425eb475A5fC55d2A4a9045fC9800df) {
    +++ description: None
      directlyReceivedPermissions.8.target:
-        "0xF4Ef823D57819AC7202a081A5B49376BD28E7b3a"
      directlyReceivedPermissions.8.from:
+        "0xF4Ef823D57819AC7202a081A5B49376BD28E7b3a"
      directlyReceivedPermissions.7.target:
-        "0xD9041DeCaDcBA88844b373e7053B4AC7A3390D60"
      directlyReceivedPermissions.7.from:
+        "0xD9041DeCaDcBA88844b373e7053B4AC7A3390D60"
      directlyReceivedPermissions.6.target:
-        "0xBFfaA85c1756472fFC37e6D172A7eC0538C14474"
      directlyReceivedPermissions.6.from:
+        "0xBFfaA85c1756472fFC37e6D172A7eC0538C14474"
      directlyReceivedPermissions.5.target:
-        "0x859a53Fe2C8DA961387030E7CB498D6D20d0B2DB"
      directlyReceivedPermissions.5.from:
+        "0x859a53Fe2C8DA961387030E7CB498D6D20d0B2DB"
      directlyReceivedPermissions.4.target:
-        "0x7870D5398DB488c669B406fBE57b8d05b6A35e42"
      directlyReceivedPermissions.4.from:
+        "0x7870D5398DB488c669B406fBE57b8d05b6A35e42"
      directlyReceivedPermissions.3.target:
-        "0x655761AD5FC251F414D6993A73184B0669F278c8"
      directlyReceivedPermissions.3.from:
+        "0x655761AD5FC251F414D6993A73184B0669F278c8"
      directlyReceivedPermissions.2.target:
-        "0x6228e2FB8C561f1a5A963039Bc38Eb6D539A1A7F"
      directlyReceivedPermissions.2.from:
+        "0x6228e2FB8C561f1a5A963039Bc38Eb6D539A1A7F"
      directlyReceivedPermissions.1.target:
-        "0x59B851c8b1643e0735Ec3F2f0e528f3d89c3408a"
      directlyReceivedPermissions.1.from:
+        "0x59B851c8b1643e0735Ec3F2f0e528f3d89c3408a"
      directlyReceivedPermissions.0.target:
-        "0x52EcE832AF3DF3125BbfD6423E0425dB3fA99D3F"
      directlyReceivedPermissions.0.from:
+        "0x52EcE832AF3DF3125BbfD6423E0425dB3fA99D3F"
    }
```

```diff
    contract L1ERC20Gateway (0x7870D5398DB488c669B406fBE57b8d05b6A35e42) {
    +++ description: Escrows deposited ERC-20 assets for the canonical Bridge. Upon depositing, a generic token representation will be minted at the destination. Withdrawals are initiated by the Outbox contract.
      issuedPermissions.0.target:
-        "0x17Eb10e12a78f986C78F973Fc70eD88072B33B7d"
      issuedPermissions.0.via.1.delay:
-        0
      issuedPermissions.0.via.0.delay:
-        0
      issuedPermissions.0.to:
+        "0x17Eb10e12a78f986C78F973Fc70eD88072B33B7d"
    }
```

```diff
    contract Bridge (0x859a53Fe2C8DA961387030E7CB498D6D20d0B2DB) {
    +++ description: Escrow contract for the project's gas token (can be different from ETH). Keeps a list of allowed Inboxes and Outboxes for canonical bridge messaging.
      issuedPermissions.0.target:
-        "0x17Eb10e12a78f986C78F973Fc70eD88072B33B7d"
      issuedPermissions.0.via.1.delay:
-        0
      issuedPermissions.0.via.0.delay:
-        0
      issuedPermissions.0.to:
+        "0x17Eb10e12a78f986C78F973Fc70eD88072B33B7d"
    }
```

```diff
    contract Inbox (0xBFfaA85c1756472fFC37e6D172A7eC0538C14474) {
    +++ description: Facilitates sending L1 to L2 messages like depositing ETH, but does not escrow funds.
      issuedPermissions.0.target:
-        "0x17Eb10e12a78f986C78F973Fc70eD88072B33B7d"
      issuedPermissions.0.via.1.delay:
-        0
      issuedPermissions.0.via.0.delay:
-        0
      issuedPermissions.0.to:
+        "0x17Eb10e12a78f986C78F973Fc70eD88072B33B7d"
    }
```

```diff
    contract L1GatewayRouter (0xD9041DeCaDcBA88844b373e7053B4AC7A3390D60) {
    +++ description: This routing contract maps tokens to the correct escrow (gateway) to be then bridged with canonical messaging.
      issuedPermissions.0.target:
-        "0x17Eb10e12a78f986C78F973Fc70eD88072B33B7d"
      issuedPermissions.0.via.1.delay:
-        0
      issuedPermissions.0.via.0.delay:
-        0
      issuedPermissions.0.to:
+        "0x17Eb10e12a78f986C78F973Fc70eD88072B33B7d"
    }
```

```diff
    contract BridgerOwnerMultisig (0xf152Abda9E4ce8b134eF22Dc3C6aCe19C4895D82) {
    +++ description: None
      receivedPermissions.0.target:
-        "0x0f1b7bd7762662B23486320AA91F30312184f70C"
      receivedPermissions.0.from:
+        "0x0f1b7bd7762662B23486320AA91F30312184f70C"
    }
```

```diff
    contract SequencerInbox (0xF4Ef823D57819AC7202a081A5B49376BD28E7b3a) {
    +++ description: A sequencer (registered in this contract) can submit transaction batches or commitments here.
      issuedPermissions.1.target:
-        "0x17Eb10e12a78f986C78F973Fc70eD88072B33B7d"
      issuedPermissions.1.via.1.delay:
-        0
      issuedPermissions.1.via.0.delay:
-        0
      issuedPermissions.1.to:
+        "0x17Eb10e12a78f986C78F973Fc70eD88072B33B7d"
      issuedPermissions.0.target:
-        "0xe27f3f6db6824def1738b2aACe2672aC59046a39"
      issuedPermissions.0.to:
+        "0xe27f3f6db6824def1738b2aACe2672aC59046a39"
      issuedPermissions.0.description:
+        "Can submit transaction batches or commitments to the SequencerInbox contract on the host chain."
    }
```

Generated with discovered.json: 0x8314641173b04fc416b0ddc480f7e7f30211a3dc

# Diff at Mon, 20 Jan 2025 09:26:11 GMT:

- chain: kinto
- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@82d3b5c180381f7d2d0e30406b2ac10025d0614f block: 696015
- current block number: 696015

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 696015 (main branch discovery), not current.

```diff
    contract KintoWallet (0x25EA8c663BA8cCd79284B8c4001e7A245071885c) {
    +++ description: None
      sourceHashes.0:
-        "0xc495bc47dd31384c345f3838b96e95d73efd25ded667a30651c10ca67e13a1b4"
+        "0x5dd932e70772b9520e522fd66660bc292a8fc07ff9f9bd8da3b7c0f0bf59c89d"
    }
```

Generated with discovered.json: 0x8abec7e3e2c14bde6444aebb74e4f595650e4ad1

# Diff at Mon, 13 Jan 2025 09:02:19 GMT:

- chain: ethereum
- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@c91b831cf8a00067e27832808851565a41cd3489 block: 21580548
- current block number: 21580548

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21580548 (main branch discovery), not current.

```diff
    contract Kinto SecurityCouncil (0x17Eb10e12a78f986C78F973Fc70eD88072B33B7d) {
    +++ description: None
      references:
+        [{"text":"Security Council members - Kinto Docs","href":"https://docs.kinto.xyz/kinto-the-modular-exchange/security-kyc-aml/security-council"}]
    }
```

Generated with discovered.json: 0x5c17c6f6b6df18d014267565224c68e1ed6b123f

# Diff at Wed, 08 Jan 2025 15:07:42 GMT:

- chain: ethereum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@3e3597c92f09cb5fc5a7ac01db63929f663c026f block: 21465190
- current block number: 21580548

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21465190 (main branch discovery), not current.

```diff
    contract Bridge (0x859a53Fe2C8DA961387030E7CB498D6D20d0B2DB) {
    +++ description: Escrow contract for the project's gas token (can be different from ETH). Keeps a list of allowed Inboxes and Outboxes for canonical bridge messaging.
      description:
-        "Escrow contract for the project's gas token (Can be different from ETH). Keeps a list of allowed Inboxes and Outboxes for canonical bridge messaging."
+        "Escrow contract for the project's gas token (can be different from ETH). Keeps a list of allowed Inboxes and Outboxes for canonical bridge messaging."
    }
```

Generated with discovered.json: 0x820c8568602f8dd9d7266c97ba0ddb8a7d2727e4

# Diff at Tue, 24 Dec 2024 11:54:46 GMT:

- chain: kinto
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@799e77243e46787b5be6a47a301a3e1069bfa010 block: 678494
- current block number: 686939

## Description

KYC provider role granted to new account.

Add nicer Kinto discovery config and descriptions.

## Watched changes

```diff
    contract KintoID (0xf369f78E3A0492CC4e96a90dae0728A38498e9c7) {
    +++ description: Manages Kinto's KYC system: The KYC_PROVIDER roles responsible for the KYC status and KYC metadata of user wallets.
      issuedPermissions.7:
+        {"permission":"upgrade","target":"0x2e2B1c42E38f5af81771e65D87729E57ABD1337a","via":[]}
      issuedPermissions.6.permission:
-        "upgrade"
+        "configure"
      issuedPermissions.6.target:
-        "0x2e2B1c42E38f5af81771e65D87729E57ABD1337a"
+        "0xb539019776eF803E89EC062Ad54cA24D1Fdb008a"
      issuedPermissions.5.target:
-        "0xb539019776eF803E89EC062Ad54cA24D1Fdb008a"
+        "0x6fe642404B7B23F31251103Ca0efb538Ad4aeC07"
      values.accessControl.KYC_PROVIDER_ROLE.members.5:
+        "0x6fe642404B7B23F31251103Ca0efb538Ad4aeC07"
+++ severity: MEDIUM
      values.KYC_PROVIDERs.5:
+        "0x6fe642404B7B23F31251103Ca0efb538Ad4aeC07"
    }
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 678494 (main branch discovery), not current.

```diff
    contract NioGuardians (0x0100005D52Be9ab3ccE0C70Abf6F6FA2C48e91C9) {
    +++ description: Contract using NFTs as voting tokens to be used by Nio Guardians in the NioGovernor.
      description:
+        "Contract using NFTs as voting tokens to be used by Nio Guardians in the NioGovernor."
      issuedPermissions:
+        [{"permission":"configure","target":"0x2e2B1c42E38f5af81771e65D87729E57ABD1337a","via":[]}]
    }
```

```diff
    contract NioGovernor (0x010600ff5f36C8eF3b6Aaf2A88C2DE85C798594a) {
    +++ description: Governance contract allowing token- and NFT based voting.
      description:
+        "Governance contract allowing token- and NFT based voting."
      severity:
+        "HIGH"
      receivedPermissions:
+        [{"permission":"configure","target":"0xf369f78E3A0492CC4e96a90dae0728A38498e9c7","description":"permissioned to call `confirmSanction()`, which makes a temporary sanction by a KYC_PROVIDER permanent and does not grant an exit window to the affected wallet."}]
    }
```

```diff
    contract BridgedKinto (0x010700808D59d2bb92257fCafACfe8e5bFF7aB87) {
    +++ description: KINTO token contract.
      description:
+        "KINTO token contract."
    }
```

```diff
    contract SponsorPaymaster (0x1842a4EFf3eFd24c50B63c3CF89cECEe245Fc2bd) {
    +++ description: Paymaster used for user transactions eligible for sponsorship.
      description:
+        "Paymaster used for user transactions eligible for sponsorship."
    }
```

```diff
    contract KintoAdminMultisig (0x2e2B1c42E38f5af81771e65D87729E57ABD1337a) {
    +++ description: None
      receivedPermissions.4:
+        {"permission":"upgrade","target":"0xf369f78E3A0492CC4e96a90dae0728A38498e9c7"}
      receivedPermissions.3:
+        {"permission":"upgrade","target":"0x1842a4EFf3eFd24c50B63c3CF89cECEe245Fc2bd"}
      receivedPermissions.2:
+        {"permission":"upgrade","target":"0x0719D47A213149E2Ef8d3f5afDaDA8a8E22dfc03"}
      receivedPermissions.1.permission:
-        "upgrade"
+        "configure"
      receivedPermissions.1.target:
-        "0x1842a4EFf3eFd24c50B63c3CF89cECEe245Fc2bd"
+        "0xf369f78E3A0492CC4e96a90dae0728A38498e9c7"
      receivedPermissions.1.description:
+        "manage the KYC status of any user (sanction status and KYC metadata) and mint/burn KintoID NFTs."
      receivedPermissions.0.permission:
-        "upgrade"
+        "configure"
      receivedPermissions.0.target:
-        "0x0719D47A213149E2Ef8d3f5afDaDA8a8E22dfc03"
+        "0x0100005D52Be9ab3ccE0C70Abf6F6FA2C48e91C9"
      receivedPermissions.0.description:
+        "mint Nio Guardian NFTs to any address, inheriting the permissions of the NFT."
      severity:
+        "HIGH"
    }
```

```diff
    contract KintoAppRegistry (0x5A2b641b84b0230C8e75F55d5afd27f4Dbd59d5b) {
    +++ description: Central system contract defining addresses that are allowed to be called by EOAs. The modified Kinto node reads this configuration and drops all other transactions from EOAs (enforced by a modified state transition function). Accordingly, users can only transact from their smart wallets.
      description:
-        "Central system contract defining addresses that are allowed to be called by EOAs. The modified Kinto node reads this configuration and drops all other transactions from EOAs. Accordingly, users can only transact from their smart wallets."
+        "Central system contract defining addresses that are allowed to be called by EOAs. The modified Kinto node reads this configuration and drops all other transactions from EOAs (enforced by a modified state transition function). Accordingly, users can only transact from their smart wallets."
      issuedPermissions.1:
+        {"permission":"upgrade","target":"0xacC000818e5Bbd911D5d449aA81CB5cA24024739","via":[]}
      issuedPermissions.0.permission:
-        "upgrade"
+        "configure"
      fieldMeta:
+        {"owner":{"severity":"HIGH"},"getSystemContracts":{"severity":"HIGH","description":"Contracts that are exempt from the STF-enforced rule that EOAs cannot call contracts."}}
    }
```

```diff
    contract Treasury (0x793500709506652Fcc61F0d2D0fDa605638D4293) {
    +++ description: Kinto Treasury.
      issuedPermissions.1:
+        {"permission":"upgrade","target":"0xacC000818e5Bbd911D5d449aA81CB5cA24024739","via":[]}
      issuedPermissions.0.permission:
-        "upgrade"
+        "configure"
      description:
+        "Kinto Treasury."
    }
```

```diff
    contract KintoWalletFactory (0x8a4720488CA32f1223ccFE5A087e250fE3BC5D75) {
    +++ description: Deploys new KintoWallet beacon proxies when users create a wallet. Also manages the beacon implementation for all KintoWallets and their recovery logic.
      issuedPermissions.1:
+        {"permission":"upgrade","target":"0xacC000818e5Bbd911D5d449aA81CB5cA24024739","via":[]}
      issuedPermissions.0.permission:
-        "upgrade"
+        "configure"
      description:
+        "Deploys new KintoWallet beacon proxies when users create a wallet. Also manages the beacon implementation for all KintoWallets and their recovery logic."
      fieldMeta:
+        {"owner":{"severity":"HIGH"}}
    }
```

```diff
    contract AccessManager (0xacC000818e5Bbd911D5d449aA81CB5cA24024739) {
    +++ description: Standard OpenZeppelin AccessManager: Serves as a proxy contract defining the roles, permissions and delays to call functions in target contracts.
      receivedPermissions.5:
+        {"permission":"upgrade","target":"0x8a4720488CA32f1223ccFE5A087e250fE3BC5D75"}
      receivedPermissions.4:
+        {"permission":"upgrade","target":"0x793500709506652Fcc61F0d2D0fDa605638D4293"}
      receivedPermissions.3:
+        {"permission":"upgrade","target":"0x5A2b641b84b0230C8e75F55d5afd27f4Dbd59d5b"}
      receivedPermissions.2.permission:
-        "upgrade"
+        "configure"
      receivedPermissions.2.description:
+        "update the central KintoWallet implementation of all users on Kinto L2 and approve specific wallets for recovery via the turnkey recoverer."
      receivedPermissions.1.permission:
-        "upgrade"
+        "configure"
      receivedPermissions.1.description:
+        "send tokens and ETH from the Treasury to any address without delay."
      receivedPermissions.0.permission:
-        "upgrade"
+        "configure"
      receivedPermissions.0.description:
+        "manage addresses that are callable by EOAs and other white-/blacklists that are enforced globally on the Kinto L2."
+++ description: From the constructor args. Has the ADMIN_ROLE (0).
      values.initialAdminRole:
+        "0x2e2B1c42E38f5af81771e65D87729E57ABD1337a"
      fieldMeta.OperationScheduled.description:
+        "List of scheduled operations."
      fieldMeta.initialAdminRole:
+        {"description":"From the constructor args. Has the ADMIN_ROLE (0)."}
      fieldMeta.RoleGuardianChanged:
+        {"description":"The guardian permission allows canceling operations that have been scheduled under the role."}
      fieldMeta.RoleAdminChanged:
+        {"description":"The RoleAdmin permission is required to grant the role, revoke the role and update the execution delay for the respective role."}
      fieldMeta.RoleGrantDelayChanged:
+        {"description":"Grant delay for a given `roleId`."}
      fieldMeta.TargetAdminDelayUpdated:
+        {"description":"Delay for changing the AccessManager configuration of a given target contract."}
      fieldMeta.TargetFunctionRoleUpdated:
+        {"description":"Target addresses and function selectors accessible from a given role id."}
      fieldMeta.AdditionalRoles:
+        {"description":"Roles (id : label) added apart from the standard roles PUBLIC_ROLE and ADMIN_ROLE."}
      fieldMeta.RolesGranted:
+        {"description":"List of roles granted to accounts."}
      description:
+        "Standard OpenZeppelin AccessManager: Serves as a proxy contract defining the roles, permissions and delays to call functions in target contracts."
      severity:
+        "HIGH"
    }
```

```diff
    contract KintoID (0xf369f78E3A0492CC4e96a90dae0728A38498e9c7) {
    +++ description: Manages Kinto's KYC system: The KYC_PROVIDER roles responsible for the KYC status and KYC metadata of user wallets.
      description:
-        "Manages Kinto's KYC system: KYC provider addresses and the KYC status of users."
+        "Manages Kinto's KYC system: The KYC_PROVIDER roles responsible for the KYC status and KYC metadata of user wallets."
+++ severity: HIGH
      values.DEFAULT_ADMINs:
+        ["0x2e2B1c42E38f5af81771e65D87729E57ABD1337a"]
+++ severity: HIGH
      values.GOVERNANCErs:
+        ["0x2e2B1c42E38f5af81771e65D87729E57ABD1337a","0x010600ff5f36C8eF3b6Aaf2A88C2DE85C798594a"]
+++ severity: MEDIUM
      values.KYC_PROVIDERs:
+        ["0x52F09693c9eEaA93A64BA697e3d3e43a1eB65477","0xb539019776eF803E89EC062Ad54cA24D1Fdb008a","0x6E31039abF8d248aBed57E307C9E1b7530c269E4","0x6E09F8A68fB5278e0C33D239dC12B2Cec33F4aC7","0x2e2B1c42E38f5af81771e65D87729E57ABD1337a"]
+++ severity: HIGH
      values.UPGRADERs:
+        ["0x2e2B1c42E38f5af81771e65D87729E57ABD1337a"]
      issuedPermissions:
+        [{"permission":"configure","target":"0x010600ff5f36C8eF3b6Aaf2A88C2DE85C798594a","via":[]},{"permission":"configure","target":"0x2e2B1c42E38f5af81771e65D87729E57ABD1337a","via":[]},{"permission":"configure","target":"0x52F09693c9eEaA93A64BA697e3d3e43a1eB65477","via":[]},{"permission":"configure","target":"0x6E09F8A68fB5278e0C33D239dC12B2Cec33F4aC7","via":[]},{"permission":"configure","target":"0x6E31039abF8d248aBed57E307C9E1b7530c269E4","via":[]},{"permission":"configure","target":"0xb539019776eF803E89EC062Ad54cA24D1Fdb008a","via":[]},{"permission":"upgrade","target":"0x2e2B1c42E38f5af81771e65D87729E57ABD1337a","via":[]}]
      fieldMeta:
+        {"UPGRADERs":{"severity":"HIGH"},"KYC_PROVIDERs":{"severity":"MEDIUM"},"GOVERNANCErs":{"severity":"HIGH"},"DEFAULT_ADMINs":{"severity":"HIGH"}}
    }
```

Generated with discovered.json: 0xaf1f741d783c99544b3ee4356dd1103cdb0cbc23

# Diff at Mon, 23 Dec 2024 12:29:42 GMT:

- chain: ethereum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@18325a975c44684702f30ee366361589e4c2ed8c block: 21429443
- current block number: 21465190

## Description

Config related: Celestia-Nitro wmroot added.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21429443 (main branch discovery), not current.

```diff
    contract RollupProxy (0x5073dA9cA4810f3E0aA01c20c7d9d02C3f522e11) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      usedTypes.0.arg.0xe81f986823a85105c5fd91bb53b4493d38c0c26652d23f76a7405ac889908287:
+        "Celestia Nitro 3.2.1 wasmModuleRoot"
    }
```

Generated with discovered.json: 0x7acb4802288d2af3c0fa1a8ad793cc2ffe58e589

# Diff at Wed, 18 Dec 2024 12:37:21 GMT:

- chain: kinto
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@a44ef6747febdd9930ef05420e60556c20899f13 block: 673467
- current block number: 678494

## Description

This upgrade adds the ArbSys contract (`0x0000000000000000000000000000000000000064`) as a system contract, whitelisting it in the STF to be called by EOAs. This is necessary for withdrawing ETH from Kinto from an EOA, e.g. in a forced transaction.

The token contract of the KINTO token is upgraded to integrate new delegation and token voting libraries.

## Watched changes

```diff
    contract BridgedKinto (0x010700808D59d2bb92257fCafACfe8e5bFF7aB87) {
    +++ description: None
      sourceHashes.1:
-        "0x44215a226a4f9bbe6261cc55102df996258b9a5a2456bcfd1e33e7bb9886a8a7"
+        "0x4f5f7229da06877c8ec759071cd3d1999f9680fa1d5a7e5d5381558383c25b22"
      values.$implementation:
-        "0xbE43c24500B855f0cc0D0F99361683B6C6ED73b8"
+        "0xAf968044D5DE68fE01B5a6517d0DbeE3caD8563a"
      values.$pastUpgrades.4:
+        ["2024-12-18T00:08:48.000Z","0xb0828f7016e3452a4b32bf6d987b8a8e265c5bdf5fedbcc42b51940f17d18ab8",["0xAf968044D5DE68fE01B5a6517d0DbeE3caD8563a"]]
      values.$pastUpgrades.3:
+        ["2024-12-17T20:37:39.000Z","0xbe1519e9c0c006360238f02214b8b50211659d44f2c37353ce47efdc9db07352",["0xDd11ab74e0e8B042F843447F5754376f2F303492"]]
      values.$upgradeCount:
-        3
+        5
      values.CLOCK_MODE:
+        "mode=timestamp"
    }
```

```diff
    contract KintoWallet (0x25EA8c663BA8cCd79284B8c4001e7A245071885c) {
    +++ description: None
      values.getNonce:
-        217
+        220
    }
```

```diff
    contract KintoAppRegistry (0x5A2b641b84b0230C8e75F55d5afd27f4Dbd59d5b) {
    +++ description: Central system contract defining addresses that are allowed to be called by EOAs. The modified Kinto node reads this configuration and drops all other transactions from EOAs. Accordingly, users can only transact from their smart wallets.
      values.getSystemContracts.16:
+        "0x0000000000000000000000000000000000000064"
    }
```

## Source code changes

```diff
.../BridgedKinto/BridgedKinto.sol                  | 3562 ++++++++++++--------
 1 file changed, 2213 insertions(+), 1349 deletions(-)
```

Generated with discovered.json: 0x2bd708fab05955301c1f1d6ccf735f064a471fbd

# Diff at Wed, 18 Dec 2024 12:34:31 GMT:

- chain: ethereum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@a44ef6747febdd9930ef05420e60556c20899f13 block: 21394564
- current block number: 21429443

## Description

Minor Bridger upgrade, notably adding a `rescueToken` function callable by the owner that does what it says (Bridger does not usually escrow funds, it behaves like a router).

## Watched changes

```diff
    contract Bridger (0x0f1b7bd7762662B23486320AA91F30312184f70C) {
    +++ description: Bridger gateway that can swap assets to 'L2 final assets' before bridging them to the L2.
      sourceHashes.1:
-        "0xe7c2c13ea3945f7f426234c719fd1c436d2f5e0152427b80b30ca059c9f2f4e5"
+        "0xe2aec4572349f66126b1ebb9d5e63c56d78d4655c3d036b5fdcd621c052125e5"
      values.$implementation:
-        "0x21D3921B50617BDef223207118950B0b577e4007"
+        "0xae2F80339Bdd9bd384502A62aEe956eAbF3796e6"
      values.$pastUpgrades.11:
+        ["2024-12-17T00:38:35.000Z","0x9e8c1bcb81d01c1d3ed8c7f0b34ac033d5838e341641a809a6a1ad101139e118",["0xae2F80339Bdd9bd384502A62aEe956eAbF3796e6"]]
      values.$upgradeCount:
-        11
+        12
    }
```

## Source code changes

```diff
.../{.flat@21394564 => .flat}/Bridger/Bridger.sol  | 27 ++++++++++++++++++++--
 1 file changed, 25 insertions(+), 2 deletions(-)
```

Generated with discovered.json: 0x61bb2abc25873ee5cbc6fd74a69cf3ea384a4f54

# Diff at Mon, 16 Dec 2024 13:50:33 GMT:

- chain: kinto
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@f33537d5b381f743921fc5e40006feb3f31e39a6 block: 628196
- current block number: 673467

## Description

Minor upgrade of RewardsDistributor, which disables the claim of KINTO for all new users and limits claims to actors that can provide a valid merkle proof.

## Watched changes

```diff
    contract RewardsDistributor (0xD157904639E89df05e89e0DabeEC99aE3d74F9AA) {
    +++ description: None
      sourceHashes.1:
-        "0xd15c713ccbe36c94f3701cc26df68875ded4c439ee290c429fd64be35c66d8ad"
+        "0xc84bc54272227a1f3a6c1edaf40ac11aeaf8651129538971e06e0fefa48c99bc"
      values.$implementation:
-        "0x5b4D3f7d5876a68107F755BE97cDef36091A336F"
+        "0xF3D955B4cF3489A37027f0F3484E87328dBdBB39"
      values.$pastUpgrades.7:
+        ["2024-12-13T23:57:35.000Z","0xc25ca9b0d2a50eba7cec62481c5c83f9222786f3c29479977ff1182a2871c768",["0xF3D955B4cF3489A37027f0F3484E87328dBdBB39"]]
      values.$upgradeCount:
-        7
+        8
      values.NEW_USER_REWARD_END_TIMESTAMP:
+        1734133547
    }
```

## Source code changes

```diff
.../RewardsDistributor/RewardsDistributor.sol      | 22 +++++++---------------
 1 file changed, 7 insertions(+), 15 deletions(-)
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 628196 (main branch discovery), not current.

```diff
    contract KintoWallet (0x25EA8c663BA8cCd79284B8c4001e7A245071885c) {
    +++ description: None
      sourceHashes.0:
-        "0x5dd932e70772b9520e522fd66660bc292a8fc07ff9f9bd8da3b7c0f0bf59c89d"
+        "0xc495bc47dd31384c345f3838b96e95d73efd25ded667a30651c10ca67e13a1b4"
    }
```

Generated with discovered.json: 0xd84106a81a6dc6efcdb8dc2e7a535d8d7075456b

# Diff at Wed, 11 Dec 2024 11:55:37 GMT:

- chain: kinto
- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@7435bec50d51aed22dfa02f78d9c82e72a840fed block: 628196
- current block number: 628196

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 628196 (main branch discovery), not current.

```diff
    contract KintoWallet (0x25EA8c663BA8cCd79284B8c4001e7A245071885c) {
    +++ description: None
      sourceHashes.0:
-        "0xc495bc47dd31384c345f3838b96e95d73efd25ded667a30651c10ca67e13a1b4"
+        "0x5dd932e70772b9520e522fd66660bc292a8fc07ff9f9bd8da3b7c0f0bf59c89d"
    }
```

Generated with discovered.json: 0x18e112597e752f06c69d3c1745181823b7fe811b

# Diff at Wed, 11 Dec 2024 05:59:21 GMT:

- chain: kinto
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@0e3b4aa609891cbfaf2ac16c5eae6839e5be9f68 block: 619744
- current block number: 628196

## Description

Minor upgrade that adds a `EXIT_WINDOW_PERIOD` of 10d (from the most recent sanction) to KintoID during which `add-/removeSanction()` reverts. This prevents resetting of sanctionedAt[account] TS to the latest block number, which would re-sanction a user even in the case of SC not confirming.

No changes to the permissions / roles yet.

## Watched changes

```diff
    contract KintoID (0xf369f78E3A0492CC4e96a90dae0728A38498e9c7) {
    +++ description: Manages Kinto's KYC system: KYC provider addresses and the KYC status of users.
      sourceHashes.1:
-        "0x3fa7283c94fa2072438a07fb3069ce98694353a7a07f32585e2baa41a856fca9"
+        "0xdd266bc2e9cb84472ebc0a2583f1b1cbeb143cedb0763780f10d151ddff8f8ec"
      values.$implementation:
-        "0x7CFe474936fA50181ae7c2C43EeB8806e25bc983"
+        "0xaa0726829d41E3C70B84Bc5390cce82afC56871A"
      values.$pastUpgrades.8:
+        ["2024-12-10T20:00:17.000Z","0x9fa20142e6e04305e74314e6670ecbf65477f470a9251ec55dc52ddcd34940b1",["0xaa0726829d41E3C70B84Bc5390cce82afC56871A"]]
      values.$upgradeCount:
-        8
+        9
      values.EXIT_WINDOW_PERIOD:
+        864000
      values.SANCTION_EXPIRY_PERIOD:
+        259200
    }
```

## Source code changes

```diff
.../{.flat@619744 => .flat}/KintoID/KintoID.sol    | 38 ++++++++++++++++++----
 1 file changed, 32 insertions(+), 6 deletions(-)
```

Generated with discovered.json: 0x80336ac049b71f83160acf036068f4f3f1f599d7

# Diff at Tue, 10 Dec 2024 07:40:40 GMT:

- chain: kinto
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@d01c69c8d162d3e9a035a25c270d68755988c138 block: 612370
- current block number: 619744

## Description

Config related: rediscover after beaconProxy detector fix.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 612370 (main branch discovery), not current.

```diff
    contract KintoWallet (0x25EA8c663BA8cCd79284B8c4001e7A245071885c) {
    +++ description: None
      sourceHashes.0:
-        "0x5dd932e70772b9520e522fd66660bc292a8fc07ff9f9bd8da3b7c0f0bf59c89d"
+        "0xc495bc47dd31384c345f3838b96e95d73efd25ded667a30651c10ca67e13a1b4"
    }
```

```diff
    contract KintoAdminMultisig (0x2e2B1c42E38f5af81771e65D87729E57ABD1337a) {
    +++ description: None
      values.owners:
-        ["0x660ad4B5A74130a4796B4d54BC6750Ae93C86e6c","0xc1f4D15C16A1f3555E0a5F7AeFD1e17AD4aaf40B","0x08E674c4538caE03B6c05405881dDCd95DcaF5a8","0x94561e98DD5E55271f91A103e4979aa6C493745E"]
    }
```

Generated with discovered.json: 0x62043f19ddff2ce218871d32e98be9601fbe58bb

# Diff at Mon, 09 Dec 2024 11:27:23 GMT:

- chain: kinto
- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@6e20c0da4ccb19e6a71427cc5601e1587d8abd35 block: 603429
- current block number: 612370

## Description

Provide description of changes. This section will be preserved.

## Watched changes

```diff
    contract KintoAdminMultisig (0x2e2B1c42E38f5af81771e65D87729E57ABD1337a) {
    +++ description: None
      values.getNonce:
-        3861
+        3866
    }
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 603429 (main branch discovery), not current.

```diff
    contract KintoWallet (0x25EA8c663BA8cCd79284B8c4001e7A245071885c) {
    +++ description: None
      name:
-        "SafeBeaconProxy"
+        "KintoWallet"
      sourceHashes.1:
+        "0x5dd932e70772b9520e522fd66660bc292a8fc07ff9f9bd8da3b7c0f0bf59c89d"
      sourceHashes.0:
-        "0xc495bc47dd31384c345f3838b96e95d73efd25ded667a30651c10ca67e13a1b4"
+        "0x5dd932e70772b9520e522fd66660bc292a8fc07ff9f9bd8da3b7c0f0bf59c89d"
      values.$immutable:
-        true
      values.$admin:
+        "0x8a4720488CA32f1223ccFE5A087e250fE3BC5D75"
      values.$beacon:
+        "0x87f0eE85bF3198654900a422832157abBba30828"
      values.$implementation:
+        "0xE90C1e020D9d2A74045A1365bd5abEe87Aee8D7C"
      values.$pastUpgrades:
+        [["2023-12-31T22:08:08.000Z","0xb93d5f824b37c9ebd53ba4173510c3ed01c8279fa77897f718287d99f45144d7",["0xd87FB0bF3c38f216bD1604bFa4d262F95409227d"]],["2024-01-10T02:11:16.000Z","0x5e85052f0f5dc2bb77766f70172c6b9ca9dabb294d82b7bfe123e252e0f4fc63",["0x893B0AeA9C45FA8d3b0FBbebd03d4220B9514599"]],["2024-01-23T21:33:14.000Z","0x414470a46d49f3adbea31b026b31ee0310bf5f14b6a047163b3ae2b2d1daee76",["0xAe84C7E23240Dc11f0B2711C20aEDE81E5a28fF2"]],["2024-02-01T19:03:14.000Z","0x29cfa97112038cf710734d93219a57f3b3f8a0dd6c9d1b630f57a4b3260c8515",["0x9dd64eA97fFFB2CbCd9ea87b9082250Be50FC820"]],["2024-02-15T06:48:10.000Z","0xe94e71b9178761f4e77efa1f8ac0db731607ee1efd75b8c68b632024edd26347",["0x5248F94285c737Cd088c4d25bd68D45AFA258039"]],["2024-04-29T23:39:05.000Z","0x1bb7899ea6179a8bda54a07440e97b26a8b1205ca5dda1d61d186a96cc53d91f",["0xA6ddF426008E8b7f1a70237bdEfafB5D928bA72E"]],["2024-05-21T16:36:47.000Z","0xf75350ce91b2f9ab01b40e12d4e304da06e3a98df9dbfff926221ece0658b021",["0xcF4046C914BB8E437ED07C6FD755f58f430C4DA6"]],["2024-05-22T17:18:33.000Z","0x85685091cfa0d5a4baf4cbd9c4b873ca99d0484464f052dfdd6d54894edd8822",["0xe761f7d13d6e6D70848fcD2E6bAc211db3741BA6"]],["2024-05-22T19:38:03.000Z","0xb8301be60b27d74a3cd93a176597b83d840390c34f35ed466f9c0b171904bf5d",["0xF75dAc825E27f1A146fbd5e18681892D5cbca9E8"]],["2024-05-22T21:32:50.000Z","0x7dbaf52bba314950632de04ce4b84c6e239be80b1c7eea61473275a3702d824e",["0x1d1E45adFA23457be2A595601F993d8826f11D38"]],["2024-05-22T22:41:49.000Z","0xd59013784f82e36b563318b2a47f8b59c77bea95ee539596d371752075b04f7a",["0xf411E206370B731D5461c6c70657aDC71F5aEF38"]],["2024-05-22T23:17:34.000Z","0x9a0a1e68a7096515886517da175cebb6bca1394817e4b82ef7a51a92854de83c",["0x43Ab055B44327EF3424b51e974960840d721e4D8"]],["2024-05-23T00:36:09.000Z","0x4534860f727b67344f7f32f4444e584b5bb32d5d34852903430558d31c8c618b",["0x421459c9af07ccCadf6BCA52319835c2Bfb117e2"]],["2024-05-24T01:55:24.000Z","0x76df358b38dd221b64d26546736753affa6a5f743664105039dd66e42c91a8f9",["0x8E495c2d6Be781Bd668632AA387e3e1027E80240"]],["2024-05-25T16:58:58.000Z","0x7b8edbfb7a264c7bffbd818550f03bf610667cffb50556cd235733a93c87b5c9",["0x3deAbC32b749b95Df9B125822cCb123757c4d4F1"]],["2024-05-27T16:35:38.000Z","0x2aefd6ad5ec2db239fc273701abac2b895adc967dab32ba0582a57b696421045",["0xa7040b6Ed2fC09C7485AA6A89fb2C320E2A739c3"]],["2024-05-28T22:53:09.000Z","0x02c94988c204753ed0c7179ee46543485e9aef832571a0bde46fc873565d546a",["0xe1FcA7f6d88E30914089b600A73eeF72eaC7f601"]],["2024-05-31T19:14:54.000Z","0x36c58600e88f27fe63c85880d83f4b59d3dcbdb452fc4d8c493f765f49140f7d",["0x3Ff8593329364dCDC7272fAcb853c8FeC2929B03"]],["2024-06-01T17:37:58.000Z","0xe143dd88482e3585729987aaa636c47880876963681707c71a7279a294331419",["0xa158e30099C6F7D9546eF2a519F2118E46039307"]],["2024-06-10T19:54:37.000Z","0xee90db98384f3683ab110b036f4b900b149d7b6c2d8822da09072200d66f5183",["0x2D669eB24988863aA0efA2D593DD40f174D8977B"]],["2024-06-12T16:20:50.000Z","0xed69774070322c707f1325542e505809f267ff84c27bf1f2b94acd6ef071a9d1",["0x5844A1629fC51439187093eDFd8bBD57109D858D"]],["2024-06-15T22:07:48.000Z","0x6307556dd70bee894ea0145fdc1e4f0044d7bedbd7ac3b25ae4b3b2d2a912ac5",["0xa54Fe8f99dBB9EB64d7c4E243F3c6aa5De0483Df"]],["2024-06-29T15:27:31.000Z","0x4b63dc55ffb56340d415484cb5215c8f35d05db8cab764b350872172ae75500d",["0xaF80B25F650A66F5F8e8bc67697C2160024b6Dcf"]],["2024-07-04T20:28:23.000Z","0x2fac94819bd2af509b2ee22403fa3dbf56e5e46a95582af8174977988cebf294",["0xB6026A3eB7ABee0fee3cAAb7BcfcBd6aDE5f0234"]],["2024-07-04T21:04:24.000Z","0x8025e20e6463f4b3ab05f653ce8d97db63d25ecce25caeee854f568b124e67ea",["0x39aB919098fE67f305d097d76Df0Ae04af5e640b"]],["2024-07-04T21:11:59.000Z","0x033e14c988ea46e1f6aa56bc4ce6e85c124cedeec4e1260f69add97f97a66286",["0xdDB14fAD9060afCA4FC5E1Ec108261B465Df285F"]],["2024-07-09T03:19:37.000Z","0xfa102b81f35df0137f5117f79fd9e2434e9b2479082542cfad69b888bf3924b4",["0x867969538512518e358b7b0296c4383f5bae4992"]],["2024-07-10T01:32:19.000Z","0xf7e3d8d5ddb65c6f03205fdf31223dcf00a488e884edd3f962478b3c56d230bb",["0xFF41064cC2cF1A76F4FD4f2235c766FDDFb7DCE1"]],["2024-07-10T22:25:46.000Z","0xad3511f1cc75cfff66e27ee41753037a9860686487b8226a16378e4cf599bb34",["0xC99D77eF43FCA9D491c1f5B900F74649236055C3"]],["2024-07-26T01:51:29.000Z","0xe8831f04c64c5900e29075426b477e5d859b6fc0df247e160200c941f8b2d265",["0xB15Fc6227FD696C7AD53d25a9fEE6c4831c27b16"]],["2024-08-27T16:05:25.000Z","0x2b935bf76847687fcd243758c04b4ab09489114b398400062a2f45a57ae64037",["0x667a0A293B6a95841dB5f0Bbf0F02e8e5F71C8e5"]],["2024-09-18T21:46:04.000Z","0x608c39049f980bfbbf9c7b906fe169958b276237fb9dad8ed8dedc600a168415",["0x1161a537aF45f4ca4AD984ECcf4a8E9692Bf2518"]],["2024-09-20T16:00:22.000Z","0xcebb2902d18cd8a441747fb71e60ffd3d7bee0a66e8f763901cda3f81ab06a4d",["0xE90C1e020D9d2A74045A1365bd5abEe87Aee8D7C"]]]
      values.$upgradeCount:
+        33
      values.ALL_SIGNERS:
+        3
      values.appRegistry:
+        "0x5A2b641b84b0230C8e75F55d5afd27f4Dbd59d5b"
      values.entryPoint:
+        "0x2843C269D2a64eCfA63548E8B3Fc0FD23B7F70cb"
      values.factory:
+        "0x8a4720488CA32f1223ccFE5A087e250fE3BC5D75"
      values.getAccessPoint:
+        "0xbd103754B3B4eD40BE01415c3c8F7f6A934Fe16a"
      values.getNonce:
+        217
      values.getOwners:
+        ["0x2B409E1Bb2164D6993d0189720a5A3cE8980B5c4","0x4181803232280371E02a875F51515BE57B215231"]
      values.getOwnersCount:
+        2
      values.inRecovery:
+        0
      values.insurancePolicy:
+        0
      values.insuranceTimestamp:
+        0
      values.kintoID:
+        "0xf369f78E3A0492CC4e96a90dae0728A38498e9c7"
      values.MAX_SIGNERS:
+        4
      values.MINUS_ONE_SIGNER:
+        2
      values.owners:
+        ["0x2B409E1Bb2164D6993d0189720a5A3cE8980B5c4","0x4181803232280371E02a875F51515BE57B215231"]
      values.recoverer:
+        "0xC8B7292CF52B8557d783561823EEE7BbdF55ef1C"
      values.RECOVERY_PRICE:
+        "5000000000000000000"
      values.RECOVERY_TIME:
+        604800
      values.signerPolicy:
+        2
      values.SINGLE_SIGNER:
+        1
      values.TWO_SIGNERS:
+        4
      values.WALLET_TARGET_LIMIT:
+        5
      proxyType:
+        "Beacon proxy"
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x8a4720488CA32f1223ccFE5A087e250fE3BC5D75","via":[]}]
    }
```

```diff
    contract KintoAdminMultisig (0x2e2B1c42E38f5af81771e65D87729E57ABD1337a) {
    +++ description: None
      sourceHashes.1:
+        "0x5dd932e70772b9520e522fd66660bc292a8fc07ff9f9bd8da3b7c0f0bf59c89d"
      values.$immutable:
-        true
      values.$admin:
+        "0x8a4720488CA32f1223ccFE5A087e250fE3BC5D75"
      values.$beacon:
+        "0x87f0eE85bF3198654900a422832157abBba30828"
      values.$implementation:
+        "0xE90C1e020D9d2A74045A1365bd5abEe87Aee8D7C"
      values.$pastUpgrades:
+        [["2023-12-31T22:08:08.000Z","0xb93d5f824b37c9ebd53ba4173510c3ed01c8279fa77897f718287d99f45144d7",["0xd87FB0bF3c38f216bD1604bFa4d262F95409227d"]],["2024-01-10T02:11:16.000Z","0x5e85052f0f5dc2bb77766f70172c6b9ca9dabb294d82b7bfe123e252e0f4fc63",["0x893B0AeA9C45FA8d3b0FBbebd03d4220B9514599"]],["2024-01-23T21:33:14.000Z","0x414470a46d49f3adbea31b026b31ee0310bf5f14b6a047163b3ae2b2d1daee76",["0xAe84C7E23240Dc11f0B2711C20aEDE81E5a28fF2"]],["2024-02-01T19:03:14.000Z","0x29cfa97112038cf710734d93219a57f3b3f8a0dd6c9d1b630f57a4b3260c8515",["0x9dd64eA97fFFB2CbCd9ea87b9082250Be50FC820"]],["2024-02-15T06:48:10.000Z","0xe94e71b9178761f4e77efa1f8ac0db731607ee1efd75b8c68b632024edd26347",["0x5248F94285c737Cd088c4d25bd68D45AFA258039"]],["2024-04-29T23:39:05.000Z","0x1bb7899ea6179a8bda54a07440e97b26a8b1205ca5dda1d61d186a96cc53d91f",["0xA6ddF426008E8b7f1a70237bdEfafB5D928bA72E"]],["2024-05-21T16:36:47.000Z","0xf75350ce91b2f9ab01b40e12d4e304da06e3a98df9dbfff926221ece0658b021",["0xcF4046C914BB8E437ED07C6FD755f58f430C4DA6"]],["2024-05-22T17:18:33.000Z","0x85685091cfa0d5a4baf4cbd9c4b873ca99d0484464f052dfdd6d54894edd8822",["0xe761f7d13d6e6D70848fcD2E6bAc211db3741BA6"]],["2024-05-22T19:38:03.000Z","0xb8301be60b27d74a3cd93a176597b83d840390c34f35ed466f9c0b171904bf5d",["0xF75dAc825E27f1A146fbd5e18681892D5cbca9E8"]],["2024-05-22T21:32:50.000Z","0x7dbaf52bba314950632de04ce4b84c6e239be80b1c7eea61473275a3702d824e",["0x1d1E45adFA23457be2A595601F993d8826f11D38"]],["2024-05-22T22:41:49.000Z","0xd59013784f82e36b563318b2a47f8b59c77bea95ee539596d371752075b04f7a",["0xf411E206370B731D5461c6c70657aDC71F5aEF38"]],["2024-05-22T23:17:34.000Z","0x9a0a1e68a7096515886517da175cebb6bca1394817e4b82ef7a51a92854de83c",["0x43Ab055B44327EF3424b51e974960840d721e4D8"]],["2024-05-23T00:36:09.000Z","0x4534860f727b67344f7f32f4444e584b5bb32d5d34852903430558d31c8c618b",["0x421459c9af07ccCadf6BCA52319835c2Bfb117e2"]],["2024-05-24T01:55:24.000Z","0x76df358b38dd221b64d26546736753affa6a5f743664105039dd66e42c91a8f9",["0x8E495c2d6Be781Bd668632AA387e3e1027E80240"]],["2024-05-25T16:58:58.000Z","0x7b8edbfb7a264c7bffbd818550f03bf610667cffb50556cd235733a93c87b5c9",["0x3deAbC32b749b95Df9B125822cCb123757c4d4F1"]],["2024-05-27T16:35:38.000Z","0x2aefd6ad5ec2db239fc273701abac2b895adc967dab32ba0582a57b696421045",["0xa7040b6Ed2fC09C7485AA6A89fb2C320E2A739c3"]],["2024-05-28T22:53:09.000Z","0x02c94988c204753ed0c7179ee46543485e9aef832571a0bde46fc873565d546a",["0xe1FcA7f6d88E30914089b600A73eeF72eaC7f601"]],["2024-05-31T19:14:54.000Z","0x36c58600e88f27fe63c85880d83f4b59d3dcbdb452fc4d8c493f765f49140f7d",["0x3Ff8593329364dCDC7272fAcb853c8FeC2929B03"]],["2024-06-01T17:37:58.000Z","0xe143dd88482e3585729987aaa636c47880876963681707c71a7279a294331419",["0xa158e30099C6F7D9546eF2a519F2118E46039307"]],["2024-06-10T19:54:37.000Z","0xee90db98384f3683ab110b036f4b900b149d7b6c2d8822da09072200d66f5183",["0x2D669eB24988863aA0efA2D593DD40f174D8977B"]],["2024-06-12T16:20:50.000Z","0xed69774070322c707f1325542e505809f267ff84c27bf1f2b94acd6ef071a9d1",["0x5844A1629fC51439187093eDFd8bBD57109D858D"]],["2024-06-15T22:07:48.000Z","0x6307556dd70bee894ea0145fdc1e4f0044d7bedbd7ac3b25ae4b3b2d2a912ac5",["0xa54Fe8f99dBB9EB64d7c4E243F3c6aa5De0483Df"]],["2024-06-29T15:27:31.000Z","0x4b63dc55ffb56340d415484cb5215c8f35d05db8cab764b350872172ae75500d",["0xaF80B25F650A66F5F8e8bc67697C2160024b6Dcf"]],["2024-07-04T20:28:23.000Z","0x2fac94819bd2af509b2ee22403fa3dbf56e5e46a95582af8174977988cebf294",["0xB6026A3eB7ABee0fee3cAAb7BcfcBd6aDE5f0234"]],["2024-07-04T21:04:24.000Z","0x8025e20e6463f4b3ab05f653ce8d97db63d25ecce25caeee854f568b124e67ea",["0x39aB919098fE67f305d097d76Df0Ae04af5e640b"]],["2024-07-04T21:11:59.000Z","0x033e14c988ea46e1f6aa56bc4ce6e85c124cedeec4e1260f69add97f97a66286",["0xdDB14fAD9060afCA4FC5E1Ec108261B465Df285F"]],["2024-07-09T03:19:37.000Z","0xfa102b81f35df0137f5117f79fd9e2434e9b2479082542cfad69b888bf3924b4",["0x867969538512518e358b7b0296c4383f5bae4992"]],["2024-07-10T01:32:19.000Z","0xf7e3d8d5ddb65c6f03205fdf31223dcf00a488e884edd3f962478b3c56d230bb",["0xFF41064cC2cF1A76F4FD4f2235c766FDDFb7DCE1"]],["2024-07-10T22:25:46.000Z","0xad3511f1cc75cfff66e27ee41753037a9860686487b8226a16378e4cf599bb34",["0xC99D77eF43FCA9D491c1f5B900F74649236055C3"]],["2024-07-26T01:51:29.000Z","0xe8831f04c64c5900e29075426b477e5d859b6fc0df247e160200c941f8b2d265",["0xB15Fc6227FD696C7AD53d25a9fEE6c4831c27b16"]],["2024-08-27T16:05:25.000Z","0x2b935bf76847687fcd243758c04b4ab09489114b398400062a2f45a57ae64037",["0x667a0A293B6a95841dB5f0Bbf0F02e8e5F71C8e5"]],["2024-09-18T21:46:04.000Z","0x608c39049f980bfbbf9c7b906fe169958b276237fb9dad8ed8dedc600a168415",["0x1161a537aF45f4ca4AD984ECcf4a8E9692Bf2518"]],["2024-09-20T16:00:22.000Z","0xcebb2902d18cd8a441747fb71e60ffd3d7bee0a66e8f763901cda3f81ab06a4d",["0xE90C1e020D9d2A74045A1365bd5abEe87Aee8D7C"]]]
      values.$upgradeCount:
+        33
      values.ALL_SIGNERS:
+        3
      values.appRegistry:
+        "0x5A2b641b84b0230C8e75F55d5afd27f4Dbd59d5b"
      values.entryPoint:
+        "0x2843C269D2a64eCfA63548E8B3Fc0FD23B7F70cb"
      values.factory:
+        "0x8a4720488CA32f1223ccFE5A087e250fE3BC5D75"
      values.getAccessPoint:
+        "0x474ec69B0fD5Ebc1EfcFe18B2E8Eb510D755b8C7"
      values.getNonce:
+        3861
      values.getOwners:
+        ["0x660ad4B5A74130a4796B4d54BC6750Ae93C86e6c","0xc1f4D15C16A1f3555E0a5F7AeFD1e17AD4aaf40B","0x08E674c4538caE03B6c05405881dDCd95DcaF5a8","0x94561e98DD5E55271f91A103e4979aa6C493745E"]
      values.getOwnersCount:
+        4
      values.inRecovery:
+        0
      values.insurancePolicy:
+        0
      values.insuranceTimestamp:
+        0
      values.kintoID:
+        "0xf369f78E3A0492CC4e96a90dae0728A38498e9c7"
      values.MAX_SIGNERS:
+        4
      values.MINUS_ONE_SIGNER:
+        2
      values.owners:
+        ["0x660ad4B5A74130a4796B4d54BC6750Ae93C86e6c","0xc1f4D15C16A1f3555E0a5F7AeFD1e17AD4aaf40B","0x08E674c4538caE03B6c05405881dDCd95DcaF5a8","0x94561e98DD5E55271f91A103e4979aa6C493745E"]
      values.recoverer:
+        "0xc1f4D15C16A1f3555E0a5F7AeFD1e17AD4aaf40B"
      values.RECOVERY_PRICE:
+        "5000000000000000000"
      values.RECOVERY_TIME:
+        604800
      values.signerPolicy:
+        4
      values.SINGLE_SIGNER:
+        1
      values.TWO_SIGNERS:
+        4
      values.WALLET_TARGET_LIMIT:
+        5
      proxyType:
+        "Beacon proxy"
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x8a4720488CA32f1223ccFE5A087e250fE3BC5D75","via":[]}]
    }
```

```diff
-   Status: DELETED
    contract KintoWalletBeacon (0x87f0eE85bF3198654900a422832157abBba30828)
    +++ description: None
```

```diff
    contract KintoWalletFactory (0x8a4720488CA32f1223ccFE5A087e250fE3BC5D75) {
    +++ description: None
      receivedPermissions:
+        [{"permission":"upgrade","target":"0x25EA8c663BA8cCd79284B8c4001e7A245071885c"},{"permission":"upgrade","target":"0x2e2B1c42E38f5af81771e65D87729E57ABD1337a"}]
    }
```

```diff
-   Status: DELETED
    contract KintoWalletBeacon_implemention (0xE90C1e020D9d2A74045A1365bd5abEe87Aee8D7C)
    +++ description: Implementation for all KintoWallets, managed by a beacon proxy.
```

Generated with discovered.json: 0x5ee6bca91da6a5a968b4ce0113c8e0afe8a8310a

# Diff at Sun, 08 Dec 2024 10:39:17 GMT:

- chain: kinto
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@59fd7a30471906b5a479f280731621e94e22f17c block: 583311
- current block number: 603429

## Description

KintoID upgrade: Introduction of a per-account `sanctionedAt` timestamp that gets updated to the current timestamp with every new sanction by a KYC provider role. An account is 'sanctions safe' iff 1) the KYC providers were active onchain during the previous 7d (`isSanctionsMonitored(7)`) AND 2.1) the account was never sanctioned OR 2.2) the latest sanction against the account is more than 3d ago.

```
function isSanctionsSafe(address _account) public view virtual override returns (bool) {
        return isSanctionsMonitored(7)
            && (
                _kycmetas[_account].sanctionsCount == 0
                    || (sanctionedAt[_account] != 0 && (block.timestamp - sanctionedAt[_account]) > 3 days)
            );
    }
```
Any KYC provider that is malicious could re-sanction an account at will and the account would never meet the 3d limit to be un-sanctioned even if the SC never approves. Kinto agreed on telegram to introduce a 'cooldown period' of 10d after a sanction during which `sanctionedAt` cannot be updated to the latest TS.

KYC enforcement and upgrades summary:
1. The use of smartWallets is enforced by the STF and a custom wasmModuleRoot (the l2 node queries `KintoAppRegistry` for a whitelist, all contracts not on the whitelist cannot be called by an EOA, users can thus transact exclusively through the `KintoWallet`)
2. `KintoWallet` checks the `KintoID` contract for an `isKYC` flag on every transaction (on each signature verification). This flag requires `isSanctionsSafe` which is quoted above.
3. Since `isSanctionsSafe` is required for any user to transact on Kinto, a change in its state is considered an upgrade. 

We discussed that for a potential stage 1 Kinto, a sanction / censorship of a user can be made by a centralized KYC provider, but the sanction must be voided if not actively confirmed in a short time by the Kinto SecurityCouncil.

If you have read this far, please check out [my soundcloud](https://app.excalidraw.com/s/1Pobo8fNXle/3EeVcMQJj7N).

## Watched changes

```diff
    contract KintoID (0xf369f78E3A0492CC4e96a90dae0728A38498e9c7) {
    +++ description: Manages Kinto's KYC system: KYC provider addresses and the KYC status of users.
      sourceHashes.1:
-        "0x499e44fadd43278a5324045ee02ce20064caa49a1f75976a0d8492e2fd93efae"
+        "0x3fa7283c94fa2072438a07fb3069ce98694353a7a07f32585e2baa41a856fca9"
      values.$implementation:
-        "0xd3642f5CF57A5090F173294F68Df66583521FeA0"
+        "0x7CFe474936fA50181ae7c2C43EeB8806e25bc983"
      values.$pastUpgrades.7:
+        ["2024-12-06T21:43:59.000Z","0x393717142a85ed552e3d455cd886d11abe37095fa7f7be1dd1db7214a65a74dd",["0x7CFe474936fA50181ae7c2C43EeB8806e25bc983"]]
      values.$upgradeCount:
-        7
+        8
      values.accessControl.GOVERNANCE_ROLE:
+        {"adminRole":"DEFAULT_ADMIN_ROLE","members":["0x2e2B1c42E38f5af81771e65D87729E57ABD1337a","0x010600ff5f36C8eF3b6Aaf2A88C2DE85C798594a"]}
      values.GOVERNANCE_ROLE:
+        "0x71840dc4906352362b0cdaf79870196c8e42acafade72d5d5a6d59291253ceb1"
    }
```

## Source code changes

```diff
.../{.flat@583311 => .flat}/KintoID/KintoID.sol    | 278 +++++++++++++++------
 1 file changed, 208 insertions(+), 70 deletions(-)
```

Generated with discovered.json: 0x8a5f69d0cb6b892ebfd38ca8887bac3224e03da8

# Diff at Fri, 06 Dec 2024 08:09:46 GMT:

- chain: ethereum
- author: Piotr Szlachciak (<szlachciak.piotr@gmail.com>)
- comparing to: main@f9ded76f7930b0c86788e4c4595d553b165b87d1 block: 21292450
- current block number: 21292450

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21292450 (main branch discovery), not current.

```diff
    contract ValidatorUtils (0x2b0E04Dc90e3fA58165CB41E2834B44A56E766aF) {
    +++ description: This contract implements view only utilities for validators.
      template:
+        "orbitstack/ValidatorUtils"
      description:
+        "This contract implements view only utilities for validators."
    }
```

Generated with discovered.json: 0x7062a13b9aa52460a1fcf602e585207c9ce7735d

# Diff at Thu, 05 Dec 2024 05:41:39 GMT:

- chain: kinto
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@7dc480bf5499525d0b44afce03521538ecc8ec73 block: 542901
- current block number: 583311

## Description

AccessManager is set as upgrade admin and owner of KintoWalletFactory, KintoAppRegistry (was already upgrade admin and owner of the Treasury).

Added events monitoring for the AccessManager.

Waiting for KintoID (KYC management) logic to be deployed.

Small upgrade to the SponsorPaymaster: User smartwallet transactions are sponsored by the WalletFactory contract.

## Watched changes

```diff
    contract SponsorPaymaster (0x1842a4EFf3eFd24c50B63c3CF89cECEe245Fc2bd) {
    +++ description: None
      sourceHashes.1:
-        "0xf3ee249f14ba49d1740577f11741c5fa41c4f5a406a1abccd4b670a329159275"
+        "0x3bc0ef2f981a9321d8cdbbf6e48db5cbfd6ad378646bade7b2d035407cdd2684"
      values.$implementation:
-        "0xcbb3BA88bFD944860463585A557022fceE3Cc280"
+        "0x2A10b80bE8Ee546C52Fde9b58d65D089C6B929BB"
      values.$pastUpgrades.14:
+        ["2024-12-05T01:09:11.000Z","0x1a916af8dd468332c79abaf6546f4e990c99908a26ac4d0775c63b8eaf295603",["0x2A10b80bE8Ee546C52Fde9b58d65D089C6B929BB"]]
      values.$upgradeCount:
-        14
+        15
    }
```

```diff
    contract KintoAdminMultisig (0x2e2B1c42E38f5af81771e65D87729E57ABD1337a) {
    +++ description: None
      receivedPermissions.3:
-        {"permission":"upgrade","target":"0x8a4720488CA32f1223ccFE5A087e250fE3BC5D75"}
      receivedPermissions.2:
-        {"permission":"upgrade","target":"0x5A2b641b84b0230C8e75F55d5afd27f4Dbd59d5b"}
    }
```

```diff
    contract KintoAppRegistry (0x5A2b641b84b0230C8e75F55d5afd27f4Dbd59d5b) {
    +++ description: Central system contract defining addresses that are allowed to be called by EOAs. The modified Kinto node reads this configuration and drops all other transactions from EOAs. Accordingly, users can only transact from their smart wallets.
      issuedPermissions.0.target:
-        "0x2e2B1c42E38f5af81771e65D87729E57ABD1337a"
+        "0xacC000818e5Bbd911D5d449aA81CB5cA24024739"
      values.$admin:
-        "0x2e2B1c42E38f5af81771e65D87729E57ABD1337a"
+        "0xacC000818e5Bbd911D5d449aA81CB5cA24024739"
      values.owner:
-        "0x2e2B1c42E38f5af81771e65D87729E57ABD1337a"
+        "0xacC000818e5Bbd911D5d449aA81CB5cA24024739"
    }
```

```diff
    contract KintoWalletFactory (0x8a4720488CA32f1223ccFE5A087e250fE3BC5D75) {
    +++ description: None
      issuedPermissions.0.target:
-        "0x2e2B1c42E38f5af81771e65D87729E57ABD1337a"
+        "0xacC000818e5Bbd911D5d449aA81CB5cA24024739"
      values.$admin:
-        "0x2e2B1c42E38f5af81771e65D87729E57ABD1337a"
+        "0xacC000818e5Bbd911D5d449aA81CB5cA24024739"
      values.owner:
-        "0x2e2B1c42E38f5af81771e65D87729E57ABD1337a"
+        "0xacC000818e5Bbd911D5d449aA81CB5cA24024739"
    }
```

```diff
    contract AccessManager (0xacC000818e5Bbd911D5d449aA81CB5cA24024739) {
    +++ description: None
      receivedPermissions.2:
+        {"permission":"upgrade","target":"0x8a4720488CA32f1223ccFE5A087e250fE3BC5D75"}
      receivedPermissions.1:
+        {"permission":"upgrade","target":"0x793500709506652Fcc61F0d2D0fDa605638D4293"}
      receivedPermissions.0.target:
-        "0x793500709506652Fcc61F0d2D0fDa605638D4293"
+        "0x5A2b641b84b0230C8e75F55d5afd27f4Dbd59d5b"
      values.AdditionalRoles.1:
+        {"roleId":"8663528507529876195","label":"UPGRADER_ROLE"}
      values.RoleGrantDelayChanged.8663528507529876195:
+        {"roleId":"8663528507529876195","delay":604800,"since":1733613166}
      values.RolesGranted.8663528507529876195:
+        {"roleId":"8663528507529876195","account":"0x2e2B1c42E38f5af81771e65D87729E57ABD1337a","delay":604800,"since":1733181166,"newMember":true}
      values.TargetAdminDelayUpdated.0x8a4720488CA32f1223ccFE5A087e250fE3BC5D75:
+        {"target":"0x8a4720488CA32f1223ccFE5A087e250fE3BC5D75","delay":604800,"since":1733613166}
      values.TargetFunctionRoleUpdated.0x8a4720488CA32f1223ccFE5A087e250fE3BC5D75:
+        {"target":"0x8a4720488CA32f1223ccFE5A087e250fE3BC5D75","selector":"0x3659cfe6","roleId":"8663528507529876195"}
      values.TargetFunctionRoleUpdated.0x5A2b641b84b0230C8e75F55d5afd27f4Dbd59d5b:
+        {"target":"0x5A2b641b84b0230C8e75F55d5afd27f4Dbd59d5b","selector":"0x3659cfe6","roleId":"8663528507529876195"}
    }
```

## Source code changes

```diff
.../SponsorPaymaster/SponsorPaymaster.sol                    | 12 +++++++++++-
 1 file changed, 11 insertions(+), 1 deletion(-)
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 542901 (main branch discovery), not current.

```diff
    contract AccessManager (0xacC000818e5Bbd911D5d449aA81CB5cA24024739) {
    +++ description: None
      values.AdditionalRoles:
+        [{"roleId":"1635978423191113331","label":"NIO_GOVERNOR_ROLE"}]
+++ severity: HIGH
      values.OperationScheduled:
+        []
      values.RoleAdminChanged:
+        {}
      values.RoleGrantDelayChanged:
+        {}
      values.RoleGuardianChanged:
+        {}
      values.RolesGranted:
+        {"0":{"roleId":0,"account":"0x2e2B1c42E38f5af81771e65D87729E57ABD1337a","delay":0,"since":1729791296,"newMember":true},"1635978423191113331":{"roleId":"1635978423191113331","account":"0x010600ff5f36C8eF3b6Aaf2A88C2DE85C798594a","delay":259200,"since":1729806574,"newMember":true}}
      values.TargetAdminDelayUpdated:
+        {}
      values.TargetFunctionRoleUpdated:
+        {"0x793500709506652Fcc61F0d2D0fDa605638D4293":{"target":"0x793500709506652Fcc61F0d2D0fDa605638D4293","selector":"0x9089e8ae","roleId":"1635978423191113331"}}
      fieldMeta:
+        {"OperationScheduled":{"severity":"HIGH"}}
    }
```

```diff
+   Status: CREATED
    contract NioGuardians (0x0100005D52Be9ab3ccE0C70Abf6F6FA2C48e91C9)
    +++ description: None
```

```diff
+   Status: CREATED
    contract NioGovernor (0x010600ff5f36C8eF3b6Aaf2A88C2DE85C798594a)
    +++ description: None
```

Generated with discovered.json: 0x03b98aeda868be755255be5223959d487b50d46a

# Diff at Fri, 29 Nov 2024 11:28:41 GMT:

- chain: ethereum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@9776abb8b1f960f6f1ec6ec27558b5eff7eb5b87 block: 21292450
- current block number: 21292450

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21292450 (main branch discovery), not current.

```diff
    contract Kinto SecurityCouncil (0x17Eb10e12a78f986C78F973Fc70eD88072B33B7d) {
    +++ description: None
      receivedPermissions.0.description:
-        "can pause and unpause and set important roles and parameters in the system contracts: Can delegate Sequencer management to a BatchPosterManager address, manage data availability, DACs and the fastConfirmer role, set the Sequencer-only window, introduce an allowList to the bridge and whitelist Inboxes/Outboxes."
+        "Pause and unpause and set important roles and parameters in the system contracts: Can delegate Sequencer management to a BatchPosterManager address, manage data availability, DACs and the fastConfirmer role, set the Sequencer-only window, introduce an allowList to the bridge and whitelist Inboxes/Outboxes."
    }
```

```diff
    contract RollupProxy (0x5073dA9cA4810f3E0aA01c20c7d9d02C3f522e11) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      issuedPermissions.0.via.0.description:
-        "can pause and unpause and set important roles and parameters in the system contracts: Can delegate Sequencer management to a BatchPosterManager address, manage data availability, DACs and the fastConfirmer role, set the Sequencer-only window, introduce an allowList to the bridge and whitelist Inboxes/Outboxes."
+        "Pause and unpause and set important roles and parameters in the system contracts: Can delegate Sequencer management to a BatchPosterManager address, manage data availability, DACs and the fastConfirmer role, set the Sequencer-only window, introduce an allowList to the bridge and whitelist Inboxes/Outboxes."
    }
```

```diff
    contract UpgradeExecutor (0x59B851c8b1643e0735Ec3F2f0e528f3d89c3408a) {
    +++ description: Central contract defining the access control permissions for upgrading the system contract implementations.
      directlyReceivedPermissions.1.description:
-        "can pause and unpause and set important roles and parameters in the system contracts: Can delegate Sequencer management to a BatchPosterManager address, manage data availability, DACs and the fastConfirmer role, set the Sequencer-only window, introduce an allowList to the bridge and whitelist Inboxes/Outboxes."
+        "Pause and unpause and set important roles and parameters in the system contracts: Can delegate Sequencer management to a BatchPosterManager address, manage data availability, DACs and the fastConfirmer role, set the Sequencer-only window, introduce an allowList to the bridge and whitelist Inboxes/Outboxes."
    }
```

Generated with discovered.json: 0xe77bfb77ccf4aca1b091e7011b0da9adf61d2352

# Diff at Fri, 29 Nov 2024 09:31:33 GMT:

- chain: ethereum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@c60f4ba86fcd7b86d6876d1634b83081095f33d7 block: 21184697
- current block number: 21292450

## Description

Config related: remove manual template override.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21184697 (main branch discovery), not current.

```diff
    contract Kinto SecurityCouncil (0x17Eb10e12a78f986C78F973Fc70eD88072B33B7d) {
    +++ description: None
      receivedPermissions.0.description:
-        "can pause and unpause and set important roles and parameters in the system contracts: Can delegate Sequencer management to a BatchPosterManager address, manage data availability and DACs, set the Sequencer-only window, introduce an allowList to the bridge and whitelist Inboxes/Outboxes."
+        "can pause and unpause and set important roles and parameters in the system contracts: Can delegate Sequencer management to a BatchPosterManager address, manage data availability, DACs and the fastConfirmer role, set the Sequencer-only window, introduce an allowList to the bridge and whitelist Inboxes/Outboxes."
    }
```

```diff
    contract RollupProxy (0x5073dA9cA4810f3E0aA01c20c7d9d02C3f522e11) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      template:
-        "orbitstack/RollupProxy"
+        "orbitstack/RollupProxy_fastConfirm"
      issuedPermissions.0.via.0.description:
-        "can pause and unpause and set important roles and parameters in the system contracts: Can delegate Sequencer management to a BatchPosterManager address, manage data availability and DACs, set the Sequencer-only window, introduce an allowList to the bridge and whitelist Inboxes/Outboxes."
+        "can pause and unpause and set important roles and parameters in the system contracts: Can delegate Sequencer management to a BatchPosterManager address, manage data availability, DACs and the fastConfirmer role, set the Sequencer-only window, introduce an allowList to the bridge and whitelist Inboxes/Outboxes."
      fieldMeta.minimumAssertionPeriod:
+        {"description":"Minimum time delta between newly created nodes (stateUpdates). This is checked on `stakeOnNewNode()`. Format is number of ETHEREUM blocks, even for L3s. "}
    }
```

```diff
    contract UpgradeExecutor (0x59B851c8b1643e0735Ec3F2f0e528f3d89c3408a) {
    +++ description: Central contract defining the access control permissions for upgrading the system contract implementations.
      directlyReceivedPermissions.1.description:
-        "can pause and unpause and set important roles and parameters in the system contracts: Can delegate Sequencer management to a BatchPosterManager address, manage data availability and DACs, set the Sequencer-only window, introduce an allowList to the bridge and whitelist Inboxes/Outboxes."
+        "can pause and unpause and set important roles and parameters in the system contracts: Can delegate Sequencer management to a BatchPosterManager address, manage data availability, DACs and the fastConfirmer role, set the Sequencer-only window, introduce an allowList to the bridge and whitelist Inboxes/Outboxes."
    }
```

Generated with discovered.json: 0xb60a112bf4be962e2af34170e8ef65a733fbc8be

# Diff at Thu, 28 Nov 2024 12:52:13 GMT:

- chain: kinto
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- current block number: 542592

## Description

Initial discovery for Kinto on Kinto: Focusing on the AppRegistry, KintoID and 'KintoWallet' smartwallet.

## Initial discovery

```diff
+   Status: CREATED
    contract BridgedKinto (0x010700808D59d2bb92257fCafACfe8e5bFF7aB87)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Faucet (0x0719D47A213149E2Ef8d3f5afDaDA8a8E22dfc03)
    +++ description: None
```

```diff
+   Status: CREATED
    contract SponsorPaymaster (0x1842a4EFf3eFd24c50B63c3CF89cECEe245Fc2bd)
    +++ description: None
```

```diff
+   Status: CREATED
    contract SafeBeaconProxy (0x25EA8c663BA8cCd79284B8c4001e7A245071885c)
    +++ description: None
```

```diff
+   Status: CREATED
    contract EntryPoint (0x2843C269D2a64eCfA63548E8B3Fc0FD23B7F70cb)
    +++ description: None
```

```diff
+   Status: CREATED
    contract KintoAdminMultisig (0x2e2B1c42E38f5af81771e65D87729E57ABD1337a)
    +++ description: None
```

```diff
+   Status: CREATED
    contract L2GatewayRouter (0x340487b92808B84c2bd97C87B590EE81267E04a7)
    +++ description: None
```

```diff
+   Status: CREATED
    contract  (0x35B1Ca86D564e69FA38Ee456C12c78A62e78Aa4c)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Socket (0x3e9727470C66B1e77034590926CDe0242B5A3dCc)
    +++ description: None
```

```diff
+   Status: CREATED
    contract  (0x56Ac0e336f0c3620dCaF8d361E8E14eA73C31f5d)
    +++ description: None
```

```diff
+   Status: CREATED
    contract KintoAppRegistry (0x5A2b641b84b0230C8e75F55d5afd27f4Dbd59d5b)
    +++ description: Central system contract defining addresses that are allowed to be called by EOAs. The modified Kinto node reads this configuration and drops all other transactions from EOAs. Accordingly, users can only transact from their smart wallets.
```

```diff
+   Status: CREATED
    contract  (0x6332e56A423480A211E301Cb85be12814e9238Bb)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Treasury (0x793500709506652Fcc61F0d2D0fDa605638D4293)
    +++ description: None
```

```diff
+   Status: CREATED
    contract  (0x87799989341A07F495287B1433eea98398FD73aA)
    +++ description: None
```

```diff
+   Status: CREATED
    contract KintoWalletBeacon (0x87f0eE85bF3198654900a422832157abBba30828)
    +++ description: None
```

```diff
+   Status: CREATED
    contract  (0x88e03D41a6EAA9A0B93B0e2d6F1B34619cC4319b)
    +++ description: None
```

```diff
+   Status: CREATED
    contract KintoWalletFactory (0x8a4720488CA32f1223ccFE5A087e250fE3BC5D75)
    +++ description: None
```

```diff
+   Status: CREATED
    contract BundleBulker (0x8d2D899402ed84b6c0510bB1ad34ee436ADDD20d)
    +++ description: None
```

```diff
+   Status: CREATED
    contract  (0x9652Dd5e1388CA80712470122F27be0d1c33B48b)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ProxyAdmin (0x9eC0253E4174a14C0536261888416451A407Bf79)
    +++ description: None
```

```diff
+   Status: CREATED
    contract AccessManager (0xacC000818e5Bbd911D5d449aA81CB5cA24024739)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ExecutionManagerDF (0xc8a4D2fd77c155fd52e65Ab07F337aBF84495Ead)
    +++ description: None
```

```diff
+   Status: CREATED
    contract RewardsDistributor (0xD157904639E89df05e89e0DabeEC99aE3d74F9AA)
    +++ description: None
```

```diff
+   Status: CREATED
    contract KintoWalletBeacon_implemention (0xE90C1e020D9d2A74045A1365bd5abEe87Aee8D7C)
    +++ description: Implementation for all KintoWallets, managed by a beacon proxy.
```

```diff
+   Status: CREATED
    contract KintoID (0xf369f78E3A0492CC4e96a90dae0728A38498e9c7)
    +++ description: Manages Kinto's KYC system: KYC provider addresses and the KYC status of users.
```

Generated with discovered.json: 0xabb1318f80d8c295e4a215849d988bb001cf62b9

# Diff at Fri, 15 Nov 2024 08:18:11 GMT:

- chain: ethereum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@a00c2a67d12a174a45864b549412045028598606 block: 21184697
- current block number: 21184697

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21184697 (main branch discovery), not current.

```diff
    contract RollupProxy (0x5073dA9cA4810f3E0aA01c20c7d9d02C3f522e11) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      issuedPermissions.11:
-        {"permission":"upgrade","target":"0x17Eb10e12a78f986C78F973Fc70eD88072B33B7d","via":[{"address":"0x59B851c8b1643e0735Ec3F2f0e528f3d89c3408a","delay":0}]}
      issuedPermissions.10:
-        {"permission":"propose","target":"0xe528E74302FFCF6F9F6a1c973968d98F0fDbad8f","via":[]}
      issuedPermissions.9:
-        {"permission":"propose","target":"0x944eB0a2829A859959586b10D54229278534a696","via":[]}
      issuedPermissions.8:
-        {"permission":"propose","target":"0x64Cf65036a76E3827e448cadbc53D31EefDCE04a","via":[]}
      issuedPermissions.7:
-        {"permission":"propose","target":"0x58028fFbc25aE2e12b96276bDB125955F41D41f3","via":[]}
      issuedPermissions.6.permission:
-        "propose"
+        "validate"
      issuedPermissions.6.target:
-        "0x2bfDA59220413DEd39dD0E443620b5277EcE6348"
+        "0xe528E74302FFCF6F9F6a1c973968d98F0fDbad8f"
      issuedPermissions.5.permission:
-        "configure"
+        "validate"
      issuedPermissions.5.target:
-        "0x17Eb10e12a78f986C78F973Fc70eD88072B33B7d"
+        "0x944eB0a2829A859959586b10D54229278534a696"
      issuedPermissions.5.via.0:
-        {"address":"0x59B851c8b1643e0735Ec3F2f0e528f3d89c3408a","delay":0,"description":"can pause and unpause and set important roles and parameters in the system contracts: Can delegate Sequencer management to a BatchPosterManager address, manage data availability and DACs, set the Sequencer-only window, introduce an allowList to the bridge and whitelist Inboxes/Outboxes."}
      issuedPermissions.4.permission:
-        "challenge"
+        "validate"
      issuedPermissions.4.target:
-        "0xe528E74302FFCF6F9F6a1c973968d98F0fDbad8f"
+        "0x64Cf65036a76E3827e448cadbc53D31EefDCE04a"
      issuedPermissions.3.permission:
-        "challenge"
+        "validate"
      issuedPermissions.3.target:
-        "0x944eB0a2829A859959586b10D54229278534a696"
+        "0x58028fFbc25aE2e12b96276bDB125955F41D41f3"
      issuedPermissions.2.permission:
-        "challenge"
+        "validate"
      issuedPermissions.2.target:
-        "0x64Cf65036a76E3827e448cadbc53D31EefDCE04a"
+        "0x2bfDA59220413DEd39dD0E443620b5277EcE6348"
      issuedPermissions.1.permission:
-        "challenge"
+        "upgrade"
      issuedPermissions.1.target:
-        "0x58028fFbc25aE2e12b96276bDB125955F41D41f3"
+        "0x17Eb10e12a78f986C78F973Fc70eD88072B33B7d"
      issuedPermissions.1.via.0:
+        {"address":"0x59B851c8b1643e0735Ec3F2f0e528f3d89c3408a","delay":0}
      issuedPermissions.0.permission:
-        "challenge"
+        "configure"
      issuedPermissions.0.target:
-        "0x2bfDA59220413DEd39dD0E443620b5277EcE6348"
+        "0x17Eb10e12a78f986C78F973Fc70eD88072B33B7d"
      issuedPermissions.0.via.0:
+        {"address":"0x59B851c8b1643e0735Ec3F2f0e528f3d89c3408a","delay":0,"description":"can pause and unpause and set important roles and parameters in the system contracts: Can delegate Sequencer management to a BatchPosterManager address, manage data availability and DACs, set the Sequencer-only window, introduce an allowList to the bridge and whitelist Inboxes/Outboxes."}
    }
```

```diff
    contract RollupEventInbox (0x52EcE832AF3DF3125BbfD6423E0425dB3fA99D3F) {
    +++ description: Helper contract sending configuration data over the bridge during the systems initialization.
      template:
+        "orbitstack/RollupEventInbox"
      description:
+        "Helper contract sending configuration data over the bridge during the systems initialization."
    }
```

```diff
    contract UpgradeExecutor (0x59B851c8b1643e0735Ec3F2f0e528f3d89c3408a) {
    +++ description: Central contract defining the access control permissions for upgrading the system contract implementations.
      description:
-        "Central contract defining the access control for upgrading the system contract implementations."
+        "Central contract defining the access control permissions for upgrading the system contract implementations."
    }
```

```diff
    contract L1GatewayRouter (0xD9041DeCaDcBA88844b373e7053B4AC7A3390D60) {
    +++ description: This routing contract maps tokens to the correct escrow (gateway) to be then bridged with canonical messaging.
      template:
+        "orbitstack/GatewayRouter"
      displayName:
+        "GatewayRouter"
      description:
+        "This routing contract maps tokens to the correct escrow (gateway) to be then bridged with canonical messaging."
    }
```

```diff
    contract SequencerInbox (0xF4Ef823D57819AC7202a081A5B49376BD28E7b3a) {
    +++ description: A sequencer (registered in this contract) can submit transaction batches or commitments here.
      fieldMeta.maxTimeVariation.description:
-        "Settable by the Rollup Owner. Transactions can only be force-included after `delayBlocks` window (Sequencer-only) has passed."
+        "Settable by the Rollup Owner. Transactions can only be force-included after the `delayBlocks` window (Sequencer-only) has passed."
    }
```

Generated with discovered.json: 0x5e0d12e936795301883225446f95128f6b80979d

# Diff at Thu, 14 Nov 2024 08:19:46 GMT:

- chain: ethereum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@ea60800af45c71fbd5d292e0f4301ba9afda01fa block: 21141407
- current block number: 21184697

## Description

Staker count drops to 1 as the 'defensive' validators are not actively staking on new nodes anymore.

## Watched changes

```diff
    contract RollupProxy (0x5073dA9cA4810f3E0aA01c20c7d9d02C3f522e11) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      values.stakerCount:
-        3
+        1
    }
```

Generated with discovered.json: 0xbadecc0125ffd00ab33a489de1190ff6975a4ada

# Diff at Fri, 08 Nov 2024 07:24:58 GMT:

- chain: ethereum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@53988239f42edde0275ed92d8f3ada4279354f7d block: 21123028
- current block number: 21141407

## Description

The initial diverging node is now [rejected](https://etherscan.io/tx/0xeddeaed1b11b112b6131993a9a9149297d280312fed6969176249949bc3e3158) and the losing validator churned (un-zombified). Since they stay whitelisted as a validator and are not a zombie anymore, they can propose/challenge again whenever needed.

During the challenge, all validators except hypernative took part, Kinto says they were in 'watchtower' mode and not defensive.

## Watched changes

```diff
    contract RollupProxy (0x5073dA9cA4810f3E0aA01c20c7d9d02C3f522e11) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      values.zombieAddress.0:
-        "0x2bfDA59220413DEd39dD0E443620b5277EcE6348"
      values.zombieCount:
-        1
+        0
      values.zombieLatestStakedNode.0:
-        2167
    }
```

Generated with discovered.json: 0x07e8c632515ec118c973e23cff33a07ec4c18e27

# Diff at Tue, 05 Nov 2024 17:46:29 GMT:

- chain: ethereum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@e08cb5c139f2a262ed7108b412a045efba3a7db3 block: 21112607
- current block number: 21123028

## Description

The challenge launched by the ankr validator [has timed out](https://etherscan.io/tx/0xfed67894cc32ef8e161ca5449ae804d81ba3a9a439584495cc695e9446f8f07a) in favor of the asserter `0x64cf65036a76e3827e448cadbc53d31eefdce04a`, against ankr challenger. The 0.1 stake of the challenger is split 50/50 between the winning staker and the loserStakeEscrow `0x09d34b74cd8b1c4394a3cd9630e1ba027e6ed4f5`. The ankr staker has to re-stake at least 0.05 ETH to participate again.

## Watched changes

```diff
    contract RollupProxy (0x5073dA9cA4810f3E0aA01c20c7d9d02C3f522e11) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      values.stakerCount:
-        4
+        3
      values.totalWithdrawableFunds:
-        0
+        "50000000000000000"
      values.zombieAddress.0:
+        "0x2bfDA59220413DEd39dD0E443620b5277EcE6348"
      values.zombieCount:
-        0
+        1
      values.zombieLatestStakedNode.0:
+        2167
    }
```

Generated with discovered.json: 0x6bc8292f5b020163c8b5587c4141fe8dc2dddbc5

# Diff at Mon, 04 Nov 2024 07:56:50 GMT:

- chain: ethereum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@950c85bf556f084c302d2b03100375cf3c7ed376 block: 21098438
- current block number: 21112607

## Description

Kinto Decentralization upgrade:

### Stage 1 TODO:
Guarantee a KintoWallet user on L2 to be able to exit their funds. Context:
- kinto-geth [censors all EOA->contract calls on L2](https://github.com/KintoXYZ/kinto-go-ethereum/blob/kinto/core/kinto.go#L23C53-L23C95) and forces users into smartWallet usage
- KintoWallet is upgradeable: `isKYC` flag can be changed by actors more centralized than SC
- KintoWallet verifies `isKYC` on every transaction

### Security Council
The multisig at `0x17Eb10e12a78f986C78F973Fc70eD88072B33B7d` has the EXECUTOR_ROLE and meets the minimum requirements for a Security Council. Members are published [here](https://docs.kinto.xyz/kinto-the-safe-l2/security-kyc-aml/security-council) (5 external members, including Caldera).
- Kinto Foundation: `0x08E674c4538caE03B6c05405881dDCd95DcaF5a8`
- Mamori Labs: `0xc1f4D15C16A1f3555E0a5F7AeFD1e17AD4aaf40B`, `0x94561e98DD5E55271f91A103e4979aa6C493745E`
- Caldera: `0x356000Cec4fC967f8FC372381D983426760A0391`
- Hypernative: `0x082CBA3929aD00EbB6d81ebE57B0BD24fBF3Fc6B`
- Venn/Ironblocks: `0xe52957E92a372d5a3B544F4C329b606f1A1b4bD2`
- Turnkey: `0xD98B32e5D0Dcb5853e498225a15447a59b7a40e1`
- Certora: `0x5FB5040dfC5B8b9Ea40dFBd881188Ec85cDC0621`

### Validators
There are 5 validators in total, published [here](https://docs.kinto.xyz/kinto-the-safe-l2/security-kyc-aml/kinto-validators) and ran by:
- Caldera: `0x64Cf65036a76E3827e448cadbc53D31EefDCE04a` (main proposer)
- Mamori Labs: `0x944eB0a2829A859959586b10D54229278534a696`
- Ankr: `0x2bfDA59220413DEd39dD0E443620b5277EcE6348` (started a challenge due to late software update)
- Hypernative: `0x58028fFbc25aE2e12b96276bDB125955F41D41f3`
- Venn: `0xe528E74302FFCF6F9F6a1c973968d98F0fDbad8f`

## Watched changes

```diff
    contract Kinto SecurityCouncil (0x17Eb10e12a78f986C78F973Fc70eD88072B33B7d) {
    +++ description: None
      values.$members.8:
-        "0x94561e98DD5E55271f91A103e4979aa6C493745E"
      values.$members.7:
-        "0x356000Cec4fC967f8FC372381D983426760A0391"
+        "0x94561e98DD5E55271f91A103e4979aa6C493745E"
      values.$members.6:
-        "0x12ee26aD74d50a1f6BDD90811387d1e0f3e7C76A"
+        "0x356000Cec4fC967f8FC372381D983426760A0391"
      values.multisigThreshold:
-        "6 of 9 (67%)"
+        "6 of 8 (75%)"
    }
```

```diff
    contract RollupProxy (0x5073dA9cA4810f3E0aA01c20c7d9d02C3f522e11) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      values.lastStakeBlock:
-        21084338
+        21107949
      values.stakerCount:
-        3
+        4
    }
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21098438 (main branch discovery), not current.

```diff
    contract Bridger (0x0f1b7bd7762662B23486320AA91F30312184f70C) {
    +++ description: Bridger gateway that can swap assets to 'L2 final assets' before bridging them to the L2.
      description:
+        "Bridger gateway that can swap assets to 'L2 final assets' before bridging them to the L2."
    }
```

```diff
    contract Kinto SecurityCouncil (0x17Eb10e12a78f986C78F973Fc70eD88072B33B7d) {
    +++ description: None
      name:
-        "ExecutorMultisig"
+        "Kinto SecurityCouncil"
      receivedPermissions.10:
+        {"permission":"upgrade","target":"0xF4Ef823D57819AC7202a081A5B49376BD28E7b3a","via":[{"address":"0x74C717C01425eb475A5fC55d2A4a9045fC9800df"},{"address":"0x59B851c8b1643e0735Ec3F2f0e528f3d89c3408a"}]}
      receivedPermissions.9.target:
-        "0xF4Ef823D57819AC7202a081A5B49376BD28E7b3a"
+        "0xD9041DeCaDcBA88844b373e7053B4AC7A3390D60"
      receivedPermissions.8.target:
-        "0xD9041DeCaDcBA88844b373e7053B4AC7A3390D60"
+        "0xBFfaA85c1756472fFC37e6D172A7eC0538C14474"
      receivedPermissions.7.target:
-        "0xBFfaA85c1756472fFC37e6D172A7eC0538C14474"
+        "0x859a53Fe2C8DA961387030E7CB498D6D20d0B2DB"
      receivedPermissions.6.target:
-        "0x859a53Fe2C8DA961387030E7CB498D6D20d0B2DB"
+        "0x7870D5398DB488c669B406fBE57b8d05b6A35e42"
      receivedPermissions.5.target:
-        "0x7870D5398DB488c669B406fBE57b8d05b6A35e42"
+        "0x655761AD5FC251F414D6993A73184B0669F278c8"
      receivedPermissions.4.target:
-        "0x655761AD5FC251F414D6993A73184B0669F278c8"
+        "0x6228e2FB8C561f1a5A963039Bc38Eb6D539A1A7F"
      receivedPermissions.3.target:
-        "0x6228e2FB8C561f1a5A963039Bc38Eb6D539A1A7F"
+        "0x59B851c8b1643e0735Ec3F2f0e528f3d89c3408a"
      receivedPermissions.2.target:
-        "0x59B851c8b1643e0735Ec3F2f0e528f3d89c3408a"
+        "0x52EcE832AF3DF3125BbfD6423E0425dB3fA99D3F"
      receivedPermissions.1.target:
-        "0x52EcE832AF3DF3125BbfD6423E0425dB3fA99D3F"
+        "0x5073dA9cA4810f3E0aA01c20c7d9d02C3f522e11"
      receivedPermissions.1.via.1:
-        {"address":"0x59B851c8b1643e0735Ec3F2f0e528f3d89c3408a"}
      receivedPermissions.1.via.0.address:
-        "0x74C717C01425eb475A5fC55d2A4a9045fC9800df"
+        "0x59B851c8b1643e0735Ec3F2f0e528f3d89c3408a"
      receivedPermissions.0.permission:
-        "upgrade"
+        "configure"
      receivedPermissions.0.description:
+        "can pause and unpause and set important roles and parameters in the system contracts: Can delegate Sequencer management to a BatchPosterManager address, manage data availability and DACs, set the Sequencer-only window, introduce an allowList to the bridge and whitelist Inboxes/Outboxes."
    }
```

```diff
    contract RollupProxy (0x5073dA9cA4810f3E0aA01c20c7d9d02C3f522e11) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      template:
-        "orbitstack/RollupProxy_fastConfirm"
+        "orbitstack/RollupProxy"
      issuedPermissions.5.target:
-        "0x0000000000000000000000000000000000000000"
+        "0x17Eb10e12a78f986C78F973Fc70eD88072B33B7d"
      issuedPermissions.5.via.0:
+        {"address":"0x59B851c8b1643e0735Ec3F2f0e528f3d89c3408a","delay":0,"description":"can pause and unpause and set important roles and parameters in the system contracts: Can delegate Sequencer management to a BatchPosterManager address, manage data availability and DACs, set the Sequencer-only window, introduce an allowList to the bridge and whitelist Inboxes/Outboxes."}
      fieldMeta.minimumAssertionPeriod:
-        {"description":"Minimum time delta between newly created nodes (stateUpdates). This is checked on `stakeOnNewNode()`. Format is number of ETHEREUM blocks, even for L3s. "}
    }
```

```diff
    contract UpgradeExecutor (0x59B851c8b1643e0735Ec3F2f0e528f3d89c3408a) {
    +++ description: Central contract defining the access control for upgrading the system contract implementations.
      directlyReceivedPermissions.2:
+        {"permission":"upgrade","target":"0x5073dA9cA4810f3E0aA01c20c7d9d02C3f522e11"}
      directlyReceivedPermissions.1.permission:
-        "upgrade"
+        "configure"
      directlyReceivedPermissions.1.description:
+        "can pause and unpause and set important roles and parameters in the system contracts: Can delegate Sequencer management to a BatchPosterManager address, manage data availability and DACs, set the Sequencer-only window, introduce an allowList to the bridge and whitelist Inboxes/Outboxes."
    }
```

```diff
    contract L1ERC20Gateway (0x7870D5398DB488c669B406fBE57b8d05b6A35e42) {
    +++ description: Escrows deposited ERC-20 assets for the canonical Bridge. Upon depositing, a generic token representation will be minted at the destination. Withdrawals are initiated by the Outbox contract.
      template:
+        "orbitstack/ERC20Gateway"
      displayName:
+        "ERC20Gateway"
      description:
+        "Escrows deposited ERC-20 assets for the canonical Bridge. Upon depositing, a generic token representation will be minted at the destination. Withdrawals are initiated by the Outbox contract."
    }
```

```diff
    contract Inbox (0xBFfaA85c1756472fFC37e6D172A7eC0538C14474) {
    +++ description: Facilitates sending L1 to L2 messages like depositing ETH, but does not escrow funds.
      template:
+        "orbitstack/Inbox"
      description:
+        "Facilitates sending L1 to L2 messages like depositing ETH, but does not escrow funds."
    }
```

```diff
    contract TurnkeyMultisig (0xD98B32e5D0Dcb5853e498225a15447a59b7a40e1) {
    +++ description: None
      name:
-        "GnosisSafe"
+        "TurnkeyMultisig"
    }
```

```diff
    contract SequencerInbox (0xF4Ef823D57819AC7202a081A5B49376BD28E7b3a) {
    +++ description: A sequencer (registered in this contract) can submit transaction batches or commitments here.
      values.IS_HARDCODED_SEQUENCER_BATCH_POSTER:
-        false
      fieldMeta.maxTimeVariation.description:
-        "Struct: delayBlocks, futureBlocks, delaySeconds, futureSeconds. onlyRollupOwner settable. Transactions can only be force-included after `delayBlocks` window (Sequencer-only) has passed."
+        "Settable by the Rollup Owner. Transactions can only be force-included after `delayBlocks` window (Sequencer-only) has passed."
    }
```

Generated with discovered.json: 0x1678709304c14f7d103f4788317c363a2345037b

# Diff at Sat, 02 Nov 2024 07:22:30 GMT:

- chain: ethereum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@93f317513d51e26ce3003e34f6a9147b7f41eb7a block: 21077256
- current block number: 21098438

## Description

Challenge undergoing awaiting oneStepProver resolution. Also updated discovery for template. Kinto on telegram confirmed that this challenge was the result of ankr (the 0x2bfDA validator) did not upgrade their software in time for the HF 7 and thus challenged a correct state.

The ExecutorMultisig is being transformed into a SecurityCouncil with 5 public external members. It is currently 6/9 and would need one less Kinto-owned signer to meet the requirements.

## Watched changes

```diff
    contract ExecutorMultisig (0x17Eb10e12a78f986C78F973Fc70eD88072B33B7d) {
    +++ description: None
      values.$members.8:
+        "0x94561e98DD5E55271f91A103e4979aa6C493745E"
      values.$members.7:
+        "0x356000Cec4fC967f8FC372381D983426760A0391"
      values.$members.6:
+        "0x12ee26aD74d50a1f6BDD90811387d1e0f3e7C76A"
      values.$members.5:
+        "0xc1f4D15C16A1f3555E0a5F7AeFD1e17AD4aaf40B"
      values.$members.4:
-        "0x94561e98DD5E55271f91A103e4979aa6C493745E"
+        "0x08E674c4538caE03B6c05405881dDCd95DcaF5a8"
      values.$members.3:
-        "0x356000Cec4fC967f8FC372381D983426760A0391"
+        "0x082CBA3929aD00EbB6d81ebE57B0BD24fBF3Fc6B"
      values.$members.2:
-        "0x12ee26aD74d50a1f6BDD90811387d1e0f3e7C76A"
+        "0xe52957E92a372d5a3B544F4C329b606f1A1b4bD2"
      values.$members.1:
-        "0xc1f4D15C16A1f3555E0a5F7AeFD1e17AD4aaf40B"
+        "0x5FB5040dfC5B8b9Ea40dFBd881188Ec85cDC0621"
      values.$members.0:
-        "0x08E674c4538caE03B6c05405881dDCd95DcaF5a8"
+        "0xD98B32e5D0Dcb5853e498225a15447a59b7a40e1"
      values.$threshold:
-        3
+        6
      values.multisigThreshold:
-        "3 of 5 (60%)"
+        "6 of 9 (67%)"
    }
```

```diff
    contract RollupProxy (0x5073dA9cA4810f3E0aA01c20c7d9d02C3f522e11) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
+++ description: Emitted on createChallenge() in RollupUserLogic.
      values.challenges.0:
+        {"challengeIndex":1,"asserter":"0x64Cf65036a76E3827e448cadbc53D31EefDCE04a","challenger":"0x2bfDA59220413DEd39dD0E443620b5277EcE6348","challengedNode":2161}
      values.lastStakeBlock:
-        18788889
+        21084338
      values.stakerCount:
-        1
+        3
    }
```

```diff
    contract ChallengeManager (0x6228e2FB8C561f1a5A963039Bc38Eb6D539A1A7F) {
    +++ description: Contract that allows challenging state roots. Can be called through the RollupProxy by Validators or the UpgradeExecutor.
      values.totalChallengesCreated:
-        0
+        1
    }
```

```diff
+   Status: CREATED
    contract GnosisSafe (0xD98B32e5D0Dcb5853e498225a15447a59b7a40e1)
    +++ description: None
```

## Source code changes

```diff
.../kinto/ethereum/.flat/GnosisSafe/GnosisSafe.sol | 953 +++++++++++++++++++++
 .../.flat/GnosisSafe/GnosisSafeProxy.p.sol         |  35 +
 2 files changed, 988 insertions(+)
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21077256 (main branch discovery), not current.

```diff
    contract Outbox (0x655761AD5FC251F414D6993A73184B0669F278c8) {
    +++ description: Facilitates L2 to L1 contract calls: Messages initiated from L2 (for example withdrawal messages) eventually resolve in execution on L1.
      template:
+        "orbitstack/Outbox"
      description:
+        "Facilitates L2 to L1 contract calls: Messages initiated from L2 (for example withdrawal messages) eventually resolve in execution on L1."
    }
```

```diff
    contract Bridge (0x859a53Fe2C8DA961387030E7CB498D6D20d0B2DB) {
    +++ description: Escrow contract for the project's gas token (Can be different from ETH). Keeps a list of allowed Inboxes and Outboxes for canonical bridge messaging.
      template:
+        "orbitstack/Bridge"
      description:
+        "Escrow contract for the project's gas token (Can be different from ETH). Keeps a list of allowed Inboxes and Outboxes for canonical bridge messaging."
    }
```

Generated with discovered.json: 0x52d0651024635a16526a05f5d48aebc82c5b2ed9

# Diff at Wed, 30 Oct 2024 08:26:36 GMT:

- chain: ethereum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@133f6bdd684278299c8df162b697d52fa91f3aef block: 21041838
- current block number: 21077256

## Description

Kinto [HF 7 upgrade](https://github.com/ConstellationCrypto/kinto-go-ethereum/pull/11). Kinto uses a custom wasmModuleRoot but this upgrade loosely corresponds to ArbOS v32 in that L1 contract implementations are the same.

## Watched changes

```diff
    contract RollupProxy (0x5073dA9cA4810f3E0aA01c20c7d9d02C3f522e11) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      sourceHashes.2:
-        "0xef94a66bd5339efd18fb9ca1f8031482e7ef7bbe6c5a0a10fae254ab83712406"
+        "0x7ee21b18b2e18c636bfafc08ff72692cc43302b2599ba75f0abad67282866dd5"
      sourceHashes.1:
-        "0x8b48118fe606012c0dcac2ccc1821785935aec89fab8f219f47b32c482b0017e"
+        "0x9349e73cbc2d2b818c1d79711574ba210b56249d8d3845bc78c776caf8f8ff42"
      issuedPermissions.11:
+        {"permission":"upgrade","target":"0x17Eb10e12a78f986C78F973Fc70eD88072B33B7d","via":[{"address":"0x59B851c8b1643e0735Ec3F2f0e528f3d89c3408a","delay":0}]}
      issuedPermissions.10.permission:
-        "upgrade"
+        "propose"
      issuedPermissions.10.target:
-        "0x17Eb10e12a78f986C78F973Fc70eD88072B33B7d"
+        "0xe528E74302FFCF6F9F6a1c973968d98F0fDbad8f"
      issuedPermissions.10.via.0:
-        {"address":"0x59B851c8b1643e0735Ec3F2f0e528f3d89c3408a","delay":0}
      issuedPermissions.9.target:
-        "0xe528E74302FFCF6F9F6a1c973968d98F0fDbad8f"
+        "0x944eB0a2829A859959586b10D54229278534a696"
      issuedPermissions.8.target:
-        "0x9A6a3354Ea78572EDB7df8458911e1ceD733c224"
+        "0x64Cf65036a76E3827e448cadbc53D31EefDCE04a"
      issuedPermissions.7.target:
-        "0x944eB0a2829A859959586b10D54229278534a696"
+        "0x58028fFbc25aE2e12b96276bDB125955F41D41f3"
      issuedPermissions.6.target:
-        "0x64Cf65036a76E3827e448cadbc53D31EefDCE04a"
+        "0x2bfDA59220413DEd39dD0E443620b5277EcE6348"
      issuedPermissions.5.permission:
-        "propose"
+        "configure"
      issuedPermissions.5.target:
-        "0x2bfDA59220413DEd39dD0E443620b5277EcE6348"
+        "0x0000000000000000000000000000000000000000"
      issuedPermissions.3.target:
-        "0x9A6a3354Ea78572EDB7df8458911e1ceD733c224"
+        "0x944eB0a2829A859959586b10D54229278534a696"
      issuedPermissions.2.target:
-        "0x944eB0a2829A859959586b10D54229278534a696"
+        "0x64Cf65036a76E3827e448cadbc53D31EefDCE04a"
      issuedPermissions.1.target:
-        "0x64Cf65036a76E3827e448cadbc53D31EefDCE04a"
+        "0x58028fFbc25aE2e12b96276bDB125955F41D41f3"
      values.$implementation.1:
-        "0x660ea1675F7323dC3Ba0c8dDFB593225Eb01E3C1"
+        "0xa6f528c65569d903C20e7D2639ad343128B4FD27"
      values.$implementation.0:
-        "0x0aE4dD666748bF0F6dB5c149Eab1D8aD27820A6A"
+        "0x27Bb05e547CfC9b874f18b0F6F3FB62A58Be9CdB"
      values.$pastUpgrades.1:
+        ["2024-10-30T01:29:35.000Z","0x81ed45f10aa3c6062d1d3ce5c6a2763c4e88e93e51d35665e94e33b2b04627ad",["0x27Bb05e547CfC9b874f18b0F6F3FB62A58Be9CdB","0xa6f528c65569d903C20e7D2639ad343128B4FD27"]]
      values.$upgradeCount:
-        1
+        2
+++ description: ArbOS version derived from known wasmModuleRoots.
      values.arbOsFromWmRoot:
-        "0x2ca63ffd73f314d60f8d672954389881918100435f27fd4193becb12310d7faa"
+        "0x58a9512cf4096461f866446387e845c6573856ef603bba4e24cb1d89630a675c"
+++ description: Increments on each Validator change.
      values.setValidatorCount:
-        3
+        4
      values.validators.3:
-        "0x9A6a3354Ea78572EDB7df8458911e1ceD733c224"
+        "0x944eB0a2829A859959586b10D54229278534a696"
      values.validators.2:
-        "0x944eB0a2829A859959586b10D54229278534a696"
+        "0x64Cf65036a76E3827e448cadbc53D31EefDCE04a"
      values.validators.1:
-        "0x64Cf65036a76E3827e448cadbc53D31EefDCE04a"
+        "0x58028fFbc25aE2e12b96276bDB125955F41D41f3"
+++ description: Root hash of the WASM module used for execution, like a fingerprint of the L2 logic. Can be associated with ArbOS versions.
      values.wasmModuleRoot:
-        "0x2ca63ffd73f314d60f8d672954389881918100435f27fd4193becb12310d7faa"
+        "0x58a9512cf4096461f866446387e845c6573856ef603bba4e24cb1d89630a675c"
      values.anyTrustFastConfirmer:
+        "0x0000000000000000000000000000000000000000"
    }
```

```diff
    contract ChallengeManager (0x6228e2FB8C561f1a5A963039Bc38Eb6D539A1A7F) {
    +++ description: Contract that allows challenging state roots. Can be called through the RollupProxy by Validators or the UpgradeExecutor.
      sourceHashes.1:
-        "0x58a6261c83c2766f749641902ad6fdb695ea189d2747f073b57a8f35b9a547e5"
+        "0x1a095768302d7d1c3d02375eaa3341833b4f1aaac707e1c608bce478c87cbf27"
      values.$implementation:
-        "0x122B88885F1f365B69CAd38B167B039fEd0Ba096"
+        "0xd14D9d4c8985763B5037A4f253977e059385660c"
      values.$pastUpgrades.2:
+        ["2024-10-30T01:29:35.000Z","0x81ed45f10aa3c6062d1d3ce5c6a2763c4e88e93e51d35665e94e33b2b04627ad",["0xd14D9d4c8985763B5037A4f253977e059385660c"]]
      values.$upgradeCount:
-        2
+        3
      values.osp:
-        "0x8B02a8B985a81f96e49B8289FF60847FC6020e51"
+        "0xEd696D87C351C2ef687c1c484c3e297B276a40d1"
    }
```

```diff
-   Status: DELETED
    contract OneStepProverHostIo (0x6c4322e9A0478CA7aDd30e561f96af379D3A22Bb)
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
```

```diff
-   Status: DELETED
    contract OneStepProver0 (0x76f72B8eFDA2DCDD3fB5A8c16d576c25eD43D645)
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
```

```diff
-   Status: DELETED
    contract OneStepProofEntry (0x8B02a8B985a81f96e49B8289FF60847FC6020e51)
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
```

```diff
-   Status: DELETED
    contract OneStepProverMath (0xba9D43FA3576bc40f13cb0731D770d1e510EdE46)
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
```

```diff
-   Status: DELETED
    contract OneStepProverMemory (0xf09Bc0285055BEA82165cA3F54054aa88BB3C169)
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
```

```diff
+   Status: CREATED
    contract OneStepProver0 (0x2C1e1A31d2bC26f7BE3CAB5Cb0806641847B3C59)
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
```

```diff
+   Status: CREATED
    contract OneStepProverHostIo (0x551E2501074D80E22c5FfB69b5fd8ba2939593b7)
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
```

```diff
+   Status: CREATED
    contract OneStepProverMemory (0x778ca912Bd8b35dDA84852B47BA8624e08f640A6)
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
```

```diff
+   Status: CREATED
    contract OneStepProverMath (0xacED35d61f71A804E7627b5622c267C8Ac31d38e)
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
```

```diff
+   Status: CREATED
    contract OneStepProofEntry (0xEd696D87C351C2ef687c1c484c3e297B276a40d1)
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
```

## Source code changes

```diff
.../ChallengeManager/ChallengeManager.sol          | 404 ++++++----
 .../OneStepProofEntry.sol                          | 485 +++++++++--
 .../{.flat@21041838 => .flat}/OneStepProver0.sol   | 765 +++++++++++++-----
 .../OneStepProverHostIo.sol                        | 892 +++++++++++++++++----
 .../OneStepProverMath.sol                          |  65 +-
 .../OneStepProverMemory.sol                        | 315 ++++++--
 .../RollupProxy/RollupAdminLogic.1.sol             | 370 ++++++---
 .../RollupProxy/RollupUserLogic.2.sol              | 415 ++++++----
 8 files changed, 2766 insertions(+), 945 deletions(-)
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21041838 (main branch discovery), not current.

```diff
    contract RollupProxy (0x5073dA9cA4810f3E0aA01c20c7d9d02C3f522e11) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      template:
-        "orbitstack/RollupProxy"
+        "orbitstack/RollupProxy_fastConfirm"
      fieldMeta.confirmPeriodBlocks.description:
-        "Challenge period. (Number of blocks until a node is confirmed)."
+        "Challenge period. (Number of ETHEREUM blocks until a node is confirmed, even for L3s)."
      fieldMeta.minimumAssertionPeriod:
+        {"description":"Minimum time delta between newly created nodes (stateUpdates). This is checked on `stakeOnNewNode()`. Format is number of ETHEREUM blocks, even for L3s. "}
    }
```

Generated with discovered.json: 0x3d4a97f1ffb587553e5572d43ef81d50b919d48e

# Diff at Tue, 29 Oct 2024 08:02:45 GMT:

- chain: ethereum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@dd2750779d294ea31d352eac7a7f2e0e655f6440 block: 21041838
- current block number: 21041838

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21041838 (main branch discovery), not current.

```diff
    contract ExecutorMultisig (0x17Eb10e12a78f986C78F973Fc70eD88072B33B7d) {
    +++ description: None
      receivedPermissions:
+        [{"permission":"upgrade","target":"0x5073dA9cA4810f3E0aA01c20c7d9d02C3f522e11","via":[{"address":"0x59B851c8b1643e0735Ec3F2f0e528f3d89c3408a"}]},{"permission":"upgrade","target":"0x52EcE832AF3DF3125BbfD6423E0425dB3fA99D3F","via":[{"address":"0x74C717C01425eb475A5fC55d2A4a9045fC9800df"},{"address":"0x59B851c8b1643e0735Ec3F2f0e528f3d89c3408a"}]},{"permission":"upgrade","target":"0x59B851c8b1643e0735Ec3F2f0e528f3d89c3408a","via":[{"address":"0x74C717C01425eb475A5fC55d2A4a9045fC9800df"},{"address":"0x59B851c8b1643e0735Ec3F2f0e528f3d89c3408a"}]},{"permission":"upgrade","target":"0x6228e2FB8C561f1a5A963039Bc38Eb6D539A1A7F","via":[{"address":"0x74C717C01425eb475A5fC55d2A4a9045fC9800df"},{"address":"0x59B851c8b1643e0735Ec3F2f0e528f3d89c3408a"}]},{"permission":"upgrade","target":"0x655761AD5FC251F414D6993A73184B0669F278c8","via":[{"address":"0x74C717C01425eb475A5fC55d2A4a9045fC9800df"},{"address":"0x59B851c8b1643e0735Ec3F2f0e528f3d89c3408a"}]},{"permission":"upgrade","target":"0x7870D5398DB488c669B406fBE57b8d05b6A35e42","via":[{"address":"0x74C717C01425eb475A5fC55d2A4a9045fC9800df"},{"address":"0x59B851c8b1643e0735Ec3F2f0e528f3d89c3408a"}]},{"permission":"upgrade","target":"0x859a53Fe2C8DA961387030E7CB498D6D20d0B2DB","via":[{"address":"0x74C717C01425eb475A5fC55d2A4a9045fC9800df"},{"address":"0x59B851c8b1643e0735Ec3F2f0e528f3d89c3408a"}]},{"permission":"upgrade","target":"0xBFfaA85c1756472fFC37e6D172A7eC0538C14474","via":[{"address":"0x74C717C01425eb475A5fC55d2A4a9045fC9800df"},{"address":"0x59B851c8b1643e0735Ec3F2f0e528f3d89c3408a"}]},{"permission":"upgrade","target":"0xD9041DeCaDcBA88844b373e7053B4AC7A3390D60","via":[{"address":"0x74C717C01425eb475A5fC55d2A4a9045fC9800df"},{"address":"0x59B851c8b1643e0735Ec3F2f0e528f3d89c3408a"}]},{"permission":"upgrade","target":"0xF4Ef823D57819AC7202a081A5B49376BD28E7b3a","via":[{"address":"0x74C717C01425eb475A5fC55d2A4a9045fC9800df"},{"address":"0x59B851c8b1643e0735Ec3F2f0e528f3d89c3408a"}]}]
      directlyReceivedPermissions:
+        [{"permission":"act","target":"0x59B851c8b1643e0735Ec3F2f0e528f3d89c3408a"}]
    }
```

```diff
    contract RollupProxy (0x5073dA9cA4810f3E0aA01c20c7d9d02C3f522e11) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      issuedPermissions.10.target:
-        "0x59B851c8b1643e0735Ec3F2f0e528f3d89c3408a"
+        "0x17Eb10e12a78f986C78F973Fc70eD88072B33B7d"
      issuedPermissions.10.via.0:
+        {"address":"0x59B851c8b1643e0735Ec3F2f0e528f3d89c3408a","delay":0}
    }
```

```diff
    contract RollupEventInbox (0x52EcE832AF3DF3125BbfD6423E0425dB3fA99D3F) {
    +++ description: None
      issuedPermissions.0.target:
-        "0x59B851c8b1643e0735Ec3F2f0e528f3d89c3408a"
+        "0x17Eb10e12a78f986C78F973Fc70eD88072B33B7d"
      issuedPermissions.0.via.1:
+        {"address":"0x74C717C01425eb475A5fC55d2A4a9045fC9800df","delay":0}
      issuedPermissions.0.via.0.address:
-        "0x74C717C01425eb475A5fC55d2A4a9045fC9800df"
+        "0x59B851c8b1643e0735Ec3F2f0e528f3d89c3408a"
    }
```

```diff
    contract UpgradeExecutor (0x59B851c8b1643e0735Ec3F2f0e528f3d89c3408a) {
    +++ description: Central contract defining the access control for upgrading the system contract implementations.
      issuedPermissions.0.target:
-        "0x59B851c8b1643e0735Ec3F2f0e528f3d89c3408a"
+        "0x17Eb10e12a78f986C78F973Fc70eD88072B33B7d"
      issuedPermissions.0.via.1:
+        {"address":"0x74C717C01425eb475A5fC55d2A4a9045fC9800df","delay":0}
      issuedPermissions.0.via.0.address:
-        "0x74C717C01425eb475A5fC55d2A4a9045fC9800df"
+        "0x59B851c8b1643e0735Ec3F2f0e528f3d89c3408a"
      receivedPermissions:
-        [{"permission":"upgrade","target":"0x5073dA9cA4810f3E0aA01c20c7d9d02C3f522e11"},{"permission":"upgrade","target":"0x52EcE832AF3DF3125BbfD6423E0425dB3fA99D3F","via":[{"address":"0x74C717C01425eb475A5fC55d2A4a9045fC9800df"}]},{"permission":"upgrade","target":"0x59B851c8b1643e0735Ec3F2f0e528f3d89c3408a","via":[{"address":"0x74C717C01425eb475A5fC55d2A4a9045fC9800df"}]},{"permission":"upgrade","target":"0x6228e2FB8C561f1a5A963039Bc38Eb6D539A1A7F","via":[{"address":"0x74C717C01425eb475A5fC55d2A4a9045fC9800df"}]},{"permission":"upgrade","target":"0x655761AD5FC251F414D6993A73184B0669F278c8","via":[{"address":"0x74C717C01425eb475A5fC55d2A4a9045fC9800df"}]},{"permission":"upgrade","target":"0x7870D5398DB488c669B406fBE57b8d05b6A35e42","via":[{"address":"0x74C717C01425eb475A5fC55d2A4a9045fC9800df"}]},{"permission":"upgrade","target":"0x859a53Fe2C8DA961387030E7CB498D6D20d0B2DB","via":[{"address":"0x74C717C01425eb475A5fC55d2A4a9045fC9800df"}]},{"permission":"upgrade","target":"0xBFfaA85c1756472fFC37e6D172A7eC0538C14474","via":[{"address":"0x74C717C01425eb475A5fC55d2A4a9045fC9800df"}]},{"permission":"upgrade","target":"0xD9041DeCaDcBA88844b373e7053B4AC7A3390D60","via":[{"address":"0x74C717C01425eb475A5fC55d2A4a9045fC9800df"}]},{"permission":"upgrade","target":"0xF4Ef823D57819AC7202a081A5B49376BD28E7b3a","via":[{"address":"0x74C717C01425eb475A5fC55d2A4a9045fC9800df"}]}]
      directlyReceivedPermissions.1:
+        {"permission":"upgrade","target":"0x5073dA9cA4810f3E0aA01c20c7d9d02C3f522e11"}
    }
```

```diff
    contract ChallengeManager (0x6228e2FB8C561f1a5A963039Bc38Eb6D539A1A7F) {
    +++ description: Contract that allows challenging state roots. Can be called through the RollupProxy by Validators or the UpgradeExecutor.
      issuedPermissions.0.target:
-        "0x59B851c8b1643e0735Ec3F2f0e528f3d89c3408a"
+        "0x17Eb10e12a78f986C78F973Fc70eD88072B33B7d"
      issuedPermissions.0.via.1:
+        {"address":"0x74C717C01425eb475A5fC55d2A4a9045fC9800df","delay":0}
      issuedPermissions.0.via.0.address:
-        "0x74C717C01425eb475A5fC55d2A4a9045fC9800df"
+        "0x59B851c8b1643e0735Ec3F2f0e528f3d89c3408a"
    }
```

```diff
    contract Outbox (0x655761AD5FC251F414D6993A73184B0669F278c8) {
    +++ description: None
      issuedPermissions.0.target:
-        "0x59B851c8b1643e0735Ec3F2f0e528f3d89c3408a"
+        "0x17Eb10e12a78f986C78F973Fc70eD88072B33B7d"
      issuedPermissions.0.via.1:
+        {"address":"0x74C717C01425eb475A5fC55d2A4a9045fC9800df","delay":0}
      issuedPermissions.0.via.0.address:
-        "0x74C717C01425eb475A5fC55d2A4a9045fC9800df"
+        "0x59B851c8b1643e0735Ec3F2f0e528f3d89c3408a"
    }
```

```diff
    contract L1ERC20Gateway (0x7870D5398DB488c669B406fBE57b8d05b6A35e42) {
    +++ description: None
      issuedPermissions.0.target:
-        "0x59B851c8b1643e0735Ec3F2f0e528f3d89c3408a"
+        "0x17Eb10e12a78f986C78F973Fc70eD88072B33B7d"
      issuedPermissions.0.via.1:
+        {"address":"0x74C717C01425eb475A5fC55d2A4a9045fC9800df","delay":0}
      issuedPermissions.0.via.0.address:
-        "0x74C717C01425eb475A5fC55d2A4a9045fC9800df"
+        "0x59B851c8b1643e0735Ec3F2f0e528f3d89c3408a"
    }
```

```diff
    contract Bridge (0x859a53Fe2C8DA961387030E7CB498D6D20d0B2DB) {
    +++ description: None
      issuedPermissions.0.target:
-        "0x59B851c8b1643e0735Ec3F2f0e528f3d89c3408a"
+        "0x17Eb10e12a78f986C78F973Fc70eD88072B33B7d"
      issuedPermissions.0.via.1:
+        {"address":"0x74C717C01425eb475A5fC55d2A4a9045fC9800df","delay":0}
      issuedPermissions.0.via.0.address:
-        "0x74C717C01425eb475A5fC55d2A4a9045fC9800df"
+        "0x59B851c8b1643e0735Ec3F2f0e528f3d89c3408a"
    }
```

```diff
    contract Inbox (0xBFfaA85c1756472fFC37e6D172A7eC0538C14474) {
    +++ description: None
      issuedPermissions.0.target:
-        "0x59B851c8b1643e0735Ec3F2f0e528f3d89c3408a"
+        "0x17Eb10e12a78f986C78F973Fc70eD88072B33B7d"
      issuedPermissions.0.via.1:
+        {"address":"0x74C717C01425eb475A5fC55d2A4a9045fC9800df","delay":0}
      issuedPermissions.0.via.0.address:
-        "0x74C717C01425eb475A5fC55d2A4a9045fC9800df"
+        "0x59B851c8b1643e0735Ec3F2f0e528f3d89c3408a"
    }
```

```diff
    contract L1GatewayRouter (0xD9041DeCaDcBA88844b373e7053B4AC7A3390D60) {
    +++ description: None
      issuedPermissions.0.target:
-        "0x59B851c8b1643e0735Ec3F2f0e528f3d89c3408a"
+        "0x17Eb10e12a78f986C78F973Fc70eD88072B33B7d"
      issuedPermissions.0.via.1:
+        {"address":"0x74C717C01425eb475A5fC55d2A4a9045fC9800df","delay":0}
      issuedPermissions.0.via.0.address:
-        "0x74C717C01425eb475A5fC55d2A4a9045fC9800df"
+        "0x59B851c8b1643e0735Ec3F2f0e528f3d89c3408a"
    }
```

```diff
    contract SequencerInbox (0xF4Ef823D57819AC7202a081A5B49376BD28E7b3a) {
    +++ description: A sequencer (registered in this contract) can submit transaction batches or commitments here.
      issuedPermissions.1.target:
-        "0x59B851c8b1643e0735Ec3F2f0e528f3d89c3408a"
+        "0x17Eb10e12a78f986C78F973Fc70eD88072B33B7d"
      issuedPermissions.1.via.1:
+        {"address":"0x74C717C01425eb475A5fC55d2A4a9045fC9800df","delay":0}
      issuedPermissions.1.via.0.address:
-        "0x74C717C01425eb475A5fC55d2A4a9045fC9800df"
+        "0x59B851c8b1643e0735Ec3F2f0e528f3d89c3408a"
    }
```

Generated with discovered.json: 0xb66e356473635b36069ee03955ded08d7f2bc796

# Diff at Mon, 28 Oct 2024 14:04:14 GMT:

- chain: ethereum
- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@846d03afee15838cf7b18315c02ebdb6a2071f6c block: 21041838
- current block number: 21041838

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21041838 (main branch discovery), not current.

```diff
    contract UpgradeExecutor (0x59B851c8b1643e0735Ec3F2f0e528f3d89c3408a) {
    +++ description: Central contract defining the access control for upgrading the system contract implementations.
      values.executors:
+        ["0x17Eb10e12a78f986C78F973Fc70eD88072B33B7d"]
    }
```

Generated with discovered.json: 0xc9b0b420e73c45bd6dbaa74f69368a5a774ee486

# Diff at Fri, 25 Oct 2024 09:49:45 GMT:

- chain: ethereum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@e7501f424c0cea9b5438386ee76e509448999836 block: 20948097
- current block number: 21041838

## Description

Config related.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20948097 (main branch discovery), not current.

```diff
    contract RollupEventInbox (0x52EcE832AF3DF3125BbfD6423E0425dB3fA99D3F) {
    +++ description: None
      issuedPermissions.0.target:
-        "0x74C717C01425eb475A5fC55d2A4a9045fC9800df"
+        "0x59B851c8b1643e0735Ec3F2f0e528f3d89c3408a"
      issuedPermissions.0.via.0:
+        {"address":"0x74C717C01425eb475A5fC55d2A4a9045fC9800df","delay":0}
    }
```

```diff
    contract UpgradeExecutor (0x59B851c8b1643e0735Ec3F2f0e528f3d89c3408a) {
    +++ description: Central contract defining the access control for upgrading the system contract implementations.
      issuedPermissions.0.target:
-        "0x74C717C01425eb475A5fC55d2A4a9045fC9800df"
+        "0x59B851c8b1643e0735Ec3F2f0e528f3d89c3408a"
      issuedPermissions.0.via.0:
+        {"address":"0x74C717C01425eb475A5fC55d2A4a9045fC9800df","delay":0}
      receivedPermissions.9:
+        {"permission":"upgrade","target":"0xF4Ef823D57819AC7202a081A5B49376BD28E7b3a","via":[{"address":"0x74C717C01425eb475A5fC55d2A4a9045fC9800df"}]}
      receivedPermissions.8:
+        {"permission":"upgrade","target":"0xD9041DeCaDcBA88844b373e7053B4AC7A3390D60","via":[{"address":"0x74C717C01425eb475A5fC55d2A4a9045fC9800df"}]}
      receivedPermissions.7:
+        {"permission":"upgrade","target":"0xBFfaA85c1756472fFC37e6D172A7eC0538C14474","via":[{"address":"0x74C717C01425eb475A5fC55d2A4a9045fC9800df"}]}
      receivedPermissions.6:
+        {"permission":"upgrade","target":"0x859a53Fe2C8DA961387030E7CB498D6D20d0B2DB","via":[{"address":"0x74C717C01425eb475A5fC55d2A4a9045fC9800df"}]}
      receivedPermissions.5:
+        {"permission":"upgrade","target":"0x7870D5398DB488c669B406fBE57b8d05b6A35e42","via":[{"address":"0x74C717C01425eb475A5fC55d2A4a9045fC9800df"}]}
      receivedPermissions.4:
+        {"permission":"upgrade","target":"0x655761AD5FC251F414D6993A73184B0669F278c8","via":[{"address":"0x74C717C01425eb475A5fC55d2A4a9045fC9800df"}]}
      receivedPermissions.3:
+        {"permission":"upgrade","target":"0x6228e2FB8C561f1a5A963039Bc38Eb6D539A1A7F","via":[{"address":"0x74C717C01425eb475A5fC55d2A4a9045fC9800df"}]}
      receivedPermissions.2:
+        {"permission":"upgrade","target":"0x59B851c8b1643e0735Ec3F2f0e528f3d89c3408a","via":[{"address":"0x74C717C01425eb475A5fC55d2A4a9045fC9800df"}]}
      receivedPermissions.1:
+        {"permission":"upgrade","target":"0x52EcE832AF3DF3125BbfD6423E0425dB3fA99D3F","via":[{"address":"0x74C717C01425eb475A5fC55d2A4a9045fC9800df"}]}
      directlyReceivedPermissions:
+        [{"permission":"act","target":"0x74C717C01425eb475A5fC55d2A4a9045fC9800df"}]
    }
```

```diff
    contract ChallengeManager (0x6228e2FB8C561f1a5A963039Bc38Eb6D539A1A7F) {
    +++ description: Contract that allows challenging state roots. Can be called through the RollupProxy by Validators or the UpgradeExecutor.
      issuedPermissions.0.target:
-        "0x74C717C01425eb475A5fC55d2A4a9045fC9800df"
+        "0x59B851c8b1643e0735Ec3F2f0e528f3d89c3408a"
      issuedPermissions.0.via.0:
+        {"address":"0x74C717C01425eb475A5fC55d2A4a9045fC9800df","delay":0}
    }
```

```diff
    contract Outbox (0x655761AD5FC251F414D6993A73184B0669F278c8) {
    +++ description: None
      issuedPermissions.0.target:
-        "0x74C717C01425eb475A5fC55d2A4a9045fC9800df"
+        "0x59B851c8b1643e0735Ec3F2f0e528f3d89c3408a"
      issuedPermissions.0.via.0:
+        {"address":"0x74C717C01425eb475A5fC55d2A4a9045fC9800df","delay":0}
    }
```

```diff
    contract ProxyAdmin (0x74C717C01425eb475A5fC55d2A4a9045fC9800df) {
    +++ description: None
      receivedPermissions:
-        [{"permission":"upgrade","target":"0x52EcE832AF3DF3125BbfD6423E0425dB3fA99D3F"},{"permission":"upgrade","target":"0x59B851c8b1643e0735Ec3F2f0e528f3d89c3408a"},{"permission":"upgrade","target":"0x6228e2FB8C561f1a5A963039Bc38Eb6D539A1A7F"},{"permission":"upgrade","target":"0x655761AD5FC251F414D6993A73184B0669F278c8"},{"permission":"upgrade","target":"0x7870D5398DB488c669B406fBE57b8d05b6A35e42"},{"permission":"upgrade","target":"0x859a53Fe2C8DA961387030E7CB498D6D20d0B2DB"},{"permission":"upgrade","target":"0xBFfaA85c1756472fFC37e6D172A7eC0538C14474"},{"permission":"upgrade","target":"0xD9041DeCaDcBA88844b373e7053B4AC7A3390D60"},{"permission":"upgrade","target":"0xF4Ef823D57819AC7202a081A5B49376BD28E7b3a"}]
      template:
+        "global/ProxyAdmin"
      directlyReceivedPermissions:
+        [{"permission":"upgrade","target":"0x52EcE832AF3DF3125BbfD6423E0425dB3fA99D3F"},{"permission":"upgrade","target":"0x59B851c8b1643e0735Ec3F2f0e528f3d89c3408a"},{"permission":"upgrade","target":"0x6228e2FB8C561f1a5A963039Bc38Eb6D539A1A7F"},{"permission":"upgrade","target":"0x655761AD5FC251F414D6993A73184B0669F278c8"},{"permission":"upgrade","target":"0x7870D5398DB488c669B406fBE57b8d05b6A35e42"},{"permission":"upgrade","target":"0x859a53Fe2C8DA961387030E7CB498D6D20d0B2DB"},{"permission":"upgrade","target":"0xBFfaA85c1756472fFC37e6D172A7eC0538C14474"},{"permission":"upgrade","target":"0xD9041DeCaDcBA88844b373e7053B4AC7A3390D60"},{"permission":"upgrade","target":"0xF4Ef823D57819AC7202a081A5B49376BD28E7b3a"}]
    }
```

```diff
    contract L1ERC20Gateway (0x7870D5398DB488c669B406fBE57b8d05b6A35e42) {
    +++ description: None
      issuedPermissions.0.target:
-        "0x74C717C01425eb475A5fC55d2A4a9045fC9800df"
+        "0x59B851c8b1643e0735Ec3F2f0e528f3d89c3408a"
      issuedPermissions.0.via.0:
+        {"address":"0x74C717C01425eb475A5fC55d2A4a9045fC9800df","delay":0}
    }
```

```diff
    contract Bridge (0x859a53Fe2C8DA961387030E7CB498D6D20d0B2DB) {
    +++ description: None
      issuedPermissions.0.target:
-        "0x74C717C01425eb475A5fC55d2A4a9045fC9800df"
+        "0x59B851c8b1643e0735Ec3F2f0e528f3d89c3408a"
      issuedPermissions.0.via.0:
+        {"address":"0x74C717C01425eb475A5fC55d2A4a9045fC9800df","delay":0}
    }
```

```diff
    contract Inbox (0xBFfaA85c1756472fFC37e6D172A7eC0538C14474) {
    +++ description: None
      issuedPermissions.0.target:
-        "0x74C717C01425eb475A5fC55d2A4a9045fC9800df"
+        "0x59B851c8b1643e0735Ec3F2f0e528f3d89c3408a"
      issuedPermissions.0.via.0:
+        {"address":"0x74C717C01425eb475A5fC55d2A4a9045fC9800df","delay":0}
    }
```

```diff
    contract L1GatewayRouter (0xD9041DeCaDcBA88844b373e7053B4AC7A3390D60) {
    +++ description: None
      issuedPermissions.0.target:
-        "0x74C717C01425eb475A5fC55d2A4a9045fC9800df"
+        "0x59B851c8b1643e0735Ec3F2f0e528f3d89c3408a"
      issuedPermissions.0.via.0:
+        {"address":"0x74C717C01425eb475A5fC55d2A4a9045fC9800df","delay":0}
    }
```

```diff
    contract SequencerInbox (0xF4Ef823D57819AC7202a081A5B49376BD28E7b3a) {
    +++ description: A sequencer (registered in this contract) can submit transaction batches or commitments here.
      issuedPermissions.1.target:
-        "0x74C717C01425eb475A5fC55d2A4a9045fC9800df"
+        "0x59B851c8b1643e0735Ec3F2f0e528f3d89c3408a"
      issuedPermissions.1.via.0:
+        {"address":"0x74C717C01425eb475A5fC55d2A4a9045fC9800df","delay":0}
    }
```

Generated with discovered.json: 0x48006feea057b24b4c2f65488f24dcc9d1ae7006

# Diff at Wed, 23 Oct 2024 14:36:02 GMT:

- chain: ethereum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@9cc37d16a5f0b172bb41f98d8a970963e5ca4afb block: 20948097
- current block number: 20948097

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20948097 (main branch discovery), not current.

```diff
-   Status: DELETED
    contract  (0x27C7Bfd2cC11429e9b80c443b42FDBe4754F6c91)
    +++ description: None
```

```diff
-   Status: DELETED
    contract  (0x434345973Ebf8249398E1EeB03A62bE418B48a05)
    +++ description: None
```

```diff
    contract RollupProxy (0x5073dA9cA4810f3E0aA01c20c7d9d02C3f522e11) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      description:
-        "Manages rollup components, list of Stakers and Validators. Entry point for Validators creating new Rollup Nodes (state commits) and Challengers submitting fraud proofs."
+        "Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators)."
      issuedPermissions.10:
+        {"permission":"upgrade","target":"0x59B851c8b1643e0735Ec3F2f0e528f3d89c3408a","via":[]}
      issuedPermissions.9:
+        {"permission":"propose","target":"0xe528E74302FFCF6F9F6a1c973968d98F0fDbad8f","via":[]}
      issuedPermissions.8:
+        {"permission":"propose","target":"0x9A6a3354Ea78572EDB7df8458911e1ceD733c224","via":[]}
      issuedPermissions.7:
+        {"permission":"propose","target":"0x944eB0a2829A859959586b10D54229278534a696","via":[]}
      issuedPermissions.6:
+        {"permission":"propose","target":"0x64Cf65036a76E3827e448cadbc53D31EefDCE04a","via":[]}
      issuedPermissions.5.permission:
-        "validate"
+        "propose"
      issuedPermissions.5.target:
-        "0xe528E74302FFCF6F9F6a1c973968d98F0fDbad8f"
+        "0x2bfDA59220413DEd39dD0E443620b5277EcE6348"
      issuedPermissions.4.permission:
-        "validate"
+        "challenge"
      issuedPermissions.4.target:
-        "0x9A6a3354Ea78572EDB7df8458911e1ceD733c224"
+        "0xe528E74302FFCF6F9F6a1c973968d98F0fDbad8f"
      issuedPermissions.3.permission:
-        "validate"
+        "challenge"
      issuedPermissions.3.target:
-        "0x944eB0a2829A859959586b10D54229278534a696"
+        "0x9A6a3354Ea78572EDB7df8458911e1ceD733c224"
      issuedPermissions.2.permission:
-        "validate"
+        "challenge"
      issuedPermissions.2.target:
-        "0x64Cf65036a76E3827e448cadbc53D31EefDCE04a"
+        "0x944eB0a2829A859959586b10D54229278534a696"
      issuedPermissions.1.permission:
-        "validate"
+        "challenge"
      issuedPermissions.1.target:
-        "0x2bfDA59220413DEd39dD0E443620b5277EcE6348"
+        "0x64Cf65036a76E3827e448cadbc53D31EefDCE04a"
      issuedPermissions.0.permission:
-        "upgrade"
+        "challenge"
      issuedPermissions.0.target:
-        "0x59B851c8b1643e0735Ec3F2f0e528f3d89c3408a"
+        "0x2bfDA59220413DEd39dD0E443620b5277EcE6348"
+++ description: ArbOS version derived from known wasmModuleRoots.
      values.arbOsFromWmRoot:
+        "0x2ca63ffd73f314d60f8d672954389881918100435f27fd4193becb12310d7faa"
      fieldMeta.arbOsFromWmRoot:
+        {"description":"ArbOS version derived from known wasmModuleRoots."}
      fieldMeta.setValidatorCount:
+        {"description":"Increments on each Validator change."}
      fieldMeta.challenges:
+        {"description":"Emitted on createChallenge() in RollupUserLogic."}
    }
```

```diff
    contract UpgradeExecutor (0x59B851c8b1643e0735Ec3F2f0e528f3d89c3408a) {
    +++ description: Central contract defining the access control for upgrading the system contract implementations.
      template:
+        "orbitstack/UpgradeExecutor"
      description:
+        "Central contract defining the access control for upgrading the system contract implementations."
    }
```

```diff
    contract ChallengeManager (0x6228e2FB8C561f1a5A963039Bc38Eb6D539A1A7F) {
    +++ description: Contract that allows challenging state roots. Can be called through the RollupProxy by Validators or the UpgradeExecutor.
      template:
+        "orbitstack/ChallengeManager"
      description:
+        "Contract that allows challenging state roots. Can be called through the RollupProxy by Validators or the UpgradeExecutor."
    }
```

```diff
    contract OneStepProverHostIo (0x6c4322e9A0478CA7aDd30e561f96af379D3A22Bb) {
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
      template:
+        "orbitstack/OneStepProverHostIo"
      description:
+        "One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine."
    }
```

```diff
    contract OneStepProver0 (0x76f72B8eFDA2DCDD3fB5A8c16d576c25eD43D645) {
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
      template:
+        "orbitstack/OneStepProver0"
      description:
+        "One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine."
    }
```

```diff
    contract OneStepProofEntry (0x8B02a8B985a81f96e49B8289FF60847FC6020e51) {
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
      template:
+        "orbitstack/OneStepProofEntry"
      description:
+        "One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine."
    }
```

```diff
-   Status: DELETED
    contract ValidatorWalletCreator (0x9CAd81628aB7D8e239F1A5B497313341578c5F71)
    +++ description: None
```

```diff
    contract OneStepProverMath (0xba9D43FA3576bc40f13cb0731D770d1e510EdE46) {
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
      template:
+        "orbitstack/OneStepProverMath"
      description:
+        "One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine."
    }
```

```diff
    contract OneStepProverMemory (0xf09Bc0285055BEA82165cA3F54054aa88BB3C169) {
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
      template:
+        "orbitstack/OneStepProverMemory"
      description:
+        "One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine."
    }
```

```diff
    contract SequencerInbox (0xF4Ef823D57819AC7202a081A5B49376BD28E7b3a) {
    +++ description: A sequencer (registered in this contract) can submit transaction batches or commitments here.
      values.dacKeyset:
+        {"requiredSignatures":0,"membersCount":0,"blsSignatures":[]}
      template:
+        "orbitstack/SequencerInbox"
      description:
+        "A sequencer (registered in this contract) can submit transaction batches or commitments here."
      fieldMeta:
+        {"maxTimeVariation":{"description":"Struct: delayBlocks, futureBlocks, delaySeconds, futureSeconds. onlyRollupOwner settable. Transactions can only be force-included after `delayBlocks` window (Sequencer-only) has passed."}}
    }
```

Generated with discovered.json: 0xd38da817903eba7857f27e7dba72621771ae1d41

# Diff at Mon, 21 Oct 2024 12:45:07 GMT:

- chain: ethereum
- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@e660599f23a07618fe949a07be1f516ce44f1914 block: 20948097
- current block number: 20948097

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20948097 (main branch discovery), not current.

```diff
    contract RollupProxy (0x5073dA9cA4810f3E0aA01c20c7d9d02C3f522e11) {
    +++ description: Manages rollup components, list of Stakers and Validators. Entry point for Validators creating new Rollup Nodes (state commits) and Challengers submitting fraud proofs.
      descriptions:
-        ["Manages rollup components, list of Stakers and Validators. Entry point for Validators creating new Rollup Nodes (state commits) and Challengers submitting fraud proofs."]
      description:
+        "Manages rollup components, list of Stakers and Validators. Entry point for Validators creating new Rollup Nodes (state commits) and Challengers submitting fraud proofs."
    }
```

Generated with discovered.json: 0x3a855e798a59f810b47e7da042f4e8821fe930ae

# Diff at Mon, 21 Oct 2024 11:06:49 GMT:

- chain: ethereum
- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@8895d33866f5665c4c710f4ddaa32bfa63cc3c78 block: 20948097
- current block number: 20948097

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20948097 (main branch discovery), not current.

```diff
    contract Bridger (0x0f1b7bd7762662B23486320AA91F30312184f70C) {
    +++ description: None
      values.$pastUpgrades.10.2:
+        ["0x21D3921B50617BDef223207118950B0b577e4007"]
      values.$pastUpgrades.10.1:
-        ["0x21D3921B50617BDef223207118950B0b577e4007"]
+        "0x31a2c058d7ce91c9d1b526764cf6442a45bdf662d2725bf8535a167303250bec"
      values.$pastUpgrades.9.2:
+        ["0x47e28e296BE2EE69b4579d5eecbABA38217a2b03"]
      values.$pastUpgrades.9.1:
-        ["0x47e28e296BE2EE69b4579d5eecbABA38217a2b03"]
+        "0x07dac4c8df3e4fbc7619636522e7f893296c5ef9a7dd3b5a28976d5eedf09fd4"
      values.$pastUpgrades.8.2:
+        ["0x23559eB4Ad22c31940a929958B104821126F35b7"]
      values.$pastUpgrades.8.1:
-        ["0x23559eB4Ad22c31940a929958B104821126F35b7"]
+        "0x0298ee3f7f0e0ebb53b19939a06453013a051923a1f27e59362d93ec2012fc3f"
      values.$pastUpgrades.7.2:
+        ["0xEEe82E92bA40A694409B4BDa3D7426188c61163e"]
      values.$pastUpgrades.7.1:
-        ["0xEEe82E92bA40A694409B4BDa3D7426188c61163e"]
+        "0xf174716076d1373e6ee74c5f2afc7aea9de184deb45b3c992d873160c0bf5355"
      values.$pastUpgrades.6.2:
+        ["0x270f25127D7C48c956459e113aa81615CC30AeE2"]
      values.$pastUpgrades.6.1:
-        ["0x270f25127D7C48c956459e113aa81615CC30AeE2"]
+        "0xa99267f3208e313084784d7da895d88acd4a86001483566f21f3073e0ee13039"
      values.$pastUpgrades.5.2:
+        ["0x0210AE8703F8c9A88D7050825bd8001E359CB4BA"]
      values.$pastUpgrades.5.1:
-        ["0x0210AE8703F8c9A88D7050825bd8001E359CB4BA"]
+        "0x80b6eb0ef3cabe648cfb4cd49f4c6efbdb3283f04682065f99f4c871c8315839"
      values.$pastUpgrades.4.2:
+        ["0x3636617973f25a512676cb06876f0C885568664a"]
      values.$pastUpgrades.4.1:
-        ["0x3636617973f25a512676cb06876f0C885568664a"]
+        "0xe8481050b8e1b2d41d1e79a89d004596c9f1ed6293e2a0b07e295d7104b72108"
      values.$pastUpgrades.3.2:
+        ["0x989b9f407687DA3050C957CfeF5E6c18BeE7cb9F"]
      values.$pastUpgrades.3.1:
-        ["0x989b9f407687DA3050C957CfeF5E6c18BeE7cb9F"]
+        "0x1b0c58c017710ce99817ef751625accd468c9661ecff7984680eaf6e2150d968"
      values.$pastUpgrades.2.2:
+        ["0xE3641CbDAc5477C350c8FeAAF52Ddc021451A2aA"]
      values.$pastUpgrades.2.1:
-        ["0xE3641CbDAc5477C350c8FeAAF52Ddc021451A2aA"]
+        "0xd52c14d572e45c1bd011844d136b7c492fc5ecb802e1c50f850c6662f3a7fccf"
      values.$pastUpgrades.1.2:
+        ["0x31a20f10c846BD3Ed41c6c05c340bFD7A57ECADA"]
      values.$pastUpgrades.1.1:
-        ["0x31a20f10c846BD3Ed41c6c05c340bFD7A57ECADA"]
+        "0xa1780c4191178aef57f3fc1a9d38a431d46fa163ed0436c839afade5dc91328e"
      values.$pastUpgrades.0.2:
+        ["0x925eC66892261203536a4aede9CA8e8D0feeA4ad"]
      values.$pastUpgrades.0.1:
-        ["0x925eC66892261203536a4aede9CA8e8D0feeA4ad"]
+        "0x5fe42b41ba3aafb36ec09d39284fdfc0d6df534b81488c7382ee8418fe620e62"
    }
```

```diff
    contract RollupProxy (0x5073dA9cA4810f3E0aA01c20c7d9d02C3f522e11) {
    +++ description: Manages rollup components, list of Stakers and Validators. Entry point for Validators creating new Rollup Nodes (state commits) and Challengers submitting fraud proofs.
      values.$pastUpgrades.0.2:
+        ["0x0aE4dD666748bF0F6dB5c149Eab1D8aD27820A6A","0x660ea1675F7323dC3Ba0c8dDFB593225Eb01E3C1"]
      values.$pastUpgrades.0.1:
-        ["0x0aE4dD666748bF0F6dB5c149Eab1D8aD27820A6A","0x660ea1675F7323dC3Ba0c8dDFB593225Eb01E3C1"]
+        "0xd51bb4d6150d5fbaa61cf5281598b18c4efba4284aecb4420fc8d834dba357d8"
    }
```

```diff
    contract RollupEventInbox (0x52EcE832AF3DF3125BbfD6423E0425dB3fA99D3F) {
    +++ description: None
      values.$pastUpgrades.0.2:
+        ["0x13BE515E44Eefaf3eBEFAD684F1FBB574Ac0A494"]
      values.$pastUpgrades.0.1:
-        ["0x13BE515E44Eefaf3eBEFAD684F1FBB574Ac0A494"]
+        "0xd51bb4d6150d5fbaa61cf5281598b18c4efba4284aecb4420fc8d834dba357d8"
    }
```

```diff
    contract UpgradeExecutor (0x59B851c8b1643e0735Ec3F2f0e528f3d89c3408a) {
    +++ description: None
      values.$pastUpgrades.0.2:
+        ["0x6c21303F5986180B1394d2C89f3e883890E2867b"]
      values.$pastUpgrades.0.1:
-        ["0x6c21303F5986180B1394d2C89f3e883890E2867b"]
+        "0xd51bb4d6150d5fbaa61cf5281598b18c4efba4284aecb4420fc8d834dba357d8"
    }
```

```diff
    contract ChallengeManager (0x6228e2FB8C561f1a5A963039Bc38Eb6D539A1A7F) {
    +++ description: None
      values.$pastUpgrades.1.2:
+        ["0x122B88885F1f365B69CAd38B167B039fEd0Ba096"]
      values.$pastUpgrades.1.1:
-        ["0x122B88885F1f365B69CAd38B167B039fEd0Ba096"]
+        "0x9226b704344df97784d15fc6cdbcfef620f393011c803879e7ec2e8c875665b0"
      values.$pastUpgrades.0.2:
+        ["0xEe9E5546A11Cb5b4A86e92DA05f2ef75C26E4754"]
      values.$pastUpgrades.0.1:
-        ["0xEe9E5546A11Cb5b4A86e92DA05f2ef75C26E4754"]
+        "0xd51bb4d6150d5fbaa61cf5281598b18c4efba4284aecb4420fc8d834dba357d8"
    }
```

```diff
    contract Outbox (0x655761AD5FC251F414D6993A73184B0669F278c8) {
    +++ description: None
      values.$pastUpgrades.0.2:
+        ["0x2a6DD4433ffa96dc1755814FC0d9cc83A5F68DeC"]
      values.$pastUpgrades.0.1:
-        ["0x2a6DD4433ffa96dc1755814FC0d9cc83A5F68DeC"]
+        "0xd51bb4d6150d5fbaa61cf5281598b18c4efba4284aecb4420fc8d834dba357d8"
    }
```

```diff
    contract L1ERC20Gateway (0x7870D5398DB488c669B406fBE57b8d05b6A35e42) {
    +++ description: None
      values.$pastUpgrades.0.2:
+        ["0xf43bce5D32742FFC862eA182b0b5544CbDBB0F02"]
      values.$pastUpgrades.0.1:
-        ["0xf43bce5D32742FFC862eA182b0b5544CbDBB0F02"]
+        "0xff7d995569e4a00193462406da253b8fb2fa14e8fddf5f79bed51180e6099c54"
    }
```

```diff
    contract Bridge (0x859a53Fe2C8DA961387030E7CB498D6D20d0B2DB) {
    +++ description: None
      values.$pastUpgrades.0.2:
+        ["0x1c6ACCd9d66f3B993928E7439c9A2d67b94a445F"]
      values.$pastUpgrades.0.1:
-        ["0x1c6ACCd9d66f3B993928E7439c9A2d67b94a445F"]
+        "0xd51bb4d6150d5fbaa61cf5281598b18c4efba4284aecb4420fc8d834dba357d8"
    }
```

```diff
    contract Inbox (0xBFfaA85c1756472fFC37e6D172A7eC0538C14474) {
    +++ description: None
      values.$pastUpgrades.2.2:
+        ["0xc235c5194f2404234fc7C99b4dd15289BB735Cf5"]
      values.$pastUpgrades.2.1:
-        ["0xc235c5194f2404234fc7C99b4dd15289BB735Cf5"]
+        "0xec98dd39612eb11b2d7e15fc9961c34aba0796fd078989942636728ebeb888e3"
      values.$pastUpgrades.1.2:
+        ["0x518465d9f81bDE1e573f9bD2a6761F8ADaAFe73e"]
      values.$pastUpgrades.1.1:
-        ["0x518465d9f81bDE1e573f9bD2a6761F8ADaAFe73e"]
+        "0x3ad996252ae2a17bb0e7b5ec38eee0d104fd097da479cb3911b34d925f1750d7"
      values.$pastUpgrades.0.2:
+        ["0x1162084C3C6575121146582Db5BE43189e8CEe6b"]
      values.$pastUpgrades.0.1:
-        ["0x1162084C3C6575121146582Db5BE43189e8CEe6b"]
+        "0xd51bb4d6150d5fbaa61cf5281598b18c4efba4284aecb4420fc8d834dba357d8"
    }
```

```diff
    contract L1GatewayRouter (0xD9041DeCaDcBA88844b373e7053B4AC7A3390D60) {
    +++ description: None
      values.$pastUpgrades.0.2:
+        ["0x6525137BfF366fbc0A89E3e5A4d244B5A0090a6D"]
      values.$pastUpgrades.0.1:
-        ["0x6525137BfF366fbc0A89E3e5A4d244B5A0090a6D"]
+        "0xff7d995569e4a00193462406da253b8fb2fa14e8fddf5f79bed51180e6099c54"
    }
```

```diff
    contract SequencerInbox (0xF4Ef823D57819AC7202a081A5B49376BD28E7b3a) {
    +++ description: None
      values.$pastUpgrades.1.2:
+        ["0x57411f5BA52531e8199066bC8EC650470A744883"]
      values.$pastUpgrades.1.1:
-        ["0x57411f5BA52531e8199066bC8EC650470A744883"]
+        "0x9226b704344df97784d15fc6cdbcfef620f393011c803879e7ec2e8c875665b0"
      values.$pastUpgrades.0.2:
+        ["0x873484Ba63353C8b71210ce123B465512d408B27"]
      values.$pastUpgrades.0.1:
-        ["0x873484Ba63353C8b71210ce123B465512d408B27"]
+        "0xd51bb4d6150d5fbaa61cf5281598b18c4efba4284aecb4420fc8d834dba357d8"
    }
```

Generated with discovered.json: 0xbd508c70095d27f69d033fd7031dfcd8338fbce0

# Diff at Wed, 16 Oct 2024 11:36:58 GMT:

- chain: ethereum
- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@a3d139b799cc0b28e5e912febb17464d4e5aef5d block: 20948097
- current block number: 20948097

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20948097 (main branch discovery), not current.

```diff
    contract RollupProxy (0x5073dA9cA4810f3E0aA01c20c7d9d02C3f522e11) {
    +++ description: Manages rollup components, list of Stakers and Validators. Entry point for Validators creating new Rollup Nodes (state commits) and Challengers submitting fraud proofs.
      issuedPermissions.5:
+        {"permission":"validate","target":"0xe528E74302FFCF6F9F6a1c973968d98F0fDbad8f","via":[]}
      issuedPermissions.4:
+        {"permission":"validate","target":"0x9A6a3354Ea78572EDB7df8458911e1ceD733c224","via":[]}
      issuedPermissions.3:
+        {"permission":"validate","target":"0x944eB0a2829A859959586b10D54229278534a696","via":[]}
      issuedPermissions.2:
+        {"permission":"validate","target":"0x64Cf65036a76E3827e448cadbc53D31EefDCE04a","via":[]}
      issuedPermissions.1:
+        {"permission":"validate","target":"0x2bfDA59220413DEd39dD0E443620b5277EcE6348","via":[]}
    }
```

```diff
    contract SequencerInbox (0xF4Ef823D57819AC7202a081A5B49376BD28E7b3a) {
    +++ description: None
      issuedPermissions.1:
+        {"permission":"upgrade","target":"0x74C717C01425eb475A5fC55d2A4a9045fC9800df","via":[]}
      issuedPermissions.0.permission:
-        "upgrade"
+        "sequence"
      issuedPermissions.0.target:
-        "0x74C717C01425eb475A5fC55d2A4a9045fC9800df"
+        "0xe27f3f6db6824def1738b2aACe2672aC59046a39"
    }
```

Generated with discovered.json: 0x8c48ccf731dd277fbf745171c42c8df88267f82b

# Diff at Mon, 14 Oct 2024 10:52:04 GMT:

- chain: ethereum
- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@1afc77ff111ceb0970e7d09efcc7b2f376b0c281 block: 20948097
- current block number: 20948097

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20948097 (main branch discovery), not current.

```diff
    contract Bridger (0x0f1b7bd7762662B23486320AA91F30312184f70C) {
    +++ description: None
      sourceHashes:
+        ["0xeeb4c186c20cc83c0dc547c387bbb8738f8a0b213ed2e8ecb325ad9326c326bc","0xe7c2c13ea3945f7f426234c719fd1c436d2f5e0152427b80b30ca059c9f2f4e5"]
    }
```

```diff
    contract ExecutorMultisig (0x17Eb10e12a78f986C78F973Fc70eD88072B33B7d) {
    +++ description: None
      sourceHashes:
+        ["0x81a7349eebb98ac33b0bc6842e3cb258034a8f2a4ba004570bb8e2e25947f9ff","0xd42bbf9f7dcd3720a7fc6bdc6edfdfae8800a37d6dd4decfa0ef6ca4a2e88940"]
    }
```

```diff
    contract ValidatorUtils (0x2b0E04Dc90e3fA58165CB41E2834B44A56E766aF) {
    +++ description: None
      sourceHashes:
+        ["0xd9b36ec321be937cc727b5bdb0afa0e1a0a28448ef1a202d4f181a01ce57bdc8"]
    }
```

```diff
    contract RollupProxy (0x5073dA9cA4810f3E0aA01c20c7d9d02C3f522e11) {
    +++ description: Manages rollup components, list of Stakers and Validators. Entry point for Validators creating new Rollup Nodes (state commits) and Challengers submitting fraud proofs.
      sourceHashes:
+        ["0xb8da0b3748daac768860783e8555198fd2d1bbdffb775b81557a7124890c7eca","0x8b48118fe606012c0dcac2ccc1821785935aec89fab8f219f47b32c482b0017e","0xef94a66bd5339efd18fb9ca1f8031482e7ef7bbe6c5a0a10fae254ab83712406"]
    }
```

```diff
    contract RollupEventInbox (0x52EcE832AF3DF3125BbfD6423E0425dB3fA99D3F) {
    +++ description: None
      sourceHashes:
+        ["0xa7e3f6c355703ed46fcb2156862c4f01792b87beb10a87a81ce3bd5beee79b67","0xcd37abd5bdcc8c37cbf37dcfa4889d5b238388344d913b3a48914f659e0d627b"]
    }
```

```diff
    contract UpgradeExecutor (0x59B851c8b1643e0735Ec3F2f0e528f3d89c3408a) {
    +++ description: None
      sourceHashes:
+        ["0xa7e3f6c355703ed46fcb2156862c4f01792b87beb10a87a81ce3bd5beee79b67","0xa7ff878cfd433a428d567d3b90fe1df400a048a1af5298f22cd4cd4fc25bdecd"]
    }
```

```diff
    contract ChallengeManager (0x6228e2FB8C561f1a5A963039Bc38Eb6D539A1A7F) {
    +++ description: None
      sourceHashes:
+        ["0xa7e3f6c355703ed46fcb2156862c4f01792b87beb10a87a81ce3bd5beee79b67","0x58a6261c83c2766f749641902ad6fdb695ea189d2747f073b57a8f35b9a547e5"]
    }
```

```diff
    contract Outbox (0x655761AD5FC251F414D6993A73184B0669F278c8) {
    +++ description: None
      sourceHashes:
+        ["0xa7e3f6c355703ed46fcb2156862c4f01792b87beb10a87a81ce3bd5beee79b67","0x28eec040eca7563195b19e22e11429d0f977820bfb60ac52e567ffde3c92cf77"]
    }
```

```diff
    contract OneStepProverHostIo (0x6c4322e9A0478CA7aDd30e561f96af379D3A22Bb) {
    +++ description: None
      sourceHashes:
+        ["0x5b0a5e16100b7e163dcf39dc6a9034f12a7bad7a475cdffc73054b937be0683d"]
    }
```

```diff
    contract ProxyAdmin (0x74C717C01425eb475A5fC55d2A4a9045fC9800df) {
    +++ description: None
      sourceHashes:
+        ["0xf944f88083f41ff959fefbdcd6fc3ae633692b072b8497fb14cbdd843eded490"]
    }
```

```diff
    contract OneStepProver0 (0x76f72B8eFDA2DCDD3fB5A8c16d576c25eD43D645) {
    +++ description: None
      sourceHashes:
+        ["0x20330713abbbcf0219ef7d1c0aa3a6ede1b421f14c9d21b25c973e54fb75f5df"]
    }
```

```diff
    contract L1ERC20Gateway (0x7870D5398DB488c669B406fBE57b8d05b6A35e42) {
    +++ description: None
      sourceHashes:
+        ["0x36a2777510f3b20063560bdcb7f657da283bcfdc484a19b0a0f77d18f6a8b5e1","0x12b277cae4866b3d1f1772fcb7f861dc23247452179f0736c9dbe7012f6c14f6"]
    }
```

```diff
    contract Bridge (0x859a53Fe2C8DA961387030E7CB498D6D20d0B2DB) {
    +++ description: None
      sourceHashes:
+        ["0xa7e3f6c355703ed46fcb2156862c4f01792b87beb10a87a81ce3bd5beee79b67","0xb920455f1e366c7a89719abdd8d8174e4e7d353f2d4b7dea11b0571bf9526eae"]
    }
```

```diff
    contract OneStepProofEntry (0x8B02a8B985a81f96e49B8289FF60847FC6020e51) {
    +++ description: None
      sourceHashes:
+        ["0xf3479c667d20b1c17ea2573dc7fe09e4315a3e20bc09d31bc92603520cc962cc"]
    }
```

```diff
    contract ValidatorWalletCreator (0x9CAd81628aB7D8e239F1A5B497313341578c5F71) {
    +++ description: None
      sourceHashes:
+        ["0x4ef3473c840bed3b4c6258271a494794c1545f0d0f13c6a386d1e39e6180d67c"]
    }
```

```diff
    contract OneStepProverMath (0xba9D43FA3576bc40f13cb0731D770d1e510EdE46) {
    +++ description: None
      sourceHashes:
+        ["0xb2555ede3dfe7d6df28bd96d12a0113b658c213c7ce4e34fa539df7497bc51a1"]
    }
```

```diff
    contract Inbox (0xBFfaA85c1756472fFC37e6D172A7eC0538C14474) {
    +++ description: None
      sourceHashes:
+        ["0xa7e3f6c355703ed46fcb2156862c4f01792b87beb10a87a81ce3bd5beee79b67","0x457c34030000c1767f1ef518c365b671181e9e701db9642be8572edc1c44068c"]
    }
```

```diff
    contract L1GatewayRouter (0xD9041DeCaDcBA88844b373e7053B4AC7A3390D60) {
    +++ description: None
      sourceHashes:
+        ["0x36a2777510f3b20063560bdcb7f657da283bcfdc484a19b0a0f77d18f6a8b5e1","0x61cc407871b0c56af41887c99354633d150e4586f0a6d237c6efd10966b17bd7"]
    }
```

```diff
    contract OneStepProverMemory (0xf09Bc0285055BEA82165cA3F54054aa88BB3C169) {
    +++ description: None
      sourceHashes:
+        ["0x731b4466319a83c95ce227d1a6c85aa03864f5d2bed03bda186843033a8b8d61"]
    }
```

```diff
    contract BridgerOwnerMultisig (0xf152Abda9E4ce8b134eF22Dc3C6aCe19C4895D82) {
    +++ description: None
      sourceHashes:
+        ["0x81a7349eebb98ac33b0bc6842e3cb258034a8f2a4ba004570bb8e2e25947f9ff","0xd42bbf9f7dcd3720a7fc6bdc6edfdfae8800a37d6dd4decfa0ef6ca4a2e88940"]
    }
```

```diff
    contract SequencerInbox (0xF4Ef823D57819AC7202a081A5B49376BD28E7b3a) {
    +++ description: None
      sourceHashes:
+        ["0xa7e3f6c355703ed46fcb2156862c4f01792b87beb10a87a81ce3bd5beee79b67","0x50cf57b01499408fa99da27cf0fee96ec30f0d40667d1aa090c442bc80f0636b"]
    }
```

Generated with discovered.json: 0x994037948ef2900c64ad0927c5c60625d918ad6a

# Diff at Sat, 12 Oct 2024 07:41:15 GMT:

- chain: ethereum
- author: sekuba (<sekuba@users.noreply.github.com>)
- comparing to: main@86ddd4ba846ebcaec5953fa3bbd1a66f324e7175 block: 20842784
- current block number: 20948097

## Description

Add 3 new validators. (Total vali count is 5 now)

## Watched changes

```diff
    contract RollupProxy (0x5073dA9cA4810f3E0aA01c20c7d9d02C3f522e11) {
    +++ description: Manages rollup components, list of Stakers and Validators. Entry point for Validators creating new Rollup Nodes (state commits) and Challengers submitting fraud proofs.
      values.setValidatorCount:
-        2
+        3
      values.validators.4:
+        "0xe528E74302FFCF6F9F6a1c973968d98F0fDbad8f"
      values.validators.3:
+        "0x9A6a3354Ea78572EDB7df8458911e1ceD733c224"
      values.validators.2:
+        "0x944eB0a2829A859959586b10D54229278534a696"
      values.validators.1:
-        "0x944eB0a2829A859959586b10D54229278534a696"
+        "0x64Cf65036a76E3827e448cadbc53D31EefDCE04a"
      values.validators.0:
-        "0x64Cf65036a76E3827e448cadbc53D31EefDCE04a"
+        "0x2bfDA59220413DEd39dD0E443620b5277EcE6348"
    }
```

Generated with discovered.json: 0x8ddb56eb447e9f62e0031486081732d2d537625f

# Diff at Tue, 01 Oct 2024 10:51:44 GMT:

- chain: ethereum
- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@bd754dc73c66120164006054f8d25c5fae9cd910 block: 20842784
- current block number: 20842784

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20842784 (main branch discovery), not current.

```diff
    contract Bridger (0x0f1b7bd7762662B23486320AA91F30312184f70C) {
    +++ description: None
      values.$pastUpgrades:
+        [["2024-03-12T12:55:35.000Z",["0x925eC66892261203536a4aede9CA8e8D0feeA4ad"]],["2024-03-13T12:31:35.000Z",["0x31a20f10c846BD3Ed41c6c05c340bFD7A57ECADA"]],["2024-03-15T01:29:11.000Z",["0xE3641CbDAc5477C350c8FeAAF52Ddc021451A2aA"]],["2024-03-26T06:51:23.000Z",["0x989b9f407687DA3050C957CfeF5E6c18BeE7cb9F"]],["2024-05-21T00:55:23.000Z",["0x3636617973f25a512676cb06876f0C885568664a"]],["2024-05-22T00:09:11.000Z",["0x0210AE8703F8c9A88D7050825bd8001E359CB4BA"]],["2024-05-22T02:17:11.000Z",["0x270f25127D7C48c956459e113aa81615CC30AeE2"]],["2024-06-22T21:24:59.000Z",["0xEEe82E92bA40A694409B4BDa3D7426188c61163e"]],["2024-07-22T20:12:59.000Z",["0x23559eB4Ad22c31940a929958B104821126F35b7"]],["2024-08-06T21:07:23.000Z",["0x47e28e296BE2EE69b4579d5eecbABA38217a2b03"]],["2024-09-26T17:41:47.000Z",["0x21D3921B50617BDef223207118950B0b577e4007"]]]
    }
```

```diff
    contract RollupProxy (0x5073dA9cA4810f3E0aA01c20c7d9d02C3f522e11) {
    +++ description: Manages rollup components, list of Stakers and Validators. Entry point for Validators creating new Rollup Nodes (state commits) and Challengers submitting fraud proofs.
      values.$pastUpgrades:
+        [["2023-12-15T02:37:35.000Z",["0x0aE4dD666748bF0F6dB5c149Eab1D8aD27820A6A","0x660ea1675F7323dC3Ba0c8dDFB593225Eb01E3C1"]]]
      values.$upgradeCount:
+        1
    }
```

```diff
    contract RollupEventInbox (0x52EcE832AF3DF3125BbfD6423E0425dB3fA99D3F) {
    +++ description: None
      values.$pastUpgrades:
+        [["2023-12-15T02:37:35.000Z",["0x13BE515E44Eefaf3eBEFAD684F1FBB574Ac0A494"]]]
    }
```

```diff
    contract UpgradeExecutor (0x59B851c8b1643e0735Ec3F2f0e528f3d89c3408a) {
    +++ description: None
      values.$pastUpgrades:
+        [["2023-12-15T02:37:35.000Z",["0x6c21303F5986180B1394d2C89f3e883890E2867b"]]]
    }
```

```diff
    contract ChallengeManager (0x6228e2FB8C561f1a5A963039Bc38Eb6D539A1A7F) {
    +++ description: None
      values.$pastUpgrades:
+        [["2023-12-15T02:37:35.000Z",["0xEe9E5546A11Cb5b4A86e92DA05f2ef75C26E4754"]],["2024-06-27T16:39:47.000Z",["0x122B88885F1f365B69CAd38B167B039fEd0Ba096"]]]
    }
```

```diff
    contract Outbox (0x655761AD5FC251F414D6993A73184B0669F278c8) {
    +++ description: None
      values.$pastUpgrades:
+        [["2023-12-15T02:37:35.000Z",["0x2a6DD4433ffa96dc1755814FC0d9cc83A5F68DeC"]]]
    }
```

```diff
    contract L1ERC20Gateway (0x7870D5398DB488c669B406fBE57b8d05b6A35e42) {
    +++ description: None
      values.$pastUpgrades:
+        [["2023-12-15T03:06:35.000Z",["0xf43bce5D32742FFC862eA182b0b5544CbDBB0F02"]]]
    }
```

```diff
    contract Bridge (0x859a53Fe2C8DA961387030E7CB498D6D20d0B2DB) {
    +++ description: None
      values.$pastUpgrades:
+        [["2023-12-15T02:37:35.000Z",["0x1c6ACCd9d66f3B993928E7439c9A2d67b94a445F"]]]
    }
```

```diff
    contract Inbox (0xBFfaA85c1756472fFC37e6D172A7eC0538C14474) {
    +++ description: None
      values.$pastUpgrades:
+        [["2023-12-15T02:37:35.000Z",["0x1162084C3C6575121146582Db5BE43189e8CEe6b"]],["2024-05-03T15:22:59.000Z",["0x518465d9f81bDE1e573f9bD2a6761F8ADaAFe73e"]],["2024-05-08T00:06:47.000Z",["0xc235c5194f2404234fc7C99b4dd15289BB735Cf5"]]]
    }
```

```diff
    contract L1GatewayRouter (0xD9041DeCaDcBA88844b373e7053B4AC7A3390D60) {
    +++ description: None
      values.$pastUpgrades:
+        [["2023-12-15T03:06:35.000Z",["0x6525137BfF366fbc0A89E3e5A4d244B5A0090a6D"]]]
    }
```

```diff
    contract SequencerInbox (0xF4Ef823D57819AC7202a081A5B49376BD28E7b3a) {
    +++ description: None
      values.$pastUpgrades:
+        [["2023-12-15T02:37:35.000Z",["0x873484Ba63353C8b71210ce123B465512d408B27"]],["2024-06-27T16:39:47.000Z",["0x57411f5BA52531e8199066bC8EC650470A744883"]]]
    }
```

Generated with discovered.json: 0x3b19a1236807f46f2117249263404871458f5451

# Diff at Fri, 27 Sep 2024 15:14:59 GMT:

- chain: ethereum
- author: sekuba (<sekuba@users.noreply.github.com>)
- comparing to: main@4cb14cc1bdc343d171a7988f9f91f11edbf568a8 block: 20756734
- current block number: 20842784

## Description

Bridger upgrade: Formatting, libraries, removal of a USDM curve pool slot and Solv SFT wrapper.

## Watched changes

```diff
    contract Bridger (0x0f1b7bd7762662B23486320AA91F30312184f70C) {
    +++ description: None
      values.$implementation:
-        "0x47e28e296BE2EE69b4579d5eecbABA38217a2b03"
+        "0x21D3921B50617BDef223207118950B0b577e4007"
      values.$upgradeCount:
-        10
+        11
      values.SOLV_SFT_WRAP_ROUTER:
-        "0x6Ea88D4D0c4bC06F6A51f427eF295c93e10D0b36"
+        "0xe9eD7530427Cb41A56C9e004e00e074cCc168C44"
      values.usdmCurvePool:
-        "0x0000000000000000000000000000000000000000"
    }
```

## Source code changes

```diff
.../{.flat@20756734 => .flat}/Bridger/Bridger.sol  | 1909 +++-----------------
 1 file changed, 228 insertions(+), 1681 deletions(-)
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20756734 (main branch discovery), not current.

```diff
    contract RollupProxy (0x5073dA9cA4810f3E0aA01c20c7d9d02C3f522e11) {
    +++ description: Manages rollup components, list of Stakers and Validators. Entry point for Validators creating new Rollup Nodes (state commits) and Challengers submitting fraud proofs.
      usedTypes.0.arg.0x184884e1eb9fefdc158f6c8ac912bb183bf3cf83f0090317e0bc4ac5860baa39:
+        "ArbOS v32 wasmModuleRoot"
    }
```

Generated with discovered.json: 0xe37f1f654e8ff1efaa734238d523de5b48be6763

# Diff at Sun, 15 Sep 2024 14:53:00 GMT:

- chain: ethereum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@ca08843b12ed576cbcc139ad58ca045f72d96ab5 block: 20654590
- current block number: 20756734

## Description

One validator added (funded by kintoxyz.eth), one BridgerOwnerMultisig signer removed.

## Watched changes

```diff
    contract RollupProxy (0x5073dA9cA4810f3E0aA01c20c7d9d02C3f522e11) {
    +++ description: Manages rollup components, list of Stakers and Validators. Entry point for Validators creating new Rollup Nodes (state commits) and Challengers submitting fraud proofs.
      values.setValidatorCount:
-        1
+        2
      values.validators.1:
+        "0x944eB0a2829A859959586b10D54229278534a696"
    }
```

```diff
    contract BridgerOwnerMultisig (0xf152Abda9E4ce8b134eF22Dc3C6aCe19C4895D82) {
    +++ description: None
      values.$members.5:
-        "0xc31C4549356d46c37021393EeEb6f704B38061eC"
      values.$members.4:
-        "0x94561e98DD5E55271f91A103e4979aa6C493745E"
+        "0xc31C4549356d46c37021393EeEb6f704B38061eC"
      values.$members.3:
-        "0xc1f4D15C16A1f3555E0a5F7AeFD1e17AD4aaf40B"
+        "0x94561e98DD5E55271f91A103e4979aa6C493745E"
      values.$members.2:
-        "0x08E674c4538caE03B6c05405881dDCd95DcaF5a8"
+        "0xc1f4D15C16A1f3555E0a5F7AeFD1e17AD4aaf40B"
      values.$members.1:
-        "0x78C0Ea07874F4C1Cd97cc14aE343b1ae85982259"
+        "0x08E674c4538caE03B6c05405881dDCd95DcaF5a8"
      values.multisigThreshold:
-        "3 of 6 (50%)"
+        "3 of 5 (60%)"
    }
```

Generated with discovered.json: 0x6b0d48950c5ffab4b06009b6671f2315fd96d1b6

# Diff at Sun, 01 Sep 2024 08:42:21 GMT:

- chain: ethereum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@bee35b6cff7c52634ae8667cbb331e18ad4ec17a block: 20484220
- current block number: 20654590

## Description

Using new wasmModuleRoot mapping.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20484220 (main branch discovery), not current.

```diff
    contract RollupProxy (0x5073dA9cA4810f3E0aA01c20c7d9d02C3f522e11) {
    +++ description: Manages rollup components, list of Stakers and Validators. Entry point for Validators creating new Rollup Nodes (state commits) and Challengers submitting fraud proofs.
      usedTypes:
+        [{"typeCaster":"Mapping","arg":{"0xbb9d58e9527566138b682f3a207c0976d5359837f6e330f4017434cca983ff41":"ArbOS v1-rc1 wasmModuleRoot","0x9d68e40c47e3b87a8a7e6368cc52915720a6484bb2f47ceabad7e573e3a11232":"ArbOS v2.1 wasmModuleRoot","0x53c288a0ca7100c0f2db8ab19508763a51c7fd1be125d376d940a65378acaee7":"ArbOS v3 wasmModuleRoot","0x588762be2f364be15d323df2aa60ffff60f2b14103b34823b6f7319acd1ae7a3":"ArbOS v3.1 wasmModuleRoot","0xcfba6a883c50a1b4475ab909600fa88fc9cceed9e3ff6f43dccd2d27f6bd57cf":"ArbOS v3.2 wasmModuleRoot","0xa24ccdb052d92c5847e8ea3ce722442358db4b00985a9ee737c4e601b6ed9876":"ArbOS v4 wasmModuleRoot","0x1e09e6d9e35b93f33ed22b2bc8dc10bbcf63fdde5e8a1fb8cc1bcd1a52f14bd0":"ArbOS v5 wasmModuleRoot","0x3848eff5e0356faf1fc9cafecb789584c5e7f4f8f817694d842ada96613d8bab":"ArbOS v6 wasmModuleRoot","0x53dd4b9a3d807a8cbb4d58fbfc6a0857c3846d46956848cae0a1cc7eca2bb5a8":"ArbOS v7 wasmModuleRoot","0x2b20e1490d1b06299b222f3239b0ae07e750d8f3b4dedd19f500a815c1548bbc":"ArbOS v7.1 wasmModuleRoot","0xd1842bfbe047322b3f3b3635b5fe62eb611557784d17ac1d2b1ce9c170af6544":"ArbOS v9 wasmModuleRoot","0x6b94a7fc388fd8ef3def759297828dc311761e88d8179c7ee8d3887dc554f3c3":"ArbOS v10 wasmModuleRoot","0xda4e3ad5e7feacb817c21c8d0220da7650fe9051ece68a3f0b1c5d38bbb27b21":"ArbOS v10.1 wasmModuleRoot","0x0754e09320c381566cc0449904c377a52bd34a6b9404432e80afd573b67f7b17":"ArbOS v10.2 wasmModuleRoot","0xf559b6d4fa869472dabce70fe1c15221bdda837533dfd891916836975b434dec":"ArbOS v10.3 wasmModuleRoot","0xf4389b835497a910d7ba3ebfb77aa93da985634f3c052de1290360635be40c4a":"ArbOS v11 wasmModuleRoot","0x68e4fe5023f792d4ef584796c84d710303a5e12ea02d6e37e2b5e9c4332507c4":"ArbOS v11.1 wasmModuleRoot","0x8b104a2e80ac6165dc58b9048de12f301d70b02a0ab51396c22b4b4b802a16a4":"ArbOS v20 wasmModuleRoot","0xb0de9cb89e4d944ae6023a3b62276e54804c242fd8c4c2d8e6cc4450f5fa8b1b":"ArbOS v30 wasmModuleRoot","0x260f5fa5c3176a856893642e149cf128b5a8de9f828afec8d11184415dd8dc69":"ArbOS v31 wasmModuleRoot"}}]
    }
```

Generated with discovered.json: 0xeb81ebff50359a2acec8320c194a837f9672e694

# Diff at Fri, 30 Aug 2024 07:53:13 GMT:

- chain: ethereum
- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@6c1bd1f41fadf5f2cb1c1805b5a2c6138a3ed35a block: 20484220
- current block number: 20484220

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20484220 (main branch discovery), not current.

```diff
    contract UpgradeExecutor (0x59B851c8b1643e0735Ec3F2f0e528f3d89c3408a) {
    +++ description: None
      receivedPermissions.0.via:
-        []
    }
```

```diff
    contract ProxyAdmin (0x74C717C01425eb475A5fC55d2A4a9045fC9800df) {
    +++ description: None
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

```diff
    contract BridgerOwnerMultisig (0xf152Abda9E4ce8b134eF22Dc3C6aCe19C4895D82) {
    +++ description: None
      receivedPermissions.0.via:
-        []
    }
```

Generated with discovered.json: 0x1496ad7673a5d3547a95cfdeba4706a84444cf4a

# Diff at Fri, 23 Aug 2024 09:52:41 GMT:

- chain: ethereum
- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@67597c7d6c810bc726594446890178150240711e block: 20484220
- current block number: 20484220

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20484220 (main branch discovery), not current.

```diff
    contract Bridger (0x0f1b7bd7762662B23486320AA91F30312184f70C) {
    +++ description: None
      values.$upgradeCount:
+        10
    }
```

```diff
    contract RollupEventInbox (0x52EcE832AF3DF3125BbfD6423E0425dB3fA99D3F) {
    +++ description: None
      values.$upgradeCount:
+        1
    }
```

```diff
    contract UpgradeExecutor (0x59B851c8b1643e0735Ec3F2f0e528f3d89c3408a) {
    +++ description: None
      values.$upgradeCount:
+        1
    }
```

```diff
    contract ChallengeManager (0x6228e2FB8C561f1a5A963039Bc38Eb6D539A1A7F) {
    +++ description: None
      values.$upgradeCount:
+        2
    }
```

```diff
    contract Outbox (0x655761AD5FC251F414D6993A73184B0669F278c8) {
    +++ description: None
      values.$upgradeCount:
+        1
    }
```

```diff
    contract L1ERC20Gateway (0x7870D5398DB488c669B406fBE57b8d05b6A35e42) {
    +++ description: None
      values.$upgradeCount:
+        1
    }
```

```diff
    contract Bridge (0x859a53Fe2C8DA961387030E7CB498D6D20d0B2DB) {
    +++ description: None
      values.$upgradeCount:
+        1
    }
```

```diff
    contract Inbox (0xBFfaA85c1756472fFC37e6D172A7eC0538C14474) {
    +++ description: None
      values.$upgradeCount:
+        3
    }
```

```diff
    contract L1GatewayRouter (0xD9041DeCaDcBA88844b373e7053B4AC7A3390D60) {
    +++ description: None
      values.$upgradeCount:
+        1
    }
```

```diff
    contract SequencerInbox (0xF4Ef823D57819AC7202a081A5B49376BD28E7b3a) {
    +++ description: None
      values.$upgradeCount:
+        2
    }
```

Generated with discovered.json: 0xeaa6de643e6af66cd4217f876215b1d79da67240

# Diff at Wed, 21 Aug 2024 10:03:27 GMT:

- chain: ethereum
- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@2f6dde3357bf5d79196b6e94f79d853a6c4ec72b block: 20484220
- current block number: 20484220

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20484220 (main branch discovery), not current.

```diff
    contract Bridger (0x0f1b7bd7762662B23486320AA91F30312184f70C) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0xf152Abda9E4ce8b134eF22Dc3C6aCe19C4895D82","via":[]}]
    }
```

```diff
    contract RollupProxy (0x5073dA9cA4810f3E0aA01c20c7d9d02C3f522e11) {
    +++ description: Manages rollup components, list of Stakers and Validators. Entry point for Validators creating new Rollup Nodes (state commits) and Challengers submitting fraud proofs.
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x59B851c8b1643e0735Ec3F2f0e528f3d89c3408a","via":[]}]
    }
```

```diff
    contract RollupEventInbox (0x52EcE832AF3DF3125BbfD6423E0425dB3fA99D3F) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x74C717C01425eb475A5fC55d2A4a9045fC9800df","via":[]}]
    }
```

```diff
    contract UpgradeExecutor (0x59B851c8b1643e0735Ec3F2f0e528f3d89c3408a) {
    +++ description: None
      assignedPermissions:
-        {"upgrade":["0x5073dA9cA4810f3E0aA01c20c7d9d02C3f522e11"]}
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x74C717C01425eb475A5fC55d2A4a9045fC9800df","via":[]}]
      receivedPermissions:
+        [{"permission":"upgrade","target":"0x5073dA9cA4810f3E0aA01c20c7d9d02C3f522e11","via":[]}]
    }
```

```diff
    contract ChallengeManager (0x6228e2FB8C561f1a5A963039Bc38Eb6D539A1A7F) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x74C717C01425eb475A5fC55d2A4a9045fC9800df","via":[]}]
    }
```

```diff
    contract Outbox (0x655761AD5FC251F414D6993A73184B0669F278c8) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x74C717C01425eb475A5fC55d2A4a9045fC9800df","via":[]}]
    }
```

```diff
    contract ProxyAdmin (0x74C717C01425eb475A5fC55d2A4a9045fC9800df) {
    +++ description: None
      assignedPermissions:
-        {"upgrade":["0x52EcE832AF3DF3125BbfD6423E0425dB3fA99D3F","0x59B851c8b1643e0735Ec3F2f0e528f3d89c3408a","0x6228e2FB8C561f1a5A963039Bc38Eb6D539A1A7F","0x655761AD5FC251F414D6993A73184B0669F278c8","0x7870D5398DB488c669B406fBE57b8d05b6A35e42","0x859a53Fe2C8DA961387030E7CB498D6D20d0B2DB","0xBFfaA85c1756472fFC37e6D172A7eC0538C14474","0xD9041DeCaDcBA88844b373e7053B4AC7A3390D60","0xF4Ef823D57819AC7202a081A5B49376BD28E7b3a"]}
      receivedPermissions:
+        [{"permission":"upgrade","target":"0x52EcE832AF3DF3125BbfD6423E0425dB3fA99D3F","via":[]},{"permission":"upgrade","target":"0x59B851c8b1643e0735Ec3F2f0e528f3d89c3408a","via":[]},{"permission":"upgrade","target":"0x6228e2FB8C561f1a5A963039Bc38Eb6D539A1A7F","via":[]},{"permission":"upgrade","target":"0x655761AD5FC251F414D6993A73184B0669F278c8","via":[]},{"permission":"upgrade","target":"0x7870D5398DB488c669B406fBE57b8d05b6A35e42","via":[]},{"permission":"upgrade","target":"0x859a53Fe2C8DA961387030E7CB498D6D20d0B2DB","via":[]},{"permission":"upgrade","target":"0xBFfaA85c1756472fFC37e6D172A7eC0538C14474","via":[]},{"permission":"upgrade","target":"0xD9041DeCaDcBA88844b373e7053B4AC7A3390D60","via":[]},{"permission":"upgrade","target":"0xF4Ef823D57819AC7202a081A5B49376BD28E7b3a","via":[]}]
    }
```

```diff
    contract L1ERC20Gateway (0x7870D5398DB488c669B406fBE57b8d05b6A35e42) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x74C717C01425eb475A5fC55d2A4a9045fC9800df","via":[]}]
    }
```

```diff
    contract Bridge (0x859a53Fe2C8DA961387030E7CB498D6D20d0B2DB) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x74C717C01425eb475A5fC55d2A4a9045fC9800df","via":[]}]
    }
```

```diff
    contract Inbox (0xBFfaA85c1756472fFC37e6D172A7eC0538C14474) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x74C717C01425eb475A5fC55d2A4a9045fC9800df","via":[]}]
    }
```

```diff
    contract L1GatewayRouter (0xD9041DeCaDcBA88844b373e7053B4AC7A3390D60) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x74C717C01425eb475A5fC55d2A4a9045fC9800df","via":[]}]
    }
```

```diff
    contract BridgerOwnerMultisig (0xf152Abda9E4ce8b134eF22Dc3C6aCe19C4895D82) {
    +++ description: None
      assignedPermissions:
-        {"upgrade":["0x0f1b7bd7762662B23486320AA91F30312184f70C"]}
      receivedPermissions:
+        [{"permission":"upgrade","target":"0x0f1b7bd7762662B23486320AA91F30312184f70C","via":[]}]
    }
```

```diff
    contract SequencerInbox (0xF4Ef823D57819AC7202a081A5B49376BD28E7b3a) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x74C717C01425eb475A5fC55d2A4a9045fC9800df","via":[]}]
    }
```

Generated with discovered.json: 0x5fd3c00bb4357b64ecd40c9e374080c1d9ce1921

# Diff at Fri, 09 Aug 2024 11:59:51 GMT:

- chain: ethereum
- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@bf40aa32f030fd312056ca0ef198c8550467d1d7 block: 20484220
- current block number: 20484220

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20484220 (main branch discovery), not current.

```diff
    contract ProxyAdmin (0x74C717C01425eb475A5fC55d2A4a9045fC9800df) {
    +++ description: None
      assignedPermissions.upgrade.8:
-        "0x59B851c8b1643e0735Ec3F2f0e528f3d89c3408a"
+        "0xF4Ef823D57819AC7202a081A5B49376BD28E7b3a"
      assignedPermissions.upgrade.7:
-        "0x6228e2FB8C561f1a5A963039Bc38Eb6D539A1A7F"
+        "0xD9041DeCaDcBA88844b373e7053B4AC7A3390D60"
      assignedPermissions.upgrade.6:
-        "0xF4Ef823D57819AC7202a081A5B49376BD28E7b3a"
+        "0xBFfaA85c1756472fFC37e6D172A7eC0538C14474"
      assignedPermissions.upgrade.5:
-        "0xBFfaA85c1756472fFC37e6D172A7eC0538C14474"
+        "0x859a53Fe2C8DA961387030E7CB498D6D20d0B2DB"
      assignedPermissions.upgrade.4:
-        "0xD9041DeCaDcBA88844b373e7053B4AC7A3390D60"
+        "0x7870D5398DB488c669B406fBE57b8d05b6A35e42"
      assignedPermissions.upgrade.2:
-        "0x52EcE832AF3DF3125BbfD6423E0425dB3fA99D3F"
+        "0x6228e2FB8C561f1a5A963039Bc38Eb6D539A1A7F"
      assignedPermissions.upgrade.1:
-        "0x7870D5398DB488c669B406fBE57b8d05b6A35e42"
+        "0x59B851c8b1643e0735Ec3F2f0e528f3d89c3408a"
      assignedPermissions.upgrade.0:
-        "0x859a53Fe2C8DA961387030E7CB498D6D20d0B2DB"
+        "0x52EcE832AF3DF3125BbfD6423E0425dB3fA99D3F"
    }
```

Generated with discovered.json: 0x109d4e2634a7d8f01619e5caf084ca35e1c2640c

# Diff at Fri, 09 Aug 2024 10:09:58 GMT:

- chain: ethereum
- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@1f0da1d0aab7bc6b3b5e54e7e93480bd98e57035 block: 20484220
- current block number: 20484220

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20484220 (main branch discovery), not current.

```diff
    contract ExecutorMultisig (0x17Eb10e12a78f986C78F973Fc70eD88072B33B7d) {
    +++ description: None
      values.$multisigThreshold:
-        "3 of 5 (60%)"
      values.getOwners:
-        ["0x08E674c4538caE03B6c05405881dDCd95DcaF5a8","0xc1f4D15C16A1f3555E0a5F7AeFD1e17AD4aaf40B","0x12ee26aD74d50a1f6BDD90811387d1e0f3e7C76A","0x356000Cec4fC967f8FC372381D983426760A0391","0x94561e98DD5E55271f91A103e4979aa6C493745E"]
      values.getThreshold:
-        3
      values.$members:
+        ["0x08E674c4538caE03B6c05405881dDCd95DcaF5a8","0xc1f4D15C16A1f3555E0a5F7AeFD1e17AD4aaf40B","0x12ee26aD74d50a1f6BDD90811387d1e0f3e7C76A","0x356000Cec4fC967f8FC372381D983426760A0391","0x94561e98DD5E55271f91A103e4979aa6C493745E"]
      values.$threshold:
+        3
      values.multisigThreshold:
+        "3 of 5 (60%)"
    }
```

```diff
    contract UpgradeExecutor (0x59B851c8b1643e0735Ec3F2f0e528f3d89c3408a) {
    +++ description: None
      assignedPermissions.admin:
-        ["0x5073dA9cA4810f3E0aA01c20c7d9d02C3f522e11"]
      assignedPermissions.upgrade:
+        ["0x5073dA9cA4810f3E0aA01c20c7d9d02C3f522e11"]
    }
```

```diff
    contract ProxyAdmin (0x74C717C01425eb475A5fC55d2A4a9045fC9800df) {
    +++ description: None
      assignedPermissions.admin:
-        ["0x52EcE832AF3DF3125BbfD6423E0425dB3fA99D3F","0x59B851c8b1643e0735Ec3F2f0e528f3d89c3408a","0x6228e2FB8C561f1a5A963039Bc38Eb6D539A1A7F","0x655761AD5FC251F414D6993A73184B0669F278c8","0x7870D5398DB488c669B406fBE57b8d05b6A35e42","0x859a53Fe2C8DA961387030E7CB498D6D20d0B2DB","0xBFfaA85c1756472fFC37e6D172A7eC0538C14474","0xD9041DeCaDcBA88844b373e7053B4AC7A3390D60","0xF4Ef823D57819AC7202a081A5B49376BD28E7b3a"]
      assignedPermissions.upgrade:
+        ["0x859a53Fe2C8DA961387030E7CB498D6D20d0B2DB","0x7870D5398DB488c669B406fBE57b8d05b6A35e42","0x52EcE832AF3DF3125BbfD6423E0425dB3fA99D3F","0x655761AD5FC251F414D6993A73184B0669F278c8","0xD9041DeCaDcBA88844b373e7053B4AC7A3390D60","0xBFfaA85c1756472fFC37e6D172A7eC0538C14474","0xF4Ef823D57819AC7202a081A5B49376BD28E7b3a","0x6228e2FB8C561f1a5A963039Bc38Eb6D539A1A7F","0x59B851c8b1643e0735Ec3F2f0e528f3d89c3408a"]
    }
```

```diff
    contract BridgerOwnerMultisig (0xf152Abda9E4ce8b134eF22Dc3C6aCe19C4895D82) {
    +++ description: None
      assignedPermissions.admin:
-        ["0x0f1b7bd7762662B23486320AA91F30312184f70C"]
      assignedPermissions.upgrade:
+        ["0x0f1b7bd7762662B23486320AA91F30312184f70C"]
      values.$multisigThreshold:
-        "3 of 6 (50%)"
      values.getOwners:
-        ["0x5D973Ea995d14799E528B14472346bfDE21eAe2e","0x78C0Ea07874F4C1Cd97cc14aE343b1ae85982259","0x08E674c4538caE03B6c05405881dDCd95DcaF5a8","0xc1f4D15C16A1f3555E0a5F7AeFD1e17AD4aaf40B","0x94561e98DD5E55271f91A103e4979aa6C493745E","0xc31C4549356d46c37021393EeEb6f704B38061eC"]
      values.getThreshold:
-        3
      values.$members:
+        ["0x5D973Ea995d14799E528B14472346bfDE21eAe2e","0x78C0Ea07874F4C1Cd97cc14aE343b1ae85982259","0x08E674c4538caE03B6c05405881dDCd95DcaF5a8","0xc1f4D15C16A1f3555E0a5F7AeFD1e17AD4aaf40B","0x94561e98DD5E55271f91A103e4979aa6C493745E","0xc31C4549356d46c37021393EeEb6f704B38061eC"]
      values.$threshold:
+        3
      values.multisigThreshold:
+        "3 of 6 (50%)"
    }
```

Generated with discovered.json: 0x5358410234a44c12d83a38d894732c1ce46d329c

# Diff at Thu, 08 Aug 2024 13:39:47 GMT:

- chain: ethereum
- author: vincfurc (<10850139+vincfurc@users.noreply.github.com>)
- comparing to: main@55033526285d11b30f44e7cea5874c4f4d65ed80 block: 20383066
- current block number: 20484220

## Description

Users can deposit stUSD from Arbitrum on Kinto, they've added new logic to swap this to USDC or USDA before bridging.
Now using 0x AllowanceHolder contract to set allowances for token swap.

## Watched changes

```diff
    contract Bridger (0x0f1b7bd7762662B23486320AA91F30312184f70C) {
    +++ description: None
      values.$implementation:
-        "0x23559eB4Ad22c31940a929958B104821126F35b7"
+        "0x47e28e296BE2EE69b4579d5eecbABA38217a2b03"
      values.swapRouter:
-        "0xDef1C0ded9bec7F1a1670819833240f027b25EfF"
+        "0x0000000000001fF3684f28c67538d4D072C22734"
      values.angleSwapper:
+        "0xD253b62108d1831aEd298Fc2434A5A8e4E418053"
      values.stUSD:
+        "0x0022228a2cc5E7eF0274A7Baa600d44da5aB5776"
      values.USDA:
+        "0x0000206329b97DB379d5E1Bf586BbDB969C63274"
    }
```

## Source code changes

```diff
.../{.flat@20383066 => .flat}/Bridger/Bridger.sol  | 31 ++++++++++++++++++++--
 1 file changed, 29 insertions(+), 2 deletions(-)
```

Generated with discovered.json: 0x21d17cece14cfa4ac60bf5716ed635ed9071d73c

# Diff at Tue, 30 Jul 2024 11:12:11 GMT:

- chain: ethereum
- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@b2b6471ff62871f4956541f42ec025c356c08f7e block: 20383066
- current block number: 20383066

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20383066 (main branch discovery), not current.

```diff
    contract RollupProxy (0x5073dA9cA4810f3E0aA01c20c7d9d02C3f522e11) {
    +++ description: Manages rollup components, list of Stakers and Validators. Entry point for Validators creating new Rollup Nodes (state commits) and Challengers submitting fraud proofs.
      fieldMeta:
+        {"confirmPeriodBlocks":{"description":"Challenge period. (Number of blocks until a node is confirmed)."},"wasmModuleRoot":{"description":"Root hash of the WASM module used for execution, like a fingerprint of the L2 logic. Can be associated with ArbOS versions."}}
    }
```

Generated with discovered.json: 0xa42788482c8e1ace73e574337062d675b58d5479

# Diff at Thu, 25 Jul 2024 10:48:35 GMT:

- chain: ethereum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@42efd1ab55ccb369bfc0edad188854abb104aaef block: 20367973
- current block number: 20383066

## Description

Kinto sends blobs, tracked txs added.

## Watched changes

```diff
    contract SequencerInbox (0xF4Ef823D57819AC7202a081A5B49376BD28E7b3a) {
    +++ description: None
      values.postsBlobs:
-        false
+        true
    }
```

Generated with discovered.json: 0x9590eb8caf62006f1a01c0e27a62734ce8c11f6c

# Diff at Tue, 23 Jul 2024 08:16:34 GMT:

- chain: ethereum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@a7fe674fdf7aafe1f69f1463836cac0d7e337d34 block: 20362833
- current block number: 20367973

## Description

The bridger (gateway) is upgraded to support a new asset (solvBTC) which can be wrapped from WBTC.

## Watched changes

```diff
    contract Bridger (0x0f1b7bd7762662B23486320AA91F30312184f70C) {
    +++ description: None
      values.$implementation:
-        "0xEEe82E92bA40A694409B4BDa3D7426188c61163e"
+        "0x23559eB4Ad22c31940a929958B104821126F35b7"
      values.SOLV_BTC:
+        "0x3647c54c4c2C65bC7a2D63c0Da2809B399DBBDC0"
      values.SOLV_BTC_POOL_ID:
+        "0x488def4a346b409d5d57985a160cd216d29d4f555e1b716df4e04e2374d2d9f6"
      values.SOLV_SFT_WRAP_ROUTER:
+        "0x6Ea88D4D0c4bC06F6A51f427eF295c93e10D0b36"
      values.WBTC:
+        "0x2f2a2543B76A4166549F7aaB2e75Bef0aefC5B0f"
    }
```

## Source code changes

```diff
.../{.flat@20362833 => .flat}/Bridger/Bridger.sol  | 54 +++++++++++++++++-----
 1 file changed, 42 insertions(+), 12 deletions(-)
```

Generated with discovered.json: 0x87c5c2e00532cf5609ebd2a87ccf20e1d7afef8c

# Diff at Fri, 19 Jul 2024 08:55:45 GMT:

- chain: ethereum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@e818aac724e8e67da6b05262134684a79d6fb217 block: 20324731
- current block number: 20339515

## Description

wasmModuleRoot updated. Like before, this is not a root that we have seen before. Related to the [HF 5 Mainnet](https://github.com/ConstellationCrypto/kinto-go-ethereum/pull/6) and [HF 6 Mainnet](https://github.com/ConstellationCrypto/kinto-go-ethereum/pull/9).

## Watched changes

```diff
    contract RollupProxy (0x5073dA9cA4810f3E0aA01c20c7d9d02C3f522e11) {
    +++ description: Manages rollup components, list of Stakers and Validators. Entry point for Validators creating new Rollup Nodes (state commits) and Challengers submitting fraud proofs.
+++ description: Root hash of the WASM module used for execution, like a fingerprint of the L2 logic. Can be associated with ArbOS versions.
      values.wasmModuleRoot:
-        "0x89e305433a6403ac5e73b659b16ccaa2ed796cf6cd6fcb46e72c7d865a8ec6ae"
+        "0x2ca63ffd73f314d60f8d672954389881918100435f27fd4193becb12310d7faa"
    }
```

Generated with discovered.json: 0xf35de91de6d8a18812a6d9c106abeff0880f2aef

# Diff at Wed, 17 Jul 2024 07:24:08 GMT:

- chain: ethereum
- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@f46e1b9319335587ca32b6e85f9d2f0c7ab7a729 block: 20210980
- current block number: 20324731

## Description

Use the new handler to check if it's posting blobs.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20210980 (main branch discovery), not current.

```diff
    contract SequencerInbox (0xF4Ef823D57819AC7202a081A5B49376BD28E7b3a) {
    +++ description: None
      values.postsBlobs:
+        false
    }
```

Generated with discovered.json: 0xbb4b529ff5b280dc70aa4cf09e5651f5f00363fb

# Diff at Mon, 01 Jul 2024 10:10:33 GMT:

- chain: ethereum
- author: vincfurc (<10850139+vincfurc@users.noreply.github.com>)
- comparing to: main@0e7b6918e773793a1ad0061ea07b42646c37a13d block: 20177353
- current block number: 20210980

## Description

ChallengeManager.sol: added function to make challengeManager aware of the new OneStepProver contracts after updating to 4844.

OneStepProverHostIo.sol: added support for reading preimage from blobs.

SequencerInbox.sol: Added support for blobs posting (addSequencerL2BatchFromBlobs), and a for a batch poster manager that has the ability to change the batch poster addresses.

It is not posting data to blobs yet.

## Watched changes

```diff
-   Status: DELETED
    contract OneStepProofEntry (0x09824fe72BFF474d16D9c2774432E381BBD60662)
    +++ description: None
```

```diff
-   Status: DELETED
    contract OneStepProverMemory (0x4811500e0d376Fa8d2EA3CCb7c61E0afB4F5A7f1)
    +++ description: None
```

```diff
    contract RollupProxy (0x5073dA9cA4810f3E0aA01c20c7d9d02C3f522e11) {
    +++ description: Manages rollup components, list of Stakers and Validators. Entry point for Validators creating new Rollup Nodes (state commits) and Challengers submitting fraud proofs.
+++ description: Root hash of the WASM module used for execution, like a fingerprint of the L2 logic. Can be associated with ArbOS versions.
      values.wasmModuleRoot:
-        "0x6948185c62070f9523a93664e8d064627f65830fd308af5e82f21292a2060fb8"
+        "0x89e305433a6403ac5e73b659b16ccaa2ed796cf6cd6fcb46e72c7d865a8ec6ae"
    }
```

```diff
    contract ChallengeManager (0x6228e2FB8C561f1a5A963039Bc38Eb6D539A1A7F) {
    +++ description: None
      upgradeability.implementation:
-        "0xEe9E5546A11Cb5b4A86e92DA05f2ef75C26E4754"
+        "0x122B88885F1f365B69CAd38B167B039fEd0Ba096"
      implementations.0:
-        "0xEe9E5546A11Cb5b4A86e92DA05f2ef75C26E4754"
+        "0x122B88885F1f365B69CAd38B167B039fEd0Ba096"
      values.osp:
-        "0x09824fe72BFF474d16D9c2774432E381BBD60662"
+        "0x8B02a8B985a81f96e49B8289FF60847FC6020e51"
    }
```

```diff
-   Status: DELETED
    contract OneStepProverMath (0x89AF7C4C2198c426cFe6E86de0680A0850503e06)
    +++ description: None
```

```diff
-   Status: DELETED
    contract OneStepProverHostIo (0x99a2A31300816C1FA3f40818AC9280fe7271F878)
    +++ description: None
```

```diff
-   Status: DELETED
    contract OneStepProver0 (0xDf94F0474F205D086dbc2e66D69a856FCf520622)
    +++ description: None
```

```diff
    contract SequencerInbox (0xF4Ef823D57819AC7202a081A5B49376BD28E7b3a) {
    +++ description: None
      upgradeability.implementation:
-        "0x873484Ba63353C8b71210ce123B465512d408B27"
+        "0x57411f5BA52531e8199066bC8EC650470A744883"
      implementations.0:
-        "0x873484Ba63353C8b71210ce123B465512d408B27"
+        "0x57411f5BA52531e8199066bC8EC650470A744883"
      values.batchPosterManager:
+        "0x0000000000000000000000000000000000000000"
      values.BROTLI_MESSAGE_HEADER_FLAG:
+        "0x00"
      values.DAS_MESSAGE_HEADER_FLAG:
+        "0x80"
      values.DATA_BLOB_HEADER_FLAG:
+        "0x50"
      values.isUsingFeeToken:
+        false
      values.reader4844:
+        "0x434345973Ebf8249398E1EeB03A62bE418B48a05"
      values.TREE_DAS_MESSAGE_HEADER_FLAG:
+        "0x08"
      values.ZERO_HEAVY_MESSAGE_HEADER_FLAG:
+        "0x20"
    }
```

```diff
+   Status: CREATED
    contract  (0x434345973Ebf8249398E1EeB03A62bE418B48a05)
    +++ description: None
```

```diff
+   Status: CREATED
    contract OneStepProverHostIo (0x6c4322e9A0478CA7aDd30e561f96af379D3A22Bb)
    +++ description: None
```

```diff
+   Status: CREATED
    contract OneStepProver0 (0x76f72B8eFDA2DCDD3fB5A8c16d576c25eD43D645)
    +++ description: None
```

```diff
+   Status: CREATED
    contract OneStepProofEntry (0x8B02a8B985a81f96e49B8289FF60847FC6020e51)
    +++ description: None
```

```diff
+   Status: CREATED
    contract OneStepProverMath (0xba9D43FA3576bc40f13cb0731D770d1e510EdE46)
    +++ description: None
```

```diff
+   Status: CREATED
    contract OneStepProverMemory (0xf09Bc0285055BEA82165cA3F54054aa88BB3C169)
    +++ description: None
```

## Source code changes

```diff
.../ChallengeManager/ChallengeManager.sol          |   6 +
 .../OneStepProverHostIo.sol                        | 107 +++-
 .../SequencerInbox/SequencerInbox.sol              | 662 ++++++++++++++++-----
 3 files changed, 611 insertions(+), 164 deletions(-)
```

Generated with discovered.json: 0xd28981bbb340b8d7f4a0a3cc529555b09df580e4

# Diff at Mon, 24 Jun 2024 08:19:51 GMT:

- chain: ethereum
- author: sekuba (<sekuba@users.noreply.github.com>)
- comparing to: main@b54e27671cccd831f2f6414fffe3bd374840c6b7 block: 19976230
- current block number: 20160306

## Description

The Bridger (Gateway) contract is upgraded to support new assets (USDM) and deposit by PERMIT2 (`depositPermit2()` function). USDM is now also a supported finalAsset (outcoming asset) for swapping through the Bridger.

The Socket escrow for USDM is not yet used and will be added as soon as it has TVL.



## Watched changes

```diff
    contract Bridger (0x0f1b7bd7762662B23486320AA91F30312184f70C) {
    +++ description: None
      upgradeability.implementation:
-        "0x270f25127D7C48c956459e113aa81615CC30AeE2"
+        "0xEEe82E92bA40A694409B4BDa3D7426188c61163e"
      implementations.0:
-        "0x270f25127D7C48c956459e113aa81615CC30AeE2"
+        "0xEEe82E92bA40A694409B4BDa3D7426188c61163e"
      values.l2Vault:
-        "0x26181Dfc530d96523350e895180b09BAf3d816a0"
      values.PERMIT2:
+        "0x000000000022D473030F116dDEE9F6B43aC78BA3"
      values.USDC:
+        "0x0000000000000000000000000000000000000000"
      values.USDM:
+        "0x59D9356E565Ab3A36dD77763Fc0d87fEaf85508C"
      values.usdmCurvePool:
+        "0x0000000000000000000000000000000000000000"
      values.wUSDM:
+        "0x57F5E098CaD7A3D1Eed53991D4d66C45C9AF7812"
    }
```

## Source code changes

```diff
.../{.flat@19976230 => .flat}/Bridger/Bridger.sol  | 439 +++++++++++++++++----
 1 file changed, 359 insertions(+), 80 deletions(-)
```

Generated with discovered.json: 0x8ab0d2106a1286e919f74644647a18bfdb886090

# Diff at Wed, 29 May 2024 14:51:45 GMT:

- chain: ethereum
- author: sekuba (<sekuba@users.noreply.github.com>)
- comparing to: main@d0877009edde2713b2b4f20a593b40156f5de045 block: 19929993
- current block number: 19976230

## Description

Config related: Owner is upgrade admin.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19929993 (main branch discovery), not current.

```diff
    contract Bridger (0x0f1b7bd7762662B23486320AA91F30312184f70C) {
    +++ description: None
      upgradeability.admin:
-        "0x0000000000000000000000000000000000000000"
+        "0xf152Abda9E4ce8b134eF22Dc3C6aCe19C4895D82"
    }
```

Generated with discovered.json: 0x5bb6fb6f0a3145d9c836665d91d5d854ec30ae16

# Diff at Wed, 22 May 2024 15:45:03 GMT:

- chain: ethereum
- author: sekuba (<sekuba@users.noreply.github.com>)
- comparing to: main@d8b1d401a7eb2fd4dbc2edda92ae733061915c30 block: 19919191
- current block number: 19926394

## Description

The Bridger is upgraded to a new implementation. Currently there are no funds in it as the prelaunch-farm (Engen) has concluded and assets were [bridged](https://etherscan.io/tx/0xbbdbbf2f7ddd1ac994d9a96b2da163e72339866dee3dbac7004fe4a64ee26f92) via socket to the Kinto L2.

### Bridger.sol

The logic of the Bridger is still a Gateway contract to the Kinto L2. As the prelaunch phase has concluded, ERC-20 tokens can now be deposited to the Bridger and are bridged directly to the L2, so the Bridger will not escrow assets anymore. It also now uses a 0x exchange proxy to swap into 'final assets' before depositing. Final assets for Kinto can be defined by the depositer and can also be the inputAsset, in which case no swap is performed and the asset is bridged directly. The bridge address is supplied with the call to `depositERC20()`.

## Watched changes

```diff
    contract Bridger (0x0f1b7bd7762662B23486320AA91F30312184f70C) {
    +++ description: None
      upgradeability.implementation:
-        "0x3636617973f25a512676cb06876f0C885568664a"
+        "0x270f25127D7C48c956459e113aa81615CC30AeE2"
      implementations.0:
-        "0x3636617973f25a512676cb06876f0C885568664a"
+        "0x270f25127D7C48c956459e113aa81615CC30AeE2"
      values.exchangeProxy:
-        "0xDef1C0ded9bec7F1a1670819833240f027b25EfF"
      values.sDAI:
-        "0x83F20F44975D03b1b09e64809B757c47f942BEeA"
      values.swapsEnabled:
-        true
      values.weETH:
-        "0xCd5fE23C85820F7B72D0926FC9b05b43E359b7ee"
      values.swapRouter:
+        "0xDef1C0ded9bec7F1a1670819833240f027b25EfF"
    }
```

```diff
-   Status: DELETED
    contract ZeroEx (0xDef1C0ded9bec7F1a1670819833240f027b25EfF)
    +++ description: None
```

## Source code changes

```diff
.../{.flat@19919191 => .flat}/Bridger/Bridger.sol  | 1090 ++++++++++----------
 .../.flat@19919191/ZeroEx.sol => /dev/null         |  729 -------------
 2 files changed, 532 insertions(+), 1287 deletions(-)
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19919191 (main branch discovery), not current.

```diff
+   Status: CREATED
    contract ZeroEx (0xDef1C0ded9bec7F1a1670819833240f027b25EfF)
    +++ description: None
```

Generated with discovered.json: 0x1db08e3c132170b88ae88bdd175985aafd322d25

# Diff at Tue, 21 May 2024 15:32:00 GMT:

- chain: ethereum
- author: sekuba (<sekuba@users.noreply.github.com>)
- comparing to: main@d10db8000986dcc20fb2efb94c0e0636ac38fa21 block: 19888796
- current block number: 19919191

## Description

The Bridger contract (pre-launch escrow for Kinto) is upgraded: The hardcoded orbitstack-native bridges are removed and the bridgeDeposits() function is modified to allow bridging via arbitrary bridges. Kinto will use socket as an external bridge for their L2 and the assets currently locked in the Bridger contract.

## Watched changes

```diff
    contract Bridger (0x0f1b7bd7762662B23486320AA91F30312184f70C) {
    +++ description: None
      upgradeability.implementation:
-        "0x989b9f407687DA3050C957CfeF5E6c18BeE7cb9F"
+        "0x3636617973f25a512676cb06876f0C885568664a"
      implementations.0:
-        "0x989b9f407687DA3050C957CfeF5E6c18BeE7cb9F"
+        "0x3636617973f25a512676cb06876f0C885568664a"
      values.L1GatewayRouter:
-        "0xD9041DeCaDcBA88844b373e7053B4AC7A3390D60"
      values.standardGateway:
-        "0x7870D5398DB488c669B406fBE57b8d05b6A35e42"
      derivedName:
-        "BridgerV4"
+        "Bridger"
    }
```

## Source code changes

```diff
.../BridgerV4.sol => .flat/Bridger/Bridger.sol}    | 5518 ++++++++++----------
 1 file changed, 2757 insertions(+), 2761 deletions(-)
```

Generated with discovered.json: 0x76f1e50a00a33e6f1eb3cc4ddf6d1768e457194b

# Diff at Fri, 17 May 2024 09:28:07 GMT:

- chain: ethereum
- author: sekuba (<sekuba@users.noreply.github.com>)
- comparing to: main@cf6498d339a075296e717008e17a69561c236726 block: 19883606
- current block number: 19888796

## Description

The wasmModuleRoot changes to a new value (which is not known in our ArbOS history). Looking at the Kinto Github repo, this is the [Hardfork #4 upgrade](https://github.com/ConstellationCrypto/kinto-go-ethereum/pull/4).
Changes are mainly related to the integration of the Socket bridge contracts in preparation for the May 22nd 'full mainnet launch'.

## Watched changes

```diff
    contract RollupProxy (0x5073dA9cA4810f3E0aA01c20c7d9d02C3f522e11) {
    +++ description: Manages rollup components, list of Stakers and Validators. Entry point for Validators creating new Rollup Nodes (state commits) and Challengers submitting fraud proofs.
+++ description: Root hash of the WASM module used for execution, like a fingerprint of the L2 logic. Can be associated with ArbOS versions.
      values.wasmModuleRoot:
-        "0xf456393bd4b205d2f7b147d355c42ba852ff31527380884720bb4059ae731169"
+        "0x6948185c62070f9523a93664e8d064627f65830fd308af5e82f21292a2060fb8"
    }
```

Generated with discovered.json: 0xd5b099929f8b81f2ec7e02982922564807216015

# Diff at Thu, 16 May 2024 06:39:47 GMT:

- chain: ethereum
- author: sekuba (<sekuba@users.noreply.github.com>)
- comparing to: main@814c482c2be2428b2782bc85afecccac8c999b5e block: 19830808
- current block number: 19880804

## Description

New signer added to the ExecutorMultisig (Rollup owner): `0x08E674c4538caE03B6c05405881dDCd95DcaF5a8`

## Watched changes

```diff
    contract ExecutorMultisig (0x17Eb10e12a78f986C78F973Fc70eD88072B33B7d) {
    +++ description: None
      upgradeability.threshold:
-        "3 of 4 (75%)"
+        "3 of 5 (60%)"
      values.getOwners.4:
+        "0x94561e98DD5E55271f91A103e4979aa6C493745E"
      values.getOwners.3:
-        "0x94561e98DD5E55271f91A103e4979aa6C493745E"
+        "0x356000Cec4fC967f8FC372381D983426760A0391"
      values.getOwners.2:
-        "0x356000Cec4fC967f8FC372381D983426760A0391"
+        "0x12ee26aD74d50a1f6BDD90811387d1e0f3e7C76A"
      values.getOwners.1:
-        "0x12ee26aD74d50a1f6BDD90811387d1e0f3e7C76A"
+        "0xc1f4D15C16A1f3555E0a5F7AeFD1e17AD4aaf40B"
      values.getOwners.0:
-        "0xc1f4D15C16A1f3555E0a5F7AeFD1e17AD4aaf40B"
+        "0x08E674c4538caE03B6c05405881dDCd95DcaF5a8"
    }
```

Generated with discovered.json: 0x7b73332ba44977745e2bfdaabbe0a1aaf9f426ed

# Diff at Thu, 09 May 2024 06:51:41 GMT:

- chain: ethereum
- author: sekuba (<sekuba@users.noreply.github.com>)
- comparing to: main@d3bba0812727b9105a3f44fe55a68572c804b992 block: 19809397
- current block number: 19830808

## Description

The Inbox contract is upgraded with a minor change:

The l2AllowList that gets checked by the `whenRefundAddressAllowed` modifier is now settable by the owner or rollup contract whereas it was hardcoded before.

## Watched changes

```diff
    contract Inbox (0xBFfaA85c1756472fFC37e6D172A7eC0538C14474) {
    +++ description: None
      upgradeability.implementation:
-        "0x518465d9f81bDE1e573f9bD2a6761F8ADaAFe73e"
+        "0xc235c5194f2404234fc7C99b4dd15289BB735Cf5"
      implementations.0:
-        "0x518465d9f81bDE1e573f9bD2a6761F8ADaAFe73e"
+        "0xc235c5194f2404234fc7C99b4dd15289BB735Cf5"
    }
```

## Source code changes

```diff
.../Inbox/implementation/meta.txt                       |  2 +-
 .../src/nitro-contracts/bridge/AbsInbox.sol             | 17 +++++++++--------
 .../implementation/src/nitro-contracts/bridge/Inbox.sol |  1 -
 3 files changed, 10 insertions(+), 10 deletions(-)
```

Generated with discovered.json: 0x94bafe549ae45883fd41860a1577ce9a7ed8a42c

# Diff at Mon, 06 May 2024 06:56:42 GMT:

- chain: ethereum
- author: sekuba (<sekuba@users.noreply.github.com>)
- comparing to: main@91ddfe46c9a8cff7aff522924d50fd166a15932b block: 19776768
- current block number: 19809397

## Description

The Inbox implementation is upgraded with very minor changes:
- Modifier `whenRefundAddressAllowed` added (ensures that both `excessFeeRefundAddress` and `callValueRefundAddress` match the msg.sender unless they are whitelisted in `isAllowed`)
- `whenRefundAddressAllowed` is used by `createRetryableTicket()` and `createUnsafeRetryableTicket()`
- Formatting and import folder structure

## Watched changes

```diff
    contract Inbox (0xBFfaA85c1756472fFC37e6D172A7eC0538C14474) {
    +++ description: None
      upgradeability.implementation:
-        "0x1162084C3C6575121146582Db5BE43189e8CEe6b"
+        "0x518465d9f81bDE1e573f9bD2a6761F8ADaAFe73e"
      implementations.0:
-        "0x1162084C3C6575121146582Db5BE43189e8CEe6b"
+        "0x518465d9f81bDE1e573f9bD2a6761F8ADaAFe73e"
    }
```

## Source code changes

```diff
.../proxy/utils/Initializable.sol => /dev/null     |  80 ------
 .../lib/nitro-contracts}/src/bridge/IBridge.sol    |  22 ++
 .../src/bridge/IDelayedMessageProvider.sol         |   0
 .../lib/nitro-contracts}/src/bridge/IEthBridge.sol |   0
 .../lib/nitro-contracts}/src/bridge/IInbox.sol     |   0
 .../lib/nitro-contracts}/src/bridge/IInboxBase.sol |   0
 .../lib/nitro-contracts}/src/bridge/IOwnable.sol   |   0
 .../src/bridge/ISequencerInbox.sol                 |  91 +++++--
 .../src/libraries/AddressAliasHelper.sol           |   0
 .../src/libraries/DelegateCallAware.sol            |   0
 .../lib/nitro-contracts}/src/libraries/Error.sol   |  27 +-
 .../nitro-contracts/src/libraries/IGasRefunder.sol |  14 +
 .../src/libraries/MessageTypes.sol                 |   0
 .../nitro-contracts}/src/precompiles/ArbSys.sol    |   0
 .../contracts/proxy/utils/Initializable.sol        | 166 ++++++++++++
 .../contracts}/security/PausableUpgradeable.sol    |  34 ++-
 .../contracts}/utils/AddressUpgradeable.sol        |  74 ++++--
 .../contracts}/utils/ContextUpgradeable.sol        |   0
 .../contracts}/utils/StorageSlotUpgradeable.sol    |  60 ++++-
 .../Inbox/implementation/meta.txt                  |   2 +-
 .../src/libraries/IGasRefunder.sol => /dev/null    |  39 ---
 .../src/nitro-contracts}/bridge/AbsInbox.sol       | 199 +++++++--------
 .../src/nitro-contracts}/bridge/Inbox.sol          | 281 ++++++++++-----------
 23 files changed, 651 insertions(+), 438 deletions(-)
```

Generated with discovered.json: 0x4c11e99e03b2ae08fd367a9e6d1d673f2cfe3fff

# Diff at Wed, 01 May 2024 17:27:29 GMT:

- chain: ethereum
- author: sekuba (<sekuba@users.noreply.github.com>)
- comparing to: main@7dc564dd4cc2215657e1e7bd8648e6b99a23a992 block: 19624549
- current block number: 19776768

## Description

One signer of the BridgerOwnerMultisig is replaced.

## Watched changes

```diff
    contract BridgerOwnerMultisig (0xf152Abda9E4ce8b134eF22Dc3C6aCe19C4895D82) {
    +++ description: None
      values.getOwners.2:
-        "0xA20684BE1d0f5Ef96F8771A747fe5861D3F0FA07"
+        "0x08E674c4538caE03B6c05405881dDCd95DcaF5a8"
    }
```

Generated with discovered.json: 0x68af6aeb80b2dc820bf7190868730a2f8750fb79

# Diff at Wed, 03 Apr 2024 14:05:05 GMT:

- chain: ethereum
- author: Luca Donno (<donnoh99@gmail.com>)
- comparing to: main@66b605e31075e304396e566f31130e883d656762 block: 19531637
- current block number: 19575719

## Description

Provide description of changes. This section will be preserved.

## Watched changes

```diff
    contract RollupProxy (0x5073dA9cA4810f3E0aA01c20c7d9d02C3f522e11) {
    +++ description: None
      values.wasmModuleRoot:
-        "0xd2d42f1e7b5ea262991c3fd1fc7ed3dde4b21c28d3a7edec49f7c4fb51c03f73"
+        "0xf456393bd4b205d2f7b147d355c42ba852ff31527380884720bb4059ae731169"
    }
```

```diff
    contract BridgerOwnerMultisig (0xf152Abda9E4ce8b134eF22Dc3C6aCe19C4895D82) {
    +++ description: None
      values.nonce:
-        70
+        71
    }
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19531637 (main branch discovery), not current.

```diff
    contract GnosisSafe (0x17Eb10e12a78f986C78F973Fc70eD88072B33B7d) {
    +++ description: None
      name:
-        "GnosisSafe"
+        "ExecutorMultisig"
      values.nonce:
-        3
    }
```

```diff
+   Status: CREATED
    contract Bridger (0x0f1b7bd7762662B23486320AA91F30312184f70C)
    +++ description: None
```

```diff
+   Status: CREATED
    contract L1ERC20Gateway (0x7870D5398DB488c669B406fBE57b8d05b6A35e42)
    +++ description: None
```

```diff
+   Status: CREATED
    contract L1GatewayRouter (0xD9041DeCaDcBA88844b373e7053B4AC7A3390D60)
    +++ description: None
```

```diff
+   Status: CREATED
    contract BridgerOwnerMultisig (0xf152Abda9E4ce8b134eF22Dc3C6aCe19C4895D82)
    +++ description: None
```

Generated with discovered.json: 0x53029a74a02a35a658c77a12c8fb1aed6b7fee64

# Diff at Thu, 28 Mar 2024 09:12:29 GMT:

- chain: ethereum
- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@867de6120241d47b66bf76f83c490408eb3595b0 block: 19432708
- current block number: 19531637

## Description

Update discovery to include the multisig threshold.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19432708 (main branch discovery), not current.

```diff
    contract GnosisSafe (0x17Eb10e12a78f986C78F973Fc70eD88072B33B7d) {
    +++ description: None
      upgradeability.threshold:
+        "3 of 4 (75%)"
    }
```

Generated with discovered.json: 0x2a8f9804aa4d0e1c2654291b4dc0c829b5c12d40

# Diff at Thu, 14 Mar 2024 10:39:07 GMT:

- chain: ethereum
- author: sekuba (<sekuba@users.noreply.github.com>)
- comparing to: main@24c5721630392f8b6f59093376472db03d18b2c2 block: 19339792
- current block number: 19432708

## Description

Upgrade: Changed WASM module root hash of the RollupProxy contract.
Context: Kinto is currently in review.

## Watched changes

```diff
    contract GnosisSafe (0x17Eb10e12a78f986C78F973Fc70eD88072B33B7d) {
    +++ description: None
      values.nonce:
-        2
+        3
    }
```

```diff
    contract RollupProxy (0x5073dA9cA4810f3E0aA01c20c7d9d02C3f522e11) {
    +++ description: None
      values.wasmModuleRoot:
-        "0x1024d5971f781dd930c46b5fb6fb571e6af9f31b5dc191b82e82036c207cc968"
+        "0xd2d42f1e7b5ea262991c3fd1fc7ed3dde4b21c28d3a7edec49f7c4fb51c03f73"
    }
```

Generated with discovered.json: 0x6bf630000a540615c26b6e131a88c1214fde842c

# Diff at Fri, 01 Mar 2024 10:41:16 GMT:

- chain: ethereum
- author: Bartek Kiepuszewski (<bkiepuszewski@gmail.com>)
- current block number: 19339792

## Description

Update discovery to include the multisig threshold.

## Initial discovery

```diff
+   Status: CREATED
    contract OneStepProofEntry (0x09824fe72BFF474d16D9c2774432E381BBD60662) {
    }
```

```diff
+   Status: CREATED
    contract GnosisSafe (0x17Eb10e12a78f986C78F973Fc70eD88072B33B7d) {
    }
```

```diff
+   Status: CREATED
    contract  (0x27C7Bfd2cC11429e9b80c443b42FDBe4754F6c91) {
    }
```

```diff
+   Status: CREATED
    contract ValidatorUtils (0x2b0E04Dc90e3fA58165CB41E2834B44A56E766aF) {
    }
```

```diff
+   Status: CREATED
    contract OneStepProverMemory (0x4811500e0d376Fa8d2EA3CCb7c61E0afB4F5A7f1) {
    }
```

```diff
+   Status: CREATED
    contract RollupProxy (0x5073dA9cA4810f3E0aA01c20c7d9d02C3f522e11) {
    }
```

```diff
+   Status: CREATED
    contract RollupEventInbox (0x52EcE832AF3DF3125BbfD6423E0425dB3fA99D3F) {
    }
```

```diff
+   Status: CREATED
    contract UpgradeExecutor (0x59B851c8b1643e0735Ec3F2f0e528f3d89c3408a) {
    }
```

```diff
+   Status: CREATED
    contract ChallengeManager (0x6228e2FB8C561f1a5A963039Bc38Eb6D539A1A7F) {
    }
```

```diff
+   Status: CREATED
    contract Outbox (0x655761AD5FC251F414D6993A73184B0669F278c8) {
    }
```

```diff
+   Status: CREATED
    contract ProxyAdmin (0x74C717C01425eb475A5fC55d2A4a9045fC9800df) {
    }
```

```diff
+   Status: CREATED
    contract Bridge (0x859a53Fe2C8DA961387030E7CB498D6D20d0B2DB) {
    }
```

```diff
+   Status: CREATED
    contract OneStepProverMath (0x89AF7C4C2198c426cFe6E86de0680A0850503e06) {
    }
```

```diff
+   Status: CREATED
    contract OneStepProverHostIo (0x99a2A31300816C1FA3f40818AC9280fe7271F878) {
    }
```

```diff
+   Status: CREATED
    contract ValidatorWalletCreator (0x9CAd81628aB7D8e239F1A5B497313341578c5F71) {
    }
```

```diff
+   Status: CREATED
    contract Inbox (0xBFfaA85c1756472fFC37e6D172A7eC0538C14474) {
    }
```

```diff
+   Status: CREATED
    contract OneStepProver0 (0xDf94F0474F205D086dbc2e66D69a856FCf520622) {
    }
```

```diff
+   Status: CREATED
    contract SequencerInbox (0xF4Ef823D57819AC7202a081A5B49376BD28E7b3a) {
    }
```

