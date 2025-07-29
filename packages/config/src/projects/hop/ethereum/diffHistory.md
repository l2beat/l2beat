Generated with discovered.json: 0xe74873556af04796f904c9f6e3d75a379dd1c7d1

# Diff at Mon, 14 Jul 2025 12:45:10 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@9f4300dad2f3d080cd56fa311d4a848556c74e72 block: 19531595
- current block number: 19531595

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19531595 (main branch discovery), not current.

```diff
    contract Hop Multisig (0x1ec078551A5ac8F0f51fAc57Ffc48Ea7d9A86E9d) {
    +++ description: None
      address:
-        "0x1ec078551A5ac8F0f51fAc57Ffc48Ea7d9A86E9d"
+        "eth:0x1ec078551A5ac8F0f51fAc57Ffc48Ea7d9A86E9d"
      values.$implementation:
-        "0x34CfAC646f301356fAa8B21e94227e3583Fe3F5F"
+        "eth:0x34CfAC646f301356fAa8B21e94227e3583Fe3F5F"
      values.$members.0:
-        "0x9f8d2dafE9978268aC7c67966B366d6d55e97f07"
+        "eth:0x9f8d2dafE9978268aC7c67966B366d6d55e97f07"
      values.$members.1:
-        "0x404c2184a4027b0092C5877BC4599099cd63E62D"
+        "eth:0x404c2184a4027b0092C5877BC4599099cd63E62D"
      values.$members.2:
-        "0xEb34e93f90fa76c865112F4596eAb65D6F0d2F62"
+        "eth:0xEb34e93f90fa76c865112F4596eAb65D6F0d2F62"
      implementationNames.0x1ec078551A5ac8F0f51fAc57Ffc48Ea7d9A86E9d:
-        "Proxy"
      implementationNames.0x34CfAC646f301356fAa8B21e94227e3583Fe3F5F:
-        "GnosisSafe"
      implementationNames.eth:0x1ec078551A5ac8F0f51fAc57Ffc48Ea7d9A86E9d:
+        "Proxy"
      implementationNames.eth:0x34CfAC646f301356fAa8B21e94227e3583Fe3F5F:
+        "GnosisSafe"
    }
```

```diff
    contract MATIC Bridge (0x22B1Cbb8D98a01a3B71D034BB899775A76Eb1cc2) {
    +++ description: None
      address:
-        "0x22B1Cbb8D98a01a3B71D034BB899775A76Eb1cc2"
+        "eth:0x22B1Cbb8D98a01a3B71D034BB899775A76Eb1cc2"
      values.governance:
-        "0x22e3F828b3f47dAcFACd875D20bd5cc0879C96e7"
+        "eth:0x22e3F828b3f47dAcFACd875D20bd5cc0879C96e7"
      values.l1CanonicalToken:
-        "0x7D1AfA7B718fb893dB30A3aBc0Cfc608AaCfeBB0"
+        "eth:0x7D1AfA7B718fb893dB30A3aBc0Cfc608AaCfeBB0"
      implementationNames.0x22B1Cbb8D98a01a3B71D034BB899775A76Eb1cc2:
-        "L1_ERC20_Bridge"
      implementationNames.eth:0x22B1Cbb8D98a01a3B71D034BB899775A76Eb1cc2:
+        "L1_ERC20_Bridge"
    }
```

```diff
    contract Timelock (0x22e3F828b3f47dAcFACd875D20bd5cc0879C96e7) {
    +++ description: None
      address:
-        "0x22e3F828b3f47dAcFACd875D20bd5cc0879C96e7"
+        "eth:0x22e3F828b3f47dAcFACd875D20bd5cc0879C96e7"
      values.admin:
-        "0x1ec078551A5ac8F0f51fAc57Ffc48Ea7d9A86E9d"
+        "eth:0x1ec078551A5ac8F0f51fAc57Ffc48Ea7d9A86E9d"
      values.pendingAdmin:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      implementationNames.0x22e3F828b3f47dAcFACd875D20bd5cc0879C96e7:
-        "Timelock"
      implementationNames.eth:0x22e3F828b3f47dAcFACd875D20bd5cc0879C96e7:
+        "Timelock"
    }
```

