Generated with discovered.json: 0xdd50b7c2f406bc04ea40752a2167be811739fcdb

# Diff at Mon, 14 Jul 2025 12:45:07 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@9f4300dad2f3d080cd56fa311d4a848556c74e72 block: 22208380
- current block number: 22208380

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22208380 (main branch discovery), not current.

```diff
    EOA  (0x000000000000000000000000000000000000dEaD) {
    +++ description: None
      address:
-        "0x000000000000000000000000000000000000dEaD"
+        "eth:0x000000000000000000000000000000000000dEaD"
    }
```

```diff
    EOA  (0x052a8cd5967bc3Bdb5660c989a3A68bCA683A077) {
    +++ description: None
      address:
-        "0x052a8cd5967bc3Bdb5660c989a3A68bCA683A077"
+        "eth:0x052a8cd5967bc3Bdb5660c989a3A68bCA683A077"
    }
```

```diff
    EOA  (0x0B3476949e1C82160575295f58720E16EeD2BF7b) {
    +++ description: None
      address:
-        "0x0B3476949e1C82160575295f58720E16EeD2BF7b"
+        "eth:0x0B3476949e1C82160575295f58720E16EeD2BF7b"
    }
```

```diff
    contract L2OutputOracle (0x1A9aE6486caEc0504657351ac473B3dF8A1367cb) {
    +++ description: Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots.
      address:
-        "0x1A9aE6486caEc0504657351ac473B3dF8A1367cb"
+        "eth:0x1A9aE6486caEc0504657351ac473B3dF8A1367cb"
      values.$admin:
-        "0xD069C4724f9bC15FA53b3b2516594512AEf8c957"
+        "eth:0xD069C4724f9bC15FA53b3b2516594512AEf8c957"
      values.$implementation:
-        "0xA3facd35d9a0BD9Df1603E00F10D7b0f9Ee5f587"
+        "eth:0xA3facd35d9a0BD9Df1603E00F10D7b0f9Ee5f587"
      values.$pastUpgrades.0.2.0:
-        "0xA3facd35d9a0BD9Df1603E00F10D7b0f9Ee5f587"
+        "eth:0xA3facd35d9a0BD9Df1603E00F10D7b0f9Ee5f587"
      values.$pastUpgrades.1.2.0:
-        "0xA9D78F579f1B30194F3c2Ca1987A9B91A33BDF08"
+        "eth:0xA9D78F579f1B30194F3c2Ca1987A9B91A33BDF08"
      values.$pastUpgrades.2.2.0:
-        "0xA3facd35d9a0BD9Df1603E00F10D7b0f9Ee5f587"
+        "eth:0xA3facd35d9a0BD9Df1603E00F10D7b0f9Ee5f587"
+++ severity: HIGH
      values.challenger:
-        "0x0B3476949e1C82160575295f58720E16EeD2BF7b"
+        "eth:0x0B3476949e1C82160575295f58720E16EeD2BF7b"
      values.CHALLENGER:
-        "0x0B3476949e1C82160575295f58720E16EeD2BF7b"
+        "eth:0x0B3476949e1C82160575295f58720E16EeD2BF7b"
+++ severity: HIGH
      values.proposer:
-        "0xA1ddae0829c3bD4096c34aEC58b2BC21e3a6d10E"
+        "eth:0xA1ddae0829c3bD4096c34aEC58b2BC21e3a6d10E"
      values.PROPOSER:
-        "0xA1ddae0829c3bD4096c34aEC58b2BC21e3a6d10E"
+        "eth:0xA1ddae0829c3bD4096c34aEC58b2BC21e3a6d10E"
      implementationNames.0x1A9aE6486caEc0504657351ac473B3dF8A1367cb:
-        "Proxy"
      implementationNames.0xA3facd35d9a0BD9Df1603E00F10D7b0f9Ee5f587:
-        "L2OutputOracle"
      implementationNames.eth:0x1A9aE6486caEc0504657351ac473B3dF8A1367cb:
+        "Proxy"
      implementationNames.eth:0xA3facd35d9a0BD9Df1603E00F10D7b0f9Ee5f587:
+        "L2OutputOracle"
    }
```

```diff
    contract Funki Multisig 2 (0x3D389212A78FD7D4600C9483470e59630C293416) {
    +++ description: None
      address:
-        "0x3D389212A78FD7D4600C9483470e59630C293416"
+        "eth:0x3D389212A78FD7D4600C9483470e59630C293416"
      values.$implementation:
-        "0x41675C099F32341bf84BFc5382aF534df5C7461a"
+        "eth:0x41675C099F32341bf84BFc5382aF534df5C7461a"
      values.$members.0:
-        "0xa8AC7D03BEb92Fa3E6030AEB21629D00Ffb66dD7"
+        "eth:0xa8AC7D03BEb92Fa3E6030AEB21629D00Ffb66dD7"
      values.$members.1:
-        "0xaC79765A73eB9dcBd3c427181E6819902AE25b48"
+        "eth:0xaC79765A73eB9dcBd3c427181E6819902AE25b48"
      values.$members.2:
-        "0xB5b01E638CEF6AE50462A487d70005D6fe85eCf2"
+        "eth:0xB5b01E638CEF6AE50462A487d70005D6fe85eCf2"
      values.$members.3:
-        "0xc0CE2761d5cC92d25dB6ccD95e4b9483eD22D11B"
+        "eth:0xc0CE2761d5cC92d25dB6ccD95e4b9483eD22D11B"
      implementationNames.0x3D389212A78FD7D4600C9483470e59630C293416:
-        "SafeProxy"
      implementationNames.0x41675C099F32341bf84BFc5382aF534df5C7461a:
-        "Safe"
      implementationNames.eth:0x3D389212A78FD7D4600C9483470e59630C293416:
+        "SafeProxy"
      implementationNames.eth:0x41675C099F32341bf84BFc5382aF534df5C7461a:
+        "Safe"
    }
```

```diff
    EOA  (0x4712454AddDbAbACaAb84916546899CA9690A6fF) {
    +++ description: None
      address:
-        "0x4712454AddDbAbACaAb84916546899CA9690A6fF"
+        "eth:0x4712454AddDbAbACaAb84916546899CA9690A6fF"
    }
```

```diff
    contract AddressManager (0x5a4ebF927338EA6af377caEee99C85088908f57D) {
    +++ description: Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts.
      address:
-        "0x5a4ebF927338EA6af377caEee99C85088908f57D"
+        "eth:0x5a4ebF927338EA6af377caEee99C85088908f57D"
      values.owner:
-        "0xD069C4724f9bC15FA53b3b2516594512AEf8c957"
+        "eth:0xD069C4724f9bC15FA53b3b2516594512AEf8c957"
      implementationNames.0x5a4ebF927338EA6af377caEee99C85088908f57D:
-        "AddressManager"
      implementationNames.eth:0x5a4ebF927338EA6af377caEee99C85088908f57D:
+        "AddressManager"
    }
```

```diff
    contract OptimismPortal (0x5C9C7f98eD153a2deAA981eB5C97B31744AccF22) {
    +++ description: The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals.
      address:
-        "0x5C9C7f98eD153a2deAA981eB5C97B31744AccF22"
+        "eth:0x5C9C7f98eD153a2deAA981eB5C97B31744AccF22"
      values.$admin:
-        "0xD069C4724f9bC15FA53b3b2516594512AEf8c957"
+        "eth:0xD069C4724f9bC15FA53b3b2516594512AEf8c957"
      values.$implementation:
-        "0x90b82d6EFBA56Dcc0f1B55B8d50952c2eB9640e0"
+        "eth:0x90b82d6EFBA56Dcc0f1B55B8d50952c2eB9640e0"
      values.$pastUpgrades.0.2.0:
-        "0x90b82d6EFBA56Dcc0f1B55B8d50952c2eB9640e0"
+        "eth:0x90b82d6EFBA56Dcc0f1B55B8d50952c2eB9640e0"
      values.guardian:
-        "0x052a8cd5967bc3Bdb5660c989a3A68bCA683A077"
+        "eth:0x052a8cd5967bc3Bdb5660c989a3A68bCA683A077"
      values.l2Oracle:
-        "0x1A9aE6486caEc0504657351ac473B3dF8A1367cb"
+        "eth:0x1A9aE6486caEc0504657351ac473B3dF8A1367cb"
      values.l2Sender:
-        "0x000000000000000000000000000000000000dEaD"
+        "eth:0x000000000000000000000000000000000000dEaD"
      values.superchainConfig:
-        "0xD3B2Ee457Cf8F05f00c17BFe509b43BA04c9e5a2"
+        "eth:0xD3B2Ee457Cf8F05f00c17BFe509b43BA04c9e5a2"
      values.systemConfig:
-        "0xD39a6CcCFa23cb741bB530497e42EC337f1215a8"
+        "eth:0xD39a6CcCFa23cb741bB530497e42EC337f1215a8"
      implementationNames.0x5C9C7f98eD153a2deAA981eB5C97B31744AccF22:
-        "Proxy"
      implementationNames.0x90b82d6EFBA56Dcc0f1B55B8d50952c2eB9640e0:
-        "OptimismPortal"
      implementationNames.eth:0x5C9C7f98eD153a2deAA981eB5C97B31744AccF22:
+        "Proxy"
      implementationNames.eth:0x90b82d6EFBA56Dcc0f1B55B8d50952c2eB9640e0:
+        "OptimismPortal"
    }
```

