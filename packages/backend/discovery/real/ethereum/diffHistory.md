Generated with discovered.json: 0x3e022d3a7109d1a1efadcbab9be9d416a7ea6ba8

# Diff at Mon, 21 Oct 2024 12:47:42 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@e660599f23a07618fe949a07be1f516ce44f1914 block: 20941805
- current block number: 20941805

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20941805 (main branch discovery), not current.

```diff
    contract SequencerInbox (0x51C4a227D59E49E26Ea07D8e4E9Af163da4c87A0) {
    +++ description: State batches / commitments get posted here.
      descriptions:
-        ["State batches / commitments get posted here."]
      description:
+        "State batches / commitments get posted here."
    }
```

```diff
    contract RollupProxy (0xc4F7B37bE2bBbcF07373F28c61b1A259dfe49d2a) {
    +++ description: Manages rollup components, list of Stakers and Validators. Entry point for Validators creating new Rollup Nodes (state commits) and Challengers submitting fraud proofs.
      descriptions:
-        ["Manages rollup components, list of Stakers and Validators. Entry point for Validators creating new Rollup Nodes (state commits) and Challengers submitting fraud proofs."]
      description:
+        "Manages rollup components, list of Stakers and Validators. Entry point for Validators creating new Rollup Nodes (state commits) and Challengers submitting fraud proofs."
    }
```

Generated with discovered.json: 0x8f82bc93903bfee84f9dd779c5efb202554a3ca5

# Diff at Mon, 21 Oct 2024 11:09:25 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@8895d33866f5665c4c710f4ddaa32bfa63cc3c78 block: 20941805
- current block number: 20941805

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20941805 (main branch discovery), not current.

```diff
    contract ChallengeManager (0x369001149fe80892665a7b0c17fe8Db6BeFC7F5d) {
    +++ description: None
      values.$pastUpgrades.0.2:
+        ["0xEe9E5546A11Cb5b4A86e92DA05f2ef75C26E4754"]
      values.$pastUpgrades.0.1:
-        ["0xEe9E5546A11Cb5b4A86e92DA05f2ef75C26E4754"]
+        "0xba3fd77d6025e002501d3e0e0a2bb7326be1d2b9d45a15a0a8f51d412783180d"
    }
```

```diff
    contract Bridge (0x39D2EEcC8B55f46aE64789E2494dE777cDDeED03) {
    +++ description: None
      values.$pastUpgrades.0.2:
+        ["0x7EfcB76D0e2E776A298aAa603d433336e5F8b6ab"]
      values.$pastUpgrades.0.1:
-        ["0x7EfcB76D0e2E776A298aAa603d433336e5F8b6ab"]
+        "0xba3fd77d6025e002501d3e0e0a2bb7326be1d2b9d45a15a0a8f51d412783180d"
    }
```

```diff
    contract L1OrbitGatewayRouter (0x490f337Ac108b2a555183f5b5fd2ee84a7F45a18) {
    +++ description: None
      values.$pastUpgrades.0.2:
+        ["0x5Ff3feD7aad041ACe66E4ecDd7AfbCC43b6446b0"]
      values.$pastUpgrades.0.1:
-        ["0x5Ff3feD7aad041ACe66E4ecDd7AfbCC43b6446b0"]
+        "0x816e110bc6a5c398f160b13e96856e756ea11282881dcb718e95efe00bd1fb7e"
    }
```

```diff
    contract ERC20RollupEventInbox (0x503C5a576E2F72Ca9aD213D64bc775cbD81E0F2C) {
    +++ description: None
      values.$pastUpgrades.0.2:
+        ["0x302275067251F5FcdB9359Bda735fD8f7A4A54c0"]
      values.$pastUpgrades.0.1:
-        ["0x302275067251F5FcdB9359Bda735fD8f7A4A54c0"]
+        "0xba3fd77d6025e002501d3e0e0a2bb7326be1d2b9d45a15a0a8f51d412783180d"
    }
```

```diff
    contract SequencerInbox (0x51C4a227D59E49E26Ea07D8e4E9Af163da4c87A0) {
    +++ description: State batches / commitments get posted here.
      values.$pastUpgrades.0.2:
+        ["0x873484Ba63353C8b71210ce123B465512d408B27"]
      values.$pastUpgrades.0.1:
-        ["0x873484Ba63353C8b71210ce123B465512d408B27"]
+        "0xba3fd77d6025e002501d3e0e0a2bb7326be1d2b9d45a15a0a8f51d412783180d"
    }
```

```diff
    contract Outbox (0x8592Ca44dE1D354A20F75160F5602E5933D33761) {
    +++ description: None
      values.$pastUpgrades.0.2:
+        ["0x19431dc37098877486532250FB3158140717C00C"]
      values.$pastUpgrades.0.1:
-        ["0x19431dc37098877486532250FB3158140717C00C"]
+        "0xba3fd77d6025e002501d3e0e0a2bb7326be1d2b9d45a15a0a8f51d412783180d"
    }
```

```diff
    contract Bridger (0xbf2F26cadbC10C4d61ac7e424D514d79a12126f8) {
    +++ description: None
      values.$pastUpgrades.0.2:
+        ["0x977cA9732E618D32552BA16a52f258cEFadf970a"]
      values.$pastUpgrades.0.1:
-        ["0x977cA9732E618D32552BA16a52f258cEFadf970a"]
+        "0xff78834db538bd6b5be8abf30e32fd3861100c0fbde76f7c11b1cd1a3a2d6c0f"
    }
```

```diff
    contract RollupProxy (0xc4F7B37bE2bBbcF07373F28c61b1A259dfe49d2a) {
    +++ description: Manages rollup components, list of Stakers and Validators. Entry point for Validators creating new Rollup Nodes (state commits) and Challengers submitting fraud proofs.
      values.$pastUpgrades.0.2:
+        ["0x0aE4dD666748bF0F6dB5c149Eab1D8aD27820A6A","0x660ea1675F7323dC3Ba0c8dDFB593225Eb01E3C1"]
      values.$pastUpgrades.0.1:
-        ["0x0aE4dD666748bF0F6dB5c149Eab1D8aD27820A6A","0x660ea1675F7323dC3Ba0c8dDFB593225Eb01E3C1"]
+        "0xba3fd77d6025e002501d3e0e0a2bb7326be1d2b9d45a15a0a8f51d412783180d"
    }
```

```diff
    contract UpgradeExecutor (0xD6A4868a15d98b0BF4E9063BE707B4b89D067C3a) {
    +++ description: None
      values.$pastUpgrades.0.2:
+        ["0x6c21303F5986180B1394d2C89f3e883890E2867b"]
      values.$pastUpgrades.0.1:
-        ["0x6c21303F5986180B1394d2C89f3e883890E2867b"]
+        "0xba3fd77d6025e002501d3e0e0a2bb7326be1d2b9d45a15a0a8f51d412783180d"
    }
```

```diff
    contract Inbox (0xf538671ddd60eE54BdD6FBb0E309c491A7A2df11) {
    +++ description: None
      values.$pastUpgrades.0.2:
+        ["0x31fAAAB44e74eB408d1FC69A14806B4b9cA09da2"]
      values.$pastUpgrades.0.1:
-        ["0x31fAAAB44e74eB408d1FC69A14806B4b9cA09da2"]
+        "0xba3fd77d6025e002501d3e0e0a2bb7326be1d2b9d45a15a0a8f51d412783180d"
    }
```

```diff
    contract L1OrbitERC20Gateway (0xfC89B875970122E24C6C5ADd4Dea139443943ea7) {
    +++ description: None
      values.$pastUpgrades.0.2:
+        ["0xe80b4E0ed5e92d865F4708eeE0E1564287a7D848"]
      values.$pastUpgrades.0.1:
-        ["0xe80b4E0ed5e92d865F4708eeE0E1564287a7D848"]
+        "0x816e110bc6a5c398f160b13e96856e756ea11282881dcb718e95efe00bd1fb7e"
    }
```

