Generated with discovered.json: 0x3c1fefc171fabd816a3f8627ab2dd7e6b9b2c9c7

# Diff at Mon, 14 Jul 2025 12:44:58 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@9f4300dad2f3d080cd56fa311d4a848556c74e72 block: 18554408
- current block number: 18554408

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 18554408 (main branch discovery), not current.

```diff
    contract LoopringIOExchangeOwner (0x2CFd271e9b4d0344Fd2Aa0cb1ffd4f6b85c0B215) {
    +++ description: None
      address:
-        "0x2CFd271e9b4d0344Fd2Aa0cb1ffd4f6b85c0B215"
+        "eth:0x2CFd271e9b4d0344Fd2Aa0cb1ffd4f6b85c0B215"
      values.blockSubmitters.0:
-        "0x4e3FE240B50A445fc6137a6363aC3593Af173b8a"
+        "eth:0x4e3FE240B50A445fc6137a6363aC3593Af173b8a"
      values.owner:
-        "0xacD3A62F3eED1BfE4fF0eC8240d645c1F5477F82"
+        "eth:0xacD3A62F3eED1BfE4fF0eC8240d645c1F5477F82"
      values.pendingOwner:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      values.target:
-        "0x9C8f884B15a1fcd5B4bcEb8647DC2D15165906c7"
+        "eth:0x9C8f884B15a1fcd5B4bcEb8647DC2D15165906c7"
      implementationNames.0x2CFd271e9b4d0344Fd2Aa0cb1ffd4f6b85c0B215:
-        "LoopringIOExchangeOwner"
      implementationNames.eth:0x2CFd271e9b4d0344Fd2Aa0cb1ffd4f6b85c0B215:
+        "LoopringIOExchangeOwner"
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
    EOA  (0x4e3FE240B50A445fc6137a6363aC3593Af173b8a) {
    +++ description: None
      address:
-        "0x4e3FE240B50A445fc6137a6363aC3593Af173b8a"
+        "eth:0x4e3FE240B50A445fc6137a6363aC3593Af173b8a"
    }
```

```diff
    contract LoopringV3 (0x5F412bf72ceE6ceB3e9f8b0F966429b59255a9B7) {
    +++ description: None
      address:
-        "0x5F412bf72ceE6ceB3e9f8b0F966429b59255a9B7"
+        "eth:0x5F412bf72ceE6ceB3e9f8b0F966429b59255a9B7"
      values.blockVerifierAddress:
-        "0x707B12e8921b442D4015eb03c86E66F3b8042Dd2"
+        "eth:0x707B12e8921b442D4015eb03c86E66F3b8042Dd2"
      values.lrcAddress:
-        "0x53C8395465A84955c95159814461466053DedEDE"
+        "eth:0x53C8395465A84955c95159814461466053DedEDE"
      values.owner:
-        "0xacD3A62F3eED1BfE4fF0eC8240d645c1F5477F82"
+        "eth:0xacD3A62F3eED1BfE4fF0eC8240d645c1F5477F82"
      values.pendingOwner:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      values.protocolFeeVault:
-        "0x7B0d44D5b2eF3A8B168FAfdcc321FAb0D9d5d08C"
+        "eth:0x7B0d44D5b2eF3A8B168FAfdcc321FAb0D9d5d08C"
      implementationNames.0x5F412bf72ceE6ceB3e9f8b0F966429b59255a9B7:
-        "LoopringV3"
      implementationNames.eth:0x5F412bf72ceE6ceB3e9f8b0F966429b59255a9B7:
+        "LoopringV3"
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
    contract BlockVerifier (0x707B12e8921b442D4015eb03c86E66F3b8042Dd2) {
    +++ description: None
      address:
-        "0x707B12e8921b442D4015eb03c86E66F3b8042Dd2"
+        "eth:0x707B12e8921b442D4015eb03c86E66F3b8042Dd2"
      values.owner:
-        "0xacD3A62F3eED1BfE4fF0eC8240d645c1F5477F82"
+        "eth:0xacD3A62F3eED1BfE4fF0eC8240d645c1F5477F82"
      values.pendingOwner:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      implementationNames.0x707B12e8921b442D4015eb03c86E66F3b8042Dd2:
-        "BlockVerifier"
      implementationNames.eth:0x707B12e8921b442D4015eb03c86E66F3b8042Dd2:
+        "BlockVerifier"
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
    contract ExchangeV3 (0x9C8f884B15a1fcd5B4bcEb8647DC2D15165906c7) {
    +++ description: None
      address:
-        "0x9C8f884B15a1fcd5B4bcEb8647DC2D15165906c7"
+        "eth:0x9C8f884B15a1fcd5B4bcEb8647DC2D15165906c7"
      values.getDepositContract:
-        "0xF13e21653AEB763595D5E4baA1dC115689Da49b9"
+        "eth:0xF13e21653AEB763595D5E4baA1dC115689Da49b9"
      values.loopringV3:
-        "0x5F412bf72ceE6ceB3e9f8b0F966429b59255a9B7"
+        "eth:0x5F412bf72ceE6ceB3e9f8b0F966429b59255a9B7"
      values.owner:
-        "0x2CFd271e9b4d0344Fd2Aa0cb1ffd4f6b85c0B215"
+        "eth:0x2CFd271e9b4d0344Fd2Aa0cb1ffd4f6b85c0B215"
      values.pendingOwner:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      implementationNames.0x9C8f884B15a1fcd5B4bcEb8647DC2D15165906c7:
-        "ExchangeV3"
      implementationNames.eth:0x9C8f884B15a1fcd5B4bcEb8647DC2D15165906c7:
+        "ExchangeV3"
    }
```

