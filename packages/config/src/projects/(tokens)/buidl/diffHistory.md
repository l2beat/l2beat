Generated with discovered.json: 0xd99fa48c41251ed2db7902449c8a373164774d8a

# Diff at Tue, 07 Oct 2025 14:35:51 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@8565ff097fc0a7fe0355555b648b1799518c8f35 block: 1755163834
- current timestamp: 1759846774

## Description

BUIDL is now considered a restricted rwa.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 1755163834 (main branch discovery), not current.

```diff
    contract BlackRock USD Institutional Digital Liquidity Fund Token (arb1:0xA6525Ae43eDCd03dC08E775774dCAbd3bb925872) {
    +++ description: None
      values.$tokenData.category:
-        "other"
+        "rwaRestricted"
    }
```

Generated with discovered.json: 0xa3a5a21eaf92862867ab40115b1c1fb41075179e

# Diff at Wed, 10 Sep 2025 16:42:54 GMT:

- author: Michał Podsiadły (<michal.podsiadly@l2beat.com>)
- comparing to: main@e79218dfb0e44fc654f84ade8da48b85c69f1abb block: 1755163834
- current timestamp: 1755163834

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 1755163834 (main branch discovery), not current.

```diff
    contract BlackRock USD Institutional Digital Liquidity Fund Token (arb1:0xA6525Ae43eDCd03dC08E775774dCAbd3bb925872) {
    +++ description: None
      name:
-        "DSToken"
+        "BlackRock USD Institutional Digital Liquidity Fund Token"
    }
```

Generated with discovered.json: 0x0c2f88da2b70da689836c0c21b00be05c81cdffe

# Diff at Mon, 01 Sep 2025 10:01:10 GMT:

Merge mark

Generated with discovered.json: 0x1547c44a5b74af5ffd33d9f71c728d0e30ba18c2

# Diff at Fri, 18 Jul 2025 10:03:31 GMT:

- chain: arbitrum
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

