Generated with discovered.json: 0xe8a0de42ecea568478643af5de21834d1b89290c

# Diff at Mon, 20 Oct 2025 15:26:52 GMT:

- author: vincfurc (<10850139+vincfurc@users.noreply.github.com>)
- comparing to: main@bfe80e92f67656ee716f7ab40cc8f3f9e92dc7d6 block: 1758795850
- current timestamp: 1760973938

## Description

New staker.

## Watched changes

```diff
    contract L1Staking (eth:0x0Dc417F8AF88388737c5053FF73f345f080543F7) {
    +++ description: Contract keeping track of stakers which act as sequencers/proposes. It is responsible for stakers registering and withdrawals and for verifying BLS signatures of stakers (currently not implemented).
      values.getActiveStakers.3:
+        "eth:0x76F91869161dC4348230D5F60883Dd17462035f4"
    }
```

Generated with discovered.json: 0xd9fb1807158ea919c9a3fa8989e2cdcc89960134

# Diff at Thu, 25 Sep 2025 10:25:13 GMT:

- author: Sergey Shemyakov (<sergey.shemyakov@l2beat.com>)
- comparing to: main@08eb3e2b6dafb4d1e7d4a8e779cd4e303c71568e block: 1758621561
- current timestamp: 1758795850

## Description

Removed 5 members of multisig, added 2 new members that were a part of another multisig.

## Watched changes

```diff
    contract Morph Multisig 2 (eth:0xB822319ab7848b7cC4537c8409e50f85BFb04377) {
    +++ description: None
      values.$members.0:
-        "eth:0x19C0CebaEC6EDb61c00178Cf8c6112BAD5Ef68E6"
      values.$members.1:
-        "eth:0xa79fEE4418338B59B8C6c93b87777A89F57c0Fd3"
      values.$members.2:
-        "eth:0x429087D7cb89cD816b80804bCE9c7b1A1FFE229F"
+        "eth:0xC7F81B58ec3937D11Bf4BA74C04FF69e944423F2"
      values.$members.3:
-        "eth:0x0659dF9D53A987e3aDaa9019407431413A101eF3"
+        "eth:0xbA430e784fe11ADbc20fa1a99193eeD87ACD68C7"
      values.$members.6:
-        "eth:0xAD249861A911717fE74FA329fEC3c619f55DfFDf"
      values.$threshold:
-        5
+        3
      values.multisigThreshold:
-        "5 of 8 (63%)"
+        "3 of 5 (60%)"
    }
```

Generated with discovered.json: 0xed34c197a104a6366dbeac0f6ff4d78762a6f299

# Diff at Tue, 23 Sep 2025 10:00:23 GMT:

- author: Sergey Shemyakov (<sergey.shemyakov@l2beat.com>)
- comparing to: main@b6e19f60c69fa605df017b3852b7ffb8d92b60cf block: 1758269993
- current timestamp: 1758621561

## Description

Multisig update, new signer was already a member of Multisig 2.

## Watched changes

```diff
    contract Morph Multisig 1 (eth:0xF101f7f59A348c1F971A2BC64fdBdA58c7bBD887) {
    +++ description: None
      values.$members.0:
+        "eth:0x05e1d4694041aF987Af6F8402D902686018E2136"
      values.$threshold:
-        3
+        4
      values.multisigThreshold:
-        "3 of 5 (60%)"
+        "4 of 6 (67%)"
    }
```

Generated with discovered.json: 0xdf7f5d9659cc3b737f86d2e4c41221b19ffdc9ec

# Diff at Fri, 19 Sep 2025 08:20:56 GMT:

- author: Sergey Shemyakov (<sergey.shemyakov@l2beat.com>)
- comparing to: main@db1760252dd9dd68603e4c71d0f4e284d5d0d15f block: 1758186428
- current timestamp: 1758269993

## Description

Removed a member of morph multisig 1, this address stays a member of morph multisig 2.

## Watched changes

```diff
    contract Morph Multisig 1 (eth:0xF101f7f59A348c1F971A2BC64fdBdA58c7bBD887) {
    +++ description: None
      values.$members.5:
-        "eth:0x0659dF9D53A987e3aDaa9019407431413A101eF3"
      values.multisigThreshold:
-        "3 of 6 (50%)"
+        "3 of 5 (60%)"
    }
```

Generated with discovered.json: 0x8bde2188efe9de48fa02c980bb73248170245dab

# Diff at Thu, 18 Sep 2025 09:08:11 GMT:

- author: Sergey Shemyakov (<sergey.shemyakov@l2beat.com>)
- comparing to: main@36e98eaeb23cc6fe43ec50708b5af9a452891d86 block: 1756804333
- current timestamp: 1758186428

## Description

Added a new member to Morph multisig 1, this address already was a member of morph multisig 2.

## Watched changes

```diff
    contract Morph Multisig 1 (eth:0xF101f7f59A348c1F971A2BC64fdBdA58c7bBD887) {
    +++ description: None
      values.$members.0:
+        "eth:0x59C09F33d7D901b8B57644D68a45b123e9Bbd0E5"
      values.multisigThreshold:
-        "3 of 5 (60%)"
+        "3 of 6 (50%)"
    }
```

Generated with discovered.json: 0xd34b8bb01741e2082b5bdc67c278560374a65e5e

# Diff at Tue, 02 Sep 2025 09:13:34 GMT:

- author: Luca Donno (<donnoh99@gmail.com>)
- comparing to: main@1144aeaf984988c003c97be3791eeda76896f8ca block: 1756453192
- current timestamp: 1756804333

## Description

Multisig update.

## Watched changes

```diff
    contract Morph Multisig 1 (eth:0xF101f7f59A348c1F971A2BC64fdBdA58c7bBD887) {
    +++ description: None
      values.$members.5:
-        "eth:0x59C09F33d7D901b8B57644D68a45b123e9Bbd0E5"
      values.multisigThreshold:
-        "3 of 6 (50%)"
+        "3 of 5 (60%)"
    }
```

Generated with discovered.json: 0x1b48ab3f55afb4ebed8bad76602b3303275dd5d7

# Diff at Mon, 01 Sep 2025 10:01:10 GMT:

Merge mark

Generated with discovered.json: 0x4bac8d4356bcbe6489966d2a7f6fa5c27828501a

# Diff at Fri, 29 Aug 2025 07:41:15 GMT:

- chain: ethereum
- author: Luca Donno (<donnoh99@gmail.com>)
- comparing to: main@e68cba094085f7ab7e642304a942701f260f19fb block: 1750690607
- current timestamp: 1756453192

## Description

Msig changes.

## Watched changes

```diff
    contract Morph Multisig 1 (0xF101f7f59A348c1F971A2BC64fdBdA58c7bBD887) {
    +++ description: None
      values.$members.0:
+        "eth:0xe72BB9d10f6eA936D7D4507d298ab867128aF54C"
      values.$members.1:
+        "eth:0x27f05308F4b80242d3Dca1D5e9c3aE976098E9C8"
      values.$members.2:
+        "eth:0xC7F81B58ec3937D11Bf4BA74C04FF69e944423F2"
      values.$members.3:
+        "eth:0xbA430e784fe11ADbc20fa1a99193eeD87ACD68C7"
      values.$members.2:
-        "eth:0x19C0CebaEC6EDb61c00178Cf8c6112BAD5Ef68E6"
      values.$members.3:
-        "eth:0xcE7257224441385345CE6eEdd9D8667AD9Bab9f0"
      values.$members.4:
-        "eth:0x35B98995048b320f2DaFFAD5BaD5884F16e488A9"
      values.$members.5:
-        "eth:0x1DeBbDae435295eC72b904Cc8B476BA81a63BAdb"
      values.$members.6:
-        "eth:0x0B3d220254e407a780EA7498d51b6d4fef807Bd0"
      values.$members.7:
-        "eth:0xf39D8310a7DFEc320bD17bddE32A53d47e340B2e"
      values.$threshold:
-        5
+        3
      values.multisigThreshold:
-        "5 of 8 (63%)"
+        "3 of 6 (50%)"
    }
```

Generated with discovered.json: 0xbd44bc6448127fe87a43b1595f24fcc496f6d704

# Diff at Mon, 14 Jul 2025 12:45:26 GMT:

- chain: ethereum
- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@9f4300dad2f3d080cd56fa311d4a848556c74e72 block: 22767866
- current block number: 22767866

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22767866 (main branch discovery), not current.

```diff
    EOA  (0x000000000000000000000000000000000000dEaD) {
    +++ description: None
      address:
-        "0x000000000000000000000000000000000000dEaD"
+        "eth:0x000000000000000000000000000000000000dEaD"
    }
```

```diff
    EOA  (0x0092bC49078f130D27e70dBeee441E227280B97D) {
    +++ description: None
      address:
-        "0x0092bC49078f130D27e70dBeee441E227280B97D"
+        "eth:0x0092bC49078f130D27e70dBeee441E227280B97D"
    }
```

```diff
    EOA  (0x03FD36AEd3b2597aA79bb5f543f3a0eAf9DEB0FA) {
    +++ description: None
      address:
-        "0x03FD36AEd3b2597aA79bb5f543f3a0eAf9DEB0FA"
+        "eth:0x03FD36AEd3b2597aA79bb5f543f3a0eAf9DEB0FA"
    }
```

```diff
    EOA  (0x05e1d4694041aF987Af6F8402D902686018E2136) {
    +++ description: None
      address:
-        "0x05e1d4694041aF987Af6F8402D902686018E2136"
+        "eth:0x05e1d4694041aF987Af6F8402D902686018E2136"
    }
```

```diff
    EOA  (0x0659dF9D53A987e3aDaa9019407431413A101eF3) {
    +++ description: None
      address:
-        "0x0659dF9D53A987e3aDaa9019407431413A101eF3"
+        "eth:0x0659dF9D53A987e3aDaa9019407431413A101eF3"
    }
```

```diff
    EOA  (0x0B3d220254e407a780EA7498d51b6d4fef807Bd0) {
    +++ description: None
      address:
-        "0x0B3d220254e407a780EA7498d51b6d4fef807Bd0"
+        "eth:0x0B3d220254e407a780EA7498d51b6d4fef807Bd0"
    }
```

```diff
    contract L1Staking (0x0Dc417F8AF88388737c5053FF73f345f080543F7) {
    +++ description: Contract keeping track of stakers which act as sequencers/proposes. It is responsible for stakers registering and withdrawals and for verifying BLS signatures of stakers (currently not implemented).
      address:
-        "0x0Dc417F8AF88388737c5053FF73f345f080543F7"
+        "eth:0x0Dc417F8AF88388737c5053FF73f345f080543F7"
      values.$admin:
-        "0x31110622D6CA24c9FF307d6ae1715F16E47F16A0"
+        "eth:0x31110622D6CA24c9FF307d6ae1715F16E47F16A0"
      values.$implementation:
-        "0xDb0734109051DaAB5c32E45e9a5ad0548B2df714"
+        "eth:0xDb0734109051DaAB5c32E45e9a5ad0548B2df714"
      values.$pastUpgrades.0.2.0:
-        "0x98dF320641C2E65ab4BbeF1e6f6C66D9B50EdE5F"
+        "eth:0x98dF320641C2E65ab4BbeF1e6f6C66D9B50EdE5F"
      values.$pastUpgrades.1.2.0:
-        "0xDb0734109051DaAB5c32E45e9a5ad0548B2df714"
+        "eth:0xDb0734109051DaAB5c32E45e9a5ad0548B2df714"
      values.deleteList.0:
-        "0xa59B26DB10C5Ca26a97AA2Fd2E74CB8DA9D1EB65"
+        "eth:0xa59B26DB10C5Ca26a97AA2Fd2E74CB8DA9D1EB65"
      values.deleteList.1:
-        "0xf834ffbeb6bB3F4841afc6b5FB40B94cd580fa23"
+        "eth:0xf834ffbeb6bB3F4841afc6b5FB40B94cd580fa23"
      values.deleteList.2:
-        "0x61F2945d4bc9E40B66a6376d1094a50438f613e2"
+        "eth:0x61F2945d4bc9E40B66a6376d1094a50438f613e2"
      values.deleteList.3:
-        "0xb6cF39ee72e0127E6Ea6059e38B8C197227a6ac7"
+        "eth:0xb6cF39ee72e0127E6Ea6059e38B8C197227a6ac7"
      values.getActiveStakers.0:
-        "0x6aB0E960911b50f6d14f249782ac12EC3E7584A0"
+        "eth:0x6aB0E960911b50f6d14f249782ac12EC3E7584A0"
      values.getActiveStakers.1:
-        "0xBBA36CdF020788f0D08D5688c0Bee3fb30ce1C80"
+        "eth:0xBBA36CdF020788f0D08D5688c0Bee3fb30ce1C80"
      values.getActiveStakers.2:
-        "0x34E387B37d3ADEAa6D5B92cE30dE3af3DCa39796"
+        "eth:0x34E387B37d3ADEAa6D5B92cE30dE3af3DCa39796"
      values.getStakersFromBitmap.0.0:
-        "0x6aB0E960911b50f6d14f249782ac12EC3E7584A0"
+        "eth:0x6aB0E960911b50f6d14f249782ac12EC3E7584A0"
      values.getStakersFromBitmap.1.0:
-        "0x6aB0E960911b50f6d14f249782ac12EC3E7584A0"
+        "eth:0x6aB0E960911b50f6d14f249782ac12EC3E7584A0"
      values.getStakersFromBitmap.2.0:
-        "0xBBA36CdF020788f0D08D5688c0Bee3fb30ce1C80"
+        "eth:0xBBA36CdF020788f0D08D5688c0Bee3fb30ce1C80"
      values.messenger:
-        "0xDc71366EFFA760804DCFC3EDF87fa2A6f1623304"
+        "eth:0xDc71366EFFA760804DCFC3EDF87fa2A6f1623304"
      values.MESSENGER:
-        "0xDc71366EFFA760804DCFC3EDF87fa2A6f1623304"
+        "eth:0xDc71366EFFA760804DCFC3EDF87fa2A6f1623304"
      values.OTHER_STAKING:
-        "0x5300000000000000000000000000000000000015"
+        "eth:0x5300000000000000000000000000000000000015"
      values.owner:
-        "0xB822319ab7848b7cC4537c8409e50f85BFb04377"
+        "eth:0xB822319ab7848b7cC4537c8409e50f85BFb04377"
      values.rollupContract:
-        "0x759894Ced0e6af42c26668076Ffa84d02E3CeF60"
+        "eth:0x759894Ced0e6af42c26668076Ffa84d02E3CeF60"
      implementationNames.0x0Dc417F8AF88388737c5053FF73f345f080543F7:
-        "TransparentUpgradeableProxy"
      implementationNames.0xDb0734109051DaAB5c32E45e9a5ad0548B2df714:
-        "L1Staking"
      implementationNames.eth:0x0Dc417F8AF88388737c5053FF73f345f080543F7:
+        "TransparentUpgradeableProxy"
      implementationNames.eth:0xDb0734109051DaAB5c32E45e9a5ad0548B2df714:
+        "L1Staking"
    }
```

```diff
    EOA  (0x1721D3Ae2d68E3Dd32525400Ed2a29060F1300c6) {
    +++ description: None
      address:
-        "0x1721D3Ae2d68E3Dd32525400Ed2a29060F1300c6"
+        "eth:0x1721D3Ae2d68E3Dd32525400Ed2a29060F1300c6"
    }
```

```diff
    EOA  (0x19C0CebaEC6EDb61c00178Cf8c6112BAD5Ef68E6) {
    +++ description: None
      address:
-        "0x19C0CebaEC6EDb61c00178Cf8c6112BAD5Ef68E6"
+        "eth:0x19C0CebaEC6EDb61c00178Cf8c6112BAD5Ef68E6"
    }
```

```diff
    contract L1ETHGateway (0x1C1Ffb5828c3A48B54E8910F1c75256a498aDE68) {
    +++ description: Contract used to bridge ETH from L1 to L2.
      address:
-        "0x1C1Ffb5828c3A48B54E8910F1c75256a498aDE68"
+        "eth:0x1C1Ffb5828c3A48B54E8910F1c75256a498aDE68"
      values.$admin:
-        "0x31110622D6CA24c9FF307d6ae1715F16E47F16A0"
+        "eth:0x31110622D6CA24c9FF307d6ae1715F16E47F16A0"
      values.$implementation:
-        "0x63eeCb6bE6087B094c2CBAA34f2902593eAE979c"
+        "eth:0x63eeCb6bE6087B094c2CBAA34f2902593eAE979c"
      values.$pastUpgrades.0.2.0:
-        "0x98dF320641C2E65ab4BbeF1e6f6C66D9B50EdE5F"
+        "eth:0x98dF320641C2E65ab4BbeF1e6f6C66D9B50EdE5F"
      values.$pastUpgrades.1.2.0:
-        "0x63eeCb6bE6087B094c2CBAA34f2902593eAE979c"
+        "eth:0x63eeCb6bE6087B094c2CBAA34f2902593eAE979c"
      values.counterpart:
-        "0x5300000000000000000000000000000000000006"
+        "eth:0x5300000000000000000000000000000000000006"
      values.messenger:
-        "0xDc71366EFFA760804DCFC3EDF87fa2A6f1623304"
+        "eth:0xDc71366EFFA760804DCFC3EDF87fa2A6f1623304"
      values.owner:
-        "0xB822319ab7848b7cC4537c8409e50f85BFb04377"
+        "eth:0xB822319ab7848b7cC4537c8409e50f85BFb04377"
      values.router:
-        "0x7497756ADA7e656aE9f00781aF49Fc0fD08f8A8a"
+        "eth:0x7497756ADA7e656aE9f00781aF49Fc0fD08f8A8a"
      implementationNames.0x1C1Ffb5828c3A48B54E8910F1c75256a498aDE68:
-        "TransparentUpgradeableProxy"
      implementationNames.0x63eeCb6bE6087B094c2CBAA34f2902593eAE979c:
-        "L1ETHGateway"
      implementationNames.eth:0x1C1Ffb5828c3A48B54E8910F1c75256a498aDE68:
+        "TransparentUpgradeableProxy"
      implementationNames.eth:0x63eeCb6bE6087B094c2CBAA34f2902593eAE979c:
+        "L1ETHGateway"
    }
```

```diff
    EOA  (0x1DeBbDae435295eC72b904Cc8B476BA81a63BAdb) {
    +++ description: None
      address:
-        "0x1DeBbDae435295eC72b904Cc8B476BA81a63BAdb"
+        "eth:0x1DeBbDae435295eC72b904Cc8B476BA81a63BAdb"
    }
```

```diff
    EOA  (0x234aCb24b1DeeA7f6c7530b8c29a6378bA21e1D0) {
    +++ description: None
      address:
-        "0x234aCb24b1DeeA7f6c7530b8c29a6378bA21e1D0"
+        "eth:0x234aCb24b1DeeA7f6c7530b8c29a6378bA21e1D0"
    }
```

```diff
    contract ProxyAdmin (0x31110622D6CA24c9FF307d6ae1715F16E47F16A0) {
    +++ description: None
      address:
-        "0x31110622D6CA24c9FF307d6ae1715F16E47F16A0"
+        "eth:0x31110622D6CA24c9FF307d6ae1715F16E47F16A0"
      values.owner:
-        "0xF101f7f59A348c1F971A2BC64fdBdA58c7bBD887"
+        "eth:0xF101f7f59A348c1F971A2BC64fdBdA58c7bBD887"
      implementationNames.0x31110622D6CA24c9FF307d6ae1715F16E47F16A0:
-        "ProxyAdmin"
      implementationNames.eth:0x31110622D6CA24c9FF307d6ae1715F16E47F16A0:
+        "ProxyAdmin"
    }
```

```diff
    EOA  (0x323a78C1c910b282dE98a557d735628A02E00983) {
    +++ description: None
      address:
-        "0x323a78C1c910b282dE98a557d735628A02E00983"
+        "eth:0x323a78C1c910b282dE98a557d735628A02E00983"
    }
```

```diff
    EOA  (0x34E387B37d3ADEAa6D5B92cE30dE3af3DCa39796) {
    +++ description: None
      address:
-        "0x34E387B37d3ADEAa6D5B92cE30dE3af3DCa39796"
+        "eth:0x34E387B37d3ADEAa6D5B92cE30dE3af3DCa39796"
    }
```

```diff
    EOA  (0x35B98995048b320f2DaFFAD5BaD5884F16e488A9) {
    +++ description: None
      address:
-        "0x35B98995048b320f2DaFFAD5BaD5884F16e488A9"
+        "eth:0x35B98995048b320f2DaFFAD5BaD5884F16e488A9"
    }
```

```diff
    contract L1MessageQueueWithGasPriceOracle (0x3931Ade842F5BB8763164bDd81E5361DcE6cC1EF) {
    +++ description: Contains the array of queued L1 -> L2 messages, either appended using the L1Messenger or the EnforcedTxGateway.
      address:
-        "0x3931Ade842F5BB8763164bDd81E5361DcE6cC1EF"
+        "eth:0x3931Ade842F5BB8763164bDd81E5361DcE6cC1EF"
      values.$admin:
-        "0x31110622D6CA24c9FF307d6ae1715F16E47F16A0"
+        "eth:0x31110622D6CA24c9FF307d6ae1715F16E47F16A0"
      values.$implementation:
-        "0xa3b5bFB885FF92EB8445f262c289548e77c3c0aA"
+        "eth:0xa3b5bFB885FF92EB8445f262c289548e77c3c0aA"
      values.$pastUpgrades.0.2.0:
-        "0x98dF320641C2E65ab4BbeF1e6f6C66D9B50EdE5F"
+        "eth:0x98dF320641C2E65ab4BbeF1e6f6C66D9B50EdE5F"
      values.$pastUpgrades.1.2.0:
-        "0x828F68e2E05a34fA836416F124350E25021876ac"
+        "eth:0x828F68e2E05a34fA836416F124350E25021876ac"
      values.$pastUpgrades.2.2.0:
-        "0xa3b5bFB885FF92EB8445f262c289548e77c3c0aA"
+        "eth:0xa3b5bFB885FF92EB8445f262c289548e77c3c0aA"
      values.ENFORCED_TX_GATEWAAY:
-        "0xc5Fa3b8968c7FAbEeA2B530a20b88d0C2eD8abb7"
+        "eth:0xc5Fa3b8968c7FAbEeA2B530a20b88d0C2eD8abb7"
      values.MESSENGER:
-        "0xDc71366EFFA760804DCFC3EDF87fa2A6f1623304"
+        "eth:0xDc71366EFFA760804DCFC3EDF87fa2A6f1623304"
      values.owner:
-        "0xB822319ab7848b7cC4537c8409e50f85BFb04377"
+        "eth:0xB822319ab7848b7cC4537c8409e50f85BFb04377"
      values.ROLLUP_CONTRACT:
-        "0x759894Ced0e6af42c26668076Ffa84d02E3CeF60"
+        "eth:0x759894Ced0e6af42c26668076Ffa84d02E3CeF60"
      values.whitelistChecker:
-        "0xFFafDd9167777C0e5421e0B6789D6d7A5E386984"
+        "eth:0xFFafDd9167777C0e5421e0B6789D6d7A5E386984"
      implementationNames.0x3931Ade842F5BB8763164bDd81E5361DcE6cC1EF:
-        "TransparentUpgradeableProxy"
      implementationNames.0xa3b5bFB885FF92EB8445f262c289548e77c3c0aA:
-        "L1MessageQueueWithGasPriceOracle"
      implementationNames.eth:0x3931Ade842F5BB8763164bDd81E5361DcE6cC1EF:
+        "TransparentUpgradeableProxy"
      implementationNames.eth:0xa3b5bFB885FF92EB8445f262c289548e77c3c0aA:
+        "L1MessageQueueWithGasPriceOracle"
    }
```

