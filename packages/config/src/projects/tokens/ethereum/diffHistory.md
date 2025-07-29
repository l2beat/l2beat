Generated with discovered.json: 0x76fe12f3b1e3403318e47cdb3211fbc918cf9ef0

# Diff at Mon, 28 Jul 2025 07:26:43 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@8e540d8d4e2ea097e63a067c52194d1bf06f9b4a block: 22889418
- current block number: 23016120

## Description

ms member change.

## Watched changes

```diff
    contract GnosisSafe (0xB18BB767638Bca324d158B7C7189e1a28aeB9EB4) {
    +++ description: None
      values.$members.0:
+        "eth:0x8e814672F5c559b15af2975fBf6Fab819A4B7Dd5"
      values.$members.1:
+        "eth:0x804d60CB1ade94511f7915A2062948685Ca8C81f"
      values.$members.0:
-        "eth:0xCe958D997F4a5824D4d503A128216322C6C223a0"
+        "eth:0xaDB26E60FA6e326B9Ee444D886B4B62EC7FA38fc"
      values.$threshold:
-        2
+        3
      values.multisigThreshold:
-        "2 of 4 (50%)"
+        "3 of 6 (50%)"
    }
```

Generated with discovered.json: 0xc28ce96dc626654ed2956b59a46dc3739b478e1b

# Diff at Mon, 14 Jul 2025 12:46:38 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@9f4300dad2f3d080cd56fa311d4a848556c74e72 block: 22889418
- current block number: 22889418

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22889418 (main branch discovery), not current.

```diff
    EOA  (0x0000000000000000000000000000000000000001) {
    +++ description: None
      address:
-        "0x0000000000000000000000000000000000000001"
+        "eth:0x0000000000000000000000000000000000000001"
    }
```

```diff
    contract DepositContract (0x00000000219ab540356cBB839Cbe05303d7705Fa) {
    +++ description: Ethereum Beacon Chain deposit contract.
      address:
-        "0x00000000219ab540356cBB839Cbe05303d7705Fa"
+        "eth:0x00000000219ab540356cBB839Cbe05303d7705Fa"
      implementationNames.0x00000000219ab540356cBB839Cbe05303d7705Fa:
-        "DepositContract"
      implementationNames.eth:0x00000000219ab540356cBB839Cbe05303d7705Fa:
+        "DepositContract"
    }
```

```diff
    EOA  (0x007DE4a5F7bc37E2F26c0cb2E8A95006EE9B89b5) {
    +++ description: None
      address:
-        "0x007DE4a5F7bc37E2F26c0cb2E8A95006EE9B89b5"
+        "eth:0x007DE4a5F7bc37E2F26c0cb2E8A95006EE9B89b5"
    }
```

```diff
    EOA  (0x01781c80785a679337De8c3df691cd5D15D36A6b) {
    +++ description: None
      address:
-        "0x01781c80785a679337De8c3df691cd5D15D36A6b"
+        "eth:0x01781c80785a679337De8c3df691cd5D15D36A6b"
    }
```

```diff
    EOA  (0x04D5b12b196a8CADEB2F476F22Ffb1334Ef9F94c) {
    +++ description: None
      address:
-        "0x04D5b12b196a8CADEB2F476F22Ffb1334Ef9F94c"
+        "eth:0x04D5b12b196a8CADEB2F476F22Ffb1334Ef9F94c"
    }
```

```diff
    EOA  (0x05824ab74d7D39BeeE6785e23D51De7bFA8967D6) {
    +++ description: None
      address:
-        "0x05824ab74d7D39BeeE6785e23D51De7bFA8967D6"
+        "eth:0x05824ab74d7D39BeeE6785e23D51De7bFA8967D6"
    }
```

```diff
    contract SimpleMultiSig (0x0644Bd0248d5F89e4F6E845a91D15c23591e5D33) {
    +++ description: None
      address:
-        "0x0644Bd0248d5F89e4F6E845a91D15c23591e5D33"
+        "eth:0x0644Bd0248d5F89e4F6E845a91D15c23591e5D33"
      values.$members.0:
-        "0x01781c80785a679337De8c3df691cd5D15D36A6b"
+        "eth:0x01781c80785a679337De8c3df691cd5D15D36A6b"
      values.$members.1:
-        "0x2a7B42C764F31Ae54a3453e9aa6C2D1c67E9Ef9d"
+        "eth:0x2a7B42C764F31Ae54a3453e9aa6C2D1c67E9Ef9d"
      values.$members.2:
-        "0x3bA2a97E12Cf715F60C9dBBED5105733B3A8Cf27"
+        "eth:0x3bA2a97E12Cf715F60C9dBBED5105733B3A8Cf27"
      values.$members.3:
-        "0x3Ec49d8Bef9746d7cf10D26c91526E9C1e9341D9"
+        "eth:0x3Ec49d8Bef9746d7cf10D26c91526E9C1e9341D9"
      values.$members.4:
-        "0x3eDD0d6562e9321Fb4a95e52576eE7f0b5Aa017e"
+        "eth:0x3eDD0d6562e9321Fb4a95e52576eE7f0b5Aa017e"
      values.$members.5:
-        "0x44375aaE18B34bdF5c2C485DbAc932aB4D7D454f"
+        "eth:0x44375aaE18B34bdF5c2C485DbAc932aB4D7D454f"
      values.$members.6:
-        "0x4A49e050156d76590Ed9f12B06673E8C431754d1"
+        "eth:0x4A49e050156d76590Ed9f12B06673E8C431754d1"
      values.$members.7:
-        "0x5bcc4b324bFD0F5D7F0e9167beBe0456BE342686"
+        "eth:0x5bcc4b324bFD0F5D7F0e9167beBe0456BE342686"
      values.$members.8:
-        "0x5d21C8C9dD0692bdEb7AC1A3fB24DFC3500E4c3e"
+        "eth:0x5d21C8C9dD0692bdEb7AC1A3fB24DFC3500E4c3e"
      values.$members.9:
-        "0x61efB23a6868a74A8DFE32651361a6165F6f173E"
+        "eth:0x61efB23a6868a74A8DFE32651361a6165F6f173E"
      values.$members.10:
-        "0x68B807482ffe50050a444f6610dE2F009e7CF760"
+        "eth:0x68B807482ffe50050a444f6610dE2F009e7CF760"
      values.$members.11:
-        "0x795bF46361495271F39fdBb0AbCC263C8e5fB538"
+        "eth:0x795bF46361495271F39fdBb0AbCC263C8e5fB538"
      values.$members.12:
-        "0x8CACd1De50937b16d11B5ba11A6efeEd7e561336"
+        "eth:0x8CACd1De50937b16d11B5ba11A6efeEd7e561336"
      values.$members.13:
-        "0x8D0f7E545B4545c7Fe06B489D93E4DA1B96dF296"
+        "eth:0x8D0f7E545B4545c7Fe06B489D93E4DA1B96dF296"
      values.$members.14:
-        "0x99E55F86526e2aA2Abf63A7A562a46cE3bd3F8c3"
+        "eth:0x99E55F86526e2aA2Abf63A7A562a46cE3bd3F8c3"
      values.$members.15:
-        "0x9fCE35e475Fdd84DB06eEc4cbE65028d6F9C9d01"
+        "eth:0x9fCE35e475Fdd84DB06eEc4cbE65028d6F9C9d01"
      values.$members.16:
-        "0xAad13BdEeC1F6e787b95F322eBb063bae5F1641a"
+        "eth:0xAad13BdEeC1F6e787b95F322eBb063bae5F1641a"
      values.$members.17:
-        "0xb08B382f09029AB7cE3CD486540aed0ed62680E3"
+        "eth:0xb08B382f09029AB7cE3CD486540aed0ed62680E3"
      values.$members.18:
-        "0xbbe25013fF925463aa6FAc0Cd90f5cf10fd4F442"
+        "eth:0xbbe25013fF925463aa6FAc0Cd90f5cf10fd4F442"
      values.$members.19:
-        "0xC271e7e7EB9dEb8831C1d6e728BB7677cd0e8009"
+        "eth:0xC271e7e7EB9dEb8831C1d6e728BB7677cd0e8009"
      implementationNames.0x0644Bd0248d5F89e4F6E845a91D15c23591e5D33:
-        "SimpleMultiSig"
      implementationNames.eth:0x0644Bd0248d5F89e4F6E845a91D15c23591e5D33:
+        "SimpleMultiSig"
    }
```

```diff
    EOA  (0x0762bCc4D604Aa3B5122C7D6571Cf5368EF3F09c) {
    +++ description: None
      address:
-        "0x0762bCc4D604Aa3B5122C7D6571Cf5368EF3F09c"
+        "eth:0x0762bCc4D604Aa3B5122C7D6571Cf5368EF3F09c"
    }
```

```diff
    contract ValidatorsExitBusOracle (0x0De4Ea0184c2ad0BacA7183356Aea5B8d5Bf5c6e) {
    +++ description: None
      address:
-        "0x0De4Ea0184c2ad0BacA7183356Aea5B8d5Bf5c6e"
+        "eth:0x0De4Ea0184c2ad0BacA7183356Aea5B8d5Bf5c6e"
      values.$admin:
-        "0x3e40D73EB977Dc6a537aF587D48316feE66E9C8c"
+        "eth:0x3e40D73EB977Dc6a537aF587D48316feE66E9C8c"
      values.$implementation:
-        "0xA89Ea51FddE660f67d1850e03C9c9862d33Bc42c"
+        "eth:0xA89Ea51FddE660f67d1850e03C9c9862d33Bc42c"
      values.$pastUpgrades.0.2.0:
-        "0x6F6541C2203196fEeDd14CD2C09550dA1CbEDa31"
+        "eth:0x6F6541C2203196fEeDd14CD2C09550dA1CbEDa31"
      values.$pastUpgrades.1.2.0:
-        "0xA89Ea51FddE660f67d1850e03C9c9862d33Bc42c"
+        "eth:0xA89Ea51FddE660f67d1850e03C9c9862d33Bc42c"
      values.getConsensusContract:
-        "0x7FaDB6358950c5fAA66Cb5EB8eE5147De3df355a"
+        "eth:0x7FaDB6358950c5fAA66Cb5EB8eE5147De3df355a"
      values.proxy__getAdmin:
-        "0x3e40D73EB977Dc6a537aF587D48316feE66E9C8c"
+        "eth:0x3e40D73EB977Dc6a537aF587D48316feE66E9C8c"
      values.proxy__getImplementation:
-        "0xA89Ea51FddE660f67d1850e03C9c9862d33Bc42c"
+        "eth:0xA89Ea51FddE660f67d1850e03C9c9862d33Bc42c"
      implementationNames.0x0De4Ea0184c2ad0BacA7183356Aea5B8d5Bf5c6e:
-        "OssifiableProxy"
      implementationNames.0xA89Ea51FddE660f67d1850e03C9c9862d33Bc42c:
-        "ValidatorsExitBusOracle"
      implementationNames.eth:0x0De4Ea0184c2ad0BacA7183356Aea5B8d5Bf5c6e:
+        "OssifiableProxy"
      implementationNames.eth:0xA89Ea51FddE660f67d1850e03C9c9862d33Bc42c:
+        "ValidatorsExitBusOracle"
    }
```

```diff
    EOA  (0x0f16C1250f2AedA677e2Ca97EF167B45735Bf282) {
    +++ description: None
      address:
-        "0x0f16C1250f2AedA677e2Ca97EF167B45735Bf282"
+        "eth:0x0f16C1250f2AedA677e2Ca97EF167B45735Bf282"
    }
```

```diff
    EOA  (0x10277B1922e56d1B69f4dCe5A35696C791F78cac) {
    +++ description: None
      address:
-        "0x10277B1922e56d1B69f4dCe5A35696C791F78cac"
+        "eth:0x10277B1922e56d1B69f4dCe5A35696C791F78cac"
    }
```

```diff
    contract SimpleMultiSig (0x137Dcd97872dE27a4d3bf36A4643c5e18FA40713) {
    +++ description: None
      address:
-        "0x137Dcd97872dE27a4d3bf36A4643c5e18FA40713"
+        "eth:0x137Dcd97872dE27a4d3bf36A4643c5e18FA40713"
      values.$members.0:
-        "0x05824ab74d7D39BeeE6785e23D51De7bFA8967D6"
+        "eth:0x05824ab74d7D39BeeE6785e23D51De7bFA8967D6"
      values.$members.1:
-        "0x0f16C1250f2AedA677e2Ca97EF167B45735Bf282"
+        "eth:0x0f16C1250f2AedA677e2Ca97EF167B45735Bf282"
      values.$members.2:
-        "0x1f14112c418fAAe416101E58CdFBa3aF67Ea70Eb"
+        "eth:0x1f14112c418fAAe416101E58CdFBa3aF67Ea70Eb"
      values.$members.3:
-        "0x3D7163C791951A55fEa279B6CA3e6c05f5e5F876"
+        "eth:0x3D7163C791951A55fEa279B6CA3e6c05f5e5F876"
      values.$members.4:
-        "0x44f802506dd40405f640eE30cE13304c1Ce6A2bD"
+        "eth:0x44f802506dd40405f640eE30cE13304c1Ce6A2bD"
      values.$members.5:
-        "0x45b516231db24D03479a1fEBaA57Bcb58Cd79696"
+        "eth:0x45b516231db24D03479a1fEBaA57Bcb58Cd79696"
      values.$members.6:
-        "0x472481219B0f19B3a9e6875094deAaE8f793070B"
+        "eth:0x472481219B0f19B3a9e6875094deAaE8f793070B"
      values.$members.7:
-        "0x505f07E9a14028dBd7c72904248a8d6506961921"
+        "eth:0x505f07E9a14028dBd7c72904248a8d6506961921"
      values.$members.8:
-        "0x76da59EeB0A6258F82B26f78CDD73f6f8627a078"
+        "eth:0x76da59EeB0A6258F82B26f78CDD73f6f8627a078"
      values.$members.9:
-        "0x9a396Cb5b589357C887549cbEaE54E445A7F8114"
+        "eth:0x9a396Cb5b589357C887549cbEaE54E445A7F8114"
      values.$members.10:
-        "0x9BC2b8BBFC50f5Ec19bCe90627b45b4f1Fe435BA"
+        "eth:0x9BC2b8BBFC50f5Ec19bCe90627b45b4f1Fe435BA"
      values.$members.11:
-        "0x9D39a8623e6093c074Dac0E9f2aF330D82E5645f"
+        "eth:0x9D39a8623e6093c074Dac0E9f2aF330D82E5645f"
      values.$members.12:
-        "0xaE9cf54119fE761A4d84d5D839b715F75ccf2786"
+        "eth:0xaE9cf54119fE761A4d84d5D839b715F75ccf2786"
      values.$members.13:
-        "0xb04f132aDA70B39F6fBbA6f4Dd37E80Ce6058D83"
+        "eth:0xb04f132aDA70B39F6fBbA6f4Dd37E80Ce6058D83"
      values.$members.14:
-        "0xbEc5fd85dc949D9F38dCFF6D48613e0Fcf873A96"
+        "eth:0xbEc5fd85dc949D9F38dCFF6D48613e0Fcf873A96"
      values.$members.15:
-        "0xD55F7d21e8057631a6A88A7FDdF82EeDB2C14e26"
+        "eth:0xD55F7d21e8057631a6A88A7FDdF82EeDB2C14e26"
      values.$members.16:
-        "0xdd8fee09281D42F26e537e208c81772cB7FE16AD"
+        "eth:0xdd8fee09281D42F26e537e208c81772cB7FE16AD"
      values.$members.17:
-        "0xDe27666796568984C40cD4A3630396B1570816B5"
+        "eth:0xDe27666796568984C40cD4A3630396B1570816B5"
      values.$members.18:
-        "0xE8F167Ad63F0Ca84C41afcf7E7C8BA7c7482cb95"
+        "eth:0xE8F167Ad63F0Ca84C41afcf7E7C8BA7c7482cb95"
      values.$members.19:
-        "0xefB3Bed7dee14059C35c34CF289C46Ae0811654e"
+        "eth:0xefB3Bed7dee14059C35c34CF289C46Ae0811654e"
      implementationNames.0x137Dcd97872dE27a4d3bf36A4643c5e18FA40713:
-        "SimpleMultiSig"
      implementationNames.eth:0x137Dcd97872dE27a4d3bf36A4643c5e18FA40713:
+        "SimpleMultiSig"
    }
```

```diff
    EOA  (0x14D5d5B71E048d2D75a39FfC5B407e3a3AB6F314) {
    +++ description: None
      address:
-        "0x14D5d5B71E048d2D75a39FfC5B407e3a3AB6F314"
+        "eth:0x14D5d5B71E048d2D75a39FfC5B407e3a3AB6F314"
    }
```

```diff
    EOA  (0x1652f3fb11331fD9f5e37052C1AD507DA0371052) {
    +++ description: None
      address:
-        "0x1652f3fb11331fD9f5e37052C1AD507DA0371052"
+        "eth:0x1652f3fb11331fD9f5e37052C1AD507DA0371052"
    }
```

```diff
    EOA  (0x16aB869E6dEe6eF9068E5cF75C1a5A57981257CD) {
    +++ description: None
      address:
-        "0x16aB869E6dEe6eF9068E5cF75C1a5A57981257CD"
+        "eth:0x16aB869E6dEe6eF9068E5cF75C1a5A57981257CD"
    }
```

```diff
    EOA  (0x198839340407E6aEaCe31527b76B3bD76769a60A) {
    +++ description: None
      address:
-        "0x198839340407E6aEaCe31527b76B3bD76769a60A"
+        "eth:0x198839340407E6aEaCe31527b76B3bD76769a60A"
    }
```

```diff
    EOA  (0x1E65CB2bD3A119eA78959Dc1858E7b94AA818451) {
    +++ description: None
      address:
-        "0x1E65CB2bD3A119eA78959Dc1858E7b94AA818451"
+        "eth:0x1E65CB2bD3A119eA78959Dc1858E7b94AA818451"
    }
```

```diff
    EOA  (0x1f14112c418fAAe416101E58CdFBa3aF67Ea70Eb) {
    +++ description: None
      address:
-        "0x1f14112c418fAAe416101E58CdFBa3aF67Ea70Eb"
+        "eth:0x1f14112c418fAAe416101E58CdFBa3aF67Ea70Eb"
    }
```

```diff
    EOA  (0x285f8537e1dAeEdaf617e96C742F2Cf36d63CcfB) {
    +++ description: None
      address:
-        "0x285f8537e1dAeEdaf617e96C742F2Cf36d63CcfB"
+        "eth:0x285f8537e1dAeEdaf617e96C742F2Cf36d63CcfB"
    }
```

```diff
    EOA  (0x2914767E232FD7708ab06bA60dB16c36C555751d) {
    +++ description: None
      address:
-        "0x2914767E232FD7708ab06bA60dB16c36C555751d"
+        "eth:0x2914767E232FD7708ab06bA60dB16c36C555751d"
    }
```

```diff
    EOA  (0x294ED1f214F4e0ecAE31C3Eae4F04EBB3b36C9d0) {
    +++ description: None
      address:
-        "0x294ED1f214F4e0ecAE31C3Eae4F04EBB3b36C9d0"
+        "eth:0x294ED1f214F4e0ecAE31C3Eae4F04EBB3b36C9d0"
    }
```

```diff
    EOA  (0x2a7B42C764F31Ae54a3453e9aa6C2D1c67E9Ef9d) {
    +++ description: None
      address:
-        "0x2a7B42C764F31Ae54a3453e9aa6C2D1c67E9Ef9d"
+        "eth:0x2a7B42C764F31Ae54a3453e9aa6C2D1c67E9Ef9d"
    }
```

```diff
    EOA  (0x2F11E51CAe96DCA0332e44c41B80b05BD8a41105) {
    +++ description: None
      address:
-        "0x2F11E51CAe96DCA0332e44c41B80b05BD8a41105"
+        "eth:0x2F11E51CAe96DCA0332e44c41B80b05BD8a41105"
    }
```

```diff
    EOA  (0x2fb074FA59c9294c71246825C1c9A0c7782d41a4) {
    +++ description: None
      address:
-        "0x2fb074FA59c9294c71246825C1c9A0c7782d41a4"
+        "eth:0x2fb074FA59c9294c71246825C1c9A0c7782d41a4"
    }
```

