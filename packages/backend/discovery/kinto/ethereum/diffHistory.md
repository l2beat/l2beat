Generated with discovered.json: 0xde2ec97cef46aa343bb68c1f4502bc456eb92530

# Diff at Thu, 14 Mar 2024 10:04:24 GMT:

- author: sekuba (<sekuba@users.noreply.github.com>)
- comparing to: main@24c5721630392f8b6f59093376472db03d18b2c2 block: 19339792
- current block number: 19432536

## Description

Provide description of changes. This section will be preserved.

## Watched changes

```diff
    contract GnosisSafe (0x17Eb10e12a78f986C78F973Fc70eD88072B33B7d) {
    +++ description: None
      values.nonce:
-        2
+        3
    }
```

```diff
    contract RollupProxy (0x5073dA9cA4810f3E0aA01c20c7d9d02C3f522e11) {
    +++ description: None
      values.wasmModuleRoot:
-        "0x1024d5971f781dd930c46b5fb6fb571e6af9f31b5dc191b82e82036c207cc968"
+        "0xd2d42f1e7b5ea262991c3fd1fc7ed3dde4b21c28d3a7edec49f7c4fb51c03f73"
      errors.validators:
-        "processing response error (body=\"{\\\"id\\\":44,\\\"error\\\":{\\\"code\\\":-32001,\\\"message\\\":\\\"rpc method is not whitelisted\\\"},\\\"jsonrpc\\\":\\\"2.0\\\"}\\n\", error={\"code\":-32001}, requestBody=\"{\\\"method\\\":\\\"debug_traceTransaction\\\",\\\"params\\\":[\\\"0xd51bb4d6150d5fbaa61cf5281598b18c4efba4284aecb4420fc8d834dba357d8\\\",{\\\"tracer\\\":\\\"callTracer\\\"}],\\\"id\\\":44,\\\"jsonrpc\\\":\\\"2.0\\\"}\", requestMethod=\"POST\", url=\"https://rpc.flashbots.net\", code=SERVER_ERROR, version=web/5.7.1)"
+        "processing response error (body=\"{\\\"id\\\":184,\\\"error\\\":{\\\"code\\\":-32001,\\\"message\\\":\\\"rpc method is not whitelisted\\\"},\\\"jsonrpc\\\":\\\"2.0\\\"}\\n\", error={\"code\":-32001}, requestBody=\"{\\\"method\\\":\\\"debug_traceTransaction\\\",\\\"params\\\":[\\\"0xd51bb4d6150d5fbaa61cf5281598b18c4efba4284aecb4420fc8d834dba357d8\\\",{\\\"tracer\\\":\\\"callTracer\\\"}],\\\"id\\\":184,\\\"jsonrpc\\\":\\\"2.0\\\"}\", requestMethod=\"POST\", url=\"https://rpc.flashbots.net\", code=SERVER_ERROR, version=web/5.7.1)"
    }
```

```diff
    contract SequencerInbox (0xF4Ef823D57819AC7202a081A5B49376BD28E7b3a) {
    +++ description: None
      errors.batchPosters:
-        "processing response error (body=\"{\\\"id\\\":43,\\\"error\\\":{\\\"code\\\":-32001,\\\"message\\\":\\\"rpc method is not whitelisted\\\"},\\\"jsonrpc\\\":\\\"2.0\\\"}\\n\", error={\"code\":-32001}, requestBody=\"{\\\"method\\\":\\\"debug_traceTransaction\\\",\\\"params\\\":[\\\"0xd51bb4d6150d5fbaa61cf5281598b18c4efba4284aecb4420fc8d834dba357d8\\\",{\\\"tracer\\\":\\\"callTracer\\\"}],\\\"id\\\":43,\\\"jsonrpc\\\":\\\"2.0\\\"}\", requestMethod=\"POST\", url=\"https://rpc.flashbots.net\", code=SERVER_ERROR, version=web/5.7.1)"
+        "processing response error (body=\"{\\\"id\\\":182,\\\"error\\\":{\\\"code\\\":-32001,\\\"message\\\":\\\"rpc method is not whitelisted\\\"},\\\"jsonrpc\\\":\\\"2.0\\\"}\\n\", error={\"code\":-32001}, requestBody=\"{\\\"method\\\":\\\"debug_traceTransaction\\\",\\\"params\\\":[\\\"0xd51bb4d6150d5fbaa61cf5281598b18c4efba4284aecb4420fc8d834dba357d8\\\",{\\\"tracer\\\":\\\"callTracer\\\"}],\\\"id\\\":182,\\\"jsonrpc\\\":\\\"2.0\\\"}\", requestMethod=\"POST\", url=\"https://rpc.flashbots.net\", code=SERVER_ERROR, version=web/5.7.1)"
    }
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19339792 (main branch discovery), not current.

```diff
    contract RollupProxy (0x5073dA9cA4810f3E0aA01c20c7d9d02C3f522e11) {
    +++ description: None
      values.validators:
-        ["0x64Cf65036a76E3827e448cadbc53D31EefDCE04a"]
      errors:
+        {"validators":"processing response error (body=\"{\\\"id\\\":44,\\\"error\\\":{\\\"code\\\":-32001,\\\"message\\\":\\\"rpc method is not whitelisted\\\"},\\\"jsonrpc\\\":\\\"2.0\\\"}\\n\", error={\"code\":-32001}, requestBody=\"{\\\"method\\\":\\\"debug_traceTransaction\\\",\\\"params\\\":[\\\"0xd51bb4d6150d5fbaa61cf5281598b18c4efba4284aecb4420fc8d834dba357d8\\\",{\\\"tracer\\\":\\\"callTracer\\\"}],\\\"id\\\":44,\\\"jsonrpc\\\":\\\"2.0\\\"}\", requestMethod=\"POST\", url=\"https://rpc.flashbots.net\", code=SERVER_ERROR, version=web/5.7.1)"}
    }
