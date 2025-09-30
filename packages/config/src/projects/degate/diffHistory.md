Generated with discovered.json: 0xb8c8c4502e45d97918db9d7f0ce83c9de373e09e

# Diff at Mon, 01 Sep 2025 10:01:10 GMT:

Merge mark

Generated with discovered.json: 0xf34c27ac68b60161b9d1d2f5047a397d35a73236

# Diff at Mon, 14 Jul 2025 12:44:57 GMT:

- chain: ethereum
- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@9f4300dad2f3d080cd56fa311d4a848556c74e72 block: 18939731
- current block number: 18939731

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 18939731 (main branch discovery), not current.

```diff
    contract BlockVerifier (0x1c602313cDDC68C5789aCb7df0C92a93B0E04C9e) {
    +++ description: None
      address:
-        "0x1c602313cDDC68C5789aCb7df0C92a93B0E04C9e"
+        "eth:0x1c602313cDDC68C5789aCb7df0C92a93B0E04C9e"
      values.owner:
-        "0xd8C695DfAab475f55327Ce269096923EFECa2e0F"
+        "eth:0xd8C695DfAab475f55327Ce269096923EFECa2e0F"
      values.pendingOwner:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      implementationNames.0x1c602313cDDC68C5789aCb7df0C92a93B0E04C9e:
-        "BlockVerifier"
      implementationNames.eth:0x1c602313cDDC68C5789aCb7df0C92a93B0E04C9e:
+        "BlockVerifier"
    }
```

```diff
    contract LoopringOwner (0x2028834B2c0A36A918c10937EeA71BE4f932da52) {
    +++ description: None
      address:
-        "0x2028834B2c0A36A918c10937EeA71BE4f932da52"
+        "eth:0x2028834B2c0A36A918c10937EeA71BE4f932da52"
      values.getOwners.0:
-        "0xf5020ADf433645c451A4809eac0d6F680709f11B"
+        "eth:0xf5020ADf433645c451A4809eac0d6F680709f11B"
      values.getOwners.1:
-        "0xeD530f3b8675B0a576DaAe64C004676c65368DfD"
+        "eth:0xeD530f3b8675B0a576DaAe64C004676c65368DfD"
      values.getOwners.2:
-        "0xB7093FC2d926ADdE48122B70991fe68374879adf"
+        "eth:0xB7093FC2d926ADdE48122B70991fe68374879adf"
      values.getOwners.3:
-        "0xC715b8501039d3514787dC55BC09f89c293351e9"
+        "eth:0xC715b8501039d3514787dC55BC09f89c293351e9"
      values.getOwners.4:
-        "0x6EF4e54E049A5FffB629063D3a9ee38ac27551C8"
+        "eth:0x6EF4e54E049A5FffB629063D3a9ee38ac27551C8"
      values.getOwners.5:
-        "0x3Cd51A933b0803DDCcDF985A7c71C1C7357FE9Eb"
+        "eth:0x3Cd51A933b0803DDCcDF985A7c71C1C7357FE9Eb"
      implementationNames.0x2028834B2c0A36A918c10937EeA71BE4f932da52:
-        "MultiSigWallet"
      implementationNames.eth:0x2028834B2c0A36A918c10937EeA71BE4f932da52:
+        "MultiSigWallet"
    }
```

```diff
    EOA  (0x3Cd51A933b0803DDCcDF985A7c71C1C7357FE9Eb) {
    +++ description: None
      address:
-        "0x3Cd51A933b0803DDCcDF985A7c71C1C7357FE9Eb"
+        "eth:0x3Cd51A933b0803DDCcDF985A7c71C1C7357FE9Eb"
    }
```

