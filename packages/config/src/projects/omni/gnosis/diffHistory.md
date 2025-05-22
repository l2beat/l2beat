Generated with discovered.json: 0x6305ed6822b20b0b27266c2bd99dc63f31886044

# Diff at Mon, 12 May 2025 12:22:15 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@43865580b95b7ff3abb4f43944aed50cc5d69ee3 block: 39725195
- current block number: 40024439

## Description

vkey update for the SP1 ethereum light client.

## Watched changes

```diff
    contract SP1Helios (0xa809c536c85b63a2676CbAc3C4064748AD3a2562) {
    +++ description: None
      values.heliosProgramVkey:
-        "0x00ed996c6f79e241fd4879d34ebfef7514ad8b817d0b40ab82a9856460d298c0"
+        "0x0021f5bf3c2516214dc2946556a0ef57e0fbcb908430fbccb7b49259a02fd292"
    }
```

Generated with discovered.json: 0xeaceef3604572c4b79eb3a771ac0232395184a35

# Diff at Tue, 29 Apr 2025 08:19:27 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@ef7477af00fe0b57a2f7cacf7e958c12494af662 block: 39725195
- current block number: 39725195

## Description

Field .issuedPermissions is removed from the output as no longer needed. Added 'permissionsConfigHash' due to refactoring of the modelling process (into a separate command).

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 39725195 (main branch discovery), not current.

```diff
    contract HashiManager_Gnosis (0x74CACae9801bA4Fe0027Ed6F58d53797CCa7296E) {
    +++ description: A hub contract for the Hashi protocol, an EVM Hash Oracle Aggregator.
      issuedPermissions:
-        [{"permission":"interact","to":"0xb1F43dc8B57562e7FA48157D73102a8e4a94975A","description":"change critical configurations of the Hashi protocol like the validation contract addresses.","via":[]},{"permission":"upgrade","to":"0x30Fb61178F39c0452cED4AD9A7FEC3344CB10B2E","via":[]}]
    }
```

```diff
    contract HomeAMB (0x75Df5AF045d91108662D8080fD1FEFAd6aA0bb59) {
    +++ description: None
      issuedPermissions:
-        [{"permission":"upgrade","to":"0x7a48Dac683DA91e4faa5aB13D91AB5fd170875bd","via":[]}]
    }
```

```diff
    contract BridgeValidators_Gnosis (0xA280feD8D7CaD9a76C8b50cA5c33c2534fFa5008) {
    +++ description: Custom multisignature contract for Validator addresses.
      issuedPermissions:
-        [{"permission":"interact","to":"0x7a48Dac683DA91e4faa5aB13D91AB5fd170875bd","description":"change the threshold and manage signers.","via":[]},{"permission":"upgrade","to":"0x7a48Dac683DA91e4faa5aB13D91AB5fd170875bd","via":[]}]
    }
```

```diff
    contract HomeOmnibridge (0xf6A78083ca3e2a662D6dd1703c939c8aCE2e268d) {
    +++ description: None
      issuedPermissions:
-        [{"permission":"upgrade","to":"0x7a48Dac683DA91e4faa5aB13D91AB5fd170875bd","via":[]}]
    }
```

Generated with discovered.json: 0x92286ed5478bf371d1870708f02033bc65c82620

# Diff at Thu, 24 Apr 2025 15:50:32 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@f3ec8b7fe4d902b94844aa2f7ddfb2affe4f3f61 block: 39627531
- current block number: 39725195

## Description

Config related: template matches from the ethereum side.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 39627531 (main branch discovery), not current.

```diff
    contract Giveth EOA 2 (0x105CD22eD3D089Bf5589C59b452f9dE0796Ca52d) {
    +++ description: None
      name:
+        "Giveth EOA 2"
    }
```

```diff
    contract Yaru (0x153801d0B85D2FCAc6EA07446b6A709ce6720AC5) {
    +++ description: Contract handling inbound messages for the Hashi protocol.
      description:
+        "Contract handling inbound messages for the Hashi protocol."
    }
```

```diff
    contract Safe EOA 2 (0x258667E543C913264388B33328337257aF208a8f) {
    +++ description: None
      name:
+        "Safe EOA 2"
    }
```

```diff
    contract Gateway EOA 2 (0x3e0A20099626F3d4d4Ea7B0cE0330e88d1Fe65D6) {
    +++ description: None
      name:
+        "Gateway EOA 2"
    }
```

