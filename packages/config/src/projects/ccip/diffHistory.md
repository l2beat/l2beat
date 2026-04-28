Generated with discovered.json: 0x848d15c3a02a7d31754eb3c8d95f747a94237469

# Diff at Tue, 28 Apr 2026 14:58:00 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@b3166357735df5971a8c9b33b441d35484243908 block: 1777287134
- current timestamp: 1777388210

## Description

refine ccip disco config.

ccip validation stack:
  OCR (offchain reporting) Commit DON -> CommitStore stores Merkle root
  RMN -> blesses or curses root/route
  OCR Execution DON -> OffRamp submits messages + proofs
  OffRamp -> CommitStore.verify(...)
  Router -> only accepts configured OffRamp

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 1777287134 (main branch discovery), not current.

```diff
    EOA  (eth:0x0100000000000000000000000000000000000000) {
    +++ description: None
      receivedPermissions.0.description:
-        "sign RMN reports that can approve or block CCIP activity for the local chain."
+        "sign RMNRemote reports; this is separate from CommitStoreV1's legacy isBlessed() passthrough."
    }
```

```diff
    contract GHOEthereumTokenPool (eth:0x06179f7C1be40863405f374E7f5F8806c728660A) {
    +++ description: GHO lock-and-release token pool on Ethereum. It trusts configured Arbitrum remote pools and only accepts inbound token releases routed through CCIP OffRamps.
      description:
+        "GHO lock-and-release token pool on Ethereum. It trusts configured Arbitrum remote pools and only accepts inbound token releases routed through CCIP OffRamps."
    }
```

```diff
    EOA  (eth:0x08eAEE68e44caae09aa94367181470d92946310e) {
    +++ description: None
      receivedPermissions.0.description:
-        "sign and transmit commit reports that publish Merkle roots for messages accepted by this CommitStore."
+        "sign commit reports with at least f+1 sigs and transmit them through one of the transmitter addresses."
      receivedPermissions.1.description:
-        "sign and transmit execution reports that deliver messages and release or mint tokens through this OffRamp."
+        "transmit execution reports from one of the 16 configured transmitter addresses. This OffRamp does not verify OCR signer signatures onchain; execution still requires a blessed CommitStore proof."
    }
```

```diff
    contract ARMProxyOwnerBypasser (eth:0x117ec8aD107976e1dBCc21717ff78407Bc36aADc) {
    +++ description: None
      name:
-        "ManyChainMultiSig"
+        "ARMProxyOwnerBypasser"
    }
```

```diff
    contract EthereumToArbitrumOnRampTokenLimitAdmin (eth:0x2F2A3e36CE5Fb0924C414BEB1D98B531Cdf17e0B) {
    +++ description: None
      name:
-        "ManyChainMultiSig"
+        "EthereumToArbitrumOnRampTokenLimitAdmin"
      receivedPermissions:
+        [{"permission":"interact","from":"eth:0x69eCC4E2D8ea56E2d0a05bF57f4Fd6aEE7f2c284","description":"change the aggregate outbound value rate limit for Ethereum-to-Arbitrum sends.","role":".getTokenLimitAdmin"},{"permission":"interact","from":"eth:0x69eCC4E2D8ea56E2d0a05bF57f4Fd6aEE7f2c284","description":"replace the token limit admin for this OnRamp.","role":".getTokenLimitAdmin"}]
    }
```

```diff
    EOA  (eth:0x316D2E43270ff4091Ca5d269c0E5cD8363524C91) {
    +++ description: None
      receivedPermissions.0.description:
-        "sign and transmit commit reports that publish Merkle roots for messages accepted by this CommitStore."
+        "sign commit reports with at least f+1 sigs and transmit them through one of the transmitter addresses."
      receivedPermissions.1.description:
-        "sign and transmit execution reports that deliver messages and release or mint tokens through this OffRamp."
+        "transmit execution reports from one of the 16 configured transmitter addresses. This OffRamp does not verify OCR signer signatures onchain; execution still requires a blessed CommitStore proof."
    }
```

```diff
    EOA  (eth:0x31eD28c2549e0195c4A405B71e4f18EfB935bE6f) {
    +++ description: None
      receivedPermissions.0.description:
-        "sign and transmit commit reports that publish Merkle roots for messages accepted by this CommitStore."
+        "sign commit reports with at least f+1 sigs and transmit them through one of the transmitter addresses."
      receivedPermissions.1.description:
-        "sign and transmit execution reports that deliver messages and release or mint tokens through this OffRamp."
+        "transmit execution reports from one of the 16 configured transmitter addresses. This OffRamp does not verify OCR signer signatures onchain; execution still requires a blessed CommitStore proof."
    }
```

```diff
    contract ARMProxy (eth:0x411dE17f12D1A34ecC7F45f49844626267c75e81) {
    +++ description: ARM proxy used by the Router, OnRamp, CommitStore, OffRamp, and GHO token pool to read RMN curse and blessing state.
      description:
-        "Proxy pointing to the active ARM/RMN contract used by CCIP to report whether routes are cursed."
+        "ARM proxy used by the Router, OnRamp, CommitStore, OffRamp, and GHO token pool to read RMN curse and blessing state."
      receivedPermissions:
-        [{"permission":"interact","from":"eth:0x06179f7C1be40863405f374E7f5F8806c728660A","description":"block GHO pool operations when ARM/RMN marks the route or global subject as cursed.","role":".getRmnProxy"},{"permission":"interact","from":"eth:0x80226fc0Ee2b096224EeAc085Bb9a8cba1146f7D","description":"block routed messages when ARM/RMN reports the relevant subject as cursed.","role":".getArmProxy"},{"permission":"interact","from":"eth:0x9B2EEd6A1e16cB50Ed4c876D2dD69468B21b7749","description":"define the trusted source OnRamp and ARM/RMN safety gate for commits accepted by this CommitStore.","role":".getStaticConfig"}]
      directlyReceivedPermissions:
+        [{"permission":"interact","from":"eth:0x06179f7C1be40863405f374E7f5F8806c728660A","description":"block GHO pool operations when ARM/RMN marks the route or global subject as cursed.","role":".getRmnProxy"},{"permission":"interact","from":"eth:0x80226fc0Ee2b096224EeAc085Bb9a8cba1146f7D","description":"block routed messages when ARM/RMN reports the relevant subject as cursed.","role":".getArmProxy"},{"permission":"interact","from":"eth:0x9B2EEd6A1e16cB50Ed4c876D2dD69468B21b7749","description":"define the trusted source OnRamp and ARM/RMN safety gate for commits accepted by this CommitStore.","role":".getStaticConfig"}]
    }
```

