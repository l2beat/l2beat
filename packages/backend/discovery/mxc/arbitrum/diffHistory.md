Generated with discovered.json: 0xe4981e75447921d47fc710924ce66b51ff01ad1e

# Diff at Fri, 12 Jul 2024 11:08:16 GMT:

- author: sekuba (<sekuba@users.noreply.github.com>)
- comparing to: main@7a68cbd10d944bed044cb2fbdb36edb934444874 block: 218960264
- current block number: 231407345

## Description

Contracts are now verified --> `isUnderReview: true`.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 218960264 (main branch discovery), not current.

```diff
    contract MxcL1Contract? (0x54D8864e8855A7B66eE42B8F2Eaa0F2E06bd641a) {
    +++ description: None
      unverified:
-        true
      values.addressManager:
+        "0x931A8fFCcdA64dC441bcca81Bd65Dc0C3d42Af74"
      values.owner:
+        "0xC6D7522f7B012b22Bc365C9C43b3DBf13B9aAfF9"
    }
```

```diff
    contract Bridge? (0xA9c5519a7c1d85fB6d6695853787964a0D3d49A6) {
    +++ description: None
      unverified:
-        true
      values.addressManager:
+        "0x931A8fFCcdA64dC441bcca81Bd65Dc0C3d42Af74"
      values.owner:
+        "0xC6D7522f7B012b22Bc365C9C43b3DBf13B9aAfF9"
    }
```

Generated with discovered.json: 0xdba659a41615fb784ca6e5024cefa6dfc6c7a31c

# Diff at Thu, 06 Jun 2024 09:21:29 GMT:

- author: sekuba (<sekuba@users.noreply.github.com>)
- current block number: 218960264

## Description

Initial discovery: Taiko fork on arbitrum with unverified rollup contracts.

## Initial discovery

```diff
+   Status: CREATED
    contract MxcL1Contract? (0x54D8864e8855A7B66eE42B8F2Eaa0F2E06bd641a)
    +++ description: None
```

```diff
+   Status: CREATED
    contract AddressManager? (0x931A8fFCcdA64dC441bcca81Bd65Dc0C3d42Af74)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Bridge? (0xA9c5519a7c1d85fB6d6695853787964a0D3d49A6)
    +++ description: None
```

```diff
+   Status: CREATED
    contract SignalService (0xB612eb073ebc8638b8E445D7F15f02400e1d99d8)
    +++ description: None
```

```diff
+   Status: CREATED
    contract TokenVault? (0xC31a6C0C1087BBB6E6660F27014aD1321591c641)
    +++ description: None
```
