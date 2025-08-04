Generated with discovered.json: 0x1145cf7c0936dec8971aeea55e3e453ab784d916

# Diff at Mon, 14 Jul 2025 13:11:49 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@9f4300dad2f3d080cd56fa311d4a848556c74e72 block: 350981738
- current block number: 350981738

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 350981738 (main branch discovery), not current.

```diff
    EOA  (0x01a0A7BaAAca31AFB5b770FeFD69CE4917D9c32e) {
    +++ description: None
      address:
-        "0x01a0A7BaAAca31AFB5b770FeFD69CE4917D9c32e"
+        "arb1:0x01a0A7BaAAca31AFB5b770FeFD69CE4917D9c32e"
    }
```

```diff
    contract ChallengeManager (0x14dBe58192B60b5207b86c751255B34550Bd12Fb) {
    +++ description: Contract that allows challenging state roots. Can be called through the RollupProxy by Validators or the UpgradeExecutor.
      address:
-        "0x14dBe58192B60b5207b86c751255B34550Bd12Fb"
+        "arb1:0x14dBe58192B60b5207b86c751255B34550Bd12Fb"
      values.$admin:
-        "0x79daC9c2deC3E4411a2cB2b0ecf654D27a4AFf0A"
+        "arb1:0x79daC9c2deC3E4411a2cB2b0ecf654D27a4AFf0A"
      values.$implementation:
-        "0x5AA806015FEC88669bF7DAd746BB4ADC1E79BcED"
+        "arb1:0x5AA806015FEC88669bF7DAd746BB4ADC1E79BcED"
      values.$pastUpgrades.0.2.0:
-        "0x5cA988F213EfbCB86ED7e2AACB0C15c91e648f8d"
+        "arb1:0x5cA988F213EfbCB86ED7e2AACB0C15c91e648f8d"
      values.$pastUpgrades.1.2.0:
-        "0x5AA806015FEC88669bF7DAd746BB4ADC1E79BcED"
+        "arb1:0x5AA806015FEC88669bF7DAd746BB4ADC1E79BcED"
      values.bridge:
-        "0x2F12c50b46adB01a4961AdDa5038c0974C7C78e8"
+        "arb1:0x2F12c50b46adB01a4961AdDa5038c0974C7C78e8"
      values.osp:
-        "0xD89d54007079071cBA859127318b9F34eeB78049"
+        "arb1:0xD89d54007079071cBA859127318b9F34eeB78049"
      values.resultReceiver:
-        "0xBaE3B462a2A7fb758F66D91170514C10B14Ce914"
+        "arb1:0xBaE3B462a2A7fb758F66D91170514C10B14Ce914"
      values.sequencerInbox:
-        "0xA3464bf0ed52cFe6676D3e34ab1F4DF53f193631"
+        "arb1:0xA3464bf0ed52cFe6676D3e34ab1F4DF53f193631"
      implementationNames.0x14dBe58192B60b5207b86c751255B34550Bd12Fb:
-        "TransparentUpgradeableProxy"
      implementationNames.0x5AA806015FEC88669bF7DAd746BB4ADC1E79BcED:
-        "ChallengeManager"
      implementationNames.arb1:0x14dBe58192B60b5207b86c751255B34550Bd12Fb:
+        "TransparentUpgradeableProxy"
      implementationNames.arb1:0x5AA806015FEC88669bF7DAd746BB4ADC1E79BcED:
+        "ChallengeManager"
    }
```

```diff
    EOA  (0x28bB9385A588EF4747264D19B9A9F1603591680c) {
    +++ description: None
      address:
-        "0x28bB9385A588EF4747264D19B9A9F1603591680c"
+        "arb1:0x28bB9385A588EF4747264D19B9A9F1603591680c"
    }
```

```diff
    contract Bridge (0x2F12c50b46adB01a4961AdDa5038c0974C7C78e8) {
    +++ description: Escrow contract for the project's gas token (can be different from ETH). Keeps a list of allowed Inboxes and Outboxes for canonical bridge messaging.
      address:
-        "0x2F12c50b46adB01a4961AdDa5038c0974C7C78e8"
+        "arb1:0x2F12c50b46adB01a4961AdDa5038c0974C7C78e8"
      values.$admin:
-        "0x79daC9c2deC3E4411a2cB2b0ecf654D27a4AFf0A"
+        "arb1:0x79daC9c2deC3E4411a2cB2b0ecf654D27a4AFf0A"
      values.$implementation:
-        "0xdF0eaCC3F37356DF320e5B5db16C7eD7A6b596dd"
+        "arb1:0xdF0eaCC3F37356DF320e5B5db16C7eD7A6b596dd"
      values.$pastUpgrades.0.2.0:
-        "0x2a6DD4433ffa96dc1755814FC0d9cc83A5F68DeC"
+        "arb1:0x2a6DD4433ffa96dc1755814FC0d9cc83A5F68DeC"
      values.$pastUpgrades.1.2.0:
-        "0xdF0eaCC3F37356DF320e5B5db16C7eD7A6b596dd"
+        "arb1:0xdF0eaCC3F37356DF320e5B5db16C7eD7A6b596dd"
      values.activeOutbox:
-        "0x0000000000000000000000000000000000000000"
+        "arb1:0x0000000000000000000000000000000000000000"
+++ description: Allowed to mint the gastoken on L2 and call `enqueueDelayedMessage()` on the bridge.
+++ severity: HIGH
      values.allowedDelayedInboxList.0:
-        "0x590044e628ea1B9C10a86738Cf7a7eeF52D031B8"
+        "arb1:0x590044e628ea1B9C10a86738Cf7a7eeF52D031B8"
+++ description: Allowed to mint the gastoken on L2 and call `enqueueDelayedMessage()` on the bridge.
+++ severity: HIGH
      values.allowedDelayedInboxList.1:
-        "0xD36cd2624a7187ED41ec30FC1d6E6B7b3abAf251"
+        "arb1:0xD36cd2624a7187ED41ec30FC1d6E6B7b3abAf251"
+++ description: Can make calls as the bridge, steal all funds.
+++ severity: HIGH
      values.allowedOutboxList.0:
-        "0x6339965Cb3002f5c746895e4eD895bd775dbfdf9"
+        "arb1:0x6339965Cb3002f5c746895e4eD895bd775dbfdf9"
+++ description: All Inboxes that were ever set as allowed in the bridge.
+++ severity: HIGH
      values.inboxHistory.0:
-        "0x590044e628ea1B9C10a86738Cf7a7eeF52D031B8"
+        "arb1:0x590044e628ea1B9C10a86738Cf7a7eeF52D031B8"
+++ description: All Inboxes that were ever set as allowed in the bridge.
+++ severity: HIGH
      values.inboxHistory.1:
-        "0xD36cd2624a7187ED41ec30FC1d6E6B7b3abAf251"
+        "arb1:0xD36cd2624a7187ED41ec30FC1d6E6B7b3abAf251"
      values.nativeToken:
-        "0xf8173a39c56a554837C4C7f104153A005D284D11"
+        "arb1:0xf8173a39c56a554837C4C7f104153A005D284D11"
+++ description: All Outboxes that were ever set as allowed in the bridge.
+++ severity: HIGH
      values.outboxHistory.0:
-        "0x6339965Cb3002f5c746895e4eD895bd775dbfdf9"
+        "arb1:0x6339965Cb3002f5c746895e4eD895bd775dbfdf9"
      values.rollup:
-        "0xBaE3B462a2A7fb758F66D91170514C10B14Ce914"
+        "arb1:0xBaE3B462a2A7fb758F66D91170514C10B14Ce914"
      values.sequencerInbox:
-        "0xA3464bf0ed52cFe6676D3e34ab1F4DF53f193631"
+        "arb1:0xA3464bf0ed52cFe6676D3e34ab1F4DF53f193631"
      implementationNames.0x2F12c50b46adB01a4961AdDa5038c0974C7C78e8:
-        "TransparentUpgradeableProxy"
      implementationNames.0xdF0eaCC3F37356DF320e5B5db16C7eD7A6b596dd:
-        "ERC20Bridge"
      implementationNames.arb1:0x2F12c50b46adB01a4961AdDa5038c0974C7C78e8:
+        "TransparentUpgradeableProxy"
      implementationNames.arb1:0xdF0eaCC3F37356DF320e5B5db16C7eD7A6b596dd:
+        "ERC20Bridge"
    }
```

```diff
    contract OneStepProverHostIo (0x33c1514Bf90e202d242C299b37C60f908aa206D4) {
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
      address:
-        "0x33c1514Bf90e202d242C299b37C60f908aa206D4"
+        "arb1:0x33c1514Bf90e202d242C299b37C60f908aa206D4"
      implementationNames.0x33c1514Bf90e202d242C299b37C60f908aa206D4:
-        "OneStepProverHostIo"
      implementationNames.arb1:0x33c1514Bf90e202d242C299b37C60f908aa206D4:
+        "OneStepProverHostIo"
    }
```

```diff
    EOA  (0x349f3839012DB2271e1BeC68F1668471D175Adb9) {
    +++ description: None
      address:
-        "0x349f3839012DB2271e1BeC68F1668471D175Adb9"
+        "arb1:0x349f3839012DB2271e1BeC68F1668471D175Adb9"
    }
```

```diff
    contract ERC20Gateway (0x419e439e5c0B839d6e31d7C438939EEE1A4f4184) {
    +++ description: Escrows deposited ERC-20 assets for the canonical Bridge. Upon depositing, a generic token representation will be minted at the destination. Withdrawals are initiated by the Outbox contract.
      address:
-        "0x419e439e5c0B839d6e31d7C438939EEE1A4f4184"
+        "arb1:0x419e439e5c0B839d6e31d7C438939EEE1A4f4184"
      values.$admin:
-        "0x79daC9c2deC3E4411a2cB2b0ecf654D27a4AFf0A"
+        "arb1:0x79daC9c2deC3E4411a2cB2b0ecf654D27a4AFf0A"
      values.$implementation:
-        "0x8b73Ef238ADaB31EBC7c05423d243c345241a22f"
+        "arb1:0x8b73Ef238ADaB31EBC7c05423d243c345241a22f"
      values.$pastUpgrades.0.2.0:
-        "0x8b73Ef238ADaB31EBC7c05423d243c345241a22f"
+        "arb1:0x8b73Ef238ADaB31EBC7c05423d243c345241a22f"
      values.counterpartGateway:
-        "0x9E8f79EE5177aBDd76EDfC7D72c8Dc0F16955ae3"
+        "arb1:0x9E8f79EE5177aBDd76EDfC7D72c8Dc0F16955ae3"
      values.inbox:
-        "0x590044e628ea1B9C10a86738Cf7a7eeF52D031B8"
+        "arb1:0x590044e628ea1B9C10a86738Cf7a7eeF52D031B8"
      values.l2BeaconProxyFactory:
-        "0x44c0da87e4443F275503aB429bEE40fe265b59AF"
+        "arb1:0x44c0da87e4443F275503aB429bEE40fe265b59AF"
      values.router:
-        "0xDa4ac9E9cB8Af8afBB2Df1ffe7b82efEA17ba0f6"
+        "arb1:0xDa4ac9E9cB8Af8afBB2Df1ffe7b82efEA17ba0f6"
      values.whitelist:
-        "0x0000000000000000000000000000000000000000"
+        "arb1:0x0000000000000000000000000000000000000000"
      implementationNames.0x419e439e5c0B839d6e31d7C438939EEE1A4f4184:
-        "TransparentUpgradeableProxy"
      implementationNames.0x8b73Ef238ADaB31EBC7c05423d243c345241a22f:
-        "L1OrbitERC20Gateway"
      implementationNames.arb1:0x419e439e5c0B839d6e31d7C438939EEE1A4f4184:
+        "TransparentUpgradeableProxy"
      implementationNames.arb1:0x8b73Ef238ADaB31EBC7c05423d243c345241a22f:
+        "L1OrbitERC20Gateway"
    }
```

```diff
    EOA  (0x44c0da87e4443F275503aB429bEE40fe265b59AF) {
    +++ description: None
      address:
-        "0x44c0da87e4443F275503aB429bEE40fe265b59AF"
+        "arb1:0x44c0da87e4443F275503aB429bEE40fe265b59AF"
    }
```

```diff
    EOA  (0x547D0F472309e4239b296D01e03bEDc101241a26) {
    +++ description: None
      address:
-        "0x547D0F472309e4239b296D01e03bEDc101241a26"
+        "arb1:0x547D0F472309e4239b296D01e03bEDc101241a26"
    }
```

```diff
    contract OneStepProver0 (0x54E0923782b701044444De5d8c3A45aC890b0881) {
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
      address:
-        "0x54E0923782b701044444De5d8c3A45aC890b0881"
+        "arb1:0x54E0923782b701044444De5d8c3A45aC890b0881"
      implementationNames.0x54E0923782b701044444De5d8c3A45aC890b0881:
-        "OneStepProver0"
      implementationNames.arb1:0x54E0923782b701044444De5d8c3A45aC890b0881:
+        "OneStepProver0"
    }
```

```diff
    contract Inbox (0x590044e628ea1B9C10a86738Cf7a7eeF52D031B8) {
    +++ description: Facilitates sending L1 to L2 messages like depositing ETH, but does not escrow funds.
      address:
-        "0x590044e628ea1B9C10a86738Cf7a7eeF52D031B8"
+        "arb1:0x590044e628ea1B9C10a86738Cf7a7eeF52D031B8"
      values.$admin:
-        "0x79daC9c2deC3E4411a2cB2b0ecf654D27a4AFf0A"
+        "arb1:0x79daC9c2deC3E4411a2cB2b0ecf654D27a4AFf0A"
      values.$implementation:
-        "0xD87f160f8c414d834cBDd9477c3D8c3ad1802255"
+        "arb1:0xD87f160f8c414d834cBDd9477c3D8c3ad1802255"
      values.$pastUpgrades.0.2.0:
-        "0x7EfcB76D0e2E776A298aAa603d433336e5F8b6ab"
+        "arb1:0x7EfcB76D0e2E776A298aAa603d433336e5F8b6ab"
      values.$pastUpgrades.1.2.0:
-        "0xD87f160f8c414d834cBDd9477c3D8c3ad1802255"
+        "arb1:0xD87f160f8c414d834cBDd9477c3D8c3ad1802255"
      values.bridge:
-        "0x2F12c50b46adB01a4961AdDa5038c0974C7C78e8"
+        "arb1:0x2F12c50b46adB01a4961AdDa5038c0974C7C78e8"
      values.getProxyAdmin:
-        "0x79daC9c2deC3E4411a2cB2b0ecf654D27a4AFf0A"
+        "arb1:0x79daC9c2deC3E4411a2cB2b0ecf654D27a4AFf0A"
      values.sequencerInbox:
-        "0xA3464bf0ed52cFe6676D3e34ab1F4DF53f193631"
+        "arb1:0xA3464bf0ed52cFe6676D3e34ab1F4DF53f193631"
      implementationNames.0x590044e628ea1B9C10a86738Cf7a7eeF52D031B8:
-        "TransparentUpgradeableProxy"
      implementationNames.0xD87f160f8c414d834cBDd9477c3D8c3ad1802255:
-        "ERC20Inbox"
      implementationNames.arb1:0x590044e628ea1B9C10a86738Cf7a7eeF52D031B8:
+        "TransparentUpgradeableProxy"
      implementationNames.arb1:0xD87f160f8c414d834cBDd9477c3D8c3ad1802255:
+        "ERC20Inbox"
    }
```

```diff
    EOA  (0x5bE3E96Cdc3A97628bD7308d3588B9a474F4A54d) {
    +++ description: None
      address:
-        "0x5bE3E96Cdc3A97628bD7308d3588B9a474F4A54d"
+        "arb1:0x5bE3E96Cdc3A97628bD7308d3588B9a474F4A54d"
    }
```

```diff
    contract Outbox (0x6339965Cb3002f5c746895e4eD895bd775dbfdf9) {
    +++ description: Facilitates L2 to L1 contract calls: Messages initiated from L2 (for example withdrawal messages) eventually resolve in execution on L1.
      address:
-        "0x6339965Cb3002f5c746895e4eD895bd775dbfdf9"
+        "arb1:0x6339965Cb3002f5c746895e4eD895bd775dbfdf9"
      values.$admin:
-        "0x79daC9c2deC3E4411a2cB2b0ecf654D27a4AFf0A"
+        "arb1:0x79daC9c2deC3E4411a2cB2b0ecf654D27a4AFf0A"
      values.$implementation:
-        "0x302275067251F5FcdB9359Bda735fD8f7A4A54c0"
+        "arb1:0x302275067251F5FcdB9359Bda735fD8f7A4A54c0"
      values.$pastUpgrades.0.2.0:
-        "0x302275067251F5FcdB9359Bda735fD8f7A4A54c0"
+        "arb1:0x302275067251F5FcdB9359Bda735fD8f7A4A54c0"
      values.bridge:
-        "0x2F12c50b46adB01a4961AdDa5038c0974C7C78e8"
+        "arb1:0x2F12c50b46adB01a4961AdDa5038c0974C7C78e8"
      values.l2ToL1Sender:
-        "0x0000000000000000000000000000000000000000"
+        "arb1:0x0000000000000000000000000000000000000000"
      values.rollup:
-        "0xBaE3B462a2A7fb758F66D91170514C10B14Ce914"
+        "arb1:0xBaE3B462a2A7fb758F66D91170514C10B14Ce914"
      implementationNames.0x6339965Cb3002f5c746895e4eD895bd775dbfdf9:
-        "TransparentUpgradeableProxy"
      implementationNames.0x302275067251F5FcdB9359Bda735fD8f7A4A54c0:
-        "ERC20Outbox"
      implementationNames.arb1:0x6339965Cb3002f5c746895e4eD895bd775dbfdf9:
+        "TransparentUpgradeableProxy"
      implementationNames.arb1:0x302275067251F5FcdB9359Bda735fD8f7A4A54c0:
+        "ERC20Outbox"
    }
```

```diff
    EOA  (0x691C2EF68e25E620fa6cAdE2728f6aE34F37aAD2) {
    +++ description: None
      address:
-        "0x691C2EF68e25E620fa6cAdE2728f6aE34F37aAD2"
+        "arb1:0x691C2EF68e25E620fa6cAdE2728f6aE34F37aAD2"
    }
```

```diff
    contract ValidatorUtils (0x6c21303F5986180B1394d2C89f3e883890E2867b) {
    +++ description: This contract implements view only utilities for validators.
      address:
-        "0x6c21303F5986180B1394d2C89f3e883890E2867b"
+        "arb1:0x6c21303F5986180B1394d2C89f3e883890E2867b"
      implementationNames.0x6c21303F5986180B1394d2C89f3e883890E2867b:
-        "ValidatorUtils"
      implementationNames.arb1:0x6c21303F5986180B1394d2C89f3e883890E2867b:
+        "ValidatorUtils"
    }
```

```diff
    contract ProxyAdmin (0x79daC9c2deC3E4411a2cB2b0ecf654D27a4AFf0A) {
    +++ description: None
      address:
-        "0x79daC9c2deC3E4411a2cB2b0ecf654D27a4AFf0A"
+        "arb1:0x79daC9c2deC3E4411a2cB2b0ecf654D27a4AFf0A"
      values.owner:
-        "0x9132151475ACCf0662C545Bc81FbC1741d978EE0"
+        "arb1:0x9132151475ACCf0662C545Bc81FbC1741d978EE0"
      implementationNames.0x79daC9c2deC3E4411a2cB2b0ecf654D27a4AFf0A:
-        "ProxyAdmin"
      implementationNames.arb1:0x79daC9c2deC3E4411a2cB2b0ecf654D27a4AFf0A:
+        "ProxyAdmin"
    }
```