```diff
    EOA  (eth:0x41fa7E165F7aD96feC5EeB2a715d18dd9a4681d3) {
    +++ description: None
      receivedPermissions.0.description:
-        "sign and transmit commit reports that publish Merkle roots for messages accepted by this CommitStore."
+        "sign commit reports with at least f+1 sigs and transmit them through one of the transmitter addresses."
      receivedPermissions.1.description:
-        "sign and transmit execution reports that deliver messages and release or mint tokens through this OffRamp."
+        "transmit execution reports from one of the 16 configured transmitter addresses. This OffRamp does not verify OCR signer signatures onchain; execution still requires a blessed CommitStore proof."
    }
```

```diff
    contract ARMProxyOwner (eth:0x44835bBBA9D40DEDa9b64858095EcFB2693c9449) {
    +++ description: Timelock administering the CCIP Router, PriceRegistry, CommitStore, OffRamp, OnRamp, and ARM proxy.
      description:
-        "Role based timelock used to administer CCIP contracts."
+        "Timelock administering the CCIP Router, PriceRegistry, CommitStore, OffRamp, OnRamp, and ARM proxy."
      receivedPermissions:
-        [{"permission":"interact","from":"eth:0x411dE17f12D1A34ecC7F45f49844626267c75e81","description":"replace the active ARM/RMN contract used for CCIP safety checks.","role":".owner"},{"permission":"interact","from":"eth:0x44835bBBA9D40DEDa9b64858095EcFB2693c9449","description":"grant or revoke roles on this timelock.","role":".AdminRoleGranted"},{"permission":"interact","from":"eth:0x6608920e3F6b591EC3Cf15CA1DDf66fBE117F56A","description":"grant or revoke roles on this timelock.","role":".AdminRoleGranted"},{"permission":"interact","from":"eth:0x80226fc0Ee2b096224EeAc085Bb9a8cba1146f7D","description":"add or remove OnRamps and OffRamps and change the wrapped native token used by this Router.","role":".owner"},{"permission":"interact","from":"eth:0x8c9b2Efb7c64C394119270bfecE7f54763b958Ad","description":"add or remove fee tokens and price updaters used by CCIP pricing.","role":".owner"},{"permission":"interact","from":"eth:0x9B2EEd6A1e16cB50Ed4c876D2dD69468B21b7749","description":"pause or unpause commits and change OCR, dynamic config, minimum sequence, and price epoch parameters.","role":".owner"},{"permission":"interact","from":"eth:0xeFC4a18af59398FF23bfe7325F2401aD44286F4d","description":"change the OffRamp admin, OCR config, rate limits, token pools, and execution parameters.","role":".owner"}]
      directlyReceivedPermissions:
+        [{"permission":"interact","from":"eth:0x411dE17f12D1A34ecC7F45f49844626267c75e81","description":"replace the active ARM/RMN contract used for CCIP safety checks.","role":".owner"},{"permission":"interact","from":"eth:0x44835bBBA9D40DEDa9b64858095EcFB2693c9449","description":"grant or revoke roles on this timelock.","role":".AdminRoleGranted"},{"permission":"interact","from":"eth:0x6608920e3F6b591EC3Cf15CA1DDf66fBE117F56A","description":"grant or revoke roles on this timelock.","role":".AdminRoleGranted"},{"permission":"interact","from":"eth:0x69eCC4E2D8ea56E2d0a05bF57f4Fd6aEE7f2c284","description":"add, remove, or reprice fee tokens accepted by this OnRamp.","role":".owner"},{"permission":"interact","from":"eth:0x69eCC4E2D8ea56E2d0a05bF57f4Fd6aEE7f2c284","description":"change Router, PriceRegistry, message size, token count, gas limit, and fee parameters for outbound messages.","role":".owner"},{"permission":"interact","from":"eth:0x69eCC4E2D8ea56E2d0a05bF57f4Fd6aEE7f2c284","description":"change token transfer fee configuration and node operator fee weights.","role":".owner"},{"permission":"interact","from":"eth:0x69eCC4E2D8ea56E2d0a05bF57f4Fd6aEE7f2c284","description":"withdraw accumulated non-LINK fee tokens.","role":".owner"},{"permission":"interact","from":"eth:0x80226fc0Ee2b096224EeAc085Bb9a8cba1146f7D","description":"add, remove, or replace OnRamps and OffRamps used by the Router.","role":".owner"},{"permission":"interact","from":"eth:0x80226fc0Ee2b096224EeAc085Bb9a8cba1146f7D","description":"change the wrapped native token used for native-fee payments.","role":".owner"},{"permission":"interact","from":"eth:0x80226fc0Ee2b096224EeAc085Bb9a8cba1146f7D","description":"recover tokens held by the Router.","role":".owner"},{"permission":"interact","from":"eth:0x8c9b2Efb7c64C394119270bfecE7f54763b958Ad","description":"add or remove fee tokens accepted by CCIP pricing.","role":".owner"},{"permission":"interact","from":"eth:0x8c9b2Efb7c64C394119270bfecE7f54763b958Ad","description":"add or remove price updater accounts.","role":".owner"},{"permission":"interact","from":"eth:0x8c9b2Efb7c64C394119270bfecE7f54763b958Ad","description":"change the staleness threshold for token and gas prices.","role":".owner"},{"permission":"interact","from":"eth:0x9B2EEd6A1e16cB50Ed4c876D2dD69468B21b7749","description":"pause or unpause commits and change OCR, dynamic config, minimum sequence, and price epoch parameters.","role":".owner"},{"permission":"interact","from":"eth:0xeFC4a18af59398FF23bfe7325F2401aD44286F4d","description":"change the OffRamp admin, OCR config, rate limits, token pools, and execution parameters.","role":".owner"}]
    }
```

