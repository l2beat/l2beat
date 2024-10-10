Generated with discovered.json: 0xc95d53a130476ca1b6dcdd7b91101e995c0dc0fc

# Diff at Thu, 10 Oct 2024 09:40:14 GMT:

- author: sekuba (<sekuba@users.noreply.github.com>)
- comparing to: main@cb5ff535ffc194baf7396bd6db8232883e2ad088 block: 20862628
- current block number: 20934364

## Description

New pools (handled by shapes).

## Watched changes

```diff
    contract PriceRegistry (0x8c9b2Efb7c64C394119270bfecE7f54763b958Ad) {
    +++ description: None
      values.getFeeTokens.2:
+        "0x40D16FC0246aD3160Ccc09B8D0D3A2cD28aE6C2f"
    }
```

```diff
+   Status: CREATED
    contract LockReleaseTokenPool (0x2c5C39F515277E64D96C28f3fc49Ad1d6a25B5B4)
    +++ description: None
```

```diff
+   Status: CREATED
    contract BurnWithFromMintTokenPool (0x45A103142585bdFc49cdb137f2a45D1AE7F84b6b)
    +++ description: None
```

```diff
+   Status: CREATED
    contract LockReleaseTokenPool (0xa35304aA2D659e5E06A768fEc4Af3B443916C215)
    +++ description: None
```

## Source code changes

```diff
...0x45A103142585bdFc49cdb137f2a45D1AE7F84b6b.sol} |    0
 ...-0x66D40E0D2819a2264B2a61f5DD578573B9dedCEc.sol | 1312 ++++++++++++++++++
 ...-0x2c5C39F515277E64D96C28f3fc49Ad1d6a25B5B4.sol | 1408 ++++++++++++++++++++
 ...-0xa35304aA2D659e5E06A768fEc4Af3B443916C215.sol | 1408 ++++++++++++++++++++
 4 files changed, 4128 insertions(+)
```

Generated with discovered.json: 0xc37ce95daf3e1510d769b2f36f8677e6be3006d6

# Diff at Tue, 01 Oct 2024 11:11:41 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@bd754dc73c66120164006054f8d25c5fae9cd910 block: 20862628
- current block number: 20862628

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20862628 (main branch discovery), not current.

```diff
    contract UpgradeableLockReleaseTokenPool (0x5756880B6a1EAba0175227bf02a7E87c1e02B28C) {
    +++ description: None
      values.$pastUpgrades:
+        [["2024-06-22T17:51:35.000Z",["0x72427dA7EFBa1585E94F30C72221d8d394aE3Bb7"]]]
    }
```

Generated with discovered.json: 0x16b4698a50c5e6896d40b903e619513ddecaeba4

# Diff at Mon, 30 Sep 2024 09:41:05 GMT:

- author: sekuba (<sekuba@users.noreply.github.com>)
- comparing to: main@eec6993b988ab9a9f325d04da2e9717ed24ad0b9 block: 20842966
- current block number: 20862628

## Description

Multisig signers / groups changes.

## Watched changes

```diff
    contract ManyChainMultiSig (0x117ec8aD107976e1dBCc21717ff78407Bc36aADc) {
    +++ description: None
      values.getConfig.signers.45:
+        {"addr":"0xECDd1737E54530D7b05Ad309B9B365CDc0084FD0","index":45,"group":12}
      values.getConfig.signers.44.addr:
-        "0xECDd1737E54530D7b05Ad309B9B365CDc0084FD0"
+        "0xE062e7D123AC8dF480C56147f911144F55C10f88"
      values.getConfig.signers.44.group:
-        12
+        10
      values.getConfig.signers.43.addr:
-        "0xE062e7D123AC8dF480C56147f911144F55C10f88"
+        "0xd844665361adBa29CD1259ebDe9b547ECe2ab0E7"
      values.getConfig.signers.43.group:
-        10
+        12
      values.getConfig.signers.42.addr:
-        "0xd844665361adBa29CD1259ebDe9b547ECe2ab0E7"
+        "0xd3E2da792E806556517124f03F12e557045951E7"
      values.getConfig.signers.42.group:
-        12
+        6
      values.getConfig.signers.41.addr:
-        "0xd3E2da792E806556517124f03F12e557045951E7"
+        "0xd3094f770579AFd66711847cE9E9C42D10BA2264"
      values.getConfig.signers.41.group:
-        6
+        4
      values.getConfig.signers.40.addr:
-        "0xd3094f770579AFd66711847cE9E9C42D10BA2264"
+        "0xc90788d9168f83dec518Ab7c0445Ad1Ec53554D7"
      values.getConfig.signers.40.group:
-        4
+        5
      values.getConfig.signers.39.addr:
-        "0xc90788d9168f83dec518Ab7c0445Ad1Ec53554D7"
+        "0xC19Beb494BA0bC57e5F967706A24bAFb6Da7BCD7"
      values.getConfig.signers.39.group:
-        5
+        12
      values.getConfig.signers.38.addr:
-        "0xC19Beb494BA0bC57e5F967706A24bAFb6Da7BCD7"
+        "0xAe735fd5e74887064DFf99C637f291caE5485A75"
      values.getConfig.signers.38.group:
-        12
+        11
      values.getConfig.signers.37.addr:
-        "0xAe735fd5e74887064DFf99C637f291caE5485A75"
+        "0xA8030F40032E88552519EDFc448523d677B29661"
      values.getConfig.signers.37.group:
-        11
+        12
      values.getConfig.signers.36.addr:
-        "0xA8030F40032E88552519EDFc448523d677B29661"
+        "0xa42c8570771240D1e2F3211064a7C7472Cc05b7D"
      values.getConfig.signers.36.group:
-        12
+        8
      values.getConfig.signers.35.addr:
-        "0xa42c8570771240D1e2F3211064a7C7472Cc05b7D"
+        "0xa35B7219521134cAF52DccAD44d604335b64a4fB"
      values.getConfig.signers.35.group:
-        8
+        4
      values.getConfig.signers.34.addr:
-        "0xa35B7219521134cAF52DccAD44d604335b64a4fB"
+        "0xA3177f64efE98422E782bC17BE7971F01187B7cF"
      values.getConfig.signers.34.group:
-        4
+        1
      values.getConfig.signers.33.addr:
-        "0xA3177f64efE98422E782bC17BE7971F01187B7cF"
+        "0x9E318D85D42F7e5b8B4fb2fB2d706C4c04D1549e"
      values.getConfig.signers.33.group:
-        1
+        12
      values.getConfig.signers.32.addr:
-        "0x9E318D85D42F7e5b8B4fb2fB2d706C4c04D1549e"
+        "0x9d0D65cd6e46B86f88fF021d8f5EE58fe8ce2882"
      values.getConfig.signers.31.addr:
-        "0x9d0D65cd6e46B86f88fF021d8f5EE58fe8ce2882"
+        "0x9453E18f03A36E2A2c70598De520bD24434D2d1D"
      values.getConfig.signers.31.group:
-        12
+        6
      values.getConfig.signers.30.addr:
-        "0x9453E18f03A36E2A2c70598De520bD24434D2d1D"
+        "0x925d7Ea0ADe586DBFd56a942bb297286cE428C79"
      values.getConfig.signers.30.group:
-        6
+        1
      values.getConfig.signers.29.addr:
-        "0x925d7Ea0ADe586DBFd56a942bb297286cE428C79"
+        "0x9079410666ED02725ee9d148398Cee26397c2A36"
      values.getConfig.signers.28.addr:
-        "0x9079410666ED02725ee9d148398Cee26397c2A36"
+        "0x7eFF312905DEdB38Bf8f07BEFaDfF96376154374"
      values.getConfig.signers.28.group:
-        1
+        5
      values.getConfig.signers.27.addr:
-        "0x7eFF312905DEdB38Bf8f07BEFaDfF96376154374"
+        "0x776D5B14ef1D5C58B0d48b53114f2Aa0faccB307"
      values.getConfig.signers.27.group:
-        5
+        11
      values.getConfig.signers.26.addr:
-        "0x776D5B14ef1D5C58B0d48b53114f2Aa0faccB307"
+        "0x745B9329ccF53556e3C5f1fD1E4e9D0E91Ad2514"
      values.getConfig.signers.25.addr:
-        "0x745B9329ccF53556e3C5f1fD1E4e9D0E91Ad2514"
+        "0x70C2Ddc97c4fAea760027d45E5de4D1E2ad2b9A5"
      values.getConfig.signers.25.group:
-        11
+        6
      values.getConfig.signers.24.addr:
-        "0x70C2Ddc97c4fAea760027d45E5de4D1E2ad2b9A5"
+        "0x7052cB84079905400ea52B635cAb6a275fDA8823"
      values.getConfig.signers.24.group:
-        6
+        10
      values.getConfig.signers.23.addr:
-        "0x7052cB84079905400ea52B635cAb6a275fDA8823"
+        "0x6bfBf6BC4bc5CD20768dAA6F58f0743bAFf2e5f4"
      values.getConfig.signers.23.group:
-        10
+        8
      values.getConfig.signers.22.addr:
-        "0x6bfBf6BC4bc5CD20768dAA6F58f0743bAFf2e5f4"
+        "0x6B0f508B8cbeF970fAF9E8a28b9b4C6F1FD3afae"
      values.getConfig.signers.22.group:
-        8
+        7
      values.getConfig.signers.21.addr:
-        "0x6B0f508B8cbeF970fAF9E8a28b9b4C6F1FD3afae"
+        "0x6924E54339C7f28730dBB4B842a7FE86ED01Ecf7"
      values.getConfig.signers.21.group:
-        7
+        1
      values.getConfig.signers.20.addr:
-        "0x6924E54339C7f28730dBB4B842a7FE86ED01Ecf7"
+        "0x5C33Bf560f29e04dF8A666493aAD8E47eEa9B1c8"
      values.getConfig.signers.20.group:
-        1
+        2
      values.getConfig.signers.19.addr:
-        "0x5C33Bf560f29e04dF8A666493aAD8E47eEa9B1c8"
+        "0x5bD3a90E94bB8aA6fE6cCF494e292F5F707B92d6"
      values.getConfig.signers.18.addr:
-        "0x5bD3a90E94bB8aA6fE6cCF494e292F5F707B92d6"
+        "0x570F41d83b1031d382F641B9a532A8D7CBd7a695"
      values.getConfig.signers.18.group:
-        2
+        1
      values.getConfig.signers.17.addr:
-        "0x570F41d83b1031d382F641B9a532A8D7CBd7a695"
+        "0x56B167deCD5fC4E3Bbc07B3B4e1F30e74534F9dd"
      values.getConfig.signers.17.group:
-        1
+        8
      values.getConfig.signers.16.addr:
-        "0x56B167deCD5fC4E3Bbc07B3B4e1F30e74534F9dd"
+        "0x4e509C60b3e916644dE441298595FeD12C4AC926"
      values.getConfig.signers.16.group:
-        8
+        1
      values.getConfig.signers.15.addr:
-        "0x4e509C60b3e916644dE441298595FeD12C4AC926"
+        "0x48A094F7A354d8faD7263EA2a82391d105DF6628"
      values.getConfig.signers.15.group:
-        1
+        3
      values.getConfig.signers.14.addr:
-        "0x48A094F7A354d8faD7263EA2a82391d105DF6628"
+        "0x480496c0884D61F2f56707Adb11697F8018898c2"
      values.getConfig.signers.14.group:
-        3
+        10
      values.getConfig.signers.13.addr:
-        "0x480496c0884D61F2f56707Adb11697F8018898c2"
+        "0x43640F208956c7D49e04F40FF95dF818643B76aA"
      values.getConfig.signers.13.group:
-        10
+        1
      values.getConfig.signers.12.addr:
-        "0x43640F208956c7D49e04F40FF95dF818643B76aA"
+        "0x41eAdbc688797a02bfaBE48472995833489ce69D"
      values.getConfig.signers.12.group:
-        1
+        10
      values.getConfig.signers.11.addr:
-        "0x41eAdbc688797a02bfaBE48472995833489ce69D"
+        "0x3C6cE61b611e3b41289c2FAFA5BC4e150dD88dE3"
      values.getConfig.signers.11.group:
-        10
+        3
      values.getConfig.signers.10.addr:
-        "0x3C6cE61b611e3b41289c2FAFA5BC4e150dD88dE3"
+        "0x36FdBDA6085d4DFA63Da90839432dDe9373970F0"
      values.getConfig.signers.10.group:
-        3
+        11
      values.getConfig.signers.9.addr:
-        "0x36FdBDA6085d4DFA63Da90839432dDe9373970F0"
+        "0x2bbB172cD88dCAD64CBE762dcC53E6f96a17d1D6"
      values.getConfig.signers.9.group:
-        11
+        1
      values.getConfig.signers.8.addr:
-        "0x2bbB172cD88dCAD64CBE762dcC53E6f96a17d1D6"
+        "0x2B88575011C5E11389ddB50D28d31C7d06B352A0"
      values.getConfig.signers.7.addr:
-        "0x2B88575011C5E11389ddB50D28d31C7d06B352A0"
+        "0x2b73763722378AB2013CB0877946f69fC3727Fd8"
      values.getConfig.signers.7.group:
-        1
+        4
      values.getConfig.signers.6.addr:
-        "0x2b73763722378AB2013CB0877946f69fC3727Fd8"
+        "0x21Ac2a1d6ee437FB11a6F1933C5D1d22c714B922"
      values.getConfig.signers.6.group:
-        4
+        12
      values.getConfig.signers.5.addr:
-        "0x21Ac2a1d6ee437FB11a6F1933C5D1d22c714B922"
+        "0x1c6460cfe32916196f6977b5442b0F98A826D880"
      values.getConfig.signers.5.group:
-        12
+        11
      values.getConfig.signers.4.addr:
-        "0x1c6460cfe32916196f6977b5442b0F98A826D880"
+        "0x180159135c9b93C59d16eA1A690e465D22c5EB67"
      values.getConfig.signers.4.group:
-        11
+        5
      values.getConfig.signers.3.addr:
-        "0x180159135c9b93C59d16eA1A690e465D22c5EB67"
+        "0x14a8f3B302Bbfa7F2f2AC2F4515548370bc7bAdC"
      values.getConfig.signers.3.group:
-        5
+        8
      values.getConfig.signers.2.addr:
-        "0x14a8f3B302Bbfa7F2f2AC2F4515548370bc7bAdC"
+        "0x146CAe49Dbe1b1D1968fc4652814740706548952"
      values.getConfig.signers.2.group:
-        8
+        1
    }
```

```diff
    contract ManyChainMultiSig (0xa8D5E1daA6D8B94f11D77B7E09DE846292ef69FF) {
    +++ description: None
      values.getConfig.signers.5.addr:
-        "0xa2E004594939e2Dd4cBb680536576f6d5B435077"
+        "0xA34aAf7a569504E73a12566121f890B1DFE5146d"
      values.getConfig.signers.4.addr:
-        "0x6F9dc914D7E124FF68c8618CC3C00b17B15F9b4C"
+        "0xa2E004594939e2Dd4cBb680536576f6d5B435077"
      values.getConfig.signers.3.addr:
-        "0x2E3f1E5A392366975A99744f95d06C28225b1e32"
+        "0x6F9dc914D7E124FF68c8618CC3C00b17B15F9b4C"
    }
```

```diff
    contract ManyChainMultiSig (0xAD97C0270a243270136E40278155C12ce7C7F87B) {
    +++ description: None
      values.getConfig.signers.24:
+        {"addr":"0xd3E2da792E806556517124f03F12e557045951E7","index":24,"group":6}
      values.getConfig.signers.23.addr:
-        "0xd3E2da792E806556517124f03F12e557045951E7"
+        "0xd3094f770579AFd66711847cE9E9C42D10BA2264"
      values.getConfig.signers.23.group:
-        6
+        4
      values.getConfig.signers.22.addr:
-        "0xd3094f770579AFd66711847cE9E9C42D10BA2264"
+        "0xc90788d9168f83dec518Ab7c0445Ad1Ec53554D7"
      values.getConfig.signers.22.group:
-        4
+        5
      values.getConfig.signers.21.addr:
-        "0xc90788d9168f83dec518Ab7c0445Ad1Ec53554D7"
+        "0xa35B7219521134cAF52DccAD44d604335b64a4fB"
      values.getConfig.signers.21.group:
-        5
+        4
      values.getConfig.signers.20.addr:
-        "0xa35B7219521134cAF52DccAD44d604335b64a4fB"
+        "0xA3177f64efE98422E782bC17BE7971F01187B7cF"
      values.getConfig.signers.20.group:
-        4
+        1
      values.getConfig.signers.19.addr:
-        "0xA3177f64efE98422E782bC17BE7971F01187B7cF"
+        "0x9453E18f03A36E2A2c70598De520bD24434D2d1D"
      values.getConfig.signers.19.group:
-        1
+        6
      values.getConfig.signers.18.addr:
-        "0x9453E18f03A36E2A2c70598De520bD24434D2d1D"
+        "0x925d7Ea0ADe586DBFd56a942bb297286cE428C79"
      values.getConfig.signers.18.group:
-        6
+        1
      values.getConfig.signers.17.addr:
-        "0x925d7Ea0ADe586DBFd56a942bb297286cE428C79"
+        "0x9079410666ED02725ee9d148398Cee26397c2A36"
      values.getConfig.signers.16.addr:
-        "0x9079410666ED02725ee9d148398Cee26397c2A36"
+        "0x7eFF312905DEdB38Bf8f07BEFaDfF96376154374"
      values.getConfig.signers.16.group:
-        1
+        5
      values.getConfig.signers.15.addr:
-        "0x7eFF312905DEdB38Bf8f07BEFaDfF96376154374"
+        "0x70C2Ddc97c4fAea760027d45E5de4D1E2ad2b9A5"
      values.getConfig.signers.15.group:
-        5
+        6
      values.getConfig.signers.14.addr:
-        "0x70C2Ddc97c4fAea760027d45E5de4D1E2ad2b9A5"
+        "0x6B0f508B8cbeF970fAF9E8a28b9b4C6F1FD3afae"
      values.getConfig.signers.14.group:
-        6
+        7
      values.getConfig.signers.13.addr:
-        "0x6B0f508B8cbeF970fAF9E8a28b9b4C6F1FD3afae"
+        "0x6924E54339C7f28730dBB4B842a7FE86ED01Ecf7"
      values.getConfig.signers.13.group:
-        7
+        1
      values.getConfig.signers.12.addr:
-        "0x6924E54339C7f28730dBB4B842a7FE86ED01Ecf7"
+        "0x5C33Bf560f29e04dF8A666493aAD8E47eEa9B1c8"
      values.getConfig.signers.12.group:
-        1
+        2
      values.getConfig.signers.11.addr:
-        "0x5C33Bf560f29e04dF8A666493aAD8E47eEa9B1c8"
+        "0x5bD3a90E94bB8aA6fE6cCF494e292F5F707B92d6"
      values.getConfig.signers.10.addr:
-        "0x5bD3a90E94bB8aA6fE6cCF494e292F5F707B92d6"
+        "0x570F41d83b1031d382F641B9a532A8D7CBd7a695"
      values.getConfig.signers.10.group:
-        2
+        1
      values.getConfig.signers.9.addr:
-        "0x570F41d83b1031d382F641B9a532A8D7CBd7a695"
+        "0x4e509C60b3e916644dE441298595FeD12C4AC926"
      values.getConfig.signers.8.addr:
-        "0x4e509C60b3e916644dE441298595FeD12C4AC926"
+        "0x48A094F7A354d8faD7263EA2a82391d105DF6628"
      values.getConfig.signers.8.group:
-        1
+        3
      values.getConfig.signers.7.addr:
-        "0x48A094F7A354d8faD7263EA2a82391d105DF6628"
+        "0x43640F208956c7D49e04F40FF95dF818643B76aA"
      values.getConfig.signers.7.group:
-        3
+        1
      values.getConfig.signers.6.addr:
-        "0x43640F208956c7D49e04F40FF95dF818643B76aA"
+        "0x3C6cE61b611e3b41289c2FAFA5BC4e150dD88dE3"
      values.getConfig.signers.6.group:
-        1
+        3
      values.getConfig.signers.5.addr:
-        "0x3C6cE61b611e3b41289c2FAFA5BC4e150dD88dE3"
+        "0x2bbB172cD88dCAD64CBE762dcC53E6f96a17d1D6"
      values.getConfig.signers.5.group:
-        3
+        1
      values.getConfig.signers.4.addr:
-        "0x2bbB172cD88dCAD64CBE762dcC53E6f96a17d1D6"
+        "0x2B88575011C5E11389ddB50D28d31C7d06B352A0"
      values.getConfig.signers.3.addr:
-        "0x2B88575011C5E11389ddB50D28d31C7d06B352A0"
+        "0x2b73763722378AB2013CB0877946f69fC3727Fd8"
      values.getConfig.signers.3.group:
-        1
+        4
      values.getConfig.signers.2.addr:
-        "0x2b73763722378AB2013CB0877946f69fC3727Fd8"
+        "0x180159135c9b93C59d16eA1A690e465D22c5EB67"
      values.getConfig.signers.2.group:
-        4
+        5
      values.getConfig.signers.1.addr:
-        "0x180159135c9b93C59d16eA1A690e465D22c5EB67"
+        "0x146CAe49Dbe1b1D1968fc4652814740706548952"
      values.getConfig.signers.1.group:
-        5
+        1
    }
```

Generated with discovered.json: 0x045bfbcc216538e060f69144287dd96181b4ce0e

# Diff at Thu, 26 Sep 2024 11:49:41 GMT:

- author: sekuba (<sekuba@users.noreply.github.com>)
- comparing to: main@374d77799a44e3b2fcc4828675ccc0b0ff6146d0 block: 20769260
- current block number: 20834586

## Description

New (unknown) supported chain added, new arm-related contracts. Added shape based discovery.

## Watched changes

```diff
    contract BurnMintTokenPool (0x057152DB365B47851B0A0bd431644b8eE21fE1b4) {
    +++ description: None
      values.getOffRamps.3:
-        "0xB095900fB91db00E6abD247A5A5AD1cee3F20BF7"
      values.getOffRamps.2:
-        "0xBDd822f3bC2EAB6818CfA3053107831D4E93fE72"
      values.getOffRamps.1:
-        "0x1C207dabc46902dF9028b27D6d301c3849b2D12c"
+        "0xB095900fB91db00E6abD247A5A5AD1cee3F20BF7"
    }
```

```diff
    contract Router (0x80226fc0Ee2b096224EeAc085Bb9a8cba1146f7D) {
    +++ description: None
      values.offRamps.14:
+        {"sourceChainSelector":"13204309965629103672","offRamp":"0x26a10137A54F4Ea01D20758Ac5AdBf9326340Fc3"}
      values.offRamps.13:
+        {"sourceChainSelector":"4627098889531055414","offRamp":"0x418dcbCf229897d0CCf1B8B464Db06C23879FBB4"}
      values.onRamps.4627098889531055414:
+        "0x626189C882A80fF0D036d8D9f6447555e81F78E9"
      values.onRamps.13204309965629103672:
+        "0x362A221C3cfd7F992DFE221687323F0BA9BA8187"
    }
```

```diff
    contract BurnMintTokenPool (0x80Cc104119901fd66088C9a8219E50D9547dE2d4) {
    +++ description: None
      values.getSupportedChains.3:
+        "15971525489660198786"
    }
```

```diff
    contract PriceRegistry (0x8c9b2Efb7c64C394119270bfecE7f54763b958Ad) {
    +++ description: None
      values.getPriceUpdaters.14:
+        "0x9f592c28590595F3F78a8881E8Dbb9984ed705cD"
      values.getPriceUpdaters.13:
+        "0x57d6cD9CD44770C807b2763Dbe4CFDA0113dd114"
    }
```

