Generated with discovered.json: 0xab40a816016aa118c5721619fbe0f238cffa3bd2

# Diff at Mon, 01 Sep 2025 10:01:10 GMT:

Merge mark

Generated with discovered.json: 0x2f8999735e2302ce27e461a24d352f4fa0ea1f06

# Diff at Mon, 14 Jul 2025 12:47:08 GMT:

- chain: optimism
- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@9f4300dad2f3d080cd56fa311d4a848556c74e72 block: 133912814
- current block number: 133912814

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 133912814 (main branch discovery), not current.

```diff
    contract GnosisSafe (0x0897316DFE7141DB1E182551c3e8077cf5dd9695) {
    +++ description: None
      address:
-        "0x0897316DFE7141DB1E182551c3e8077cf5dd9695"
+        "oeth:0x0897316DFE7141DB1E182551c3e8077cf5dd9695"
      values.$implementation:
-        "0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552"
+        "oeth:0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552"
      values.$members.0:
-        "0x541f3cc5772a64f2ba0a47e83236CcE2F089b188"
+        "oeth:0x541f3cc5772a64f2ba0a47e83236CcE2F089b188"
      implementationNames.0x0897316DFE7141DB1E182551c3e8077cf5dd9695:
-        "GnosisSafeProxy"
      implementationNames.0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552:
-        "GnosisSafe"
      implementationNames.oeth:0x0897316DFE7141DB1E182551c3e8077cf5dd9695:
+        "GnosisSafeProxy"
      implementationNames.oeth:0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552:
+        "GnosisSafe"
    }
```

```diff
    contract GnosisSafe (0x140C0227Cbe493A56868DDF4ea582E92ef3e9744) {
    +++ description: None
      address:
-        "0x140C0227Cbe493A56868DDF4ea582E92ef3e9744"
+        "oeth:0x140C0227Cbe493A56868DDF4ea582E92ef3e9744"
      values.$implementation:
-        "0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552"
+        "oeth:0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552"
      values.$members.0:
-        "0x5f39524Ed45091abDF3Caff7399c426D7c5F7F04"
+        "oeth:0x5f39524Ed45091abDF3Caff7399c426D7c5F7F04"
      implementationNames.0x140C0227Cbe493A56868DDF4ea582E92ef3e9744:
-        "GnosisSafeProxy"
      implementationNames.0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552:
-        "GnosisSafe"
      implementationNames.oeth:0x140C0227Cbe493A56868DDF4ea582E92ef3e9744:
+        "GnosisSafeProxy"
      implementationNames.oeth:0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552:
+        "GnosisSafe"
    }
```

```diff
    EOA  (0x163f8C2467924be0ae7B5347228CABF260318753) {
    +++ description: None
      address:
-        "0x163f8C2467924be0ae7B5347228CABF260318753"
+        "oeth:0x163f8C2467924be0ae7B5347228CABF260318753"
    }
```

```diff
    EOA  (0x2a7A69daDe8fed5c88b5894392ADc6c42da6d5c7) {
    +++ description: None
      address:
-        "0x2a7A69daDe8fed5c88b5894392ADc6c42da6d5c7"
+        "oeth:0x2a7A69daDe8fed5c88b5894392ADc6c42da6d5c7"
    }
```

```diff
    contract SemaphoreVerifier (0x31b0e17db1D02B079177698dF2eD7037Fc1d0B2c) {
    +++ description: None
      address:
-        "0x31b0e17db1D02B079177698dF2eD7037Fc1d0B2c"
+        "oeth:0x31b0e17db1D02B079177698dF2eD7037Fc1d0B2c"
      implementationNames.0x31b0e17db1D02B079177698dF2eD7037Fc1d0B2c:
-        "SemaphoreVerifier"
      implementationNames.oeth:0x31b0e17db1D02B079177698dF2eD7037Fc1d0B2c:
+        "SemaphoreVerifier"
    }
```

```diff
    EOA  (0x3b870Ea07b6511475Fa2422eA9DaA74C55Db85Be) {
    +++ description: None
      address:
-        "0x3b870Ea07b6511475Fa2422eA9DaA74C55Db85Be"
+        "oeth:0x3b870Ea07b6511475Fa2422eA9DaA74C55Db85Be"
    }
```

```diff
    contract SemaphoreVerifier (0x3D40F9b177aFb9BF7e41999FFaF5aBA6cb3847eF) {
    +++ description: None
      address:
-        "0x3D40F9b177aFb9BF7e41999FFaF5aBA6cb3847eF"
+        "oeth:0x3D40F9b177aFb9BF7e41999FFaF5aBA6cb3847eF"
      implementationNames.0x3D40F9b177aFb9BF7e41999FFaF5aBA6cb3847eF:
-        "SemaphoreVerifier"
      implementationNames.oeth:0x3D40F9b177aFb9BF7e41999FFaF5aBA6cb3847eF:
+        "SemaphoreVerifier"
    }
```

```diff
    contract OpWorldID_Zero (0x42FF98C4E85212a5D31358ACbFe76a621b50fC02) {
    +++ description: None
      address:
-        "0x42FF98C4E85212a5D31358ACbFe76a621b50fC02"
+        "oeth:0x42FF98C4E85212a5D31358ACbFe76a621b50fC02"
      values.owner:
-        "0x86D26Ed31556EA7694BD0cC4e674D7526f70511a"
+        "oeth:0x86D26Ed31556EA7694BD0cC4e674D7526f70511a"
      values.verifier:
-        "0x5eB2c4a34A82a329C3E5D9F97F78Dc5446C3A9FB"
+        "oeth:0x5eB2c4a34A82a329C3E5D9F97F78Dc5446C3A9FB"
      implementationNames.0x42FF98C4E85212a5D31358ACbFe76a621b50fC02:
-        "OpWorldID"
      implementationNames.oeth:0x42FF98C4E85212a5D31358ACbFe76a621b50fC02:
+        "OpWorldID"
    }
```

```diff
    EOA  (0x541f3cc5772a64f2ba0a47e83236CcE2F089b188) {
    +++ description: None
      address:
-        "0x541f3cc5772a64f2ba0a47e83236CcE2F089b188"
+        "oeth:0x541f3cc5772a64f2ba0a47e83236CcE2F089b188"
    }
```

```diff
    EOA  (0x57c72EB3f74e3A1c95656253214A018818818ec3) {
    +++ description: None
      address:
-        "0x57c72EB3f74e3A1c95656253214A018818818ec3"
+        "oeth:0x57c72EB3f74e3A1c95656253214A018818818ec3"
    }
```

```diff
    contract WorldIDRouterV1 (0x57f928158C3EE7CDad1e4D8642503c4D0201f611) {
    +++ description: None
      address:
-        "0x57f928158C3EE7CDad1e4D8642503c4D0201f611"
+        "oeth:0x57f928158C3EE7CDad1e4D8642503c4D0201f611"
      values.$admin:
-        "0xc534a745bFfaF9466Ed7B47fA23B0177b99A3e77"
+        "oeth:0xc534a745bFfaF9466Ed7B47fA23B0177b99A3e77"
      values.$implementation:
-        "0x11cA3127182f7583EfC416a8771BD4d11Fae4334"
+        "oeth:0x11cA3127182f7583EfC416a8771BD4d11Fae4334"
      values.$pastUpgrades.0.2.0:
-        "0x11cA3127182f7583EfC416a8771BD4d11Fae4334"
+        "oeth:0x11cA3127182f7583EfC416a8771BD4d11Fae4334"
      values.owner:
-        "0xc534a745bFfaF9466Ed7B47fA23B0177b99A3e77"
+        "oeth:0xc534a745bFfaF9466Ed7B47fA23B0177b99A3e77"
      values.pendingOwner:
-        "0x0000000000000000000000000000000000000000"
+        "oeth:0x0000000000000000000000000000000000000000"
      values.routeFor.0:
-        "0x42FF98C4E85212a5D31358ACbFe76a621b50fC02"
+        "oeth:0x42FF98C4E85212a5D31358ACbFe76a621b50fC02"
      values.routeFor.1:
-        "0xB3E7771a6e2d7DD8C0666042B7a07C39b938eb7d"
+        "oeth:0xB3E7771a6e2d7DD8C0666042B7a07C39b938eb7d"
      implementationNames.0x57f928158C3EE7CDad1e4D8642503c4D0201f611:
-        "WorldIDRouter"
      implementationNames.0x11cA3127182f7583EfC416a8771BD4d11Fae4334:
-        "WorldIDRouterImplV1"
      implementationNames.oeth:0x57f928158C3EE7CDad1e4D8642503c4D0201f611:
+        "WorldIDRouter"
      implementationNames.oeth:0x11cA3127182f7583EfC416a8771BD4d11Fae4334:
+        "WorldIDRouterImplV1"
    }
```

```diff
    contract GnosisSafe (0x59a0f98345f54bAB245A043488ECE7FCecD7B596) {
    +++ description: None
      address:
-        "0x59a0f98345f54bAB245A043488ECE7FCecD7B596"
+        "oeth:0x59a0f98345f54bAB245A043488ECE7FCecD7B596"
      values.$implementation:
-        "0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552"
+        "oeth:0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552"
      values.$members.0:
-        "0xc534a745bFfaF9466Ed7B47fA23B0177b99A3e77"
+        "oeth:0xc534a745bFfaF9466Ed7B47fA23B0177b99A3e77"
      implementationNames.0x59a0f98345f54bAB245A043488ECE7FCecD7B596:
-        "GnosisSafeProxy"
      implementationNames.0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552:
-        "GnosisSafe"
      implementationNames.oeth:0x59a0f98345f54bAB245A043488ECE7FCecD7B596:
+        "GnosisSafeProxy"
      implementationNames.oeth:0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552:
+        "GnosisSafe"
    }
```

```diff
    contract SemaphoreVerifier (0x5eB2c4a34A82a329C3E5D9F97F78Dc5446C3A9FB) {
    +++ description: None
      address:
-        "0x5eB2c4a34A82a329C3E5D9F97F78Dc5446C3A9FB"
+        "oeth:0x5eB2c4a34A82a329C3E5D9F97F78Dc5446C3A9FB"
      implementationNames.0x5eB2c4a34A82a329C3E5D9F97F78Dc5446C3A9FB:
-        "SemaphoreVerifier"
      implementationNames.oeth:0x5eB2c4a34A82a329C3E5D9F97F78Dc5446C3A9FB:
+        "SemaphoreVerifier"
    }
```

```diff
    EOA  (0x5f39524Ed45091abDF3Caff7399c426D7c5F7F04) {
    +++ description: None
      address:
-        "0x5f39524Ed45091abDF3Caff7399c426D7c5F7F04"
+        "oeth:0x5f39524Ed45091abDF3Caff7399c426D7c5F7F04"
    }
```

```diff
    contract GnosisSafe (0x6BBf4f7478824482F0cE2861d003bf0Ef61CdBD6) {
    +++ description: None
      address:
-        "0x6BBf4f7478824482F0cE2861d003bf0Ef61CdBD6"
+        "oeth:0x6BBf4f7478824482F0cE2861d003bf0Ef61CdBD6"
      values.$implementation:
-        "0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552"
+        "oeth:0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552"
      values.$members.0:
-        "0xB6d1621B770A088C16bfec22bAd00F77D874d011"
+        "oeth:0xB6d1621B770A088C16bfec22bAd00F77D874d011"
      values.$members.1:
-        "0x2a7A69daDe8fed5c88b5894392ADc6c42da6d5c7"
+        "oeth:0x2a7A69daDe8fed5c88b5894392ADc6c42da6d5c7"
      implementationNames.0x6BBf4f7478824482F0cE2861d003bf0Ef61CdBD6:
-        "GnosisSafeProxy"
      implementationNames.0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552:
-        "GnosisSafe"
      implementationNames.oeth:0x6BBf4f7478824482F0cE2861d003bf0Ef61CdBD6:
+        "GnosisSafeProxy"
      implementationNames.oeth:0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552:
+        "GnosisSafe"
    }
```

```diff
    contract WLDGrant (0x6d8C0fc9C86a0506E9FC8B4D104A8F0a7EeC0674) {
    +++ description: None
      address:
-        "0x6d8C0fc9C86a0506E9FC8B4D104A8F0a7EeC0674"
+        "oeth:0x6d8C0fc9C86a0506E9FC8B4D104A8F0a7EeC0674"
      implementationNames.0x6d8C0fc9C86a0506E9FC8B4D104A8F0a7EeC0674:
-        "WLDGrant"
      implementationNames.oeth:0x6d8C0fc9C86a0506E9FC8B4D104A8F0a7EeC0674:
+        "WLDGrant"
    }
```

```diff
    EOA  (0x6EbD1dc80A9D608b7bC0F204E14909E7fFd25421) {
    +++ description: None
      address:
-        "0x6EbD1dc80A9D608b7bC0F204E14909E7fFd25421"
+        "oeth:0x6EbD1dc80A9D608b7bC0F204E14909E7fFd25421"
    }
```

```diff
    EOA  (0x70E755E15Ac5C6f8B2612F318a5CeDE11D77bEde) {
    +++ description: None
      address:
-        "0x70E755E15Ac5C6f8B2612F318a5CeDE11D77bEde"
+        "oeth:0x70E755E15Ac5C6f8B2612F318a5CeDE11D77bEde"
    }
```

```diff
    EOA  (0x79b998ded1f4503CE3A0A76993c72a65449f4590) {
    +++ description: None
      address:
-        "0x79b998ded1f4503CE3A0A76993c72a65449f4590"
+        "oeth:0x79b998ded1f4503CE3A0A76993c72a65449f4590"
    }
```

```diff
    contract RecurringGrantDrop (0x7B46fFbC976db2F94C3B3CDD9EbBe4ab50E3d77d) {
    +++ description: None
      address:
-        "0x7B46fFbC976db2F94C3B3CDD9EbBe4ab50E3d77d"
+        "oeth:0x7B46fFbC976db2F94C3B3CDD9EbBe4ab50E3d77d"
      values.grant:
-        "0x6d8C0fc9C86a0506E9FC8B4D104A8F0a7EeC0674"
+        "oeth:0x6d8C0fc9C86a0506E9FC8B4D104A8F0a7EeC0674"
      values.holder:
-        "0x7f26A7572E8B877654eeDcBc4E573657619FA3CE"
+        "oeth:0x7f26A7572E8B877654eeDcBc4E573657619FA3CE"
      values.owner:
-        "0x59a0f98345f54bAB245A043488ECE7FCecD7B596"
+        "oeth:0x59a0f98345f54bAB245A043488ECE7FCecD7B596"
      values.pendingOwner:
-        "0x0000000000000000000000000000000000000000"
+        "oeth:0x0000000000000000000000000000000000000000"
      values.token:
-        "0xdC6fF44d5d932Cbd77B52E5612Ba0529DC6226F1"
+        "oeth:0xdC6fF44d5d932Cbd77B52E5612Ba0529DC6226F1"
      values.worldIdRouter:
-        "0x57f928158C3EE7CDad1e4D8642503c4D0201f611"
+        "oeth:0x57f928158C3EE7CDad1e4D8642503c4D0201f611"
      implementationNames.0x7B46fFbC976db2F94C3B3CDD9EbBe4ab50E3d77d:
-        "RecurringGrantDrop"
      implementationNames.oeth:0x7B46fFbC976db2F94C3B3CDD9EbBe4ab50E3d77d:
+        "RecurringGrantDrop"
    }
```