```diff
    contract USDC Bridge (0x3666f603Cc164936C1b87e207F36BEBa4AC5f18a) {
    +++ description: None
      address:
-        "0x3666f603Cc164936C1b87e207F36BEBa4AC5f18a"
+        "eth:0x3666f603Cc164936C1b87e207F36BEBa4AC5f18a"
      values.governance:
-        "0x22e3F828b3f47dAcFACd875D20bd5cc0879C96e7"
+        "eth:0x22e3F828b3f47dAcFACd875D20bd5cc0879C96e7"
      values.l1CanonicalToken:
-        "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48"
+        "eth:0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48"
      implementationNames.0x3666f603Cc164936C1b87e207F36BEBa4AC5f18a:
-        "L1_ERC20_Bridge"
      implementationNames.eth:0x3666f603Cc164936C1b87e207F36BEBa4AC5f18a:
+        "L1_ERC20_Bridge"
    }
```

```diff
    contract DAI Bridge (0x3d4Cc8A61c7528Fd86C55cfe061a78dCBA48EDd1) {
    +++ description: None
      address:
-        "0x3d4Cc8A61c7528Fd86C55cfe061a78dCBA48EDd1"
+        "eth:0x3d4Cc8A61c7528Fd86C55cfe061a78dCBA48EDd1"
      values.governance:
-        "0x22e3F828b3f47dAcFACd875D20bd5cc0879C96e7"
+        "eth:0x22e3F828b3f47dAcFACd875D20bd5cc0879C96e7"
      values.l1CanonicalToken:
-        "0x6B175474E89094C44Da98b954EedeAC495271d0F"
+        "eth:0x6B175474E89094C44Da98b954EedeAC495271d0F"
      implementationNames.0x3d4Cc8A61c7528Fd86C55cfe061a78dCBA48EDd1:
-        "L1_ERC20_Bridge"
      implementationNames.eth:0x3d4Cc8A61c7528Fd86C55cfe061a78dCBA48EDd1:
+        "L1_ERC20_Bridge"
    }
```

```diff
    contract USDT Bridge (0x3E4a3a4796d16c0Cd582C382691998f7c06420B6) {
    +++ description: None
      address:
-        "0x3E4a3a4796d16c0Cd582C382691998f7c06420B6"
+        "eth:0x3E4a3a4796d16c0Cd582C382691998f7c06420B6"
      values.governance:
-        "0x22e3F828b3f47dAcFACd875D20bd5cc0879C96e7"
+        "eth:0x22e3F828b3f47dAcFACd875D20bd5cc0879C96e7"
      values.l1CanonicalToken:
-        "0xdAC17F958D2ee523a2206206994597C13D831ec7"
+        "eth:0xdAC17F958D2ee523a2206206994597C13D831ec7"
      implementationNames.0x3E4a3a4796d16c0Cd582C382691998f7c06420B6:
-        "L1_ERC20_Bridge"
      implementationNames.eth:0x3E4a3a4796d16c0Cd582C382691998f7c06420B6:
+        "L1_ERC20_Bridge"
    }
```

```diff
    EOA  (0x404c2184a4027b0092C5877BC4599099cd63E62D) {
    +++ description: None
      address:
-        "0x404c2184a4027b0092C5877BC4599099cd63E62D"
+        "eth:0x404c2184a4027b0092C5877BC4599099cd63E62D"
    }
```

```diff
    contract SNX Bridge (0x893246FACF345c99e4235E5A7bbEE7404c988b96) {
    +++ description: None
      address:
-        "0x893246FACF345c99e4235E5A7bbEE7404c988b96"
+        "eth:0x893246FACF345c99e4235E5A7bbEE7404c988b96"
      values.governance:
-        "0x22e3F828b3f47dAcFACd875D20bd5cc0879C96e7"
+        "eth:0x22e3F828b3f47dAcFACd875D20bd5cc0879C96e7"
      values.l1CanonicalToken:
-        "0xC011a73ee8576Fb46F5E1c5751cA3B9Fe0af2a6F"
+        "eth:0xC011a73ee8576Fb46F5E1c5751cA3B9Fe0af2a6F"
      implementationNames.0x893246FACF345c99e4235E5A7bbEE7404c988b96:
-        "L1_ERC20_Bridge"
      implementationNames.eth:0x893246FACF345c99e4235E5A7bbEE7404c988b96:
+        "L1_ERC20_Bridge"
    }
```

