Generated with discovered.json: 0x7d8888dd37ac334ba78ec5c7615681fda27b20f9

# Diff at Thu, 27 Mar 2025 09:06:27 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@73b1a8c5f50d6fe327eed98ba839c3eed6ab6280 block: 778850
- current block number: 781473

## Description

BridgedKinto upgrade. AccessManager ready for stage 1 (incl queued transactions).
- ADMIN_ROLE grant to Kinto Multisig 2 canceled.
- 12d delays for execution and targetAdmin queued.

## Watched changes

```diff
    contract BridgedKinto (0x010700808D59d2bb92257fCafACfe8e5bFF7aB87) {
    +++ description: KINTO token contract.
      sourceHashes.1:
-        "0x7100558956c90af1deda7d8940594b34dfd14a466b66d3693f4219419308c9cd"
+        "0x01f873ab58dfa85af89a14ea5940a5d2d59c6c300d113b8e78d3ff47dbf70e4d"
      values.$implementation:
-        "0xF22F907b74CAB91864B7bEEcAdf762F464a96140"
+        "0xBe19941Dd429020A5B5d2704f953Fb0f7a3A3497"
      values.$pastUpgrades.9:
+        ["2025-03-26T22:14:03.000Z","0x3aa9d1b48b5f3f5d8b445cd0d0f21fd7c774a0dc2e601f12609759c44b366a26",["0xBe19941Dd429020A5B5d2704f953Fb0f7a3A3497"]]
      values.$upgradeCount:
-        9
+        10
    }
```

```diff
    contract AccessManager (0xacC000818e5Bbd911D5d449aA81CB5cA24024739) {
    +++ description: Standard OpenZeppelin AccessManager contract: Serves as a proxy contract defining the roles, permissions and delays to call functions in target contracts.
+++ description: List of scheduled operations.
+++ severity: HIGH
      values.OperationScheduled.6:
+        {"operationId":"0x0ad95e032eb7beede43f2741b7bcef6566a6163eaa1ac1ef42441f25193096d8","nonce":1,"schedule":1743464541,"caller":"0x2e2B1c42E38f5af81771e65D87729E57ABD1337a","target":"0xacC000818e5Bbd911D5d449aA81CB5cA24024739","data":"0x25c471a0000000000000000000000000000000000000000000000000783b0946b8c9d2e30000000000000000000000002e2b1c42e38f5af81771e65d87729e57abd1337a00000000000000000000000000000000000000000000000000000000000e8080"}
+++ description: List of scheduled operations.
+++ severity: HIGH
      values.OperationScheduled.5:
+        {"operationId":"0xc961c36ac064bc0a4f2e0be23c833c3e8d938587ce2f328fb818b8045e1137b1","nonce":1,"schedule":1743905986,"caller":"0x2e2B1c42E38f5af81771e65D87729E57ABD1337a","target":"0xacC000818e5Bbd911D5d449aA81CB5cA24024739","data":"0x25c471a000000000000000000000000000000000000000000000000000000000000000000000000000000000000000002e2b1c42e38f5af81771e65d87729e57abd1337a00000000000000000000000000000000000000000000000000000000000fd200"}
+++ description: List of scheduled operations.
+++ severity: HIGH
      values.OperationScheduled.4:
+        {"operationId":"0x2fad4066aacd2052b8b133e635b4d73fbbe42674134fd28b91b0191d4a2cfb0d","nonce":1,"schedule":1743905137,"caller":"0x2e2B1c42E38f5af81771e65D87729E57ABD1337a","target":"0xacC000818e5Bbd911D5d449aA81CB5cA24024739","data":"0xd22b59890000000000000000000000008a4720488ca32f1223ccfe5a087e250fe3bc5d7500000000000000000000000000000000000000000000000000000000000fd200"}
+++ description: List of scheduled operations.
+++ severity: HIGH
      values.OperationScheduled.3:
+        {"operationId":"0x8b8631e0ab585da013ce35fd8f3a27597f77e19c91ba1263b21cd7396f746d91","nonce":1,"schedule":1743955424,"caller":"0x28fC10E12A78f986c78F973Fc70ED88072b34c8e","target":"0xf369f78E3A0492CC4e96a90dae0728A38498e9c7","data":"0x3659cfe60000000000000000000000001d61772ae2e157f9f6a4127526ed86ab5801a477"}
+++ description: List of scheduled operations.
+++ severity: HIGH
      values.OperationScheduled.2:
+        {"operationId":"0x7efe7055898bb49bcf4b4bac2964df4814ca5698c700d895f669b8da3b83443a","nonce":1,"schedule":1743905135,"caller":"0x2e2B1c42E38f5af81771e65D87729E57ABD1337a","target":"0xacC000818e5Bbd911D5d449aA81CB5cA24024739","data":"0xd22b59890000000000000000000000005a2b641b84b0230c8e75f55d5afd27f4dbd59d5b00000000000000000000000000000000000000000000000000000000000fd200"}
+++ description: List of scheduled operations.
+++ severity: HIGH
      values.OperationScheduled.1:
+        {"operationId":"0x4a05b6df1acce9e22cf008555fa8d477bd9f116f261f267f95c2b463047e016a","nonce":1,"schedule":1743905136,"caller":"0x2e2B1c42E38f5af81771e65D87729E57ABD1337a","target":"0xacC000818e5Bbd911D5d449aA81CB5cA24024739","data":"0xd22b5989000000000000000000000000f369f78e3a0492cc4e96a90dae0728a38498e9c700000000000000000000000000000000000000000000000000000000000fd200"}
      values.OperationScheduled.0.operationId:
-        "0x0ad95e032eb7beede43f2741b7bcef6566a6163eaa1ac1ef42441f25193096d8"
+        "0x256b4be01a33f01810d8b7c1bb0e70df24b98d9f174b45ea4ea9f9f13a04990e"
      values.OperationScheduled.0.schedule:
-        1743464541
+        1743955424
      values.OperationScheduled.0.caller:
-        "0x2e2B1c42E38f5af81771e65D87729E57ABD1337a"
+        "0x28fC10E12A78f986c78F973Fc70ED88072b34c8e"
      values.OperationScheduled.0.target:
-        "0xacC000818e5Bbd911D5d449aA81CB5cA24024739"
+        "0x8a4720488CA32f1223ccFE5A087e250fE3BC5D75"
      values.OperationScheduled.0.data:
-        "0x25c471a0000000000000000000000000000000000000000000000000783b0946b8c9d2e30000000000000000000000002e2b1c42e38f5af81771e65d87729e57abd1337a00000000000000000000000000000000000000000000000000000000000e8080"
+        "0xf4f4b03a000000000000000000000000bfe260680514e0d669fdc5a5f7334b97a5513d9d"
    }
```

## Source code changes

```diff
.../kinto/{.flat@778850 => .flat}/BridgedKinto/BridgedKinto.sol      | 5 +++++
 1 file changed, 5 insertions(+)
```

Generated with discovered.json: 0x860f798971ee9f8ca5c2bb906627f0511e59de44

# Diff at Tue, 25 Mar 2025 11:49:20 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@b4a04714c0219993c2a83e7714e82e32f8a106ba block: 773151
- current block number: 778850

## Description

BridgedKinto upgrade.

Current state of permissions in the AccessManager is unchanged.

waiting for:
queue operations for 12d values for:
- executionDelays for all non-SC actors for the roles UPGRADER_ROLE, ADMIN_ROLE and SECURITY_COUNCIL role
- targetAdminDelays for the 3 targets: KintoAppRegistry, KintoID, KintoWalletFactory
- KintoWallet.RECOVERY_TIME
- KintoID.EXIT_WINDOW_PERIOD

## Watched changes

```diff
    contract BridgedKinto (0x010700808D59d2bb92257fCafACfe8e5bFF7aB87) {
    +++ description: KINTO token contract.
      sourceHashes.1:
-        "0x8afd4a6a4dce2fedf29d5a78d35edbb8101e74ea5e923aebda93db04b4f44121"
+        "0x7100558956c90af1deda7d8940594b34dfd14a466b66d3693f4219419308c9cd"
      values.$implementation:
-        "0x6af53F698b87809d98CeAAfa848c73e192400E61"
+        "0xF22F907b74CAB91864B7bEEcAdf762F464a96140"
      values.$pastUpgrades.8:
+        ["2025-02-21T21:13:41.000Z","0xd65d8a3e984c6df5eb9bda4baee108c063c153abc195fbb9656b1d4b8236a1cb",["0xd70052c77dC9E5291c79842420a6d51010Ed014c"]]
      values.$pastUpgrades.7.2:
-        "2025-02-21T21:13:41.000Z"
+        "2024-06-29T15:10:34.000Z"
      values.$pastUpgrades.7.1.0:
-        "0xd70052c77dC9E5291c79842420a6d51010Ed014c"
+        "0x840670bC23d0f77474e43f8ee4A2Da617c7376F0"
      values.$pastUpgrades.7.0:
-        "0xd65d8a3e984c6df5eb9bda4baee108c063c153abc195fbb9656b1d4b8236a1cb"
+        "0xd8d8d68bef601e045e6b2bff422ebdb8857e554c568bece1148ee7a8bde6a865"
      values.$pastUpgrades.6.2:
-        "2024-06-29T15:10:34.000Z"
+        ["0xd70052c77dC9E5291c79842420a6d51010Ed014c"]
      values.$pastUpgrades.6.1:
-        ["0x840670bC23d0f77474e43f8ee4A2Da617c7376F0"]
+        "2025-03-19T21:51:53.000Z"
      values.$pastUpgrades.6.0:
-        "0xd8d8d68bef601e045e6b2bff422ebdb8857e554c568bece1148ee7a8bde6a865"
+        "0x0e582739f5a4d9605c001b7e2000de6140e478098f664ca7c907d7886bfd96f3"
      values.$pastUpgrades.5.2:
-        ["0xd70052c77dC9E5291c79842420a6d51010Ed014c"]
+        "0xb0828f7016e3452a4b32bf6d987b8a8e265c5bdf5fedbcc42b51940f17d18ab8"
      values.$pastUpgrades.5.1:
-        "2025-03-19T21:51:53.000Z"
+        ["0xAf968044D5DE68fE01B5a6517d0DbeE3caD8563a"]
      values.$pastUpgrades.5.0:
-        "0x0e582739f5a4d9605c001b7e2000de6140e478098f664ca7c907d7886bfd96f3"
+        "2024-12-18T00:08:48.000Z"
      values.$pastUpgrades.4.2:
-        "0xb0828f7016e3452a4b32bf6d987b8a8e265c5bdf5fedbcc42b51940f17d18ab8"
+        ["0x2D8Cb3A6cE18F78e479bbC5079865993324C51BA"]
      values.$pastUpgrades.4.1:
-        ["0xAf968044D5DE68fE01B5a6517d0DbeE3caD8563a"]
+        "0x2ede5a1db2f802171ef91a7693dc8313c822592a555e36ae1506ec468c897dd1"
      values.$pastUpgrades.4.0:
-        "2024-12-18T00:08:48.000Z"
+        "2024-06-20T23:33:48.000Z"
      values.$pastUpgrades.3.2.0:
-        "0x2D8Cb3A6cE18F78e479bbC5079865993324C51BA"
+        "0x6af53F698b87809d98CeAAfa848c73e192400E61"
      values.$pastUpgrades.3.1:
-        "0x2ede5a1db2f802171ef91a7693dc8313c822592a555e36ae1506ec468c897dd1"
+        "0xe01e30073eae9d9b6eb56ffce85389dbcafd04dcbbf007e05c77351182a4850c"
      values.$pastUpgrades.3.0:
-        "2024-06-20T23:33:48.000Z"
+        "2025-03-20T00:39:13.000Z"
      values.$pastUpgrades.2.2:
-        ["0x6af53F698b87809d98CeAAfa848c73e192400E61"]
+        "0xb70427666e80d6b474e9f29949fda22eb4fb50c9b548295f6d3f1a6f8a465561"
      values.$pastUpgrades.2.1:
-        "0xe01e30073eae9d9b6eb56ffce85389dbcafd04dcbbf007e05c77351182a4850c"
+        ["0xbE43c24500B855f0cc0D0F99361683B6C6ED73b8"]
      values.$pastUpgrades.2.0:
-        "2025-03-20T00:39:13.000Z"
+        "2024-07-10T20:17:25.000Z"
      values.$pastUpgrades.1.2:
-        "0xb70427666e80d6b474e9f29949fda22eb4fb50c9b548295f6d3f1a6f8a465561"
+        "2025-03-25T01:46:55.000Z"
      values.$pastUpgrades.1.1:
-        ["0xbE43c24500B855f0cc0D0F99361683B6C6ED73b8"]
+        "0x4c3e223697c1a08b1539359340534964303bba7cbc4519e70044c74ad19fd784"
      values.$pastUpgrades.1.0:
-        "2024-07-10T20:17:25.000Z"
+        ["0xF22F907b74CAB91864B7bEEcAdf762F464a96140"]
      values.$upgradeCount:
-        8
+        9
      values.VAULT:
+        "0x3De040ef2Fbf9158BADF559C5606d7706ca72309"
    }
```

```diff
    contract AccessManager (0xacC000818e5Bbd911D5d449aA81CB5cA24024739) {
    +++ description: Standard OpenZeppelin AccessManager contract: Serves as a proxy contract defining the roles, permissions and delays to call functions in target contracts.
      values.accessControl.roles.UPGRADER_ROLE.members.1:
-        {"member":"0x2e2B1c42E38f5af81771e65D87729E57ABD1337a","since":1733181166,"executionDelay":604800}
+++ description: List of roles revoked from accounts.
      values.RolesRevoked.8663528507529876195:
+        [{"roleId":"8663528507529876195","account":"0x2e2B1c42E38f5af81771e65D87729E57ABD1337a"}]
+++ description: CURRENT target admin delay, the access control handler shows the pending delay. Delays all config changes/additions in the AccessManager that affect this target. Must be >= 11d.
+++ severity: HIGH
      values.tadKintoAppRegistry:
-        0
+        950400
+++ description: CURRENT target admin delay, the access control handler shows the pending delay. Delays all config changes/additions in the AccessManager that affect this target. Must be >= 11d.
+++ severity: HIGH
      values.tadKintoID:
-        604800
+        950400
+++ description: CURRENT target admin delay, the access control handler shows the pending delay. Delays all config changes/additions in the AccessManager that affect this target. Must be >= 11d.
+++ severity: HIGH
      values.tadKintoWalletFactory:
-        604800
+        950400
    }
```

## Source code changes

```diff
.../kinto/{.flat@773151 => .flat}/BridgedKinto/BridgedKinto.sol     | 6 +++++-
 1 file changed, 5 insertions(+), 1 deletion(-)
```

Generated with discovered.json: 0x433020c537dbdf2e53a26994bff8c280032ed795

# Diff at Fri, 21 Mar 2025 14:35:20 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@0cd49f2bd1f57cf090a4f7b659b8eb18c9783869 block: 772987
- current block number: 773151

## Description

Discovery rerun on the same block number with only config-related changes.

Rediscovered to properly handle canActIndependently on AccessManager thanks
to a source code fix.

Config: rename KintoAdminMultisig, edit config to treat it natively as a MS

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 772987 (main branch discovery), not current.

```diff
    contract Kinto Multisig 2 (0x2e2B1c42E38f5af81771e65D87729E57ABD1337a) {
    +++ description: None
      name:
-        "KintoAdminMultisig"
+        "Kinto Multisig 2"
      values.getOwners:
-        ["0x660ad4B5A74130a4796B4d54BC6750Ae93C86e6c","0xc1f4D15C16A1f3555E0a5F7AeFD1e17AD4aaf40B","0x08E674c4538caE03B6c05405881dDCd95DcaF5a8","0x94561e98DD5E55271f91A103e4979aa6C493745E"]
      values.$members:
+        ["0x94561e98DD5E55271f91A103e4979aa6C493745E","0x08E674c4538caE03B6c05405881dDCd95DcaF5a8","0x660ad4B5A74130a4796B4d54BC6750Ae93C86e6c","0xc1f4D15C16A1f3555E0a5F7AeFD1e17AD4aaf40B"]
+++ description: Current multisig threshold. Check the IMPROVISED mapping for the signer policy whenever this changes.
+++ severity: HIGH
      values.$threshold:
+        2
      fieldMeta:
+        {"$threshold":{"severity":"HIGH","description":"Current multisig threshold. Check the IMPROVISED mapping for the signer policy whenever this changes."}}
      usedTypes:
+        [{"typeCaster":"Mapping","arg":{"1":1,"2":1,"3":1,"4":2}}]
    }
```

```diff
    contract KintoAppRegistry (0x5A2b641b84b0230C8e75F55d5afd27f4Dbd59d5b) {
    +++ description: Central system contract defining addresses that are allowed to be called by EOAs. The modified Kinto node reads this configuration and drops all other transactions from EOAs (enforced by a modified state transition function). As a result, users can only transact using a canonical smart wallet.
      issuedPermissions:
-        [{"permission":"interact","to":"0xacC000818e5Bbd911D5d449aA81CB5cA24024739","description":"manage addresses that are callable by EOAs and other white-/blacklists that are enforced globally on the Kinto L2.","via":[]},{"permission":"upgrade","to":"0xacC000818e5Bbd911D5d449aA81CB5cA24024739","via":[]}]
    }
```

```diff
    contract Treasury (0x793500709506652Fcc61F0d2D0fDa605638D4293) {
    +++ description: Kinto Treasury.
      issuedPermissions:
-        [{"permission":"interact","to":"0xacC000818e5Bbd911D5d449aA81CB5cA24024739","description":"send tokens and ETH from the Treasury to any address without delay.","via":[]},{"permission":"upgrade","to":"0xacC000818e5Bbd911D5d449aA81CB5cA24024739","via":[]}]
    }
```

```diff
    contract KintoWalletFactory (0x8a4720488CA32f1223ccFE5A087e250fE3BC5D75) {
    +++ description: Deploys new KintoWallet smartwallets for users upon passing KYC checks. Also manages the beacon implementation for all KintoWallets and their recovery logic. KintoWallets can be funded with ETH via this contract.
      issuedPermissions:
-        [{"permission":"interact","to":"0xacC000818e5Bbd911D5d449aA81CB5cA24024739","description":"update the central KintoWallet implementation of all users on Kinto L2 and approve specific wallets for recovery via the turnkey recoverer.","via":[]},{"permission":"upgrade","to":"0xacC000818e5Bbd911D5d449aA81CB5cA24024739","via":[]}]
    }
```

```diff
    contract AccessManager (0xacC000818e5Bbd911D5d449aA81CB5cA24024739) {
    +++ description: Standard OpenZeppelin AccessManager contract: Serves as a proxy contract defining the roles, permissions and delays to call functions in target contracts.
      receivedPermissions:
-        [{"permission":"interact","from":"0x5A2b641b84b0230C8e75F55d5afd27f4Dbd59d5b","description":"manage addresses that are callable by EOAs and other white-/blacklists that are enforced globally on the Kinto L2."},{"permission":"interact","from":"0x793500709506652Fcc61F0d2D0fDa605638D4293","description":"send tokens and ETH from the Treasury to any address without delay."},{"permission":"interact","from":"0x8a4720488CA32f1223ccFE5A087e250fE3BC5D75","description":"update the central KintoWallet implementation of all users on Kinto L2 and approve specific wallets for recovery via the turnkey recoverer."},{"permission":"interact","from":"0xf369f78E3A0492CC4e96a90dae0728A38498e9c7","description":"manage the KYC status of any user (sanction status and KYC metadata) and mint/burn KintoID NFTs."},{"permission":"interact","from":"0xf369f78E3A0492CC4e96a90dae0728A38498e9c7","description":"permissioned to call `confirmSanction()`, which makes a temporary sanction by a KYC_PROVIDER permanent and does not grant an exit window to the affected wallet."},{"permission":"interact","from":"0xf369f78E3A0492CC4e96a90dae0728A38498e9c7","description":"transfer KYC NFTs to a different address."},{"permission":"upgrade","from":"0x5A2b641b84b0230C8e75F55d5afd27f4Dbd59d5b"},{"permission":"upgrade","from":"0x793500709506652Fcc61F0d2D0fDa605638D4293"},{"permission":"upgrade","from":"0x8a4720488CA32f1223ccFE5A087e250fE3BC5D75"},{"permission":"upgrade","from":"0xf369f78E3A0492CC4e96a90dae0728A38498e9c7"}]
      values.edKintoAdminMultisigADMIN:
-        950400
      values.edKintoAdminMultisigUPGRADER:
-        604800
      values.kintoAdminMultisigPermission:
-        "0x2e2B1c42E38f5af81771e65D87729E57ABD1337a"
+++ description: Current execution delay for target calls.
+++ severity: HIGH
      values.edKintoMultisig2ADMIN:
+        950400
+++ description: Current execution delay for target calls.
+++ severity: HIGH
      values.edKintoMultisig2UPGRADER:
+        604800
      values.kintoMultisig2Permission:
+        "0x2e2B1c42E38f5af81771e65D87729E57ABD1337a"
      fieldMeta.edKintoAdminMultisigUPGRADER:
-        {"severity":"HIGH","description":"Current execution delay for target calls."}
      fieldMeta.edKintoAdminMultisigADMIN:
-        {"severity":"HIGH","description":"Current execution delay for target calls."}
      fieldMeta.edKintoMultisig2UPGRADER:
+        {"severity":"HIGH","description":"Current execution delay for target calls."}
      fieldMeta.edKintoMultisig2ADMIN:
+        {"severity":"HIGH","description":"Current execution delay for target calls."}
      directlyReceivedPermissions:
+        [{"permission":"interact","from":"0xf369f78E3A0492CC4e96a90dae0728A38498e9c7","description":"transfer KYC NFTs to a different address."},{"permission":"interact","from":"0xf369f78E3A0492CC4e96a90dae0728A38498e9c7","description":"permissioned to call `confirmSanction()`, which makes a temporary sanction by a KYC_PROVIDER permanent and does not grant an exit window to the affected wallet."},{"permission":"interact","from":"0xf369f78E3A0492CC4e96a90dae0728A38498e9c7","description":"manage the KYC status of any user (sanction status and KYC metadata) and mint/burn KintoID NFTs."},{"permission":"interact","from":"0x793500709506652Fcc61F0d2D0fDa605638D4293","description":"send tokens and ETH from the Treasury to any address without delay."},{"permission":"interact","from":"0x8a4720488CA32f1223ccFE5A087e250fE3BC5D75","description":"update the central KintoWallet implementation of all users on Kinto L2 and approve specific wallets for recovery via the turnkey recoverer."},{"permission":"upgrade","from":"0xf369f78E3A0492CC4e96a90dae0728A38498e9c7"},{"permission":"interact","from":"0x5A2b641b84b0230C8e75F55d5afd27f4Dbd59d5b","description":"manage addresses that are callable by EOAs and other white-/blacklists that are enforced globally on the Kinto L2."},{"permission":"upgrade","from":"0x5A2b641b84b0230C8e75F55d5afd27f4Dbd59d5b"},{"permission":"upgrade","from":"0x793500709506652Fcc61F0d2D0fDa605638D4293"},{"permission":"upgrade","from":"0x8a4720488CA32f1223ccFE5A087e250fE3BC5D75"}]
    }
```

