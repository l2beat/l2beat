Generated with discovered.json: 0x0ae150690b5aff87b2121134679a25d4e7ffd671

# Diff at Mon, 14 Jul 2025 12:45:09 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@9f4300dad2f3d080cd56fa311d4a848556c74e72 block: 22765735
- current block number: 22765735

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22765735 (main branch discovery), not current.

```diff
    EOA  (0x000000000000000000000000000000000000dEaD) {
    +++ description: None
      address:
-        "0x000000000000000000000000000000000000dEaD"
+        "eth:0x000000000000000000000000000000000000dEaD"
    }
```

```diff
    contract OptimismMintableERC20Factory (0x0262fEDC4A98f94dDB90CeF0E058644d8409342C) {
    +++ description: A helper contract that generates OptimismMintableERC20 contracts on the network it's deployed to. OptimismMintableERC20 is a standard extension of the base ERC20 token contract designed to allow the L1StandardBridge contracts to mint and burn tokens. This makes it possible to use an OptimismMintableERC20 as this chain's representation of a token on the host chain, or vice-versa.
      address:
-        "0x0262fEDC4A98f94dDB90CeF0E058644d8409342C"
+        "eth:0x0262fEDC4A98f94dDB90CeF0E058644d8409342C"
      values.$admin:
-        "0xbE81A9D662422f667F634f3Fc301e2E360FeFB30"
+        "eth:0xbE81A9D662422f667F634f3Fc301e2E360FeFB30"
      values.$implementation:
-        "0x380951156AF4ed8D3B1923c0DFb7AcBC59A045Fc"
+        "eth:0x380951156AF4ed8D3B1923c0DFb7AcBC59A045Fc"
      values.$pastUpgrades.0.2.0:
-        "0x380951156AF4ed8D3B1923c0DFb7AcBC59A045Fc"
+        "eth:0x380951156AF4ed8D3B1923c0DFb7AcBC59A045Fc"
      values.bridge:
-        "0x5eaa10F99e7e6D177eF9F74E519E319aa49f191e"
+        "eth:0x5eaa10F99e7e6D177eF9F74E519E319aa49f191e"
      values.BRIDGE:
-        "0x5eaa10F99e7e6D177eF9F74E519E319aa49f191e"
+        "eth:0x5eaa10F99e7e6D177eF9F74E519E319aa49f191e"
      implementationNames.0x0262fEDC4A98f94dDB90CeF0E058644d8409342C:
-        "Proxy"
      implementationNames.0x380951156AF4ed8D3B1923c0DFb7AcBC59A045Fc:
-        "OptimismMintableERC20Factory"
      implementationNames.eth:0x0262fEDC4A98f94dDB90CeF0E058644d8409342C:
+        "Proxy"
      implementationNames.eth:0x380951156AF4ed8D3B1923c0DFb7AcBC59A045Fc:
+        "OptimismMintableERC20Factory"
    }
```

```diff
    contract SuperchainConfig (0x15144FB8621cB3c4ED3DB223c173ffb58C8D2aB8) {
    +++ description: This is NOT the shared SuperchainConfig contract of the OP stack Superchain but rather a local fork. It manages the `PAUSED_SLOT`, a boolean value indicating whether the local chain is paused, and `GUARDIAN_SLOT`, the address of the guardian which can pause and unpause the system.
      address:
-        "0x15144FB8621cB3c4ED3DB223c173ffb58C8D2aB8"
+        "eth:0x15144FB8621cB3c4ED3DB223c173ffb58C8D2aB8"
      values.$admin:
-        "0xbE81A9D662422f667F634f3Fc301e2E360FeFB30"
+        "eth:0xbE81A9D662422f667F634f3Fc301e2E360FeFB30"
      values.$implementation:
-        "0x29db48723d864AE327c17E998De649E691CEA1bf"
+        "eth:0x29db48723d864AE327c17E998De649E691CEA1bf"
      values.$pastUpgrades.0.2.0:
-        "0x29db48723d864AE327c17E998De649E691CEA1bf"
+        "eth:0x29db48723d864AE327c17E998De649E691CEA1bf"
      values.guardian:
-        "0xc0E743E625bBB17E3B16efC984df9678D06EcdDF"
+        "eth:0xc0E743E625bBB17E3B16efC984df9678D06EcdDF"
      implementationNames.0x15144FB8621cB3c4ED3DB223c173ffb58C8D2aB8:
-        "Proxy"
      implementationNames.0x29db48723d864AE327c17E998De649E691CEA1bf:
-        "SuperchainConfig"
      implementationNames.eth:0x15144FB8621cB3c4ED3DB223c173ffb58C8D2aB8:
+        "Proxy"
      implementationNames.eth:0x29db48723d864AE327c17E998De649E691CEA1bf:
+        "SuperchainConfig"
    }
```

```diff
    EOA  (0x2BD42D6CFA838fB15187F3D59dC19eD169b2659e) {
    +++ description: None
      address:
-        "0x2BD42D6CFA838fB15187F3D59dC19eD169b2659e"
+        "eth:0x2BD42D6CFA838fB15187F3D59dC19eD169b2659e"
    }
```

