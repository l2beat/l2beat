Generated with discovered.json: 0x18e112597e752f06c69d3c1745181823b7fe811b

# Diff at Wed, 11 Dec 2024 05:59:21 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@0e3b4aa609891cbfaf2ac16c5eae6839e5be9f68 block: 619744
- current block number: 628196

## Description

Minor upgrade that adds a `EXIT_WINDOW_PERIOD` of 10d (from the most recent sanction) to KintoID during which `add-/removeSanction()` reverts. This prevents resetting of sanctionedAt[account] TS to the latest block number, which would re-sanction a user even in the case of SC not confirming.

No changes to the permissions / roles yet.

## Watched changes

```diff
    contract KintoID (0xf369f78E3A0492CC4e96a90dae0728A38498e9c7) {
    +++ description: Manages Kinto's KYC system: KYC provider addresses and the KYC status of users.
      sourceHashes.1:
-        "0x3fa7283c94fa2072438a07fb3069ce98694353a7a07f32585e2baa41a856fca9"
+        "0xdd266bc2e9cb84472ebc0a2583f1b1cbeb143cedb0763780f10d151ddff8f8ec"
      values.$implementation:
-        "0x7CFe474936fA50181ae7c2C43EeB8806e25bc983"
+        "0xaa0726829d41E3C70B84Bc5390cce82afC56871A"
      values.$pastUpgrades.8:
+        ["2024-12-10T20:00:17.000Z","0x9fa20142e6e04305e74314e6670ecbf65477f470a9251ec55dc52ddcd34940b1",["0xaa0726829d41E3C70B84Bc5390cce82afC56871A"]]
      values.$upgradeCount:
-        8
+        9
      values.EXIT_WINDOW_PERIOD:
+        864000
      values.SANCTION_EXPIRY_PERIOD:
+        259200
    }
```

## Source code changes

```diff
.../{.flat@619744 => .flat}/KintoID/KintoID.sol    | 38 ++++++++++++++++++----
 1 file changed, 32 insertions(+), 6 deletions(-)
```

Generated with discovered.json: 0x80336ac049b71f83160acf036068f4f3f1f599d7

# Diff at Tue, 10 Dec 2024 07:40:40 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@d01c69c8d162d3e9a035a25c270d68755988c138 block: 612370
- current block number: 619744

## Description

Config related: rediscover after beaconProxy detector fix.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 612370 (main branch discovery), not current.

```diff
    contract KintoWallet (0x25EA8c663BA8cCd79284B8c4001e7A245071885c) {
    +++ description: None
      sourceHashes.0:
-        "0x5dd932e70772b9520e522fd66660bc292a8fc07ff9f9bd8da3b7c0f0bf59c89d"
+        "0xc495bc47dd31384c345f3838b96e95d73efd25ded667a30651c10ca67e13a1b4"
    }
```

```diff
    contract KintoAdminMultisig (0x2e2B1c42E38f5af81771e65D87729E57ABD1337a) {
    +++ description: None
      values.owners:
-        ["0x660ad4B5A74130a4796B4d54BC6750Ae93C86e6c","0xc1f4D15C16A1f3555E0a5F7AeFD1e17AD4aaf40B","0x08E674c4538caE03B6c05405881dDCd95DcaF5a8","0x94561e98DD5E55271f91A103e4979aa6C493745E"]
    }
```

Generated with discovered.json: 0x62043f19ddff2ce218871d32e98be9601fbe58bb

# Diff at Mon, 09 Dec 2024 11:27:23 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@6e20c0da4ccb19e6a71427cc5601e1587d8abd35 block: 603429
- current block number: 612370

## Description

Provide description of changes. This section will be preserved.

## Watched changes