```diff
    EOA  (eth:0x465Cb88B0Bf2A984a7C6c053262C8137D667bEaE) {
    +++ description: None
      receivedPermissions.0.description:
-        "sign and transmit commit reports that publish Merkle roots for messages accepted by this CommitStore."
+        "sign commit reports with at least f+1 sigs and transmit them through one of the transmitter addresses."
      receivedPermissions.1.description:
-        "sign and transmit execution reports that deliver messages and release or mint tokens through this OffRamp."
+        "transmit execution reports from one of the 16 configured transmitter addresses. This OffRamp does not verify OCR signer signatures onchain; execution still requires a blessed CommitStore proof."
    }
```

```diff
    contract RMNRemoteOwnerExecutor (eth:0x49edf594E698F406A15afEf44CE7a0Fd8d998610) {
    +++ description: Public call proxy that forwards any caller to RMNRemoteOwner, allowing anyone to execute already-scheduled RMNRemoteOwner operations after the timelock delay.
      name:
-        "CallProxy"
+        "RMNRemoteOwnerExecutor"
      description:
+        "Public call proxy that forwards any caller to RMNRemoteOwner, allowing anyone to execute already-scheduled RMNRemoteOwner operations after the timelock delay."
    }
```

```diff
    EOA  (eth:0x58f94e05e34F9319627FAfdb64bB01E8D590878C) {
    +++ description: None
      receivedPermissions.0.description:
-        "sign and transmit commit reports that publish Merkle roots for messages accepted by this CommitStore."
+        "sign commit reports with at least f+1 sigs and transmit them through one of the transmitter addresses."
      receivedPermissions.1.description:
-        "sign and transmit execution reports that deliver messages and release or mint tokens through this OffRamp."
+        "transmit execution reports from one of the 16 configured transmitter addresses. This OffRamp does not verify OCR signer signatures onchain; execution still requires a blessed CommitStore proof."
    }
```

```diff
    contract RMNRemoteOwner (eth:0x6608920e3F6b591EC3Cf15CA1DDf66fBE117F56A) {
    +++ description: Timelock administering RMNRemote signer configuration and curse/blessing controls.
      description:
-        "Role based timelock used to administer CCIP contracts."
+        "Timelock administering RMNRemote signer configuration and curse/blessing controls."
      receivedPermissions:
-        [{"permission":"interact","from":"eth:0xe8464c353210Cc398A45dB2454FBc5BCd25fFf20","description":"update the RMN signer set and fault threshold used to approve or block CCIP activity.","role":".owner"}]
      directlyReceivedPermissions:
+        [{"permission":"interact","from":"eth:0xe8464c353210Cc398A45dB2454FBc5BCd25fFf20","description":"update the RMN signer set and fault threshold used to approve or block CCIP activity.","role":".owner"}]
    }
```

```diff
    contract EthereumToArbitrumOnRamp (eth:0x69eCC4E2D8ea56E2d0a05bF57f4Fd6aEE7f2c284) {
    +++ description: Ethereum-to-Arbitrum OnRamp. It receives messages only from the Router, validates send limits and fees, locks or burns tokens through token pools, assigns sequence numbers and nonces, hashes the message, and emits CCIPSendRequested for the offchain DON (ccip consensus).
      description:
+        "Ethereum-to-Arbitrum OnRamp. It receives messages only from the Router, validates send limits and fees, locks or burns tokens through token pools, assigns sequence numbers and nonces, hashes the message, and emits CCIPSendRequested for the offchain DON (ccip consensus)."
      fieldMeta:
+        {"getStaticConfig":{"description":"Immutable lane config: Ethereum source selector, Arbitrum destination selector, previous OnRamp, RMN proxy, LINK token, and token admin registry."},"getDynamicConfig":{"description":"Mutable outbound config: Router, PriceRegistry, message size and gas limits, token limits, destination gas overheads, fee defaults, and ordered-execution policy."}}
    }
```

```diff
    EOA  (eth:0x6A985273Db73f21D6a74Ee9f76725112819BD950) {
    +++ description: None
      receivedPermissions.0.description:
-        "sign and transmit commit reports that publish Merkle roots for messages accepted by this CommitStore."
+        "sign commit reports with at least f+1 sigs and transmit them through one of the transmitter addresses."
      receivedPermissions.1.description:
-        "sign and transmit execution reports that deliver messages and release or mint tokens through this OffRamp."
+        "transmit execution reports from one of the 16 configured transmitter addresses. This OffRamp does not verify OCR signer signatures onchain; execution still requires a blessed CommitStore proof."
    }
```

```diff
    contract RMNRemoteOwnerProposer (eth:0x79bC82F3931A7d017719146A822e4AD8152b157e) {
    +++ description: None
      name:
-        "ManyChainMultiSig"
+        "RMNRemoteOwnerProposer"
    }
```

```diff
    EOA  (eth:0x7A3c53356AE7797284B3C8daC27115015A8744BC) {
    +++ description: None
      receivedPermissions.0.description:
-        "sign and transmit commit reports that publish Merkle roots for messages accepted by this CommitStore."
+        "sign commit reports with at least f+1 sigs and transmit them through one of the transmitter addresses."
      receivedPermissions.1.description:
-        "sign and transmit execution reports that deliver messages and release or mint tokens through this OffRamp."
+        "transmit execution reports from one of the 16 configured transmitter addresses. This OffRamp does not verify OCR signer signatures onchain; execution still requires a blessed CommitStore proof."
    }
```