```diff
    contract OptimismPortal (0x39a0005415256B9863aFE2d55Edcf75ECc3A4D7e) {
    +++ description: The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals.
      address:
-        "0x39a0005415256B9863aFE2d55Edcf75ECc3A4D7e"
+        "eth:0x39a0005415256B9863aFE2d55Edcf75ECc3A4D7e"
      values.$admin:
-        "0xbE81A9D662422f667F634f3Fc301e2E360FeFB30"
+        "eth:0xbE81A9D662422f667F634f3Fc301e2E360FeFB30"
      values.$implementation:
-        "0x4B58Ed755186326E77253444AaDe73c6E591c909"
+        "eth:0x4B58Ed755186326E77253444AaDe73c6E591c909"
      values.$pastUpgrades.0.2.0:
-        "0x4B58Ed755186326E77253444AaDe73c6E591c909"
+        "eth:0x4B58Ed755186326E77253444AaDe73c6E591c909"
      values.guardian:
-        "0xc0E743E625bBB17E3B16efC984df9678D06EcdDF"
+        "eth:0xc0E743E625bBB17E3B16efC984df9678D06EcdDF"
      values.GUARDIAN:
-        "0xc0E743E625bBB17E3B16efC984df9678D06EcdDF"
+        "eth:0xc0E743E625bBB17E3B16efC984df9678D06EcdDF"
      values.L2_ORACLE:
-        "0x6daF3a3497D8abdFE12915aDD9829f83A79C0d51"
+        "eth:0x6daF3a3497D8abdFE12915aDD9829f83A79C0d51"
      values.l2Oracle:
-        "0x6daF3a3497D8abdFE12915aDD9829f83A79C0d51"
+        "eth:0x6daF3a3497D8abdFE12915aDD9829f83A79C0d51"
      values.l2Sender:
-        "0x000000000000000000000000000000000000dEaD"
+        "eth:0x000000000000000000000000000000000000dEaD"
      values.superchainConfig:
-        "0x15144FB8621cB3c4ED3DB223c173ffb58C8D2aB8"
+        "eth:0x15144FB8621cB3c4ED3DB223c173ffb58C8D2aB8"
      values.SYSTEM_CONFIG:
-        "0x5ae68684D9179A8053883f1Df599Ea7Fb35303c3"
+        "eth:0x5ae68684D9179A8053883f1Df599Ea7Fb35303c3"
      values.systemConfig:
-        "0x5ae68684D9179A8053883f1Df599Ea7Fb35303c3"
+        "eth:0x5ae68684D9179A8053883f1Df599Ea7Fb35303c3"
      implementationNames.0x39a0005415256B9863aFE2d55Edcf75ECc3A4D7e:
-        "Proxy"
      implementationNames.0x4B58Ed755186326E77253444AaDe73c6E591c909:
-        "OptimismPortal"
      implementationNames.eth:0x39a0005415256B9863aFE2d55Edcf75ECc3A4D7e:
+        "Proxy"
      implementationNames.eth:0x4B58Ed755186326E77253444AaDe73c6E591c909:
+        "OptimismPortal"
    }
```

```diff
    EOA  (0x3dAdd6ead2d883E2DE9F36a8E1c9297DC1442CD9) {
    +++ description: None
      address:
-        "0x3dAdd6ead2d883E2DE9F36a8E1c9297DC1442CD9"
+        "eth:0x3dAdd6ead2d883E2DE9F36a8E1c9297DC1442CD9"
    }
```

```diff
    contract SystemConfig (0x5ae68684D9179A8053883f1Df599Ea7Fb35303c3) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      address:
-        "0x5ae68684D9179A8053883f1Df599Ea7Fb35303c3"
+        "eth:0x5ae68684D9179A8053883f1Df599Ea7Fb35303c3"
      values.$admin:
-        "0xbE81A9D662422f667F634f3Fc301e2E360FeFB30"
+        "eth:0xbE81A9D662422f667F634f3Fc301e2E360FeFB30"
      values.$implementation:
-        "0x27392Eb24eEFce471992a42F374730C07E5beF26"
+        "eth:0x27392Eb24eEFce471992a42F374730C07E5beF26"
      values.$pastUpgrades.0.2.0:
-        "0x27392Eb24eEFce471992a42F374730C07E5beF26"
+        "eth:0x27392Eb24eEFce471992a42F374730C07E5beF26"
      values.batcherHash:
-        "0x65115C6D23274E0A29A63B69130eFe901Aa52e7A"
+        "eth:0x65115C6D23274E0A29A63B69130eFe901Aa52e7A"
      values.batchInbox:
-        "0xfF00000000000000000000000000000000043111"
+        "eth:0xfF00000000000000000000000000000000043111"
      values.l1CrossDomainMessenger:
-        "0xF005dFb08377faD44588Af68d0884D272A6fb050"
+        "eth:0xF005dFb08377faD44588Af68d0884D272A6fb050"
      values.l1ERC721Bridge:
-        "0xa446331bD28cbe0186A983a27C528f566B6bedE0"
+        "eth:0xa446331bD28cbe0186A983a27C528f566B6bedE0"
      values.l1StandardBridge:
-        "0x5eaa10F99e7e6D177eF9F74E519E319aa49f191e"
+        "eth:0x5eaa10F99e7e6D177eF9F74E519E319aa49f191e"
      values.l2OutputOracle:
-        "0x6daF3a3497D8abdFE12915aDD9829f83A79C0d51"
+        "eth:0x6daF3a3497D8abdFE12915aDD9829f83A79C0d51"
      values.optimismMintableERC20Factory:
-        "0x0262fEDC4A98f94dDB90CeF0E058644d8409342C"
+        "eth:0x0262fEDC4A98f94dDB90CeF0E058644d8409342C"
      values.optimismPortal:
-        "0x39a0005415256B9863aFE2d55Edcf75ECc3A4D7e"
+        "eth:0x39a0005415256B9863aFE2d55Edcf75ECc3A4D7e"
      values.owner:
-        "0xc0E743E625bBB17E3B16efC984df9678D06EcdDF"
+        "eth:0xc0E743E625bBB17E3B16efC984df9678D06EcdDF"
      values.sequencerInbox:
-        "0xfF00000000000000000000000000000000043111"
+        "eth:0xfF00000000000000000000000000000000043111"
      values.unsafeBlockSigner:
-        "0x9f3602dE69382BD8eaF6fD4bf5597c2801D44855"
+        "eth:0x9f3602dE69382BD8eaF6fD4bf5597c2801D44855"
      implementationNames.0x5ae68684D9179A8053883f1Df599Ea7Fb35303c3:
-        "Proxy"
      implementationNames.0x27392Eb24eEFce471992a42F374730C07E5beF26:
-        "SystemConfig"
      implementationNames.eth:0x5ae68684D9179A8053883f1Df599Ea7Fb35303c3:
+        "Proxy"
      implementationNames.eth:0x27392Eb24eEFce471992a42F374730C07E5beF26:
+        "SystemConfig"
    }
```