```diff
    contract KintoAdminMultisig (0x2e2B1c42E38f5af81771e65D87729E57ABD1337a) {
    +++ description: None
      values.getNonce:
-        3861
+        3866
    }
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 603429 (main branch discovery), not current.

```diff
    contract KintoWallet (0x25EA8c663BA8cCd79284B8c4001e7A245071885c) {
    +++ description: None
      name:
-        "SafeBeaconProxy"
+        "KintoWallet"
      sourceHashes.1:
+        "0x5dd932e70772b9520e522fd66660bc292a8fc07ff9f9bd8da3b7c0f0bf59c89d"
      sourceHashes.0:
-        "0xc495bc47dd31384c345f3838b96e95d73efd25ded667a30651c10ca67e13a1b4"
+        "0x5dd932e70772b9520e522fd66660bc292a8fc07ff9f9bd8da3b7c0f0bf59c89d"
      values.$immutable:
-        true
      values.$admin:
+        "0x8a4720488CA32f1223ccFE5A087e250fE3BC5D75"
      values.$beacon:
+        "0x87f0eE85bF3198654900a422832157abBba30828"
      values.$implementation:
+        "0xE90C1e020D9d2A74045A1365bd5abEe87Aee8D7C"
      values.$pastUpgrades:
+        [["2023-12-31T22:08:08.000Z","0xb93d5f824b37c9ebd53ba4173510c3ed01c8279fa77897f718287d99f45144d7",["0xd87FB0bF3c38f216bD1604bFa4d262F95409227d"]],["2024-01-10T02:11:16.000Z","0x5e85052f0f5dc2bb77766f70172c6b9ca9dabb294d82b7bfe123e252e0f4fc63",["0x893B0AeA9C45FA8d3b0FBbebd03d4220B9514599"]],["2024-01-23T21:33:14.000Z","0x414470a46d49f3adbea31b026b31ee0310bf5f14b6a047163b3ae2b2d1daee76",["0xAe84C7E23240Dc11f0B2711C20aEDE81E5a28fF2"]],["2024-02-01T19:03:14.000Z","0x29cfa97112038cf710734d93219a57f3b3f8a0dd6c9d1b630f57a4b3260c8515",["0x9dd64eA97fFFB2CbCd9ea87b9082250Be50FC820"]],["2024-02-15T06:48:10.000Z","0xe94e71b9178761f4e77efa1f8ac0db731607ee1efd75b8c68b632024edd26347",["0x5248F94285c737Cd088c4d25bd68D45AFA258039"]],["2024-04-29T23:39:05.000Z","0x1bb7899ea6179a8bda54a07440e97b26a8b1205ca5dda1d61d186a96cc53d91f",["0xA6ddF426008E8b7f1a70237bdEfafB5D928bA72E"]],["2024-05-21T16:36:47.000Z","0xf75350ce91b2f9ab01b40e12d4e304da06e3a98df9dbfff926221ece0658b021",["0xcF4046C914BB8E437ED07C6FD755f58f430C4DA6"]],["2024-05-22T17:18:33.000Z","0x85685091cfa0d5a4baf4cbd9c4b873ca99d0484464f052dfdd6d54894edd8822",["0xe761f7d13d6e6D70848fcD2E6bAc211db3741BA6"]],["2024-05-22T19:38:03.000Z","0xb8301be60b27d74a3cd93a176597b83d840390c34f35ed466f9c0b171904bf5d",["0xF75dAc825E27f1A146fbd5e18681892D5cbca9E8"]],["2024-05-22T21:32:50.000Z","0x7dbaf52bba314950632de04ce4b84c6e239be80b1c7eea61473275a3702d824e",["0x1d1E45adFA23457be2A595601F993d8826f11D38"]],["2024-05-22T22:41:49.000Z","0xd59013784f82e36b563318b2a47f8b59c77bea95ee539596d371752075b04f7a",["0xf411E206370B731D5461c6c70657aDC71F5aEF38"]],["2024-05-22T23:17:34.000Z","0x9a0a1e68a7096515886517da175cebb6bca1394817e4b82ef7a51a92854de83c",["0x43Ab055B44327EF3424b51e974960840d721e4D8"]],["2024-05-23T00:36:09.000Z","0x4534860f727b67344f7f32f4444e584b5bb32d5d34852903430558d31c8c618b",["0x421459c9af07ccCadf6BCA52319835c2Bfb117e2"]],["2024-05-24T01:55:24.000Z","0x76df358b38dd221b64d26546736753affa6a5f743664105039dd66e42c91a8f9",["0x8E495c2d6Be781Bd668632AA387e3e1027E80240"]],["2024-05-25T16:58:58.000Z","0x7b8edbfb7a264c7bffbd818550f03bf610667cffb50556cd235733a93c87b5c9",["0x3deAbC32b749b95Df9B125822cCb123757c4d4F1"]],["2024-05-27T16:35:38.000Z","0x2aefd6ad5ec2db239fc273701abac2b895adc967dab32ba0582a57b696421045",["0xa7040b6Ed2fC09C7485AA6A89fb2C320E2A739c3"]],["2024-05-28T22:53:09.000Z","0x02c94988c204753ed0c7179ee46543485e9aef832571a0bde46fc873565d546a",["0xe1FcA7f6d88E30914089b600A73eeF72eaC7f601"]],["2024-05-31T19:14:54.000Z","0x36c58600e88f27fe63c85880d83f4b59d3dcbdb452fc4d8c493f765f49140f7d",["0x3Ff8593329364dCDC7272fAcb853c8FeC2929B03"]],["2024-06-01T17:37:58.000Z","0xe143dd88482e3585729987aaa636c47880876963681707c71a7279a294331419",["0xa158e30099C6F7D9546eF2a519F2118E46039307"]],["2024-06-10T19:54:37.000Z","0xee90db98384f3683ab110b036f4b900b149d7b6c2d8822da09072200d66f5183",["0x2D669eB24988863aA0efA2D593DD40f174D8977B"]],["2024-06-12T16:20:50.000Z","0xed69774070322c707f1325542e505809f267ff84c27bf1f2b94acd6ef071a9d1",["0x5844A1629fC51439187093eDFd8bBD57109D858D"]],["2024-06-15T22:07:48.000Z","0x6307556dd70bee894ea0145fdc1e4f0044d7bedbd7ac3b25ae4b3b2d2a912ac5",["0xa54Fe8f99dBB9EB64d7c4E243F3c6aa5De0483Df"]],["2024-06-29T15:27:31.000Z","0x4b63dc55ffb56340d415484cb5215c8f35d05db8cab764b350872172ae75500d",["0xaF80B25F650A66F5F8e8bc67697C2160024b6Dcf"]],["2024-07-04T20:28:23.000Z","0x2fac94819bd2af509b2ee22403fa3dbf56e5e46a95582af8174977988cebf294",["0xB6026A3eB7ABee0fee3cAAb7BcfcBd6aDE5f0234"]],["2024-07-04T21:04:24.000Z","0x8025e20e6463f4b3ab05f653ce8d97db63d25ecce25caeee854f568b124e67ea",["0x39aB919098fE67f305d097d76Df0Ae04af5e640b"]],["2024-07-04T21:11:59.000Z","0x033e14c988ea46e1f6aa56bc4ce6e85c124cedeec4e1260f69add97f97a66286",["0xdDB14fAD9060afCA4FC5E1Ec108261B465Df285F"]],["2024-07-09T03:19:37.000Z","0xfa102b81f35df0137f5117f79fd9e2434e9b2479082542cfad69b888bf3924b4",["0x867969538512518e358b7b0296c4383f5bae4992"]],["2024-07-10T01:32:19.000Z","0xf7e3d8d5ddb65c6f03205fdf31223dcf00a488e884edd3f962478b3c56d230bb",["0xFF41064cC2cF1A76F4FD4f2235c766FDDFb7DCE1"]],["2024-07-10T22:25:46.000Z","0xad3511f1cc75cfff66e27ee41753037a9860686487b8226a16378e4cf599bb34",["0xC99D77eF43FCA9D491c1f5B900F74649236055C3"]],["2024-07-26T01:51:29.000Z","0xe8831f04c64c5900e29075426b477e5d859b6fc0df247e160200c941f8b2d265",["0xB15Fc6227FD696C7AD53d25a9fEE6c4831c27b16"]],["2024-08-27T16:05:25.000Z","0x2b935bf76847687fcd243758c04b4ab09489114b398400062a2f45a57ae64037",["0x667a0A293B6a95841dB5f0Bbf0F02e8e5F71C8e5"]],["2024-09-18T21:46:04.000Z","0x608c39049f980bfbbf9c7b906fe169958b276237fb9dad8ed8dedc600a168415",["0x1161a537aF45f4ca4AD984ECcf4a8E9692Bf2518"]],["2024-09-20T16:00:22.000Z","0xcebb2902d18cd8a441747fb71e60ffd3d7bee0a66e8f763901cda3f81ab06a4d",["0xE90C1e020D9d2A74045A1365bd5abEe87Aee8D7C"]]]
      values.$upgradeCount:
+        33
      values.ALL_SIGNERS:
+        3
      values.appRegistry:
+        "0x5A2b641b84b0230C8e75F55d5afd27f4Dbd59d5b"
      values.entryPoint:
+        "0x2843C269D2a64eCfA63548E8B3Fc0FD23B7F70cb"
      values.factory:
+        "0x8a4720488CA32f1223ccFE5A087e250fE3BC5D75"
      values.getAccessPoint:
+        "0xbd103754B3B4eD40BE01415c3c8F7f6A934Fe16a"
      values.getNonce:
+        217
      values.getOwners:
+        ["0x2B409E1Bb2164D6993d0189720a5A3cE8980B5c4","0x4181803232280371E02a875F51515BE57B215231"]
      values.getOwnersCount:
+        2
      values.inRecovery:
+        0
      values.insurancePolicy:
+        0
      values.insuranceTimestamp:
+        0
      values.kintoID:
+        "0xf369f78E3A0492CC4e96a90dae0728A38498e9c7"
      values.MAX_SIGNERS:
+        4
      values.MINUS_ONE_SIGNER:
+        2
      values.owners:
+        ["0x2B409E1Bb2164D6993d0189720a5A3cE8980B5c4","0x4181803232280371E02a875F51515BE57B215231"]
      values.recoverer:
+        "0xC8B7292CF52B8557d783561823EEE7BbdF55ef1C"
      values.RECOVERY_PRICE:
+        "5000000000000000000"
      values.RECOVERY_TIME:
+        604800
      values.signerPolicy:
+        2
      values.SINGLE_SIGNER:
+        1
      values.TWO_SIGNERS:
+        4
      values.WALLET_TARGET_LIMIT:
+        5
      proxyType:
+        "Beacon proxy"
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x8a4720488CA32f1223ccFE5A087e250fE3BC5D75","via":[]}]
    }