```diff
    contract Router (eth:0x80226fc0Ee2b096224EeAc085Bb9a8cba1146f7D) {
    +++ description: Ethereum CCIP Router for this route. Users call it to send messages to Arbitrum; trusted Arbitrum OffRamps call it to deliver incoming messages to Ethereum receivers.
      receivedPermissions:
-        [{"permission":"interact","from":"eth:0x06179f7C1be40863405f374E7f5F8806c728660A","description":"route GHO token transfers into and out of this token pool.","role":".getRouter"}]
      fieldMeta.arbitrumOnRamp.description:
-        "The OnRamp used by CCIP to send messages and tokens from Ethereum to Arbitrum One."
+        "Ethereum-to-Arbitrum OnRamp selected by the Router when users call ccipSend() for the Arbitrum chain selector."
      fieldMeta.arbitrumOffRamp.description:
-        "The OffRamp used by CCIP to deliver messages and tokens from Arbitrum One to Ethereum."
+        "Arbitrum-to-Ethereum OffRamp allowed to call routeMessage() and deliver messages to Ethereum receivers."
      description:
+        "Ethereum CCIP Router for this route. Users call it to send messages to Arbitrum; trusted Arbitrum OffRamps call it to deliver incoming messages to Ethereum receivers."
      directlyReceivedPermissions:
+        [{"permission":"interact","from":"eth:0x06179f7C1be40863405f374E7f5F8806c728660A","description":"route GHO token transfers into and out of this token pool.","role":".getRouter"}]
    }
```

```diff
    contract RMNRemoteOwnerCanceller (eth:0x806659842cFeEE3CBEF35F8ad2eA42460574b413) {
    +++ description: None
      name:
-        "ManyChainMultiSig"
+        "RMNRemoteOwnerCanceller"
    }
```

```diff
    contract ARMProxyOwnerExecutor (eth:0x82b8A19497fA25575f250a3DcFfCD2562B575A2e) {
    +++ description: Public call proxy that forwards any caller to ARMProxyOwner, allowing anyone to execute already-scheduled ARMProxyOwner operations after the timelock delay.
      name:
-        "CallProxy"
+        "ARMProxyOwnerExecutor"
      description:
+        "Public call proxy that forwards any caller to ARMProxyOwner, allowing anyone to execute already-scheduled ARMProxyOwner operations after the timelock delay."
    }
```

```diff
    contract RMNRemoteOwnerBypasser (eth:0x8C00Cc7cC37396e88BbFe66371341a59D1b5771F) {
    +++ description: None
      name:
-        "ManyChainMultiSig"
+        "RMNRemoteOwnerBypasser"
    }
```

```diff
    contract PriceRegistry (eth:0x8c9b2Efb7c64C394119270bfecE7f54763b958Ad) {
    +++ description: PriceRegistry used by the OnRamp and CommitStore to price fees, tokens, and gas for this route.
      receivedPermissions:
-        [{"permission":"interact","from":"eth:0x9B2EEd6A1e16cB50Ed4c876D2dD69468B21b7749","description":"provide gas and token price data used when committing CCIP state.","role":".priceRegistry"}]
      description:
+        "PriceRegistry used by the OnRamp and CommitStore to price fees, tokens, and gas for this route."
      directlyReceivedPermissions:
+        [{"permission":"interact","from":"eth:0x9B2EEd6A1e16cB50Ed4c876D2dD69468B21b7749","description":"provide gas and token price data used when committing CCIP state.","role":".priceRegistry"}]
    }
```

```diff
    EOA  (eth:0x90f91a0fFDC93a11c045b3155F0b3cc0D9fB9ef6) {
    +++ description: None
      receivedPermissions.0.description:
-        "sign and transmit commit reports that publish Merkle roots for messages accepted by this CommitStore."
+        "sign commit reports with at least f+1 sigs and transmit them through one of the transmitter addresses."
      receivedPermissions.1.description:
-        "sign and transmit execution reports that deliver messages and release or mint tokens through this OffRamp."
+        "transmit execution reports from one of the 16 configured transmitter addresses. This OffRamp does not verify OCR signer signatures onchain; execution still requires a blessed CommitStore proof."
    }
```

```diff
    EOA  (eth:0x925f08725819ED7FA98269A92A7c14093C4395c5) {
    +++ description: None
      receivedPermissions.0.description:
-        "sign and transmit commit reports that publish Merkle roots for messages accepted by this CommitStore."
+        "sign commit reports with at least f+1 sigs and transmit them through one of the transmitter addresses."
      receivedPermissions.1.description:
-        "sign and transmit execution reports that deliver messages and release or mint tokens through this OffRamp."
+        "transmit execution reports from one of the 16 configured transmitter addresses. This OffRamp does not verify OCR signer signatures onchain; execution still requires a blessed CommitStore proof."
    }
```

```diff
    EOA  (eth:0x96d1D86b1BEd64053410FdCc2E3585EB578DdE1f) {
    +++ description: None
      receivedPermissions.0.description:
-        "sign and transmit commit reports that publish Merkle roots for messages accepted by this CommitStore."
+        "sign commit reports with at least f+1 sigs and transmit them through one of the transmitter addresses."
      receivedPermissions.1.description:
-        "sign and transmit execution reports that deliver messages and release or mint tokens through this OffRamp."
+        "transmit execution reports from one of the 16 configured transmitter addresses. This OffRamp does not verify OCR signer signatures onchain; execution still requires a blessed CommitStore proof."
    }
```

```diff
    contract ArbitrumToEthereumCommitStore (eth:0x9B2EEd6A1e16cB50Ed4c876D2dD69468B21b7749) {
    +++ description: Arbitrum-to-Ethereum CommitStore. Its OCR commit reports publish Merkle roots for source messages; execution is possible only for leaves under roots that are both committed here and blessed by RMN through the ARM proxy.
      receivedPermissions:
-        [{"permission":"interact","from":"eth:0xeFC4a18af59398FF23bfe7325F2401aD44286F4d","description":"provide committed Merkle roots that this OffRamp requires before executing messages.","role":".commitStore"}]
      fieldMeta.ocrConfig.description:
-        "Latest OCR2 signer and transmitter config for committing Merkle roots on this CommitStore."
+        "Commit OCR config from ConfigSet. transmit() requires exactly f+1 valid OCR signer signatures, and msg.sender must be one of the transmitters."
      fieldMeta.getStaticConfig:
+        {"description":"Immutable commit lane config: Ethereum destination selector, Arbitrum source selector, trusted Arbitrum OnRamp, and ARM/RMN proxy used for blessing checks."}
      fieldMeta.getDynamicConfig:
+        {"description":"Mutable commit config: PriceRegistry used for price updates included in commit reports."}
      fieldMeta.latestConfigDetails:
+        {"description":"Digest and config count for the currently accepted commit OCR config. Commit reports must use this digest."}
      description:
+        "Arbitrum-to-Ethereum CommitStore. Its OCR commit reports publish Merkle roots for source messages; execution is possible only for leaves under roots that are both committed here and blessed by RMN through the ARM proxy."
      directlyReceivedPermissions:
+        [{"permission":"interact","from":"eth:0xeFC4a18af59398FF23bfe7325F2401aD44286F4d","description":"provide committed Merkle roots that this OffRamp requires before executing messages.","role":".commitStore"}]
    }
```

