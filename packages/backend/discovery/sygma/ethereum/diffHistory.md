Generated with discovered.json: 0x5a6ab1ee9502b50628f133731ad84fd2188fc5d9

# Diff at Thu, 28 Mar 2024 11:12:09 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@21187e63b9b90823a55c461c331868a470ce17eb block: 19488926
- current block number: 19532229

## Description

Update discovery to include the multisig threshold.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19488926 (main branch discovery), not current.

```diff
    contract Community Multisig (0xc4d8b2F5501C765dE0C5E12550118F397B197D05) {
    +++ description: None
      upgradeability.threshold:
+        "4 of 6 (67%)"
    }
```

```diff
    contract Admin Multisig (0xde79695d5cefF7c324552B3ecbe6165f77FCdF53) {
    +++ description: None
      upgradeability.threshold:
+        "3 of 5 (60%)"
    }
```

Generated with discovered.json: 0x057ae635feb239a6c79214cf0179838ccbddfcfb

# Diff at Fri, 22 Mar 2024 08:18:53 GMT:

- author: Bartek Kiepuszewski (<bkiepuszewski@gmail.com>)
- current block number: 19488926

## Description

Created a new config for the Sygma bridge. Sygma contracts do not
emit events when new handlers are added, hence it is hard to get
all the handlers from the discovery - this will need to be fixed
by having a more sophisticated discovery storage handler

## Initial discovery

```diff
+   Status: CREATED
    contract FeeHandlerRouter (0x1d34808907607FA82Fa1b51F5fBA5Ff5a3Fa90cF)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Permissionless Generic Handler (0x31282123E7bcd947e2c1Bc364d564839574fAdCD)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Bridge (0x4D878E8Fb90178588Cda4cf1DCcdC9a6d2757089)
    +++ description: None
```

```diff
+   Status: CREATED
    contract BasicFeeHandler (0x9f9778DA7c1D0AbE148314d6C1EA6E0A93C151C7)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Community Multisig (0xc4d8b2F5501C765dE0C5E12550118F397B197D05)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ERC20 Bridge Handler (0xC832588193cd5ED2185daDA4A531e0B26eC5B830)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Admin Multisig (0xde79695d5cefF7c324552B3ecbe6165f77FCdF53)
    +++ description: None
```

```diff
+   Status: CREATED
    contract AccessControlSegregator (0xf433EfDf1Fb438F9d79D1E71dF2c2bdeAc95e28E)
    +++ description: None
```