```diff
    contract SimpleMultiSig (0x38699d04656fF537ef8671b6b595402ebDBdf6f4) {
    +++ description: None
      address:
-        "0x38699d04656fF537ef8671b6b595402ebDBdf6f4"
+        "eth:0x38699d04656fF537ef8671b6b595402ebDBdf6f4"
      values.$members.0:
-        "0x1652f3fb11331fD9f5e37052C1AD507DA0371052"
+        "eth:0x1652f3fb11331fD9f5e37052C1AD507DA0371052"
      values.$members.1:
-        "0x198839340407E6aEaCe31527b76B3bD76769a60A"
+        "eth:0x198839340407E6aEaCe31527b76B3bD76769a60A"
      values.$members.2:
-        "0x1E65CB2bD3A119eA78959Dc1858E7b94AA818451"
+        "eth:0x1E65CB2bD3A119eA78959Dc1858E7b94AA818451"
      values.$members.3:
-        "0x2F11E51CAe96DCA0332e44c41B80b05BD8a41105"
+        "eth:0x2F11E51CAe96DCA0332e44c41B80b05BD8a41105"
      values.$members.4:
-        "0x38AF28F88C8f7eb083630179E6647052b0e959f1"
+        "eth:0x38AF28F88C8f7eb083630179E6647052b0e959f1"
      values.$members.5:
-        "0x46E38dAA42aD10d333118D76A56068d0f25FB217"
+        "eth:0x46E38dAA42aD10d333118D76A56068d0f25FB217"
      values.$members.6:
-        "0x4C086857faED97b5e8bAcc81Cf41b523D4E0386B"
+        "eth:0x4C086857faED97b5e8bAcc81Cf41b523D4E0386B"
      values.$members.7:
-        "0x619060F79Bef3bdBA987eb0697BeD5ADDdD9e55D"
+        "eth:0x619060F79Bef3bdBA987eb0697BeD5ADDdD9e55D"
      values.$members.8:
-        "0x6D39f61703333D3E0D533be3B76161beCc96d861"
+        "eth:0x6D39f61703333D3E0D533be3B76161beCc96d861"
      values.$members.9:
-        "0x7D70b773374AB8F07d60a05f833f7039beB7406d"
+        "eth:0x7D70b773374AB8F07d60a05f833f7039beB7406d"
      values.$members.10:
-        "0x7F3e4A8Cf64aa13DaD152D9a506c84f86488C74C"
+        "eth:0x7F3e4A8Cf64aa13DaD152D9a506c84f86488C74C"
      values.$members.11:
-        "0x8cEE90e941778a3C56Ac075C4826C8C01b9e8B2B"
+        "eth:0x8cEE90e941778a3C56Ac075C4826C8C01b9e8B2B"
      values.$members.12:
-        "0xA32328DE1247d04CB929408D7e5cC8AcC33f48Cd"
+        "eth:0xA32328DE1247d04CB929408D7e5cC8AcC33f48Cd"
      values.$members.13:
-        "0xAeb500D8EE2a0322CcE35233819e8D6bEA5c8c42"
+        "eth:0xAeb500D8EE2a0322CcE35233819e8D6bEA5c8c42"
      values.$members.14:
-        "0xc8e590C88f1F4bC59353b400f0c0D1024288438C"
+        "eth:0xc8e590C88f1F4bC59353b400f0c0D1024288438C"
      values.$members.15:
-        "0xcC9F578fA52beD1EeB8a8B78A8c3D14dF8f6e087"
+        "eth:0xcC9F578fA52beD1EeB8a8B78A8c3D14dF8f6e087"
      values.$members.16:
-        "0xCe160F39Cb0ac01b7Ca755027827e8853b217086"
+        "eth:0xCe160F39Cb0ac01b7Ca755027827e8853b217086"
      values.$members.17:
-        "0xD5353842ac6d8aC6e3E8fb1d0Cd7B27fE3d67c74"
+        "eth:0xD5353842ac6d8aC6e3E8fb1d0Cd7B27fE3d67c74"
      values.$members.18:
-        "0xe41eAFB2746cb2Ac8A88eD8310e38501D7886330"
+        "eth:0xe41eAFB2746cb2Ac8A88eD8310e38501D7886330"
      values.$members.19:
-        "0xea835d74f32BAfb03d59040bB67CC028ce1E6c31"
+        "eth:0xea835d74f32BAfb03d59040bB67CC028ce1E6c31"
      implementationNames.0x38699d04656fF537ef8671b6b595402ebDBdf6f4:
-        "SimpleMultiSig"
      implementationNames.eth:0x38699d04656fF537ef8671b6b595402ebDBdf6f4:
+        "SimpleMultiSig"
    }
```

```diff
    contract LidoExecutionLayerRewardsVault (0x388C818CA8B9251b393131C08a736A67ccB19297) {
    +++ description: None
      address:
-        "0x388C818CA8B9251b393131C08a736A67ccB19297"
+        "eth:0x388C818CA8B9251b393131C08a736A67ccB19297"
      values.LIDO:
-        "0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84"
+        "eth:0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84"
      values.TREASURY:
-        "0x3e40D73EB977Dc6a537aF587D48316feE66E9C8c"
+        "eth:0x3e40D73EB977Dc6a537aF587D48316feE66E9C8c"
      implementationNames.0x388C818CA8B9251b393131C08a736A67ccB19297:
-        "LidoExecutionLayerRewardsVault"
      implementationNames.eth:0x388C818CA8B9251b393131C08a736A67ccB19297:
+        "LidoExecutionLayerRewardsVault"
    }
```

```diff
    EOA  (0x38AF28F88C8f7eb083630179E6647052b0e959f1) {
    +++ description: None
      address:
-        "0x38AF28F88C8f7eb083630179E6647052b0e959f1"
+        "eth:0x38AF28F88C8f7eb083630179E6647052b0e959f1"
    }
```

```diff
    EOA  (0x3bA2a97E12Cf715F60C9dBBED5105733B3A8Cf27) {
    +++ description: None
      address:
-        "0x3bA2a97E12Cf715F60C9dBBED5105733B3A8Cf27"
+        "eth:0x3bA2a97E12Cf715F60C9dBBED5105733B3A8Cf27"
    }
```

```diff
    contract CSEarlyAdoption (0x3D5148ad93e2ae5DedD1f7A8B3C19E7F67F90c0E) {
    +++ description: None
      address:
-        "0x3D5148ad93e2ae5DedD1f7A8B3C19E7F67F90c0E"
+        "eth:0x3D5148ad93e2ae5DedD1f7A8B3C19E7F67F90c0E"
      values.MODULE:
-        "0xdA7dE2ECdDfccC6c3AF10108Db212ACBBf9EA83F"
+        "eth:0xdA7dE2ECdDfccC6c3AF10108Db212ACBBf9EA83F"
      implementationNames.0x3D5148ad93e2ae5DedD1f7A8B3C19E7F67F90c0E:
-        "CSEarlyAdoption"
      implementationNames.eth:0x3D5148ad93e2ae5DedD1f7A8B3C19E7F67F90c0E:
+        "CSEarlyAdoption"
    }
```

```diff
    EOA  (0x3D7163C791951A55fEa279B6CA3e6c05f5e5F876) {
    +++ description: None
      address:
-        "0x3D7163C791951A55fEa279B6CA3e6c05f5e5F876"
+        "eth:0x3D7163C791951A55fEa279B6CA3e6c05f5e5F876"
    }
```

```diff
    contract Lido Dao Agent (0x3e40D73EB977Dc6a537aF587D48316feE66E9C8c) {
    +++ description: Custom role-based operations entrypoint for Lido.
      address:
-        "0x3e40D73EB977Dc6a537aF587D48316feE66E9C8c"
+        "eth:0x3e40D73EB977Dc6a537aF587D48316feE66E9C8c"
      values.$implementation:
-        "0x3A93C17FC82CC33420d1809dDA9Fb715cc89dd37"
+        "eth:0x3A93C17FC82CC33420d1809dDA9Fb715cc89dd37"
      values.designatedSigner:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      values.getEVMScriptRegistry:
-        "0x853cc0D5917f49B57B8e9F89e491F5E18919093A"
+        "eth:0x853cc0D5917f49B57B8e9F89e491F5E18919093A"
      values.getRecoveryVault:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      values.implementation:
-        "0x3A93C17FC82CC33420d1809dDA9Fb715cc89dd37"
+        "eth:0x3A93C17FC82CC33420d1809dDA9Fb715cc89dd37"
      values.kernel:
-        "0xb8FFC3Cd6e7Cf5a098A1c92F48009765B24088Dc"
+        "eth:0xb8FFC3Cd6e7Cf5a098A1c92F48009765B24088Dc"
      implementationNames.0x3e40D73EB977Dc6a537aF587D48316feE66E9C8c:
-        "AppProxyUpgradeable"
      implementationNames.0x3A93C17FC82CC33420d1809dDA9Fb715cc89dd37:
-        "Agent"
      implementationNames.eth:0x3e40D73EB977Dc6a537aF587D48316feE66E9C8c:
+        "AppProxyUpgradeable"
      implementationNames.eth:0x3A93C17FC82CC33420d1809dDA9Fb715cc89dd37:
+        "Agent"
    }
```

```diff
    EOA  (0x3Ec49d8Bef9746d7cf10D26c91526E9C1e9341D9) {
    +++ description: None
      address:
-        "0x3Ec49d8Bef9746d7cf10D26c91526E9C1e9341D9"
+        "eth:0x3Ec49d8Bef9746d7cf10D26c91526E9C1e9341D9"
    }
```

```diff
    EOA  (0x3eDD0d6562e9321Fb4a95e52576eE7f0b5Aa017e) {
    +++ description: None
      address:
-        "0x3eDD0d6562e9321Fb4a95e52576eE7f0b5Aa017e"
+        "eth:0x3eDD0d6562e9321Fb4a95e52576eE7f0b5Aa017e"
    }
```

```diff
    EOA  (0x404335BcE530400a5814375E7Ec1FB55fAff3eA2) {
    +++ description: None
      address:
-        "0x404335BcE530400a5814375E7Ec1FB55fAff3eA2"
+        "eth:0x404335BcE530400a5814375E7Ec1FB55fAff3eA2"
    }
```

```diff
    contract LegacyOracle (0x442af784A788A5bd6F42A01Ebe9F287a871243fb) {
    +++ description: None
      address:
-        "0x442af784A788A5bd6F42A01Ebe9F287a871243fb"
+        "eth:0x442af784A788A5bd6F42A01Ebe9F287a871243fb"
      values.$implementation:
-        "0xa29b819654cE6224A222bb5f586920105E2D7E0E"
+        "eth:0xa29b819654cE6224A222bb5f586920105E2D7E0E"
      values.getAccountingOracle:
-        "0x852deD011285fe67063a08005c71a85690503Cee"
+        "eth:0x852deD011285fe67063a08005c71a85690503Cee"
      values.getEVMScriptRegistry:
-        "0x853cc0D5917f49B57B8e9F89e491F5E18919093A"
+        "eth:0x853cc0D5917f49B57B8e9F89e491F5E18919093A"
      values.getLido:
-        "0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84"
+        "eth:0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84"
      values.getRecoveryVault:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      values.implementation:
-        "0xa29b819654cE6224A222bb5f586920105E2D7E0E"
+        "eth:0xa29b819654cE6224A222bb5f586920105E2D7E0E"
      values.kernel:
-        "0xb8FFC3Cd6e7Cf5a098A1c92F48009765B24088Dc"
+        "eth:0xb8FFC3Cd6e7Cf5a098A1c92F48009765B24088Dc"
      implementationNames.0x442af784A788A5bd6F42A01Ebe9F287a871243fb:
-        "AppProxyUpgradeable"
      implementationNames.0xa29b819654cE6224A222bb5f586920105E2D7E0E:
-        "LegacyOracle"
      implementationNames.eth:0x442af784A788A5bd6F42A01Ebe9F287a871243fb:
+        "AppProxyUpgradeable"
      implementationNames.eth:0xa29b819654cE6224A222bb5f586920105E2D7E0E:
+        "LegacyOracle"
    }
```

```diff
    EOA  (0x44375aaE18B34bdF5c2C485DbAc932aB4D7D454f) {
    +++ description: None
      address:
-        "0x44375aaE18B34bdF5c2C485DbAc932aB4D7D454f"
+        "eth:0x44375aaE18B34bdF5c2C485DbAc932aB4D7D454f"
    }
```

```diff
    EOA  (0x44f802506dd40405f640eE30cE13304c1Ce6A2bD) {
    +++ description: None
      address:
-        "0x44f802506dd40405f640eE30cE13304c1Ce6A2bD"
+        "eth:0x44f802506dd40405f640eE30cE13304c1Ce6A2bD"
    }
```

```diff
    contract Paxos Gold Token (0x45804880De22913dAFE09f4980848ECE6EcbAf78) {
    +++ description: None
      address:
-        "0x45804880De22913dAFE09f4980848ECE6EcbAf78"
+        "eth:0x45804880De22913dAFE09f4980848ECE6EcbAf78"
      values.$admin:
-        "0x137Dcd97872dE27a4d3bf36A4643c5e18FA40713"
+        "eth:0x137Dcd97872dE27a4d3bf36A4643c5e18FA40713"
      values.$implementation:
-        "0x74271F2282eD7eE35c166122A60c9830354be42a"
+        "eth:0x74271F2282eD7eE35c166122A60c9830354be42a"
      values.assetProtectionRole:
-        "0x0644Bd0248d5F89e4F6E845a91D15c23591e5D33"
+        "eth:0x0644Bd0248d5F89e4F6E845a91D15c23591e5D33"
      values.betaDelegateWhitelister:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      values.feeController:
-        "0x0644Bd0248d5F89e4F6E845a91D15c23591e5D33"
+        "eth:0x0644Bd0248d5F89e4F6E845a91D15c23591e5D33"
      values.feeRecipient:
-        "0x38699d04656fF537ef8671b6b595402ebDBdf6f4"
+        "eth:0x38699d04656fF537ef8671b6b595402ebDBdf6f4"
      values.owner:
-        "0x0644Bd0248d5F89e4F6E845a91D15c23591e5D33"
+        "eth:0x0644Bd0248d5F89e4F6E845a91D15c23591e5D33"
      values.proposedOwner:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      values.supplyController:
-        "0x2fb074FA59c9294c71246825C1c9A0c7782d41a4"
+        "eth:0x2fb074FA59c9294c71246825C1c9A0c7782d41a4"
      implementationNames.0x45804880De22913dAFE09f4980848ECE6EcbAf78:
-        "AdminUpgradeabilityProxy"
      implementationNames.0x74271F2282eD7eE35c166122A60c9830354be42a:
-        "PAXGImplementation"
      implementationNames.eth:0x45804880De22913dAFE09f4980848ECE6EcbAf78:
+        "AdminUpgradeabilityProxy"
      implementationNames.eth:0x74271F2282eD7eE35c166122A60c9830354be42a:
+        "PAXGImplementation"
    }
```

```diff
    EOA  (0x45b516231db24D03479a1fEBaA57Bcb58Cd79696) {
    +++ description: None
      address:
-        "0x45b516231db24D03479a1fEBaA57Bcb58Cd79696"
+        "eth:0x45b516231db24D03479a1fEBaA57Bcb58Cd79696"
    }
```

```diff
    EOA  (0x46E38dAA42aD10d333118D76A56068d0f25FB217) {
    +++ description: None
      address:
-        "0x46E38dAA42aD10d333118D76A56068d0f25FB217"
+        "eth:0x46E38dAA42aD10d333118D76A56068d0f25FB217"
    }
```

```diff
    EOA  (0x472481219B0f19B3a9e6875094deAaE8f793070B) {
    +++ description: None
      address:
-        "0x472481219B0f19B3a9e6875094deAaE8f793070B"
+        "eth:0x472481219B0f19B3a9e6875094deAaE8f793070B"
    }
```

```diff
    EOA  (0x4A49e050156d76590Ed9f12B06673E8C431754d1) {
    +++ description: None
      address:
-        "0x4A49e050156d76590Ed9f12B06673E8C431754d1"
+        "eth:0x4A49e050156d76590Ed9f12B06673E8C431754d1"
    }
```

```diff
    EOA  (0x4C086857faED97b5e8bAcc81Cf41b523D4E0386B) {
    +++ description: None
      address:
-        "0x4C086857faED97b5e8bAcc81Cf41b523D4E0386B"
+        "eth:0x4C086857faED97b5e8bAcc81Cf41b523D4E0386B"
    }
```

```diff
    contract CSFeeOracle (0x4D4074628678Bd302921c20573EEa1ed38DdF7FB) {
    +++ description: None
      address:
-        "0x4D4074628678Bd302921c20573EEa1ed38DdF7FB"
+        "eth:0x4D4074628678Bd302921c20573EEa1ed38DdF7FB"
      values.$admin:
-        "0x3e40D73EB977Dc6a537aF587D48316feE66E9C8c"
+        "eth:0x3e40D73EB977Dc6a537aF587D48316feE66E9C8c"
      values.$implementation:
-        "0x919ac5C6c62B6ef7B05cF05070080525a7B0381E"
+        "eth:0x919ac5C6c62B6ef7B05cF05070080525a7B0381E"
      values.$pastUpgrades.0.2.0:
-        "0x919ac5C6c62B6ef7B05cF05070080525a7B0381E"
+        "eth:0x919ac5C6c62B6ef7B05cF05070080525a7B0381E"
      values.feeDistributor:
-        "0xD99CC66fEC647E68294C6477B40fC7E0F6F618D0"
+        "eth:0xD99CC66fEC647E68294C6477B40fC7E0F6F618D0"
      values.getConsensusContract:
-        "0x71093efF8D8599b5fA340D665Ad60fA7C80688e4"
+        "eth:0x71093efF8D8599b5fA340D665Ad60fA7C80688e4"
      values.proxy__getAdmin:
-        "0x3e40D73EB977Dc6a537aF587D48316feE66E9C8c"
+        "eth:0x3e40D73EB977Dc6a537aF587D48316feE66E9C8c"
      values.proxy__getImplementation:
-        "0x919ac5C6c62B6ef7B05cF05070080525a7B0381E"
+        "eth:0x919ac5C6c62B6ef7B05cF05070080525a7B0381E"
      implementationNames.0x4D4074628678Bd302921c20573EEa1ed38DdF7FB:
-        "OssifiableProxy"
      implementationNames.0x919ac5C6c62B6ef7B05cF05070080525a7B0381E:
-        "CSFeeOracle"
      implementationNames.eth:0x4D4074628678Bd302921c20573EEa1ed38DdF7FB:
+        "OssifiableProxy"
      implementationNames.eth:0x919ac5C6c62B6ef7B05cF05070080525a7B0381E:
+        "CSFeeOracle"
    }
```

```diff
    contract CSAccounting (0x4d72BFF1BeaC69925F8Bd12526a39BAAb069e5Da) {
    +++ description: None
      address:
-        "0x4d72BFF1BeaC69925F8Bd12526a39BAAb069e5Da"
+        "eth:0x4d72BFF1BeaC69925F8Bd12526a39BAAb069e5Da"
      values.$admin:
-        "0x3e40D73EB977Dc6a537aF587D48316feE66E9C8c"
+        "eth:0x3e40D73EB977Dc6a537aF587D48316feE66E9C8c"
      values.$implementation:
-        "0x71FCD2a6F38B644641B0F46c345Ea03Daabf2758"
+        "eth:0x71FCD2a6F38B644641B0F46c345Ea03Daabf2758"
      values.$pastUpgrades.0.2.0:
-        "0x71FCD2a6F38B644641B0F46c345Ea03Daabf2758"
+        "eth:0x71FCD2a6F38B644641B0F46c345Ea03Daabf2758"
      values.chargePenaltyRecipient:
-        "0x3e40D73EB977Dc6a537aF587D48316feE66E9C8c"
+        "eth:0x3e40D73EB977Dc6a537aF587D48316feE66E9C8c"
      values.CSM:
-        "0xdA7dE2ECdDfccC6c3AF10108Db212ACBBf9EA83F"
+        "eth:0xdA7dE2ECdDfccC6c3AF10108Db212ACBBf9EA83F"
      values.feeDistributor:
-        "0xD99CC66fEC647E68294C6477B40fC7E0F6F618D0"
+        "eth:0xD99CC66fEC647E68294C6477B40fC7E0F6F618D0"
      values.LIDO:
-        "0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84"
+        "eth:0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84"
      values.LIDO_LOCATOR:
-        "0xC1d0b3DE6792Bf6b4b37EccdcC24e45978Cfd2Eb"
+        "eth:0xC1d0b3DE6792Bf6b4b37EccdcC24e45978Cfd2Eb"
      values.proxy__getAdmin:
-        "0x3e40D73EB977Dc6a537aF587D48316feE66E9C8c"
+        "eth:0x3e40D73EB977Dc6a537aF587D48316feE66E9C8c"
      values.proxy__getImplementation:
-        "0x71FCD2a6F38B644641B0F46c345Ea03Daabf2758"
+        "eth:0x71FCD2a6F38B644641B0F46c345Ea03Daabf2758"
      values.WITHDRAWAL_QUEUE:
-        "0x889edC2eDab5f40e902b864aD4d7AdE8E412F9B1"
+        "eth:0x889edC2eDab5f40e902b864aD4d7AdE8E412F9B1"
      values.WSTETH:
-        "0x7f39C581F595B53c5cb19bD0b3f8dA6c935E2Ca0"
+        "eth:0x7f39C581F595B53c5cb19bD0b3f8dA6c935E2Ca0"
      implementationNames.0x4d72BFF1BeaC69925F8Bd12526a39BAAb069e5Da:
-        "OssifiableProxy"
      implementationNames.0x71FCD2a6F38B644641B0F46c345Ea03Daabf2758:
-        "CSAccounting"
      implementationNames.eth:0x4d72BFF1BeaC69925F8Bd12526a39BAAb069e5Da:
+        "OssifiableProxy"
      implementationNames.eth:0x71FCD2a6F38B644641B0F46c345Ea03Daabf2758:
+        "CSAccounting"
    }
```