```

```diff
    contract KintoAdminMultisig (0x2e2B1c42E38f5af81771e65D87729E57ABD1337a) {
    +++ description: None
      sourceHashes.1:
+        "0x5dd932e70772b9520e522fd66660bc292a8fc07ff9f9bd8da3b7c0f0bf59c89d"
      values.$immutable:
-        true
      values.$admin:
+        "0x8a4720488CA32f1223ccFE5A087e250fE3BC5D75"
      values.$beacon:
+        "0x87f0eE85bF3198654900a422832157abBba30828"
      values.$implementation:
+        "0xE90C1e020D9d2A74045A1365bd5abEe87Aee8D7C"
      values.$pastUpgrades:
+        [["2023-12-31T22:08:08.000Z","0xb93d5f824b37c9ebd53ba4173510c3ed01c8279fa77897f718287d99f45144d7",["0xd87FB0bF3c38f216bD1604bFa4d262F95409227d"]],["2024-01-10T02:11:16.000Z","0x5e85052f0f5dc2bb77766f70172c6b9ca9dabb294d82b7bfe123e252e0f4fc63",["0x893B0AeA9C45FA8d3b0FBbebd03d4220B9514599"]],["2024-01-23T21:33:14.000Z","0x414470a46d49f3adbea31b026b31ee0310bf5f14b6a047163b3ae2b2d1daee76",["0xAe84C7E23240Dc11f0B2711C20aEDE81E5a28fF2"]],["2024-02-01T19:03:14.000Z","0x29cfa97112038cf710734d93219a57f3b3f8a0dd6c9d1b630f57a4b3260c8515",["0x9dd64eA97fFFB2CbCd9ea87b9082250Be50FC820"]],["2024-02-15T06:48:10.000Z","0xe94e71b9178761f4e77efa1f8ac0db731607ee1efd75b8c68b632024edd26347",["0x5248F94285c737Cd088c4d25bd68D45AFA258039"]],["2024-04-29T23:39:05.000Z","0x1bb7899ea6179a8bda54a07440e97b26a8b1205ca5dda1d61d186a96cc53d91f",["0xA6ddF426008E8b7f1a70237bdEfafB5D928bA72E"]],["2024-05-21T16:36:47.000Z","0xf75350ce91b2f9ab01b40e12d4e304da06e3a98df9dbfff926221ece0658b021",["0xcF4046C914BB8E437ED07C6FD755f58f430C4DA6"]],["2024-05-22T17:18:33.000Z","0x85685091cfa0d5a4baf4cbd9c4b873ca99d0484464f052dfdd6d54894edd8822",["0xe761f7d13d6e6D70848fcD2E6bAc211db3741BA6"]],["2024-05-22T19:38:03.000Z","0xb8301be60b27d74a3cd93a176597b83d840390c34f35ed466f9c0b171904bf5d",["0xF75dAc825E27f1A146fbd5e18681892D5cbca9E8"]],["2024-05-22T21:32:50.000Z","0x7dbaf52bba314950632de04ce4b84c6e239be80b1c7eea61473275a3702d824e",["0x1d1E45adFA23457be2A595601F993d8826f11D38"]],["2024-05-22T22:41:49.000Z","0xd59013784f82e36b563318b2a47f8b59c77bea95ee539596d371752075b04f7a",["0xf411E206370B731D5461c6c70657aDC71F5aEF38"]],["2024-05-22T23:17:34.000Z","0x9a0a1e68a7096515886517da175cebb6bca1394817e4b82ef7a51a92854de83c",["0x43Ab055B44327EF3424b51e974960840d721e4D8"]],["2024-05-23T00:36:09.000Z","0x4534860f727b67344f7f32f4444e584b5bb32d5d34852903430558d31c8c618b",["0x421459c9af07ccCadf6BCA52319835c2Bfb117e2"]],["2024-05-24T01:55:24.000Z","0x76df358b38dd221b64d26546736753affa6a5f743664105039dd66e42c91a8f9",["0x8E495c2d6Be781Bd668632AA387e3e1027E80240"]],["2024-05-25T16:58:58.000Z","0x7b8edbfb7a264c7bffbd818550f03bf610667cffb50556cd235733a93c87b5c9",["0x3deAbC32b749b95Df9B125822cCb123757c4d4F1"]],["2024-05-27T16:35:38.000Z","0x2aefd6ad5ec2db239fc273701abac2b895adc967dab32ba0582a57b696421045",["0xa7040b6Ed2fC09C7485AA6A89fb2C320E2A739c3"]],["2024-05-28T22:53:09.000Z","0x02c94988c204753ed0c7179ee46543485e9aef832571a0bde46fc873565d546a",["0xe1FcA7f6d88E30914089b600A73eeF72eaC7f601"]],["2024-05-31T19:14:54.000Z","0x36c58600e88f27fe63c85880d83f4b59d3dcbdb452fc4d8c493f765f49140f7d",["0x3Ff8593329364dCDC7272fAcb853c8FeC2929B03"]],["2024-06-01T17:37:58.000Z","0xe143dd88482e3585729987aaa636c47880876963681707c71a7279a294331419",["0xa158e30099C6F7D9546eF2a519F2118E46039307"]],["2024-06-10T19:54:37.000Z","0xee90db98384f3683ab110b036f4b900b149d7b6c2d8822da09072200d66f5183",["0x2D669eB24988863aA0efA2D593DD40f174D8977B"]],["2024-06-12T16:20:50.000Z","0xed69774070322c707f1325542e505809f267ff84c27bf1f2b94acd6ef071a9d1",["0x5844A1629fC51439187093eDFd8bBD57109D858D"]],["2024-06-15T22:07:48.000Z","0x6307556dd70bee894ea0145fdc1e4f0044d7bedbd7ac3b25ae4b3b2d2a912ac5",["0xa54Fe8f99dBB9EB64d7c4E243F3c6aa5De0483Df"]],["2024-06-29T15:27:31.000Z","0x4b63dc55ffb56340d415484cb5215c8f35d05db8cab764b350872172ae75500d",["0xaF80B25F650A66F5F8e8bc67697C2160024b6Dcf"]],["2024-07-04T20:28:23.000Z","0x2fac94819bd2af509b2ee22403fa3dbf56e5e46a95582af8174977988cebf294",["0xB6026A3eB7ABee0fee3cAAb7BcfcBd6aDE5f0234"]],["2024-07-04T21:04:24.000Z","0x8025e20e6463f4b3ab05f653ce8d97db63d25ecce25caeee854f568b124e67ea",["0x39aB919098fE67f305d097d76Df0Ae04af5e640b"]],["2024-07-04T21:11:59.000Z","0x033e14c988ea46e1f6aa56bc4ce6e85c124cedeec4e1260f69add97f97a66286",["0xdDB14fAD9060afCA4FC5E1Ec108261B465Df285F"]],["2024-07-09T03:19:37.000Z","0xfa102b81f35df0137f5117f79fd9e2434e9b2479082542cfad69b888bf3924b4",["0x867969538512518e358b7b0296c4383f5bae4992"]],["2024-07-10T01:32:19.000Z","0xf7e3d8d5ddb65c6f03205fdf31223dcf00a488e884edd3f962478b3c56d230bb",["0xFF41064cC2cF1A76F4FD4f2235c766FDDFb7DCE1"]],["2024-07-10T22:25:46.000Z","0xad3511f1cc75cfff66e27ee41753037a9860686487b8226a16378e4cf599bb34",["0xC99D77eF43FCA9D491c1f5B900F74649236055C3"]],["2024-07-26T01:51:29.000Z","0xe8831f04c64c5900e29075426b477e5d859b6fc0df247e160200c941f8b2d265",["0xB15Fc6227FD696C7AD53d25a9fEE6c4831c27b16"]],["2024-08-27T16:05:25.000Z","0x2b935bf76847687fcd243758c04b4ab09489114b398400062a2f45a57ae64037",["0x667a0A293B6a95841dB5f0Bbf0F02e8e5F71C8e5"]],["2024-09-18T21:46:04.000Z","0x608c39049f980bfbbf9c7b906fe169958b276237fb9dad8ed8dedc600a168415",["0x1161a537aF45f4ca4AD984ECcf4a8E9692Bf2518"]],["2024-09-20T16:00:22.000Z","0xcebb2902d18cd8a441747fb71e60ffd3d7bee0a66e8f763901cda3f81ab06a4d",["0xE90C1e020D9d2A74045A1365bd5abEe87Aee8D7C"]]]
      values.$upgradeCount:
+        33
      values.ALL_SIGNERS:
+        3
      values.appRegistry:
+        "0x5A2b641b84b0230C8e75F55d5afd27f4Dbd59d5b"
      values.entryPoint:
+        "0x2843C269D2a64eCfA63548E8B3Fc0FD23B7F70cb"
      values.factory:
+        "0x8a4720488CA32f1223ccFE5A087e250fE3BC5D75"
      values.getAccessPoint:
+        "0x474ec69B0fD5Ebc1EfcFe18B2E8Eb510D755b8C7"
      values.getNonce:
+        3861
      values.getOwners:
+        ["0x660ad4B5A74130a4796B4d54BC6750Ae93C86e6c","0xc1f4D15C16A1f3555E0a5F7AeFD1e17AD4aaf40B","0x08E674c4538caE03B6c05405881dDCd95DcaF5a8","0x94561e98DD5E55271f91A103e4979aa6C493745E"]
      values.getOwnersCount:
+        4
      values.inRecovery:
+        0
      values.insurancePolicy:
+        0
      values.insuranceTimestamp:
+        0
      values.kintoID:
+        "0xf369f78E3A0492CC4e96a90dae0728A38498e9c7"
      values.MAX_SIGNERS:
+        4
      values.MINUS_ONE_SIGNER:
+        2
      values.owners:
+        ["0x660ad4B5A74130a4796B4d54BC6750Ae93C86e6c","0xc1f4D15C16A1f3555E0a5F7AeFD1e17AD4aaf40B","0x08E674c4538caE03B6c05405881dDCd95DcaF5a8","0x94561e98DD5E55271f91A103e4979aa6C493745E"]
      values.recoverer:
+        "0xc1f4D15C16A1f3555E0a5F7AeFD1e17AD4aaf40B"
      values.RECOVERY_PRICE:
+        "5000000000000000000"
      values.RECOVERY_TIME:
+        604800
      values.signerPolicy:
+        4
      values.SINGLE_SIGNER:
+        1
      values.TWO_SIGNERS:
+        4
      values.WALLET_TARGET_LIMIT:
+        5
      proxyType:
+        "Beacon proxy"
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x8a4720488CA32f1223ccFE5A087e250fE3BC5D75","via":[]}]
    }
