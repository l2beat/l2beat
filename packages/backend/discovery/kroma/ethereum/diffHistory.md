# Diff at Fri, 03 Nov 2023 09:59:02 GMT:

- author: Luca Donno (<donnoh99@gmail.com>)
- comparing to: master@9fa31f2a6274083dfe7f01b69d1220921459db02

## Description

- Additional 8 EOAs added to the SecurityCouncil (making it a 1/9 multisig).
- Owner of the SecurityCouncilToken changed from EOA to a Timelock contract
  (0x2260...FDc1).

## Watched changes

```diff
    contract SecurityCouncil (0x3de211088dF516da72efe68D386b561BEE256Ec4) {
      values.owners[8]:
+        "0x42a4f1958A5d99A62C50eb24a80d1D8b142ea3A1"
      values.owners[7]:
+        "0x3a4F65D1ACFb2A3F5AD93ef7b240bfa1079052e0"
      values.owners[6]:
+        "0xECe4AAf6A41aa81A164363Ec6C420510617Fc998"
      values.owners[5]:
+        "0x5ddcf494A8b6EeE4904934E829109cCF584EAF80"
      values.owners[4]:
+        "0x7B3225ADc5D908668FaA050246680CBE4e75A93f"
      values.owners[3]:
+        "0xbDeE962137373A755a71C716E01B9946B1a27686"
      values.owners[2]:
+        "0x8ECF028Cd647379E580DaA6701A11154750fcd3c"
      values.owners[1]:
+        "0xe1b712e16Be1Eb098D0b2B846e2f547F9E292851"
    }
```

```diff
    contract SecurityCouncilToken (0xe4D08346609055c091D3DEECdAAd3Bf83119B08c) {
      values.owner:
-        "0xA03c13C6597a0716D1525b7fDaD2fD95ECb49081"
+        "0x22605A12cB77Fe420B0cC1263cEb58a77352FDc1"
      values.totalSupply:
-        1
+        9
    }
```

# Diff at Fri, 29 Sep 2023 07:58:06 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: master@af96105393755c6fead3fa1b6c9845f238580952

## Watched changes

```diff
    contract ValidatorPool (0xFdFF462845953D90719A78Fd12a2d103541d2103) {
      values.validators:
+        ["0x3aa00bb915A8e78b0523E4c365e3E70A19d329e6","0x81BF552f9Fc83e88012d6C3ab84cF1946Bc55FD0","0x42a4f1958A5d99A62C50eb24a80d1D8b142ea3A1","0xfC3867F19161b8981d8B9c9fa3D7360c9Cee9733","0x0125adEE89dE396b586959190e931b83120359AB","0x7d06b6eA10cCb824d12FEd7c934B89866ab26C33","0x1F4f1450Cb0e8BF8cB792e37a2Cc41d990dB081D","0x91b6178188ccDD1e735F54ba135cd5EcabECdB15","0x328fbE99cC9A05f9e6f956847EDF8075661eb5fF","0x8ECF028Cd647379E580DaA6701A11154750fcd3c","0x4576481b914FE9FCA4Bbe6A85aB1A409124Ef9A7"]
    }
```