```diff
    EOA  (eth:0x9CA9809476bE48b7A700D50B3d10A98D993dd8A5) {
    +++ description: None
      receivedPermissions.0.description:
-        "sign and transmit commit reports that publish Merkle roots for messages accepted by this CommitStore."
+        "sign commit reports with at least f+1 sigs and transmit them through one of the transmitter addresses."
      receivedPermissions.1.description:
-        "sign and transmit execution reports that deliver messages and release or mint tokens through this OffRamp."
+        "transmit execution reports from one of the 16 configured transmitter addresses. This OffRamp does not verify OCR signer signatures onchain; execution still requires a blessed CommitStore proof."
    }
```

```diff
    EOA  (eth:0xA2B7C82d2B90A4e94F0C3027c0999e4f44f4Cc9F) {
    +++ description: None
      receivedPermissions.0.description:
-        "sign and transmit commit reports that publish Merkle roots for messages accepted by this CommitStore."
+        "sign commit reports with at least f+1 sigs and transmit them through one of the transmitter addresses."
      receivedPermissions.1.description:
-        "sign and transmit execution reports that deliver messages and release or mint tokens through this OffRamp."
+        "transmit execution reports from one of the 16 configured transmitter addresses. This OffRamp does not verify OCR signer signatures onchain; execution still requires a blessed CommitStore proof."
    }
```

```diff
    EOA  (eth:0xA39B7c0f08e4727c8325b4ad043513AA5185a4E2) {
    +++ description: None
      receivedPermissions.0.description:
-        "sign and transmit commit reports that publish Merkle roots for messages accepted by this CommitStore."
+        "sign commit reports with at least f+1 sigs and transmit them through one of the transmitter addresses."
      receivedPermissions.1.description:
-        "sign and transmit execution reports that deliver messages and release or mint tokens through this OffRamp."
+        "transmit execution reports from one of the 16 configured transmitter addresses. This OffRamp does not verify OCR signer signatures onchain; execution still requires a blessed CommitStore proof."
    }
```

```diff
    EOA  (eth:0xa616AEEa440ECfb1AA8065a19E6E55652743B3FB) {
    +++ description: None
      receivedPermissions.0.description:
-        "sign and transmit commit reports that publish Merkle roots for messages accepted by this CommitStore."
+        "sign commit reports with at least f+1 sigs and transmit them through one of the transmitter addresses."
      receivedPermissions.1.description:
-        "sign and transmit execution reports that deliver messages and release or mint tokens through this OffRamp."
+        "transmit execution reports from one of the 16 configured transmitter addresses. This OffRamp does not verify OCR signer signatures onchain; execution still requires a blessed CommitStore proof."
    }
```

```diff
    EOA  (eth:0xA69d606205419F67a46d772c66cf685971d5ceed) {
    +++ description: None
      receivedPermissions.0.description:
-        "sign and transmit commit reports that publish Merkle roots for messages accepted by this CommitStore."
+        "sign commit reports with at least f+1 sigs and transmit them through one of the transmitter addresses."
      receivedPermissions.1.description:
-        "sign and transmit execution reports that deliver messages and release or mint tokens through this OffRamp."
+        "transmit execution reports from one of the 16 configured transmitter addresses. This OffRamp does not verify OCR signer signatures onchain; execution still requires a blessed CommitStore proof."
    }
```

```diff
    EOA  (eth:0xa968cf59aB2BaE618f6eE0a80EcBd5b242ebE991) {
    +++ description: None
      receivedPermissions.0.description:
-        "sign and transmit commit reports that publish Merkle roots for messages accepted by this CommitStore."
+        "sign commit reports with at least f+1 sigs and transmit them through one of the transmitter addresses."
      receivedPermissions.1.description:
-        "sign and transmit execution reports that deliver messages and release or mint tokens through this OffRamp."
+        "transmit execution reports from one of the 16 configured transmitter addresses. This OffRamp does not verify OCR signer signatures onchain; execution still requires a blessed CommitStore proof."
    }
```

```diff
    contract ARMProxyOwnerCanceller (eth:0xAD97C0270a243270136E40278155C12ce7C7F87B) {
    +++ description: None
      name:
-        "ManyChainMultiSig"
+        "ARMProxyOwnerCanceller"
    }
```

```diff
    EOA  (eth:0xb4a378C2a17f4B8D4767616b4469807223f27a26) {
    +++ description: None
      receivedPermissions.0.description:
-        "sign and transmit commit reports that publish Merkle roots for messages accepted by this CommitStore."
+        "sign commit reports with at least f+1 sigs and transmit them through one of the transmitter addresses."
      receivedPermissions.1.description:
-        "sign and transmit execution reports that deliver messages and release or mint tokens through this OffRamp."
+        "transmit execution reports from one of the 16 configured transmitter addresses. This OffRamp does not verify OCR signer signatures onchain; execution still requires a blessed CommitStore proof."
    }
```

```diff
    EOA  (eth:0xc333b76845bDF806369EF0F00134559988aa985C) {
    +++ description: None
      receivedPermissions.0.description:
-        "sign and transmit commit reports that publish Merkle roots for messages accepted by this CommitStore."
+        "sign commit reports with at least f+1 sigs and transmit them through one of the transmitter addresses."
      receivedPermissions.1.description:
-        "sign and transmit execution reports that deliver messages and release or mint tokens through this OffRamp."
+        "transmit execution reports from one of the 16 configured transmitter addresses. This OffRamp does not verify OCR signer signatures onchain; execution still requires a blessed CommitStore proof."
    }
```

