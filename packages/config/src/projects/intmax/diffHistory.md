Generated with discovered.json: 0x9cb15096d408e317666645a07de63de38e3bb9a4

# Diff at Tue, 10 Feb 2026 12:15:54 GMT:

- author: Sergey Shemyakov (<sergey.shemyakov@l2beat.com>)
- comparing to: main@a071ede88cd58345921a58b8c0087cb337d915e6 block: 1768216753
- current timestamp: 1770724065

## Description

Paused the operation of Intmax L3. In particular:

- Added functionality to pause withdrawals for the main contract on Ethereum: https://disco.l2beat.com/diff/eth:0xD31F61281A4b262aEa79cbBE09A436975a8b63EA/eth:0xd12FF9c1542F0826DB4c7cAe8BcC4fbeF3d3B6c9. 
- Also added functionality to puase block posting on the rollup contract on scroll: https://disco.l2beat.com/diff/scr:0xF34299210fB8505232649e9BEa14a84DD75e746b/scr:0xeAc5302f9AA81B38867Ef4Fd37D4e480C0bb8820. 
- Updated circuitDigest on withdrawal contract, which prevents submission of withdrawal validity proofs.

- Paused Liquidity contract (no deposits/withdrawals possible now)
- Paused Rollup contract (no blocks could be posted)

## Watched changes

```diff
    contract Liquidity (eth:0xF65e73aAc9182e353600a916a6c7681F810f79C3) {
    +++ description: Entry point of the project. Handles deposits, withdrawals, and the communication from and to the main rollup contract on Scroll. Deposits are gated by an AML check.
      sourceHashes.1:
-        "0xe050f1745884847699cff3db5506410a82629972bb6fd8a52199442b01351485"
+        "0xf23a0f0c4af93cdcb226ce3de63c8ed56ce4267448a659414e5a459b4e5b94db"
      values.$implementation:
-        "eth:0xD31F61281A4b262aEa79cbBE09A436975a8b63EA"
+        "eth:0xd12FF9c1542F0826DB4c7cAe8BcC4fbeF3d3B6c9"
      values.$pastUpgrades.3:
+        ["2026-02-07T14:29:35.000Z","0x95073b3d48f892101baf0c2e857a0b0b8f72dd6ae5fdfecd49c0814dfec4cd69",["eth:0xd12FF9c1542F0826DB4c7cAe8BcC4fbeF3d3B6c9"]]
      values.$upgradeCount:
-        3
+        4
      values.accessControl.WITHDRAWAL.members.0:
-        "eth:0x86B06D2604D9A6f9760E8f691F86d5B2a7C9c449"
      values.accessControl.WITHDRAWAL.members.1:
-        "eth:0x22ac649b3229eC099C32D790e9e46FbA2CE6C9A5"
      values.paused:
-        false
+        true
      implementationNames.eth:0xD31F61281A4b262aEa79cbBE09A436975a8b63EA:
-        "Liquidity"
      implementationNames.eth:0xd12FF9c1542F0826DB4c7cAe8BcC4fbeF3d3B6c9:
+        "Liquidity"
    }
```

```diff
    contract Rollup (scr:0x1c88459D014e571c332BF9199aD2D35C93219A2e) {
    +++ description: Main rollup contract used to submit blocks and process deposits. It saves block hashes to be then referenced by the Withdrawal contract.
      sourceHashes.1:
-        "0xfbb7d02542bc666f4b049d5138aced4257fcc21b784009966f830eae7b197643"
+        "0x210e1b4c7ca45694431b4a558e68cf0fc6e9c0f1444fe91538af462e050f3604"
      values.$implementation:
-        "scr:0xF34299210fB8505232649e9BEa14a84DD75e746b"
+        "scr:0xeAc5302f9AA81B38867Ef4Fd37D4e480C0bb8820"
      values.$pastUpgrades.1:
+        ["2026-02-10T09:51:40.000Z","0xbd41e060791e0e158dc07aafdfb52c0e26c76ea9193852ab9d4d5c8eb9e9fe70",["scr:0xeAc5302f9AA81B38867Ef4Fd37D4e480C0bb8820"]]
      values.$upgradeCount:
-        1
+        2
      values.paused:
+        true
      implementationNames.scr:0xF34299210fB8505232649e9BEa14a84DD75e746b:
-        "Rollup"
      implementationNames.scr:0xeAc5302f9AA81B38867Ef4Fd37D4e480C0bb8820:
+        "Rollup"
    }
```

```diff
    contract Withdrawal (scr:0x86B06D2604D9A6f9760E8f691F86d5B2a7C9c449) {
    +++ description: Contract handling withdrawal requests, which require a validity proof of sufficient balance. It tracks amount of funds already withdrawn to prevent double withdrawals.
      values.circuitDigest:
-        "10639849666975086414110868463771120369189468607622759510754735453420311446140"
+        0
    }
```

