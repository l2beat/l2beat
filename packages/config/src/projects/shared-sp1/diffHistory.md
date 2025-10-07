Generated with discovered.json: 0xd14a6223b928bb22bfb028fc3f2f413dda188e55

# Diff at Tue, 16 Sep 2025 14:35:10 GMT:

- author: Sergey Shemyakov (<sergey.shemyakov@l2beat.com>)
- comparing to: main@788220608af88f1041aa4ba3b574ca2667bb6047 block: 1752073781
- current timestamp: 1752073781

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 1752073781 (main branch discovery), not current.

```diff
-   Status: DELETED
    contract SP1Verifier (oeth:0x0459d576A6223fEeA177Fb3DF53C9c77BF84C459)
    +++ description: Verifier contract for SP1 proofs (v5.0.0).
```

```diff
-   Status: DELETED
    contract SP1VerifierGateway (oeth:0x3B6041173B80E77f038f3F2C0f9744f04837185e)
    +++ description: This contract is the router for zk proof verification. It stores the mapping between identifiers and the address of onchain verifier contracts, routing each identifier to the corresponding verifier contract.
```

```diff
-   Status: DELETED
    contract SP1VerifierGatewayMultisig (oeth:0xCafEf00d348Adbd57c37d1B77e0619C6244C6878)
    +++ description: None
```

```diff
-   Status: DELETED
    contract SP1Verifier (scr:0x0459d576A6223fEeA177Fb3DF53C9c77BF84C459)
    +++ description: Verifier contract for SP1 proofs (v5.0.0).
```

```diff
-   Status: DELETED
    contract SP1VerifierGateway (scr:0x3B6041173B80E77f038f3F2C0f9744f04837185e)
    +++ description: This contract is the router for zk proof verification. It stores the mapping between identifiers and the address of onchain verifier contracts, routing each identifier to the corresponding verifier contract.
```

```diff
-   Status: DELETED
    contract SP1VerifierGatewayMultisig (scr:0xCafEf00d348Adbd57c37d1B77e0619C6244C6878)
    +++ description: None
```

Generated with discovered.json: 0xf20d5273ed3d8acc81301b254d511eb1e45f7b66

# Diff at Mon, 01 Sep 2025 10:01:10 GMT:

Merge mark

Generated with discovered.json: 0x406edddce089b3b27df30450f555fcd3dc2adedd

# Diff at Mon, 14 Jul 2025 12:47:11 GMT:

- chain: optimism
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

Generated with discovered.json: 0x9b9b0b72fa13ee0e212b3080501afbc3eb276f91

# Diff at Mon, 14 Jul 2025 12:47:11 GMT:

- chain: scroll
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

Generated with discovered.json: 0xb78a957a504b951d44417ca4b686ce6ebeb0ad88

# Diff at Mon, 14 Jul 2025 12:47:11 GMT:

- chain: arbitrum
- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@9f4300dad2f3d080cd56fa311d4a848556c74e72 block: 355918538
- current block number: 355918538

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 355918538 (main branch discovery), not current.

```diff
    contract SP1Verifier (0x0459d576A6223fEeA177Fb3DF53C9c77BF84C459) {
    +++ description: Verifier contract for SP1 proofs (v5.0.0).
      address:
-        "0x0459d576A6223fEeA177Fb3DF53C9c77BF84C459"
+        "arb1:0x0459d576A6223fEeA177Fb3DF53C9c77BF84C459"
      implementationNames.0x0459d576A6223fEeA177Fb3DF53C9c77BF84C459:
-        "SP1Verifier"
      implementationNames.arb1:0x0459d576A6223fEeA177Fb3DF53C9c77BF84C459:
+        "SP1Verifier"
    }
```

