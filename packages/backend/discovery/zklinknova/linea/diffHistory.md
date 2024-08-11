Generated with discovered.json: 0x2089e3eb3876579f2d95597b91f2ebd5d89feef2

# Diff at Fri, 09 Aug 2024 10:14:26 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@1f0da1d0aab7bc6b3b5e54e7e93480bd98e57035 block: 7681920
- current block number: 7681920

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 7681920 (main branch discovery), not current.

```diff
    contract LineaOwner (0x0Bff4B38792a95314b3463E1Bf9831BDa1995391) {
    +++ description: None
      assignedPermissions.admin:
-        ["0x7b5780d6df85A7dF96a3e1A019639a1dbDe937dB"]
      assignedPermissions.upgrade:
+        ["0x7b5780d6df85A7dF96a3e1A019639a1dbDe937dB"]
      values.$multisigThreshold:
-        "5 of 8 (63%)"
      values.getOwners:
-        ["0xd30898ECdc21C72250a5fd1dbD37FF7D63237Db5","0x7785bccF9110C188Dad39bE49D4Cdf6c6CC03F10","0x4D9b22B92Ff9faFAc013f82faCA88BDa8E778cb5","0xF801886AE2e127A269B0F11892edb54F692d02dF","0xC75EFCffEE930706daec5CaCA012551f6a1845D7","0x24a257B7D975E7ec6219C4cFCbcF6E504253c7A9","0xd8F26118505417Ef6468Ac8A2AE1E5117245Db92","0xcC1A2bd1a459be0C7fAd3B7F9Fa9a6CBBFE9BFa5"]
      values.getThreshold:
-        5
      values.$members:
+        ["0xd30898ECdc21C72250a5fd1dbD37FF7D63237Db5","0x7785bccF9110C188Dad39bE49D4Cdf6c6CC03F10","0x4D9b22B92Ff9faFAc013f82faCA88BDa8E778cb5","0xF801886AE2e127A269B0F11892edb54F692d02dF","0xC75EFCffEE930706daec5CaCA012551f6a1845D7","0x24a257B7D975E7ec6219C4cFCbcF6E504253c7A9","0xd8F26118505417Ef6468Ac8A2AE1E5117245Db92","0xcC1A2bd1a459be0C7fAd3B7F9Fa9a6CBBFE9BFa5"]
      values.$threshold:
+        5
      values.multisigThreshold:
+        "5 of 8 (63%)"
    }
```

```diff
    contract Governance (0xeF528a8Ca4B6aFDB6716Ef9f11bCa0c5C47454ec) {
    +++ description: None
      assignedPermissions.admin:
-        ["0x62cE247f34dc316f93D3830e4Bf10959FCe630f8"]
      assignedPermissions.upgrade:
+        ["0x62cE247f34dc316f93D3830e4Bf10959FCe630f8"]
    }
```

Generated with discovered.json: 0x00aa46468de35ce7b94c77f6909a9f0e2568a09a

# Diff at Sun, 04 Aug 2024 10:28:44 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@14945a4ebc63b3db3867f33067f31f159fedd9a9 block: 6349728
- current block number: 7681920

## Description

One signer in the Owner MS is replaced and one validator removed.

## Watched changes

```diff
    contract LineaOwner (0x0Bff4B38792a95314b3463E1Bf9831BDa1995391) {
    +++ description: None
      values.getOwners.5:
-        "0x824C9364A6CF8f5EB542ad2ca8F5705561C8b1db"
+        "0x24a257B7D975E7ec6219C4cFCbcF6E504253c7A9"
      values.getOwners.4:
-        "0x24a257B7D975E7ec6219C4cFCbcF6E504253c7A9"
+        "0xC75EFCffEE930706daec5CaCA012551f6a1845D7"
      values.getOwners.3:
-        "0xC75EFCffEE930706daec5CaCA012551f6a1845D7"
+        "0xF801886AE2e127A269B0F11892edb54F692d02dF"
      values.getOwners.2:
-        "0xF801886AE2e127A269B0F11892edb54F692d02dF"
+        "0x4D9b22B92Ff9faFAc013f82faCA88BDa8E778cb5"
      values.getOwners.1:
-        "0x4D9b22B92Ff9faFAc013f82faCA88BDa8E778cb5"
+        "0x7785bccF9110C188Dad39bE49D4Cdf6c6CC03F10"
      values.getOwners.0:
-        "0x7785bccF9110C188Dad39bE49D4Cdf6c6CC03F10"
+        "0xd30898ECdc21C72250a5fd1dbD37FF7D63237Db5"
    }
```

```diff
-   Status: DELETED
    contract  (0x217C85a8B14466963905C22E817Dd1553fa62DFC)
    +++ description: None
```

```diff
    contract zkLink (0x5Cb18b6e4e6F3b46Ce646b0f4704D53724C5Df05) {
    +++ description: None
      values.validators.2:
-        "0x509ff56c152315EdeE91A2e0f059195519507e01"
      values.validators.1:
-        "0x54B39C0e4089f0789b9f8EdE20D725e1AFF805Cb"
+        "0x509ff56c152315EdeE91A2e0f059195519507e01"
      values.validators.0:
-        "0x217C85a8B14466963905C22E817Dd1553fa62DFC"
+        "0x54B39C0e4089f0789b9f8EdE20D725e1AFF805Cb"
    }
```

Generated with discovered.json: 0xca456511d105080dbc231beb25223ed9fdb9bf4c

# Diff at Thu, 04 Jul 2024 14:15:56 GMT:

- author: Luca Donno (<donnoh99@gmail.com>)
- current block number: 6349728

## Description

Provide description of changes. This section will be preserved.

## Initial discovery

```diff
+   Status: CREATED
    contract LineaOwner (0x0Bff4B38792a95314b3463E1Bf9831BDa1995391)
    +++ description: None
```

```diff
+   Status: CREATED
    contract  (0x217C85a8B14466963905C22E817Dd1553fa62DFC)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ValidatorTimelock (0x509ff56c152315EdeE91A2e0f059195519507e01)
    +++ description: None
```

```diff
+   Status: CREATED
    contract zkLink (0x5Cb18b6e4e6F3b46Ce646b0f4704D53724C5Df05)
    +++ description: None
```

```diff
+   Status: CREATED
    contract L1ERC20Bridge (0x62cE247f34dc316f93D3830e4Bf10959FCe630f8)
    +++ description: None
```

```diff
+   Status: CREATED
    contract LineaL2Gateway (0x7b5780d6df85A7dF96a3e1A019639a1dbDe937dB)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Verifier (0x902C3806A84f4e855a8746e92d7F1C9a51400458)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Governance (0xeF528a8Ca4B6aFDB6716Ef9f11bCa0c5C47454ec)
    +++ description: None
```