```diff
    contract HOP Bridge (0x914f986a44AcB623A277d6Bd17368171FCbe4273) {
    +++ description: None
      address:
-        "0x914f986a44AcB623A277d6Bd17368171FCbe4273"
+        "eth:0x914f986a44AcB623A277d6Bd17368171FCbe4273"
      values.governance:
-        "0x22e3F828b3f47dAcFACd875D20bd5cc0879C96e7"
+        "eth:0x22e3F828b3f47dAcFACd875D20bd5cc0879C96e7"
      values.l1CanonicalToken:
-        "0xc5102fE9359FD9a28f877a67E36B0F050d81a3CC"
+        "eth:0xc5102fE9359FD9a28f877a67E36B0F050d81a3CC"
      values.migrator:
-        "0xeeA8422a08258e73c139Fc32a25e10410c14bd7a"
+        "eth:0xeeA8422a08258e73c139Fc32a25e10410c14bd7a"
      implementationNames.0x914f986a44AcB623A277d6Bd17368171FCbe4273:
-        "L1_HOP_Bridge"
      implementationNames.eth:0x914f986a44AcB623A277d6Bd17368171FCbe4273:
+        "L1_HOP_Bridge"
    }
```

```diff
    EOA  (0x9f8d2dafE9978268aC7c67966B366d6d55e97f07) {
    +++ description: None
      address:
-        "0x9f8d2dafE9978268aC7c67966B366d6d55e97f07"
+        "eth:0x9f8d2dafE9978268aC7c67966B366d6d55e97f07"
    }
```

```diff
    contract ETH Bridge (0xb8901acB165ed027E32754E0FFe830802919727f) {
    +++ description: None
      address:
-        "0xb8901acB165ed027E32754E0FFe830802919727f"
+        "eth:0xb8901acB165ed027E32754E0FFe830802919727f"
      values.governance:
-        "0x22e3F828b3f47dAcFACd875D20bd5cc0879C96e7"
+        "eth:0x22e3F828b3f47dAcFACd875D20bd5cc0879C96e7"
      implementationNames.0xb8901acB165ed027E32754E0FFe830802919727f:
-        "L1_ETH_Bridge"
      implementationNames.eth:0xb8901acB165ed027E32754E0FFe830802919727f:
+        "L1_ETH_Bridge"
    }
```

```diff
    contract WBTC Bridge (0xb98454270065A31D71Bf635F6F7Ee6A518dFb849) {
    +++ description: None
      address:
-        "0xb98454270065A31D71Bf635F6F7Ee6A518dFb849"
+        "eth:0xb98454270065A31D71Bf635F6F7Ee6A518dFb849"
      values.governance:
-        "0xF56e305024B195383245A075737d16dBdb8487Fb"
+        "eth:0xF56e305024B195383245A075737d16dBdb8487Fb"
      values.l1CanonicalToken:
-        "0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599"
+        "eth:0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599"
      implementationNames.0xb98454270065A31D71Bf635F6F7Ee6A518dFb849:
-        "L1_ERC20_Bridge"
      implementationNames.eth:0xb98454270065A31D71Bf635F6F7Ee6A518dFb849:
+        "L1_ERC20_Bridge"
    }
```

```diff
    EOA  (0xEb34e93f90fa76c865112F4596eAb65D6F0d2F62) {
    +++ description: None
      address:
-        "0xEb34e93f90fa76c865112F4596eAb65D6F0d2F62"
+        "eth:0xEb34e93f90fa76c865112F4596eAb65D6F0d2F62"
    }
```

