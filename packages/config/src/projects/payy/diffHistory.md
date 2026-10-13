Generated with discovered.json: 0x95f61b812ef28a27eecb56a79d704c9715bf250d

# Diff at Tue, 13 Oct 2026 13:11:02 GMT:

- id: f0bef495
- author: Sergey Shemyakov (<sergey.shemyakov@l2beat.com>)
- comparing to: main@f86fa8ee6214e9cba302685affb910adddc04f2d block: 1787654846
- current timestamp: 1791896999

## Description

New 7702-delegation for on the Payy ms members.

## Watched changes

```diff
    EOA (eth:0x111e5feA3D613EB866fd41B30c8257C930180428) {
    +++ description: None
      proxyType:
-        "EOA"
+        "EIP7702 EOA"
      sourceHashes:
+        ["0x1f44812af62d28f019e30e8eb2af596fb36c7db9d34576972c0405e110a6ef45"]
      values:
+        {"$implementation":"eth:0x63c0c19a282a1B52b07dD5a65b58948A07DAE32B","delegationManager":"eth:0xdb9B1e94B5b69Df7e401DDbedE43491141047dB3","DOMAIN_VERSION":"1","eip712Domain":{"fields":"0x0f","name":"EIP7702StatelessDeleGator","version":"1","chainId":1,"verifyingContract":"eth:0x111e5feA3D613EB866fd41B30c8257C930180428","salt":"0x0000000000000000000000000000000000000000000000000000000000000000","extensions":[]},"entryPoint":"eth:0x0000000071727De22E5E9d8BAf0edAc6f37da032","getDeposit":0,"getDomainHash":"0xa74a149b2a448a709aeba5259239a6059bde080dcb5769af7fdbd3c537d44b57","getNonce":0,"NAME":"EIP7702StatelessDeleGator","PACKED_USER_OP_TYPEHASH":"0xbc37962d8bd1d319c95199bdfda6d3f92baa8903a61b32d5f4ec1f4b36a3bc18","VERSION":"1.3.0"}
    }
```

Generated with discovered.json: 0xa517e69166999dd8255f2dedd56d70bf971b7f9f

# Diff at Wed, 23 Sep 2026 05:48:17 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@2e9174e8edc4a3b646f958a1d6e0d4360abec40d block: 1787654846
- current timestamp: 1787654846

## Description

Refresh config-derived discovery metadata at the main-branch block.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 1787654846 (main branch discovery), not current.

```diff
    contract ProxyAdmin (eth:0xfE455baCAF1968F1Ae6a322b8Ffbe56840e2f590) [global/ProxyAdmin] {
    +++ description: None
      fieldMeta:
-        {"addressManager":{"severity":"HIGH"},"owner":{"severity":"HIGH"}}
    }
```

Generated with discovered.json: 0xf1e3bab55983284976886d91d5ac3d995392c1d8

# Diff at Mon, 21 Sep 2026 11:24:04 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@231e4a5828ee5ff5a863f7b80215466ca39a5b1e block: 1787654846
- current timestamp: 1787654846

## Description

ossification re-review: field severities

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 1787654846 (main branch discovery), not current.

```diff
    contract ProxyAdmin (eth:0xfE455baCAF1968F1Ae6a322b8Ffbe56840e2f590) [global/ProxyAdmin] {
    +++ description: None
      fieldMeta.addressManager:
+        {"severity":"HIGH"}
    }
```

Generated with discovered.json: 0x2bc6a47d2652e478020ce5b808d914329018ec73

# Diff at Fri, 18 Sep 2026 10:24:51 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@e2faf827d006bceee5fb0904599ba325066c7674 block: 1787654846
- current timestamp: 1787654846

## Description

critical contracts and severities for the ossification perimeter

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 1787654846 (main branch discovery), not current.

```diff
    contract ProxyAdmin (eth:0xfE455baCAF1968F1Ae6a322b8Ffbe56840e2f590) [global/ProxyAdmin] {
    +++ description: None
      fieldMeta:
+        {"owner":{"severity":"HIGH"}}
    }
```

Generated with discovered.json: 0x4e439384e2252dc8570a3234f95966c4538f2880

# Diff at Tue, 25 Aug 2026 13:41:12 GMT:

- author: Sergey Shemyakov (<sergey.shemyakov@l2beat.de>)
- current timestamp: 1787654846

## Description

Discovery rerun on the same block number with only config-related changes.

## Initial discovery

```diff
+   Status: CREATED
    contract HonkVerifier (eth:0x14DACD534ddc676601B27f41Eb541a7951524a2F) [payy/HonkVerifier]
    +++ description: UltraHonk proof verifier generated with Aztec's Barretenberg from Payy's final aggregation Noir circuit. It verifies the aggregated validity proof of each state update submitted to the Rollup contract.
```

```diff
+   Status: CREATED
    contract PayyMultisig (eth:0x230Dfb03F078B0d5E705F4624fCC915f3126B40f) [GnosisSafe]
    +++ description: None
```

```diff
+   Status: CREATED
    contract RollupV1 (eth:0x367C1eAF14AA06b78ce76bd0243297de79d85270) [payy/Rollup]
    +++ description: Main contract of the Payy ZK rollup. It stores the state root, escrows USDC backing the notes on the rollup, processes deposits (mints) and withdrawals (burns), and accepts state updates that must include an aggregated ZK proof and signatures from more than 2/3 of the current validator set.
```

```diff
+   Status: CREATED
    contract ProxyAdmin (eth:0xfE455baCAF1968F1Ae6a322b8Ffbe56840e2f590) [global/ProxyAdmin]
    +++ description: None
```
