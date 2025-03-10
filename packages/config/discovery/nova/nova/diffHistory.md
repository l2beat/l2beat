Generated with discovered.json: 0x0f9fd24acef4b1b88b8f91085556ec3f994efe3f

# Diff at Tue, 04 Mar 2025 10:42:16 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@98d260b45fe0d2195ce5e629bd7b200c8706e8ba block: 81620827
- current block number: 81620827

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 81620827 (main branch discovery), not current.

```diff
    contract L2GatewayRouter (0x21903d3F8176b1a0c17E953Cd896610Be9fFDFa8) {
    +++ description: Router managing token <–> gateway mapping on L2.
      sinceBlock:
+        12
    }
```

```diff
    contract L2SurplusFee (0x509386DbF5C0BE6fd68Df97A05fdB375136c32De) {
    +++ description: This contract receives all SurplusFees: Transaction fee component that covers the cost beyond that covered by the L2 Base Fee during chain congestion. They are withdrawable to a configurable set of recipients.
      sinceBlock:
+        3162027
    }
```

```diff
    contract StandardArbERC20 (0x53923A0d1f4805463584c91b2E55d6c600A94E91) {
    +++ description: None
      sinceBlock:
+        19
    }
```

```diff
    contract L2WethGateway (0x7626841cB6113412F9c88D3ADC720C9FAC88D9eD) {
    +++ description: Counterpart to the Bridge on L1. Mints and burns WETH on L2.
      sinceBlock:
+        32
    }
```

```diff
    contract L2UpgradeExecutor (0x86a02dD71363c440b21F4c0E5B2Ad01Ffe1A7482) {
    +++ description: Central contract defining the access control permissions for upgrading the system contract implementations.
      sinceBlock:
+        3154416
    }
```

```diff
    contract L2BaseFee (0x9fCB6F75D99029f28F6F4a1d277bae49c5CAC79f) {
    +++ description: This contract receives all SurplusFees: Transaction fee component that covers the cost beyond that covered by the L2 Base Fee during chain congestion. They are withdrawable to a configurable set of recipients.
      sinceBlock:
+        3162026
    }
```

```diff
    contract L2GatewaysProxyAdmin (0xada790b026097BfB36a5ed696859b97a96CEd92C) {
    +++ description: None
      sinceBlock:
+        10
    }
```

```diff
    contract L2ARBGateway (0xbf544970E6BD77b21C6492C281AB60d0770451F4) {
    +++ description: None
      sinceBlock:
+        16
    }
```

```diff
    contract L2SecurityCouncilEmergency (0xc232ee726E3C51B86778BB4dBe61C52cC07A60F3) {
    +++ description: None
      sinceBlock:
+        18117569
    }
```

```diff
    contract L2ERC20Gateway (0xcF9bAb7e53DDe48A6DC4f286CB14e05298799257) {
    +++ description: Counterpart to the L1ERC20Gateway. Can mint (deposit to L2) and burn (withdraw to L1) ERC20 tokens on L2.
      sinceBlock:
+        14
    }
```

```diff
    contract UpgradeableBeacon (0xd31Ed16a8CeCe0A5070AC26024674eB680E3e639) {
    +++ description: None
      sinceBlock:
+        20
    }
```

```diff
    contract BeaconProxyFactory (0xD9D66e55227c7558f0dB52adD059057Eb9bd90a3) {
    +++ description: None
      sinceBlock:
+        21
    }
```

```diff
    contract L2ProxyAdmin (0xf58eA15B20983116c21b05c876cc8e6CDAe5C2b9) {
    +++ description: None
      sinceBlock:
+        3154409
    }
```

```diff
    contract L2ArbitrumToken (0xf823C3cD3CeBE0a1fA952ba88Dc9EEf8e0Bf46AD) {
    +++ description: None
      sinceBlock:
+        3154421
    }
```

Generated with discovered.json: 0x61ae0dca49959bc3ed003c376e3a0bca2107774f

# Diff at Fri, 21 Feb 2025 12:11:59 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@d219f271711b2cf7a164e3443bead5e4957d13a8 block: 81620827
- current block number: 81620827

## Description

Config related: Set orbit stack contract categories.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 81620827 (main branch discovery), not current.

```diff
    contract L2UpgradeExecutor (0x86a02dD71363c440b21F4c0E5B2Ad01Ffe1A7482) {
    +++ description: Central contract defining the access control permissions for upgrading the system contract implementations.
      category:
+        {"name":"Governance","priority":3}
    }
```

Generated with discovered.json: 0xcf1f05fe7fcc28d3db0e3ebc677b61cd7893105f

# Diff at Mon, 17 Feb 2025 15:27:29 GMT:

- author: Luca Donno (<donnoh99@gmail.com>)
- comparing to: main@ffdfa0f74baa606307d20416d1f98087d031a330 block: 81620827
- current block number: 82375495

## Description

Make Nova discovery driven.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 81620827 (main branch discovery), not current.

```diff
    contract L2GatewayRouter (0x21903d3F8176b1a0c17E953Cd896610Be9fFDFa8) {
    +++ description: Router managing token <–> gateway mapping on L2.
      issuedPermissions.1:
+        {"permission":"upgrade","to":"0xf7951D92B0C345144506576eC13Ecf5103aC905a","via":[{"address":"0x86a02dD71363c440b21F4c0E5B2Ad01Ffe1A7482"},{"address":"0xada790b026097BfB36a5ed696859b97a96CEd92C"}]}
      issuedPermissions.0.to:
-        "0xf7951D92B0C345144506576eC13Ecf5103aC905a"
+        "0xc232ee726E3C51B86778BB4dBe61C52cC07A60F3"
    }
```

```diff
-   Status: DELETED
    contract ArbChildToParentRewardRouter (0x36D0170D92F66e8949eB276C3AC4FEA64f83704d)
    +++ description: None
```

```diff
-   Status: DELETED
    contract GnosisSafeL2 (0x41C327d5fc9e29680CcD45e5E52446E0DB3DAdFd)
    +++ description: None
```

```diff
    contract L2WethGateway (0x7626841cB6113412F9c88D3ADC720C9FAC88D9eD) {
    +++ description: Counterpart to the Bridge on L1. Mints and burns WETH on L2.
      issuedPermissions.1:
+        {"permission":"upgrade","to":"0xf7951D92B0C345144506576eC13Ecf5103aC905a","via":[{"address":"0x86a02dD71363c440b21F4c0E5B2Ad01Ffe1A7482"},{"address":"0xada790b026097BfB36a5ed696859b97a96CEd92C"}]}
      issuedPermissions.0.to:
-        "0xf7951D92B0C345144506576eC13Ecf5103aC905a"
+        "0xc232ee726E3C51B86778BB4dBe61C52cC07A60F3"
    }
```

```diff
    contract L2UpgradeExecutor (0x86a02dD71363c440b21F4c0E5B2Ad01Ffe1A7482) {
    +++ description: Central contract defining the access control permissions for upgrading the system contract implementations.
      issuedPermissions.1:
+        {"permission":"upgrade","to":"0xf7951D92B0C345144506576eC13Ecf5103aC905a","via":[{"address":"0x86a02dD71363c440b21F4c0E5B2Ad01Ffe1A7482"},{"address":"0xf58eA15B20983116c21b05c876cc8e6CDAe5C2b9"}]}
      issuedPermissions.0.to:
-        "0xf7951D92B0C345144506576eC13Ecf5103aC905a"
+        "0xc232ee726E3C51B86778BB4dBe61C52cC07A60F3"
      directlyReceivedPermissions.2:
-        {"permission":"act","from":"0xf58eA15B20983116c21b05c876cc8e6CDAe5C2b9"}
      directlyReceivedPermissions.1.from:
-        "0xc232ee726E3C51B86778BB4dBe61C52cC07A60F3"
+        "0xf58eA15B20983116c21b05c876cc8e6CDAe5C2b9"
    }
```

```diff
    contract L2ARBGateway (0xbf544970E6BD77b21C6492C281AB60d0770451F4) {
    +++ description: None
      issuedPermissions.1:
+        {"permission":"upgrade","to":"0xf7951D92B0C345144506576eC13Ecf5103aC905a","via":[{"address":"0x86a02dD71363c440b21F4c0E5B2Ad01Ffe1A7482"},{"address":"0xada790b026097BfB36a5ed696859b97a96CEd92C"}]}
      issuedPermissions.0.to:
-        "0xf7951D92B0C345144506576eC13Ecf5103aC905a"
+        "0xc232ee726E3C51B86778BB4dBe61C52cC07A60F3"
    }
```

```diff
    contract L2SecurityCouncilEmergency (0xc232ee726E3C51B86778BB4dBe61C52cC07A60F3) {
    +++ description: None
      template:
-        "GnosisSafe"
+        "orbitstack/layer2/L2SecurityCouncilEmergency"
      receivedPermissions:
+        [{"permission":"upgrade","from":"0x21903d3F8176b1a0c17E953Cd896610Be9fFDFa8","via":[{"address":"0xada790b026097BfB36a5ed696859b97a96CEd92C"},{"address":"0x86a02dD71363c440b21F4c0E5B2Ad01Ffe1A7482"}]},{"permission":"upgrade","from":"0x7626841cB6113412F9c88D3ADC720C9FAC88D9eD","via":[{"address":"0xada790b026097BfB36a5ed696859b97a96CEd92C"},{"address":"0x86a02dD71363c440b21F4c0E5B2Ad01Ffe1A7482"}]},{"permission":"upgrade","from":"0x86a02dD71363c440b21F4c0E5B2Ad01Ffe1A7482","via":[{"address":"0xf58eA15B20983116c21b05c876cc8e6CDAe5C2b9"},{"address":"0x86a02dD71363c440b21F4c0E5B2Ad01Ffe1A7482"}]},{"permission":"upgrade","from":"0xbf544970E6BD77b21C6492C281AB60d0770451F4","via":[{"address":"0xada790b026097BfB36a5ed696859b97a96CEd92C"},{"address":"0x86a02dD71363c440b21F4c0E5B2Ad01Ffe1A7482"}]},{"permission":"upgrade","from":"0xcF9bAb7e53DDe48A6DC4f286CB14e05298799257","via":[{"address":"0xada790b026097BfB36a5ed696859b97a96CEd92C"},{"address":"0x86a02dD71363c440b21F4c0E5B2Ad01Ffe1A7482"}]},{"permission":"upgrade","from":"0xf823C3cD3CeBE0a1fA952ba88Dc9EEf8e0Bf46AD","via":[{"address":"0xf58eA15B20983116c21b05c876cc8e6CDAe5C2b9"},{"address":"0x86a02dD71363c440b21F4c0E5B2Ad01Ffe1A7482"}]}]
    }
```

