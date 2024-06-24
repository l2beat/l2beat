Generated with discovered.json: 0x7d9c7efe70d89f42c067b8ffba21cc86d50c1aee

# Diff at Thu, 20 Jun 2024 10:35:13 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@aec998c0b1729b92e258e393212527022a7342b5 block: 19475340
- current block number: 20132375

## Description

The implementation of an unverified proxy is changed to a new unverified implementation. This address has the role PolicyAdmin in the ETH Vault and can set fees and pause / unpause.

## Watched changes

```diff
    contract  (0x09F3320e8d2dBD8913659bAb28940bb4f041eaD8) {
    +++ description: None
      upgradeability.implementation:
-        "0x2BeBced27D2c7ECE9C6cEa9daFD2711aDdc8a1Bc"
+        "0xb4D37E8f6e970344c1cc99F65D8D1Afd5F7590D9"
      implementations.0:
-        "0x2BeBced27D2c7ECE9C6cEa9daFD2711aDdc8a1Bc"
+        "0xb4D37E8f6e970344c1cc99F65D8D1Afd5F7590D9"
    }
```

Generated with discovered.json: 0x0eea6c81a69f735161ed485b33e25b8b32f9fb13

# Diff at Wed, 20 Mar 2024 10:33:43 GMT:

- author: sekuba (<sekuba@users.noreply.github.com>)
- comparing to: main@0a58f72fc0c5d7145b2e613962ce55cee5c1b355 block: 19224708
- current block number: 19475340

## Description

The policyAdmin is changed from an EOA to an unverified smart contract.
Required validators' signatures for an upgrade or withdrawal are decreased from 7 to 6 out of 10.

## Watched changes

```diff
    contract ETH Vault (0x1Bf68A9d1EaEe7826b3593C20a0ca93293cb489a) {
    +++ description: None
+++ description: Can set bridging fees, gas limits and can pause / unpause the bridge or censor individual withdrawals.
+++ type: PERMISSION
+++ severity: MEDIUM
      values.policyAdmin:
-        "0x4C35e473D57cF4daA90BB9FE341CeDEc81124d05"
+        "0x09F3320e8d2dBD8913659bAb28940bb4f041eaD8"
+++ description: Threshold of the bridge governance admin multisig
+++ type: PERMISSION
+++ severity: HIGH
      values.required:
-        7
+        6
    }
```

```diff
+   Status: CREATED
    contract  (0x09F3320e8d2dBD8913659bAb28940bb4f041eaD8)
    +++ description: None
```

```diff
+   Status: CREATED
    contract  (0xc045b35d1cf9501B2fc95e7c489FDA96345A4D70)
    +++ description: None
```

## Source code changes

```diff
.../-0x09F3320e8d2dBD8913659bAb28940bb4f041eaD8/implementation/meta.txt | 2 ++
 .../.code/-0x09F3320e8d2dBD8913659bAb28940bb4f041eaD8/proxy/meta.txt    | 2 ++
 .../ethereum/.code/-0xc045b35d1cf9501B2fc95e7c489FDA96345A4D70/meta.txt | 2 ++
 3 files changed, 6 insertions(+)
```

Generated with discovered.json: 0x234afadbeb23f4a7f3f1b173e251e6330e692eee

# Diff at Wed, 14 Feb 2024 07:26:34 GMT:

- author: Radina Talanova (<nt.radina@gmail.com>)
- comparing to: main@90897a821f9f4b90bdbfba06a5a5aa77fc31e145 block: 19064000
- current block number: 19224708

## Description

Change in ETH Vault owners (4 of the addresses are replaced with new ones).

## Watched changes

```diff
    contract ETH Vault (0x1Bf68A9d1EaEe7826b3593C20a0ca93293cb489a) {
      values.getOwners.9:
-        "0x7F4b332611818aE13c76f9222e2229f274Ded9BD"
+        "0x86cec292d5d5DB6bA16722F0B01291426C4b61E2"
      values.getOwners.5:
-        "0x595f1a527527Fa28A8C5f294c49E51B9799fdAF0"
+        "0x8c7aa8Bf53f881703e7a9672C863Eb6147e43214"
      values.getOwners.1:
-        "0x67C3c784C49d9ab8757ADb71491df1A1B38FbFA8"
+        "0x98A86EB9Ff3B473E61B7b7a82Dd2c328323A66D0"
      values.getOwners.0:
-        "0x8a3F117Ef3b40f1661Dedf7f28fC33E7b6fae4F8"
+        "0x35f720fd3042EC8b05b7c8C8c0B33e45d71ad5Ba"
    }
```

Generated with discovered.json: 0x95c69471a8ecde9d0f3e88c6212cfd0117cae535

# Diff at Mon, 22 Jan 2024 18:20:21 GMT

- author: Michał Podsiadły (<michal.podsiadly@l2beat.com>)
- comparing to: main@f58cc44bf923844f52038487bcd5a563329f4b43 block: 17913544
- current block number: 19064000

## Description

ETH Vault has been deactivated.

## Watched changes

```diff
    contract ETH Vault (0x1Bf68A9d1EaEe7826b3593C20a0ca93293cb489a) {
      values.isActivated:
-        true
+        false
    }
```