```diff
    contract BurnMintTokenPool (0xd8f734c938200BA294d0De5B555E8ff77d66c351) {
    +++ description: None
      values.getSupportedChains.3:
+        "15971525489660198786"
    }
```

```diff
    contract BurnMintTokenPool (0xf0D19c04f04382048fC9ad157C529CeB2c7be823) {
    +++ description: None
      values.getOffRamps.7:
-        "0xeFC4a18af59398FF23bfe7325F2401aD44286F4d"
      values.getOffRamps.6:
-        "0x7Afe7088aff57173565F4b034167643AA8b9171c"
      values.getOffRamps.5:
-        "0x569940e02D4425eac61A7601632eC00d69f75c17"
      values.getOffRamps.4:
-        "0x0af338F0E314c7551bcE0EF516d46d855b0Ee395"
    }
```

```diff
+   Status: CREATED
    contract EVM2EVMOffRamp (0x26a10137A54F4Ea01D20758Ac5AdBf9326340Fc3)
    +++ description: None
```

```diff
+   Status: CREATED
    contract EVM2EVMOnRamp (0x362A221C3cfd7F992DFE221687323F0BA9BA8187)
    +++ description: None
```

```diff
+   Status: CREATED
    contract EVM2EVMOffRamp (0x418dcbCf229897d0CCf1B8B464Db06C23879FBB4)
    +++ description: None
```

```diff
+   Status: CREATED
    contract CommitStore (0x57d6cD9CD44770C807b2763Dbe4CFDA0113dd114)
    +++ description: None
```

```diff
+   Status: CREATED
    contract EVM2EVMOnRamp (0x626189C882A80fF0D036d8D9f6447555e81F78E9)
    +++ description: None
```

```diff
+   Status: CREATED
    contract CommitStore (0x9f592c28590595F3F78a8881E8Dbb9984ed705cD)
    +++ description: None
```

```diff
+   Status: CREATED
    contract TokenAdminRegistry (0xb22764f98dD05c789929716D677382Df22C05Cb6)
    +++ description: None
```

## Source code changes

```diff
...-0x57d6cD9CD44770C807b2763Dbe4CFDA0113dd114.sol | 1297 ++++++++
 ...-0x9f592c28590595F3F78a8881E8Dbb9984ed705cD.sol | 1297 ++++++++
 ...-0x26a10137A54F4Ea01D20758Ac5AdBf9326340Fc3.sol | 3430 ++++++++++++++++++++
 ...-0x418dcbCf229897d0CCf1B8B464Db06C23879FBB4.sol | 3430 ++++++++++++++++++++
 ...-0x362A221C3cfd7F992DFE221687323F0BA9BA8187.sol | 2982 +++++++++++++++++
 ...-0x626189C882A80fF0D036d8D9f6447555e81F78E9.sol | 2982 +++++++++++++++++
 .../ethereum/.flat/TokenAdminRegistry.sol          |  640 ++++
 7 files changed, 16058 insertions(+)
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20769260 (main branch discovery), not current.

```diff
    contract EVM2EVMOffRamp (0x0af338F0E314c7551bcE0EF516d46d855b0Ee395) {
    +++ description: None
      name:
-        "OffRamp7"
+        "EVM2EVMOffRamp"
      template:
-        "transporter/OffRamp"
+        "transporter/OffRampV1"
    }
```

```diff
    contract EVM2EVMOnRamp (0x0f27c8532457b66D6037141DEB0ed479Dad04B3c) {
    +++ description: None
      name:
-        "OnRamp11"
+        "EVM2EVMOnRamp"
    }
```

```diff
    contract CommitStore (0x118a9389960F86390A4F14ce4C95D6ff076C6bFC) {
    +++ description: None
      name:
-        "CommitStore2"
+        "CommitStore"
      template:
-        "transporter/CommitStore"
+        "transporter/CommitStoreV1"
    }
```

```diff
    contract EVM2EVMOffRamp (0x1a904DbbaDdE629a1460e2F6E2E485Ce06Ed7599) {
    +++ description: None
      template:
-        "transporter/OffRamp"
+        "transporter/OffRampV1"
    }
```

```diff
    contract EVM2EVMOffRamp (0x1C207dabc46902dF9028b27D6d301c3849b2D12c) {
    +++ description: None
      name:
-        "OffRamp10"
+        "EVM2EVMOffRamp"
      template:
-        "transporter/OffRamp"
+        "transporter/OffRampV1"
    }
```

```diff
    contract CommitStore (0x20718EfbC25Dba60FD51c2c81362b83f7C411A6D) {
    +++ description: None
      name:
-        "CommitStore11"
+        "CommitStore"
      template:
-        "transporter/CommitStore"
+        "transporter/CommitStoreV1"
    }
```

```diff
    contract CommitStore (0x2aa101BF99CaeF7fc1355D4c493a1fe187A007cE) {
    +++ description: None
      name:
-        "CommitStore5"
+        "CommitStore"
      template:
-        "transporter/CommitStore"
+        "transporter/CommitStoreV1"
    }
```

```diff
    contract CommitStore (0x2D1708ff2a15adbE313eA8C6035aA24d0FBA1c77) {
    +++ description: None
      name:
-        "CommitStore14"
+        "CommitStore"
      template:
-        "transporter/CommitStore"
+        "transporter/CommitStoreV1"
    }
```

```diff
    contract CommitStore1 (0x31f6ab382DDeb9A316Ab61C3945a5292a50a89AB) {
    +++ description: None
      template:
-        "transporter/CommitStore"
+        "transporter/CommitStoreV1"
    }
```

```diff
    contract EVM2EVMOnRamp (0x333f976915195ba9044fD0cd603cEcE936f6264e) {
    +++ description: None
      name:
-        "OnRamp12"
+        "EVM2EVMOnRamp"
    }
```

```diff
    contract EVM2EVMOnRamp (0x35F0ca9Be776E4B38659944c257bDd0ba75F1B8B) {
    +++ description: None
      name:
-        "OnRamp2"
+        "EVM2EVMOnRamp"
      template:
-        "transporter/OnRamp"
+        "transporter/OnRampV1"
    }
```

```diff
    contract OffRamp1 (0x3a129e6C18b23d18BA9E6Aa14Dc2e79d1f91c6c5) {
    +++ description: None
      template:
-        "transporter/OffRamp"
+        "transporter/OffRampV1"
    }
```

```diff
    contract CommitStore (0x3CB2A81bb8a188C5353CdFa9994ed8666556FC53) {
    +++ description: None
      template:
-        "transporter/CommitStore"
+        "transporter/CommitStoreV1"
    }
```

```diff
    contract CommitStore (0x3d3467e1036Ee25F6F4aa15e3Abf77443A23144C) {
    +++ description: None
      name:
-        "CommitStore12"
+        "CommitStore"
      template:
-        "transporter/CommitStore"
+        "transporter/CommitStoreV1"
    }
```

```diff
    contract CommitStore (0x3d8a95adA63D406ee8232562AbD83CEdb0B90466) {
    +++ description: None
      template:
-        "transporter/CommitStore"
+        "transporter/CommitStoreV1"
    }
```

```diff
    contract EVM2EVMOnRamp (0x3df8dAe2d123081c4D5E946E655F7c109B9Dd630) {
    +++ description: None
      name:
-        "OnRamp4"
+        "EVM2EVMOnRamp"
      template:
-        "transporter/OnRamp"
+        "transporter/OnRampV1"
    }
```

```diff
    contract CommitStore (0x40c558575093eC1099CC21B020d9b8D13c74417F) {
    +++ description: None
      name:
-        "CommitStore10"
+        "CommitStore"
      template:
-        "transporter/CommitStore"
+        "transporter/CommitStoreV1"
    }
```

```diff
    contract EVM2EVMOffRamp (0x41627a90f2c6238f2BADAB72D5aB050B857fdAb5) {
    +++ description: None
      name:
-        "OffRamp9"
+        "EVM2EVMOffRamp"
      template:
-        "transporter/OffRamp"
+        "transporter/OffRampV1"
    }
```

```diff
    contract EVM2EVMOnRamp (0x4545F9a17DA50110632C14704a15d893BF9CBD27) {
    +++ description: None
      template:
-        "transporter/OnRamp"
+        "transporter/OnRampV1"
    }
```

```diff
    contract EVM2EVMOnRamp (0x466a078d17e3706a9414ACc48029EE9Bae4C9b65) {
    +++ description: None
      template:
-        "transporter/OnRamp"
+        "transporter/OnRampV1"
    }
```

```diff
    contract CommitStore (0x4af4B497c998007eF83ad130318eB2b925a79dc8) {
    +++ description: None
      name:
-        "CommitStore4"
+        "CommitStore"
      template:
-        "transporter/CommitStore"
+        "transporter/CommitStoreV1"
    }
```

```diff
    contract EVM2EVMOffRamp (0x569940e02D4425eac61A7601632eC00d69f75c17) {
    +++ description: None
      name:
-        "OffRamp5"
+        "EVM2EVMOffRamp"
      template:
-        "transporter/OffRamp"
+        "transporter/OffRampV1"
    }
```

```diff
    contract EVM2EVMOffRamp (0x61135E701a2214C170c5F596D0067798FEfbaaE4) {
    +++ description: None
      name:
-        "OffRamp12"
+        "EVM2EVMOffRamp"
      template:
-        "transporter/OffRamp"
+        "transporter/OffRampV1"
    }
```

```diff
    contract CommitStore (0x76264869a3eBF51a59FCa5ABa84ee2867c7F190e) {
    +++ description: None
      template:
-        "transporter/CommitStore"
+        "transporter/CommitStoreV1"
    }
```

```diff
    contract CommitStore (0x7986C9892389854cAAbAC785ff18123B0070a5Fd) {
    +++ description: None
      name:
-        "CommitStore13"
+        "CommitStore"
      template:
-        "transporter/CommitStore"
+        "transporter/CommitStoreV1"
    }
```

```diff
    contract EVM2EVMOffRamp (0x7Afe7088aff57173565F4b034167643AA8b9171c) {
    +++ description: None
      name:
-        "OffRamp3"
+        "EVM2EVMOffRamp"
      template:
-        "transporter/OffRamp"
+        "transporter/OffRampV1"
    }
```

```diff
    contract Router (0x80226fc0Ee2b096224EeAc085Bb9a8cba1146f7D) {
    +++ description: None
      template:
-        "transporter/Router"
+        "transporter/RouterV1_2_0"
    }
```

```diff
    contract CommitStore (0x831097033C88c82a7F1897b168Aa88cC44540C8f) {
    +++ description: None
      template:
-        "transporter/CommitStore"
+        "transporter/CommitStoreV1"
    }
```

```diff
    contract OnRamp1 (0x86B47d8411006874eEf8E4584BdFD7be8e5549d1) {
    +++ description: None
      template:
-        "transporter/OnRamp"
+        "transporter/OnRampV1"
    }
```

```diff
    contract CommitStore (0x87c55D48DF6EF7B08153Ab079e76bFEcbb793D75) {
    +++ description: None
      name:
-        "CommitStore3"
+        "CommitStore"
      template:
-        "transporter/CommitStore"
+        "transporter/CommitStoreV1"
    }
```

```diff
    contract CommitStore (0x8bEFCa744c6f2b567b1863dcF055C593afdC11A0) {
    +++ description: None
      name:
-        "CommitStore9"
+        "CommitStore"
      template:
-        "transporter/CommitStore"
+        "transporter/CommitStoreV1"
    }
```

```diff
    contract CommitStore (0x8DC27D621c41a32140e22E2a4dAf1259639BAe04) {
    +++ description: None
      name:
-        "CommitStore6"
+        "CommitStore"
      template:
-        "transporter/CommitStore"
+        "transporter/CommitStoreV1"
    }
```

```diff
    contract EVM2EVMOnRamp (0x91D25A56Db77aD5147437d8B83Eb563D46eBFa69) {
    +++ description: None
      name:
-        "OnRamp5"
+        "EVM2EVMOnRamp"
      template:
-        "transporter/OnRamp"
+        "transporter/OnRampV1"
    }
```

```diff
    contract EVM2EVMOnRamp (0x925228D7B82d883Dde340A55Fe8e6dA56244A22C) {
    +++ description: None
      name:
-        "OnRamp3"
+        "EVM2EVMOnRamp"
      template:
-        "transporter/OnRamp"
+        "transporter/OnRampV1"
    }
```

```diff
    contract CommitStore (0x9B2EEd6A1e16cB50Ed4c876D2dD69468B21b7749) {
    +++ description: None
      name:
-        "CommitStore8"
+        "CommitStore"
      template:
-        "transporter/CommitStore"
+        "transporter/CommitStoreV1"
    }
```

```diff
    contract CommitStore (0xa4d264470a67D9f6682EE12Bdc9c35Df44e3F194) {
    +++ description: None
      name:
-        "CommitStore15"
+        "CommitStore"
      template:
-        "transporter/CommitStore"
+        "transporter/CommitStoreV1"
    }
```

```diff
    contract EVM2EVMOnRamp (0xa5ef33B57dD8B653F9A9EA7114f46376d18264aC) {
    +++ description: None
      template:
-        "transporter/OnRamp"
+        "transporter/OnRampV1"
    }
```

```diff
    contract EVM2EVMOffRamp (0xB095900fB91db00E6abD247A5A5AD1cee3F20BF7) {
    +++ description: None
      name:
-        "OffRamp4"
+        "EVM2EVMOffRamp"
      template:
-        "transporter/OffRamp"
+        "transporter/OffRampV1"
    }
```

```diff
    contract EVM2EVMOffRamp (0xb368c8946D9fa5A497cDe1Dff7213f9CdfD143Bf) {
    +++ description: None
      name:
-        "OffRamp15"
+        "EVM2EVMOffRamp"
      template:
-        "transporter/OffRamp"
+        "transporter/OffRampV1"
    }
```

```diff
    contract EVM2EVMOffRamp (0xBDd822f3bC2EAB6818CfA3053107831D4E93fE72) {
    +++ description: None
      name:
-        "OffRamp11"
+        "EVM2EVMOffRamp"
      template:
-        "transporter/OffRamp"
+        "transporter/OffRampV1"
    }
```

```diff
    contract EVM2EVMOffRamp (0xC7176620daf49A39a17FF9A6C2DE1eAA6033EE94) {
    +++ description: None
      name:
-        "OffRamp13"
+        "EVM2EVMOffRamp"
      template:
-        "transporter/OffRamp"
+        "transporter/OffRampV1"
    }
```

```diff
    contract EVM2EVMOnRamp (0xCbE7e5DA76dC99Ac317adF6d99137005FDA4E2C4) {
    +++ description: None
      name:
-        "OnRamp7"
+        "EVM2EVMOnRamp"
      template:
-        "transporter/OnRamp"
+        "transporter/OnRampV1"
    }
```

```diff
    contract EVM2EVMOnRamp (0xCC19bC4D43d17eB6859F0d22BA300967C97780b0) {
    +++ description: None
      name:
-        "OnRamp9"
+        "EVM2EVMOnRamp"
    }
```

```diff
    contract EVM2EVMOffRamp (0xCe6364dBe64D2789D916180131fAda2ABFF702E8) {
    +++ description: None
      template:
-        "transporter/OffRamp"
+        "transporter/OffRampV1"
    }
```

```diff
    contract EVM2EVMOnRamp (0xd0B5Fc9790a6085b048b8Aa1ED26ca2b3b282CF2) {
    +++ description: None
      name:
-        "OnRamp10"
+        "EVM2EVMOnRamp"
    }
```

```diff
    contract CommitStore (0xD37a60E8C36E802D2E1a6321832Ee85556Beeb76) {
    +++ description: None
      name:
-        "CommitStore7"
+        "CommitStore"
      template:
-        "transporter/CommitStore"
+        "transporter/CommitStoreV1"
    }
```

```diff
    contract EVM2EVMOffRamp (0xd5083684eE92dDeA117636ae5E2F1cb7fE4dfd46) {
    +++ description: None
      template:
-        "transporter/OffRamp"
+        "transporter/OffRampV1"
    }
```

```diff
    contract EVM2EVMOnRamp (0xD54C93A99CBCb8D865E13DA321B540171795A89f) {
    +++ description: None
      template:
-        "transporter/OnRamp"
+        "transporter/OnRampV1"
    }
```

```diff
    contract EVM2EVMOnRamp (0xdF1d7FD22aC3aB5171E275796f123224039f3b24) {
    +++ description: None
      name:
-        "OnRamp13"
+        "EVM2EVMOnRamp"
    }
```

```diff
    contract EVM2EVMOffRamp (0xdf85c8381954694E74abD07488f452b4c2Cddfb3) {
    +++ description: None
      name:
-        "OffRamp6"
+        "EVM2EVMOffRamp"
      template:
-        "transporter/OffRamp"
+        "transporter/OffRampV1"
    }
```

```diff
    contract EVM2EVMOnRamp (0xe2c2AB221AA0b957805f229d2AA57fBE2f4dADf7) {
    +++ description: None
      name:
-        "OnRamp6"
+        "EVM2EVMOnRamp"
      template:
-        "transporter/OnRamp"
+        "transporter/OnRampV1"
    }
```

```diff
    contract EVM2EVMOnRamp (0xe2Eb229e88F56691e96bb98256707Bc62160FE73) {
    +++ description: None
      name:
-        "OnRamp14"
+        "EVM2EVMOnRamp"
    }
```

```diff
    contract RouterOld (0xE561d5E02207fb5eB32cca20a699E0d8919a1476) {
    +++ description: None
      name:
-        "Router2"
+        "RouterOld"
      template:
-        "transporter/RouterV2"
+        "transporter/RouterV1_0_0"
    }
```

```diff
    contract EVM2EVMOffRamp (0xE8af3b68eDfFf65Ce48648009982380701f09B92) {
    +++ description: None
      template:
-        "transporter/OffRamp"
+        "transporter/OffRampV1"
    }
```

```diff
    contract EVM2EVMOffRamp (0xE93ec2A57e38C8541c893348cCafEAB01F7D47d4) {
    +++ description: None
      name:
-        "OffRamp2"
+        "EVM2EVMOffRamp"
      template:
-        "transporter/OffRamp"
+        "transporter/OffRampV1"
    }
```

```diff
    contract EVM2EVMOnRamp (0xEd5bE9508ae56531cc0EDe6A3bD588Eb9E2e3cfa) {
    +++ description: None
      template:
-        "transporter/OnRamp"
+        "transporter/OnRampV1"
    }
```

```diff
    contract EVM2EVMOffRamp (0xeFC4a18af59398FF23bfe7325F2401aD44286F4d) {
    +++ description: None
      name:
-        "OffRamp8"
+        "EVM2EVMOffRamp"
      template:
-        "transporter/OffRamp"
+        "transporter/OffRampV1"
    }
```

```diff
    contract EVM2EVMOnRamp (0xF538dA6c673A30338269655f4e019B71ba58CFd4) {
    +++ description: None
      name:
-        "OnRamp8"
+        "EVM2EVMOnRamp"
      template:
-        "transporter/OnRamp"
+        "transporter/OnRampV1"
    }
```

```diff
    contract EVM2EVMOffRamp (0xfF51C00546AA3d9051a4B96Ae81346E14709CD24) {
    +++ description: None
      name:
-        "OffRamp14"
+        "EVM2EVMOffRamp"
      template:
-        "transporter/OffRamp"
+        "transporter/OffRampV1"
    }
```

Generated with discovered.json: 0x3d51ed0e555f35d54a152ced044fd6320a96f883

# Diff at Tue, 17 Sep 2024 08:54:01 GMT:

- author: vincfurc (<10850139+vincfurc@users.noreply.github.com>)
- comparing to: main@42b8cd22e0127dd1f4c91ae6676145120f15e80f block: 20725912
- current block number: 20769260

## Description

Changed ARM Proxy: Renaming of ARM -> RMN. New version: RMN 1.5.0, including a new granular cursing check feature and other minor updates: isCursed() will check for a curse of the local chain (called a global curse subject). The isCursed() function can also be used with a bytes32 argument to additionally check the destination chain cursing status before forwarding messages to it.
Also lower timelock delay for upgrades from 1 day (86400s) to 3h (10800s).

## Watched changes

```diff
    contract ARMProxy (0x411dE17f12D1A34ecC7F45f49844626267c75e81) {
    +++ description: None
      values.getARM:
-        "0x8B63b3DE93431C0f756A493644d128134291fA1b"
+        "0xdCD48419bD5Cd9d1b097695F2af4Ee125aADF84F"
    }
```

```diff
    contract RBACTimelock (0x44835bBBA9D40DEDa9b64858095EcFB2693c9449) {
    +++ description: None
      values.getMinDelay:
-        86400
+        10800
    }
```

```diff
-   Status: DELETED
    contract ARM (0x8B63b3DE93431C0f756A493644d128134291fA1b)
    +++ description: None
```

```diff
+   Status: CREATED
    contract RMN (0xdCD48419bD5Cd9d1b097695F2af4Ee125aADF84F)
    +++ description: None
```

## Source code changes

```diff
.../ethereum/.flat@20725912/ARM.sol => /dev/null   |  697 ----------
 .../transporter/ethereum/.flat/RMN.sol             | 1376 ++++++++++++++++++++
 2 files changed, 1376 insertions(+), 697 deletions(-)
```

Generated with discovered.json: 0x814b0f10578cc8ba5cbccc110ca0d5ed9fbc3890

# Diff at Wed, 11 Sep 2024 07:36:12 GMT:

- author: sekuba (<sekuba@users.noreply.github.com>)
- comparing to: main@407590ebfbad0b4f799badc3ad5fce90a7eaed11 block: 20670058
- current block number: 20725912

## Description

New burnMint pool (USDM)

## Watched changes

```diff
+   Status: CREATED
    contract BurnWithFromMintTokenPool (0x66D40E0D2819a2264B2a61f5DD578573B9dedCEc)
    +++ description: None
```

## Source code changes

```diff
.../ethereum/.flat/BurnWithFromMintTokenPool.sol   | 1312 ++++++++++++++++++++
 1 file changed, 1312 insertions(+)
```

Generated with discovered.json: 0x781168431ff8b44676f9132d12dfce75e80e7210

# Diff at Tue, 03 Sep 2024 12:31:46 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@5cfa14fddead70a5165d8b917cf83b9526503ba7 block: 20576820
- current block number: 20670058

## Description

New tokenPools added, automatically shown on the FE.

## Watched changes

```diff
    contract LockReleaseTokenPool (0x21377fe476Fb8587CbAFd47155093597Fa4df45E) {
    +++ description: None
      values.getOffRamps.1:
+        "0xCe6364dBe64D2789D916180131fAda2ABFF702E8"
    }
```

```diff
    contract LockReleaseTokenPool (0x73aEB5ECA03Ad587B8Fdcc2B61f9fb4D2e3D90c1) {
    +++ description: None
      values.getOffRamps.1:
+        "0xCe6364dBe64D2789D916180131fAda2ABFF702E8"
    }
```

```diff
+   Status: CREATED
    contract LockReleaseTokenPool (0x0Bc42675799D0C1efE3CDe64857714ae84f075B4)
    +++ description: None
```

```diff
+   Status: CREATED
    contract BurnMintTokenPool (0x80Cc104119901fd66088C9a8219E50D9547dE2d4)
    +++ description: None
```

```diff
+   Status: CREATED
    contract BurnMintTokenPool (0xBA0E1c1F702D7Ec44a555759517BDBe9f7c824C3)
    +++ description: None