```diff
    EOA LoopringOwner (0xacD3A62F3eED1BfE4fF0eC8240d645c1F5477F82) {
    +++ description: None
      address:
-        "0xacD3A62F3eED1BfE4fF0eC8240d645c1F5477F82"
+        "eth:0xacD3A62F3eED1BfE4fF0eC8240d645c1F5477F82"
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
    EOA  (0xeD530f3b8675B0a576DaAe64C004676c65368DfD) {
    +++ description: None
      address:
-        "0xeD530f3b8675B0a576DaAe64C004676c65368DfD"
+        "eth:0xeD530f3b8675B0a576DaAe64C004676c65368DfD"
    }
```

```diff
    contract DefaultDepositContract (0xF13e21653AEB763595D5E4baA1dC115689Da49b9) {
    +++ description: None
      address:
-        "0xF13e21653AEB763595D5E4baA1dC115689Da49b9"
+        "eth:0xF13e21653AEB763595D5E4baA1dC115689Da49b9"
      values.exchange:
-        "0x9C8f884B15a1fcd5B4bcEb8647DC2D15165906c7"
+        "eth:0x9C8f884B15a1fcd5B4bcEb8647DC2D15165906c7"
      values.owner:
-        "0xacD3A62F3eED1BfE4fF0eC8240d645c1F5477F82"
+        "eth:0xacD3A62F3eED1BfE4fF0eC8240d645c1F5477F82"
      values.pendingOwner:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      implementationNames.0xF13e21653AEB763595D5E4baA1dC115689Da49b9:
-        "DefaultDepositContract"
      implementationNames.eth:0xF13e21653AEB763595D5E4baA1dC115689Da49b9:
+        "DefaultDepositContract"
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
    contract LoopringIOExchangeOwner (0x2CFd271e9b4d0344Fd2Aa0cb1ffd4f6b85c0B215)
    +++ description: None
```

```diff
+   Status: CREATED
    contract LoopringV3 (0x5F412bf72ceE6ceB3e9f8b0F966429b59255a9B7)
    +++ description: None
```

```diff
+   Status: CREATED
    contract BlockVerifier (0x707B12e8921b442D4015eb03c86E66F3b8042Dd2)
    +++ description: None
```

```diff
+   Status: CREATED
    contract FeeVault (0x7B0d44D5b2eF3A8B168FAfdcc321FAb0D9d5d08C)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ExchangeV3 (0x9C8f884B15a1fcd5B4bcEb8647DC2D15165906c7)
    +++ description: None
```

```diff
+   Status: CREATED
    contract DefaultDepositContract (0xF13e21653AEB763595D5E4baA1dC115689Da49b9)
    +++ description: None
```

Generated with discovered.json: 0x0d7fa02d8f9050bf31b0b0b151322d00cf88abfd

# Diff at Tue, 04 Mar 2025 10:39:04 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@98d260b45fe0d2195ce5e629bd7b200c8706e8ba block: 18554408
- current block number: 18554408

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 18554408 (main branch discovery), not current.

```diff
    contract LoopringIOExchangeOwner (0x2CFd271e9b4d0344Fd2Aa0cb1ffd4f6b85c0B215) {
    +++ description: None
      sinceBlock:
+        18019675
    }
```