```diff
    EOA  (0x88De44422E1b1c30bc530c35aEdb9f5aD0e6fD52) {
    +++ description: None
      address:
-        "0x88De44422E1b1c30bc530c35aEdb9f5aD0e6fD52"
+        "arb1:0x88De44422E1b1c30bc530c35aEdb9f5aD0e6fD52"
    }
```

```diff
    contract UpgradeExecutor (0x9132151475ACCf0662C545Bc81FbC1741d978EE0) {
    +++ description: Central contract defining the access control permissions for upgrading the system contract implementations.
      address:
-        "0x9132151475ACCf0662C545Bc81FbC1741d978EE0"
+        "arb1:0x9132151475ACCf0662C545Bc81FbC1741d978EE0"
      values.$admin:
-        "0x79daC9c2deC3E4411a2cB2b0ecf654D27a4AFf0A"
+        "arb1:0x79daC9c2deC3E4411a2cB2b0ecf654D27a4AFf0A"
      values.$implementation:
-        "0x660ea1675F7323dC3Ba0c8dDFB593225Eb01E3C1"
+        "arb1:0x660ea1675F7323dC3Ba0c8dDFB593225Eb01E3C1"
      values.$pastUpgrades.0.2.0:
-        "0x660ea1675F7323dC3Ba0c8dDFB593225Eb01E3C1"
+        "arb1:0x660ea1675F7323dC3Ba0c8dDFB593225Eb01E3C1"
      values.accessControl.ADMIN_ROLE.members.0:
-        "0x9132151475ACCf0662C545Bc81FbC1741d978EE0"
+        "arb1:0x9132151475ACCf0662C545Bc81FbC1741d978EE0"
      values.accessControl.EXECUTOR_ROLE.members.0:
-        "0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb"
+        "arb1:0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb"
      values.executors.0:
-        "0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb"
+        "arb1:0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb"
      implementationNames.0x9132151475ACCf0662C545Bc81FbC1741d978EE0:
-        "TransparentUpgradeableProxy"
      implementationNames.0x660ea1675F7323dC3Ba0c8dDFB593225Eb01E3C1:
-        "UpgradeExecutor"
      implementationNames.arb1:0x9132151475ACCf0662C545Bc81FbC1741d978EE0:
+        "TransparentUpgradeableProxy"
      implementationNames.arb1:0x660ea1675F7323dC3Ba0c8dDFB593225Eb01E3C1:
+        "UpgradeExecutor"
    }
```

```diff
    EOA  (0x9E8f79EE5177aBDd76EDfC7D72c8Dc0F16955ae3) {
    +++ description: None
      address:
-        "0x9E8f79EE5177aBDd76EDfC7D72c8Dc0F16955ae3"
+        "arb1:0x9E8f79EE5177aBDd76EDfC7D72c8Dc0F16955ae3"
    }
```

```diff
    contract SequencerInbox (0xA3464bf0ed52cFe6676D3e34ab1F4DF53f193631) {
    +++ description: A sequencer (registered in this contract) can submit transaction batches or commitments here.
      address:
-        "0xA3464bf0ed52cFe6676D3e34ab1F4DF53f193631"
+        "arb1:0xA3464bf0ed52cFe6676D3e34ab1F4DF53f193631"
      values.$admin:
-        "0x79daC9c2deC3E4411a2cB2b0ecf654D27a4AFf0A"
+        "arb1:0x79daC9c2deC3E4411a2cB2b0ecf654D27a4AFf0A"
      values.$implementation:
-        "0x7be08B013de2b23a6329De51C4994f841dcE1a10"
+        "arb1:0x7be08B013de2b23a6329De51C4994f841dcE1a10"
      values.$pastUpgrades.0.2.0:
-        "0x7a299aD29499736994Aa3a9aFa3f476445FAEB2c"
+        "arb1:0x7a299aD29499736994Aa3a9aFa3f476445FAEB2c"
      values.$pastUpgrades.1.2.0:
-        "0x7be08B013de2b23a6329De51C4994f841dcE1a10"
+        "arb1:0x7be08B013de2b23a6329De51C4994f841dcE1a10"
      values.batchPosterManager:
-        "0x0000000000000000000000000000000000000000"
+        "arb1:0x0000000000000000000000000000000000000000"
      values.batchPosters.0:
-        "0xeA64C25e6Ea873D5cffb045b80BEc605ABE06647"
+        "arb1:0xeA64C25e6Ea873D5cffb045b80BEc605ABE06647"
      values.bridge:
-        "0x2F12c50b46adB01a4961AdDa5038c0974C7C78e8"
+        "arb1:0x2F12c50b46adB01a4961AdDa5038c0974C7C78e8"
      values.reader4844:
-        "0x0000000000000000000000000000000000000000"
+        "arb1:0x0000000000000000000000000000000000000000"
      values.rollup:
-        "0xBaE3B462a2A7fb758F66D91170514C10B14Ce914"
+        "arb1:0xBaE3B462a2A7fb758F66D91170514C10B14Ce914"
      implementationNames.0xA3464bf0ed52cFe6676D3e34ab1F4DF53f193631:
-        "TransparentUpgradeableProxy"
      implementationNames.0x7be08B013de2b23a6329De51C4994f841dcE1a10:
-        "SequencerInbox"
      implementationNames.arb1:0xA3464bf0ed52cFe6676D3e34ab1F4DF53f193631:
+        "TransparentUpgradeableProxy"
      implementationNames.arb1:0x7be08B013de2b23a6329De51C4994f841dcE1a10:
+        "SequencerInbox"
    }
```

```diff
    EOA  (0xA9f18587F6dE8B1c89a4AdD2c953AB66eD532015) {
    +++ description: None
      address:
-        "0xA9f18587F6dE8B1c89a4AdD2c953AB66eD532015"
+        "arb1:0xA9f18587F6dE8B1c89a4AdD2c953AB66eD532015"
    }
```

```diff
    EOA  (0xB65540bBA534E88EB4a5062D0E6519C07063b259) {
    +++ description: None
      address:
-        "0xB65540bBA534E88EB4a5062D0E6519C07063b259"
+        "arb1:0xB65540bBA534E88EB4a5062D0E6519C07063b259"
    }
```

```diff
    contract RollupProxy (0xBaE3B462a2A7fb758F66D91170514C10B14Ce914) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      address:
-        "0xBaE3B462a2A7fb758F66D91170514C10B14Ce914"
+        "arb1:0xBaE3B462a2A7fb758F66D91170514C10B14Ce914"
      values.$admin:
-        "0x9132151475ACCf0662C545Bc81FbC1741d978EE0"
+        "arb1:0x9132151475ACCf0662C545Bc81FbC1741d978EE0"
      values.$implementation.0:
-        "0xdD91f6e88576fEc4A38A518DA39C92e13CBB6446"
+        "arb1:0xdD91f6e88576fEc4A38A518DA39C92e13CBB6446"
      values.$implementation.1:
-        "0x1BeD37FeDFE8B2721a69A559313D2b58d16Ecd77"
+        "arb1:0x1BeD37FeDFE8B2721a69A559313D2b58d16Ecd77"
      values.$pastUpgrades.0.2.0:
-        "0xEe9E5546A11Cb5b4A86e92DA05f2ef75C26E4754"
+        "arb1:0xEe9E5546A11Cb5b4A86e92DA05f2ef75C26E4754"
      values.$pastUpgrades.0.2.1:
-        "0x0aE4dD666748bF0F6dB5c149Eab1D8aD27820A6A"
+        "arb1:0x0aE4dD666748bF0F6dB5c149Eab1D8aD27820A6A"
      values.$pastUpgrades.1.2.0:
-        "0xdD91f6e88576fEc4A38A518DA39C92e13CBB6446"
+        "arb1:0xdD91f6e88576fEc4A38A518DA39C92e13CBB6446"
      values.$pastUpgrades.1.2.1:
-        "0x1BeD37FeDFE8B2721a69A559313D2b58d16Ecd77"
+        "arb1:0x1BeD37FeDFE8B2721a69A559313D2b58d16Ecd77"
      values.anyTrustFastConfirmer:
-        "0xF4620078b10CDfD0Dc8E4BCec4250642fa5B517b"
+        "arb1:0xF4620078b10CDfD0Dc8E4BCec4250642fa5B517b"
      values.bridge:
-        "0x2F12c50b46adB01a4961AdDa5038c0974C7C78e8"
+        "arb1:0x2F12c50b46adB01a4961AdDa5038c0974C7C78e8"
      values.challengeManager:
-        "0x14dBe58192B60b5207b86c751255B34550Bd12Fb"
+        "arb1:0x14dBe58192B60b5207b86c751255B34550Bd12Fb"
      values.inbox:
-        "0x590044e628ea1B9C10a86738Cf7a7eeF52D031B8"
+        "arb1:0x590044e628ea1B9C10a86738Cf7a7eeF52D031B8"
      values.loserStakeEscrow:
-        "0x0000000000000000000000000000000000000000"
+        "arb1:0x0000000000000000000000000000000000000000"
      values.outbox:
-        "0x6339965Cb3002f5c746895e4eD895bd775dbfdf9"
+        "arb1:0x6339965Cb3002f5c746895e4eD895bd775dbfdf9"
      values.owner:
-        "0x9132151475ACCf0662C545Bc81FbC1741d978EE0"
+        "arb1:0x9132151475ACCf0662C545Bc81FbC1741d978EE0"
      values.rollupEventInbox:
-        "0xD36cd2624a7187ED41ec30FC1d6E6B7b3abAf251"
+        "arb1:0xD36cd2624a7187ED41ec30FC1d6E6B7b3abAf251"
      values.sequencerInbox:
-        "0xA3464bf0ed52cFe6676D3e34ab1F4DF53f193631"
+        "arb1:0xA3464bf0ed52cFe6676D3e34ab1F4DF53f193631"
      values.stakeToken:
-        "0x0000000000000000000000000000000000000000"
+        "arb1:0x0000000000000000000000000000000000000000"
      values.validators.0:
-        "0xF4620078b10CDfD0Dc8E4BCec4250642fa5B517b"
+        "arb1:0xF4620078b10CDfD0Dc8E4BCec4250642fa5B517b"
      values.validators.1:
-        "0xd5950958024F46FcBe7C8D7Bb6815Ce35F654635"
+        "arb1:0xd5950958024F46FcBe7C8D7Bb6815Ce35F654635"
      values.validatorUtils:
-        "0x6c21303F5986180B1394d2C89f3e883890E2867b"
+        "arb1:0x6c21303F5986180B1394d2C89f3e883890E2867b"
      values.validatorWalletCreator:
-        "0x2b0E04Dc90e3fA58165CB41E2834B44A56E766aF"
+        "arb1:0x2b0E04Dc90e3fA58165CB41E2834B44A56E766aF"
      implementationNames.0xBaE3B462a2A7fb758F66D91170514C10B14Ce914:
-        "RollupProxy"
      implementationNames.0xdD91f6e88576fEc4A38A518DA39C92e13CBB6446:
-        "RollupAdminLogic"
      implementationNames.0x1BeD37FeDFE8B2721a69A559313D2b58d16Ecd77:
-        "RollupUserLogic"
      implementationNames.arb1:0xBaE3B462a2A7fb758F66D91170514C10B14Ce914:
+        "RollupProxy"
      implementationNames.arb1:0xdD91f6e88576fEc4A38A518DA39C92e13CBB6446:
+        "RollupAdminLogic"
      implementationNames.arb1:0x1BeD37FeDFE8B2721a69A559313D2b58d16Ecd77:
+        "RollupUserLogic"
    }
```

```diff
    contract Gelato Multisig (0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb) {
    +++ description: None
      address:
-        "0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb"
+        "arb1:0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb"
      values.$implementation:
-        "0x3E5c63644E683549055b9Be8653de26E0B4CD36E"
+        "arb1:0x3E5c63644E683549055b9Be8653de26E0B4CD36E"
      values.$members.0:
-        "0x28bB9385A588EF4747264D19B9A9F1603591680c"
+        "arb1:0x28bB9385A588EF4747264D19B9A9F1603591680c"
      values.$members.1:
-        "0x691C2EF68e25E620fa6cAdE2728f6aE34F37aAD2"
+        "arb1:0x691C2EF68e25E620fa6cAdE2728f6aE34F37aAD2"
      values.$members.2:
-        "0x5bE3E96Cdc3A97628bD7308d3588B9a474F4A54d"
+        "arb1:0x5bE3E96Cdc3A97628bD7308d3588B9a474F4A54d"
      values.$members.3:
-        "0x88De44422E1b1c30bc530c35aEdb9f5aD0e6fD52"
+        "arb1:0x88De44422E1b1c30bc530c35aEdb9f5aD0e6fD52"
      values.$members.4:
-        "0x349f3839012DB2271e1BeC68F1668471D175Adb9"
+        "arb1:0x349f3839012DB2271e1BeC68F1668471D175Adb9"
      values.$members.5:
-        "0x01a0A7BaAAca31AFB5b770FeFD69CE4917D9c32e"
+        "arb1:0x01a0A7BaAAca31AFB5b770FeFD69CE4917D9c32e"
      values.$members.6:
-        "0xB65540bBA534E88EB4a5062D0E6519C07063b259"
+        "arb1:0xB65540bBA534E88EB4a5062D0E6519C07063b259"
      values.$members.7:
-        "0x547D0F472309e4239b296D01e03bEDc101241a26"
+        "arb1:0x547D0F472309e4239b296D01e03bEDc101241a26"
      implementationNames.0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb:
-        "GnosisSafeProxy"
      implementationNames.0x3E5c63644E683549055b9Be8653de26E0B4CD36E:
-        "GnosisSafeL2"
      implementationNames.arb1:0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb:
+        "GnosisSafeProxy"
      implementationNames.arb1:0x3E5c63644E683549055b9Be8653de26E0B4CD36E:
+        "GnosisSafeL2"
    }
```

```diff
    contract RollupEventInbox (0xD36cd2624a7187ED41ec30FC1d6E6B7b3abAf251) {
    +++ description: Helper contract sending configuration data over the bridge during the systems initialization.
      address:
-        "0xD36cd2624a7187ED41ec30FC1d6E6B7b3abAf251"
+        "arb1:0xD36cd2624a7187ED41ec30FC1d6E6B7b3abAf251"
      values.$admin:
-        "0x79daC9c2deC3E4411a2cB2b0ecf654D27a4AFf0A"
+        "arb1:0x79daC9c2deC3E4411a2cB2b0ecf654D27a4AFf0A"
      values.$implementation:
-        "0x18FD37A4FB9E1F06d9383958aFd236771F15A8cb"
+        "arb1:0x18FD37A4FB9E1F06d9383958aFd236771F15A8cb"
      values.$pastUpgrades.0.2.0:
-        "0x18FD37A4FB9E1F06d9383958aFd236771F15A8cb"
+        "arb1:0x18FD37A4FB9E1F06d9383958aFd236771F15A8cb"
      values.bridge:
-        "0x2F12c50b46adB01a4961AdDa5038c0974C7C78e8"
+        "arb1:0x2F12c50b46adB01a4961AdDa5038c0974C7C78e8"
      values.rollup:
-        "0xBaE3B462a2A7fb758F66D91170514C10B14Ce914"
+        "arb1:0xBaE3B462a2A7fb758F66D91170514C10B14Ce914"
      implementationNames.0xD36cd2624a7187ED41ec30FC1d6E6B7b3abAf251:
-        "TransparentUpgradeableProxy"
      implementationNames.0x18FD37A4FB9E1F06d9383958aFd236771F15A8cb:
-        "ERC20RollupEventInbox"
      implementationNames.arb1:0xD36cd2624a7187ED41ec30FC1d6E6B7b3abAf251:
+        "TransparentUpgradeableProxy"
      implementationNames.arb1:0x18FD37A4FB9E1F06d9383958aFd236771F15A8cb:
+        "ERC20RollupEventInbox"
    }
```

```diff
    EOA  (0xd5950958024F46FcBe7C8D7Bb6815Ce35F654635) {
    +++ description: None
      address:
-        "0xd5950958024F46FcBe7C8D7Bb6815Ce35F654635"
+        "arb1:0xd5950958024F46FcBe7C8D7Bb6815Ce35F654635"
    }
```

```diff
    contract OneStepProofEntry (0xD89d54007079071cBA859127318b9F34eeB78049) {
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
      address:
-        "0xD89d54007079071cBA859127318b9F34eeB78049"
+        "arb1:0xD89d54007079071cBA859127318b9F34eeB78049"
      values.prover0:
-        "0x54E0923782b701044444De5d8c3A45aC890b0881"
+        "arb1:0x54E0923782b701044444De5d8c3A45aC890b0881"
      values.proverHostIo:
-        "0x33c1514Bf90e202d242C299b37C60f908aa206D4"
+        "arb1:0x33c1514Bf90e202d242C299b37C60f908aa206D4"
      values.proverMath:
-        "0xE58a2dEb5718F9aAF2C1DdD0E366ED076D204cc4"
+        "arb1:0xE58a2dEb5718F9aAF2C1DdD0E366ED076D204cc4"
      values.proverMem:
-        "0xf8E5e5562c2c12d8690786f5C9FA65F20F6bD881"
+        "arb1:0xf8E5e5562c2c12d8690786f5C9FA65F20F6bD881"
      implementationNames.0xD89d54007079071cBA859127318b9F34eeB78049:
-        "OneStepProofEntry"
      implementationNames.arb1:0xD89d54007079071cBA859127318b9F34eeB78049:
+        "OneStepProofEntry"
    }
```

```diff
    contract GatewayRouter (0xDa4ac9E9cB8Af8afBB2Df1ffe7b82efEA17ba0f6) {
    +++ description: This routing contract maps tokens to the correct escrow (gateway) to be then bridged with canonical messaging.
      address:
-        "0xDa4ac9E9cB8Af8afBB2Df1ffe7b82efEA17ba0f6"
+        "arb1:0xDa4ac9E9cB8Af8afBB2Df1ffe7b82efEA17ba0f6"
      values.$admin:
-        "0x79daC9c2deC3E4411a2cB2b0ecf654D27a4AFf0A"
+        "arb1:0x79daC9c2deC3E4411a2cB2b0ecf654D27a4AFf0A"
      values.$implementation:
-        "0xd106EC93D2c1adaA65C4B17ffc7bB166Ce30DDAe"
+        "arb1:0xd106EC93D2c1adaA65C4B17ffc7bB166Ce30DDAe"
      values.$pastUpgrades.0.2.0:
-        "0xd106EC93D2c1adaA65C4B17ffc7bB166Ce30DDAe"
+        "arb1:0xd106EC93D2c1adaA65C4B17ffc7bB166Ce30DDAe"
      values.counterpartGateway:
-        "0xFd25B25576cC0d510F62C88A166F84b3e25208C7"
+        "arb1:0xFd25B25576cC0d510F62C88A166F84b3e25208C7"
      values.defaultGateway:
-        "0x419e439e5c0B839d6e31d7C438939EEE1A4f4184"
+        "arb1:0x419e439e5c0B839d6e31d7C438939EEE1A4f4184"
      values.inbox:
-        "0x590044e628ea1B9C10a86738Cf7a7eeF52D031B8"
+        "arb1:0x590044e628ea1B9C10a86738Cf7a7eeF52D031B8"
      values.owner:
-        "0x9132151475ACCf0662C545Bc81FbC1741d978EE0"
+        "arb1:0x9132151475ACCf0662C545Bc81FbC1741d978EE0"
      values.router:
-        "0x0000000000000000000000000000000000000000"
+        "arb1:0x0000000000000000000000000000000000000000"
      values.whitelist:
-        "0x0000000000000000000000000000000000000000"
+        "arb1:0x0000000000000000000000000000000000000000"
      implementationNames.0xDa4ac9E9cB8Af8afBB2Df1ffe7b82efEA17ba0f6:
-        "TransparentUpgradeableProxy"
      implementationNames.0xd106EC93D2c1adaA65C4B17ffc7bB166Ce30DDAe:
-        "L1OrbitGatewayRouter"
      implementationNames.arb1:0xDa4ac9E9cB8Af8afBB2Df1ffe7b82efEA17ba0f6:
+        "TransparentUpgradeableProxy"
      implementationNames.arb1:0xd106EC93D2c1adaA65C4B17ffc7bB166Ce30DDAe:
+        "L1OrbitGatewayRouter"
    }
```