```diff
    EOA  (0x5cCfaDC39a76d9040090E6CB43940c2c6bd75091) {
    +++ description: None
      address:
-        "0x5cCfaDC39a76d9040090E6CB43940c2c6bd75091"
+        "eth:0x5cCfaDC39a76d9040090E6CB43940c2c6bd75091"
    }
```

```diff
    contract L1StandardBridge (0x5eaa10F99e7e6D177eF9F74E519E319aa49f191e) {
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain.
      address:
-        "0x5eaa10F99e7e6D177eF9F74E519E319aa49f191e"
+        "eth:0x5eaa10F99e7e6D177eF9F74E519E319aa49f191e"
      values.$admin:
-        "0xbE81A9D662422f667F634f3Fc301e2E360FeFB30"
+        "eth:0xbE81A9D662422f667F634f3Fc301e2E360FeFB30"
      values.$implementation:
-        "0xA39369f09f4266A4dCE9E10598ec7aa2a4867c7f"
+        "eth:0xA39369f09f4266A4dCE9E10598ec7aa2a4867c7f"
      values.l2TokenBridge:
-        "0x4200000000000000000000000000000000000010"
+        "eth:0x4200000000000000000000000000000000000010"
      values.messenger:
-        "0xF005dFb08377faD44588Af68d0884D272A6fb050"
+        "eth:0xF005dFb08377faD44588Af68d0884D272A6fb050"
      values.MESSENGER:
-        "0xF005dFb08377faD44588Af68d0884D272A6fb050"
+        "eth:0xF005dFb08377faD44588Af68d0884D272A6fb050"
      values.OTHER_BRIDGE:
-        "0x4200000000000000000000000000000000000010"
+        "eth:0x4200000000000000000000000000000000000010"
      values.otherBridge:
-        "0x4200000000000000000000000000000000000010"
+        "eth:0x4200000000000000000000000000000000000010"
      values.superchainConfig:
-        "0x15144FB8621cB3c4ED3DB223c173ffb58C8D2aB8"
+        "eth:0x15144FB8621cB3c4ED3DB223c173ffb58C8D2aB8"
      implementationNames.0x5eaa10F99e7e6D177eF9F74E519E319aa49f191e:
-        "L1ChugSplashProxy"
      implementationNames.0xA39369f09f4266A4dCE9E10598ec7aa2a4867c7f:
-        "L1StandardBridge"
      implementationNames.eth:0x5eaa10F99e7e6D177eF9F74E519E319aa49f191e:
+        "L1ChugSplashProxy"
      implementationNames.eth:0xA39369f09f4266A4dCE9E10598ec7aa2a4867c7f:
+        "L1StandardBridge"
    }
```

```diff
    EOA  (0x65115C6D23274E0A29A63B69130eFe901Aa52e7A) {
    +++ description: None
      address:
-        "0x65115C6D23274E0A29A63B69130eFe901Aa52e7A"
+        "eth:0x65115C6D23274E0A29A63B69130eFe901Aa52e7A"
    }
```

```diff
    contract L2OutputOracle (0x6daF3a3497D8abdFE12915aDD9829f83A79C0d51) {
    +++ description: Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots.
      address:
-        "0x6daF3a3497D8abdFE12915aDD9829f83A79C0d51"
+        "eth:0x6daF3a3497D8abdFE12915aDD9829f83A79C0d51"
      values.$admin:
-        "0xbE81A9D662422f667F634f3Fc301e2E360FeFB30"
+        "eth:0xbE81A9D662422f667F634f3Fc301e2E360FeFB30"
      values.$implementation:
-        "0x05d99CB268cCC0f88e6BEbe0Eb0AF4e9C0b83cf4"
+        "eth:0x05d99CB268cCC0f88e6BEbe0Eb0AF4e9C0b83cf4"
      values.$pastUpgrades.0.2.0:
-        "0x05d99CB268cCC0f88e6BEbe0Eb0AF4e9C0b83cf4"
+        "eth:0x05d99CB268cCC0f88e6BEbe0Eb0AF4e9C0b83cf4"
+++ severity: HIGH
      values.challenger:
-        "0xc0E743E625bBB17E3B16efC984df9678D06EcdDF"
+        "eth:0xc0E743E625bBB17E3B16efC984df9678D06EcdDF"
      values.CHALLENGER:
-        "0xc0E743E625bBB17E3B16efC984df9678D06EcdDF"
+        "eth:0xc0E743E625bBB17E3B16efC984df9678D06EcdDF"
+++ severity: HIGH
      values.proposer:
-        "0x2BD42D6CFA838fB15187F3D59dC19eD169b2659e"
+        "eth:0x2BD42D6CFA838fB15187F3D59dC19eD169b2659e"
      values.PROPOSER:
-        "0x2BD42D6CFA838fB15187F3D59dC19eD169b2659e"
+        "eth:0x2BD42D6CFA838fB15187F3D59dC19eD169b2659e"
      implementationNames.0x6daF3a3497D8abdFE12915aDD9829f83A79C0d51:
-        "Proxy"
      implementationNames.0x05d99CB268cCC0f88e6BEbe0Eb0AF4e9C0b83cf4:
-        "L2OutputOracle"
      implementationNames.eth:0x6daF3a3497D8abdFE12915aDD9829f83A79C0d51:
+        "Proxy"
      implementationNames.eth:0x05d99CB268cCC0f88e6BEbe0Eb0AF4e9C0b83cf4:
+        "L2OutputOracle"
    }
```

