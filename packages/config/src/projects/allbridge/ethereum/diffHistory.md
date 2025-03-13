Generated with discovered.json: 0xb16dd7ded604b70efa6744181f7d83cbaea4c1aa

# Diff at Tue, 04 Mar 2025 10:38:53 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@98d260b45fe0d2195ce5e629bd7b200c8706e8ba block: 21723681
- current block number: 21723681

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21723681 (main branch discovery), not current.

```diff
    contract GasOracle (0x0BdF6139F2841A7856Ca154D851182C52F5b96e0) {
    +++ description: None
      sinceBlock:
+        17343106
    }
```

```diff
    contract AllbridgeMessenger (0x203e8785b4d4312c4152D0c42Ba3FA8BD79086dA) {
    +++ description: None
      sinceBlock:
+        17343121
    }
```

```diff
    contract OldAllbridgeMessenger (0x366a900eFE79aE7244C4d1d279EE4a702AdBEE50) {
    +++ description: None
      sinceBlock:
+        15493337
    }
```

```diff
    contract LPBridge (0x609c690e8F7D68a59885c9132e812eEbDaAf0c9e) {
    +++ description: None
      sinceBlock:
+        17343135
    }
```

```diff
    contract Pool (0x7DBF07Ad92Ed4e26D5511b4F285508eBF174135D) {
    +++ description: None
      sinceBlock:
+        18120096
    }
```

```diff
    contract WormholeMessenger (0x7f02294f065A605C8D21D9812b8d1De7E5E1da74) {
    +++ description: None
      sinceBlock:
+        17343128
    }
```

```diff
    contract Validator (0x93746538D4519C809827205Bd1C2c7a0E15bd74b) {
    +++ description: None
      sinceBlock:
+        13597354
    }
```

```diff
    contract OldLPBridge (0xA314330482f325D38A83B492EF6B006224a3bea9) {
    +++ description: None
      sinceBlock:
+        15493360
    }
```

```diff
    contract Pool (0xa7062bbA94c91d565Ae33B893Ab5dFAF1Fc57C4d) {
    +++ description: None
      sinceBlock:
+        17343152
    }
```

```diff
    contract FeeOracle (0xba6d8dE08f13A3D22FCEC54752812Dd4dcf2E1f6) {
    +++ description: None
      sinceBlock:
+        13594973
    }
```

```diff
    contract TokenBridge (0xBBbD1BbB4f9b936C3604906D7592A644071dE884) {
    +++ description: None
      sinceBlock:
+        13595007
    }
```

```diff
    contract CctpBridge (0xC51397b75B783E31469bFaADE79913F3f82210d6) {
    +++ description: None
      sinceBlock:
+        19512388
    }
```

```diff
    contract OldWormholeMessenger (0xF4830e4F739c8eB04EFDbf346BAE5c82163da83F) {
    +++ description: None
      sinceBlock:
+        15521726
    }
```

Generated with discovered.json: 0x0816229f2f445302a175f3ff7e6bb6d496fd240a

# Diff at Tue, 28 Jan 2025 14:41:08 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@b60bc0e936cb7b213e24f14ed69abaff22493651 block: 20785156
- current block number: 21723681

## Description

this diff is pretty smol, almost missed it, but discomon misses nothing. allbridge concatenate their supported chainIds abstracted as simple indexes, which makes them uniquely unreadable tbh frfr. But i would interpret this as there was a single new supported chainId added here (index 14 if i can count).

## Watched changes

```diff
    contract AllbridgeMessenger (0x203e8785b4d4312c4152D0c42Ba3FA8BD79086dA) {
    +++ description: None
      values.otherChainIds:
-        "0x0000010101010101010101010000000000000000000000000000000000000000"
+        "0x0000010101010101010101010001000000000000000000000000000000000000"
    }
```

```diff
    contract WormholeMessenger (0x7f02294f065A605C8D21D9812b8d1De7E5E1da74) {
    +++ description: None
      values.otherChainIds:
-        "0x0000010001010100010101010000000000000000000000000000000000000000"
+        "0x0000010001010100010101010001000000000000000000000000000000000000"
    }
```

Generated with discovered.json: 0xf8f46606c276ee98184796e6c21c9fd54a0b14b4

# Diff at Mon, 14 Oct 2024 10:49:06 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@1afc77ff111ceb0970e7d09efcc7b2f376b0c281 block: 20785156
- current block number: 20785156

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20785156 (main branch discovery), not current.

```diff
    contract GasOracle (0x0BdF6139F2841A7856Ca154D851182C52F5b96e0) {
    +++ description: None
      sourceHashes:
+        ["0x61437d07b213292a6639ca58a2549f8fec70a7497940aba88e8d137a2b23e5a1"]
    }
```