```diff
    contract LoopringV3 (0x4d707cae77c5E82a00BF9572A55d3ef3a4e0c458) {
    +++ description: None
      address:
-        "0x4d707cae77c5E82a00BF9572A55d3ef3a4e0c458"
+        "eth:0x4d707cae77c5E82a00BF9572A55d3ef3a4e0c458"
      values.blockVerifierAddress:
-        "0x1c602313cDDC68C5789aCb7df0C92a93B0E04C9e"
+        "eth:0x1c602313cDDC68C5789aCb7df0C92a93B0E04C9e"
      values.lrcAddress:
-        "0x53C8395465A84955c95159814461466053DedEDE"
+        "eth:0x53C8395465A84955c95159814461466053DedEDE"
      values.owner:
-        "0x2028834B2c0A36A918c10937EeA71BE4f932da52"
+        "eth:0x2028834B2c0A36A918c10937EeA71BE4f932da52"
      values.pendingOwner:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      values.protocolFeeVault:
-        "0x7B0d44D5b2eF3A8B168FAfdcc321FAb0D9d5d08C"
+        "eth:0x7B0d44D5b2eF3A8B168FAfdcc321FAb0D9d5d08C"
      implementationNames.0x4d707cae77c5E82a00BF9572A55d3ef3a4e0c458:
-        "LoopringV3"
      implementationNames.eth:0x4d707cae77c5E82a00BF9572A55d3ef3a4e0c458:
+        "LoopringV3"
    }
```

```diff
    contract LoopringIOExchangeOwner (0x6B937A5920726e70c5bF1d4d4E18EEeEd46FaE83) {
    +++ description: None
      address:
-        "0x6B937A5920726e70c5bF1d4d4E18EEeEd46FaE83"
+        "eth:0x6B937A5920726e70c5bF1d4d4E18EEeEd46FaE83"
      values.blockSubmitters.0:
-        "0x84A00D39C3c95e839202E19F892F17743d6370a0"
+        "eth:0x84A00D39C3c95e839202E19F892F17743d6370a0"
      values.blockSubmitters.1:
-        "0xE9A37E8DDDbf4Bb3f5d6aCE6D01a137e484Db77C"
+        "eth:0xE9A37E8DDDbf4Bb3f5d6aCE6D01a137e484Db77C"
      values.owner:
-        "0x2028834B2c0A36A918c10937EeA71BE4f932da52"
+        "eth:0x2028834B2c0A36A918c10937EeA71BE4f932da52"
      values.pendingOwner:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      values.target:
-        "0xe63602a9B3DFE983187525AC985Fec4F57B24eD5"
+        "eth:0xe63602a9B3DFE983187525AC985Fec4F57B24eD5"
      implementationNames.0x6B937A5920726e70c5bF1d4d4E18EEeEd46FaE83:
-        "LoopringIOExchangeOwner"
      implementationNames.eth:0x6B937A5920726e70c5bF1d4d4E18EEeEd46FaE83:
+        "LoopringIOExchangeOwner"
    }
```

```diff
    EOA  (0x6EF4e54E049A5FffB629063D3a9ee38ac27551C8) {
    +++ description: None
      address:
-        "0x6EF4e54E049A5FffB629063D3a9ee38ac27551C8"
+        "eth:0x6EF4e54E049A5FffB629063D3a9ee38ac27551C8"
    }
```

```diff
    contract FeeVault (0x7B0d44D5b2eF3A8B168FAfdcc321FAb0D9d5d08C) {
    +++ description: None
      address:
-        "0x7B0d44D5b2eF3A8B168FAfdcc321FAb0D9d5d08C"
+        "eth:0x7B0d44D5b2eF3A8B168FAfdcc321FAb0D9d5d08C"
      values.getOwners.0:
-        "0xf5020ADf433645c451A4809eac0d6F680709f11B"
+        "eth:0xf5020ADf433645c451A4809eac0d6F680709f11B"
      values.getOwners.1:
-        "0xeD530f3b8675B0a576DaAe64C004676c65368DfD"
+        "eth:0xeD530f3b8675B0a576DaAe64C004676c65368DfD"
      values.getOwners.2:
-        "0xB7093FC2d926ADdE48122B70991fe68374879adf"
+        "eth:0xB7093FC2d926ADdE48122B70991fe68374879adf"
      values.getOwners.3:
-        "0xC715b8501039d3514787dC55BC09f89c293351e9"
+        "eth:0xC715b8501039d3514787dC55BC09f89c293351e9"
      values.getOwners.4:
-        "0x6EF4e54E049A5FffB629063D3a9ee38ac27551C8"
+        "eth:0x6EF4e54E049A5FffB629063D3a9ee38ac27551C8"
      values.getOwners.5:
-        "0x3Cd51A933b0803DDCcDF985A7c71C1C7357FE9Eb"
+        "eth:0x3Cd51A933b0803DDCcDF985A7c71C1C7357FE9Eb"
      implementationNames.0x7B0d44D5b2eF3A8B168FAfdcc321FAb0D9d5d08C:
-        "MultiSigWallet"
      implementationNames.eth:0x7B0d44D5b2eF3A8B168FAfdcc321FAb0D9d5d08C:
+        "MultiSigWallet"
    }
```