```diff
    contract KintoID (0xf369f78E3A0492CC4e96a90dae0728A38498e9c7) {
    +++ description: Manages Kinto's KYC system: The KYC_PROVIDER roles responsible for managing the KYC status and KYC metadata of user wallets. Each KintoWallet checks the KYC status of its user in this contract as part of the signature check.
      issuedPermissions.9:
-        {"permission":"upgrade","to":"0xacC000818e5Bbd911D5d449aA81CB5cA24024739","via":[]}
      issuedPermissions.8:
-        {"permission":"interact","to":"0x6E31039abF8d248aBed57E307C9E1b7530c269E4","description":"manage the KYC status of any user (sanction status and KYC metadata) and mint/burn KintoID NFTs.","via":[]}
      issuedPermissions.7:
-        {"permission":"interact","to":"0xacC000818e5Bbd911D5d449aA81CB5cA24024739","description":"manage the KYC status of any user (sanction status and KYC metadata) and mint/burn KintoID NFTs.","via":[]}
      issuedPermissions.6:
-        {"permission":"interact","to":"0x6E09F8A68fB5278e0C33D239dC12B2Cec33F4aC7","description":"manage the KYC status of any user (sanction status and KYC metadata) and mint/burn KintoID NFTs.","via":[]}
      issuedPermissions.5.to:
-        "0xacC000818e5Bbd911D5d449aA81CB5cA24024739"
+        "0x6E31039abF8d248aBed57E307C9E1b7530c269E4"
      issuedPermissions.5.description:
-        "permissioned to call `confirmSanction()`, which makes a temporary sanction by a KYC_PROVIDER permanent and does not grant an exit window to the affected wallet."
+        "manage the KYC status of any user (sanction status and KYC metadata) and mint/burn KintoID NFTs."
      issuedPermissions.4.to:
-        "0x6fe642404B7B23F31251103Ca0efb538Ad4aeC07"
+        "0x6E09F8A68fB5278e0C33D239dC12B2Cec33F4aC7"
      issuedPermissions.3.to:
-        "0x52F09693c9eEaA93A64BA697e3d3e43a1eB65477"
+        "0x6fe642404B7B23F31251103Ca0efb538Ad4aeC07"
      issuedPermissions.2.to:
-        "0xacC000818e5Bbd911D5d449aA81CB5cA24024739"
+        "0x52F09693c9eEaA93A64BA697e3d3e43a1eB65477"
      issuedPermissions.2.description:
-        "transfer KYC NFTs to a different address."
+        "manage the KYC status of any user (sanction status and KYC metadata) and mint/burn KintoID NFTs."
    }
```

Generated with discovered.json: 0x9c243f55a75514f7155771dc44fcfece48096fca

# Diff at Fri, 21 Mar 2025 09:58:16 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@a4eed3e556a58bb9ab448d141c0407f67ca3ce31 block: 770292
- current block number: 772987

## Description

KINTO token upgrade (staking) and gov changes:
- KintoID.GOVERNANCE_ROLE removed from NioGovernor
- AccessManager execution delays and target delays increased to 11d (SCHEDULED)
- remove/change KintoAdminMultisig permissions (SCHEDULED)

the l2 gov system will be ready for full stage 1 review on 2025-03-31T23:42. the config, when including the scheduled ops, is complete.

```
============= Queued Delay/Config Changes and Queued Actions =============

Target KintoWalletFactory (0x8a4720488ca32f1223ccfe5a087e250fe3bc5d75) scheduled targetAdminDelay change:
  New targetAdminDelay: 950400 (11d) effective at 2025-03-24T23:33:14.000Z

Target KintoAppRegistry (0x5a2b641b84b0230c8e75f55d5afd27f4dbd59d5b) scheduled targetAdminDelay change:
  New targetAdminDelay: 604800 (7d) effective at 2025-03-23T23:34:54.000Z

Target KintoAppRegistry (0x5a2b641b84b0230c8e75f55d5afd27f4dbd59d5b) scheduled targetAdminDelay change:
  New targetAdminDelay: 950400 (11d) effective at 2025-03-24T23:33:13.000Z

Target KintoID (0xf369f78e3a0492cc4e96a90dae0728a38498e9c7) scheduled targetAdminDelay change:
  New targetAdminDelay: 950400 (11d) effective at 2025-03-24T23:33:12.000Z

Queued Operations:

Operation 0x0ad95e032eb7beede43f2741b7bcef6566a6163eaa1ac1ef42441f25193096d8:
    Nonce: 1
    Scheduled for: 2025-03-31T23:42:21.000Z
    Caller: KintoAdminMultisig (0x2e2b1c42e38f5af81771e65d87729e57abd1337a)
    Target: AccessManager (0xacc000818e5bbd911d5d449aa81cb5ca24024739)
    Function: grantRole(UPGRADER_ROLE, KintoAdminMultisig (0x2e2b1c42e38f5af81771e65d87729e57abd1337a), 950400 (11d))
```

## Watched changes

```diff
    contract NioGovernor (0x010600ff5f36C8eF3b6Aaf2A88C2DE85C798594a) {
    +++ description: Governance contract allowing token- and NFT based voting.
      receivedPermissions:
-        [{"permission":"interact","from":"0xf369f78E3A0492CC4e96a90dae0728A38498e9c7","description":"permissioned to call `confirmSanction()`, which makes a temporary sanction by a KYC_PROVIDER permanent and does not grant an exit window to the affected wallet."}]
    }
```

```diff
    contract BridgedKinto (0x010700808D59d2bb92257fCafACfe8e5bFF7aB87) {
    +++ description: KINTO token contract.
      sourceHashes.1:
-        "0xe15912dcb541011cee29f6046afcf500542e3763f530012c1ce71e54abd96545"
+        "0x8afd4a6a4dce2fedf29d5a78d35edbb8101e74ea5e923aebda93db04b4f44121"
      values.$implementation:
-        "0xd70052c77dC9E5291c79842420a6d51010Ed014c"
+        "0x6af53F698b87809d98CeAAfa848c73e192400E61"
      values.$pastUpgrades.7:
+        ["2025-02-21T21:13:41.000Z","0xd65d8a3e984c6df5eb9bda4baee108c063c153abc195fbb9656b1d4b8236a1cb",["0xd70052c77dC9E5291c79842420a6d51010Ed014c"]]
      values.$pastUpgrades.6:
+        ["2024-06-29T15:10:34.000Z","0xd8d8d68bef601e045e6b2bff422ebdb8857e554c568bece1148ee7a8bde6a865",["0x840670bC23d0f77474e43f8ee4A2Da617c7376F0"]]
      values.$pastUpgrades.5.2:
-        "2025-02-21T21:13:41.000Z"
+        ["0xd70052c77dC9E5291c79842420a6d51010Ed014c"]
      values.$pastUpgrades.5.1:
-        ["0xd70052c77dC9E5291c79842420a6d51010Ed014c"]
+        "2025-03-19T21:51:53.000Z"
      values.$pastUpgrades.5.0:
-        "0xd65d8a3e984c6df5eb9bda4baee108c063c153abc195fbb9656b1d4b8236a1cb"
+        "0x0e582739f5a4d9605c001b7e2000de6140e478098f664ca7c907d7886bfd96f3"
      values.$pastUpgrades.4.2:
-        "2024-06-29T15:10:34.000Z"
+        "0xb0828f7016e3452a4b32bf6d987b8a8e265c5bdf5fedbcc42b51940f17d18ab8"
      values.$pastUpgrades.4.1.0:
-        "0x840670bC23d0f77474e43f8ee4A2Da617c7376F0"
+        "0xAf968044D5DE68fE01B5a6517d0DbeE3caD8563a"
      values.$pastUpgrades.4.0:
-        "0xd8d8d68bef601e045e6b2bff422ebdb8857e554c568bece1148ee7a8bde6a865"
+        "2024-12-18T00:08:48.000Z"
      values.$pastUpgrades.3.2:
-        "0xb0828f7016e3452a4b32bf6d987b8a8e265c5bdf5fedbcc42b51940f17d18ab8"
+        ["0x2D8Cb3A6cE18F78e479bbC5079865993324C51BA"]
      values.$pastUpgrades.3.1:
-        ["0xAf968044D5DE68fE01B5a6517d0DbeE3caD8563a"]
+        "0x2ede5a1db2f802171ef91a7693dc8313c822592a555e36ae1506ec468c897dd1"
      values.$pastUpgrades.3.0:
-        "2024-12-18T00:08:48.000Z"
+        "2024-06-20T23:33:48.000Z"
      values.$pastUpgrades.2.2.0:
-        "0x2D8Cb3A6cE18F78e479bbC5079865993324C51BA"
+        "0x6af53F698b87809d98CeAAfa848c73e192400E61"
      values.$pastUpgrades.2.1:
-        "0x2ede5a1db2f802171ef91a7693dc8313c822592a555e36ae1506ec468c897dd1"
+        "0xe01e30073eae9d9b6eb56ffce85389dbcafd04dcbbf007e05c77351182a4850c"
      values.$pastUpgrades.2.0:
-        "2024-06-20T23:33:48.000Z"
+        "2025-03-20T00:39:13.000Z"
      values.$upgradeCount:
-        6
+        8
      values.STAKING:
+        "0x5A1e00984Af33BED5520Fd13e9c940F9f913cF10"
    }
```

```diff
    contract KintoSecurityCouncil_L2Alias (0x28fC10E12A78f986c78F973Fc70ED88072b34c8e) {
    +++ description: None
      receivedPermissions.1.delay:
-        604800
+        950400
    }
```

```diff
    contract KintoAdminMultisig (0x2e2B1c42E38f5af81771e65D87729E57ABD1337a) {
    +++ description: None
      receivedPermissions.5.permission:
-        "interact"
+        "upgrade"
      receivedPermissions.5.from:
-        "0xacC000818e5Bbd911D5d449aA81CB5cA24024739"
+        "0x0719D47A213149E2Ef8d3f5afDaDA8a8E22dfc03"
      receivedPermissions.5.description:
-        "change the configuration of all AccessManager permissions. The total delay can depend on the target of the configuration."
      receivedPermissions.4.permission:
-        "upgrade"
+        "interact"
      receivedPermissions.4.from:
-        "0x0719D47A213149E2Ef8d3f5afDaDA8a8E22dfc03"
+        "0xacC000818e5Bbd911D5d449aA81CB5cA24024739"
      receivedPermissions.4.delay:
+        950400
      receivedPermissions.4.description:
+        "change the configuration of all AccessManager permissions. The total delay can depend on the target of the configuration."
    }
```

```diff
    contract AccessManager (0xacC000818e5Bbd911D5d449aA81CB5cA24024739) {
    +++ description: Standard OpenZeppelin AccessManager contract: Serves as a proxy contract defining the roles, permissions and delays to call functions in target contracts.
      issuedPermissions.4.delay:
+        950400
      issuedPermissions.2.delay:
-        604800
+        950400
      values.accessControl.roles.ADMIN_ROLE.members.1.member:
-        "0x2e2B1c42E38f5af81771e65D87729E57ABD1337a"
+        "0x28fC10E12A78f986c78F973Fc70ED88072b34c8e"
      values.accessControl.roles.ADMIN_ROLE.members.1.since:
-        1729791296
+        1742341092
      values.accessControl.roles.ADMIN_ROLE.members.1.executionDelay:
-        0
+        604800
      values.accessControl.roles.ADMIN_ROLE.members.0.member:
-        "0x28fC10E12A78f986c78F973Fc70ED88072b34c8e"
+        "0x2e2B1c42E38f5af81771e65D87729E57ABD1337a"
      values.accessControl.roles.ADMIN_ROLE.members.0.since:
-        1742341092
+        1742514140
      values.accessControl.roles.ADMIN_ROLE.members.0.executionDelay:
-        604800
+        950400
      values.accessControl.roles.SECURITY_COUNCIL_ROLE.members.0.since:
-        1739472657
+        1742427194
      values.accessControl.roles.SECURITY_COUNCIL_ROLE.members.0.executionDelay:
-        604800
+        950400
      values.accessControl.targets.0x8a4720488CA32f1223ccFE5A087e250fE3BC5D75.adminDelay:
-        604800
+        950400
      values.accessControl.targets.0x5A2b641b84b0230C8e75F55d5afd27f4Dbd59d5b.adminDelay:
-        604800
+        950400
      values.accessControl.targets.0xf369f78E3A0492CC4e96a90dae0728A38498e9c7.adminDelay:
-        604800
+        950400
+++ description: Current execution delay for target calls.
+++ severity: HIGH
      values.edKintoAdminMultisigADMIN:
-        0
+        950400
+++ description: Current execution delay for target calls.
+++ severity: HIGH
      values.edScSECURITY_COUNCIL:
-        604800
+        950400
+++ description: List of scheduled operations.
+++ severity: HIGH
      values.OperationScheduled.0:
+        {"operationId":"0x0ad95e032eb7beede43f2741b7bcef6566a6163eaa1ac1ef42441f25193096d8","nonce":1,"schedule":1743464541,"caller":"0x2e2B1c42E38f5af81771e65D87729E57ABD1337a","target":"0xacC000818e5Bbd911D5d449aA81CB5cA24024739","data":"0x25c471a0000000000000000000000000000000000000000000000000783b0946b8c9d2e30000000000000000000000002e2b1c42e38f5af81771e65d87729e57abd1337a00000000000000000000000000000000000000000000000000000000000e8080"}
+++ description: List of roles granted to accounts.
      values.RolesGranted.0.2:
+        {"account":"0x2e2B1c42E38f5af81771e65D87729E57ABD1337a","delay":0,"since":1729791296,"newMember":true}
      values.RolesGranted.0.1.delay:
-        0
+        950400
      values.RolesGranted.0.1.since:
-        1729791296
+        1742514140
      values.RolesGranted.0.1.newMember:
-        true
+        false
+++ description: List of roles granted to accounts.
      values.RolesGranted.14661544942390944024.1:
+        {"account":"0x28fC10E12A78f986c78F973Fc70ED88072b34c8e","delay":950400,"since":1742427194,"newMember":false}
      values.TargetAdminDelayUpdated.0x8a4720488CA32f1223ccFE5A087e250fE3BC5D75.delay:
-        604800
+        950400
      values.TargetAdminDelayUpdated.0x8a4720488CA32f1223ccFE5A087e250fE3BC5D75.since:
-        1733613166
+        1742859194
      values.TargetAdminDelayUpdated.0xf369f78E3A0492CC4e96a90dae0728A38498e9c7.delay:
-        604800
+        950400
      values.TargetAdminDelayUpdated.0xf369f78E3A0492CC4e96a90dae0728A38498e9c7.since:
-        1739904656
+        1742859192
      values.TargetAdminDelayUpdated.0x5A2b641b84b0230C8e75F55d5afd27f4Dbd59d5b.delay:
-        604800
+        950400
      values.TargetAdminDelayUpdated.0x5A2b641b84b0230C8e75F55d5afd27f4Dbd59d5b.since:
-        1742772894
+        1742859193
    }
```

```diff
    contract KintoID (0xf369f78E3A0492CC4e96a90dae0728A38498e9c7) {
    +++ description: Manages Kinto's KYC system: The KYC_PROVIDER roles responsible for managing the KYC status and KYC metadata of user wallets. Each KintoWallet checks the KYC status of its user in this contract as part of the signature check.
      issuedPermissions.10:
-        {"permission":"upgrade","to":"0xacC000818e5Bbd911D5d449aA81CB5cA24024739","via":[]}
      issuedPermissions.9.permission:
-        "interact"
+        "upgrade"
      issuedPermissions.9.to:
-        "0x6E31039abF8d248aBed57E307C9E1b7530c269E4"
+        "0xacC000818e5Bbd911D5d449aA81CB5cA24024739"
      issuedPermissions.9.description:
-        "manage the KYC status of any user (sanction status and KYC metadata) and mint/burn KintoID NFTs."
      issuedPermissions.8.to:
-        "0xacC000818e5Bbd911D5d449aA81CB5cA24024739"
+        "0x6E31039abF8d248aBed57E307C9E1b7530c269E4"
      issuedPermissions.7.to:
-        "0x6E09F8A68fB5278e0C33D239dC12B2Cec33F4aC7"
+        "0xacC000818e5Bbd911D5d449aA81CB5cA24024739"
      issuedPermissions.6.to:
-        "0xacC000818e5Bbd911D5d449aA81CB5cA24024739"
+        "0x6E09F8A68fB5278e0C33D239dC12B2Cec33F4aC7"
      issuedPermissions.6.description:
-        "permissioned to call `confirmSanction()`, which makes a temporary sanction by a KYC_PROVIDER permanent and does not grant an exit window to the affected wallet."
+        "manage the KYC status of any user (sanction status and KYC metadata) and mint/burn KintoID NFTs."
      issuedPermissions.5.to:
-        "0x6fe642404B7B23F31251103Ca0efb538Ad4aeC07"
+        "0xacC000818e5Bbd911D5d449aA81CB5cA24024739"
      issuedPermissions.5.description:
-        "manage the KYC status of any user (sanction status and KYC metadata) and mint/burn KintoID NFTs."
+        "permissioned to call `confirmSanction()`, which makes a temporary sanction by a KYC_PROVIDER permanent and does not grant an exit window to the affected wallet."
      issuedPermissions.4.to:
-        "0x52F09693c9eEaA93A64BA697e3d3e43a1eB65477"
+        "0x6fe642404B7B23F31251103Ca0efb538Ad4aeC07"
      issuedPermissions.3.to:
-        "0xacC000818e5Bbd911D5d449aA81CB5cA24024739"
+        "0x52F09693c9eEaA93A64BA697e3d3e43a1eB65477"
      issuedPermissions.3.description:
-        "transfer KYC NFTs to a different address."
+        "manage the KYC status of any user (sanction status and KYC metadata) and mint/burn KintoID NFTs."
      issuedPermissions.2.to:
-        "0x2e2B1c42E38f5af81771e65D87729E57ABD1337a"
+        "0xacC000818e5Bbd911D5d449aA81CB5cA24024739"
      issuedPermissions.2.description:
-        "manage the KYC status of any user (sanction status and KYC metadata) and mint/burn KintoID NFTs."
+        "transfer KYC NFTs to a different address."
      issuedPermissions.1.to:
-        "0xb539019776eF803E89EC062Ad54cA24D1Fdb008a"
+        "0x2e2B1c42E38f5af81771e65D87729E57ABD1337a"
      issuedPermissions.0.to:
-        "0x010600ff5f36C8eF3b6Aaf2A88C2DE85C798594a"
+        "0xb539019776eF803E89EC062Ad54cA24D1Fdb008a"
      issuedPermissions.0.description:
-        "permissioned to call `confirmSanction()`, which makes a temporary sanction by a KYC_PROVIDER permanent and does not grant an exit window to the affected wallet."
+        "manage the KYC status of any user (sanction status and KYC metadata) and mint/burn KintoID NFTs."
      values.accessControl.GOVERNANCE_ROLE.members.1:
-        "0x010600ff5f36C8eF3b6Aaf2A88C2DE85C798594a"
+++ severity: HIGH
      values.GOVERNANCErs.1:
-        "0x010600ff5f36C8eF3b6Aaf2A88C2DE85C798594a"
    }
```

## Source code changes

```diff
.../kinto/{.flat@770292 => .flat}/BridgedKinto/BridgedKinto.sol      | 5 ++++-
 1 file changed, 4 insertions(+), 1 deletion(-)
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 770292 (main branch discovery), not current.

```diff
    contract NioGuardians (0x0100005D52Be9ab3ccE0C70Abf6F6FA2C48e91C9) {
    +++ description: Contract using NFTs as voting tokens to be used by Nio Guardians in the NioGovernor.
      category:
+        {"name":"Spam","priority":-1}
    }
```

```diff
    contract NioGovernor (0x010600ff5f36C8eF3b6Aaf2A88C2DE85C798594a) {
    +++ description: Governance contract allowing token- and NFT based voting.
      category:
+        {"name":"Spam","priority":-1}
    }
```

```diff
    contract Faucet (0x0719D47A213149E2Ef8d3f5afDaDA8a8E22dfc03) {
    +++ description: None
      category:
+        {"name":"Spam","priority":-1}
    }
```

```diff
    contract SponsorPaymaster (0x1842a4EFf3eFd24c50B63c3CF89cECEe245Fc2bd) {
    +++ description: Paymaster used for user transactions eligible for sponsorship.
      category:
+        {"name":"Spam","priority":-1}
    }
```

```diff
    contract EntryPoint (0x2843C269D2a64eCfA63548E8B3Fc0FD23B7F70cb) {
    +++ description: Used as entrypoint to transact using smartwallets and UserOps.
      description:
+        "Used as entrypoint to transact using smartwallets and UserOps."
    }
```

```diff
    contract KintoSecurityCouncil_L2Alias (0x28fC10E12A78f986c78F973Fc70ED88072b34c8e) {
    +++ description: None
      receivedPermissions:
+        [{"permission":"interact","from":"0xacC000818e5Bbd911D5d449aA81CB5cA24024739","delay":950400,"description":"upgrade the implementation of the core contracts KintoID, KintoAppRegistry and KintoWalletFactory."},{"permission":"interact","from":"0xacC000818e5Bbd911D5d449aA81CB5cA24024739","delay":604800,"description":"manage the whitelisted addresses in the KintoAppRegistry which affects censorship on the entire rollup."},{"permission":"interact","from":"0xacC000818e5Bbd911D5d449aA81CB5cA24024739","delay":604800,"description":"change the configuration of all AccessManager permissions. The total delay can depend on the target of the configuration."}]
    }
```

```diff
    contract KintoAdminMultisig (0x2e2B1c42E38f5af81771e65D87729E57ABD1337a) {
    +++ description: None
      issuedPermissions:
-        [{"permission":"upgrade","to":"0x8a4720488CA32f1223ccFE5A087e250fE3BC5D75","via":[]}]
      receivedPermissions.5:
+        {"permission":"interact","from":"0xacC000818e5Bbd911D5d449aA81CB5cA24024739","description":"change the configuration of all AccessManager permissions. The total delay can depend on the target of the configuration."}
      receivedPermissions.4:
+        {"permission":"upgrade","from":"0x0719D47A213149E2Ef8d3f5afDaDA8a8E22dfc03"}
      receivedPermissions.3.from:
-        "0x0719D47A213149E2Ef8d3f5afDaDA8a8E22dfc03"
+        "0x1842a4EFf3eFd24c50B63c3CF89cECEe245Fc2bd"
      receivedPermissions.2.permission:
-        "upgrade"
+        "interact"
      receivedPermissions.2.from:
-        "0x1842a4EFf3eFd24c50B63c3CF89cECEe245Fc2bd"
+        "0x0100005D52Be9ab3ccE0C70Abf6F6FA2C48e91C9"
      receivedPermissions.2.description:
+        "mint Nio Guardian NFTs to any address, inheriting the permissions of the NFT."
      receivedPermissions.1.from:
-        "0x0100005D52Be9ab3ccE0C70Abf6F6FA2C48e91C9"
+        "0xf369f78E3A0492CC4e96a90dae0728A38498e9c7"
      receivedPermissions.1.description:
-        "mint Nio Guardian NFTs to any address, inheriting the permissions of the NFT."
+        "manage the KYC status of any user (sanction status and KYC metadata) and mint/burn KintoID NFTs."
      receivedPermissions.0.from:
-        "0xf369f78E3A0492CC4e96a90dae0728A38498e9c7"
+        "0xacC000818e5Bbd911D5d449aA81CB5cA24024739"
      receivedPermissions.0.description:
-        "manage the KYC status of any user (sanction status and KYC metadata) and mint/burn KintoID NFTs."
+        "upgrade the implementation of the core contracts KintoID, KintoAppRegistry and KintoWalletFactory."
      receivedPermissions.0.delay:
+        604800
    }