## Source code changes

```diff
.../Liquidity/Liquidity.sol                        |   2 +-
 .../{.flat@1768216753 => .flat}/Rollup/Rollup.sol  | 172 ++++++++++++++++++++-
 2 files changed, 167 insertions(+), 7 deletions(-)
```

Generated with discovered.json: 0x5a5e21d1f702b4a978de82815108776870ac993a

# Diff at Mon, 12 Jan 2026 11:20:19 GMT:

- author: Sergey Shemyakov (<sergey.shemyakov@l2beat.com>)
- comparing to: main@c2812ac033718c9db96c3996581a53eda6b78cb0 block: 1767783841
- current timestamp: 1768216753

## Description

PredicateServiceManager aggregator EOA (`0x38f6001e8ac11240f903CBa56aFF72A1425ae371`) revoked its EIP7702 delegation, returning to a standard EOA. Ownership of the PredicateServiceManager transferred back to a 4/4 multisig (`0x8A3c2193521Cf895D77c8Dedb290fC5E19126fdE`) from the previous EOA owner (3 new EOAs added).

## Watched changes

```diff
    EOA  (eth:0x38f6001e8ac11240f903CBa56aFF72A1425ae371) {
    +++ description: None
      unverified:
-        true
      proxyType:
-        "EIP7702 EOA"
+        "EOA"
      values:
-        {"$implementation":"eth:0x933779eeC34310cc14b268C025AD4D0baf6D26De"}
    }
```

```diff
    contract PredicateServiceManager (eth:0xf6f4A30EeF7cf51Ed4Ee1415fB3bFDAf3694B0d2) {
    +++ description: None
      values.owner:
-        "eth:0xFb37A6BC0DC1c52900a8E50A2D6d1b7a59CEa02c"
+        "eth:0x8A3c2193521Cf895D77c8Dedb290fC5E19126fdE"
    }
```

```diff
    EOA  (eth:0xFb37A6BC0DC1c52900a8E50A2D6d1b7a59CEa02c) {
    +++ description: None
      receivedPermissions:
-        [{"permission":"interact","from":"eth:0xf6f4A30EeF7cf51Ed4Ee1415fB3bFDAf3694B0d2","description":"can add and remove permissioned operators, deregister regular operators, register new policies, override existing policies, and in general manage the AVS (e.g. thresholds, strategies) and the connection to EigenLayer.","role":".owner"}]
    }
```

```diff
+   Status: CREATED
    contract GnosisSafe (eth:0x8A3c2193521Cf895D77c8Dedb290fC5E19126fdE)
    +++ description: None
```

## Source code changes

```diff
.../intmax/.flat/GnosisSafe/GnosisSafe.sol         | 953 +++++++++++++++++++++
 .../intmax/.flat/GnosisSafe/GnosisSafeProxy.p.sol  |  35 +
 2 files changed, 988 insertions(+)
```

Generated with discovered.json: 0xc8eaab8ca41d4a8d5ae89e50b5c0e6192aac7354

# Diff at Wed, 07 Jan 2026 11:05:12 GMT:

- author: Sergey Shemyakov (<sergey.shemyakov@l2beat.com>)
- comparing to: main@06616d58f9233a17d6fc6d6798b38e1aba76513e block: 1767717509
- current timestamp: 1767783841

## Description

PredicateServiceManager aggregator 7702-delegated to unverified smart contract.

## Watched changes

```diff
    EOA  (eth:0x38f6001e8ac11240f903CBa56aFF72A1425ae371) {
    +++ description: None
      sourceHashes:
-        ["0x41c6ce964a4ef3e910f9ddf78152734dae8d1b1094ffc8334c50249a3b112bbf"]
      values.$implementation:
-        "eth:0x63c0c19a282a1B52b07dD5a65b58948A07DAE32B"
+        "eth:0x933779eeC34310cc14b268C025AD4D0baf6D26De"
      values.delegationManager:
-        "eth:0xdb9B1e94B5b69Df7e401DDbedE43491141047dB3"
      values.DOMAIN_VERSION:
-        "1"
      values.eip712Domain:
-        {"fields":"0x0f","name":"EIP7702StatelessDeleGator","version":"1","chainId":1,"verifyingContract":"eth:0x38f6001e8ac11240f903CBa56aFF72A1425ae371","salt":"0x0000000000000000000000000000000000000000000000000000000000000000","extensions":[]}
      values.entryPoint:
-        "eth:0x0000000071727De22E5E9d8BAf0edAc6f37da032"
      values.getDeposit:
-        0
      values.getDomainHash:
-        "0x7cf15dd1293c71ee6a4c120c19c7a2943ac93931c9c12066915c2efedf0f9e1c"
      values.getNonce:
-        0
      values.NAME:
-        "EIP7702StatelessDeleGator"
      values.PACKED_USER_OP_TYPEHASH:
-        "0xbc37962d8bd1d319c95199bdfda6d3f92baa8903a61b32d5f4ec1f4b36a3bc18"
      values.VERSION:
-        "1.3.0"
      unverified:
+        true
    }
```

