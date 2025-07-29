Generated with discovered.json: 0x4fb12bf30aff71a09b6848963a04d1482d0cbb69

# Diff at Mon, 14 Jul 2025 12:45:27 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@9f4300dad2f3d080cd56fa311d4a848556c74e72 block: 22423754
- current block number: 22423754

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22423754 (main branch discovery), not current.

```diff
    contract NearProver (0x051AD3F020274910065Dcb421629cd2e6E5b46c4) {
    +++ description: None
      address:
-        "0x051AD3F020274910065Dcb421629cd2e6E5b46c4"
+        "eth:0x051AD3F020274910065Dcb421629cd2e6E5b46c4"
      values.admin:
-        "0x2468603819Bf09Ed3Fb6f3EFeff24B1955f3CDE1"
+        "eth:0x2468603819Bf09Ed3Fb6f3EFeff24B1955f3CDE1"
      values.bridge:
-        "0x3FEFc5A4B1c02f21cBc8D3613643ba0635b9a873"
+        "eth:0x3FEFc5A4B1c02f21cBc8D3613643ba0635b9a873"
      implementationNames.0x051AD3F020274910065Dcb421629cd2e6E5b46c4:
-        "NearProver"
      implementationNames.eth:0x051AD3F020274910065Dcb421629cd2e6E5b46c4:
+        "NearProver"
    }
```

```diff
    EOA  (0x1180c536465413eE05b206b3a99d4C6a9934D2b7) {
    +++ description: None
      address:
-        "0x1180c536465413eE05b206b3a99d4C6a9934D2b7"
+        "eth:0x1180c536465413eE05b206b3a99d4C6a9934D2b7"
    }
```

```diff
    contract ERC20Locker (0x23Ddd3e3692d1861Ed57EDE224608875809e127f) {
    +++ description: None
      address:
-        "0x23Ddd3e3692d1861Ed57EDE224608875809e127f"
+        "eth:0x23Ddd3e3692d1861Ed57EDE224608875809e127f"
      values.admin:
-        "0x2468603819Bf09Ed3Fb6f3EFeff24B1955f3CDE1"
+        "eth:0x2468603819Bf09Ed3Fb6f3EFeff24B1955f3CDE1"
      values.prover_:
-        "0x051AD3F020274910065Dcb421629cd2e6E5b46c4"
+        "eth:0x051AD3F020274910065Dcb421629cd2e6E5b46c4"
      implementationNames.0x23Ddd3e3692d1861Ed57EDE224608875809e127f:
-        "ERC20Locker"
      implementationNames.eth:0x23Ddd3e3692d1861Ed57EDE224608875809e127f:
+        "ERC20Locker"
    }
```

```diff
    contract BridgeAdminMultisig (0x2468603819Bf09Ed3Fb6f3EFeff24B1955f3CDE1) {
    +++ description: None
      address:
-        "0x2468603819Bf09Ed3Fb6f3EFeff24B1955f3CDE1"
+        "eth:0x2468603819Bf09Ed3Fb6f3EFeff24B1955f3CDE1"
      values.$implementation:
-        "0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552"
+        "eth:0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552"
      values.$members.0:
-        "0xed9cB50304991951Cbee747900484E9a041DA464"
+        "eth:0xed9cB50304991951Cbee747900484E9a041DA464"
      values.$members.1:
-        "0xF58096A602C960c841Bd83A29DE21c808a9c1ac9"
+        "eth:0xF58096A602C960c841Bd83A29DE21c808a9c1ac9"
      values.$members.2:
-        "0xCFB9C137E21E199757Ae3Ce705B199CB26A3b91d"
+        "eth:0xCFB9C137E21E199757Ae3Ce705B199CB26A3b91d"
      values.$members.3:
-        "0x1180c536465413eE05b206b3a99d4C6a9934D2b7"
+        "eth:0x1180c536465413eE05b206b3a99d4C6a9934D2b7"
      values.$members.4:
-        "0x8F3A347Eb3eB62fEa4975d293e052cD96abd36C6"
+        "eth:0x8F3A347Eb3eB62fEa4975d293e052cD96abd36C6"
      implementationNames.0x2468603819Bf09Ed3Fb6f3EFeff24B1955f3CDE1:
-        "Proxy"
      implementationNames.0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552:
-        "GnosisSafe"
      implementationNames.eth:0x2468603819Bf09Ed3Fb6f3EFeff24B1955f3CDE1:
+        "Proxy"
      implementationNames.eth:0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552:
+        "GnosisSafe"
    }
```

```diff
    contract NearBridge (0x3FEFc5A4B1c02f21cBc8D3613643ba0635b9a873) {
    +++ description: None
      address:
-        "0x3FEFc5A4B1c02f21cBc8D3613643ba0635b9a873"
+        "eth:0x3FEFc5A4B1c02f21cBc8D3613643ba0635b9a873"
      values.admin:
-        "0x2468603819Bf09Ed3Fb6f3EFeff24B1955f3CDE1"
+        "eth:0x2468603819Bf09Ed3Fb6f3EFeff24B1955f3CDE1"
      implementationNames.0x3FEFc5A4B1c02f21cBc8D3613643ba0635b9a873:
-        "NearBridge"
      implementationNames.eth:0x3FEFc5A4B1c02f21cBc8D3613643ba0635b9a873:
+        "NearBridge"
    }
```

