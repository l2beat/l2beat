Generated with discovered.json: 0xfd944a7f3caad77cb912c172d98fdec2b3c27956

# Diff at Thu, 28 Mar 2024 09:03:57 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@867de6120241d47b66bf76f83c490408eb3595b0 block: 16154924
- current block number: 19531595

## Description

Update discovery to include the multisig threshold.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 16154924 (main branch discovery), not current.

```diff
    contract Hop Multisig (0x1ec078551A5ac8F0f51fAc57Ffc48Ea7d9A86E9d) {
    +++ description: None
      upgradeability.threshold:
+        "2 of 3 (67%)"
    }
```

Generated with discovered.json: 0x9a20a42b5832a97ae4e72f7947abb45265c60c17