Generated with discovered.json: 0x62b02cf18c12df0a3ac7a2044ca2ae08c9f4ccd2

# Diff at Tue, 06 Jan 2026 16:39:34 GMT:

- author: vincfurc (<vincfurc@users.noreply.github.com>)
- comparing to: main@fff3953f1ad2b8af4f603c8d3120130558677a86 block: 1763637734
- current timestamp: 1767717509

## Description

Removed multisig member, decreased threshold.

## Watched changes

```diff
    contract INTMAX Multisig 1 (eth:0xA3C2a579af4cF3853172058e5c76d273DC1542DD) {
    +++ description: None
      values.$members.3:
-        "eth:0xdb0948Ba83610ef1Bc7a2863c16a257B6bF5f6A7"
      values.$threshold:
-        3
+        2
      values.multisigThreshold:
-        "3 of 5 (60%)"
+        "2 of 4 (50%)"
    }
```

```diff
    contract INTMAX Multisig 3 (eth:0xe147e23753505e2C83b5f9ef229a9B7e7B3F50Ea) {
    +++ description: None
      values.$members.1:
-        "eth:0xdb0948Ba83610ef1Bc7a2863c16a257B6bF5f6A7"
      values.multisigThreshold:
-        "1 of 5 (20%)"
+        "1 of 4 (25%)"
    }
```

```diff
    contract INTMAX Multisig 2 (scr:0xA3C2a579af4cF3853172058e5c76d273DC1542DD) {
    +++ description: None
      values.$members.3:
-        "scr:0xdb0948Ba83610ef1Bc7a2863c16a257B6bF5f6A7"
      values.$threshold:
-        3
+        2
      values.multisigThreshold:
-        "3 of 5 (60%)"
+        "2 of 4 (50%)"
    }
```

Generated with discovered.json: 0xa781746afbb166007d5c3c550ba090f0445a170d

# Diff at Thu, 20 Nov 2025 11:23:19 GMT:

- author: vincfurc (<vincfurc@users.noreply.github.com>)
- comparing to: main@affe2a8446dd872cf147b75c29b9d7804e5f0b52 block: 1763033250
- current timestamp: 1763637734

## Description

Owner of PredicateServiceManager (managing the deposits AML checks) is now an EOA.

## Watched changes

```diff
-   Status: DELETED
    contract GnosisSafe (eth:0x8A3c2193521Cf895D77c8Dedb290fC5E19126fdE)
    +++ description: None
```

```diff
    contract PredicateServiceManager (eth:0xf6f4A30EeF7cf51Ed4Ee1415fB3bFDAf3694B0d2) {
    +++ description: None
      values.operators.2:
+        "eth:0x5f936C12E43181662e85814b0cFd10334A33E5A1"
      values.owner:
-        "eth:0x8A3c2193521Cf895D77c8Dedb290fC5E19126fdE"
+        "eth:0xFb37A6BC0DC1c52900a8E50A2D6d1b7a59CEa02c"
    }
```

```diff
    EOA  (eth:0xFb37A6BC0DC1c52900a8E50A2D6d1b7a59CEa02c) {
    +++ description: None
      receivedPermissions:
+        [{"permission":"interact","from":"eth:0xf6f4A30EeF7cf51Ed4Ee1415fB3bFDAf3694B0d2","description":"can add and remove permissioned operators, deregister regular operators, register new policies, override existing policies, and in general manage the AVS (e.g. thresholds, strategies) and the connection to EigenLayer.","role":".owner"}]
    }
```

## Source code changes

```diff
.../GnosisSafe/GnosisSafe.sol => /dev/null         | 953 ---------------------
 .../GnosisSafe/GnosisSafeProxy.p.sol => /dev/null  |  35 -
 2 files changed, 988 deletions(-)
```

Generated with discovered.json: 0x92be968dbd15dcb2b1cd9fc369d6118cfa27d35f

# Diff at Thu, 13 Nov 2025 11:28:34 GMT:

- author: vincfurc (<vincfurc@users.noreply.github.com>)
- comparing to: main@236e99b8e7528eefed3152e229515862240afbdc block: 1760974375
- current timestamp: 1763033250

## Description

New ServiceManager (predicateManager)
https://disco.l2beat.com/diff/eth:0x1BafAF26d236FbEA3E86075370B554eC0477bFD0/eth:0x7FC138988d13deD38FA22aBc4e15e855c92b092E - introduces option for owner to register operators to AVS directly, and a toggle for the owner to allow or deactivate registrations.

## Watched changes

