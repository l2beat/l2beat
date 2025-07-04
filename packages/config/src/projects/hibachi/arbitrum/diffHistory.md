Generated with discovered.json: 0x2119cf2129cb91c0d94dfddd5e9a2e432556575f

# Diff at Fri, 04 Jul 2025 12:19:03 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@1f56dc47fe915564d4555300304da4d3bcbc087f block: 351073243
- current block number: 351073243

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 351073243 (main branch discovery), not current.

```diff
    EOA  (0x0000000000000000000000000000000000000000) {
    +++ description: None
      receivedPermissions.0.from:
-        "arbitrum:0xa5f208e072434bC67592E4C49C1B991BA79BCA46"
+        "arb1:0xa5f208e072434bC67592E4C49C1B991BA79BCA46"
    }
```

```diff
    EOA  (0x420eee5B429664F08f001786541acbE0F59feF5c) {
    +++ description: None
      receivedPermissions.0.via.0.address:
-        "arbitrum:0xa3F61770BBd12e705734Ad940f382227d0fD82fE"
+        "arb1:0xa3F61770BBd12e705734Ad940f382227d0fD82fE"
      receivedPermissions.0.from:
-        "arbitrum:0x0E9C1a3AA696299E38b00a8144Bf6dc16C1F5400"
+        "arb1:0x0E9C1a3AA696299E38b00a8144Bf6dc16C1F5400"
      receivedPermissions.1.via.0.address:
-        "arbitrum:0x951e848eAD9c2B4aFaEa5e0649b36A00f97f01b1"
+        "arb1:0x951e848eAD9c2B4aFaEa5e0649b36A00f97f01b1"
      receivedPermissions.1.from:
-        "arbitrum:0x818351386C3a63A8244C78aDAD42B9b4f9a516d4"
+        "arb1:0x818351386C3a63A8244C78aDAD42B9b4f9a516d4"
      directlyReceivedPermissions.0.from:
-        "arbitrum:0x951e848eAD9c2B4aFaEa5e0649b36A00f97f01b1"
+        "arb1:0x951e848eAD9c2B4aFaEa5e0649b36A00f97f01b1"
      directlyReceivedPermissions.1.from:
-        "arbitrum:0xa3F61770BBd12e705734Ad940f382227d0fD82fE"
+        "arb1:0xa3F61770BBd12e705734Ad940f382227d0fD82fE"
    }
```

```diff
    contract ProxyAdmin (0x951e848eAD9c2B4aFaEa5e0649b36A00f97f01b1) {
    +++ description: None
      directlyReceivedPermissions.0.from:
-        "arbitrum:0x818351386C3a63A8244C78aDAD42B9b4f9a516d4"
+        "arb1:0x818351386C3a63A8244C78aDAD42B9b4f9a516d4"
    }
```

```diff
    contract ProxyAdmin (0xa3F61770BBd12e705734Ad940f382227d0fD82fE) {
    +++ description: None
      directlyReceivedPermissions.0.from:
-        "arbitrum:0x0E9C1a3AA696299E38b00a8144Bf6dc16C1F5400"
+        "arb1:0x0E9C1a3AA696299E38b00a8144Bf6dc16C1F5400"
    }
```

```diff
    contract GnosisSafe (0xCafEf00d348Adbd57c37d1B77e0619C6244C6878) {
    +++ description: None
      receivedPermissions.0.from:
-        "arbitrum:0x397A5f7f3dBd538f23DE225B51f532c34448dA9B"
+        "arb1:0x397A5f7f3dBd538f23DE225B51f532c34448dA9B"
    }
```

Generated with discovered.json: 0x62f209406f6eedcd1612933d5af5ae1f82f0380a

# Diff at Wed, 25 Jun 2025 13:51:49 GMT:

- author: Luca Donno (<donnoh99@gmail.com>)
- current block number: 351073243

## Description

Initial discovery.

## Initial discovery

```diff
+   Status: CREATED
    contract RiscZeroVerifierRouter (0x0b144E07A0826182B6b59788c34b32Bfa86Fb711)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Hibachi (0x0E9C1a3AA696299E38b00a8144Bf6dc16C1F5400)
    +++ description: Main contract handling deposits, withdrawals and state updates.
```

```diff
+   Status: CREATED
    contract SP1VerifierGateway (0x397A5f7f3dBd538f23DE225B51f532c34448dA9B)
    +++ description: This contract is the router for zk proof verification. It stores the mapping between identifiers and the address of onchain verifier contracts, routing each identifier to the corresponding verifier contract.
```

```diff
+   Status: CREATED
    contract HibachiRedemptionERC20 (0x4407f4F272f78D1157C59E8557729be36137158F)
    +++ description: None
```

```diff
+   Status: CREATED
    contract SP1Verifier (0x50ACFBEdecf4cbe350E1a86fC6f03a821772f1e5)
    +++ description: None
```

```diff
+   Status: CREATED
    contract HibachiEscape (0x818351386C3a63A8244C78aDAD42B9b4f9a516d4)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ProxyAdmin (0x951e848eAD9c2B4aFaEa5e0649b36A00f97f01b1)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ProxyAdmin (0xa3F61770BBd12e705734Ad940f382227d0fD82fE)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Implementation (0xa5f208e072434bC67592E4C49C1B991BA79BCA46)
    +++ description: None
```

```diff
+   Status: CREATED
    contract GnosisSafe (0xCafEf00d348Adbd57c37d1B77e0619C6244C6878)
    +++ description: None
```

```diff
+   Status: CREATED
    contract TimelockController (0xDC986a09728F76110FF666eE7b20d99086501d15)
    +++ description: None
```
