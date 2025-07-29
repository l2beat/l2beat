Generated with discovered.json: 0x20dc548965375a2cae51c217476f659f656ca698

# Diff at Mon, 14 Jul 2025 12:45:16 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@9f4300dad2f3d080cd56fa311d4a848556c74e72 block: 21322782
- current block number: 21322782

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21322782 (main branch discovery), not current.

```diff
    EOA  (0x34dFa1226F8b3E36FE597B34eEa809a2B5c0bBf9) {
    +++ description: None
      address:
-        "0x34dFa1226F8b3E36FE597B34eEa809a2B5c0bBf9"
+        "eth:0x34dFa1226F8b3E36FE597B34eEa809a2B5c0bBf9"
    }
```

```diff
    contract TransitionDisputer (0x5D3c0F4cA5EE99f8E8F59Ff9A5fAb04F6a7e007f) {
    +++ description: None
      address:
-        "0x5D3c0F4cA5EE99f8E8F59Ff9A5fAb04F6a7e007f"
+        "eth:0x5D3c0F4cA5EE99f8E8F59Ff9A5fAb04F6a7e007f"
      implementationNames.0x5D3c0F4cA5EE99f8E8F59Ff9A5fAb04F6a7e007f:
-        "TransitionDisputer"
      implementationNames.eth:0x5D3c0F4cA5EE99f8E8F59Ff9A5fAb04F6a7e007f:
+        "TransitionDisputer"
    }
```

```diff
    EOA  (0x6c0aF0E2a174AAffE9F336C0Ae4D0e535735294F) {
    +++ description: None
      address:
-        "0x6c0aF0E2a174AAffE9F336C0Ae4D0e535735294F"
+        "eth:0x6c0aF0E2a174AAffE9F336C0Ae4D0e535735294F"
    }
```

```diff
    contract RollupChain (0xf86FD6735f88d5b6aa709B357AD5Be22CEDf1A05) {
    +++ description: None
      address:
-        "0xf86FD6735f88d5b6aa709B357AD5Be22CEDf1A05"
+        "eth:0xf86FD6735f88d5b6aa709B357AD5Be22CEDf1A05"
      values.operator:
-        "0x6c0aF0E2a174AAffE9F336C0Ae4D0e535735294F"
+        "eth:0x6c0aF0E2a174AAffE9F336C0Ae4D0e535735294F"
      values.owner:
-        "0x34dFa1226F8b3E36FE597B34eEa809a2B5c0bBf9"
+        "eth:0x34dFa1226F8b3E36FE597B34eEa809a2B5c0bBf9"
      implementationNames.0xf86FD6735f88d5b6aa709B357AD5Be22CEDf1A05:
-        "RollupChain"
      implementationNames.eth:0xf86FD6735f88d5b6aa709B357AD5Be22CEDf1A05:
+        "RollupChain"
    }
```

```diff
    contract Registry (0xFe81ab6930A30BdaE731fe7b6C6ABFbEAFc014a8) {
    +++ description: None
      address:
-        "0xFe81ab6930A30BdaE731fe7b6C6ABFbEAFc014a8"
+        "eth:0xFe81ab6930A30BdaE731fe7b6C6ABFbEAFc014a8"
      values.owner:
-        "0x34dFa1226F8b3E36FE597B34eEa809a2B5c0bBf9"
+        "eth:0x34dFa1226F8b3E36FE597B34eEa809a2B5c0bBf9"
      implementationNames.0xFe81ab6930A30BdaE731fe7b6C6ABFbEAFc014a8:
-        "Registry"
      implementationNames.eth:0xFe81ab6930A30BdaE731fe7b6C6ABFbEAFc014a8:
+        "Registry"
    }
```

```diff
+   Status: CREATED
    contract TransitionDisputer (0x5D3c0F4cA5EE99f8E8F59Ff9A5fAb04F6a7e007f)
    +++ description: None
```

```diff
+   Status: CREATED
    contract RollupChain (0xf86FD6735f88d5b6aa709B357AD5Be22CEDf1A05)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Registry (0xFe81ab6930A30BdaE731fe7b6C6ABFbEAFc014a8)
    +++ description: None
```

Generated with discovered.json: 0x80acf39b0d142a2199218e8ba4bdfc41425ec5fc

# Diff at Tue, 04 Mar 2025 10:39:19 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@98d260b45fe0d2195ce5e629bd7b200c8706e8ba block: 21322782
- current block number: 21322782

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21322782 (main branch discovery), not current.

```diff
    contract TransitionDisputer (0x5D3c0F4cA5EE99f8E8F59Ff9A5fAb04F6a7e007f) {
    +++ description: None
      sinceBlock:
+        12283767
    }
```

```diff
    contract RollupChain (0xf86FD6735f88d5b6aa709B357AD5Be22CEDf1A05) {
    +++ description: None
      sinceBlock:
+        12283778
    }
```

```diff
    contract Registry (0xFe81ab6930A30BdaE731fe7b6C6ABFbEAFc014a8) {
    +++ description: None
      sinceBlock:
+        12283733
    }
```

Generated with discovered.json: 0x19c01a5181720f05aa8c436c44853c24c79349ee

# Diff at Tue, 03 Dec 2024 15:10:07 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- current block number: 21322782

## Description

Provide description of changes. This section will be preserved.

## Initial discovery

```diff
+   Status: CREATED
    contract TransitionDisputer (0x5D3c0F4cA5EE99f8E8F59Ff9A5fAb04F6a7e007f)
    +++ description: None
```

```diff
+   Status: CREATED
    contract RollupChain (0xf86FD6735f88d5b6aa709B357AD5Be22CEDf1A05)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Registry (0xFe81ab6930A30BdaE731fe7b6C6ABFbEAFc014a8)
    +++ description: None
```
