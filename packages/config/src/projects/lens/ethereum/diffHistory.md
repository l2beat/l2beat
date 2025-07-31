Generated with discovered.json: 0x65d52fbd504add58b52a7d05fadf595c6fe44504

# Diff at Mon, 14 Jul 2025 12:47:16 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@9f4300dad2f3d080cd56fa311d4a848556c74e72 block: 22865631
- current block number: 22865631

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22865631 (main branch discovery), not current.

```diff
    EOA  (0x2a80091816D7872850D500F6Ade835354238Af17) {
    +++ description: None
      address:
-        "0x2a80091816D7872850D500F6Ade835354238Af17"
+        "eth:0x2a80091816D7872850D500F6Ade835354238Af17"
    }
```

```diff
    EOA  (0x2eD1df8F475b1f9c7493fC0eb0BFD4D1FD17f27b) {
    +++ description: None
      address:
-        "0x2eD1df8F475b1f9c7493fC0eb0BFD4D1FD17f27b"
+        "eth:0x2eD1df8F475b1f9c7493fC0eb0BFD4D1FD17f27b"
    }
```

```diff
    EOA  (0x3eA4D1684C65756E892b0B8d3e331E10D9d3a484) {
    +++ description: None
      address:
-        "0x3eA4D1684C65756E892b0B8d3e331E10D9d3a484"
+        "eth:0x3eA4D1684C65756E892b0B8d3e331E10D9d3a484"
    }
```

```diff
    EOA  (0x477c1B7DC1091389CBD3Eef21Efb00081606Ab67) {
    +++ description: None
      address:
-        "0x477c1B7DC1091389CBD3Eef21Efb00081606Ab67"
+        "eth:0x477c1B7DC1091389CBD3Eef21Efb00081606Ab67"
    }
```

```diff
    contract Lens Multisig (0x4968A0E4b025eD7d095753E54058377969b41abC) {
    +++ description: None
      address:
-        "0x4968A0E4b025eD7d095753E54058377969b41abC"
+        "eth:0x4968A0E4b025eD7d095753E54058377969b41abC"
      values.$implementation:
-        "0x41675C099F32341bf84BFc5382aF534df5C7461a"
+        "eth:0x41675C099F32341bf84BFc5382aF534df5C7461a"
      values.$members.0:
-        "0x71910321A1d3b3f743ca52569f5Aa82f09538A2e"
+        "eth:0x71910321A1d3b3f743ca52569f5Aa82f09538A2e"
      values.$members.1:
-        "0xfbDF62F0a73DED0BF5A264867cFD022E192B5526"
+        "eth:0xfbDF62F0a73DED0BF5A264867cFD022E192B5526"
      values.$members.2:
-        "0x5dc301EcD8Bd7694BB1074B3E58Aa0916EE7887d"
+        "eth:0x5dc301EcD8Bd7694BB1074B3E58Aa0916EE7887d"
      values.$members.3:
-        "0x62Ae8d9B6d0D9817bd9D41b9AfEAc301dBa713B8"
+        "eth:0x62Ae8d9B6d0D9817bd9D41b9AfEAc301dBa713B8"
      values.$members.4:
-        "0x2eD1df8F475b1f9c7493fC0eb0BFD4D1FD17f27b"
+        "eth:0x2eD1df8F475b1f9c7493fC0eb0BFD4D1FD17f27b"
      values.$members.5:
-        "0x2a80091816D7872850D500F6Ade835354238Af17"
+        "eth:0x2a80091816D7872850D500F6Ade835354238Af17"
      values.$members.6:
-        "0x5063b3D23C3640d51c9E2aef41063B1d482C70ff"
+        "eth:0x5063b3D23C3640d51c9E2aef41063B1d482C70ff"
      values.$members.7:
-        "0xE0b3Ef5A61324acceE3798B6D9Da5B47b0312b7c"
+        "eth:0xE0b3Ef5A61324acceE3798B6D9Da5B47b0312b7c"
      implementationNames.0x4968A0E4b025eD7d095753E54058377969b41abC:
-        "SafeProxy"
      implementationNames.0x41675C099F32341bf84BFc5382aF534df5C7461a:
-        "Safe"
      implementationNames.eth:0x4968A0E4b025eD7d095753E54058377969b41abC:
+        "SafeProxy"
      implementationNames.eth:0x41675C099F32341bf84BFc5382aF534df5C7461a:
+        "Safe"
    }
```

```diff
    EOA  (0x5063b3D23C3640d51c9E2aef41063B1d482C70ff) {
    +++ description: None
      address:
-        "0x5063b3D23C3640d51c9E2aef41063B1d482C70ff"
+        "eth:0x5063b3D23C3640d51c9E2aef41063B1d482C70ff"
    }
```

```diff
    contract DualVerifier (0x53F5DE9De3B2DA90633a2c74BEb3b9912cdd1579) {
    +++ description: A router contract for verifiers. Routes verification requests to eth:0xD5dBE903F5382B052317D326FA1a7B63710C6a5b or eth:0x5BAfEF6729228add8775aF4Cecd2E68a51424Ee1 depending on the supplied proof type.
      address:
-        "0x53F5DE9De3B2DA90633a2c74BEb3b9912cdd1579"
+        "eth:0x53F5DE9De3B2DA90633a2c74BEb3b9912cdd1579"
      description:
-        "A router contract for verifiers. Routes verification requests to 0xD5dBE903F5382B052317D326FA1a7B63710C6a5b or 0x5BAfEF6729228add8775aF4Cecd2E68a51424Ee1 depending on the supplied proof type."
+        "A router contract for verifiers. Routes verification requests to eth:0xD5dBE903F5382B052317D326FA1a7B63710C6a5b or eth:0x5BAfEF6729228add8775aF4Cecd2E68a51424Ee1 depending on the supplied proof type."
      values.FFLONK_VERIFIER:
-        "0xD5dBE903F5382B052317D326FA1a7B63710C6a5b"
+        "eth:0xD5dBE903F5382B052317D326FA1a7B63710C6a5b"
      values.PLONK_VERIFIER:
-        "0x5BAfEF6729228add8775aF4Cecd2E68a51424Ee1"
+        "eth:0x5BAfEF6729228add8775aF4Cecd2E68a51424Ee1"
      implementationNames.0x53F5DE9De3B2DA90633a2c74BEb3b9912cdd1579:
-        "DualVerifier"
      implementationNames.eth:0x53F5DE9De3B2DA90633a2c74BEb3b9912cdd1579:
+        "DualVerifier"
    }
```

```diff
    contract L1VerifierPlonk (0x5BAfEF6729228add8775aF4Cecd2E68a51424Ee1) {
    +++ description: Verifies a zk-SNARK proof using an implementation of the PlonK proof system.
      address:
-        "0x5BAfEF6729228add8775aF4Cecd2E68a51424Ee1"
+        "eth:0x5BAfEF6729228add8775aF4Cecd2E68a51424Ee1"
      implementationNames.0x5BAfEF6729228add8775aF4Cecd2E68a51424Ee1:
-        "L1VerifierPlonk"
      implementationNames.eth:0x5BAfEF6729228add8775aF4Cecd2E68a51424Ee1:
+        "L1VerifierPlonk"
    }
```

```diff
    contract ValidatorTimelock3 (0x5C03468829A26981c410a7930bD4853622F0B2E5) {
    +++ description: Intermediary contract between the *Validators* and the central diamond contract that delays block execution (ie withdrawals and other L2 --> L1 messages) by 0s.
      address:
-        "0x5C03468829A26981c410a7930bD4853622F0B2E5"
+        "eth:0x5C03468829A26981c410a7930bD4853622F0B2E5"
      values.owner:
-        "0xE30Dca3047B37dc7d88849dE4A4Dc07937ad5Ab3"
+        "eth:0xE30Dca3047B37dc7d88849dE4A4Dc07937ad5Ab3"
      values.pendingOwner:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      values.stateTransitionManager:
-        "0x590E6587B37DC4152B6b036ff88A835BD2Ab8924"
+        "eth:0x590E6587B37DC4152B6b036ff88A835BD2Ab8924"
      values.validatorsVTL.0:
-        "0xAaF7b278baC078AA4f9bdc8E0a93CDe604aA67d9"
+        "eth:0xAaF7b278baC078AA4f9bdc8E0a93CDe604aA67d9"
      values.validatorsVTL.1:
-        "0xb1a0c1F1B50436AC94B8Ce9Ae919B0e820aCb374"
+        "eth:0xb1a0c1F1B50436AC94B8Ce9Ae919B0e820aCb374"
      implementationNames.0x5C03468829A26981c410a7930bD4853622F0B2E5:
-        "ValidatorTimelock"
      implementationNames.eth:0x5C03468829A26981c410a7930bD4853622F0B2E5:
+        "ValidatorTimelock"
    }
```

```diff
    contract ValidatorTimelock2 (0x5D8ba173Dc6C3c90C8f7C04C9288BeF5FDbAd06E) {
    +++ description: Intermediary contract between the *Validators* and the central diamond contract that delays block execution (ie withdrawals and other L2 --> L1 messages) by 3h.
      address:
-        "0x5D8ba173Dc6C3c90C8f7C04C9288BeF5FDbAd06E"
+        "eth:0x5D8ba173Dc6C3c90C8f7C04C9288BeF5FDbAd06E"
      values.owner:
-        "0xE30Dca3047B37dc7d88849dE4A4Dc07937ad5Ab3"
+        "eth:0xE30Dca3047B37dc7d88849dE4A4Dc07937ad5Ab3"
      values.pendingOwner:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      values.stateTransitionManager:
-        "0xc2eE6b6af7d616f6e27ce7F4A451Aedc2b0F5f5C"
+        "eth:0xc2eE6b6af7d616f6e27ce7F4A451Aedc2b0F5f5C"
      values.validatorsVTL.0:
-        "0xb1a0c1F1B50436AC94B8Ce9Ae919B0e820aCb374"
+        "eth:0xb1a0c1F1B50436AC94B8Ce9Ae919B0e820aCb374"
      values.validatorsVTL.1:
-        "0xAaF7b278baC078AA4f9bdc8E0a93CDe604aA67d9"
+        "eth:0xAaF7b278baC078AA4f9bdc8E0a93CDe604aA67d9"
      implementationNames.0x5D8ba173Dc6C3c90C8f7C04C9288BeF5FDbAd06E:
-        "ValidatorTimelock"
      implementationNames.eth:0x5D8ba173Dc6C3c90C8f7C04C9288BeF5FDbAd06E:
+        "ValidatorTimelock"
    }
```

```diff
    EOA  (0x5dc301EcD8Bd7694BB1074B3E58Aa0916EE7887d) {
    +++ description: None
      address:
-        "0x5dc301EcD8Bd7694BB1074B3E58Aa0916EE7887d"
+        "eth:0x5dc301EcD8Bd7694BB1074B3E58Aa0916EE7887d"
    }
```

```diff
    EOA  (0x62Ae8d9B6d0D9817bd9D41b9AfEAc301dBa713B8) {
    +++ description: None
      address:
-        "0x62Ae8d9B6d0D9817bd9D41b9AfEAc301dBa713B8"
+        "eth:0x62Ae8d9B6d0D9817bd9D41b9AfEAc301dBa713B8"
    }
```

```diff
    contract LensZkEvmAdmin (0x6bd8d33551077Ed281Cb047835a2aE4033eEc433) {
    +++ description: None
      address:
-        "0x6bd8d33551077Ed281Cb047835a2aE4033eEc433"
+        "eth:0x6bd8d33551077Ed281Cb047835a2aE4033eEc433"
      values.owner:
-        "0x4968A0E4b025eD7d095753E54058377969b41abC"
+        "eth:0x4968A0E4b025eD7d095753E54058377969b41abC"
      values.pendingOwner:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      values.tokenMultiplierSetter:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      implementationNames.0x6bd8d33551077Ed281Cb047835a2aE4033eEc433:
-        "ChainAdmin"
      implementationNames.eth:0x6bd8d33551077Ed281Cb047835a2aE4033eEc433:
+        "ChainAdmin"
    }
```

```diff
    EOA  (0x71910321A1d3b3f743ca52569f5Aa82f09538A2e) {
    +++ description: None
      address:
-        "0x71910321A1d3b3f743ca52569f5Aa82f09538A2e"
+        "eth:0x71910321A1d3b3f743ca52569f5Aa82f09538A2e"
    }
```