```

```diff
+   Status: CREATED
    contract BurnMintTokenPool (0xd8f734c938200BA294d0De5B555E8ff77d66c351)
    +++ description: None
```

## Source code changes

```diff
...-0x80Cc104119901fd66088C9a8219E50D9547dE2d4.sol |  998 ++++++++++++++
 ...-0xBA0E1c1F702D7Ec44a555759517BDBe9f7c824C3.sol |  998 ++++++++++++++
 ...-0xd8f734c938200BA294d0De5B555E8ff77d66c351.sol |  998 ++++++++++++++
 ...-0x0Bc42675799D0C1efE3CDe64857714ae84f075B4.sol | 1407 ++++++++++++++++++++
 4 files changed, 4401 insertions(+)
```

Generated with discovered.json: 0xd34fe3ef7fde1392d41d136679c79e5d95f12d8e

# Diff at Fri, 23 Aug 2024 09:56:18 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@67597c7d6c810bc726594446890178150240711e block: 20576820
- current block number: 20576820

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20576820 (main branch discovery), not current.

```diff
    contract UpgradeableLockReleaseTokenPool (0x5756880B6a1EAba0175227bf02a7E87c1e02B28C) {
    +++ description: None
      values.$upgradeCount:
+        1
    }
```

Generated with discovered.json: 0x900a1becf6288cb4994a4f86502ce337ea8651ba

# Diff at Wed, 21 Aug 2024 11:53:00 GMT:

- author: vincfurc (<10850139+vincfurc@users.noreply.github.com>)
- comparing to: main@a84e39efa4f1e38eb52ca8ca005fb438919e951f block: 20563543
- current block number: 20576820

## Description

Configurations update. OffchainConfig changed.

## Watched changes

```diff
    contract CommitStore2 (0x118a9389960F86390A4F14ce4C95D6ff076C6bFC) {
    +++ description: None
      values.latestConfigDetails.configCount:
-        7
+        8
      values.latestConfigDetails.blockNumber:
-        19992884
+        20574583
      values.latestConfigDetails.configDigest:
-        "0x0001a5c2251b87652560fb4349f8229e01a1729f3d9bbad8abfb2d67baa7bd31"
+        "0x0001e715ca2f468f73992b74aae8b611559b925318324a0228c35fc5ec68fd4a"
    }
```

```diff
    contract CommitStore1 (0x31f6ab382DDeb9A316Ab61C3945a5292a50a89AB) {
    +++ description: None
      values.latestConfigDetails.configCount:
-        8
+        9
      values.latestConfigDetails.blockNumber:
-        19992872
+        20574569
      values.latestConfigDetails.configDigest:
-        "0x0001a5fb364dc20180c6b3dd2e3ce85a349ddac175a17e46dc3cd325153736be"
+        "0x0001d7dfed79176417f36611718848cc8bab61daa0cf833f837205a32cd982cb"
    }
```

```diff
    contract CommitStore (0x3CB2A81bb8a188C5353CdFa9994ed8666556FC53) {
    +++ description: None
      values.latestConfigDetails.configCount:
-        3
+        4
      values.latestConfigDetails.blockNumber:
-        20398840
+        20574540
      values.latestConfigDetails.configDigest:
-        "0x00011b0feeb79956de5da44165457ab771a1a71a233c41b945038500a5c4356f"
+        "0x0001e9a7260f01e6ae5ae4039c10729defc3439209ff2afdbed77c0aa371690d"
    }
```

```diff
    contract CommitStore (0x3d8a95adA63D406ee8232562AbD83CEdb0B90466) {
    +++ description: None
      values.latestConfigDetails.configCount:
-        4
+        5
      values.latestConfigDetails.blockNumber:
-        20398823
+        20574531
      values.latestConfigDetails.configDigest:
-        "0x00015794577c5ec58b806ca7715e3310c6ffb423253062cd303e02dd3feb8e9b"
+        "0x000158ac6ced3257fc9cee81f906d7cffeb8fab05c7f3882b179326ad6dd9755"
    }
```

```diff
    contract CommitStore4 (0x4af4B497c998007eF83ad130318eB2b925a79dc8) {
    +++ description: None
      values.latestConfigDetails.configCount:
-        8
+        9
      values.latestConfigDetails.blockNumber:
-        19992870
+        20574559
      values.latestConfigDetails.configDigest:
-        "0x0001e913beffb46fc6e567324b90592e032e4890b9f8368fa9227350b3d5803a"
+        "0x00019ecf28229bd3f6e536b5a820a6c81e638b7904b4e3129d59624d5cd44e3d"
    }
```

```diff
    contract CommitStore (0x76264869a3eBF51a59FCa5ABa84ee2867c7F190e) {
    +++ description: None
      values.latestConfigDetails.configCount:
-        3
+        4
      values.latestConfigDetails.blockNumber:
-        20493806
+        20574549
      values.latestConfigDetails.configDigest:
-        "0x0001b1cfe8bb04fc64f8a2eaea578f95d8c80b17319e793a0beca378d0833dde"
+        "0x00012da522c4eb868a6396e5a3f26b12e29d3a68935341a418f613954fb6b34e"
    }
```

```diff
    contract CommitStore (0x831097033C88c82a7F1897b168Aa88cC44540C8f) {
    +++ description: None
      values.latestConfigDetails.configCount:
-        5
+        6
      values.latestConfigDetails.blockNumber:
-        19992835
+        20574530
      values.latestConfigDetails.configDigest:
-        "0x000179263a4a130df5e4be4d20e7eb032024c3eb8e72d99093e09d089598c58a"
+        "0x0001163bb8e5e2a1be39c086ff1c53c480b69f5c1fa89bdef5655886551d5eea"
    }
```

```diff
    contract CommitStore3 (0x87c55D48DF6EF7B08153Ab079e76bFEcbb793D75) {
    +++ description: None
      values.latestConfigDetails.configCount:
-        8
+        9
      values.latestConfigDetails.blockNumber:
-        19992834
+        20574522
      values.latestConfigDetails.configDigest:
-        "0x0001e5962ef720d1edb8a8e5cc3e267a8a6479748b6709f835e93bfe8fb28d41"
+        "0x0001e56a75372f894c177787f2df78efd743286c7420d76047d9ef113e36b21f"
    }
```

```diff
    contract CommitStore6 (0x8DC27D621c41a32140e22E2a4dAf1259639BAe04) {
    +++ description: None
      values.latestConfigDetails.configCount:
-        8
+        9
      values.latestConfigDetails.blockNumber:
-        19992869
+        20574539
      values.latestConfigDetails.configDigest:
-        "0x000173258584964bd15f9876bea21f3bfc961c025ad5b3e4356ae918393e3874"
+        "0x0001aca19ca6472b325da7ddcbfd76c8d2efd743b89fe3e010e38f791194de04"
    }
```

```diff
    contract CommitStore8 (0x9B2EEd6A1e16cB50Ed4c876D2dD69468B21b7749) {
    +++ description: None
      values.latestConfigDetails.configCount:
-        8
+        9
      values.latestConfigDetails.blockNumber:
-        19992851
+        20574532
      values.latestConfigDetails.configDigest:
-        "0x00016059e453c2ca94d0c2fad2be55e6548b0a0ebb25096b1962a18f9c93a594"
+        "0x0001370e23facc097f2c5f3bca6c9f17d68f1961e5f489ac13d0e7600332c1e1"
    }
```

```diff
    contract CommitStore15 (0xa4d264470a67D9f6682EE12Bdc9c35Df44e3F194) {
    +++ description: None
      values.latestConfigDetails.configCount:
-        4
+        5
      values.latestConfigDetails.blockNumber:
-        20421003
+        20574560
      values.latestConfigDetails.configDigest:
-        "0x0001442c239e69bf2461192e40906b14d1d34fc9d2f193127ac07fae2dbb51c7"
+        "0x00018d8d4844a53c3d72bf9c7721684c1f21b6eb6976d0b1b83155181ed84823"
    }
```

```diff
    contract CommitStore7 (0xD37a60E8C36E802D2E1a6321832Ee85556Beeb76) {
    +++ description: None
      values.latestConfigDetails.configCount:
-        7
+        8
      values.latestConfigDetails.blockNumber:
-        19992871
+        20574561
      values.latestConfigDetails.configDigest:
-        "0x0001380ba240289ac40146b431a0dcd60a97af46d941e485e13e776015c51bc0"
+        "0x0001032f669d09a05e36d873e547a3009a05d8b30db4c0bca70564474fa7bf94"
    }
```

Generated with discovered.json: 0x42131931c0d0c0ad4a42dce8b32030af275c9cd4

# Diff at Mon, 19 Aug 2024 15:23:20 GMT:

- author: Radina Talanova (<nt.radina@gmail.com>)
- comparing to: main@5417c4717b5cefeed17cd8419a7eb2dda22d4206 block: 20539694
- current block number: 20563543

## Description

Added support for Mode, Base and BNB Chain on the wUSDx pool. Updated the CommitStore config due OffchainConfig params changes (e.g., MaxQueryLengthBytes, RequestCountLimit).

## Watched changes

```diff
    contract CommitStore5 (0x2aa101BF99CaeF7fc1355D4c493a1fe187A007cE) {
    +++ description: None
      values.latestConfigDetails.configCount:
-        8
+        9
      values.latestConfigDetails.blockNumber:
-        19992818
+        20561894
      values.latestConfigDetails.configDigest:
-        "0x00018c33fe48784c2decbe5572c681bdeb706c4b05c3e1f367dec59d0c4e3780"
+        "0x0001b728806c50675d907f631fb922ee3658492327dfb556b5638ce5ac48a329"
    }
```

```diff
    contract BurnMintTokenPool (0xd72F7010f0Fa621aB0869e61e9bb4e3cC887c66c) {
    +++ description: None
      values.getSupportedChains.4:
+        "15971525489660198786"
      values.getSupportedChains.3:
+        "11344663589394136015"
      values.getSupportedChains.2:
+        "7264351850409363825"
    }
```

Generated with discovered.json: 0x6255d653535af932c7b0ee06b19ba0cf45732392

# Diff at Fri, 16 Aug 2024 07:28:16 GMT:

- author: Radina Talanova (<nt.radina@gmail.com>)
- comparing to: main@7273b1decf2b7a03e4f10ec7b42f94fa80b3c5ba block: 20518122
- current block number: 20539694

## Description

As a summary - two signers were replaced and one new one added. The list with changes is long because signing groups are arranged in a tree. Each group is an interior node and has its own quorum. Signers are the leaves of the tree.

## Watched changes

```diff
    contract ManyChainMultiSig (0x117ec8aD107976e1dBCc21717ff78407Bc36aADc) {
    +++ description: None
      values.getConfig.signers.41.group:
-        7
+        6
      values.getConfig.signers.40.group:
-        5
+        4
      values.getConfig.signers.39.group:
-        6
+        5
      values.getConfig.signers.35.addr:
-        "0xA4dBFFb1da5a05F715c822FCD262dB3E0031f00a"
+        "0xa42c8570771240D1e2F3211064a7C7472Cc05b7D"
      values.getConfig.signers.35.group:
-        2
+        8
      values.getConfig.signers.34.addr:
-        "0xa42c8570771240D1e2F3211064a7C7472Cc05b7D"
+        "0xa35B7219521134cAF52DccAD44d604335b64a4fB"
      values.getConfig.signers.34.group:
-        8
+        4
      values.getConfig.signers.33.addr:
-        "0xa35B7219521134cAF52DccAD44d604335b64a4fB"
+        "0xA3177f64efE98422E782bC17BE7971F01187B7cF"
      values.getConfig.signers.33.group:
-        5
+        1
      values.getConfig.signers.32.addr:
-        "0xA3177f64efE98422E782bC17BE7971F01187B7cF"
+        "0x9E318D85D42F7e5b8B4fb2fB2d706C4c04D1549e"
      values.getConfig.signers.32.group:
-        1
+        12
      values.getConfig.signers.31.addr:
-        "0x9E318D85D42F7e5b8B4fb2fB2d706C4c04D1549e"
+        "0x9d0D65cd6e46B86f88fF021d8f5EE58fe8ce2882"
      values.getConfig.signers.30.addr:
-        "0x9d0D65cd6e46B86f88fF021d8f5EE58fe8ce2882"
+        "0x9453E18f03A36E2A2c70598De520bD24434D2d1D"
      values.getConfig.signers.30.group:
-        12
+        6
      values.getConfig.signers.29.addr:
-        "0x9453E18f03A36E2A2c70598De520bD24434D2d1D"
+        "0x925d7Ea0ADe586DBFd56a942bb297286cE428C79"
      values.getConfig.signers.29.group:
-        7
+        1
      values.getConfig.signers.28.addr:
-        "0x925d7Ea0ADe586DBFd56a942bb297286cE428C79"
+        "0x9079410666ED02725ee9d148398Cee26397c2A36"
      values.getConfig.signers.27.addr:
-        "0x9079410666ED02725ee9d148398Cee26397c2A36"
+        "0x7eFF312905DEdB38Bf8f07BEFaDfF96376154374"
      values.getConfig.signers.27.group:
-        1
+        5
      values.getConfig.signers.26.addr:
-        "0x7eFF312905DEdB38Bf8f07BEFaDfF96376154374"
+        "0x776D5B14ef1D5C58B0d48b53114f2Aa0faccB307"
      values.getConfig.signers.26.group:
-        6
+        11
      values.getConfig.signers.25.addr:
-        "0x7AF3C2b54eE2f170b8104222eB4EDf2511f5d9d0"
+        "0x745B9329ccF53556e3C5f1fD1E4e9D0E91Ad2514"
      values.getConfig.signers.25.group:
-        2
+        11
      values.getConfig.signers.24.addr:
-        "0x745B9329ccF53556e3C5f1fD1E4e9D0E91Ad2514"
+        "0x70C2Ddc97c4fAea760027d45E5de4D1E2ad2b9A5"
      values.getConfig.signers.24.group:
-        11
+        6
      values.getConfig.signers.23.addr:
-        "0x70C2Ddc97c4fAea760027d45E5de4D1E2ad2b9A5"
+        "0x7052cB84079905400ea52B635cAb6a275fDA8823"
      values.getConfig.signers.23.group:
-        7
+        10
      values.getConfig.signers.22.addr:
-        "0x7052cB84079905400ea52B635cAb6a275fDA8823"
+        "0x6bfBf6BC4bc5CD20768dAA6F58f0743bAFf2e5f4"
      values.getConfig.signers.22.group:
-        10
+        8
      values.getConfig.signers.21.addr:
-        "0x6bfBf6BC4bc5CD20768dAA6F58f0743bAFf2e5f4"
+        "0x6B0f508B8cbeF970fAF9E8a28b9b4C6F1FD3afae"
      values.getConfig.signers.21.group:
-        8
+        7
      values.getConfig.signers.20.addr:
-        "0x6B0f508B8cbeF970fAF9E8a28b9b4C6F1FD3afae"
+        "0x6924E54339C7f28730dBB4B842a7FE86ED01Ecf7"
      values.getConfig.signers.19.addr:
-        "0x6924E54339C7f28730dBB4B842a7FE86ED01Ecf7"
+        "0x5C33Bf560f29e04dF8A666493aAD8E47eEa9B1c8"
      values.getConfig.signers.19.group:
-        1
+        2
      values.getConfig.signers.18.addr:
-        "0x5C33Bf560f29e04dF8A666493aAD8E47eEa9B1c8"
+        "0x5bD3a90E94bB8aA6fE6cCF494e292F5F707B92d6"
      values.getConfig.signers.18.group:
-        3
+        2
      values.getConfig.signers.17.addr:
-        "0x5bD3a90E94bB8aA6fE6cCF494e292F5F707B92d6"
+        "0x570F41d83b1031d382F641B9a532A8D7CBd7a695"
      values.getConfig.signers.17.group:
-        3
+        1
      values.getConfig.signers.16.addr:
-        "0x570F41d83b1031d382F641B9a532A8D7CBd7a695"
+        "0x56B167deCD5fC4E3Bbc07B3B4e1F30e74534F9dd"
      values.getConfig.signers.16.group:
-        1
+        8
      values.getConfig.signers.15.addr:
-        "0x56B167deCD5fC4E3Bbc07B3B4e1F30e74534F9dd"
+        "0x4e509C60b3e916644dE441298595FeD12C4AC926"
      values.getConfig.signers.15.group:
-        8
+        1
      values.getConfig.signers.14.addr:
-        "0x4e509C60b3e916644dE441298595FeD12C4AC926"
+        "0x48A094F7A354d8faD7263EA2a82391d105DF6628"
      values.getConfig.signers.14.group:
-        1
+        3
      values.getConfig.signers.13.addr:
-        "0x48A094F7A354d8faD7263EA2a82391d105DF6628"
+        "0x480496c0884D61F2f56707Adb11697F8018898c2"
      values.getConfig.signers.13.group:
-        4
+        10
      values.getConfig.signers.12.addr:
-        "0x480496c0884D61F2f56707Adb11697F8018898c2"
+        "0x43640F208956c7D49e04F40FF95dF818643B76aA"
      values.getConfig.signers.12.group:
-        12
+        1
      values.getConfig.signers.11.addr:
-        "0x43640F208956c7D49e04F40FF95dF818643B76aA"
+        "0x41eAdbc688797a02bfaBE48472995833489ce69D"
      values.getConfig.signers.11.group:
-        1
+        10
      values.getConfig.signers.10.addr:
-        "0x41eAdbc688797a02bfaBE48472995833489ce69D"
+        "0x3C6cE61b611e3b41289c2FAFA5BC4e150dD88dE3"
      values.getConfig.signers.10.group:
-        10
+        3
      values.getConfig.signers.9.addr:
-        "0x3C6cE61b611e3b41289c2FAFA5BC4e150dD88dE3"
+        "0x36FdBDA6085d4DFA63Da90839432dDe9373970F0"
      values.getConfig.signers.9.group:
-        4
+        11
      values.getConfig.signers.8.addr:
-        "0x326377a6B92eC69AcbbFe2De1eB1d7c9008E4C89"
+        "0x2bbB172cD88dCAD64CBE762dcC53E6f96a17d1D6"
      values.getConfig.signers.8.group:
-        10
+        1
      values.getConfig.signers.7.addr:
-        "0x2bbB172cD88dCAD64CBE762dcC53E6f96a17d1D6"
+        "0x2B88575011C5E11389ddB50D28d31C7d06B352A0"
      values.getConfig.signers.6.addr:
-        "0x2B88575011C5E11389ddB50D28d31C7d06B352A0"
+        "0x2b73763722378AB2013CB0877946f69fC3727Fd8"
      values.getConfig.signers.6.group:
-        1
+        4
      values.getConfig.signers.5.addr:
-        "0x2b73763722378AB2013CB0877946f69fC3727Fd8"
+        "0x21Ac2a1d6ee437FB11a6F1933C5D1d22c714B922"
      values.getConfig.signers.5.group:
-        5
+        12
      values.getConfig.signers.4.addr:
-        "0x21Ac2a1d6ee437FB11a6F1933C5D1d22c714B922"
+        "0x1c6460cfe32916196f6977b5442b0F98A826D880"
      values.getConfig.signers.4.group:
-        12
+        11
      values.getConfig.signers.3.addr:
-        "0x1c6460cfe32916196f6977b5442b0F98A826D880"
+        "0x180159135c9b93C59d16eA1A690e465D22c5EB67"
      values.getConfig.signers.3.group:
-        11
+        5
      values.getConfig.signers.2.addr:
-        "0x180159135c9b93C59d16eA1A690e465D22c5EB67"
+        "0x14a8f3B302Bbfa7F2f2AC2F4515548370bc7bAdC"
      values.getConfig.signers.2.group:
-        6
+        8
      values.getConfig.signers.1.addr:
-        "0x14a8f3B302Bbfa7F2f2AC2F4515548370bc7bAdC"
+        "0x124BA7e2188074335A0e9b12B449AD5781A73D60"
      values.getConfig.signers.1.group:
-        8
+        7
    }
```

```diff
    contract ManyChainMultiSig (0xAD97C0270a243270136E40278155C12ce7C7F87B) {
    +++ description: None
      values.getConfig.signers.24:
-        {"addr":"0xd3E2da792E806556517124f03F12e557045951E7","index":24,"group":7}
      values.getConfig.signers.23.addr:
-        "0xd3094f770579AFd66711847cE9E9C42D10BA2264"
+        "0xd3E2da792E806556517124f03F12e557045951E7"
      values.getConfig.signers.23.group:
-        5
+        6
      values.getConfig.signers.22.addr:
-        "0xc90788d9168f83dec518Ab7c0445Ad1Ec53554D7"
+        "0xd3094f770579AFd66711847cE9E9C42D10BA2264"
      values.getConfig.signers.22.group:
-        6
+        4
      values.getConfig.signers.21.addr:
-        "0xA4dBFFb1da5a05F715c822FCD262dB3E0031f00a"
+        "0xc90788d9168f83dec518Ab7c0445Ad1Ec53554D7"
      values.getConfig.signers.21.group:
-        2
+        5
      values.getConfig.signers.20.group:
-        5
+        4
      values.getConfig.signers.18.group:
-        7
+        6
      values.getConfig.signers.15.group:
-        6
+        5
      values.getConfig.signers.14.addr:
-        "0x7AF3C2b54eE2f170b8104222eB4EDf2511f5d9d0"
+        "0x70C2Ddc97c4fAea760027d45E5de4D1E2ad2b9A5"
      values.getConfig.signers.14.group:
-        2
+        6
      values.getConfig.signers.13.addr:
-        "0x70C2Ddc97c4fAea760027d45E5de4D1E2ad2b9A5"
+        "0x6B0f508B8cbeF970fAF9E8a28b9b4C6F1FD3afae"
      values.getConfig.signers.12.addr:
-        "0x6B0f508B8cbeF970fAF9E8a28b9b4C6F1FD3afae"
+        "0x6924E54339C7f28730dBB4B842a7FE86ED01Ecf7"
      values.getConfig.signers.11.addr:
-        "0x6924E54339C7f28730dBB4B842a7FE86ED01Ecf7"
+        "0x5C33Bf560f29e04dF8A666493aAD8E47eEa9B1c8"
      values.getConfig.signers.11.group:
-        1
+        2
      values.getConfig.signers.10.addr:
-        "0x5C33Bf560f29e04dF8A666493aAD8E47eEa9B1c8"
+        "0x5bD3a90E94bB8aA6fE6cCF494e292F5F707B92d6"
      values.getConfig.signers.10.group:
-        3
+        2
      values.getConfig.signers.9.addr:
-        "0x5bD3a90E94bB8aA6fE6cCF494e292F5F707B92d6"
+        "0x570F41d83b1031d382F641B9a532A8D7CBd7a695"
      values.getConfig.signers.9.group:
-        3
+        1
      values.getConfig.signers.8.addr:
-        "0x570F41d83b1031d382F641B9a532A8D7CBd7a695"
+        "0x4e509C60b3e916644dE441298595FeD12C4AC926"
      values.getConfig.signers.7.addr:
-        "0x4e509C60b3e916644dE441298595FeD12C4AC926"
+        "0x48A094F7A354d8faD7263EA2a82391d105DF6628"
      values.getConfig.signers.7.group:
-        1
+        3
      values.getConfig.signers.6.addr:
-        "0x48A094F7A354d8faD7263EA2a82391d105DF6628"
+        "0x43640F208956c7D49e04F40FF95dF818643B76aA"
      values.getConfig.signers.6.group:
-        4
+        1
      values.getConfig.signers.5.addr:
-        "0x43640F208956c7D49e04F40FF95dF818643B76aA"
+        "0x3C6cE61b611e3b41289c2FAFA5BC4e150dD88dE3"
      values.getConfig.signers.5.group:
-        1
+        3
      values.getConfig.signers.4.addr:
-        "0x3C6cE61b611e3b41289c2FAFA5BC4e150dD88dE3"
+        "0x2bbB172cD88dCAD64CBE762dcC53E6f96a17d1D6"
      values.getConfig.signers.4.group:
-        4
+        1
      values.getConfig.signers.3.addr:
-        "0x2bbB172cD88dCAD64CBE762dcC53E6f96a17d1D6"
+        "0x2B88575011C5E11389ddB50D28d31C7d06B352A0"
      values.getConfig.signers.2.addr:
-        "0x2B88575011C5E11389ddB50D28d31C7d06B352A0"
+        "0x2b73763722378AB2013CB0877946f69fC3727Fd8"
      values.getConfig.signers.2.group:
-        1
+        4
      values.getConfig.signers.1.addr:
-        "0x2b73763722378AB2013CB0877946f69fC3727Fd8"
+        "0x180159135c9b93C59d16eA1A690e465D22c5EB67"
      values.getConfig.signers.0.addr:
-        "0x180159135c9b93C59d16eA1A690e465D22c5EB67"
+        "0x124BA7e2188074335A0e9b12B449AD5781A73D60"
      values.getConfig.signers.0.group:
-        6
+        7
    }
