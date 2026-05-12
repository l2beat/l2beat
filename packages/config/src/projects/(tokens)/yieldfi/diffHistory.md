Generated with discovered.json: 0xb87f3a498a326d314c535288dfd054b481588f1d

# Diff at Fri, 08 May 2026 07:53:12 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@488d190650457a1fba9b18a83f14a17ab8b2c84c block: 1777026534
- current timestamp: 1777026534

## Description

Use the new flattener implementation

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 1777026534 (main branch discovery), not current.

```diff
    contract Manager (eth:0x03ACc35286bAAE6D73d99a9f14Ef13752208C8dC) [N/A] {
    +++ description: None
      sourceHashes.0:
-        "0x525b22d02f8b39d3432dfaf0061e3d91caa10d282e86ec7abeb4ca11790f6762"
+        "0xbda0929be0223e0b4c8c6cdb89dbe1fd3ef62e3aee028519d4c97c5dbab66e7f"
      sourceHashes.1:
-        "0x84da8be39a916ec799c2d515f4c612a387cb3378d34916337722b367a019b8c6"
+        "0x22efa027adf30a6de805e24a32630537908b234296e3592e46c020d3ee39adc1"
    }
```

```diff
    contract Administrator (eth:0x10472f91f67C49260BDD65F016ea0757bb1Fc91e) [yieldfi/Administrator] {
    +++ description: None
      sourceHashes.0:
-        "0x525b22d02f8b39d3432dfaf0061e3d91caa10d282e86ec7abeb4ca11790f6762"
+        "0xbda0929be0223e0b4c8c6cdb89dbe1fd3ef62e3aee028519d4c97c5dbab66e7f"
      sourceHashes.1:
-        "0xfeef795150202675eb781deeb753733de1bb9769ae0762cbb3f5a354690ae5e7"
+        "0x136a7ccc775b7afd3eeae698134121ce9a327c4eb5557c8a04eb30afbd789773"
    }
```

```diff
    contract yUSD (eth:0x19Ebd191f7A24ECE672ba13A302212b5eF7F35cb) [yieldfi/yToken] {
    +++ description: None
      sourceHashes.0:
-        "0x525b22d02f8b39d3432dfaf0061e3d91caa10d282e86ec7abeb4ca11790f6762"
+        "0xbda0929be0223e0b4c8c6cdb89dbe1fd3ef62e3aee028519d4c97c5dbab66e7f"
      sourceHashes.1:
-        "0xc584cf0791972d811cbb10b6ed2caf5e040fbcdd5219bf8386cdf9654fa19585"
+        "0x02e2d72c26c65b2a55f4610dbda4ffe375173552e486e4a592c2bad05d5a1067"
    }
```

```diff
    contract vyUSD (eth:0x2e3C5e514EEf46727DE1FE44618027A9b70D92FC) [yieldfi/yToken] {
    +++ description: None
      sourceHashes.0:
-        "0x986346836d4dfb3ec6cb62cd668e6d746f8be0a370a352172dd7f7e0a7fe1320"
+        "0x3335d1c5141feebb2c3729ab3dc2810d3d9196ee836d49c75be1c2b800a77d81"
      sourceHashes.1:
-        "0xe0d5f5bf90b1a9a74c7ac96f5bcbbf52030da73aa7927629913cc14c0d2a2264"
+        "0x36cb174eeefe4e520517d17b4eb874a87fa1ad98228902c93b7a37e24760c607"
    }
```

```diff
    contract Yield (eth:0x392017161a9507F19644E8886A237C58809212B5) [N/A] {
    +++ description: None
      sourceHashes.0:
-        "0x525b22d02f8b39d3432dfaf0061e3d91caa10d282e86ec7abeb4ca11790f6762"
+        "0xbda0929be0223e0b4c8c6cdb89dbe1fd3ef62e3aee028519d4c97c5dbab66e7f"
      sourceHashes.1:
-        "0xd39f986b40a87be666a70c453f29c7d0f0d267c79bb9ffe83efaa218827874a6"
+        "0xc3f87c18a2da01f51bb6ebc75b476cc46ce896a68d0a4da706e085e7489c1796"
    }
```

