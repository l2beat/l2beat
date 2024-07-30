Generated with discovered.json: 0x9fcce28aaf849f59444801bb0aa7923d3cd07db8

# Diff at Tue, 30 Jul 2024 11:12:30 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@b2b6471ff62871f4956541f42ec025c356c08f7e block: 20368673
- current block number: 20368673

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20368673 (main branch discovery), not current.

```diff
    contract SystemConfig (0x05f23282FFDCA8286E4738C1aF79079f3d843750) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      fieldMeta:
+        {"gasLimit":{"severity":"LOW","description":"Gas limit for blocks on L2."}}
    }
```

Generated with discovered.json: 0x8d4557f91adb07eed80d7b422ffce2b174c2270e

# Diff at Tue, 23 Jul 2024 10:36:43 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@490aaec1a76ba293d442449146dd7c8335f4b7a1 block: 20367772
- current block number: 20368673

## Description

EOA signer removed, the LiskRollupOwnerMultisig is now just a transparent MS for Gelato MS. Warning removed from FE.

## Watched changes

```diff
    contract LiskRollupOwnerMultisig (0xECd4150ABbb1EBff13f74e42Fb43C3d78B4E0b45) {
    +++ description: None
      values.$multisigThreshold:
-        "1 of 2 (50%)"
+        "1 of 1 (100%)"
      values.getOwners.1:
-        "0xdA6e5640aFB2ED212Ba3a6fd83076e2ad3daD185"
    }
```

Generated with discovered.json: 0x4ea5b8947e58d62a04b241936e836cfc4c567bba

# Diff at Tue, 23 Jul 2024 07:36:01 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@898b873eac66b785af49fe56edca0c3dc1a5d0d7 block: 20339917
- current block number: 20367772

## Description

Challenger and Guardian are changed to the GelatoMultisig. Rollup Upgrade owner is still an EOA (and additionally GelatoMS).

## Watched changes

```diff
    contract SystemConfig (0x05f23282FFDCA8286E4738C1aF79079f3d843750) {
    +++ description: None
      values.owner:
-        "0xdA6e5640aFB2ED212Ba3a6fd83076e2ad3daD185"
+        "0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb"
    }
```

```diff
    contract L2OutputOracle (0x113cB99283AF242Da0A0C54347667edF531Aa7d6) {
    +++ description: None
      values.challenger:
-        "0xdA6e5640aFB2ED212Ba3a6fd83076e2ad3daD185"
+        "0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb"
      values.CHALLENGER:
-        "0xdA6e5640aFB2ED212Ba3a6fd83076e2ad3daD185"
+        "0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb"
    }
```

```diff
    contract SuperchainConfig (0x26C7bFB430d68Bf74d2d52497836d4336b555dE7) {
    +++ description: None
      values.guardian:
-        "0xdA6e5640aFB2ED212Ba3a6fd83076e2ad3daD185"
+        "0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb"
    }
```

```diff
    contract OptimismPortal (0x26dB93F8b8b4f7016240af62F7730979d353f9A7) {
    +++ description: None
      values.guardian:
-        "0xdA6e5640aFB2ED212Ba3a6fd83076e2ad3daD185"
+        "0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb"
      values.GUARDIAN:
-        "0xdA6e5640aFB2ED212Ba3a6fd83076e2ad3daD185"
+        "0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb"
    }
```

```diff
    contract LiskRollupOwnerMultisig (0xECd4150ABbb1EBff13f74e42Fb43C3d78B4E0b45) {
    +++ description: None
      values.$multisigThreshold:
-        "1 of 1 (100%)"
+        "1 of 2 (50%)"
      values.getOwners.1:
+        "0xdA6e5640aFB2ED212Ba3a6fd83076e2ad3daD185"
      values.getOwners.0:
-        "0xdA6e5640aFB2ED212Ba3a6fd83076e2ad3daD185"
+        "0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb"
    }
```

```diff
+   Status: CREATED
    contract GelatoMultisig (0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb)
    +++ description: None
```

## Source code changes

```diff
.../ethereum/.flat/GelatoMultisig/GnosisSafe.sol   | 952 +++++++++++++++++++++
 .../.flat/GelatoMultisig/GnosisSafeProxy.p.sol     |  34 +
 2 files changed, 986 insertions(+)
```

Generated with discovered.json: 0xbbda4273693b98590b45a10179daf316b84586ba

# Diff at Fri, 19 Jul 2024 10:16:12 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- current block number: 20339917

## Description

Initial discovery: OP stack rollup on the latest superchain (fork) contracts. EOA-governed without being in the Superchain governance.

## Initial discovery

```diff
+   Status: CREATED
    contract SystemConfig (0x05f23282FFDCA8286E4738C1aF79079f3d843750)
    +++ description: None
```

```diff
+   Status: CREATED
    contract L2OutputOracle (0x113cB99283AF242Da0A0C54347667edF531Aa7d6)
    +++ description: None
```

```diff
+   Status: CREATED
    contract L1StandardBridge (0x2658723Bf70c7667De6B25F99fcce13A16D25d08)
    +++ description: None
```

```diff
+   Status: CREATED
    contract SuperchainConfig (0x26C7bFB430d68Bf74d2d52497836d4336b555dE7)
    +++ description: None
```

```diff
+   Status: CREATED
    contract OptimismPortal (0x26dB93F8b8b4f7016240af62F7730979d353f9A7)
    +++ description: None
```

```diff
+   Status: CREATED
    contract AddressManager (0x2dF7057d3F25212E51aFEA8dA628668229Ea423f)
    +++ description: None
```

```diff
+   Status: CREATED
    contract L1CrossDomainMessenger (0x31B72D76FB666844C41EdF08dF0254875Dbb7edB)
    +++ description: None
```

```diff
+   Status: CREATED
    contract L1ERC721Bridge (0x3A44A3b263FB631cdbf25f339e2D29497511A81f)
    +++ description: None
```

```diff
+   Status: CREATED
    contract OptimismMintableERC20Factory (0xc1dA06CC5DD5cE23bABa924463de7F762039252d)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ProxyAdmin (0xeC432c4F1d0E12737f3a42a459B84848Af979b2d)
    +++ description: None
```

```diff
+   Status: CREATED
    contract LiskRollupOwnerMultisig (0xECd4150ABbb1EBff13f74e42Fb43C3d78B4E0b45)
    +++ description: None
```