```diff
    EOA  (0x505f07E9a14028dBd7c72904248a8d6506961921) {
    +++ description: None
      address:
-        "0x505f07E9a14028dBd7c72904248a8d6506961921"
+        "eth:0x505f07E9a14028dBd7c72904248a8d6506961921"
    }
```

```diff
    contract NodeOperatorsRegistry (0x55032650b14df07b85bF18A3a3eC8E0Af2e028d5) {
    +++ description: None
      address:
-        "0x55032650b14df07b85bF18A3a3eC8E0Af2e028d5"
+        "eth:0x55032650b14df07b85bF18A3a3eC8E0Af2e028d5"
      values.$implementation:
-        "0x1770044a38402e3CfCa2Fcfa0C84a093c9B42135"
+        "eth:0x1770044a38402e3CfCa2Fcfa0C84a093c9B42135"
      values.getEVMScriptRegistry:
-        "0x853cc0D5917f49B57B8e9F89e491F5E18919093A"
+        "eth:0x853cc0D5917f49B57B8e9F89e491F5E18919093A"
      values.getLocator:
-        "0xC1d0b3DE6792Bf6b4b37EccdcC24e45978Cfd2Eb"
+        "eth:0xC1d0b3DE6792Bf6b4b37EccdcC24e45978Cfd2Eb"
      values.getRecoveryVault:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      values.implementation:
-        "0x1770044a38402e3CfCa2Fcfa0C84a093c9B42135"
+        "eth:0x1770044a38402e3CfCa2Fcfa0C84a093c9B42135"
      values.kernel:
-        "0xb8FFC3Cd6e7Cf5a098A1c92F48009765B24088Dc"
+        "eth:0xb8FFC3Cd6e7Cf5a098A1c92F48009765B24088Dc"
      implementationNames.0x55032650b14df07b85bF18A3a3eC8E0Af2e028d5:
-        "AppProxyUpgradeable"
      implementationNames.0x1770044a38402e3CfCa2Fcfa0C84a093c9B42135:
-        "NodeOperatorsRegistry"
      implementationNames.eth:0x55032650b14df07b85bF18A3a3eC8E0Af2e028d5:
+        "AppProxyUpgradeable"
      implementationNames.eth:0x1770044a38402e3CfCa2Fcfa0C84a093c9B42135:
+        "NodeOperatorsRegistry"
    }
```

```diff
    EOA  (0x590Cb94bE977a769d9E7D95D9eff8DeAe82e430C) {
    +++ description: None
      address:
-        "0x590Cb94bE977a769d9E7D95D9eff8DeAe82e430C"
+        "eth:0x590Cb94bE977a769d9E7D95D9eff8DeAe82e430C"
    }
```

```diff
    EOA  (0x59232aC80E6d403b6381393e52f4665ECA328558) {
    +++ description: None
      address:
-        "0x59232aC80E6d403b6381393e52f4665ECA328558"
+        "eth:0x59232aC80E6d403b6381393e52f4665ECA328558"
    }
```

```diff
    EOA  (0x5bcc4b324bFD0F5D7F0e9167beBe0456BE342686) {
    +++ description: None
      address:
-        "0x5bcc4b324bFD0F5D7F0e9167beBe0456BE342686"
+        "eth:0x5bcc4b324bFD0F5D7F0e9167beBe0456BE342686"
    }
```

```diff
    EOA  (0x5C7DcaECB4D8e49Ea2487c5Cc23C5131Ddb2252F) {
    +++ description: None
      address:
-        "0x5C7DcaECB4D8e49Ea2487c5Cc23C5131Ddb2252F"
+        "eth:0x5C7DcaECB4D8e49Ea2487c5Cc23C5131Ddb2252F"
    }
```

```diff
    EOA  (0x5d21C8C9dD0692bdEb7AC1A3fB24DFC3500E4c3e) {
    +++ description: None
      address:
-        "0x5d21C8C9dD0692bdEb7AC1A3fB24DFC3500E4c3e"
+        "eth:0x5d21C8C9dD0692bdEb7AC1A3fB24DFC3500E4c3e"
    }
```

```diff
    EOA  (0x5fd0dDbC3351d009eb3f88DE7Cd081a614C519F1) {
    +++ description: None
      address:
-        "0x5fd0dDbC3351d009eb3f88DE7Cd081a614C519F1"
+        "eth:0x5fd0dDbC3351d009eb3f88DE7Cd081a614C519F1"
    }
```

```diff
    EOA  (0x619060F79Bef3bdBA987eb0697BeD5ADDdD9e55D) {
    +++ description: None
      address:
-        "0x619060F79Bef3bdBA987eb0697BeD5ADDdD9e55D"
+        "eth:0x619060F79Bef3bdBA987eb0697BeD5ADDdD9e55D"
    }
```

```diff
    EOA  (0x61c91ECd902EB56e314bB2D5c5C07785444Ea1c8) {
    +++ description: None
      address:
-        "0x61c91ECd902EB56e314bB2D5c5C07785444Ea1c8"
+        "eth:0x61c91ECd902EB56e314bB2D5c5C07785444Ea1c8"
    }
```

```diff
    EOA  (0x61efB23a6868a74A8DFE32651361a6165F6f173E) {
    +++ description: None
      address:
-        "0x61efB23a6868a74A8DFE32651361a6165F6f173E"
+        "eth:0x61efB23a6868a74A8DFE32651361a6165F6f173E"
    }
```

```diff
    contract OracleReportSanityChecker (0x6232397ebac4f5772e53285B26c47914E9461E75) {
    +++ description: None
      address:
-        "0x6232397ebac4f5772e53285B26c47914E9461E75"
+        "eth:0x6232397ebac4f5772e53285B26c47914E9461E75"
      values.getLidoLocator:
-        "0xC1d0b3DE6792Bf6b4b37EccdcC24e45978Cfd2Eb"
+        "eth:0xC1d0b3DE6792Bf6b4b37EccdcC24e45978Cfd2Eb"
      values.secondOpinionOracle:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      implementationNames.0x6232397ebac4f5772e53285B26c47914E9461E75:
-        "OracleReportSanityChecker"
      implementationNames.eth:0x6232397ebac4f5772e53285B26c47914E9461E75:
+        "OracleReportSanityChecker"
    }
```

```diff
    EOA  (0x64F4396bb0669C72858Cc50C779b48EB25F45770) {
    +++ description: None
      address:
-        "0x64F4396bb0669C72858Cc50C779b48EB25F45770"
+        "eth:0x64F4396bb0669C72858Cc50C779b48EB25F45770"
    }
```

```diff
    EOA  (0x68B807482ffe50050a444f6610dE2F009e7CF760) {
    +++ description: None
      address:
-        "0x68B807482ffe50050a444f6610dE2F009e7CF760"
+        "eth:0x68B807482ffe50050a444f6610dE2F009e7CF760"
    }
```

```diff
    EOA  (0x6D39f61703333D3E0D533be3B76161beCc96d861) {
    +++ description: None
      address:
-        "0x6D39f61703333D3E0D533be3B76161beCc96d861"
+        "eth:0x6D39f61703333D3E0D533be3B76161beCc96d861"
    }
```

```diff
    contract HashConsensus (0x71093efF8D8599b5fA340D665Ad60fA7C80688e4) {
    +++ description: None
      address:
-        "0x71093efF8D8599b5fA340D665Ad60fA7C80688e4"
+        "eth:0x71093efF8D8599b5fA340D665Ad60fA7C80688e4"
      values.accessControl.DEFAULT_ADMIN_ROLE.members.0:
-        "0x3e40D73EB977Dc6a537aF587D48316feE66E9C8c"
+        "eth:0x3e40D73EB977Dc6a537aF587D48316feE66E9C8c"
      values.accessControl.MANAGE_MEMBERS_AND_QUORUM_ROLE.members.0:
-        "0x3e40D73EB977Dc6a537aF587D48316feE66E9C8c"
+        "eth:0x3e40D73EB977Dc6a537aF587D48316feE66E9C8c"
      values.getReportProcessor:
-        "0x4D4074628678Bd302921c20573EEa1ed38DdF7FB"
+        "eth:0x4D4074628678Bd302921c20573EEa1ed38DdF7FB"
      implementationNames.0x71093efF8D8599b5fA340D665Ad60fA7C80688e4:
-        "HashConsensus"
      implementationNames.eth:0x71093efF8D8599b5fA340D665Ad60fA7C80688e4:
+        "HashConsensus"
    }
```

```diff
    EOA  (0x73181107c8D9ED4ce0bbeF7A0b4ccf3320C41d12) {
    +++ description: None
      address:
-        "0x73181107c8D9ED4ce0bbeF7A0b4ccf3320C41d12"
+        "eth:0x73181107c8D9ED4ce0bbeF7A0b4ccf3320C41d12"
    }
```

```diff
    EOA  (0x7383DDEd70cCCFd99835612C4148fA986e9DE560) {
    +++ description: None
      address:
-        "0x7383DDEd70cCCFd99835612C4148fA986e9DE560"
+        "eth:0x7383DDEd70cCCFd99835612C4148fA986e9DE560"
    }
```

```diff
    EOA  (0x76da59EeB0A6258F82B26f78CDD73f6f8627a078) {
    +++ description: None
      address:
-        "0x76da59EeB0A6258F82B26f78CDD73f6f8627a078"
+        "eth:0x76da59EeB0A6258F82B26f78CDD73f6f8627a078"
    }
```

```diff
    EOA  (0x7912Fa976BcDe9c2cf728e213e892AD7588E6AaF) {
    +++ description: None
      address:
-        "0x7912Fa976BcDe9c2cf728e213e892AD7588E6AaF"
+        "eth:0x7912Fa976BcDe9c2cf728e213e892AD7588E6AaF"
    }
```

```diff
    EOA  (0x795bF46361495271F39fdBb0AbCC263C8e5fB538) {
    +++ description: None
      address:
-        "0x795bF46361495271F39fdBb0AbCC263C8e5fB538"
+        "eth:0x795bF46361495271F39fdBb0AbCC263C8e5fB538"
    }
```

```diff
    EOA  (0x7A3a1bE19470919318aAD57ba162891a97e2982E) {
    +++ description: None
      address:
-        "0x7A3a1bE19470919318aAD57ba162891a97e2982E"
+        "eth:0x7A3a1bE19470919318aAD57ba162891a97e2982E"
    }
```

```diff
    EOA  (0x7D70b773374AB8F07d60a05f833f7039beB7406d) {
    +++ description: None
      address:
-        "0x7D70b773374AB8F07d60a05f833f7039beB7406d"
+        "eth:0x7D70b773374AB8F07d60a05f833f7039beB7406d"
    }
```

```diff
    contract Wrapped liquid staked Ether 2.0 Token (0x7f39C581F595B53c5cb19bD0b3f8dA6c935E2Ca0) {
    +++ description: None
      address:
-        "0x7f39C581F595B53c5cb19bD0b3f8dA6c935E2Ca0"
+        "eth:0x7f39C581F595B53c5cb19bD0b3f8dA6c935E2Ca0"
      values.stETH:
-        "0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84"
+        "eth:0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84"
      implementationNames.0x7f39C581F595B53c5cb19bD0b3f8dA6c935E2Ca0:
-        "WstETH"
      implementationNames.eth:0x7f39C581F595B53c5cb19bD0b3f8dA6c935E2Ca0:
+        "WstETH"
    }
```

```diff
    EOA  (0x7F3e4A8Cf64aa13DaD152D9a506c84f86488C74C) {
    +++ description: None
      address:
-        "0x7F3e4A8Cf64aa13DaD152D9a506c84f86488C74C"
+        "eth:0x7F3e4A8Cf64aa13DaD152D9a506c84f86488C74C"
    }
```

```diff
    contract HashConsensus (0x7FaDB6358950c5fAA66Cb5EB8eE5147De3df355a) {
    +++ description: None
      address:
-        "0x7FaDB6358950c5fAA66Cb5EB8eE5147De3df355a"
+        "eth:0x7FaDB6358950c5fAA66Cb5EB8eE5147De3df355a"
      values.accessControl.DEFAULT_ADMIN_ROLE.members.0:
-        "0x3e40D73EB977Dc6a537aF587D48316feE66E9C8c"
+        "eth:0x3e40D73EB977Dc6a537aF587D48316feE66E9C8c"
      values.accessControl.MANAGE_MEMBERS_AND_QUORUM_ROLE.members.0:
-        "0x3e40D73EB977Dc6a537aF587D48316feE66E9C8c"
+        "eth:0x3e40D73EB977Dc6a537aF587D48316feE66E9C8c"
      values.getReportProcessor:
-        "0x0De4Ea0184c2ad0BacA7183356Aea5B8d5Bf5c6e"
+        "eth:0x0De4Ea0184c2ad0BacA7183356Aea5B8d5Bf5c6e"
      implementationNames.0x7FaDB6358950c5fAA66Cb5EB8eE5147De3df355a:
-        "HashConsensus"
      implementationNames.eth:0x7FaDB6358950c5fAA66Cb5EB8eE5147De3df355a:
+        "HashConsensus"
    }
```

```diff
    contract AccountingOracle (0x852deD011285fe67063a08005c71a85690503Cee) {
    +++ description: None
      address:
-        "0x852deD011285fe67063a08005c71a85690503Cee"
+        "eth:0x852deD011285fe67063a08005c71a85690503Cee"
      values.$admin:
-        "0x3e40D73EB977Dc6a537aF587D48316feE66E9C8c"
+        "eth:0x3e40D73EB977Dc6a537aF587D48316feE66E9C8c"
      values.$implementation:
-        "0x0e65898527E77210fB0133D00dd4C0E86Dc29bC7"
+        "eth:0x0e65898527E77210fB0133D00dd4C0E86Dc29bC7"
      values.$pastUpgrades.0.2.0:
-        "0x6F6541C2203196fEeDd14CD2C09550dA1CbEDa31"
+        "eth:0x6F6541C2203196fEeDd14CD2C09550dA1CbEDa31"
      values.$pastUpgrades.1.2.0:
-        "0xF3c5E0A67f32CF1dc07a8817590efa102079a1aF"
+        "eth:0xF3c5E0A67f32CF1dc07a8817590efa102079a1aF"
      values.$pastUpgrades.2.2.0:
-        "0x0e65898527E77210fB0133D00dd4C0E86Dc29bC7"
+        "eth:0x0e65898527E77210fB0133D00dd4C0E86Dc29bC7"
      values.getConsensusContract:
-        "0xD624B08C83bAECF0807Dd2c6880C3154a5F0B288"
+        "eth:0xD624B08C83bAECF0807Dd2c6880C3154a5F0B288"
      values.LEGACY_ORACLE:
-        "0x442af784A788A5bd6F42A01Ebe9F287a871243fb"
+        "eth:0x442af784A788A5bd6F42A01Ebe9F287a871243fb"
      values.LIDO:
-        "0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84"
+        "eth:0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84"
      values.LOCATOR:
-        "0xC1d0b3DE6792Bf6b4b37EccdcC24e45978Cfd2Eb"
+        "eth:0xC1d0b3DE6792Bf6b4b37EccdcC24e45978Cfd2Eb"
      values.proxy__getAdmin:
-        "0x3e40D73EB977Dc6a537aF587D48316feE66E9C8c"
+        "eth:0x3e40D73EB977Dc6a537aF587D48316feE66E9C8c"
      values.proxy__getImplementation:
-        "0x0e65898527E77210fB0133D00dd4C0E86Dc29bC7"
+        "eth:0x0e65898527E77210fB0133D00dd4C0E86Dc29bC7"
      implementationNames.0x852deD011285fe67063a08005c71a85690503Cee:
-        "OssifiableProxy"
      implementationNames.0x0e65898527E77210fB0133D00dd4C0E86Dc29bC7:
-        "AccountingOracle"
      implementationNames.eth:0x852deD011285fe67063a08005c71a85690503Cee:
+        "OssifiableProxy"
      implementationNames.eth:0x0e65898527E77210fB0133D00dd4C0E86Dc29bC7:
+        "AccountingOracle"
    }
```

```diff
    contract EVMScriptRegistry (0x853cc0D5917f49B57B8e9F89e491F5E18919093A) {
    +++ description: None
      address:
-        "0x853cc0D5917f49B57B8e9F89e491F5E18919093A"
+        "eth:0x853cc0D5917f49B57B8e9F89e491F5E18919093A"
      values.$implementation:
-        "0xBF1Ce0Bc4EdaAD8e576b3b55e19c4C15Cf6999eb"
+        "eth:0xBF1Ce0Bc4EdaAD8e576b3b55e19c4C15Cf6999eb"
      values.getEVMScriptRegistry:
-        "0x853cc0D5917f49B57B8e9F89e491F5E18919093A"
+        "eth:0x853cc0D5917f49B57B8e9F89e491F5E18919093A"
      values.getRecoveryVault:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      values.implementation:
-        "0xBF1Ce0Bc4EdaAD8e576b3b55e19c4C15Cf6999eb"
+        "eth:0xBF1Ce0Bc4EdaAD8e576b3b55e19c4C15Cf6999eb"
      values.kernel:
-        "0xb8FFC3Cd6e7Cf5a098A1c92F48009765B24088Dc"
+        "eth:0xb8FFC3Cd6e7Cf5a098A1c92F48009765B24088Dc"
      implementationNames.0x853cc0D5917f49B57B8e9F89e491F5E18919093A:
-        "AppProxyPinned"
      implementationNames.0xBF1Ce0Bc4EdaAD8e576b3b55e19c4C15Cf6999eb:
-        "EVMScriptRegistry"
      implementationNames.eth:0x853cc0D5917f49B57B8e9F89e491F5E18919093A:
+        "AppProxyPinned"
      implementationNames.eth:0xBF1Ce0Bc4EdaAD8e576b3b55e19c4C15Cf6999eb:
+        "EVMScriptRegistry"
    }
```

```diff
    contract WithdrawalQueueERC721 (0x889edC2eDab5f40e902b864aD4d7AdE8E412F9B1) {
    +++ description: None
      address:
-        "0x889edC2eDab5f40e902b864aD4d7AdE8E412F9B1"
+        "eth:0x889edC2eDab5f40e902b864aD4d7AdE8E412F9B1"
      values.$admin:
-        "0x3e40D73EB977Dc6a537aF587D48316feE66E9C8c"
+        "eth:0x3e40D73EB977Dc6a537aF587D48316feE66E9C8c"
      values.$implementation:
-        "0xE42C659Dc09109566720EA8b2De186c2Be7D94D9"
+        "eth:0xE42C659Dc09109566720EA8b2De186c2Be7D94D9"
      values.$pastUpgrades.0.2.0:
-        "0x6F6541C2203196fEeDd14CD2C09550dA1CbEDa31"
+        "eth:0x6F6541C2203196fEeDd14CD2C09550dA1CbEDa31"
      values.$pastUpgrades.1.2.0:
-        "0xE42C659Dc09109566720EA8b2De186c2Be7D94D9"
+        "eth:0xE42C659Dc09109566720EA8b2De186c2Be7D94D9"
      values.getNFTDescriptorAddress:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      values.proxy__getAdmin:
-        "0x3e40D73EB977Dc6a537aF587D48316feE66E9C8c"
+        "eth:0x3e40D73EB977Dc6a537aF587D48316feE66E9C8c"
      values.proxy__getImplementation:
-        "0xE42C659Dc09109566720EA8b2De186c2Be7D94D9"
+        "eth:0xE42C659Dc09109566720EA8b2De186c2Be7D94D9"
      values.STETH:
-        "0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84"
+        "eth:0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84"
      values.WSTETH:
-        "0x7f39C581F595B53c5cb19bD0b3f8dA6c935E2Ca0"
+        "eth:0x7f39C581F595B53c5cb19bD0b3f8dA6c935E2Ca0"
      implementationNames.0x889edC2eDab5f40e902b864aD4d7AdE8E412F9B1:
-        "OssifiableProxy"
      implementationNames.0xE42C659Dc09109566720EA8b2De186c2Be7D94D9:
-        "WithdrawalQueueERC721"
      implementationNames.eth:0x889edC2eDab5f40e902b864aD4d7AdE8E412F9B1:
+        "OssifiableProxy"
      implementationNames.eth:0xE42C659Dc09109566720EA8b2De186c2Be7D94D9:
+        "WithdrawalQueueERC721"
    }
```