```diff
    contract YieldFiTimelockController (eth:0x8E31eFdA4453494a84Fa6168D53Eb1418c0b4aC4) [yieldfi/TimelockController] {
    +++ description: None
      sourceHashes.0:
-        "0x706812f226bec5d959f6b4977145ce734718d676eaee8707aa2bff14e59eba77"
+        "0xf65f8f13e98380ad7c41bf83adb8837cfec3492f905f8b84867aad9a59c7a6ac"
    }
```

```diff
    contract RequestReceipt (eth:0x933B4464beBE7136bC184637792c0EE514057660) [yieldfi/RequestReceipt] {
    +++ description: None
      sourceHashes.0:
-        "0x525b22d02f8b39d3432dfaf0061e3d91caa10d282e86ec7abeb4ca11790f6762"
+        "0xbda0929be0223e0b4c8c6cdb89dbe1fd3ef62e3aee028519d4c97c5dbab66e7f"
      sourceHashes.1:
-        "0x96fa98ebc2c01b61141dbd8871e1532a6ef100fce0a94d64e6a42ecf3ce69550"
+        "0x86b9680dedb75717cb529915288125a7d00471c49f34ec8a5e11b52cdd4cfe2f"
    }
```

```diff
    EOA  (eth:0x944416e5dF03eE4c14EC44C01495005564e6b07E) {
    +++ description: None
      sourceHashes.0:
-        "0x41c6ce964a4ef3e910f9ddf78152734dae8d1b1094ffc8334c50249a3b112bbf"
+        "0x6fcf212849ffbf34d907a048df4d05a6c97f876a620c7386a770735262604c54"
    }
```

Generated with discovered.json: 0xa14dd8494a1d392d3689de6a1d0f336308542ac7

# Diff at Tue, 05 May 2026 10:24:06 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@b6437082b3ea8fb0d97f4474b1c3452a1ce271b0 block: 1777026534
- current timestamp: 1777026534

## Description

Include deployer address

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 1777026534 (main branch discovery), not current.

```diff
    contract Manager (eth:0x03ACc35286bAAE6D73d99a9f14Ef13752208C8dC) {
    +++ description: None
      deployerAddress:
+        "eth:0x944416e5dF03eE4c14EC44C01495005564e6b07E"
    }
```

```diff
    contract Administrator (eth:0x10472f91f67C49260BDD65F016ea0757bb1Fc91e) {
    +++ description: None
      deployerAddress:
+        "eth:0x944416e5dF03eE4c14EC44C01495005564e6b07E"
    }
```

```diff
    contract yUSD (eth:0x19Ebd191f7A24ECE672ba13A302212b5eF7F35cb) {
    +++ description: None
      deployerAddress:
+        "eth:0x944416e5dF03eE4c14EC44C01495005564e6b07E"
    }
```

```diff
    contract ProxyAdmin (eth:0x25249946D42a5fba2b6b1d191127BCaEc70bD103) {
    +++ description: None
      deployerAddress:
+        "eth:0x944416e5dF03eE4c14EC44C01495005564e6b07E"
    }
```

```diff
    contract vyUSD (eth:0x2e3C5e514EEf46727DE1FE44618027A9b70D92FC) {
    +++ description: None
      deployerAddress:
+        "eth:0x944416e5dF03eE4c14EC44C01495005564e6b07E"
    }
```

```diff
    contract Yield (eth:0x392017161a9507F19644E8886A237C58809212B5) {
    +++ description: None
      deployerAddress:
+        "eth:0x944416e5dF03eE4c14EC44C01495005564e6b07E"
    }
```

```diff
    contract ProxyAdmin (eth:0x3C6ECDcdAc78B65BDD85985285C1A1d140A79a63) {
    +++ description: None
      deployerAddress:
+        "eth:0x944416e5dF03eE4c14EC44C01495005564e6b07E"
    }
```