```diff
    contract SP1VerifierGateway (0x3B6041173B80E77f038f3F2C0f9744f04837185e) {
    +++ description: This contract is the router for zk proof verification. It stores the mapping between identifiers and the address of onchain verifier contracts, routing each identifier to the corresponding verifier contract.
      address:
-        "0x3B6041173B80E77f038f3F2C0f9744f04837185e"
+        "arb1:0x3B6041173B80E77f038f3F2C0f9744f04837185e"
      values.activeVerifiers.0.verifier:
-        "0x0459d576A6223fEeA177Fb3DF53C9c77BF84C459"
+        "arb1:0x0459d576A6223fEeA177Fb3DF53C9c77BF84C459"
      values.allVerifiers.0.verifier:
-        "0x331b350dDA287d0A65ce43103984CD44cb4Da9f0"
+        "arb1:0x331b350dDA287d0A65ce43103984CD44cb4Da9f0"
      values.allVerifiers.1.verifier:
-        "0xfE2bb0Ad7F2c44Bd1289234Af08aD6FDEC0d54a2"
+        "arb1:0xfE2bb0Ad7F2c44Bd1289234Af08aD6FDEC0d54a2"
      values.allVerifiers.2.verifier:
-        "0x36B353776AF6EF3A2bD707049e783F52c4209017"
+        "arb1:0x36B353776AF6EF3A2bD707049e783F52c4209017"
      values.allVerifiers.3.verifier:
-        "0xc350F063C13a3Ca21331610fe159E697a5c9c2FB"
+        "arb1:0xc350F063C13a3Ca21331610fe159E697a5c9c2FB"
      values.allVerifiers.4.verifier:
-        "0x6B6A7Ded061567d8A56279801DEA5cFB79be5bFc"
+        "arb1:0x6B6A7Ded061567d8A56279801DEA5cFB79be5bFc"
      values.allVerifiers.5.verifier:
-        "0x1764C29FBd94865198588f10FC75D4f6636d158d"
+        "arb1:0x1764C29FBd94865198588f10FC75D4f6636d158d"
      values.allVerifiers.6.verifier:
-        "0x6A87EFd4e6B2Db1ed73129A8b9c51aaA583d49e3"
+        "arb1:0x6A87EFd4e6B2Db1ed73129A8b9c51aaA583d49e3"
      values.allVerifiers.7.verifier:
-        "0xd2832Cf1fC8bA210FfABF62Db9A8781153131d16"
+        "arb1:0xd2832Cf1fC8bA210FfABF62Db9A8781153131d16"
      values.allVerifiers.8.verifier:
-        "0xE00a3cBFC45241b33c0A44C78e26168CBc55EC63"
+        "arb1:0xE00a3cBFC45241b33c0A44C78e26168CBc55EC63"
      values.allVerifiers.9.verifier:
-        "0x0459d576A6223fEeA177Fb3DF53C9c77BF84C459"
+        "arb1:0x0459d576A6223fEeA177Fb3DF53C9c77BF84C459"
      values.owner:
-        "0xCafEf00d348Adbd57c37d1B77e0619C6244C6878"
+        "arb1:0xCafEf00d348Adbd57c37d1B77e0619C6244C6878"
      implementationNames.0x3B6041173B80E77f038f3F2C0f9744f04837185e:
-        "SP1VerifierGateway"
      implementationNames.arb1:0x3B6041173B80E77f038f3F2C0f9744f04837185e:
+        "SP1VerifierGateway"
    }
```

```diff
    EOA  (0x72Ff26D9517324eEFA89A48B75c5df41132c4f54) {
    +++ description: None
      address:
-        "0x72Ff26D9517324eEFA89A48B75c5df41132c4f54"
+        "arb1:0x72Ff26D9517324eEFA89A48B75c5df41132c4f54"
    }
```

```diff
    EOA  (0x9395e83720bf2D8ac6435f9c520b48E289Cb8885) {
    +++ description: None
      address:
-        "0x9395e83720bf2D8ac6435f9c520b48E289Cb8885"
+        "arb1:0x9395e83720bf2D8ac6435f9c520b48E289Cb8885"
    }
```

```diff
    EOA  (0xBaB2c2aF5b91695e65955DA60d63aD1b2aE81126) {
    +++ description: None
      address:
-        "0xBaB2c2aF5b91695e65955DA60d63aD1b2aE81126"
+        "arb1:0xBaB2c2aF5b91695e65955DA60d63aD1b2aE81126"
    }
```