```diff
    EOA  (0x8CACd1De50937b16d11B5ba11A6efeEd7e561336) {
    +++ description: None
      address:
-        "0x8CACd1De50937b16d11B5ba11A6efeEd7e561336"
+        "eth:0x8CACd1De50937b16d11B5ba11A6efeEd7e561336"
    }
```

```diff
    EOA  (0x8cEE90e941778a3C56Ac075C4826C8C01b9e8B2B) {
    +++ description: None
      address:
-        "0x8cEE90e941778a3C56Ac075C4826C8C01b9e8B2B"
+        "eth:0x8cEE90e941778a3C56Ac075C4826C8C01b9e8B2B"
    }
```

```diff
    EOA  (0x8D0f7E545B4545c7Fe06B489D93E4DA1B96dF296) {
    +++ description: None
      address:
-        "0x8D0f7E545B4545c7Fe06B489D93E4DA1B96dF296"
+        "eth:0x8D0f7E545B4545c7Fe06B489D93E4DA1B96dF296"
    }
```

```diff
    contract EIP712StETH (0x8F73e4C2A6D852bb4ab2A45E6a9CF5715b3228B7) {
    +++ description: None
      address:
-        "0x8F73e4C2A6D852bb4ab2A45E6a9CF5715b3228B7"
+        "eth:0x8F73e4C2A6D852bb4ab2A45E6a9CF5715b3228B7"
      implementationNames.0x8F73e4C2A6D852bb4ab2A45E6a9CF5715b3228B7:
-        "EIP712StETH"
      implementationNames.eth:0x8F73e4C2A6D852bb4ab2A45E6a9CF5715b3228B7:
+        "EIP712StETH"
    }
```

```diff
    contract Safe (0x909d0CB383Ecc77e44daE5d0146cF476f611f62b) {
    +++ description: None
      address:
-        "0x909d0CB383Ecc77e44daE5d0146cF476f611f62b"
+        "eth:0x909d0CB383Ecc77e44daE5d0146cF476f611f62b"
      values.$implementation:
-        "0x41675C099F32341bf84BFc5382aF534df5C7461a"
+        "eth:0x41675C099F32341bf84BFc5382aF534df5C7461a"
      values.$members.0:
-        "0x2914767E232FD7708ab06bA60dB16c36C555751d"
+        "eth:0x2914767E232FD7708ab06bA60dB16c36C555751d"
      values.$members.1:
-        "0x04D5b12b196a8CADEB2F476F22Ffb1334Ef9F94c"
+        "eth:0x04D5b12b196a8CADEB2F476F22Ffb1334Ef9F94c"
      values.$members.2:
-        "0x5C7DcaECB4D8e49Ea2487c5Cc23C5131Ddb2252F"
+        "eth:0x5C7DcaECB4D8e49Ea2487c5Cc23C5131Ddb2252F"
      values.$members.3:
-        "0x0762bCc4D604Aa3B5122C7D6571Cf5368EF3F09c"
+        "eth:0x0762bCc4D604Aa3B5122C7D6571Cf5368EF3F09c"
      values.$members.4:
-        "0xF6AB8BD99EfE2515C45d6FeE8Ea32738877EFbD8"
+        "eth:0xF6AB8BD99EfE2515C45d6FeE8Ea32738877EFbD8"
      values.$members.5:
-        "0x16aB869E6dEe6eF9068E5cF75C1a5A57981257CD"
+        "eth:0x16aB869E6dEe6eF9068E5cF75C1a5A57981257CD"
      values.$members.6:
-        "0xFf713991196F8a9D6838bA82C9Bb3579F8Cc0D90"
+        "eth:0xFf713991196F8a9D6838bA82C9Bb3579F8Cc0D90"
      values.$members.7:
-        "0x7A3a1bE19470919318aAD57ba162891a97e2982E"
+        "eth:0x7A3a1bE19470919318aAD57ba162891a97e2982E"
      values.$members.8:
-        "0x590Cb94bE977a769d9E7D95D9eff8DeAe82e430C"
+        "eth:0x590Cb94bE977a769d9E7D95D9eff8DeAe82e430C"
      values.$members.9:
-        "0x7383DDEd70cCCFd99835612C4148fA986e9DE560"
+        "eth:0x7383DDEd70cCCFd99835612C4148fA986e9DE560"
      values.$members.10:
-        "0x10277B1922e56d1B69f4dCe5A35696C791F78cac"
+        "eth:0x10277B1922e56d1B69f4dCe5A35696C791F78cac"
      values.$members.11:
-        "0xfaECfa5E4180dd55D15396F804Fd00C6dbA233B0"
+        "eth:0xfaECfa5E4180dd55D15396F804Fd00C6dbA233B0"
      implementationNames.0x909d0CB383Ecc77e44daE5d0146cF476f611f62b:
-        "SafeProxy"
      implementationNames.0x41675C099F32341bf84BFc5382aF534df5C7461a:
-        "Safe"
      implementationNames.eth:0x909d0CB383Ecc77e44daE5d0146cF476f611f62b:
+        "SafeProxy"
      implementationNames.eth:0x41675C099F32341bf84BFc5382aF534df5C7461a:
+        "Safe"
    }
```

```diff
    EOA  (0x946D3b081ed19173dC83Cd974fC69e1e760B7d78) {
    +++ description: None
      address:
-        "0x946D3b081ed19173dC83Cd974fC69e1e760B7d78"
+        "eth:0x946D3b081ed19173dC83Cd974fC69e1e760B7d78"
    }
```

```diff
    EOA  (0x955B978F3ee7818dA71fA25c676062E6BC462Fec) {
    +++ description: None
      address:
-        "0x955B978F3ee7818dA71fA25c676062E6BC462Fec"
+        "eth:0x955B978F3ee7818dA71fA25c676062E6BC462Fec"
    }
```

```diff
    contract ACL (0x9895F0F17cc1d1891b6f18ee0b483B6f221b37Bb) {
    +++ description: None
      address:
-        "0x9895F0F17cc1d1891b6f18ee0b483B6f221b37Bb"
+        "eth:0x9895F0F17cc1d1891b6f18ee0b483B6f221b37Bb"
      values.$implementation:
-        "0x9f3b9198911054B122fDb865f8A5Ac516201c339"
+        "eth:0x9f3b9198911054B122fDb865f8A5Ac516201c339"
      values.ANY_ENTITY:
-        "0xFFfFfFffFFfffFFfFFfFFFFFffFFFffffFfFFFfF"
+        "eth:0xFFfFfFffFFfffFFfFFfFFFFFffFFFffffFfFFFfF"
      values.BURN_ENTITY:
-        "0x0000000000000000000000000000000000000001"
+        "eth:0x0000000000000000000000000000000000000001"
      values.getEVMScriptRegistry:
-        "0x853cc0D5917f49B57B8e9F89e491F5E18919093A"
+        "eth:0x853cc0D5917f49B57B8e9F89e491F5E18919093A"
      values.getRecoveryVault:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      values.implementation:
-        "0x9f3b9198911054B122fDb865f8A5Ac516201c339"
+        "eth:0x9f3b9198911054B122fDb865f8A5Ac516201c339"
      values.kernel:
-        "0xb8FFC3Cd6e7Cf5a098A1c92F48009765B24088Dc"
+        "eth:0xb8FFC3Cd6e7Cf5a098A1c92F48009765B24088Dc"
      implementationNames.0x9895F0F17cc1d1891b6f18ee0b483B6f221b37Bb:
-        "AppProxyUpgradeable"
      implementationNames.0x9f3b9198911054B122fDb865f8A5Ac516201c339:
-        "ACL"
      implementationNames.eth:0x9895F0F17cc1d1891b6f18ee0b483B6f221b37Bb:
+        "AppProxyUpgradeable"
      implementationNames.eth:0x9f3b9198911054B122fDb865f8A5Ac516201c339:
+        "ACL"
    }
```

```diff
    EOA  (0x99E55F86526e2aA2Abf63A7A562a46cE3bd3F8c3) {
    +++ description: None
      address:
-        "0x99E55F86526e2aA2Abf63A7A562a46cE3bd3F8c3"
+        "eth:0x99E55F86526e2aA2Abf63A7A562a46cE3bd3F8c3"
    }
```

```diff
    EOA  (0x9a396Cb5b589357C887549cbEaE54E445A7F8114) {
    +++ description: None
      address:
-        "0x9a396Cb5b589357C887549cbEaE54E445A7F8114"
+        "eth:0x9a396Cb5b589357C887549cbEaE54E445A7F8114"
    }
```

```diff
    EOA  (0x9BC2b8BBFC50f5Ec19bCe90627b45b4f1Fe435BA) {
    +++ description: None
      address:
-        "0x9BC2b8BBFC50f5Ec19bCe90627b45b4f1Fe435BA"
+        "eth:0x9BC2b8BBFC50f5Ec19bCe90627b45b4f1Fe435BA"
    }
```

```diff
    EOA  (0x9D39a8623e6093c074Dac0E9f2aF330D82E5645f) {
    +++ description: None
      address:
-        "0x9D39a8623e6093c074Dac0E9f2aF330D82E5645f"
+        "eth:0x9D39a8623e6093c074Dac0E9f2aF330D82E5645f"
    }
```

```diff
    EOA  (0x9fCE35e475Fdd84DB06eEc4cbE65028d6F9C9d01) {
    +++ description: None
      address:
-        "0x9fCE35e475Fdd84DB06eEc4cbE65028d6F9C9d01"
+        "eth:0x9fCE35e475Fdd84DB06eEc4cbE65028d6F9C9d01"
    }
```

```diff
    EOA  (0xA32328DE1247d04CB929408D7e5cC8AcC33f48Cd) {
    +++ description: None
      address:
-        "0xA32328DE1247d04CB929408D7e5cC8AcC33f48Cd"
+        "eth:0xA32328DE1247d04CB929408D7e5cC8AcC33f48Cd"
    }
```

```diff
    EOA  (0xa56b128Ea2Ea237052b0fA2a96a387C0E43157d8) {
    +++ description: None
      address:
-        "0xa56b128Ea2Ea237052b0fA2a96a387C0E43157d8"
+        "eth:0xa56b128Ea2Ea237052b0fA2a96a387C0E43157d8"
    }
```

```diff
    EOA  (0xA7410857ABbf75043d61ea54e07D57A6EB6EF186) {
    +++ description: None
      address:
-        "0xA7410857ABbf75043d61ea54e07D57A6EB6EF186"
+        "eth:0xA7410857ABbf75043d61ea54e07D57A6EB6EF186"
    }
```

```diff
    EOA  (0xAad13BdEeC1F6e787b95F322eBb063bae5F1641a) {
    +++ description: None
      address:
-        "0xAad13BdEeC1F6e787b95F322eBb063bae5F1641a"
+        "eth:0xAad13BdEeC1F6e787b95F322eBb063bae5F1641a"
    }
```

```diff
    contract Liquid staked Ether 2.0 Token (0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84) {
    +++ description: None
      address:
-        "0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84"
+        "eth:0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84"
      values.$implementation:
-        "0x17144556fd3424EDC8Fc8A4C940B2D04936d17eb"
+        "eth:0x17144556fd3424EDC8Fc8A4C940B2D04936d17eb"
      values.eip712Domain.verifyingContract:
-        "0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84"
+        "eth:0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84"
      values.getEIP712StETH:
-        "0x8F73e4C2A6D852bb4ab2A45E6a9CF5715b3228B7"
+        "eth:0x8F73e4C2A6D852bb4ab2A45E6a9CF5715b3228B7"
      values.getEVMScriptRegistry:
-        "0x853cc0D5917f49B57B8e9F89e491F5E18919093A"
+        "eth:0x853cc0D5917f49B57B8e9F89e491F5E18919093A"
      values.getLidoLocator:
-        "0xC1d0b3DE6792Bf6b4b37EccdcC24e45978Cfd2Eb"
+        "eth:0xC1d0b3DE6792Bf6b4b37EccdcC24e45978Cfd2Eb"
      values.getOracle:
-        "0x442af784A788A5bd6F42A01Ebe9F287a871243fb"
+        "eth:0x442af784A788A5bd6F42A01Ebe9F287a871243fb"
      values.getRecoveryVault:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      values.getTreasury:
-        "0x3e40D73EB977Dc6a537aF587D48316feE66E9C8c"
+        "eth:0x3e40D73EB977Dc6a537aF587D48316feE66E9C8c"
      values.implementation:
-        "0x17144556fd3424EDC8Fc8A4C940B2D04936d17eb"
+        "eth:0x17144556fd3424EDC8Fc8A4C940B2D04936d17eb"
      values.kernel:
-        "0xb8FFC3Cd6e7Cf5a098A1c92F48009765B24088Dc"
+        "eth:0xb8FFC3Cd6e7Cf5a098A1c92F48009765B24088Dc"
      implementationNames.0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84:
-        "AppProxyUpgradeable"
      implementationNames.0x17144556fd3424EDC8Fc8A4C940B2D04936d17eb:
-        "Lido"
      implementationNames.eth:0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84:
+        "AppProxyUpgradeable"
      implementationNames.eth:0x17144556fd3424EDC8Fc8A4C940B2D04936d17eb:
+        "Lido"
    }
```

```diff
    contract NodeOperatorsRegistry (0xaE7B191A31f627b4eB1d4DaC64eaB9976995b433) {
    +++ description: None
      address:
-        "0xaE7B191A31f627b4eB1d4DaC64eaB9976995b433"
+        "eth:0xaE7B191A31f627b4eB1d4DaC64eaB9976995b433"
      values.$implementation:
-        "0x1770044a38402e3CfCa2Fcfa0C84a093c9B42135"
+        "eth:0x1770044a38402e3CfCa2Fcfa0C84a093c9B42135"
      values.getEVMScriptRegistry:
-        "0x853cc0D5917f49B57B8e9F89e491F5E18919093A"
+        "eth:0x853cc0D5917f49B57B8e9F89e491F5E18919093A"
      values.getLocator:
-        "0xC1d0b3DE6792Bf6b4b37EccdcC24e45978Cfd2Eb"
+        "eth:0xC1d0b3DE6792Bf6b4b37EccdcC24e45978Cfd2Eb"
      values.getRecoveryVault:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      values.implementation:
-        "0x1770044a38402e3CfCa2Fcfa0C84a093c9B42135"
+        "eth:0x1770044a38402e3CfCa2Fcfa0C84a093c9B42135"
      values.kernel:
-        "0xb8FFC3Cd6e7Cf5a098A1c92F48009765B24088Dc"
+        "eth:0xb8FFC3Cd6e7Cf5a098A1c92F48009765B24088Dc"
      implementationNames.0xaE7B191A31f627b4eB1d4DaC64eaB9976995b433:
-        "AppProxyUpgradeable"
      implementationNames.0x1770044a38402e3CfCa2Fcfa0C84a093c9B42135:
-        "NodeOperatorsRegistry"
      implementationNames.eth:0xaE7B191A31f627b4eB1d4DaC64eaB9976995b433:
+        "AppProxyUpgradeable"
      implementationNames.eth:0x1770044a38402e3CfCa2Fcfa0C84a093c9B42135:
+        "NodeOperatorsRegistry"
    }
```

```diff
    EOA  (0xaE9cf54119fE761A4d84d5D839b715F75ccf2786) {
    +++ description: None
      address:
-        "0xaE9cf54119fE761A4d84d5D839b715F75ccf2786"
+        "eth:0xaE9cf54119fE761A4d84d5D839b715F75ccf2786"
    }
```

```diff
    EOA  (0xAeb500D8EE2a0322CcE35233819e8D6bEA5c8c42) {
    +++ description: None
      address:
-        "0xAeb500D8EE2a0322CcE35233819e8D6bEA5c8c42"
+        "eth:0xAeb500D8EE2a0322CcE35233819e8D6bEA5c8c42"
    }
```

```diff
    EOA  (0xb04f132aDA70B39F6fBbA6f4Dd37E80Ce6058D83) {
    +++ description: None
      address:
-        "0xb04f132aDA70B39F6fBbA6f4Dd37E80Ce6058D83"
+        "eth:0xb04f132aDA70B39F6fBbA6f4Dd37E80Ce6058D83"
    }
```

```diff
    EOA  (0xb08B382f09029AB7cE3CD486540aed0ed62680E3) {
    +++ description: None
      address:
-        "0xb08B382f09029AB7cE3CD486540aed0ed62680E3"
+        "eth:0xb08B382f09029AB7cE3CD486540aed0ed62680E3"
    }
```

```diff
    contract GnosisSafe (0xB18BB767638Bca324d158B7C7189e1a28aeB9EB4) {
    +++ description: None
      address:
-        "0xB18BB767638Bca324d158B7C7189e1a28aeB9EB4"
+        "eth:0xB18BB767638Bca324d158B7C7189e1a28aeB9EB4"
      values.$implementation:
-        "0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552"
+        "eth:0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552"
      values.$members.0:
-        "0xCe958D997F4a5824D4d503A128216322C6C223a0"
+        "eth:0xCe958D997F4a5824D4d503A128216322C6C223a0"
      values.$members.1:
-        "0x955B978F3ee7818dA71fA25c676062E6BC462Fec"
+        "eth:0x955B978F3ee7818dA71fA25c676062E6BC462Fec"
      values.$members.2:
-        "0x64F4396bb0669C72858Cc50C779b48EB25F45770"
+        "eth:0x64F4396bb0669C72858Cc50C779b48EB25F45770"
      values.$members.3:
-        "0x59232aC80E6d403b6381393e52f4665ECA328558"
+        "eth:0x59232aC80E6d403b6381393e52f4665ECA328558"
      implementationNames.0xB18BB767638Bca324d158B7C7189e1a28aeB9EB4:
-        "GnosisSafeProxy"
      implementationNames.0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552:
-        "GnosisSafe"
      implementationNames.eth:0xB18BB767638Bca324d158B7C7189e1a28aeB9EB4:
+        "GnosisSafeProxy"
      implementationNames.eth:0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552:
+        "GnosisSafe"
    }
```

```diff
    contract Kernel (0xb8FFC3Cd6e7Cf5a098A1c92F48009765B24088Dc) {
    +++ description: None
      address:
-        "0xb8FFC3Cd6e7Cf5a098A1c92F48009765B24088Dc"
+        "eth:0xb8FFC3Cd6e7Cf5a098A1c92F48009765B24088Dc"
      values.$implementation:
-        "0x2b33CF282f867A7FF693A66e11B0FcC5552e4425"
+        "eth:0x2b33CF282f867A7FF693A66e11B0FcC5552e4425"
      values.acl:
-        "0x9895F0F17cc1d1891b6f18ee0b483B6f221b37Bb"
+        "eth:0x9895F0F17cc1d1891b6f18ee0b483B6f221b37Bb"
      values.getRecoveryVault:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      values.implementation:
-        "0x2b33CF282f867A7FF693A66e11B0FcC5552e4425"
+        "eth:0x2b33CF282f867A7FF693A66e11B0FcC5552e4425"
      implementationNames.0xb8FFC3Cd6e7Cf5a098A1c92F48009765B24088Dc:
-        "KernelProxy"
      implementationNames.0x2b33CF282f867A7FF693A66e11B0FcC5552e4425:
-        "Kernel"
      implementationNames.eth:0xb8FFC3Cd6e7Cf5a098A1c92F48009765B24088Dc:
+        "KernelProxy"
      implementationNames.eth:0x2b33CF282f867A7FF693A66e11B0FcC5552e4425:
+        "Kernel"
    }
```

