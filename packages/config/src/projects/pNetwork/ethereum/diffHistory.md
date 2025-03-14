Generated with discovered.json: 0xa09669f0e97925336784304b4b4a5713fe5b981a

# Diff at Tue, 04 Mar 2025 10:39:35 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@98d260b45fe0d2195ce5e629bd7b200c8706e8ba block: 20420398
- current block number: 20420398

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20420398 (main branch discovery), not current.

```diff
    contract ERC20 Vault V1 (0x112334f50Cb6efcff4e35Ae51A022dBE41a48135) {
    +++ description: None
      sinceBlock:
+        12373839
    }
```

```diff
    contract pNetworkDAOVoting (0x2211bFD97b1c02aE8Ac305d206e9780ba7D8BfF4) {
    +++ description: None
      sinceBlock:
+        10565990
    }
```

```diff
    contract Kernel (0x2732fD9fD5F0E84B1b774cf5E6f5c812EAfd455b) {
    +++ description: None
      sinceBlock:
+        10565704
    }
```

```diff
    contract EVMScriptRegistry (0x47d12498Ed2E9EFA9ECA2EcD05ba857253824478) {
    +++ description: None
      sinceBlock:
+        10565704
    }
```

```diff
    contract UOS Vault (0x9f8622b11984AfC8f0a42A394928702017c5968D) {
    +++ description: None
      sinceBlock:
+        12825127
    }
```

```diff
    contract MiniMeTokenFactory (0xA29EF584c389c67178aE9152aC9C543f9156E2B3) {
    +++ description: None
      sinceBlock:
+        8262062
    }
```

```diff
    contract pNetwork Multisig (0xb5977b683c64fce80A1f5b587964b6f77Ee6CfDB) {
    +++ description: None
      sinceBlock:
+        16325852
    }
```

```diff
    contract ProxyAdmin (0xB6D14DdFBE01AC537accBe35cCd771C30D53c535) {
    +++ description: None
      sinceBlock:
+        15618660
    }
```

```diff
    contract TokenManager (0xD7E8E79d318eCE001B39D83Ea891ebD5fC22d254) {
    +++ description: None
      sinceBlock:
+        10565855
    }
```

```diff
    contract PProxyAdmin (0xDc2c547F6b6a89F1D96d66d50fDCbD69979Aee2a) {
    +++ description: None
      sinceBlock:
+        13906609
    }
```

```diff
    contract ERC20 Vault V2 (0xe396757EC7E6aC7C8E5ABE7285dde47b98F22db8) {
    +++ description: None
      sinceBlock:
+        13906697
    }
```

```diff
    contract MiniMeToken (0xe824F81cD136BB7a28480baF8d7E5f0E8E4B693E) {
    +++ description: None
      sinceBlock:
+        10565808
    }
```

```diff
    contract EthPntv2 (0xf4eA6B892853413bD9d9f1a5D3a620A0ba39c5b2) {
    +++ description: None
      sinceBlock:
+        15618661
    }
```

```diff
    contract ACL (0xFDcae423E5e92B76FE7D1e2bcabd36fca8a6a8Fe) {
    +++ description: None
      sinceBlock:
+        10565704
    }
```

Generated with discovered.json: 0x0f14df70fd18a66cbb89b832db5dee1b9cdc83b4

# Diff at Tue, 25 Feb 2025 13:12:11 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@9b171c901abf483bb022511bdc023137c55d589c block: 20420398
- current block number: 20420398

## Description

Config: added lido related templates.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20420398 (main branch discovery), not current.

```diff
    contract EVMScriptRegistry (0x47d12498Ed2E9EFA9ECA2EcD05ba857253824478) {
    +++ description: None
      template:
+        "tokens/Lido/EVMScriptRegistry"
    }
```

```diff
    contract MiniMeToken (0xe824F81cD136BB7a28480baF8d7E5f0E8E4B693E) {
    +++ description: None
      template:
+        "tokens/Lido/MiniMeToken"
    }
```

Generated with discovered.json: 0x8aca3656cae4efe07280e16ddcf39418a9bd0768

# Diff at Mon, 20 Jan 2025 11:09:52 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@2c8b4f3d9910bb6371be9b4df87b70856e7d8c64 block: 20420398
- current block number: 20420398

## Description

Rerun on the same block number. Applies fixes to permissions and via field. Renames permission's target to to/from.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20420398 (main branch discovery), not current.

```diff
    contract ProxyAdmin (0xB6D14DdFBE01AC537accBe35cCd771C30D53c535) {
    +++ description: None
      receivedPermissions.0.target:
-        "0xf4eA6B892853413bD9d9f1a5D3a620A0ba39c5b2"
      receivedPermissions.0.from:
+        "0xf4eA6B892853413bD9d9f1a5D3a620A0ba39c5b2"
    }
```

```diff
    contract PProxyAdmin (0xDc2c547F6b6a89F1D96d66d50fDCbD69979Aee2a) {
    +++ description: None
      receivedPermissions.0.target:
-        "0xe396757EC7E6aC7C8E5ABE7285dde47b98F22db8"
      receivedPermissions.0.from:
+        "0xe396757EC7E6aC7C8E5ABE7285dde47b98F22db8"
    }
```

```diff
    contract ERC20 Vault V2 (0xe396757EC7E6aC7C8E5ABE7285dde47b98F22db8) {
    +++ description: None
      issuedPermissions.0.target:
-        "0xDc2c547F6b6a89F1D96d66d50fDCbD69979Aee2a"
      issuedPermissions.0.to:
+        "0xDc2c547F6b6a89F1D96d66d50fDCbD69979Aee2a"
    }
```

```diff
    contract EthPntv2 (0xf4eA6B892853413bD9d9f1a5D3a620A0ba39c5b2) {
    +++ description: None
      issuedPermissions.0.target:
-        "0xB6D14DdFBE01AC537accBe35cCd771C30D53c535"
      issuedPermissions.0.to:
+        "0xB6D14DdFBE01AC537accBe35cCd771C30D53c535"
    }
```

Generated with discovered.json: 0xdf5ab49ccaead3dcfcfadfb442fd14eccad7037c

# Diff at Mon, 21 Oct 2024 11:08:48 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@8895d33866f5665c4c710f4ddaa32bfa63cc3c78 block: 20420398
- current block number: 20420398

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20420398 (main branch discovery), not current.