```diff
    contract ValidatorTimelock (0x8c0Bfc04AdA21fd496c55B8C50331f904306F564) {
    +++ description: Intermediary contract between the *Validators* and the central diamond contract that delays block execution (ie withdrawals and other L2 --> L1 messages) by 3h.
      address:
-        "0x8c0Bfc04AdA21fd496c55B8C50331f904306F564"
+        "eth:0x8c0Bfc04AdA21fd496c55B8C50331f904306F564"
      values.chainTypeManager:
-        "0xc2eE6b6af7d616f6e27ce7F4A451Aedc2b0F5f5C"
+        "eth:0xc2eE6b6af7d616f6e27ce7F4A451Aedc2b0F5f5C"
      values.owner:
-        "0xE30Dca3047B37dc7d88849dE4A4Dc07937ad5Ab3"
+        "eth:0xE30Dca3047B37dc7d88849dE4A4Dc07937ad5Ab3"
      values.pendingOwner:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      values.validatorsVTL.0:
-        "0x477c1B7DC1091389CBD3Eef21Efb00081606Ab67"
+        "eth:0x477c1B7DC1091389CBD3Eef21Efb00081606Ab67"
      values.validatorsVTL.1:
-        "0x3eA4D1684C65756E892b0B8d3e331E10D9d3a484"
+        "eth:0x3eA4D1684C65756E892b0B8d3e331E10D9d3a484"
      implementationNames.0x8c0Bfc04AdA21fd496c55B8C50331f904306F564:
-        "ValidatorTimelock"
      implementationNames.eth:0x8c0Bfc04AdA21fd496c55B8C50331f904306F564:
+        "ValidatorTimelock"
    }
```

```diff
    contract AvailL1DAValidator (0x8f50d93B9955B285f787043B30B5F51D09bE0120) {
    +++ description: Contract that verifies that the validiums data was made available on Avail by querying the eth:0x054fd961708D8E2B9c10a63F6157c74458889F0a on Ethereum for a merkle proof of inclusion.
      address:
-        "0x8f50d93B9955B285f787043B30B5F51D09bE0120"
+        "eth:0x8f50d93B9955B285f787043B30B5F51D09bE0120"
      description:
-        "Contract that verifies that the validiums data was made available on Avail by querying the 0x054fd961708D8E2B9c10a63F6157c74458889F0a on Ethereum for a merkle proof of inclusion."
+        "Contract that verifies that the validiums data was made available on Avail by querying the eth:0x054fd961708D8E2B9c10a63F6157c74458889F0a on Ethereum for a merkle proof of inclusion."
      values.bridge:
-        "0x054fd961708D8E2B9c10a63F6157c74458889F0a"
+        "eth:0x054fd961708D8E2B9c10a63F6157c74458889F0a"
      values.vectorx:
-        "0x02993cdC11213985b9B13224f3aF289F03bf298d"
+        "eth:0x02993cdC11213985b9B13224f3aF289F03bf298d"
      implementationNames.0x8f50d93B9955B285f787043B30B5F51D09bE0120:
-        "AvailL1DAValidator"
      implementationNames.eth:0x8f50d93B9955B285f787043B30B5F51D09bE0120:
+        "AvailL1DAValidator"
    }
```

```diff
    EOA  (0xAaF7b278baC078AA4f9bdc8E0a93CDe604aA67d9) {
    +++ description: None
      address:
-        "0xAaF7b278baC078AA4f9bdc8E0a93CDe604aA67d9"
+        "eth:0xAaF7b278baC078AA4f9bdc8E0a93CDe604aA67d9"
    }
```

```diff
    EOA  (0xb1a0c1F1B50436AC94B8Ce9Ae919B0e820aCb374) {
    +++ description: None
      address:
-        "0xb1a0c1F1B50436AC94B8Ce9Ae919B0e820aCb374"
+        "eth:0xb1a0c1F1B50436AC94B8Ce9Ae919B0e820aCb374"
    }
```

