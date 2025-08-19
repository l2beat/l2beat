Generated with discovered.json: 0x770bfa083e47a813ffa258e46fb91689a8cc8c86

# Diff at Mon, 14 Jul 2025 12:45:30 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@9f4300dad2f3d080cd56fa311d4a848556c74e72 block: 16154924
- current block number: 16154924

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 16154924 (main branch discovery), not current.

```diff
    contract Erc20Vault (0x070cB1270A4B2bA53c81CeF89d0FD584Ed4F430B) {
    +++ description: None
      address:
-        "0x070cB1270A4B2bA53c81CeF89d0FD584Ed4F430B"
+        "eth:0x070cB1270A4B2bA53c81CeF89d0FD584Ed4F430B"
      values.depositVerifiers.0:
-        "0xD876aeb3a443FBC03B7349AAc115E9054563CD82"
+        "eth:0xD876aeb3a443FBC03B7349AAc115E9054563CD82"
      values.depositVerifiers.1:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      values.getEffectiveDepositVerifier:
-        "0xD876aeb3a443FBC03B7349AAc115E9054563CD82"
+        "eth:0xD876aeb3a443FBC03B7349AAc115E9054563CD82"
      implementationNames.0x070cB1270A4B2bA53c81CeF89d0FD584Ed4F430B:
-        "Erc20Vault"
      implementationNames.eth:0x070cB1270A4B2bA53c81CeF89d0FD584Ed4F430B:
+        "Erc20Vault"
    }
```

```diff
    contract PlasmaFramework (0x0D4C1222f5e839a911e2053860e45F18921D72ac) {
    +++ description: None
      address:
-        "0x0D4C1222f5e839a911e2053860e45F18921D72ac"
+        "eth:0x0D4C1222f5e839a911e2053860e45F18921D72ac"
      values.authority:
-        "0x22405c1782913fb676bc74Ef54a60727B0e1026F"
+        "eth:0x22405c1782913fb676bc74Ef54a60727B0e1026F"
      values.getMaintainer:
-        "0x27b4C9e627F66eB3c7Bf0E98751Bd721615D3B21"
+        "eth:0x27b4C9e627F66eB3c7Bf0E98751Bd721615D3B21"
      implementationNames.0x0D4C1222f5e839a911e2053860e45F18921D72ac:
-        "PlasmaFramework"
      implementationNames.eth:0x0D4C1222f5e839a911e2053860e45F18921D72ac:
+        "PlasmaFramework"
    }
```

```diff
    EOA  (0x22405c1782913fb676bc74Ef54a60727B0e1026F) {
    +++ description: None
      address:
-        "0x22405c1782913fb676bc74Ef54a60727B0e1026F"
+        "eth:0x22405c1782913fb676bc74Ef54a60727B0e1026F"
    }
```

```diff
    EOA  (0x27b4C9e627F66eB3c7Bf0E98751Bd721615D3B21) {
    +++ description: None
      address:
-        "0x27b4C9e627F66eB3c7Bf0E98751Bd721615D3B21"
+        "eth:0x27b4C9e627F66eB3c7Bf0E98751Bd721615D3B21"
    }
```

```diff
    contract EthVault (0x3Eed23eA148D356a72CA695DBCe2fceb40a32ce0) {
    +++ description: None
      address:
-        "0x3Eed23eA148D356a72CA695DBCe2fceb40a32ce0"
+        "eth:0x3Eed23eA148D356a72CA695DBCe2fceb40a32ce0"
      values.depositVerifiers.0:
-        "0x649f37203c365DE759c8fc8CA35beBF5448F70Be"
+        "eth:0x649f37203c365DE759c8fc8CA35beBF5448F70Be"
      values.depositVerifiers.1:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      values.getEffectiveDepositVerifier:
-        "0x649f37203c365DE759c8fc8CA35beBF5448F70Be"
+        "eth:0x649f37203c365DE759c8fc8CA35beBF5448F70Be"
      implementationNames.0x3Eed23eA148D356a72CA695DBCe2fceb40a32ce0:
-        "EthVault"
      implementationNames.eth:0x3Eed23eA148D356a72CA695DBCe2fceb40a32ce0:
+        "EthVault"
    }
```

```diff
    contract PaymentExitGame (0x48d7A6bbc428bca019A560cF3e8EA5364395Aad3) {
    +++ description: None
      address:
-        "0x48d7A6bbc428bca019A560cF3e8EA5364395Aad3"
+        "eth:0x48d7A6bbc428bca019A560cF3e8EA5364395Aad3"
      implementationNames.0x48d7A6bbc428bca019A560cF3e8EA5364395Aad3:
-        "PaymentExitGame"
      implementationNames.eth:0x48d7A6bbc428bca019A560cF3e8EA5364395Aad3:
+        "PaymentExitGame"
    }
```