```diff
    contract ProxyAdmin (eth:0x6569089dd56A140777014d27B6113d96f3544f71) {
    +++ description: None
      deployerAddress:
+        "eth:0x944416e5dF03eE4c14EC44C01495005564e6b07E"
    }
```

```diff
    contract YieldFiTimelockController (eth:0x8E31eFdA4453494a84Fa6168D53Eb1418c0b4aC4) {
    +++ description: None
      deployerAddress:
+        "eth:0x944416e5dF03eE4c14EC44C01495005564e6b07E"
    }
```

```diff
    contract RequestReceipt (eth:0x933B4464beBE7136bC184637792c0EE514057660) {
    +++ description: None
      deployerAddress:
+        "eth:0x944416e5dF03eE4c14EC44C01495005564e6b07E"
    }
```

```diff
    contract ProxyAdmin (eth:0xc79920D40206cc28f7B70E72d623Ff7fB83004C1) {
    +++ description: None
      deployerAddress:
+        "eth:0x944416e5dF03eE4c14EC44C01495005564e6b07E"
    }
```

```diff
    contract ProxyAdmin (eth:0xCfD925b89D4ccfee2eC9287b362648854aCbBF03) {
    +++ description: None
      deployerAddress:
+        "eth:0x944416e5dF03eE4c14EC44C01495005564e6b07E"
    }
```

```diff
    contract ProxyAdmin (eth:0xE26E1D2ae51dcB89E382CA7400b080e6632117B9) {
    +++ description: None
      deployerAddress:
+        "eth:0x944416e5dF03eE4c14EC44C01495005564e6b07E"
    }
```

Generated with discovered.json: 0x466747869499119540bf0127a3e71869017860b4

# Diff at Fri, 24 Apr 2026 10:30:15 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@50904b47f9bded0b5b79527f58da5cd3899e2866 block: 1773669732
- current timestamp: 1777026534

## Description

admin removed from ac.

## Watched changes

```diff
    contract Administrator (eth:0x10472f91f67C49260BDD65F016ea0757bb1Fc91e) {
    +++ description: None
      values.accessControl.ADMIN.members.0:
-        "eth:0x944416e5dF03eE4c14EC44C01495005564e6b07E"
    }
```

Generated with discovered.json: 0x329301b20b05ee2df3dcaf5fdcd10d8b771bdd5d

# Diff at Mon, 16 Mar 2026 14:12:50 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@edb0fff695048631d1d966c5e28186da0c4751ee block: 1769433017
- current timestamp: 1773669732

## Description

config: ignore relative.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 1769433017 (main branch discovery), not current.

```diff
-   Status: DELETED
    contract USD Coin Token (eth:0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48)
    +++ description: None
```

Generated with discovered.json: 0x12113ee3c5d50d1583102ba45f791eb33ee1e607

# Diff at Mon, 26 Jan 2026 13:11:21 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@daff52088f9d57f8a71e0b6d63dada6f9cf51d36 block: 1768372744
- current timestamp: 1769433017

## Description

new access control role members.

## Watched changes

```diff
    contract Administrator (eth:0x10472f91f67C49260BDD65F016ea0757bb1Fc91e) {
    +++ description: None
      values.accessControl.MANAGER.members.0:
+        "eth:0x944416e5dF03eE4c14EC44C01495005564e6b07E"
      values.accessControl.0x8554e4c9634c3022983cc2156859c8a963fefd7f46d6eae4e74af237818da178:
+        {"adminRole":"DEFAULT_ADMIN_ROLE","members":["eth:0x944416e5dF03eE4c14EC44C01495005564e6b07E"]}
      values.accessControl.0x241ecf16d79d0f8dbfb92cbc07fe17840425976cf0667f022fe9877caa831b08:
+        {"adminRole":"DEFAULT_ADMIN_ROLE","members":["eth:0x944416e5dF03eE4c14EC44C01495005564e6b07E"]}
    }
```

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