```

```diff
-   Status: DELETED
    contract KintoWalletBeacon (0x87f0eE85bF3198654900a422832157abBba30828)
    +++ description: None
```

```diff
    contract KintoWalletFactory (0x8a4720488CA32f1223ccFE5A087e250fE3BC5D75) {
    +++ description: None
      receivedPermissions:
+        [{"permission":"upgrade","target":"0x25EA8c663BA8cCd79284B8c4001e7A245071885c"},{"permission":"upgrade","target":"0x2e2B1c42E38f5af81771e65D87729E57ABD1337a"}]
    }
```

```diff
-   Status: DELETED
    contract KintoWalletBeacon_implemention (0xE90C1e020D9d2A74045A1365bd5abEe87Aee8D7C)
    +++ description: Implementation for all KintoWallets, managed by a beacon proxy.
```

Generated with discovered.json: 0x5ee6bca91da6a5a968b4ce0113c8e0afe8a8310a

# Diff at Sun, 08 Dec 2024 10:39:17 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@59fd7a30471906b5a479f280731621e94e22f17c block: 583311
- current block number: 603429

## Description

KintoID upgrade: Introduction of a per-account `sanctionedAt` timestamp that gets updated to the current timestamp with every new sanction by a KYC provider role. An account is 'sanctions safe' iff 1) the KYC providers were active onchain during the previous 7d (`isSanctionsMonitored(7)`) AND 2.1) the account was never sanctioned OR 2.2) the latest sanction against the account is more than 3d ago.

```
function isSanctionsSafe(address _account) public view virtual override returns (bool) {
        return isSanctionsMonitored(7)
            && (
                _kycmetas[_account].sanctionsCount == 0
                    || (sanctionedAt[_account] != 0 && (block.timestamp - sanctionedAt[_account]) > 3 days)
            );
    }
