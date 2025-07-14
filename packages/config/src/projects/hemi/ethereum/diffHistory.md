Generated with discovered.json: 0x30bcf5f77a5ec7100e682538f5c53d07577d6720

# Diff at Mon, 14 Jul 2025 08:02:44 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@0dc82cd5064c9c6dc9fb20e2291a8bb6b2048e27 block: 22765735
- current block number: 22765735

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22765735 (main branch discovery), not current.

```diff
    contract OptimismMintableERC20Factory (0x0262fEDC4A98f94dDB90CeF0E058644d8409342C) {
    +++ description: A helper contract that generates OptimismMintableERC20 contracts on the network it's deployed to. OptimismMintableERC20 is a standard extension of the base ERC20 token contract designed to allow the L1StandardBridge contracts to mint and burn tokens. This makes it possible to use an OptimismMintableERC20 as this chain's representation of a token on the host chain, or vice-versa.
      description:
-        "A helper contract that generates OptimismMintableERC20 contracts on the network it's deployed to. OptimismMintableERC20 is a standard extension of the base ERC20 token contract designed to allow the L1StandardBridge contracts to mint and burn tokens. This makes it possible to use an OptimismMintablERC20 as this chain's representation of a token on the host chain, or vice-versa."
+        "A helper contract that generates OptimismMintableERC20 contracts on the network it's deployed to. OptimismMintableERC20 is a standard extension of the base ERC20 token contract designed to allow the L1StandardBridge contracts to mint and burn tokens. This makes it possible to use an OptimismMintableERC20 as this chain's representation of a token on the host chain, or vice-versa."
    }
```

Generated with discovered.json: 0x9c17355b77287dfb36b994fa76967216a26718ac

# Diff at Fri, 04 Jul 2025 12:19:02 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@1f56dc47fe915564d4555300304da4d3bcbc087f block: 22765735
- current block number: 22765735

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22765735 (main branch discovery), not current.

```diff
    EOA  (0x2BD42D6CFA838fB15187F3D59dC19eD169b2659e) {
    +++ description: None
      receivedPermissions.0.from:
-        "ethereum:0x6daF3a3497D8abdFE12915aDD9829f83A79C0d51"
+        "eth:0x6daF3a3497D8abdFE12915aDD9829f83A79C0d51"
      receivedPermissions.1.from:
-        "ethereum:0x6daF3a3497D8abdFE12915aDD9829f83A79C0d51"
+        "eth:0x6daF3a3497D8abdFE12915aDD9829f83A79C0d51"
    }
```

```diff
    EOA  (0x65115C6D23274E0A29A63B69130eFe901Aa52e7A) {
    +++ description: None
      receivedPermissions.0.from:
-        "ethereum:0x5ae68684D9179A8053883f1Df599Ea7Fb35303c3"
+        "eth:0x5ae68684D9179A8053883f1Df599Ea7Fb35303c3"
    }
```

