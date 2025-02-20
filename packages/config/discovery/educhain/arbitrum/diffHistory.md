Generated with discovered.json: 0x7e444982fe71b95ca3f44de17fd58bc34e36d961

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