```diff
    contract DefaultDepositContract (0x814d0c1903D69EB1c7ceB8F5190B20A06892d1dA) {
    +++ description: None
      address:
-        "0x814d0c1903D69EB1c7ceB8F5190B20A06892d1dA"
+        "eth:0x814d0c1903D69EB1c7ceB8F5190B20A06892d1dA"
      values.exchange:
-        "0xe63602a9B3DFE983187525AC985Fec4F57B24eD5"
+        "eth:0xe63602a9B3DFE983187525AC985Fec4F57B24eD5"
      values.owner:
-        "0x2028834B2c0A36A918c10937EeA71BE4f932da52"
+        "eth:0x2028834B2c0A36A918c10937EeA71BE4f932da52"
      values.pendingOwner:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      implementationNames.0x814d0c1903D69EB1c7ceB8F5190B20A06892d1dA:
-        "DefaultDepositContract"
      implementationNames.eth:0x814d0c1903D69EB1c7ceB8F5190B20A06892d1dA:
+        "DefaultDepositContract"
    }
```

```diff
    EOA  (0x84A00D39C3c95e839202E19F892F17743d6370a0) {
    +++ description: None
      address:
-        "0x84A00D39C3c95e839202E19F892F17743d6370a0"
+        "eth:0x84A00D39C3c95e839202E19F892F17743d6370a0"
    }
```

```diff
    EOA  (0xB7093FC2d926ADdE48122B70991fe68374879adf) {
    +++ description: None
      address:
-        "0xB7093FC2d926ADdE48122B70991fe68374879adf"
+        "eth:0xB7093FC2d926ADdE48122B70991fe68374879adf"
    }
```

```diff
    EOA  (0xC715b8501039d3514787dC55BC09f89c293351e9) {
    +++ description: None
      address:
-        "0xC715b8501039d3514787dC55BC09f89c293351e9"
+        "eth:0xC715b8501039d3514787dC55BC09f89c293351e9"
    }
```

```diff
    EOA  (0xd8C695DfAab475f55327Ce269096923EFECa2e0F) {
    +++ description: None
      address:
-        "0xd8C695DfAab475f55327Ce269096923EFECa2e0F"
+        "eth:0xd8C695DfAab475f55327Ce269096923EFECa2e0F"
    }
```

```diff
    contract ExchangeV3 (0xe63602a9B3DFE983187525AC985Fec4F57B24eD5) {
    +++ description: None
      address:
-        "0xe63602a9B3DFE983187525AC985Fec4F57B24eD5"
+        "eth:0xe63602a9B3DFE983187525AC985Fec4F57B24eD5"
      values.getDepositContract:
-        "0x814d0c1903D69EB1c7ceB8F5190B20A06892d1dA"
+        "eth:0x814d0c1903D69EB1c7ceB8F5190B20A06892d1dA"
      values.loopringV3:
-        "0x4d707cae77c5E82a00BF9572A55d3ef3a4e0c458"
+        "eth:0x4d707cae77c5E82a00BF9572A55d3ef3a4e0c458"
      values.owner:
-        "0x6B937A5920726e70c5bF1d4d4E18EEeEd46FaE83"
+        "eth:0x6B937A5920726e70c5bF1d4d4E18EEeEd46FaE83"
      values.pendingOwner:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      implementationNames.0xe63602a9B3DFE983187525AC985Fec4F57B24eD5:
-        "ExchangeV3"
      implementationNames.eth:0xe63602a9B3DFE983187525AC985Fec4F57B24eD5:
+        "ExchangeV3"
    }
```

```diff
    EOA  (0xE9A37E8DDDbf4Bb3f5d6aCE6D01a137e484Db77C) {
    +++ description: None
      address:
-        "0xE9A37E8DDDbf4Bb3f5d6aCE6D01a137e484Db77C"
+        "eth:0xE9A37E8DDDbf4Bb3f5d6aCE6D01a137e484Db77C"
    }
```