```diff
    contract L2ERC20Gateway (0xcF9bAb7e53DDe48A6DC4f286CB14e05298799257) {
    +++ description: Counterpart to the L1ERC20Gateway. Can mint (deposit to L2) and burn (withdraw to L1) ERC20 tokens on L2.
      issuedPermissions.1:
+        {"permission":"upgrade","to":"0xf7951D92B0C345144506576eC13Ecf5103aC905a","via":[{"address":"0x86a02dD71363c440b21F4c0E5B2Ad01Ffe1A7482"},{"address":"0xada790b026097BfB36a5ed696859b97a96CEd92C"}]}
      issuedPermissions.0.to:
-        "0xf7951D92B0C345144506576eC13Ecf5103aC905a"
+        "0xc232ee726E3C51B86778BB4dBe61C52cC07A60F3"
    }
```

```diff
-   Status: DELETED
    contract GnosisSafeL2 (0xD0749b3e537Ed52DE4e6a3Ae1eB6fc26059d0895)
    +++ description: None
```

```diff
    contract L2ArbitrumToken (0xf823C3cD3CeBE0a1fA952ba88Dc9EEf8e0Bf46AD) {
    +++ description: None
      issuedPermissions.1:
+        {"permission":"upgrade","to":"0xf7951D92B0C345144506576eC13Ecf5103aC905a","via":[{"address":"0x86a02dD71363c440b21F4c0E5B2Ad01Ffe1A7482"},{"address":"0xf58eA15B20983116c21b05c876cc8e6CDAe5C2b9"}]}
      issuedPermissions.0.to:
-        "0xf7951D92B0C345144506576eC13Ecf5103aC905a"
+        "0xc232ee726E3C51B86778BB4dBe61C52cC07A60F3"
    }
```

Generated with discovered.json: 0x7f05a40f5b4820273cdd386a5d21a16c01f8728e

# Diff at Wed, 12 Feb 2025 18:44:36 GMT:

- author: vincfurc (<10850139+vincfurc@users.noreply.github.com>)
- comparing to: main@2b0c549e9be2ec1627969531e2ff05c01d31a788 block: 81620827
- current block number: 81620827

## Description

Part of making Arbitrum discovery driven. Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 81620827 (main branch discovery), not current.

```diff
    contract L2GatewayRouter (0x21903d3F8176b1a0c17E953Cd896610Be9fFDFa8) {
    +++ description: Router managing token <–> gateway mapping on L2.
      template:
+        "orbitstack/layer2/L2GatewayRouter"
      description:
+        "Router managing token <–> gateway mapping on L2."
    }
```

```diff
    contract L2SurplusFee (0x509386DbF5C0BE6fd68Df97A05fdB375136c32De) {
    +++ description: This contract receives all SurplusFees: Transaction fee component that covers the cost beyond that covered by the L2 Base Fee during chain congestion. They are withdrawable to a configurable set of recipients.
      template:
+        "orbitstack/layer2/L2SurplusFee"
      description:
+        "This contract receives all SurplusFees: Transaction fee component that covers the cost beyond that covered by the L2 Base Fee during chain congestion. They are withdrawable to a configurable set of recipients."
    }
```

```diff
    contract L2WethGateway (0x7626841cB6113412F9c88D3ADC720C9FAC88D9eD) {
    +++ description: Counterpart to the Bridge on L1. Mints and burns WETH on L2.
      template:
+        "orbitstack/layer2/L2WethGateway"
      description:
+        "Counterpart to the Bridge on L1. Mints and burns WETH on L2."
    }
```

```diff
    contract L2BaseFee (0x9fCB6F75D99029f28F6F4a1d277bae49c5CAC79f) {
    +++ description: This contract receives all SurplusFees: Transaction fee component that covers the cost beyond that covered by the L2 Base Fee during chain congestion. They are withdrawable to a configurable set of recipients.
      template:
+        "orbitstack/layer2/L2SurplusFee"
      displayName:
+        "L2SurplusFee"
      description:
+        "This contract receives all SurplusFees: Transaction fee component that covers the cost beyond that covered by the L2 Base Fee during chain congestion. They are withdrawable to a configurable set of recipients."
    }
```

```diff
    contract L2ERC20Gateway (0xcF9bAb7e53DDe48A6DC4f286CB14e05298799257) {
    +++ description: Counterpart to the L1ERC20Gateway. Can mint (deposit to L2) and burn (withdraw to L1) ERC20 tokens on L2.
      template:
+        "orbitstack/layer2/L2ERC20Gateway"
      description:
+        "Counterpart to the L1ERC20Gateway. Can mint (deposit to L2) and burn (withdraw to L1) ERC20 tokens on L2."
    }
```

Generated with discovered.json: 0x3485fdf7381f47091b425007a73c299d22546102

# Diff at Mon, 20 Jan 2025 11:10:46 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@2c8b4f3d9910bb6371be9b4df87b70856e7d8c64 block: 81620827
- current block number: 81620827

## Description

Rerun on the same block number. Applies fixes to permissions and via field. Renames permission's target to to/from.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 81620827 (main branch discovery), not current.

```diff
    contract L2GatewayRouter (0x21903d3F8176b1a0c17E953Cd896610Be9fFDFa8) {
    +++ description: None
      issuedPermissions.0.target:
-        "0xf7951D92B0C345144506576eC13Ecf5103aC905a"
      issuedPermissions.0.via.1.delay:
-        0
      issuedPermissions.0.via.0.delay:
-        0
      issuedPermissions.0.to:
+        "0xf7951D92B0C345144506576eC13Ecf5103aC905a"
    }
```

```diff
    contract L2WethGateway (0x7626841cB6113412F9c88D3ADC720C9FAC88D9eD) {
    +++ description: None
      issuedPermissions.0.target:
-        "0xf7951D92B0C345144506576eC13Ecf5103aC905a"
      issuedPermissions.0.via.1.delay:
-        0
      issuedPermissions.0.via.0.delay:
-        0
      issuedPermissions.0.to:
+        "0xf7951D92B0C345144506576eC13Ecf5103aC905a"
    }
```

```diff
    contract L2UpgradeExecutor (0x86a02dD71363c440b21F4c0E5B2Ad01Ffe1A7482) {
    +++ description: Central contract defining the access control permissions for upgrading the system contract implementations.
      issuedPermissions.0.target:
-        "0xf7951D92B0C345144506576eC13Ecf5103aC905a"
      issuedPermissions.0.via.1.delay:
-        0
      issuedPermissions.0.via.0.delay:
-        0
      issuedPermissions.0.to:
+        "0xf7951D92B0C345144506576eC13Ecf5103aC905a"
      directlyReceivedPermissions.2.target:
-        "0xf58eA15B20983116c21b05c876cc8e6CDAe5C2b9"
      directlyReceivedPermissions.2.from:
+        "0xf58eA15B20983116c21b05c876cc8e6CDAe5C2b9"
      directlyReceivedPermissions.1.target:
-        "0xc232ee726E3C51B86778BB4dBe61C52cC07A60F3"
      directlyReceivedPermissions.1.from:
+        "0xc232ee726E3C51B86778BB4dBe61C52cC07A60F3"
      directlyReceivedPermissions.0.target:
-        "0xada790b026097BfB36a5ed696859b97a96CEd92C"
      directlyReceivedPermissions.0.from:
+        "0xada790b026097BfB36a5ed696859b97a96CEd92C"
    }
```

```diff
    contract L2GatewaysProxyAdmin (0xada790b026097BfB36a5ed696859b97a96CEd92C) {
    +++ description: None
      directlyReceivedPermissions.3.target:
-        "0xcF9bAb7e53DDe48A6DC4f286CB14e05298799257"
      directlyReceivedPermissions.3.from:
+        "0xcF9bAb7e53DDe48A6DC4f286CB14e05298799257"
      directlyReceivedPermissions.2.target:
-        "0xbf544970E6BD77b21C6492C281AB60d0770451F4"
      directlyReceivedPermissions.2.from:
+        "0xbf544970E6BD77b21C6492C281AB60d0770451F4"
      directlyReceivedPermissions.1.target:
-        "0x7626841cB6113412F9c88D3ADC720C9FAC88D9eD"
      directlyReceivedPermissions.1.from:
+        "0x7626841cB6113412F9c88D3ADC720C9FAC88D9eD"
      directlyReceivedPermissions.0.target:
-        "0x21903d3F8176b1a0c17E953Cd896610Be9fFDFa8"
      directlyReceivedPermissions.0.from:
+        "0x21903d3F8176b1a0c17E953Cd896610Be9fFDFa8"
    }
```

```diff
    contract L2ARBGateway (0xbf544970E6BD77b21C6492C281AB60d0770451F4) {
    +++ description: None
      issuedPermissions.0.target:
-        "0xf7951D92B0C345144506576eC13Ecf5103aC905a"
      issuedPermissions.0.via.1.delay:
-        0
      issuedPermissions.0.via.0.delay:
-        0
      issuedPermissions.0.to:
+        "0xf7951D92B0C345144506576eC13Ecf5103aC905a"
    }
```

