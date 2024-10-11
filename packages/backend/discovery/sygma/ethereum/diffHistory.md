Generated with discovered.json: 0x3efb0456de1b5206037854e55e726d862297bdf2

# Diff at Fri, 09 Aug 2024 10:12:40 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@1f0da1d0aab7bc6b3b5e54e7e93480bd98e57035 block: 19532229
- current block number: 19532229

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19532229 (main branch discovery), not current.

```diff
    contract Community Multisig (0xc4d8b2F5501C765dE0C5E12550118F397B197D05) {
    +++ description: None
      values.$multisigThreshold:
-        "4 of 6 (67%)"
      values.getOwners:
-        ["0x0c1db86328E6CFCD4f530401131Dc9a26DefA12a","0xd85b34B2Fe1eC7815B6dF659372382A8FA229677","0xa399460Ce767b06297457178D2F9F8f144017E77","0xe845B1d31CaA16Bf6c6Bf5E97a28D086bd46FD49","0xC6458dedf35231F524ED9d7E0DF77A60b9E08676","0x86a73a594f74C76a6eB8F9E728d992D03252f60f"]
      values.getThreshold:
-        4
      values.$members:
+        ["0x0c1db86328E6CFCD4f530401131Dc9a26DefA12a","0xd85b34B2Fe1eC7815B6dF659372382A8FA229677","0xa399460Ce767b06297457178D2F9F8f144017E77","0xe845B1d31CaA16Bf6c6Bf5E97a28D086bd46FD49","0xC6458dedf35231F524ED9d7E0DF77A60b9E08676","0x86a73a594f74C76a6eB8F9E728d992D03252f60f"]
      values.$threshold:
+        4
      values.multisigThreshold:
+        "4 of 6 (67%)"
    }
```

```diff
    contract Admin Multisig (0xde79695d5cefF7c324552B3ecbe6165f77FCdF53) {
    +++ description: None
      values.$multisigThreshold:
-        "3 of 5 (60%)"
      values.getOwners:
-        ["0xacc0268a75280192897a78C706C9FBA2d2b851C4","0x5a288b42dC222190D8cF5014A330c978ee42A5df","0xe845B1d31CaA16Bf6c6Bf5E97a28D086bd46FD49","0x197C57440A30cB28103ab27CB1b0dC86E5907ADA","0x86a73a594f74C76a6eB8F9E728d992D03252f60f"]
      values.getThreshold:
-        3
      values.$members:
+        ["0xacc0268a75280192897a78C706C9FBA2d2b851C4","0x5a288b42dC222190D8cF5014A330c978ee42A5df","0xe845B1d31CaA16Bf6c6Bf5E97a28D086bd46FD49","0x197C57440A30cB28103ab27CB1b0dC86E5907ADA","0x86a73a594f74C76a6eB8F9E728d992D03252f60f"]
      values.$threshold:
+        3
      values.multisigThreshold:
+        "3 of 5 (60%)"
    }
```

Generated with discovered.json: 0xa3c98e31a5cf1a521d5e4eaef08fd9ac3f0b15e6

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