```diff
    contract Protofire EOA 2 (0x459A3bd49F1ff109bc90b76125533699AaAAf9A6) {
    +++ description: None
      name:
+        "Protofire EOA 2"
    }
```

```diff
    contract CoW Protocol EOA 2 (0x674c97db4cE6caC04A124d745979f3E4cBa0E9f0) {
    +++ description: None
      name:
+        "CoW Protocol EOA 2"
    }
```

```diff
    contract HashiManager_Gnosis (0x74CACae9801bA4Fe0027Ed6F58d53797CCa7296E) {
    +++ description: A hub contract for the Hashi protocol, an EVM Hash Oracle Aggregator.
      name:
-        "HashiManager"
+        "HashiManager_Gnosis"
      issuedPermissions.1:
+        {"permission":"upgrade","to":"0x30Fb61178F39c0452cED4AD9A7FEC3344CB10B2E","via":[]}
      issuedPermissions.0.permission:
-        "upgrade"
+        "interact"
      issuedPermissions.0.to:
-        "0x30Fb61178F39c0452cED4AD9A7FEC3344CB10B2E"
+        "0xb1F43dc8B57562e7FA48157D73102a8e4a94975A"
      issuedPermissions.0.description:
+        "change critical configurations of the Hashi protocol like the validation contract addresses."
      fieldMeta.targetAddress.description:
-        "Address of the target contract on Ethereum"
+        "Address of the target contract on GnosisChain"
      fieldMeta.adapters.description:
-        "Array of the adapters on Ethereum"
+        "Array of the adapters on GnosisChain"
      fieldMeta.reporters.description:
-        "Array of the reporters on Ethereum"
+        "Array of the reports on GnosisChain"
      fieldMeta.threshold.description:
-        "Threshold of the adapters on Ethereum"
+        "Threshold of the adapters on GnosisChain"
      fieldMeta.HASHI_IS_MANDATORY:
+        {"severity":"HIGH","description":"If true, Hashi validation is mandatory"}
      template:
+        "gnosisbridge/HashiManager"
      description:
+        "A hub contract for the Hashi protocol, an EVM Hash Oracle Aggregator."
    }
```

```diff
    contract GnosisSafeL2 (0x7a48Dac683DA91e4faa5aB13D91AB5fd170875bd) {
    +++ description: None
      receivedPermissions.3:
+        {"permission":"upgrade","from":"0x75Df5AF045d91108662D8080fD1FEFAd6aA0bb59"}
      receivedPermissions.2.from:
-        "0x75Df5AF045d91108662D8080fD1FEFAd6aA0bb59"
+        "0xA280feD8D7CaD9a76C8b50cA5c33c2534fFa5008"
      receivedPermissions.1.from:
-        "0xA280feD8D7CaD9a76C8b50cA5c33c2534fFa5008"
+        "0xf6A78083ca3e2a662D6dd1703c939c8aCE2e268d"
      receivedPermissions.0.permission:
-        "upgrade"
+        "interact"
      receivedPermissions.0.from:
-        "0xf6A78083ca3e2a662D6dd1703c939c8aCE2e268d"
+        "0xA280feD8D7CaD9a76C8b50cA5c33c2534fFa5008"
      receivedPermissions.0.description:
+        "change the threshold and manage signers."
    }
```

```diff
    contract BridgeValidators_Gnosis (0xA280feD8D7CaD9a76C8b50cA5c33c2534fFa5008) {
    +++ description: Custom multisignature contract for Validator addresses.
      name:
-        "BridgeValidators"
+        "BridgeValidators_Gnosis"
      issuedPermissions.1:
+        {"permission":"upgrade","to":"0x7a48Dac683DA91e4faa5aB13D91AB5fd170875bd","via":[]}
      issuedPermissions.0.permission:
-        "upgrade"
+        "interact"
      issuedPermissions.0.description:
+        "change the threshold and manage signers."
      values.requiredSignatures:
-        4
      values.validatorList:
-        ["0x3e0A20099626F3d4d4Ea7B0cE0330e88d1Fe65D6","0xfA98B60E02A61B6590f073cAD56e68326652d094","0xbDc141c8D2343f33F40Cb9edD601CcF460CD0dDe","0x674c97db4cE6caC04A124d745979f3E4cBa0E9f0","0x258667E543C913264388B33328337257aF208a8f","0x105CD22eD3D089Bf5589C59b452f9dE0796Ca52d","0x459A3bd49F1ff109bc90b76125533699AaAAf9A6"]
+++ description: Array of the signers in the validator multisig
      values.$members:
+        ["0x459A3bd49F1ff109bc90b76125533699AaAAf9A6","0xfA98B60E02A61B6590f073cAD56e68326652d094","0xbDc141c8D2343f33F40Cb9edD601CcF460CD0dDe","0x3e0A20099626F3d4d4Ea7B0cE0330e88d1Fe65D6","0x258667E543C913264388B33328337257aF208a8f","0x674c97db4cE6caC04A124d745979f3E4cBa0E9f0","0x105CD22eD3D089Bf5589C59b452f9dE0796Ca52d"]
      values.$threshold:
+        4
      template:
+        "gnosisbridge/BridgeValidators"
      description:
+        "Custom multisignature contract for Validator addresses."
      fieldMeta:
+        {"$members":{"description":"Array of the signers in the validator multisig"}}
    }
```

