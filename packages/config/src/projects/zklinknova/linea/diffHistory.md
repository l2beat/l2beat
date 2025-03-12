Generated with discovered.json: 0xa6166107aa48e0a23088977796fcffc5f635f0ca

# Diff at Tue, 04 Mar 2025 10:41:19 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@98d260b45fe0d2195ce5e629bd7b200c8706e8ba block: 9010064
- current block number: 9010064

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 9010064 (main branch discovery), not current.

```diff
    contract LineaOwner (0x0Bff4B38792a95314b3463E1Bf9831BDa1995391) {
    +++ description: None
      sinceBlock:
+        244397
    }
```

```diff
    contract ValidatorTimelock (0x509ff56c152315EdeE91A2e0f059195519507e01) {
    +++ description: None
      sinceBlock:
+        2779975
    }
```

```diff
    contract zkLink (0x5Cb18b6e4e6F3b46Ce646b0f4704D53724C5Df05) {
    +++ description: None
      sinceBlock:
+        2590041
    }
```

```diff
    contract L1ERC20Bridge (0x62cE247f34dc316f93D3830e4Bf10959FCe630f8) {
    +++ description: None
      sinceBlock:
+        2590048
    }
```

```diff
    contract LineaL2Gateway (0x7b5780d6df85A7dF96a3e1A019639a1dbDe937dB) {
    +++ description: None
      sinceBlock:
+        2605406
    }
```

```diff
    contract Verifier (0x902C3806A84f4e855a8746e92d7F1C9a51400458) {
    +++ description: None
      sinceBlock:
+        2590010
    }
```

```diff
    contract Governance (0xeF528a8Ca4B6aFDB6716Ef9f11bCa0c5C47454ec) {
    +++ description: None
      sinceBlock:
+        2590022
    }
```

Generated with discovered.json: 0x2ce3103541e071f6b93aa869695f8924ce364d93

# Diff at Mon, 20 Jan 2025 11:10:45 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@2c8b4f3d9910bb6371be9b4df87b70856e7d8c64 block: 9010064
- current block number: 9010064

## Description

Rerun on the same block number. Applies fixes to permissions and via field. Renames permission's target to to/from.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 9010064 (main branch discovery), not current.

```diff
    contract LineaOwner (0x0Bff4B38792a95314b3463E1Bf9831BDa1995391) {
    +++ description: None
      receivedPermissions.0.target:
-        "0x7b5780d6df85A7dF96a3e1A019639a1dbDe937dB"
      receivedPermissions.0.from:
+        "0x7b5780d6df85A7dF96a3e1A019639a1dbDe937dB"
    }
```

```diff
    contract L1ERC20Bridge (0x62cE247f34dc316f93D3830e4Bf10959FCe630f8) {
    +++ description: None
      issuedPermissions.0.target:
-        "0xeF528a8Ca4B6aFDB6716Ef9f11bCa0c5C47454ec"
      issuedPermissions.0.to:
+        "0xeF528a8Ca4B6aFDB6716Ef9f11bCa0c5C47454ec"
    }
```

```diff
    contract LineaL2Gateway (0x7b5780d6df85A7dF96a3e1A019639a1dbDe937dB) {
    +++ description: None
      issuedPermissions.0.target:
-        "0x0Bff4B38792a95314b3463E1Bf9831BDa1995391"
      issuedPermissions.0.to:
+        "0x0Bff4B38792a95314b3463E1Bf9831BDa1995391"
    }
```

```diff
    contract Governance (0xeF528a8Ca4B6aFDB6716Ef9f11bCa0c5C47454ec) {
    +++ description: None
      receivedPermissions.0.target:
-        "0x62cE247f34dc316f93D3830e4Bf10959FCe630f8"
      receivedPermissions.0.from:
+        "0x62cE247f34dc316f93D3830e4Bf10959FCe630f8"
    }
```

Generated with discovered.json: 0x83ea202607da95d7e69fe9398b6a8f17c9080388

