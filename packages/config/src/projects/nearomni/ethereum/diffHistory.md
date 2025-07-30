Generated with discovered.json: 0x56f04c0b2a9fba156fa471a37c43c7b640fd88c7

# Diff at Mon, 14 Jul 2025 12:45:27 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@9f4300dad2f3d080cd56fa311d4a848556c74e72 block: 22545890
- current block number: 22545890

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22545890 (main branch discovery), not current.

```diff
    EOA  (0x1180c536465413eE05b206b3a99d4C6a9934D2b7) {
    +++ description: None
      address:
-        "0x1180c536465413eE05b206b3a99d4C6a9934D2b7"
+        "eth:0x1180c536465413eE05b206b3a99d4C6a9934D2b7"
    }
```

```diff
    EOA  (0x22EB4d37677eD931d9dE2218cecE1A832a147490) {
    +++ description: None
      address:
-        "0x22EB4d37677eD931d9dE2218cecE1A832a147490"
+        "eth:0x22EB4d37677eD931d9dE2218cecE1A832a147490"
    }
```

```diff
    contract Near Omni Multisig (0x2468603819Bf09Ed3Fb6f3EFeff24B1955f3CDE1) {
    +++ description: None
      address:
-        "0x2468603819Bf09Ed3Fb6f3EFeff24B1955f3CDE1"
+        "eth:0x2468603819Bf09Ed3Fb6f3EFeff24B1955f3CDE1"
      values.$implementation:
-        "0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552"
+        "eth:0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552"
      values.$members.0:
-        "0xed9cB50304991951Cbee747900484E9a041DA464"
+        "eth:0xed9cB50304991951Cbee747900484E9a041DA464"
      values.$members.1:
-        "0xF58096A602C960c841Bd83A29DE21c808a9c1ac9"
+        "eth:0xF58096A602C960c841Bd83A29DE21c808a9c1ac9"
      values.$members.2:
-        "0xCFB9C137E21E199757Ae3Ce705B199CB26A3b91d"
+        "eth:0xCFB9C137E21E199757Ae3Ce705B199CB26A3b91d"
      values.$members.3:
-        "0x1180c536465413eE05b206b3a99d4C6a9934D2b7"
+        "eth:0x1180c536465413eE05b206b3a99d4C6a9934D2b7"
      values.$members.4:
-        "0x8F3A347Eb3eB62fEa4975d293e052cD96abd36C6"
+        "eth:0x8F3A347Eb3eB62fEa4975d293e052cD96abd36C6"
      implementationNames.0x2468603819Bf09Ed3Fb6f3EFeff24B1955f3CDE1:
-        "Proxy"
      implementationNames.0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552:
-        "GnosisSafe"
      implementationNames.eth:0x2468603819Bf09Ed3Fb6f3EFeff24B1955f3CDE1:
+        "Proxy"
      implementationNames.eth:0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552:
+        "GnosisSafe"
    }
```

```diff
    EOA  (0x8F3A347Eb3eB62fEa4975d293e052cD96abd36C6) {
    +++ description: None
      address:
-        "0x8F3A347Eb3eB62fEa4975d293e052cD96abd36C6"
+        "eth:0x8F3A347Eb3eB62fEa4975d293e052cD96abd36C6"
    }
```

```diff
    EOA  (0xCFB9C137E21E199757Ae3Ce705B199CB26A3b91d) {
    +++ description: None
      address:
-        "0xCFB9C137E21E199757Ae3Ce705B199CB26A3b91d"
+        "eth:0xCFB9C137E21E199757Ae3Ce705B199CB26A3b91d"
    }
```

```diff
    contract BridgeToken (0xd5A0165BA4E83769AEF74e0855497258aCe4C88F) {
    +++ description: The standard implementation used for new tokens minted by the bridge.
      address:
-        "0xd5A0165BA4E83769AEF74e0855497258aCe4C88F"
+        "eth:0xd5A0165BA4E83769AEF74e0855497258aCe4C88F"
      values.owner:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      values.pendingOwner:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      implementationNames.0xd5A0165BA4E83769AEF74e0855497258aCe4C88F:
-        "BridgeToken"
      implementationNames.eth:0xd5A0165BA4E83769AEF74e0855497258aCe4C88F:
+        "BridgeToken"
    }
```

```diff
    EOA  (0xD9cB077700AA4D32d30bDA5e99bb171549b5a382) {
    +++ description: None
      address:
-        "0xD9cB077700AA4D32d30bDA5e99bb171549b5a382"
+        "eth:0xD9cB077700AA4D32d30bDA5e99bb171549b5a382"
    }
```