```diff
    contract LensZkEvm (0xc29d04A93F893700015138E3E334eB828dAC3cef) {
    +++ description: The main contract defining the Layer 2. Operator actions like commiting blocks, providing ZK proofs and executing batches ultimately target this contract which then processes transactions. During batch execution it processes L1 --> L2 and L2 --> L1 transactions.
      address:
-        "0xc29d04A93F893700015138E3E334eB828dAC3cef"
+        "eth:0xc29d04A93F893700015138E3E334eB828dAC3cef"
      values.$implementation.0:
-        "0x431449e2a28A69122860A4956A3f7191eE15aFBC"
+        "eth:0x431449e2a28A69122860A4956A3f7191eE15aFBC"
      values.$implementation.1:
-        "0xae5cbB5f70e134668a13d7C8EcEF5e9E6FffCF22"
+        "eth:0xae5cbB5f70e134668a13d7C8EcEF5e9E6FffCF22"
      values.$implementation.2:
-        "0x365D0ae3ECA13004daf2A4ba1501c01AaEbb4fec"
+        "eth:0x365D0ae3ECA13004daf2A4ba1501c01AaEbb4fec"
      values.$implementation.3:
-        "0x2f116b9033d88Bb3Cf64C371AE5458fbA22BA39A"
+        "eth:0x2f116b9033d88Bb3Cf64C371AE5458fbA22BA39A"
      values.$pastUpgrades.0.2.0:
-        "0x0665d51e2342F5D5EAEaAaA175C6fdEEf122c542"
+        "eth:0x0665d51e2342F5D5EAEaAaA175C6fdEEf122c542"
      values.$pastUpgrades.0.2.1:
-        "0xff6fb8160DC28260d4027C80eAd7e1eD147c963F"
+        "eth:0xff6fb8160DC28260d4027C80eAd7e1eD147c963F"
      values.$pastUpgrades.0.2.2:
-        "0xbE8988304816cbbd36624567AFe1A223DBF58c82"
+        "eth:0xbE8988304816cbbd36624567AFe1A223DBF58c82"
      values.$pastUpgrades.0.2.3:
-        "0x8480803516B7390Ff9C57eC4dD233B634FB493B8"
+        "eth:0x8480803516B7390Ff9C57eC4dD233B634FB493B8"
      values.$pastUpgrades.1.2.0:
-        "0x0665d51e2342F5D5EAEaAaA175C6fdEEf122c542"
+        "eth:0x0665d51e2342F5D5EAEaAaA175C6fdEEf122c542"
      values.$pastUpgrades.1.2.1:
-        "0xff6fb8160DC28260d4027C80eAd7e1eD147c963F"
+        "eth:0xff6fb8160DC28260d4027C80eAd7e1eD147c963F"
      values.$pastUpgrades.1.2.2:
-        "0xbE8988304816cbbd36624567AFe1A223DBF58c82"
+        "eth:0xbE8988304816cbbd36624567AFe1A223DBF58c82"
      values.$pastUpgrades.1.2.3:
-        "0x8480803516B7390Ff9C57eC4dD233B634FB493B8"
+        "eth:0x8480803516B7390Ff9C57eC4dD233B634FB493B8"
      values.$pastUpgrades.2.2.0:
-        "0x0665d51e2342F5D5EAEaAaA175C6fdEEf122c542"
+        "eth:0x0665d51e2342F5D5EAEaAaA175C6fdEEf122c542"
      values.$pastUpgrades.2.2.1:
-        "0xff6fb8160DC28260d4027C80eAd7e1eD147c963F"
+        "eth:0xff6fb8160DC28260d4027C80eAd7e1eD147c963F"
      values.$pastUpgrades.2.2.2:
-        "0xbE8988304816cbbd36624567AFe1A223DBF58c82"
+        "eth:0xbE8988304816cbbd36624567AFe1A223DBF58c82"
      values.$pastUpgrades.2.2.3:
-        "0x8480803516B7390Ff9C57eC4dD233B634FB493B8"
+        "eth:0x8480803516B7390Ff9C57eC4dD233B634FB493B8"
      values.$pastUpgrades.3.2.0:
-        "0xEaedCF01c0B01C1a10b74cB0A2cDeF78a9540cdb"
+        "eth:0xEaedCF01c0B01C1a10b74cB0A2cDeF78a9540cdb"
      values.$pastUpgrades.3.2.1:
-        "0x95C45F931946C97D10D9d6e859Fe8D62785ed3C1"
+        "eth:0x95C45F931946C97D10D9d6e859Fe8D62785ed3C1"
      values.$pastUpgrades.3.2.2:
-        "0x36b026c39125964D99596CE302866B5A59E4dE27"
+        "eth:0x36b026c39125964D99596CE302866B5A59E4dE27"
      values.$pastUpgrades.3.2.3:
-        "0x53d0b421BB3e522632ABEB06BB2c4eB15eaD9800"
+        "eth:0x53d0b421BB3e522632ABEB06BB2c4eB15eaD9800"
      values.$pastUpgrades.4.2.0:
-        "0xF2C9D38D16c7A7Dc9aA4F743Fce024354d9c19B4"
+        "eth:0xF2C9D38D16c7A7Dc9aA4F743Fce024354d9c19B4"
      values.$pastUpgrades.4.2.1:
-        "0x05DeB01AaDB6C98F8B78a1F9A81ccd68Ac4d70d4"
+        "eth:0x05DeB01AaDB6C98F8B78a1F9A81ccd68Ac4d70d4"
      values.$pastUpgrades.4.2.2:
-        "0x26b9a55DaBab9A8e74815A9D6Cd7F74AC0d7215f"
+        "eth:0x26b9a55DaBab9A8e74815A9D6Cd7F74AC0d7215f"
      values.$pastUpgrades.4.2.3:
-        "0x0A7C1b8D56BE02d9731e3A764107602f8F6dd490"
+        "eth:0x0A7C1b8D56BE02d9731e3A764107602f8F6dd490"
      values.$pastUpgrades.5.2.0:
-        "0x431449e2a28A69122860A4956A3f7191eE15aFBC"
+        "eth:0x431449e2a28A69122860A4956A3f7191eE15aFBC"
      values.$pastUpgrades.5.2.1:
-        "0xae5cbB5f70e134668a13d7C8EcEF5e9E6FffCF22"
+        "eth:0xae5cbB5f70e134668a13d7C8EcEF5e9E6FffCF22"
      values.$pastUpgrades.5.2.2:
-        "0x365D0ae3ECA13004daf2A4ba1501c01AaEbb4fec"
+        "eth:0x365D0ae3ECA13004daf2A4ba1501c01AaEbb4fec"
      values.$pastUpgrades.5.2.3:
-        "0x2f116b9033d88Bb3Cf64C371AE5458fbA22BA39A"
+        "eth:0x2f116b9033d88Bb3Cf64C371AE5458fbA22BA39A"
      values.facetAddresses.0:
-        "0x431449e2a28A69122860A4956A3f7191eE15aFBC"
+        "eth:0x431449e2a28A69122860A4956A3f7191eE15aFBC"
      values.facetAddresses.1:
-        "0xae5cbB5f70e134668a13d7C8EcEF5e9E6FffCF22"
+        "eth:0xae5cbB5f70e134668a13d7C8EcEF5e9E6FffCF22"
      values.facetAddresses.2:
-        "0x365D0ae3ECA13004daf2A4ba1501c01AaEbb4fec"
+        "eth:0x365D0ae3ECA13004daf2A4ba1501c01AaEbb4fec"
      values.facetAddresses.3:
-        "0x2f116b9033d88Bb3Cf64C371AE5458fbA22BA39A"
+        "eth:0x2f116b9033d88Bb3Cf64C371AE5458fbA22BA39A"
      values.facets.0x431449e2a28A69122860A4956A3f7191eE15aFBC:
-        ["acceptAdmin()","unfreezeDiamond()","upgradeChainFromVersion(uint256,((address,uint8,bool,bytes4[])[],address,bytes))","setPorterAvailability(bool)","setTransactionFilterer(address)","setTokenMultiplier(uint128,uint128)","freezeDiamond()","genesisUpgrade(address,address,bytes,bytes[])","forwardedBridgeMint(bytes,bool)","prepareChainCommitment()","setValidator(address,bool)","setPendingAdmin(address)","allowEvmEmulation()","setDAValidatorPair(address,address)","forwardedBridgeBurn(address,address,bytes)","changeFeeParams((uint8,uint32,uint32,uint32,uint32,uint64))","makePermanentRollup()","executeUpgrade(((address,uint8,bool,bytes4[])[],address,bytes))","forwardedBridgeRecoverFailedTransfer(uint256,bytes32,address,bytes)","setPriorityTxMaxGasLimit(uint256)","setPubdataPricingMode(uint8)"]
      values.facets.0xae5cbB5f70e134668a13d7C8EcEF5e9E6FffCF22:
-        ["getPubdataPricingMode()","getPriorityTxMaxGasLimit()","getTotalBlocksCommitted()","getVerifierParams()","baseTokenGasPriceMultiplierDenominator()","getTransactionFilterer()","isDiamondStorageFrozen()","getProtocolVersion()","getChainId()","getBridgehub()","getTotalBlocksExecuted()","getPriorityTreeRoot()","getVerifier()","facetAddresses()","getDAValidatorPair()","getPriorityQueueSize()","getSettlementLayer()","getAdmin()","storedBlockHash(uint256)","getFirstUnprocessedPriorityTx()","facets()","getL2SystemContractsUpgradeTxHash()","isPriorityQueueActive()","getChainTypeManager()","getBaseTokenAssetId()","getBaseToken()","l2LogsRootHash(uint256)","getL2SystemContractsUpgradeBlockNumber()","getTotalPriorityTxs()","facetFunctionSelectors(address)","getTotalBlocksVerified()","storedBatchHash(uint256)","getTotalBatchesExecuted()","isEthWithdrawalFinalized(uint256,uint256)","isFacetFreezable(address)","facetAddress(bytes4)","getPendingAdmin()","getL2BootloaderBytecodeHash()","getTotalBatchesCommitted()","getL2EvmEmulatorBytecodeHash()","getL2SystemContractsUpgradeBatchNumber()","isFunctionFreezable(bytes4)","baseTokenGasPriceMultiplierNominator()","getTotalBatchesVerified()","getPriorityTreeStartIndex()","getSemverProtocolVersion()","isValidator(address)","getL2DefaultAccountBytecodeHash()"]
      values.facets.0x365D0ae3ECA13004daf2A4ba1501c01AaEbb4fec:
-        ["proveL1ToL2TransactionStatus(bytes32,uint256,uint256,uint16,bytes32[],uint8)","bridgehubRequestL2Transaction((address,address,uint256,uint256,bytes,uint256,uint256,bytes[],address))","requestL2Transaction(address,uint256,bytes,uint256,uint256,bytes[],address)","proveL2LogInclusion(uint256,uint256,(uint8,bool,uint16,address,bytes32,bytes32),bytes32[])","finalizeEthWithdrawal(uint256,uint256,uint16,bytes,bytes32[])","proveL2LeafInclusion(uint256,uint256,bytes32,bytes32[])","l2TransactionBaseCost(uint256,uint256,uint256)","requestL2TransactionToGatewayMailbox(uint256,bytes32,uint64)","requestL2ServiceTransaction(address,bytes)","bridgehubRequestL2TransactionOnGateway(bytes32,uint64)","proveL2MessageInclusion(uint256,uint256,(uint16,address,bytes),bytes32[])"]
      values.facets.0x2f116b9033d88Bb3Cf64C371AE5458fbA22BA39A:
-        ["revertBatchesSharedBridge(uint256,uint256)","proveBatchesSharedBridge(uint256,uint256,uint256,bytes)","commitBatchesSharedBridge(uint256,uint256,uint256,bytes)","executeBatchesSharedBridge(uint256,uint256,uint256,bytes)"]
      values.facets.eth:0x431449e2a28A69122860A4956A3f7191eE15aFBC:
+        ["acceptAdmin()","unfreezeDiamond()","upgradeChainFromVersion(uint256,((address,uint8,bool,bytes4[])[],address,bytes))","setPorterAvailability(bool)","setTransactionFilterer(address)","setTokenMultiplier(uint128,uint128)","freezeDiamond()","genesisUpgrade(address,address,bytes,bytes[])","forwardedBridgeMint(bytes,bool)","prepareChainCommitment()","setValidator(address,bool)","setPendingAdmin(address)","allowEvmEmulation()","setDAValidatorPair(address,address)","forwardedBridgeBurn(address,address,bytes)","changeFeeParams((uint8,uint32,uint32,uint32,uint32,uint64))","makePermanentRollup()","executeUpgrade(((address,uint8,bool,bytes4[])[],address,bytes))","forwardedBridgeRecoverFailedTransfer(uint256,bytes32,address,bytes)","setPriorityTxMaxGasLimit(uint256)","setPubdataPricingMode(uint8)"]
      values.facets.eth:0xae5cbB5f70e134668a13d7C8EcEF5e9E6FffCF22:
+        ["getPubdataPricingMode()","getPriorityTxMaxGasLimit()","getTotalBlocksCommitted()","getVerifierParams()","baseTokenGasPriceMultiplierDenominator()","getTransactionFilterer()","isDiamondStorageFrozen()","getProtocolVersion()","getChainId()","getBridgehub()","getTotalBlocksExecuted()","getPriorityTreeRoot()","getVerifier()","facetAddresses()","getDAValidatorPair()","getPriorityQueueSize()","getSettlementLayer()","getAdmin()","storedBlockHash(uint256)","getFirstUnprocessedPriorityTx()","facets()","getL2SystemContractsUpgradeTxHash()","isPriorityQueueActive()","getChainTypeManager()","getBaseTokenAssetId()","getBaseToken()","l2LogsRootHash(uint256)","getL2SystemContractsUpgradeBlockNumber()","getTotalPriorityTxs()","facetFunctionSelectors(address)","getTotalBlocksVerified()","storedBatchHash(uint256)","getTotalBatchesExecuted()","isEthWithdrawalFinalized(uint256,uint256)","isFacetFreezable(address)","facetAddress(bytes4)","getPendingAdmin()","getL2BootloaderBytecodeHash()","getTotalBatchesCommitted()","getL2EvmEmulatorBytecodeHash()","getL2SystemContractsUpgradeBatchNumber()","isFunctionFreezable(bytes4)","baseTokenGasPriceMultiplierNominator()","getTotalBatchesVerified()","getPriorityTreeStartIndex()","getSemverProtocolVersion()","isValidator(address)","getL2DefaultAccountBytecodeHash()"]
      values.facets.eth:0x365D0ae3ECA13004daf2A4ba1501c01AaEbb4fec:
+        ["proveL1ToL2TransactionStatus(bytes32,uint256,uint256,uint16,bytes32[],uint8)","bridgehubRequestL2Transaction((address,address,uint256,uint256,bytes,uint256,uint256,bytes[],address))","requestL2Transaction(address,uint256,bytes,uint256,uint256,bytes[],address)","proveL2LogInclusion(uint256,uint256,(uint8,bool,uint16,address,bytes32,bytes32),bytes32[])","finalizeEthWithdrawal(uint256,uint256,uint16,bytes,bytes32[])","proveL2LeafInclusion(uint256,uint256,bytes32,bytes32[])","l2TransactionBaseCost(uint256,uint256,uint256)","requestL2TransactionToGatewayMailbox(uint256,bytes32,uint64)","requestL2ServiceTransaction(address,bytes)","bridgehubRequestL2TransactionOnGateway(bytes32,uint64)","proveL2MessageInclusion(uint256,uint256,(uint16,address,bytes),bytes32[])"]
      values.facets.eth:0x2f116b9033d88Bb3Cf64C371AE5458fbA22BA39A:
+        ["revertBatchesSharedBridge(uint256,uint256)","proveBatchesSharedBridge(uint256,uint256,uint256,bytes)","commitBatchesSharedBridge(uint256,uint256,uint256,bytes)","executeBatchesSharedBridge(uint256,uint256,uint256,bytes)"]
+++ severity: HIGH
      values.getAdmin:
-        "0x6bd8d33551077Ed281Cb047835a2aE4033eEc433"
+        "eth:0x6bd8d33551077Ed281Cb047835a2aE4033eEc433"
      values.getBaseToken:
-        "0x1ff1dC3cB9eeDbC6Eb2d99C03b30A05cA625fB5a"
+        "eth:0x1ff1dC3cB9eeDbC6Eb2d99C03b30A05cA625fB5a"
      values.getBridgehub:
-        "0x303a465B659cBB0ab36eE643eA362c509EEb5213"
+        "eth:0x303a465B659cBB0ab36eE643eA362c509EEb5213"
      values.getChainTypeManager:
-        "0xc2eE6b6af7d616f6e27ce7F4A451Aedc2b0F5f5C"
+        "eth:0xc2eE6b6af7d616f6e27ce7F4A451Aedc2b0F5f5C"
+++ severity: HIGH
      values.getDAValidatorPair.0:
-        "0x8f50d93B9955B285f787043B30B5F51D09bE0120"
+        "eth:0x8f50d93B9955B285f787043B30B5F51D09bE0120"
+++ severity: HIGH
      values.getDAValidatorPair.1:
-        "0xdA6661Df15E79cFe1e679ccD138D813b955ba492"
+        "eth:0xdA6661Df15E79cFe1e679ccD138D813b955ba492"
+++ severity: HIGH
      values.getPendingAdmin:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      values.getSettlementLayer:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
+++ description: This contract must expose the ITransactionFilterer interface (see Mailbox facet) and is used for censoring transactions pushed from L1 to L2.
+++ severity: HIGH
      values.getTransactionFilterer:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      values.getVerifier:
-        "0x53F5DE9De3B2DA90633a2c74BEb3b9912cdd1579"
+        "eth:0x53F5DE9De3B2DA90633a2c74BEb3b9912cdd1579"
      values.validators.0:
-        "0x5C03468829A26981c410a7930bD4853622F0B2E5"
+        "eth:0x5C03468829A26981c410a7930bD4853622F0B2E5"
      values.validators.1:
-        "0x5D8ba173Dc6C3c90C8f7C04C9288BeF5FDbAd06E"
+        "eth:0x5D8ba173Dc6C3c90C8f7C04C9288BeF5FDbAd06E"
      values.validators.2:
-        "0x8c0Bfc04AdA21fd496c55B8C50331f904306F564"
+        "eth:0x8c0Bfc04AdA21fd496c55B8C50331f904306F564"
      implementationNames.0xc29d04A93F893700015138E3E334eB828dAC3cef:
-        "DiamondProxy"
      implementationNames.0x431449e2a28A69122860A4956A3f7191eE15aFBC:
-        "AdminFacet"
      implementationNames.0xae5cbB5f70e134668a13d7C8EcEF5e9E6FffCF22:
-        "GettersFacet"
      implementationNames.0x365D0ae3ECA13004daf2A4ba1501c01AaEbb4fec:
-        "MailboxFacet"
      implementationNames.0x2f116b9033d88Bb3Cf64C371AE5458fbA22BA39A:
-        "ExecutorFacet"
      implementationNames.eth:0xc29d04A93F893700015138E3E334eB828dAC3cef:
+        "DiamondProxy"
      implementationNames.eth:0x431449e2a28A69122860A4956A3f7191eE15aFBC:
+        "AdminFacet"
      implementationNames.eth:0xae5cbB5f70e134668a13d7C8EcEF5e9E6FffCF22:
+        "GettersFacet"
      implementationNames.eth:0x365D0ae3ECA13004daf2A4ba1501c01AaEbb4fec:
+        "MailboxFacet"
      implementationNames.eth:0x2f116b9033d88Bb3Cf64C371AE5458fbA22BA39A:
+        "ExecutorFacet"
    }
```

```diff
    contract L1VerifierFflonk (0xD5dBE903F5382B052317D326FA1a7B63710C6a5b) {
    +++ description: Verifies a zk-SNARK proof using an implementation of the fflonk proof system.
      address:
-        "0xD5dBE903F5382B052317D326FA1a7B63710C6a5b"
+        "eth:0xD5dBE903F5382B052317D326FA1a7B63710C6a5b"
      implementationNames.0xD5dBE903F5382B052317D326FA1a7B63710C6a5b:
-        "L1VerifierFflonk"
      implementationNames.eth:0xD5dBE903F5382B052317D326FA1a7B63710C6a5b:
+        "L1VerifierFflonk"
    }
```

```diff
    EOA  (0xdA6661Df15E79cFe1e679ccD138D813b955ba492) {
    +++ description: None
      address:
-        "0xdA6661Df15E79cFe1e679ccD138D813b955ba492"
+        "eth:0xdA6661Df15E79cFe1e679ccD138D813b955ba492"
    }
```

```diff
    EOA  (0xE0b3Ef5A61324acceE3798B6D9Da5B47b0312b7c) {
    +++ description: None
      address:
-        "0xE0b3Ef5A61324acceE3798B6D9Da5B47b0312b7c"
+        "eth:0xE0b3Ef5A61324acceE3798B6D9Da5B47b0312b7c"
    }
```

