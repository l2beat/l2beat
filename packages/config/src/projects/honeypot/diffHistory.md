Generated with discovered.json: 0x171b76b4c9bb15569a055ad257197dd5f6afbbc1

# Diff at Mon, 01 Sep 2025 10:01:10 GMT:

Merge mark

Generated with discovered.json: 0xf7e74a130f883673b846974902a2244cd1f42409

# Diff at Mon, 14 Jul 2025 12:45:10 GMT:

- chain: ethereum
- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@9f4300dad2f3d080cd56fa311d4a848556c74e72 block: 20641250
- current block number: 20641250

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20641250 (main branch discovery), not current.

```diff
    contract Honeypot (0x0974CC873dF893B302f6be7ecf4F9D4b1A15C366) {
    +++ description: None
      address:
-        "0x0974CC873dF893B302f6be7ecf4F9D4b1A15C366"
+        "eth:0x0974CC873dF893B302f6be7ecf4F9D4b1A15C366"
      values.getConsensus:
-        "0x9DB17B9426E6d3d517a969994E7ADDadbCa9C45f"
+        "eth:0x9DB17B9426E6d3d517a969994E7ADDadbCa9C45f"
      values.owner:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      implementationNames.0x0974CC873dF893B302f6be7ecf4F9D4b1A15C366:
-        "CartesiDApp"
      implementationNames.eth:0x0974CC873dF893B302f6be7ecf4F9D4b1A15C366:
+        "CartesiDApp"
    }
```

```diff
    contract History (0x385485FcaCD8AdB70C8A5a6B07155C907e78FAd9) {
    +++ description: None
      address:
-        "0x385485FcaCD8AdB70C8A5a6B07155C907e78FAd9"
+        "eth:0x385485FcaCD8AdB70C8A5a6B07155C907e78FAd9"
      values.owner:
-        "0x9DB17B9426E6d3d517a969994E7ADDadbCa9C45f"
+        "eth:0x9DB17B9426E6d3d517a969994E7ADDadbCa9C45f"
      implementationNames.0x385485FcaCD8AdB70C8A5a6B07155C907e78FAd9:
-        "History"
      implementationNames.eth:0x385485FcaCD8AdB70C8A5a6B07155C907e78FAd9:
+        "History"
    }
```

```diff
    contract InputBox (0x59b22D57D4f067708AB0c00552767405926dc768) {
    +++ description: None
      address:
-        "0x59b22D57D4f067708AB0c00552767405926dc768"
+        "eth:0x59b22D57D4f067708AB0c00552767405926dc768"
      implementationNames.0x59b22D57D4f067708AB0c00552767405926dc768:
-        "InputBox"
      implementationNames.eth:0x59b22D57D4f067708AB0c00552767405926dc768:
+        "InputBox"
    }
```

```diff
    EOA  (0x79Ec6ba3352216E496FCfEd1d2e86Ee15eed3861) {
    +++ description: None
      address:
-        "0x79Ec6ba3352216E496FCfEd1d2e86Ee15eed3861"
+        "eth:0x79Ec6ba3352216E496FCfEd1d2e86Ee15eed3861"
    }
```

```diff
    contract ERC20Portal (0x9C21AEb2093C32DDbC53eEF24B873BDCd1aDa1DB) {
    +++ description: None
      address:
-        "0x9C21AEb2093C32DDbC53eEF24B873BDCd1aDa1DB"
+        "eth:0x9C21AEb2093C32DDbC53eEF24B873BDCd1aDa1DB"
      values.getInputBox:
-        "0x59b22D57D4f067708AB0c00552767405926dc768"
+        "eth:0x59b22D57D4f067708AB0c00552767405926dc768"
      implementationNames.0x9C21AEb2093C32DDbC53eEF24B873BDCd1aDa1DB:
-        "ERC20Portal"
      implementationNames.eth:0x9C21AEb2093C32DDbC53eEF24B873BDCd1aDa1DB:
+        "ERC20Portal"
    }
```

```diff
    contract Authority (0x9DB17B9426E6d3d517a969994E7ADDadbCa9C45f) {
    +++ description: None
      address:
-        "0x9DB17B9426E6d3d517a969994E7ADDadbCa9C45f"
+        "eth:0x9DB17B9426E6d3d517a969994E7ADDadbCa9C45f"
      values.getHistory:
-        "0x385485FcaCD8AdB70C8A5a6B07155C907e78FAd9"
+        "eth:0x385485FcaCD8AdB70C8A5a6B07155C907e78FAd9"
      values.owner:
-        "0x79Ec6ba3352216E496FCfEd1d2e86Ee15eed3861"
+        "eth:0x79Ec6ba3352216E496FCfEd1d2e86Ee15eed3861"
      implementationNames.0x9DB17B9426E6d3d517a969994E7ADDadbCa9C45f:
-        "Authority"
      implementationNames.eth:0x9DB17B9426E6d3d517a969994E7ADDadbCa9C45f:
+        "Authority"
    }
```

```diff
+   Status: CREATED
    contract Honeypot (0x0974CC873dF893B302f6be7ecf4F9D4b1A15C366)
    +++ description: None
```

```diff
+   Status: CREATED
    contract History (0x385485FcaCD8AdB70C8A5a6B07155C907e78FAd9)
    +++ description: None
```

```diff
+   Status: CREATED
    contract InputBox (0x59b22D57D4f067708AB0c00552767405926dc768)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ERC20Portal (0x9C21AEb2093C32DDbC53eEF24B873BDCd1aDa1DB)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Authority (0x9DB17B9426E6d3d517a969994E7ADDadbCa9C45f)
    +++ description: None
```