```diff
    contract GnosisSafe (0x8434dc705e4B729405Dd66C94DfC62bc3825Ea69) {
    +++ description: None
      receivedPermissions.0.via.0.address:
-        "ethereum:0xbE81A9D662422f667F634f3Fc301e2E360FeFB30"
+        "eth:0xbE81A9D662422f667F634f3Fc301e2E360FeFB30"
      receivedPermissions.0.from:
-        "ethereum:0xA5F37791378c55941a52B4dCb70Be4D8D09f5e43"
+        "eth:0xA5F37791378c55941a52B4dCb70Be4D8D09f5e43"
      receivedPermissions.1.via.0.address:
-        "ethereum:0xbE81A9D662422f667F634f3Fc301e2E360FeFB30"
+        "eth:0xbE81A9D662422f667F634f3Fc301e2E360FeFB30"
      receivedPermissions.1.from:
-        "ethereum:0x0262fEDC4A98f94dDB90CeF0E058644d8409342C"
+        "eth:0x0262fEDC4A98f94dDB90CeF0E058644d8409342C"
      receivedPermissions.2.via.0.address:
-        "ethereum:0xbE81A9D662422f667F634f3Fc301e2E360FeFB30"
+        "eth:0xbE81A9D662422f667F634f3Fc301e2E360FeFB30"
      receivedPermissions.2.from:
-        "ethereum:0x15144FB8621cB3c4ED3DB223c173ffb58C8D2aB8"
+        "eth:0x15144FB8621cB3c4ED3DB223c173ffb58C8D2aB8"
      receivedPermissions.3.via.0.address:
-        "ethereum:0xbE81A9D662422f667F634f3Fc301e2E360FeFB30"
+        "eth:0xbE81A9D662422f667F634f3Fc301e2E360FeFB30"
      receivedPermissions.3.from:
-        "ethereum:0x39a0005415256B9863aFE2d55Edcf75ECc3A4D7e"
+        "eth:0x39a0005415256B9863aFE2d55Edcf75ECc3A4D7e"
      receivedPermissions.4.via.0.address:
-        "ethereum:0xbE81A9D662422f667F634f3Fc301e2E360FeFB30"
+        "eth:0xbE81A9D662422f667F634f3Fc301e2E360FeFB30"
      receivedPermissions.4.from:
-        "ethereum:0x5ae68684D9179A8053883f1Df599Ea7Fb35303c3"
+        "eth:0x5ae68684D9179A8053883f1Df599Ea7Fb35303c3"
      receivedPermissions.5.via.0.address:
-        "ethereum:0xbE81A9D662422f667F634f3Fc301e2E360FeFB30"
+        "eth:0xbE81A9D662422f667F634f3Fc301e2E360FeFB30"
      receivedPermissions.5.from:
-        "ethereum:0x5eaa10F99e7e6D177eF9F74E519E319aa49f191e"
+        "eth:0x5eaa10F99e7e6D177eF9F74E519E319aa49f191e"
      receivedPermissions.6.via.0.address:
-        "ethereum:0xbE81A9D662422f667F634f3Fc301e2E360FeFB30"
+        "eth:0xbE81A9D662422f667F634f3Fc301e2E360FeFB30"
      receivedPermissions.6.from:
-        "ethereum:0x6daF3a3497D8abdFE12915aDD9829f83A79C0d51"
+        "eth:0x6daF3a3497D8abdFE12915aDD9829f83A79C0d51"
      receivedPermissions.7.via.0.address:
-        "ethereum:0xbE81A9D662422f667F634f3Fc301e2E360FeFB30"
+        "eth:0xbE81A9D662422f667F634f3Fc301e2E360FeFB30"
      receivedPermissions.7.from:
-        "ethereum:0xa446331bD28cbe0186A983a27C528f566B6bedE0"
+        "eth:0xa446331bD28cbe0186A983a27C528f566B6bedE0"
      receivedPermissions.8.via.0.address:
-        "ethereum:0xbE81A9D662422f667F634f3Fc301e2E360FeFB30"
+        "eth:0xbE81A9D662422f667F634f3Fc301e2E360FeFB30"
      receivedPermissions.8.from:
-        "ethereum:0xF005dFb08377faD44588Af68d0884D272A6fb050"
+        "eth:0xF005dFb08377faD44588Af68d0884D272A6fb050"
      directlyReceivedPermissions.0.from:
-        "ethereum:0xbE81A9D662422f667F634f3Fc301e2E360FeFB30"
+        "eth:0xbE81A9D662422f667F634f3Fc301e2E360FeFB30"
    }
```

```diff
    contract ProxyAdmin (0xbE81A9D662422f667F634f3Fc301e2E360FeFB30) {
    +++ description: None
      directlyReceivedPermissions.0.from:
-        "ethereum:0xA5F37791378c55941a52B4dCb70Be4D8D09f5e43"
+        "eth:0xA5F37791378c55941a52B4dCb70Be4D8D09f5e43"
      directlyReceivedPermissions.1.from:
-        "ethereum:0x0262fEDC4A98f94dDB90CeF0E058644d8409342C"
+        "eth:0x0262fEDC4A98f94dDB90CeF0E058644d8409342C"
      directlyReceivedPermissions.2.from:
-        "ethereum:0x15144FB8621cB3c4ED3DB223c173ffb58C8D2aB8"
+        "eth:0x15144FB8621cB3c4ED3DB223c173ffb58C8D2aB8"
      directlyReceivedPermissions.3.from:
-        "ethereum:0x39a0005415256B9863aFE2d55Edcf75ECc3A4D7e"
+        "eth:0x39a0005415256B9863aFE2d55Edcf75ECc3A4D7e"
      directlyReceivedPermissions.4.from:
-        "ethereum:0x5ae68684D9179A8053883f1Df599Ea7Fb35303c3"
+        "eth:0x5ae68684D9179A8053883f1Df599Ea7Fb35303c3"
      directlyReceivedPermissions.5.from:
-        "ethereum:0x5eaa10F99e7e6D177eF9F74E519E319aa49f191e"
+        "eth:0x5eaa10F99e7e6D177eF9F74E519E319aa49f191e"
      directlyReceivedPermissions.6.from:
-        "ethereum:0x6daF3a3497D8abdFE12915aDD9829f83A79C0d51"
+        "eth:0x6daF3a3497D8abdFE12915aDD9829f83A79C0d51"
      directlyReceivedPermissions.7.from:
-        "ethereum:0xa446331bD28cbe0186A983a27C528f566B6bedE0"
+        "eth:0xa446331bD28cbe0186A983a27C528f566B6bedE0"
      directlyReceivedPermissions.8.from:
-        "ethereum:0xF005dFb08377faD44588Af68d0884D272A6fb050"
+        "eth:0xF005dFb08377faD44588Af68d0884D272A6fb050"
    }
```

