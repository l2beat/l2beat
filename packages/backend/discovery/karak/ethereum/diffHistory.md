Generated with discovered.json: 0x16caa32ed21093a33d913c0d8264f1ada57d589c

# Diff at Thu, 28 Mar 2024 09:10:45 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@867de6120241d47b66bf76f83c490408eb3595b0 block: 19411993
- current block number: 19531626

## Description

Provide description of changes. This section will be preserved.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19411993 (main branch discovery), not current.

```diff
    contract KarakMultisig (0x28A227d4faF0f4f75897438E24C43EF1CDABb920) {
    +++ description: None
      upgradeability.threshold:
+        "3 of 5 (60%)"
    }
```

Generated with discovered.json: 0x0a1f7e21850a167f52f38ab6277deb45137398e8

# Diff at Mon, 11 Mar 2024 12:57:34 GMT:

- author: Michał Sobieraj-Jakubiec (<michalsidzej@gmail.com>)
- comparing to: main@64454506aee2b4b4e15b121f096369e92ec4cf20 block: 19324951
- current block number: 19411993

## Description

Update OP stack DA handler

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19324951 (main branch discovery), not current.

```diff
    contract SystemConfig (0x622333688CC1878C7ff4205c89bDe051798788A7) {
    +++ description: None
      values.opStackDA.isSequencerSendingBlobTx:
+        false
    }
```

Generated with discovered.json: 0x4994070662bbd95d21b8c9c1ab21761f41503e62

# Diff at Wed, 28 Feb 2024 08:50:37 GMT:

- author: Bartek Kiepuszewski (<bkiepuszewski@gmail.com>)
- current block number: 19324951

## Description

Provide description of changes. This section will be preserved.

## Initial discovery

```diff
+   Status: CREATED
    contract L2OutputOracle (0x0a23342520Aa8Ca963c4201801F4D3E95e731637) {
    }
```

```diff
+   Status: CREATED
    contract ProxyAdmin (0x1612F868EbA1cea65ee66bF4A7C75001b0D4065C) {
    }
```

```diff
+   Status: CREATED
    contract KarakMultisig (0x28A227d4faF0f4f75897438E24C43EF1CDABb920) {
    }
```

```diff
+   Status: CREATED
    contract SystemConfig (0x622333688CC1878C7ff4205c89bDe051798788A7) {
    }
```

```diff
+   Status: CREATED
    contract L1ERC721Bridge (0x952851CecB07705A5bb483C1CE080F97e1E7491E) {
    }
```

```diff
+   Status: CREATED
    contract L1CrossDomainMessenger (0x9BFfA66a8FcAAd7AC9ea7c7d4b9a6fc46777022d) {
    }
```

```diff
+   Status: CREATED
    contract L1StandardBridge (0xBA61F25dd9f2d5f02D01B1C2c1c5F0B14c4B48A3) {
    }
```

```diff
+   Status: CREATED
    contract OptimismPortal (0xeeCE9CD7Abd1CC84d9dfc7493e7e68079E47eA73) {
    }
```

```diff
+   Status: CREATED
    contract OptimismMintableERC20Factory (0xF04a74899FF4c4410fAF3B5faa29B8Fd199C13DB) {
    }
```

```diff
+   Status: CREATED
    contract AddressManager (0xF2C89960B6D63eC6c61dF3EA8BaFa0a02c26e8C9) {
    }
```