```diff
    contract CustomGateway (0xDd7A9dEcBB0b16B37fE6777e245b18fC0aC63759) {
    +++ description: Escrows deposited assets for the canonical bridge that are externally governed or need custom token contracts with e.g. minting rights or upgradeability.
      address:
-        "0xDd7A9dEcBB0b16B37fE6777e245b18fC0aC63759"
+        "arb1:0xDd7A9dEcBB0b16B37fE6777e245b18fC0aC63759"
      values.$admin:
-        "0x79daC9c2deC3E4411a2cB2b0ecf654D27a4AFf0A"
+        "arb1:0x79daC9c2deC3E4411a2cB2b0ecf654D27a4AFf0A"
      values.$implementation:
-        "0x17e7F68ce50A77e55C7834ddF31AEf86403B8010"
+        "arb1:0x17e7F68ce50A77e55C7834ddF31AEf86403B8010"
      values.$pastUpgrades.0.2.0:
-        "0x17e7F68ce50A77e55C7834ddF31AEf86403B8010"
+        "arb1:0x17e7F68ce50A77e55C7834ddF31AEf86403B8010"
      values.counterpartGateway:
-        "0xA9f18587F6dE8B1c89a4AdD2c953AB66eD532015"
+        "arb1:0xA9f18587F6dE8B1c89a4AdD2c953AB66eD532015"
      values.inbox:
-        "0x590044e628ea1B9C10a86738Cf7a7eeF52D031B8"
+        "arb1:0x590044e628ea1B9C10a86738Cf7a7eeF52D031B8"
      values.owner:
-        "0x9132151475ACCf0662C545Bc81FbC1741d978EE0"
+        "arb1:0x9132151475ACCf0662C545Bc81FbC1741d978EE0"
      values.router:
-        "0xDa4ac9E9cB8Af8afBB2Df1ffe7b82efEA17ba0f6"
+        "arb1:0xDa4ac9E9cB8Af8afBB2Df1ffe7b82efEA17ba0f6"
      values.whitelist:
-        "0x0000000000000000000000000000000000000000"
+        "arb1:0x0000000000000000000000000000000000000000"
      implementationNames.0xDd7A9dEcBB0b16B37fE6777e245b18fC0aC63759:
-        "TransparentUpgradeableProxy"
      implementationNames.0x17e7F68ce50A77e55C7834ddF31AEf86403B8010:
-        "L1OrbitCustomGateway"
      implementationNames.arb1:0xDd7A9dEcBB0b16B37fE6777e245b18fC0aC63759:
+        "TransparentUpgradeableProxy"
      implementationNames.arb1:0x17e7F68ce50A77e55C7834ddF31AEf86403B8010:
+        "L1OrbitCustomGateway"
    }
```

```diff
    contract OneStepProverMath (0xE58a2dEb5718F9aAF2C1DdD0E366ED076D204cc4) {
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
      address:
-        "0xE58a2dEb5718F9aAF2C1DdD0E366ED076D204cc4"
+        "arb1:0xE58a2dEb5718F9aAF2C1DdD0E366ED076D204cc4"
      implementationNames.0xE58a2dEb5718F9aAF2C1DdD0E366ED076D204cc4:
-        "OneStepProverMath"
      implementationNames.arb1:0xE58a2dEb5718F9aAF2C1DdD0E366ED076D204cc4:
+        "OneStepProverMath"
    }
```

```diff
    EOA  (0xeA64C25e6Ea873D5cffb045b80BEc605ABE06647) {
    +++ description: None
      address:
-        "0xeA64C25e6Ea873D5cffb045b80BEc605ABE06647"
+        "arb1:0xeA64C25e6Ea873D5cffb045b80BEc605ABE06647"
    }
```

```diff
    contract EduFastConfirmerMultisig (0xF4620078b10CDfD0Dc8E4BCec4250642fa5B517b) {
    +++ description: None
      address:
-        "0xF4620078b10CDfD0Dc8E4BCec4250642fa5B517b"
+        "arb1:0xF4620078b10CDfD0Dc8E4BCec4250642fa5B517b"
      values.$implementation:
-        "0x3E5c63644E683549055b9Be8653de26E0B4CD36E"
+        "arb1:0x3E5c63644E683549055b9Be8653de26E0B4CD36E"
      values.$members.0:
-        "0xd5950958024F46FcBe7C8D7Bb6815Ce35F654635"
+        "arb1:0xd5950958024F46FcBe7C8D7Bb6815Ce35F654635"
      implementationNames.0xF4620078b10CDfD0Dc8E4BCec4250642fa5B517b:
-        "GnosisSafeProxy"
      implementationNames.0x3E5c63644E683549055b9Be8653de26E0B4CD36E:
-        "GnosisSafeL2"
      implementationNames.arb1:0xF4620078b10CDfD0Dc8E4BCec4250642fa5B517b:
+        "GnosisSafeProxy"
      implementationNames.arb1:0x3E5c63644E683549055b9Be8653de26E0B4CD36E:
+        "GnosisSafeL2"
    }
```

```diff
    contract OneStepProverMemory (0xf8E5e5562c2c12d8690786f5C9FA65F20F6bD881) {
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
      address:
-        "0xf8E5e5562c2c12d8690786f5C9FA65F20F6bD881"
+        "arb1:0xf8E5e5562c2c12d8690786f5C9FA65F20F6bD881"
      implementationNames.0xf8E5e5562c2c12d8690786f5C9FA65F20F6bD881:
-        "OneStepProverMemory"
      implementationNames.arb1:0xf8E5e5562c2c12d8690786f5C9FA65F20F6bD881:
+        "OneStepProverMemory"
    }
```

```diff
    EOA  (0xFd25B25576cC0d510F62C88A166F84b3e25208C7) {
    +++ description: None
      address:
-        "0xFd25B25576cC0d510F62C88A166F84b3e25208C7"
+        "arb1:0xFd25B25576cC0d510F62C88A166F84b3e25208C7"
    }
```

```diff
+   Status: CREATED
    contract ChallengeManager (0x14dBe58192B60b5207b86c751255B34550Bd12Fb)
    +++ description: Contract that allows challenging state roots. Can be called through the RollupProxy by Validators or the UpgradeExecutor.
```

```diff
+   Status: CREATED
    contract Bridge (0x2F12c50b46adB01a4961AdDa5038c0974C7C78e8)
    +++ description: Escrow contract for the project's gas token (can be different from ETH). Keeps a list of allowed Inboxes and Outboxes for canonical bridge messaging.
```

```diff
+   Status: CREATED
    contract OneStepProverHostIo (0x33c1514Bf90e202d242C299b37C60f908aa206D4)
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
```

```diff
+   Status: CREATED
    contract ERC20Gateway (0x419e439e5c0B839d6e31d7C438939EEE1A4f4184)
    +++ description: Escrows deposited ERC-20 assets for the canonical Bridge. Upon depositing, a generic token representation will be minted at the destination. Withdrawals are initiated by the Outbox contract.
```

```diff
+   Status: CREATED
    contract OneStepProver0 (0x54E0923782b701044444De5d8c3A45aC890b0881)
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
```

```diff
+   Status: CREATED
    contract Inbox (0x590044e628ea1B9C10a86738Cf7a7eeF52D031B8)
    +++ description: Facilitates sending L1 to L2 messages like depositing ETH, but does not escrow funds.
```

```diff
+   Status: CREATED
    contract Outbox (0x6339965Cb3002f5c746895e4eD895bd775dbfdf9)
    +++ description: Facilitates L2 to L1 contract calls: Messages initiated from L2 (for example withdrawal messages) eventually resolve in execution on L1.
```

```diff
+   Status: CREATED
    contract ValidatorUtils (0x6c21303F5986180B1394d2C89f3e883890E2867b)
    +++ description: This contract implements view only utilities for validators.
```

```diff
+   Status: CREATED
    contract ProxyAdmin (0x79daC9c2deC3E4411a2cB2b0ecf654D27a4AFf0A)
    +++ description: None
```

```diff
+   Status: CREATED
    contract UpgradeExecutor (0x9132151475ACCf0662C545Bc81FbC1741d978EE0)
    +++ description: Central contract defining the access control permissions for upgrading the system contract implementations.
```

```diff
+   Status: CREATED
    contract SequencerInbox (0xA3464bf0ed52cFe6676D3e34ab1F4DF53f193631)
    +++ description: A sequencer (registered in this contract) can submit transaction batches or commitments here.
```

```diff
+   Status: CREATED
    contract RollupProxy (0xBaE3B462a2A7fb758F66D91170514C10B14Ce914)
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
```

```diff
+   Status: CREATED
    contract Gelato Multisig (0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb)
    +++ description: None
```

```diff
+   Status: CREATED
    contract RollupEventInbox (0xD36cd2624a7187ED41ec30FC1d6E6B7b3abAf251)
    +++ description: Helper contract sending configuration data over the bridge during the systems initialization.
```

```diff
+   Status: CREATED
    contract OneStepProofEntry (0xD89d54007079071cBA859127318b9F34eeB78049)
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
```

```diff
+   Status: CREATED
    contract GatewayRouter (0xDa4ac9E9cB8Af8afBB2Df1ffe7b82efEA17ba0f6)
    +++ description: This routing contract maps tokens to the correct escrow (gateway) to be then bridged with canonical messaging.
```

```diff
+   Status: CREATED
    contract CustomGateway (0xDd7A9dEcBB0b16B37fE6777e245b18fC0aC63759)
    +++ description: Escrows deposited assets for the canonical bridge that are externally governed or need custom token contracts with e.g. minting rights or upgradeability.
```

```diff
+   Status: CREATED
    contract OneStepProverMath (0xE58a2dEb5718F9aAF2C1DdD0E366ED076D204cc4)
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
```

```diff
+   Status: CREATED
    contract EduFastConfirmerMultisig (0xF4620078b10CDfD0Dc8E4BCec4250642fa5B517b)
    +++ description: None
```

```diff
+   Status: CREATED
    contract OneStepProverMemory (0xf8E5e5562c2c12d8690786f5C9FA65F20F6bD881)
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
```

Generated with discovered.json: 0x67a5ab671cb8e308b039fa361da8c6895996598d

# Diff at Fri, 04 Jul 2025 12:18:59 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@1f56dc47fe915564d4555300304da4d3bcbc087f block: 350981738
- current block number: 350981738

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 350981738 (main branch discovery), not current.

```diff
    contract ProxyAdmin (0x79daC9c2deC3E4411a2cB2b0ecf654D27a4AFf0A) {
    +++ description: None
      directlyReceivedPermissions.0.from:
-        "arbitrum:0x14dBe58192B60b5207b86c751255B34550Bd12Fb"
+        "arb1:0x14dBe58192B60b5207b86c751255B34550Bd12Fb"
      directlyReceivedPermissions.1.from:
-        "arbitrum:0x2F12c50b46adB01a4961AdDa5038c0974C7C78e8"
+        "arb1:0x2F12c50b46adB01a4961AdDa5038c0974C7C78e8"
      directlyReceivedPermissions.2.from:
-        "arbitrum:0x419e439e5c0B839d6e31d7C438939EEE1A4f4184"
+        "arb1:0x419e439e5c0B839d6e31d7C438939EEE1A4f4184"
      directlyReceivedPermissions.3.from:
-        "arbitrum:0x590044e628ea1B9C10a86738Cf7a7eeF52D031B8"
+        "arb1:0x590044e628ea1B9C10a86738Cf7a7eeF52D031B8"
      directlyReceivedPermissions.4.from:
-        "arbitrum:0x6339965Cb3002f5c746895e4eD895bd775dbfdf9"
+        "arb1:0x6339965Cb3002f5c746895e4eD895bd775dbfdf9"
      directlyReceivedPermissions.5.from:
-        "arbitrum:0x9132151475ACCf0662C545Bc81FbC1741d978EE0"
+        "arb1:0x9132151475ACCf0662C545Bc81FbC1741d978EE0"
      directlyReceivedPermissions.6.from:
-        "arbitrum:0xA3464bf0ed52cFe6676D3e34ab1F4DF53f193631"
+        "arb1:0xA3464bf0ed52cFe6676D3e34ab1F4DF53f193631"
      directlyReceivedPermissions.7.from:
-        "arbitrum:0xD36cd2624a7187ED41ec30FC1d6E6B7b3abAf251"
+        "arb1:0xD36cd2624a7187ED41ec30FC1d6E6B7b3abAf251"
      directlyReceivedPermissions.8.from:
-        "arbitrum:0xDa4ac9E9cB8Af8afBB2Df1ffe7b82efEA17ba0f6"
+        "arb1:0xDa4ac9E9cB8Af8afBB2Df1ffe7b82efEA17ba0f6"
      directlyReceivedPermissions.9.from:
-        "arbitrum:0xDd7A9dEcBB0b16B37fE6777e245b18fC0aC63759"
+        "arb1:0xDd7A9dEcBB0b16B37fE6777e245b18fC0aC63759"
    }
```

```diff
    contract UpgradeExecutor (0x9132151475ACCf0662C545Bc81FbC1741d978EE0) {
    +++ description: Central contract defining the access control permissions for upgrading the system contract implementations.
      directlyReceivedPermissions.0.from:
-        "arbitrum:0x79daC9c2deC3E4411a2cB2b0ecf654D27a4AFf0A"
+        "arb1:0x79daC9c2deC3E4411a2cB2b0ecf654D27a4AFf0A"
      directlyReceivedPermissions.1.from:
-        "arbitrum:0xBaE3B462a2A7fb758F66D91170514C10B14Ce914"
+        "arb1:0xBaE3B462a2A7fb758F66D91170514C10B14Ce914"
      directlyReceivedPermissions.2.from:
-        "arbitrum:0xBaE3B462a2A7fb758F66D91170514C10B14Ce914"
+        "arb1:0xBaE3B462a2A7fb758F66D91170514C10B14Ce914"
    }
```

```diff
    contract Gelato Multisig (0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb) {
    +++ description: None
      receivedPermissions.0.via.0.address:
-        "arbitrum:0x9132151475ACCf0662C545Bc81FbC1741d978EE0"
+        "arb1:0x9132151475ACCf0662C545Bc81FbC1741d978EE0"
      receivedPermissions.0.from:
-        "arbitrum:0xBaE3B462a2A7fb758F66D91170514C10B14Ce914"
+        "arb1:0xBaE3B462a2A7fb758F66D91170514C10B14Ce914"
      receivedPermissions.1.via.1.address:
-        "arbitrum:0x9132151475ACCf0662C545Bc81FbC1741d978EE0"
+        "arb1:0x9132151475ACCf0662C545Bc81FbC1741d978EE0"
      receivedPermissions.1.via.0.address:
-        "arbitrum:0x79daC9c2deC3E4411a2cB2b0ecf654D27a4AFf0A"
+        "arb1:0x79daC9c2deC3E4411a2cB2b0ecf654D27a4AFf0A"
      receivedPermissions.1.from:
-        "arbitrum:0x14dBe58192B60b5207b86c751255B34550Bd12Fb"
+        "arb1:0x14dBe58192B60b5207b86c751255B34550Bd12Fb"
      receivedPermissions.2.via.1.address:
-        "arbitrum:0x9132151475ACCf0662C545Bc81FbC1741d978EE0"
+        "arb1:0x9132151475ACCf0662C545Bc81FbC1741d978EE0"
      receivedPermissions.2.via.0.address:
-        "arbitrum:0x79daC9c2deC3E4411a2cB2b0ecf654D27a4AFf0A"
+        "arb1:0x79daC9c2deC3E4411a2cB2b0ecf654D27a4AFf0A"
      receivedPermissions.2.from:
-        "arbitrum:0x2F12c50b46adB01a4961AdDa5038c0974C7C78e8"
+        "arb1:0x2F12c50b46adB01a4961AdDa5038c0974C7C78e8"
      receivedPermissions.3.via.1.address:
-        "arbitrum:0x9132151475ACCf0662C545Bc81FbC1741d978EE0"
+        "arb1:0x9132151475ACCf0662C545Bc81FbC1741d978EE0"
      receivedPermissions.3.via.0.address:
-        "arbitrum:0x79daC9c2deC3E4411a2cB2b0ecf654D27a4AFf0A"
+        "arb1:0x79daC9c2deC3E4411a2cB2b0ecf654D27a4AFf0A"
      receivedPermissions.3.from:
-        "arbitrum:0x419e439e5c0B839d6e31d7C438939EEE1A4f4184"
+        "arb1:0x419e439e5c0B839d6e31d7C438939EEE1A4f4184"
      receivedPermissions.4.via.1.address:
-        "arbitrum:0x9132151475ACCf0662C545Bc81FbC1741d978EE0"
+        "arb1:0x9132151475ACCf0662C545Bc81FbC1741d978EE0"
      receivedPermissions.4.via.0.address:
-        "arbitrum:0x79daC9c2deC3E4411a2cB2b0ecf654D27a4AFf0A"
+        "arb1:0x79daC9c2deC3E4411a2cB2b0ecf654D27a4AFf0A"
      receivedPermissions.4.from:
-        "arbitrum:0x590044e628ea1B9C10a86738Cf7a7eeF52D031B8"
+        "arb1:0x590044e628ea1B9C10a86738Cf7a7eeF52D031B8"
      receivedPermissions.5.via.1.address:
-        "arbitrum:0x9132151475ACCf0662C545Bc81FbC1741d978EE0"
+        "arb1:0x9132151475ACCf0662C545Bc81FbC1741d978EE0"
      receivedPermissions.5.via.0.address:
-        "arbitrum:0x79daC9c2deC3E4411a2cB2b0ecf654D27a4AFf0A"
+        "arb1:0x79daC9c2deC3E4411a2cB2b0ecf654D27a4AFf0A"
      receivedPermissions.5.from:
-        "arbitrum:0x6339965Cb3002f5c746895e4eD895bd775dbfdf9"
+        "arb1:0x6339965Cb3002f5c746895e4eD895bd775dbfdf9"
      receivedPermissions.6.via.1.address:
-        "arbitrum:0x9132151475ACCf0662C545Bc81FbC1741d978EE0"
+        "arb1:0x9132151475ACCf0662C545Bc81FbC1741d978EE0"
      receivedPermissions.6.via.0.address:
-        "arbitrum:0x79daC9c2deC3E4411a2cB2b0ecf654D27a4AFf0A"
+        "arb1:0x79daC9c2deC3E4411a2cB2b0ecf654D27a4AFf0A"
      receivedPermissions.6.from:
-        "arbitrum:0x9132151475ACCf0662C545Bc81FbC1741d978EE0"
+        "arb1:0x9132151475ACCf0662C545Bc81FbC1741d978EE0"
      receivedPermissions.7.via.1.address:
-        "arbitrum:0x9132151475ACCf0662C545Bc81FbC1741d978EE0"
+        "arb1:0x9132151475ACCf0662C545Bc81FbC1741d978EE0"
      receivedPermissions.7.via.0.address:
-        "arbitrum:0x79daC9c2deC3E4411a2cB2b0ecf654D27a4AFf0A"
+        "arb1:0x79daC9c2deC3E4411a2cB2b0ecf654D27a4AFf0A"
      receivedPermissions.7.from:
-        "arbitrum:0xA3464bf0ed52cFe6676D3e34ab1F4DF53f193631"
+        "arb1:0xA3464bf0ed52cFe6676D3e34ab1F4DF53f193631"
      receivedPermissions.8.via.0.address:
-        "arbitrum:0x9132151475ACCf0662C545Bc81FbC1741d978EE0"
+        "arb1:0x9132151475ACCf0662C545Bc81FbC1741d978EE0"
      receivedPermissions.8.from:
-        "arbitrum:0xBaE3B462a2A7fb758F66D91170514C10B14Ce914"
+        "arb1:0xBaE3B462a2A7fb758F66D91170514C10B14Ce914"
      receivedPermissions.9.via.1.address:
-        "arbitrum:0x9132151475ACCf0662C545Bc81FbC1741d978EE0"
+        "arb1:0x9132151475ACCf0662C545Bc81FbC1741d978EE0"
      receivedPermissions.9.via.0.address:
-        "arbitrum:0x79daC9c2deC3E4411a2cB2b0ecf654D27a4AFf0A"
+        "arb1:0x79daC9c2deC3E4411a2cB2b0ecf654D27a4AFf0A"
      receivedPermissions.9.from:
-        "arbitrum:0xD36cd2624a7187ED41ec30FC1d6E6B7b3abAf251"
+        "arb1:0xD36cd2624a7187ED41ec30FC1d6E6B7b3abAf251"
      receivedPermissions.10.via.1.address:
-        "arbitrum:0x9132151475ACCf0662C545Bc81FbC1741d978EE0"
+        "arb1:0x9132151475ACCf0662C545Bc81FbC1741d978EE0"
      receivedPermissions.10.via.0.address:
-        "arbitrum:0x79daC9c2deC3E4411a2cB2b0ecf654D27a4AFf0A"
+        "arb1:0x79daC9c2deC3E4411a2cB2b0ecf654D27a4AFf0A"
      receivedPermissions.10.from:
-        "arbitrum:0xDa4ac9E9cB8Af8afBB2Df1ffe7b82efEA17ba0f6"
+        "arb1:0xDa4ac9E9cB8Af8afBB2Df1ffe7b82efEA17ba0f6"
      receivedPermissions.11.via.1.address:
-        "arbitrum:0x9132151475ACCf0662C545Bc81FbC1741d978EE0"
+        "arb1:0x9132151475ACCf0662C545Bc81FbC1741d978EE0"
      receivedPermissions.11.via.0.address:
-        "arbitrum:0x79daC9c2deC3E4411a2cB2b0ecf654D27a4AFf0A"
+        "arb1:0x79daC9c2deC3E4411a2cB2b0ecf654D27a4AFf0A"
      receivedPermissions.11.from:
-        "arbitrum:0xDd7A9dEcBB0b16B37fE6777e245b18fC0aC63759"
+        "arb1:0xDd7A9dEcBB0b16B37fE6777e245b18fC0aC63759"
      directlyReceivedPermissions.0.from:
-        "arbitrum:0x9132151475ACCf0662C545Bc81FbC1741d978EE0"
+        "arb1:0x9132151475ACCf0662C545Bc81FbC1741d978EE0"
    }
```

