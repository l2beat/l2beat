Generated with discovered.json: 0x52faa009876b77a9db9b6c48d71fcfee28388fb3

# Diff at Mon, 14 Jul 2025 12:46:34 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@9f4300dad2f3d080cd56fa311d4a848556c74e72 block: 19532229
- current block number: 19532229

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19532229 (main branch discovery), not current.

```diff
    EOA  (0x0c1db86328E6CFCD4f530401131Dc9a26DefA12a) {
    +++ description: None
      address:
-        "0x0c1db86328E6CFCD4f530401131Dc9a26DefA12a"
+        "eth:0x0c1db86328E6CFCD4f530401131Dc9a26DefA12a"
    }
```

```diff
    EOA  (0x197C57440A30cB28103ab27CB1b0dC86E5907ADA) {
    +++ description: None
      address:
-        "0x197C57440A30cB28103ab27CB1b0dC86E5907ADA"
+        "eth:0x197C57440A30cB28103ab27CB1b0dC86E5907ADA"
    }
```

```diff
    contract FeeHandlerRouter (0x1d34808907607FA82Fa1b51F5fBA5Ff5a3Fa90cF) {
    +++ description: None
      address:
-        "0x1d34808907607FA82Fa1b51F5fBA5Ff5a3Fa90cF"
+        "eth:0x1d34808907607FA82Fa1b51F5fBA5Ff5a3Fa90cF"
      values._bridgeAddress:
-        "0x4D878E8Fb90178588Cda4cf1DCcdC9a6d2757089"
+        "eth:0x4D878E8Fb90178588Cda4cf1DCcdC9a6d2757089"
      values.accessControl.DEFAULT_ADMIN_ROLE.members.0:
-        "0xde79695d5cefF7c324552B3ecbe6165f77FCdF53"
+        "eth:0xde79695d5cefF7c324552B3ecbe6165f77FCdF53"
      implementationNames.0x1d34808907607FA82Fa1b51F5fBA5Ff5a3Fa90cF:
-        "FeeHandlerRouter"
      implementationNames.eth:0x1d34808907607FA82Fa1b51F5fBA5Ff5a3Fa90cF:
+        "FeeHandlerRouter"
    }
```

```diff
    contract Permissionless Generic Handler (0x31282123E7bcd947e2c1Bc364d564839574fAdCD) {
    +++ description: None
      address:
-        "0x31282123E7bcd947e2c1Bc364d564839574fAdCD"
+        "eth:0x31282123E7bcd947e2c1Bc364d564839574fAdCD"
      values._bridgeAddress:
-        "0x4D878E8Fb90178588Cda4cf1DCcdC9a6d2757089"
+        "eth:0x4D878E8Fb90178588Cda4cf1DCcdC9a6d2757089"
      implementationNames.0x31282123E7bcd947e2c1Bc364d564839574fAdCD:
-        "PermissionlessGenericHandler"
      implementationNames.eth:0x31282123E7bcd947e2c1Bc364d564839574fAdCD:
+        "PermissionlessGenericHandler"
    }
```

```diff
    contract Bridge (0x4D878E8Fb90178588Cda4cf1DCcdC9a6d2757089) {
    +++ description: None
      address:
-        "0x4D878E8Fb90178588Cda4cf1DCcdC9a6d2757089"
+        "eth:0x4D878E8Fb90178588Cda4cf1DCcdC9a6d2757089"
      values._accessControl:
-        "0xf433EfDf1Fb438F9d79D1E71dF2c2bdeAc95e28E"
+        "eth:0xf433EfDf1Fb438F9d79D1E71dF2c2bdeAc95e28E"
      values._feeHandler:
-        "0x1d34808907607FA82Fa1b51F5fBA5Ff5a3Fa90cF"
+        "eth:0x1d34808907607FA82Fa1b51F5fBA5Ff5a3Fa90cF"
      values._MPCAddress:
-        "0x6731987e651675aF87442Ed2F1719EDF937B51d7"
+        "eth:0x6731987e651675aF87442Ed2F1719EDF937B51d7"
      values.handler1:
-        "0xC832588193cd5ED2185daDA4A531e0B26eC5B830"
+        "eth:0xC832588193cd5ED2185daDA4A531e0B26eC5B830"
      values.handler2:
-        "0x31282123E7bcd947e2c1Bc364d564839574fAdCD"
+        "eth:0x31282123E7bcd947e2c1Bc364d564839574fAdCD"
      implementationNames.0x4D878E8Fb90178588Cda4cf1DCcdC9a6d2757089:
-        "Bridge"
      implementationNames.eth:0x4D878E8Fb90178588Cda4cf1DCcdC9a6d2757089:
+        "Bridge"
    }
```