```diff
    EOA  (eth:0x38f6001e8ac11240f903CBa56aFF72A1425ae371) {
    +++ description: None
      receivedPermissions:
-        [{"permission":"interact","from":"eth:0xf6f4A30EeF7cf51Ed4Ee1415fB3bFDAf3694B0d2","description":"can add and remove permissioned operators, deregister regular operators, register new policies, override existing policies, and in general manage the AVS (e.g. thresholds, strategies) and the connection to EigenLayer.","role":".owner"}]
    }
```

```diff
    contract PredicateServiceManager (eth:0xf6f4A30EeF7cf51Ed4Ee1415fB3bFDAf3694B0d2) {
    +++ description: None
      sourceHashes.1:
-        "0x55b4084f8591b2c3c51011b50fe478e7761ce2cab412359b4df3b6941fcba322"
+        "0x64a4c29e61f52080da22207fe5295d233b6450ecc65dbf2852a0b0383fd74f63"
      values.$implementation:
-        "eth:0x1BafAF26d236FbEA3E86075370B554eC0477bFD0"
+        "eth:0x7FC138988d13deD38FA22aBc4e15e855c92b092E"
      values.$pastUpgrades.3:
+        ["2025-11-12T14:17:59.000Z","0xe7e91f3f1cc274f4b11beeb0763c88b1f2b56c2be6b8b1f490695672ea5521d8",["eth:0x7FC138988d13deD38FA22aBc4e15e855c92b092E"]]
      values.$upgradeCount:
-        3
+        4
      values.operators.1:
+        "eth:0x28c4E42b2A0F3Daa4bfd1dC8A2CEDaE99C567b1E"
      values.owner:
-        "eth:0x38f6001e8ac11240f903CBa56aFF72A1425ae371"
+        "eth:0x8A3c2193521Cf895D77c8Dedb290fC5E19126fdE"
      values.allowRegistrations:
+        false
      implementationNames.eth:0x1BafAF26d236FbEA3E86075370B554eC0477bFD0:
-        "ServiceManager"
      implementationNames.eth:0x7FC138988d13deD38FA22aBc4e15e855c92b092E:
+        "ServiceManager"
    }
```

```diff
+   Status: CREATED
    contract GnosisSafe (eth:0x8A3c2193521Cf895D77c8Dedb290fC5E19126fdE)
    +++ description: None
```

## Source code changes

```diff
.../intmax/.flat/GnosisSafe/GnosisSafe.sol         | 953 +++++++++++++++++++++
 .../intmax/.flat/GnosisSafe/GnosisSafeProxy.p.sol  |  35 +
 .../PredicateServiceManager/ServiceManager.sol     |  26 +
 3 files changed, 1014 insertions(+)
```

Generated with discovered.json: 0xca73552541225231bbf01c8b51cb93c767249100

# Diff at Mon, 20 Oct 2025 15:34:07 GMT:

- author: Luca Donno (<donnoh99@gmail.com>)
- comparing to: main@bfe80e92f67656ee716f7ab40cc8f3f9e92dc7d6 block: 1756812807
- current timestamp: 1760974375

## Description

All operators have been removed except one.

## Watched changes