```diff
    contract L2SecurityCouncilEmergency (0xc232ee726E3C51B86778BB4dBe61C52cC07A60F3) {
    +++ description: None
      directlyReceivedPermissions.0.target:
-        "0x86a02dD71363c440b21F4c0E5B2Ad01Ffe1A7482"
      directlyReceivedPermissions.0.from:
+        "0x86a02dD71363c440b21F4c0E5B2Ad01Ffe1A7482"
    }
```

```diff
    contract L2ERC20Gateway (0xcF9bAb7e53DDe48A6DC4f286CB14e05298799257) {
    +++ description: None
      issuedPermissions.0.target:
-        "0xf7951D92B0C345144506576eC13Ecf5103aC905a"
      issuedPermissions.0.via.1.delay:
-        0
      issuedPermissions.0.via.0.delay:
-        0
      issuedPermissions.0.to:
+        "0xf7951D92B0C345144506576eC13Ecf5103aC905a"
    }
```

```diff
    contract L2ProxyAdmin (0xf58eA15B20983116c21b05c876cc8e6CDAe5C2b9) {
    +++ description: None
      directlyReceivedPermissions.1.target:
-        "0xf823C3cD3CeBE0a1fA952ba88Dc9EEf8e0Bf46AD"
      directlyReceivedPermissions.1.from:
+        "0xf823C3cD3CeBE0a1fA952ba88Dc9EEf8e0Bf46AD"
      directlyReceivedPermissions.0.target:
-        "0x86a02dD71363c440b21F4c0E5B2Ad01Ffe1A7482"
      directlyReceivedPermissions.0.from:
+        "0x86a02dD71363c440b21F4c0E5B2Ad01Ffe1A7482"
    }
```

```diff
    contract L2ArbitrumToken (0xf823C3cD3CeBE0a1fA952ba88Dc9EEf8e0Bf46AD) {
    +++ description: None
      issuedPermissions.0.target:
-        "0xf7951D92B0C345144506576eC13Ecf5103aC905a"
      issuedPermissions.0.via.1.delay:
-        0
      issuedPermissions.0.via.0.delay:
-        0
      issuedPermissions.0.to:
+        "0xf7951D92B0C345144506576eC13Ecf5103aC905a"
    }
```

Generated with discovered.json: 0x2650ceaa63a86b6e4cb4d323d0916320a817049d

# Diff at Wed, 15 Jan 2025 07:53:33 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@3ea176aee1470e5ec80e65adfc81a954f84584d8 block: 81451067
- current block number: 81620827

## Description

Config related: displayName.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 81451067 (main branch discovery), not current.

```diff
    contract L2GatewaysProxyAdmin (0xada790b026097BfB36a5ed696859b97a96CEd92C) {
    +++ description: None
      displayName:
+        "ProxyAdmin"
    }
```

```diff
    contract L2ProxyAdmin (0xf58eA15B20983116c21b05c876cc8e6CDAe5C2b9) {
    +++ description: None
      displayName:
+        "ProxyAdmin"
    }
```

Generated with discovered.json: 0x254b69e96e43f89a57894428a84483a3a683405c

# Diff at Thu, 09 Jan 2025 07:03:16 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@edc6acaed84d40aabd5185e0a0b5ebaf1c90143b block: 79888653
- current block number: 81451067

## Description