```diff
    EOA  (0x5a288b42dC222190D8cF5014A330c978ee42A5df) {
    +++ description: None
      address:
-        "0x5a288b42dC222190D8cF5014A330c978ee42A5df"
+        "eth:0x5a288b42dC222190D8cF5014A330c978ee42A5df"
    }
```

```diff
    EOA  (0x6731987e651675aF87442Ed2F1719EDF937B51d7) {
    +++ description: None
      address:
-        "0x6731987e651675aF87442Ed2F1719EDF937B51d7"
+        "eth:0x6731987e651675aF87442Ed2F1719EDF937B51d7"
    }
```

```diff
    EOA  (0x695bd50CB07ffBd4098b272CE8b52B3c256ca049) {
    +++ description: None
      address:
-        "0x695bd50CB07ffBd4098b272CE8b52B3c256ca049"
+        "eth:0x695bd50CB07ffBd4098b272CE8b52B3c256ca049"
    }
```

```diff
    EOA  (0x86a73a594f74C76a6eB8F9E728d992D03252f60f) {
    +++ description: None
      address:
-        "0x86a73a594f74C76a6eB8F9E728d992D03252f60f"
+        "eth:0x86a73a594f74C76a6eB8F9E728d992D03252f60f"
    }
```

```diff
    contract BasicFeeHandler (0x9f9778DA7c1D0AbE148314d6C1EA6E0A93C151C7) {
    +++ description: None
      address:
-        "0x9f9778DA7c1D0AbE148314d6C1EA6E0A93C151C7"
+        "eth:0x9f9778DA7c1D0AbE148314d6C1EA6E0A93C151C7"
      values._bridgeAddress:
-        "0x4D878E8Fb90178588Cda4cf1DCcdC9a6d2757089"
+        "eth:0x4D878E8Fb90178588Cda4cf1DCcdC9a6d2757089"
      values._feeHandlerRouterAddress:
-        "0x1d34808907607FA82Fa1b51F5fBA5Ff5a3Fa90cF"
+        "eth:0x1d34808907607FA82Fa1b51F5fBA5Ff5a3Fa90cF"
      implementationNames.0x9f9778DA7c1D0AbE148314d6C1EA6E0A93C151C7:
-        "BasicFeeHandler"
      implementationNames.eth:0x9f9778DA7c1D0AbE148314d6C1EA6E0A93C151C7:
+        "BasicFeeHandler"
    }
```

```diff
    EOA  (0xa399460Ce767b06297457178D2F9F8f144017E77) {
    +++ description: None
      address:
-        "0xa399460Ce767b06297457178D2F9F8f144017E77"
+        "eth:0xa399460Ce767b06297457178D2F9F8f144017E77"
    }
```

```diff
    EOA  (0xacc0268a75280192897a78C706C9FBA2d2b851C4) {
    +++ description: None
      address:
-        "0xacc0268a75280192897a78C706C9FBA2d2b851C4"
+        "eth:0xacc0268a75280192897a78C706C9FBA2d2b851C4"
    }
```