```

```diff
-   Status: DELETED
    contract L2GatewayRouter (0x340487b92808B84c2bd97C87B590EE81267E04a7)
    +++ description: None
```

```diff
    contract Socket (0x3e9727470C66B1e77034590926CDe0242B5A3dCc) {
    +++ description: Central contract for bridging via the external socket bridge.
      description:
+        "Central contract for bridging via the external socket bridge."
      category:
+        {"name":"External Bridges","priority":1}
    }
```

```diff
    contract KintoAppRegistry (0x5A2b641b84b0230C8e75F55d5afd27f4Dbd59d5b) {
    +++ description: Central system contract defining addresses that are allowed to be called by EOAs. The modified Kinto node reads this configuration and drops all other transactions from EOAs (enforced by a modified state transition function). As a result, users can only transact using a canonical smart wallet.
      description:
-        "Central system contract defining addresses that are allowed to be called by EOAs. The modified Kinto node reads this configuration and drops all other transactions from EOAs (enforced by a modified state transition function). Accordingly, users can only transact from their smart wallets."
+        "Central system contract defining addresses that are allowed to be called by EOAs. The modified Kinto node reads this configuration and drops all other transactions from EOAs (enforced by a modified state transition function). As a result, users can only transact using a canonical smart wallet."
      fieldMeta.getSystemContracts.description:
-        "Contracts that are exempt from the STF-enforced rule that EOAs cannot call contracts. Must include ArbSys `0x0000000000000000000000000000000000000064` for ETH withdrawals from an EOA."
+        "Target contracts that are exempt from the STF-enforced rule that EOAs cannot make transactions. Must include ArbRetryableTx `0x000000000000000000000000000000000000006E`, EntryPoint `0x2843C269D2a64eCfA63548E8B3Fc0FD23B7F70cb`, ArbSys `0x0000000000000000000000000000000000000064`."
      category:
+        {"name":"Local Infrastructure","priority":5}
    }
```

```diff
    contract Treasury (0x793500709506652Fcc61F0d2D0fDa605638D4293) {
    +++ description: Kinto Treasury.
      category:
+        {"name":"Spam","priority":-1}
    }
```

```diff
-   Status: DELETED
    contract  (0x87799989341A07F495287B1433eea98398FD73aA)
    +++ description: None
```

```diff
    contract BeaconKintoWallet (0x87f0eE85bF3198654900a422832157abBba30828) {
    +++ description: Beacon proxy for the KintoWallet smartwallet implementation that is used for all users.
      description:
+        "Beacon proxy for the KintoWallet smartwallet implementation that is used for all users."
    }
```

```diff
-   Status: DELETED
    contract  (0x88e03D41a6EAA9A0B93B0e2d6F1B34619cC4319b)
    +++ description: None
```

```diff
    contract KintoWalletFactory (0x8a4720488CA32f1223ccFE5A087e250fE3BC5D75) {
    +++ description: Deploys new KintoWallet smartwallets for users upon passing KYC checks. Also manages the beacon implementation for all KintoWallets and their recovery logic. KintoWallets can be funded with ETH via this contract.
      description:
-        "Deploys new KintoWallet beacon proxies when users create a wallet. Also manages the beacon implementation for all KintoWallets and their recovery logic."
+        "Deploys new KintoWallet smartwallets for users upon passing KYC checks. Also manages the beacon implementation for all KintoWallets and their recovery logic. KintoWallets can be funded with ETH via this contract."
      receivedPermissions:
-        [{"permission":"upgrade","from":"0x2e2B1c42E38f5af81771e65D87729E57ABD1337a"}]
      directlyReceivedPermissions:
+        [{"permission":"upgrade","from":"0x2e2B1c42E38f5af81771e65D87729E57ABD1337a"}]
      category:
+        {"name":"Local Infrastructure","priority":5}
    }
```

```diff
    contract BundleBulker (0x8d2D899402ed84b6c0510bB1ad34ee436ADDD20d) {
    +++ description: None
      category:
+        {"name":"Spam","priority":-1}
    }
```

```diff
-   Status: DELETED
    contract ProxyAdmin (0x9eC0253E4174a14C0536261888416451A407Bf79)
    +++ description: None
```

```diff
    contract AccessManager (0xacC000818e5Bbd911D5d449aA81CB5cA24024739) {
    +++ description: Standard OpenZeppelin AccessManager contract: Serves as a proxy contract defining the roles, permissions and delays to call functions in target contracts.
      description:
-        "Standard OpenZeppelin AccessManager: Serves as a proxy contract defining the roles, permissions and delays to call functions in target contracts."
+        "Standard OpenZeppelin AccessManager contract: Serves as a proxy contract defining the roles, permissions and delays to call functions in target contracts."
+++ description: Current execution delay for target calls.
+++ severity: HIGH
      values.edKintoAdminMultisigADMIN:
+        0
+++ description: Current execution delay for target calls.
+++ severity: HIGH
      values.edKintoAdminMultisigUPGRADER:
+        604800
+++ description: Current execution delay for target calls.
+++ severity: HIGH
      values.edScADMIN:
+        604800
+++ description: Current execution delay for target calls.
+++ severity: HIGH
      values.edScSECURITY_COUNCIL:
+        604800
+++ description: Current execution delay for target calls.
+++ severity: HIGH
      values.edScUPGRADER:
+        950400
      values.kintoAdminMultisigPermission:
+        "0x2e2B1c42E38f5af81771e65D87729E57ABD1337a"
      values.securityCouncilPermission:
+        "0x28fC10E12A78f986c78F973Fc70ED88072b34c8e"
+++ description: CURRENT target admin delay, the access control handler shows the pending delay. Delays all config changes/additions in the AccessManager that affect this target. Must be >= 11d.
+++ severity: HIGH
      values.tadKintoAppRegistry:
+        0
+++ description: CURRENT target admin delay, the access control handler shows the pending delay. Delays all config changes/additions in the AccessManager that affect this target. Must be >= 11d.
+++ severity: HIGH
      values.tadKintoID:
+        604800
+++ description: CURRENT target admin delay, the access control handler shows the pending delay. Delays all config changes/additions in the AccessManager that affect this target. Must be >= 11d.
+++ severity: HIGH
      values.tadKintoWalletFactory:
+        604800
      fieldMeta.tadKintoWalletFactory:
+        {"severity":"HIGH","description":"CURRENT target admin delay, the access control handler shows the pending delay. Delays all config changes/additions in the AccessManager that affect this target. Must be >= 11d."}
      fieldMeta.tadKintoAppRegistry:
+        {"severity":"HIGH","description":"CURRENT target admin delay, the access control handler shows the pending delay. Delays all config changes/additions in the AccessManager that affect this target. Must be >= 11d."}
      fieldMeta.tadKintoID:
+        {"severity":"HIGH","description":"CURRENT target admin delay, the access control handler shows the pending delay. Delays all config changes/additions in the AccessManager that affect this target. Must be >= 11d."}
      fieldMeta.edKintoAdminMultisigUPGRADER:
+        {"severity":"HIGH","description":"Current execution delay for target calls."}
      fieldMeta.edKintoAdminMultisigADMIN:
+        {"severity":"HIGH","description":"Current execution delay for target calls."}
      fieldMeta.edScADMIN:
+        {"severity":"HIGH","description":"Current execution delay for target calls."}
      fieldMeta.edScUPGRADER:
+        {"severity":"HIGH","description":"Current execution delay for target calls."}
      fieldMeta.edScSECURITY_COUNCIL:
+        {"severity":"HIGH","description":"Current execution delay for target calls."}
      issuedPermissions:
+        [{"permission":"interact","to":"0x28fC10E12A78f986c78F973Fc70ED88072b34c8e","delay":950400,"description":"upgrade the implementation of the core contracts KintoID, KintoAppRegistry and KintoWalletFactory.","via":[]},{"permission":"interact","to":"0x2e2B1c42E38f5af81771e65D87729E57ABD1337a","delay":604800,"description":"upgrade the implementation of the core contracts KintoID, KintoAppRegistry and KintoWalletFactory.","via":[]},{"permission":"interact","to":"0x28fC10E12A78f986c78F973Fc70ED88072b34c8e","delay":604800,"description":"manage the whitelisted addresses in the KintoAppRegistry which affects censorship on the entire rollup.","via":[]},{"permission":"interact","to":"0x28fC10E12A78f986c78F973Fc70ED88072b34c8e","delay":604800,"description":"change the configuration of all AccessManager permissions. The total delay can depend on the target of the configuration.","via":[]},{"permission":"interact","to":"0x2e2B1c42E38f5af81771e65D87729E57ABD1337a","description":"change the configuration of all AccessManager permissions. The total delay can depend on the target of the configuration.","via":[]}]
      category:
+        {"name":"Governance","priority":3}
    }
```

```diff
    contract RewardsDistributor (0xD157904639E89df05e89e0DabeEC99aE3d74F9AA) {
    +++ description: None
      category:
+        {"name":"Spam","priority":-1}
    }
```

```diff
    contract KintoID (0xf369f78E3A0492CC4e96a90dae0728A38498e9c7) {
    +++ description: Manages Kinto's KYC system: The KYC_PROVIDER roles responsible for managing the KYC status and KYC metadata of user wallets. Each KintoWallet checks the KYC status of its user in this contract as part of the signature check.
      description:
-        "Manages Kinto's KYC system: The KYC_PROVIDER roles responsible for the KYC status and KYC metadata of user wallets."
+        "Manages Kinto's KYC system: The KYC_PROVIDER roles responsible for managing the KYC status and KYC metadata of user wallets. Each KintoWallet checks the KYC status of its user in this contract as part of the signature check."
      values.ownerOf:
-        ["0x660ad4B5A74130a4796B4d54BC6750Ae93C86e6c","0x0C1df30B4576A1A94D9528854516D4d425Cf9323","0x70E218164e6A59AE756107D0D6eC2c498110Bc2E"]
      category:
+        {"name":"Local Infrastructure","priority":5}
    }
```

Generated with discovered.json: 0xc5ef443f6f124d5cf1f9731e023d2edb89bfe916

# Diff at Wed, 19 Mar 2025 15:45:47 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@4609d8355d7594946b66bef47876090fce6b0842 block: 769390
- current block number: 770292

## Description

Kinto gov update (copypasting from telegram):

KintoAdminMultisig (0x2e2B1c42E38f5af81771e65D87729E57ABD1337a):
roles held:
  ADMIN_ROLE: executionDelay: 0
  UPGRADER_ROLE: executionDelay: 604800 (7d)

SC-L2Alias (0x28fC10E12A78f986c78F973Fc70ED88072b34c8e):
roles held:
  ADMIN_ROLE: executionDelay: 604800 (7d)
  UPGRADER_ROLE: executionDelay: 950400 (11d)
  SECURITY_COUNCIL_ROLE: executionDelay: 604800 (7d)

targets:

KintoWalletFactory (0x8a4720488CA32f1223ccFE5A087e250fE3BC5D75):
targetAdminDelay: 604800 (7d)
roles: UPGRADER_ROLE (upgradeAllWalletImplementations(address), upgradeTo(address))

KintoID (0xf369f78E3A0492CC4e96a90dae0728A38498e9c7):
targetAdminDelay: 604800 (7d)
roles: UPGRADER_ROLE (upgradeTo(address))

KintoAppRegistry (0x5A2b641b84b0230C8e75F55d5afd27f4Dbd59d5b):
targetAdminDelay: 604800 (7d)
roles: 
  UPGRADER_ROLE (upgradeTo(address))
  SECURITY_COUNCIL_ROLE (updateSystemApps(address[]), updateSystemContracts(address[]), updateReservedContracts(address[]))

i found the following in the current deployment/config:

KintoID: GOVERNANCE_ROLE is held by the NioGovernor (only SecurityCouncil should be able to confirmSanction())

AccessManager: 
here i am assuming the KintoAdminMultisig will be removed? (see above, it could also be used with a min execution delay of 11d for its currently held 2 roles).

apart from that, the delay is still 7d for all targetAdminDelays and some executionDelays. the proposed solution here is to use a unified 11d or more for all of them, since the function selectors covered in the AccessManager are all either upgrades or touching the state transition function / KYC.

## Watched changes

```diff
    contract KintoAdminMultisig (0x2e2B1c42E38f5af81771e65D87729E57ABD1337a) {
    +++ description: None
      receivedPermissions.6:
-        {"permission":"upgrade","from":"0x0719D47A213149E2Ef8d3f5afDaDA8a8E22dfc03"}
      receivedPermissions.5:
-        {"permission":"upgrade","from":"0x1842a4EFf3eFd24c50B63c3CF89cECEe245Fc2bd"}
      receivedPermissions.4:
-        {"permission":"interact","from":"0x0100005D52Be9ab3ccE0C70Abf6F6FA2C48e91C9","description":"mint Nio Guardian NFTs to any address, inheriting the permissions of the NFT."}
      receivedPermissions.3.from:
-        "0xf369f78E3A0492CC4e96a90dae0728A38498e9c7"
+        "0x0719D47A213149E2Ef8d3f5afDaDA8a8E22dfc03"
      receivedPermissions.2.permission:
-        "interact"
+        "upgrade"
      receivedPermissions.2.from:
-        "0xf369f78E3A0492CC4e96a90dae0728A38498e9c7"
+        "0x1842a4EFf3eFd24c50B63c3CF89cECEe245Fc2bd"
      receivedPermissions.2.description:
-        "manage the KYC status of any user (sanction status and KYC metadata) and mint/burn KintoID NFTs."
      receivedPermissions.1.from:
-        "0xf369f78E3A0492CC4e96a90dae0728A38498e9c7"
+        "0x0100005D52Be9ab3ccE0C70Abf6F6FA2C48e91C9"
      receivedPermissions.1.description:
-        "permissioned to call `confirmSanction()`, which makes a temporary sanction by a KYC_PROVIDER permanent and does not grant an exit window to the affected wallet."
+        "mint Nio Guardian NFTs to any address, inheriting the permissions of the NFT."
      receivedPermissions.0.description:
-        "transfer KYC NFTs to a different address."
+        "manage the KYC status of any user (sanction status and KYC metadata) and mint/burn KintoID NFTs."
    }
```

```diff
    contract AccessManager (0xacC000818e5Bbd911D5d449aA81CB5cA24024739) {
    +++ description: Standard OpenZeppelin AccessManager: Serves as a proxy contract defining the roles, permissions and delays to call functions in target contracts.
      values.accessControl.roles.ADMIN_ROLE.members.1:
+        {"member":"0x2e2B1c42E38f5af81771e65D87729E57ABD1337a","since":1729791296,"executionDelay":0}
      values.accessControl.roles.ADMIN_ROLE.members.0.member:
-        "0x2e2B1c42E38f5af81771e65D87729E57ABD1337a"
+        "0x28fC10E12A78f986c78F973Fc70ED88072b34c8e"
      values.accessControl.roles.ADMIN_ROLE.members.0.since:
-        1729791296
+        1742341092
      values.accessControl.roles.ADMIN_ROLE.members.0.executionDelay:
-        0
+        604800
      values.accessControl.roles.UPGRADER_ROLE.members.1.member:
-        "0x28fC10E12A78f986c78F973Fc70ED88072b34c8e"
+        "0x2e2B1c42E38f5af81771e65D87729E57ABD1337a"
      values.accessControl.roles.UPGRADER_ROLE.members.1.since:
-        1740077455
+        1733181166
      values.accessControl.roles.UPGRADER_ROLE.members.0.member:
-        "0x2e2B1c42E38f5af81771e65D87729E57ABD1337a"
+        "0x28fC10E12A78f986c78F973Fc70ED88072b34c8e"
      values.accessControl.roles.UPGRADER_ROLE.members.0.since:
-        1733181166
+        1742340846
      values.accessControl.roles.UPGRADER_ROLE.members.0.executionDelay:
-        604800
+        950400
      values.accessControl.targets.0x5A2b641b84b0230C8e75F55d5afd27f4Dbd59d5b.adminDelay:
+        604800
+++ description: List of roles granted to accounts.
      values.RolesGranted.0.1:
+        {"account":"0x2e2B1c42E38f5af81771e65D87729E57ABD1337a","delay":0,"since":1729791296,"newMember":true}
      values.RolesGranted.0.0.account:
-        "0x2e2B1c42E38f5af81771e65D87729E57ABD1337a"
+        "0x28fC10E12A78f986c78F973Fc70ED88072b34c8e"
      values.RolesGranted.0.0.delay:
-        0
+        604800
      values.RolesGranted.0.0.since:
-        1729791296
+        1742341092
+++ description: List of roles granted to accounts.
      values.RolesGranted.8663528507529876195.2:
+        {"account":"0x28fC10E12A78f986c78F973Fc70ED88072b34c8e","delay":950400,"since":1742340846,"newMember":false}
      values.TargetAdminDelayUpdated.0x5A2b641b84b0230C8e75F55d5afd27f4Dbd59d5b:
+        {"delay":604800,"since":1742772894}
    }
```

```diff
    contract KintoID (0xf369f78E3A0492CC4e96a90dae0728A38498e9c7) {
    +++ description: Manages Kinto's KYC system: The KYC_PROVIDER roles responsible for the KYC status and KYC metadata of user wallets.
      issuedPermissions.13:
-        {"permission":"upgrade","to":"0xacC000818e5Bbd911D5d449aA81CB5cA24024739","via":[]}
      issuedPermissions.12:
-        {"permission":"interact","to":"0x6E31039abF8d248aBed57E307C9E1b7530c269E4","description":"manage the KYC status of any user (sanction status and KYC metadata) and mint/burn KintoID NFTs.","via":[]}
      issuedPermissions.11:
-        {"permission":"interact","to":"0xacC000818e5Bbd911D5d449aA81CB5cA24024739","description":"manage the KYC status of any user (sanction status and KYC metadata) and mint/burn KintoID NFTs.","via":[]}
      issuedPermissions.10.permission:
-        "interact"
+        "upgrade"
      issuedPermissions.10.to:
-        "0x6E09F8A68fB5278e0C33D239dC12B2Cec33F4aC7"
+        "0xacC000818e5Bbd911D5d449aA81CB5cA24024739"
      issuedPermissions.10.description:
-        "manage the KYC status of any user (sanction status and KYC metadata) and mint/burn KintoID NFTs."
      issuedPermissions.9.to:
-        "0xacC000818e5Bbd911D5d449aA81CB5cA24024739"
+        "0x6E31039abF8d248aBed57E307C9E1b7530c269E4"
      issuedPermissions.9.description:
-        "permissioned to call `confirmSanction()`, which makes a temporary sanction by a KYC_PROVIDER permanent and does not grant an exit window to the affected wallet."
+        "manage the KYC status of any user (sanction status and KYC metadata) and mint/burn KintoID NFTs."
      issuedPermissions.8.to:
-        "0x6fe642404B7B23F31251103Ca0efb538Ad4aeC07"
+        "0xacC000818e5Bbd911D5d449aA81CB5cA24024739"
      issuedPermissions.7.permission:
-        "upgrade"
+        "interact"
      issuedPermissions.7.to:
-        "0x2e2B1c42E38f5af81771e65D87729E57ABD1337a"
+        "0x6E09F8A68fB5278e0C33D239dC12B2Cec33F4aC7"
      issuedPermissions.7.description:
+        "manage the KYC status of any user (sanction status and KYC metadata) and mint/burn KintoID NFTs."
      issuedPermissions.6.to:
-        "0x52F09693c9eEaA93A64BA697e3d3e43a1eB65477"
+        "0xacC000818e5Bbd911D5d449aA81CB5cA24024739"
      issuedPermissions.6.description:
-        "manage the KYC status of any user (sanction status and KYC metadata) and mint/burn KintoID NFTs."
+        "permissioned to call `confirmSanction()`, which makes a temporary sanction by a KYC_PROVIDER permanent and does not grant an exit window to the affected wallet."
      issuedPermissions.5.to:
-        "0xacC000818e5Bbd911D5d449aA81CB5cA24024739"
+        "0x6fe642404B7B23F31251103Ca0efb538Ad4aeC07"
      issuedPermissions.5.description:
-        "transfer KYC NFTs to a different address."
+        "manage the KYC status of any user (sanction status and KYC metadata) and mint/burn KintoID NFTs."
      issuedPermissions.4.to:
-        "0x2e2B1c42E38f5af81771e65D87729E57ABD1337a"
+        "0x52F09693c9eEaA93A64BA697e3d3e43a1eB65477"
      issuedPermissions.3.to:
-        "0x2e2B1c42E38f5af81771e65D87729E57ABD1337a"
+        "0xacC000818e5Bbd911D5d449aA81CB5cA24024739"
      issuedPermissions.3.description:
-        "permissioned to call `confirmSanction()`, which makes a temporary sanction by a KYC_PROVIDER permanent and does not grant an exit window to the affected wallet."
+        "transfer KYC NFTs to a different address."
      issuedPermissions.2.to:
-        "0xb539019776eF803E89EC062Ad54cA24D1Fdb008a"
+        "0x2e2B1c42E38f5af81771e65D87729E57ABD1337a"
      issuedPermissions.1.to:
-        "0x010600ff5f36C8eF3b6Aaf2A88C2DE85C798594a"
+        "0xb539019776eF803E89EC062Ad54cA24D1Fdb008a"
      issuedPermissions.1.description:
-        "permissioned to call `confirmSanction()`, which makes a temporary sanction by a KYC_PROVIDER permanent and does not grant an exit window to the affected wallet."
+        "manage the KYC status of any user (sanction status and KYC metadata) and mint/burn KintoID NFTs."
      issuedPermissions.0.to:
-        "0x2e2B1c42E38f5af81771e65D87729E57ABD1337a"
+        "0x010600ff5f36C8eF3b6Aaf2A88C2DE85C798594a"
      issuedPermissions.0.description:
-        "transfer KYC NFTs to a different address."
+        "permissioned to call `confirmSanction()`, which makes a temporary sanction by a KYC_PROVIDER permanent and does not grant an exit window to the affected wallet."
      values.accessControl.DEFAULT_ADMIN_ROLE.members.1:
-        "0x2e2B1c42E38f5af81771e65D87729E57ABD1337a"
      values.accessControl.UPGRADER_ROLE.members.1:
-        "0x2e2B1c42E38f5af81771e65D87729E57ABD1337a"
      values.accessControl.GOVERNANCE_ROLE.members.2:
-        "0x2e2B1c42E38f5af81771e65D87729E57ABD1337a"
+++ severity: HIGH
      values.DEFAULT_ADMINs.1:
-        "0x2e2B1c42E38f5af81771e65D87729E57ABD1337a"
+++ severity: HIGH
      values.GOVERNANCErs.2:
-        "0x2e2B1c42E38f5af81771e65D87729E57ABD1337a"
+++ severity: HIGH
      values.UPGRADERs.1:
-        "0x2e2B1c42E38f5af81771e65D87729E57ABD1337a"
    }