```diff
    contract OptimismMintableERC20Factory (0x87e75DcC1BB4e5B42cB5c52eB5832d6eCC3bFeF4) {
    +++ description: A helper contract that generates OptimismMintableERC20 contracts on the network it's deployed to. OptimismMintableERC20 is a standard extension of the base ERC20 token contract designed to allow the L1StandardBridge contracts to mint and burn tokens. This makes it possible to use an OptimismMintableERC20 as this chain's representation of a token on the host chain, or vice-versa.
      address:
-        "0x87e75DcC1BB4e5B42cB5c52eB5832d6eCC3bFeF4"
+        "eth:0x87e75DcC1BB4e5B42cB5c52eB5832d6eCC3bFeF4"
      values.$admin:
-        "0xD069C4724f9bC15FA53b3b2516594512AEf8c957"
+        "eth:0xD069C4724f9bC15FA53b3b2516594512AEf8c957"
      values.$implementation:
-        "0x459FdC15D88f9bD6AD7B547ef7F4542330a0BBce"
+        "eth:0x459FdC15D88f9bD6AD7B547ef7F4542330a0BBce"
      values.$pastUpgrades.0.2.0:
-        "0x459FdC15D88f9bD6AD7B547ef7F4542330a0BBce"
+        "eth:0x459FdC15D88f9bD6AD7B547ef7F4542330a0BBce"
      values.bridge:
-        "0xA2C1C1A473250094a6244F2bcf6Cb51F670Ad3aC"
+        "eth:0xA2C1C1A473250094a6244F2bcf6Cb51F670Ad3aC"
      values.BRIDGE:
-        "0xA2C1C1A473250094a6244F2bcf6Cb51F670Ad3aC"
+        "eth:0xA2C1C1A473250094a6244F2bcf6Cb51F670Ad3aC"
      implementationNames.0x87e75DcC1BB4e5B42cB5c52eB5832d6eCC3bFeF4:
-        "Proxy"
      implementationNames.0x459FdC15D88f9bD6AD7B547ef7F4542330a0BBce:
-        "OptimismMintableERC20Factory"
      implementationNames.eth:0x87e75DcC1BB4e5B42cB5c52eB5832d6eCC3bFeF4:
+        "Proxy"
      implementationNames.eth:0x459FdC15D88f9bD6AD7B547ef7F4542330a0BBce:
+        "OptimismMintableERC20Factory"
    }
```

```diff
    contract Funki Multisig 1 (0x89CB6669f87c165E7128F4a57476EE4Daa7ffbCD) {
    +++ description: None
      address:
-        "0x89CB6669f87c165E7128F4a57476EE4Daa7ffbCD"
+        "eth:0x89CB6669f87c165E7128F4a57476EE4Daa7ffbCD"
      values.$implementation:
-        "0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552"
+        "eth:0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552"
      values.$members.0:
-        "0xa8AC7D03BEb92Fa3E6030AEB21629D00Ffb66dD7"
+        "eth:0xa8AC7D03BEb92Fa3E6030AEB21629D00Ffb66dD7"
      values.$members.1:
-        "0xaC79765A73eB9dcBd3c427181E6819902AE25b48"
+        "eth:0xaC79765A73eB9dcBd3c427181E6819902AE25b48"
      values.$members.2:
-        "0xB5b01E638CEF6AE50462A487d70005D6fe85eCf2"
+        "eth:0xB5b01E638CEF6AE50462A487d70005D6fe85eCf2"
      values.$members.3:
-        "0xf0AE006C6f810831DA1d2A061288575fB5082144"
+        "eth:0xf0AE006C6f810831DA1d2A061288575fB5082144"
      implementationNames.0x89CB6669f87c165E7128F4a57476EE4Daa7ffbCD:
-        "GnosisSafeProxy"
      implementationNames.0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552:
-        "GnosisSafe"
      implementationNames.eth:0x89CB6669f87c165E7128F4a57476EE4Daa7ffbCD:
+        "GnosisSafeProxy"
      implementationNames.eth:0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552:
+        "GnosisSafe"
    }
```

```diff
    contract L1CrossDomainMessenger (0x8F56a665c376A08b604DD32ee6E88667A6093172) {
    +++ description: Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function.
      address:
-        "0x8F56a665c376A08b604DD32ee6E88667A6093172"
+        "eth:0x8F56a665c376A08b604DD32ee6E88667A6093172"
      values.$admin:
-        "0xD069C4724f9bC15FA53b3b2516594512AEf8c957"
+        "eth:0xD069C4724f9bC15FA53b3b2516594512AEf8c957"
      values.$implementation:
-        "0x96f41d8f175F7907Afa78C565f564C9114C9Bd20"
+        "eth:0x96f41d8f175F7907Afa78C565f564C9114C9Bd20"
      values.$pastUpgrades.0.2.0:
-        "0x96f41d8f175F7907Afa78C565f564C9114C9Bd20"
+        "eth:0x96f41d8f175F7907Afa78C565f564C9114C9Bd20"
      values.OTHER_MESSENGER:
-        "0x4200000000000000000000000000000000000007"
+        "eth:0x4200000000000000000000000000000000000007"
      values.otherMessenger:
-        "0x4200000000000000000000000000000000000007"
+        "eth:0x4200000000000000000000000000000000000007"
      values.portal:
-        "0x5C9C7f98eD153a2deAA981eB5C97B31744AccF22"
+        "eth:0x5C9C7f98eD153a2deAA981eB5C97B31744AccF22"
      values.PORTAL:
-        "0x5C9C7f98eD153a2deAA981eB5C97B31744AccF22"
+        "eth:0x5C9C7f98eD153a2deAA981eB5C97B31744AccF22"
      values.ResolvedDelegateProxy_addressManager:
-        "0x5a4ebF927338EA6af377caEee99C85088908f57D"
+        "eth:0x5a4ebF927338EA6af377caEee99C85088908f57D"
      values.superchainConfig:
-        "0xD3B2Ee457Cf8F05f00c17BFe509b43BA04c9e5a2"
+        "eth:0xD3B2Ee457Cf8F05f00c17BFe509b43BA04c9e5a2"
      values.systemConfig:
-        "0xD39a6CcCFa23cb741bB530497e42EC337f1215a8"
+        "eth:0xD39a6CcCFa23cb741bB530497e42EC337f1215a8"
      implementationNames.0x8F56a665c376A08b604DD32ee6E88667A6093172:
-        "ResolvedDelegateProxy"
      implementationNames.0x96f41d8f175F7907Afa78C565f564C9114C9Bd20:
-        "L1CrossDomainMessenger"
      implementationNames.eth:0x8F56a665c376A08b604DD32ee6E88667A6093172:
+        "ResolvedDelegateProxy"
      implementationNames.eth:0x96f41d8f175F7907Afa78C565f564C9114C9Bd20:
+        "L1CrossDomainMessenger"
    }
```

```diff
    contract L1ERC721Bridge (0x94519dD4BA8ba20Aaad14f7C6cD00fa1bB0192E9) {
    +++ description: Used to bridge ERC-721 tokens from host chain to this chain.
      address:
-        "0x94519dD4BA8ba20Aaad14f7C6cD00fa1bB0192E9"
+        "eth:0x94519dD4BA8ba20Aaad14f7C6cD00fa1bB0192E9"
      values.$admin:
-        "0xD069C4724f9bC15FA53b3b2516594512AEf8c957"
+        "eth:0xD069C4724f9bC15FA53b3b2516594512AEf8c957"
      values.$implementation:
-        "0x5E739e53106a0d1516196aa9E8EE402CaCC7B768"
+        "eth:0x5E739e53106a0d1516196aa9E8EE402CaCC7B768"
      values.$pastUpgrades.0.2.0:
-        "0x5E739e53106a0d1516196aa9E8EE402CaCC7B768"
+        "eth:0x5E739e53106a0d1516196aa9E8EE402CaCC7B768"
      values.messenger:
-        "0x8F56a665c376A08b604DD32ee6E88667A6093172"
+        "eth:0x8F56a665c376A08b604DD32ee6E88667A6093172"
      values.MESSENGER:
-        "0x8F56a665c376A08b604DD32ee6E88667A6093172"
+        "eth:0x8F56a665c376A08b604DD32ee6E88667A6093172"
      values.OTHER_BRIDGE:
-        "0x4200000000000000000000000000000000000014"
+        "eth:0x4200000000000000000000000000000000000014"
      values.otherBridge:
-        "0x4200000000000000000000000000000000000014"
+        "eth:0x4200000000000000000000000000000000000014"
      values.superchainConfig:
-        "0xD3B2Ee457Cf8F05f00c17BFe509b43BA04c9e5a2"
+        "eth:0xD3B2Ee457Cf8F05f00c17BFe509b43BA04c9e5a2"
      implementationNames.0x94519dD4BA8ba20Aaad14f7C6cD00fa1bB0192E9:
-        "Proxy"
      implementationNames.0x5E739e53106a0d1516196aa9E8EE402CaCC7B768:
-        "L1ERC721Bridge"
      implementationNames.eth:0x94519dD4BA8ba20Aaad14f7C6cD00fa1bB0192E9:
+        "Proxy"
      implementationNames.eth:0x5E739e53106a0d1516196aa9E8EE402CaCC7B768:
+        "L1ERC721Bridge"
    }
```

```diff
    EOA  (0xA1ddae0829c3bD4096c34aEC58b2BC21e3a6d10E) {
    +++ description: None
      address:
-        "0xA1ddae0829c3bD4096c34aEC58b2BC21e3a6d10E"
+        "eth:0xA1ddae0829c3bD4096c34aEC58b2BC21e3a6d10E"
    }
```

```diff
    contract L1StandardBridge (0xA2C1C1A473250094a6244F2bcf6Cb51F670Ad3aC) {
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain.
      address:
-        "0xA2C1C1A473250094a6244F2bcf6Cb51F670Ad3aC"
+        "eth:0xA2C1C1A473250094a6244F2bcf6Cb51F670Ad3aC"
      values.$admin:
-        "0xD069C4724f9bC15FA53b3b2516594512AEf8c957"
+        "eth:0xD069C4724f9bC15FA53b3b2516594512AEf8c957"
      values.$implementation:
-        "0x64F1e21412f61e9Ceda3b65FcFC5A4739c7eBBeE"
+        "eth:0x64F1e21412f61e9Ceda3b65FcFC5A4739c7eBBeE"
      values.l2TokenBridge:
-        "0x4200000000000000000000000000000000000010"
+        "eth:0x4200000000000000000000000000000000000010"
      values.messenger:
-        "0x8F56a665c376A08b604DD32ee6E88667A6093172"
+        "eth:0x8F56a665c376A08b604DD32ee6E88667A6093172"
      values.MESSENGER:
-        "0x8F56a665c376A08b604DD32ee6E88667A6093172"
+        "eth:0x8F56a665c376A08b604DD32ee6E88667A6093172"
      values.OTHER_BRIDGE:
-        "0x4200000000000000000000000000000000000010"
+        "eth:0x4200000000000000000000000000000000000010"
      values.otherBridge:
-        "0x4200000000000000000000000000000000000010"
+        "eth:0x4200000000000000000000000000000000000010"
      values.superchainConfig:
-        "0xD3B2Ee457Cf8F05f00c17BFe509b43BA04c9e5a2"
+        "eth:0xD3B2Ee457Cf8F05f00c17BFe509b43BA04c9e5a2"
      values.systemConfig:
-        "0xD39a6CcCFa23cb741bB530497e42EC337f1215a8"
+        "eth:0xD39a6CcCFa23cb741bB530497e42EC337f1215a8"
      implementationNames.0xA2C1C1A473250094a6244F2bcf6Cb51F670Ad3aC:
-        "L1ChugSplashProxy"
      implementationNames.0x64F1e21412f61e9Ceda3b65FcFC5A4739c7eBBeE:
-        "L1StandardBridge"
      implementationNames.eth:0xA2C1C1A473250094a6244F2bcf6Cb51F670Ad3aC:
+        "L1ChugSplashProxy"
      implementationNames.eth:0x64F1e21412f61e9Ceda3b65FcFC5A4739c7eBBeE:
+        "L1StandardBridge"
    }
```