```diff
    contract Community Multisig (0xc4d8b2F5501C765dE0C5E12550118F397B197D05) {
    +++ description: None
      address:
-        "0xc4d8b2F5501C765dE0C5E12550118F397B197D05"
+        "eth:0xc4d8b2F5501C765dE0C5E12550118F397B197D05"
      values.$implementation:
-        "0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552"
+        "eth:0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552"
      values.$members.0:
-        "0x0c1db86328E6CFCD4f530401131Dc9a26DefA12a"
+        "eth:0x0c1db86328E6CFCD4f530401131Dc9a26DefA12a"
      values.$members.1:
-        "0xd85b34B2Fe1eC7815B6dF659372382A8FA229677"
+        "eth:0xd85b34B2Fe1eC7815B6dF659372382A8FA229677"
      values.$members.2:
-        "0xa399460Ce767b06297457178D2F9F8f144017E77"
+        "eth:0xa399460Ce767b06297457178D2F9F8f144017E77"
      values.$members.3:
-        "0xe845B1d31CaA16Bf6c6Bf5E97a28D086bd46FD49"
+        "eth:0xe845B1d31CaA16Bf6c6Bf5E97a28D086bd46FD49"
      values.$members.4:
-        "0xC6458dedf35231F524ED9d7E0DF77A60b9E08676"
+        "eth:0xC6458dedf35231F524ED9d7E0DF77A60b9E08676"
      values.$members.5:
-        "0x86a73a594f74C76a6eB8F9E728d992D03252f60f"
+        "eth:0x86a73a594f74C76a6eB8F9E728d992D03252f60f"
      implementationNames.0xc4d8b2F5501C765dE0C5E12550118F397B197D05:
-        "GnosisSafeProxy"
      implementationNames.0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552:
-        "GnosisSafe"
      implementationNames.eth:0xc4d8b2F5501C765dE0C5E12550118F397B197D05:
+        "GnosisSafeProxy"
      implementationNames.eth:0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552:
+        "GnosisSafe"
    }
```

```diff
    EOA  (0xC6458dedf35231F524ED9d7E0DF77A60b9E08676) {
    +++ description: None
      address:
-        "0xC6458dedf35231F524ED9d7E0DF77A60b9E08676"
+        "eth:0xC6458dedf35231F524ED9d7E0DF77A60b9E08676"
    }
```

```diff
    contract ERC20 Bridge Handler (0xC832588193cd5ED2185daDA4A531e0B26eC5B830) {
    +++ description: None
      address:
-        "0xC832588193cd5ED2185daDA4A531e0B26eC5B830"
+        "eth:0xC832588193cd5ED2185daDA4A531e0B26eC5B830"
      values._bridgeAddress:
-        "0x4D878E8Fb90178588Cda4cf1DCcdC9a6d2757089"
+        "eth:0x4D878E8Fb90178588Cda4cf1DCcdC9a6d2757089"
      implementationNames.0xC832588193cd5ED2185daDA4A531e0B26eC5B830:
-        "ERC20Handler"
      implementationNames.eth:0xC832588193cd5ED2185daDA4A531e0B26eC5B830:
+        "ERC20Handler"
    }
```

```diff
    EOA  (0xd85b34B2Fe1eC7815B6dF659372382A8FA229677) {
    +++ description: None
      address:
-        "0xd85b34B2Fe1eC7815B6dF659372382A8FA229677"
+        "eth:0xd85b34B2Fe1eC7815B6dF659372382A8FA229677"
    }
```

```diff
    contract Admin Multisig (0xde79695d5cefF7c324552B3ecbe6165f77FCdF53) {
    +++ description: None
      address:
-        "0xde79695d5cefF7c324552B3ecbe6165f77FCdF53"
+        "eth:0xde79695d5cefF7c324552B3ecbe6165f77FCdF53"
      values.$implementation:
-        "0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552"
+        "eth:0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552"
      values.$members.0:
-        "0xacc0268a75280192897a78C706C9FBA2d2b851C4"
+        "eth:0xacc0268a75280192897a78C706C9FBA2d2b851C4"
      values.$members.1:
-        "0x5a288b42dC222190D8cF5014A330c978ee42A5df"
+        "eth:0x5a288b42dC222190D8cF5014A330c978ee42A5df"
      values.$members.2:
-        "0xe845B1d31CaA16Bf6c6Bf5E97a28D086bd46FD49"
+        "eth:0xe845B1d31CaA16Bf6c6Bf5E97a28D086bd46FD49"
      values.$members.3:
-        "0x197C57440A30cB28103ab27CB1b0dC86E5907ADA"
+        "eth:0x197C57440A30cB28103ab27CB1b0dC86E5907ADA"
      values.$members.4:
-        "0x86a73a594f74C76a6eB8F9E728d992D03252f60f"
+        "eth:0x86a73a594f74C76a6eB8F9E728d992D03252f60f"
      implementationNames.0xde79695d5cefF7c324552B3ecbe6165f77FCdF53:
-        "GnosisSafeProxy"
      implementationNames.0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552:
-        "GnosisSafe"
      implementationNames.eth:0xde79695d5cefF7c324552B3ecbe6165f77FCdF53:
+        "GnosisSafeProxy"
      implementationNames.eth:0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552:
+        "GnosisSafe"
    }
```