```

Generated with discovered.json: 0x93bc9a372f00118ecee5260dfc00aad81444ff2b

# Diff at Wed, 19 Mar 2025 13:06:34 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@e950b6e93c84855ee2ec1740913b7b4c994b9ae2 block: 769390
- current block number: 769390

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 769390 (main branch discovery), not current.

```diff
    contract NioGovernor (0x010600ff5f36C8eF3b6Aaf2A88C2DE85C798594a) {
    +++ description: Governance contract allowing token- and NFT based voting.
      severity:
-        "HIGH"
    }
```

```diff
    contract KintoAdminMultisig (0x2e2B1c42E38f5af81771e65D87729E57ABD1337a) {
    +++ description: None
      severity:
-        "HIGH"
    }
```

```diff
    contract undefined (0x52F09693c9eEaA93A64BA697e3d3e43a1eB65477) {
    +++ description: None
      severity:
-        "MEDIUM"
    }
```

```diff
    contract undefined (0x6E09F8A68fB5278e0C33D239dC12B2Cec33F4aC7) {
    +++ description: None
      severity:
-        "MEDIUM"
    }
```

```diff
    contract undefined (0x6E31039abF8d248aBed57E307C9E1b7530c269E4) {
    +++ description: None
      severity:
-        "MEDIUM"
    }
```

```diff
    contract undefined (0x6fe642404B7B23F31251103Ca0efb538Ad4aeC07) {
    +++ description: None
      severity:
-        "MEDIUM"
    }
```

```diff
    contract AccessManager (0xacC000818e5Bbd911D5d449aA81CB5cA24024739) {
    +++ description: Standard OpenZeppelin AccessManager: Serves as a proxy contract defining the roles, permissions and delays to call functions in target contracts.
      severity:
-        "HIGH"
    }
```

```diff
    contract undefined (0xb539019776eF803E89EC062Ad54cA24D1Fdb008a) {
    +++ description: None
      severity:
-        "MEDIUM"
    }
```

Generated with discovered.json: 0x50b69d2756ef7f139a84961b247f987eef8aa556

# Diff at Tue, 18 Mar 2025 10:34:03 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@8a389387016e20fe96cd5cb775e4b943b3aaa832 block: 763803
- current block number: 769390

## Description

New pending sanction (looks like a user that has not used their account in ~1y). Not confirmed yet by the SC.

## Watched changes

```diff
    contract KintoID (0xf369f78E3A0492CC4e96a90dae0728A38498e9c7) {
    +++ description: Manages Kinto's KYC system: The KYC_PROVIDER roles responsible for the KYC status and KYC metadata of user wallets.
+++ description: addresses sanctioned by any KYC_PROVIDER role.
      values.pendingSanctions.94:
+        {"_to":"0x19CC0e919b58e0d0eF7BaeBb103f72dee1031978","_timestamp":1706580004}
      values.pendingSanctions.93._to:
-        "0x19CC0e919b58e0d0eF7BaeBb103f72dee1031978"
+        "0x467Fa5244cd8386581635646F12E13C05Ad0f41F"
      values.pendingSanctions.93._timestamp:
-        1706580004
+        1718846703
      values.pendingSanctions.92._to:
-        "0x467Fa5244cd8386581635646F12E13C05Ad0f41F"
+        "0x3CfA8C0e6eEb1e601f76355A82f583232b186a7D"
      values.pendingSanctions.92._timestamp:
-        1718846703
+        1706580004
      values.pendingSanctions.91._to:
-        "0x3CfA8C0e6eEb1e601f76355A82f583232b186a7D"
+        "0x275edFf82EB0c3845edaBa411D7A5bE31486C2B6"
      values.pendingSanctions.91._timestamp:
-        1706580004
+        1710367221
      values.pendingSanctions.90._to:
-        "0x275edFf82EB0c3845edaBa411D7A5bE31486C2B6"
+        "0xBD85550C39dE4844E501A278D6b632FbE68cF70F"
      values.pendingSanctions.90._timestamp:
-        1710367221
+        1716580853
      values.pendingSanctions.89._to:
-        "0xBD85550C39dE4844E501A278D6b632FbE68cF70F"
+        "0x504a1ef47bF87a550bebfBA6ffe58a3a57bADeB7"
      values.pendingSanctions.89._timestamp:
-        1716580853
+        1707652818
      values.pendingSanctions.88._to:
-        "0x504a1ef47bF87a550bebfBA6ffe58a3a57bADeB7"
+        "0x9E292AFD2492f4ecBA6c1eb8B73BC87A5650eB8F"
      values.pendingSanctions.88._timestamp:
-        1707652818
+        1718846645
      values.pendingSanctions.87._to:
-        "0x9E292AFD2492f4ecBA6c1eb8B73BC87A5650eB8F"
+        "0xE65a2Dee17190786c76f83e36F489a085690686C"
      values.pendingSanctions.87._timestamp:
-        1718846645
+        1707840030
      values.pendingSanctions.86._to:
-        "0xE65a2Dee17190786c76f83e36F489a085690686C"
+        "0xbf3fBce48ff8a49918dD8578290814ea466aB79F"
      values.pendingSanctions.86._timestamp:
-        1707840030
+        1718846587
      values.pendingSanctions.85._to:
-        "0xbf3fBce48ff8a49918dD8578290814ea466aB79F"
+        "0x81bb2B25eA1A01BADA25d41C67A34d81C9684712"
      values.pendingSanctions.85._timestamp:
-        1718846587
+        1718846645
      values.pendingSanctions.84._to:
-        "0x81bb2B25eA1A01BADA25d41C67A34d81C9684712"
+        "0xcD984AD7eBB2ab7B2aE0afd967F371c6E24a4Bc6"
      values.pendingSanctions.84._timestamp:
-        1718846645
+        1718846587
      values.pendingSanctions.83._to:
-        "0xcD984AD7eBB2ab7B2aE0afd967F371c6E24a4Bc6"
+        "0x99758a8519691B6bffEeD3976080c943634B7364"
      values.pendingSanctions.83._timestamp:
-        1718846587
+        1718846645
      values.pendingSanctions.82._to:
-        "0x99758a8519691B6bffEeD3976080c943634B7364"
+        "0x1075d13CE70F8F4eB840c4c264b6c84C2CD4E785"
      values.pendingSanctions.82._timestamp:
-        1718846645
+        1708034428
      values.pendingSanctions.81._to:
-        "0x1075d13CE70F8F4eB840c4c264b6c84C2CD4E785"
+        "0xC44F5CA2F187D5ece6864b8a31174C36dEFdC29c"
      values.pendingSanctions.81._timestamp:
-        1708034428
+        1706139865
      values.pendingSanctions.80._to:
-        "0xC44F5CA2F187D5ece6864b8a31174C36dEFdC29c"
+        "0xC10730513A843fa0E2Fc223eC2AE3B6d3d002294"
      values.pendingSanctions.80._timestamp:
-        1706139865
+        1719715565
      values.pendingSanctions.79._to:
-        "0xC10730513A843fa0E2Fc223eC2AE3B6d3d002294"
+        "0x505D435C8B66a7511dbec7f3C8DA6F1e67D50dDA"
      values.pendingSanctions.79._timestamp:
-        1719715565
+        1706148032
      values.pendingSanctions.78._to:
-        "0x505D435C8B66a7511dbec7f3C8DA6F1e67D50dDA"
+        "0x01e523cC67e5d3459bE930837d89bccEA85Fd1DC"
      values.pendingSanctions.78._timestamp:
-        1706148032
+        1719715623
      values.pendingSanctions.77._to:
-        "0x01e523cC67e5d3459bE930837d89bccEA85Fd1DC"
+        "0x5579CA784CdC93776b9c030618548f1317AB4c39"
      values.pendingSanctions.77._timestamp:
-        1719715623
+        1706148032
      values.pendingSanctions.76._to:
-        "0x5579CA784CdC93776b9c030618548f1317AB4c39"
+        "0x75D9312845d38764229455Ea8d526A122b37768D"
      values.pendingSanctions.76._timestamp:
-        1706148032
+        1719718623
      values.pendingSanctions.75._to:
-        "0x75D9312845d38764229455Ea8d526A122b37768D"
+        "0xe12BcEe0219f3c80FFF8C271D29e343bA42B814d"
      values.pendingSanctions.75._timestamp:
-        1719718623
+        1707483639
      values.pendingSanctions.74._to:
-        "0xe12BcEe0219f3c80FFF8C271D29e343bA42B814d"
+        "0x933b0f5e531648Bef764b58Ff7782AfB13AB06D0"
      values.pendingSanctions.74._timestamp:
-        1707483639
+        1718846703
      values.pendingSanctions.73._to:
-        "0x933b0f5e531648Bef764b58Ff7782AfB13AB06D0"
+        "0x2a14E7B96D2362bdf1Df8C0bB4544714e7601Af0"
      values.pendingSanctions.73._timestamp:
-        1718846703
+        1734246668
      values.pendingSanctions.72._to:
-        "0x2a14E7B96D2362bdf1Df8C0bB4544714e7601Af0"
+        "0x493ff963FAAbbBeDBA2Aa19378bF8d8a0F0e2C5E"
      values.pendingSanctions.72._timestamp:
-        1734246668
+        1718846587
      values.pendingSanctions.71._to:
-        "0x493ff963FAAbbBeDBA2Aa19378bF8d8a0F0e2C5E"
+        "0xA4EcEAB6C954C3b967cF18e947879A6708A96D5e"
      values.pendingSanctions.71._timestamp:
-        1718846587
+        1719715444
      values.pendingSanctions.70._to:
-        "0xA4EcEAB6C954C3b967cF18e947879A6708A96D5e"
+        "0x89F6188006a35b9D0407c37f01FCa27AeD48CA3B"
      values.pendingSanctions.70._timestamp:
-        1719715444
+        1719718683
      values.pendingSanctions.69._to:
-        "0x89F6188006a35b9D0407c37f01FCa27AeD48CA3B"
+        "0x985540465088C9c667690cC17BFf732fC703D2E5"
      values.pendingSanctions.69._timestamp:
-        1719718683
+        1719718623
      values.pendingSanctions.68._to:
-        "0x985540465088C9c667690cC17BFf732fC703D2E5"
+        "0x1f16335Fd1dD3e8DCC8b401f5ae8BA57F8AD76a8"
      values.pendingSanctions.68._timestamp:
-        1719718623
+        1706580004
      values.pendingSanctions.67._to:
-        "0x1f16335Fd1dD3e8DCC8b401f5ae8BA57F8AD76a8"
+        "0x2955ca0D791C30C16e7298B803BB116bED5d7269"
      values.pendingSanctions.66._to:
-        "0x2955ca0D791C30C16e7298B803BB116bED5d7269"
+        "0x6E6E2044A4cfeA057E02d6FB72c33Fc893A9B788"
      values.pendingSanctions.66._timestamp:
-        1706580004
+        1718846703
      values.pendingSanctions.65._to:
-        "0x6E6E2044A4cfeA057E02d6FB72c33Fc893A9B788"
+        "0xf30BF377b3C4ed1f111E6E28CF26003CE5a682Cf"
      values.pendingSanctions.65._timestamp:
-        1718846703
+        1706580004
      values.pendingSanctions.64._to:
-        "0xf30BF377b3C4ed1f111E6E28CF26003CE5a682Cf"
+        "0xE9Cb04a602cAA9D2C649dDE854Ab7389C98CF912"
      values.pendingSanctions.64._timestamp:
-        1706580004
+        1706139865
      values.pendingSanctions.63._to:
-        "0xE9Cb04a602cAA9D2C649dDE854Ab7389C98CF912"
+        "0x45Ace2D41040B7267a465A4dF8733F3327EEFBb5"
      values.pendingSanctions.63._timestamp:
-        1706139865
+        1719715444
      values.pendingSanctions.62._to:
-        "0x45Ace2D41040B7267a465A4dF8733F3327EEFBb5"
+        "0x76De7fC28E69bb78e6475C8Fd71B71793B663E31"
      values.pendingSanctions.62._timestamp:
-        1719715444
+        1707346822
      values.pendingSanctions.61._to:
-        "0x76De7fC28E69bb78e6475C8Fd71B71793B663E31"
+        "0x7B31BC4FD8A00f734690AD0607903AA2C770a802"
      values.pendingSanctions.61._timestamp:
-        1707346822
+        1718846645
      values.pendingSanctions.60._to:
-        "0x7B31BC4FD8A00f734690AD0607903AA2C770a802"
+        "0x463d21B0620C77620aeD87A769e5836132158855"
      values.pendingSanctions.60._timestamp:
-        1718846645
+        1707627639
      values.pendingSanctions.59._to:
-        "0x463d21B0620C77620aeD87A769e5836132158855"
+        "0xD0aC63a724dCb105561F981c3D9dda033570193e"
      values.pendingSanctions.59._timestamp:
-        1707627639
+        1718846587
      values.pendingSanctions.58._to:
-        "0xD0aC63a724dCb105561F981c3D9dda033570193e"
+        "0xfB474dDfDc91293aD2a37A58DC94D6505d2c88dF"
      values.pendingSanctions.58._timestamp:
-        1718846587
+        1738203485
      values.pendingSanctions.57._to:
-        "0xfB474dDfDc91293aD2a37A58DC94D6505d2c88dF"
+        "0x927491618ECd06afBCEDeA84a2fEF71c991f00Eb"
      values.pendingSanctions.57._timestamp:
-        1738203485
+        1707354023
      values.pendingSanctions.56._to:
-        "0x927491618ECd06afBCEDeA84a2fEF71c991f00Eb"
+        "0x8862Dd4657aBCdf04c96402cD4C3007511538500"
      values.pendingSanctions.56._timestamp:
-        1707354023
+        1719718683
      values.pendingSanctions.55._to:
-        "0x8862Dd4657aBCdf04c96402cD4C3007511538500"
+        "0x6402119871Cc942Edc26e4815B99711750B87DBB"
      values.pendingSanctions.55._timestamp:
-        1719718683
+        1719718623
      values.pendingSanctions.54._to:
-        "0x6402119871Cc942Edc26e4815B99711750B87DBB"
+        "0xc3106dd6f982d4269a6618E77f49927d44BCCafD"
      values.pendingSanctions.54._timestamp:
-        1719718623
+        1706580004
      values.pendingSanctions.53._to:
-        "0xc3106dd6f982d4269a6618E77f49927d44BCCafD"
+        "0x015374c2Dc040eE1c40739936C72D5F035186f0f"
      values.pendingSanctions.53._timestamp:
-        1706580004
+        1706662831
      values.pendingSanctions.52._to:
-        "0x015374c2Dc040eE1c40739936C72D5F035186f0f"
+        "0x10888fc193ec8a5b9ce29a0213473B2ceFA1E707"
      values.pendingSanctions.52._timestamp:
-        1706662831
+        1719715565
      values.pendingSanctions.51._to:
-        "0x10888fc193ec8a5b9ce29a0213473B2ceFA1E707"
+        "0x9E33F1333587Ee7f96772523821187de185d2ead"
      values.pendingSanctions.50._to:
-        "0x9E33F1333587Ee7f96772523821187de185d2ead"
+        "0x23C1c317368AB6Dc5F92a496e08A79ceE6f90392"
      values.pendingSanctions.50._timestamp:
-        1719715565
+        1719718683
      values.pendingSanctions.49._to:
-        "0x23C1c317368AB6Dc5F92a496e08A79ceE6f90392"
+        "0xfd1dCf92A221f333061575FD8B7D02b6E3A5957D"
      values.pendingSanctions.49._timestamp:
-        1719718683
+        1710867621
      values.pendingSanctions.48._to:
-        "0xfd1dCf92A221f333061575FD8B7D02b6E3A5957D"
+        "0x3b2E6A063125c95f327aE214eD1F20B901801059"
      values.pendingSanctions.48._timestamp:
-        1710867621
+        1719715506
      values.pendingSanctions.47._to:
-        "0x3b2E6A063125c95f327aE214eD1F20B901801059"
+        "0x7Faf6f69caD10Eaf3903847434bF92b4Bb6fC955"
      values.pendingSanctions.47._timestamp:
-        1719715506
+        1719718623
      values.pendingSanctions.46._to:
-        "0x7Faf6f69caD10Eaf3903847434bF92b4Bb6fC955"
+        "0x2548e483ceeFBe4de727f2F853AF0124869Ae75E"
      values.pendingSanctions.46._timestamp:
-        1719718623
+        1707566427
      values.pendingSanctions.45._to:
-        "0x2548e483ceeFBe4de727f2F853AF0124869Ae75E"
+        "0xc2811Dfd12FF70b229d26E465359664f9e60b9D2"
      values.pendingSanctions.45._timestamp:
-        1707566427
+        1706148032
      values.pendingSanctions.44._to:
-        "0xc2811Dfd12FF70b229d26E465359664f9e60b9D2"
+        "0x9baE98859a9D5Ba64AD43E0C22F99d8BAd7FB554"
      values.pendingSanctions.44._timestamp:
-        1706148032
+        1710363512
      values.pendingSanctions.43._to:
-        "0x9baE98859a9D5Ba64AD43E0C22F99d8BAd7FB554"
+        "0x0828b8Fe631347dA81a46E3D23394C3b18395aD4"
      values.pendingSanctions.43._timestamp:
-        1710363512
+        1707498031
      values.pendingSanctions.42._to:
-        "0x0828b8Fe631347dA81a46E3D23394C3b18395aD4"
+        "0xdb563dA812f5d90727bb12a0959F5679B9a2Ea5F"
      values.pendingSanctions.42._timestamp:
-        1707498031
+        1710533543
      values.pendingSanctions.41._to:
-        "0xdb563dA812f5d90727bb12a0959F5679B9a2Ea5F"
+        "0x52F09693c9eEaA93A64BA697e3d3e43a1eB65477"
      values.pendingSanctions.41._timestamp:
-        1710533543
+        1707401778
      values.pendingSanctions.40._to:
-        "0x52F09693c9eEaA93A64BA697e3d3e43a1eB65477"
+        "0xdb563dA812f5d90727bb12a0959F5679B9a2Ea5F"
      values.pendingSanctions.40._timestamp:
-        1707401778
+        1710533376
      values.pendingSanctions.39._to:
-        "0xdb563dA812f5d90727bb12a0959F5679B9a2Ea5F"
+        "0xb2c54B111705B23BCB4cf584C396982c3B613F99"
      values.pendingSanctions.39._timestamp:
-        1710533376
+        1707739213
      values.pendingSanctions.38._to:
-        "0xb2c54B111705B23BCB4cf584C396982c3B613F99"
+        "0xa5AFC38dDBE6e2dda8dC7A4fdae380a9Dbe12a06"
      values.pendingSanctions.38._timestamp:
-        1707739213
+        1707472806
      values.pendingSanctions.37._to:
-        "0xa5AFC38dDBE6e2dda8dC7A4fdae380a9Dbe12a06"
+        "0x0E00e97FefD00F71b54E038899a97b470D6f662F"
      values.pendingSanctions.37._timestamp:
-        1707472806
+        1719718683
      values.pendingSanctions.36._to:
-        "0x0E00e97FefD00F71b54E038899a97b470D6f662F"
+        "0x4F5D61De15F7D9C933f78937295402b3E0D9AA6f"
      values.pendingSanctions.36._timestamp:
-        1719718683
+        1708077610
      values.pendingSanctions.35._to:
-        "0x4F5D61De15F7D9C933f78937295402b3E0D9AA6f"
+        "0xcf011278736204F57B343568A8A8DC09f266a834"
      values.pendingSanctions.35._timestamp:
-        1708077610
+        1706580004
      values.pendingSanctions.34._to:
-        "0xcf011278736204F57B343568A8A8DC09f266a834"
+        "0xf6f06e71eFB2671eAaBcf6E2C090357c995C495D"
      values.pendingSanctions.34._timestamp:
-        1706580004
+        1718846587
      values.pendingSanctions.33._to:
-        "0xf6f06e71eFB2671eAaBcf6E2C090357c995C495D"
+        "0x1971eB33A28eCFa6BF701a6efec4255633F338FB"
      values.pendingSanctions.33._timestamp:
-        1718846587
+        1718846645
      values.pendingSanctions.32._to:
-        "0x1971eB33A28eCFa6BF701a6efec4255633F338FB"
+        "0xca3E2E5c75121Cb46360E4459F6F94dCA6D868f4"
      values.pendingSanctions.32._timestamp:
-        1718846645
+        1707462016
      values.pendingSanctions.31._to:
-        "0xca3E2E5c75121Cb46360E4459F6F94dCA6D868f4"
+        "0x8F14A1990cB5D327E545be6aF2a03B517aC58259"
      values.pendingSanctions.31._timestamp:
-        1707462016
+        1706074667
      values.pendingSanctions.30._to:
-        "0x8F14A1990cB5D327E545be6aF2a03B517aC58259"
+        "0x6CDB95f68B61922d4fE0708e55792390D8c669e4"
      values.pendingSanctions.30._timestamp:
-        1706074667
+        1719718623
      values.pendingSanctions.29._to:
-        "0x6CDB95f68B61922d4fE0708e55792390D8c669e4"
+        "0x574CFb5AA6F7A05B111Cd298b73A4123AAfdF97f"
      values.pendingSanctions.29._timestamp:
-        1719718623
+        1710932425
      values.pendingSanctions.28._to:
-        "0x574CFb5AA6F7A05B111Cd298b73A4123AAfdF97f"
+        "0x1B2888e792e82fe352FC9D1E73cdc91C6217F55c"
      values.pendingSanctions.28._timestamp:
-        1710932425
+        1717533287
      values.pendingSanctions.27._to:
-        "0x1B2888e792e82fe352FC9D1E73cdc91C6217F55c"
+        "0x615E981442C93325449cB379d991237a01c06b15"
      values.pendingSanctions.27._timestamp:
-        1717533287
+        1719715389
      values.pendingSanctions.26._to:
-        "0x615E981442C93325449cB379d991237a01c06b15"
+        "0xB3902654321D214d2B7Ca531832d0EF19780fDef"
      values.pendingSanctions.26._timestamp:
-        1719715389
+        1719718623
      values.pendingSanctions.25._to:
-        "0xB3902654321D214d2B7Ca531832d0EF19780fDef"
+        "0x2bf871ca38EbF4D6Ce0124d8551F236BA33F6e8A"
      values.pendingSanctions.25._timestamp:
-        1719718623
+        1742239091
    }