```diff
    contract PredicateServiceManager (eth:0xf6f4A30EeF7cf51Ed4Ee1415fB3bFDAf3694B0d2) {
    +++ description: None
      values.operators.1:
-        "eth:0xa42CD0029F681b08B61f535E846F2A36F468C1c2"
      values.operators.2:
-        "eth:0x6c107920C18BEE5169aBcFeFb702467151dE7688"
      values.operators.3:
-        "eth:0x5ACCC90436492F24E6aF278569691e2c942A676d"
      values.operators.4:
-        "eth:0xBE7d5f26F5D5F567D35a86Dd4d7D02AceD2d5BFF"
      values.operators.5:
-        "eth:0xEA9F738eAD0b011030D65A50a43CAc5EC67fD3fD"
      values.operators.6:
-        "eth:0xa3ff1491088715D140bc821A28287cB3f71B43E4"
      values.operators.7:
-        "eth:0x5cd6Fdfad710609c828feba2508bCAF89e80501a"
      values.operators.8:
-        "eth:0xE3aD2A1E9b0514718680f96FF015d653105D51B9"
      values.operators.9:
-        "eth:0xA5954756792F64ba7bcC4B5fD664B0843a7aFe5b"
      values.operators.10:
-        "eth:0xCaAeB411241aC87b5846797C15bf339A54A1D736"
      values.operators.11:
-        "eth:0x794A15082bC31c81E370f6600FBA047f7226daB4"
      values.operators.12:
-        "eth:0x140dc7eF41B8ED01F340333045dC818947ca428d"
      values.operators.13:
-        "eth:0xd172a86A0F250AEC23ee19c759A8E73621fe3c10"
      values.operators.14:
-        "eth:0xb1EA8424075A71cd97F95ed64069241FfD4833BE"
      values.operators.15:
-        "eth:0xa83e07353A9ED2aF88e7281a2fA7719c01356D8e"
      values.operators.16:
-        "eth:0x896B35E1F9c93AfA35A2882c53605108F934bfe5"
      values.operators.17:
-        "eth:0xd9Dddc21D4A07968D45C7Ae0b57D2f71b0136c07"
      values.operators.18:
-        "eth:0x30EAfE8869a1528660a97b7a7E8e2d0037dCb922"
      values.operators.19:
-        "eth:0x89d60C9BCd5E6879e1F9440917B75502dF8AE020"
      values.operators.20:
-        "eth:0x110af279aAFfB0d182697d7fC87653838AA5945e"
      values.operators.21:
-        "eth:0xC28af4af11181B72194e6577FF4b556Ed4CD27a4"
      values.operators.22:
-        "eth:0x53730f4088B116c807875EB67f71CbB1b065F530"
      values.operators.23:
-        "eth:0xF02fBA1624775bf60D4C7bBFf28bC78547D67E1E"
      values.operators.24:
-        "eth:0x778328d6aDcA7A091F0B73d41aD8eA0E793712c3"
      values.operators.25:
-        "eth:0xe5801326014dB4F6729264Db38F5F5430bc2fbFa"
      values.operators.26:
-        "eth:0xDcAE4FAf7C7d0f4A78abe147244c6e9d60cFD202"
      values.operators.27:
-        "eth:0xEA50bB6735703422D2E053452F1F28BFf17Da51F"
      values.operators.28:
-        "eth:0x5b9B3Cf0202a1a3Dc8f527257b7E6002D23D8c85"
      values.operators.29:
-        "eth:0x67943aE8e07bFC9f5C9A90d608F7923D9C21e051"
      values.operators.30:
-        "eth:0x8f234faF8974CdC99AD2628EF5Ed0e9d644193EB"
      values.operators.31:
-        "eth:0xcCaa639D3Afdc77b562A4673b2ecDE6770349675"
      values.operators.32:
-        "eth:0x3F98F47D302a3CFd3746Fe35f7cF10c3217e5272"
      values.operators.33:
-        "eth:0x46b3f7b5be0787765565A6d8A645266a9347AB82"
      values.operators.34:
-        "eth:0xe483C7F156b25Da9be6220049E5111bB41C4C535"
      values.operators.35:
-        "eth:0xc25D6446d6086218cDAa8Dd04630DC5d16b591F6"
      values.operators.36:
-        "eth:0xa026265a0F01A6E1A19b04655519429df0a57c4e"
      values.operators.37:
-        "eth:0x5D4B5Ef127c545e5bf8E247F9FCd4e75a0A366B4"
      values.operators.38:
-        "eth:0xe0156eF2905c2Ea8B1F7571cAEE85fdF1657Ab38"
      values.operators.39:
-        "eth:0xe25480334fc57a4f38F081e87cdFeeEAF09779C9"
      values.operators.40:
-        "eth:0x08d112Be16ff37ca6DC8eA06eFEFD676A42502AA"
      values.operators.41:
-        "eth:0x01412450D52d5AfedA71b91602D3e0D9dA5231c7"
      values.operators.42:
-        "eth:0xDbEd88D83176316fc46797B43aDeE927Dc2ff2F5"
      values.operators.43:
-        "eth:0x7e3CeDe5c77CD4192D206C652dB0023a89D7E5EC"
      values.operators.44:
-        "eth:0x9ABcE41e1486210AD83DEB831AfcDd214af5B49d"
      values.operators.45:
-        "eth:0xfB487f216CA24162119C0C6Ae015d680D7569C2f"
      values.operators.46:
-        "eth:0xb5Ead7A953052dA8212DA7e9462D65F91205d06D"
      values.operators.47:
-        "eth:0x9e91B47454bEE4A8C54C1704f63f85BcbD112941"
      values.operators.48:
-        "eth:0x3a5DcEc17661d540eF215a56bD5aC35Ac3450b9d"
      values.operators.49:
-        "eth:0x529eC9ac9A80428CF8C92557f2eB1B336616f543"
      values.operators.50:
-        "eth:0xe48c8e071857d1229fc94d73a0f25d1dBB99C04C"
      values.operators.51:
-        "eth:0xdb69c57E9eC197a59d8144a42ECdfB37641BE80D"
      values.operators.52:
-        "eth:0x1C4B8717A3EFF560C49D09e7409819CB81FECe4B"
      values.operators.53:
-        "eth:0x5dCdf02a7188257b7c37dD3158756dA9Ccd4A9Cb"
    }
```

Generated with discovered.json: 0x7f24019e02b04df6282c952b4f6666f36b5fd117

# Diff at Tue, 02 Sep 2025 11:43:14 GMT:

- author: Luca Donno (<donnoh99@gmail.com>)
- comparing to: main@a1c1980a59e1040a5ec42c06890371ce5f315602 block: 1755850487
- current timestamp: 1756812807

## Description

A `.transfer` has been turned into a `.call`. Nothing more.

