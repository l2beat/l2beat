Generated with discovered.json: 0x43d7bc5e60e1804491c0e924240b53cb55a254f9

# Diff at Wed, 21 Aug 2024 10:05:21 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@2f6dde3357bf5d79196b6e94f79d853a6c4ec72b block: 19825385
- current block number: 19825385

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19825385 (main branch discovery), not current.

```diff
    contract StarkExchange (0xB62BcD40A24985f560b5a9745d478791d8F1945C) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x6b7763b749073e892c83E674c1EC4799D6f339Ef","via":[]}]
    }
```

Generated with discovered.json: 0xfd5a9074c13d345210aa4ee310a8a59c173b2cd0

# Diff at Wed, 08 May 2024 12:37:19 GMT:

- author: sekuba (<sekuba@users.noreply.github.com>)
- comparing to: main@7eb116053a3dfe1dcff4cde0b8b45a07198fbab8 block: 19624872
- current block number: 19825385

## Description

Provide description of changes. This section will be preserved.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19624872 (main branch discovery), not current.

```diff
    contract StarkExchange (0xB62BcD40A24985f560b5a9745d478791d8F1945C) {
    +++ description: None
      values.getRegisteredAvailabilityVerifiers:
-        "0x4b2Bf1Cb06CB636e8A14540F76c477E61d8B6669"
+        ["0x4b2Bf1Cb06CB636e8A14540F76c477E61d8B6669"]
      values.getRegisteredVerifiers:
-        "0x5339AB7557b3152b91A57D10B0Caf5da88Db5143"
+        ["0x5339AB7557b3152b91A57D10B0Caf5da88Db5143"]
    }
```

Generated with discovered.json: 0x5937688b48a3b2c4b4b6097811b1d1138dd318dd

# Diff at Wed, 10 Apr 2024 11:16:33 GMT:

- author: sekuba (<sekuba@users.noreply.github.com>)
- comparing to: main@ee07d1cb2dc09651ee4b52c49bb3ad20765aa9f3 block: 18939696
- current block number: 19624872

## Description

Provide description of changes. This section will be preserved.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 18939696 (main branch discovery), not current.

```diff
    contract StarkExchange (0xB62BcD40A24985f560b5a9745d478791d8F1945C) {
    +++ description: None
      values.getRegisteredAvailabilityVerifiers:
-        ["0x4b2Bf1Cb06CB636e8A14540F76c477E61d8B6669"]
+        "0x4b2Bf1Cb06CB636e8A14540F76c477E61d8B6669"
      values.getRegisteredVerifiers:
-        ["0x5339AB7557b3152b91A57D10B0Caf5da88Db5143"]
+        "0x5339AB7557b3152b91A57D10B0Caf5da88Db5143"
    }
```

Generated with discovered.json: 0x98130a67d5a856f24da2c30adf398cbb22109a4b

# Diff at Fri, 05 Jan 2024 07:48:28 GMT:

- author: Luca Donno (<donnoh99@gmail.com>)
- comparing to: main@

## Description

Added initial config.

## Watched changes

```diff
+   Status: CREATED
    contract Committee (0x4b2Bf1Cb06CB636e8A14540F76c477E61d8B6669) {
    }
```

```diff
+   Status: CREATED
    contract GpsFactRegistryAdapter (0x5339AB7557b3152b91A57D10B0Caf5da88Db5143) {
    }
```

```diff
+   Status: CREATED
    contract OrderRegistry (0x806d435a82B0381bD884540c2235147c13B97fe6) {
    }
```

```diff
+   Status: CREATED
    contract StarkExchange (0xB62BcD40A24985f560b5a9745d478791d8F1945C) {
    }
```
