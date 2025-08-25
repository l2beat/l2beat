Generated with discovered.json: 0xf4beac9f757cc753f2a620452346f32927fac55c

# Diff at Mon, 25 Aug 2025 17:04:26 GMT:

- author: Michał Podsiadły (<michal.podsiadly@l2beat.com>)
- comparing to: main@828b4eded571ebe4abe88b292bc0c7a10079c1e7 block: 1755163834
- current timestamp: 1755163834

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 1755163834 (main branch discovery), not current.

```diff
    contract DSToken (0xA6525Ae43eDCd03dC08E775774dCAbd3bb925872) {
    +++ description: None
      values.$tokenData.canonical:
+        false
    }
```

Generated with discovered.json: 0x1547c44a5b74af5ffd33d9f71c728d0e30ba18c2

# Diff at Fri, 18 Jul 2025 10:03:31 GMT:

- author: Michał Podsiadły (<michal.podsiadly@l2beat.com>)
- current block number: 358948247

## Description

initial discovery (adrian).

## Initial discovery

```diff
+   Status: CREATED
    contract DSToken (0xA6525Ae43eDCd03dC08E775774dCAbd3bb925872)
    +++ description: None
```
