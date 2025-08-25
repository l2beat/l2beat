Generated with discovered.json: 0x44fc435f9d954c575f5e699681cf20897f19ed67

# Diff at Wed, 20 Aug 2025 09:27:26 GMT:

- author: Michał Podsiadły (<michal.podsiadly@l2beat.com>)
- comparing to: main@c8847d1a63c9954979c8abfb64bfc56929ed7e7f block: 1752830555
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
+        false
    }
```

Generated with discovered.json: 0xa361c45dad0c1f572d71602685d8437f492e6777

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