```diff
    EOA  (0xa54e493641d097d164A6a2D8F9895303344d88A9) {
    +++ description: None
      address:
-        "0xa54e493641d097d164A6a2D8F9895303344d88A9"
+        "eth:0xa54e493641d097d164A6a2D8F9895303344d88A9"
    }
```

```diff
    EOA AltLayer 3 (0xa8AC7D03BEb92Fa3E6030AEB21629D00Ffb66dD7) {
    +++ description: None
      address:
-        "0xa8AC7D03BEb92Fa3E6030AEB21629D00Ffb66dD7"
+        "eth:0xa8AC7D03BEb92Fa3E6030AEB21629D00Ffb66dD7"
    }
```

```diff
    EOA AltLayer 1 (0xaC79765A73eB9dcBd3c427181E6819902AE25b48) {
    +++ description: None
      address:
-        "0xaC79765A73eB9dcBd3c427181E6819902AE25b48"
+        "eth:0xaC79765A73eB9dcBd3c427181E6819902AE25b48"
    }
```

```diff
    EOA AltLayer 2 (0xB5b01E638CEF6AE50462A487d70005D6fe85eCf2) {
    +++ description: None
      address:
-        "0xB5b01E638CEF6AE50462A487d70005D6fe85eCf2"
+        "eth:0xB5b01E638CEF6AE50462A487d70005D6fe85eCf2"
    }
```

```diff
    EOA  (0xc0CE2761d5cC92d25dB6ccD95e4b9483eD22D11B) {
    +++ description: None
      address:
-        "0xc0CE2761d5cC92d25dB6ccD95e4b9483eD22D11B"
+        "eth:0xc0CE2761d5cC92d25dB6ccD95e4b9483eD22D11B"
    }
```

```diff
    contract ProxyAdmin (0xD069C4724f9bC15FA53b3b2516594512AEf8c957) {
    +++ description: None
      address:
-        "0xD069C4724f9bC15FA53b3b2516594512AEf8c957"
+        "eth:0xD069C4724f9bC15FA53b3b2516594512AEf8c957"
      values.addressManager:
-        "0x5a4ebF927338EA6af377caEee99C85088908f57D"
+        "eth:0x5a4ebF927338EA6af377caEee99C85088908f57D"
      values.owner:
-        "0x89CB6669f87c165E7128F4a57476EE4Daa7ffbCD"
+        "eth:0x89CB6669f87c165E7128F4a57476EE4Daa7ffbCD"
      implementationNames.0xD069C4724f9bC15FA53b3b2516594512AEf8c957:
-        "ProxyAdmin"
      implementationNames.eth:0xD069C4724f9bC15FA53b3b2516594512AEf8c957:
+        "ProxyAdmin"
    }
```

```diff
    contract SystemConfig (0xD39a6CcCFa23cb741bB530497e42EC337f1215a8) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      address:
-        "0xD39a6CcCFa23cb741bB530497e42EC337f1215a8"
+        "eth:0xD39a6CcCFa23cb741bB530497e42EC337f1215a8"
      values.$admin:
-        "0xD069C4724f9bC15FA53b3b2516594512AEf8c957"
+        "eth:0xD069C4724f9bC15FA53b3b2516594512AEf8c957"
      values.$implementation:
-        "0xaE0CdC4960335A99D833d0c7Ae99b3ae0fa3c20C"
+        "eth:0xaE0CdC4960335A99D833d0c7Ae99b3ae0fa3c20C"
      values.$pastUpgrades.0.2.0:
-        "0xaE0CdC4960335A99D833d0c7Ae99b3ae0fa3c20C"
+        "eth:0xaE0CdC4960335A99D833d0c7Ae99b3ae0fa3c20C"
      values.batcherHash:
-        "0x4712454AddDbAbACaAb84916546899CA9690A6fF"
+        "eth:0x4712454AddDbAbACaAb84916546899CA9690A6fF"
      values.batchInbox:
-        "0xfF00000000000000000000000000000084BB84Bb"
+        "eth:0xfF00000000000000000000000000000084BB84Bb"
      values.disputeGameFactory:
-        "0x2Dc9d2Cb1Ba0b8A46AE252ab4FBE1ad5C5c3B795"
+        "eth:0x2Dc9d2Cb1Ba0b8A46AE252ab4FBE1ad5C5c3B795"
      values.gasPayingToken.addr_:
-        "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE"
+        "eth:0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE"
      values.l1CrossDomainMessenger:
-        "0x8F56a665c376A08b604DD32ee6E88667A6093172"
+        "eth:0x8F56a665c376A08b604DD32ee6E88667A6093172"
      values.l1ERC721Bridge:
-        "0x94519dD4BA8ba20Aaad14f7C6cD00fa1bB0192E9"
+        "eth:0x94519dD4BA8ba20Aaad14f7C6cD00fa1bB0192E9"
      values.l1StandardBridge:
-        "0xA2C1C1A473250094a6244F2bcf6Cb51F670Ad3aC"
+        "eth:0xA2C1C1A473250094a6244F2bcf6Cb51F670Ad3aC"
      values.optimismMintableERC20Factory:
-        "0x87e75DcC1BB4e5B42cB5c52eB5832d6eCC3bFeF4"
+        "eth:0x87e75DcC1BB4e5B42cB5c52eB5832d6eCC3bFeF4"
      values.optimismPortal:
-        "0x5C9C7f98eD153a2deAA981eB5C97B31744AccF22"
+        "eth:0x5C9C7f98eD153a2deAA981eB5C97B31744AccF22"
      values.owner:
-        "0x3D389212A78FD7D4600C9483470e59630C293416"
+        "eth:0x3D389212A78FD7D4600C9483470e59630C293416"
      values.sequencerInbox:
-        "0xfF00000000000000000000000000000084BB84Bb"
+        "eth:0xfF00000000000000000000000000000084BB84Bb"
      values.unsafeBlockSigner:
-        "0xa54e493641d097d164A6a2D8F9895303344d88A9"
+        "eth:0xa54e493641d097d164A6a2D8F9895303344d88A9"
      implementationNames.0xD39a6CcCFa23cb741bB530497e42EC337f1215a8:
-        "Proxy"
      implementationNames.0xaE0CdC4960335A99D833d0c7Ae99b3ae0fa3c20C:
-        "SystemConfig"
      implementationNames.eth:0xD39a6CcCFa23cb741bB530497e42EC337f1215a8:
+        "Proxy"
      implementationNames.eth:0xaE0CdC4960335A99D833d0c7Ae99b3ae0fa3c20C:
+        "SystemConfig"
    }
```

```diff
    contract SuperchainConfig (0xD3B2Ee457Cf8F05f00c17BFe509b43BA04c9e5a2) {
    +++ description: This is NOT the shared SuperchainConfig contract of the OP stack Superchain but rather a local fork. It manages the `PAUSED_SLOT`, a boolean value indicating whether the local chain is paused, and `GUARDIAN_SLOT`, the address of the guardian which can pause and unpause the system.
      address:
-        "0xD3B2Ee457Cf8F05f00c17BFe509b43BA04c9e5a2"
+        "eth:0xD3B2Ee457Cf8F05f00c17BFe509b43BA04c9e5a2"
      values.$admin:
-        "0xD069C4724f9bC15FA53b3b2516594512AEf8c957"
+        "eth:0xD069C4724f9bC15FA53b3b2516594512AEf8c957"
      values.$implementation:
-        "0xeC74948302962a0AD10219768d1226019c58CA3C"
+        "eth:0xeC74948302962a0AD10219768d1226019c58CA3C"
      values.$pastUpgrades.0.2.0:
-        "0xeC74948302962a0AD10219768d1226019c58CA3C"
+        "eth:0xeC74948302962a0AD10219768d1226019c58CA3C"
      values.guardian:
-        "0x052a8cd5967bc3Bdb5660c989a3A68bCA683A077"
+        "eth:0x052a8cd5967bc3Bdb5660c989a3A68bCA683A077"
      implementationNames.0xD3B2Ee457Cf8F05f00c17BFe509b43BA04c9e5a2:
-        "Proxy"
      implementationNames.0xeC74948302962a0AD10219768d1226019c58CA3C:
-        "SuperchainConfig"
      implementationNames.eth:0xD3B2Ee457Cf8F05f00c17BFe509b43BA04c9e5a2:
+        "Proxy"
      implementationNames.eth:0xeC74948302962a0AD10219768d1226019c58CA3C:
+        "SuperchainConfig"
    }
```

```diff
    EOA Funki (0xf0AE006C6f810831DA1d2A061288575fB5082144) {
    +++ description: None
      address:
-        "0xf0AE006C6f810831DA1d2A061288575fB5082144"
+        "eth:0xf0AE006C6f810831DA1d2A061288575fB5082144"
    }
```

```diff
    contract DataAvailabilityChallenge (0xF40b807c2407e1d7dabb85f3ceefd5EACc7bF3CD) {
    +++ description: The DataAvailabilityChallenge contract is used to challenge the full availability of data behind commimted transaction data hashes. See the technology section for more details.
      address:
-        "0xF40b807c2407e1d7dabb85f3ceefd5EACc7bF3CD"
+        "eth:0xF40b807c2407e1d7dabb85f3ceefd5EACc7bF3CD"
      values.$admin:
-        "0xD069C4724f9bC15FA53b3b2516594512AEf8c957"
+        "eth:0xD069C4724f9bC15FA53b3b2516594512AEf8c957"
      values.$implementation:
-        "0x951d813B1C700964a725C87F77c53aa696847F59"
+        "eth:0x951d813B1C700964a725C87F77c53aa696847F59"
      values.$pastUpgrades.0.2.0:
-        "0x951d813B1C700964a725C87F77c53aa696847F59"
+        "eth:0x951d813B1C700964a725C87F77c53aa696847F59"
      values.owner:
-        "0xc0CE2761d5cC92d25dB6ccD95e4b9483eD22D11B"
+        "eth:0xc0CE2761d5cC92d25dB6ccD95e4b9483eD22D11B"
      implementationNames.0xF40b807c2407e1d7dabb85f3ceefd5EACc7bF3CD:
-        "Proxy"
      implementationNames.0x951d813B1C700964a725C87F77c53aa696847F59:
-        "DataAvailabilityChallenge"
      implementationNames.eth:0xF40b807c2407e1d7dabb85f3ceefd5EACc7bF3CD:
+        "Proxy"
      implementationNames.eth:0x951d813B1C700964a725C87F77c53aa696847F59:
+        "DataAvailabilityChallenge"
    }
```