```diff
    contract ERC20 Vault V2 (0xe396757EC7E6aC7C8E5ABE7285dde47b98F22db8) {
    +++ description: None
      values.$pastUpgrades.5.2:
+        ["0x34D085516f9D7794192aDB10C995d9c532E335aF"]
      values.$pastUpgrades.5.1:
-        ["0x34D085516f9D7794192aDB10C995d9c532E335aF"]
+        "0x1fbe09abf45a526f20340810373ed6cd7e2164896fffbcc71f2c2c3e5a99d426"
      values.$pastUpgrades.4.2:
+        ["0xD331E3EB139D1433D1c988D5DC1cd6eCB971233b"]
      values.$pastUpgrades.4.1:
-        ["0xD331E3EB139D1433D1c988D5DC1cd6eCB971233b"]
+        "0x94c984ee79b11d3ae894661b8ebf74003d5d88eef395a415972c79fc90dba646"
      values.$pastUpgrades.3.2:
+        ["0x1cfE92176eefc0C53aF05a298F271C319b73E0aB"]
      values.$pastUpgrades.3.1:
-        ["0x1cfE92176eefc0C53aF05a298F271C319b73E0aB"]
+        "0x1b0b229497173a9c2fc64ad92edb803d26abd46845228c45814c6e7fe96f2b3a"
      values.$pastUpgrades.2.2:
+        ["0xD331E3EB139D1433D1c988D5DC1cd6eCB971233b"]
      values.$pastUpgrades.2.1:
-        ["0xD331E3EB139D1433D1c988D5DC1cd6eCB971233b"]
+        "0x4b3118460f80112e26efd24b4a68cfcb29a7b388d595c59c122e766195fb3457"
      values.$pastUpgrades.1.2:
+        ["0xfbc347975C48578F4A25ECeEB61BC16356abE8a2"]
      values.$pastUpgrades.1.1:
-        ["0xfbc347975C48578F4A25ECeEB61BC16356abE8a2"]
+        "0x17f3b852ac3efe8b775235a7135ace8aa5c3caee425972ae38baa999ac46ac6f"
      values.$pastUpgrades.0.2:
+        ["0xE01a9c36170b8Fa163C6a54D7aB3015C85e0186c"]
      values.$pastUpgrades.0.1:
-        ["0xE01a9c36170b8Fa163C6a54D7aB3015C85e0186c"]
+        "0x1bf57708290758992fb44d97c991339a7d0efd25414a46585603bbc055e27373"
    }
```

```diff
    contract EthPntv2 (0xf4eA6B892853413bD9d9f1a5D3a620A0ba39c5b2) {
    +++ description: None
      values.$pastUpgrades.1.2:
+        ["0xd88a13c72443D069Fc0d44A4989AC8dd132Ac38b"]
      values.$pastUpgrades.1.1:
-        ["0xd88a13c72443D069Fc0d44A4989AC8dd132Ac38b"]
+        "0x665f94ba355ee0c98d66968706bc8bde017bf6bff2fcca1552d598e2c1671a99"
      values.$pastUpgrades.0.2:
+        ["0x8474a898677C3bc97f35A86c387aE34Bf272C860"]
      values.$pastUpgrades.0.1:
-        ["0x8474a898677C3bc97f35A86c387aE34Bf272C860"]
+        "0x7d9c485f937f4f9e3cd8b28cb8fa4c5ef34d3c9e4c3ad94182ecaf719c70db9d"
    }
```

Generated with discovered.json: 0x819d76b4f8acf20b7d12c107d1f05c58adc56bd2

# Diff at Mon, 14 Oct 2024 10:54:10 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@1afc77ff111ceb0970e7d09efcc7b2f376b0c281 block: 20420398
- current block number: 20420398

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20420398 (main branch discovery), not current.

```diff
    contract ERC20 Vault V1 (0x112334f50Cb6efcff4e35Ae51A022dBE41a48135) {
    +++ description: None
      sourceHashes:
+        ["0xdf2e47952904a5d0bc18604cdb2be843cfbc6ae2be79ca98e0d1fcf9f69d70d4"]
    }
```

```diff
    contract pNetworkDAOVoting (0x2211bFD97b1c02aE8Ac305d206e9780ba7D8BfF4) {
    +++ description: None
      sourceHashes:
+        ["0xe95d65e50752cf7b137131ff78cb164641fe141b0780189482701ebda1b66d4a","0xeec9883cfc8cce2215f09608d831b1e64c31e57e4daf63da14701cdbe8b2a291"]
    }
```

```diff
    contract Kernel (0x2732fD9fD5F0E84B1b774cf5E6f5c812EAfd455b) {
    +++ description: None
      sourceHashes:
+        ["0x3ef00bf119dbb1f46a05a35111f35da84bb45cac1abfa574989211677d16787a","0x452458b35204910fe71376b423bd8d2887a1e82d22843fd79880d4ac0dce2a33"]
    }
```

```diff
    contract EVMScriptRegistry (0x47d12498Ed2E9EFA9ECA2EcD05ba857253824478) {
    +++ description: None
      sourceHashes:
+        ["0x3cab9c9a12a52c625f55b2d3d9693f8eb062cb0d41841589b557888ad01afced","0x00350407c4a32b62d60dbac5ac3093bf4bffd482f40b2df2a9cd3268365b84e5"]
    }
```

```diff
    contract UOS Vault (0x9f8622b11984AfC8f0a42A394928702017c5968D) {
    +++ description: None
      sourceHashes:
+        ["0xe6b0ad564ecf0ee4b47b19a605101ce2c680b5e451c154acaaabb25f454aed1a"]
    }
```

```diff
    contract MiniMeTokenFactory (0xA29EF584c389c67178aE9152aC9C543f9156E2B3) {
    +++ description: None
      sourceHashes:
+        ["0xab441847b55bfdc5cf90792906cf0effcd43d3390a7cc05e690aad5fb349c19b"]
    }
```

```diff
    contract pNetwork Multisig (0xb5977b683c64fce80A1f5b587964b6f77Ee6CfDB) {
    +++ description: None
      sourceHashes:
+        ["0x81a7349eebb98ac33b0bc6842e3cb258034a8f2a4ba004570bb8e2e25947f9ff","0xd42bbf9f7dcd3720a7fc6bdc6edfdfae8800a37d6dd4decfa0ef6ca4a2e88940"]
    }
```

```diff
    contract ProxyAdmin (0xB6D14DdFBE01AC537accBe35cCd771C30D53c535) {
    +++ description: None
      sourceHashes:
+        ["0x31b987ba8db4fc147856ec1375d9df4f40d58c4dc97e16be5b38ee2e3c3cc6f9"]
    }
```