```diff
    contract GnosisSafeL2 (0x7f26A7572E8B877654eeDcBc4E573657619FA3CE) {
    +++ description: None
      address:
-        "0x7f26A7572E8B877654eeDcBc4E573657619FA3CE"
+        "oeth:0x7f26A7572E8B877654eeDcBc4E573657619FA3CE"
      values.$implementation:
-        "0xfb1bffC9d739B8D520DaF37dF666da4C687191EA"
+        "oeth:0xfb1bffC9d739B8D520DaF37dF666da4C687191EA"
      values.$members.0:
-        "0x57c72EB3f74e3A1c95656253214A018818818ec3"
+        "oeth:0x57c72EB3f74e3A1c95656253214A018818818ec3"
      values.$members.1:
-        "0x59a0f98345f54bAB245A043488ECE7FCecD7B596"
+        "oeth:0x59a0f98345f54bAB245A043488ECE7FCecD7B596"
      values.$members.2:
-        "0xF85733e96Fa7791C5188C4B9740f0ff7d7bd2C09"
+        "oeth:0xF85733e96Fa7791C5188C4B9740f0ff7d7bd2C09"
      implementationNames.0x7f26A7572E8B877654eeDcBc4E573657619FA3CE:
-        "GnosisSafeProxy"
      implementationNames.0xfb1bffC9d739B8D520DaF37dF666da4C687191EA:
-        "GnosisSafeL2"
      implementationNames.oeth:0x7f26A7572E8B877654eeDcBc4E573657619FA3CE:
+        "GnosisSafeProxy"
      implementationNames.oeth:0xfb1bffC9d739B8D520DaF37dF666da4C687191EA:
+        "GnosisSafeL2"
    }
```

```diff
    contract WorldIDIdentityManagerV2 (0x86D26Ed31556EA7694BD0cC4e674D7526f70511a) {
    +++ description: None
      address:
-        "0x86D26Ed31556EA7694BD0cC4e674D7526f70511a"
+        "oeth:0x86D26Ed31556EA7694BD0cC4e674D7526f70511a"
      values.$admin:
-        "0x96d55BD9c8C4706FED243c1e15825FF7854920fA"
+        "oeth:0x96d55BD9c8C4706FED243c1e15825FF7854920fA"
      values.$implementation:
-        "0xa3d93B74214B80760288091675688E1EaD7838F2"
+        "oeth:0xa3d93B74214B80760288091675688E1EaD7838F2"
      values.$pastUpgrades.0.2.0:
-        "0x5198DD63b9cA3DcA4FD6f62f615e6989CA74F49B"
+        "oeth:0x5198DD63b9cA3DcA4FD6f62f615e6989CA74F49B"
      values.$pastUpgrades.1.2.0:
-        "0xa3d93B74214B80760288091675688E1EaD7838F2"
+        "oeth:0xa3d93B74214B80760288091675688E1EaD7838F2"
      values.getDeleteIdentitiesVerifierLookupTableAddress:
-        "0xfEab49fEEfefCB4b39dF640B66e7AcaC9B392A86"
+        "oeth:0xfEab49fEEfefCB4b39dF640B66e7AcaC9B392A86"
      values.getRegisterIdentitiesVerifierLookupTableAddress:
-        "0xA8710B3ba329fc7B80a49F7C82E889D1340C99fb"
+        "oeth:0xA8710B3ba329fc7B80a49F7C82E889D1340C99fb"
      values.getSemaphoreVerifierAddress:
-        "0x31b0e17db1D02B079177698dF2eD7037Fc1d0B2c"
+        "oeth:0x31b0e17db1D02B079177698dF2eD7037Fc1d0B2c"
      values.identityOperator:
-        "0x997c96386A7D0A491170742346570eb8E8A4E96E"
+        "oeth:0x997c96386A7D0A491170742346570eb8E8A4E96E"
      values.owner:
-        "0x96d55BD9c8C4706FED243c1e15825FF7854920fA"
+        "oeth:0x96d55BD9c8C4706FED243c1e15825FF7854920fA"
      values.pendingOwner:
-        "0x0000000000000000000000000000000000000000"
+        "oeth:0x0000000000000000000000000000000000000000"
      implementationNames.0x86D26Ed31556EA7694BD0cC4e674D7526f70511a:
-        "WorldIDIdentityManager"
      implementationNames.0xa3d93B74214B80760288091675688E1EaD7838F2:
-        "WorldIDIdentityManagerImplV2"
      implementationNames.oeth:0x86D26Ed31556EA7694BD0cC4e674D7526f70511a:
+        "WorldIDIdentityManager"
      implementationNames.oeth:0xa3d93B74214B80760288091675688E1EaD7838F2:
+        "WorldIDIdentityManagerImplV2"
    }
```

```diff
    EOA  (0x96d55BD9c8C4706FED243c1e15825FF7854920fA) {
    +++ description: None
      address:
-        "0x96d55BD9c8C4706FED243c1e15825FF7854920fA"
+        "oeth:0x96d55BD9c8C4706FED243c1e15825FF7854920fA"
    }
```

```diff
    EOA  (0x997c96386A7D0A491170742346570eb8E8A4E96E) {
    +++ description: None
      address:
-        "0x997c96386A7D0A491170742346570eb8E8A4E96E"
+        "oeth:0x997c96386A7D0A491170742346570eb8E8A4E96E"
    }
```

```diff
    contract Verifier (0xa6d85F3b3bE6Ff6DC52C3aaBe9A35d0ce252b79F) {
    +++ description: None
      address:
-        "0xa6d85F3b3bE6Ff6DC52C3aaBe9A35d0ce252b79F"
+        "oeth:0xa6d85F3b3bE6Ff6DC52C3aaBe9A35d0ce252b79F"
      implementationNames.0xa6d85F3b3bE6Ff6DC52C3aaBe9A35d0ce252b79F:
-        "Verifier"
      implementationNames.oeth:0xa6d85F3b3bE6Ff6DC52C3aaBe9A35d0ce252b79F:
+        "Verifier"
    }
```

```diff
    contract VerifierLookupTable (0xA8710B3ba329fc7B80a49F7C82E889D1340C99fb) {
    +++ description: None
      address:
-        "0xA8710B3ba329fc7B80a49F7C82E889D1340C99fb"
+        "oeth:0xA8710B3ba329fc7B80a49F7C82E889D1340C99fb"
      values.owner:
-        "0x96d55BD9c8C4706FED243c1e15825FF7854920fA"
+        "oeth:0x96d55BD9c8C4706FED243c1e15825FF7854920fA"
      values.pendingOwner:
-        "0x0000000000000000000000000000000000000000"
+        "oeth:0x0000000000000000000000000000000000000000"
      implementationNames.0xA8710B3ba329fc7B80a49F7C82E889D1340C99fb:
-        "VerifierLookupTable"
      implementationNames.oeth:0xA8710B3ba329fc7B80a49F7C82E889D1340C99fb:
+        "VerifierLookupTable"
    }
```

```diff
    contract OpWorldID_One (0xB3E7771a6e2d7DD8C0666042B7a07C39b938eb7d) {
    +++ description: A contract that manages the root history of the Semaphore identity merkle tree on Optimism.
      address:
-        "0xB3E7771a6e2d7DD8C0666042B7a07C39b938eb7d"
+        "oeth:0xB3E7771a6e2d7DD8C0666042B7a07C39b938eb7d"
      values.owner:
-        "0xa6d85F3b3bE6Ff6DC52C3aaBe9A35d0ce252b79F"
+        "oeth:0xa6d85F3b3bE6Ff6DC52C3aaBe9A35d0ce252b79F"
      values.verifier:
-        "0x3D40F9b177aFb9BF7e41999FFaF5aBA6cb3847eF"
+        "oeth:0x3D40F9b177aFb9BF7e41999FFaF5aBA6cb3847eF"
      implementationNames.0xB3E7771a6e2d7DD8C0666042B7a07C39b938eb7d:
-        "OpWorldID"
      implementationNames.oeth:0xB3E7771a6e2d7DD8C0666042B7a07C39b938eb7d:
+        "OpWorldID"
    }
```

```diff
    contract GnosisSafe (0xb67ac19693fB89880Ca5873f6a890E865b259c26) {
    +++ description: None
      address:
-        "0xb67ac19693fB89880Ca5873f6a890E865b259c26"
+        "oeth:0xb67ac19693fB89880Ca5873f6a890E865b259c26"
      values.$implementation:
-        "0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552"
+        "oeth:0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552"
      values.$members.0:
-        "0x79b998ded1f4503CE3A0A76993c72a65449f4590"
+        "oeth:0x79b998ded1f4503CE3A0A76993c72a65449f4590"
      values.$members.1:
-        "0x6EbD1dc80A9D608b7bC0F204E14909E7fFd25421"
+        "oeth:0x6EbD1dc80A9D608b7bC0F204E14909E7fFd25421"
      implementationNames.0xb67ac19693fB89880Ca5873f6a890E865b259c26:
-        "GnosisSafeProxy"
      implementationNames.0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552:
-        "GnosisSafe"
      implementationNames.oeth:0xb67ac19693fB89880Ca5873f6a890E865b259c26:
+        "GnosisSafeProxy"
      implementationNames.oeth:0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552:
+        "GnosisSafe"
    }
```

```diff
    EOA  (0xB6d1621B770A088C16bfec22bAd00F77D874d011) {
    +++ description: None
      address:
-        "0xB6d1621B770A088C16bfec22bAd00F77D874d011"
+        "oeth:0xB6d1621B770A088C16bfec22bAd00F77D874d011"
    }
```

```diff
    contract GnosisSafe (0xc534a745bFfaF9466Ed7B47fA23B0177b99A3e77) {
    +++ description: None
      address:
-        "0xc534a745bFfaF9466Ed7B47fA23B0177b99A3e77"
+        "oeth:0xc534a745bFfaF9466Ed7B47fA23B0177b99A3e77"
      values.$implementation:
-        "0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552"
+        "oeth:0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552"
      values.$members.0:
-        "0x0897316DFE7141DB1E182551c3e8077cf5dd9695"
+        "oeth:0x0897316DFE7141DB1E182551c3e8077cf5dd9695"
      values.$members.1:
-        "0xb67ac19693fB89880Ca5873f6a890E865b259c26"
+        "oeth:0xb67ac19693fB89880Ca5873f6a890E865b259c26"
      values.$members.2:
-        "0xF0fCdb037718E1B2b52f109Ae776713F9c1f730c"
+        "oeth:0xF0fCdb037718E1B2b52f109Ae776713F9c1f730c"
      values.$members.3:
-        "0x140C0227Cbe493A56868DDF4ea582E92ef3e9744"
+        "oeth:0x140C0227Cbe493A56868DDF4ea582E92ef3e9744"
      values.$members.4:
-        "0xF1d0E74D4a54aBfeA3777d89cef7f7445acd992A"
+        "oeth:0xF1d0E74D4a54aBfeA3777d89cef7f7445acd992A"
      values.$members.5:
-        "0x6BBf4f7478824482F0cE2861d003bf0Ef61CdBD6"
+        "oeth:0x6BBf4f7478824482F0cE2861d003bf0Ef61CdBD6"
      implementationNames.0xc534a745bFfaF9466Ed7B47fA23B0177b99A3e77:
-        "GnosisSafeProxy"
      implementationNames.0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552:
-        "GnosisSafe"
      implementationNames.oeth:0xc534a745bFfaF9466Ed7B47fA23B0177b99A3e77:
+        "GnosisSafeProxy"
      implementationNames.oeth:0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552:
+        "GnosisSafe"
    }
```

```diff
    contract WLD token (0xdC6fF44d5d932Cbd77B52E5612Ba0529DC6226F1) {
    +++ description: None
      address:
-        "0xdC6fF44d5d932Cbd77B52E5612Ba0529DC6226F1"
+        "oeth:0xdC6fF44d5d932Cbd77B52E5612Ba0529DC6226F1"
      values.bridge:
-        "0x4200000000000000000000000000000000000010"
+        "oeth:0x4200000000000000000000000000000000000010"
      values.BRIDGE:
-        "0x4200000000000000000000000000000000000010"
+        "oeth:0x4200000000000000000000000000000000000010"
      values.l1Token:
-        "0x163f8C2467924be0ae7B5347228CABF260318753"
+        "oeth:0x163f8C2467924be0ae7B5347228CABF260318753"
      values.l2Bridge:
-        "0x4200000000000000000000000000000000000010"
+        "oeth:0x4200000000000000000000000000000000000010"
      values.REMOTE_TOKEN:
-        "0x163f8C2467924be0ae7B5347228CABF260318753"
+        "oeth:0x163f8C2467924be0ae7B5347228CABF260318753"
      values.remoteToken:
-        "0x163f8C2467924be0ae7B5347228CABF260318753"
+        "oeth:0x163f8C2467924be0ae7B5347228CABF260318753"
      implementationNames.0xdC6fF44d5d932Cbd77B52E5612Ba0529DC6226F1:
-        "OptimismMintableERC20"
      implementationNames.oeth:0xdC6fF44d5d932Cbd77B52E5612Ba0529DC6226F1:
+        "OptimismMintableERC20"
    }
```

```diff
    contract GnosisSafe (0xF0fCdb037718E1B2b52f109Ae776713F9c1f730c) {
    +++ description: None
      address:
-        "0xF0fCdb037718E1B2b52f109Ae776713F9c1f730c"
+        "oeth:0xF0fCdb037718E1B2b52f109Ae776713F9c1f730c"
      values.$implementation:
-        "0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552"
+        "oeth:0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552"
      values.$members.0:
-        "0x3b870Ea07b6511475Fa2422eA9DaA74C55Db85Be"
+        "oeth:0x3b870Ea07b6511475Fa2422eA9DaA74C55Db85Be"
      implementationNames.0xF0fCdb037718E1B2b52f109Ae776713F9c1f730c:
-        "GnosisSafeProxy"
      implementationNames.0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552:
-        "GnosisSafe"
      implementationNames.oeth:0xF0fCdb037718E1B2b52f109Ae776713F9c1f730c:
+        "GnosisSafeProxy"
      implementationNames.oeth:0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552:
+        "GnosisSafe"
    }
```

```diff
    contract GnosisSafe (0xF1d0E74D4a54aBfeA3777d89cef7f7445acd992A) {
    +++ description: None
      address:
-        "0xF1d0E74D4a54aBfeA3777d89cef7f7445acd992A"
+        "oeth:0xF1d0E74D4a54aBfeA3777d89cef7f7445acd992A"
      values.$implementation:
-        "0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552"
+        "oeth:0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552"
      values.$members.0:
-        "0x70E755E15Ac5C6f8B2612F318a5CeDE11D77bEde"
+        "oeth:0x70E755E15Ac5C6f8B2612F318a5CeDE11D77bEde"
      implementationNames.0xF1d0E74D4a54aBfeA3777d89cef7f7445acd992A:
-        "GnosisSafeProxy"
      implementationNames.0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552:
-        "GnosisSafe"
      implementationNames.oeth:0xF1d0E74D4a54aBfeA3777d89cef7f7445acd992A:
+        "GnosisSafeProxy"
      implementationNames.oeth:0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552:
+        "GnosisSafe"
    }
```

```diff
    EOA  (0xF85733e96Fa7791C5188C4B9740f0ff7d7bd2C09) {
    +++ description: None
      address:
-        "0xF85733e96Fa7791C5188C4B9740f0ff7d7bd2C09"
+        "oeth:0xF85733e96Fa7791C5188C4B9740f0ff7d7bd2C09"
    }
```

```diff
    contract VerifierLookupTable (0xfEab49fEEfefCB4b39dF640B66e7AcaC9B392A86) {
    +++ description: None
      address:
-        "0xfEab49fEEfefCB4b39dF640B66e7AcaC9B392A86"
+        "oeth:0xfEab49fEEfefCB4b39dF640B66e7AcaC9B392A86"
      values.owner:
-        "0x96d55BD9c8C4706FED243c1e15825FF7854920fA"
+        "oeth:0x96d55BD9c8C4706FED243c1e15825FF7854920fA"
      values.pendingOwner:
-        "0x0000000000000000000000000000000000000000"
+        "oeth:0x0000000000000000000000000000000000000000"
      implementationNames.0xfEab49fEEfefCB4b39dF640B66e7AcaC9B392A86:
-        "VerifierLookupTable"
      implementationNames.oeth:0xfEab49fEEfefCB4b39dF640B66e7AcaC9B392A86:
+        "VerifierLookupTable"
    }
```