```diff
    contract L1USDCBridge (0xf553E6D903AA43420ED7e3bc2313bE9286A8F987) {
    +++ description: None
      address:
-        "0xf553E6D903AA43420ED7e3bc2313bE9286A8F987"
+        "eth:0xf553E6D903AA43420ED7e3bc2313bE9286A8F987"
      values.$admin:
-        "0xC2a36181fB524a6bEfE639aFEd37A67e77d62cf1"
+        "eth:0xC2a36181fB524a6bEfE639aFEd37A67e77d62cf1"
      values.$implementation:
-        "0x2ccD5486Ea1b2A52dcD387c01314F6A328f66cbB"
+        "eth:0x2ccD5486Ea1b2A52dcD387c01314F6A328f66cbB"
      values.$pastUpgrades.0.2.0:
-        "0x86dF12f51E3531689e0615bb2F739ddf01337715"
+        "eth:0x86dF12f51E3531689e0615bb2F739ddf01337715"
      values.$pastUpgrades.1.2.0:
-        "0x2ccD5486Ea1b2A52dcD387c01314F6A328f66cbB"
+        "eth:0x2ccD5486Ea1b2A52dcD387c01314F6A328f66cbB"
      values.admin:
-        "0x4e4943346848c4867F81dFb37c4cA9C5715A7828"
+        "eth:0x4e4943346848c4867F81dFb37c4cA9C5715A7828"
      values.BRIDGE_HUB:
-        "0x303a465B659cBB0ab36eE643eA362c509EEb5213"
+        "eth:0x303a465B659cBB0ab36eE643eA362c509EEb5213"
      values.L1_USDC_TOKEN:
-        "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48"
+        "eth:0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48"
      values.owner:
-        "0xE30Dca3047B37dc7d88849dE4A4Dc07937ad5Ab3"
+        "eth:0xE30Dca3047B37dc7d88849dE4A4Dc07937ad5Ab3"
      values.pendingAdmin:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      values.pendingOwner:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      implementationNames.0xf553E6D903AA43420ED7e3bc2313bE9286A8F987:
-        "TransparentUpgradeableProxy"
      implementationNames.0x2ccD5486Ea1b2A52dcD387c01314F6A328f66cbB:
-        "L1USDCBridge"
      implementationNames.eth:0xf553E6D903AA43420ED7e3bc2313bE9286A8F987:
+        "TransparentUpgradeableProxy"
      implementationNames.eth:0x2ccD5486Ea1b2A52dcD387c01314F6A328f66cbB:
+        "L1USDCBridge"
    }
```

```diff
    EOA  (0xfbDF62F0a73DED0BF5A264867cFD022E192B5526) {
    +++ description: None
      address:
-        "0xfbDF62F0a73DED0BF5A264867cFD022E192B5526"
+        "eth:0xfbDF62F0a73DED0BF5A264867cFD022E192B5526"
    }
```

```diff
+   Status: CREATED
    contract Lens Multisig (0x4968A0E4b025eD7d095753E54058377969b41abC)
    +++ description: None
```

```diff
+   Status: CREATED
    contract DualVerifier (0x53F5DE9De3B2DA90633a2c74BEb3b9912cdd1579)
    +++ description: A router contract for verifiers. Routes verification requests to eth:0xD5dBE903F5382B052317D326FA1a7B63710C6a5b or eth:0x5BAfEF6729228add8775aF4Cecd2E68a51424Ee1 depending on the supplied proof type.
```

```diff
+   Status: CREATED
    contract L1VerifierPlonk (0x5BAfEF6729228add8775aF4Cecd2E68a51424Ee1)
    +++ description: Verifies a zk-SNARK proof using an implementation of the PlonK proof system.
```

```diff
+   Status: CREATED
    contract ValidatorTimelock3 (0x5C03468829A26981c410a7930bD4853622F0B2E5)
    +++ description: Intermediary contract between the *Validators* and the central diamond contract that delays block execution (ie withdrawals and other L2 --> L1 messages) by 0s.
```

```diff
+   Status: CREATED
    contract ValidatorTimelock2 (0x5D8ba173Dc6C3c90C8f7C04C9288BeF5FDbAd06E)
    +++ description: Intermediary contract between the *Validators* and the central diamond contract that delays block execution (ie withdrawals and other L2 --> L1 messages) by 3h.
```

```diff
+   Status: CREATED
    contract LensZkEvmAdmin (0x6bd8d33551077Ed281Cb047835a2aE4033eEc433)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ValidatorTimelock (0x8c0Bfc04AdA21fd496c55B8C50331f904306F564)
    +++ description: Intermediary contract between the *Validators* and the central diamond contract that delays block execution (ie withdrawals and other L2 --> L1 messages) by 3h.
```

```diff
+   Status: CREATED
    contract AvailL1DAValidator (0x8f50d93B9955B285f787043B30B5F51D09bE0120)
    +++ description: Contract that verifies that the validiums data was made available on Avail by querying the eth:0x054fd961708D8E2B9c10a63F6157c74458889F0a on Ethereum for a merkle proof of inclusion.
```

```diff
+   Status: CREATED
    contract LensZkEvm (0xc29d04A93F893700015138E3E334eB828dAC3cef)
    +++ description: The main contract defining the Layer 2. Operator actions like commiting blocks, providing ZK proofs and executing batches ultimately target this contract which then processes transactions. During batch execution it processes L1 --> L2 and L2 --> L1 transactions.
```

```diff
+   Status: CREATED
    contract L1VerifierFflonk (0xD5dBE903F5382B052317D326FA1a7B63710C6a5b)
    +++ description: Verifies a zk-SNARK proof using an implementation of the fflonk proof system.
```

```diff
+   Status: CREATED
    contract L1USDCBridge (0xf553E6D903AA43420ED7e3bc2313bE9286A8F987)
    +++ description: None
```

Generated with discovered.json: 0xc241ecec70a16dd4e90c460147f183b00a159a05

# Diff at Mon, 07 Jul 2025 06:48:55 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@1a6f89d35120c5c65bf077ab92a9ca72da48080d block: 22738142
- current block number: 22865631

## Description

standard zk stack v28 upgrade.

## Watched changes

```diff
-   Status: DELETED
    contract DualVerifier (0x079004D9C534Ff1dC3414F5dB31B4a0a1F4fc9d0)
    +++ description: A router contract for verifiers. Routes verification requests to 0x1F517f2bAb178AdD6e282297a4728bcc50E9F6CF or 0xAd36FFc4066855aeF3Bdf6BF03cA427bb084636e depending on the supplied proof type.
```

```diff
-   Status: DELETED
    contract L1VerifierFflonk (0x1F517f2bAb178AdD6e282297a4728bcc50E9F6CF)
    +++ description: Verifies a zk-SNARK proof using an implementation of the fflonk proof system.
```

```diff
    contract LensZkEvmAdmin (0x6bd8d33551077Ed281Cb047835a2aE4033eEc433) {
    +++ description: None
+++ description: Timestamps for new protocol version upgrades can be registered here (NOT enforced)
      values.upgradeTimestamps.2:
+        {"_protocolVersion":120259084288,"_upgradeTimestamp":1750942800}
    }
```

```diff
-   Status: DELETED
    contract L1VerifierPlonk (0xAd36FFc4066855aeF3Bdf6BF03cA427bb084636e)
    +++ description: Verifies a zk-SNARK proof using an implementation of the PlonK proof system.
```