```diff
    contract GnosisSafe (0x8434dc705e4B729405Dd66C94DfC62bc3825Ea69) {
    +++ description: None
      address:
-        "0x8434dc705e4B729405Dd66C94DfC62bc3825Ea69"
+        "eth:0x8434dc705e4B729405Dd66C94DfC62bc3825Ea69"
      values.$implementation:
-        "0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552"
+        "eth:0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552"
      values.$members.0:
-        "0xdFd8559CC8000C792BA322f7CFF31dF7C56661d4"
+        "eth:0xdFd8559CC8000C792BA322f7CFF31dF7C56661d4"
      values.$members.1:
-        "0x3dAdd6ead2d883E2DE9F36a8E1c9297DC1442CD9"
+        "eth:0x3dAdd6ead2d883E2DE9F36a8E1c9297DC1442CD9"
      values.$members.2:
-        "0xce1aC9f03e9F2e86183bE6996c31A02BD423b04c"
+        "eth:0xce1aC9f03e9F2e86183bE6996c31A02BD423b04c"
      values.$members.3:
-        "0xB862184E29A79888d92c6c3278beDcF2BfDd2A77"
+        "eth:0xB862184E29A79888d92c6c3278beDcF2BfDd2A77"
      values.$members.4:
-        "0x5cCfaDC39a76d9040090E6CB43940c2c6bd75091"
+        "eth:0x5cCfaDC39a76d9040090E6CB43940c2c6bd75091"
      values.$members.5:
-        "0xAd4317c034e3CA9d91681127e77452dd73147610"
+        "eth:0xAd4317c034e3CA9d91681127e77452dd73147610"
      values.$members.6:
-        "0x9aCa8C83B2c44427934cD04b5458623eBcEd6FFa"
+        "eth:0x9aCa8C83B2c44427934cD04b5458623eBcEd6FFa"
      values.$members.7:
-        "0xb97296Ba97d4fA5E5C52b5081A853358f12cC85b"
+        "eth:0xb97296Ba97d4fA5E5C52b5081A853358f12cC85b"
      implementationNames.0x8434dc705e4B729405Dd66C94DfC62bc3825Ea69:
-        "GnosisSafeProxy"
      implementationNames.0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552:
-        "GnosisSafe"
      implementationNames.eth:0x8434dc705e4B729405Dd66C94DfC62bc3825Ea69:
+        "GnosisSafeProxy"
      implementationNames.eth:0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552:
+        "GnosisSafe"
    }
```

```diff
    EOA  (0x9aCa8C83B2c44427934cD04b5458623eBcEd6FFa) {
    +++ description: None
      address:
-        "0x9aCa8C83B2c44427934cD04b5458623eBcEd6FFa"
+        "eth:0x9aCa8C83B2c44427934cD04b5458623eBcEd6FFa"
    }
```

```diff
    EOA  (0x9f3602dE69382BD8eaF6fD4bf5597c2801D44855) {
    +++ description: None
      address:
-        "0x9f3602dE69382BD8eaF6fD4bf5597c2801D44855"
+        "eth:0x9f3602dE69382BD8eaF6fD4bf5597c2801D44855"
    }
```

```diff
    contract L1ERC721Bridge (0xa446331bD28cbe0186A983a27C528f566B6bedE0) {
    +++ description: Used to bridge ERC-721 tokens from host chain to this chain.
      address:
-        "0xa446331bD28cbe0186A983a27C528f566B6bedE0"
+        "eth:0xa446331bD28cbe0186A983a27C528f566B6bedE0"
      values.$admin:
-        "0xbE81A9D662422f667F634f3Fc301e2E360FeFB30"
+        "eth:0xbE81A9D662422f667F634f3Fc301e2E360FeFB30"
      values.$implementation:
-        "0xdb96A01A78C984AAdCC72884d7c778Dd38dfe41C"
+        "eth:0xdb96A01A78C984AAdCC72884d7c778Dd38dfe41C"
      values.$pastUpgrades.0.2.0:
-        "0xdb96A01A78C984AAdCC72884d7c778Dd38dfe41C"
+        "eth:0xdb96A01A78C984AAdCC72884d7c778Dd38dfe41C"
      values.messenger:
-        "0xF005dFb08377faD44588Af68d0884D272A6fb050"
+        "eth:0xF005dFb08377faD44588Af68d0884D272A6fb050"
      values.MESSENGER:
-        "0xF005dFb08377faD44588Af68d0884D272A6fb050"
+        "eth:0xF005dFb08377faD44588Af68d0884D272A6fb050"
      values.OTHER_BRIDGE:
-        "0x4200000000000000000000000000000000000014"
+        "eth:0x4200000000000000000000000000000000000014"
      values.otherBridge:
-        "0x4200000000000000000000000000000000000014"
+        "eth:0x4200000000000000000000000000000000000014"
      values.superchainConfig:
-        "0x15144FB8621cB3c4ED3DB223c173ffb58C8D2aB8"
+        "eth:0x15144FB8621cB3c4ED3DB223c173ffb58C8D2aB8"
      implementationNames.0xa446331bD28cbe0186A983a27C528f566B6bedE0:
-        "Proxy"
      implementationNames.0xdb96A01A78C984AAdCC72884d7c778Dd38dfe41C:
-        "L1ERC721Bridge"
      implementationNames.eth:0xa446331bD28cbe0186A983a27C528f566B6bedE0:
+        "Proxy"
      implementationNames.eth:0xdb96A01A78C984AAdCC72884d7c778Dd38dfe41C:
+        "L1ERC721Bridge"
    }
```