```diff
+   Status: CREATED
    contract GnosisSafe (0x0897316DFE7141DB1E182551c3e8077cf5dd9695)
    +++ description: None
```

```diff
+   Status: CREATED
    contract GnosisSafe (0x140C0227Cbe493A56868DDF4ea582E92ef3e9744)
    +++ description: None
```

```diff
+   Status: CREATED
    contract SemaphoreVerifier (0x31b0e17db1D02B079177698dF2eD7037Fc1d0B2c)
    +++ description: None
```

```diff
+   Status: CREATED
    contract SemaphoreVerifier (0x3D40F9b177aFb9BF7e41999FFaF5aBA6cb3847eF)
    +++ description: None
```

```diff
+   Status: CREATED
    contract OpWorldID_Zero (0x42FF98C4E85212a5D31358ACbFe76a621b50fC02)
    +++ description: None
```

```diff
+   Status: CREATED
    contract WorldIDRouterV1 (0x57f928158C3EE7CDad1e4D8642503c4D0201f611)
    +++ description: None
```

```diff
+   Status: CREATED
    contract GnosisSafe (0x59a0f98345f54bAB245A043488ECE7FCecD7B596)
    +++ description: None
```

```diff
+   Status: CREATED
    contract SemaphoreVerifier (0x5eB2c4a34A82a329C3E5D9F97F78Dc5446C3A9FB)
    +++ description: None
```

```diff
+   Status: CREATED
    contract GnosisSafe (0x6BBf4f7478824482F0cE2861d003bf0Ef61CdBD6)
    +++ description: None
```

```diff
+   Status: CREATED
    contract WLDGrant (0x6d8C0fc9C86a0506E9FC8B4D104A8F0a7EeC0674)
    +++ description: None
```

```diff
+   Status: CREATED
    contract RecurringGrantDrop (0x7B46fFbC976db2F94C3B3CDD9EbBe4ab50E3d77d)
    +++ description: None
```

```diff
+   Status: CREATED
    contract GnosisSafeL2 (0x7f26A7572E8B877654eeDcBc4E573657619FA3CE)
    +++ description: None
```

```diff
+   Status: CREATED
    contract WorldIDIdentityManagerV2 (0x86D26Ed31556EA7694BD0cC4e674D7526f70511a)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Verifier (0xa6d85F3b3bE6Ff6DC52C3aaBe9A35d0ce252b79F)
    +++ description: None
```

```diff
+   Status: CREATED
    contract VerifierLookupTable (0xA8710B3ba329fc7B80a49F7C82E889D1340C99fb)
    +++ description: None
```

```diff
+   Status: CREATED
    contract OpWorldID_One (0xB3E7771a6e2d7DD8C0666042B7a07C39b938eb7d)
    +++ description: A contract that manages the root history of the Semaphore identity merkle tree on Optimism.
```

```diff
+   Status: CREATED
    contract GnosisSafe (0xb67ac19693fB89880Ca5873f6a890E865b259c26)
    +++ description: None
```

```diff
+   Status: CREATED
    contract GnosisSafe (0xc534a745bFfaF9466Ed7B47fA23B0177b99A3e77)
    +++ description: None
```

```diff
+   Status: CREATED
    contract WLD token (0xdC6fF44d5d932Cbd77B52E5612Ba0529DC6226F1)
    +++ description: None
```

```diff
+   Status: CREATED
    contract GnosisSafe (0xF0fCdb037718E1B2b52f109Ae776713F9c1f730c)
    +++ description: None
```

```diff
+   Status: CREATED
    contract GnosisSafe (0xF1d0E74D4a54aBfeA3777d89cef7f7445acd992A)
    +++ description: None
```

```diff
+   Status: CREATED
    contract VerifierLookupTable (0xfEab49fEEfefCB4b39dF640B66e7AcaC9B392A86)
    +++ description: None
```

Generated with discovered.json: 0x950aafafc6542a49894b2e2ed5e903d239af5cdd

# Diff at Mon, 14 Jul 2025 12:47:08 GMT:

- chain: ethereum
- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@9f4300dad2f3d080cd56fa311d4a848556c74e72 block: 22438006
- current block number: 22438006

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22438006 (main branch discovery), not current.

```diff
    contract GnosisSafe (0x0897316DFE7141DB1E182551c3e8077cf5dd9695) {
    +++ description: None
      address:
-        "0x0897316DFE7141DB1E182551c3e8077cf5dd9695"
+        "eth:0x0897316DFE7141DB1E182551c3e8077cf5dd9695"
      values.$implementation:
-        "0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552"
+        "eth:0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552"
      values.$members.0:
-        "0x541f3cc5772a64f2ba0a47e83236CcE2F089b188"
+        "eth:0x541f3cc5772a64f2ba0a47e83236CcE2F089b188"
      implementationNames.0x0897316DFE7141DB1E182551c3e8077cf5dd9695:
-        "GnosisSafeProxy"
      implementationNames.0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552:
-        "GnosisSafe"
      implementationNames.eth:0x0897316DFE7141DB1E182551c3e8077cf5dd9695:
+        "GnosisSafeProxy"
      implementationNames.eth:0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552:
+        "GnosisSafe"
    }
```

```diff
    contract GnosisSafe (0x140C0227Cbe493A56868DDF4ea582E92ef3e9744) {
    +++ description: None
      address:
-        "0x140C0227Cbe493A56868DDF4ea582E92ef3e9744"
+        "eth:0x140C0227Cbe493A56868DDF4ea582E92ef3e9744"
      values.$implementation:
-        "0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552"
+        "eth:0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552"
      values.$members.0:
-        "0x5f39524Ed45091abDF3Caff7399c426D7c5F7F04"
+        "eth:0x5f39524Ed45091abDF3Caff7399c426D7c5F7F04"
      implementationNames.0x140C0227Cbe493A56868DDF4ea582E92ef3e9744:
-        "GnosisSafeProxy"
      implementationNames.0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552:
-        "GnosisSafe"
      implementationNames.eth:0x140C0227Cbe493A56868DDF4ea582E92ef3e9744:
+        "GnosisSafeProxy"
      implementationNames.eth:0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552:
+        "GnosisSafe"
    }
```

```diff
    EOA  (0x2a7A69daDe8fed5c88b5894392ADc6c42da6d5c7) {
    +++ description: None
      address:
-        "0x2a7A69daDe8fed5c88b5894392ADc6c42da6d5c7"
+        "eth:0x2a7A69daDe8fed5c88b5894392ADc6c42da6d5c7"
    }
```

```diff
    contract DeleteIdentitiesVerifierLookupTable (0x39CcB3b670651a14da8b3835f42924f49C2C5986) {
    +++ description: None
      address:
-        "0x39CcB3b670651a14da8b3835f42924f49C2C5986"
+        "eth:0x39CcB3b670651a14da8b3835f42924f49C2C5986"
      values.initialVerifiers.0:
-        "0xCA7d6822b9c6913B1A1416cE30eF14c4e7f0bFb1"
+        "eth:0xCA7d6822b9c6913B1A1416cE30eF14c4e7f0bFb1"
      values.initialVerifiers.1:
-        "0x43B68ccBa7FC726540768fD1537c3179283140ed"
+        "eth:0x43B68ccBa7FC726540768fD1537c3179283140ed"
      values.owner:
-        "0xc534a745bFfaF9466Ed7B47fA23B0177b99A3e77"
+        "eth:0xc534a745bFfaF9466Ed7B47fA23B0177b99A3e77"
      values.pendingOwner:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      implementationNames.0x39CcB3b670651a14da8b3835f42924f49C2C5986:
-        "VerifierLookupTable"
      implementationNames.eth:0x39CcB3b670651a14da8b3835f42924f49C2C5986:
+        "VerifierLookupTable"
    }
```

```diff
    EOA  (0x3b870Ea07b6511475Fa2422eA9DaA74C55Db85Be) {
    +++ description: None
      address:
-        "0x3b870Ea07b6511475Fa2422eA9DaA74C55Db85Be"
+        "eth:0x3b870Ea07b6511475Fa2422eA9DaA74C55Db85Be"
    }
```

```diff
    contract RegisterIdentitiesVerifierLookupTable (0x4055B6d4018e92e4d000865e61e87B57A4E5Ab49) {
    +++ description: None
      address:
-        "0x4055B6d4018e92e4d000865e61e87B57A4E5Ab49"
+        "eth:0x4055B6d4018e92e4d000865e61e87B57A4E5Ab49"
      values.additionalVerifiers.0:
-        "0xFC1c26E964F791f81a33F49D91f79456891AA1c1"
+        "eth:0xFC1c26E964F791f81a33F49D91f79456891AA1c1"
      values.additionalVerifiers.1:
-        "0xE44c83b9e1971A24EC698829297A0C4026B0CeF9"
+        "eth:0xE44c83b9e1971A24EC698829297A0C4026B0CeF9"
      values.initialVerifiers.1:
-        "0xb5f23A0c92F2f4aeE506FA3B1Cc2813820d13258"
+        "eth:0xb5f23A0c92F2f4aeE506FA3B1Cc2813820d13258"
      values.owner:
-        "0xc534a745bFfaF9466Ed7B47fA23B0177b99A3e77"
+        "eth:0xc534a745bFfaF9466Ed7B47fA23B0177b99A3e77"
      values.pendingOwner:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      implementationNames.0x4055B6d4018e92e4d000865e61e87B57A4E5Ab49:
-        "VerifierLookupTable"
      implementationNames.eth:0x4055B6d4018e92e4d000865e61e87B57A4E5Ab49:
+        "VerifierLookupTable"
    }
```

```diff
    contract DeleteVerifierSize100 (0x43B68ccBa7FC726540768fD1537c3179283140ed) {
    +++ description: None
      address:
-        "0x43B68ccBa7FC726540768fD1537c3179283140ed"
+        "eth:0x43B68ccBa7FC726540768fD1537c3179283140ed"
      implementationNames.0x43B68ccBa7FC726540768fD1537c3179283140ed:
-        "Verifier"
      implementationNames.eth:0x43B68ccBa7FC726540768fD1537c3179283140ed:
+        "Verifier"
    }
```

```diff
    EOA  (0x541f3cc5772a64f2ba0a47e83236CcE2F089b188) {
    +++ description: None
      address:
-        "0x541f3cc5772a64f2ba0a47e83236CcE2F089b188"
+        "eth:0x541f3cc5772a64f2ba0a47e83236CcE2F089b188"
    }
```

```diff
    EOA  (0x5f39524Ed45091abDF3Caff7399c426D7c5F7F04) {
    +++ description: None
      address:
-        "0x5f39524Ed45091abDF3Caff7399c426D7c5F7F04"
+        "eth:0x5f39524Ed45091abDF3Caff7399c426D7c5F7F04"
    }
```

```diff
    contract GnosisSafe (0x6BBf4f7478824482F0cE2861d003bf0Ef61CdBD6) {
    +++ description: None
      address:
-        "0x6BBf4f7478824482F0cE2861d003bf0Ef61CdBD6"
+        "eth:0x6BBf4f7478824482F0cE2861d003bf0Ef61CdBD6"
      values.$implementation:
-        "0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552"
+        "eth:0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552"
      values.$members.0:
-        "0xB6d1621B770A088C16bfec22bAd00F77D874d011"
+        "eth:0xB6d1621B770A088C16bfec22bAd00F77D874d011"
      values.$members.1:
-        "0x2a7A69daDe8fed5c88b5894392ADc6c42da6d5c7"
+        "eth:0x2a7A69daDe8fed5c88b5894392ADc6c42da6d5c7"
      implementationNames.0x6BBf4f7478824482F0cE2861d003bf0Ef61CdBD6:
-        "GnosisSafeProxy"
      implementationNames.0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552:
-        "GnosisSafe"
      implementationNames.eth:0x6BBf4f7478824482F0cE2861d003bf0Ef61CdBD6:
+        "GnosisSafeProxy"
      implementationNames.eth:0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552:
+        "GnosisSafe"
    }
```

```diff
    EOA  (0x6EbD1dc80A9D608b7bC0F204E14909E7fFd25421) {
    +++ description: None
      address:
-        "0x6EbD1dc80A9D608b7bC0F204E14909E7fFd25421"
+        "eth:0x6EbD1dc80A9D608b7bC0F204E14909E7fFd25421"
    }
```

```diff
    EOA  (0x79b998ded1f4503CE3A0A76993c72a65449f4590) {
    +++ description: None
      address:
-        "0x79b998ded1f4503CE3A0A76993c72a65449f4590"
+        "eth:0x79b998ded1f4503CE3A0A76993c72a65449f4590"
    }
```

```diff
    contract RegisterVerifierSize100 (0xb5f23A0c92F2f4aeE506FA3B1Cc2813820d13258) {
    +++ description: None
      address:
-        "0xb5f23A0c92F2f4aeE506FA3B1Cc2813820d13258"
+        "eth:0xb5f23A0c92F2f4aeE506FA3B1Cc2813820d13258"
      implementationNames.0xb5f23A0c92F2f4aeE506FA3B1Cc2813820d13258:
-        "Verifier"
      implementationNames.eth:0xb5f23A0c92F2f4aeE506FA3B1Cc2813820d13258:
+        "Verifier"
    }
```

```diff
    contract GnosisSafe (0xb67ac19693fB89880Ca5873f6a890E865b259c26) {
    +++ description: None
      address:
-        "0xb67ac19693fB89880Ca5873f6a890E865b259c26"
+        "eth:0xb67ac19693fB89880Ca5873f6a890E865b259c26"
      values.$implementation:
-        "0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552"
+        "eth:0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552"
      values.$members.0:
-        "0x79b998ded1f4503CE3A0A76993c72a65449f4590"
+        "eth:0x79b998ded1f4503CE3A0A76993c72a65449f4590"
      values.$members.1:
-        "0x6EbD1dc80A9D608b7bC0F204E14909E7fFd25421"
+        "eth:0x6EbD1dc80A9D608b7bC0F204E14909E7fFd25421"
      implementationNames.0xb67ac19693fB89880Ca5873f6a890E865b259c26:
-        "GnosisSafeProxy"
      implementationNames.0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552:
-        "GnosisSafe"
      implementationNames.eth:0xb67ac19693fB89880Ca5873f6a890E865b259c26:
+        "GnosisSafeProxy"
      implementationNames.eth:0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552:
+        "GnosisSafe"
    }
```

```diff
    EOA  (0xB6d1621B770A088C16bfec22bAd00F77D874d011) {
    +++ description: None
      address:
-        "0xB6d1621B770A088C16bfec22bAd00F77D874d011"
+        "eth:0xB6d1621B770A088C16bfec22bAd00F77D874d011"
    }
```

```diff
    contract GnosisSafe (0xc534a745bFfaF9466Ed7B47fA23B0177b99A3e77) {
    +++ description: None
      address:
-        "0xc534a745bFfaF9466Ed7B47fA23B0177b99A3e77"
+        "eth:0xc534a745bFfaF9466Ed7B47fA23B0177b99A3e77"
      values.$implementation:
-        "0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552"
+        "eth:0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552"
      values.$members.0:
-        "0x0897316DFE7141DB1E182551c3e8077cf5dd9695"
+        "eth:0x0897316DFE7141DB1E182551c3e8077cf5dd9695"
      values.$members.1:
-        "0xb67ac19693fB89880Ca5873f6a890E865b259c26"
+        "eth:0xb67ac19693fB89880Ca5873f6a890E865b259c26"
      values.$members.2:
-        "0xF0fCdb037718E1B2b52f109Ae776713F9c1f730c"
+        "eth:0xF0fCdb037718E1B2b52f109Ae776713F9c1f730c"
      values.$members.3:
-        "0x140C0227Cbe493A56868DDF4ea582E92ef3e9744"
+        "eth:0x140C0227Cbe493A56868DDF4ea582E92ef3e9744"
      values.$members.4:
-        "0x6BBf4f7478824482F0cE2861d003bf0Ef61CdBD6"
+        "eth:0x6BBf4f7478824482F0cE2861d003bf0Ef61CdBD6"
      implementationNames.0xc534a745bFfaF9466Ed7B47fA23B0177b99A3e77:
-        "GnosisSafeProxy"
      implementationNames.0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552:
-        "GnosisSafe"
      implementationNames.eth:0xc534a745bFfaF9466Ed7B47fA23B0177b99A3e77:
+        "GnosisSafeProxy"
      implementationNames.eth:0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552:
+        "GnosisSafe"
    }
```