```diff
    EOA  (0xfF00000000000000000000000000000084BB84Bb) {
    +++ description: None
      address:
-        "0xfF00000000000000000000000000000084BB84Bb"
+        "eth:0xfF00000000000000000000000000000084BB84Bb"
    }
```

```diff
+   Status: CREATED
    contract L2OutputOracle (0x1A9aE6486caEc0504657351ac473B3dF8A1367cb)
    +++ description: Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots.
```

```diff
+   Status: CREATED
    contract Funki Multisig 2 (0x3D389212A78FD7D4600C9483470e59630C293416)
    +++ description: None
```

```diff
+   Status: CREATED
    contract AddressManager (0x5a4ebF927338EA6af377caEee99C85088908f57D)
    +++ description: Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts.
```

```diff
+   Status: CREATED
    contract OptimismPortal (0x5C9C7f98eD153a2deAA981eB5C97B31744AccF22)
    +++ description: The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals.
```

```diff
+   Status: CREATED
    contract OptimismMintableERC20Factory (0x87e75DcC1BB4e5B42cB5c52eB5832d6eCC3bFeF4)
    +++ description: A helper contract that generates OptimismMintableERC20 contracts on the network it's deployed to. OptimismMintableERC20 is a standard extension of the base ERC20 token contract designed to allow the L1StandardBridge contracts to mint and burn tokens. This makes it possible to use an OptimismMintableERC20 as this chain's representation of a token on the host chain, or vice-versa.
```

```diff
+   Status: CREATED
    contract Funki Multisig 1 (0x89CB6669f87c165E7128F4a57476EE4Daa7ffbCD)
    +++ description: None
```

```diff
+   Status: CREATED
    contract L1CrossDomainMessenger (0x8F56a665c376A08b604DD32ee6E88667A6093172)
    +++ description: Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function.
```

```diff
+   Status: CREATED
    contract L1ERC721Bridge (0x94519dD4BA8ba20Aaad14f7C6cD00fa1bB0192E9)
    +++ description: Used to bridge ERC-721 tokens from host chain to this chain.
```

```diff
+   Status: CREATED
    contract L1StandardBridge (0xA2C1C1A473250094a6244F2bcf6Cb51F670Ad3aC)
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain.
```

```diff
+   Status: CREATED
    contract ProxyAdmin (0xD069C4724f9bC15FA53b3b2516594512AEf8c957)
    +++ description: None
```

```diff
+   Status: CREATED
    contract SystemConfig (0xD39a6CcCFa23cb741bB530497e42EC337f1215a8)
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
```

```diff
+   Status: CREATED
    contract SuperchainConfig (0xD3B2Ee457Cf8F05f00c17BFe509b43BA04c9e5a2)
    +++ description: This is NOT the shared SuperchainConfig contract of the OP stack Superchain but rather a local fork. It manages the `PAUSED_SLOT`, a boolean value indicating whether the local chain is paused, and `GUARDIAN_SLOT`, the address of the guardian which can pause and unpause the system.
```

```diff
+   Status: CREATED
    contract DataAvailabilityChallenge (0xF40b807c2407e1d7dabb85f3ceefd5EACc7bF3CD)
    +++ description: The DataAvailabilityChallenge contract is used to challenge the full availability of data behind commimted transaction data hashes. See the technology section for more details.
```

Generated with discovered.json: 0xf5c1fa2c5db4b25755fad8d0df0c45eaeaae0da8

# Diff at Mon, 14 Jul 2025 08:02:44 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@0dc82cd5064c9c6dc9fb20e2291a8bb6b2048e27 block: 22208380
- current block number: 22208380

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22208380 (main branch discovery), not current.

```diff
    contract OptimismMintableERC20Factory (0x87e75DcC1BB4e5B42cB5c52eB5832d6eCC3bFeF4) {
    +++ description: A helper contract that generates OptimismMintableERC20 contracts on the network it's deployed to. OptimismMintableERC20 is a standard extension of the base ERC20 token contract designed to allow the L1StandardBridge contracts to mint and burn tokens. This makes it possible to use an OptimismMintableERC20 as this chain's representation of a token on the host chain, or vice-versa.
      description:
-        "A helper contract that generates OptimismMintableERC20 contracts on the network it's deployed to. OptimismMintableERC20 is a standard extension of the base ERC20 token contract designed to allow the L1StandardBridge contracts to mint and burn tokens. This makes it possible to use an OptimismMintablERC20 as this chain's representation of a token on the host chain, or vice-versa."
+        "A helper contract that generates OptimismMintableERC20 contracts on the network it's deployed to. OptimismMintableERC20 is a standard extension of the base ERC20 token contract designed to allow the L1StandardBridge contracts to mint and burn tokens. This makes it possible to use an OptimismMintableERC20 as this chain's representation of a token on the host chain, or vice-versa."
    }
```

Generated with discovered.json: 0x1502892c5e09f3f3dc98c477efc60d48e5299ec5

# Diff at Fri, 04 Jul 2025 12:19:01 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@1f56dc47fe915564d4555300304da4d3bcbc087f block: 22208380
- current block number: 22208380

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22208380 (main branch discovery), not current.

```diff
    EOA  (0x052a8cd5967bc3Bdb5660c989a3A68bCA683A077) {
    +++ description: None
      receivedPermissions.0.from:
-        "ethereum:0x5C9C7f98eD153a2deAA981eB5C97B31744AccF22"
+        "eth:0x5C9C7f98eD153a2deAA981eB5C97B31744AccF22"
      receivedPermissions.1.from:
-        "ethereum:0xD3B2Ee457Cf8F05f00c17BFe509b43BA04c9e5a2"
+        "eth:0xD3B2Ee457Cf8F05f00c17BFe509b43BA04c9e5a2"
    }
```

```diff
    EOA  (0x0B3476949e1C82160575295f58720E16EeD2BF7b) {
    +++ description: None
      receivedPermissions.0.from:
-        "ethereum:0x1A9aE6486caEc0504657351ac473B3dF8A1367cb"
+        "eth:0x1A9aE6486caEc0504657351ac473B3dF8A1367cb"
      receivedPermissions.1.from:
-        "ethereum:0x1A9aE6486caEc0504657351ac473B3dF8A1367cb"
+        "eth:0x1A9aE6486caEc0504657351ac473B3dF8A1367cb"
    }
```

```diff
    contract Funki Multisig 2 (0x3D389212A78FD7D4600C9483470e59630C293416) {
    +++ description: None
      receivedPermissions.0.from:
-        "ethereum:0xD39a6CcCFa23cb741bB530497e42EC337f1215a8"
+        "eth:0xD39a6CcCFa23cb741bB530497e42EC337f1215a8"
    }
```

```diff
    EOA  (0x4712454AddDbAbACaAb84916546899CA9690A6fF) {
    +++ description: None
      receivedPermissions.0.from:
-        "ethereum:0xD39a6CcCFa23cb741bB530497e42EC337f1215a8"
+        "eth:0xD39a6CcCFa23cb741bB530497e42EC337f1215a8"
    }
```

```diff
    contract Funki Multisig 1 (0x89CB6669f87c165E7128F4a57476EE4Daa7ffbCD) {
    +++ description: None
      receivedPermissions.0.via.0.address:
-        "ethereum:0xD069C4724f9bC15FA53b3b2516594512AEf8c957"
+        "eth:0xD069C4724f9bC15FA53b3b2516594512AEf8c957"
      receivedPermissions.0.from:
-        "ethereum:0x5a4ebF927338EA6af377caEee99C85088908f57D"
+        "eth:0x5a4ebF927338EA6af377caEee99C85088908f57D"
      receivedPermissions.1.via.0.address:
-        "ethereum:0xD069C4724f9bC15FA53b3b2516594512AEf8c957"
+        "eth:0xD069C4724f9bC15FA53b3b2516594512AEf8c957"
      receivedPermissions.1.from:
-        "ethereum:0x1A9aE6486caEc0504657351ac473B3dF8A1367cb"
+        "eth:0x1A9aE6486caEc0504657351ac473B3dF8A1367cb"
      receivedPermissions.2.via.0.address:
-        "ethereum:0xD069C4724f9bC15FA53b3b2516594512AEf8c957"
+        "eth:0xD069C4724f9bC15FA53b3b2516594512AEf8c957"
      receivedPermissions.2.from:
-        "ethereum:0x5C9C7f98eD153a2deAA981eB5C97B31744AccF22"
+        "eth:0x5C9C7f98eD153a2deAA981eB5C97B31744AccF22"
      receivedPermissions.3.via.0.address:
-        "ethereum:0xD069C4724f9bC15FA53b3b2516594512AEf8c957"
+        "eth:0xD069C4724f9bC15FA53b3b2516594512AEf8c957"
      receivedPermissions.3.from:
-        "ethereum:0x87e75DcC1BB4e5B42cB5c52eB5832d6eCC3bFeF4"
+        "eth:0x87e75DcC1BB4e5B42cB5c52eB5832d6eCC3bFeF4"
      receivedPermissions.4.via.0.address:
-        "ethereum:0xD069C4724f9bC15FA53b3b2516594512AEf8c957"
+        "eth:0xD069C4724f9bC15FA53b3b2516594512AEf8c957"
      receivedPermissions.4.from:
-        "ethereum:0x8F56a665c376A08b604DD32ee6E88667A6093172"
+        "eth:0x8F56a665c376A08b604DD32ee6E88667A6093172"
      receivedPermissions.5.via.0.address:
-        "ethereum:0xD069C4724f9bC15FA53b3b2516594512AEf8c957"
+        "eth:0xD069C4724f9bC15FA53b3b2516594512AEf8c957"
      receivedPermissions.5.from:
-        "ethereum:0x94519dD4BA8ba20Aaad14f7C6cD00fa1bB0192E9"
+        "eth:0x94519dD4BA8ba20Aaad14f7C6cD00fa1bB0192E9"
      receivedPermissions.6.via.0.address:
-        "ethereum:0xD069C4724f9bC15FA53b3b2516594512AEf8c957"
+        "eth:0xD069C4724f9bC15FA53b3b2516594512AEf8c957"
      receivedPermissions.6.from:
-        "ethereum:0xA2C1C1A473250094a6244F2bcf6Cb51F670Ad3aC"
+        "eth:0xA2C1C1A473250094a6244F2bcf6Cb51F670Ad3aC"
      receivedPermissions.7.via.0.address:
-        "ethereum:0xD069C4724f9bC15FA53b3b2516594512AEf8c957"
+        "eth:0xD069C4724f9bC15FA53b3b2516594512AEf8c957"
      receivedPermissions.7.from:
-        "ethereum:0xD39a6CcCFa23cb741bB530497e42EC337f1215a8"
+        "eth:0xD39a6CcCFa23cb741bB530497e42EC337f1215a8"
      receivedPermissions.8.via.0.address:
-        "ethereum:0xD069C4724f9bC15FA53b3b2516594512AEf8c957"
+        "eth:0xD069C4724f9bC15FA53b3b2516594512AEf8c957"
      receivedPermissions.8.from:
-        "ethereum:0xD3B2Ee457Cf8F05f00c17BFe509b43BA04c9e5a2"
+        "eth:0xD3B2Ee457Cf8F05f00c17BFe509b43BA04c9e5a2"
      receivedPermissions.9.via.0.address:
-        "ethereum:0xD069C4724f9bC15FA53b3b2516594512AEf8c957"
+        "eth:0xD069C4724f9bC15FA53b3b2516594512AEf8c957"
      receivedPermissions.9.from:
-        "ethereum:0xF40b807c2407e1d7dabb85f3ceefd5EACc7bF3CD"
+        "eth:0xF40b807c2407e1d7dabb85f3ceefd5EACc7bF3CD"
      directlyReceivedPermissions.0.from:
-        "ethereum:0xD069C4724f9bC15FA53b3b2516594512AEf8c957"
+        "eth:0xD069C4724f9bC15FA53b3b2516594512AEf8c957"
    }
```