```
Any KYC provider that is malicious could re-sanction an account at will and the account would never meet the 3d limit to be un-sanctioned even if the SC never approves. Kinto agreed on telegram to introduce a 'cooldown period' of 10d after a sanction during which `sanctionedAt` cannot be updated to the latest TS.

KYC enforcement and upgrades summary:
1. The use of smartWallets is enforced by the STF and a custom wasmModuleRoot (the l2 node queries `KintoAppRegistry` for a whitelist, all contracts not on the whitelist cannot be called by an EOA, users can thus transact exclusively through the `KintoWallet`)
2. `KintoWallet` checks the `KintoID` contract for an `isKYC` flag on every transaction (on each signature verification). This flag requires `isSanctionsSafe` which is quoted above.
3. Since `isSanctionsSafe` is required for any user to transact on Kinto, a change in its state is considered an upgrade. 

We discussed that for a potential stage 1 Kinto, a sanction / censorship of a user can be made by a centralized KYC provider, but the sanction must be voided if not actively confirmed in a short time by the Kinto SecurityCouncil.

If you have read this far, please check out [my soundcloud](https://app.excalidraw.com/s/1Pobo8fNXle/3EeVcMQJj7N).

## Watched changes

```diff
    contract KintoID (0xf369f78E3A0492CC4e96a90dae0728A38498e9c7) {
    +++ description: Manages Kinto's KYC system: KYC provider addresses and the KYC status of users.
      sourceHashes.1:
-        "0x499e44fadd43278a5324045ee02ce20064caa49a1f75976a0d8492e2fd93efae"
+        "0x3fa7283c94fa2072438a07fb3069ce98694353a7a07f32585e2baa41a856fca9"
      values.$implementation:
-        "0xd3642f5CF57A5090F173294F68Df66583521FeA0"
+        "0x7CFe474936fA50181ae7c2C43EeB8806e25bc983"
      values.$pastUpgrades.7:
+        ["2024-12-06T21:43:59.000Z","0x393717142a85ed552e3d455cd886d11abe37095fa7f7be1dd1db7214a65a74dd",["0x7CFe474936fA50181ae7c2C43EeB8806e25bc983"]]
      values.$upgradeCount:
-        7
+        8
      values.accessControl.GOVERNANCE_ROLE:
+        {"adminRole":"DEFAULT_ADMIN_ROLE","members":["0x2e2B1c42E38f5af81771e65D87729E57ABD1337a","0x010600ff5f36C8eF3b6Aaf2A88C2DE85C798594a"]}
      values.GOVERNANCE_ROLE:
+        "0x71840dc4906352362b0cdaf79870196c8e42acafade72d5d5a6d59291253ceb1"
    }
