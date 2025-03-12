Generated with discovered.json: 0xeca3a56a7cb24e74196af7e80ed9b56a3a538058

# Diff at Tue, 04 Mar 2025 10:39:42 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@98d260b45fe0d2195ce5e629bd7b200c8706e8ba block: 21378535
- current block number: 21378535

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21378535 (main branch discovery), not current.

```diff
    contract MainchainBridgeManager (0x2Cf3CFb17774Ce0CFa34bB3f3761904e7fc3FaDB) {
    +++ description: None
      sinceBlock:
+        20425326
    }
```

```diff
    contract RoninManagerMultiSig (0x2DA02aC5f19Ae362a4121718d990e655eB628D96) {
    +++ description: None
      sinceBlock:
+        8077308
    }
```

```diff
    contract RoninAdminMultisig (0x51F6696Ae42C6C40CA9F5955EcA2aaaB1Cefb26e) {
    +++ description: None
      sinceBlock:
+        20440286
    }
```

```diff
    contract MainchainGateway (0x64192819Ac13Ef72bF6b5AE239AC672B43a9AF08) {
    +++ description: None
      sinceBlock:
+        15006576
    }
```

```diff
    contract WETH9 (0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2) {
    +++ description: None
      sinceBlock:
+        4719568
    }
```

```diff
    contract PauseEnforcer (0xe514d9DEB7966c8BE0ca922de8a064264eA6bcd4) {
    +++ description: None
      sinceBlock:
+        16895391
    }
```

Generated with discovered.json: 0xb2247e55f4bba610cac5118d6f30a33041c5df04

# Diff at Mon, 03 Feb 2025 16:07:20 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@6f70df55ec21905a77e92737dc90bb42cf7accd3 block: 21378535
- current block number: 21378535

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21378535 (main branch discovery), not current.

```diff
    contract RoninManagerMultiSig (0x2DA02aC5f19Ae362a4121718d990e655eB628D96) {
    +++ description: None
      values.$members:
+        ["0xE5EB222996967BE79468C28bA39D665fd96E8b30","0x6bfC8F9096446d350713C4eB9d9b68866F87a9d0","0xaD99Fc4d593bAe582c2Ca83aCD98Ae6fcDb36192"]
      values.$threshold:
+        2
    }
```

Generated with discovered.json: 0x4fbd6b608fa8670a3ce6ec0bf6c56b6292342225

# Diff at Mon, 20 Jan 2025 11:09:59 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@2c8b4f3d9910bb6371be9b4df87b70856e7d8c64 block: 21378535
- current block number: 21378535

## Description

Rerun on the same block number. Applies fixes to permissions and via field. Renames permission's target to to/from.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21378535 (main branch discovery), not current.

```diff
    contract MainchainBridgeManager (0x2Cf3CFb17774Ce0CFa34bB3f3761904e7fc3FaDB) {
    +++ description: None
      issuedPermissions.0.target:
-        "0x51F6696Ae42C6C40CA9F5955EcA2aaaB1Cefb26e"
      issuedPermissions.0.to:
+        "0x51F6696Ae42C6C40CA9F5955EcA2aaaB1Cefb26e"
      receivedPermissions.0.target:
-        "0x64192819Ac13Ef72bF6b5AE239AC672B43a9AF08"
      receivedPermissions.0.from:
+        "0x64192819Ac13Ef72bF6b5AE239AC672B43a9AF08"
    }
```

```diff
    contract RoninAdminMultisig (0x51F6696Ae42C6C40CA9F5955EcA2aaaB1Cefb26e) {
    +++ description: None
      receivedPermissions.0.target:
-        "0x2Cf3CFb17774Ce0CFa34bB3f3761904e7fc3FaDB"
      receivedPermissions.0.from:
+        "0x2Cf3CFb17774Ce0CFa34bB3f3761904e7fc3FaDB"
    }
```

```diff
    contract MainchainGateway (0x64192819Ac13Ef72bF6b5AE239AC672B43a9AF08) {
    +++ description: None
      issuedPermissions.0.target:
-        "0x2Cf3CFb17774Ce0CFa34bB3f3761904e7fc3FaDB"
      issuedPermissions.0.to:
+        "0x2Cf3CFb17774Ce0CFa34bB3f3761904e7fc3FaDB"
    }
```