```diff
    contract LensZkEvm (0xc29d04A93F893700015138E3E334eB828dAC3cef) {
    +++ description: The main contract defining the Layer 2. Operator actions like commiting blocks, providing ZK proofs and executing batches ultimately target this contract which then processes transactions. During batch execution it processes L1 --> L2 and L2 --> L1 transactions.
      values.$implementation.0:
-        "0xF2C9D38D16c7A7Dc9aA4F743Fce024354d9c19B4"
+        "0x431449e2a28A69122860A4956A3f7191eE15aFBC"
      values.$implementation.1:
-        "0x05DeB01AaDB6C98F8B78a1F9A81ccd68Ac4d70d4"
+        "0xae5cbB5f70e134668a13d7C8EcEF5e9E6FffCF22"
      values.$implementation.2:
-        "0x26b9a55DaBab9A8e74815A9D6Cd7F74AC0d7215f"
+        "0x365D0ae3ECA13004daf2A4ba1501c01AaEbb4fec"
      values.$implementation.3:
-        "0x0A7C1b8D56BE02d9731e3A764107602f8F6dd490"
+        "0x2f116b9033d88Bb3Cf64C371AE5458fbA22BA39A"
      values.$pastUpgrades.5:
+        ["2025-07-02T18:42:59.000Z","0x8d2c504c58a659511bef547888186da42708e16923743741cd11acf4c6d908b3",["0x431449e2a28A69122860A4956A3f7191eE15aFBC","0xae5cbB5f70e134668a13d7C8EcEF5e9E6FffCF22","0x365D0ae3ECA13004daf2A4ba1501c01AaEbb4fec","0x2f116b9033d88Bb3Cf64C371AE5458fbA22BA39A"]]
      values.$upgradeCount:
-        5
+        6
      values.facetAddresses.0:
-        "0xF2C9D38D16c7A7Dc9aA4F743Fce024354d9c19B4"
+        "0x431449e2a28A69122860A4956A3f7191eE15aFBC"
      values.facetAddresses.1:
-        "0x05DeB01AaDB6C98F8B78a1F9A81ccd68Ac4d70d4"
+        "0xae5cbB5f70e134668a13d7C8EcEF5e9E6FffCF22"
      values.facetAddresses.2:
-        "0x26b9a55DaBab9A8e74815A9D6Cd7F74AC0d7215f"
+        "0x365D0ae3ECA13004daf2A4ba1501c01AaEbb4fec"
      values.facetAddresses.3:
-        "0x0A7C1b8D56BE02d9731e3A764107602f8F6dd490"
+        "0x2f116b9033d88Bb3Cf64C371AE5458fbA22BA39A"
      values.facets.0xF2C9D38D16c7A7Dc9aA4F743Fce024354d9c19B4:
-        ["acceptAdmin()","unfreezeDiamond()","upgradeChainFromVersion(uint256,((address,uint8,bool,bytes4[])[],address,bytes))","setPorterAvailability(bool)","setTransactionFilterer(address)","setTokenMultiplier(uint128,uint128)","freezeDiamond()","genesisUpgrade(address,address,bytes,bytes[])","forwardedBridgeMint(bytes,bool)","prepareChainCommitment()","setValidator(address,bool)","setPendingAdmin(address)","allowEvmEmulation()","setDAValidatorPair(address,address)","forwardedBridgeBurn(address,address,bytes)","changeFeeParams((uint8,uint32,uint32,uint32,uint32,uint64))","makePermanentRollup()","executeUpgrade(((address,uint8,bool,bytes4[])[],address,bytes))","forwardedBridgeRecoverFailedTransfer(uint256,bytes32,address,bytes)","setPriorityTxMaxGasLimit(uint256)","setPubdataPricingMode(uint8)"]
      values.facets.0x05DeB01AaDB6C98F8B78a1F9A81ccd68Ac4d70d4:
-        ["getPubdataPricingMode()","getPriorityTxMaxGasLimit()","getTotalBlocksCommitted()","getVerifierParams()","baseTokenGasPriceMultiplierDenominator()","getTransactionFilterer()","isDiamondStorageFrozen()","getProtocolVersion()","getChainId()","getBridgehub()","getTotalBlocksExecuted()","getPriorityTreeRoot()","getVerifier()","facetAddresses()","getDAValidatorPair()","getPriorityQueueSize()","getSettlementLayer()","getAdmin()","storedBlockHash(uint256)","getFirstUnprocessedPriorityTx()","facets()","getL2SystemContractsUpgradeTxHash()","isPriorityQueueActive()","getChainTypeManager()","getBaseTokenAssetId()","getBaseToken()","l2LogsRootHash(uint256)","getL2SystemContractsUpgradeBlockNumber()","getTotalPriorityTxs()","facetFunctionSelectors(address)","getTotalBlocksVerified()","storedBatchHash(uint256)","getTotalBatchesExecuted()","isEthWithdrawalFinalized(uint256,uint256)","isFacetFreezable(address)","facetAddress(bytes4)","getPendingAdmin()","getL2BootloaderBytecodeHash()","getTotalBatchesCommitted()","getL2EvmEmulatorBytecodeHash()","getL2SystemContractsUpgradeBatchNumber()","isFunctionFreezable(bytes4)","baseTokenGasPriceMultiplierNominator()","getTotalBatchesVerified()","getPriorityTreeStartIndex()","getSemverProtocolVersion()","isValidator(address)","getL2DefaultAccountBytecodeHash()"]
      values.facets.0x26b9a55DaBab9A8e74815A9D6Cd7F74AC0d7215f:
-        ["proveL1ToL2TransactionStatus(bytes32,uint256,uint256,uint16,bytes32[],uint8)","bridgehubRequestL2Transaction((address,address,uint256,uint256,bytes,uint256,uint256,bytes[],address))","requestL2Transaction(address,uint256,bytes,uint256,uint256,bytes[],address)","proveL2LogInclusion(uint256,uint256,(uint8,bool,uint16,address,bytes32,bytes32),bytes32[])","finalizeEthWithdrawal(uint256,uint256,uint16,bytes,bytes32[])","proveL2LeafInclusion(uint256,uint256,bytes32,bytes32[])","l2TransactionBaseCost(uint256,uint256,uint256)","requestL2TransactionToGatewayMailbox(uint256,bytes32,uint64)","requestL2ServiceTransaction(address,bytes)","bridgehubRequestL2TransactionOnGateway(bytes32,uint64)","proveL2MessageInclusion(uint256,uint256,(uint16,address,bytes),bytes32[])"]
      values.facets.0x0A7C1b8D56BE02d9731e3A764107602f8F6dd490:
-        ["revertBatchesSharedBridge(uint256,uint256)","proveBatchesSharedBridge(uint256,uint256,uint256,bytes)","commitBatchesSharedBridge(uint256,uint256,uint256,bytes)","executeBatchesSharedBridge(uint256,uint256,uint256,bytes)"]
      values.facets.0x431449e2a28A69122860A4956A3f7191eE15aFBC:
+        ["acceptAdmin()","unfreezeDiamond()","upgradeChainFromVersion(uint256,((address,uint8,bool,bytes4[])[],address,bytes))","setPorterAvailability(bool)","setTransactionFilterer(address)","setTokenMultiplier(uint128,uint128)","freezeDiamond()","genesisUpgrade(address,address,bytes,bytes[])","forwardedBridgeMint(bytes,bool)","prepareChainCommitment()","setValidator(address,bool)","setPendingAdmin(address)","allowEvmEmulation()","setDAValidatorPair(address,address)","forwardedBridgeBurn(address,address,bytes)","changeFeeParams((uint8,uint32,uint32,uint32,uint32,uint64))","makePermanentRollup()","executeUpgrade(((address,uint8,bool,bytes4[])[],address,bytes))","forwardedBridgeRecoverFailedTransfer(uint256,bytes32,address,bytes)","setPriorityTxMaxGasLimit(uint256)","setPubdataPricingMode(uint8)"]
      values.facets.0xae5cbB5f70e134668a13d7C8EcEF5e9E6FffCF22:
+        ["getPubdataPricingMode()","getPriorityTxMaxGasLimit()","getTotalBlocksCommitted()","getVerifierParams()","baseTokenGasPriceMultiplierDenominator()","getTransactionFilterer()","isDiamondStorageFrozen()","getProtocolVersion()","getChainId()","getBridgehub()","getTotalBlocksExecuted()","getPriorityTreeRoot()","getVerifier()","facetAddresses()","getDAValidatorPair()","getPriorityQueueSize()","getSettlementLayer()","getAdmin()","storedBlockHash(uint256)","getFirstUnprocessedPriorityTx()","facets()","getL2SystemContractsUpgradeTxHash()","isPriorityQueueActive()","getChainTypeManager()","getBaseTokenAssetId()","getBaseToken()","l2LogsRootHash(uint256)","getL2SystemContractsUpgradeBlockNumber()","getTotalPriorityTxs()","facetFunctionSelectors(address)","getTotalBlocksVerified()","storedBatchHash(uint256)","getTotalBatchesExecuted()","isEthWithdrawalFinalized(uint256,uint256)","isFacetFreezable(address)","facetAddress(bytes4)","getPendingAdmin()","getL2BootloaderBytecodeHash()","getTotalBatchesCommitted()","getL2EvmEmulatorBytecodeHash()","getL2SystemContractsUpgradeBatchNumber()","isFunctionFreezable(bytes4)","baseTokenGasPriceMultiplierNominator()","getTotalBatchesVerified()","getPriorityTreeStartIndex()","getSemverProtocolVersion()","isValidator(address)","getL2DefaultAccountBytecodeHash()"]
      values.facets.0x365D0ae3ECA13004daf2A4ba1501c01AaEbb4fec:
+        ["proveL1ToL2TransactionStatus(bytes32,uint256,uint256,uint16,bytes32[],uint8)","bridgehubRequestL2Transaction((address,address,uint256,uint256,bytes,uint256,uint256,bytes[],address))","requestL2Transaction(address,uint256,bytes,uint256,uint256,bytes[],address)","proveL2LogInclusion(uint256,uint256,(uint8,bool,uint16,address,bytes32,bytes32),bytes32[])","finalizeEthWithdrawal(uint256,uint256,uint16,bytes,bytes32[])","proveL2LeafInclusion(uint256,uint256,bytes32,bytes32[])","l2TransactionBaseCost(uint256,uint256,uint256)","requestL2TransactionToGatewayMailbox(uint256,bytes32,uint64)","requestL2ServiceTransaction(address,bytes)","bridgehubRequestL2TransactionOnGateway(bytes32,uint64)","proveL2MessageInclusion(uint256,uint256,(uint16,address,bytes),bytes32[])"]
      values.facets.0x2f116b9033d88Bb3Cf64C371AE5458fbA22BA39A:
+        ["revertBatchesSharedBridge(uint256,uint256)","proveBatchesSharedBridge(uint256,uint256,uint256,bytes)","commitBatchesSharedBridge(uint256,uint256,uint256,bytes)","executeBatchesSharedBridge(uint256,uint256,uint256,bytes)"]
      values.getL2BootloaderBytecodeHash:
-        "0x0100087fe7df1cf5616646f85bd5eebc8efe5d8deac4d85bea9b9aefd88803dd"
+        "0x0100085f9382a7928dd83bfc529121827b5f29f18b9aa10d18aa68e1be7ddc35"
      values.getL2DefaultAccountBytecodeHash:
-        "0x0100050bf9baf9d08e5d3c037f8d8b486076de7e6dceb3f3fc0989ea2c99cd67"
+        "0x010005f72e443c94460f4583fb38ef5d0c5cd9897021c41df840f91465c0392e"
      values.getL2EvmEmulatorBytecodeHash:
-        "0x01000bbb8116fe7bdf690c19740ea350375426cec23f4f1f69a12fdc58adc9ba"
+        "0x01000d83e0329d9144ad041430fafcbc2b388e5434db8cb8a96e80157738a1da"
+++ description: Protocol version, increments with each protocol upgrade.
+++ severity: HIGH
      values.getProtocolVersion:
-        115964116992
+        120259084288
      values.getSemverProtocolVersion.1:
-        27
+        28
      values.getVerifier:
-        "0x079004D9C534Ff1dC3414F5dB31B4a0a1F4fc9d0"
+        "0x53F5DE9De3B2DA90633a2c74BEb3b9912cdd1579"
      implementationNames.0xF2C9D38D16c7A7Dc9aA4F743Fce024354d9c19B4:
-        "AdminFacet"
      implementationNames.0x05DeB01AaDB6C98F8B78a1F9A81ccd68Ac4d70d4:
-        "GettersFacet"
      implementationNames.0x26b9a55DaBab9A8e74815A9D6Cd7F74AC0d7215f:
-        "MailboxFacet"
      implementationNames.0x0A7C1b8D56BE02d9731e3A764107602f8F6dd490:
-        "ExecutorFacet"
      implementationNames.0x431449e2a28A69122860A4956A3f7191eE15aFBC:
+        "AdminFacet"
      implementationNames.0xae5cbB5f70e134668a13d7C8EcEF5e9E6FffCF22:
+        "GettersFacet"
      implementationNames.0x365D0ae3ECA13004daf2A4ba1501c01AaEbb4fec:
+        "MailboxFacet"
      implementationNames.0x2f116b9033d88Bb3Cf64C371AE5458fbA22BA39A:
+        "ExecutorFacet"
    }
```

```diff
+   Status: CREATED
    contract DualVerifier (0x53F5DE9De3B2DA90633a2c74BEb3b9912cdd1579)
    +++ description: A router contract for verifiers. Routes verification requests to 0xD5dBE903F5382B052317D326FA1a7B63710C6a5b or 0x5BAfEF6729228add8775aF4Cecd2E68a51424Ee1 depending on the supplied proof type.
```

```diff
+   Status: CREATED
    contract L1VerifierPlonk (0x5BAfEF6729228add8775aF4Cecd2E68a51424Ee1)
    +++ description: Verifies a zk-SNARK proof using an implementation of the PlonK proof system.
```

```diff
+   Status: CREATED
    contract L1VerifierFflonk (0xD5dBE903F5382B052317D326FA1a7B63710C6a5b)
    +++ description: Verifies a zk-SNARK proof using an implementation of the fflonk proof system.
```

## Source code changes

```diff
.../lens/ethereum/{.flat@22738142 => .flat}/DualVerifier.sol   |  2 +-
 .../ethereum/{.flat@22738142 => .flat}/L1VerifierFflonk.sol    |  6 +++---
 .../ethereum/{.flat@22738142 => .flat}/L1VerifierPlonk.sol     | 10 +++++-----
 .../{.flat@22738142 => .flat}/LensZkEvm/AdminFacet.1.sol       |  2 +-
 .../{.flat@22738142 => .flat}/LensZkEvm/ExecutorFacet.4.sol    |  2 +-
 .../{.flat@22738142 => .flat}/LensZkEvm/GettersFacet.2.sol     |  2 +-
 .../{.flat@22738142 => .flat}/LensZkEvm/MailboxFacet.3.sol     |  2 +-
 7 files changed, 13 insertions(+), 13 deletions(-)
```

Generated with discovered.json: 0x7655df2ab2ffad645038cf020fb303388d249f8a

# Diff at Fri, 04 Jul 2025 12:19:07 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@1f56dc47fe915564d4555300304da4d3bcbc087f block: 22738142
- current block number: 22738142

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22738142 (main branch discovery), not current.

```diff
    EOA  (0x3eA4D1684C65756E892b0B8d3e331E10D9d3a484) {
    +++ description: None
      receivedPermissions.0.from:
-        "ethereum:0x8c0Bfc04AdA21fd496c55B8C50331f904306F564"
+        "eth:0x8c0Bfc04AdA21fd496c55B8C50331f904306F564"
    }
```

```diff
    EOA  (0x477c1B7DC1091389CBD3Eef21Efb00081606Ab67) {
    +++ description: None
      receivedPermissions.0.from:
-        "ethereum:0x8c0Bfc04AdA21fd496c55B8C50331f904306F564"
+        "eth:0x8c0Bfc04AdA21fd496c55B8C50331f904306F564"
    }
```

```diff
    contract Lens Multisig (0x4968A0E4b025eD7d095753E54058377969b41abC) {
    +++ description: None
      receivedPermissions.0.via.0.address:
-        "ethereum:0x6bd8d33551077Ed281Cb047835a2aE4033eEc433"
+        "eth:0x6bd8d33551077Ed281Cb047835a2aE4033eEc433"
      receivedPermissions.0.from:
-        "ethereum:0xc29d04A93F893700015138E3E334eB828dAC3cef"
+        "eth:0xc29d04A93F893700015138E3E334eB828dAC3cef"
      directlyReceivedPermissions.0.from:
-        "ethereum:0x6bd8d33551077Ed281Cb047835a2aE4033eEc433"
+        "eth:0x6bd8d33551077Ed281Cb047835a2aE4033eEc433"
    }
```

```diff
    contract ValidatorTimelock3 (0x5C03468829A26981c410a7930bD4853622F0B2E5) {
    +++ description: Intermediary contract between the *Validators* and the central diamond contract that delays block execution (ie withdrawals and other L2 --> L1 messages) by 0s.
      receivedPermissions.0.from:
-        "ethereum:0xc29d04A93F893700015138E3E334eB828dAC3cef"
+        "eth:0xc29d04A93F893700015138E3E334eB828dAC3cef"
    }
```

```diff
    contract ValidatorTimelock2 (0x5D8ba173Dc6C3c90C8f7C04C9288BeF5FDbAd06E) {
    +++ description: Intermediary contract between the *Validators* and the central diamond contract that delays block execution (ie withdrawals and other L2 --> L1 messages) by 3h.
      receivedPermissions.0.from:
-        "ethereum:0xc29d04A93F893700015138E3E334eB828dAC3cef"
+        "eth:0xc29d04A93F893700015138E3E334eB828dAC3cef"
    }
```

```diff
    contract LensZkEvmAdmin (0x6bd8d33551077Ed281Cb047835a2aE4033eEc433) {
    +++ description: None
      directlyReceivedPermissions.0.from:
-        "ethereum:0xc29d04A93F893700015138E3E334eB828dAC3cef"
+        "eth:0xc29d04A93F893700015138E3E334eB828dAC3cef"
    }
```

```diff
    contract ValidatorTimelock (0x8c0Bfc04AdA21fd496c55B8C50331f904306F564) {
    +++ description: Intermediary contract between the *Validators* and the central diamond contract that delays block execution (ie withdrawals and other L2 --> L1 messages) by 3h.
      receivedPermissions.0.from:
-        "ethereum:0xc29d04A93F893700015138E3E334eB828dAC3cef"
+        "eth:0xc29d04A93F893700015138E3E334eB828dAC3cef"
    }
```