```

## Source code changes

```diff
.../{.flat@583311 => .flat}/KintoID/KintoID.sol    | 278 +++++++++++++++------
 1 file changed, 208 insertions(+), 70 deletions(-)
```

Generated with discovered.json: 0x7062a13b9aa52460a1fcf602e585207c9ce7735d

# Diff at Thu, 05 Dec 2024 05:41:39 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@7dc480bf5499525d0b44afce03521538ecc8ec73 block: 542901
- current block number: 583311

## Description

AccessManager is set as upgrade admin and owner of KintoWalletFactory, KintoAppRegistry (was already upgrade admin and owner of the Treasury).

Added events monitoring for the AccessManager.

Waiting for KintoID (KYC management) logic to be deployed.

Small upgrade to the SponsorPaymaster: User smartwallet transactions are sponsored by the WalletFactory contract.

## Watched changes

```diff
    contract SponsorPaymaster (0x1842a4EFf3eFd24c50B63c3CF89cECEe245Fc2bd) {
    +++ description: None
      sourceHashes.1:
-        "0xf3ee249f14ba49d1740577f11741c5fa41c4f5a406a1abccd4b670a329159275"
+        "0x3bc0ef2f981a9321d8cdbbf6e48db5cbfd6ad378646bade7b2d035407cdd2684"
      values.$implementation:
-        "0xcbb3BA88bFD944860463585A557022fceE3Cc280"
+        "0x2A10b80bE8Ee546C52Fde9b58d65D089C6B929BB"
      values.$pastUpgrades.14:
+        ["2024-12-05T01:09:11.000Z","0x1a916af8dd468332c79abaf6546f4e990c99908a26ac4d0775c63b8eaf295603",["0x2A10b80bE8Ee546C52Fde9b58d65D089C6B929BB"]]
      values.$upgradeCount:
-        14
+        15
    }
