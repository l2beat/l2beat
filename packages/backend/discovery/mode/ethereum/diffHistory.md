Generated with discovered.json: 0x3df1bdb23fed3e128a1f9ed0811824a816f28626

# Diff at Tue, 02 Apr 2024 17:40:50 GMT:

- author: Luca Donno (<donnoh99@gmail.com>)
- comparing to: main@b58073d6e00a407c2aba3b43af1c68de0726a85a block: 19531989
- current block number: 19569646

## Description

Provide description of changes. This section will be preserved.

## Watched changes

```diff
    contract SystemConfig (0x5e6432F18Bc5d497B1Ab2288a025Fbf9D69E2221) {
    +++ description: None
      values.opStackDA:
-        {"isSomeTxsLengthEqualToCelestiaDAExample":false,"isSequencerSendingBlobTx":true}
      values.sequencerInbox:
-        "0x24E59d9d3Bd73ccC28Dc54062AF7EF7bFF58Bd67"
      errors:
+        {"opStackDA":"network timeout at: https://api.etherscan.io/api?module=account&action=txlist&address=0x99199a22125034c808ff20f377d91187E8050F2E&startblock=0&endblock=19569646&page=1&offset=20&sort=desc&apikey=1Z4WUBFZHSHRZ6VMBZJ6SSPQ2UFH67FZED","sequencerInbox":"network timeout at: https://api.etherscan.io/api?module=account&action=txlist&address=0x99199a22125034c808ff20f377d91187E8050F2E&startblock=0&endblock=19569646&page=1&offset=20&sort=desc&apikey=1Z4WUBFZHSHRZ6VMBZJ6SSPQ2UFH67FZED"}
    }
```

Generated with discovered.json: 0x04e0719463871ecf3822cc4b9adf17b22f76f521

# Diff at Thu, 28 Mar 2024 10:23:04 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@dd32bb06b292cc8459fb09925454ee3a90f5c27e block: 19439842
- current block number: 19531989

## Description

Update discovery to include the multisig threshold.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19439842 (main branch discovery), not current.

```diff
    contract ChallengerMultisig (0x309Fe2536d01867018D120b40e4676723C53A14C) {
    +++ description: None
      upgradeability.threshold:
+        "4 of 6 (67%)"
    }
```

```diff
    contract ModeMultisig (0x4a4962275DF8C60a80d3a25faEc5AA7De116A746) {
    +++ description: None
      upgradeability.threshold:
+        "3 of 5 (60%)"
    }
```

Generated with discovered.json: 0x1d22da0722e3ba859e81dc7e25fcc8b23f10048a

# Diff at Thu, 14 Mar 2024 07:33:30 GMT:

- author: Bartek Kiepuszewski (<bkiepuszewski@gmail.com>)
- comparing to: main@c79c75cb88d41e2f05e9cca5d501133eae405bbe block: 19411974
- current block number: 19431787

## Description

Blobs are switched on.

## Watched changes

```diff
    contract SystemConfig (0x5e6432F18Bc5d497B1Ab2288a025Fbf9D69E2221) {
    +++ description: None
      values.opStackDA.isSequencerSendingBlobTx:
-        false
+        true
      values.overhead:
-        188
+        0
      values.scalar:
-        684000
+        "452312848583266388373324160190187140051835877600158453279133701594312344529"
    }
```

Generated with discovered.json: 0x7583f54e5c6195c95832243781e1837e45e36883

# Diff at Mon, 11 Mar 2024 12:53:12 GMT:

- author: Michał Sobieraj-Jakubiec (<michalsidzej@gmail.com>)
- comparing to: main@64454506aee2b4b4e15b121f096369e92ec4cf20 block: 19176961
- current block number: 19411974

## Description

Update OP stack DA handler

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19176961 (main branch discovery), not current.

```diff
    contract SystemConfig (0x5e6432F18Bc5d497B1Ab2288a025Fbf9D69E2221) {
    +++ description: None
      values.opStackDA.isSequencerSendingBlobTx:
+        false
    }
```

Generated with discovered.json: 0xcc53221fa9d617cfac43ac7d0e03cc50a5345f8c

# Diff at Wed, 07 Feb 2024 14:38:56 GMT:

- author: Michał Sobieraj-Jakubiec (<michalsidzej@gmail.com>)
- comparing to: main@2e35800e01005d93332a552032058dcd67f3631d block: 19175200
- current block number: 19176961

## Description

Added opStackSequencerInbox handler

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19175200 (main branch discovery), not current.

```diff
    contract SystemConfig (0x5e6432F18Bc5d497B1Ab2288a025Fbf9D69E2221) {
      values.sequencerInbox:
+        "0x24E59d9d3Bd73ccC28Dc54062AF7EF7bFF58Bd67"
    }
```

Generated with discovered.json: 0x90d5136a81557b8fc210bdfc11441aa43010487b

# Diff at Wed, 07 Feb 2024 08:43:32 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@64f1e0f27f831d3ef860a1c2faad8c77e04e6c29 block: 19113377
- current block number: 19175200

## Description

Updated with the new OpDAHandler to remove the field.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19113377 (main branch discovery), not current.

```diff
    contract SystemConfig (0x5e6432F18Bc5d497B1Ab2288a025Fbf9D69E2221) {
      values.opStackDA.isAllTxsLengthEqualToCelestiaDAExample:
-        false
    }
```

Generated with discovered.json: 0x8c8447d97aa00a6dffbf43381ebbea74a47cfdbd

# Diff at Mon, 29 Jan 2024 16:29:36 GMT:

- author: Radina Talanova (<radinatalanova@Radinas-MacBook-Air.local>)
- current block number: 19113377

## Description

Update discovery to include the multisig threshold.

## Initial discovery

```diff
+   Status: CREATED
    contract L1ERC721Bridge (0x2901dA832a4D0297FF0691100A8E496626cc626D) {
    }
```

```diff
+   Status: CREATED
    contract ChallengerMultisig (0x309Fe2536d01867018D120b40e4676723C53A14C) {
    }
```

```diff
+   Status: CREATED
    contract L2OutputOracle (0x4317ba146D4933D889518a3e5E11Fe7a53199b04) {
    }
```

```diff
+   Status: CREATED
    contract ProxyAdmin (0x470d87b1dae09a454A43D1fD772A561a03276aB7) {
    }
```

```diff
+   Status: CREATED
    contract ModeMultisig (0x4a4962275DF8C60a80d3a25faEc5AA7De116A746) {
    }
```

```diff
+   Status: CREATED
    contract AddressManager (0x50eF494573f28Cad6B64C31b7a00Cdaa48306e15) {
    }
```

```diff
+   Status: CREATED
    contract SystemConfig (0x5e6432F18Bc5d497B1Ab2288a025Fbf9D69E2221) {
    }
```

```diff
+   Status: CREATED
    contract L1StandardBridge (0x735aDBbE72226BD52e818E7181953f42E3b0FF21) {
    }
```

```diff
+   Status: CREATED
    contract OptimismPortal (0x8B34b14c7c7123459Cf3076b8Cb929BE097d0C07) {
    }
```

```diff
+   Status: CREATED
    contract L1CrossDomainMessenger (0x95bDCA6c8EdEB69C98Bd5bd17660BaCef1298A6f) {
    }
```