Generated with discovered.json: 0xf55d6fcfc19e4943a8ebdad9c3c6847efdd03f9a

# Diff at Wed, 16 Oct 2024 11:39:32 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@a3d139b799cc0b28e5e912febb17464d4e5aef5d block: 20941805
- current block number: 20941805

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20941805 (main branch discovery), not current.

```diff
    contract SequencerInbox (0x51C4a227D59E49E26Ea07D8e4E9Af163da4c87A0) {
    +++ description: State batches / commitments get posted here.
      issuedPermissions.1:
+        {"permission":"upgrade","target":"0xB032ff02cd6425e4b816137207AA8560932180f1","via":[]}
      issuedPermissions.0.permission:
-        "upgrade"
+        "sequence"
      issuedPermissions.0.target:
-        "0xB032ff02cd6425e4b816137207AA8560932180f1"
+        "0x0e00df1afC8574762Ac4C4D8E5D1a19bD6A8Fa2E"
    }
```

```diff
    contract RollupProxy (0xc4F7B37bE2bBbcF07373F28c61b1A259dfe49d2a) {
    +++ description: Manages rollup components, list of Stakers and Validators. Entry point for Validators creating new Rollup Nodes (state commits) and Challengers submitting fraud proofs.
      issuedPermissions.1:
+        {"permission":"validate","target":"0x4b8Fbc3006F256dd470B070d6c70fAb413Fceb62","via":[]}
    }
```

Generated with discovered.json: 0xb085b6a914c777e4a67d0bafce9fe842720533bd

# Diff at Mon, 14 Oct 2024 10:54:46 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@1afc77ff111ceb0970e7d09efcc7b2f376b0c281 block: 20941805
- current block number: 20941805

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20941805 (main branch discovery), not current.

```diff
    contract OneStepProofEntry (0x09824fe72BFF474d16D9c2774432E381BBD60662) {
    +++ description: None
      sourceHashes:
+        ["0xf3479c667d20b1c17ea2573dc7fe09e4315a3e20bc09d31bc92603520cc962cc"]
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
    contract ChallengeManager (0x369001149fe80892665a7b0c17fe8Db6BeFC7F5d) {
    +++ description: None
      sourceHashes:
+        ["0xa7e3f6c355703ed46fcb2156862c4f01792b87beb10a87a81ce3bd5beee79b67","0x7e1cd1e10119e118ffaa576ddbe1c0f9810a0859a4bf2f65a4ff596c0ed4183d"]
    }
```

```diff
    contract Bridge (0x39D2EEcC8B55f46aE64789E2494dE777cDDeED03) {
    +++ description: None
      sourceHashes:
+        ["0xa7e3f6c355703ed46fcb2156862c4f01792b87beb10a87a81ce3bd5beee79b67","0x057de68a7007d55f4394ba6eafb2c802efcaf13583ff9342ea4d0ee3924d9be1"]
    }
```

```diff
    contract OneStepProverMemory (0x4811500e0d376Fa8d2EA3CCb7c61E0afB4F5A7f1) {
    +++ description: None
      sourceHashes:
+        ["0x731b4466319a83c95ce227d1a6c85aa03864f5d2bed03bda186843033a8b8d61"]
    }
```

```diff
    contract L1OrbitGatewayRouter (0x490f337Ac108b2a555183f5b5fd2ee84a7F45a18) {
    +++ description: None
      sourceHashes:
+        ["0x36a2777510f3b20063560bdcb7f657da283bcfdc484a19b0a0f77d18f6a8b5e1","0x33422e0ac90902db5dad442b006c9df60e262556d8ad286808d133b5429a3eb0"]
    }
```

```diff
    contract SwapManager (0x4AC36E1Fa7daBeFEc885f30B163c571080b2c335) {
    +++ description: None
      sourceHashes:
+        ["0x2c2f591c433021e5d54b67a3354fdc84c7f692a02fa61ec538dd633e890c4ad7"]
    }
```

```diff
    contract ERC20RollupEventInbox (0x503C5a576E2F72Ca9aD213D64bc775cbD81E0F2C) {
    +++ description: None
      sourceHashes:
+        ["0xa7e3f6c355703ed46fcb2156862c4f01792b87beb10a87a81ce3bd5beee79b67","0x88c3a2fa81cad2f98a156402c78de0fc804b2a1866ea4f449aa90ae92ceabc6c"]
    }
```

```diff
    contract SequencerInbox (0x51C4a227D59E49E26Ea07D8e4E9Af163da4c87A0) {
    +++ description: State batches / commitments get posted here.
      sourceHashes:
+        ["0xa7e3f6c355703ed46fcb2156862c4f01792b87beb10a87a81ce3bd5beee79b67","0x08792f333db7e8a060c38033f92e3fc10c30e2648c56fc49c7460ee1c94343a0"]
    }
```

```diff
    contract StrategyManager (0x5Cba18d504D4158dC1A18C5Dc6BB2a30B230DdD8) {
    +++ description: None
      sourceHashes:
+        ["0x6c6e93784f31191cf2b9284f57d6baac2bb7aef141c3482e250edade70dfa4be"]
    }
```

```diff
    contract Minter (0x655756824385F8903AC8cFDa17B656cc26f7C7da) {
    +++ description: None
      sourceHashes:
+        ["0x426161bad834d6302cbb3deabf564724483a57f7cdcdd24427d7dd9ea6405056"]
    }
```

```diff
    contract LidoStEthStrategy (0x679D4C1cC6855C57726BEA1784F578315d6431f6) {
    +++ description: None
      sourceHashes:
+        ["0xc18d8670e65f3ea1dc2fe9ee3114bfad504f6ee8998a9f9d6f79cc971a03814a"]
    }
```

```diff
    contract Outbox (0x8592Ca44dE1D354A20F75160F5602E5933D33761) {
    +++ description: None
      sourceHashes:
+        ["0xa7e3f6c355703ed46fcb2156862c4f01792b87beb10a87a81ce3bd5beee79b67","0x3073f29910dee50069a001fb20e58cca3dcc1b3c8da4b91809af2dd356ef0c8c"]
    }
```

```diff
    contract OneStepProverMath (0x89AF7C4C2198c426cFe6E86de0680A0850503e06) {
    +++ description: None
      sourceHashes:
+        ["0xb2555ede3dfe7d6df28bd96d12a0113b658c213c7ce4e34fa539df7497bc51a1"]
    }
```

```diff
    contract OneStepProverHostIo (0x99a2A31300816C1FA3f40818AC9280fe7271F878) {
    +++ description: None
      sourceHashes:
+        ["0x0a8f8db8198082757cc8145891c633c20ed4313dab05beab40618258e534a1e8"]
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
    contract ProxyAdmin (0xB032ff02cd6425e4b816137207AA8560932180f1) {
    +++ description: None
      sourceHashes:
+        ["0xf944f88083f41ff959fefbdcd6fc3ae633692b072b8497fb14cbdd843eded490"]
    }
```

```diff
    contract GelatoMultisig (0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb) {
    +++ description: None
      sourceHashes:
+        ["0x81a7349eebb98ac33b0bc6842e3cb258034a8f2a4ba004570bb8e2e25947f9ff","0xd42bbf9f7dcd3720a7fc6bdc6edfdfae8800a37d6dd4decfa0ef6ca4a2e88940"]
    }
```

```diff
    contract Bridger (0xbf2F26cadbC10C4d61ac7e424D514d79a12126f8) {
    +++ description: None
      sourceHashes:
+        ["0xd1f7ca44e10a593bfb38d908f60152c671082099b46d925d37a1eeba4f33bfda","0xaeb5734c5862ad1b95a66ae767bb08920938ed5de5fd7455221098e0d37c44dd"]
    }
```