## Watched changes

```diff
    contract Liquidity (eth:0xF65e73aAc9182e353600a916a6c7681F810f79C3) {
    +++ description: Entry point of the project. Handles deposits, withdrawals, and the communication from and to the main rollup contract on Scroll. Deposits are gated by an AML check.
      sourceHashes.1:
-        "0x317092e18b9969dafe50d31933b2ce36261479b3a6832281c652af1125e002ee"
+        "0xe050f1745884847699cff3db5506410a82629972bb6fd8a52199442b01351485"
      values.$implementation:
-        "eth:0x4fd8BF5f45832a007448fcDE29049919F8cf6D0d"
+        "eth:0xD31F61281A4b262aEa79cbBE09A436975a8b63EA"
      values.$pastUpgrades.2:
+        ["2025-08-30T13:25:23.000Z","0x93f7c96b159e82cd555266aa0451fb2d3a7eb8475edf83f66a15fa617de1eca0",["eth:0xD31F61281A4b262aEa79cbBE09A436975a8b63EA"]]
      values.$upgradeCount:
-        2
+        3
      implementationNames.eth:0x4fd8BF5f45832a007448fcDE29049919F8cf6D0d:
-        "Liquidity"
      implementationNames.eth:0xD31F61281A4b262aEa79cbBE09A436975a8b63EA:
+        "Liquidity"
    }
```

## Source code changes

```diff
.../{.flat@1755850487 => .flat}/Liquidity/Liquidity.sol     | 13 ++++++++++++-
 1 file changed, 12 insertions(+), 1 deletion(-)
```

Generated with discovered.json: 0x887b021c9947830808a20b2b748167b198bdce18

# Diff at Mon, 01 Sep 2025 10:01:10 GMT:

Merge mark

Generated with discovered.json: 0xa266a51ee11a5916d9fc64bfb8635926afcc2a49

# Diff at Fri, 22 Aug 2025 08:15:58 GMT:

- chain: scroll
- author: Luca Donno (<donnoh99@gmail.com>)
- comparing to: main@3d329dea47533f39a2d068e0d1659b75a5fa8cef block: 1754909083
- current timestamp: 1755850487

## Description