```diff
    contract ZkEvmVerifierV1 (0x4006FDA79493FEE14dA42BfA34575aAA79bcf953) {
    +++ description: Current SP1 verifier using Blobs for DA.
      address:
-        "0x4006FDA79493FEE14dA42BfA34575aAA79bcf953"
+        "eth:0x4006FDA79493FEE14dA42BfA34575aAA79bcf953"
      implementationNames.0x4006FDA79493FEE14dA42BfA34575aAA79bcf953:
-        "ZkEvmVerifierV1"
      implementationNames.eth:0x4006FDA79493FEE14dA42BfA34575aAA79bcf953:
+        "ZkEvmVerifierV1"
    }
```

```diff
    EOA  (0x429087D7cb89cD816b80804bCE9c7b1A1FFE229F) {
    +++ description: None
      address:
-        "0x429087D7cb89cD816b80804bCE9c7b1A1FFE229F"
+        "eth:0x429087D7cb89cD816b80804bCE9c7b1A1FFE229F"
    }
```

```diff
    contract L1StandardERC20Gateway (0x44c28f61A5C2Dd24Fc71D7Df8E85e18af4ab2Bd8) {
    +++ description: Contract used to bridge ERC20 tokens from L1 to L2. It uses a fixed token list.
      address:
-        "0x44c28f61A5C2Dd24Fc71D7Df8E85e18af4ab2Bd8"
+        "eth:0x44c28f61A5C2Dd24Fc71D7Df8E85e18af4ab2Bd8"
      values.$admin:
-        "0x31110622D6CA24c9FF307d6ae1715F16E47F16A0"
+        "eth:0x31110622D6CA24c9FF307d6ae1715F16E47F16A0"
      values.$implementation:
-        "0x75BC012fA81DF052baFc4EF9255Af29B6C4e5301"
+        "eth:0x75BC012fA81DF052baFc4EF9255Af29B6C4e5301"
      values.$pastUpgrades.0.2.0:
-        "0x98dF320641C2E65ab4BbeF1e6f6C66D9B50EdE5F"
+        "eth:0x98dF320641C2E65ab4BbeF1e6f6C66D9B50EdE5F"
      values.$pastUpgrades.1.2.0:
-        "0x75BC012fA81DF052baFc4EF9255Af29B6C4e5301"
+        "eth:0x75BC012fA81DF052baFc4EF9255Af29B6C4e5301"
      values.counterpart:
-        "0x5300000000000000000000000000000000000008"
+        "eth:0x5300000000000000000000000000000000000008"
      values.l2TokenFactory:
-        "0x530000000000000000000000000000000000000e"
+        "eth:0x530000000000000000000000000000000000000e"
      values.l2TokenImplementation:
-        "0x530000000000000000000000000000000000000D"
+        "eth:0x530000000000000000000000000000000000000D"
      values.messenger:
-        "0xDc71366EFFA760804DCFC3EDF87fa2A6f1623304"
+        "eth:0xDc71366EFFA760804DCFC3EDF87fa2A6f1623304"
      values.owner:
-        "0xB822319ab7848b7cC4537c8409e50f85BFb04377"
+        "eth:0xB822319ab7848b7cC4537c8409e50f85BFb04377"
      values.router:
-        "0x7497756ADA7e656aE9f00781aF49Fc0fD08f8A8a"
+        "eth:0x7497756ADA7e656aE9f00781aF49Fc0fD08f8A8a"
      implementationNames.0x44c28f61A5C2Dd24Fc71D7Df8E85e18af4ab2Bd8:
-        "TransparentUpgradeableProxy"
      implementationNames.0x75BC012fA81DF052baFc4EF9255Af29B6C4e5301:
-        "L1StandardERC20Gateway"
      implementationNames.eth:0x44c28f61A5C2Dd24Fc71D7Df8E85e18af4ab2Bd8:
+        "TransparentUpgradeableProxy"
      implementationNames.eth:0x75BC012fA81DF052baFc4EF9255Af29B6C4e5301:
+        "L1StandardERC20Gateway"
    }
```

```diff
    EOA  (0x4Ee3690901157bE86A33371bEc1e5021A10Ba47C) {
    +++ description: None
      address:
-        "0x4Ee3690901157bE86A33371bEc1e5021A10Ba47C"
+        "eth:0x4Ee3690901157bE86A33371bEc1e5021A10Ba47C"
    }
```

```diff
    EOA  (0x5300000000000000000000000000000000000006) {
    +++ description: None
      address:
-        "0x5300000000000000000000000000000000000006"
+        "eth:0x5300000000000000000000000000000000000006"
    }
```

```diff
    EOA  (0x5300000000000000000000000000000000000007) {
    +++ description: None
      address:
-        "0x5300000000000000000000000000000000000007"
+        "eth:0x5300000000000000000000000000000000000007"
    }
```

```diff
    EOA  (0x5300000000000000000000000000000000000008) {
    +++ description: None
      address:
-        "0x5300000000000000000000000000000000000008"
+        "eth:0x5300000000000000000000000000000000000008"
    }
```

```diff
    EOA  (0x530000000000000000000000000000000000000D) {
    +++ description: None
      address:
-        "0x530000000000000000000000000000000000000D"
+        "eth:0x530000000000000000000000000000000000000D"
    }
```

```diff
    EOA  (0x530000000000000000000000000000000000000e) {
    +++ description: None
      address:
-        "0x530000000000000000000000000000000000000e"
+        "eth:0x530000000000000000000000000000000000000e"
    }
```

```diff
    EOA  (0x5300000000000000000000000000000000000015) {
    +++ description: None
      address:
-        "0x5300000000000000000000000000000000000015"
+        "eth:0x5300000000000000000000000000000000000015"
    }
```

```diff
    EOA  (0x59C09F33d7D901b8B57644D68a45b123e9Bbd0E5) {
    +++ description: None
      address:
-        "0x59C09F33d7D901b8B57644D68a45b123e9Bbd0E5"
+        "eth:0x59C09F33d7D901b8B57644D68a45b123e9Bbd0E5"
    }
```

```diff
    EOA  (0x5c6E1011cd3b5d7D2937c098b8F61d6B3d1aee7e) {
    +++ description: None
      address:
-        "0x5c6E1011cd3b5d7D2937c098b8F61d6B3d1aee7e"
+        "eth:0x5c6E1011cd3b5d7D2937c098b8F61d6B3d1aee7e"
    }
```

```diff
    contract MultipleVersionRollupVerifier (0x5d1584c27b4aD233283c6da1ca1B825d6f220EC1) {
    +++ description: Used to update the verifier and keep track of current and old versions.
      address:
-        "0x5d1584c27b4aD233283c6da1ca1B825d6f220EC1"
+        "eth:0x5d1584c27b4aD233283c6da1ca1B825d6f220EC1"
      values.latestVerifier.0.verifier:
-        "0xeF88951806f69974bD703Cb9E9eFE362EA0Eb154"
+        "eth:0xeF88951806f69974bD703Cb9E9eFE362EA0Eb154"
      values.latestVerifier.1.verifier:
-        "0x4006FDA79493FEE14dA42BfA34575aAA79bcf953"
+        "eth:0x4006FDA79493FEE14dA42BfA34575aAA79bcf953"
      values.owner:
-        "0xB822319ab7848b7cC4537c8409e50f85BFb04377"
+        "eth:0xB822319ab7848b7cC4537c8409e50f85BFb04377"
      values.rollup:
-        "0x759894Ced0e6af42c26668076Ffa84d02E3CeF60"
+        "eth:0x759894Ced0e6af42c26668076Ffa84d02E3CeF60"
      implementationNames.0x5d1584c27b4aD233283c6da1ca1B825d6f220EC1:
-        "MultipleVersionRollupVerifier"
      implementationNames.eth:0x5d1584c27b4aD233283c6da1ca1B825d6f220EC1:
+        "MultipleVersionRollupVerifier"
    }
```

```diff
    EOA  (0x611e4B24e89bC524Fc06f73b6FD02bE3Ec73d6Db) {
    +++ description: None
      address:
-        "0x611e4B24e89bC524Fc06f73b6FD02bE3Ec73d6Db"
+        "eth:0x611e4B24e89bC524Fc06f73b6FD02bE3Ec73d6Db"
    }
```

```diff
    EOA  (0x61F2945d4bc9E40B66a6376d1094a50438f613e2) {
    +++ description: None
      address:
-        "0x61F2945d4bc9E40B66a6376d1094a50438f613e2"
+        "eth:0x61F2945d4bc9E40B66a6376d1094a50438f613e2"
    }
```

```diff
    EOA  (0x6aB0E960911b50f6d14f249782ac12EC3E7584A0) {
    +++ description: None
      address:
-        "0x6aB0E960911b50f6d14f249782ac12EC3E7584A0"
+        "eth:0x6aB0E960911b50f6d14f249782ac12EC3E7584A0"
    }
```

```diff
    EOA  (0x6D7cC6C62CD6CcdaC482E82aA7A3763926e93854) {
    +++ description: None
      address:
-        "0x6D7cC6C62CD6CcdaC482E82aA7A3763926e93854"
+        "eth:0x6D7cC6C62CD6CcdaC482E82aA7A3763926e93854"
    }
```

```diff
    EOA  (0x71C10870dC38E54d987C22e96aB32b46cc08564F) {
    +++ description: None
      address:
-        "0x71C10870dC38E54d987C22e96aB32b46cc08564F"
+        "eth:0x71C10870dC38E54d987C22e96aB32b46cc08564F"
    }
```

```diff
    EOA  (0x74204e3801E9394848AbDBAd6f378d0b11e9a091) {
    +++ description: None
      address:
-        "0x74204e3801E9394848AbDBAd6f378d0b11e9a091"
+        "eth:0x74204e3801E9394848AbDBAd6f378d0b11e9a091"
    }
```

```diff
    contract L1GatewayRouter (0x7497756ADA7e656aE9f00781aF49Fc0fD08f8A8a) {
    +++ description: Main entry point for depositing ETH and ERC20 tokens, which are then forwarded to the correct gateway.
      address:
-        "0x7497756ADA7e656aE9f00781aF49Fc0fD08f8A8a"
+        "eth:0x7497756ADA7e656aE9f00781aF49Fc0fD08f8A8a"
      values.$admin:
-        "0x31110622D6CA24c9FF307d6ae1715F16E47F16A0"
+        "eth:0x31110622D6CA24c9FF307d6ae1715F16E47F16A0"
      values.$implementation:
-        "0x6D9623d44C4A1629815D9d6236FF25C4f82Cc819"
+        "eth:0x6D9623d44C4A1629815D9d6236FF25C4f82Cc819"
      values.$pastUpgrades.0.2.0:
-        "0x98dF320641C2E65ab4BbeF1e6f6C66D9B50EdE5F"
+        "eth:0x98dF320641C2E65ab4BbeF1e6f6C66D9B50EdE5F"
      values.$pastUpgrades.1.2.0:
-        "0x6D9623d44C4A1629815D9d6236FF25C4f82Cc819"
+        "eth:0x6D9623d44C4A1629815D9d6236FF25C4f82Cc819"
      values.defaultERC20Gateway:
-        "0x44c28f61A5C2Dd24Fc71D7Df8E85e18af4ab2Bd8"
+        "eth:0x44c28f61A5C2Dd24Fc71D7Df8E85e18af4ab2Bd8"
      values.ethGateway:
-        "0x1C1Ffb5828c3A48B54E8910F1c75256a498aDE68"
+        "eth:0x1C1Ffb5828c3A48B54E8910F1c75256a498aDE68"
      values.gatewayInContext:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      values.gateways.0:
-        "0x1C1Ffb5828c3A48B54E8910F1c75256a498aDE68"
+        "eth:0x1C1Ffb5828c3A48B54E8910F1c75256a498aDE68"
      values.owner:
-        "0xB822319ab7848b7cC4537c8409e50f85BFb04377"
+        "eth:0xB822319ab7848b7cC4537c8409e50f85BFb04377"
      implementationNames.0x7497756ADA7e656aE9f00781aF49Fc0fD08f8A8a:
-        "TransparentUpgradeableProxy"
      implementationNames.0x6D9623d44C4A1629815D9d6236FF25C4f82Cc819:
-        "L1GatewayRouter"
      implementationNames.eth:0x7497756ADA7e656aE9f00781aF49Fc0fD08f8A8a:
+        "TransparentUpgradeableProxy"
      implementationNames.eth:0x6D9623d44C4A1629815D9d6236FF25C4f82Cc819:
+        "L1GatewayRouter"
    }
```

```diff
    contract MorphRollup (0x759894Ced0e6af42c26668076Ffa84d02E3CeF60) {
    +++ description: The main contract of the Morph chain. Allows to post transaction data and state roots, implements challenge mechanism along with proofs. Sequencing and proposing are behind a whitelist.
      address:
-        "0x759894Ced0e6af42c26668076Ffa84d02E3CeF60"
+        "eth:0x759894Ced0e6af42c26668076Ffa84d02E3CeF60"
      values.$admin:
-        "0x31110622D6CA24c9FF307d6ae1715F16E47F16A0"
+        "eth:0x31110622D6CA24c9FF307d6ae1715F16E47F16A0"
      values.$implementation:
-        "0x9C79e8F5d0fE910d84a6a0d4A03E8136d036eBec"
+        "eth:0x9C79e8F5d0fE910d84a6a0d4A03E8136d036eBec"
      values.$pastUpgrades.0.2.0:
-        "0x98dF320641C2E65ab4BbeF1e6f6C66D9B50EdE5F"
+        "eth:0x98dF320641C2E65ab4BbeF1e6f6C66D9B50EdE5F"
      values.$pastUpgrades.1.2.0:
-        "0xcffdDbcb5B9EA2ee45ABA121e0849ADc87c38326"
+        "eth:0xcffdDbcb5B9EA2ee45ABA121e0849ADc87c38326"
      values.$pastUpgrades.2.2.0:
-        "0x073403E147a8e607b80985fe458c0B527287278F"
+        "eth:0x073403E147a8e607b80985fe458c0B527287278F"
      values.$pastUpgrades.3.2.0:
-        "0xaD900dB30Bcdf84c38Df0067eA327bbEccCF071A"
+        "eth:0xaD900dB30Bcdf84c38Df0067eA327bbEccCF071A"
      values.$pastUpgrades.4.2.0:
-        "0x43190DfD1F572Cb56B1942B44482d1774151D77A"
+        "eth:0x43190DfD1F572Cb56B1942B44482d1774151D77A"
      values.$pastUpgrades.5.2.0:
-        "0x9C79e8F5d0fE910d84a6a0d4A03E8136d036eBec"
+        "eth:0x9C79e8F5d0fE910d84a6a0d4A03E8136d036eBec"
      values.challengers.0:
-        "0xB822319ab7848b7cC4537c8409e50f85BFb04377"
+        "eth:0xB822319ab7848b7cC4537c8409e50f85BFb04377"
      values.challengers.1:
-        "0x77B29534738E3F0F297d36635d7884965C7c8cE1"
+        "eth:0x77B29534738E3F0F297d36635d7884965C7c8cE1"
      values.challengers.2:
-        "0x95417708f67f4a5dF1A447efe40c6C74e38Ab832"
+        "eth:0x95417708f67f4a5dF1A447efe40c6C74e38Ab832"
      values.challengers.3:
-        "0xd11f9c4F5d9b1feC2d14581d3674066442B68772"
+        "eth:0xd11f9c4F5d9b1feC2d14581d3674066442B68772"
      values.challengers.4:
-        "0x323a78C1c910b282dE98a557d735628A02E00983"
+        "eth:0x323a78C1c910b282dE98a557d735628A02E00983"
      values.challengers.5:
-        "0x74204e3801E9394848AbDBAd6f378d0b11e9a091"
+        "eth:0x74204e3801E9394848AbDBAd6f378d0b11e9a091"
      values.challengers.6:
-        "0xbD9f4fdC48a9A8c7eA1075CFDf4F3bd365d50Bab"
+        "eth:0xbD9f4fdC48a9A8c7eA1075CFDf4F3bd365d50Bab"
      values.challengers.7:
-        "0x9Ac29D4f41A139D9b7be32C2906Df9f86FA51b2b"
+        "eth:0x9Ac29D4f41A139D9b7be32C2906Df9f86FA51b2b"
      values.challengers.8:
-        "0xbfd62b7915da8c19C701FD13237b555Ad38C4b4C"
+        "eth:0xbfd62b7915da8c19C701FD13237b555Ad38C4b4C"
      values.challengers.9:
-        "0xcA00091a35d0b546A15d000F8bCeDA56255EE4D0"
+        "eth:0xcA00091a35d0b546A15d000F8bCeDA56255EE4D0"
      values.challengers.10:
-        "0x6D7cC6C62CD6CcdaC482E82aA7A3763926e93854"
+        "eth:0x6D7cC6C62CD6CcdaC482E82aA7A3763926e93854"
      values.challengers.11:
-        "0x8C0cFFcBAb44c7aB6e96EB607c49188dE99a17Cd"
+        "eth:0x8C0cFFcBAb44c7aB6e96EB607c49188dE99a17Cd"
      values.challengers.12:
-        "0xC4db900F76293042349448D1Ba30F71518325Bb3"
+        "eth:0xC4db900F76293042349448D1Ba30F71518325Bb3"
      values.challengers.13:
-        "0xF2FF0509520fAf35B511074466A509e00d73C307"
+        "eth:0xF2FF0509520fAf35B511074466A509e00d73C307"
      values.challengers.14:
-        "0xF6Ee30269dB1854987cA6812E1ff66c3A5F660Fd"
+        "eth:0xF6Ee30269dB1854987cA6812E1ff66c3A5F660Fd"
      values.challengers.15:
-        "0xf50A81C771AD3237aeA2FD18E4ee8055CC4Cd2B9"
+        "eth:0xf50A81C771AD3237aeA2FD18E4ee8055CC4Cd2B9"
      values.challengers.16:
-        "0x71C10870dC38E54d987C22e96aB32b46cc08564F"
+        "eth:0x71C10870dC38E54d987C22e96aB32b46cc08564F"
      values.challengers.17:
-        "0xb4A20D473e8C378aE742a8017DD67756a358eAB6"
+        "eth:0xb4A20D473e8C378aE742a8017DD67756a358eAB6"
      values.challengers.18:
-        "0xE48eA86dCdE15E28624E5De9d6D3738fc52B6bFe"
+        "eth:0xE48eA86dCdE15E28624E5De9d6D3738fc52B6bFe"
      values.challengers.19:
-        "0x03FD36AEd3b2597aA79bb5f543f3a0eAf9DEB0FA"
+        "eth:0x03FD36AEd3b2597aA79bb5f543f3a0eAf9DEB0FA"
      values.challengers.20:
-        "0x4Ee3690901157bE86A33371bEc1e5021A10Ba47C"
+        "eth:0x4Ee3690901157bE86A33371bEc1e5021A10Ba47C"
      values.challengers.21:
-        "0xc8F7DaeF4b49c1593cC3996aB2afa8B56e00fcF8"
+        "eth:0xc8F7DaeF4b49c1593cC3996aB2afa8B56e00fcF8"
      values.challengers.22:
-        "0x0092bC49078f130D27e70dBeee441E227280B97D"
+        "eth:0x0092bC49078f130D27e70dBeee441E227280B97D"
      values.challengers.23:
-        "0xC412B4e6399F694CfF21D038d225373Fd6596811"
+        "eth:0xC412B4e6399F694CfF21D038d225373Fd6596811"
      values.challengers.24:
-        "0x1721D3Ae2d68E3Dd32525400Ed2a29060F1300c6"
+        "eth:0x1721D3Ae2d68E3Dd32525400Ed2a29060F1300c6"
      values.challengers.25:
-        "0xDF063FAEb46de1b4336bC70Da7175f16aB4A7272"
+        "eth:0xDF063FAEb46de1b4336bC70Da7175f16aB4A7272"
      values.challengers.26:
-        "0x611e4B24e89bC524Fc06f73b6FD02bE3Ec73d6Db"
+        "eth:0x611e4B24e89bC524Fc06f73b6FD02bE3Ec73d6Db"
      values.challengers.27:
-        "0x92C4d5d9CaDD1aF74080DE7aa078434007F710Bb"
+        "eth:0x92C4d5d9CaDD1aF74080DE7aa078434007F710Bb"
      values.challengers.28:
-        "0x234aCb24b1DeeA7f6c7530b8c29a6378bA21e1D0"
+        "eth:0x234aCb24b1DeeA7f6c7530b8c29a6378bA21e1D0"
      values.challengers.29:
-        "0x5c6E1011cd3b5d7D2937c098b8F61d6B3d1aee7e"
+        "eth:0x5c6E1011cd3b5d7D2937c098b8F61d6B3d1aee7e"
      values.challengers.30:
-        "0x95C373754C66feF1Eb2dbb6934aF821C551D9738"
+        "eth:0x95C373754C66feF1Eb2dbb6934aF821C551D9738"
      values.l1StakingContract:
-        "0x0Dc417F8AF88388737c5053FF73f345f080543F7"
+        "eth:0x0Dc417F8AF88388737c5053FF73f345f080543F7"
      values.messageQueue:
-        "0x3931Ade842F5BB8763164bDd81E5361DcE6cC1EF"
+        "eth:0x3931Ade842F5BB8763164bDd81E5361DcE6cC1EF"
      values.owner:
-        "0xB822319ab7848b7cC4537c8409e50f85BFb04377"
+        "eth:0xB822319ab7848b7cC4537c8409e50f85BFb04377"
      values.verifier:
-        "0x5d1584c27b4aD233283c6da1ca1B825d6f220EC1"
+        "eth:0x5d1584c27b4aD233283c6da1ca1B825d6f220EC1"
      implementationNames.0x759894Ced0e6af42c26668076Ffa84d02E3CeF60:
-        "TransparentUpgradeableProxy"
      implementationNames.0x9C79e8F5d0fE910d84a6a0d4A03E8136d036eBec:
-        "Rollup"
      implementationNames.eth:0x759894Ced0e6af42c26668076Ffa84d02E3CeF60:
+        "TransparentUpgradeableProxy"
      implementationNames.eth:0x9C79e8F5d0fE910d84a6a0d4A03E8136d036eBec:
+        "Rollup"
    }
```

```diff
    EOA  (0x77B29534738E3F0F297d36635d7884965C7c8cE1) {
    +++ description: None
      address:
-        "0x77B29534738E3F0F297d36635d7884965C7c8cE1"
+        "eth:0x77B29534738E3F0F297d36635d7884965C7c8cE1"
    }
```

```diff
    EOA  (0x8C0cFFcBAb44c7aB6e96EB607c49188dE99a17Cd) {
    +++ description: None
      address:
-        "0x8C0cFFcBAb44c7aB6e96EB607c49188dE99a17Cd"
+        "eth:0x8C0cFFcBAb44c7aB6e96EB607c49188dE99a17Cd"
    }
```

```diff
    EOA  (0x92C4d5d9CaDD1aF74080DE7aa078434007F710Bb) {
    +++ description: None
      address:
-        "0x92C4d5d9CaDD1aF74080DE7aa078434007F710Bb"
+        "eth:0x92C4d5d9CaDD1aF74080DE7aa078434007F710Bb"
    }
```

```diff
    EOA  (0x95417708f67f4a5dF1A447efe40c6C74e38Ab832) {
    +++ description: None
      address:
-        "0x95417708f67f4a5dF1A447efe40c6C74e38Ab832"
+        "eth:0x95417708f67f4a5dF1A447efe40c6C74e38Ab832"
    }
```

```diff
    EOA  (0x95C373754C66feF1Eb2dbb6934aF821C551D9738) {
    +++ description: None
      address:
-        "0x95C373754C66feF1Eb2dbb6934aF821C551D9738"
+        "eth:0x95C373754C66feF1Eb2dbb6934aF821C551D9738"
    }
```

