Generated with discovered.json: 0xd196cc4ae7cbe918c3d116d920240c124363fcd9

# Diff at Wed, 03 Sep 2025 11:42:55 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@f81a67544a1eef3c7f105dd59187ddee7ac70879 block: 1756805259
- current timestamp: 1756899680

## Description

Removed delegation.

## Watched changes

```diff
    EOA  (eth:0x660ad4B5A74130a4796B4d54BC6750Ae93C86e6c) {
    +++ description: None
      sourceHashes:
-        ["0x41c6ce964a4ef3e910f9ddf78152734dae8d1b1094ffc8334c50249a3b112bbf"]
      proxyType:
-        "EIP7702 EOA"
+        "EOA"
      values:
-        {"$implementation":"eth:0x63c0c19a282a1B52b07dD5a65b58948A07DAE32B"}
    }
```

Generated with discovered.json: 0x39c7629ebe39bd7e4508e71904954f3272a5018d

# Diff at Tue, 02 Sep 2025 15:31:53 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@f5ac0f88bdc411ecf49ff6c20d5dd0db181a0c91 block: 1756805259
- current timestamp: 1756805259

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 1756805259 (main branch discovery), not current.

```diff
    EOA  (eth:0x660ad4B5A74130a4796B4d54BC6750Ae93C86e6c) {
    +++ description: None
      proxyType:
-        "EOA"
+        "EIP7702 EOA"
      sourceHashes:
+        ["0x41c6ce964a4ef3e910f9ddf78152734dae8d1b1094ffc8334c50249a3b112bbf"]
      values:
+        {"$implementation":"eth:0x63c0c19a282a1B52b07dD5a65b58948A07DAE32B"}
    }
```

Generated with discovered.json: 0x20572a2b202f608030b913190c13eb8bfb52ec63

# Diff at Tue, 02 Sep 2025 09:30:23 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@1144aeaf984988c003c97be3791eeda76896f8ca block: 1755601095
- current timestamp: 1756805259

## Description

kinto team multisig single signer change.

undelegate a 7702 EOA.

## Watched changes

```diff
    EOA  (eth:0x660ad4B5A74130a4796B4d54BC6750Ae93C86e6c) {
    +++ description: None
      sourceHashes:
-        ["0x41c6ce964a4ef3e910f9ddf78152734dae8d1b1094ffc8334c50249a3b112bbf"]
      proxyType:
-        "EIP7702 EOA"
+        "EOA"
      values:
-        {"$implementation":"eth:0x63c0c19a282a1B52b07dD5a65b58948A07DAE32B"}
    }
```

```diff
    contract KintoMultisig (eth:0xf152Abda9E4ce8b134eF22Dc3C6aCe19C4895D82) {
    +++ description: None
      values.$members.0:
-        "eth:0x5D973Ea995d14799E528B14472346bfDE21eAe2e"
      values.$threshold:
-        3
+        2
      values.multisigThreshold:
-        "3 of 4 (75%)"
+        "2 of 3 (67%)"
    }
```

Generated with discovered.json: 0x42bbc6fd7172637141ade434835b9f613d273e86

# Diff at Mon, 01 Sep 2025 10:01:10 GMT:

Merge mark

Generated with discovered.json: 0x9a4b0189f98c0d125a072f03cdf50da4d453e943

# Diff at Tue, 19 Aug 2025 10:59:32 GMT:

- chain: ethereum
- author: Sergey Shemyakov (<sergey.shemyakov@l2beat.com>)
- comparing to: main@e55d710ea6abb9c86ba4da7b9086061648f68fba block: 1755010717
- current timestamp: 1755601095

## Description

EOA removed delegation to metamask 7702 delegator.

## Watched changes

```diff
    EOA  (0x660ad4B5A74130a4796B4d54BC6750Ae93C86e6c) {
    +++ description: None
      sourceHashes:
-        ["0x41c6ce964a4ef3e910f9ddf78152734dae8d1b1094ffc8334c50249a3b112bbf"]
      proxyType:
-        "EIP7702 EOA"
+        "EOA"
      values:
-        {"$implementation":"eth:0x63c0c19a282a1B52b07dD5a65b58948A07DAE32B","delegationManager":"eth:0xdb9B1e94B5b69Df7e401DDbedE43491141047dB3","DOMAIN_VERSION":"1","eip712Domain":{"fields":"0x0f","name":"EIP7702StatelessDeleGator","version":"1","chainId":1,"verifyingContract":"eth:0x660ad4B5A74130a4796B4d54BC6750Ae93C86e6c","salt":"0x0000000000000000000000000000000000000000000000000000000000000000","extensions":[]},"entryPoint":"eth:0x0000000071727De22E5E9d8BAf0edAc6f37da032","getDeposit":0,"getDomainHash":"0xda4b68659d2780fff93228d9db78cb1666fdb544e28cfd9764b8cbe0938d1407","getNonce":0,"NAME":"EIP7702StatelessDeleGator","PACKED_USER_OP_TYPEHASH":"0xbc37962d8bd1d319c95199bdfda6d3f92baa8903a61b32d5f4ec1f4b36a3bc18","VERSION":"1.3.0"}
    }
```

Generated with discovered.json: 0x9792b1fbe3be518a9171a5682c3c16dd897f4e82

# Diff at Tue, 12 Aug 2025 15:01:02 GMT:

- chain: ethereum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@e94498235c6c8b45d3e4bfb77316081ba540850a block: 1754911784
- current timestamp: 1755010717

## Description

zora owner change part two.

## Watched changes

```diff
    contract USDT Vault (Zora) (0x1417f50f864ba75D5c6cb4CD14479c48Ce5166fB) {
    +++ description: None
      values.nominee:
-        "eth:0x9B33306a655C07e15c917F95a8298131f652dA33"
+        "eth:0x0000000000000000000000000000000000000000"
      values.owner:
-        "eth:0x7B5Ba9Df17Bc58F504B6Cf0D87d2f05B79a36cfF"
+        "eth:0x9B33306a655C07e15c917F95a8298131f652dA33"
    }
```

Generated with discovered.json: 0x6f3e23fa4cc52d2b050ae6df22c0aeb916b31dd0

# Diff at Mon, 11 Aug 2025 11:30:02 GMT:

- chain: ethereum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@32817e35c9fe0ba1a1c24a734c37d91068b1565d block: 1754493282
- current timestamp: 1754911784

## Description

owner change on zora vaults.

## Watched changes

```diff
    contract USDT Vault (Zora) (0x1417f50f864ba75D5c6cb4CD14479c48Ce5166fB) {
    +++ description: None
      values.nominee:
-        "eth:0x0000000000000000000000000000000000000000"
+        "eth:0x9B33306a655C07e15c917F95a8298131f652dA33"
    }
```

```diff
    contract USDC Vault (Zora) (0x58CDCf55f2c8660674F17561334F6370cbaDeEF8) {
    +++ description: None
      values.owner:
-        "eth:0x7B5Ba9Df17Bc58F504B6Cf0D87d2f05B79a36cfF"
+        "eth:0x9B33306a655C07e15c917F95a8298131f652dA33"
    }
```

Generated with discovered.json: 0x4f38b34a7cd4ac78aa2cb6ffe5d17d1b356d93a0

# Diff at Wed, 06 Aug 2025 15:15:05 GMT:

- chain: ethereum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@1702d91eebfba5d614c3470bbe1babe10fbe4c2b block: 1754311053
- current timestamp: 1754493282

## Description

new plug.

## Watched changes

```diff
    contract Socket (0x943AC2775928318653e91d350574436A1b9b16f9) {
    +++ description: None
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.168:
+        "eth:0x5Ed056B2AA13E19c5CCd4624F3e93C1B621faD5A"
    }
```

Generated with discovered.json: 0x667e2cbc7cfb762219e3c782c5623806ad25ffd5

# Diff at Mon, 04 Aug 2025 12:37:59 GMT:

- chain: ethereum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@f7cc919a780045cf2b13d42712da413a3bff12b3 block: 1754057499
- current timestamp: 1754311053

## Description

new plugg (WETH, 0 tvs).

## Watched changes

```diff
    contract Socket (0x943AC2775928318653e91d350574436A1b9b16f9) {
    +++ description: None
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.167:
+        "eth:0xDb39c6502e6DaaC4d9EFe6383029bda464ea043c"
    }
```

Generated with discovered.json: 0x593d0cc62cbb2e227028e506187cb66285620bfa

# Diff at Fri, 01 Aug 2025 14:12:30 GMT:

- chain: ethereum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@802242fc2209399893865092b1048d583aafc2bb block: 1751617043
- current timestamp: 1754057499

## Description

EOA owner of Kinto's socket escrows has 7702-delegated to the standard metamask 7702 delegation contract.

## Watched changes

```diff
    EOA  (0x660ad4B5A74130a4796B4d54BC6750Ae93C86e6c) {
    +++ description: None
      proxyType:
-        "EOA"
+        "EIP7702 EOA"
      sourceHashes:
+        ["0x41c6ce964a4ef3e910f9ddf78152734dae8d1b1094ffc8334c50249a3b112bbf"]
      values:
+        {"$implementation":"eth:0x63c0c19a282a1B52b07dD5a65b58948A07DAE32B","delegationManager":"eth:0xdb9B1e94B5b69Df7e401DDbedE43491141047dB3","DOMAIN_VERSION":"1","eip712Domain":{"fields":"0x0f","name":"EIP7702StatelessDeleGator","version":"1","chainId":1,"verifyingContract":"eth:0x660ad4B5A74130a4796B4d54BC6750Ae93C86e6c","salt":"0x0000000000000000000000000000000000000000000000000000000000000000","extensions":[]},"entryPoint":"eth:0x0000000071727De22E5E9d8BAf0edAc6f37da032","getDeposit":0,"getDomainHash":"0xda4b68659d2780fff93228d9db78cb1666fdb544e28cfd9764b8cbe0938d1407","getNonce":0,"NAME":"EIP7702StatelessDeleGator","PACKED_USER_OP_TYPEHASH":"0xbc37962d8bd1d319c95199bdfda6d3f92baa8903a61b32d5f4ec1f4b36a3bc18","VERSION":"1.3.0"}
    }
```

Generated with discovered.json: 0xddfd7b7e6f3fc24c25e2b4702066242178b9d7b1

# Diff at Mon, 14 Jul 2025 12:46:23 GMT:

- chain: ethereum
- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@9f4300dad2f3d080cd56fa311d4a848556c74e72 block: 22844606
- current block number: 22844606

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22844606 (main branch discovery), not current.

```diff
    contract WETH Vault (Kinto) (0x00A0c9d82B95a17Cdf2D46703F2DcA13EB0E8A94) {
    +++ description: None
      address:
-        "0x00A0c9d82B95a17Cdf2D46703F2DcA13EB0E8A94"
+        "eth:0x00A0c9d82B95a17Cdf2D46703F2DcA13EB0E8A94"
      values.nominee:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      values.owner:
-        "0xf152Abda9E4ce8b134eF22Dc3C6aCe19C4895D82"
+        "eth:0xf152Abda9E4ce8b134eF22Dc3C6aCe19C4895D82"
      implementationNames.0x00A0c9d82B95a17Cdf2D46703F2DcA13EB0E8A94:
-        "Vault"
      implementationNames.eth:0x00A0c9d82B95a17Cdf2D46703F2DcA13EB0E8A94:
+        "Vault"
    }
```

```diff
    contract PolygonL1Switchboard (0x053407DFA30267f6332f3c94a9e9F704A55e62CD) {
    +++ description: None
      address:
-        "0x053407DFA30267f6332f3c94a9e9F704A55e62CD"
+        "eth:0x053407DFA30267f6332f3c94a9e9F704A55e62CD"
      values.capacitor__:
-        "0x994a46a0C07330A30F55C13Bd31Ffe464bA5e26E"
+        "eth:0x994a46a0C07330A30F55C13Bd31Ffe464bA5e26E"
      values.checkpointManager:
-        "0x86E4Dc95c7FBdBf52e33D563BbDB00823894C287"
+        "eth:0x86E4Dc95c7FBdBf52e33D563BbDB00823894C287"
      values.fxChildTunnel:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      values.fxRoot:
-        "0xfe5e5D361b2ad62c541bAb87C45a0B9B018389a2"
+        "eth:0xfe5e5D361b2ad62c541bAb87C45a0B9B018389a2"
      values.nominee:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      values.owner:
-        "0xeeF6520437A6545b4F325F6675C4CD49812d457b"
+        "eth:0xeeF6520437A6545b4F325F6675C4CD49812d457b"
      values.remoteNativeSwitchboard:
-        "0x72fB18276f3C3c3FD3146F6163994ec02Fa1c9D1"
+        "eth:0x72fB18276f3C3c3FD3146F6163994ec02Fa1c9D1"
      values.signatureVerifier__:
-        "0xf1ABF110d1B6ff0E2e8C05dd64FBF9eBA4d8af98"
+        "eth:0xf1ABF110d1B6ff0E2e8C05dd64FBF9eBA4d8af98"
      values.socket__:
-        "0x943AC2775928318653e91d350574436A1b9b16f9"
+        "eth:0x943AC2775928318653e91d350574436A1b9b16f9"
      implementationNames.0x053407DFA30267f6332f3c94a9e9F704A55e62CD:
-        "PolygonL1Switchboard"
      implementationNames.eth:0x053407DFA30267f6332f3c94a9e9F704A55e62CD:
+        "PolygonL1Switchboard"
    }
```

```diff
    contract sdeUSD Vault (Reya) (0x0A5A19376064fED2A0A9f3120B2426c957BC289D) {
    +++ description: None
      address:
-        "0x0A5A19376064fED2A0A9f3120B2426c957BC289D"
+        "eth:0x0A5A19376064fED2A0A9f3120B2426c957BC289D"
      implementationNames.0x0A5A19376064fED2A0A9f3120B2426c957BC289D:
-        ""
      implementationNames.eth:0x0A5A19376064fED2A0A9f3120B2426c957BC289D:
+        ""
    }
```

```diff
    contract deUSD Vault (Reya) (0x0b4447344fAAA340bcD2B0FdBD8f0CEcd161bC9E) {
    +++ description: None
      address:
-        "0x0b4447344fAAA340bcD2B0FdBD8f0CEcd161bC9E"
+        "eth:0x0b4447344fAAA340bcD2B0FdBD8f0CEcd161bC9E"
      implementationNames.0x0b4447344fAAA340bcD2B0FdBD8f0CEcd161bC9E:
-        ""
      implementationNames.eth:0x0b4447344fAAA340bcD2B0FdBD8f0CEcd161bC9E:
+        ""
    }
```

```diff
    contract OptimismSwitchboard2 (0x0E674e057EC0FF97eeA57B6A350DBAAD22FE41BA) {
    +++ description: None
      address:
-        "0x0E674e057EC0FF97eeA57B6A350DBAAD22FE41BA"
+        "eth:0x0E674e057EC0FF97eeA57B6A350DBAAD22FE41BA"
      values.capacitor__:
-        "0x5E162Be0d9898F35B02D3bF774b45E4C48af1a70"
+        "eth:0x5E162Be0d9898F35B02D3bF774b45E4C48af1a70"
      values.crossDomainMessenger__:
-        "0x25ace71c97B33Cc4729CF772ae268934F7ab5fA1"
+        "eth:0x25ace71c97B33Cc4729CF772ae268934F7ab5fA1"
      values.nominee:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      values.owner:
-        "0xeeF6520437A6545b4F325F6675C4CD49812d457b"
+        "eth:0xeeF6520437A6545b4F325F6675C4CD49812d457b"
      values.remoteNativeSwitchboard:
-        "0x9Cf7443685827419B0067fb2471C24969EAA716C"
+        "eth:0x9Cf7443685827419B0067fb2471C24969EAA716C"
      values.signatureVerifier__:
-        "0xf1ABF110d1B6ff0E2e8C05dd64FBF9eBA4d8af98"
+        "eth:0xf1ABF110d1B6ff0E2e8C05dd64FBF9eBA4d8af98"
      values.socket__:
-        "0x943AC2775928318653e91d350574436A1b9b16f9"
+        "eth:0x943AC2775928318653e91d350574436A1b9b16f9"
      implementationNames.0x0E674e057EC0FF97eeA57B6A350DBAAD22FE41BA:
-        "OptimismSwitchboard"
      implementationNames.eth:0x0E674e057EC0FF97eeA57B6A350DBAAD22FE41BA:
+        "OptimismSwitchboard"
    }
```

```diff
    contract CapacitorFactory (0x11Fbb9116801DB54bB51fF4dF423e34E8b45fc9a) {
    +++ description: None
      address:
-        "0x11Fbb9116801DB54bB51fF4dF423e34E8b45fc9a"
+        "eth:0x11Fbb9116801DB54bB51fF4dF423e34E8b45fc9a"
      values.nominee:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      values.owner:
-        "0xeeF6520437A6545b4F325F6675C4CD49812d457b"
+        "eth:0xeeF6520437A6545b4F325F6675C4CD49812d457b"
      implementationNames.0x11Fbb9116801DB54bB51fF4dF423e34E8b45fc9a:
-        "CapacitorFactory"
      implementationNames.eth:0x11Fbb9116801DB54bB51fF4dF423e34E8b45fc9a:
+        "CapacitorFactory"
    }
```

```diff
    contract DAI Vault (Kinto) (0x12Cf431BdF7F143338cC09A0629EDcCEDCBCEcB5) {
    +++ description: None
      address:
-        "0x12Cf431BdF7F143338cC09A0629EDcCEDCBCEcB5"
+        "eth:0x12Cf431BdF7F143338cC09A0629EDcCEDCBCEcB5"
      values.nominee:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      values.owner:
-        "0xf152Abda9E4ce8b134eF22Dc3C6aCe19C4895D82"
+        "eth:0xf152Abda9E4ce8b134eF22Dc3C6aCe19C4895D82"
      implementationNames.0x12Cf431BdF7F143338cC09A0629EDcCEDCBCEcB5:
-        "Vault"
      implementationNames.eth:0x12Cf431BdF7F143338cC09A0629EDcCEDCBCEcB5:
+        "Vault"
    }
```

```diff
    contract OptimismSwitchboard (0x139f39DC7dC05F7aC2DB3DB6af4f2e1a9De7c287) {
    +++ description: None
      address:
-        "0x139f39DC7dC05F7aC2DB3DB6af4f2e1a9De7c287"
+        "eth:0x139f39DC7dC05F7aC2DB3DB6af4f2e1a9De7c287"
      values.capacitor__:
-        "0xBA2CaBf4754745C822c2BDdE65aF836CF92E4354"
+        "eth:0xBA2CaBf4754745C822c2BDdE65aF836CF92E4354"
      values.crossDomainMessenger__:
-        "0x5456f02c08e9A018E42C39b351328E5AA864174A"
+        "eth:0x5456f02c08e9A018E42C39b351328E5AA864174A"
      values.nominee:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      values.owner:
-        "0xeeF6520437A6545b4F325F6675C4CD49812d457b"
+        "eth:0xeeF6520437A6545b4F325F6675C4CD49812d457b"
      values.remoteNativeSwitchboard:
-        "0x1D6811553Aff8231aDd04A84F300b89E15D99EA4"
+        "eth:0x1D6811553Aff8231aDd04A84F300b89E15D99EA4"
      values.signatureVerifier__:
-        "0xf1ABF110d1B6ff0E2e8C05dd64FBF9eBA4d8af98"
+        "eth:0xf1ABF110d1B6ff0E2e8C05dd64FBF9eBA4d8af98"
      values.socket__:
-        "0x943AC2775928318653e91d350574436A1b9b16f9"
+        "eth:0x943AC2775928318653e91d350574436A1b9b16f9"
      implementationNames.0x139f39DC7dC05F7aC2DB3DB6af4f2e1a9De7c287:
-        "OptimismSwitchboard"
      implementationNames.eth:0x139f39DC7dC05F7aC2DB3DB6af4f2e1a9De7c287:
+        "OptimismSwitchboard"
    }
```

```diff
    contract USDT Vault (Zora) (0x1417f50f864ba75D5c6cb4CD14479c48Ce5166fB) {
    +++ description: None
      address:
-        "0x1417f50f864ba75D5c6cb4CD14479c48Ce5166fB"
+        "eth:0x1417f50f864ba75D5c6cb4CD14479c48Ce5166fB"
      values.nominee:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      values.owner:
-        "0x7B5Ba9Df17Bc58F504B6Cf0D87d2f05B79a36cfF"
+        "eth:0x7B5Ba9Df17Bc58F504B6Cf0D87d2f05B79a36cfF"
      implementationNames.0x1417f50f864ba75D5c6cb4CD14479c48Ce5166fB:
-        "Vault"
      implementationNames.eth:0x1417f50f864ba75D5c6cb4CD14479c48Ce5166fB:
+        "Vault"
    }
```

```diff
    contract SolvBTC Vault (Polynomial) (0x197cCb40bCDed89c3D7B891824ab44d1913Ee73E) {
    +++ description: None
      address:
-        "0x197cCb40bCDed89c3D7B891824ab44d1913Ee73E"
+        "eth:0x197cCb40bCDed89c3D7B891824ab44d1913Ee73E"
      implementationNames.0x197cCb40bCDed89c3D7B891824ab44d1913Ee73E:
-        ""
      implementationNames.eth:0x197cCb40bCDed89c3D7B891824ab44d1913Ee73E:
+        ""
    }
```

```diff
    contract WETH Vault (Polynomial) (0x1bF463463dd6747230Ee1bF9428376EBF1e2C23a) {
    +++ description: None
      address:
-        "0x1bF463463dd6747230Ee1bF9428376EBF1e2C23a"
+        "eth:0x1bF463463dd6747230Ee1bF9428376EBF1e2C23a"
      implementationNames.0x1bF463463dd6747230Ee1bF9428376EBF1e2C23a:
-        ""
      implementationNames.eth:0x1bF463463dd6747230Ee1bF9428376EBF1e2C23a:
+        ""
    }
```

```diff
    contract PENDLE Vault (Kinto) (0x1Ca284BaA0023b6bB0950C93ee6d1f2068de2D97) {
    +++ description: None
      address:
-        "0x1Ca284BaA0023b6bB0950C93ee6d1f2068de2D97"
+        "eth:0x1Ca284BaA0023b6bB0950C93ee6d1f2068de2D97"
      values.nominee:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      values.owner:
-        "0x660ad4B5A74130a4796B4d54BC6750Ae93C86e6c"
+        "eth:0x660ad4B5A74130a4796B4d54BC6750Ae93C86e6c"
      implementationNames.0x1Ca284BaA0023b6bB0950C93ee6d1f2068de2D97:
-        "Vault"
      implementationNames.eth:0x1Ca284BaA0023b6bB0950C93ee6d1f2068de2D97:
+        "Vault"
    }
```

```diff
    contract USDT Vault (Kinto) (0x1D18263107a138C7fb0De65b4a78d193ff9664c1) {
    +++ description: None
      address:
-        "0x1D18263107a138C7fb0De65b4a78d193ff9664c1"
+        "eth:0x1D18263107a138C7fb0De65b4a78d193ff9664c1"
      values.nominee:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      values.owner:
-        "0xf152Abda9E4ce8b134eF22Dc3C6aCe19C4895D82"
+        "eth:0xf152Abda9E4ce8b134eF22Dc3C6aCe19C4895D82"
      implementationNames.0x1D18263107a138C7fb0De65b4a78d193ff9664c1:
-        "Vault"
      implementationNames.eth:0x1D18263107a138C7fb0De65b4a78d193ff9664c1:
+        "Vault"
    }
```

```diff
    contract WBTC Vault (Reya) (0x2344621d5aA6e784e8C6f4c54b0B29Dd9c3Ad4B6) {
    +++ description: None
      address:
-        "0x2344621d5aA6e784e8C6f4c54b0B29Dd9c3Ad4B6"
+        "eth:0x2344621d5aA6e784e8C6f4c54b0B29Dd9c3Ad4B6"
      values.nominee:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      values.owner:
-        "0xB0BBff6311B7F245761A7846d3Ce7B1b100C1836"
+        "eth:0xB0BBff6311B7F245761A7846d3Ce7B1b100C1836"
      implementationNames.0x2344621d5aA6e784e8C6f4c54b0B29Dd9c3Ad4B6:
-        "Vault"
      implementationNames.eth:0x2344621d5aA6e784e8C6f4c54b0B29Dd9c3Ad4B6:
+        "Vault"
    }
```

```diff
    contract LyraMultisig (0x246d38588b16Dd877c558b245e6D5a711C649fCF) {
    +++ description: None
      address:
-        "0x246d38588b16Dd877c558b245e6D5a711C649fCF"
+        "eth:0x246d38588b16Dd877c558b245e6D5a711C649fCF"
      values.$implementation:
-        "0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552"
+        "eth:0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552"
      values.$members.0:
-        "0xb88D64a7E2ec1b137c969Adf2EC65f933d631F65"
+        "eth:0xb88D64a7E2ec1b137c969Adf2EC65f933d631F65"
      values.$members.1:
-        "0x76E6F5C2A64df0F53077602642B79a45D5Ba6D52"
+        "eth:0x76E6F5C2A64df0F53077602642B79a45D5Ba6D52"
      values.$members.2:
-        "0x4cEa25e9c999E69F45765539783D149024f99F12"
+        "eth:0x4cEa25e9c999E69F45765539783D149024f99F12"
      implementationNames.0x246d38588b16Dd877c558b245e6D5a711C649fCF:
-        "Proxy"
      implementationNames.0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552:
-        "GnosisSafe"
      implementationNames.eth:0x246d38588b16Dd877c558b245e6D5a711C649fCF:
+        "Proxy"
      implementationNames.eth:0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552:
+        "GnosisSafe"
    }
```

```diff
    contract eBTC Vault (Derive) (0x25d35C8796c9dcD3857abE90D802FC17b1FB55A5) {
    +++ description: None
      address:
-        "0x25d35C8796c9dcD3857abE90D802FC17b1FB55A5"
+        "eth:0x25d35C8796c9dcD3857abE90D802FC17b1FB55A5"
      values.nominee:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      values.owner:
-        "0x246d38588b16Dd877c558b245e6D5a711C649fCF"
+        "eth:0x246d38588b16Dd877c558b245e6D5a711C649fCF"
      implementationNames.0x25d35C8796c9dcD3857abE90D802FC17b1FB55A5:
-        "Vault"
      implementationNames.eth:0x25d35C8796c9dcD3857abE90D802FC17b1FB55A5:
+        "Vault"
    }
```

```diff
    contract PAXG Vault (Kinto) (0x25f0D71Da51A77Ca231484eBbAD1f588A0230ef2) {
    +++ description: None
      address:
-        "0x25f0D71Da51A77Ca231484eBbAD1f588A0230ef2"
+        "eth:0x25f0D71Da51A77Ca231484eBbAD1f588A0230ef2"
      values.nominee:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      values.owner:
-        "0xf152Abda9E4ce8b134eF22Dc3C6aCe19C4895D82"
+        "eth:0xf152Abda9E4ce8b134eF22Dc3C6aCe19C4895D82"
      implementationNames.0x25f0D71Da51A77Ca231484eBbAD1f588A0230ef2:
-        "Vault"
      implementationNames.eth:0x25f0D71Da51A77Ca231484eBbAD1f588A0230ef2:
+        "Vault"
    }
```

```diff
    contract USDe Vault (Derive) (0x26Cf1Dc84694E04277F2Fe4C13E43597c6010C2A) {
    +++ description: None
      address:
-        "0x26Cf1Dc84694E04277F2Fe4C13E43597c6010C2A"
+        "eth:0x26Cf1Dc84694E04277F2Fe4C13E43597c6010C2A"
      values.nominee:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      values.owner:
-        "0x246d38588b16Dd877c558b245e6D5a711C649fCF"
+        "eth:0x246d38588b16Dd877c558b245e6D5a711C649fCF"
      implementationNames.0x26Cf1Dc84694E04277F2Fe4C13E43597c6010C2A:
-        "Vault"
      implementationNames.eth:0x26Cf1Dc84694E04277F2Fe4C13E43597c6010C2A:
+        "Vault"
    }
```

```diff
    contract ENA Vault (Kinto) (0x351d8894fB8bfa1b0eFF77bFD9Aab18eA2da8fDd) {
    +++ description: None
      address:
-        "0x351d8894fB8bfa1b0eFF77bFD9Aab18eA2da8fDd"
+        "eth:0x351d8894fB8bfa1b0eFF77bFD9Aab18eA2da8fDd"
      values.nominee:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      values.owner:
-        "0xf152Abda9E4ce8b134eF22Dc3C6aCe19C4895D82"
+        "eth:0xf152Abda9E4ce8b134eF22Dc3C6aCe19C4895D82"
      implementationNames.0x351d8894fB8bfa1b0eFF77bFD9Aab18eA2da8fDd:
-        "Vault"
      implementationNames.eth:0x351d8894fB8bfa1b0eFF77bFD9Aab18eA2da8fDd:
+        "Vault"
    }
```

```diff
    contract rsETH Vault (Derive) (0x35d4D9bc79B0a543934b1769304B90d752691caD) {
    +++ description: None
      address:
-        "0x35d4D9bc79B0a543934b1769304B90d752691caD"
+        "eth:0x35d4D9bc79B0a543934b1769304B90d752691caD"
      values.nominee:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      values.owner:
-        "0x246d38588b16Dd877c558b245e6D5a711C649fCF"
+        "eth:0x246d38588b16Dd877c558b245e6D5a711C649fCF"
      implementationNames.0x35d4D9bc79B0a543934b1769304B90d752691caD:
-        "Vault"
      implementationNames.eth:0x35d4D9bc79B0a543934b1769304B90d752691caD:
+        "Vault"
    }
```

```diff
    contract SolvBTC Vault (Derive) (0x383a4EdB30E896b8d2d044Be87079D45c0EA7065) {
    +++ description: None
      address:
-        "0x383a4EdB30E896b8d2d044Be87079D45c0EA7065"
+        "eth:0x383a4EdB30E896b8d2d044Be87079D45c0EA7065"
      values.nominee:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      values.owner:
-        "0x246d38588b16Dd877c558b245e6D5a711C649fCF"
+        "eth:0x246d38588b16Dd877c558b245e6D5a711C649fCF"
      implementationNames.0x383a4EdB30E896b8d2d044Be87079D45c0EA7065:
-        "Vault"
      implementationNames.eth:0x383a4EdB30E896b8d2d044Be87079D45c0EA7065:
+        "Vault"
    }
```

```diff
    contract WBTC Vault (Derive) (0x3Eec7c855aF33280F1eD38b93059F5aa5862E3ab) {
    +++ description: None
      address:
-        "0x3Eec7c855aF33280F1eD38b93059F5aa5862E3ab"
+        "eth:0x3Eec7c855aF33280F1eD38b93059F5aa5862E3ab"
      values.nominee:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      values.owner:
-        "0x246d38588b16Dd877c558b245e6D5a711C649fCF"
+        "eth:0x246d38588b16Dd877c558b245e6D5a711C649fCF"
      implementationNames.0x3Eec7c855aF33280F1eD38b93059F5aa5862E3ab:
-        "Vault"
      implementationNames.eth:0x3Eec7c855aF33280F1eD38b93059F5aa5862E3ab:
+        "Vault"
    }
```

```diff
    contract OLAS Vault (Derive) (0x412Ac6044401cDf1e9833B7056c14C74AA593D37) {
    +++ description: None
      address:
-        "0x412Ac6044401cDf1e9833B7056c14C74AA593D37"
+        "eth:0x412Ac6044401cDf1e9833B7056c14C74AA593D37"
      values.nominee:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      values.owner:
-        "0x246d38588b16Dd877c558b245e6D5a711C649fCF"
+        "eth:0x246d38588b16Dd877c558b245e6D5a711C649fCF"
      implementationNames.0x412Ac6044401cDf1e9833B7056c14C74AA593D37:
-        "Vault"
      implementationNames.eth:0x412Ac6044401cDf1e9833B7056c14C74AA593D37:
+        "Vault"
    }
```

```diff
    contract sUSDe Vault (Kinto) (0x43b718Aa5e678b08615CA984cbe25f690B085b32) {
    +++ description: None
      address:
-        "0x43b718Aa5e678b08615CA984cbe25f690B085b32"
+        "eth:0x43b718Aa5e678b08615CA984cbe25f690B085b32"
      values.nominee:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      values.owner:
-        "0xf152Abda9E4ce8b134eF22Dc3C6aCe19C4895D82"
+        "eth:0xf152Abda9E4ce8b134eF22Dc3C6aCe19C4895D82"
      implementationNames.0x43b718Aa5e678b08615CA984cbe25f690B085b32:
-        "Vault"
      implementationNames.eth:0x43b718Aa5e678b08615CA984cbe25f690B085b32:
+        "Vault"
    }
```

```diff
    contract AAVE Vault (Derive) (0x4421461239aE746127C13a19177656124433dC60) {
    +++ description: None
      address:
-        "0x4421461239aE746127C13a19177656124433dC60"
+        "eth:0x4421461239aE746127C13a19177656124433dC60"
      values.nominee:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      values.owner:
-        "0x246d38588b16Dd877c558b245e6D5a711C649fCF"
+        "eth:0x246d38588b16Dd877c558b245e6D5a711C649fCF"
      implementationNames.0x4421461239aE746127C13a19177656124433dC60:
-        "Vault"
      implementationNames.eth:0x4421461239aE746127C13a19177656124433dC60:
+        "Vault"
    }
```

```diff
    EOA  (0x45d7A9bFC82Ca6AE410E4410f44c57a2b9F8Ec58) {
    +++ description: None
      address:
-        "0x45d7A9bFC82Ca6AE410E4410f44c57a2b9F8Ec58"
+        "eth:0x45d7A9bFC82Ca6AE410E4410f44c57a2b9F8Ec58"
    }
```

```diff
    contract USDS Vault (Polynomial) (0x49bFcE41d0594acA7390eD0820d83Fda308c39a7) {
    +++ description: None
      address:
-        "0x49bFcE41d0594acA7390eD0820d83Fda308c39a7"
+        "eth:0x49bFcE41d0594acA7390eD0820d83Fda308c39a7"
      implementationNames.0x49bFcE41d0594acA7390eD0820d83Fda308c39a7:
-        ""
      implementationNames.eth:0x49bFcE41d0594acA7390eD0820d83Fda308c39a7:
+        ""
    }
```

```diff
    contract rswETH Vault (Derive) (0x4BB4C3CDc7562f08e9910A0C7D8bB7e108861eB4) {
    +++ description: None
      address:
-        "0x4BB4C3CDc7562f08e9910A0C7D8bB7e108861eB4"
+        "eth:0x4BB4C3CDc7562f08e9910A0C7D8bB7e108861eB4"
      values.nominee:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      values.owner:
-        "0x246d38588b16Dd877c558b245e6D5a711C649fCF"
+        "eth:0x246d38588b16Dd877c558b245e6D5a711C649fCF"
      implementationNames.0x4BB4C3CDc7562f08e9910A0C7D8bB7e108861eB4:
-        "Vault"
      implementationNames.eth:0x4BB4C3CDc7562f08e9910A0C7D8bB7e108861eB4:
+        "Vault"
    }
```

```diff
    EOA  (0x4cEa25e9c999E69F45765539783D149024f99F12) {
    +++ description: None
      address:
-        "0x4cEa25e9c999E69F45765539783D149024f99F12"
+        "eth:0x4cEa25e9c999E69F45765539783D149024f99F12"
    }
```

```diff
    contract GHO Vault (Kinto) (0x4F18853BE8C01d375889c02D61A77B476d3E59dd) {
    +++ description: None
      address:
-        "0x4F18853BE8C01d375889c02D61A77B476d3E59dd"
+        "eth:0x4F18853BE8C01d375889c02D61A77B476d3E59dd"
      values.nominee:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      values.owner:
-        "0xf152Abda9E4ce8b134eF22Dc3C6aCe19C4895D82"
+        "eth:0xf152Abda9E4ce8b134eF22Dc3C6aCe19C4895D82"
      implementationNames.0x4F18853BE8C01d375889c02D61A77B476d3E59dd:
-        "Vault"
      implementationNames.eth:0x4F18853BE8C01d375889c02D61A77B476d3E59dd:
+        "Vault"
    }
```

```diff
    contract LDO Vault (Kinto) (0x54e60fef7c7f2f747900452D4151aF976EaeAb76) {
    +++ description: None
      address:
-        "0x54e60fef7c7f2f747900452D4151aF976EaeAb76"
+        "eth:0x54e60fef7c7f2f747900452D4151aF976EaeAb76"
      values.nominee:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      values.owner:
-        "0x660ad4B5A74130a4796B4d54BC6750Ae93C86e6c"
+        "eth:0x660ad4B5A74130a4796B4d54BC6750Ae93C86e6c"
      implementationNames.0x54e60fef7c7f2f747900452D4151aF976EaeAb76:
-        "Vault"
      implementationNames.eth:0x54e60fef7c7f2f747900452D4151aF976EaeAb76:
+        "Vault"
    }
```

```diff
    contract wstETH Vault (Polynomial) (0x572A4080c16beD33Cf2E876ad969E2E35769EDB4) {
    +++ description: None
      address:
-        "0x572A4080c16beD33Cf2E876ad969E2E35769EDB4"
+        "eth:0x572A4080c16beD33Cf2E876ad969E2E35769EDB4"
      implementationNames.0x572A4080c16beD33Cf2E876ad969E2E35769EDB4:
-        ""
      implementationNames.eth:0x572A4080c16beD33Cf2E876ad969E2E35769EDB4:
+        ""
    }
```

```diff
    contract USDC Vault (Zora) (0x58CDCf55f2c8660674F17561334F6370cbaDeEF8) {
    +++ description: None
      address:
-        "0x58CDCf55f2c8660674F17561334F6370cbaDeEF8"
+        "eth:0x58CDCf55f2c8660674F17561334F6370cbaDeEF8"
      values.nominee:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      values.owner:
-        "0x7B5Ba9Df17Bc58F504B6Cf0D87d2f05B79a36cfF"
+        "eth:0x7B5Ba9Df17Bc58F504B6Cf0D87d2f05B79a36cfF"
      implementationNames.0x58CDCf55f2c8660674F17561334F6370cbaDeEF8:
-        "Vault"
      implementationNames.eth:0x58CDCf55f2c8660674F17561334F6370cbaDeEF8:
+        "Vault"
    }
```

```diff
    contract sDAI Vault (Kinto) (0x5B8Ae1C9c5970e2637Cf3Af431acAAebEf7aFb85) {
    +++ description: None
      address:
-        "0x5B8Ae1C9c5970e2637Cf3Af431acAAebEf7aFb85"
+        "eth:0x5B8Ae1C9c5970e2637Cf3Af431acAAebEf7aFb85"
      values.nominee:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      values.owner:
-        "0xf152Abda9E4ce8b134eF22Dc3C6aCe19C4895D82"
+        "eth:0xf152Abda9E4ce8b134eF22Dc3C6aCe19C4895D82"
      implementationNames.0x5B8Ae1C9c5970e2637Cf3Af431acAAebEf7aFb85:
-        "Vault"
      implementationNames.eth:0x5B8Ae1C9c5970e2637Cf3Af431acAAebEf7aFb85:
+        "Vault"
    }
```

```diff
    contract Hasher (0x5C71beE4a6b0D617D8c3d107D331292741789E27) {
    +++ description: None
      address:
-        "0x5C71beE4a6b0D617D8c3d107D331292741789E27"
+        "eth:0x5C71beE4a6b0D617D8c3d107D331292741789E27"
      values.nominee:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      values.owner:
-        "0xeeF6520437A6545b4F325F6675C4CD49812d457b"
+        "eth:0xeeF6520437A6545b4F325F6675C4CD49812d457b"
      implementationNames.0x5C71beE4a6b0D617D8c3d107D331292741789E27:
-        "Hasher"
      implementationNames.eth:0x5C71beE4a6b0D617D8c3d107D331292741789E27:
+        "Hasher"
    }
```

```diff
    contract cbETH Vault (Kinto) (0x5cC25cc25bE29d18472E76b2a19975aA1a37Bd5C) {
    +++ description: None
      address:
-        "0x5cC25cc25bE29d18472E76b2a19975aA1a37Bd5C"
+        "eth:0x5cC25cc25bE29d18472E76b2a19975aA1a37Bd5C"
      values.nominee:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      values.owner:
-        "0xf152Abda9E4ce8b134eF22Dc3C6aCe19C4895D82"
+        "eth:0xf152Abda9E4ce8b134eF22Dc3C6aCe19C4895D82"
      implementationNames.0x5cC25cc25bE29d18472E76b2a19975aA1a37Bd5C:
-        "Vault"
      implementationNames.eth:0x5cC25cc25bE29d18472E76b2a19975aA1a37Bd5C:
+        "Vault"
    }
```

```diff
    EOA  (0x5D973Ea995d14799E528B14472346bfDE21eAe2e) {
    +++ description: None
      address:
-        "0x5D973Ea995d14799E528B14472346bfDE21eAe2e"
+        "eth:0x5D973Ea995d14799E528B14472346bfDE21eAe2e"
    }
```

```diff
    contract USDT Vault (Derive) (0x5e98A25d8d6FF69A8992d6Aa57948dFB77D4ECBa) {
    +++ description: None
      address:
-        "0x5e98A25d8d6FF69A8992d6Aa57948dFB77D4ECBa"
+        "eth:0x5e98A25d8d6FF69A8992d6Aa57948dFB77D4ECBa"
      values.nominee:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      values.owner:
-        "0x246d38588b16Dd877c558b245e6D5a711C649fCF"
+        "eth:0x246d38588b16Dd877c558b245e6D5a711C649fCF"
      implementationNames.0x5e98A25d8d6FF69A8992d6Aa57948dFB77D4ECBa:
-        "Vault"
      implementationNames.eth:0x5e98A25d8d6FF69A8992d6Aa57948dFB77D4ECBa:
+        "Vault"
    }
```

```diff
    EOA  (0x5ECfd6968593159e5b4f06832857943409122849) {
    +++ description: None
      address:
-        "0x5ECfd6968593159e5b4f06832857943409122849"
+        "eth:0x5ECfd6968593159e5b4f06832857943409122849"
    }
```

```diff
    contract cbBTC Vault (Derive) (0x5F18C54e4E10287414A47925a24Ea3A8Cf4A9F50) {
    +++ description: None
      address:
-        "0x5F18C54e4E10287414A47925a24Ea3A8Cf4A9F50"
+        "eth:0x5F18C54e4E10287414A47925a24Ea3A8Cf4A9F50"
      values.nominee:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      values.owner:
-        "0x246d38588b16Dd877c558b245e6D5a711C649fCF"
+        "eth:0x246d38588b16Dd877c558b245e6D5a711C649fCF"
      implementationNames.0x5F18C54e4E10287414A47925a24Ea3A8Cf4A9F50:
-        "Vault"
      implementationNames.eth:0x5F18C54e4E10287414A47925a24Ea3A8Cf4A9F50:
+        "Vault"
    }
```

```diff
    contract sUSDe Vault (Reya) (0x5F3B301B4967623fDb3AE52Bb8FF4dB01C460Cd3) {
    +++ description: None
      address:
-        "0x5F3B301B4967623fDb3AE52Bb8FF4dB01C460Cd3"
+        "eth:0x5F3B301B4967623fDb3AE52Bb8FF4dB01C460Cd3"
      implementationNames.0x5F3B301B4967623fDb3AE52Bb8FF4dB01C460Cd3:
-        ""
      implementationNames.eth:0x5F3B301B4967623fDb3AE52Bb8FF4dB01C460Cd3:
+        ""
    }
```

```diff
    contract sDAI Vault (Derive) (0x613e87BE1cd75dEBC5e6e56a2AF2fED84162C142) {
    +++ description: None
      address:
-        "0x613e87BE1cd75dEBC5e6e56a2AF2fED84162C142"
+        "eth:0x613e87BE1cd75dEBC5e6e56a2AF2fED84162C142"
      values.nominee:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      values.owner:
-        "0x246d38588b16Dd877c558b245e6D5a711C649fCF"
+        "eth:0x246d38588b16Dd877c558b245e6D5a711C649fCF"
      implementationNames.0x613e87BE1cd75dEBC5e6e56a2AF2fED84162C142:
-        "Vault"
      implementationNames.eth:0x613e87BE1cd75dEBC5e6e56a2AF2fED84162C142:
+        "Vault"
    }
```

```diff
    contract sDAI Vault (Polynomial) (0x615172e47c0C5A6dA8ea959632Ac0166f7a59eDc) {
    +++ description: None
      address:
-        "0x615172e47c0C5A6dA8ea959632Ac0166f7a59eDc"
+        "eth:0x615172e47c0C5A6dA8ea959632Ac0166f7a59eDc"
      values.nominee:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      values.owner:
-        "0x9f76043B23125024Ce5f0Fb4AE707482107dd2a8"
+        "eth:0x9f76043B23125024Ce5f0Fb4AE707482107dd2a8"
      implementationNames.0x615172e47c0C5A6dA8ea959632Ac0166f7a59eDc:
-        "Vault"
      implementationNames.eth:0x615172e47c0C5A6dA8ea959632Ac0166f7a59eDc:
+        "Vault"
    }
```

```diff
    contract WETH Vault (Reya) (0x64dF894688c5052BeAdC35371cF69151Ebc5D658) {
    +++ description: None
      address:
-        "0x64dF894688c5052BeAdC35371cF69151Ebc5D658"
+        "eth:0x64dF894688c5052BeAdC35371cF69151Ebc5D658"
      values.nominee:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      values.owner:
-        "0xB0BBff6311B7F245761A7846d3Ce7B1b100C1836"
+        "eth:0xB0BBff6311B7F245761A7846d3Ce7B1b100C1836"
      implementationNames.0x64dF894688c5052BeAdC35371cF69151Ebc5D658:
-        "Vault"
      implementationNames.eth:0x64dF894688c5052BeAdC35371cF69151Ebc5D658:
+        "Vault"
    }
```

```diff
    EOA  (0x660ad4B5A74130a4796B4d54BC6750Ae93C86e6c) {
    +++ description: None
      address:
-        "0x660ad4B5A74130a4796B4d54BC6750Ae93C86e6c"
+        "eth:0x660ad4B5A74130a4796B4d54BC6750Ae93C86e6c"
    }
```

```diff
    contract USDC Vault (Derive) (0x6D303CEE7959f814042D31E0624fB88Ec6fbcC1d) {
    +++ description: None
      address:
-        "0x6D303CEE7959f814042D31E0624fB88Ec6fbcC1d"
+        "eth:0x6D303CEE7959f814042D31E0624fB88Ec6fbcC1d"
      values.owner:
-        "0x246d38588b16Dd877c558b245e6D5a711C649fCF"
+        "eth:0x246d38588b16Dd877c558b245e6D5a711C649fCF"
      values.pendingOwner:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      implementationNames.0x6D303CEE7959f814042D31E0624fB88Ec6fbcC1d:
-        "Vault"
      implementationNames.eth:0x6D303CEE7959f814042D31E0624fB88Ec6fbcC1d:
+        "Vault"
    }
```

```diff
    contract USDC Vault (Kinto) (0x755cD5d147036E11c76F1EeffDd94794fC265f0d) {
    +++ description: None
      address:
-        "0x755cD5d147036E11c76F1EeffDd94794fC265f0d"
+        "eth:0x755cD5d147036E11c76F1EeffDd94794fC265f0d"
      values.nominee:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      values.owner:
-        "0xf152Abda9E4ce8b134eF22Dc3C6aCe19C4895D82"
+        "eth:0xf152Abda9E4ce8b134eF22Dc3C6aCe19C4895D82"
      implementationNames.0x755cD5d147036E11c76F1EeffDd94794fC265f0d:
-        "Vault"
      implementationNames.eth:0x755cD5d147036E11c76F1EeffDd94794fC265f0d:
+        "Vault"
    }
```

```diff
    contract LBTC Vault (Derive) (0x76624ff43D610F64177Bb9c194A2503642e9B803) {
    +++ description: None
      address:
-        "0x76624ff43D610F64177Bb9c194A2503642e9B803"
+        "eth:0x76624ff43D610F64177Bb9c194A2503642e9B803"
      values.nominee:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      values.owner:
-        "0x246d38588b16Dd877c558b245e6D5a711C649fCF"
+        "eth:0x246d38588b16Dd877c558b245e6D5a711C649fCF"
      implementationNames.0x76624ff43D610F64177Bb9c194A2503642e9B803:
-        "Vault"
      implementationNames.eth:0x76624ff43D610F64177Bb9c194A2503642e9B803:
+        "Vault"
    }
```

```diff
    EOA  (0x76E6F5C2A64df0F53077602642B79a45D5Ba6D52) {
    +++ description: None
      address:
-        "0x76E6F5C2A64df0F53077602642B79a45D5Ba6D52"
+        "eth:0x76E6F5C2A64df0F53077602642B79a45D5Ba6D52"
    }
```

```diff
    EOA  (0x7B5Ba9Df17Bc58F504B6Cf0D87d2f05B79a36cfF) {
    +++ description: None
      address:
-        "0x7B5Ba9Df17Bc58F504B6Cf0D87d2f05B79a36cfF"
+        "eth:0x7B5Ba9Df17Bc58F504B6Cf0D87d2f05B79a36cfF"
    }
```

```diff
    contract SNX Vault (Derive) (0x7D7aC8d55A9bD4152b703011f3E61AB3bB0A5592) {
    +++ description: None
      address:
-        "0x7D7aC8d55A9bD4152b703011f3E61AB3bB0A5592"
+        "eth:0x7D7aC8d55A9bD4152b703011f3E61AB3bB0A5592"
      values.nominee:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      values.owner:
-        "0x246d38588b16Dd877c558b245e6D5a711C649fCF"
+        "eth:0x246d38588b16Dd877c558b245e6D5a711C649fCF"
      implementationNames.0x7D7aC8d55A9bD4152b703011f3E61AB3bB0A5592:
-        "Vault"
      implementationNames.eth:0x7D7aC8d55A9bD4152b703011f3E61AB3bB0A5592:
+        "Vault"
    }
```

```diff
    contract DAI Vault (Derive) (0x7E1d17b580dD4F89037DB331430eAEe8B8e50c91) {
    +++ description: None
      address:
-        "0x7E1d17b580dD4F89037DB331430eAEe8B8e50c91"
+        "eth:0x7E1d17b580dD4F89037DB331430eAEe8B8e50c91"
      values.nominee:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      values.owner:
-        "0x246d38588b16Dd877c558b245e6D5a711C649fCF"
+        "eth:0x246d38588b16Dd877c558b245e6D5a711C649fCF"
      implementationNames.0x7E1d17b580dD4F89037DB331430eAEe8B8e50c91:
-        "Vault"
      implementationNames.eth:0x7E1d17b580dD4F89037DB331430eAEe8B8e50c91:
+        "Vault"
    }
```

```diff
    contract weETH Vault (Derive) (0x8180EcCC825b692ef65FF099a0A387743788bf78) {
    +++ description: None
      address:
-        "0x8180EcCC825b692ef65FF099a0A387743788bf78"
+        "eth:0x8180EcCC825b692ef65FF099a0A387743788bf78"
      values.nominee:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      values.owner:
-        "0x246d38588b16Dd877c558b245e6D5a711C649fCF"
+        "eth:0x246d38588b16Dd877c558b245e6D5a711C649fCF"
      implementationNames.0x8180EcCC825b692ef65FF099a0A387743788bf78:
-        "Vault"
      implementationNames.eth:0x8180EcCC825b692ef65FF099a0A387743788bf78:
+        "Vault"
    }
```

```diff
    contract rsETH Vault (Polynomial) (0x8309E63F777805f362d42f5B5f2D1A20287d5Df2) {
    +++ description: None
      address:
-        "0x8309E63F777805f362d42f5B5f2D1A20287d5Df2"
+        "eth:0x8309E63F777805f362d42f5B5f2D1A20287d5Df2"
      implementationNames.0x8309E63F777805f362d42f5B5f2D1A20287d5Df2:
-        ""
      implementationNames.eth:0x8309E63F777805f362d42f5B5f2D1A20287d5Df2:
+        ""
    }
```

```diff
    contract weETH Vault (Polynomial) (0x847579e12CFb96a3357d9C51e374330af61716C2) {
    +++ description: None
      address:
-        "0x847579e12CFb96a3357d9C51e374330af61716C2"
+        "eth:0x847579e12CFb96a3357d9C51e374330af61716C2"
      implementationNames.0x847579e12CFb96a3357d9C51e374330af61716C2:
-        ""
      implementationNames.eth:0x847579e12CFb96a3357d9C51e374330af61716C2:
+        ""
    }
```

```diff
    contract cbBTC Vault (Kinto) (0x8F5247072e9580624Be243D4EC8cD3F3ABfF86B9) {
    +++ description: None
      address:
-        "0x8F5247072e9580624Be243D4EC8cD3F3ABfF86B9"
+        "eth:0x8F5247072e9580624Be243D4EC8cD3F3ABfF86B9"
      values.nominee:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      values.owner:
-        "0xf152Abda9E4ce8b134eF22Dc3C6aCe19C4895D82"
+        "eth:0xf152Abda9E4ce8b134eF22Dc3C6aCe19C4895D82"
      implementationNames.0x8F5247072e9580624Be243D4EC8cD3F3ABfF86B9:
-        "Vault"
      implementationNames.eth:0x8F5247072e9580624Be243D4EC8cD3F3ABfF86B9:
+        "Vault"
    }
```

```diff
    contract Socket (0x943AC2775928318653e91d350574436A1b9b16f9) {
    +++ description: None
      address:
-        "0x943AC2775928318653e91d350574436A1b9b16f9"
+        "eth:0x943AC2775928318653e91d350574436A1b9b16f9"
      values.capacitorFactory__:
-        "0x11Fbb9116801DB54bB51fF4dF423e34E8b45fc9a"
+        "eth:0x11Fbb9116801DB54bB51fF4dF423e34E8b45fc9a"
+++ description: Manages crosschain execution and -fees.
      values.executionManager__:
-        "0x98CAd9A205f1F7A7150241Ef2d565d1702BCe57C"
+        "eth:0x98CAd9A205f1F7A7150241Ef2d565d1702BCe57C"
      values.hasher__:
-        "0x5C71beE4a6b0D617D8c3d107D331292741789E27"
+        "eth:0x5C71beE4a6b0D617D8c3d107D331292741789E27"
      values.inboundSwitchboards.0:
-        "0x139f39DC7dC05F7aC2DB3DB6af4f2e1a9De7c287"
+        "eth:0x139f39DC7dC05F7aC2DB3DB6af4f2e1a9De7c287"
      values.inboundSwitchboards.1:
-        "0x053407DFA30267f6332f3c94a9e9F704A55e62CD"
+        "eth:0x053407DFA30267f6332f3c94a9e9F704A55e62CD"
      values.inboundSwitchboards.2:
-        "0xdf5f7dfDFc26ee5F629949e330bEf56906319CAe"
+        "eth:0xdf5f7dfDFc26ee5F629949e330bEf56906319CAe"
      values.inboundSwitchboards.3:
-        "0x0E674e057EC0FF97eeA57B6A350DBAAD22FE41BA"
+        "eth:0x0E674e057EC0FF97eeA57B6A350DBAAD22FE41BA"
      values.inboundSwitchboards.4:
-        "0xD5a83a40F262E2247e6566171f9ADc76b745F5cD"
+        "eth:0xD5a83a40F262E2247e6566171f9ADc76b745F5cD"
      values.nominee:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      values.outboundSwitchboards.0:
-        "0x139f39DC7dC05F7aC2DB3DB6af4f2e1a9De7c287"
+        "eth:0x139f39DC7dC05F7aC2DB3DB6af4f2e1a9De7c287"
      values.outboundSwitchboards.1:
-        "0x053407DFA30267f6332f3c94a9e9F704A55e62CD"
+        "eth:0x053407DFA30267f6332f3c94a9e9F704A55e62CD"
      values.outboundSwitchboards.2:
-        "0xdf5f7dfDFc26ee5F629949e330bEf56906319CAe"
+        "eth:0xdf5f7dfDFc26ee5F629949e330bEf56906319CAe"
      values.outboundSwitchboards.3:
-        "0x0E674e057EC0FF97eeA57B6A350DBAAD22FE41BA"
+        "eth:0x0E674e057EC0FF97eeA57B6A350DBAAD22FE41BA"
      values.outboundSwitchboards.4:
-        "0xD5a83a40F262E2247e6566171f9ADc76b745F5cD"
+        "eth:0xD5a83a40F262E2247e6566171f9ADc76b745F5cD"
      values.owner:
-        "0xeeF6520437A6545b4F325F6675C4CD49812d457b"
+        "eth:0xeeF6520437A6545b4F325F6675C4CD49812d457b"
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.0:
-        "0x7a6Edde81cdD9d75BC10D87C490b132c08bD426D"
+        "eth:0x7a6Edde81cdD9d75BC10D87C490b132c08bD426D"
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.1:
-        "0x200AF8FCdD5246D70B369A98143Ac8930A077B7A"
+        "eth:0x200AF8FCdD5246D70B369A98143Ac8930A077B7A"
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.2:
-        "0x22d8360eB04F46195c7B02A66658C375948d8A99"
+        "eth:0x22d8360eB04F46195c7B02A66658C375948d8A99"
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.3:
-        "0xA621Bc5A9d13D39eb098865B723CEee71BB5C181"
+        "eth:0xA621Bc5A9d13D39eb098865B723CEee71BB5C181"
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.4:
-        "0xceA535B2a0A690ebA76ac6A4AF2A1ee7B9Fed1aa"
+        "eth:0xceA535B2a0A690ebA76ac6A4AF2A1ee7B9Fed1aa"
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.5:
-        "0xCf814e58f1649F94d37E51f730D6bF72409fA09c"
+        "eth:0xCf814e58f1649F94d37E51f730D6bF72409fA09c"
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.6:
-        "0xf71A92D4bEFc2e18671c3b20377d45729790e880"
+        "eth:0xf71A92D4bEFc2e18671c3b20377d45729790e880"
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.7:
-        "0x1Eb392Aba52a2D933e58f7E86Ca96b9A3e2D8166"
+        "eth:0x1Eb392Aba52a2D933e58f7E86Ca96b9A3e2D8166"
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.8:
-        "0x5Afa7ddBcE8EE8862FDf5fD8c546BF32615d2D9B"
+        "eth:0x5Afa7ddBcE8EE8862FDf5fD8c546BF32615d2D9B"
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.9:
-        "0x02D53793b18d032Cd94d745F7586C6F66F83f8e3"
+        "eth:0x02D53793b18d032Cd94d745F7586C6F66F83f8e3"
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.10:
-        "0x3553c0102684c20e2f8192d6F013c7242710b4b3"
+        "eth:0x3553c0102684c20e2f8192d6F013c7242710b4b3"
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.11:
-        "0x280D208f0eE2f053A0441099bcBFf298bc8b9444"
+        "eth:0x280D208f0eE2f053A0441099bcBFf298bc8b9444"
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.12:
-        "0x37091ade7C4E1A914D3155449e25eE91DA08EbE4"
+        "eth:0x37091ade7C4E1A914D3155449e25eE91DA08EbE4"
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.13:
-        "0x68411d61adF1341A6392C87A93941FdD3EE7DF8E"
+        "eth:0x68411d61adF1341A6392C87A93941FdD3EE7DF8E"
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.14:
-        "0x8F4e67C61232167584333e23D7d67BD73d80a4F5"
+        "eth:0x8F4e67C61232167584333e23D7d67BD73d80a4F5"
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.15:
-        "0x4ab7B94BA3f3CF69354Eb2f6b5E856DC61e13660"
+        "eth:0x4ab7B94BA3f3CF69354Eb2f6b5E856DC61e13660"
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.16:
-        "0x727aD65db6aE99DB5Dbee8F202846DD6009bf6D5"
+        "eth:0x727aD65db6aE99DB5Dbee8F202846DD6009bf6D5"
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.17:
-        "0xdCcFb24f983586144c085426dbfa3414045E19a3"
+        "eth:0xdCcFb24f983586144c085426dbfa3414045E19a3"
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.18:
-        "0x6A769e25081396a49a6702758d0830920ac1163A"
+        "eth:0x6A769e25081396a49a6702758d0830920ac1163A"
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.19:
-        "0x2Dba37E679358125BaB2132dDF5133d7d66F7D06"
+        "eth:0x2Dba37E679358125BaB2132dDF5133d7d66F7D06"
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.20:
-        "0xaaDd94438f511aC22D35Ba7FC50849a9CD3e6AeF"
+        "eth:0xaaDd94438f511aC22D35Ba7FC50849a9CD3e6AeF"
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.21:
-        "0x998d7C2257591cC38383B4F91474c5346111f2E6"
+        "eth:0x998d7C2257591cC38383B4F91474c5346111f2E6"
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.22:
-        "0x223033E1F905eEd161a7B2EBeb786a158156fb8D"
+        "eth:0x223033E1F905eEd161a7B2EBeb786a158156fb8D"
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.23:
-        "0x7E6dA87FE69306CaAED675fFe4e7dC0FfE3bFe4D"
+        "eth:0x7E6dA87FE69306CaAED675fFe4e7dC0FfE3bFe4D"
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.24:
-        "0xCc958F84DaF36d3eC20BcBee7E99C073B882efc3"
+        "eth:0xCc958F84DaF36d3eC20BcBee7E99C073B882efc3"
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.25:
-        "0xF15d420bE7b27F1fA0D9487105658EdC3C0EA508"
+        "eth:0xF15d420bE7b27F1fA0D9487105658EdC3C0EA508"
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.26:
-        "0x3f66F272d33B764960779a301c4183306ae50e10"
+        "eth:0x3f66F272d33B764960779a301c4183306ae50e10"
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.27:
-        "0xB49b8AAcD8396C49d9045f6bAb101aB32c59643D"
+        "eth:0xB49b8AAcD8396C49d9045f6bAb101aB32c59643D"
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.28:
-        "0xb1178803A726e2077947754de9f2f0cbdA29A60F"
+        "eth:0xb1178803A726e2077947754de9f2f0cbdA29A60F"
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.29:
-        "0xE7ADE6Dda067c501A3d4C938c36c310c55FBcc27"
+        "eth:0xE7ADE6Dda067c501A3d4C938c36c310c55FBcc27"
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.30:
-        "0xAc00056920EfF02831CAf0baF116ADf6B42D9ad1"
+        "eth:0xAc00056920EfF02831CAf0baF116ADf6B42D9ad1"
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.31:
-        "0x83C6d6597891Ad48cF5e0BA901De55120C37C6bE"
+        "eth:0x83C6d6597891Ad48cF5e0BA901De55120C37C6bE"
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.32:
-        "0xe987a57DA7Ab112B1bDc7AA704E6EA943760d252"
+        "eth:0xe987a57DA7Ab112B1bDc7AA704E6EA943760d252"
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.33:
-        "0x935f1C29Db1155c3E0f39F644DF78DDDBD4757Ff"
+        "eth:0x935f1C29Db1155c3E0f39F644DF78DDDBD4757Ff"
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.34:
-        "0x266abd77Da7F877cdf93c0dd5782cC61Fa29ac96"
+        "eth:0x266abd77Da7F877cdf93c0dd5782cC61Fa29ac96"
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.35:
-        "0x73E0d4953c356a5Ca3A3D172739128776B2920b5"
+        "eth:0x73E0d4953c356a5Ca3A3D172739128776B2920b5"
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.36:
-        "0x642c4c33301EF5837ADa6E74F15Aa939f3951Fff"
+        "eth:0x642c4c33301EF5837ADa6E74F15Aa939f3951Fff"
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.37:
-        "0x170fFDe318B514B029E1B1eC4F096C7e1bDeaeA8"
+        "eth:0x170fFDe318B514B029E1B1eC4F096C7e1bDeaeA8"
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.38:
-        "0xF5992B6A0dEa32dCF6BE7bfAf762A4D94f139Ea7"
+        "eth:0xF5992B6A0dEa32dCF6BE7bfAf762A4D94f139Ea7"
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.39:
-        "0xE274dB6b891159547FbDC18b07412EE7F4B8d767"
+        "eth:0xE274dB6b891159547FbDC18b07412EE7F4B8d767"
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.40:
-        "0xC331BEeC6e36c8Df4FDD7e432de95863E7f80d67"
+        "eth:0xC331BEeC6e36c8Df4FDD7e432de95863E7f80d67"
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.41:
-        "0xE2c2291B80BFC8Bd0e4fc8Af196Ae5fc9136aeE0"
+        "eth:0xE2c2291B80BFC8Bd0e4fc8Af196Ae5fc9136aeE0"
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.42:
-        "0xdE9D8c2d465669c661672d7945D4d4f5407d22E2"
+        "eth:0xdE9D8c2d465669c661672d7945D4d4f5407d22E2"
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.43:
-        "0x32295769ea702BA9337EE5B65c6b42aFF75FEC62"
+        "eth:0x32295769ea702BA9337EE5B65c6b42aFF75FEC62"
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.44:
-        "0x388341d9E5A7D7d5accD738B2a31b0622E0c1b87"
+        "eth:0x388341d9E5A7D7d5accD738B2a31b0622E0c1b87"
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.45:
-        "0x3685306641fB02804E9384C3af09Fa9B62199d7e"
+        "eth:0x3685306641fB02804E9384C3af09Fa9B62199d7e"
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.46:
-        "0xA72bc51f800127621d4Ab541E7Bb70B86Fe88F0F"
+        "eth:0xA72bc51f800127621d4Ab541E7Bb70B86Fe88F0F"
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.47:
-        "0xDABF17a0f13290E85a347119deEb8539B41eF4eB"
+        "eth:0xDABF17a0f13290E85a347119deEb8539B41eF4eB"
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.48:
-        "0x876b81F74AD47cF10e5D62aAAc80f9E99f5587FC"
+        "eth:0x876b81F74AD47cF10e5D62aAAc80f9E99f5587FC"
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.49:
-        "0x519Bc0379CA9C4061a6006B4EAc419bC00017B3E"
+        "eth:0x519Bc0379CA9C4061a6006B4EAc419bC00017B3E"
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.50:
-        "0x2B93891dc80ab9696814615f553fd15a3b98d3a2"
+        "eth:0x2B93891dc80ab9696814615f553fd15a3b98d3a2"
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.51:
-        "0xd0711b9eBE84b778483709CDe62BacFDBAE13623"
+        "eth:0xd0711b9eBE84b778483709CDe62BacFDBAE13623"
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.52:
-        "0x716c339F41eAcfE2dc4775052411394A2Ed04743"
+        "eth:0x716c339F41eAcfE2dc4775052411394A2Ed04743"
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.53:
-        "0xDBa83C0C654DB1cd914FA2710bA743e925B53086"
+        "eth:0xDBa83C0C654DB1cd914FA2710bA743e925B53086"
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.54:
-        "0x8843557Fd6005d617A735731BF1bAb0461af55E4"
+        "eth:0x8843557Fd6005d617A735731BF1bAb0461af55E4"
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.55:
-        "0xb40FdECfCa4EF29CACc37222Ce4dB1fd0f561a00"
+        "eth:0xb40FdECfCa4EF29CACc37222Ce4dB1fd0f561a00"
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.56:
-        "0xA7384185a6428e6B0D33199256fE67b6fA5D8e40"
+        "eth:0xA7384185a6428e6B0D33199256fE67b6fA5D8e40"
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.57:
-        "0xfa8c07E28461eb7c65b33De024DB97eE4C052C97"
+        "eth:0xfa8c07E28461eb7c65b33De024DB97eE4C052C97"
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.58:
-        "0x1967F0F374Eed3c0152d9CF0541F814206964041"
+        "eth:0x1967F0F374Eed3c0152d9CF0541F814206964041"
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.59:
-        "0x12fBD04CB103c596B78110C70eEDF16821CBfcAE"
+        "eth:0x12fBD04CB103c596B78110C70eEDF16821CBfcAE"
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.60:
-        "0x1A9ba93F3cb22Ba7228D29607075F444e9ff515c"
+        "eth:0x1A9ba93F3cb22Ba7228D29607075F444e9ff515c"
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.61:
-        "0x9D0487D8d93Fc08938A39e355c676A8b032Dc52a"
+        "eth:0x9D0487D8d93Fc08938A39e355c676A8b032Dc52a"
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.62:
-        "0xAda55E4762c3663f90D55Dc6ACC073B012D1e6eA"
+        "eth:0xAda55E4762c3663f90D55Dc6ACC073B012D1e6eA"
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.63:
-        "0x3F574bc32a0bE9514010409FE8CF19e56fd7C83a"
+        "eth:0x3F574bc32a0bE9514010409FE8CF19e56fd7C83a"
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.64:
-        "0xBF3233Ef07B9552578987e2A2d25F760fBf192e5"
+        "eth:0xBF3233Ef07B9552578987e2A2d25F760fBf192e5"
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.65:
-        "0x54bd887d31A5119Bbc91426eD6289b8ACD2b7349"
+        "eth:0x54bd887d31A5119Bbc91426eD6289b8ACD2b7349"
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.66:
-        "0x6B3614474eE19FA9A2d6D2079a2D73c04E567310"
+        "eth:0x6B3614474eE19FA9A2d6D2079a2D73c04E567310"
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.67:
-        "0x4a43eD818411585fEAaf667a2D3E2605962084e0"
+        "eth:0x4a43eD818411585fEAaf667a2D3E2605962084e0"
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.68:
-        "0xcf2B4958e72Db99FDF844cD3992Daa2a8B7319c5"
+        "eth:0xcf2B4958e72Db99FDF844cD3992Daa2a8B7319c5"
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.69:
-        "0xEd0952283fdA768aA9d69eB7e895d49afcC3c0fe"
+        "eth:0xEd0952283fdA768aA9d69eB7e895d49afcC3c0fe"
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.70:
-        "0x83D8e248cAb7c6074dCc07EA25892F8022244c50"
+        "eth:0x83D8e248cAb7c6074dCc07EA25892F8022244c50"
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.71:
-        "0x91CE463148bD7695d4db41f4aA36088E502428F7"
+        "eth:0x91CE463148bD7695d4db41f4aA36088E502428F7"
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.72:
-        "0xcb473D87A56b4609A695753711F727E5c4335cCf"
+        "eth:0xcb473D87A56b4609A695753711F727E5c4335cCf"
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.73:
-        "0x1aE19B11B71b1e232c43Fe65cB1d31E139Ac7A63"
+        "eth:0x1aE19B11B71b1e232c43Fe65cB1d31E139Ac7A63"
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.74:
-        "0x4E83292d5cacf05B85bED2c3D4a6056F42EE1738"
+        "eth:0x4E83292d5cacf05B85bED2c3D4a6056F42EE1738"
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.75:
-        "0xa1D11b141bb47eDb2c69B8ced4EFe80f62D1C276"
+        "eth:0xa1D11b141bb47eDb2c69B8ced4EFe80f62D1C276"
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.76:
-        "0x083Add2A9afa97Efb6412b293145ce965eCE3600"
+        "eth:0x083Add2A9afa97Efb6412b293145ce965eCE3600"
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.77:
-        "0x254691C06Da387c1050C726cF498eFdA89083820"
+        "eth:0x254691C06Da387c1050C726cF498eFdA89083820"
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.78:
-        "0x37C24e7081eb7f2B16bde81b556d082c0839F754"
+        "eth:0x37C24e7081eb7f2B16bde81b556d082c0839F754"
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.79:
-        "0x50D46c3BB529276aDe59a6678C14302D6B61C853"
+        "eth:0x50D46c3BB529276aDe59a6678C14302D6B61C853"
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.80:
-        "0x7Eee3241eC98ED0B47c8Bc0e9E3327B541BCDc1D"
+        "eth:0x7Eee3241eC98ED0B47c8Bc0e9E3327B541BCDc1D"
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.81:
-        "0x00CE54B988D8C44bFCae4026C17c37c69C490A12"
+        "eth:0x00CE54B988D8C44bFCae4026C17c37c69C490A12"
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.82:
-        "0xaDA48ab8705Eb3904e5FA65D5622cd237a2341FF"
+        "eth:0xaDA48ab8705Eb3904e5FA65D5622cd237a2341FF"
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.83:
-        "0x49d446506D0f2db507AB4804563be9331BBc80E7"
+        "eth:0x49d446506D0f2db507AB4804563be9331BBc80E7"
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.84:
-        "0x1b882b9E87ABd7DD9B9b689Bee10Ed6a040033D0"
+        "eth:0x1b882b9E87ABd7DD9B9b689Bee10Ed6a040033D0"
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.85:
-        "0x3F0dAfEB6386c710617180b376c118D7EcD6aC89"
+        "eth:0x3F0dAfEB6386c710617180b376c118D7EcD6aC89"
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.86:
-        "0x42F23C6d344d0322e13f254B9a8E187335AFB409"
+        "eth:0x42F23C6d344d0322e13f254B9a8E187335AFB409"
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.87:
-        "0x56705F7F12D4e0433e26a20298fCd3532226d744"
+        "eth:0x56705F7F12D4e0433e26a20298fCd3532226d744"
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.88:
-        "0xA07EB173d58F7aF2b0267F2B5f6a091E01c17f85"
+        "eth:0xA07EB173d58F7aF2b0267F2B5f6a091E01c17f85"
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.89:
-        "0xe38Dccb8Bd138c326E3Df926ADD9dE71a442837F"
+        "eth:0xe38Dccb8Bd138c326E3Df926ADD9dE71a442837F"
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.90:
-        "0x457379de638CAFeB1759a22457fe893b288E2e89"
+        "eth:0x457379de638CAFeB1759a22457fe893b288E2e89"
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.91:
-        "0x2D733e70A377FcFc249d273095250762A93F3820"
+        "eth:0x2D733e70A377FcFc249d273095250762A93F3820"
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.92:
-        "0xdb1c2F432e51824b33b9269C4b1Ff6190c1e5F35"
+        "eth:0xdb1c2F432e51824b33b9269C4b1Ff6190c1e5F35"
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.93:
-        "0xd48A35a853858e344aFCbEcCDBf8FCbFaF8e1501"
+        "eth:0xd48A35a853858e344aFCbEcCDBf8FCbFaF8e1501"
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.94:
-        "0xF391E487FE3958F0728436Af84455Fd4eBC9c7c9"
+        "eth:0xF391E487FE3958F0728436Af84455Fd4eBC9c7c9"
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.95:
-        "0x55033cb4583f5526704Ee4C197e99504E504712c"
+        "eth:0x55033cb4583f5526704Ee4C197e99504E504712c"
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.96:
-        "0xc706c946623C70B294b91Bd4961E91FaF7A74317"
+        "eth:0xc706c946623C70B294b91Bd4961E91FaF7A74317"
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.97:
-        "0x17a8Be056ca13B072AB908126D4BC38e09c7cc39"
+        "eth:0x17a8Be056ca13B072AB908126D4BC38e09c7cc39"
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.98:
-        "0xBc978f47AD1122bdFE85855fcc40b3afdF4b5df3"
+        "eth:0xBc978f47AD1122bdFE85855fcc40b3afdF4b5df3"
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.99:
-        "0x094570E556C8E58119E21f47759F02F50Ae3bB49"
+        "eth:0x094570E556C8E58119E21f47759F02F50Ae3bB49"
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.100:
-        "0x895b6c1413243562128a9281a7f8891640Ca073f"
+        "eth:0x895b6c1413243562128a9281a7f8891640Ca073f"
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.101:
-        "0x88A05556Af1a8a5BB5964c46Be9D56C379a5E155"
+        "eth:0x88A05556Af1a8a5BB5964c46Be9D56C379a5E155"
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.102:
-        "0x76ddfc271089e58Af68D8597D41aEF52Fb53EC3D"
+        "eth:0x76ddfc271089e58Af68D8597D41aEF52Fb53EC3D"
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.103:
-        "0x80f5143AF6BF51B38C038BaFF71465Be9b48cAEe"
+        "eth:0x80f5143AF6BF51B38C038BaFF71465Be9b48cAEe"
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.104:
-        "0xFAB1efe6cA9435faEf9e29f40E575e27A74373A9"
+        "eth:0xFAB1efe6cA9435faEf9e29f40E575e27A74373A9"
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.105:
-        "0xE88F6b194BD3b43013710A785DDFF41454A19537"
+        "eth:0xE88F6b194BD3b43013710A785DDFF41454A19537"
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.106:
-        "0xCF83efEe74f61771AF78b05DeA847773D3952C33"
+        "eth:0xCF83efEe74f61771AF78b05DeA847773D3952C33"
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.107:
-        "0x7FBCd72B6368f1771C9F6Ee16502C19b0AADBa1D"
+        "eth:0x7FBCd72B6368f1771C9F6Ee16502C19b0AADBa1D"
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.108:
-        "0xE3255bb716d8BA81aA97Ff20c75b404D9844CBE1"
+        "eth:0xE3255bb716d8BA81aA97Ff20c75b404D9844CBE1"
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.109:
-        "0xf1807B621efC3B072d1203dD28C880BBEDc56161"
+        "eth:0xf1807B621efC3B072d1203dD28C880BBEDc56161"
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.110:
-        "0x92469EEf05a071B0e56275b23597b1b701C15a71"
+        "eth:0x92469EEf05a071B0e56275b23597b1b701C15a71"
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.111:
-        "0x6dED17643D7acFc0bE0e79ff6C4762F12AA5516E"
+        "eth:0x6dED17643D7acFc0bE0e79ff6C4762F12AA5516E"
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.112:
-        "0xCE0AB493716d96C0979E0B708BeF1915F3B07e01"
+        "eth:0xCE0AB493716d96C0979E0B708BeF1915F3B07e01"
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.113:
-        "0x3390ca7A0D7C80871B05C3FeBbeEee91307a35ba"
+        "eth:0x3390ca7A0D7C80871B05C3FeBbeEee91307a35ba"
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.114:
-        "0x7E34B138e507570bDCC9b99230cFaA2745F0222C"
+        "eth:0x7E34B138e507570bDCC9b99230cFaA2745F0222C"
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.115:
-        "0x5deeAb623C6091A0A59E6d041dAAE9bDeFBfC203"
+        "eth:0x5deeAb623C6091A0A59E6d041dAAE9bDeFBfC203"
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.116:
-        "0x65A9b862671de5Df85EcE387220C6b10a17230f7"
+        "eth:0x65A9b862671de5Df85EcE387220C6b10a17230f7"
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.117:
-        "0xC3875afddEde146DCfED7e72b2Ad12B853CA1241"
+        "eth:0xC3875afddEde146DCfED7e72b2Ad12B853CA1241"
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.118:
-        "0xBbA3095f6ACA17ff23Df466833D621cc91Db7675"
+        "eth:0xBbA3095f6ACA17ff23Df466833D621cc91Db7675"
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.119:
-        "0xb9703b625c3B846B58DFdaDBceF77e34a1C59965"
+        "eth:0xb9703b625c3B846B58DFdaDBceF77e34a1C59965"
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.120:
-        "0xf7a4a34d64E8fE4FCCffE2f3C985D43409Aa8c9a"
+        "eth:0xf7a4a34d64E8fE4FCCffE2f3C985D43409Aa8c9a"
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.121:
-        "0x29ACa1443F28DceDEBf99173b37b5C1e814cA548"
+        "eth:0x29ACa1443F28DceDEBf99173b37b5C1e814cA548"
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.122:
-        "0x5366D4acCC96Ed297e30B8702FBC9b85daA3a459"
+        "eth:0x5366D4acCC96Ed297e30B8702FBC9b85daA3a459"
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.123:
-        "0xFb0c284CD9929eB5139eB027aD7497097Ba25C87"
+        "eth:0xFb0c284CD9929eB5139eB027aD7497097Ba25C87"
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.124:
-        "0x008244E37A90E090dc4abD70F37195075cbE8453"
+        "eth:0x008244E37A90E090dc4abD70F37195075cbE8453"
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.125:
-        "0xB1b7BC699cAEcB941e7377065c7CE82039889603"
+        "eth:0xB1b7BC699cAEcB941e7377065c7CE82039889603"
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.126:
-        "0x0c39a1b042AbfC68d10B78081AFE3F58a6523A35"
+        "eth:0x0c39a1b042AbfC68d10B78081AFE3F58a6523A35"
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.127:
-        "0x76C9129b44c637500c88760ADd2EbEF07472b549"
+        "eth:0x76C9129b44c637500c88760ADd2EbEF07472b549"
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.128:
-        "0x10ed00FDb26Ec6BE0183e6f14D8275d5898B0721"
+        "eth:0x10ed00FDb26Ec6BE0183e6f14D8275d5898B0721"
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.129:
-        "0x9d13F2b3B694DE6a1cF58edb5044454CAE3B84E4"
+        "eth:0x9d13F2b3B694DE6a1cF58edb5044454CAE3B84E4"
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.130:
-        "0xab722902681A260762084A78A2d8f19CfA6A46Ef"
+        "eth:0xab722902681A260762084A78A2d8f19CfA6A46Ef"
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.131:
-        "0x5D5a2999E91A336CA99da0cB636898ccB521f40a"
+        "eth:0x5D5a2999E91A336CA99da0cB636898ccB521f40a"
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.132:
-        "0xb5d5E523905bB397bCAfB36B252535a255d3E23C"
+        "eth:0xb5d5E523905bB397bCAfB36B252535a255d3E23C"
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.133:
-        "0x1734067c2CDcFb81ef9672F80DA2D7bfC2CFAE73"
+        "eth:0x1734067c2CDcFb81ef9672F80DA2D7bfC2CFAE73"
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.134:
-        "0x12a4CC40a8F89E40F8C849c2F89741D5C9590a14"
+        "eth:0x12a4CC40a8F89E40F8C849c2F89741D5C9590a14"
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.135:
-        "0x94104d7801f30d2f9069118C65Fe63A3A11515B1"
+        "eth:0x94104d7801f30d2f9069118C65Fe63A3A11515B1"
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.136:
-        "0xA2bE759B86CeA53372C3e9a882047cdC3884D568"
+        "eth:0xA2bE759B86CeA53372C3e9a882047cdC3884D568"
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.137:
-        "0x15f70f64438603e5872A4E81c7a8B5edB5D70d93"
+        "eth:0x15f70f64438603e5872A4E81c7a8B5edB5D70d93"
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.138:
-        "0x75695e8A56405dC60a0aFf07d1AF01A0baCA7188"
+        "eth:0x75695e8A56405dC60a0aFf07d1AF01A0baCA7188"
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.139:
-        "0x1a0e7Efa0F74703A930B2b1Cb6565b1d8981dd85"
+        "eth:0x1a0e7Efa0F74703A930B2b1Cb6565b1d8981dd85"
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.140:
-        "0x3Deb3254730eEF7c50fb5b133CA0EaeA2e59127d"
+        "eth:0x3Deb3254730eEF7c50fb5b133CA0EaeA2e59127d"
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.141:
-        "0x95c879322BA01e1c7Fe5EB3F3724C49C6aF7e426"
+        "eth:0x95c879322BA01e1c7Fe5EB3F3724C49C6aF7e426"
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.142:
-        "0x412CC246d703598e3705B9536B4Ec3c2039f6e5E"
+        "eth:0x412CC246d703598e3705B9536B4Ec3c2039f6e5E"
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.143:
-        "0x833a7FA0Ff734b2BA01e8d2126e127cf8f29eFaD"
+        "eth:0x833a7FA0Ff734b2BA01e8d2126e127cf8f29eFaD"
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.144:
-        "0x04bc61DBd949f068387cfC7a7fB95555bc66F5C5"
+        "eth:0x04bc61DBd949f068387cfC7a7fB95555bc66F5C5"
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.145:
-        "0x9ED094fDe2a31BEd0278a4cfdb5528473baFe5a8"
+        "eth:0x9ED094fDe2a31BEd0278a4cfdb5528473baFe5a8"
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.146:
-        "0xD3a00E95658b05eBac3246e84f6583251dEd5D93"
+        "eth:0xD3a00E95658b05eBac3246e84f6583251dEd5D93"
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.147:
-        "0x88444394f970B6F21C4f5101003ea513dE3E5406"
+        "eth:0x88444394f970B6F21C4f5101003ea513dE3E5406"
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.148:
-        "0x67c97Bd542B3a7F1F1EcF85CBC4409421ccAe971"
+        "eth:0x67c97Bd542B3a7F1F1EcF85CBC4409421ccAe971"
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.149:
-        "0xBEF69d0acC388091c7C9702aCbFB3b8A873e239e"
+        "eth:0xBEF69d0acC388091c7C9702aCbFB3b8A873e239e"
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.150:
-        "0x96E1e9c80619D2038afe30450b3cBeCb2A7D94cd"
+        "eth:0x96E1e9c80619D2038afe30450b3cBeCb2A7D94cd"
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.151:
-        "0xB4e78DAEaE4aA911f2427FF4af4B10AFe70D9891"
+        "eth:0xB4e78DAEaE4aA911f2427FF4af4B10AFe70D9891"
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.152:
-        "0x134643Df54DCaaAf343505361D1Eac58A7400b3d"
+        "eth:0x134643Df54DCaaAf343505361D1Eac58A7400b3d"
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.153:
-        "0x8E8D89410000A993d2537d26366e1C3010AB90ff"
+        "eth:0x8E8D89410000A993d2537d26366e1C3010AB90ff"
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.154:
-        "0x5E72430EC945CCc183c34e2860FFC2b5bac712c2"
+        "eth:0x5E72430EC945CCc183c34e2860FFC2b5bac712c2"
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.155:
-        "0x15CEcd5190A43C7798dD2058308781D0662e678E"
+        "eth:0x15CEcd5190A43C7798dD2058308781D0662e678E"
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.156:
-        "0x7163FaC3fc420923810cCA5d15949c1523F69B4a"
+        "eth:0x7163FaC3fc420923810cCA5d15949c1523F69B4a"
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.157:
-        "0x432684E7e764343c836d9c78b9245aa774323E40"
+        "eth:0x432684E7e764343c836d9c78b9245aa774323E40"
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.158:
-        "0x4B4ed8b47EA37FB0230472fAdaFAF12658f05Ad7"
+        "eth:0x4B4ed8b47EA37FB0230472fAdaFAF12658f05Ad7"
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.159:
-        "0x52DB079d07fb8C2F5FA158C3311d877f3769B01e"
+        "eth:0x52DB079d07fb8C2F5FA158C3311d877f3769B01e"
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.160:
-        "0x376f76B657a384e980F6Ea96e885654eC8F3ED61"
+        "eth:0x376f76B657a384e980F6Ea96e885654eC8F3ED61"
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.161:
-        "0xB1dfE248EEfa405654b9ff7D470403452180b862"
+        "eth:0xB1dfE248EEfa405654b9ff7D470403452180b862"
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.162:
-        "0xa5D1802fBd730c158f8F6E8401c4d8b3001A8d33"
+        "eth:0xa5D1802fBd730c158f8F6E8401c4d8b3001A8d33"
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.163:
-        "0x3645C506F4E22eA2380B8c4fd5fA914F36dfc3b0"
+        "eth:0x3645C506F4E22eA2380B8c4fd5fA914F36dfc3b0"
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.164:
-        "0x4CC07BCB7949CAbAb7b19EC94267AF5C0e47AEdA"
+        "eth:0x4CC07BCB7949CAbAb7b19EC94267AF5C0e47AEdA"
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.165:
-        "0x47D5E4eCae70c9AD12eaDF469344B6B52a0ebCcE"
+        "eth:0x47D5E4eCae70c9AD12eaDF469344B6B52a0ebCcE"
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.166:
-        "0xec837c413c25B6952845551183ba8900cc543b95"
+        "eth:0xec837c413c25B6952845551183ba8900cc543b95"
      values.transmitManager__:
-        "0xeD037aFBffC65a94E9CC592947E851FB2f730341"
+        "eth:0xeD037aFBffC65a94E9CC592947E851FB2f730341"
      implementationNames.0x943AC2775928318653e91d350574436A1b9b16f9:
-        "Socket"
      implementationNames.eth:0x943AC2775928318653e91d350574436A1b9b16f9:
+        "Socket"
    }
```

```diff
    EOA KintsugiFoundation (0x94561e98DD5E55271f91A103e4979aa6C493745E) {
    +++ description: None
      address:
-        "0x94561e98DD5E55271f91A103e4979aa6C493745E"
+        "eth:0x94561e98DD5E55271f91A103e4979aa6C493745E"
    }
```

```diff
    contract ETHFI Vault (Kinto) (0x95d60E34aB2E626407d98dF8C240e6174e5D37E5) {
    +++ description: None
      address:
-        "0x95d60E34aB2E626407d98dF8C240e6174e5D37E5"
+        "eth:0x95d60E34aB2E626407d98dF8C240e6174e5D37E5"
      values.nominee:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      values.owner:
-        "0xf152Abda9E4ce8b134eF22Dc3C6aCe19C4895D82"
+        "eth:0xf152Abda9E4ce8b134eF22Dc3C6aCe19C4895D82"
      implementationNames.0x95d60E34aB2E626407d98dF8C240e6174e5D37E5:
-        "Vault"
      implementationNames.eth:0x95d60E34aB2E626407d98dF8C240e6174e5D37E5:
+        "Vault"
    }
```

```diff
    contract ExecutionManager (0x98CAd9A205f1F7A7150241Ef2d565d1702BCe57C) {
    +++ description: None
      address:
-        "0x98CAd9A205f1F7A7150241Ef2d565d1702BCe57C"
+        "eth:0x98CAd9A205f1F7A7150241Ef2d565d1702BCe57C"
      values.nominee:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      values.owner:
-        "0xeeF6520437A6545b4F325F6675C4CD49812d457b"
+        "eth:0xeeF6520437A6545b4F325F6675C4CD49812d457b"
      values.signatureVerifier__:
-        "0xf1ABF110d1B6ff0E2e8C05dd64FBF9eBA4d8af98"
+        "eth:0xf1ABF110d1B6ff0E2e8C05dd64FBF9eBA4d8af98"
      values.socket__:
-        "0x943AC2775928318653e91d350574436A1b9b16f9"
+        "eth:0x943AC2775928318653e91d350574436A1b9b16f9"
      implementationNames.0x98CAd9A205f1F7A7150241Ef2d565d1702BCe57C:
-        "ExecutionManagerDF"
      implementationNames.eth:0x98CAd9A205f1F7A7150241Ef2d565d1702BCe57C:
+        "ExecutionManagerDF"
    }
```

```diff
    EOA  (0x9eab2223d84060E212354BfA620BF687b6E9Ae20) {
    +++ description: None
      address:
-        "0x9eab2223d84060E212354BfA620BF687b6E9Ae20"
+        "eth:0x9eab2223d84060E212354BfA620BF687b6E9Ae20"
    }
```

```diff
    EOA  (0x9f76043B23125024Ce5f0Fb4AE707482107dd2a8) {
    +++ description: None
      address:
-        "0x9f76043B23125024Ce5f0Fb4AE707482107dd2a8"
+        "eth:0x9f76043B23125024Ce5f0Fb4AE707482107dd2a8"
    }
```

```diff
    contract SOL Vault (Kinto) (0xA2bc0DaA9BF98820632bCa0663a9616f6bC180f8) {
    +++ description: None
      address:
-        "0xA2bc0DaA9BF98820632bCa0663a9616f6bC180f8"
+        "eth:0xA2bc0DaA9BF98820632bCa0663a9616f6bC180f8"
      values.nominee:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      values.owner:
-        "0xf152Abda9E4ce8b134eF22Dc3C6aCe19C4895D82"
+        "eth:0xf152Abda9E4ce8b134eF22Dc3C6aCe19C4895D82"
      implementationNames.0xA2bc0DaA9BF98820632bCa0663a9616f6bC180f8:
-        "Vault"
      implementationNames.eth:0xA2bc0DaA9BF98820632bCa0663a9616f6bC180f8:
+        "Vault"
    }
```

```diff
    contract LINK Vault (Kinto) (0xA6Ae29Ce5c38DFE0Dd95B716748ac747f31E4013) {
    +++ description: None
      address:
-        "0xA6Ae29Ce5c38DFE0Dd95B716748ac747f31E4013"
+        "eth:0xA6Ae29Ce5c38DFE0Dd95B716748ac747f31E4013"
      values.nominee:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      values.owner:
-        "0xf152Abda9E4ce8b134eF22Dc3C6aCe19C4895D82"
+        "eth:0xf152Abda9E4ce8b134eF22Dc3C6aCe19C4895D82"
      implementationNames.0xA6Ae29Ce5c38DFE0Dd95B716748ac747f31E4013:
-        "Vault"
      implementationNames.eth:0xA6Ae29Ce5c38DFE0Dd95B716748ac747f31E4013:
+        "Vault"
    }
```

```diff
    contract LOOKS Vault (Blast) (0xa83B4006c16DAeAb2718294696c0122519195137) {
    +++ description: None
      address:
-        "0xa83B4006c16DAeAb2718294696c0122519195137"
+        "eth:0xa83B4006c16DAeAb2718294696c0122519195137"
      values.nominee:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      values.owner:
-        "0xC8C57e4C73c71f72cA0a7e043E5D2D144F98ef13"
+        "eth:0xC8C57e4C73c71f72cA0a7e043E5D2D144F98ef13"
      implementationNames.0xa83B4006c16DAeAb2718294696c0122519195137:
-        "Vault"
      implementationNames.eth:0xa83B4006c16DAeAb2718294696c0122519195137:
+        "Vault"
    }
```

```diff
    contract USDe Vault (Reya) (0xaA2f2B6cD33Eaabb795c6DB60AAec599C8450F35) {
    +++ description: None
      address:
-        "0xaA2f2B6cD33Eaabb795c6DB60AAec599C8450F35"
+        "eth:0xaA2f2B6cD33Eaabb795c6DB60AAec599C8450F35"
      values.nominee:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      values.owner:
-        "0xB0BBff6311B7F245761A7846d3Ce7B1b100C1836"
+        "eth:0xB0BBff6311B7F245761A7846d3Ce7B1b100C1836"
      implementationNames.0xaA2f2B6cD33Eaabb795c6DB60AAec599C8450F35:
-        "Vault"
      implementationNames.eth:0xaA2f2B6cD33Eaabb795c6DB60AAec599C8450F35:
+        "Vault"
    }
```

```diff
    EOA  (0xB0BBff6311B7F245761A7846d3Ce7B1b100C1836) {
    +++ description: None
      address:
-        "0xB0BBff6311B7F245761A7846d3Ce7B1b100C1836"
+        "eth:0xB0BBff6311B7F245761A7846d3Ce7B1b100C1836"
    }
```

```diff
    contract xSolvBTC Vault (Derive) (0xB592512153c22F5Ba573b0c3E04cAB99d4Cd8856) {
    +++ description: None
      address:
-        "0xB592512153c22F5Ba573b0c3E04cAB99d4Cd8856"
+        "eth:0xB592512153c22F5Ba573b0c3E04cAB99d4Cd8856"
      values.nominee:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      values.owner:
-        "0x246d38588b16Dd877c558b245e6D5a711C649fCF"
+        "eth:0x246d38588b16Dd877c558b245e6D5a711C649fCF"
      implementationNames.0xB592512153c22F5Ba573b0c3E04cAB99d4Cd8856:
-        "Vault"
      implementationNames.eth:0xB592512153c22F5Ba573b0c3E04cAB99d4Cd8856:
+        "Vault"
    }
```

```diff
    EOA  (0xb69F2341F008f673F757B49104c165C8022CD0df) {
    +++ description: None
      address:
-        "0xb69F2341F008f673F757B49104c165C8022CD0df"
+        "eth:0xb69F2341F008f673F757B49104c165C8022CD0df"
    }
```

```diff
    EOA  (0xb88D64a7E2ec1b137c969Adf2EC65f933d631F65) {
    +++ description: None
      address:
-        "0xb88D64a7E2ec1b137c969Adf2EC65f933d631F65"
+        "eth:0xb88D64a7E2ec1b137c969Adf2EC65f933d631F65"
    }
```

```diff
    EOA MamoriLabs (0xc1f4D15C16A1f3555E0a5F7AeFD1e17AD4aaf40B) {
    +++ description: None
      address:
-        "0xc1f4D15C16A1f3555E0a5F7AeFD1e17AD4aaf40B"
+        "eth:0xc1f4D15C16A1f3555E0a5F7AeFD1e17AD4aaf40B"
    }
```

```diff
    EOA  (0xc31C4549356d46c37021393EeEb6f704B38061eC) {
    +++ description: None
      address:
-        "0xc31C4549356d46c37021393EeEb6f704B38061eC"
+        "eth:0xc31C4549356d46c37021393EeEb6f704B38061eC"
    }
```

```diff
    contract wstETH Vault (Kinto) (0xc5d01939Af7Ce9Ffc505F0bb36eFeDde7920f2dc) {
    +++ description: None
      address:
-        "0xc5d01939Af7Ce9Ffc505F0bb36eFeDde7920f2dc"
+        "eth:0xc5d01939Af7Ce9Ffc505F0bb36eFeDde7920f2dc"
      values.nominee:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      values.owner:
-        "0xf152Abda9E4ce8b134eF22Dc3C6aCe19C4895D82"
+        "eth:0xf152Abda9E4ce8b134eF22Dc3C6aCe19C4895D82"
      implementationNames.0xc5d01939Af7Ce9Ffc505F0bb36eFeDde7920f2dc:
-        "Vault"
      implementationNames.eth:0xc5d01939Af7Ce9Ffc505F0bb36eFeDde7920f2dc:
+        "Vault"
    }
```

```diff
    contract sUSDe Vault (Polynomial) (0xC6cfb996A7CFEB89813A68CD13942CD75553032b) {
    +++ description: None
      address:
-        "0xC6cfb996A7CFEB89813A68CD13942CD75553032b"
+        "eth:0xC6cfb996A7CFEB89813A68CD13942CD75553032b"
      values.nominee:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      values.owner:
-        "0x9f76043B23125024Ce5f0Fb4AE707482107dd2a8"
+        "eth:0x9f76043B23125024Ce5f0Fb4AE707482107dd2a8"
      implementationNames.0xC6cfb996A7CFEB89813A68CD13942CD75553032b:
-        "Vault"
      implementationNames.eth:0xC6cfb996A7CFEB89813A68CD13942CD75553032b:
+        "Vault"
    }
```

```diff
    contract USDT Vault (Polynomial) (0xc7C71E39C2F87b0a70C434Ed5bc0497F4cd55bfB) {
    +++ description: None
      address:
-        "0xc7C71E39C2F87b0a70C434Ed5bc0497F4cd55bfB"
+        "eth:0xc7C71E39C2F87b0a70C434Ed5bc0497F4cd55bfB"
      implementationNames.0xc7C71E39C2F87b0a70C434Ed5bc0497F4cd55bfB:
-        ""
      implementationNames.eth:0xc7C71E39C2F87b0a70C434Ed5bc0497F4cd55bfB:
+        ""
    }
```

```diff
    contract LooksRareMultisig (0xC8C57e4C73c71f72cA0a7e043E5D2D144F98ef13) {
    +++ description: None
      address:
-        "0xC8C57e4C73c71f72cA0a7e043E5D2D144F98ef13"
+        "eth:0xC8C57e4C73c71f72cA0a7e043E5D2D144F98ef13"
      values.$implementation:
-        "0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552"
+        "eth:0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552"
      values.$members.0:
-        "0xDA9854b190A54c6c5088AB43a274caFAFF7cF369"
+        "eth:0xDA9854b190A54c6c5088AB43a274caFAFF7cF369"
      values.$members.1:
-        "0x45d7A9bFC82Ca6AE410E4410f44c57a2b9F8Ec58"
+        "eth:0x45d7A9bFC82Ca6AE410E4410f44c57a2b9F8Ec58"
      values.$members.2:
-        "0xb69F2341F008f673F757B49104c165C8022CD0df"
+        "eth:0xb69F2341F008f673F757B49104c165C8022CD0df"
      values.$members.3:
-        "0x5ECfd6968593159e5b4f06832857943409122849"
+        "eth:0x5ECfd6968593159e5b4f06832857943409122849"
      values.$members.4:
-        "0x9eab2223d84060E212354BfA620BF687b6E9Ae20"
+        "eth:0x9eab2223d84060E212354BfA620BF687b6E9Ae20"
      implementationNames.0xC8C57e4C73c71f72cA0a7e043E5D2D144F98ef13:
-        "GnosisSafeProxy"
      implementationNames.0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552:
-        "GnosisSafe"
      implementationNames.eth:0xC8C57e4C73c71f72cA0a7e043E5D2D144F98ef13:
+        "GnosisSafeProxy"
      implementationNames.eth:0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552:
+        "GnosisSafe"
    }
```

```diff
    contract ONDO Vault (Kinto) (0xCa1AaCB6E16E7d50c6442f9eD6faEe5dDa638DaD) {
    +++ description: None
      address:
-        "0xCa1AaCB6E16E7d50c6442f9eD6faEe5dDa638DaD"
+        "eth:0xCa1AaCB6E16E7d50c6442f9eD6faEe5dDa638DaD"
      values.nominee:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      values.owner:
-        "0x660ad4B5A74130a4796B4d54BC6750Ae93C86e6c"
+        "eth:0x660ad4B5A74130a4796B4d54BC6750Ae93C86e6c"
      implementationNames.0xCa1AaCB6E16E7d50c6442f9eD6faEe5dDa638DaD:
-        "Vault"
      implementationNames.eth:0xCa1AaCB6E16E7d50c6442f9eD6faEe5dDa638DaD:
+        "Vault"
    }
```

```diff
    contract XAUt Vault (Kinto) (0xd04Bc056BE36a6127267E4F71d3b43D1BEEfE8bF) {
    +++ description: None
      address:
-        "0xd04Bc056BE36a6127267E4F71d3b43D1BEEfE8bF"
+        "eth:0xd04Bc056BE36a6127267E4F71d3b43D1BEEfE8bF"
      values.nominee:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      values.owner:
-        "0xf152Abda9E4ce8b134eF22Dc3C6aCe19C4895D82"
+        "eth:0xf152Abda9E4ce8b134eF22Dc3C6aCe19C4895D82"
      implementationNames.0xd04Bc056BE36a6127267E4F71d3b43D1BEEfE8bF:
-        "Vault"
      implementationNames.eth:0xd04Bc056BE36a6127267E4F71d3b43D1BEEfE8bF:
+        "Vault"
    }
```

```diff
    contract SPX Vault (Kinto) (0xd1228C6CB94a670F30D5ACb1340a9d96aC30e6A8) {
    +++ description: None
      address:
-        "0xd1228C6CB94a670F30D5ACb1340a9d96aC30e6A8"
+        "eth:0xd1228C6CB94a670F30D5ACb1340a9d96aC30e6A8"
      values.nominee:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      values.owner:
-        "0xf152Abda9E4ce8b134eF22Dc3C6aCe19C4895D82"
+        "eth:0xf152Abda9E4ce8b134eF22Dc3C6aCe19C4895D82"
      implementationNames.0xd1228C6CB94a670F30D5ACb1340a9d96aC30e6A8:
-        "Vault"
      implementationNames.eth:0xd1228C6CB94a670F30D5ACb1340a9d96aC30e6A8:
+        "Vault"
    }
```

```diff
    contract WBTC Vault (Kinto) (0xd4964E8A405D396d94825f4d0f5dEDD8741C1d36) {
    +++ description: None
      address:
-        "0xd4964E8A405D396d94825f4d0f5dEDD8741C1d36"
+        "eth:0xd4964E8A405D396d94825f4d0f5dEDD8741C1d36"
      values.nominee:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      values.owner:
-        "0xf152Abda9E4ce8b134eF22Dc3C6aCe19C4895D82"
+        "eth:0xf152Abda9E4ce8b134eF22Dc3C6aCe19C4895D82"
      implementationNames.0xd4964E8A405D396d94825f4d0f5dEDD8741C1d36:
-        "Vault"
      implementationNames.eth:0xd4964E8A405D396d94825f4d0f5dEDD8741C1d36:
+        "Vault"
    }
```

```diff
    contract WETH Vault (Derive) (0xD4efe33C66B8CdE33B8896a2126E41e5dB571b7e) {
    +++ description: None
      address:
-        "0xD4efe33C66B8CdE33B8896a2126E41e5dB571b7e"
+        "eth:0xD4efe33C66B8CdE33B8896a2126E41e5dB571b7e"
      values.nominee:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      values.owner:
-        "0x246d38588b16Dd877c558b245e6D5a711C649fCF"
+        "eth:0x246d38588b16Dd877c558b245e6D5a711C649fCF"
      implementationNames.0xD4efe33C66B8CdE33B8896a2126E41e5dB571b7e:
-        "Vault"
      implementationNames.eth:0xD4efe33C66B8CdE33B8896a2126E41e5dB571b7e:
+        "Vault"
    }
```

```diff
    contract FastSwitchboard (0xD5a83a40F262E2247e6566171f9ADc76b745F5cD) {
    +++ description: None
      address:
-        "0xD5a83a40F262E2247e6566171f9ADc76b745F5cD"
+        "eth:0xD5a83a40F262E2247e6566171f9ADc76b745F5cD"
      values.nominee:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      values.owner:
-        "0xeeF6520437A6545b4F325F6675C4CD49812d457b"
+        "eth:0xeeF6520437A6545b4F325F6675C4CD49812d457b"
      values.signatureVerifier__:
-        "0xf1ABF110d1B6ff0E2e8C05dd64FBF9eBA4d8af98"
+        "eth:0xf1ABF110d1B6ff0E2e8C05dd64FBF9eBA4d8af98"
      values.socket__:
-        "0x943AC2775928318653e91d350574436A1b9b16f9"
+        "eth:0x943AC2775928318653e91d350574436A1b9b16f9"
      implementationNames.0xD5a83a40F262E2247e6566171f9ADc76b745F5cD:
-        "FastSwitchboard"
      implementationNames.eth:0xD5a83a40F262E2247e6566171f9ADc76b745F5cD:
+        "FastSwitchboard"
    }
```

```diff
    EOA  (0xDA9854b190A54c6c5088AB43a274caFAFF7cF369) {
    +++ description: None
      address:
-        "0xDA9854b190A54c6c5088AB43a274caFAFF7cF369"
+        "eth:0xDA9854b190A54c6c5088AB43a274caFAFF7cF369"
    }
```

```diff
    contract EIGEN Vault (Kinto) (0xdb161cdc9c11892922F7121a409b196f3b00e640) {
    +++ description: None
      address:
-        "0xdb161cdc9c11892922F7121a409b196f3b00e640"
+        "eth:0xdb161cdc9c11892922F7121a409b196f3b00e640"
      values.nominee:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      values.owner:
-        "0xf152Abda9E4ce8b134eF22Dc3C6aCe19C4895D82"
+        "eth:0xf152Abda9E4ce8b134eF22Dc3C6aCe19C4895D82"
      implementationNames.0xdb161cdc9c11892922F7121a409b196f3b00e640:
-        "Vault"
      implementationNames.eth:0xdb161cdc9c11892922F7121a409b196f3b00e640:
+        "Vault"
    }
```

```diff
    contract USDC Vault (Polynomial) (0xDE1617Ddb7C8A250A409D986930001985cfad76F) {
    +++ description: None
      address:
-        "0xDE1617Ddb7C8A250A409D986930001985cfad76F"
+        "eth:0xDE1617Ddb7C8A250A409D986930001985cfad76F"
      values.nominee:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      values.owner:
-        "0x9f76043B23125024Ce5f0Fb4AE707482107dd2a8"
+        "eth:0x9f76043B23125024Ce5f0Fb4AE707482107dd2a8"
      implementationNames.0xDE1617Ddb7C8A250A409D986930001985cfad76F:
-        "Vault"
      implementationNames.eth:0xDE1617Ddb7C8A250A409D986930001985cfad76F:
+        "Vault"
    }
```

```diff
    contract USDe Vault (Kinto) (0xdf34E61B6e7B9e348713d528fEB019d504d38c1e) {
    +++ description: None
      address:
-        "0xdf34E61B6e7B9e348713d528fEB019d504d38c1e"
+        "eth:0xdf34E61B6e7B9e348713d528fEB019d504d38c1e"
      values.nominee:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      values.owner:
-        "0xf152Abda9E4ce8b134eF22Dc3C6aCe19C4895D82"
+        "eth:0xf152Abda9E4ce8b134eF22Dc3C6aCe19C4895D82"
      implementationNames.0xdf34E61B6e7B9e348713d528fEB019d504d38c1e:
-        "Vault"
      implementationNames.eth:0xdf34E61B6e7B9e348713d528fEB019d504d38c1e:
+        "Vault"
    }
```

```diff
    contract ArbitrumL1Switchboard (0xdf5f7dfDFc26ee5F629949e330bEf56906319CAe) {
    +++ description: None
      address:
-        "0xdf5f7dfDFc26ee5F629949e330bEf56906319CAe"
+        "eth:0xdf5f7dfDFc26ee5F629949e330bEf56906319CAe"
      values.bridge__:
-        "0x8315177aB297bA92A06054cE80a67Ed4DBd7ed3a"
+        "eth:0x8315177aB297bA92A06054cE80a67Ed4DBd7ed3a"
      values.capacitor__:
-        "0xf13012498D81bca8a1eE239dC4B52316F31890EE"
+        "eth:0xf13012498D81bca8a1eE239dC4B52316F31890EE"
      values.inbox__:
-        "0x4Dbd4fc535Ac27206064B68FfCf827b0A60BAB3f"
+        "eth:0x4Dbd4fc535Ac27206064B68FfCf827b0A60BAB3f"
      values.nominee:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      values.outbox__:
-        "0x0B9857ae2D4A3DBe74ffE1d7DF045bb7F96E4840"
+        "eth:0x0B9857ae2D4A3DBe74ffE1d7DF045bb7F96E4840"
      values.owner:
-        "0xeeF6520437A6545b4F325F6675C4CD49812d457b"
+        "eth:0xeeF6520437A6545b4F325F6675C4CD49812d457b"
      values.remoteNativeSwitchboard:
-        "0xaB2F8c1588ACA57bC2909512B645a860C65770d3"
+        "eth:0xaB2F8c1588ACA57bC2909512B645a860C65770d3"
      values.signatureVerifier__:
-        "0xf1ABF110d1B6ff0E2e8C05dd64FBF9eBA4d8af98"
+        "eth:0xf1ABF110d1B6ff0E2e8C05dd64FBF9eBA4d8af98"
      values.socket__:
-        "0x943AC2775928318653e91d350574436A1b9b16f9"
+        "eth:0x943AC2775928318653e91d350574436A1b9b16f9"
      implementationNames.0xdf5f7dfDFc26ee5F629949e330bEf56906319CAe:
-        "ArbitrumL1Switchboard"
      implementationNames.eth:0xdf5f7dfDFc26ee5F629949e330bEf56906319CAe:
+        "ArbitrumL1Switchboard"
    }
```

```diff
    contract USD0++ Vault (Polynomial) (0xDf9Fa2b420689384E8DD55a706262DC0ED37020F) {
    +++ description: None
      address:
-        "0xDf9Fa2b420689384E8DD55a706262DC0ED37020F"
+        "eth:0xDf9Fa2b420689384E8DD55a706262DC0ED37020F"
      values.nominee:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      values.owner:
-        "0x9f76043B23125024Ce5f0Fb4AE707482107dd2a8"
+        "eth:0x9f76043B23125024Ce5f0Fb4AE707482107dd2a8"
      implementationNames.0xDf9Fa2b420689384E8DD55a706262DC0ED37020F:
-        "Vault"
      implementationNames.eth:0xDf9Fa2b420689384E8DD55a706262DC0ED37020F:
+        "Vault"
    }
```

```diff
    contract USDC Vault (Reya) (0xdFf78A949E47c1e90f3Dd6dd7Fe2Fa72B42a75f7) {
    +++ description: None
      address:
-        "0xdFf78A949E47c1e90f3Dd6dd7Fe2Fa72B42a75f7"
+        "eth:0xdFf78A949E47c1e90f3Dd6dd7Fe2Fa72B42a75f7"
      values.nominee:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      values.owner:
-        "0xB0BBff6311B7F245761A7846d3Ce7B1b100C1836"
+        "eth:0xB0BBff6311B7F245761A7846d3Ce7B1b100C1836"
      implementationNames.0xdFf78A949E47c1e90f3Dd6dd7Fe2Fa72B42a75f7:
-        "Vault"
      implementationNames.eth:0xdFf78A949E47c1e90f3Dd6dd7Fe2Fa72B42a75f7:
+        "Vault"
    }
```

```diff
    contract sUSDe Vault (Derive) (0xE3E96892D30E0ee1a8131BAf87c891201F7137bf) {
    +++ description: None
      address:
-        "0xE3E96892D30E0ee1a8131BAf87c891201F7137bf"
+        "eth:0xE3E96892D30E0ee1a8131BAf87c891201F7137bf"
      values.nominee:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      values.owner:
-        "0x246d38588b16Dd877c558b245e6D5a711C649fCF"
+        "eth:0x246d38588b16Dd877c558b245e6D5a711C649fCF"
      implementationNames.0xE3E96892D30E0ee1a8131BAf87c891201F7137bf:
-        "Vault"
      implementationNames.eth:0xE3E96892D30E0ee1a8131BAf87c891201F7137bf:
+        "Vault"
    }
```

```diff
    contract USUAL Vault (Kinto) (0xE753E9E0d046eD2Ff3234CD174C22E277F143FbF) {
    +++ description: None
      address:
-        "0xE753E9E0d046eD2Ff3234CD174C22E277F143FbF"
+        "eth:0xE753E9E0d046eD2Ff3234CD174C22E277F143FbF"
      values.nominee:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      values.owner:
-        "0x660ad4B5A74130a4796B4d54BC6750Ae93C86e6c"
+        "eth:0x660ad4B5A74130a4796B4d54BC6750Ae93C86e6c"
      implementationNames.0xE753E9E0d046eD2Ff3234CD174C22E277F143FbF:
-        "Vault"
      implementationNames.eth:0xE753E9E0d046eD2Ff3234CD174C22E277F143FbF:
+        "Vault"
    }
```

```diff
    contract cbBTC Vault (Polynomial) (0xEb3492A8A15baF729e57F4F7E84DC55B7A34A4e7) {
    +++ description: None
      address:
-        "0xEb3492A8A15baF729e57F4F7E84DC55B7A34A4e7"
+        "eth:0xEb3492A8A15baF729e57F4F7E84DC55B7A34A4e7"
      implementationNames.0xEb3492A8A15baF729e57F4F7E84DC55B7A34A4e7:
-        ""
      implementationNames.eth:0xEb3492A8A15baF729e57F4F7E84DC55B7A34A4e7:
+        ""
    }
```

```diff
    contract weETH Vault (Kinto) (0xeB66259d2eBC3ed1d3a98148f6298927d8A36397) {
    +++ description: None
      address:
-        "0xeB66259d2eBC3ed1d3a98148f6298927d8A36397"
+        "eth:0xeB66259d2eBC3ed1d3a98148f6298927d8A36397"
      values.nominee:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      values.owner:
-        "0xf152Abda9E4ce8b134eF22Dc3C6aCe19C4895D82"
+        "eth:0xf152Abda9E4ce8b134eF22Dc3C6aCe19C4895D82"
      implementationNames.0xeB66259d2eBC3ed1d3a98148f6298927d8A36397:
-        "Vault"
      implementationNames.eth:0xeB66259d2eBC3ed1d3a98148f6298927d8A36397:
+        "Vault"
    }
```

```diff
    contract wstETH Vault (Derive) (0xeBB5D642aA8ccDeE98373D6aC3ee0602b63824b3) {
    +++ description: None
      address:
-        "0xeBB5D642aA8ccDeE98373D6aC3ee0602b63824b3"
+        "eth:0xeBB5D642aA8ccDeE98373D6aC3ee0602b63824b3"
      values.nominee:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      values.owner:
-        "0x246d38588b16Dd877c558b245e6D5a711C649fCF"
+        "eth:0x246d38588b16Dd877c558b245e6D5a711C649fCF"
      implementationNames.0xeBB5D642aA8ccDeE98373D6aC3ee0602b63824b3:
-        "Vault"
      implementationNames.eth:0xeBB5D642aA8ccDeE98373D6aC3ee0602b63824b3:
+        "Vault"
    }
```

```diff
    contract TransmitManager (0xeD037aFBffC65a94E9CC592947E851FB2f730341) {
    +++ description: None
      address:
-        "0xeD037aFBffC65a94E9CC592947E851FB2f730341"
+        "eth:0xeD037aFBffC65a94E9CC592947E851FB2f730341"
      values.nominee:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      values.owner:
-        "0xeeF6520437A6545b4F325F6675C4CD49812d457b"
+        "eth:0xeeF6520437A6545b4F325F6675C4CD49812d457b"
      values.signatureVerifier__:
-        "0xf1ABF110d1B6ff0E2e8C05dd64FBF9eBA4d8af98"
+        "eth:0xf1ABF110d1B6ff0E2e8C05dd64FBF9eBA4d8af98"
      values.socket__:
-        "0x943AC2775928318653e91d350574436A1b9b16f9"
+        "eth:0x943AC2775928318653e91d350574436A1b9b16f9"
      implementationNames.0xeD037aFBffC65a94E9CC592947E851FB2f730341:
-        "TransmitManager"
      implementationNames.eth:0xeD037aFBffC65a94E9CC592947E851FB2f730341:
+        "TransmitManager"
    }
```

```diff
    contract  (0xeeF6520437A6545b4F325F6675C4CD49812d457b) {
    +++ description: None
      address:
-        "0xeeF6520437A6545b4F325F6675C4CD49812d457b"
+        "eth:0xeeF6520437A6545b4F325F6675C4CD49812d457b"
      values.$implementation:
-        "0xa8165F6a303A6C07Ce3C784b8ABCc595a04e6506"
+        "eth:0xa8165F6a303A6C07Ce3C784b8ABCc595a04e6506"
      values.$members.0:
-        "0xB0BBff6311B7F245761A7846d3Ce7B1b100C1836"
+        "eth:0xB0BBff6311B7F245761A7846d3Ce7B1b100C1836"
      implementationNames.0xeeF6520437A6545b4F325F6675C4CD49812d457b:
-        ""
      implementationNames.0xa8165F6a303A6C07Ce3C784b8ABCc595a04e6506:
-        ""
      implementationNames.eth:0xeeF6520437A6545b4F325F6675C4CD49812d457b:
+        ""
      implementationNames.eth:0xa8165F6a303A6C07Ce3C784b8ABCc595a04e6506:
+        ""
    }
```

```diff
    contract KintoMultisig (0xf152Abda9E4ce8b134eF22Dc3C6aCe19C4895D82) {
    +++ description: None
      address:
-        "0xf152Abda9E4ce8b134eF22Dc3C6aCe19C4895D82"
+        "eth:0xf152Abda9E4ce8b134eF22Dc3C6aCe19C4895D82"
      values.$implementation:
-        "0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552"
+        "eth:0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552"
      values.$members.0:
-        "0x5D973Ea995d14799E528B14472346bfDE21eAe2e"
+        "eth:0x5D973Ea995d14799E528B14472346bfDE21eAe2e"
      values.$members.1:
-        "0xc1f4D15C16A1f3555E0a5F7AeFD1e17AD4aaf40B"
+        "eth:0xc1f4D15C16A1f3555E0a5F7AeFD1e17AD4aaf40B"
      values.$members.2:
-        "0x94561e98DD5E55271f91A103e4979aa6C493745E"
+        "eth:0x94561e98DD5E55271f91A103e4979aa6C493745E"
      values.$members.3:
-        "0xc31C4549356d46c37021393EeEb6f704B38061eC"
+        "eth:0xc31C4549356d46c37021393EeEb6f704B38061eC"
      implementationNames.0xf152Abda9E4ce8b134eF22Dc3C6aCe19C4895D82:
-        "GnosisSafeProxy"
      implementationNames.0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552:
-        "GnosisSafe"
      implementationNames.eth:0xf152Abda9E4ce8b134eF22Dc3C6aCe19C4895D82:
+        "GnosisSafeProxy"
      implementationNames.eth:0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552:
+        "GnosisSafe"
    }
```

```diff
    contract SignatureVerifier (0xf1ABF110d1B6ff0E2e8C05dd64FBF9eBA4d8af98) {
    +++ description: None
      address:
-        "0xf1ABF110d1B6ff0E2e8C05dd64FBF9eBA4d8af98"
+        "eth:0xf1ABF110d1B6ff0E2e8C05dd64FBF9eBA4d8af98"
      values.nominee:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      values.owner:
-        "0xeeF6520437A6545b4F325F6675C4CD49812d457b"
+        "eth:0xeeF6520437A6545b4F325F6675C4CD49812d457b"
      implementationNames.0xf1ABF110d1B6ff0E2e8C05dd64FBF9eBA4d8af98:
-        "SignatureVerifier"
      implementationNames.eth:0xf1ABF110d1B6ff0E2e8C05dd64FBF9eBA4d8af98:
+        "SignatureVerifier"
    }
```

```diff
    contract AAVE Vault (Kinto) (0xF90AA670ddC1Ae778015f5B84587ad3407dB7Cf9) {
    +++ description: None
      address:
-        "0xF90AA670ddC1Ae778015f5B84587ad3407dB7Cf9"
+        "eth:0xF90AA670ddC1Ae778015f5B84587ad3407dB7Cf9"
      values.nominee:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      values.owner:
-        "0xf152Abda9E4ce8b134eF22Dc3C6aCe19C4895D82"
+        "eth:0xf152Abda9E4ce8b134eF22Dc3C6aCe19C4895D82"
      implementationNames.0xF90AA670ddC1Ae778015f5B84587ad3407dB7Cf9:
-        "Vault"
      implementationNames.eth:0xF90AA670ddC1Ae778015f5B84587ad3407dB7Cf9:
+        "Vault"
    }
```

```diff
+   Status: CREATED
    contract WETH Vault (Kinto) (0x00A0c9d82B95a17Cdf2D46703F2DcA13EB0E8A94)
    +++ description: None
```

```diff
+   Status: CREATED
    contract PolygonL1Switchboard (0x053407DFA30267f6332f3c94a9e9F704A55e62CD)
    +++ description: None
```

```diff
+   Status: CREATED
    contract sdeUSD Vault (Reya) (0x0A5A19376064fED2A0A9f3120B2426c957BC289D)
    +++ description: None
```

```diff
+   Status: CREATED
    contract deUSD Vault (Reya) (0x0b4447344fAAA340bcD2B0FdBD8f0CEcd161bC9E)
    +++ description: None
```

```diff
+   Status: CREATED
    contract OptimismSwitchboard2 (0x0E674e057EC0FF97eeA57B6A350DBAAD22FE41BA)
    +++ description: None
```

```diff
+   Status: CREATED
    contract CapacitorFactory (0x11Fbb9116801DB54bB51fF4dF423e34E8b45fc9a)
    +++ description: None
```

```diff
+   Status: CREATED
    contract DAI Vault (Kinto) (0x12Cf431BdF7F143338cC09A0629EDcCEDCBCEcB5)
    +++ description: None
```

```diff
+   Status: CREATED
    contract OptimismSwitchboard (0x139f39DC7dC05F7aC2DB3DB6af4f2e1a9De7c287)
    +++ description: None
```

```diff
+   Status: CREATED
    contract USDT Vault (Zora) (0x1417f50f864ba75D5c6cb4CD14479c48Ce5166fB)
    +++ description: None
```

```diff
+   Status: CREATED
    contract SolvBTC Vault (Polynomial) (0x197cCb40bCDed89c3D7B891824ab44d1913Ee73E)
    +++ description: None
```

```diff
+   Status: CREATED
    contract WETH Vault (Polynomial) (0x1bF463463dd6747230Ee1bF9428376EBF1e2C23a)
    +++ description: None
```

```diff
+   Status: CREATED
    contract PENDLE Vault (Kinto) (0x1Ca284BaA0023b6bB0950C93ee6d1f2068de2D97)
    +++ description: None
```

```diff
+   Status: CREATED
    contract USDT Vault (Kinto) (0x1D18263107a138C7fb0De65b4a78d193ff9664c1)
    +++ description: None
```

```diff
+   Status: CREATED
    contract WBTC Vault (Reya) (0x2344621d5aA6e784e8C6f4c54b0B29Dd9c3Ad4B6)
    +++ description: None
```

```diff
+   Status: CREATED
    contract LyraMultisig (0x246d38588b16Dd877c558b245e6D5a711C649fCF)
    +++ description: None
```

```diff
+   Status: CREATED
    contract eBTC Vault (Derive) (0x25d35C8796c9dcD3857abE90D802FC17b1FB55A5)
    +++ description: None
```

```diff
+   Status: CREATED
    contract PAXG Vault (Kinto) (0x25f0D71Da51A77Ca231484eBbAD1f588A0230ef2)
    +++ description: None
```

```diff
+   Status: CREATED
    contract USDe Vault (Derive) (0x26Cf1Dc84694E04277F2Fe4C13E43597c6010C2A)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ENA Vault (Kinto) (0x351d8894fB8bfa1b0eFF77bFD9Aab18eA2da8fDd)
    +++ description: None
```

```diff
+   Status: CREATED
    contract rsETH Vault (Derive) (0x35d4D9bc79B0a543934b1769304B90d752691caD)
    +++ description: None
```

```diff
+   Status: CREATED
    contract SolvBTC Vault (Derive) (0x383a4EdB30E896b8d2d044Be87079D45c0EA7065)
    +++ description: None
```

```diff
+   Status: CREATED
    contract WBTC Vault (Derive) (0x3Eec7c855aF33280F1eD38b93059F5aa5862E3ab)
    +++ description: None
```

```diff
+   Status: CREATED
    contract OLAS Vault (Derive) (0x412Ac6044401cDf1e9833B7056c14C74AA593D37)
    +++ description: None
```

```diff
+   Status: CREATED
    contract sUSDe Vault (Kinto) (0x43b718Aa5e678b08615CA984cbe25f690B085b32)
    +++ description: None
```

```diff
+   Status: CREATED
    contract AAVE Vault (Derive) (0x4421461239aE746127C13a19177656124433dC60)
    +++ description: None
```

```diff
+   Status: CREATED
    contract USDS Vault (Polynomial) (0x49bFcE41d0594acA7390eD0820d83Fda308c39a7)
    +++ description: None
```

```diff
+   Status: CREATED
    contract rswETH Vault (Derive) (0x4BB4C3CDc7562f08e9910A0C7D8bB7e108861eB4)
    +++ description: None
```

```diff
+   Status: CREATED
    contract GHO Vault (Kinto) (0x4F18853BE8C01d375889c02D61A77B476d3E59dd)
    +++ description: None
```

```diff
+   Status: CREATED
    contract LDO Vault (Kinto) (0x54e60fef7c7f2f747900452D4151aF976EaeAb76)
    +++ description: None
```

```diff
+   Status: CREATED
    contract wstETH Vault (Polynomial) (0x572A4080c16beD33Cf2E876ad969E2E35769EDB4)
    +++ description: None
```

```diff
+   Status: CREATED
    contract USDC Vault (Zora) (0x58CDCf55f2c8660674F17561334F6370cbaDeEF8)
    +++ description: None
```

```diff
+   Status: CREATED
    contract sDAI Vault (Kinto) (0x5B8Ae1C9c5970e2637Cf3Af431acAAebEf7aFb85)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Hasher (0x5C71beE4a6b0D617D8c3d107D331292741789E27)
    +++ description: None
```

```diff
+   Status: CREATED
    contract cbETH Vault (Kinto) (0x5cC25cc25bE29d18472E76b2a19975aA1a37Bd5C)
    +++ description: None
```

```diff
+   Status: CREATED
    contract USDT Vault (Derive) (0x5e98A25d8d6FF69A8992d6Aa57948dFB77D4ECBa)
    +++ description: None
```

```diff
+   Status: CREATED
    contract cbBTC Vault (Derive) (0x5F18C54e4E10287414A47925a24Ea3A8Cf4A9F50)
    +++ description: None
```

```diff
+   Status: CREATED
    contract sUSDe Vault (Reya) (0x5F3B301B4967623fDb3AE52Bb8FF4dB01C460Cd3)
    +++ description: None
```

```diff
+   Status: CREATED
    contract sDAI Vault (Derive) (0x613e87BE1cd75dEBC5e6e56a2AF2fED84162C142)
    +++ description: None
```

```diff
+   Status: CREATED
    contract sDAI Vault (Polynomial) (0x615172e47c0C5A6dA8ea959632Ac0166f7a59eDc)
    +++ description: None
```

```diff
+   Status: CREATED
    contract WETH Vault (Reya) (0x64dF894688c5052BeAdC35371cF69151Ebc5D658)
    +++ description: None
```

```diff
+   Status: CREATED
    contract USDC Vault (Derive) (0x6D303CEE7959f814042D31E0624fB88Ec6fbcC1d)
    +++ description: None
```

```diff
+   Status: CREATED
    contract USDC Vault (Kinto) (0x755cD5d147036E11c76F1EeffDd94794fC265f0d)
    +++ description: None
```

```diff
+   Status: CREATED
    contract LBTC Vault (Derive) (0x76624ff43D610F64177Bb9c194A2503642e9B803)
    +++ description: None
```

```diff
+   Status: CREATED
    contract SNX Vault (Derive) (0x7D7aC8d55A9bD4152b703011f3E61AB3bB0A5592)
    +++ description: None
```

```diff
+   Status: CREATED
    contract DAI Vault (Derive) (0x7E1d17b580dD4F89037DB331430eAEe8B8e50c91)
    +++ description: None
```

```diff
+   Status: CREATED
    contract weETH Vault (Derive) (0x8180EcCC825b692ef65FF099a0A387743788bf78)
    +++ description: None
```

```diff
+   Status: CREATED
    contract rsETH Vault (Polynomial) (0x8309E63F777805f362d42f5B5f2D1A20287d5Df2)
    +++ description: None
```

```diff
+   Status: CREATED
    contract weETH Vault (Polynomial) (0x847579e12CFb96a3357d9C51e374330af61716C2)
    +++ description: None
```

```diff
+   Status: CREATED
    contract cbBTC Vault (Kinto) (0x8F5247072e9580624Be243D4EC8cD3F3ABfF86B9)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Socket (0x943AC2775928318653e91d350574436A1b9b16f9)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ETHFI Vault (Kinto) (0x95d60E34aB2E626407d98dF8C240e6174e5D37E5)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ExecutionManager (0x98CAd9A205f1F7A7150241Ef2d565d1702BCe57C)
    +++ description: None
```

```diff
+   Status: CREATED
    contract SOL Vault (Kinto) (0xA2bc0DaA9BF98820632bCa0663a9616f6bC180f8)
    +++ description: None
```

```diff
+   Status: CREATED
    contract LINK Vault (Kinto) (0xA6Ae29Ce5c38DFE0Dd95B716748ac747f31E4013)
    +++ description: None
```

```diff
+   Status: CREATED
    contract LOOKS Vault (Blast) (0xa83B4006c16DAeAb2718294696c0122519195137)
    +++ description: None
```

```diff
+   Status: CREATED
    contract USDe Vault (Reya) (0xaA2f2B6cD33Eaabb795c6DB60AAec599C8450F35)
    +++ description: None
```

```diff
+   Status: CREATED
    contract xSolvBTC Vault (Derive) (0xB592512153c22F5Ba573b0c3E04cAB99d4Cd8856)
    +++ description: None
```

```diff
+   Status: CREATED
    contract wstETH Vault (Kinto) (0xc5d01939Af7Ce9Ffc505F0bb36eFeDde7920f2dc)
    +++ description: None
```

```diff
+   Status: CREATED
    contract sUSDe Vault (Polynomial) (0xC6cfb996A7CFEB89813A68CD13942CD75553032b)
    +++ description: None
```

```diff
+   Status: CREATED
    contract USDT Vault (Polynomial) (0xc7C71E39C2F87b0a70C434Ed5bc0497F4cd55bfB)
    +++ description: None
```

```diff
+   Status: CREATED
    contract LooksRareMultisig (0xC8C57e4C73c71f72cA0a7e043E5D2D144F98ef13)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ONDO Vault (Kinto) (0xCa1AaCB6E16E7d50c6442f9eD6faEe5dDa638DaD)
    +++ description: None
```

```diff
+   Status: CREATED
    contract XAUt Vault (Kinto) (0xd04Bc056BE36a6127267E4F71d3b43D1BEEfE8bF)
    +++ description: None
```

```diff
+   Status: CREATED
    contract SPX Vault (Kinto) (0xd1228C6CB94a670F30D5ACb1340a9d96aC30e6A8)
    +++ description: None
```

```diff
+   Status: CREATED
    contract WBTC Vault (Kinto) (0xd4964E8A405D396d94825f4d0f5dEDD8741C1d36)
    +++ description: None
```

```diff
+   Status: CREATED
    contract WETH Vault (Derive) (0xD4efe33C66B8CdE33B8896a2126E41e5dB571b7e)
    +++ description: None
```

```diff
+   Status: CREATED
    contract FastSwitchboard (0xD5a83a40F262E2247e6566171f9ADc76b745F5cD)
    +++ description: None
```

```diff
+   Status: CREATED
    contract EIGEN Vault (Kinto) (0xdb161cdc9c11892922F7121a409b196f3b00e640)
    +++ description: None
```

```diff
+   Status: CREATED
    contract USDC Vault (Polynomial) (0xDE1617Ddb7C8A250A409D986930001985cfad76F)
    +++ description: None
```

```diff
+   Status: CREATED
    contract USDe Vault (Kinto) (0xdf34E61B6e7B9e348713d528fEB019d504d38c1e)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ArbitrumL1Switchboard (0xdf5f7dfDFc26ee5F629949e330bEf56906319CAe)
    +++ description: None
```

```diff
+   Status: CREATED
    contract USD0++ Vault (Polynomial) (0xDf9Fa2b420689384E8DD55a706262DC0ED37020F)
    +++ description: None
```

```diff
+   Status: CREATED
    contract USDC Vault (Reya) (0xdFf78A949E47c1e90f3Dd6dd7Fe2Fa72B42a75f7)
    +++ description: None
```

```diff
+   Status: CREATED
    contract sUSDe Vault (Derive) (0xE3E96892D30E0ee1a8131BAf87c891201F7137bf)
    +++ description: None
```

```diff
+   Status: CREATED
    contract USUAL Vault (Kinto) (0xE753E9E0d046eD2Ff3234CD174C22E277F143FbF)
    +++ description: None
```

```diff
+   Status: CREATED
    contract cbBTC Vault (Polynomial) (0xEb3492A8A15baF729e57F4F7E84DC55B7A34A4e7)
    +++ description: None
```

```diff
+   Status: CREATED
    contract weETH Vault (Kinto) (0xeB66259d2eBC3ed1d3a98148f6298927d8A36397)
    +++ description: None
```

```diff
+   Status: CREATED
    contract wstETH Vault (Derive) (0xeBB5D642aA8ccDeE98373D6aC3ee0602b63824b3)
    +++ description: None
```

```diff
+   Status: CREATED
    contract TransmitManager (0xeD037aFBffC65a94E9CC592947E851FB2f730341)
    +++ description: None
```

```diff
+   Status: CREATED
    contract  (0xeeF6520437A6545b4F325F6675C4CD49812d457b)
    +++ description: None
```

```diff
+   Status: CREATED
    contract KintoMultisig (0xf152Abda9E4ce8b134eF22Dc3C6aCe19C4895D82)
    +++ description: None
```

```diff
+   Status: CREATED
    contract SignatureVerifier (0xf1ABF110d1B6ff0E2e8C05dd64FBF9eBA4d8af98)
    +++ description: None
```

```diff
+   Status: CREATED
    contract AAVE Vault (Kinto) (0xF90AA670ddC1Ae778015f5B84587ad3407dB7Cf9)
    +++ description: None
```

Generated with discovered.json: 0xdb6af84eff834af94096993fd320acb8747d49d1

# Diff at Fri, 04 Jul 2025 08:36:32 GMT:

- chain: ethereum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@b1ec4bef906de72c4073ae74026bc48cea1b83e9 block: 22666325
- current block number: 22844606

## Description

add rsETH to polynomial, refresh plugs crawl

## Watched changes

```diff
    contract USDS Vault (Polynomial) (0x49bFcE41d0594acA7390eD0820d83Fda308c39a7) {
    +++ description: None
      type:
-        "EOA"
+        "Contract"
      proxyType:
-        "EOA"
+        "immutable"
      unverified:
+        true
      sinceTimestamp:
+        1749766247
      sinceBlock:
+        22691377
      values:
+        {"$immutable":true}
      implementationNames:
+        {"0x49bFcE41d0594acA7390eD0820d83Fda308c39a7":""}
    }
```

```diff
    contract rsETH Vault (Polynomial) (0x8309E63F777805f362d42f5B5f2D1A20287d5Df2) {
    +++ description: None
      type:
-        "EOA"
+        "Contract"
      proxyType:
-        "EOA"
+        "immutable"
      unverified:
+        true
      sinceTimestamp:
+        1751017763
      sinceBlock:
+        22794987
      values:
+        {"$immutable":true}
      implementationNames:
+        {"0x8309E63F777805f362d42f5B5f2D1A20287d5Df2":""}
    }
```

```diff
    contract Socket (0x943AC2775928318653e91d350574436A1b9b16f9) {
    +++ description: None
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.164:
+        "0x4CC07BCB7949CAbAb7b19EC94267AF5C0e47AEdA"
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.165:
+        "0x47D5E4eCae70c9AD12eaDF469344B6B52a0ebCcE"
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.166:
+        "0xec837c413c25B6952845551183ba8900cc543b95"
    }
```

```diff
    contract USDT Vault (Polynomial) (0xc7C71E39C2F87b0a70C434Ed5bc0497F4cd55bfB) {
    +++ description: None
      type:
-        "EOA"
+        "Contract"
      proxyType:
-        "EOA"
+        "immutable"
      unverified:
+        true
      sinceTimestamp:
+        1749766103
      sinceBlock:
+        22691365
      values:
+        {"$immutable":true}
      implementationNames:
+        {"0xc7C71E39C2F87b0a70C434Ed5bc0497F4cd55bfB":""}
    }
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22666325 (main branch discovery), not current.

```diff
+   Status: CREATED
    contract USUAL Vault (Kinto) (0xE753E9E0d046eD2Ff3234CD174C22E277F143FbF)
    +++ description: None
```

Generated with discovered.json: 0xdfb848e42793e7ddce172da80a9487ae90a77749

# Diff at Mon, 09 Jun 2025 10:09:03 GMT:

- chain: ethereum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@7cc006dadcc55e6cce3be3eb03d491835943fb43 block: 22630354
- current block number: 22666325

## Description

add plug (add cbBTC to polynomial).

## Watched changes

```diff
    contract AAVE Vault (Derive) (0x4421461239aE746127C13a19177656124433dC60) {
    +++ description: None
      type:
-        "EOA"
+        "Contract"
      proxyType:
-        "EOA"
+        "immutable"
      sourceHashes:
+        ["0x31b99c44ab28174db25b94c3cca9ad4f335866894a5437384040c7bd682fca11"]
      sinceTimestamp:
+        1749030047
      sinceBlock:
+        22630445
      values:
+        {"$immutable":true,"bridgeType":"0x9faa379a8f7762447354a00c30bda6b12f39577783c03b588d3fd75b4e2a5876","nominee":"0x0000000000000000000000000000000000000000","owner":"0x246d38588b16Dd877c558b245e6D5a711C649fCF"}
      implementationNames:
+        {"0x4421461239aE746127C13a19177656124433dC60":"Vault"}
    }
```

```diff
    contract Socket (0x943AC2775928318653e91d350574436A1b9b16f9) {
    +++ description: None
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.163:
+        "0x935f1C29Db1155c3E0f39F644DF78DDDBD4757Ff"
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.162:
-        "0x935f1C29Db1155c3E0f39F644DF78DDDBD4757Ff"
+        "0x4B4ed8b47EA37FB0230472fAdaFAF12658f05Ad7"
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.161:
-        "0x4B4ed8b47EA37FB0230472fAdaFAF12658f05Ad7"
+        "0x67c97Bd542B3a7F1F1EcF85CBC4409421ccAe971"
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.160:
-        "0x67c97Bd542B3a7F1F1EcF85CBC4409421ccAe971"
+        "0x6B3614474eE19FA9A2d6D2079a2D73c04E567310"
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.159:
-        "0x6B3614474eE19FA9A2d6D2079a2D73c04E567310"
+        "0x15CEcd5190A43C7798dD2058308781D0662e678E"
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.158:
-        "0x15CEcd5190A43C7798dD2058308781D0662e678E"
+        "0xb1178803A726e2077947754de9f2f0cbdA29A60F"
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.157:
-        "0xb1178803A726e2077947754de9f2f0cbdA29A60F"
+        "0x642c4c33301EF5837ADa6E74F15Aa939f3951Fff"
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.156:
-        "0x642c4c33301EF5837ADa6E74F15Aa939f3951Fff"
+        "0x96E1e9c80619D2038afe30450b3cBeCb2A7D94cd"
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.155:
-        "0x96E1e9c80619D2038afe30450b3cBeCb2A7D94cd"
+        "0xA2bE759B86CeA53372C3e9a882047cdC3884D568"
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.154:
-        "0xA2bE759B86CeA53372C3e9a882047cdC3884D568"
+        "0x9ED094fDe2a31BEd0278a4cfdb5528473baFe5a8"
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.153:
-        "0x9ED094fDe2a31BEd0278a4cfdb5528473baFe5a8"
+        "0x998d7C2257591cC38383B4F91474c5346111f2E6"
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.152:
-        "0x998d7C2257591cC38383B4F91474c5346111f2E6"
+        "0x6dED17643D7acFc0bE0e79ff6C4762F12AA5516E"
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.151:
-        "0x6dED17643D7acFc0bE0e79ff6C4762F12AA5516E"
+        "0x1734067c2CDcFb81ef9672F80DA2D7bfC2CFAE73"
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.150:
-        "0x1734067c2CDcFb81ef9672F80DA2D7bfC2CFAE73"
+        "0x457379de638CAFeB1759a22457fe893b288E2e89"
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.149:
-        "0x457379de638CAFeB1759a22457fe893b288E2e89"
+        "0x65A9b862671de5Df85EcE387220C6b10a17230f7"
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.148:
-        "0x65A9b862671de5Df85EcE387220C6b10a17230f7"
+        "0x8843557Fd6005d617A735731BF1bAb0461af55E4"
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.147:
-        "0x8843557Fd6005d617A735731BF1bAb0461af55E4"
+        "0xe38Dccb8Bd138c326E3Df926ADD9dE71a442837F"
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.146:
-        "0xe38Dccb8Bd138c326E3Df926ADD9dE71a442837F"
+        "0x80f5143AF6BF51B38C038BaFF71465Be9b48cAEe"
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.145:
-        "0x80f5143AF6BF51B38C038BaFF71465Be9b48cAEe"
+        "0xFb0c284CD9929eB5139eB027aD7497097Ba25C87"
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.144:
-        "0xFb0c284CD9929eB5139eB027aD7497097Ba25C87"
+        "0x376f76B657a384e980F6Ea96e885654eC8F3ED61"
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.143:
-        "0x376f76B657a384e980F6Ea96e885654eC8F3ED61"
+        "0xfa8c07E28461eb7c65b33De024DB97eE4C052C97"
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.142:
-        "0xfa8c07E28461eb7c65b33De024DB97eE4C052C97"
+        "0x4ab7B94BA3f3CF69354Eb2f6b5E856DC61e13660"
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.141:
-        "0x4ab7B94BA3f3CF69354Eb2f6b5E856DC61e13660"
+        "0xBEF69d0acC388091c7C9702aCbFB3b8A873e239e"
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.140:
-        "0xBEF69d0acC388091c7C9702aCbFB3b8A873e239e"
+        "0x1b882b9E87ABd7DD9B9b689Bee10Ed6a040033D0"
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.139:
-        "0x1b882b9E87ABd7DD9B9b689Bee10Ed6a040033D0"
+        "0xd48A35a853858e344aFCbEcCDBf8FCbFaF8e1501"
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.138:
-        "0xd48A35a853858e344aFCbEcCDBf8FCbFaF8e1501"
+        "0x170fFDe318B514B029E1B1eC4F096C7e1bDeaeA8"
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.137:
-        "0x170fFDe318B514B029E1B1eC4F096C7e1bDeaeA8"
+        "0x134643Df54DCaaAf343505361D1Eac58A7400b3d"
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.136:
-        "0x134643Df54DCaaAf343505361D1Eac58A7400b3d"
+        "0xE7ADE6Dda067c501A3d4C938c36c310c55FBcc27"
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.135:
-        "0xE7ADE6Dda067c501A3d4C938c36c310c55FBcc27"
+        "0x9d13F2b3B694DE6a1cF58edb5044454CAE3B84E4"
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.134:
-        "0x9d13F2b3B694DE6a1cF58edb5044454CAE3B84E4"
+        "0xDABF17a0f13290E85a347119deEb8539B41eF4eB"
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.133:
-        "0xDABF17a0f13290E85a347119deEb8539B41eF4eB"
+        "0x083Add2A9afa97Efb6412b293145ce965eCE3600"
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.132:
-        "0x083Add2A9afa97Efb6412b293145ce965eCE3600"
+        "0x7FBCd72B6368f1771C9F6Ee16502C19b0AADBa1D"
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.131:
-        "0x7FBCd72B6368f1771C9F6Ee16502C19b0AADBa1D"
+        "0x02D53793b18d032Cd94d745F7586C6F66F83f8e3"
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.130:
-        "0x02D53793b18d032Cd94d745F7586C6F66F83f8e3"
+        "0x3553c0102684c20e2f8192d6F013c7242710b4b3"
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.129:
-        "0x3553c0102684c20e2f8192d6F013c7242710b4b3"
+        "0x7Eee3241eC98ED0B47c8Bc0e9E3327B541BCDc1D"
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.128:
-        "0x7Eee3241eC98ED0B47c8Bc0e9E3327B541BCDc1D"
+        "0x4a43eD818411585fEAaf667a2D3E2605962084e0"
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.127:
-        "0x4a43eD818411585fEAaf667a2D3E2605962084e0"
+        "0x3390ca7A0D7C80871B05C3FeBbeEee91307a35ba"
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.126:
-        "0x3390ca7A0D7C80871B05C3FeBbeEee91307a35ba"
+        "0x15f70f64438603e5872A4E81c7a8B5edB5D70d93"
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.125:
-        "0x15f70f64438603e5872A4E81c7a8B5edB5D70d93"
+        "0x37C24e7081eb7f2B16bde81b556d082c0839F754"
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.124:
-        "0x37C24e7081eb7f2B16bde81b556d082c0839F754"
+        "0x833a7FA0Ff734b2BA01e8d2126e127cf8f29eFaD"
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.123:
-        "0x833a7FA0Ff734b2BA01e8d2126e127cf8f29eFaD"
+        "0x91CE463148bD7695d4db41f4aA36088E502428F7"
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.122:
-        "0x91CE463148bD7695d4db41f4aA36088E502428F7"
+        "0xa5D1802fBd730c158f8F6E8401c4d8b3001A8d33"
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.121:
-        "0xa5D1802fBd730c158f8F6E8401c4d8b3001A8d33"
+        "0xcb473D87A56b4609A695753711F727E5c4335cCf"
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.120:
-        "0xcb473D87A56b4609A695753711F727E5c4335cCf"
+        "0x88444394f970B6F21C4f5101003ea513dE3E5406"
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.119:
-        "0x88444394f970B6F21C4f5101003ea513dE3E5406"
+        "0xf7a4a34d64E8fE4FCCffE2f3C985D43409Aa8c9a"
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.118:
-        "0xf7a4a34d64E8fE4FCCffE2f3C985D43409Aa8c9a"
+        "0xb40FdECfCa4EF29CACc37222Ce4dB1fd0f561a00"
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.117:
-        "0xb40FdECfCa4EF29CACc37222Ce4dB1fd0f561a00"
+        "0xab722902681A260762084A78A2d8f19CfA6A46Ef"
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.116:
-        "0xab722902681A260762084A78A2d8f19CfA6A46Ef"
+        "0x8F4e67C61232167584333e23D7d67BD73d80a4F5"
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.115:
-        "0x8F4e67C61232167584333e23D7d67BD73d80a4F5"
+        "0x7a6Edde81cdD9d75BC10D87C490b132c08bD426D"
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.114:
-        "0x7a6Edde81cdD9d75BC10D87C490b132c08bD426D"
+        "0x519Bc0379CA9C4061a6006B4EAc419bC00017B3E"
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.113:
-        "0x519Bc0379CA9C4061a6006B4EAc419bC00017B3E"
+        "0x3F574bc32a0bE9514010409FE8CF19e56fd7C83a"
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.112:
-        "0x3F574bc32a0bE9514010409FE8CF19e56fd7C83a"
+        "0xcf2B4958e72Db99FDF844cD3992Daa2a8B7319c5"
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.111:
-        "0xcf2B4958e72Db99FDF844cD3992Daa2a8B7319c5"
+        "0xAc00056920EfF02831CAf0baF116ADf6B42D9ad1"
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.110:
-        "0xAc00056920EfF02831CAf0baF116ADf6B42D9ad1"
+        "0x254691C06Da387c1050C726cF498eFdA89083820"
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.109:
-        "0x254691C06Da387c1050C726cF498eFdA89083820"
+        "0x00CE54B988D8C44bFCae4026C17c37c69C490A12"
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.108:
-        "0x00CE54B988D8C44bFCae4026C17c37c69C490A12"
+        "0x5D5a2999E91A336CA99da0cB636898ccB521f40a"
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.107:
-        "0x5D5a2999E91A336CA99da0cB636898ccB521f40a"
+        "0x2Dba37E679358125BaB2132dDF5133d7d66F7D06"
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.106:
-        "0x2Dba37E679358125BaB2132dDF5133d7d66F7D06"
+        "0x88A05556Af1a8a5BB5964c46Be9D56C379a5E155"
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.105:
-        "0x88A05556Af1a8a5BB5964c46Be9D56C379a5E155"
+        "0x3645C506F4E22eA2380B8c4fd5fA914F36dfc3b0"
    }
```

## Source code changes

```diff
.../socket/ethereum/.flat/AAVE Vault (Derive).sol  | 884 +++++++++++++++++++++
 1 file changed, 884 insertions(+)
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22630354 (main branch discovery), not current.

```diff
+   Status: CREATED
    contract OLAS Vault (Derive) (0x412Ac6044401cDf1e9833B7056c14C74AA593D37)
    +++ description: None
```

```diff
+   Status: CREATED
    contract weETH Vault (Polynomial) (0x847579e12CFb96a3357d9C51e374330af61716C2)
    +++ description: None
```

```diff
+   Status: CREATED
    contract cbBTC Vault (Polynomial) (0xEb3492A8A15baF729e57F4F7E84DC55B7A34A4e7)
    +++ description: None
```

Generated with discovered.json: 0x21c075951cf76d10bc2e75f9a5a43472670ddd1f

# Diff at Wed, 04 Jun 2025 09:24:18 GMT:

- chain: ethereum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@2c1561a0dd20d4853f867f43267ae9042bbca2cd block: 22593528
- current block number: 22630354

## Description

one new plug.

## Watched changes

```diff
    contract Socket (0x943AC2775928318653e91d350574436A1b9b16f9) {
    +++ description: None
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.162:
+        "0x935f1C29Db1155c3E0f39F644DF78DDDBD4757Ff"
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.161:
-        "0x935f1C29Db1155c3E0f39F644DF78DDDBD4757Ff"
+        "0x4B4ed8b47EA37FB0230472fAdaFAF12658f05Ad7"
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.160:
-        "0x4B4ed8b47EA37FB0230472fAdaFAF12658f05Ad7"
+        "0x67c97Bd542B3a7F1F1EcF85CBC4409421ccAe971"
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.159:
-        "0x67c97Bd542B3a7F1F1EcF85CBC4409421ccAe971"
+        "0x6B3614474eE19FA9A2d6D2079a2D73c04E567310"
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.158:
-        "0x6B3614474eE19FA9A2d6D2079a2D73c04E567310"
+        "0x15CEcd5190A43C7798dD2058308781D0662e678E"
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.157:
-        "0x15CEcd5190A43C7798dD2058308781D0662e678E"
+        "0xb1178803A726e2077947754de9f2f0cbdA29A60F"
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.156:
-        "0xb1178803A726e2077947754de9f2f0cbdA29A60F"
+        "0x642c4c33301EF5837ADa6E74F15Aa939f3951Fff"
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.155:
-        "0x642c4c33301EF5837ADa6E74F15Aa939f3951Fff"
+        "0x96E1e9c80619D2038afe30450b3cBeCb2A7D94cd"
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.154:
-        "0x96E1e9c80619D2038afe30450b3cBeCb2A7D94cd"
+        "0xA2bE759B86CeA53372C3e9a882047cdC3884D568"
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.153:
-        "0xA2bE759B86CeA53372C3e9a882047cdC3884D568"
+        "0x9ED094fDe2a31BEd0278a4cfdb5528473baFe5a8"
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.152:
-        "0x9ED094fDe2a31BEd0278a4cfdb5528473baFe5a8"
+        "0x998d7C2257591cC38383B4F91474c5346111f2E6"
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.151:
-        "0x998d7C2257591cC38383B4F91474c5346111f2E6"
+        "0x6dED17643D7acFc0bE0e79ff6C4762F12AA5516E"
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.150:
-        "0x6dED17643D7acFc0bE0e79ff6C4762F12AA5516E"
+        "0x1734067c2CDcFb81ef9672F80DA2D7bfC2CFAE73"
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.149:
-        "0x1734067c2CDcFb81ef9672F80DA2D7bfC2CFAE73"
+        "0x457379de638CAFeB1759a22457fe893b288E2e89"
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.148:
-        "0x457379de638CAFeB1759a22457fe893b288E2e89"
+        "0x65A9b862671de5Df85EcE387220C6b10a17230f7"
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.147:
-        "0x65A9b862671de5Df85EcE387220C6b10a17230f7"
+        "0x8843557Fd6005d617A735731BF1bAb0461af55E4"
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.146:
-        "0x8843557Fd6005d617A735731BF1bAb0461af55E4"
+        "0xe38Dccb8Bd138c326E3Df926ADD9dE71a442837F"
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.145:
-        "0xe38Dccb8Bd138c326E3Df926ADD9dE71a442837F"
+        "0x80f5143AF6BF51B38C038BaFF71465Be9b48cAEe"
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.144:
-        "0x80f5143AF6BF51B38C038BaFF71465Be9b48cAEe"
+        "0xFb0c284CD9929eB5139eB027aD7497097Ba25C87"
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.143:
-        "0xFb0c284CD9929eB5139eB027aD7497097Ba25C87"
+        "0x376f76B657a384e980F6Ea96e885654eC8F3ED61"
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.142:
-        "0x376f76B657a384e980F6Ea96e885654eC8F3ED61"
+        "0xfa8c07E28461eb7c65b33De024DB97eE4C052C97"
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.141:
-        "0xfa8c07E28461eb7c65b33De024DB97eE4C052C97"
+        "0x4ab7B94BA3f3CF69354Eb2f6b5E856DC61e13660"
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.140:
-        "0x4ab7B94BA3f3CF69354Eb2f6b5E856DC61e13660"
+        "0xBEF69d0acC388091c7C9702aCbFB3b8A873e239e"
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.139:
-        "0xBEF69d0acC388091c7C9702aCbFB3b8A873e239e"
+        "0x1b882b9E87ABd7DD9B9b689Bee10Ed6a040033D0"
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.138:
-        "0x1b882b9E87ABd7DD9B9b689Bee10Ed6a040033D0"
+        "0xd48A35a853858e344aFCbEcCDBf8FCbFaF8e1501"
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.137:
-        "0xd48A35a853858e344aFCbEcCDBf8FCbFaF8e1501"
+        "0x170fFDe318B514B029E1B1eC4F096C7e1bDeaeA8"
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.136:
-        "0x170fFDe318B514B029E1B1eC4F096C7e1bDeaeA8"
+        "0x134643Df54DCaaAf343505361D1Eac58A7400b3d"
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.135:
-        "0x134643Df54DCaaAf343505361D1Eac58A7400b3d"
+        "0xE7ADE6Dda067c501A3d4C938c36c310c55FBcc27"
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.134:
-        "0xE7ADE6Dda067c501A3d4C938c36c310c55FBcc27"
+        "0x9d13F2b3B694DE6a1cF58edb5044454CAE3B84E4"
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.133:
-        "0x9d13F2b3B694DE6a1cF58edb5044454CAE3B84E4"
+        "0xDABF17a0f13290E85a347119deEb8539B41eF4eB"
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.132:
-        "0xDABF17a0f13290E85a347119deEb8539B41eF4eB"
+        "0x083Add2A9afa97Efb6412b293145ce965eCE3600"
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.131:
-        "0x083Add2A9afa97Efb6412b293145ce965eCE3600"
+        "0x7FBCd72B6368f1771C9F6Ee16502C19b0AADBa1D"
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.130:
-        "0x7FBCd72B6368f1771C9F6Ee16502C19b0AADBa1D"
+        "0x02D53793b18d032Cd94d745F7586C6F66F83f8e3"
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.129:
-        "0x02D53793b18d032Cd94d745F7586C6F66F83f8e3"
+        "0x3553c0102684c20e2f8192d6F013c7242710b4b3"
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.128:
-        "0x3553c0102684c20e2f8192d6F013c7242710b4b3"
+        "0x7Eee3241eC98ED0B47c8Bc0e9E3327B541BCDc1D"
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.127:
-        "0x7Eee3241eC98ED0B47c8Bc0e9E3327B541BCDc1D"
+        "0x4a43eD818411585fEAaf667a2D3E2605962084e0"
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.126:
-        "0x4a43eD818411585fEAaf667a2D3E2605962084e0"
+        "0x3390ca7A0D7C80871B05C3FeBbeEee91307a35ba"
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.125:
-        "0x3390ca7A0D7C80871B05C3FeBbeEee91307a35ba"
+        "0x15f70f64438603e5872A4E81c7a8B5edB5D70d93"
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.124:
-        "0x15f70f64438603e5872A4E81c7a8B5edB5D70d93"
+        "0x37C24e7081eb7f2B16bde81b556d082c0839F754"
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.123:
-        "0x37C24e7081eb7f2B16bde81b556d082c0839F754"
+        "0x833a7FA0Ff734b2BA01e8d2126e127cf8f29eFaD"
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.122:
-        "0x833a7FA0Ff734b2BA01e8d2126e127cf8f29eFaD"
+        "0x91CE463148bD7695d4db41f4aA36088E502428F7"
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.121:
-        "0x91CE463148bD7695d4db41f4aA36088E502428F7"
+        "0xa5D1802fBd730c158f8F6E8401c4d8b3001A8d33"
    }
```

Generated with discovered.json: 0x6fe8be024ddfdd63f678f5f10f734712970a9677

# Diff at Fri, 30 May 2025 05:42:39 GMT:

- chain: ethereum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@a4d8c436027d17df0f9b76843cd6deb1888fa381 block: 22495675
- current block number: 22593528

## Description

signer change.

## Watched changes

```diff
    contract KintoMultisig (0xf152Abda9E4ce8b134eF22Dc3C6aCe19C4895D82) {
    +++ description: None
      values.$members.4:
-        "0x5D973Ea995d14799E528B14472346bfDE21eAe2e"
      values.$members.3:
-        "0xc1f4D15C16A1f3555E0a5F7AeFD1e17AD4aaf40B"
+        "0x5D973Ea995d14799E528B14472346bfDE21eAe2e"
      values.$members.2:
-        "0x08E674c4538caE03B6c05405881dDCd95DcaF5a8"
+        "0xc1f4D15C16A1f3555E0a5F7AeFD1e17AD4aaf40B"
      values.multisigThreshold:
-        "3 of 5 (60%)"
+        "3 of 4 (75%)"
    }
```

Generated with discovered.json: 0x99705a40e53a2b9dab9f191801b29a462857285d

# Diff at Fri, 16 May 2025 12:38:11 GMT:

- chain: ethereum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@9912083f7b773804513e08ee765f8ba71a92980b block: 22424578
- current block number: 22495675

## Description

New plugs, crawl data updated.

## Watched changes

```diff
    contract Socket (0x943AC2775928318653e91d350574436A1b9b16f9) {
    +++ description: None
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.161:
+        "0x935f1C29Db1155c3E0f39F644DF78DDDBD4757Ff"
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.160:
-        "0x935f1C29Db1155c3E0f39F644DF78DDDBD4757Ff"
+        "0x4B4ed8b47EA37FB0230472fAdaFAF12658f05Ad7"
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.159:
-        "0x4B4ed8b47EA37FB0230472fAdaFAF12658f05Ad7"
+        "0x67c97Bd542B3a7F1F1EcF85CBC4409421ccAe971"
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.158:
-        "0x67c97Bd542B3a7F1F1EcF85CBC4409421ccAe971"
+        "0x6B3614474eE19FA9A2d6D2079a2D73c04E567310"
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.157:
-        "0x6B3614474eE19FA9A2d6D2079a2D73c04E567310"
+        "0x15CEcd5190A43C7798dD2058308781D0662e678E"
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.156:
-        "0x15CEcd5190A43C7798dD2058308781D0662e678E"
+        "0xb1178803A726e2077947754de9f2f0cbdA29A60F"
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.155:
-        "0xb1178803A726e2077947754de9f2f0cbdA29A60F"
+        "0x642c4c33301EF5837ADa6E74F15Aa939f3951Fff"
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.154:
-        "0x642c4c33301EF5837ADa6E74F15Aa939f3951Fff"
+        "0x96E1e9c80619D2038afe30450b3cBeCb2A7D94cd"
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.153:
-        "0x96E1e9c80619D2038afe30450b3cBeCb2A7D94cd"
+        "0xA2bE759B86CeA53372C3e9a882047cdC3884D568"
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.152:
-        "0xA2bE759B86CeA53372C3e9a882047cdC3884D568"
+        "0x9ED094fDe2a31BEd0278a4cfdb5528473baFe5a8"
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.151:
-        "0x9ED094fDe2a31BEd0278a4cfdb5528473baFe5a8"
+        "0x998d7C2257591cC38383B4F91474c5346111f2E6"
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.150:
-        "0x998d7C2257591cC38383B4F91474c5346111f2E6"
+        "0x6dED17643D7acFc0bE0e79ff6C4762F12AA5516E"
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.149:
-        "0x6dED17643D7acFc0bE0e79ff6C4762F12AA5516E"
+        "0x1734067c2CDcFb81ef9672F80DA2D7bfC2CFAE73"
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.148:
-        "0x1734067c2CDcFb81ef9672F80DA2D7bfC2CFAE73"
+        "0x457379de638CAFeB1759a22457fe893b288E2e89"
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.147:
-        "0x457379de638CAFeB1759a22457fe893b288E2e89"
+        "0x65A9b862671de5Df85EcE387220C6b10a17230f7"
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.146:
-        "0x65A9b862671de5Df85EcE387220C6b10a17230f7"
+        "0x8843557Fd6005d617A735731BF1bAb0461af55E4"
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.145:
-        "0x8843557Fd6005d617A735731BF1bAb0461af55E4"
+        "0xe38Dccb8Bd138c326E3Df926ADD9dE71a442837F"
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.144:
-        "0xe38Dccb8Bd138c326E3Df926ADD9dE71a442837F"
+        "0x80f5143AF6BF51B38C038BaFF71465Be9b48cAEe"
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.143:
-        "0x80f5143AF6BF51B38C038BaFF71465Be9b48cAEe"
+        "0xFb0c284CD9929eB5139eB027aD7497097Ba25C87"
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.142:
-        "0xFb0c284CD9929eB5139eB027aD7497097Ba25C87"
+        "0x376f76B657a384e980F6Ea96e885654eC8F3ED61"
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.141:
-        "0x376f76B657a384e980F6Ea96e885654eC8F3ED61"
+        "0xfa8c07E28461eb7c65b33De024DB97eE4C052C97"
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.140:
-        "0xfa8c07E28461eb7c65b33De024DB97eE4C052C97"
+        "0x4ab7B94BA3f3CF69354Eb2f6b5E856DC61e13660"
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.139:
-        "0x4ab7B94BA3f3CF69354Eb2f6b5E856DC61e13660"
+        "0xBEF69d0acC388091c7C9702aCbFB3b8A873e239e"
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.138:
-        "0xBEF69d0acC388091c7C9702aCbFB3b8A873e239e"
+        "0x1b882b9E87ABd7DD9B9b689Bee10Ed6a040033D0"
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.137:
-        "0x1b882b9E87ABd7DD9B9b689Bee10Ed6a040033D0"
+        "0xd48A35a853858e344aFCbEcCDBf8FCbFaF8e1501"
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.136:
-        "0xd48A35a853858e344aFCbEcCDBf8FCbFaF8e1501"
+        "0x170fFDe318B514B029E1B1eC4F096C7e1bDeaeA8"
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.135:
-        "0x170fFDe318B514B029E1B1eC4F096C7e1bDeaeA8"
+        "0x134643Df54DCaaAf343505361D1Eac58A7400b3d"
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.134:
-        "0x134643Df54DCaaAf343505361D1Eac58A7400b3d"
+        "0xE7ADE6Dda067c501A3d4C938c36c310c55FBcc27"
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.133:
-        "0xE7ADE6Dda067c501A3d4C938c36c310c55FBcc27"
+        "0x9d13F2b3B694DE6a1cF58edb5044454CAE3B84E4"
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.132:
-        "0x9d13F2b3B694DE6a1cF58edb5044454CAE3B84E4"
+        "0xDABF17a0f13290E85a347119deEb8539B41eF4eB"
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.131:
-        "0xDABF17a0f13290E85a347119deEb8539B41eF4eB"
+        "0x083Add2A9afa97Efb6412b293145ce965eCE3600"
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.130:
-        "0x083Add2A9afa97Efb6412b293145ce965eCE3600"
+        "0x7FBCd72B6368f1771C9F6Ee16502C19b0AADBa1D"
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.129:
-        "0x7FBCd72B6368f1771C9F6Ee16502C19b0AADBa1D"
+        "0x02D53793b18d032Cd94d745F7586C6F66F83f8e3"
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.128:
-        "0x02D53793b18d032Cd94d745F7586C6F66F83f8e3"
+        "0x3553c0102684c20e2f8192d6F013c7242710b4b3"
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.127:
-        "0x3553c0102684c20e2f8192d6F013c7242710b4b3"
+        "0x7Eee3241eC98ED0B47c8Bc0e9E3327B541BCDc1D"
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.126:
-        "0x7Eee3241eC98ED0B47c8Bc0e9E3327B541BCDc1D"
+        "0x4a43eD818411585fEAaf667a2D3E2605962084e0"
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.125:
-        "0x4a43eD818411585fEAaf667a2D3E2605962084e0"
+        "0x3390ca7A0D7C80871B05C3FeBbeEee91307a35ba"
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.124:
-        "0x3390ca7A0D7C80871B05C3FeBbeEee91307a35ba"
+        "0x15f70f64438603e5872A4E81c7a8B5edB5D70d93"
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.123:
-        "0x15f70f64438603e5872A4E81c7a8B5edB5D70d93"
+        "0x37C24e7081eb7f2B16bde81b556d082c0839F754"
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.122:
-        "0x37C24e7081eb7f2B16bde81b556d082c0839F754"
+        "0x833a7FA0Ff734b2BA01e8d2126e127cf8f29eFaD"
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.121:
-        "0x833a7FA0Ff734b2BA01e8d2126e127cf8f29eFaD"
+        "0x91CE463148bD7695d4db41f4aA36088E502428F7"
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.120:
-        "0x91CE463148bD7695d4db41f4aA36088E502428F7"
+        "0xcb473D87A56b4609A695753711F727E5c4335cCf"
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.119:
-        "0xcb473D87A56b4609A695753711F727E5c4335cCf"
+        "0x88444394f970B6F21C4f5101003ea513dE3E5406"
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.118:
-        "0x88444394f970B6F21C4f5101003ea513dE3E5406"
+        "0xf7a4a34d64E8fE4FCCffE2f3C985D43409Aa8c9a"
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.117:
-        "0xf7a4a34d64E8fE4FCCffE2f3C985D43409Aa8c9a"
+        "0xb40FdECfCa4EF29CACc37222Ce4dB1fd0f561a00"
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.116:
-        "0xb40FdECfCa4EF29CACc37222Ce4dB1fd0f561a00"
+        "0xab722902681A260762084A78A2d8f19CfA6A46Ef"
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.115:
-        "0xab722902681A260762084A78A2d8f19CfA6A46Ef"
+        "0x8F4e67C61232167584333e23D7d67BD73d80a4F5"
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.114:
-        "0x8F4e67C61232167584333e23D7d67BD73d80a4F5"
+        "0x7a6Edde81cdD9d75BC10D87C490b132c08bD426D"
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.113:
-        "0x7a6Edde81cdD9d75BC10D87C490b132c08bD426D"
+        "0x519Bc0379CA9C4061a6006B4EAc419bC00017B3E"
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.112:
-        "0x519Bc0379CA9C4061a6006B4EAc419bC00017B3E"
+        "0x3F574bc32a0bE9514010409FE8CF19e56fd7C83a"
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.111:
-        "0x3F574bc32a0bE9514010409FE8CF19e56fd7C83a"
+        "0xcf2B4958e72Db99FDF844cD3992Daa2a8B7319c5"
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.110:
-        "0xcf2B4958e72Db99FDF844cD3992Daa2a8B7319c5"
+        "0xAc00056920EfF02831CAf0baF116ADf6B42D9ad1"
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.109:
-        "0xAc00056920EfF02831CAf0baF116ADf6B42D9ad1"
+        "0x254691C06Da387c1050C726cF498eFdA89083820"
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.108:
-        "0x254691C06Da387c1050C726cF498eFdA89083820"
+        "0x00CE54B988D8C44bFCae4026C17c37c69C490A12"
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.107:
-        "0x00CE54B988D8C44bFCae4026C17c37c69C490A12"
+        "0x5D5a2999E91A336CA99da0cB636898ccB521f40a"
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.106:
-        "0x5D5a2999E91A336CA99da0cB636898ccB521f40a"
+        "0x2Dba37E679358125BaB2132dDF5133d7d66F7D06"
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.105:
-        "0x2Dba37E679358125BaB2132dDF5133d7d66F7D06"
+        "0x88A05556Af1a8a5BB5964c46Be9D56C379a5E155"
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.104:
-        "0x88A05556Af1a8a5BB5964c46Be9D56C379a5E155"
+        "0x92469EEf05a071B0e56275b23597b1b701C15a71"
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.103:
-        "0x92469EEf05a071B0e56275b23597b1b701C15a71"
+        "0xDBa83C0C654DB1cd914FA2710bA743e925B53086"
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.102:
-        "0xDBa83C0C654DB1cd914FA2710bA743e925B53086"
+        "0xFAB1efe6cA9435faEf9e29f40E575e27A74373A9"
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.101:
-        "0xFAB1efe6cA9435faEf9e29f40E575e27A74373A9"
+        "0xB49b8AAcD8396C49d9045f6bAb101aB32c59643D"
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.100:
-        "0xB49b8AAcD8396C49d9045f6bAb101aB32c59643D"
+        "0x0c39a1b042AbfC68d10B78081AFE3F58a6523A35"
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.99:
-        "0x0c39a1b042AbfC68d10B78081AFE3F58a6523A35"
+        "0x895b6c1413243562128a9281a7f8891640Ca073f"
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.98:
-        "0x895b6c1413243562128a9281a7f8891640Ca073f"
+        "0xBF3233Ef07B9552578987e2A2d25F760fBf192e5"
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.97:
-        "0xBF3233Ef07B9552578987e2A2d25F760fBf192e5"
+        "0x6A769e25081396a49a6702758d0830920ac1163A"
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.96:
-        "0x6A769e25081396a49a6702758d0830920ac1163A"
+        "0x716c339F41eAcfE2dc4775052411394A2Ed04743"
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.95:
-        "0x716c339F41eAcfE2dc4775052411394A2Ed04743"
+        "0x9D0487D8d93Fc08938A39e355c676A8b032Dc52a"
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.94:
-        "0x9D0487D8d93Fc08938A39e355c676A8b032Dc52a"
+        "0x5366D4acCC96Ed297e30B8702FBC9b85daA3a459"
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.93:
-        "0x5366D4acCC96Ed297e30B8702FBC9b85daA3a459"
+        "0xCf814e58f1649F94d37E51f730D6bF72409fA09c"
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.92:
-        "0xCf814e58f1649F94d37E51f730D6bF72409fA09c"
+        "0xf71A92D4bEFc2e18671c3b20377d45729790e880"
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.91:
-        "0xf71A92D4bEFc2e18671c3b20377d45729790e880"
+        "0x200AF8FCdD5246D70B369A98143Ac8930A077B7A"
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.90:
-        "0x200AF8FCdD5246D70B369A98143Ac8930A077B7A"
+        "0x50D46c3BB529276aDe59a6678C14302D6B61C853"
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.89:
-        "0x50D46c3BB529276aDe59a6678C14302D6B61C853"
+        "0x388341d9E5A7D7d5accD738B2a31b0622E0c1b87"
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.88:
-        "0x388341d9E5A7D7d5accD738B2a31b0622E0c1b87"
+        "0x68411d61adF1341A6392C87A93941FdD3EE7DF8E"
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.87:
-        "0x68411d61adF1341A6392C87A93941FdD3EE7DF8E"
+        "0xF391E487FE3958F0728436Af84455Fd4eBC9c7c9"
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.86:
-        "0xF391E487FE3958F0728436Af84455Fd4eBC9c7c9"
+        "0xb5d5E523905bB397bCAfB36B252535a255d3E23C"
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.85:
-        "0xb5d5E523905bB397bCAfB36B252535a255d3E23C"
+        "0xC3875afddEde146DCfED7e72b2Ad12B853CA1241"
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.84:
-        "0xC3875afddEde146DCfED7e72b2Ad12B853CA1241"
+        "0x55033cb4583f5526704Ee4C197e99504E504712c"
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.83:
-        "0x55033cb4583f5526704Ee4C197e99504E504712c"
+        "0xc706c946623C70B294b91Bd4961E91FaF7A74317"
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.82:
-        "0xc706c946623C70B294b91Bd4961E91FaF7A74317"
+        "0xdb1c2F432e51824b33b9269C4b1Ff6190c1e5F35"
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.81:
-        "0xdb1c2F432e51824b33b9269C4b1Ff6190c1e5F35"
+        "0xB1b7BC699cAEcB941e7377065c7CE82039889603"
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.80:
-        "0xB1b7BC699cAEcB941e7377065c7CE82039889603"
+        "0x7E6dA87FE69306CaAED675fFe4e7dC0FfE3bFe4D"
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.79:
-        "0x7E6dA87FE69306CaAED675fFe4e7dC0FfE3bFe4D"
+        "0x5Afa7ddBcE8EE8862FDf5fD8c546BF32615d2D9B"
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.78:
-        "0x5Afa7ddBcE8EE8862FDf5fD8c546BF32615d2D9B"
+        "0x76C9129b44c637500c88760ADd2EbEF07472b549"
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.77:
-        "0x76C9129b44c637500c88760ADd2EbEF07472b549"
+        "0x76ddfc271089e58Af68D8597D41aEF52Fb53EC3D"
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.76:
-        "0x76ddfc271089e58Af68D8597D41aEF52Fb53EC3D"
+        "0x1A9ba93F3cb22Ba7228D29607075F444e9ff515c"
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.75:
-        "0x1A9ba93F3cb22Ba7228D29607075F444e9ff515c"
+        "0xCc958F84DaF36d3eC20BcBee7E99C073B882efc3"
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.74:
-        "0xCc958F84DaF36d3eC20BcBee7E99C073B882efc3"
+        "0x008244E37A90E090dc4abD70F37195075cbE8453"
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.73:
-        "0x008244E37A90E090dc4abD70F37195075cbE8453"
+        "0xC331BEeC6e36c8Df4FDD7e432de95863E7f80d67"
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.72:
-        "0xC331BEeC6e36c8Df4FDD7e432de95863E7f80d67"
+        "0xf1807B621efC3B072d1203dD28C880BBEDc56161"
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.71:
-        "0xf1807B621efC3B072d1203dD28C880BBEDc56161"
+        "0xa1D11b141bb47eDb2c69B8ced4EFe80f62D1C276"
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.70:
-        "0xa1D11b141bb47eDb2c69B8ced4EFe80f62D1C276"
+        "0xe987a57DA7Ab112B1bDc7AA704E6EA943760d252"
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.69:
-        "0xe987a57DA7Ab112B1bDc7AA704E6EA943760d252"
+        "0x3f66F272d33B764960779a301c4183306ae50e10"
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.68:
-        "0x3f66F272d33B764960779a301c4183306ae50e10"
+        "0x1a0e7Efa0F74703A930B2b1Cb6565b1d8981dd85"
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.67:
-        "0x1a0e7Efa0F74703A930B2b1Cb6565b1d8981dd85"
+        "0xCE0AB493716d96C0979E0B708BeF1915F3B07e01"
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.66:
-        "0xCE0AB493716d96C0979E0B708BeF1915F3B07e01"
+        "0x12fBD04CB103c596B78110C70eEDF16821CBfcAE"
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.65:
-        "0x12fBD04CB103c596B78110C70eEDF16821CBfcAE"
+        "0xE2c2291B80BFC8Bd0e4fc8Af196Ae5fc9136aeE0"
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.64:
-        "0xE2c2291B80BFC8Bd0e4fc8Af196Ae5fc9136aeE0"
+        "0x8E8D89410000A993d2537d26366e1C3010AB90ff"
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.63:
-        "0x8E8D89410000A993d2537d26366e1C3010AB90ff"
+        "0x32295769ea702BA9337EE5B65c6b42aFF75FEC62"
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.62:
-        "0x32295769ea702BA9337EE5B65c6b42aFF75FEC62"
+        "0x94104d7801f30d2f9069118C65Fe63A3A11515B1"
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.61:
-        "0x94104d7801f30d2f9069118C65Fe63A3A11515B1"
+        "0xCF83efEe74f61771AF78b05DeA847773D3952C33"
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.60:
-        "0xCF83efEe74f61771AF78b05DeA847773D3952C33"
+        "0x432684E7e764343c836d9c78b9245aa774323E40"
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.59:
-        "0x432684E7e764343c836d9c78b9245aa774323E40"
+        "0x727aD65db6aE99DB5Dbee8F202846DD6009bf6D5"
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.58:
-        "0x727aD65db6aE99DB5Dbee8F202846DD6009bf6D5"
+        "0x12a4CC40a8F89E40F8C849c2F89741D5C9590a14"
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.57:
-        "0x12a4CC40a8F89E40F8C849c2F89741D5C9590a14"
+        "0x412CC246d703598e3705B9536B4Ec3c2039f6e5E"
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.56:
-        "0x412CC246d703598e3705B9536B4Ec3c2039f6e5E"
+        "0x1Eb392Aba52a2D933e58f7E86Ca96b9A3e2D8166"
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.55:
-        "0x1Eb392Aba52a2D933e58f7E86Ca96b9A3e2D8166"
+        "0x2B93891dc80ab9696814615f553fd15a3b98d3a2"
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.54:
-        "0x2B93891dc80ab9696814615f553fd15a3b98d3a2"
+        "0x52DB079d07fb8C2F5FA158C3311d877f3769B01e"
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.53:
-        "0x52DB079d07fb8C2F5FA158C3311d877f3769B01e"
+        "0xE88F6b194BD3b43013710A785DDFF41454A19537"
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.52:
-        "0xE88F6b194BD3b43013710A785DDFF41454A19537"
+        "0xBbA3095f6ACA17ff23Df466833D621cc91Db7675"
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.51:
-        "0xBbA3095f6ACA17ff23Df466833D621cc91Db7675"
+        "0x75695e8A56405dC60a0aFf07d1AF01A0baCA7188"
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.50:
-        "0x75695e8A56405dC60a0aFf07d1AF01A0baCA7188"
+        "0x223033E1F905eEd161a7B2EBeb786a158156fb8D"
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.49:
-        "0x223033E1F905eEd161a7B2EBeb786a158156fb8D"
+        "0x4E83292d5cacf05B85bED2c3D4a6056F42EE1738"
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.48:
-        "0x4E83292d5cacf05B85bED2c3D4a6056F42EE1738"
+        "0x266abd77Da7F877cdf93c0dd5782cC61Fa29ac96"
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.47:
-        "0x266abd77Da7F877cdf93c0dd5782cC61Fa29ac96"
+        "0xdE9D8c2d465669c661672d7945D4d4f5407d22E2"
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.46:
-        "0xdE9D8c2d465669c661672d7945D4d4f5407d22E2"
+        "0xdCcFb24f983586144c085426dbfa3414045E19a3"
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.45:
-        "0xdCcFb24f983586144c085426dbfa3414045E19a3"
+        "0x876b81F74AD47cF10e5D62aAAc80f9E99f5587FC"
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.44:
-        "0x876b81F74AD47cF10e5D62aAAc80f9E99f5587FC"
+        "0x7E34B138e507570bDCC9b99230cFaA2745F0222C"
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.43:
-        "0x7E34B138e507570bDCC9b99230cFaA2745F0222C"
+        "0x7163FaC3fc420923810cCA5d15949c1523F69B4a"
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.42:
-        "0x7163FaC3fc420923810cCA5d15949c1523F69B4a"
+        "0x094570E556C8E58119E21f47759F02F50Ae3bB49"
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.41:
-        "0x094570E556C8E58119E21f47759F02F50Ae3bB49"
+        "0x42F23C6d344d0322e13f254B9a8E187335AFB409"
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.40:
-        "0x42F23C6d344d0322e13f254B9a8E187335AFB409"
+        "0xB1dfE248EEfa405654b9ff7D470403452180b862"
    }
```

Generated with discovered.json: 0x13ba5b474e6d7378eadc4d50033a366b0ce359a0

# Diff at Tue, 06 May 2025 12:32:51 GMT:

- chain: ethereum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@797a9ec756b28fc8b608c3143fbee4e577108cbc block: 22245178
- current block number: 22424578

## Description

New plugs!! 🥳

updates socket crawl output and added cbBTC to derive tvs.

## Watched changes

```diff
    contract Socket (0x943AC2775928318653e91d350574436A1b9b16f9) {
    +++ description: None
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.160:
+        "0x935f1C29Db1155c3E0f39F644DF78DDDBD4757Ff"
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.159:
-        "0x935f1C29Db1155c3E0f39F644DF78DDDBD4757Ff"
+        "0x4B4ed8b47EA37FB0230472fAdaFAF12658f05Ad7"
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.158:
-        "0x4B4ed8b47EA37FB0230472fAdaFAF12658f05Ad7"
+        "0x67c97Bd542B3a7F1F1EcF85CBC4409421ccAe971"
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.157:
-        "0x67c97Bd542B3a7F1F1EcF85CBC4409421ccAe971"
+        "0x6B3614474eE19FA9A2d6D2079a2D73c04E567310"
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.156:
-        "0x6B3614474eE19FA9A2d6D2079a2D73c04E567310"
+        "0x15CEcd5190A43C7798dD2058308781D0662e678E"
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.155:
-        "0x15CEcd5190A43C7798dD2058308781D0662e678E"
+        "0xb1178803A726e2077947754de9f2f0cbdA29A60F"
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.154:
-        "0xb1178803A726e2077947754de9f2f0cbdA29A60F"
+        "0x642c4c33301EF5837ADa6E74F15Aa939f3951Fff"
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.153:
-        "0x642c4c33301EF5837ADa6E74F15Aa939f3951Fff"
+        "0x96E1e9c80619D2038afe30450b3cBeCb2A7D94cd"
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.152:
-        "0x96E1e9c80619D2038afe30450b3cBeCb2A7D94cd"
+        "0xA2bE759B86CeA53372C3e9a882047cdC3884D568"
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.151:
-        "0xA2bE759B86CeA53372C3e9a882047cdC3884D568"
+        "0x9ED094fDe2a31BEd0278a4cfdb5528473baFe5a8"
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.150:
-        "0x9ED094fDe2a31BEd0278a4cfdb5528473baFe5a8"
+        "0x998d7C2257591cC38383B4F91474c5346111f2E6"
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.149:
-        "0x998d7C2257591cC38383B4F91474c5346111f2E6"
+        "0x6dED17643D7acFc0bE0e79ff6C4762F12AA5516E"
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.148:
-        "0x6dED17643D7acFc0bE0e79ff6C4762F12AA5516E"
+        "0x1734067c2CDcFb81ef9672F80DA2D7bfC2CFAE73"
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.147:
-        "0x1734067c2CDcFb81ef9672F80DA2D7bfC2CFAE73"
+        "0x457379de638CAFeB1759a22457fe893b288E2e89"
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.146:
-        "0x457379de638CAFeB1759a22457fe893b288E2e89"
+        "0x65A9b862671de5Df85EcE387220C6b10a17230f7"
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.145:
-        "0x65A9b862671de5Df85EcE387220C6b10a17230f7"
+        "0x8843557Fd6005d617A735731BF1bAb0461af55E4"
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.144:
-        "0x8843557Fd6005d617A735731BF1bAb0461af55E4"
+        "0xe38Dccb8Bd138c326E3Df926ADD9dE71a442837F"
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.143:
-        "0xe38Dccb8Bd138c326E3Df926ADD9dE71a442837F"
+        "0x80f5143AF6BF51B38C038BaFF71465Be9b48cAEe"
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.142:
-        "0x80f5143AF6BF51B38C038BaFF71465Be9b48cAEe"
+        "0xFb0c284CD9929eB5139eB027aD7497097Ba25C87"
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.141:
-        "0xFb0c284CD9929eB5139eB027aD7497097Ba25C87"
+        "0x376f76B657a384e980F6Ea96e885654eC8F3ED61"
    }
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22245178 (main branch discovery), not current.

```diff
+   Status: CREATED
    contract SolvBTC Vault (Polynomial) (0x197cCb40bCDed89c3D7B891824ab44d1913Ee73E)
    +++ description: None
```

```diff
+   Status: CREATED
    contract wstETH Vault (Polynomial) (0x572A4080c16beD33Cf2E876ad969E2E35769EDB4)
    +++ description: None
```

```diff
+   Status: CREATED
    contract cbETH Vault (Kinto) (0x5cC25cc25bE29d18472E76b2a19975aA1a37Bd5C)
    +++ description: None
```

Generated with discovered.json: 0x1395996e5e2c1e19a3f4727c4fc922f6c59b071a

# Diff at Fri, 11 Apr 2025 10:44:09 GMT:

- chain: ethereum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@a6b3a2ad538ae4157a8a2ff47bb12b02b212d8d2 block: 22244020
- current block number: 22245178

## Description

Provide description of changes. This section will be preserved.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22244020 (main branch discovery), not current.

```diff
    contract WETH Vault (Kinto) (0x00A0c9d82B95a17Cdf2D46703F2DcA13EB0E8A94) {
    +++ description: None
      name:
-        "WETH Vault Kinto"
+        "WETH Vault (Kinto)"
    }
```

```diff
    contract sdeUSD Vault (Reya) (0x0A5A19376064fED2A0A9f3120B2426c957BC289D) {
    +++ description: None
      name:
-        "sdeUSD Vault Reya"
+        "sdeUSD Vault (Reya)"
    }
```

```diff
    contract deUSD Vault (Reya) (0x0b4447344fAAA340bcD2B0FdBD8f0CEcd161bC9E) {
    +++ description: None
      name:
-        "deUSD Vault Reya"
+        "deUSD Vault (Reya)"
    }
```

```diff
-   Status: DELETED
    contract MKR Vault Kinto (0x0fC783f611A888A2cAbC3dA482Add3215334dCc2)
    +++ description: None
```

```diff
    contract DAI Vault (Kinto) (0x12Cf431BdF7F143338cC09A0629EDcCEDCBCEcB5) {
    +++ description: None
      name:
-        "DAI Vault Kinto"
+        "DAI Vault (Kinto)"
    }
```

```diff
    contract USDT Vault (Zora) (0x1417f50f864ba75D5c6cb4CD14479c48Ce5166fB) {
    +++ description: None
      name:
-        "USDT Vault Zora"
+        "USDT Vault (Zora)"
    }
```

```diff
    contract USDT Vault (Kinto) (0x1D18263107a138C7fb0De65b4a78d193ff9664c1) {
    +++ description: None
      name:
-        "USDT Vault Kinto"
+        "USDT Vault (Kinto)"
    }
```

```diff
    contract WBTC Vault (Reya) (0x2344621d5aA6e784e8C6f4c54b0B29Dd9c3Ad4B6) {
    +++ description: None
      name:
-        "WBTC Vault Reya"
+        "WBTC Vault (Reya)"
    }
```

```diff
    contract eBTC Vault (Derive) (0x25d35C8796c9dcD3857abE90D802FC17b1FB55A5) {
    +++ description: None
      name:
-        "eBTC Vault Derive"
+        "eBTC Vault (Derive)"
    }
```

```diff
    contract PAXG Vault (Kinto) (0x25f0D71Da51A77Ca231484eBbAD1f588A0230ef2) {
    +++ description: None
      name:
-        "PAXG Vault Kinto"
+        "PAXG Vault (Kinto)"
    }
```

```diff
    contract USDe Vault (Derive) (0x26Cf1Dc84694E04277F2Fe4C13E43597c6010C2A) {
    +++ description: None
      name:
-        "USDe Vault Derive"
+        "USDe Vault (Derive)"
    }
```

```diff
-   Status: DELETED
    contract KINTO Vault Kinto (0x2f87464d5F5356dB350dcb302FE28040986783a7)
    +++ description: None
```

```diff
    contract ENA Vault (Kinto) (0x351d8894fB8bfa1b0eFF77bFD9Aab18eA2da8fDd) {
    +++ description: None
      name:
-        "ENA Vault Kinto"
+        "ENA Vault (Kinto)"
    }
```

```diff
    contract rsETH Vault (Derive) (0x35d4D9bc79B0a543934b1769304B90d752691caD) {
    +++ description: None
      name:
-        "rsETH Vault Derive"
+        "rsETH Vault (Derive)"
    }
```

```diff
    contract WBTC Vault (Derive) (0x3Eec7c855aF33280F1eD38b93059F5aa5862E3ab) {
    +++ description: None
      name:
-        "WBTC Vault Derive"
+        "WBTC Vault (Derive)"
    }
```

```diff
    contract sUSDe Vault (Kinto) (0x43b718Aa5e678b08615CA984cbe25f690B085b32) {
    +++ description: None
      name:
-        "sUSDe Vault Kinto"
+        "sUSDe Vault (Kinto)"
    }
```

```diff
    contract rswETH Vault (Derive) (0x4BB4C3CDc7562f08e9910A0C7D8bB7e108861eB4) {
    +++ description: None
      name:
-        "rswETH Vault Derive"
+        "rswETH Vault (Derive)"
    }
```

```diff
-   Status: DELETED
    contract KLAUS Vault Zora (0x528DBFcf6e2cbC62B05d7a74711AA7C44FF43cA2)
    +++ description: None
```

```diff
    contract USDC Vault (Zora) (0x58CDCf55f2c8660674F17561334F6370cbaDeEF8) {
    +++ description: None
      name:
-        "USDC Vault Zora"
+        "USDC Vault (Zora)"
    }
```

```diff
    contract sDAI Vault (Kinto) (0x5B8Ae1C9c5970e2637Cf3Af431acAAebEf7aFb85) {
    +++ description: None
      name:
-        "sDAI Vault Kinto"
+        "sDAI Vault (Kinto)"
    }
```

```diff
    contract USDT Vault (Derive) (0x5e98A25d8d6FF69A8992d6Aa57948dFB77D4ECBa) {
    +++ description: None
      name:
-        "USDT Vault Derive"
+        "USDT Vault (Derive)"
    }
```

```diff
    contract cbBTC Vault (Derive) (0x5F18C54e4E10287414A47925a24Ea3A8Cf4A9F50) {
    +++ description: None
      name:
-        "cbBTC Vault Derive"
+        "cbBTC Vault (Derive)"
    }
```

```diff
    contract sUSDe Vault (Reya) (0x5F3B301B4967623fDb3AE52Bb8FF4dB01C460Cd3) {
    +++ description: None
      name:
-        "sUSDe Vault Reya"
+        "sUSDe Vault (Reya)"
    }
```

```diff
    contract sDAI Vault (Derive) (0x613e87BE1cd75dEBC5e6e56a2AF2fED84162C142) {
    +++ description: None
      name:
-        "sDAI Vault Derive"
+        "sDAI Vault (Derive)"
    }
```

```diff
    contract sDAI Vault (Polynomial) (0x615172e47c0C5A6dA8ea959632Ac0166f7a59eDc) {
    +++ description: None
      name:
-        "sDAI Vault Polynomial"
+        "sDAI Vault (Polynomial)"
    }
```

```diff
    contract WETH Vault (Reya) (0x64dF894688c5052BeAdC35371cF69151Ebc5D658) {
    +++ description: None
      name:
-        "WETH Vault Reya"
+        "WETH Vault (Reya)"
    }
```

```diff
    contract USDC Vault (Derive) (0x6D303CEE7959f814042D31E0624fB88Ec6fbcC1d) {
    +++ description: None
      name:
-        "USDC Vault Derive"
+        "USDC Vault (Derive)"
    }
```

```diff
    contract USDC Vault (Kinto) (0x755cD5d147036E11c76F1EeffDd94794fC265f0d) {
    +++ description: None
      name:
-        "USDC Vault Kinto"
+        "USDC Vault (Kinto)"
    }
```

```diff
    contract LBTC Vault (Derive) (0x76624ff43D610F64177Bb9c194A2503642e9B803) {
    +++ description: None
      name:
-        "LBTC Vault Derive"
+        "LBTC Vault (Derive)"
    }
```

```diff
    contract SNX Vault (Derive) (0x7D7aC8d55A9bD4152b703011f3E61AB3bB0A5592) {
    +++ description: None
      name:
-        "SNX Vault Derive"
+        "SNX Vault (Derive)"
    }
```

```diff
    contract DAI Vault (Derive) (0x7E1d17b580dD4F89037DB331430eAEe8B8e50c91) {
    +++ description: None
      name:
-        "DAI Vault Derive"
+        "DAI Vault (Derive)"
    }
```

```diff
    contract weETH Vault (Derive) (0x8180EcCC825b692ef65FF099a0A387743788bf78) {
    +++ description: None
      name:
-        "weETH Vault Derive"
+        "weETH Vault (Derive)"
    }
```

```diff
    contract cbBTC Vault (Kinto) (0x8F5247072e9580624Be243D4EC8cD3F3ABfF86B9) {
    +++ description: None
      name:
-        "cbBTC Vault Kinto"
+        "cbBTC Vault (Kinto)"
    }
```

```diff
    contract ETHFI Vault (Kinto) (0x95d60E34aB2E626407d98dF8C240e6174e5D37E5) {
    +++ description: None
      name:
-        "ETHFI Vault Kinto"
+        "ETHFI Vault (Kinto)"
    }
```

```diff
    contract SOL Vault (Kinto) (0xA2bc0DaA9BF98820632bCa0663a9616f6bC180f8) {
    +++ description: None
      name:
-        "SOL Vault Kinto"
+        "SOL Vault (Kinto)"
    }
```

```diff
    contract LINK Vault (Kinto) (0xA6Ae29Ce5c38DFE0Dd95B716748ac747f31E4013) {
    +++ description: None
      name:
-        "LINK Vault Kinto"
+        "LINK Vault (Kinto)"
    }
```

```diff
    contract LOOKS Vault (Blast) (0xa83B4006c16DAeAb2718294696c0122519195137) {
    +++ description: None
      name:
-        "LOOKS Vault Blast"
+        "LOOKS Vault (Blast)"
    }
```

```diff
    contract USDe Vault (Reya) (0xaA2f2B6cD33Eaabb795c6DB60AAec599C8450F35) {
    +++ description: None
      name:
-        "USDe Vault Reya"
+        "USDe Vault (Reya)"
    }
```

```diff
    contract wstETH Vault (Kinto) (0xc5d01939Af7Ce9Ffc505F0bb36eFeDde7920f2dc) {
    +++ description: None
      name:
-        "wstETH Vault Kinto"
+        "wstETH Vault (Kinto)"
    }
```

```diff
    contract sUSDe Vault (Polynomial) (0xC6cfb996A7CFEB89813A68CD13942CD75553032b) {
    +++ description: None
      name:
-        "sUSDe Vault Polynomial"
+        "sUSDe Vault (Polynomial)"
    }
```

```diff
    contract XAUt Vault (Kinto) (0xd04Bc056BE36a6127267E4F71d3b43D1BEEfE8bF) {
    +++ description: None
      name:
-        "XAUt Vault Kinto"
+        "XAUt Vault (Kinto)"
    }
```

```diff
    contract SPX Vault (Kinto) (0xd1228C6CB94a670F30D5ACb1340a9d96aC30e6A8) {
    +++ description: None
      name:
-        "SPX Vault Kinto"
+        "SPX Vault (Kinto)"
    }
```

```diff
    contract WETH Vault (Derive) (0xD4efe33C66B8CdE33B8896a2126E41e5dB571b7e) {
    +++ description: None
      name:
-        "WETH Vault Derive"
+        "WETH Vault (Derive)"
    }
```

```diff
-   Status: DELETED
    contract eUSD Vault Kinto (0xDB0e855F55ff35dA8754e5297925bd6c4Cb1Fa48)
    +++ description: None
```

```diff
    contract EIGEN Vault (Kinto) (0xdb161cdc9c11892922F7121a409b196f3b00e640) {
    +++ description: None
      name:
-        "EIGEN Vault Kinto"
+        "EIGEN Vault (Kinto)"
    }
```

```diff
    contract USDC Vault (Polynomial) (0xDE1617Ddb7C8A250A409D986930001985cfad76F) {
    +++ description: None
      name:
-        "USDC Vault Polynomial"
+        "USDC Vault (Polynomial)"
    }
```

```diff
    contract USDe Vault (Kinto) (0xdf34E61B6e7B9e348713d528fEB019d504d38c1e) {
    +++ description: None
      name:
-        "USDe Vault Kinto"
+        "USDe Vault (Kinto)"
    }
```

```diff
    contract USD0++ Vault (Polynomial) (0xDf9Fa2b420689384E8DD55a706262DC0ED37020F) {
    +++ description: None
      name:
-        "USD0++ Vault Polynomial"
+        "USD0++ Vault (Polynomial)"
    }
```

```diff
    contract USDC Vault (Reya) (0xdFf78A949E47c1e90f3Dd6dd7Fe2Fa72B42a75f7) {
    +++ description: None
      name:
-        "USDC Vault Reya"
+        "USDC Vault (Reya)"
    }
```

```diff
    contract sUSDe Vault (Derive) (0xE3E96892D30E0ee1a8131BAf87c891201F7137bf) {
    +++ description: None
      name:
-        "sUSDe Vault Derive"
+        "sUSDe Vault (Derive)"
    }
```

```diff
    contract weETH Vault (Kinto) (0xeB66259d2eBC3ed1d3a98148f6298927d8A36397) {
    +++ description: None
      name:
-        "weETH Vault Kinto"
+        "weETH Vault (Kinto)"
    }
```

```diff
    contract wstETH Vault (Derive) (0xeBB5D642aA8ccDeE98373D6aC3ee0602b63824b3) {
    +++ description: None
      name:
-        "wstETH Vault Derive"
+        "wstETH Vault (Derive)"
    }
```

```diff
+   Status: CREATED
    contract WETH Vault (Polynomial) (0x1bF463463dd6747230Ee1bF9428376EBF1e2C23a)
    +++ description: None
```

```diff
+   Status: CREATED
    contract PENDLE Vault (Kinto) (0x1Ca284BaA0023b6bB0950C93ee6d1f2068de2D97)
    +++ description: None
```

```diff
+   Status: CREATED
    contract SolvBTC Vault (Derive) (0x383a4EdB30E896b8d2d044Be87079D45c0EA7065)
    +++ description: None
```

```diff
+   Status: CREATED
    contract GHO Vault (Kinto) (0x4F18853BE8C01d375889c02D61A77B476d3E59dd)
    +++ description: None
```

```diff
+   Status: CREATED
    contract LDO Vault (Kinto) (0x54e60fef7c7f2f747900452D4151aF976EaeAb76)
    +++ description: None
```

```diff
+   Status: CREATED
    contract xSolvBTC Vault (Derive) (0xB592512153c22F5Ba573b0c3E04cAB99d4Cd8856)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ONDO Vault (Kinto) (0xCa1AaCB6E16E7d50c6442f9eD6faEe5dDa638DaD)
    +++ description: None
```

```diff
+   Status: CREATED
    contract WBTC Vault (Kinto) (0xd4964E8A405D396d94825f4d0f5dEDD8741C1d36)
    +++ description: None
```

```diff
+   Status: CREATED
    contract AAVE Vault (Kinto) (0xF90AA670ddC1Ae778015f5B84587ad3407dB7Cf9)
    +++ description: None
```

Generated with discovered.json: 0x0972f8691146200f3531134341fb3f729d9f2d65

# Diff at Fri, 11 Apr 2025 06:52:00 GMT:

- chain: ethereum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@a946e9842245b891a11dfd66e5a103281bde27da block: 22046031
- current block number: 22244020

## Description

polynomial sDai vault owner change.

## Watched changes

```diff
    contract sDAI Vault Polynomial (0x615172e47c0C5A6dA8ea959632Ac0166f7a59eDc) {
    +++ description: None
      values.owner:
-        "0xAeBF1Bc19Ed4Fdf509c456ab6c28D25C9Ca3B332"
+        "0x9f76043B23125024Ce5f0Fb4AE707482107dd2a8"
    }
```

```diff
    contract Socket (0x943AC2775928318653e91d350574436A1b9b16f9) {
    +++ description: None
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.159:
+        "0x935f1C29Db1155c3E0f39F644DF78DDDBD4757Ff"
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.158:
+        "0x4B4ed8b47EA37FB0230472fAdaFAF12658f05Ad7"
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.157:
+        "0x67c97Bd542B3a7F1F1EcF85CBC4409421ccAe971"
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.156:
+        "0x6B3614474eE19FA9A2d6D2079a2D73c04E567310"
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.155:
-        "0x935f1C29Db1155c3E0f39F644DF78DDDBD4757Ff"
+        "0x15CEcd5190A43C7798dD2058308781D0662e678E"
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.154:
-        "0x67c97Bd542B3a7F1F1EcF85CBC4409421ccAe971"
+        "0xb1178803A726e2077947754de9f2f0cbdA29A60F"
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.153:
-        "0x6B3614474eE19FA9A2d6D2079a2D73c04E567310"
+        "0x642c4c33301EF5837ADa6E74F15Aa939f3951Fff"
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.152:
-        "0x15CEcd5190A43C7798dD2058308781D0662e678E"
+        "0x96E1e9c80619D2038afe30450b3cBeCb2A7D94cd"
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.151:
-        "0xb1178803A726e2077947754de9f2f0cbdA29A60F"
+        "0xA2bE759B86CeA53372C3e9a882047cdC3884D568"
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.150:
-        "0x642c4c33301EF5837ADa6E74F15Aa939f3951Fff"
+        "0x9ED094fDe2a31BEd0278a4cfdb5528473baFe5a8"
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.149:
-        "0x96E1e9c80619D2038afe30450b3cBeCb2A7D94cd"
+        "0x998d7C2257591cC38383B4F91474c5346111f2E6"
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.148:
-        "0xA2bE759B86CeA53372C3e9a882047cdC3884D568"
+        "0x6dED17643D7acFc0bE0e79ff6C4762F12AA5516E"
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.147:
-        "0x9ED094fDe2a31BEd0278a4cfdb5528473baFe5a8"
+        "0x1734067c2CDcFb81ef9672F80DA2D7bfC2CFAE73"
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.146:
-        "0x998d7C2257591cC38383B4F91474c5346111f2E6"
+        "0x457379de638CAFeB1759a22457fe893b288E2e89"
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.145:
-        "0x6dED17643D7acFc0bE0e79ff6C4762F12AA5516E"
+        "0x65A9b862671de5Df85EcE387220C6b10a17230f7"
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.144:
-        "0x1734067c2CDcFb81ef9672F80DA2D7bfC2CFAE73"
+        "0x8843557Fd6005d617A735731BF1bAb0461af55E4"
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.143:
-        "0x457379de638CAFeB1759a22457fe893b288E2e89"
+        "0xe38Dccb8Bd138c326E3Df926ADD9dE71a442837F"
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.142:
-        "0x65A9b862671de5Df85EcE387220C6b10a17230f7"
+        "0x80f5143AF6BF51B38C038BaFF71465Be9b48cAEe"
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.141:
-        "0x8843557Fd6005d617A735731BF1bAb0461af55E4"
+        "0xFb0c284CD9929eB5139eB027aD7497097Ba25C87"
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.140:
-        "0xe38Dccb8Bd138c326E3Df926ADD9dE71a442837F"
+        "0xfa8c07E28461eb7c65b33De024DB97eE4C052C97"
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.139:
-        "0x80f5143AF6BF51B38C038BaFF71465Be9b48cAEe"
+        "0x4ab7B94BA3f3CF69354Eb2f6b5E856DC61e13660"
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.138:
-        "0xFb0c284CD9929eB5139eB027aD7497097Ba25C87"
+        "0xBEF69d0acC388091c7C9702aCbFB3b8A873e239e"
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.137:
-        "0xfa8c07E28461eb7c65b33De024DB97eE4C052C97"
+        "0x1b882b9E87ABd7DD9B9b689Bee10Ed6a040033D0"
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.136:
-        "0x4ab7B94BA3f3CF69354Eb2f6b5E856DC61e13660"
+        "0xd48A35a853858e344aFCbEcCDBf8FCbFaF8e1501"
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.135:
-        "0xBEF69d0acC388091c7C9702aCbFB3b8A873e239e"
+        "0x170fFDe318B514B029E1B1eC4F096C7e1bDeaeA8"
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.134:
-        "0x1b882b9E87ABd7DD9B9b689Bee10Ed6a040033D0"
+        "0x134643Df54DCaaAf343505361D1Eac58A7400b3d"
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.133:
-        "0xd48A35a853858e344aFCbEcCDBf8FCbFaF8e1501"
+        "0xE7ADE6Dda067c501A3d4C938c36c310c55FBcc27"
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.132:
-        "0x170fFDe318B514B029E1B1eC4F096C7e1bDeaeA8"
+        "0x9d13F2b3B694DE6a1cF58edb5044454CAE3B84E4"
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.131:
-        "0x134643Df54DCaaAf343505361D1Eac58A7400b3d"
+        "0xDABF17a0f13290E85a347119deEb8539B41eF4eB"
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.130:
-        "0xE7ADE6Dda067c501A3d4C938c36c310c55FBcc27"
+        "0x083Add2A9afa97Efb6412b293145ce965eCE3600"
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.129:
-        "0x9d13F2b3B694DE6a1cF58edb5044454CAE3B84E4"
+        "0x7FBCd72B6368f1771C9F6Ee16502C19b0AADBa1D"
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.128:
-        "0xDABF17a0f13290E85a347119deEb8539B41eF4eB"
+        "0x02D53793b18d032Cd94d745F7586C6F66F83f8e3"
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.127:
-        "0x083Add2A9afa97Efb6412b293145ce965eCE3600"
+        "0x3553c0102684c20e2f8192d6F013c7242710b4b3"
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.126:
-        "0x7FBCd72B6368f1771C9F6Ee16502C19b0AADBa1D"
+        "0x7Eee3241eC98ED0B47c8Bc0e9E3327B541BCDc1D"
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.125:
-        "0x02D53793b18d032Cd94d745F7586C6F66F83f8e3"
+        "0x4a43eD818411585fEAaf667a2D3E2605962084e0"
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.124:
-        "0x3553c0102684c20e2f8192d6F013c7242710b4b3"
+        "0x3390ca7A0D7C80871B05C3FeBbeEee91307a35ba"
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.123:
-        "0x7Eee3241eC98ED0B47c8Bc0e9E3327B541BCDc1D"
+        "0x15f70f64438603e5872A4E81c7a8B5edB5D70d93"
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.122:
-        "0x4a43eD818411585fEAaf667a2D3E2605962084e0"
+        "0x37C24e7081eb7f2B16bde81b556d082c0839F754"
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.121:
-        "0x3390ca7A0D7C80871B05C3FeBbeEee91307a35ba"
+        "0x833a7FA0Ff734b2BA01e8d2126e127cf8f29eFaD"
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.120:
-        "0x15f70f64438603e5872A4E81c7a8B5edB5D70d93"
+        "0x91CE463148bD7695d4db41f4aA36088E502428F7"
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.119:
-        "0x37C24e7081eb7f2B16bde81b556d082c0839F754"
+        "0xcb473D87A56b4609A695753711F727E5c4335cCf"
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.118:
-        "0x833a7FA0Ff734b2BA01e8d2126e127cf8f29eFaD"
+        "0x88444394f970B6F21C4f5101003ea513dE3E5406"
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.117:
-        "0x91CE463148bD7695d4db41f4aA36088E502428F7"
+        "0xf7a4a34d64E8fE4FCCffE2f3C985D43409Aa8c9a"
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.116:
-        "0xcb473D87A56b4609A695753711F727E5c4335cCf"
+        "0xb40FdECfCa4EF29CACc37222Ce4dB1fd0f561a00"
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.115:
-        "0x88444394f970B6F21C4f5101003ea513dE3E5406"
+        "0xab722902681A260762084A78A2d8f19CfA6A46Ef"
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.114:
-        "0xf7a4a34d64E8fE4FCCffE2f3C985D43409Aa8c9a"
+        "0x8F4e67C61232167584333e23D7d67BD73d80a4F5"
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.113:
-        "0xb40FdECfCa4EF29CACc37222Ce4dB1fd0f561a00"
+        "0x7a6Edde81cdD9d75BC10D87C490b132c08bD426D"
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.112:
-        "0xab722902681A260762084A78A2d8f19CfA6A46Ef"
+        "0x519Bc0379CA9C4061a6006B4EAc419bC00017B3E"
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.111:
-        "0x8F4e67C61232167584333e23D7d67BD73d80a4F5"
+        "0x3F574bc32a0bE9514010409FE8CF19e56fd7C83a"
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.110:
-        "0x7a6Edde81cdD9d75BC10D87C490b132c08bD426D"
+        "0xcf2B4958e72Db99FDF844cD3992Daa2a8B7319c5"
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.109:
-        "0x519Bc0379CA9C4061a6006B4EAc419bC00017B3E"
+        "0xAc00056920EfF02831CAf0baF116ADf6B42D9ad1"
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.108:
-        "0x3F574bc32a0bE9514010409FE8CF19e56fd7C83a"
+        "0x254691C06Da387c1050C726cF498eFdA89083820"
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.107:
-        "0xcf2B4958e72Db99FDF844cD3992Daa2a8B7319c5"
+        "0x00CE54B988D8C44bFCae4026C17c37c69C490A12"
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.106:
-        "0xAc00056920EfF02831CAf0baF116ADf6B42D9ad1"
+        "0x5D5a2999E91A336CA99da0cB636898ccB521f40a"
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.105:
-        "0x254691C06Da387c1050C726cF498eFdA89083820"
+        "0x2Dba37E679358125BaB2132dDF5133d7d66F7D06"
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.104:
-        "0x00CE54B988D8C44bFCae4026C17c37c69C490A12"
+        "0x88A05556Af1a8a5BB5964c46Be9D56C379a5E155"
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.103:
-        "0x5D5a2999E91A336CA99da0cB636898ccB521f40a"
+        "0x92469EEf05a071B0e56275b23597b1b701C15a71"
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.102:
-        "0x2Dba37E679358125BaB2132dDF5133d7d66F7D06"
+        "0xDBa83C0C654DB1cd914FA2710bA743e925B53086"
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.101:
-        "0x88A05556Af1a8a5BB5964c46Be9D56C379a5E155"
+        "0xFAB1efe6cA9435faEf9e29f40E575e27A74373A9"
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.100:
-        "0x92469EEf05a071B0e56275b23597b1b701C15a71"
+        "0xB49b8AAcD8396C49d9045f6bAb101aB32c59643D"
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.99:
-        "0xDBa83C0C654DB1cd914FA2710bA743e925B53086"
+        "0x0c39a1b042AbfC68d10B78081AFE3F58a6523A35"
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.98:
-        "0xFAB1efe6cA9435faEf9e29f40E575e27A74373A9"
+        "0x895b6c1413243562128a9281a7f8891640Ca073f"
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.97:
-        "0xB49b8AAcD8396C49d9045f6bAb101aB32c59643D"
+        "0xBF3233Ef07B9552578987e2A2d25F760fBf192e5"
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.96:
-        "0x0c39a1b042AbfC68d10B78081AFE3F58a6523A35"
+        "0x6A769e25081396a49a6702758d0830920ac1163A"
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.95:
-        "0x895b6c1413243562128a9281a7f8891640Ca073f"
+        "0x716c339F41eAcfE2dc4775052411394A2Ed04743"
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.94:
-        "0xBF3233Ef07B9552578987e2A2d25F760fBf192e5"
+        "0x9D0487D8d93Fc08938A39e355c676A8b032Dc52a"
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.93:
-        "0x6A769e25081396a49a6702758d0830920ac1163A"
+        "0x5366D4acCC96Ed297e30B8702FBC9b85daA3a459"
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.92:
-        "0x716c339F41eAcfE2dc4775052411394A2Ed04743"
+        "0xCf814e58f1649F94d37E51f730D6bF72409fA09c"
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.91:
-        "0x9D0487D8d93Fc08938A39e355c676A8b032Dc52a"
+        "0xf71A92D4bEFc2e18671c3b20377d45729790e880"
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.90:
-        "0x5366D4acCC96Ed297e30B8702FBC9b85daA3a459"
+        "0x200AF8FCdD5246D70B369A98143Ac8930A077B7A"
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.89:
-        "0xCf814e58f1649F94d37E51f730D6bF72409fA09c"
+        "0x50D46c3BB529276aDe59a6678C14302D6B61C853"
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.88:
-        "0xf71A92D4bEFc2e18671c3b20377d45729790e880"
+        "0x388341d9E5A7D7d5accD738B2a31b0622E0c1b87"
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.87:
-        "0x200AF8FCdD5246D70B369A98143Ac8930A077B7A"
+        "0x68411d61adF1341A6392C87A93941FdD3EE7DF8E"
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.86:
-        "0x50D46c3BB529276aDe59a6678C14302D6B61C853"
+        "0xF391E487FE3958F0728436Af84455Fd4eBC9c7c9"
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.85:
-        "0x388341d9E5A7D7d5accD738B2a31b0622E0c1b87"
+        "0xb5d5E523905bB397bCAfB36B252535a255d3E23C"
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.84:
-        "0x68411d61adF1341A6392C87A93941FdD3EE7DF8E"
+        "0xC3875afddEde146DCfED7e72b2Ad12B853CA1241"
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.83:
-        "0xF391E487FE3958F0728436Af84455Fd4eBC9c7c9"
+        "0x55033cb4583f5526704Ee4C197e99504E504712c"
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.82:
-        "0xb5d5E523905bB397bCAfB36B252535a255d3E23C"
+        "0xc706c946623C70B294b91Bd4961E91FaF7A74317"
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.81:
-        "0xC3875afddEde146DCfED7e72b2Ad12B853CA1241"
+        "0xdb1c2F432e51824b33b9269C4b1Ff6190c1e5F35"
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.80:
-        "0x55033cb4583f5526704Ee4C197e99504E504712c"
+        "0xB1b7BC699cAEcB941e7377065c7CE82039889603"
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.79:
-        "0xc706c946623C70B294b91Bd4961E91FaF7A74317"
+        "0x7E6dA87FE69306CaAED675fFe4e7dC0FfE3bFe4D"
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.78:
-        "0xdb1c2F432e51824b33b9269C4b1Ff6190c1e5F35"
+        "0x5Afa7ddBcE8EE8862FDf5fD8c546BF32615d2D9B"
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.77:
-        "0xB1b7BC699cAEcB941e7377065c7CE82039889603"
+        "0x76C9129b44c637500c88760ADd2EbEF07472b549"
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.76:
-        "0x7E6dA87FE69306CaAED675fFe4e7dC0FfE3bFe4D"
+        "0x76ddfc271089e58Af68D8597D41aEF52Fb53EC3D"
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.75:
-        "0x5Afa7ddBcE8EE8862FDf5fD8c546BF32615d2D9B"
+        "0x1A9ba93F3cb22Ba7228D29607075F444e9ff515c"
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.74:
-        "0x76C9129b44c637500c88760ADd2EbEF07472b549"
+        "0xCc958F84DaF36d3eC20BcBee7E99C073B882efc3"
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.73:
-        "0x76ddfc271089e58Af68D8597D41aEF52Fb53EC3D"
+        "0x008244E37A90E090dc4abD70F37195075cbE8453"
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.72:
-        "0x1A9ba93F3cb22Ba7228D29607075F444e9ff515c"
+        "0xC331BEeC6e36c8Df4FDD7e432de95863E7f80d67"
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.71:
-        "0xCc958F84DaF36d3eC20BcBee7E99C073B882efc3"
+        "0xf1807B621efC3B072d1203dD28C880BBEDc56161"
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.70:
-        "0x008244E37A90E090dc4abD70F37195075cbE8453"
+        "0xa1D11b141bb47eDb2c69B8ced4EFe80f62D1C276"
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.69:
-        "0xC331BEeC6e36c8Df4FDD7e432de95863E7f80d67"
+        "0xe987a57DA7Ab112B1bDc7AA704E6EA943760d252"
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.68:
-        "0xf1807B621efC3B072d1203dD28C880BBEDc56161"
+        "0x3f66F272d33B764960779a301c4183306ae50e10"
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.67:
-        "0xa1D11b141bb47eDb2c69B8ced4EFe80f62D1C276"
+        "0x1a0e7Efa0F74703A930B2b1Cb6565b1d8981dd85"
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.66:
-        "0xe987a57DA7Ab112B1bDc7AA704E6EA943760d252"
+        "0xCE0AB493716d96C0979E0B708BeF1915F3B07e01"
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.65:
-        "0x3f66F272d33B764960779a301c4183306ae50e10"
+        "0x12fBD04CB103c596B78110C70eEDF16821CBfcAE"
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.64:
-        "0x1a0e7Efa0F74703A930B2b1Cb6565b1d8981dd85"
+        "0xE2c2291B80BFC8Bd0e4fc8Af196Ae5fc9136aeE0"
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.63:
-        "0xCE0AB493716d96C0979E0B708BeF1915F3B07e01"
+        "0x8E8D89410000A993d2537d26366e1C3010AB90ff"
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.62:
-        "0x12fBD04CB103c596B78110C70eEDF16821CBfcAE"
+        "0x32295769ea702BA9337EE5B65c6b42aFF75FEC62"
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.61:
-        "0xE2c2291B80BFC8Bd0e4fc8Af196Ae5fc9136aeE0"
+        "0x94104d7801f30d2f9069118C65Fe63A3A11515B1"
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.60:
-        "0x8E8D89410000A993d2537d26366e1C3010AB90ff"
+        "0xCF83efEe74f61771AF78b05DeA847773D3952C33"
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.59:
-        "0x32295769ea702BA9337EE5B65c6b42aFF75FEC62"
+        "0x432684E7e764343c836d9c78b9245aa774323E40"
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.58:
-        "0x94104d7801f30d2f9069118C65Fe63A3A11515B1"
+        "0x727aD65db6aE99DB5Dbee8F202846DD6009bf6D5"
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.57:
-        "0xCF83efEe74f61771AF78b05DeA847773D3952C33"
+        "0x12a4CC40a8F89E40F8C849c2F89741D5C9590a14"
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.56:
-        "0x727aD65db6aE99DB5Dbee8F202846DD6009bf6D5"
+        "0x412CC246d703598e3705B9536B4Ec3c2039f6e5E"
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.55:
-        "0x12a4CC40a8F89E40F8C849c2F89741D5C9590a14"
+        "0x1Eb392Aba52a2D933e58f7E86Ca96b9A3e2D8166"
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.54:
-        "0x412CC246d703598e3705B9536B4Ec3c2039f6e5E"
+        "0x2B93891dc80ab9696814615f553fd15a3b98d3a2"
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.53:
-        "0x1Eb392Aba52a2D933e58f7E86Ca96b9A3e2D8166"
+        "0x52DB079d07fb8C2F5FA158C3311d877f3769B01e"
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.52:
-        "0x2B93891dc80ab9696814615f553fd15a3b98d3a2"
+        "0xE88F6b194BD3b43013710A785DDFF41454A19537"
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.51:
-        "0xE88F6b194BD3b43013710A785DDFF41454A19537"
+        "0xBbA3095f6ACA17ff23Df466833D621cc91Db7675"
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.50:
-        "0xBbA3095f6ACA17ff23Df466833D621cc91Db7675"
+        "0x75695e8A56405dC60a0aFf07d1AF01A0baCA7188"
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.49:
-        "0x75695e8A56405dC60a0aFf07d1AF01A0baCA7188"
+        "0x223033E1F905eEd161a7B2EBeb786a158156fb8D"
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.48:
-        "0x223033E1F905eEd161a7B2EBeb786a158156fb8D"
+        "0x4E83292d5cacf05B85bED2c3D4a6056F42EE1738"
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.47:
-        "0x4E83292d5cacf05B85bED2c3D4a6056F42EE1738"
+        "0x266abd77Da7F877cdf93c0dd5782cC61Fa29ac96"
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.46:
-        "0x266abd77Da7F877cdf93c0dd5782cC61Fa29ac96"
+        "0xdE9D8c2d465669c661672d7945D4d4f5407d22E2"
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.45:
-        "0xdE9D8c2d465669c661672d7945D4d4f5407d22E2"
+        "0xdCcFb24f983586144c085426dbfa3414045E19a3"
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.44:
-        "0xdCcFb24f983586144c085426dbfa3414045E19a3"
+        "0x876b81F74AD47cF10e5D62aAAc80f9E99f5587FC"
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.43:
-        "0x876b81F74AD47cF10e5D62aAAc80f9E99f5587FC"
+        "0x7E34B138e507570bDCC9b99230cFaA2745F0222C"
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.42:
-        "0x7E34B138e507570bDCC9b99230cFaA2745F0222C"
+        "0x7163FaC3fc420923810cCA5d15949c1523F69B4a"
    }
```

```diff
    contract sUSDe Vault Polynomial (0xC6cfb996A7CFEB89813A68CD13942CD75553032b) {
    +++ description: None
      values.owner:
-        "0xAeBF1Bc19Ed4Fdf509c456ab6c28D25C9Ca3B332"
+        "0x9f76043B23125024Ce5f0Fb4AE707482107dd2a8"
    }
```

```diff
    contract USDC Vault Polynomial (0xDE1617Ddb7C8A250A409D986930001985cfad76F) {
    +++ description: None
      values.owner:
-        "0xAeBF1Bc19Ed4Fdf509c456ab6c28D25C9Ca3B332"
+        "0x9f76043B23125024Ce5f0Fb4AE707482107dd2a8"
    }
```

Generated with discovered.json: 0xa3ed0442ecdf2959506a30f5183be81b673912d8

# Diff at Tue, 18 Mar 2025 08:14:05 GMT:

- chain: ethereum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@4ef7a8dbcec1cd9fec77aae2b73d81347a4ffb13 block: 22046031
- current block number: 22046031

## Description

Config: change Multisig names.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22046031 (main branch discovery), not current.

```diff
    contract KintsugiFoundation (0x94561e98DD5E55271f91A103e4979aa6C493745E) {
    +++ description: None
      name:
-        "MamoriLabs2"
+        "KintsugiFoundation"
    }
```

Generated with discovered.json: 0xbddd6290321a9d8dba213774cf2c91640790ff0a

# Diff at Fri, 14 Mar 2025 15:33:08 GMT:

- chain: ethereum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@002bac09dea3b1154ecc36736323fb7552478ce4 block: 21995661
- current block number: 22046031

## Description

New plugs added.

## Watched changes

```diff
    contract Socket (0x943AC2775928318653e91d350574436A1b9b16f9) {
    +++ description: None
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.155:
+        "0x15CEcd5190A43C7798dD2058308781D0662e678E"
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.154:
+        "0x5E72430EC945CCc183c34e2860FFC2b5bac712c2"
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.153:
+        "0x8E8D89410000A993d2537d26366e1C3010AB90ff"
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.152:
+        "0x134643Df54DCaaAf343505361D1Eac58A7400b3d"
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.151:
+        "0xB4e78DAEaE4aA911f2427FF4af4B10AFe70D9891"
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.150:
+        "0x96E1e9c80619D2038afe30450b3cBeCb2A7D94cd"
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.149:
+        "0xBEF69d0acC388091c7C9702aCbFB3b8A873e239e"
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.148:
+        "0x67c97Bd542B3a7F1F1EcF85CBC4409421ccAe971"
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.147:
+        "0x88444394f970B6F21C4f5101003ea513dE3E5406"
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.146:
+        "0xD3a00E95658b05eBac3246e84f6583251dEd5D93"
    }
```

Generated with discovered.json: 0x13c6c4e489cf58684c59bed1f04f7b85dab06d24

# Diff at Fri, 07 Mar 2025 14:41:44 GMT:

- chain: ethereum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@c5dbe2ef6b8273c834507deba40dda8a1affce55 block: 21579626
- current block number: 21995661

## Description

Owner changes and new plug added.

## Watched changes

```diff
    contract USDT Vault Zora (0x1417f50f864ba75D5c6cb4CD14479c48Ce5166fB) {
    +++ description: None
      values.owner:
-        "0xE328a0B1e0bE7043c9141c2073e408D1086E1175"
+        "0x7B5Ba9Df17Bc58F504B6Cf0D87d2f05B79a36cfF"
    }
```

```diff
    contract KLAUS Vault Zora (0x528DBFcf6e2cbC62B05d7a74711AA7C44FF43cA2) {
    +++ description: None
      values.owner:
-        "0xE328a0B1e0bE7043c9141c2073e408D1086E1175"
+        "0x7B5Ba9Df17Bc58F504B6Cf0D87d2f05B79a36cfF"
    }
```

```diff
    contract USDC Vault Zora (0x58CDCf55f2c8660674F17561334F6370cbaDeEF8) {
    +++ description: None
      values.owner:
-        "0xE328a0B1e0bE7043c9141c2073e408D1086E1175"
+        "0x7B5Ba9Df17Bc58F504B6Cf0D87d2f05B79a36cfF"
    }
```

```diff
    contract Socket (0x943AC2775928318653e91d350574436A1b9b16f9) {
    +++ description: None
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.145:
+        "0x9ED094fDe2a31BEd0278a4cfdb5528473baFe5a8"
    }
```

Generated with discovered.json: 0xa807425a57fd9e401ec905802576a089af0a8078

# Diff at Tue, 04 Mar 2025 10:39:57 GMT:

- chain: ethereum
- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@98d260b45fe0d2195ce5e629bd7b200c8706e8ba block: 21579626
- current block number: 21579626

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21579626 (main branch discovery), not current.

```diff
    contract WETH Vault Kinto (0x00A0c9d82B95a17Cdf2D46703F2DcA13EB0E8A94) {
    +++ description: None
      sinceBlock:
+        19905691
    }
```

```diff
    contract PolygonL1Switchboard (0x053407DFA30267f6332f3c94a9e9F704A55e62CD) {
    +++ description: None
      sinceBlock:
+        18583724
    }
```

```diff
    contract sdeUSD Vault Reya (0x0A5A19376064fED2A0A9f3120B2426c957BC289D) {
    +++ description: None
      sinceBlock:
+        20986446
    }
```

```diff
    contract deUSD Vault Reya (0x0b4447344fAAA340bcD2B0FdBD8f0CEcd161bC9E) {
    +++ description: None
      sinceBlock:
+        20986451
    }
```

```diff
    contract OptimismSwitchboard2 (0x0E674e057EC0FF97eeA57B6A350DBAAD22FE41BA) {
    +++ description: None
      sinceBlock:
+        18584376
    }
```

```diff
    contract MKR Vault Kinto (0x0fC783f611A888A2cAbC3dA482Add3215334dCc2) {
    +++ description: None
      sinceBlock:
+        20329021
    }
```

```diff
    contract CapacitorFactory (0x11Fbb9116801DB54bB51fF4dF423e34E8b45fc9a) {
    +++ description: None
      sinceBlock:
+        18583488
    }
```

```diff
    contract DAI Vault Kinto (0x12Cf431BdF7F143338cC09A0629EDcCEDCBCEcB5) {
    +++ description: None
      sinceBlock:
+        19891645
    }
```

```diff
    contract OptimismSwitchboard (0x139f39DC7dC05F7aC2DB3DB6af4f2e1a9De7c287) {
    +++ description: None
      sinceBlock:
+        18584378
    }
```

```diff
    contract USDT Vault Zora (0x1417f50f864ba75D5c6cb4CD14479c48Ce5166fB) {
    +++ description: None
      sinceBlock:
+        20734248
    }
```

```diff
    contract USDT Vault Kinto (0x1D18263107a138C7fb0De65b4a78d193ff9664c1) {
    +++ description: None
      sinceBlock:
+        21108579
    }
```

```diff
    contract WBTC Vault Reya (0x2344621d5aA6e784e8C6f4c54b0B29Dd9c3Ad4B6) {
    +++ description: None
      sinceBlock:
+        19733498
    }
```

```diff
    contract LyraMultisig (0x246d38588b16Dd877c558b245e6D5a711C649fCF) {
    +++ description: None
      sinceBlock:
+        11918385
    }
```

```diff
    contract eBTC Vault Derive (0x25d35C8796c9dcD3857abE90D802FC17b1FB55A5) {
    +++ description: None
      sinceBlock:
+        20837834
    }
```

```diff
    contract PAXG Vault Kinto (0x25f0D71Da51A77Ca231484eBbAD1f588A0230ef2) {
    +++ description: None
      sinceBlock:
+        20329110
    }
```

```diff
    contract USDe Vault Derive (0x26Cf1Dc84694E04277F2Fe4C13E43597c6010C2A) {
    +++ description: None
      sinceBlock:
+        20568476
    }
```

```diff
    contract KINTO Vault Kinto (0x2f87464d5F5356dB350dcb302FE28040986783a7) {
    +++ description: None
      sinceBlock:
+        20162145
    }
```

```diff
    contract ENA Vault Kinto (0x351d8894fB8bfa1b0eFF77bFD9Aab18eA2da8fDd) {
    +++ description: None
      sinceBlock:
+        19905737
    }
```

```diff
    contract rsETH Vault Derive (0x35d4D9bc79B0a543934b1769304B90d752691caD) {
    +++ description: None
      sinceBlock:
+        20036749
    }
```

```diff
    contract WBTC Vault Derive (0x3Eec7c855aF33280F1eD38b93059F5aa5862E3ab) {
    +++ description: None
      sinceBlock:
+        18991397
    }
```

```diff
    contract sUSDe Vault Kinto (0x43b718Aa5e678b08615CA984cbe25f690B085b32) {
    +++ description: None
      sinceBlock:
+        19905815
    }
```

```diff
    contract rswETH Vault Derive (0x4BB4C3CDc7562f08e9910A0C7D8bB7e108861eB4) {
    +++ description: None
      sinceBlock:
+        19881920
    }
```

```diff
    contract KLAUS Vault Zora (0x528DBFcf6e2cbC62B05d7a74711AA7C44FF43cA2) {
    +++ description: None
      sinceBlock:
+        21108607
    }
```

```diff
    contract USDC Vault Zora (0x58CDCf55f2c8660674F17561334F6370cbaDeEF8) {
    +++ description: None
      sinceBlock:
+        20734237
    }
```

```diff
    contract sDAI Vault Kinto (0x5B8Ae1C9c5970e2637Cf3Af431acAAebEf7aFb85) {
    +++ description: None
      sinceBlock:
+        19905811
    }
```

```diff
    contract Hasher (0x5C71beE4a6b0D617D8c3d107D331292741789E27) {
    +++ description: None
      sinceBlock:
+        18583487
    }
```

```diff
    contract USDT Vault Derive (0x5e98A25d8d6FF69A8992d6Aa57948dFB77D4ECBa) {
    +++ description: None
      sinceBlock:
+        19032542
    }
```

```diff
    contract cbBTC Vault Derive (0x5F18C54e4E10287414A47925a24Ea3A8Cf4A9F50) {
    +++ description: None
      sinceBlock:
+        20837808
    }
```

```diff
    contract sUSDe Vault Reya (0x5F3B301B4967623fDb3AE52Bb8FF4dB01C460Cd3) {
    +++ description: None
      sinceBlock:
+        20620391
    }
```

```diff
    contract sDAI Vault Derive (0x613e87BE1cd75dEBC5e6e56a2AF2fED84162C142) {
    +++ description: None
      sinceBlock:
+        20568467
    }
```

```diff
    contract sDAI Vault Polynomial (0x615172e47c0C5A6dA8ea959632Ac0166f7a59eDc) {
    +++ description: None
      sinceBlock:
+        20326243
    }
```

```diff
    contract WETH Vault Reya (0x64dF894688c5052BeAdC35371cF69151Ebc5D658) {
    +++ description: None
      sinceBlock:
+        19920603
    }
```

```diff
    contract USDC Vault Derive (0x6D303CEE7959f814042D31E0624fB88Ec6fbcC1d) {
    +++ description: None
      sinceBlock:
+        18591914
    }
```

```diff
    contract USDC Vault Kinto (0x755cD5d147036E11c76F1EeffDd94794fC265f0d) {
    +++ description: None
      sinceBlock:
+        19905710
    }
```

```diff
    contract LBTC Vault Derive (0x76624ff43D610F64177Bb9c194A2503642e9B803) {
    +++ description: None
      sinceBlock:
+        20644303
    }
```

```diff
    contract SNX Vault Derive (0x7D7aC8d55A9bD4152b703011f3E61AB3bB0A5592) {
    +++ description: None
      sinceBlock:
+        19257597
    }
```

```diff
    contract DAI Vault Derive (0x7E1d17b580dD4F89037DB331430eAEe8B8e50c91) {
    +++ description: None
      sinceBlock:
+        20568457
    }
```

```diff
    contract weETH Vault Derive (0x8180EcCC825b692ef65FF099a0A387743788bf78) {
    +++ description: None
      sinceBlock:
+        19881204
    }
```

```diff
    contract cbBTC Vault Kinto (0x8F5247072e9580624Be243D4EC8cD3F3ABfF86B9) {
    +++ description: None
      sinceBlock:
+        21108816
    }
```

```diff
    contract Socket (0x943AC2775928318653e91d350574436A1b9b16f9) {
    +++ description: None
      sinceBlock:
+        18583489
    }
```

```diff
    contract ETHFI Vault Kinto (0x95d60E34aB2E626407d98dF8C240e6174e5D37E5) {
    +++ description: None
      sinceBlock:
+        19911811
    }
```

```diff
    contract ExecutionManager (0x98CAd9A205f1F7A7150241Ef2d565d1702BCe57C) {
    +++ description: None
      sinceBlock:
+        20362743
    }
```

```diff
    contract SOL Vault Kinto (0xA2bc0DaA9BF98820632bCa0663a9616f6bC180f8) {
    +++ description: None
      sinceBlock:
+        20721977
    }
```

```diff
    contract LINK Vault Kinto (0xA6Ae29Ce5c38DFE0Dd95B716748ac747f31E4013) {
    +++ description: None
      sinceBlock:
+        21108695
    }
```

```diff
    contract LOOKS Vault Blast (0xa83B4006c16DAeAb2718294696c0122519195137) {
    +++ description: None
      sinceBlock:
+        20038317
    }
```

```diff
    contract USDe Vault Reya (0xaA2f2B6cD33Eaabb795c6DB60AAec599C8450F35) {
    +++ description: None
      sinceBlock:
+        20435172
    }
```

```diff
    contract wstETH Vault Kinto (0xc5d01939Af7Ce9Ffc505F0bb36eFeDde7920f2dc) {
    +++ description: None
      sinceBlock:
+        19904529
    }
```

```diff
    contract sUSDe Vault Polynomial (0xC6cfb996A7CFEB89813A68CD13942CD75553032b) {
    +++ description: None
      sinceBlock:
+        20339816
    }
```

```diff
    contract LooksRareMultisig (0xC8C57e4C73c71f72cA0a7e043E5D2D144F98ef13) {
    +++ description: None
      sinceBlock:
+        13976268
    }
```

```diff
    contract XAUt Vault Kinto (0xd04Bc056BE36a6127267E4F71d3b43D1BEEfE8bF) {
    +++ description: None
      sinceBlock:
+        20329119
    }
```

```diff
    contract SPX Vault Kinto (0xd1228C6CB94a670F30D5ACb1340a9d96aC30e6A8) {
    +++ description: None
      sinceBlock:
+        21066552
    }
```

```diff
    contract WETH Vault Derive (0xD4efe33C66B8CdE33B8896a2126E41e5dB571b7e) {
    +++ description: None
      sinceBlock:
+        18991429
    }
```

```diff
    contract FastSwitchboard (0xD5a83a40F262E2247e6566171f9ADc76b745F5cD) {
    +++ description: None
      sinceBlock:
+        18583721
    }
```

```diff
    contract eUSD Vault Kinto (0xDB0e855F55ff35dA8754e5297925bd6c4Cb1Fa48) {
    +++ description: None
      sinceBlock:
+        20902195
    }
```

```diff
    contract EIGEN Vault Kinto (0xdb161cdc9c11892922F7121a409b196f3b00e640) {
    +++ description: None
      sinceBlock:
+        19905803
    }
```

```diff
    contract USDC Vault Polynomial (0xDE1617Ddb7C8A250A409D986930001985cfad76F) {
    +++ description: None
      sinceBlock:
+        20331066
    }
```

```diff
    contract USDe Vault Kinto (0xdf34E61B6e7B9e348713d528fEB019d504d38c1e) {
    +++ description: None
      sinceBlock:
+        19905761
    }
```

```diff
    contract ArbitrumL1Switchboard (0xdf5f7dfDFc26ee5F629949e330bEf56906319CAe) {
    +++ description: None
      sinceBlock:
+        18583726
    }
```

```diff
    contract USD0++ Vault Polynomial (0xDf9Fa2b420689384E8DD55a706262DC0ED37020F) {
    +++ description: None
      sinceBlock:
+        20970833
    }
```

```diff
    contract USDC Vault Reya (0xdFf78A949E47c1e90f3Dd6dd7Fe2Fa72B42a75f7) {
    +++ description: None
      sinceBlock:
+        19590078
    }
```

```diff
    contract sUSDe Vault Derive (0xE3E96892D30E0ee1a8131BAf87c891201F7137bf) {
    +++ description: None
      sinceBlock:
+        20211402
    }
```

```diff
    contract weETH Vault Kinto (0xeB66259d2eBC3ed1d3a98148f6298927d8A36397) {
    +++ description: None
      sinceBlock:
+        19905823
    }
```

```diff
    contract wstETH Vault Derive (0xeBB5D642aA8ccDeE98373D6aC3ee0602b63824b3) {
    +++ description: None
      sinceBlock:
+        19358636
    }
```

```diff
    contract TransmitManager (0xeD037aFBffC65a94E9CC592947E851FB2f730341) {
    +++ description: None
      sinceBlock:
+        18583720
    }
```

```diff
    contract  (0xeeF6520437A6545b4F325F6675C4CD49812d457b) {
    +++ description: None
      sinceBlock:
+        21544458
    }
```

```diff
    contract KintoMultisig (0xf152Abda9E4ce8b134eF22Dc3C6aCe19C4895D82) {
    +++ description: None
      sinceBlock:
+        16818229
    }
```

```diff
    contract SignatureVerifier (0xf1ABF110d1B6ff0E2e8C05dd64FBF9eBA4d8af98) {
    +++ description: None
      sinceBlock:
+        18583486
    }
```

Generated with discovered.json: 0xa8168612e1459760abc88e2794588397494f5e2a

# Diff at Mon, 20 Jan 2025 09:25:24 GMT:

- chain: ethereum
- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@82d3b5c180381f7d2d0e30406b2ac10025d0614f block: 21579626
- current block number: 21579626

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21579626 (main branch discovery), not current.

```diff
    contract Socket (0x943AC2775928318653e91d350574436A1b9b16f9) {
    +++ description: None
      fieldMeta.plugs.type:
+        "CODE_CHANGE"
    }
```

Generated with discovered.json: 0x3503eafda0d0da3d8088681cdf0a5034540c9393

# Diff at Wed, 08 Jan 2025 12:04:43 GMT:

- chain: ethereum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@3e3597c92f09cb5fc5a7ac01db63929f663c026f block: 21428964
- current block number: 21579626

## Description

New plugs and owner changes to a new socket EOA.

## Watched changes

```diff
    contract PolygonL1Switchboard (0x053407DFA30267f6332f3c94a9e9F704A55e62CD) {
    +++ description: None
      values.owner:
-        "0xB0BBff6311B7F245761A7846d3Ce7B1b100C1836"
+        "0xeeF6520437A6545b4F325F6675C4CD49812d457b"
    }
```

```diff
    contract OptimismSwitchboard2 (0x0E674e057EC0FF97eeA57B6A350DBAAD22FE41BA) {
    +++ description: None
      values.owner:
-        "0xB0BBff6311B7F245761A7846d3Ce7B1b100C1836"
+        "0xeeF6520437A6545b4F325F6675C4CD49812d457b"
    }
```

```diff
    contract CapacitorFactory (0x11Fbb9116801DB54bB51fF4dF423e34E8b45fc9a) {
    +++ description: None
      values.owner:
-        "0xB0BBff6311B7F245761A7846d3Ce7B1b100C1836"
+        "0xeeF6520437A6545b4F325F6675C4CD49812d457b"
    }
```

```diff
    contract OptimismSwitchboard (0x139f39DC7dC05F7aC2DB3DB6af4f2e1a9De7c287) {
    +++ description: None
      values.owner:
-        "0xB0BBff6311B7F245761A7846d3Ce7B1b100C1836"
+        "0xeeF6520437A6545b4F325F6675C4CD49812d457b"
    }
```

```diff
    contract Hasher (0x5C71beE4a6b0D617D8c3d107D331292741789E27) {
    +++ description: None
      values.owner:
-        "0xB0BBff6311B7F245761A7846d3Ce7B1b100C1836"
+        "0xeeF6520437A6545b4F325F6675C4CD49812d457b"
    }
```

```diff
    contract Socket (0x943AC2775928318653e91d350574436A1b9b16f9) {
    +++ description: None
      values.owner:
-        "0xB0BBff6311B7F245761A7846d3Ce7B1b100C1836"
+        "0xeeF6520437A6545b4F325F6675C4CD49812d457b"
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.144:
+        "0x04bc61DBd949f068387cfC7a7fB95555bc66F5C5"
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.143:
+        "0x833a7FA0Ff734b2BA01e8d2126e127cf8f29eFaD"
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.142:
+        "0x412CC246d703598e3705B9536B4Ec3c2039f6e5E"
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.141:
+        "0x95c879322BA01e1c7Fe5EB3F3724C49C6aF7e426"
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.140:
+        "0x3Deb3254730eEF7c50fb5b133CA0EaeA2e59127d"
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.139:
+        "0x1a0e7Efa0F74703A930B2b1Cb6565b1d8981dd85"
    }
```

```diff
    contract ExecutionManager (0x98CAd9A205f1F7A7150241Ef2d565d1702BCe57C) {
    +++ description: None
      values.owner:
-        "0xB0BBff6311B7F245761A7846d3Ce7B1b100C1836"
+        "0xeeF6520437A6545b4F325F6675C4CD49812d457b"
    }
```

```diff
    contract FastSwitchboard (0xD5a83a40F262E2247e6566171f9ADc76b745F5cD) {
    +++ description: None
      values.owner:
-        "0xB0BBff6311B7F245761A7846d3Ce7B1b100C1836"
+        "0xeeF6520437A6545b4F325F6675C4CD49812d457b"
    }
```

```diff
    contract ArbitrumL1Switchboard (0xdf5f7dfDFc26ee5F629949e330bEf56906319CAe) {
    +++ description: None
      values.owner:
-        "0xB0BBff6311B7F245761A7846d3Ce7B1b100C1836"
+        "0xeeF6520437A6545b4F325F6675C4CD49812d457b"
    }
```

```diff
    contract TransmitManager (0xeD037aFBffC65a94E9CC592947E851FB2f730341) {
    +++ description: None
      values.owner:
-        "0xB0BBff6311B7F245761A7846d3Ce7B1b100C1836"
+        "0xeeF6520437A6545b4F325F6675C4CD49812d457b"
    }
```

```diff
    contract SignatureVerifier (0xf1ABF110d1B6ff0E2e8C05dd64FBF9eBA4d8af98) {
    +++ description: None
      values.owner:
-        "0xB0BBff6311B7F245761A7846d3Ce7B1b100C1836"
+        "0xeeF6520437A6545b4F325F6675C4CD49812d457b"
    }
```

```diff
+   Status: CREATED
    contract  (0xeeF6520437A6545b4F325F6675C4CD49812d457b)
    +++ description: None
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21428964 (main branch discovery), not current.

```diff
    contract USD0++ Vault Polynomial (0xDf9Fa2b420689384E8DD55a706262DC0ED37020F) {
    +++ description: None
      unverified:
-        true
      values.bridgeType:
+        "0x9faa379a8f7762447354a00c30bda6b12f39577783c03b588d3fd75b4e2a5876"
      values.nominee:
+        "0x0000000000000000000000000000000000000000"
      values.owner:
+        "0x9f76043B23125024Ce5f0Fb4AE707482107dd2a8"
      sourceHashes:
+        ["0xc3321c0d760c3f5fe8845b9fdd3fb32455ca5317920d929526142e921ddc68d9"]
    }
```

Generated with discovered.json: 0x9cdfbc24d1629059d43619ffceb966fdb28a3f57

# Diff at Wed, 18 Dec 2024 10:57:41 GMT:

- chain: ethereum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@a44ef6747febdd9930ef05420e60556c20899f13 block: 21394305
- current block number: 21428964

## Description

Owner pointers of socketadmin.eth changed to a new (socket-funded) EOA.

## Watched changes

```diff
    contract WBTC Vault Reya (0x2344621d5aA6e784e8C6f4c54b0B29Dd9c3Ad4B6) {
    +++ description: None
      values.owner:
-        "0x5fD7D0d6b91CC4787Bcb86ca47e0Bd4ea0346d34"
+        "0xB0BBff6311B7F245761A7846d3Ce7B1b100C1836"
    }
```

```diff
    contract WETH Vault Reya (0x64dF894688c5052BeAdC35371cF69151Ebc5D658) {
    +++ description: None
      values.owner:
-        "0x5fD7D0d6b91CC4787Bcb86ca47e0Bd4ea0346d34"
+        "0xB0BBff6311B7F245761A7846d3Ce7B1b100C1836"
    }
```

```diff
    contract Socket (0x943AC2775928318653e91d350574436A1b9b16f9) {
    +++ description: None
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.138:
+        "0x75695e8A56405dC60a0aFf07d1AF01A0baCA7188"
    }
```

```diff
    contract USDe Vault Reya (0xaA2f2B6cD33Eaabb795c6DB60AAec599C8450F35) {
    +++ description: None
      values.owner:
-        "0x5fD7D0d6b91CC4787Bcb86ca47e0Bd4ea0346d34"
+        "0xB0BBff6311B7F245761A7846d3Ce7B1b100C1836"
    }
```

```diff
    contract USDC Vault Reya (0xdFf78A949E47c1e90f3Dd6dd7Fe2Fa72B42a75f7) {
    +++ description: None
      values.owner:
-        "0x5fD7D0d6b91CC4787Bcb86ca47e0Bd4ea0346d34"
+        "0xB0BBff6311B7F245761A7846d3Ce7B1b100C1836"
    }
```

Generated with discovered.json: 0x14dd41929a299910e18622e57318631aefcd6b63

# Diff at Fri, 13 Dec 2024 14:51:52 GMT:

- chain: ethereum
- author: vincfurc (<10850139+vincfurc@users.noreply.github.com>)
- comparing to: main@057a0310a9622d3c37d8b5e224c59b5dbd3a0507 block: 21388211
- current block number: 21394305

## Description

New socket, unverified.

## Watched changes

```diff
    contract Socket (0x943AC2775928318653e91d350574436A1b9b16f9) {
    +++ description: None
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.137:
+        "0x15f70f64438603e5872A4E81c7a8B5edB5D70d93"
    }
```

Generated with discovered.json: 0x78fb2ab272ee12498d40aeb036dff44dff969d4b

# Diff at Thu, 12 Dec 2024 18:27:06 GMT:

- chain: ethereum
- author: vincfurc (<10850139+vincfurc@users.noreply.github.com>)
- comparing to: main@fa5a98638066331a8ea6329a256a3462e7da2b3a block: 21358014
- current block number: 21388211

## Description

New plugs (SolvBTC, SolvBTC.BNN).

## Watched changes

```diff
    contract Socket (0x943AC2775928318653e91d350574436A1b9b16f9) {
    +++ description: None
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.136:
+        "0xA2bE759B86CeA53372C3e9a882047cdC3884D568"
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.135:
+        "0x94104d7801f30d2f9069118C65Fe63A3A11515B1"
    }
```

Generated with discovered.json: 0xf3fa224072fe364832c2eb794cce180e0b0147d8

# Diff at Sun, 08 Dec 2024 13:17:33 GMT:

- chain: ethereum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@59fd7a30471906b5a479f280731621e94e22f17c block: 21122046
- current block number: 21358014

## Description

New plugs, crawl result and tokens added.

## Watched changes

```diff
    contract USDT Vault Kinto (0x1D18263107a138C7fb0De65b4a78d193ff9664c1) {
    +++ description: None
      values.owner:
-        "0x660ad4B5A74130a4796B4d54BC6750Ae93C86e6c"
+        "0xf152Abda9E4ce8b134eF22Dc3C6aCe19C4895D82"
    }
```

```diff
    contract cbBTC Vault Kinto (0x8F5247072e9580624Be243D4EC8cD3F3ABfF86B9) {
    +++ description: None
      values.owner:
-        "0x660ad4B5A74130a4796B4d54BC6750Ae93C86e6c"
+        "0xf152Abda9E4ce8b134eF22Dc3C6aCe19C4895D82"
    }
```

```diff
    contract Socket (0x943AC2775928318653e91d350574436A1b9b16f9) {
    +++ description: None
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.134:
+        "0x12a4CC40a8F89E40F8C849c2F89741D5C9590a14"
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.133:
+        "0x1734067c2CDcFb81ef9672F80DA2D7bfC2CFAE73"
    }
```

```diff
    contract LINK Vault Kinto (0xA6Ae29Ce5c38DFE0Dd95B716748ac747f31E4013) {
    +++ description: None
      values.owner:
-        "0x660ad4B5A74130a4796B4d54BC6750Ae93C86e6c"
+        "0xf152Abda9E4ce8b134eF22Dc3C6aCe19C4895D82"
    }
```

```diff
    contract SPX Vault Kinto (0xd1228C6CB94a670F30D5ACb1340a9d96aC30e6A8) {
    +++ description: None
      values.owner:
-        "0x660ad4B5A74130a4796B4d54BC6750Ae93C86e6c"
+        "0xf152Abda9E4ce8b134eF22Dc3C6aCe19C4895D82"
    }
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21122046 (main branch discovery), not current.

```diff
    contract eBTC Vault Derive (0x25d35C8796c9dcD3857abE90D802FC17b1FB55A5) {
    +++ description: None
      name:
-        "eBTC Vault Lyra"
+        "eBTC Vault Derive"
    }
```

```diff
    contract USDe Vault Derive (0x26Cf1Dc84694E04277F2Fe4C13E43597c6010C2A) {
    +++ description: None
      name:
-        "USDe Vault Lyra"
+        "USDe Vault Derive"
    }
```

```diff
    contract rsETH Vault Derive (0x35d4D9bc79B0a543934b1769304B90d752691caD) {
    +++ description: None
      name:
-        "rsETH Vault Lyra"
+        "rsETH Vault Derive"
    }
```

```diff
    contract WBTC Vault Derive (0x3Eec7c855aF33280F1eD38b93059F5aa5862E3ab) {
    +++ description: None
      name:
-        "WBTC Vault Lyra"
+        "WBTC Vault Derive"
    }
```

```diff
    contract rswETH Vault Derive (0x4BB4C3CDc7562f08e9910A0C7D8bB7e108861eB4) {
    +++ description: None
      name:
-        "rswETH Vault Lyra"
+        "rswETH Vault Derive"
    }
```

```diff
    contract USDT Vault Derive (0x5e98A25d8d6FF69A8992d6Aa57948dFB77D4ECBa) {
    +++ description: None
      name:
-        "USDT Vault Lyra"
+        "USDT Vault Derive"
    }
```

```diff
    contract cbBTC Vault Derive (0x5F18C54e4E10287414A47925a24Ea3A8Cf4A9F50) {
    +++ description: None
      name:
-        "cbBTC Vault Lyra"
+        "cbBTC Vault Derive"
    }
```

```diff
    contract sDAI Vault Derive (0x613e87BE1cd75dEBC5e6e56a2AF2fED84162C142) {
    +++ description: None
      name:
-        "sDAI Vault Lyra"
+        "sDAI Vault Derive"
    }
```

```diff
    contract USDC Vault Derive (0x6D303CEE7959f814042D31E0624fB88Ec6fbcC1d) {
    +++ description: None
      name:
-        "USDC Vault Lyra"
+        "USDC Vault Derive"
    }
```

```diff
    contract LBTC Vault Derive (0x76624ff43D610F64177Bb9c194A2503642e9B803) {
    +++ description: None
      name:
-        "LBTC Vault Lyra"
+        "LBTC Vault Derive"
    }
```

```diff
    contract SNX Vault Derive (0x7D7aC8d55A9bD4152b703011f3E61AB3bB0A5592) {
    +++ description: None
      name:
-        "SNX Vault Lyra"
+        "SNX Vault Derive"
    }
```

```diff
    contract DAI Vault Derive (0x7E1d17b580dD4F89037DB331430eAEe8B8e50c91) {
    +++ description: None
      name:
-        "DAI Vault Lyra"
+        "DAI Vault Derive"
    }
```

```diff
    contract weETH Vault Derive (0x8180EcCC825b692ef65FF099a0A387743788bf78) {
    +++ description: None
      name:
-        "weETH Vault Lyra"
+        "weETH Vault Derive"
    }
```

```diff
    contract WETH Vault Derive (0xD4efe33C66B8CdE33B8896a2126E41e5dB571b7e) {
    +++ description: None
      name:
-        "WETH Vault Lyra"
+        "WETH Vault Derive"
    }
```

```diff
    contract sUSDe Vault Derive (0xE3E96892D30E0ee1a8131BAf87c891201F7137bf) {
    +++ description: None
      name:
-        "sUSDe Vault Lyra"
+        "sUSDe Vault Derive"
    }
```

```diff
    contract wstETH Vault Derive (0xeBB5D642aA8ccDeE98373D6aC3ee0602b63824b3) {
    +++ description: None
      name:
-        "wstETH Vault Lyra"
+        "wstETH Vault Derive"
    }
```

```diff
+   Status: CREATED
    contract sdeUSD Vault Reya (0x0A5A19376064fED2A0A9f3120B2426c957BC289D)
    +++ description: None
```

```diff
+   Status: CREATED
    contract deUSD Vault Reya (0x0b4447344fAAA340bcD2B0FdBD8f0CEcd161bC9E)
    +++ description: None
```

```diff
+   Status: CREATED
    contract USDT Vault Zora (0x1417f50f864ba75D5c6cb4CD14479c48Ce5166fB)
    +++ description: None
```

```diff
+   Status: CREATED
    contract USDT Vault Kinto (0x1D18263107a138C7fb0De65b4a78d193ff9664c1)
    +++ description: None
```

```diff
+   Status: CREATED
    contract KLAUS Vault Zora (0x528DBFcf6e2cbC62B05d7a74711AA7C44FF43cA2)
    +++ description: None
```

```diff
+   Status: CREATED
    contract USDC Vault Zora (0x58CDCf55f2c8660674F17561334F6370cbaDeEF8)
    +++ description: None
```

```diff
+   Status: CREATED
    contract cbBTC Vault Kinto (0x8F5247072e9580624Be243D4EC8cD3F3ABfF86B9)
    +++ description: None
```

```diff
+   Status: CREATED
    contract LINK Vault Kinto (0xA6Ae29Ce5c38DFE0Dd95B716748ac747f31E4013)
    +++ description: None
```

```diff
+   Status: CREATED
    contract SPX Vault Kinto (0xd1228C6CB94a670F30D5ACb1340a9d96aC30e6A8)
    +++ description: None
```

Generated with discovered.json: 0x6f738121fd1b6546caabeef37c420d34b7d8e266

# Diff at Tue, 05 Nov 2024 14:29:39 GMT:

- chain: ethereum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@5e6ce51851b57187ccdd52c4944a82e2a8ab1e88 block: 21093405
- current block number: 21122046

## Description

New plugs, will add Kinto tokens separately.

## Watched changes

```diff
    contract Socket (0x943AC2775928318653e91d350574436A1b9b16f9) {
    +++ description: None
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.132:
+        "0xb5d5E523905bB397bCAfB36B252535a255d3E23C"
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.131:
+        "0x5D5a2999E91A336CA99da0cB636898ccB521f40a"
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.130:
+        "0xab722902681A260762084A78A2d8f19CfA6A46Ef"
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.129:
+        "0x9d13F2b3B694DE6a1cF58edb5044454CAE3B84E4"
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.128:
+        "0x10ed00FDb26Ec6BE0183e6f14D8275d5898B0721"
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.127:
+        "0x76C9129b44c637500c88760ADd2EbEF07472b549"
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.126:
+        "0x0c39a1b042AbfC68d10B78081AFE3F58a6523A35"
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.125:
+        "0xB1b7BC699cAEcB941e7377065c7CE82039889603"
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.124:
+        "0x008244E37A90E090dc4abD70F37195075cbE8453"
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.123:
+        "0xFb0c284CD9929eB5139eB027aD7497097Ba25C87"
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.122:
+        "0x5366D4acCC96Ed297e30B8702FBC9b85daA3a459"
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.121:
+        "0x29ACa1443F28DceDEBf99173b37b5C1e814cA548"
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.120:
+        "0xf7a4a34d64E8fE4FCCffE2f3C985D43409Aa8c9a"
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.119:
+        "0xb9703b625c3B846B58DFdaDBceF77e34a1C59965"
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.118:
+        "0xBbA3095f6ACA17ff23Df466833D621cc91Db7675"
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.117:
+        "0xC3875afddEde146DCfED7e72b2Ad12B853CA1241"
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.116:
+        "0x65A9b862671de5Df85EcE387220C6b10a17230f7"
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.115:
+        "0x5deeAb623C6091A0A59E6d041dAAE9bDeFBfC203"
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.114:
+        "0x7E34B138e507570bDCC9b99230cFaA2745F0222C"
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.113:
+        "0x3390ca7A0D7C80871B05C3FeBbeEee91307a35ba"
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.112:
+        "0xCE0AB493716d96C0979E0B708BeF1915F3B07e01"
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.111:
+        "0x6dED17643D7acFc0bE0e79ff6C4762F12AA5516E"
    }
```

Generated with discovered.json: 0xe6595a97e5c30fb6c4e3d7cab86f6bc1ec21f6b1

# Diff at Fri, 01 Nov 2024 14:31:43 GMT:

- chain: ethereum
- author: vincfurc (<10850139+vincfurc@users.noreply.github.com>)
- comparing to: main@cd1f0e71bb08ce16b2084a11b768538e8aa6ba8c block: 21064404
- current block number: 21093405

## Description

New plug, token already in a vault.

## Watched changes

```diff
    contract Socket (0x943AC2775928318653e91d350574436A1b9b16f9) {
    +++ description: None
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.110:
+        "0x92469EEf05a071B0e56275b23597b1b701C15a71"
    }
```

Generated with discovered.json: 0x32132ccd3c6ecd135d75d553836a305b2f4685ae

# Diff at Mon, 28 Oct 2024 13:24:35 GMT:

- chain: ethereum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@00bd1d18460d612b1f06ce2339854c105cd41bd5 block: 21027491
- current block number: 21064404

## Description

New plugs, data updated, no significant new token escrows.

## Watched changes

```diff
    contract Socket (0x943AC2775928318653e91d350574436A1b9b16f9) {
    +++ description: None
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.109:
+        "0xf1807B621efC3B072d1203dD28C880BBEDc56161"
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.108:
+        "0xE3255bb716d8BA81aA97Ff20c75b404D9844CBE1"
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.107:
+        "0x7FBCd72B6368f1771C9F6Ee16502C19b0AADBa1D"
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.106:
+        "0xCF83efEe74f61771AF78b05DeA847773D3952C33"
    }
```

Generated with discovered.json: 0x314d6b031cf39abbec7f48054832ebf8b2e71de2

# Diff at Wed, 23 Oct 2024 09:48:53 GMT:

- chain: ethereum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@2734bfe28641dfdb3277a5800faf0a057c08a58f block: 20977251
- current block number: 21027491

## Description

New plugs, added cbBTC to Lyra.

## Watched changes

```diff
    contract Socket (0x943AC2775928318653e91d350574436A1b9b16f9) {
    +++ description: None
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.105:
+        "0xE88F6b194BD3b43013710A785DDFF41454A19537"
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.104:
+        "0xFAB1efe6cA9435faEf9e29f40E575e27A74373A9"
    }
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20977251 (main branch discovery), not current.

```diff
+   Status: CREATED
    contract cbBTC Vault Lyra (0x5F18C54e4E10287414A47925a24Ea3A8Cf4A9F50)
    +++ description: None
```

```diff
+   Status: CREATED
    contract USD0++ Vault Polynomial (0xDf9Fa2b420689384E8DD55a706262DC0ED37020F)
    +++ description: None
```

Generated with discovered.json: 0x5c01b9d549184d634e7d32f167de18259c782792

# Diff at Wed, 16 Oct 2024 09:34:29 GMT:

- chain: ethereum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@b6ff61526cf3d704839d0155008ae72cc9070de8 block: 20912886
- current block number: 20977251

## Description

New plug for USD0++ (not added). Refreshed crawl data.

## Watched changes

```diff
    contract Socket (0x943AC2775928318653e91d350574436A1b9b16f9) {
    +++ description: None
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.103:
+        "0x80f5143AF6BF51B38C038BaFF71465Be9b48cAEe"
    }
```

Generated with discovered.json: 0xdd8088e5cdc88df48d54b85c0508d693ad7455a0

# Diff at Mon, 14 Oct 2024 10:56:03 GMT:

- chain: ethereum
- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@1afc77ff111ceb0970e7d09efcc7b2f376b0c281 block: 20912886
- current block number: 20912886

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20912886 (main branch discovery), not current.

```diff
    contract WETH Vault Kinto (0x00A0c9d82B95a17Cdf2D46703F2DcA13EB0E8A94) {
    +++ description: None
      sourceHashes:
+        ["0x5a961d4cd1fe9b96535b53aaf638b45677b06e22d26037a62ccf6adc9c29f79d"]
    }
```

```diff
    contract PolygonL1Switchboard (0x053407DFA30267f6332f3c94a9e9F704A55e62CD) {
    +++ description: None
      sourceHashes:
+        ["0x1173a4411a4a452037ed000a299c3136ab3d547cca61ee51628aa7c54ff20651"]
    }
```

```diff
    contract OptimismSwitchboard2 (0x0E674e057EC0FF97eeA57B6A350DBAAD22FE41BA) {
    +++ description: None
      sourceHashes:
+        ["0x5ce8017c8b58163d4cf21dc4e0dec9218e5b4e093c40fb19d970e8c807fbf4d4"]
    }
```

```diff
    contract MKR Vault Kinto (0x0fC783f611A888A2cAbC3dA482Add3215334dCc2) {
    +++ description: None
      sourceHashes:
+        ["0x5a961d4cd1fe9b96535b53aaf638b45677b06e22d26037a62ccf6adc9c29f79d"]
    }
```

```diff
    contract CapacitorFactory (0x11Fbb9116801DB54bB51fF4dF423e34E8b45fc9a) {
    +++ description: None
      sourceHashes:
+        ["0x6464768c2bcc3c1a2d6c108a2366460fe668d285547a02040bdac245de51ca89"]
    }
```

```diff
    contract DAI Vault Kinto (0x12Cf431BdF7F143338cC09A0629EDcCEDCBCEcB5) {
    +++ description: None
      sourceHashes:
+        ["0x5a961d4cd1fe9b96535b53aaf638b45677b06e22d26037a62ccf6adc9c29f79d"]
    }
```

```diff
    contract OptimismSwitchboard (0x139f39DC7dC05F7aC2DB3DB6af4f2e1a9De7c287) {
    +++ description: None
      sourceHashes:
+        ["0x5ce8017c8b58163d4cf21dc4e0dec9218e5b4e093c40fb19d970e8c807fbf4d4"]
    }
```

```diff
    contract WBTC Vault Reya (0x2344621d5aA6e784e8C6f4c54b0B29Dd9c3Ad4B6) {
    +++ description: None
      sourceHashes:
+        ["0x5a961d4cd1fe9b96535b53aaf638b45677b06e22d26037a62ccf6adc9c29f79d"]
    }
```

```diff
    contract LyraMultisig (0x246d38588b16Dd877c558b245e6D5a711C649fCF) {
    +++ description: None
      sourceHashes:
+        ["0xd5a33441170541b7df25812e0e3dff6562b2f09ab835a6b431cb9e7198a47605","0xd42bbf9f7dcd3720a7fc6bdc6edfdfae8800a37d6dd4decfa0ef6ca4a2e88940"]
    }
```

```diff
    contract eBTC Vault Lyra (0x25d35C8796c9dcD3857abE90D802FC17b1FB55A5) {
    +++ description: None
      sourceHashes:
+        ["0x31b99c44ab28174db25b94c3cca9ad4f335866894a5437384040c7bd682fca11"]
    }
```

```diff
    contract PAXG Vault Kinto (0x25f0D71Da51A77Ca231484eBbAD1f588A0230ef2) {
    +++ description: None
      sourceHashes:
+        ["0x5a961d4cd1fe9b96535b53aaf638b45677b06e22d26037a62ccf6adc9c29f79d"]
    }
```

```diff
    contract USDe Vault Lyra (0x26Cf1Dc84694E04277F2Fe4C13E43597c6010C2A) {
    +++ description: None
      sourceHashes:
+        ["0x31b99c44ab28174db25b94c3cca9ad4f335866894a5437384040c7bd682fca11"]
    }
```

```diff
    contract KINTO Vault Kinto (0x2f87464d5F5356dB350dcb302FE28040986783a7) {
    +++ description: None
      sourceHashes:
+        ["0x5a961d4cd1fe9b96535b53aaf638b45677b06e22d26037a62ccf6adc9c29f79d"]
    }
```

```diff
    contract ENA Vault Kinto (0x351d8894fB8bfa1b0eFF77bFD9Aab18eA2da8fDd) {
    +++ description: None
      sourceHashes:
+        ["0x5a961d4cd1fe9b96535b53aaf638b45677b06e22d26037a62ccf6adc9c29f79d"]
    }
```

```diff
    contract rsETH Vault Lyra (0x35d4D9bc79B0a543934b1769304B90d752691caD) {
    +++ description: None
      sourceHashes:
+        ["0x5a961d4cd1fe9b96535b53aaf638b45677b06e22d26037a62ccf6adc9c29f79d"]
    }
```

```diff
    contract WBTC Vault Lyra (0x3Eec7c855aF33280F1eD38b93059F5aa5862E3ab) {
    +++ description: None
      sourceHashes:
+        ["0xfd7de25c0b5615fb9cdd221236caa984819b6dd0511764ecfc6d0c724721741c"]
    }
```

```diff
    contract sUSDe Vault Kinto (0x43b718Aa5e678b08615CA984cbe25f690B085b32) {
    +++ description: None
      sourceHashes:
+        ["0x5a961d4cd1fe9b96535b53aaf638b45677b06e22d26037a62ccf6adc9c29f79d"]
    }
```

```diff
    contract rswETH Vault Lyra (0x4BB4C3CDc7562f08e9910A0C7D8bB7e108861eB4) {
    +++ description: None
      sourceHashes:
+        ["0x5a961d4cd1fe9b96535b53aaf638b45677b06e22d26037a62ccf6adc9c29f79d"]
    }
```

```diff
    contract sDAI Vault Kinto (0x5B8Ae1C9c5970e2637Cf3Af431acAAebEf7aFb85) {
    +++ description: None
      sourceHashes:
+        ["0x5a961d4cd1fe9b96535b53aaf638b45677b06e22d26037a62ccf6adc9c29f79d"]
    }
```

```diff
    contract Hasher (0x5C71beE4a6b0D617D8c3d107D331292741789E27) {
    +++ description: None
      sourceHashes:
+        ["0x621783ceb3c37cf9cd41112e917d760d40dbfa18e43c59f5c925fe9f7037f9be"]
    }
```

```diff
    contract USDT Vault Lyra (0x5e98A25d8d6FF69A8992d6Aa57948dFB77D4ECBa) {
    +++ description: None
      sourceHashes:
+        ["0xfd7de25c0b5615fb9cdd221236caa984819b6dd0511764ecfc6d0c724721741c"]
    }
```

```diff
    contract sDAI Vault Lyra (0x613e87BE1cd75dEBC5e6e56a2AF2fED84162C142) {
    +++ description: None
      sourceHashes:
+        ["0x31b99c44ab28174db25b94c3cca9ad4f335866894a5437384040c7bd682fca11"]
    }
```

```diff
    contract sDAI Vault Polynomial (0x615172e47c0C5A6dA8ea959632Ac0166f7a59eDc) {
    +++ description: None
      sourceHashes:
+        ["0x6a891f3b93e83143ab3b768e2a7a5e2fee324b1f98745e241faaf97608eaa3ae"]
    }
```

```diff
    contract WETH Vault Reya (0x64dF894688c5052BeAdC35371cF69151Ebc5D658) {
    +++ description: None
      sourceHashes:
+        ["0x5a961d4cd1fe9b96535b53aaf638b45677b06e22d26037a62ccf6adc9c29f79d"]
    }
```

```diff
    contract USDC Vault Lyra (0x6D303CEE7959f814042D31E0624fB88Ec6fbcC1d) {
    +++ description: None
      sourceHashes:
+        ["0x7388ebff48e70528bc58f3586fb97581b1a933f704450fa7ed625674671cfef2"]
    }
```

```diff
    contract USDC Vault Kinto (0x755cD5d147036E11c76F1EeffDd94794fC265f0d) {
    +++ description: None
      sourceHashes:
+        ["0x5a961d4cd1fe9b96535b53aaf638b45677b06e22d26037a62ccf6adc9c29f79d"]
    }
```

```diff
    contract LBTC Vault Lyra (0x76624ff43D610F64177Bb9c194A2503642e9B803) {
    +++ description: None
      sourceHashes:
+        ["0x31b99c44ab28174db25b94c3cca9ad4f335866894a5437384040c7bd682fca11"]
    }
```

```diff
    contract SNX Vault Lyra (0x7D7aC8d55A9bD4152b703011f3E61AB3bB0A5592) {
    +++ description: None
      sourceHashes:
+        ["0xfd7de25c0b5615fb9cdd221236caa984819b6dd0511764ecfc6d0c724721741c"]
    }
```

```diff
    contract DAI Vault Lyra (0x7E1d17b580dD4F89037DB331430eAEe8B8e50c91) {
    +++ description: None
      sourceHashes:
+        ["0x31b99c44ab28174db25b94c3cca9ad4f335866894a5437384040c7bd682fca11"]
    }
```

```diff
    contract weETH Vault Lyra (0x8180EcCC825b692ef65FF099a0A387743788bf78) {
    +++ description: None
      sourceHashes:
+        ["0x5a961d4cd1fe9b96535b53aaf638b45677b06e22d26037a62ccf6adc9c29f79d"]
    }
```

```diff
    contract Socket (0x943AC2775928318653e91d350574436A1b9b16f9) {
    +++ description: None
      sourceHashes:
+        ["0x0a472e41e2b0da865c051222fc77f1a0e9a6f6462383cbf9a6e4da8b9b332167"]
    }
```

```diff
    contract ETHFI Vault Kinto (0x95d60E34aB2E626407d98dF8C240e6174e5D37E5) {
    +++ description: None
      sourceHashes:
+        ["0x5a961d4cd1fe9b96535b53aaf638b45677b06e22d26037a62ccf6adc9c29f79d"]
    }
```

```diff
    contract ExecutionManager (0x98CAd9A205f1F7A7150241Ef2d565d1702BCe57C) {
    +++ description: None
      sourceHashes:
+        ["0x4090ed28f96c48d603c9a606a131adf14f1ac4c81c478cde49b5b62ea4310ac3"]
    }
```

```diff
    contract SOL Vault Kinto (0xA2bc0DaA9BF98820632bCa0663a9616f6bC180f8) {
    +++ description: None
      sourceHashes:
+        ["0x5a961d4cd1fe9b96535b53aaf638b45677b06e22d26037a62ccf6adc9c29f79d"]
    }
```

```diff
    contract LOOKS Vault Blast (0xa83B4006c16DAeAb2718294696c0122519195137) {
    +++ description: None
      sourceHashes:
+        ["0x5a961d4cd1fe9b96535b53aaf638b45677b06e22d26037a62ccf6adc9c29f79d"]
    }
```

```diff
    contract USDe Vault Reya (0xaA2f2B6cD33Eaabb795c6DB60AAec599C8450F35) {
    +++ description: None
      sourceHashes:
+        ["0x1ca1782228ebefdeb92c0a3be06dac3dca400826838bb68b5500e8b8f3fac727"]
    }
```

```diff
    contract wstETH Vault Kinto (0xc5d01939Af7Ce9Ffc505F0bb36eFeDde7920f2dc) {
    +++ description: None
      sourceHashes:
+        ["0x5a961d4cd1fe9b96535b53aaf638b45677b06e22d26037a62ccf6adc9c29f79d"]
    }
```

```diff
    contract sUSDe Vault Polynomial (0xC6cfb996A7CFEB89813A68CD13942CD75553032b) {
    +++ description: None
      sourceHashes:
+        ["0x6a891f3b93e83143ab3b768e2a7a5e2fee324b1f98745e241faaf97608eaa3ae"]
    }
```

```diff
    contract LooksRareMultisig (0xC8C57e4C73c71f72cA0a7e043E5D2D144F98ef13) {
    +++ description: None
      sourceHashes:
+        ["0x81a7349eebb98ac33b0bc6842e3cb258034a8f2a4ba004570bb8e2e25947f9ff","0xd42bbf9f7dcd3720a7fc6bdc6edfdfae8800a37d6dd4decfa0ef6ca4a2e88940"]
    }
```

```diff
    contract XAUt Vault Kinto (0xd04Bc056BE36a6127267E4F71d3b43D1BEEfE8bF) {
    +++ description: None
      sourceHashes:
+        ["0x5a961d4cd1fe9b96535b53aaf638b45677b06e22d26037a62ccf6adc9c29f79d"]
    }
```

```diff
    contract WETH Vault Lyra (0xD4efe33C66B8CdE33B8896a2126E41e5dB571b7e) {
    +++ description: None
      sourceHashes:
+        ["0xfd7de25c0b5615fb9cdd221236caa984819b6dd0511764ecfc6d0c724721741c"]
    }
```

```diff
    contract FastSwitchboard (0xD5a83a40F262E2247e6566171f9ADc76b745F5cD) {
    +++ description: None
      sourceHashes:
+        ["0x4c26d29d2554c606bb1c2391ea7b837be27ba2f6cc80d7a022bbd672f534fba4"]
    }
```

```diff
    contract eUSD Vault Kinto (0xDB0e855F55ff35dA8754e5297925bd6c4Cb1Fa48) {
    +++ description: None
      sourceHashes:
+        ["0x5a961d4cd1fe9b96535b53aaf638b45677b06e22d26037a62ccf6adc9c29f79d"]
    }
```

```diff
    contract EIGEN Vault Kinto (0xdb161cdc9c11892922F7121a409b196f3b00e640) {
    +++ description: None
      sourceHashes:
+        ["0x5a961d4cd1fe9b96535b53aaf638b45677b06e22d26037a62ccf6adc9c29f79d"]
    }
```

```diff
    contract USDC Vault Polynomial (0xDE1617Ddb7C8A250A409D986930001985cfad76F) {
    +++ description: None
      sourceHashes:
+        ["0x6a891f3b93e83143ab3b768e2a7a5e2fee324b1f98745e241faaf97608eaa3ae"]
    }
```

```diff
    contract USDe Vault Kinto (0xdf34E61B6e7B9e348713d528fEB019d504d38c1e) {
    +++ description: None
      sourceHashes:
+        ["0x5a961d4cd1fe9b96535b53aaf638b45677b06e22d26037a62ccf6adc9c29f79d"]
    }
```

```diff
    contract ArbitrumL1Switchboard (0xdf5f7dfDFc26ee5F629949e330bEf56906319CAe) {
    +++ description: None
      sourceHashes:
+        ["0xdacec605e22dae6e18ca1d184d8aec5d3307537166fbd48449491dc2227c6497"]
    }
```

```diff
    contract USDC Vault Reya (0xdFf78A949E47c1e90f3Dd6dd7Fe2Fa72B42a75f7) {
    +++ description: None
      sourceHashes:
+        ["0x5a961d4cd1fe9b96535b53aaf638b45677b06e22d26037a62ccf6adc9c29f79d"]
    }
```

```diff
    contract sUSDe Vault Lyra (0xE3E96892D30E0ee1a8131BAf87c891201F7137bf) {
    +++ description: None
      sourceHashes:
+        ["0x5a961d4cd1fe9b96535b53aaf638b45677b06e22d26037a62ccf6adc9c29f79d"]
    }
```

```diff
    contract weETH Vault Kinto (0xeB66259d2eBC3ed1d3a98148f6298927d8A36397) {
    +++ description: None
      sourceHashes:
+        ["0x5a961d4cd1fe9b96535b53aaf638b45677b06e22d26037a62ccf6adc9c29f79d"]
    }
```

```diff
    contract wstETH Vault Lyra (0xeBB5D642aA8ccDeE98373D6aC3ee0602b63824b3) {
    +++ description: None
      sourceHashes:
+        ["0xfd7de25c0b5615fb9cdd221236caa984819b6dd0511764ecfc6d0c724721741c"]
    }
```

```diff
    contract TransmitManager (0xeD037aFBffC65a94E9CC592947E851FB2f730341) {
    +++ description: None
      sourceHashes:
+        ["0x20fd759cdae5666df50f4b5723ba03796b69ef7b2b3ec33712cb158d77b97133"]
    }
```

```diff
    contract KintoMultisig (0xf152Abda9E4ce8b134eF22Dc3C6aCe19C4895D82) {
    +++ description: None
      sourceHashes:
+        ["0x81a7349eebb98ac33b0bc6842e3cb258034a8f2a4ba004570bb8e2e25947f9ff","0xd42bbf9f7dcd3720a7fc6bdc6edfdfae8800a37d6dd4decfa0ef6ca4a2e88940"]
    }
```

```diff
    contract SignatureVerifier (0xf1ABF110d1B6ff0E2e8C05dd64FBF9eBA4d8af98) {
    +++ description: None
      sourceHashes:
+        ["0x92dc8defa29353a843ae6cb6d7508811be7c65f617fe92ef87739ccdbc3fa95b"]
    }
```

Generated with discovered.json: 0x7e793b8eb1972aef96146082a4be74d43b7eb250

# Diff at Mon, 07 Oct 2024 09:49:08 GMT:

- chain: ethereum
- author: sekuba (<sekuba@users.noreply.github.com>)
- comparing to: main@ec3878239ad71f9055b207bdcd338b2f207af050 block: 20842973
- current block number: 20912886

## Description

New plugs and vaults.

## Watched changes

```diff
    contract Socket (0x943AC2775928318653e91d350574436A1b9b16f9) {
    +++ description: None
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.102:
+        "0x76ddfc271089e58Af68D8597D41aEF52Fb53EC3D"
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.101:
+        "0x88A05556Af1a8a5BB5964c46Be9D56C379a5E155"
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.100:
+        "0x895b6c1413243562128a9281a7f8891640Ca073f"
    }
```

```diff
+   Status: CREATED
    contract eUSD Vault Kinto (0xDB0e855F55ff35dA8754e5297925bd6c4Cb1Fa48)
    +++ description: None
```

## Source code changes

```diff
.../socket/ethereum/.flat/eUSD Vault Kinto.sol     | 887 +++++++++++++++++++++
 1 file changed, 887 insertions(+)
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20842973 (main branch discovery), not current.

```diff
-   Status: DELETED
    contract USDC Vault Hook (0x855Aaf2f690Ef6e5EF451D7AE73EC3fa61c50981)
    +++ description: None
```

```diff
-   Status: DELETED
    contract WETH Vault Hook (0xB39DF6BBB1Cf2B609DeE43F109caFEFF1A7CCBEa)
    +++ description: None
```

```diff
+   Status: CREATED
    contract MKR Vault Kinto (0x0fC783f611A888A2cAbC3dA482Add3215334dCc2)
    +++ description: None
```

```diff
+   Status: CREATED
    contract eBTC Vault Lyra (0x25d35C8796c9dcD3857abE90D802FC17b1FB55A5)
    +++ description: None
```

```diff
+   Status: CREATED
    contract EIGEN Vault Kinto (0xdb161cdc9c11892922F7121a409b196f3b00e640)
    +++ description: None
```

Generated with discovered.json: 0x9b4f75a1a9988e34fa54d9b52bd97b60b289328c

# Diff at Fri, 27 Sep 2024 15:52:26 GMT:

- chain: ethereum
- author: sekuba (<sekuba@users.noreply.github.com>)
- comparing to: main@4cb14cc1bdc343d171a7988f9f91f11edbf568a8 block: 20756881
- current block number: 20842973

## Description

Add new plugs / vaults.

## Watched changes

```diff
    contract Socket (0x943AC2775928318653e91d350574436A1b9b16f9) {
    +++ description: None
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.99:
+        "0x094570E556C8E58119E21f47759F02F50Ae3bB49"
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.98:
+        "0xBc978f47AD1122bdFE85855fcc40b3afdF4b5df3"
    }
```

Generated with discovered.json: 0x4c060329e6eb5170679402c0a4d7d995c0a7fed8

# Diff at Sun, 15 Sep 2024 15:22:34 GMT:

- chain: ethereum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@ca08843b12ed576cbcc139ad58ca045f72d96ab5 block: 20726203
- current block number: 20756881

## Description

Socket adds plugs and vaults.

Kinto moves three vaults from EOA to the BridgerOwnerMS. One signer is removed from the KintoMultisig.

## Watched changes

```diff
    contract PAXG Vault Kinto (0x25f0D71Da51A77Ca231484eBbAD1f588A0230ef2) {
    +++ description: None
      values.owner:
-        "0x660ad4B5A74130a4796B4d54BC6750Ae93C86e6c"
+        "0xf152Abda9E4ce8b134eF22Dc3C6aCe19C4895D82"
    }
```

```diff
    contract KINTO Vault Kinto (0x2f87464d5F5356dB350dcb302FE28040986783a7) {
    +++ description: None
      values.owner:
-        "0x660ad4B5A74130a4796B4d54BC6750Ae93C86e6c"
+        "0xf152Abda9E4ce8b134eF22Dc3C6aCe19C4895D82"
    }
```

```diff
    contract Socket (0x943AC2775928318653e91d350574436A1b9b16f9) {
    +++ description: None
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.97:
+        "0x17a8Be056ca13B072AB908126D4BC38e09c7cc39"
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.96:
+        "0xc706c946623C70B294b91Bd4961E91FaF7A74317"
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.95:
+        "0x55033cb4583f5526704Ee4C197e99504E504712c"
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.94:
+        "0xF391E487FE3958F0728436Af84455Fd4eBC9c7c9"
    }
```

```diff
    contract SOL Vault Kinto (0xA2bc0DaA9BF98820632bCa0663a9616f6bC180f8) {
    +++ description: None
      values.owner:
-        "0x660ad4B5A74130a4796B4d54BC6750Ae93C86e6c"
+        "0xf152Abda9E4ce8b134eF22Dc3C6aCe19C4895D82"
    }
```

```diff
    contract XAUt Vault Kinto (0xd04Bc056BE36a6127267E4F71d3b43D1BEEfE8bF) {
    +++ description: None
      values.owner:
-        "0x660ad4B5A74130a4796B4d54BC6750Ae93C86e6c"
+        "0xf152Abda9E4ce8b134eF22Dc3C6aCe19C4895D82"
    }
```

```diff
    contract KintoMultisig (0xf152Abda9E4ce8b134eF22Dc3C6aCe19C4895D82) {
    +++ description: None
      values.$members.5:
-        "0xc31C4549356d46c37021393EeEb6f704B38061eC"
      values.$members.4:
-        "0x94561e98DD5E55271f91A103e4979aa6C493745E"
+        "0xc31C4549356d46c37021393EeEb6f704B38061eC"
      values.$members.3:
-        "0xc1f4D15C16A1f3555E0a5F7AeFD1e17AD4aaf40B"
+        "0x94561e98DD5E55271f91A103e4979aa6C493745E"
      values.$members.2:
-        "0x08E674c4538caE03B6c05405881dDCd95DcaF5a8"
+        "0xc1f4D15C16A1f3555E0a5F7AeFD1e17AD4aaf40B"
      values.$members.1:
-        "0x78C0Ea07874F4C1Cd97cc14aE343b1ae85982259"
+        "0x08E674c4538caE03B6c05405881dDCd95DcaF5a8"
      values.multisigThreshold:
-        "3 of 6 (50%)"
+        "3 of 5 (60%)"
    }
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20726203 (main branch discovery), not current.

```diff
+   Status: CREATED
    contract LBTC Vault Lyra (0x76624ff43D610F64177Bb9c194A2503642e9B803)
    +++ description: None
```

```diff
+   Status: CREATED
    contract SOL Vault Kinto (0xA2bc0DaA9BF98820632bCa0663a9616f6bC180f8)
    +++ description: None
```

Generated with discovered.json: 0xe5c9598b6d1b921c349d1bcf2b34d2e22763ad96

# Diff at Wed, 11 Sep 2024 08:33:42 GMT:

- chain: ethereum
- author: sekuba (<sekuba@users.noreply.github.com>)
- comparing to: main@407590ebfbad0b4f799badc3ad5fce90a7eaed11 block: 20661696
- current block number: 20726203

## Description

Socket adds a plug and vault for wormhole-wrapped sol. yea...

## Watched changes

```diff
    contract Socket (0x943AC2775928318653e91d350574436A1b9b16f9) {
    +++ description: None
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.93:
+        "0xd48A35a853858e344aFCbEcCDBf8FCbFaF8e1501"
    }
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20661696 (main branch discovery), not current.

```diff
+   Status: CREATED
    contract USDT Vault Lyra (0x5e98A25d8d6FF69A8992d6Aa57948dFB77D4ECBa)
    +++ description: None
```

```diff
+   Status: CREATED
    contract sUSDe Vault Reya (0x5F3B301B4967623fDb3AE52Bb8FF4dB01C460Cd3)
    +++ description: None
```

Generated with discovered.json: 0x7219e90f18bcdf7199774fcff76519a5d21f2bc0

# Diff at Mon, 02 Sep 2024 08:29:43 GMT:

- chain: ethereum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@8fcb30f6c613b5454aa9ecdec05a118442e9dc7b block: 20626116
- current block number: 20661696

## Description

Three new Lyra tokens (not yet used): LBTC, LBTCCS, LBTCPS

## Watched changes

```diff
    contract Socket (0x943AC2775928318653e91d350574436A1b9b16f9) {
    +++ description: None
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.92:
+        "0xdb1c2F432e51824b33b9269C4b1Ff6190c1e5F35"
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.91:
+        "0x2D733e70A377FcFc249d273095250762A93F3820"
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.90:
+        "0x457379de638CAFeB1759a22457fe893b288E2e89"
    }
```

Generated with discovered.json: 0x9dedacc8326208f39ddd0d92173dfa503d7f5bd0

# Diff at Wed, 28 Aug 2024 09:14:01 GMT:

- chain: ethereum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@e994ce3db09d104c0549bcc88bb0de2f5d3b999e block: 20577569
- current block number: 20626116

## Description

New plugs and vaults on ethereum. (added to socket.ts, see list of new vaults in added contracts below)

## Watched changes

```diff
    contract Socket (0x943AC2775928318653e91d350574436A1b9b16f9) {
    +++ description: None
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.89:
+        "0xe38Dccb8Bd138c326E3Df926ADD9dE71a442837F"
    }
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20577569 (main branch discovery), not current.

```diff
+   Status: CREATED
    contract USDe Vault Lyra (0x26Cf1Dc84694E04277F2Fe4C13E43597c6010C2A)
    +++ description: None
```

```diff
+   Status: CREATED
    contract sDAI Vault Lyra (0x613e87BE1cd75dEBC5e6e56a2AF2fED84162C142)
    +++ description: None
```

```diff
+   Status: CREATED
    contract WETH Vault Reya (0x64dF894688c5052BeAdC35371cF69151Ebc5D658)
    +++ description: None
```

```diff
+   Status: CREATED
    contract DAI Vault Lyra (0x7E1d17b580dD4F89037DB331430eAEe8B8e50c91)
    +++ description: None
```

Generated with discovered.json: 0xdd2c762dc5afedea76043bf6696c0f669b419d60

# Diff at Wed, 21 Aug 2024 14:23:46 GMT:

- chain: ethereum
- author: Radina Talanova (<nt.radina@gmail.com>)
- comparing to: main@9ff9ee2b2fd37e2cdd4a4bcebdcefcb5e61b1e6c block: 20490738
- current block number: 20577569

## Description

New plugs, one new USDe vault found for Reya and added.

## Watched changes

```diff
    contract Socket (0x943AC2775928318653e91d350574436A1b9b16f9) {
    +++ description: None
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.88:
+        "0xA07EB173d58F7aF2b0267F2B5f6a091E01c17f85"
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.87:
+        "0x56705F7F12D4e0433e26a20298fCd3532226d744"
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.86:
+        "0x42F23C6d344d0322e13f254B9a8E187335AFB409"
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.85:
+        "0x3F0dAfEB6386c710617180b376c118D7EcD6aC89"
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.84:
+        "0x1b882b9E87ABd7DD9B9b689Bee10Ed6a040033D0"
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.83:
+        "0x49d446506D0f2db507AB4804563be9331BBc80E7"
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.82:
+        "0xaDA48ab8705Eb3904e5FA65D5622cd237a2341FF"
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.81:
+        "0x00CE54B988D8C44bFCae4026C17c37c69C490A12"
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.80:
+        "0x7Eee3241eC98ED0B47c8Bc0e9E3327B541BCDc1D"
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.79:
+        "0x50D46c3BB529276aDe59a6678C14302D6B61C853"
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.78:
+        "0x37C24e7081eb7f2B16bde81b556d082c0839F754"
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.77:
+        "0x254691C06Da387c1050C726cF498eFdA89083820"
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.76:
+        "0x083Add2A9afa97Efb6412b293145ce965eCE3600"
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.75:
+        "0xa1D11b141bb47eDb2c69B8ced4EFe80f62D1C276"
    }
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20490738 (main branch discovery), not current.

```diff
+   Status: CREATED
    contract USDe Vault Reya (0xaA2f2B6cD33Eaabb795c6DB60AAec599C8450F35)
    +++ description: None
```

Generated with discovered.json: 0xf576c14ed1fb7a13f001a95c7bc07a11394f3b41

# Diff at Fri, 09 Aug 2024 11:27:23 GMT:

- chain: ethereum
- author: Radina Talanova (<nt.radina@gmail.com>)
- comparing to: main@1ad87b4413497d14d292060f85413a135fcedee2 block: 20454363
- current block number: 20490738

## Description

New plugs, but vaults have 0 TVL. New vault for XAUt on Kinto was added.

## Watched changes

```diff
    contract Socket (0x943AC2775928318653e91d350574436A1b9b16f9) {
    +++ description: None
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.74:
+        "0x4E83292d5cacf05B85bED2c3D4a6056F42EE1738"
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.73:
+        "0x1aE19B11B71b1e232c43Fe65cB1d31E139Ac7A63"
    }
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20454363 (main branch discovery), not current.

```diff
+   Status: CREATED
    contract XAUt Vault Kinto (0xd04Bc056BE36a6127267E4F71d3b43D1BEEfE8bF)
    +++ description: None
```

Generated with discovered.json: 0x994e93822562c2da4125730819c4ef211ae3fad7

# Diff at Fri, 09 Aug 2024 10:12:19 GMT:

- chain: ethereum
- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@1f0da1d0aab7bc6b3b5e54e7e93480bd98e57035 block: 20454363
- current block number: 20454363

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20454363 (main branch discovery), not current.

```diff
    contract LyraMultisig (0x246d38588b16Dd877c558b245e6D5a711C649fCF) {
    +++ description: None
      values.$multisigThreshold:
-        "2 of 3 (67%)"
      values.getOwners:
-        ["0xb88D64a7E2ec1b137c969Adf2EC65f933d631F65","0x76E6F5C2A64df0F53077602642B79a45D5Ba6D52","0x4cEa25e9c999E69F45765539783D149024f99F12"]
      values.getThreshold:
-        2
      values.$members:
+        ["0xb88D64a7E2ec1b137c969Adf2EC65f933d631F65","0x76E6F5C2A64df0F53077602642B79a45D5Ba6D52","0x4cEa25e9c999E69F45765539783D149024f99F12"]
      values.$threshold:
+        2
      values.multisigThreshold:
+        "2 of 3 (67%)"
    }
```

```diff
    contract LooksRareMultisig (0xC8C57e4C73c71f72cA0a7e043E5D2D144F98ef13) {
    +++ description: None
      values.$multisigThreshold:
-        "3 of 5 (60%)"
      values.getOwners:
-        ["0xDA9854b190A54c6c5088AB43a274caFAFF7cF369","0x45d7A9bFC82Ca6AE410E4410f44c57a2b9F8Ec58","0xb69F2341F008f673F757B49104c165C8022CD0df","0x5ECfd6968593159e5b4f06832857943409122849","0x9eab2223d84060E212354BfA620BF687b6E9Ae20"]
      values.getThreshold:
-        3
      values.$members:
+        ["0xDA9854b190A54c6c5088AB43a274caFAFF7cF369","0x45d7A9bFC82Ca6AE410E4410f44c57a2b9F8Ec58","0xb69F2341F008f673F757B49104c165C8022CD0df","0x5ECfd6968593159e5b4f06832857943409122849","0x9eab2223d84060E212354BfA620BF687b6E9Ae20"]
      values.$threshold:
+        3
      values.multisigThreshold:
+        "3 of 5 (60%)"
    }
```

```diff
    contract KintoMultisig (0xf152Abda9E4ce8b134eF22Dc3C6aCe19C4895D82) {
    +++ description: None
      values.$multisigThreshold:
-        "3 of 6 (50%)"
      values.getOwners:
-        ["0x5D973Ea995d14799E528B14472346bfDE21eAe2e","0x78C0Ea07874F4C1Cd97cc14aE343b1ae85982259","0x08E674c4538caE03B6c05405881dDCd95DcaF5a8","0xc1f4D15C16A1f3555E0a5F7AeFD1e17AD4aaf40B","0x94561e98DD5E55271f91A103e4979aa6C493745E","0xc31C4549356d46c37021393EeEb6f704B38061eC"]
      values.getThreshold:
-        3
      values.$members:
+        ["0x5D973Ea995d14799E528B14472346bfDE21eAe2e","0x78C0Ea07874F4C1Cd97cc14aE343b1ae85982259","0x08E674c4538caE03B6c05405881dDCd95DcaF5a8","0xc1f4D15C16A1f3555E0a5F7AeFD1e17AD4aaf40B","0x94561e98DD5E55271f91A103e4979aa6C493745E","0xc31C4549356d46c37021393EeEb6f704B38061eC"]
      values.$threshold:
+        3
      values.multisigThreshold:
+        "3 of 6 (50%)"
    }
```

Generated with discovered.json: 0x8f5d8415ab31f273cd4bff9f106712375d2d7645

# Diff at Sun, 04 Aug 2024 09:42:44 GMT:

- chain: ethereum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@14945a4ebc63b3db3867f33067f31f159fedd9a9 block: 20367941
- current block number: 20454363

## Description

Provide description of changes. This section will be preserved.

## Watched changes

```diff
    contract Socket (0x943AC2775928318653e91d350574436A1b9b16f9) {
    +++ description: None
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.72:
+        "0xcb473D87A56b4609A695753711F727E5c4335cCf"
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ severity: LOW
      values.plugs.71:
+        "0x91CE463148bD7695d4db41f4aA36088E502428F7"
    }
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20367941 (main branch discovery), not current.

```diff
    contract ExecutionManager (0x98CAd9A205f1F7A7150241Ef2d565d1702BCe57C) {
    +++ description: None
      unverified:
-        true
      values.chainSlug:
+        1
      values.nominee:
+        "0x0000000000000000000000000000000000000000"
      values.owner:
+        "0xB0BBff6311B7F245761A7846d3Ce7B1b100C1836"
      values.signatureVerifier__:
+        "0xf1ABF110d1B6ff0E2e8C05dd64FBF9eBA4d8af98"
      values.socket__:
+        "0x943AC2775928318653e91d350574436A1b9b16f9"
    }
```

```diff
+   Status: CREATED
    contract PAXG Vault Kinto (0x25f0D71Da51A77Ca231484eBbAD1f588A0230ef2)
    +++ description: None
```

```diff
+   Status: CREATED
    contract KINTO Vault Kinto (0x2f87464d5F5356dB350dcb302FE28040986783a7)
    +++ description: None
```

```diff
+   Status: CREATED
    contract sDAI Vault Polynomial (0x615172e47c0C5A6dA8ea959632Ac0166f7a59eDc)
    +++ description: None
```

```diff
+   Status: CREATED
    contract sUSDe Vault Polynomial (0xC6cfb996A7CFEB89813A68CD13942CD75553032b)
    +++ description: None
```

```diff
+   Status: CREATED
    contract USDC Vault Polynomial (0xDE1617Ddb7C8A250A409D986930001985cfad76F)
    +++ description: None
```

Generated with discovered.json: 0x5a0294e708ba021053396e9744016dc2fb847ec7

# Diff at Tue, 30 Jul 2024 11:14:38 GMT:

- chain: ethereum
- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@b2b6471ff62871f4956541f42ec025c356c08f7e block: 20367941
- current block number: 20367941

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20367941 (main branch discovery), not current.

```diff
    contract PolygonL1Switchboard (0x053407DFA30267f6332f3c94a9e9F704A55e62CD) {
    +++ description: None
      fieldMeta:
+        {"switchboardFees":{"severity":"LOW","description":"Fee charged by the switchboard for processing a transaction"},"verificationOverheadFees":{"severity":"LOW","description":"Fee charged for verifying transaction"}}
    }
```

```diff
    contract OptimismSwitchboard2 (0x0E674e057EC0FF97eeA57B6A350DBAAD22FE41BA) {
    +++ description: None
      fieldMeta:
+        {"switchboardFees":{"severity":"LOW","description":"Fee charged by the switchboard for processing a transaction"},"verificationOverheadFees":{"severity":"LOW","description":"Fee charged for verifying transaction"}}
    }
```

```diff
    contract OptimismSwitchboard (0x139f39DC7dC05F7aC2DB3DB6af4f2e1a9De7c287) {
    +++ description: None
      fieldMeta:
+        {"switchboardFees":{"severity":"LOW","description":"Fee charged by the switchboard for processing a transaction"},"verificationOverheadFees":{"severity":"LOW","description":"Fee charged for verifying transaction"}}
    }
```

```diff
    contract Socket (0x943AC2775928318653e91d350574436A1b9b16f9) {
    +++ description: None
      fieldMeta:
+        {"executionManager__":{"description":"Manages crosschain execution and -fees."},"plugs":{"severity":"LOW","description":"ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain."}}
    }
```

```diff
    contract ArbitrumL1Switchboard (0xdf5f7dfDFc26ee5F629949e330bEf56906319CAe) {
    +++ description: None
      fieldMeta:
+        {"switchboardFees":{"severity":"LOW","description":"Fee charged by the switchboard for processing a transaction"},"verificationOverheadFees":{"severity":"LOW","description":"Fee charged for verifying transaction"}}
    }
```

Generated with discovered.json: 0x204b6b2c286321984245ecd7b47aa438ff7a60e3

# Diff at Tue, 23 Jul 2024 08:10:01 GMT:

- chain: ethereum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@a7fe674fdf7aafe1f69f1463836cac0d7e337d34 block: 20340184
- current block number: 20367941

## Description

New (unverified) plug, and executionManager is pointed to a new (unverified) contract. The old executionManager was used for crosschain execution and -fees.

## Watched changes

```diff
    contract Socket (0x943AC2775928318653e91d350574436A1b9b16f9) {
    +++ description: None
+++ description: Manages crosschain execution and -fees.
      values.executionManager__:
-        "0xFB4dcD94A051a1D2cF3EaF713a2Ef686653884E0"
+        "0x98CAd9A205f1F7A7150241Ef2d565d1702BCe57C"
+++ description: ConnectorPlugs connect vaults (escrows) or controllers via the socket main contract to the switchboards. They have counterparts on the sibling chain.
+++ type: CODE_CHANGE
+++ severity: LOW
      values.plugs.70:
+        "0x83D8e248cAb7c6074dCc07EA25892F8022244c50"
    }
```

```diff
-   Status: DELETED
    contract ExecutionManager (0xFB4dcD94A051a1D2cF3EaF713a2Ef686653884E0)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ExecutionManager (0x98CAd9A205f1F7A7150241Ef2d565d1702BCe57C)
    +++ description: None
```

## Source code changes

```diff
.../ExecutionManager.sol => /dev/null              | 1289 --------------------
 1 file changed, 1289 deletions(-)
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20340184 (main branch discovery), not current.

```diff
    contract TransmitManager (0xeD037aFBffC65a94E9CC592947E851FB2f730341) {
    +++ description: None
      values.accessControl:
+        {"DEFAULT_ADMIN_ROLE":{"adminRole":"DEFAULT_ADMIN_ROLE","members":[]}}
    }
```

Generated with discovered.json: 0x0e8508e83cd4c4229d0609413a4b05430f644a65

# Diff at Fri, 19 Jul 2024 11:10:17 GMT:

- chain: ethereum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@744d4e1fec0be9972ab7fde1dd4cc0ba0c91a28c block: 20332210
- current block number: 20340184

## Description

New plug, no new vaults.

## Watched changes

```diff
    contract Socket (0x943AC2775928318653e91d350574436A1b9b16f9) {
    +++ description: None
+++ description: ConnectorPlugs connect vaults (esrows) or controllers via the socket main contract to the switchboards. They have counerparts on the sibling chain.
+++ type: CODE_CHANGE
+++ severity: LOW
      values.plugs.69:
+        "0xEd0952283fdA768aA9d69eB7e895d49afcC3c0fe"
    }
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20332210 (main branch discovery), not current.

```diff
    contract rsETH Vault Lyra (0x35d4D9bc79B0a543934b1769304B90d752691caD) {
    +++ description: None
      unverified:
-        true
      values.bridgeType:
+        "0x9faa379a8f7762447354a00c30bda6b12f39577783c03b588d3fd75b4e2a5876"
      values.nominee:
+        "0x0000000000000000000000000000000000000000"
      values.owner:
+        "0x246d38588b16Dd877c558b245e6D5a711C649fCF"
    }
```

Generated with discovered.json: 0xcc11fb16443328f87fc9461c33c6a81fd8d17ed9

# Diff at Thu, 18 Jul 2024 08:28:17 GMT:

- chain: ethereum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@14a8b2e13da16d68d776511f98207e5360accba3 block: 20211873
- current block number: 20332210

## Description

New plugs are added. Some new vaults were discovered and are added to the socket.ts. (Lyra and Kinto projects already have these escrows)

## Watched changes

```diff
    contract Socket (0x943AC2775928318653e91d350574436A1b9b16f9) {
    +++ description: None
+++ description: ConnectorPlugs connect vaults (esrows) or controllers via the socket main contract to the switchboards. They have counerparts on the sibling chain.
+++ type: CODE_CHANGE
+++ severity: LOW
      values.plugs.68:
+        "0xcf2B4958e72Db99FDF844cD3992Daa2a8B7319c5"
+++ description: ConnectorPlugs connect vaults (esrows) or controllers via the socket main contract to the switchboards. They have counerparts on the sibling chain.
+++ type: CODE_CHANGE
+++ severity: LOW
      values.plugs.67:
+        "0x4a43eD818411585fEAaf667a2D3E2605962084e0"
+++ description: ConnectorPlugs connect vaults (esrows) or controllers via the socket main contract to the switchboards. They have counerparts on the sibling chain.
+++ type: CODE_CHANGE
+++ severity: LOW
      values.plugs.66:
+        "0x6B3614474eE19FA9A2d6D2079a2D73c04E567310"
+++ description: ConnectorPlugs connect vaults (esrows) or controllers via the socket main contract to the switchboards. They have counerparts on the sibling chain.
+++ type: CODE_CHANGE
+++ severity: LOW
      values.plugs.65:
+        "0x54bd887d31A5119Bbc91426eD6289b8ACD2b7349"
+++ description: ConnectorPlugs connect vaults (esrows) or controllers via the socket main contract to the switchboards. They have counerparts on the sibling chain.
+++ type: CODE_CHANGE
+++ severity: LOW
      values.plugs.64:
+        "0xBF3233Ef07B9552578987e2A2d25F760fBf192e5"
    }
```

```diff
    contract sUSDe Vault Lyra (0xE3E96892D30E0ee1a8131BAf87c891201F7137bf) {
    +++ description: None
      values.owner:
-        "0xA82994cc5e9D94FED2916f762e03245FcBE79f23"
+        "0x246d38588b16Dd877c558b245e6D5a711C649fCF"
    }
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20211873 (main branch discovery), not current.

```diff
    contract rsETH Vault Lyra (0x35d4D9bc79B0a543934b1769304B90d752691caD) {
    +++ description: None
      values.bridgeType:
-        "0x9faa379a8f7762447354a00c30bda6b12f39577783c03b588d3fd75b4e2a5876"
      values.nominee:
-        "0x0000000000000000000000000000000000000000"
      values.owner:
-        "0x246d38588b16Dd877c558b245e6D5a711C649fCF"
      unverified:
+        true
    }
```

```diff
+   Status: CREATED
    contract USDC Vault Kinto (0x755cD5d147036E11c76F1EeffDd94794fC265f0d)
    +++ description: None
```

```diff
+   Status: CREATED
    contract sUSDe Vault Lyra (0xE3E96892D30E0ee1a8131BAf87c891201F7137bf)
    +++ description: None
```

Generated with discovered.json: 0x77e73d2314cf2a0a4b7229471195a61da7d0de3c

# Diff at Mon, 01 Jul 2024 13:10:28 GMT:

- chain: ethereum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@fb78e4d497d7b23ec78438cad86db49fa84dcdd6 block: 20175047
- current block number: 20211873

## Description

New plugs for an sUSDeBULL token with various chain destinations. Not yet used and not on coingecko, so no escrow changes for the socket bridge.

## Watched changes

```diff
    contract Socket (0x943AC2775928318653e91d350574436A1b9b16f9) {
    +++ description: None
+++ description: ConnectorPlugs connect vaults (esrows) or controllers via the socket main contract to the switchboards. They have counerparts on the sibling chain.
+++ type: CODE_CHANGE
+++ severity: LOW
      values.plugs.63:
+        "0x3F574bc32a0bE9514010409FE8CF19e56fd7C83a"
+++ description: ConnectorPlugs connect vaults (esrows) or controllers via the socket main contract to the switchboards. They have counerparts on the sibling chain.
+++ type: CODE_CHANGE
+++ severity: LOW
      values.plugs.62:
+        "0xAda55E4762c3663f90D55Dc6ACC073B012D1e6eA"
+++ description: ConnectorPlugs connect vaults (esrows) or controllers via the socket main contract to the switchboards. They have counerparts on the sibling chain.
+++ type: CODE_CHANGE
+++ severity: LOW
      values.plugs.61:
+        "0x9D0487D8d93Fc08938A39e355c676A8b032Dc52a"
+++ description: ConnectorPlugs connect vaults (esrows) or controllers via the socket main contract to the switchboards. They have counerparts on the sibling chain.
+++ type: CODE_CHANGE
+++ severity: LOW
      values.plugs.60:
+        "0x1A9ba93F3cb22Ba7228D29607075F444e9ff515c"
+++ description: ConnectorPlugs connect vaults (esrows) or controllers via the socket main contract to the switchboards. They have counerparts on the sibling chain.
+++ type: CODE_CHANGE
+++ severity: LOW
      values.plugs.59:
+        "0x12fBD04CB103c596B78110C70eEDF16821CBfcAE"
+++ description: ConnectorPlugs connect vaults (esrows) or controllers via the socket main contract to the switchboards. They have counerparts on the sibling chain.
+++ type: CODE_CHANGE
+++ severity: LOW
      values.plugs.58:
+        "0x1967F0F374Eed3c0152d9CF0541F814206964041"
+++ description: ConnectorPlugs connect vaults (esrows) or controllers via the socket main contract to the switchboards. They have counerparts on the sibling chain.
+++ type: CODE_CHANGE
+++ severity: LOW
      values.plugs.57:
+        "0xfa8c07E28461eb7c65b33De024DB97eE4C052C97"
    }
```

Generated with discovered.json: 0xc756f3131ca96d16bfed9654446846c762cd7a50

# Diff at Wed, 26 Jun 2024 09:44:54 GMT:

- chain: ethereum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@cb9200e010745e10244c0b3851b3acf21fe41f31 block: 20138623
- current block number: 20175047

## Description

New plug with an attached vault for the upcoming KINTO token, not used yet.

## Watched changes

```diff
    contract Socket (0x943AC2775928318653e91d350574436A1b9b16f9) {
    +++ description: None
+++ description: ConnectorPlugs connect vaults (esrows) or controllers via the socket main contract to the switchboards. They have counerparts on the sibling chain.
+++ type: CODE_CHANGE
+++ severity: LOW
      values.plugs.56:
+        "0xA7384185a6428e6B0D33199256fE67b6fA5D8e40"
    }
```

Generated with discovered.json: 0xb7c645b5308cbf243e17e7486b4dcb2d95ccdd7f

# Diff at Fri, 21 Jun 2024 07:32:57 GMT:

- chain: ethereum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@1ba6434de248c46d9e6b140264866a3072082af4 block: 20054750
- current block number: 20138623

## Description

A new counter plug is added. (Not an escrow)
Unrelated: New vaults with non-zero TVL that were discovered by a re-run of the socket script are added.

## Watched changes

```diff
    contract Socket (0x943AC2775928318653e91d350574436A1b9b16f9) {
    +++ description: None
+++ description: ConnectorPlugs connect vaults (esrows) or controllers via the socket main contract to the switchboards. They have counerparts on the sibling chain.
+++ type: CODE_CHANGE
+++ severity: LOW
      values.plugs.55:
+        "0xb40FdECfCa4EF29CACc37222Ce4dB1fd0f561a00"
    }
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20054750 (main branch discovery), not current.

```diff
+   Status: CREATED
    contract WBTC Vault Reya (0x2344621d5aA6e784e8C6f4c54b0B29Dd9c3Ad4B6)
    +++ description: None
```

```diff
+   Status: CREATED
    contract rsETH Vault Lyra (0x35d4D9bc79B0a543934b1769304B90d752691caD)
    +++ description: None
```

```diff
+   Status: CREATED
    contract LOOKS Vault Blast (0xa83B4006c16DAeAb2718294696c0122519195137)
    +++ description: None
```

```diff
+   Status: CREATED
    contract LooksRareMultisig (0xC8C57e4C73c71f72cA0a7e043E5D2D144F98ef13)
    +++ description: None
```

```diff
+   Status: CREATED
    contract USDe Vault Kinto (0xdf34E61B6e7B9e348713d528fEB019d504d38c1e)
    +++ description: None
```

Generated with discovered.json: 0x0089044e22a120573a4cb53672a16adb879ec015

# Diff at Sun, 09 Jun 2024 14:05:43 GMT:

- chain: ethereum
- author: sekuba (<sekuba@users.noreply.github.com>)
- comparing to: main@023db9216bab49e9b3ffde0e43664e3e63c60fcf block: 19938250
- current block number: 20054750

## Description

### New owner EOA

The owner of some switchboards is changed from socketadmin.eth the another EOA (`0xB0BBff6311B7F245761A7846d3Ce7B1b100C1836`).

### New plugs and vaults

1) New vaults for Lyra-associated 'covered call'-tokens are deployed on Ethereum with Blast, Base, Arbitrum, Lyra, Mode and Optimism as their destinations. They are not yet used and therefore not yet added.
2) The Kinto WETH vault now has non-zero TVL and is added to socket.ts.

## Watched changes

```diff
    contract PolygonL1Switchboard (0x053407DFA30267f6332f3c94a9e9F704A55e62CD) {
    +++ description: None
      values.owner:
-        "0x5fD7D0d6b91CC4787Bcb86ca47e0Bd4ea0346d34"
+        "0xB0BBff6311B7F245761A7846d3Ce7B1b100C1836"
    }
```

```diff
    contract OptimismSwitchboard2 (0x0E674e057EC0FF97eeA57B6A350DBAAD22FE41BA) {
    +++ description: None
      values.owner:
-        "0x5fD7D0d6b91CC4787Bcb86ca47e0Bd4ea0346d34"
+        "0xB0BBff6311B7F245761A7846d3Ce7B1b100C1836"
    }
```

```diff
    contract CapacitorFactory (0x11Fbb9116801DB54bB51fF4dF423e34E8b45fc9a) {
    +++ description: None
      values.owner:
-        "0x5fD7D0d6b91CC4787Bcb86ca47e0Bd4ea0346d34"
+        "0xB0BBff6311B7F245761A7846d3Ce7B1b100C1836"
    }
```

```diff
    contract OptimismSwitchboard (0x139f39DC7dC05F7aC2DB3DB6af4f2e1a9De7c287) {
    +++ description: None
      values.owner:
-        "0x5fD7D0d6b91CC4787Bcb86ca47e0Bd4ea0346d34"
+        "0xB0BBff6311B7F245761A7846d3Ce7B1b100C1836"
    }
```

```diff
    contract Hasher (0x5C71beE4a6b0D617D8c3d107D331292741789E27) {
    +++ description: None
      values.owner:
-        "0x5fD7D0d6b91CC4787Bcb86ca47e0Bd4ea0346d34"
+        "0xB0BBff6311B7F245761A7846d3Ce7B1b100C1836"
    }
```

```diff
    contract Socket (0x943AC2775928318653e91d350574436A1b9b16f9) {
    +++ description: None
      values.owner:
-        "0x5fD7D0d6b91CC4787Bcb86ca47e0Bd4ea0346d34"
+        "0xB0BBff6311B7F245761A7846d3Ce7B1b100C1836"
+++ description: ConnectorPlugs connect vaults (esrows) or controllers via the socket main contract to the switchboards. They have counerparts on the sibling chain.
+++ type: CODE_CHANGE
+++ severity: LOW
      values.plugs.54:
+        "0x8843557Fd6005d617A735731BF1bAb0461af55E4"
+++ description: ConnectorPlugs connect vaults (esrows) or controllers via the socket main contract to the switchboards. They have counerparts on the sibling chain.
+++ type: CODE_CHANGE
+++ severity: LOW
      values.plugs.53:
+        "0xDBa83C0C654DB1cd914FA2710bA743e925B53086"
+++ description: ConnectorPlugs connect vaults (esrows) or controllers via the socket main contract to the switchboards. They have counerparts on the sibling chain.
+++ type: CODE_CHANGE
+++ severity: LOW
      values.plugs.52:
+        "0x716c339F41eAcfE2dc4775052411394A2Ed04743"
+++ description: ConnectorPlugs connect vaults (esrows) or controllers via the socket main contract to the switchboards. They have counerparts on the sibling chain.
+++ type: CODE_CHANGE
+++ severity: LOW
      values.plugs.51:
+        "0xd0711b9eBE84b778483709CDe62BacFDBAE13623"
+++ description: ConnectorPlugs connect vaults (esrows) or controllers via the socket main contract to the switchboards. They have counerparts on the sibling chain.
+++ type: CODE_CHANGE
+++ severity: LOW
      values.plugs.50:
+        "0x2B93891dc80ab9696814615f553fd15a3b98d3a2"
+++ description: ConnectorPlugs connect vaults (esrows) or controllers via the socket main contract to the switchboards. They have counerparts on the sibling chain.
+++ type: CODE_CHANGE
+++ severity: LOW
      values.plugs.49:
+        "0x519Bc0379CA9C4061a6006B4EAc419bC00017B3E"
+++ description: ConnectorPlugs connect vaults (esrows) or controllers via the socket main contract to the switchboards. They have counerparts on the sibling chain.
+++ type: CODE_CHANGE
+++ severity: LOW
      values.plugs.48:
+        "0x876b81F74AD47cF10e5D62aAAc80f9E99f5587FC"
+++ description: ConnectorPlugs connect vaults (esrows) or controllers via the socket main contract to the switchboards. They have counerparts on the sibling chain.
+++ type: CODE_CHANGE
+++ severity: LOW
      values.plugs.47:
+        "0xDABF17a0f13290E85a347119deEb8539B41eF4eB"
+++ description: ConnectorPlugs connect vaults (esrows) or controllers via the socket main contract to the switchboards. They have counerparts on the sibling chain.
+++ type: CODE_CHANGE
+++ severity: LOW
      values.plugs.46:
+        "0xA72bc51f800127621d4Ab541E7Bb70B86Fe88F0F"
+++ description: ConnectorPlugs connect vaults (esrows) or controllers via the socket main contract to the switchboards. They have counerparts on the sibling chain.
+++ type: CODE_CHANGE
+++ severity: LOW
      values.plugs.45:
+        "0x3685306641fB02804E9384C3af09Fa9B62199d7e"
+++ description: ConnectorPlugs connect vaults (esrows) or controllers via the socket main contract to the switchboards. They have counerparts on the sibling chain.
+++ type: CODE_CHANGE
+++ severity: LOW
      values.plugs.44:
+        "0x388341d9E5A7D7d5accD738B2a31b0622E0c1b87"
    }
```

```diff
    contract FastSwitchboard (0xD5a83a40F262E2247e6566171f9ADc76b745F5cD) {
    +++ description: None
      values.owner:
-        "0x5fD7D0d6b91CC4787Bcb86ca47e0Bd4ea0346d34"
+        "0xB0BBff6311B7F245761A7846d3Ce7B1b100C1836"
    }
```

```diff
    contract ArbitrumL1Switchboard (0xdf5f7dfDFc26ee5F629949e330bEf56906319CAe) {
    +++ description: None
      values.owner:
-        "0x5fD7D0d6b91CC4787Bcb86ca47e0Bd4ea0346d34"
+        "0xB0BBff6311B7F245761A7846d3Ce7B1b100C1836"
    }
```

```diff
    contract TransmitManager (0xeD037aFBffC65a94E9CC592947E851FB2f730341) {
    +++ description: None
      values.owner:
-        "0x5fD7D0d6b91CC4787Bcb86ca47e0Bd4ea0346d34"
+        "0xB0BBff6311B7F245761A7846d3Ce7B1b100C1836"
    }
```

```diff
    contract SignatureVerifier (0xf1ABF110d1B6ff0E2e8C05dd64FBF9eBA4d8af98) {
    +++ description: None
      values.owner:
-        "0x5fD7D0d6b91CC4787Bcb86ca47e0Bd4ea0346d34"
+        "0xB0BBff6311B7F245761A7846d3Ce7B1b100C1836"
    }
```

```diff
    contract ExecutionManager (0xFB4dcD94A051a1D2cF3EaF713a2Ef686653884E0) {
    +++ description: None
      values.owner:
-        "0x5fD7D0d6b91CC4787Bcb86ca47e0Bd4ea0346d34"
+        "0xB0BBff6311B7F245761A7846d3Ce7B1b100C1836"
    }
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19938250 (main branch discovery), not current.

```diff
+   Status: CREATED
    contract WETH Vault Kinto (0x00A0c9d82B95a17Cdf2D46703F2DcA13EB0E8A94)
    +++ description: None
```

Generated with discovered.json: 0xb73f0ccce9db7a2bbe57ebc5e399a2dcd7210bb0

# Diff at Fri, 24 May 2024 07:28:37 GMT:

- chain: ethereum
- author: sekuba (<sekuba@users.noreply.github.com>)
- comparing to: main@5cd348fa5e8522ccb7c426ede1cad1f03ab682ab block: 19926155
- current block number: 19938250

## Description

New socket script: only vaults with non-zero TVL are added.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19926155 (main branch discovery), not current.

```diff
-   Status: DELETED
    contract WETH Vault Kinto (0x00A0c9d82B95a17Cdf2D46703F2DcA13EB0E8A94)
    +++ description: None
```

```diff
    contract rswETH Vault Lyra (0x4BB4C3CDc7562f08e9910A0C7D8bB7e108861eB4) {
    +++ description: None
      values.hook__:
-        "0xAf65752C4643E25C02F693f9D4FE19cF23a095E3"
      values.token:
-        "0xFAe103DC9cf190eD75350761e95403b7b8aFa6c0"
    }
```

```diff
-   Status: DELETED
    contract USDT Vault Lyra (0x5e98A25d8d6FF69A8992d6Aa57948dFB77D4ECBa)
    +++ description: None
```

```diff
-   Status: DELETED
    contract WETH Vault Reya (0x64dF894688c5052BeAdC35371cF69151Ebc5D658)
    +++ description: None
```

```diff
-   Status: DELETED
    contract DAI Vault 2 Kinto (0x6ed6E6B7c34Adf01B73732f0c06e3bbd9d4EaE58)
    +++ description: None
```

```diff
-   Status: DELETED
    contract USDC Vault Kinto (0x755cD5d147036E11c76F1EeffDd94794fC265f0d)
    +++ description: None
```

```diff
    contract weETH Vault Lyra (0x8180EcCC825b692ef65FF099a0A387743788bf78) {
    +++ description: None
      values.hook__:
-        "0x204cDCFE0D03c75a41A0079f187a7870265Bc949"
      values.token:
-        "0xCd5fE23C85820F7B72D0926FC9b05b43E359b7ee"
    }
```

```diff
-   Status: DELETED
    contract eETH Vault Kinto (0xc7a542f73049C11f9719Be6Ff701fCA882D60020)
    +++ description: None
```

```diff
-   Status: DELETED
    contract wUSDM Vault Kinto (0xD357F7Ec4826Bd1234CDA2277B623F6dE7dA56Dc)
    +++ description: None
```

```diff
-   Status: DELETED
    contract USDe Vault Kinto (0xdf34E61B6e7B9e348713d528fEB019d504d38c1e)
    +++ description: None
```

```diff
    contract USDC Vault Reya (0xdFf78A949E47c1e90f3Dd6dd7Fe2Fa72B42a75f7) {
    +++ description: None
      values.hook__:
-        "0x4fB274909ffeEf635270915a729dC40500c7260B"
      values.token:
-        "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48"
    }
```

```diff
+   Status: CREATED
    contract USDC Vault Hook (0x855Aaf2f690Ef6e5EF451D7AE73EC3fa61c50981)
    +++ description: None
```

Generated with discovered.json: 0x8c5e260ec6c1e9a5056ac259a728800724d90395

# Diff at Wed, 22 May 2024 14:56:49 GMT:

- chain: ethereum
- author: sekuba (<sekuba@users.noreply.github.com>)
- comparing to: main@d8b1d401a7eb2fd4dbc2edda92ae733061915c30 block: 19919092
- current block number: 19926155

## Description

A new plug is added, connecting a new empty WETH vault to Reya.
Kinto changes the owner of all their vaults from an EOA to their Multisig.

## Watched changes

```diff
    contract WETH Vault Kinto (0x00A0c9d82B95a17Cdf2D46703F2DcA13EB0E8A94) {
    +++ description: None
      values.owner:
-        "0x660ad4B5A74130a4796B4d54BC6750Ae93C86e6c"
+        "0xf152Abda9E4ce8b134eF22Dc3C6aCe19C4895D82"
    }
```

```diff
    contract DAI Vault Kinto (0x12Cf431BdF7F143338cC09A0629EDcCEDCBCEcB5) {
    +++ description: None
      values.owner:
-        "0x660ad4B5A74130a4796B4d54BC6750Ae93C86e6c"
+        "0xf152Abda9E4ce8b134eF22Dc3C6aCe19C4895D82"
    }
```

```diff
    contract ENA Vault Kinto (0x351d8894fB8bfa1b0eFF77bFD9Aab18eA2da8fDd) {
    +++ description: None
      values.owner:
-        "0x660ad4B5A74130a4796B4d54BC6750Ae93C86e6c"
+        "0xf152Abda9E4ce8b134eF22Dc3C6aCe19C4895D82"
    }
```

```diff
    contract sUSDe Vault Kinto (0x43b718Aa5e678b08615CA984cbe25f690B085b32) {
    +++ description: None
      values.owner:
-        "0x660ad4B5A74130a4796B4d54BC6750Ae93C86e6c"
+        "0xf152Abda9E4ce8b134eF22Dc3C6aCe19C4895D82"
    }
```

```diff
    contract sDAI Vault Kinto (0x5B8Ae1C9c5970e2637Cf3Af431acAAebEf7aFb85) {
    +++ description: None
      values.owner:
-        "0x660ad4B5A74130a4796B4d54BC6750Ae93C86e6c"
+        "0xf152Abda9E4ce8b134eF22Dc3C6aCe19C4895D82"
    }
```

```diff
    contract USDC Vault Kinto (0x755cD5d147036E11c76F1EeffDd94794fC265f0d) {
    +++ description: None
      values.owner:
-        "0x660ad4B5A74130a4796B4d54BC6750Ae93C86e6c"
+        "0xf152Abda9E4ce8b134eF22Dc3C6aCe19C4895D82"
    }
```

```diff
    contract Socket (0x943AC2775928318653e91d350574436A1b9b16f9) {
    +++ description: None
+++ description: ConnectorPlugs connect vaults (esrows) or controllers via the socket main contract to the switchboards. They have counerparts on the sibling chain.
+++ type: CODE_CHANGE
+++ severity: LOW
      values.plugs.43:
+        "0x32295769ea702BA9337EE5B65c6b42aFF75FEC62"
    }
```

```diff
    contract ETHFI Vault Kinto (0x95d60E34aB2E626407d98dF8C240e6174e5D37E5) {
    +++ description: None
      values.owner:
-        "0x660ad4B5A74130a4796B4d54BC6750Ae93C86e6c"
+        "0xf152Abda9E4ce8b134eF22Dc3C6aCe19C4895D82"
    }
```

```diff
    contract wstETH Vault Kinto (0xc5d01939Af7Ce9Ffc505F0bb36eFeDde7920f2dc) {
    +++ description: None
      values.owner:
-        "0x660ad4B5A74130a4796B4d54BC6750Ae93C86e6c"
+        "0xf152Abda9E4ce8b134eF22Dc3C6aCe19C4895D82"
    }
```

```diff
    contract eETH Vault Kinto (0xc7a542f73049C11f9719Be6Ff701fCA882D60020) {
    +++ description: None
      values.owner:
-        "0x660ad4B5A74130a4796B4d54BC6750Ae93C86e6c"
+        "0xf152Abda9E4ce8b134eF22Dc3C6aCe19C4895D82"
    }
```

```diff
    contract wUSDM Vault Kinto (0xD357F7Ec4826Bd1234CDA2277B623F6dE7dA56Dc) {
    +++ description: None
      values.owner:
-        "0x660ad4B5A74130a4796B4d54BC6750Ae93C86e6c"
+        "0xf152Abda9E4ce8b134eF22Dc3C6aCe19C4895D82"
    }
```

```diff
    contract USDe Vault Kinto (0xdf34E61B6e7B9e348713d528fEB019d504d38c1e) {
    +++ description: None
      values.owner:
-        "0x660ad4B5A74130a4796B4d54BC6750Ae93C86e6c"
+        "0xf152Abda9E4ce8b134eF22Dc3C6aCe19C4895D82"
    }
```

```diff
    contract weETH Vault Kinto (0xeB66259d2eBC3ed1d3a98148f6298927d8A36397) {
    +++ description: None
      values.owner:
-        "0x660ad4B5A74130a4796B4d54BC6750Ae93C86e6c"
+        "0xf152Abda9E4ce8b134eF22Dc3C6aCe19C4895D82"
    }
```

```diff
+   Status: CREATED
    contract WETH Vault Reya (0x64dF894688c5052BeAdC35371cF69151Ebc5D658)
    +++ description: None
```

```diff
+   Status: CREATED
    contract KintoMultisig (0xf152Abda9E4ce8b134eF22Dc3C6aCe19C4895D82)
    +++ description: None
```

## Source code changes

```diff
.../ethereum/.flat/KintoMultisig/GnosisSafe.sol    | 952 +++++++++++++++++++++
 .../.flat/KintoMultisig/GnosisSafeProxy.p.sol      |  34 +
 ...-0x64dF894688c5052BeAdC35371cF69151Ebc5D658.sol | 886 +++++++++++++++++++
 3 files changed, 1872 insertions(+)
```

Generated with discovered.json: 0xcaeb1c446a3f5c31fd87a9bd4a84fbc98f2e9f5b

# Diff at Tue, 21 May 2024 15:12:04 GMT:

- chain: ethereum
- author: sekuba (<sekuba@users.noreply.github.com>)
- comparing to: main@d10db8000986dcc20fb2efb94c0e0636ac38fa21 block: 19888244
- current block number: 19919092

## Description

New plugs and escrows are added, related to Kinto.
The recently added Lyra vaults are now governed by the Lyra multisig.

## Watched changes

```diff
    contract rswETH Vault Lyra (0x4BB4C3CDc7562f08e9910A0C7D8bB7e108861eB4) {
    +++ description: None
      values.owner:
-        "0xA82994cc5e9D94FED2916f762e03245FcBE79f23"
+        "0x246d38588b16Dd877c558b245e6D5a711C649fCF"
    }
```

```diff
    contract weETH Vault Lyra (0x8180EcCC825b692ef65FF099a0A387743788bf78) {
    +++ description: None
      values.owner:
-        "0xA82994cc5e9D94FED2916f762e03245FcBE79f23"
+        "0x246d38588b16Dd877c558b245e6D5a711C649fCF"
    }
```

```diff
    contract Socket (0x943AC2775928318653e91d350574436A1b9b16f9) {
    +++ description: None
+++ description: ConnectorPlugs connect vaults (esrows) or controllers via the socket main contract to the switchboards. They have counerparts on the sibling chain.
+++ type: CODE_CHANGE
+++ severity: LOW
      values.plugs.42:
+        "0xdE9D8c2d465669c661672d7945D4d4f5407d22E2"
+++ description: ConnectorPlugs connect vaults (esrows) or controllers via the socket main contract to the switchboards. They have counerparts on the sibling chain.
+++ type: CODE_CHANGE
+++ severity: LOW
      values.plugs.41:
+        "0xE2c2291B80BFC8Bd0e4fc8Af196Ae5fc9136aeE0"
+++ description: ConnectorPlugs connect vaults (esrows) or controllers via the socket main contract to the switchboards. They have counerparts on the sibling chain.
+++ type: CODE_CHANGE
+++ severity: LOW
      values.plugs.40:
+        "0xC331BEeC6e36c8Df4FDD7e432de95863E7f80d67"
+++ description: ConnectorPlugs connect vaults (esrows) or controllers via the socket main contract to the switchboards. They have counerparts on the sibling chain.
+++ type: CODE_CHANGE
+++ severity: LOW
      values.plugs.39:
+        "0xE274dB6b891159547FbDC18b07412EE7F4B8d767"
+++ description: ConnectorPlugs connect vaults (esrows) or controllers via the socket main contract to the switchboards. They have counerparts on the sibling chain.
+++ type: CODE_CHANGE
+++ severity: LOW
      values.plugs.38:
+        "0xF5992B6A0dEa32dCF6BE7bfAf762A4D94f139Ea7"
+++ description: ConnectorPlugs connect vaults (esrows) or controllers via the socket main contract to the switchboards. They have counerparts on the sibling chain.
+++ type: CODE_CHANGE
+++ severity: LOW
      values.plugs.37:
+        "0x170fFDe318B514B029E1B1eC4F096C7e1bDeaeA8"
+++ description: ConnectorPlugs connect vaults (esrows) or controllers via the socket main contract to the switchboards. They have counerparts on the sibling chain.
+++ type: CODE_CHANGE
+++ severity: LOW
      values.plugs.36:
+        "0x642c4c33301EF5837ADa6E74F15Aa939f3951Fff"
+++ description: ConnectorPlugs connect vaults (esrows) or controllers via the socket main contract to the switchboards. They have counerparts on the sibling chain.
+++ type: CODE_CHANGE
+++ severity: LOW
      values.plugs.35:
+        "0x73E0d4953c356a5Ca3A3D172739128776B2920b5"
+++ description: ConnectorPlugs connect vaults (esrows) or controllers via the socket main contract to the switchboards. They have counerparts on the sibling chain.
+++ type: CODE_CHANGE
+++ severity: LOW
      values.plugs.34:
+        "0x266abd77Da7F877cdf93c0dd5782cC61Fa29ac96"
+++ description: ConnectorPlugs connect vaults (esrows) or controllers via the socket main contract to the switchboards. They have counerparts on the sibling chain.
+++ type: CODE_CHANGE
+++ severity: LOW
      values.plugs.33:
+        "0x935f1C29Db1155c3E0f39F644DF78DDDBD4757Ff"
+++ description: ConnectorPlugs connect vaults (esrows) or controllers via the socket main contract to the switchboards. They have counerparts on the sibling chain.
+++ type: CODE_CHANGE
+++ severity: LOW
      values.plugs.32:
+        "0xe987a57DA7Ab112B1bDc7AA704E6EA943760d252"
+++ description: ConnectorPlugs connect vaults (esrows) or controllers via the socket main contract to the switchboards. They have counerparts on the sibling chain.
+++ type: CODE_CHANGE
+++ severity: LOW
      values.plugs.31:
+        "0x83C6d6597891Ad48cF5e0BA901De55120C37C6bE"
+++ description: ConnectorPlugs connect vaults (esrows) or controllers via the socket main contract to the switchboards. They have counerparts on the sibling chain.
+++ type: CODE_CHANGE
+++ severity: LOW
      values.plugs.30:
+        "0xAc00056920EfF02831CAf0baF116ADf6B42D9ad1"
+++ description: ConnectorPlugs connect vaults (esrows) or controllers via the socket main contract to the switchboards. They have counerparts on the sibling chain.
+++ type: CODE_CHANGE
+++ severity: LOW
      values.plugs.29:
+        "0xE7ADE6Dda067c501A3d4C938c36c310c55FBcc27"
    }
```

```diff
+   Status: CREATED
    contract WETH Vault Kinto (0x00A0c9d82B95a17Cdf2D46703F2DcA13EB0E8A94)
    +++ description: None
```

```diff
+   Status: CREATED
    contract DAI Vault Kinto (0x12Cf431BdF7F143338cC09A0629EDcCEDCBCEcB5)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ENA Vault Kinto (0x351d8894fB8bfa1b0eFF77bFD9Aab18eA2da8fDd)
    +++ description: None
```

```diff
+   Status: CREATED
    contract sUSDe Vault Kinto (0x43b718Aa5e678b08615CA984cbe25f690B085b32)
    +++ description: None
```

```diff
+   Status: CREATED
    contract sDAI Vault Kinto (0x5B8Ae1C9c5970e2637Cf3Af431acAAebEf7aFb85)
    +++ description: None
```

```diff
+   Status: CREATED
    contract DAI Vault 2 Kinto (0x6ed6E6B7c34Adf01B73732f0c06e3bbd9d4EaE58)
    +++ description: None
```

```diff
+   Status: CREATED
    contract USDC Vault Kinto (0x755cD5d147036E11c76F1EeffDd94794fC265f0d)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ETHFI Vault Kinto (0x95d60E34aB2E626407d98dF8C240e6174e5D37E5)
    +++ description: None
```

```diff
+   Status: CREATED
    contract wstETH Vault Kinto (0xc5d01939Af7Ce9Ffc505F0bb36eFeDde7920f2dc)
    +++ description: None
```

```diff
+   Status: CREATED
    contract eETH Vault Kinto (0xc7a542f73049C11f9719Be6Ff701fCA882D60020)
    +++ description: None
```

```diff
+   Status: CREATED
    contract wUSDM Vault Kinto (0xD357F7Ec4826Bd1234CDA2277B623F6dE7dA56Dc)
    +++ description: None
```

```diff
+   Status: CREATED
    contract USDe Vault Kinto (0xdf34E61B6e7B9e348713d528fEB019d504d38c1e)
    +++ description: None
```

```diff
+   Status: CREATED
    contract weETH Vault Kinto (0xeB66259d2eBC3ed1d3a98148f6298927d8A36397)
    +++ description: None
```

## Source code changes

```diff
...-0x00A0c9d82B95a17Cdf2D46703F2DcA13EB0E8A94.sol | 886 +++++++++++++++++++++
 ...-0x12Cf431BdF7F143338cC09A0629EDcCEDCBCEcB5.sol | 886 +++++++++++++++++++++
 ...-0x351d8894fB8bfa1b0eFF77bFD9Aab18eA2da8fDd.sol | 886 +++++++++++++++++++++
 ...-0x43b718Aa5e678b08615CA984cbe25f690B085b32.sol | 886 +++++++++++++++++++++
 ...-0x5B8Ae1C9c5970e2637Cf3Af431acAAebEf7aFb85.sol | 886 +++++++++++++++++++++
 ...-0x6ed6E6B7c34Adf01B73732f0c06e3bbd9d4EaE58.sol | 886 +++++++++++++++++++++
 ...-0x755cD5d147036E11c76F1EeffDd94794fC265f0d.sol | 886 +++++++++++++++++++++
 ...-0x95d60E34aB2E626407d98dF8C240e6174e5D37E5.sol | 886 +++++++++++++++++++++
 ...-0xD357F7Ec4826Bd1234CDA2277B623F6dE7dA56Dc.sol | 886 +++++++++++++++++++++
 ...-0xc5d01939Af7Ce9Ffc505F0bb36eFeDde7920f2dc.sol | 886 +++++++++++++++++++++
 ...-0xc7a542f73049C11f9719Be6Ff701fCA882D60020.sol | 886 +++++++++++++++++++++
 ...-0xdf34E61B6e7B9e348713d528fEB019d504d38c1e.sol | 886 +++++++++++++++++++++
 ...-0xeB66259d2eBC3ed1d3a98148f6298927d8A36397.sol | 886 +++++++++++++++++++++
 13 files changed, 11518 insertions(+)
```

Generated with discovered.json: 0x4bd5593e7b5d34a2700f86bac590a29180eb78e9

# Diff at Fri, 17 May 2024 07:36:32 GMT:

- chain: ethereum
- author: sekuba (<sekuba@users.noreply.github.com>)
- comparing to: main@f530b3790f02092dbc5b25633755416ea7c2ec7d block: 19805467
- current block number: 19888244

## Description

New plugs connected to vaults associated with Lyra are added.
5 plugs, 1 has the same vault, 4 have vaults with the tokens:
- weETH (supported already)
- rswETH (restaked Swell ETH, added)
- weETHC (Lyra wrapped eETH covered call, ignored for now)
- rswethC (ignored for now)


## Watched changes

```diff
    contract Socket (0x943AC2775928318653e91d350574436A1b9b16f9) {
    +++ description: None
+++ description: ConnectorPlugs connect vaults (esrows) or controllers via the socket main contract to the switchboards. They have counerparts on the sibling chain.
+++ type: CODE_CHANGE
+++ severity: LOW
      values.plugs.28:
+        "0xb1178803A726e2077947754de9f2f0cbdA29A60F"
+++ description: ConnectorPlugs connect vaults (esrows) or controllers via the socket main contract to the switchboards. They have counerparts on the sibling chain.
+++ type: CODE_CHANGE
+++ severity: LOW
      values.plugs.27:
+        "0xB49b8AAcD8396C49d9045f6bAb101aB32c59643D"
+++ description: ConnectorPlugs connect vaults (esrows) or controllers via the socket main contract to the switchboards. They have counerparts on the sibling chain.
+++ type: CODE_CHANGE
+++ severity: LOW
      values.plugs.26:
+        "0x3f66F272d33B764960779a301c4183306ae50e10"
+++ description: ConnectorPlugs connect vaults (esrows) or controllers via the socket main contract to the switchboards. They have counerparts on the sibling chain.
+++ type: CODE_CHANGE
+++ severity: LOW
      values.plugs.25:
+        "0xF15d420bE7b27F1fA0D9487105658EdC3C0EA508"
+++ description: ConnectorPlugs connect vaults (esrows) or controllers via the socket main contract to the switchboards. They have counerparts on the sibling chain.
+++ type: CODE_CHANGE
+++ severity: LOW
      values.plugs.24:
+        "0xCc958F84DaF36d3eC20BcBee7E99C073B882efc3"
    }
```

```diff
+   Status: CREATED
    contract rswETH Vault Lyra (0x4BB4C3CDc7562f08e9910A0C7D8bB7e108861eB4)
    +++ description: None
```

```diff
+   Status: CREATED
    contract weETH Vault Lyra (0x8180EcCC825b692ef65FF099a0A387743788bf78)
    +++ description: None
```

## Source code changes

```diff
...-0x4BB4C3CDc7562f08e9910A0C7D8bB7e108861eB4.sol | 886 +++++++++++++++++++++
 ...-0x8180EcCC825b692ef65FF099a0A387743788bf78.sol | 886 +++++++++++++++++++++
 2 files changed, 1772 insertions(+)
```

Generated with discovered.json: 0x24bfd7f6c3a89e63c879a013490d80256ff8a746

# Diff at Sun, 05 May 2024 17:46:10 GMT:

- chain: ethereum
- author: sekuba (<sekuba@users.noreply.github.com>)
- comparing to: main@91ddfe46c9a8cff7aff522924d50fd166a15932b block: 19609491
- current block number: 19805467

## Description

4 Plugs are added to the socket main contract. New vaults are discovered by the socket-update script and added to the escrows in socket.ts.

## Watched changes

```diff
    contract Socket (0x943AC2775928318653e91d350574436A1b9b16f9) {
    +++ description: None
+++ description: ConnectorPlugs connect vaults (esrows) or controllers via the socket main contract to the switchboards. They have counerparts on the sibling chain.
+++ type: CODE_CHANGE
+++ severity: LOW
      values.plugs.23:
+        "0x7E6dA87FE69306CaAED675fFe4e7dC0FfE3bFe4D"
+++ description: ConnectorPlugs connect vaults (esrows) or controllers via the socket main contract to the switchboards. They have counerparts on the sibling chain.
+++ type: CODE_CHANGE
+++ severity: LOW
      values.plugs.22:
+        "0x223033E1F905eEd161a7B2EBeb786a158156fb8D"
+++ description: ConnectorPlugs connect vaults (esrows) or controllers via the socket main contract to the switchboards. They have counerparts on the sibling chain.
+++ type: CODE_CHANGE
+++ severity: LOW
      values.plugs.21:
+        "0x998d7C2257591cC38383B4F91474c5346111f2E6"
+++ description: ConnectorPlugs connect vaults (esrows) or controllers via the socket main contract to the switchboards. They have counerparts on the sibling chain.
+++ type: CODE_CHANGE
+++ severity: LOW
      values.plugs.20:
+        "0xaaDd94438f511aC22D35Ba7FC50849a9CD3e6AeF"
    }
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19609491 (main branch discovery), not current.

```diff
    contract USDCVaultOwner (0x246d38588b16Dd877c558b245e6D5a711C649fCF) {
    +++ description: None
      name:
-        "USDCVaultOwner"
+        "LyraMultisig"
    }
```

```diff
    contract WBTC Vault (0x3Eec7c855aF33280F1eD38b93059F5aa5862E3ab) {
    +++ description: None
      name:
-        "WBTC Vault"
+        "WBTC Vault Lyra"
    }
```

```diff
    contract USDC Vault (0x6D303CEE7959f814042D31E0624fB88Ec6fbcC1d) {
    +++ description: None
      name:
-        "USDC Vault"
+        "USDC Vault Lyra"
    }
```

```diff
    contract SNX Vault (0x7D7aC8d55A9bD4152b703011f3E61AB3bB0A5592) {
    +++ description: None
      name:
-        "SNX Vault"
+        "SNX Vault Lyra"
    }
```

```diff
    contract WETH Vault 2 (0xB39DF6BBB1Cf2B609DeE43F109caFEFF1A7CCBEa) {
    +++ description: None
      name:
-        "WETH Vault 2"
+        "WETH Vault Hook"
    }
```

```diff
    contract WETH Vault (0xD4efe33C66B8CdE33B8896a2126E41e5dB571b7e) {
    +++ description: None
      name:
-        "WETH Vault"
+        "WETH Vault Lyra"
    }
```

```diff
    contract wstETH Vault (0xeBB5D642aA8ccDeE98373D6aC3ee0602b63824b3) {
    +++ description: None
      name:
-        "wstETH Vault"
+        "wstETH Vault Lyra"
    }
```

```diff
+   Status: CREATED
    contract USDT Vault Lyra (0x5e98A25d8d6FF69A8992d6Aa57948dFB77D4ECBa)
    +++ description: None
```

```diff
+   Status: CREATED
    contract USDC Vault Reya (0xdFf78A949E47c1e90f3Dd6dd7Fe2Fa72B42a75f7)
    +++ description: None
```

Generated with discovered.json: 0xfb0b61de4c8e0445a4631e0fabe790a63dede53e

# Diff at Mon, 08 Apr 2024 07:34:22 GMT:

- chain: ethereum
- author: sekuba (<sekuba@users.noreply.github.com>)
- comparing to: main@ad88f63bb61619b31763ca9524dff8964cdc75f3 block: 19588327
- current block number: 19609491

## Description

A new plug is added. Its source code is not verified on Etherscan.

## Watched changes

```diff
    contract Socket (0x943AC2775928318653e91d350574436A1b9b16f9) {
    +++ description: None
+++ description: Array of plug contract addresses
+++ type: CODE_CHANGE
+++ severity: LOW
      values.plugs.19:
+        "0x2Dba37E679358125BaB2132dDF5133d7d66F7D06"
    }
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19588327 (main branch discovery), not current.

```diff
    contract WETH Vault 2 (0xB39DF6BBB1Cf2B609DeE43F109caFEFF1A7CCBEa) {
    +++ description: None
      values.token__:
-        "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2"
    }
```

```diff
-   Status: DELETED
    contract WETH9 (0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2)
    +++ description: None
```

Generated with discovered.json: 0xce7bfd338e208ebb4e3ce8a443525d2c636ed6ce

# Diff at Fri, 05 Apr 2024 08:24:08 GMT:

- chain: ethereum
- author: sekuba (<sekuba@users.noreply.github.com>)
- comparing to: main@a911910b5e2265ea9037cf3122956a3c9707d183 block: 19532195
- current block number: 19588327

## Description

A plug is added.

## Watched changes

```diff
    contract Socket (0x943AC2775928318653e91d350574436A1b9b16f9) {
    +++ description: None
+++ description: Array of plug contract addresses
+++ type: CODE_CHANGE
+++ severity: LOW
      values.plugs.18:
+        "0x6A769e25081396a49a6702758d0830920ac1163A"
    }
```

```diff
    contract WETH9 (0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2) {
    +++ description: None
      values.totalSupply:
-        "2986807183575385281668118"
+        "2997542922595290340510005"
    }
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19532195 (main branch discovery), not current.

```diff
+   Status: CREATED
    contract WBTC Vault (0x3Eec7c855aF33280F1eD38b93059F5aa5862E3ab)
    +++ description: None
```

```diff
+   Status: CREATED
    contract SNX Vault (0x7D7aC8d55A9bD4152b703011f3E61AB3bB0A5592)
    +++ description: None
```

```diff
+   Status: CREATED
    contract WETH Vault 2 (0xB39DF6BBB1Cf2B609DeE43F109caFEFF1A7CCBEa)
    +++ description: None
```

```diff
+   Status: CREATED
    contract WETH9 (0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2)
    +++ description: None
```

```diff
+   Status: CREATED
    contract WETH Vault (0xD4efe33C66B8CdE33B8896a2126E41e5dB571b7e)
    +++ description: None
```

```diff
+   Status: CREATED
    contract wstETH Vault (0xeBB5D642aA8ccDeE98373D6aC3ee0602b63824b3)
    +++ description: None
```

Generated with discovered.json: 0x5f06851d6935822ec7d2e9ae5ae731d06d295cb6

# Diff at Thu, 28 Mar 2024 11:05:29 GMT:

- chain: ethereum
- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@21187e63b9b90823a55c461c331868a470ce17eb block: 19497754
- current block number: 19532195

## Description

Update discovery to include the multisig threshold.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19497754 (main branch discovery), not current.

```diff
    contract USDCVaultOwner (0x246d38588b16Dd877c558b245e6D5a711C649fCF) {
    +++ description: None
      upgradeability.threshold:
+        "2 of 3 (67%)"
    }
```

Generated with discovered.json: 0x255f035589a4edd15c65708c90afa4cdecca5909

# Diff at Fri, 22 Mar 2024 07:51:07 GMT:

- chain: ethereum
- author: sekuba (<sekuba@users.noreply.github.com>)
- comparing to: main@022e2fdbd062a978ff7ecc702973b614915f5846 block: 19483658
- current block number: 19488785

## Description

More bridging fee changes.

## Watched changes

```diff
    contract PolygonL1Switchboard (0x053407DFA30267f6332f3c94a9e9F704A55e62CD) {
    +++ description: None
+++ description: Fee charged by the switchboard for processing a transaction
+++ severity: LOW
      values.switchboardFees:
-        5884471559011500
+        4244501643700500
+++ description: Fee charged for verifying transaction
+++ severity: LOW
      values.verificationOverheadFees:
-        3278655744000
+        824668780000
    }
```

```diff
    contract OptimismSwitchboard2 (0x0E674e057EC0FF97eeA57B6A350DBAAD22FE41BA) {
    +++ description: None
+++ description: Fee charged by the switchboard for processing a transaction
+++ severity: LOW
      values.switchboardFees:
-        5568057713790000
+        4307646578800500
+++ description: Fee charged for verifying transaction
+++ severity: LOW
      values.verificationOverheadFees:
-        340928172000
+        359338720000
    }
```

```diff
    contract OptimismSwitchboard (0x139f39DC7dC05F7aC2DB3DB6af4f2e1a9De7c287) {
    +++ description: None
+++ description: Fee charged by the switchboard for processing a transaction
+++ severity: LOW
      values.switchboardFees:
-        5568057713790000
+        3270848270917500
    }
```

```diff
    contract ArbitrumL1Switchboard (0xdf5f7dfDFc26ee5F629949e330bEf56906319CAe) {
    +++ description: None
+++ description: Fee charged by the switchboard for processing a transaction
+++ severity: LOW
      values.switchboardFees:
-        6280699596483000
+        4386707880087000
    }
```

Generated with discovered.json: 0x9c077c8bf899c1f9ec86477b7bf996418783348f

# Diff at Thu, 21 Mar 2024 14:34:30 GMT:

- chain: ethereum
- author: sekuba (<sekuba@users.noreply.githum.com>)
- comparing to: main@550e8c13dc36da304ad797c4c213a735d633c96b block: 19389434
- current block number: 19483658

## Description

Bridging fees are raised (doubled) for the optimism switchboards.

## Watched changes

```diff
    contract PolygonL1Switchboard (0x053407DFA30267f6332f3c94a9e9F704A55e62CD) {
    +++ description: None
+++ description: Fee charged by the switchboard for processing a transaction
+++ severity: LOW
      values.switchboardFees:
-        2700564286365000
+        5884471559011500
+++ description: Fee charged for verifying transaction
+++ severity: LOW
      values.verificationOverheadFees:
-        1196689560000
+        3278655744000
    }
```

```diff
    contract OptimismSwitchboard2 (0x0E674e057EC0FF97eeA57B6A350DBAAD22FE41BA) {
    +++ description: None
+++ description: Fee charged by the switchboard for processing a transaction
+++ severity: LOW
      values.switchboardFees:
-        2251544461254000
+        5568057713790000
+++ description: Fee charged for verifying transaction
+++ severity: LOW
      values.verificationOverheadFees:
-        319607508000
+        340928172000
    }
```

```diff
    contract OptimismSwitchboard (0x139f39DC7dC05F7aC2DB3DB6af4f2e1a9De7c287) {
    +++ description: None
+++ description: Fee charged by the switchboard for processing a transaction
+++ severity: LOW
      values.switchboardFees:
-        2251544461254000
+        5568057713790000
+++ description: Fee charged for verifying transaction
+++ severity: LOW
      values.verificationOverheadFees:
-        44002200000
+        52013156000
    }
```

```diff
    contract ArbitrumL1Switchboard (0xdf5f7dfDFc26ee5F629949e330bEf56906319CAe) {
    +++ description: None
+++ description: Fee charged by the switchboard for processing a transaction
+++ severity: LOW
      values.switchboardFees:
-        2458955286249000
+        6280699596483000
+++ description: Fee charged for verifying transaction
+++ severity: LOW
      values.verificationOverheadFees:
-        55000000000000
+        6500000000000
    }
```

Generated with discovered.json: 0x2f2ba4933ab604e3fea69cb0554f79110c0ea619

# Diff at Fri, 08 Mar 2024 09:05:01 GMT:

- chain: ethereum
- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@a10be30b5303dc6a457478efdaca424c246501ca block: 19375693
- current block number: 19389434

## Description

Two new plugs.

## Watched changes

```diff
    contract Socket (0x943AC2775928318653e91d350574436A1b9b16f9) {
    +++ description: None
      values.plugs[17]:
+        "0xdCcFb24f983586144c085426dbfa3414045E19a3"
      values.plugs[16]:
+        "0x727aD65db6aE99DB5Dbee8F202846DD6009bf6D5"
    }
```

Generated with discovered.json: 0x37cb2efea554c7c5038c7efcd12e8cd84046d16f

# Diff at Wed, 06 Mar 2024 11:01:08 GMT:

- chain: ethereum
- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@724fc93d9bd160395a856b93ce5016ca876c6436 block: 19212794
- current block number: 19375693

## Description

Three new plugs.

## Watched changes

```diff
    contract Socket (0x943AC2775928318653e91d350574436A1b9b16f9) {
    +++ description: None
      values.plugs[15]:
+        "0x4ab7B94BA3f3CF69354Eb2f6b5E856DC61e13660"
      values.plugs[14]:
+        "0x8F4e67C61232167584333e23D7d67BD73d80a4F5"
      values.plugs[13]:
+        "0x68411d61adF1341A6392C87A93941FdD3EE7DF8E"
    }
```

Generated with discovered.json: 0xbe11b5db1a4e90286ad51c890467859b0f633f8f

# Diff at Mon, 12 Feb 2024 15:19:43 GMT:

- chain: ethereum
- author: vincfurc (<10850139+vincfurc@users.noreply.github.com>)
- comparing to: main@49775e355a1eff76df613908442249b787dac181 block: 19126484
- current block number: 19212794

## Description

Ignored nonce for usdc vault owner.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19126484 (main branch discovery), not current.

```diff
    contract GnosisSafe (0x246d38588b16Dd877c558b245e6D5a711C649fCF) {
      name:
-        "GnosisSafe"
+        "USDCVaultOwner"
      derivedName:
+        "GnosisSafe"
    }
```

Generated with discovered.json: 0x27bd701904bb21c706ab1fea624a84968e3fa15f

# Diff at Wed, 31 Jan 2024 12:32:59 GMT:

- chain: ethereum
- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@e27d63e182fc6d33d67f67df00e2990c9700987e block: 19085063
- current block number: 19126484

## Description

Two new plugs.
Ignore `globalMessageCount` in watch mode.

## Watched changes

```diff
    contract Socket (0x943AC2775928318653e91d350574436A1b9b16f9) {
      values.plugs[12]:
+        "0x37091ade7C4E1A914D3155449e25eE91DA08EbE4"
      values.plugs[11]:
+        "0x280D208f0eE2f053A0441099bcBFf298bc8b9444"
    }
```

Generated with discovered.json: 0x7e76d559dbb49ba64aaea7b6263c85048220674d

# Diff at Thu, 25 Jan 2024 17:16:49 GMT:

- chain: ethereum
- author: Michał Sobieraj-Jakubiec (<michalsidzej@gmail.com>)
- current block number: 19085063

## Description

Several new Switchboards created: PolygonL1Switchboard, OptimismSwitchboard2, OptimismSwitchboard, FastSwitchboard, ArbitrumL1Switchboard.

## Initial discovery

```diff
+   Status: CREATED
    contract PolygonL1Switchboard (0x053407DFA30267f6332f3c94a9e9F704A55e62CD) {
    }
```

```diff
+   Status: CREATED
    contract OptimismSwitchboard2 (0x0E674e057EC0FF97eeA57B6A350DBAAD22FE41BA) {
    }
```

```diff
+   Status: CREATED
    contract CapacitorFactory (0x11Fbb9116801DB54bB51fF4dF423e34E8b45fc9a) {
    }
```

```diff
+   Status: CREATED
    contract OptimismSwitchboard (0x139f39DC7dC05F7aC2DB3DB6af4f2e1a9De7c287) {
    }
```

```diff
+   Status: CREATED
    contract GnosisSafe (0x246d38588b16Dd877c558b245e6D5a711C649fCF) {
    }
```

```diff
+   Status: CREATED
    contract Hasher (0x5C71beE4a6b0D617D8c3d107D331292741789E27) {
    }
```

```diff
+   Status: CREATED
    contract USDC Vault (0x6D303CEE7959f814042D31E0624fB88Ec6fbcC1d) {
    }
```

```diff
+   Status: CREATED
    contract Socket (0x943AC2775928318653e91d350574436A1b9b16f9) {
    }
```

```diff
+   Status: CREATED
    contract FastSwitchboard (0xD5a83a40F262E2247e6566171f9ADc76b745F5cD) {
    }
```

```diff
+   Status: CREATED
    contract ArbitrumL1Switchboard (0xdf5f7dfDFc26ee5F629949e330bEf56906319CAe) {
    }
```

```diff
+   Status: CREATED
    contract TransmitManager (0xeD037aFBffC65a94E9CC592947E851FB2f730341) {
    }
```

```diff
+   Status: CREATED
    contract SignatureVerifier (0xf1ABF110d1B6ff0E2e8C05dd64FBF9eBA4d8af98) {
    }
```

```diff
+   Status: CREATED
    contract ExecutionManager (0xFB4dcD94A051a1D2cF3EaF713a2Ef686653884E0) {
    }
```