```diff
    contract OmniBridge (0xe00c629aFaCCb0510995A2B95560E446A24c85B9) {
    +++ description: Escrow for all tokens of the NEAR Omnibridge.
      address:
-        "0xe00c629aFaCCb0510995A2B95560E446A24c85B9"
+        "eth:0xe00c629aFaCCb0510995A2B95560E446A24c85B9"
      values.$admin:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      values.$implementation:
-        "0x53785920165FbDf33B3F56885DBC8D12854ac414"
+        "eth:0x53785920165FbDf33B3F56885DBC8D12854ac414"
      values.$pastUpgrades.0.2.0:
-        "0x53785920165FbDf33B3F56885DBC8D12854ac414"
+        "eth:0x53785920165FbDf33B3F56885DBC8D12854ac414"
      values.accessControl.DEFAULT_ADMIN_ROLE.members.0:
-        "0x2468603819Bf09Ed3Fb6f3EFeff24B1955f3CDE1"
+        "eth:0x2468603819Bf09Ed3Fb6f3EFeff24B1955f3CDE1"
      values.accessControl.PAUSABLE_ADMIN_ROLE.members.0:
-        "0xD9cB077700AA4D32d30bDA5e99bb171549b5a382"
+        "eth:0xD9cB077700AA4D32d30bDA5e99bb171549b5a382"
      values.defaultAdminAC.0:
-        "0x2468603819Bf09Ed3Fb6f3EFeff24B1955f3CDE1"
+        "eth:0x2468603819Bf09Ed3Fb6f3EFeff24B1955f3CDE1"
+++ description: Derived EVM address of the signer for all incoming bridge messages. NEAR calls this chain signatures and it is supposed to use MPC.
+++ severity: HIGH
      values.nearBridgeDerivedAddress:
-        "0x22EB4d37677eD931d9dE2218cecE1A832a147490"
+        "eth:0x22EB4d37677eD931d9dE2218cecE1A832a147490"
      values.pauseAdminAC.0:
-        "0xD9cB077700AA4D32d30bDA5e99bb171549b5a382"
+        "eth:0xD9cB077700AA4D32d30bDA5e99bb171549b5a382"
      values.tokenImplementationAddress:
-        "0xd5A0165BA4E83769AEF74e0855497258aCe4C88F"
+        "eth:0xd5A0165BA4E83769AEF74e0855497258aCe4C88F"
      implementationNames.0xe00c629aFaCCb0510995A2B95560E446A24c85B9:
-        "ERC1967Proxy"
      implementationNames.0x53785920165FbDf33B3F56885DBC8D12854ac414:
-        "OmniBridge"
      implementationNames.eth:0xe00c629aFaCCb0510995A2B95560E446A24c85B9:
+        "ERC1967Proxy"
      implementationNames.eth:0x53785920165FbDf33B3F56885DBC8D12854ac414:
+        "OmniBridge"
    }
```

```diff
    EOA  (0xed9cB50304991951Cbee747900484E9a041DA464) {
    +++ description: None
      address:
-        "0xed9cB50304991951Cbee747900484E9a041DA464"
+        "eth:0xed9cB50304991951Cbee747900484E9a041DA464"
    }
```

```diff
    EOA  (0xF58096A602C960c841Bd83A29DE21c808a9c1ac9) {
    +++ description: None
      address:
-        "0xF58096A602C960c841Bd83A29DE21c808a9c1ac9"
+        "eth:0xF58096A602C960c841Bd83A29DE21c808a9c1ac9"
    }
```

```diff
+   Status: CREATED
    contract Near Omni Multisig (0x2468603819Bf09Ed3Fb6f3EFeff24B1955f3CDE1)
    +++ description: None
```

```diff
+   Status: CREATED
    contract BridgeToken (0xd5A0165BA4E83769AEF74e0855497258aCe4C88F)
    +++ description: The standard implementation used for new tokens minted by the bridge.
```

```diff
+   Status: CREATED
    contract OmniBridge (0xe00c629aFaCCb0510995A2B95560E446A24c85B9)
    +++ description: Escrow for all tokens of the NEAR Omnibridge.
```

Generated with discovered.json: 0xe1250502c44cbf27a24e300ee45e1fe76e1e7b22

# Diff at Fri, 04 Jul 2025 12:19:10 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@1f56dc47fe915564d4555300304da4d3bcbc087f block: 22545890
- current block number: 22545890

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22545890 (main branch discovery), not current.

```diff
    EOA  (0x22EB4d37677eD931d9dE2218cecE1A832a147490) {
    +++ description: None
      receivedPermissions.0.from:
-        "ethereum:0xe00c629aFaCCb0510995A2B95560E446A24c85B9"
+        "eth:0xe00c629aFaCCb0510995A2B95560E446A24c85B9"
    }
```

```diff
    contract Near Omni Multisig (0x2468603819Bf09Ed3Fb6f3EFeff24B1955f3CDE1) {
    +++ description: None
      receivedPermissions.0.from:
-        "ethereum:0xe00c629aFaCCb0510995A2B95560E446A24c85B9"
+        "eth:0xe00c629aFaCCb0510995A2B95560E446A24c85B9"
      receivedPermissions.1.from:
-        "ethereum:0xe00c629aFaCCb0510995A2B95560E446A24c85B9"
+        "eth:0xe00c629aFaCCb0510995A2B95560E446A24c85B9"
    }
```

```diff
    EOA  (0xD9cB077700AA4D32d30bDA5e99bb171549b5a382) {
    +++ description: None
      receivedPermissions.0.from:
-        "ethereum:0xe00c629aFaCCb0510995A2B95560E446A24c85B9"
+        "eth:0xe00c629aFaCCb0510995A2B95560E446A24c85B9"
    }
```

Generated with discovered.json: 0x47a8e01b2c9c084393495c0c0d62bc89756a4148

# Diff at Fri, 23 May 2025 13:33:50 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- current block number: 22545890

## Description

Initial discovery of the Near Omni bridge.

## Initial discovery

```diff
+   Status: CREATED
    contract Near Omni Multisig (0x2468603819Bf09Ed3Fb6f3EFeff24B1955f3CDE1)
    +++ description: None
```

```diff
+   Status: CREATED
    contract BridgeToken (0xd5A0165BA4E83769AEF74e0855497258aCe4C88F)
    +++ description: The standard implementation used for new tokens minted by the bridge.
```

```diff
+   Status: CREATED
    contract OmniBridge (0xe00c629aFaCCb0510995A2B95560E446A24c85B9)
    +++ description: Escrow for all tokens of the NEAR Omnibridge.
```