```diff
    EOA  (0xc0E743E625bBB17E3B16efC984df9678D06EcdDF) {
    +++ description: None
      receivedPermissions.0.from:
-        "ethereum:0x6daF3a3497D8abdFE12915aDD9829f83A79C0d51"
+        "eth:0x6daF3a3497D8abdFE12915aDD9829f83A79C0d51"
      receivedPermissions.1.from:
-        "ethereum:0x6daF3a3497D8abdFE12915aDD9829f83A79C0d51"
+        "eth:0x6daF3a3497D8abdFE12915aDD9829f83A79C0d51"
      receivedPermissions.2.from:
-        "ethereum:0x15144FB8621cB3c4ED3DB223c173ffb58C8D2aB8"
+        "eth:0x15144FB8621cB3c4ED3DB223c173ffb58C8D2aB8"
      receivedPermissions.3.from:
-        "ethereum:0x39a0005415256B9863aFE2d55Edcf75ECc3A4D7e"
+        "eth:0x39a0005415256B9863aFE2d55Edcf75ECc3A4D7e"
      receivedPermissions.4.from:
-        "ethereum:0x39a0005415256B9863aFE2d55Edcf75ECc3A4D7e"
+        "eth:0x39a0005415256B9863aFE2d55Edcf75ECc3A4D7e"
      receivedPermissions.5.from:
-        "ethereum:0x5ae68684D9179A8053883f1Df599Ea7Fb35303c3"
+        "eth:0x5ae68684D9179A8053883f1Df599Ea7Fb35303c3"
    }
```

Generated with discovered.json: 0x380b87ff1319bb45bb30ebebe25422260ca11f67

# Diff at Mon, 23 Jun 2025 07:47:33 GMT:

- author: vincfurc (<10850139+vincfurc@users.noreply.github.com>)
- current block number: 22765735

## Description

First discovery, all templatized.

## Initial discovery

```diff
+   Status: CREATED
    contract OptimismMintableERC20Factory (0x0262fEDC4A98f94dDB90CeF0E058644d8409342C)
    +++ description: A helper contract that generates OptimismMintableERC20 contracts on the network it's deployed to. OptimismMintableERC20 is a standard extension of the base ERC20 token contract designed to allow the L1StandardBridge contracts to mint and burn tokens. This makes it possible to use an OptimismMintablERC20 as this chain's representation of a token on the host chain, or vice-versa.
```

```diff
+   Status: CREATED
    contract SuperchainConfig (0x15144FB8621cB3c4ED3DB223c173ffb58C8D2aB8)
    +++ description: This is NOT the shared SuperchainConfig contract of the OP stack Superchain but rather a local fork. It manages the `PAUSED_SLOT`, a boolean value indicating whether the local chain is paused, and `GUARDIAN_SLOT`, the address of the guardian which can pause and unpause the system.
```

```diff
+   Status: CREATED
    contract OptimismPortal (0x39a0005415256B9863aFE2d55Edcf75ECc3A4D7e)
    +++ description: The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals.
```

```diff
+   Status: CREATED
    contract SystemConfig (0x5ae68684D9179A8053883f1Df599Ea7Fb35303c3)
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
```

```diff
+   Status: CREATED
    contract L1StandardBridge (0x5eaa10F99e7e6D177eF9F74E519E319aa49f191e)
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain.
```

```diff
+   Status: CREATED
    contract L2OutputOracle (0x6daF3a3497D8abdFE12915aDD9829f83A79C0d51)
    +++ description: Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots.
```

```diff
+   Status: CREATED
    contract GnosisSafe (0x8434dc705e4B729405Dd66C94DfC62bc3825Ea69)
    +++ description: None
```

```diff
+   Status: CREATED
    contract L1ERC721Bridge (0xa446331bD28cbe0186A983a27C528f566B6bedE0)
    +++ description: Used to bridge ERC-721 tokens from host chain to this chain.
```

```diff
+   Status: CREATED
    contract AddressManager (0xA5F37791378c55941a52B4dCb70Be4D8D09f5e43)
    +++ description: Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts.
```

```diff
+   Status: CREATED
    contract ProxyAdmin (0xbE81A9D662422f667F634f3Fc301e2E360FeFB30)
    +++ description: None
```

```diff
+   Status: CREATED
    contract L1CrossDomainMessenger (0xF005dFb08377faD44588Af68d0884D272A6fb050)
    +++ description: Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function.
```