```diff
    contract DeleteVerifierSize10 (0xCA7d6822b9c6913B1A1416cE30eF14c4e7f0bFb1) {
    +++ description: None
      address:
-        "0xCA7d6822b9c6913B1A1416cE30eF14c4e7f0bFb1"
+        "eth:0xCA7d6822b9c6913B1A1416cE30eF14c4e7f0bFb1"
      implementationNames.0xCA7d6822b9c6913B1A1416cE30eF14c4e7f0bFb1:
-        "Verifier"
      implementationNames.eth:0xCA7d6822b9c6913B1A1416cE30eF14c4e7f0bFb1:
+        "Verifier"
    }
```

```diff
    contract SemaphoreVerifier (0xcDBbcd1cb0B642F8E324aB29C73A967b0C80Bad5) {
    +++ description: None
      address:
-        "0xcDBbcd1cb0B642F8E324aB29C73A967b0C80Bad5"
+        "eth:0xcDBbcd1cb0B642F8E324aB29C73A967b0C80Bad5"
      implementationNames.0xcDBbcd1cb0B642F8E324aB29C73A967b0C80Bad5:
-        "SemaphoreVerifier"
      implementationNames.eth:0xcDBbcd1cb0B642F8E324aB29C73A967b0C80Bad5:
+        "SemaphoreVerifier"
    }
```

```diff
    EOA  (0xE2DA046340e00264C4F0443243a0565007AE08AC) {
    +++ description: None
      address:
-        "0xE2DA046340e00264C4F0443243a0565007AE08AC"
+        "eth:0xE2DA046340e00264C4F0443243a0565007AE08AC"
    }
```

```diff
    contract RegisterVerifierSize1200 (0xE44c83b9e1971A24EC698829297A0C4026B0CeF9) {
    +++ description: None
      address:
-        "0xE44c83b9e1971A24EC698829297A0C4026B0CeF9"
+        "eth:0xE44c83b9e1971A24EC698829297A0C4026B0CeF9"
      implementationNames.0xE44c83b9e1971A24EC698829297A0C4026B0CeF9:
-        "Verifier"
      implementationNames.eth:0xE44c83b9e1971A24EC698829297A0C4026B0CeF9:
+        "Verifier"
    }
```

```diff
    contract GnosisSafe (0xF0fCdb037718E1B2b52f109Ae776713F9c1f730c) {
    +++ description: None
      address:
-        "0xF0fCdb037718E1B2b52f109Ae776713F9c1f730c"
+        "eth:0xF0fCdb037718E1B2b52f109Ae776713F9c1f730c"
      values.$implementation:
-        "0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552"
+        "eth:0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552"
      values.$members.0:
-        "0x3b870Ea07b6511475Fa2422eA9DaA74C55Db85Be"
+        "eth:0x3b870Ea07b6511475Fa2422eA9DaA74C55Db85Be"
      implementationNames.0xF0fCdb037718E1B2b52f109Ae776713F9c1f730c:
-        "GnosisSafeProxy"
      implementationNames.0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552:
-        "GnosisSafe"
      implementationNames.eth:0xF0fCdb037718E1B2b52f109Ae776713F9c1f730c:
+        "GnosisSafeProxy"
      implementationNames.eth:0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552:
+        "GnosisSafe"
    }
```

```diff
    contract WorldIdIdentityManager2 (0xf7134CE138832c1456F2a91D64621eE90c2bddEa) {
    +++ description: Does what it says: Manages identities for Worldcoin. The identityOperator can register or delete identities by submitting zk proofs.
      address:
-        "0xf7134CE138832c1456F2a91D64621eE90c2bddEa"
+        "eth:0xf7134CE138832c1456F2a91D64621eE90c2bddEa"
      values.$admin:
-        "0xc534a745bFfaF9466Ed7B47fA23B0177b99A3e77"
+        "eth:0xc534a745bFfaF9466Ed7B47fA23B0177b99A3e77"
      values.$implementation:
-        "0x521e8FB3A32Ea44237DC8b1E506dd78accFDf8Bd"
+        "eth:0x521e8FB3A32Ea44237DC8b1E506dd78accFDf8Bd"
      values.$pastUpgrades.0.2.0:
-        "0xa3cD15EBed6075E33a54483C59818bC43D57c556"
+        "eth:0xa3cD15EBed6075E33a54483C59818bC43D57c556"
      values.$pastUpgrades.1.2.0:
-        "0x2Ad412A1dF96434Eed0779D2dB4A8694a06132f8"
+        "eth:0x2Ad412A1dF96434Eed0779D2dB4A8694a06132f8"
      values.$pastUpgrades.2.2.0:
-        "0x521e8FB3A32Ea44237DC8b1E506dd78accFDf8Bd"
+        "eth:0x521e8FB3A32Ea44237DC8b1E506dd78accFDf8Bd"
      values.getDeleteIdentitiesVerifierLookupTableAddress:
-        "0x39CcB3b670651a14da8b3835f42924f49C2C5986"
+        "eth:0x39CcB3b670651a14da8b3835f42924f49C2C5986"
      values.getRegisterIdentitiesVerifierLookupTableAddress:
-        "0x4055B6d4018e92e4d000865e61e87B57A4E5Ab49"
+        "eth:0x4055B6d4018e92e4d000865e61e87B57A4E5Ab49"
      values.getSemaphoreVerifierAddress:
-        "0xcDBbcd1cb0B642F8E324aB29C73A967b0C80Bad5"
+        "eth:0xcDBbcd1cb0B642F8E324aB29C73A967b0C80Bad5"
+++ description: Can call functions (manage identities) in the WorldIdIdentityManager2 implementation
      values.identityOperator:
-        "0xE2DA046340e00264C4F0443243a0565007AE08AC"
+        "eth:0xE2DA046340e00264C4F0443243a0565007AE08AC"
      values.owner:
-        "0xc534a745bFfaF9466Ed7B47fA23B0177b99A3e77"
+        "eth:0xc534a745bFfaF9466Ed7B47fA23B0177b99A3e77"
      values.pendingOwner:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      implementationNames.0xf7134CE138832c1456F2a91D64621eE90c2bddEa:
-        "WorldIDIdentityManager"
      implementationNames.0x521e8FB3A32Ea44237DC8b1E506dd78accFDf8Bd:
-        "WorldIDIdentityManagerImplV2"
      implementationNames.eth:0xf7134CE138832c1456F2a91D64621eE90c2bddEa:
+        "WorldIDIdentityManager"
      implementationNames.eth:0x521e8FB3A32Ea44237DC8b1E506dd78accFDf8Bd:
+        "WorldIDIdentityManagerImplV2"
    }
```

```diff
    contract RegisterVerifierSize600 (0xFC1c26E964F791f81a33F49D91f79456891AA1c1) {
    +++ description: None
      address:
-        "0xFC1c26E964F791f81a33F49D91f79456891AA1c1"
+        "eth:0xFC1c26E964F791f81a33F49D91f79456891AA1c1"
      implementationNames.0xFC1c26E964F791f81a33F49D91f79456891AA1c1:
-        "Verifier"
      implementationNames.eth:0xFC1c26E964F791f81a33F49D91f79456891AA1c1:
+        "Verifier"
    }
```

```diff
+   Status: CREATED
    contract GnosisSafe (0x0897316DFE7141DB1E182551c3e8077cf5dd9695)
    +++ description: None
```

```diff
+   Status: CREATED
    contract GnosisSafe (0x140C0227Cbe493A56868DDF4ea582E92ef3e9744)
    +++ description: None
```

```diff
+   Status: CREATED
    contract DeleteIdentitiesVerifierLookupTable (0x39CcB3b670651a14da8b3835f42924f49C2C5986)
    +++ description: None
```

```diff
+   Status: CREATED
    contract RegisterIdentitiesVerifierLookupTable (0x4055B6d4018e92e4d000865e61e87B57A4E5Ab49)
    +++ description: None
```

```diff
+   Status: CREATED
    contract DeleteVerifierSize100 (0x43B68ccBa7FC726540768fD1537c3179283140ed)
    +++ description: None
```

```diff
+   Status: CREATED
    contract GnosisSafe (0x6BBf4f7478824482F0cE2861d003bf0Ef61CdBD6)
    +++ description: None
```

```diff
+   Status: CREATED
    contract RegisterVerifierSize100 (0xb5f23A0c92F2f4aeE506FA3B1Cc2813820d13258)
    +++ description: None
```

```diff
+   Status: CREATED
    contract GnosisSafe (0xb67ac19693fB89880Ca5873f6a890E865b259c26)
    +++ description: None
```

```diff
+   Status: CREATED
    contract GnosisSafe (0xc534a745bFfaF9466Ed7B47fA23B0177b99A3e77)
    +++ description: None
```

```diff
+   Status: CREATED
    contract DeleteVerifierSize10 (0xCA7d6822b9c6913B1A1416cE30eF14c4e7f0bFb1)
    +++ description: None
```

```diff
+   Status: CREATED
    contract SemaphoreVerifier (0xcDBbcd1cb0B642F8E324aB29C73A967b0C80Bad5)
    +++ description: None
```

```diff
+   Status: CREATED
    contract RegisterVerifierSize1200 (0xE44c83b9e1971A24EC698829297A0C4026B0CeF9)
    +++ description: None
```

```diff
+   Status: CREATED
    contract GnosisSafe (0xF0fCdb037718E1B2b52f109Ae776713F9c1f730c)
    +++ description: None
```

```diff
+   Status: CREATED
    contract WorldIdIdentityManager2 (0xf7134CE138832c1456F2a91D64621eE90c2bddEa)
    +++ description: Does what it says: Manages identities for Worldcoin. The identityOperator can register or delete identities by submitting zk proofs.
```

```diff
+   Status: CREATED
    contract RegisterVerifierSize600 (0xFC1c26E964F791f81a33F49D91f79456891AA1c1)
    +++ description: None
```

Generated with discovered.json: 0xabcbd421b763e4fb3312b3651f4a3a2714393682

# Diff at Fri, 04 Jul 2025 12:19:28 GMT:

- chain: optimism
- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@1f56dc47fe915564d4555300304da4d3bcbc087f block: 133912814
- current block number: 133912814

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 133912814 (main branch discovery), not current.

```diff
    EOA  (0x96d55BD9c8C4706FED243c1e15825FF7854920fA) {
    +++ description: None
      receivedPermissions.0.from:
-        "optimism:0x86D26Ed31556EA7694BD0cC4e674D7526f70511a"
+        "oeth:0x86D26Ed31556EA7694BD0cC4e674D7526f70511a"
    }
```

```diff
    contract GnosisSafe (0xc534a745bFfaF9466Ed7B47fA23B0177b99A3e77) {
    +++ description: None
      receivedPermissions.0.from:
-        "optimism:0x57f928158C3EE7CDad1e4D8642503c4D0201f611"
+        "oeth:0x57f928158C3EE7CDad1e4D8642503c4D0201f611"
    }
```

Generated with discovered.json: 0x530040c0e8239d66d75d114ba3de6d05219ba306

# Diff at Fri, 04 Jul 2025 12:19:28 GMT:

- chain: ethereum
- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@1f56dc47fe915564d4555300304da4d3bcbc087f block: 22438006
- current block number: 22438006

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22438006 (main branch discovery), not current.

```diff
    contract GnosisSafe (0xc534a745bFfaF9466Ed7B47fA23B0177b99A3e77) {
    +++ description: None
      receivedPermissions.0.from:
-        "ethereum:0xf7134CE138832c1456F2a91D64621eE90c2bddEa"
+        "eth:0xf7134CE138832c1456F2a91D64621eE90c2bddEa"
    }
```

Generated with discovered.json: 0x3f2e690dcb1f40b036f0c45c73956c1d31536aa1

# Diff at Fri, 23 May 2025 09:41:16 GMT:

- chain: optimism
- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@69cd181abbc3c830a6caf2f4429b37cae72ffdb8 block: 133912814
- current block number: 133912814

## Description

Introduced .role field on each permission, defaulting to field name on which it was defined (with '.' prefix)

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 133912814 (main branch discovery), not current.

```diff
    EOA  (0x96d55BD9c8C4706FED243c1e15825FF7854920fA) {
    +++ description: None
      receivedPermissions.0.role:
+        "admin"
    }
```

```diff
    contract GnosisSafe (0xc534a745bFfaF9466Ed7B47fA23B0177b99A3e77) {
    +++ description: None
      receivedPermissions.0.role:
+        "admin"
    }
```

Generated with discovered.json: 0x59b8e7c66c6178ae200c2bd8f47c9dfcfb3219de

# Diff at Fri, 23 May 2025 09:41:16 GMT:

- chain: ethereum
- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@69cd181abbc3c830a6caf2f4429b37cae72ffdb8 block: 22438006
- current block number: 22438006

## Description

Introduced .role field on each permission, defaulting to field name on which it was defined (with '.' prefix)

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22438006 (main branch discovery), not current.

```diff
    contract GnosisSafe (0xc534a745bFfaF9466Ed7B47fA23B0177b99A3e77) {
    +++ description: None
      receivedPermissions.0.role:
+        "admin"
    }
```

Generated with discovered.json: 0xc4d732713fc74a2923c7c91855b30c2747e3cb2d

# Diff at Thu, 08 May 2025 10:05:19 GMT:

- chain: ethereum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@8e1926142ab0c57cc131de4d8da307e13d9af54d block: 22418260
- current block number: 22438006

## Description

MS member change.

## Watched changes

```diff
    contract GnosisSafe (0xc534a745bFfaF9466Ed7B47fA23B0177b99A3e77) {
    +++ description: None
      values.$members.5:
-        "0xb67ac19693fB89880Ca5873f6a890E865b259c26"
      values.$members.4:
-        "0x6BBf4f7478824482F0cE2861d003bf0Ef61CdBD6"
+        "0xb67ac19693fB89880Ca5873f6a890E865b259c26"
      values.$members.3:
-        "0xF1d0E74D4a54aBfeA3777d89cef7f7445acd992A"
+        "0x6BBf4f7478824482F0cE2861d003bf0Ef61CdBD6"
      values.multisigThreshold:
-        "4 of 6 (67%)"
+        "4 of 5 (80%)"
    }
```

```diff
-   Status: DELETED
    contract GnosisSafe (0xF1d0E74D4a54aBfeA3777d89cef7f7445acd992A)
    +++ description: None
```

## Source code changes

```diff
.../GnosisSafe.sol => /dev/null                    | 953 ---------------------
 .../GnosisSafeProxy.p.sol => /dev/null             |  35 -
 2 files changed, 988 deletions(-)
```

Generated with discovered.json: 0x53597b6099bb249886615946b724b5f695607f12

# Diff at Tue, 06 May 2025 10:57:06 GMT:

- chain: optimism
- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@3a394513711f46aa66871603365b6afb40a79057 block: 133912814
- current block number: 133912814

## Description

Marking EOAs if they control the highest number of upgrade permissions in the project.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 133912814 (main branch discovery), not current.

```diff
    EOA  (0x96d55BD9c8C4706FED243c1e15825FF7854920fA) {
    +++ description: None
      controlsMajorityOfUpgradePermissions:
+        true
    }
```

Generated with discovered.json: 0x6df0c7e4731464de15fe1e1f2fe6894c5ea70823

# Diff at Mon, 05 May 2025 14:54:32 GMT:

- chain: ethereum
- author: Sergey Shemyakov (<sergey.shemyakov@l2beat.com>)
- comparing to: main@277ef8f5adf45205d5b920c1ebfc0f7db8d19aff block: 22208595
- current block number: 22418260

## Description

Added a known 4/6 multisig as the second member of another known 1/2 multisig.

## Watched changes

```diff
    contract GnosisSafe (0xF1d0E74D4a54aBfeA3777d89cef7f7445acd992A) {
    +++ description: None
      values.$members.1:
+        "0xc534a745bFfaF9466Ed7B47fA23B0177b99A3e77"
      values.multisigThreshold:
-        "1 of 1 (100%)"
+        "1 of 2 (50%)"
    }
```

Generated with discovered.json: 0x1ac9881130158424f217c3fc5b06d541b2220e0b

# Diff at Tue, 29 Apr 2025 08:19:25 GMT:

- chain: optimism
- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@ef7477af00fe0b57a2f7cacf7e958c12494af662 block: 133912814
- current block number: 133912814

## Description

Field .issuedPermissions is removed from the output as no longer needed. Added 'permissionsConfigHash' due to refactoring of the modelling process (into a separate command).

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 133912814 (main branch discovery), not current.

```diff
    contract WorldIDRouterV1 (0x57f928158C3EE7CDad1e4D8642503c4D0201f611) {
    +++ description: None
      issuedPermissions:
-        [{"permission":"upgrade","to":"0xc534a745bFfaF9466Ed7B47fA23B0177b99A3e77","via":[]}]
    }
```

```diff
    contract WorldIDIdentityManagerV2 (0x86D26Ed31556EA7694BD0cC4e674D7526f70511a) {
    +++ description: None
      issuedPermissions:
-        [{"permission":"upgrade","to":"0x96d55BD9c8C4706FED243c1e15825FF7854920fA","via":[]}]
    }
```

Generated with discovered.json: 0xb7e671e8630b0eb8b974b8f85599fca8f6599843

# Diff at Tue, 29 Apr 2025 08:19:25 GMT:

- chain: ethereum
- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@ef7477af00fe0b57a2f7cacf7e958c12494af662 block: 22208595
- current block number: 22208595

## Description

Field .issuedPermissions is removed from the output as no longer needed. Added 'permissionsConfigHash' due to refactoring of the modelling process (into a separate command).

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22208595 (main branch discovery), not current.

```diff
    contract WorldIdIdentityManager2 (0xf7134CE138832c1456F2a91D64621eE90c2bddEa) {
    +++ description: Does what it says: Manages identities for Worldcoin. The identityOperator can register or delete identities by submitting zk proofs.
      issuedPermissions:
-        [{"permission":"upgrade","to":"0xc534a745bFfaF9466Ed7B47fA23B0177b99A3e77","via":[]}]
    }
```

Generated with discovered.json: 0x754c15aad56c5926a59d08f345d95ddf87a65851

# Diff at Sun, 06 Apr 2025 08:11:53 GMT:

- chain: ethereum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@02dea11f7707601873600e275c4e2b7792c1a190 block: 22166651
- current block number: 22208595

## Description

owner/admin changes.

## Watched changes

```diff
    contract DeleteIdentitiesVerifierLookupTable (0x39CcB3b670651a14da8b3835f42924f49C2C5986) {
    +++ description: None
      values.owner:
-        "0x96d55BD9c8C4706FED243c1e15825FF7854920fA"
+        "0xc534a745bFfaF9466Ed7B47fA23B0177b99A3e77"
      values.pendingOwner:
-        "0xc534a745bFfaF9466Ed7B47fA23B0177b99A3e77"
+        "0x0000000000000000000000000000000000000000"
    }
```

```diff
    contract RegisterIdentitiesVerifierLookupTable (0x4055B6d4018e92e4d000865e61e87B57A4E5Ab49) {
    +++ description: None
      values.owner:
-        "0x96d55BD9c8C4706FED243c1e15825FF7854920fA"
+        "0xc534a745bFfaF9466Ed7B47fA23B0177b99A3e77"
      values.pendingOwner:
-        "0xc534a745bFfaF9466Ed7B47fA23B0177b99A3e77"
+        "0x0000000000000000000000000000000000000000"
    }
```

```diff
    contract GnosisSafe (0xc534a745bFfaF9466Ed7B47fA23B0177b99A3e77) {
    +++ description: None
      receivedPermissions:
+        [{"permission":"upgrade","from":"0xf7134CE138832c1456F2a91D64621eE90c2bddEa"}]
    }
```

```diff
    contract WorldIdIdentityManager2 (0xf7134CE138832c1456F2a91D64621eE90c2bddEa) {
    +++ description: Does what it says: Manages identities for Worldcoin. The identityOperator can register or delete identities by submitting zk proofs.
      issuedPermissions.0.to:
-        "0x96d55BD9c8C4706FED243c1e15825FF7854920fA"
+        "0xc534a745bFfaF9466Ed7B47fA23B0177b99A3e77"
      values.$admin:
-        "0x96d55BD9c8C4706FED243c1e15825FF7854920fA"
+        "0xc534a745bFfaF9466Ed7B47fA23B0177b99A3e77"
      values.owner:
-        "0x96d55BD9c8C4706FED243c1e15825FF7854920fA"
+        "0xc534a745bFfaF9466Ed7B47fA23B0177b99A3e77"
      values.pendingOwner:
-        "0xc534a745bFfaF9466Ed7B47fA23B0177b99A3e77"
+        "0x0000000000000000000000000000000000000000"
    }
```

Generated with discovered.json: 0x165997887c4474d9cfa708d12bff2f7ac635e166

# Diff at Mon, 31 Mar 2025 12:33:36 GMT:

- chain: optimism
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@71ffebe835be10b6d5d09ef65aa19b910de8a2ec block: 127729542
- current block number: 133912814

## Description

Owner change.

## Watched changes

```diff
    contract WorldIDRouterV1 (0x57f928158C3EE7CDad1e4D8642503c4D0201f611) {
    +++ description: None
      issuedPermissions.0.to:
-        "0x96d55BD9c8C4706FED243c1e15825FF7854920fA"
+        "0xc534a745bFfaF9466Ed7B47fA23B0177b99A3e77"
      values.$admin:
-        "0x96d55BD9c8C4706FED243c1e15825FF7854920fA"
+        "0xc534a745bFfaF9466Ed7B47fA23B0177b99A3e77"
      values.owner:
-        "0x96d55BD9c8C4706FED243c1e15825FF7854920fA"
+        "0xc534a745bFfaF9466Ed7B47fA23B0177b99A3e77"
    }
```

```diff
    contract undefined (0x96d55BD9c8C4706FED243c1e15825FF7854920fA) {
    +++ description: None
      receivedPermissions.1:
-        {"permission":"upgrade","from":"0x57f928158C3EE7CDad1e4D8642503c4D0201f611"}
    }
```

```diff
    contract GnosisSafe (0xc534a745bFfaF9466Ed7B47fA23B0177b99A3e77) {
    +++ description: None
      receivedPermissions:
+        [{"permission":"upgrade","from":"0x57f928158C3EE7CDad1e4D8642503c4D0201f611"}]
    }
```

Generated with discovered.json: 0x399f8835567250b9edd2110bf8da23f343a0a2f2

# Diff at Mon, 31 Mar 2025 11:38:28 GMT:

- chain: ethereum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@71ffebe835be10b6d5d09ef65aa19b910de8a2ec block: 21845003
- current block number: 22166651

## Description

New pending owners: moving from EOA to GnosisSafe.

## Watched changes

```diff
    contract DeleteIdentitiesVerifierLookupTable (0x39CcB3b670651a14da8b3835f42924f49C2C5986) {
    +++ description: None
      values.pendingOwner:
-        "0x0000000000000000000000000000000000000000"
+        "0xc534a745bFfaF9466Ed7B47fA23B0177b99A3e77"
    }
```

```diff
    contract RegisterIdentitiesVerifierLookupTable (0x4055B6d4018e92e4d000865e61e87B57A4E5Ab49) {
    +++ description: None
      values.pendingOwner:
-        "0x0000000000000000000000000000000000000000"
+        "0xc534a745bFfaF9466Ed7B47fA23B0177b99A3e77"
    }
```

```diff
    contract WorldIdIdentityManager2 (0xf7134CE138832c1456F2a91D64621eE90c2bddEa) {
    +++ description: Does what it says: Manages identities for Worldcoin. The identityOperator can register or delete identities by submitting zk proofs.
      values.pendingOwner:
-        "0x0000000000000000000000000000000000000000"
+        "0xc534a745bFfaF9466Ed7B47fA23B0177b99A3e77"
    }
```

```diff
+   Status: CREATED
    contract GnosisSafe (0x0897316DFE7141DB1E182551c3e8077cf5dd9695)
    +++ description: None
```

```diff
+   Status: CREATED
    contract GnosisSafe (0x140C0227Cbe493A56868DDF4ea582E92ef3e9744)
    +++ description: None
```

```diff
+   Status: CREATED
    contract GnosisSafe (0x6BBf4f7478824482F0cE2861d003bf0Ef61CdBD6)
    +++ description: None
```

```diff
+   Status: CREATED
    contract GnosisSafe (0xb67ac19693fB89880Ca5873f6a890E865b259c26)
    +++ description: None
```

```diff
+   Status: CREATED
    contract GnosisSafe (0xc534a745bFfaF9466Ed7B47fA23B0177b99A3e77)
    +++ description: None
```

```diff
+   Status: CREATED
    contract GnosisSafe (0xF0fCdb037718E1B2b52f109Ae776713F9c1f730c)
    +++ description: None
```

```diff
+   Status: CREATED
    contract GnosisSafe (0xF1d0E74D4a54aBfeA3777d89cef7f7445acd992A)
    +++ description: None
```

## Source code changes

```diff
.../GnosisSafe.sol                                 | 953 +++++++++++++++++++++
 .../GnosisSafeProxy.p.sol                          |  35 +
 .../GnosisSafe.sol                                 | 953 +++++++++++++++++++++
 .../GnosisSafeProxy.p.sol                          |  35 +
 .../GnosisSafe.sol                                 | 953 +++++++++++++++++++++
 .../GnosisSafeProxy.p.sol                          |  35 +
 .../GnosisSafe.sol                                 | 953 +++++++++++++++++++++
 .../GnosisSafeProxy.p.sol                          |  35 +
 .../GnosisSafe.sol                                 | 953 +++++++++++++++++++++
 .../GnosisSafeProxy.p.sol                          |  35 +
 .../GnosisSafe.sol                                 | 953 +++++++++++++++++++++
 .../GnosisSafeProxy.p.sol                          |  35 +
 .../GnosisSafe.sol                                 | 953 +++++++++++++++++++++
 .../GnosisSafeProxy.p.sol                          |  35 +
 14 files changed, 6916 insertions(+)
```

Generated with discovered.json: 0x064db87ea1a5d52f6b2f76f1c2f5fbc993e166f4

# Diff at Tue, 04 Mar 2025 10:40:39 GMT:

- chain: optimism
- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@98d260b45fe0d2195ce5e629bd7b200c8706e8ba block: 127729542
- current block number: 127729542

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 127729542 (main branch discovery), not current.

```diff
    contract GnosisSafe (0x0897316DFE7141DB1E182551c3e8077cf5dd9695) {
    +++ description: None
      sinceBlock:
+        107167869
    }
```

```diff
    contract GnosisSafe (0x140C0227Cbe493A56868DDF4ea582E92ef3e9744) {
    +++ description: None
      sinceBlock:
+        107167741
    }
```

```diff
    contract SemaphoreVerifier (0x31b0e17db1D02B079177698dF2eD7037Fc1d0B2c) {
    +++ description: None
      sinceBlock:
+        122718680
    }
```

```diff
    contract SemaphoreVerifier (0x3D40F9b177aFb9BF7e41999FFaF5aBA6cb3847eF) {
    +++ description: None
      sinceBlock:
+        109906421
    }
```

```diff
    contract OpWorldID_Zero (0x42FF98C4E85212a5D31358ACbFe76a621b50fC02) {
    +++ description: None
      sinceBlock:
+        106733514
    }
```

```diff
    contract WorldIDRouterV1 (0x57f928158C3EE7CDad1e4D8642503c4D0201f611) {
    +++ description: None
      sinceBlock:
+        106734667
    }
```

```diff
    contract GnosisSafe (0x59a0f98345f54bAB245A043488ECE7FCecD7B596) {
    +++ description: None
      sinceBlock:
+        107096626
    }
```

```diff
    contract SemaphoreVerifier (0x5eB2c4a34A82a329C3E5D9F97F78Dc5446C3A9FB) {
    +++ description: None
      sinceBlock:
+        106733514
    }
```

```diff
    contract GnosisSafe (0x6BBf4f7478824482F0cE2861d003bf0Ef61CdBD6) {
    +++ description: None
      sinceBlock:
+        107096237
    }
```

```diff
    contract WLDGrant (0x6d8C0fc9C86a0506E9FC8B4D104A8F0a7EeC0674) {
    +++ description: None
      sinceBlock:
+        123277441
    }
```

```diff
    contract RecurringGrantDrop (0x7B46fFbC976db2F94C3B3CDD9EbBe4ab50E3d77d) {
    +++ description: None
      sinceBlock:
+        111511567
    }
```

```diff
    contract GnosisSafeL2 (0x7f26A7572E8B877654eeDcBc4E573657619FA3CE) {
    +++ description: None
      sinceBlock:
+        107123604
    }
```

```diff
    contract WorldIDIdentityManagerV2 (0x86D26Ed31556EA7694BD0cC4e674D7526f70511a) {
    +++ description: None
      sinceBlock:
+        122718680
    }
```

```diff
    contract Verifier (0xa6d85F3b3bE6Ff6DC52C3aaBe9A35d0ce252b79F) {
    +++ description: None
      sinceBlock:
+        127691868
    }
```

```diff
    contract VerifierLookupTable (0xA8710B3ba329fc7B80a49F7C82E889D1340C99fb) {
    +++ description: None
      sinceBlock:
+        122718679
    }
```

```diff
    contract OpWorldID_One (0xB3E7771a6e2d7DD8C0666042B7a07C39b938eb7d) {
    +++ description: A contract that manages the root history of the Semaphore identity merkle tree on Optimism.
      sinceBlock:
+        109906421
    }
```

```diff
    contract GnosisSafe (0xb67ac19693fB89880Ca5873f6a890E865b259c26) {
    +++ description: None
      sinceBlock:
+        107167835
    }
```

```diff
    contract GnosisSafe (0xc534a745bFfaF9466Ed7B47fA23B0177b99A3e77) {
    +++ description: None
      sinceBlock:
+        107096449
    }
```

```diff
    contract WLD token (0xdC6fF44d5d932Cbd77B52E5612Ba0529DC6226F1) {
    +++ description: None
      sinceBlock:
+        107087966
    }
```

```diff
    contract GnosisSafe (0xF0fCdb037718E1B2b52f109Ae776713F9c1f730c) {
    +++ description: None
      sinceBlock:
+        107167791
    }
```

```diff
    contract GnosisSafe (0xF1d0E74D4a54aBfeA3777d89cef7f7445acd992A) {
    +++ description: None
      sinceBlock:
+        107167680
    }
```

```diff
    contract VerifierLookupTable (0xfEab49fEEfefCB4b39dF640B66e7AcaC9B392A86) {
    +++ description: None
      sinceBlock:
+        122718679
    }
```

Generated with discovered.json: 0x62c4ad45e398d8990e8d437573657a015d57b469

# Diff at Tue, 04 Mar 2025 10:40:13 GMT:

- chain: ethereum
- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@98d260b45fe0d2195ce5e629bd7b200c8706e8ba block: 21845003
- current block number: 21845003

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21845003 (main branch discovery), not current.