```diff
    contract SP1VerifierGatewayMultisig (0xCafEf00d348Adbd57c37d1B77e0619C6244C6878) {
    +++ description: None
      address:
-        "0xCafEf00d348Adbd57c37d1B77e0619C6244C6878"
+        "arb1:0xCafEf00d348Adbd57c37d1B77e0619C6244C6878"
      values.$implementation:
-        "0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552"
+        "arb1:0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552"
      values.$members.0:
-        "0xBaB2c2aF5b91695e65955DA60d63aD1b2aE81126"
+        "arb1:0xBaB2c2aF5b91695e65955DA60d63aD1b2aE81126"
      values.$members.1:
-        "0x72Ff26D9517324eEFA89A48B75c5df41132c4f54"
+        "arb1:0x72Ff26D9517324eEFA89A48B75c5df41132c4f54"
      values.$members.2:
-        "0x9395e83720bf2D8ac6435f9c520b48E289Cb8885"
+        "arb1:0x9395e83720bf2D8ac6435f9c520b48E289Cb8885"
      implementationNames.0xCafEf00d348Adbd57c37d1B77e0619C6244C6878:
-        "GnosisSafeProxy"
      implementationNames.0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552:
-        "GnosisSafe"
      implementationNames.arb1:0xCafEf00d348Adbd57c37d1B77e0619C6244C6878:
+        "GnosisSafeProxy"
      implementationNames.arb1:0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552:
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

Generated with discovered.json: 0xcfeb09eed1b263b01df920672a1a39c58be6082d

# Diff at Mon, 14 Jul 2025 12:47:11 GMT:

- chain: base
- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@9f4300dad2f3d080cd56fa311d4a848556c74e72 block: 32642215
- current block number: 32642215

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 32642215 (main branch discovery), not current.

```diff
    contract SP1Verifier (0x0459d576A6223fEeA177Fb3DF53C9c77BF84C459) {
    +++ description: Verifier contract for SP1 proofs (v5.0.0).
      address:
-        "0x0459d576A6223fEeA177Fb3DF53C9c77BF84C459"
+        "base:0x0459d576A6223fEeA177Fb3DF53C9c77BF84C459"
      implementationNames.0x0459d576A6223fEeA177Fb3DF53C9c77BF84C459:
-        "SP1Verifier"
      implementationNames.base:0x0459d576A6223fEeA177Fb3DF53C9c77BF84C459:
+        "SP1Verifier"
    }
