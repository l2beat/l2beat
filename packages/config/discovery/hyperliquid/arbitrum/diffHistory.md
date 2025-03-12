Generated with discovered.json: 0x856955a084faa09f1b8eb67d0be51608665fc3dd

# Diff at Tue, 04 Mar 2025 10:40:25 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@98d260b45fe0d2195ce5e629bd7b200c8706e8ba block: 300202969
- current block number: 300202969

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 300202969 (main branch discovery), not current.

```diff
    contract HyperliquidBridge (0x2Df1c51E09aECF9cacB7bc98cB1742757f163dF7) {
    +++ description: Single contract containing all the logic for the Hyperliquid bridge. It manages deposits, withdrawals, the hot and cold validator sets, as well as the lockers, finalizers, and all the permissioned functions.
      sinceBlock:
+        155689071
    }
```

Generated with discovered.json: 0x3e81a51537faa63f5c1040276f925611b6c4f0d2

# Diff at Tue, 28 Jan 2025 15:49:26 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@b60bc0e936cb7b213e24f14ed69abaff22493651 block: 299812098
- current block number: 300202969

## Description

Pauser vote removed. Heartbeat txes are coming again from the address.

## Watched changes

```diff
    contract HyperliquidBridge (0x2Df1c51E09aECF9cacB7bc98cB1742757f163dF7) {
    +++ description: Single contract containing all the logic for the Hyperliquid bridge. It manages deposits, withdrawals, the hot and cold validator sets, as well as the lockers, finalizers, and all the permissioned functions.
      values.getLockersVotingLock.0:
-        "0xf9d2282A4A4C216f624717C0747D23146FC048c5"
    }
```

Generated with discovered.json: 0x06ea91b4f79ba32cd93174c222dcba5c239a9625

# Diff at Mon, 27 Jan 2025 12:25:17 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@43cb526d71ed01f024dced9d5aea2a30cf306714 block: 287788820
- current block number: 299812098

## Description

One address is voting for pausing the bridge. The current threshold to pause is two.

## Watched changes

```diff
    contract HyperliquidBridge (0x2Df1c51E09aECF9cacB7bc98cB1742757f163dF7) {
    +++ description: Single contract containing all the logic for the Hyperliquid bridge. It manages deposits, withdrawals, the hot and cold validator sets, as well as the lockers, finalizers, and all the permissioned functions.
      values.getLockersVotingLock.0:
+        "0xf9d2282A4A4C216f624717C0747D23146FC048c5"
    }
```

Generated with discovered.json: 0xe44048ba23d38e9d90c743f60f6d91bc9526755c

# Diff at Tue, 24 Dec 2024 20:24:42 GMT:

- author: Luca Donno (<donnoh99@gmail.com>)
- current block number: 287788820

## Description

Initial discovery.

## Initial discovery

```diff
+   Status: CREATED
    contract HyperliquidBridge (0x2Df1c51E09aECF9cacB7bc98cB1742757f163dF7)
    +++ description: Single contract containing all the logic for the Hyperliquid bridge. It manages deposits, withdrawals, the hot and cold validator sets, as well as the lockers, finalizers, and all the permissioned functions.
```