```diff
    contract TokenManager (0xD7E8E79d318eCE001B39D83Ea891ebD5fC22d254) {
    +++ description: None
      sourceHashes:
+        ["0xe95d65e50752cf7b137131ff78cb164641fe141b0780189482701ebda1b66d4a","0x07aae7f3026cf9986df7e9587978c4a61f37310b62ac418c63e182d2fdb51fef"]
    }
```

```diff
    contract PProxyAdmin (0xDc2c547F6b6a89F1D96d66d50fDCbD69979Aee2a) {
    +++ description: None
      sourceHashes:
+        ["0x90607504d5e8f365803601eeade9548daa56d981da3ce27d42acb6d7e01150b2"]
    }
```

```diff
    contract ERC20 Vault V2 (0xe396757EC7E6aC7C8E5ABE7285dde47b98F22db8) {
    +++ description: None
      sourceHashes:
+        ["0x421304ff20b039c820bfc9af779d8ec7444153822c329251f1bbaec68febf02c","0x9a4dab9a6c79e6054401f76b1b8df918bf8b24d341078c87aef7d619f3787d3c"]
    }
```

```diff
    contract MiniMeToken (0xe824F81cD136BB7a28480baF8d7E5f0E8E4B693E) {
    +++ description: None
      sourceHashes:
+        ["0x1098670857010f37e15b128a92baa1ccb42e961bd5e02b478a0c69fd8d66eb46"]
    }
```

```diff
    contract EthPntv2 (0xf4eA6B892853413bD9d9f1a5D3a620A0ba39c5b2) {
    +++ description: None
      sourceHashes:
+        ["0x6d1bbfb1ed7d88848e594dc11366fbed3d53c5a507022c04dbeea72ef549cd6a","0xf9ab1306492850c52f787f8af996c1c4df97d8c382b73d65e0e8e60fd346c056"]
    }
```

```diff
    contract ACL (0xFDcae423E5e92B76FE7D1e2bcabd36fca8a6a8Fe) {
    +++ description: None
      sourceHashes:
+        ["0xe95d65e50752cf7b137131ff78cb164641fe141b0780189482701ebda1b66d4a","0xe780841a8c7ccdd14b49db877aa5f4c96632a8a751af71424973cb40b5a8a726"]
    }
```

Generated with discovered.json: 0x9e285b4f843aa0880b0cd0dd80f360cbe2927449

# Diff at Tue, 01 Oct 2024 10:53:59 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@bd754dc73c66120164006054f8d25c5fae9cd910 block: 20420398
- current block number: 20420398

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20420398 (main branch discovery), not current.

```diff
    contract ERC20 Vault V2 (0xe396757EC7E6aC7C8E5ABE7285dde47b98F22db8) {
    +++ description: None
      values.$pastUpgrades:
+        [["2021-12-30T12:33:01.000Z",["0xE01a9c36170b8Fa163C6a54D7aB3015C85e0186c"]],["2022-09-28T12:38:47.000Z",["0xfbc347975C48578F4A25ECeEB61BC16356abE8a2"]],["2022-09-28T16:39:59.000Z",["0xD331E3EB139D1433D1c988D5DC1cd6eCB971233b"]],["2023-05-15T13:06:35.000Z",["0x1cfE92176eefc0C53aF05a298F271C319b73E0aB"]],["2023-05-15T20:54:35.000Z",["0xD331E3EB139D1433D1c988D5DC1cd6eCB971233b"]],["2023-05-17T11:24:59.000Z",["0x34D085516f9D7794192aDB10C995d9c532E335aF"]]]
    }
```

```diff
    contract EthPntv2 (0xf4eA6B892853413bD9d9f1a5D3a620A0ba39c5b2) {
    +++ description: None
      values.$pastUpgrades:
+        [["2022-09-26T16:13:23.000Z",["0x8474a898677C3bc97f35A86c387aE34Bf272C860"]],["2024-01-10T15:43:35.000Z",["0xd88a13c72443D069Fc0d44A4989AC8dd132Ac38b"]]]
    }
```

Generated with discovered.json: 0x4dd3d16bcb573c541fe98468156621eb98a1c4f2

# Diff at Fri, 30 Aug 2024 07:54:24 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@6c1bd1f41fadf5f2cb1c1805b5a2c6138a3ed35a block: 20420398
- current block number: 20420398

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20420398 (main branch discovery), not current.

```diff
    contract ProxyAdmin (0xB6D14DdFBE01AC537accBe35cCd771C30D53c535) {
    +++ description: None
      receivedPermissions.0.via:
-        []
    }
```

```diff
    contract PProxyAdmin (0xDc2c547F6b6a89F1D96d66d50fDCbD69979Aee2a) {
    +++ description: None
      receivedPermissions.0.via:
-        []
    }
```

Generated with discovered.json: 0x3dcae8faf1d880bdc4a9d299f097b6302b0af1b6

# Diff at Fri, 23 Aug 2024 09:54:02 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@67597c7d6c810bc726594446890178150240711e block: 20420398
- current block number: 20420398

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20420398 (main branch discovery), not current.

```diff
    contract ERC20 Vault V2 (0xe396757EC7E6aC7C8E5ABE7285dde47b98F22db8) {
    +++ description: None
      values.$upgradeCount:
+        6
    }
```

```diff
    contract EthPntv2 (0xf4eA6B892853413bD9d9f1a5D3a620A0ba39c5b2) {
    +++ description: None
      values.$upgradeCount:
+        2
    }
```

Generated with discovered.json: 0x4218a10b8cb4ba7c36a13b9db8942e46bbcabac2

# Diff at Wed, 21 Aug 2024 10:04:51 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@2f6dde3357bf5d79196b6e94f79d853a6c4ec72b block: 20420398
- current block number: 20420398

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20420398 (main branch discovery), not current.

```diff
    contract ProxyAdmin (0xB6D14DdFBE01AC537accBe35cCd771C30D53c535) {
    +++ description: None
      assignedPermissions:
-        {"upgrade":["0xf4eA6B892853413bD9d9f1a5D3a620A0ba39c5b2"]}
      receivedPermissions:
+        [{"permission":"upgrade","target":"0xf4eA6B892853413bD9d9f1a5D3a620A0ba39c5b2","via":[]}]
    }
```

```diff
    contract PProxyAdmin (0xDc2c547F6b6a89F1D96d66d50fDCbD69979Aee2a) {
    +++ description: None
      assignedPermissions:
-        {"upgrade":["0xe396757EC7E6aC7C8E5ABE7285dde47b98F22db8"]}
      receivedPermissions:
+        [{"permission":"upgrade","target":"0xe396757EC7E6aC7C8E5ABE7285dde47b98F22db8","via":[]}]
    }
```