SC member sync actions for nova. The key rotation notice can be found [in the forum](https://forum.arbitrum.foundation/t/non-emergency-actions-to-facilitate-key-rotation-of-security-council-december-2024/27973).

## Watched changes

```diff
    contract L2SecurityCouncilEmergency (0xc232ee726E3C51B86778BB4dBe61C52cC07A60F3) {
    +++ description: None
      values.$members.9:
-        "0x3E286452b1C66abB08Eb5494c3894F40aB5a59AF"
+        "0x5DD2205C3aac13E592F0a3D85188c948D1781df1"
      values.$members.8:
-        "0x5DD2205C3aac13E592F0a3D85188c948D1781df1"
+        "0x5a09A94eE8198D3c474d723337aa58023810022C"
      values.$members.7:
-        "0x5a09A94eE8198D3c474d723337aa58023810022C"
+        "0x9316ca66f5f936E3239e4fD2AAAEA5C7b6f3C4cC"
      values.$members.6:
-        "0x70C006fC86A392c16D7E085cefc0Ad1FF7de6C75"
+        "0x882c6FCb3D358b9d70B97c6999159cea64168B6F"
      values.$members.5:
-        "0x9316ca66f5f936E3239e4fD2AAAEA5C7b6f3C4cC"
+        "0x33ddb82e68940f0e4C1050885BcE8faF5Ddd1b93"
      values.$members.4:
-        "0x882c6FCb3D358b9d70B97c6999159cea64168B6F"
+        "0xe2e9d5B97d8C0457B1cf80BC93802bce4DF03e33"
      values.$members.3:
-        "0xeA4A4A886aCA47DD0167B4aEE5B1345e18D20Ee5"
+        "0x9A301de96b15Db3aB778E2969Bf6cAa909cA56E8"
      values.$members.2:
-        "0x1716C1C037e4968D5A06d4d080904F9B7a6508f2"
+        "0x78bB97d2F3811256D7F0041E81Aaf4B426eF3b67"
      values.$members.1:
-        "0x33ddb82e68940f0e4C1050885BcE8faF5Ddd1b93"
+        "0x59c8535419BbCb8AdFFDB3C835435E907e3B183B"
      values.$members.0:
-        "0xe2e9d5B97d8C0457B1cf80BC93802bce4DF03e33"
+        "0x444EDf8B90763bE7015F1F099a0dA0ef10250c71"
    }
```

Generated with discovered.json: 0x511db5a6d9878f35c1b27b2d07e564777657ca91

# Diff at Fri, 29 Nov 2024 09:08:54 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@c60f4ba86fcd7b86d6876d1634b83081095f33d7 block: 79888653
- current block number: 79888653

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 79888653 (main branch discovery), not current.

```diff
    contract L2GatewayRouter (0x21903d3F8176b1a0c17E953Cd896610Be9fFDFa8) {
    +++ description: None
      issuedPermissions.0.target:
-        "0x86a02dD71363c440b21F4c0E5B2Ad01Ffe1A7482"
+        "0xf7951D92B0C345144506576eC13Ecf5103aC905a"
      issuedPermissions.0.via.1:
+        {"address":"0xada790b026097BfB36a5ed696859b97a96CEd92C","delay":0}
      issuedPermissions.0.via.0.address:
-        "0xada790b026097BfB36a5ed696859b97a96CEd92C"
+        "0x86a02dD71363c440b21F4c0E5B2Ad01Ffe1A7482"
    }
```

```diff
    contract L2WethGateway (0x7626841cB6113412F9c88D3ADC720C9FAC88D9eD) {
    +++ description: None
      issuedPermissions.0.target:
-        "0x86a02dD71363c440b21F4c0E5B2Ad01Ffe1A7482"
+        "0xf7951D92B0C345144506576eC13Ecf5103aC905a"
      issuedPermissions.0.via.1:
+        {"address":"0xada790b026097BfB36a5ed696859b97a96CEd92C","delay":0}
      issuedPermissions.0.via.0.address:
-        "0xada790b026097BfB36a5ed696859b97a96CEd92C"
+        "0x86a02dD71363c440b21F4c0E5B2Ad01Ffe1A7482"
    }
```

```diff
    contract L2UpgradeExecutor (0x86a02dD71363c440b21F4c0E5B2Ad01Ffe1A7482) {
    +++ description: Central contract defining the access control permissions for upgrading the system contract implementations.
      issuedPermissions.0.target:
-        "0x86a02dD71363c440b21F4c0E5B2Ad01Ffe1A7482"
+        "0xf7951D92B0C345144506576eC13Ecf5103aC905a"
      issuedPermissions.0.via.1:
+        {"address":"0xf58eA15B20983116c21b05c876cc8e6CDAe5C2b9","delay":0}
      issuedPermissions.0.via.0.address:
-        "0xf58eA15B20983116c21b05c876cc8e6CDAe5C2b9"
+        "0x86a02dD71363c440b21F4c0E5B2Ad01Ffe1A7482"
      receivedPermissions:
-        [{"permission":"upgrade","target":"0x21903d3F8176b1a0c17E953Cd896610Be9fFDFa8","via":[{"address":"0xada790b026097BfB36a5ed696859b97a96CEd92C"}]},{"permission":"upgrade","target":"0x7626841cB6113412F9c88D3ADC720C9FAC88D9eD","via":[{"address":"0xada790b026097BfB36a5ed696859b97a96CEd92C"}]},{"permission":"upgrade","target":"0x86a02dD71363c440b21F4c0E5B2Ad01Ffe1A7482","via":[{"address":"0xf58eA15B20983116c21b05c876cc8e6CDAe5C2b9"}]},{"permission":"upgrade","target":"0xbf544970E6BD77b21C6492C281AB60d0770451F4","via":[{"address":"0xada790b026097BfB36a5ed696859b97a96CEd92C"}]},{"permission":"upgrade","target":"0xcF9bAb7e53DDe48A6DC4f286CB14e05298799257","via":[{"address":"0xada790b026097BfB36a5ed696859b97a96CEd92C"}]},{"permission":"upgrade","target":"0xf823C3cD3CeBE0a1fA952ba88Dc9EEf8e0Bf46AD","via":[{"address":"0xf58eA15B20983116c21b05c876cc8e6CDAe5C2b9"}]}]
      values.executors:
+        ["0xf7951D92B0C345144506576eC13Ecf5103aC905a","0xc232ee726E3C51B86778BB4dBe61C52cC07A60F3"]
      template:
+        "orbitstack/UpgradeExecutor"
      displayName:
+        "UpgradeExecutor"
      description:
+        "Central contract defining the access control permissions for upgrading the system contract implementations."
    }
```

```diff
    contract L2ARBGateway (0xbf544970E6BD77b21C6492C281AB60d0770451F4) {
    +++ description: None
      issuedPermissions.0.target:
-        "0x86a02dD71363c440b21F4c0E5B2Ad01Ffe1A7482"
+        "0xf7951D92B0C345144506576eC13Ecf5103aC905a"
      issuedPermissions.0.via.1:
+        {"address":"0xada790b026097BfB36a5ed696859b97a96CEd92C","delay":0}
      issuedPermissions.0.via.0.address:
-        "0xada790b026097BfB36a5ed696859b97a96CEd92C"
+        "0x86a02dD71363c440b21F4c0E5B2Ad01Ffe1A7482"
    }
```

```diff
    contract L2SecurityCouncilEmergency (0xc232ee726E3C51B86778BB4dBe61C52cC07A60F3) {
    +++ description: None
      directlyReceivedPermissions:
+        [{"permission":"act","target":"0x86a02dD71363c440b21F4c0E5B2Ad01Ffe1A7482"}]
    }
```

```diff
    contract L2ERC20Gateway (0xcF9bAb7e53DDe48A6DC4f286CB14e05298799257) {
    +++ description: None
      issuedPermissions.0.target:
-        "0x86a02dD71363c440b21F4c0E5B2Ad01Ffe1A7482"
+        "0xf7951D92B0C345144506576eC13Ecf5103aC905a"
      issuedPermissions.0.via.1:
+        {"address":"0xada790b026097BfB36a5ed696859b97a96CEd92C","delay":0}
      issuedPermissions.0.via.0.address:
-        "0xada790b026097BfB36a5ed696859b97a96CEd92C"
+        "0x86a02dD71363c440b21F4c0E5B2Ad01Ffe1A7482"
    }
```

```diff
    contract L2ArbitrumToken (0xf823C3cD3CeBE0a1fA952ba88Dc9EEf8e0Bf46AD) {
    +++ description: None
      issuedPermissions.0.target:
-        "0x86a02dD71363c440b21F4c0E5B2Ad01Ffe1A7482"
+        "0xf7951D92B0C345144506576eC13Ecf5103aC905a"
      issuedPermissions.0.via.1:
+        {"address":"0xf58eA15B20983116c21b05c876cc8e6CDAe5C2b9","delay":0}
      issuedPermissions.0.via.0.address:
-        "0xf58eA15B20983116c21b05c876cc8e6CDAe5C2b9"
+        "0x86a02dD71363c440b21F4c0E5B2Ad01Ffe1A7482"
    }
```

Generated with discovered.json: 0x33afe03e3ef4ffd524b87d9fbf069b24fc3633b7

# Diff at Thu, 21 Nov 2024 11:00:40 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@de1745323b367dd0fbb18ad6c862147dd90e90b0 block: 79276078
- current block number: 79888653

## Description

SC september cohort (6 members) are added/rotated.

## Watched changes

```diff
    contract L2SecurityCouncilEmergency (0xc232ee726E3C51B86778BB4dBe61C52cC07A60F3) {
    +++ description: None
      values.$members.9:
-        "0xf8e1492255d9428c2Fc20A98A1DeB1215C8ffEfd"
+        "0x3E286452b1C66abB08Eb5494c3894F40aB5a59AF"
      values.$members.8:
-        "0x3Bd8e2AC65ad6f0F094BA6766cBd9484AB49eF23"
+        "0x5DD2205C3aac13E592F0a3D85188c948D1781df1"
      values.$members.7:
-        "0xb07dc9103328A51128bC6Cc1049d1137035f5E28"
+        "0x5a09A94eE8198D3c474d723337aa58023810022C"
      values.$members.6:
-        "0x3E286452b1C66abB08Eb5494c3894F40aB5a59AF"
+        "0x70C006fC86A392c16D7E085cefc0Ad1FF7de6C75"
      values.$members.5:
-        "0xb71ca4FFbB7b58d75Ba29891ab45e9Dc12B444Ed"
+        "0x9316ca66f5f936E3239e4fD2AAAEA5C7b6f3C4cC"
      values.$members.4:
-        "0x8F10e3413586c4a8DCfcE19D009872b19e9cd8E3"
+        "0x882c6FCb3D358b9d70B97c6999159cea64168B6F"
      values.$members.3:
-        "0x5DD2205C3aac13E592F0a3D85188c948D1781df1"
+        "0xeA4A4A886aCA47DD0167B4aEE5B1345e18D20Ee5"
      values.$members.2:
-        "0x5a09A94eE8198D3c474d723337aa58023810022C"
+        "0x1716C1C037e4968D5A06d4d080904F9B7a6508f2"
      values.$members.1:
-        "0x70C006fC86A392c16D7E085cefc0Ad1FF7de6C75"
+        "0x33ddb82e68940f0e4C1050885BcE8faF5Ddd1b93"
      values.$members.0:
-        "0x9316ca66f5f936E3239e4fD2AAAEA5C7b6f3C4cC"
+        "0xe2e9d5B97d8C0457B1cf80BC93802bce4DF03e33"
    }
```

Generated with discovered.json: 0xffa05eb2c6df489485d9307a65f2cec154152be5

# Diff at Fri, 01 Nov 2024 15:12:36 GMT:

- author: vincfurc (<10850139+vincfurc@users.noreply.github.com>)
- comparing to: main@cd1f0e71bb08ce16b2084a11b768538e8aa6ba8c block: 78789563
- current block number: 79276078

## Description

Updated member of Security Council.

## Watched changes

```diff
    contract L2SecurityCouncilEmergency (0xc232ee726E3C51B86778BB4dBe61C52cC07A60F3) {
    +++ description: None
      values.$members.1:
-        "0xA821c8c245d1F3A257e3B0DEC99268cA05144422"
+        "0x70C006fC86A392c16D7E085cefc0Ad1FF7de6C75"
      values.$members.0:
-        "0x70C006fC86A392c16D7E085cefc0Ad1FF7de6C75"
+        "0x9316ca66f5f936E3239e4fD2AAAEA5C7b6f3C4cC"
    }
```

Generated with discovered.json: 0x33173eae3aea9bab68cf91f8a03cb57bb9f8da4d

# Diff at Fri, 25 Oct 2024 10:09:24 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@e7501f424c0cea9b5438386ee76e509448999836 block: 77458757
- current block number: 78789563

## Description

Config related.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 77458757 (main branch discovery), not current.

```diff
    contract L2GatewayRouter (0x21903d3F8176b1a0c17E953Cd896610Be9fFDFa8) {
    +++ description: None
      issuedPermissions.0.target:
-        "0xada790b026097BfB36a5ed696859b97a96CEd92C"
+        "0x86a02dD71363c440b21F4c0E5B2Ad01Ffe1A7482"
      issuedPermissions.0.via.0:
+        {"address":"0xada790b026097BfB36a5ed696859b97a96CEd92C","delay":0}
    }
```

```diff
    contract L2WethGateway (0x7626841cB6113412F9c88D3ADC720C9FAC88D9eD) {
    +++ description: None
      issuedPermissions.0.target:
-        "0xada790b026097BfB36a5ed696859b97a96CEd92C"
+        "0x86a02dD71363c440b21F4c0E5B2Ad01Ffe1A7482"
      issuedPermissions.0.via.0:
+        {"address":"0xada790b026097BfB36a5ed696859b97a96CEd92C","delay":0}
    }
```

```diff
    contract L2UpgradeExecutor (0x86a02dD71363c440b21F4c0E5B2Ad01Ffe1A7482) {
    +++ description: None
      receivedPermissions.5:
+        {"permission":"upgrade","target":"0xf823C3cD3CeBE0a1fA952ba88Dc9EEf8e0Bf46AD","via":[{"address":"0xf58eA15B20983116c21b05c876cc8e6CDAe5C2b9"}]}
      receivedPermissions.4:
+        {"permission":"upgrade","target":"0xcF9bAb7e53DDe48A6DC4f286CB14e05298799257","via":[{"address":"0xada790b026097BfB36a5ed696859b97a96CEd92C"}]}
      receivedPermissions.3:
+        {"permission":"upgrade","target":"0xbf544970E6BD77b21C6492C281AB60d0770451F4","via":[{"address":"0xada790b026097BfB36a5ed696859b97a96CEd92C"}]}
      receivedPermissions.2:
+        {"permission":"upgrade","target":"0x86a02dD71363c440b21F4c0E5B2Ad01Ffe1A7482","via":[{"address":"0xf58eA15B20983116c21b05c876cc8e6CDAe5C2b9"}]}
      receivedPermissions.1.target:
-        "0xf823C3cD3CeBE0a1fA952ba88Dc9EEf8e0Bf46AD"
+        "0x7626841cB6113412F9c88D3ADC720C9FAC88D9eD"
      receivedPermissions.1.via.0.address:
-        "0xf58eA15B20983116c21b05c876cc8e6CDAe5C2b9"
+        "0xada790b026097BfB36a5ed696859b97a96CEd92C"
      receivedPermissions.0.target:
-        "0x86a02dD71363c440b21F4c0E5B2Ad01Ffe1A7482"
+        "0x21903d3F8176b1a0c17E953Cd896610Be9fFDFa8"
      receivedPermissions.0.via.0.address:
-        "0xf58eA15B20983116c21b05c876cc8e6CDAe5C2b9"
+        "0xada790b026097BfB36a5ed696859b97a96CEd92C"
      directlyReceivedPermissions.2:
+        {"permission":"act","target":"0xf58eA15B20983116c21b05c876cc8e6CDAe5C2b9"}
      directlyReceivedPermissions.1.target:
-        "0xf58eA15B20983116c21b05c876cc8e6CDAe5C2b9"
+        "0xc232ee726E3C51B86778BB4dBe61C52cC07A60F3"
      directlyReceivedPermissions.0.target:
-        "0xc232ee726E3C51B86778BB4dBe61C52cC07A60F3"
+        "0xada790b026097BfB36a5ed696859b97a96CEd92C"
    }
```

```diff
    contract L2GatewaysProxyAdmin (0xada790b026097BfB36a5ed696859b97a96CEd92C) {
    +++ description: None
      receivedPermissions:
-        [{"permission":"upgrade","target":"0x21903d3F8176b1a0c17E953Cd896610Be9fFDFa8"},{"permission":"upgrade","target":"0x7626841cB6113412F9c88D3ADC720C9FAC88D9eD"},{"permission":"upgrade","target":"0xbf544970E6BD77b21C6492C281AB60d0770451F4"},{"permission":"upgrade","target":"0xcF9bAb7e53DDe48A6DC4f286CB14e05298799257"}]
      template:
+        "global/ProxyAdmin"
      directlyReceivedPermissions:
+        [{"permission":"upgrade","target":"0x21903d3F8176b1a0c17E953Cd896610Be9fFDFa8"},{"permission":"upgrade","target":"0x7626841cB6113412F9c88D3ADC720C9FAC88D9eD"},{"permission":"upgrade","target":"0xbf544970E6BD77b21C6492C281AB60d0770451F4"},{"permission":"upgrade","target":"0xcF9bAb7e53DDe48A6DC4f286CB14e05298799257"}]
    }
```

```diff
    contract L2ARBGateway (0xbf544970E6BD77b21C6492C281AB60d0770451F4) {
    +++ description: None
      issuedPermissions.0.target:
-        "0xada790b026097BfB36a5ed696859b97a96CEd92C"
+        "0x86a02dD71363c440b21F4c0E5B2Ad01Ffe1A7482"
      issuedPermissions.0.via.0:
+        {"address":"0xada790b026097BfB36a5ed696859b97a96CEd92C","delay":0}
    }
```

```diff
    contract L2ERC20Gateway (0xcF9bAb7e53DDe48A6DC4f286CB14e05298799257) {
    +++ description: None
      issuedPermissions.0.target:
-        "0xada790b026097BfB36a5ed696859b97a96CEd92C"
+        "0x86a02dD71363c440b21F4c0E5B2Ad01Ffe1A7482"
      issuedPermissions.0.via.0:
+        {"address":"0xada790b026097BfB36a5ed696859b97a96CEd92C","delay":0}
    }
```

Generated with discovered.json: 0x61b0e61d8c773f7bdf5cd2f5500c2475b9533ec2

# Diff at Mon, 21 Oct 2024 11:15:23 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@8895d33866f5665c4c710f4ddaa32bfa63cc3c78 block: 77458757
- current block number: 77458757

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 77458757 (main branch discovery), not current.

```diff
    contract L2GatewayRouter (0x21903d3F8176b1a0c17E953Cd896610Be9fFDFa8) {
    +++ description: None
      values.$pastUpgrades.1.2:
+        ["0x8f377770289863DF73Fe665B74460579F82321fb"]
      values.$pastUpgrades.1.1:
-        ["0x8f377770289863DF73Fe665B74460579F82321fb"]
+        "0x9549dff9595eda9d452479b4ccc2092d2dd01a12f3c2db8165bec365d54128f1"
      values.$pastUpgrades.0.2:
+        ["0x09854610F48462a7029fF192FA0AfB7F00133F54"]
      values.$pastUpgrades.0.1:
-        ["0x09854610F48462a7029fF192FA0AfB7F00133F54"]
+        "0xf3cdbd24cf85ce120e1846c278011da74771b6063423bf0cdccf8d9ab497dc88"
    }
```

```diff
    contract L2WethGateway (0x7626841cB6113412F9c88D3ADC720C9FAC88D9eD) {
    +++ description: None
      values.$pastUpgrades.3.2:
+        ["0xbe04Ab2728c924D678f9FC833E379688c6eFA317"]
      values.$pastUpgrades.3.1:
-        ["0xbe04Ab2728c924D678f9FC833E379688c6eFA317"]
+        "0x66547238f43682dabc33c021b70f02ffdb62510399f42a174b43498c8065cff6"
      values.$pastUpgrades.2.2:
+        ["0x190C993Db842097df8b8d71c910f1802df0724C3"]
      values.$pastUpgrades.2.1:
-        ["0x190C993Db842097df8b8d71c910f1802df0724C3"]
+        "0x9ce025df640cca593a80fdad6d1f9e6f4ba8b226f9b296cc83c247f50407bea3"
      values.$pastUpgrades.1.2:
+        ["0x190C993Db842097df8b8d71c910f1802df0724C3"]
      values.$pastUpgrades.1.1:
-        ["0x190C993Db842097df8b8d71c910f1802df0724C3"]
+        "0x20a549a861bb33f3fe522e14752416f2aebdb31747987b8bcc0ae81ecb36b3d5"
      values.$pastUpgrades.0.2:
+        ["0x3525f734fcE1a26a6CEffFca43538290DC239771"]
      values.$pastUpgrades.0.1:
-        ["0x3525f734fcE1a26a6CEffFca43538290DC239771"]
+        "0x33df4b772bad38d87a6d0d5a9af01ff0c98ea3296c40e03d9aa02b381a17cc0a"
    }
```

```diff
    contract L2UpgradeExecutor (0x86a02dD71363c440b21F4c0E5B2Ad01Ffe1A7482) {
    +++ description: None
      values.$pastUpgrades.0.2:
+        ["0x3096EAEdcb3A3B665552660F4d921E565D0073cB"]
      values.$pastUpgrades.0.1:
-        ["0x3096EAEdcb3A3B665552660F4d921E565D0073cB"]
+        "0xdf073ab55f4ee86b52d0a511575cc76e5abb5e65e36c23a9fe4f685bb620d807"
    }
```

```diff
    contract L2ARBGateway (0xbf544970E6BD77b21C6492C281AB60d0770451F4) {
    +++ description: None
      values.$pastUpgrades.2.2:
+        ["0x554e12DBAa0fBeB8A35583a6Fd9D04BaA4ff597f"]
      values.$pastUpgrades.2.1:
-        ["0x554e12DBAa0fBeB8A35583a6Fd9D04BaA4ff597f"]
+        "0x9403cf26146890250477d83eb73c08632c9af62a1e0f315a4b9b7c63425fc0e9"
      values.$pastUpgrades.1.2:
+        ["0x6e04b9dd87CF2cD3b7D81C50D2DF72d24BC0Cc4C"]
      values.$pastUpgrades.1.1:
-        ["0x6e04b9dd87CF2cD3b7D81C50D2DF72d24BC0Cc4C"]
+        "0x4dcb9401328656bb4021741be0324b07a940682e28fd1b8ee45086c446f8ed13"
      values.$pastUpgrades.0.2:
+        ["0xb1d943d67b793D61F08b5F536AC591a057306fe5"]
      values.$pastUpgrades.0.1:
-        ["0xb1d943d67b793D61F08b5F536AC591a057306fe5"]
+        "0xe0b217581754ec4ddf4385d876eedc76afcc5d70c4a394f1ea8515f3026cb43b"
    }
```

```diff
    contract L2ERC20Gateway (0xcF9bAb7e53DDe48A6DC4f286CB14e05298799257) {
    +++ description: None
      values.$pastUpgrades.1.2:
+        ["0x466155FD6d8BbF1c0d5ca32818814cB28b6884d8"]
      values.$pastUpgrades.1.1:
-        ["0x466155FD6d8BbF1c0d5ca32818814cB28b6884d8"]
+        "0xe2ffd6f2c673a1b13f5f1614220aaeb30a62b15bab84197be67798ed00d68a1c"
      values.$pastUpgrades.0.2:
+        ["0xEa2562667c98Bfe329995616454BeA9ea3290D1C"]
      values.$pastUpgrades.0.1:
-        ["0xEa2562667c98Bfe329995616454BeA9ea3290D1C"]
+        "0x46c2f44cccae09860a903d1d11fa5ccff5694b7999f804ba089a1e020b8a95cc"
    }
```

```diff
    contract L2ArbitrumToken (0xf823C3cD3CeBE0a1fA952ba88Dc9EEf8e0Bf46AD) {
    +++ description: None
      values.$pastUpgrades.0.2:
+        ["0x099bC495EA4Fd828FEe7C636F0Ab84d0f501B96d"]
      values.$pastUpgrades.0.1:
-        ["0x099bC495EA4Fd828FEe7C636F0Ab84d0f501B96d"]
+        "0xad05f83f9215726a10ae715f735d274f9f7bee5de714f924f450c55c111dfa40"
    }
```

Generated with discovered.json: 0xd496408ec01a087822664bb77d492c1f7662979a

# Diff at Fri, 18 Oct 2024 11:05:16 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@0295165a89d86b7450439f24f100d1baa74381fc block: 77458757
- current block number: 77458757

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 77458757 (main branch discovery), not current.

```diff
    contract L2UpgradeExecutor (0x86a02dD71363c440b21F4c0E5B2Ad01Ffe1A7482) {
    +++ description: None
      directlyReceivedPermissions.1:
+        {"permission":"act","target":"0xf58eA15B20983116c21b05c876cc8e6CDAe5C2b9"}
      directlyReceivedPermissions.0.target:
-        "0xf58eA15B20983116c21b05c876cc8e6CDAe5C2b9"
+        "0xc232ee726E3C51B86778BB4dBe61C52cC07A60F3"
    }
```

Generated with discovered.json: 0xb1ee81c4ae8e355aa68f41d4967d420a2e3d4b10

# Diff at Mon, 14 Oct 2024 11:00:39 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@1afc77ff111ceb0970e7d09efcc7b2f376b0c281 block: 77458757
- current block number: 77458757

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 77458757 (main branch discovery), not current.

```diff
    contract L2GatewayRouter (0x21903d3F8176b1a0c17E953Cd896610Be9fFDFa8) {
    +++ description: None
      sourceHashes:
+        ["0xa7e3f6c355703ed46fcb2156862c4f01792b87beb10a87a81ce3bd5beee79b67","0x6b2f9c454049196975edab9674208890663911ceebf0cf2c64d3c26a32aa300c"]
    }
```

```diff
    contract ArbChildToParentRewardRouter (0x36D0170D92F66e8949eB276C3AC4FEA64f83704d) {
    +++ description: None
      sourceHashes:
+        ["0x7669580cf030c30616b8c07b718aa9b47cda51ea4a14330966b1593f3e646832"]
    }
```

```diff
    contract GnosisSafeL2 (0x41C327d5fc9e29680CcD45e5E52446E0DB3DAdFd) {
    +++ description: None
      sourceHashes:
+        ["0xfe0725afd3cf2e5fb7627005a6bcf13ef7e35f78034eed2211edbffdb6a9aab5","0x59fe14e95a8aa7f52213f18bae5c9329cf583a7ba31194698b15eddb97d5e825"]
    }
```

```diff
    contract L2SurplusFee (0x509386DbF5C0BE6fd68Df97A05fdB375136c32De) {
    +++ description: None
      sourceHashes:
+        ["0xef8d56213b60d676b88afce25cb17bb89c7c3fc10c4ec06f77fe4820529e409b"]
    }
```

```diff
    contract StandardArbERC20 (0x53923A0d1f4805463584c91b2E55d6c600A94E91) {
    +++ description: None
      sourceHashes:
+        ["0xf98882c836bb8026b07fe0c6af0e5fc52578e78078c523fcd7974fb69b833732"]
    }
```

```diff
    contract L2WethGateway (0x7626841cB6113412F9c88D3ADC720C9FAC88D9eD) {
    +++ description: None
      sourceHashes:
+        ["0xa7e3f6c355703ed46fcb2156862c4f01792b87beb10a87a81ce3bd5beee79b67","0xadf7f548448c8cfc2273cb5feeb31bcdd088e2d60e9be8756da94535ef5667d7"]
    }
```

```diff
    contract L2UpgradeExecutor (0x86a02dD71363c440b21F4c0E5B2Ad01Ffe1A7482) {
    +++ description: None
      issuedPermissions.0.target:
-        "0xf58eA15B20983116c21b05c876cc8e6CDAe5C2b9"
+        "0x86a02dD71363c440b21F4c0E5B2Ad01Ffe1A7482"
      issuedPermissions.0.via.0:
+        {"address":"0xf58eA15B20983116c21b05c876cc8e6CDAe5C2b9","delay":0}
      sourceHashes:
+        ["0xd87f004d37330210f1eb137e4498b14ba6340f079eaa0e9e7a22c1d4f76dde7d","0x17d2fa21e1bf7dff5e335a08bb2b6b996e34c00b1175c3711875720dde509401"]
      receivedPermissions:
+        [{"permission":"upgrade","target":"0x86a02dD71363c440b21F4c0E5B2Ad01Ffe1A7482","via":[{"address":"0xf58eA15B20983116c21b05c876cc8e6CDAe5C2b9"}]},{"permission":"upgrade","target":"0xf823C3cD3CeBE0a1fA952ba88Dc9EEf8e0Bf46AD","via":[{"address":"0xf58eA15B20983116c21b05c876cc8e6CDAe5C2b9"}]}]
      directlyReceivedPermissions:
+        [{"permission":"act","target":"0xf58eA15B20983116c21b05c876cc8e6CDAe5C2b9"}]
    }
```

```diff
    contract L2BaseFee (0x9fCB6F75D99029f28F6F4a1d277bae49c5CAC79f) {
    +++ description: None
      sourceHashes:
+        ["0xef8d56213b60d676b88afce25cb17bb89c7c3fc10c4ec06f77fe4820529e409b"]
    }
```

```diff
    contract L2GatewaysProxyAdmin (0xada790b026097BfB36a5ed696859b97a96CEd92C) {
    +++ description: None
      sourceHashes:
+        ["0xf944f88083f41ff959fefbdcd6fc3ae633692b072b8497fb14cbdd843eded490"]
    }
```

```diff
    contract L2ARBGateway (0xbf544970E6BD77b21C6492C281AB60d0770451F4) {
    +++ description: None
      sourceHashes:
+        ["0xa7e3f6c355703ed46fcb2156862c4f01792b87beb10a87a81ce3bd5beee79b67","0x1cb12c4c632180beb2db8907c85d74522ccc8f18edc0626818bedf7229297333"]
    }
```

```diff
    contract L2SecurityCouncilEmergency (0xc232ee726E3C51B86778BB4dBe61C52cC07A60F3) {
    +++ description: None
      sourceHashes:
+        ["0xfe0725afd3cf2e5fb7627005a6bcf13ef7e35f78034eed2211edbffdb6a9aab5","0x59fe14e95a8aa7f52213f18bae5c9329cf583a7ba31194698b15eddb97d5e825"]
    }
```

```diff
    contract L2ERC20Gateway (0xcF9bAb7e53DDe48A6DC4f286CB14e05298799257) {
    +++ description: None
      sourceHashes:
+        ["0xa7e3f6c355703ed46fcb2156862c4f01792b87beb10a87a81ce3bd5beee79b67","0x7ab56232b17ce06beb4a64963bb9e8d0c7fdef3c45ab8f1ae306699d7b80c637"]
    }
```

```diff
    contract GnosisSafeL2 (0xD0749b3e537Ed52DE4e6a3Ae1eB6fc26059d0895) {
    +++ description: None
      sourceHashes:
+        ["0xfe0725afd3cf2e5fb7627005a6bcf13ef7e35f78034eed2211edbffdb6a9aab5","0x59fe14e95a8aa7f52213f18bae5c9329cf583a7ba31194698b15eddb97d5e825"]
    }
```

```diff
    contract UpgradeableBeacon (0xd31Ed16a8CeCe0A5070AC26024674eB680E3e639) {
    +++ description: None
      sourceHashes:
+        ["0xf43827aa5935222c477d6cd1888896ff1336e4c0b2991e05d75ac9bbe6c41236"]
    }
```

```diff
    contract BeaconProxyFactory (0xD9D66e55227c7558f0dB52adD059057Eb9bd90a3) {
    +++ description: None
      sourceHashes:
+        ["0x4522be863ce454f4a528c27299d26dc69d407f11e5807129aaff93f36b44dd53"]
    }
```

```diff
    contract L2ProxyAdmin (0xf58eA15B20983116c21b05c876cc8e6CDAe5C2b9) {
    +++ description: None
      receivedPermissions:
-        [{"permission":"upgrade","target":"0x86a02dD71363c440b21F4c0E5B2Ad01Ffe1A7482"},{"permission":"upgrade","target":"0xf823C3cD3CeBE0a1fA952ba88Dc9EEf8e0Bf46AD"}]
      template:
+        "global/ProxyAdmin"
      sourceHashes:
+        ["0xae641c7d7a83bba7fa913b9544f946dc23ca0527c2f4abb9c6a3496f49375218"]
      directlyReceivedPermissions:
+        [{"permission":"upgrade","target":"0x86a02dD71363c440b21F4c0E5B2Ad01Ffe1A7482"},{"permission":"upgrade","target":"0xf823C3cD3CeBE0a1fA952ba88Dc9EEf8e0Bf46AD"}]
    }
```

```diff
    contract L2ArbitrumToken (0xf823C3cD3CeBE0a1fA952ba88Dc9EEf8e0Bf46AD) {
    +++ description: None
      issuedPermissions.0.target:
-        "0xf58eA15B20983116c21b05c876cc8e6CDAe5C2b9"
+        "0x86a02dD71363c440b21F4c0E5B2Ad01Ffe1A7482"
      issuedPermissions.0.via.0:
+        {"address":"0xf58eA15B20983116c21b05c876cc8e6CDAe5C2b9","delay":0}
      sourceHashes:
+        ["0xd87f004d37330210f1eb137e4498b14ba6340f079eaa0e9e7a22c1d4f76dde7d","0x8ae72d766dbd9972974ea5cbde4207e80bf11dbc3426b277d41544d2639371f9"]
    }
```

Generated with discovered.json: 0xfd114aea5cefc6d78beca95054cdbf1d08805327

# Diff at Tue, 01 Oct 2024 11:14:09 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@bd754dc73c66120164006054f8d25c5fae9cd910 block: 75517853
- current block number: 75517853

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 75517853 (main branch discovery), not current.

```diff
    contract L2GatewayRouter (0x21903d3F8176b1a0c17E953Cd896610Be9fFDFa8) {
    +++ description: None
      values.$pastUpgrades:
+        [["2022-06-27T06:57:53.000Z",["0x09854610F48462a7029fF192FA0AfB7F00133F54"]],["2022-08-08T17:57:32.000Z",["0x8f377770289863DF73Fe665B74460579F82321fb"]]]
    }
```

```diff
    contract L2WethGateway (0x7626841cB6113412F9c88D3ADC720C9FAC88D9eD) {
    +++ description: None
      values.$pastUpgrades:
+        [["2022-06-27T07:27:43.000Z",["0x3525f734fcE1a26a6CEffFca43538290DC239771"]],["2022-08-08T17:59:07.000Z",["0x190C993Db842097df8b8d71c910f1802df0724C3"]],["2023-02-10T03:19:59.000Z",["0x190C993Db842097df8b8d71c910f1802df0724C3"]],["2023-02-10T18:07:59.000Z",["0xbe04Ab2728c924D678f9FC833E379688c6eFA317"]]]
    }
```

```diff
    contract L2UpgradeExecutor (0x86a02dD71363c440b21F4c0E5B2Ad01Ffe1A7482) {
    +++ description: None
      values.$pastUpgrades:
+        [["2023-03-16T12:08:03.000Z",["0x3096EAEdcb3A3B665552660F4d921E565D0073cB"]]]
    }
```

```diff
    contract L2ARBGateway (0xbf544970E6BD77b21C6492C281AB60d0770451F4) {
    +++ description: None
      values.$pastUpgrades:
+        [["2022-06-27T06:58:04.000Z",["0xb1d943d67b793D61F08b5F536AC591a057306fe5"]],["2022-08-08T17:58:06.000Z",["0x6e04b9dd87CF2cD3b7D81C50D2DF72d24BC0Cc4C"]],["2022-12-06T01:54:51.000Z",["0x554e12DBAa0fBeB8A35583a6Fd9D04BaA4ff597f"]]]
    }
```

```diff
    contract L2ERC20Gateway (0xcF9bAb7e53DDe48A6DC4f286CB14e05298799257) {
    +++ description: None
      values.$pastUpgrades:
+        [["2022-06-27T06:57:59.000Z",["0xEa2562667c98Bfe329995616454BeA9ea3290D1C"]],["2022-08-08T17:57:48.000Z",["0x466155FD6d8BbF1c0d5ca32818814cB28b6884d8"]]]
    }
```

```diff
    contract L2ArbitrumToken (0xf823C3cD3CeBE0a1fA952ba88Dc9EEf8e0Bf46AD) {
    +++ description: None
      values.$pastUpgrades:
+        [["2023-03-16T12:08:15.000Z",["0x099bC495EA4Fd828FEe7C636F0Ab84d0f501B96d"]]]
    }
```

Generated with discovered.json: 0x725318d87ea1063fd83db489d27cea82908e4362

# Diff at Mon, 02 Sep 2024 08:41:14 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@8fcb30f6c613b5454aa9ecdec05a118442e9dc7b block: 75424833
- current block number: 75517853

## Description

Config related.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 75424833 (main branch discovery), not current.

```diff
    contract L2GatewaysProxyAdmin (0xada790b026097BfB36a5ed696859b97a96CEd92C) {
    +++ description: None
      receivedPermissions.3.via:
-        []
      receivedPermissions.2.via:
-        []
      receivedPermissions.1.via:
-        []
      receivedPermissions.0.via:
-        []
    }
```

```diff
    contract L2ProxyAdmin (0xf58eA15B20983116c21b05c876cc8e6CDAe5C2b9) {
    +++ description: None
      receivedPermissions.1.via:
-        []
      receivedPermissions.0.via:
-        []
    }
```

Generated with discovered.json: 0xfd77969411227d59e52c9c8902751ee479e47aad

# Diff at Wed, 28 Aug 2024 15:10:30 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@0fa673a678e6e769a295956285789968836b97a6 block: 74799516
- current block number: 75424833

## Description

As discussed [in the AIP](https://forum.arbitrum.foundation/t/aip-nova-fee-router-proposal-arbos-30/23310), this upgrade routes the L2Base and L2Surplus fees via L1 to the Arbitrum treasury on Arbitrum One.

Added discovery for the fee recipients.

## Watched changes

```diff
    contract L2SurplusFee (0x509386DbF5C0BE6fd68Df97A05fdB375136c32De) {
    +++ description: None
      values.currentRecipientGroup:
-        "0xa4d6665ee2121503a4513275116c9cda5eaac3a8b759ff4c41fb4cc089f0b338"
+        "0xf282fbf81236cb85617464bf2345689bad849c6122d8725eeef1a4cf78e8d9a3"
+++ description: Lists recipients and weights using events, while the latest represents the current state.
      values.recipientsData.1:
+        {"recipients":["0x36D0170D92F66e8949eB276C3AC4FEA64f83704d"],"weights":[10000]}
    }
```

```diff
    contract L2BaseFee (0x9fCB6F75D99029f28F6F4a1d277bae49c5CAC79f) {
    +++ description: None
      values.currentRecipientGroup:
-        "0x2c40b8c2309d10d43a712b6df564ebd140153dcfe8428552d24aa294a8b34107"
+        "0xc21cdeb0278022eeb6305048d7d033ce165b518e371bc91c58b76175e4f7fc2b"
+++ description: Lists recipients and weights using events, while the latest represents the current state.
      values.recipientsData.1:
+        {"recipients":["0x36D0170D92F66e8949eB276C3AC4FEA64f83704d","0xD0749b3e537Ed52DE4e6a3Ae1eB6fc26059d0895","0x41C327d5fc9e29680CcD45e5E52446E0DB3DAdFd","0x02C2599aa929e2509741b44F3a13029745aB1AB2","0xA221f29236996BDEfA5C585acdD407Ec84D78447","0x0fB1f1a31429F1A90a19Ab5486a6DFb384179641","0xb814441ed86e98e8B83d31eEC095e4a5A36Fc3c2"],"weights":[8000,375,373,373,373,373,133]}
    }
```

```diff
+   Status: CREATED
    contract ArbChildToParentRewardRouter (0x36D0170D92F66e8949eB276C3AC4FEA64f83704d)
    +++ description: None
```

## Source code changes

```diff
.../nova/.flat/ArbChildToParentRewardRouter.sol    | 476 +++++++++++++++++++++
 1 file changed, 476 insertions(+)
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 74799516 (main branch discovery), not current.

```diff
    contract L2SurplusFee (0x509386DbF5C0BE6fd68Df97A05fdB375136c32De) {
    +++ description: None
+++ description: Lists recipients and weights using events, while the latest represents the current state.
      values.recipientsData:
+        [{"recipients":["0xf7951D92B0C345144506576eC13Ecf5103aC905a"],"weights":[10000]}]
      fieldMeta:
+        {"recipientsData":{"description":"Lists recipients and weights using events, while the latest represents the current state."}}
    }
```

```diff
    contract L2BaseFee (0x9fCB6F75D99029f28F6F4a1d277bae49c5CAC79f) {
    +++ description: None
+++ description: Lists recipients and weights using events, while the latest represents the current state.
      values.recipientsData:
+        [{"recipients":["0xf7951D92B0C345144506576eC13Ecf5103aC905a","0xD0749b3e537Ed52DE4e6a3Ae1eB6fc26059d0895","0x41C327d5fc9e29680CcD45e5E52446E0DB3DAdFd","0x02C2599aa929e2509741b44F3a13029745aB1AB2","0xA221f29236996BDEfA5C585acdD407Ec84D78447","0x0fB1f1a31429F1A90a19Ab5486a6DFb384179641","0xb814441ed86e98e8B83d31eEC095e4a5A36Fc3c2"],"weights":[8000,375,373,373,373,373,133]}]
      fieldMeta:
+        {"recipientsData":{"description":"Lists recipients and weights using events, while the latest represents the current state."}}
    }
```

```diff
+   Status: CREATED
    contract GnosisSafeL2 (0x41C327d5fc9e29680CcD45e5E52446E0DB3DAdFd)
    +++ description: None
```

```diff
+   Status: CREATED
    contract GnosisSafeL2 (0xD0749b3e537Ed52DE4e6a3Ae1eB6fc26059d0895)
    +++ description: None
```

Generated with discovered.json: 0x026698efaae49a4d42eda5d1a5a694297eed99b6

# Diff at Fri, 23 Aug 2024 09:58:46 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@67597c7d6c810bc726594446890178150240711e block: 74799516
- current block number: 74799516

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 74799516 (main branch discovery), not current.

```diff
    contract L2GatewayRouter (0x21903d3F8176b1a0c17E953Cd896610Be9fFDFa8) {
    +++ description: None
      values.$upgradeCount:
+        2
    }
```

```diff
    contract L2WethGateway (0x7626841cB6113412F9c88D3ADC720C9FAC88D9eD) {
    +++ description: None
      values.$upgradeCount:
+        4
    }
```

```diff
    contract L2UpgradeExecutor (0x86a02dD71363c440b21F4c0E5B2Ad01Ffe1A7482) {
    +++ description: None
      values.$upgradeCount:
+        1
    }
```

```diff
    contract L2ARBGateway (0xbf544970E6BD77b21C6492C281AB60d0770451F4) {
    +++ description: None
      values.$upgradeCount:
+        3
    }
```

```diff
    contract L2ERC20Gateway (0xcF9bAb7e53DDe48A6DC4f286CB14e05298799257) {
    +++ description: None
      values.$upgradeCount:
+        2
    }
```

```diff
    contract L2ArbitrumToken (0xf823C3cD3CeBE0a1fA952ba88Dc9EEf8e0Bf46AD) {
    +++ description: None
      values.$upgradeCount:
+        1
    }
```

Generated with discovered.json: 0x1e865b081ae568f6f660461d15aa8f7e8934245a

# Diff at Wed, 21 Aug 2024 10:08:42 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@2f6dde3357bf5d79196b6e94f79d853a6c4ec72b block: 74799516
- current block number: 74799516

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 74799516 (main branch discovery), not current.

```diff
    contract L2GatewayRouter (0x21903d3F8176b1a0c17E953Cd896610Be9fFDFa8) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0xada790b026097BfB36a5ed696859b97a96CEd92C","via":[]}]
    }
```

```diff
    contract L2WethGateway (0x7626841cB6113412F9c88D3ADC720C9FAC88D9eD) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0xada790b026097BfB36a5ed696859b97a96CEd92C","via":[]}]
    }