```

Generated with discovered.json: 0x615130103cd713cddc9c2147ce69707534e36233

# Diff at Tue, 18 Mar 2025 08:15:31 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@4ef7a8dbcec1cd9fec77aae2b73d81347a4ffb13 block: 763803
- current block number: 763803

## Description

Config: change Multisig names.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 763803 (main branch discovery), not current.

```diff
    contract KintsugiFoundation (0x94561e98DD5E55271f91A103e4979aa6C493745E) {
    +++ description: None
      name:
-        "MamoriLabs2"
+        "KintsugiFoundation"
    }
```

Generated with discovered.json: 0xa3d8f1aee8bb53b2fab30e3822288740bf1ca64c

# Diff at Thu, 06 Mar 2025 15:34:47 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@64eed24a033030dd2d128180f3ee3f87c3c39f7c block: 762641
- current block number: 763116

## Description

config: updates timelock templates, added starknet proghashes to global config.

## Watched changes

```diff
    contract AccessManager (0xacC000818e5Bbd911D5d449aA81CB5cA24024739) {
    +++ description: Standard OpenZeppelin AccessManager: Serves as a proxy contract defining the roles, permissions and delays to call functions in target contracts.
      values.accessControl.roles.NIO_GOVERNOR_ROLE.members.1:
+        {"member":"0x2e2B1c42E38f5af81771e65D87729E57ABD1337a","since":1741118224,"executionDelay":0}
+++ description: List of roles granted to accounts.
      values.RolesGranted.1635978423191113331.2:
+        {"account":"0x2e2B1c42E38f5af81771e65D87729E57ABD1337a","delay":0,"since":1741118224,"newMember":true}
+++ description: List of roles granted to accounts.
      values.RolesGranted.1635978423191113331.1:
+        {"account":"0x0000000000000000000000000000000000000000","delay":0,"since":1741117274,"newMember":true}
+++ description: List of roles revoked from accounts.
      values.RolesRevoked.1635978423191113331:
+        [{"roleId":"1635978423191113331","account":"0x0000000000000000000000000000000000000000"}]
    }
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 762641 (main branch discovery), not current.

```diff
    contract NioGuardians (0x0100005D52Be9ab3ccE0C70Abf6F6FA2C48e91C9) {
    +++ description: Contract using NFTs as voting tokens to be used by Nio Guardians in the NioGovernor.
      sinceBlock:
+        234135
    }
```

```diff
    contract NioGovernor (0x010600ff5f36C8eF3b6Aaf2A88C2DE85C798594a) {
    +++ description: Governance contract allowing token- and NFT based voting.
      sinceBlock:
+        234141
    }
```

```diff
    contract BridgedKinto (0x010700808D59d2bb92257fCafACfe8e5bFF7aB87) {
    +++ description: KINTO token contract.
      sinceBlock:
+        181511
    }
```

```diff
    contract Faucet (0x0719D47A213149E2Ef8d3f5afDaDA8a8E22dfc03) {
    +++ description: None
      sinceBlock:
+        169
    }
```

```diff
    contract SponsorPaymaster (0x1842a4EFf3eFd24c50B63c3CF89cECEe245Fc2bd) {
    +++ description: Paymaster used for user transactions eligible for sponsorship.
      sinceBlock:
+        68
    }
```

```diff
    contract EntryPoint (0x2843C269D2a64eCfA63548E8B3Fc0FD23B7F70cb) {
    +++ description: None
      sinceBlock:
+        61
    }
```

```diff
    contract KintoAdminMultisig (0x2e2B1c42E38f5af81771e65D87729E57ABD1337a) {
    +++ description: None
      sinceBlock:
+        84
    }
```

```diff
    contract L2GatewayRouter (0x340487b92808B84c2bd97C87B590EE81267E04a7) {
    +++ description: None
      sinceBlock:
+        11
    }
```

```diff
    contract Socket (0x3e9727470C66B1e77034590926CDe0242B5A3dCc) {
    +++ description: None
      sinceBlock:
+        130639
    }
```

```diff
    contract KintoAppRegistry (0x5A2b641b84b0230C8e75F55d5afd27f4Dbd59d5b) {
    +++ description: Central system contract defining addresses that are allowed to be called by EOAs. The modified Kinto node reads this configuration and drops all other transactions from EOAs (enforced by a modified state transition function). Accordingly, users can only transact from their smart wallets.
      sinceBlock:
+        126
    }
```

```diff
    contract Treasury (0x793500709506652Fcc61F0d2D0fDa605638D4293) {
    +++ description: Kinto Treasury.
      sinceBlock:
+        205278
    }
```

```diff
    contract  (0x87799989341A07F495287B1433eea98398FD73aA) {
    +++ description: None
      sinceBlock:
+        11
    }
```

```diff
    contract BeaconKintoWallet (0x87f0eE85bF3198654900a422832157abBba30828) {
    +++ description: None
      sinceBlock:
+        65
    }
```

```diff
    contract  (0x88e03D41a6EAA9A0B93B0e2d6F1B34619cC4319b) {
    +++ description: None
      sinceBlock:
+        11
    }
```

```diff
    contract KintoWalletFactory (0x8a4720488CA32f1223ccFE5A087e250fE3BC5D75) {
    +++ description: Deploys new KintoWallet beacon proxies when users create a wallet. Also manages the beacon implementation for all KintoWallets and their recovery logic.
      sinceBlock:
+        64
    }
```

```diff
    contract BundleBulker (0x8d2D899402ed84b6c0510bB1ad34ee436ADDD20d) {
    +++ description: None
      sinceBlock:
+        129612
    }
```

```diff
    contract ProxyAdmin (0x9eC0253E4174a14C0536261888416451A407Bf79) {
    +++ description: None
      sinceBlock:
+        11
    }
```

```diff
    contract AccessManager (0xacC000818e5Bbd911D5d449aA81CB5cA24024739) {
    +++ description: Standard OpenZeppelin AccessManager: Serves as a proxy contract defining the roles, permissions and delays to call functions in target contracts.
      sinceBlock:
+        234140
    }
```

```diff
    contract RewardsDistributor (0xD157904639E89df05e89e0DabeEC99aE3d74F9AA) {
    +++ description: None
      sinceBlock:
+        185011
    }
```

```diff
    contract KintoID (0xf369f78E3A0492CC4e96a90dae0728A38498e9c7) {
    +++ description: Manages Kinto's KYC system: The KYC_PROVIDER roles responsible for the KYC status and KYC metadata of user wallets.
      sinceBlock:
+        59
    }
```

Generated with discovered.json: 0x85641b329797b7e3abafd6c3cdc764983c7ee6e5

# Diff at Tue, 04 Mar 2025 13:35:18 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@40abad0e9dad8439d751a811eb767233c5a70a2f block: 758248
- current block number: 762641

## Description

Add sanctions monitoring.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 758248 (main branch discovery), not current.

```diff
    contract KintoID (0xf369f78E3A0492CC4e96a90dae0728A38498e9c7) {
    +++ description: Manages Kinto's KYC system: The KYC_PROVIDER roles responsible for the KYC status and KYC metadata of user wallets.
+++ description: addresses confirmed sanctioned by the GOVERNANCE_ROLE.
      values.confirmedSanctions:
+        ["0x2a14E7B96D2362bdf1Df8C0bB4544714e7601Af0","0xc1ad34Bd24180A15735dd7919C0F24A63e4017ff"]
+++ description: addresses sanctioned by any KYC_PROVIDER role.
      values.pendingSanctions:
+        [{"_to":"0x8F14A1990cB5D327E545be6aF2a03B517aC58259","_timestamp":1706074667},{"_to":"0xE9Cb04a602cAA9D2C649dDE854Ab7389C98CF912","_timestamp":1706139865},{"_to":"0xC44F5CA2F187D5ece6864b8a31174C36dEFdC29c","_timestamp":1706139865},{"_to":"0x505D435C8B66a7511dbec7f3C8DA6F1e67D50dDA","_timestamp":1706148032},{"_to":"0x5579CA784CdC93776b9c030618548f1317AB4c39","_timestamp":1706148032},{"_to":"0xc2811Dfd12FF70b229d26E465359664f9e60b9D2","_timestamp":1706148032},{"_to":"0x7498cF5863fd745eE79d7F07516725b87fE9C8FB","_timestamp":1706148032},{"_to":"0xf30BF377b3C4ed1f111E6E28CF26003CE5a682Cf","_timestamp":1706580004},{"_to":"0x1f16335Fd1dD3e8DCC8b401f5ae8BA57F8AD76a8","_timestamp":1706580004},{"_to":"0xcf011278736204F57B343568A8A8DC09f266a834","_timestamp":1706580004},{"_to":"0x3CfA8C0e6eEb1e601f76355A82f583232b186a7D","_timestamp":1706580004},{"_to":"0x19CC0e919b58e0d0eF7BaeBb103f72dee1031978","_timestamp":1706580004},{"_to":"0xc3106dd6f982d4269a6618E77f49927d44BCCafD","_timestamp":1706580004},{"_to":"0x2955ca0D791C30C16e7298B803BB116bED5d7269","_timestamp":1706580004},{"_to":"0x015374c2Dc040eE1c40739936C72D5F035186f0f","_timestamp":1706662831},{"_to":"0x5420f6C9Bc0495d24f35Ba25Be8e259693615625","_timestamp":1707343233},{"_to":"0x60BF5eE1CBf2a18639412ce694FbCe1c8c3E6637","_timestamp":1707346822},{"_to":"0x76De7fC28E69bb78e6475C8Fd71B71793B663E31","_timestamp":1707346822},{"_to":"0x927491618ECd06afBCEDeA84a2fEF71c991f00Eb","_timestamp":1707354023},{"_to":"0x52F09693c9eEaA93A64BA697e3d3e43a1eB65477","_timestamp":1707401778},{"_to":"0xca3E2E5c75121Cb46360E4459F6F94dCA6D868f4","_timestamp":1707462016},{"_to":"0xa5AFC38dDBE6e2dda8dC7A4fdae380a9Dbe12a06","_timestamp":1707472806},{"_to":"0xe12BcEe0219f3c80FFF8C271D29e343bA42B814d","_timestamp":1707483639},{"_to":"0x3365dB4c3490AC6A43986Cfe2c26FE61B22aA917","_timestamp":1707494421},{"_to":"0x0828b8Fe631347dA81a46E3D23394C3b18395aD4","_timestamp":1707498031},{"_to":"0x2548e483ceeFBe4de727f2F853AF0124869Ae75E","_timestamp":1707566427},{"_to":"0x463d21B0620C77620aeD87A769e5836132158855","_timestamp":1707627639},{"_to":"0x504a1ef47bF87a550bebfBA6ffe58a3a57bADeB7","_timestamp":1707652818},{"_to":"0xb2c54B111705B23BCB4cf584C396982c3B613F99","_timestamp":1707739213},{"_to":"0xE65a2Dee17190786c76f83e36F489a085690686C","_timestamp":1707840030},{"_to":"0xC14051DBDc3459A6A353D887dDF68F2BE286FaD6","_timestamp":1707998409},{"_to":"0x1075d13CE70F8F4eB840c4c264b6c84C2CD4E785","_timestamp":1708034428},{"_to":"0x24444de1eFf861197fd1393cF6081701237d3380","_timestamp":1708048804},{"_to":"0x4F5D61De15F7D9C933f78937295402b3E0D9AA6f","_timestamp":1708077610},{"_to":"0x92D620d0279359727A0128cC19b84EEF89621Fb4","_timestamp":1708164033},{"_to":"0xCc946190D2F37497d21e10309a20D56CF240446B","_timestamp":1710360415},{"_to":"0x9baE98859a9D5Ba64AD43E0C22F99d8BAd7FB554","_timestamp":1710363512},{"_to":"0x3e7b92D14dfA2A891B69d73A9912C7bea9C86bDB","_timestamp":1710363512},{"_to":"0x102C7CAF21c4B1EF75c5d3EEEbe673E73c1706D3","_timestamp":1710363512},{"_to":"0x275edFf82EB0c3845edaBa411D7A5bE31486C2B6","_timestamp":1710367221},{"_to":"0xdb563dA812f5d90727bb12a0959F5679B9a2Ea5F","_timestamp":1710533376},{"_to":"0xdb563dA812f5d90727bb12a0959F5679B9a2Ea5F","_timestamp":1710533543},{"_to":"0xfd1dCf92A221f333061575FD8B7D02b6E3A5957D","_timestamp":1710867621},{"_to":"0x574CFb5AA6F7A05B111Cd298b73A4123AAfdF97f","_timestamp":1710932425},{"_to":"0x49aEa6275e1D94Df2AC90c3ee4e4afd47e468d71","_timestamp":1712710928},{"_to":"0x3C9959C3EfEC9674926D86D8CAA814A486bA047B","_timestamp":1712740568},{"_to":"0xBD85550C39dE4844E501A278D6b632FbE68cF70F","_timestamp":1716580853},{"_to":"0x1B2888e792e82fe352FC9D1E73cdc91C6217F55c","_timestamp":1717533287},{"_to":"0x93402720154e26A044E8389D2733F281fF830c5c","_timestamp":1717937047},{"_to":"0xcD984AD7eBB2ab7B2aE0afd967F371c6E24a4Bc6","_timestamp":1718846587},{"_to":"0x493ff963FAAbbBeDBA2Aa19378bF8d8a0F0e2C5E","_timestamp":1718846587},{"_to":"0xbf3fBce48ff8a49918dD8578290814ea466aB79F","_timestamp":1718846587},{"_to":"0xD0aC63a724dCb105561F981c3D9dda033570193e","_timestamp":1718846587},{"_to":"0xf6f06e71eFB2671eAaBcf6E2C090357c995C495D","_timestamp":1718846587},{"_to":"0x1971eB33A28eCFa6BF701a6efec4255633F338FB","_timestamp":1718846645},{"_to":"0x9E292AFD2492f4ecBA6c1eb8B73BC87A5650eB8F","_timestamp":1718846645},{"_to":"0x7B31BC4FD8A00f734690AD0607903AA2C770a802","_timestamp":1718846645},{"_to":"0x99758a8519691B6bffEeD3976080c943634B7364","_timestamp":1718846645},{"_to":"0x81bb2B25eA1A01BADA25d41C67A34d81C9684712","_timestamp":1718846645},{"_to":"0x6E6E2044A4cfeA057E02d6FB72c33Fc893A9B788","_timestamp":1718846703},{"_to":"0x467Fa5244cd8386581635646F12E13C05Ad0f41F","_timestamp":1718846703},{"_to":"0x933b0f5e531648Bef764b58Ff7782AfB13AB06D0","_timestamp":1718846703},{"_to":"0x615E981442C93325449cB379d991237a01c06b15","_timestamp":1719715389},{"_to":"0xA4EcEAB6C954C3b967cF18e947879A6708A96D5e","_timestamp":1719715444},{"_to":"0x45Ace2D41040B7267a465A4dF8733F3327EEFBb5","_timestamp":1719715444},{"_to":"0x3b2E6A063125c95f327aE214eD1F20B901801059","_timestamp":1719715506},{"_to":"0x02b308D92893E3d93a2cD1C6506a7935B369f2C9","_timestamp":1719715506},{"_to":"0xa7E7870aFEe03C4768feDCb55db9bC11E1187356","_timestamp":1719715506},{"_to":"0x9E33F1333587Ee7f96772523821187de185d2ead","_timestamp":1719715565},{"_to":"0x10888fc193ec8a5b9ce29a0213473B2ceFA1E707","_timestamp":1719715565},{"_to":"0xC10730513A843fa0E2Fc223eC2AE3B6d3d002294","_timestamp":1719715565},{"_to":"0x504CC21F6343F966E672ce27054f9b7e546cd918","_timestamp":1719715623},{"_to":"0x01e523cC67e5d3459bE930837d89bccEA85Fd1DC","_timestamp":1719715623},{"_to":"0x4D836F0f988424f32065086D9A32644a7695e248","_timestamp":1719718509},{"_to":"0x6402119871Cc942Edc26e4815B99711750B87DBB","_timestamp":1719718623},{"_to":"0xB3902654321D214d2B7Ca531832d0EF19780fDef","_timestamp":1719718623},{"_to":"0x7Faf6f69caD10Eaf3903847434bF92b4Bb6fC955","_timestamp":1719718623},{"_to":"0x47DBDEe9AD57e48b9F9a0F867712357Ffb5B489f","_timestamp":1719718623},{"_to":"0x985540465088C9c667690cC17BFf732fC703D2E5","_timestamp":1719718623},{"_to":"0x6CDB95f68B61922d4fE0708e55792390D8c669e4","_timestamp":1719718623},{"_to":"0x75D9312845d38764229455Ea8d526A122b37768D","_timestamp":1719718623},{"_to":"0x6baa2c84A37999D264DA7bEe9639cDd3171c1397","_timestamp":1719718683},{"_to":"0x8862Dd4657aBCdf04c96402cD4C3007511538500","_timestamp":1719718683},{"_to":"0x89F6188006a35b9D0407c37f01FCa27AeD48CA3B","_timestamp":1719718683},{"_to":"0x9bC8048273BBa88f36c81a94EBde7ab5E0322e22","_timestamp":1719718683},{"_to":"0x23C1c317368AB6Dc5F92a496e08A79ceE6f90392","_timestamp":1719718683},{"_to":"0x6C38A71C9bd2cb9A262C5503E8D9D3D095386C00","_timestamp":1719718683},{"_to":"0x0E00e97FefD00F71b54E038899a97b470D6f662F","_timestamp":1719718683},{"_to":"0xdD330d70F14AEa4Ce7b9E777fDCC117321c74124","_timestamp":1722940629},{"_to":"0x2a14E7B96D2362bdf1Df8C0bB4544714e7601Af0","_timestamp":1734246668},{"_to":"0xc1ad34Bd24180A15735dd7919C0F24A63e4017ff","_timestamp":1734613992},{"_to":"0x2f3f40216112e54F8AC7668c364E459F156ed2af","_timestamp":1734613992},{"_to":"0x60a05081683493b2932Df77eE5fac141D2329B89","_timestamp":1736789115},{"_to":"0xfB474dDfDc91293aD2a37A58DC94D6505d2c88dF","_timestamp":1738203485}]
+++ description: addresses unsanctioned manually by any KYC_PROVIDER role. Mind that sanctions also expire if not confirmed (and those do not emit).
      values.removedSanctions:
+        ["0x52F09693c9eEaA93A64BA697e3d3e43a1eB65477","0x015374c2Dc040eE1c40739936C72D5F035186f0f","0xdb563dA812f5d90727bb12a0959F5679B9a2Ea5F","0x49aEa6275e1D94Df2AC90c3ee4e4afd47e468d71","0x1B2888e792e82fe352FC9D1E73cdc91C6217F55c"]
      fieldMeta.pendingSanctions:
+        {"description":"addresses sanctioned by any KYC_PROVIDER role."}
      fieldMeta.removedSanctions:
+        {"description":"addresses unsanctioned manually by any KYC_PROVIDER role. Mind that sanctions also expire if not confirmed (and those do not emit)."}
      fieldMeta.confirmedSanctions:
+        {"description":"addresses confirmed sanctioned by the GOVERNANCE_ROLE."}
    }
```

Generated with discovered.json: 0x505af3caad8c9a7b11115942b44d2dfd09eaf642

# Diff at Mon, 24 Feb 2025 15:41:14 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@cfe18eb30997850b8abc4c6e718cd2a363aa4309 block: 752779
- current block number: 758248

## Description

Config: added a single caldera multisig name.

## Watched changes

```diff
    contract BridgedKinto (0x010700808D59d2bb92257fCafACfe8e5bFF7aB87) {
    +++ description: KINTO token contract.
      sourceHashes.1:
-        "0x4f5f7229da06877c8ec759071cd3d1999f9680fa1d5a7e5d5381558383c25b22"
+        "0xe15912dcb541011cee29f6046afcf500542e3763f530012c1ce71e54abd96545"
      values.$implementation:
-        "0xAf968044D5DE68fE01B5a6517d0DbeE3caD8563a"
+        "0xd70052c77dC9E5291c79842420a6d51010Ed014c"
      values.$pastUpgrades.5:
+        ["2025-02-21T21:13:41.000Z","0xd65d8a3e984c6df5eb9bda4baee108c063c153abc195fbb9656b1d4b8236a1cb",["0xd70052c77dC9E5291c79842420a6d51010Ed014c"]]
      values.$upgradeCount:
-        5
+        6
      values.SALE:
+        "0x5a1E00884e35bF2dC39Af51712D08bEF24b1817f"
    }
```

## Source code changes

```diff
.../{.flat@752779 => .flat}/BridgedKinto/BridgedKinto.sol | 15 ++++-----------
 1 file changed, 4 insertions(+), 11 deletions(-)
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 752779 (main branch discovery), not current.

```diff
-   Status: DELETED
    contract  (0x35B1Ca86D564e69FA38Ee456C12c78A62e78Aa4c)
    +++ description: None
```

```diff
-   Status: DELETED
    contract SignatureVerifier (0x56Ac0e336f0c3620dCaF8d361E8E14eA73C31f5d)
    +++ description: None
```

```diff
-   Status: DELETED
    contract TransmitManager (0x6332e56A423480A211E301Cb85be12814e9238Bb)
    +++ description: None
```

```diff
-   Status: DELETED
    contract Hasher (0x9652Dd5e1388CA80712470122F27be0d1c33B48b)
    +++ description: None
```

```diff
-   Status: DELETED
    contract ExecutionManagerDF (0xc8a4D2fd77c155fd52e65Ab07F337aBF84495Ead)
    +++ description: None
```

Generated with discovered.json: 0x8cb093dd270747aeddf39826bc0b3b5f771e86e4

# Diff at Fri, 21 Feb 2025 13:25:34 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@d219f271711b2cf7a164e3443bead5e4957d13a8 block: 748108
- current block number: 752779

## Description

Removed unnecessary NFT tracking from disco.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 748108 (main branch discovery), not current.

```diff
-   Status: DELETED
    contract KintoWallet (0x25EA8c663BA8cCd79284B8c4001e7A245071885c)
    +++ description: None
```

```diff
    contract KintoAppRegistry (0x5A2b641b84b0230C8e75F55d5afd27f4Dbd59d5b) {
    +++ description: Central system contract defining addresses that are allowed to be called by EOAs. The modified Kinto node reads this configuration and drops all other transactions from EOAs (enforced by a modified state transition function). Accordingly, users can only transact from their smart wallets.
      values.ownerOf:
-        ["0x2e2B1c42E38f5af81771e65D87729E57ABD1337a","0x2e2B1c42E38f5af81771e65D87729E57ABD1337a","0x2e2B1c42E38f5af81771e65D87729E57ABD1337a","0x25EA8c663BA8cCd79284B8c4001e7A245071885c"]
    }