```diff
    contract ERC20 Vault V2 (0xe396757EC7E6aC7C8E5ABE7285dde47b98F22db8) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0xDc2c547F6b6a89F1D96d66d50fDCbD69979Aee2a","via":[]}]
    }
```

```diff
    contract EthPntv2 (0xf4eA6B892853413bD9d9f1a5D3a620A0ba39c5b2) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0xB6D14DdFBE01AC537accBe35cCd771C30D53c535","via":[]}]
    }
```

Generated with discovered.json: 0x2a11fac8f34a9d7f6b7ca2645e2cdf3d82b25359

# Diff at Fri, 09 Aug 2024 10:11:15 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@1f0da1d0aab7bc6b3b5e54e7e93480bd98e57035 block: 20420398
- current block number: 20420398

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20420398 (main branch discovery), not current.

```diff
    contract pNetwork Multisig (0xb5977b683c64fce80A1f5b587964b6f77Ee6CfDB) {
    +++ description: None
      values.$multisigThreshold:
-        "2 of 4 (50%)"
      values.getOwners:
-        ["0x4b8736CCB7226F3353aC6c2f98f34bbAc2a68C45","0x3aA6eB007D58dcdfbD5eAD9ef69dd23316887262","0xb95932E9dBC985306699e0D2977FfdDbfaCBdB20","0x3fcf46d517b00289c3620F1EEa8B57Ce3A35Bd1f"]
      values.getThreshold:
-        2
      values.$members:
+        ["0x4b8736CCB7226F3353aC6c2f98f34bbAc2a68C45","0x3aA6eB007D58dcdfbD5eAD9ef69dd23316887262","0xb95932E9dBC985306699e0D2977FfdDbfaCBdB20","0x3fcf46d517b00289c3620F1EEa8B57Ce3A35Bd1f"]
      values.$threshold:
+        2
      values.multisigThreshold:
+        "2 of 4 (50%)"
    }
```

```diff
    contract ProxyAdmin (0xB6D14DdFBE01AC537accBe35cCd771C30D53c535) {
    +++ description: None
      assignedPermissions.admin:
-        ["0xf4eA6B892853413bD9d9f1a5D3a620A0ba39c5b2"]
      assignedPermissions.upgrade:
+        ["0xf4eA6B892853413bD9d9f1a5D3a620A0ba39c5b2"]
    }
```

```diff
    contract PProxyAdmin (0xDc2c547F6b6a89F1D96d66d50fDCbD69979Aee2a) {
    +++ description: None
      assignedPermissions.admin:
-        ["0xe396757EC7E6aC7C8E5ABE7285dde47b98F22db8"]
      assignedPermissions.upgrade:
+        ["0xe396757EC7E6aC7C8E5ABE7285dde47b98F22db8"]
    }
```

Generated with discovered.json: 0xa96fb0fad65d3105e4dfcf5152150b4bcdd0f07b

# Diff at Tue, 30 Jul 2024 15:55:31 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@51c652e40232eac8e60e9b31aa56f09071495fef block: 19926484
- current block number: 20420398

## Description

Ignore PNT (token) discovery.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19926484 (main branch discovery), not current.

```diff
-   Status: DELETED
    contract PNT (0x89Ab32156e46F46D02ade3FEcbe5Fc4243B9AAeD)
    +++ description: None
```

```diff
-   Status: DELETED
    contract RelayHub (0xD216153c06E857cD7f72665E0aF1d7D82172F494)
    +++ description: None
```

Generated with discovered.json: 0xcb1f9edd4134d42632c04eea238473909e88cf06

# Diff at Wed, 22 May 2024 16:03:17 GMT:

- author: sekuba (<sekuba@users.noreply.github.com>)
- comparing to: main@7eae7b47a410c2b8cc7e6a7d7a0bc841a31c6e83 block: 19767570
- current block number: 19926484

## Description