```

```diff
    contract L2UpgradeExecutor (0x86a02dD71363c440b21F4c0E5B2Ad01Ffe1A7482) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0xf58eA15B20983116c21b05c876cc8e6CDAe5C2b9","via":[]}]
    }
```

```diff
    contract L2GatewaysProxyAdmin (0xada790b026097BfB36a5ed696859b97a96CEd92C) {
    +++ description: None
      assignedPermissions:
-        {"upgrade":["0x21903d3F8176b1a0c17E953Cd896610Be9fFDFa8","0x7626841cB6113412F9c88D3ADC720C9FAC88D9eD","0xbf544970E6BD77b21C6492C281AB60d0770451F4","0xcF9bAb7e53DDe48A6DC4f286CB14e05298799257"]}
      receivedPermissions:
+        [{"permission":"upgrade","target":"0x21903d3F8176b1a0c17E953Cd896610Be9fFDFa8","via":[]},{"permission":"upgrade","target":"0x7626841cB6113412F9c88D3ADC720C9FAC88D9eD","via":[]},{"permission":"upgrade","target":"0xbf544970E6BD77b21C6492C281AB60d0770451F4","via":[]},{"permission":"upgrade","target":"0xcF9bAb7e53DDe48A6DC4f286CB14e05298799257","via":[]}]
    }