```diff
    contract AddressManager (0xA5F37791378c55941a52B4dCb70Be4D8D09f5e43) {
    +++ description: Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts.
      address:
-        "0xA5F37791378c55941a52B4dCb70Be4D8D09f5e43"
+        "eth:0xA5F37791378c55941a52B4dCb70Be4D8D09f5e43"
      values.owner:
-        "0xbE81A9D662422f667F634f3Fc301e2E360FeFB30"
+        "eth:0xbE81A9D662422f667F634f3Fc301e2E360FeFB30"
      implementationNames.0xA5F37791378c55941a52B4dCb70Be4D8D09f5e43:
-        "AddressManager"
      implementationNames.eth:0xA5F37791378c55941a52B4dCb70Be4D8D09f5e43:
+        "AddressManager"
    }
```

```diff
    EOA  (0xAd4317c034e3CA9d91681127e77452dd73147610) {
    +++ description: None
      address:
-        "0xAd4317c034e3CA9d91681127e77452dd73147610"
+        "eth:0xAd4317c034e3CA9d91681127e77452dd73147610"
    }
```

```diff
    EOA  (0xB862184E29A79888d92c6c3278beDcF2BfDd2A77) {
    +++ description: None
      address:
-        "0xB862184E29A79888d92c6c3278beDcF2BfDd2A77"
+        "eth:0xB862184E29A79888d92c6c3278beDcF2BfDd2A77"
    }
```

```diff
    EOA  (0xb97296Ba97d4fA5E5C52b5081A853358f12cC85b) {
    +++ description: None
      address:
-        "0xb97296Ba97d4fA5E5C52b5081A853358f12cC85b"
+        "eth:0xb97296Ba97d4fA5E5C52b5081A853358f12cC85b"
    }
```

```diff
    contract ProxyAdmin (0xbE81A9D662422f667F634f3Fc301e2E360FeFB30) {
    +++ description: None
      address:
-        "0xbE81A9D662422f667F634f3Fc301e2E360FeFB30"
+        "eth:0xbE81A9D662422f667F634f3Fc301e2E360FeFB30"
      values.addressManager:
-        "0xA5F37791378c55941a52B4dCb70Be4D8D09f5e43"
+        "eth:0xA5F37791378c55941a52B4dCb70Be4D8D09f5e43"
      values.owner:
-        "0x8434dc705e4B729405Dd66C94DfC62bc3825Ea69"
+        "eth:0x8434dc705e4B729405Dd66C94DfC62bc3825Ea69"
      implementationNames.0xbE81A9D662422f667F634f3Fc301e2E360FeFB30:
-        "ProxyAdmin"
      implementationNames.eth:0xbE81A9D662422f667F634f3Fc301e2E360FeFB30:
+        "ProxyAdmin"
    }
```

```diff
    EOA  (0xc0E743E625bBB17E3B16efC984df9678D06EcdDF) {
    +++ description: None
      address:
-        "0xc0E743E625bBB17E3B16efC984df9678D06EcdDF"
+        "eth:0xc0E743E625bBB17E3B16efC984df9678D06EcdDF"
    }
```

```diff
    EOA  (0xce1aC9f03e9F2e86183bE6996c31A02BD423b04c) {
    +++ description: None
      address:
-        "0xce1aC9f03e9F2e86183bE6996c31A02BD423b04c"
+        "eth:0xce1aC9f03e9F2e86183bE6996c31A02BD423b04c"
    }
```

```diff
    EOA  (0xdFd8559CC8000C792BA322f7CFF31dF7C56661d4) {
    +++ description: None
      address:
-        "0xdFd8559CC8000C792BA322f7CFF31dF7C56661d4"
+        "eth:0xdFd8559CC8000C792BA322f7CFF31dF7C56661d4"
    }
```

```diff
    contract L1CrossDomainMessenger (0xF005dFb08377faD44588Af68d0884D272A6fb050) {
    +++ description: Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function.
      address:
-        "0xF005dFb08377faD44588Af68d0884D272A6fb050"
+        "eth:0xF005dFb08377faD44588Af68d0884D272A6fb050"
      values.$admin:
-        "0xbE81A9D662422f667F634f3Fc301e2E360FeFB30"
+        "eth:0xbE81A9D662422f667F634f3Fc301e2E360FeFB30"
      values.$implementation:
-        "0x5b531AA3ef066E74eBb81cca3B6F841321148369"
+        "eth:0x5b531AA3ef066E74eBb81cca3B6F841321148369"
      values.$pastUpgrades.0.2.0:
-        "0x5b531AA3ef066E74eBb81cca3B6F841321148369"
+        "eth:0x5b531AA3ef066E74eBb81cca3B6F841321148369"
      values.OTHER_MESSENGER:
-        "0x4200000000000000000000000000000000000007"
+        "eth:0x4200000000000000000000000000000000000007"
      values.otherMessenger:
-        "0x4200000000000000000000000000000000000007"
+        "eth:0x4200000000000000000000000000000000000007"
      values.portal:
-        "0x39a0005415256B9863aFE2d55Edcf75ECc3A4D7e"
+        "eth:0x39a0005415256B9863aFE2d55Edcf75ECc3A4D7e"
      values.PORTAL:
-        "0x39a0005415256B9863aFE2d55Edcf75ECc3A4D7e"
+        "eth:0x39a0005415256B9863aFE2d55Edcf75ECc3A4D7e"
      values.ResolvedDelegateProxy_addressManager:
-        "0xA5F37791378c55941a52B4dCb70Be4D8D09f5e43"
+        "eth:0xA5F37791378c55941a52B4dCb70Be4D8D09f5e43"
      values.superchainConfig:
-        "0x15144FB8621cB3c4ED3DB223c173ffb58C8D2aB8"
+        "eth:0x15144FB8621cB3c4ED3DB223c173ffb58C8D2aB8"
      implementationNames.0xF005dFb08377faD44588Af68d0884D272A6fb050:
-        "ResolvedDelegateProxy"
      implementationNames.0x5b531AA3ef066E74eBb81cca3B6F841321148369:
-        "L1CrossDomainMessenger"
      implementationNames.eth:0xF005dFb08377faD44588Af68d0884D272A6fb050:
+        "ResolvedDelegateProxy"
      implementationNames.eth:0x5b531AA3ef066E74eBb81cca3B6F841321148369:
+        "L1CrossDomainMessenger"
    }
```