Generated with discovered.json: 0xa1c2b30baa6572d1b7ef73edfabc2975dc34424d

# Diff at Wed, 11 Dec 2024 10:02:19 GMT:

- author: vincfurc (<10850139+vincfurc@users.noreply.github.com>)
- comparing to: main@28849b80c374bb8843eff17341701a3084c3bdb9 block: 20675893
- current block number: 21378535

## Description

Ronin multisig sent 250k AXS to Ronin bridge.

## Watched changes

```diff
    contract RoninManagerMultiSig (0x2DA02aC5f19Ae362a4121718d990e655eB628D96) {
    +++ description: None
      values.transactionCount:
-        26
+        27
    }
```

Generated with discovered.json: 0x1738944701c59394d29ef8fa043bb1804af34400

# Diff at Mon, 21 Oct 2024 11:09:39 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@8895d33866f5665c4c710f4ddaa32bfa63cc3c78 block: 20675893
- current block number: 20675893

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20675893 (main branch discovery), not current.

```diff
    contract MainchainBridgeManager (0x2Cf3CFb17774Ce0CFa34bB3f3761904e7fc3FaDB) {
    +++ description: None
      values.$pastUpgrades.2.2:
+        ["0x0ac26945032143f6196d4bb5Ae03592BfAf822FD"]
      values.$pastUpgrades.2.1:
-        ["0x0ac26945032143f6196d4bb5Ae03592BfAf822FD"]
+        "0xa88f4f7faf165a2053d9b4d818f0066d5962357ee4ee87b63f000e3082bd6456"
      values.$pastUpgrades.1.2:
+        ["0x3BA040BC32352E2dC21f9A85C5573E84696a74Dd"]
      values.$pastUpgrades.1.1:
-        ["0x3BA040BC32352E2dC21f9A85C5573E84696a74Dd"]
+        "0xb87845e4e3a93dd8add11bc2d20a94056f3a034277717f90f127b782f9bd1f21"
      values.$pastUpgrades.0.2:
+        ["0x0ac26945032143f6196d4bb5Ae03592BfAf822FD"]
      values.$pastUpgrades.0.1:
-        ["0x0ac26945032143f6196d4bb5Ae03592BfAf822FD"]
+        "0xc27c133224cfdedc302afcc3ee36878f6cd706edd2d84d7933911ca5703e6f3c"
    }
```

```diff
    contract MainchainGateway (0x64192819Ac13Ef72bF6b5AE239AC672B43a9AF08) {
    +++ description: None
      values.$pastUpgrades.5.2:
+        ["0xD6c4986bbe09f2dDb262B4611b0BA06891be605e"]
      values.$pastUpgrades.5.1:
-        ["0xD6c4986bbe09f2dDb262B4611b0BA06891be605e"]
+        "0x167c741a87278fa0a50f0ed15e89edd1d05ed43a5808476e564347f1d34f784d"
      values.$pastUpgrades.4.2:
+        ["0xfc274EC92bBb1A1472884558d1B5CaaC6F8220Ee"]
      values.$pastUpgrades.4.1:
-        ["0xfc274EC92bBb1A1472884558d1B5CaaC6F8220Ee"]
+        "0x855dd3b1194e3b889f4667b6a0996220e350e034d35d3eab29b4f23bc205767e"
      values.$pastUpgrades.3.2:
+        ["0x72E28A9009Ad12dE019BFF418CD210D4bbc3D403"]
      values.$pastUpgrades.3.1:
-        ["0x72E28A9009Ad12dE019BFF418CD210D4bbc3D403"]
+        "0xbbbeadcbf7df225dfef18cb3add0f29cbd2e90921acb7a3851b3a250832d12fe"
      values.$pastUpgrades.2.2:
+        ["0xa67BA5315AF4961Eb937158032AF9300C657dAcD"]
      values.$pastUpgrades.2.1:
-        ["0xa67BA5315AF4961Eb937158032AF9300C657dAcD"]
+        "0xa090f035d1895ab7b69fc72303e122d0c565becf9c6c684ecf7257c0311233af"
      values.$pastUpgrades.1.2:
+        ["0x71356E37e0368Bd10bFDbF41dC052fE5FA24cD05"]
      values.$pastUpgrades.1.1:
-        ["0x71356E37e0368Bd10bFDbF41dC052fE5FA24cD05"]
+        "0xbb60c9f020bd6f9c6737b28290f75272d2090f529d8450deafdf5d675fa8bcc0"
      values.$pastUpgrades.0.2:
+        ["0x2DBA725f0a3485382a7F125a31cBF4361539aF73"]
      values.$pastUpgrades.0.1:
-        ["0x2DBA725f0a3485382a7F125a31cBF4361539aF73"]
+        "0x8f2924a52e63564c9cb0b119d72dc8290daa39c59cbe02e7f1ab6b2160ac9aa4"
    }
```

