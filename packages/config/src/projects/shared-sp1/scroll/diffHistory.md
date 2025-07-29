Generated with discovered.json: 0xc86367918722f05b97296c1583005fb4cddd4f9e

# Diff at Mon, 14 Jul 2025 12:47:11 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@9f4300dad2f3d080cd56fa311d4a848556c74e72 block: 17075744
- current block number: 17075744

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 17075744 (main branch discovery), not current.

```diff
    contract SP1Verifier (0x0459d576A6223fEeA177Fb3DF53C9c77BF84C459) {
    +++ description: Verifier contract for SP1 proofs (v5.0.0).
      address:
-        "0x0459d576A6223fEeA177Fb3DF53C9c77BF84C459"
+        "scr:0x0459d576A6223fEeA177Fb3DF53C9c77BF84C459"
      implementationNames.0x0459d576A6223fEeA177Fb3DF53C9c77BF84C459:
-        "SP1Verifier"
      implementationNames.scr:0x0459d576A6223fEeA177Fb3DF53C9c77BF84C459:
+        "SP1Verifier"
    }
```

```diff
    contract SP1VerifierGateway (0x3B6041173B80E77f038f3F2C0f9744f04837185e) {
    +++ description: This contract is the router for zk proof verification. It stores the mapping between identifiers and the address of onchain verifier contracts, routing each identifier to the corresponding verifier contract.
      address:
-        "0x3B6041173B80E77f038f3F2C0f9744f04837185e"
+        "scr:0x3B6041173B80E77f038f3F2C0f9744f04837185e"
      values.activeVerifiers.0.verifier:
-        "0x0459d576A6223fEeA177Fb3DF53C9c77BF84C459"
+        "scr:0x0459d576A6223fEeA177Fb3DF53C9c77BF84C459"
      values.allVerifiers.0.verifier:
-        "0x331b350dDA287d0A65ce43103984CD44cb4Da9f0"
+        "scr:0x331b350dDA287d0A65ce43103984CD44cb4Da9f0"
      values.allVerifiers.1.verifier:
-        "0xfE2bb0Ad7F2c44Bd1289234Af08aD6FDEC0d54a2"
+        "scr:0xfE2bb0Ad7F2c44Bd1289234Af08aD6FDEC0d54a2"
      values.allVerifiers.2.verifier:
-        "0x36B353776AF6EF3A2bD707049e783F52c4209017"
+        "scr:0x36B353776AF6EF3A2bD707049e783F52c4209017"
      values.allVerifiers.3.verifier:
-        "0xc350F063C13a3Ca21331610fe159E697a5c9c2FB"
+        "scr:0xc350F063C13a3Ca21331610fe159E697a5c9c2FB"
      values.allVerifiers.4.verifier:
-        "0x5072B31595B579dDFE3e88Ddb953ef7618FcB58E"
+        "scr:0x5072B31595B579dDFE3e88Ddb953ef7618FcB58E"
      values.allVerifiers.5.verifier:
-        "0x6B6A7Ded061567d8A56279801DEA5cFB79be5bFc"
+        "scr:0x6B6A7Ded061567d8A56279801DEA5cFB79be5bFc"
      values.allVerifiers.6.verifier:
-        "0xaeE21CeadF7A03b3034DAE4f190bFE5F861b6ebf"
+        "scr:0xaeE21CeadF7A03b3034DAE4f190bFE5F861b6ebf"
      values.allVerifiers.7.verifier:
-        "0x6A87EFd4e6B2Db1ed73129A8b9c51aaA583d49e3"
+        "scr:0x6A87EFd4e6B2Db1ed73129A8b9c51aaA583d49e3"
      values.allVerifiers.8.verifier:
-        "0xd2832Cf1fC8bA210FfABF62Db9A8781153131d16"
+        "scr:0xd2832Cf1fC8bA210FfABF62Db9A8781153131d16"
      values.allVerifiers.9.verifier:
-        "0xE00a3cBFC45241b33c0A44C78e26168CBc55EC63"
+        "scr:0xE00a3cBFC45241b33c0A44C78e26168CBc55EC63"
      values.allVerifiers.10.verifier:
-        "0x0459d576A6223fEeA177Fb3DF53C9c77BF84C459"
+        "scr:0x0459d576A6223fEeA177Fb3DF53C9c77BF84C459"
      values.owner:
-        "0xCafEf00d348Adbd57c37d1B77e0619C6244C6878"
+        "scr:0xCafEf00d348Adbd57c37d1B77e0619C6244C6878"
      implementationNames.0x3B6041173B80E77f038f3F2C0f9744f04837185e:
-        "SP1VerifierGateway"
      implementationNames.scr:0x3B6041173B80E77f038f3F2C0f9744f04837185e:
+        "SP1VerifierGateway"
    }
```

```diff
    EOA  (0x72Ff26D9517324eEFA89A48B75c5df41132c4f54) {
    +++ description: None
      address:
-        "0x72Ff26D9517324eEFA89A48B75c5df41132c4f54"
+        "scr:0x72Ff26D9517324eEFA89A48B75c5df41132c4f54"
    }
```

```diff
    EOA  (0x9395e83720bf2D8ac6435f9c520b48E289Cb8885) {
    +++ description: None
      address:
-        "0x9395e83720bf2D8ac6435f9c520b48E289Cb8885"
+        "scr:0x9395e83720bf2D8ac6435f9c520b48E289Cb8885"
    }
```

```diff
    EOA  (0xBaB2c2aF5b91695e65955DA60d63aD1b2aE81126) {
    +++ description: None
      address:
-        "0xBaB2c2aF5b91695e65955DA60d63aD1b2aE81126"
+        "scr:0xBaB2c2aF5b91695e65955DA60d63aD1b2aE81126"
    }
```

```diff
    contract SP1VerifierGatewayMultisig (0xCafEf00d348Adbd57c37d1B77e0619C6244C6878) {
    +++ description: None
      address:
-        "0xCafEf00d348Adbd57c37d1B77e0619C6244C6878"
+        "scr:0xCafEf00d348Adbd57c37d1B77e0619C6244C6878"
      values.$implementation:
-        "0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552"
+        "scr:0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552"
      values.$members.0:
-        "0xBaB2c2aF5b91695e65955DA60d63aD1b2aE81126"
+        "scr:0xBaB2c2aF5b91695e65955DA60d63aD1b2aE81126"
      values.$members.1:
-        "0x72Ff26D9517324eEFA89A48B75c5df41132c4f54"
+        "scr:0x72Ff26D9517324eEFA89A48B75c5df41132c4f54"
      values.$members.2:
-        "0x9395e83720bf2D8ac6435f9c520b48E289Cb8885"
+        "scr:0x9395e83720bf2D8ac6435f9c520b48E289Cb8885"
      implementationNames.0xCafEf00d348Adbd57c37d1B77e0619C6244C6878:
-        "GnosisSafeProxy"
      implementationNames.0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552:
-        "GnosisSafe"
      implementationNames.scr:0xCafEf00d348Adbd57c37d1B77e0619C6244C6878:
+        "GnosisSafeProxy"
      implementationNames.scr:0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552:
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

Generated with discovered.json: 0x2e479474899967d49527a59e6d7377a328fbd831

# Diff at Wed, 09 Jul 2025 15:09:45 GMT:

- author: Sergey Shemyakov (<sergeyshemyakov@gmx.de>)
- current block number: 17075744

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
