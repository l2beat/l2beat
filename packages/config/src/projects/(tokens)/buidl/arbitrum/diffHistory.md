Generated with discovered.json: 0xab3716c1307ccd08fcdd16e33c3cfb197df21349

# Diff at Wed, 20 Aug 2025 09:27:21 GMT:

- author: Michał Podsiadły (<michal.podsiadly@l2beat.com>)
- comparing to: main@c8847d1a63c9954979c8abfb64bfc56929ed7e7f block: 1755163834
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

Generated with discovered.json: 0xdb29cde898fce21d00aac15a506a34475556885c

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