```diff
    EOA  (0xd5950958024F46FcBe7C8D7Bb6815Ce35F654635) {
    +++ description: None
      receivedPermissions.0.via.0.address:
-        "arbitrum:0xF4620078b10CDfD0Dc8E4BCec4250642fa5B517b"
+        "arb1:0xF4620078b10CDfD0Dc8E4BCec4250642fa5B517b"
      receivedPermissions.0.from:
-        "arbitrum:0xBaE3B462a2A7fb758F66D91170514C10B14Ce914"
+        "arb1:0xBaE3B462a2A7fb758F66D91170514C10B14Ce914"
      receivedPermissions.1.via.0.address:
-        "arbitrum:0xF4620078b10CDfD0Dc8E4BCec4250642fa5B517b"
+        "arb1:0xF4620078b10CDfD0Dc8E4BCec4250642fa5B517b"
      receivedPermissions.1.from:
-        "arbitrum:0xBaE3B462a2A7fb758F66D91170514C10B14Ce914"
+        "arb1:0xBaE3B462a2A7fb758F66D91170514C10B14Ce914"
      receivedPermissions.2.from:
-        "arbitrum:0xBaE3B462a2A7fb758F66D91170514C10B14Ce914"
+        "arb1:0xBaE3B462a2A7fb758F66D91170514C10B14Ce914"
    }
```

```diff
    EOA  (0xeA64C25e6Ea873D5cffb045b80BEc605ABE06647) {
    +++ description: None
      receivedPermissions.0.from:
-        "arbitrum:0xA3464bf0ed52cFe6676D3e34ab1F4DF53f193631"
+        "arb1:0xA3464bf0ed52cFe6676D3e34ab1F4DF53f193631"
    }
```

```diff
    contract EduFastConfirmerMultisig (0xF4620078b10CDfD0Dc8E4BCec4250642fa5B517b) {
    +++ description: None
      directlyReceivedPermissions.0.from:
-        "arbitrum:0xBaE3B462a2A7fb758F66D91170514C10B14Ce914"
+        "arb1:0xBaE3B462a2A7fb758F66D91170514C10B14Ce914"
      directlyReceivedPermissions.1.from:
-        "arbitrum:0xBaE3B462a2A7fb758F66D91170514C10B14Ce914"
+        "arb1:0xBaE3B462a2A7fb758F66D91170514C10B14Ce914"
    }
```

Generated with discovered.json: 0xa22333f487a831eb1f862ee46f504a04ff6dabb3

# Diff at Wed, 25 Jun 2025 07:30:44 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@4bade41aedf0f9269688f2c05f04d2992bb2ca38 block: 319332430
- current block number: 350981738

## Description

operator changes.

## Watched changes

```diff
    contract RollupProxy (0xBaE3B462a2A7fb758F66D91170514C10B14Ce914) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
+++ description: Increments on each Validator change.
      values.setValidatorCount:
-        8
+        9
      values.validators.5:
-        "0xd5950958024F46FcBe7C8D7Bb6815Ce35F654635"
      values.validators.4:
-        "0xF4620078b10CDfD0Dc8E4BCec4250642fa5B517b"
      values.validators.3:
-        "0x62A5cE01D91fEe98678D4346890c8E7ABB4695A6"
      values.validators.2:
-        "0xa7F450595Db1e14E70570a1AdFA15678fbC7bceD"
      values.validators.1:
-        "0xedbFE5493367F8fBc340276503D3c18D2C02E9AE"
+        "0xd5950958024F46FcBe7C8D7Bb6815Ce35F654635"
      values.validators.0:
-        "0x834999E1D729Ead48Ae1Db1dAa11463102EccB77"
+        "0xF4620078b10CDfD0Dc8E4BCec4250642fa5B517b"
    }
```

```diff
    EOA  (0xd5950958024F46FcBe7C8D7Bb6815Ce35F654635) {
    +++ description: None
      receivedPermissions.2:
+        {"permission":"validate","from":"arbitrum:0xBaE3B462a2A7fb758F66D91170514C10B14Ce914","description":"Can propose new state roots (called nodes) and challenge state roots on the host chain.","role":".validators"}
      receivedPermissions.1:
+        {"permission":"fastconfirm","from":"arbitrum:0xBaE3B462a2A7fb758F66D91170514C10B14Ce914","description":"Can finalize a state root before the challenge period has passed. This allows withdrawing from the bridge based on the state root.","role":".anyTrustFastConfirmer","via":[{"address":"arbitrum:0xF4620078b10CDfD0Dc8E4BCec4250642fa5B517b"}]}
      receivedPermissions.0.via:
+        [{"address":"arbitrum:0xF4620078b10CDfD0Dc8E4BCec4250642fa5B517b"}]
    }
```

```diff
    contract EduFastConfirmerMultisig (0xF4620078b10CDfD0Dc8E4BCec4250642fa5B517b) {
    +++ description: None
      values.$members.4:
-        "0xd5950958024F46FcBe7C8D7Bb6815Ce35F654635"
      values.$members.3:
-        "0x62A5cE01D91fEe98678D4346890c8E7ABB4695A6"
      values.$members.2:
-        "0xa7F450595Db1e14E70570a1AdFA15678fbC7bceD"
      values.$members.1:
-        "0xedbFE5493367F8fBc340276503D3c18D2C02E9AE"
      values.$members.0:
-        "0x834999E1D729Ead48Ae1Db1dAa11463102EccB77"
+        "0xd5950958024F46FcBe7C8D7Bb6815Ce35F654635"
      values.$threshold:
-        3
+        1
      values.multisigThreshold:
-        "3 of 5 (60%)"
+        "1 of 1 (100%)"
      receivedPermissions:
-        [{"permission":"fastconfirm","from":"arbitrum:0xBaE3B462a2A7fb758F66D91170514C10B14Ce914","description":"Can finalize a state root before the challenge period has passed. This allows withdrawing from the bridge based on the state root.","role":".anyTrustFastConfirmer"},{"permission":"validate","from":"arbitrum:0xBaE3B462a2A7fb758F66D91170514C10B14Ce914","description":"Can propose new state roots (called nodes) and challenge state roots on the host chain.","role":".validators"}]
      directlyReceivedPermissions:
+        [{"permission":"fastconfirm","from":"arbitrum:0xBaE3B462a2A7fb758F66D91170514C10B14Ce914","description":"Can finalize a state root before the challenge period has passed. This allows withdrawing from the bridge based on the state root.","role":".anyTrustFastConfirmer"},{"permission":"validate","from":"arbitrum:0xBaE3B462a2A7fb758F66D91170514C10B14Ce914","description":"Can propose new state roots (called nodes) and challenge state roots on the host chain.","role":".validators"}]
    }
```

Generated with discovered.json: 0xa1358fde346168a0c90a5469a4da37a8541c1096

# Diff at Wed, 18 Jun 2025 12:22:01 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@a8e4f22a1441bd5040898cc3d3d62b3582942b65 block: 319332430
- current block number: 319332430

## Description

config: wasmmoduleroot map updated.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 319332430 (main branch discovery), not current.

```diff
    contract RollupProxy (0xBaE3B462a2A7fb758F66D91170514C10B14Ce914) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      usedTypes.0.arg.0xdb698a2576298f25448bc092e52cf13b1e24141c997135d70f217d674bbeb69a:
+        "ArbOS v40 wasmModuleRoot"
    }
```

Generated with discovered.json: 0x1084ae6af721d531aecfe3b9327076badfc0f3f5

# Diff at Tue, 27 May 2025 08:31:04 GMT:

- author: Michał Podsiadły (<michal.podsiadly@l2beat.com>)
- comparing to: main@fd658a9ed4bbd45fc5705d23b1906ca057d0d8b0 block: 319332430
- current block number: 319332430

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 319332430 (main branch discovery), not current.

```diff
    contract RollupProxy (0xBaE3B462a2A7fb758F66D91170514C10B14Ce914) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      sourceHashes.2:
-        "0xb8da0b3748daac768860783e8555198fd2d1bbdffb775b81557a7124890c7eca"
      sourceHashes.1:
-        "0x9349e73cbc2d2b818c1d79711574ba210b56249d8d3845bc78c776caf8f8ff42"
+        "0xb8da0b3748daac768860783e8555198fd2d1bbdffb775b81557a7124890c7eca"
      sourceHashes.0:
-        "0x7ee21b18b2e18c636bfafc08ff72692cc43302b2599ba75f0abad67282866dd5"
+        "0x86c7032e0f4b5468f1eb92c79b73ab4c7f053fc7bdfc88fdd360e2fe7baa1072"
    }
```

Generated with discovered.json: 0x6851c4f9be2bbfcb60d029f563d428478c01158b

# Diff at Fri, 23 May 2025 09:41:12 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@69cd181abbc3c830a6caf2f4429b37cae72ffdb8 block: 319332430
- current block number: 319332430

## Description

Introduced .role field on each permission, defaulting to field name on which it was defined (with '.' prefix)

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 319332430 (main branch discovery), not current.

```diff
    EOA  (0x62A5cE01D91fEe98678D4346890c8E7ABB4695A6) {
    +++ description: None
      receivedPermissions.0.role:
+        ".validators"
    }
```

```diff
    contract ProxyAdmin (0x79daC9c2deC3E4411a2cB2b0ecf654D27a4AFf0A) {
    +++ description: None
      directlyReceivedPermissions.9.role:
+        "admin"
      directlyReceivedPermissions.8.role:
+        "admin"
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
    EOA  (0x834999E1D729Ead48Ae1Db1dAa11463102EccB77) {
    +++ description: None
      receivedPermissions.0.role:
+        ".validators"
    }
```

```diff
    contract UpgradeExecutor (0x9132151475ACCf0662C545Bc81FbC1741d978EE0) {
    +++ description: Central contract defining the access control permissions for upgrading the system contract implementations.
      directlyReceivedPermissions.2.role:
+        "admin"
      directlyReceivedPermissions.1.role:
+        ".owner"
      directlyReceivedPermissions.0.role:
+        ".owner"
    }
```

```diff
    EOA  (0xa7F450595Db1e14E70570a1AdFA15678fbC7bceD) {
    +++ description: None
      receivedPermissions.0.role:
+        ".validators"
    }
```

```diff
    contract Gelato Multisig (0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb) {
    +++ description: None
      receivedPermissions.11.role:
+        "admin"
      receivedPermissions.10.role:
+        "admin"
      receivedPermissions.9.role:
+        "admin"
      receivedPermissions.8.role:
+        "admin"
      receivedPermissions.7.role:
+        "admin"
      receivedPermissions.6.permission:
-        "interact"
+        "upgrade"
      receivedPermissions.6.from:
-        "0xBaE3B462a2A7fb758F66D91170514C10B14Ce914"
+        "0xDd7A9dEcBB0b16B37fE6777e245b18fC0aC63759"
      receivedPermissions.6.description:
-        "Pause and unpause and set important roles and parameters in the system contracts: Can delegate Sequencer management to a BatchPosterManager address, manage data availability, DACs and the fastConfirmer role, set the Sequencer-only window, introduce an allowList to the bridge and whitelist Inboxes/Outboxes."
      receivedPermissions.6.via.1:
+        {"address":"0x9132151475ACCf0662C545Bc81FbC1741d978EE0"}
      receivedPermissions.6.via.0.address:
-        "0x9132151475ACCf0662C545Bc81FbC1741d978EE0"
+        "0x79daC9c2deC3E4411a2cB2b0ecf654D27a4AFf0A"
      receivedPermissions.6.role:
+        "admin"
      receivedPermissions.5.from:
-        "0xDd7A9dEcBB0b16B37fE6777e245b18fC0aC63759"
+        "0x419e439e5c0B839d6e31d7C438939EEE1A4f4184"
      receivedPermissions.5.role:
+        "admin"
      receivedPermissions.4.from:
-        "0x419e439e5c0B839d6e31d7C438939EEE1A4f4184"
+        "0x2F12c50b46adB01a4961AdDa5038c0974C7C78e8"
      receivedPermissions.4.role:
+        "admin"
      receivedPermissions.3.from:
-        "0x2F12c50b46adB01a4961AdDa5038c0974C7C78e8"
+        "0x590044e628ea1B9C10a86738Cf7a7eeF52D031B8"
      receivedPermissions.3.role:
+        "admin"
      receivedPermissions.2.from:
-        "0x590044e628ea1B9C10a86738Cf7a7eeF52D031B8"
+        "0x6339965Cb3002f5c746895e4eD895bd775dbfdf9"
      receivedPermissions.2.role:
+        "admin"
      receivedPermissions.1.from:
-        "0x6339965Cb3002f5c746895e4eD895bd775dbfdf9"
+        "0xD36cd2624a7187ED41ec30FC1d6E6B7b3abAf251"
      receivedPermissions.1.role:
+        "admin"
      receivedPermissions.0.permission:
-        "upgrade"
+        "interact"
      receivedPermissions.0.from:
-        "0xD36cd2624a7187ED41ec30FC1d6E6B7b3abAf251"
+        "0xBaE3B462a2A7fb758F66D91170514C10B14Ce914"
      receivedPermissions.0.via.1:
-        {"address":"0x9132151475ACCf0662C545Bc81FbC1741d978EE0"}
      receivedPermissions.0.via.0.address:
-        "0x79daC9c2deC3E4411a2cB2b0ecf654D27a4AFf0A"
+        "0x9132151475ACCf0662C545Bc81FbC1741d978EE0"
      receivedPermissions.0.description:
+        "Pause and unpause and set important roles and parameters in the system contracts: Can delegate Sequencer management to a BatchPosterManager address, manage data availability, DACs and the fastConfirmer role, set the Sequencer-only window, introduce an allowList to the bridge and whitelist Inboxes/Outboxes."
      receivedPermissions.0.role:
+        ".owner"
      directlyReceivedPermissions.0.role:
+        ".executors"
    }
```

```diff
    EOA  (0xd5950958024F46FcBe7C8D7Bb6815Ce35F654635) {
    +++ description: None
      receivedPermissions.0.role:
+        ".validators"
    }
```

```diff
    EOA  (0xeA64C25e6Ea873D5cffb045b80BEc605ABE06647) {
    +++ description: None
      receivedPermissions.0.role:
+        ".batchPosters"
    }
```

```diff
    EOA  (0xedbFE5493367F8fBc340276503D3c18D2C02E9AE) {
    +++ description: None
      receivedPermissions.0.role:
+        ".validators"
    }
```

```diff
    contract EduFastConfirmerMultisig (0xF4620078b10CDfD0Dc8E4BCec4250642fa5B517b) {
    +++ description: None
      receivedPermissions.1.permission:
-        "validate"
+        "fastconfirm"
      receivedPermissions.1.description:
-        "Can propose new state roots (called nodes) and challenge state roots on the host chain."
+        "Can finalize a state root before the challenge period has passed. This allows withdrawing from the bridge based on the state root."
      receivedPermissions.1.role:
+        ".anyTrustFastConfirmer"
      receivedPermissions.0.permission:
-        "fastconfirm"
+        "validate"
      receivedPermissions.0.description:
-        "Can finalize a state root before the challenge period has passed. This allows withdrawing from the bridge based on the state root."
+        "Can propose new state roots (called nodes) and challenge state roots on the host chain."
      receivedPermissions.0.role:
+        ".validators"
    }
```

Generated with discovered.json: 0xc811fe07a966272382cff28bb6c259cea2fae409

# Diff at Fri, 02 May 2025 17:25:17 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@c598e33a0c469175b7abbd6c2a13b47b63d6b6a4 block: 319332430
- current block number: 319332430

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 319332430 (main branch discovery), not current.

```diff
    contract RollupProxy (0xBaE3B462a2A7fb758F66D91170514C10B14Ce914) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      usedTypes.0.arg.0xaf1dbdfceb871c00bfbb1675983133df04f0ed04e89647812513c091e3a982b3:
+        "Celestia Nitro 3.3.2 wasmModuleRoot"
    }
```

Generated with discovered.json: 0x757ea8de44ba6245b5b94688e391b1f136057e21

# Diff at Tue, 29 Apr 2025 08:19:20 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@ef7477af00fe0b57a2f7cacf7e958c12494af662 block: 319332430
- current block number: 319332430

## Description

Field .issuedPermissions is removed from the output as no longer needed. Added 'permissionsConfigHash' due to refactoring of the modelling process (into a separate command).

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 319332430 (main branch discovery), not current.

```diff
    contract ChallengeManager (0x14dBe58192B60b5207b86c751255B34550Bd12Fb) {
    +++ description: Contract that allows challenging state roots. Can be called through the RollupProxy by Validators or the UpgradeExecutor.
      issuedPermissions:
-        [{"permission":"upgrade","to":"0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb","via":[{"address":"0x9132151475ACCf0662C545Bc81FbC1741d978EE0"},{"address":"0x79daC9c2deC3E4411a2cB2b0ecf654D27a4AFf0A"}]}]
    }
```

