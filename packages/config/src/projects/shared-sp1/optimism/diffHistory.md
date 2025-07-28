Generated with discovered.json: 0xcc91f7096f864190d671ca94d04fa209d40b48ac

# Diff at Mon, 14 Jul 2025 12:47:11 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@9f4300dad2f3d080cd56fa311d4a848556c74e72 block: 138237502
- current block number: 138237502

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 138237502 (main branch discovery), not current.

```diff
    contract SP1Verifier (0x0459d576A6223fEeA177Fb3DF53C9c77BF84C459) {
    +++ description: Verifier contract for SP1 proofs (v5.0.0).
      address:
-        "0x0459d576A6223fEeA177Fb3DF53C9c77BF84C459"
+        "oeth:0x0459d576A6223fEeA177Fb3DF53C9c77BF84C459"
      implementationNames.0x0459d576A6223fEeA177Fb3DF53C9c77BF84C459:
-        "SP1Verifier"
      implementationNames.oeth:0x0459d576A6223fEeA177Fb3DF53C9c77BF84C459:
+        "SP1Verifier"
    }
```

```diff
    contract SP1VerifierGateway (0x3B6041173B80E77f038f3F2C0f9744f04837185e) {
    +++ description: This contract is the router for zk proof verification. It stores the mapping between identifiers and the address of onchain verifier contracts, routing each identifier to the corresponding verifier contract.
      address:
-        "0x3B6041173B80E77f038f3F2C0f9744f04837185e"
+        "oeth:0x3B6041173B80E77f038f3F2C0f9744f04837185e"
      values.activeVerifiers.0.verifier:
-        "0x0459d576A6223fEeA177Fb3DF53C9c77BF84C459"
+        "oeth:0x0459d576A6223fEeA177Fb3DF53C9c77BF84C459"
      values.allVerifiers.0.verifier:
-        "0x6B6A7Ded061567d8A56279801DEA5cFB79be5bFc"
+        "oeth:0x6B6A7Ded061567d8A56279801DEA5cFB79be5bFc"
      values.allVerifiers.1.verifier:
-        "0x1764C29FBd94865198588f10FC75D4f6636d158d"
+        "oeth:0x1764C29FBd94865198588f10FC75D4f6636d158d"
      values.allVerifiers.2.verifier:
-        "0x6A87EFd4e6B2Db1ed73129A8b9c51aaA583d49e3"
+        "oeth:0x6A87EFd4e6B2Db1ed73129A8b9c51aaA583d49e3"
      values.allVerifiers.3.verifier:
-        "0xd2832Cf1fC8bA210FfABF62Db9A8781153131d16"
+        "oeth:0xd2832Cf1fC8bA210FfABF62Db9A8781153131d16"
      values.allVerifiers.4.verifier:
-        "0xE00a3cBFC45241b33c0A44C78e26168CBc55EC63"
+        "oeth:0xE00a3cBFC45241b33c0A44C78e26168CBc55EC63"
      values.allVerifiers.5.verifier:
-        "0x0459d576A6223fEeA177Fb3DF53C9c77BF84C459"
+        "oeth:0x0459d576A6223fEeA177Fb3DF53C9c77BF84C459"
      values.owner:
-        "0xCafEf00d348Adbd57c37d1B77e0619C6244C6878"
+        "oeth:0xCafEf00d348Adbd57c37d1B77e0619C6244C6878"
      implementationNames.0x3B6041173B80E77f038f3F2C0f9744f04837185e:
-        "SP1VerifierGateway"
      implementationNames.oeth:0x3B6041173B80E77f038f3F2C0f9744f04837185e:
+        "SP1VerifierGateway"
    }
```

```diff
    EOA  (0x72Ff26D9517324eEFA89A48B75c5df41132c4f54) {
    +++ description: None
      address:
-        "0x72Ff26D9517324eEFA89A48B75c5df41132c4f54"
+        "oeth:0x72Ff26D9517324eEFA89A48B75c5df41132c4f54"
    }
```