```diff
    EOA  (eth:0xc4fd363861673327BAcFa1AeE04B9A991459a1D2) {
    +++ description: None
      receivedPermissions.0.description:
-        "sign and transmit commit reports that publish Merkle roots for messages accepted by this CommitStore."
+        "sign commit reports with at least f+1 sigs and transmit them through one of the transmitter addresses."
      receivedPermissions.1.description:
-        "sign and transmit execution reports that deliver messages and release or mint tokens through this OffRamp."
+        "transmit execution reports from one of the 16 configured transmitter addresses. This OffRamp does not verify OCR signer signatures onchain; execution still requires a blessed CommitStore proof."
    }
```

```diff
    contract GhoCcipSteward (eth:0xC5BcC58BE6172769ca1a78B8A45752E3C5059c39) {
    +++ description: Aave GHO CCIP steward. It can update bridge and rate limits for the GHO Ethereum token pool only when called by the Aave Risk Council.
      description:
-        "Aave GHO CCIP steward that can update bridge and rate limits for the GHO Ethereum token pool."
+        "Aave GHO CCIP steward. It can update bridge and rate limits for the GHO Ethereum token pool only when called by the Aave Risk Council."
    }
```

```diff
    EOA  (eth:0xCbF79800f67af0f5391D49B98C63EE4E3c976E2D) {
    +++ description: None
      receivedPermissions.0.description:
-        "sign and transmit commit reports that publish Merkle roots for messages accepted by this CommitStore."
+        "sign commit reports with at least f+1 sigs and transmit them through one of the transmitter addresses."
      receivedPermissions.1.description:
-        "sign and transmit execution reports that deliver messages and release or mint tokens through this OffRamp."
+        "transmit execution reports from one of the 16 configured transmitter addresses. This OffRamp does not verify OCR signer signatures onchain; execution still requires a blessed CommitStore proof."
    }
```

```diff
    EOA  (eth:0xCEED45aD0f1c8E621eef28a4643B06AF04A6dEB0) {
    +++ description: None
      receivedPermissions.0.description:
-        "sign and transmit commit reports that publish Merkle roots for messages accepted by this CommitStore."
+        "sign commit reports with at least f+1 sigs and transmit them through one of the transmitter addresses."
      receivedPermissions.1.description:
-        "sign and transmit execution reports that deliver messages and release or mint tokens through this OffRamp."
+        "transmit execution reports from one of the 16 configured transmitter addresses. This OffRamp does not verify OCR signer signatures onchain; execution still requires a blessed CommitStore proof."
    }
```

```diff
    EOA  (eth:0xD29971a9eac66b42Ba5B1472204C0bcca8E15c6e) {
    +++ description: None
      receivedPermissions.0.description:
-        "sign and transmit commit reports that publish Merkle roots for messages accepted by this CommitStore."
+        "sign commit reports with at least f+1 sigs and transmit them through one of the transmitter addresses."
      receivedPermissions.1.description:
-        "sign and transmit execution reports that deliver messages and release or mint tokens through this OffRamp."
+        "transmit execution reports from one of the 16 configured transmitter addresses. This OffRamp does not verify OCR signer signatures onchain; execution still requires a blessed CommitStore proof."
    }
```

```diff
    contract ARMProxyOwnerGnosisSafe (eth:0xD6597750bf74DCAEC57e0F9aD2ec998D837005bf) {
    +++ description: None
      name:
-        "GnosisSafe"
+        "ARMProxyOwnerGnosisSafe"
    }
```

```diff
    EOA  (eth:0xd7d7f77069aCEF3116B6D0eDBEA48e45aCc3562e) {
    +++ description: None
      receivedPermissions.0.description:
-        "sign and transmit commit reports that publish Merkle roots for messages accepted by this CommitStore."
+        "sign commit reports with at least f+1 sigs and transmit them through one of the transmitter addresses."
      receivedPermissions.1.description:
-        "sign and transmit execution reports that deliver messages and release or mint tokens through this OffRamp."
+        "transmit execution reports from one of the 16 configured transmitter addresses. This OffRamp does not verify OCR signer signatures onchain; execution still requires a blessed CommitStore proof."
    }
```

```diff
    contract ARMProxyOwnerProposer (eth:0xD9757aA52907798d1aF2FDa7A6C0cC733E5aCf7e) {
    +++ description: None
      name:
-        "ManyChainMultiSig"
+        "ARMProxyOwnerProposer"
    }
```

```diff
    EOA  (eth:0xe24eD7652Ba5bFa1b3E8CAED4bf6065B93b734a6) {
    +++ description: None
      receivedPermissions.0.description:
-        "sign and transmit commit reports that publish Merkle roots for messages accepted by this CommitStore."
+        "sign commit reports with at least f+1 sigs and transmit them through one of the transmitter addresses."
      receivedPermissions.1.description:
-        "sign and transmit execution reports that deliver messages and release or mint tokens through this OffRamp."
+        "transmit execution reports from one of the 16 configured transmitter addresses. This OffRamp does not verify OCR signer signatures onchain; execution still requires a blessed CommitStore proof."
    }
```

```diff
    EOA  (eth:0xE336C8e4B6649c82A16a7c78577169A24Baa7fff) {
    +++ description: None
      receivedPermissions.0.description:
-        "sign and transmit commit reports that publish Merkle roots for messages accepted by this CommitStore."
+        "sign commit reports with at least f+1 sigs and transmit them through one of the transmitter addresses."
      receivedPermissions.1.description:
-        "sign and transmit execution reports that deliver messages and release or mint tokens through this OffRamp."
+        "transmit execution reports from one of the 16 configured transmitter addresses. This OffRamp does not verify OCR signer signatures onchain; execution still requires a blessed CommitStore proof."
    }
```

```diff
    contract ARMProxyOwnerProposer2 (eth:0xE53289F32c8E690b7173aA33affE9B6B0CB0012F) {
    +++ description: None
      name:
-        "ManyChainMultiSig"
+        "ARMProxyOwnerProposer2"
    }
```