```diff
    contract Hop Governor (0xed8Bdb5895B8B7f9Fdb3C087628FD8410E853D48) {
    +++ description: None
      address:
-        "0xed8Bdb5895B8B7f9Fdb3C087628FD8410E853D48"
+        "eth:0xed8Bdb5895B8B7f9Fdb3C087628FD8410E853D48"
      values.timelock:
-        "0xeeA8422a08258e73c139Fc32a25e10410c14bd7a"
+        "eth:0xeeA8422a08258e73c139Fc32a25e10410c14bd7a"
      values.token:
-        "0xc5102fE9359FD9a28f877a67E36B0F050d81a3CC"
+        "eth:0xc5102fE9359FD9a28f877a67E36B0F050d81a3CC"
      implementationNames.0xed8Bdb5895B8B7f9Fdb3C087628FD8410E853D48:
-        "HOPGovernor"
      implementationNames.eth:0xed8Bdb5895B8B7f9Fdb3C087628FD8410E853D48:
+        "HOPGovernor"
    }
```

```diff
    contract Timelock Controller (0xeeA8422a08258e73c139Fc32a25e10410c14bd7a) {
    +++ description: None
      address:
-        "0xeeA8422a08258e73c139Fc32a25e10410c14bd7a"
+        "eth:0xeeA8422a08258e73c139Fc32a25e10410c14bd7a"
      values.accessControl.TIMELOCK_ADMIN_ROLE.members.0:
-        "0xeeA8422a08258e73c139Fc32a25e10410c14bd7a"
+        "eth:0xeeA8422a08258e73c139Fc32a25e10410c14bd7a"
      values.accessControl.PROPOSER_ROLE.members.0:
-        "0xed8Bdb5895B8B7f9Fdb3C087628FD8410E853D48"
+        "eth:0xed8Bdb5895B8B7f9Fdb3C087628FD8410E853D48"
      values.accessControl.EXECUTOR_ROLE.members.0:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      implementationNames.0xeeA8422a08258e73c139Fc32a25e10410c14bd7a:
-        "TimelockController"
      implementationNames.eth:0xeeA8422a08258e73c139Fc32a25e10410c14bd7a:
+        "TimelockController"
    }
```

```diff
    EOA  (0xF56e305024B195383245A075737d16dBdb8487Fb) {
    +++ description: None
      address:
-        "0xF56e305024B195383245A075737d16dBdb8487Fb"
+        "eth:0xF56e305024B195383245A075737d16dBdb8487Fb"
    }
```

```diff
+   Status: CREATED
    contract Hop Multisig (0x1ec078551A5ac8F0f51fAc57Ffc48Ea7d9A86E9d)
    +++ description: None
```

```diff
+   Status: CREATED
    contract MATIC Bridge (0x22B1Cbb8D98a01a3B71D034BB899775A76Eb1cc2)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Timelock (0x22e3F828b3f47dAcFACd875D20bd5cc0879C96e7)
    +++ description: None
```

```diff
+   Status: CREATED
    contract USDC Bridge (0x3666f603Cc164936C1b87e207F36BEBa4AC5f18a)
    +++ description: None
```

```diff
+   Status: CREATED
    contract DAI Bridge (0x3d4Cc8A61c7528Fd86C55cfe061a78dCBA48EDd1)
    +++ description: None
```

```diff
+   Status: CREATED
    contract USDT Bridge (0x3E4a3a4796d16c0Cd582C382691998f7c06420B6)
    +++ description: None
```

```diff
+   Status: CREATED
    contract SNX Bridge (0x893246FACF345c99e4235E5A7bbEE7404c988b96)
    +++ description: None
```

```diff
+   Status: CREATED
    contract HOP Bridge (0x914f986a44AcB623A277d6Bd17368171FCbe4273)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ETH Bridge (0xb8901acB165ed027E32754E0FFe830802919727f)
    +++ description: None
```

```diff
+   Status: CREATED
    contract WBTC Bridge (0xb98454270065A31D71Bf635F6F7Ee6A518dFb849)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Hop Governor (0xed8Bdb5895B8B7f9Fdb3C087628FD8410E853D48)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Timelock Controller (0xeeA8422a08258e73c139Fc32a25e10410c14bd7a)
    +++ description: None
```

Generated with discovered.json: 0xa134bd62ee0195e9ab7ab7d9877d6c4545e3a291

# Diff at Tue, 04 Mar 2025 10:39:14 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@98d260b45fe0d2195ce5e629bd7b200c8706e8ba block: 19531595
- current block number: 19531595

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19531595 (main branch discovery), not current.