```diff
    contract SafeL2 (0xb1F43dc8B57562e7FA48157D73102a8e4a94975A) {
    +++ description: None
      receivedPermissions:
+        [{"permission":"interact","from":"0x74CACae9801bA4Fe0027Ed6F58d53797CCa7296E","description":"change critical configurations of the Hashi protocol like the validation contract addresses."}]
    }
```

```diff
    contract Yaho (0xbAE4Ebbf42815BB9Bc3720267Ea4496277d60DB8) {
    +++ description: Contract handling outbound messages for the Hashi protocol.
      description:
+        "Contract handling outbound messages for the Hashi protocol."
    }
```

```diff
    contract Gnosis DAO EOA 2 (0xbDc141c8D2343f33F40Cb9edD601CcF460CD0dDe) {
    +++ description: None
      name:
+        "Gnosis DAO EOA 2"
    }
```

```diff
    contract Karpatkey EOA (0xfA98B60E02A61B6590f073cAD56e68326652d094) {
    +++ description: None
      name:
+        "Karpatkey EOA"
    }
```

Generated with discovered.json: 0x4977b3aabc95c21faa7d333e667319fe563a0290

# Diff at Thu, 24 Apr 2025 07:18:11 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@5e04a862ca14d0cf2b0f2109c8f3cf63d05c6b32 block: 39627531
- current block number: 39627531

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 39627531 (main branch discovery), not current.

```diff
    contract HashiManager (0x74CACae9801bA4Fe0027Ed6F58d53797CCa7296E) {
    +++ description: None
+++ description: Array of the adapters on Ethereum
+++ severity: HIGH
      values.adapters.0:
-        "ethereum:0x7606e9d8655e48159E7beC8541C2E71A7Aa3E418"
+        "eth:0x7606e9d8655e48159E7beC8541C2E71A7Aa3E418"
+++ description: Array of the reporters on Ethereum
+++ severity: HIGH
      values.reporters.0:
-        "ethereum:0xA3Bc83D557E3f2dDfF4D44966A96397760159D8B"
+        "eth:0xA3Bc83D557E3f2dDfF4D44966A96397760159D8B"
+++ description: Address of the target contract on Ethereum
+++ severity: HIGH
      values.targetAddress:
-        "ethereum:0x4C36d2919e407f0Cc2Ee3c993ccF8ac26d9CE64e"
+        "eth:0x4C36d2919e407f0Cc2Ee3c993ccF8ac26d9CE64e"
      usedTypes.0.arg.prefix:
-        "ethereum"
+        "eth"
    }
```

Generated with discovered.json: 0x07d276e18de5145485ad7f9345eba8e3e84b0714

# Diff at Wed, 16 Apr 2025 13:18:21 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@3125387cc9c705c58baaba16b949b563ef6f58a7 block: 39553862
- current block number: 39589758

## Description

Provide description of changes. This section will be preserved.

## Watched changes

```diff
    contract GnosisSafeL2 (0x7a48Dac683DA91e4faa5aB13D91AB5fd170875bd) {
    +++ description: None
      values.$members.10:
-        "0xd945325557f1FB4374fBf10Ae86D385632Df870A"
+        "0x544cE64C3Fc6Da72CEB2456CC4cF19E7c7972eFA"
      values.$members.9:
-        "0x544cE64C3Fc6Da72CEB2456CC4cF19E7c7972eFA"
+        "0xEF138856d0581641A57245Ee5CFfc9ceaA059623"
      values.$members.8:
-        "0xEF138856d0581641A57245Ee5CFfc9ceaA059623"
+        "0xB646B8b5Fe6cBc7770578B7679208337ef747ae4"
    }
```