```diff
    EOA  (0xA1ddae0829c3bD4096c34aEC58b2BC21e3a6d10E) {
    +++ description: None
      receivedPermissions.0.from:
-        "ethereum:0x1A9aE6486caEc0504657351ac473B3dF8A1367cb"
+        "eth:0x1A9aE6486caEc0504657351ac473B3dF8A1367cb"
      receivedPermissions.1.from:
-        "ethereum:0x1A9aE6486caEc0504657351ac473B3dF8A1367cb"
+        "eth:0x1A9aE6486caEc0504657351ac473B3dF8A1367cb"
    }
```

```diff
    EOA  (0xc0CE2761d5cC92d25dB6ccD95e4b9483eD22D11B) {
    +++ description: None
      receivedPermissions.0.from:
-        "ethereum:0xF40b807c2407e1d7dabb85f3ceefd5EACc7bF3CD"
+        "eth:0xF40b807c2407e1d7dabb85f3ceefd5EACc7bF3CD"
    }
```

```diff
    contract ProxyAdmin (0xD069C4724f9bC15FA53b3b2516594512AEf8c957) {
    +++ description: None
      directlyReceivedPermissions.0.from:
-        "ethereum:0x5a4ebF927338EA6af377caEee99C85088908f57D"
+        "eth:0x5a4ebF927338EA6af377caEee99C85088908f57D"
      directlyReceivedPermissions.1.from:
-        "ethereum:0x1A9aE6486caEc0504657351ac473B3dF8A1367cb"
+        "eth:0x1A9aE6486caEc0504657351ac473B3dF8A1367cb"
      directlyReceivedPermissions.2.from:
-        "ethereum:0x5C9C7f98eD153a2deAA981eB5C97B31744AccF22"
+        "eth:0x5C9C7f98eD153a2deAA981eB5C97B31744AccF22"
      directlyReceivedPermissions.3.from:
-        "ethereum:0x87e75DcC1BB4e5B42cB5c52eB5832d6eCC3bFeF4"
+        "eth:0x87e75DcC1BB4e5B42cB5c52eB5832d6eCC3bFeF4"
      directlyReceivedPermissions.4.from:
-        "ethereum:0x8F56a665c376A08b604DD32ee6E88667A6093172"
+        "eth:0x8F56a665c376A08b604DD32ee6E88667A6093172"
      directlyReceivedPermissions.5.from:
-        "ethereum:0x94519dD4BA8ba20Aaad14f7C6cD00fa1bB0192E9"
+        "eth:0x94519dD4BA8ba20Aaad14f7C6cD00fa1bB0192E9"
      directlyReceivedPermissions.6.from:
-        "ethereum:0xA2C1C1A473250094a6244F2bcf6Cb51F670Ad3aC"
+        "eth:0xA2C1C1A473250094a6244F2bcf6Cb51F670Ad3aC"
      directlyReceivedPermissions.7.from:
-        "ethereum:0xD39a6CcCFa23cb741bB530497e42EC337f1215a8"
+        "eth:0xD39a6CcCFa23cb741bB530497e42EC337f1215a8"
      directlyReceivedPermissions.8.from:
-        "ethereum:0xD3B2Ee457Cf8F05f00c17BFe509b43BA04c9e5a2"
+        "eth:0xD3B2Ee457Cf8F05f00c17BFe509b43BA04c9e5a2"
      directlyReceivedPermissions.9.from:
-        "ethereum:0xF40b807c2407e1d7dabb85f3ceefd5EACc7bF3CD"
+        "eth:0xF40b807c2407e1d7dabb85f3ceefd5EACc7bF3CD"
    }
```

Generated with discovered.json: 0xc9d4877353a8e7d0f37e0e643f0d7600d91a66d8

# Diff at Mon, 16 Jun 2025 08:42:00 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@e1208475abce20cea1768d2e4878c03350c1b7c9 block: 22208380
- current block number: 22208380

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22208380 (main branch discovery), not current.

```diff
    contract Funki Multisig 1 (0x89CB6669f87c165E7128F4a57476EE4Daa7ffbCD) {
    +++ description: None
      receivedPermissions.9:
+        {"permission":"upgrade","from":"ethereum:0xD39a6CcCFa23cb741bB530497e42EC337f1215a8","role":"admin","via":[{"address":"ethereum:0xD069C4724f9bC15FA53b3b2516594512AEf8c957"}]}
      receivedPermissions.8.from:
-        "ethereum:0xD39a6CcCFa23cb741bB530497e42EC337f1215a8"
+        "ethereum:0xD3B2Ee457Cf8F05f00c17BFe509b43BA04c9e5a2"
      receivedPermissions.7.from:
-        "ethereum:0xD3B2Ee457Cf8F05f00c17BFe509b43BA04c9e5a2"
+        "ethereum:0x87e75DcC1BB4e5B42cB5c52eB5832d6eCC3bFeF4"
      receivedPermissions.6.from:
-        "ethereum:0x87e75DcC1BB4e5B42cB5c52eB5832d6eCC3bFeF4"
+        "ethereum:0xF40b807c2407e1d7dabb85f3ceefd5EACc7bF3CD"
      receivedPermissions.5.from:
-        "ethereum:0xF40b807c2407e1d7dabb85f3ceefd5EACc7bF3CD"
+        "ethereum:0x5C9C7f98eD153a2deAA981eB5C97B31744AccF22"
      receivedPermissions.4.from:
-        "ethereum:0x5C9C7f98eD153a2deAA981eB5C97B31744AccF22"
+        "ethereum:0x1A9aE6486caEc0504657351ac473B3dF8A1367cb"
      receivedPermissions.3.from:
-        "ethereum:0x1A9aE6486caEc0504657351ac473B3dF8A1367cb"
+        "ethereum:0x94519dD4BA8ba20Aaad14f7C6cD00fa1bB0192E9"
      receivedPermissions.2.from:
-        "ethereum:0x94519dD4BA8ba20Aaad14f7C6cD00fa1bB0192E9"
+        "ethereum:0x8F56a665c376A08b604DD32ee6E88667A6093172"
    }
```

```diff
    contract L1CrossDomainMessenger (0x8F56a665c376A08b604DD32ee6E88667A6093172) {
    +++ description: Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function.
      values.$admin:
+        "0xD069C4724f9bC15FA53b3b2516594512AEf8c957"
    }
```

```diff
    contract ProxyAdmin (0xD069C4724f9bC15FA53b3b2516594512AEf8c957) {
    +++ description: None
      directlyReceivedPermissions.9:
+        {"permission":"upgrade","from":"ethereum:0xD39a6CcCFa23cb741bB530497e42EC337f1215a8","role":"admin"}
      directlyReceivedPermissions.8.from:
-        "ethereum:0xD39a6CcCFa23cb741bB530497e42EC337f1215a8"
+        "ethereum:0xD3B2Ee457Cf8F05f00c17BFe509b43BA04c9e5a2"
      directlyReceivedPermissions.7.from:
-        "ethereum:0xD3B2Ee457Cf8F05f00c17BFe509b43BA04c9e5a2"
+        "ethereum:0x87e75DcC1BB4e5B42cB5c52eB5832d6eCC3bFeF4"
      directlyReceivedPermissions.6.from:
-        "ethereum:0x87e75DcC1BB4e5B42cB5c52eB5832d6eCC3bFeF4"
+        "ethereum:0xF40b807c2407e1d7dabb85f3ceefd5EACc7bF3CD"
      directlyReceivedPermissions.5.from:
-        "ethereum:0xF40b807c2407e1d7dabb85f3ceefd5EACc7bF3CD"
+        "ethereum:0x5C9C7f98eD153a2deAA981eB5C97B31744AccF22"
      directlyReceivedPermissions.4.from:
-        "ethereum:0x5C9C7f98eD153a2deAA981eB5C97B31744AccF22"
+        "ethereum:0x1A9aE6486caEc0504657351ac473B3dF8A1367cb"
      directlyReceivedPermissions.3.from:
-        "ethereum:0x1A9aE6486caEc0504657351ac473B3dF8A1367cb"
+        "ethereum:0x94519dD4BA8ba20Aaad14f7C6cD00fa1bB0192E9"
      directlyReceivedPermissions.2.from:
-        "ethereum:0x94519dD4BA8ba20Aaad14f7C6cD00fa1bB0192E9"
+        "ethereum:0x8F56a665c376A08b604DD32ee6E88667A6093172"
    }
```

Generated with discovered.json: 0x0d8285302c38faa614b30312287b3472698dfe58

# Diff at Fri, 30 May 2025 06:58:50 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@a4d8c436027d17df0f9b76843cd6deb1888fa381 block: 22208380
- current block number: 22208380

## Description

