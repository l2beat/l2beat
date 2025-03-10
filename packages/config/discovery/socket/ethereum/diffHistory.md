Generated with discovered.json: 0x13c6c4e489cf58684c59bed1f04f7b85dab06d24

# Diff at Fri, 07 Mar 2025 14:41:44 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@c5dbe2ef6b8273c834507deba40dda8a1affce55 block: 21579626
- current block number: 21995661

## Description

Owner changes and new plug added.

## Watched changes

```diff
    contract USDT Vault Zora (0x1417f50f864ba75D5c6cb4CD14479c48Ce5166fB) {
    +++ description: None
      values.owner:
-        "0xE328a0B1e0bE7043c9141c2073e408D1086E1175"
+        "0x7B5Ba9Df17Bc58F504B6Cf0D87d2f05B79a36cfF"
    }
```

```diff
    contract KLAUS Vault Zora (0x528DBFcf6e2cbC62B05d7a74711AA7C44FF43cA2) {
    +++ description: None
      values.owner:
-        "0xE328a0B1e0bE7043c9141c2073e408D1086E1175"
+        "0x7B5Ba9Df17Bc58F504B6Cf0D87d2f05B79a36cfF"
    }
```

```diff
    contract USDC Vault Zora (0x58CDCf55f2c8660674F17561334F6370cbaDeEF8) {
    +++ description: None
      values.owner:
-        "0xE328a0B1e0bE7043c9141c2073e408D1086E1175"
+        "0x7B5Ba9Df17Bc58F504B6Cf0D87d2f05B79a36cfF"
    }
```

```diff
    contract Socket (0x943AC2775928318653e91d350574436A1b9b16f9) {
    +++ description: None
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.145:
+        "0x9ED094fDe2a31BEd0278a4cfdb5528473baFe5a8"
    }
```

Generated with discovered.json: 0xa807425a57fd9e401ec905802576a089af0a8078

# Diff at Tue, 04 Mar 2025 10:39:57 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@98d260b45fe0d2195ce5e629bd7b200c8706e8ba block: 21579626
- current block number: 21579626

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21579626 (main branch discovery), not current.

```diff
    contract WETH Vault Kinto (0x00A0c9d82B95a17Cdf2D46703F2DcA13EB0E8A94) {
    +++ description: None
      sinceBlock:
+        19905691
    }
```

```diff
    contract PolygonL1Switchboard (0x053407DFA30267f6332f3c94a9e9F704A55e62CD) {
    +++ description: None
      sinceBlock:
+        18583724
    }
```

```diff
    contract sdeUSD Vault Reya (0x0A5A19376064fED2A0A9f3120B2426c957BC289D) {
    +++ description: None
      sinceBlock:
+        20986446
    }
```

```diff
    contract deUSD Vault Reya (0x0b4447344fAAA340bcD2B0FdBD8f0CEcd161bC9E) {
    +++ description: None
      sinceBlock:
+        20986451
    }
```

```diff
    contract OptimismSwitchboard2 (0x0E674e057EC0FF97eeA57B6A350DBAAD22FE41BA) {
    +++ description: None
      sinceBlock:
+        18584376
    }
```

```diff
    contract MKR Vault Kinto (0x0fC783f611A888A2cAbC3dA482Add3215334dCc2) {
    +++ description: None
      sinceBlock:
+        20329021
    }
```

```diff
    contract CapacitorFactory (0x11Fbb9116801DB54bB51fF4dF423e34E8b45fc9a) {
    +++ description: None
      sinceBlock:
+        18583488
    }
```

```diff
    contract DAI Vault Kinto (0x12Cf431BdF7F143338cC09A0629EDcCEDCBCEcB5) {
    +++ description: None
      sinceBlock:
+        19891645
    }
```

```diff
    contract OptimismSwitchboard (0x139f39DC7dC05F7aC2DB3DB6af4f2e1a9De7c287) {
    +++ description: None
      sinceBlock:
+        18584378
    }
```

```diff
    contract USDT Vault Zora (0x1417f50f864ba75D5c6cb4CD14479c48Ce5166fB) {
    +++ description: None
      sinceBlock:
+        20734248
    }
```

```diff
    contract USDT Vault Kinto (0x1D18263107a138C7fb0De65b4a78d193ff9664c1) {
    +++ description: None
      sinceBlock:
+        21108579
    }
```

```diff
    contract WBTC Vault Reya (0x2344621d5aA6e784e8C6f4c54b0B29Dd9c3Ad4B6) {
    +++ description: None
      sinceBlock:
+        19733498
    }
```

```diff
    contract LyraMultisig (0x246d38588b16Dd877c558b245e6D5a711C649fCF) {
    +++ description: None
      sinceBlock:
+        11918385
    }
```

```diff
    contract eBTC Vault Derive (0x25d35C8796c9dcD3857abE90D802FC17b1FB55A5) {
    +++ description: None
      sinceBlock:
+        20837834
    }
```

```diff
    contract PAXG Vault Kinto (0x25f0D71Da51A77Ca231484eBbAD1f588A0230ef2) {
    +++ description: None
      sinceBlock:
+        20329110
    }
```

```diff
    contract USDe Vault Derive (0x26Cf1Dc84694E04277F2Fe4C13E43597c6010C2A) {
    +++ description: None
      sinceBlock:
+        20568476
    }
```

```diff
    contract KINTO Vault Kinto (0x2f87464d5F5356dB350dcb302FE28040986783a7) {
    +++ description: None
      sinceBlock:
+        20162145
    }
```

```diff
    contract ENA Vault Kinto (0x351d8894fB8bfa1b0eFF77bFD9Aab18eA2da8fDd) {
    +++ description: None
      sinceBlock:
+        19905737
    }
```

```diff
    contract rsETH Vault Derive (0x35d4D9bc79B0a543934b1769304B90d752691caD) {
    +++ description: None
      sinceBlock:
+        20036749
    }
```

```diff
    contract WBTC Vault Derive (0x3Eec7c855aF33280F1eD38b93059F5aa5862E3ab) {
    +++ description: None
      sinceBlock:
+        18991397
    }
```

```diff
    contract sUSDe Vault Kinto (0x43b718Aa5e678b08615CA984cbe25f690B085b32) {
    +++ description: None
      sinceBlock:
+        19905815
    }
```

```diff
    contract rswETH Vault Derive (0x4BB4C3CDc7562f08e9910A0C7D8bB7e108861eB4) {
    +++ description: None
      sinceBlock:
+        19881920
    }
```

```diff
    contract KLAUS Vault Zora (0x528DBFcf6e2cbC62B05d7a74711AA7C44FF43cA2) {
    +++ description: None
      sinceBlock:
+        21108607
    }
```

```diff
    contract USDC Vault Zora (0x58CDCf55f2c8660674F17561334F6370cbaDeEF8) {
    +++ description: None
      sinceBlock:
+        20734237
    }
```

```diff
    contract sDAI Vault Kinto (0x5B8Ae1C9c5970e2637Cf3Af431acAAebEf7aFb85) {
    +++ description: None
      sinceBlock:
+        19905811
    }
```

```diff
    contract Hasher (0x5C71beE4a6b0D617D8c3d107D331292741789E27) {
    +++ description: None
      sinceBlock:
+        18583487
    }
```

```diff
    contract USDT Vault Derive (0x5e98A25d8d6FF69A8992d6Aa57948dFB77D4ECBa) {
    +++ description: None
      sinceBlock:
+        19032542
    }
```

```diff
    contract cbBTC Vault Derive (0x5F18C54e4E10287414A47925a24Ea3A8Cf4A9F50) {
    +++ description: None
      sinceBlock:
+        20837808
    }
```

```diff
    contract sUSDe Vault Reya (0x5F3B301B4967623fDb3AE52Bb8FF4dB01C460Cd3) {
    +++ description: None
      sinceBlock:
+        20620391
    }
```

```diff
    contract sDAI Vault Derive (0x613e87BE1cd75dEBC5e6e56a2AF2fED84162C142) {
    +++ description: None
      sinceBlock:
+        20568467
    }
```

```diff
    contract sDAI Vault Polynomial (0x615172e47c0C5A6dA8ea959632Ac0166f7a59eDc) {
    +++ description: None
      sinceBlock:
+        20326243
    }
```

```diff
    contract WETH Vault Reya (0x64dF894688c5052BeAdC35371cF69151Ebc5D658) {
    +++ description: None
      sinceBlock:
+        19920603
    }
```

```diff
    contract USDC Vault Derive (0x6D303CEE7959f814042D31E0624fB88Ec6fbcC1d) {
    +++ description: None
      sinceBlock:
+        18591914
    }
```

```diff
    contract USDC Vault Kinto (0x755cD5d147036E11c76F1EeffDd94794fC265f0d) {
    +++ description: None
      sinceBlock:
+        19905710
    }
```

```diff
    contract LBTC Vault Derive (0x76624ff43D610F64177Bb9c194A2503642e9B803) {
    +++ description: None
      sinceBlock:
+        20644303
    }
```

```diff
    contract SNX Vault Derive (0x7D7aC8d55A9bD4152b703011f3E61AB3bB0A5592) {
    +++ description: None
      sinceBlock:
+        19257597
    }
```

```diff
    contract DAI Vault Derive (0x7E1d17b580dD4F89037DB331430eAEe8B8e50c91) {
    +++ description: None
      sinceBlock:
+        20568457
    }
```

```diff
    contract weETH Vault Derive (0x8180EcCC825b692ef65FF099a0A387743788bf78) {
    +++ description: None
      sinceBlock:
+        19881204
    }
```

```diff
    contract cbBTC Vault Kinto (0x8F5247072e9580624Be243D4EC8cD3F3ABfF86B9) {
    +++ description: None
      sinceBlock:
+        21108816
    }
```

```diff
    contract Socket (0x943AC2775928318653e91d350574436A1b9b16f9) {
    +++ description: None
      sinceBlock:
+        18583489
    }
```

```diff
    contract ETHFI Vault Kinto (0x95d60E34aB2E626407d98dF8C240e6174e5D37E5) {
    +++ description: None
      sinceBlock:
+        19911811
    }
```

```diff
    contract ExecutionManager (0x98CAd9A205f1F7A7150241Ef2d565d1702BCe57C) {
    +++ description: None
      sinceBlock:
+        20362743
    }
```

```diff
    contract SOL Vault Kinto (0xA2bc0DaA9BF98820632bCa0663a9616f6bC180f8) {
    +++ description: None
      sinceBlock:
+        20721977
    }
```

```diff
    contract LINK Vault Kinto (0xA6Ae29Ce5c38DFE0Dd95B716748ac747f31E4013) {
    +++ description: None
      sinceBlock:
+        21108695
    }
```

```diff
    contract LOOKS Vault Blast (0xa83B4006c16DAeAb2718294696c0122519195137) {
    +++ description: None
      sinceBlock:
+        20038317
    }
```

```diff
    contract USDe Vault Reya (0xaA2f2B6cD33Eaabb795c6DB60AAec599C8450F35) {
    +++ description: None
      sinceBlock:
+        20435172
    }
```

```diff
    contract wstETH Vault Kinto (0xc5d01939Af7Ce9Ffc505F0bb36eFeDde7920f2dc) {
    +++ description: None
      sinceBlock:
+        19904529
    }
```

```diff
    contract sUSDe Vault Polynomial (0xC6cfb996A7CFEB89813A68CD13942CD75553032b) {
    +++ description: None
      sinceBlock:
+        20339816
    }
```

```diff
    contract LooksRareMultisig (0xC8C57e4C73c71f72cA0a7e043E5D2D144F98ef13) {
    +++ description: None
      sinceBlock:
+        13976268
    }
```

```diff
    contract XAUt Vault Kinto (0xd04Bc056BE36a6127267E4F71d3b43D1BEEfE8bF) {
    +++ description: None
      sinceBlock:
+        20329119
    }
```

```diff
    contract SPX Vault Kinto (0xd1228C6CB94a670F30D5ACb1340a9d96aC30e6A8) {
    +++ description: None
      sinceBlock:
+        21066552
    }
```

```diff
    contract WETH Vault Derive (0xD4efe33C66B8CdE33B8896a2126E41e5dB571b7e) {
    +++ description: None
      sinceBlock:
+        18991429
    }
```

```diff
    contract FastSwitchboard (0xD5a83a40F262E2247e6566171f9ADc76b745F5cD) {
    +++ description: None
      sinceBlock:
+        18583721
    }
```

```diff
    contract eUSD Vault Kinto (0xDB0e855F55ff35dA8754e5297925bd6c4Cb1Fa48) {
    +++ description: None
      sinceBlock:
+        20902195
    }
```

```diff
    contract EIGEN Vault Kinto (0xdb161cdc9c11892922F7121a409b196f3b00e640) {
    +++ description: None
      sinceBlock:
+        19905803
    }
```

```diff
    contract USDC Vault Polynomial (0xDE1617Ddb7C8A250A409D986930001985cfad76F) {
    +++ description: None
      sinceBlock:
+        20331066
    }
```

```diff
    contract USDe Vault Kinto (0xdf34E61B6e7B9e348713d528fEB019d504d38c1e) {
    +++ description: None
      sinceBlock:
+        19905761
    }
```

```diff
    contract ArbitrumL1Switchboard (0xdf5f7dfDFc26ee5F629949e330bEf56906319CAe) {
    +++ description: None
      sinceBlock:
+        18583726
    }
```

```diff
    contract USD0++ Vault Polynomial (0xDf9Fa2b420689384E8DD55a706262DC0ED37020F) {
    +++ description: None
      sinceBlock:
+        20970833
    }
```

```diff
    contract USDC Vault Reya (0xdFf78A949E47c1e90f3Dd6dd7Fe2Fa72B42a75f7) {
    +++ description: None
      sinceBlock:
+        19590078
    }
```

```diff
    contract sUSDe Vault Derive (0xE3E96892D30E0ee1a8131BAf87c891201F7137bf) {
    +++ description: None
      sinceBlock:
+        20211402
    }
```

```diff
    contract weETH Vault Kinto (0xeB66259d2eBC3ed1d3a98148f6298927d8A36397) {
    +++ description: None
      sinceBlock:
+        19905823
    }
```

```diff
    contract wstETH Vault Derive (0xeBB5D642aA8ccDeE98373D6aC3ee0602b63824b3) {
    +++ description: None
      sinceBlock:
+        19358636
    }
```

```diff
    contract TransmitManager (0xeD037aFBffC65a94E9CC592947E851FB2f730341) {
    +++ description: None
      sinceBlock:
+        18583720
    }
```

```diff
    contract  (0xeeF6520437A6545b4F325F6675C4CD49812d457b) {
    +++ description: None
      sinceBlock:
+        21544458
    }
```

```diff
    contract KintoMultisig (0xf152Abda9E4ce8b134eF22Dc3C6aCe19C4895D82) {
    +++ description: None
      sinceBlock:
+        16818229
    }
```

```diff
    contract SignatureVerifier (0xf1ABF110d1B6ff0E2e8C05dd64FBF9eBA4d8af98) {
    +++ description: None
      sinceBlock:
+        18583486
    }
```

Generated with discovered.json: 0xa8168612e1459760abc88e2794588397494f5e2a

# Diff at Mon, 20 Jan 2025 09:25:24 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@82d3b5c180381f7d2d0e30406b2ac10025d0614f block: 21579626
- current block number: 21579626

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21579626 (main branch discovery), not current.

```diff
    contract Socket (0x943AC2775928318653e91d350574436A1b9b16f9) {
    +++ description: None
      fieldMeta.plugs.type:
+        "CODE_CHANGE"
    }
```

Generated with discovered.json: 0x3503eafda0d0da3d8088681cdf0a5034540c9393

# Diff at Wed, 08 Jan 2025 12:04:43 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@3e3597c92f09cb5fc5a7ac01db63929f663c026f block: 21428964
- current block number: 21579626

## Description

New plugs and owner changes to a new socket EOA.

## Watched changes

```diff
    contract PolygonL1Switchboard (0x053407DFA30267f6332f3c94a9e9F704A55e62CD) {
    +++ description: None
      values.owner:
-        "0xB0BBff6311B7F245761A7846d3Ce7B1b100C1836"
+        "0xeeF6520437A6545b4F325F6675C4CD49812d457b"
    }
```

```diff
    contract OptimismSwitchboard2 (0x0E674e057EC0FF97eeA57B6A350DBAAD22FE41BA) {
    +++ description: None
      values.owner:
-        "0xB0BBff6311B7F245761A7846d3Ce7B1b100C1836"
+        "0xeeF6520437A6545b4F325F6675C4CD49812d457b"
    }
```