Generated with discovered.json: 0xd86849f639eaaf1fac5d07ed08c2f078676b4588

# Diff at Mon, 14 Oct 2024 10:55:09 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@1afc77ff111ceb0970e7d09efcc7b2f376b0c281 block: 20675893
- current block number: 20675893

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20675893 (main branch discovery), not current.

```diff
    contract MainchainBridgeManager (0x2Cf3CFb17774Ce0CFa34bB3f3761904e7fc3FaDB) {
    +++ description: None
      sourceHashes:
+        ["0x33cd2cf791b018347e2c994f787d0a24c830435bccfe913456ab337de909570e","0xb95d73d375b1e25c5ddb15cbfa79b70a14b58ce1467a12bd841a4f59b063e2f9"]
    }
```

```diff
    contract RoninManagerMultiSig (0x2DA02aC5f19Ae362a4121718d990e655eB628D96) {
    +++ description: None
      sourceHashes:
+        ["0x34de320a4a2a66cb410c0b6b04558c98586ea66fe69b35df6ee3ff7816eae03b"]
    }
```

```diff
    contract RoninAdminMultisig (0x51F6696Ae42C6C40CA9F5955EcA2aaaB1Cefb26e) {
    +++ description: None
      sourceHashes:
+        ["0x81a7349eebb98ac33b0bc6842e3cb258034a8f2a4ba004570bb8e2e25947f9ff","0xd42bbf9f7dcd3720a7fc6bdc6edfdfae8800a37d6dd4decfa0ef6ca4a2e88940"]
    }
```

```diff
    contract MainchainGateway (0x64192819Ac13Ef72bF6b5AE239AC672B43a9AF08) {
    +++ description: None
      sourceHashes:
+        ["0xdf743526ddd44d53db1ae516488019ca52e6b6434e33ad8fbd5b060c138653a2","0x2d39ee54cf7dc52198aeac3324e8b8034b0d5db06ad5192305aaa80c1e10fca6"]
    }
```

```diff
    contract WETH9 (0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2) {
    +++ description: None
      sourceHashes:
+        ["0xec8c1fea9a5a10c4c028664a56d678a0776b07cfc510fc7fa54db0aed0978f49"]
    }
```

```diff
    contract PauseEnforcer (0xe514d9DEB7966c8BE0ca922de8a064264eA6bcd4) {
    +++ description: None
      sourceHashes:
+        ["0x38ea3c443d8341f4b59ebeae4d05a6064ff361f2f672ae8e49e2a96514a2261d"]
    }
```

Generated with discovered.json: 0xccfeb558d600b03e7888e1cb5d794c0e03e59e11

# Diff at Tue, 01 Oct 2024 10:54:44 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@bd754dc73c66120164006054f8d25c5fae9cd910 block: 20675893
- current block number: 20675893

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20675893 (main branch discovery), not current.

```diff
    contract MainchainBridgeManager (0x2Cf3CFb17774Ce0CFa34bB3f3761904e7fc3FaDB) {
    +++ description: None
      values.$pastUpgrades:
+        [["2024-07-31T08:25:35.000Z",["0x0ac26945032143f6196d4bb5Ae03592BfAf822FD"]],["2024-08-06T09:05:11.000Z",["0x3BA040BC32352E2dC21f9A85C5573E84696a74Dd"]],["2024-08-06T09:14:59.000Z",["0x0ac26945032143f6196d4bb5Ae03592BfAf822FD"]]]
    }
```