```diff
    contract WithdrawalVault (0xB9D7934878B5FB9610B3fE8A5e441e8fad7E293f) {
    +++ description: None
      address:
-        "0xB9D7934878B5FB9610B3fE8A5e441e8fad7E293f"
+        "eth:0xB9D7934878B5FB9610B3fE8A5e441e8fad7E293f"
      values.$admin:
-        "0x3e40D73EB977Dc6a537aF587D48316feE66E9C8c"
+        "eth:0x3e40D73EB977Dc6a537aF587D48316feE66E9C8c"
      values.$implementation:
-        "0xCC52f17756C04bBa7E377716d7062fC36D7f69Fd"
+        "eth:0xCC52f17756C04bBa7E377716d7062fC36D7f69Fd"
      values.$pastUpgrades.0.2.0:
-        "0xCC52f17756C04bBa7E377716d7062fC36D7f69Fd"
+        "eth:0xCC52f17756C04bBa7E377716d7062fC36D7f69Fd"
      values.implementation:
-        "0xCC52f17756C04bBa7E377716d7062fC36D7f69Fd"
+        "eth:0xCC52f17756C04bBa7E377716d7062fC36D7f69Fd"
      values.LIDO:
-        "0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84"
+        "eth:0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84"
      values.proxy_getAdmin:
-        "0x3e40D73EB977Dc6a537aF587D48316feE66E9C8c"
+        "eth:0x3e40D73EB977Dc6a537aF587D48316feE66E9C8c"
      values.TREASURY:
-        "0x3e40D73EB977Dc6a537aF587D48316feE66E9C8c"
+        "eth:0x3e40D73EB977Dc6a537aF587D48316feE66E9C8c"
      implementationNames.0xB9D7934878B5FB9610B3fE8A5e441e8fad7E293f:
-        "WithdrawalsManagerProxy"
      implementationNames.0xCC52f17756C04bBa7E377716d7062fC36D7f69Fd:
-        "WithdrawalVault"
      implementationNames.eth:0xB9D7934878B5FB9610B3fE8A5e441e8fad7E293f:
+        "WithdrawalsManagerProxy"
      implementationNames.eth:0xCC52f17756C04bBa7E377716d7062fC36D7f69Fd:
+        "WithdrawalVault"
    }
```

```diff
    EOA  (0xbbe25013fF925463aa6FAc0Cd90f5cf10fd4F442) {
    +++ description: None
      address:
-        "0xbbe25013fF925463aa6FAc0Cd90f5cf10fd4F442"
+        "eth:0xbbe25013fF925463aa6FAc0Cd90f5cf10fd4F442"
    }
```

```diff
    EOA  (0xbEc5fd85dc949D9F38dCFF6D48613e0Fcf873A96) {
    +++ description: None
      address:
-        "0xbEc5fd85dc949D9F38dCFF6D48613e0Fcf873A96"
+        "eth:0xbEc5fd85dc949D9F38dCFF6D48613e0Fcf873A96"
    }
```

```diff
    contract OracleDaemonConfig (0xbf05A929c3D7885a6aeAd833a992dA6E5ac23b09) {
    +++ description: None
      address:
-        "0xbf05A929c3D7885a6aeAd833a992dA6E5ac23b09"
+        "eth:0xbf05A929c3D7885a6aeAd833a992dA6E5ac23b09"
      implementationNames.0xbf05A929c3D7885a6aeAd833a992dA6E5ac23b09:
-        "OracleDaemonConfig"
      implementationNames.eth:0xbf05A929c3D7885a6aeAd833a992dA6E5ac23b09:
+        "OracleDaemonConfig"
    }
```

```diff
    contract LidoLocator (0xC1d0b3DE6792Bf6b4b37EccdcC24e45978Cfd2Eb) {
    +++ description: None
      address:
-        "0xC1d0b3DE6792Bf6b4b37EccdcC24e45978Cfd2Eb"
+        "eth:0xC1d0b3DE6792Bf6b4b37EccdcC24e45978Cfd2Eb"
      values.$admin:
-        "0x3e40D73EB977Dc6a537aF587D48316feE66E9C8c"
+        "eth:0x3e40D73EB977Dc6a537aF587D48316feE66E9C8c"
      values.$implementation:
-        "0x3ABc4764f0237923d52056CFba7E9AEBf87113D3"
+        "eth:0x3ABc4764f0237923d52056CFba7E9AEBf87113D3"
      values.$pastUpgrades.0.2.0:
-        "0xEC3B38EDc7878Ad3f18cFddcd341aa94Fc57d20B"
+        "eth:0xEC3B38EDc7878Ad3f18cFddcd341aa94Fc57d20B"
      values.$pastUpgrades.1.2.0:
-        "0x2faE8f0A4D8D11B6EC35d04d3Ea6a0d195EB6D3F"
+        "eth:0x2faE8f0A4D8D11B6EC35d04d3Ea6a0d195EB6D3F"
      values.$pastUpgrades.2.2.0:
-        "0xc601E93D9F48D5E374820957CdA57516e2523d6C"
+        "eth:0xc601E93D9F48D5E374820957CdA57516e2523d6C"
      values.$pastUpgrades.3.2.0:
-        "0xd4f6BEF8DdBc7306684b8D7c836269e0E6f8B6D0"
+        "eth:0xd4f6BEF8DdBc7306684b8D7c836269e0E6f8B6D0"
      values.$pastUpgrades.4.2.0:
-        "0x1D920cc5bACf7eE506a271a5259f2417CaDeCE1d"
+        "eth:0x1D920cc5bACf7eE506a271a5259f2417CaDeCE1d"
      values.$pastUpgrades.5.2.0:
-        "0x1D920cc5bACf7eE506a271a5259f2417CaDeCE1d"
+        "eth:0x1D920cc5bACf7eE506a271a5259f2417CaDeCE1d"
      values.$pastUpgrades.6.2.0:
-        "0x39aFE23cE59e8Ef196b81F0DCb165E9aD38b9463"
+        "eth:0x39aFE23cE59e8Ef196b81F0DCb165E9aD38b9463"
      values.$pastUpgrades.7.2.0:
-        "0x3ABc4764f0237923d52056CFba7E9AEBf87113D3"
+        "eth:0x3ABc4764f0237923d52056CFba7E9AEBf87113D3"
      values.accountingOracle:
-        "0x852deD011285fe67063a08005c71a85690503Cee"
+        "eth:0x852deD011285fe67063a08005c71a85690503Cee"
      values.burner:
-        "0xD15a672319Cf0352560eE76d9e89eAB0889046D3"
+        "eth:0xD15a672319Cf0352560eE76d9e89eAB0889046D3"
      values.coreComponents.0:
-        "0x388C818CA8B9251b393131C08a736A67ccB19297"
+        "eth:0x388C818CA8B9251b393131C08a736A67ccB19297"
      values.coreComponents.1:
-        "0x6232397ebac4f5772e53285B26c47914E9461E75"
+        "eth:0x6232397ebac4f5772e53285B26c47914E9461E75"
      values.coreComponents.2:
-        "0xFdDf38947aFB03C621C71b06C9C70bce73f12999"
+        "eth:0xFdDf38947aFB03C621C71b06C9C70bce73f12999"
      values.coreComponents.3:
-        "0x3e40D73EB977Dc6a537aF587D48316feE66E9C8c"
+        "eth:0x3e40D73EB977Dc6a537aF587D48316feE66E9C8c"
      values.coreComponents.4:
-        "0x889edC2eDab5f40e902b864aD4d7AdE8E412F9B1"
+        "eth:0x889edC2eDab5f40e902b864aD4d7AdE8E412F9B1"
      values.coreComponents.5:
-        "0xB9D7934878B5FB9610B3fE8A5e441e8fad7E293f"
+        "eth:0xB9D7934878B5FB9610B3fE8A5e441e8fad7E293f"
      values.depositSecurityModule:
-        "0xfFA96D84dEF2EA035c7AB153D8B991128e3d72fD"
+        "eth:0xfFA96D84dEF2EA035c7AB153D8B991128e3d72fD"
      values.elRewardsVault:
-        "0x388C818CA8B9251b393131C08a736A67ccB19297"
+        "eth:0x388C818CA8B9251b393131C08a736A67ccB19297"
      values.legacyOracle:
-        "0x442af784A788A5bd6F42A01Ebe9F287a871243fb"
+        "eth:0x442af784A788A5bd6F42A01Ebe9F287a871243fb"
      values.lido:
-        "0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84"
+        "eth:0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84"
      values.oracleDaemonConfig:
-        "0xbf05A929c3D7885a6aeAd833a992dA6E5ac23b09"
+        "eth:0xbf05A929c3D7885a6aeAd833a992dA6E5ac23b09"
      values.oracleReportComponentsForLido.0:
-        "0x852deD011285fe67063a08005c71a85690503Cee"
+        "eth:0x852deD011285fe67063a08005c71a85690503Cee"
      values.oracleReportComponentsForLido.1:
-        "0x388C818CA8B9251b393131C08a736A67ccB19297"
+        "eth:0x388C818CA8B9251b393131C08a736A67ccB19297"
      values.oracleReportComponentsForLido.2:
-        "0x6232397ebac4f5772e53285B26c47914E9461E75"
+        "eth:0x6232397ebac4f5772e53285B26c47914E9461E75"
      values.oracleReportComponentsForLido.3:
-        "0xD15a672319Cf0352560eE76d9e89eAB0889046D3"
+        "eth:0xD15a672319Cf0352560eE76d9e89eAB0889046D3"
      values.oracleReportComponentsForLido.4:
-        "0x889edC2eDab5f40e902b864aD4d7AdE8E412F9B1"
+        "eth:0x889edC2eDab5f40e902b864aD4d7AdE8E412F9B1"
      values.oracleReportComponentsForLido.5:
-        "0xB9D7934878B5FB9610B3fE8A5e441e8fad7E293f"
+        "eth:0xB9D7934878B5FB9610B3fE8A5e441e8fad7E293f"
      values.oracleReportComponentsForLido.6:
-        "0xe6793B9e4FbA7DE0ee833F9D02bba7DB5EB27823"
+        "eth:0xe6793B9e4FbA7DE0ee833F9D02bba7DB5EB27823"
      values.oracleReportSanityChecker:
-        "0x6232397ebac4f5772e53285B26c47914E9461E75"
+        "eth:0x6232397ebac4f5772e53285B26c47914E9461E75"
      values.postTokenRebaseReceiver:
-        "0xe6793B9e4FbA7DE0ee833F9D02bba7DB5EB27823"
+        "eth:0xe6793B9e4FbA7DE0ee833F9D02bba7DB5EB27823"
      values.proxy__getAdmin:
-        "0x3e40D73EB977Dc6a537aF587D48316feE66E9C8c"
+        "eth:0x3e40D73EB977Dc6a537aF587D48316feE66E9C8c"
      values.proxy__getImplementation:
-        "0x3ABc4764f0237923d52056CFba7E9AEBf87113D3"
+        "eth:0x3ABc4764f0237923d52056CFba7E9AEBf87113D3"
      values.stakingRouter:
-        "0xFdDf38947aFB03C621C71b06C9C70bce73f12999"
+        "eth:0xFdDf38947aFB03C621C71b06C9C70bce73f12999"
      values.treasury:
-        "0x3e40D73EB977Dc6a537aF587D48316feE66E9C8c"
+        "eth:0x3e40D73EB977Dc6a537aF587D48316feE66E9C8c"
      values.validatorsExitBusOracle:
-        "0x0De4Ea0184c2ad0BacA7183356Aea5B8d5Bf5c6e"
+        "eth:0x0De4Ea0184c2ad0BacA7183356Aea5B8d5Bf5c6e"
      values.withdrawalQueue:
-        "0x889edC2eDab5f40e902b864aD4d7AdE8E412F9B1"
+        "eth:0x889edC2eDab5f40e902b864aD4d7AdE8E412F9B1"
      values.withdrawalVault:
-        "0xB9D7934878B5FB9610B3fE8A5e441e8fad7E293f"
+        "eth:0xB9D7934878B5FB9610B3fE8A5e441e8fad7E293f"
      implementationNames.0xC1d0b3DE6792Bf6b4b37EccdcC24e45978Cfd2Eb:
-        "OssifiableProxy"
      implementationNames.0x3ABc4764f0237923d52056CFba7E9AEBf87113D3:
-        "LidoLocator"
      implementationNames.eth:0xC1d0b3DE6792Bf6b4b37EccdcC24e45978Cfd2Eb:
+        "OssifiableProxy"
      implementationNames.eth:0x3ABc4764f0237923d52056CFba7E9AEBf87113D3:
+        "LidoLocator"
    }
```

```diff
    EOA  (0xC271e7e7EB9dEb8831C1d6e728BB7677cd0e8009) {
    +++ description: None
      address:
-        "0xC271e7e7EB9dEb8831C1d6e728BB7677cd0e8009"
+        "eth:0xC271e7e7EB9dEb8831C1d6e728BB7677cd0e8009"
    }
```

```diff
    EOA  (0xc79F702202E3A6B0B6310B537E786B9ACAA19BAf) {
    +++ description: None
      address:
-        "0xc79F702202E3A6B0B6310B537E786B9ACAA19BAf"
+        "eth:0xc79F702202E3A6B0B6310B537E786B9ACAA19BAf"
    }
```

```diff
    EOA  (0xc8e590C88f1F4bC59353b400f0c0D1024288438C) {
    +++ description: None
      address:
-        "0xc8e590C88f1F4bC59353b400f0c0D1024288438C"
+        "eth:0xc8e590C88f1F4bC59353b400f0c0D1024288438C"
    }
```

```diff
    contract StarkNet Token (0xCa14007Eff0dB1f8135f4C25B34De49AB0d42766) {
    +++ description: None
      address:
-        "0xCa14007Eff0dB1f8135f4C25B34De49AB0d42766"
+        "eth:0xCa14007Eff0dB1f8135f4C25B34De49AB0d42766"
      values.accessControl.DEFAULT_ADMIN_ROLE.members.0:
-        "0xB18BB767638Bca324d158B7C7189e1a28aeB9EB4"
+        "eth:0xB18BB767638Bca324d158B7C7189e1a28aeB9EB4"
      values.accessControl.MINTER_ROLE.members.0:
-        "0xCa14076A3cec95448BaD179cc19B351A4204B88B"
+        "eth:0xCa14076A3cec95448BaD179cc19B351A4204B88B"
      implementationNames.0xCa14007Eff0dB1f8135f4C25B34De49AB0d42766:
-        "StarkNetToken"
      implementationNames.eth:0xCa14007Eff0dB1f8135f4C25B34De49AB0d42766:
+        "StarkNetToken"
    }
```

```diff
    contract MintManager (0xCa14076A3cec95448BaD179cc19B351A4204B88B) {
    +++ description: None
      address:
-        "0xCa14076A3cec95448BaD179cc19B351A4204B88B"
+        "eth:0xCa14076A3cec95448BaD179cc19B351A4204B88B"
      values.$admin:
-        "0x909d0CB383Ecc77e44daE5d0146cF476f611f62b"
+        "eth:0x909d0CB383Ecc77e44daE5d0146cF476f611f62b"
      values.$implementation:
-        "0xa4D28d9fFF539d6E1972Ce3Cf9c4577856eD7F20"
+        "eth:0xa4D28d9fFF539d6E1972Ce3Cf9c4577856eD7F20"
      values.$pastUpgrades.0.2.0:
-        "0xddDF984037e35a0CecCC4654F824823bB8FD2a5e"
+        "eth:0xddDF984037e35a0CecCC4654F824823bB8FD2a5e"
      values.$pastUpgrades.1.2.0:
-        "0xa4D28d9fFF539d6E1972Ce3Cf9c4577856eD7F20"
+        "eth:0xa4D28d9fFF539d6E1972Ce3Cf9c4577856eD7F20"
      values.implementation:
-        "0xa4D28d9fFF539d6E1972Ce3Cf9c4577856eD7F20"
+        "eth:0xa4D28d9fFF539d6E1972Ce3Cf9c4577856eD7F20"
      implementationNames.0xCa14076A3cec95448BaD179cc19B351A4204B88B:
-        "ProxyV5"
      implementationNames.0xa4D28d9fFF539d6E1972Ce3Cf9c4577856eD7F20:
-        "MintManager"
      implementationNames.eth:0xCa14076A3cec95448BaD179cc19B351A4204B88B:
+        "ProxyV5"
      implementationNames.eth:0xa4D28d9fFF539d6E1972Ce3Cf9c4577856eD7F20:
+        "MintManager"
    }
```

```diff
    EOA  (0xcC9F578fA52beD1EeB8a8B78A8c3D14dF8f6e087) {
    +++ description: None
      address:
-        "0xcC9F578fA52beD1EeB8a8B78A8c3D14dF8f6e087"
+        "eth:0xcC9F578fA52beD1EeB8a8B78A8c3D14dF8f6e087"
    }
```

```diff
    EOA  (0xCe160F39Cb0ac01b7Ca755027827e8853b217086) {
    +++ description: None
      address:
-        "0xCe160F39Cb0ac01b7Ca755027827e8853b217086"
+        "eth:0xCe160F39Cb0ac01b7Ca755027827e8853b217086"
    }
```

```diff
    EOA  (0xCe958D997F4a5824D4d503A128216322C6C223a0) {
    +++ description: None
      address:
-        "0xCe958D997F4a5824D4d503A128216322C6C223a0"
+        "eth:0xCe958D997F4a5824D4d503A128216322C6C223a0"
    }
```

```diff
    contract Burner (0xD15a672319Cf0352560eE76d9e89eAB0889046D3) {
    +++ description: None
      address:
-        "0xD15a672319Cf0352560eE76d9e89eAB0889046D3"
+        "eth:0xD15a672319Cf0352560eE76d9e89eAB0889046D3"
      values.STETH:
-        "0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84"
+        "eth:0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84"
      values.TREASURY:
-        "0x3e40D73EB977Dc6a537aF587D48316feE66E9C8c"
+        "eth:0x3e40D73EB977Dc6a537aF587D48316feE66E9C8c"
      implementationNames.0xD15a672319Cf0352560eE76d9e89eAB0889046D3:
-        "Burner"
      implementationNames.eth:0xD15a672319Cf0352560eE76d9e89eAB0889046D3:
+        "Burner"
    }
```

```diff
    EOA  (0xd4EF84b638B334699bcf5AF4B0410B8CCD71943f) {
    +++ description: None
      address:
-        "0xd4EF84b638B334699bcf5AF4B0410B8CCD71943f"
+        "eth:0xd4EF84b638B334699bcf5AF4B0410B8CCD71943f"
    }
```

```diff
    EOA  (0xD5353842ac6d8aC6e3E8fb1d0Cd7B27fE3d67c74) {
    +++ description: None
      address:
-        "0xD5353842ac6d8aC6e3E8fb1d0Cd7B27fE3d67c74"
+        "eth:0xD5353842ac6d8aC6e3E8fb1d0Cd7B27fE3d67c74"
    }
```

```diff
    contract OpStackTokenRatePusher (0xd54c1c6413caac3477AC14b2a80D5398E3c32FfE) {
    +++ description: None
      address:
-        "0xd54c1c6413caac3477AC14b2a80D5398E3c32FfE"
+        "eth:0xd54c1c6413caac3477AC14b2a80D5398E3c32FfE"
      values.ACCOUNTING_ORACLE:
-        "0x852deD011285fe67063a08005c71a85690503Cee"
+        "eth:0x852deD011285fe67063a08005c71a85690503Cee"
      values.L2_TOKEN_RATE_ORACLE:
-        "0x294ED1f214F4e0ecAE31C3Eae4F04EBB3b36C9d0"
+        "eth:0x294ED1f214F4e0ecAE31C3Eae4F04EBB3b36C9d0"
      values.MESSENGER:
-        "0x25ace71c97B33Cc4729CF772ae268934F7ab5fA1"
+        "eth:0x25ace71c97B33Cc4729CF772ae268934F7ab5fA1"
      values.WSTETH:
-        "0x7f39C581F595B53c5cb19bD0b3f8dA6c935E2Ca0"
+        "eth:0x7f39C581F595B53c5cb19bD0b3f8dA6c935E2Ca0"
      implementationNames.0xd54c1c6413caac3477AC14b2a80D5398E3c32FfE:
-        "OpStackTokenRatePusher"
      implementationNames.eth:0xd54c1c6413caac3477AC14b2a80D5398E3c32FfE:
+        "OpStackTokenRatePusher"
    }
```

```diff
    EOA  (0xD55F7d21e8057631a6A88A7FDdF82EeDB2C14e26) {
    +++ description: None
      address:
-        "0xD55F7d21e8057631a6A88A7FDdF82EeDB2C14e26"
+        "eth:0xD55F7d21e8057631a6A88A7FDdF82EeDB2C14e26"
    }
```