```diff
    contract Bridge (0x2F12c50b46adB01a4961AdDa5038c0974C7C78e8) {
    +++ description: Escrow contract for the project's gas token (can be different from ETH). Keeps a list of allowed Inboxes and Outboxes for canonical bridge messaging.
      issuedPermissions:
-        [{"permission":"upgrade","to":"0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb","via":[{"address":"0x9132151475ACCf0662C545Bc81FbC1741d978EE0"},{"address":"0x79daC9c2deC3E4411a2cB2b0ecf654D27a4AFf0A"}]}]
    }
```

```diff
    contract ERC20Gateway (0x419e439e5c0B839d6e31d7C438939EEE1A4f4184) {
    +++ description: Escrows deposited ERC-20 assets for the canonical Bridge. Upon depositing, a generic token representation will be minted at the destination. Withdrawals are initiated by the Outbox contract.
      issuedPermissions:
-        [{"permission":"upgrade","to":"0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb","via":[{"address":"0x9132151475ACCf0662C545Bc81FbC1741d978EE0"},{"address":"0x79daC9c2deC3E4411a2cB2b0ecf654D27a4AFf0A"}]}]
    }
```

```diff
    contract Inbox (0x590044e628ea1B9C10a86738Cf7a7eeF52D031B8) {
    +++ description: Facilitates sending L1 to L2 messages like depositing ETH, but does not escrow funds.
      issuedPermissions:
-        [{"permission":"upgrade","to":"0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb","via":[{"address":"0x9132151475ACCf0662C545Bc81FbC1741d978EE0"},{"address":"0x79daC9c2deC3E4411a2cB2b0ecf654D27a4AFf0A"}]}]
    }
```

```diff
    contract Outbox (0x6339965Cb3002f5c746895e4eD895bd775dbfdf9) {
    +++ description: Facilitates L2 to L1 contract calls: Messages initiated from L2 (for example withdrawal messages) eventually resolve in execution on L1.
      issuedPermissions:
-        [{"permission":"upgrade","to":"0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb","via":[{"address":"0x9132151475ACCf0662C545Bc81FbC1741d978EE0"},{"address":"0x79daC9c2deC3E4411a2cB2b0ecf654D27a4AFf0A"}]}]
    }
```

```diff
    contract UpgradeExecutor (0x9132151475ACCf0662C545Bc81FbC1741d978EE0) {
    +++ description: Central contract defining the access control permissions for upgrading the system contract implementations.
      issuedPermissions:
-        [{"permission":"upgrade","to":"0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb","via":[{"address":"0x9132151475ACCf0662C545Bc81FbC1741d978EE0"},{"address":"0x79daC9c2deC3E4411a2cB2b0ecf654D27a4AFf0A"}]}]
    }
```

```diff
    contract SequencerInbox (0xA3464bf0ed52cFe6676D3e34ab1F4DF53f193631) {
    +++ description: A sequencer (registered in this contract) can submit transaction batches or commitments here.
      issuedPermissions:
-        [{"permission":"sequence","to":"0xeA64C25e6Ea873D5cffb045b80BEc605ABE06647","description":"Can submit transaction batches or commitments to the SequencerInbox contract on the host chain.","via":[]},{"permission":"upgrade","to":"0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb","via":[{"address":"0x9132151475ACCf0662C545Bc81FbC1741d978EE0"},{"address":"0x79daC9c2deC3E4411a2cB2b0ecf654D27a4AFf0A"}]}]
    }
```

```diff
    contract RollupProxy (0xBaE3B462a2A7fb758F66D91170514C10B14Ce914) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      issuedPermissions:
-        [{"permission":"fastconfirm","to":"0xF4620078b10CDfD0Dc8E4BCec4250642fa5B517b","description":"Can finalize a state root before the challenge period has passed. This allows withdrawing from the bridge based on the state root.","via":[]},{"permission":"interact","to":"0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb","description":"Pause and unpause and set important roles and parameters in the system contracts: Can delegate Sequencer management to a BatchPosterManager address, manage data availability, DACs and the fastConfirmer role, set the Sequencer-only window, introduce an allowList to the bridge and whitelist Inboxes/Outboxes.","via":[{"address":"0x9132151475ACCf0662C545Bc81FbC1741d978EE0"}]},{"permission":"upgrade","to":"0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb","via":[{"address":"0x9132151475ACCf0662C545Bc81FbC1741d978EE0"}]},{"permission":"validate","to":"0x62A5cE01D91fEe98678D4346890c8E7ABB4695A6","description":"Can propose new state roots (called nodes) and challenge state roots on the host chain.","via":[]},{"permission":"validate","to":"0x834999E1D729Ead48Ae1Db1dAa11463102EccB77","description":"Can propose new state roots (called nodes) and challenge state roots on the host chain.","via":[]},{"permission":"validate","to":"0xa7F450595Db1e14E70570a1AdFA15678fbC7bceD","description":"Can propose new state roots (called nodes) and challenge state roots on the host chain.","via":[]},{"permission":"validate","to":"0xd5950958024F46FcBe7C8D7Bb6815Ce35F654635","description":"Can propose new state roots (called nodes) and challenge state roots on the host chain.","via":[]},{"permission":"validate","to":"0xedbFE5493367F8fBc340276503D3c18D2C02E9AE","description":"Can propose new state roots (called nodes) and challenge state roots on the host chain.","via":[]},{"permission":"validate","to":"0xF4620078b10CDfD0Dc8E4BCec4250642fa5B517b","description":"Can propose new state roots (called nodes) and challenge state roots on the host chain.","via":[]}]
    }
```

```diff
    contract RollupEventInbox (0xD36cd2624a7187ED41ec30FC1d6E6B7b3abAf251) {
    +++ description: Helper contract sending configuration data over the bridge during the systems initialization.
      issuedPermissions:
-        [{"permission":"upgrade","to":"0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb","via":[{"address":"0x9132151475ACCf0662C545Bc81FbC1741d978EE0"},{"address":"0x79daC9c2deC3E4411a2cB2b0ecf654D27a4AFf0A"}]}]
    }
```

```diff
    contract GatewayRouter (0xDa4ac9E9cB8Af8afBB2Df1ffe7b82efEA17ba0f6) {
    +++ description: This routing contract maps tokens to the correct escrow (gateway) to be then bridged with canonical messaging.
      issuedPermissions:
-        [{"permission":"upgrade","to":"0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb","via":[{"address":"0x9132151475ACCf0662C545Bc81FbC1741d978EE0"},{"address":"0x79daC9c2deC3E4411a2cB2b0ecf654D27a4AFf0A"}]}]
    }
```

```diff
    contract CustomGateway (0xDd7A9dEcBB0b16B37fE6777e245b18fC0aC63759) {
    +++ description: Escrows deposited assets for the canonical bridge that are externally governed or need custom token contracts with e.g. minting rights or upgradeability.
      issuedPermissions:
-        [{"permission":"upgrade","to":"0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb","via":[{"address":"0x9132151475ACCf0662C545Bc81FbC1741d978EE0"},{"address":"0x79daC9c2deC3E4411a2cB2b0ecf654D27a4AFf0A"}]}]
    }
```

Generated with discovered.json: 0xed1a894a16d8d5ca783c2ba49c81c223bf24923b

# Diff at Tue, 25 Mar 2025 08:43:34 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@b4a04714c0219993c2a83e7714e82e32f8a106ba block: 314868001
- current block number: 319332430

## Description

Minor upgrade of Bridge, Inbox and SequencerInbox:
- logic for tokens with custom decimals
- 7702 adjustments
- SequencerInbox upgraded to known implementation

## Watched changes

```diff
    contract Bridge (0x2F12c50b46adB01a4961AdDa5038c0974C7C78e8) {
    +++ description: Escrow contract for the project's gas token (can be different from ETH). Keeps a list of allowed Inboxes and Outboxes for canonical bridge messaging.
      sourceHashes.1:
-        "0x057de68a7007d55f4394ba6eafb2c802efcaf13583ff9342ea4d0ee3924d9be1"
+        "0xa7e3f6c355703ed46fcb2156862c4f01792b87beb10a87a81ce3bd5beee79b67"
      sourceHashes.0:
-        "0xa7e3f6c355703ed46fcb2156862c4f01792b87beb10a87a81ce3bd5beee79b67"
+        "0x32c73666d391a33c17183e4ab20bcb0f2b925d8a99da436d2ff99c13f403e289"
      values.$implementation:
-        "0x2a6DD4433ffa96dc1755814FC0d9cc83A5F68DeC"
+        "0xdF0eaCC3F37356DF320e5B5db16C7eD7A6b596dd"
      values.$pastUpgrades.1:
+        ["2024-07-26T09:58:55.000Z","0x24734f0052e358b32f5c628be733754d6d852d5c22c114d07dbfea9d99d8670e",["0x2a6DD4433ffa96dc1755814FC0d9cc83A5F68DeC"]]
      values.$pastUpgrades.0.2.0:
-        "0x2a6DD4433ffa96dc1755814FC0d9cc83A5F68DeC"
+        "0xdF0eaCC3F37356DF320e5B5db16C7eD7A6b596dd"
      values.$pastUpgrades.0.1:
-        "2024-07-26T09:58:55.000Z"
+        "0x1e6e3cb414d9098a4d0cc7791ca3c91da1152941b65b09e3cd925df0a78a276b"
      values.$pastUpgrades.0.0:
-        "0x24734f0052e358b32f5c628be733754d6d852d5c22c114d07dbfea9d99d8670e"
+        "2025-03-24T11:48:05.000Z"
      values.$upgradeCount:
-        1
+        2
      values.nativeTokenDecimals:
+        18
    }
```

```diff
    contract Inbox (0x590044e628ea1B9C10a86738Cf7a7eeF52D031B8) {
    +++ description: Facilitates sending L1 to L2 messages like depositing ETH, but does not escrow funds.
      sourceHashes.0:
-        "0xcb390b491549387c8fcc09fb22fbea7adf54cc74b7247a0c738369ddd7049b92"
+        "0x25984fdfffb8141859c99299fb29e7a7460732d77111e5fe23792baa99f336a3"
      values.$implementation:
-        "0x7EfcB76D0e2E776A298aAa603d433336e5F8b6ab"
+        "0xD87f160f8c414d834cBDd9477c3D8c3ad1802255"
      values.$pastUpgrades.1:
+        ["2024-07-26T09:58:55.000Z","0x24734f0052e358b32f5c628be733754d6d852d5c22c114d07dbfea9d99d8670e",["0x7EfcB76D0e2E776A298aAa603d433336e5F8b6ab"]]
      values.$pastUpgrades.0.2:
-        ["0x7EfcB76D0e2E776A298aAa603d433336e5F8b6ab"]
+        "0x0c2b46c93025ed6c2500f99e813d57f91bbdb89f4cb884f122948ab6ddbe135e"
      values.$pastUpgrades.0.1:
-        "2024-07-26T09:58:55.000Z"
+        ["0xD87f160f8c414d834cBDd9477c3D8c3ad1802255"]
      values.$pastUpgrades.0.0:
-        "0x24734f0052e358b32f5c628be733754d6d852d5c22c114d07dbfea9d99d8670e"
+        "2025-03-24T15:50:19.000Z"
      values.$upgradeCount:
-        1
+        2
    }
```

```diff
    contract SequencerInbox (0xA3464bf0ed52cFe6676D3e34ab1F4DF53f193631) {
    +++ description: A sequencer (registered in this contract) can submit transaction batches or commitments here.
      sourceHashes.0:
-        "0x50cf57b01499408fa99da27cf0fee96ec30f0d40667d1aa090c442bc80f0636b"
+        "0x6bb86ac4bd0d31e049f543fcf0a8f94c952252222f115246ef9d5b8104d803cc"
      values.$implementation:
-        "0x7a299aD29499736994Aa3a9aFa3f476445FAEB2c"
+        "0x7be08B013de2b23a6329De51C4994f841dcE1a10"
      values.$pastUpgrades.1:
+        ["2024-07-26T09:58:55.000Z","0x24734f0052e358b32f5c628be733754d6d852d5c22c114d07dbfea9d99d8670e",["0x7a299aD29499736994Aa3a9aFa3f476445FAEB2c"]]
      values.$pastUpgrades.0.2:
-        "2024-07-26T09:58:55.000Z"
+        ["0x7be08B013de2b23a6329De51C4994f841dcE1a10"]
      values.$pastUpgrades.0.1:
-        ["0x7a299aD29499736994Aa3a9aFa3f476445FAEB2c"]
+        "0x0c2b46c93025ed6c2500f99e813d57f91bbdb89f4cb884f122948ab6ddbe135e"
      values.$pastUpgrades.0.0:
-        "0x24734f0052e358b32f5c628be733754d6d852d5c22c114d07dbfea9d99d8670e"
+        "2025-03-24T15:50:19.000Z"
      values.$upgradeCount:
-        1
+        2
    }
```

## Source code changes

```diff
.../Bridge/ERC20Bridge.sol                         | 54 +++++++++++++
 .../Inbox/ERC20Inbox.sol                           | 92 +++++++++++++++++++---
 .../SequencerInbox/SequencerInbox.sol              | 24 ++++--
 3 files changed, 152 insertions(+), 18 deletions(-)
```

Generated with discovered.json: 0x9d0a5b080f8e06e421d5b13ccf2eb16a9df54661

# Diff at Tue, 18 Mar 2025 08:14:52 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@4ef7a8dbcec1cd9fec77aae2b73d81347a4ffb13 block: 314868001
- current block number: 314868001

## Description

Config: change Multisig names.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 314868001 (main branch discovery), not current.

```diff
    contract Gelato Multisig (0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb) {
    +++ description: None
      name:
-        "GelatoMultisig"
+        "Gelato Multisig"
    }
```

Generated with discovered.json: 0x17e183ffb97b8baf6ce23bcd432bec4a38c17402

# Diff at Tue, 11 Mar 2025 12:02:34 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@a75ac906056abb236c14b626853813f468099f57 block: 314282927
- current block number: 314559498

## Description

2 more validators are staking (all are staking now).

## Watched changes

```diff
    contract RollupProxy (0xBaE3B462a2A7fb758F66D91170514C10B14Ce914) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      values.stakerCount:
-        4
+        6
    }
```

Generated with discovered.json: 0x3c949608d77cd1795ed6fb02b6993faa3f98eb98

# Diff at Mon, 10 Mar 2025 16:48:04 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@ef4d1036423fe7d398c41e6cf238a209cc1ff8f3 block: 313221510
- current block number: 314282927

## Description

Add 4 validators.

## Watched changes

```diff
    contract undefined (0x62A5cE01D91fEe98678D4346890c8E7ABB4695A6) {
    +++ description: None
      receivedPermissions:
+        [{"permission":"validate","from":"0xBaE3B462a2A7fb758F66D91170514C10B14Ce914","description":"Can propose new state roots (called nodes) and challenge state roots on the host chain."}]
    }
```

```diff
    contract undefined (0x834999E1D729Ead48Ae1Db1dAa11463102EccB77) {
    +++ description: None
      receivedPermissions:
+        [{"permission":"validate","from":"0xBaE3B462a2A7fb758F66D91170514C10B14Ce914","description":"Can propose new state roots (called nodes) and challenge state roots on the host chain."}]
    }
```

```diff
    contract undefined (0xa7F450595Db1e14E70570a1AdFA15678fbC7bceD) {
    +++ description: None
      receivedPermissions:
+        [{"permission":"validate","from":"0xBaE3B462a2A7fb758F66D91170514C10B14Ce914","description":"Can propose new state roots (called nodes) and challenge state roots on the host chain."}]
    }
```

```diff
    contract RollupProxy (0xBaE3B462a2A7fb758F66D91170514C10B14Ce914) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      issuedPermissions.8:
+        {"permission":"validate","to":"0xF4620078b10CDfD0Dc8E4BCec4250642fa5B517b","description":"Can propose new state roots (called nodes) and challenge state roots on the host chain.","via":[]}
      issuedPermissions.7:
+        {"permission":"validate","to":"0xedbFE5493367F8fBc340276503D3c18D2C02E9AE","description":"Can propose new state roots (called nodes) and challenge state roots on the host chain.","via":[]}
      issuedPermissions.6:
+        {"permission":"validate","to":"0xd5950958024F46FcBe7C8D7Bb6815Ce35F654635","description":"Can propose new state roots (called nodes) and challenge state roots on the host chain.","via":[]}
      issuedPermissions.5:
+        {"permission":"validate","to":"0xa7F450595Db1e14E70570a1AdFA15678fbC7bceD","description":"Can propose new state roots (called nodes) and challenge state roots on the host chain.","via":[]}
      issuedPermissions.4.to:
-        "0xF4620078b10CDfD0Dc8E4BCec4250642fa5B517b"
+        "0x834999E1D729Ead48Ae1Db1dAa11463102EccB77"
      issuedPermissions.3.to:
-        "0xd5950958024F46FcBe7C8D7Bb6815Ce35F654635"
+        "0x62A5cE01D91fEe98678D4346890c8E7ABB4695A6"
+++ description: Increments on each Validator change.
      values.setValidatorCount:
-        7
+        8
      values.stakerCount:
-        2
+        4
      values.validators.5:
+        "0xedbFE5493367F8fBc340276503D3c18D2C02E9AE"
      values.validators.4:
+        "0xd5950958024F46FcBe7C8D7Bb6815Ce35F654635"
      values.validators.3:
+        "0xa7F450595Db1e14E70570a1AdFA15678fbC7bceD"
      values.validators.2:
+        "0xF4620078b10CDfD0Dc8E4BCec4250642fa5B517b"
      values.validators.1:
-        "0xd5950958024F46FcBe7C8D7Bb6815Ce35F654635"
+        "0x834999E1D729Ead48Ae1Db1dAa11463102EccB77"
      values.validators.0:
-        "0xF4620078b10CDfD0Dc8E4BCec4250642fa5B517b"
+        "0x62A5cE01D91fEe98678D4346890c8E7ABB4695A6"
    }
```

```diff
    contract undefined (0xedbFE5493367F8fBc340276503D3c18D2C02E9AE) {
    +++ description: None
      receivedPermissions:
+        [{"permission":"validate","from":"0xBaE3B462a2A7fb758F66D91170514C10B14Ce914","description":"Can propose new state roots (called nodes) and challenge state roots on the host chain."}]
    }
```

Generated with discovered.json: 0xff58ecc47c1ba0e7fa37a7fd5e33f296766f40cc

# Diff at Fri, 07 Mar 2025 14:52:25 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@c5dbe2ef6b8273c834507deba40dda8a1affce55 block: 308396879
- current block number: 313221510

## Description

Validators removed, fastConfirmer MS threshold raised.

## Watched changes