```

```diff
    contract ManyChainMultiSig (0xE53289F32c8E690b7173aA33affE9B6B0CB0012F) {
    +++ description: None
      values.getConfig.signers.16:
+        {"addr":"0xE062e7D123AC8dF480C56147f911144F55C10f88","index":16,"group":3}
      values.getConfig.signers.15:
+        {"addr":"0xAe735fd5e74887064DFf99C637f291caE5485A75","index":15,"group":2}
      values.getConfig.signers.14.addr:
-        "0xE062e7D123AC8dF480C56147f911144F55C10f88"
+        "0xa42c8570771240D1e2F3211064a7C7472Cc05b7D"
      values.getConfig.signers.14.group:
-        3
+        4
      values.getConfig.signers.13.addr:
-        "0xAe735fd5e74887064DFf99C637f291caE5485A75"
+        "0x803CBD1e4d722eCf8247c6c9CDab4fC87DBAf429"
      values.getConfig.signers.13.group:
-        2
+        3
      values.getConfig.signers.12.addr:
-        "0xa42c8570771240D1e2F3211064a7C7472Cc05b7D"
+        "0x776D5B14ef1D5C58B0d48b53114f2Aa0faccB307"
      values.getConfig.signers.12.group:
-        4
+        2
      values.getConfig.signers.11.addr:
-        "0x803CBD1e4d722eCf8247c6c9CDab4fC87DBAf429"
+        "0x745B9329ccF53556e3C5f1fD1E4e9D0E91Ad2514"
      values.getConfig.signers.11.group:
-        3
+        2
      values.getConfig.signers.10.addr:
-        "0x745B9329ccF53556e3C5f1fD1E4e9D0E91Ad2514"
+        "0x70f498A0AD8a17fC853fcb8eDbE31Fbce71173E6"
      values.getConfig.signers.10.group:
-        2
+        3
      values.getConfig.signers.9.addr:
-        "0x70f498A0AD8a17fC853fcb8eDbE31Fbce71173E6"
+        "0x7052cB84079905400ea52B635cAb6a275fDA8823"
      values.getConfig.signers.9.group:
-        3
+        1
      values.getConfig.signers.8.addr:
-        "0x7052cB84079905400ea52B635cAb6a275fDA8823"
+        "0x6bfBf6BC4bc5CD20768dAA6F58f0743bAFf2e5f4"
      values.getConfig.signers.8.group:
-        1
+        4
      values.getConfig.signers.7.addr:
-        "0x6bfBf6BC4bc5CD20768dAA6F58f0743bAFf2e5f4"
+        "0x56B167deCD5fC4E3Bbc07B3B4e1F30e74534F9dd"
      values.getConfig.signers.6.addr:
-        "0x56B167deCD5fC4E3Bbc07B3B4e1F30e74534F9dd"
+        "0x480496c0884D61F2f56707Adb11697F8018898c2"
      values.getConfig.signers.6.group:
-        4
+        1
      values.getConfig.signers.5.addr:
-        "0x480496c0884D61F2f56707Adb11697F8018898c2"
+        "0x41eAdbc688797a02bfaBE48472995833489ce69D"
      values.getConfig.signers.4.addr:
-        "0x41eAdbc688797a02bfaBE48472995833489ce69D"
+        "0x36FdBDA6085d4DFA63Da90839432dDe9373970F0"
      values.getConfig.signers.4.group:
-        1
+        2
    }
```

Generated with discovered.json: 0x9e2eba074a93d6771d86f2ac05e78ce927597cca

# Diff at Tue, 13 Aug 2024 07:10:39 GMT:

- author: vincfurc (<10850139+vincfurc@users.noreply.github.com>)
- comparing to: main@0c3cfc52a7789ce38fba0749248ace00de3fd9eb block: 20491058
- current block number: 20518122

## Description

HYPE token removed from OnRamp12, its pool is not tracked anymore. Added new off ramp to LINK pool, can now receive messages from Arbitrum.

## Watched changes

```diff
-   Status: DELETED
    contract LockReleaseTokenPool (0x1e28DD4b559a7fF546b1e84691129508b2C9C3D3)
    +++ description: None
```

```diff
    contract OnRamp12 (0x333f976915195ba9044fD0cd603cEcE936f6264e) {
    +++ description: None
      values.getSupportedTokens.6:
-        "0x85225Ed797fd4128Ac45A992C46eA4681a7A15dA"
    }
```

```diff
-   Status: DELETED
    contract LockReleaseTokenPool (0x55562A08104837FF55E3A66c49A1419b6311c1E6)
    +++ description: None
```

```diff
    contract CommitStore (0x76264869a3eBF51a59FCa5ABa84ee2867c7F190e) {
    +++ description: None
      values.latestConfigDetails.configCount:
-        2
+        3
      values.latestConfigDetails.blockNumber:
-        20021002
+        20493806
      values.latestConfigDetails.configDigest:
-        "0x000158ce8fc4a0f994dfd6e0a25592e775701df72df104097ecbf9fefb87160e"
+        "0x0001b1cfe8bb04fc64f8a2eaea578f95d8c80b17319e793a0beca378d0833dde"
    }
```

```diff
-   Status: DELETED
    contract LockReleaseTokenPool (0xa008534BF96b61d9D33aD64aAD463bc6D300cd91)
    +++ description: None
```

```diff
    contract LockReleaseTokenPool (0xC2291992A08eBFDfedfE248F2CCD34Da63570DF4) {
    +++ description: None
      values.getOffRamps.7:
+        "0xb368c8946D9fa5A497cDe1Dff7213f9CdfD143Bf"
    }
```

## Source code changes

```diff
.../dev/null                                       | 1324 --------------------
 .../dev/null                                       | 1311 -------------------
 .../dev/null                                       | 1324 --------------------
 3 files changed, 3959 deletions(-)
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20491058 (main branch discovery), not current.

```diff
    contract GnosisSafe (0xc07556a0Bd177F8de4D077f449C2653A072F3798) {
    +++ description: None
      values.$multisigThreshold:
-        "3 of 7 (43%)"
      values.$members:
+        ["0xE0a8ABcf65e6212abFd659d5D857CFbA62a14771","0x0669d4d05Fc5bCF261DBADc3b41854a6ee7E2E85","0x5aC189Db4351787516d2E6Fc628BF762ce684326","0xBd6934b2DF4B6926FA7161f72A7DC599b9A2E581","0x53482ACf424d4196b0F8EbdD6F8A15eb8516FB88","0xcD5868dD3dEe0f0A31c38D088dd562F5d4ea2386","0xbD4dAf39E552C29648C9Ec78e2f671373b1347f2"]
      values.$threshold:
+        3
      values.multisigThreshold:
+        "3 of 7 (43%)"
    }
```

```diff
    contract GnosisSafe (0xD6597750bf74DCAEC57e0F9aD2ec998D837005bf) {
    +++ description: None
      values.$multisigThreshold:
-        "6 of 12 (50%)"
      values.$members:
+        ["0x326377a6B92eC69AcbbFe2De1eB1d7c9008E4C89","0x7052cB84079905400ea52B635cAb6a275fDA8823","0xE062e7D123AC8dF480C56147f911144F55C10f88","0x41eAdbc688797a02bfaBE48472995833489ce69D","0x1c6460cfe32916196f6977b5442b0F98A826D880","0x745B9329ccF53556e3C5f1fD1E4e9D0E91Ad2514","0xAe735fd5e74887064DFf99C637f291caE5485A75","0x14a8f3B302Bbfa7F2f2AC2F4515548370bc7bAdC","0x6bfBf6BC4bc5CD20768dAA6F58f0743bAFf2e5f4","0x56B167deCD5fC4E3Bbc07B3B4e1F30e74534F9dd","0x06e5891D9b2Ee77740355A309BAF49caaB672f98","0xa42c8570771240D1e2F3211064a7C7472Cc05b7D"]
      values.$threshold:
+        6
      values.multisigThreshold:
+        "6 of 12 (50%)"
    }
```

Generated with discovered.json: 0xbd6f53e4cb895e5ab8a37e811fc8f48cf455357c

# Diff at Fri, 09 Aug 2024 12:32:13 GMT:

- author: vincfurc (<10850139+vincfurc@users.noreply.github.com>)
- comparing to: main@55033526285d11b30f44e7cea5874c4f4d65ed80 block: 20475166
- current block number: 20491058

## Description

Discovery rerun on the same block number with only config-related changes.

## Watched changes

```diff
+   Status: CREATED
    contract LockReleaseTokenPool (0x82Df5c453e854CFaD64EA3f16497B5c5b9DB012B)
    +++ description: None
```

```diff
+   Status: CREATED
    contract BurnMintTokenPool (0x8c6028e38391cfC2A1a28f4359EA5732E9422e56)
    +++ description: None
```

```diff
+   Status: CREATED
    contract LockReleaseTokenPool (0xa904B9343632A6ca4f4a1b0C9eFa011cb319d000)
    +++ description: None
```

```diff
+   Status: CREATED
    contract LockReleaseTokenPool (0xC456EaE992e4f2925E3F75Ac4809dF387756CD29)
    +++ description: None
```

```diff
+   Status: CREATED
    contract BurnMintTokenPool (0xd72F7010f0Fa621aB0869e61e9bb4e3cC887c66c)
    +++ description: None
```

## Source code changes

```diff
...-0x8c6028e38391cfC2A1a28f4359EA5732E9422e56.sol |  998 ++++++++++++++
 ...-0xd72F7010f0Fa621aB0869e61e9bb4e3cC887c66c.sol |  998 ++++++++++++++
 ...-0x82Df5c453e854CFaD64EA3f16497B5c5b9DB012B.sol | 1407 ++++++++++++++++++++
 ...-0xC456EaE992e4f2925E3F75Ac4809dF387756CD29.sol | 1407 ++++++++++++++++++++
 ...-0xa904B9343632A6ca4f4a1b0C9eFa011cb319d000.sol | 1407 ++++++++++++++++++++
 5 files changed, 6217 insertions(+)
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20475166 (main branch discovery), not current.

```diff
    contract GnosisSafe (0xc07556a0Bd177F8de4D077f449C2653A072F3798) {
    +++ description: None
      values.getOwners:
-        ["0xE0a8ABcf65e6212abFd659d5D857CFbA62a14771","0x0669d4d05Fc5bCF261DBADc3b41854a6ee7E2E85","0x5aC189Db4351787516d2E6Fc628BF762ce684326","0xBd6934b2DF4B6926FA7161f72A7DC599b9A2E581","0x53482ACf424d4196b0F8EbdD6F8A15eb8516FB88","0xcD5868dD3dEe0f0A31c38D088dd562F5d4ea2386","0xbD4dAf39E552C29648C9Ec78e2f671373b1347f2"]
      values.getThreshold:
-        3
    }
```

```diff
    contract GnosisSafe (0xD6597750bf74DCAEC57e0F9aD2ec998D837005bf) {
    +++ description: None
      values.getOwners:
-        ["0x326377a6B92eC69AcbbFe2De1eB1d7c9008E4C89","0x7052cB84079905400ea52B635cAb6a275fDA8823","0xE062e7D123AC8dF480C56147f911144F55C10f88","0x41eAdbc688797a02bfaBE48472995833489ce69D","0x1c6460cfe32916196f6977b5442b0F98A826D880","0x745B9329ccF53556e3C5f1fD1E4e9D0E91Ad2514","0xAe735fd5e74887064DFf99C637f291caE5485A75","0x14a8f3B302Bbfa7F2f2AC2F4515548370bc7bAdC","0x6bfBf6BC4bc5CD20768dAA6F58f0743bAFf2e5f4","0x56B167deCD5fC4E3Bbc07B3B4e1F30e74534F9dd","0x06e5891D9b2Ee77740355A309BAF49caaB672f98","0xa42c8570771240D1e2F3211064a7C7472Cc05b7D"]
      values.getThreshold:
-        6
    }
```

Generated with discovered.json: 0xe7f888d9bf1744fcb3fcf778046bd265349b09c3

# Diff at Wed, 07 Aug 2024 07:23:21 GMT:

- author: Radina Talanova (<nt.radina@gmail.com>)
- comparing to: main@47685977ba2390a8eafac8e0d4cac7c81dff5758 block: 20454546
- current block number: 20475166

## Description

The bridge limit is increased for one of the escrows.

## Watched changes

```diff
    contract UpgradeableLockReleaseTokenPool (0x5756880B6a1EAba0175227bf02a7E87c1e02B28C) {
    +++ description: None
      values.getBridgeLimit:
-        "2500000000000000000000000"
+        "20000000000000000000000000"
    }
```

Generated with discovered.json: 0x98bca27d8f15e7eb491b21bbda22a60aa8152474

# Diff at Sun, 04 Aug 2024 10:19:37 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@14945a4ebc63b3db3867f33067f31f159fedd9a9 block: 20432548
- current block number: 20454546

## Description

All signers of the ManyChainMultiSig are moved from group 0 threshold 4 to group 1 with treshold 4. Group 1 has group 0 (threshold 1) as a parent so currently there is no change to the net threshold / permissions. See this explanation of the group structure below:
copied from the contract source:
```
    // Signing groups are arranged in a tree. Each group is an interior node and has its own quorum.
    // Signers are the leaves of the tree. A signer/leaf node is successful iff it furnishes a valid
    // signature. A group/interior node is successful iff a quorum of its children are successful.
    // setRoot succeeds only if the root group is successful.
    // Here is an example:
    //
    //                    ┌──────┐
    //                 ┌─►│2-of-3│◄───────┐
    //                 │  └──────┘        │
    //                 │        ▲         │
    //                 │        │         │
    //              ┌──┴───┐ ┌──┴───┐ ┌───┴────┐
    //          ┌──►│1-of-2│ │2-of-2│ │signer A│
    //          │   └──────┘ └──────┘ └────────┘
    //          │       ▲      ▲  ▲
    //          │       │      │  │     ┌──────┐
    //          │       │      │  └─────┤1-of-2│◄─┐
    //          │       │      │        └──────┘  │
    //  ┌───────┴┐ ┌────┴───┐ ┌┴───────┐ ▲        │
    //  │signer B│ │signer C│ │signer D│ │        │
    //  └────────┘ └────────┘ └────────┘ │        │
    //                                   │        │
    //                            ┌──────┴─┐ ┌────┴───┐
    //                            │signer E│ │signer F│
    //                            └────────┘ └────────┘
    //
    // - If signers [A, B] sign, they can set a root.
    // - If signers [B, D, E] sign, they can set a root.
    // - If signers [B, D, E, F] sign, they can set a root. (Either E's or F's signature was
    //   superfluous.)
    // - If signers [B, C, D] sign, they cannot set a root, because the 2-of-2 group on the second
    //   level isn't successful and therefore the root group isn't successful either.
    //
    // To map this tree to a Config, we:
    // - create an entry in signers for each signer (sorted by address in ascending order)
    // - assign the root group to index 0 and have it be its own parent
    // - assign an index to each non-root group, such that each group's parent has a lower index
    //   than the group itself
    // For example, we could transform the above tree structure into:
    // groupQuorums = [2, 1, 2, 1] + [0, 0, ...] (rightpad with 0s to NUM_GROUPS)
    // groupParents = [0, 0, 0, 2] + [0, 0, ...] (rightpad with 0s to NUM_GROUPS)
    // and assuming that address(A) < address(C) < address(E) < address(F) < address(D) < address(B)
    // signers = [
    //    {addr: address(A), index: 0, group: 0}, {addr: address(C), index: 1, group: 1},
    //    {addr: address(E), index: 2, group: 3}, {addr: address(F), index: 3, group: 3},
    //    {addr: address(D), index: 4, group: 2}, {addr: address(B), index: 5, group: 1},
    //  ]
```

## Watched changes

```diff
    contract ManyChainMultiSig (0x2F2A3e36CE5Fb0924C414BEB1D98B531Cdf17e0B) {
    +++ description: None
      values.getConfig.signers.8.group:
-        0
+        1
      values.getConfig.signers.7.group:
-        0
+        1
      values.getConfig.signers.6.group:
-        0
+        1
      values.getConfig.signers.5.group:
-        0
+        1
      values.getConfig.signers.4.group:
-        0
+        1
      values.getConfig.signers.3.group:
-        0
+        1
      values.getConfig.signers.2.group:
-        0
+        1
      values.getConfig.signers.1.group:
-        0
+        1
      values.getConfig.signers.0.group:
-        0
+        1
      values.getConfig.groupQuorums.1:
-        0
+        4
      values.getConfig.groupQuorums.0:
-        4
+        1
    }
```

Generated with discovered.json: 0xddaf5ba394a864bbb9350766a2e948b26307fdbe

# Diff at Thu, 01 Aug 2024 08:38:09 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@295430f331b68784c13ccda9222bc78df1e833c5 block: 20420384
- current block number: 20432548

## Description

New onramp added to an existing lane. The chainSelector's associated chain in CommitStore15 is still unclear.

## Watched changes

```diff
    contract Router (0x80226fc0Ee2b096224EeAc085Bb9a8cba1146f7D) {
    +++ description: None
      values.onRamps.1562403441176082196:
+        "0xD54C93A99CBCb8D865E13DA321B540171795A89f"
    }
```

```diff
    contract CommitStore15 (0xa4d264470a67D9f6682EE12Bdc9c35Df44e3F194) {
    +++ description: None
      values.latestConfigDetails.configCount:
-        3
+        4
      values.latestConfigDetails.blockNumber:
-        20393769
+        20421003
      values.latestConfigDetails.configDigest:
-        "0x0001b4de454b34a4d0d5be00f3b0c21a51b346f9bcb88bab16ebee72c8d210ba"
+        "0x0001442c239e69bf2461192e40906b14d1d34fc9d2f193127ac07fae2dbb51c7"
    }
```

```diff
+   Status: CREATED
    contract EVM2EVMOnRamp (0xD54C93A99CBCb8D865E13DA321B540171795A89f)
    +++ description: None
```

## Source code changes

```diff
...-0xD54C93A99CBCb8D865E13DA321B540171795A89f.sol | 2732 ++++++++++++++++++++
 1 file changed, 2732 insertions(+)
```

Generated with discovered.json: 0xf80e881e9014089fce84efda49a1192f8e1bd8ce

# Diff at Tue, 30 Jul 2024 15:53:20 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@51c652e40232eac8e60e9b31aa56f09071495fef block: 20389460
- current block number: 20420384

## Description

A new lane is prepared, which includes support of a new source/destination for transporter. The `sourceChainSelector: 1562403441176082196` is not used nor documented yet.

## Watched changes

```diff
    contract CommitStore (0x3CB2A81bb8a188C5353CdFa9994ed8666556FC53) {
    +++ description: None
      values.latestConfigDetails.configCount:
-        2
+        3
      values.latestConfigDetails.blockNumber:
-        20129939
+        20398840
      values.latestConfigDetails.configDigest:
-        "0x00018acc33a2a17b22ad88b60ae9798249a28a5b048e601b91dff87a257a9d2f"
+        "0x00011b0feeb79956de5da44165457ab771a1a71a233c41b945038500a5c4356f"
    }
```

```diff
    contract CommitStore (0x3d8a95adA63D406ee8232562AbD83CEdb0B90466) {
    +++ description: None
      values.latestConfigDetails.configCount:
-        3
+        4
      values.latestConfigDetails.blockNumber:
-        20285533
+        20398823
      values.latestConfigDetails.configDigest:
-        "0x0001ba387d4c1908a481c1fb34852617db49202b17af2ac2b6f31d7b4a14b97d"
+        "0x00015794577c5ec58b806ca7715e3310c6ffb423253062cd303e02dd3feb8e9b"
    }
```

```diff
    contract Router (0x80226fc0Ee2b096224EeAc085Bb9a8cba1146f7D) {
    +++ description: None
      values.offRamps.12:
+        {"sourceChainSelector":"1562403441176082196","offRamp":"0xb368c8946D9fa5A497cDe1Dff7213f9CdfD143Bf"}
    }
```

```diff
    contract PriceRegistry (0x8c9b2Efb7c64C394119270bfecE7f54763b958Ad) {
    +++ description: None
      values.getPriceUpdaters.12:
+        "0xa4d264470a67D9f6682EE12Bdc9c35Df44e3F194"
    }
```

```diff
+   Status: CREATED
    contract CommitStore15 (0xa4d264470a67D9f6682EE12Bdc9c35Df44e3F194)
    +++ description: None
```

```diff
+   Status: CREATED
    contract OffRamp15 (0xb368c8946D9fa5A497cDe1Dff7213f9CdfD143Bf)
    +++ description: None
```

## Source code changes

```diff
.../transporter/ethereum/.flat/CommitStore15.sol   | 1089 ++++++++
 .../transporter/ethereum/.flat/OffRamp15.sol       | 2894 ++++++++++++++++++++
 2 files changed, 3983 insertions(+)
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20389460 (main branch discovery), not current.

```diff
    contract OffRamp7 (0x0af338F0E314c7551bcE0EF516d46d855b0Ee395) {
    +++ description: None
      usedTypes.0.arg.4411394078118774322:
+        "blast"
      usedTypes.0.arg.8805746078405598895:
+        "metis"
    }
```

```diff
    contract OnRamp11 (0x0f27c8532457b66D6037141DEB0ed479Dad04B3c) {
    +++ description: None
      usedTypes.0.arg.4411394078118774322:
+        "blast"
      usedTypes.0.arg.8805746078405598895:
+        "metis"
    }
```

```diff
    contract CommitStore2 (0x118a9389960F86390A4F14ce4C95D6ff076C6bFC) {
    +++ description: None
      usedTypes.0.arg.4411394078118774322:
+        "blast"
      usedTypes.0.arg.8805746078405598895:
+        "metis"
    }
```

```diff
    contract EVM2EVMOffRamp (0x1a904DbbaDdE629a1460e2F6E2E485Ce06Ed7599) {
    +++ description: None
      values.getStaticConfig.sourceChainSelector:
-        "4411394078118774322"
+        "blast"
      usedTypes.0.arg.4411394078118774322:
+        "blast"
      usedTypes.0.arg.8805746078405598895:
+        "metis"
    }
```

```diff
    contract OffRamp10 (0x1C207dabc46902dF9028b27D6d301c3849b2D12c) {
    +++ description: None
      usedTypes.0.arg.4411394078118774322:
+        "blast"
      usedTypes.0.arg.8805746078405598895:
+        "metis"
    }
```