```diff
    EOA  (0x9Ac29D4f41A139D9b7be32C2906Df9f86FA51b2b) {
    +++ description: None
      address:
-        "0x9Ac29D4f41A139D9b7be32C2906Df9f86FA51b2b"
+        "eth:0x9Ac29D4f41A139D9b7be32C2906Df9f86FA51b2b"
    }
```

```diff
    EOA  (0xa59B26DB10C5Ca26a97AA2Fd2E74CB8DA9D1EB65) {
    +++ description: None
      address:
-        "0xa59B26DB10C5Ca26a97AA2Fd2E74CB8DA9D1EB65"
+        "eth:0xa59B26DB10C5Ca26a97AA2Fd2E74CB8DA9D1EB65"
    }
```

```diff
    EOA  (0xa79fEE4418338B59B8C6c93b87777A89F57c0Fd3) {
    +++ description: None
      address:
-        "0xa79fEE4418338B59B8C6c93b87777A89F57c0Fd3"
+        "eth:0xa79fEE4418338B59B8C6c93b87777A89F57c0Fd3"
    }
```

```diff
    EOA  (0xAD249861A911717fE74FA329fEC3c619f55DfFDf) {
    +++ description: None
      address:
-        "0xAD249861A911717fE74FA329fEC3c619f55DfFDf"
+        "eth:0xAD249861A911717fE74FA329fEC3c619f55DfFDf"
    }
```

```diff
    EOA  (0xb4A20D473e8C378aE742a8017DD67756a358eAB6) {
    +++ description: None
      address:
-        "0xb4A20D473e8C378aE742a8017DD67756a358eAB6"
+        "eth:0xb4A20D473e8C378aE742a8017DD67756a358eAB6"
    }
```

```diff
    EOA  (0xb6cF39ee72e0127E6Ea6059e38B8C197227a6ac7) {
    +++ description: None
      address:
-        "0xb6cF39ee72e0127E6Ea6059e38B8C197227a6ac7"
+        "eth:0xb6cF39ee72e0127E6Ea6059e38B8C197227a6ac7"
    }
```

```diff
    contract Morph Multisig 2 (0xB822319ab7848b7cC4537c8409e50f85BFb04377) {
    +++ description: None
      address:
-        "0xB822319ab7848b7cC4537c8409e50f85BFb04377"
+        "eth:0xB822319ab7848b7cC4537c8409e50f85BFb04377"
      values.$implementation:
-        "0x41675C099F32341bf84BFc5382aF534df5C7461a"
+        "eth:0x41675C099F32341bf84BFc5382aF534df5C7461a"
      values.$members.0:
-        "0x19C0CebaEC6EDb61c00178Cf8c6112BAD5Ef68E6"
+        "eth:0x19C0CebaEC6EDb61c00178Cf8c6112BAD5Ef68E6"
      values.$members.1:
-        "0xa79fEE4418338B59B8C6c93b87777A89F57c0Fd3"
+        "eth:0xa79fEE4418338B59B8C6c93b87777A89F57c0Fd3"
      values.$members.2:
-        "0x429087D7cb89cD816b80804bCE9c7b1A1FFE229F"
+        "eth:0x429087D7cb89cD816b80804bCE9c7b1A1FFE229F"
      values.$members.3:
-        "0x0659dF9D53A987e3aDaa9019407431413A101eF3"
+        "eth:0x0659dF9D53A987e3aDaa9019407431413A101eF3"
      values.$members.4:
-        "0x59C09F33d7D901b8B57644D68a45b123e9Bbd0E5"
+        "eth:0x59C09F33d7D901b8B57644D68a45b123e9Bbd0E5"
      values.$members.5:
-        "0x05e1d4694041aF987Af6F8402D902686018E2136"
+        "eth:0x05e1d4694041aF987Af6F8402D902686018E2136"
      values.$members.6:
-        "0xAD249861A911717fE74FA329fEC3c619f55DfFDf"
+        "eth:0xAD249861A911717fE74FA329fEC3c619f55DfFDf"
      values.$members.7:
-        "0xcE7257224441385345CE6eEdd9D8667AD9Bab9f0"
+        "eth:0xcE7257224441385345CE6eEdd9D8667AD9Bab9f0"
      implementationNames.0xB822319ab7848b7cC4537c8409e50f85BFb04377:
-        "SafeProxy"
      implementationNames.0x41675C099F32341bf84BFc5382aF534df5C7461a:
-        "Safe"
      implementationNames.eth:0xB822319ab7848b7cC4537c8409e50f85BFb04377:
+        "SafeProxy"
      implementationNames.eth:0x41675C099F32341bf84BFc5382aF534df5C7461a:
+        "Safe"
    }
```

```diff
    EOA  (0xBBA36CdF020788f0D08D5688c0Bee3fb30ce1C80) {
    +++ description: None
      address:
-        "0xBBA36CdF020788f0D08D5688c0Bee3fb30ce1C80"
+        "eth:0xBBA36CdF020788f0D08D5688c0Bee3fb30ce1C80"
    }
```

```diff
    EOA  (0xbD9f4fdC48a9A8c7eA1075CFDf4F3bd365d50Bab) {
    +++ description: None
      address:
-        "0xbD9f4fdC48a9A8c7eA1075CFDf4F3bd365d50Bab"
+        "eth:0xbD9f4fdC48a9A8c7eA1075CFDf4F3bd365d50Bab"
    }
```

```diff
    EOA  (0xbfd62b7915da8c19C701FD13237b555Ad38C4b4C) {
    +++ description: None
      address:
-        "0xbfd62b7915da8c19C701FD13237b555Ad38C4b4C"
+        "eth:0xbfd62b7915da8c19C701FD13237b555Ad38C4b4C"
    }
```

```diff
    EOA  (0xC412B4e6399F694CfF21D038d225373Fd6596811) {
    +++ description: None
      address:
-        "0xC412B4e6399F694CfF21D038d225373Fd6596811"
+        "eth:0xC412B4e6399F694CfF21D038d225373Fd6596811"
    }
```

```diff
    EOA  (0xC4db900F76293042349448D1Ba30F71518325Bb3) {
    +++ description: None
      address:
-        "0xC4db900F76293042349448D1Ba30F71518325Bb3"
+        "eth:0xC4db900F76293042349448D1Ba30F71518325Bb3"
    }
```

```diff
    contract EnforcedTxGateway (0xc5Fa3b8968c7FAbEeA2B530a20b88d0C2eD8abb7) {
    +++ description: Contracts to force L1 -> L2 messages with the proper sender. Currently paused: true.
      address:
-        "0xc5Fa3b8968c7FAbEeA2B530a20b88d0C2eD8abb7"
+        "eth:0xc5Fa3b8968c7FAbEeA2B530a20b88d0C2eD8abb7"
      values.$admin:
-        "0x31110622D6CA24c9FF307d6ae1715F16E47F16A0"
+        "eth:0x31110622D6CA24c9FF307d6ae1715F16E47F16A0"
      values.$implementation:
-        "0xCb13746Fc891fC2e7D824870D00a26F43fE6123e"
+        "eth:0xCb13746Fc891fC2e7D824870D00a26F43fE6123e"
      values.$pastUpgrades.0.2.0:
-        "0x98dF320641C2E65ab4BbeF1e6f6C66D9B50EdE5F"
+        "eth:0x98dF320641C2E65ab4BbeF1e6f6C66D9B50EdE5F"
      values.$pastUpgrades.1.2.0:
-        "0xCb13746Fc891fC2e7D824870D00a26F43fE6123e"
+        "eth:0xCb13746Fc891fC2e7D824870D00a26F43fE6123e"
      values.eip712Domain.verifyingContract:
-        "0xc5Fa3b8968c7FAbEeA2B530a20b88d0C2eD8abb7"
+        "eth:0xc5Fa3b8968c7FAbEeA2B530a20b88d0C2eD8abb7"
      values.feeVault:
-        "0xB822319ab7848b7cC4537c8409e50f85BFb04377"
+        "eth:0xB822319ab7848b7cC4537c8409e50f85BFb04377"
      values.messageQueue:
-        "0x3931Ade842F5BB8763164bDd81E5361DcE6cC1EF"
+        "eth:0x3931Ade842F5BB8763164bDd81E5361DcE6cC1EF"
      values.owner:
-        "0xB822319ab7848b7cC4537c8409e50f85BFb04377"
+        "eth:0xB822319ab7848b7cC4537c8409e50f85BFb04377"
      implementationNames.0xc5Fa3b8968c7FAbEeA2B530a20b88d0C2eD8abb7:
-        "TransparentUpgradeableProxy"
      implementationNames.0xCb13746Fc891fC2e7D824870D00a26F43fE6123e:
-        "EnforcedTxGateway"
      implementationNames.eth:0xc5Fa3b8968c7FAbEeA2B530a20b88d0C2eD8abb7:
+        "TransparentUpgradeableProxy"
      implementationNames.eth:0xCb13746Fc891fC2e7D824870D00a26F43fE6123e:
+        "EnforcedTxGateway"
    }
```

```diff
    EOA  (0xc8F7DaeF4b49c1593cC3996aB2afa8B56e00fcF8) {
    +++ description: None
      address:
-        "0xc8F7DaeF4b49c1593cC3996aB2afa8B56e00fcF8"
+        "eth:0xc8F7DaeF4b49c1593cC3996aB2afa8B56e00fcF8"
    }
```

```diff
    EOA  (0xcA00091a35d0b546A15d000F8bCeDA56255EE4D0) {
    +++ description: None
      address:
-        "0xcA00091a35d0b546A15d000F8bCeDA56255EE4D0"
+        "eth:0xcA00091a35d0b546A15d000F8bCeDA56255EE4D0"
    }
```

```diff
    EOA  (0xcE7257224441385345CE6eEdd9D8667AD9Bab9f0) {
    +++ description: None
      address:
-        "0xcE7257224441385345CE6eEdd9D8667AD9Bab9f0"
+        "eth:0xcE7257224441385345CE6eEdd9D8667AD9Bab9f0"
    }
```

```diff
    EOA  (0xd11f9c4F5d9b1feC2d14581d3674066442B68772) {
    +++ description: None
      address:
-        "0xd11f9c4F5d9b1feC2d14581d3674066442B68772"
+        "eth:0xd11f9c4F5d9b1feC2d14581d3674066442B68772"
    }
```

```diff
    contract L1CrossDomainMessenger (0xDc71366EFFA760804DCFC3EDF87fa2A6f1623304) {
    +++ description: Contract used to send L1 -> L2 and relay messages from L2. It allows to replay failed messages and to drop skipped messages. L1 -> L2 messages sent using this contract pay for L2 gas on L1 and will have the aliased address of this contract as the sender.
      address:
-        "0xDc71366EFFA760804DCFC3EDF87fa2A6f1623304"
+        "eth:0xDc71366EFFA760804DCFC3EDF87fa2A6f1623304"
      values.$admin:
-        "0x31110622D6CA24c9FF307d6ae1715F16E47F16A0"
+        "eth:0x31110622D6CA24c9FF307d6ae1715F16E47F16A0"
      values.$implementation:
-        "0x0cC37d5239F9027A1269f53D83c73084D538f3a9"
+        "eth:0x0cC37d5239F9027A1269f53D83c73084D538f3a9"
      values.$pastUpgrades.0.2.0:
-        "0x98dF320641C2E65ab4BbeF1e6f6C66D9B50EdE5F"
+        "eth:0x98dF320641C2E65ab4BbeF1e6f6C66D9B50EdE5F"
      values.$pastUpgrades.1.2.0:
-        "0xB8F0871bc0832cb756f07fFC4bDdC8b6bf8577b5"
+        "eth:0xB8F0871bc0832cb756f07fFC4bDdC8b6bf8577b5"
      values.$pastUpgrades.2.2.0:
-        "0x0cC37d5239F9027A1269f53D83c73084D538f3a9"
+        "eth:0x0cC37d5239F9027A1269f53D83c73084D538f3a9"
      values.counterpart:
-        "0x5300000000000000000000000000000000000007"
+        "eth:0x5300000000000000000000000000000000000007"
      values.feeVault:
-        "0xB822319ab7848b7cC4537c8409e50f85BFb04377"
+        "eth:0xB822319ab7848b7cC4537c8409e50f85BFb04377"
      values.messageQueue:
-        "0x3931Ade842F5BB8763164bDd81E5361DcE6cC1EF"
+        "eth:0x3931Ade842F5BB8763164bDd81E5361DcE6cC1EF"
      values.owner:
-        "0xB822319ab7848b7cC4537c8409e50f85BFb04377"
+        "eth:0xB822319ab7848b7cC4537c8409e50f85BFb04377"
      values.rollup:
-        "0x759894Ced0e6af42c26668076Ffa84d02E3CeF60"
+        "eth:0x759894Ced0e6af42c26668076Ffa84d02E3CeF60"
      values.xDomainMessageSender:
-        "0x000000000000000000000000000000000000dEaD"
+        "eth:0x000000000000000000000000000000000000dEaD"
      implementationNames.0xDc71366EFFA760804DCFC3EDF87fa2A6f1623304:
-        "TransparentUpgradeableProxy"
      implementationNames.0x0cC37d5239F9027A1269f53D83c73084D538f3a9:
-        "L1CrossDomainMessenger"
      implementationNames.eth:0xDc71366EFFA760804DCFC3EDF87fa2A6f1623304:
+        "TransparentUpgradeableProxy"
      implementationNames.eth:0x0cC37d5239F9027A1269f53D83c73084D538f3a9:
+        "L1CrossDomainMessenger"
    }
```

```diff
    EOA  (0xDF063FAEb46de1b4336bC70Da7175f16aB4A7272) {
    +++ description: None
      address:
-        "0xDF063FAEb46de1b4336bC70Da7175f16aB4A7272"
+        "eth:0xDF063FAEb46de1b4336bC70Da7175f16aB4A7272"
    }
```

```diff
    EOA  (0xE48eA86dCdE15E28624E5De9d6D3738fc52B6bFe) {
    +++ description: None
      address:
-        "0xE48eA86dCdE15E28624E5De9d6D3738fc52B6bFe"
+        "eth:0xE48eA86dCdE15E28624E5De9d6D3738fc52B6bFe"
    }
```

```diff
    contract ZkEvmVerifierV1 (0xeF88951806f69974bD703Cb9E9eFE362EA0Eb154) {
    +++ description: SP1 verifier using Blobs for DA (being deprecated).
      address:
-        "0xeF88951806f69974bD703Cb9E9eFE362EA0Eb154"
+        "eth:0xeF88951806f69974bD703Cb9E9eFE362EA0Eb154"
      implementationNames.0xeF88951806f69974bD703Cb9E9eFE362EA0Eb154:
-        "ZkEvmVerifierV1"
      implementationNames.eth:0xeF88951806f69974bD703Cb9E9eFE362EA0Eb154:
+        "ZkEvmVerifierV1"
    }
```

```diff
    contract Morph Multisig 1 (0xF101f7f59A348c1F971A2BC64fdBdA58c7bBD887) {
    +++ description: None
      address:
-        "0xF101f7f59A348c1F971A2BC64fdBdA58c7bBD887"
+        "eth:0xF101f7f59A348c1F971A2BC64fdBdA58c7bBD887"
      values.$implementation:
-        "0x41675C099F32341bf84BFc5382aF534df5C7461a"
+        "eth:0x41675C099F32341bf84BFc5382aF534df5C7461a"
      values.$members.0:
-        "0x0659dF9D53A987e3aDaa9019407431413A101eF3"
+        "eth:0x0659dF9D53A987e3aDaa9019407431413A101eF3"
      values.$members.1:
-        "0x59C09F33d7D901b8B57644D68a45b123e9Bbd0E5"
+        "eth:0x59C09F33d7D901b8B57644D68a45b123e9Bbd0E5"
      values.$members.2:
-        "0x19C0CebaEC6EDb61c00178Cf8c6112BAD5Ef68E6"
+        "eth:0x19C0CebaEC6EDb61c00178Cf8c6112BAD5Ef68E6"
      values.$members.3:
-        "0xcE7257224441385345CE6eEdd9D8667AD9Bab9f0"
+        "eth:0xcE7257224441385345CE6eEdd9D8667AD9Bab9f0"
      values.$members.4:
-        "0x35B98995048b320f2DaFFAD5BaD5884F16e488A9"
+        "eth:0x35B98995048b320f2DaFFAD5BaD5884F16e488A9"
      values.$members.5:
-        "0x1DeBbDae435295eC72b904Cc8B476BA81a63BAdb"
+        "eth:0x1DeBbDae435295eC72b904Cc8B476BA81a63BAdb"
      values.$members.6:
-        "0x0B3d220254e407a780EA7498d51b6d4fef807Bd0"
+        "eth:0x0B3d220254e407a780EA7498d51b6d4fef807Bd0"
      values.$members.7:
-        "0xf39D8310a7DFEc320bD17bddE32A53d47e340B2e"
+        "eth:0xf39D8310a7DFEc320bD17bddE32A53d47e340B2e"
      implementationNames.0xF101f7f59A348c1F971A2BC64fdBdA58c7bBD887:
-        "SafeProxy"
      implementationNames.0x41675C099F32341bf84BFc5382aF534df5C7461a:
-        "Safe"
      implementationNames.eth:0xF101f7f59A348c1F971A2BC64fdBdA58c7bBD887:
+        "SafeProxy"
      implementationNames.eth:0x41675C099F32341bf84BFc5382aF534df5C7461a:
+        "Safe"
    }
```

```diff
    EOA  (0xF2FF0509520fAf35B511074466A509e00d73C307) {
    +++ description: None
      address:
-        "0xF2FF0509520fAf35B511074466A509e00d73C307"
+        "eth:0xF2FF0509520fAf35B511074466A509e00d73C307"
    }
```

```diff
    EOA  (0xf39D8310a7DFEc320bD17bddE32A53d47e340B2e) {
    +++ description: None
      address:
-        "0xf39D8310a7DFEc320bD17bddE32A53d47e340B2e"
+        "eth:0xf39D8310a7DFEc320bD17bddE32A53d47e340B2e"
    }
```

```diff
    EOA  (0xf50A81C771AD3237aeA2FD18E4ee8055CC4Cd2B9) {
    +++ description: None
      address:
-        "0xf50A81C771AD3237aeA2FD18E4ee8055CC4Cd2B9"
+        "eth:0xf50A81C771AD3237aeA2FD18E4ee8055CC4Cd2B9"
    }
```

```diff
    EOA  (0xF6Ee30269dB1854987cA6812E1ff66c3A5F660Fd) {
    +++ description: None
      address:
-        "0xF6Ee30269dB1854987cA6812E1ff66c3A5F660Fd"
+        "eth:0xF6Ee30269dB1854987cA6812E1ff66c3A5F660Fd"
    }
```

```diff
    EOA  (0xf834ffbeb6bB3F4841afc6b5FB40B94cd580fa23) {
    +++ description: None
      address:
-        "0xf834ffbeb6bB3F4841afc6b5FB40B94cd580fa23"
+        "eth:0xf834ffbeb6bB3F4841afc6b5FB40B94cd580fa23"
    }
```

```diff
    contract Whitelist (0xFFafDd9167777C0e5421e0B6789D6d7A5E386984) {
    +++ description: Contract implementing a generic whitelist. Currently used to define the actor that can relay the L2 basefee on L1.
      address:
-        "0xFFafDd9167777C0e5421e0B6789D6d7A5E386984"
+        "eth:0xFFafDd9167777C0e5421e0B6789D6d7A5E386984"
      values.owner:
-        "0xB822319ab7848b7cC4537c8409e50f85BFb04377"
+        "eth:0xB822319ab7848b7cC4537c8409e50f85BFb04377"
      implementationNames.0xFFafDd9167777C0e5421e0B6789D6d7A5E386984:
-        "Whitelist"
      implementationNames.eth:0xFFafDd9167777C0e5421e0B6789D6d7A5E386984:
+        "Whitelist"
    }
```

```diff
+   Status: CREATED
    contract L1Staking (0x0Dc417F8AF88388737c5053FF73f345f080543F7)
    +++ description: Contract keeping track of stakers which act as sequencers/proposes. It is responsible for stakers registering and withdrawals and for verifying BLS signatures of stakers (currently not implemented).
```

```diff
+   Status: CREATED
    contract L1ETHGateway (0x1C1Ffb5828c3A48B54E8910F1c75256a498aDE68)
    +++ description: Contract used to bridge ETH from L1 to L2.
```

```diff
+   Status: CREATED
    contract ProxyAdmin (0x31110622D6CA24c9FF307d6ae1715F16E47F16A0)
    +++ description: None
```

```diff
+   Status: CREATED
    contract L1MessageQueueWithGasPriceOracle (0x3931Ade842F5BB8763164bDd81E5361DcE6cC1EF)
    +++ description: Contains the array of queued L1 -> L2 messages, either appended using the L1Messenger or the EnforcedTxGateway.
```

```diff
+   Status: CREATED
    contract ZkEvmVerifierV1 (0x4006FDA79493FEE14dA42BfA34575aAA79bcf953)
    +++ description: Current SP1 verifier using Blobs for DA.
```

```diff
+   Status: CREATED
    contract L1StandardERC20Gateway (0x44c28f61A5C2Dd24Fc71D7Df8E85e18af4ab2Bd8)
    +++ description: Contract used to bridge ERC20 tokens from L1 to L2. It uses a fixed token list.
```

```diff
+   Status: CREATED
    contract MultipleVersionRollupVerifier (0x5d1584c27b4aD233283c6da1ca1B825d6f220EC1)
    +++ description: Used to update the verifier and keep track of current and old versions.
```

```diff
+   Status: CREATED
    contract L1GatewayRouter (0x7497756ADA7e656aE9f00781aF49Fc0fD08f8A8a)
    +++ description: Main entry point for depositing ETH and ERC20 tokens, which are then forwarded to the correct gateway.
```

```diff
+   Status: CREATED
    contract MorphRollup (0x759894Ced0e6af42c26668076Ffa84d02E3CeF60)
    +++ description: The main contract of the Morph chain. Allows to post transaction data and state roots, implements challenge mechanism along with proofs. Sequencing and proposing are behind a whitelist.
```

```diff
+   Status: CREATED
    contract Morph Multisig 2 (0xB822319ab7848b7cC4537c8409e50f85BFb04377)
    +++ description: None
```

```diff
+   Status: CREATED
    contract EnforcedTxGateway (0xc5Fa3b8968c7FAbEeA2B530a20b88d0C2eD8abb7)
    +++ description: Contracts to force L1 -> L2 messages with the proper sender. Currently paused: true.
```

```diff
+   Status: CREATED
    contract L1CrossDomainMessenger (0xDc71366EFFA760804DCFC3EDF87fa2A6f1623304)
    +++ description: Contract used to send L1 -> L2 and relay messages from L2. It allows to replay failed messages and to drop skipped messages. L1 -> L2 messages sent using this contract pay for L2 gas on L1 and will have the aliased address of this contract as the sender.
```

```diff
+   Status: CREATED
    contract ZkEvmVerifierV1 (0xeF88951806f69974bD703Cb9E9eFE362EA0Eb154)
    +++ description: SP1 verifier using Blobs for DA (being deprecated).
```

```diff
+   Status: CREATED
    contract Morph Multisig 1 (0xF101f7f59A348c1F971A2BC64fdBdA58c7bBD887)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Whitelist (0xFFafDd9167777C0e5421e0B6789D6d7A5E386984)
    +++ description: Contract implementing a generic whitelist. Currently used to define the actor that can relay the L2 basefee on L1.
```

Generated with discovered.json: 0xdb055c6620f5aa76a0adf5f978482e5c7fc81b4d