config: change comment about eip1559 fee val

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22208380 (main branch discovery), not current.

```diff
    contract SystemConfig (0xD39a6CcCFa23cb741bB530497e42EC337f1215a8) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      fieldMeta.eip1559Denominator:
+        {"description":"volatility param: lower denominator -> quicker fee changes on L2"}
    }
```

Generated with discovered.json: 0x49417c1f4e32fcf61d9943485970e9b969cb08aa

# Diff at Fri, 23 May 2025 09:40:56 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@69cd181abbc3c830a6caf2f4429b37cae72ffdb8 block: 22208380
- current block number: 22208380

## Description

Introduced .role field on each permission, defaulting to field name on which it was defined (with '.' prefix)

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22208380 (main branch discovery), not current.

```diff
    EOA  (0x052a8cd5967bc3Bdb5660c989a3A68bCA683A077) {
    +++ description: None
      receivedPermissions.1.role:
+        ".guardian"
      receivedPermissions.0.role:
+        ".guardian"
    }
```

```diff
    EOA  (0x0B3476949e1C82160575295f58720E16EeD2BF7b) {
    +++ description: None
      receivedPermissions.1:
+        {"permission":"challenge","from":"0x1A9aE6486caEc0504657351ac473B3dF8A1367cb","role":".CHALLENGER"}
      receivedPermissions.0.role:
+        ".challenger"
    }
```

```diff
    contract Funki Multisig 2 (0x3D389212A78FD7D4600C9483470e59630C293416) {
    +++ description: None
      receivedPermissions.0.role:
+        ".owner"
    }
```

```diff
    EOA  (0x4712454AddDbAbACaAb84916546899CA9690A6fF) {
    +++ description: None
      receivedPermissions.0.role:
+        ".batcherHash"
    }
```

```diff
    contract Funki Multisig 1 (0x89CB6669f87c165E7128F4a57476EE4Daa7ffbCD) {
    +++ description: None
      receivedPermissions.8.role:
+        "admin"
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
+        ".$admin"
      receivedPermissions.0.role:
+        ".owner"
      directlyReceivedPermissions.0.role:
+        ".owner"
    }
```

```diff
    EOA  (0xA1ddae0829c3bD4096c34aEC58b2BC21e3a6d10E) {
    +++ description: None
      receivedPermissions.1:
+        {"permission":"propose","from":"0x1A9aE6486caEc0504657351ac473B3dF8A1367cb","role":".proposer"}
      receivedPermissions.0.role:
+        ".PROPOSER"
    }
```

```diff
    EOA  (0xc0CE2761d5cC92d25dB6ccD95e4b9483eD22D11B) {
    +++ description: None
      receivedPermissions.0.role:
+        ".owner"
    }
```

```diff
    contract ProxyAdmin (0xD069C4724f9bC15FA53b3b2516594512AEf8c957) {
    +++ description: None
      directlyReceivedPermissions.8.role:
+        "admin"
      directlyReceivedPermissions.7.role:
+        "admin"
      directlyReceivedPermissions.6.role:
+        "admin"
      directlyReceivedPermissions.5.role:
+        "admin"
      directlyReceivedPermissions.4.role:
+        "admin"
      directlyReceivedPermissions.3.role:
+        "admin"
      directlyReceivedPermissions.2.role:
+        "admin"
      directlyReceivedPermissions.1.role:
+        ".$admin"
      directlyReceivedPermissions.0.role:
+        ".owner"
    }
```

Generated with discovered.json: 0xd529ad03cd26e11a684896ba9f915ebe4f0ce3ac

# Diff at Tue, 29 Apr 2025 08:19:03 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@ef7477af00fe0b57a2f7cacf7e958c12494af662 block: 22208380
- current block number: 22208380

## Description

Field .issuedPermissions is removed from the output as no longer needed. Added 'permissionsConfigHash' due to refactoring of the modelling process (into a separate command).

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22208380 (main branch discovery), not current.

```diff
    contract L2OutputOracle (0x1A9aE6486caEc0504657351ac473B3dF8A1367cb) {
    +++ description: Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots.
      issuedPermissions:
-        [{"permission":"challenge","to":"0x0B3476949e1C82160575295f58720E16EeD2BF7b","via":[]},{"permission":"propose","to":"0xA1ddae0829c3bD4096c34aEC58b2BC21e3a6d10E","via":[]},{"permission":"upgrade","to":"0x89CB6669f87c165E7128F4a57476EE4Daa7ffbCD","via":[{"address":"0xD069C4724f9bC15FA53b3b2516594512AEf8c957"}]}]
    }
```

```diff
    contract AddressManager (0x5a4ebF927338EA6af377caEee99C85088908f57D) {
    +++ description: Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts.
      issuedPermissions:
-        [{"permission":"interact","to":"0x89CB6669f87c165E7128F4a57476EE4Daa7ffbCD","description":"set and change address mappings.","via":[{"address":"0xD069C4724f9bC15FA53b3b2516594512AEf8c957"}]}]
    }
```

```diff
    contract OptimismPortal (0x5C9C7f98eD153a2deAA981eB5C97B31744AccF22) {
    +++ description: The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals.
      issuedPermissions:
-        [{"permission":"guard","to":"0x052a8cd5967bc3Bdb5660c989a3A68bCA683A077","via":[]},{"permission":"upgrade","to":"0x89CB6669f87c165E7128F4a57476EE4Daa7ffbCD","via":[{"address":"0xD069C4724f9bC15FA53b3b2516594512AEf8c957"}]}]
    }
```

```diff
    contract OptimismMintableERC20Factory (0x87e75DcC1BB4e5B42cB5c52eB5832d6eCC3bFeF4) {
    +++ description: A helper contract that generates OptimismMintableERC20 contracts on the network it's deployed to. OptimismMintableERC20 is a standard extension of the base ERC20 token contract designed to allow the L1StandardBridge contracts to mint and burn tokens. This makes it possible to use an OptimismMintablERC20 as this chain's representation of a token on the host chain, or vice-versa.
      issuedPermissions:
-        [{"permission":"upgrade","to":"0x89CB6669f87c165E7128F4a57476EE4Daa7ffbCD","via":[{"address":"0xD069C4724f9bC15FA53b3b2516594512AEf8c957"}]}]
    }
```

```diff
    contract L1ERC721Bridge (0x94519dD4BA8ba20Aaad14f7C6cD00fa1bB0192E9) {
    +++ description: Used to bridge ERC-721 tokens from host chain to this chain.
      issuedPermissions:
-        [{"permission":"upgrade","to":"0x89CB6669f87c165E7128F4a57476EE4Daa7ffbCD","via":[{"address":"0xD069C4724f9bC15FA53b3b2516594512AEf8c957"}]}]
    }
```

```diff
    contract L1StandardBridge (0xA2C1C1A473250094a6244F2bcf6Cb51F670Ad3aC) {
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain.
      issuedPermissions:
-        [{"permission":"upgrade","to":"0x89CB6669f87c165E7128F4a57476EE4Daa7ffbCD","description":"upgrading the bridge implementation can give access to all funds escrowed therein.","via":[{"address":"0xD069C4724f9bC15FA53b3b2516594512AEf8c957"}]}]
    }
```

```diff
    contract SystemConfig (0xD39a6CcCFa23cb741bB530497e42EC337f1215a8) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      issuedPermissions:
-        [{"permission":"interact","to":"0x3D389212A78FD7D4600C9483470e59630C293416","description":"it can update the preconfer address, the batch submitter (Sequencer) address and the gas configuration of the system.","via":[]},{"permission":"sequence","to":"0x4712454AddDbAbACaAb84916546899CA9690A6fF","via":[]},{"permission":"upgrade","to":"0x89CB6669f87c165E7128F4a57476EE4Daa7ffbCD","via":[{"address":"0xD069C4724f9bC15FA53b3b2516594512AEf8c957"}]}]
    }
```

```diff
    contract SuperchainConfig (0xD3B2Ee457Cf8F05f00c17BFe509b43BA04c9e5a2) {
    +++ description: This is NOT the shared SuperchainConfig contract of the OP stack Superchain but rather a local fork. It manages the `PAUSED_SLOT`, a boolean value indicating whether the local chain is paused, and `GUARDIAN_SLOT`, the address of the guardian which can pause and unpause the system.
      issuedPermissions:
-        [{"permission":"guard","to":"0x052a8cd5967bc3Bdb5660c989a3A68bCA683A077","via":[]},{"permission":"upgrade","to":"0x89CB6669f87c165E7128F4a57476EE4Daa7ffbCD","via":[{"address":"0xD069C4724f9bC15FA53b3b2516594512AEf8c957"}]}]
    }
```

```diff
    contract DataAvailabilityChallenge (0xF40b807c2407e1d7dabb85f3ceefd5EACc7bF3CD) {
    +++ description: The DataAvailabilityChallenge contract is used to challenge the full availability of data behind commimted transaction data hashes. See the technology section for more details.
      issuedPermissions:
-        [{"permission":"interact","to":"0xc0CE2761d5cC92d25dB6ccD95e4b9483eD22D11B","description":"can upgrade the parameters of DA challenges like the bond size or refund percentages, potentially making challenges infeasable or insecure.","via":[]},{"permission":"upgrade","to":"0x89CB6669f87c165E7128F4a57476EE4Daa7ffbCD","via":[{"address":"0xD069C4724f9bC15FA53b3b2516594512AEf8c957"}]}]
    }
```

Generated with discovered.json: 0xcc8389bac96d0ee1c7c30328a9616e3690c2b8b4

# Diff at Sun, 06 Apr 2025 08:20:46 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@02dea11f7707601873600e275c4e2b7792c1a190 block: 22194762
- current block number: 22208380

## Description

Operators change, no change to implementations.

## Watched changes