```diff
    EOA  (0xe845B1d31CaA16Bf6c6Bf5E97a28D086bd46FD49) {
    +++ description: None
      address:
-        "0xe845B1d31CaA16Bf6c6Bf5E97a28D086bd46FD49"
+        "eth:0xe845B1d31CaA16Bf6c6Bf5E97a28D086bd46FD49"
    }
```

```diff
    contract AccessControlSegregator (0xf433EfDf1Fb438F9d79D1E71dF2c2bdeAc95e28E) {
    +++ description: None
      address:
-        "0xf433EfDf1Fb438F9d79D1E71dF2c2bdeAc95e28E"
+        "eth:0xf433EfDf1Fb438F9d79D1E71dF2c2bdeAc95e28E"
      values.role_changeAccessControl:
-        "0xde79695d5cefF7c324552B3ecbe6165f77FCdF53"
+        "eth:0xde79695d5cefF7c324552B3ecbe6165f77FCdF53"
      values.role_changeFeeHandler:
-        "0xde79695d5cefF7c324552B3ecbe6165f77FCdF53"
+        "eth:0xde79695d5cefF7c324552B3ecbe6165f77FCdF53"
      values.role_endKeyGen:
-        "0xde79695d5cefF7c324552B3ecbe6165f77FCdF53"
+        "eth:0xde79695d5cefF7c324552B3ecbe6165f77FCdF53"
      values.role_grantAccess:
-        "0xde79695d5cefF7c324552B3ecbe6165f77FCdF53"
+        "eth:0xde79695d5cefF7c324552B3ecbe6165f77FCdF53"
      values.role_pauseTransfers:
-        "0x695bd50CB07ffBd4098b272CE8b52B3c256ca049"
+        "eth:0x695bd50CB07ffBd4098b272CE8b52B3c256ca049"
      values.role_refreshKey:
-        "0xde79695d5cefF7c324552B3ecbe6165f77FCdF53"
+        "eth:0xde79695d5cefF7c324552B3ecbe6165f77FCdF53"
      values.role_retry:
-        "0x695bd50CB07ffBd4098b272CE8b52B3c256ca049"
+        "eth:0x695bd50CB07ffBd4098b272CE8b52B3c256ca049"
      values.role_setBurnable:
-        "0xde79695d5cefF7c324552B3ecbe6165f77FCdF53"
+        "eth:0xde79695d5cefF7c324552B3ecbe6165f77FCdF53"
      values.role_setDepositNonce:
-        "0xde79695d5cefF7c324552B3ecbe6165f77FCdF53"
+        "eth:0xde79695d5cefF7c324552B3ecbe6165f77FCdF53"
      values.role_setForwarder:
-        "0xde79695d5cefF7c324552B3ecbe6165f77FCdF53"
+        "eth:0xde79695d5cefF7c324552B3ecbe6165f77FCdF53"
      values.role_setResource:
-        "0xde79695d5cefF7c324552B3ecbe6165f77FCdF53"
+        "eth:0xde79695d5cefF7c324552B3ecbe6165f77FCdF53"
      values.role_startKeyGen:
-        "0xde79695d5cefF7c324552B3ecbe6165f77FCdF53"
+        "eth:0xde79695d5cefF7c324552B3ecbe6165f77FCdF53"
      values.role_unpauseTransfers:
-        "0x695bd50CB07ffBd4098b272CE8b52B3c256ca049"
+        "eth:0x695bd50CB07ffBd4098b272CE8b52B3c256ca049"
      values.role_Withdraw:
-        "0xc4d8b2F5501C765dE0C5E12550118F397B197D05"
+        "eth:0xc4d8b2F5501C765dE0C5E12550118F397B197D05"
      implementationNames.0xf433EfDf1Fb438F9d79D1E71dF2c2bdeAc95e28E:
-        "AccessControlSegregator"
      implementationNames.eth:0xf433EfDf1Fb438F9d79D1E71dF2c2bdeAc95e28E:
+        "AccessControlSegregator"
    }
```

