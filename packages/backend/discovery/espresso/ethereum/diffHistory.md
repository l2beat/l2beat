Generated with discovered.json: 0xce96ab18d3074820b84a095df1e0a31f29ea89b5

# Diff at Mon, 02 Dec 2024 14:37:08 GMT:

- author: Michał Podsiadły (<michal.podsiadly@l2beat.com>)
- comparing to: main@fbb831c7299974e6b8a2f29bfe84827fd888c98c block: 21273402
- current block number: 21315463

## Description

Migrate description to discovery config.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21273402 (main branch discovery), not current.

```diff
    contract HotShotLightClient (0x95Ca91Cea73239b15E5D2e5A74d02d6b5E0ae458) {
    +++ description: The DA bridge contract that stores and verifies HotShot state commitments on Ethereum.
      description:
+        "The DA bridge contract that stores and verifies HotShot state commitments on Ethereum."
    }
```

Generated with discovered.json: 0x35ac1bf04ae2243209a36eb3a2853daa40ebe020

# Diff at Tue, 26 Nov 2024 17:25:29 GMT:

- author: vincfurc (<10850139+vincfurc@users.noreply.github.com>)
- current block number: 21273402

## Description

First discovery. HotShotLightClient implementation is unverified.

## Initial discovery

```diff
+   Status: CREATED
    contract Safe (0x34F5af5158171Ffd2475d21dB5fc3B311F221982)
    +++ description: None
```

```diff
+   Status: CREATED
    contract HotShotLightClient (0x95Ca91Cea73239b15E5D2e5A74d02d6b5E0ae458)
    +++ description: None
```