```diff
    contract ETHDepositVerifier (0x649f37203c365DE759c8fc8CA35beBF5448F70Be) {
    +++ description: None
      address:
-        "0x649f37203c365DE759c8fc8CA35beBF5448F70Be"
+        "eth:0x649f37203c365DE759c8fc8CA35beBF5448F70Be"
      implementationNames.0x649f37203c365DE759c8fc8CA35beBF5448F70Be:
-        ""
      implementationNames.eth:0x649f37203c365DE759c8fc8CA35beBF5448F70Be:
+        ""
    }
```

```diff
    contract ERC20DepositVerifier (0xD876aeb3a443FBC03B7349AAc115E9054563CD82) {
    +++ description: None
      address:
-        "0xD876aeb3a443FBC03B7349AAc115E9054563CD82"
+        "eth:0xD876aeb3a443FBC03B7349AAc115E9054563CD82"
      implementationNames.0xD876aeb3a443FBC03B7349AAc115E9054563CD82:
-        ""
      implementationNames.eth:0xD876aeb3a443FBC03B7349AAc115E9054563CD82:
+        ""
    }
```

```diff
+   Status: CREATED
    contract Erc20Vault (0x070cB1270A4B2bA53c81CeF89d0FD584Ed4F430B)
    +++ description: None
```

```diff
+   Status: CREATED
    contract PlasmaFramework (0x0D4C1222f5e839a911e2053860e45F18921D72ac)
    +++ description: None
```

```diff
+   Status: CREATED
    contract EthVault (0x3Eed23eA148D356a72CA695DBCe2fceb40a32ce0)
    +++ description: None
```

```diff
+   Status: CREATED
    contract PaymentExitGame (0x48d7A6bbc428bca019A560cF3e8EA5364395Aad3)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ETHDepositVerifier (0x649f37203c365DE759c8fc8CA35beBF5448F70Be)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ERC20DepositVerifier (0xD876aeb3a443FBC03B7349AAc115E9054563CD82)
    +++ description: None
```

Generated with discovered.json: 0x7c42df5a50647ccf64eea3493ecc9a7bf689e16d

# Diff at Tue, 04 Mar 2025 10:39:30 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@98d260b45fe0d2195ce5e629bd7b200c8706e8ba block: 16154924
- current block number: 16154924

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 16154924 (main branch discovery), not current.

```diff
    contract Erc20Vault (0x070cB1270A4B2bA53c81CeF89d0FD584Ed4F430B) {
    +++ description: None
      sinceBlock:
+        9687286
    }
```

```diff
    contract PlasmaFramework (0x0D4C1222f5e839a911e2053860e45F18921D72ac) {
    +++ description: None
      sinceBlock:
+        9687257
    }
```

```diff
    contract EthVault (0x3Eed23eA148D356a72CA695DBCe2fceb40a32ce0) {
    +++ description: None
      sinceBlock:
+        9687270
    }
```

```diff
    contract PaymentExitGame (0x48d7A6bbc428bca019A560cF3e8EA5364395Aad3) {
    +++ description: None
      sinceBlock:
+        9687476
    }
```

```diff
    contract ETHDepositVerifier (0x649f37203c365DE759c8fc8CA35beBF5448F70Be) {
    +++ description: None
      sinceBlock:
+        9687268
    }
```

```diff
    contract ERC20DepositVerifier (0xD876aeb3a443FBC03B7349AAc115E9054563CD82) {
    +++ description: None
      sinceBlock:
+        9687281
    }
```

Generated with discovered.json: 0x22c4d8b727e2092da7ce1b8640f331872e8be9a5

# Diff at Mon, 14 Oct 2024 10:53:27 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@1afc77ff111ceb0970e7d09efcc7b2f376b0c281 block: 16154924
- current block number: 16154924

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 16154924 (main branch discovery), not current.

```diff
    contract Erc20Vault (0x070cB1270A4B2bA53c81CeF89d0FD584Ed4F430B) {
    +++ description: None
      sourceHashes:
+        ["0xd782393522c4b13f91b789a821bd38ba6238b49e1488e701aefe6e9402344572"]
    }
```

```diff
    contract PlasmaFramework (0x0D4C1222f5e839a911e2053860e45F18921D72ac) {
    +++ description: None
      sourceHashes:
+        ["0x4337d3128a631d1b4f82a9ac02d2a461ef9b0aa7221fee00fd10a49736acbb6e"]
    }
```

```diff
    contract EthVault (0x3Eed23eA148D356a72CA695DBCe2fceb40a32ce0) {
    +++ description: None
      sourceHashes:
+        ["0x63a556881f43e9c0e34ce5ecc046e510dbaa80fa44c7805dcf06d8644bc509e8"]
    }
```

```diff
    contract PaymentExitGame (0x48d7A6bbc428bca019A560cF3e8EA5364395Aad3) {
    +++ description: None
      sourceHashes:
+        ["0xfd5384956dd8b536ce35315bd551abba275ef61d520ece5dadca2c751e09ff0f"]
    }
```

Generated with discovered.json: 0x682c5f5a1581749b898918bf96e781c39c15c1f9

