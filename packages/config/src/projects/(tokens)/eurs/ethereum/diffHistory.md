Generated with discovered.json: 0x421fbe7bec28f7f2ec66d1d58461ab92915746b0

# Diff at Mon, 25 Aug 2025 17:04:28 GMT:

- author: Michał Podsiadły (<michal.podsiadly@l2beat.com>)
- comparing to: main@828b4eded571ebe4abe88b292bc0c7a10079c1e7 block: 1752830495
- current timestamp: 1752830495

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 1752830495 (main branch discovery), not current.

```diff
    contract EURSToken (0xdB25f211AB05b1c97D595516F45794528a807ad8) {
    +++ description: None
      values.$tokenData.canonical:
+        true
    }
```

Generated with discovered.json: 0xcabea06ade5447b947e801ec236b77ae7ef63fd8

# Diff at Fri, 18 Jul 2025 10:03:33 GMT:

- author: Michał Podsiadły (<michal.podsiadly@l2beat.com>)
- current block number: 22945155

## Description

Provide description of changes. This section will be preserved.

## Initial discovery

```diff
+   Status: CREATED
    contract EURSToken (0xdB25f211AB05b1c97D595516F45794528a807ad8)
    +++ description: None
```