```diff
    contract Real (0xC0Cc5eA00cAe0894B441E3B5a3Bb57aa92F15421) {
    +++ description: None
      sourceHashes:
+        ["0xf263e5f0d820b658ef0dd05015c2b4b333f38c76fcee96b52b307a19e0654162"]
    }
```

```diff
    contract RollupProxy (0xc4F7B37bE2bBbcF07373F28c61b1A259dfe49d2a) {
    +++ description: Manages rollup components, list of Stakers and Validators. Entry point for Validators creating new Rollup Nodes (state commits) and Challengers submitting fraud proofs.
      sourceHashes:
+        ["0xb8da0b3748daac768860783e8555198fd2d1bbdffb775b81557a7124890c7eca","0x8b48118fe606012c0dcac2ccc1821785935aec89fab8f219f47b32c482b0017e","0xef94a66bd5339efd18fb9ca1f8031482e7ef7bbe6c5a0a10fae254ab83712406"]
    }
```

```diff
    contract EscrowMultisig (0xD47E2043C1eCbeF215D89EE667D09A7aA56823d4) {
    +++ description: None
      sourceHashes:
+        ["0x81a7349eebb98ac33b0bc6842e3cb258034a8f2a4ba004570bb8e2e25947f9ff","0xd42bbf9f7dcd3720a7fc6bdc6edfdfae8800a37d6dd4decfa0ef6ca4a2e88940"]
    }
```

```diff
    contract UpgradeExecutor (0xD6A4868a15d98b0BF4E9063BE707B4b89D067C3a) {
    +++ description: None
      sourceHashes:
+        ["0xa7e3f6c355703ed46fcb2156862c4f01792b87beb10a87a81ce3bd5beee79b67","0xa7ff878cfd433a428d567d3b90fe1df400a048a1af5298f22cd4cd4fc25bdecd"]
    }
```

```diff
    contract OneStepProver0 (0xDf94F0474F205D086dbc2e66D69a856FCf520622) {
    +++ description: None
      sourceHashes:
+        ["0x20330713abbbcf0219ef7d1c0aa3a6ede1b421f14c9d21b25c973e54fb75f5df"]
    }
```

```diff
    contract Inbox (0xf538671ddd60eE54BdD6FBb0E309c491A7A2df11) {
    +++ description: None
      sourceHashes:
+        ["0xa7e3f6c355703ed46fcb2156862c4f01792b87beb10a87a81ce3bd5beee79b67","0xcb390b491549387c8fcc09fb22fbea7adf54cc74b7247a0c738369ddd7049b92"]
    }
```

```diff
    contract AssetsVault (0xf985E2c73d74BefF3C8c16EFC4fa5ab4cfb62294) {
    +++ description: None
      sourceHashes:
+        ["0x530019aa460a94ec770462491a461be4caebfe1a7a4e9adc91beb51d7a98187c"]
    }
```

```diff
    contract RealVault (0xFC1db08622e81b2AFd643318f6B8B79E9980A5e1) {
    +++ description: None
      sourceHashes:
+        ["0x3a95f1a37b3000abfc131510d1895ebfa14d26888610509cb2dd8ff7ffe4c81c"]
    }
```

```diff
    contract L1OrbitERC20Gateway (0xfC89B875970122E24C6C5ADd4Dea139443943ea7) {
    +++ description: None
      sourceHashes:
+        ["0x36a2777510f3b20063560bdcb7f657da283bcfdc484a19b0a0f77d18f6a8b5e1","0x17c9d8bf5017982cb88ab1d4f22a085c097ab9c7a910fa109fe9e7204840bef8"]
    }
```

Generated with discovered.json: 0x98a0771c749aa0ed8dc3faf94a63cc876be2d3a1

# Diff at Fri, 11 Oct 2024 10:33:15 GMT:

- author: sekuba (<sekuba@users.noreply.github.com>)
- comparing to: main@8f7c5fd25193054458be38552e62a708c480b2c8 block: 20842802
- current block number: 20941805

## Description

Gelato MS signer removed, one DAC member added, one changed.

## Watched changes

```diff
    contract SequencerInbox (0x51C4a227D59E49E26Ea07D8e4E9Af163da4c87A0) {
    +++ description: State batches / commitments get posted here.
      values.dacKeyset.membersCount:
-        1
+        2
      values.dacKeyset.blsSignatures.1:
+        "YBRYWM3r9QjDsxiTYDBsz7DLQsSk8ww7UeuNmhhAa+Spo31J5lWspLpAwHynMqRoDRkEg0bP1Y6Wivt1kwBOM2fDRs97y2vUB/OQpju9aok8WdBTJ16K9sM6Hlv0bT62ChK2Otjpjug8u839aoVPAZhojuYmW1hslHipM/JqYlCaVwHlB1hyp4kc8v230j6I6gsE1Bw1WMvxVXbP05bXwnO7ZIM+dQugQFWoDDZOS1HMIY+I9B+389vkEFGkjF8CPw5uGnIgdhabcqQFRkceDLVb7vMqJGgf/Oi4nKy6CKEJILwsf+grAdHY1MDDpe0WWRJflAnSemnZbpCaGqIEY1sEE/69idZuSbuqiHtmU0AGWcFcngv+WFjfG6Xr1V1tRw=="
      values.dacKeyset.blsSignatures.0:
-        "YAWa/w4rq6sHO4ozBBwPL3un0A6NDa3V163lAXaJmPZmihk4ntRlBqwcjz3Hq2NJWgcMOYyZicf+cyzYzT33XiJRcNMidWZ04qP6b7ZRHZh7R0p+YycNLqBxfRdNtllWJglg7ynQO4Suel9bqlzc+0Yq8ZuoHTHJXVVd4psJariQ/dNE16NqExPpV/jfJdFVThaAoNqowj5K/bl0VWEKPzxnf4ttwFM38wnUOIvmNHvVOREbkiWzus6H/6B7Cl7BygWo5cs97lUTeMuatpIqR/yNw352EkRLOLrmFTrg36zV9F8jebStSVDZ3M002mBH1gpxq5pQFaCb0lpXE0vmB08dfg7jS6KWU/OMlLZzVPk2DVKhkqtpDC5JAMkRNxrwfQ=="
+        "YBJCXtJZAUzwENdMJDCrgB6pWhA4ldiCFRNdySmzbLpcXriGq7NeKGLHyW5RcbP49QLgp7h9Asr+8KEc4coM7E0hRWXz6pU6W/rGUBAM1F0BtZNWdVQIp45BfwocbS4wxBWylr0ibVn8sJhVWG5uOY0kF0EddnVBElucIld+gTUyuTcNNKTHUqC1RdOI91XkKAC28qY5HGhdk41zEU8swBwjAIKmUbg+fcrKyxy/hs8OmySPr9YmPKnEv42CR0O0oBnadp/8W8WVrJRit2jwBQAXxLj52BxnGJkRA6x0DLkM+mXhU0ASMQB3EcWz5UaMZBfSXy4taHskYoDrqicHh5CCEAq7KoWive1o/stdn9VfnaGNL+uUqhGPg6Qbr/+oMw=="
      values.keySetUpdates:
-        1
+        2
    }
```

```diff
    contract GelatoMultisig (0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb) {
    +++ description: None
      values.$members.9:
-        "0x547D0F472309e4239b296D01e03bEDc101241a26"
      values.$members.8:
-        "0xf83bC4688979b13Da02CB94c76cEB169540760b5"
+        "0x547D0F472309e4239b296D01e03bEDc101241a26"
      values.$members.7:
-        "0x01a0A7BaAAca31AFB5b770FeFD69CE4917D9c32e"
+        "0xf83bC4688979b13Da02CB94c76cEB169540760b5"
      values.$members.6:
-        "0x27b1682E9C5Cb0E58Ff474F3a13EeCC36E708ad3"
+        "0x01a0A7BaAAca31AFB5b770FeFD69CE4917D9c32e"
      values.multisigThreshold:
-        "6 of 10 (60%)"
+        "6 of 9 (67%)"
    }
```