```diff
    contract HashConsensus (0xD624B08C83bAECF0807Dd2c6880C3154a5F0B288) {
    +++ description: None
      address:
-        "0xD624B08C83bAECF0807Dd2c6880C3154a5F0B288"
+        "eth:0xD624B08C83bAECF0807Dd2c6880C3154a5F0B288"
      values.accessControl.DEFAULT_ADMIN_ROLE.members.0:
-        "0x3e40D73EB977Dc6a537aF587D48316feE66E9C8c"
+        "eth:0x3e40D73EB977Dc6a537aF587D48316feE66E9C8c"
      values.accessControl.MANAGE_MEMBERS_AND_QUORUM_ROLE.members.0:
-        "0x3e40D73EB977Dc6a537aF587D48316feE66E9C8c"
+        "eth:0x3e40D73EB977Dc6a537aF587D48316feE66E9C8c"
      values.getReportProcessor:
-        "0x852deD011285fe67063a08005c71a85690503Cee"
+        "eth:0x852deD011285fe67063a08005c71a85690503Cee"
      implementationNames.0xD624B08C83bAECF0807Dd2c6880C3154a5F0B288:
-        "HashConsensus"
      implementationNames.eth:0xD624B08C83bAECF0807Dd2c6880C3154a5F0B288:
+        "HashConsensus"
    }
```

```diff
    contract CSFeeDistributor (0xD99CC66fEC647E68294C6477B40fC7E0F6F618D0) {
    +++ description: None
      address:
-        "0xD99CC66fEC647E68294C6477B40fC7E0F6F618D0"
+        "eth:0xD99CC66fEC647E68294C6477B40fC7E0F6F618D0"
      values.$admin:
-        "0x3e40D73EB977Dc6a537aF587D48316feE66E9C8c"
+        "eth:0x3e40D73EB977Dc6a537aF587D48316feE66E9C8c"
      values.$implementation:
-        "0x17Fc610ecbbAc3f99751b3B2aAc1bA2b22E444f0"
+        "eth:0x17Fc610ecbbAc3f99751b3B2aAc1bA2b22E444f0"
      values.$pastUpgrades.0.2.0:
-        "0x17Fc610ecbbAc3f99751b3B2aAc1bA2b22E444f0"
+        "eth:0x17Fc610ecbbAc3f99751b3B2aAc1bA2b22E444f0"
      values.ACCOUNTING:
-        "0x4d72BFF1BeaC69925F8Bd12526a39BAAb069e5Da"
+        "eth:0x4d72BFF1BeaC69925F8Bd12526a39BAAb069e5Da"
      values.ORACLE:
-        "0x4D4074628678Bd302921c20573EEa1ed38DdF7FB"
+        "eth:0x4D4074628678Bd302921c20573EEa1ed38DdF7FB"
      values.proxy__getAdmin:
-        "0x3e40D73EB977Dc6a537aF587D48316feE66E9C8c"
+        "eth:0x3e40D73EB977Dc6a537aF587D48316feE66E9C8c"
      values.proxy__getImplementation:
-        "0x17Fc610ecbbAc3f99751b3B2aAc1bA2b22E444f0"
+        "eth:0x17Fc610ecbbAc3f99751b3B2aAc1bA2b22E444f0"
      values.STETH:
-        "0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84"
+        "eth:0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84"
      implementationNames.0xD99CC66fEC647E68294C6477B40fC7E0F6F618D0:
-        "OssifiableProxy"
      implementationNames.0x17Fc610ecbbAc3f99751b3B2aAc1bA2b22E444f0:
-        "CSFeeDistributor"
      implementationNames.eth:0xD99CC66fEC647E68294C6477B40fC7E0F6F618D0:
+        "OssifiableProxy"
      implementationNames.eth:0x17Fc610ecbbAc3f99751b3B2aAc1bA2b22E444f0:
+        "CSFeeDistributor"
    }
```

```diff
    contract CSModule (0xdA7dE2ECdDfccC6c3AF10108Db212ACBBf9EA83F) {
    +++ description: None
      address:
-        "0xdA7dE2ECdDfccC6c3AF10108Db212ACBBf9EA83F"
+        "eth:0xdA7dE2ECdDfccC6c3AF10108Db212ACBBf9EA83F"
      values.$admin:
-        "0x3e40D73EB977Dc6a537aF587D48316feE66E9C8c"
+        "eth:0x3e40D73EB977Dc6a537aF587D48316feE66E9C8c"
      values.$implementation:
-        "0x8daEa53b17a629918CDFAB785C5c74077c1D895B"
+        "eth:0x8daEa53b17a629918CDFAB785C5c74077c1D895B"
      values.$pastUpgrades.0.2.0:
-        "0x8daEa53b17a629918CDFAB785C5c74077c1D895B"
+        "eth:0x8daEa53b17a629918CDFAB785C5c74077c1D895B"
      values.accounting:
-        "0x4d72BFF1BeaC69925F8Bd12526a39BAAb069e5Da"
+        "eth:0x4d72BFF1BeaC69925F8Bd12526a39BAAb069e5Da"
      values.earlyAdoption:
-        "0x3D5148ad93e2ae5DedD1f7A8B3C19E7F67F90c0E"
+        "eth:0x3D5148ad93e2ae5DedD1f7A8B3C19E7F67F90c0E"
      values.LIDO_LOCATOR:
-        "0xC1d0b3DE6792Bf6b4b37EccdcC24e45978Cfd2Eb"
+        "eth:0xC1d0b3DE6792Bf6b4b37EccdcC24e45978Cfd2Eb"
      values.proxy__getAdmin:
-        "0x3e40D73EB977Dc6a537aF587D48316feE66E9C8c"
+        "eth:0x3e40D73EB977Dc6a537aF587D48316feE66E9C8c"
      values.proxy__getImplementation:
-        "0x8daEa53b17a629918CDFAB785C5c74077c1D895B"
+        "eth:0x8daEa53b17a629918CDFAB785C5c74077c1D895B"
      values.STETH:
-        "0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84"
+        "eth:0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84"
      implementationNames.0xdA7dE2ECdDfccC6c3AF10108Db212ACBBf9EA83F:
-        "OssifiableProxy"
      implementationNames.0x8daEa53b17a629918CDFAB785C5c74077c1D895B:
-        "CSModule"
      implementationNames.eth:0xdA7dE2ECdDfccC6c3AF10108Db212ACBBf9EA83F:
+        "OssifiableProxy"
      implementationNames.eth:0x8daEa53b17a629918CDFAB785C5c74077c1D895B:
+        "CSModule"
    }
```

```diff
    EOA  (0xdd8fee09281D42F26e537e208c81772cB7FE16AD) {
    +++ description: None
      address:
-        "0xdd8fee09281D42F26e537e208c81772cB7FE16AD"
+        "eth:0xdd8fee09281D42F26e537e208c81772cB7FE16AD"
    }
```

```diff
    EOA  (0xDe27666796568984C40cD4A3630396B1570816B5) {
    +++ description: None
      address:
-        "0xDe27666796568984C40cD4A3630396B1570816B5"
+        "eth:0xDe27666796568984C40cD4A3630396B1570816B5"
    }
```

```diff
    EOA  (0xe41eAFB2746cb2Ac8A88eD8310e38501D7886330) {
    +++ description: None
      address:
-        "0xe41eAFB2746cb2Ac8A88eD8310e38501D7886330"
+        "eth:0xe41eAFB2746cb2Ac8A88eD8310e38501D7886330"
    }
```

```diff
    EOA  (0xe57B3792aDCc5da47EF4fF588883F0ee0c9835C9) {
    +++ description: None
      address:
-        "0xe57B3792aDCc5da47EF4fF588883F0ee0c9835C9"
+        "eth:0xe57B3792aDCc5da47EF4fF588883F0ee0c9835C9"
    }
```

```diff
    contract TokenRateNotifier (0xe6793B9e4FbA7DE0ee833F9D02bba7DB5EB27823) {
    +++ description: None
      address:
-        "0xe6793B9e4FbA7DE0ee833F9D02bba7DB5EB27823"
+        "eth:0xe6793B9e4FbA7DE0ee833F9D02bba7DB5EB27823"
      values.LIDO:
-        "0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84"
+        "eth:0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84"
      values.observers.0:
-        "0xd54c1c6413caac3477AC14b2a80D5398E3c32FfE"
+        "eth:0xd54c1c6413caac3477AC14b2a80D5398E3c32FfE"
      values.owner:
-        "0x3e40D73EB977Dc6a537aF587D48316feE66E9C8c"
+        "eth:0x3e40D73EB977Dc6a537aF587D48316feE66E9C8c"
      implementationNames.0xe6793B9e4FbA7DE0ee833F9D02bba7DB5EB27823:
-        "TokenRateNotifier"
      implementationNames.eth:0xe6793B9e4FbA7DE0ee833F9D02bba7DB5EB27823:
+        "TokenRateNotifier"
    }
```

```diff
    EOA  (0xE8F167Ad63F0Ca84C41afcf7E7C8BA7c7482cb95) {
    +++ description: None
      address:
-        "0xE8F167Ad63F0Ca84C41afcf7E7C8BA7c7482cb95"
+        "eth:0xE8F167Ad63F0Ca84C41afcf7E7C8BA7c7482cb95"
    }
```

```diff
    EOA  (0xea835d74f32BAfb03d59040bB67CC028ce1E6c31) {
    +++ description: None
      address:
-        "0xea835d74f32BAfb03d59040bB67CC028ce1E6c31"
+        "eth:0xea835d74f32BAfb03d59040bB67CC028ce1E6c31"
    }
```

```diff
    EOA  (0xefB3Bed7dee14059C35c34CF289C46Ae0811654e) {
    +++ description: None
      address:
-        "0xefB3Bed7dee14059C35c34CF289C46Ae0811654e"
+        "eth:0xefB3Bed7dee14059C35c34CF289C46Ae0811654e"
    }
```

```diff
    EOA  (0xF6AB8BD99EfE2515C45d6FeE8Ea32738877EFbD8) {
    +++ description: None
      address:
-        "0xF6AB8BD99EfE2515C45d6FeE8Ea32738877EFbD8"
+        "eth:0xF6AB8BD99EfE2515C45d6FeE8Ea32738877EFbD8"
    }
```

```diff
    EOA  (0xf82D88217C249297C6037BA77CE34b3d8a90ab43) {
    +++ description: None
      address:
-        "0xf82D88217C249297C6037BA77CE34b3d8a90ab43"
+        "eth:0xf82D88217C249297C6037BA77CE34b3d8a90ab43"
    }
```

```diff
    EOA  (0xfaECfa5E4180dd55D15396F804Fd00C6dbA233B0) {
    +++ description: None
      address:
-        "0xfaECfa5E4180dd55D15396F804Fd00C6dbA233B0"
+        "eth:0xfaECfa5E4180dd55D15396F804Fd00C6dbA233B0"
    }
```

```diff
    contract StakingRouter (0xFdDf38947aFB03C621C71b06C9C70bce73f12999) {
    +++ description: None
      address:
-        "0xFdDf38947aFB03C621C71b06C9C70bce73f12999"
+        "eth:0xFdDf38947aFB03C621C71b06C9C70bce73f12999"
      values.$admin:
-        "0x3e40D73EB977Dc6a537aF587D48316feE66E9C8c"
+        "eth:0x3e40D73EB977Dc6a537aF587D48316feE66E9C8c"
      values.$implementation:
-        "0x89eDa99C0551d4320b56F82DDE8dF2f8D2eF81aA"
+        "eth:0x89eDa99C0551d4320b56F82DDE8dF2f8D2eF81aA"
      values.$pastUpgrades.0.2.0:
-        "0x6F6541C2203196fEeDd14CD2C09550dA1CbEDa31"
+        "eth:0x6F6541C2203196fEeDd14CD2C09550dA1CbEDa31"
      values.$pastUpgrades.1.2.0:
-        "0xD8784e748f59Ba711fB5643191Ec3fAdD50Fb6df"
+        "eth:0xD8784e748f59Ba711fB5643191Ec3fAdD50Fb6df"
      values.$pastUpgrades.2.2.0:
-        "0x89eDa99C0551d4320b56F82DDE8dF2f8D2eF81aA"
+        "eth:0x89eDa99C0551d4320b56F82DDE8dF2f8D2eF81aA"
      values.DEPOSIT_CONTRACT:
-        "0x00000000219ab540356cBB839Cbe05303d7705Fa"
+        "eth:0x00000000219ab540356cBB839Cbe05303d7705Fa"
      values.getLido:
-        "0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84"
+        "eth:0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84"
      values.proxy__getAdmin:
-        "0x3e40D73EB977Dc6a537aF587D48316feE66E9C8c"
+        "eth:0x3e40D73EB977Dc6a537aF587D48316feE66E9C8c"
      values.proxy__getImplementation:
-        "0x89eDa99C0551d4320b56F82DDE8dF2f8D2eF81aA"
+        "eth:0x89eDa99C0551d4320b56F82DDE8dF2f8D2eF81aA"
      implementationNames.0xFdDf38947aFB03C621C71b06C9C70bce73f12999:
-        "OssifiableProxy"
      implementationNames.0x89eDa99C0551d4320b56F82DDE8dF2f8D2eF81aA:
-        "StakingRouter"
      implementationNames.eth:0xFdDf38947aFB03C621C71b06C9C70bce73f12999:
+        "OssifiableProxy"
      implementationNames.eth:0x89eDa99C0551d4320b56F82DDE8dF2f8D2eF81aA:
+        "StakingRouter"
    }
```

```diff
    EOA  (0xFf713991196F8a9D6838bA82C9Bb3579F8Cc0D90) {
    +++ description: None
      address:
-        "0xFf713991196F8a9D6838bA82C9Bb3579F8Cc0D90"
+        "eth:0xFf713991196F8a9D6838bA82C9Bb3579F8Cc0D90"
    }
```

```diff
    contract DepositSecurityModule (0xfFA96D84dEF2EA035c7AB153D8B991128e3d72fD) {
    +++ description: None
      address:
-        "0xfFA96D84dEF2EA035c7AB153D8B991128e3d72fD"
+        "eth:0xfFA96D84dEF2EA035c7AB153D8B991128e3d72fD"
      values.DEPOSIT_CONTRACT:
-        "0x00000000219ab540356cBB839Cbe05303d7705Fa"
+        "eth:0x00000000219ab540356cBB839Cbe05303d7705Fa"
      values.getGuardians.0:
-        "0x5fd0dDbC3351d009eb3f88DE7Cd081a614C519F1"
+        "eth:0x5fd0dDbC3351d009eb3f88DE7Cd081a614C519F1"
      values.getGuardians.1:
-        "0x7912Fa976BcDe9c2cf728e213e892AD7588E6AaF"
+        "eth:0x7912Fa976BcDe9c2cf728e213e892AD7588E6AaF"
      values.getGuardians.2:
-        "0x14D5d5B71E048d2D75a39FfC5B407e3a3AB6F314"
+        "eth:0x14D5d5B71E048d2D75a39FfC5B407e3a3AB6F314"
      values.getGuardians.3:
-        "0xf82D88217C249297C6037BA77CE34b3d8a90ab43"
+        "eth:0xf82D88217C249297C6037BA77CE34b3d8a90ab43"
      values.getGuardians.4:
-        "0xa56b128Ea2Ea237052b0fA2a96a387C0E43157d8"
+        "eth:0xa56b128Ea2Ea237052b0fA2a96a387C0E43157d8"
      values.getGuardians.5:
-        "0xd4EF84b638B334699bcf5AF4B0410B8CCD71943f"
+        "eth:0xd4EF84b638B334699bcf5AF4B0410B8CCD71943f"
      values.getOwner:
-        "0x3e40D73EB977Dc6a537aF587D48316feE66E9C8c"
+        "eth:0x3e40D73EB977Dc6a537aF587D48316feE66E9C8c"
      values.LIDO:
-        "0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84"
+        "eth:0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84"
      values.STAKING_ROUTER:
-        "0xFdDf38947aFB03C621C71b06C9C70bce73f12999"
+        "eth:0xFdDf38947aFB03C621C71b06C9C70bce73f12999"
      implementationNames.0xfFA96D84dEF2EA035c7AB153D8B991128e3d72fD:
-        "DepositSecurityModule"
      implementationNames.eth:0xfFA96D84dEF2EA035c7AB153D8B991128e3d72fD:
+        "DepositSecurityModule"
    }
```

```diff
    EOA  (0xFFfFfFffFFfffFFfFFfFFFFFffFFFffffFfFFFfF) {
    +++ description: None
      address:
-        "0xFFfFfFffFFfffFFfFFfFFFFFffFFFffffFfFFFfF"
+        "eth:0xFFfFfFffFFfffFFfFFfFFFFFffFFFffffFfFFFfF"
    }
```

```diff
+   Status: CREATED
    contract DepositContract (0x00000000219ab540356cBB839Cbe05303d7705Fa)
    +++ description: Ethereum Beacon Chain deposit contract.
```

```diff
+   Status: CREATED
    contract SimpleMultiSig (0x0644Bd0248d5F89e4F6E845a91D15c23591e5D33)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ValidatorsExitBusOracle (0x0De4Ea0184c2ad0BacA7183356Aea5B8d5Bf5c6e)
    +++ description: None
```

```diff
+   Status: CREATED
    contract SimpleMultiSig (0x137Dcd97872dE27a4d3bf36A4643c5e18FA40713)
    +++ description: None
```

```diff
+   Status: CREATED
    contract SimpleMultiSig (0x38699d04656fF537ef8671b6b595402ebDBdf6f4)
    +++ description: None
```

```diff
+   Status: CREATED
    contract LidoExecutionLayerRewardsVault (0x388C818CA8B9251b393131C08a736A67ccB19297)
    +++ description: None
```

```diff
+   Status: CREATED
    contract CSEarlyAdoption (0x3D5148ad93e2ae5DedD1f7A8B3C19E7F67F90c0E)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Lido Dao Agent (0x3e40D73EB977Dc6a537aF587D48316feE66E9C8c)
    +++ description: Custom role-based operations entrypoint for Lido.
```

```diff
+   Status: CREATED
    contract LegacyOracle (0x442af784A788A5bd6F42A01Ebe9F287a871243fb)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Paxos Gold Token (0x45804880De22913dAFE09f4980848ECE6EcbAf78)
    +++ description: None
```

```diff
+   Status: CREATED
    contract CSFeeOracle (0x4D4074628678Bd302921c20573EEa1ed38DdF7FB)
    +++ description: None
```

```diff
+   Status: CREATED
    contract CSAccounting (0x4d72BFF1BeaC69925F8Bd12526a39BAAb069e5Da)
    +++ description: None
```

```diff
+   Status: CREATED
    contract NodeOperatorsRegistry (0x55032650b14df07b85bF18A3a3eC8E0Af2e028d5)
    +++ description: None
```

```diff
+   Status: CREATED
    contract OracleReportSanityChecker (0x6232397ebac4f5772e53285B26c47914E9461E75)
    +++ description: None
```

```diff
+   Status: CREATED
    contract HashConsensus (0x71093efF8D8599b5fA340D665Ad60fA7C80688e4)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Wrapped liquid staked Ether 2.0 Token (0x7f39C581F595B53c5cb19bD0b3f8dA6c935E2Ca0)
    +++ description: None
```

```diff
+   Status: CREATED
    contract HashConsensus (0x7FaDB6358950c5fAA66Cb5EB8eE5147De3df355a)
    +++ description: None
```

```diff
+   Status: CREATED
    contract AccountingOracle (0x852deD011285fe67063a08005c71a85690503Cee)
    +++ description: None
```

```diff
+   Status: CREATED
    contract EVMScriptRegistry (0x853cc0D5917f49B57B8e9F89e491F5E18919093A)
    +++ description: None
```

```diff
+   Status: CREATED
    contract WithdrawalQueueERC721 (0x889edC2eDab5f40e902b864aD4d7AdE8E412F9B1)
    +++ description: None
```

```diff
+   Status: CREATED
    contract EIP712StETH (0x8F73e4C2A6D852bb4ab2A45E6a9CF5715b3228B7)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Safe (0x909d0CB383Ecc77e44daE5d0146cF476f611f62b)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ACL (0x9895F0F17cc1d1891b6f18ee0b483B6f221b37Bb)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Liquid staked Ether 2.0 Token (0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84)
    +++ description: None
```

```diff
+   Status: CREATED
    contract NodeOperatorsRegistry (0xaE7B191A31f627b4eB1d4DaC64eaB9976995b433)
    +++ description: None
```

```diff
+   Status: CREATED
    contract GnosisSafe (0xB18BB767638Bca324d158B7C7189e1a28aeB9EB4)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Kernel (0xb8FFC3Cd6e7Cf5a098A1c92F48009765B24088Dc)
    +++ description: None
```

```diff
+   Status: CREATED
    contract WithdrawalVault (0xB9D7934878B5FB9610B3fE8A5e441e8fad7E293f)
    +++ description: None
```

```diff
+   Status: CREATED
    contract OracleDaemonConfig (0xbf05A929c3D7885a6aeAd833a992dA6E5ac23b09)
    +++ description: None
```