```diff
    contract CapacitorFactory (0x11Fbb9116801DB54bB51fF4dF423e34E8b45fc9a) {
    +++ description: None
      values.owner:
-        "0xB0BBff6311B7F245761A7846d3Ce7B1b100C1836"
+        "0xeeF6520437A6545b4F325F6675C4CD49812d457b"
    }
```

```diff
    contract OptimismSwitchboard (0x139f39DC7dC05F7aC2DB3DB6af4f2e1a9De7c287) {
    +++ description: None
      values.owner:
-        "0xB0BBff6311B7F245761A7846d3Ce7B1b100C1836"
+        "0xeeF6520437A6545b4F325F6675C4CD49812d457b"
    }
```

```diff
    contract Hasher (0x5C71beE4a6b0D617D8c3d107D331292741789E27) {
    +++ description: None
      values.owner:
-        "0xB0BBff6311B7F245761A7846d3Ce7B1b100C1836"
+        "0xeeF6520437A6545b4F325F6675C4CD49812d457b"
    }
```

```diff
    contract Socket (0x943AC2775928318653e91d350574436A1b9b16f9) {
    +++ description: None
      values.owner:
-        "0xB0BBff6311B7F245761A7846d3Ce7B1b100C1836"
+        "0xeeF6520437A6545b4F325F6675C4CD49812d457b"
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.144:
+        "0x04bc61DBd949f068387cfC7a7fB95555bc66F5C5"
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.143:
+        "0x833a7FA0Ff734b2BA01e8d2126e127cf8f29eFaD"
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.142:
+        "0x412CC246d703598e3705B9536B4Ec3c2039f6e5E"
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.141:
+        "0x95c879322BA01e1c7Fe5EB3F3724C49C6aF7e426"
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.140:
+        "0x3Deb3254730eEF7c50fb5b133CA0EaeA2e59127d"
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.139:
+        "0x1a0e7Efa0F74703A930B2b1Cb6565b1d8981dd85"
    }
```

```diff
    contract ExecutionManager (0x98CAd9A205f1F7A7150241Ef2d565d1702BCe57C) {
    +++ description: None
      values.owner:
-        "0xB0BBff6311B7F245761A7846d3Ce7B1b100C1836"
+        "0xeeF6520437A6545b4F325F6675C4CD49812d457b"
    }
```

```diff
    contract FastSwitchboard (0xD5a83a40F262E2247e6566171f9ADc76b745F5cD) {
    +++ description: None
      values.owner:
-        "0xB0BBff6311B7F245761A7846d3Ce7B1b100C1836"
+        "0xeeF6520437A6545b4F325F6675C4CD49812d457b"
    }
```

```diff
    contract ArbitrumL1Switchboard (0xdf5f7dfDFc26ee5F629949e330bEf56906319CAe) {
    +++ description: None
      values.owner:
-        "0xB0BBff6311B7F245761A7846d3Ce7B1b100C1836"
+        "0xeeF6520437A6545b4F325F6675C4CD49812d457b"
    }
```

```diff
    contract TransmitManager (0xeD037aFBffC65a94E9CC592947E851FB2f730341) {
    +++ description: None
      values.owner:
-        "0xB0BBff6311B7F245761A7846d3Ce7B1b100C1836"
+        "0xeeF6520437A6545b4F325F6675C4CD49812d457b"
    }
```

```diff
    contract SignatureVerifier (0xf1ABF110d1B6ff0E2e8C05dd64FBF9eBA4d8af98) {
    +++ description: None
      values.owner:
-        "0xB0BBff6311B7F245761A7846d3Ce7B1b100C1836"
+        "0xeeF6520437A6545b4F325F6675C4CD49812d457b"
    }
```

```diff
+   Status: CREATED
    contract  (0xeeF6520437A6545b4F325F6675C4CD49812d457b)
    +++ description: None
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21428964 (main branch discovery), not current.

```diff
    contract USD0++ Vault Polynomial (0xDf9Fa2b420689384E8DD55a706262DC0ED37020F) {
    +++ description: None
      unverified:
-        true
      values.bridgeType:
+        "0x9faa379a8f7762447354a00c30bda6b12f39577783c03b588d3fd75b4e2a5876"
      values.nominee:
+        "0x0000000000000000000000000000000000000000"
      values.owner:
+        "0x9f76043B23125024Ce5f0Fb4AE707482107dd2a8"
      sourceHashes:
+        ["0xc3321c0d760c3f5fe8845b9fdd3fb32455ca5317920d929526142e921ddc68d9"]
    }
```

Generated with discovered.json: 0x9cdfbc24d1629059d43619ffceb966fdb28a3f57

# Diff at Wed, 18 Dec 2024 10:57:41 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@a44ef6747febdd9930ef05420e60556c20899f13 block: 21394305
- current block number: 21428964

## Description

Owner pointers of socketadmin.eth changed to a new (socket-funded) EOA.

## Watched changes

```diff
    contract WBTC Vault Reya (0x2344621d5aA6e784e8C6f4c54b0B29Dd9c3Ad4B6) {
    +++ description: None
      values.owner:
-        "0x5fD7D0d6b91CC4787Bcb86ca47e0Bd4ea0346d34"
+        "0xB0BBff6311B7F245761A7846d3Ce7B1b100C1836"
    }
```

```diff
    contract WETH Vault Reya (0x64dF894688c5052BeAdC35371cF69151Ebc5D658) {
    +++ description: None
      values.owner:
-        "0x5fD7D0d6b91CC4787Bcb86ca47e0Bd4ea0346d34"
+        "0xB0BBff6311B7F245761A7846d3Ce7B1b100C1836"
    }
```

```diff
    contract Socket (0x943AC2775928318653e91d350574436A1b9b16f9) {
    +++ description: None
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.138:
+        "0x75695e8A56405dC60a0aFf07d1AF01A0baCA7188"
    }
```

```diff
    contract USDe Vault Reya (0xaA2f2B6cD33Eaabb795c6DB60AAec599C8450F35) {
    +++ description: None
      values.owner:
-        "0x5fD7D0d6b91CC4787Bcb86ca47e0Bd4ea0346d34"
+        "0xB0BBff6311B7F245761A7846d3Ce7B1b100C1836"
    }
```

```diff
    contract USDC Vault Reya (0xdFf78A949E47c1e90f3Dd6dd7Fe2Fa72B42a75f7) {
    +++ description: None
      values.owner:
-        "0x5fD7D0d6b91CC4787Bcb86ca47e0Bd4ea0346d34"
+        "0xB0BBff6311B7F245761A7846d3Ce7B1b100C1836"
    }
```

Generated with discovered.json: 0x14dd41929a299910e18622e57318631aefcd6b63

# Diff at Fri, 13 Dec 2024 14:51:52 GMT:

- author: vincfurc (<10850139+vincfurc@users.noreply.github.com>)
- comparing to: main@057a0310a9622d3c37d8b5e224c59b5dbd3a0507 block: 21388211
- current block number: 21394305

## Description

New socket, unverified.

## Watched changes

```diff
    contract Socket (0x943AC2775928318653e91d350574436A1b9b16f9) {
    +++ description: None
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.137:
+        "0x15f70f64438603e5872A4E81c7a8B5edB5D70d93"
    }
```

Generated with discovered.json: 0x78fb2ab272ee12498d40aeb036dff44dff969d4b

# Diff at Thu, 12 Dec 2024 18:27:06 GMT:

- author: vincfurc (<10850139+vincfurc@users.noreply.github.com>)
- comparing to: main@fa5a98638066331a8ea6329a256a3462e7da2b3a block: 21358014
- current block number: 21388211

## Description

New plugs (SolvBTC, SolvBTC.BNN).

## Watched changes

```diff
    contract Socket (0x943AC2775928318653e91d350574436A1b9b16f9) {
    +++ description: None
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.136:
+        "0xA2bE759B86CeA53372C3e9a882047cdC3884D568"
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.135:
+        "0x94104d7801f30d2f9069118C65Fe63A3A11515B1"
    }
```

Generated with discovered.json: 0xf3fa224072fe364832c2eb794cce180e0b0147d8

# Diff at Sun, 08 Dec 2024 13:17:33 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@59fd7a30471906b5a479f280731621e94e22f17c block: 21122046
- current block number: 21358014

## Description

New plugs, crawl result and tokens added.

## Watched changes

```diff
    contract USDT Vault Kinto (0x1D18263107a138C7fb0De65b4a78d193ff9664c1) {
    +++ description: None
      values.owner:
-        "0x660ad4B5A74130a4796B4d54BC6750Ae93C86e6c"
+        "0xf152Abda9E4ce8b134eF22Dc3C6aCe19C4895D82"
    }
```

```diff
    contract cbBTC Vault Kinto (0x8F5247072e9580624Be243D4EC8cD3F3ABfF86B9) {
    +++ description: None
      values.owner:
-        "0x660ad4B5A74130a4796B4d54BC6750Ae93C86e6c"
+        "0xf152Abda9E4ce8b134eF22Dc3C6aCe19C4895D82"
    }
```

```diff
    contract Socket (0x943AC2775928318653e91d350574436A1b9b16f9) {
    +++ description: None
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.134:
+        "0x12a4CC40a8F89E40F8C849c2F89741D5C9590a14"
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.133:
+        "0x1734067c2CDcFb81ef9672F80DA2D7bfC2CFAE73"
    }
```

```diff
    contract LINK Vault Kinto (0xA6Ae29Ce5c38DFE0Dd95B716748ac747f31E4013) {
    +++ description: None
      values.owner:
-        "0x660ad4B5A74130a4796B4d54BC6750Ae93C86e6c"
+        "0xf152Abda9E4ce8b134eF22Dc3C6aCe19C4895D82"
    }
```

```diff
    contract SPX Vault Kinto (0xd1228C6CB94a670F30D5ACb1340a9d96aC30e6A8) {
    +++ description: None
      values.owner:
-        "0x660ad4B5A74130a4796B4d54BC6750Ae93C86e6c"
+        "0xf152Abda9E4ce8b134eF22Dc3C6aCe19C4895D82"
    }
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21122046 (main branch discovery), not current.

```diff
    contract eBTC Vault Derive (0x25d35C8796c9dcD3857abE90D802FC17b1FB55A5) {
    +++ description: None
      name:
-        "eBTC Vault Lyra"
+        "eBTC Vault Derive"
    }
```

```diff
    contract USDe Vault Derive (0x26Cf1Dc84694E04277F2Fe4C13E43597c6010C2A) {
    +++ description: None
      name:
-        "USDe Vault Lyra"
+        "USDe Vault Derive"
    }
```

```diff
    contract rsETH Vault Derive (0x35d4D9bc79B0a543934b1769304B90d752691caD) {
    +++ description: None
      name:
-        "rsETH Vault Lyra"
+        "rsETH Vault Derive"
    }
```

```diff
    contract WBTC Vault Derive (0x3Eec7c855aF33280F1eD38b93059F5aa5862E3ab) {
    +++ description: None
      name:
-        "WBTC Vault Lyra"
+        "WBTC Vault Derive"
    }
```

```diff
    contract rswETH Vault Derive (0x4BB4C3CDc7562f08e9910A0C7D8bB7e108861eB4) {
    +++ description: None
      name:
-        "rswETH Vault Lyra"
+        "rswETH Vault Derive"
    }
```

```diff
    contract USDT Vault Derive (0x5e98A25d8d6FF69A8992d6Aa57948dFB77D4ECBa) {
    +++ description: None
      name:
-        "USDT Vault Lyra"
+        "USDT Vault Derive"
    }
```

```diff
    contract cbBTC Vault Derive (0x5F18C54e4E10287414A47925a24Ea3A8Cf4A9F50) {
    +++ description: None
      name:
-        "cbBTC Vault Lyra"
+        "cbBTC Vault Derive"
    }
```

```diff
    contract sDAI Vault Derive (0x613e87BE1cd75dEBC5e6e56a2AF2fED84162C142) {
    +++ description: None
      name:
-        "sDAI Vault Lyra"
+        "sDAI Vault Derive"
    }
```

```diff
    contract USDC Vault Derive (0x6D303CEE7959f814042D31E0624fB88Ec6fbcC1d) {
    +++ description: None
      name:
-        "USDC Vault Lyra"
+        "USDC Vault Derive"
    }
```

```diff
    contract LBTC Vault Derive (0x76624ff43D610F64177Bb9c194A2503642e9B803) {
    +++ description: None
      name:
-        "LBTC Vault Lyra"
+        "LBTC Vault Derive"
    }
```

```diff
    contract SNX Vault Derive (0x7D7aC8d55A9bD4152b703011f3E61AB3bB0A5592) {
    +++ description: None
      name:
-        "SNX Vault Lyra"
+        "SNX Vault Derive"
    }
```

```diff
    contract DAI Vault Derive (0x7E1d17b580dD4F89037DB331430eAEe8B8e50c91) {
    +++ description: None
      name:
-        "DAI Vault Lyra"
+        "DAI Vault Derive"
    }
```

```diff
    contract weETH Vault Derive (0x8180EcCC825b692ef65FF099a0A387743788bf78) {
    +++ description: None
      name:
-        "weETH Vault Lyra"
+        "weETH Vault Derive"
    }
```

```diff
    contract WETH Vault Derive (0xD4efe33C66B8CdE33B8896a2126E41e5dB571b7e) {
    +++ description: None
      name:
-        "WETH Vault Lyra"
+        "WETH Vault Derive"
    }
```

```diff
    contract sUSDe Vault Derive (0xE3E96892D30E0ee1a8131BAf87c891201F7137bf) {
    +++ description: None
      name:
-        "sUSDe Vault Lyra"
+        "sUSDe Vault Derive"
    }
```

```diff
    contract wstETH Vault Derive (0xeBB5D642aA8ccDeE98373D6aC3ee0602b63824b3) {
    +++ description: None
      name:
-        "wstETH Vault Lyra"
+        "wstETH Vault Derive"
    }
```

```diff
+   Status: CREATED
    contract sdeUSD Vault Reya (0x0A5A19376064fED2A0A9f3120B2426c957BC289D)
    +++ description: None
```

```diff
+   Status: CREATED
    contract deUSD Vault Reya (0x0b4447344fAAA340bcD2B0FdBD8f0CEcd161bC9E)
    +++ description: None
```

```diff
+   Status: CREATED
    contract USDT Vault Zora (0x1417f50f864ba75D5c6cb4CD14479c48Ce5166fB)
    +++ description: None
```

```diff
+   Status: CREATED
    contract USDT Vault Kinto (0x1D18263107a138C7fb0De65b4a78d193ff9664c1)
    +++ description: None
```

```diff
+   Status: CREATED
    contract KLAUS Vault Zora (0x528DBFcf6e2cbC62B05d7a74711AA7C44FF43cA2)
    +++ description: None
```

```diff
+   Status: CREATED
    contract USDC Vault Zora (0x58CDCf55f2c8660674F17561334F6370cbaDeEF8)
    +++ description: None
```

```diff
+   Status: CREATED
    contract cbBTC Vault Kinto (0x8F5247072e9580624Be243D4EC8cD3F3ABfF86B9)
    +++ description: None
```

```diff
+   Status: CREATED
    contract LINK Vault Kinto (0xA6Ae29Ce5c38DFE0Dd95B716748ac747f31E4013)
    +++ description: None
```

```diff
+   Status: CREATED
    contract SPX Vault Kinto (0xd1228C6CB94a670F30D5ACb1340a9d96aC30e6A8)
    +++ description: None
```

Generated with discovered.json: 0x6f738121fd1b6546caabeef37c420d34b7d8e266

# Diff at Tue, 05 Nov 2024 14:29:39 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@5e6ce51851b57187ccdd52c4944a82e2a8ab1e88 block: 21093405
- current block number: 21122046

## Description

New plugs, will add Kinto tokens separately.

## Watched changes