```diff
    contract MainchainGateway (0x64192819Ac13Ef72bF6b5AE239AC672B43a9AF08) {
    +++ description: None
      values.$pastUpgrades:
+        [["2022-06-22T07:40:30.000Z",["0x2DBA725f0a3485382a7F125a31cBF4361539aF73"]],["2022-06-28T11:16:22.000Z",["0x71356E37e0368Bd10bFDbF41dC052fE5FA24cD05"]],["2023-04-12T07:14:23.000Z",["0xa67BA5315AF4961Eb937158032AF9300C657dAcD"]],["2023-10-24T03:52:23.000Z",["0x72E28A9009Ad12dE019BFF418CD210D4bbc3D403"]],["2024-08-06T08:48:47.000Z",["0xfc274EC92bBb1A1472884558d1B5CaaC6F8220Ee"]],["2024-08-30T03:41:35.000Z",["0xD6c4986bbe09f2dDb262B4611b0BA06891be605e"]]]
    }
```

Generated with discovered.json: 0x8fc2172551f9f49d30e37e4dcae1576e3d79970f

# Diff at Wed, 04 Sep 2024 08:02:53 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@878a951312cec062f5003f6749f781861b0cdba1 block: 20640810
- current block number: 20675893

## Description

Ronin bride unpaused.

## Watched changes

```diff
    contract MainchainGateway (0x64192819Ac13Ef72bF6b5AE239AC672B43a9AF08) {
    +++ description: None
      values.paused:
-        true
+        false
    }
```

```diff
    contract PauseEnforcer (0xe514d9DEB7966c8BE0ca922de8a064264eA6bcd4) {
    +++ description: None
      values.emergency:
-        true
+        false
    }
```

Generated with discovered.json: 0xabda92b9e46f002ac0602cb427f628bb434df543

# Diff at Fri, 30 Aug 2024 10:31:27 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@78fe1115153efe3e1ba2014fd74329156dca3951 block: 20633139
- current block number: 20640810

## Description

Sentries are added. (They are automatically displayed on the frontend since i added the permissions section entry last update)

MainchainGateway.sol: Small upgrade internalizing the previously external WethUnwrapper contract.

## Watched changes

```diff
    contract MainchainGateway (0x64192819Ac13Ef72bF6b5AE239AC672B43a9AF08) {
    +++ description: None
      values.$implementation:
-        "0xfc274EC92bBb1A1472884558d1B5CaaC6F8220Ee"
+        "0xD6c4986bbe09f2dDb262B4611b0BA06891be605e"
      values.$upgradeCount:
-        5
+        6
      values.minimumVoteWeight:
-        0
+        1540
      values.wethUnwrapper:
-        "0x8048b12511d9BE6e4e094089b12f54923C4E2F83"
    }
```

```diff
-   Status: DELETED
    contract WethUnwrapper (0x8048b12511d9BE6e4e094089b12f54923C4E2F83)
    +++ description: None
```

```diff
    contract PauseEnforcer (0xe514d9DEB7966c8BE0ca922de8a064264eA6bcd4) {
    +++ description: None
      values.accessControl.SENTRY_ROLE.members.4:
+        "0x47870D35cdfF193a428C98a3468c833c23488393"
      values.accessControl.SENTRY_ROLE.members.3:
+        "0x660Ef9c5a8a92070b03fc5BBC2AC006D0B0Ead33"
      values.accessControl.SENTRY_ROLE.members.2:
+        "0xcb8225AA9D1029Af2E8cA537027E26bbe3056353"
      values.accessControl.SENTRY_ROLE.members.1:
+        "0x299F344F0c6cC03cbb250E0f2dDdCD22Ae267c0c"
      values.accessControl.SENTRY_ROLE.members.0:
+        "0x944b1282cb9B3e62794f38733F3B6336536c30cc"
    }
```

## Source code changes