```diff
    contract L2OutputOracle (0x1A9aE6486caEc0504657351ac473B3dF8A1367cb) {
    +++ description: Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots.
      issuedPermissions.2.permission:
-        "propose"
+        "upgrade"
      issuedPermissions.2.to:
-        "0x7a7690bBAb496537Ac59B45B4c59d789233BcA16"
+        "0x89CB6669f87c165E7128F4a57476EE4Daa7ffbCD"
      issuedPermissions.2.via.0:
+        {"address":"0xD069C4724f9bC15FA53b3b2516594512AEf8c957"}
      issuedPermissions.1.to:
-        "0x9f8b2470ffECbca2FFda20B9e10f6a12F33BC2Ce"
+        "0x0B3476949e1C82160575295f58720E16EeD2BF7b"
      issuedPermissions.0.permission:
-        "upgrade"
+        "propose"
      issuedPermissions.0.to:
-        "0xf0AE006C6f810831DA1d2A061288575fB5082144"
+        "0xA1ddae0829c3bD4096c34aEC58b2BC21e3a6d10E"
      issuedPermissions.0.via.1:
-        {"address":"0xD069C4724f9bC15FA53b3b2516594512AEf8c957"}
      issuedPermissions.0.via.0:
-        {"address":"0x89CB6669f87c165E7128F4a57476EE4Daa7ffbCD"}
      values.$pastUpgrades.2:
+        ["2025-04-05T13:02:59.000Z","0x36b019357e2b55f4676855c5ae23f1e9d02c42fd9e01bbe2873f51be02ec3b8f",["0xA3facd35d9a0BD9Df1603E00F10D7b0f9Ee5f587"]]
      values.$pastUpgrades.1:
+        ["2024-07-17T10:46:23.000Z","0x3dc0389b8d624e6c853fcbcba1321b88a48cefdcf2000af75c986263414c312d",["0xA3facd35d9a0BD9Df1603E00F10D7b0f9Ee5f587"]]
      values.$pastUpgrades.0.2:
-        "2024-07-17T10:46:23.000Z"
+        ["0xA9D78F579f1B30194F3c2Ca1987A9B91A33BDF08"]
      values.$pastUpgrades.0.1:
-        "0x3dc0389b8d624e6c853fcbcba1321b88a48cefdcf2000af75c986263414c312d"
+        "0xe6eedfdce548f3eaa2abd10d1d2195d00cc231b28017490753ea5739bc26bdca"
      values.$pastUpgrades.0.0:
-        ["0xA3facd35d9a0BD9Df1603E00F10D7b0f9Ee5f587"]
+        "2025-04-05T12:57:35.000Z"
      values.$upgradeCount:
-        1
+        3
+++ severity: HIGH
      values.challenger:
-        "0x9f8b2470ffECbca2FFda20B9e10f6a12F33BC2Ce"
+        "0x0B3476949e1C82160575295f58720E16EeD2BF7b"
      values.CHALLENGER:
-        "0x9f8b2470ffECbca2FFda20B9e10f6a12F33BC2Ce"
+        "0x0B3476949e1C82160575295f58720E16EeD2BF7b"
+++ severity: HIGH
      values.proposer:
-        "0x7a7690bBAb496537Ac59B45B4c59d789233BcA16"
+        "0xA1ddae0829c3bD4096c34aEC58b2BC21e3a6d10E"
      values.PROPOSER:
-        "0x7a7690bBAb496537Ac59B45B4c59d789233BcA16"
+        "0xA1ddae0829c3bD4096c34aEC58b2BC21e3a6d10E"
    }
```

```diff
    contract AddressManager (0x5a4ebF927338EA6af377caEee99C85088908f57D) {
    +++ description: Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts.
      issuedPermissions.0.to:
-        "0xf0AE006C6f810831DA1d2A061288575fB5082144"
+        "0x89CB6669f87c165E7128F4a57476EE4Daa7ffbCD"
      issuedPermissions.0.via.1:
-        {"address":"0xD069C4724f9bC15FA53b3b2516594512AEf8c957"}
      issuedPermissions.0.via.0.address:
-        "0x89CB6669f87c165E7128F4a57476EE4Daa7ffbCD"
+        "0xD069C4724f9bC15FA53b3b2516594512AEf8c957"
    }
```

```diff
    contract OptimismPortal (0x5C9C7f98eD153a2deAA981eB5C97B31744AccF22) {
    +++ description: The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals.
      issuedPermissions.1.permission:
-        "guard"
+        "upgrade"
      issuedPermissions.1.to:
-        "0x052a8cd5967bc3Bdb5660c989a3A68bCA683A077"
+        "0x89CB6669f87c165E7128F4a57476EE4Daa7ffbCD"
      issuedPermissions.1.via.0:
+        {"address":"0xD069C4724f9bC15FA53b3b2516594512AEf8c957"}
      issuedPermissions.0.permission:
-        "upgrade"
+        "guard"
      issuedPermissions.0.to:
-        "0xf0AE006C6f810831DA1d2A061288575fB5082144"
+        "0x052a8cd5967bc3Bdb5660c989a3A68bCA683A077"
      issuedPermissions.0.via.1:
-        {"address":"0xD069C4724f9bC15FA53b3b2516594512AEf8c957"}
      issuedPermissions.0.via.0:
-        {"address":"0x89CB6669f87c165E7128F4a57476EE4Daa7ffbCD"}
    }
```

```diff
    contract OptimismMintableERC20Factory (0x87e75DcC1BB4e5B42cB5c52eB5832d6eCC3bFeF4) {
    +++ description: A helper contract that generates OptimismMintableERC20 contracts on the network it's deployed to. OptimismMintableERC20 is a standard extension of the base ERC20 token contract designed to allow the L1StandardBridge contracts to mint and burn tokens. This makes it possible to use an OptimismMintablERC20 as this chain's representation of a token on the host chain, or vice-versa.
      issuedPermissions.0.to:
-        "0xf0AE006C6f810831DA1d2A061288575fB5082144"
+        "0x89CB6669f87c165E7128F4a57476EE4Daa7ffbCD"
      issuedPermissions.0.via.1:
-        {"address":"0xD069C4724f9bC15FA53b3b2516594512AEf8c957"}
      issuedPermissions.0.via.0.address:
-        "0x89CB6669f87c165E7128F4a57476EE4Daa7ffbCD"
+        "0xD069C4724f9bC15FA53b3b2516594512AEf8c957"
    }
```

```diff
    contract Funki Multisig 1 (0x89CB6669f87c165E7128F4a57476EE4Daa7ffbCD) {
    +++ description: None
      values.$members.3:
+        "0xB5b01E638CEF6AE50462A487d70005D6fe85eCf2"
      values.$members.2:
+        "0xa8AC7D03BEb92Fa3E6030AEB21629D00Ffb66dD7"
      values.$members.1:
+        "0xf0AE006C6f810831DA1d2A061288575fB5082144"
      values.$members.0:
-        "0xf0AE006C6f810831DA1d2A061288575fB5082144"
+        "0xaC79765A73eB9dcBd3c427181E6819902AE25b48"
      values.$threshold:
-        1
+        3
      values.multisigThreshold:
-        "1 of 1 (100%)"
+        "3 of 4 (75%)"
      receivedPermissions:
+        [{"permission":"interact","from":"0x5a4ebF927338EA6af377caEee99C85088908f57D","description":"set and change address mappings.","via":[{"address":"0xD069C4724f9bC15FA53b3b2516594512AEf8c957"}]},{"permission":"upgrade","from":"0x1A9aE6486caEc0504657351ac473B3dF8A1367cb","via":[{"address":"0xD069C4724f9bC15FA53b3b2516594512AEf8c957"}]},{"permission":"upgrade","from":"0x5C9C7f98eD153a2deAA981eB5C97B31744AccF22","via":[{"address":"0xD069C4724f9bC15FA53b3b2516594512AEf8c957"}]},{"permission":"upgrade","from":"0x87e75DcC1BB4e5B42cB5c52eB5832d6eCC3bFeF4","via":[{"address":"0xD069C4724f9bC15FA53b3b2516594512AEf8c957"}]},{"permission":"upgrade","from":"0x94519dD4BA8ba20Aaad14f7C6cD00fa1bB0192E9","via":[{"address":"0xD069C4724f9bC15FA53b3b2516594512AEf8c957"}]},{"permission":"upgrade","from":"0xA2C1C1A473250094a6244F2bcf6Cb51F670Ad3aC","description":"upgrading the bridge implementation can give access to all funds escrowed therein.","via":[{"address":"0xD069C4724f9bC15FA53b3b2516594512AEf8c957"}]},{"permission":"upgrade","from":"0xD39a6CcCFa23cb741bB530497e42EC337f1215a8","via":[{"address":"0xD069C4724f9bC15FA53b3b2516594512AEf8c957"}]},{"permission":"upgrade","from":"0xD3B2Ee457Cf8F05f00c17BFe509b43BA04c9e5a2","via":[{"address":"0xD069C4724f9bC15FA53b3b2516594512AEf8c957"}]},{"permission":"upgrade","from":"0xF40b807c2407e1d7dabb85f3ceefd5EACc7bF3CD","via":[{"address":"0xD069C4724f9bC15FA53b3b2516594512AEf8c957"}]}]
    }
```

```diff
    contract L1ERC721Bridge (0x94519dD4BA8ba20Aaad14f7C6cD00fa1bB0192E9) {
    +++ description: Used to bridge ERC-721 tokens from host chain to this chain.
      issuedPermissions.0.to:
-        "0xf0AE006C6f810831DA1d2A061288575fB5082144"
+        "0x89CB6669f87c165E7128F4a57476EE4Daa7ffbCD"
      issuedPermissions.0.via.1:
-        {"address":"0xD069C4724f9bC15FA53b3b2516594512AEf8c957"}
      issuedPermissions.0.via.0.address:
-        "0x89CB6669f87c165E7128F4a57476EE4Daa7ffbCD"
+        "0xD069C4724f9bC15FA53b3b2516594512AEf8c957"
    }
```

```diff
    contract L1StandardBridge (0xA2C1C1A473250094a6244F2bcf6Cb51F670Ad3aC) {
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain.
      issuedPermissions.0.to:
-        "0xf0AE006C6f810831DA1d2A061288575fB5082144"
+        "0x89CB6669f87c165E7128F4a57476EE4Daa7ffbCD"
      issuedPermissions.0.via.1:
-        {"address":"0xD069C4724f9bC15FA53b3b2516594512AEf8c957"}
      issuedPermissions.0.via.0.address:
-        "0x89CB6669f87c165E7128F4a57476EE4Daa7ffbCD"
+        "0xD069C4724f9bC15FA53b3b2516594512AEf8c957"
    }
```