```diff
    EOA  (0xeD530f3b8675B0a576DaAe64C004676c65368DfD) {
    +++ description: None
      address:
-        "0xeD530f3b8675B0a576DaAe64C004676c65368DfD"
+        "eth:0xeD530f3b8675B0a576DaAe64C004676c65368DfD"
    }
```

```diff
    EOA  (0xf5020ADf433645c451A4809eac0d6F680709f11B) {
    +++ description: None
      address:
-        "0xf5020ADf433645c451A4809eac0d6F680709f11B"
+        "eth:0xf5020ADf433645c451A4809eac0d6F680709f11B"
    }
```

```diff
+   Status: CREATED
    contract BlockVerifier (0x1c602313cDDC68C5789aCb7df0C92a93B0E04C9e)
    +++ description: None
```

```diff
+   Status: CREATED
    contract LoopringOwner (0x2028834B2c0A36A918c10937EeA71BE4f932da52)
    +++ description: None
```

```diff
+   Status: CREATED
    contract LoopringV3 (0x4d707cae77c5E82a00BF9572A55d3ef3a4e0c458)
    +++ description: None
```

```diff
+   Status: CREATED
    contract LoopringIOExchangeOwner (0x6B937A5920726e70c5bF1d4d4E18EEeEd46FaE83)
    +++ description: None
```

```diff
+   Status: CREATED
    contract FeeVault (0x7B0d44D5b2eF3A8B168FAfdcc321FAb0D9d5d08C)
    +++ description: None
```

```diff
+   Status: CREATED
    contract DefaultDepositContract (0x814d0c1903D69EB1c7ceB8F5190B20A06892d1dA)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ExchangeV3 (0xe63602a9B3DFE983187525AC985Fec4F57B24eD5)
    +++ description: None
```

Generated with discovered.json: 0xccb5720a1fa46967c30bc4f6514626e1e27317df

# Diff at Tue, 04 Mar 2025 10:39:04 GMT:

- chain: ethereum
- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@98d260b45fe0d2195ce5e629bd7b200c8706e8ba block: 18939731
- current block number: 18939731

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 18939731 (main branch discovery), not current.

```diff
    contract BlockVerifier (0x1c602313cDDC68C5789aCb7df0C92a93B0E04C9e) {
    +++ description: None
      sinceBlock:
+        17087068
    }
```

```diff
    contract LoopringOwner (0x2028834B2c0A36A918c10937EeA71BE4f932da52) {
    +++ description: None
      sinceBlock:
+        17285500
    }
```

```diff
    contract LoopringV3 (0x4d707cae77c5E82a00BF9572A55d3ef3a4e0c458) {
    +++ description: None
      sinceBlock:
+        17087402
    }
```

```diff
    contract LoopringIOExchangeOwner (0x6B937A5920726e70c5bF1d4d4E18EEeEd46FaE83) {
    +++ description: None
      sinceBlock:
+        17087703
    }
```

```diff
    contract FeeVault (0x7B0d44D5b2eF3A8B168FAfdcc321FAb0D9d5d08C) {
    +++ description: None
      sinceBlock:
+        11970338
    }
```

```diff
    contract DefaultDepositContract (0x814d0c1903D69EB1c7ceB8F5190B20A06892d1dA) {
    +++ description: None
      sinceBlock:
+        17087506
    }
```

```diff
    contract ExchangeV3 (0xe63602a9B3DFE983187525AC985Fec4F57B24eD5) {
    +++ description: None
      sinceBlock:
+        17087504
    }
```

Generated with discovered.json: 0x7e050309eefd3e9124895780b5c4943edf67521b

# Diff at Mon, 27 Jan 2025 08:44:31 GMT:

- chain: ethereum
- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@19f9c78c593bd40f9a0b28c3dce98eac1bd1d1b8 block: 18939731
- current block number: 18939731

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 18939731 (main branch discovery), not current.

```diff
    contract ExchangeV3 (0xe63602a9B3DFE983187525AC985Fec4F57B24eD5) {
    +++ description: None
      values.shutdownTriggered.0:
-        {"timestamp":1695894359}
+        1695894359
    }
```

