Generated with discovered.json: 0xac901111ad13f517a437249f2ffb49bb60bfe895

# Diff at Wed, 14 Jan 2026 06:40:11 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@109a5d8ec861590e65983ea0257074c65c29ed21 block: 1762265442
- current timestamp: 1768372744

## Description

MANAGER address removed.

## Watched changes

```diff
    contract Administrator (eth:0x10472f91f67C49260BDD65F016ea0757bb1Fc91e) {
    +++ description: None
      values.accessControl.MANAGER.members.0:
-        "eth:0x944416e5dF03eE4c14EC44C01495005564e6b07E"
    }
```

Generated with discovered.json: 0xf25eeafae2c35a605ddcf3f66b439034b7fd0a27

# Diff at Wed, 05 Nov 2025 12:48:34 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@bc0ecd2e43db8badee0981759f26dbc0b38299e3 block: 1762265442
- current timestamp: 1762265442

## Description

Libraries are opt-in

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 1762265442 (main branch discovery), not current.

```diff
-   Status: DELETED
    contract SignatureChecker (eth:0x800C32EaA2a6c93cF4CB51794450ED77fBfbB172)
    +++ description: None
```

```diff
    contract USD Coin Token (eth:0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48) {
    +++ description: None
      values.$libraries:
-        ["eth:0x800C32EaA2a6c93cF4CB51794450ED77fBfbB172"]
    }
```

Generated with discovered.json: 0x2ad368eb3dda978605c77c2f6ed4a2423fd495aa

# Diff at Tue, 04 Nov 2025 14:12:05 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@f12d06bbf120eab9f5356a235918d4d6b2484290 block: 1759764158
- current timestamp: 1762265442

## Description

7702 delegation.

## Watched changes

```diff
    EOA  (eth:0x944416e5dF03eE4c14EC44C01495005564e6b07E) {
    +++ description: None
      proxyType:
-        "EOA"
+        "EIP7702 EOA"
      sourceHashes:
+        ["0x41c6ce964a4ef3e910f9ddf78152734dae8d1b1094ffc8334c50249a3b112bbf"]
      values:
+        {"$implementation":"eth:0x63c0c19a282a1B52b07dD5a65b58948A07DAE32B","delegationManager":"eth:0xdb9B1e94B5b69Df7e401DDbedE43491141047dB3","DOMAIN_VERSION":"1","eip712Domain":{"fields":"0x0f","name":"EIP7702StatelessDeleGator","version":"1","chainId":1,"verifyingContract":"eth:0x944416e5dF03eE4c14EC44C01495005564e6b07E","salt":"0x0000000000000000000000000000000000000000000000000000000000000000","extensions":[]},"entryPoint":"eth:0x0000000071727De22E5E9d8BAf0edAc6f37da032","getDeposit":0,"getDomainHash":"0x89fd3be3b004d9bc48f6fed0888e8a5e57ce1c5273a13b213582aab85d21b7c5","getNonce":0,"NAME":"EIP7702StatelessDeleGator","PACKED_USER_OP_TYPEHASH":"0xbc37962d8bd1d319c95199bdfda6d3f92baa8903a61b32d5f4ec1f4b36a3bc18","VERSION":"1.3.0"}
    }
```

Generated with discovered.json: 0xa845b6aef8689eff3fe49f9195d3a9d5c7fe9387

# Diff at Tue, 04 Nov 2025 11:35:08 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@9ff7b62a511791b99f61b604fb6b56e4ea223bb0 block: 1759764158
- current timestamp: 1759764158

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 1759764158 (main branch discovery), not current.

```diff
    contract USD Coin Token (eth:0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48) {
    +++ description: None
      values.$libraries:
+        ["eth:0x800C32EaA2a6c93cF4CB51794450ED77fBfbB172"]
    }
```

```diff
+   Status: CREATED
    contract SignatureChecker (eth:0x800C32EaA2a6c93cF4CB51794450ED77fBfbB172)
    +++ description: None
```

Generated with discovered.json: 0xbb4437c4fda5f58ac2d9c20a0d8b2d858f66fc2a

# Diff at Mon, 06 Oct 2025 15:28:03 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@e58bd9f0913161b35e2a2c65f233464591d4f28b block: 1755603175
- current timestamp: 1759764158

## Description

Some oracle data changed, cleaned up config, new permissioned address.

## Watched changes

```diff
    contract Administrator (eth:0x10472f91f67C49260BDD65F016ea0757bb1Fc91e) {
    +++ description: None
      values.accessControl.YIELD.members.0:
+        "eth:0x944416e5dF03eE4c14EC44C01495005564e6b07E"
    }
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 1755603175 (main branch discovery), not current.

```diff
    contract RequestReceipt (eth:0x933B4464beBE7136bC184637792c0EE514057660) {
    +++ description: None
      values.tokenByIndex:
-        [7,106,586,1213]
    }
```

Generated with discovered.json: 0x08af2d0591e93d5f1dccf2f3f1a9bfc795beeee5

# Diff at Mon, 01 Sep 2025 10:01:10 GMT:

Merge mark

Generated with discovered.json: 0x0fac91d351eb6c7f652e8749009a3ad7a858cab7

# Diff at Tue, 26 Aug 2025 12:43:01 GMT:

- chain: ethereum
- author: Michał Podsiadły (<michal.podsiadly@l2beat.com>)
- current timestamp: 1755603175

## Description

Initial discovery.

## Initial discovery

```diff
+   Status: CREATED
    contract Manager (0x03ACc35286bAAE6D73d99a9f14Ef13752208C8dC)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Administrator (0x10472f91f67C49260BDD65F016ea0757bb1Fc91e)
    +++ description: None
```

```diff
+   Status: CREATED
    contract yUSD (0x19Ebd191f7A24ECE672ba13A302212b5eF7F35cb)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ProxyAdmin (0x25249946D42a5fba2b6b1d191127BCaEc70bD103)
    +++ description: None
```

```diff
+   Status: CREATED
    contract vyUSD (0x2e3C5e514EEf46727DE1FE44618027A9b70D92FC)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Yield (0x392017161a9507F19644E8886A237C58809212B5)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ProxyAdmin (0x3C6ECDcdAc78B65BDD85985285C1A1d140A79a63)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ProxyAdmin (0x6569089dd56A140777014d27B6113d96f3544f71)
    +++ description: None
```

```diff
+   Status: CREATED
    contract YieldFiTimelockController (0x8E31eFdA4453494a84Fa6168D53Eb1418c0b4aC4)
    +++ description: None
```

```diff
+   Status: CREATED
    contract RequestReceipt (0x933B4464beBE7136bC184637792c0EE514057660)
    +++ description: None
```

```diff
+   Status: CREATED
    contract USD Coin Token (0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ProxyAdmin (0xc79920D40206cc28f7B70E72d623Ff7fB83004C1)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ProxyAdmin (0xCfD925b89D4ccfee2eC9287b362648854aCbBF03)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ProxyAdmin (0xE26E1D2ae51dcB89E382CA7400b080e6632117B9)
    +++ description: None
```