```diff
+   Status: CREATED
    contract LidoLocator (0xC1d0b3DE6792Bf6b4b37EccdcC24e45978Cfd2Eb)
    +++ description: None
```

```diff
+   Status: CREATED
    contract StarkNet Token (0xCa14007Eff0dB1f8135f4C25B34De49AB0d42766)
    +++ description: None
```

```diff
+   Status: CREATED
    contract MintManager (0xCa14076A3cec95448BaD179cc19B351A4204B88B)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Burner (0xD15a672319Cf0352560eE76d9e89eAB0889046D3)
    +++ description: None
```

```diff
+   Status: CREATED
    contract OpStackTokenRatePusher (0xd54c1c6413caac3477AC14b2a80D5398E3c32FfE)
    +++ description: None
```

```diff
+   Status: CREATED
    contract HashConsensus (0xD624B08C83bAECF0807Dd2c6880C3154a5F0B288)
    +++ description: None
```

```diff
+   Status: CREATED
    contract CSFeeDistributor (0xD99CC66fEC647E68294C6477B40fC7E0F6F618D0)
    +++ description: None
```

```diff
+   Status: CREATED
    contract CSModule (0xdA7dE2ECdDfccC6c3AF10108Db212ACBBf9EA83F)
    +++ description: None
```

```diff
+   Status: CREATED
    contract TokenRateNotifier (0xe6793B9e4FbA7DE0ee833F9D02bba7DB5EB27823)
    +++ description: None
```

```diff
+   Status: CREATED
    contract StakingRouter (0xFdDf38947aFB03C621C71b06C9C70bce73f12999)
    +++ description: None
```

```diff
+   Status: CREATED
    contract DepositSecurityModule (0xfFA96D84dEF2EA035c7AB153D8B991128e3d72fD)
    +++ description: None
```

Generated with discovered.json: 0x3c5ddfbb92b9469779c8e5e8dceaddcdef8191b2

# Diff at Thu, 10 Jul 2025 15:33:13 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@f69ff944dc2501a54a7c05f54d37308d5262553d block: 22615727
- current block number: 22889418

## Description

lido update: 
- recovery vault unset (was set to Lido DAO Agent.)
- Lido Withdrawal vault now admin'd by Lido DAO Agent

add PAXG

## Watched changes

```diff
-   Status: DELETED
    contract Voting (0x2e59A20f205bB85a89C53f1936454680651E618e)
    +++ description: None
```

```diff
    contract Lido Dao Agent (0x3e40D73EB977Dc6a537aF587D48316feE66E9C8c) {
    +++ description: Custom role-based operations entrypoint for Lido.
      values.getRecoveryVault:
-        "0x3e40D73EB977Dc6a537aF587D48316feE66E9C8c"
+        "0x0000000000000000000000000000000000000000"
      receivedPermissions.5:
+        {"permission":"upgrade","from":"eth:0xB9D7934878B5FB9610B3fE8A5e441e8fad7E293f","role":"admin"}
    }
```

```diff
    contract LegacyOracle (0x442af784A788A5bd6F42A01Ebe9F287a871243fb) {
    +++ description: None
      values.getRecoveryVault:
-        "0x3e40D73EB977Dc6a537aF587D48316feE66E9C8c"
+        "0x0000000000000000000000000000000000000000"
    }
```

```diff
    contract NodeOperatorsRegistry (0x55032650b14df07b85bF18A3a3eC8E0Af2e028d5) {
    +++ description: None
      values.getRecoveryVault:
-        "0x3e40D73EB977Dc6a537aF587D48316feE66E9C8c"
+        "0x0000000000000000000000000000000000000000"
    }
```

```diff
-   Status: DELETED
    contract Lido DAO Token (0x5A98FcBEA516Cf06857215779Fd812CA3beF1B32)
    +++ description: None
```

```diff
    contract EVMScriptRegistry (0x853cc0D5917f49B57B8e9F89e491F5E18919093A) {
    +++ description: None
      values.getRecoveryVault:
-        "0x3e40D73EB977Dc6a537aF587D48316feE66E9C8c"
+        "0x0000000000000000000000000000000000000000"
    }
```

```diff
-   Status: DELETED
    contract MiniMeTokenFactory (0x909d05F384D0663eD4BE59863815aB43b4f347Ec)
    +++ description: None
```

```diff
    contract ACL (0x9895F0F17cc1d1891b6f18ee0b483B6f221b37Bb) {
    +++ description: None
      values.getRecoveryVault:
-        "0x3e40D73EB977Dc6a537aF587D48316feE66E9C8c"
+        "0x0000000000000000000000000000000000000000"
    }
```

```diff
    contract Liquid staked Ether 2.0 Token (0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84) {
    +++ description: None
      values.getRecoveryVault:
-        "0x3e40D73EB977Dc6a537aF587D48316feE66E9C8c"
+        "0x0000000000000000000000000000000000000000"
    }
```

```diff
    contract NodeOperatorsRegistry (0xaE7B191A31f627b4eB1d4DaC64eaB9976995b433) {
    +++ description: None
      values.getRecoveryVault:
-        "0x3e40D73EB977Dc6a537aF587D48316feE66E9C8c"
+        "0x0000000000000000000000000000000000000000"
    }
```

```diff
    contract Kernel (0xb8FFC3Cd6e7Cf5a098A1c92F48009765B24088Dc) {
    +++ description: None
      values.getRecoveryVault:
-        "0x3e40D73EB977Dc6a537aF587D48316feE66E9C8c"
+        "0x0000000000000000000000000000000000000000"
      values.recoveryVaultAppId:
-        "0x701a4fd1f5174d12a0f1d9ad2c88d0ad11ab6aad0ac72b7d9ce621815f8016a9"
+        "0x0000000000000000000000000000000000000000000000000000000000000000"
    }
```

```diff
    contract WithdrawalVault (0xB9D7934878B5FB9610B3fE8A5e441e8fad7E293f) {
    +++ description: None
      values.$admin:
-        "0x2e59A20f205bB85a89C53f1936454680651E618e"
+        "0x3e40D73EB977Dc6a537aF587D48316feE66E9C8c"
      values.proxy_getAdmin:
-        "0x2e59A20f205bB85a89C53f1936454680651E618e"
+        "0x3e40D73EB977Dc6a537aF587D48316feE66E9C8c"
    }
```

```diff
-   Status: DELETED
    contract TokenManager (0xf73a1260d222f447210581DDf212D915c09a3249)
    +++ description: None
```

## Source code changes

```diff
.../.flat@22615727/Lido DAO Token.sol => /dev/null |  496 ------
 .../MiniMeTokenFactory.sol => /dev/null            |   38 -
 .../AppProxyUpgradeable.p.sol => /dev/null         |  241 ---
 .../TokenManager/TokenManager.sol => /dev/null     | 1209 ---------------
 .../Voting/AppProxyUpgradeable.p.sol => /dev/null  |  241 ---
 .../.flat@22615727/Voting/Voting.sol => /dev/null  | 1639 --------------------
 6 files changed, 3864 deletions(-)
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22615727 (main branch discovery), not current.

```diff
+   Status: CREATED
    contract SimpleMultiSig (0x0644Bd0248d5F89e4F6E845a91D15c23591e5D33)
    +++ description: None
```

```diff
+   Status: CREATED
    contract SimpleMultiSig (0x137Dcd97872dE27a4d3bf36A4643c5e18FA40713)
    +++ description: None
```

```diff
+   Status: CREATED
    contract SimpleMultiSig (0x38699d04656fF537ef8671b6b595402ebDBdf6f4)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Paxos Gold Token (0x45804880De22913dAFE09f4980848ECE6EcbAf78)
    +++ description: None
```

Generated with discovered.json: 0x9af9ae61be52d74c0c9f9f0702de8de8e58778c4

# Diff at Fri, 04 Jul 2025 12:19:26 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@1f56dc47fe915564d4555300304da4d3bcbc087f block: 22615727
- current block number: 22615727

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22615727 (main branch discovery), not current.

```diff
    contract Voting (0x2e59A20f205bB85a89C53f1936454680651E618e) {
    +++ description: None
      receivedPermissions.0.from:
-        "ethereum:0xB9D7934878B5FB9610B3fE8A5e441e8fad7E293f"
+        "eth:0xB9D7934878B5FB9610B3fE8A5e441e8fad7E293f"
    }
```

```diff
    contract Lido Dao Agent (0x3e40D73EB977Dc6a537aF587D48316feE66E9C8c) {
    +++ description: Custom role-based operations entrypoint for Lido.
      receivedPermissions.0.from:
-        "ethereum:0x0De4Ea0184c2ad0BacA7183356Aea5B8d5Bf5c6e"
+        "eth:0x0De4Ea0184c2ad0BacA7183356Aea5B8d5Bf5c6e"
      receivedPermissions.1.from:
-        "ethereum:0x4D4074628678Bd302921c20573EEa1ed38DdF7FB"
+        "eth:0x4D4074628678Bd302921c20573EEa1ed38DdF7FB"
      receivedPermissions.2.from:
-        "ethereum:0x4d72BFF1BeaC69925F8Bd12526a39BAAb069e5Da"
+        "eth:0x4d72BFF1BeaC69925F8Bd12526a39BAAb069e5Da"
      receivedPermissions.3.from:
-        "ethereum:0x852deD011285fe67063a08005c71a85690503Cee"
+        "eth:0x852deD011285fe67063a08005c71a85690503Cee"
      receivedPermissions.4.from:
-        "ethereum:0x889edC2eDab5f40e902b864aD4d7AdE8E412F9B1"
+        "eth:0x889edC2eDab5f40e902b864aD4d7AdE8E412F9B1"
      receivedPermissions.5.from:
-        "ethereum:0xC1d0b3DE6792Bf6b4b37EccdcC24e45978Cfd2Eb"
+        "eth:0xC1d0b3DE6792Bf6b4b37EccdcC24e45978Cfd2Eb"
      receivedPermissions.6.from:
-        "ethereum:0xD99CC66fEC647E68294C6477B40fC7E0F6F618D0"
+        "eth:0xD99CC66fEC647E68294C6477B40fC7E0F6F618D0"
      receivedPermissions.7.from:
-        "ethereum:0xdA7dE2ECdDfccC6c3AF10108Db212ACBBf9EA83F"
+        "eth:0xdA7dE2ECdDfccC6c3AF10108Db212ACBBf9EA83F"
      receivedPermissions.8.from:
-        "ethereum:0xFdDf38947aFB03C621C71b06C9C70bce73f12999"
+        "eth:0xFdDf38947aFB03C621C71b06C9C70bce73f12999"
    }
```

```diff
    contract Safe (0x909d0CB383Ecc77e44daE5d0146cF476f611f62b) {
    +++ description: None
      receivedPermissions.0.from:
-        "ethereum:0xCa14076A3cec95448BaD179cc19B351A4204B88B"
+        "eth:0xCa14076A3cec95448BaD179cc19B351A4204B88B"
    }
```

Generated with discovered.json: 0xc2c3349d85d03772c28593994df3299d77bbc325

# Diff at Mon, 02 Jun 2025 08:12:37 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@2fee84b782a329885c84742cf9cf43143842a2d5 block: 22587696
- current block number: 22615727

## Description

Oracle limit adjustments for lido.

## Watched changes

```diff
    contract OracleReportSanityChecker (0x6232397ebac4f5772e53285B26c47914E9461E75) {
    +++ description: None
      values.getOracleReportLimits.exitedValidatorsPerDayLimit:
-        9000
+        3600
      values.getOracleReportLimits.appearedValidatorsPerDayLimit:
-        43200
+        1800
      values.getOracleReportLimits.initialSlashingAmountPWei:
-        1000
+        8
    }
```

```diff
    contract CSModule (0xdA7dE2ECdDfccC6c3AF10108Db212ACBBf9EA83F) {
    +++ description: None
      values.keyRemovalCharge:
-        "50000000000000000"
+        "20000000000000000"
    }
```

Generated with discovered.json: 0x27b306eae0c1a10ca0ab1b31e149d79dbccff513

# Diff at Thu, 29 May 2025 13:13:30 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@9aa89f1c179f09ddb4f24aed66c1bd0315f063a3 block: 22445558
- current block number: 22587696

## Description

add some templates

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22445558 (main branch discovery), not current.

```diff
    contract Lido Dao Agent (0x3e40D73EB977Dc6a537aF587D48316feE66E9C8c) {
    +++ description: Custom role-based operations entrypoint for Lido.
      receivedPermissions.8:
+        {"permission":"upgrade","from":"0xFdDf38947aFB03C621C71b06C9C70bce73f12999","role":"admin"}
      receivedPermissions.7.from:
-        "0xFdDf38947aFB03C621C71b06C9C70bce73f12999"
+        "0x4D4074628678Bd302921c20573EEa1ed38DdF7FB"
      template:
+        "tokens/Lido/LidoDaoAgent"
      description:
+        "Custom role-based operations entrypoint for Lido."
    }
```

```diff
+   Status: CREATED
    contract CSFeeOracle (0x4D4074628678Bd302921c20573EEa1ed38DdF7FB)
    +++ description: None
```

```diff
+   Status: CREATED
    contract HashConsensus (0x71093efF8D8599b5fA340D665Ad60fA7C80688e4)
    +++ description: None
```

Generated with discovered.json: 0x27200017b87c83f1865932aec752a3c1c777eb50

# Diff at Wed, 28 May 2025 13:56:28 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@498e4fbc23b0148c96248f03ca33a8415e632b71 block: 22445558
- current block number: 22445558

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22445558 (main branch discovery), not current.

```diff
    contract Lido DAO Token (0x5A98FcBEA516Cf06857215779Fd812CA3beF1B32) {
    +++ description: None
      name:
-        "MiniMeToken"
+        "Lido DAO Token"
    }
```

```diff
    contract Wrapped liquid staked Ether 2.0 Token (0x7f39C581F595B53c5cb19bD0b3f8dA6c935E2Ca0) {
    +++ description: None
      name:
-        "wstETH_tokenContract"
+        "Wrapped liquid staked Ether 2.0 Token"
    }
```

```diff
    contract Liquid staked Ether 2.0 Token (0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84) {
    +++ description: None
      name:
-        "stETH_tokenContract"
+        "Liquid staked Ether 2.0 Token"
    }
```

```diff
    contract StarkNet Token (0xCa14007Eff0dB1f8135f4C25B34De49AB0d42766) {
    +++ description: None
      name:
-        "STRK_tokenContract"
+        "StarkNet Token"
    }
```

Generated with discovered.json: 0x3345d3d697a64417e2a093827d2ba764e6b78f8b

# Diff at Fri, 23 May 2025 09:41:15 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@69cd181abbc3c830a6caf2f4429b37cae72ffdb8 block: 22445558
- current block number: 22445558

## Description

Introduced .role field on each permission, defaulting to field name on which it was defined (with '.' prefix)

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22445558 (main branch discovery), not current.

```diff
    contract Voting (0x2e59A20f205bB85a89C53f1936454680651E618e) {
    +++ description: None
      receivedPermissions.0.role:
+        "admin"
    }
```

```diff
    contract Lido Dao Agent (0x3e40D73EB977Dc6a537aF587D48316feE66E9C8c) {
    +++ description: None
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
+        "admin"
    }
```

```diff
    contract Safe (0x909d0CB383Ecc77e44daE5d0146cF476f611f62b) {
    +++ description: None
      receivedPermissions.0.role:
+        "admin"
    }
```

Generated with discovered.json: 0xa8e3f5dfc477b38a35cb083e59ce1aa6c9eeabb5

# Diff at Fri, 09 May 2025 11:17:03 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@b9a3516de49f42efd9d26f04918d74a8d92c6204 block: 22438060
- current block number: 22445558

## Description

MS member changes.

## Watched changes

```diff
    contract Safe (0x909d0CB383Ecc77e44daE5d0146cF476f611f62b) {
    +++ description: None
      values.$members.15:
-        "0xc196985a8bAfcEcF9C29Cfb24E2fb81f80De53E7"
      values.$members.14:
-        "0x7383DDEd70cCCFd99835612C4148fA986e9DE560"
      values.$members.13:
-        "0x81C1B22c67731D3f0Bac506102Fe998361565874"
      values.$members.12:
-        "0x033b8521F357F813Cc87B08c0668f1b59FAE45e2"
      values.$members.11:
-        "0x68c6AfB39D2c6e22555175dDaE02d20e37d218f0"
+        "0x7383DDEd70cCCFd99835612C4148fA986e9DE560"
      values.$members.10:
-        "0x5C7DcaECB4D8e49Ea2487c5Cc23C5131Ddb2252F"
+        "0xF6AB8BD99EfE2515C45d6FeE8Ea32738877EFbD8"
      values.$members.9:
-        "0x16aB869E6dEe6eF9068E5cF75C1a5A57981257CD"
+        "0x5C7DcaECB4D8e49Ea2487c5Cc23C5131Ddb2252F"
      values.$members.8:
-        "0x2914767E232FD7708ab06bA60dB16c36C555751d"
+        "0x16aB869E6dEe6eF9068E5cF75C1a5A57981257CD"
      values.$members.7:
-        "0x10277B1922e56d1B69f4dCe5A35696C791F78cac"
+        "0x2914767E232FD7708ab06bA60dB16c36C555751d"
      values.$members.6:
-        "0x0762bCc4D604Aa3B5122C7D6571Cf5368EF3F09c"
+        "0x10277B1922e56d1B69f4dCe5A35696C791F78cac"
      values.$members.5:
-        "0xe810b82A815AC9d46FDA4D6FBfA8521864f04645"
+        "0x0762bCc4D604Aa3B5122C7D6571Cf5368EF3F09c"
      values.multisigThreshold:
-        "7 of 16 (44%)"
+        "7 of 12 (58%)"
    }
```

Generated with discovered.json: 0xfe6d5223ce5306e75372318dfc9144348c8695d2

# Diff at Wed, 07 May 2025 11:00:13 GMT:

- author: Sergey Shemyakov (<sergey.shemyakov@l2beat.com>)
- comparing to: main@370d0c8c1e8a1a622701270cc075f9413ad76ecd block: 22424710
- current block number: 22431247

## Description

Increased the number of minter multisig members from 12 to 16, threshold stayed unchanged.

## Watched changes

```diff
    contract Safe (0x909d0CB383Ecc77e44daE5d0146cF476f611f62b) {
    +++ description: None
      values.$members.15:
+        "0xc196985a8bAfcEcF9C29Cfb24E2fb81f80De53E7"
      values.$members.14:
+        "0x7383DDEd70cCCFd99835612C4148fA986e9DE560"
      values.$members.13:
+        "0x81C1B22c67731D3f0Bac506102Fe998361565874"
      values.$members.12:
+        "0x033b8521F357F813Cc87B08c0668f1b59FAE45e2"
      values.$members.11:
-        "0xc196985a8bAfcEcF9C29Cfb24E2fb81f80De53E7"
+        "0x68c6AfB39D2c6e22555175dDaE02d20e37d218f0"
      values.$members.10:
-        "0x7383DDEd70cCCFd99835612C4148fA986e9DE560"
+        "0x5C7DcaECB4D8e49Ea2487c5Cc23C5131Ddb2252F"
      values.$members.9:
-        "0x81C1B22c67731D3f0Bac506102Fe998361565874"
+        "0x16aB869E6dEe6eF9068E5cF75C1a5A57981257CD"
      values.$members.8:
-        "0x033b8521F357F813Cc87B08c0668f1b59FAE45e2"
+        "0x2914767E232FD7708ab06bA60dB16c36C555751d"
      values.$members.7:
-        "0x68c6AfB39D2c6e22555175dDaE02d20e37d218f0"
+        "0x10277B1922e56d1B69f4dCe5A35696C791F78cac"
      values.$members.6:
-        "0x16aB869E6dEe6eF9068E5cF75C1a5A57981257CD"
+        "0x0762bCc4D604Aa3B5122C7D6571Cf5368EF3F09c"
      values.$members.5:
-        "0x10277B1922e56d1B69f4dCe5A35696C791F78cac"
+        "0xe810b82A815AC9d46FDA4D6FBfA8521864f04645"
      values.$members.4:
-        "0xe810b82A815AC9d46FDA4D6FBfA8521864f04645"
+        "0x590Cb94bE977a769d9E7D95D9eff8DeAe82e430C"
      values.$members.3:
-        "0x590Cb94bE977a769d9E7D95D9eff8DeAe82e430C"
+        "0x04D5b12b196a8CADEB2F476F22Ffb1334Ef9F94c"
      values.multisigThreshold:
-        "7 of 12 (58%)"
+        "7 of 16 (44%)"
    }
