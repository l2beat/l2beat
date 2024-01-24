# Diff at Tue, 19 Dec 2023 13:36:06 GMT:

- author: Michał Sobieraj-Jakubiec (<michalsidzej@gmail.com>)
- comparing to: master@1e70db199340dc9df7ac0996900e54067b9d4f12

## Description

Added new config values.

## Watched changes

```diff
    contract UltraLightNodeV2 (0x4D73AdB72bC3DD368966edD0f0b2148401A178E2) {
      values.stargateOracles[1]:
+        "0x000000000000000000000000d56e4eab23cb81f43168f9f45211eb027b9ac7cc"
      values.stargateOracles[0]:
+        "0x0000000000000000000000005a54fe5234e811466d5366846283323c954310b2"
      values.stargateRelayers[0]:
+        "0x000000000000000000000000902f09715b6303d4173037652fa7377e5b98089e"
    }
```

# Diff at Thu, 23 Nov 2023 13:31:10 GMT:

- author: Amin Latifi (<a.latifi.al@gmail.com>)
- comparing to: master@2ff45714640abe4c50d283967078888d4af81d78

## Description

StarGateFeeLibrary7 owner was replaced: 0x1D7C6783328C145393e84fb47a7f7C548f5Ee28d -> 0x65bb797c2B9830d891D87288F029ed8dACc19705

## Watched changes

```diff
    contract StarGateFeeLibrary7 (0x8C3085D9a554884124C998CDB7f6d7219E9C1e6F) {
      values.owner:
-        "0x1D7C6783328C145393e84fb47a7f7C548f5Ee28d"
+        "0x65bb797c2B9830d891D87288F029ed8dACc19705"
    }
```

# Diff at Fri, 17 Nov 2023 12:24:03 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: master@8df7aef75226275b8e56ba8d4d76ce64057b0360

## Description

One EOA owner was replaced in StarGate Multisig:

- removed: 0x285b7EEa81a5B66B62e7276a24c1e0F83F7409c1
- added: 0x2E1078e128e8AA6A70eC8d1B17A79Fc4B457d437

The same change was performed on a multisig in the Aptos project.

## Watched changes

```diff
    contract StarGate Multisig (0x65bb797c2B9830d891D87288F029ed8dACc19705) {
      values.getOwners.2:
-        "0x285b7EEa81a5B66B62e7276a24c1e0F83F7409c1"
+        "0x1D7C6783328C145393e84fb47a7f7C548f5Ee28d"
      values.getOwners.1:
-        "0x1D7C6783328C145393e84fb47a7f7C548f5Ee28d"
+        "0x565cFd7224bbc2a81a6e2a1464892ecB27efB070"
      values.getOwners.0:
-        "0x565cFd7224bbc2a81a6e2a1464892ecB27efB070"
+        "0x2E1078e128e8AA6A70eC8d1B17A79Fc4B457d437"
    }
```
