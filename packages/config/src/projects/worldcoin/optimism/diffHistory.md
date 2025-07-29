Generated with discovered.json: 0x1fa641c499475986e164d1f9d8d0764c79137130

# Diff at Mon, 14 Jul 2025 12:47:08 GMT:

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

Generated with discovered.json: 0xabcbd421b763e4fb3312b3651f4a3a2714393682

# Diff at Fri, 04 Jul 2025 12:19:28 GMT:

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

Generated with discovered.json: 0x3f2e690dcb1f40b036f0c45c73956c1d31536aa1

# Diff at Fri, 23 May 2025 09:41:16 GMT:

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

Generated with discovered.json: 0x53597b6099bb249886615946b724b5f695607f12

# Diff at Tue, 06 May 2025 10:57:06 GMT:

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

Generated with discovered.json: 0x1ac9881130158424f217c3fc5b06d541b2220e0b

# Diff at Tue, 29 Apr 2025 08:19:25 GMT:

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

Generated with discovered.json: 0x165997887c4474d9cfa708d12bff2f7ac635e166

# Diff at Mon, 31 Mar 2025 12:33:36 GMT:

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

Generated with discovered.json: 0x064db87ea1a5d52f6b2f76f1c2f5fbc993e166f4

# Diff at Tue, 04 Mar 2025 10:40:39 GMT:

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

Generated with discovered.json: 0x371bf5c92fe3203c2ee9f3d31f23e2bedcd61b8f

# Diff at Mon, 20 Jan 2025 11:10:42 GMT:

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

Generated with discovered.json: 0x6ae1975a26ebbfc9a9d3c107131fea6338523f7b

# Diff at Fri, 08 Nov 2024 09:24:54 GMT:

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

Generated with discovered.json: 0xb5df7083477290722f14ea7e4fe94a2fbb8e1ef3

# Diff at Mon, 21 Oct 2024 11:14:32 GMT:

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

Generated with discovered.json: 0xd07f3085998e74343ee0a17d6a02a9c2afaec13d

# Diff at Mon, 14 Oct 2024 11:00:09 GMT:

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

Generated with discovered.json: 0x4a5cbb655b96453e6821e3bf742e1d536904f968

# Diff at Tue, 01 Oct 2024 11:13:47 GMT:

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

Generated with discovered.json: 0x84e38713f0b3bd025cebf4bb5c4e78d95ea8e44d

# Diff at Fri, 23 Aug 2024 09:58:09 GMT:

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

Generated with discovered.json: 0x1905cc12f86e0f4b503b6aace0f089b0a806c935

# Diff at Wed, 21 Aug 2024 10:08:30 GMT:

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

Generated with discovered.json: 0x6d61dd041ac7cfe1d6066bcc4aeb09af1b31ecf6

# Diff at Fri, 09 Aug 2024 10:14:36 GMT:

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

Generated with discovered.json: 0xa60c828e6991456efad02a8d4a404f080ec9a992

# Diff at Mon, 27 May 2024 07:13:22 GMT:

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