```diff
    contract RollupProxy (0xBaE3B462a2A7fb758F66D91170514C10B14Ce914) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      issuedPermissions.16:
-        {"permission":"validate","to":"0xedbFE5493367F8fBc340276503D3c18D2C02E9AE","description":"Can propose new state roots (called nodes) and challenge state roots on the host chain.","via":[{"address":"0xF4620078b10CDfD0Dc8E4BCec4250642fa5B517b"}]}
      issuedPermissions.15:
-        {"permission":"validate","to":"0xedbFE5493367F8fBc340276503D3c18D2C02E9AE","description":"Can propose new state roots (called nodes) and challenge state roots on the host chain.","via":[]}
      issuedPermissions.14:
-        {"permission":"validate","to":"0xd5950958024F46FcBe7C8D7Bb6815Ce35F654635","description":"Can propose new state roots (called nodes) and challenge state roots on the host chain.","via":[{"address":"0xF4620078b10CDfD0Dc8E4BCec4250642fa5B517b"}]}
      issuedPermissions.13:
-        {"permission":"validate","to":"0xd5950958024F46FcBe7C8D7Bb6815Ce35F654635","description":"Can propose new state roots (called nodes) and challenge state roots on the host chain.","via":[]}
      issuedPermissions.12:
-        {"permission":"validate","to":"0xa7F450595Db1e14E70570a1AdFA15678fbC7bceD","description":"Can propose new state roots (called nodes) and challenge state roots on the host chain.","via":[{"address":"0xF4620078b10CDfD0Dc8E4BCec4250642fa5B517b"}]}
      issuedPermissions.11:
-        {"permission":"validate","to":"0xa7F450595Db1e14E70570a1AdFA15678fbC7bceD","description":"Can propose new state roots (called nodes) and challenge state roots on the host chain.","via":[]}
      issuedPermissions.10:
-        {"permission":"validate","to":"0x834999E1D729Ead48Ae1Db1dAa11463102EccB77","description":"Can propose new state roots (called nodes) and challenge state roots on the host chain.","via":[{"address":"0xF4620078b10CDfD0Dc8E4BCec4250642fa5B517b"}]}
      issuedPermissions.9:
-        {"permission":"validate","to":"0x834999E1D729Ead48Ae1Db1dAa11463102EccB77","description":"Can propose new state roots (called nodes) and challenge state roots on the host chain.","via":[]}
      issuedPermissions.8:
-        {"permission":"validate","to":"0x62A5cE01D91fEe98678D4346890c8E7ABB4695A6","description":"Can propose new state roots (called nodes) and challenge state roots on the host chain.","via":[{"address":"0xF4620078b10CDfD0Dc8E4BCec4250642fa5B517b"}]}
      issuedPermissions.7:
-        {"permission":"validate","to":"0x62A5cE01D91fEe98678D4346890c8E7ABB4695A6","description":"Can propose new state roots (called nodes) and challenge state roots on the host chain.","via":[]}
      issuedPermissions.6:
-        {"permission":"upgrade","to":"0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb","via":[{"address":"0x9132151475ACCf0662C545Bc81FbC1741d978EE0"}]}
      issuedPermissions.5:
-        {"permission":"interact","to":"0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb","description":"Pause and unpause and set important roles and parameters in the system contracts: Can delegate Sequencer management to a BatchPosterManager address, manage data availability, DACs and the fastConfirmer role, set the Sequencer-only window, introduce an allowList to the bridge and whitelist Inboxes/Outboxes.","via":[{"address":"0x9132151475ACCf0662C545Bc81FbC1741d978EE0"}]}
      issuedPermissions.4.permission:
-        "fastconfirm"
+        "validate"
      issuedPermissions.4.to:
-        "0xedbFE5493367F8fBc340276503D3c18D2C02E9AE"
+        "0xF4620078b10CDfD0Dc8E4BCec4250642fa5B517b"
      issuedPermissions.4.description:
-        "Can finalize a state root before the challenge period has passed. This allows withdrawing from the bridge based on the state root."
+        "Can propose new state roots (called nodes) and challenge state roots on the host chain."
      issuedPermissions.4.via.0:
-        {"address":"0xF4620078b10CDfD0Dc8E4BCec4250642fa5B517b"}
      issuedPermissions.3.permission:
-        "fastconfirm"
+        "validate"
      issuedPermissions.3.description:
-        "Can finalize a state root before the challenge period has passed. This allows withdrawing from the bridge based on the state root."
+        "Can propose new state roots (called nodes) and challenge state roots on the host chain."
      issuedPermissions.3.via.0:
-        {"address":"0xF4620078b10CDfD0Dc8E4BCec4250642fa5B517b"}
      issuedPermissions.2.permission:
-        "fastconfirm"
+        "upgrade"
      issuedPermissions.2.to:
-        "0xa7F450595Db1e14E70570a1AdFA15678fbC7bceD"
+        "0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb"
      issuedPermissions.2.description:
-        "Can finalize a state root before the challenge period has passed. This allows withdrawing from the bridge based on the state root."
      issuedPermissions.2.via.0.address:
-        "0xF4620078b10CDfD0Dc8E4BCec4250642fa5B517b"
+        "0x9132151475ACCf0662C545Bc81FbC1741d978EE0"
      issuedPermissions.1.permission:
-        "fastconfirm"
+        "interact"
      issuedPermissions.1.to:
-        "0x834999E1D729Ead48Ae1Db1dAa11463102EccB77"
+        "0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb"
      issuedPermissions.1.description:
-        "Can finalize a state root before the challenge period has passed. This allows withdrawing from the bridge based on the state root."
+        "Pause and unpause and set important roles and parameters in the system contracts: Can delegate Sequencer management to a BatchPosterManager address, manage data availability, DACs and the fastConfirmer role, set the Sequencer-only window, introduce an allowList to the bridge and whitelist Inboxes/Outboxes."
      issuedPermissions.1.via.0.address:
-        "0xF4620078b10CDfD0Dc8E4BCec4250642fa5B517b"
+        "0x9132151475ACCf0662C545Bc81FbC1741d978EE0"
      issuedPermissions.0.to:
-        "0x62A5cE01D91fEe98678D4346890c8E7ABB4695A6"
+        "0xF4620078b10CDfD0Dc8E4BCec4250642fa5B517b"
      issuedPermissions.0.via.0:
-        {"address":"0xF4620078b10CDfD0Dc8E4BCec4250642fa5B517b"}
      values.baseStake:
-        "100000000000000000"
+        "10000000000000000"
      values.currentRequiredStake:
-        "100000000000000000"
+        "10000000000000000"
+++ description: Increments on each Validator change.
      values.setValidatorCount:
-        6
+        7
      values.validators.5:
-        "0xedbFE5493367F8fBc340276503D3c18D2C02E9AE"
      values.validators.4:
-        "0xd5950958024F46FcBe7C8D7Bb6815Ce35F654635"
      values.validators.3:
-        "0xa7F450595Db1e14E70570a1AdFA15678fbC7bceD"
      values.validators.2:
-        "0xF4620078b10CDfD0Dc8E4BCec4250642fa5B517b"
      values.validators.1:
-        "0x834999E1D729Ead48Ae1Db1dAa11463102EccB77"
+        "0xd5950958024F46FcBe7C8D7Bb6815Ce35F654635"
      values.validators.0:
-        "0x62A5cE01D91fEe98678D4346890c8E7ABB4695A6"
+        "0xF4620078b10CDfD0Dc8E4BCec4250642fa5B517b"
    }
```

```diff
    contract EduFastConfirmerMultisig (0xF4620078b10CDfD0Dc8E4BCec4250642fa5B517b) {
    +++ description: None
      directlyReceivedPermissions:
-        [{"permission":"fastconfirm","from":"0xBaE3B462a2A7fb758F66D91170514C10B14Ce914","description":"Can finalize a state root before the challenge period has passed. This allows withdrawing from the bridge based on the state root."},{"permission":"validate","from":"0xBaE3B462a2A7fb758F66D91170514C10B14Ce914","description":"Can propose new state roots (called nodes) and challenge state roots on the host chain."}]
      values.$threshold:
-        1
+        3
      values.multisigThreshold:
-        "1 of 5 (20%)"
+        "3 of 5 (60%)"
      receivedPermissions:
+        [{"permission":"fastconfirm","from":"0xBaE3B462a2A7fb758F66D91170514C10B14Ce914","description":"Can finalize a state root before the challenge period has passed. This allows withdrawing from the bridge based on the state root."},{"permission":"validate","from":"0xBaE3B462a2A7fb758F66D91170514C10B14Ce914","description":"Can propose new state roots (called nodes) and challenge state roots on the host chain."}]
    }
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 308396879 (main branch discovery), not current.

```diff
    contract RollupProxy (0xBaE3B462a2A7fb758F66D91170514C10B14Ce914) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      values.isPostBoLD:
+        false
    }
```

Generated with discovered.json: 0x35525af947c23011943a96d4641b176dcc0298a3

# Diff at Thu, 06 Mar 2025 09:39:10 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@7119c715545bc86a4194761f42815f811ac6307a block: 308396879
- current block number: 308396879

## Description

Config related: set severity for arbitrum inbox/outbox changes to high and add historical In- and Outboxes via events.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 308396879 (main branch discovery), not current.

```diff
    contract Bridge (0x2F12c50b46adB01a4961AdDa5038c0974C7C78e8) {
    +++ description: Escrow contract for the project's gas token (can be different from ETH). Keeps a list of allowed Inboxes and Outboxes for canonical bridge messaging.
+++ description: All Inboxes that were ever set as allowed in the bridge.
+++ severity: HIGH
      values.inboxHistory:
+        ["0x590044e628ea1B9C10a86738Cf7a7eeF52D031B8","0xD36cd2624a7187ED41ec30FC1d6E6B7b3abAf251"]
+++ description: All Outboxes that were ever set as allowed in the bridge.
+++ severity: HIGH
      values.outboxHistory:
+        ["0x6339965Cb3002f5c746895e4eD895bd775dbfdf9"]
      fieldMeta:
+        {"allowedOutboxList":{"severity":"HIGH","description":"Can make calls as the bridge, steal all funds."},"outboxHistory":{"severity":"HIGH","description":"All Outboxes that were ever set as allowed in the bridge."},"allowedDelayedInboxList":{"severity":"HIGH","description":"Allowed to mint the gastoken on L2 and call `enqueueDelayedMessage()` on the bridge."},"inboxHistory":{"severity":"HIGH","description":"All Inboxes that were ever set as allowed in the bridge."}}
    }
```

Generated with discovered.json: 0xd1a44cf8edcfdf75242ee12076500562e96bac72

# Diff at Tue, 04 Mar 2025 10:40:24 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@98d260b45fe0d2195ce5e629bd7b200c8706e8ba block: 308396879
- current block number: 308396879

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 308396879 (main branch discovery), not current.

```diff
    contract ChallengeManager (0x14dBe58192B60b5207b86c751255B34550Bd12Fb) {
    +++ description: Contract that allows challenging state roots. Can be called through the RollupProxy by Validators or the UpgradeExecutor.
      sinceBlock:
+        236209349
    }
```

```diff
    contract Bridge (0x2F12c50b46adB01a4961AdDa5038c0974C7C78e8) {
    +++ description: Escrow contract for the project's gas token (can be different from ETH). Keeps a list of allowed Inboxes and Outboxes for canonical bridge messaging.
      sinceBlock:
+        236209349
    }
```

```diff
    contract OneStepProverHostIo (0x33c1514Bf90e202d242C299b37C60f908aa206D4) {
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
      sinceBlock:
+        244802957
    }
```

```diff
    contract ERC20Gateway (0x419e439e5c0B839d6e31d7C438939EEE1A4f4184) {
    +++ description: Escrows deposited ERC-20 assets for the canonical Bridge. Upon depositing, a generic token representation will be minted at the destination. Withdrawals are initiated by the Outbox contract.
      sinceBlock:
+        236229324
    }
```

```diff
    contract OneStepProver0 (0x54E0923782b701044444De5d8c3A45aC890b0881) {
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
      sinceBlock:
+        244802857
    }
```

```diff
    contract Inbox (0x590044e628ea1B9C10a86738Cf7a7eeF52D031B8) {
    +++ description: Facilitates sending L1 to L2 messages like depositing ETH, but does not escrow funds.
      sinceBlock:
+        236209349
    }
```

```diff
    contract Outbox (0x6339965Cb3002f5c746895e4eD895bd775dbfdf9) {
    +++ description: Facilitates L2 to L1 contract calls: Messages initiated from L2 (for example withdrawal messages) eventually resolve in execution on L1.
      sinceBlock:
+        236209349
    }
```

```diff
    contract ValidatorUtils (0x6c21303F5986180B1394d2C89f3e883890E2867b) {
    +++ description: This contract implements view only utilities for validators.
      sinceBlock:
+        150599283
    }
```

```diff
    contract ProxyAdmin (0x79daC9c2deC3E4411a2cB2b0ecf654D27a4AFf0A) {
    +++ description: None
      sinceBlock:
+        236209349
    }
```

```diff
    contract UpgradeExecutor (0x9132151475ACCf0662C545Bc81FbC1741d978EE0) {
    +++ description: Central contract defining the access control permissions for upgrading the system contract implementations.
      sinceBlock:
+        236209349
    }
```

```diff
    contract SequencerInbox (0xA3464bf0ed52cFe6676D3e34ab1F4DF53f193631) {
    +++ description: A sequencer (registered in this contract) can submit transaction batches or commitments here.
      sinceBlock:
+        236209349
    }
```

```diff
    contract RollupProxy (0xBaE3B462a2A7fb758F66D91170514C10B14Ce914) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      sinceBlock:
+        236209349
    }
```

```diff
    contract GelatoMultisig (0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb) {
    +++ description: None
      sinceBlock:
+        279126022
    }
```

```diff
    contract RollupEventInbox (0xD36cd2624a7187ED41ec30FC1d6E6B7b3abAf251) {
    +++ description: Helper contract sending configuration data over the bridge during the systems initialization.
      sinceBlock:
+        236209349
    }
```

```diff
    contract OneStepProofEntry (0xD89d54007079071cBA859127318b9F34eeB78049) {
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
      sinceBlock:
+        244802990
    }
```

```diff
    contract GatewayRouter (0xDa4ac9E9cB8Af8afBB2Df1ffe7b82efEA17ba0f6) {
    +++ description: This routing contract maps tokens to the correct escrow (gateway) to be then bridged with canonical messaging.
      sinceBlock:
+        236229324
    }
```

```diff
    contract CustomGateway (0xDd7A9dEcBB0b16B37fE6777e245b18fC0aC63759) {
    +++ description: Escrows deposited assets for the canonical bridge that are externally governed or need custom token contracts with e.g. minting rights or upgradeability.
      sinceBlock:
+        236229324
    }
```

```diff
    contract OneStepProverMath (0xE58a2dEb5718F9aAF2C1DdD0E366ED076D204cc4) {
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
      sinceBlock:
+        244802923
    }
```

```diff
    contract EduFastConfirmerMultisig (0xF4620078b10CDfD0Dc8E4BCec4250642fa5B517b) {
    +++ description: None
      sinceBlock:
+        268815651
    }
```

```diff
    contract OneStepProverMemory (0xf8E5e5562c2c12d8690786f5C9FA65F20F6bD881) {
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
      sinceBlock:
+        244802890
    }
```

Generated with discovered.json: 0x0b4250d886fd9f9aad39263ad3958c0a968673b0

# Diff at Thu, 27 Feb 2025 11:47:24 GMT:

- author: Michał Podsiadły (<michal.podsiadly@l2beat.com>)
- comparing to: main@a4b50e45bb44f8ceeea29f9236088d26a843c885 block: 308396879
- current block number: 308396879

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 308396879 (main branch discovery), not current.

```diff
    contract Bridge (0x2F12c50b46adB01a4961AdDa5038c0974C7C78e8) {
    +++ description: Escrow contract for the project's gas token (can be different from ETH). Keeps a list of allowed Inboxes and Outboxes for canonical bridge messaging.
      name:
-        "ERC20Bridge"
+        "Bridge"
      displayName:
-        "Bridge"
    }
```

```diff
    contract ERC20Gateway (0x419e439e5c0B839d6e31d7C438939EEE1A4f4184) {
    +++ description: Escrows deposited ERC-20 assets for the canonical Bridge. Upon depositing, a generic token representation will be minted at the destination. Withdrawals are initiated by the Outbox contract.
      name:
-        "L1OrbitERC20Gateway"
+        "ERC20Gateway"
      displayName:
-        "ERC20Gateway"
    }
```

```diff
    contract Inbox (0x590044e628ea1B9C10a86738Cf7a7eeF52D031B8) {
    +++ description: Facilitates sending L1 to L2 messages like depositing ETH, but does not escrow funds.
      name:
-        "ERC20Inbox"
+        "Inbox"
      displayName:
-        "Inbox"
    }
```

```diff
    contract Outbox (0x6339965Cb3002f5c746895e4eD895bd775dbfdf9) {
    +++ description: Facilitates L2 to L1 contract calls: Messages initiated from L2 (for example withdrawal messages) eventually resolve in execution on L1.
      name:
-        "ERC20Outbox"
+        "Outbox"
      displayName:
-        "Outbox"
    }
```

```diff
    contract RollupEventInbox (0xD36cd2624a7187ED41ec30FC1d6E6B7b3abAf251) {
    +++ description: Helper contract sending configuration data over the bridge during the systems initialization.
      name:
-        "ERC20RollupEventInbox"
+        "RollupEventInbox"
      displayName:
-        "RollupEventInbox"
    }
```

```diff
    contract GatewayRouter (0xDa4ac9E9cB8Af8afBB2Df1ffe7b82efEA17ba0f6) {
    +++ description: This routing contract maps tokens to the correct escrow (gateway) to be then bridged with canonical messaging.
      name:
-        "L1OrbitGatewayRouter"
+        "GatewayRouter"
      displayName:
-        "GatewayRouter"
    }
```

```diff
    contract CustomGateway (0xDd7A9dEcBB0b16B37fE6777e245b18fC0aC63759) {
    +++ description: Escrows deposited assets for the canonical bridge that are externally governed or need custom token contracts with e.g. minting rights or upgradeability.
      name:
-        "L1OrbitCustomGateway"
+        "CustomGateway"
      displayName:
-        "CustomGateway"
    }
```

Generated with discovered.json: 0x67b02364fb5be6bf1fe5fe539d253c9f4f89eb76

# Diff at Fri, 21 Feb 2025 13:51:36 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@d219f271711b2cf7a164e3443bead5e4957d13a8 block: 298084261
- current block number: 308396879

## Description

Add operator addresses.
Config related: Set orbit stack contract categories.

## Watched changes

```diff
    contract SequencerInbox (0xA3464bf0ed52cFe6676D3e34ab1F4DF53f193631) {
    +++ description: A sequencer (registered in this contract) can submit transaction batches or commitments here.
      issuedPermissions.0.to:
-        "0x0816e1EeE08C701001e5a846f5ae2ee93FABb608"
+        "0xeA64C25e6Ea873D5cffb045b80BEc605ABE06647"
      values.batchPosters.0:
-        "0x0816e1EeE08C701001e5a846f5ae2ee93FABb608"
+        "0xeA64C25e6Ea873D5cffb045b80BEc605ABE06647"
      values.setIsBatchPosterCount:
-        1
+        3
    }
```

```diff
    contract RollupProxy (0xBaE3B462a2A7fb758F66D91170514C10B14Ce914) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      issuedPermissions.14.to:
-        "0xbdA6d4ecbb176e12314361DF779bdB428f368163"
+        "0xd5950958024F46FcBe7C8D7Bb6815Ce35F654635"
      issuedPermissions.13.to:
-        "0xbdA6d4ecbb176e12314361DF779bdB428f368163"
+        "0xd5950958024F46FcBe7C8D7Bb6815Ce35F654635"
      issuedPermissions.3.to:
-        "0xbdA6d4ecbb176e12314361DF779bdB428f368163"
+        "0xd5950958024F46FcBe7C8D7Bb6815Ce35F654635"
+++ description: Increments on each Validator change.
      values.setValidatorCount:
-        4
+        6
      values.stakerCount:
-        1
+        2
      values.validators.4:
-        "0xbdA6d4ecbb176e12314361DF779bdB428f368163"
+        "0xd5950958024F46FcBe7C8D7Bb6815Ce35F654635"
    }
```

```diff
    contract EduFastConfirmerMultisig (0xF4620078b10CDfD0Dc8E4BCec4250642fa5B517b) {
    +++ description: None
      values.$members.4:
-        "0xbdA6d4ecbb176e12314361DF779bdB428f368163"
+        "0xa7F450595Db1e14E70570a1AdFA15678fbC7bceD"
      values.$members.3:
-        "0xa7F450595Db1e14E70570a1AdFA15678fbC7bceD"
+        "0x62A5cE01D91fEe98678D4346890c8E7ABB4695A6"
      values.$members.2:
-        "0x62A5cE01D91fEe98678D4346890c8E7ABB4695A6"
+        "0x834999E1D729Ead48Ae1Db1dAa11463102EccB77"
      values.$members.1:
-        "0x834999E1D729Ead48Ae1Db1dAa11463102EccB77"
+        "0xedbFE5493367F8fBc340276503D3c18D2C02E9AE"
      values.$members.0:
-        "0xedbFE5493367F8fBc340276503D3c18D2C02E9AE"
+        "0xd5950958024F46FcBe7C8D7Bb6815Ce35F654635"
    }
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 298084261 (main branch discovery), not current.