# Diff at Mon, 21 Oct 2024 11:25:22 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@8895d33866f5665c4c710f4ddaa32bfa63cc3c78 block: 9010064
- current block number: 9010064

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 9010064 (main branch discovery), not current.

```diff
    contract zkLink (0x5Cb18b6e4e6F3b46Ce646b0f4704D53724C5Df05) {
    +++ description: None
      values.$pastUpgrades.5.2:
+        ["0xB76Ee80B3344D86580C990638bDE1915E58d2c6f","0xF3d053C29666D653Fa8629190579844BffE9FB92","0x495220D99B432b0de3e1F1fe206AA0E26A051C63","0x9f2E11F287733c4EF5B9A6ED923b780c28062727"]
      values.$pastUpgrades.5.1:
-        ["0xB76Ee80B3344D86580C990638bDE1915E58d2c6f","0xF3d053C29666D653Fa8629190579844BffE9FB92","0x495220D99B432b0de3e1F1fe206AA0E26A051C63","0x9f2E11F287733c4EF5B9A6ED923b780c28062727"]
+        "0x63cc92d7d7f235ed4094027a72b93973cb159c4cca509f669668032a0b6d9e96"
      values.$pastUpgrades.4.2:
+        ["0x2b1f8EcEc8C5E09395D83910b5Cbf0E149E271DC","0xF3d053C29666D653Fa8629190579844BffE9FB92","0x253AbB100Dd2606e73E41A26D03269fd13de5548","0x268F47D6058c3122131e2f8Df1B634793e4B0a7c"]
      values.$pastUpgrades.4.1:
-        ["0x2b1f8EcEc8C5E09395D83910b5Cbf0E149E271DC","0xF3d053C29666D653Fa8629190579844BffE9FB92","0x253AbB100Dd2606e73E41A26D03269fd13de5548","0x268F47D6058c3122131e2f8Df1B634793e4B0a7c"]
+        "0x72a67f79ae66e93c75e22e06ccc384e73bcf1be4dfb587597aee5467c7f2bddf"
      values.$pastUpgrades.3.2:
+        ["0xcE8E69a2685c80Eb6bd825d0552f44BB34f35503","0xb1d0354063527E4426c4bEcbDB75fE0fb112e3CB","0x11bf5BC6327f7BECB0AE753932A181c8fB5780bA","0x1b19287CE898217D937571EABa97ec50F27d1206"]
      values.$pastUpgrades.3.1:
-        ["0xcE8E69a2685c80Eb6bd825d0552f44BB34f35503","0xb1d0354063527E4426c4bEcbDB75fE0fb112e3CB","0x11bf5BC6327f7BECB0AE753932A181c8fB5780bA","0x1b19287CE898217D937571EABa97ec50F27d1206"]
+        "0xe5ccaa4de67ac346e3a8360734dc8d32e894e60ef78686734428bc400f621781"
      values.$pastUpgrades.2.2:
+        ["0x73B076425025A3Bf059001D5bE0E21384C8cf049","0xfE3EB2e5AfaA936093C0DD2dB8898F4a2643FfE0","0x5e7077bf147Fc1Bb8f46039cc40bBd39F2dDfEa0","0x841f709F4219a1283300c0250cA7c582aD2B289c"]
      values.$pastUpgrades.2.1:
-        ["0x73B076425025A3Bf059001D5bE0E21384C8cf049","0xfE3EB2e5AfaA936093C0DD2dB8898F4a2643FfE0","0x5e7077bf147Fc1Bb8f46039cc40bBd39F2dDfEa0","0x841f709F4219a1283300c0250cA7c582aD2B289c"]
+        "0xdc95a41e73ce7a4cb3200d9b2ecdcb33b548678392e2ac62e35dfc10e37f3308"
      values.$pastUpgrades.1.2:
+        ["0x73B076425025A3Bf059001D5bE0E21384C8cf049","0xfE3EB2e5AfaA936093C0DD2dB8898F4a2643FfE0","0x5e7077bf147Fc1Bb8f46039cc40bBd39F2dDfEa0","0x841f709F4219a1283300c0250cA7c582aD2B289c"]
      values.$pastUpgrades.1.1:
-        ["0x73B076425025A3Bf059001D5bE0E21384C8cf049","0xfE3EB2e5AfaA936093C0DD2dB8898F4a2643FfE0","0x5e7077bf147Fc1Bb8f46039cc40bBd39F2dDfEa0","0x841f709F4219a1283300c0250cA7c582aD2B289c"]
+        "0x33b1bba23b3c4bf16fb2b10b47dfda138dc2ff659fc32e2d0926b716e76f3dbc"
      values.$pastUpgrades.0.2:
+        ["0x73B076425025A3Bf059001D5bE0E21384C8cf049","0xfE3EB2e5AfaA936093C0DD2dB8898F4a2643FfE0","0x6052B353022dA2C61a999bf081C349260de993Af","0x5e7077bf147Fc1Bb8f46039cc40bBd39F2dDfEa0"]
      values.$pastUpgrades.0.1:
-        ["0x73B076425025A3Bf059001D5bE0E21384C8cf049","0xfE3EB2e5AfaA936093C0DD2dB8898F4a2643FfE0","0x6052B353022dA2C61a999bf081C349260de993Af","0x5e7077bf147Fc1Bb8f46039cc40bBd39F2dDfEa0"]
+        "0x819d006b90a1059b199bc80dd0bdc799ff3bfc4835056c5a818ebe4d6e7a0b2e"
    }
```