Generated with discovered.json: 0x2408f7136c1141fb31b03f60eb1aa62ab7f12e2d

# Diff at Mon, 14 Oct 2024 10:50:25 GMT:

- chain: ethereum
- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@1afc77ff111ceb0970e7d09efcc7b2f376b0c281 block: 18939731
- current block number: 18939731

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 18939731 (main branch discovery), not current.

```diff
    contract BlockVerifier (0x1c602313cDDC68C5789aCb7df0C92a93B0E04C9e) {
    +++ description: None
      sourceHashes:
+        ["0x034de7052cf5e10120ac3d5f4432bd52f50acc4c6d7d51d04aeaeffb45f9b87d"]
    }
```

```diff
    contract LoopringOwner (0x2028834B2c0A36A918c10937EeA71BE4f932da52) {
    +++ description: None
      sourceHashes:
+        ["0xf716f94059215d0e4c8d8edf41e5a65e741bce5005c2afee04eaafcf5c210d20"]
    }
```

```diff
    contract LoopringV3 (0x4d707cae77c5E82a00BF9572A55d3ef3a4e0c458) {
    +++ description: None
      sourceHashes:
+        ["0x1a927b8a2febc8b60253ee7277d887fe95ec3e23241d77d0ec9e6f424239438e"]
    }
```

```diff
    contract LoopringIOExchangeOwner (0x6B937A5920726e70c5bF1d4d4E18EEeEd46FaE83) {
    +++ description: None
      sourceHashes:
+        ["0x80a64d522f935661e6a91ce240c8fab04db5aa499462cca019fcda5e0494b18e"]
    }
```

```diff
    contract FeeVault (0x7B0d44D5b2eF3A8B168FAfdcc321FAb0D9d5d08C) {
    +++ description: None
      sourceHashes:
+        ["0xf716f94059215d0e4c8d8edf41e5a65e741bce5005c2afee04eaafcf5c210d20"]
    }
```

```diff
    contract DefaultDepositContract (0x814d0c1903D69EB1c7ceB8F5190B20A06892d1dA) {
    +++ description: None
      sourceHashes:
+        ["0x84fb4e2bbd657c64908e8875c1bbe3610271899626eaf9cf56d6b69400a607b3"]
    }
```

```diff
    contract ExchangeV3 (0xe63602a9B3DFE983187525AC985Fec4F57B24eD5) {
    +++ description: None
      sourceHashes:
+        ["0xfe68945beed1d671d49de42310f9808862fb79dd5fe0a529fe1a43b93aab8f03"]
    }
```

Generated with discovered.json: 0x777f2dc2d00506c0555671f0cb0a06901df89564

# Diff at Wed, 03 Jan 2024 12:15:23 GMT:

- chain: ethereum
- author: Luca Donno (<donnoh99@gmail.com>)
- comparing to: main@9cd2eb99d34f64eadf915ab21cf5e0819367bbc1

## Description

Ignored following method.

## Watched changes

```diff
    contract LoopringOwner (0x2028834B2c0A36A918c10937EeA71BE4f932da52) {
      values.transactionCount:
-        5
+        8
    }
```

# Diff at Mon, 02 Oct 2023 13:27:28 GMT:

- chain: ethereum
- author: Luca Donno (<donnoh99@gmail.com>)
- comparing to: main@10dbc30af490bd7af5cfca51b827ce3f10182f4d

## Watched changes

```diff
    contract LoopringOwner (0x2028834B2c0A36A918c10937EeA71BE4f932da52) {
      values.transactionCount:
-        4
+        5
    }
```

```diff
    contract ExchangeV3 (0xe63602a9B3DFE983187525AC985Fec4F57B24eD5) {
      values.isShutdown:
-        false
+        true
      values.shutdownTriggered[0]:
+        {"timestamp":1695894359}
    }
```

# Diff at Tue, 26 Sep 2023 12:45:30 GMT:

- chain: ethereum
- author: Luca Donno (<donnoh99@gmail.com>)
- comparing to: main@cfd4e281f2af40c7c69302b16c1308c0c5651be0

## Watched changes

```diff
    contract ExchangeV3 (0xe63602a9B3DFE983187525AC985Fec4F57B24eD5) {
      values.shutdownTriggered:
+        []
    }
```