Generated with discovered.json: 0xee942efa816220afd64b71592d5a041bf9650916

# Diff at Tue, 01 Oct 2024 10:54:31 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@bd754dc73c66120164006054f8d25c5fae9cd910 block: 20842802
- current block number: 20842802

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20842802 (main branch discovery), not current.

```diff
    contract ChallengeManager (0x369001149fe80892665a7b0c17fe8Db6BeFC7F5d) {
    +++ description: None
      values.$pastUpgrades:
+        [["2024-03-16T09:18:35.000Z",["0xEe9E5546A11Cb5b4A86e92DA05f2ef75C26E4754"]]]
    }
```

```diff
    contract Bridge (0x39D2EEcC8B55f46aE64789E2494dE777cDDeED03) {
    +++ description: None
      values.$pastUpgrades:
+        [["2024-03-16T09:18:35.000Z",["0x7EfcB76D0e2E776A298aAa603d433336e5F8b6ab"]]]
    }
```

```diff
    contract L1OrbitGatewayRouter (0x490f337Ac108b2a555183f5b5fd2ee84a7F45a18) {
    +++ description: None
      values.$pastUpgrades:
+        [["2024-03-19T10:45:59.000Z",["0x5Ff3feD7aad041ACe66E4ecDd7AfbCC43b6446b0"]]]
    }
```

```diff
    contract ERC20RollupEventInbox (0x503C5a576E2F72Ca9aD213D64bc775cbD81E0F2C) {
    +++ description: None
      values.$pastUpgrades:
+        [["2024-03-16T09:18:35.000Z",["0x302275067251F5FcdB9359Bda735fD8f7A4A54c0"]]]
    }
```

```diff
    contract SequencerInbox (0x51C4a227D59E49E26Ea07D8e4E9Af163da4c87A0) {
    +++ description: State batches / commitments get posted here.
      values.$pastUpgrades:
+        [["2024-03-16T09:18:35.000Z",["0x873484Ba63353C8b71210ce123B465512d408B27"]]]
    }
```

```diff
    contract Outbox (0x8592Ca44dE1D354A20F75160F5602E5933D33761) {
    +++ description: None
      values.$pastUpgrades:
+        [["2024-03-16T09:18:35.000Z",["0x19431dc37098877486532250FB3158140717C00C"]]]
    }
```

```diff
    contract Bridger (0xbf2F26cadbC10C4d61ac7e424D514d79a12126f8) {
    +++ description: None
      values.$pastUpgrades:
+        [["2024-05-12T22:14:35.000Z",["0x977cA9732E618D32552BA16a52f258cEFadf970a"]]]
    }
```

```diff
    contract RollupProxy (0xc4F7B37bE2bBbcF07373F28c61b1A259dfe49d2a) {
    +++ description: Manages rollup components, list of Stakers and Validators. Entry point for Validators creating new Rollup Nodes (state commits) and Challengers submitting fraud proofs.
      values.$pastUpgrades:
+        [["2024-03-16T09:18:35.000Z",["0x0aE4dD666748bF0F6dB5c149Eab1D8aD27820A6A","0x660ea1675F7323dC3Ba0c8dDFB593225Eb01E3C1"]]]
      values.$upgradeCount:
+        1
    }
```

```diff
    contract UpgradeExecutor (0xD6A4868a15d98b0BF4E9063BE707B4b89D067C3a) {
    +++ description: None
      values.$pastUpgrades:
+        [["2024-03-16T09:18:35.000Z",["0x6c21303F5986180B1394d2C89f3e883890E2867b"]]]
    }
```

```diff
    contract Inbox (0xf538671ddd60eE54BdD6FBb0E309c491A7A2df11) {
    +++ description: None
      values.$pastUpgrades:
+        [["2024-03-16T09:18:35.000Z",["0x31fAAAB44e74eB408d1FC69A14806B4b9cA09da2"]]]
    }
```

```diff
    contract L1OrbitERC20Gateway (0xfC89B875970122E24C6C5ADd4Dea139443943ea7) {
    +++ description: None
      values.$pastUpgrades:
+        [["2024-03-19T10:45:59.000Z",["0xe80b4E0ed5e92d865F4708eeE0E1564287a7D848"]]]
    }
```

Generated with discovered.json: 0x65ccc72ab6014fe3fdbc6824de1013570c9429ec

# Diff at Fri, 27 Sep 2024 15:18:29 GMT:

- author: sekuba (<sekuba@users.noreply.github.com>)
- comparing to: main@4cb14cc1bdc343d171a7988f9f91f11edbf568a8 block: 20633391
- current block number: 20842802

## Description

Config.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20633391 (main branch discovery), not current.

```diff
    contract RollupProxy (0xc4F7B37bE2bBbcF07373F28c61b1A259dfe49d2a) {
    +++ description: Manages rollup components, list of Stakers and Validators. Entry point for Validators creating new Rollup Nodes (state commits) and Challengers submitting fraud proofs.
      usedTypes.0.arg.0x184884e1eb9fefdc158f6c8ac912bb183bf3cf83f0090317e0bc4ac5860baa39:
+        "ArbOS v32 wasmModuleRoot"
    }
```

Generated with discovered.json: 0x29d3a7c6ec57a2c415f3375adfd1052bf227e620

# Diff at Sun, 01 Sep 2024 08:45:29 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@bee35b6cff7c52634ae8667cbb331e18ad4ec17a block: 20633391
- current block number: 20633391

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20633391 (main branch discovery), not current.

```diff
    contract RollupProxy (0xc4F7B37bE2bBbcF07373F28c61b1A259dfe49d2a) {
    +++ description: Manages rollup components, list of Stakers and Validators. Entry point for Validators creating new Rollup Nodes (state commits) and Challengers submitting fraud proofs.
+++ description: Root hash of the WASM module used for execution, like a fingerprint of the L2 logic. Can be associated with ArbOS versions.
      values.wasmModuleRoot:
-        "0xf4389b835497a910d7ba3ebfb77aa93da985634f3c052de1290360635be40c4a"
+        "ArbOS v11 wasmModuleRoot"
      usedTypes:
+        [{"typeCaster":"Mapping","arg":{"0xbb9d58e9527566138b682f3a207c0976d5359837f6e330f4017434cca983ff41":"ArbOS v1-rc1 wasmModuleRoot","0x9d68e40c47e3b87a8a7e6368cc52915720a6484bb2f47ceabad7e573e3a11232":"ArbOS v2.1 wasmModuleRoot","0x53c288a0ca7100c0f2db8ab19508763a51c7fd1be125d376d940a65378acaee7":"ArbOS v3 wasmModuleRoot","0x588762be2f364be15d323df2aa60ffff60f2b14103b34823b6f7319acd1ae7a3":"ArbOS v3.1 wasmModuleRoot","0xcfba6a883c50a1b4475ab909600fa88fc9cceed9e3ff6f43dccd2d27f6bd57cf":"ArbOS v3.2 wasmModuleRoot","0xa24ccdb052d92c5847e8ea3ce722442358db4b00985a9ee737c4e601b6ed9876":"ArbOS v4 wasmModuleRoot","0x1e09e6d9e35b93f33ed22b2bc8dc10bbcf63fdde5e8a1fb8cc1bcd1a52f14bd0":"ArbOS v5 wasmModuleRoot","0x3848eff5e0356faf1fc9cafecb789584c5e7f4f8f817694d842ada96613d8bab":"ArbOS v6 wasmModuleRoot","0x53dd4b9a3d807a8cbb4d58fbfc6a0857c3846d46956848cae0a1cc7eca2bb5a8":"ArbOS v7 wasmModuleRoot","0x2b20e1490d1b06299b222f3239b0ae07e750d8f3b4dedd19f500a815c1548bbc":"ArbOS v7.1 wasmModuleRoot","0xd1842bfbe047322b3f3b3635b5fe62eb611557784d17ac1d2b1ce9c170af6544":"ArbOS v9 wasmModuleRoot","0x6b94a7fc388fd8ef3def759297828dc311761e88d8179c7ee8d3887dc554f3c3":"ArbOS v10 wasmModuleRoot","0xda4e3ad5e7feacb817c21c8d0220da7650fe9051ece68a3f0b1c5d38bbb27b21":"ArbOS v10.1 wasmModuleRoot","0x0754e09320c381566cc0449904c377a52bd34a6b9404432e80afd573b67f7b17":"ArbOS v10.2 wasmModuleRoot","0xf559b6d4fa869472dabce70fe1c15221bdda837533dfd891916836975b434dec":"ArbOS v10.3 wasmModuleRoot","0xf4389b835497a910d7ba3ebfb77aa93da985634f3c052de1290360635be40c4a":"ArbOS v11 wasmModuleRoot","0x68e4fe5023f792d4ef584796c84d710303a5e12ea02d6e37e2b5e9c4332507c4":"ArbOS v11.1 wasmModuleRoot","0x8b104a2e80ac6165dc58b9048de12f301d70b02a0ab51396c22b4b4b802a16a4":"ArbOS v20 wasmModuleRoot","0xb0de9cb89e4d944ae6023a3b62276e54804c242fd8c4c2d8e6cc4450f5fa8b1b":"ArbOS v30 wasmModuleRoot","0x260f5fa5c3176a856893642e149cf128b5a8de9f828afec8d11184415dd8dc69":"ArbOS v31 wasmModuleRoot"}}]
    }
```