```diff
    contract L1ERC20Bridge (0x62cE247f34dc316f93D3830e4Bf10959FCe630f8) {
    +++ description: None
      values.$pastUpgrades.1.2:
+        ["0xDe1d7311d3eb7bc94f7EBAEd86978d3a82d5328A"]
      values.$pastUpgrades.1.1:
-        ["0xDe1d7311d3eb7bc94f7EBAEd86978d3a82d5328A"]
+        "0x151e5e3496cc0cfa545a4515a036154bb172dea85ccafce5563b408a83793570"
      values.$pastUpgrades.0.2:
+        ["0xB8017A397E7844635c5a2750d0BEB2af97506461"]
      values.$pastUpgrades.0.1:
-        ["0xB8017A397E7844635c5a2750d0BEB2af97506461"]
+        "0xd4a7bf62cc26e7852b2f27b65739c9d3fb4c0f7ad57757d0a854391c9b1395c3"
    }
```

```diff
    contract LineaL2Gateway (0x7b5780d6df85A7dF96a3e1A019639a1dbDe937dB) {
    +++ description: None
      values.$pastUpgrades.1.2:
+        ["0x0C25f3ACCB17a9D60408D1c79bD7218073DAd518"]
      values.$pastUpgrades.1.1:
-        ["0x0C25f3ACCB17a9D60408D1c79bD7218073DAd518"]
+        "0x37af14ba1cab3bbd0b202ad21c9bd057c8d36f654ff515e18fc22af68ea72d33"
      values.$pastUpgrades.0.2:
+        ["0xaFc54E8277f8Bb8c195C794B0D10D6766e89DF0a"]
      values.$pastUpgrades.0.1:
-        ["0xaFc54E8277f8Bb8c195C794B0D10D6766e89DF0a"]
+        "0xa810024f29ca544f9587b26bd9ca270c0811b58dd9fcc75ee870e24c316468cc"
    }
```

Generated with discovered.json: 0x9d2588624d742d3a7b3935246485044c1540b822

# Diff at Mon, 14 Oct 2024 11:00:25 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@1afc77ff111ceb0970e7d09efcc7b2f376b0c281 block: 9010064
- current block number: 9010064

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 9010064 (main branch discovery), not current.

```diff
    contract LineaOwner (0x0Bff4B38792a95314b3463E1Bf9831BDa1995391) {
    +++ description: None
      sourceHashes:
+        ["0x81a7349eebb98ac33b0bc6842e3cb258034a8f2a4ba004570bb8e2e25947f9ff","0x59fe14e95a8aa7f52213f18bae5c9329cf583a7ba31194698b15eddb97d5e825"]
    }
```