```diff
    contract DeleteIdentitiesVerifierLookupTable (0x39CcB3b670651a14da8b3835f42924f49C2C5986) {
    +++ description: None
      sinceBlock:
+        18987060
    }
```

```diff
    contract RegisterIdentitiesVerifierLookupTable (0x4055B6d4018e92e4d000865e61e87B57A4E5Ab49) {
    +++ description: None
      sinceBlock:
+        17584527
    }
```

```diff
    contract DeleteVerifierSize100 (0x43B68ccBa7FC726540768fD1537c3179283140ed) {
    +++ description: None
      sinceBlock:
+        18987089
    }
```

```diff
    contract RegisterVerifierSize100 (0xb5f23A0c92F2f4aeE506FA3B1Cc2813820d13258) {
    +++ description: None
      sinceBlock:
+        18967237
    }
```

```diff
    contract DeleteVerifierSize10 (0xCA7d6822b9c6913B1A1416cE30eF14c4e7f0bFb1) {
    +++ description: None
      sinceBlock:
+        18987084
    }
```

```diff
    contract SemaphoreVerifier (0xcDBbcd1cb0B642F8E324aB29C73A967b0C80Bad5) {
    +++ description: None
      sinceBlock:
+        17584544
    }
```

```diff
    contract RegisterVerifierSize1200 (0xE44c83b9e1971A24EC698829297A0C4026B0CeF9) {
    +++ description: None
      sinceBlock:
+        18967248
    }
```

```diff
    contract WorldIdIdentityManager2 (0xf7134CE138832c1456F2a91D64621eE90c2bddEa) {
    +++ description: Does what it says: Manages identities for Worldcoin. The identityOperator can register or delete identities by submitting zk proofs.
      sinceBlock:
+        17636832
    }
```

```diff
    contract RegisterVerifierSize600 (0xFC1c26E964F791f81a33F49D91f79456891AA1c1) {
    +++ description: None
      sinceBlock:
+        18967244
    }
```

Generated with discovered.json: 0x7c9073b2478d0121e3cf233495042b32825b4004

# Diff at Fri, 14 Feb 2025 13:29:52 GMT:

- chain: ethereum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@166dc249bfa78df836dc8592e4a420bb82432150 block: 20922333
- current block number: 21845003

## Description

WorldIdIdentityManager2 admin, owner change (EOA).

## Watched changes

```diff
    contract WorldIdIdentityManager2 (0xf7134CE138832c1456F2a91D64621eE90c2bddEa) {
    +++ description: Does what it says: Manages identities for Worldcoin. The identityOperator can register or delete identities by submitting zk proofs.
      issuedPermissions.0.to:
-        "0x9ad4EFAF9E326c17c3A7be6F5D167843Af0eb30A"
+        "0x96d55BD9c8C4706FED243c1e15825FF7854920fA"
      values.$admin:
-        "0x9ad4EFAF9E326c17c3A7be6F5D167843Af0eb30A"
+        "0x96d55BD9c8C4706FED243c1e15825FF7854920fA"
      values.owner:
-        "0x9ad4EFAF9E326c17c3A7be6F5D167843Af0eb30A"
+        "0x96d55BD9c8C4706FED243c1e15825FF7854920fA"
    }
```

Generated with discovered.json: 0x371bf5c92fe3203c2ee9f3d31f23e2bedcd61b8f

# Diff at Mon, 20 Jan 2025 11:10:42 GMT:

- chain: optimism
- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@2c8b4f3d9910bb6371be9b4df87b70856e7d8c64 block: 127729542
- current block number: 127729542

## Description

Rerun on the same block number. Applies fixes to permissions and via field. Renames permission's target to to/from.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 127729542 (main branch discovery), not current.

```diff
    contract WorldIDRouterV1 (0x57f928158C3EE7CDad1e4D8642503c4D0201f611) {
    +++ description: None
      issuedPermissions.0.target:
-        "0x96d55BD9c8C4706FED243c1e15825FF7854920fA"
      issuedPermissions.0.to:
+        "0x96d55BD9c8C4706FED243c1e15825FF7854920fA"
    }
```

```diff
    contract WorldIDIdentityManagerV2 (0x86D26Ed31556EA7694BD0cC4e674D7526f70511a) {
    +++ description: None
      issuedPermissions.0.target:
-        "0x96d55BD9c8C4706FED243c1e15825FF7854920fA"
      issuedPermissions.0.to:
+        "0x96d55BD9c8C4706FED243c1e15825FF7854920fA"
    }
```

Generated with discovered.json: 0xef2da8c67b30bebcbc8f5c89fe5d1ad362505ddb

# Diff at Mon, 20 Jan 2025 11:10:21 GMT:

- chain: ethereum
- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@2c8b4f3d9910bb6371be9b4df87b70856e7d8c64 block: 20922333
- current block number: 20922333

## Description

Rerun on the same block number. Applies fixes to permissions and via field. Renames permission's target to to/from.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20922333 (main branch discovery), not current.

```diff
    contract WorldIdIdentityManager2 (0xf7134CE138832c1456F2a91D64621eE90c2bddEa) {
    +++ description: Does what it says: Manages identities for Worldcoin. The identityOperator can register or delete identities by submitting zk proofs.
      issuedPermissions.0.target:
-        "0x9ad4EFAF9E326c17c3A7be6F5D167843Af0eb30A"
      issuedPermissions.0.to:
+        "0x9ad4EFAF9E326c17c3A7be6F5D167843Af0eb30A"
    }
```

Generated with discovered.json: 0x6ae1975a26ebbfc9a9d3c107131fea6338523f7b

# Diff at Fri, 08 Nov 2024 09:24:54 GMT:

- chain: optimism
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@53988239f42edde0275ed92d8f3ada4279354f7d block: 123584561
- current block number: 127729542

## Description

New yet unused verifier deployed at the address of the owner of OpWorldID_One (???). This address was the owner before and was assumed to be an EOA.

## Watched changes

```diff
+   Status: CREATED
    contract Verifier (0xa6d85F3b3bE6Ff6DC52C3aaBe9A35d0ce252b79F)
    +++ description: None
```

## Source code changes

```diff
.../worldcoin/optimism/.flat/Verifier.sol          | 556 +++++++++++++++++++++
 1 file changed, 556 insertions(+)
```

Generated with discovered.json: 0x156f7a10d88f3de0393119244319511fafb4fb06

# Diff at Mon, 21 Oct 2024 12:52:46 GMT:

- chain: optimism
- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@e660599f23a07618fe949a07be1f516ce44f1914 block: 123584561
- current block number: 123584561

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 123584561 (main branch discovery), not current.

```diff
    contract OpWorldID_One (0xB3E7771a6e2d7DD8C0666042B7a07C39b938eb7d) {
    +++ description: A contract that manages the root history of the Semaphore identity merkle tree on Optimism.
      descriptions:
-        ["A contract that manages the root history of the Semaphore identity merkle tree on Optimism."]
      description:
+        "A contract that manages the root history of the Semaphore identity merkle tree on Optimism."
    }
```

Generated with discovered.json: 0xe57cdfb253e9f9f96688d6d9863edf4538e94063

# Diff at Mon, 21 Oct 2024 12:50:14 GMT:

- chain: ethereum
- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@e660599f23a07618fe949a07be1f516ce44f1914 block: 20922333
- current block number: 20922333

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20922333 (main branch discovery), not current.

```diff
    contract WorldIdIdentityManager2 (0xf7134CE138832c1456F2a91D64621eE90c2bddEa) {
    +++ description: Does what it says: Manages identities for Worldcoin. The identityOperator can register or delete identities by submitting zk proofs.
      descriptions:
-        ["Does what it says: Manages identities for Worldcoin. The identityOperator can register or delete identities by submitting zk proofs."]
      description:
+        "Does what it says: Manages identities for Worldcoin. The identityOperator can register or delete identities by submitting zk proofs."
    }
```

Generated with discovered.json: 0xb5df7083477290722f14ea7e4fe94a2fbb8e1ef3

# Diff at Mon, 21 Oct 2024 11:14:32 GMT:

- chain: optimism
- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@8895d33866f5665c4c710f4ddaa32bfa63cc3c78 block: 123584561
- current block number: 123584561

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 123584561 (main branch discovery), not current.

```diff
    contract WorldIDRouterV1 (0x57f928158C3EE7CDad1e4D8642503c4D0201f611) {
    +++ description: None
      values.$pastUpgrades.0.2:
+        ["0x11cA3127182f7583EfC416a8771BD4d11Fae4334"]
      values.$pastUpgrades.0.1:
-        ["0x11cA3127182f7583EfC416a8771BD4d11Fae4334"]
+        "0x42cd1a8bfd59bc87d042fbd377ea60f8374d66260c1fbbd4155f9de2a95d2435"
    }
```

```diff
    contract WorldIDIdentityManagerV2 (0x86D26Ed31556EA7694BD0cC4e674D7526f70511a) {
    +++ description: None
      values.$pastUpgrades.1.2:
+        ["0xa3d93B74214B80760288091675688E1EaD7838F2"]
      values.$pastUpgrades.1.1:
-        ["0xa3d93B74214B80760288091675688E1EaD7838F2"]
+        "0xb87e2e2aaea8870d4c7e920d1b266787af8495f7d51a3a984e6cda232629618a"
      values.$pastUpgrades.0.2:
+        ["0x5198DD63b9cA3DcA4FD6f62f615e6989CA74F49B"]
      values.$pastUpgrades.0.1:
-        ["0x5198DD63b9cA3DcA4FD6f62f615e6989CA74F49B"]
+        "0x67a0ce45a1336042396506ef28ac0390e6318dc1f262debe73e96f106e7e6a29"
    }
```

Generated with discovered.json: 0x5f2e4f8fabff5372f3bcb234859ea159a0784373

# Diff at Mon, 21 Oct 2024 11:12:04 GMT:

- chain: ethereum
- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@8895d33866f5665c4c710f4ddaa32bfa63cc3c78 block: 20922333
- current block number: 20922333

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20922333 (main branch discovery), not current.

```diff
    contract WorldIdIdentityManager2 (0xf7134CE138832c1456F2a91D64621eE90c2bddEa) {
    +++ description: Does what it says: Manages identities for Worldcoin. The identityOperator can register or delete identities by submitting zk proofs.
      values.$pastUpgrades.2.2:
+        ["0x521e8FB3A32Ea44237DC8b1E506dd78accFDf8Bd"]
      values.$pastUpgrades.2.1:
-        ["0x521e8FB3A32Ea44237DC8b1E506dd78accFDf8Bd"]
+        "0xda23d7a260d4bee338a99c4c9c1cd82f329f2ac151286487c66681ea4a0ae5e6"
      values.$pastUpgrades.1.2:
+        ["0x2Ad412A1dF96434Eed0779D2dB4A8694a06132f8"]
      values.$pastUpgrades.1.1:
-        ["0x2Ad412A1dF96434Eed0779D2dB4A8694a06132f8"]
+        "0xaa68dea1046df37d3b0f21db95cfaa44fc4e1d01dcc523379270251989283dcb"
      values.$pastUpgrades.0.2:
+        ["0xa3cD15EBed6075E33a54483C59818bC43D57c556"]
      values.$pastUpgrades.0.1:
-        ["0xa3cD15EBed6075E33a54483C59818bC43D57c556"]
+        "0x0af02107fe8622db5d846e8d391b550adba8fd06dd3382b7296f5168b6308be3"
    }
```

Generated with discovered.json: 0xd07f3085998e74343ee0a17d6a02a9c2afaec13d

# Diff at Mon, 14 Oct 2024 11:00:09 GMT:

- chain: optimism
- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@1afc77ff111ceb0970e7d09efcc7b2f376b0c281 block: 123584561
- current block number: 123584561

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 123584561 (main branch discovery), not current.

```diff
    contract GnosisSafe (0x0897316DFE7141DB1E182551c3e8077cf5dd9695) {
    +++ description: None
      sourceHashes:
+        ["0x81a7349eebb98ac33b0bc6842e3cb258034a8f2a4ba004570bb8e2e25947f9ff","0xd42bbf9f7dcd3720a7fc6bdc6edfdfae8800a37d6dd4decfa0ef6ca4a2e88940"]
    }
```

```diff
    contract GnosisSafe (0x140C0227Cbe493A56868DDF4ea582E92ef3e9744) {
    +++ description: None
      sourceHashes:
+        ["0x81a7349eebb98ac33b0bc6842e3cb258034a8f2a4ba004570bb8e2e25947f9ff","0xd42bbf9f7dcd3720a7fc6bdc6edfdfae8800a37d6dd4decfa0ef6ca4a2e88940"]
    }
```

```diff
    contract SemaphoreVerifier (0x31b0e17db1D02B079177698dF2eD7037Fc1d0B2c) {
    +++ description: None
      sourceHashes:
+        ["0x84c58f013e225f23f2b87640ea9cda83b40b4ba02f9cc37633a373399e4ffc39"]
    }
```

```diff
    contract SemaphoreVerifier (0x3D40F9b177aFb9BF7e41999FFaF5aBA6cb3847eF) {
    +++ description: None
      sourceHashes:
+        ["0xb9149eadedcff671edd3913162a49203e7f35036cb983413e363562d5974f4b3"]
    }
```

```diff
    contract OpWorldID_Zero (0x42FF98C4E85212a5D31358ACbFe76a621b50fC02) {
    +++ description: None
      sourceHashes:
+        ["0x72bde70cebd2ab71bea5390a3c0bc9625c3785a0e8538082fa12bb3dc181f91c"]
    }
```

```diff
    contract WorldIDRouterV1 (0x57f928158C3EE7CDad1e4D8642503c4D0201f611) {
    +++ description: None
      sourceHashes:
+        ["0xc4a6b3d493a5ef409bf23161e078448125746e1228ebcacd82067fe083c89418","0xbedda975c09c8d028b34ff1f9240b13e31113a1f831d29e98d903e147c5fdf44"]
    }
```

```diff
    contract GnosisSafe (0x59a0f98345f54bAB245A043488ECE7FCecD7B596) {
    +++ description: None
      sourceHashes:
+        ["0x81a7349eebb98ac33b0bc6842e3cb258034a8f2a4ba004570bb8e2e25947f9ff","0xd42bbf9f7dcd3720a7fc6bdc6edfdfae8800a37d6dd4decfa0ef6ca4a2e88940"]
    }
```

```diff
    contract SemaphoreVerifier (0x5eB2c4a34A82a329C3E5D9F97F78Dc5446C3A9FB) {
    +++ description: None
      sourceHashes:
+        ["0xb9149eadedcff671edd3913162a49203e7f35036cb983413e363562d5974f4b3"]
    }
```

```diff
    contract GnosisSafe (0x6BBf4f7478824482F0cE2861d003bf0Ef61CdBD6) {
    +++ description: None
      sourceHashes:
+        ["0x81a7349eebb98ac33b0bc6842e3cb258034a8f2a4ba004570bb8e2e25947f9ff","0xd42bbf9f7dcd3720a7fc6bdc6edfdfae8800a37d6dd4decfa0ef6ca4a2e88940"]
    }
```

```diff
    contract WLDGrant (0x6d8C0fc9C86a0506E9FC8B4D104A8F0a7EeC0674) {
    +++ description: None
      sourceHashes:
+        ["0x7572e98d419aaac0254e8a40e14d4957b4eab4c899cc4c6a45a5017520faee58"]
    }
```

```diff
    contract RecurringGrantDrop (0x7B46fFbC976db2F94C3B3CDD9EbBe4ab50E3d77d) {
    +++ description: None
      sourceHashes:
+        ["0xccc2e81b4a40bed984ee0f48b74a4d292a5644906628aa7d04258a97b84d1c90"]
    }
```

```diff
    contract GnosisSafeL2 (0x7f26A7572E8B877654eeDcBc4E573657619FA3CE) {
    +++ description: None
      sourceHashes:
+        ["0x81a7349eebb98ac33b0bc6842e3cb258034a8f2a4ba004570bb8e2e25947f9ff","0x59fe14e95a8aa7f52213f18bae5c9329cf583a7ba31194698b15eddb97d5e825"]
    }
```