```

```diff
    contract L2ARBGateway (0xbf544970E6BD77b21C6492C281AB60d0770451F4) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0xada790b026097BfB36a5ed696859b97a96CEd92C","via":[]}]
    }
```

```diff
    contract L2ERC20Gateway (0xcF9bAb7e53DDe48A6DC4f286CB14e05298799257) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0xada790b026097BfB36a5ed696859b97a96CEd92C","via":[]}]
    }
```

```diff
    contract L2ProxyAdmin (0xf58eA15B20983116c21b05c876cc8e6CDAe5C2b9) {
    +++ description: None
      assignedPermissions:
-        {"upgrade":["0x86a02dD71363c440b21F4c0E5B2Ad01Ffe1A7482","0xf823C3cD3CeBE0a1fA952ba88Dc9EEf8e0Bf46AD"]}
      receivedPermissions:
+        [{"permission":"upgrade","target":"0x86a02dD71363c440b21F4c0E5B2Ad01Ffe1A7482","via":[]},{"permission":"upgrade","target":"0xf823C3cD3CeBE0a1fA952ba88Dc9EEf8e0Bf46AD","via":[]}]
    }
```

```diff
    contract L2ArbitrumToken (0xf823C3cD3CeBE0a1fA952ba88Dc9EEf8e0Bf46AD) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0xf58eA15B20983116c21b05c876cc8e6CDAe5C2b9","via":[]}]
    }