```

```diff
    contract KintoWalletFactory (0x8a4720488CA32f1223ccFE5A087e250fE3BC5D75) {
    +++ description: Deploys new KintoWallet beacon proxies when users create a wallet. Also manages the beacon implementation for all KintoWallets and their recovery logic.
      receivedPermissions.1:
-        {"permission":"upgrade","from":"0x2e2B1c42E38f5af81771e65D87729E57ABD1337a"}
      receivedPermissions.0.from:
-        "0x25EA8c663BA8cCd79284B8c4001e7A245071885c"
+        "0x2e2B1c42E38f5af81771e65D87729E57ABD1337a"
    }
```

Generated with discovered.json: 0xd31287d41663554657fb31f66d2acb6db967628f

# Diff at Wed, 19 Feb 2025 13:59:28 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@90e939c93581cd5b2e00d23bb3ba08dde38932e8 block: 742977
- current block number: 748108

## Description

Config related (better Access Manager event handling + new handler).

KintoID accessControl roles still configured wrong, Access Manager seems fine apart from the ADMIN_ROLE (see below).

Currently an example attack through Access Manager would be the ADMIN_ROLE granting SECURITY_COUNCIL_ROLE to any other address than SC and calling the restricted funcs in AppRegistry (there is no target delay and no role grant delay and ADMIN_ROLE is the roleAdmin for SECURITY_COUNCIL_ROLE).

### Current state of the Access Manager

**Actors and Their Roles:**

1. **KintoAdminMultisig** (0x2e2B1c42E38f5af81771e65D87729E57ABD1337a)
    - ADMIN_ROLE (delay: 0 days)
    - UPGRADER_ROLE (delay: 7 days)
        - KintoWalletFactory: `upgradeTo()`, `upgradeAllWalletImplementations()`
        - KintoAppRegistry: `upgradeTo()`
        - KintoID: `upgradeTo()`
2. **NioGovernor** (0x010600ff5f36C8eF3b6Aaf2A88C2DE85C798594a)
    - NIO_GOVERNOR_ROLE (delay: 3 days)
        - Treasury: `sendFunds()`, `sendETH()`, `batchSendFunds()`
3. **SC_l2alias** (0x28fC10E12A78f986c78F973Fc70ED88072b34c8e)
    - UPGRADER_ROLE (delay: 7 days)
        - Same targets as KintoAdminMultisig
    - SECURITY_COUNCIL_ROLE (delay: 7 days)
        - KintoAppRegistry: `updateSystemApps()`, `updateSystemContracts()`, `updateReservedContracts()`

**Roles and Their Targets:**

1. **ADMIN_ROLE**
    - Has administrative privileges over the AccessManager
2. **NIO_GOVERNOR_ROLE**
    - Treasury:
        - `sendFunds()`
        - `sendETH()`
        - `batchSendFunds()`
3. **UPGRADER_ROLE** (grant delay: 7 days)
    - KintoWalletFactory:
        - `upgradeTo()`
        - `upgradeAllWalletImplementations()`
    - KintoAppRegistry:
        - `upgradeTo()`
    - KintoID:
        - `upgradeTo()`
4. **SECURITY_COUNCIL_ROLE**
    - KintoAppRegistry:
        - `updateSystemApps()`
        - `updateSystemContracts()`
        - `updateReservedContracts()`

**Configuration Change Delays:**

- KintoWalletFactory admin delay: 7 days
- KintoID admin delay: 7 days
- UPGRADER_ROLE grant delay: 7 days

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 742977 (main branch discovery), not current.

```diff
    contract AccessManager (0xacC000818e5Bbd911D5d449aA81CB5cA24024739) {
    +++ description: Standard OpenZeppelin AccessManager: Serves as a proxy contract defining the roles, permissions and delays to call functions in target contracts.
+++ description: List of roles granted to accounts.
      values.RolesGranted.0:
-        {"account":"0x2e2B1c42E38f5af81771e65D87729E57ABD1337a","delay":0,"since":1729791296,"newMember":true}
+        [{"account":"0x2e2B1c42E38f5af81771e65D87729E57ABD1337a","delay":0,"since":1729791296,"newMember":true}]
+++ description: List of roles granted to accounts.
      values.RolesGranted.1635978423191113331:
-        {"account":"0x010600ff5f36C8eF3b6Aaf2A88C2DE85C798594a","delay":259200,"since":1729806574,"newMember":true}
+        [{"account":"0x010600ff5f36C8eF3b6Aaf2A88C2DE85C798594a","delay":259200,"since":1729806574,"newMember":true}]
+++ description: List of roles granted to accounts.
      values.RolesGranted.8663528507529876195:
-        {"account":"0x28fC10E12A78f986c78F973Fc70ED88072b34c8e","delay":604800,"since":1740077455,"newMember":true}
+        [{"account":"0x2e2B1c42E38f5af81771e65D87729E57ABD1337a","delay":604800,"since":1733181166,"newMember":true},{"account":"0x28fC10E12A78f986c78F973Fc70ED88072b34c8e","delay":604800,"since":1740077455,"newMember":true}]
+++ description: List of roles granted to accounts.
      values.RolesGranted.14661544942390944024:
-        {"account":"0x28fC10E12A78f986c78F973Fc70ED88072b34c8e","delay":604800,"since":1739472657,"newMember":true}
+        [{"account":"0x28fC10E12A78f986c78F973Fc70ED88072b34c8e","delay":604800,"since":1739472657,"newMember":true}]
      values.TargetFunctionRoleUpdated.0x793500709506652Fcc61F0d2D0fDa605638D4293:
-        {"selector":"0x9089e8ae","roleId":"1635978423191113331"}
+        [{"selector":"0x8522d1b2","roleId":"1635978423191113331"},{"selector":"0xc664c714","roleId":"1635978423191113331"},{"selector":"0x9089e8ae","roleId":"1635978423191113331"}]
      values.TargetFunctionRoleUpdated.0x8a4720488CA32f1223ccFE5A087e250fE3BC5D75:
-        {"selector":"0x3659cfe6","roleId":"8663528507529876195"}
+        [{"selector":"0xf4f4b03a","roleId":"8663528507529876195"},{"selector":"0x3659cfe6","roleId":"8663528507529876195"}]
      values.TargetFunctionRoleUpdated.0x5A2b641b84b0230C8e75F55d5afd27f4Dbd59d5b:
-        {"selector":"0x72592851","roleId":"14661544942390944024"}
+        [{"selector":"0x3659cfe6","roleId":"8663528507529876195"},{"selector":"0xc233e2a3","roleId":"14661544942390944024"},{"selector":"0x0e6ff432","roleId":"14661544942390944024"},{"selector":"0x72592851","roleId":"14661544942390944024"}]
      values.TargetFunctionRoleUpdated.0xf369f78E3A0492CC4e96a90dae0728A38498e9c7:
-        {"selector":"0x3659cfe6","roleId":"8663528507529876195"}
+        [{"selector":"0x3659cfe6","roleId":"8663528507529876195"}]
+++ description: List of roles revoked from accounts.
      values.RolesRevoked:
+        {}
      fieldMeta.RolesRevoked:
+        {"description":"List of roles revoked from accounts."}
    }
```

Generated with discovered.json: 0x561a917022e5b5e4148934a9059dfe12e2243921

# Diff at Tue, 18 Feb 2025 12:20:16 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@aff7e43e1c06f559de916763e04088cc23b3e08e block: 735231
- current block number: 742977

## Description

SECURITY_COUNCIL_ROLE added to AccessManager and targets configured. SC granted multiple roles in KintoID while not removing the other actors.

Waiting for the access manager handler to be merged to clean up the discovery.

Config related changes due to editing some descriptions and new access manager handler.

## Watched changes

```diff
    contract AccessManager (0xacC000818e5Bbd911D5d449aA81CB5cA24024739) {
    +++ description: Standard OpenZeppelin AccessManager: Serves as a proxy contract defining the roles, permissions and delays to call functions in target contracts.
      receivedPermissions.9:
+        {"permission":"upgrade","from":"0xf369f78E3A0492CC4e96a90dae0728A38498e9c7"}
      receivedPermissions.8:
+        {"permission":"upgrade","from":"0x8a4720488CA32f1223ccFE5A087e250fE3BC5D75"}
      receivedPermissions.7:
+        {"permission":"upgrade","from":"0x793500709506652Fcc61F0d2D0fDa605638D4293"}
      receivedPermissions.6:
+        {"permission":"upgrade","from":"0x5A2b641b84b0230C8e75F55d5afd27f4Dbd59d5b"}
      receivedPermissions.5.permission:
-        "upgrade"
+        "interact"
      receivedPermissions.5.from:
-        "0x8a4720488CA32f1223ccFE5A087e250fE3BC5D75"
+        "0xf369f78E3A0492CC4e96a90dae0728A38498e9c7"
      receivedPermissions.5.description:
+        "transfer KYC NFTs to a different address."
      receivedPermissions.4.permission:
-        "upgrade"
+        "interact"
      receivedPermissions.4.from:
-        "0x793500709506652Fcc61F0d2D0fDa605638D4293"
+        "0xf369f78E3A0492CC4e96a90dae0728A38498e9c7"
      receivedPermissions.4.description:
+        "permissioned to call `confirmSanction()`, which makes a temporary sanction by a KYC_PROVIDER permanent and does not grant an exit window to the affected wallet."
      receivedPermissions.3.permission:
-        "upgrade"
+        "interact"
      receivedPermissions.3.from:
-        "0x5A2b641b84b0230C8e75F55d5afd27f4Dbd59d5b"
+        "0xf369f78E3A0492CC4e96a90dae0728A38498e9c7"
      receivedPermissions.3.description:
+        "manage the KYC status of any user (sanction status and KYC metadata) and mint/burn KintoID NFTs."
      values.accessControl.roles.UPGRADER_ROLE.members.1:
+        {"member":"0x28fC10E12A78f986c78F973Fc70ED88072b34c8e","since":1740077455,"executionDelay":604800}
      values.accessControl.roles.SECURITY_COUNCIL_ROLE:
+        {"members":[{"member":"0x28fC10E12A78f986c78F973Fc70ED88072b34c8e","since":1739472657,"executionDelay":604800}]}
      values.accessControl.targets.0x5A2b641b84b0230C8e75F55d5afd27f4Dbd59d5b.roleFunctions.SECURITY_COUNCIL_ROLE:
+        ["updateSystemApps(address[])","updateSystemContracts(address[])","updateReservedContracts(address[])"]
      values.accessControl.targets.0xf369f78E3A0492CC4e96a90dae0728A38498e9c7:
+        {"roleFunctions":{"UPGRADER_ROLE":["upgradeTo(address)"]},"adminDelay":604800}
      values.AdditionalRoleLabels.SECURITY_COUNCIL_ROLE:
+        ["14661544942390944024"]
      values.RolesGranted.8663528507529876195.account:
-        "0x2e2B1c42E38f5af81771e65D87729E57ABD1337a"
+        "0x28fC10E12A78f986c78F973Fc70ED88072b34c8e"
      values.RolesGranted.8663528507529876195.since:
-        1733181166
+        1740077455
+++ description: List of roles granted to accounts.
      values.RolesGranted.14661544942390944024:
+        {"account":"0x28fC10E12A78f986c78F973Fc70ED88072b34c8e","delay":604800,"since":1739472657,"newMember":true}
      values.TargetAdminDelayUpdated.0xf369f78E3A0492CC4e96a90dae0728A38498e9c7:
+        {"delay":604800,"since":1739904656}
      values.TargetFunctionRoleUpdated.0x5A2b641b84b0230C8e75F55d5afd27f4Dbd59d5b.selector:
-        "0x3659cfe6"
+        "0x72592851"
      values.TargetFunctionRoleUpdated.0x5A2b641b84b0230C8e75F55d5afd27f4Dbd59d5b.roleId:
-        "8663528507529876195"
+        "14661544942390944024"
      values.TargetFunctionRoleUpdated.0xf369f78E3A0492CC4e96a90dae0728A38498e9c7:
+        {"selector":"0x3659cfe6","roleId":"8663528507529876195"}
    }
```

```diff
    contract KintoID (0xf369f78E3A0492CC4e96a90dae0728A38498e9c7) {
    +++ description: Manages Kinto's KYC system: The KYC_PROVIDER roles responsible for the KYC status and KYC metadata of user wallets.
      issuedPermissions.13:
+        {"permission":"upgrade","to":"0xacC000818e5Bbd911D5d449aA81CB5cA24024739","via":[]}
      issuedPermissions.12:
+        {"permission":"upgrade","to":"0x2e2B1c42E38f5af81771e65D87729E57ABD1337a","via":[]}
      issuedPermissions.11:
+        {"permission":"interact","to":"0xb539019776eF803E89EC062Ad54cA24D1Fdb008a","description":"manage the KYC status of any user (sanction status and KYC metadata) and mint/burn KintoID NFTs.","via":[]}
      issuedPermissions.10:
+        {"permission":"interact","to":"0xacC000818e5Bbd911D5d449aA81CB5cA24024739","description":"transfer KYC NFTs to a different address.","via":[]}
      issuedPermissions.9.permission:
-        "upgrade"
+        "interact"
      issuedPermissions.9.to:
-        "0x2e2B1c42E38f5af81771e65D87729E57ABD1337a"
+        "0xacC000818e5Bbd911D5d449aA81CB5cA24024739"
      issuedPermissions.9.description:
+        "permissioned to call `confirmSanction()`, which makes a temporary sanction by a KYC_PROVIDER permanent and does not grant an exit window to the affected wallet."
      issuedPermissions.8.to:
-        "0xb539019776eF803E89EC062Ad54cA24D1Fdb008a"
+        "0xacC000818e5Bbd911D5d449aA81CB5cA24024739"
      values.accessControl.DEFAULT_ADMIN_ROLE.members.1:
+        "0xacC000818e5Bbd911D5d449aA81CB5cA24024739"
      values.accessControl.KYC_PROVIDER_ROLE.members.6:
+        "0xacC000818e5Bbd911D5d449aA81CB5cA24024739"
      values.accessControl.UPGRADER_ROLE.members.1:
+        "0xacC000818e5Bbd911D5d449aA81CB5cA24024739"
      values.accessControl.GOVERNANCE_ROLE.members.2:
+        "0xacC000818e5Bbd911D5d449aA81CB5cA24024739"
+++ severity: HIGH
      values.DEFAULT_ADMINs.1:
+        "0xacC000818e5Bbd911D5d449aA81CB5cA24024739"
+++ severity: HIGH
      values.GOVERNANCErs.2:
+        "0xacC000818e5Bbd911D5d449aA81CB5cA24024739"
+++ severity: MEDIUM
      values.KYC_PROVIDERs.6:
+        "0xacC000818e5Bbd911D5d449aA81CB5cA24024739"
+++ severity: HIGH
      values.UPGRADERs.1:
+        "0xacC000818e5Bbd911D5d449aA81CB5cA24024739"
    }
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 735231 (main branch discovery), not current.

```diff
    contract KintoAppRegistry (0x5A2b641b84b0230C8e75F55d5afd27f4Dbd59d5b) {
    +++ description: Central system contract defining addresses that are allowed to be called by EOAs. The modified Kinto node reads this configuration and drops all other transactions from EOAs (enforced by a modified state transition function). Accordingly, users can only transact from their smart wallets.
      fieldMeta.getSystemContracts.description:
-        "Contracts that are exempt from the STF-enforced rule that EOAs cannot call contracts."
+        "Contracts that are exempt from the STF-enforced rule that EOAs cannot call contracts. Must include ArbSys `0x0000000000000000000000000000000000000064` for ETH withdrawals from an EOA."
    }
```

```diff
    contract AccessManager (0xacC000818e5Bbd911D5d449aA81CB5cA24024739) {
    +++ description: Standard OpenZeppelin AccessManager: Serves as a proxy contract defining the roles, permissions and delays to call functions in target contracts.
      values.AdditionalRoles:
-        [{"roleId":"1635978423191113331","label":"NIO_GOVERNOR_ROLE"},{"roleId":"8663528507529876195","label":"UPGRADER_ROLE"}]
      values.accessControl:
+        {"roles":{"ADMIN_ROLE":{"members":[{"member":"0x2e2B1c42E38f5af81771e65D87729E57ABD1337a","since":1729791296,"executionDelay":0}]},"NIO_GOVERNOR_ROLE":{"members":[{"member":"0x010600ff5f36C8eF3b6Aaf2A88C2DE85C798594a","since":1729806574,"executionDelay":259200}]},"UPGRADER_ROLE":{"members":[{"member":"0x2e2B1c42E38f5af81771e65D87729E57ABD1337a","since":1733181166,"executionDelay":604800}],"grantDelay":604800}},"targets":{"0x793500709506652Fcc61F0d2D0fDa605638D4293":{"roleFunctions":{"NIO_GOVERNOR_ROLE":["sendFunds(address,uint256,address)","sendETH(uint256,address)","batchSendFunds(address[],uint256[],address[])"]}},"0x8a4720488CA32f1223ccFE5A087e250fE3BC5D75":{"roleFunctions":{"UPGRADER_ROLE":["upgradeAllWalletImplementations(address)","upgradeTo(address)"]},"adminDelay":604800},"0x5A2b641b84b0230C8e75F55d5afd27f4Dbd59d5b":{"roleFunctions":{"UPGRADER_ROLE":["upgradeTo(address)"]}}}}
+++ description: Roles (id : label) labeled apart from the standard roles PUBLIC_ROLE and ADMIN_ROLE.
      values.AdditionalRoleLabels:
+        {"NIO_GOVERNOR_ROLE":["1635978423191113331"],"UPGRADER_ROLE":["8663528507529876195"]}
      fieldMeta.AdditionalRoles:
-        {"description":"Roles (id : label) added apart from the standard roles PUBLIC_ROLE and ADMIN_ROLE."}
      fieldMeta.AdditionalRoleLabels:
+        {"description":"Roles (id : label) labeled apart from the standard roles PUBLIC_ROLE and ADMIN_ROLE."}
    }
```

```diff
+   Status: CREATED
    contract BeaconKintoWallet (0x87f0eE85bF3198654900a422832157abBba30828)
    +++ description: None
```

Generated with discovered.json: 0x37b67b83806fca58df9b08c3cdaeedb5aa92e6c2

# Diff at Wed, 12 Feb 2025 11:32:56 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@554a6f0e6aa688c758b37653d0be7eb446f9152e block: 725499
- current block number: 735231

## Description

Socket related contracts verified.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 725499 (main branch discovery), not current.

```diff
    contract KintoWallet (0x25EA8c663BA8cCd79284B8c4001e7A245071885c) {
    +++ description: None
      sourceHashes.0:
-        "0x5dd932e70772b9520e522fd66660bc292a8fc07ff9f9bd8da3b7c0f0bf59c89d"
+        "0xc495bc47dd31384c345f3838b96e95d73efd25ded667a30651c10ca67e13a1b4"
    }
```

```diff
    contract SignatureVerifier (0x56Ac0e336f0c3620dCaF8d361E8E14eA73C31f5d) {
    +++ description: None
      name:
-        ""
+        "SignatureVerifier"
      unverified:
-        true
      values.nominee:
+        "0x0000000000000000000000000000000000000000"
      values.owner:
+        "0x2e2B1c42E38f5af81771e65D87729E57ABD1337a"
      sourceHashes:
+        ["0x92dc8defa29353a843ae6cb6d7508811be7c65f617fe92ef87739ccdbc3fa95b"]
    }
```

```diff
    contract TransmitManager (0x6332e56A423480A211E301Cb85be12814e9238Bb) {
    +++ description: None
      name:
-        ""
+        "TransmitManager"
      unverified:
-        true
      values.chainSlug:
+        7887
      values.nominee:
+        "0x0000000000000000000000000000000000000000"
      values.owner:
+        "0x2e2B1c42E38f5af81771e65D87729E57ABD1337a"
      values.signatureVerifier__:
+        "0x56Ac0e336f0c3620dCaF8d361E8E14eA73C31f5d"
      values.socket__:
+        "0x3e9727470C66B1e77034590926CDe0242B5A3dCc"
      sourceHashes:
+        ["0x20fd759cdae5666df50f4b5723ba03796b69ef7b2b3ec33712cb158d77b97133"]
    }
```

```diff
    contract Hasher (0x9652Dd5e1388CA80712470122F27be0d1c33B48b) {
    +++ description: None
      name:
-        ""
+        "Hasher"
      unverified:
-        true
      values.nominee:
+        "0x0000000000000000000000000000000000000000"
      values.owner:
+        "0x2e2B1c42E38f5af81771e65D87729E57ABD1337a"
      sourceHashes:
+        ["0x621783ceb3c37cf9cd41112e917d760d40dbfa18e43c59f5c925fe9f7037f9be"]
    }
```

Generated with discovered.json: 0x738f727bc32927d8a352c81220441848b3a3eaf5

# Diff at Mon, 10 Feb 2025 19:05:29 GMT:

- author: Michał Podsiadły (<michal.podsiadly@l2beat.com>)
- comparing to: main@3756adff7c1ac86d8af3374a90a75c1999aae2b3 block: 725499
- current block number: 725499

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 725499 (main branch discovery), not current.

```diff
    contract KintoWallet (0x25EA8c663BA8cCd79284B8c4001e7A245071885c) {
    +++ description: None
      sourceHashes.0:
-        "0xc495bc47dd31384c345f3838b96e95d73efd25ded667a30651c10ca67e13a1b4"
+        "0x5dd932e70772b9520e522fd66660bc292a8fc07ff9f9bd8da3b7c0f0bf59c89d"
    }
```

Generated with discovered.json: 0xf270c35d33d74b2b86de2691d762798419508bf0

# Diff at Thu, 06 Feb 2025 08:52:34 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@fa699ce266b15edb364aa471a661f580ea1a4529 block: 715537
- current block number: 725499

## Description

Small upgrade for KintoID: Intention here is assumed to want to remove the ability to effectively sanction wallets by just not bumping the `lastMonitoredAt` timestamp.
This issue is now fixed, but due to double multiplication by `1 days` (at definition of `EXIT_WINDOW_PERIOD` and again inside `isSanctionsMonitored()`) the heartbeat check now only fails after ~2367 years, making `isSanctionsMonitored()` return true for this very long time.

No gov changes yet.

## Watched changes

```diff
    contract KintoID (0xf369f78E3A0492CC4e96a90dae0728A38498e9c7) {
    +++ description: Manages Kinto's KYC system: The KYC_PROVIDER roles responsible for the KYC status and KYC metadata of user wallets.
      sourceHashes.1:
-        "0xdd266bc2e9cb84472ebc0a2583f1b1cbeb143cedb0763780f10d151ddff8f8ec"
+        "0xa0df8ed25313dba8d27c8b016413aa2843d038de01ddb01afe28b1d745427dbb"
      values.$implementation:
-        "0xaa0726829d41E3C70B84Bc5390cce82afC56871A"
+        "0x4aC06254558e144C41461a319822993900cE2eE4"
      values.$pastUpgrades.9:
+        ["2025-02-05T15:37:41.000Z","0xee19b10811d98a79d18ea4dfd1684702c0e30070a2e3cf428de3799c257b83f8",["0x4aC06254558e144C41461a319822993900cE2eE4"]]
      values.$upgradeCount:
-        9
+        10
    }
```