```diff
    contract WorldIDIdentityManagerV2 (0x86D26Ed31556EA7694BD0cC4e674D7526f70511a) {
    +++ description: None
      sourceHashes:
+        ["0x3821412640509152c25bca5507532d7472607cede582ce50994edf3261f0ea9c","0xcac9e734a4cccc40bec37b5168f307cca5054c69434c136f131ee1ee0a6a555d"]
    }
```

```diff
    contract VerifierLookupTable (0xA8710B3ba329fc7B80a49F7C82E889D1340C99fb) {
    +++ description: None
      sourceHashes:
+        ["0x39eb56f7878719eefdfb5cc208bbd36b80989adf0ba642e7d2359973d08c8934"]
    }
```

```diff
    contract OpWorldID_One (0xB3E7771a6e2d7DD8C0666042B7a07C39b938eb7d) {
    +++ description: A contract that manages the root history of the Semaphore identity merkle tree on Optimism.
      sourceHashes:
+        ["0xf3dd037dddfc31db7402a4f10bf7c4e6ef8a682fceaf2a57fc131f05c8f4dc47"]
    }
```

```diff
    contract GnosisSafe (0xb67ac19693fB89880Ca5873f6a890E865b259c26) {
    +++ description: None
      sourceHashes:
+        ["0x81a7349eebb98ac33b0bc6842e3cb258034a8f2a4ba004570bb8e2e25947f9ff","0xd42bbf9f7dcd3720a7fc6bdc6edfdfae8800a37d6dd4decfa0ef6ca4a2e88940"]
    }
```

```diff
    contract GnosisSafe (0xc534a745bFfaF9466Ed7B47fA23B0177b99A3e77) {
    +++ description: None
      sourceHashes:
+        ["0x81a7349eebb98ac33b0bc6842e3cb258034a8f2a4ba004570bb8e2e25947f9ff","0xd42bbf9f7dcd3720a7fc6bdc6edfdfae8800a37d6dd4decfa0ef6ca4a2e88940"]
    }
```

```diff
    contract WLD token (0xdC6fF44d5d932Cbd77B52E5612Ba0529DC6226F1) {
    +++ description: None
      sourceHashes:
+        ["0xd6334e346e2c0970559b615252d84f9d22a0d674a54f14db1dbc30a9db50c2f3"]
    }
```

```diff
    contract GnosisSafe (0xF0fCdb037718E1B2b52f109Ae776713F9c1f730c) {
    +++ description: None
      sourceHashes:
+        ["0x81a7349eebb98ac33b0bc6842e3cb258034a8f2a4ba004570bb8e2e25947f9ff","0xd42bbf9f7dcd3720a7fc6bdc6edfdfae8800a37d6dd4decfa0ef6ca4a2e88940"]
    }
```

```diff
    contract GnosisSafe (0xF1d0E74D4a54aBfeA3777d89cef7f7445acd992A) {
    +++ description: None
      sourceHashes:
+        ["0x81a7349eebb98ac33b0bc6842e3cb258034a8f2a4ba004570bb8e2e25947f9ff","0xd42bbf9f7dcd3720a7fc6bdc6edfdfae8800a37d6dd4decfa0ef6ca4a2e88940"]
    }
```

```diff
    contract VerifierLookupTable (0xfEab49fEEfefCB4b39dF640B66e7AcaC9B392A86) {
    +++ description: None
      sourceHashes:
+        ["0x39eb56f7878719eefdfb5cc208bbd36b80989adf0ba642e7d2359973d08c8934"]
    }
```

Generated with discovered.json: 0x5bbd3c94b69fded49e2906cf815436af4c48c01a

# Diff at Mon, 14 Oct 2024 10:57:53 GMT:

- chain: ethereum
- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@1afc77ff111ceb0970e7d09efcc7b2f376b0c281 block: 20922333
- current block number: 20922333

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20922333 (main branch discovery), not current.

```diff
    contract DeleteIdentitiesVerifierLookupTable (0x39CcB3b670651a14da8b3835f42924f49C2C5986) {
    +++ description: None
      sourceHashes:
+        ["0x39eb56f7878719eefdfb5cc208bbd36b80989adf0ba642e7d2359973d08c8934"]
    }
```

```diff
    contract RegisterIdentitiesVerifierLookupTable (0x4055B6d4018e92e4d000865e61e87B57A4E5Ab49) {
    +++ description: None
      sourceHashes:
+        ["0x39eb56f7878719eefdfb5cc208bbd36b80989adf0ba642e7d2359973d08c8934"]
    }
```

```diff
    contract DeleteVerifierSize100 (0x43B68ccBa7FC726540768fD1537c3179283140ed) {
    +++ description: None
      sourceHashes:
+        ["0xc2565a490312be5d6a5b12bcb700c6fa795caab49384ab6d23343096134df95f"]
    }
```

```diff
    contract RegisterVerifierSize100 (0xb5f23A0c92F2f4aeE506FA3B1Cc2813820d13258) {
    +++ description: None
      sourceHashes:
+        ["0x7c8adbb6efe5b3350d779e102d5ae78fd639c4f8ceefafea77344463d5d8cc94"]
    }
```

```diff
    contract DeleteVerifierSize10 (0xCA7d6822b9c6913B1A1416cE30eF14c4e7f0bFb1) {
    +++ description: None
      sourceHashes:
+        ["0x82f68854d52503cd6c6f6ff3c97b47515d8e5b65abc2950508e18059dff0692f"]
    }
```

```diff
    contract SemaphoreVerifier (0xcDBbcd1cb0B642F8E324aB29C73A967b0C80Bad5) {
    +++ description: None
      sourceHashes:
+        ["0xb9149eadedcff671edd3913162a49203e7f35036cb983413e363562d5974f4b3"]
    }
```

```diff
    contract RegisterVerifierSize1200 (0xE44c83b9e1971A24EC698829297A0C4026B0CeF9) {
    +++ description: None
      sourceHashes:
+        ["0xbd34cc0d432d6d6834f925e6553abb9510b448b0eb25d2e40263813ad71f6f86"]
    }
```

```diff
    contract WorldIdIdentityManager2 (0xf7134CE138832c1456F2a91D64621eE90c2bddEa) {
    +++ description: Does what it says: Manages identities for Worldcoin. The identityOperator can register or delete identities by submitting zk proofs.
      sourceHashes:
+        ["0x3821412640509152c25bca5507532d7472607cede582ce50994edf3261f0ea9c","0xcac9e734a4cccc40bec37b5168f307cca5054c69434c136f131ee1ee0a6a555d"]
    }
```

```diff
    contract RegisterVerifierSize600 (0xFC1c26E964F791f81a33F49D91f79456891AA1c1) {
    +++ description: None
      sourceHashes:
+        ["0xca7e21152b6ce21c64fdb15e8d8e9ac03809d3f499f232454a62e8060acbc3b9"]
    }
```

Generated with discovered.json: 0xc090690b6d65a34a13d7d0538b596ee5b61993d7

# Diff at Tue, 08 Oct 2024 17:23:55 GMT:

- chain: ethereum
- author: sekuba (<sekuba@users.noreply.github.com>)
- comparing to: main@bca55174129419533cd4173605c170ea99ac6f98 block: 20432514
- current block number: 20922333

## Description

New identityOperator EOA.

## Watched changes

```diff
    contract WorldIdIdentityManager2 (0xf7134CE138832c1456F2a91D64621eE90c2bddEa) {
    +++ description: Does what it says: Manages identities for Worldcoin. The identityOperator can register or delete identities by submitting zk proofs.
+++ description: Can call functions (manage identities) in the WorldIdIdentityManager2 implementation
      values.identityOperator:
-        "0x9ad4EFAF9E326c17c3A7be6F5D167843Af0eb30A"
+        "0xE2DA046340e00264C4F0443243a0565007AE08AC"
    }
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20432514 (main branch discovery), not current.

```diff
    contract WorldIdIdentityManager2 (0xf7134CE138832c1456F2a91D64621eE90c2bddEa) {
    +++ description: Does what it says: Manages identities for Worldcoin. The identityOperator can register or delete identities by submitting zk proofs.
      descriptions:
+        ["Does what it says: Manages identities for Worldcoin. The identityOperator can register or delete identities by submitting zk proofs."]
      fieldMeta:
+        {"identityOperator":{"description":"Can call functions (manage identities) in the WorldIdIdentityManager2 implementation"}}
    }
```

Generated with discovered.json: 0x4a5cbb655b96453e6821e3bf742e1d536904f968

# Diff at Tue, 01 Oct 2024 11:13:47 GMT:

- chain: optimism
- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@bd754dc73c66120164006054f8d25c5fae9cd910 block: 123584561
- current block number: 123584561

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 123584561 (main branch discovery), not current.

```diff
    contract WorldIDRouterV1 (0x57f928158C3EE7CDad1e4D8642503c4D0201f611) {
    +++ description: None
      values.$pastUpgrades:
+        [["2023-07-11T09:35:11.000Z",["0x11cA3127182f7583EfC416a8771BD4d11Fae4334"]]]
    }
```

```diff
    contract WorldIDIdentityManagerV2 (0x86D26Ed31556EA7694BD0cC4e674D7526f70511a) {
    +++ description: None
      values.$pastUpgrades:
+        [["2024-07-15T09:35:37.000Z",["0x5198DD63b9cA3DcA4FD6f62f615e6989CA74F49B"]],["2024-07-15T09:35:37.000Z",["0xa3d93B74214B80760288091675688E1EaD7838F2"]]]
    }
```

Generated with discovered.json: 0x96a26211df9aa68ac085af198ba101729d6b20bd

# Diff at Tue, 01 Oct 2024 11:11:50 GMT:

- chain: ethereum
- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@bd754dc73c66120164006054f8d25c5fae9cd910 block: 20432514
- current block number: 20432514

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20432514 (main branch discovery), not current.

```diff
    contract WorldIdIdentityManager2 (0xf7134CE138832c1456F2a91D64621eE90c2bddEa) {
    +++ description: None
      values.$pastUpgrades:
+        [["2023-07-06T19:19:11.000Z",["0xa3cD15EBed6075E33a54483C59818bC43D57c556"]],["2023-08-18T17:12:23.000Z",["0x2Ad412A1dF96434Eed0779D2dB4A8694a06132f8"]],["2024-01-12T00:00:23.000Z",["0x521e8FB3A32Ea44237DC8b1E506dd78accFDf8Bd"]]]
    }
```

Generated with discovered.json: 0x84e38713f0b3bd025cebf4bb5c4e78d95ea8e44d

# Diff at Fri, 23 Aug 2024 09:58:09 GMT:

- chain: optimism
- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@67597c7d6c810bc726594446890178150240711e block: 123584561
- current block number: 123584561

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 123584561 (main branch discovery), not current.

```diff
    contract WorldIDRouterV1 (0x57f928158C3EE7CDad1e4D8642503c4D0201f611) {
    +++ description: None
      values.$upgradeCount:
+        1
    }
```

```diff
    contract WorldIDIdentityManagerV2 (0x86D26Ed31556EA7694BD0cC4e674D7526f70511a) {
    +++ description: None
      values.$upgradeCount:
+        2
    }
```

Generated with discovered.json: 0x2e81c05e7db49aa9410691675b939ba0db695cff

# Diff at Fri, 23 Aug 2024 09:56:22 GMT:

- chain: ethereum
- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@67597c7d6c810bc726594446890178150240711e block: 20432514
- current block number: 20432514

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20432514 (main branch discovery), not current.

```diff
    contract WorldIdIdentityManager2 (0xf7134CE138832c1456F2a91D64621eE90c2bddEa) {
    +++ description: None
      values.$upgradeCount:
+        3
    }
```

Generated with discovered.json: 0x1905cc12f86e0f4b503b6aace0f089b0a806c935

# Diff at Wed, 21 Aug 2024 10:08:30 GMT:

- chain: optimism
- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@2f6dde3357bf5d79196b6e94f79d853a6c4ec72b block: 123584561
- current block number: 123584561

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 123584561 (main branch discovery), not current.

```diff
    contract WorldIDRouterV1 (0x57f928158C3EE7CDad1e4D8642503c4D0201f611) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x96d55BD9c8C4706FED243c1e15825FF7854920fA","via":[]}]
    }
```

```diff
    contract WorldIDIdentityManagerV2 (0x86D26Ed31556EA7694BD0cC4e674D7526f70511a) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x96d55BD9c8C4706FED243c1e15825FF7854920fA","via":[]}]
    }
```

Generated with discovered.json: 0x3a4b62d77db367c176ad873c3200e8296ef4b785

# Diff at Wed, 21 Aug 2024 10:06:33 GMT:

- chain: ethereum
- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@2f6dde3357bf5d79196b6e94f79d853a6c4ec72b block: 20432514
- current block number: 20432514

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20432514 (main branch discovery), not current.

```diff
    contract WorldIdIdentityManager2 (0xf7134CE138832c1456F2a91D64621eE90c2bddEa) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x9ad4EFAF9E326c17c3A7be6F5D167843Af0eb30A","via":[]}]
    }
```

Generated with discovered.json: 0x6d61dd041ac7cfe1d6066bcc4aeb09af1b31ecf6

# Diff at Fri, 09 Aug 2024 10:14:36 GMT:

- chain: optimism
- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@1f0da1d0aab7bc6b3b5e54e7e93480bd98e57035 block: 123584561
- current block number: 123584561

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 123584561 (main branch discovery), not current.

```diff
    contract GnosisSafe (0x0897316DFE7141DB1E182551c3e8077cf5dd9695) {
    +++ description: None
      values.$multisigThreshold:
-        "1 of 1 (100%)"
      values.getOwners:
-        ["0x541f3cc5772a64f2ba0a47e83236CcE2F089b188"]
      values.getThreshold:
-        1
      values.$members:
+        ["0x541f3cc5772a64f2ba0a47e83236CcE2F089b188"]
      values.$threshold:
+        1
      values.multisigThreshold:
+        "1 of 1 (100%)"
    }
```

```diff
    contract GnosisSafe (0x140C0227Cbe493A56868DDF4ea582E92ef3e9744) {
    +++ description: None
      values.$multisigThreshold:
-        "1 of 1 (100%)"
      values.getOwners:
-        ["0x5f39524Ed45091abDF3Caff7399c426D7c5F7F04"]
      values.getThreshold:
-        1
      values.$members:
+        ["0x5f39524Ed45091abDF3Caff7399c426D7c5F7F04"]
      values.$threshold:
+        1
      values.multisigThreshold:
+        "1 of 1 (100%)"
    }
```

```diff
    contract GnosisSafe (0x59a0f98345f54bAB245A043488ECE7FCecD7B596) {
    +++ description: None
      values.$multisigThreshold:
-        "1 of 1 (100%)"
      values.getOwners:
-        ["0xc534a745bFfaF9466Ed7B47fA23B0177b99A3e77"]
      values.getThreshold:
-        1
      values.$members:
+        ["0xc534a745bFfaF9466Ed7B47fA23B0177b99A3e77"]
      values.$threshold:
+        1
      values.multisigThreshold:
+        "1 of 1 (100%)"
    }
```

```diff
    contract GnosisSafe (0x6BBf4f7478824482F0cE2861d003bf0Ef61CdBD6) {
    +++ description: None
      values.$multisigThreshold:
-        "2 of 2 (100%)"
      values.getOwners:
-        ["0xB6d1621B770A088C16bfec22bAd00F77D874d011","0x2a7A69daDe8fed5c88b5894392ADc6c42da6d5c7"]
      values.getThreshold:
-        2
      values.$members:
+        ["0xB6d1621B770A088C16bfec22bAd00F77D874d011","0x2a7A69daDe8fed5c88b5894392ADc6c42da6d5c7"]
      values.$threshold:
+        2
      values.multisigThreshold:
+        "2 of 2 (100%)"
    }