```diff
+   Status: CREATED
    contract FeeHandlerRouter (0x1d34808907607FA82Fa1b51F5fBA5Ff5a3Fa90cF)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Permissionless Generic Handler (0x31282123E7bcd947e2c1Bc364d564839574fAdCD)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Bridge (0x4D878E8Fb90178588Cda4cf1DCcdC9a6d2757089)
    +++ description: None
```

```diff
+   Status: CREATED
    contract BasicFeeHandler (0x9f9778DA7c1D0AbE148314d6C1EA6E0A93C151C7)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Community Multisig (0xc4d8b2F5501C765dE0C5E12550118F397B197D05)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ERC20 Bridge Handler (0xC832588193cd5ED2185daDA4A531e0B26eC5B830)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Admin Multisig (0xde79695d5cefF7c324552B3ecbe6165f77FCdF53)
    +++ description: None
```

```diff
+   Status: CREATED
    contract AccessControlSegregator (0xf433EfDf1Fb438F9d79D1E71dF2c2bdeAc95e28E)
    +++ description: None
```

Generated with discovered.json: 0xeb36b86907a34ed701809c418ddcea26e7f041f6

# Diff at Tue, 04 Mar 2025 10:40:05 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@98d260b45fe0d2195ce5e629bd7b200c8706e8ba block: 19532229
- current block number: 19532229

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19532229 (main branch discovery), not current.

```diff
    contract FeeHandlerRouter (0x1d34808907607FA82Fa1b51F5fBA5Ff5a3Fa90cF) {
    +++ description: None
      sinceBlock:
+        18661897
    }
```

```diff
    contract Permissionless Generic Handler (0x31282123E7bcd947e2c1Bc364d564839574fAdCD) {
    +++ description: None
      sinceBlock:
+        18334705
    }
```

```diff
    contract Bridge (0x4D878E8Fb90178588Cda4cf1DCcdC9a6d2757089) {
    +++ description: None
      sinceBlock:
+        17471016
    }
```

```diff
    contract BasicFeeHandler (0x9f9778DA7c1D0AbE148314d6C1EA6E0A93C151C7) {
    +++ description: None
      sinceBlock:
+        18661909
    }
```

```diff
    contract Community Multisig (0xc4d8b2F5501C765dE0C5E12550118F397B197D05) {
    +++ description: None
      sinceBlock:
+        16991929
    }
```

```diff
    contract ERC20 Bridge Handler (0xC832588193cd5ED2185daDA4A531e0B26eC5B830) {
    +++ description: None
      sinceBlock:
+        17471017
    }
```

```diff
    contract Admin Multisig (0xde79695d5cefF7c324552B3ecbe6165f77FCdF53) {
    +++ description: None
      sinceBlock:
+        17464490
    }
```

```diff
    contract AccessControlSegregator (0xf433EfDf1Fb438F9d79D1E71dF2c2bdeAc95e28E) {
    +++ description: None
      sinceBlock:
+        17471014
    }
```

Generated with discovered.json: 0x5a25cb01428284f79577c636e731367a9e062419

# Diff at Mon, 14 Oct 2024 10:56:38 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@1afc77ff111ceb0970e7d09efcc7b2f376b0c281 block: 19532229
- current block number: 19532229

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19532229 (main branch discovery), not current.

