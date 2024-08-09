Generated with discovered.json: 0x994e93822562c2da4125730819c4ef211ae3fad7

# Diff at Fri, 09 Aug 2024 10:12:19 GMT:

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