```diff
    contract CommitStore11 (0x20718EfbC25Dba60FD51c2c81362b83f7C411A6D) {
    +++ description: None
      usedTypes.0.arg.4411394078118774322:
+        "blast"
      usedTypes.0.arg.8805746078405598895:
+        "metis"
    }
```

```diff
    contract CommitStore5 (0x2aa101BF99CaeF7fc1355D4c493a1fe187A007cE) {
    +++ description: None
      usedTypes.0.arg.4411394078118774322:
+        "blast"
      usedTypes.0.arg.8805746078405598895:
+        "metis"
    }
```

```diff
    contract CommitStore14 (0x2D1708ff2a15adbE313eA8C6035aA24d0FBA1c77) {
    +++ description: None
      usedTypes.0.arg.4411394078118774322:
+        "blast"
      usedTypes.0.arg.8805746078405598895:
+        "metis"
    }
```

```diff
    contract CommitStore1 (0x31f6ab382DDeb9A316Ab61C3945a5292a50a89AB) {
    +++ description: None
      usedTypes.0.arg.4411394078118774322:
+        "blast"
      usedTypes.0.arg.8805746078405598895:
+        "metis"
    }
```

```diff
    contract OnRamp12 (0x333f976915195ba9044fD0cd603cEcE936f6264e) {
    +++ description: None
      usedTypes.0.arg.4411394078118774322:
+        "blast"
      usedTypes.0.arg.8805746078405598895:
+        "metis"
    }
```

```diff
    contract OnRamp2 (0x35F0ca9Be776E4B38659944c257bDd0ba75F1B8B) {
    +++ description: None
      usedTypes.0.arg.4411394078118774322:
+        "blast"
      usedTypes.0.arg.8805746078405598895:
+        "metis"
    }
```

```diff
    contract OffRamp1 (0x3a129e6C18b23d18BA9E6Aa14Dc2e79d1f91c6c5) {
    +++ description: None
      usedTypes.0.arg.4411394078118774322:
+        "blast"
      usedTypes.0.arg.8805746078405598895:
+        "metis"
    }
```

```diff
    contract CommitStore (0x3CB2A81bb8a188C5353CdFa9994ed8666556FC53) {
    +++ description: None
      values.getStaticConfig.sourceChainSelector:
-        "4411394078118774322"
+        "blast"
      usedTypes.0.arg.4411394078118774322:
+        "blast"
      usedTypes.0.arg.8805746078405598895:
+        "metis"
    }
```

```diff
    contract CommitStore12 (0x3d3467e1036Ee25F6F4aa15e3Abf77443A23144C) {
    +++ description: None
      usedTypes.0.arg.4411394078118774322:
+        "blast"
      usedTypes.0.arg.8805746078405598895:
+        "metis"
    }
```

```diff
    contract CommitStore (0x3d8a95adA63D406ee8232562AbD83CEdb0B90466) {
    +++ description: None
      values.getStaticConfig.sourceChainSelector:
-        "8805746078405598895"
+        "metis"
      usedTypes.0.arg.4411394078118774322:
+        "blast"
      usedTypes.0.arg.8805746078405598895:
+        "metis"
    }
```

```diff
    contract OnRamp4 (0x3df8dAe2d123081c4D5E946E655F7c109B9Dd630) {
    +++ description: None
      usedTypes.0.arg.4411394078118774322:
+        "blast"
      usedTypes.0.arg.8805746078405598895:
+        "metis"
    }
```

```diff
    contract CommitStore10 (0x40c558575093eC1099CC21B020d9b8D13c74417F) {
    +++ description: None
      usedTypes.0.arg.4411394078118774322:
+        "blast"
      usedTypes.0.arg.8805746078405598895:
+        "metis"
    }
```

```diff
    contract OffRamp9 (0x41627a90f2c6238f2BADAB72D5aB050B857fdAb5) {
    +++ description: None
      usedTypes.0.arg.4411394078118774322:
+        "blast"
      usedTypes.0.arg.8805746078405598895:
+        "metis"
    }
```

```diff
    contract EVM2EVMOnRamp (0x4545F9a17DA50110632C14704a15d893BF9CBD27) {
    +++ description: None
      values.staticConfigChains.1:
-        "4411394078118774322"
+        "blast"
      usedTypes.0.arg.4411394078118774322:
+        "blast"
      usedTypes.0.arg.8805746078405598895:
+        "metis"
    }
```

```diff
    contract EVM2EVMOnRamp (0x466a078d17e3706a9414ACc48029EE9Bae4C9b65) {
    +++ description: None
      usedTypes.0.arg.4411394078118774322:
+        "blast"
      usedTypes.0.arg.8805746078405598895:
+        "metis"
    }
```

```diff
    contract CommitStore4 (0x4af4B497c998007eF83ad130318eB2b925a79dc8) {
    +++ description: None
      usedTypes.0.arg.4411394078118774322:
+        "blast"
      usedTypes.0.arg.8805746078405598895:
+        "metis"
    }
```

```diff
    contract OffRamp5 (0x569940e02D4425eac61A7601632eC00d69f75c17) {
    +++ description: None
      usedTypes.0.arg.4411394078118774322:
+        "blast"
      usedTypes.0.arg.8805746078405598895:
+        "metis"
    }
```

```diff
    contract OffRamp12 (0x61135E701a2214C170c5F596D0067798FEfbaaE4) {
    +++ description: None
      usedTypes.0.arg.4411394078118774322:
+        "blast"
      usedTypes.0.arg.8805746078405598895:
+        "metis"
    }
```

```diff
    contract CommitStore (0x76264869a3eBF51a59FCa5ABa84ee2867c7F190e) {
    +++ description: None
      usedTypes.0.arg.4411394078118774322:
+        "blast"
      usedTypes.0.arg.8805746078405598895:
+        "metis"
    }
```

```diff
    contract CommitStore13 (0x7986C9892389854cAAbAC785ff18123B0070a5Fd) {
    +++ description: None
      usedTypes.0.arg.4411394078118774322:
+        "blast"
      usedTypes.0.arg.8805746078405598895:
+        "metis"
    }
```

```diff
    contract OffRamp3 (0x7Afe7088aff57173565F4b034167643AA8b9171c) {
    +++ description: None
      usedTypes.0.arg.4411394078118774322:
+        "blast"
      usedTypes.0.arg.8805746078405598895:
+        "metis"
    }
```

```diff
    contract Router (0x80226fc0Ee2b096224EeAc085Bb9a8cba1146f7D) {
    +++ description: None
      values.offRamps.11.sourceChainSelector:
-        "8805746078405598895"
+        "metis"
      values.offRamps.10.sourceChainSelector:
-        "4411394078118774322"
+        "blast"
      usedTypes.0.arg.4411394078118774322:
+        "blast"
      usedTypes.0.arg.8805746078405598895:
+        "metis"
    }
```

```diff
    contract CommitStore (0x831097033C88c82a7F1897b168Aa88cC44540C8f) {
    +++ description: None
      usedTypes.0.arg.4411394078118774322:
+        "blast"
      usedTypes.0.arg.8805746078405598895:
+        "metis"
    }
```

```diff
    contract OnRamp1 (0x86B47d8411006874eEf8E4584BdFD7be8e5549d1) {
    +++ description: None
      usedTypes.0.arg.4411394078118774322:
+        "blast"
      usedTypes.0.arg.8805746078405598895:
+        "metis"
    }
```

```diff
    contract CommitStore3 (0x87c55D48DF6EF7B08153Ab079e76bFEcbb793D75) {
    +++ description: None
      usedTypes.0.arg.4411394078118774322:
+        "blast"
      usedTypes.0.arg.8805746078405598895:
+        "metis"
    }
```

```diff
    contract CommitStore9 (0x8bEFCa744c6f2b567b1863dcF055C593afdC11A0) {
    +++ description: None
      usedTypes.0.arg.4411394078118774322:
+        "blast"
      usedTypes.0.arg.8805746078405598895:
+        "metis"
    }
```

```diff
    contract CommitStore6 (0x8DC27D621c41a32140e22E2a4dAf1259639BAe04) {
    +++ description: None
      usedTypes.0.arg.4411394078118774322:
+        "blast"
      usedTypes.0.arg.8805746078405598895:
+        "metis"
    }
```

```diff
    contract OnRamp5 (0x91D25A56Db77aD5147437d8B83Eb563D46eBFa69) {
    +++ description: None
      usedTypes.0.arg.4411394078118774322:
+        "blast"
      usedTypes.0.arg.8805746078405598895:
+        "metis"
    }
```

```diff
    contract OnRamp3 (0x925228D7B82d883Dde340A55Fe8e6dA56244A22C) {
    +++ description: None
      usedTypes.0.arg.4411394078118774322:
+        "blast"
      usedTypes.0.arg.8805746078405598895:
+        "metis"
    }
```

```diff
    contract CommitStore8 (0x9B2EEd6A1e16cB50Ed4c876D2dD69468B21b7749) {
    +++ description: None
      usedTypes.0.arg.4411394078118774322:
+        "blast"
      usedTypes.0.arg.8805746078405598895:
+        "metis"
    }
```

```diff
    contract EVM2EVMOnRamp (0xa5ef33B57dD8B653F9A9EA7114f46376d18264aC) {
    +++ description: None
      values.staticConfigChains.1:
-        "8805746078405598895"
+        "metis"
      usedTypes.0.arg.4411394078118774322:
+        "blast"
      usedTypes.0.arg.8805746078405598895:
+        "metis"
    }
```

```diff
    contract OffRamp4 (0xB095900fB91db00E6abD247A5A5AD1cee3F20BF7) {
    +++ description: None
      usedTypes.0.arg.4411394078118774322:
+        "blast"
      usedTypes.0.arg.8805746078405598895:
+        "metis"
    }
```

```diff
    contract OffRamp11 (0xBDd822f3bC2EAB6818CfA3053107831D4E93fE72) {
    +++ description: None
      usedTypes.0.arg.4411394078118774322:
+        "blast"
      usedTypes.0.arg.8805746078405598895:
+        "metis"
    }
```

```diff
    contract OffRamp13 (0xC7176620daf49A39a17FF9A6C2DE1eAA6033EE94) {
    +++ description: None
      usedTypes.0.arg.4411394078118774322:
+        "blast"
      usedTypes.0.arg.8805746078405598895:
+        "metis"
    }
```

```diff
    contract OnRamp7 (0xCbE7e5DA76dC99Ac317adF6d99137005FDA4E2C4) {
    +++ description: None
      usedTypes.0.arg.4411394078118774322:
+        "blast"
      usedTypes.0.arg.8805746078405598895:
+        "metis"
    }
```

```diff
    contract OnRamp9 (0xCC19bC4D43d17eB6859F0d22BA300967C97780b0) {
    +++ description: None
      usedTypes.0.arg.4411394078118774322:
+        "blast"
      usedTypes.0.arg.8805746078405598895:
+        "metis"
    }
```

```diff
    contract EVM2EVMOffRamp (0xCe6364dBe64D2789D916180131fAda2ABFF702E8) {
    +++ description: None
      values.getStaticConfig.sourceChainSelector:
-        "8805746078405598895"
+        "metis"
      usedTypes.0.arg.4411394078118774322:
+        "blast"
      usedTypes.0.arg.8805746078405598895:
+        "metis"
    }
```

```diff
    contract OnRamp10 (0xd0B5Fc9790a6085b048b8Aa1ED26ca2b3b282CF2) {
    +++ description: None
      usedTypes.0.arg.4411394078118774322:
+        "blast"
      usedTypes.0.arg.8805746078405598895:
+        "metis"
    }
```

```diff
    contract CommitStore7 (0xD37a60E8C36E802D2E1a6321832Ee85556Beeb76) {
    +++ description: None
      usedTypes.0.arg.4411394078118774322:
+        "blast"
      usedTypes.0.arg.8805746078405598895:
+        "metis"
    }
```

```diff
    contract EVM2EVMOffRamp (0xd5083684eE92dDeA117636ae5E2F1cb7fE4dfd46) {
    +++ description: None
      usedTypes.0.arg.4411394078118774322:
+        "blast"
      usedTypes.0.arg.8805746078405598895:
+        "metis"
    }
```

```diff
    contract OnRamp13 (0xdF1d7FD22aC3aB5171E275796f123224039f3b24) {
    +++ description: None
      usedTypes.0.arg.4411394078118774322:
+        "blast"
      usedTypes.0.arg.8805746078405598895:
+        "metis"
    }
```

```diff
    contract OffRamp6 (0xdf85c8381954694E74abD07488f452b4c2Cddfb3) {
    +++ description: None
      usedTypes.0.arg.4411394078118774322:
+        "blast"
      usedTypes.0.arg.8805746078405598895:
+        "metis"
    }
```

```diff
    contract OnRamp6 (0xe2c2AB221AA0b957805f229d2AA57fBE2f4dADf7) {
    +++ description: None
      usedTypes.0.arg.4411394078118774322:
+        "blast"
      usedTypes.0.arg.8805746078405598895:
+        "metis"
    }
```

```diff
    contract OnRamp14 (0xe2Eb229e88F56691e96bb98256707Bc62160FE73) {
    +++ description: None
      usedTypes.0.arg.4411394078118774322:
+        "blast"
      usedTypes.0.arg.8805746078405598895:
+        "metis"
    }
```

```diff
    contract EVM2EVMOffRamp (0xE8af3b68eDfFf65Ce48648009982380701f09B92) {
    +++ description: None
      usedTypes.0.arg.4411394078118774322:
+        "blast"
      usedTypes.0.arg.8805746078405598895:
+        "metis"
    }
```

```diff
    contract OffRamp2 (0xE93ec2A57e38C8541c893348cCafEAB01F7D47d4) {
    +++ description: None
      usedTypes.0.arg.4411394078118774322:
+        "blast"
      usedTypes.0.arg.8805746078405598895:
+        "metis"
    }
```

```diff
    contract EVM2EVMOnRamp (0xEd5bE9508ae56531cc0EDe6A3bD588Eb9E2e3cfa) {
    +++ description: None
      usedTypes.0.arg.4411394078118774322:
+        "blast"
      usedTypes.0.arg.8805746078405598895:
+        "metis"
    }
```

```diff
    contract OffRamp8 (0xeFC4a18af59398FF23bfe7325F2401aD44286F4d) {
    +++ description: None
      usedTypes.0.arg.4411394078118774322:
+        "blast"
      usedTypes.0.arg.8805746078405598895:
+        "metis"
    }
```

```diff
    contract OnRamp8 (0xF538dA6c673A30338269655f4e019B71ba58CFd4) {
    +++ description: None
      usedTypes.0.arg.4411394078118774322:
+        "blast"
      usedTypes.0.arg.8805746078405598895:
+        "metis"
    }
```

```diff
    contract OffRamp14 (0xfF51C00546AA3d9051a4B96Ae81346E14709CD24) {
    +++ description: None
      usedTypes.0.arg.4411394078118774322:
+        "blast"
      usedTypes.0.arg.8805746078405598895:
+        "metis"
    }
```

Generated with discovered.json: 0x6e3fa3bf60c3ff9402bafe069336978276249e74

# Diff at Fri, 26 Jul 2024 08:15:12 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@f98f9bf0ba32e20ec33942af664ae6ed27e8172d block: 20362731
- current block number: 20389460

## Description

The bridge limit (max amount of tokens that can be transferred out to other chains) is raised to 2,5M tokens, which is about the current amount of GHO tokens locked in this pool.

## Watched changes

```diff
    contract UpgradeableLockReleaseTokenPool (0x5756880B6a1EAba0175227bf02a7E87c1e02B28C) {
    +++ description: None
      values.getBridgeLimit:
-        "1000000000000000000000000"
+        "2500000000000000000000000"
    }
```

Generated with discovered.json: 0x5013f11878fa492b43f258c666a94f5851309e6a

# Diff at Mon, 22 Jul 2024 14:42:16 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@898b873eac66b785af49fe56edca0c3dc1a5d0d7 block: 20289773
- current block number: 20362731

## Description

Two new token pools are added related to Zunami protocol: zunETH and zunUSD. Tokens are added to Ethereum (in case these escrows are used in the future).

## Watched changes

```diff
-   Status: DELETED
    contract BurnMintTokenPool (0x9c6a6E9C3Bb973C24ee2982F59BE9b796327e1dD)
    +++ description: None
```

```diff
    contract LockReleaseTokenPool (0xC2291992A08eBFDfedfE248F2CCD34Da63570DF4) {
    +++ description: None
      values.getOffRamps.6:
+        "0xCe6364dBe64D2789D916180131fAda2ABFF702E8"
    }
```

```diff
    contract BurnMintTokenPool (0xf5224EfD7Ea9edFa6b6e06964084b92426DCdE99) {
    +++ description: None
      values.getSupportedChains.2:
+        "15971525489660198786"
      values.getSupportedChains.1:
+        "3734403246176062136"
    }
```

```diff
+   Status: CREATED
    contract LockReleaseTokenPool (0xa96787DCe9Df7BF7bB033E39777bd108E29D349b)
    +++ description: None
```

```diff
+   Status: CREATED
    contract LockReleaseTokenPool (0xF84Bf7D614F3138D805186C497995d4eD315fA72)
    +++ description: None
```

## Source code changes

```diff
...0xF84Bf7D614F3138D805186C497995d4eD315fA72.sol} |  461 ++++++-
 ...-0xa96787DCe9Df7BF7bB033E39777bd108E29D349b.sol | 1407 ++++++++++++++++++++
 2 files changed, 1842 insertions(+), 26 deletions(-)
```

Generated with discovered.json: 0x51df07c0d84720ff6c68455e3bcd515e7859dba9

# Diff at Fri, 12 Jul 2024 10:19:04 GMT:

- author: sekuba (<sekuba@users.noreply.github.com>)
- comparing to: main@48ec906f1df3ec8351c0e2324170592091f7c1db block: 20217553
- current block number: 20289773

## Description

A new burn/mint tokenPool for USD+ (Dinari) is added.

## Watched changes

```diff
    contract Router (0x80226fc0Ee2b096224EeAc085Bb9a8cba1146f7D) {
    +++ description: None
      values.offRamps.11:
+        {"sourceChainSelector":"8805746078405598895","offRamp":"0xCe6364dBe64D2789D916180131fAda2ABFF702E8"}
      values.onRamps.8805746078405598895:
+        "0xa5ef33B57dD8B653F9A9EA7114f46376d18264aC"
    }
```

```diff
    contract PriceRegistry (0x8c9b2Efb7c64C394119270bfecE7f54763b958Ad) {
    +++ description: None
      values.getPriceUpdaters.11:
+        "0x3d8a95adA63D406ee8232562AbD83CEdb0B90466"
    }
```

```diff
    contract BurnMintTokenPool (0xeaE89E53B8317CaB04165F5323285252D5669B73) {
    +++ description: None
      values.getOffRamps.1:
+        "0xdf85c8381954694E74abD07488f452b4c2Cddfb3"
    }
```

```diff
+   Status: CREATED
    contract CommitStore (0x3d8a95adA63D406ee8232562AbD83CEdb0B90466)
    +++ description: None
```

```diff
+   Status: CREATED
    contract BurnMintTokenPool (0x80e2dcE0A16c8DB769995129cF6BbFCac8E4cFb8)
    +++ description: None
```

```diff
+   Status: CREATED
    contract BurnMintTokenPool (0x9c6a6E9C3Bb973C24ee2982F59BE9b796327e1dD)
    +++ description: None
```

```diff
+   Status: CREATED
    contract EVM2EVMOnRamp (0xa5ef33B57dD8B653F9A9EA7114f46376d18264aC)
    +++ description: None
```

```diff
+   Status: CREATED
    contract EVM2EVMOffRamp (0xCe6364dBe64D2789D916180131fAda2ABFF702E8)
    +++ description: None
```

## Source code changes

```diff
...-0x80e2dcE0A16c8DB769995129cF6BbFCac8E4cFb8.sol |  998 +++++++
 ...-0x9c6a6E9C3Bb973C24ee2982F59BE9b796327e1dD.sol |  998 +++++++
 ...-0x3d8a95adA63D406ee8232562AbD83CEdb0B90466.sol | 1089 ++++++++
 ...-0xCe6364dBe64D2789D916180131fAda2ABFF702E8.sol | 2894 ++++++++++++++++++++
 ...-0xa5ef33B57dD8B653F9A9EA7114f46376d18264aC.sol | 2732 ++++++++++++++++++
 5 files changed, 8711 insertions(+)
```

Generated with discovered.json: 0x635fd0f952f8a70017ac8f90189d49f723440119

# Diff at Mon, 01 Jul 2024 12:13:33 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@b5540be6f0b9cb1f69a05dba32413b0eae0acbf4 block: 20181951
- current block number: 20211590

## Description

New token pools for WETH, GHO, egETH (Eigenpie LRT), EARNM (not on CG).
All are empty.
These escrows would be fetched from discovery to the frontend automatically, but transporter is currently not shown on the frontend.

## Watched changes

```diff
    contract LockReleaseTokenPool (0x69c24c970B65e22Ac26864aF10b2295B7d78f93A) {
    +++ description: None
      values.getSupportedChains.2:
+        "15971525489660198786"
    }
```

```diff
+   Status: CREATED
    contract LockReleaseTokenPool (0x4Ce6f5cacF8Bd393104c12F6151B727eabBf675c)
    +++ description: None
```

```diff
+   Status: CREATED
    contract UpgradeableLockReleaseTokenPool (0x5756880B6a1EAba0175227bf02a7E87c1e02B28C)
    +++ description: None
```

```diff
+   Status: CREATED
    contract BurnMintTokenPool (0x7559a84Ae7B75F4B0E0E540312A3Ec912B2128CA)
    +++ description: None
```

## Source code changes

```diff
...-0x7559a84Ae7B75F4B0E0E540312A3Ec912B2128CA.sol |  998 +++++++++++
 ...-0x4Ce6f5cacF8Bd393104c12F6151B727eabBf675c.sol | 1407 +++++++++++++++
 .../TransparentUpgradeableProxy.p.sol              |  587 +++++++
 .../UpgradeableLockReleaseTokenPool.sol            | 1822 ++++++++++++++++++++
 4 files changed, 4814 insertions(+)
```

Generated with discovered.json: 0x7c650b93b3b74635f636b7c782164479d7f37500

# Diff at Wed, 26 Jun 2024 09:58:15 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@cb9200e010745e10244c0b3851b3acf21fe41f31 block: 20160808
- current block number: 20175102

## Description

Two new LockReleaseTokenPool contracts are tracked. Currently both are unused.
The tokens for the two pools (hyETH, dsETH) are currently unsupported (no data on CG), so the escrows are not added.

## Watched changes

```diff
+   Status: CREATED
    contract LockReleaseTokenPool (0x0238d2C272f17CF11AEDB08CDE515d56ED25E2E4)
    +++ description: None
```

```diff
+   Status: CREATED
    contract LockReleaseTokenPool (0xcd69c117bf91Fc57d5fC237dFAbA5f17B5322733)
    +++ description: None
```

## Source code changes

```diff
...-0x0238d2C272f17CF11AEDB08CDE515d56ED25E2E4.sol | 1407 ++++++++++++++++++++
 ...-0xcd69c117bf91Fc57d5fC237dFAbA5f17B5322733.sol | 1407 ++++++++++++++++++++
 2 files changed, 2814 insertions(+)
```

Generated with discovered.json: 0x0d7ab0a044f0fdba780128be25b5701c962c6167

# Diff at Mon, 24 Jun 2024 10:03:37 GMT:

- author: sekuba (<sekuba@users.noreply.github.com>)
- comparing to: main@b54e27671cccd831f2f6414fffe3bd374840c6b7 block: 20133449
- current block number: 20160808