Generated with discovered.json: 0x36a7562dc5538d8037bacad46306a73e0429934c

# Diff at Fri, 30 Aug 2024 07:56:23 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@6c1bd1f41fadf5f2cb1c1805b5a2c6138a3ed35a block: 20633391
- current block number: 20633391

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20633391 (main branch discovery), not current.

```diff
    contract ProxyAdmin (0xB032ff02cd6425e4b816137207AA8560932180f1) {
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
    contract UpgradeExecutor (0xD6A4868a15d98b0BF4E9063BE707B4b89D067C3a) {
    +++ description: None
      receivedPermissions.0.via:
-        []
    }
```

Generated with discovered.json: 0x594138a401633a165837723395004aa9fb61155f

# Diff at Thu, 29 Aug 2024 09:37:55 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@8d42e344df72950493a6d9b63b8f4e541ef02586 block: 20583702
- current block number: 20633391

## Description

Ignore value.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20583702 (main branch discovery), not current.

```diff
    contract LidoStEthStrategy (0x679D4C1cC6855C57726BEA1784F578315d6431f6) {
    +++ description: None
      values.getClaimableValue:
-        0
    }
```

Generated with discovered.json: 0x4d09ed055a70a73ffb88d198d954094ad2231aad

# Diff at Fri, 23 Aug 2024 09:54:39 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@67597c7d6c810bc726594446890178150240711e block: 20583702
- current block number: 20583702

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20583702 (main branch discovery), not current.

```diff
    contract ChallengeManager (0x369001149fe80892665a7b0c17fe8Db6BeFC7F5d) {
    +++ description: None
      values.$upgradeCount:
+        1
    }
```

```diff
    contract Bridge (0x39D2EEcC8B55f46aE64789E2494dE777cDDeED03) {
    +++ description: None
      values.$upgradeCount:
+        1
    }
```

```diff
    contract L1OrbitGatewayRouter (0x490f337Ac108b2a555183f5b5fd2ee84a7F45a18) {
    +++ description: None
      values.$upgradeCount:
+        1
    }
```

```diff
    contract ERC20RollupEventInbox (0x503C5a576E2F72Ca9aD213D64bc775cbD81E0F2C) {
    +++ description: None
      values.$upgradeCount:
+        1
    }
```

```diff
    contract SequencerInbox (0x51C4a227D59E49E26Ea07D8e4E9Af163da4c87A0) {
    +++ description: State batches / commitments get posted here.
      values.$upgradeCount:
+        1
    }
```

```diff
    contract Outbox (0x8592Ca44dE1D354A20F75160F5602E5933D33761) {
    +++ description: None
      values.$upgradeCount:
+        1
    }
```

```diff
    contract Bridger (0xbf2F26cadbC10C4d61ac7e424D514d79a12126f8) {
    +++ description: None
      values.$upgradeCount:
+        1
    }
```

```diff
    contract UpgradeExecutor (0xD6A4868a15d98b0BF4E9063BE707B4b89D067C3a) {
    +++ description: None
      values.$upgradeCount:
+        1
    }
```

```diff
    contract Inbox (0xf538671ddd60eE54BdD6FBb0E309c491A7A2df11) {
    +++ description: None
      values.$upgradeCount:
+        1
    }
```

```diff
    contract L1OrbitERC20Gateway (0xfC89B875970122E24C6C5ADd4Dea139443943ea7) {
    +++ description: None
      values.$upgradeCount:
+        1
    }
```

Generated with discovered.json: 0x087ca83faaa7bd2b28e9b1196e8275034badbc7e

# Diff at Thu, 22 Aug 2024 11:00:15 GMT:

- author: vincfurc (<10850139+vincfurc@users.noreply.github.com>)
- comparing to: main@bf2d0ebf21a279d76dfafc24de12b751244afaf6 block: 20177361
- current block number: 20583702

## Description

New handler now fetching BLS signature keys of DAC members.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20177361 (main branch discovery), not current.

```diff
    contract SequencerInbox (0x51C4a227D59E49E26Ea07D8e4E9Af163da4c87A0) {
    +++ description: State batches / commitments get posted here.
      values.dacKeyset.blsSignatures:
+        ["YAWa/w4rq6sHO4ozBBwPL3un0A6NDa3V163lAXaJmPZmihk4ntRlBqwcjz3Hq2NJWgcMOYyZicf+cyzYzT33XiJRcNMidWZ04qP6b7ZRHZh7R0p+YycNLqBxfRdNtllWJglg7ynQO4Suel9bqlzc+0Yq8ZuoHTHJXVVd4psJariQ/dNE16NqExPpV/jfJdFVThaAoNqowj5K/bl0VWEKPzxnf4ttwFM38wnUOIvmNHvVOREbkiWzus6H/6B7Cl7BygWo5cs97lUTeMuatpIqR/yNw352EkRLOLrmFTrg36zV9F8jebStSVDZ3M002mBH1gpxq5pQFaCb0lpXE0vmB08dfg7jS6KWU/OMlLZzVPk2DVKhkqtpDC5JAMkRNxrwfQ=="]
    }
```

Generated with discovered.json: 0x5cb8daed8dec2a3d20c721b8c5162895bd4f6215

# Diff at Wed, 21 Aug 2024 10:05:19 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@2f6dde3357bf5d79196b6e94f79d853a6c4ec72b block: 20177361
- current block number: 20177361

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20177361 (main branch discovery), not current.

```diff
    contract ChallengeManager (0x369001149fe80892665a7b0c17fe8Db6BeFC7F5d) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0xB032ff02cd6425e4b816137207AA8560932180f1","via":[]}]
    }
```

```diff
    contract Bridge (0x39D2EEcC8B55f46aE64789E2494dE777cDDeED03) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0xB032ff02cd6425e4b816137207AA8560932180f1","via":[]}]
    }
```

```diff
    contract L1OrbitGatewayRouter (0x490f337Ac108b2a555183f5b5fd2ee84a7F45a18) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0xB032ff02cd6425e4b816137207AA8560932180f1","via":[]}]
    }
```

```diff
    contract ERC20RollupEventInbox (0x503C5a576E2F72Ca9aD213D64bc775cbD81E0F2C) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0xB032ff02cd6425e4b816137207AA8560932180f1","via":[]}]
    }
```

