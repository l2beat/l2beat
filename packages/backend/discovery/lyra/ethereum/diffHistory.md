# Diff at Thu, 18 Jan 2024 09:23:11 GMT:

- author: Michał Podsiadły (<michal.podsiadly@l2beat.com>)
- comparing to: main@0cb1eb82b45ad89a272a3c1b8f8f24ae020627cc block: 18927731
- current block number: 19032828

## Description

Dynamic fee overhead has been changed.

## Watched changes

```diff
    contract SystemConfig (0x0e4C4CDd01ceCB01070E9Fdfe7600871e4ae996e) {
      values.scalar:
-        684000
+        68400
    }
```

# Diff at Wed, 03 Jan 2024 15:30:59 GMT:

- author: Radina Talanova (<nt.radina@gmail.com>)
- comparing to: main@e8eb03b39061a86a8ec01e26d970e40d080ad225

## Description

One owner is removed and another is added to LyraMultisig.

## Watched changes

```diff
    contract LyraMultisig (0x4a4962275DF8C60a80d3a25faEc5AA7De116A746) {
      values.getOwners.4:
-        "0x5553a23a71Bc7985c8E58Ca08072D2Fa9D1D1F4c"
+        "0x4D8007a0E9f293e62E2b0F43C6Cf4C4B9e135BAe"
      values.getOwners.3:
-        "0x4D8007a0E9f293e62E2b0F43C6Cf4C4B9e135BAe"
+        "0xefCf0c8faFB425997870f845e26fC6cA6EE6dD5C"
      values.getOwners.2:
-        "0xefCf0c8faFB425997870f845e26fC6cA6EE6dD5C"
+        "0xa0C600a6e85bf225958FFAcC70B5FDDF9A059038"
      values.getOwners.1:
-        "0xa0C600a6e85bf225958FFAcC70B5FDDF9A059038"
+        "0x3840f487A17A41100DD1Bf0946c34f132a57Fd5f"
      values.getOwners.0:
-        "0x3840f487A17A41100DD1Bf0946c34f132a57Fd5f"
+        "0xa4000bDD2bB92ce6750b31F1eeda47Bd1cB8e6e4"
    }
```

# Diff at Tue, 19 Dec 2023 08:25:57 GMT:

- author: Luca Donno (<donnoh99@gmail.com>)
- comparing to: main@

## Description

Add initial config for Lyra.

## Watched changes

```diff
+   Status: CREATED
    contract OptimismMintableERC20Factory (0x08Dea366F26C25a08C8D1C3568ad07d1e587136d) {
    }
```

```diff
+   Status: CREATED
    contract SystemConfig (0x0e4C4CDd01ceCB01070E9Fdfe7600871e4ae996e) {
    }
```

```diff
+   Status: CREATED
    contract L2OutputOracle (0x1145E7848c8B64c6cab86Fd6D378733385c5C3Ba) {
    }
```

```diff
+   Status: CREATED
    contract ProxyAdmin (0x35d5D43271548c984662d4879FBc8e041Bc1Ff93) {
    }
```

```diff
+   Status: CREATED
    contract LyraMultisig (0x4a4962275DF8C60a80d3a25faEc5AA7De116A746) {
    }
```

```diff
+   Status: CREATED
    contract L1CrossDomainMessenger (0x5456f02c08e9A018E42C39b351328E5AA864174A) {
    }
```

```diff
+   Status: CREATED
    contract L1StandardBridge (0x61E44dC0dae6888B5a301887732217d5725B0bFf) {
    }
```

```diff
+   Status: CREATED
    contract L1ERC721Bridge (0x6CC3268794c5d3E3d9d52adEfC748B59d536cb22) {
    }
```

```diff
+   Status: CREATED
    contract OptimismPortal (0x85eA9c11cf3D4786027F7FD08F4406b15777e5f8) {
    }
```

```diff
+   Status: CREATED
    contract ChallengerMultisig (0x91F4be0C264FAFA1fEd75c4440910Cba2cAd98e8) {
    }
```

```diff
+   Status: CREATED
    contract AddressManager (0xC845F9C4004EB35a8bde8ad89C4760a9c0e65CAB) {
    }
```
