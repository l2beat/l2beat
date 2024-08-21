Generated with discovered.json: 0xe03dfb2a6dd1ed68503a47ad387a81dd44c5be5d

# Diff at Wed, 21 Aug 2024 10:02:53 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@2f6dde3357bf5d79196b6e94f79d853a6c4ec72b block: 20512023
- current block number: 20512023

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20512023 (main branch discovery), not current.

```diff
    contract EclipseMultisig (0x7B2c1CbB33c53c3C6a695e36096AD2cfCE1c0efC) {
    +++ description: None
      assignedPermissions:
-        {"upgrade":["0xD7E4b67E735733aC98a88F13d087D8aac670E644"]}
      receivedPermissions:
+        [{"permission":"upgrade","target":"0xD7E4b67E735733aC98a88F13d087D8aac670E644","via":[]}]
    }
```

```diff
    contract Contract3 (0x83cB71D80078bf670b3EfeC6AD9E5E6407cD0fd1) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x0000000000000000000000000000000000000000","via":[]}]
    }
```

```diff
    contract Contract1 (0xb23B2492f7A9631104A5877F7FFA00633660968d) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x0000000000000000000000000000000000000000","via":[]}]
    }
```

```diff
    contract Contract2 (0xD7E4b67E735733aC98a88F13d087D8aac670E644) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x7B2c1CbB33c53c3C6a695e36096AD2cfCE1c0efC","via":[]}]
    }
```

Generated with discovered.json: 0xf211bfdcc94c6dd53cc0a2e3c91beb23eb9c3024

# Diff at Mon, 12 Aug 2024 10:45:43 GMT:

- author: Luca Donno (<donnoh99@gmail.com>)
- current block number: 20512023

## Description

Provide description of changes. This section will be preserved.

## Initial discovery

```diff
+   Status: CREATED
    contract EclipseMultisig (0x7B2c1CbB33c53c3C6a695e36096AD2cfCE1c0efC)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Contract3 (0x83cB71D80078bf670b3EfeC6AD9E5E6407cD0fd1)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Contract1 (0xb23B2492f7A9631104A5877F7FFA00633660968d)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Contract2 (0xD7E4b67E735733aC98a88F13d087D8aac670E644)
    +++ description: None
```
