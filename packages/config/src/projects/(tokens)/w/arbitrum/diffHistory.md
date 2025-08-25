Generated with discovered.json: 0x97f1418cc6287c8dd22b24c4b0af468070249b6c

# Diff at Wed, 20 Aug 2025 09:27:23 GMT:

- author: Michał Podsiadły (<michal.podsiadly@l2beat.com>)
- comparing to: main@c8847d1a63c9954979c8abfb64bfc56929ed7e7f block: 1752832725
- current timestamp: 1752832725

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 1752832725 (main branch discovery), not current.

```diff
    contract WToken (0xB0fFa8000886e57F86dd5264b9582b2Ad87b2b91) {
    +++ description: None
      values.$tokenData.canonical:
+        false
    }
```

Generated with discovered.json: 0x5c22f20f3bd245b8e1cbda697030cee8efe75e9b

# Diff at Fri, 18 Jul 2025 10:03:32 GMT:

- author: Michał Podsiadły (<michal.podsiadly@l2beat.com>)
- current block number: 358957199

## Description

Provide description of changes. This section will be preserved.

## Initial discovery

```diff
+   Status: CREATED
    contract WToken (0xB0fFa8000886e57F86dd5264b9582b2Ad87b2b91)
    +++ description: None
```