```diff
    contract SequencerInbox (0x51C4a227D59E49E26Ea07D8e4E9Af163da4c87A0) {
    +++ description: State batches / commitments get posted here.
      issuedPermissions:
+        [{"permission":"upgrade","target":"0xB032ff02cd6425e4b816137207AA8560932180f1","via":[]}]
    }
```

```diff
    contract Outbox (0x8592Ca44dE1D354A20F75160F5602E5933D33761) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0xB032ff02cd6425e4b816137207AA8560932180f1","via":[]}]
    }
```

```diff
    contract ProxyAdmin (0xB032ff02cd6425e4b816137207AA8560932180f1) {
    +++ description: None
      assignedPermissions:
-        {"upgrade":["0x369001149fe80892665a7b0c17fe8Db6BeFC7F5d","0x39D2EEcC8B55f46aE64789E2494dE777cDDeED03","0x490f337Ac108b2a555183f5b5fd2ee84a7F45a18","0x503C5a576E2F72Ca9aD213D64bc775cbD81E0F2C","0x51C4a227D59E49E26Ea07D8e4E9Af163da4c87A0","0x8592Ca44dE1D354A20F75160F5602E5933D33761","0xD6A4868a15d98b0BF4E9063BE707B4b89D067C3a","0xf538671ddd60eE54BdD6FBb0E309c491A7A2df11","0xfC89B875970122E24C6C5ADd4Dea139443943ea7"]}
      receivedPermissions:
+        [{"permission":"upgrade","target":"0x369001149fe80892665a7b0c17fe8Db6BeFC7F5d","via":[]},{"permission":"upgrade","target":"0x39D2EEcC8B55f46aE64789E2494dE777cDDeED03","via":[]},{"permission":"upgrade","target":"0x490f337Ac108b2a555183f5b5fd2ee84a7F45a18","via":[]},{"permission":"upgrade","target":"0x503C5a576E2F72Ca9aD213D64bc775cbD81E0F2C","via":[]},{"permission":"upgrade","target":"0x51C4a227D59E49E26Ea07D8e4E9Af163da4c87A0","via":[]},{"permission":"upgrade","target":"0x8592Ca44dE1D354A20F75160F5602E5933D33761","via":[]},{"permission":"upgrade","target":"0xD6A4868a15d98b0BF4E9063BE707B4b89D067C3a","via":[]},{"permission":"upgrade","target":"0xf538671ddd60eE54BdD6FBb0E309c491A7A2df11","via":[]},{"permission":"upgrade","target":"0xfC89B875970122E24C6C5ADd4Dea139443943ea7","via":[]}]
    }
```

```diff
    contract Bridger (0xbf2F26cadbC10C4d61ac7e424D514d79a12126f8) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0xeB658c4Ea908aC4dAF9c309D8f883d6aD758b3A3","via":[]}]
    }
```

```diff
    contract RollupProxy (0xc4F7B37bE2bBbcF07373F28c61b1A259dfe49d2a) {
    +++ description: Manages rollup components, list of Stakers and Validators. Entry point for Validators creating new Rollup Nodes (state commits) and Challengers submitting fraud proofs.
      issuedPermissions:
+        [{"permission":"upgrade","target":"0xD6A4868a15d98b0BF4E9063BE707B4b89D067C3a","via":[]}]
    }
```

```diff
    contract UpgradeExecutor (0xD6A4868a15d98b0BF4E9063BE707B4b89D067C3a) {
    +++ description: None
      assignedPermissions:
-        {"upgrade":["0xc4F7B37bE2bBbcF07373F28c61b1A259dfe49d2a"]}
      issuedPermissions:
+        [{"permission":"upgrade","target":"0xB032ff02cd6425e4b816137207AA8560932180f1","via":[]}]
      receivedPermissions:
+        [{"permission":"upgrade","target":"0xc4F7B37bE2bBbcF07373F28c61b1A259dfe49d2a","via":[]}]
    }
```

```diff
    contract Inbox (0xf538671ddd60eE54BdD6FBb0E309c491A7A2df11) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0xB032ff02cd6425e4b816137207AA8560932180f1","via":[]}]
    }
```

```diff
    contract L1OrbitERC20Gateway (0xfC89B875970122E24C6C5ADd4Dea139443943ea7) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0xB032ff02cd6425e4b816137207AA8560932180f1","via":[]}]
    }
```

Generated with discovered.json: 0xe7343f6f8e6e545996a3973fa66c8d60871b1fa2

# Diff at Fri, 09 Aug 2024 12:01:44 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@bf40aa32f030fd312056ca0ef198c8550467d1d7 block: 20177361
- current block number: 20177361

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20177361 (main branch discovery), not current.

```diff
    contract ProxyAdmin (0xB032ff02cd6425e4b816137207AA8560932180f1) {
    +++ description: None
      assignedPermissions.upgrade.8:
-        "0xD6A4868a15d98b0BF4E9063BE707B4b89D067C3a"
+        "0xfC89B875970122E24C6C5ADd4Dea139443943ea7"
      assignedPermissions.upgrade.7:
-        "0x369001149fe80892665a7b0c17fe8Db6BeFC7F5d"
+        "0xf538671ddd60eE54BdD6FBb0E309c491A7A2df11"
      assignedPermissions.upgrade.6:
-        "0x51C4a227D59E49E26Ea07D8e4E9Af163da4c87A0"
+        "0xD6A4868a15d98b0BF4E9063BE707B4b89D067C3a"
      assignedPermissions.upgrade.5:
-        "0x503C5a576E2F72Ca9aD213D64bc775cbD81E0F2C"
+        "0x8592Ca44dE1D354A20F75160F5602E5933D33761"
      assignedPermissions.upgrade.4:
-        "0x490f337Ac108b2a555183f5b5fd2ee84a7F45a18"
+        "0x51C4a227D59E49E26Ea07D8e4E9Af163da4c87A0"
      assignedPermissions.upgrade.3:
-        "0x8592Ca44dE1D354A20F75160F5602E5933D33761"
+        "0x503C5a576E2F72Ca9aD213D64bc775cbD81E0F2C"
      assignedPermissions.upgrade.2:
-        "0xf538671ddd60eE54BdD6FBb0E309c491A7A2df11"
+        "0x490f337Ac108b2a555183f5b5fd2ee84a7F45a18"
      assignedPermissions.upgrade.0:
-        "0xfC89B875970122E24C6C5ADd4Dea139443943ea7"
+        "0x369001149fe80892665a7b0c17fe8Db6BeFC7F5d"
    }
```

Generated with discovered.json: 0x0677537fb87c8ddc24eb032687875994d450b561

# Diff at Fri, 09 Aug 2024 10:11:43 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@1f0da1d0aab7bc6b3b5e54e7e93480bd98e57035 block: 20177361
- current block number: 20177361

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20177361 (main branch discovery), not current.

```diff
    contract ProxyAdmin (0xB032ff02cd6425e4b816137207AA8560932180f1) {
    +++ description: None
      assignedPermissions.admin:
-        ["0x369001149fe80892665a7b0c17fe8Db6BeFC7F5d","0x39D2EEcC8B55f46aE64789E2494dE777cDDeED03","0x490f337Ac108b2a555183f5b5fd2ee84a7F45a18","0x503C5a576E2F72Ca9aD213D64bc775cbD81E0F2C","0x51C4a227D59E49E26Ea07D8e4E9Af163da4c87A0","0x8592Ca44dE1D354A20F75160F5602E5933D33761","0xD6A4868a15d98b0BF4E9063BE707B4b89D067C3a","0xf538671ddd60eE54BdD6FBb0E309c491A7A2df11","0xfC89B875970122E24C6C5ADd4Dea139443943ea7"]
      assignedPermissions.upgrade:
+        ["0xfC89B875970122E24C6C5ADd4Dea139443943ea7","0x39D2EEcC8B55f46aE64789E2494dE777cDDeED03","0xf538671ddd60eE54BdD6FBb0E309c491A7A2df11","0x8592Ca44dE1D354A20F75160F5602E5933D33761","0x490f337Ac108b2a555183f5b5fd2ee84a7F45a18","0x503C5a576E2F72Ca9aD213D64bc775cbD81E0F2C","0x51C4a227D59E49E26Ea07D8e4E9Af163da4c87A0","0x369001149fe80892665a7b0c17fe8Db6BeFC7F5d","0xD6A4868a15d98b0BF4E9063BE707B4b89D067C3a"]
    }
```