```

```diff
    contract KintoAdminMultisig (0x2e2B1c42E38f5af81771e65D87729E57ABD1337a) {
    +++ description: None
      receivedPermissions.3:
-        {"permission":"upgrade","target":"0x8a4720488CA32f1223ccFE5A087e250fE3BC5D75"}
      receivedPermissions.2:
-        {"permission":"upgrade","target":"0x5A2b641b84b0230C8e75F55d5afd27f4Dbd59d5b"}
    }
```

```diff
    contract KintoAppRegistry (0x5A2b641b84b0230C8e75F55d5afd27f4Dbd59d5b) {
    +++ description: Central system contract defining addresses that are allowed to be called by EOAs. The modified Kinto node reads this configuration and drops all other transactions from EOAs. Accordingly, users can only transact from their smart wallets.
      issuedPermissions.0.target:
-        "0x2e2B1c42E38f5af81771e65D87729E57ABD1337a"
+        "0xacC000818e5Bbd911D5d449aA81CB5cA24024739"
      values.$admin:
-        "0x2e2B1c42E38f5af81771e65D87729E57ABD1337a"
+        "0xacC000818e5Bbd911D5d449aA81CB5cA24024739"
      values.owner:
-        "0x2e2B1c42E38f5af81771e65D87729E57ABD1337a"
+        "0xacC000818e5Bbd911D5d449aA81CB5cA24024739"
    }
```

```diff
    contract KintoWalletFactory (0x8a4720488CA32f1223ccFE5A087e250fE3BC5D75) {
    +++ description: None
      issuedPermissions.0.target:
-        "0x2e2B1c42E38f5af81771e65D87729E57ABD1337a"
+        "0xacC000818e5Bbd911D5d449aA81CB5cA24024739"
      values.$admin:
-        "0x2e2B1c42E38f5af81771e65D87729E57ABD1337a"
+        "0xacC000818e5Bbd911D5d449aA81CB5cA24024739"
      values.owner:
-        "0x2e2B1c42E38f5af81771e65D87729E57ABD1337a"
+        "0xacC000818e5Bbd911D5d449aA81CB5cA24024739"
    }
```

```diff
    contract AccessManager (0xacC000818e5Bbd911D5d449aA81CB5cA24024739) {
    +++ description: None
      receivedPermissions.2:
+        {"permission":"upgrade","target":"0x8a4720488CA32f1223ccFE5A087e250fE3BC5D75"}
      receivedPermissions.1:
+        {"permission":"upgrade","target":"0x793500709506652Fcc61F0d2D0fDa605638D4293"}
      receivedPermissions.0.target:
-        "0x793500709506652Fcc61F0d2D0fDa605638D4293"
+        "0x5A2b641b84b0230C8e75F55d5afd27f4Dbd59d5b"
      values.AdditionalRoles.1:
+        {"roleId":"8663528507529876195","label":"UPGRADER_ROLE"}
      values.RoleGrantDelayChanged.8663528507529876195:
+        {"roleId":"8663528507529876195","delay":604800,"since":1733613166}
      values.RolesGranted.8663528507529876195:
+        {"roleId":"8663528507529876195","account":"0x2e2B1c42E38f5af81771e65D87729E57ABD1337a","delay":604800,"since":1733181166,"newMember":true}
      values.TargetAdminDelayUpdated.0x8a4720488CA32f1223ccFE5A087e250fE3BC5D75:
+        {"target":"0x8a4720488CA32f1223ccFE5A087e250fE3BC5D75","delay":604800,"since":1733613166}
      values.TargetFunctionRoleUpdated.0x8a4720488CA32f1223ccFE5A087e250fE3BC5D75:
+        {"target":"0x8a4720488CA32f1223ccFE5A087e250fE3BC5D75","selector":"0x3659cfe6","roleId":"8663528507529876195"}
      values.TargetFunctionRoleUpdated.0x5A2b641b84b0230C8e75F55d5afd27f4Dbd59d5b:
+        {"target":"0x5A2b641b84b0230C8e75F55d5afd27f4Dbd59d5b","selector":"0x3659cfe6","roleId":"8663528507529876195"}
    }
```

## Source code changes

```diff
.../SponsorPaymaster/SponsorPaymaster.sol                    | 12 +++++++++++-
 1 file changed, 11 insertions(+), 1 deletion(-)
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 542901 (main branch discovery), not current.

```diff
    contract AccessManager (0xacC000818e5Bbd911D5d449aA81CB5cA24024739) {
    +++ description: None
      values.AdditionalRoles:
+        [{"roleId":"1635978423191113331","label":"NIO_GOVERNOR_ROLE"}]
+++ severity: HIGH
      values.OperationScheduled:
+        []
      values.RoleAdminChanged:
+        {}
      values.RoleGrantDelayChanged:
+        {}
      values.RoleGuardianChanged:
+        {}
      values.RolesGranted:
+        {"0":{"roleId":0,"account":"0x2e2B1c42E38f5af81771e65D87729E57ABD1337a","delay":0,"since":1729791296,"newMember":true},"1635978423191113331":{"roleId":"1635978423191113331","account":"0x010600ff5f36C8eF3b6Aaf2A88C2DE85C798594a","delay":259200,"since":1729806574,"newMember":true}}
      values.TargetAdminDelayUpdated:
+        {}
      values.TargetFunctionRoleUpdated:
+        {"0x793500709506652Fcc61F0d2D0fDa605638D4293":{"target":"0x793500709506652Fcc61F0d2D0fDa605638D4293","selector":"0x9089e8ae","roleId":"1635978423191113331"}}
      fieldMeta:
+        {"OperationScheduled":{"severity":"HIGH"}}
    }
```