```diff
    contract HomeOmnibridge (0xf6A78083ca3e2a662D6dd1703c939c8aCE2e268d) {
    +++ description: None
      values.getCurrentDay:
-        20192
+        20194
    }
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 39553862 (main branch discovery), not current.

```diff
    contract Yaru (0x153801d0B85D2FCAc6EA07446b6A709ce6720AC5) {
    +++ description: None
      template:
+        "gnosisbridge/Yaru"
    }
```

```diff
    contract Yaho (0xbAE4Ebbf42815BB9Bc3720267Ea4496277d60DB8) {
    +++ description: None
      values.currentNonce:
-        11744
      template:
+        "gnosisbridge/Yaho"
    }
```

Generated with discovered.json: 0xa19279a13381ec5cce1207b8325525eecdbc5813

# Diff at Mon, 14 Apr 2025 10:34:48 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- current block number: 39553862

## Description

Provide description of changes. This section will be preserved.

## Initial discovery

```diff
+   Status: CREATED
    contract Yaru (0x153801d0B85D2FCAc6EA07446b6A709ce6720AC5)
    +++ description: None
```

```diff
+   Status: CREATED
    contract PermittableToken (0x199084efbd7fe14d217BBF22FDC6E2eD7266dDD4)
    +++ description: None
```

```diff
+   Status: CREATED
    contract GnosisSafe (0x507A7777E6DbF4680951E63fB3753a20F2c37706)
    +++ description: None
```

```diff
+   Status: CREATED
    contract OmnibridgeFeeManager (0x5dbC897aEf6B18394D845A922BF107FA98E3AC55)
    +++ description: None
```

```diff
+   Status: CREATED
    contract SelectorTokenGasLimitManager (0x68A3674028a785A8BCE19bA81B9ab7c9942BA3ED)
    +++ description: None
```

```diff
+   Status: CREATED
    contract HashiManager (0x74CACae9801bA4Fe0027Ed6F58d53797CCa7296E)
    +++ description: None
```

```diff
+   Status: CREATED
    contract HomeAMB (0x75Df5AF045d91108662D8080fD1FEFAd6aA0bb59)
    +++ description: None
```

```diff
+   Status: CREATED
    contract GnosisSafeL2 (0x77bcb57ba7037e39063f1567ce734452bbD7a5F0)
    +++ description: None
```

```diff
+   Status: CREATED
    contract GnosisSafeL2 (0x7a48Dac683DA91e4faa5aB13D91AB5fd170875bd)
    +++ description: None
```

```diff
+   Status: CREATED
    contract BridgeValidators (0xA280feD8D7CaD9a76C8b50cA5c33c2534fFa5008)
    +++ description: None
```

```diff
+   Status: CREATED
    contract SP1Helios (0xa809c536c85b63a2676CbAc3C4064748AD3a2562)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Hashi (0xA86bc62Ac53Dc86687AB6C15fdebC71ad51fB615)
    +++ description: None
```

```diff
+   Status: CREATED
    contract SafeL2 (0xb1F43dc8B57562e7FA48157D73102a8e4a94975A)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Yaho (0xbAE4Ebbf42815BB9Bc3720267Ea4496277d60DB8)
    +++ description: None
```

```diff
+   Status: CREATED
    contract SP1HeliosAdapter (0xCEb436489e9C6d9E4Db76145A6CCE2a06411ea0A)
    +++ description: None
```

```diff
+   Status: CREATED
    contract MultiTokenForwardingRulesManager (0xd4D8c07097F9b87EcC4C1a838C4b71DBebcd2286)
    +++ description: None
```

```diff
+   Status: CREATED
    contract SP1Verifier (0xe2a2E96fDe2a05bE4A508F4FBABdb3A57BacF03b)
    +++ description: None
```

```diff
+   Status: CREATED
    contract TokenFactory (0xEAAE83ac10f975a6456f4C4E48c45Ea2d8e1b5d2)
    +++ description: None
```

```diff
+   Status: CREATED
    contract GnosisSafeL2 (0xEF138856d0581641A57245Ee5CFfc9ceaA059623)
    +++ description: None
```

```diff
+   Status: CREATED
    contract HomeOmnibridge (0xf6A78083ca3e2a662D6dd1703c939c8aCE2e268d)
    +++ description: None
```
