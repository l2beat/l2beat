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