```diff
    EOA  (0x9395e83720bf2D8ac6435f9c520b48E289Cb8885) {
    +++ description: None
      address:
-        "0x9395e83720bf2D8ac6435f9c520b48E289Cb8885"
+        "oeth:0x9395e83720bf2D8ac6435f9c520b48E289Cb8885"
    }
```

```diff
    EOA  (0xBaB2c2aF5b91695e65955DA60d63aD1b2aE81126) {
    +++ description: None
      address:
-        "0xBaB2c2aF5b91695e65955DA60d63aD1b2aE81126"
+        "oeth:0xBaB2c2aF5b91695e65955DA60d63aD1b2aE81126"
    }
```

```diff
    contract SP1VerifierGatewayMultisig (0xCafEf00d348Adbd57c37d1B77e0619C6244C6878) {
    +++ description: None
      address:
-        "0xCafEf00d348Adbd57c37d1B77e0619C6244C6878"
+        "oeth:0xCafEf00d348Adbd57c37d1B77e0619C6244C6878"
      values.$implementation:
-        "0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552"
+        "oeth:0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552"
      values.$members.0:
-        "0xBaB2c2aF5b91695e65955DA60d63aD1b2aE81126"
+        "oeth:0xBaB2c2aF5b91695e65955DA60d63aD1b2aE81126"
      values.$members.1:
-        "0x72Ff26D9517324eEFA89A48B75c5df41132c4f54"
+        "oeth:0x72Ff26D9517324eEFA89A48B75c5df41132c4f54"
      values.$members.2:
-        "0x9395e83720bf2D8ac6435f9c520b48E289Cb8885"
+        "oeth:0x9395e83720bf2D8ac6435f9c520b48E289Cb8885"
      implementationNames.0xCafEf00d348Adbd57c37d1B77e0619C6244C6878:
-        "GnosisSafeProxy"
      implementationNames.0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552:
-        "GnosisSafe"
      implementationNames.oeth:0xCafEf00d348Adbd57c37d1B77e0619C6244C6878:
+        "GnosisSafeProxy"
      implementationNames.oeth:0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552:
+        "GnosisSafe"
    }
```

```diff
+   Status: CREATED
    contract SP1Verifier (0x0459d576A6223fEeA177Fb3DF53C9c77BF84C459)
    +++ description: Verifier contract for SP1 proofs (v5.0.0).
```

```diff
+   Status: CREATED
    contract SP1VerifierGateway (0x3B6041173B80E77f038f3F2C0f9744f04837185e)
    +++ description: This contract is the router for zk proof verification. It stores the mapping between identifiers and the address of onchain verifier contracts, routing each identifier to the corresponding verifier contract.
```

```diff
+   Status: CREATED
    contract SP1VerifierGatewayMultisig (0xCafEf00d348Adbd57c37d1B77e0619C6244C6878)
    +++ description: None
```

Generated with discovered.json: 0xb59b2ef6eee3de7fd6b0df7f032bd08e3c5cbecc

# Diff at Wed, 09 Jul 2025 15:09:45 GMT:

- author: Sergey Shemyakov (<sergeyshemyakov@gmx.de>)
- current block number: 138237502

## Description

Provide description of changes. This section will be preserved.

## Initial discovery

```diff
+   Status: CREATED
    contract SP1Verifier (0x0459d576A6223fEeA177Fb3DF53C9c77BF84C459)
    +++ description: Verifier contract for SP1 proofs (v5.0.0).
```

```diff
+   Status: CREATED
    contract SP1VerifierGateway (0x3B6041173B80E77f038f3F2C0f9744f04837185e)
    +++ description: This contract is the router for zk proof verification. It stores the mapping between identifiers and the address of onchain verifier contracts, routing each identifier to the corresponding verifier contract.
```

```diff
+   Status: CREATED
    contract SP1VerifierGatewayMultisig (0xCafEf00d348Adbd57c37d1B77e0619C6244C6878)
    +++ description: None
```