# Diff at Fri, 04 Jul 2025 12:19:10 GMT:

- chain: ethereum
- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@1f56dc47fe915564d4555300304da4d3bcbc087f block: 22767866
- current block number: 22767866

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22767866 (main branch discovery), not current.

```diff
    EOA  (0x0092bC49078f130D27e70dBeee441E227280B97D) {
    +++ description: None
      receivedPermissions.0.from:
-        "ethereum:0x759894Ced0e6af42c26668076Ffa84d02E3CeF60"
+        "eth:0x759894Ced0e6af42c26668076Ffa84d02E3CeF60"
    }
```

```diff
    EOA  (0x03FD36AEd3b2597aA79bb5f543f3a0eAf9DEB0FA) {
    +++ description: None
      receivedPermissions.0.from:
-        "ethereum:0x759894Ced0e6af42c26668076Ffa84d02E3CeF60"
+        "eth:0x759894Ced0e6af42c26668076Ffa84d02E3CeF60"
    }
```

```diff
    EOA  (0x1721D3Ae2d68E3Dd32525400Ed2a29060F1300c6) {
    +++ description: None
      receivedPermissions.0.from:
-        "ethereum:0x759894Ced0e6af42c26668076Ffa84d02E3CeF60"
+        "eth:0x759894Ced0e6af42c26668076Ffa84d02E3CeF60"
    }
```

```diff
    EOA  (0x234aCb24b1DeeA7f6c7530b8c29a6378bA21e1D0) {
    +++ description: None
      receivedPermissions.0.from:
-        "ethereum:0x759894Ced0e6af42c26668076Ffa84d02E3CeF60"
+        "eth:0x759894Ced0e6af42c26668076Ffa84d02E3CeF60"
    }
```

```diff
    contract ProxyAdmin (0x31110622D6CA24c9FF307d6ae1715F16E47F16A0) {
    +++ description: None
      directlyReceivedPermissions.0.from:
-        "ethereum:0x0Dc417F8AF88388737c5053FF73f345f080543F7"
+        "eth:0x0Dc417F8AF88388737c5053FF73f345f080543F7"
      directlyReceivedPermissions.1.from:
-        "ethereum:0x1C1Ffb5828c3A48B54E8910F1c75256a498aDE68"
+        "eth:0x1C1Ffb5828c3A48B54E8910F1c75256a498aDE68"
      directlyReceivedPermissions.2.from:
-        "ethereum:0x3931Ade842F5BB8763164bDd81E5361DcE6cC1EF"
+        "eth:0x3931Ade842F5BB8763164bDd81E5361DcE6cC1EF"
      directlyReceivedPermissions.3.from:
-        "ethereum:0x44c28f61A5C2Dd24Fc71D7Df8E85e18af4ab2Bd8"
+        "eth:0x44c28f61A5C2Dd24Fc71D7Df8E85e18af4ab2Bd8"
      directlyReceivedPermissions.4.from:
-        "ethereum:0x7497756ADA7e656aE9f00781aF49Fc0fD08f8A8a"
+        "eth:0x7497756ADA7e656aE9f00781aF49Fc0fD08f8A8a"
      directlyReceivedPermissions.5.from:
-        "ethereum:0x759894Ced0e6af42c26668076Ffa84d02E3CeF60"
+        "eth:0x759894Ced0e6af42c26668076Ffa84d02E3CeF60"
      directlyReceivedPermissions.6.from:
-        "ethereum:0xc5Fa3b8968c7FAbEeA2B530a20b88d0C2eD8abb7"
+        "eth:0xc5Fa3b8968c7FAbEeA2B530a20b88d0C2eD8abb7"
      directlyReceivedPermissions.7.from:
-        "ethereum:0xDc71366EFFA760804DCFC3EDF87fa2A6f1623304"
+        "eth:0xDc71366EFFA760804DCFC3EDF87fa2A6f1623304"
    }
```

```diff
    EOA  (0x323a78C1c910b282dE98a557d735628A02E00983) {
    +++ description: None
      receivedPermissions.0.from:
-        "ethereum:0x759894Ced0e6af42c26668076Ffa84d02E3CeF60"
+        "eth:0x759894Ced0e6af42c26668076Ffa84d02E3CeF60"
    }
```

```diff
    EOA  (0x34E387B37d3ADEAa6D5B92cE30dE3af3DCa39796) {
    +++ description: None
      receivedPermissions.0.from:
-        "ethereum:0x0Dc417F8AF88388737c5053FF73f345f080543F7"
+        "eth:0x0Dc417F8AF88388737c5053FF73f345f080543F7"
    }
```

```diff
    EOA  (0x4Ee3690901157bE86A33371bEc1e5021A10Ba47C) {
    +++ description: None
      receivedPermissions.0.from:
-        "ethereum:0x759894Ced0e6af42c26668076Ffa84d02E3CeF60"
+        "eth:0x759894Ced0e6af42c26668076Ffa84d02E3CeF60"
    }
```

```diff
    EOA  (0x5c6E1011cd3b5d7D2937c098b8F61d6B3d1aee7e) {
    +++ description: None
      receivedPermissions.0.from:
-        "ethereum:0x759894Ced0e6af42c26668076Ffa84d02E3CeF60"
+        "eth:0x759894Ced0e6af42c26668076Ffa84d02E3CeF60"
    }
```

```diff
    EOA  (0x611e4B24e89bC524Fc06f73b6FD02bE3Ec73d6Db) {
    +++ description: None
      receivedPermissions.0.from:
-        "ethereum:0x759894Ced0e6af42c26668076Ffa84d02E3CeF60"
+        "eth:0x759894Ced0e6af42c26668076Ffa84d02E3CeF60"
    }
```

```diff
    EOA  (0x6aB0E960911b50f6d14f249782ac12EC3E7584A0) {
    +++ description: None
      receivedPermissions.0.from:
-        "ethereum:0x0Dc417F8AF88388737c5053FF73f345f080543F7"
+        "eth:0x0Dc417F8AF88388737c5053FF73f345f080543F7"
    }
```

```diff
    EOA  (0x6D7cC6C62CD6CcdaC482E82aA7A3763926e93854) {
    +++ description: None
      receivedPermissions.0.from:
-        "ethereum:0x759894Ced0e6af42c26668076Ffa84d02E3CeF60"
+        "eth:0x759894Ced0e6af42c26668076Ffa84d02E3CeF60"
    }
```

```diff
    EOA  (0x71C10870dC38E54d987C22e96aB32b46cc08564F) {
    +++ description: None
      receivedPermissions.0.from:
-        "ethereum:0x759894Ced0e6af42c26668076Ffa84d02E3CeF60"
+        "eth:0x759894Ced0e6af42c26668076Ffa84d02E3CeF60"
    }
```

```diff
    EOA  (0x74204e3801E9394848AbDBAd6f378d0b11e9a091) {
    +++ description: None
      receivedPermissions.0.from:
-        "ethereum:0x759894Ced0e6af42c26668076Ffa84d02E3CeF60"
+        "eth:0x759894Ced0e6af42c26668076Ffa84d02E3CeF60"
    }
```

```diff
    EOA  (0x77B29534738E3F0F297d36635d7884965C7c8cE1) {
    +++ description: None
      receivedPermissions.0.from:
-        "ethereum:0x759894Ced0e6af42c26668076Ffa84d02E3CeF60"
+        "eth:0x759894Ced0e6af42c26668076Ffa84d02E3CeF60"
    }
```

```diff
    EOA  (0x8C0cFFcBAb44c7aB6e96EB607c49188dE99a17Cd) {
    +++ description: None
      receivedPermissions.0.from:
-        "ethereum:0x759894Ced0e6af42c26668076Ffa84d02E3CeF60"
+        "eth:0x759894Ced0e6af42c26668076Ffa84d02E3CeF60"
    }
```

```diff
    EOA  (0x92C4d5d9CaDD1aF74080DE7aa078434007F710Bb) {
    +++ description: None
      receivedPermissions.0.from:
-        "ethereum:0x759894Ced0e6af42c26668076Ffa84d02E3CeF60"
+        "eth:0x759894Ced0e6af42c26668076Ffa84d02E3CeF60"
    }
```

```diff
    EOA  (0x95417708f67f4a5dF1A447efe40c6C74e38Ab832) {
    +++ description: None
      receivedPermissions.0.from:
-        "ethereum:0x759894Ced0e6af42c26668076Ffa84d02E3CeF60"
+        "eth:0x759894Ced0e6af42c26668076Ffa84d02E3CeF60"
    }
```

```diff
    EOA  (0x95C373754C66feF1Eb2dbb6934aF821C551D9738) {
    +++ description: None
      receivedPermissions.0.from:
-        "ethereum:0x759894Ced0e6af42c26668076Ffa84d02E3CeF60"
+        "eth:0x759894Ced0e6af42c26668076Ffa84d02E3CeF60"
    }
```

```diff
    EOA  (0x9Ac29D4f41A139D9b7be32C2906Df9f86FA51b2b) {
    +++ description: None
      receivedPermissions.0.from:
-        "ethereum:0x759894Ced0e6af42c26668076Ffa84d02E3CeF60"
+        "eth:0x759894Ced0e6af42c26668076Ffa84d02E3CeF60"
    }
```

```diff
    EOA  (0xb4A20D473e8C378aE742a8017DD67756a358eAB6) {
    +++ description: None
      receivedPermissions.0.from:
-        "ethereum:0x759894Ced0e6af42c26668076Ffa84d02E3CeF60"
+        "eth:0x759894Ced0e6af42c26668076Ffa84d02E3CeF60"
    }
```

```diff
    contract Morph Multisig 2 (0xB822319ab7848b7cC4537c8409e50f85BFb04377) {
    +++ description: None
      receivedPermissions.0.from:
-        "ethereum:0x759894Ced0e6af42c26668076Ffa84d02E3CeF60"
+        "eth:0x759894Ced0e6af42c26668076Ffa84d02E3CeF60"
      receivedPermissions.1.from:
-        "ethereum:0x759894Ced0e6af42c26668076Ffa84d02E3CeF60"
+        "eth:0x759894Ced0e6af42c26668076Ffa84d02E3CeF60"
      receivedPermissions.2.from:
-        "ethereum:0xc5Fa3b8968c7FAbEeA2B530a20b88d0C2eD8abb7"
+        "eth:0xc5Fa3b8968c7FAbEeA2B530a20b88d0C2eD8abb7"
    }
```

```diff
    EOA  (0xBBA36CdF020788f0D08D5688c0Bee3fb30ce1C80) {
    +++ description: None
      receivedPermissions.0.from:
-        "ethereum:0x0Dc417F8AF88388737c5053FF73f345f080543F7"
+        "eth:0x0Dc417F8AF88388737c5053FF73f345f080543F7"
    }
```

```diff
    EOA  (0xbD9f4fdC48a9A8c7eA1075CFDf4F3bd365d50Bab) {
    +++ description: None
      receivedPermissions.0.from:
-        "ethereum:0x759894Ced0e6af42c26668076Ffa84d02E3CeF60"
+        "eth:0x759894Ced0e6af42c26668076Ffa84d02E3CeF60"
    }
```

```diff
    EOA  (0xbfd62b7915da8c19C701FD13237b555Ad38C4b4C) {
    +++ description: None
      receivedPermissions.0.from:
-        "ethereum:0x759894Ced0e6af42c26668076Ffa84d02E3CeF60"
+        "eth:0x759894Ced0e6af42c26668076Ffa84d02E3CeF60"
    }
```

```diff
    EOA  (0xC412B4e6399F694CfF21D038d225373Fd6596811) {
    +++ description: None
      receivedPermissions.0.from:
-        "ethereum:0x759894Ced0e6af42c26668076Ffa84d02E3CeF60"
+        "eth:0x759894Ced0e6af42c26668076Ffa84d02E3CeF60"
    }
```

```diff
    EOA  (0xC4db900F76293042349448D1Ba30F71518325Bb3) {
    +++ description: None
      receivedPermissions.0.from:
-        "ethereum:0x759894Ced0e6af42c26668076Ffa84d02E3CeF60"
+        "eth:0x759894Ced0e6af42c26668076Ffa84d02E3CeF60"
    }
```

```diff
    EOA  (0xc8F7DaeF4b49c1593cC3996aB2afa8B56e00fcF8) {
    +++ description: None
      receivedPermissions.0.from:
-        "ethereum:0x759894Ced0e6af42c26668076Ffa84d02E3CeF60"
+        "eth:0x759894Ced0e6af42c26668076Ffa84d02E3CeF60"
    }
```

```diff
    EOA  (0xcA00091a35d0b546A15d000F8bCeDA56255EE4D0) {
    +++ description: None
      receivedPermissions.0.from:
-        "ethereum:0x759894Ced0e6af42c26668076Ffa84d02E3CeF60"
+        "eth:0x759894Ced0e6af42c26668076Ffa84d02E3CeF60"
    }
```

```diff
    EOA  (0xd11f9c4F5d9b1feC2d14581d3674066442B68772) {
    +++ description: None
      receivedPermissions.0.from:
-        "ethereum:0x759894Ced0e6af42c26668076Ffa84d02E3CeF60"
+        "eth:0x759894Ced0e6af42c26668076Ffa84d02E3CeF60"
    }
```

```diff
    EOA  (0xDF063FAEb46de1b4336bC70Da7175f16aB4A7272) {
    +++ description: None
      receivedPermissions.0.from:
-        "ethereum:0x759894Ced0e6af42c26668076Ffa84d02E3CeF60"
+        "eth:0x759894Ced0e6af42c26668076Ffa84d02E3CeF60"
    }
```

```diff
    EOA  (0xE48eA86dCdE15E28624E5De9d6D3738fc52B6bFe) {
    +++ description: None
      receivedPermissions.0.from:
-        "ethereum:0x759894Ced0e6af42c26668076Ffa84d02E3CeF60"
+        "eth:0x759894Ced0e6af42c26668076Ffa84d02E3CeF60"
    }
```

```diff
    contract Morph Multisig 1 (0xF101f7f59A348c1F971A2BC64fdBdA58c7bBD887) {
    +++ description: None
      receivedPermissions.0.via.0.address:
-        "ethereum:0x31110622D6CA24c9FF307d6ae1715F16E47F16A0"
+        "eth:0x31110622D6CA24c9FF307d6ae1715F16E47F16A0"
      receivedPermissions.0.from:
-        "ethereum:0x0Dc417F8AF88388737c5053FF73f345f080543F7"
+        "eth:0x0Dc417F8AF88388737c5053FF73f345f080543F7"
      receivedPermissions.1.via.0.address:
-        "ethereum:0x31110622D6CA24c9FF307d6ae1715F16E47F16A0"
+        "eth:0x31110622D6CA24c9FF307d6ae1715F16E47F16A0"
      receivedPermissions.1.from:
-        "ethereum:0x1C1Ffb5828c3A48B54E8910F1c75256a498aDE68"
+        "eth:0x1C1Ffb5828c3A48B54E8910F1c75256a498aDE68"
      receivedPermissions.2.via.0.address:
-        "ethereum:0x31110622D6CA24c9FF307d6ae1715F16E47F16A0"
+        "eth:0x31110622D6CA24c9FF307d6ae1715F16E47F16A0"
      receivedPermissions.2.from:
-        "ethereum:0x3931Ade842F5BB8763164bDd81E5361DcE6cC1EF"
+        "eth:0x3931Ade842F5BB8763164bDd81E5361DcE6cC1EF"
      receivedPermissions.3.via.0.address:
-        "ethereum:0x31110622D6CA24c9FF307d6ae1715F16E47F16A0"
+        "eth:0x31110622D6CA24c9FF307d6ae1715F16E47F16A0"
      receivedPermissions.3.from:
-        "ethereum:0x44c28f61A5C2Dd24Fc71D7Df8E85e18af4ab2Bd8"
+        "eth:0x44c28f61A5C2Dd24Fc71D7Df8E85e18af4ab2Bd8"
      receivedPermissions.4.via.0.address:
-        "ethereum:0x31110622D6CA24c9FF307d6ae1715F16E47F16A0"
+        "eth:0x31110622D6CA24c9FF307d6ae1715F16E47F16A0"
      receivedPermissions.4.from:
-        "ethereum:0x7497756ADA7e656aE9f00781aF49Fc0fD08f8A8a"
+        "eth:0x7497756ADA7e656aE9f00781aF49Fc0fD08f8A8a"
      receivedPermissions.5.via.0.address:
-        "ethereum:0x31110622D6CA24c9FF307d6ae1715F16E47F16A0"
+        "eth:0x31110622D6CA24c9FF307d6ae1715F16E47F16A0"
      receivedPermissions.5.from:
-        "ethereum:0x759894Ced0e6af42c26668076Ffa84d02E3CeF60"
+        "eth:0x759894Ced0e6af42c26668076Ffa84d02E3CeF60"
      receivedPermissions.6.via.0.address:
-        "ethereum:0x31110622D6CA24c9FF307d6ae1715F16E47F16A0"
+        "eth:0x31110622D6CA24c9FF307d6ae1715F16E47F16A0"
      receivedPermissions.6.from:
-        "ethereum:0xc5Fa3b8968c7FAbEeA2B530a20b88d0C2eD8abb7"
+        "eth:0xc5Fa3b8968c7FAbEeA2B530a20b88d0C2eD8abb7"
      receivedPermissions.7.via.0.address:
-        "ethereum:0x31110622D6CA24c9FF307d6ae1715F16E47F16A0"
+        "eth:0x31110622D6CA24c9FF307d6ae1715F16E47F16A0"
      receivedPermissions.7.from:
-        "ethereum:0xDc71366EFFA760804DCFC3EDF87fa2A6f1623304"
+        "eth:0xDc71366EFFA760804DCFC3EDF87fa2A6f1623304"
      directlyReceivedPermissions.0.from:
-        "ethereum:0x31110622D6CA24c9FF307d6ae1715F16E47F16A0"
+        "eth:0x31110622D6CA24c9FF307d6ae1715F16E47F16A0"
    }
```

```diff
    EOA  (0xF2FF0509520fAf35B511074466A509e00d73C307) {
    +++ description: None
      receivedPermissions.0.from:
-        "ethereum:0x759894Ced0e6af42c26668076Ffa84d02E3CeF60"
+        "eth:0x759894Ced0e6af42c26668076Ffa84d02E3CeF60"
    }
```

```diff
    EOA  (0xf50A81C771AD3237aeA2FD18E4ee8055CC4Cd2B9) {
    +++ description: None
      receivedPermissions.0.from:
-        "ethereum:0x759894Ced0e6af42c26668076Ffa84d02E3CeF60"
+        "eth:0x759894Ced0e6af42c26668076Ffa84d02E3CeF60"
    }
```

```diff
    EOA  (0xF6Ee30269dB1854987cA6812E1ff66c3A5F660Fd) {
    +++ description: None
      receivedPermissions.0.from:
-        "ethereum:0x759894Ced0e6af42c26668076Ffa84d02E3CeF60"
+        "eth:0x759894Ced0e6af42c26668076Ffa84d02E3CeF60"
    }
```

Generated with discovered.json: 0xdafe3716c4bee3850c6b77f63c5983e29f8df503

# Diff at Mon, 23 Jun 2025 14:57:23 GMT:

- chain: ethereum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@399f5abaefa11c25467c604969aa558f53a49aa0 block: 22466462
- current block number: 22767866

## Description

Some stakers (sequencer/proposer) removed (3 left).

## Watched changes

```diff
    contract L1Staking (0x0Dc417F8AF88388737c5053FF73f345f080543F7) {
    +++ description: Contract keeping track of stakers which act as sequencers/proposes. It is responsible for stakers registering and withdrawals and for verifying BLS signatures of stakers (currently not implemented).
      values.deleteList.3:
+        "0xa59B26DB10C5Ca26a97AA2Fd2E74CB8DA9D1EB65"
      values.deleteList.2:
+        "0xf834ffbeb6bB3F4841afc6b5FB40B94cd580fa23"
      values.deleteList.1:
+        "0xb6cF39ee72e0127E6Ea6059e38B8C197227a6ac7"
      values.deleteList.0:
+        "0x61F2945d4bc9E40B66a6376d1094a50438f613e2"
      values.getActiveStakers.6:
-        "0x34E387B37d3ADEAa6D5B92cE30dE3af3DCa39796"
      values.getActiveStakers.5:
-        "0x6aB0E960911b50f6d14f249782ac12EC3E7584A0"
      values.getActiveStakers.4:
-        "0xa59B26DB10C5Ca26a97AA2Fd2E74CB8DA9D1EB65"
      values.getActiveStakers.3:
-        "0xBBA36CdF020788f0D08D5688c0Bee3fb30ce1C80"
      values.getActiveStakers.2:
-        "0xf834ffbeb6bB3F4841afc6b5FB40B94cd580fa23"
+        "0x34E387B37d3ADEAa6D5B92cE30dE3af3DCa39796"
      values.getActiveStakers.1:
-        "0xb6cF39ee72e0127E6Ea6059e38B8C197227a6ac7"
+        "0x6aB0E960911b50f6d14f249782ac12EC3E7584A0"
      values.getActiveStakers.0:
-        "0x61F2945d4bc9E40B66a6376d1094a50438f613e2"
+        "0xBBA36CdF020788f0D08D5688c0Bee3fb30ce1C80"
    }
```

```diff
    EOA  (0x61F2945d4bc9E40B66a6376d1094a50438f613e2) {
    +++ description: None
      receivedPermissions:
-        [{"permission":"sequence","from":"ethereum:0x0Dc417F8AF88388737c5053FF73f345f080543F7","description":"Actors allowed to commit transaction batches and propose state roots","role":".getActiveStakers"}]
    }
```

```diff
    EOA  (0xa59B26DB10C5Ca26a97AA2Fd2E74CB8DA9D1EB65) {
    +++ description: None
      receivedPermissions:
-        [{"permission":"sequence","from":"ethereum:0x0Dc417F8AF88388737c5053FF73f345f080543F7","description":"Actors allowed to commit transaction batches and propose state roots","role":".getActiveStakers"}]
    }
```

```diff
    EOA  (0xb6cF39ee72e0127E6Ea6059e38B8C197227a6ac7) {
    +++ description: None
      receivedPermissions:
-        [{"permission":"sequence","from":"ethereum:0x0Dc417F8AF88388737c5053FF73f345f080543F7","description":"Actors allowed to commit transaction batches and propose state roots","role":".getActiveStakers"}]
    }
```

```diff
    EOA  (0xf834ffbeb6bB3F4841afc6b5FB40B94cd580fa23) {
    +++ description: None
      receivedPermissions:
-        [{"permission":"sequence","from":"ethereum:0x0Dc417F8AF88388737c5053FF73f345f080543F7","description":"Actors allowed to commit transaction batches and propose state roots","role":".getActiveStakers"}]
    }
```

Generated with discovered.json: 0xa30282117b815def1e861e3be5408ec2a9bd833d

# Diff at Fri, 23 May 2025 09:41:00 GMT:

- chain: ethereum
- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@69cd181abbc3c830a6caf2f4429b37cae72ffdb8 block: 22466462
- current block number: 22466462

## Description

Introduced .role field on each permission, defaulting to field name on which it was defined (with '.' prefix)

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22466462 (main branch discovery), not current.

```diff
    EOA  (0x0092bC49078f130D27e70dBeee441E227280B97D) {
    +++ description: None
      receivedPermissions.0.role:
+        ".challengers"
    }
```

```diff
    EOA  (0x03FD36AEd3b2597aA79bb5f543f3a0eAf9DEB0FA) {
    +++ description: None
      receivedPermissions.0.role:
+        ".challengers"
    }
```

```diff
    EOA  (0x1721D3Ae2d68E3Dd32525400Ed2a29060F1300c6) {
    +++ description: None
      receivedPermissions.0.role:
+        ".challengers"
    }
```