```diff
    EOA  (eth:0xe79782642B9D6a9CC8a6619d30e27BE1d761BA44) {
    +++ description: None
      receivedPermissions.0.description:
-        "sign and transmit commit reports that publish Merkle roots for messages accepted by this CommitStore."
+        "sign commit reports with at least f+1 sigs and transmit them through one of the transmitter addresses."
      receivedPermissions.1.description:
-        "sign and transmit execution reports that deliver messages and release or mint tokens through this OffRamp."
+        "transmit execution reports from one of the 16 configured transmitter addresses. This OffRamp does not verify OCR signer signatures onchain; execution still requires a blessed CommitStore proof."
    }
```

```diff
    contract RMNRemote (eth:0xe8464c353210Cc398A45dB2454FBc5BCd25fFf20) {
    +++ description: RMNRemote contract behind the ARM proxy. It exposes RMN curse state and RMN 1.6 report verification. For pre-1.6 isBlessed() checks, it relays to the legacy RMN contract supplied in the constructor.
      description:
-        "Remote Risk Management Network contract used by CCIP to verify RMN reports and expose cursed subjects."
+        "RMNRemote contract behind the ARM proxy. It exposes RMN curse state and RMN 1.6 report verification. For pre-1.6 isBlessed() checks, it relays to the legacy RMN contract supplied in the constructor."
      receivedPermissions:
-        [{"permission":"interact","from":"eth:0x411dE17f12D1A34ecC7F45f49844626267c75e81","description":"block or allow CCIP activity by reporting whether global or route-specific subjects are cursed.","role":".getARM"}]
+++ description: Legacy RMN contract used by RMNRemote.isBlessed() for CommitStoreV1 root blessing. This immutable constructor arg is shown explicitly and kept as a leaf; its internal signer threshold is not decoded in this discovery.
      values.legacyRMN:
+        "eth:0xdCD48419bD5Cd9d1b097695F2af4Ee125aADF84F"
      fieldMeta:
+        {"getVersionedConfig":{"description":"RMNRemote.verify() requires fSign+1 valid RMN signature. This is separate from the legacy isBlessed() passthrough used by CommitStoreV1."},"legacyRMN":{"description":"Legacy RMN contract used by RMNRemote.isBlessed() for CommitStoreV1 root blessing. This immutable constructor arg is shown explicitly and kept as a leaf; its internal signer threshold is not decoded in this discovery."},"getCursedSubjects":{"description":"Subjects currently cursed by RMNRemote. An empty list means there is no active global or route-specific curse in this contract."},"isCursed":{"description":"True when RMNRemote has an active global or legacy curse."}}
      directlyReceivedPermissions:
+        [{"permission":"interact","from":"eth:0x411dE17f12D1A34ecC7F45f49844626267c75e81","description":"block or allow CCIP activity by reporting whether global or route-specific subjects are cursed.","role":".getARM"}]
    }
```

```diff
    contract ArbitrumToEthereumOffRamp (eth:0xeFC4a18af59398FF23bfe7325F2401aD44286F4d) {
    +++ description: Arbitrum-to-Ethereum OffRamp. It accepts OCR execution reports, checks every message against a blessed committed Merkle root, enforces sequence and nonce rules, releases or mints tokens, and calls the Router to deliver ccipReceive() to the receiver.
      receivedPermissions:
-        [{"permission":"interact","from":"eth:0x80226fc0Ee2b096224EeAc085Bb9a8cba1146f7D","description":"deliver Arbitrum-to-Ethereum CCIP messages and token transfers accepted by this Router.","role":".arbitrumOffRamp"}]
      fieldMeta.ocrConfig.description:
-        "Latest OCR2 signer and transmitter config for executing messages on this OffRamp."
+        "Execution OCR config from ConfigSet. usually f+1 signers must sign message that is committed by a transmitter. This OffRamp inherits OCR2BaseNoChecks, so transmit() does not verify OCR signer signatures onchain. Acceptance is one configured transmitter plus the matching config digest; message safety comes from the blessed CommitStore proof and OffRamp execution checks."
      fieldMeta.commitStore:
+        {"description":"CommitStore whose blessed Merkle roots must prove every message executed by this OffRamp."}
      fieldMeta.getStaticConfig:
+        {"description":"Immutable inbound lane config: Ethereum destination selector and Arbitrum source selector."}
      fieldMeta.getDynamicConfig:
+        {"description":"Mutable execution config: Router, PriceRegistry, permissionless execution delay, message size and token limits, and token pool gas limit."}
      fieldMeta.latestConfigDetails:
+        {"description":"Digest and config count for the currently accepted execution OCR config. Reports must use this digest, but this field is not itself a quorum."}
      description:
+        "Arbitrum-to-Ethereum OffRamp. It accepts OCR execution reports, checks every message against a blessed committed Merkle root, enforces sequence and nonce rules, releases or mints tokens, and calls the Router to deliver ccipReceive() to the receiver."
      directlyReceivedPermissions:
+        [{"permission":"interact","from":"eth:0x80226fc0Ee2b096224EeAc085Bb9a8cba1146f7D","description":"deliver Arbitrum-to-Ethereum CCIP messages and token transfers accepted by this Router.","role":".arbitrumOffRamp"}]
    }
```

```diff
    EOA  (eth:0xf2c04359575b08F71629CA89E9085B2d2076E286) {
    +++ description: None
      receivedPermissions.0.description:
-        "sign and transmit commit reports that publish Merkle roots for messages accepted by this CommitStore."
+        "sign commit reports with at least f+1 sigs and transmit them through one of the transmitter addresses."
      receivedPermissions.1.description:
-        "sign and transmit execution reports that deliver messages and release or mint tokens through this OffRamp."
+        "transmit execution reports from one of the 16 configured transmitter addresses. This OffRamp does not verify OCR signer signatures onchain; execution still requires a blessed CommitStore proof."
    }
```

```diff
    EOA  (eth:0xf547696fF576aeA0D2C8e41D467daD4CeE904513) {
    +++ description: None
      receivedPermissions.0.description:
-        "sign and transmit commit reports that publish Merkle roots for messages accepted by this CommitStore."
+        "sign commit reports with at least f+1 sigs and transmit them through one of the transmitter addresses."
      receivedPermissions.1.description:
-        "sign and transmit execution reports that deliver messages and release or mint tokens through this OffRamp."
+        "transmit execution reports from one of the 16 configured transmitter addresses. This OffRamp does not verify OCR signer signatures onchain; execution still requires a blessed CommitStore proof."
    }
```

