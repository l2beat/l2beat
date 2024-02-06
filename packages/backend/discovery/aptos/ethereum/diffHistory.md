Generated with discovered.json: 0x695e9666aa1d660f1069614b9e84af2847034ff8

# Diff at Tue, 06 Feb 2024 09:35:41 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@4d639d97ae679e1e3695f59f0c84cca622283ff7 block: 18591456
- current block number: 19168345

## Description

Updated the LayerZero version.
Version 4: `0xd231084bfb234c107d3ee2b22f97f3346fdaf705` (`SendUln301`)
Version 5: `0x245b6e8ffe9ea5fc301e32d16f66bd4c2123eefc` (`ReceiveUln301`)

## Watched changes

```diff
    contract Endpoint (0x66A71Dcef29A0fFBDBE3c6a460a3B5BC225Cd675) {
      values.latestVersion:
-        3
+        5
    }
```

Generated with discovered.json: 0xfefefa739dc46550c8b3cf802febfcaf26f3698d

# Diff at Fri, 17 Nov 2023 12:00:13 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@8df7aef75226275b8e56ba8d4d76ce64057b0360

## Description

One EOA owner was replaced in Aptos Multisig:

- removed: 0x285b7EEa81a5B66B62e7276a24c1e0F83F7409c1
- added: 0x2E1078e128e8AA6A70eC8d1B17A79Fc4B457d437

The same change was performed on a multisig in the Stargate project.

## Watched changes

```diff
    contract Aptos Multisig (0x65bb797c2B9830d891D87288F029ed8dACc19705) {
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

# Diff at Mon, 02 Oct 2023 13:23:25 GMT:

- author: Luca Donno (<donnoh99@gmail.com>)
- comparing to: main@10dbc30af490bd7af5cfca51b827ce3f10182f4d

## Watched changes

```diff
    contract TokenBridge (0x50002CdFe7CCb0C41F519c6Eb0653158d11cd907) {
      values.owner:
-        "0x971016EF5Bd9C71fA4ff34D731974d03cEFf5F05"
+        "0x65bb797c2B9830d891D87288F029ed8dACc19705"
    }
```

```diff
-   Status: DELETED
    contract Aptos Multisig (0x971016EF5Bd9C71fA4ff34D731974d03cEFf5F05) {
    }
```

```diff
+   Status: CREATED
    contract Aptos Multisig (0x65bb797c2B9830d891D87288F029ed8dACc19705) {
    }
```