```diff
    EOA  (0xAaF7b278baC078AA4f9bdc8E0a93CDe604aA67d9) {
    +++ description: None
      receivedPermissions.0.from:
-        "ethereum:0x5C03468829A26981c410a7930bD4853622F0B2E5"
+        "eth:0x5C03468829A26981c410a7930bD4853622F0B2E5"
      receivedPermissions.1.from:
-        "ethereum:0x5D8ba173Dc6C3c90C8f7C04C9288BeF5FDbAd06E"
+        "eth:0x5D8ba173Dc6C3c90C8f7C04C9288BeF5FDbAd06E"
    }
```

```diff
    EOA  (0xb1a0c1F1B50436AC94B8Ce9Ae919B0e820aCb374) {
    +++ description: None
      receivedPermissions.0.from:
-        "ethereum:0x5C03468829A26981c410a7930bD4853622F0B2E5"
+        "eth:0x5C03468829A26981c410a7930bD4853622F0B2E5"
      receivedPermissions.1.from:
-        "ethereum:0x5D8ba173Dc6C3c90C8f7C04C9288BeF5FDbAd06E"
+        "eth:0x5D8ba173Dc6C3c90C8f7C04C9288BeF5FDbAd06E"
    }
```

Generated with discovered.json: 0xe5fd1307c3ec2430bc90dbe72268325c2c324e91

# Diff at Wed, 25 Jun 2025 07:17:24 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@4bade41aedf0f9269688f2c05f04d2992bb2ca38 block: 22738142
- current block number: 22738142

## Description

Config: rename, tidy template folders. unhide the L1NativeTokenVault.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22738142 (main branch discovery), not current.

```diff
    contract AvailL1DAValidator (0x8f50d93B9955B285f787043B30B5F51D09bE0120) {
    +++ description: Contract that verifies that the validiums data was made available on Avail by querying the 0x054fd961708D8E2B9c10a63F6157c74458889F0a on Ethereum for a merkle proof of inclusion.
      template:
-        "shared-zk-stack/v26/AvailL1DAValidator"
+        "shared-zk-stack/AvailL1DAValidator"
    }
```

```diff
    contract LensZkEvm (0xc29d04A93F893700015138E3E334eB828dAC3cef) {
    +++ description: The main contract defining the Layer 2. Operator actions like commiting blocks, providing ZK proofs and executing batches ultimately target this contract which then processes transactions. During batch execution it processes L1 --> L2 and L2 --> L1 transactions.
      template:
-        "shared-zk-stack/v26/Diamond"
+        "shared-zk-stack/Diamond"
    }
```

Generated with discovered.json: 0x496bfdfc86977814dc290b467d5367c2ad62a02b

# Diff at Thu, 19 Jun 2025 11:17:14 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@d5c484ae81a750a81728eec4c46d10685ad38407 block: 22731088
- current block number: 22738142

## Description

Upgrade to Vector DA bridge from Avail.

## Watched changes

```diff
    contract Lens Multisig (0x4968A0E4b025eD7d095753E54058377969b41abC) {
    +++ description: None
      values.$members.7:
+        "0x2a80091816D7872850D500F6Ade835354238Af17"
      values.$members.6:
+        "0x5063b3D23C3640d51c9E2aef41063B1d482C70ff"
      values.$members.5:
+        "0x62Ae8d9B6d0D9817bd9D41b9AfEAc301dBa713B8"
      values.$members.4:
+        "0x5dc301EcD8Bd7694BB1074B3E58Aa0916EE7887d"
      values.$members.3:
-        "0x2a80091816D7872850D500F6Ade835354238Af17"
+        "0xfbDF62F0a73DED0BF5A264867cFD022E192B5526"
      values.$members.2:
-        "0x5063b3D23C3640d51c9E2aef41063B1d482C70ff"
+        "0xE0b3Ef5A61324acceE3798B6D9Da5B47b0312b7c"
      values.$members.1:
-        "0xE0b3Ef5A61324acceE3798B6D9Da5B47b0312b7c"
+        "0x2eD1df8F475b1f9c7493fC0eb0BFD4D1FD17f27b"
      values.$members.0:
-        "0x2eD1df8F475b1f9c7493fC0eb0BFD4D1FD17f27b"
+        "0x71910321A1d3b3f743ca52569f5Aa82f09538A2e"
      values.multisigThreshold:
-        "2 of 4 (50%)"
+        "2 of 8 (25%)"
    }
```

```diff
-   Status: DELETED
    contract ValidiumL1DAValidator (0x907b30407249949521Bf0c89A43558dae200146A)
    +++ description: Contract that 'verifies' the data availability for validiums. This implementation only checks the correct formatting and does not serve as a DA oracle. Can be used by ZK stack validiums as the L1 part of a DAValidator pair.
```

```diff
    contract LensZkEvm (0xc29d04A93F893700015138E3E334eB828dAC3cef) {
    +++ description: The main contract defining the Layer 2. Operator actions like commiting blocks, providing ZK proofs and executing batches ultimately target this contract which then processes transactions. During batch execution it processes L1 --> L2 and L2 --> L1 transactions.
+++ severity: HIGH
      values.getDAValidatorPair.1:
-        "0xFa30EAe30351A83809657299F6Cad9557c232e8C"
+        "0xdA6661Df15E79cFe1e679ccD138D813b955ba492"
+++ severity: HIGH
      values.getDAValidatorPair.0:
-        "0x907b30407249949521Bf0c89A43558dae200146A"
+        "0x8f50d93B9955B285f787043B30B5F51D09bE0120"
    }
```

```diff
+   Status: CREATED
    contract AvailL1DAValidator (0x8f50d93B9955B285f787043B30B5F51D09bE0120)
    +++ description: Contract that verifies that the validiums data was made available on Avail by querying the 0x054fd961708D8E2B9c10a63F6157c74458889F0a on Ethereum for a merkle proof of inclusion.
```

## Source code changes

```diff
.../AvailL1DAValidator.sol}                        | 60 +++++++++++++++++-----
 1 file changed, 48 insertions(+), 12 deletions(-)
```

Generated with discovered.json: 0xacafbb1171690feb55b9c16a1432574a84440809

# Diff at Wed, 18 Jun 2025 12:24:52 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@a8e4f22a1441bd5040898cc3d3d62b3582942b65 block: 22593196
- current block number: 22731088

## Description

2 valis removed.

## Watched changes

```diff
    contract ValidatorTimelock (0x8c0Bfc04AdA21fd496c55B8C50331f904306F564) {
    +++ description: Intermediary contract between the *Validators* and the central diamond contract that delays block execution (ie withdrawals and other L2 --> L1 messages) by 3h.
      values.validatorsVTL.3:
-        "0x3eA4D1684C65756E892b0B8d3e331E10D9d3a484"
      values.validatorsVTL.2:
-        "0x477c1B7DC1091389CBD3Eef21Efb00081606Ab67"
      values.validatorsVTL.1:
-        "0xAaF7b278baC078AA4f9bdc8E0a93CDe604aA67d9"
+        "0x3eA4D1684C65756E892b0B8d3e331E10D9d3a484"
      values.validatorsVTL.0:
-        "0xb1a0c1F1B50436AC94B8Ce9Ae919B0e820aCb374"
+        "0x477c1B7DC1091389CBD3Eef21Efb00081606Ab67"
    }
```

```diff
    EOA  (0xAaF7b278baC078AA4f9bdc8E0a93CDe604aA67d9) {
    +++ description: None
      receivedPermissions.2:
-        {"permission":"validateZkStack","from":"ethereum:0x5C03468829A26981c410a7930bD4853622F0B2E5","role":".validatorsVTL"}
      receivedPermissions.1.from:
-        "ethereum:0x5D8ba173Dc6C3c90C8f7C04C9288BeF5FDbAd06E"
+        "ethereum:0x5C03468829A26981c410a7930bD4853622F0B2E5"
      receivedPermissions.0.from:
-        "ethereum:0x8c0Bfc04AdA21fd496c55B8C50331f904306F564"
+        "ethereum:0x5D8ba173Dc6C3c90C8f7C04C9288BeF5FDbAd06E"
    }
```

```diff
    EOA  (0xb1a0c1F1B50436AC94B8Ce9Ae919B0e820aCb374) {
    +++ description: None
      receivedPermissions.2:
-        {"permission":"validateZkStack","from":"ethereum:0x5C03468829A26981c410a7930bD4853622F0B2E5","role":".validatorsVTL"}
      receivedPermissions.1.from:
-        "ethereum:0x5D8ba173Dc6C3c90C8f7C04C9288BeF5FDbAd06E"
+        "ethereum:0x5C03468829A26981c410a7930bD4853622F0B2E5"
      receivedPermissions.0.from:
-        "ethereum:0x8c0Bfc04AdA21fd496c55B8C50331f904306F564"
+        "ethereum:0x5D8ba173Dc6C3c90C8f7C04C9288BeF5FDbAd06E"
    }
```

Generated with discovered.json: 0xdc3687fdb8096bfa96124652ef206d1ae3292e3c

# Diff at Tue, 27 May 2025 08:30:34 GMT:

- author: Michał Podsiadły (<michal.podsiadly@l2beat.com>)
- comparing to: main@fd658a9ed4bbd45fc5705d23b1906ca057d0d8b0 block: 22567731
- current block number: 22567731

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22567731 (main branch discovery), not current.

```diff
    contract LensZkEvm (0xc29d04A93F893700015138E3E334eB828dAC3cef) {
    +++ description: The main contract defining the Layer 2. Operator actions like commiting blocks, providing ZK proofs and executing batches ultimately target this contract which then processes transactions. During batch execution it processes L1 --> L2 and L2 --> L1 transactions.
      sourceHashes.4:
-        "0xc18e3ec7d4fda7be44236a2bff585089b85466b00d09a1c3a2529c604f99143b"
      sourceHashes.3:
-        "0xb3038139dce45f6c1aaedbfb1b321c230301b2d004da109b39a17d827c6b0e4f"
      sourceHashes.2:
-        "0x1f9f7cd43747f5bcf879d544be0baca967245540e70592112cdc90c360f30486"
      sourceHashes.1:
-        "0xab7812fa82c483b781aee4c2339b860fcdee4033de1e243370a77a20fc353ddc"
+        "0xc18e3ec7d4fda7be44236a2bff585089b85466b00d09a1c3a2529c604f99143b"
      sourceHashes.0:
-        "0xca793d2e01bb37722ba48f56662e8602e693d6808ed9587867c2bac43c3dec25"
+        "0xbc2380479529743c27e6ab96cdf08210319fadcbca0856cf50c6b1b54bf8437f"
    }
```

Generated with discovered.json: 0x94b91363749dce301316af98be551302f15c6e2d

# Diff at Mon, 26 May 2025 15:03:44 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@d675d0bd208eadc685b2cb489512b83f62c0890e block: 22494949
- current block number: 22567731

## Description

validators added (via validatorTimelock).

## Watched changes

```diff
    contract ValidatorTimelock (0x8c0Bfc04AdA21fd496c55B8C50331f904306F564) {
    +++ description: Intermediary contract between the *Validators* and the central diamond contract that delays block execution (ie withdrawals and other L2 --> L1 messages) by 3h.
      values.validatorsVTL.3:
+        "0x3eA4D1684C65756E892b0B8d3e331E10D9d3a484"
      values.validatorsVTL.2:
+        "0x477c1B7DC1091389CBD3Eef21Efb00081606Ab67"
    }
```

Generated with discovered.json: 0xd127ab16bf6d0c6d68f7c10d6064ffe6f88dfd43

# Diff at Fri, 23 May 2025 09:41:09 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@69cd181abbc3c830a6caf2f4429b37cae72ffdb8 block: 22494949
- current block number: 22494949

## Description

Introduced .role field on each permission, defaulting to field name on which it was defined (with '.' prefix)

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22494949 (main branch discovery), not current.

```diff
    contract Lens Multisig (0x4968A0E4b025eD7d095753E54058377969b41abC) {
    +++ description: None
      receivedPermissions.0.role:
+        ".getAdmin"
      directlyReceivedPermissions.0.role:
+        ".owner"
    }
```

```diff
    contract ValidatorTimelock3 (0x5C03468829A26981c410a7930bD4853622F0B2E5) {
    +++ description: Intermediary contract between the *Validators* and the central diamond contract that delays block execution (ie withdrawals and other L2 --> L1 messages) by 0s.
      receivedPermissions.0.role:
+        ".validators"
    }
```