```diff
    contract ValidatorTimelock (0x509ff56c152315EdeE91A2e0f059195519507e01) {
    +++ description: None
      sourceHashes:
+        ["0x12cecfbcc6781dd4b8196aa7774f756e4f6b1ffa89386aee473d301f8b6e50a9"]
    }
```

```diff
    contract zkLink (0x5Cb18b6e4e6F3b46Ce646b0f4704D53724C5Df05) {
    +++ description: None
      sourceHashes:
+        ["0xcd2dee9d49d75aa37138514c1f32d29c60222002963e0c0a7e1a815dff00444f","0x0aeeb5887677b09d5c9b6dfb6fd52bf2c97728ae0aedb533baab3f7fe0653ac3","0xe7e19467e9bc94a61947db08bfecea640d85dd166beac055385b877417dfbd71","0xb6a5aa1fb38aec46fe13d3e977cb8a06b3e3fd7e5c1ec2ef87f58fa4d21d3f45","0xbe5fe6b595b02be18ecb35c95a6b4b18c75aa4a08ab3cf035b72e9e5f71109d9"]
    }
```

```diff
    contract L1ERC20Bridge (0x62cE247f34dc316f93D3830e4Bf10959FCe630f8) {
    +++ description: None
      sourceHashes:
+        ["0x993403059c5620e6c91110514f9f4a2f2331c55dab587699c67c19edddab92ad","0xa03991e1bce15902cbac3b622d56b1d1a7ffac18bd69a20e1b22a38a350b1246"]
    }
```

```diff
    contract LineaL2Gateway (0x7b5780d6df85A7dF96a3e1A019639a1dbDe937dB) {
    +++ description: None
      sourceHashes:
+        ["0xbbe53a68c0042f4050bdf21e8d16eee4688dd35d24e49740915f0a0cf994f0d6","0x9cdec4676ceb81fecae56fb51bb2b303a5e0c13d98bb75c91e343bbe6b6d3d59"]
    }
```

```diff
    contract Verifier (0x902C3806A84f4e855a8746e92d7F1C9a51400458) {
    +++ description: None
      sourceHashes:
+        ["0x456c64183a7130a9bf99039d4d381b4b827b7efe87e684f81c20871836d975cb"]
    }
```

```diff
    contract Governance (0xeF528a8Ca4B6aFDB6716Ef9f11bCa0c5C47454ec) {
    +++ description: None
      sourceHashes:
+        ["0x200762223206dfe40a648627db22f3403b1bdb04c59d8753a1e7525591876fda"]
    }
```

Generated with discovered.json: 0x68be1854901efa50732995e8e547f158d367442c

# Diff at Tue, 01 Oct 2024 11:13:57 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@bd754dc73c66120164006054f8d25c5fae9cd910 block: 9010064
- current block number: 9010064

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 9010064 (main branch discovery), not current.