```diff
    contract Socket (0x943AC2775928318653e91d350574436A1b9b16f9) {
    +++ description: None
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.132:
+        "0xb5d5E523905bB397bCAfB36B252535a255d3E23C"
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.131:
+        "0x5D5a2999E91A336CA99da0cB636898ccB521f40a"
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.130:
+        "0xab722902681A260762084A78A2d8f19CfA6A46Ef"
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.129:
+        "0x9d13F2b3B694DE6a1cF58edb5044454CAE3B84E4"
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.128:
+        "0x10ed00FDb26Ec6BE0183e6f14D8275d5898B0721"
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.127:
+        "0x76C9129b44c637500c88760ADd2EbEF07472b549"
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.126:
+        "0x0c39a1b042AbfC68d10B78081AFE3F58a6523A35"
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.125:
+        "0xB1b7BC699cAEcB941e7377065c7CE82039889603"
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.124:
+        "0x008244E37A90E090dc4abD70F37195075cbE8453"
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.123:
+        "0xFb0c284CD9929eB5139eB027aD7497097Ba25C87"
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.122:
+        "0x5366D4acCC96Ed297e30B8702FBC9b85daA3a459"
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.121:
+        "0x29ACa1443F28DceDEBf99173b37b5C1e814cA548"
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.120:
+        "0xf7a4a34d64E8fE4FCCffE2f3C985D43409Aa8c9a"
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.119:
+        "0xb9703b625c3B846B58DFdaDBceF77e34a1C59965"
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.118:
+        "0xBbA3095f6ACA17ff23Df466833D621cc91Db7675"
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.117:
+        "0xC3875afddEde146DCfED7e72b2Ad12B853CA1241"
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.116:
+        "0x65A9b862671de5Df85EcE387220C6b10a17230f7"
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.115:
+        "0x5deeAb623C6091A0A59E6d041dAAE9bDeFBfC203"
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.114:
+        "0x7E34B138e507570bDCC9b99230cFaA2745F0222C"
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.113:
+        "0x3390ca7A0D7C80871B05C3FeBbeEee91307a35ba"
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.112:
+        "0xCE0AB493716d96C0979E0B708BeF1915F3B07e01"
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.111:
+        "0x6dED17643D7acFc0bE0e79ff6C4762F12AA5516E"
    }
```

Generated with discovered.json: 0xe6595a97e5c30fb6c4e3d7cab86f6bc1ec21f6b1

# Diff at Fri, 01 Nov 2024 14:31:43 GMT:

- author: vincfurc (<10850139+vincfurc@users.noreply.github.com>)
- comparing to: main@cd1f0e71bb08ce16b2084a11b768538e8aa6ba8c block: 21064404
- current block number: 21093405

## Description

New plug, token already in a vault.

## Watched changes

```diff
    contract Socket (0x943AC2775928318653e91d350574436A1b9b16f9) {
    +++ description: None
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.110:
+        "0x92469EEf05a071B0e56275b23597b1b701C15a71"
    }
```

Generated with discovered.json: 0x32132ccd3c6ecd135d75d553836a305b2f4685ae

# Diff at Mon, 28 Oct 2024 13:24:35 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@00bd1d18460d612b1f06ce2339854c105cd41bd5 block: 21027491
- current block number: 21064404

## Description

New plugs, data updated, no significant new token escrows.

## Watched changes

```diff
    contract Socket (0x943AC2775928318653e91d350574436A1b9b16f9) {
    +++ description: None
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.109:
+        "0xf1807B621efC3B072d1203dD28C880BBEDc56161"
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.108:
+        "0xE3255bb716d8BA81aA97Ff20c75b404D9844CBE1"
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.107:
+        "0x7FBCd72B6368f1771C9F6Ee16502C19b0AADBa1D"
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.106:
+        "0xCF83efEe74f61771AF78b05DeA847773D3952C33"
    }
```

Generated with discovered.json: 0x314d6b031cf39abbec7f48054832ebf8b2e71de2

# Diff at Wed, 23 Oct 2024 09:48:53 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@2734bfe28641dfdb3277a5800faf0a057c08a58f block: 20977251
- current block number: 21027491

## Description

New plugs, added cbBTC to Lyra.

## Watched changes

```diff
    contract Socket (0x943AC2775928318653e91d350574436A1b9b16f9) {
    +++ description: None
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.105:
+        "0xE88F6b194BD3b43013710A785DDFF41454A19537"
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.104:
+        "0xFAB1efe6cA9435faEf9e29f40E575e27A74373A9"
    }
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20977251 (main branch discovery), not current.

```diff
+   Status: CREATED
    contract cbBTC Vault Lyra (0x5F18C54e4E10287414A47925a24Ea3A8Cf4A9F50)
    +++ description: None
```

```diff
+   Status: CREATED
    contract USD0++ Vault Polynomial (0xDf9Fa2b420689384E8DD55a706262DC0ED37020F)
    +++ description: None
```

Generated with discovered.json: 0x5c01b9d549184d634e7d32f167de18259c782792

# Diff at Wed, 16 Oct 2024 09:34:29 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@b6ff61526cf3d704839d0155008ae72cc9070de8 block: 20912886
- current block number: 20977251

## Description

New plug for USD0++ (not added). Refreshed crawl data.

## Watched changes

```diff
    contract Socket (0x943AC2775928318653e91d350574436A1b9b16f9) {
    +++ description: None
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.103:
+        "0x80f5143AF6BF51B38C038BaFF71465Be9b48cAEe"
    }
```

Generated with discovered.json: 0xdd8088e5cdc88df48d54b85c0508d693ad7455a0

# Diff at Mon, 14 Oct 2024 10:56:03 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@1afc77ff111ceb0970e7d09efcc7b2f376b0c281 block: 20912886
- current block number: 20912886

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20912886 (main branch discovery), not current.

```diff
    contract WETH Vault Kinto (0x00A0c9d82B95a17Cdf2D46703F2DcA13EB0E8A94) {
    +++ description: None
      sourceHashes:
+        ["0x5a961d4cd1fe9b96535b53aaf638b45677b06e22d26037a62ccf6adc9c29f79d"]
    }
```

```diff
    contract PolygonL1Switchboard (0x053407DFA30267f6332f3c94a9e9F704A55e62CD) {
    +++ description: None
      sourceHashes:
+        ["0x1173a4411a4a452037ed000a299c3136ab3d547cca61ee51628aa7c54ff20651"]
    }
```

```diff
    contract OptimismSwitchboard2 (0x0E674e057EC0FF97eeA57B6A350DBAAD22FE41BA) {
    +++ description: None
      sourceHashes:
+        ["0x5ce8017c8b58163d4cf21dc4e0dec9218e5b4e093c40fb19d970e8c807fbf4d4"]
    }
```

```diff
    contract MKR Vault Kinto (0x0fC783f611A888A2cAbC3dA482Add3215334dCc2) {
    +++ description: None
      sourceHashes:
+        ["0x5a961d4cd1fe9b96535b53aaf638b45677b06e22d26037a62ccf6adc9c29f79d"]
    }
```

```diff
    contract CapacitorFactory (0x11Fbb9116801DB54bB51fF4dF423e34E8b45fc9a) {
    +++ description: None
      sourceHashes:
+        ["0x6464768c2bcc3c1a2d6c108a2366460fe668d285547a02040bdac245de51ca89"]
    }
```

```diff
    contract DAI Vault Kinto (0x12Cf431BdF7F143338cC09A0629EDcCEDCBCEcB5) {
    +++ description: None
      sourceHashes:
+        ["0x5a961d4cd1fe9b96535b53aaf638b45677b06e22d26037a62ccf6adc9c29f79d"]
    }
```

```diff
    contract OptimismSwitchboard (0x139f39DC7dC05F7aC2DB3DB6af4f2e1a9De7c287) {
    +++ description: None
      sourceHashes:
+        ["0x5ce8017c8b58163d4cf21dc4e0dec9218e5b4e093c40fb19d970e8c807fbf4d4"]
    }
```

```diff
    contract WBTC Vault Reya (0x2344621d5aA6e784e8C6f4c54b0B29Dd9c3Ad4B6) {
    +++ description: None
      sourceHashes:
+        ["0x5a961d4cd1fe9b96535b53aaf638b45677b06e22d26037a62ccf6adc9c29f79d"]
    }
```

```diff
    contract LyraMultisig (0x246d38588b16Dd877c558b245e6D5a711C649fCF) {
    +++ description: None
      sourceHashes:
+        ["0xd5a33441170541b7df25812e0e3dff6562b2f09ab835a6b431cb9e7198a47605","0xd42bbf9f7dcd3720a7fc6bdc6edfdfae8800a37d6dd4decfa0ef6ca4a2e88940"]
    }
```

```diff
    contract eBTC Vault Lyra (0x25d35C8796c9dcD3857abE90D802FC17b1FB55A5) {
    +++ description: None
      sourceHashes:
+        ["0x31b99c44ab28174db25b94c3cca9ad4f335866894a5437384040c7bd682fca11"]
    }
```

```diff
    contract PAXG Vault Kinto (0x25f0D71Da51A77Ca231484eBbAD1f588A0230ef2) {
    +++ description: None
      sourceHashes:
+        ["0x5a961d4cd1fe9b96535b53aaf638b45677b06e22d26037a62ccf6adc9c29f79d"]
    }
```

```diff
    contract USDe Vault Lyra (0x26Cf1Dc84694E04277F2Fe4C13E43597c6010C2A) {
    +++ description: None
      sourceHashes:
+        ["0x31b99c44ab28174db25b94c3cca9ad4f335866894a5437384040c7bd682fca11"]
    }
```

```diff
    contract KINTO Vault Kinto (0x2f87464d5F5356dB350dcb302FE28040986783a7) {
    +++ description: None
      sourceHashes:
+        ["0x5a961d4cd1fe9b96535b53aaf638b45677b06e22d26037a62ccf6adc9c29f79d"]
    }
```

```diff
    contract ENA Vault Kinto (0x351d8894fB8bfa1b0eFF77bFD9Aab18eA2da8fDd) {
    +++ description: None
      sourceHashes:
+        ["0x5a961d4cd1fe9b96535b53aaf638b45677b06e22d26037a62ccf6adc9c29f79d"]
    }
```

```diff
    contract rsETH Vault Lyra (0x35d4D9bc79B0a543934b1769304B90d752691caD) {
    +++ description: None
      sourceHashes:
+        ["0x5a961d4cd1fe9b96535b53aaf638b45677b06e22d26037a62ccf6adc9c29f79d"]
    }
```

```diff
    contract WBTC Vault Lyra (0x3Eec7c855aF33280F1eD38b93059F5aa5862E3ab) {
    +++ description: None
      sourceHashes:
+        ["0xfd7de25c0b5615fb9cdd221236caa984819b6dd0511764ecfc6d0c724721741c"]
    }
```

```diff
    contract sUSDe Vault Kinto (0x43b718Aa5e678b08615CA984cbe25f690B085b32) {
    +++ description: None
      sourceHashes:
+        ["0x5a961d4cd1fe9b96535b53aaf638b45677b06e22d26037a62ccf6adc9c29f79d"]
    }
```

```diff
    contract rswETH Vault Lyra (0x4BB4C3CDc7562f08e9910A0C7D8bB7e108861eB4) {
    +++ description: None
      sourceHashes:
+        ["0x5a961d4cd1fe9b96535b53aaf638b45677b06e22d26037a62ccf6adc9c29f79d"]
    }
```

```diff
    contract sDAI Vault Kinto (0x5B8Ae1C9c5970e2637Cf3Af431acAAebEf7aFb85) {
    +++ description: None
      sourceHashes:
+        ["0x5a961d4cd1fe9b96535b53aaf638b45677b06e22d26037a62ccf6adc9c29f79d"]
    }
```

```diff
    contract Hasher (0x5C71beE4a6b0D617D8c3d107D331292741789E27) {
    +++ description: None
      sourceHashes:
+        ["0x621783ceb3c37cf9cd41112e917d760d40dbfa18e43c59f5c925fe9f7037f9be"]
    }
```

```diff
    contract USDT Vault Lyra (0x5e98A25d8d6FF69A8992d6Aa57948dFB77D4ECBa) {
    +++ description: None
      sourceHashes:
+        ["0xfd7de25c0b5615fb9cdd221236caa984819b6dd0511764ecfc6d0c724721741c"]
    }
```

```diff
    contract sDAI Vault Lyra (0x613e87BE1cd75dEBC5e6e56a2AF2fED84162C142) {
    +++ description: None
      sourceHashes:
+        ["0x31b99c44ab28174db25b94c3cca9ad4f335866894a5437384040c7bd682fca11"]
    }
```

```diff
    contract sDAI Vault Polynomial (0x615172e47c0C5A6dA8ea959632Ac0166f7a59eDc) {
    +++ description: None
      sourceHashes:
+        ["0x6a891f3b93e83143ab3b768e2a7a5e2fee324b1f98745e241faaf97608eaa3ae"]
    }
```

```diff
    contract WETH Vault Reya (0x64dF894688c5052BeAdC35371cF69151Ebc5D658) {
    +++ description: None
      sourceHashes:
+        ["0x5a961d4cd1fe9b96535b53aaf638b45677b06e22d26037a62ccf6adc9c29f79d"]
    }
```

```diff
    contract USDC Vault Lyra (0x6D303CEE7959f814042D31E0624fB88Ec6fbcC1d) {
    +++ description: None
      sourceHashes:
+        ["0x7388ebff48e70528bc58f3586fb97581b1a933f704450fa7ed625674671cfef2"]
    }
```

```diff
    contract USDC Vault Kinto (0x755cD5d147036E11c76F1EeffDd94794fC265f0d) {
    +++ description: None
      sourceHashes:
+        ["0x5a961d4cd1fe9b96535b53aaf638b45677b06e22d26037a62ccf6adc9c29f79d"]
    }
```

```diff
    contract LBTC Vault Lyra (0x76624ff43D610F64177Bb9c194A2503642e9B803) {
    +++ description: None
      sourceHashes:
+        ["0x31b99c44ab28174db25b94c3cca9ad4f335866894a5437384040c7bd682fca11"]
    }
```

```diff
    contract SNX Vault Lyra (0x7D7aC8d55A9bD4152b703011f3E61AB3bB0A5592) {
    +++ description: None
      sourceHashes:
+        ["0xfd7de25c0b5615fb9cdd221236caa984819b6dd0511764ecfc6d0c724721741c"]
    }
```

```diff
    contract DAI Vault Lyra (0x7E1d17b580dD4F89037DB331430eAEe8B8e50c91) {
    +++ description: None
      sourceHashes:
+        ["0x31b99c44ab28174db25b94c3cca9ad4f335866894a5437384040c7bd682fca11"]
    }
```

```diff
    contract weETH Vault Lyra (0x8180EcCC825b692ef65FF099a0A387743788bf78) {
    +++ description: None
      sourceHashes:
+        ["0x5a961d4cd1fe9b96535b53aaf638b45677b06e22d26037a62ccf6adc9c29f79d"]
    }
```

```diff
    contract Socket (0x943AC2775928318653e91d350574436A1b9b16f9) {
    +++ description: None
      sourceHashes:
+        ["0x0a472e41e2b0da865c051222fc77f1a0e9a6f6462383cbf9a6e4da8b9b332167"]
    }
```

```diff
    contract ETHFI Vault Kinto (0x95d60E34aB2E626407d98dF8C240e6174e5D37E5) {
    +++ description: None
      sourceHashes:
+        ["0x5a961d4cd1fe9b96535b53aaf638b45677b06e22d26037a62ccf6adc9c29f79d"]
    }
```

```diff
    contract ExecutionManager (0x98CAd9A205f1F7A7150241Ef2d565d1702BCe57C) {
    +++ description: None
      sourceHashes:
+        ["0x4090ed28f96c48d603c9a606a131adf14f1ac4c81c478cde49b5b62ea4310ac3"]
    }
```

```diff
    contract SOL Vault Kinto (0xA2bc0DaA9BF98820632bCa0663a9616f6bC180f8) {
    +++ description: None
      sourceHashes:
+        ["0x5a961d4cd1fe9b96535b53aaf638b45677b06e22d26037a62ccf6adc9c29f79d"]
    }
```

```diff
    contract LOOKS Vault Blast (0xa83B4006c16DAeAb2718294696c0122519195137) {
    +++ description: None
      sourceHashes:
+        ["0x5a961d4cd1fe9b96535b53aaf638b45677b06e22d26037a62ccf6adc9c29f79d"]
    }
```

```diff
    contract USDe Vault Reya (0xaA2f2B6cD33Eaabb795c6DB60AAec599C8450F35) {
    +++ description: None
      sourceHashes:
+        ["0x1ca1782228ebefdeb92c0a3be06dac3dca400826838bb68b5500e8b8f3fac727"]
    }
```

```diff
    contract wstETH Vault Kinto (0xc5d01939Af7Ce9Ffc505F0bb36eFeDde7920f2dc) {
    +++ description: None
      sourceHashes:
+        ["0x5a961d4cd1fe9b96535b53aaf638b45677b06e22d26037a62ccf6adc9c29f79d"]
    }
```

```diff
    contract sUSDe Vault Polynomial (0xC6cfb996A7CFEB89813A68CD13942CD75553032b) {
    +++ description: None
      sourceHashes:
+        ["0x6a891f3b93e83143ab3b768e2a7a5e2fee324b1f98745e241faaf97608eaa3ae"]
    }