```diff
    contract AllbridgeMessenger (0x203e8785b4d4312c4152D0c42Ba3FA8BD79086dA) {
    +++ description: None
      sourceHashes:
+        ["0xb232ad1147747fd0ac80fb67952fcf5297e1a534c2009196849b29ac950afdcf"]
    }
```

```diff
    contract LPBridge (0x609c690e8F7D68a59885c9132e812eEbDaAf0c9e) {
    +++ description: None
      sourceHashes:
+        ["0x814861bc3f9f100efbeb6a574409097f4080e9c4765d678fca86ffa46e453d7f"]
    }
```

```diff
    contract Pool (0x7DBF07Ad92Ed4e26D5511b4F285508eBF174135D) {
    +++ description: None
      sourceHashes:
+        ["0xb2eff5db97a89eb54072562067b928bf496762048db22261130e67145170d1b5"]
    }
```

```diff
    contract WormholeMessenger (0x7f02294f065A605C8D21D9812b8d1De7E5E1da74) {
    +++ description: None
      sourceHashes:
+        ["0xd907a740abab7d5003a704cad4c8273b66cd185386078939c9c8abccec6ec131"]
    }
```

```diff
    contract OldLPBridge (0xA314330482f325D38A83B492EF6B006224a3bea9) {
    +++ description: None
      sourceHashes:
+        ["0x227ed0f9173e33afccdd9e79a6d7d760104d62875552f49b4ef2a9c7c7431ba6"]
    }
```

```diff
    contract Pool (0xa7062bbA94c91d565Ae33B893Ab5dFAF1Fc57C4d) {
    +++ description: None
      sourceHashes:
+        ["0xb2eff5db97a89eb54072562067b928bf496762048db22261130e67145170d1b5"]
    }
```

```diff
    contract TokenBridge (0xBBbD1BbB4f9b936C3604906D7592A644071dE884) {
    +++ description: None
      sourceHashes:
+        ["0x130012988c91475c96e6c32d27893406b8a1837f48f56d47571e53852d863a6d"]
    }
```

```diff
    contract CctpBridge (0xC51397b75B783E31469bFaADE79913F3f82210d6) {
    +++ description: None
      sourceHashes:
+        ["0x2953fb7cbb1c9e0950eac2b3e6206de8087063655779e90a024f7aaf8f31d55c"]
    }
```

Generated with discovered.json: 0x83981df772a4f7cd30366f491f9e3b73ac356007

# Diff at Thu, 19 Sep 2024 14:12:14 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@c189b6a22dcead98913a50430e61a1c3146ee01e block: 20776249
- current block number: 20785156

## Description

The previously added TokenManager is removed.

## Watched changes

```diff
    contract TokenBridge (0xBBbD1BbB4f9b936C3604906D7592A644071dE884) {
    +++ description: None
      values.accessControl.TOKEN_MANAGER.members.1:
-        "0x83f53C078bF81F6d8B79E01e2eD36c473A960c5E"
    }
```

Generated with discovered.json: 0xb421cf837e2d8ea6b08d9c6aaac885d2b809f339

# Diff at Wed, 18 Sep 2024 08:21:21 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@14dc1d5395aaa4aca4e79a08fd6132e42e3cf1a4 block: 20382669
- current block number: 20776249

## Description

One TokenManager is added. (Added to permissions section)

## Watched changes

```diff
    contract TokenBridge (0xBBbD1BbB4f9b936C3604906D7592A644071dE884) {
    +++ description: None
      values.accessControl.TOKEN_MANAGER.members.1:
+        "0x83f53C078bF81F6d8B79E01e2eD36c473A960c5E"
    }
```

Generated with discovered.json: 0x68791e83cbb4b3d36d21874996c7db797997eb61

# Diff at Thu, 25 Jul 2024 09:28:43 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@42efd1ab55ccb369bfc0edad188854abb104aaef block: 19531401
- current block number: 20382669

## Description

This is a small update (token added to the token bridge) but it revealed that Allbridge moved their liquidity network pools to different contracts over a year ago.

### New token added