```

```diff
    contract SP1VerifierGateway (0x3B6041173B80E77f038f3F2C0f9744f04837185e) {
    +++ description: This contract is the router for zk proof verification. It stores the mapping between identifiers and the address of onchain verifier contracts, routing each identifier to the corresponding verifier contract.
      address:
-        "0x3B6041173B80E77f038f3F2C0f9744f04837185e"
+        "base:0x3B6041173B80E77f038f3F2C0f9744f04837185e"
      values.activeVerifiers.0.verifier:
-        "0x0459d576A6223fEeA177Fb3DF53C9c77BF84C459"
+        "base:0x0459d576A6223fEeA177Fb3DF53C9c77BF84C459"
      values.allVerifiers.0.verifier:
-        "0x331b350dDA287d0A65ce43103984CD44cb4Da9f0"
+        "base:0x331b350dDA287d0A65ce43103984CD44cb4Da9f0"
      values.allVerifiers.1.verifier:
-        "0xfE2bb0Ad7F2c44Bd1289234Af08aD6FDEC0d54a2"
+        "base:0xfE2bb0Ad7F2c44Bd1289234Af08aD6FDEC0d54a2"
      values.allVerifiers.2.verifier:
-        "0x36B353776AF6EF3A2bD707049e783F52c4209017"
+        "base:0x36B353776AF6EF3A2bD707049e783F52c4209017"
      values.allVerifiers.3.verifier:
-        "0xc350F063C13a3Ca21331610fe159E697a5c9c2FB"
+        "base:0xc350F063C13a3Ca21331610fe159E697a5c9c2FB"
      values.allVerifiers.4.verifier:
-        "0x6B6A7Ded061567d8A56279801DEA5cFB79be5bFc"
+        "base:0x6B6A7Ded061567d8A56279801DEA5cFB79be5bFc"
      values.allVerifiers.5.verifier:
-        "0x1764C29FBd94865198588f10FC75D4f6636d158d"
+        "base:0x1764C29FBd94865198588f10FC75D4f6636d158d"
      values.allVerifiers.6.verifier:
-        "0x6A87EFd4e6B2Db1ed73129A8b9c51aaA583d49e3"
+        "base:0x6A87EFd4e6B2Db1ed73129A8b9c51aaA583d49e3"
      values.allVerifiers.7.verifier:
-        "0xd2832Cf1fC8bA210FfABF62Db9A8781153131d16"
+        "base:0xd2832Cf1fC8bA210FfABF62Db9A8781153131d16"
      values.allVerifiers.8.verifier:
-        "0xE00a3cBFC45241b33c0A44C78e26168CBc55EC63"
+        "base:0xE00a3cBFC45241b33c0A44C78e26168CBc55EC63"
      values.allVerifiers.9.verifier:
-        "0x0459d576A6223fEeA177Fb3DF53C9c77BF84C459"
+        "base:0x0459d576A6223fEeA177Fb3DF53C9c77BF84C459"
      values.owner:
-        "0xCafEf00d348Adbd57c37d1B77e0619C6244C6878"
+        "base:0xCafEf00d348Adbd57c37d1B77e0619C6244C6878"
      implementationNames.0x3B6041173B80E77f038f3F2C0f9744f04837185e:
-        "SP1VerifierGateway"
      implementationNames.base:0x3B6041173B80E77f038f3F2C0f9744f04837185e:
+        "SP1VerifierGateway"
    }
```

```diff
    EOA  (0x72Ff26D9517324eEFA89A48B75c5df41132c4f54) {
    +++ description: None
      address:
-        "0x72Ff26D9517324eEFA89A48B75c5df41132c4f54"
+        "base:0x72Ff26D9517324eEFA89A48B75c5df41132c4f54"
    }
```

```diff
    EOA  (0x9395e83720bf2D8ac6435f9c520b48E289Cb8885) {
    +++ description: None
      address:
-        "0x9395e83720bf2D8ac6435f9c520b48E289Cb8885"
+        "base:0x9395e83720bf2D8ac6435f9c520b48E289Cb8885"
    }
```

```diff
    EOA  (0xBaB2c2aF5b91695e65955DA60d63aD1b2aE81126) {
    +++ description: None
      address:
-        "0xBaB2c2aF5b91695e65955DA60d63aD1b2aE81126"
+        "base:0xBaB2c2aF5b91695e65955DA60d63aD1b2aE81126"
    }