```diff
    contract GelatoMultisig (0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb) {
    +++ description: None
      values.$multisigThreshold:
-        "6 of 10 (60%)"
      values.getOwners:
-        ["0xB0C2CBFfCd4C31AFFEe14993b6d48f99D285f621","0x28bB9385A588EF4747264D19B9A9F1603591680c","0x691C2EF68e25E620fa6cAdE2728f6aE34F37aAD2","0x5bE3E96Cdc3A97628bD7308d3588B9a474F4A54d","0xBc0ca6865d6883a83D4aDDD6b862aE042d855E0d","0xc85aC6d2fdC376F335455D4cCA30c45ED1080849","0x27b1682E9C5Cb0E58Ff474F3a13EeCC36E708ad3","0x01a0A7BaAAca31AFB5b770FeFD69CE4917D9c32e","0xf83bC4688979b13Da02CB94c76cEB169540760b5","0x547D0F472309e4239b296D01e03bEDc101241a26"]
      values.getThreshold:
-        6
      values.$members:
+        ["0xB0C2CBFfCd4C31AFFEe14993b6d48f99D285f621","0x28bB9385A588EF4747264D19B9A9F1603591680c","0x691C2EF68e25E620fa6cAdE2728f6aE34F37aAD2","0x5bE3E96Cdc3A97628bD7308d3588B9a474F4A54d","0xBc0ca6865d6883a83D4aDDD6b862aE042d855E0d","0xc85aC6d2fdC376F335455D4cCA30c45ED1080849","0x27b1682E9C5Cb0E58Ff474F3a13EeCC36E708ad3","0x01a0A7BaAAca31AFB5b770FeFD69CE4917D9c32e","0xf83bC4688979b13Da02CB94c76cEB169540760b5","0x547D0F472309e4239b296D01e03bEDc101241a26"]
      values.$threshold:
+        6
      values.multisigThreshold:
+        "6 of 10 (60%)"
    }
```

```diff
    contract EscrowMultisig (0xD47E2043C1eCbeF215D89EE667D09A7aA56823d4) {
    +++ description: None
      values.$multisigThreshold:
-        "4 of 5 (80%)"
      values.getOwners:
-        ["0x240B5E0746eda8cBc137Fc67210532a1D2B5b82A","0xf16Df80dBA33bB54018F99A3679801Bc9cA14Fe0","0x6bD40C6f7849160FE217D07a73E15f4ef8222283","0xFbce8758DBF56d574A80fa3A6AB27275a8F1EF6A","0x7cFaD85633CD000c83Fcf99a678044dDC14125bD"]
      values.getThreshold:
-        4
      values.$members:
+        ["0x240B5E0746eda8cBc137Fc67210532a1D2B5b82A","0xf16Df80dBA33bB54018F99A3679801Bc9cA14Fe0","0x6bD40C6f7849160FE217D07a73E15f4ef8222283","0xFbce8758DBF56d574A80fa3A6AB27275a8F1EF6A","0x7cFaD85633CD000c83Fcf99a678044dDC14125bD"]
      values.$threshold:
+        4
      values.multisigThreshold:
+        "4 of 5 (80%)"
    }
```

```diff
    contract UpgradeExecutor (0xD6A4868a15d98b0BF4E9063BE707B4b89D067C3a) {
    +++ description: None
      assignedPermissions.admin:
-        ["0xc4F7B37bE2bBbcF07373F28c61b1A259dfe49d2a"]
      assignedPermissions.upgrade:
+        ["0xc4F7B37bE2bBbcF07373F28c61b1A259dfe49d2a"]
    }
```

Generated with discovered.json: 0xcaf569c377b5fb07061abd15c9ea763eddb1f7b9

# Diff at Tue, 30 Jul 2024 11:13:53 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@b2b6471ff62871f4956541f42ec025c356c08f7e block: 20177361
- current block number: 20177361

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20177361 (main branch discovery), not current.

```diff
    contract SequencerInbox (0x51C4a227D59E49E26Ea07D8e4E9Af163da4c87A0) {
    +++ description: State batches / commitments get posted here.
      fieldMeta:
+        {"maxTimeVariation":{"description":"Struct: delayBlocks, futureBlocks, delaySeconds, futureSeconds. onlyRollupOwner settable. Transactions can only be force-included after `delayBlocks` window (Sequencer-only) has passed."}}
    }
```

```diff
    contract RollupProxy (0xc4F7B37bE2bBbcF07373F28c61b1A259dfe49d2a) {
    +++ description: Manages rollup components, list of Stakers and Validators. Entry point for Validators creating new Rollup Nodes (state commits) and Challengers submitting fraud proofs.
      fieldMeta:
+        {"confirmPeriodBlocks":{"description":"Challenge period. (Number of blocks until a node is confirmed)."},"wasmModuleRoot":{"description":"Root hash of the WASM module used for execution, like a fingerprint of the L2 logic. Can be associated with ArbOS versions."}}
    }
```

Generated with discovered.json: 0x637b326a46fbeff53da8fd4fb944e684358001e5

# Diff at Wed, 12 Jun 2024 04:47:28 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@7b9a39f700e84af1cffa010ce0e20e64b23a4c64 block: 20032983
- current block number: 20073454

## Description

Two previously-unverified contracts are now verified. 
The only registered strategy backing reETH is currently depositing ETH into Lido and holding stETH. There is a SwapManager that serves instant withdrawals through Curve and Uniswap.

All escrowing and strategy-related contracts have a new Multisig as governance, but the ownership transfer is still pending. (the EOA Warning is now removed).

## Watched changes

```diff
    contract SwapManager (0x4AC36E1Fa7daBeFEc885f30B163c571080b2c335) {
    +++ description: None
      values.owner:
-        "0xeB658c4Ea908aC4dAF9c309D8f883d6aD758b3A3"
+        "0xD47E2043C1eCbeF215D89EE667D09A7aA56823d4"
    }
```

```diff
    contract RealVault (0xFC1db08622e81b2AFd643318f6B8B79E9980A5e1) {
    +++ description: None
      values.owner:
-        "0xeB658c4Ea908aC4dAF9c309D8f883d6aD758b3A3"
+        "0xD47E2043C1eCbeF215D89EE667D09A7aA56823d4"
      values.proposal:
-        "0xeB658c4Ea908aC4dAF9c309D8f883d6aD758b3A3"
+        "0xD47E2043C1eCbeF215D89EE667D09A7aA56823d4"
    }
```

```diff
+   Status: CREATED
    contract EscrowMultisig (0xD47E2043C1eCbeF215D89EE667D09A7aA56823d4)
    +++ description: None
```

## Source code changes

```diff
.../ethereum/.flat/EscrowMultisig/GnosisSafe.sol   | 952 +++++++++++++++++++++
 .../.flat/EscrowMultisig/GnosisSafeProxy.p.sol     |  34 +
 2 files changed, 986 insertions(+)
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20032983 (main branch discovery), not current.

```diff
    contract StrategyManager (0x5Cba18d504D4158dC1A18C5Dc6BB2a30B230DdD8) {
    +++ description: None
      unverified:
-        true
      values:
+        {"assetsVault":"0xf985E2c73d74BefF3C8c16EFC4fa5ab4cfb62294","getAllStrategiesValue":"311079739008922993052","getAllStrategyPendingValue":0,"getStrategies":{"addrs":["0x679D4C1cC6855C57726BEA1784F578315d6431f6"],"allocations":[1000000]},"getTotalInvestedValue":{"_value":"311079739008922993052","strategiesValue":["311079739008922993052"]},"realVault":"0xFC1db08622e81b2AFd643318f6B8B79E9980A5e1"}
    }