A second account is granted the admin role. This account in turn temporarily [granted the TOKEN_MANAGER role to another account](https://etherscan.io/tx/0x9cc9764b4d8d857705002c18e26b7d4aae520def2bc182ef9dd336a64455f8ee) and [a new token is added (L2MP)](https://etherscan.io/tx/0x55f2cf6752c40a586d6bc7fbca5ae70a10ad0cd85d72af1237eb33b5353e600d).

The TOKEN_MANAGER is now revoked, the second admin role is not.

### Discovery for the new liquidity network contracts

The admin EOA and the functionality are very similar to the OldLPBridge contract, but so far there are only USDC and USDT supported.

## Watched changes

```diff
    contract AllbridgeMessenger (0x203e8785b4d4312c4152D0c42Ba3FA8BD79086dA) {
    +++ description: None
      values.otherChainIds:
-        "0x0000010101010100010101000000000000000000000000000000000000000000"
+        "0x0000010101010101010101010000000000000000000000000000000000000000"
    }
```

```diff
    contract WormholeMessenger (0x7f02294f065A605C8D21D9812b8d1De7E5E1da74) {
    +++ description: None
      values.otherChainIds:
-        "0x0000010001010100010101000000000000000000000000000000000000000000"
+        "0x0000010001010100010101010000000000000000000000000000000000000000"
    }
```

```diff
    contract TokenBridge (0xBBbD1BbB4f9b936C3604906D7592A644071dE884) {
    +++ description: None
      values.accessControl.DEFAULT_ADMIN_ROLE.members.1:
+        "0xF62e459Aa6a959c4224A7315F85e4703f462918A"
    }
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19531401 (main branch discovery), not current.

```diff
-   Status: DELETED
    contract USDC_POOL (0x1D3df13aDAe6cA91Fb90b977c21d6e90ad8d403C)
    +++ description: None
```

```diff
    contract Allbridge Messenger (0x366a900eFE79aE7244C4d1d279EE4a702AdBEE50) {
    +++ description: None
      name:
-        "Allbridge Messenger"
+        "OldAllbridgeMessenger"
      values.owner:
-        "0x01a494079DCB715f622340301463cE50cd69A4D0"
    }
```

```diff
    contract Validator (0x93746538D4519C809827205Bd1C2c7a0E15bd74b) {
    +++ description: None
      values.owner:
-        "0x4BE5ef97B7cfD37F536324c7F18A2FfdE5892074"
    }
```

```diff
    contract LPBridge (0xA314330482f325D38A83B492EF6B006224a3bea9) {
    +++ description: None
      name:
-        "LPBridge"
+        "OldLPBridge"
      values.DAI_POOL:
-        "0xCe01bc1be28c0784492cB44EbBDa662c3F539172"
      values.USDC_POOL:
-        "0x1D3df13aDAe6cA91Fb90b977c21d6e90ad8d403C"
      values.USDT_POOL:
-        "0xB827b15adA62D78F5cb90243bc4755cf4B9d1B0e"
    }
```

```diff
-   Status: DELETED
    contract USDT_POOL (0xB827b15adA62D78F5cb90243bc4755cf4B9d1B0e)
    +++ description: None
```

```diff
    contract Fee Oracle (0xba6d8dE08f13A3D22FCEC54752812Dd4dcf2E1f6) {
    +++ description: None
      name:
-        "Fee Oracle"
+        "FeeOracle"
    }
```

```diff
-   Status: DELETED
    contract DAI_POOL (0xCe01bc1be28c0784492cB44EbBDa662c3F539172)
    +++ description: None
```

```diff
    contract Wormhole Messenger (0xF4830e4F739c8eB04EFDbf346BAE5c82163da83F) {
    +++ description: None
      name:
-        "Wormhole Messenger"
+        "OldWormholeMessenger"
      values.owner:
-        "0x01a494079DCB715f622340301463cE50cd69A4D0"
    }
```

```diff
+   Status: CREATED
    contract GasOracle (0x0BdF6139F2841A7856Ca154D851182C52F5b96e0)
    +++ description: None
```

```diff
+   Status: CREATED
    contract AllbridgeMessenger (0x203e8785b4d4312c4152D0c42Ba3FA8BD79086dA)
    +++ description: None
```

```diff
+   Status: CREATED
    contract LPBridge (0x609c690e8F7D68a59885c9132e812eEbDaAf0c9e)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Pool (0x7DBF07Ad92Ed4e26D5511b4F285508eBF174135D)
    +++ description: None
```

```diff
+   Status: CREATED
    contract WormholeMessenger (0x7f02294f065A605C8D21D9812b8d1De7E5E1da74)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Pool (0xa7062bbA94c91d565Ae33B893Ab5dFAF1Fc57C4d)
    +++ description: None
```

```diff
+   Status: CREATED
    contract CctpBridge (0xC51397b75B783E31469bFaADE79913F3f82210d6)
    +++ description: None
```

Generated with discovered.json: 0xd2ce21e3347036c786219f45fd9644a4666ffd44