```diff
.../MainchainGateway/MainchainGatewayV3.sol        | 115 +++++++++++++--------
 .../.flat@20633139/WethUnwrapper.sol => /dev/null  |  93 -----------------
 2 files changed, 70 insertions(+), 138 deletions(-)
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20633139 (main branch discovery), not current.

```diff
    contract MainchainBridgeManager (0x2Cf3CFb17774Ce0CFa34bB3f3761904e7fc3FaDB) {
    +++ description: None
      receivedPermissions.0.via:
-        []
    }
```

```diff
    contract RoninAdminMultisig (0x51F6696Ae42C6C40CA9F5955EcA2aaaB1Cefb26e) {
    +++ description: None
      receivedPermissions.0.via:
-        []
    }
```

Generated with discovered.json: 0x0c58ba585d11cc050cfd94ad4ed6016ee63e6ff9

# Diff at Thu, 29 Aug 2024 08:47:00 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@ae2eef5fb76c32f2e57d2f78a8a0f4686592fe8b block: 20475186
- current block number: 20633139

## Description

RoninAdminMultisig (can upgrade) is added: Entry added to ronin.ts permissions.

## Watched changes

```diff
    contract RoninManagerMultiSig (0x2DA02aC5f19Ae362a4121718d990e655eB628D96) {
    +++ description: None
      values.transactionCount:
-        25
+        26
    }
```

```diff
    contract PauseEnforcer (0xe514d9DEB7966c8BE0ca922de8a064264eA6bcd4) {
    +++ description: None
      values.accessControl.DEFAULT_ADMIN_ROLE.members.1:
+        "0x51F6696Ae42C6C40CA9F5955EcA2aaaB1Cefb26e"
    }
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20475186 (main branch discovery), not current.

```diff
    contract RoninManagerMultiSig (0x2DA02aC5f19Ae362a4121718d990e655eB628D96) {
    +++ description: None
      name:
-        "RoninBridgeAdminMultiSig"
+        "RoninManagerMultiSig"
    }
```

```diff
    contract RoninAdminMultisig (0x51F6696Ae42C6C40CA9F5955EcA2aaaB1Cefb26e) {
    +++ description: None
      name:
-        "GnosisSafe"
+        "RoninAdminMultisig"
    }
```

Generated with discovered.json: 0x0c7d2642c1ca8f149984644909351348f6e58011

# Diff at Fri, 23 Aug 2024 09:54:55 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@67597c7d6c810bc726594446890178150240711e block: 20475186
- current block number: 20475186

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20475186 (main branch discovery), not current.

```diff
    contract MainchainBridgeManager (0x2Cf3CFb17774Ce0CFa34bB3f3761904e7fc3FaDB) {
    +++ description: None
      values.$upgradeCount:
+        3
    }
```

```diff
    contract MainchainGateway (0x64192819Ac13Ef72bF6b5AE239AC672B43a9AF08) {
    +++ description: None
      values.$upgradeCount:
+        5
    }
```

Generated with discovered.json: 0x1470d168745592d52efdfd26ca0cee7787aec31b

# Diff at Wed, 21 Aug 2024 10:05:28 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@2f6dde3357bf5d79196b6e94f79d853a6c4ec72b block: 20475186
- current block number: 20475186

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20475186 (main branch discovery), not current.

```diff
    contract MainchainBridgeManager (0x2Cf3CFb17774Ce0CFa34bB3f3761904e7fc3FaDB) {
    +++ description: None
      assignedPermissions:
-        {"upgrade":["0x64192819Ac13Ef72bF6b5AE239AC672B43a9AF08"]}
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x51F6696Ae42C6C40CA9F5955EcA2aaaB1Cefb26e","via":[]}]
      receivedPermissions:
+        [{"permission":"upgrade","target":"0x64192819Ac13Ef72bF6b5AE239AC672B43a9AF08","via":[]}]
    }
```

```diff
    contract GnosisSafe (0x51F6696Ae42C6C40CA9F5955EcA2aaaB1Cefb26e) {
    +++ description: None
      assignedPermissions:
-        {"upgrade":["0x2Cf3CFb17774Ce0CFa34bB3f3761904e7fc3FaDB"]}
      receivedPermissions:
+        [{"permission":"upgrade","target":"0x2Cf3CFb17774Ce0CFa34bB3f3761904e7fc3FaDB","via":[]}]
    }
```