```diff
    EOA  (0xfF00000000000000000000000000000000043111) {
    +++ description: None
      address:
-        "0xfF00000000000000000000000000000000043111"
+        "eth:0xfF00000000000000000000000000000000043111"
    }
```

```diff
+   Status: CREATED
    contract OptimismMintableERC20Factory (0x0262fEDC4A98f94dDB90CeF0E058644d8409342C)
    +++ description: A helper contract that generates OptimismMintableERC20 contracts on the network it's deployed to. OptimismMintableERC20 is a standard extension of the base ERC20 token contract designed to allow the L1StandardBridge contracts to mint and burn tokens. This makes it possible to use an OptimismMintableERC20 as this chain's representation of a token on the host chain, or vice-versa.
```

```diff
+   Status: CREATED
    contract SuperchainConfig (0x15144FB8621cB3c4ED3DB223c173ffb58C8D2aB8)
    +++ description: This is NOT the shared SuperchainConfig contract of the OP stack Superchain but rather a local fork. It manages the `PAUSED_SLOT`, a boolean value indicating whether the local chain is paused, and `GUARDIAN_SLOT`, the address of the guardian which can pause and unpause the system.
```

```diff
+   Status: CREATED
    contract OptimismPortal (0x39a0005415256B9863aFE2d55Edcf75ECc3A4D7e)
    +++ description: The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals.
```

```diff
+   Status: CREATED
    contract SystemConfig (0x5ae68684D9179A8053883f1Df599Ea7Fb35303c3)
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
```

```diff
+   Status: CREATED
    contract L1StandardBridge (0x5eaa10F99e7e6D177eF9F74E519E319aa49f191e)
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain.
```

```diff
+   Status: CREATED
    contract L2OutputOracle (0x6daF3a3497D8abdFE12915aDD9829f83A79C0d51)
    +++ description: Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots.
```

```diff
+   Status: CREATED
    contract GnosisSafe (0x8434dc705e4B729405Dd66C94DfC62bc3825Ea69)
    +++ description: None
```

```diff
+   Status: CREATED
    contract L1ERC721Bridge (0xa446331bD28cbe0186A983a27C528f566B6bedE0)
    +++ description: Used to bridge ERC-721 tokens from host chain to this chain.
```

```diff
+   Status: CREATED
    contract AddressManager (0xA5F37791378c55941a52B4dCb70Be4D8D09f5e43)
    +++ description: Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts.
```

```diff
+   Status: CREATED
    contract ProxyAdmin (0xbE81A9D662422f667F634f3Fc301e2E360FeFB30)
    +++ description: None
```

```diff
+   Status: CREATED
    contract L1CrossDomainMessenger (0xF005dFb08377faD44588Af68d0884D272A6fb050)
    +++ description: Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function.
```

Generated with discovered.json: 0x30bcf5f77a5ec7100e682538f5c53d07577d6720

# Diff at Mon, 14 Jul 2025 08:02:44 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@0dc82cd5064c9c6dc9fb20e2291a8bb6b2048e27 block: 22765735
- current block number: 22765735

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22765735 (main branch discovery), not current.

```diff
    contract OptimismMintableERC20Factory (0x0262fEDC4A98f94dDB90CeF0E058644d8409342C) {
    +++ description: A helper contract that generates OptimismMintableERC20 contracts on the network it's deployed to. OptimismMintableERC20 is a standard extension of the base ERC20 token contract designed to allow the L1StandardBridge contracts to mint and burn tokens. This makes it possible to use an OptimismMintableERC20 as this chain's representation of a token on the host chain, or vice-versa.
      description:
-        "A helper contract that generates OptimismMintableERC20 contracts on the network it's deployed to. OptimismMintableERC20 is a standard extension of the base ERC20 token contract designed to allow the L1StandardBridge contracts to mint and burn tokens. This makes it possible to use an OptimismMintablERC20 as this chain's representation of a token on the host chain, or vice-versa."
+        "A helper contract that generates OptimismMintableERC20 contracts on the network it's deployed to. OptimismMintableERC20 is a standard extension of the base ERC20 token contract designed to allow the L1StandardBridge contracts to mint and burn tokens. This makes it possible to use an OptimismMintableERC20 as this chain's representation of a token on the host chain, or vice-versa."
    }
```

Generated with discovered.json: 0x9c17355b77287dfb36b994fa76967216a26718ac

# Diff at Fri, 04 Jul 2025 12:19:02 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@1f56dc47fe915564d4555300304da4d3bcbc087f block: 22765735
- current block number: 22765735

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22765735 (main branch discovery), not current.

```diff
    EOA  (0x2BD42D6CFA838fB15187F3D59dC19eD169b2659e) {
    +++ description: None
      receivedPermissions.0.from:
-        "ethereum:0x6daF3a3497D8abdFE12915aDD9829f83A79C0d51"
+        "eth:0x6daF3a3497D8abdFE12915aDD9829f83A79C0d51"
      receivedPermissions.1.from:
-        "ethereum:0x6daF3a3497D8abdFE12915aDD9829f83A79C0d51"
+        "eth:0x6daF3a3497D8abdFE12915aDD9829f83A79C0d51"
    }
```

