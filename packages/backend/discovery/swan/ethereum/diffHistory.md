Generated with discovered.json: 0xe26a257bdc80ed122817ce74bd4b69db9558e47f

# Diff at Fri, 09 Aug 2024 12:02:38 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@bf40aa32f030fd312056ca0ef198c8550467d1d7 block: 20413034
- current block number: 20413034

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20413034 (main branch discovery), not current.

```diff
    contract ProxyAdmin (0xCc8c55Ec2Ea3F3001C049eC934e72b55cf52fBf3) {
    +++ description: It can upgrade the bridge implementation potentially gaining access to all funds, and change any system component.
      assignedPermissions.upgrade.6:
-        "0x1Ccf7e62889E6A93413DEAFC4e390Bd4047bDC32"
+        "0xed7525946A09056C6AaE29941b8323017382050e"
      assignedPermissions.upgrade.5:
-        "0xE9614162C6128ABD7790C65D711CfC43ea842153"
+        "0xadE916De67511E5C24af4174Be67143d0dA94959"
      assignedPermissions.upgrade.4:
-        "0x504D56cf68f791B45E3A2e895B0e1562f3431328"
+        "0xE9614162C6128ABD7790C65D711CfC43ea842153"
      assignedPermissions.upgrade.3:
-        "0x1c22740A0B4511E11D76434A424487862b593901"
+        "0xBa50434BC5fCC07406b1baD9AC72a4CDf776db15"
      assignedPermissions.upgrade.2:
-        "0xBa50434BC5fCC07406b1baD9AC72a4CDf776db15"
+        "0x504D56cf68f791B45E3A2e895B0e1562f3431328"
      assignedPermissions.upgrade.1:
-        "0xadE916De67511E5C24af4174Be67143d0dA94959"
+        "0x1c22740A0B4511E11D76434A424487862b593901"
      assignedPermissions.upgrade.0:
-        "0xed7525946A09056C6AaE29941b8323017382050e"
+        "0x1Ccf7e62889E6A93413DEAFC4e390Bd4047bDC32"
    }
```

Generated with discovered.json: 0x6ee73074136afb6ff4b8a13016b67ee042cddfba

# Diff at Fri, 09 Aug 2024 10:12:36 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@1f0da1d0aab7bc6b3b5e54e7e93480bd98e57035 block: 20413034
- current block number: 20413034

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20413034 (main branch discovery), not current.

```diff
    contract Swan Network Multisig (0x6197f64902b9275e6815F9A5b641Ed2291A5d39c) {
    +++ description: It can act on behalf of 0xCc8c55Ec2Ea3F3001C049eC934e72b55cf52fBf3, inheriting its permissions.
      assignedPermissions.owner:
-        ["0xCc8c55Ec2Ea3F3001C049eC934e72b55cf52fBf3"]
      assignedPermissions.configure:
+        ["0xCc8c55Ec2Ea3F3001C049eC934e72b55cf52fBf3"]
      values.$multisigThreshold:
-        "3 of 4 (75%)"
      values.getOwners:
-        ["0xB12bd496383288A3c7916AEF8e40197d61e07815","0x2c1877cDFa3649122CC0F41423A2a185217a2E23","0x04E1b8f517aF7dcD75a95B46DAdCc2c6f486502D","0x3FcB6E08A960EF52Ec3101A444f71A2Fd964b248"]
      values.getThreshold:
-        3
      values.$members:
+        ["0xB12bd496383288A3c7916AEF8e40197d61e07815","0x2c1877cDFa3649122CC0F41423A2a185217a2E23","0x04E1b8f517aF7dcD75a95B46DAdCc2c6f486502D","0x3FcB6E08A960EF52Ec3101A444f71A2Fd964b248"]
      values.$threshold:
+        3
      values.multisigThreshold:
+        "3 of 4 (75%)"
    }
```