```diff
    contract zkLink (0x5Cb18b6e4e6F3b46Ce646b0f4704D53724C5Df05) {
    +++ description: None
      values.$pastUpgrades:
+        [["2024-02-29T14:48:05.000Z",["0x73B076425025A3Bf059001D5bE0E21384C8cf049","0xfE3EB2e5AfaA936093C0DD2dB8898F4a2643FfE0","0x6052B353022dA2C61a999bf081C349260de993Af","0x5e7077bf147Fc1Bb8f46039cc40bBd39F2dDfEa0"]],["2024-03-04T03:26:13.000Z",["0x73B076425025A3Bf059001D5bE0E21384C8cf049","0xfE3EB2e5AfaA936093C0DD2dB8898F4a2643FfE0","0x5e7077bf147Fc1Bb8f46039cc40bBd39F2dDfEa0","0x841f709F4219a1283300c0250cA7c582aD2B289c"]],["2024-03-09T09:54:34.000Z",["0x73B076425025A3Bf059001D5bE0E21384C8cf049","0xfE3EB2e5AfaA936093C0DD2dB8898F4a2643FfE0","0x5e7077bf147Fc1Bb8f46039cc40bBd39F2dDfEa0","0x841f709F4219a1283300c0250cA7c582aD2B289c"]],["2024-03-09T10:02:42.000Z",["0xcE8E69a2685c80Eb6bd825d0552f44BB34f35503","0xb1d0354063527E4426c4bEcbDB75fE0fb112e3CB","0x11bf5BC6327f7BECB0AE753932A181c8fB5780bA","0x1b19287CE898217D937571EABa97ec50F27d1206"]],["2024-04-23T02:48:53.000Z",["0x2b1f8EcEc8C5E09395D83910b5Cbf0E149E271DC","0xF3d053C29666D653Fa8629190579844BffE9FB92","0x253AbB100Dd2606e73E41A26D03269fd13de5548","0x268F47D6058c3122131e2f8Df1B634793e4B0a7c"]],["2024-05-22T15:53:09.000Z",["0xB76Ee80B3344D86580C990638bDE1915E58d2c6f","0xF3d053C29666D653Fa8629190579844BffE9FB92","0x495220D99B432b0de3e1F1fe206AA0E26A051C63","0x9f2E11F287733c4EF5B9A6ED923b780c28062727"]]]
      values.$upgradeCount:
+        6
    }
```

```diff
    contract L1ERC20Bridge (0x62cE247f34dc316f93D3830e4Bf10959FCe630f8) {
    +++ description: None
      values.$pastUpgrades:
+        [["2024-02-29T14:48:33.000Z",["0xB8017A397E7844635c5a2750d0BEB2af97506461"]],["2024-04-03T12:30:11.000Z",["0xDe1d7311d3eb7bc94f7EBAEd86978d3a82d5328A"]]]
    }
```

```diff
    contract LineaL2Gateway (0x7b5780d6df85A7dF96a3e1A019639a1dbDe937dB) {
    +++ description: None
      values.$pastUpgrades:
+        [["2024-03-01T07:52:25.000Z",["0xaFc54E8277f8Bb8c195C794B0D10D6766e89DF0a"]],["2024-03-09T10:50:34.000Z",["0x0C25f3ACCB17a9D60408D1c79bD7218073DAd518"]]]
    }
```

Generated with discovered.json: 0x2047c328c746078051cc84da5403cc8f907080a8

# Diff at Fri, 30 Aug 2024 08:17:32 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@6c1bd1f41fadf5f2cb1c1805b5a2c6138a3ed35a block: 7681920
- current block number: 7681920

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 7681920 (main branch discovery), not current.

```diff
    contract LineaOwner (0x0Bff4B38792a95314b3463E1Bf9831BDa1995391) {
    +++ description: None
      receivedPermissions.0.via:
-        []
    }
```

```diff
    contract Governance (0xeF528a8Ca4B6aFDB6716Ef9f11bCa0c5C47454ec) {
    +++ description: None
      receivedPermissions.0.via:
-        []
    }
```

Generated with discovered.json: 0xc3bb7d997fb08eb6ca552258ca348a1edfd931dd

# Diff at Fri, 23 Aug 2024 09:57:57 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@67597c7d6c810bc726594446890178150240711e block: 7681920
- current block number: 7681920

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 7681920 (main branch discovery), not current.

```diff
    contract L1ERC20Bridge (0x62cE247f34dc316f93D3830e4Bf10959FCe630f8) {
    +++ description: None
      values.$upgradeCount:
+        2
    }
```

```diff
    contract LineaL2Gateway (0x7b5780d6df85A7dF96a3e1A019639a1dbDe937dB) {
    +++ description: None
      values.$upgradeCount:
+        2
    }
```

Generated with discovered.json: 0x2f5a06fc86d39de1707c614e8f662e8aedfd57b6

# Diff at Wed, 21 Aug 2024 10:08:19 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@2f6dde3357bf5d79196b6e94f79d853a6c4ec72b block: 7681920
- current block number: 7681920

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 7681920 (main branch discovery), not current.