## Description

A new offramp config is added to the LINK token pool on Ethereum.
The pool is already present in Transporter ecrows, although TVL is currently disabled for Transporter.

## Watched changes

```diff
    contract LockReleaseTokenPool (0xC2291992A08eBFDfedfE248F2CCD34Da63570DF4) {
    +++ description: None
      values.getOffRamps.5:
+        "0x1a904DbbaDdE629a1460e2F6E2E485Ce06Ed7599"
    }
```

Generated with discovered.json: 0xef91d62a61251a159c367651354c03291f9e2a51

# Diff at Thu, 20 Jun 2024 14:11:06 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@bf726e5da31db25973635b239fd2b25758ca112e block: 20067895
- current block number: 20133449

## Description

Provide description of changes. This section will be preserved.

## Watched changes

```diff
    contract Router (0x80226fc0Ee2b096224EeAc085Bb9a8cba1146f7D) {
    +++ description: None
      values.offRamps.10:
+        {"sourceChainSelector":"4411394078118774322","offRamp":"0x1a904DbbaDdE629a1460e2F6E2E485Ce06Ed7599"}
      values.onRamps.4411394078118774322:
+        "0x4545F9a17DA50110632C14704a15d893BF9CBD27"
    }
```

```diff
    contract PriceRegistry (0x8c9b2Efb7c64C394119270bfecE7f54763b958Ad) {
    +++ description: None
      values.getPriceUpdaters.10:
+        "0x3CB2A81bb8a188C5353CdFa9994ed8666556FC53"
    }
```

```diff
+   Status: CREATED
    contract EVM2EVMOffRamp (0x1a904DbbaDdE629a1460e2F6E2E485Ce06Ed7599)
    +++ description: None
```

```diff
+   Status: CREATED
    contract CommitStore (0x3CB2A81bb8a188C5353CdFa9994ed8666556FC53)
    +++ description: None
```

```diff
+   Status: CREATED
    contract EVM2EVMOnRamp (0x4545F9a17DA50110632C14704a15d893BF9CBD27)
    +++ description: None
```

```diff
+   Status: CREATED
    contract LockReleaseTokenPool (0x6452d693860ab7e18fC5858C05980F63d93F37a6)
    +++ description: None
```

```diff
+   Status: CREATED
    contract BurnMintTokenPool (0xf5224EfD7Ea9edFa6b6e06964084b92426DCdE99)
    +++ description: None
```

## Source code changes

```diff
...-0xf5224EfD7Ea9edFa6b6e06964084b92426DCdE99.sol |  998 +++++++
 ...-0x3CB2A81bb8a188C5353CdFa9994ed8666556FC53.sol | 1089 ++++++++
 ...-0x1a904DbbaDdE629a1460e2F6E2E485Ce06Ed7599.sol | 2894 ++++++++++++++++++++
 ...-0x4545F9a17DA50110632C14704a15d893BF9CBD27.sol | 2732 ++++++++++++++++++
 ...-0x6452d693860ab7e18fC5858C05980F63d93F37a6.sol | 1407 ++++++++++
 5 files changed, 9120 insertions(+)
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20067895 (main branch discovery), not current.

```diff
-   Status: DELETED
    contract MessageTransmitter (0x0a992d191DEeC32aFe36203Ad87D7d289a738F81)
    +++ description: None
```

```diff
    contract OffRamp7 (0x0af338F0E314c7551bcE0EF516d46d855b0Ee395) {
    +++ description: None
      values.currentRateLimiterState:
-        {"tokens":"1000000000000000000000000","lastUpdated":1718100575,"isEnabled":true,"capacity":"1000000000000000000000000","rate":"277000000000000000000"}
      values.getStaticConfig.chainSelector:
-        "5009297550715157269"
+        "ethereum"
      values.getStaticConfig.sourceChainSelector:
-        "4051577828743386545"
+        "polygon"
      usedTypes:
+        [{"typeCaster":"Mapping","arg":{"465200170687744372":"gnosis","5009297550715157269":"ethereum","3734403246176062136":"optimism","4949039107694359620":"arbitrum","4051577828743386545":"polygon","6433500567565415381":"avalanche","5142893604156789321":"wemix","3719320017875267166":"kroma","1346049177634351622":"celo","7264351850409363825":"mode","11344663589394136015":"bnb","15971525489660198786":"base"}}]
    }
```

```diff
    contract OnRamp11 (0x0f27c8532457b66D6037141DEB0ed479Dad04B3c) {
    +++ description: None
      values.currentRateLimiterState:
-        {"tokens":"600000000000000000000000","lastUpdated":1718100575,"isEnabled":true,"capacity":"600000000000000000000000","rate":"167000000000000000000"}
      values.staticConfigChains.1:
-        "4051577828743386545"
+        "polygon"
      values.staticConfigChains.0:
-        "5009297550715157269"
+        "ethereum"
      usedTypes:
+        [{"typeCaster":"Mapping","arg":{"465200170687744372":"gnosis","5009297550715157269":"ethereum","3734403246176062136":"optimism","4949039107694359620":"arbitrum","4051577828743386545":"polygon","6433500567565415381":"avalanche","5142893604156789321":"wemix","3719320017875267166":"kroma","1346049177634351622":"celo","7264351850409363825":"mode","11344663589394136015":"bnb","15971525489660198786":"base"}}]
    }
```

```diff
    contract CommitStore2 (0x118a9389960F86390A4F14ce4C95D6ff076C6bFC) {
    +++ description: None
      values.getStaticConfig.chainSelector:
-        "5009297550715157269"
+        "ethereum"
      values.getStaticConfig.sourceChainSelector:
-        "465200170687744372"
+        "gnosis"
      usedTypes:
+        [{"typeCaster":"Mapping","arg":{"465200170687744372":"gnosis","5009297550715157269":"ethereum","3734403246176062136":"optimism","4949039107694359620":"arbitrum","4051577828743386545":"polygon","6433500567565415381":"avalanche","5142893604156789321":"wemix","3719320017875267166":"kroma","1346049177634351622":"celo","7264351850409363825":"mode","11344663589394136015":"bnb","15971525489660198786":"base"}}]
    }
```

```diff
    contract OffRamp10 (0x1C207dabc46902dF9028b27D6d301c3849b2D12c) {
    +++ description: None
      values.currentRateLimiterState:
-        {"tokens":"100000000000000000000000","lastUpdated":1718100575,"isEnabled":true,"capacity":"100000000000000000000000","rate":"167000000000000000000"}
      values.getStaticConfig.chainSelector:
-        "5009297550715157269"
+        "ethereum"
      values.getStaticConfig.sourceChainSelector:
-        "6433500567565415381"
+        "avalanche"
      usedTypes:
+        [{"typeCaster":"Mapping","arg":{"465200170687744372":"gnosis","5009297550715157269":"ethereum","3734403246176062136":"optimism","4949039107694359620":"arbitrum","4051577828743386545":"polygon","6433500567565415381":"avalanche","5142893604156789321":"wemix","3719320017875267166":"kroma","1346049177634351622":"celo","7264351850409363825":"mode","11344663589394136015":"bnb","15971525489660198786":"base"}}]
    }
```

```diff
    contract CommitStore11 (0x20718EfbC25Dba60FD51c2c81362b83f7C411A6D) {
    +++ description: None
      values.getStaticConfig.chainSelector:
-        "5009297550715157269"
+        "ethereum"
      values.getStaticConfig.sourceChainSelector:
-        "4051577828743386545"
+        "polygon"
      usedTypes:
+        [{"typeCaster":"Mapping","arg":{"465200170687744372":"gnosis","5009297550715157269":"ethereum","3734403246176062136":"optimism","4949039107694359620":"arbitrum","4051577828743386545":"polygon","6433500567565415381":"avalanche","5142893604156789321":"wemix","3719320017875267166":"kroma","1346049177634351622":"celo","7264351850409363825":"mode","11344663589394136015":"bnb","15971525489660198786":"base"}}]
    }
```

```diff
    contract CommitStore5 (0x2aa101BF99CaeF7fc1355D4c493a1fe187A007cE) {
    +++ description: None
      values.getStaticConfig.chainSelector:
-        "5009297550715157269"
+        "ethereum"
      values.getStaticConfig.sourceChainSelector:
-        "6433500567565415381"
+        "avalanche"
      usedTypes:
+        [{"typeCaster":"Mapping","arg":{"465200170687744372":"gnosis","5009297550715157269":"ethereum","3734403246176062136":"optimism","4949039107694359620":"arbitrum","4051577828743386545":"polygon","6433500567565415381":"avalanche","5142893604156789321":"wemix","3719320017875267166":"kroma","1346049177634351622":"celo","7264351850409363825":"mode","11344663589394136015":"bnb","15971525489660198786":"base"}}]
    }
```

```diff
    contract CommitStore14 (0x2D1708ff2a15adbE313eA8C6035aA24d0FBA1c77) {
    +++ description: None
      values.getStaticConfig.chainSelector:
-        "5009297550715157269"
+        "ethereum"
      values.getStaticConfig.sourceChainSelector:
-        "15971525489660198786"
+        "base"
      usedTypes:
+        [{"typeCaster":"Mapping","arg":{"465200170687744372":"gnosis","5009297550715157269":"ethereum","3734403246176062136":"optimism","4949039107694359620":"arbitrum","4051577828743386545":"polygon","6433500567565415381":"avalanche","5142893604156789321":"wemix","3719320017875267166":"kroma","1346049177634351622":"celo","7264351850409363825":"mode","11344663589394136015":"bnb","15971525489660198786":"base"}}]
    }
```

```diff
    contract CommitStore1 (0x31f6ab382DDeb9A316Ab61C3945a5292a50a89AB) {
    +++ description: None
      values.getStaticConfig.chainSelector:
-        "5009297550715157269"
+        "ethereum"
      values.getStaticConfig.sourceChainSelector:
-        "5142893604156789321"
+        "wemix"
      usedTypes:
+        [{"typeCaster":"Mapping","arg":{"465200170687744372":"gnosis","5009297550715157269":"ethereum","3734403246176062136":"optimism","4949039107694359620":"arbitrum","4051577828743386545":"polygon","6433500567565415381":"avalanche","5142893604156789321":"wemix","3719320017875267166":"kroma","1346049177634351622":"celo","7264351850409363825":"mode","11344663589394136015":"bnb","15971525489660198786":"base"}}]
    }
```

```diff
    contract OnRamp12 (0x333f976915195ba9044fD0cd603cEcE936f6264e) {
    +++ description: None
      values.currentRateLimiterState:
-        {"tokens":"600000000000000000000000","lastUpdated":1718100575,"isEnabled":true,"capacity":"600000000000000000000000","rate":"167000000000000000000"}
      values.staticConfigChains.1:
-        "4949039107694359620"
+        "arbitrum"
      values.staticConfigChains.0:
-        "5009297550715157269"
+        "ethereum"
      usedTypes:
+        [{"typeCaster":"Mapping","arg":{"465200170687744372":"gnosis","5009297550715157269":"ethereum","3734403246176062136":"optimism","4949039107694359620":"arbitrum","4051577828743386545":"polygon","6433500567565415381":"avalanche","5142893604156789321":"wemix","3719320017875267166":"kroma","1346049177634351622":"celo","7264351850409363825":"mode","11344663589394136015":"bnb","15971525489660198786":"base"}}]
    }
```

```diff
    contract OnRamp2 (0x35F0ca9Be776E4B38659944c257bDd0ba75F1B8B) {
    +++ description: None
      values.currentRateLimiterState:
-        {"tokens":"1000000000000000000000000","lastUpdated":1718100575,"isEnabled":true,"capacity":"1000000000000000000000000","rate":"277000000000000000000"}
      values.staticConfigChains.1:
-        "4051577828743386545"
+        "polygon"
      values.staticConfigChains.0:
-        "5009297550715157269"
+        "ethereum"
      usedTypes:
+        [{"typeCaster":"Mapping","arg":{"465200170687744372":"gnosis","5009297550715157269":"ethereum","3734403246176062136":"optimism","4949039107694359620":"arbitrum","4051577828743386545":"polygon","6433500567565415381":"avalanche","5142893604156789321":"wemix","3719320017875267166":"kroma","1346049177634351622":"celo","7264351850409363825":"mode","11344663589394136015":"bnb","15971525489660198786":"base"}}]
    }
```

```diff
    contract OffRamp1 (0x3a129e6C18b23d18BA9E6Aa14Dc2e79d1f91c6c5) {
    +++ description: None
      values.currentRateLimiterState:
-        {"tokens":"600000000000000000000000","lastUpdated":1718100575,"isEnabled":true,"capacity":"600000000000000000000000","rate":"167000000000000000000"}
      values.getStaticConfig.chainSelector:
-        "5009297550715157269"
+        "ethereum"
      values.getStaticConfig.sourceChainSelector:
-        "5142893604156789321"
+        "wemix"
      usedTypes:
+        [{"typeCaster":"Mapping","arg":{"465200170687744372":"gnosis","5009297550715157269":"ethereum","3734403246176062136":"optimism","4949039107694359620":"arbitrum","4051577828743386545":"polygon","6433500567565415381":"avalanche","5142893604156789321":"wemix","3719320017875267166":"kroma","1346049177634351622":"celo","7264351850409363825":"mode","11344663589394136015":"bnb","15971525489660198786":"base"}}]
    }
```

```diff
    contract CommitStore12 (0x3d3467e1036Ee25F6F4aa15e3Abf77443A23144C) {
    +++ description: None
      values.getStaticConfig.chainSelector:
-        "5009297550715157269"
+        "ethereum"
      values.getStaticConfig.sourceChainSelector:
-        "4949039107694359620"
+        "arbitrum"
      usedTypes:
+        [{"typeCaster":"Mapping","arg":{"465200170687744372":"gnosis","5009297550715157269":"ethereum","3734403246176062136":"optimism","4949039107694359620":"arbitrum","4051577828743386545":"polygon","6433500567565415381":"avalanche","5142893604156789321":"wemix","3719320017875267166":"kroma","1346049177634351622":"celo","7264351850409363825":"mode","11344663589394136015":"bnb","15971525489660198786":"base"}}]
    }
```

```diff
    contract OnRamp4 (0x3df8dAe2d123081c4D5E946E655F7c109B9Dd630) {
    +++ description: None
      values.currentRateLimiterState:
-        {"tokens":"1000000000000000000000000","lastUpdated":1718100575,"isEnabled":true,"capacity":"1000000000000000000000000","rate":"277000000000000000000"}
      values.staticConfigChains.1:
-        "6433500567565415381"
+        "avalanche"
      values.staticConfigChains.0:
-        "5009297550715157269"
+        "ethereum"
      usedTypes:
+        [{"typeCaster":"Mapping","arg":{"465200170687744372":"gnosis","5009297550715157269":"ethereum","3734403246176062136":"optimism","4949039107694359620":"arbitrum","4051577828743386545":"polygon","6433500567565415381":"avalanche","5142893604156789321":"wemix","3719320017875267166":"kroma","1346049177634351622":"celo","7264351850409363825":"mode","11344663589394136015":"bnb","15971525489660198786":"base"}}]
    }
```

```diff
    contract CommitStore10 (0x40c558575093eC1099CC21B020d9b8D13c74417F) {
    +++ description: None
      values.getStaticConfig.chainSelector:
-        "5009297550715157269"
+        "ethereum"
      values.getStaticConfig.sourceChainSelector:
-        "6433500567565415381"
+        "avalanche"
      usedTypes:
+        [{"typeCaster":"Mapping","arg":{"465200170687744372":"gnosis","5009297550715157269":"ethereum","3734403246176062136":"optimism","4949039107694359620":"arbitrum","4051577828743386545":"polygon","6433500567565415381":"avalanche","5142893604156789321":"wemix","3719320017875267166":"kroma","1346049177634351622":"celo","7264351850409363825":"mode","11344663589394136015":"bnb","15971525489660198786":"base"}}]
    }
```

```diff
    contract OffRamp9 (0x41627a90f2c6238f2BADAB72D5aB050B857fdAb5) {
    +++ description: None
      values.currentRateLimiterState:
-        {"tokens":"600000000000000000000000","lastUpdated":1718100575,"isEnabled":true,"capacity":"600000000000000000000000","rate":"167000000000000000000"}
      values.getStaticConfig.chainSelector:
-        "5009297550715157269"
+        "ethereum"
      values.getStaticConfig.sourceChainSelector:
-        "3734403246176062136"
+        "optimism"
      usedTypes:
+        [{"typeCaster":"Mapping","arg":{"465200170687744372":"gnosis","5009297550715157269":"ethereum","3734403246176062136":"optimism","4949039107694359620":"arbitrum","4051577828743386545":"polygon","6433500567565415381":"avalanche","5142893604156789321":"wemix","3719320017875267166":"kroma","1346049177634351622":"celo","7264351850409363825":"mode","11344663589394136015":"bnb","15971525489660198786":"base"}}]
    }
```

```diff
    contract EVM2EVMOnRamp (0x466a078d17e3706a9414ACc48029EE9Bae4C9b65) {
    +++ description: None
      values.currentRateLimiterState:
-        {"tokens":"2000000000000000000000000","lastUpdated":1718100575,"isEnabled":true,"capacity":"2000000000000000000000000","rate":"555550000000000000000"}
      values.staticConfigChains.1:
-        "7264351850409363825"
+        "mode"
      values.staticConfigChains.0:
-        "5009297550715157269"
+        "ethereum"
      usedTypes:
+        [{"typeCaster":"Mapping","arg":{"465200170687744372":"gnosis","5009297550715157269":"ethereum","3734403246176062136":"optimism","4949039107694359620":"arbitrum","4051577828743386545":"polygon","6433500567565415381":"avalanche","5142893604156789321":"wemix","3719320017875267166":"kroma","1346049177634351622":"celo","7264351850409363825":"mode","11344663589394136015":"bnb","15971525489660198786":"base"}}]
    }
```

```diff
    contract CommitStore4 (0x4af4B497c998007eF83ad130318eB2b925a79dc8) {
    +++ description: None
      values.getStaticConfig.chainSelector:
-        "5009297550715157269"
+        "ethereum"
      values.getStaticConfig.sourceChainSelector:
-        "3734403246176062136"
+        "optimism"
      usedTypes:
+        [{"typeCaster":"Mapping","arg":{"465200170687744372":"gnosis","5009297550715157269":"ethereum","3734403246176062136":"optimism","4949039107694359620":"arbitrum","4051577828743386545":"polygon","6433500567565415381":"avalanche","5142893604156789321":"wemix","3719320017875267166":"kroma","1346049177634351622":"celo","7264351850409363825":"mode","11344663589394136015":"bnb","15971525489660198786":"base"}}]
    }
```

```diff
    contract OffRamp5 (0x569940e02D4425eac61A7601632eC00d69f75c17) {
    +++ description: None
      values.currentRateLimiterState:
-        {"tokens":"1000000000000000000000000","lastUpdated":1718100575,"isEnabled":true,"capacity":"1000000000000000000000000","rate":"277000000000000000000"}
      values.getStaticConfig.chainSelector:
-        "5009297550715157269"
+        "ethereum"
      values.getStaticConfig.sourceChainSelector:
-        "6433500567565415381"
+        "avalanche"
      usedTypes:
+        [{"typeCaster":"Mapping","arg":{"465200170687744372":"gnosis","5009297550715157269":"ethereum","3734403246176062136":"optimism","4949039107694359620":"arbitrum","4051577828743386545":"polygon","6433500567565415381":"avalanche","5142893604156789321":"wemix","3719320017875267166":"kroma","1346049177634351622":"celo","7264351850409363825":"mode","11344663589394136015":"bnb","15971525489660198786":"base"}}]
    }
```

```diff
    contract OffRamp12 (0x61135E701a2214C170c5F596D0067798FEfbaaE4) {
    +++ description: None
      values.currentRateLimiterState:
-        {"tokens":"600000000000000000000000","lastUpdated":1718100575,"isEnabled":true,"capacity":"600000000000000000000000","rate":"167000000000000000000"}
      values.getStaticConfig.chainSelector:
-        "5009297550715157269"
+        "ethereum"
      values.getStaticConfig.sourceChainSelector:
-        "4949039107694359620"
+        "arbitrum"
      usedTypes:
+        [{"typeCaster":"Mapping","arg":{"465200170687744372":"gnosis","5009297550715157269":"ethereum","3734403246176062136":"optimism","4949039107694359620":"arbitrum","4051577828743386545":"polygon","6433500567565415381":"avalanche","5142893604156789321":"wemix","3719320017875267166":"kroma","1346049177634351622":"celo","7264351850409363825":"mode","11344663589394136015":"bnb","15971525489660198786":"base"}}]
    }
```

```diff
    contract CommitStore (0x76264869a3eBF51a59FCa5ABa84ee2867c7F190e) {
    +++ description: None
      values.getStaticConfig.chainSelector:
-        "5009297550715157269"
+        "ethereum"
      values.getStaticConfig.sourceChainSelector:
-        "7264351850409363825"
+        "mode"
      usedTypes:
+        [{"typeCaster":"Mapping","arg":{"465200170687744372":"gnosis","5009297550715157269":"ethereum","3734403246176062136":"optimism","4949039107694359620":"arbitrum","4051577828743386545":"polygon","6433500567565415381":"avalanche","5142893604156789321":"wemix","3719320017875267166":"kroma","1346049177634351622":"celo","7264351850409363825":"mode","11344663589394136015":"bnb","15971525489660198786":"base"}}]
    }
```

```diff
    contract CommitStore13 (0x7986C9892389854cAAbAC785ff18123B0070a5Fd) {
    +++ description: None
      values.getStaticConfig.chainSelector:
-        "5009297550715157269"
+        "ethereum"
      values.getStaticConfig.sourceChainSelector:
-        "11344663589394136015"
+        "bnb"
      usedTypes:
+        [{"typeCaster":"Mapping","arg":{"465200170687744372":"gnosis","5009297550715157269":"ethereum","3734403246176062136":"optimism","4949039107694359620":"arbitrum","4051577828743386545":"polygon","6433500567565415381":"avalanche","5142893604156789321":"wemix","3719320017875267166":"kroma","1346049177634351622":"celo","7264351850409363825":"mode","11344663589394136015":"bnb","15971525489660198786":"base"}}]
    }
```

```diff
    contract OffRamp3 (0x7Afe7088aff57173565F4b034167643AA8b9171c) {
    +++ description: None
      values.currentRateLimiterState:
-        {"tokens":"5000000000000000000000000","lastUpdated":1718100575,"isEnabled":true,"capacity":"5000000000000000000000000","rate":"1389000000000000000000"}
      values.getStaticConfig.chainSelector:
-        "5009297550715157269"
+        "ethereum"
      values.getStaticConfig.sourceChainSelector:
-        "11344663589394136015"
+        "bnb"
      usedTypes:
+        [{"typeCaster":"Mapping","arg":{"465200170687744372":"gnosis","5009297550715157269":"ethereum","3734403246176062136":"optimism","4949039107694359620":"arbitrum","4051577828743386545":"polygon","6433500567565415381":"avalanche","5142893604156789321":"wemix","3719320017875267166":"kroma","1346049177634351622":"celo","7264351850409363825":"mode","11344663589394136015":"bnb","15971525489660198786":"base"}}]
    }