Total supply reduction of the PNT token after a PNT burn in [this transaction](https://dashboard.tenderly.co/tx/mainnet/0x3bba4fb6de00dd38df3ad68e51c19fe575a95a296e0632028f101c5199b6f714), which looks like a hack:

- flashloan from balancer
- used private tx relay
- unverified deployed contract used for attack
- attacker funded by and mixed to railgun
- very complicated tx, only 2 eth stolen it seems

## Watched changes

```diff
    contract PNT (0x89Ab32156e46F46D02ade3FEcbe5Fc4243B9AAeD) {
    +++ description: None
      values.totalSupply:
-        "87975228709640845629432729"
+        "87973007722997040030171772"
    }
```

Generated with discovered.json: 0x7e4c2d53c6a581dfde5f9db818b3de1fe4e1cd1e

# Diff at Thu, 28 Mar 2024 10:34:28 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@dd32bb06b292cc8459fb09925454ee3a90f5c27e block: 19375664
- current block number: 19532042

## Description

Update discovery to include the multisig threshold.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19375664 (main branch discovery), not current.

```diff
    contract pNetwork Multisig (0xb5977b683c64fce80A1f5b587964b6f77Ee6CfDB) {
    +++ description: None
      upgradeability.threshold:
+        "2 of 4 (50%)"
    }
```

Generated with discovered.json: 0x291bd7fd91be18fd4ed6c946a065b180ce88e00c

# Diff at Wed, 21 Feb 2024 08:21:41 GMT:

- author: Radina Talanova (<nt.radina@gmail.com>)
- comparing to: main@f247182ed17ab198e708715bad7d245c5212992d block: 19118450
- current block number: 19274813

## Description

Changes related to the inflation mechanism for the ethPNT token (introduced with previous changes below). The values below get updated for each new month/year.

## Watched changes

```diff
    contract EthPntv2 (0xf4eA6B892853413bD9d9f1a5D3a620A0ba39c5b2) {
      values.currentMonthNumber:
-        0
+        1
      values.currentMonthWithdrawnAmount:
-        "1100000000000000000000000"
+        "360000000000000000000000"
      values.currentYearWithdrawnAmount:
-        "1100000000000000000000000"
+        "1460000000000000000000000"
      values.maxWithdrawableAmounts.1:
-        "18255045741928169125886545"
+        "17895045741928169125886545"
      values.maxWithdrawableAmounts.0:
-        "835504574192816912588654"
+        "1575504574192816912588654"
      values.totalSupply:
-        "9900000000000000000000000"
+        "10260000000000000000000000"
    }
```

Generated with discovered.json: 0x8209f29438745b169ea4fcac0c17ac2784cf83c8

# Diff at Tue, 30 Jan 2024 09:32:52 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@8166c01da21cd9a7fadf2664669d7d2675512e02 block: 19076850
- current block number: 19118450

## Description

In the pNetwork's DAO voting contract each new vote is counted.
That is what happened here, somebody voted and their vote was counted.
Nothing more, nothing less.
Ignored this field in watch mode.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19076850 (main branch discovery), not current.

```diff
    contract DandelionVoting (0x2211bFD97b1c02aE8Ac305d206e9780ba7D8BfF4) {
      name:
-        "DandelionVoting"
+        "pNetworkDAOVoting"
      derivedName:
+        "DandelionVoting"
    }
```

Generated with discovered.json: 0x29eb7fc6046fc25e5f151bc71f6086820421492f

# Diff at Fri, 19 Jan 2024 11:48:15 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@a25b693cc3754074753705b502d4656fdd29ecbb block: 17288492
- current block number: 19040706

## Description

Update from pNetwork: https://pnetwork-association.org/periodic-updates#33cfe18be3904f8b834a461e06074b04

pNetworkToken has received an update in which controlled inflation is added.
From the blog post above I assume that the inflation is there to help finance the pNetwork V3.
The inflation has an owner and a whitelist of actors who are able to receive it.
Two caps are placed, monthly (2%) and yearly (20%), the cap can be only lowered, it can't be increased.
Max withdraw amount is calculated as `max = initialSupply * rate` for monthly and yearly caps.
In each month/year only this much can be minted and withdrawn, this gets reset for each new month/year.
To collect the owner has to call `withdrawInflation()` and specify who and how much inflation should receive.
Minting happens in that call, so if the owner does not withdraw in given month it results in zero inflation in that month.
The only whitelisted collector of inflation at the moment is the pNetwork's DAO Treasury and the owner is the DAO's voting contract.

## Watched changes

```diff
    contract EthPnt (0xf4eA6B892853413bD9d9f1a5D3a620A0ba39c5b2) {
      name:
-        "EthPnt"
+        "EthPntv2"
      upgradeability.implementation:
-        "0x8474a898677C3bc97f35A86c387aE34Bf272C860"
+        "0xd88a13c72443D069Fc0d44A4989AC8dd132Ac38b"
      implementations.0:
-        "0x8474a898677C3bc97f35A86c387aE34Bf272C860"
+        "0xd88a13c72443D069Fc0d44A4989AC8dd132Ac38b"
      values.totalSupply:
-        "8800000000000000000000000"
+        "9900000000000000000000000"
      values.currentMonthNumber:
+        0
      values.currentMonthWithdrawnAmount:
+        "1100000000000000000000000"
      values.currentYearNumber:
+        0
      values.currentYearWithdrawnAmount:
+        "1100000000000000000000000"
      values.inflationOwner:
+        "0x2211bFD97b1c02aE8Ac305d206e9780ba7D8BfF4"
      values.isWhitelistingEnabled:
+        true
      values.maxWithdrawableAmounts:
+        ["835504574192816912588654","18255045741928169125886545"]
      values.monthlyRateCap:
+        200
      values.monthlyWithdrawableLimit:
+        "1935504574192816912588654"
      values.PNT_INIT_TOTAL_SUPPLY:
+        "96775228709640845629432729"
      values.RATE_DIVISOR:
+        10000
      values.yearlyRateCap:
+        2000
      values.yearlyWithdrawableLimit:
+        "19355045741928169125886545"
    }
```

```diff
+   Status: CREATED
    contract DandelionVoting (0x2211bFD97b1c02aE8Ac305d206e9780ba7D8BfF4) {
    }
```

```diff
+   Status: CREATED
    contract Kernel (0x2732fD9fD5F0E84B1b774cf5E6f5c812EAfd455b) {
    }
```

```diff
+   Status: CREATED
    contract EVMScriptRegistry (0x47d12498Ed2E9EFA9ECA2EcD05ba857253824478) {
    }
```

```diff
+   Status: CREATED
    contract MiniMeTokenFactory (0xA29EF584c389c67178aE9152aC9C543f9156E2B3) {
    }
```

```diff
+   Status: CREATED
    contract TokenManager (0xD7E8E79d318eCE001B39D83Ea891ebD5fC22d254) {
    }
```

```diff
+   Status: CREATED
    contract MiniMeToken (0xe824F81cD136BB7a28480baF8d7E5f0E8E4B693E) {
    }
```

```diff
+   Status: CREATED
    contract ACL (0xFDcae423E5e92B76FE7D1e2bcabd36fca8a6a8Fe) {
    }
```

## Source code changes

```diff
.../ethereum/.code/ACL/implementation/acl/ACL.sol  |  468 +++++
 .../ACL/implementation/acl/ACLSyntaxSugar.sol      |  103 +
 .../ethereum/.code/ACL/implementation/acl/IACL.sol |   15 +
 .../.code/ACL/implementation/acl/IACLOracle.sol    |   11 +
 .../.code/ACL/implementation/apps/AppStorage.sol   |   36 +
 .../.code/ACL/implementation/apps/AragonApp.sol    |   70 +
 .../ACL/implementation/common/Autopetrified.sol    |   16 +
 .../implementation/common/EtherTokenConstant.sol   |   13 +
 .../implementation/common/IVaultRecoverable.sol    |   14 +
 .../ACL/implementation/common/Initializable.sol    |   59 +
 .../.code/ACL/implementation/common/IsContract.sol |   26 +
 .../ACL/implementation/common/Petrifiable.sol      |   25 +
 .../ACL/implementation/common/TimeHelpers.sol      |   48 +
 .../ACL/implementation/common/Uint256Helpers.sol   |   11 +
 .../implementation/common/UnstructuredStorage.sol  |   41 +
 .../ACL/implementation/common/VaultRecoverable.sol |   46 +
 .../implementation/evmscript/EVMScriptRunner.sol   |   75 +
 .../evmscript/IEVMScriptExecutor.sol               |   12 +
 .../evmscript/IEVMScriptRegistry.sol               |   25 +
 .../.code/ACL/implementation/flattened.sol         | 1203 +++++++++++
 .../.code/ACL/implementation/kernel/IKernel.sol    |   20 +
 .../ACL/implementation/kernel/KernelConstants.sol  |   30 +
 .../.code/ACL/implementation/lib/token/ERC20.sol   |   38 +
 .../ethereum/.code/ACL/implementation/meta.txt     |    2 +
 .../pNetwork/ethereum/.code/ACL/proxy/acl/IACL.sol |   16 +
 .../ethereum/.code/ACL/proxy/apps/AppProxyBase.sol |   39 +
 .../.code/ACL/proxy/apps/AppProxyUpgradeable.sol   |   33 +
 .../ethereum/.code/ACL/proxy/apps/AppStorage.sol   |   37 +
 .../.code/ACL/proxy/common/DelegateProxy.sol       |   32 +
 .../ACL/proxy/common/DepositableDelegateProxy.sol  |   45 +
 .../.code/ACL/proxy/common/DepositableStorage.sol  |   20 +
 .../.code/ACL/proxy/common/IVaultRecoverable.sol   |   17 +
 .../ethereum/.code/ACL/proxy/common/IsContract.sol |   27 +
 .../.code/ACL/proxy/common/UnstructuredStorage.sol |   42 +
 .../ethereum/.code/ACL/proxy/flattened.sol         |  392 ++++
 .../ethereum/.code/ACL/proxy/kernel/IKernel.sol    |   24 +
 .../.code/ACL/proxy/kernel/KernelConstants.sol     |   31 +
 .../ethereum/.code/ACL/proxy/lib/misc/ERCProxy.sol |   16 +
 .../pNetwork/ethereum/.code/ACL/proxy/meta.txt     |    2 +
 .../contracts/TokenManagerHook.sol                 |   83 +
 .../contracts/TimeHelpersMock.sol                  |   75 +
 .../@aragon/minime/contracts/ITokenController.sol  |   27 +
 .../@aragon/minime/contracts/MiniMeToken.sol       |  579 ++++++
 .../@aragon/os/contracts/acl/ACL.sol               |  467 +++++
 .../@aragon/os/contracts/acl/ACLSyntaxSugar.sol    |  104 +
 .../@aragon/os/contracts/acl/IACL.sol              |   14 +
 .../@aragon/os/contracts/acl/IACLOracle.sol        |   10 +
 .../@aragon/os/contracts/apps/AppProxyBase.sol     |   38 +
 .../@aragon/os/contracts/apps/AppProxyPinned.sol   |   49 +
 .../os/contracts/apps/AppProxyUpgradeable.sol      |   33 +
 .../@aragon/os/contracts/apps/AppStorage.sol       |   36 +
 .../@aragon/os/contracts/apps/AragonApp.sol        |   68 +
 .../@aragon/os/contracts/common/Autopetrified.sol  |   16 +
 .../os/contracts/common/ConversionHelpers.sol      |   30 +
 .../@aragon/os/contracts/common/DelegateProxy.sol  |   31 +
 .../contracts/common/DepositableDelegateProxy.sol  |   44 +
 .../os/contracts/common/DepositableStorage.sol     |   19 +
 .../os/contracts/common/EtherTokenConstant.sol     |   12 +
 .../@aragon/os/contracts/common/IForwarder.sol     |   18 +
 .../os/contracts/common/IVaultRecoverable.sol      |   15 +
 .../@aragon/os/contracts/common/Initializable.sol  |   59 +
 .../@aragon/os/contracts/common/IsContract.sol     |   25 +
 .../@aragon/os/contracts/common/Petrifiable.sol    |   25 +
 .../os/contracts/common/ReentrancyGuard.sol        |   33 +
 .../@aragon/os/contracts/common/SafeERC20.sol      |  169 ++
 .../@aragon/os/contracts/common/TimeHelpers.sol    |   48 +
 .../@aragon/os/contracts/common/Uint256Helpers.sol |   13 +
 .../os/contracts/common/UnstructuredStorage.sol    |   40 +
 .../os/contracts/common/VaultRecoverable.sol       |   55 +
 .../os/contracts/evmscript/EVMScriptRegistry.sol   |  110 +
 .../os/contracts/evmscript/EVMScriptRunner.sol     |  109 +
 .../os/contracts/evmscript/IEVMScriptExecutor.sol  |   11 +
 .../os/contracts/evmscript/IEVMScriptRegistry.sol  |   25 +
 .../os/contracts/evmscript/ScriptHelpers.sol       |   48 +
 .../evmscript/executors/BaseEVMScriptExecutor.sol  |   13 +
 .../contracts/evmscript/executors/CallsScript.sol  |  101 +
 .../os/contracts/factory/AppProxyFactory.sol       |   54 +
 .../@aragon/os/contracts/factory/DAOFactory.sol    |   77 +
 .../contracts/factory/EVMScriptRegistryFactory.sol |   45 +
 .../@aragon/os/contracts/kernel/IKernel.sol        |   23 +
 .../@aragon/os/contracts/kernel/Kernel.sol         |  238 +++
 .../os/contracts/kernel/KernelConstants.sol        |   29 +
 .../@aragon/os/contracts/kernel/KernelProxy.sol    |   40 +
 .../@aragon/os/contracts/kernel/KernelStorage.sol  |    8 +
 .../@aragon/os/contracts/lib/math/SafeMath.sol     |   73 +
 .../@aragon/os/contracts/lib/math/SafeMath64.sol   |   67 +
 .../@aragon/os/contracts/lib/misc/ERCProxy.sol     |   14 +
 .../@aragon/os/contracts/lib/token/ERC20.sol       |   37 +
 .../implementation/contracts/DandelionVoting.sol   |  552 +++++
 .../implementation/contracts/SigUtils.sol          |   59 +
 .../implementation/contracts/test/TestImports.sol  |   26 +
 .../contracts/test/mocks/ExecutionTarget.sol       |   17 +
 .../contracts/test/mocks/VotingMock.sol            |   29 +
 .../.code/DandelionVoting/implementation/meta.txt  |    2 +
 .../.code/DandelionVoting/proxy/acl/IACL.sol       |   16 +
 .../DandelionVoting/proxy/apps/AppProxyBase.sol    |   39 +
 .../proxy/apps/AppProxyUpgradeable.sol             |   33 +
 .../DandelionVoting/proxy/apps/AppStorage.sol      |   37 +
 .../DandelionVoting/proxy/common/DelegateProxy.sol |   32 +
 .../proxy/common/DepositableDelegateProxy.sol      |   45 +
 .../proxy/common/DepositableStorage.sol            |   20 +
 .../proxy/common/IVaultRecoverable.sol             |   17 +
 .../DandelionVoting/proxy/common/IsContract.sol    |   27 +
 .../proxy/common/UnstructuredStorage.sol           |   42 +
 .../.code/DandelionVoting/proxy/flattened.sol      |  392 ++++
 .../.code/DandelionVoting/proxy/kernel/IKernel.sol |   24 +
 .../proxy/kernel/KernelConstants.sol               |   31 +
 .../DandelionVoting/proxy/lib/misc/ERCProxy.sol    |   16 +
 .../ethereum/.code/DandelionVoting/proxy/meta.txt  |    2 +
 .../implementation/acl/ACLSyntaxSugar.sol          |  106 +
 .../EVMScriptRegistry/implementation/acl/IACL.sol  |   16 +
 .../implementation/apps/AppStorage.sol             |   37 +
 .../implementation/apps/AragonApp.sol              |   69 +
 .../implementation/common/Autopetrified.sol        |   17 +
 .../implementation/common/ConversionHelpers.sol    |   32 +
 .../implementation/common/EtherTokenConstant.sol   |   14 +
 .../implementation/common/IVaultRecoverable.sol    |   17 +
 .../implementation/common/Initializable.sol        |   60 +
 .../implementation/common/IsContract.sol           |   27 +
 .../implementation/common/Petrifiable.sol          |   26 +
 .../implementation/common/ReentrancyGuard.sol      |   34 +
 .../implementation/common/SafeERC20.sol            |  170 ++
 .../implementation/common/TimeHelpers.sol          |   49 +
 .../implementation/common/Uint256Helpers.sol       |   15 +
 .../implementation/common/UnstructuredStorage.sol  |   42 +
 .../implementation/common/VaultRecoverable.sol     |   56 +
 .../implementation/evmscript/EVMScriptRegistry.sol |  110 +
 .../implementation/evmscript/EVMScriptRunner.sol   |  109 +
 .../evmscript/IEVMScriptExecutor.sol               |   13 +
 .../evmscript/IEVMScriptRegistry.sol               |   26 +
 .../implementation/evmscript/ScriptHelpers.sol     |   50 +
 .../EVMScriptRegistry/implementation/flattened.sol | 1214 +++++++++++
 .../implementation/kernel/IKernel.sol              |   24 +
 .../implementation/kernel/KernelConstants.sol      |   31 +
 .../implementation/lib/token/ERC20.sol             |   39 +
 .../EVMScriptRegistry/implementation/meta.txt      |    2 +
 .../.code/EVMScriptRegistry/proxy/acl/IACL.sol     |   16 +
 .../EVMScriptRegistry/proxy/apps/AppProxyBase.sol  |   39 +
 .../proxy/apps/AppProxyPinned.sol                  |   49 +
 .../EVMScriptRegistry/proxy/apps/AppStorage.sol    |   37 +
 .../proxy/common/DelegateProxy.sol                 |   32 +
 .../proxy/common/DepositableDelegateProxy.sol      |   45 +
 .../proxy/common/DepositableStorage.sol            |   20 +
 .../proxy/common/IVaultRecoverable.sol             |   17 +
 .../EVMScriptRegistry/proxy/common/IsContract.sol  |   27 +
 .../proxy/common/UnstructuredStorage.sol           |   42 +
 .../.code/EVMScriptRegistry/proxy/flattened.sol    |  408 ++++
 .../EVMScriptRegistry/proxy/kernel/IKernel.sol     |   24 +
 .../proxy/kernel/KernelConstants.sol               |   31 +
 .../EVMScriptRegistry/proxy/lib/misc/ERCProxy.sol  |   16 +
 .../.code/EVMScriptRegistry/proxy/meta.txt         |    2 +
 .../contracts/EthPnt.sol => /dev/null              |   12 -
 .../EthPnt/implementation/meta.txt => /dev/null    |    2 -
 .../proxy/utils/Initializable.sol                  |    0
 .../token/ERC20/ERC20Upgradeable.sol               |    0
 .../token/ERC20/IERC20Upgradeable.sol              |    0
 .../ERC20/extensions/ERC20BurnableUpgradeable.sol  |    0
 .../ERC20/extensions/IERC20MetadataUpgradeable.sol |    0
 .../extensions/draft-ERC20PermitUpgradeable.sol    |    0
 .../extensions/draft-IERC20PermitUpgradeable.sol   |    0
 .../presets/ERC20PresetFixedSupplyUpgradeable.sol  |    0
 .../utils/AddressUpgradeable.sol                   |    0
 .../utils/ContextUpgradeable.sol                   |    0
 .../utils/CountersUpgradeable.sol                  |    0
 .../utils/StringsUpgradeable.sol                   |    0
 .../utils/cryptography/ECDSAUpgradeable.sol        |    0
 .../utils/cryptography/draft-EIP712Upgradeable.sol |    0
 .../EthPntv2/implementation/contracts/EthPntv2.sol |  203 ++
 .../.code/EthPntv2/implementation/meta.txt         |    2 +
 .../@openzeppelin/contracts/access/Ownable.sol     |    0
 .../contracts/proxy/ERC1967/ERC1967Proxy.sol       |    0
 .../contracts/proxy/ERC1967/ERC1967Upgrade.sol     |    0
 .../proxy/@openzeppelin/contracts/proxy/Proxy.sol  |    0
 .../contracts/proxy/beacon/IBeacon.sol             |    0
 .../contracts/proxy/transparent/ProxyAdmin.sol     |    0
 .../transparent/TransparentUpgradeableProxy.sol    |    0
 .../contracts/proxy/utils/UUPSUpgradeable.sol      |    0
 .../@openzeppelin/contracts/utils/Address.sol      |    0
 .../@openzeppelin/contracts/utils/Context.sol      |    0
 .../@openzeppelin/contracts/utils/StorageSlot.sol  |    0
 .../EthPntv2}/proxy/contracts/import.sol           |    0
 .../EthPntv2}/proxy/contracts/test/Proxiable.sol   |    0
 .../EthPnt => .code/EthPntv2}/proxy/meta.txt       |    0
 .../Kernel/implementation/acl/ACLSyntaxSugar.sol   |  106 +
 .../.code/Kernel/implementation/acl/IACL.sol       |   16 +
 .../Kernel/implementation/apps/AppProxyBase.sol    |   39 +
 .../Kernel/implementation/apps/AppProxyPinned.sol  |   50 +
 .../implementation/apps/AppProxyUpgradeable.sol    |   34 +
 .../Kernel/implementation/apps/AppStorage.sol      |   37 +
 .../implementation/common/ConversionHelpers.sol    |   32 +
 .../Kernel/implementation/common/DelegateProxy.sol |   32 +
 .../common/DepositableDelegateProxy.sol            |   45 +
 .../implementation/common/DepositableStorage.sol   |   20 +
 .../implementation/common/EtherTokenConstant.sol   |   14 +
 .../implementation/common/IVaultRecoverable.sol    |   17 +
 .../Kernel/implementation/common/Initializable.sol |   60 +
 .../Kernel/implementation/common/IsContract.sol    |   27 +
 .../Kernel/implementation/common/Petrifiable.sol   |   26 +
 .../Kernel/implementation/common/SafeERC20.sol     |  170 ++
 .../Kernel/implementation/common/TimeHelpers.sol   |   49 +
 .../implementation/common/Uint256Helpers.sol       |   15 +
 .../implementation/common/UnstructuredStorage.sol  |   42 +
 .../implementation/common/VaultRecoverable.sol     |   56 +
 .../implementation/factory/AppProxyFactory.sol     |   55 +
 .../.code/Kernel/implementation/flattened.sol      | 1327 ++++++++++++
 .../.code/Kernel/implementation/kernel/IKernel.sol |   24 +
 .../.code/Kernel/implementation/kernel/Kernel.sol  |  238 +++
 .../implementation/kernel/KernelConstants.sol      |   31 +
 .../Kernel/implementation/kernel/KernelStorage.sol |   10 +
 .../Kernel/implementation/lib/misc/ERCProxy.sol    |   16 +
 .../Kernel/implementation/lib/token/ERC20.sol      |   39 +
 .../ethereum/.code/Kernel/implementation/meta.txt  |    2 +
 .../ethereum/.code/Kernel/proxy/acl/IACL.sol       |   16 +
 .../.code/Kernel/proxy/common/DelegateProxy.sol    |   32 +
 .../proxy/common/DepositableDelegateProxy.sol      |   45 +
 .../Kernel/proxy/common/DepositableStorage.sol     |   20 +
 .../Kernel/proxy/common/IVaultRecoverable.sol      |   17 +
 .../.code/Kernel/proxy/common/IsContract.sol       |   27 +
 .../Kernel/proxy/common/UnstructuredStorage.sol    |   42 +
 .../ethereum/.code/Kernel/proxy/flattened.sol      |  332 +++
 .../ethereum/.code/Kernel/proxy/kernel/IKernel.sol |   24 +
 .../.code/Kernel/proxy/kernel/KernelConstants.sol  |   31 +
 .../.code/Kernel/proxy/kernel/KernelProxy.sol      |   40 +
 .../.code/Kernel/proxy/kernel/KernelStorage.sol    |   10 +
 .../.code/Kernel/proxy/lib/misc/ERCProxy.sol       |   16 +
 .../pNetwork/ethereum/.code/Kernel/proxy/meta.txt  |    2 +
 .../.code/MiniMeToken/ITokenController.sol         |   30 +
 .../ethereum/.code/MiniMeToken/MiniMeToken.sol     |  577 ++++++
 .../ethereum/.code/MiniMeToken/flattened.sol       |  604 ++++++
 .../pNetwork/ethereum/.code/MiniMeToken/meta.txt   |    2 +
 .../MiniMeTokenFactory/MiniMeTokenFactory.sol      |  600 ++++++
 .../ethereum/.code/MiniMeTokenFactory/meta.txt     |    2 +
 .../contracts/ITokenController.sol                 |   29 +
 .../apps-shared-minime/contracts/MiniMeToken.sol   |  576 ++++++
 .../@aragon/os/contracts/acl/ACLSyntaxSugar.sol    |  106 +
 .../@aragon/os/contracts/acl/IACL.sol              |   16 +
 .../@aragon/os/contracts/apps/AppStorage.sol       |   37 +
 .../@aragon/os/contracts/apps/AragonApp.sol        |   69 +
 .../@aragon/os/contracts/common/Autopetrified.sol  |   17 +
 .../os/contracts/common/ConversionHelpers.sol      |   32 +
 .../os/contracts/common/EtherTokenConstant.sol     |   14 +
 .../@aragon/os/contracts/common/IForwarder.sol     |   20 +
 .../os/contracts/common/IVaultRecoverable.sol      |   17 +
 .../@aragon/os/contracts/common/Initializable.sol  |   60 +
 .../@aragon/os/contracts/common/IsContract.sol     |   27 +
 .../@aragon/os/contracts/common/Petrifiable.sol    |   26 +
 .../os/contracts/common/ReentrancyGuard.sol        |   34 +
 .../@aragon/os/contracts/common/SafeERC20.sol      |  157 ++
 .../@aragon/os/contracts/common/TimeHelpers.sol    |   49 +
 .../@aragon/os/contracts/common/Uint256Helpers.sol |   15 +
 .../os/contracts/common/UnstructuredStorage.sol    |   42 +
 .../os/contracts/common/VaultRecoverable.sol       |   56 +
 .../os/contracts/evmscript/EVMScriptRunner.sol     |  109 +
 .../os/contracts/evmscript/IEVMScriptExecutor.sol  |   13 +
 .../os/contracts/evmscript/IEVMScriptRegistry.sol  |   26 +
 .../@aragon/os/contracts/kernel/IKernel.sol        |   24 +
 .../os/contracts/kernel/KernelConstants.sol        |   31 +
 .../@aragon/os/contracts/lib/math/SafeMath.sol     |   75 +
 .../@aragon/os/contracts/lib/token/ERC20.sol       |   39 +
 .../implementation/contracts/TokenManager.sol      |  414 ++++
 .../TokenManager/implementation/flattened.sol      | 2158 ++++++++++++++++++++
 .../.code/TokenManager/implementation/meta.txt     |    2 +
 .../ethereum/.code/TokenManager/proxy/acl/IACL.sol |   16 +
 .../.code/TokenManager/proxy/apps/AppProxyBase.sol |   39 +
 .../proxy/apps/AppProxyUpgradeable.sol             |   33 +
 .../.code/TokenManager/proxy/apps/AppStorage.sol   |   37 +
 .../TokenManager/proxy/common/DelegateProxy.sol    |   32 +
 .../proxy/common/DepositableDelegateProxy.sol      |   45 +
 .../proxy/common/DepositableStorage.sol            |   20 +
 .../proxy/common/IVaultRecoverable.sol             |   17 +
 .../.code/TokenManager/proxy/common/IsContract.sol |   27 +
 .../proxy/common/UnstructuredStorage.sol           |   42 +
 .../.code/TokenManager/proxy/flattened.sol         |  392 ++++
 .../.code/TokenManager/proxy/kernel/IKernel.sol    |   24 +
 .../TokenManager/proxy/kernel/KernelConstants.sol  |   31 +
 .../.code/TokenManager/proxy/lib/misc/ERCProxy.sol |   16 +
 .../ethereum/.code/TokenManager/proxy/meta.txt     |    2 +
 277 files changed, 21571 insertions(+), 14 deletions(-)
```