```diff
    contract ValidatorTimelock2 (0x5D8ba173Dc6C3c90C8f7C04C9288BeF5FDbAd06E) {
    +++ description: Intermediary contract between the *Validators* and the central diamond contract that delays block execution (ie withdrawals and other L2 --> L1 messages) by 3h.
      receivedPermissions.0.role:
+        ".validators"
    }
```

```diff
    contract LensZkEvmAdmin (0x6bd8d33551077Ed281Cb047835a2aE4033eEc433) {
    +++ description: None
      directlyReceivedPermissions.0.role:
+        ".getAdmin"
    }
```

```diff
    contract ValidatorTimelock (0x8c0Bfc04AdA21fd496c55B8C50331f904306F564) {
    +++ description: Intermediary contract between the *Validators* and the central diamond contract that delays block execution (ie withdrawals and other L2 --> L1 messages) by 3h.
      receivedPermissions.0.role:
+        ".validators"
    }
```

```diff
    EOA  (0xAaF7b278baC078AA4f9bdc8E0a93CDe604aA67d9) {
    +++ description: None
      receivedPermissions.2.role:
+        ".validatorsVTL"
      receivedPermissions.1.role:
+        ".validatorsVTL"
      receivedPermissions.0.role:
+        ".validatorsVTL"
    }
```

```diff
    EOA  (0xb1a0c1F1B50436AC94B8Ce9Ae919B0e820aCb374) {
    +++ description: None
      receivedPermissions.2.role:
+        ".validatorsVTL"
      receivedPermissions.1.role:
+        ".validatorsVTL"
      receivedPermissions.0.role:
+        ".validatorsVTL"
    }
```

Generated with discovered.json: 0x812e2cc75c629171a0870ca69a9ed5e91c475ae6

# Diff at Fri, 16 May 2025 10:10:13 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@9912083f7b773804513e08ee765f8ba71a92980b block: 22445483
- current block number: 22494949

## Description

v27 upgrade to standard contracts.

## Watched changes

```diff
    contract LensZkEvmAdmin (0x6bd8d33551077Ed281Cb047835a2aE4033eEc433) {
    +++ description: None
+++ description: Timestamps for new protocol version upgrades can be registered here (NOT enforced)
      values.upgradeTimestamps.1:
+        {"_protocolVersion":115964116992,"_upgradeTimestamp":1747029600}
    }
```

```diff
    contract LensZkEvm (0xc29d04A93F893700015138E3E334eB828dAC3cef) {
    +++ description: The main contract defining the Layer 2. Operator actions like commiting blocks, providing ZK proofs and executing batches ultimately target this contract which then processes transactions. During batch execution it processes L1 --> L2 and L2 --> L1 transactions.
      sourceHashes.3:
-        "0xf3a1cb3dd9315b2dfa9e9aca6d6b09e987a1eb463588f115e2eb142eaa2a4ac6"
+        "0xb3038139dce45f6c1aaedbfb1b321c230301b2d004da109b39a17d827c6b0e4f"
      sourceHashes.2:
-        "0x28719e86c8042765405cbb88205d1fb130f39f3bb0923afe7fef6dd5ef798c31"
+        "0x1f9f7cd43747f5bcf879d544be0baca967245540e70592112cdc90c360f30486"
      sourceHashes.1:
-        "0x396f0e8e4bc223f186f87b7eabf2f4b537ce84f8515aa16c86400c4f10af79b1"
+        "0xab7812fa82c483b781aee4c2339b860fcdee4033de1e243370a77a20fc353ddc"
      sourceHashes.0:
-        "0x8337740067b4f9278182a83ca83d62ca2611966b8beca6e0a49394204c8f74da"
+        "0xca793d2e01bb37722ba48f56662e8602e693d6808ed9587867c2bac43c3dec25"
      values.$implementation.3:
-        "0x53d0b421BB3e522632ABEB06BB2c4eB15eaD9800"
+        "0x26b9a55DaBab9A8e74815A9D6Cd7F74AC0d7215f"
      values.$implementation.2:
-        "0x36b026c39125964D99596CE302866B5A59E4dE27"
+        "0x05DeB01AaDB6C98F8B78a1F9A81ccd68Ac4d70d4"
      values.$implementation.1:
-        "0x95C45F931946C97D10D9d6e859Fe8D62785ed3C1"
+        "0xF2C9D38D16c7A7Dc9aA4F743Fce024354d9c19B4"
      values.$implementation.0:
-        "0xEaedCF01c0B01C1a10b74cB0A2cDeF78a9540cdb"
+        "0x0A7C1b8D56BE02d9731e3A764107602f8F6dd490"
      values.$pastUpgrades.4:
+        ["2025-05-14T20:40:11.000Z","0x37a2cb789916112d5c2824569ee4f44d4078b9ab00b55017eebf83124309b54c",["0xF2C9D38D16c7A7Dc9aA4F743Fce024354d9c19B4","0x05DeB01AaDB6C98F8B78a1F9A81ccd68Ac4d70d4","0x26b9a55DaBab9A8e74815A9D6Cd7F74AC0d7215f","0x0A7C1b8D56BE02d9731e3A764107602f8F6dd490"]]
      values.$upgradeCount:
-        4
+        5
      values.facetAddresses.3:
-        "0x53d0b421BB3e522632ABEB06BB2c4eB15eaD9800"
+        "0x26b9a55DaBab9A8e74815A9D6Cd7F74AC0d7215f"
      values.facetAddresses.2:
-        "0x36b026c39125964D99596CE302866B5A59E4dE27"
+        "0x05DeB01AaDB6C98F8B78a1F9A81ccd68Ac4d70d4"
      values.facetAddresses.1:
-        "0x95C45F931946C97D10D9d6e859Fe8D62785ed3C1"
+        "0xF2C9D38D16c7A7Dc9aA4F743Fce024354d9c19B4"
      values.facetAddresses.0:
-        "0xEaedCF01c0B01C1a10b74cB0A2cDeF78a9540cdb"
+        "0x0A7C1b8D56BE02d9731e3A764107602f8F6dd490"
      values.facets.0xEaedCF01c0B01C1a10b74cB0A2cDeF78a9540cdb:
-        ["acceptAdmin()","unfreezeDiamond()","upgradeChainFromVersion(uint256,((address,uint8,bool,bytes4[])[],address,bytes))","setPorterAvailability(bool)","setTransactionFilterer(address)","setTokenMultiplier(uint128,uint128)","freezeDiamond()","genesisUpgrade(address,address,bytes,bytes[])","forwardedBridgeMint(bytes,bool)","prepareChainCommitment()","setValidator(address,bool)","setPendingAdmin(address)","setDAValidatorPair(address,address)","forwardedBridgeBurn(address,address,bytes)","changeFeeParams((uint8,uint32,uint32,uint32,uint32,uint64))","makePermanentRollup()","executeUpgrade(((address,uint8,bool,bytes4[])[],address,bytes))","forwardedBridgeRecoverFailedTransfer(uint256,bytes32,address,bytes)","setPriorityTxMaxGasLimit(uint256)","setPubdataPricingMode(uint8)"]
      values.facets.0x95C45F931946C97D10D9d6e859Fe8D62785ed3C1:
-        ["getPubdataPricingMode()","getPriorityTxMaxGasLimit()","getTotalBlocksCommitted()","getVerifierParams()","baseTokenGasPriceMultiplierDenominator()","getTransactionFilterer()","isDiamondStorageFrozen()","getProtocolVersion()","getChainId()","getBridgehub()","getTotalBlocksExecuted()","getPriorityTreeRoot()","getVerifier()","facetAddresses()","getDAValidatorPair()","getPriorityQueueSize()","getSettlementLayer()","getAdmin()","storedBlockHash(uint256)","getFirstUnprocessedPriorityTx()","facets()","getL2SystemContractsUpgradeTxHash()","isPriorityQueueActive()","getChainTypeManager()","getBaseTokenAssetId()","getBaseToken()","l2LogsRootHash(uint256)","getL2SystemContractsUpgradeBlockNumber()","getTotalPriorityTxs()","facetFunctionSelectors(address)","getTotalBlocksVerified()","storedBatchHash(uint256)","getTotalBatchesExecuted()","isEthWithdrawalFinalized(uint256,uint256)","isFacetFreezable(address)","facetAddress(bytes4)","getPendingAdmin()","getL2BootloaderBytecodeHash()","getTotalBatchesCommitted()","getL2SystemContractsUpgradeBatchNumber()","isFunctionFreezable(bytes4)","baseTokenGasPriceMultiplierNominator()","getTotalBatchesVerified()","getPriorityTreeStartIndex()","getSemverProtocolVersion()","isValidator(address)","getL2DefaultAccountBytecodeHash()"]
      values.facets.0x36b026c39125964D99596CE302866B5A59E4dE27:
-        ["proveL1ToL2TransactionStatus(bytes32,uint256,uint256,uint16,bytes32[],uint8)","bridgehubRequestL2Transaction((address,address,uint256,uint256,bytes,uint256,uint256,bytes[],address))","requestL2Transaction(address,uint256,bytes,uint256,uint256,bytes[],address)","proveL2LogInclusion(uint256,uint256,(uint8,bool,uint16,address,bytes32,bytes32),bytes32[])","finalizeEthWithdrawal(uint256,uint256,uint16,bytes,bytes32[])","proveL2LeafInclusion(uint256,uint256,bytes32,bytes32[])","l2TransactionBaseCost(uint256,uint256,uint256)","requestL2TransactionToGatewayMailbox(uint256,bytes32,uint64)","bridgehubRequestL2TransactionOnGateway(bytes32,uint64)","proveL2MessageInclusion(uint256,uint256,(uint16,address,bytes),bytes32[])"]
      values.facets.0x53d0b421BB3e522632ABEB06BB2c4eB15eaD9800:
-        ["revertBatchesSharedBridge(uint256,uint256)","proveBatchesSharedBridge(uint256,uint256,uint256,bytes)","commitBatchesSharedBridge(uint256,uint256,uint256,bytes)","executeBatchesSharedBridge(uint256,uint256,uint256,bytes)"]
      values.facets.0xF2C9D38D16c7A7Dc9aA4F743Fce024354d9c19B4:
+        ["acceptAdmin()","unfreezeDiamond()","upgradeChainFromVersion(uint256,((address,uint8,bool,bytes4[])[],address,bytes))","setPorterAvailability(bool)","setTransactionFilterer(address)","setTokenMultiplier(uint128,uint128)","freezeDiamond()","genesisUpgrade(address,address,bytes,bytes[])","forwardedBridgeMint(bytes,bool)","prepareChainCommitment()","setValidator(address,bool)","setPendingAdmin(address)","allowEvmEmulation()","setDAValidatorPair(address,address)","forwardedBridgeBurn(address,address,bytes)","changeFeeParams((uint8,uint32,uint32,uint32,uint32,uint64))","makePermanentRollup()","executeUpgrade(((address,uint8,bool,bytes4[])[],address,bytes))","forwardedBridgeRecoverFailedTransfer(uint256,bytes32,address,bytes)","setPriorityTxMaxGasLimit(uint256)","setPubdataPricingMode(uint8)"]
      values.facets.0x05DeB01AaDB6C98F8B78a1F9A81ccd68Ac4d70d4:
+        ["getPubdataPricingMode()","getPriorityTxMaxGasLimit()","getTotalBlocksCommitted()","getVerifierParams()","baseTokenGasPriceMultiplierDenominator()","getTransactionFilterer()","isDiamondStorageFrozen()","getProtocolVersion()","getChainId()","getBridgehub()","getTotalBlocksExecuted()","getPriorityTreeRoot()","getVerifier()","facetAddresses()","getDAValidatorPair()","getPriorityQueueSize()","getSettlementLayer()","getAdmin()","storedBlockHash(uint256)","getFirstUnprocessedPriorityTx()","facets()","getL2SystemContractsUpgradeTxHash()","isPriorityQueueActive()","getChainTypeManager()","getBaseTokenAssetId()","getBaseToken()","l2LogsRootHash(uint256)","getL2SystemContractsUpgradeBlockNumber()","getTotalPriorityTxs()","facetFunctionSelectors(address)","getTotalBlocksVerified()","storedBatchHash(uint256)","getTotalBatchesExecuted()","isEthWithdrawalFinalized(uint256,uint256)","isFacetFreezable(address)","facetAddress(bytes4)","getPendingAdmin()","getL2BootloaderBytecodeHash()","getTotalBatchesCommitted()","getL2EvmEmulatorBytecodeHash()","getL2SystemContractsUpgradeBatchNumber()","isFunctionFreezable(bytes4)","baseTokenGasPriceMultiplierNominator()","getTotalBatchesVerified()","getPriorityTreeStartIndex()","getSemverProtocolVersion()","isValidator(address)","getL2DefaultAccountBytecodeHash()"]
      values.facets.0x26b9a55DaBab9A8e74815A9D6Cd7F74AC0d7215f:
+        ["proveL1ToL2TransactionStatus(bytes32,uint256,uint256,uint16,bytes32[],uint8)","bridgehubRequestL2Transaction((address,address,uint256,uint256,bytes,uint256,uint256,bytes[],address))","requestL2Transaction(address,uint256,bytes,uint256,uint256,bytes[],address)","proveL2LogInclusion(uint256,uint256,(uint8,bool,uint16,address,bytes32,bytes32),bytes32[])","finalizeEthWithdrawal(uint256,uint256,uint16,bytes,bytes32[])","proveL2LeafInclusion(uint256,uint256,bytes32,bytes32[])","l2TransactionBaseCost(uint256,uint256,uint256)","requestL2TransactionToGatewayMailbox(uint256,bytes32,uint64)","requestL2ServiceTransaction(address,bytes)","bridgehubRequestL2TransactionOnGateway(bytes32,uint64)","proveL2MessageInclusion(uint256,uint256,(uint16,address,bytes),bytes32[])"]
      values.facets.0x0A7C1b8D56BE02d9731e3A764107602f8F6dd490:
+        ["revertBatchesSharedBridge(uint256,uint256)","proveBatchesSharedBridge(uint256,uint256,uint256,bytes)","commitBatchesSharedBridge(uint256,uint256,uint256,bytes)","executeBatchesSharedBridge(uint256,uint256,uint256,bytes)"]
      values.getL2BootloaderBytecodeHash:
-        "0x0100088580465d88420e6369230ee94a32ff356dbcdd407a4be49fc8009b2a81"
+        "0x0100087fe7df1cf5616646f85bd5eebc8efe5d8deac4d85bea9b9aefd88803dd"
      values.getL2DefaultAccountBytecodeHash:
-        "0x010004dbf8be36c421254d005352f8245146906919be0099e8a50d0e78df85e0"
+        "0x0100050bf9baf9d08e5d3c037f8d8b486076de7e6dceb3f3fc0989ea2c99cd67"
+++ description: Protocol version, increments with each protocol upgrade.
+++ severity: HIGH
      values.getProtocolVersion:
-        111669149696
+        115964116992
      values.getSemverProtocolVersion.0:
-        26
+        27
      values.getVerifier:
-        "0xdb3300726556AFA413A11aF474a8cFDa4D7fc5a5"
+        "0x079004D9C534Ff1dC3414F5dB31B4a0a1F4fc9d0"
      values.getL2EvmEmulatorBytecodeHash:
+        "0x01000bbb8116fe7bdf690c19740ea350375426cec23f4f1f69a12fdc58adc9ba"
      implementationNames.0xEaedCF01c0B01C1a10b74cB0A2cDeF78a9540cdb:
-        "AdminFacet"
      implementationNames.0x95C45F931946C97D10D9d6e859Fe8D62785ed3C1:
-        "GettersFacet"
      implementationNames.0x36b026c39125964D99596CE302866B5A59E4dE27:
-        "MailboxFacet"
      implementationNames.0x53d0b421BB3e522632ABEB06BB2c4eB15eaD9800:
-        "ExecutorFacet"
      implementationNames.0xF2C9D38D16c7A7Dc9aA4F743Fce024354d9c19B4:
+        "AdminFacet"
      implementationNames.0x05DeB01AaDB6C98F8B78a1F9A81ccd68Ac4d70d4:
+        "GettersFacet"
      implementationNames.0x26b9a55DaBab9A8e74815A9D6Cd7F74AC0d7215f:
+        "MailboxFacet"
      implementationNames.0x0A7C1b8D56BE02d9731e3A764107602f8F6dd490:
+        "ExecutorFacet"
    }
```