```diff
    contract LineaOwner (0x0Bff4B38792a95314b3463E1Bf9831BDa1995391) {
    +++ description: None
      assignedPermissions:
-        {"upgrade":["0x7b5780d6df85A7dF96a3e1A019639a1dbDe937dB"]}
      receivedPermissions:
+        [{"permission":"upgrade","target":"0x7b5780d6df85A7dF96a3e1A019639a1dbDe937dB","via":[]}]
    }
```

```diff
    contract L1ERC20Bridge (0x62cE247f34dc316f93D3830e4Bf10959FCe630f8) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0xeF528a8Ca4B6aFDB6716Ef9f11bCa0c5C47454ec","via":[]}]
    }
```

```diff
    contract LineaL2Gateway (0x7b5780d6df85A7dF96a3e1A019639a1dbDe937dB) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x0Bff4B38792a95314b3463E1Bf9831BDa1995391","via":[]}]
    }
```

```diff
    contract Governance (0xeF528a8Ca4B6aFDB6716Ef9f11bCa0c5C47454ec) {
    +++ description: None
      assignedPermissions:
-        {"upgrade":["0x62cE247f34dc316f93D3830e4Bf10959FCe630f8"]}
      receivedPermissions:
+        [{"permission":"upgrade","target":"0x62cE247f34dc316f93D3830e4Bf10959FCe630f8","via":[]}]
    }
```

Generated with discovered.json: 0x2089e3eb3876579f2d95597b91f2ebd5d89feef2

# Diff at Fri, 09 Aug 2024 10:14:26 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@1f0da1d0aab7bc6b3b5e54e7e93480bd98e57035 block: 7681920
- current block number: 7681920

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 7681920 (main branch discovery), not current.

```diff
    contract LineaOwner (0x0Bff4B38792a95314b3463E1Bf9831BDa1995391) {
    +++ description: None
      assignedPermissions.admin:
-        ["0x7b5780d6df85A7dF96a3e1A019639a1dbDe937dB"]
      assignedPermissions.upgrade:
+        ["0x7b5780d6df85A7dF96a3e1A019639a1dbDe937dB"]
      values.$multisigThreshold:
-        "5 of 8 (63%)"
      values.getOwners:
-        ["0xd30898ECdc21C72250a5fd1dbD37FF7D63237Db5","0x7785bccF9110C188Dad39bE49D4Cdf6c6CC03F10","0x4D9b22B92Ff9faFAc013f82faCA88BDa8E778cb5","0xF801886AE2e127A269B0F11892edb54F692d02dF","0xC75EFCffEE930706daec5CaCA012551f6a1845D7","0x24a257B7D975E7ec6219C4cFCbcF6E504253c7A9","0xd8F26118505417Ef6468Ac8A2AE1E5117245Db92","0xcC1A2bd1a459be0C7fAd3B7F9Fa9a6CBBFE9BFa5"]
      values.getThreshold:
-        5
      values.$members:
+        ["0xd30898ECdc21C72250a5fd1dbD37FF7D63237Db5","0x7785bccF9110C188Dad39bE49D4Cdf6c6CC03F10","0x4D9b22B92Ff9faFAc013f82faCA88BDa8E778cb5","0xF801886AE2e127A269B0F11892edb54F692d02dF","0xC75EFCffEE930706daec5CaCA012551f6a1845D7","0x24a257B7D975E7ec6219C4cFCbcF6E504253c7A9","0xd8F26118505417Ef6468Ac8A2AE1E5117245Db92","0xcC1A2bd1a459be0C7fAd3B7F9Fa9a6CBBFE9BFa5"]
      values.$threshold:
+        5
      values.multisigThreshold:
+        "5 of 8 (63%)"
    }
```

```diff
    contract Governance (0xeF528a8Ca4B6aFDB6716Ef9f11bCa0c5C47454ec) {
    +++ description: None
      assignedPermissions.admin:
-        ["0x62cE247f34dc316f93D3830e4Bf10959FCe630f8"]
      assignedPermissions.upgrade:
+        ["0x62cE247f34dc316f93D3830e4Bf10959FCe630f8"]
    }
```