```diff
    contract Hop Multisig (0x1ec078551A5ac8F0f51fAc57Ffc48Ea7d9A86E9d) {
    +++ description: None
      sinceBlock:
+        12736916
    }
```

```diff
    contract MATIC Bridge (0x22B1Cbb8D98a01a3B71D034BB899775A76Eb1cc2) {
    +++ description: None
      sinceBlock:
+        12969385
    }
```

```diff
    contract Timelock (0x22e3F828b3f47dAcFACd875D20bd5cc0879C96e7) {
    +++ description: None
      sinceBlock:
+        12772100
    }
```

```diff
    contract USDC Bridge (0x3666f603Cc164936C1b87e207F36BEBa4AC5f18a) {
    +++ description: None
      sinceBlock:
+        12650032
    }
```

```diff
    contract DAI Bridge (0x3d4Cc8A61c7528Fd86C55cfe061a78dCBA48EDd1) {
    +++ description: None
      sinceBlock:
+        13226217
    }
```

```diff
    contract USDT Bridge (0x3E4a3a4796d16c0Cd582C382691998f7c06420B6) {
    +++ description: None
      sinceBlock:
+        12860139
    }
```

```diff
    contract SNX Bridge (0x893246FACF345c99e4235E5A7bbEE7404c988b96) {
    +++ description: None
      sinceBlock:
+        15634323
    }
```

```diff
    contract HOP Bridge (0x914f986a44AcB623A277d6Bd17368171FCbe4273) {
    +++ description: None
      sinceBlock:
+        15592825
    }
```

```diff
    contract ETH Bridge (0xb8901acB165ed027E32754E0FFe830802919727f) {
    +++ description: None
      sinceBlock:
+        13331564
    }
```

```diff
    contract WBTC Bridge (0xb98454270065A31D71Bf635F6F7Ee6A518dFb849) {
    +++ description: None
      sinceBlock:
+        13476113
    }
```

```diff
    contract Hop Governor (0xed8Bdb5895B8B7f9Fdb3C087628FD8410E853D48) {
    +++ description: None
      sinceBlock:
+        14923681
    }
```

```diff
    contract Timelock Controller (0xeeA8422a08258e73c139Fc32a25e10410c14bd7a) {
    +++ description: None
      sinceBlock:
+        14923676
    }
```

Generated with discovered.json: 0x0427cd2aedd32c8604a03133c0878499754cf74f

# Diff at Mon, 14 Oct 2024 10:51:29 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@1afc77ff111ceb0970e7d09efcc7b2f376b0c281 block: 19531595
- current block number: 19531595

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19531595 (main branch discovery), not current.

```diff
    contract Hop Multisig (0x1ec078551A5ac8F0f51fAc57Ffc48Ea7d9A86E9d) {
    +++ description: None
      sourceHashes:
+        ["0xd5a33441170541b7df25812e0e3dff6562b2f09ab835a6b431cb9e7198a47605","0x263aadde480629cd3ca5704cc7d4e7df809d437e68f8d9864039801ddf820367"]
    }
```

```diff
    contract MATIC Bridge (0x22B1Cbb8D98a01a3B71D034BB899775A76Eb1cc2) {
    +++ description: None
      sourceHashes:
+        ["0x75e421fb2a98b163a7e8946c6cd7a5ed33e6fbc412c10c85963f5f25be17f56c"]
    }
```

```diff
    contract Timelock (0x22e3F828b3f47dAcFACd875D20bd5cc0879C96e7) {
    +++ description: None
      sourceHashes:
+        ["0xd8c1c87ab8dd6a488c6544d121da18bd936a01cde20a7dd2b3d0f771e376fe37"]
    }
```

```diff
    contract USDC Bridge (0x3666f603Cc164936C1b87e207F36BEBa4AC5f18a) {
    +++ description: None
      sourceHashes:
+        ["0x0280d9153cd7cca43f1ed48d033d6863660ddf85ced54664b3491bf99b2af313"]
    }
```

```diff
    contract DAI Bridge (0x3d4Cc8A61c7528Fd86C55cfe061a78dCBA48EDd1) {
    +++ description: None
      sourceHashes:
+        ["0x75e421fb2a98b163a7e8946c6cd7a5ed33e6fbc412c10c85963f5f25be17f56c"]
    }
```