```diff
-   Status: DELETED
    contract Verifier (0xdb3300726556AFA413A11aF474a8cFDa4D7fc5a5)
    +++ description: Implements the ZK proof verification logic.
```

```diff
+   Status: CREATED
    contract DualVerifier (0x079004D9C534Ff1dC3414F5dB31B4a0a1F4fc9d0)
    +++ description: A router contract for verifiers. Routes verification requests to 0x1F517f2bAb178AdD6e282297a4728bcc50E9F6CF or 0xAd36FFc4066855aeF3Bdf6BF03cA427bb084636e depending on the supplied proof type.
```

```diff
+   Status: CREATED
    contract L1VerifierFflonk (0x1F517f2bAb178AdD6e282297a4728bcc50E9F6CF)
    +++ description: Verifies a zk-SNARK proof using an implementation of the fflonk proof system.
```

```diff
+   Status: CREATED
    contract L1VerifierPlonk (0xAd36FFc4066855aeF3Bdf6BF03cA427bb084636e)
    +++ description: Verifies a zk-SNARK proof using an implementation of the PlonK proof system.
```

## Source code changes

```diff
.../projects/lens/ethereum/.flat/DualVerifier.sol  |   97 ++
 .../lens/ethereum/.flat/L1VerifierFflonk.sol       | 1605 ++++++++++++++++++++
 .../Verifier.sol => .flat/L1VerifierPlonk.sol}     |   12 +-
 .../LensZkEvm/AdminFacet.1.sol                     |   37 +-
 .../LensZkEvm/ExecutorFacet.4.sol                  |   82 +-
 .../LensZkEvm/GettersFacet.2.sol                   |   27 +-
 .../LensZkEvm/MailboxFacet.3.sol                   |   74 +-
 7 files changed, 1885 insertions(+), 49 deletions(-)
```

Generated with discovered.json: 0xeb5f737fbe1bb575b19595a6b1d471ae9f805322

# Diff at Fri, 09 May 2025 11:15:27 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@b9a3516de49f42efd9d26f04918d74a8d92c6204 block: 22223308
- current block number: 22445483

## Description

New Lens owner MS.

## Watched changes

```diff
    contract LensZkEvmAdmin (0x6bd8d33551077Ed281Cb047835a2aE4033eEc433) {
    +++ description: None
      values.owner:
-        "0xca2938BdD6Bcf5860f7176fA092b0ac9510f09A3"
+        "0x4968A0E4b025eD7d095753E54058377969b41abC"
    }
```

```diff
+   Status: CREATED
    contract Lens Multisig (0x4968A0E4b025eD7d095753E54058377969b41abC)
    +++ description: None
```

## Source code changes

```diff
.../lens/ethereum/.flat/Lens Multisig/Safe.sol     | 1088 ++++++++++++++++++++
 .../ethereum/.flat/Lens Multisig/SafeProxy.p.sol   |   37 +
 2 files changed, 1125 insertions(+)
```

Generated with discovered.json: 0xf7abe7973875970361b76f33c7d230372f91933c

# Diff at Tue, 29 Apr 2025 08:19:17 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@ef7477af00fe0b57a2f7cacf7e958c12494af662 block: 22223308
- current block number: 22223308

## Description

Field .issuedPermissions is removed from the output as no longer needed. Added 'permissionsConfigHash' due to refactoring of the modelling process (into a separate command).

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22223308 (main branch discovery), not current.

```diff
    contract ValidatorTimelock3 (0x5C03468829A26981c410a7930bD4853622F0B2E5) {
    +++ description: Intermediary contract between the *Validators* and the central diamond contract that delays block execution (ie withdrawals and other L2 --> L1 messages) by 0s.
      issuedPermissions:
-        [{"permission":"validateZkStack","to":"0xAaF7b278baC078AA4f9bdc8E0a93CDe604aA67d9","via":[]},{"permission":"validateZkStack","to":"0xb1a0c1F1B50436AC94B8Ce9Ae919B0e820aCb374","via":[]}]
    }
```

```diff
    contract ValidatorTimelock2 (0x5D8ba173Dc6C3c90C8f7C04C9288BeF5FDbAd06E) {
    +++ description: Intermediary contract between the *Validators* and the central diamond contract that delays block execution (ie withdrawals and other L2 --> L1 messages) by 3h.
      issuedPermissions:
-        [{"permission":"validateZkStack","to":"0xAaF7b278baC078AA4f9bdc8E0a93CDe604aA67d9","via":[]},{"permission":"validateZkStack","to":"0xb1a0c1F1B50436AC94B8Ce9Ae919B0e820aCb374","via":[]}]
    }
```

```diff
    contract ValidatorTimelock (0x8c0Bfc04AdA21fd496c55B8C50331f904306F564) {
    +++ description: Intermediary contract between the *Validators* and the central diamond contract that delays block execution (ie withdrawals and other L2 --> L1 messages) by 3h.
      issuedPermissions:
-        [{"permission":"validateZkStack","to":"0xAaF7b278baC078AA4f9bdc8E0a93CDe604aA67d9","via":[]},{"permission":"validateZkStack","to":"0xb1a0c1F1B50436AC94B8Ce9Ae919B0e820aCb374","via":[]}]
    }
```

```diff
    contract LensZkEvm (0xc29d04A93F893700015138E3E334eB828dAC3cef) {
    +++ description: The main contract defining the Layer 2. Operator actions like commiting blocks, providing ZK proofs and executing batches ultimately target this contract which then processes transactions. During batch execution it processes L1 --> L2 and L2 --> L1 transactions.
      issuedPermissions:
-        [{"permission":"interact","to":"0x5C03468829A26981c410a7930bD4853622F0B2E5","description":"commit, prove, execute, revert batches directly in the main Diamond contract. This role is typically held by a proxying ValidatorTimelock.","via":[]},{"permission":"interact","to":"0x5D8ba173Dc6C3c90C8f7C04C9288BeF5FDbAd06E","description":"commit, prove, execute, revert batches directly in the main Diamond contract. This role is typically held by a proxying ValidatorTimelock.","via":[]},{"permission":"interact","to":"0x8c0Bfc04AdA21fd496c55B8C50331f904306F564","description":"commit, prove, execute, revert batches directly in the main Diamond contract. This role is typically held by a proxying ValidatorTimelock.","via":[]},{"permission":"interact","to":"0xca2938BdD6Bcf5860f7176fA092b0ac9510f09A3","description":"manage fees, apply predefined upgrades, manage censorship through a TransactionFilterer, set DA mode, migrate the chain to whitelisted settlement layers (Chain Admin role).","via":[{"address":"0x6bd8d33551077Ed281Cb047835a2aE4033eEc433"}]}]
    }
```

Generated with discovered.json: 0x8a8ad097205bf9cdf04476dfa16ba8a59a1a3a7c

# Diff at Tue, 08 Apr 2025 09:32:43 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- current block number: 22223308

## Description

Initial discovery of a standard ZK stack validium.

## Initial discovery

```diff
+   Status: CREATED
    contract ValidatorTimelock3 (0x5C03468829A26981c410a7930bD4853622F0B2E5)
    +++ description: Intermediary contract between the *Validators* and the central diamond contract that delays block execution (ie withdrawals and other L2 --> L1 messages) by 0s.
```

```diff
+   Status: CREATED
    contract ValidatorTimelock2 (0x5D8ba173Dc6C3c90C8f7C04C9288BeF5FDbAd06E)
    +++ description: Intermediary contract between the *Validators* and the central diamond contract that delays block execution (ie withdrawals and other L2 --> L1 messages) by 3h.
```

```diff
+   Status: CREATED
    contract LensZkEvmAdmin (0x6bd8d33551077Ed281Cb047835a2aE4033eEc433)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ValidatorTimelock (0x8c0Bfc04AdA21fd496c55B8C50331f904306F564)
    +++ description: Intermediary contract between the *Validators* and the central diamond contract that delays block execution (ie withdrawals and other L2 --> L1 messages) by 3h.
```

```diff
+   Status: CREATED
    contract ValidiumL1DAValidator (0x907b30407249949521Bf0c89A43558dae200146A)
    +++ description: Contract that 'verifies' the data availability for validiums. This implementation only checks the correct formatting and does not serve as a DA oracle. Can be used by ZK stack validiums as the L1 part of a DAValidator pair.
```

```diff
+   Status: CREATED
    contract LensZkEvm (0xc29d04A93F893700015138E3E334eB828dAC3cef)
    +++ description: The main contract defining the Layer 2. Operator actions like commiting blocks, providing ZK proofs and executing batches ultimately target this contract which then processes transactions. During batch execution it processes L1 --> L2 and L2 --> L1 transactions.
```

```diff
+   Status: CREATED
    contract Verifier (0xdb3300726556AFA413A11aF474a8cFDa4D7fc5a5)
    +++ description: Implements the ZK proof verification logic.
```

```diff
+   Status: CREATED
    contract L1USDCBridge (0xf553E6D903AA43420ED7e3bc2313bE9286A8F987)
    +++ description: None
```
