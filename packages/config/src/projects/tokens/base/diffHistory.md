Generated with discovered.json: 0x568391c94fc70497fd0094107a9e96186ac199b2

# Diff at Mon, 28 Apr 2025 09:20:42 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@abb69590061038da05feece26d3be8369d45e4a9 block: 29215620
- current block number: 29519230

## Description

Add USDC and CCTP v1 and v2 on base.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 29215620 (main branch discovery), not current.

```diff
+   Status: CREATED
    contract TokenMessenger (0x1682Ae6375C4E4A97e4B583BC394c861A46D8962)
    +++ description: Part of CCTP
```

```diff
+   Status: CREATED
    contract MasterMinter (0x2230393EDAD0299b7E7B59F20AA856cD1bEd52e1)
    +++ description: None
```

```diff
+   Status: CREATED
    contract TokenMessengerV2 (0x28b5a0e9C621a5BadaA536219b3a228C8168cf5d)
    +++ description: Part of CCTP
```

```diff
+   Status: CREATED
    contract MessageTransmitterV2 (0x81D40F21F12A8F0E3252Bccb954D722d4c464B64)
    +++ description: Part of CCTP
```

```diff
+   Status: CREATED
    contract USDC (0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913)
    +++ description: None
```

```diff
+   Status: CREATED
    contract MessageTransmitter (0xAD09780d193884d503182aD4588450C416D6F9D4)
    +++ description: Part of CCTP
```

```diff
+   Status: CREATED
    contract TokenMinter (0xe45B133ddc64bE80252b0e9c75A8E74EF280eEd6)
    +++ description: Part of CCTP: Used for automated access control for minting.
```

```diff
+   Status: CREATED
    contract TokenMinterV2 (0xfd78EE919681417d192449715b2594ab58f5D002)
    +++ description: Part of CCTP: Used for automated access control for minting.
```

Generated with discovered.json: 0x7373a5757b7ceead98f064f6c18a00ae87108903

# Diff at Mon, 21 Apr 2025 08:01:01 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- current block number: 29215620

## Description

add wOETH (CCIP) discovery.

## Initial discovery

```diff
+   Status: CREATED
    contract SafeL2 (0x4FF1b9D9ba8558F5EAfCec096318eA0d8b541971)
    +++ description: None
```

```diff
+   Status: CREATED
    contract GnosisSafeL2 (0x92A19381444A001d62cE67BaFF066fA1111d7202)
    +++ description: None
```

```diff
+   Status: CREATED
    contract BridgedWOETH (0xD8724322f44E5c58D7A815F542036fb17DbbF839)
    +++ description: None
```

```diff
+   Status: CREATED
    contract L1Timelock (0xf817cb3092179083c48c014688D98B72fB61464f)
    +++ description: A standard timelock with access control. The current minimum delay is 2d.
```