```diff
    contract MainchainGateway (0x64192819Ac13Ef72bF6b5AE239AC672B43a9AF08) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x2Cf3CFb17774Ce0CFa34bB3f3761904e7fc3FaDB","via":[]}]
    }
```

Generated with discovered.json: 0x9a019fb9140510909dd4fb3418872c6ca17cf19c

# Diff at Fri, 09 Aug 2024 10:11:52 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@1f0da1d0aab7bc6b3b5e54e7e93480bd98e57035 block: 20475186
- current block number: 20475186

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20475186 (main branch discovery), not current.

```diff
    contract MainchainBridgeManager (0x2Cf3CFb17774Ce0CFa34bB3f3761904e7fc3FaDB) {
    +++ description: None
      assignedPermissions.admin:
-        ["0x64192819Ac13Ef72bF6b5AE239AC672B43a9AF08"]
      assignedPermissions.upgrade:
+        ["0x64192819Ac13Ef72bF6b5AE239AC672B43a9AF08"]
    }
```

```diff
    contract GnosisSafe (0x51F6696Ae42C6C40CA9F5955EcA2aaaB1Cefb26e) {
    +++ description: None
      assignedPermissions.admin:
-        ["0x2Cf3CFb17774Ce0CFa34bB3f3761904e7fc3FaDB"]
      assignedPermissions.upgrade:
+        ["0x2Cf3CFb17774Ce0CFa34bB3f3761904e7fc3FaDB"]
      values.$multisigThreshold:
-        "3 of 5 (60%)"
      values.getOwners:
-        ["0x4BFEc2a63B72c67e6c3f599fCc40E1d42AE519ff","0x18471CC6d2d427077CAA7896D7956cD066CAbe49","0xC93f43dbbf0a1346D9E0d623B68d78891b131Bf9","0xFE1a01580d7Cd7EC333DDC087b2c4DE3226f6031","0xa1aD1835f9c42842d348d9Ed1423C9075B8DA40b"]
      values.getThreshold:
-        3
      values.$members:
+        ["0x4BFEc2a63B72c67e6c3f599fCc40E1d42AE519ff","0x18471CC6d2d427077CAA7896D7956cD066CAbe49","0xC93f43dbbf0a1346D9E0d623B68d78891b131Bf9","0xFE1a01580d7Cd7EC333DDC087b2c4DE3226f6031","0xa1aD1835f9c42842d348d9Ed1423C9075B8DA40b"]
      values.$threshold:
+        3
      values.multisigThreshold:
+        "3 of 5 (60%)"
    }
```

Generated with discovered.json: 0x29bf015e5a7b96ffdbaacb860fcedf061c601394

# Diff at Wed, 07 Aug 2024 07:25:35 GMT:

- author: Radina Talanova (<nt.radina@gmail.com>)
- comparing to: main@47685977ba2390a8eafac8e0d4cac7c81dff5758 block: 20469499
- current block number: 20475186

## Description

The Pauser role was renounced, there are no pausers right now. The bridge remains paused. Context: https://x.com/Ronin_Network/status/1820804772917588339

## Watched changes

```diff
    contract PauseEnforcer (0xe514d9DEB7966c8BE0ca922de8a064264eA6bcd4) {
    +++ description: None
      values.accessControl.SENTRY_ROLE.members.0:
-        "0x8B35C5E273525a4Ca61025812f29C17727948f57"
    }
```

Generated with discovered.json: 0x2eb6d1be309f0402d17aff1b623019fc86ba6029

# Diff at Tue, 06 Aug 2024 12:22:12 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@636940e9998601360990d4bbb59e5d257345bee1 block: 20138533
- current block number: 20469499

## Description

The bridge is paused see https://x.com/Psycheout86/status/1820771028420739140. 2h before the pause, it was upgraded to a new implementation.
The new implementation contains mainly formatting / naming changes, ERC 1155 support, and new callbacks like onBridgeOperatorsAdded() etc.
The admin is pointed to a new MainchainBridgeManager contract that has extensive diff with the old one but similar ABI.

## Watched changes