```diff
    EOA  (0x234aCb24b1DeeA7f6c7530b8c29a6378bA21e1D0) {
    +++ description: None
      receivedPermissions.0.role:
+        ".challengers"
    }
```

```diff
    contract ProxyAdmin (0x31110622D6CA24c9FF307d6ae1715F16E47F16A0) {
    +++ description: None
      directlyReceivedPermissions.7.role:
+        "admin"
      directlyReceivedPermissions.6.role:
+        "admin"
      directlyReceivedPermissions.5.role:
+        "admin"
      directlyReceivedPermissions.4.role:
+        "admin"
      directlyReceivedPermissions.3.role:
+        "admin"
      directlyReceivedPermissions.2.role:
+        "admin"
      directlyReceivedPermissions.1.role:
+        "admin"
      directlyReceivedPermissions.0.role:
+        "admin"
    }
```

```diff
    EOA  (0x323a78C1c910b282dE98a557d735628A02E00983) {
    +++ description: None
      receivedPermissions.0.role:
+        ".challengers"
    }
```

```diff
    EOA  (0x34E387B37d3ADEAa6D5B92cE30dE3af3DCa39796) {
    +++ description: None
      receivedPermissions.0.role:
+        ".getActiveStakers"
    }
```

```diff
    EOA  (0x4Ee3690901157bE86A33371bEc1e5021A10Ba47C) {
    +++ description: None
      receivedPermissions.0.role:
+        ".challengers"
    }
```

```diff
    EOA  (0x5c6E1011cd3b5d7D2937c098b8F61d6B3d1aee7e) {
    +++ description: None
      receivedPermissions.0.role:
+        ".challengers"
    }
```

```diff
    EOA  (0x611e4B24e89bC524Fc06f73b6FD02bE3Ec73d6Db) {
    +++ description: None
      receivedPermissions.0.role:
+        ".challengers"
    }
```

```diff
    EOA  (0x61F2945d4bc9E40B66a6376d1094a50438f613e2) {
    +++ description: None
      receivedPermissions.0.role:
+        ".getActiveStakers"
    }
```

```diff
    EOA  (0x6aB0E960911b50f6d14f249782ac12EC3E7584A0) {
    +++ description: None
      receivedPermissions.0.role:
+        ".getActiveStakers"
    }
```

```diff
    EOA  (0x6D7cC6C62CD6CcdaC482E82aA7A3763926e93854) {
    +++ description: None
      receivedPermissions.0.role:
+        ".challengers"
    }
```

```diff
    EOA  (0x71C10870dC38E54d987C22e96aB32b46cc08564F) {
    +++ description: None
      receivedPermissions.0.role:
+        ".challengers"
    }
```

```diff
    EOA  (0x74204e3801E9394848AbDBAd6f378d0b11e9a091) {
    +++ description: None
      receivedPermissions.0.role:
+        ".challengers"
    }
```

```diff
    EOA  (0x77B29534738E3F0F297d36635d7884965C7c8cE1) {
    +++ description: None
      receivedPermissions.0.role:
+        ".challengers"
    }
```

```diff
    EOA  (0x8C0cFFcBAb44c7aB6e96EB607c49188dE99a17Cd) {
    +++ description: None
      receivedPermissions.0.role:
+        ".challengers"
    }
```

```diff
    EOA  (0x92C4d5d9CaDD1aF74080DE7aa078434007F710Bb) {
    +++ description: None
      receivedPermissions.0.role:
+        ".challengers"
    }
```

```diff
    EOA  (0x95417708f67f4a5dF1A447efe40c6C74e38Ab832) {
    +++ description: None
      receivedPermissions.0.role:
+        ".challengers"
    }
```

```diff
    EOA  (0x95C373754C66feF1Eb2dbb6934aF821C551D9738) {
    +++ description: None
      receivedPermissions.0.role:
+        ".challengers"
    }
```

```diff
    EOA  (0x9Ac29D4f41A139D9b7be32C2906Df9f86FA51b2b) {
    +++ description: None
      receivedPermissions.0.role:
+        ".challengers"
    }
```

```diff
    EOA  (0xa59B26DB10C5Ca26a97AA2Fd2E74CB8DA9D1EB65) {
    +++ description: None
      receivedPermissions.0.role:
+        ".getActiveStakers"
    }
```

```diff
    EOA  (0xb4A20D473e8C378aE742a8017DD67756a358eAB6) {
    +++ description: None
      receivedPermissions.0.role:
+        ".challengers"
    }
```

```diff
    EOA  (0xb6cF39ee72e0127E6Ea6059e38B8C197227a6ac7) {
    +++ description: None
      receivedPermissions.0.role:
+        ".getActiveStakers"
    }
```

```diff
    contract Morph Multisig 2 (0xB822319ab7848b7cC4537c8409e50f85BFb04377) {
    +++ description: None
      receivedPermissions.2.role:
+        ".challengers"
      receivedPermissions.1.role:
+        ".owner"
      receivedPermissions.0.role:
+        ".owner"
    }
```

```diff
    EOA  (0xBBA36CdF020788f0D08D5688c0Bee3fb30ce1C80) {
    +++ description: None
      receivedPermissions.0.role:
+        ".getActiveStakers"
    }
```

```diff
    EOA  (0xbD9f4fdC48a9A8c7eA1075CFDf4F3bd365d50Bab) {
    +++ description: None
      receivedPermissions.0.role:
+        ".challengers"
    }
```

```diff
    EOA  (0xbfd62b7915da8c19C701FD13237b555Ad38C4b4C) {
    +++ description: None
      receivedPermissions.0.role:
+        ".challengers"
    }
```

```diff
    EOA  (0xC412B4e6399F694CfF21D038d225373Fd6596811) {
    +++ description: None
      receivedPermissions.0.role:
+        ".challengers"
    }
```

```diff
    EOA  (0xC4db900F76293042349448D1Ba30F71518325Bb3) {
    +++ description: None
      receivedPermissions.0.role:
+        ".challengers"
    }
```

```diff
    EOA  (0xc8F7DaeF4b49c1593cC3996aB2afa8B56e00fcF8) {
    +++ description: None
      receivedPermissions.0.role:
+        ".challengers"
    }
```

```diff
    EOA  (0xcA00091a35d0b546A15d000F8bCeDA56255EE4D0) {
    +++ description: None
      receivedPermissions.0.role:
+        ".challengers"
    }
```

```diff
    EOA  (0xd11f9c4F5d9b1feC2d14581d3674066442B68772) {
    +++ description: None
      receivedPermissions.0.role:
+        ".challengers"
    }
```

```diff
    EOA  (0xDF063FAEb46de1b4336bC70Da7175f16aB4A7272) {
    +++ description: None
      receivedPermissions.0.role:
+        ".challengers"
    }
```

```diff
    EOA  (0xE48eA86dCdE15E28624E5De9d6D3738fc52B6bFe) {
    +++ description: None
      receivedPermissions.0.role:
+        ".challengers"
    }
```

```diff
    contract Morph Multisig 1 (0xF101f7f59A348c1F971A2BC64fdBdA58c7bBD887) {
    +++ description: None
      receivedPermissions.7.role:
+        "admin"
      receivedPermissions.6.role:
+        "admin"
      receivedPermissions.5.role:
+        "admin"
      receivedPermissions.4.role:
+        "admin"
      receivedPermissions.3.role:
+        "admin"
      receivedPermissions.2.role:
+        "admin"
      receivedPermissions.1.role:
+        "admin"
      receivedPermissions.0.role:
+        "admin"
      directlyReceivedPermissions.0.role:
+        ".owner"
    }
```

```diff
    EOA  (0xF2FF0509520fAf35B511074466A509e00d73C307) {
    +++ description: None
      receivedPermissions.0.role:
+        ".challengers"
    }
```

```diff
    EOA  (0xf50A81C771AD3237aeA2FD18E4ee8055CC4Cd2B9) {
    +++ description: None
      receivedPermissions.0.role:
+        ".challengers"
    }
```

```diff
    EOA  (0xF6Ee30269dB1854987cA6812E1ff66c3A5F660Fd) {
    +++ description: None
      receivedPermissions.0.role:
+        ".challengers"
    }
```

```diff
    EOA  (0xf834ffbeb6bB3F4841afc6b5FB40B94cd580fa23) {
    +++ description: None
      receivedPermissions.0.role:
+        ".getActiveStakers"
    }
```

Generated with discovered.json: 0x0491437995384bf231290d5ba70c1831b021126d

# Diff at Mon, 12 May 2025 12:13:27 GMT:

- chain: ethereum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@43865580b95b7ff3abb4f43944aed50cc5d69ee3 block: 21716626
- current block number: 22466462

## Description

Minor upgrade to the main MorphRollup contract: formatting changes for batch commits, proveState() is now permissioned (onlyActiveStaker).

New verifier deployed, code-identical to the old one (SP1) but new programVkey.

## Watched changes

```diff
    contract MultipleVersionRollupVerifier (0x5d1584c27b4aD233283c6da1ca1B825d6f220EC1) {
    +++ description: Used to update the verifier and keep track of current and old versions.
      values.latestVerifier.1:
+        {"startBatchIndex":0,"verifier":"0xeF88951806f69974bD703Cb9E9eFE362EA0Eb154"}
      values.latestVerifier.0.startBatchIndex:
-        0
+        20230
      values.latestVerifier.0.verifier:
-        "0xeF88951806f69974bD703Cb9E9eFE362EA0Eb154"
+        "0x4006FDA79493FEE14dA42BfA34575aAA79bcf953"
      values.legacyVerifiersLength.1:
+        0
      values.verifierVersions.1:
+        2
    }
```

```diff
    contract MorphRollup (0x759894Ced0e6af42c26668076Ffa84d02E3CeF60) {
    +++ description: The main contract of the Morph chain. Allows to post transaction data and state roots, implements challenge mechanism along with proofs. Sequencing and proposing are behind a whitelist.
      sourceHashes.1:
-        "0x993403059c5620e6c91110514f9f4a2f2331c55dab587699c67c19edddab92ad"
+        "0xf8331668c19c4399a7caf054895f9dd43a0593e13f4fdb6b7ac6cc2b130da357"
      sourceHashes.0:
-        "0xdbd7245a43b9bfda69e999525405cc2d3a44e2a5d60c8fcbc75bb2d4987837be"
+        "0x993403059c5620e6c91110514f9f4a2f2331c55dab587699c67c19edddab92ad"
      values.$implementation:
-        "0x43190DfD1F572Cb56B1942B44482d1774151D77A"
+        "0x9C79e8F5d0fE910d84a6a0d4A03E8136d036eBec"
      values.$pastUpgrades.5:
+        ["2025-01-13T07:31:59.000Z","0x809b1d9bba9fd8f61c038603ddf7a6f0a079db83a4a6d341cf23d2af5764a9be",["0x43190DfD1F572Cb56B1942B44482d1774151D77A"]]
      values.$pastUpgrades.4.2:
-        ["0x43190DfD1F572Cb56B1942B44482d1774151D77A"]
+        "2024-10-19T09:51:35.000Z"
      values.$pastUpgrades.4.1:
-        "2025-01-13T07:31:59.000Z"
+        ["0xcffdDbcb5B9EA2ee45ABA121e0849ADc87c38326"]
      values.$pastUpgrades.4.0:
-        "0x809b1d9bba9fd8f61c038603ddf7a6f0a079db83a4a6d341cf23d2af5764a9be"
+        "0xeb4cc4248a0b3f459f4d7ab5877114fd4f55fd073c78347df548a9f03013068e"
      values.$pastUpgrades.3.2:
-        "2024-10-19T09:51:35.000Z"
+        "2024-10-19T03:11:47.000Z"
      values.$pastUpgrades.3.1.0:
-        "0xcffdDbcb5B9EA2ee45ABA121e0849ADc87c38326"
+        "0x98dF320641C2E65ab4BbeF1e6f6C66D9B50EdE5F"
      values.$pastUpgrades.3.0:
-        "0xeb4cc4248a0b3f459f4d7ab5877114fd4f55fd073c78347df548a9f03013068e"
+        "0xfb3bc602abb088d5d94e6869d56417de3c16a3966e5c6abfa4d157dfbcc36cba"
      values.$pastUpgrades.2.2:
-        "2024-10-19T03:11:47.000Z"
+        ["0xaD900dB30Bcdf84c38Df0067eA327bbEccCF071A"]
      values.$pastUpgrades.2.1:
-        ["0x98dF320641C2E65ab4BbeF1e6f6C66D9B50EdE5F"]
+        "2024-11-28T03:51:59.000Z"
      values.$pastUpgrades.2.0:
-        "0xfb3bc602abb088d5d94e6869d56417de3c16a3966e5c6abfa4d157dfbcc36cba"
+        "0xa452e20183f6860f105cb398bccc9d75dd3758444b956061b3031d1f0a33c424"
      values.$pastUpgrades.1.2:
-        ["0xaD900dB30Bcdf84c38Df0067eA327bbEccCF071A"]
+        "2025-05-12T07:11:23.000Z"
      values.$pastUpgrades.1.1:
-        "2024-11-28T03:51:59.000Z"
+        "0x1cd98e49b0d0c30a39c97683c374f5d3541d1ed02b14272a7113709fe01700d7"
      values.$pastUpgrades.1.0:
-        "0xa452e20183f6860f105cb398bccc9d75dd3758444b956061b3031d1f0a33c424"
+        ["0x9C79e8F5d0fE910d84a6a0d4A03E8136d036eBec"]
      values.$upgradeCount:
-        5
+        6
      values.LAYER_2_CHAIN_ID:
-        2818
+        1
      implementationNames.0x43190DfD1F572Cb56B1942B44482d1774151D77A:
-        "Rollup"
      implementationNames.0x9C79e8F5d0fE910d84a6a0d4A03E8136d036eBec:
+        "Rollup"
    }
```

```diff
+   Status: CREATED
    contract ZkEvmVerifierV1 (0x4006FDA79493FEE14dA42BfA34575aAA79bcf953)
    +++ description: Current SP1 verifier using Blobs for DA.
```

## Source code changes

```diff
.../MorphRollup/Rollup.sol                         |  230 ++--
 ...0x4006FDA79493FEE14dA42BfA34575aAA79bcf953.sol} |    0
 ...-0xeF88951806f69974bD703Cb9E9eFE362EA0Eb154.sol | 1409 ++++++++++++++++++++
 3 files changed, 1485 insertions(+), 154 deletions(-)
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21716626 (main branch discovery), not current.

```diff
    contract ZkEvmVerifierV1 (0xeF88951806f69974bD703Cb9E9eFE362EA0Eb154) {
    +++ description: SP1 verifier using Blobs for DA (being deprecated).
      description:
-        "Current SP1 verifier using Blobs for DA, used to prepare data for the PlonkVerifierV0."
+        "SP1 verifier using Blobs for DA (being deprecated)."
    }
```

Generated with discovered.json: 0xd0349a38ec68c6ca38ae57dd697707463d641e6e

# Diff at Tue, 29 Apr 2025 08:19:07 GMT:

- chain: ethereum
- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@ef7477af00fe0b57a2f7cacf7e958c12494af662 block: 21716626
- current block number: 21716626

## Description

Field .issuedPermissions is removed from the output as no longer needed. Added 'permissionsConfigHash' due to refactoring of the modelling process (into a separate command).

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21716626 (main branch discovery), not current.

```diff
    contract L1Staking (0x0Dc417F8AF88388737c5053FF73f345f080543F7) {
    +++ description: Contract keeping track of stakers which act as sequencers/proposes. It is responsible for stakers registering and withdrawals and for verifying BLS signatures of stakers (currently not implemented).
      issuedPermissions:
-        [{"permission":"sequence","to":"0x34E387B37d3ADEAa6D5B92cE30dE3af3DCa39796","description":"Actors allowed to commit transaction batches and propose state roots","via":[]},{"permission":"sequence","to":"0x61F2945d4bc9E40B66a6376d1094a50438f613e2","description":"Actors allowed to commit transaction batches and propose state roots","via":[]},{"permission":"sequence","to":"0x6aB0E960911b50f6d14f249782ac12EC3E7584A0","description":"Actors allowed to commit transaction batches and propose state roots","via":[]},{"permission":"sequence","to":"0xa59B26DB10C5Ca26a97AA2Fd2E74CB8DA9D1EB65","description":"Actors allowed to commit transaction batches and propose state roots","via":[]},{"permission":"sequence","to":"0xb6cF39ee72e0127E6Ea6059e38B8C197227a6ac7","description":"Actors allowed to commit transaction batches and propose state roots","via":[]},{"permission":"sequence","to":"0xBBA36CdF020788f0D08D5688c0Bee3fb30ce1C80","description":"Actors allowed to commit transaction batches and propose state roots","via":[]},{"permission":"sequence","to":"0xf834ffbeb6bB3F4841afc6b5FB40B94cd580fa23","description":"Actors allowed to commit transaction batches and propose state roots","via":[]},{"permission":"upgrade","to":"0xF101f7f59A348c1F971A2BC64fdBdA58c7bBD887","via":[{"address":"0x31110622D6CA24c9FF307d6ae1715F16E47F16A0"}]}]
    }
```

```diff
    contract L1ETHGateway (0x1C1Ffb5828c3A48B54E8910F1c75256a498aDE68) {
    +++ description: Contract used to bridge ETH from L1 to L2.
      issuedPermissions:
-        [{"permission":"upgrade","to":"0xF101f7f59A348c1F971A2BC64fdBdA58c7bBD887","via":[{"address":"0x31110622D6CA24c9FF307d6ae1715F16E47F16A0"}]}]
    }
```

```diff
    contract L1MessageQueueWithGasPriceOracle (0x3931Ade842F5BB8763164bDd81E5361DcE6cC1EF) {
    +++ description: Contains the array of queued L1 -> L2 messages, either appended using the L1Messenger or the EnforcedTxGateway.
      issuedPermissions:
-        [{"permission":"upgrade","to":"0xF101f7f59A348c1F971A2BC64fdBdA58c7bBD887","via":[{"address":"0x31110622D6CA24c9FF307d6ae1715F16E47F16A0"}]}]
    }
```

```diff
    contract L1StandardERC20Gateway (0x44c28f61A5C2Dd24Fc71D7Df8E85e18af4ab2Bd8) {
    +++ description: Contract used to bridge ERC20 tokens from L1 to L2. It uses a fixed token list.
      issuedPermissions:
-        [{"permission":"upgrade","to":"0xF101f7f59A348c1F971A2BC64fdBdA58c7bBD887","via":[{"address":"0x31110622D6CA24c9FF307d6ae1715F16E47F16A0"}]}]
    }
```

```diff
    contract L1GatewayRouter (0x7497756ADA7e656aE9f00781aF49Fc0fD08f8A8a) {
    +++ description: Main entry point for depositing ETH and ERC20 tokens, which are then forwarded to the correct gateway.
      issuedPermissions:
-        [{"permission":"upgrade","to":"0xF101f7f59A348c1F971A2BC64fdBdA58c7bBD887","via":[{"address":"0x31110622D6CA24c9FF307d6ae1715F16E47F16A0"}]}]
    }
```

```diff
    contract MorphRollup (0x759894Ced0e6af42c26668076Ffa84d02E3CeF60) {
    +++ description: The main contract of the Morph chain. Allows to post transaction data and state roots, implements challenge mechanism along with proofs. Sequencing and proposing are behind a whitelist.
      issuedPermissions:
-        [{"permission":"challenge","to":"0x0092bC49078f130D27e70dBeee441E227280B97D","via":[]},{"permission":"challenge","to":"0x03FD36AEd3b2597aA79bb5f543f3a0eAf9DEB0FA","via":[]},{"permission":"challenge","to":"0x1721D3Ae2d68E3Dd32525400Ed2a29060F1300c6","via":[]},{"permission":"challenge","to":"0x234aCb24b1DeeA7f6c7530b8c29a6378bA21e1D0","via":[]},{"permission":"challenge","to":"0x323a78C1c910b282dE98a557d735628A02E00983","via":[]},{"permission":"challenge","to":"0x4Ee3690901157bE86A33371bEc1e5021A10Ba47C","via":[]},{"permission":"challenge","to":"0x5c6E1011cd3b5d7D2937c098b8F61d6B3d1aee7e","via":[]},{"permission":"challenge","to":"0x611e4B24e89bC524Fc06f73b6FD02bE3Ec73d6Db","via":[]},{"permission":"challenge","to":"0x6D7cC6C62CD6CcdaC482E82aA7A3763926e93854","via":[]},{"permission":"challenge","to":"0x71C10870dC38E54d987C22e96aB32b46cc08564F","via":[]},{"permission":"challenge","to":"0x74204e3801E9394848AbDBAd6f378d0b11e9a091","via":[]},{"permission":"challenge","to":"0x77B29534738E3F0F297d36635d7884965C7c8cE1","via":[]},{"permission":"challenge","to":"0x8C0cFFcBAb44c7aB6e96EB607c49188dE99a17Cd","via":[]},{"permission":"challenge","to":"0x92C4d5d9CaDD1aF74080DE7aa078434007F710Bb","via":[]},{"permission":"challenge","to":"0x95417708f67f4a5dF1A447efe40c6C74e38Ab832","via":[]},{"permission":"challenge","to":"0x95C373754C66feF1Eb2dbb6934aF821C551D9738","via":[]},{"permission":"challenge","to":"0x9Ac29D4f41A139D9b7be32C2906Df9f86FA51b2b","via":[]},{"permission":"challenge","to":"0xb4A20D473e8C378aE742a8017DD67756a358eAB6","via":[]},{"permission":"challenge","to":"0xB822319ab7848b7cC4537c8409e50f85BFb04377","via":[]},{"permission":"challenge","to":"0xbD9f4fdC48a9A8c7eA1075CFDf4F3bd365d50Bab","via":[]},{"permission":"challenge","to":"0xbfd62b7915da8c19C701FD13237b555Ad38C4b4C","via":[]},{"permission":"challenge","to":"0xC412B4e6399F694CfF21D038d225373Fd6596811","via":[]},{"permission":"challenge","to":"0xC4db900F76293042349448D1Ba30F71518325Bb3","via":[]},{"permission":"challenge","to":"0xc8F7DaeF4b49c1593cC3996aB2afa8B56e00fcF8","via":[]},{"permission":"challenge","to":"0xcA00091a35d0b546A15d000F8bCeDA56255EE4D0","via":[]},{"permission":"challenge","to":"0xd11f9c4F5d9b1feC2d14581d3674066442B68772","via":[]},{"permission":"challenge","to":"0xDF063FAEb46de1b4336bC70Da7175f16aB4A7272","via":[]},{"permission":"challenge","to":"0xE48eA86dCdE15E28624E5De9d6D3738fc52B6bFe","via":[]},{"permission":"challenge","to":"0xF2FF0509520fAf35B511074466A509e00d73C307","via":[]},{"permission":"challenge","to":"0xf50A81C771AD3237aeA2FD18E4ee8055CC4Cd2B9","via":[]},{"permission":"challenge","to":"0xF6Ee30269dB1854987cA6812E1ff66c3A5F660Fd","via":[]},{"permission":"interact","to":"0xB822319ab7848b7cC4537c8409e50f85BFb04377","description":"can pause and unpause, override any batch, revert batch, update proof window, update challengers, modify verifiers","via":[]},{"permission":"upgrade","to":"0xF101f7f59A348c1F971A2BC64fdBdA58c7bBD887","via":[{"address":"0x31110622D6CA24c9FF307d6ae1715F16E47F16A0"}]}]
    }