```diff
    contract SystemConfig (0xD39a6CcCFa23cb741bB530497e42EC337f1215a8) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      issuedPermissions.2.permission:
-        "interact"
+        "upgrade"
      issuedPermissions.2.to:
-        "0x3D389212A78FD7D4600C9483470e59630C293416"
+        "0x89CB6669f87c165E7128F4a57476EE4Daa7ffbCD"
      issuedPermissions.2.description:
-        "it can update the preconfer address, the batch submitter (Sequencer) address and the gas configuration of the system."
      issuedPermissions.2.via.0:
+        {"address":"0xD069C4724f9bC15FA53b3b2516594512AEf8c957"}
      issuedPermissions.1.permission:
-        "upgrade"
+        "interact"
      issuedPermissions.1.to:
-        "0xf0AE006C6f810831DA1d2A061288575fB5082144"
+        "0x3D389212A78FD7D4600C9483470e59630C293416"
      issuedPermissions.1.via.1:
-        {"address":"0xD069C4724f9bC15FA53b3b2516594512AEf8c957"}
      issuedPermissions.1.via.0:
-        {"address":"0x89CB6669f87c165E7128F4a57476EE4Daa7ffbCD"}
      issuedPermissions.1.description:
+        "it can update the preconfer address, the batch submitter (Sequencer) address and the gas configuration of the system."
      issuedPermissions.0.to:
-        "0x73c98Cf34AF1f7D798e8e6f34b16037530Bffc41"
+        "0x4712454AddDbAbACaAb84916546899CA9690A6fF"
      values.batcherHash:
-        "0x73c98Cf34AF1f7D798e8e6f34b16037530Bffc41"
+        "0x4712454AddDbAbACaAb84916546899CA9690A6fF"
      values.unsafeBlockSigner:
-        "0x843458b6De651E02dFD5bFFea0e9cfb3eca293EF"
+        "0xa54e493641d097d164A6a2D8F9895303344d88A9"
    }
```

```diff
    contract SuperchainConfig (0xD3B2Ee457Cf8F05f00c17BFe509b43BA04c9e5a2) {
    +++ description: This is NOT the shared SuperchainConfig contract of the OP stack Superchain but rather a local fork. It manages the `PAUSED_SLOT`, a boolean value indicating whether the local chain is paused, and `GUARDIAN_SLOT`, the address of the guardian which can pause and unpause the system.
      issuedPermissions.1.permission:
-        "guard"
+        "upgrade"
      issuedPermissions.1.to:
-        "0x052a8cd5967bc3Bdb5660c989a3A68bCA683A077"
+        "0x89CB6669f87c165E7128F4a57476EE4Daa7ffbCD"
      issuedPermissions.1.via.0:
+        {"address":"0xD069C4724f9bC15FA53b3b2516594512AEf8c957"}
      issuedPermissions.0.permission:
-        "upgrade"
+        "guard"
      issuedPermissions.0.to:
-        "0xf0AE006C6f810831DA1d2A061288575fB5082144"
+        "0x052a8cd5967bc3Bdb5660c989a3A68bCA683A077"
      issuedPermissions.0.via.1:
-        {"address":"0xD069C4724f9bC15FA53b3b2516594512AEf8c957"}
      issuedPermissions.0.via.0:
-        {"address":"0x89CB6669f87c165E7128F4a57476EE4Daa7ffbCD"}
    }
```

```diff
    contract Funki (0xf0AE006C6f810831DA1d2A061288575fB5082144) {
    +++ description: None
      receivedPermissions:
-        [{"permission":"interact","from":"0x5a4ebF927338EA6af377caEee99C85088908f57D","description":"set and change address mappings.","via":[{"address":"0xD069C4724f9bC15FA53b3b2516594512AEf8c957"},{"address":"0x89CB6669f87c165E7128F4a57476EE4Daa7ffbCD"}]},{"permission":"upgrade","from":"0x1A9aE6486caEc0504657351ac473B3dF8A1367cb","via":[{"address":"0xD069C4724f9bC15FA53b3b2516594512AEf8c957"},{"address":"0x89CB6669f87c165E7128F4a57476EE4Daa7ffbCD"}]},{"permission":"upgrade","from":"0x5C9C7f98eD153a2deAA981eB5C97B31744AccF22","via":[{"address":"0xD069C4724f9bC15FA53b3b2516594512AEf8c957"},{"address":"0x89CB6669f87c165E7128F4a57476EE4Daa7ffbCD"}]},{"permission":"upgrade","from":"0x87e75DcC1BB4e5B42cB5c52eB5832d6eCC3bFeF4","via":[{"address":"0xD069C4724f9bC15FA53b3b2516594512AEf8c957"},{"address":"0x89CB6669f87c165E7128F4a57476EE4Daa7ffbCD"}]},{"permission":"upgrade","from":"0x94519dD4BA8ba20Aaad14f7C6cD00fa1bB0192E9","via":[{"address":"0xD069C4724f9bC15FA53b3b2516594512AEf8c957"},{"address":"0x89CB6669f87c165E7128F4a57476EE4Daa7ffbCD"}]},{"permission":"upgrade","from":"0xA2C1C1A473250094a6244F2bcf6Cb51F670Ad3aC","description":"upgrading the bridge implementation can give access to all funds escrowed therein.","via":[{"address":"0xD069C4724f9bC15FA53b3b2516594512AEf8c957"},{"address":"0x89CB6669f87c165E7128F4a57476EE4Daa7ffbCD"}]},{"permission":"upgrade","from":"0xD39a6CcCFa23cb741bB530497e42EC337f1215a8","via":[{"address":"0xD069C4724f9bC15FA53b3b2516594512AEf8c957"},{"address":"0x89CB6669f87c165E7128F4a57476EE4Daa7ffbCD"}]},{"permission":"upgrade","from":"0xD3B2Ee457Cf8F05f00c17BFe509b43BA04c9e5a2","via":[{"address":"0xD069C4724f9bC15FA53b3b2516594512AEf8c957"},{"address":"0x89CB6669f87c165E7128F4a57476EE4Daa7ffbCD"}]},{"permission":"upgrade","from":"0xF40b807c2407e1d7dabb85f3ceefd5EACc7bF3CD","via":[{"address":"0xD069C4724f9bC15FA53b3b2516594512AEf8c957"},{"address":"0x89CB6669f87c165E7128F4a57476EE4Daa7ffbCD"}]}]
    }
```

```diff
    contract DataAvailabilityChallenge (0xF40b807c2407e1d7dabb85f3ceefd5EACc7bF3CD) {
    +++ description: The DataAvailabilityChallenge contract is used to challenge the full availability of data behind commimted transaction data hashes. See the technology section for more details.
      issuedPermissions.1.to:
-        "0xf0AE006C6f810831DA1d2A061288575fB5082144"
+        "0x89CB6669f87c165E7128F4a57476EE4Daa7ffbCD"
      issuedPermissions.1.via.1:
-        {"address":"0xD069C4724f9bC15FA53b3b2516594512AEf8c957"}
      issuedPermissions.1.via.0.address:
-        "0x89CB6669f87c165E7128F4a57476EE4Daa7ffbCD"
+        "0xD069C4724f9bC15FA53b3b2516594512AEf8c957"
    }
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22194762 (main branch discovery), not current.

```diff
    contract AltLayer 3 (0xa8AC7D03BEb92Fa3E6030AEB21629D00Ffb66dD7) {
    +++ description: None
      name:
+        "AltLayer 3"
    }
```

```diff
    contract AltLayer 1 (0xaC79765A73eB9dcBd3c427181E6819902AE25b48) {
    +++ description: None
      name:
+        "AltLayer 1"
    }
```

```diff
    contract AltLayer 2 (0xB5b01E638CEF6AE50462A487d70005D6fe85eCf2) {
    +++ description: None
      name:
+        "AltLayer 2"
    }
```

```diff
    contract Funki (0xf0AE006C6f810831DA1d2A061288575fB5082144) {
    +++ description: None
      name:
+        "Funki"
    }
```

Generated with discovered.json: 0x605763006a0f1065b16ec3e6bbbf961f5c924bba

# Diff at Fri, 04 Apr 2025 10:09:01 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- current block number: 22194762

## Description

Standard Orbit chain.

## Initial discovery

```diff
+   Status: CREATED
    contract L2OutputOracle (0x1A9aE6486caEc0504657351ac473B3dF8A1367cb)
    +++ description: Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots.
```

```diff
+   Status: CREATED
    contract Funki Multisig 2 (0x3D389212A78FD7D4600C9483470e59630C293416)
    +++ description: None
```

```diff
+   Status: CREATED
    contract AddressManager (0x5a4ebF927338EA6af377caEee99C85088908f57D)
    +++ description: Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts.
```

```diff
+   Status: CREATED
    contract OptimismPortal (0x5C9C7f98eD153a2deAA981eB5C97B31744AccF22)
    +++ description: The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals.
```

```diff
+   Status: CREATED
    contract OptimismMintableERC20Factory (0x87e75DcC1BB4e5B42cB5c52eB5832d6eCC3bFeF4)
    +++ description: A helper contract that generates OptimismMintableERC20 contracts on the network it's deployed to. OptimismMintableERC20 is a standard extension of the base ERC20 token contract designed to allow the L1StandardBridge contracts to mint and burn tokens. This makes it possible to use an OptimismMintablERC20 as this chain's representation of a token on the host chain, or vice-versa.
```

```diff
+   Status: CREATED
    contract Funki Multisig 1 (0x89CB6669f87c165E7128F4a57476EE4Daa7ffbCD)
    +++ description: None
```

```diff
+   Status: CREATED
    contract L1CrossDomainMessenger (0x8F56a665c376A08b604DD32ee6E88667A6093172)
    +++ description: Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function.
```

```diff
+   Status: CREATED
    contract L1ERC721Bridge (0x94519dD4BA8ba20Aaad14f7C6cD00fa1bB0192E9)
    +++ description: Used to bridge ERC-721 tokens from host chain to this chain.
```

```diff
+   Status: CREATED
    contract L1StandardBridge (0xA2C1C1A473250094a6244F2bcf6Cb51F670Ad3aC)
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain.
```

```diff
+   Status: CREATED
    contract ProxyAdmin (0xD069C4724f9bC15FA53b3b2516594512AEf8c957)
    +++ description: None
```

```diff
+   Status: CREATED
    contract SystemConfig (0xD39a6CcCFa23cb741bB530497e42EC337f1215a8)
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
```

```diff
+   Status: CREATED
    contract SuperchainConfig (0xD3B2Ee457Cf8F05f00c17BFe509b43BA04c9e5a2)
    +++ description: This is NOT the shared SuperchainConfig contract of the OP stack Superchain but rather a local fork. It manages the `PAUSED_SLOT`, a boolean value indicating whether the local chain is paused, and `GUARDIAN_SLOT`, the address of the guardian which can pause and unpause the system.
```

```diff
+   Status: CREATED
    contract DataAvailabilityChallenge (0xF40b807c2407e1d7dabb85f3ceefd5EACc7bF3CD)
    +++ description: The DataAvailabilityChallenge contract is used to challenge the full availability of data behind commimted transaction data hashes. See the technology section for more details.
```
