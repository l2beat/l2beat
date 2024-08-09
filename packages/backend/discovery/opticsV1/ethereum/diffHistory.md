Generated with discovered.json: 0x4967742811d227dceb18c71f7100d39e7b0ff7a6

# Diff at Fri, 09 Aug 2024 12:00:54 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@bf40aa32f030fd312056ca0ef198c8550467d1d7 block: 19532023
- current block number: 19532023

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19532023 (main branch discovery), not current.

```diff
    contract UpgradeBeaconController (0xbB6d6333FAFd2cae7ef4c5EFBF8f048F2F109D1B) {
    +++ description: None
      assignedPermissions.upgrade.2:
-        "0x42303634F37956687fB7ff2c6146AC842481A052"
+        "0x7725EadaC5Ee986CAc8317a1d2fB16e59e079E8b"
      assignedPermissions.upgrade.1:
-        "0x7725EadaC5Ee986CAc8317a1d2fB16e59e079E8b"
+        "0x6a39909e805A3eaDd2b61fFf61147796ca6aBB47"
      assignedPermissions.upgrade.0:
-        "0x6a39909e805A3eaDd2b61fFf61147796ca6aBB47"
+        "0x42303634F37956687fB7ff2c6146AC842481A052"
    }
```

Generated with discovered.json: 0x8862e37e70bdde5d3f2544b955e36289c73b5496

# Diff at Fri, 09 Aug 2024 10:10:58 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@1f0da1d0aab7bc6b3b5e54e7e93480bd98e57035 block: 19532023
- current block number: 19532023

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19532023 (main branch discovery), not current.

```diff
    contract RecoveryManager (0x2bB2a5A724170357cb691841F40d26A950d8C33D) {
    +++ description: None
      values.$multisigThreshold:
-        "4 of 7 (57%)"
      values.getOwners:
-        ["0xFCcD3516d6BB62b009088aDae1E349430dDF6e77","0x63c079444e07D82d33399DE7D56d6E48740494c7","0xa725898D6F73C512f803B564A89DFbd96cF298EC","0xd85DC9A21378EF738A248236E970c2e0be89C9c2","0xeE2b1e23e71052860C14f69E84AAF78478606D63","0x7d7cd2ED526F99D05A05a93CCf42C1ADdBe78552","0x7519Db53B63d72721470319A5F4462D587Bb3008"]
      values.getThreshold:
-        4
      values.$members:
+        ["0xFCcD3516d6BB62b009088aDae1E349430dDF6e77","0x63c079444e07D82d33399DE7D56d6E48740494c7","0xa725898D6F73C512f803B564A89DFbd96cF298EC","0xd85DC9A21378EF738A248236E970c2e0be89C9c2","0xeE2b1e23e71052860C14f69E84AAF78478606D63","0x7d7cd2ED526F99D05A05a93CCf42C1ADdBe78552","0x7519Db53B63d72721470319A5F4462D587Bb3008"]
      values.$threshold:
+        4
      values.multisigThreshold:
+        "4 of 7 (57%)"
    }
```

```diff
    contract Governor (0x5Fa96B622D1F4e920b92040c10fA297ca496ad37) {
    +++ description: None
      values.$multisigThreshold:
-        "3 of 7 (43%)"
      values.getOwners:
-        ["0x7d7cd2ED526F99D05A05a93CCf42C1ADdBe78552","0x63c079444e07D82d33399DE7D56d6E48740494c7","0x5c95FED053997f30b7Aa69979C208a5D15479f5D","0x229D3A236158482728f1dc107E3b01514053307b","0xBcd15f82Ae461335257d0851A18948784cF79E9d","0xB98E1f5358cd8A285a34ae59898309baA2E2e712","0x07f5bFE05C5C4BF4a86af7BAf667e3737A3BA18F"]
      values.getThreshold:
-        3
      values.$members:
+        ["0x7d7cd2ED526F99D05A05a93CCf42C1ADdBe78552","0x63c079444e07D82d33399DE7D56d6E48740494c7","0x5c95FED053997f30b7Aa69979C208a5D15479f5D","0x229D3A236158482728f1dc107E3b01514053307b","0xBcd15f82Ae461335257d0851A18948784cF79E9d","0xB98E1f5358cd8A285a34ae59898309baA2E2e712","0x07f5bFE05C5C4BF4a86af7BAf667e3737A3BA18F"]
      values.$threshold:
+        3
      values.multisigThreshold:
+        "3 of 7 (43%)"
    }
```

```diff
    contract UpgradeBeaconController (0xbB6d6333FAFd2cae7ef4c5EFBF8f048F2F109D1B) {
    +++ description: None
      assignedPermissions.admin:
-        ["0x42303634F37956687fB7ff2c6146AC842481A052","0x6a39909e805A3eaDd2b61fFf61147796ca6aBB47","0x7725EadaC5Ee986CAc8317a1d2fB16e59e079E8b","0xf25C5932bb6EFc7afA4895D9916F2abD7151BF97"]
      assignedPermissions.upgrade:
+        ["0x6a39909e805A3eaDd2b61fFf61147796ca6aBB47","0x7725EadaC5Ee986CAc8317a1d2fB16e59e079E8b","0x42303634F37956687fB7ff2c6146AC842481A052","0xf25C5932bb6EFc7afA4895D9916F2abD7151BF97"]
    }
```