```diff
    contract ChallengeManager (0x14dBe58192B60b5207b86c751255B34550Bd12Fb) {
    +++ description: Contract that allows challenging state roots. Can be called through the RollupProxy by Validators or the UpgradeExecutor.
      category:
+        {"name":"Local Infrastructure","priority":5}
    }
```

```diff
    contract ERC20Bridge (0x2F12c50b46adB01a4961AdDa5038c0974C7C78e8) {
    +++ description: Escrow contract for the project's gas token (can be different from ETH). Keeps a list of allowed Inboxes and Outboxes for canonical bridge messaging.
      category:
+        {"name":"Local Infrastructure","priority":5}
    }
```

```diff
    contract L1OrbitERC20Gateway (0x419e439e5c0B839d6e31d7C438939EEE1A4f4184) {
    +++ description: Escrows deposited ERC-20 assets for the canonical Bridge. Upon depositing, a generic token representation will be minted at the destination. Withdrawals are initiated by the Outbox contract.
      category:
+        {"name":"Canonical Bridges","priority":2}
    }
```

```diff
    contract ERC20Inbox (0x590044e628ea1B9C10a86738Cf7a7eeF52D031B8) {
    +++ description: Facilitates sending L1 to L2 messages like depositing ETH, but does not escrow funds.
      category:
+        {"name":"Canonical Bridges","priority":2}
    }
```

```diff
    contract ERC20Outbox (0x6339965Cb3002f5c746895e4eD895bd775dbfdf9) {
    +++ description: Facilitates L2 to L1 contract calls: Messages initiated from L2 (for example withdrawal messages) eventually resolve in execution on L1.
      category:
+        {"name":"Canonical Bridges","priority":2}
    }
```

```diff
    contract UpgradeExecutor (0x9132151475ACCf0662C545Bc81FbC1741d978EE0) {
    +++ description: Central contract defining the access control permissions for upgrading the system contract implementations.
      category:
+        {"name":"Governance","priority":3}
    }
```

```diff
    contract SequencerInbox (0xA3464bf0ed52cFe6676D3e34ab1F4DF53f193631) {
    +++ description: A sequencer (registered in this contract) can submit transaction batches or commitments here.
      category:
+        {"name":"Local Infrastructure","priority":5}
    }
```

```diff
    contract RollupProxy (0xBaE3B462a2A7fb758F66D91170514C10B14Ce914) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      category:
+        {"name":"Local Infrastructure","priority":5}
    }
```

```diff
    contract L1OrbitGatewayRouter (0xDa4ac9E9cB8Af8afBB2Df1ffe7b82efEA17ba0f6) {
    +++ description: This routing contract maps tokens to the correct escrow (gateway) to be then bridged with canonical messaging.
      category:
+        {"name":"External Bridges","priority":1}
    }
```

```diff
    contract L1OrbitCustomGateway (0xDd7A9dEcBB0b16B37fE6777e245b18fC0aC63759) {
    +++ description: Escrows deposited assets for the canonical bridge that are externally governed or need custom token contracts with e.g. minting rights or upgradeability.
      category:
+        {"name":"External Bridges","priority":1}
    }
```

Generated with discovered.json: 0x37e0fd5ea85e1b1e4048aef731bef96bd1162051

# Diff at Tue, 04 Feb 2025 12:33:54 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@145553eed7ba44636411ecb25e4099728acd02f9 block: 298084261
- current block number: 298084261

## Description

Rename 'configure' permission to 'interact'

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 298084261 (main branch discovery), not current.

```diff
    contract UpgradeExecutor (0x9132151475ACCf0662C545Bc81FbC1741d978EE0) {
    +++ description: Central contract defining the access control permissions for upgrading the system contract implementations.
      directlyReceivedPermissions.1.permission:
-        "configure"
+        "interact"
    }
```

```diff
    contract RollupProxy (0xBaE3B462a2A7fb758F66D91170514C10B14Ce914) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      issuedPermissions.5.permission:
-        "fastconfirm"
+        "interact"
      issuedPermissions.5.to:
-        "0xedbFE5493367F8fBc340276503D3c18D2C02E9AE"
+        "0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb"
      issuedPermissions.5.description:
-        "Can finalize a state root before the challenge period has passed. This allows withdrawing from the bridge based on the state root."
+        "Pause and unpause and set important roles and parameters in the system contracts: Can delegate Sequencer management to a BatchPosterManager address, manage data availability, DACs and the fastConfirmer role, set the Sequencer-only window, introduce an allowList to the bridge and whitelist Inboxes/Outboxes."
      issuedPermissions.5.via.0.address:
-        "0xF4620078b10CDfD0Dc8E4BCec4250642fa5B517b"
+        "0x9132151475ACCf0662C545Bc81FbC1741d978EE0"
      issuedPermissions.4.to:
-        "0xbdA6d4ecbb176e12314361DF779bdB428f368163"
+        "0xedbFE5493367F8fBc340276503D3c18D2C02E9AE"
      issuedPermissions.3.to:
-        "0xa7F450595Db1e14E70570a1AdFA15678fbC7bceD"
+        "0xbdA6d4ecbb176e12314361DF779bdB428f368163"
      issuedPermissions.2.to:
-        "0x834999E1D729Ead48Ae1Db1dAa11463102EccB77"
+        "0xa7F450595Db1e14E70570a1AdFA15678fbC7bceD"
      issuedPermissions.1.to:
-        "0x62A5cE01D91fEe98678D4346890c8E7ABB4695A6"
+        "0x834999E1D729Ead48Ae1Db1dAa11463102EccB77"
      issuedPermissions.0.permission:
-        "configure"
+        "fastconfirm"
      issuedPermissions.0.to:
-        "0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb"
+        "0x62A5cE01D91fEe98678D4346890c8E7ABB4695A6"
      issuedPermissions.0.description:
-        "Pause and unpause and set important roles and parameters in the system contracts: Can delegate Sequencer management to a BatchPosterManager address, manage data availability, DACs and the fastConfirmer role, set the Sequencer-only window, introduce an allowList to the bridge and whitelist Inboxes/Outboxes."
+        "Can finalize a state root before the challenge period has passed. This allows withdrawing from the bridge based on the state root."
      issuedPermissions.0.via.0.address:
-        "0x9132151475ACCf0662C545Bc81FbC1741d978EE0"
+        "0xF4620078b10CDfD0Dc8E4BCec4250642fa5B517b"
    }
```

```diff
    contract GelatoMultisig (0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb) {
    +++ description: None
      receivedPermissions.0.permission:
-        "configure"
+        "interact"
    }
```

Generated with discovered.json: 0x31e70c52bbd57ad0aad8c4f23108d655605da244

# Diff at Wed, 22 Jan 2025 12:13:06 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@ae0363af45e5c1f3ac9d68ef4ce62fdaada6de1c block: 297394465
- current block number: 298084261

## Description

New validators added to Fastconfirmer MS.

## Watched changes

```diff
    contract RollupProxy (0xBaE3B462a2A7fb758F66D91170514C10B14Ce914) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      issuedPermissions.16:
+        {"permission":"validate","to":"0xedbFE5493367F8fBc340276503D3c18D2C02E9AE","description":"Can propose new state roots (called nodes) and challenge state roots on the host chain.","via":[{"address":"0xF4620078b10CDfD0Dc8E4BCec4250642fa5B517b"}]}
      issuedPermissions.15:
+        {"permission":"validate","to":"0xedbFE5493367F8fBc340276503D3c18D2C02E9AE","description":"Can propose new state roots (called nodes) and challenge state roots on the host chain.","via":[]}
      issuedPermissions.14:
+        {"permission":"validate","to":"0xbdA6d4ecbb176e12314361DF779bdB428f368163","description":"Can propose new state roots (called nodes) and challenge state roots on the host chain.","via":[{"address":"0xF4620078b10CDfD0Dc8E4BCec4250642fa5B517b"}]}
      issuedPermissions.13:
+        {"permission":"validate","to":"0xbdA6d4ecbb176e12314361DF779bdB428f368163","description":"Can propose new state roots (called nodes) and challenge state roots on the host chain.","via":[]}
      issuedPermissions.12:
+        {"permission":"validate","to":"0xa7F450595Db1e14E70570a1AdFA15678fbC7bceD","description":"Can propose new state roots (called nodes) and challenge state roots on the host chain.","via":[{"address":"0xF4620078b10CDfD0Dc8E4BCec4250642fa5B517b"}]}
      issuedPermissions.11:
+        {"permission":"validate","to":"0xa7F450595Db1e14E70570a1AdFA15678fbC7bceD","description":"Can propose new state roots (called nodes) and challenge state roots on the host chain.","via":[]}
      issuedPermissions.10:
+        {"permission":"validate","to":"0x834999E1D729Ead48Ae1Db1dAa11463102EccB77","description":"Can propose new state roots (called nodes) and challenge state roots on the host chain.","via":[{"address":"0xF4620078b10CDfD0Dc8E4BCec4250642fa5B517b"}]}
      issuedPermissions.9:
+        {"permission":"validate","to":"0x834999E1D729Ead48Ae1Db1dAa11463102EccB77","description":"Can propose new state roots (called nodes) and challenge state roots on the host chain.","via":[]}
      issuedPermissions.8.to:
-        "0xedbFE5493367F8fBc340276503D3c18D2C02E9AE"
+        "0x62A5cE01D91fEe98678D4346890c8E7ABB4695A6"
      issuedPermissions.8.via.0:
+        {"address":"0xF4620078b10CDfD0Dc8E4BCec4250642fa5B517b"}
      issuedPermissions.7.to:
-        "0xbdA6d4ecbb176e12314361DF779bdB428f368163"
+        "0x62A5cE01D91fEe98678D4346890c8E7ABB4695A6"
      issuedPermissions.7.via.0:
-        {"address":"0xF4620078b10CDfD0Dc8E4BCec4250642fa5B517b"}
      issuedPermissions.6.permission:
-        "validate"
+        "upgrade"
      issuedPermissions.6.to:
-        "0xbdA6d4ecbb176e12314361DF779bdB428f368163"
+        "0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb"
      issuedPermissions.6.description:
-        "Can propose new state roots (called nodes) and challenge state roots on the host chain."
      issuedPermissions.6.via.0:
+        {"address":"0x9132151475ACCf0662C545Bc81FbC1741d978EE0"}
      issuedPermissions.5.permission:
-        "validate"
+        "fastconfirm"
      issuedPermissions.5.to:
-        "0xa7F450595Db1e14E70570a1AdFA15678fbC7bceD"
+        "0xedbFE5493367F8fBc340276503D3c18D2C02E9AE"
      issuedPermissions.5.description:
-        "Can propose new state roots (called nodes) and challenge state roots on the host chain."
+        "Can finalize a state root before the challenge period has passed. This allows withdrawing from the bridge based on the state root."
      issuedPermissions.5.via.0:
+        {"address":"0xF4620078b10CDfD0Dc8E4BCec4250642fa5B517b"}
      issuedPermissions.4.permission:
-        "validate"
+        "fastconfirm"
      issuedPermissions.4.to:
-        "0x834999E1D729Ead48Ae1Db1dAa11463102EccB77"
+        "0xbdA6d4ecbb176e12314361DF779bdB428f368163"
      issuedPermissions.4.description:
-        "Can propose new state roots (called nodes) and challenge state roots on the host chain."
+        "Can finalize a state root before the challenge period has passed. This allows withdrawing from the bridge based on the state root."
      issuedPermissions.4.via.0:
+        {"address":"0xF4620078b10CDfD0Dc8E4BCec4250642fa5B517b"}
      issuedPermissions.3.permission:
-        "validate"
+        "fastconfirm"
      issuedPermissions.3.to:
-        "0x62A5cE01D91fEe98678D4346890c8E7ABB4695A6"
+        "0xa7F450595Db1e14E70570a1AdFA15678fbC7bceD"
      issuedPermissions.3.description:
-        "Can propose new state roots (called nodes) and challenge state roots on the host chain."
+        "Can finalize a state root before the challenge period has passed. This allows withdrawing from the bridge based on the state root."
      issuedPermissions.3.via.0:
+        {"address":"0xF4620078b10CDfD0Dc8E4BCec4250642fa5B517b"}
      issuedPermissions.2.permission:
-        "upgrade"
+        "fastconfirm"
      issuedPermissions.2.to:
-        "0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb"
+        "0x834999E1D729Ead48Ae1Db1dAa11463102EccB77"
      issuedPermissions.2.via.0.address:
-        "0x9132151475ACCf0662C545Bc81FbC1741d978EE0"
+        "0xF4620078b10CDfD0Dc8E4BCec4250642fa5B517b"
      issuedPermissions.2.description:
+        "Can finalize a state root before the challenge period has passed. This allows withdrawing from the bridge based on the state root."
      issuedPermissions.1.to:
-        "0xbdA6d4ecbb176e12314361DF779bdB428f368163"
+        "0x62A5cE01D91fEe98678D4346890c8E7ABB4695A6"
    }
```

```diff
    contract EduFastConfirmerMultisig (0xF4620078b10CDfD0Dc8E4BCec4250642fa5B517b) {
    +++ description: None
      values.$members.4:
+        "0xbdA6d4ecbb176e12314361DF779bdB428f368163"
      values.$members.3:
+        "0xa7F450595Db1e14E70570a1AdFA15678fbC7bceD"
      values.$members.2:
+        "0x62A5cE01D91fEe98678D4346890c8E7ABB4695A6"
      values.$members.1:
+        "0x834999E1D729Ead48Ae1Db1dAa11463102EccB77"
      values.$members.0:
-        "0xbdA6d4ecbb176e12314361DF779bdB428f368163"
+        "0xedbFE5493367F8fBc340276503D3c18D2C02E9AE"
      values.multisigThreshold:
-        "1 of 1 (100%)"
+        "1 of 5 (20%)"
    }
```

Generated with discovered.json: 0x27008dde2974308c46fa9e75232eff449d34e271

# Diff at Mon, 20 Jan 2025 12:08:57 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@658eb33e9afd98eac45a3037d195357115d19a86 block: 296310685
- current block number: 297394465

## Description

GelatoMS signer changes + add validators.

## Watched changes

```diff
    contract RollupProxy (0xBaE3B462a2A7fb758F66D91170514C10B14Ce914) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      issuedPermissions.8:
+        {"permission":"validate","to":"0xedbFE5493367F8fBc340276503D3c18D2C02E9AE","description":"Can propose new state roots (called nodes) and challenge state roots on the host chain.","via":[]}
      issuedPermissions.7:
+        {"permission":"validate","to":"0xbdA6d4ecbb176e12314361DF779bdB428f368163","description":"Can propose new state roots (called nodes) and challenge state roots on the host chain.","via":[{"address":"0xF4620078b10CDfD0Dc8E4BCec4250642fa5B517b"}]}
      issuedPermissions.6:
+        {"permission":"validate","to":"0xbdA6d4ecbb176e12314361DF779bdB428f368163","description":"Can propose new state roots (called nodes) and challenge state roots on the host chain.","via":[]}
      issuedPermissions.5:
+        {"permission":"validate","to":"0xa7F450595Db1e14E70570a1AdFA15678fbC7bceD","description":"Can propose new state roots (called nodes) and challenge state roots on the host chain.","via":[]}
      issuedPermissions.4.to:
-        "0xbdA6d4ecbb176e12314361DF779bdB428f368163"
+        "0x834999E1D729Ead48Ae1Db1dAa11463102EccB77"
      issuedPermissions.4.via.0:
-        {"address":"0xF4620078b10CDfD0Dc8E4BCec4250642fa5B517b"}
      issuedPermissions.3.to:
-        "0xbdA6d4ecbb176e12314361DF779bdB428f368163"
+        "0x62A5cE01D91fEe98678D4346890c8E7ABB4695A6"
+++ description: Increments on each Validator change.
      values.setValidatorCount:
-        2
+        4
      values.validators.5:
+        "0xedbFE5493367F8fBc340276503D3c18D2C02E9AE"
      values.validators.4:
+        "0xbdA6d4ecbb176e12314361DF779bdB428f368163"
      values.validators.3:
+        "0xa7F450595Db1e14E70570a1AdFA15678fbC7bceD"
      values.validators.2:
+        "0xF4620078b10CDfD0Dc8E4BCec4250642fa5B517b"
      values.validators.1:
-        "0xbdA6d4ecbb176e12314361DF779bdB428f368163"
+        "0x834999E1D729Ead48Ae1Db1dAa11463102EccB77"
      values.validators.0:
-        "0xF4620078b10CDfD0Dc8E4BCec4250642fa5B517b"
+        "0x62A5cE01D91fEe98678D4346890c8E7ABB4695A6"
    }
```

```diff
    contract GelatoMultisig (0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb) {
    +++ description: None
      values.$members.7:
-        "0xebD4919C075417a86F19713dADe101852867A04F"
+        "0x547D0F472309e4239b296D01e03bEDc101241a26"
      values.$members.6:
-        "0xf83bC4688979b13Da02CB94c76cEB169540760b5"
+        "0xB65540bBA534E88EB4a5062D0E6519C07063b259"
      values.$members.4:
-        "0xc85aC6d2fdC376F335455D4cCA30c45ED1080849"
+        "0x349f3839012DB2271e1BeC68F1668471D175Adb9"
      values.$members.3:
-        "0xBc0ca6865d6883a83D4aDDD6b862aE042d855E0d"
+        "0x88De44422E1b1c30bc530c35aEdb9f5aD0e6fD52"
    }
```

Generated with discovered.json: 0x1755885958825a674390ad712febe94130859227

# Diff at Mon, 20 Jan 2025 11:10:29 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@2c8b4f3d9910bb6371be9b4df87b70856e7d8c64 block: 296310685
- current block number: 296310685

## Description

Rerun on the same block number. Applies fixes to permissions and via field. Renames permission's target to to/from.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 296310685 (main branch discovery), not current.

```diff
    contract ChallengeManager (0x14dBe58192B60b5207b86c751255B34550Bd12Fb) {
    +++ description: Contract that allows challenging state roots. Can be called through the RollupProxy by Validators or the UpgradeExecutor.
      issuedPermissions.0.target:
-        "0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb"
      issuedPermissions.0.via.1.delay:
-        0
      issuedPermissions.0.via.0.delay:
-        0
      issuedPermissions.0.to:
+        "0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb"
    }
```

```diff
    contract ERC20Bridge (0x2F12c50b46adB01a4961AdDa5038c0974C7C78e8) {
    +++ description: Escrow contract for the project's gas token (can be different from ETH). Keeps a list of allowed Inboxes and Outboxes for canonical bridge messaging.
      issuedPermissions.0.target:
-        "0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb"
      issuedPermissions.0.via.1.delay:
-        0
      issuedPermissions.0.via.0.delay:
-        0
      issuedPermissions.0.to:
+        "0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb"
    }
```

```diff
    contract L1OrbitERC20Gateway (0x419e439e5c0B839d6e31d7C438939EEE1A4f4184) {
    +++ description: Escrows deposited ERC-20 assets for the canonical Bridge. Upon depositing, a generic token representation will be minted at the destination. Withdrawals are initiated by the Outbox contract.
      issuedPermissions.0.target:
-        "0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb"
      issuedPermissions.0.via.1.delay:
-        0
      issuedPermissions.0.via.0.delay:
-        0
      issuedPermissions.0.to:
+        "0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb"
    }
```