```

Generated with discovered.json: 0x746d02ca9d79f0cecb2b59531037a0e814f67c08

# Diff at Fri, 09 Aug 2024 12:04:50 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@bf40aa32f030fd312056ca0ef198c8550467d1d7 block: 74799516
- current block number: 74799516

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 74799516 (main branch discovery), not current.

```diff
    contract L2GatewaysProxyAdmin (0xada790b026097BfB36a5ed696859b97a96CEd92C) {
    +++ description: None
      assignedPermissions.upgrade.1:
-        "0x21903d3F8176b1a0c17E953Cd896610Be9fFDFa8"
+        "0x7626841cB6113412F9c88D3ADC720C9FAC88D9eD"
      assignedPermissions.upgrade.0:
-        "0x7626841cB6113412F9c88D3ADC720C9FAC88D9eD"
+        "0x21903d3F8176b1a0c17E953Cd896610Be9fFDFa8"
    }
```

```diff
    contract L2ProxyAdmin (0xf58eA15B20983116c21b05c876cc8e6CDAe5C2b9) {
    +++ description: None
      assignedPermissions.upgrade.1:
-        "0x86a02dD71363c440b21F4c0E5B2Ad01Ffe1A7482"
+        "0xf823C3cD3CeBE0a1fA952ba88Dc9EEf8e0Bf46AD"
      assignedPermissions.upgrade.0:
-        "0xf823C3cD3CeBE0a1fA952ba88Dc9EEf8e0Bf46AD"
+        "0x86a02dD71363c440b21F4c0E5B2Ad01Ffe1A7482"
    }