```diff
    contract EthCustodian (0x6BFaD42cFC4EfC96f529D786D643Ff4A8B89FA52) {
    +++ description: None
      address:
-        "0x6BFaD42cFC4EfC96f529D786D643Ff4A8B89FA52"
+        "eth:0x6BFaD42cFC4EfC96f529D786D643Ff4A8B89FA52"
      values.admin:
-        "0x2468603819Bf09Ed3Fb6f3EFeff24B1955f3CDE1"
+        "eth:0x2468603819Bf09Ed3Fb6f3EFeff24B1955f3CDE1"
      values.prover_:
-        "0x051AD3F020274910065Dcb421629cd2e6E5b46c4"
+        "eth:0x051AD3F020274910065Dcb421629cd2e6E5b46c4"
      implementationNames.0x6BFaD42cFC4EfC96f529D786D643Ff4A8B89FA52:
-        "EthCustodian"
      implementationNames.eth:0x6BFaD42cFC4EfC96f529D786D643Ff4A8B89FA52:
+        "EthCustodian"
    }
```

```diff
    EOA  (0x8F3A347Eb3eB62fEa4975d293e052cD96abd36C6) {
    +++ description: None
      address:
-        "0x8F3A347Eb3eB62fEa4975d293e052cD96abd36C6"
+        "eth:0x8F3A347Eb3eB62fEa4975d293e052cD96abd36C6"
    }
```

```diff
    EOA  (0xCFB9C137E21E199757Ae3Ce705B199CB26A3b91d) {
    +++ description: None
      address:
-        "0xCFB9C137E21E199757Ae3Ce705B199CB26A3b91d"
+        "eth:0xCFB9C137E21E199757Ae3Ce705B199CB26A3b91d"
    }
```

```diff
    EOA  (0xed9cB50304991951Cbee747900484E9a041DA464) {
    +++ description: None
      address:
-        "0xed9cB50304991951Cbee747900484E9a041DA464"
+        "eth:0xed9cB50304991951Cbee747900484E9a041DA464"
    }
```

```diff
    EOA  (0xF58096A602C960c841Bd83A29DE21c808a9c1ac9) {
    +++ description: None
      address:
-        "0xF58096A602C960c841Bd83A29DE21c808a9c1ac9"
+        "eth:0xF58096A602C960c841Bd83A29DE21c808a9c1ac9"
    }
```

```diff
+   Status: CREATED
    contract NearProver (0x051AD3F020274910065Dcb421629cd2e6E5b46c4)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ERC20Locker (0x23Ddd3e3692d1861Ed57EDE224608875809e127f)
    +++ description: None
```

```diff
+   Status: CREATED
    contract BridgeAdminMultisig (0x2468603819Bf09Ed3Fb6f3EFeff24B1955f3CDE1)
    +++ description: None
```

```diff
+   Status: CREATED
    contract NearBridge (0x3FEFc5A4B1c02f21cBc8D3613643ba0635b9a873)
    +++ description: None
```

```diff
+   Status: CREATED
    contract EthCustodian (0x6BFaD42cFC4EfC96f529D786D643Ff4A8B89FA52)
    +++ description: None
```

Generated with discovered.json: 0xa979a7c4c6a6787c854deee099c4fafdb0198089

# Diff at Tue, 06 May 2025 09:24:59 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@797a9ec756b28fc8b608c3143fbee4e577108cbc block: 22230519
- current block number: 22423754

## Description

Paused, migration finished (project archived).

## Watched changes

```diff
    contract NearBridge (0x3FEFc5A4B1c02f21cBc8D3613643ba0635b9a873) {
    +++ description: None
      values.paused:
-        0
+        13
    }
```

Generated with discovered.json: 0x2f595956594034c88b077fa65e16867f3f9ad503

# Diff at Wed, 09 Apr 2025 09:41:49 GMT:

- author: Luca Donno (<donnoh99@gmail.com>)
- comparing to: main@b04ae40394d41744c67519d82fd543837c6ad4a0 block: 19531990
- current block number: 22230519

## Description