Generated with discovered.json: 0x00aa46468de35ce7b94c77f6909a9f0e2568a09a

# Diff at Sun, 04 Aug 2024 10:28:44 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@14945a4ebc63b3db3867f33067f31f159fedd9a9 block: 6349728
- current block number: 7681920

## Description

One signer in the Owner MS is replaced and one validator removed.

## Watched changes

```diff
    contract LineaOwner (0x0Bff4B38792a95314b3463E1Bf9831BDa1995391) {
    +++ description: None
      values.getOwners.5:
-        "0x824C9364A6CF8f5EB542ad2ca8F5705561C8b1db"
+        "0x24a257B7D975E7ec6219C4cFCbcF6E504253c7A9"
      values.getOwners.4:
-        "0x24a257B7D975E7ec6219C4cFCbcF6E504253c7A9"
+        "0xC75EFCffEE930706daec5CaCA012551f6a1845D7"
      values.getOwners.3:
-        "0xC75EFCffEE930706daec5CaCA012551f6a1845D7"
+        "0xF801886AE2e127A269B0F11892edb54F692d02dF"
      values.getOwners.2:
-        "0xF801886AE2e127A269B0F11892edb54F692d02dF"
+        "0x4D9b22B92Ff9faFAc013f82faCA88BDa8E778cb5"
      values.getOwners.1:
-        "0x4D9b22B92Ff9faFAc013f82faCA88BDa8E778cb5"
+        "0x7785bccF9110C188Dad39bE49D4Cdf6c6CC03F10"
      values.getOwners.0:
-        "0x7785bccF9110C188Dad39bE49D4Cdf6c6CC03F10"
+        "0xd30898ECdc21C72250a5fd1dbD37FF7D63237Db5"
    }
```

```diff
-   Status: DELETED
    contract  (0x217C85a8B14466963905C22E817Dd1553fa62DFC)
    +++ description: None
```

```diff
    contract zkLink (0x5Cb18b6e4e6F3b46Ce646b0f4704D53724C5Df05) {
    +++ description: None
      values.validators.2:
-        "0x509ff56c152315EdeE91A2e0f059195519507e01"
      values.validators.1:
-        "0x54B39C0e4089f0789b9f8EdE20D725e1AFF805Cb"
+        "0x509ff56c152315EdeE91A2e0f059195519507e01"
      values.validators.0:
-        "0x217C85a8B14466963905C22E817Dd1553fa62DFC"
+        "0x54B39C0e4089f0789b9f8EdE20D725e1AFF805Cb"
    }
```

Generated with discovered.json: 0xca456511d105080dbc231beb25223ed9fdb9bf4c

# Diff at Thu, 04 Jul 2024 14:15:56 GMT:

- author: Luca Donno (<donnoh99@gmail.com>)
- current block number: 6349728

## Description

Provide description of changes. This section will be preserved.

## Initial discovery

```diff
+   Status: CREATED
    contract LineaOwner (0x0Bff4B38792a95314b3463E1Bf9831BDa1995391)
    +++ description: None
```

```diff
+   Status: CREATED
    contract  (0x217C85a8B14466963905C22E817Dd1553fa62DFC)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ValidatorTimelock (0x509ff56c152315EdeE91A2e0f059195519507e01)
    +++ description: None
```

```diff
+   Status: CREATED
    contract zkLink (0x5Cb18b6e4e6F3b46Ce646b0f4704D53724C5Df05)
    +++ description: None
```

```diff
+   Status: CREATED
    contract L1ERC20Bridge (0x62cE247f34dc316f93D3830e4Bf10959FCe630f8)
    +++ description: None
```

```diff
+   Status: CREATED
    contract LineaL2Gateway (0x7b5780d6df85A7dF96a3e1A019639a1dbDe937dB)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Verifier (0x902C3806A84f4e855a8746e92d7F1C9a51400458)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Governance (0xeF528a8Ca4B6aFDB6716Ef9f11bCa0c5C47454ec)
    +++ description: None
```