```

```diff
    contract LooksRareMultisig (0xC8C57e4C73c71f72cA0a7e043E5D2D144F98ef13) {
    +++ description: None
      sourceHashes:
+        ["0x81a7349eebb98ac33b0bc6842e3cb258034a8f2a4ba004570bb8e2e25947f9ff","0xd42bbf9f7dcd3720a7fc6bdc6edfdfae8800a37d6dd4decfa0ef6ca4a2e88940"]
    }
```

```diff
    contract XAUt Vault Kinto (0xd04Bc056BE36a6127267E4F71d3b43D1BEEfE8bF) {
    +++ description: None
      sourceHashes:
+        ["0x5a961d4cd1fe9b96535b53aaf638b45677b06e22d26037a62ccf6adc9c29f79d"]
    }
```

```diff
    contract WETH Vault Lyra (0xD4efe33C66B8CdE33B8896a2126E41e5dB571b7e) {
    +++ description: None
      sourceHashes:
+        ["0xfd7de25c0b5615fb9cdd221236caa984819b6dd0511764ecfc6d0c724721741c"]
    }
```

```diff
    contract FastSwitchboard (0xD5a83a40F262E2247e6566171f9ADc76b745F5cD) {
    +++ description: None
      sourceHashes:
+        ["0x4c26d29d2554c606bb1c2391ea7b837be27ba2f6cc80d7a022bbd672f534fba4"]
    }
```

```diff
    contract eUSD Vault Kinto (0xDB0e855F55ff35dA8754e5297925bd6c4Cb1Fa48) {
    +++ description: None
      sourceHashes:
+        ["0x5a961d4cd1fe9b96535b53aaf638b45677b06e22d26037a62ccf6adc9c29f79d"]
    }
```

```diff
    contract EIGEN Vault Kinto (0xdb161cdc9c11892922F7121a409b196f3b00e640) {
    +++ description: None
      sourceHashes:
+        ["0x5a961d4cd1fe9b96535b53aaf638b45677b06e22d26037a62ccf6adc9c29f79d"]
    }
```

```diff
    contract USDC Vault Polynomial (0xDE1617Ddb7C8A250A409D986930001985cfad76F) {
    +++ description: None
      sourceHashes:
+        ["0x6a891f3b93e83143ab3b768e2a7a5e2fee324b1f98745e241faaf97608eaa3ae"]
    }
```

```diff
    contract USDe Vault Kinto (0xdf34E61B6e7B9e348713d528fEB019d504d38c1e) {
    +++ description: None
      sourceHashes:
+        ["0x5a961d4cd1fe9b96535b53aaf638b45677b06e22d26037a62ccf6adc9c29f79d"]
    }
```

```diff
    contract ArbitrumL1Switchboard (0xdf5f7dfDFc26ee5F629949e330bEf56906319CAe) {
    +++ description: None
      sourceHashes:
+        ["0xdacec605e22dae6e18ca1d184d8aec5d3307537166fbd48449491dc2227c6497"]
    }
```

```diff
    contract USDC Vault Reya (0xdFf78A949E47c1e90f3Dd6dd7Fe2Fa72B42a75f7) {
    +++ description: None
      sourceHashes:
+        ["0x5a961d4cd1fe9b96535b53aaf638b45677b06e22d26037a62ccf6adc9c29f79d"]
    }
```

```diff
    contract sUSDe Vault Lyra (0xE3E96892D30E0ee1a8131BAf87c891201F7137bf) {
    +++ description: None
      sourceHashes:
+        ["0x5a961d4cd1fe9b96535b53aaf638b45677b06e22d26037a62ccf6adc9c29f79d"]
    }
```

```diff
    contract weETH Vault Kinto (0xeB66259d2eBC3ed1d3a98148f6298927d8A36397) {
    +++ description: None
      sourceHashes:
+        ["0x5a961d4cd1fe9b96535b53aaf638b45677b06e22d26037a62ccf6adc9c29f79d"]
    }
```

```diff
    contract wstETH Vault Lyra (0xeBB5D642aA8ccDeE98373D6aC3ee0602b63824b3) {
    +++ description: None
      sourceHashes:
+        ["0xfd7de25c0b5615fb9cdd221236caa984819b6dd0511764ecfc6d0c724721741c"]
    }
```

```diff
    contract TransmitManager (0xeD037aFBffC65a94E9CC592947E851FB2f730341) {
    +++ description: None
      sourceHashes:
+        ["0x20fd759cdae5666df50f4b5723ba03796b69ef7b2b3ec33712cb158d77b97133"]
    }
```

```diff
    contract KintoMultisig (0xf152Abda9E4ce8b134eF22Dc3C6aCe19C4895D82) {
    +++ description: None
      sourceHashes:
+        ["0x81a7349eebb98ac33b0bc6842e3cb258034a8f2a4ba004570bb8e2e25947f9ff","0xd42bbf9f7dcd3720a7fc6bdc6edfdfae8800a37d6dd4decfa0ef6ca4a2e88940"]
    }
```

```diff
    contract SignatureVerifier (0xf1ABF110d1B6ff0E2e8C05dd64FBF9eBA4d8af98) {
    +++ description: None
      sourceHashes:
+        ["0x92dc8defa29353a843ae6cb6d7508811be7c65f617fe92ef87739ccdbc3fa95b"]
    }
```

Generated with discovered.json: 0x7e793b8eb1972aef96146082a4be74d43b7eb250

# Diff at Mon, 07 Oct 2024 09:49:08 GMT:

- author: sekuba (<sekuba@users.noreply.github.com>)
- comparing to: main@ec3878239ad71f9055b207bdcd338b2f207af050 block: 20842973
- current block number: 20912886

## Description

New plugs and vaults.

## Watched changes

```diff
    contract Socket (0x943AC2775928318653e91d350574436A1b9b16f9) {
    +++ description: None
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.102:
+        "0x76ddfc271089e58Af68D8597D41aEF52Fb53EC3D"
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.101:
+        "0x88A05556Af1a8a5BB5964c46Be9D56C379a5E155"
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.100:
+        "0x895b6c1413243562128a9281a7f8891640Ca073f"
    }
```

```diff
+   Status: CREATED
    contract eUSD Vault Kinto (0xDB0e855F55ff35dA8754e5297925bd6c4Cb1Fa48)
    +++ description: None
```

## Source code changes

```diff
.../socket/ethereum/.flat/eUSD Vault Kinto.sol     | 887 +++++++++++++++++++++
 1 file changed, 887 insertions(+)
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20842973 (main branch discovery), not current.

```diff
-   Status: DELETED
    contract USDC Vault Hook (0x855Aaf2f690Ef6e5EF451D7AE73EC3fa61c50981)
    +++ description: None
```

```diff
-   Status: DELETED
    contract WETH Vault Hook (0xB39DF6BBB1Cf2B609DeE43F109caFEFF1A7CCBEa)
    +++ description: None
```

```diff
+   Status: CREATED
    contract MKR Vault Kinto (0x0fC783f611A888A2cAbC3dA482Add3215334dCc2)
    +++ description: None
```

```diff
+   Status: CREATED
    contract eBTC Vault Lyra (0x25d35C8796c9dcD3857abE90D802FC17b1FB55A5)
    +++ description: None
```

```diff
+   Status: CREATED
    contract EIGEN Vault Kinto (0xdb161cdc9c11892922F7121a409b196f3b00e640)
    +++ description: None
```

Generated with discovered.json: 0x9b4f75a1a9988e34fa54d9b52bd97b60b289328c

# Diff at Fri, 27 Sep 2024 15:52:26 GMT:

- author: sekuba (<sekuba@users.noreply.github.com>)
- comparing to: main@4cb14cc1bdc343d171a7988f9f91f11edbf568a8 block: 20756881
- current block number: 20842973

## Description

Add new plugs / vaults.

## Watched changes

```diff
    contract Socket (0x943AC2775928318653e91d350574436A1b9b16f9) {
    +++ description: None
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.99:
+        "0x094570E556C8E58119E21f47759F02F50Ae3bB49"
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.98:
+        "0xBc978f47AD1122bdFE85855fcc40b3afdF4b5df3"
    }
```

Generated with discovered.json: 0x4c060329e6eb5170679402c0a4d7d995c0a7fed8

# Diff at Sun, 15 Sep 2024 15:22:34 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@ca08843b12ed576cbcc139ad58ca045f72d96ab5 block: 20726203
- current block number: 20756881

## Description

Socket adds plugs and vaults.

Kinto moves three vaults from EOA to the BridgerOwnerMS. One signer is removed from the KintoMultisig.

## Watched changes

```diff
    contract PAXG Vault Kinto (0x25f0D71Da51A77Ca231484eBbAD1f588A0230ef2) {
    +++ description: None
      values.owner:
-        "0x660ad4B5A74130a4796B4d54BC6750Ae93C86e6c"
+        "0xf152Abda9E4ce8b134eF22Dc3C6aCe19C4895D82"
    }
```

```diff
    contract KINTO Vault Kinto (0x2f87464d5F5356dB350dcb302FE28040986783a7) {
    +++ description: None
      values.owner:
-        "0x660ad4B5A74130a4796B4d54BC6750Ae93C86e6c"
+        "0xf152Abda9E4ce8b134eF22Dc3C6aCe19C4895D82"
    }
```

```diff
    contract Socket (0x943AC2775928318653e91d350574436A1b9b16f9) {
    +++ description: None
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.97:
+        "0x17a8Be056ca13B072AB908126D4BC38e09c7cc39"
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.96:
+        "0xc706c946623C70B294b91Bd4961E91FaF7A74317"
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.95:
+        "0x55033cb4583f5526704Ee4C197e99504E504712c"
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.94:
+        "0xF391E487FE3958F0728436Af84455Fd4eBC9c7c9"
    }
```

```diff
    contract SOL Vault Kinto (0xA2bc0DaA9BF98820632bCa0663a9616f6bC180f8) {
    +++ description: None
      values.owner:
-        "0x660ad4B5A74130a4796B4d54BC6750Ae93C86e6c"
+        "0xf152Abda9E4ce8b134eF22Dc3C6aCe19C4895D82"
    }
```

```diff
    contract XAUt Vault Kinto (0xd04Bc056BE36a6127267E4F71d3b43D1BEEfE8bF) {
    +++ description: None
      values.owner:
-        "0x660ad4B5A74130a4796B4d54BC6750Ae93C86e6c"
+        "0xf152Abda9E4ce8b134eF22Dc3C6aCe19C4895D82"
    }
```

```diff
    contract KintoMultisig (0xf152Abda9E4ce8b134eF22Dc3C6aCe19C4895D82) {
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

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20726203 (main branch discovery), not current.

```diff
+   Status: CREATED
    contract LBTC Vault Lyra (0x76624ff43D610F64177Bb9c194A2503642e9B803)
    +++ description: None
```

```diff
+   Status: CREATED
    contract SOL Vault Kinto (0xA2bc0DaA9BF98820632bCa0663a9616f6bC180f8)
    +++ description: None
```

Generated with discovered.json: 0xe5c9598b6d1b921c349d1bcf2b34d2e22763ad96

# Diff at Wed, 11 Sep 2024 08:33:42 GMT:

- author: sekuba (<sekuba@users.noreply.github.com>)
- comparing to: main@407590ebfbad0b4f799badc3ad5fce90a7eaed11 block: 20661696
- current block number: 20726203

## Description

Socket adds a plug and vault for wormhole-wrapped sol. yea...

## Watched changes

```diff
    contract Socket (0x943AC2775928318653e91d350574436A1b9b16f9) {
    +++ description: None
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.93:
+        "0xd48A35a853858e344aFCbEcCDBf8FCbFaF8e1501"
    }
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20661696 (main branch discovery), not current.

```diff
+   Status: CREATED
    contract USDT Vault Lyra (0x5e98A25d8d6FF69A8992d6Aa57948dFB77D4ECBa)
    +++ description: None
```

```diff
+   Status: CREATED
    contract sUSDe Vault Reya (0x5F3B301B4967623fDb3AE52Bb8FF4dB01C460Cd3)
    +++ description: None
```

Generated with discovered.json: 0x7219e90f18bcdf7199774fcff76519a5d21f2bc0

# Diff at Mon, 02 Sep 2024 08:29:43 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@8fcb30f6c613b5454aa9ecdec05a118442e9dc7b block: 20626116
- current block number: 20661696

## Description

Three new Lyra tokens (not yet used): LBTC, LBTCCS, LBTCPS

## Watched changes

```diff
    contract Socket (0x943AC2775928318653e91d350574436A1b9b16f9) {
    +++ description: None
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.92:
+        "0xdb1c2F432e51824b33b9269C4b1Ff6190c1e5F35"
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.91:
+        "0x2D733e70A377FcFc249d273095250762A93F3820"
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.90:
+        "0x457379de638CAFeB1759a22457fe893b288E2e89"
    }
```

Generated with discovered.json: 0x9dedacc8326208f39ddd0d92173dfa503d7f5bd0

# Diff at Wed, 28 Aug 2024 09:14:01 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@e994ce3db09d104c0549bcc88bb0de2f5d3b999e block: 20577569
- current block number: 20626116

## Description

New plugs and vaults on ethereum. (added to socket.ts, see list of new vaults in added contracts below)

## Watched changes

```diff
    contract Socket (0x943AC2775928318653e91d350574436A1b9b16f9) {
    +++ description: None
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.89:
+        "0xe38Dccb8Bd138c326E3Df926ADD9dE71a442837F"
    }
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20577569 (main branch discovery), not current.

```diff
+   Status: CREATED
    contract USDe Vault Lyra (0x26Cf1Dc84694E04277F2Fe4C13E43597c6010C2A)
    +++ description: None
```

```diff
+   Status: CREATED
    contract sDAI Vault Lyra (0x613e87BE1cd75dEBC5e6e56a2AF2fED84162C142)
    +++ description: None
```

```diff
+   Status: CREATED
    contract WETH Vault Reya (0x64dF894688c5052BeAdC35371cF69151Ebc5D658)
    +++ description: None
```

```diff
+   Status: CREATED
    contract DAI Vault Lyra (0x7E1d17b580dD4F89037DB331430eAEe8B8e50c91)
    +++ description: None
```

Generated with discovered.json: 0xdd2c762dc5afedea76043bf6696c0f669b419d60

# Diff at Wed, 21 Aug 2024 14:23:46 GMT:

- author: Radina Talanova (<nt.radina@gmail.com>)
- comparing to: main@9ff9ee2b2fd37e2cdd4a4bcebdcefcb5e61b1e6c block: 20490738
- current block number: 20577569

## Description

New plugs, one new USDe vault found for Reya and added.

## Watched changes

```diff
    contract Socket (0x943AC2775928318653e91d350574436A1b9b16f9) {
    +++ description: None
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.88:
+        "0xA07EB173d58F7aF2b0267F2B5f6a091E01c17f85"
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.87:
+        "0x56705F7F12D4e0433e26a20298fCd3532226d744"
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.86:
+        "0x42F23C6d344d0322e13f254B9a8E187335AFB409"
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.85:
+        "0x3F0dAfEB6386c710617180b376c118D7EcD6aC89"
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.84:
+        "0x1b882b9E87ABd7DD9B9b689Bee10Ed6a040033D0"
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.83:
+        "0x49d446506D0f2db507AB4804563be9331BBc80E7"
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.82:
+        "0xaDA48ab8705Eb3904e5FA65D5622cd237a2341FF"
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.81:
+        "0x00CE54B988D8C44bFCae4026C17c37c69C490A12"
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.80:
+        "0x7Eee3241eC98ED0B47c8Bc0e9E3327B541BCDc1D"
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.79:
+        "0x50D46c3BB529276aDe59a6678C14302D6B61C853"
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.78:
+        "0x37C24e7081eb7f2B16bde81b556d082c0839F754"
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.77:
+        "0x254691C06Da387c1050C726cF498eFdA89083820"
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.76:
+        "0x083Add2A9afa97Efb6412b293145ce965eCE3600"
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.75:
+        "0xa1D11b141bb47eDb2c69B8ced4EFe80f62D1C276"
    }
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20490738 (main branch discovery), not current.

```diff
+   Status: CREATED
    contract USDe Vault Reya (0xaA2f2B6cD33Eaabb795c6DB60AAec599C8450F35)
    +++ description: None
```

Generated with discovered.json: 0xf576c14ed1fb7a13f001a95c7bc07a11394f3b41

# Diff at Fri, 09 Aug 2024 11:27:23 GMT:

- author: Radina Talanova (<nt.radina@gmail.com>)
- comparing to: main@1ad87b4413497d14d292060f85413a135fcedee2 block: 20454363
- current block number: 20490738

## Description

New plugs, but vaults have 0 TVL. New vault for XAUt on Kinto was added.

## Watched changes

```diff
    contract Socket (0x943AC2775928318653e91d350574436A1b9b16f9) {
    +++ description: None
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.74:
+        "0x4E83292d5cacf05B85bED2c3D4a6056F42EE1738"
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.73:
+        "0x1aE19B11B71b1e232c43Fe65cB1d31E139Ac7A63"
    }
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20454363 (main branch discovery), not current.

```diff
+   Status: CREATED
    contract XAUt Vault Kinto (0xd04Bc056BE36a6127267E4F71d3b43D1BEEfE8bF)
    +++ description: None
```

Generated with discovered.json: 0x994e93822562c2da4125730819c4ef211ae3fad7

# Diff at Fri, 09 Aug 2024 10:12:19 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@1f0da1d0aab7bc6b3b5e54e7e93480bd98e57035 block: 20454363
- current block number: 20454363

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20454363 (main branch discovery), not current.

```diff
    contract LyraMultisig (0x246d38588b16Dd877c558b245e6D5a711C649fCF) {
    +++ description: None
      values.$multisigThreshold:
-        "2 of 3 (67%)"
      values.getOwners:
-        ["0xb88D64a7E2ec1b137c969Adf2EC65f933d631F65","0x76E6F5C2A64df0F53077602642B79a45D5Ba6D52","0x4cEa25e9c999E69F45765539783D149024f99F12"]
      values.getThreshold:
-        2
      values.$members:
+        ["0xb88D64a7E2ec1b137c969Adf2EC65f933d631F65","0x76E6F5C2A64df0F53077602642B79a45D5Ba6D52","0x4cEa25e9c999E69F45765539783D149024f99F12"]
      values.$threshold:
+        2
      values.multisigThreshold:
+        "2 of 3 (67%)"
    }
```

```diff
    contract LooksRareMultisig (0xC8C57e4C73c71f72cA0a7e043E5D2D144F98ef13) {
    +++ description: None
      values.$multisigThreshold:
-        "3 of 5 (60%)"
      values.getOwners:
-        ["0xDA9854b190A54c6c5088AB43a274caFAFF7cF369","0x45d7A9bFC82Ca6AE410E4410f44c57a2b9F8Ec58","0xb69F2341F008f673F757B49104c165C8022CD0df","0x5ECfd6968593159e5b4f06832857943409122849","0x9eab2223d84060E212354BfA620BF687b6E9Ae20"]
      values.getThreshold:
-        3
      values.$members:
+        ["0xDA9854b190A54c6c5088AB43a274caFAFF7cF369","0x45d7A9bFC82Ca6AE410E4410f44c57a2b9F8Ec58","0xb69F2341F008f673F757B49104c165C8022CD0df","0x5ECfd6968593159e5b4f06832857943409122849","0x9eab2223d84060E212354BfA620BF687b6E9Ae20"]
      values.$threshold:
+        3
      values.multisigThreshold:
+        "3 of 5 (60%)"
    }