- deposits are paused, withdrawals are not
- `adminSendEth()` [called](https://app.blocksec.com/explorer/tx/eth/0xa86a0cf177d232e578b806dde6871f331d1f6650f8f02ecaab5645f7202e2242) on the ETH escrow
- `adminTransfer()` (in a multicall) [called](https://etherscan.io/tx/0xc0a56a969a75127b0ec174a2e313c281d5990644f9e170218768ef7b1c2a85fa) on the ERC20 escrow
- funds are now [here](https://etherscan.io/address/0xe00c629afaccb0510995a2b95560e446a24c85b9)
- [here](https://x.com/NEARProtocol/status/1908247501032824914) is the announcement of migration from rainbow bridge to "omnibridge" 

## Watched changes

```diff
    contract ERC20Locker (0x23Ddd3e3692d1861Ed57EDE224608875809e127f) {
    +++ description: None
      values.paused:
-        0
+        1
    }
```

```diff
    contract EthCustodian (0x6BFaD42cFC4EfC96f529D786D643Ff4A8B89FA52) {
    +++ description: None
      values.paused:
-        0
+        3
    }
```

Generated with discovered.json: 0x0a49f33417609c85252f2137d340cfd732de6391

# Diff at Tue, 04 Mar 2025 10:39:28 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@98d260b45fe0d2195ce5e629bd7b200c8706e8ba block: 19531990
- current block number: 19531990

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19531990 (main branch discovery), not current.

```diff
    contract NearProver (0x051AD3F020274910065Dcb421629cd2e6E5b46c4) {
    +++ description: None
      sinceBlock:
+        12040114
    }
```

```diff
    contract ERC20Locker (0x23Ddd3e3692d1861Ed57EDE224608875809e127f) {
    +++ description: None
      sinceBlock:
+        12044301
    }
```

```diff
    contract BridgeAdminMultisig (0x2468603819Bf09Ed3Fb6f3EFeff24B1955f3CDE1) {
    +++ description: None
      sinceBlock:
+        13896975
    }
```

```diff
    contract NearBridge (0x3FEFc5A4B1c02f21cBc8D3613643ba0635b9a873) {
    +++ description: None
      sinceBlock:
+        15617816
    }
```

```diff
    contract EthCustodian (0x6BFaD42cFC4EfC96f529D786D643Ff4A8B89FA52) {
    +++ description: None
      sinceBlock:
+        12702964
    }
```

Generated with discovered.json: 0x091a0dee529ef8aad47f7d8fe1cf041a9efce9fa

# Diff at Mon, 14 Oct 2024 10:53:12 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@1afc77ff111ceb0970e7d09efcc7b2f376b0c281 block: 19531990
- current block number: 19531990

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19531990 (main branch discovery), not current.

```diff
    contract NearProver (0x051AD3F020274910065Dcb421629cd2e6E5b46c4) {
    +++ description: None
      sourceHashes:
+        ["0xcd16841a968d4ea28094de73ada515cdb0661691dec1b02c5c9e86a08bcc5d06"]
    }
```

```diff
    contract ERC20Locker (0x23Ddd3e3692d1861Ed57EDE224608875809e127f) {
    +++ description: None
      sourceHashes:
+        ["0x74501db8a51bd105da4453dc8907e59a99756bc2651ce3a861485f0ffe7cf724"]
    }
```

```diff
    contract BridgeAdminMultisig (0x2468603819Bf09Ed3Fb6f3EFeff24B1955f3CDE1) {
    +++ description: None
      sourceHashes:
+        ["0xd5a33441170541b7df25812e0e3dff6562b2f09ab835a6b431cb9e7198a47605","0xd42bbf9f7dcd3720a7fc6bdc6edfdfae8800a37d6dd4decfa0ef6ca4a2e88940"]
    }
```

```diff
    contract NearBridge (0x3FEFc5A4B1c02f21cBc8D3613643ba0635b9a873) {
    +++ description: None
      sourceHashes:
+        ["0x52e85c821a158edace9ff11f0bda7524bc7bee826844981293fd48259887aaf1"]
    }
```

```diff
    contract EthCustodian (0x6BFaD42cFC4EfC96f529D786D643Ff4A8B89FA52) {
    +++ description: None
      sourceHashes:
+        ["0x38ac1699854c55e7085ee14f17acf067140394f315915c61dbb7aed0ff7bce59"]
    }
```

Generated with discovered.json: 0x360ebcabc3aa641d59211739fef063326a7c5bd4

# Diff at Fri, 09 Aug 2024 10:10:44 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@1f0da1d0aab7bc6b3b5e54e7e93480bd98e57035 block: 19531990
- current block number: 19531990

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19531990 (main branch discovery), not current.

```diff
    contract BridgeAdminMultisig (0x2468603819Bf09Ed3Fb6f3EFeff24B1955f3CDE1) {
    +++ description: None
      values.$multisigThreshold:
-        "3 of 5 (60%)"
      values.getOwners:
-        ["0xed9cB50304991951Cbee747900484E9a041DA464","0xF58096A602C960c841Bd83A29DE21c808a9c1ac9","0xCFB9C137E21E199757Ae3Ce705B199CB26A3b91d","0x1180c536465413eE05b206b3a99d4C6a9934D2b7","0x8F3A347Eb3eB62fEa4975d293e052cD96abd36C6"]
      values.getThreshold:
-        3
      values.$members:
+        ["0xed9cB50304991951Cbee747900484E9a041DA464","0xF58096A602C960c841Bd83A29DE21c808a9c1ac9","0xCFB9C137E21E199757Ae3Ce705B199CB26A3b91d","0x1180c536465413eE05b206b3a99d4C6a9934D2b7","0x8F3A347Eb3eB62fEa4975d293e052cD96abd36C6"]
      values.$threshold:
+        3
      values.multisigThreshold:
+        "3 of 5 (60%)"
    }
```

Generated with discovered.json: 0x33d977f13e815c884a1acc91e89d4d8c81a62faa

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