```diff
    contract LoopringV3 (0x5F412bf72ceE6ceB3e9f8b0F966429b59255a9B7) {
    +++ description: None
      sinceBlock:
+        18019664
    }
```

```diff
    contract BlockVerifier (0x707B12e8921b442D4015eb03c86E66F3b8042Dd2) {
    +++ description: None
      sinceBlock:
+        18019663
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
    contract ExchangeV3 (0x9C8f884B15a1fcd5B4bcEb8647DC2D15165906c7) {
    +++ description: None
      sinceBlock:
+        18019673
    }
```

```diff
    contract DefaultDepositContract (0xF13e21653AEB763595D5E4baA1dC115689Da49b9) {
    +++ description: None
      sinceBlock:
+        18019674
    }
```

Generated with discovered.json: 0x102d1ceb7e2c5cb18e6120c3233fae641ce55fef

# Diff at Mon, 27 Jan 2025 08:44:31 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@19f9c78c593bd40f9a0b28c3dce98eac1bd1d1b8 block: 18554408
- current block number: 18554408

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 18554408 (main branch discovery), not current.

```diff
    contract ExchangeV3 (0x9C8f884B15a1fcd5B4bcEb8647DC2D15165906c7) {
    +++ description: None
      values.shutdownTriggered.0:
-        {"timestamp":1699762379}
+        1699762379
    }
```

Generated with discovered.json: 0xcdcd7d66b07e762d1ee06d6da5c6445e7a61572c

# Diff at Mon, 14 Oct 2024 10:50:27 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@1afc77ff111ceb0970e7d09efcc7b2f376b0c281 block: 18554408
- current block number: 18554408

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 18554408 (main branch discovery), not current.

```diff
    contract LoopringIOExchangeOwner (0x2CFd271e9b4d0344Fd2Aa0cb1ffd4f6b85c0B215) {
    +++ description: None
      sourceHashes:
+        ["0x80a64d522f935661e6a91ce240c8fab04db5aa499462cca019fcda5e0494b18e"]
    }
```

```diff
    contract LoopringV3 (0x5F412bf72ceE6ceB3e9f8b0F966429b59255a9B7) {
    +++ description: None
      sourceHashes:
+        ["0x1a927b8a2febc8b60253ee7277d887fe95ec3e23241d77d0ec9e6f424239438e"]
    }
```

```diff
    contract BlockVerifier (0x707B12e8921b442D4015eb03c86E66F3b8042Dd2) {
    +++ description: None
      sourceHashes:
+        ["0x1154ee2a46fb0e5586723354429b36343227a2e36a12e518d7e985031b67695d"]
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
    contract ExchangeV3 (0x9C8f884B15a1fcd5B4bcEb8647DC2D15165906c7) {
    +++ description: None
      sourceHashes:
+        ["0x0eb913bdd3a56c7e954cf0d749fde579620dce50157f8736c1938de91acd7127"]
    }
```

```diff
    contract DefaultDepositContract (0xF13e21653AEB763595D5E4baA1dC115689Da49b9) {
    +++ description: None
      sourceHashes:
+        ["0x84fb4e2bbd657c64908e8875c1bbe3610271899626eaf9cf56d6b69400a607b3"]
    }
```

Generated with discovered.json: 0x572021f43fac6894e214cd891260a706e028527f

# Diff at Sun, 12 Nov 2023 07:41:47 GMT:

- author: Radina Talanova (<nt.radina@gmail.com>)
- comparing to: main@eae2f7f70e414ebfe1217a66fea18a1d5483fb5e

## Description

DeGate (v1) is going through a redeployment, and for this reason the main ExchangeV3 contract is switched to shutdown mode.

## Watched changes

```diff
    contract ExchangeV3 (0x9C8f884B15a1fcd5B4bcEb8647DC2D15165906c7) {
      values.isShutdown:
-        false
+        true
      values.shutdownTriggered[0]:
+        {"timestamp":1699762379}
    }
```

# Diff at Tue, 26 Sep 2023 12:46:23 GMT:

- author: Luca Donno (<donnoh99@gmail.com>)
- comparing to: main@cfd4e281f2af40c7c69302b16c1308c0c5651be0

## Watched changes

```diff
    contract ExchangeV3 (0x9C8f884B15a1fcd5B4bcEb8647DC2D15165906c7) {
      values.shutdownTriggered:
+        []
    }
```