```

Generated with discovered.json: 0xa253063ed3e83fcb3ea74d643fb95c0abf6d3ea0

# Diff at Fri, 09 Aug 2024 10:14:49 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@1f0da1d0aab7bc6b3b5e54e7e93480bd98e57035 block: 74799516
- current block number: 74799516

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 74799516 (main branch discovery), not current.

```diff
    contract L2GatewaysProxyAdmin (0xada790b026097BfB36a5ed696859b97a96CEd92C) {
    +++ description: None
      assignedPermissions.admin:
-        ["0x21903d3F8176b1a0c17E953Cd896610Be9fFDFa8","0x7626841cB6113412F9c88D3ADC720C9FAC88D9eD","0xbf544970E6BD77b21C6492C281AB60d0770451F4","0xcF9bAb7e53DDe48A6DC4f286CB14e05298799257"]
      assignedPermissions.upgrade:
+        ["0x7626841cB6113412F9c88D3ADC720C9FAC88D9eD","0x21903d3F8176b1a0c17E953Cd896610Be9fFDFa8","0xbf544970E6BD77b21C6492C281AB60d0770451F4","0xcF9bAb7e53DDe48A6DC4f286CB14e05298799257"]
    }
```

```diff
    contract L2SecurityCouncilEmergency (0xc232ee726E3C51B86778BB4dBe61C52cC07A60F3) {
    +++ description: None
      values.$multisigThreshold:
-        "9 of 12 (75%)"
      values.getOwners:
-        ["0x70C006fC86A392c16D7E085cefc0Ad1FF7de6C75","0xA821c8c245d1F3A257e3B0DEC99268cA05144422","0x5a09A94eE8198D3c474d723337aa58023810022C","0x5DD2205C3aac13E592F0a3D85188c948D1781df1","0x8F10e3413586c4a8DCfcE19D009872b19e9cd8E3","0xb71ca4FFbB7b58d75Ba29891ab45e9Dc12B444Ed","0x3E286452b1C66abB08Eb5494c3894F40aB5a59AF","0xb07dc9103328A51128bC6Cc1049d1137035f5E28","0x3Bd8e2AC65ad6f0F094BA6766cBd9484AB49eF23","0xf8e1492255d9428c2Fc20A98A1DeB1215C8ffEfd","0x0275b3D54a5dDbf8205A75984796eFE8b7357Bae","0x475816ca2a31D601B4e336f5c2418A67978aBf09"]
      values.getThreshold:
-        9
      values.$members:
+        ["0x70C006fC86A392c16D7E085cefc0Ad1FF7de6C75","0xA821c8c245d1F3A257e3B0DEC99268cA05144422","0x5a09A94eE8198D3c474d723337aa58023810022C","0x5DD2205C3aac13E592F0a3D85188c948D1781df1","0x8F10e3413586c4a8DCfcE19D009872b19e9cd8E3","0xb71ca4FFbB7b58d75Ba29891ab45e9Dc12B444Ed","0x3E286452b1C66abB08Eb5494c3894F40aB5a59AF","0xb07dc9103328A51128bC6Cc1049d1137035f5E28","0x3Bd8e2AC65ad6f0F094BA6766cBd9484AB49eF23","0xf8e1492255d9428c2Fc20A98A1DeB1215C8ffEfd","0x0275b3D54a5dDbf8205A75984796eFE8b7357Bae","0x475816ca2a31D601B4e336f5c2418A67978aBf09"]
      values.$threshold:
+        9
      values.multisigThreshold:
+        "9 of 12 (75%)"
    }
```

```diff
    contract L2ProxyAdmin (0xf58eA15B20983116c21b05c876cc8e6CDAe5C2b9) {
    +++ description: None
      assignedPermissions.admin:
-        ["0x86a02dD71363c440b21F4c0E5B2Ad01Ffe1A7482","0xf823C3cD3CeBE0a1fA952ba88Dc9EEf8e0Bf46AD"]
      assignedPermissions.upgrade:
+        ["0xf823C3cD3CeBE0a1fA952ba88Dc9EEf8e0Bf46AD","0x86a02dD71363c440b21F4c0E5B2Ad01Ffe1A7482"]
    }
```

Generated with discovered.json: 0x6ff5a0a43ed688626e4aaceadf8b5a8ce79c14d0

# Diff at Fri, 02 Aug 2024 11:29:54 GMT:

- author: sekuba (<sekuba@users.noreply.github.com>)
- current block number: 74799516

## Description

Initial discovery: Normal Nitro L2 with external governance (aliased L1 Timelock on ethereum) and EmergencySecurityCouncil on Nova L2.

## Initial discovery

```diff
+   Status: CREATED
    contract L2GatewayRouter (0x21903d3F8176b1a0c17E953Cd896610Be9fFDFa8)
    +++ description: None
```

```diff
+   Status: CREATED
    contract L2SurplusFee (0x509386DbF5C0BE6fd68Df97A05fdB375136c32De)
    +++ description: None
```

```diff
+   Status: CREATED
    contract StandardArbERC20 (0x53923A0d1f4805463584c91b2E55d6c600A94E91)
    +++ description: None
```

```diff
+   Status: CREATED
    contract L2WethGateway (0x7626841cB6113412F9c88D3ADC720C9FAC88D9eD)
    +++ description: None
```

```diff
+   Status: CREATED
    contract L2UpgradeExecutor (0x86a02dD71363c440b21F4c0E5B2Ad01Ffe1A7482)
    +++ description: None
```

```diff
+   Status: CREATED
    contract L2BaseFee (0x9fCB6F75D99029f28F6F4a1d277bae49c5CAC79f)
    +++ description: None
```

```diff
+   Status: CREATED
    contract L2GatewaysProxyAdmin (0xada790b026097BfB36a5ed696859b97a96CEd92C)
    +++ description: None
```

```diff
+   Status: CREATED
    contract L2ARBGateway (0xbf544970E6BD77b21C6492C281AB60d0770451F4)
    +++ description: None
```

```diff
+   Status: CREATED
    contract L2SecurityCouncilEmergency (0xc232ee726E3C51B86778BB4dBe61C52cC07A60F3)
    +++ description: None
```

```diff
+   Status: CREATED
    contract L2ERC20Gateway (0xcF9bAb7e53DDe48A6DC4f286CB14e05298799257)
    +++ description: None
```

```diff
+   Status: CREATED
    contract UpgradeableBeacon (0xd31Ed16a8CeCe0A5070AC26024674eB680E3e639)
    +++ description: None
```

```diff
+   Status: CREATED
    contract BeaconProxyFactory (0xD9D66e55227c7558f0dB52adD059057Eb9bd90a3)
    +++ description: None
```

```diff
+   Status: CREATED
    contract L2ProxyAdmin (0xf58eA15B20983116c21b05c876cc8e6CDAe5C2b9)
    +++ description: None
```

```diff
+   Status: CREATED
    contract L2ArbitrumToken (0xf823C3cD3CeBE0a1fA952ba88Dc9EEf8e0Bf46AD)
    +++ description: None
```