```

Generated with discovered.json: 0x1019dedf2391a3023ca4e7717df51ade1c896aec

# Diff at Tue, 06 May 2025 12:38:29 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@797a9ec756b28fc8b608c3143fbee4e577108cbc block: 22123688
- current block number: 22424710

## Description

Bumped consensus version. This is the consensus/oracle used for validator exits because exits are currently not triggerable from L1 (will be solved with pectra).

## Watched changes

```diff
    contract ValidatorsExitBusOracle (0x0De4Ea0184c2ad0BacA7183356Aea5B8d5Bf5c6e) {
    +++ description: None
      values.getConsensusVersion:
-        2
+        3
    }
```

```diff
    contract AccountingOracle (0x852deD011285fe67063a08005c71a85690503Cee) {
    +++ description: None
      values.getConsensusVersion:
-        2
+        3
    }
```

Generated with discovered.json: 0x859feba5b2c382d43e277dd545561080e425a40e

# Diff at Tue, 29 Apr 2025 08:19:23 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@ef7477af00fe0b57a2f7cacf7e958c12494af662 block: 22123688
- current block number: 22123688

## Description

Field .issuedPermissions is removed from the output as no longer needed. Added 'permissionsConfigHash' due to refactoring of the modelling process (into a separate command).

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22123688 (main branch discovery), not current.

```diff
    contract ValidatorsExitBusOracle (0x0De4Ea0184c2ad0BacA7183356Aea5B8d5Bf5c6e) {
    +++ description: None
      issuedPermissions:
-        [{"permission":"upgrade","to":"0x3e40D73EB977Dc6a537aF587D48316feE66E9C8c","via":[]}]
    }
```

```diff
    contract CSAccounting (0x4d72BFF1BeaC69925F8Bd12526a39BAAb069e5Da) {
    +++ description: None
      issuedPermissions:
-        [{"permission":"upgrade","to":"0x3e40D73EB977Dc6a537aF587D48316feE66E9C8c","via":[]}]
    }
```

```diff
    contract AccountingOracle (0x852deD011285fe67063a08005c71a85690503Cee) {
    +++ description: None
      issuedPermissions:
-        [{"permission":"upgrade","to":"0x3e40D73EB977Dc6a537aF587D48316feE66E9C8c","via":[]}]
    }
```

```diff
    contract WithdrawalQueueERC721 (0x889edC2eDab5f40e902b864aD4d7AdE8E412F9B1) {
    +++ description: None
      issuedPermissions:
-        [{"permission":"upgrade","to":"0x3e40D73EB977Dc6a537aF587D48316feE66E9C8c","via":[]}]
    }
```

```diff
    contract WithdrawalVault (0xB9D7934878B5FB9610B3fE8A5e441e8fad7E293f) {
    +++ description: None
      issuedPermissions:
-        [{"permission":"upgrade","to":"0x2e59A20f205bB85a89C53f1936454680651E618e","via":[]}]
    }
```

```diff
    contract LidoLocator (0xC1d0b3DE6792Bf6b4b37EccdcC24e45978Cfd2Eb) {
    +++ description: None
      issuedPermissions:
-        [{"permission":"upgrade","to":"0x3e40D73EB977Dc6a537aF587D48316feE66E9C8c","via":[]}]
    }
```

```diff
    contract MintManager (0xCa14076A3cec95448BaD179cc19B351A4204B88B) {
    +++ description: None
      issuedPermissions:
-        [{"permission":"upgrade","to":"0x909d0CB383Ecc77e44daE5d0146cF476f611f62b","via":[]}]
    }
```

```diff
    contract CSFeeDistributor (0xD99CC66fEC647E68294C6477B40fC7E0F6F618D0) {
    +++ description: None
      issuedPermissions:
-        [{"permission":"upgrade","to":"0x3e40D73EB977Dc6a537aF587D48316feE66E9C8c","via":[]}]
    }
```

```diff
    contract CSModule (0xdA7dE2ECdDfccC6c3AF10108Db212ACBBf9EA83F) {
    +++ description: None
      issuedPermissions:
-        [{"permission":"upgrade","to":"0x3e40D73EB977Dc6a537aF587D48316feE66E9C8c","via":[]}]
    }
```

```diff
    contract StakingRouter (0xFdDf38947aFB03C621C71b06C9C70bce73f12999) {
    +++ description: None
      issuedPermissions:
-        [{"permission":"upgrade","to":"0x3e40D73EB977Dc6a537aF587D48316feE66E9C8c","via":[]}]
    }
```

Generated with discovered.json: 0x3017778cb63cabe14a9edede5cbf874232512f36

# Diff at Tue, 25 Mar 2025 11:42:40 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@b4a04714c0219993c2a83e7714e82e32f8a106ba block: 22017795
- current block number: 22123688

## Description

Voting time confs for Lido increased (~double).

## Watched changes

```diff
    contract Voting (0x2e59A20f205bB85a89C53f1936454680651E618e) {
    +++ description: None
      values.objectionPhaseTime:
-        86400
+        172800
      values.voteTime:
-        259200
+        432000
    }
```

Generated with discovered.json: 0x542c9e1dc004624b1c7a835c392321d8b0f29085

# Diff at Tue, 18 Mar 2025 08:14:25 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@4ef7a8dbcec1cd9fec77aae2b73d81347a4ffb13 block: 22017795
- current block number: 22017795

## Description

Config: change Multisig names.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22017795 (main branch discovery), not current.

```diff
    contract Lido Dao Agent (0x3e40D73EB977Dc6a537aF587D48316feE66E9C8c) {
    +++ description: None
      name:
-        "LidoDaoAgent"
+        "Lido Dao Agent"
    }
```

Generated with discovered.json: 0xcc4a9f1c640a86b61bd22c6e6fc9b1007c0f4ce7

# Diff at Tue, 04 Mar 2025 10:40:09 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@98d260b45fe0d2195ce5e629bd7b200c8706e8ba block: 21938183
- current block number: 21938183

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21938183 (main branch discovery), not current.

```diff
    contract DepositContract (0x00000000219ab540356cBB839Cbe05303d7705Fa) {
    +++ description: Ethereum Beacon Chain deposit contract.
      sinceBlock:
+        11052984
    }
```

```diff
    contract ValidatorsExitBusOracle (0x0De4Ea0184c2ad0BacA7183356Aea5B8d5Bf5c6e) {
    +++ description: None
      sinceBlock:
+        17172556
    }
```

```diff
    contract Voting (0x2e59A20f205bB85a89C53f1936454680651E618e) {
    +++ description: None
      sinceBlock:
+        11473216
    }
```

```diff
    contract LidoExecutionLayerRewardsVault (0x388C818CA8B9251b393131C08a736A67ccB19297) {
    +++ description: None
      sinceBlock:
+        14834805
    }
```

```diff
    contract CSEarlyAdoption (0x3D5148ad93e2ae5DedD1f7A8B3C19E7F67F90c0E) {
    +++ description: None
      sinceBlock:
+        20935463
    }
```

```diff
    contract LidoDaoAgent (0x3e40D73EB977Dc6a537aF587D48316feE66E9C8c) {
    +++ description: None
      sinceBlock:
+        11473216
    }
```

```diff
    contract LegacyOracle (0x442af784A788A5bd6F42A01Ebe9F287a871243fb) {
    +++ description: None
      sinceBlock:
+        11473216
    }
```

```diff
    contract CSAccounting (0x4d72BFF1BeaC69925F8Bd12526a39BAAb069e5Da) {
    +++ description: None
      sinceBlock:
+        20935462
    }
```

```diff
    contract NodeOperatorsRegistry (0x55032650b14df07b85bF18A3a3eC8E0Af2e028d5) {
    +++ description: None
      sinceBlock:
+        11473216
    }
```

```diff
    contract MiniMeToken (0x5A98FcBEA516Cf06857215779Fd812CA3beF1B32) {
    +++ description: None
      sinceBlock:
+        11473216
    }
```

```diff
    contract OracleReportSanityChecker (0x6232397ebac4f5772e53285B26c47914E9461E75) {
    +++ description: None
      sinceBlock:
+        20921274
    }
```

```diff
    contract wstETH_tokenContract (0x7f39C581F595B53c5cb19bD0b3f8dA6c935E2Ca0) {
    +++ description: None
      sinceBlock:
+        11888477
    }
```

```diff
    contract HashConsensus (0x7FaDB6358950c5fAA66Cb5EB8eE5147De3df355a) {
    +++ description: None
      sinceBlock:
+        17172558
    }
```

```diff
    contract AccountingOracle (0x852deD011285fe67063a08005c71a85690503Cee) {
    +++ description: None
      sinceBlock:
+        17172553
    }
```

```diff
    contract EVMScriptRegistry (0x853cc0D5917f49B57B8e9F89e491F5E18919093A) {
    +++ description: None
      sinceBlock:
+        11473216
    }
```

```diff
    contract WithdrawalQueueERC721 (0x889edC2eDab5f40e902b864aD4d7AdE8E412F9B1) {
    +++ description: None
      sinceBlock:
+        17172547
    }
```

```diff
    contract EIP712StETH (0x8F73e4C2A6D852bb4ab2A45E6a9CF5715b3228B7) {
    +++ description: None
      sinceBlock:
+        17172546
    }
```

```diff
    contract MiniMeTokenFactory (0x909d05F384D0663eD4BE59863815aB43b4f347Ec) {
    +++ description: None
      sinceBlock:
+        6593191
    }
```

```diff
    contract Safe (0x909d0CB383Ecc77e44daE5d0146cF476f611f62b) {
    +++ description: None
      sinceBlock:
+        21222337
    }
```

```diff
    contract ACL (0x9895F0F17cc1d1891b6f18ee0b483B6f221b37Bb) {
    +++ description: None
      sinceBlock:
+        11473216
    }
```

```diff
    contract stETH_tokenContract (0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84) {
    +++ description: None
      sinceBlock:
+        11473216
    }
```

```diff
    contract NodeOperatorsRegistry (0xaE7B191A31f627b4eB1d4DaC64eaB9976995b433) {
    +++ description: None
      sinceBlock:
+        18731922
    }
```

```diff
    contract GnosisSafe (0xB18BB767638Bca324d158B7C7189e1a28aeB9EB4) {
    +++ description: None
      sinceBlock:
+        19232636
    }
```

```diff
    contract Kernel (0xb8FFC3Cd6e7Cf5a098A1c92F48009765B24088Dc) {
    +++ description: None
      sinceBlock:
+        11473216
    }
```

```diff
    contract WithdrawalVault (0xB9D7934878B5FB9610B3fE8A5e441e8fad7E293f) {
    +++ description: None
      sinceBlock:
+        12812480
    }
```

```diff
    contract OracleDaemonConfig (0xbf05A929c3D7885a6aeAd833a992dA6E5ac23b09) {
    +++ description: None
      sinceBlock:
+        17172469
    }
```

```diff
    contract LidoLocator (0xC1d0b3DE6792Bf6b4b37EccdcC24e45978Cfd2Eb) {
    +++ description: None
      sinceBlock:
+        17031323
    }
```

```diff
    contract STRK_tokenContract (0xCa14007Eff0dB1f8135f4C25B34De49AB0d42766) {
    +++ description: None
      sinceBlock:
+        15983290
    }
```

```diff
    contract MintManager (0xCa14076A3cec95448BaD179cc19B351A4204B88B) {
    +++ description: None
      sinceBlock:
+        21236399
    }
```

```diff
    contract Burner (0xD15a672319Cf0352560eE76d9e89eAB0889046D3) {
    +++ description: None
      sinceBlock:
+        17172559
    }
```

```diff
    contract OpStackTokenRatePusher (0xd54c1c6413caac3477AC14b2a80D5398E3c32FfE) {
    +++ description: None
      sinceBlock:
+        20584007
    }
```

```diff
    contract HashConsensus (0xD624B08C83bAECF0807Dd2c6880C3154a5F0B288) {
    +++ description: None
      sinceBlock:
+        17172555
    }
```

```diff
    contract CSFeeDistributor (0xD99CC66fEC647E68294C6477B40fC7E0F6F618D0) {
    +++ description: None
      sinceBlock:
+        20935463
    }
```

```diff
    contract CSModule (0xdA7dE2ECdDfccC6c3AF10108Db212ACBBf9EA83F) {
    +++ description: None
      sinceBlock:
+        20935462
    }
```

```diff
    contract TokenRateNotifier (0xe6793B9e4FbA7DE0ee833F9D02bba7DB5EB27823) {
    +++ description: None
      sinceBlock:
+        20584006
    }
```

```diff
    contract TokenManager (0xf73a1260d222f447210581DDf212D915c09a3249) {
    +++ description: None
      sinceBlock:
+        11473216
    }
```

```diff
    contract StakingRouter (0xFdDf38947aFB03C621C71b06C9C70bce73f12999) {
    +++ description: None
      sinceBlock:
+        17172550
    }
```

```diff
    contract DepositSecurityModule (0xfFA96D84dEF2EA035c7AB153D8B991128e3d72fD) {
    +++ description: None
      sinceBlock:
+        20921272
    }
```

Generated with discovered.json: 0x0f3b02dbacc0016e5e1e7bc0775e9434bdcab4ff

# Diff at Thu, 27 Feb 2025 14:44:28 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@6fe2d9909e2842e4f6333df986a5df30c18337ea block: 21922694
- current block number: 21938183

## Description

mute tokens disco.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21922694 (main branch discovery), not current.

```diff
    contract DepositContract (0x00000000219ab540356cBB839Cbe05303d7705Fa) {
    +++ description: Ethereum Beacon Chain deposit contract.
      template:
+        "global/DepositContract"
      description:
+        "Ethereum Beacon Chain deposit contract."
    }
```

```diff
    contract ValidatorsExitBusOracle (0x0De4Ea0184c2ad0BacA7183356Aea5B8d5Bf5c6e) {
    +++ description: None
      values.getLastProcessingRefSlot:
-        11135999
      template:
+        "tokens/Lido/ValidatorsExitBusOracle"
    }
```

```diff
    contract wstETH_tokenContract (0x7f39C581F595B53c5cb19bD0b3f8dA6c935E2Ca0) {
    +++ description: None
      name:
-        "WstETH"
+        "wstETH_tokenContract"
      displayName:
-        "wstETH_tokenContract"
    }
```

```diff
    contract stETH_tokenContract (0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84) {
    +++ description: None
      name:
-        "Lido"
+        "stETH_tokenContract"
      displayName:
-        "stETH_tokenContract"
    }
```

```diff
    contract STRK_tokenContract (0xCa14007Eff0dB1f8135f4C25B34De49AB0d42766) {
    +++ description: None
      name:
-        "StarkNetToken"
+        "STRK_tokenContract"
      displayName:
-        "STRK_tokenContract"
    }
```

Generated with discovered.json: 0x5a65b2e8697fdbcc17d906e8eb1eb7a55c4c894a

# Diff at Tue, 25 Feb 2025 13:08:53 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- current block number: 21922694

## Description

Initial discovery for tokens: STRK and Lido stETH / wstETH.

## Initial discovery

```diff
+   Status: CREATED
    contract DepositContract (0x00000000219ab540356cBB839Cbe05303d7705Fa)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ValidatorsExitBusOracle (0x0De4Ea0184c2ad0BacA7183356Aea5B8d5Bf5c6e)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Voting (0x2e59A20f205bB85a89C53f1936454680651E618e)
    +++ description: None
```

```diff
+   Status: CREATED
    contract LidoExecutionLayerRewardsVault (0x388C818CA8B9251b393131C08a736A67ccB19297)
    +++ description: None
```

```diff
+   Status: CREATED
    contract CSEarlyAdoption (0x3D5148ad93e2ae5DedD1f7A8B3C19E7F67F90c0E)
    +++ description: None
```

```diff
+   Status: CREATED
    contract LidoDaoAgent (0x3e40D73EB977Dc6a537aF587D48316feE66E9C8c)
    +++ description: None
```

```diff
+   Status: CREATED
    contract LegacyOracle (0x442af784A788A5bd6F42A01Ebe9F287a871243fb)
    +++ description: None
```

```diff
+   Status: CREATED
    contract CSAccounting (0x4d72BFF1BeaC69925F8Bd12526a39BAAb069e5Da)
    +++ description: None
```

```diff
+   Status: CREATED
    contract NodeOperatorsRegistry (0x55032650b14df07b85bF18A3a3eC8E0Af2e028d5)
    +++ description: None
```

```diff
+   Status: CREATED
    contract MiniMeToken (0x5A98FcBEA516Cf06857215779Fd812CA3beF1B32)
    +++ description: None
```

```diff
+   Status: CREATED
    contract OracleReportSanityChecker (0x6232397ebac4f5772e53285B26c47914E9461E75)
    +++ description: None
```

```diff
+   Status: CREATED
    contract WstETH (0x7f39C581F595B53c5cb19bD0b3f8dA6c935E2Ca0)
    +++ description: None
```

```diff
+   Status: CREATED
    contract HashConsensus (0x7FaDB6358950c5fAA66Cb5EB8eE5147De3df355a)
    +++ description: None
```

```diff
+   Status: CREATED
    contract AccountingOracle (0x852deD011285fe67063a08005c71a85690503Cee)
    +++ description: None
```

```diff
+   Status: CREATED
    contract EVMScriptRegistry (0x853cc0D5917f49B57B8e9F89e491F5E18919093A)
    +++ description: None
```

```diff
+   Status: CREATED
    contract WithdrawalQueueERC721 (0x889edC2eDab5f40e902b864aD4d7AdE8E412F9B1)
    +++ description: None
```

```diff
+   Status: CREATED
    contract EIP712StETH (0x8F73e4C2A6D852bb4ab2A45E6a9CF5715b3228B7)
    +++ description: None
```

```diff
+   Status: CREATED
    contract MiniMeTokenFactory (0x909d05F384D0663eD4BE59863815aB43b4f347Ec)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Safe (0x909d0CB383Ecc77e44daE5d0146cF476f611f62b)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ACL (0x9895F0F17cc1d1891b6f18ee0b483B6f221b37Bb)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Lido (0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84)
    +++ description: None
```

```diff
+   Status: CREATED
    contract NodeOperatorsRegistry (0xaE7B191A31f627b4eB1d4DaC64eaB9976995b433)
    +++ description: None
```

```diff
+   Status: CREATED
    contract GnosisSafe (0xB18BB767638Bca324d158B7C7189e1a28aeB9EB4)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Kernel (0xb8FFC3Cd6e7Cf5a098A1c92F48009765B24088Dc)
    +++ description: None
```

```diff
+   Status: CREATED
    contract WithdrawalVault (0xB9D7934878B5FB9610B3fE8A5e441e8fad7E293f)
    +++ description: None
```

```diff
+   Status: CREATED
    contract OracleDaemonConfig (0xbf05A929c3D7885a6aeAd833a992dA6E5ac23b09)
    +++ description: None
```

```diff
+   Status: CREATED
    contract LidoLocator (0xC1d0b3DE6792Bf6b4b37EccdcC24e45978Cfd2Eb)
    +++ description: None
```

```diff
+   Status: CREATED
    contract StarkNetToken (0xCa14007Eff0dB1f8135f4C25B34De49AB0d42766)
    +++ description: None
```

```diff
+   Status: CREATED
    contract MintManager (0xCa14076A3cec95448BaD179cc19B351A4204B88B)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Burner (0xD15a672319Cf0352560eE76d9e89eAB0889046D3)
    +++ description: None
```

```diff
+   Status: CREATED
    contract OpStackTokenRatePusher (0xd54c1c6413caac3477AC14b2a80D5398E3c32FfE)
    +++ description: None
```

```diff
+   Status: CREATED
    contract HashConsensus (0xD624B08C83bAECF0807Dd2c6880C3154a5F0B288)
    +++ description: None
```

```diff
+   Status: CREATED
    contract CSFeeDistributor (0xD99CC66fEC647E68294C6477B40fC7E0F6F618D0)
    +++ description: None
```

```diff
+   Status: CREATED
    contract CSModule (0xdA7dE2ECdDfccC6c3AF10108Db212ACBBf9EA83F)
    +++ description: None
```

```diff
+   Status: CREATED
    contract TokenRateNotifier (0xe6793B9e4FbA7DE0ee833F9D02bba7DB5EB27823)
    +++ description: None
```

```diff
+   Status: CREATED
    contract TokenManager (0xf73a1260d222f447210581DDf212D915c09a3249)
    +++ description: None
```

```diff
+   Status: CREATED
    contract StakingRouter (0xFdDf38947aFB03C621C71b06C9C70bce73f12999)
    +++ description: None
```

```diff
+   Status: CREATED
    contract DepositSecurityModule (0xfFA96D84dEF2EA035c7AB153D8B991128e3d72fD)
    +++ description: None
```