```diff
    contract MainchainGateway (0x64192819Ac13Ef72bF6b5AE239AC672B43a9AF08) {
    +++ description: None
      values.$admin:
-        "0xa71456fA88a5f6a4696D0446E690Db4a5913fab0"
+        "0x2Cf3CFb17774Ce0CFa34bB3f3761904e7fc3FaDB"
      values.$implementation:
-        "0x72E28A9009Ad12dE019BFF418CD210D4bbc3D403"
+        "0xfc274EC92bBb1A1472884558d1B5CaaC6F8220Ee"
      values.minimumVoteWeight:
-        1540
+        0
      values.paused:
-        false
+        true
      values.wethUnwrapper:
+        "0x8048b12511d9BE6e4e094089b12f54923C4E2F83"
    }
```

```diff
-   Status: DELETED
    contract MainchainBridgeManager (0xa71456fA88a5f6a4696D0446E690Db4a5913fab0)
    +++ description: None
```

```diff
    contract PauseEnforcer (0xe514d9DEB7966c8BE0ca922de8a064264eA6bcd4) {
    +++ description: None
      values.emergency:
-        false
+        true
    }
```

```diff
+   Status: CREATED
    contract MainchainBridgeManager (0x2Cf3CFb17774Ce0CFa34bB3f3761904e7fc3FaDB)
    +++ description: None
```

```diff
+   Status: CREATED
    contract GnosisSafe (0x51F6696Ae42C6C40CA9F5955EcA2aaaB1Cefb26e)
    +++ description: None
```

```diff
+   Status: CREATED
    contract WethUnwrapper (0x8048b12511d9BE6e4e094089b12f54923C4E2F83)
    +++ description: None
```

## Source code changes