```

```diff
    contract Router (0x80226fc0Ee2b096224EeAc085Bb9a8cba1146f7D) {
    +++ description: None
      values.offRamps.9:
-        ["7264351850409363825","0xE8af3b68eDfFf65Ce48648009982380701f09B92"]
+        {"sourceChainSelector":"mode","offRamp":"0xE8af3b68eDfFf65Ce48648009982380701f09B92"}
      values.offRamps.8:
-        ["1346049177634351622","0xd5083684eE92dDeA117636ae5E2F1cb7fE4dfd46"]
+        {"sourceChainSelector":"celo","offRamp":"0xd5083684eE92dDeA117636ae5E2F1cb7fE4dfd46"}
      values.offRamps.7:
-        ["465200170687744372","0xE93ec2A57e38C8541c893348cCafEAB01F7D47d4"]
+        {"sourceChainSelector":"gnosis","offRamp":"0xE93ec2A57e38C8541c893348cCafEAB01F7D47d4"}
      values.offRamps.6:
-        ["5142893604156789321","0x3a129e6C18b23d18BA9E6Aa14Dc2e79d1f91c6c5"]
+        {"sourceChainSelector":"wemix","offRamp":"0x3a129e6C18b23d18BA9E6Aa14Dc2e79d1f91c6c5"}
      values.offRamps.5:
-        ["15971525489660198786","0xdf85c8381954694E74abD07488f452b4c2Cddfb3"]
+        {"sourceChainSelector":"base","offRamp":"0xdf85c8381954694E74abD07488f452b4c2Cddfb3"}
      values.offRamps.4:
-        ["11344663589394136015","0x7Afe7088aff57173565F4b034167643AA8b9171c"]
+        {"sourceChainSelector":"bnb","offRamp":"0x7Afe7088aff57173565F4b034167643AA8b9171c"}
      values.offRamps.3:
-        ["6433500567565415381","0x569940e02D4425eac61A7601632eC00d69f75c17"]
+        {"sourceChainSelector":"avalanche","offRamp":"0x569940e02D4425eac61A7601632eC00d69f75c17"}
      values.offRamps.2:
-        ["4949039107694359620","0xeFC4a18af59398FF23bfe7325F2401aD44286F4d"]
+        {"sourceChainSelector":"arbitrum","offRamp":"0xeFC4a18af59398FF23bfe7325F2401aD44286F4d"}
      values.offRamps.1:
-        ["4051577828743386545","0x0af338F0E314c7551bcE0EF516d46d855b0Ee395"]
+        {"sourceChainSelector":"polygon","offRamp":"0x0af338F0E314c7551bcE0EF516d46d855b0Ee395"}
      values.offRamps.0:
-        ["3734403246176062136","0xB095900fB91db00E6abD247A5A5AD1cee3F20BF7"]
+        {"sourceChainSelector":"optimism","offRamp":"0xB095900fB91db00E6abD247A5A5AD1cee3F20BF7"}
      usedTypes:
+        [{"typeCaster":"Mapping","arg":{"465200170687744372":"gnosis","5009297550715157269":"ethereum","3734403246176062136":"optimism","4949039107694359620":"arbitrum","4051577828743386545":"polygon","6433500567565415381":"avalanche","5142893604156789321":"wemix","3719320017875267166":"kroma","1346049177634351622":"celo","7264351850409363825":"mode","11344663589394136015":"bnb","15971525489660198786":"base"}}]
    }
```

```diff
    contract CommitStore (0x831097033C88c82a7F1897b168Aa88cC44540C8f) {
    +++ description: None
      values.getStaticConfig.chainSelector:
-        "5009297550715157269"
+        "ethereum"
      values.getStaticConfig.sourceChainSelector:
-        "1346049177634351622"
+        "celo"
      usedTypes:
+        [{"typeCaster":"Mapping","arg":{"465200170687744372":"gnosis","5009297550715157269":"ethereum","3734403246176062136":"optimism","4949039107694359620":"arbitrum","4051577828743386545":"polygon","6433500567565415381":"avalanche","5142893604156789321":"wemix","3719320017875267166":"kroma","1346049177634351622":"celo","7264351850409363825":"mode","11344663589394136015":"bnb","15971525489660198786":"base"}}]
    }
```

```diff
    contract OnRamp1 (0x86B47d8411006874eEf8E4584BdFD7be8e5549d1) {
    +++ description: None
      values.currentRateLimiterState:
-        {"tokens":"5000000000000000000000000","lastUpdated":1718100575,"isEnabled":true,"capacity":"5000000000000000000000000","rate":"1389000000000000000000"}
      values.staticConfigChains.1:
-        "3734403246176062136"
+        "optimism"
      values.staticConfigChains.0:
-        "5009297550715157269"
+        "ethereum"
      usedTypes:
+        [{"typeCaster":"Mapping","arg":{"465200170687744372":"gnosis","5009297550715157269":"ethereum","3734403246176062136":"optimism","4949039107694359620":"arbitrum","4051577828743386545":"polygon","6433500567565415381":"avalanche","5142893604156789321":"wemix","3719320017875267166":"kroma","1346049177634351622":"celo","7264351850409363825":"mode","11344663589394136015":"bnb","15971525489660198786":"base"}}]
    }
```

```diff
    contract CommitStore3 (0x87c55D48DF6EF7B08153Ab079e76bFEcbb793D75) {
    +++ description: None
      values.getStaticConfig.chainSelector:
-        "5009297550715157269"
+        "ethereum"
      values.getStaticConfig.sourceChainSelector:
-        "11344663589394136015"
+        "bnb"
      usedTypes:
+        [{"typeCaster":"Mapping","arg":{"465200170687744372":"gnosis","5009297550715157269":"ethereum","3734403246176062136":"optimism","4949039107694359620":"arbitrum","4051577828743386545":"polygon","6433500567565415381":"avalanche","5142893604156789321":"wemix","3719320017875267166":"kroma","1346049177634351622":"celo","7264351850409363825":"mode","11344663589394136015":"bnb","15971525489660198786":"base"}}]
    }
```

```diff
    contract CommitStore9 (0x8bEFCa744c6f2b567b1863dcF055C593afdC11A0) {
    +++ description: None
      values.getStaticConfig.chainSelector:
-        "5009297550715157269"
+        "ethereum"
      values.getStaticConfig.sourceChainSelector:
-        "3734403246176062136"
+        "optimism"
      usedTypes:
+        [{"typeCaster":"Mapping","arg":{"465200170687744372":"gnosis","5009297550715157269":"ethereum","3734403246176062136":"optimism","4949039107694359620":"arbitrum","4051577828743386545":"polygon","6433500567565415381":"avalanche","5142893604156789321":"wemix","3719320017875267166":"kroma","1346049177634351622":"celo","7264351850409363825":"mode","11344663589394136015":"bnb","15971525489660198786":"base"}}]
    }
```

```diff
    contract CommitStore6 (0x8DC27D621c41a32140e22E2a4dAf1259639BAe04) {
    +++ description: None
      values.getStaticConfig.chainSelector:
-        "5009297550715157269"
+        "ethereum"
      values.getStaticConfig.sourceChainSelector:
-        "15971525489660198786"
+        "base"
      usedTypes:
+        [{"typeCaster":"Mapping","arg":{"465200170687744372":"gnosis","5009297550715157269":"ethereum","3734403246176062136":"optimism","4949039107694359620":"arbitrum","4051577828743386545":"polygon","6433500567565415381":"avalanche","5142893604156789321":"wemix","3719320017875267166":"kroma","1346049177634351622":"celo","7264351850409363825":"mode","11344663589394136015":"bnb","15971525489660198786":"base"}}]
    }
```

```diff
    contract OnRamp5 (0x91D25A56Db77aD5147437d8B83Eb563D46eBFa69) {
    +++ description: None
      values.currentRateLimiterState:
-        {"tokens":"5000000000000000000000000","lastUpdated":1718100575,"isEnabled":true,"capacity":"5000000000000000000000000","rate":"1389000000000000000000"}
      values.staticConfigChains.1:
-        "11344663589394136015"
+        "bnb"
      values.staticConfigChains.0:
-        "5009297550715157269"
+        "ethereum"
      usedTypes:
+        [{"typeCaster":"Mapping","arg":{"465200170687744372":"gnosis","5009297550715157269":"ethereum","3734403246176062136":"optimism","4949039107694359620":"arbitrum","4051577828743386545":"polygon","6433500567565415381":"avalanche","5142893604156789321":"wemix","3719320017875267166":"kroma","1346049177634351622":"celo","7264351850409363825":"mode","11344663589394136015":"bnb","15971525489660198786":"base"}}]
    }
```

```diff
    contract OnRamp3 (0x925228D7B82d883Dde340A55Fe8e6dA56244A22C) {
    +++ description: None
      values.currentRateLimiterState:
-        {"tokens":"5000000000000000000000000","lastUpdated":1718100575,"isEnabled":true,"capacity":"5000000000000000000000000","rate":"1389000000000000000000"}
      values.staticConfigChains.1:
-        "4949039107694359620"
+        "arbitrum"
      values.staticConfigChains.0:
-        "5009297550715157269"
+        "ethereum"
      usedTypes:
+        [{"typeCaster":"Mapping","arg":{"465200170687744372":"gnosis","5009297550715157269":"ethereum","3734403246176062136":"optimism","4949039107694359620":"arbitrum","4051577828743386545":"polygon","6433500567565415381":"avalanche","5142893604156789321":"wemix","3719320017875267166":"kroma","1346049177634351622":"celo","7264351850409363825":"mode","11344663589394136015":"bnb","15971525489660198786":"base"}}]
    }
```

```diff
-   Status: DELETED
    contract BETS (0x94025780a1aB58868D9B2dBBB775f44b32e8E6e5)
    +++ description: None
```

```diff
    contract CommitStore8 (0x9B2EEd6A1e16cB50Ed4c876D2dD69468B21b7749) {
    +++ description: None
      values.getStaticConfig.chainSelector:
-        "5009297550715157269"
+        "ethereum"
      values.getStaticConfig.sourceChainSelector:
-        "4949039107694359620"
+        "arbitrum"
      usedTypes:
+        [{"typeCaster":"Mapping","arg":{"465200170687744372":"gnosis","5009297550715157269":"ethereum","3734403246176062136":"optimism","4949039107694359620":"arbitrum","4051577828743386545":"polygon","6433500567565415381":"avalanche","5142893604156789321":"wemix","3719320017875267166":"kroma","1346049177634351622":"celo","7264351850409363825":"mode","11344663589394136015":"bnb","15971525489660198786":"base"}}]
    }
```

```diff
    contract OffRamp4 (0xB095900fB91db00E6abD247A5A5AD1cee3F20BF7) {
    +++ description: None
      values.currentRateLimiterState:
-        {"tokens":"5000000000000000000000000","lastUpdated":1718100575,"isEnabled":true,"capacity":"5000000000000000000000000","rate":"1389000000000000000000"}
      values.getStaticConfig.chainSelector:
-        "5009297550715157269"
+        "ethereum"
      values.getStaticConfig.sourceChainSelector:
-        "3734403246176062136"
+        "optimism"
      usedTypes:
+        [{"typeCaster":"Mapping","arg":{"465200170687744372":"gnosis","5009297550715157269":"ethereum","3734403246176062136":"optimism","4949039107694359620":"arbitrum","4051577828743386545":"polygon","6433500567565415381":"avalanche","5142893604156789321":"wemix","3719320017875267166":"kroma","1346049177634351622":"celo","7264351850409363825":"mode","11344663589394136015":"bnb","15971525489660198786":"base"}}]
    }
```

```diff
-   Status: DELETED
    contract TokenMessenger (0xBd3fa81B58Ba92a82136038B25aDec7066af3155)
    +++ description: None
```

```diff
    contract OffRamp11 (0xBDd822f3bC2EAB6818CfA3053107831D4E93fE72) {
    +++ description: None
      values.currentRateLimiterState:
-        {"tokens":"600000000000000000000000","lastUpdated":1718100575,"isEnabled":true,"capacity":"600000000000000000000000","rate":"167000000000000000000"}
      values.getStaticConfig.chainSelector:
-        "5009297550715157269"
+        "ethereum"
      values.getStaticConfig.sourceChainSelector:
-        "4051577828743386545"
+        "polygon"
      usedTypes:
+        [{"typeCaster":"Mapping","arg":{"465200170687744372":"gnosis","5009297550715157269":"ethereum","3734403246176062136":"optimism","4949039107694359620":"arbitrum","4051577828743386545":"polygon","6433500567565415381":"avalanche","5142893604156789321":"wemix","3719320017875267166":"kroma","1346049177634351622":"celo","7264351850409363825":"mode","11344663589394136015":"bnb","15971525489660198786":"base"}}]
    }
```

```diff
-   Status: DELETED
    contract TokenMinter (0xc4922d64a24675E16e1586e3e3Aa56C06fABe907)
    +++ description: None
```

```diff
    contract OffRamp13 (0xC7176620daf49A39a17FF9A6C2DE1eAA6033EE94) {
    +++ description: None
      values.currentRateLimiterState:
-        {"tokens":"100000000000000000000000","lastUpdated":1718100575,"isEnabled":true,"capacity":"100000000000000000000000","rate":"167000000000000000000"}
      values.getStaticConfig.chainSelector:
-        "5009297550715157269"
+        "ethereum"
      values.getStaticConfig.sourceChainSelector:
-        "11344663589394136015"
+        "bnb"
      usedTypes:
+        [{"typeCaster":"Mapping","arg":{"465200170687744372":"gnosis","5009297550715157269":"ethereum","3734403246176062136":"optimism","4949039107694359620":"arbitrum","4051577828743386545":"polygon","6433500567565415381":"avalanche","5142893604156789321":"wemix","3719320017875267166":"kroma","1346049177634351622":"celo","7264351850409363825":"mode","11344663589394136015":"bnb","15971525489660198786":"base"}}]
    }
```

```diff
    contract OnRamp7 (0xCbE7e5DA76dC99Ac317adF6d99137005FDA4E2C4) {
    +++ description: None
      values.currentRateLimiterState:
-        {"tokens":"600000000000000000000000","lastUpdated":1718100575,"isEnabled":true,"capacity":"600000000000000000000000","rate":"167000000000000000000"}
      values.staticConfigChains.1:
-        "5142893604156789321"
+        "wemix"
      values.staticConfigChains.0:
-        "5009297550715157269"
+        "ethereum"
      usedTypes:
+        [{"typeCaster":"Mapping","arg":{"465200170687744372":"gnosis","5009297550715157269":"ethereum","3734403246176062136":"optimism","4949039107694359620":"arbitrum","4051577828743386545":"polygon","6433500567565415381":"avalanche","5142893604156789321":"wemix","3719320017875267166":"kroma","1346049177634351622":"celo","7264351850409363825":"mode","11344663589394136015":"bnb","15971525489660198786":"base"}}]
    }
```

```diff
    contract OnRamp9 (0xCC19bC4D43d17eB6859F0d22BA300967C97780b0) {
    +++ description: None
      values.currentRateLimiterState:
-        {"tokens":"600000000000000000000000","lastUpdated":1718100575,"isEnabled":true,"capacity":"600000000000000000000000","rate":"167000000000000000000"}
      values.staticConfigChains.1:
-        "3734403246176062136"
+        "optimism"
      values.staticConfigChains.0:
-        "5009297550715157269"
+        "ethereum"
      usedTypes:
+        [{"typeCaster":"Mapping","arg":{"465200170687744372":"gnosis","5009297550715157269":"ethereum","3734403246176062136":"optimism","4949039107694359620":"arbitrum","4051577828743386545":"polygon","6433500567565415381":"avalanche","5142893604156789321":"wemix","3719320017875267166":"kroma","1346049177634351622":"celo","7264351850409363825":"mode","11344663589394136015":"bnb","15971525489660198786":"base"}}]
    }
```

```diff
    contract OnRamp10 (0xd0B5Fc9790a6085b048b8Aa1ED26ca2b3b282CF2) {
    +++ description: None
      values.currentRateLimiterState:
-        {"tokens":"100000000000000000000000","lastUpdated":1718100575,"isEnabled":true,"capacity":"100000000000000000000000","rate":"167000000000000000000"}
      values.staticConfigChains.1:
-        "6433500567565415381"
+        "avalanche"
      values.staticConfigChains.0:
-        "5009297550715157269"
+        "ethereum"
      usedTypes:
+        [{"typeCaster":"Mapping","arg":{"465200170687744372":"gnosis","5009297550715157269":"ethereum","3734403246176062136":"optimism","4949039107694359620":"arbitrum","4051577828743386545":"polygon","6433500567565415381":"avalanche","5142893604156789321":"wemix","3719320017875267166":"kroma","1346049177634351622":"celo","7264351850409363825":"mode","11344663589394136015":"bnb","15971525489660198786":"base"}}]
    }
```

```diff
    contract CommitStore7 (0xD37a60E8C36E802D2E1a6321832Ee85556Beeb76) {
    +++ description: None
      values.getStaticConfig.chainSelector:
-        "5009297550715157269"
+        "ethereum"
      values.getStaticConfig.sourceChainSelector:
-        "4051577828743386545"
+        "polygon"
      usedTypes:
+        [{"typeCaster":"Mapping","arg":{"465200170687744372":"gnosis","5009297550715157269":"ethereum","3734403246176062136":"optimism","4949039107694359620":"arbitrum","4051577828743386545":"polygon","6433500567565415381":"avalanche","5142893604156789321":"wemix","3719320017875267166":"kroma","1346049177634351622":"celo","7264351850409363825":"mode","11344663589394136015":"bnb","15971525489660198786":"base"}}]
    }
```

```diff
    contract EVM2EVMOffRamp (0xd5083684eE92dDeA117636ae5E2F1cb7fE4dfd46) {
    +++ description: None
      values.currentRateLimiterState:
-        {"tokens":"2000000000000000000000000","lastUpdated":1718100575,"isEnabled":true,"capacity":"2000000000000000000000000","rate":"555550000000000000000"}
      values.getStaticConfig.chainSelector:
-        "5009297550715157269"
+        "ethereum"
      values.getStaticConfig.sourceChainSelector:
-        "1346049177634351622"
+        "celo"
      usedTypes:
+        [{"typeCaster":"Mapping","arg":{"465200170687744372":"gnosis","5009297550715157269":"ethereum","3734403246176062136":"optimism","4949039107694359620":"arbitrum","4051577828743386545":"polygon","6433500567565415381":"avalanche","5142893604156789321":"wemix","3719320017875267166":"kroma","1346049177634351622":"celo","7264351850409363825":"mode","11344663589394136015":"bnb","15971525489660198786":"base"}}]
    }
```

```diff
    contract OnRamp13 (0xdF1d7FD22aC3aB5171E275796f123224039f3b24) {
    +++ description: None
      values.currentRateLimiterState:
-        {"tokens":"100000000000000000000000","lastUpdated":1718100575,"isEnabled":true,"capacity":"100000000000000000000000","rate":"167000000000000000000"}
      values.staticConfigChains.1:
-        "11344663589394136015"
+        "bnb"
      values.staticConfigChains.0:
-        "5009297550715157269"
+        "ethereum"
      usedTypes:
+        [{"typeCaster":"Mapping","arg":{"465200170687744372":"gnosis","5009297550715157269":"ethereum","3734403246176062136":"optimism","4949039107694359620":"arbitrum","4051577828743386545":"polygon","6433500567565415381":"avalanche","5142893604156789321":"wemix","3719320017875267166":"kroma","1346049177634351622":"celo","7264351850409363825":"mode","11344663589394136015":"bnb","15971525489660198786":"base"}}]
    }
```

```diff
    contract OffRamp6 (0xdf85c8381954694E74abD07488f452b4c2Cddfb3) {
    +++ description: None
      values.currentRateLimiterState:
-        {"tokens":"2000000000000000000000000","lastUpdated":1718100575,"isEnabled":true,"capacity":"2000000000000000000000000","rate":"555550000000000000000"}
      values.getStaticConfig.chainSelector:
-        "5009297550715157269"
+        "ethereum"
      values.getStaticConfig.sourceChainSelector:
-        "15971525489660198786"
+        "base"
      usedTypes:
+        [{"typeCaster":"Mapping","arg":{"465200170687744372":"gnosis","5009297550715157269":"ethereum","3734403246176062136":"optimism","4949039107694359620":"arbitrum","4051577828743386545":"polygon","6433500567565415381":"avalanche","5142893604156789321":"wemix","3719320017875267166":"kroma","1346049177634351622":"celo","7264351850409363825":"mode","11344663589394136015":"bnb","15971525489660198786":"base"}}]
    }
```

```diff
    contract OnRamp6 (0xe2c2AB221AA0b957805f229d2AA57fBE2f4dADf7) {
    +++ description: None
      values.currentRateLimiterState:
-        {"tokens":"2000000000000000000000000","lastUpdated":1718100575,"isEnabled":true,"capacity":"2000000000000000000000000","rate":"555550000000000000000"}
      values.staticConfigChains.1:
-        "15971525489660198786"
+        "base"
      values.staticConfigChains.0:
-        "5009297550715157269"
+        "ethereum"
      usedTypes:
+        [{"typeCaster":"Mapping","arg":{"465200170687744372":"gnosis","5009297550715157269":"ethereum","3734403246176062136":"optimism","4949039107694359620":"arbitrum","4051577828743386545":"polygon","6433500567565415381":"avalanche","5142893604156789321":"wemix","3719320017875267166":"kroma","1346049177634351622":"celo","7264351850409363825":"mode","11344663589394136015":"bnb","15971525489660198786":"base"}}]
    }
```

```diff
    contract OnRamp14 (0xe2Eb229e88F56691e96bb98256707Bc62160FE73) {
    +++ description: None
      values.currentRateLimiterState:
-        {"tokens":"600000000000000000000000","lastUpdated":1718100575,"isEnabled":true,"capacity":"600000000000000000000000","rate":"167000000000000000000"}
      values.staticConfigChains.1:
-        "15971525489660198786"
+        "base"
      values.staticConfigChains.0:
-        "5009297550715157269"
+        "ethereum"
      usedTypes:
+        [{"typeCaster":"Mapping","arg":{"465200170687744372":"gnosis","5009297550715157269":"ethereum","3734403246176062136":"optimism","4949039107694359620":"arbitrum","4051577828743386545":"polygon","6433500567565415381":"avalanche","5142893604156789321":"wemix","3719320017875267166":"kroma","1346049177634351622":"celo","7264351850409363825":"mode","11344663589394136015":"bnb","15971525489660198786":"base"}}]
    }
```

```diff
    contract EVM2EVMOffRamp (0xE8af3b68eDfFf65Ce48648009982380701f09B92) {
    +++ description: None
      values.currentRateLimiterState:
-        {"tokens":"2000000000000000000000000","lastUpdated":1718100575,"isEnabled":true,"capacity":"2000000000000000000000000","rate":"555550000000000000000"}
      values.getStaticConfig.chainSelector:
-        "5009297550715157269"
+        "ethereum"
      values.getStaticConfig.sourceChainSelector:
-        "7264351850409363825"
+        "mode"
      usedTypes:
+        [{"typeCaster":"Mapping","arg":{"465200170687744372":"gnosis","5009297550715157269":"ethereum","3734403246176062136":"optimism","4949039107694359620":"arbitrum","4051577828743386545":"polygon","6433500567565415381":"avalanche","5142893604156789321":"wemix","3719320017875267166":"kroma","1346049177634351622":"celo","7264351850409363825":"mode","11344663589394136015":"bnb","15971525489660198786":"base"}}]
    }