```

```diff
    contract SequencerInbox (0xF4Ef823D57819AC7202a081A5B49376BD28E7b3a) {
    +++ description: None
      values.batchPosters:
-        ["0xe27f3f6db6824def1738b2aACe2672aC59046a39"]
      errors:
+        {"batchPosters":"processing response error (body=\"{\\\"id\\\":43,\\\"error\\\":{\\\"code\\\":-32001,\\\"message\\\":\\\"rpc method is not whitelisted\\\"},\\\"jsonrpc\\\":\\\"2.0\\\"}\\n\", error={\"code\":-32001}, requestBody=\"{\\\"method\\\":\\\"debug_traceTransaction\\\",\\\"params\\\":[\\\"0xd51bb4d6150d5fbaa61cf5281598b18c4efba4284aecb4420fc8d834dba357d8\\\",{\\\"tracer\\\":\\\"callTracer\\\"}],\\\"id\\\":43,\\\"jsonrpc\\\":\\\"2.0\\\"}\", requestMethod=\"POST\", url=\"https://rpc.flashbots.net\", code=SERVER_ERROR, version=web/5.7.1)"}
    }
```

Generated with discovered.json: 0x6bf630000a540615c26b6e131a88c1214fde842c

# Diff at Fri, 01 Mar 2024 10:41:16 GMT:

- author: Bartek Kiepuszewski (<bkiepuszewski@gmail.com>)
- current block number: 19339792

## Description

Provide description of changes. This section will be preserved.

## Initial discovery

```diff
+   Status: CREATED
    contract OneStepProofEntry (0x09824fe72BFF474d16D9c2774432E381BBD60662) {
    }
```

```diff
+   Status: CREATED
    contract GnosisSafe (0x17Eb10e12a78f986C78F973Fc70eD88072B33B7d) {
    }
```

```diff
+   Status: CREATED
    contract  (0x27C7Bfd2cC11429e9b80c443b42FDBe4754F6c91) {
    }
```

```diff
+   Status: CREATED
    contract ValidatorUtils (0x2b0E04Dc90e3fA58165CB41E2834B44A56E766aF) {
    }
```

```diff
+   Status: CREATED
    contract OneStepProverMemory (0x4811500e0d376Fa8d2EA3CCb7c61E0afB4F5A7f1) {
    }
```

```diff
+   Status: CREATED
    contract RollupProxy (0x5073dA9cA4810f3E0aA01c20c7d9d02C3f522e11) {
    }
```

```diff
+   Status: CREATED
    contract RollupEventInbox (0x52EcE832AF3DF3125BbfD6423E0425dB3fA99D3F) {
    }
```

```diff
+   Status: CREATED
    contract UpgradeExecutor (0x59B851c8b1643e0735Ec3F2f0e528f3d89c3408a) {
    }
```

```diff
+   Status: CREATED
    contract ChallengeManager (0x6228e2FB8C561f1a5A963039Bc38Eb6D539A1A7F) {
    }
```

```diff
+   Status: CREATED
    contract Outbox (0x655761AD5FC251F414D6993A73184B0669F278c8) {
    }
```

```diff
+   Status: CREATED
    contract ProxyAdmin (0x74C717C01425eb475A5fC55d2A4a9045fC9800df) {
    }
```

```diff
+   Status: CREATED
    contract Bridge (0x859a53Fe2C8DA961387030E7CB498D6D20d0B2DB) {
    }
```

```diff
+   Status: CREATED
    contract OneStepProverMath (0x89AF7C4C2198c426cFe6E86de0680A0850503e06) {
    }
```

```diff
+   Status: CREATED
    contract OneStepProverHostIo (0x99a2A31300816C1FA3f40818AC9280fe7271F878) {
    }
```

```diff
+   Status: CREATED
    contract ValidatorWalletCreator (0x9CAd81628aB7D8e239F1A5B497313341578c5F71) {
    }
```

```diff
+   Status: CREATED
    contract Inbox (0xBFfaA85c1756472fFC37e6D172A7eC0538C14474) {
    }
```

```diff
+   Status: CREATED
    contract OneStepProver0 (0xDf94F0474F205D086dbc2e66D69a856FCf520622) {
    }
```

```diff
+   Status: CREATED
    contract SequencerInbox (0xF4Ef823D57819AC7202a081A5B49376BD28E7b3a) {
    }
```