```diff
    contract GnosisSafe (0xBcd15f82Ae461335257d0851A18948784cF79E9d) {
    +++ description: None
      values.$multisigThreshold:
-        "1 of 2 (50%)"
      values.getOwners:
-        ["0xb4a28F2d7f9c909478390022196B08dea5b228fa","0x11C338Cbd278C5Cd9CA885c04bDF2282F548642f"]
      values.getThreshold:
-        1
      values.$members:
+        ["0xb4a28F2d7f9c909478390022196B08dea5b228fa","0x11C338Cbd278C5Cd9CA885c04bDF2282F548642f"]
      values.$threshold:
+        1
      values.multisigThreshold:
+        "1 of 2 (50%)"
    }
```

Generated with discovered.json: 0x9f8fd08a9770528b726804306a76b5caec509f88

# Diff at Thu, 28 Mar 2024 10:30:43 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@dd32bb06b292cc8459fb09925454ee3a90f5c27e block: 19418951
- current block number: 19532023

## Description

Update discovery to include the multisig threshold.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19418951 (main branch discovery), not current.

```diff
    contract RecoveryManager (0x2bB2a5A724170357cb691841F40d26A950d8C33D) {
    +++ description: None
      upgradeability.threshold:
+        "4 of 7 (57%)"
    }
```

```diff
    contract Governor (0x5Fa96B622D1F4e920b92040c10fA297ca496ad37) {
    +++ description: None
      upgradeability.threshold:
+        "3 of 7 (43%)"
    }
```

```diff
    contract GnosisSafe (0xBcd15f82Ae461335257d0851A18948784cF79E9d) {
    +++ description: None
      upgradeability.threshold:
+        "1 of 2 (50%)"
    }
```

Generated with discovered.json: 0x159de1be895e6c6e43beb7bdbb71ffdced4bbe70

# Diff at Fri, 13 Oct 2023 07:04:23 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@28e18077472448efd6132e6ee714b582cc1ee80b

## Description

Newly created contracts are the result of rediscovering the `upgradeBeacon` address.

## Watched changes

```diff
+   Status: CREATED
    contract ReplicaUpgradeBeacon (0x10a432946e24C49866c243a13BE7205B3EF929ee) {
    }
```

```diff
+   Status: CREATED
    contract BridgeUpgradeBeacon (0x3b96B42D1F4962CB21049fB237A886E2860AfacB) {
    }
```

```diff
+   Status: CREATED
    contract GovernanceUpgradeBeacon (0x681Edb6d52138cEa8210060C309230244BcEa61b) {
    }
```

```diff
+   Status: CREATED
    contract HomeUpgradeBeacon (0x9E4C2547307e221383A4bcba6065389C69Bd4628) {
    }
```

# Diff at Mon, 09 Oct 2023 13:37:39 GMT:

- author: Luca Donno (<donnoh99@gmail.com>)
- comparing to: main@

## Description

Update discovery to include the multisig threshold.

## Watched changes

```diff
+   Status: CREATED
    contract RecoveryManager (0x2bB2a5A724170357cb691841F40d26A950d8C33D) {
    }
```

```diff
+   Status: CREATED
    contract UpdaterManager (0x2CC80EE8a3f9c85309866F4C6BDF82f6846891EC) {
    }
```

```diff
+   Status: CREATED
    contract GovernanceRouterBeaconProxy (0x42303634F37956687fB7ff2c6146AC842481A052) {
    }
```

```diff
+   Status: CREATED
    contract Governor (0x5Fa96B622D1F4e920b92040c10fA297ca496ad37) {
    }
```

```diff
+   Status: CREATED
    contract BridgeRouterBeaconProxy (0x6a39909e805A3eaDd2b61fFf61147796ca6aBB47) {
    }
```

```diff
+   Status: CREATED
    contract ReplicaBeaconProxy (0x7725EadaC5Ee986CAc8317a1d2fB16e59e079E8b) {
    }
```

```diff
+   Status: CREATED
    contract UpgradeBeaconController (0xbB6d6333FAFd2cae7ef4c5EFBF8f048F2F109D1B) {
    }
```

```diff
+   Status: CREATED
    contract GnosisSafe (0xBcd15f82Ae461335257d0851A18948784cF79E9d) {
    }
```

```diff
+   Status: CREATED
    contract XAppConnectionManager (0xcEc158A719d11005Bd9339865965bed938BEafA3) {
    }
```

```diff
+   Status: CREATED
    contract HomeBeaconProxy (0xf25C5932bb6EFc7afA4895D9916F2abD7151BF97) {
    }
```