```diff
    contract ERC20Inbox (0x590044e628ea1B9C10a86738Cf7a7eeF52D031B8) {
    +++ description: Facilitates sending L1 to L2 messages like depositing ETH, but does not escrow funds.
      issuedPermissions.0.target:
-        "0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb"
      issuedPermissions.0.via.1.delay:
-        0
      issuedPermissions.0.via.0.delay:
-        0
      issuedPermissions.0.to:
+        "0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb"
    }
```

```diff
    contract ERC20Outbox (0x6339965Cb3002f5c746895e4eD895bd775dbfdf9) {
    +++ description: Facilitates L2 to L1 contract calls: Messages initiated from L2 (for example withdrawal messages) eventually resolve in execution on L1.
      issuedPermissions.0.target:
-        "0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb"
      issuedPermissions.0.via.1.delay:
-        0
      issuedPermissions.0.via.0.delay:
-        0
      issuedPermissions.0.to:
+        "0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb"
    }
```

```diff
    contract ProxyAdmin (0x79daC9c2deC3E4411a2cB2b0ecf654D27a4AFf0A) {
    +++ description: None
      directlyReceivedPermissions.9.target:
-        "0xDd7A9dEcBB0b16B37fE6777e245b18fC0aC63759"
      directlyReceivedPermissions.9.from:
+        "0xDd7A9dEcBB0b16B37fE6777e245b18fC0aC63759"
      directlyReceivedPermissions.8.target:
-        "0xDa4ac9E9cB8Af8afBB2Df1ffe7b82efEA17ba0f6"
      directlyReceivedPermissions.8.from:
+        "0xDa4ac9E9cB8Af8afBB2Df1ffe7b82efEA17ba0f6"
      directlyReceivedPermissions.7.target:
-        "0xD36cd2624a7187ED41ec30FC1d6E6B7b3abAf251"
      directlyReceivedPermissions.7.from:
+        "0xD36cd2624a7187ED41ec30FC1d6E6B7b3abAf251"
      directlyReceivedPermissions.6.target:
-        "0xA3464bf0ed52cFe6676D3e34ab1F4DF53f193631"
      directlyReceivedPermissions.6.from:
+        "0xA3464bf0ed52cFe6676D3e34ab1F4DF53f193631"
      directlyReceivedPermissions.5.target:
-        "0x9132151475ACCf0662C545Bc81FbC1741d978EE0"
      directlyReceivedPermissions.5.from:
+        "0x9132151475ACCf0662C545Bc81FbC1741d978EE0"
      directlyReceivedPermissions.4.target:
-        "0x6339965Cb3002f5c746895e4eD895bd775dbfdf9"
      directlyReceivedPermissions.4.from:
+        "0x6339965Cb3002f5c746895e4eD895bd775dbfdf9"
      directlyReceivedPermissions.3.target:
-        "0x590044e628ea1B9C10a86738Cf7a7eeF52D031B8"
      directlyReceivedPermissions.3.from:
+        "0x590044e628ea1B9C10a86738Cf7a7eeF52D031B8"
      directlyReceivedPermissions.2.target:
-        "0x419e439e5c0B839d6e31d7C438939EEE1A4f4184"
      directlyReceivedPermissions.2.from:
+        "0x419e439e5c0B839d6e31d7C438939EEE1A4f4184"
      directlyReceivedPermissions.1.target:
-        "0x2F12c50b46adB01a4961AdDa5038c0974C7C78e8"
      directlyReceivedPermissions.1.from:
+        "0x2F12c50b46adB01a4961AdDa5038c0974C7C78e8"
      directlyReceivedPermissions.0.target:
-        "0x14dBe58192B60b5207b86c751255B34550Bd12Fb"
      directlyReceivedPermissions.0.from:
+        "0x14dBe58192B60b5207b86c751255B34550Bd12Fb"
    }
```

```diff
    contract UpgradeExecutor (0x9132151475ACCf0662C545Bc81FbC1741d978EE0) {
    +++ description: Central contract defining the access control permissions for upgrading the system contract implementations.
      issuedPermissions.0.target:
-        "0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb"
      issuedPermissions.0.via.1.delay:
-        0
      issuedPermissions.0.via.0.delay:
-        0
      issuedPermissions.0.to:
+        "0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb"
      directlyReceivedPermissions.2.target:
-        "0xBaE3B462a2A7fb758F66D91170514C10B14Ce914"
      directlyReceivedPermissions.2.from:
+        "0xBaE3B462a2A7fb758F66D91170514C10B14Ce914"
      directlyReceivedPermissions.1.target:
-        "0xBaE3B462a2A7fb758F66D91170514C10B14Ce914"
      directlyReceivedPermissions.1.from:
+        "0xBaE3B462a2A7fb758F66D91170514C10B14Ce914"
      directlyReceivedPermissions.0.target:
-        "0x79daC9c2deC3E4411a2cB2b0ecf654D27a4AFf0A"
      directlyReceivedPermissions.0.from:
+        "0x79daC9c2deC3E4411a2cB2b0ecf654D27a4AFf0A"
    }
```

```diff
    contract SequencerInbox (0xA3464bf0ed52cFe6676D3e34ab1F4DF53f193631) {
    +++ description: A sequencer (registered in this contract) can submit transaction batches or commitments here.
      issuedPermissions.1.target:
-        "0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb"
      issuedPermissions.1.via.1.delay:
-        0
      issuedPermissions.1.via.0.delay:
-        0
      issuedPermissions.1.to:
+        "0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb"
      issuedPermissions.0.target:
-        "0x0816e1EeE08C701001e5a846f5ae2ee93FABb608"
      issuedPermissions.0.to:
+        "0x0816e1EeE08C701001e5a846f5ae2ee93FABb608"
      issuedPermissions.0.description:
+        "Can submit transaction batches or commitments to the SequencerInbox contract on the host chain."
    }
```

```diff
    contract RollupProxy (0xBaE3B462a2A7fb758F66D91170514C10B14Ce914) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      issuedPermissions.4.target:
-        "0xbdA6d4ecbb176e12314361DF779bdB428f368163"
      issuedPermissions.4.via.0.delay:
-        0
      issuedPermissions.4.via.0.description:
-        "Can propose new state roots (called nodes) and challenge state roots on the host chain."
      issuedPermissions.4.to:
+        "0xbdA6d4ecbb176e12314361DF779bdB428f368163"
      issuedPermissions.4.description:
+        "Can propose new state roots (called nodes) and challenge state roots on the host chain."
      issuedPermissions.3.target:
-        "0xbdA6d4ecbb176e12314361DF779bdB428f368163"
      issuedPermissions.3.to:
+        "0xbdA6d4ecbb176e12314361DF779bdB428f368163"
      issuedPermissions.3.description:
+        "Can propose new state roots (called nodes) and challenge state roots on the host chain."
      issuedPermissions.2.target:
-        "0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb"
      issuedPermissions.2.via.0.delay:
-        0
      issuedPermissions.2.to:
+        "0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb"
      issuedPermissions.1.target:
-        "0xbdA6d4ecbb176e12314361DF779bdB428f368163"
      issuedPermissions.1.via.0.delay:
-        0
      issuedPermissions.1.via.0.description:
-        "Can finalize a state root before the challenge period has passed. This allows withdrawing from the bridge based on the state root."
      issuedPermissions.1.to:
+        "0xbdA6d4ecbb176e12314361DF779bdB428f368163"
      issuedPermissions.1.description:
+        "Can finalize a state root before the challenge period has passed. This allows withdrawing from the bridge based on the state root."
      issuedPermissions.0.target:
-        "0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb"
      issuedPermissions.0.via.0.delay:
-        0
      issuedPermissions.0.via.0.description:
-        "Pause and unpause and set important roles and parameters in the system contracts: Can delegate Sequencer management to a BatchPosterManager address, manage data availability, DACs and the fastConfirmer role, set the Sequencer-only window, introduce an allowList to the bridge and whitelist Inboxes/Outboxes."
      issuedPermissions.0.to:
+        "0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb"
      issuedPermissions.0.description:
+        "Pause and unpause and set important roles and parameters in the system contracts: Can delegate Sequencer management to a BatchPosterManager address, manage data availability, DACs and the fastConfirmer role, set the Sequencer-only window, introduce an allowList to the bridge and whitelist Inboxes/Outboxes."
    }
```

```diff
    contract GelatoMultisig (0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb) {
    +++ description: None
      receivedPermissions.11.target:
-        "0xDd7A9dEcBB0b16B37fE6777e245b18fC0aC63759"
      receivedPermissions.11.from:
+        "0xDd7A9dEcBB0b16B37fE6777e245b18fC0aC63759"
      receivedPermissions.10.target:
-        "0xDa4ac9E9cB8Af8afBB2Df1ffe7b82efEA17ba0f6"
      receivedPermissions.10.from:
+        "0xDa4ac9E9cB8Af8afBB2Df1ffe7b82efEA17ba0f6"
      receivedPermissions.9.target:
-        "0xD36cd2624a7187ED41ec30FC1d6E6B7b3abAf251"
      receivedPermissions.9.from:
+        "0xD36cd2624a7187ED41ec30FC1d6E6B7b3abAf251"
      receivedPermissions.8.target:
-        "0xBaE3B462a2A7fb758F66D91170514C10B14Ce914"
      receivedPermissions.8.from:
+        "0xBaE3B462a2A7fb758F66D91170514C10B14Ce914"
      receivedPermissions.7.target:
-        "0xA3464bf0ed52cFe6676D3e34ab1F4DF53f193631"
      receivedPermissions.7.from:
+        "0xA3464bf0ed52cFe6676D3e34ab1F4DF53f193631"
      receivedPermissions.6.target:
-        "0x9132151475ACCf0662C545Bc81FbC1741d978EE0"
      receivedPermissions.6.from:
+        "0x9132151475ACCf0662C545Bc81FbC1741d978EE0"
      receivedPermissions.5.target:
-        "0x6339965Cb3002f5c746895e4eD895bd775dbfdf9"
      receivedPermissions.5.from:
+        "0x6339965Cb3002f5c746895e4eD895bd775dbfdf9"
      receivedPermissions.4.target:
-        "0x590044e628ea1B9C10a86738Cf7a7eeF52D031B8"
      receivedPermissions.4.from:
+        "0x590044e628ea1B9C10a86738Cf7a7eeF52D031B8"
      receivedPermissions.3.target:
-        "0x419e439e5c0B839d6e31d7C438939EEE1A4f4184"
      receivedPermissions.3.from:
+        "0x419e439e5c0B839d6e31d7C438939EEE1A4f4184"
      receivedPermissions.2.target:
-        "0x2F12c50b46adB01a4961AdDa5038c0974C7C78e8"
      receivedPermissions.2.from:
+        "0x2F12c50b46adB01a4961AdDa5038c0974C7C78e8"
      receivedPermissions.1.target:
-        "0x14dBe58192B60b5207b86c751255B34550Bd12Fb"
      receivedPermissions.1.from:
+        "0x14dBe58192B60b5207b86c751255B34550Bd12Fb"
      receivedPermissions.0.target:
-        "0xBaE3B462a2A7fb758F66D91170514C10B14Ce914"
      receivedPermissions.0.from:
+        "0xBaE3B462a2A7fb758F66D91170514C10B14Ce914"
      directlyReceivedPermissions.0.target:
-        "0x9132151475ACCf0662C545Bc81FbC1741d978EE0"
      directlyReceivedPermissions.0.from:
+        "0x9132151475ACCf0662C545Bc81FbC1741d978EE0"
    }
```

```diff
    contract ERC20RollupEventInbox (0xD36cd2624a7187ED41ec30FC1d6E6B7b3abAf251) {
    +++ description: Helper contract sending configuration data over the bridge during the systems initialization.
      issuedPermissions.0.target:
-        "0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb"
      issuedPermissions.0.via.1.delay:
-        0
      issuedPermissions.0.via.0.delay:
-        0
      issuedPermissions.0.to:
+        "0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb"
    }
```

```diff
    contract L1OrbitGatewayRouter (0xDa4ac9E9cB8Af8afBB2Df1ffe7b82efEA17ba0f6) {
    +++ description: This routing contract maps tokens to the correct escrow (gateway) to be then bridged with canonical messaging.
      issuedPermissions.0.target:
-        "0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb"
      issuedPermissions.0.via.1.delay:
-        0
      issuedPermissions.0.via.0.delay:
-        0
      issuedPermissions.0.to:
+        "0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb"
    }
```

```diff
    contract L1OrbitCustomGateway (0xDd7A9dEcBB0b16B37fE6777e245b18fC0aC63759) {
    +++ description: Escrows deposited assets for the canonical bridge that are externally governed or need custom token contracts with e.g. minting rights or upgradeability.
      issuedPermissions.0.target:
-        "0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb"
      issuedPermissions.0.via.1.delay:
-        0
      issuedPermissions.0.via.0.delay:
-        0
      issuedPermissions.0.to:
+        "0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb"
    }
```

```diff
    contract EduFastConfirmerMultisig (0xF4620078b10CDfD0Dc8E4BCec4250642fa5B517b) {
    +++ description: None
      directlyReceivedPermissions.1.target:
-        "0xBaE3B462a2A7fb758F66D91170514C10B14Ce914"
      directlyReceivedPermissions.1.from:
+        "0xBaE3B462a2A7fb758F66D91170514C10B14Ce914"
      directlyReceivedPermissions.0.target:
-        "0xBaE3B462a2A7fb758F66D91170514C10B14Ce914"
      directlyReceivedPermissions.0.from:
+        "0xBaE3B462a2A7fb758F66D91170514C10B14Ce914"
    }
```

Generated with discovered.json: 0x9d198cba0c9a7541420c09f47ac33dc0c03d55eb

# Diff at Fri, 17 Jan 2025 08:36:40 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@684bb8793c10fca3b27baef551e527bab3fa9d01 block: 296064838
- current block number: 296310685

## Description

Gelato MS upgraded to known shape, 1 signer removed, threshold decreased to 4.

## Watched changes

```diff
    contract GelatoMultisig (0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb) {
    +++ description: None
      sourceHashes.1:
-        "0xd42bbf9f7dcd3720a7fc6bdc6edfdfae8800a37d6dd4decfa0ef6ca4a2e88940"
+        "0x59fe14e95a8aa7f52213f18bae5c9329cf583a7ba31194698b15eddb97d5e825"
      values.$implementation:
-        "0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552"
+        "0x3E5c63644E683549055b9Be8653de26E0B4CD36E"
      values.$members.8:
-        "0xebD4919C075417a86F19713dADe101852867A04F"
      values.$members.7:
-        "0xf83bC4688979b13Da02CB94c76cEB169540760b5"
+        "0xebD4919C075417a86F19713dADe101852867A04F"
      values.$members.6:
-        "0x01a0A7BaAAca31AFB5b770FeFD69CE4917D9c32e"
+        "0xf83bC4688979b13Da02CB94c76cEB169540760b5"
      values.$members.5:
-        "0x27b1682E9C5Cb0E58Ff474F3a13EeCC36E708ad3"
+        "0x01a0A7BaAAca31AFB5b770FeFD69CE4917D9c32e"
      values.$threshold:
-        5
+        4
      values.multisigThreshold:
-        "5 of 9 (56%)"
+        "4 of 8 (50%)"
      derivedName:
-        "GnosisSafe"
+        "GnosisSafeL2"
    }
```

## Source code changes

```diff
.../GelatoMultisig/GnosisSafeL2.sol}               | 759 ++++++++++++---------
 1 file changed, 419 insertions(+), 340 deletions(-)
```

Generated with discovered.json: 0x00f4759f35e96750a0526be09c27e1a730c8a0d5

# Diff at Thu, 16 Jan 2025 15:20:55 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- current block number: 296064838

## Description

Standard orbit stack L3 with native token EDU and admin EOA, launch on Dec 2nd (Gelato). Postponed to Jan 2025.

## Initial discovery

```diff
+   Status: CREATED
    contract ChallengeManager (0x14dBe58192B60b5207b86c751255B34550Bd12Fb)
    +++ description: Contract that allows challenging state roots. Can be called through the RollupProxy by Validators or the UpgradeExecutor.
```

```diff
+   Status: CREATED
    contract ERC20Bridge (0x2F12c50b46adB01a4961AdDa5038c0974C7C78e8)
    +++ description: Escrow contract for the project's gas token (can be different from ETH). Keeps a list of allowed Inboxes and Outboxes for canonical bridge messaging.
```

```diff
+   Status: CREATED
    contract OneStepProverHostIo (0x33c1514Bf90e202d242C299b37C60f908aa206D4)
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
```

```diff
+   Status: CREATED
    contract L1OrbitERC20Gateway (0x419e439e5c0B839d6e31d7C438939EEE1A4f4184)
    +++ description: Escrows deposited ERC-20 assets for the canonical Bridge. Upon depositing, a generic token representation will be minted at the destination. Withdrawals are initiated by the Outbox contract.
```

```diff
+   Status: CREATED
    contract OneStepProver0 (0x54E0923782b701044444De5d8c3A45aC890b0881)
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
```

```diff
+   Status: CREATED
    contract ERC20Inbox (0x590044e628ea1B9C10a86738Cf7a7eeF52D031B8)
    +++ description: Facilitates sending L1 to L2 messages like depositing ETH, but does not escrow funds.
```

```diff
+   Status: CREATED
    contract ERC20Outbox (0x6339965Cb3002f5c746895e4eD895bd775dbfdf9)
    +++ description: Facilitates L2 to L1 contract calls: Messages initiated from L2 (for example withdrawal messages) eventually resolve in execution on L1.
```

```diff
+   Status: CREATED
    contract ValidatorUtils (0x6c21303F5986180B1394d2C89f3e883890E2867b)
    +++ description: This contract implements view only utilities for validators.
```

```diff
+   Status: CREATED
    contract ProxyAdmin (0x79daC9c2deC3E4411a2cB2b0ecf654D27a4AFf0A)
    +++ description: None
```

```diff
+   Status: CREATED
    contract UpgradeExecutor (0x9132151475ACCf0662C545Bc81FbC1741d978EE0)
    +++ description: Central contract defining the access control permissions for upgrading the system contract implementations.
```

```diff
+   Status: CREATED
    contract SequencerInbox (0xA3464bf0ed52cFe6676D3e34ab1F4DF53f193631)
    +++ description: A sequencer (registered in this contract) can submit transaction batches or commitments here.
```

```diff
+   Status: CREATED
    contract RollupProxy (0xBaE3B462a2A7fb758F66D91170514C10B14Ce914)
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
```

```diff
+   Status: CREATED
    contract GelatoMultisig (0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ERC20RollupEventInbox (0xD36cd2624a7187ED41ec30FC1d6E6B7b3abAf251)
    +++ description: Helper contract sending configuration data over the bridge during the systems initialization.
```

```diff
+   Status: CREATED
    contract OneStepProofEntry (0xD89d54007079071cBA859127318b9F34eeB78049)
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
```

```diff
+   Status: CREATED
    contract L1OrbitGatewayRouter (0xDa4ac9E9cB8Af8afBB2Df1ffe7b82efEA17ba0f6)
    +++ description: This routing contract maps tokens to the correct escrow (gateway) to be then bridged with canonical messaging.
```

```diff
+   Status: CREATED
    contract L1OrbitCustomGateway (0xDd7A9dEcBB0b16B37fE6777e245b18fC0aC63759)
    +++ description: Escrows deposited assets for the canonical bridge that are externally governed or need custom token contracts with e.g. minting rights or upgradeability.
```

```diff
+   Status: CREATED
    contract OneStepProverMath (0xE58a2dEb5718F9aAF2C1DdD0E366ED076D204cc4)
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
```

```diff
+   Status: CREATED
    contract EduFastConfirmerMultisig (0xF4620078b10CDfD0Dc8E4BCec4250642fa5B517b)
    +++ description: None
```

```diff
+   Status: CREATED
    contract OneStepProverMemory (0xf8E5e5562c2c12d8690786f5C9FA65F20F6bD881)
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
```