```

```diff
    contract EnforcedTxGateway (0xc5Fa3b8968c7FAbEeA2B530a20b88d0C2eD8abb7) {
    +++ description: Contracts to force L1 -> L2 messages with the proper sender. Currently paused: true.
      issuedPermissions:
-        [{"permission":"interact","to":"0xB822319ab7848b7cC4537c8409e50f85BFb04377","description":"can pause and unpause","via":[]},{"permission":"upgrade","to":"0xF101f7f59A348c1F971A2BC64fdBdA58c7bBD887","via":[{"address":"0x31110622D6CA24c9FF307d6ae1715F16E47F16A0"}]}]
    }
```

```diff
    contract L1CrossDomainMessenger (0xDc71366EFFA760804DCFC3EDF87fa2A6f1623304) {
    +++ description: Contract used to send L1 -> L2 and relay messages from L2. It allows to replay failed messages and to drop skipped messages. L1 -> L2 messages sent using this contract pay for L2 gas on L1 and will have the aliased address of this contract as the sender.
      issuedPermissions:
-        [{"permission":"upgrade","to":"0xF101f7f59A348c1F971A2BC64fdBdA58c7bBD887","via":[{"address":"0x31110622D6CA24c9FF307d6ae1715F16E47F16A0"}]}]
    }
```

Generated with discovered.json: 0x7e6bb9aa37be53467f4995afc7b331e8bc063eed

# Diff at Tue, 18 Mar 2025 08:13:16 GMT:

- chain: ethereum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@4ef7a8dbcec1cd9fec77aae2b73d81347a4ffb13 block: 21716626
- current block number: 21716626

## Description

Config: change Multisig names.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21716626 (main branch discovery), not current.

```diff
    contract Morph Multisig 2 (0xB822319ab7848b7cC4537c8409e50f85BFb04377) {
    +++ description: None
      name:
-        "MorphOpsMultisig"
+        "Morph Multisig 2"
    }
```

```diff
    contract Morph Multisig 1 (0xF101f7f59A348c1F971A2BC64fdBdA58c7bBD887) {
    +++ description: None
      name:
-        "MorphUpgradeMultisig"
+        "Morph Multisig 1"
    }
```

Generated with discovered.json: 0xee4fe0398b7223b4347af94b4b267fcac13515f0

# Diff at Tue, 04 Mar 2025 10:39:27 GMT:

- chain: ethereum
- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@98d260b45fe0d2195ce5e629bd7b200c8706e8ba block: 21716626
- current block number: 21716626

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21716626 (main branch discovery), not current.

```diff
    contract L1Staking (0x0Dc417F8AF88388737c5053FF73f345f080543F7) {
    +++ description: Contract keeping track of stakers which act as sequencers/proposes. It is responsible for stakers registering and withdrawals and for verifying BLS signatures of stakers (currently not implemented).
      sinceBlock:
+        20996843
    }
```

```diff
    contract L1ETHGateway (0x1C1Ffb5828c3A48B54E8910F1c75256a498aDE68) {
    +++ description: Contract used to bridge ETH from L1 to L2.
      sinceBlock:
+        20996854
    }
```

```diff
    contract ProxyAdmin (0x31110622D6CA24c9FF307d6ae1715F16E47F16A0) {
    +++ description: None
      sinceBlock:
+        20996776
    }
```

```diff
    contract L1MessageQueueWithGasPriceOracle (0x3931Ade842F5BB8763164bDd81E5361DcE6cC1EF) {
    +++ description: Contains the array of queued L1 -> L2 messages, either appended using the L1Messenger or the EnforcedTxGateway.
      sinceBlock:
+        20996821
    }
```

```diff
    contract L1StandardERC20Gateway (0x44c28f61A5C2Dd24Fc71D7Df8E85e18af4ab2Bd8) {
    +++ description: Contract used to bridge ERC20 tokens from L1 to L2. It uses a fixed token list.
      sinceBlock:
+        20996858
    }
```

```diff
    contract MultipleVersionRollupVerifier (0x5d1584c27b4aD233283c6da1ca1B825d6f220EC1) {
    +++ description: Used to update the verifier and keep track of current and old versions.
      sinceBlock:
+        21664323
    }
```

```diff
    contract L1GatewayRouter (0x7497756ADA7e656aE9f00781aF49Fc0fD08f8A8a) {
    +++ description: Main entry point for depositing ETH and ERC20 tokens, which are then forwarded to the correct gateway.
      sinceBlock:
+        20996850
    }
```

```diff
    contract MorphRollup (0x759894Ced0e6af42c26668076Ffa84d02E3CeF60) {
    +++ description: The main contract of the Morph chain. Allows to post transaction data and state roots, implements challenge mechanism along with proofs. Sequencing and proposing are behind a whitelist.
      sinceBlock:
+        20996846
    }
```

```diff
    contract MorphOpsMultisig (0xB822319ab7848b7cC4537c8409e50f85BFb04377) {
    +++ description: None
      sinceBlock:
+        21020988
    }
```

```diff
    contract EnforcedTxGateway (0xc5Fa3b8968c7FAbEeA2B530a20b88d0C2eD8abb7) {
    +++ description: Contracts to force L1 -> L2 messages with the proper sender. Currently paused: true.
      sinceBlock:
+        20996899
    }
```

```diff
    contract L1CrossDomainMessenger (0xDc71366EFFA760804DCFC3EDF87fa2A6f1623304) {
    +++ description: Contract used to send L1 -> L2 and relay messages from L2. It allows to replay failed messages and to drop skipped messages. L1 -> L2 messages sent using this contract pay for L2 gas on L1 and will have the aliased address of this contract as the sender.
      sinceBlock:
+        20996813
    }
```

```diff
    contract ZkEvmVerifierV1 (0xeF88951806f69974bD703Cb9E9eFE362EA0Eb154) {
    +++ description: Current SP1 verifier using Blobs for DA, used to prepare data for the PlonkVerifierV0.
      sinceBlock:
+        21614228
    }
```

```diff
    contract MorphUpgradeMultisig (0xF101f7f59A348c1F971A2BC64fdBdA58c7bBD887) {
    +++ description: None
      sinceBlock:
+        21135313
    }
```

```diff
    contract Whitelist (0xFFafDd9167777C0e5421e0B6789D6d7A5E386984) {
    +++ description: Contract implementing a generic whitelist. Currently used to define the actor that can relay the L2 basefee on L1.
      sinceBlock:
+        20998580
    }
```

Generated with discovered.json: 0x003aaa7a46d1f310931c353ed8f8597f22930574

# Diff at Tue, 04 Feb 2025 12:31:43 GMT:

- chain: ethereum
- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@145553eed7ba44636411ecb25e4099728acd02f9 block: 21716626
- current block number: 21716626

## Description

Rename 'configure' permission to 'interact'

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21716626 (main branch discovery), not current.

```diff
    contract MorphRollup (0x759894Ced0e6af42c26668076Ffa84d02E3CeF60) {
    +++ description: The main contract of the Morph chain. Allows to post transaction data and state roots, implements challenge mechanism along with proofs. Sequencing and proposing are behind a whitelist.
      issuedPermissions.31.permission:
-        "configure"
+        "interact"
    }
```

```diff
    contract MorphOpsMultisig (0xB822319ab7848b7cC4537c8409e50f85BFb04377) {
    +++ description: None
      receivedPermissions.2.permission:
-        "configure"
+        "interact"
      receivedPermissions.1.permission:
-        "configure"
+        "interact"
    }
```

```diff
    contract EnforcedTxGateway (0xc5Fa3b8968c7FAbEeA2B530a20b88d0C2eD8abb7) {
    +++ description: Contracts to force L1 -> L2 messages with the proper sender. Currently paused: true.
      issuedPermissions.0.permission:
-        "configure"
+        "interact"
    }
```

Generated with discovered.json: 0x14f7cc719378d2cf73df1be47f04f33e7e46a592

# Diff at Mon, 27 Jan 2025 15:02:32 GMT:

- chain: ethereum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@3683d6e8b703ed59c2657f83d1b54955644c5977 block: 21678881
- current block number: 21716626

## Description

new templates.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21678881 (main branch discovery), not current.

```diff
    contract ProxyAdmin (0x31110622D6CA24c9FF307d6ae1715F16E47F16A0) {
    +++ description: None
      template:
+        "global/ProxyAdmin"
    }
```

Generated with discovered.json: 0x7479eba0469174faed82a2293c6ad1775a6ad1ef

# Diff at Wed, 22 Jan 2025 10:04:06 GMT:

- chain: ethereum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@ae0363af45e5c1f3ac9d68ef4ce62fdaada6de1c block: 21667783
- current block number: 21678881

## Description

New verifier, new Proxyadmin owner MS.

MultipleVersionRollupVerifier (verifier router) has minimal changes.

ZkEvmVerifierV1 (the actual verifier) is code-identical with the previous one.

## Watched changes

```diff
    contract L1Staking (0x0Dc417F8AF88388737c5053FF73f345f080543F7) {
    +++ description: Contract keeping track of stakers which act as sequencers/proposes. It is responsible for stakers registering and withdrawals and for verifying BLS signatures of stakers (currently not implemented).
      issuedPermissions.7.to:
-        "0xB822319ab7848b7cC4537c8409e50f85BFb04377"
+        "0xF101f7f59A348c1F971A2BC64fdBdA58c7bBD887"
    }
```

```diff
    contract L1ETHGateway (0x1C1Ffb5828c3A48B54E8910F1c75256a498aDE68) {
    +++ description: Contract used to bridge ETH from L1 to L2.
      issuedPermissions.0.to:
-        "0xB822319ab7848b7cC4537c8409e50f85BFb04377"
+        "0xF101f7f59A348c1F971A2BC64fdBdA58c7bBD887"
    }
```

```diff
    contract ProxyAdmin (0x31110622D6CA24c9FF307d6ae1715F16E47F16A0) {
    +++ description: None
      values.owner:
-        "0xB822319ab7848b7cC4537c8409e50f85BFb04377"
+        "0xF101f7f59A348c1F971A2BC64fdBdA58c7bBD887"
    }
```

```diff
    contract L1MessageQueueWithGasPriceOracle (0x3931Ade842F5BB8763164bDd81E5361DcE6cC1EF) {
    +++ description: Contains the array of queued L1 -> L2 messages, either appended using the L1Messenger or the EnforcedTxGateway.
      issuedPermissions.0.to:
-        "0xB822319ab7848b7cC4537c8409e50f85BFb04377"
+        "0xF101f7f59A348c1F971A2BC64fdBdA58c7bBD887"
    }
```

```diff
    contract L1StandardERC20Gateway (0x44c28f61A5C2Dd24Fc71D7Df8E85e18af4ab2Bd8) {
    +++ description: Contract used to bridge ERC20 tokens from L1 to L2. It uses a fixed token list.
      issuedPermissions.0.to:
-        "0xB822319ab7848b7cC4537c8409e50f85BFb04377"
+        "0xF101f7f59A348c1F971A2BC64fdBdA58c7bBD887"
    }
```

```diff
-   Status: DELETED
    contract ZkEvmVerifierV1 (0x6dAece7dFaE212b6A9F55c56FD3cf1462F44069e)
    +++ description: None
```

```diff
    contract L1GatewayRouter (0x7497756ADA7e656aE9f00781aF49Fc0fD08f8A8a) {
    +++ description: Main entry point for depositing ETH and ERC20 tokens, which are then forwarded to the correct gateway.
      issuedPermissions.0.to:
-        "0xB822319ab7848b7cC4537c8409e50f85BFb04377"
+        "0xF101f7f59A348c1F971A2BC64fdBdA58c7bBD887"
    }
```

```diff
    contract MorphRollup (0x759894Ced0e6af42c26668076Ffa84d02E3CeF60) {
    +++ description: The main contract of the Morph chain. Allows to post transaction data and state roots, implements challenge mechanism along with proofs. Sequencing and proposing are behind a whitelist.
      issuedPermissions.32.to:
-        "0xB822319ab7848b7cC4537c8409e50f85BFb04377"
+        "0xF101f7f59A348c1F971A2BC64fdBdA58c7bBD887"
      values.verifier:
-        "0x87C1D0dAb8d96b69CB91f97F4135E3ed5A49DCF6"
+        "0x5d1584c27b4aD233283c6da1ca1B825d6f220EC1"
    }
```

```diff
-   Status: DELETED
    contract MultipleVersionRollupVerifier (0x87C1D0dAb8d96b69CB91f97F4135E3ed5A49DCF6)
    +++ description: None
```

```diff
    contract MorphOpsMultisig (0xB822319ab7848b7cC4537c8409e50f85BFb04377) {
    +++ description: None
      receivedPermissions.10:
-        {"permission":"upgrade","from":"0xDc71366EFFA760804DCFC3EDF87fa2A6f1623304","via":[{"address":"0x31110622D6CA24c9FF307d6ae1715F16E47F16A0"}]}
      receivedPermissions.9:
-        {"permission":"upgrade","from":"0xc5Fa3b8968c7FAbEeA2B530a20b88d0C2eD8abb7","via":[{"address":"0x31110622D6CA24c9FF307d6ae1715F16E47F16A0"}]}
      receivedPermissions.8:
-        {"permission":"upgrade","from":"0x759894Ced0e6af42c26668076Ffa84d02E3CeF60","via":[{"address":"0x31110622D6CA24c9FF307d6ae1715F16E47F16A0"}]}
      receivedPermissions.7:
-        {"permission":"upgrade","from":"0x7497756ADA7e656aE9f00781aF49Fc0fD08f8A8a","via":[{"address":"0x31110622D6CA24c9FF307d6ae1715F16E47F16A0"}]}
      receivedPermissions.6:
-        {"permission":"upgrade","from":"0x44c28f61A5C2Dd24Fc71D7Df8E85e18af4ab2Bd8","via":[{"address":"0x31110622D6CA24c9FF307d6ae1715F16E47F16A0"}]}
      receivedPermissions.5:
-        {"permission":"upgrade","from":"0x3931Ade842F5BB8763164bDd81E5361DcE6cC1EF","via":[{"address":"0x31110622D6CA24c9FF307d6ae1715F16E47F16A0"}]}
      receivedPermissions.4:
-        {"permission":"upgrade","from":"0x1C1Ffb5828c3A48B54E8910F1c75256a498aDE68","via":[{"address":"0x31110622D6CA24c9FF307d6ae1715F16E47F16A0"}]}
      receivedPermissions.3:
-        {"permission":"upgrade","from":"0x0Dc417F8AF88388737c5053FF73f345f080543F7","via":[{"address":"0x31110622D6CA24c9FF307d6ae1715F16E47F16A0"}]}
      directlyReceivedPermissions:
-        [{"permission":"act","from":"0x31110622D6CA24c9FF307d6ae1715F16E47F16A0"}]
    }
```

```diff
    contract EnforcedTxGateway (0xc5Fa3b8968c7FAbEeA2B530a20b88d0C2eD8abb7) {
    +++ description: Contracts to force L1 -> L2 messages with the proper sender. Currently paused: true.
      issuedPermissions.1.to:
-        "0xB822319ab7848b7cC4537c8409e50f85BFb04377"
+        "0xF101f7f59A348c1F971A2BC64fdBdA58c7bBD887"
    }
```

```diff
    contract L1CrossDomainMessenger (0xDc71366EFFA760804DCFC3EDF87fa2A6f1623304) {
    +++ description: Contract used to send L1 -> L2 and relay messages from L2. It allows to replay failed messages and to drop skipped messages. L1 -> L2 messages sent using this contract pay for L2 gas on L1 and will have the aliased address of this contract as the sender.
      issuedPermissions.0.to:
-        "0xB822319ab7848b7cC4537c8409e50f85BFb04377"
+        "0xF101f7f59A348c1F971A2BC64fdBdA58c7bBD887"
    }
```

```diff
+   Status: CREATED
    contract MultipleVersionRollupVerifier (0x5d1584c27b4aD233283c6da1ca1B825d6f220EC1)
    +++ description: Used to update the verifier and keep track of current and old versions.
```

```diff
+   Status: CREATED
    contract ZkEvmVerifierV1 (0xeF88951806f69974bD703Cb9E9eFE362EA0Eb154)
    +++ description: Current SP1 verifier using Blobs for DA, used to prepare data for the PlonkVerifierV0.
```

```diff
+   Status: CREATED
    contract MorphUpgradeMultisig (0xF101f7f59A348c1F971A2BC64fdBdA58c7bBD887)
    +++ description: None
```

## Source code changes

```diff
.../ethereum/.flat/MorphUpgradeMultisig/Safe.sol   | 1088 ++++++++++++++++++++
 .../.flat/MorphUpgradeMultisig/SafeProxy.p.sol     |   37 +
 .../MultipleVersionRollupVerifier.sol              |   13 +-
 3 files changed, 1137 insertions(+), 1 deletion(-)
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21667783 (main branch discovery), not current.

```diff
    contract ZkEvmVerifierV1 (0x6dAece7dFaE212b6A9F55c56FD3cf1462F44069e) {
    +++ description: None
      description:
-        "Current SP1 verifier using Blobs for DA, used to prepare data for the PlonkVerifierV0."
    }
```

```diff
    contract MultipleVersionRollupVerifier (0x87C1D0dAb8d96b69CB91f97F4135E3ed5A49DCF6) {
    +++ description: None
      description:
-        "Used to update the verifier and keep track of current and old versions."
      values.latestVerifier.4:
+        [0,"0x0000000000000000000000000000000000000000"]
      values.latestVerifier.3:
+        [0,"0x0000000000000000000000000000000000000000"]
      values.latestVerifier.2:
+        [0,"0x0000000000000000000000000000000000000000"]
      values.latestVerifier.1:
+        [0,"0x0000000000000000000000000000000000000000"]
      values.latestVerifier.0:
-        {"startBatchIndex":0,"verifier":"0x6dAece7dFaE212b6A9F55c56FD3cf1462F44069e"}
+        [0,"0x6dAece7dFaE212b6A9F55c56FD3cf1462F44069e"]
      values.legacyVerifiersLength.4:
+        0
      values.legacyVerifiersLength.3:
+        0
      values.legacyVerifiersLength.2:
+        0
      values.legacyVerifiersLength.1:
+        0
      values.verifierVersions:
-        [0]
      errors:
+        {"latestVerifier":"Processing error occurred.","legacyVerifiersLength":"Processing error occurred."}
    }
```

```diff
    contract MorphOpsMultisig (0xB822319ab7848b7cC4537c8409e50f85BFb04377) {
    +++ description: None
      name:
-        "MorphAdminMSig"
+        "MorphOpsMultisig"
    }
```

Generated with discovered.json: 0x72f1722fef77263dbdc89f0ae4a67e13359d4916

# Diff at Mon, 20 Jan 2025 19:26:41 GMT:

- chain: ethereum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@3a16743af72fb4c941689b26d336a59661143f06 block: 21465401
- current block number: 21667783

## Description

Upgrades to MorphRollup, L1MessageQueueWithGasPriceOracle, L1CrossDomainMessenger to **deprecate skipping / dropping messages from the queue**.

There is no enforcement of the processing of the queue. 

The EnforcedTxGateway is still paused (It is, apart from the L1CrossDomainMessenger, the only address that can append messages to the L1MessageQueue) and thus queuing transactions is currently not possible.

Some Challengers are apparently run by bitget / bitget wallet.

## Watched changes

```diff
    contract L1MessageQueueWithGasPriceOracle (0x3931Ade842F5BB8763164bDd81E5361DcE6cC1EF) {
    +++ description: Contains the array of queued L1 -> L2 messages, either appended using the L1Messenger or the EnforcedTxGateway.
      sourceHashes.1:
-        "0xe43c8aca9b520edaff0a7339959cee77a47b241a07c6d0dd9836e466caf35e72"
+        "0x1719cdcf5cd2921747ddc6f0dea1d383d56e48c613a99782597914a32d40e4cd"
      values.$implementation:
-        "0x828F68e2E05a34fA836416F124350E25021876ac"
+        "0xa3b5bFB885FF92EB8445f262c289548e77c3c0aA"
      values.$pastUpgrades.2:
+        ["2025-01-13T08:11:59.000Z","0x60cc38cb058516da361ecd5f548fc9216fbcda9eb08255b529ebbf78dac44f7b",["0xa3b5bFB885FF92EB8445f262c289548e77c3c0aA"]]
      values.$upgradeCount:
-        2
+        3
    }
```

```diff
    contract MorphRollup (0x759894Ced0e6af42c26668076Ffa84d02E3CeF60) {
    +++ description: The main contract of the Morph chain. Allows to post transaction data and state roots, implements challenge mechanism along with proofs. Sequencing and proposing are behind a whitelist.
      sourceHashes.1:
-        "0x2b50f40d48451dfa5ae761371d1c0b18c8c827b34d17c401f629bc743888721e"
+        "0xdbd7245a43b9bfda69e999525405cc2d3a44e2a5d60c8fcbc75bb2d4987837be"
      values.$implementation:
-        "0xaD900dB30Bcdf84c38Df0067eA327bbEccCF071A"
+        "0x43190DfD1F572Cb56B1942B44482d1774151D77A"
      values.$pastUpgrades.4:
+        ["2025-01-13T07:31:59.000Z","0x809b1d9bba9fd8f61c038603ddf7a6f0a079db83a4a6d341cf23d2af5764a9be",["0x43190DfD1F572Cb56B1942B44482d1774151D77A"]]
      values.$upgradeCount:
-        4
+        5
    }
```

```diff
    contract L1CrossDomainMessenger (0xDc71366EFFA760804DCFC3EDF87fa2A6f1623304) {
    +++ description: Contract used to send L1 -> L2 and relay messages from L2. It allows to replay failed messages and to drop skipped messages. L1 -> L2 messages sent using this contract pay for L2 gas on L1 and will have the aliased address of this contract as the sender.
      sourceHashes.1:
-        "0x1a0a7d2a0ed1f83c7043abd7a9f1f24c979e7e86e258c7968ed007894fbf2a4a"
+        "0xdddbb6a01d10a0241f53955182f6b04e5ee4ec2561e412672adae6aa9177fd49"
      values.$implementation:
-        "0xB8F0871bc0832cb756f07fFC4bDdC8b6bf8577b5"
+        "0x0cC37d5239F9027A1269f53D83c73084D538f3a9"
      values.$pastUpgrades.2:
+        ["2025-01-13T08:10:23.000Z","0x908d9fce8cd9a787900543daabf45936a8873b543f593030f3edceeca35543f8",["0x0cC37d5239F9027A1269f53D83c73084D538f3a9"]]
      values.$upgradeCount:
-        2
+        3
    }
```

## Source code changes

```diff
.../L1CrossDomainMessenger.sol                     |  71 +-------------
 .../L1MessageQueueWithGasPriceOracle.sol           |  75 ++------------
 .../MorphRollup/Rollup.sol                         | 108 +++------------------
 3 files changed, 23 insertions(+), 231 deletions(-)
```

Generated with discovered.json: 0x4b1155ee8d29fc6ba304940cc3148b73d7aa5d5e

# Diff at Mon, 20 Jan 2025 11:09:46 GMT:

- chain: ethereum
- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@2c8b4f3d9910bb6371be9b4df87b70856e7d8c64 block: 21465401
- current block number: 21465401

## Description

Rerun on the same block number. Applies fixes to permissions and via field. Renames permission's target to to/from.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21465401 (main branch discovery), not current.