```

```diff
    contract GnosisSafeL2 (0x7f26A7572E8B877654eeDcBc4E573657619FA3CE) {
    +++ description: None
      values.$multisigThreshold:
-        "2 of 3 (67%)"
      values.getOwners:
-        ["0x57c72EB3f74e3A1c95656253214A018818818ec3","0x59a0f98345f54bAB245A043488ECE7FCecD7B596","0xF85733e96Fa7791C5188C4B9740f0ff7d7bd2C09"]
      values.getThreshold:
-        2
      values.$members:
+        ["0x57c72EB3f74e3A1c95656253214A018818818ec3","0x59a0f98345f54bAB245A043488ECE7FCecD7B596","0xF85733e96Fa7791C5188C4B9740f0ff7d7bd2C09"]
      values.$threshold:
+        2
      values.multisigThreshold:
+        "2 of 3 (67%)"
    }
```

```diff
    contract GnosisSafe (0xb67ac19693fB89880Ca5873f6a890E865b259c26) {
    +++ description: None
      values.$multisigThreshold:
-        "2 of 2 (100%)"
      values.getOwners:
-        ["0x79b998ded1f4503CE3A0A76993c72a65449f4590","0x6EbD1dc80A9D608b7bC0F204E14909E7fFd25421"]
      values.getThreshold:
-        2
      values.$members:
+        ["0x79b998ded1f4503CE3A0A76993c72a65449f4590","0x6EbD1dc80A9D608b7bC0F204E14909E7fFd25421"]
      values.$threshold:
+        2
      values.multisigThreshold:
+        "2 of 2 (100%)"
    }
```

```diff
    contract GnosisSafe (0xc534a745bFfaF9466Ed7B47fA23B0177b99A3e77) {
    +++ description: None
      values.$multisigThreshold:
-        "2 of 6 (33%)"
      values.getOwners:
-        ["0x0897316DFE7141DB1E182551c3e8077cf5dd9695","0xb67ac19693fB89880Ca5873f6a890E865b259c26","0xF0fCdb037718E1B2b52f109Ae776713F9c1f730c","0x140C0227Cbe493A56868DDF4ea582E92ef3e9744","0xF1d0E74D4a54aBfeA3777d89cef7f7445acd992A","0x6BBf4f7478824482F0cE2861d003bf0Ef61CdBD6"]
      values.getThreshold:
-        2
      values.$members:
+        ["0x0897316DFE7141DB1E182551c3e8077cf5dd9695","0xb67ac19693fB89880Ca5873f6a890E865b259c26","0xF0fCdb037718E1B2b52f109Ae776713F9c1f730c","0x140C0227Cbe493A56868DDF4ea582E92ef3e9744","0xF1d0E74D4a54aBfeA3777d89cef7f7445acd992A","0x6BBf4f7478824482F0cE2861d003bf0Ef61CdBD6"]
      values.$threshold:
+        2
      values.multisigThreshold:
+        "2 of 6 (33%)"
    }
```

```diff
    contract GnosisSafe (0xF0fCdb037718E1B2b52f109Ae776713F9c1f730c) {
    +++ description: None
      values.$multisigThreshold:
-        "1 of 1 (100%)"
      values.getOwners:
-        ["0x3b870Ea07b6511475Fa2422eA9DaA74C55Db85Be"]
      values.getThreshold:
-        1
      values.$members:
+        ["0x3b870Ea07b6511475Fa2422eA9DaA74C55Db85Be"]
      values.$threshold:
+        1
      values.multisigThreshold:
+        "1 of 1 (100%)"
    }
```

```diff
    contract GnosisSafe (0xF1d0E74D4a54aBfeA3777d89cef7f7445acd992A) {
    +++ description: None
      values.$multisigThreshold:
-        "1 of 1 (100%)"
      values.getOwners:
-        ["0x70E755E15Ac5C6f8B2612F318a5CeDE11D77bEde"]
      values.getThreshold:
-        1
      values.$members:
+        ["0x70E755E15Ac5C6f8B2612F318a5CeDE11D77bEde"]
      values.$threshold:
+        1
      values.multisigThreshold:
+        "1 of 1 (100%)"
    }
```

Generated with discovered.json: 0x45f5ef5b283f8f30512f211e544ab0f6e8c83fb2

# Diff at Thu, 01 Aug 2024 09:13:14 GMT:

- chain: optimism
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@295430f331b68784c13ccda9222bc78df1e833c5 block: 123030782
- current block number: 123452401

## Description

WLDGrant contract is upgraded with small changes: 'Only grant reservations with grantIds in the range [21;38] can be redeemed.' 
The identityOperator changed to a new EOA. This role can register and delete identities in the WorldIDIdentityManagerV2.


## Watched changes

```diff
    contract RecurringGrantDrop (0x7B46fFbC976db2F94C3B3CDD9EbBe4ab50E3d77d) {
    +++ description: None
      values.grant:
-        "0xe11CEfF5034278dC62318e74aF6efBA57D54f3be"
+        "0x6d8C0fc9C86a0506E9FC8B4D104A8F0a7EeC0674"
    }
```

```diff
    contract WorldIDIdentityManagerV2 (0x86D26Ed31556EA7694BD0cC4e674D7526f70511a) {
    +++ description: None
      values.identityOperator:
-        "0x96d55BD9c8C4706FED243c1e15825FF7854920fA"
+        "0x997c96386A7D0A491170742346570eb8E8A4E96E"
    }
```

```diff
-   Status: DELETED
    contract WLDGrant (0xe11CEfF5034278dC62318e74aF6efBA57D54f3be)
    +++ description: None
```

```diff
+   Status: CREATED
    contract WLDGrant (0x6d8C0fc9C86a0506E9FC8B4D104A8F0a7EeC0674)
    +++ description: None
```

## Source code changes

```diff
.../worldcoin/optimism/{.flat@123030782 => .flat}/WLDGrant.sol   | 9 +++------
 1 file changed, 3 insertions(+), 6 deletions(-)
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 123030782 (main branch discovery), not current.

```diff
    contract WLDGrant (0xe11CEfF5034278dC62318e74aF6efBA57D54f3be) {
    +++ description: None
      values.getAmount:
+        ["3000000000000000000","3000000000000000000","3000000000000000000","3000000000000000000","3000000000000000000"]
      errors:
+        {"getAmount":"Too many values. Update configuration to explore fully"}
    }
```

Generated with discovered.json: 0x3d437366d5911d73f4d97188b142bf232a156492

# Diff at Mon, 22 Jul 2024 14:59:13 GMT:

- chain: optimism
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@898b873eac66b785af49fe56edca0c3dc1a5d0d7 block: 120698212
- current block number: 123030782

## Description

The WorldIDIdentityManager is upgraded to a new implementation. 6 new SMTB verifiers and a new Semaphore verifier are deployed. The worldcoin team confirmed that this is a staging deployment which is not currently used.

## Watched changes

```diff
+   Status: CREATED
    contract SemaphoreVerifier (0x31b0e17db1D02B079177698dF2eD7037Fc1d0B2c)
    +++ description: None
```

```diff
+   Status: CREATED
    contract WorldIDIdentityManagerV2 (0x86D26Ed31556EA7694BD0cC4e674D7526f70511a)
    +++ description: None
```

```diff
+   Status: CREATED
    contract VerifierLookupTable (0xA8710B3ba329fc7B80a49F7C82E889D1340C99fb)
    +++ description: None
```

```diff
+   Status: CREATED
    contract VerifierLookupTable (0xfEab49fEEfefCB4b39dF640B66e7AcaC9B392A86)
    +++ description: None
```

## Source code changes

```diff
...-0x31b0e17db1D02B079177698dF2eD7037Fc1d0B2c.sol |  601 +++++++
 ...-0xA8710B3ba329fc7B80a49F7C82E889D1340C99fb.sol |  281 +++
 ...-0xfEab49fEEfefCB4b39dF640B66e7AcaC9B392A86.sol |  281 +++
 .../WorldIDIdentityManager.p.sol                   |  637 +++++++
 .../WorldIDIdentityManagerImplV2.sol               | 1900 ++++++++++++++++++++
 5 files changed, 3700 insertions(+)
```

Generated with discovered.json: 0x4397acc0c008d4be61c60e1586d02368aa552ed7

# Diff at Wed, 29 May 2024 15:06:51 GMT:

- chain: optimism
- author: sekuba (<sekuba@users.noreply.github.com>)
- comparing to: main@d0877009edde2713b2b4f20a593b40156f5de045 block: 120597605
- current block number: 120698212

## Description

Config related: Owner is upgrade admin.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 120597605 (main branch discovery), not current.

```diff
    contract WorldIDRouterV1 (0x57f928158C3EE7CDad1e4D8642503c4D0201f611) {
    +++ description: None
      upgradeability.admin:
-        "0x0000000000000000000000000000000000000000"
+        "0x96d55BD9c8C4706FED243c1e15825FF7854920fA"
    }
```

Generated with discovered.json: 0x3759828a64294cbc3e7886ec2441fb2de28e4ea2

# Diff at Wed, 29 May 2024 15:05:45 GMT:

- chain: ethereum
- author: sekuba (<sekuba@users.noreply.github.com>)
- comparing to: main@d0877009edde2713b2b4f20a593b40156f5de045 block: 19831219
- current block number: 19976298

## Description

Config related: Owner is upgrade admin.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19831219 (main branch discovery), not current.

```diff
    contract WorldIdIdentityManager2 (0xf7134CE138832c1456F2a91D64621eE90c2bddEa) {
    +++ description: None
      upgradeability.admin:
-        "0x0000000000000000000000000000000000000000"
+        "0x9ad4EFAF9E326c17c3A7be6F5D167843Af0eb30A"
    }
```

Generated with discovered.json: 0xa60c828e6991456efad02a8d4a404f080ec9a992

# Diff at Mon, 27 May 2024 07:13:22 GMT:

- chain: optimism
- author: sekuba (<sekuba@users.noreply.github.com>)
- comparing to: main@e3af44de7f5996e5fc7d7b401325abe876105664 block: 119822353
- current block number: 120597605

## Description

Ignore values are updated.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 119822353 (main branch discovery), not current.

```diff
    contract OpWorldID_One (0xB3E7771a6e2d7DD8C0666042B7a07C39b938eb7d) {
    +++ description: A contract that manages the root history of the Semaphore identity merkle tree on Optimism.
      values.latestRoot:
-        "20915762964411057304698085615437664390231699052784062947202998090988652794869"
    }
```

```diff
    contract OptimismMintableERC20 (0xdC6fF44d5d932Cbd77B52E5612Ba0529DC6226F1) {
    +++ description: None
      name:
-        "OptimismMintableERC20"
+        "WLD token"
    }
```

Generated with discovered.json: 0xa9bf94a954ea2ddd41e48b84f2553d0724ba6714

# Diff at Thu, 09 May 2024 08:31:47 GMT:

- chain: optimism
- author: sekuba (<sekuba@users.noreply.github.com>)
- current block number: 119822353

## Description

Provide description of changes. This section will be preserved.

## Initial discovery

```diff
+   Status: CREATED
    contract GnosisSafe (0x0897316DFE7141DB1E182551c3e8077cf5dd9695)
    +++ description: None
```

```diff
+   Status: CREATED
    contract GnosisSafe (0x140C0227Cbe493A56868DDF4ea582E92ef3e9744)
    +++ description: None
```

```diff
+   Status: CREATED
    contract SemaphoreVerifier (0x3D40F9b177aFb9BF7e41999FFaF5aBA6cb3847eF)
    +++ description: None
```

```diff
+   Status: CREATED
    contract OpWorldID_Zero (0x42FF98C4E85212a5D31358ACbFe76a621b50fC02)
    +++ description: None
```

```diff
+   Status: CREATED
    contract WorldIDRouterV1 (0x57f928158C3EE7CDad1e4D8642503c4D0201f611)
    +++ description: None
```

```diff
+   Status: CREATED
    contract GnosisSafe (0x59a0f98345f54bAB245A043488ECE7FCecD7B596)
    +++ description: None
```

```diff
+   Status: CREATED
    contract SemaphoreVerifier (0x5eB2c4a34A82a329C3E5D9F97F78Dc5446C3A9FB)
    +++ description: None
```

```diff
+   Status: CREATED
    contract GnosisSafe (0x6BBf4f7478824482F0cE2861d003bf0Ef61CdBD6)
    +++ description: None
```

```diff
+   Status: CREATED
    contract RecurringGrantDrop (0x7B46fFbC976db2F94C3B3CDD9EbBe4ab50E3d77d)
    +++ description: None
```

```diff
+   Status: CREATED
    contract GnosisSafeL2 (0x7f26A7572E8B877654eeDcBc4E573657619FA3CE)
    +++ description: None
```

```diff
+   Status: CREATED
    contract OpWorldID_One (0xB3E7771a6e2d7DD8C0666042B7a07C39b938eb7d)
    +++ description: None
```

```diff
+   Status: CREATED
    contract GnosisSafe (0xb67ac19693fB89880Ca5873f6a890E865b259c26)
    +++ description: None
```

```diff
+   Status: CREATED
    contract GnosisSafe (0xc534a745bFfaF9466Ed7B47fA23B0177b99A3e77)
    +++ description: None
```

```diff
+   Status: CREATED
    contract OptimismMintableERC20 (0xdC6fF44d5d932Cbd77B52E5612Ba0529DC6226F1)
    +++ description: None
```

```diff
+   Status: CREATED
    contract WLDGrant (0xe11CEfF5034278dC62318e74aF6efBA57D54f3be)
    +++ description: None
```

```diff
+   Status: CREATED
    contract GnosisSafe (0xF0fCdb037718E1B2b52f109Ae776713F9c1f730c)
    +++ description: None
```

```diff
+   Status: CREATED
    contract GnosisSafe (0xF1d0E74D4a54aBfeA3777d89cef7f7445acd992A)
    +++ description: None
```

Generated with discovered.json: 0x2ba241edec2c6159161163d4edcd345d773b403a

# Diff at Thu, 09 May 2024 08:14:02 GMT:

- chain: ethereum
- author: sekuba (<sekuba@users.noreply.github.com>)
- current block number: 19831219

## Description

Added worldcoin discovery. In particular this is needed for the ZK Catalog.

## Initial discovery

```diff
+   Status: CREATED
    contract DeleteIdentitiesVerifierLookupTable (0x39CcB3b670651a14da8b3835f42924f49C2C5986)
    +++ description: None
```

```diff
+   Status: CREATED
    contract RegisterIdentitiesVerifierLookupTable (0x4055B6d4018e92e4d000865e61e87B57A4E5Ab49)
    +++ description: None
```

```diff
+   Status: CREATED
    contract DeleteVerifierSize100 (0x43B68ccBa7FC726540768fD1537c3179283140ed)
    +++ description: None
```

```diff
+   Status: CREATED
    contract RegisterVerifierSize100 (0xb5f23A0c92F2f4aeE506FA3B1Cc2813820d13258)
    +++ description: None
```

```diff
+   Status: CREATED
    contract DeleteVerifierSize10 (0xCA7d6822b9c6913B1A1416cE30eF14c4e7f0bFb1)
    +++ description: None
```

```diff
+   Status: CREATED
    contract SemaphoreVerifier (0xcDBbcd1cb0B642F8E324aB29C73A967b0C80Bad5)
    +++ description: None
```

```diff
+   Status: CREATED
    contract RegisterVerifierSize1200 (0xE44c83b9e1971A24EC698829297A0C4026B0CeF9)
    +++ description: None
```

```diff
+   Status: CREATED
    contract WorldIdIdentityManager2 (0xf7134CE138832c1456F2a91D64621eE90c2bddEa)
    +++ description: None
```

```diff
+   Status: CREATED
    contract RegisterVerifierSize600 (0xFC1c26E964F791f81a33F49D91f79456891AA1c1)
    +++ description: None
```

