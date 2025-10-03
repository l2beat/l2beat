Generated with discovered.json: 0x6e55f86f2d1eb84c058cc6d87d9ab26d6e6acf16

# Diff at Fri, 03 Oct 2025 06:05:50 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- current timestamp: 1759468227

## Description

Discovery rerun on the same block number with only config-related changes.

## Initial discovery

```diff
+   Status: CREATED
    contract AdditionalZkLighter (eth:0x05555f726ebC8737dc4E7F65B8d15708cC2785aa)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ZkLighter (eth:0x3B4D794a66304F130a4Db8F2551B0070dfCf5ca7)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Lighter Multisig (eth:0x92b12c9d85BF7bd2EF5d2F53F4cd4Ce0BE432045)
    +++ description: None
```

```diff
+   Status: CREATED
    contract UpgradeGatekeeper (eth:0x94da8A995D0D82Ef0fE7E509C6D76c22603B6f67)
    +++ description: Governance contract functioning like an upgrade timelock for downstream contracts. The current delay is 21d and can be entirely skipped by eth:0x92b12c9d85BF7bd2EF5d2F53F4cd4Ce0BE432045.
```

```diff
+   Status: CREATED
    contract Governance (eth:0xa464DA0B43f80EE3FfC4795cbbFC78472b5c81A1)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ZkLighterVerifier (eth:0xac3Ce44B6ff4E402858C99D5699ff63131572BaA)
    +++ description: None
```