```

```diff
    contract SP1VerifierGatewayMultisig (0xCafEf00d348Adbd57c37d1B77e0619C6244C6878) {
    +++ description: None
      address:
-        "0xCafEf00d348Adbd57c37d1B77e0619C6244C6878"
+        "base:0xCafEf00d348Adbd57c37d1B77e0619C6244C6878"
      values.$implementation:
-        "0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552"
+        "base:0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552"
      values.$members.0:
-        "0xBaB2c2aF5b91695e65955DA60d63aD1b2aE81126"
+        "base:0xBaB2c2aF5b91695e65955DA60d63aD1b2aE81126"
      values.$members.1:
-        "0x72Ff26D9517324eEFA89A48B75c5df41132c4f54"
+        "base:0x72Ff26D9517324eEFA89A48B75c5df41132c4f54"
      values.$members.2:
-        "0x9395e83720bf2D8ac6435f9c520b48E289Cb8885"
+        "base:0x9395e83720bf2D8ac6435f9c520b48E289Cb8885"
      implementationNames.0xCafEf00d348Adbd57c37d1B77e0619C6244C6878:
-        "GnosisSafeProxy"
      implementationNames.0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552:
-        "GnosisSafe"
      implementationNames.base:0xCafEf00d348Adbd57c37d1B77e0619C6244C6878:
+        "GnosisSafeProxy"
      implementationNames.base:0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552:
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

Generated with discovered.json: 0x091d1a006871cad23b43f37f1a79915140d7f864

# Diff at Mon, 14 Jul 2025 12:47:11 GMT:

- chain: ethereum
- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@9f4300dad2f3d080cd56fa311d4a848556c74e72 block: 22882427
- current block number: 22882427

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22882427 (main branch discovery), not current.

```diff
    contract SP1Verifier (0x0459d576A6223fEeA177Fb3DF53C9c77BF84C459) {
    +++ description: Verifier contract for SP1 proofs (v5.0.0).
      address:
-        "0x0459d576A6223fEeA177Fb3DF53C9c77BF84C459"
+        "eth:0x0459d576A6223fEeA177Fb3DF53C9c77BF84C459"
      implementationNames.0x0459d576A6223fEeA177Fb3DF53C9c77BF84C459:
-        "SP1Verifier"
      implementationNames.eth:0x0459d576A6223fEeA177Fb3DF53C9c77BF84C459:
+        "SP1Verifier"
    }
```

```diff
    contract SP1VerifierGateway (0x3B6041173B80E77f038f3F2C0f9744f04837185e) {
    +++ description: This contract is the router for zk proof verification. It stores the mapping between identifiers and the address of onchain verifier contracts, routing each identifier to the corresponding verifier contract.
      address:
-        "0x3B6041173B80E77f038f3F2C0f9744f04837185e"
+        "eth:0x3B6041173B80E77f038f3F2C0f9744f04837185e"
      values.activeVerifiers.0.verifier:
-        "0x0459d576A6223fEeA177Fb3DF53C9c77BF84C459"
+        "eth:0x0459d576A6223fEeA177Fb3DF53C9c77BF84C459"
      values.allVerifiers.0.verifier:
-        "0xfE2bb0Ad7F2c44Bd1289234Af08aD6FDEC0d54a2"
+        "eth:0xfE2bb0Ad7F2c44Bd1289234Af08aD6FDEC0d54a2"
      values.allVerifiers.1.verifier:
-        "0x331b350dDA287d0A65ce43103984CD44cb4Da9f0"
+        "eth:0x331b350dDA287d0A65ce43103984CD44cb4Da9f0"
      values.allVerifiers.2.verifier:
-        "0x36B353776AF6EF3A2bD707049e783F52c4209017"
+        "eth:0x36B353776AF6EF3A2bD707049e783F52c4209017"
      values.allVerifiers.3.verifier:
-        "0xc350F063C13a3Ca21331610fe159E697a5c9c2FB"
+        "eth:0xc350F063C13a3Ca21331610fe159E697a5c9c2FB"
      values.allVerifiers.4.verifier:
-        "0x6B6A7Ded061567d8A56279801DEA5cFB79be5bFc"
+        "eth:0x6B6A7Ded061567d8A56279801DEA5cFB79be5bFc"
      values.allVerifiers.5.verifier:
-        "0x1764C29FBd94865198588f10FC75D4f6636d158d"
+        "eth:0x1764C29FBd94865198588f10FC75D4f6636d158d"
      values.allVerifiers.6.verifier:
-        "0x6A87EFd4e6B2Db1ed73129A8b9c51aaA583d49e3"
+        "eth:0x6A87EFd4e6B2Db1ed73129A8b9c51aaA583d49e3"
      values.allVerifiers.7.verifier:
-        "0xd2832Cf1fC8bA210FfABF62Db9A8781153131d16"
+        "eth:0xd2832Cf1fC8bA210FfABF62Db9A8781153131d16"
      values.allVerifiers.8.verifier:
-        "0xE00a3cBFC45241b33c0A44C78e26168CBc55EC63"
+        "eth:0xE00a3cBFC45241b33c0A44C78e26168CBc55EC63"
      values.allVerifiers.9.verifier:
-        "0x0459d576A6223fEeA177Fb3DF53C9c77BF84C459"
+        "eth:0x0459d576A6223fEeA177Fb3DF53C9c77BF84C459"
      values.owner:
-        "0xCafEf00d348Adbd57c37d1B77e0619C6244C6878"
+        "eth:0xCafEf00d348Adbd57c37d1B77e0619C6244C6878"
      implementationNames.0x3B6041173B80E77f038f3F2C0f9744f04837185e:
-        "SP1VerifierGateway"
      implementationNames.eth:0x3B6041173B80E77f038f3F2C0f9744f04837185e:
+        "SP1VerifierGateway"
    }
```

```diff
    EOA  (0x72Ff26D9517324eEFA89A48B75c5df41132c4f54) {
    +++ description: None
      address:
-        "0x72Ff26D9517324eEFA89A48B75c5df41132c4f54"
+        "eth:0x72Ff26D9517324eEFA89A48B75c5df41132c4f54"
    }
```

```diff
    EOA  (0x9395e83720bf2D8ac6435f9c520b48E289Cb8885) {
    +++ description: None
      address:
-        "0x9395e83720bf2D8ac6435f9c520b48E289Cb8885"
+        "eth:0x9395e83720bf2D8ac6435f9c520b48E289Cb8885"
    }
```

```diff
    EOA  (0xBaB2c2aF5b91695e65955DA60d63aD1b2aE81126) {
    +++ description: None
      address:
-        "0xBaB2c2aF5b91695e65955DA60d63aD1b2aE81126"
+        "eth:0xBaB2c2aF5b91695e65955DA60d63aD1b2aE81126"
    }
```

```diff
    contract SP1VerifierGatewayMultisig (0xCafEf00d348Adbd57c37d1B77e0619C6244C6878) {
    +++ description: None
      address:
-        "0xCafEf00d348Adbd57c37d1B77e0619C6244C6878"
+        "eth:0xCafEf00d348Adbd57c37d1B77e0619C6244C6878"
      values.$implementation:
-        "0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552"
+        "eth:0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552"
      values.$members.0:
-        "0xBaB2c2aF5b91695e65955DA60d63aD1b2aE81126"
+        "eth:0xBaB2c2aF5b91695e65955DA60d63aD1b2aE81126"
      values.$members.1:
-        "0x72Ff26D9517324eEFA89A48B75c5df41132c4f54"
+        "eth:0x72Ff26D9517324eEFA89A48B75c5df41132c4f54"
      values.$members.2:
-        "0x9395e83720bf2D8ac6435f9c520b48E289Cb8885"
+        "eth:0x9395e83720bf2D8ac6435f9c520b48E289Cb8885"
      implementationNames.0xCafEf00d348Adbd57c37d1B77e0619C6244C6878:
-        "GnosisSafeProxy"
      implementationNames.0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552:
-        "GnosisSafe"
      implementationNames.eth:0xCafEf00d348Adbd57c37d1B77e0619C6244C6878:
+        "GnosisSafeProxy"
      implementationNames.eth:0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552:
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

- chain: optimism
- author: Sergey Shemyakov (<sergey.shemyakov@l2beat.com>)
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

Generated with discovered.json: 0x2e479474899967d49527a59e6d7377a328fbd831

# Diff at Wed, 09 Jul 2025 15:09:45 GMT:

- chain: scroll
- author: Sergey Shemyakov (<sergey.shemyakov@l2beat.com>)
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

Generated with discovered.json: 0xf1dce07804a55aad970287fc3171c5bd520dfd7d

# Diff at Wed, 09 Jul 2025 15:09:45 GMT:

- chain: ethereum
- author: Sergey Shemyakov (<sergey.shemyakov@l2beat.com>)
- current block number: 22882427

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

Generated with discovered.json: 0x63d398eb8a2ea6b5174fa6f966573a5d5e68e1a7

# Diff at Wed, 09 Jul 2025 15:09:44 GMT:

- chain: arbitrum
- author: Sergey Shemyakov (<sergey.shemyakov@l2beat.com>)
- current block number: 355918538

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

Generated with discovered.json: 0x7f3c2df6d36e193f00ca6ea9429550704a2cd0eb

# Diff at Wed, 09 Jul 2025 15:09:44 GMT:

- chain: base
- author: Sergey Shemyakov (<sergey.shemyakov@l2beat.com>)
- current block number: 32642215

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