```diff
    contract FeeHandlerRouter (0x1d34808907607FA82Fa1b51F5fBA5Ff5a3Fa90cF) {
    +++ description: None
      sourceHashes:
+        ["0x57d2aa380d47a54717ec0de4d2ce6f34d5618f91a876226f60828e03036c07bb"]
    }
```

```diff
    contract Permissionless Generic Handler (0x31282123E7bcd947e2c1Bc364d564839574fAdCD) {
    +++ description: None
      sourceHashes:
+        ["0x6cbae46385d34a7539ed992fd427d294cf815bc599a5b8814ba0272276864f21"]
    }
```

```diff
    contract Bridge (0x4D878E8Fb90178588Cda4cf1DCcdC9a6d2757089) {
    +++ description: None
      sourceHashes:
+        ["0x70d800f2dae04f7c3240cdf754404e86a486cea0a8591eec762e903d2eec5c77"]
    }
```

```diff
    contract BasicFeeHandler (0x9f9778DA7c1D0AbE148314d6C1EA6E0A93C151C7) {
    +++ description: None
      sourceHashes:
+        ["0x057a9fc15bc757cf2e6b63ad07391d1629be177ca6f4c1af91bc407b7a7ef4c9"]
    }
```

```diff
    contract Community Multisig (0xc4d8b2F5501C765dE0C5E12550118F397B197D05) {
    +++ description: None
      sourceHashes:
+        ["0x81a7349eebb98ac33b0bc6842e3cb258034a8f2a4ba004570bb8e2e25947f9ff","0xd42bbf9f7dcd3720a7fc6bdc6edfdfae8800a37d6dd4decfa0ef6ca4a2e88940"]
    }
```

```diff
    contract ERC20 Bridge Handler (0xC832588193cd5ED2185daDA4A531e0B26eC5B830) {
    +++ description: None
      sourceHashes:
+        ["0x6f164184a36f7f6b52d39867d75472915b53a643e2fca4319619d7f76706905e"]
    }
```

```diff
    contract Admin Multisig (0xde79695d5cefF7c324552B3ecbe6165f77FCdF53) {
    +++ description: None
      sourceHashes:
+        ["0x81a7349eebb98ac33b0bc6842e3cb258034a8f2a4ba004570bb8e2e25947f9ff","0xd42bbf9f7dcd3720a7fc6bdc6edfdfae8800a37d6dd4decfa0ef6ca4a2e88940"]
    }
```

```diff
    contract AccessControlSegregator (0xf433EfDf1Fb438F9d79D1E71dF2c2bdeAc95e28E) {
    +++ description: None
      sourceHashes:
+        ["0xffa23c6121a2e1d41ad45b0ea97f759dbbc6b73bc7e8d810590d9cb36b3dfb2b"]
    }
```

Generated with discovered.json: 0x3efb0456de1b5206037854e55e726d862297bdf2

# Diff at Fri, 09 Aug 2024 10:12:40 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@1f0da1d0aab7bc6b3b5e54e7e93480bd98e57035 block: 19532229
- current block number: 19532229

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19532229 (main branch discovery), not current.

```diff
    contract Community Multisig (0xc4d8b2F5501C765dE0C5E12550118F397B197D05) {
    +++ description: None
      values.$multisigThreshold:
-        "4 of 6 (67%)"
      values.getOwners:
-        ["0x0c1db86328E6CFCD4f530401131Dc9a26DefA12a","0xd85b34B2Fe1eC7815B6dF659372382A8FA229677","0xa399460Ce767b06297457178D2F9F8f144017E77","0xe845B1d31CaA16Bf6c6Bf5E97a28D086bd46FD49","0xC6458dedf35231F524ED9d7E0DF77A60b9E08676","0x86a73a594f74C76a6eB8F9E728d992D03252f60f"]
      values.getThreshold:
-        4
      values.$members:
+        ["0x0c1db86328E6CFCD4f530401131Dc9a26DefA12a","0xd85b34B2Fe1eC7815B6dF659372382A8FA229677","0xa399460Ce767b06297457178D2F9F8f144017E77","0xe845B1d31CaA16Bf6c6Bf5E97a28D086bd46FD49","0xC6458dedf35231F524ED9d7E0DF77A60b9E08676","0x86a73a594f74C76a6eB8F9E728d992D03252f60f"]
      values.$threshold:
+        4
      values.multisigThreshold:
+        "4 of 6 (67%)"
    }
```