```

```diff
    contract OffRamp2 (0xE93ec2A57e38C8541c893348cCafEAB01F7D47d4) {
    +++ description: None
      values.currentRateLimiterState:
-        {"tokens":"100000000000000000000000","lastUpdated":1718100575,"isEnabled":true,"capacity":"100000000000000000000000","rate":"167000000000000000000"}
      values.getStaticConfig.chainSelector:
-        "5009297550715157269"
+        "ethereum"
      values.getStaticConfig.sourceChainSelector:
-        "465200170687744372"
+        "gnosis"
      usedTypes:
+        [{"typeCaster":"Mapping","arg":{"465200170687744372":"gnosis","5009297550715157269":"ethereum","3734403246176062136":"optimism","4949039107694359620":"arbitrum","4051577828743386545":"polygon","6433500567565415381":"avalanche","5142893604156789321":"wemix","3719320017875267166":"kroma","1346049177634351622":"celo","7264351850409363825":"mode","11344663589394136015":"bnb","15971525489660198786":"base"}}]
    }
```

```diff
    contract EVM2EVMOnRamp (0xEd5bE9508ae56531cc0EDe6A3bD588Eb9E2e3cfa) {
    +++ description: None
      values.currentRateLimiterState:
-        {"tokens":"2000000000000000000000000","lastUpdated":1718100575,"isEnabled":true,"capacity":"2000000000000000000000000","rate":"555550000000000000000"}
      values.staticConfigChains.1:
-        "1346049177634351622"
+        "celo"
      values.staticConfigChains.0:
-        "5009297550715157269"
+        "ethereum"
      usedTypes:
+        [{"typeCaster":"Mapping","arg":{"465200170687744372":"gnosis","5009297550715157269":"ethereum","3734403246176062136":"optimism","4949039107694359620":"arbitrum","4051577828743386545":"polygon","6433500567565415381":"avalanche","5142893604156789321":"wemix","3719320017875267166":"kroma","1346049177634351622":"celo","7264351850409363825":"mode","11344663589394136015":"bnb","15971525489660198786":"base"}}]
    }
```

```diff
    contract OffRamp8 (0xeFC4a18af59398FF23bfe7325F2401aD44286F4d) {
    +++ description: None
      values.currentRateLimiterState:
-        {"tokens":"5000000000000000000000000","lastUpdated":1718100575,"isEnabled":true,"capacity":"5000000000000000000000000","rate":"1389000000000000000000"}
      values.getStaticConfig.chainSelector:
-        "5009297550715157269"
+        "ethereum"
      values.getStaticConfig.sourceChainSelector:
-        "4949039107694359620"
+        "arbitrum"
      usedTypes:
+        [{"typeCaster":"Mapping","arg":{"465200170687744372":"gnosis","5009297550715157269":"ethereum","3734403246176062136":"optimism","4949039107694359620":"arbitrum","4051577828743386545":"polygon","6433500567565415381":"avalanche","5142893604156789321":"wemix","3719320017875267166":"kroma","1346049177634351622":"celo","7264351850409363825":"mode","11344663589394136015":"bnb","15971525489660198786":"base"}}]
    }
```

```diff
    contract OnRamp8 (0xF538dA6c673A30338269655f4e019B71ba58CFd4) {
    +++ description: None
      values.currentRateLimiterState:
-        {"tokens":"100000000000000000000000","lastUpdated":1718100575,"isEnabled":true,"capacity":"100000000000000000000000","rate":"167000000000000000000"}
      values.staticConfigChains.1:
-        "465200170687744372"
+        "gnosis"
      values.staticConfigChains.0:
-        "5009297550715157269"
+        "ethereum"
      usedTypes:
+        [{"typeCaster":"Mapping","arg":{"465200170687744372":"gnosis","5009297550715157269":"ethereum","3734403246176062136":"optimism","4949039107694359620":"arbitrum","4051577828743386545":"polygon","6433500567565415381":"avalanche","5142893604156789321":"wemix","3719320017875267166":"kroma","1346049177634351622":"celo","7264351850409363825":"mode","11344663589394136015":"bnb","15971525489660198786":"base"}}]
    }
```

```diff
-   Status: DELETED
    contract CCIPTokenProxy (0xF9F5bcd3a50653387ee0b9d60C1905854093e8Fb)
    +++ description: None
```

```diff
    contract OffRamp14 (0xfF51C00546AA3d9051a4B96Ae81346E14709CD24) {
    +++ description: None
      values.currentRateLimiterState:
-        {"tokens":"600000000000000000000000","lastUpdated":1718100575,"isEnabled":true,"capacity":"600000000000000000000000","rate":"167000000000000000000"}
      values.getStaticConfig.chainSelector:
-        "5009297550715157269"
+        "ethereum"
      values.getStaticConfig.sourceChainSelector:
-        "15971525489660198786"
+        "base"
      usedTypes:
+        [{"typeCaster":"Mapping","arg":{"465200170687744372":"gnosis","5009297550715157269":"ethereum","3734403246176062136":"optimism","4949039107694359620":"arbitrum","4051577828743386545":"polygon","6433500567565415381":"avalanche","5142893604156789321":"wemix","3719320017875267166":"kroma","1346049177634351622":"celo","7264351850409363825":"mode","11344663589394136015":"bnb","15971525489660198786":"base"}}]
    }
```

```diff
-   Status: DELETED
    contract Proxy (0xffffffaEff0B96Ea8e4f94b2253f31abdD875847)
    +++ description: None
```

Generated with discovered.json: 0x4125745c53ae7e2baa16f1d46316faf92f7ea21c

# Diff at Tue, 11 Jun 2024 10:09:59 GMT:

- author: vincfurc (<10850139+vincfurc@users.noreply.github.com>)
- current block number: 20067895

## Description

Provide description of changes. This section will be preserved.

## Initial discovery

```diff
+   Status: CREATED
    contract PriceRegistry (0x020082A7a9c2510e1921116001152DEE4da81985)
    +++ description: None
```

```diff
+   Status: CREATED
    contract LockReleaseTokenPool (0x047204D42d93a6471F7c9Ec94292B4B00E8e0786)
    +++ description: None
```

```diff
+   Status: CREATED
    contract BurnMintTokenPool (0x057152DB365B47851B0A0bd431644b8eE21fE1b4)
    +++ description: None
```

```diff
+   Status: CREATED
    contract BurnMintTokenPool (0x06f9817a91595E1B595F789Fb91529e8651da9B8)
    +++ description: None
```

```diff
+   Status: CREATED
    contract MessageTransmitter (0x0a992d191DEeC32aFe36203Ad87D7d289a738F81)
    +++ description: None
```

```diff
+   Status: CREATED
    contract OffRamp7 (0x0af338F0E314c7551bcE0EF516d46d855b0Ee395)
    +++ description: None
```

```diff
+   Status: CREATED
    contract LockReleaseTokenPool (0x0C291Ae31730901515e5C46406A6ba2d88c1f4aA)
    +++ description: None
```

```diff
+   Status: CREATED
    contract LockReleaseTokenPool (0x0DAFed8dAF42040dB2c6227ca2AEB14D9C8B2602)
    +++ description: None
```

```diff
+   Status: CREATED
    contract OnRamp11 (0x0f27c8532457b66D6037141DEB0ed479Dad04B3c)
    +++ description: None
```

```diff
+   Status: CREATED
    contract BurnMintTokenPool (0x1175E4CFd6a73A4c1F1f2c1400a08D88554FA62e)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ManyChainMultiSig (0x117ec8aD107976e1dBCc21717ff78407Bc36aADc)
    +++ description: None
```

```diff
+   Status: CREATED
    contract CommitStore2 (0x118a9389960F86390A4F14ce4C95D6ff076C6bFC)
    +++ description: None
```

```diff
+   Status: CREATED
    contract BurnMintTokenPool (0x123ed44f3B863a684437Ebf18F8a744c250Ee5cA)
    +++ description: None
```

```diff
+   Status: CREATED
    contract BurnMintTokenPool (0x1580C7d4754f5671626e42f0372D56104B092CFA)
    +++ description: None
```

```diff
+   Status: CREATED
    contract OffRamp10 (0x1C207dabc46902dF9028b27D6d301c3849b2D12c)
    +++ description: None
```

```diff
+   Status: CREATED
    contract LockReleaseTokenPool (0x1e28DD4b559a7fF546b1e84691129508b2C9C3D3)
    +++ description: None
```

```diff
+   Status: CREATED
    contract CommitStore11 (0x20718EfbC25Dba60FD51c2c81362b83f7C411A6D)
    +++ description: None
```

```diff
+   Status: CREATED
    contract LockReleaseTokenPool (0x21377fe476Fb8587CbAFd47155093597Fa4df45E)
    +++ description: None
```

```diff
+   Status: CREATED
    contract BurnMintTokenPool (0x2764910B500689BbC9DB16c7AD61c6DD32FDE73B)
    +++ description: None
```

```diff
+   Status: CREATED
    contract CommitStore5 (0x2aa101BF99CaeF7fc1355D4c493a1fe187A007cE)
    +++ description: None
```

```diff
+   Status: CREATED
    contract CommitStore14 (0x2D1708ff2a15adbE313eA8C6035aA24d0FBA1c77)
    +++ description: None
```

```diff
+   Status: CREATED
    contract BurnMintTokenPool (0x2dd317E7e36544C5222818F228d607c209517470)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ManyChainMultiSig (0x2F2A3e36CE5Fb0924C414BEB1D98B531Cdf17e0B)
    +++ description: None
```

```diff
+   Status: CREATED
    contract CommitStore1 (0x31f6ab382DDeb9A316Ab61C3945a5292a50a89AB)
    +++ description: None
```

```diff
+   Status: CREATED
    contract OnRamp12 (0x333f976915195ba9044fD0cd603cEcE936f6264e)
    +++ description: None
```

```diff
+   Status: CREATED
    contract OnRamp2 (0x35F0ca9Be776E4B38659944c257bDd0ba75F1B8B)
    +++ description: None
```

```diff
+   Status: CREATED
    contract OffRamp1 (0x3a129e6C18b23d18BA9E6Aa14Dc2e79d1f91c6c5)
    +++ description: None
```

```diff
+   Status: CREATED
    contract CommitStore12 (0x3d3467e1036Ee25F6F4aa15e3Abf77443A23144C)
    +++ description: None
```

```diff
+   Status: CREATED
    contract OnRamp4 (0x3df8dAe2d123081c4D5E946E655F7c109B9Dd630)
    +++ description: None
```

```diff
+   Status: CREATED
    contract CommitStore10 (0x40c558575093eC1099CC21B020d9b8D13c74417F)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ARMProxy (0x411dE17f12D1A34ecC7F45f49844626267c75e81)
    +++ description: None
```

```diff
+   Status: CREATED
    contract OffRamp9 (0x41627a90f2c6238f2BADAB72D5aB050B857fdAb5)
    +++ description: None
```

```diff
+   Status: CREATED
    contract BurnMintTokenPool (0x44622f4604353E4815A4212d5a3dD137A1C7FF14)
    +++ description: None
```

```diff
+   Status: CREATED
    contract RBACTimelock (0x44835bBBA9D40DEDa9b64858095EcFB2693c9449)
    +++ description: None
```

```diff
+   Status: CREATED
    contract EVM2EVMOnRamp (0x466a078d17e3706a9414ACc48029EE9Bae4C9b65)
    +++ description: None
```

```diff
+   Status: CREATED
    contract CommitStore4 (0x4af4B497c998007eF83ad130318eB2b925a79dc8)
    +++ description: None
```

```diff
+   Status: CREATED
    contract BurnMintTokenPool (0x4C3aEe10334461F1f33c0A8843424de3F8fb7709)
    +++ description: None
```

```diff
+   Status: CREATED
    contract LockReleaseTokenPool (0x50f6631B377be52E132DF35a2F05eA54fda882ac)
    +++ description: None
```

```diff
+   Status: CREATED
    contract LockReleaseTokenPool (0x55562A08104837FF55E3A66c49A1419b6311c1E6)
    +++ description: None
```

```diff
+   Status: CREATED
    contract OffRamp5 (0x569940e02D4425eac61A7601632eC00d69f75c17)
    +++ description: None
```

```diff
+   Status: CREATED
    contract BurnMintTokenPool (0x57D3bb46aF4A9b210FAE046796013090D428475F)
    +++ description: None
```

```diff
+   Status: CREATED
    contract OffRamp12 (0x61135E701a2214C170c5F596D0067798FEfbaaE4)
    +++ description: None
```

```diff
+   Status: CREATED
    contract LockReleaseTokenPool (0x619ED9fE2E5CfD9FAE364E703b60eA776Bb5924E)
    +++ description: None
```

```diff
+   Status: CREATED
    contract EtherSenderReceiver (0x66598216D8E4d9AFE0F06d525B335b762229842f)
    +++ description: None
```

```diff
+   Status: CREATED
    contract LockReleaseTokenPool (0x69c24c970B65e22Ac26864aF10b2295B7d78f93A)
    +++ description: None
```

```diff
+   Status: CREATED
    contract LockReleaseTokenPool (0x6ce8b799002BbECc7df94c18BF150B3b0E4A28F4)
    +++ description: None
```

```diff
+   Status: CREATED
    contract LockReleaseTokenPool (0x6dDF2F3f93688dfc9d37DF7078982cE8E6494DB2)
    +++ description: None
```

```diff
+   Status: CREATED
    contract LockReleaseTokenPool (0x6Ff6BF3BF8af2e419DDC7BF038aFa5EB92b6cD7e)
    +++ description: None
```

```diff
+   Status: CREATED
    contract LockReleaseTokenPool (0x73aEB5ECA03Ad587B8Fdcc2B61f9fb4D2e3D90c1)
    +++ description: None
```

```diff
+   Status: CREATED
    contract CommitStore (0x76264869a3eBF51a59FCa5ABa84ee2867c7F190e)
    +++ description: None
```

```diff
+   Status: CREATED
    contract BurnMintTokenPool (0x78196436aF11b948c7036424B1ceA711fAdAd288)
    +++ description: None
```

```diff
+   Status: CREATED
    contract CommitStore13 (0x7986C9892389854cAAbAC785ff18123B0070a5Fd)
    +++ description: None
```

```diff
+   Status: CREATED
    contract OffRamp3 (0x7Afe7088aff57173565F4b034167643AA8b9171c)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Router (0x80226fc0Ee2b096224EeAc085Bb9a8cba1146f7D)
    +++ description: None
```

```diff
+   Status: CREATED
    contract LockReleaseTokenPool (0x8272dbBA30f14900b22b4bfC8DB4E88B02bA413a)
    +++ description: None
```

```diff
+   Status: CREATED
    contract LockReleaseTokenPool (0x8291a8E8dCF429e2FA7d032bF3E583ee959F3B06)
    +++ description: None
```

```diff
+   Status: CREATED
    contract CallProxy (0x82b8A19497fA25575f250a3DcFfCD2562B575A2e)
    +++ description: None
```

```diff
+   Status: CREATED
    contract BurnMintTokenPool (0x8300e89e82A840176eb250EcDA0A7dBDb4a6B12D)
    +++ description: None
```

```diff
+   Status: CREATED
    contract CommitStore (0x831097033C88c82a7F1897b168Aa88cC44540C8f)
    +++ description: None
```

```diff
+   Status: CREATED
    contract OnRamp1 (0x86B47d8411006874eEf8E4584BdFD7be8e5549d1)
    +++ description: None
```

```diff
+   Status: CREATED
    contract CommitStore3 (0x87c55D48DF6EF7B08153Ab079e76bFEcbb793D75)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ARM (0x8B63b3DE93431C0f756A493644d128134291fA1b)
    +++ description: None
```

```diff
+   Status: CREATED
    contract BurnMintTokenPool (0x8BcD7e48Dd2104ed83eb1CE0c6E7610604AE9062)
    +++ description: None
```

```diff
+   Status: CREATED
    contract CommitStore9 (0x8bEFCa744c6f2b567b1863dcF055C593afdC11A0)
    +++ description: None
```

```diff
+   Status: CREATED
    contract PriceRegistry (0x8c9b2Efb7c64C394119270bfecE7f54763b958Ad)
    +++ description: None
```

```diff
+   Status: CREATED
    contract CommitStore6 (0x8DC27D621c41a32140e22E2a4dAf1259639BAe04)
    +++ description: None
```

```diff
+   Status: CREATED
    contract OnRamp5 (0x91D25A56Db77aD5147437d8B83Eb563D46eBFa69)
    +++ description: None
```

```diff
+   Status: CREATED
    contract OnRamp3 (0x925228D7B82d883Dde340A55Fe8e6dA56244A22C)
    +++ description: None
```

```diff
+   Status: CREATED
    contract BETS (0x94025780a1aB58868D9B2dBBB775f44b32e8E6e5)
    +++ description: None
```

```diff
+   Status: CREATED
    contract BurnMintTokenPool (0x9797E886EDe987AEf6A62885dFD6CcA885D828E6)
    +++ description: None
```

```diff
+   Status: CREATED
    contract CommitStore8 (0x9B2EEd6A1e16cB50Ed4c876D2dD69468B21b7749)
    +++ description: None
```

```diff
+   Status: CREATED
    contract LockReleaseTokenPool (0xa008534BF96b61d9D33aD64aAD463bc6D300cd91)
    +++ description: None
```

```diff
+   Status: CREATED
    contract BurnMintTokenPool (0xa17698199466E71bAFC31F226db341B7840701E7)
    +++ description: None
```

```diff
+   Status: CREATED
    contract LockReleaseTokenPool (0xa370CEcd451ecf15c2A01ec47762E967dF7574DA)
    +++ description: None
```

```diff
+   Status: CREATED
    contract USDCTokenPool (0xA81f4AB595dE5C14759245DE5ce9899D380FeFda)
    +++ description: None
```

```diff
+   Status: CREATED
    contract LockReleaseTokenPool (0xA82A87a9b6550e89dd8a7C8a1E3e421974eaf858)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ManyChainMultiSig (0xa8D5E1daA6D8B94f11D77B7E09DE846292ef69FF)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ManyChainMultiSig (0xAD97C0270a243270136E40278155C12ce7C7F87B)
    +++ description: None
```

```diff
+   Status: CREATED
    contract OffRamp4 (0xB095900fB91db00E6abD247A5A5AD1cee3F20BF7)
    +++ description: None
```

```diff
+   Status: CREATED
    contract LockReleaseTokenPool (0xb854536206EB6C1013b1642b576196E5EF19D7BA)
    +++ description: None
```

```diff
+   Status: CREATED
    contract TokenMessenger (0xBd3fa81B58Ba92a82136038B25aDec7066af3155)
    +++ description: None
```

```diff
+   Status: CREATED
    contract OffRamp11 (0xBDd822f3bC2EAB6818CfA3053107831D4E93fE72)
    +++ description: None
```

```diff
+   Status: CREATED
    contract BurnMintTokenPool (0xBF7cb652A2d5ed3BFc3832Ef8Af33Ffb0cDc0982)
    +++ description: None
```

```diff
+   Status: CREATED
    contract GnosisSafe (0xc07556a0Bd177F8de4D077f449C2653A072F3798)
    +++ description: None
```

```diff
+   Status: CREATED
    contract LockReleaseTokenPool (0xC2291992A08eBFDfedfE248F2CCD34Da63570DF4)
    +++ description: None
```

```diff
+   Status: CREATED
    contract LockReleaseTokenPool (0xc43c01026128Aa758A65D12dB6a72CE4DD778dF2)
    +++ description: None
```

```diff
+   Status: CREATED
    contract TokenMinter (0xc4922d64a24675E16e1586e3e3Aa56C06fABe907)
    +++ description: None
```

```diff
+   Status: CREATED
    contract BurnMintTokenPool (0xc62c311FE64abf19CF33195e15c188Ca6d1AaD3e)
    +++ description: None
```

```diff
+   Status: CREATED
    contract OffRamp13 (0xC7176620daf49A39a17FF9A6C2DE1eAA6033EE94)
    +++ description: None
```

```diff
+   Status: CREATED
    contract OnRamp7 (0xCbE7e5DA76dC99Ac317adF6d99137005FDA4E2C4)
    +++ description: None
```

```diff
+   Status: CREATED
    contract OnRamp9 (0xCC19bC4D43d17eB6859F0d22BA300967C97780b0)
    +++ description: None
```

```diff
+   Status: CREATED
    contract BurnMintTokenPool (0xcd196D3905AfA0eCB4e0e62C2D7d6c52f9C73526)
    +++ description: None
```

```diff
+   Status: CREATED
    contract OnRamp10 (0xd0B5Fc9790a6085b048b8Aa1ED26ca2b3b282CF2)
    +++ description: None
```

```diff
+   Status: CREATED
    contract LockReleaseTokenPool (0xd1b3015ceFCAC84dB3EFCBB18FBdd50BA5aF49DE)
    +++ description: None
```

```diff
+   Status: CREATED
    contract CommitStore7 (0xD37a60E8C36E802D2E1a6321832Ee85556Beeb76)
    +++ description: None
```

```diff
+   Status: CREATED
    contract EVM2EVMOffRamp (0xd5083684eE92dDeA117636ae5E2F1cb7fE4dfd46)
    +++ description: None
```

```diff
+   Status: CREATED
    contract GnosisSafe (0xD6597750bf74DCAEC57e0F9aD2ec998D837005bf)
    +++ description: None
```

```diff
+   Status: CREATED
    contract LockReleaseTokenPool (0xdCa0A2341ed5438E06B9982243808A76B9ADD6d0)
    +++ description: None
```

```diff
+   Status: CREATED
    contract OnRamp13 (0xdF1d7FD22aC3aB5171E275796f123224039f3b24)
    +++ description: None
```

```diff
+   Status: CREATED
    contract OffRamp6 (0xdf85c8381954694E74abD07488f452b4c2Cddfb3)
    +++ description: None
```

```diff
+   Status: CREATED
    contract OnRamp6 (0xe2c2AB221AA0b957805f229d2AA57fBE2f4dADf7)
    +++ description: None
```

```diff
+   Status: CREATED
    contract OnRamp14 (0xe2Eb229e88F56691e96bb98256707Bc62160FE73)
    +++ description: None
```

```diff
+   Status: CREATED
    contract LockReleaseTokenPool (0xE2F0dad85D504aa046b9F704a426fD6C5493e366)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ManyChainMultiSig (0xE53289F32c8E690b7173aA33affE9B6B0CB0012F)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Router2 (0xE561d5E02207fb5eB32cca20a699E0d8919a1476)
    +++ description: None
```

```diff
+   Status: CREATED
    contract EVM2EVMOffRamp (0xE8af3b68eDfFf65Ce48648009982380701f09B92)
    +++ description: None
```

```diff
+   Status: CREATED
    contract OffRamp2 (0xE93ec2A57e38C8541c893348cCafEAB01F7D47d4)
    +++ description: None
```

```diff
+   Status: CREATED
    contract BurnMintTokenPool (0xeaE89E53B8317CaB04165F5323285252D5669B73)
    +++ description: None
```

```diff
+   Status: CREATED
    contract EVM2EVMOnRamp (0xEd5bE9508ae56531cc0EDe6A3bD588Eb9E2e3cfa)
    +++ description: None
```

```diff
+   Status: CREATED
    contract OffRamp8 (0xeFC4a18af59398FF23bfe7325F2401aD44286F4d)
    +++ description: None
```

```diff
+   Status: CREATED
    contract BurnMintTokenPool (0xf0D19c04f04382048fC9ad157C529CeB2c7be823)
    +++ description: None
```

```diff
+   Status: CREATED
    contract OnRamp8 (0xF538dA6c673A30338269655f4e019B71ba58CFd4)
    +++ description: None
```

```diff
+   Status: CREATED
    contract CCIPTokenProxy (0xF9F5bcd3a50653387ee0b9d60C1905854093e8Fb)
    +++ description: None
```

```diff
+   Status: CREATED
    contract OffRamp14 (0xfF51C00546AA3d9051a4B96Ae81346E14709CD24)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Proxy (0xffffffaEff0B96Ea8e4f94b2253f31abdD875847)
    +++ description: None
```
