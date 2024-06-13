Generated with discovered.json: 0x88bd44806a479ed9b0bf4389987cbfad70caca1e

# Diff at Tue, 04 Jun 2024 15:23:37 GMT:

- author: sekuba (<sekuba@users.noreply.github.com>)
- comparing to: main@ff4734badb34915faebacc7140d595936b262e64 block: 20018580
- current block number: 20019330

## Description

Config changes to the discovery, no relevant onchain changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20018580 (main branch discovery), not current.

```diff
    contract ZkTrueUp (0x09E01425780094a9754B2bd8A3298f73ce837CF9) {
    +++ description: None
      values.getAaveV3Pool:
+        "0x87870Bca3F3fD6335C3F4ce8392D69350B4fA4E2"
      values.getPoseidonUnit2:
+        "0x3B1D7E06a1bFfD89ECd8026CF287C11F6Ec34f0D"
    }
```

```diff
-   Status: DELETED
    contract WETH9 (0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2)
    +++ description: None
```

```diff
+   Status: CREATED
    contract  (0x3B1D7E06a1bFfD89ECd8026CF287C11F6Ec34f0D)
    +++ description: None
```

Generated with discovered.json: 0x7385a1d70af503a9ff4d64a713c79e405f0c3b3a

# Diff at Tue, 04 Jun 2024 12:52:59 GMT:

- author: sekuba (<sekuba@users.noreply.github.com>)
- current block number: 20018580

## Description

Initial discovery: zksync lite fork with considerable modifications.

## Initial discovery

```diff
+   Status: CREATED
    contract ZkTrueUp (0x09E01425780094a9754B2bd8A3298f73ce837CF9)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Verifier (0x23369A60E5A8f422E38d799eD55e7AD8Ed4A86cE)
    +++ description: None
```

```diff
+   Status: CREATED
    contract GnosisSafe (0x23bCad9BFB1378cd45b32525B835F037b673f529)
    +++ description: None
```

```diff
+   Status: CREATED
    contract GnosisSafe (0x2df3e912aeDe36ea5EaB06232ca3b239a40A8165)
    +++ description: None
```

```diff
+   Status: CREATED
    contract EvacuationFacet (0x882aBFb2F6A67d36350499991638044e8Bd83a72)
    +++ description: None
```

```diff
+   Status: CREATED
    contract AccountFacet (0x8D0fc76595E42f38c771ecEE627DA5654Ca2E75A)
    +++ description: None
```

```diff
+   Status: CREATED
    contract RollupFacet (0x955cdD2E56Ca2776a101a552A318d28fe311398D)
    +++ description: None
```

```diff
+   Status: CREATED
    contract EvacuVerifier (0x9c7Df3981A89eD04588907843fe2a6c1BcCc4467)
    +++ description: None
```

```diff
+   Status: CREATED
    contract TermStructureMultisig (0xa00d50A40B1635D293c87BA36503bD2504b5D818)
    +++ description: None
```

```diff
+   Status: CREATED
    contract GnosisSafe (0xB7ef7117FfCa1956249B666D9fdBe182cFbbF5ca)
    +++ description: None
```

```diff
+   Status: CREATED
    contract WETH9 (0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2)
    +++ description: None
```
