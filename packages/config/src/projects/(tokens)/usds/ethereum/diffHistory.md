Generated with discovered.json: 0x23d8c982a7d953c0b1eb85bfdac4a6222fac2974

# Diff at Mon, 25 Aug 2025 17:05:09 GMT:

- author: Michał Podsiadły (<michal.podsiadly@l2beat.com>)
- comparing to: main@828b4eded571ebe4abe88b292bc0c7a10079c1e7 block: 1752830555
- current timestamp: 1752830555

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 1752830555 (main branch discovery), not current.

```diff
    contract Usds (0xdC035D45d973E3EC169d2276DDab16f1e407384F) {
    +++ description: None
      values.$tokenData.canonical:
+        true
    }
```

Generated with discovered.json: 0x85fe3cbf9ecf4cc43b75774e78bf57666f4d5ebb

# Diff at Fri, 18 Jul 2025 10:03:34 GMT:

- author: Michał Podsiadły (<michal.podsiadly@l2beat.com>)
- current block number: 22945160

## Description

Provide description of changes. This section will be preserved.

## Initial discovery

```diff
+   Status: CREATED
    contract Usds (0xdC035D45d973E3EC169d2276DDab16f1e407384F)
    +++ description: None
```