```diff
    contract ProxyAdmin (0xCc8c55Ec2Ea3F3001C049eC934e72b55cf52fBf3) {
    +++ description: It can upgrade the bridge implementation potentially gaining access to all funds, and change any system component.
      assignedPermissions.admin:
-        ["0x1Ccf7e62889E6A93413DEAFC4e390Bd4047bDC32","0x1c22740A0B4511E11D76434A424487862b593901","0x504D56cf68f791B45E3A2e895B0e1562f3431328","0xBa50434BC5fCC07406b1baD9AC72a4CDf776db15","0xE9614162C6128ABD7790C65D711CfC43ea842153","0xadE916De67511E5C24af4174Be67143d0dA94959","0xed7525946A09056C6AaE29941b8323017382050e"]
      assignedPermissions.owner:
-        ["0x55Aec4EE11dA7d655565cCc2EB3bF21a46C94e6f"]
      assignedPermissions.upgrade:
+        ["0xed7525946A09056C6AaE29941b8323017382050e","0xadE916De67511E5C24af4174Be67143d0dA94959","0xBa50434BC5fCC07406b1baD9AC72a4CDf776db15","0x1c22740A0B4511E11D76434A424487862b593901","0x504D56cf68f791B45E3A2e895B0e1562f3431328","0xE9614162C6128ABD7790C65D711CfC43ea842153","0x1Ccf7e62889E6A93413DEAFC4e390Bd4047bDC32"]
      assignedPermissions.configure:
+        ["0x55Aec4EE11dA7d655565cCc2EB3bF21a46C94e6f"]
    }
```

Generated with discovered.json: 0x20eea9b84c2fbfdd528502ba2b41d9e13a9bff6d

# Diff at Tue, 30 Jul 2024 11:16:08 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@b2b6471ff62871f4956541f42ec025c356c08f7e block: 20413034
- current block number: 20413034

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20413034 (main branch discovery), not current.

```diff
    contract SystemConfig (0x504D56cf68f791B45E3A2e895B0e1562f3431328) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      fieldMeta:
+        {"gasLimit":{"severity":"LOW","description":"Gas limit for blocks on L2."}}
    }
```

Generated with discovered.json: 0x384ba11ab649558fc75508b449408c264f12d147

# Diff at Mon, 29 Jul 2024 15:11:50 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- current block number: 20413034

## Description

Initial discovery: OP stack rollup with non-onboarded SuperchainConfig.

## Initial discovery

```diff
+   Status: CREATED
    contract L1CrossDomainMessenger (0x15567C4FfD9109795dFf1D9A5233D10aef0738D2)
    +++ description: None
```

```diff
+   Status: CREATED
    contract L2OutputOracle (0x1c22740A0B4511E11D76434A424487862b593901)
    +++ description: None
```

```diff
+   Status: CREATED
    contract L1ERC721Bridge (0x1Ccf7e62889E6A93413DEAFC4e390Bd4047bDC32)
    +++ description: None
```

```diff
+   Status: CREATED
    contract SystemConfig (0x504D56cf68f791B45E3A2e895B0e1562f3431328)
    +++ description: None
```

```diff
+   Status: CREATED
    contract AddressManager (0x55Aec4EE11dA7d655565cCc2EB3bF21a46C94e6f)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Swan Network Multisig (0x6197f64902b9275e6815F9A5b641Ed2291A5d39c)
    +++ description: None
```

```diff
+   Status: CREATED
    contract SuperchainConfig (0xadE916De67511E5C24af4174Be67143d0dA94959)
    +++ description: None
```

```diff
+   Status: CREATED
    contract OptimismPortal (0xBa50434BC5fCC07406b1baD9AC72a4CDf776db15)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ProxyAdmin (0xCc8c55Ec2Ea3F3001C049eC934e72b55cf52fBf3)
    +++ description: None
```

```diff
+   Status: CREATED
    contract OptimismMintableERC20Factory (0xE9614162C6128ABD7790C65D711CfC43ea842153)
    +++ description: None
```

```diff
+   Status: CREATED
    contract L1StandardBridge (0xed7525946A09056C6AaE29941b8323017382050e)
    +++ description: None
```