## Source code changes

```diff
discovery/kinto/kinto/{.flat@715537 => .flat}/KintoID/KintoID.sol | 8 ++++----
 1 file changed, 4 insertions(+), 4 deletions(-)
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 715537 (main branch discovery), not current.

```diff
    contract KintoWallet (0x25EA8c663BA8cCd79284B8c4001e7A245071885c) {
    +++ description: None
      sourceHashes.0:
-        "0x5dd932e70772b9520e522fd66660bc292a8fc07ff9f9bd8da3b7c0f0bf59c89d"
+        "0xc495bc47dd31384c345f3838b96e95d73efd25ded667a30651c10ca67e13a1b4"
    }
```

Generated with discovered.json: 0x1b42e603e4713a14ade31eaf3e26f9123526838d

# Diff at Tue, 04 Feb 2025 12:34:05 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@145553eed7ba44636411ecb25e4099728acd02f9 block: 715537
- current block number: 715537

## Description

Rename 'configure' permission to 'interact'

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 715537 (main branch discovery), not current.

```diff
    contract NioGuardians (0x0100005D52Be9ab3ccE0C70Abf6F6FA2C48e91C9) {
    +++ description: Contract using NFTs as voting tokens to be used by Nio Guardians in the NioGovernor.
      issuedPermissions.0.permission:
-        "configure"
+        "interact"
    }
```

```diff
    contract NioGovernor (0x010600ff5f36C8eF3b6Aaf2A88C2DE85C798594a) {
    +++ description: Governance contract allowing token- and NFT based voting.
      receivedPermissions.0.permission:
-        "configure"
+        "interact"
    }
```

```diff
    contract KintoAdminMultisig (0x2e2B1c42E38f5af81771e65D87729E57ABD1337a) {
    +++ description: None
      receivedPermissions.3.permission:
-        "configure"
+        "interact"
      receivedPermissions.2.permission:
-        "configure"
+        "interact"
      receivedPermissions.1.permission:
-        "configure"
+        "interact"
      receivedPermissions.0.permission:
-        "configure"
+        "interact"
    }
```

```diff
    contract KintoAppRegistry (0x5A2b641b84b0230C8e75F55d5afd27f4Dbd59d5b) {
    +++ description: Central system contract defining addresses that are allowed to be called by EOAs. The modified Kinto node reads this configuration and drops all other transactions from EOAs (enforced by a modified state transition function). Accordingly, users can only transact from their smart wallets.
      issuedPermissions.0.permission:
-        "configure"
+        "interact"
    }
```

```diff
    contract Treasury (0x793500709506652Fcc61F0d2D0fDa605638D4293) {
    +++ description: Kinto Treasury.
      issuedPermissions.0.permission:
-        "configure"
+        "interact"
    }
```

```diff
    contract KintoWalletFactory (0x8a4720488CA32f1223ccFE5A087e250fE3BC5D75) {
    +++ description: Deploys new KintoWallet beacon proxies when users create a wallet. Also manages the beacon implementation for all KintoWallets and their recovery logic.
      issuedPermissions.0.permission:
-        "configure"
+        "interact"
    }
```

```diff
    contract AccessManager (0xacC000818e5Bbd911D5d449aA81CB5cA24024739) {
    +++ description: Standard OpenZeppelin AccessManager: Serves as a proxy contract defining the roles, permissions and delays to call functions in target contracts.
      receivedPermissions.2.permission:
-        "configure"
+        "interact"
      receivedPermissions.1.permission:
-        "configure"
+        "interact"
      receivedPermissions.0.permission:
-        "configure"
+        "interact"
    }
```

```diff
    contract KintoID (0xf369f78E3A0492CC4e96a90dae0728A38498e9c7) {
    +++ description: Manages Kinto's KYC system: The KYC_PROVIDER roles responsible for the KYC status and KYC metadata of user wallets.
      issuedPermissions.8.permission:
-        "configure"
+        "interact"
      issuedPermissions.7.permission:
-        "configure"
+        "interact"
      issuedPermissions.6.permission:
-        "configure"
+        "interact"
      issuedPermissions.5.permission:
-        "configure"
+        "interact"
      issuedPermissions.4.permission:
-        "configure"
+        "interact"
      issuedPermissions.3.permission:
-        "configure"
+        "interact"
      issuedPermissions.2.permission:
-        "configure"
+        "interact"
      issuedPermissions.1.permission:
-        "configure"
+        "interact"
      issuedPermissions.0.permission:
-        "configure"
+        "interact"
    }
```

Generated with discovered.json: 0xd34b17ff308ca2ac3515c18051460684b6c4b03b

# Diff at Wed, 29 Jan 2025 09:53:10 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@5741cb966172a3b26ba8279dd9fe4323805a53c2 block: 715537
- current block number: 715537

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 715537 (main branch discovery), not current.

```diff
    contract KintoWallet (0x25EA8c663BA8cCd79284B8c4001e7A245071885c) {
    +++ description: None
      sourceHashes.0:
-        "0xc495bc47dd31384c345f3838b96e95d73efd25ded667a30651c10ca67e13a1b4"
+        "0x5dd932e70772b9520e522fd66660bc292a8fc07ff9f9bd8da3b7c0f0bf59c89d"
    }
```

```diff
    contract KintoAdminMultisig (0x2e2B1c42E38f5af81771e65D87729E57ABD1337a) {
    +++ description: None
      receivedPermissions.6:
+        {"permission":"upgrade","from":"0xf369f78E3A0492CC4e96a90dae0728A38498e9c7"}
      receivedPermissions.5:
+        {"permission":"upgrade","from":"0x1842a4EFf3eFd24c50B63c3CF89cECEe245Fc2bd"}
      receivedPermissions.4.from:
-        "0xf369f78E3A0492CC4e96a90dae0728A38498e9c7"
+        "0x0719D47A213149E2Ef8d3f5afDaDA8a8E22dfc03"
      receivedPermissions.3.permission:
-        "upgrade"
+        "configure"
      receivedPermissions.3.from:
-        "0x1842a4EFf3eFd24c50B63c3CF89cECEe245Fc2bd"
+        "0xf369f78E3A0492CC4e96a90dae0728A38498e9c7"
      receivedPermissions.3.description:
+        "transfer KYC NFTs to a different address."
      receivedPermissions.2.permission:
-        "upgrade"
+        "configure"
      receivedPermissions.2.from:
-        "0x0719D47A213149E2Ef8d3f5afDaDA8a8E22dfc03"
+        "0xf369f78E3A0492CC4e96a90dae0728A38498e9c7"
      receivedPermissions.2.description:
+        "permissioned to call `confirmSanction()`, which makes a temporary sanction by a KYC_PROVIDER permanent and does not grant an exit window to the affected wallet."
    }
```

```diff
    contract KintoID (0xf369f78E3A0492CC4e96a90dae0728A38498e9c7) {
    +++ description: Manages Kinto's KYC system: The KYC_PROVIDER roles responsible for the KYC status and KYC metadata of user wallets.
      issuedPermissions.9:
+        {"permission":"upgrade","to":"0x2e2B1c42E38f5af81771e65D87729E57ABD1337a","via":[]}
      issuedPermissions.8:
+        {"permission":"configure","to":"0xb539019776eF803E89EC062Ad54cA24D1Fdb008a","description":"manage the KYC status of any user (sanction status and KYC metadata) and mint/burn KintoID NFTs.","via":[]}
      issuedPermissions.7.permission:
-        "upgrade"
+        "configure"
      issuedPermissions.7.to:
-        "0x2e2B1c42E38f5af81771e65D87729E57ABD1337a"
+        "0x6fe642404B7B23F31251103Ca0efb538Ad4aeC07"
      issuedPermissions.7.description:
+        "manage the KYC status of any user (sanction status and KYC metadata) and mint/burn KintoID NFTs."
      issuedPermissions.6.to:
-        "0xb539019776eF803E89EC062Ad54cA24D1Fdb008a"
+        "0x6E31039abF8d248aBed57E307C9E1b7530c269E4"
      issuedPermissions.5.to:
-        "0x6fe642404B7B23F31251103Ca0efb538Ad4aeC07"
+        "0x6E09F8A68fB5278e0C33D239dC12B2Cec33F4aC7"
      issuedPermissions.4.to:
-        "0x6E31039abF8d248aBed57E307C9E1b7530c269E4"
+        "0x52F09693c9eEaA93A64BA697e3d3e43a1eB65477"
      issuedPermissions.3.to:
-        "0x6E09F8A68fB5278e0C33D239dC12B2Cec33F4aC7"
+        "0x2e2B1c42E38f5af81771e65D87729E57ABD1337a"
      issuedPermissions.3.description:
-        "manage the KYC status of any user (sanction status and KYC metadata) and mint/burn KintoID NFTs."
+        "transfer KYC NFTs to a different address."
      issuedPermissions.2.to:
-        "0x52F09693c9eEaA93A64BA697e3d3e43a1eB65477"
+        "0x2e2B1c42E38f5af81771e65D87729E57ABD1337a"
      issuedPermissions.2.description:
-        "manage the KYC status of any user (sanction status and KYC metadata) and mint/burn KintoID NFTs."
+        "permissioned to call `confirmSanction()`, which makes a temporary sanction by a KYC_PROVIDER permanent and does not grant an exit window to the affected wallet."
    }
```

Generated with discovered.json: 0x7a1cb8aa68644700fdd613745f9578b0e0d306a3

# Diff at Tue, 28 Jan 2025 14:56:03 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@b60bc0e936cb7b213e24f14ed69abaff22493651 block: 696015
- current block number: 715537

## Description

flagged this with mat, i cannot see any upgrade from here on blockscout.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 696015 (main branch discovery), not current.

```diff
    contract KintoWallet (0x25EA8c663BA8cCd79284B8c4001e7A245071885c) {
    +++ description: None
      sourceHashes.0:
-        "0x5dd932e70772b9520e522fd66660bc292a8fc07ff9f9bd8da3b7c0f0bf59c89d"
+        "0xc495bc47dd31384c345f3838b96e95d73efd25ded667a30651c10ca67e13a1b4"
    }
```

Generated with discovered.json: 0x1e4b495aeaa68ce66965abedeae0ad84c3cef489

# Diff at Mon, 27 Jan 2025 08:46:07 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@19f9c78c593bd40f9a0b28c3dce98eac1bd1d1b8 block: 696015
- current block number: 696015

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 696015 (main branch discovery), not current.

```diff
    contract AccessManager (0xacC000818e5Bbd911D5d449aA81CB5cA24024739) {
    +++ description: Standard OpenZeppelin AccessManager: Serves as a proxy contract defining the roles, permissions and delays to call functions in target contracts.
      values.RoleGrantDelayChanged.8663528507529876195.roleId:
-        "8663528507529876195"
      values.RolesGranted.0.roleId:
-        0
      values.RolesGranted.1635978423191113331.roleId:
-        "1635978423191113331"
      values.RolesGranted.8663528507529876195.roleId:
-        "8663528507529876195"
      values.TargetAdminDelayUpdated.0x8a4720488CA32f1223ccFE5A087e250fE3BC5D75.target:
-        "0x8a4720488CA32f1223ccFE5A087e250fE3BC5D75"
      values.TargetFunctionRoleUpdated.0x793500709506652Fcc61F0d2D0fDa605638D4293.target:
-        "0x793500709506652Fcc61F0d2D0fDa605638D4293"
      values.TargetFunctionRoleUpdated.0x8a4720488CA32f1223ccFE5A087e250fE3BC5D75.target:
-        "0x8a4720488CA32f1223ccFE5A087e250fE3BC5D75"
      values.TargetFunctionRoleUpdated.0x5A2b641b84b0230C8e75F55d5afd27f4Dbd59d5b.target:
-        "0x5A2b641b84b0230C8e75F55d5afd27f4Dbd59d5b"
    }
```

Generated with discovered.json: 0x3b90c528a7e398c505007bb8ada131133fc280af

# Diff at Mon, 20 Jan 2025 11:10:43 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@2c8b4f3d9910bb6371be9b4df87b70856e7d8c64 block: 696015
- current block number: 696015

## Description

Rerun on the same block number. Applies fixes to permissions and via field. Renames permission's target to to/from.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 696015 (main branch discovery), not current.

```diff
    contract NioGuardians (0x0100005D52Be9ab3ccE0C70Abf6F6FA2C48e91C9) {
    +++ description: Contract using NFTs as voting tokens to be used by Nio Guardians in the NioGovernor.
      issuedPermissions.0.target:
-        "0x2e2B1c42E38f5af81771e65D87729E57ABD1337a"
      issuedPermissions.0.to:
+        "0x2e2B1c42E38f5af81771e65D87729E57ABD1337a"
      issuedPermissions.0.description:
+        "mint Nio Guardian NFTs to any address, inheriting the permissions of the NFT."
    }
```

```diff
    contract NioGovernor (0x010600ff5f36C8eF3b6Aaf2A88C2DE85C798594a) {
    +++ description: Governance contract allowing token- and NFT based voting.
      receivedPermissions.0.target:
-        "0xf369f78E3A0492CC4e96a90dae0728A38498e9c7"
      receivedPermissions.0.from:
+        "0xf369f78E3A0492CC4e96a90dae0728A38498e9c7"
    }
```

```diff
    contract Faucet (0x0719D47A213149E2Ef8d3f5afDaDA8a8E22dfc03) {
    +++ description: None
      issuedPermissions.0.target:
-        "0x2e2B1c42E38f5af81771e65D87729E57ABD1337a"
      issuedPermissions.0.to:
+        "0x2e2B1c42E38f5af81771e65D87729E57ABD1337a"
    }
```

```diff
    contract SponsorPaymaster (0x1842a4EFf3eFd24c50B63c3CF89cECEe245Fc2bd) {
    +++ description: Paymaster used for user transactions eligible for sponsorship.
      issuedPermissions.0.target:
-        "0x2e2B1c42E38f5af81771e65D87729E57ABD1337a"
      issuedPermissions.0.to:
+        "0x2e2B1c42E38f5af81771e65D87729E57ABD1337a"
    }
```

```diff
    contract KintoWallet (0x25EA8c663BA8cCd79284B8c4001e7A245071885c) {
    +++ description: None
      issuedPermissions.0.target:
-        "0x8a4720488CA32f1223ccFE5A087e250fE3BC5D75"
      issuedPermissions.0.to:
+        "0x8a4720488CA32f1223ccFE5A087e250fE3BC5D75"
    }
```

```diff
    contract KintoAdminMultisig (0x2e2B1c42E38f5af81771e65D87729E57ABD1337a) {
    +++ description: None
      issuedPermissions.0.target:
-        "0x8a4720488CA32f1223ccFE5A087e250fE3BC5D75"
      issuedPermissions.0.to:
+        "0x8a4720488CA32f1223ccFE5A087e250fE3BC5D75"
      receivedPermissions.4.target:
-        "0xf369f78E3A0492CC4e96a90dae0728A38498e9c7"
      receivedPermissions.4.from:
+        "0xf369f78E3A0492CC4e96a90dae0728A38498e9c7"
      receivedPermissions.3.target:
-        "0x1842a4EFf3eFd24c50B63c3CF89cECEe245Fc2bd"
      receivedPermissions.3.from:
+        "0x1842a4EFf3eFd24c50B63c3CF89cECEe245Fc2bd"
      receivedPermissions.2.target:
-        "0x0719D47A213149E2Ef8d3f5afDaDA8a8E22dfc03"
      receivedPermissions.2.from:
+        "0x0719D47A213149E2Ef8d3f5afDaDA8a8E22dfc03"
      receivedPermissions.1.target:
-        "0xf369f78E3A0492CC4e96a90dae0728A38498e9c7"
      receivedPermissions.1.from:
+        "0xf369f78E3A0492CC4e96a90dae0728A38498e9c7"
      receivedPermissions.0.target:
-        "0x0100005D52Be9ab3ccE0C70Abf6F6FA2C48e91C9"
      receivedPermissions.0.from:
+        "0x0100005D52Be9ab3ccE0C70Abf6F6FA2C48e91C9"
    }
```

```diff
    contract L2GatewayRouter (0x340487b92808B84c2bd97C87B590EE81267E04a7) {
    +++ description: None
      issuedPermissions.0.target:
-        "0x88e03D41a6EAA9A0B93B0e2d6F1B34619cC4319b"
      issuedPermissions.0.via.0.delay:
-        0
      issuedPermissions.0.to:
+        "0x88e03D41a6EAA9A0B93B0e2d6F1B34619cC4319b"
    }
```

```diff
    contract KintoAppRegistry (0x5A2b641b84b0230C8e75F55d5afd27f4Dbd59d5b) {
    +++ description: Central system contract defining addresses that are allowed to be called by EOAs. The modified Kinto node reads this configuration and drops all other transactions from EOAs (enforced by a modified state transition function). Accordingly, users can only transact from their smart wallets.
      issuedPermissions.1.target:
-        "0xacC000818e5Bbd911D5d449aA81CB5cA24024739"
      issuedPermissions.1.to:
+        "0xacC000818e5Bbd911D5d449aA81CB5cA24024739"
      issuedPermissions.0.target:
-        "0xacC000818e5Bbd911D5d449aA81CB5cA24024739"
      issuedPermissions.0.to:
+        "0xacC000818e5Bbd911D5d449aA81CB5cA24024739"
      issuedPermissions.0.description:
+        "manage addresses that are callable by EOAs and other white-/blacklists that are enforced globally on the Kinto L2."
    }
```

```diff
    contract Treasury (0x793500709506652Fcc61F0d2D0fDa605638D4293) {
    +++ description: Kinto Treasury.
      issuedPermissions.1.target:
-        "0xacC000818e5Bbd911D5d449aA81CB5cA24024739"
      issuedPermissions.1.to:
+        "0xacC000818e5Bbd911D5d449aA81CB5cA24024739"
      issuedPermissions.0.target:
-        "0xacC000818e5Bbd911D5d449aA81CB5cA24024739"
      issuedPermissions.0.to:
+        "0xacC000818e5Bbd911D5d449aA81CB5cA24024739"
      issuedPermissions.0.description:
+        "send tokens and ETH from the Treasury to any address without delay."
    }
```

```diff
    contract  (0x87799989341A07F495287B1433eea98398FD73aA) {
    +++ description: None
      issuedPermissions.0.target:
-        "0x88e03D41a6EAA9A0B93B0e2d6F1B34619cC4319b"
      issuedPermissions.0.via.0.delay:
-        0
      issuedPermissions.0.to:
+        "0x88e03D41a6EAA9A0B93B0e2d6F1B34619cC4319b"
    }
```

```diff
    contract  (0x88e03D41a6EAA9A0B93B0e2d6F1B34619cC4319b) {
    +++ description: None
      issuedPermissions.0.target:
-        "0x88e03D41a6EAA9A0B93B0e2d6F1B34619cC4319b"
      issuedPermissions.0.via.0.delay:
-        0
      issuedPermissions.0.to:
+        "0x88e03D41a6EAA9A0B93B0e2d6F1B34619cC4319b"
      receivedPermissions.2.target:
-        "0x88e03D41a6EAA9A0B93B0e2d6F1B34619cC4319b"
      receivedPermissions.2.from:
+        "0x88e03D41a6EAA9A0B93B0e2d6F1B34619cC4319b"
      receivedPermissions.1.target:
-        "0x87799989341A07F495287B1433eea98398FD73aA"
      receivedPermissions.1.from:
+        "0x87799989341A07F495287B1433eea98398FD73aA"
      receivedPermissions.0.target:
-        "0x340487b92808B84c2bd97C87B590EE81267E04a7"
      receivedPermissions.0.from:
+        "0x340487b92808B84c2bd97C87B590EE81267E04a7"
      directlyReceivedPermissions.0.target:
-        "0x9eC0253E4174a14C0536261888416451A407Bf79"
      directlyReceivedPermissions.0.from:
+        "0x9eC0253E4174a14C0536261888416451A407Bf79"
    }
```

```diff
    contract KintoWalletFactory (0x8a4720488CA32f1223ccFE5A087e250fE3BC5D75) {
    +++ description: Deploys new KintoWallet beacon proxies when users create a wallet. Also manages the beacon implementation for all KintoWallets and their recovery logic.
      issuedPermissions.1.target:
-        "0xacC000818e5Bbd911D5d449aA81CB5cA24024739"
      issuedPermissions.1.to:
+        "0xacC000818e5Bbd911D5d449aA81CB5cA24024739"
      issuedPermissions.0.target:
-        "0xacC000818e5Bbd911D5d449aA81CB5cA24024739"
      issuedPermissions.0.to:
+        "0xacC000818e5Bbd911D5d449aA81CB5cA24024739"
      issuedPermissions.0.description:
+        "update the central KintoWallet implementation of all users on Kinto L2 and approve specific wallets for recovery via the turnkey recoverer."
      receivedPermissions.1.target:
-        "0x2e2B1c42E38f5af81771e65D87729E57ABD1337a"
      receivedPermissions.1.from:
+        "0x2e2B1c42E38f5af81771e65D87729E57ABD1337a"
      receivedPermissions.0.target:
-        "0x25EA8c663BA8cCd79284B8c4001e7A245071885c"
      receivedPermissions.0.from:
+        "0x25EA8c663BA8cCd79284B8c4001e7A245071885c"
    }
```

```diff
    contract ProxyAdmin (0x9eC0253E4174a14C0536261888416451A407Bf79) {
    +++ description: None
      directlyReceivedPermissions.2.target:
-        "0x88e03D41a6EAA9A0B93B0e2d6F1B34619cC4319b"
      directlyReceivedPermissions.2.from:
+        "0x88e03D41a6EAA9A0B93B0e2d6F1B34619cC4319b"
      directlyReceivedPermissions.1.target:
-        "0x87799989341A07F495287B1433eea98398FD73aA"
      directlyReceivedPermissions.1.from:
+        "0x87799989341A07F495287B1433eea98398FD73aA"
      directlyReceivedPermissions.0.target:
-        "0x340487b92808B84c2bd97C87B590EE81267E04a7"
      directlyReceivedPermissions.0.from:
+        "0x340487b92808B84c2bd97C87B590EE81267E04a7"
    }