```diff
    EOA  (0x65115C6D23274E0A29A63B69130eFe901Aa52e7A) {
    +++ description: None
      receivedPermissions.0.from:
-        "ethereum:0x5ae68684D9179A8053883f1Df599Ea7Fb35303c3"
+        "eth:0x5ae68684D9179A8053883f1Df599Ea7Fb35303c3"
    }
```

```diff
    contract GnosisSafe (0x8434dc705e4B729405Dd66C94DfC62bc3825Ea69) {
    +++ description: None
      receivedPermissions.0.via.0.address:
-        "ethereum:0xbE81A9D662422f667F634f3Fc301e2E360FeFB30"
+        "eth:0xbE81A9D662422f667F634f3Fc301e2E360FeFB30"
      receivedPermissions.0.from:
-        "ethereum:0xA5F37791378c55941a52B4dCb70Be4D8D09f5e43"
+        "eth:0xA5F37791378c55941a52B4dCb70Be4D8D09f5e43"
      receivedPermissions.1.via.0.address:
-        "ethereum:0xbE81A9D662422f667F634f3Fc301e2E360FeFB30"
+        "eth:0xbE81A9D662422f667F634f3Fc301e2E360FeFB30"
      receivedPermissions.1.from:
-        "ethereum:0x0262fEDC4A98f94dDB90CeF0E058644d8409342C"
+        "eth:0x0262fEDC4A98f94dDB90CeF0E058644d8409342C"
      receivedPermissions.2.via.0.address:
-        "ethereum:0xbE81A9D662422f667F634f3Fc301e2E360FeFB30"
+        "eth:0xbE81A9D662422f667F634f3Fc301e2E360FeFB30"
      receivedPermissions.2.from:
-        "ethereum:0x15144FB8621cB3c4ED3DB223c173ffb58C8D2aB8"
+        "eth:0x15144FB8621cB3c4ED3DB223c173ffb58C8D2aB8"
      receivedPermissions.3.via.0.address:
-        "ethereum:0xbE81A9D662422f667F634f3Fc301e2E360FeFB30"
+        "eth:0xbE81A9D662422f667F634f3Fc301e2E360FeFB30"
      receivedPermissions.3.from:
-        "ethereum:0x39a0005415256B9863aFE2d55Edcf75ECc3A4D7e"
+        "eth:0x39a0005415256B9863aFE2d55Edcf75ECc3A4D7e"
      receivedPermissions.4.via.0.address:
-        "ethereum:0xbE81A9D662422f667F634f3Fc301e2E360FeFB30"
+        "eth:0xbE81A9D662422f667F634f3Fc301e2E360FeFB30"
      receivedPermissions.4.from:
-        "ethereum:0x5ae68684D9179A8053883f1Df599Ea7Fb35303c3"
+        "eth:0x5ae68684D9179A8053883f1Df599Ea7Fb35303c3"
      receivedPermissions.5.via.0.address:
-        "ethereum:0xbE81A9D662422f667F634f3Fc301e2E360FeFB30"
+        "eth:0xbE81A9D662422f667F634f3Fc301e2E360FeFB30"
      receivedPermissions.5.from:
-        "ethereum:0x5eaa10F99e7e6D177eF9F74E519E319aa49f191e"
+        "eth:0x5eaa10F99e7e6D177eF9F74E519E319aa49f191e"
      receivedPermissions.6.via.0.address:
-        "ethereum:0xbE81A9D662422f667F634f3Fc301e2E360FeFB30"
+        "eth:0xbE81A9D662422f667F634f3Fc301e2E360FeFB30"
      receivedPermissions.6.from:
-        "ethereum:0x6daF3a3497D8abdFE12915aDD9829f83A79C0d51"
+        "eth:0x6daF3a3497D8abdFE12915aDD9829f83A79C0d51"
      receivedPermissions.7.via.0.address:
-        "ethereum:0xbE81A9D662422f667F634f3Fc301e2E360FeFB30"
+        "eth:0xbE81A9D662422f667F634f3Fc301e2E360FeFB30"
      receivedPermissions.7.from:
-        "ethereum:0xa446331bD28cbe0186A983a27C528f566B6bedE0"
+        "eth:0xa446331bD28cbe0186A983a27C528f566B6bedE0"
      receivedPermissions.8.via.0.address:
-        "ethereum:0xbE81A9D662422f667F634f3Fc301e2E360FeFB30"
+        "eth:0xbE81A9D662422f667F634f3Fc301e2E360FeFB30"
      receivedPermissions.8.from:
-        "ethereum:0xF005dFb08377faD44588Af68d0884D272A6fb050"
+        "eth:0xF005dFb08377faD44588Af68d0884D272A6fb050"
      directlyReceivedPermissions.0.from:
-        "ethereum:0xbE81A9D662422f667F634f3Fc301e2E360FeFB30"
+        "eth:0xbE81A9D662422f667F634f3Fc301e2E360FeFB30"
    }
```