```diff
.../ronin/ethereum/.flat/GnosisSafe/GnosisSafe.sol |  952 ++++++++++
 .../.flat/GnosisSafe/GnosisSafeProxy.p.sol         |   34 +
 .../MainchainBridgeManager.sol                     | 2000 +++++++++++---------
 .../TransparentProxyV2.p.sol                       |  761 ++++++++
 .../MainchainGateway/MainchainGatewayV3.sol        | 1083 ++++++-----
 .../ronin/ethereum/.flat/WethUnwrapper.sol         |   93 +
 6 files changed, 3556 insertions(+), 1367 deletions(-)
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20138533 (main branch discovery), not current.

```diff
    contract MainchainBridgeManager (0xa71456fA88a5f6a4696D0446E690Db4a5913fab0) {
    +++ description: None
      values.accessControl:
-        {"DEFAULT_ADMIN_ROLE":{"adminRole":"DEFAULT_ADMIN_ROLE","members":[]}}
      values.checkThreshold:
+        [false,false,false,false,false]
      values.getFullBridgeOperatorInfos:
+        {"governors":["0xeD3805fB65FF51a99Fef4676BdBC97abecA93D11","0xe880802580a1fbdeF67ACe39D1B21c5b2C74f059","0x4B18CEBEB9797Ea594b5977109cc07b21c37E8c3","0xA441f1399C8c023798586fbbBcF35f27279638a1","0x72A69B04B59C36fCED19ac54209beF878e84FcBF","0xe258f9996723B910712D6E67ADa4EafC15F7F101","0x020Dd9a5e318695A61DDa88DB7Ad077Ec306e3E9","0x60c4B72fc62b3e3a74e283aA9Ba20d61dD4d8F1b","0x9B0612E43855ef9a7c329ee89653bA45273B550e","0x47cfcb64f8EA44d6Ea7FAB32f13EFa2f8E65Eec1","0xAD23e87306aa3c7B95ee760e86f40F3021E5Fa18","0xbaCB04eA617b3E5EEe0E3f6E8FCB5Ba886B83958","0x77Ab649Caa7B4b673C9f2cF069900DF48114d79D","0x0DCA20728c8bb7173D3452559F40E95C60915799","0x0d48aDbdc523681c0DEe736dbDc4497E02Bec210","0x5832C3219c1dA998e828E1a2406B73dbFC02a70C","0xED448901cC62be10c5525BA19645dDcA1fD9dA1D","0x8d4f4e4ba313c4332e720445d8268E087D5C19b8","0x58aBcBCAb52dEE942491700CD0DB67826BBAA8C6","0x4620fb95eaBDaB4Bf681D987e116e0aAef1adEF2","0xc092Fa0C772b3c850e676c57d8737BB39084B9AC","0x3C583c0c97646a73843aE57b93f33e1995C8DC80"],"bridgeOperators":["0xc23F2907Bc11848B5d5cEdBB835e915D7b760d99","0x4b3844A29CFA5824F53e2137Edb6dc2b54501BeA","0x4a4217d8751a027D853785824eF40522c512A3Fe","0x32cB6da260726BB2192c4085B857aFD945A215Cb","0xA91D05b7c6e684F43E8Fe0c25B3c4Bb1747A2a9E","0xe38aFbE7738b6Ec4280A6bCa1176c1C1A928A19C","0xE795F18F2F5DF5a666994e839b98263Dba86C902","0xf4682B9263d1ba9bd9Db09dA125708607d1eDd3a","0xF0c48B7F020BB61e6A3500AbC4b4954Bde7A2039","0x063105D0E7215B703909a7274FE38393302F3134","0xD9d5b3E58fa693B468a20C716793B18A1195380a","0xff30Ed09E3AE60D39Bce1727ee3292fD76A6FAce","0x8c4AD2DC12AdB9aD115e37EE9aD2e00E343EDf85","0x73f5B22312B7B2B3B1Cd179fC62269aB369c8206","0x5e04DC8156ce222289d52487dbAdCb01C8c990f9","0x772112C7e5dD4ed663e844e79d77c1569a2E88ce","0xEC5c90401F95F8c49b1E133E94F09D85b21d96a4","0x332253265e36689D9830E57112CD1aaDB1A773f9","0x236aF2FFdb611B14e3042A982d13EdA1627d9C96","0x54C8C42F07007D43c3049bEF6f10eA68687d43ef","0x66225AcC78Be789C57a11C9a18F051C779d678B5","0x564DcB855Eb360826f27D1Eb9c57cbbe6C76F50F"],"weights":[100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100]}
      values.globalProposalRelayed:
+        [false,true,false,false,false]
      values.round:
+        [1,4,0,0,0]
      errors:
+        {"checkThreshold":"Too many values. Update configuration to explore fully","globalProposalRelayed":"Too many values. Update configuration to explore fully","round":"Too many values. Update configuration to explore fully"}
    }
```

Generated with discovered.json: 0xd53746fca5138cb45c2e8f56ba1400255041541f

# Diff at Fri, 21 Jun 2024 07:14:55 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@1ba6434de248c46d9e6b140264866a3072082af4 block: 19283248
- current block number: 20138533

## Description

This transaction transfers USD ~2M worth of AXS from the Ronin MS to an EOA.

## Watched changes

```diff
    contract RoninBridgeAdminMultiSig (0x2DA02aC5f19Ae362a4121718d990e655eB628D96) {
    +++ description: None
      values.transactionCount:
-        24
+        25
    }
```

Generated with discovered.json: 0x4aad5c754873131bd01ad3d130f767d777fb275a

# Diff at Thu, 22 Feb 2024 12:48:31 GMT:

- author: Bartek Kiepuszewski (<bkiepuszewski@gmail.com>)
- current block number: 19283248

## Description

Added access control to the discovery.

## Initial discovery

```diff
+   Status: CREATED
    contract RoninBridgeAdminMultiSig (0x2DA02aC5f19Ae362a4121718d990e655eB628D96) {
    }
```

```diff
+   Status: CREATED
    contract MainchainGateway (0x64192819Ac13Ef72bF6b5AE239AC672B43a9AF08) {
    }
```

```diff
+   Status: CREATED
    contract MainchainBridgeManager (0xa71456fA88a5f6a4696D0446E690Db4a5913fab0) {
    }
```

```diff
+   Status: CREATED
    contract WETH9 (0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2) {
    }
```

```diff
+   Status: CREATED
    contract PauseEnforcer (0xe514d9DEB7966c8BE0ca922de8a064264eA6bcd4) {
    }
```