- [Claim diff](https://disco.l2beat.com/diff/scr:0x1899bF9D0e40Dd1bB6C3CCF2123A0Bd1DE0F0548/scr:0x5216C8D0F2188a91aD07Fe4F334F220b2F7b59EA): added a "circuit digest", needs further investigation.
- [Withdrawal diff](https://disco.l2beat.com/diff/scr:0xDFC6EB6642FEAF99629c6629b2f7dC7eB9F1a0A3/scr:0x614ef91D1971A4dB458ABde03c62247afc57A753): also added the circuit digest. Needs further investigation.
- The two verifiers have now be replaced by a single PlonkVerifier contract, which is used by both Claim and Withdrawal contracts. Once again, needs further investigation.

## Watched changes

```diff
-   Status: DELETED
    contract WithdrawalPlonkVerifier (0x1858C9e118DbBc70b15Be40BE3fc1EbB062f5734)
    +++ description: None
```

```diff
    contract Claim (0x22ac649b3229eC099C32D790e9e46FbA2CE6C9A5) {
    +++ description: None
      sourceHashes.1:
-        "0xe45dd30cce4dd4d2fbbdcaf6165fb2e148035a2e139b6b671cee3e56c8d4f4c0"
+        "0xdf0969ba7c2284c214c510f2d058375ac28bbfc0eca15673bed761979f32647e"
      values.$implementation:
-        "scr:0x1899bF9D0e40Dd1bB6C3CCF2123A0Bd1DE0F0548"
+        "scr:0x5216C8D0F2188a91aD07Fe4F334F220b2F7b59EA"
      values.$pastUpgrades.1:
+        ["2025-08-16T05:42:09.000Z","0xcb1b6cb53aeb3e3946facae2aa425a1b82068dcdeb41deeaaacae2948c3e4f3a",["scr:0x5216C8D0F2188a91aD07Fe4F334F220b2F7b59EA"]]
      values.$upgradeCount:
-        1
+        2
      values.claimVerifier:
-        "scr:0xaBA5fD516B665C12d7577Db36831474ac16aEe0a"
+        "scr:0x1d38545a33740Ab3480d9035bB3126914404423d"
      values.circuitDigest:
+        "7333968704277044365911105813294038499737090437135973260233960671933432682220"
      implementationNames.scr:0x1899bF9D0e40Dd1bB6C3CCF2123A0Bd1DE0F0548:
-        "Claim"
      implementationNames.scr:0x5216C8D0F2188a91aD07Fe4F334F220b2F7b59EA:
+        "Claim"
    }
```

```diff
    contract Withdrawal (0x86B06D2604D9A6f9760E8f691F86d5B2a7C9c449) {
    +++ description: Contract handling withdrawal requests, which require a validity proof of sufficient balance. It tracks amount of funds already withdrawn to prevent double withdrawals.
      sourceHashes.1:
-        "0x89b2cb04df88855ad4b770af6142b4e15034008b3b07a28ee1397052af0bb787"
+        "0xa0c1878c4a72a8a9f029a05bac051e29d9c4e7ee5711c74e323d1e00a8a489eb"
      values.$implementation:
-        "scr:0xDFC6EB6642FEAF99629c6629b2f7dC7eB9F1a0A3"
+        "scr:0x614ef91D1971A4dB458ABde03c62247afc57A753"
      values.$pastUpgrades.1:
+        ["2025-08-16T05:42:09.000Z","0xcb1b6cb53aeb3e3946facae2aa425a1b82068dcdeb41deeaaacae2948c3e4f3a",["scr:0x614ef91D1971A4dB458ABde03c62247afc57A753"]]
      values.$upgradeCount:
-        1
+        2
      values.withdrawalVerifier:
-        "scr:0x1858C9e118DbBc70b15Be40BE3fc1EbB062f5734"
+        "scr:0x1d38545a33740Ab3480d9035bB3126914404423d"
      values.circuitDigest:
+        "10639849666975086414110868463771120369189468607622759510754735453420311446140"
      implementationNames.scr:0xDFC6EB6642FEAF99629c6629b2f7dC7eB9F1a0A3:
-        "Withdrawal"
      implementationNames.scr:0x614ef91D1971A4dB458ABde03c62247afc57A753:
+        "Withdrawal"
    }
```

```diff
-   Status: DELETED
    contract ClaimPlonkVerifier (0xaBA5fD516B665C12d7577Db36831474ac16aEe0a)
    +++ description: None
```

```diff
+   Status: CREATED
    contract PlonkVerifier (0x1d38545a33740Ab3480d9035bB3126914404423d)
    +++ description: A wrapper verifier that can check both withdrawal zk proofs to exit from INTMAX network and zk proofs for claiming rewards of the privacy mining program.
```

## Source code changes

```diff
.../{.flat@1754909083 => .flat}/Claim/Claim.sol    |   36 +-
 .../ClaimPlonkVerifier.sol => /dev/null            | 1840 --------------------
 .../projects/intmax/scroll/.flat/PlonkVerifier.sol | 1319 ++++++++++++++
 .../Withdrawal/Withdrawal.sol                      |   33 +-
 .../WithdrawalPlonkVerifier.sol => /dev/null       | 1840 --------------------
 5 files changed, 1371 insertions(+), 3697 deletions(-)
```

Generated with discovered.json: 0x40cdd85ceb684d62332ada750e1f11a2eac6b24b

# Diff at Mon, 11 Aug 2025 10:52:35 GMT:

- chain: scroll
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@32817e35c9fe0ba1a1c24a734c37d91068b1565d block: 1754378270
- current timestamp: 1754909083

## Description

Added description to Contribution contract.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 1754378270 (main branch discovery), not current.

```diff
    contract Contribution (0x42Fe7Db60c4C70eBb7597dB9a0959F9fCa0114af) {
    +++ description: Records a set of 'contribution' actions by saving addresses with a tag of their action (e.g. propose blocks, claim withdrawals, deposit...).
      description:
+        "Records a set of 'contribution' actions by saving addresses with a tag of their action (e.g. propose blocks, claim withdrawals, deposit...)."
    }
```

Generated with discovered.json: 0x65bf705945a876349908fe3269eeadd2c58a602e

# Diff at Mon, 11 Aug 2025 10:52:35 GMT:

- chain: ethereum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@32817e35c9fe0ba1a1c24a734c37d91068b1565d block: 1754378270
- current timestamp: 1754909083

## Description

config: ignore some vals in watch mode, add description for contribution contract.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 1754378270 (main branch discovery), not current.

```diff
    contract Contribution (0x4c614C7BB9420caA1F19cB2C58B00864f2125Ce2) {
    +++ description: Records a set of 'contribution' actions by saving addresses with a tag of their action (e.g. propose blocks, claim withdrawals, deposit...).
      description:
+        "Records a set of 'contribution' actions by saving addresses with a tag of their action (e.g. propose blocks, claim withdrawals, deposit...)."
    }
```

Generated with discovered.json: 0xfea1029ed46c0758c6e6cb976d43a4fde0b82b81

# Diff at Tue, 05 Aug 2025 07:17:58 GMT:

- chain: scroll
- author: Luca Donno (<donnoh99@gmail.com>)
- comparing to: main@79ef116bb03dfe870ed23d81b625544ae3a617a6 block: 1754295529
- current timestamp: 1754378270

## Description

Added descriptions.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 1754295529 (main branch discovery), not current.

```diff
    contract Rollup (0x1c88459D014e571c332BF9199aD2D35C93219A2e) {
    +++ description: Main rollup contract used to submit blocks and process deposits. It saves block hashes to be then referenced by the Withdrawal contract.
      description:
+        "Main rollup contract used to submit blocks and process deposits. It saves block hashes to be then referenced by the Withdrawal contract."
    }
```

```diff
    contract Withdrawal (0x86B06D2604D9A6f9760E8f691F86d5B2a7C9c449) {
    +++ description: Contract handling withdrawal requests, which require a validity proof of sufficient balance. It tracks amount of funds already withdrawn to prevent double withdrawals.
      description:
+        "Contract handling withdrawal requests, which require a validity proof of sufficient balance. It tracks amount of funds already withdrawn to prevent double withdrawals."
    }
```

Generated with discovered.json: 0xd910381437ce057b4a96883cad106762af7ca351

# Diff at Tue, 05 Aug 2025 07:17:57 GMT:

- chain: ethereum
- author: Luca Donno (<donnoh99@gmail.com>)
- comparing to: main@79ef116bb03dfe870ed23d81b625544ae3a617a6 block: 1754295529
- current timestamp: 1754378270

## Description

Added descriptions.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 1754295529 (main branch discovery), not current.

```diff
    contract PredicatePermitter (0x11D58231A79D866674EaAa043Fdaeae9A3dF4c0E) {
    +++ description: Contract that connects INTMAX deposits to the Predicate AVS that ultimately checks AML requirements. It stores a policy ID to be then referenced by the Predicate AVS.
      description:
+        "Contract that connects INTMAX deposits to the Predicate AVS that ultimately checks AML requirements. It stores a policy ID to be then referenced by the Predicate AVS."
    }
```

```diff
    contract Liquidity (0xF65e73aAc9182e353600a916a6c7681F810f79C3) {
    +++ description: Entry point of the project. Handles deposits, withdrawals, and the communication from and to the main rollup contract on Scroll. Deposits are gated by an AML check.
      description:
+        "Entry point of the project. Handles deposits, withdrawals, and the communication from and to the main rollup contract on Scroll. Deposits are gated by an AML check."
    }
```

Generated with discovered.json: 0x6d973104ebb03d14919aea82bf28f2d88044c16a

# Diff at Mon, 04 Aug 2025 08:18:56 GMT:

- chain: scroll
- author: Luca Donno (<donnoh99@gmail.com>)
- current timestamp: 1754295529

## Description

Provide description of changes. This section will be preserved.

## Initial discovery

```diff
+   Status: CREATED
    contract WithdrawalPlonkVerifier (0x1858C9e118DbBc70b15Be40BE3fc1EbB062f5734)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Rollup (0x1c88459D014e571c332BF9199aD2D35C93219A2e)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Claim (0x22ac649b3229eC099C32D790e9e46FbA2CE6C9A5)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Contribution (0x42Fe7Db60c4C70eBb7597dB9a0959F9fCa0114af)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Withdrawal (0x86B06D2604D9A6f9760E8f691F86d5B2a7C9c449)
    +++ description: None
```

```diff
+   Status: CREATED
    contract INTMAX Multisig 2 (0xA3C2a579af4cF3853172058e5c76d273DC1542DD)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ClaimPlonkVerifier (0xaBA5fD516B665C12d7577Db36831474ac16aEe0a)
    +++ description: None
```

Generated with discovered.json: 0xbba2961125fdd21445f0710fd366f0c2125562df

# Diff at Mon, 04 Aug 2025 08:18:56 GMT:

- chain: ethereum
- author: Luca Donno (<donnoh99@gmail.com>)
- current timestamp: 1754295529

## Description

Provide description of changes. This section will be preserved.

## Initial discovery

```diff
+   Status: CREATED
    contract PredicatePermitter (0x11D58231A79D866674EaAa043Fdaeae9A3dF4c0E)
    +++ description: None
```

```diff
+   Status: CREATED
    EOA  (0x38f6001e8ac11240f903CBa56aFF72A1425ae371)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Contribution (0x4c614C7BB9420caA1F19cB2C58B00864f2125Ce2)
    +++ description: None
```

```diff
+   Status: CREATED
    contract  (0x7153803C06d6a36D6d91aEB3C1ed8e5b934Df601)
    +++ description: None
```

```diff
+   Status: CREATED
    contract INTMAX Multisig 1 (0xA3C2a579af4cF3853172058e5c76d273DC1542DD)
    +++ description: None
```

```diff
+   Status: CREATED
    contract INTMAX Multisig 3 (0xe147e23753505e2C83b5f9ef229a9B7e7B3F50Ea)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Liquidity (0xF65e73aAc9182e353600a916a6c7681F810f79C3)
    +++ description: None
```

```diff
+   Status: CREATED
    contract PredicateServiceManager (0xf6f4A30EeF7cf51Ed4Ee1415fB3bFDAf3694B0d2)
    +++ description: None
```

