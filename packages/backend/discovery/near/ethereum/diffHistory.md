Generated with discovered.json: 0x2705c0ce0cbc283fc9c584fcdfef5a9f22bdb752

# Diff at Thu, 28 Mar 2024 10:23:24 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@dd32bb06b292cc8459fb09925454ee3a90f5c27e block: 19233286
- current block number: 19531990

## Description

Update discovery to include the multisig threshold.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19233286 (main branch discovery), not current.

```diff
    contract BridgeAdminMultisig (0x2468603819Bf09Ed3Fb6f3EFeff24B1955f3CDE1) {
    +++ description: None
      upgradeability.threshold:
+        "3 of 5 (60%)"
    }
```

Generated with discovered.json: 0xabe7c526f112e7c35d9d3809029eda70c54e600f

# Diff at Thu, 15 Feb 2024 12:19:54 GMT:

- author: vincfurc (<10850139+vincfurc@users.noreply.github.com>)
- current block number: 19233286

## Description

Added Discovery integration to the Near Rainbow Bridge.

## Initial discovery

```diff
+   Status: CREATED
    contract NearProver (0x051AD3F020274910065Dcb421629cd2e6E5b46c4) {
    }
```

```diff
+   Status: CREATED
    contract ERC20Locker (0x23Ddd3e3692d1861Ed57EDE224608875809e127f) {
    }
```

```diff
+   Status: CREATED
    contract BridgeAdminMultisig (0x2468603819Bf09Ed3Fb6f3EFeff24B1955f3CDE1) {
    }
```

```diff
+   Status: CREATED
    contract NearBridge (0x3FEFc5A4B1c02f21cBc8D3613643ba0635b9a873) {
    }
```

```diff
+   Status: CREATED
    contract EthCustodian (0x6BFaD42cFC4EfC96f529D786D643Ff4A8B89FA52) {
    }
```
