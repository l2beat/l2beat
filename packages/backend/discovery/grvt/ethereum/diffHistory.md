Generated with discovered.json: 0x33652aad37ebe63558bcd3c24da35b2fce941c02

# Diff at Mon, 20 Jan 2025 11:10:04 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@400cfe1ca700b8b710220906f278f002c698d3c8 block: 21629172
- current block number: 21629172

## Description

discodrive zk stack.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21629172 (main branch discovery), not current.

```diff
    contract Verifier (0x70F3FBf8a427155185Ec90BED8a3434203de9604) {
    +++ description: Implements the ZK proof verification logic.
      template:
+        "shared-zk-stack/Verifier"
      description:
+        "Implements the ZK proof verification logic."
    }
```

Generated with discovered.json: 0x64cee33bb3a78b23ba6eb00682c572af8a421c3d

# Diff at Wed, 15 Jan 2025 10:05:54 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@3ea176aee1470e5ec80e65adfc81a954f84584d8 block: 21593895
- current block number: 21629172

## Description

Ignore GRVT token.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21593895 (main branch discovery), not current.

```diff
    contract GrvtChainAdminMultisig (0x3a23919d4aA39e096E9d6420fd6a2861A20B19e5) {
    +++ description: None
      receivedPermissions.2:
-        {"permission":"upgrade","target":"0xE17aeD2fC55f4A876315376ffA49FE6358113a65"}
      receivedPermissions.1.target:
-        "0xAB3B124052F0389D1cbED221d912026Ac995bb95"
+        "0xE17aeD2fC55f4A876315376ffA49FE6358113a65"
    }
```

```diff
-   Status: DELETED
    contract GRVTBaseToken (0xAB3B124052F0389D1cbED221d912026Ac995bb95)
    +++ description: None
```

Generated with discovered.json: 0x01760da7c2e999a872c59c95cea8d1bfdf8fc730

# Diff at Fri, 10 Jan 2025 11:53:07 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- current block number: 21593895

## Description

Initial discovery of a standard ZK stack Validium.

## Initial discovery

```diff
+   Status: CREATED
    contract GrvtChainAdminMultisig (0x3a23919d4aA39e096E9d6420fd6a2861A20B19e5)
    +++ description: None
```

```diff
+   Status: CREATED
    contract GRVTTransactionFilterer (0x3Cd52B238Ac856600b22756133eEb31ECb25109a)
    +++ description: None
```

```diff
+   Status: CREATED
    contract GrvtZkEvmAdmin (0x6308ee1Ebdb8D5E60bB88D3EA3b56CE326193e7D)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Verifier (0x70F3FBf8a427155185Ec90BED8a3434203de9604)
    +++ description: None
```

```diff
+   Status: CREATED
    contract GRVTBaseToken (0xAB3B124052F0389D1cbED221d912026Ac995bb95)
    +++ description: None
```

```diff
+   Status: CREATED
    contract GRVTBridgeProxy (0xE17aeD2fC55f4A876315376ffA49FE6358113a65)
    +++ description: None
```

```diff
+   Status: CREATED
    contract GrvtZkEvm (0xe3e310cd8EE0C808794810AB50FE4BcCC5c7D89E)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Governance (0xe81d64195072e4d09639b31Abb257d0096FEa9d1)
    +++ description: None
```