```

```diff
    contract KintoMultisig (0xf152Abda9E4ce8b134eF22Dc3C6aCe19C4895D82) {
    +++ description: None
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

Generated with discovered.json: 0x8f5d8415ab31f273cd4bff9f106712375d2d7645

# Diff at Sun, 04 Aug 2024 09:42:44 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@14945a4ebc63b3db3867f33067f31f159fedd9a9 block: 20367941
- current block number: 20454363

## Description

Provide description of changes. This section will be preserved.

## Watched changes

```diff
    contract Socket (0x943AC2775928318653e91d350574436A1b9b16f9) {
    +++ description: None
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.72:
+        "0xcb473D87A56b4609A695753711F727E5c4335cCf"
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.71:
+        "0x91CE463148bD7695d4db41f4aA36088E502428F7"
    }
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20367941 (main branch discovery), not current.

```diff
    contract ExecutionManager (0x98CAd9A205f1F7A7150241Ef2d565d1702BCe57C) {
    +++ description: None
      unverified:
-        true
      values.chainSlug:
+        1
      values.nominee:
+        "0x0000000000000000000000000000000000000000"
      values.owner:
+        "0xB0BBff6311B7F245761A7846d3Ce7B1b100C1836"
      values.signatureVerifier__:
+        "0xf1ABF110d1B6ff0E2e8C05dd64FBF9eBA4d8af98"
      values.socket__:
+        "0x943AC2775928318653e91d350574436A1b9b16f9"
    }
```

```diff
+   Status: CREATED
    contract PAXG Vault Kinto (0x25f0D71Da51A77Ca231484eBbAD1f588A0230ef2)
    +++ description: None
```

```diff
+   Status: CREATED
    contract KINTO Vault Kinto (0x2f87464d5F5356dB350dcb302FE28040986783a7)
    +++ description: None
```

```diff
+   Status: CREATED
    contract sDAI Vault Polynomial (0x615172e47c0C5A6dA8ea959632Ac0166f7a59eDc)
    +++ description: None
```

```diff
+   Status: CREATED
    contract sUSDe Vault Polynomial (0xC6cfb996A7CFEB89813A68CD13942CD75553032b)
    +++ description: None
```

```diff
+   Status: CREATED
    contract USDC Vault Polynomial (0xDE1617Ddb7C8A250A409D986930001985cfad76F)
    +++ description: None
```

Generated with discovered.json: 0x5a0294e708ba021053396e9744016dc2fb847ec7

# Diff at Tue, 30 Jul 2024 11:14:38 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@b2b6471ff62871f4956541f42ec025c356c08f7e block: 20367941
- current block number: 20367941

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20367941 (main branch discovery), not current.

```diff
    contract PolygonL1Switchboard (0x053407DFA30267f6332f3c94a9e9F704A55e62CD) {
    +++ description: None
      fieldMeta:
+        {"switchboardFees":{"severity":"LOW","description":"Fee charged by the switchboard for processing a transaction"},"verificationOverheadFees":{"severity":"LOW","description":"Fee charged for verifying transaction"}}
    }
```

```diff
    contract OptimismSwitchboard2 (0x0E674e057EC0FF97eeA57B6A350DBAAD22FE41BA) {
    +++ description: None
      fieldMeta:
+        {"switchboardFees":{"severity":"LOW","description":"Fee charged by the switchboard for processing a transaction"},"verificationOverheadFees":{"severity":"LOW","description":"Fee charged for verifying transaction"}}
    }
```

```diff
    contract OptimismSwitchboard (0x139f39DC7dC05F7aC2DB3DB6af4f2e1a9De7c287) {
    +++ description: None
      fieldMeta:
+        {"switchboardFees":{"severity":"LOW","description":"Fee charged by the switchboard for processing a transaction"},"verificationOverheadFees":{"severity":"LOW","description":"Fee charged for verifying transaction"}}
    }
```

```diff
    contract Socket (0x943AC2775928318653e91d350574436A1b9b16f9) {
    +++ description: None
      fieldMeta:
+        {"executionManager__":{"description":"Manages crosschain execution and -fees."},"plugs":{"severity":"LOW","description":"ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain."}}
    }
```

```diff
    contract ArbitrumL1Switchboard (0xdf5f7dfDFc26ee5F629949e330bEf56906319CAe) {
    +++ description: None
      fieldMeta:
+        {"switchboardFees":{"severity":"LOW","description":"Fee charged by the switchboard for processing a transaction"},"verificationOverheadFees":{"severity":"LOW","description":"Fee charged for verifying transaction"}}
    }
```

Generated with discovered.json: 0x204b6b2c286321984245ecd7b47aa438ff7a60e3

# Diff at Tue, 23 Jul 2024 08:10:01 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@a7fe674fdf7aafe1f69f1463836cac0d7e337d34 block: 20340184
- current block number: 20367941

## Description

New (unverified) plug, and executionManager is pointed to a new (unverified) contract. The old executionManager was used for crosschain execution and -fees.

## Watched changes

```diff
    contract Socket (0x943AC2775928318653e91d350574436A1b9b16f9) {
    +++ description: None
+++ description: Manages crosschain execution and -fees.
      values.executionManager__:
-        "0xFB4dcD94A051a1D2cF3EaF713a2Ef686653884E0"
+        "0x98CAd9A205f1F7A7150241Ef2d565d1702BCe57C"
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ type: CODE_CHANGE
+++ severity: LOW
      values.plugs.70:
+        "0x83D8e248cAb7c6074dCc07EA25892F8022244c50"
    }
```

```diff
-   Status: DELETED
    contract ExecutionManager (0xFB4dcD94A051a1D2cF3EaF713a2Ef686653884E0)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ExecutionManager (0x98CAd9A205f1F7A7150241Ef2d565d1702BCe57C)
    +++ description: None
```

## Source code changes

```diff
.../ExecutionManager.sol => /dev/null              | 1289 --------------------
 1 file changed, 1289 deletions(-)
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20340184 (main branch discovery), not current.

```diff
    contract TransmitManager (0xeD037aFBffC65a94E9CC592947E851FB2f730341) {
    +++ description: None
      values.accessControl:
+        {"DEFAULT_ADMIN_ROLE":{"adminRole":"DEFAULT_ADMIN_ROLE","members":[]}}
    }
```

Generated with discovered.json: 0x0e8508e83cd4c4229d0609413a4b05430f644a65

# Diff at Fri, 19 Jul 2024 11:10:17 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@744d4e1fec0be9972ab7fde1dd4cc0ba0c91a28c block: 20332210
- current block number: 20340184

## Description

New plug, no new vaults.

## Watched changes

```diff
    contract Socket (0x943AC2775928318653e91d350574436A1b9b16f9) {
    +++ description: None
+++ description: ConnectorPlugs connect vaults (esrows) or controllers via the socket main contract to the switchboards. They have counerparts on the sibling chain.
+++ type: CODE_CHANGE
+++ severity: LOW
      values.plugs.69:
+        "0xEd0952283fdA768aA9d69eB7e895d49afcC3c0fe"
    }
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20332210 (main branch discovery), not current.

```diff
    contract rsETH Vault Lyra (0x35d4D9bc79B0a543934b1769304B90d752691caD) {
    +++ description: None
      unverified:
-        true
      values.bridgeType:
+        "0x9faa379a8f7762447354a00c30bda6b12f39577783c03b588d3fd75b4e2a5876"
      values.nominee:
+        "0x0000000000000000000000000000000000000000"
      values.owner:
+        "0x246d38588b16Dd877c558b245e6D5a711C649fCF"
    }
```

Generated with discovered.json: 0xcc11fb16443328f87fc9461c33c6a81fd8d17ed9

# Diff at Thu, 18 Jul 2024 08:28:17 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@14a8b2e13da16d68d776511f98207e5360accba3 block: 20211873
- current block number: 20332210

## Description

New plugs are added. Some new vaults were discovered and are added to the socket.ts. (Lyra and Kinto projects already have these escrows)

## Watched changes

```diff
    contract Socket (0x943AC2775928318653e91d350574436A1b9b16f9) {
    +++ description: None
+++ description: ConnectorPlugs connect vaults (esrows) or controllers via the socket main contract to the switchboards. They have counerparts on the sibling chain.
+++ type: CODE_CHANGE
+++ severity: LOW
      values.plugs.68:
+        "0xcf2B4958e72Db99FDF844cD3992Daa2a8B7319c5"
+++ description: ConnectorPlugs connect vaults (esrows) or controllers via the socket main contract to the switchboards. They have counerparts on the sibling chain.
+++ type: CODE_CHANGE
+++ severity: LOW
      values.plugs.67:
+        "0x4a43eD818411585fEAaf667a2D3E2605962084e0"
+++ description: ConnectorPlugs connect vaults (esrows) or controllers via the socket main contract to the switchboards. They have counerparts on the sibling chain.
+++ type: CODE_CHANGE
+++ severity: LOW
      values.plugs.66:
+        "0x6B3614474eE19FA9A2d6D2079a2D73c04E567310"
+++ description: ConnectorPlugs connect vaults (esrows) or controllers via the socket main contract to the switchboards. They have counerparts on the sibling chain.
+++ type: CODE_CHANGE
+++ severity: LOW
      values.plugs.65:
+        "0x54bd887d31A5119Bbc91426eD6289b8ACD2b7349"
+++ description: ConnectorPlugs connect vaults (esrows) or controllers via the socket main contract to the switchboards. They have counerparts on the sibling chain.
+++ type: CODE_CHANGE
+++ severity: LOW
      values.plugs.64:
+        "0xBF3233Ef07B9552578987e2A2d25F760fBf192e5"
    }
```

```diff
    contract sUSDe Vault Lyra (0xE3E96892D30E0ee1a8131BAf87c891201F7137bf) {
    +++ description: None
      values.owner:
-        "0xA82994cc5e9D94FED2916f762e03245FcBE79f23"
+        "0x246d38588b16Dd877c558b245e6D5a711C649fCF"
    }
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20211873 (main branch discovery), not current.

```diff
    contract rsETH Vault Lyra (0x35d4D9bc79B0a543934b1769304B90d752691caD) {
    +++ description: None
      values.bridgeType:
-        "0x9faa379a8f7762447354a00c30bda6b12f39577783c03b588d3fd75b4e2a5876"
      values.nominee:
-        "0x0000000000000000000000000000000000000000"
      values.owner:
-        "0x246d38588b16Dd877c558b245e6D5a711C649fCF"
      unverified:
+        true
    }
```

```diff
+   Status: CREATED
    contract USDC Vault Kinto (0x755cD5d147036E11c76F1EeffDd94794fC265f0d)
    +++ description: None
```

```diff
+   Status: CREATED
    contract sUSDe Vault Lyra (0xE3E96892D30E0ee1a8131BAf87c891201F7137bf)
    +++ description: None
```

Generated with discovered.json: 0x77e73d2314cf2a0a4b7229471195a61da7d0de3c

# Diff at Mon, 01 Jul 2024 13:10:28 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@fb78e4d497d7b23ec78438cad86db49fa84dcdd6 block: 20175047
- current block number: 20211873

## Description

New plugs for an sUSDeBULL token with various chain destinations. Not yet used and not on coingecko, so no escrow changes for the socket bridge.

## Watched changes

```diff
    contract Socket (0x943AC2775928318653e91d350574436A1b9b16f9) {
    +++ description: None
+++ description: ConnectorPlugs connect vaults (esrows) or controllers via the socket main contract to the switchboards. They have counerparts on the sibling chain.
+++ type: CODE_CHANGE
+++ severity: LOW
      values.plugs.63:
+        "0x3F574bc32a0bE9514010409FE8CF19e56fd7C83a"
+++ description: ConnectorPlugs connect vaults (esrows) or controllers via the socket main contract to the switchboards. They have counerparts on the sibling chain.
+++ type: CODE_CHANGE
+++ severity: LOW
      values.plugs.62:
+        "0xAda55E4762c3663f90D55Dc6ACC073B012D1e6eA"
+++ description: ConnectorPlugs connect vaults (esrows) or controllers via the socket main contract to the switchboards. They have counerparts on the sibling chain.
+++ type: CODE_CHANGE
+++ severity: LOW
      values.plugs.61:
+        "0x9D0487D8d93Fc08938A39e355c676A8b032Dc52a"
+++ description: ConnectorPlugs connect vaults (esrows) or controllers via the socket main contract to the switchboards. They have counerparts on the sibling chain.
+++ type: CODE_CHANGE
+++ severity: LOW
      values.plugs.60:
+        "0x1A9ba93F3cb22Ba7228D29607075F444e9ff515c"
+++ description: ConnectorPlugs connect vaults (esrows) or controllers via the socket main contract to the switchboards. They have counerparts on the sibling chain.
+++ type: CODE_CHANGE
+++ severity: LOW
      values.plugs.59:
+        "0x12fBD04CB103c596B78110C70eEDF16821CBfcAE"
+++ description: ConnectorPlugs connect vaults (esrows) or controllers via the socket main contract to the switchboards. They have counerparts on the sibling chain.
+++ type: CODE_CHANGE
+++ severity: LOW
      values.plugs.58:
+        "0x1967F0F374Eed3c0152d9CF0541F814206964041"
+++ description: ConnectorPlugs connect vaults (esrows) or controllers via the socket main contract to the switchboards. They have counerparts on the sibling chain.
+++ type: CODE_CHANGE
+++ severity: LOW
      values.plugs.57:
+        "0xfa8c07E28461eb7c65b33De024DB97eE4C052C97"
    }
```

Generated with discovered.json: 0xc756f3131ca96d16bfed9654446846c762cd7a50

# Diff at Wed, 26 Jun 2024 09:44:54 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@cb9200e010745e10244c0b3851b3acf21fe41f31 block: 20138623
- current block number: 20175047

## Description

New plug with an attached vault for the upcoming KINTO token, not used yet.

## Watched changes

```diff
    contract Socket (0x943AC2775928318653e91d350574436A1b9b16f9) {
    +++ description: None
+++ description: ConnectorPlugs connect vaults (esrows) or controllers via the socket main contract to the switchboards. They have counerparts on the sibling chain.
+++ type: CODE_CHANGE
+++ severity: LOW
      values.plugs.56:
+        "0xA7384185a6428e6B0D33199256fE67b6fA5D8e40"
    }
```

Generated with discovered.json: 0xb7c645b5308cbf243e17e7486b4dcb2d95ccdd7f

# Diff at Fri, 21 Jun 2024 07:32:57 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@1ba6434de248c46d9e6b140264866a3072082af4 block: 20054750
- current block number: 20138623

## Description

A new counter plug is added. (Not an escrow)
Unrelated: New vaults with non-zero TVL that were discovered by a re-run of the socket script are added.

## Watched changes

```diff
    contract Socket (0x943AC2775928318653e91d350574436A1b9b16f9) {
    +++ description: None
+++ description: ConnectorPlugs connect vaults (esrows) or controllers via the socket main contract to the switchboards. They have counerparts on the sibling chain.
+++ type: CODE_CHANGE
+++ severity: LOW
      values.plugs.55:
+        "0xb40FdECfCa4EF29CACc37222Ce4dB1fd0f561a00"
    }
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20054750 (main branch discovery), not current.

```diff
+   Status: CREATED
    contract WBTC Vault Reya (0x2344621d5aA6e784e8C6f4c54b0B29Dd9c3Ad4B6)
    +++ description: None
```

```diff
+   Status: CREATED
    contract rsETH Vault Lyra (0x35d4D9bc79B0a543934b1769304B90d752691caD)
    +++ description: None
```

```diff
+   Status: CREATED
    contract LOOKS Vault Blast (0xa83B4006c16DAeAb2718294696c0122519195137)
    +++ description: None
```

```diff
+   Status: CREATED
    contract LooksRareMultisig (0xC8C57e4C73c71f72cA0a7e043E5D2D144F98ef13)
    +++ description: None
```

```diff
+   Status: CREATED
    contract USDe Vault Kinto (0xdf34E61B6e7B9e348713d528fEB019d504d38c1e)
    +++ description: None
```

Generated with discovered.json: 0x0089044e22a120573a4cb53672a16adb879ec015

# Diff at Sun, 09 Jun 2024 14:05:43 GMT:

- author: sekuba (<sekuba@users.noreply.github.com>)
- comparing to: main@023db9216bab49e9b3ffde0e43664e3e63c60fcf block: 19938250
- current block number: 20054750

## Description

### New owner EOA

The owner of some switchboards is changed from socketadmin.eth the another EOA (`0xB0BBff6311B7F245761A7846d3Ce7B1b100C1836`).

### New plugs and vaults

1) New vaults for Lyra-associated 'covered call'-tokens are deployed on Ethereum with Blast, Base, Arbitrum, Lyra, Mode and Optimism as their destinations. They are not yet used and therefore not yet added.
2) The Kinto WETH vault now has non-zero TVL and is added to socket.ts.

## Watched changes

```diff
    contract PolygonL1Switchboard (0x053407DFA30267f6332f3c94a9e9F704A55e62CD) {
    +++ description: None
      values.owner:
-        "0x5fD7D0d6b91CC4787Bcb86ca47e0Bd4ea0346d34"
+        "0xB0BBff6311B7F245761A7846d3Ce7B1b100C1836"
    }
```

```diff
    contract OptimismSwitchboard2 (0x0E674e057EC0FF97eeA57B6A350DBAAD22FE41BA) {
    +++ description: None
      values.owner:
-        "0x5fD7D0d6b91CC4787Bcb86ca47e0Bd4ea0346d34"
+        "0xB0BBff6311B7F245761A7846d3Ce7B1b100C1836"
    }
```

```diff
    contract CapacitorFactory (0x11Fbb9116801DB54bB51fF4dF423e34E8b45fc9a) {
    +++ description: None
      values.owner:
-        "0x5fD7D0d6b91CC4787Bcb86ca47e0Bd4ea0346d34"
+        "0xB0BBff6311B7F245761A7846d3Ce7B1b100C1836"
    }
```

```diff
    contract OptimismSwitchboard (0x139f39DC7dC05F7aC2DB3DB6af4f2e1a9De7c287) {
    +++ description: None
      values.owner:
-        "0x5fD7D0d6b91CC4787Bcb86ca47e0Bd4ea0346d34"
+        "0xB0BBff6311B7F245761A7846d3Ce7B1b100C1836"
    }
```

```diff
    contract Hasher (0x5C71beE4a6b0D617D8c3d107D331292741789E27) {
    +++ description: None
      values.owner:
-        "0x5fD7D0d6b91CC4787Bcb86ca47e0Bd4ea0346d34"
+        "0xB0BBff6311B7F245761A7846d3Ce7B1b100C1836"
    }
```

```diff
    contract Socket (0x943AC2775928318653e91d350574436A1b9b16f9) {
    +++ description: None
      values.owner:
-        "0x5fD7D0d6b91CC4787Bcb86ca47e0Bd4ea0346d34"
+        "0xB0BBff6311B7F245761A7846d3Ce7B1b100C1836"
+++ description: ConnectorPlugs connect vaults (esrows) or controllers via the socket main contract to the switchboards. They have counerparts on the sibling chain.
+++ type: CODE_CHANGE
+++ severity: LOW
      values.plugs.54:
+        "0x8843557Fd6005d617A735731BF1bAb0461af55E4"
+++ description: ConnectorPlugs connect vaults (esrows) or controllers via the socket main contract to the switchboards. They have counerparts on the sibling chain.
+++ type: CODE_CHANGE
+++ severity: LOW
      values.plugs.53:
+        "0xDBa83C0C654DB1cd914FA2710bA743e925B53086"
+++ description: ConnectorPlugs connect vaults (esrows) or controllers via the socket main contract to the switchboards. They have counerparts on the sibling chain.
+++ type: CODE_CHANGE
+++ severity: LOW
      values.plugs.52:
+        "0x716c339F41eAcfE2dc4775052411394A2Ed04743"
+++ description: ConnectorPlugs connect vaults (esrows) or controllers via the socket main contract to the switchboards. They have counerparts on the sibling chain.
+++ type: CODE_CHANGE
+++ severity: LOW
      values.plugs.51:
+        "0xd0711b9eBE84b778483709CDe62BacFDBAE13623"
+++ description: ConnectorPlugs connect vaults (esrows) or controllers via the socket main contract to the switchboards. They have counerparts on the sibling chain.
+++ type: CODE_CHANGE
+++ severity: LOW
      values.plugs.50:
+        "0x2B93891dc80ab9696814615f553fd15a3b98d3a2"
+++ description: ConnectorPlugs connect vaults (esrows) or controllers via the socket main contract to the switchboards. They have counerparts on the sibling chain.
+++ type: CODE_CHANGE
+++ severity: LOW
      values.plugs.49:
+        "0x519Bc0379CA9C4061a6006B4EAc419bC00017B3E"
+++ description: ConnectorPlugs connect vaults (esrows) or controllers via the socket main contract to the switchboards. They have counerparts on the sibling chain.
+++ type: CODE_CHANGE
+++ severity: LOW
      values.plugs.48:
+        "0x876b81F74AD47cF10e5D62aAAc80f9E99f5587FC"
+++ description: ConnectorPlugs connect vaults (esrows) or controllers via the socket main contract to the switchboards. They have counerparts on the sibling chain.
+++ type: CODE_CHANGE
+++ severity: LOW
      values.plugs.47:
+        "0xDABF17a0f13290E85a347119deEb8539B41eF4eB"
+++ description: ConnectorPlugs connect vaults (esrows) or controllers via the socket main contract to the switchboards. They have counerparts on the sibling chain.
+++ type: CODE_CHANGE
+++ severity: LOW
      values.plugs.46:
+        "0xA72bc51f800127621d4Ab541E7Bb70B86Fe88F0F"
+++ description: ConnectorPlugs connect vaults (esrows) or controllers via the socket main contract to the switchboards. They have counerparts on the sibling chain.
+++ type: CODE_CHANGE
+++ severity: LOW
      values.plugs.45:
+        "0x3685306641fB02804E9384C3af09Fa9B62199d7e"
+++ description: ConnectorPlugs connect vaults (esrows) or controllers via the socket main contract to the switchboards. They have counerparts on the sibling chain.
+++ type: CODE_CHANGE
+++ severity: LOW
      values.plugs.44:
+        "0x388341d9E5A7D7d5accD738B2a31b0622E0c1b87"
    }
```

```diff
    contract FastSwitchboard (0xD5a83a40F262E2247e6566171f9ADc76b745F5cD) {
    +++ description: None
      values.owner:
-        "0x5fD7D0d6b91CC4787Bcb86ca47e0Bd4ea0346d34"
+        "0xB0BBff6311B7F245761A7846d3Ce7B1b100C1836"
    }
```

```diff
    contract ArbitrumL1Switchboard (0xdf5f7dfDFc26ee5F629949e330bEf56906319CAe) {
    +++ description: None
      values.owner:
-        "0x5fD7D0d6b91CC4787Bcb86ca47e0Bd4ea0346d34"
+        "0xB0BBff6311B7F245761A7846d3Ce7B1b100C1836"
    }
```

```diff
    contract TransmitManager (0xeD037aFBffC65a94E9CC592947E851FB2f730341) {
    +++ description: None
      values.owner:
-        "0x5fD7D0d6b91CC4787Bcb86ca47e0Bd4ea0346d34"
+        "0xB0BBff6311B7F245761A7846d3Ce7B1b100C1836"
    }
```

```diff
    contract SignatureVerifier (0xf1ABF110d1B6ff0E2e8C05dd64FBF9eBA4d8af98) {
    +++ description: None
      values.owner:
-        "0x5fD7D0d6b91CC4787Bcb86ca47e0Bd4ea0346d34"
+        "0xB0BBff6311B7F245761A7846d3Ce7B1b100C1836"
    }
```

```diff
    contract ExecutionManager (0xFB4dcD94A051a1D2cF3EaF713a2Ef686653884E0) {
    +++ description: None
      values.owner:
-        "0x5fD7D0d6b91CC4787Bcb86ca47e0Bd4ea0346d34"
+        "0xB0BBff6311B7F245761A7846d3Ce7B1b100C1836"
    }
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19938250 (main branch discovery), not current.

```diff
+   Status: CREATED
    contract WETH Vault Kinto (0x00A0c9d82B95a17Cdf2D46703F2DcA13EB0E8A94)
    +++ description: None
```

Generated with discovered.json: 0xb73f0ccce9db7a2bbe57ebc5e399a2dcd7210bb0

# Diff at Fri, 24 May 2024 07:28:37 GMT:

- author: sekuba (<sekuba@users.noreply.github.com>)
- comparing to: main@5cd348fa5e8522ccb7c426ede1cad1f03ab682ab block: 19926155
- current block number: 19938250

## Description

New socket script: only vaults with non-zero TVL are added.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19926155 (main branch discovery), not current.

```diff
-   Status: DELETED
    contract WETH Vault Kinto (0x00A0c9d82B95a17Cdf2D46703F2DcA13EB0E8A94)
    +++ description: None
```

```diff
    contract rswETH Vault Lyra (0x4BB4C3CDc7562f08e9910A0C7D8bB7e108861eB4) {
    +++ description: None
      values.hook__:
-        "0xAf65752C4643E25C02F693f9D4FE19cF23a095E3"
      values.token:
-        "0xFAe103DC9cf190eD75350761e95403b7b8aFa6c0"
    }
```

```diff
-   Status: DELETED
    contract USDT Vault Lyra (0x5e98A25d8d6FF69A8992d6Aa57948dFB77D4ECBa)
    +++ description: None
```

```diff
-   Status: DELETED
    contract WETH Vault Reya (0x64dF894688c5052BeAdC35371cF69151Ebc5D658)
    +++ description: None
```

```diff
-   Status: DELETED
    contract DAI Vault 2 Kinto (0x6ed6E6B7c34Adf01B73732f0c06e3bbd9d4EaE58)
    +++ description: None
```

```diff
-   Status: DELETED
    contract USDC Vault Kinto (0x755cD5d147036E11c76F1EeffDd94794fC265f0d)
    +++ description: None
```

```diff
    contract weETH Vault Lyra (0x8180EcCC825b692ef65FF099a0A387743788bf78) {
    +++ description: None
      values.hook__:
-        "0x204cDCFE0D03c75a41A0079f187a7870265Bc949"
      values.token:
-        "0xCd5fE23C85820F7B72D0926FC9b05b43E359b7ee"
    }
```

```diff
-   Status: DELETED
    contract eETH Vault Kinto (0xc7a542f73049C11f9719Be6Ff701fCA882D60020)
    +++ description: None
```

```diff
-   Status: DELETED
    contract wUSDM Vault Kinto (0xD357F7Ec4826Bd1234CDA2277B623F6dE7dA56Dc)
    +++ description: None
```

```diff
-   Status: DELETED
    contract USDe Vault Kinto (0xdf34E61B6e7B9e348713d528fEB019d504d38c1e)
    +++ description: None
```

```diff
    contract USDC Vault Reya (0xdFf78A949E47c1e90f3Dd6dd7Fe2Fa72B42a75f7) {
    +++ description: None
      values.hook__:
-        "0x4fB274909ffeEf635270915a729dC40500c7260B"
      values.token:
-        "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48"
    }
```

```diff
+   Status: CREATED
    contract USDC Vault Hook (0x855Aaf2f690Ef6e5EF451D7AE73EC3fa61c50981)
    +++ description: None
```

Generated with discovered.json: 0x8c5e260ec6c1e9a5056ac259a728800724d90395

# Diff at Wed, 22 May 2024 14:56:49 GMT:

- author: sekuba (<sekuba@users.noreply.github.com>)
- comparing to: main@d8b1d401a7eb2fd4dbc2edda92ae733061915c30 block: 19919092
- current block number: 19926155

## Description

A new plug is added, connecting a new empty WETH vault to Reya.
Kinto changes the owner of all their vaults from an EOA to their Multisig.

## Watched changes

```diff
    contract WETH Vault Kinto (0x00A0c9d82B95a17Cdf2D46703F2DcA13EB0E8A94) {
    +++ description: None
      values.owner:
-        "0x660ad4B5A74130a4796B4d54BC6750Ae93C86e6c"
+        "0xf152Abda9E4ce8b134eF22Dc3C6aCe19C4895D82"
    }
```

```diff
    contract DAI Vault Kinto (0x12Cf431BdF7F143338cC09A0629EDcCEDCBCEcB5) {
    +++ description: None
      values.owner:
-        "0x660ad4B5A74130a4796B4d54BC6750Ae93C86e6c"
+        "0xf152Abda9E4ce8b134eF22Dc3C6aCe19C4895D82"
    }
```

```diff
    contract ENA Vault Kinto (0x351d8894fB8bfa1b0eFF77bFD9Aab18eA2da8fDd) {
    +++ description: None
      values.owner:
-        "0x660ad4B5A74130a4796B4d54BC6750Ae93C86e6c"
+        "0xf152Abda9E4ce8b134eF22Dc3C6aCe19C4895D82"
    }
```

```diff
    contract sUSDe Vault Kinto (0x43b718Aa5e678b08615CA984cbe25f690B085b32) {
    +++ description: None
      values.owner:
-        "0x660ad4B5A74130a4796B4d54BC6750Ae93C86e6c"
+        "0xf152Abda9E4ce8b134eF22Dc3C6aCe19C4895D82"
    }
```

```diff
    contract sDAI Vault Kinto (0x5B8Ae1C9c5970e2637Cf3Af431acAAebEf7aFb85) {
    +++ description: None
      values.owner:
-        "0x660ad4B5A74130a4796B4d54BC6750Ae93C86e6c"
+        "0xf152Abda9E4ce8b134eF22Dc3C6aCe19C4895D82"
    }
```

```diff
    contract USDC Vault Kinto (0x755cD5d147036E11c76F1EeffDd94794fC265f0d) {
    +++ description: None
      values.owner:
-        "0x660ad4B5A74130a4796B4d54BC6750Ae93C86e6c"
+        "0xf152Abda9E4ce8b134eF22Dc3C6aCe19C4895D82"
    }
```

```diff
    contract Socket (0x943AC2775928318653e91d350574436A1b9b16f9) {
    +++ description: None
+++ description: ConnectorPlugs connect vaults (esrows) or controllers via the socket main contract to the switchboards. They have counerparts on the sibling chain.
+++ type: CODE_CHANGE
+++ severity: LOW
      values.plugs.43:
+        "0x32295769ea702BA9337EE5B65c6b42aFF75FEC62"
    }
```

```diff
    contract ETHFI Vault Kinto (0x95d60E34aB2E626407d98dF8C240e6174e5D37E5) {
    +++ description: None
      values.owner:
-        "0x660ad4B5A74130a4796B4d54BC6750Ae93C86e6c"
+        "0xf152Abda9E4ce8b134eF22Dc3C6aCe19C4895D82"
    }
```

```diff
    contract wstETH Vault Kinto (0xc5d01939Af7Ce9Ffc505F0bb36eFeDde7920f2dc) {
    +++ description: None
      values.owner:
-        "0x660ad4B5A74130a4796B4d54BC6750Ae93C86e6c"
+        "0xf152Abda9E4ce8b134eF22Dc3C6aCe19C4895D82"
    }
```

```diff
    contract eETH Vault Kinto (0xc7a542f73049C11f9719Be6Ff701fCA882D60020) {
    +++ description: None
      values.owner:
-        "0x660ad4B5A74130a4796B4d54BC6750Ae93C86e6c"
+        "0xf152Abda9E4ce8b134eF22Dc3C6aCe19C4895D82"
    }
```

```diff
    contract wUSDM Vault Kinto (0xD357F7Ec4826Bd1234CDA2277B623F6dE7dA56Dc) {
    +++ description: None
      values.owner:
-        "0x660ad4B5A74130a4796B4d54BC6750Ae93C86e6c"
+        "0xf152Abda9E4ce8b134eF22Dc3C6aCe19C4895D82"
    }
```

```diff
    contract USDe Vault Kinto (0xdf34E61B6e7B9e348713d528fEB019d504d38c1e) {
    +++ description: None
      values.owner:
-        "0x660ad4B5A74130a4796B4d54BC6750Ae93C86e6c"
+        "0xf152Abda9E4ce8b134eF22Dc3C6aCe19C4895D82"
    }
```

```diff
    contract weETH Vault Kinto (0xeB66259d2eBC3ed1d3a98148f6298927d8A36397) {
    +++ description: None
      values.owner:
-        "0x660ad4B5A74130a4796B4d54BC6750Ae93C86e6c"
+        "0xf152Abda9E4ce8b134eF22Dc3C6aCe19C4895D82"
    }
```

```diff
+   Status: CREATED
    contract WETH Vault Reya (0x64dF894688c5052BeAdC35371cF69151Ebc5D658)
    +++ description: None
```

```diff
+   Status: CREATED
    contract KintoMultisig (0xf152Abda9E4ce8b134eF22Dc3C6aCe19C4895D82)
    +++ description: None
```

## Source code changes

```diff
.../ethereum/.flat/KintoMultisig/GnosisSafe.sol    | 952 +++++++++++++++++++++
 .../.flat/KintoMultisig/GnosisSafeProxy.p.sol      |  34 +
 ...-0x64dF894688c5052BeAdC35371cF69151Ebc5D658.sol | 886 +++++++++++++++++++
 3 files changed, 1872 insertions(+)
```

Generated with discovered.json: 0xcaeb1c446a3f5c31fd87a9bd4a84fbc98f2e9f5b

# Diff at Tue, 21 May 2024 15:12:04 GMT:

- author: sekuba (<sekuba@users.noreply.github.com>)
- comparing to: main@d10db8000986dcc20fb2efb94c0e0636ac38fa21 block: 19888244
- current block number: 19919092

## Description

New plugs and escrows are added, related to Kinto.
The recently added Lyra vaults are now governed by the Lyra multisig.

## Watched changes

```diff
    contract rswETH Vault Lyra (0x4BB4C3CDc7562f08e9910A0C7D8bB7e108861eB4) {
    +++ description: None
      values.owner:
-        "0xA82994cc5e9D94FED2916f762e03245FcBE79f23"
+        "0x246d38588b16Dd877c558b245e6D5a711C649fCF"
    }
```

```diff
    contract weETH Vault Lyra (0x8180EcCC825b692ef65FF099a0A387743788bf78) {
    +++ description: None
      values.owner:
-        "0xA82994cc5e9D94FED2916f762e03245FcBE79f23"
+        "0x246d38588b16Dd877c558b245e6D5a711C649fCF"
    }
```

```diff
    contract Socket (0x943AC2775928318653e91d350574436A1b9b16f9) {
    +++ description: None
+++ description: ConnectorPlugs connect vaults (esrows) or controllers via the socket main contract to the switchboards. They have counerparts on the sibling chain.
+++ type: CODE_CHANGE
+++ severity: LOW
      values.plugs.42:
+        "0xdE9D8c2d465669c661672d7945D4d4f5407d22E2"
+++ description: ConnectorPlugs connect vaults (esrows) or controllers via the socket main contract to the switchboards. They have counerparts on the sibling chain.
+++ type: CODE_CHANGE
+++ severity: LOW
      values.plugs.41:
+        "0xE2c2291B80BFC8Bd0e4fc8Af196Ae5fc9136aeE0"
+++ description: ConnectorPlugs connect vaults (esrows) or controllers via the socket main contract to the switchboards. They have counerparts on the sibling chain.
+++ type: CODE_CHANGE
+++ severity: LOW
      values.plugs.40:
+        "0xC331BEeC6e36c8Df4FDD7e432de95863E7f80d67"
+++ description: ConnectorPlugs connect vaults (esrows) or controllers via the socket main contract to the switchboards. They have counerparts on the sibling chain.
+++ type: CODE_CHANGE
+++ severity: LOW
      values.plugs.39:
+        "0xE274dB6b891159547FbDC18b07412EE7F4B8d767"
+++ description: ConnectorPlugs connect vaults (esrows) or controllers via the socket main contract to the switchboards. They have counerparts on the sibling chain.
+++ type: CODE_CHANGE
+++ severity: LOW
      values.plugs.38:
+        "0xF5992B6A0dEa32dCF6BE7bfAf762A4D94f139Ea7"
+++ description: ConnectorPlugs connect vaults (esrows) or controllers via the socket main contract to the switchboards. They have counerparts on the sibling chain.
+++ type: CODE_CHANGE
+++ severity: LOW
      values.plugs.37:
+        "0x170fFDe318B514B029E1B1eC4F096C7e1bDeaeA8"
+++ description: ConnectorPlugs connect vaults (esrows) or controllers via the socket main contract to the switchboards. They have counerparts on the sibling chain.
+++ type: CODE_CHANGE
+++ severity: LOW
      values.plugs.36:
+        "0x642c4c33301EF5837ADa6E74F15Aa939f3951Fff"
+++ description: ConnectorPlugs connect vaults (esrows) or controllers via the socket main contract to the switchboards. They have counerparts on the sibling chain.
+++ type: CODE_CHANGE
+++ severity: LOW
      values.plugs.35:
+        "0x73E0d4953c356a5Ca3A3D172739128776B2920b5"
+++ description: ConnectorPlugs connect vaults (esrows) or controllers via the socket main contract to the switchboards. They have counerparts on the sibling chain.
+++ type: CODE_CHANGE
+++ severity: LOW
      values.plugs.34:
+        "0x266abd77Da7F877cdf93c0dd5782cC61Fa29ac96"
+++ description: ConnectorPlugs connect vaults (esrows) or controllers via the socket main contract to the switchboards. They have counerparts on the sibling chain.
+++ type: CODE_CHANGE
+++ severity: LOW
      values.plugs.33:
+        "0x935f1C29Db1155c3E0f39F644DF78DDDBD4757Ff"
+++ description: ConnectorPlugs connect vaults (esrows) or controllers via the socket main contract to the switchboards. They have counerparts on the sibling chain.
+++ type: CODE_CHANGE
+++ severity: LOW
      values.plugs.32:
+        "0xe987a57DA7Ab112B1bDc7AA704E6EA943760d252"
+++ description: ConnectorPlugs connect vaults (esrows) or controllers via the socket main contract to the switchboards. They have counerparts on the sibling chain.
+++ type: CODE_CHANGE
+++ severity: LOW
      values.plugs.31:
+        "0x83C6d6597891Ad48cF5e0BA901De55120C37C6bE"
+++ description: ConnectorPlugs connect vaults (esrows) or controllers via the socket main contract to the switchboards. They have counerparts on the sibling chain.
+++ type: CODE_CHANGE
+++ severity: LOW
      values.plugs.30:
+        "0xAc00056920EfF02831CAf0baF116ADf6B42D9ad1"
+++ description: ConnectorPlugs connect vaults (esrows) or controllers via the socket main contract to the switchboards. They have counerparts on the sibling chain.
+++ type: CODE_CHANGE
+++ severity: LOW
      values.plugs.29:
+        "0xE7ADE6Dda067c501A3d4C938c36c310c55FBcc27"
    }
```

```diff
+   Status: CREATED
    contract WETH Vault Kinto (0x00A0c9d82B95a17Cdf2D46703F2DcA13EB0E8A94)
    +++ description: None
```

```diff
+   Status: CREATED
    contract DAI Vault Kinto (0x12Cf431BdF7F143338cC09A0629EDcCEDCBCEcB5)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ENA Vault Kinto (0x351d8894fB8bfa1b0eFF77bFD9Aab18eA2da8fDd)
    +++ description: None
```

```diff
+   Status: CREATED
    contract sUSDe Vault Kinto (0x43b718Aa5e678b08615CA984cbe25f690B085b32)
    +++ description: None
```

```diff
+   Status: CREATED
    contract sDAI Vault Kinto (0x5B8Ae1C9c5970e2637Cf3Af431acAAebEf7aFb85)
    +++ description: None
```

```diff
+   Status: CREATED
    contract DAI Vault 2 Kinto (0x6ed6E6B7c34Adf01B73732f0c06e3bbd9d4EaE58)
    +++ description: None
```

```diff
+   Status: CREATED
    contract USDC Vault Kinto (0x755cD5d147036E11c76F1EeffDd94794fC265f0d)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ETHFI Vault Kinto (0x95d60E34aB2E626407d98dF8C240e6174e5D37E5)
    +++ description: None
```

```diff
+   Status: CREATED
    contract wstETH Vault Kinto (0xc5d01939Af7Ce9Ffc505F0bb36eFeDde7920f2dc)
    +++ description: None
```

```diff
+   Status: CREATED
    contract eETH Vault Kinto (0xc7a542f73049C11f9719Be6Ff701fCA882D60020)
    +++ description: None
```

```diff
+   Status: CREATED
    contract wUSDM Vault Kinto (0xD357F7Ec4826Bd1234CDA2277B623F6dE7dA56Dc)
    +++ description: None
```

```diff
+   Status: CREATED
    contract USDe Vault Kinto (0xdf34E61B6e7B9e348713d528fEB019d504d38c1e)
    +++ description: None
```

```diff
+   Status: CREATED
    contract weETH Vault Kinto (0xeB66259d2eBC3ed1d3a98148f6298927d8A36397)
    +++ description: None
```

## Source code changes

```diff
...-0x00A0c9d82B95a17Cdf2D46703F2DcA13EB0E8A94.sol | 886 +++++++++++++++++++++
 ...-0x12Cf431BdF7F143338cC09A0629EDcCEDCBCEcB5.sol | 886 +++++++++++++++++++++
 ...-0x351d8894fB8bfa1b0eFF77bFD9Aab18eA2da8fDd.sol | 886 +++++++++++++++++++++
 ...-0x43b718Aa5e678b08615CA984cbe25f690B085b32.sol | 886 +++++++++++++++++++++
 ...-0x5B8Ae1C9c5970e2637Cf3Af431acAAebEf7aFb85.sol | 886 +++++++++++++++++++++
 ...-0x6ed6E6B7c34Adf01B73732f0c06e3bbd9d4EaE58.sol | 886 +++++++++++++++++++++
 ...-0x755cD5d147036E11c76F1EeffDd94794fC265f0d.sol | 886 +++++++++++++++++++++
 ...-0x95d60E34aB2E626407d98dF8C240e6174e5D37E5.sol | 886 +++++++++++++++++++++
 ...-0xD357F7Ec4826Bd1234CDA2277B623F6dE7dA56Dc.sol | 886 +++++++++++++++++++++
 ...-0xc5d01939Af7Ce9Ffc505F0bb36eFeDde7920f2dc.sol | 886 +++++++++++++++++++++
 ...-0xc7a542f73049C11f9719Be6Ff701fCA882D60020.sol | 886 +++++++++++++++++++++
 ...-0xdf34E61B6e7B9e348713d528fEB019d504d38c1e.sol | 886 +++++++++++++++++++++
 ...-0xeB66259d2eBC3ed1d3a98148f6298927d8A36397.sol | 886 +++++++++++++++++++++
 13 files changed, 11518 insertions(+)
```

Generated with discovered.json: 0x4bd5593e7b5d34a2700f86bac590a29180eb78e9

# Diff at Fri, 17 May 2024 07:36:32 GMT:

- author: sekuba (<sekuba@users.noreply.github.com>)
- comparing to: main@f530b3790f02092dbc5b25633755416ea7c2ec7d block: 19805467
- current block number: 19888244

## Description

New plugs connected to vaults associated with Lyra are added.
5 plugs, 1 has the same vault, 4 have vaults with the tokens:
- weETH (supported already)
- rswETH (restaked Swell ETH, added)
- weETHC (Lyra wrapped eETH covered call, ignored for now)
- rswethC (ignored for now)


## Watched changes

```diff
    contract Socket (0x943AC2775928318653e91d350574436A1b9b16f9) {
    +++ description: None
+++ description: ConnectorPlugs connect vaults (esrows) or controllers via the socket main contract to the switchboards. They have counerparts on the sibling chain.
+++ type: CODE_CHANGE
+++ severity: LOW
      values.plugs.28:
+        "0xb1178803A726e2077947754de9f2f0cbdA29A60F"
+++ description: ConnectorPlugs connect vaults (esrows) or controllers via the socket main contract to the switchboards. They have counerparts on the sibling chain.
+++ type: CODE_CHANGE
+++ severity: LOW
      values.plugs.27:
+        "0xB49b8AAcD8396C49d9045f6bAb101aB32c59643D"
+++ description: ConnectorPlugs connect vaults (esrows) or controllers via the socket main contract to the switchboards. They have counerparts on the sibling chain.
+++ type: CODE_CHANGE
+++ severity: LOW
      values.plugs.26:
+        "0x3f66F272d33B764960779a301c4183306ae50e10"
+++ description: ConnectorPlugs connect vaults (esrows) or controllers via the socket main contract to the switchboards. They have counerparts on the sibling chain.
+++ type: CODE_CHANGE
+++ severity: LOW
      values.plugs.25:
+        "0xF15d420bE7b27F1fA0D9487105658EdC3C0EA508"
+++ description: ConnectorPlugs connect vaults (esrows) or controllers via the socket main contract to the switchboards. They have counerparts on the sibling chain.
+++ type: CODE_CHANGE
+++ severity: LOW
      values.plugs.24:
+        "0xCc958F84DaF36d3eC20BcBee7E99C073B882efc3"
    }
```

```diff
+   Status: CREATED
    contract rswETH Vault Lyra (0x4BB4C3CDc7562f08e9910A0C7D8bB7e108861eB4)
    +++ description: None
```

```diff
+   Status: CREATED
    contract weETH Vault Lyra (0x8180EcCC825b692ef65FF099a0A387743788bf78)
    +++ description: None
```

## Source code changes

```diff
...-0x4BB4C3CDc7562f08e9910A0C7D8bB7e108861eB4.sol | 886 +++++++++++++++++++++
 ...-0x8180EcCC825b692ef65FF099a0A387743788bf78.sol | 886 +++++++++++++++++++++
 2 files changed, 1772 insertions(+)
```

Generated with discovered.json: 0x24bfd7f6c3a89e63c879a013490d80256ff8a746

# Diff at Sun, 05 May 2024 17:46:10 GMT:

- author: sekuba (<sekuba@users.noreply.github.com>)
- comparing to: main@91ddfe46c9a8cff7aff522924d50fd166a15932b block: 19609491
- current block number: 19805467

## Description

4 Plugs are added to the socket main contract. New vaults are discovered by the socket-update script and added to the escrows in socket.ts.

## Watched changes

```diff
    contract Socket (0x943AC2775928318653e91d350574436A1b9b16f9) {
    +++ description: None
+++ description: ConnectorPlugs connect vaults (esrows) or controllers via the socket main contract to the switchboards. They have counerparts on the sibling chain.
+++ type: CODE_CHANGE
+++ severity: LOW
      values.plugs.23:
+        "0x7E6dA87FE69306CaAED675fFe4e7dC0FfE3bFe4D"
+++ description: ConnectorPlugs connect vaults (esrows) or controllers via the socket main contract to the switchboards. They have counerparts on the sibling chain.
+++ type: CODE_CHANGE
+++ severity: LOW
      values.plugs.22:
+        "0x223033E1F905eEd161a7B2EBeb786a158156fb8D"
+++ description: ConnectorPlugs connect vaults (esrows) or controllers via the socket main contract to the switchboards. They have counerparts on the sibling chain.
+++ type: CODE_CHANGE
+++ severity: LOW
      values.plugs.21:
+        "0x998d7C2257591cC38383B4F91474c5346111f2E6"
+++ description: ConnectorPlugs connect vaults (esrows) or controllers via the socket main contract to the switchboards. They have counerparts on the sibling chain.
+++ type: CODE_CHANGE
+++ severity: LOW
      values.plugs.20:
+        "0xaaDd94438f511aC22D35Ba7FC50849a9CD3e6AeF"
    }
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19609491 (main branch discovery), not current.

```diff
    contract USDCVaultOwner (0x246d38588b16Dd877c558b245e6D5a711C649fCF) {
    +++ description: None
      name:
-        "USDCVaultOwner"
+        "LyraMultisig"
    }
```

```diff
    contract WBTC Vault (0x3Eec7c855aF33280F1eD38b93059F5aa5862E3ab) {
    +++ description: None
      name:
-        "WBTC Vault"
+        "WBTC Vault Lyra"
    }
```

```diff
    contract USDC Vault (0x6D303CEE7959f814042D31E0624fB88Ec6fbcC1d) {
    +++ description: None
      name:
-        "USDC Vault"
+        "USDC Vault Lyra"
    }
```

```diff
    contract SNX Vault (0x7D7aC8d55A9bD4152b703011f3E61AB3bB0A5592) {
    +++ description: None
      name:
-        "SNX Vault"
+        "SNX Vault Lyra"
    }
```

```diff
    contract WETH Vault 2 (0xB39DF6BBB1Cf2B609DeE43F109caFEFF1A7CCBEa) {
    +++ description: None
      name:
-        "WETH Vault 2"
+        "WETH Vault Hook"
    }
```

```diff
    contract WETH Vault (0xD4efe33C66B8CdE33B8896a2126E41e5dB571b7e) {
    +++ description: None
      name:
-        "WETH Vault"
+        "WETH Vault Lyra"
    }
```

```diff
    contract wstETH Vault (0xeBB5D642aA8ccDeE98373D6aC3ee0602b63824b3) {
    +++ description: None
      name:
-        "wstETH Vault"
+        "wstETH Vault Lyra"
    }
```

```diff
+   Status: CREATED
    contract USDT Vault Lyra (0x5e98A25d8d6FF69A8992d6Aa57948dFB77D4ECBa)
    +++ description: None
```

```diff
+   Status: CREATED
    contract USDC Vault Reya (0xdFf78A949E47c1e90f3Dd6dd7Fe2Fa72B42a75f7)
    +++ description: None
```

Generated with discovered.json: 0xfb0b61de4c8e0445a4631e0fabe790a63dede53e

# Diff at Mon, 08 Apr 2024 07:34:22 GMT:

- author: sekuba (<sekuba@users.noreply.github.com>)
- comparing to: main@ad88f63bb61619b31763ca9524dff8964cdc75f3 block: 19588327
- current block number: 19609491

## Description

A new plug is added. Its source code is not verified on Etherscan.

## Watched changes

```diff
    contract Socket (0x943AC2775928318653e91d350574436A1b9b16f9) {
    +++ description: None
+++ description: Array of plug contract addresses
+++ type: CODE_CHANGE
+++ severity: LOW
      values.plugs.19:
+        "0x2Dba37E679358125BaB2132dDF5133d7d66F7D06"
    }
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19588327 (main branch discovery), not current.

```diff
    contract WETH Vault 2 (0xB39DF6BBB1Cf2B609DeE43F109caFEFF1A7CCBEa) {
    +++ description: None
      values.token__:
-        "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2"
    }
```

```diff
-   Status: DELETED
    contract WETH9 (0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2)
    +++ description: None
```

Generated with discovered.json: 0xce7bfd338e208ebb4e3ce8a443525d2c636ed6ce

# Diff at Fri, 05 Apr 2024 08:24:08 GMT:

- author: sekuba (<sekuba@users.noreply.github.com>)
- comparing to: main@a911910b5e2265ea9037cf3122956a3c9707d183 block: 19532195
- current block number: 19588327

## Description

A plug is added.

## Watched changes

```diff
    contract Socket (0x943AC2775928318653e91d350574436A1b9b16f9) {
    +++ description: None
+++ description: Array of plug contract addresses
+++ type: CODE_CHANGE
+++ severity: LOW
      values.plugs.18:
+        "0x6A769e25081396a49a6702758d0830920ac1163A"
    }
```

```diff
    contract WETH9 (0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2) {
    +++ description: None
      values.totalSupply:
-        "2986807183575385281668118"
+        "2997542922595290340510005"
    }
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19532195 (main branch discovery), not current.

```diff
+   Status: CREATED
    contract WBTC Vault (0x3Eec7c855aF33280F1eD38b93059F5aa5862E3ab)
    +++ description: None
```

```diff
+   Status: CREATED
    contract SNX Vault (0x7D7aC8d55A9bD4152b703011f3E61AB3bB0A5592)
    +++ description: None
```

```diff
+   Status: CREATED
    contract WETH Vault 2 (0xB39DF6BBB1Cf2B609DeE43F109caFEFF1A7CCBEa)
    +++ description: None
```

```diff
+   Status: CREATED
    contract WETH9 (0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2)
    +++ description: None
```

```diff
+   Status: CREATED
    contract WETH Vault (0xD4efe33C66B8CdE33B8896a2126E41e5dB571b7e)
    +++ description: None
```

```diff
+   Status: CREATED
    contract wstETH Vault (0xeBB5D642aA8ccDeE98373D6aC3ee0602b63824b3)
    +++ description: None
```

Generated with discovered.json: 0x5f06851d6935822ec7d2e9ae5ae731d06d295cb6

# Diff at Thu, 28 Mar 2024 11:05:29 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@21187e63b9b90823a55c461c331868a470ce17eb block: 19497754
- current block number: 19532195

## Description

Update discovery to include the multisig threshold.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19497754 (main branch discovery), not current.

```diff
    contract USDCVaultOwner (0x246d38588b16Dd877c558b245e6D5a711C649fCF) {
    +++ description: None
      upgradeability.threshold:
+        "2 of 3 (67%)"
    }
```

Generated with discovered.json: 0x255f035589a4edd15c65708c90afa4cdecca5909

# Diff at Fri, 22 Mar 2024 07:51:07 GMT:

- author: sekuba (<sekuba@users.noreply.github.com>)
- comparing to: main@022e2fdbd062a978ff7ecc702973b614915f5846 block: 19483658
- current block number: 19488785

## Description

More bridging fee changes.

## Watched changes

```diff
    contract PolygonL1Switchboard (0x053407DFA30267f6332f3c94a9e9F704A55e62CD) {
    +++ description: None
+++ description: Fee charged by the switchboard for processing a transaction
+++ severity: LOW
      values.switchboardFees:
-        5884471559011500
+        4244501643700500
+++ description: Fee charged for verifying transaction
+++ severity: LOW
      values.verificationOverheadFees:
-        3278655744000
+        824668780000
    }
```

```diff
    contract OptimismSwitchboard2 (0x0E674e057EC0FF97eeA57B6A350DBAAD22FE41BA) {
    +++ description: None
+++ description: Fee charged by the switchboard for processing a transaction
+++ severity: LOW
      values.switchboardFees:
-        5568057713790000
+        4307646578800500
+++ description: Fee charged for verifying transaction
+++ severity: LOW
      values.verificationOverheadFees:
-        340928172000
+        359338720000
    }
```

```diff
    contract OptimismSwitchboard (0x139f39DC7dC05F7aC2DB3DB6af4f2e1a9De7c287) {
    +++ description: None
+++ description: Fee charged by the switchboard for processing a transaction
+++ severity: LOW
      values.switchboardFees:
-        5568057713790000
+        3270848270917500
    }
```

```diff
    contract ArbitrumL1Switchboard (0xdf5f7dfDFc26ee5F629949e330bEf56906319CAe) {
    +++ description: None
+++ description: Fee charged by the switchboard for processing a transaction
+++ severity: LOW
      values.switchboardFees:
-        6280699596483000
+        4386707880087000
    }
```

Generated with discovered.json: 0x9c077c8bf899c1f9ec86477b7bf996418783348f

# Diff at Thu, 21 Mar 2024 14:34:30 GMT:

- author: sekuba (<sekuba@users.noreply.githum.com>)
- comparing to: main@550e8c13dc36da304ad797c4c213a735d633c96b block: 19389434
- current block number: 19483658

## Description

Bridging fees are raised (doubled) for the optimism switchboards.

## Watched changes

```diff
    contract PolygonL1Switchboard (0x053407DFA30267f6332f3c94a9e9F704A55e62CD) {
    +++ description: None
+++ description: Fee charged by the switchboard for processing a transaction
+++ severity: LOW
      values.switchboardFees:
-        2700564286365000
+        5884471559011500
+++ description: Fee charged for verifying transaction
+++ severity: LOW
      values.verificationOverheadFees:
-        1196689560000
+        3278655744000
    }
```

```diff
    contract OptimismSwitchboard2 (0x0E674e057EC0FF97eeA57B6A350DBAAD22FE41BA) {
    +++ description: None
+++ description: Fee charged by the switchboard for processing a transaction
+++ severity: LOW
      values.switchboardFees:
-        2251544461254000
+        5568057713790000
+++ description: Fee charged for verifying transaction
+++ severity: LOW
      values.verificationOverheadFees:
-        319607508000
+        340928172000
    }
```

```diff
    contract OptimismSwitchboard (0x139f39DC7dC05F7aC2DB3DB6af4f2e1a9De7c287) {
    +++ description: None
+++ description: Fee charged by the switchboard for processing a transaction
+++ severity: LOW
      values.switchboardFees:
-        2251544461254000
+        5568057713790000
+++ description: Fee charged for verifying transaction
+++ severity: LOW
      values.verificationOverheadFees:
-        44002200000
+        52013156000
    }
```

```diff
    contract ArbitrumL1Switchboard (0xdf5f7dfDFc26ee5F629949e330bEf56906319CAe) {
    +++ description: None
+++ description: Fee charged by the switchboard for processing a transaction
+++ severity: LOW
      values.switchboardFees:
-        2458955286249000
+        6280699596483000
+++ description: Fee charged for verifying transaction
+++ severity: LOW
      values.verificationOverheadFees:
-        55000000000000
+        6500000000000
    }
```

Generated with discovered.json: 0x2f2ba4933ab604e3fea69cb0554f79110c0ea619

# Diff at Fri, 08 Mar 2024 09:05:01 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@a10be30b5303dc6a457478efdaca424c246501ca block: 19375693
- current block number: 19389434

## Description

Two new plugs.

## Watched changes

```diff
    contract Socket (0x943AC2775928318653e91d350574436A1b9b16f9) {
    +++ description: None
      values.plugs[17]:
+        "0xdCcFb24f983586144c085426dbfa3414045E19a3"
      values.plugs[16]:
+        "0x727aD65db6aE99DB5Dbee8F202846DD6009bf6D5"
    }
```

Generated with discovered.json: 0x37cb2efea554c7c5038c7efcd12e8cd84046d16f

# Diff at Wed, 06 Mar 2024 11:01:08 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@724fc93d9bd160395a856b93ce5016ca876c6436 block: 19212794
- current block number: 19375693

## Description

Three new plugs.

## Watched changes

```diff
    contract Socket (0x943AC2775928318653e91d350574436A1b9b16f9) {
    +++ description: None
      values.plugs[15]:
+        "0x4ab7B94BA3f3CF69354Eb2f6b5E856DC61e13660"
      values.plugs[14]:
+        "0x8F4e67C61232167584333e23D7d67BD73d80a4F5"
      values.plugs[13]:
+        "0x68411d61adF1341A6392C87A93941FdD3EE7DF8E"
    }
```

Generated with discovered.json: 0xbe11b5db1a4e90286ad51c890467859b0f633f8f

# Diff at Mon, 12 Feb 2024 15:19:43 GMT:

- author: vincfurc (<10850139+vincfurc@users.noreply.github.com>)
- comparing to: main@49775e355a1eff76df613908442249b787dac181 block: 19126484
- current block number: 19212794

## Description

Ignored nonce for usdc vault owner.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19126484 (main branch discovery), not current.

```diff
    contract GnosisSafe (0x246d38588b16Dd877c558b245e6D5a711C649fCF) {
      name:
-        "GnosisSafe"
+        "USDCVaultOwner"
      derivedName:
+        "GnosisSafe"
    }
```

Generated with discovered.json: 0x27bd701904bb21c706ab1fea624a84968e3fa15f

# Diff at Wed, 31 Jan 2024 12:32:59 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@e27d63e182fc6d33d67f67df00e2990c9700987e block: 19085063
- current block number: 19126484

## Description

Two new plugs.
Ignore `globalMessageCount` in watch mode.

## Watched changes

```diff
    contract Socket (0x943AC2775928318653e91d350574436A1b9b16f9) {
      values.plugs[12]:
+        "0x37091ade7C4E1A914D3155449e25eE91DA08EbE4"
      values.plugs[11]:
+        "0x280D208f0eE2f053A0441099bcBFf298bc8b9444"
    }
```

Generated with discovered.json: 0x7e76d559dbb49ba64aaea7b6263c85048220674d

# Diff at Thu, 25 Jan 2024 17:16:49 GMT:

- author: Michał Sobieraj-Jakubiec (<michalsidzej@gmail.com>)
- current block number: 19085063

## Description

Several new Switchboards created: PolygonL1Switchboard, OptimismSwitchboard2, OptimismSwitchboard, FastSwitchboard, ArbitrumL1Switchboard.

## Initial discovery

```diff
+   Status: CREATED
    contract PolygonL1Switchboard (0x053407DFA30267f6332f3c94a9e9F704A55e62CD) {
    }
```

```diff
+   Status: CREATED
    contract OptimismSwitchboard2 (0x0E674e057EC0FF97eeA57B6A350DBAAD22FE41BA) {
    }
```

```diff
+   Status: CREATED
    contract CapacitorFactory (0x11Fbb9116801DB54bB51fF4dF423e34E8b45fc9a) {
    }
```

```diff
+   Status: CREATED
    contract OptimismSwitchboard (0x139f39DC7dC05F7aC2DB3DB6af4f2e1a9De7c287) {
    }
```

```diff
+   Status: CREATED
    contract GnosisSafe (0x246d38588b16Dd877c558b245e6D5a711C649fCF) {
    }
```

```diff
+   Status: CREATED
    contract Hasher (0x5C71beE4a6b0D617D8c3d107D331292741789E27) {
    }
```

```diff
+   Status: CREATED
    contract USDC Vault (0x6D303CEE7959f814042D31E0624fB88Ec6fbcC1d) {
    }
```

```diff
+   Status: CREATED
    contract Socket (0x943AC2775928318653e91d350574436A1b9b16f9) {
    }
```

```diff
+   Status: CREATED
    contract FastSwitchboard (0xD5a83a40F262E2247e6566171f9ADc76b745F5cD) {
    }
```

```diff
+   Status: CREATED
    contract ArbitrumL1Switchboard (0xdf5f7dfDFc26ee5F629949e330bEf56906319CAe) {
    }
```

```diff
+   Status: CREATED
    contract TransmitManager (0xeD037aFBffC65a94E9CC592947E851FB2f730341) {
    }
```

```diff
+   Status: CREATED
    contract SignatureVerifier (0xf1ABF110d1B6ff0E2e8C05dd64FBF9eBA4d8af98) {
    }
```

```diff
+   Status: CREATED
    contract ExecutionManager (0xFB4dcD94A051a1D2cF3EaF713a2Ef686653884E0) {
    }
```