```diff
+   Status: CREATED
    contract NioGuardians (0x0100005D52Be9ab3ccE0C70Abf6F6FA2C48e91C9)
    +++ description: None
```

```diff
+   Status: CREATED
    contract NioGovernor (0x010600ff5f36C8eF3b6Aaf2A88C2DE85C798594a)
    +++ description: None
```

Generated with discovered.json: 0xb60a112bf4be962e2af34170e8ef65a733fbc8be

# Diff at Thu, 28 Nov 2024 12:52:13 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- current block number: 542592

## Description

Initial discovery for Kinto on Kinto: Focusing on the AppRegistry, KintoID and 'KintoWallet' smartwallet.

## Initial discovery

```diff
+   Status: CREATED
    contract BridgedKinto (0x010700808D59d2bb92257fCafACfe8e5bFF7aB87)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Faucet (0x0719D47A213149E2Ef8d3f5afDaDA8a8E22dfc03)
    +++ description: None
```

```diff
+   Status: CREATED
    contract SponsorPaymaster (0x1842a4EFf3eFd24c50B63c3CF89cECEe245Fc2bd)
    +++ description: None
```

```diff
+   Status: CREATED
    contract SafeBeaconProxy (0x25EA8c663BA8cCd79284B8c4001e7A245071885c)
    +++ description: None
```

```diff
+   Status: CREATED
    contract EntryPoint (0x2843C269D2a64eCfA63548E8B3Fc0FD23B7F70cb)
    +++ description: None
```

```diff
+   Status: CREATED
    contract KintoAdminMultisig (0x2e2B1c42E38f5af81771e65D87729E57ABD1337a)
    +++ description: None
```

```diff
+   Status: CREATED
    contract L2GatewayRouter (0x340487b92808B84c2bd97C87B590EE81267E04a7)
    +++ description: None
```

```diff
+   Status: CREATED
    contract  (0x35B1Ca86D564e69FA38Ee456C12c78A62e78Aa4c)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Socket (0x3e9727470C66B1e77034590926CDe0242B5A3dCc)
    +++ description: None
```

```diff
+   Status: CREATED
    contract  (0x56Ac0e336f0c3620dCaF8d361E8E14eA73C31f5d)
    +++ description: None
```

```diff
+   Status: CREATED
    contract KintoAppRegistry (0x5A2b641b84b0230C8e75F55d5afd27f4Dbd59d5b)
    +++ description: Central system contract defining addresses that are allowed to be called by EOAs. The modified Kinto node reads this configuration and drops all other transactions from EOAs. Accordingly, users can only transact from their smart wallets.
```

```diff
+   Status: CREATED
    contract  (0x6332e56A423480A211E301Cb85be12814e9238Bb)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Treasury (0x793500709506652Fcc61F0d2D0fDa605638D4293)
    +++ description: None
```

```diff
+   Status: CREATED
    contract  (0x87799989341A07F495287B1433eea98398FD73aA)
    +++ description: None
```

```diff
+   Status: CREATED
    contract KintoWalletBeacon (0x87f0eE85bF3198654900a422832157abBba30828)
    +++ description: None
```

```diff
+   Status: CREATED
    contract  (0x88e03D41a6EAA9A0B93B0e2d6F1B34619cC4319b)
    +++ description: None
```

```diff
+   Status: CREATED
    contract KintoWalletFactory (0x8a4720488CA32f1223ccFE5A087e250fE3BC5D75)
    +++ description: None
```

```diff
+   Status: CREATED
    contract BundleBulker (0x8d2D899402ed84b6c0510bB1ad34ee436ADDD20d)
    +++ description: None
```

```diff
+   Status: CREATED
    contract  (0x9652Dd5e1388CA80712470122F27be0d1c33B48b)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ProxyAdmin (0x9eC0253E4174a14C0536261888416451A407Bf79)
    +++ description: None
```

```diff
+   Status: CREATED
    contract AccessManager (0xacC000818e5Bbd911D5d449aA81CB5cA24024739)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ExecutionManagerDF (0xc8a4D2fd77c155fd52e65Ab07F337aBF84495Ead)
    +++ description: None
```

```diff
+   Status: CREATED
    contract RewardsDistributor (0xD157904639E89df05e89e0DabeEC99aE3d74F9AA)
    +++ description: None
```

```diff
+   Status: CREATED
    contract KintoWalletBeacon_implemention (0xE90C1e020D9d2A74045A1365bd5abEe87Aee8D7C)
    +++ description: Implementation for all KintoWallets, managed by a beacon proxy.
```

```diff
+   Status: CREATED
    contract KintoID (0xf369f78E3A0492CC4e96a90dae0728A38498e9c7)
    +++ description: Manages Kinto's KYC system: KYC provider addresses and the KYC status of users.
```
