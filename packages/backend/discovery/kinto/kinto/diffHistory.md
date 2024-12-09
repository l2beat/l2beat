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