```diff
    contract L1Staking (0x0Dc417F8AF88388737c5053FF73f345f080543F7) {
    +++ description: Contract keeping track of stakers which act as sequencers/proposes. It is responsible for stakers registering and withdrawals and for verifying BLS signatures of stakers (currently not implemented).
      issuedPermissions.7.target:
-        "0xB822319ab7848b7cC4537c8409e50f85BFb04377"
      issuedPermissions.7.via.0.delay:
-        0
      issuedPermissions.7.to:
+        "0xB822319ab7848b7cC4537c8409e50f85BFb04377"
      issuedPermissions.6.target:
-        "0xf834ffbeb6bB3F4841afc6b5FB40B94cd580fa23"
      issuedPermissions.6.to:
+        "0xf834ffbeb6bB3F4841afc6b5FB40B94cd580fa23"
      issuedPermissions.6.description:
+        "Actors allowed to commit transaction batches and propose state roots"
      issuedPermissions.5.target:
-        "0xBBA36CdF020788f0D08D5688c0Bee3fb30ce1C80"
      issuedPermissions.5.to:
+        "0xBBA36CdF020788f0D08D5688c0Bee3fb30ce1C80"
      issuedPermissions.5.description:
+        "Actors allowed to commit transaction batches and propose state roots"
      issuedPermissions.4.target:
-        "0xb6cF39ee72e0127E6Ea6059e38B8C197227a6ac7"
      issuedPermissions.4.to:
+        "0xb6cF39ee72e0127E6Ea6059e38B8C197227a6ac7"
      issuedPermissions.4.description:
+        "Actors allowed to commit transaction batches and propose state roots"
      issuedPermissions.3.target:
-        "0xa59B26DB10C5Ca26a97AA2Fd2E74CB8DA9D1EB65"
      issuedPermissions.3.to:
+        "0xa59B26DB10C5Ca26a97AA2Fd2E74CB8DA9D1EB65"
      issuedPermissions.3.description:
+        "Actors allowed to commit transaction batches and propose state roots"
      issuedPermissions.2.target:
-        "0x6aB0E960911b50f6d14f249782ac12EC3E7584A0"
      issuedPermissions.2.to:
+        "0x6aB0E960911b50f6d14f249782ac12EC3E7584A0"
      issuedPermissions.2.description:
+        "Actors allowed to commit transaction batches and propose state roots"
      issuedPermissions.1.target:
-        "0x61F2945d4bc9E40B66a6376d1094a50438f613e2"
      issuedPermissions.1.to:
+        "0x61F2945d4bc9E40B66a6376d1094a50438f613e2"
      issuedPermissions.1.description:
+        "Actors allowed to commit transaction batches and propose state roots"
      issuedPermissions.0.target:
-        "0x34E387B37d3ADEAa6D5B92cE30dE3af3DCa39796"
      issuedPermissions.0.to:
+        "0x34E387B37d3ADEAa6D5B92cE30dE3af3DCa39796"
      issuedPermissions.0.description:
+        "Actors allowed to commit transaction batches and propose state roots"
    }
```

```diff
    contract L1ETHGateway (0x1C1Ffb5828c3A48B54E8910F1c75256a498aDE68) {
    +++ description: Contract used to bridge ETH from L1 to L2.
      issuedPermissions.0.target:
-        "0xB822319ab7848b7cC4537c8409e50f85BFb04377"
      issuedPermissions.0.via.0.delay:
-        0
      issuedPermissions.0.to:
+        "0xB822319ab7848b7cC4537c8409e50f85BFb04377"
    }
```

```diff
    contract ProxyAdmin (0x31110622D6CA24c9FF307d6ae1715F16E47F16A0) {
    +++ description: None
      directlyReceivedPermissions.7.target:
-        "0xDc71366EFFA760804DCFC3EDF87fa2A6f1623304"
      directlyReceivedPermissions.7.from:
+        "0xDc71366EFFA760804DCFC3EDF87fa2A6f1623304"
      directlyReceivedPermissions.6.target:
-        "0xc5Fa3b8968c7FAbEeA2B530a20b88d0C2eD8abb7"
      directlyReceivedPermissions.6.from:
+        "0xc5Fa3b8968c7FAbEeA2B530a20b88d0C2eD8abb7"
      directlyReceivedPermissions.5.target:
-        "0x759894Ced0e6af42c26668076Ffa84d02E3CeF60"
      directlyReceivedPermissions.5.from:
+        "0x759894Ced0e6af42c26668076Ffa84d02E3CeF60"
      directlyReceivedPermissions.4.target:
-        "0x7497756ADA7e656aE9f00781aF49Fc0fD08f8A8a"
      directlyReceivedPermissions.4.from:
+        "0x7497756ADA7e656aE9f00781aF49Fc0fD08f8A8a"
      directlyReceivedPermissions.3.target:
-        "0x44c28f61A5C2Dd24Fc71D7Df8E85e18af4ab2Bd8"
      directlyReceivedPermissions.3.from:
+        "0x44c28f61A5C2Dd24Fc71D7Df8E85e18af4ab2Bd8"
      directlyReceivedPermissions.2.target:
-        "0x3931Ade842F5BB8763164bDd81E5361DcE6cC1EF"
      directlyReceivedPermissions.2.from:
+        "0x3931Ade842F5BB8763164bDd81E5361DcE6cC1EF"
      directlyReceivedPermissions.1.target:
-        "0x1C1Ffb5828c3A48B54E8910F1c75256a498aDE68"
      directlyReceivedPermissions.1.from:
+        "0x1C1Ffb5828c3A48B54E8910F1c75256a498aDE68"
      directlyReceivedPermissions.0.target:
-        "0x0Dc417F8AF88388737c5053FF73f345f080543F7"
      directlyReceivedPermissions.0.from:
+        "0x0Dc417F8AF88388737c5053FF73f345f080543F7"
    }
```

```diff
    contract L1MessageQueueWithGasPriceOracle (0x3931Ade842F5BB8763164bDd81E5361DcE6cC1EF) {
    +++ description: Contains the array of queued L1 -> L2 messages, either appended using the L1Messenger or the EnforcedTxGateway.
      issuedPermissions.0.target:
-        "0xB822319ab7848b7cC4537c8409e50f85BFb04377"
      issuedPermissions.0.via.0.delay:
-        0
      issuedPermissions.0.to:
+        "0xB822319ab7848b7cC4537c8409e50f85BFb04377"
    }
```

```diff
    contract L1StandardERC20Gateway (0x44c28f61A5C2Dd24Fc71D7Df8E85e18af4ab2Bd8) {
    +++ description: Contract used to bridge ERC20 tokens from L1 to L2. It uses a fixed token list.
      issuedPermissions.0.target:
-        "0xB822319ab7848b7cC4537c8409e50f85BFb04377"
      issuedPermissions.0.via.0.delay:
-        0
      issuedPermissions.0.to:
+        "0xB822319ab7848b7cC4537c8409e50f85BFb04377"
    }
```

```diff
    contract L1GatewayRouter (0x7497756ADA7e656aE9f00781aF49Fc0fD08f8A8a) {
    +++ description: Main entry point for depositing ETH and ERC20 tokens, which are then forwarded to the correct gateway.
      issuedPermissions.0.target:
-        "0xB822319ab7848b7cC4537c8409e50f85BFb04377"
      issuedPermissions.0.via.0.delay:
-        0
      issuedPermissions.0.to:
+        "0xB822319ab7848b7cC4537c8409e50f85BFb04377"
    }
```

```diff
    contract MorphRollup (0x759894Ced0e6af42c26668076Ffa84d02E3CeF60) {
    +++ description: The main contract of the Morph chain. Allows to post transaction data and state roots, implements challenge mechanism along with proofs. Sequencing and proposing are behind a whitelist.
      issuedPermissions.32.target:
-        "0xB822319ab7848b7cC4537c8409e50f85BFb04377"
      issuedPermissions.32.via.0.delay:
-        0
      issuedPermissions.32.to:
+        "0xB822319ab7848b7cC4537c8409e50f85BFb04377"
      issuedPermissions.31.target:
-        "0xB822319ab7848b7cC4537c8409e50f85BFb04377"
      issuedPermissions.31.to:
+        "0xB822319ab7848b7cC4537c8409e50f85BFb04377"
      issuedPermissions.31.description:
+        "can pause and unpause, override any batch, revert batch, update proof window, update challengers, modify verifiers"
      issuedPermissions.30.target:
-        "0xF6Ee30269dB1854987cA6812E1ff66c3A5F660Fd"
      issuedPermissions.30.to:
+        "0xF6Ee30269dB1854987cA6812E1ff66c3A5F660Fd"
      issuedPermissions.29.target:
-        "0xf50A81C771AD3237aeA2FD18E4ee8055CC4Cd2B9"
      issuedPermissions.29.to:
+        "0xf50A81C771AD3237aeA2FD18E4ee8055CC4Cd2B9"
      issuedPermissions.28.target:
-        "0xF2FF0509520fAf35B511074466A509e00d73C307"
      issuedPermissions.28.to:
+        "0xF2FF0509520fAf35B511074466A509e00d73C307"
      issuedPermissions.27.target:
-        "0xE48eA86dCdE15E28624E5De9d6D3738fc52B6bFe"
      issuedPermissions.27.to:
+        "0xE48eA86dCdE15E28624E5De9d6D3738fc52B6bFe"
      issuedPermissions.26.target:
-        "0xDF063FAEb46de1b4336bC70Da7175f16aB4A7272"
      issuedPermissions.26.to:
+        "0xDF063FAEb46de1b4336bC70Da7175f16aB4A7272"
      issuedPermissions.25.target:
-        "0xd11f9c4F5d9b1feC2d14581d3674066442B68772"
      issuedPermissions.25.to:
+        "0xd11f9c4F5d9b1feC2d14581d3674066442B68772"
      issuedPermissions.24.target:
-        "0xcA00091a35d0b546A15d000F8bCeDA56255EE4D0"
      issuedPermissions.24.to:
+        "0xcA00091a35d0b546A15d000F8bCeDA56255EE4D0"
      issuedPermissions.23.target:
-        "0xc8F7DaeF4b49c1593cC3996aB2afa8B56e00fcF8"
      issuedPermissions.23.to:
+        "0xc8F7DaeF4b49c1593cC3996aB2afa8B56e00fcF8"
      issuedPermissions.22.target:
-        "0xC4db900F76293042349448D1Ba30F71518325Bb3"
      issuedPermissions.22.to:
+        "0xC4db900F76293042349448D1Ba30F71518325Bb3"
      issuedPermissions.21.target:
-        "0xC412B4e6399F694CfF21D038d225373Fd6596811"
      issuedPermissions.21.to:
+        "0xC412B4e6399F694CfF21D038d225373Fd6596811"
      issuedPermissions.20.target:
-        "0xbfd62b7915da8c19C701FD13237b555Ad38C4b4C"
      issuedPermissions.20.to:
+        "0xbfd62b7915da8c19C701FD13237b555Ad38C4b4C"
      issuedPermissions.19.target:
-        "0xbD9f4fdC48a9A8c7eA1075CFDf4F3bd365d50Bab"
      issuedPermissions.19.to:
+        "0xbD9f4fdC48a9A8c7eA1075CFDf4F3bd365d50Bab"
      issuedPermissions.18.target:
-        "0xB822319ab7848b7cC4537c8409e50f85BFb04377"
      issuedPermissions.18.to:
+        "0xB822319ab7848b7cC4537c8409e50f85BFb04377"
      issuedPermissions.17.target:
-        "0xb4A20D473e8C378aE742a8017DD67756a358eAB6"
      issuedPermissions.17.to:
+        "0xb4A20D473e8C378aE742a8017DD67756a358eAB6"
      issuedPermissions.16.target:
-        "0x9Ac29D4f41A139D9b7be32C2906Df9f86FA51b2b"
      issuedPermissions.16.to:
+        "0x9Ac29D4f41A139D9b7be32C2906Df9f86FA51b2b"
      issuedPermissions.15.target:
-        "0x95C373754C66feF1Eb2dbb6934aF821C551D9738"
      issuedPermissions.15.to:
+        "0x95C373754C66feF1Eb2dbb6934aF821C551D9738"
      issuedPermissions.14.target:
-        "0x95417708f67f4a5dF1A447efe40c6C74e38Ab832"
      issuedPermissions.14.to:
+        "0x95417708f67f4a5dF1A447efe40c6C74e38Ab832"
      issuedPermissions.13.target:
-        "0x92C4d5d9CaDD1aF74080DE7aa078434007F710Bb"
      issuedPermissions.13.to:
+        "0x92C4d5d9CaDD1aF74080DE7aa078434007F710Bb"
      issuedPermissions.12.target:
-        "0x8C0cFFcBAb44c7aB6e96EB607c49188dE99a17Cd"
      issuedPermissions.12.to:
+        "0x8C0cFFcBAb44c7aB6e96EB607c49188dE99a17Cd"
      issuedPermissions.11.target:
-        "0x77B29534738E3F0F297d36635d7884965C7c8cE1"
      issuedPermissions.11.to:
+        "0x77B29534738E3F0F297d36635d7884965C7c8cE1"
      issuedPermissions.10.target:
-        "0x74204e3801E9394848AbDBAd6f378d0b11e9a091"
      issuedPermissions.10.to:
+        "0x74204e3801E9394848AbDBAd6f378d0b11e9a091"
      issuedPermissions.9.target:
-        "0x71C10870dC38E54d987C22e96aB32b46cc08564F"
      issuedPermissions.9.to:
+        "0x71C10870dC38E54d987C22e96aB32b46cc08564F"
      issuedPermissions.8.target:
-        "0x6D7cC6C62CD6CcdaC482E82aA7A3763926e93854"
      issuedPermissions.8.to:
+        "0x6D7cC6C62CD6CcdaC482E82aA7A3763926e93854"
      issuedPermissions.7.target:
-        "0x611e4B24e89bC524Fc06f73b6FD02bE3Ec73d6Db"
      issuedPermissions.7.to:
+        "0x611e4B24e89bC524Fc06f73b6FD02bE3Ec73d6Db"
      issuedPermissions.6.target:
-        "0x5c6E1011cd3b5d7D2937c098b8F61d6B3d1aee7e"
      issuedPermissions.6.to:
+        "0x5c6E1011cd3b5d7D2937c098b8F61d6B3d1aee7e"
      issuedPermissions.5.target:
-        "0x4Ee3690901157bE86A33371bEc1e5021A10Ba47C"
      issuedPermissions.5.to:
+        "0x4Ee3690901157bE86A33371bEc1e5021A10Ba47C"
      issuedPermissions.4.target:
-        "0x323a78C1c910b282dE98a557d735628A02E00983"
      issuedPermissions.4.to:
+        "0x323a78C1c910b282dE98a557d735628A02E00983"
      issuedPermissions.3.target:
-        "0x234aCb24b1DeeA7f6c7530b8c29a6378bA21e1D0"
      issuedPermissions.3.to:
+        "0x234aCb24b1DeeA7f6c7530b8c29a6378bA21e1D0"
      issuedPermissions.2.target:
-        "0x1721D3Ae2d68E3Dd32525400Ed2a29060F1300c6"
      issuedPermissions.2.to:
+        "0x1721D3Ae2d68E3Dd32525400Ed2a29060F1300c6"
      issuedPermissions.1.target:
-        "0x03FD36AEd3b2597aA79bb5f543f3a0eAf9DEB0FA"
      issuedPermissions.1.to:
+        "0x03FD36AEd3b2597aA79bb5f543f3a0eAf9DEB0FA"
      issuedPermissions.0.target:
-        "0x0092bC49078f130D27e70dBeee441E227280B97D"
      issuedPermissions.0.to:
+        "0x0092bC49078f130D27e70dBeee441E227280B97D"
    }
```

```diff
    contract MorphAdminMSig (0xB822319ab7848b7cC4537c8409e50f85BFb04377) {
    +++ description: None
      receivedPermissions.10.target:
-        "0xDc71366EFFA760804DCFC3EDF87fa2A6f1623304"
      receivedPermissions.10.from:
+        "0xDc71366EFFA760804DCFC3EDF87fa2A6f1623304"
      receivedPermissions.9.target:
-        "0xc5Fa3b8968c7FAbEeA2B530a20b88d0C2eD8abb7"
      receivedPermissions.9.from:
+        "0xc5Fa3b8968c7FAbEeA2B530a20b88d0C2eD8abb7"
      receivedPermissions.8.target:
-        "0x759894Ced0e6af42c26668076Ffa84d02E3CeF60"
      receivedPermissions.8.from:
+        "0x759894Ced0e6af42c26668076Ffa84d02E3CeF60"
      receivedPermissions.7.target:
-        "0x7497756ADA7e656aE9f00781aF49Fc0fD08f8A8a"
      receivedPermissions.7.from:
+        "0x7497756ADA7e656aE9f00781aF49Fc0fD08f8A8a"
      receivedPermissions.6.target:
-        "0x44c28f61A5C2Dd24Fc71D7Df8E85e18af4ab2Bd8"
      receivedPermissions.6.from:
+        "0x44c28f61A5C2Dd24Fc71D7Df8E85e18af4ab2Bd8"
      receivedPermissions.5.target:
-        "0x3931Ade842F5BB8763164bDd81E5361DcE6cC1EF"
      receivedPermissions.5.from:
+        "0x3931Ade842F5BB8763164bDd81E5361DcE6cC1EF"
      receivedPermissions.4.target:
-        "0x1C1Ffb5828c3A48B54E8910F1c75256a498aDE68"
      receivedPermissions.4.from:
+        "0x1C1Ffb5828c3A48B54E8910F1c75256a498aDE68"
      receivedPermissions.3.target:
-        "0x0Dc417F8AF88388737c5053FF73f345f080543F7"
      receivedPermissions.3.from:
+        "0x0Dc417F8AF88388737c5053FF73f345f080543F7"
      receivedPermissions.2.target:
-        "0xc5Fa3b8968c7FAbEeA2B530a20b88d0C2eD8abb7"
      receivedPermissions.2.from:
+        "0xc5Fa3b8968c7FAbEeA2B530a20b88d0C2eD8abb7"
      receivedPermissions.1.target:
-        "0x759894Ced0e6af42c26668076Ffa84d02E3CeF60"
      receivedPermissions.1.from:
+        "0x759894Ced0e6af42c26668076Ffa84d02E3CeF60"
      receivedPermissions.0.target:
-        "0x759894Ced0e6af42c26668076Ffa84d02E3CeF60"
      receivedPermissions.0.from:
+        "0x759894Ced0e6af42c26668076Ffa84d02E3CeF60"
      directlyReceivedPermissions.0.target:
-        "0x31110622D6CA24c9FF307d6ae1715F16E47F16A0"
      directlyReceivedPermissions.0.from:
+        "0x31110622D6CA24c9FF307d6ae1715F16E47F16A0"
    }
```

```diff
    contract EnforcedTxGateway (0xc5Fa3b8968c7FAbEeA2B530a20b88d0C2eD8abb7) {
    +++ description: Contracts to force L1 -> L2 messages with the proper sender. Currently paused: true.
      issuedPermissions.1.target:
-        "0xB822319ab7848b7cC4537c8409e50f85BFb04377"
      issuedPermissions.1.via.0.delay:
-        0
      issuedPermissions.1.to:
+        "0xB822319ab7848b7cC4537c8409e50f85BFb04377"
      issuedPermissions.0.target:
-        "0xB822319ab7848b7cC4537c8409e50f85BFb04377"
      issuedPermissions.0.to:
+        "0xB822319ab7848b7cC4537c8409e50f85BFb04377"
      issuedPermissions.0.description:
+        "can pause and unpause"
    }
```

```diff
    contract L1CrossDomainMessenger (0xDc71366EFFA760804DCFC3EDF87fa2A6f1623304) {
    +++ description: Contract used to send L1 -> L2 and relay messages from L2. It allows to replay failed messages and to drop skipped messages. L1 -> L2 messages sent using this contract pay for L2 gas on L1 and will have the aliased address of this contract as the sender.
      issuedPermissions.0.target:
-        "0xB822319ab7848b7cC4537c8409e50f85BFb04377"
      issuedPermissions.0.via.0.delay:
-        0
      issuedPermissions.0.to:
+        "0xB822319ab7848b7cC4537c8409e50f85BFb04377"
    }
```

Generated with discovered.json: 0x872bba178066c728ee915ae4b9a306c43c356364

# Diff at Mon, 23 Dec 2024 13:12:40 GMT:

- chain: ethereum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@18325a975c44684702f30ee366361589e4c2ed8c block: 21285500
- current block number: 21465401

## Description

~30 Challengers added.

## Watched changes