```

```diff
    contract  (0x679D4C1cC6855C57726BEA1784F578315d6431f6) {
    +++ description: None
      name:
-        ""
+        "LidoStEthStrategy"
      unverified:
-        true
      values:
+        {"getClaimableValue":0,"getInvestedValue":"311079739008922993052","getStETHWithdrawalStatus":{"requestIds":[],"statuses":[]},"getTotalValue":"311079739008922993052","governance":"0xeB658c4Ea908aC4dAF9c309D8f883d6aD758b3A3","manager":"0x5Cba18d504D4158dC1A18C5Dc6BB2a30B230DdD8","MAX_STETH_WITHDRAWAL_AMOUNT":"1000000000000000000000","MIN_STETH_WITHDRAWAL_AMOUNT":100,"name":"Lido Investment Strategy","STETH":"0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84","stETHWithdrawalQueue":"0x889edC2eDab5f40e902b864aD4d7AdE8E412F9B1","swapManager":"0x4AC36E1Fa7daBeFEc885f30B163c571080b2c335","WETH9":"0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2","WSTETH":"0x7f39C581F595B53c5cb19bD0b3f8dA6c935E2Ca0"}
    }
```

```diff
+   Status: CREATED
    contract SwapManager (0x4AC36E1Fa7daBeFEc885f30B163c571080b2c335)
    +++ description: None
```

Generated with discovered.json: 0x862f9fa7833edb8299291eee9bf9ae8db2c2ef87

# Diff at Thu, 06 Jun 2024 13:07:44 GMT:

- author: sekuba (<sekuba@users.noreply.github.com>)
- comparing to: main@2df820b7859b4cc22d454496f119009c157cc438 block: 20030638
- current block number: 20032983

## Description

Config related.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20030638 (main branch discovery), not current.

```diff
    contract SequencerInbox (0x51C4a227D59E49E26Ea07D8e4E9Af163da4c87A0) {
    +++ description: State batches / commitments get posted here.
      template:
+        "orbitstack/SequencerInbox"
    }
```

```diff
    contract RollupProxy (0xc4F7B37bE2bBbcF07373F28c61b1A259dfe49d2a) {
    +++ description: Manages rollup components, list of Stakers and Validators. Entry point for Validators creating new Rollup Nodes (state commits) and Challengers submitting fraud proofs.
      template:
+        "orbitstack/RollupProxy"
    }
```

Generated with discovered.json: 0x412c3152a7e9266e259ca114662031a4d33f2e21

# Diff at Thu, 06 Jun 2024 05:15:31 GMT:

- author: sekuba (<sekuba@users.noreply.github.com>)
- comparing to: main@508157754f563221cb69d9a7257ec7bb4f731937 block: 20025625
- current block number: 20030638

## Description

Reconfigured discovery to ignore token related values.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20025625 (main branch discovery), not current.

```diff
    contract RealVault (0xFC1db08622e81b2AFd643318f6B8B79E9980A5e1) {
    +++ description: None
      values.getVaultAvailableAmount:
-        [0,"310422643444773035033"]
      values.latestRoundID:
-        17
      values.withdrawAmountDust:
-        0
    }
```

Generated with discovered.json: 0xd8292d70fd71441d43b5cde9d3e77785b0a78059

# Diff at Wed, 05 Jun 2024 12:27:34 GMT:

- author: sekuba (<sekuba@users.noreply.github.com>)
- current block number: 20025625

## Description

Initial discovery: Orbit stack L2 by Gelato RaaS with AnyTrust 1/1 DAC. The custom native token is backed by  LSTs and the according Vaults are EOA-governed. (strategyManager unverified)

## Initial discovery

```diff
+   Status: CREATED
    contract OneStepProofEntry (0x09824fe72BFF474d16D9c2774432E381BBD60662)
    +++ description: None
```

```diff
+   Status: CREATED
    contract  (0x27C7Bfd2cC11429e9b80c443b42FDBe4754F6c91)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ValidatorUtils (0x2b0E04Dc90e3fA58165CB41E2834B44A56E766aF)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ChallengeManager (0x369001149fe80892665a7b0c17fe8Db6BeFC7F5d)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Bridge (0x39D2EEcC8B55f46aE64789E2494dE777cDDeED03)
    +++ description: None
```

```diff
+   Status: CREATED
    contract OneStepProverMemory (0x4811500e0d376Fa8d2EA3CCb7c61E0afB4F5A7f1)
    +++ description: None
```

```diff
+   Status: CREATED
    contract L1OrbitGatewayRouter (0x490f337Ac108b2a555183f5b5fd2ee84a7F45a18)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ERC20RollupEventInbox (0x503C5a576E2F72Ca9aD213D64bc775cbD81E0F2C)
    +++ description: None
```

```diff
+   Status: CREATED
    contract SequencerInbox (0x51C4a227D59E49E26Ea07D8e4E9Af163da4c87A0)
    +++ description: State batches / commitments get posted here.
```

```diff
+   Status: CREATED
    contract StrategyManager (0x5Cba18d504D4158dC1A18C5Dc6BB2a30B230DdD8)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Minter (0x655756824385F8903AC8cFDa17B656cc26f7C7da)
    +++ description: None
```

```diff
+   Status: CREATED
    contract  (0x679D4C1cC6855C57726BEA1784F578315d6431f6)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Outbox (0x8592Ca44dE1D354A20F75160F5602E5933D33761)
    +++ description: None
```

```diff
+   Status: CREATED
    contract OneStepProverMath (0x89AF7C4C2198c426cFe6E86de0680A0850503e06)
    +++ description: None
```

```diff
+   Status: CREATED
    contract OneStepProverHostIo (0x99a2A31300816C1FA3f40818AC9280fe7271F878)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ValidatorWalletCreator (0x9CAd81628aB7D8e239F1A5B497313341578c5F71)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ProxyAdmin (0xB032ff02cd6425e4b816137207AA8560932180f1)
    +++ description: None
```

```diff
+   Status: CREATED
    contract GelatoMultisig (0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Bridger (0xbf2F26cadbC10C4d61ac7e424D514d79a12126f8)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Real (0xC0Cc5eA00cAe0894B441E3B5a3Bb57aa92F15421)
    +++ description: None
```

```diff
+   Status: CREATED
    contract RollupProxy (0xc4F7B37bE2bBbcF07373F28c61b1A259dfe49d2a)
    +++ description: Manages rollup components, list of Stakers and Validators. Entry point for Validators creating new Rollup Nodes (state commits) and Challengers submitting fraud proofs.
```

```diff
+   Status: CREATED
    contract UpgradeExecutor (0xD6A4868a15d98b0BF4E9063BE707B4b89D067C3a)
    +++ description: None
```

```diff
+   Status: CREATED
    contract OneStepProver0 (0xDf94F0474F205D086dbc2e66D69a856FCf520622)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Inbox (0xf538671ddd60eE54BdD6FBb0E309c491A7A2df11)
    +++ description: None
```

```diff
+   Status: CREATED
    contract AssetsVault (0xf985E2c73d74BefF3C8c16EFC4fa5ab4cfb62294)
    +++ description: None
```

```diff
+   Status: CREATED
    contract RealVault (0xFC1db08622e81b2AFd643318f6B8B79E9980A5e1)
    +++ description: None
```

```diff
+   Status: CREATED
    contract L1OrbitERC20Gateway (0xfC89B875970122E24C6C5ADd4Dea139443943ea7)
    +++ description: None
```