```diff
    contract ProxyAdmin (0xbE81A9D662422f667F634f3Fc301e2E360FeFB30) {
    +++ description: None
      directlyReceivedPermissions.0.from:
-        "ethereum:0xA5F37791378c55941a52B4dCb70Be4D8D09f5e43"
+        "eth:0xA5F37791378c55941a52B4dCb70Be4D8D09f5e43"
      directlyReceivedPermissions.1.from:
-        "ethereum:0x0262fEDC4A98f94dDB90CeF0E058644d8409342C"
+        "eth:0x0262fEDC4A98f94dDB90CeF0E058644d8409342C"
      directlyReceivedPermissions.2.from:
-        "ethereum:0x15144FB8621cB3c4ED3DB223c173ffb58C8D2aB8"
+        "eth:0x15144FB8621cB3c4ED3DB223c173ffb58C8D2aB8"
      directlyReceivedPermissions.3.from:
-        "ethereum:0x39a0005415256B9863aFE2d55Edcf75ECc3A4D7e"
+        "eth:0x39a0005415256B9863aFE2d55Edcf75ECc3A4D7e"
      directlyReceivedPermissions.4.from:
-        "ethereum:0x5ae68684D9179A8053883f1Df599Ea7Fb35303c3"
+        "eth:0x5ae68684D9179A8053883f1Df599Ea7Fb35303c3"
      directlyReceivedPermissions.5.from:
-        "ethereum:0x5eaa10F99e7e6D177eF9F74E519E319aa49f191e"
+        "eth:0x5eaa10F99e7e6D177eF9F74E519E319aa49f191e"
      directlyReceivedPermissions.6.from:
-        "ethereum:0x6daF3a3497D8abdFE12915aDD9829f83A79C0d51"
+        "eth:0x6daF3a3497D8abdFE12915aDD9829f83A79C0d51"
      directlyReceivedPermissions.7.from:
-        "ethereum:0xa446331bD28cbe0186A983a27C528f566B6bedE0"
+        "eth:0xa446331bD28cbe0186A983a27C528f566B6bedE0"
      directlyReceivedPermissions.8.from:
-        "ethereum:0xF005dFb08377faD44588Af68d0884D272A6fb050"
+        "eth:0xF005dFb08377faD44588Af68d0884D272A6fb050"
    }
```

```diff
    EOA  (0xc0E743E625bBB17E3B16efC984df9678D06EcdDF) {
    +++ description: None
      receivedPermissions.0.from:
-        "ethereum:0x6daF3a3497D8abdFE12915aDD9829f83A79C0d51"
+        "eth:0x6daF3a3497D8abdFE12915aDD9829f83A79C0d51"
      receivedPermissions.1.from:
-        "ethereum:0x6daF3a3497D8abdFE12915aDD9829f83A79C0d51"
+        "eth:0x6daF3a3497D8abdFE12915aDD9829f83A79C0d51"
      receivedPermissions.2.from:
-        "ethereum:0x15144FB8621cB3c4ED3DB223c173ffb58C8D2aB8"
+        "eth:0x15144FB8621cB3c4ED3DB223c173ffb58C8D2aB8"
      receivedPermissions.3.from:
-        "ethereum:0x39a0005415256B9863aFE2d55Edcf75ECc3A4D7e"
+        "eth:0x39a0005415256B9863aFE2d55Edcf75ECc3A4D7e"
      receivedPermissions.4.from:
-        "ethereum:0x39a0005415256B9863aFE2d55Edcf75ECc3A4D7e"
+        "eth:0x39a0005415256B9863aFE2d55Edcf75ECc3A4D7e"
      receivedPermissions.5.from:
-        "ethereum:0x5ae68684D9179A8053883f1Df599Ea7Fb35303c3"
+        "eth:0x5ae68684D9179A8053883f1Df599Ea7Fb35303c3"
    }
```

Generated with discovered.json: 0x380b87ff1319bb45bb30ebebe25422260ca11f67

# Diff at Mon, 23 Jun 2025 07:47:33 GMT:

- author: vincfurc (<10850139+vincfurc@users.noreply.github.com>)
- current block number: 22765735

## Description

First discovery, all templatized.

## Initial discovery

```diff
+   Status: CREATED
    contract OptimismMintableERC20Factory (0x0262fEDC4A98f94dDB90CeF0E058644d8409342C)
    +++ description: A helper contract that generates OptimismMintableERC20 contracts on the network it's deployed to. OptimismMintableERC20 is a standard extension of the base ERC20 token contract designed to allow the L1StandardBridge contracts to mint and burn tokens. This makes it possible to use an OptimismMintablERC20 as this chain's representation of a token on the host chain, or vice-versa.
```

```diff
+   Status: CREATED
    contract SuperchainConfig (0x15144FB8621cB3c4ED3DB223c173ffb58C8D2aB8)
    +++ description: This is NOT the shared SuperchainConfig contract of the OP stack Superchain but rather a local fork. It manages the `PAUSED_SLOT`, a boolean value indicating whether the local chain is paused, and `GUARDIAN_SLOT`, the address of the guardian which can pause and unpause the system.
```

```diff
+   Status: CREATED
    contract OptimismPortal (0x39a0005415256B9863aFE2d55Edcf75ECc3A4D7e)
    +++ description: The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals.
```

```diff
+   Status: CREATED
    contract SystemConfig (0x5ae68684D9179A8053883f1Df599Ea7Fb35303c3)
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
```

```diff
+   Status: CREATED
    contract L1StandardBridge (0x5eaa10F99e7e6D177eF9F74E519E319aa49f191e)
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain.
```

```diff
+   Status: CREATED
    contract L2OutputOracle (0x6daF3a3497D8abdFE12915aDD9829f83A79C0d51)
    +++ description: Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots.
```

```diff
+   Status: CREATED
    contract GnosisSafe (0x8434dc705e4B729405Dd66C94DfC62bc3825Ea69)
    +++ description: None
```

```diff
+   Status: CREATED
    contract L1ERC721Bridge (0xa446331bD28cbe0186A983a27C528f566B6bedE0)
    +++ description: Used to bridge ERC-721 tokens from host chain to this chain.
```

```diff
+   Status: CREATED
    contract AddressManager (0xA5F37791378c55941a52B4dCb70Be4D8D09f5e43)
    +++ description: Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts.
```

```diff
+   Status: CREATED
    contract ProxyAdmin (0xbE81A9D662422f667F634f3Fc301e2E360FeFB30)
    +++ description: None
```

```diff
+   Status: CREATED
    contract L1CrossDomainMessenger (0xF005dFb08377faD44588Af68d0884D272A6fb050)
    +++ description: Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function.
```