```

```diff
    contract AccessManager (0xacC000818e5Bbd911D5d449aA81CB5cA24024739) {
    +++ description: Standard OpenZeppelin AccessManager: Serves as a proxy contract defining the roles, permissions and delays to call functions in target contracts.
      receivedPermissions.5.target:
-        "0x8a4720488CA32f1223ccFE5A087e250fE3BC5D75"
      receivedPermissions.5.from:
+        "0x8a4720488CA32f1223ccFE5A087e250fE3BC5D75"
      receivedPermissions.4.target:
-        "0x793500709506652Fcc61F0d2D0fDa605638D4293"
      receivedPermissions.4.from:
+        "0x793500709506652Fcc61F0d2D0fDa605638D4293"
      receivedPermissions.3.target:
-        "0x5A2b641b84b0230C8e75F55d5afd27f4Dbd59d5b"
      receivedPermissions.3.from:
+        "0x5A2b641b84b0230C8e75F55d5afd27f4Dbd59d5b"
      receivedPermissions.2.target:
-        "0x8a4720488CA32f1223ccFE5A087e250fE3BC5D75"
      receivedPermissions.2.from:
+        "0x8a4720488CA32f1223ccFE5A087e250fE3BC5D75"
      receivedPermissions.1.target:
-        "0x793500709506652Fcc61F0d2D0fDa605638D4293"
      receivedPermissions.1.from:
+        "0x793500709506652Fcc61F0d2D0fDa605638D4293"
      receivedPermissions.0.target:
-        "0x5A2b641b84b0230C8e75F55d5afd27f4Dbd59d5b"
      receivedPermissions.0.from:
+        "0x5A2b641b84b0230C8e75F55d5afd27f4Dbd59d5b"
    }
```

```diff
    contract KintoID (0xf369f78E3A0492CC4e96a90dae0728A38498e9c7) {
    +++ description: Manages Kinto's KYC system: The KYC_PROVIDER roles responsible for the KYC status and KYC metadata of user wallets.
      issuedPermissions.7.target:
-        "0x2e2B1c42E38f5af81771e65D87729E57ABD1337a"
      issuedPermissions.7.to:
+        "0x2e2B1c42E38f5af81771e65D87729E57ABD1337a"
      issuedPermissions.6.target:
-        "0xb539019776eF803E89EC062Ad54cA24D1Fdb008a"
      issuedPermissions.6.to:
+        "0xb539019776eF803E89EC062Ad54cA24D1Fdb008a"
      issuedPermissions.6.description:
+        "manage the KYC status of any user (sanction status and KYC metadata) and mint/burn KintoID NFTs."
      issuedPermissions.5.target:
-        "0x6fe642404B7B23F31251103Ca0efb538Ad4aeC07"
      issuedPermissions.5.to:
+        "0x6fe642404B7B23F31251103Ca0efb538Ad4aeC07"
      issuedPermissions.5.description:
+        "manage the KYC status of any user (sanction status and KYC metadata) and mint/burn KintoID NFTs."
      issuedPermissions.4.target:
-        "0x6E31039abF8d248aBed57E307C9E1b7530c269E4"
      issuedPermissions.4.to:
+        "0x6E31039abF8d248aBed57E307C9E1b7530c269E4"
      issuedPermissions.4.description:
+        "manage the KYC status of any user (sanction status and KYC metadata) and mint/burn KintoID NFTs."
      issuedPermissions.3.target:
-        "0x6E09F8A68fB5278e0C33D239dC12B2Cec33F4aC7"
      issuedPermissions.3.to:
+        "0x6E09F8A68fB5278e0C33D239dC12B2Cec33F4aC7"
      issuedPermissions.3.description:
+        "manage the KYC status of any user (sanction status and KYC metadata) and mint/burn KintoID NFTs."
      issuedPermissions.2.target:
-        "0x52F09693c9eEaA93A64BA697e3d3e43a1eB65477"
      issuedPermissions.2.to:
+        "0x52F09693c9eEaA93A64BA697e3d3e43a1eB65477"
      issuedPermissions.2.description:
+        "manage the KYC status of any user (sanction status and KYC metadata) and mint/burn KintoID NFTs."
      issuedPermissions.1.target:
-        "0x2e2B1c42E38f5af81771e65D87729E57ABD1337a"
      issuedPermissions.1.to:
+        "0x2e2B1c42E38f5af81771e65D87729E57ABD1337a"
      issuedPermissions.1.description:
+        "manage the KYC status of any user (sanction status and KYC metadata) and mint/burn KintoID NFTs."
      issuedPermissions.0.target:
-        "0x010600ff5f36C8eF3b6Aaf2A88C2DE85C798594a"
      issuedPermissions.0.to:
+        "0x010600ff5f36C8eF3b6Aaf2A88C2DE85C798594a"
      issuedPermissions.0.description:
+        "permissioned to call `confirmSanction()`, which makes a temporary sanction by a KYC_PROVIDER permanent and does not grant an exit window to the affected wallet."
    }
```

Generated with discovered.json: 0x8314641173b04fc416b0ddc480f7e7f30211a3dc

# Diff at Mon, 20 Jan 2025 09:26:11 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@82d3b5c180381f7d2d0e30406b2ac10025d0614f block: 696015
- current block number: 696015

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 696015 (main branch discovery), not current.

```diff
    contract KintoWallet (0x25EA8c663BA8cCd79284B8c4001e7A245071885c) {
    +++ description: None
      sourceHashes.0:
-        "0xc495bc47dd31384c345f3838b96e95d73efd25ded667a30651c10ca67e13a1b4"
+        "0x5dd932e70772b9520e522fd66660bc292a8fc07ff9f9bd8da3b7c0f0bf59c89d"
    }
```

Generated with discovered.json: 0x820c8568602f8dd9d7266c97ba0ddb8a7d2727e4

# Diff at Tue, 24 Dec 2024 11:54:46 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@799e77243e46787b5be6a47a301a3e1069bfa010 block: 678494
- current block number: 686939

## Description

KYC provider role granted to new account.

Add nicer Kinto discovery config and descriptions.

## Watched changes

```diff
    contract KintoID (0xf369f78E3A0492CC4e96a90dae0728A38498e9c7) {
    +++ description: Manages Kinto's KYC system: The KYC_PROVIDER roles responsible for the KYC status and KYC metadata of user wallets.
      issuedPermissions.7:
+        {"permission":"upgrade","target":"0x2e2B1c42E38f5af81771e65D87729E57ABD1337a","via":[]}
      issuedPermissions.6.permission:
-        "upgrade"
+        "configure"
      issuedPermissions.6.target:
-        "0x2e2B1c42E38f5af81771e65D87729E57ABD1337a"
+        "0xb539019776eF803E89EC062Ad54cA24D1Fdb008a"
      issuedPermissions.5.target:
-        "0xb539019776eF803E89EC062Ad54cA24D1Fdb008a"
+        "0x6fe642404B7B23F31251103Ca0efb538Ad4aeC07"
      values.accessControl.KYC_PROVIDER_ROLE.members.5:
+        "0x6fe642404B7B23F31251103Ca0efb538Ad4aeC07"
+++ severity: MEDIUM
      values.KYC_PROVIDERs.5:
+        "0x6fe642404B7B23F31251103Ca0efb538Ad4aeC07"
    }
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 678494 (main branch discovery), not current.

```diff
    contract NioGuardians (0x0100005D52Be9ab3ccE0C70Abf6F6FA2C48e91C9) {
    +++ description: Contract using NFTs as voting tokens to be used by Nio Guardians in the NioGovernor.
      description:
+        "Contract using NFTs as voting tokens to be used by Nio Guardians in the NioGovernor."
      issuedPermissions:
+        [{"permission":"configure","target":"0x2e2B1c42E38f5af81771e65D87729E57ABD1337a","via":[]}]
    }
```

```diff
    contract NioGovernor (0x010600ff5f36C8eF3b6Aaf2A88C2DE85C798594a) {
    +++ description: Governance contract allowing token- and NFT based voting.
      description:
+        "Governance contract allowing token- and NFT based voting."
      severity:
+        "HIGH"
      receivedPermissions:
+        [{"permission":"configure","target":"0xf369f78E3A0492CC4e96a90dae0728A38498e9c7","description":"permissioned to call `confirmSanction()`, which makes a temporary sanction by a KYC_PROVIDER permanent and does not grant an exit window to the affected wallet."}]
    }
```

```diff
    contract BridgedKinto (0x010700808D59d2bb92257fCafACfe8e5bFF7aB87) {
    +++ description: KINTO token contract.
      description:
+        "KINTO token contract."
    }
```

```diff
    contract SponsorPaymaster (0x1842a4EFf3eFd24c50B63c3CF89cECEe245Fc2bd) {
    +++ description: Paymaster used for user transactions eligible for sponsorship.
      description:
+        "Paymaster used for user transactions eligible for sponsorship."
    }
```

```diff
    contract KintoAdminMultisig (0x2e2B1c42E38f5af81771e65D87729E57ABD1337a) {
    +++ description: None
      receivedPermissions.4:
+        {"permission":"upgrade","target":"0xf369f78E3A0492CC4e96a90dae0728A38498e9c7"}
      receivedPermissions.3:
+        {"permission":"upgrade","target":"0x1842a4EFf3eFd24c50B63c3CF89cECEe245Fc2bd"}
      receivedPermissions.2:
+        {"permission":"upgrade","target":"0x0719D47A213149E2Ef8d3f5afDaDA8a8E22dfc03"}
      receivedPermissions.1.permission:
-        "upgrade"
+        "configure"
      receivedPermissions.1.target:
-        "0x1842a4EFf3eFd24c50B63c3CF89cECEe245Fc2bd"
+        "0xf369f78E3A0492CC4e96a90dae0728A38498e9c7"
      receivedPermissions.1.description:
+        "manage the KYC status of any user (sanction status and KYC metadata) and mint/burn KintoID NFTs."
      receivedPermissions.0.permission:
-        "upgrade"
+        "configure"
      receivedPermissions.0.target:
-        "0x0719D47A213149E2Ef8d3f5afDaDA8a8E22dfc03"
+        "0x0100005D52Be9ab3ccE0C70Abf6F6FA2C48e91C9"
      receivedPermissions.0.description:
+        "mint Nio Guardian NFTs to any address, inheriting the permissions of the NFT."
      severity:
+        "HIGH"
    }
```

```diff
    contract KintoAppRegistry (0x5A2b641b84b0230C8e75F55d5afd27f4Dbd59d5b) {
    +++ description: Central system contract defining addresses that are allowed to be called by EOAs. The modified Kinto node reads this configuration and drops all other transactions from EOAs (enforced by a modified state transition function). Accordingly, users can only transact from their smart wallets.
      description:
-        "Central system contract defining addresses that are allowed to be called by EOAs. The modified Kinto node reads this configuration and drops all other transactions from EOAs. Accordingly, users can only transact from their smart wallets."
+        "Central system contract defining addresses that are allowed to be called by EOAs. The modified Kinto node reads this configuration and drops all other transactions from EOAs (enforced by a modified state transition function). Accordingly, users can only transact from their smart wallets."
      issuedPermissions.1:
+        {"permission":"upgrade","target":"0xacC000818e5Bbd911D5d449aA81CB5cA24024739","via":[]}
      issuedPermissions.0.permission:
-        "upgrade"
+        "configure"
      fieldMeta:
+        {"owner":{"severity":"HIGH"},"getSystemContracts":{"severity":"HIGH","description":"Contracts that are exempt from the STF-enforced rule that EOAs cannot call contracts."}}
    }
```

```diff
    contract Treasury (0x793500709506652Fcc61F0d2D0fDa605638D4293) {
    +++ description: Kinto Treasury.
      issuedPermissions.1:
+        {"permission":"upgrade","target":"0xacC000818e5Bbd911D5d449aA81CB5cA24024739","via":[]}
      issuedPermissions.0.permission:
-        "upgrade"
+        "configure"
      description:
+        "Kinto Treasury."
    }
```

```diff
    contract KintoWalletFactory (0x8a4720488CA32f1223ccFE5A087e250fE3BC5D75) {
    +++ description: Deploys new KintoWallet beacon proxies when users create a wallet. Also manages the beacon implementation for all KintoWallets and their recovery logic.
      issuedPermissions.1:
+        {"permission":"upgrade","target":"0xacC000818e5Bbd911D5d449aA81CB5cA24024739","via":[]}
      issuedPermissions.0.permission:
-        "upgrade"
+        "configure"
      description:
+        "Deploys new KintoWallet beacon proxies when users create a wallet. Also manages the beacon implementation for all KintoWallets and their recovery logic."
      fieldMeta:
+        {"owner":{"severity":"HIGH"}}
    }
```

```diff
    contract AccessManager (0xacC000818e5Bbd911D5d449aA81CB5cA24024739) {
    +++ description: Standard OpenZeppelin AccessManager: Serves as a proxy contract defining the roles, permissions and delays to call functions in target contracts.
      receivedPermissions.5:
+        {"permission":"upgrade","target":"0x8a4720488CA32f1223ccFE5A087e250fE3BC5D75"}
      receivedPermissions.4:
+        {"permission":"upgrade","target":"0x793500709506652Fcc61F0d2D0fDa605638D4293"}
      receivedPermissions.3:
+        {"permission":"upgrade","target":"0x5A2b641b84b0230C8e75F55d5afd27f4Dbd59d5b"}
      receivedPermissions.2.permission:
-        "upgrade"
+        "configure"
      receivedPermissions.2.description:
+        "update the central KintoWallet implementation of all users on Kinto L2 and approve specific wallets for recovery via the turnkey recoverer."
      receivedPermissions.1.permission:
-        "upgrade"
+        "configure"
      receivedPermissions.1.description:
+        "send tokens and ETH from the Treasury to any address without delay."
      receivedPermissions.0.permission:
-        "upgrade"
+        "configure"
      receivedPermissions.0.description:
+        "manage addresses that are callable by EOAs and other white-/blacklists that are enforced globally on the Kinto L2."
+++ description: From the constructor args. Has the ADMIN_ROLE (0).
      values.initialAdminRole:
+        "0x2e2B1c42E38f5af81771e65D87729E57ABD1337a"
      fieldMeta.OperationScheduled.description:
+        "List of scheduled operations."
      fieldMeta.initialAdminRole:
+        {"description":"From the constructor args. Has the ADMIN_ROLE (0)."}
      fieldMeta.RoleGuardianChanged:
+        {"description":"The guardian permission allows canceling operations that have been scheduled under the role."}
      fieldMeta.RoleAdminChanged:
+        {"description":"The RoleAdmin permission is required to grant the role, revoke the role and update the execution delay for the respective role."}
      fieldMeta.RoleGrantDelayChanged:
+        {"description":"Grant delay for a given `roleId`."}
      fieldMeta.TargetAdminDelayUpdated:
+        {"description":"Delay for changing the AccessManager configuration of a given target contract."}
      fieldMeta.TargetFunctionRoleUpdated:
+        {"description":"Target addresses and function selectors accessible from a given role id."}
      fieldMeta.AdditionalRoles:
+        {"description":"Roles (id : label) added apart from the standard roles PUBLIC_ROLE and ADMIN_ROLE."}
      fieldMeta.RolesGranted:
+        {"description":"List of roles granted to accounts."}
      description:
+        "Standard OpenZeppelin AccessManager: Serves as a proxy contract defining the roles, permissions and delays to call functions in target contracts."
      severity:
+        "HIGH"
    }
```

```diff
    contract KintoID (0xf369f78E3A0492CC4e96a90dae0728A38498e9c7) {
    +++ description: Manages Kinto's KYC system: The KYC_PROVIDER roles responsible for the KYC status and KYC metadata of user wallets.
      description:
-        "Manages Kinto's KYC system: KYC provider addresses and the KYC status of users."
+        "Manages Kinto's KYC system: The KYC_PROVIDER roles responsible for the KYC status and KYC metadata of user wallets."
+++ severity: HIGH
      values.DEFAULT_ADMINs:
+        ["0x2e2B1c42E38f5af81771e65D87729E57ABD1337a"]
+++ severity: HIGH
      values.GOVERNANCErs:
+        ["0x2e2B1c42E38f5af81771e65D87729E57ABD1337a","0x010600ff5f36C8eF3b6Aaf2A88C2DE85C798594a"]
+++ severity: MEDIUM
      values.KYC_PROVIDERs:
+        ["0x52F09693c9eEaA93A64BA697e3d3e43a1eB65477","0xb539019776eF803E89EC062Ad54cA24D1Fdb008a","0x6E31039abF8d248aBed57E307C9E1b7530c269E4","0x6E09F8A68fB5278e0C33D239dC12B2Cec33F4aC7","0x2e2B1c42E38f5af81771e65D87729E57ABD1337a"]
+++ severity: HIGH
      values.UPGRADERs:
+        ["0x2e2B1c42E38f5af81771e65D87729E57ABD1337a"]
      issuedPermissions:
+        [{"permission":"configure","target":"0x010600ff5f36C8eF3b6Aaf2A88C2DE85C798594a","via":[]},{"permission":"configure","target":"0x2e2B1c42E38f5af81771e65D87729E57ABD1337a","via":[]},{"permission":"configure","target":"0x52F09693c9eEaA93A64BA697e3d3e43a1eB65477","via":[]},{"permission":"configure","target":"0x6E09F8A68fB5278e0C33D239dC12B2Cec33F4aC7","via":[]},{"permission":"configure","target":"0x6E31039abF8d248aBed57E307C9E1b7530c269E4","via":[]},{"permission":"configure","target":"0xb539019776eF803E89EC062Ad54cA24D1Fdb008a","via":[]},{"permission":"upgrade","target":"0x2e2B1c42E38f5af81771e65D87729E57ABD1337a","via":[]}]
      fieldMeta:
+        {"UPGRADERs":{"severity":"HIGH"},"KYC_PROVIDERs":{"severity":"MEDIUM"},"GOVERNANCErs":{"severity":"HIGH"},"DEFAULT_ADMINs":{"severity":"HIGH"}}
    }
```

Generated with discovered.json: 0x7acb4802288d2af3c0fa1a8ad793cc2ffe58e589

# Diff at Wed, 18 Dec 2024 12:37:21 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@a44ef6747febdd9930ef05420e60556c20899f13 block: 673467
- current block number: 678494

## Description

This upgrade adds the ArbSys contract (`0x0000000000000000000000000000000000000064`) as a system contract, whitelisting it in the STF to be called by EOAs. This is necessary for withdrawing ETH from Kinto from an EOA, e.g. in a forced transaction.

The token contract of the KINTO token is upgraded to integrate new delegation and token voting libraries.

## Watched changes

```diff
    contract BridgedKinto (0x010700808D59d2bb92257fCafACfe8e5bFF7aB87) {
    +++ description: None
      sourceHashes.1:
-        "0x44215a226a4f9bbe6261cc55102df996258b9a5a2456bcfd1e33e7bb9886a8a7"
+        "0x4f5f7229da06877c8ec759071cd3d1999f9680fa1d5a7e5d5381558383c25b22"
      values.$implementation:
-        "0xbE43c24500B855f0cc0D0F99361683B6C6ED73b8"
+        "0xAf968044D5DE68fE01B5a6517d0DbeE3caD8563a"
      values.$pastUpgrades.4:
+        ["2024-12-18T00:08:48.000Z","0xb0828f7016e3452a4b32bf6d987b8a8e265c5bdf5fedbcc42b51940f17d18ab8",["0xAf968044D5DE68fE01B5a6517d0DbeE3caD8563a"]]
      values.$pastUpgrades.3:
+        ["2024-12-17T20:37:39.000Z","0xbe1519e9c0c006360238f02214b8b50211659d44f2c37353ce47efdc9db07352",["0xDd11ab74e0e8B042F843447F5754376f2F303492"]]
      values.$upgradeCount:
-        3
+        5
      values.CLOCK_MODE:
+        "mode=timestamp"
    }
```

```diff
    contract KintoWallet (0x25EA8c663BA8cCd79284B8c4001e7A245071885c) {
    +++ description: None
      values.getNonce:
-        217
+        220
    }
```

```diff
    contract KintoAppRegistry (0x5A2b641b84b0230C8e75F55d5afd27f4Dbd59d5b) {
    +++ description: Central system contract defining addresses that are allowed to be called by EOAs. The modified Kinto node reads this configuration and drops all other transactions from EOAs. Accordingly, users can only transact from their smart wallets.
      values.getSystemContracts.16:
+        "0x0000000000000000000000000000000000000064"
    }
```

## Source code changes

```diff
.../BridgedKinto/BridgedKinto.sol                  | 3562 ++++++++++++--------
 1 file changed, 2213 insertions(+), 1349 deletions(-)
```

Generated with discovered.json: 0x61bb2abc25873ee5cbc6fd74a69cf3ea384a4f54

# Diff at Mon, 16 Dec 2024 13:50:33 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@f33537d5b381f743921fc5e40006feb3f31e39a6 block: 628196
- current block number: 673467

## Description

Minor upgrade of RewardsDistributor, which disables the claim of KINTO for all new users and limits claims to actors that can provide a valid merkle proof.

## Watched changes

```diff
    contract RewardsDistributor (0xD157904639E89df05e89e0DabeEC99aE3d74F9AA) {
    +++ description: None
      sourceHashes.1:
-        "0xd15c713ccbe36c94f3701cc26df68875ded4c439ee290c429fd64be35c66d8ad"
+        "0xc84bc54272227a1f3a6c1edaf40ac11aeaf8651129538971e06e0fefa48c99bc"
      values.$implementation:
-        "0x5b4D3f7d5876a68107F755BE97cDef36091A336F"
+        "0xF3D955B4cF3489A37027f0F3484E87328dBdBB39"
      values.$pastUpgrades.7:
+        ["2024-12-13T23:57:35.000Z","0xc25ca9b0d2a50eba7cec62481c5c83f9222786f3c29479977ff1182a2871c768",["0xF3D955B4cF3489A37027f0F3484E87328dBdBB39"]]
      values.$upgradeCount:
-        7
+        8
      values.NEW_USER_REWARD_END_TIMESTAMP:
+        1734133547
    }
```

## Source code changes

```diff
.../RewardsDistributor/RewardsDistributor.sol      | 22 +++++++---------------
 1 file changed, 7 insertions(+), 15 deletions(-)
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 628196 (main branch discovery), not current.

```diff
    contract KintoWallet (0x25EA8c663BA8cCd79284B8c4001e7A245071885c) {
    +++ description: None
      sourceHashes.0:
-        "0x5dd932e70772b9520e522fd66660bc292a8fc07ff9f9bd8da3b7c0f0bf59c89d"
+        "0xc495bc47dd31384c345f3838b96e95d73efd25ded667a30651c10ca67e13a1b4"
    }
```

Generated with discovered.json: 0xd84106a81a6dc6efcdb8dc2e7a535d8d7075456b

# Diff at Wed, 11 Dec 2024 11:55:37 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@7435bec50d51aed22dfa02f78d9c82e72a840fed block: 628196
- current block number: 628196

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 628196 (main branch discovery), not current.

```diff
    contract KintoWallet (0x25EA8c663BA8cCd79284B8c4001e7A245071885c) {
    +++ description: None
      sourceHashes.0:
-        "0xc495bc47dd31384c345f3838b96e95d73efd25ded667a30651c10ca67e13a1b4"
+        "0x5dd932e70772b9520e522fd66660bc292a8fc07ff9f9bd8da3b7c0f0bf59c89d"
    }
```

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