```diff
    contract USDT Bridge (0x3E4a3a4796d16c0Cd582C382691998f7c06420B6) {
    +++ description: None
      sourceHashes:
+        ["0x75e421fb2a98b163a7e8946c6cd7a5ed33e6fbc412c10c85963f5f25be17f56c"]
    }
```

```diff
    contract SNX Bridge (0x893246FACF345c99e4235E5A7bbEE7404c988b96) {
    +++ description: None
      sourceHashes:
+        ["0x2b7aa191c2727e479449690cdb41f98bbcc67a31189e00edcd25ef5e4d272224"]
    }
```

```diff
    contract HOP Bridge (0x914f986a44AcB623A277d6Bd17368171FCbe4273) {
    +++ description: None
      sourceHashes:
+        ["0x8a2a80add79397b17c716d503c7aa7cc60889161cdef47d55c8b8b519f5b90d7"]
    }
```

```diff
    contract ETH Bridge (0xb8901acB165ed027E32754E0FFe830802919727f) {
    +++ description: None
      sourceHashes:
+        ["0xaed8456169cf92120561541e8b5eee9af6a7b97882c06a21febf326148a53bc3"]
    }
```

```diff
    contract WBTC Bridge (0xb98454270065A31D71Bf635F6F7Ee6A518dFb849) {
    +++ description: None
      sourceHashes:
+        ["0x75e421fb2a98b163a7e8946c6cd7a5ed33e6fbc412c10c85963f5f25be17f56c"]
    }
```

```diff
    contract Hop Governor (0xed8Bdb5895B8B7f9Fdb3C087628FD8410E853D48) {
    +++ description: None
      sourceHashes:
+        ["0x6b63f571e92a25b4c3f2638c0d2dfbc59d1208a0253e4e99ee58a21c681621ba"]
    }
```

```diff
    contract Timelock Controller (0xeeA8422a08258e73c139Fc32a25e10410c14bd7a) {
    +++ description: None
      sourceHashes:
+        ["0xa6a292449d803c10fc738e9af7e5ad07eac4346aee687901ea5a9957b3ff4272"]
    }
```

Generated with discovered.json: 0x5352dff9e38fa423bf4dac53486c18c3172d2e5f

# Diff at Fri, 09 Aug 2024 10:09:41 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@1f0da1d0aab7bc6b3b5e54e7e93480bd98e57035 block: 19531595
- current block number: 19531595

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19531595 (main branch discovery), not current.

```diff
    contract Hop Multisig (0x1ec078551A5ac8F0f51fAc57Ffc48Ea7d9A86E9d) {
    +++ description: None
      values.$multisigThreshold:
-        "2 of 3 (67%)"
      values.getOwners:
-        ["0x9f8d2dafE9978268aC7c67966B366d6d55e97f07","0x404c2184a4027b0092C5877BC4599099cd63E62D","0xEb34e93f90fa76c865112F4596eAb65D6F0d2F62"]
      values.getThreshold:
-        2
      values.$members:
+        ["0x9f8d2dafE9978268aC7c67966B366d6d55e97f07","0x404c2184a4027b0092C5877BC4599099cd63E62D","0xEb34e93f90fa76c865112F4596eAb65D6F0d2F62"]
      values.$threshold:
+        2
      values.multisigThreshold:
+        "2 of 3 (67%)"
    }
```

Generated with discovered.json: 0x1db563cf7b35cf687b25e71feee6a2df0386d53a

# Diff at Thu, 28 Mar 2024 09:03:57 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@867de6120241d47b66bf76f83c490408eb3595b0 block: 16154924
- current block number: 19531595

## Description

Update discovery to include the multisig threshold.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 16154924 (main branch discovery), not current.

```diff
    contract Hop Multisig (0x1ec078551A5ac8F0f51fAc57Ffc48Ea7d9A86E9d) {
    +++ description: None
      upgradeability.threshold:
+        "2 of 3 (67%)"
    }
```

Generated with discovered.json: 0x9a20a42b5832a97ae4e72f7947abb45265c60c17