```diff
    contract MorphRollup (0x759894Ced0e6af42c26668076Ffa84d02E3CeF60) {
    +++ description: The main contract of the Morph chain. Allows to post transaction data and state roots, implements challenge mechanism along with proofs. Sequencing and proposing are behind a whitelist.
      issuedPermissions.32:
+        {"permission":"upgrade","target":"0xB822319ab7848b7cC4537c8409e50f85BFb04377","via":[{"address":"0x31110622D6CA24c9FF307d6ae1715F16E47F16A0","delay":0}]}
      issuedPermissions.31:
+        {"permission":"configure","target":"0xB822319ab7848b7cC4537c8409e50f85BFb04377","via":[]}
      issuedPermissions.30:
+        {"permission":"challenge","target":"0xF6Ee30269dB1854987cA6812E1ff66c3A5F660Fd","via":[]}
      issuedPermissions.29:
+        {"permission":"challenge","target":"0xf50A81C771AD3237aeA2FD18E4ee8055CC4Cd2B9","via":[]}
      issuedPermissions.28:
+        {"permission":"challenge","target":"0xF2FF0509520fAf35B511074466A509e00d73C307","via":[]}
      issuedPermissions.27:
+        {"permission":"challenge","target":"0xE48eA86dCdE15E28624E5De9d6D3738fc52B6bFe","via":[]}
      issuedPermissions.26:
+        {"permission":"challenge","target":"0xDF063FAEb46de1b4336bC70Da7175f16aB4A7272","via":[]}
      issuedPermissions.25:
+        {"permission":"challenge","target":"0xd11f9c4F5d9b1feC2d14581d3674066442B68772","via":[]}
      issuedPermissions.24:
+        {"permission":"challenge","target":"0xcA00091a35d0b546A15d000F8bCeDA56255EE4D0","via":[]}
      issuedPermissions.23:
+        {"permission":"challenge","target":"0xc8F7DaeF4b49c1593cC3996aB2afa8B56e00fcF8","via":[]}
      issuedPermissions.22:
+        {"permission":"challenge","target":"0xC4db900F76293042349448D1Ba30F71518325Bb3","via":[]}
      issuedPermissions.21:
+        {"permission":"challenge","target":"0xC412B4e6399F694CfF21D038d225373Fd6596811","via":[]}
      issuedPermissions.20:
+        {"permission":"challenge","target":"0xbfd62b7915da8c19C701FD13237b555Ad38C4b4C","via":[]}
      issuedPermissions.19:
+        {"permission":"challenge","target":"0xbD9f4fdC48a9A8c7eA1075CFDf4F3bd365d50Bab","via":[]}
      issuedPermissions.18:
+        {"permission":"challenge","target":"0xB822319ab7848b7cC4537c8409e50f85BFb04377","via":[]}
      issuedPermissions.17:
+        {"permission":"challenge","target":"0xb4A20D473e8C378aE742a8017DD67756a358eAB6","via":[]}
      issuedPermissions.16:
+        {"permission":"challenge","target":"0x9Ac29D4f41A139D9b7be32C2906Df9f86FA51b2b","via":[]}
      issuedPermissions.15:
+        {"permission":"challenge","target":"0x95C373754C66feF1Eb2dbb6934aF821C551D9738","via":[]}
      issuedPermissions.14:
+        {"permission":"challenge","target":"0x95417708f67f4a5dF1A447efe40c6C74e38Ab832","via":[]}
      issuedPermissions.13:
+        {"permission":"challenge","target":"0x92C4d5d9CaDD1aF74080DE7aa078434007F710Bb","via":[]}
      issuedPermissions.12:
+        {"permission":"challenge","target":"0x8C0cFFcBAb44c7aB6e96EB607c49188dE99a17Cd","via":[]}
      issuedPermissions.11:
+        {"permission":"challenge","target":"0x77B29534738E3F0F297d36635d7884965C7c8cE1","via":[]}
      issuedPermissions.10:
+        {"permission":"challenge","target":"0x74204e3801E9394848AbDBAd6f378d0b11e9a091","via":[]}
      issuedPermissions.9:
+        {"permission":"challenge","target":"0x71C10870dC38E54d987C22e96aB32b46cc08564F","via":[]}
      issuedPermissions.8:
+        {"permission":"challenge","target":"0x6D7cC6C62CD6CcdaC482E82aA7A3763926e93854","via":[]}
      issuedPermissions.7:
+        {"permission":"challenge","target":"0x611e4B24e89bC524Fc06f73b6FD02bE3Ec73d6Db","via":[]}
      issuedPermissions.6:
+        {"permission":"challenge","target":"0x5c6E1011cd3b5d7D2937c098b8F61d6B3d1aee7e","via":[]}
      issuedPermissions.5:
+        {"permission":"challenge","target":"0x4Ee3690901157bE86A33371bEc1e5021A10Ba47C","via":[]}
      issuedPermissions.4:
+        {"permission":"challenge","target":"0x323a78C1c910b282dE98a557d735628A02E00983","via":[]}
      issuedPermissions.3:
+        {"permission":"challenge","target":"0x234aCb24b1DeeA7f6c7530b8c29a6378bA21e1D0","via":[]}
      issuedPermissions.2.permission:
-        "upgrade"
+        "challenge"
      issuedPermissions.2.target:
-        "0xB822319ab7848b7cC4537c8409e50f85BFb04377"
+        "0x1721D3Ae2d68E3Dd32525400Ed2a29060F1300c6"
      issuedPermissions.2.via.0:
-        {"address":"0x31110622D6CA24c9FF307d6ae1715F16E47F16A0","delay":0}
      issuedPermissions.1.permission:
-        "configure"
+        "challenge"
      issuedPermissions.1.target:
-        "0xB822319ab7848b7cC4537c8409e50f85BFb04377"
+        "0x03FD36AEd3b2597aA79bb5f543f3a0eAf9DEB0FA"
      issuedPermissions.0.target:
-        "0xB822319ab7848b7cC4537c8409e50f85BFb04377"
+        "0x0092bC49078f130D27e70dBeee441E227280B97D"
      values.challengers.30:
+        "0x95C373754C66feF1Eb2dbb6934aF821C551D9738"
      values.challengers.29:
+        "0x5c6E1011cd3b5d7D2937c098b8F61d6B3d1aee7e"
      values.challengers.28:
+        "0x234aCb24b1DeeA7f6c7530b8c29a6378bA21e1D0"
      values.challengers.27:
+        "0x92C4d5d9CaDD1aF74080DE7aa078434007F710Bb"
      values.challengers.26:
+        "0x611e4B24e89bC524Fc06f73b6FD02bE3Ec73d6Db"
      values.challengers.25:
+        "0xDF063FAEb46de1b4336bC70Da7175f16aB4A7272"
      values.challengers.24:
+        "0x1721D3Ae2d68E3Dd32525400Ed2a29060F1300c6"
      values.challengers.23:
+        "0xC412B4e6399F694CfF21D038d225373Fd6596811"
      values.challengers.22:
+        "0x0092bC49078f130D27e70dBeee441E227280B97D"
      values.challengers.21:
+        "0xc8F7DaeF4b49c1593cC3996aB2afa8B56e00fcF8"
      values.challengers.20:
+        "0x4Ee3690901157bE86A33371bEc1e5021A10Ba47C"
      values.challengers.19:
+        "0x03FD36AEd3b2597aA79bb5f543f3a0eAf9DEB0FA"
      values.challengers.18:
+        "0xE48eA86dCdE15E28624E5De9d6D3738fc52B6bFe"
      values.challengers.17:
+        "0xb4A20D473e8C378aE742a8017DD67756a358eAB6"
      values.challengers.16:
+        "0x71C10870dC38E54d987C22e96aB32b46cc08564F"
      values.challengers.15:
+        "0xf50A81C771AD3237aeA2FD18E4ee8055CC4Cd2B9"
      values.challengers.14:
+        "0xF6Ee30269dB1854987cA6812E1ff66c3A5F660Fd"
      values.challengers.13:
+        "0xF2FF0509520fAf35B511074466A509e00d73C307"
      values.challengers.12:
+        "0xC4db900F76293042349448D1Ba30F71518325Bb3"
      values.challengers.11:
+        "0x8C0cFFcBAb44c7aB6e96EB607c49188dE99a17Cd"
      values.challengers.10:
+        "0x6D7cC6C62CD6CcdaC482E82aA7A3763926e93854"
      values.challengers.9:
+        "0xcA00091a35d0b546A15d000F8bCeDA56255EE4D0"
      values.challengers.8:
+        "0xbfd62b7915da8c19C701FD13237b555Ad38C4b4C"
      values.challengers.7:
+        "0x9Ac29D4f41A139D9b7be32C2906Df9f86FA51b2b"
      values.challengers.6:
+        "0xbD9f4fdC48a9A8c7eA1075CFDf4F3bd365d50Bab"
      values.challengers.5:
+        "0x74204e3801E9394848AbDBAd6f378d0b11e9a091"
      values.challengers.4:
+        "0x323a78C1c910b282dE98a557d735628A02E00983"
      values.challengers.3:
+        "0xd11f9c4F5d9b1feC2d14581d3674066442B68772"
      values.challengers.2:
+        "0x95417708f67f4a5dF1A447efe40c6C74e38Ab832"
      values.challengers.1:
+        "0x77B29534738E3F0F297d36635d7884965C7c8cE1"
    }
```

Generated with discovered.json: 0x251bd3fc5a694cc0afc4aaf27f0eec9430eefb52

# Diff at Thu, 28 Nov 2024 10:07:52 GMT:

- chain: ethereum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@cba708dac9336030203b425721a33c9db2b14313 block: 21272621
- current block number: 21285500

## Description

Minor upgrade of MorphRollup introducing `committedStateRoots`, a mapping that delivers what it promises. Before there was only a finalizedStateRoots mapping.

This upgrade also adds back the require in `importGenesisBatch()` which prevents calling the function in case the genesis batch is already imported.

## Watched changes

```diff
    contract MorphRollup (0x759894Ced0e6af42c26668076Ffa84d02E3CeF60) {
    +++ description: The main contract of the Morph chain. Allows to post transaction data and state roots, implements challenge mechanism along with proofs. Sequencing and proposing are behind a whitelist.
      sourceHashes.1:
-        "0xb1afd290858bf0702793a7fd0a214fc9c1c0aa70ff5755193bdd20073e5d0ca1"
+        "0x2b50f40d48451dfa5ae761371d1c0b18c8c827b34d17c401f629bc743888721e"
      values.$implementation:
-        "0x073403E147a8e607b80985fe458c0B527287278F"
+        "0xaD900dB30Bcdf84c38Df0067eA327bbEccCF071A"
      values.$pastUpgrades.3:
+        ["2024-11-28T03:51:59.000Z","0xa452e20183f6860f105cb398bccc9d75dd3758444b956061b3031d1f0a33c424",["0xaD900dB30Bcdf84c38Df0067eA327bbEccCF071A"]]
      values.$upgradeCount:
-        3
+        4
    }
```

## Source code changes

```diff
.../MorphRollup/Rollup.sol                         | 29 +++++++++++++++++-----
 1 file changed, 23 insertions(+), 6 deletions(-)
```

Generated with discovered.json: 0x3040bc3142e7ed49d847e3c57d67f3fa373616d0

# Diff at Tue, 26 Nov 2024 14:48:58 GMT:

- chain: ethereum
- author: Bartek Kiepuszewski (<bkiepuszewski@gmail.com>)
- comparing to: main@870cd1dcc81bc3cf8bef8fe79c76929e42c7c886 block: 21264263
- current block number: 21272621

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21264263 (main branch discovery), not current.

```diff
    contract L1Staking (0x0Dc417F8AF88388737c5053FF73f345f080543F7) {
    +++ description: Contract keeping track of stakers which act as sequencers/proposes. It is responsible for stakers registering and withdrawals and for verifying BLS signatures of stakers (currently not implemented).
      issuedPermissions.7:
+        {"permission":"upgrade","target":"0xB822319ab7848b7cC4537c8409e50f85BFb04377","via":[{"address":"0x31110622D6CA24c9FF307d6ae1715F16E47F16A0","delay":0}]}
      issuedPermissions.6:
+        {"permission":"sequence","target":"0xf834ffbeb6bB3F4841afc6b5FB40B94cd580fa23","via":[]}
      issuedPermissions.5:
+        {"permission":"sequence","target":"0xBBA36CdF020788f0D08D5688c0Bee3fb30ce1C80","via":[]}
      issuedPermissions.4:
+        {"permission":"sequence","target":"0xb6cF39ee72e0127E6Ea6059e38B8C197227a6ac7","via":[]}
      issuedPermissions.3:
+        {"permission":"sequence","target":"0xa59B26DB10C5Ca26a97AA2Fd2E74CB8DA9D1EB65","via":[]}
      issuedPermissions.2:
+        {"permission":"sequence","target":"0x6aB0E960911b50f6d14f249782ac12EC3E7584A0","via":[]}
      issuedPermissions.1:
+        {"permission":"sequence","target":"0x61F2945d4bc9E40B66a6376d1094a50438f613e2","via":[]}
      issuedPermissions.0.permission:
-        "upgrade"
+        "sequence"
      issuedPermissions.0.target:
-        "0x31110622D6CA24c9FF307d6ae1715F16E47F16A0"
+        "0x34E387B37d3ADEAa6D5B92cE30dE3af3DCa39796"
      description:
+        "Contract keeping track of stakers which act as sequencers/proposes. It is responsible for stakers registering and withdrawals and for verifying BLS signatures of stakers (currently not implemented)."
    }
```

```diff
    contract L1ETHGateway (0x1C1Ffb5828c3A48B54E8910F1c75256a498aDE68) {
    +++ description: Contract used to bridge ETH from L1 to L2.
      issuedPermissions.0.target:
-        "0x31110622D6CA24c9FF307d6ae1715F16E47F16A0"
+        "0xB822319ab7848b7cC4537c8409e50f85BFb04377"
      issuedPermissions.0.via.0:
+        {"address":"0x31110622D6CA24c9FF307d6ae1715F16E47F16A0","delay":0}
      description:
+        "Contract used to bridge ETH from L1 to L2."
    }
```

```diff
    contract ProxyAdmin (0x31110622D6CA24c9FF307d6ae1715F16E47F16A0) {
    +++ description: None
      receivedPermissions:
-        [{"permission":"upgrade","target":"0x0Dc417F8AF88388737c5053FF73f345f080543F7"},{"permission":"upgrade","target":"0x1C1Ffb5828c3A48B54E8910F1c75256a498aDE68"},{"permission":"upgrade","target":"0x3931Ade842F5BB8763164bDd81E5361DcE6cC1EF"},{"permission":"upgrade","target":"0x44c28f61A5C2Dd24Fc71D7Df8E85e18af4ab2Bd8"},{"permission":"upgrade","target":"0x7497756ADA7e656aE9f00781aF49Fc0fD08f8A8a"},{"permission":"upgrade","target":"0x759894Ced0e6af42c26668076Ffa84d02E3CeF60"},{"permission":"upgrade","target":"0xc5Fa3b8968c7FAbEeA2B530a20b88d0C2eD8abb7"},{"permission":"upgrade","target":"0xDc71366EFFA760804DCFC3EDF87fa2A6f1623304"}]
      directlyReceivedPermissions:
+        [{"permission":"upgrade","target":"0x0Dc417F8AF88388737c5053FF73f345f080543F7"},{"permission":"upgrade","target":"0x1C1Ffb5828c3A48B54E8910F1c75256a498aDE68"},{"permission":"upgrade","target":"0x3931Ade842F5BB8763164bDd81E5361DcE6cC1EF"},{"permission":"upgrade","target":"0x44c28f61A5C2Dd24Fc71D7Df8E85e18af4ab2Bd8"},{"permission":"upgrade","target":"0x7497756ADA7e656aE9f00781aF49Fc0fD08f8A8a"},{"permission":"upgrade","target":"0x759894Ced0e6af42c26668076Ffa84d02E3CeF60"},{"permission":"upgrade","target":"0xc5Fa3b8968c7FAbEeA2B530a20b88d0C2eD8abb7"},{"permission":"upgrade","target":"0xDc71366EFFA760804DCFC3EDF87fa2A6f1623304"}]
    }
```

```diff
    contract L1MessageQueueWithGasPriceOracle (0x3931Ade842F5BB8763164bDd81E5361DcE6cC1EF) {
    +++ description: Contains the array of queued L1 -> L2 messages, either appended using the L1Messenger or the EnforcedTxGateway.
      issuedPermissions.0.target:
-        "0x31110622D6CA24c9FF307d6ae1715F16E47F16A0"
+        "0xB822319ab7848b7cC4537c8409e50f85BFb04377"
      issuedPermissions.0.via.0:
+        {"address":"0x31110622D6CA24c9FF307d6ae1715F16E47F16A0","delay":0}
      description:
+        "Contains the array of queued L1 -> L2 messages, either appended using the L1Messenger or the EnforcedTxGateway."
    }
```

```diff
    contract L1StandardERC20Gateway (0x44c28f61A5C2Dd24Fc71D7Df8E85e18af4ab2Bd8) {
    +++ description: Contract used to bridge ERC20 tokens from L1 to L2. It uses a fixed token list.
      issuedPermissions.0.target:
-        "0x31110622D6CA24c9FF307d6ae1715F16E47F16A0"
+        "0xB822319ab7848b7cC4537c8409e50f85BFb04377"
      issuedPermissions.0.via.0:
+        {"address":"0x31110622D6CA24c9FF307d6ae1715F16E47F16A0","delay":0}
      description:
+        "Contract used to bridge ERC20 tokens from L1 to L2. It uses a fixed token list."
    }
```

```diff
    contract ZkEvmVerifierV1 (0x6dAece7dFaE212b6A9F55c56FD3cf1462F44069e) {
    +++ description: Current SP1 verifier using Blobs for DA, used to prepare data for the PlonkVerifierV0.
      description:
+        "Current SP1 verifier using Blobs for DA, used to prepare data for the PlonkVerifierV0."
    }
```

```diff
    contract L1GatewayRouter (0x7497756ADA7e656aE9f00781aF49Fc0fD08f8A8a) {
    +++ description: Main entry point for depositing ETH and ERC20 tokens, which are then forwarded to the correct gateway.
      issuedPermissions.0.target:
-        "0x31110622D6CA24c9FF307d6ae1715F16E47F16A0"
+        "0xB822319ab7848b7cC4537c8409e50f85BFb04377"
      issuedPermissions.0.via.0:
+        {"address":"0x31110622D6CA24c9FF307d6ae1715F16E47F16A0","delay":0}
      description:
+        "Main entry point for depositing ETH and ERC20 tokens, which are then forwarded to the correct gateway."
    }
```

```diff
    contract MorphRollup (0x759894Ced0e6af42c26668076Ffa84d02E3CeF60) {
    +++ description: The main contract of the Morph chain. Allows to post transaction data and state roots, implements challenge mechanism along with proofs. Sequencing and proposing are behind a whitelist.
      issuedPermissions.2:
+        {"permission":"upgrade","target":"0xB822319ab7848b7cC4537c8409e50f85BFb04377","via":[{"address":"0x31110622D6CA24c9FF307d6ae1715F16E47F16A0","delay":0}]}
      issuedPermissions.1:
+        {"permission":"configure","target":"0xB822319ab7848b7cC4537c8409e50f85BFb04377","via":[]}
      issuedPermissions.0.permission:
-        "upgrade"
+        "challenge"
      issuedPermissions.0.target:
-        "0x31110622D6CA24c9FF307d6ae1715F16E47F16A0"
+        "0xB822319ab7848b7cC4537c8409e50f85BFb04377"
      description:
+        "The main contract of the Morph chain. Allows to post transaction data and state roots, implements challenge mechanism along with proofs. Sequencing and proposing are behind a whitelist."
    }
```

```diff
    contract MorphAdminMSig (0xB822319ab7848b7cC4537c8409e50f85BFb04377) {
    +++ description: None
      receivedPermissions:
+        [{"permission":"challenge","target":"0x759894Ced0e6af42c26668076Ffa84d02E3CeF60"},{"permission":"configure","target":"0x759894Ced0e6af42c26668076Ffa84d02E3CeF60","description":"can pause and unpause, override any batch, revert batch, update proof window, update challengers, modify verifiers"},{"permission":"configure","target":"0xc5Fa3b8968c7FAbEeA2B530a20b88d0C2eD8abb7","description":"can pause and unpause"},{"permission":"upgrade","target":"0x0Dc417F8AF88388737c5053FF73f345f080543F7","via":[{"address":"0x31110622D6CA24c9FF307d6ae1715F16E47F16A0"}]},{"permission":"upgrade","target":"0x1C1Ffb5828c3A48B54E8910F1c75256a498aDE68","via":[{"address":"0x31110622D6CA24c9FF307d6ae1715F16E47F16A0"}]},{"permission":"upgrade","target":"0x3931Ade842F5BB8763164bDd81E5361DcE6cC1EF","via":[{"address":"0x31110622D6CA24c9FF307d6ae1715F16E47F16A0"}]},{"permission":"upgrade","target":"0x44c28f61A5C2Dd24Fc71D7Df8E85e18af4ab2Bd8","via":[{"address":"0x31110622D6CA24c9FF307d6ae1715F16E47F16A0"}]},{"permission":"upgrade","target":"0x7497756ADA7e656aE9f00781aF49Fc0fD08f8A8a","via":[{"address":"0x31110622D6CA24c9FF307d6ae1715F16E47F16A0"}]},{"permission":"upgrade","target":"0x759894Ced0e6af42c26668076Ffa84d02E3CeF60","via":[{"address":"0x31110622D6CA24c9FF307d6ae1715F16E47F16A0"}]},{"permission":"upgrade","target":"0xc5Fa3b8968c7FAbEeA2B530a20b88d0C2eD8abb7","via":[{"address":"0x31110622D6CA24c9FF307d6ae1715F16E47F16A0"}]},{"permission":"upgrade","target":"0xDc71366EFFA760804DCFC3EDF87fa2A6f1623304","via":[{"address":"0x31110622D6CA24c9FF307d6ae1715F16E47F16A0"}]}]
      directlyReceivedPermissions:
+        [{"permission":"act","target":"0x31110622D6CA24c9FF307d6ae1715F16E47F16A0"}]
    }
```

```diff
    contract EnforcedTxGateway (0xc5Fa3b8968c7FAbEeA2B530a20b88d0C2eD8abb7) {
    +++ description: Contracts to force L1 -> L2 messages with the proper sender. Currently paused: true.
      issuedPermissions.1:
+        {"permission":"upgrade","target":"0xB822319ab7848b7cC4537c8409e50f85BFb04377","via":[{"address":"0x31110622D6CA24c9FF307d6ae1715F16E47F16A0","delay":0}]}
      issuedPermissions.0.permission:
-        "upgrade"
+        "configure"
      issuedPermissions.0.target:
-        "0x31110622D6CA24c9FF307d6ae1715F16E47F16A0"
+        "0xB822319ab7848b7cC4537c8409e50f85BFb04377"
      description:
+        "Contracts to force L1 -> L2 messages with the proper sender. Currently paused: true."
    }
```

```diff
    contract L1CrossDomainMessenger (0xDc71366EFFA760804DCFC3EDF87fa2A6f1623304) {
    +++ description: Contract used to send L1 -> L2 and relay messages from L2. It allows to replay failed messages and to drop skipped messages. L1 -> L2 messages sent using this contract pay for L2 gas on L1 and will have the aliased address of this contract as the sender.
      issuedPermissions.0.target:
-        "0x31110622D6CA24c9FF307d6ae1715F16E47F16A0"
+        "0xB822319ab7848b7cC4537c8409e50f85BFb04377"
      issuedPermissions.0.via.0:
+        {"address":"0x31110622D6CA24c9FF307d6ae1715F16E47F16A0","delay":0}
      description:
+        "Contract used to send L1 -> L2 and relay messages from L2. It allows to replay failed messages and to drop skipped messages. L1 -> L2 messages sent using this contract pay for L2 gas on L1 and will have the aliased address of this contract as the sender."
    }
```

```diff
    contract Whitelist (0xFFafDd9167777C0e5421e0B6789D6d7A5E386984) {
    +++ description: Contract implementing a generic whitelist. Currently used to define the actor that can relay the L2 basefee on L1.
      description:
+        "Contract implementing a generic whitelist. Currently used to define the actor that can relay the L2 basefee on L1."
    }
```

Generated with discovered.json: 0x56f6b20b52991cc5411b3c1be7d76e32754c863d

# Diff at Mon, 25 Nov 2024 10:45:45 GMT:

- chain: ethereum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@62a44faa52866a55f9881cb2852ac75b1fcc60b0 block: 21236006
- current block number: 21264263

## Description

EnforcedTxGateway paused after our nudge on twitter.

## Watched changes

```diff
    contract EnforcedTxGateway (0xc5Fa3b8968c7FAbEeA2B530a20b88d0C2eD8abb7) {
    +++ description: None
      values.paused:
-        false
+        true
    }
```

Generated with discovered.json: 0x770c6ce5d96d0b1315ca7492b36eb7b735e8611e

# Diff at Thu, 21 Nov 2024 12:08:57 GMT:

- chain: ethereum
- author: Bartek Kiepuszewski (<bkiepuszewski@gmail.com>)
- current block number: 21236006

## Description

Provide description of changes. This section will be preserved.

## Initial discovery

```diff
+   Status: CREATED
    contract L1Staking (0x0Dc417F8AF88388737c5053FF73f345f080543F7)
    +++ description: None
```

```diff
+   Status: CREATED
    contract L1ETHGateway (0x1C1Ffb5828c3A48B54E8910F1c75256a498aDE68)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ProxyAdmin (0x31110622D6CA24c9FF307d6ae1715F16E47F16A0)
    +++ description: None
```

```diff
+   Status: CREATED
    contract L1MessageQueueWithGasPriceOracle (0x3931Ade842F5BB8763164bDd81E5361DcE6cC1EF)
    +++ description: None
```

```diff
+   Status: CREATED
    contract L1StandardERC20Gateway (0x44c28f61A5C2Dd24Fc71D7Df8E85e18af4ab2Bd8)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ZkEvmVerifierV1 (0x6dAece7dFaE212b6A9F55c56FD3cf1462F44069e)
    +++ description: None
```

```diff
+   Status: CREATED
    contract L1GatewayRouter (0x7497756ADA7e656aE9f00781aF49Fc0fD08f8A8a)
    +++ description: None
```

```diff
+   Status: CREATED
    contract MorphRollup (0x759894Ced0e6af42c26668076Ffa84d02E3CeF60)
    +++ description: None
```

```diff
+   Status: CREATED
    contract MultipleVersionRollupVerifier (0x87C1D0dAb8d96b69CB91f97F4135E3ed5A49DCF6)
    +++ description: Used to update the verifier and keep track of current and old versions.
```

```diff
+   Status: CREATED
    contract MorphAdminMSig (0xB822319ab7848b7cC4537c8409e50f85BFb04377)
    +++ description: None
```

```diff
+   Status: CREATED
    contract EnforcedTxGateway (0xc5Fa3b8968c7FAbEeA2B530a20b88d0C2eD8abb7)
    +++ description: None
```

```diff
+   Status: CREATED
    contract L1CrossDomainMessenger (0xDc71366EFFA760804DCFC3EDF87fa2A6f1623304)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Whitelist (0xFFafDd9167777C0e5421e0B6789D6d7A5E386984)
    +++ description: None
```