```diff
    EOA  (eth:0xfc038715c79Ebcf7F9ee5723E466454B21434157) {
    +++ description: None
      receivedPermissions.0.description:
-        "sign and transmit commit reports that publish Merkle roots for messages accepted by this CommitStore."
+        "sign commit reports with at least f+1 sigs and transmit them through one of the transmitter addresses."
      receivedPermissions.1.description:
-        "sign and transmit execution reports that deliver messages and release or mint tokens through this OffRamp."
+        "transmit execution reports from one of the 16 configured transmitter addresses. This OffRamp does not verify OCR signer signatures onchain; execution still requires a blessed CommitStore proof."
    }
```

```diff
    EOA  (eth:0xfc0A7B612CE625c10DEbC660cD67452EBDBeC207) {
    +++ description: None
      receivedPermissions.0.description:
-        "sign and transmit commit reports that publish Merkle roots for messages accepted by this CommitStore."
+        "sign commit reports with at least f+1 sigs and transmit them through one of the transmitter addresses."
      receivedPermissions.1.description:
-        "sign and transmit execution reports that deliver messages and release or mint tokens through this OffRamp."
+        "transmit execution reports from one of the 16 configured transmitter addresses. This OffRamp does not verify OCR signer signatures onchain; execution still requires a blessed CommitStore proof."
    }
```

```diff
    EOA  (eth:0xFc52B2196a94D08fc9614b8039821bcE03bF58E8) {
    +++ description: None
      receivedPermissions.0.description:
-        "sign and transmit commit reports that publish Merkle roots for messages accepted by this CommitStore."
+        "sign commit reports with at least f+1 sigs and transmit them through one of the transmitter addresses."
      receivedPermissions.1.description:
-        "sign and transmit execution reports that deliver messages and release or mint tokens through this OffRamp."
+        "transmit execution reports from one of the 16 configured transmitter addresses. This OffRamp does not verify OCR signer signatures onchain; execution still requires a blessed CommitStore proof."
    }
```

Generated with discovered.json: 0x8b5f2eb06dc592680deb6deb45426af4a8307f98

# Diff at Mon, 27 Apr 2026 12:25:05 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- current timestamp: 1777287134

## Description

Initial discovery after revive.

## Initial discovery

```diff
+   Status: CREATED
    contract GHOEthereumTokenPool (eth:0x06179f7C1be40863405f374E7f5F8806c728660A)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ManyChainMultiSig (eth:0x117ec8aD107976e1dBCc21717ff78407Bc36aADc)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ManyChainMultiSig (eth:0x2F2A3e36CE5Fb0924C414BEB1D98B531Cdf17e0B)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ARMProxy (eth:0x411dE17f12D1A34ecC7F45f49844626267c75e81)
    +++ description: Proxy pointing to the active ARM/RMN contract used by CCIP to report whether routes are cursed.
```

```diff
+   Status: CREATED
    contract ARMProxyOwner (eth:0x44835bBBA9D40DEDa9b64858095EcFB2693c9449)
    +++ description: Role based timelock used to administer CCIP contracts.
```

```diff
+   Status: CREATED
    contract CallProxy (eth:0x49edf594E698F406A15afEf44CE7a0Fd8d998610)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Executor (eth:0x5300A1a15135EA4dc7aD5a167152C01EFc9b192A)
    +++ description: Aave governance executor that owns the GHO Ethereum token pool.
```

```diff
+   Status: CREATED
    contract RMNRemoteOwner (eth:0x6608920e3F6b591EC3Cf15CA1DDf66fBE117F56A)
    +++ description: Role based timelock used to administer CCIP contracts.
```

```diff
+   Status: CREATED
    contract EthereumToArbitrumOnRamp (eth:0x69eCC4E2D8ea56E2d0a05bF57f4Fd6aEE7f2c284)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ManyChainMultiSig (eth:0x79bC82F3931A7d017719146A822e4AD8152b157e)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Router (eth:0x80226fc0Ee2b096224EeAc085Bb9a8cba1146f7D)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ManyChainMultiSig (eth:0x806659842cFeEE3CBEF35F8ad2eA42460574b413)
    +++ description: None
```

```diff
+   Status: CREATED
    contract CallProxy (eth:0x82b8A19497fA25575f250a3DcFfCD2562B575A2e)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ManyChainMultiSig (eth:0x8C00Cc7cC37396e88BbFe66371341a59D1b5771F)
    +++ description: None
```

```diff
+   Status: CREATED
    contract PriceRegistry (eth:0x8c9b2Efb7c64C394119270bfecE7f54763b958Ad)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ArbitrumToEthereumCommitStore (eth:0x9B2EEd6A1e16cB50Ed4c876D2dD69468B21b7749)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ManyChainMultiSig (eth:0xAD97C0270a243270136E40278155C12ce7C7F87B)
    +++ description: None
```

```diff
+   Status: CREATED
    contract GhoCcipSteward (eth:0xC5BcC58BE6172769ca1a78B8A45752E3C5059c39)
    +++ description: Aave GHO CCIP steward that can update bridge and rate limits for the GHO Ethereum token pool.
```

```diff
+   Status: CREATED
    contract GnosisSafe (eth:0xD6597750bf74DCAEC57e0F9aD2ec998D837005bf)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ManyChainMultiSig (eth:0xD9757aA52907798d1aF2FDa7A6C0cC733E5aCf7e)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ManyChainMultiSig (eth:0xE53289F32c8E690b7173aA33affE9B6B0CB0012F)
    +++ description: None
```

```diff
+   Status: CREATED
    contract RMNRemote (eth:0xe8464c353210Cc398A45dB2454FBc5BCd25fFf20)
    +++ description: Remote Risk Management Network contract used by CCIP to verify RMN reports and expose cursed subjects.
```

```diff
+   Status: CREATED
    contract ArbitrumToEthereumOffRamp (eth:0xeFC4a18af59398FF23bfe7325F2401aD44286F4d)
    +++ description: None
```