```diff
    contract Admin Multisig (0xde79695d5cefF7c324552B3ecbe6165f77FCdF53) {
    +++ description: None
      values.$multisigThreshold:
-        "3 of 5 (60%)"
      values.getOwners:
-        ["0xacc0268a75280192897a78C706C9FBA2d2b851C4","0x5a288b42dC222190D8cF5014A330c978ee42A5df","0xe845B1d31CaA16Bf6c6Bf5E97a28D086bd46FD49","0x197C57440A30cB28103ab27CB1b0dC86E5907ADA","0x86a73a594f74C76a6eB8F9E728d992D03252f60f"]
      values.getThreshold:
-        3
      values.$members:
+        ["0xacc0268a75280192897a78C706C9FBA2d2b851C4","0x5a288b42dC222190D8cF5014A330c978ee42A5df","0xe845B1d31CaA16Bf6c6Bf5E97a28D086bd46FD49","0x197C57440A30cB28103ab27CB1b0dC86E5907ADA","0x86a73a594f74C76a6eB8F9E728d992D03252f60f"]
      values.$threshold:
+        3
      values.multisigThreshold:
+        "3 of 5 (60%)"
    }
```

Generated with discovered.json: 0xa3c98e31a5cf1a521d5e4eaef08fd9ac3f0b15e6

# Diff at Thu, 28 Mar 2024 11:12:09 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@21187e63b9b90823a55c461c331868a470ce17eb block: 19488926
- current block number: 19532229

## Description

Update discovery to include the multisig threshold.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19488926 (main branch discovery), not current.

```diff
    contract Community Multisig (0xc4d8b2F5501C765dE0C5E12550118F397B197D05) {
    +++ description: None
      upgradeability.threshold:
+        "4 of 6 (67%)"
    }
```

```diff
    contract Admin Multisig (0xde79695d5cefF7c324552B3ecbe6165f77FCdF53) {
    +++ description: None
      upgradeability.threshold:
+        "3 of 5 (60%)"
    }
```

Generated with discovered.json: 0x057ae635feb239a6c79214cf0179838ccbddfcfb

# Diff at Fri, 22 Mar 2024 08:18:53 GMT:

- author: Bartek Kiepuszewski (<bkiepuszewski@gmail.com>)
- current block number: 19488926

## Description

Created a new config for the Sygma bridge. Sygma contracts do not
emit events when new handlers are added, hence it is hard to get
all the handlers from the discovery - this will need to be fixed
by having a more sophisticated discovery storage handler

## Initial discovery

```diff
+   Status: CREATED
    contract FeeHandlerRouter (0x1d34808907607FA82Fa1b51F5fBA5Ff5a3Fa90cF)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Permissionless Generic Handler (0x31282123E7bcd947e2c1Bc364d564839574fAdCD)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Bridge (0x4D878E8Fb90178588Cda4cf1DCcdC9a6d2757089)
    +++ description: None
```

```diff
+   Status: CREATED
    contract BasicFeeHandler (0x9f9778DA7c1D0AbE148314d6C1EA6E0A93C151C7)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Community Multisig (0xc4d8b2F5501C765dE0C5E12550118F397B197D05)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ERC20 Bridge Handler (0xC832588193cd5ED2185daDA4A531e0B26eC5B830)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Admin Multisig (0xde79695d5cefF7c324552B3ecbe6165f77FCdF53)
    +++ description: None
```

```diff
+   Status: CREATED
    contract AccessControlSegregator (0xf433EfDf1Fb438F9d79D1E71dF2c2bdeAc95e28E)
    +++ description: None
```