Generated with discovered.json: 0x7a599aaaee4e13f2ceeb2fc01a35f2f4a6c57103

# Diff at Tue, 04 Mar 2025 10:39:14 GMT:

- chain: ethereum
- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@98d260b45fe0d2195ce5e629bd7b200c8706e8ba block: 20641250
- current block number: 20641250

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20641250 (main branch discovery), not current.

```diff
    contract Honeypot (0x0974CC873dF893B302f6be7ecf4F9D4b1A15C366) {
    +++ description: None
      sinceBlock:
+        18122866
    }
```

```diff
    contract History (0x385485FcaCD8AdB70C8A5a6B07155C907e78FAd9) {
    +++ description: None
      sinceBlock:
+        18114934
    }
```

```diff
    contract InputBox (0x59b22D57D4f067708AB0c00552767405926dc768) {
    +++ description: None
      sinceBlock:
+        17784733
    }
```

```diff
    contract ERC20Portal (0x9C21AEb2093C32DDbC53eEF24B873BDCd1aDa1DB) {
    +++ description: None
      sinceBlock:
+        17784735
    }
```

```diff
    contract Authority (0x9DB17B9426E6d3d517a969994E7ADDadbCa9C45f) {
    +++ description: None
      sinceBlock:
+        18114898
    }
```

Generated with discovered.json: 0x5abdeba1ee48213a6d3f5f71d7921f2390eae052

# Diff at Mon, 14 Oct 2024 10:51:26 GMT:

- chain: ethereum
- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@1afc77ff111ceb0970e7d09efcc7b2f376b0c281 block: 20641250
- current block number: 20641250

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20641250 (main branch discovery), not current.

```diff
    contract Honeypot (0x0974CC873dF893B302f6be7ecf4F9D4b1A15C366) {
    +++ description: None
      sourceHashes:
+        ["0x4ea587588e6035764e827917418aee9c41a353454a7a13fe807ca56724350d47"]
    }
```

```diff
    contract History (0x385485FcaCD8AdB70C8A5a6B07155C907e78FAd9) {
    +++ description: None
      sourceHashes:
+        ["0x10336484f22cf6f3d30e974fe43a4aa644807bee582c7ee3c03b116024554eaa"]
    }
```

```diff
    contract InputBox (0x59b22D57D4f067708AB0c00552767405926dc768) {
    +++ description: None
      sourceHashes:
+        ["0x3bfaa3fe125375dfb9181df0c144cda2b17aa368e57292e88d6258c4aafe51ed"]
    }
```

```diff
    contract ERC20Portal (0x9C21AEb2093C32DDbC53eEF24B873BDCd1aDa1DB) {
    +++ description: None
      sourceHashes:
+        ["0x0cb29769a693a89712c9c05a29f52a6e610ed38585db5d66f1fc56118e39493d"]
    }
```

```diff
    contract Authority (0x9DB17B9426E6d3d517a969994E7ADDadbCa9C45f) {
    +++ description: None
      sourceHashes:
+        ["0xe4cf627ec9b7ed3b6b18711555d50a7002525d34e84a6242a2b1bd41aedb2f11"]
    }
```

Generated with discovered.json: 0xd19b552af376e49c0192968c5239b300c6593010

# Diff at Wed, 27 Sep 2023 11:44:11 GMT:

- chain: ethereum
- author: Luca Donno (<donnoh99@gmail.com>)
- comparing to: main@dfa2bd4412e533f776bc670a6d67f61293446c02

```diff
    contract CartesiDApp (0x0974CC873dF893B302f6be7ecf4F9D4b1A15C366) {
      name:
-        "CartesiDApp"
+        "Honeypot"
      derivedName:
+        "CartesiDApp"
    }
```

```diff
    contract History (0x385485FcaCD8AdB70C8A5a6B07155C907e78FAd9) {
      derivedName:
+        "History"
    }
```

```diff
    contract InputBox (0x59b22D57D4f067708AB0c00552767405926dc768) {
      derivedName:
+        "InputBox"
    }
```

```diff
    contract ERC20Portal (0x9C21AEb2093C32DDbC53eEF24B873BDCd1aDa1DB) {
      derivedName:
+        "ERC20Portal"
    }
```

```diff
    contract Authority (0x9DB17B9426E6d3d517a969994E7ADDadbCa9C45f) {
      derivedName:
+        "Authority"
    }
```

# Diff at Wed, 27 Sep 2023 09:05:32 GMT:

- chain: ethereum
- author: Luca Donno (<donnoh99@gmail.com>)
- comparing to: main@

## Watched changes

```diff
+   Status: CREATED
    contract CartesiDApp (0x0974CC873dF893B302f6be7ecf4F9D4b1A15C366) {
    }
```

```diff
+   Status: CREATED
    contract History (0x385485FcaCD8AdB70C8A5a6B07155C907e78FAd9) {
    }
```

```diff
+   Status: CREATED
    contract InputBox (0x59b22D57D4f067708AB0c00552767405926dc768) {
    }
```

```diff
+   Status: CREATED
    contract ERC20Portal (0x9C21AEb2093C32DDbC53eEF24B873BDCd1aDa1DB) {
    }
```

```diff
+   Status: CREATED
    contract Authority (0x9DB17B9426E6d3d517a969994E7ADDadbCa9C45f) {
    }
```

