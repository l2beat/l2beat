Generated with discovered.json: 0x96f15918c70e84d63ac24ad38d9af327bb9158ed

# Diff at Wed, 12 Mar 2025 16:12:49 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@83f499294acff3972f9246f27e07b7a531a5d4d2 block: 21786859
- current block number: 21786859

## Description

Discovery rerun on the same block number with only config-related changes.
Removed delay on Timelock's ADMIN interact permission.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21786859 (main branch discovery), not current.

```diff
    contract UpgradeExecutor (0x3ffFbAdAF827559da092217e474760E2b2c3CeDd) {
    +++ description: Central contract defining the access control permissions for upgrading the system contract implementations.
      directlyReceivedPermissions.5.description:
-        "cancel queued transactions."
+        "update the minimum delay and manage all access control roles of the timelock."
      directlyReceivedPermissions.4.delay:
-        259200
      directlyReceivedPermissions.4.description:
-        "update the minimum delay and manage all access control roles of the timelock."
+        "cancel queued transactions."
    }
```

```diff
    contract ArbitrumBridge (0x8315177aB297bA92A06054cE80a67Ed4DBd7ed3a) {
    +++ description: Contract used to relay governance action messages from Arbitrum One to Ethereum. It is also an escrow contract for the project's gas token (can be different from ETH). Keeps a list of allowed Inboxes and Outboxes for canonical bridge messaging.
      receivedPermissions.2.description:
-        "propose transactions."
+        "update the minimum delay and manage all access control roles of the timelock."
      receivedPermissions.2.via:
+        [{"address":"0x3ffFbAdAF827559da092217e474760E2b2c3CeDd"},{"address":"0xE6841D92B0C345144506576eC13ECf5103aC7f49","delay":259200}]
      receivedPermissions.1.description:
-        "cancel queued transactions."
+        "propose transactions."
      receivedPermissions.1.via:
-        [{"address":"0x3ffFbAdAF827559da092217e474760E2b2c3CeDd"},{"address":"0xE6841D92B0C345144506576eC13ECf5103aC7f49","delay":259200}]
      receivedPermissions.0.delay:
-        259200
      receivedPermissions.0.description:
-        "update the minimum delay and manage all access control roles of the timelock."
+        "cancel queued transactions."
    }
```

```diff
    contract L1Timelock (0xE6841D92B0C345144506576eC13ECf5103aC7f49) {
    +++ description: A timelock with access control. The current minimum delay is 3d. Proposals that passed their minimum delay can be executed by the anyone.
      issuedPermissions.4.description:
-        "cancel queued transactions."
+        "update the minimum delay and manage all access control roles of the timelock."
      issuedPermissions.3.delay:
-        259200
      issuedPermissions.3.description:
-        "update the minimum delay and manage all access control roles of the timelock."
+        "cancel queued transactions."
      issuedPermissions.2.description:
-        "propose transactions."
+        "update the minimum delay and manage all access control roles of the timelock."
      issuedPermissions.2.via.1:
+        {"address":"0x3ffFbAdAF827559da092217e474760E2b2c3CeDd"}
      issuedPermissions.2.via.0:
+        {"address":"0xE6841D92B0C345144506576eC13ECf5103aC7f49","delay":259200}
      issuedPermissions.1.description:
-        "cancel queued transactions."
+        "propose transactions."
      issuedPermissions.1.via.1:
-        {"address":"0x3ffFbAdAF827559da092217e474760E2b2c3CeDd"}
      issuedPermissions.1.via.0:
-        {"address":"0xE6841D92B0C345144506576eC13ECf5103aC7f49","delay":259200}
      issuedPermissions.0.delay:
-        259200
      issuedPermissions.0.description:
-        "update the minimum delay and manage all access control roles of the timelock."
+        "cancel queued transactions."
    }
```

```diff
    contract SecurityCouncil (0xF06E95eF589D9c38af242a8AAee8375f14023F85) {
    +++ description: None
      receivedPermissions.1.description:
-        "cancel queued transactions."
+        "update the minimum delay and manage all access control roles of the timelock."
      receivedPermissions.0.delay:
-        259200
      receivedPermissions.0.description:
-        "update the minimum delay and manage all access control roles of the timelock."
+        "cancel queued transactions."
    }
```

Generated with discovered.json: 0xaf572c852c2ad343d036dbe27a3fc599905aeb38

# Diff at Wed, 12 Mar 2025 15:42:56 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@b11c73a301a3caaf2488c0ab0cbbdc2e138d506a block: 21786859
- current block number: 21786859

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21786859 (main branch discovery), not current.

```diff
    contract UpgradeExecutor (0x3ffFbAdAF827559da092217e474760E2b2c3CeDd) {
    +++ description: Central contract defining the access control permissions for upgrading the system contract implementations.
      directlyReceivedPermissions.7:
+        {"permission":"upgrade","from":"0xFb209827c58283535b744575e11953DCC4bEAD88"}
      directlyReceivedPermissions.6.permission:
-        "upgrade"
+        "interact"
      directlyReceivedPermissions.6.description:
+        "Pause and unpause and set important roles and parameters in the system contracts: Can delegate Sequencer management to a BatchPosterManager address, manage data availability and DACs, set the Sequencer-only window, introduce an allowList to the bridge and whitelist Inboxes/Outboxes."
      directlyReceivedPermissions.5.from:
-        "0xFb209827c58283535b744575e11953DCC4bEAD88"
+        "0xE6841D92B0C345144506576eC13ECf5103aC7f49"
      directlyReceivedPermissions.5.description:
-        "Pause and unpause and set important roles and parameters in the system contracts: Can delegate Sequencer management to a BatchPosterManager address, manage data availability and DACs, set the Sequencer-only window, introduce an allowList to the bridge and whitelist Inboxes/Outboxes."
+        "cancel queued transactions."
    }
```

```diff
    contract ArbitrumBridge (0x8315177aB297bA92A06054cE80a67Ed4DBd7ed3a) {
    +++ description: Contract used to relay governance action messages from Arbitrum One to Ethereum. It is also an escrow contract for the project's gas token (can be different from ETH). Keeps a list of allowed Inboxes and Outboxes for canonical bridge messaging.
      receivedPermissions.16:
+        {"permission":"upgrade","from":"0xFb209827c58283535b744575e11953DCC4bEAD88","via":[{"address":"0x3ffFbAdAF827559da092217e474760E2b2c3CeDd"},{"address":"0xE6841D92B0C345144506576eC13ECf5103aC7f49","delay":259200}]}
      receivedPermissions.15.from:
-        "0xFb209827c58283535b744575e11953DCC4bEAD88"
+        "0xE6841D92B0C345144506576eC13ECf5103aC7f49"
      receivedPermissions.15.via.2:
+        {"address":"0xE6841D92B0C345144506576eC13ECf5103aC7f49","delay":259200}
      receivedPermissions.15.via.1.address:
-        "0xE6841D92B0C345144506576eC13ECf5103aC7f49"
+        "0x3ffFbAdAF827559da092217e474760E2b2c3CeDd"
      receivedPermissions.15.via.1.delay:
-        259200
      receivedPermissions.15.via.0.address:
-        "0x3ffFbAdAF827559da092217e474760E2b2c3CeDd"
+        "0x5613AF0474EB9c528A34701A5b1662E3C8FA0678"
      receivedPermissions.14.from:
-        "0xE6841D92B0C345144506576eC13ECf5103aC7f49"
+        "0xD4B80C3D7240325D18E645B49e6535A3Bf95cc58"
      receivedPermissions.14.via.0.address:
-        "0x5613AF0474EB9c528A34701A5b1662E3C8FA0678"
+        "0x71D78dC7cCC0e037e12de1E50f5470903ce37148"
      receivedPermissions.13.from:
-        "0xD4B80C3D7240325D18E645B49e6535A3Bf95cc58"
+        "0xC840838Bc438d73C16c2f8b22D2Ce3669963cD48"
      receivedPermissions.13.via.0.address:
-        "0x71D78dC7cCC0e037e12de1E50f5470903ce37148"
+        "0xa8f7DdEd54a726eB873E98bFF2C95ABF2d03e560"
      receivedPermissions.12.from:
-        "0xC840838Bc438d73C16c2f8b22D2Ce3669963cD48"
+        "0xc4448b71118c9071Bcb9734A0EAc55D18A153949"
      receivedPermissions.12.via.0.address:
-        "0xa8f7DdEd54a726eB873E98bFF2C95ABF2d03e560"
+        "0x71D78dC7cCC0e037e12de1E50f5470903ce37148"
      receivedPermissions.11.from:
-        "0xc4448b71118c9071Bcb9734A0EAc55D18A153949"
+        "0xC1Ebd02f738644983b6C4B2d440b8e77DdE276Bd"
      receivedPermissions.10.from:
-        "0xC1Ebd02f738644983b6C4B2d440b8e77DdE276Bd"
+        "0xB2535b988dcE19f9D71dfB22dB6da744aCac21bf"
      receivedPermissions.10.via.0.address:
-        "0x71D78dC7cCC0e037e12de1E50f5470903ce37148"
+        "0xa8f7DdEd54a726eB873E98bFF2C95ABF2d03e560"
      receivedPermissions.9.from:
-        "0xB2535b988dcE19f9D71dfB22dB6da744aCac21bf"
+        "0xA59075221b50C598aED0Eae0bB9869639513af0D"
      receivedPermissions.9.via.0.address:
-        "0xa8f7DdEd54a726eB873E98bFF2C95ABF2d03e560"
+        "0x71D78dC7cCC0e037e12de1E50f5470903ce37148"
      receivedPermissions.8.from:
-        "0xA59075221b50C598aED0Eae0bB9869639513af0D"
+        "0x8315177aB297bA92A06054cE80a67Ed4DBd7ed3a"
      receivedPermissions.8.via.0.address:
-        "0x71D78dC7cCC0e037e12de1E50f5470903ce37148"
+        "0x554723262467F125Ac9e1cDFa9Ce15cc53822dbD"
      receivedPermissions.7.from:
-        "0x8315177aB297bA92A06054cE80a67Ed4DBd7ed3a"
+        "0x3ffFbAdAF827559da092217e474760E2b2c3CeDd"
      receivedPermissions.7.via.0.address:
-        "0x554723262467F125Ac9e1cDFa9Ce15cc53822dbD"
+        "0x5613AF0474EB9c528A34701A5b1662E3C8FA0678"
      receivedPermissions.6.from:
-        "0x3ffFbAdAF827559da092217e474760E2b2c3CeDd"
+        "0x304807A7ed6c1296df2128E6ff3836e477329CD2"
      receivedPermissions.6.via.0.address:
-        "0x5613AF0474EB9c528A34701A5b1662E3C8FA0678"
+        "0x71D78dC7cCC0e037e12de1E50f5470903ce37148"
      receivedPermissions.5.from:
-        "0x304807A7ed6c1296df2128E6ff3836e477329CD2"
+        "0x23122da8C581AA7E0d07A36Ff1f16F799650232f"
      receivedPermissions.5.via.0.address:
-        "0x71D78dC7cCC0e037e12de1E50f5470903ce37148"
+        "0xa8f7DdEd54a726eB873E98bFF2C95ABF2d03e560"
      receivedPermissions.4.from:
-        "0x23122da8C581AA7E0d07A36Ff1f16F799650232f"
+        "0x211E1c4c7f1bF5351Ac850Ed10FD68CFfCF6c21b"
      receivedPermissions.4.via.0.address:
-        "0xa8f7DdEd54a726eB873E98bFF2C95ABF2d03e560"
+        "0x71D78dC7cCC0e037e12de1E50f5470903ce37148"
      receivedPermissions.3.permission:
-        "upgrade"
+        "interact"
      receivedPermissions.3.from:
-        "0x211E1c4c7f1bF5351Ac850Ed10FD68CFfCF6c21b"
+        "0xFb209827c58283535b744575e11953DCC4bEAD88"
      receivedPermissions.3.via.2:
-        {"address":"0xE6841D92B0C345144506576eC13ECf5103aC7f49","delay":259200}
      receivedPermissions.3.via.1.address:
-        "0x3ffFbAdAF827559da092217e474760E2b2c3CeDd"
+        "0xE6841D92B0C345144506576eC13ECf5103aC7f49"
      receivedPermissions.3.via.1.delay:
+        259200
      receivedPermissions.3.via.0.address:
-        "0x71D78dC7cCC0e037e12de1E50f5470903ce37148"
+        "0x3ffFbAdAF827559da092217e474760E2b2c3CeDd"
      receivedPermissions.3.description:
+        "Pause and unpause and set important roles and parameters in the system contracts: Can delegate Sequencer management to a BatchPosterManager address, manage data availability and DACs, set the Sequencer-only window, introduce an allowList to the bridge and whitelist Inboxes/Outboxes."
      receivedPermissions.2.from:
-        "0xFb209827c58283535b744575e11953DCC4bEAD88"
+        "0xE6841D92B0C345144506576eC13ECf5103aC7f49"
      receivedPermissions.2.description:
-        "Pause and unpause and set important roles and parameters in the system contracts: Can delegate Sequencer management to a BatchPosterManager address, manage data availability and DACs, set the Sequencer-only window, introduce an allowList to the bridge and whitelist Inboxes/Outboxes."
+        "propose transactions."
      receivedPermissions.2.via:
-        [{"address":"0x3ffFbAdAF827559da092217e474760E2b2c3CeDd"},{"address":"0xE6841D92B0C345144506576eC13ECf5103aC7f49","delay":259200}]
      receivedPermissions.1.description:
-        "propose transactions."
+        "cancel queued transactions."
      receivedPermissions.1.via:
+        [{"address":"0x3ffFbAdAF827559da092217e474760E2b2c3CeDd"},{"address":"0xE6841D92B0C345144506576eC13ECf5103aC7f49","delay":259200}]
    }
```

```diff
    contract L1Timelock (0xE6841D92B0C345144506576eC13ECf5103aC7f49) {
    +++ description: A timelock with access control. The current minimum delay is 3d. Proposals that passed their minimum delay can be executed by the anyone.
      issuedPermissions.6:
+        {"permission":"upgrade","to":"0xF06E95eF589D9c38af242a8AAee8375f14023F85","via":[{"address":"0x3ffFbAdAF827559da092217e474760E2b2c3CeDd"},{"address":"0x5613AF0474EB9c528A34701A5b1662E3C8FA0678"}]}
      issuedPermissions.5:
+        {"permission":"upgrade","to":"0x8315177aB297bA92A06054cE80a67Ed4DBd7ed3a","via":[{"address":"0xE6841D92B0C345144506576eC13ECf5103aC7f49","delay":259200},{"address":"0x3ffFbAdAF827559da092217e474760E2b2c3CeDd"},{"address":"0x5613AF0474EB9c528A34701A5b1662E3C8FA0678"}]}
      issuedPermissions.4.permission:
-        "upgrade"
+        "interact"
      issuedPermissions.4.via.1:
-        {"address":"0x5613AF0474EB9c528A34701A5b1662E3C8FA0678"}
      issuedPermissions.4.description:
+        "cancel queued transactions."
      issuedPermissions.3.permission:
-        "upgrade"
+        "interact"
      issuedPermissions.3.to:
-        "0x8315177aB297bA92A06054cE80a67Ed4DBd7ed3a"
+        "0xF06E95eF589D9c38af242a8AAee8375f14023F85"
      issuedPermissions.3.via.2:
-        {"address":"0x5613AF0474EB9c528A34701A5b1662E3C8FA0678"}
      issuedPermissions.3.via.1:
-        {"address":"0x3ffFbAdAF827559da092217e474760E2b2c3CeDd"}
      issuedPermissions.3.via.0.address:
-        "0xE6841D92B0C345144506576eC13ECf5103aC7f49"
+        "0x3ffFbAdAF827559da092217e474760E2b2c3CeDd"
      issuedPermissions.3.via.0.delay:
-        259200
      issuedPermissions.3.delay:
+        259200
      issuedPermissions.3.description:
+        "update the minimum delay and manage all access control roles of the timelock."
      issuedPermissions.2.to:
-        "0xF06E95eF589D9c38af242a8AAee8375f14023F85"
+        "0x8315177aB297bA92A06054cE80a67Ed4DBd7ed3a"
      issuedPermissions.2.delay:
-        259200
      issuedPermissions.2.description:
-        "update the minimum delay and manage all access control roles of the timelock."
+        "propose transactions."
      issuedPermissions.2.via.0:
-        {"address":"0x3ffFbAdAF827559da092217e474760E2b2c3CeDd"}
      issuedPermissions.1.description:
-        "propose transactions."
+        "cancel queued transactions."
      issuedPermissions.1.via.1:
+        {"address":"0x3ffFbAdAF827559da092217e474760E2b2c3CeDd"}
      issuedPermissions.1.via.0:
+        {"address":"0xE6841D92B0C345144506576eC13ECf5103aC7f49","delay":259200}
    }
```

```diff
    contract SecurityCouncil (0xF06E95eF589D9c38af242a8AAee8375f14023F85) {
    +++ description: None
      receivedPermissions.15:
+        {"permission":"upgrade","from":"0xFb209827c58283535b744575e11953DCC4bEAD88","via":[{"address":"0x3ffFbAdAF827559da092217e474760E2b2c3CeDd"}]}
      receivedPermissions.14.from:
-        "0xFb209827c58283535b744575e11953DCC4bEAD88"
+        "0xE6841D92B0C345144506576eC13ECf5103aC7f49"
      receivedPermissions.14.via.1:
+        {"address":"0x3ffFbAdAF827559da092217e474760E2b2c3CeDd"}
      receivedPermissions.14.via.0.address:
-        "0x3ffFbAdAF827559da092217e474760E2b2c3CeDd"
+        "0x5613AF0474EB9c528A34701A5b1662E3C8FA0678"
      receivedPermissions.13.from:
-        "0xE6841D92B0C345144506576eC13ECf5103aC7f49"
+        "0xD4B80C3D7240325D18E645B49e6535A3Bf95cc58"
      receivedPermissions.13.via.0.address:
-        "0x5613AF0474EB9c528A34701A5b1662E3C8FA0678"
+        "0x71D78dC7cCC0e037e12de1E50f5470903ce37148"
      receivedPermissions.12.from:
-        "0xD4B80C3D7240325D18E645B49e6535A3Bf95cc58"
+        "0xC840838Bc438d73C16c2f8b22D2Ce3669963cD48"
      receivedPermissions.12.via.0.address:
-        "0x71D78dC7cCC0e037e12de1E50f5470903ce37148"
+        "0xa8f7DdEd54a726eB873E98bFF2C95ABF2d03e560"
      receivedPermissions.11.from:
-        "0xC840838Bc438d73C16c2f8b22D2Ce3669963cD48"
+        "0xc4448b71118c9071Bcb9734A0EAc55D18A153949"
      receivedPermissions.11.via.0.address:
-        "0xa8f7DdEd54a726eB873E98bFF2C95ABF2d03e560"
+        "0x71D78dC7cCC0e037e12de1E50f5470903ce37148"
      receivedPermissions.10.from:
-        "0xc4448b71118c9071Bcb9734A0EAc55D18A153949"
+        "0xC1Ebd02f738644983b6C4B2d440b8e77DdE276Bd"
      receivedPermissions.9.from:
-        "0xC1Ebd02f738644983b6C4B2d440b8e77DdE276Bd"
+        "0xB2535b988dcE19f9D71dfB22dB6da744aCac21bf"
      receivedPermissions.9.via.0.address:
-        "0x71D78dC7cCC0e037e12de1E50f5470903ce37148"
+        "0xa8f7DdEd54a726eB873E98bFF2C95ABF2d03e560"
      receivedPermissions.8.from:
-        "0xB2535b988dcE19f9D71dfB22dB6da744aCac21bf"
+        "0xA59075221b50C598aED0Eae0bB9869639513af0D"
      receivedPermissions.8.via.0.address:
-        "0xa8f7DdEd54a726eB873E98bFF2C95ABF2d03e560"
+        "0x71D78dC7cCC0e037e12de1E50f5470903ce37148"
      receivedPermissions.7.from:
-        "0xA59075221b50C598aED0Eae0bB9869639513af0D"
+        "0x8315177aB297bA92A06054cE80a67Ed4DBd7ed3a"
      receivedPermissions.7.via.0.address:
-        "0x71D78dC7cCC0e037e12de1E50f5470903ce37148"
+        "0x554723262467F125Ac9e1cDFa9Ce15cc53822dbD"
      receivedPermissions.6.from:
-        "0x8315177aB297bA92A06054cE80a67Ed4DBd7ed3a"
+        "0x3ffFbAdAF827559da092217e474760E2b2c3CeDd"
      receivedPermissions.6.via.0.address:
-        "0x554723262467F125Ac9e1cDFa9Ce15cc53822dbD"
+        "0x5613AF0474EB9c528A34701A5b1662E3C8FA0678"
      receivedPermissions.5.from:
-        "0x3ffFbAdAF827559da092217e474760E2b2c3CeDd"
+        "0x304807A7ed6c1296df2128E6ff3836e477329CD2"
      receivedPermissions.5.via.0.address:
-        "0x5613AF0474EB9c528A34701A5b1662E3C8FA0678"
+        "0x71D78dC7cCC0e037e12de1E50f5470903ce37148"
      receivedPermissions.4.from:
-        "0x304807A7ed6c1296df2128E6ff3836e477329CD2"
+        "0x23122da8C581AA7E0d07A36Ff1f16F799650232f"
      receivedPermissions.4.via.0.address:
-        "0x71D78dC7cCC0e037e12de1E50f5470903ce37148"
+        "0xa8f7DdEd54a726eB873E98bFF2C95ABF2d03e560"
      receivedPermissions.3.from:
-        "0x23122da8C581AA7E0d07A36Ff1f16F799650232f"
+        "0x211E1c4c7f1bF5351Ac850Ed10FD68CFfCF6c21b"
      receivedPermissions.3.via.0.address:
-        "0xa8f7DdEd54a726eB873E98bFF2C95ABF2d03e560"
+        "0x71D78dC7cCC0e037e12de1E50f5470903ce37148"
      receivedPermissions.2.permission:
-        "upgrade"
+        "interact"
      receivedPermissions.2.from:
-        "0x211E1c4c7f1bF5351Ac850Ed10FD68CFfCF6c21b"
+        "0xFb209827c58283535b744575e11953DCC4bEAD88"
      receivedPermissions.2.via.1:
-        {"address":"0x3ffFbAdAF827559da092217e474760E2b2c3CeDd"}
      receivedPermissions.2.via.0.address:
-        "0x71D78dC7cCC0e037e12de1E50f5470903ce37148"
+        "0x3ffFbAdAF827559da092217e474760E2b2c3CeDd"
      receivedPermissions.2.description:
+        "Pause and unpause and set important roles and parameters in the system contracts: Can delegate Sequencer management to a BatchPosterManager address, manage data availability and DACs, set the Sequencer-only window, introduce an allowList to the bridge and whitelist Inboxes/Outboxes."
      receivedPermissions.1.from:
-        "0xFb209827c58283535b744575e11953DCC4bEAD88"
+        "0xE6841D92B0C345144506576eC13ECf5103aC7f49"
      receivedPermissions.1.description:
-        "Pause and unpause and set important roles and parameters in the system contracts: Can delegate Sequencer management to a BatchPosterManager address, manage data availability and DACs, set the Sequencer-only window, introduce an allowList to the bridge and whitelist Inboxes/Outboxes."
+        "cancel queued transactions."
    }
```

Generated with discovered.json: 0x00e90031688c3a016a5c68026c35078b680017d5

# Diff at Thu, 06 Mar 2025 15:19:16 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@64eed24a033030dd2d128180f3ee3f87c3c39f7c block: 21786859
- current block number: 21786859

## Description

config: updates timelock templates, added starknet proghashes to global config.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21786859 (main branch discovery), not current.

```diff
    contract UpgradeExecutor (0x3ffFbAdAF827559da092217e474760E2b2c3CeDd) {
    +++ description: Central contract defining the access control permissions for upgrading the system contract implementations.
      directlyReceivedPermissions.7:
-        {"permission":"upgrade","from":"0xFb209827c58283535b744575e11953DCC4bEAD88"}
      directlyReceivedPermissions.6.permission:
-        "interact"
+        "upgrade"
      directlyReceivedPermissions.6.description:
-        "Pause and unpause and set important roles and parameters in the system contracts: Can delegate Sequencer management to a BatchPosterManager address, manage data availability and DACs, set the Sequencer-only window, introduce an allowList to the bridge and whitelist Inboxes/Outboxes."
      directlyReceivedPermissions.5.from:
-        "0xE6841D92B0C345144506576eC13ECf5103aC7f49"
+        "0xFb209827c58283535b744575e11953DCC4bEAD88"
      directlyReceivedPermissions.5.description:
-        "update the minimum delay of the timelock."
+        "Pause and unpause and set important roles and parameters in the system contracts: Can delegate Sequencer management to a BatchPosterManager address, manage data availability and DACs, set the Sequencer-only window, introduce an allowList to the bridge and whitelist Inboxes/Outboxes."
      directlyReceivedPermissions.4.description:
-        "cancel queued transactions."
+        "update the minimum delay and manage all access control roles of the timelock."
      directlyReceivedPermissions.4.delay:
+        259200
    }
```

```diff
    contract ArbitrumBridge (0x8315177aB297bA92A06054cE80a67Ed4DBd7ed3a) {
    +++ description: Contract used to relay governance action messages from Arbitrum One to Ethereum. It is also an escrow contract for the project's gas token (can be different from ETH). Keeps a list of allowed Inboxes and Outboxes for canonical bridge messaging.
      receivedPermissions.16:
-        {"permission":"upgrade","from":"0xFb209827c58283535b744575e11953DCC4bEAD88","via":[{"address":"0x3ffFbAdAF827559da092217e474760E2b2c3CeDd"},{"address":"0xE6841D92B0C345144506576eC13ECf5103aC7f49","delay":259200}]}
      receivedPermissions.15.from:
-        "0xE6841D92B0C345144506576eC13ECf5103aC7f49"
+        "0xFb209827c58283535b744575e11953DCC4bEAD88"
      receivedPermissions.15.via.2:
-        {"address":"0xE6841D92B0C345144506576eC13ECf5103aC7f49","delay":259200}
      receivedPermissions.15.via.1.address:
-        "0x3ffFbAdAF827559da092217e474760E2b2c3CeDd"
+        "0xE6841D92B0C345144506576eC13ECf5103aC7f49"
      receivedPermissions.15.via.1.delay:
+        259200
      receivedPermissions.15.via.0.address:
-        "0x5613AF0474EB9c528A34701A5b1662E3C8FA0678"
+        "0x3ffFbAdAF827559da092217e474760E2b2c3CeDd"
      receivedPermissions.14.from:
-        "0xD4B80C3D7240325D18E645B49e6535A3Bf95cc58"
+        "0xE6841D92B0C345144506576eC13ECf5103aC7f49"
      receivedPermissions.14.via.0.address:
-        "0x71D78dC7cCC0e037e12de1E50f5470903ce37148"
+        "0x5613AF0474EB9c528A34701A5b1662E3C8FA0678"
      receivedPermissions.13.from:
-        "0xC840838Bc438d73C16c2f8b22D2Ce3669963cD48"
+        "0xD4B80C3D7240325D18E645B49e6535A3Bf95cc58"
      receivedPermissions.13.via.0.address:
-        "0xa8f7DdEd54a726eB873E98bFF2C95ABF2d03e560"
+        "0x71D78dC7cCC0e037e12de1E50f5470903ce37148"
      receivedPermissions.12.from:
-        "0xc4448b71118c9071Bcb9734A0EAc55D18A153949"
+        "0xC840838Bc438d73C16c2f8b22D2Ce3669963cD48"
      receivedPermissions.12.via.0.address:
-        "0x71D78dC7cCC0e037e12de1E50f5470903ce37148"
+        "0xa8f7DdEd54a726eB873E98bFF2C95ABF2d03e560"
      receivedPermissions.11.from:
-        "0xC1Ebd02f738644983b6C4B2d440b8e77DdE276Bd"
+        "0xc4448b71118c9071Bcb9734A0EAc55D18A153949"
      receivedPermissions.10.from:
-        "0xB2535b988dcE19f9D71dfB22dB6da744aCac21bf"
+        "0xC1Ebd02f738644983b6C4B2d440b8e77DdE276Bd"
      receivedPermissions.10.via.0.address:
-        "0xa8f7DdEd54a726eB873E98bFF2C95ABF2d03e560"
+        "0x71D78dC7cCC0e037e12de1E50f5470903ce37148"
      receivedPermissions.9.from:
-        "0xA59075221b50C598aED0Eae0bB9869639513af0D"
+        "0xB2535b988dcE19f9D71dfB22dB6da744aCac21bf"
      receivedPermissions.9.via.0.address:
-        "0x71D78dC7cCC0e037e12de1E50f5470903ce37148"
+        "0xa8f7DdEd54a726eB873E98bFF2C95ABF2d03e560"
      receivedPermissions.8.from:
-        "0x8315177aB297bA92A06054cE80a67Ed4DBd7ed3a"
+        "0xA59075221b50C598aED0Eae0bB9869639513af0D"
      receivedPermissions.8.via.0.address:
-        "0x554723262467F125Ac9e1cDFa9Ce15cc53822dbD"
+        "0x71D78dC7cCC0e037e12de1E50f5470903ce37148"
      receivedPermissions.7.from:
-        "0x3ffFbAdAF827559da092217e474760E2b2c3CeDd"
+        "0x8315177aB297bA92A06054cE80a67Ed4DBd7ed3a"
      receivedPermissions.7.via.0.address:
-        "0x5613AF0474EB9c528A34701A5b1662E3C8FA0678"
+        "0x554723262467F125Ac9e1cDFa9Ce15cc53822dbD"
      receivedPermissions.6.from:
-        "0x304807A7ed6c1296df2128E6ff3836e477329CD2"
+        "0x3ffFbAdAF827559da092217e474760E2b2c3CeDd"
      receivedPermissions.6.via.0.address:
-        "0x71D78dC7cCC0e037e12de1E50f5470903ce37148"
+        "0x5613AF0474EB9c528A34701A5b1662E3C8FA0678"
      receivedPermissions.5.from:
-        "0x23122da8C581AA7E0d07A36Ff1f16F799650232f"
+        "0x304807A7ed6c1296df2128E6ff3836e477329CD2"
      receivedPermissions.5.via.0.address:
-        "0xa8f7DdEd54a726eB873E98bFF2C95ABF2d03e560"
+        "0x71D78dC7cCC0e037e12de1E50f5470903ce37148"
      receivedPermissions.4.from:
-        "0x211E1c4c7f1bF5351Ac850Ed10FD68CFfCF6c21b"
+        "0x23122da8C581AA7E0d07A36Ff1f16F799650232f"
      receivedPermissions.4.via.0.address:
-        "0x71D78dC7cCC0e037e12de1E50f5470903ce37148"
+        "0xa8f7DdEd54a726eB873E98bFF2C95ABF2d03e560"
      receivedPermissions.3.permission:
-        "interact"
+        "upgrade"
      receivedPermissions.3.from:
-        "0xFb209827c58283535b744575e11953DCC4bEAD88"
+        "0x211E1c4c7f1bF5351Ac850Ed10FD68CFfCF6c21b"
      receivedPermissions.3.description:
-        "Pause and unpause and set important roles and parameters in the system contracts: Can delegate Sequencer management to a BatchPosterManager address, manage data availability and DACs, set the Sequencer-only window, introduce an allowList to the bridge and whitelist Inboxes/Outboxes."
      receivedPermissions.3.via.2:
+        {"address":"0xE6841D92B0C345144506576eC13ECf5103aC7f49","delay":259200}
      receivedPermissions.3.via.1.address:
-        "0xE6841D92B0C345144506576eC13ECf5103aC7f49"
+        "0x3ffFbAdAF827559da092217e474760E2b2c3CeDd"
      receivedPermissions.3.via.1.delay:
-        259200
      receivedPermissions.3.via.0.address:
-        "0x3ffFbAdAF827559da092217e474760E2b2c3CeDd"
+        "0x71D78dC7cCC0e037e12de1E50f5470903ce37148"
      receivedPermissions.2.from:
-        "0xE6841D92B0C345144506576eC13ECf5103aC7f49"
+        "0xFb209827c58283535b744575e11953DCC4bEAD88"
      receivedPermissions.2.description:
-        "update the minimum delay of the timelock."
+        "Pause and unpause and set important roles and parameters in the system contracts: Can delegate Sequencer management to a BatchPosterManager address, manage data availability and DACs, set the Sequencer-only window, introduce an allowList to the bridge and whitelist Inboxes/Outboxes."
      receivedPermissions.0.description:
-        "cancel queued transactions."
+        "update the minimum delay and manage all access control roles of the timelock."
      receivedPermissions.0.delay:
+        259200
    }
```

```diff
    contract L1Timelock (0xE6841D92B0C345144506576eC13ECf5103aC7f49) {
    +++ description: A timelock with access control. The current minimum delay is 3d. Proposals that passed their minimum delay can be executed by the anyone.
      issuedPermissions.6:
-        {"permission":"upgrade","to":"0xF06E95eF589D9c38af242a8AAee8375f14023F85","via":[{"address":"0x3ffFbAdAF827559da092217e474760E2b2c3CeDd"},{"address":"0x5613AF0474EB9c528A34701A5b1662E3C8FA0678"}]}
      issuedPermissions.5:
-        {"permission":"upgrade","to":"0x8315177aB297bA92A06054cE80a67Ed4DBd7ed3a","via":[{"address":"0xE6841D92B0C345144506576eC13ECf5103aC7f49","delay":259200},{"address":"0x3ffFbAdAF827559da092217e474760E2b2c3CeDd"},{"address":"0x5613AF0474EB9c528A34701A5b1662E3C8FA0678"}]}
      issuedPermissions.4.permission:
-        "interact"
+        "upgrade"
      issuedPermissions.4.description:
-        "update the minimum delay of the timelock."
      issuedPermissions.4.via.1:
+        {"address":"0x5613AF0474EB9c528A34701A5b1662E3C8FA0678"}
      issuedPermissions.3.permission:
-        "interact"
+        "upgrade"
      issuedPermissions.3.to:
-        "0xF06E95eF589D9c38af242a8AAee8375f14023F85"
+        "0x8315177aB297bA92A06054cE80a67Ed4DBd7ed3a"
      issuedPermissions.3.description:
-        "cancel queued transactions."
      issuedPermissions.3.via.2:
+        {"address":"0x5613AF0474EB9c528A34701A5b1662E3C8FA0678"}
      issuedPermissions.3.via.1:
+        {"address":"0x3ffFbAdAF827559da092217e474760E2b2c3CeDd"}
      issuedPermissions.3.via.0.address:
-        "0x3ffFbAdAF827559da092217e474760E2b2c3CeDd"
+        "0xE6841D92B0C345144506576eC13ECf5103aC7f49"
      issuedPermissions.3.via.0.delay:
+        259200
      issuedPermissions.2.to:
-        "0x8315177aB297bA92A06054cE80a67Ed4DBd7ed3a"
+        "0xF06E95eF589D9c38af242a8AAee8375f14023F85"
      issuedPermissions.2.description:
-        "update the minimum delay of the timelock."
+        "update the minimum delay and manage all access control roles of the timelock."
      issuedPermissions.2.via.1:
-        {"address":"0x3ffFbAdAF827559da092217e474760E2b2c3CeDd"}
      issuedPermissions.2.via.0.address:
-        "0xE6841D92B0C345144506576eC13ECf5103aC7f49"
+        "0x3ffFbAdAF827559da092217e474760E2b2c3CeDd"
      issuedPermissions.2.via.0.delay:
-        259200
      issuedPermissions.2.delay:
+        259200
      issuedPermissions.0.description:
-        "cancel queued transactions."
+        "update the minimum delay and manage all access control roles of the timelock."
      issuedPermissions.0.delay:
+        259200
    }
```

```diff
    contract SecurityCouncil (0xF06E95eF589D9c38af242a8AAee8375f14023F85) {
    +++ description: None
      receivedPermissions.15:
-        {"permission":"upgrade","from":"0xFb209827c58283535b744575e11953DCC4bEAD88","via":[{"address":"0x3ffFbAdAF827559da092217e474760E2b2c3CeDd"}]}
      receivedPermissions.14.from:
-        "0xE6841D92B0C345144506576eC13ECf5103aC7f49"
+        "0xFb209827c58283535b744575e11953DCC4bEAD88"
      receivedPermissions.14.via.1:
-        {"address":"0x3ffFbAdAF827559da092217e474760E2b2c3CeDd"}
      receivedPermissions.14.via.0.address:
-        "0x5613AF0474EB9c528A34701A5b1662E3C8FA0678"
+        "0x3ffFbAdAF827559da092217e474760E2b2c3CeDd"
      receivedPermissions.13.from:
-        "0xD4B80C3D7240325D18E645B49e6535A3Bf95cc58"
+        "0xE6841D92B0C345144506576eC13ECf5103aC7f49"
      receivedPermissions.13.via.0.address:
-        "0x71D78dC7cCC0e037e12de1E50f5470903ce37148"
+        "0x5613AF0474EB9c528A34701A5b1662E3C8FA0678"
      receivedPermissions.12.from:
-        "0xC840838Bc438d73C16c2f8b22D2Ce3669963cD48"
+        "0xD4B80C3D7240325D18E645B49e6535A3Bf95cc58"
      receivedPermissions.12.via.0.address:
-        "0xa8f7DdEd54a726eB873E98bFF2C95ABF2d03e560"
+        "0x71D78dC7cCC0e037e12de1E50f5470903ce37148"
      receivedPermissions.11.from:
-        "0xc4448b71118c9071Bcb9734A0EAc55D18A153949"
+        "0xC840838Bc438d73C16c2f8b22D2Ce3669963cD48"
      receivedPermissions.11.via.0.address:
-        "0x71D78dC7cCC0e037e12de1E50f5470903ce37148"
+        "0xa8f7DdEd54a726eB873E98bFF2C95ABF2d03e560"
      receivedPermissions.10.from:
-        "0xC1Ebd02f738644983b6C4B2d440b8e77DdE276Bd"
+        "0xc4448b71118c9071Bcb9734A0EAc55D18A153949"
      receivedPermissions.9.from:
-        "0xB2535b988dcE19f9D71dfB22dB6da744aCac21bf"
+        "0xC1Ebd02f738644983b6C4B2d440b8e77DdE276Bd"
      receivedPermissions.9.via.0.address:
-        "0xa8f7DdEd54a726eB873E98bFF2C95ABF2d03e560"
+        "0x71D78dC7cCC0e037e12de1E50f5470903ce37148"
      receivedPermissions.8.from:
-        "0xA59075221b50C598aED0Eae0bB9869639513af0D"
+        "0xB2535b988dcE19f9D71dfB22dB6da744aCac21bf"
      receivedPermissions.8.via.0.address:
-        "0x71D78dC7cCC0e037e12de1E50f5470903ce37148"
+        "0xa8f7DdEd54a726eB873E98bFF2C95ABF2d03e560"
      receivedPermissions.7.from:
-        "0x8315177aB297bA92A06054cE80a67Ed4DBd7ed3a"
+        "0xA59075221b50C598aED0Eae0bB9869639513af0D"
      receivedPermissions.7.via.0.address:
-        "0x554723262467F125Ac9e1cDFa9Ce15cc53822dbD"
+        "0x71D78dC7cCC0e037e12de1E50f5470903ce37148"
      receivedPermissions.6.from:
-        "0x3ffFbAdAF827559da092217e474760E2b2c3CeDd"
+        "0x8315177aB297bA92A06054cE80a67Ed4DBd7ed3a"
      receivedPermissions.6.via.0.address:
-        "0x5613AF0474EB9c528A34701A5b1662E3C8FA0678"
+        "0x554723262467F125Ac9e1cDFa9Ce15cc53822dbD"
      receivedPermissions.5.from:
-        "0x304807A7ed6c1296df2128E6ff3836e477329CD2"
+        "0x3ffFbAdAF827559da092217e474760E2b2c3CeDd"
      receivedPermissions.5.via.0.address:
-        "0x71D78dC7cCC0e037e12de1E50f5470903ce37148"
+        "0x5613AF0474EB9c528A34701A5b1662E3C8FA0678"
      receivedPermissions.4.from:
-        "0x23122da8C581AA7E0d07A36Ff1f16F799650232f"
+        "0x304807A7ed6c1296df2128E6ff3836e477329CD2"
      receivedPermissions.4.via.0.address:
-        "0xa8f7DdEd54a726eB873E98bFF2C95ABF2d03e560"
+        "0x71D78dC7cCC0e037e12de1E50f5470903ce37148"
      receivedPermissions.3.from:
-        "0x211E1c4c7f1bF5351Ac850Ed10FD68CFfCF6c21b"
+        "0x23122da8C581AA7E0d07A36Ff1f16F799650232f"
      receivedPermissions.3.via.0.address:
-        "0x71D78dC7cCC0e037e12de1E50f5470903ce37148"
+        "0xa8f7DdEd54a726eB873E98bFF2C95ABF2d03e560"
      receivedPermissions.2.permission:
-        "interact"
+        "upgrade"
      receivedPermissions.2.from:
-        "0xFb209827c58283535b744575e11953DCC4bEAD88"
+        "0x211E1c4c7f1bF5351Ac850Ed10FD68CFfCF6c21b"
      receivedPermissions.2.description:
-        "Pause and unpause and set important roles and parameters in the system contracts: Can delegate Sequencer management to a BatchPosterManager address, manage data availability and DACs, set the Sequencer-only window, introduce an allowList to the bridge and whitelist Inboxes/Outboxes."
      receivedPermissions.2.via.1:
+        {"address":"0x3ffFbAdAF827559da092217e474760E2b2c3CeDd"}
      receivedPermissions.2.via.0.address:
-        "0x3ffFbAdAF827559da092217e474760E2b2c3CeDd"
+        "0x71D78dC7cCC0e037e12de1E50f5470903ce37148"
      receivedPermissions.1.from:
-        "0xE6841D92B0C345144506576eC13ECf5103aC7f49"
+        "0xFb209827c58283535b744575e11953DCC4bEAD88"
      receivedPermissions.1.description:
-        "update the minimum delay of the timelock."
+        "Pause and unpause and set important roles and parameters in the system contracts: Can delegate Sequencer management to a BatchPosterManager address, manage data availability and DACs, set the Sequencer-only window, introduce an allowList to the bridge and whitelist Inboxes/Outboxes."
      receivedPermissions.0.description:
-        "cancel queued transactions."
+        "update the minimum delay and manage all access control roles of the timelock."
      receivedPermissions.0.delay:
+        259200
    }
```

Generated with discovered.json: 0xcd990630651ef17f17650629b632df5f67dcd92b

# Diff at Thu, 06 Mar 2025 09:39:03 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@7119c715545bc86a4194761f42815f811ac6307a block: 21786859
- current block number: 21786859

## Description

Config related: set severity for arbitrum inbox/outbox changes to high and add historical In- and Outboxes via events.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21786859 (main branch discovery), not current.

```diff
    contract ArbitrumBridge (0x8315177aB297bA92A06054cE80a67Ed4DBd7ed3a) {
    +++ description: Contract used to relay governance action messages from Arbitrum One to Ethereum. It is also an escrow contract for the project's gas token (can be different from ETH). Keeps a list of allowed Inboxes and Outboxes for canonical bridge messaging.
+++ description: All Inboxes that were ever set as allowed in the bridge.
+++ severity: HIGH
      values.inboxHistory:
+        ["0x1c9DbddC9C2f1B29d4613E45BD5F35C0b1FBA8d6","0x57Bd336d579A51938619271a7Cc137a46D0501B1","0x4Dbd4fc535Ac27206064B68FfCf827b0A60BAB3f"]
+++ description: All Outboxes that were ever set as allowed in the bridge.
+++ severity: HIGH
      values.outboxHistory:
+        ["0x0B9857ae2D4A3DBe74ffE1d7DF045bb7F96E4840","0x667e23ABd27E623c11d4CC00ca3EC4d0bD63337a","0x760723CD2e632826c38Fef8CD438A4CC7E7E1A40"]
      fieldMeta:
+        {"allowedOutboxList":{"severity":"HIGH","description":"Can make calls as the bridge, steal all funds."},"outboxHistory":{"severity":"HIGH","description":"All Outboxes that were ever set as allowed in the bridge."},"allowedDelayedInboxList":{"severity":"HIGH","description":"Allowed to mint the gastoken on L2 and call `enqueueDelayedMessage()` on the bridge."},"inboxHistory":{"severity":"HIGH","description":"All Inboxes that were ever set as allowed in the bridge."}}
    }
```

```diff
    contract Bridge (0xC1Ebd02f738644983b6C4B2d440b8e77DdE276Bd) {
    +++ description: Escrow contract for the project's gas token (can be different from ETH). Keeps a list of allowed Inboxes and Outboxes for canonical bridge messaging.
+++ description: All Inboxes that were ever set as allowed in the bridge.
+++ severity: HIGH
      values.inboxHistory:
+        ["0xc4448b71118c9071Bcb9734A0EAc55D18A153949","0x304807A7ed6c1296df2128E6ff3836e477329CD2"]
+++ description: All Outboxes that were ever set as allowed in the bridge.
+++ severity: HIGH
      values.outboxHistory:
+        ["0xD4B80C3D7240325D18E645B49e6535A3Bf95cc58"]
      fieldMeta:
+        {"allowedOutboxList":{"severity":"HIGH","description":"Can make calls as the bridge, steal all funds."},"outboxHistory":{"severity":"HIGH","description":"All Outboxes that were ever set as allowed in the bridge."},"allowedDelayedInboxList":{"severity":"HIGH","description":"Allowed to mint the gastoken on L2 and call `enqueueDelayedMessage()` on the bridge."},"inboxHistory":{"severity":"HIGH","description":"All Inboxes that were ever set as allowed in the bridge."}}
    }
```

Generated with discovered.json: 0x2d98723e9bf8735cbf8749d49e597fa654e1ec1a

# Diff at Tue, 04 Mar 2025 10:39:29 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@98d260b45fe0d2195ce5e629bd7b200c8706e8ba block: 21786859
- current block number: 21786859

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21786859 (main branch discovery), not current.

```diff
    contract ValidatorWallet (0x1732BE6738117e9d22A84181AF68C8d09Cd4FF23) {
    +++ description: None
      sinceBlock:
+        15300677
    }
```

```diff
    contract SequencerInbox (0x211E1c4c7f1bF5351Ac850Ed10FD68CFfCF6c21b) {
    +++ description: A sequencer (registered in this contract) can submit transaction batches or commitments here.
      sinceBlock:
+        15016829
    }
```

```diff
    contract CustomGateway (0x23122da8C581AA7E0d07A36Ff1f16F799650232f) {
    +++ description: Escrows deposited assets for the canonical bridge that are externally governed or need custom token contracts with e.g. minting rights or upgradeability.
      sinceBlock:
+        15033103
    }
```

```diff
    contract ValidatorWallet (0x24Ca61c31C7f9Af3ab104dB6B9A444F28e9071e3) {
    +++ description: None
      sinceBlock:
+        15304227
    }
```

```diff
    contract ValidatorUtils (0x2B081fbaB646D9013f2699BebEf62B7e7d7F0976) {
    +++ description: This contract implements view only utilities for validators.
      sinceBlock:
+        15016821
    }
```

```diff
    contract OneStepProverMath (0x2c785E954c376be0CEfF4a7Db92E053B0830F7c9) {
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
      sinceBlock:
+        20281152
    }
```

```diff
    contract RollupEventInbox (0x304807A7ed6c1296df2128E6ff3836e477329CD2) {
    +++ description: None
      sinceBlock:
+        15016829
    }
```

```diff
    contract Validator (0x3B0369CAD35d257793F51c28213a4Cf4001397AC) {
    +++ description: None
      sinceBlock:
+        14816734
    }
```

```diff
    contract UpgradeExecutor (0x3ffFbAdAF827559da092217e474760E2b2c3CeDd) {
    +++ description: Central contract defining the access control permissions for upgrading the system contract implementations.
      sinceBlock:
+        16840309
    }
```

```diff
    contract ProxyAdmin (0x554723262467F125Ac9e1cDFa9Ce15cc53822dbD) {
    +++ description: None
      sinceBlock:
+        15411056
    }
```

```diff
    contract ProxyAdmin 2 (0x5613AF0474EB9c528A34701A5b1662E3C8FA0678) {
    +++ description: None
      sinceBlock:
+        16840300
    }
```

```diff
    contract ValidatorWallet (0x57004b440Cc4eb2FEd8c4d1865FaC907F9150C76) {
    +++ description: None
      sinceBlock:
+        15135808
    }
```

```diff
    contract OneStepProverMemory (0x5C9F8663583Ad0A1c0009c871f8253DBF4767A18) {
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
      sinceBlock:
+        20281151
    }
```

```diff
    contract ValidatorWallet (0x658e8123722462F888b6fa01a7dbcEFe1D6DD709) {
    +++ description: None
      sinceBlock:
+        15310208
    }
```

```diff
    contract ProxyAdmin (0x71D78dC7cCC0e037e12de1E50f5470903ce37148) {
    +++ description: None
      sinceBlock:
+        15016829
    }
```

```diff
    contract ArbitrumBridge (0x8315177aB297bA92A06054cE80a67Ed4DBd7ed3a) {
    +++ description: Contract used to relay governance action messages from Arbitrum One to Ethereum. It is also an escrow contract for the project's gas token (can be different from ETH). Keeps a list of allowed Inboxes and Outboxes for canonical bridge messaging.
      sinceBlock:
+        15411056
    }
```

```diff
    contract OneStepProverHostIo (0x8D78382913467Cd25374C75BA918b0A723Bc2544) {
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
      sinceBlock:
+        20281153
    }
```

```diff
    contract ProxyAdmin (0x8f6b82D007C0Ff4fd85fE84a5BFa89C00A4e6d2B) {
    +++ description: None
      sinceBlock:
+        15310208
    }
```

```diff
    contract L1DaiGateway (0x97f63339374fCe157Aa8Ee27830172d2AF76A786) {
    +++ description: None
      sinceBlock:
+        15276192
    }
```

```diff
    contract L1Escrow (0xA2e996f0cb33575FA0E36e8f62fCd4a9b897aAd3) {
    +++ description: None
      sinceBlock:
+        15276182
    }
```

```diff
    contract OneStepProofEntry (0xa328BAF257A937b7934429a5d8458d98693C6FC7) {
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
      sinceBlock:
+        20281154
    }
```

```diff
    contract ChallengeManager (0xA59075221b50C598aED0Eae0bB9869639513af0D) {
    +++ description: Contract that allows challenging state roots. Can be called through the RollupProxy by Validators or the UpgradeExecutor.
      sinceBlock:
+        15016829
    }
```

```diff
    contract ProxyAdmin 3 (0xa8f7DdEd54a726eB873E98bFF2C95ABF2d03e560) {
    +++ description: None
      sinceBlock:
+        15033091
    }
```

```diff
    contract ProxyAdmin (0xAd3a14Fc16751d9E7FCa2A99aF85bf4d135e878d) {
    +++ description: None
      sinceBlock:
+        15300677
    }
```

```diff
    contract ERC20Gateway (0xB2535b988dcE19f9D71dfB22dB6da744aCac21bf) {
    +++ description: Escrows deposited ERC-20 assets for the canonical Bridge. Upon depositing, a generic token representation will be minted at the destination. Withdrawals are initiated by the Outbox contract.
      sinceBlock:
+        15033100
    }
```

```diff
    contract ProxyAdmin (0xb31407BCf91d54AbFC0B7ef61bFc71b8b71F0678) {
    +++ description: None
      sinceBlock:
+        15304227
    }
```

```diff
    contract ProxyAdmin (0xb85e18C8F552c823CdA4DCd9056213bDc970f9AE) {
    +++ description: None
      sinceBlock:
+        14816734
    }
```

```diff
    contract Bridge (0xC1Ebd02f738644983b6C4B2d440b8e77DdE276Bd) {
    +++ description: Escrow contract for the project's gas token (can be different from ETH). Keeps a list of allowed Inboxes and Outboxes for canonical bridge messaging.
      sinceBlock:
+        15016829
    }
```

```diff
    contract ValidatorOwnerMultisig (0xC234E41AE2cb00311956Aa7109fC801ae8c80941) {
    +++ description: None
      sinceBlock:
+        13131111
    }
```

```diff
    contract Inbox (0xc4448b71118c9071Bcb9734A0EAc55D18A153949) {
    +++ description: None
      sinceBlock:
+        15016829
    }
```

```diff
    contract GatewayRouter (0xC840838Bc438d73C16c2f8b22D2Ce3669963cD48) {
    +++ description: This routing contract maps tokens to the correct escrow (gateway) to be then bridged with canonical messaging.
      sinceBlock:
+        15033094
    }
```

```diff
    contract OneStepProver0 (0xD0465e3356213869f1Fae38b3E67CBF4E873c5B6) {
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
      sinceBlock:
+        20281150
    }
```

```diff
    contract BatchPosterManagerMultisig (0xd0FDA6925f502a3a94986dfe7C92FE19EBbD679B) {
    +++ description: None
      sinceBlock:
+        19188638
    }
```

```diff
    contract Outbox (0xD4B80C3D7240325D18E645B49e6535A3Bf95cc58) {
    +++ description: Facilitates L2 to L1 contract calls: Messages initiated from L2 (for example withdrawal messages) eventually resolve in execution on L1.
      sinceBlock:
+        15016829
    }
```

```diff
    contract ValidatorWallet (0xE27d4Ed355e5273A3D4855c8e11BC4a8d3e39b87) {
    +++ description: None
      sinceBlock:
+        15027204
    }
```

```diff
    contract ProxyAdmin (0xE4d0Ba69d082Fdf6f51b8fc8F92c19bF00B1a1B4) {
    +++ description: None
      sinceBlock:
+        15027204
    }
```

```diff
    contract L1Timelock (0xE6841D92B0C345144506576eC13ECf5103aC7f49) {
    +++ description: A timelock with access control. The current minimum delay is 3d. Proposals that passed their minimum delay can be executed by the anyone.
      sinceBlock:
+        16840309
    }
```

```diff
    contract SecurityCouncil (0xF06E95eF589D9c38af242a8AAee8375f14023F85) {
    +++ description: None
      sinceBlock:
+        17923244
    }
```

```diff
    contract ProxyAdmin (0xF32e5B5Ad94c0c0F83E0023b0AC48A93A8a2a428) {
    +++ description: None
      sinceBlock:
+        15135808
    }
```

```diff
    contract RollupProxy (0xFb209827c58283535b744575e11953DCC4bEAD88) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      sinceBlock:
+        15016829
    }
```

Generated with discovered.json: 0x00d3a0f4ed05787d47faec006078d0c985149022

# Diff at Thu, 27 Feb 2025 11:46:10 GMT:

- author: Michał Podsiadły (<michal.podsiadly@l2beat.com>)
- comparing to: main@a4b50e45bb44f8ceeea29f9236088d26a843c885 block: 21786859
- current block number: 21786859

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21786859 (main branch discovery), not current.

```diff
    contract CustomGateway (0x23122da8C581AA7E0d07A36Ff1f16F799650232f) {
    +++ description: Escrows deposited assets for the canonical bridge that are externally governed or need custom token contracts with e.g. minting rights or upgradeability.
      name:
-        "L1CustomGateway"
+        "CustomGateway"
      displayName:
-        "CustomGateway"
    }
```

```diff
    contract ERC20Gateway (0xB2535b988dcE19f9D71dfB22dB6da744aCac21bf) {
    +++ description: Escrows deposited ERC-20 assets for the canonical Bridge. Upon depositing, a generic token representation will be minted at the destination. Withdrawals are initiated by the Outbox contract.
      name:
-        "L1ERC20Gateway"
+        "ERC20Gateway"
      displayName:
-        "ERC20Gateway"
    }
```

```diff
    contract GatewayRouter (0xC840838Bc438d73C16c2f8b22D2Ce3669963cD48) {
    +++ description: This routing contract maps tokens to the correct escrow (gateway) to be then bridged with canonical messaging.
      name:
-        "L1GatewayRouter"
+        "GatewayRouter"
      displayName:
-        "GatewayRouter"
    }
```

Generated with discovered.json: 0x4614f550c350b654e33440d2f515143c35a92312

# Diff at Fri, 21 Feb 2025 14:09:22 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@d219f271711b2cf7a164e3443bead5e4957d13a8 block: 21786859
- current block number: 21786859

## Description

Config related: Change some severities and add templates.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21786859 (main branch discovery), not current.

```diff
    contract SequencerInbox (0x211E1c4c7f1bF5351Ac850Ed10FD68CFfCF6c21b) {
    +++ description: A sequencer (registered in this contract) can submit transaction batches or commitments here.
      category:
+        {"name":"Local Infrastructure","priority":5}
    }
```

```diff
    contract L1CustomGateway (0x23122da8C581AA7E0d07A36Ff1f16F799650232f) {
    +++ description: Escrows deposited assets for the canonical bridge that are externally governed or need custom token contracts with e.g. minting rights or upgradeability.
      category:
+        {"name":"External Bridges","priority":1}
    }
```

```diff
    contract UpgradeExecutor (0x3ffFbAdAF827559da092217e474760E2b2c3CeDd) {
    +++ description: Central contract defining the access control permissions for upgrading the system contract implementations.
      category:
+        {"name":"Governance","priority":3}
    }
```

```diff
    contract ArbitrumBridge (0x8315177aB297bA92A06054cE80a67Ed4DBd7ed3a) {
    +++ description: Contract used to relay governance action messages from Arbitrum One to Ethereum. It is also an escrow contract for the project's gas token (can be different from ETH). Keeps a list of allowed Inboxes and Outboxes for canonical bridge messaging.
      category:
+        {"name":"Local Infrastructure","priority":5}
    }
```

```diff
    contract ChallengeManager (0xA59075221b50C598aED0Eae0bB9869639513af0D) {
    +++ description: Contract that allows challenging state roots. Can be called through the RollupProxy by Validators or the UpgradeExecutor.
      category:
+        {"name":"Local Infrastructure","priority":5}
    }
```

```diff
    contract L1ERC20Gateway (0xB2535b988dcE19f9D71dfB22dB6da744aCac21bf) {
    +++ description: Escrows deposited ERC-20 assets for the canonical Bridge. Upon depositing, a generic token representation will be minted at the destination. Withdrawals are initiated by the Outbox contract.
      category:
+        {"name":"Canonical Bridges","priority":2}
    }
```

```diff
    contract Bridge (0xC1Ebd02f738644983b6C4B2d440b8e77DdE276Bd) {
    +++ description: Escrow contract for the project's gas token (can be different from ETH). Keeps a list of allowed Inboxes and Outboxes for canonical bridge messaging.
      category:
+        {"name":"Local Infrastructure","priority":5}
    }
```

```diff
    contract L1GatewayRouter (0xC840838Bc438d73C16c2f8b22D2Ce3669963cD48) {
    +++ description: This routing contract maps tokens to the correct escrow (gateway) to be then bridged with canonical messaging.
      category:
+        {"name":"External Bridges","priority":1}
    }
```

```diff
    contract Outbox (0xD4B80C3D7240325D18E645B49e6535A3Bf95cc58) {
    +++ description: Facilitates L2 to L1 contract calls: Messages initiated from L2 (for example withdrawal messages) eventually resolve in execution on L1.
      category:
+        {"name":"Canonical Bridges","priority":2}
    }
```

```diff
    contract L1Timelock (0xE6841D92B0C345144506576eC13ECf5103aC7f49) {
    +++ description: A timelock with access control. The current minimum delay is 3d. Proposals that passed their minimum delay can be executed by the anyone.
      category:
+        {"name":"Governance","priority":3}
    }
```

```diff
    contract RollupProxy (0xFb209827c58283535b744575e11953DCC4bEAD88) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      category:
+        {"name":"Local Infrastructure","priority":5}
    }
```

Generated with discovered.json: 0x81ca79b5487837693b1ce8b46ae2c6385ff7b558

# Diff at Thu, 20 Feb 2025 12:24:38 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@e2b8072d8f4ddd728fac7a5e6cf8717962af378f block: 21786859
- current block number: 21786859

## Description

Config: Add Bold templates.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21786859 (main branch discovery), not current.

```diff
    contract RollupProxy (0xFb209827c58283535b744575e11953DCC4bEAD88) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      values.isPostBoLD:
+        false
    }
```

Generated with discovered.json: 0xf2796acd4f1771f9f8e80ec550f65a1e1fa548a4

# Diff at Fri, 14 Feb 2025 14:45:54 GMT:

- author: vincfurc (<10850139+vincfurc@users.noreply.github.com>)
- comparing to: main@866ac0e034ddb1e78e333932f83648ad55ba1b25 block: 21786859
- current block number: 21786859

## Description

Make Nova discovery driven.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21786859 (main branch discovery), not current.

```diff
    contract SequencerInbox (0x211E1c4c7f1bF5351Ac850Ed10FD68CFfCF6c21b) {
    +++ description: A sequencer (registered in this contract) can submit transaction batches or commitments here.
      issuedPermissions.3.to:
-        "0xE6841D92B0C345144506576eC13ECf5103aC7f49"
+        "0x8315177aB297bA92A06054cE80a67Ed4DBd7ed3a"
      issuedPermissions.3.via.2:
+        {"address":"0x71D78dC7cCC0e037e12de1E50f5470903ce37148"}
      issuedPermissions.3.via.1.address:
-        "0x71D78dC7cCC0e037e12de1E50f5470903ce37148"
+        "0x3ffFbAdAF827559da092217e474760E2b2c3CeDd"
      issuedPermissions.3.via.0.address:
-        "0x3ffFbAdAF827559da092217e474760E2b2c3CeDd"
+        "0xE6841D92B0C345144506576eC13ECf5103aC7f49"
      issuedPermissions.3.via.0.delay:
+        259200
    }
```

```diff
    contract L1CustomGateway (0x23122da8C581AA7E0d07A36Ff1f16F799650232f) {
    +++ description: Escrows deposited assets for the canonical bridge that are externally governed or need custom token contracts with e.g. minting rights or upgradeability.
      issuedPermissions.0.to:
-        "0xE6841D92B0C345144506576eC13ECf5103aC7f49"
+        "0x8315177aB297bA92A06054cE80a67Ed4DBd7ed3a"
      issuedPermissions.0.via.2:
+        {"address":"0xa8f7DdEd54a726eB873E98bFF2C95ABF2d03e560"}
      issuedPermissions.0.via.1.address:
-        "0xa8f7DdEd54a726eB873E98bFF2C95ABF2d03e560"
+        "0x3ffFbAdAF827559da092217e474760E2b2c3CeDd"
      issuedPermissions.0.via.0.address:
-        "0x3ffFbAdAF827559da092217e474760E2b2c3CeDd"
+        "0xE6841D92B0C345144506576eC13ECf5103aC7f49"
      issuedPermissions.0.via.0.delay:
+        259200
    }
```

```diff
    contract RollupEventInbox (0x304807A7ed6c1296df2128E6ff3836e477329CD2) {
    +++ description: None
      issuedPermissions.0.to:
-        "0xE6841D92B0C345144506576eC13ECf5103aC7f49"
+        "0x8315177aB297bA92A06054cE80a67Ed4DBd7ed3a"
      issuedPermissions.0.via.2:
+        {"address":"0x71D78dC7cCC0e037e12de1E50f5470903ce37148"}
      issuedPermissions.0.via.1.address:
-        "0x71D78dC7cCC0e037e12de1E50f5470903ce37148"
+        "0x3ffFbAdAF827559da092217e474760E2b2c3CeDd"
      issuedPermissions.0.via.0.address:
-        "0x3ffFbAdAF827559da092217e474760E2b2c3CeDd"
+        "0xE6841D92B0C345144506576eC13ECf5103aC7f49"
      issuedPermissions.0.via.0.delay:
+        259200
    }
```

```diff
    contract UpgradeExecutor (0x3ffFbAdAF827559da092217e474760E2b2c3CeDd) {
    +++ description: Central contract defining the access control permissions for upgrading the system contract implementations.
      issuedPermissions.0.to:
-        "0xE6841D92B0C345144506576eC13ECf5103aC7f49"
+        "0x8315177aB297bA92A06054cE80a67Ed4DBd7ed3a"
      issuedPermissions.0.via.2:
+        {"address":"0x5613AF0474EB9c528A34701A5b1662E3C8FA0678"}
      issuedPermissions.0.via.1.address:
-        "0x5613AF0474EB9c528A34701A5b1662E3C8FA0678"
+        "0x3ffFbAdAF827559da092217e474760E2b2c3CeDd"
      issuedPermissions.0.via.0.address:
-        "0x3ffFbAdAF827559da092217e474760E2b2c3CeDd"
+        "0xE6841D92B0C345144506576eC13ECf5103aC7f49"
      issuedPermissions.0.via.0.delay:
+        259200
      directlyReceivedPermissions.7:
+        {"permission":"upgrade","from":"0xFb209827c58283535b744575e11953DCC4bEAD88"}
      directlyReceivedPermissions.6.permission:
-        "upgrade"
+        "interact"
      directlyReceivedPermissions.6.description:
+        "Pause and unpause and set important roles and parameters in the system contracts: Can delegate Sequencer management to a BatchPosterManager address, manage data availability and DACs, set the Sequencer-only window, introduce an allowList to the bridge and whitelist Inboxes/Outboxes."
      directlyReceivedPermissions.5.from:
-        "0xFb209827c58283535b744575e11953DCC4bEAD88"
+        "0xE6841D92B0C345144506576eC13ECf5103aC7f49"
      directlyReceivedPermissions.5.description:
-        "Pause and unpause and set important roles and parameters in the system contracts: Can delegate Sequencer management to a BatchPosterManager address, manage data availability and DACs, set the Sequencer-only window, introduce an allowList to the bridge and whitelist Inboxes/Outboxes."
+        "update the minimum delay of the timelock."
      directlyReceivedPermissions.4.description:
-        "update the minimum delay of the timelock."
+        "cancel queued transactions."
      directlyReceivedPermissions.3.permission:
-        "interact"
+        "act"
      directlyReceivedPermissions.3.from:
-        "0xE6841D92B0C345144506576eC13ECf5103aC7f49"
+        "0xa8f7DdEd54a726eB873E98bFF2C95ABF2d03e560"
      directlyReceivedPermissions.3.description:
-        "cancel queued transactions."
      directlyReceivedPermissions.2.from:
-        "0xa8f7DdEd54a726eB873E98bFF2C95ABF2d03e560"
+        "0x71D78dC7cCC0e037e12de1E50f5470903ce37148"
      directlyReceivedPermissions.1.from:
-        "0x71D78dC7cCC0e037e12de1E50f5470903ce37148"
+        "0x5613AF0474EB9c528A34701A5b1662E3C8FA0678"
      directlyReceivedPermissions.0.from:
-        "0x5613AF0474EB9c528A34701A5b1662E3C8FA0678"
+        "0x554723262467F125Ac9e1cDFa9Ce15cc53822dbD"
    }
```

```diff
    contract ChallengeManager (0xA59075221b50C598aED0Eae0bB9869639513af0D) {
    +++ description: Contract that allows challenging state roots. Can be called through the RollupProxy by Validators or the UpgradeExecutor.
      issuedPermissions.0.to:
-        "0xE6841D92B0C345144506576eC13ECf5103aC7f49"
+        "0x8315177aB297bA92A06054cE80a67Ed4DBd7ed3a"
      issuedPermissions.0.via.2:
+        {"address":"0x71D78dC7cCC0e037e12de1E50f5470903ce37148"}
      issuedPermissions.0.via.1.address:
-        "0x71D78dC7cCC0e037e12de1E50f5470903ce37148"
+        "0x3ffFbAdAF827559da092217e474760E2b2c3CeDd"
      issuedPermissions.0.via.0.address:
-        "0x3ffFbAdAF827559da092217e474760E2b2c3CeDd"
+        "0xE6841D92B0C345144506576eC13ECf5103aC7f49"
      issuedPermissions.0.via.0.delay:
+        259200
    }
```

```diff
    contract L1ERC20Gateway (0xB2535b988dcE19f9D71dfB22dB6da744aCac21bf) {
    +++ description: Escrows deposited ERC-20 assets for the canonical Bridge. Upon depositing, a generic token representation will be minted at the destination. Withdrawals are initiated by the Outbox contract.
      issuedPermissions.0.to:
-        "0xE6841D92B0C345144506576eC13ECf5103aC7f49"
+        "0x8315177aB297bA92A06054cE80a67Ed4DBd7ed3a"
      issuedPermissions.0.via.2:
+        {"address":"0xa8f7DdEd54a726eB873E98bFF2C95ABF2d03e560"}
      issuedPermissions.0.via.1.address:
-        "0xa8f7DdEd54a726eB873E98bFF2C95ABF2d03e560"
+        "0x3ffFbAdAF827559da092217e474760E2b2c3CeDd"
      issuedPermissions.0.via.0.address:
-        "0x3ffFbAdAF827559da092217e474760E2b2c3CeDd"
+        "0xE6841D92B0C345144506576eC13ECf5103aC7f49"
      issuedPermissions.0.via.0.delay:
+        259200
    }
```

```diff
    contract Bridge (0xC1Ebd02f738644983b6C4B2d440b8e77DdE276Bd) {
    +++ description: Escrow contract for the project's gas token (can be different from ETH). Keeps a list of allowed Inboxes and Outboxes for canonical bridge messaging.
      issuedPermissions.0.to:
-        "0xE6841D92B0C345144506576eC13ECf5103aC7f49"
+        "0x8315177aB297bA92A06054cE80a67Ed4DBd7ed3a"
      issuedPermissions.0.via.2:
+        {"address":"0x71D78dC7cCC0e037e12de1E50f5470903ce37148"}
      issuedPermissions.0.via.1.address:
-        "0x71D78dC7cCC0e037e12de1E50f5470903ce37148"
+        "0x3ffFbAdAF827559da092217e474760E2b2c3CeDd"
      issuedPermissions.0.via.0.address:
-        "0x3ffFbAdAF827559da092217e474760E2b2c3CeDd"
+        "0xE6841D92B0C345144506576eC13ECf5103aC7f49"
      issuedPermissions.0.via.0.delay:
+        259200
    }
```

```diff
    contract Inbox (0xc4448b71118c9071Bcb9734A0EAc55D18A153949) {
    +++ description: None
      issuedPermissions.0.to:
-        "0xE6841D92B0C345144506576eC13ECf5103aC7f49"
+        "0x8315177aB297bA92A06054cE80a67Ed4DBd7ed3a"
      issuedPermissions.0.via.2:
+        {"address":"0x71D78dC7cCC0e037e12de1E50f5470903ce37148"}
      issuedPermissions.0.via.1.address:
-        "0x71D78dC7cCC0e037e12de1E50f5470903ce37148"
+        "0x3ffFbAdAF827559da092217e474760E2b2c3CeDd"
      issuedPermissions.0.via.0.address:
-        "0x3ffFbAdAF827559da092217e474760E2b2c3CeDd"
+        "0xE6841D92B0C345144506576eC13ECf5103aC7f49"
      issuedPermissions.0.via.0.delay:
+        259200
    }
```

```diff
    contract L1GatewayRouter (0xC840838Bc438d73C16c2f8b22D2Ce3669963cD48) {
    +++ description: This routing contract maps tokens to the correct escrow (gateway) to be then bridged with canonical messaging.
      issuedPermissions.0.to:
-        "0xE6841D92B0C345144506576eC13ECf5103aC7f49"
+        "0x8315177aB297bA92A06054cE80a67Ed4DBd7ed3a"
      issuedPermissions.0.via.2:
+        {"address":"0xa8f7DdEd54a726eB873E98bFF2C95ABF2d03e560"}
      issuedPermissions.0.via.1.address:
-        "0xa8f7DdEd54a726eB873E98bFF2C95ABF2d03e560"
+        "0x3ffFbAdAF827559da092217e474760E2b2c3CeDd"
      issuedPermissions.0.via.0.address:
-        "0x3ffFbAdAF827559da092217e474760E2b2c3CeDd"
+        "0xE6841D92B0C345144506576eC13ECf5103aC7f49"
      issuedPermissions.0.via.0.delay:
+        259200
    }
```

```diff
    contract Outbox (0xD4B80C3D7240325D18E645B49e6535A3Bf95cc58) {
    +++ description: Facilitates L2 to L1 contract calls: Messages initiated from L2 (for example withdrawal messages) eventually resolve in execution on L1.
      issuedPermissions.0.to:
-        "0xE6841D92B0C345144506576eC13ECf5103aC7f49"
+        "0x8315177aB297bA92A06054cE80a67Ed4DBd7ed3a"
      issuedPermissions.0.via.2:
+        {"address":"0x71D78dC7cCC0e037e12de1E50f5470903ce37148"}
      issuedPermissions.0.via.1.address:
-        "0x71D78dC7cCC0e037e12de1E50f5470903ce37148"
+        "0x3ffFbAdAF827559da092217e474760E2b2c3CeDd"
      issuedPermissions.0.via.0.address:
-        "0x3ffFbAdAF827559da092217e474760E2b2c3CeDd"
+        "0xE6841D92B0C345144506576eC13ECf5103aC7f49"
      issuedPermissions.0.via.0.delay:
+        259200
    }
```

```diff
    contract L1Timelock (0xE6841D92B0C345144506576eC13ECf5103aC7f49) {
    +++ description: A timelock with access control. The current minimum delay is 3d. Proposals that passed their minimum delay can be executed by the anyone.
      issuedPermissions.6:
+        {"permission":"upgrade","to":"0xF06E95eF589D9c38af242a8AAee8375f14023F85","via":[{"address":"0x3ffFbAdAF827559da092217e474760E2b2c3CeDd"},{"address":"0x5613AF0474EB9c528A34701A5b1662E3C8FA0678"}]}
      issuedPermissions.5.to:
-        "0xF06E95eF589D9c38af242a8AAee8375f14023F85"
+        "0x8315177aB297bA92A06054cE80a67Ed4DBd7ed3a"
      issuedPermissions.5.via.2:
+        {"address":"0x5613AF0474EB9c528A34701A5b1662E3C8FA0678"}
      issuedPermissions.5.via.1.address:
-        "0x5613AF0474EB9c528A34701A5b1662E3C8FA0678"
+        "0x3ffFbAdAF827559da092217e474760E2b2c3CeDd"
      issuedPermissions.5.via.0.address:
-        "0x3ffFbAdAF827559da092217e474760E2b2c3CeDd"
+        "0xE6841D92B0C345144506576eC13ECf5103aC7f49"
      issuedPermissions.5.via.0.delay:
+        259200
      issuedPermissions.4.permission:
-        "upgrade"
+        "interact"
      issuedPermissions.4.to:
-        "0xE6841D92B0C345144506576eC13ECf5103aC7f49"
+        "0xF06E95eF589D9c38af242a8AAee8375f14023F85"
      issuedPermissions.4.via.1:
-        {"address":"0x5613AF0474EB9c528A34701A5b1662E3C8FA0678"}
      issuedPermissions.4.description:
+        "update the minimum delay of the timelock."
      issuedPermissions.3.description:
-        "update the minimum delay of the timelock."
+        "cancel queued transactions."
      issuedPermissions.2.to:
-        "0xF06E95eF589D9c38af242a8AAee8375f14023F85"
+        "0x8315177aB297bA92A06054cE80a67Ed4DBd7ed3a"
      issuedPermissions.2.description:
-        "cancel queued transactions."
+        "update the minimum delay of the timelock."
      issuedPermissions.2.via.1:
+        {"address":"0x3ffFbAdAF827559da092217e474760E2b2c3CeDd"}
      issuedPermissions.2.via.0.address:
-        "0x3ffFbAdAF827559da092217e474760E2b2c3CeDd"
+        "0xE6841D92B0C345144506576eC13ECf5103aC7f49"
      issuedPermissions.2.via.0.delay:
+        259200
      issuedPermissions.1.to:
-        "0xE6841D92B0C345144506576eC13ECf5103aC7f49"
+        "0x8315177aB297bA92A06054cE80a67Ed4DBd7ed3a"
      issuedPermissions.1.description:
-        "update the minimum delay of the timelock."
+        "propose transactions."
      issuedPermissions.1.via.0:
-        {"address":"0x3ffFbAdAF827559da092217e474760E2b2c3CeDd"}
      issuedPermissions.0.to:
-        "0xE6841D92B0C345144506576eC13ECf5103aC7f49"
+        "0x8315177aB297bA92A06054cE80a67Ed4DBd7ed3a"
      issuedPermissions.0.via.1:
+        {"address":"0x3ffFbAdAF827559da092217e474760E2b2c3CeDd"}
      issuedPermissions.0.via.0.address:
-        "0x3ffFbAdAF827559da092217e474760E2b2c3CeDd"
+        "0xE6841D92B0C345144506576eC13ECf5103aC7f49"
      issuedPermissions.0.via.0.delay:
+        259200
      receivedPermissions:
-        [{"permission":"interact","from":"0xE6841D92B0C345144506576eC13ECf5103aC7f49","description":"cancel queued transactions.","via":[{"address":"0x3ffFbAdAF827559da092217e474760E2b2c3CeDd"}]},{"permission":"interact","from":"0xE6841D92B0C345144506576eC13ECf5103aC7f49","description":"update the minimum delay of the timelock.","via":[{"address":"0x3ffFbAdAF827559da092217e474760E2b2c3CeDd"}]},{"permission":"interact","from":"0xFb209827c58283535b744575e11953DCC4bEAD88","description":"Pause and unpause and set important roles and parameters in the system contracts: Can delegate Sequencer management to a BatchPosterManager address, manage data availability and DACs, set the Sequencer-only window, introduce an allowList to the bridge and whitelist Inboxes/Outboxes.","via":[{"address":"0x3ffFbAdAF827559da092217e474760E2b2c3CeDd"}]},{"permission":"upgrade","from":"0x211E1c4c7f1bF5351Ac850Ed10FD68CFfCF6c21b","via":[{"address":"0x71D78dC7cCC0e037e12de1E50f5470903ce37148"},{"address":"0x3ffFbAdAF827559da092217e474760E2b2c3CeDd"}]},{"permission":"upgrade","from":"0x23122da8C581AA7E0d07A36Ff1f16F799650232f","via":[{"address":"0xa8f7DdEd54a726eB873E98bFF2C95ABF2d03e560"},{"address":"0x3ffFbAdAF827559da092217e474760E2b2c3CeDd"}]},{"permission":"upgrade","from":"0x304807A7ed6c1296df2128E6ff3836e477329CD2","via":[{"address":"0x71D78dC7cCC0e037e12de1E50f5470903ce37148"},{"address":"0x3ffFbAdAF827559da092217e474760E2b2c3CeDd"}]},{"permission":"upgrade","from":"0x3ffFbAdAF827559da092217e474760E2b2c3CeDd","via":[{"address":"0x5613AF0474EB9c528A34701A5b1662E3C8FA0678"},{"address":"0x3ffFbAdAF827559da092217e474760E2b2c3CeDd"}]},{"permission":"upgrade","from":"0xA59075221b50C598aED0Eae0bB9869639513af0D","via":[{"address":"0x71D78dC7cCC0e037e12de1E50f5470903ce37148"},{"address":"0x3ffFbAdAF827559da092217e474760E2b2c3CeDd"}]},{"permission":"upgrade","from":"0xB2535b988dcE19f9D71dfB22dB6da744aCac21bf","via":[{"address":"0xa8f7DdEd54a726eB873E98bFF2C95ABF2d03e560"},{"address":"0x3ffFbAdAF827559da092217e474760E2b2c3CeDd"}]},{"permission":"upgrade","from":"0xC1Ebd02f738644983b6C4B2d440b8e77DdE276Bd","via":[{"address":"0x71D78dC7cCC0e037e12de1E50f5470903ce37148"},{"address":"0x3ffFbAdAF827559da092217e474760E2b2c3CeDd"}]},{"permission":"upgrade","from":"0xc4448b71118c9071Bcb9734A0EAc55D18A153949","via":[{"address":"0x71D78dC7cCC0e037e12de1E50f5470903ce37148"},{"address":"0x3ffFbAdAF827559da092217e474760E2b2c3CeDd"}]},{"permission":"upgrade","from":"0xC840838Bc438d73C16c2f8b22D2Ce3669963cD48","via":[{"address":"0xa8f7DdEd54a726eB873E98bFF2C95ABF2d03e560"},{"address":"0x3ffFbAdAF827559da092217e474760E2b2c3CeDd"}]},{"permission":"upgrade","from":"0xD4B80C3D7240325D18E645B49e6535A3Bf95cc58","via":[{"address":"0x71D78dC7cCC0e037e12de1E50f5470903ce37148"},{"address":"0x3ffFbAdAF827559da092217e474760E2b2c3CeDd"}]},{"permission":"upgrade","from":"0xE6841D92B0C345144506576eC13ECf5103aC7f49","via":[{"address":"0x5613AF0474EB9c528A34701A5b1662E3C8FA0678"},{"address":"0x3ffFbAdAF827559da092217e474760E2b2c3CeDd"}]},{"permission":"upgrade","from":"0xFb209827c58283535b744575e11953DCC4bEAD88","via":[{"address":"0x3ffFbAdAF827559da092217e474760E2b2c3CeDd"}]}]
    }
```

```diff
    contract SecurityCouncil (0xF06E95eF589D9c38af242a8AAee8375f14023F85) {
    +++ description: None
      receivedPermissions.15:
+        {"permission":"upgrade","from":"0xFb209827c58283535b744575e11953DCC4bEAD88","via":[{"address":"0x3ffFbAdAF827559da092217e474760E2b2c3CeDd"}]}
      receivedPermissions.14.from:
-        "0xFb209827c58283535b744575e11953DCC4bEAD88"
+        "0xE6841D92B0C345144506576eC13ECf5103aC7f49"
      receivedPermissions.14.via.1:
+        {"address":"0x3ffFbAdAF827559da092217e474760E2b2c3CeDd"}
      receivedPermissions.14.via.0.address:
-        "0x3ffFbAdAF827559da092217e474760E2b2c3CeDd"
+        "0x5613AF0474EB9c528A34701A5b1662E3C8FA0678"
      receivedPermissions.13.from:
-        "0xE6841D92B0C345144506576eC13ECf5103aC7f49"
+        "0xD4B80C3D7240325D18E645B49e6535A3Bf95cc58"
      receivedPermissions.13.via.0.address:
-        "0x5613AF0474EB9c528A34701A5b1662E3C8FA0678"
+        "0x71D78dC7cCC0e037e12de1E50f5470903ce37148"
      receivedPermissions.12.from:
-        "0xD4B80C3D7240325D18E645B49e6535A3Bf95cc58"
+        "0xC840838Bc438d73C16c2f8b22D2Ce3669963cD48"
      receivedPermissions.12.via.0.address:
-        "0x71D78dC7cCC0e037e12de1E50f5470903ce37148"
+        "0xa8f7DdEd54a726eB873E98bFF2C95ABF2d03e560"
      receivedPermissions.11.from:
-        "0xC840838Bc438d73C16c2f8b22D2Ce3669963cD48"
+        "0xc4448b71118c9071Bcb9734A0EAc55D18A153949"
      receivedPermissions.11.via.0.address:
-        "0xa8f7DdEd54a726eB873E98bFF2C95ABF2d03e560"
+        "0x71D78dC7cCC0e037e12de1E50f5470903ce37148"
      receivedPermissions.10.from:
-        "0xc4448b71118c9071Bcb9734A0EAc55D18A153949"
+        "0xC1Ebd02f738644983b6C4B2d440b8e77DdE276Bd"
      receivedPermissions.9.from:
-        "0xC1Ebd02f738644983b6C4B2d440b8e77DdE276Bd"
+        "0xB2535b988dcE19f9D71dfB22dB6da744aCac21bf"
      receivedPermissions.9.via.0.address:
-        "0x71D78dC7cCC0e037e12de1E50f5470903ce37148"
+        "0xa8f7DdEd54a726eB873E98bFF2C95ABF2d03e560"
      receivedPermissions.8.from:
-        "0xB2535b988dcE19f9D71dfB22dB6da744aCac21bf"
+        "0xA59075221b50C598aED0Eae0bB9869639513af0D"
      receivedPermissions.8.via.0.address:
-        "0xa8f7DdEd54a726eB873E98bFF2C95ABF2d03e560"
+        "0x71D78dC7cCC0e037e12de1E50f5470903ce37148"
      receivedPermissions.7.from:
-        "0xA59075221b50C598aED0Eae0bB9869639513af0D"
+        "0x8315177aB297bA92A06054cE80a67Ed4DBd7ed3a"
      receivedPermissions.7.via.0.address:
-        "0x71D78dC7cCC0e037e12de1E50f5470903ce37148"
+        "0x554723262467F125Ac9e1cDFa9Ce15cc53822dbD"
    }
```

```diff
    contract RollupProxy (0xFb209827c58283535b744575e11953DCC4bEAD88) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      issuedPermissions.2.to:
-        "0xE6841D92B0C345144506576eC13ECf5103aC7f49"
+        "0x8315177aB297bA92A06054cE80a67Ed4DBd7ed3a"
      issuedPermissions.2.via.1:
+        {"address":"0x3ffFbAdAF827559da092217e474760E2b2c3CeDd"}
      issuedPermissions.2.via.0.address:
-        "0x3ffFbAdAF827559da092217e474760E2b2c3CeDd"
+        "0xE6841D92B0C345144506576eC13ECf5103aC7f49"
      issuedPermissions.2.via.0.delay:
+        259200
      issuedPermissions.0.to:
-        "0xE6841D92B0C345144506576eC13ECf5103aC7f49"
+        "0x8315177aB297bA92A06054cE80a67Ed4DBd7ed3a"
      issuedPermissions.0.via.1:
+        {"address":"0x3ffFbAdAF827559da092217e474760E2b2c3CeDd"}
      issuedPermissions.0.via.0.address:
-        "0x3ffFbAdAF827559da092217e474760E2b2c3CeDd"
+        "0xE6841D92B0C345144506576eC13ECf5103aC7f49"
      issuedPermissions.0.via.0.delay:
+        259200
    }
```

```diff
+   Status: CREATED
    contract ProxyAdmin (0x554723262467F125Ac9e1cDFa9Ce15cc53822dbD)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ArbitrumBridge (0x8315177aB297bA92A06054cE80a67Ed4DBd7ed3a)
    +++ description: Contract used to relay governance action messages from Arbitrum One to Ethereum. It is also an escrow contract for the project's gas token (can be different from ETH). Keeps a list of allowed Inboxes and Outboxes for canonical bridge messaging.
```

Generated with discovered.json: 0x35a5094f285a5e0e4b5413e191742a62f02cd920

# Diff at Wed, 12 Feb 2025 18:44:36 GMT:

- author: vincfurc (<10850139+vincfurc@users.noreply.github.com>)
- comparing to: main@2b0c549e9be2ec1627969531e2ff05c01d31a788 block: 21786859
- current block number: 21786859

## Description

Part of making Arbitrum discovery driven. Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21786859 (main branch discovery), not current.

```diff
    contract SequencerInbox (0x211E1c4c7f1bF5351Ac850Ed10FD68CFfCF6c21b) {
    +++ description: A sequencer (registered in this contract) can submit transaction batches or commitments here.
      issuedPermissions.4:
+        {"permission":"upgrade","to":"0xF06E95eF589D9c38af242a8AAee8375f14023F85","via":[{"address":"0x3ffFbAdAF827559da092217e474760E2b2c3CeDd"},{"address":"0x71D78dC7cCC0e037e12de1E50f5470903ce37148"}]}
    }
```

```diff
    contract L1CustomGateway (0x23122da8C581AA7E0d07A36Ff1f16F799650232f) {
    +++ description: Escrows deposited assets for the canonical bridge that are externally governed or need custom token contracts with e.g. minting rights or upgradeability.
      issuedPermissions.1:
+        {"permission":"upgrade","to":"0xF06E95eF589D9c38af242a8AAee8375f14023F85","via":[{"address":"0x3ffFbAdAF827559da092217e474760E2b2c3CeDd"},{"address":"0xa8f7DdEd54a726eB873E98bFF2C95ABF2d03e560"}]}
    }
```

```diff
    contract RollupEventInbox (0x304807A7ed6c1296df2128E6ff3836e477329CD2) {
    +++ description: None
      issuedPermissions.1:
+        {"permission":"upgrade","to":"0xF06E95eF589D9c38af242a8AAee8375f14023F85","via":[{"address":"0x3ffFbAdAF827559da092217e474760E2b2c3CeDd"},{"address":"0x71D78dC7cCC0e037e12de1E50f5470903ce37148"}]}
    }
```

```diff
    contract UpgradeExecutor (0x3ffFbAdAF827559da092217e474760E2b2c3CeDd) {
    +++ description: Central contract defining the access control permissions for upgrading the system contract implementations.
      issuedPermissions.1:
+        {"permission":"upgrade","to":"0xF06E95eF589D9c38af242a8AAee8375f14023F85","via":[{"address":"0x3ffFbAdAF827559da092217e474760E2b2c3CeDd"},{"address":"0x5613AF0474EB9c528A34701A5b1662E3C8FA0678"}]}
      directlyReceivedPermissions.6:
+        {"permission":"upgrade","from":"0xFb209827c58283535b744575e11953DCC4bEAD88"}
      directlyReceivedPermissions.5.permission:
-        "upgrade"
+        "interact"
      directlyReceivedPermissions.5.description:
+        "Pause and unpause and set important roles and parameters in the system contracts: Can delegate Sequencer management to a BatchPosterManager address, manage data availability and DACs, set the Sequencer-only window, introduce an allowList to the bridge and whitelist Inboxes/Outboxes."
      directlyReceivedPermissions.4.from:
-        "0xFb209827c58283535b744575e11953DCC4bEAD88"
+        "0xE6841D92B0C345144506576eC13ECf5103aC7f49"
      directlyReceivedPermissions.4.description:
-        "Pause and unpause and set important roles and parameters in the system contracts: Can delegate Sequencer management to a BatchPosterManager address, manage data availability and DACs, set the Sequencer-only window, introduce an allowList to the bridge and whitelist Inboxes/Outboxes."
+        "update the minimum delay of the timelock."
      directlyReceivedPermissions.3.permission:
-        "act"
+        "interact"
      directlyReceivedPermissions.3.from:
-        "0xF06E95eF589D9c38af242a8AAee8375f14023F85"
+        "0xE6841D92B0C345144506576eC13ECf5103aC7f49"
      directlyReceivedPermissions.3.description:
+        "cancel queued transactions."
    }
```

```diff
    contract ChallengeManager (0xA59075221b50C598aED0Eae0bB9869639513af0D) {
    +++ description: Contract that allows challenging state roots. Can be called through the RollupProxy by Validators or the UpgradeExecutor.
      issuedPermissions.1:
+        {"permission":"upgrade","to":"0xF06E95eF589D9c38af242a8AAee8375f14023F85","via":[{"address":"0x3ffFbAdAF827559da092217e474760E2b2c3CeDd"},{"address":"0x71D78dC7cCC0e037e12de1E50f5470903ce37148"}]}
    }
```

```diff
    contract L1ERC20Gateway (0xB2535b988dcE19f9D71dfB22dB6da744aCac21bf) {
    +++ description: Escrows deposited ERC-20 assets for the canonical Bridge. Upon depositing, a generic token representation will be minted at the destination. Withdrawals are initiated by the Outbox contract.
      issuedPermissions.1:
+        {"permission":"upgrade","to":"0xF06E95eF589D9c38af242a8AAee8375f14023F85","via":[{"address":"0x3ffFbAdAF827559da092217e474760E2b2c3CeDd"},{"address":"0xa8f7DdEd54a726eB873E98bFF2C95ABF2d03e560"}]}
    }
```

```diff
    contract Bridge (0xC1Ebd02f738644983b6C4B2d440b8e77DdE276Bd) {
    +++ description: Escrow contract for the project's gas token (can be different from ETH). Keeps a list of allowed Inboxes and Outboxes for canonical bridge messaging.
      issuedPermissions.1:
+        {"permission":"upgrade","to":"0xF06E95eF589D9c38af242a8AAee8375f14023F85","via":[{"address":"0x3ffFbAdAF827559da092217e474760E2b2c3CeDd"},{"address":"0x71D78dC7cCC0e037e12de1E50f5470903ce37148"}]}
    }
```

```diff
    contract Inbox (0xc4448b71118c9071Bcb9734A0EAc55D18A153949) {
    +++ description: None
      issuedPermissions.1:
+        {"permission":"upgrade","to":"0xF06E95eF589D9c38af242a8AAee8375f14023F85","via":[{"address":"0x3ffFbAdAF827559da092217e474760E2b2c3CeDd"},{"address":"0x71D78dC7cCC0e037e12de1E50f5470903ce37148"}]}
    }
```

```diff
    contract L1GatewayRouter (0xC840838Bc438d73C16c2f8b22D2Ce3669963cD48) {
    +++ description: This routing contract maps tokens to the correct escrow (gateway) to be then bridged with canonical messaging.
      issuedPermissions.1:
+        {"permission":"upgrade","to":"0xF06E95eF589D9c38af242a8AAee8375f14023F85","via":[{"address":"0x3ffFbAdAF827559da092217e474760E2b2c3CeDd"},{"address":"0xa8f7DdEd54a726eB873E98bFF2C95ABF2d03e560"}]}
    }
```

```diff
    contract Outbox (0xD4B80C3D7240325D18E645B49e6535A3Bf95cc58) {
    +++ description: Facilitates L2 to L1 contract calls: Messages initiated from L2 (for example withdrawal messages) eventually resolve in execution on L1.
      issuedPermissions.1:
+        {"permission":"upgrade","to":"0xF06E95eF589D9c38af242a8AAee8375f14023F85","via":[{"address":"0x3ffFbAdAF827559da092217e474760E2b2c3CeDd"},{"address":"0x71D78dC7cCC0e037e12de1E50f5470903ce37148"}]}
    }
```

```diff
    contract L1Timelock (0xE6841D92B0C345144506576eC13ECf5103aC7f49) {
    +++ description: A timelock with access control. The current minimum delay is 3d. Proposals that passed their minimum delay can be executed by the anyone.
      issuedPermissions.5:
+        {"permission":"upgrade","to":"0xF06E95eF589D9c38af242a8AAee8375f14023F85","via":[{"address":"0x3ffFbAdAF827559da092217e474760E2b2c3CeDd"},{"address":"0x5613AF0474EB9c528A34701A5b1662E3C8FA0678"}]}
      issuedPermissions.4:
+        {"permission":"upgrade","to":"0xE6841D92B0C345144506576eC13ECf5103aC7f49","via":[{"address":"0x3ffFbAdAF827559da092217e474760E2b2c3CeDd"},{"address":"0x5613AF0474EB9c528A34701A5b1662E3C8FA0678"}]}
      issuedPermissions.3:
+        {"permission":"interact","to":"0xF06E95eF589D9c38af242a8AAee8375f14023F85","description":"update the minimum delay of the timelock.","via":[{"address":"0x3ffFbAdAF827559da092217e474760E2b2c3CeDd"}]}
      issuedPermissions.2:
+        {"permission":"interact","to":"0xF06E95eF589D9c38af242a8AAee8375f14023F85","description":"cancel queued transactions.","via":[{"address":"0x3ffFbAdAF827559da092217e474760E2b2c3CeDd"}]}
      issuedPermissions.1:
+        {"permission":"interact","to":"0xE6841D92B0C345144506576eC13ECf5103aC7f49","description":"update the minimum delay of the timelock.","via":[{"address":"0x3ffFbAdAF827559da092217e474760E2b2c3CeDd"}]}
      issuedPermissions.0.permission:
-        "upgrade"
+        "interact"
      issuedPermissions.0.via.1:
-        {"address":"0x5613AF0474EB9c528A34701A5b1662E3C8FA0678"}
      issuedPermissions.0.description:
+        "cancel queued transactions."
      receivedPermissions.14:
+        {"permission":"upgrade","from":"0xFb209827c58283535b744575e11953DCC4bEAD88","via":[{"address":"0x3ffFbAdAF827559da092217e474760E2b2c3CeDd"}]}
      receivedPermissions.13:
+        {"permission":"upgrade","from":"0xE6841D92B0C345144506576eC13ECf5103aC7f49","via":[{"address":"0x5613AF0474EB9c528A34701A5b1662E3C8FA0678"},{"address":"0x3ffFbAdAF827559da092217e474760E2b2c3CeDd"}]}
      receivedPermissions.12.from:
-        "0xFb209827c58283535b744575e11953DCC4bEAD88"
+        "0xD4B80C3D7240325D18E645B49e6535A3Bf95cc58"
      receivedPermissions.12.via.1:
+        {"address":"0x3ffFbAdAF827559da092217e474760E2b2c3CeDd"}
      receivedPermissions.12.via.0.address:
-        "0x3ffFbAdAF827559da092217e474760E2b2c3CeDd"
+        "0x71D78dC7cCC0e037e12de1E50f5470903ce37148"
      receivedPermissions.11.from:
-        "0xE6841D92B0C345144506576eC13ECf5103aC7f49"
+        "0xC840838Bc438d73C16c2f8b22D2Ce3669963cD48"
      receivedPermissions.11.via.0.address:
-        "0x5613AF0474EB9c528A34701A5b1662E3C8FA0678"
+        "0xa8f7DdEd54a726eB873E98bFF2C95ABF2d03e560"
      receivedPermissions.10.from:
-        "0xD4B80C3D7240325D18E645B49e6535A3Bf95cc58"
+        "0xc4448b71118c9071Bcb9734A0EAc55D18A153949"
      receivedPermissions.9.from:
-        "0xC840838Bc438d73C16c2f8b22D2Ce3669963cD48"
+        "0xC1Ebd02f738644983b6C4B2d440b8e77DdE276Bd"
      receivedPermissions.9.via.0.address:
-        "0xa8f7DdEd54a726eB873E98bFF2C95ABF2d03e560"
+        "0x71D78dC7cCC0e037e12de1E50f5470903ce37148"
      receivedPermissions.8.from:
-        "0xc4448b71118c9071Bcb9734A0EAc55D18A153949"
+        "0xB2535b988dcE19f9D71dfB22dB6da744aCac21bf"
      receivedPermissions.8.via.0.address:
-        "0x71D78dC7cCC0e037e12de1E50f5470903ce37148"
+        "0xa8f7DdEd54a726eB873E98bFF2C95ABF2d03e560"
      receivedPermissions.7.from:
-        "0xC1Ebd02f738644983b6C4B2d440b8e77DdE276Bd"
+        "0xA59075221b50C598aED0Eae0bB9869639513af0D"
      receivedPermissions.6.from:
-        "0xB2535b988dcE19f9D71dfB22dB6da744aCac21bf"
+        "0x3ffFbAdAF827559da092217e474760E2b2c3CeDd"
      receivedPermissions.6.via.0.address:
-        "0xa8f7DdEd54a726eB873E98bFF2C95ABF2d03e560"
+        "0x5613AF0474EB9c528A34701A5b1662E3C8FA0678"
      receivedPermissions.5.from:
-        "0xA59075221b50C598aED0Eae0bB9869639513af0D"
+        "0x304807A7ed6c1296df2128E6ff3836e477329CD2"
      receivedPermissions.4.from:
-        "0x3ffFbAdAF827559da092217e474760E2b2c3CeDd"
+        "0x23122da8C581AA7E0d07A36Ff1f16F799650232f"
      receivedPermissions.4.via.0.address:
-        "0x5613AF0474EB9c528A34701A5b1662E3C8FA0678"
+        "0xa8f7DdEd54a726eB873E98bFF2C95ABF2d03e560"
      receivedPermissions.3.from:
-        "0x304807A7ed6c1296df2128E6ff3836e477329CD2"
+        "0x211E1c4c7f1bF5351Ac850Ed10FD68CFfCF6c21b"
      receivedPermissions.2.permission:
-        "upgrade"
+        "interact"
      receivedPermissions.2.from:
-        "0x23122da8C581AA7E0d07A36Ff1f16F799650232f"
+        "0xFb209827c58283535b744575e11953DCC4bEAD88"
      receivedPermissions.2.via.1:
-        {"address":"0x3ffFbAdAF827559da092217e474760E2b2c3CeDd"}
      receivedPermissions.2.via.0.address:
-        "0xa8f7DdEd54a726eB873E98bFF2C95ABF2d03e560"
+        "0x3ffFbAdAF827559da092217e474760E2b2c3CeDd"
      receivedPermissions.2.description:
+        "Pause and unpause and set important roles and parameters in the system contracts: Can delegate Sequencer management to a BatchPosterManager address, manage data availability and DACs, set the Sequencer-only window, introduce an allowList to the bridge and whitelist Inboxes/Outboxes."
      receivedPermissions.1.permission:
-        "upgrade"
+        "interact"
      receivedPermissions.1.from:
-        "0x211E1c4c7f1bF5351Ac850Ed10FD68CFfCF6c21b"
+        "0xE6841D92B0C345144506576eC13ECf5103aC7f49"
      receivedPermissions.1.via.1:
-        {"address":"0x3ffFbAdAF827559da092217e474760E2b2c3CeDd"}
      receivedPermissions.1.via.0.address:
-        "0x71D78dC7cCC0e037e12de1E50f5470903ce37148"
+        "0x3ffFbAdAF827559da092217e474760E2b2c3CeDd"
      receivedPermissions.1.description:
+        "update the minimum delay of the timelock."
      receivedPermissions.0.from:
-        "0xFb209827c58283535b744575e11953DCC4bEAD88"
+        "0xE6841D92B0C345144506576eC13ECf5103aC7f49"
      receivedPermissions.0.description:
-        "Pause and unpause and set important roles and parameters in the system contracts: Can delegate Sequencer management to a BatchPosterManager address, manage data availability and DACs, set the Sequencer-only window, introduce an allowList to the bridge and whitelist Inboxes/Outboxes."
+        "cancel queued transactions."
      values.Canceller:
+        ["0x3ffFbAdAF827559da092217e474760E2b2c3CeDd"]
+++ description: Executing proposals is only open to all addresses if this resolves to the 0x0 address
+++ severity: HIGH
      values.Executor:
+        ["0x0000000000000000000000000000000000000000"]
      values.getMinDelayFormatted:
+        "3d"
      values.Proposer:
+        ["0x8315177aB297bA92A06054cE80a67Ed4DBd7ed3a"]
      values.scheduledTransactions:
+        [{"id":"0x85368b7ca2ee99b3d479ddff6298f69f0ce7d35227a731b70e8bc689074ba0af","decoded":{"chain":"arbitrum","contractName":"AIP1Point2Action","function":"perform","inputs":[],"address":"0x6274106eedD4848371D2C09e0352d67B795ED516","calldata":"0xb147f40c","executor":"0xCF57572261c7c2BCF21ffD220ea7d1a27D40A827","inboxOnEthereum":"0x4Dbd4fc535Ac27206064B68FfCf827b0A60BAB3f"},"raw":{"target":"0xa723C008e76E379c55599D2E4d93879BeaFDa79C","value":0,"data":"0x0000000000000000000000004dbd4fc535ac27206064b68ffcf827b0a60bab3f000000000000000000000000cf57572261c7c2bcf21ffd220ea7d1a27d40a82700000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000c000000000000000000000000000000000000000000000000000000000000000841cff79cd0000000000000000000000006274106eedd4848371d2c09e0352d67b795ed51600000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000004b147f40c0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000","delay":259200}},{"id":"0x6f801c57f0acf08c9688585c8b1cbb4b36f7053267befee7b2ee996b58592f2f","decoded":{"chain":"arbitrum","contractName":"AIP4Action","function":"perform","inputs":[],"address":"0x85792f6BF346e3Bfd3A275318aDd2c44A1058447","calldata":"0xb147f40c","executor":"0xCF57572261c7c2BCF21ffD220ea7d1a27D40A827","inboxOnEthereum":"0x4Dbd4fc535Ac27206064B68FfCf827b0A60BAB3f"},"raw":{"target":"0xa723C008e76E379c55599D2E4d93879BeaFDa79C","value":0,"data":"0x0000000000000000000000004dbd4fc535ac27206064b68ffcf827b0a60bab3f000000000000000000000000cf57572261c7c2bcf21ffd220ea7d1a27d40a82700000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000c000000000000000000000000000000000000000000000000000000000000000841cff79cd00000000000000000000000085792f6bf346e3bfd3a275318add2c44a105844700000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000004b147f40c0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000","delay":259200}},{"id":"0x0a0e8ebc47cd2cc5c020dc6a52e1c0c349165c7133547d811956c973e6b03ee2","decoded":{"chain":"ethereum","contractName":"L1SCMgmtActivationAction","function":"perform","inputs":[],"address":"0x22EC545357162C342F643bDdb2eD4c3FB6B42eb0","calldata":"0xb147f40c","executor":"0x3ffFbAdAF827559da092217e474760E2b2c3CeDd"},"raw":{"target":"0x3ffFbAdAF827559da092217e474760E2b2c3CeDd","value":0,"data":"0x1cff79cd00000000000000000000000022ec545357162c342f643bddb2ed4c3fb6b42eb000000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000004b147f40c00000000000000000000000000000000000000000000000000000000","delay":259200}},{"id":"0x0a0e8ebc47cd2cc5c020dc6a52e1c0c349165c7133547d811956c973e6b03ee2","decoded":{"chain":"arbitrum","contractName":"GovernanceChainSCMgmtActivationAction","function":"perform","inputs":[],"address":"0x1015c1Ae166C4C39D18a1151b7029bAC1530c9aa","calldata":"0xb147f40c","executor":"0xCF57572261c7c2BCF21ffD220ea7d1a27D40A827","inboxOnEthereum":"0x4Dbd4fc535Ac27206064B68FfCf827b0A60BAB3f"},"raw":{"target":"0xa723C008e76E379c55599D2E4d93879BeaFDa79C","value":0,"data":"0x0000000000000000000000004dbd4fc535ac27206064b68ffcf827b0a60bab3f000000000000000000000000cf57572261c7c2bcf21ffd220ea7d1a27d40a82700000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000c000000000000000000000000000000000000000000000000000000000000000841cff79cd0000000000000000000000001015c1ae166c4c39d18a1151b7029bac1530c9aa00000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000004b147f40c0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000","delay":259200}},{"id":"0x0a0e8ebc47cd2cc5c020dc6a52e1c0c349165c7133547d811956c973e6b03ee2","decoded":{"chain":"nova","address":"0x22EC545357162C342F643bDdb2eD4c3FB6B42eb0","calldata":"0xb147f40c","executor":"0x86a02dD71363c440b21F4c0E5B2Ad01Ffe1A7482","inboxOnEthereum":"0xc4448b71118c9071Bcb9734A0EAc55D18A153949"},"raw":{"target":"0xa723C008e76E379c55599D2E4d93879BeaFDa79C","value":0,"data":"0x000000000000000000000000c4448b71118c9071bcb9734a0eac55d18a15394900000000000000000000000086a02dd71363c440b21f4c0e5b2ad01ffe1a748200000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000c000000000000000000000000000000000000000000000000000000000000000841cff79cd00000000000000000000000022ec545357162c342f643bddb2ed4c3fb6b42eb000000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000004b147f40c0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000","delay":259200}},{"id":"0x57ae5d951014e5b6dad9718af7c1b2fd41172f8957de355c15fbdd9a6e28395f","decoded":{"chain":"arbitrum","contractName":"UpdateGasChargeAction","function":"perform","inputs":[],"address":"0x7B1247f443359d1447Cf25e73380Bc9b99F2628f","calldata":"0xb147f40c","executor":"0xCF57572261c7c2BCF21ffD220ea7d1a27D40A827","inboxOnEthereum":"0x4Dbd4fc535Ac27206064B68FfCf827b0A60BAB3f"},"raw":{"target":"0xa723C008e76E379c55599D2E4d93879BeaFDa79C","value":0,"data":"0x0000000000000000000000004dbd4fc535ac27206064b68ffcf827b0a60bab3f000000000000000000000000cf57572261c7c2bcf21ffd220ea7d1a27d40a82700000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000c000000000000000000000000000000000000000000000000000000000000000841cff79cd0000000000000000000000007b1247f443359d1447cf25e73380bc9b99f2628f00000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000004b147f40c0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000","delay":259200}},{"id":"0x57ae5d951014e5b6dad9718af7c1b2fd41172f8957de355c15fbdd9a6e28395f","decoded":{"chain":"arbitrum","contractName":"SetSweepReceiverAction","function":"perform","inputs":[],"address":"0xBabA4DAf5800B9746f58C724F05E03880850D578","calldata":"0xb147f40c","executor":"0xCF57572261c7c2BCF21ffD220ea7d1a27D40A827","inboxOnEthereum":"0x4Dbd4fc535Ac27206064B68FfCf827b0A60BAB3f"},"raw":{"target":"0xa723C008e76E379c55599D2E4d93879BeaFDa79C","value":0,"data":"0x0000000000000000000000004dbd4fc535ac27206064b68ffcf827b0a60bab3f000000000000000000000000cf57572261c7c2bcf21ffd220ea7d1a27d40a82700000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000c000000000000000000000000000000000000000000000000000000000000000841cff79cd000000000000000000000000baba4daf5800b9746f58c724f05e03880850d57800000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000004b147f40c0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000","delay":259200}},{"id":"0x57ae5d951014e5b6dad9718af7c1b2fd41172f8957de355c15fbdd9a6e28395f","decoded":{"chain":"ethereum","contractName":"UpdateL1CoreTimelockAction","function":"perform","inputs":[],"address":"0xBabA4DAf5800B9746f58C724F05E03880850D578","calldata":"0xb147f40c","executor":"0x3ffFbAdAF827559da092217e474760E2b2c3CeDd"},"raw":{"target":"0x3ffFbAdAF827559da092217e474760E2b2c3CeDd","value":0,"data":"0x1cff79cd000000000000000000000000baba4daf5800b9746f58c724f05e03880850d57800000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000004b147f40c00000000000000000000000000000000000000000000000000000000","delay":259200}},{"id":"0x4de857395557aa68ca8e4ac5c12a0a8427b39b01c33e27882d473c25ed69cd93","decoded":{"chain":"ethereum","contractName":"SecurityCouncilMemberSyncAction","function":"perform","inputs":[{"name":"_securityCouncil","value":"0xF06E95eF589D9c38af242a8AAee8375f14023F85"},{"name":"_updatedMembers","value":["0x3Bd8e2AC65ad6f0F094BA6766cBd9484AB49eF23","0xf8e1492255d9428c2Fc20A98A1DeB1215C8ffEfd","0xb07dc9103328A51128bC6Cc1049d1137035f5E28","0x3E286452b1C66abB08Eb5494c3894F40aB5a59AF","0xb71ca4FFbB7b58d75Ba29891ab45e9Dc12B444Ed","0x8F10e3413586c4a8DCfcE19D009872b19e9cd8E3","0x566a07C3c932aE6AF74d77c29e5c30D8B1853710","0x5280406912EB8Ec677Df66C326BE48f938DC2e44","0x0275b3D54a5dDbf8205A75984796eFE8b7357Bae","0x5A1FD562271aAC2Dadb51BAAb7760b949D9D81dF","0xf6B6F07862A02C85628B3A9688beae07fEA9C863","0x475816ca2a31D601B4e336f5c2418A67978aBf09"]},{"name":"_nonce","value":1}],"address":"0x9BF7b8884Fa381a45f8CB2525905fb36C996297a","calldata":"0x536d8944000000000000000000000000f06e95ef589d9c38af242a8aaee8375f14023f8500000000000000000000000000000000000000000000000000000000000000600000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000000c0000000000000000000000003bd8e2ac65ad6f0f094ba6766cbd9484ab49ef23000000000000000000000000f8e1492255d9428c2fc20a98a1deb1215c8ffefd000000000000000000000000b07dc9103328a51128bc6cc1049d1137035f5e280000000000000000000000003e286452b1c66abb08eb5494c3894f40ab5a59af000000000000000000000000b71ca4ffbb7b58d75ba29891ab45e9dc12b444ed0000000000000000000000008f10e3413586c4a8dcfce19d009872b19e9cd8e3000000000000000000000000566a07c3c932ae6af74d77c29e5c30d8b18537100000000000000000000000005280406912eb8ec677df66c326be48f938dc2e440000000000000000000000000275b3d54a5ddbf8205a75984796efe8b7357bae0000000000000000000000005a1fd562271aac2dadb51baab7760b949d9d81df000000000000000000000000f6b6f07862a02c85628b3a9688beae07fea9c863000000000000000000000000475816ca2a31d601b4e336f5c2418a67978abf09","executor":"0x3ffFbAdAF827559da092217e474760E2b2c3CeDd"},"raw":{"target":"0x3ffFbAdAF827559da092217e474760E2b2c3CeDd","value":0,"data":"0x1cff79cd0000000000000000000000009bf7b8884fa381a45f8cb2525905fb36c996297a00000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000204536d8944000000000000000000000000f06e95ef589d9c38af242a8aaee8375f14023f8500000000000000000000000000000000000000000000000000000000000000600000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000000c0000000000000000000000003bd8e2ac65ad6f0f094ba6766cbd9484ab49ef23000000000000000000000000f8e1492255d9428c2fc20a98a1deb1215c8ffefd000000000000000000000000b07dc9103328a51128bc6cc1049d1137035f5e280000000000000000000000003e286452b1c66abb08eb5494c3894f40ab5a59af000000000000000000000000b71ca4ffbb7b58d75ba29891ab45e9dc12b444ed0000000000000000000000008f10e3413586c4a8dcfce19d009872b19e9cd8e3000000000000000000000000566a07c3c932ae6af74d77c29e5c30d8b18537100000000000000000000000005280406912eb8ec677df66c326be48f938dc2e440000000000000000000000000275b3d54a5ddbf8205a75984796efe8b7357bae0000000000000000000000005a1fd562271aac2dadb51baab7760b949d9d81df000000000000000000000000f6b6f07862a02c85628b3a9688beae07fea9c863000000000000000000000000475816ca2a31d601b4e336f5c2418a67978abf0900000000000000000000000000000000000000000000000000000000","delay":259200}},{"id":"0x4de857395557aa68ca8e4ac5c12a0a8427b39b01c33e27882d473c25ed69cd93","decoded":{"chain":"arbitrum","contractName":"SecurityCouncilMemberSyncAction","function":"perform","inputs":[{"name":"_securityCouncil","value":"0x423552c0F05baCCac5Bfa91C6dCF1dc53a0A1641"},{"name":"_updatedMembers","value":["0x3Bd8e2AC65ad6f0F094BA6766cBd9484AB49eF23","0xf8e1492255d9428c2Fc20A98A1DeB1215C8ffEfd","0xb07dc9103328A51128bC6Cc1049d1137035f5E28","0x3E286452b1C66abB08Eb5494c3894F40aB5a59AF","0xb71ca4FFbB7b58d75Ba29891ab45e9Dc12B444Ed","0x8F10e3413586c4a8DCfcE19D009872b19e9cd8E3","0x566a07C3c932aE6AF74d77c29e5c30D8B1853710","0x5280406912EB8Ec677Df66C326BE48f938DC2e44","0x0275b3D54a5dDbf8205A75984796eFE8b7357Bae","0x5A1FD562271aAC2Dadb51BAAb7760b949D9D81dF","0xf6B6F07862A02C85628B3A9688beae07fEA9C863","0x475816ca2a31D601B4e336f5c2418A67978aBf09"]},{"name":"_nonce","value":1}],"address":"0x9BF7b8884Fa381a45f8CB2525905fb36C996297a","calldata":"0x536d8944000000000000000000000000423552c0f05baccac5bfa91c6dcf1dc53a0a164100000000000000000000000000000000000000000000000000000000000000600000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000000c0000000000000000000000003bd8e2ac65ad6f0f094ba6766cbd9484ab49ef23000000000000000000000000f8e1492255d9428c2fc20a98a1deb1215c8ffefd000000000000000000000000b07dc9103328a51128bc6cc1049d1137035f5e280000000000000000000000003e286452b1c66abb08eb5494c3894f40ab5a59af000000000000000000000000b71ca4ffbb7b58d75ba29891ab45e9dc12b444ed0000000000000000000000008f10e3413586c4a8dcfce19d009872b19e9cd8e3000000000000000000000000566a07c3c932ae6af74d77c29e5c30d8b18537100000000000000000000000005280406912eb8ec677df66c326be48f938dc2e440000000000000000000000000275b3d54a5ddbf8205a75984796efe8b7357bae0000000000000000000000005a1fd562271aac2dadb51baab7760b949d9d81df000000000000000000000000f6b6f07862a02c85628b3a9688beae07fea9c863000000000000000000000000475816ca2a31d601b4e336f5c2418a67978abf09","executor":"0xCF57572261c7c2BCF21ffD220ea7d1a27D40A827","inboxOnEthereum":"0x4Dbd4fc535Ac27206064B68FfCf827b0A60BAB3f"},"raw":{"target":"0xa723C008e76E379c55599D2E4d93879BeaFDa79C","value":0,"data":"0x0000000000000000000000004dbd4fc535ac27206064b68ffcf827b0a60bab3f000000000000000000000000cf57572261c7c2bcf21ffd220ea7d1a27d40a82700000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000c000000000000000000000000000000000000000000000000000000000000002841cff79cd0000000000000000000000009bf7b8884fa381a45f8cb2525905fb36c996297a00000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000204536d8944000000000000000000000000423552c0f05baccac5bfa91c6dcf1dc53a0a164100000000000000000000000000000000000000000000000000000000000000600000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000000c0000000000000000000000003bd8e2ac65ad6f0f094ba6766cbd9484ab49ef23000000000000000000000000f8e1492255d9428c2fc20a98a1deb1215c8ffefd000000000000000000000000b07dc9103328a51128bc6cc1049d1137035f5e280000000000000000000000003e286452b1c66abb08eb5494c3894f40ab5a59af000000000000000000000000b71ca4ffbb7b58d75ba29891ab45e9dc12b444ed0000000000000000000000008f10e3413586c4a8dcfce19d009872b19e9cd8e3000000000000000000000000566a07c3c932ae6af74d77c29e5c30d8b18537100000000000000000000000005280406912eb8ec677df66c326be48f938dc2e440000000000000000000000000275b3d54a5ddbf8205a75984796efe8b7357bae0000000000000000000000005a1fd562271aac2dadb51baab7760b949d9d81df000000000000000000000000f6b6f07862a02c85628b3a9688beae07fea9c863000000000000000000000000475816ca2a31d601b4e336f5c2418a67978abf090000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000","delay":259200}},{"id":"0x4de857395557aa68ca8e4ac5c12a0a8427b39b01c33e27882d473c25ed69cd93","decoded":{"chain":"nova","address":"0x9BF7b8884Fa381a45f8CB2525905fb36C996297a","calldata":"0x536d8944000000000000000000000000c232ee726e3c51b86778bb4dbe61c52cc07a60f300000000000000000000000000000000000000000000000000000000000000600000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000000c0000000000000000000000003bd8e2ac65ad6f0f094ba6766cbd9484ab49ef23000000000000000000000000f8e1492255d9428c2fc20a98a1deb1215c8ffefd000000000000000000000000b07dc9103328a51128bc6cc1049d1137035f5e280000000000000000000000003e286452b1c66abb08eb5494c3894f40ab5a59af000000000000000000000000b71ca4ffbb7b58d75ba29891ab45e9dc12b444ed0000000000000000000000008f10e3413586c4a8dcfce19d009872b19e9cd8e3000000000000000000000000566a07c3c932ae6af74d77c29e5c30d8b18537100000000000000000000000005280406912eb8ec677df66c326be48f938dc2e440000000000000000000000000275b3d54a5ddbf8205a75984796efe8b7357bae0000000000000000000000005a1fd562271aac2dadb51baab7760b949d9d81df000000000000000000000000f6b6f07862a02c85628b3a9688beae07fea9c863000000000000000000000000475816ca2a31d601b4e336f5c2418a67978abf09","executor":"0x86a02dD71363c440b21F4c0E5B2Ad01Ffe1A7482","inboxOnEthereum":"0xc4448b71118c9071Bcb9734A0EAc55D18A153949"},"raw":{"target":"0xa723C008e76E379c55599D2E4d93879BeaFDa79C","value":0,"data":"0x000000000000000000000000c4448b71118c9071bcb9734a0eac55d18a15394900000000000000000000000086a02dd71363c440b21f4c0e5b2ad01ffe1a748200000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000c000000000000000000000000000000000000000000000000000000000000002841cff79cd0000000000000000000000009bf7b8884fa381a45f8cb2525905fb36c996297a00000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000204536d8944000000000000000000000000c232ee726e3c51b86778bb4dbe61c52cc07a60f300000000000000000000000000000000000000000000000000000000000000600000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000000c0000000000000000000000003bd8e2ac65ad6f0f094ba6766cbd9484ab49ef23000000000000000000000000f8e1492255d9428c2fc20a98a1deb1215c8ffefd000000000000000000000000b07dc9103328a51128bc6cc1049d1137035f5e280000000000000000000000003e286452b1c66abb08eb5494c3894f40ab5a59af000000000000000000000000b71ca4ffbb7b58d75ba29891ab45e9dc12b444ed0000000000000000000000008f10e3413586c4a8dcfce19d009872b19e9cd8e3000000000000000000000000566a07c3c932ae6af74d77c29e5c30d8b18537100000000000000000000000005280406912eb8ec677df66c326be48f938dc2e440000000000000000000000000275b3d54a5ddbf8205a75984796efe8b7357bae0000000000000000000000005a1fd562271aac2dadb51baab7760b949d9d81df000000000000000000000000f6b6f07862a02c85628b3a9688beae07fea9c863000000000000000000000000475816ca2a31d601b4e336f5c2418a67978abf090000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000","delay":259200}},{"id":"0x4de857395557aa68ca8e4ac5c12a0a8427b39b01c33e27882d473c25ed69cd93","decoded":{"chain":"arbitrum","contractName":"SecurityCouncilMemberSyncAction","function":"perform","inputs":[{"name":"_securityCouncil","value":"0xADd68bCb0f66878aB9D37a447C7b9067C5dfa941"},{"name":"_updatedMembers","value":["0x3Bd8e2AC65ad6f0F094BA6766cBd9484AB49eF23","0xf8e1492255d9428c2Fc20A98A1DeB1215C8ffEfd","0xb07dc9103328A51128bC6Cc1049d1137035f5E28","0x3E286452b1C66abB08Eb5494c3894F40aB5a59AF","0xb71ca4FFbB7b58d75Ba29891ab45e9Dc12B444Ed","0x8F10e3413586c4a8DCfcE19D009872b19e9cd8E3","0x566a07C3c932aE6AF74d77c29e5c30D8B1853710","0x5280406912EB8Ec677Df66C326BE48f938DC2e44","0x0275b3D54a5dDbf8205A75984796eFE8b7357Bae","0x5A1FD562271aAC2Dadb51BAAb7760b949D9D81dF","0xf6B6F07862A02C85628B3A9688beae07fEA9C863","0x475816ca2a31D601B4e336f5c2418A67978aBf09"]},{"name":"_nonce","value":1}],"address":"0x9BF7b8884Fa381a45f8CB2525905fb36C996297a","calldata":"0x536d8944000000000000000000000000add68bcb0f66878ab9d37a447c7b9067c5dfa94100000000000000000000000000000000000000000000000000000000000000600000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000000c0000000000000000000000003bd8e2ac65ad6f0f094ba6766cbd9484ab49ef23000000000000000000000000f8e1492255d9428c2fc20a98a1deb1215c8ffefd000000000000000000000000b07dc9103328a51128bc6cc1049d1137035f5e280000000000000000000000003e286452b1c66abb08eb5494c3894f40ab5a59af000000000000000000000000b71ca4ffbb7b58d75ba29891ab45e9dc12b444ed0000000000000000000000008f10e3413586c4a8dcfce19d009872b19e9cd8e3000000000000000000000000566a07c3c932ae6af74d77c29e5c30d8b18537100000000000000000000000005280406912eb8ec677df66c326be48f938dc2e440000000000000000000000000275b3d54a5ddbf8205a75984796efe8b7357bae0000000000000000000000005a1fd562271aac2dadb51baab7760b949d9d81df000000000000000000000000f6b6f07862a02c85628b3a9688beae07fea9c863000000000000000000000000475816ca2a31d601b4e336f5c2418a67978abf09","executor":"0xCF57572261c7c2BCF21ffD220ea7d1a27D40A827","inboxOnEthereum":"0x4Dbd4fc535Ac27206064B68FfCf827b0A60BAB3f"},"raw":{"target":"0xa723C008e76E379c55599D2E4d93879BeaFDa79C","value":0,"data":"0x0000000000000000000000004dbd4fc535ac27206064b68ffcf827b0a60bab3f000000000000000000000000cf57572261c7c2bcf21ffd220ea7d1a27d40a82700000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000c000000000000000000000000000000000000000000000000000000000000002841cff79cd0000000000000000000000009bf7b8884fa381a45f8cb2525905fb36c996297a00000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000204536d8944000000000000000000000000add68bcb0f66878ab9d37a447c7b9067c5dfa94100000000000000000000000000000000000000000000000000000000000000600000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000000c0000000000000000000000003bd8e2ac65ad6f0f094ba6766cbd9484ab49ef23000000000000000000000000f8e1492255d9428c2fc20a98a1deb1215c8ffefd000000000000000000000000b07dc9103328a51128bc6cc1049d1137035f5e280000000000000000000000003e286452b1c66abb08eb5494c3894f40ab5a59af000000000000000000000000b71ca4ffbb7b58d75ba29891ab45e9dc12b444ed0000000000000000000000008f10e3413586c4a8dcfce19d009872b19e9cd8e3000000000000000000000000566a07c3c932ae6af74d77c29e5c30d8b18537100000000000000000000000005280406912eb8ec677df66c326be48f938dc2e440000000000000000000000000275b3d54a5ddbf8205a75984796efe8b7357bae0000000000000000000000005a1fd562271aac2dadb51baab7760b949d9d81df000000000000000000000000f6b6f07862a02c85628b3a9688beae07fea9c863000000000000000000000000475816ca2a31d601b4e336f5c2418a67978abf090000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000","delay":259200}},{"id":"0x492a8fccff029378b8566bdb6157123d1626cbfe2530a9b1f0ad5df688c10471","decoded":{"chain":"ethereum","contractName":"AddNovaKeysetAction","function":"perform","inputs":[],"address":"0xDef5CfE3246882BC7f65F9346a8b974BA27D3F4E","calldata":"0xb147f40c","executor":"0x3ffFbAdAF827559da092217e474760E2b2c3CeDd"},"raw":{"target":"0x3ffFbAdAF827559da092217e474760E2b2c3CeDd","value":0,"data":"0x1cff79cd000000000000000000000000def5cfe3246882bc7f65f9346a8b974ba27d3f4e00000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000004b147f40c00000000000000000000000000000000000000000000000000000000","delay":259200}},{"id":"0xbcda99fe98a7c479aafb3eb3eab0f154f9fdd169f28c11adf6eefda3bef7c04e","decoded":{"chain":"ethereum","contractName":"SetArbOneArbOS11ModuleRootAciton","function":"perform","inputs":[],"address":"0x3b70f2Da6F3b01F9a53dCBcB3e59AD3ad8bed924","calldata":"0xb147f40c","executor":"0x3ffFbAdAF827559da092217e474760E2b2c3CeDd"},"raw":{"target":"0x3ffFbAdAF827559da092217e474760E2b2c3CeDd","value":0,"data":"0x1cff79cd0000000000000000000000003b70f2da6f3b01f9a53dcbcb3e59ad3ad8bed92400000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000004b147f40c00000000000000000000000000000000000000000000000000000000","delay":259200}},{"id":"0xbcda99fe98a7c479aafb3eb3eab0f154f9fdd169f28c11adf6eefda3bef7c04e","decoded":{"chain":"ethereum","contractName":"SetNovaArbOS11ModuleRootAction","function":"perform","inputs":[],"address":"0x54c2C372943572Ac2a8E84D502ebc13F14B62246","calldata":"0xb147f40c","executor":"0x3ffFbAdAF827559da092217e474760E2b2c3CeDd"},"raw":{"target":"0x3ffFbAdAF827559da092217e474760E2b2c3CeDd","value":0,"data":"0x1cff79cd00000000000000000000000054c2c372943572ac2a8e84d502ebc13f14b6224600000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000004b147f40c00000000000000000000000000000000000000000000000000000000","delay":259200}},{"id":"0xbcda99fe98a7c479aafb3eb3eab0f154f9fdd169f28c11adf6eefda3bef7c04e","decoded":{"chain":"arbitrum","contractName":"SetArbOS11VersionAction","function":"perform","inputs":[],"address":"0xF6c7Dc6eaE78aBF2f32df899654ca425Dfa99481","calldata":"0xb147f40c","executor":"0xCF57572261c7c2BCF21ffD220ea7d1a27D40A827","inboxOnEthereum":"0x4Dbd4fc535Ac27206064B68FfCf827b0A60BAB3f"},"raw":{"target":"0xa723C008e76E379c55599D2E4d93879BeaFDa79C","value":0,"data":"0x0000000000000000000000004dbd4fc535ac27206064b68ffcf827b0a60bab3f000000000000000000000000cf57572261c7c2bcf21ffd220ea7d1a27d40a82700000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000c000000000000000000000000000000000000000000000000000000000000000841cff79cd000000000000000000000000f6c7dc6eae78abf2f32df899654ca425dfa9948100000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000004b147f40c0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000","delay":259200}},{"id":"0xbcda99fe98a7c479aafb3eb3eab0f154f9fdd169f28c11adf6eefda3bef7c04e","decoded":{"chain":"nova","address":"0x5357f4D3e8f8250A77bcddd5E58886AD1358220c","calldata":"0xb147f40c","executor":"0x86a02dD71363c440b21F4c0E5B2Ad01Ffe1A7482","inboxOnEthereum":"0xc4448b71118c9071Bcb9734A0EAc55D18A153949"},"raw":{"target":"0xa723C008e76E379c55599D2E4d93879BeaFDa79C","value":0,"data":"0x000000000000000000000000c4448b71118c9071bcb9734a0eac55d18a15394900000000000000000000000086a02dd71363c440b21f4c0e5b2ad01ffe1a748200000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000c000000000000000000000000000000000000000000000000000000000000000841cff79cd0000000000000000000000005357f4d3e8f8250a77bcddd5e58886ad1358220c00000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000004b147f40c0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000","delay":259200}},{"id":"0xe4f81d02f2581e9b7a8815af6925d3c277859994fde496629554989b7c91d254","decoded":{"chain":"arbitrum","contractName":"NomineeGovernorV2UpgradeAction","function":"perform","inputs":[],"address":"0xd9a2e0E5d7509F0BF1B2d33884F8C1b4D4490879","calldata":"0xb147f40c","executor":"0xCF57572261c7c2BCF21ffD220ea7d1a27D40A827","inboxOnEthereum":"0x4Dbd4fc535Ac27206064B68FfCf827b0A60BAB3f"},"raw":{"target":"0xa723C008e76E379c55599D2E4d93879BeaFDa79C","value":0,"data":"0x0000000000000000000000004dbd4fc535ac27206064b68ffcf827b0a60bab3f000000000000000000000000cf57572261c7c2bcf21ffd220ea7d1a27d40a82700000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000c000000000000000000000000000000000000000000000000000000000000000841cff79cd000000000000000000000000d9a2e0e5d7509f0bf1b2d33884f8c1b4d449087900000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000004b147f40c0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000","delay":259200}},{"id":"0x0b8dc4a8b99d2302c77e4eaeb1b06dd4038dd796bd8e5016dcb292018543ef91","decoded":{"chain":"ethereum","contractName":"AIPSetSequencerInboxMaxTimeVariationArbOneAction","function":"perform","inputs":[],"address":"0x3E313Eeed58E851CA3841C6109697B9eb35C7726","calldata":"0xb147f40c","executor":"0x3ffFbAdAF827559da092217e474760E2b2c3CeDd"},"raw":{"target":"0x3ffFbAdAF827559da092217e474760E2b2c3CeDd","value":0,"data":"0x1cff79cd0000000000000000000000003e313eeed58e851ca3841c6109697b9eb35c772600000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000004b147f40c00000000000000000000000000000000000000000000000000000000","delay":259200}},{"id":"0x0b8dc4a8b99d2302c77e4eaeb1b06dd4038dd796bd8e5016dcb292018543ef91","decoded":{"chain":"ethereum","contractName":"AIPSetSequencerInboxMaxTimeVariationNovaAction","function":"perform","inputs":[],"address":"0x47a85C0a118127F3968A6A1A61e2a326517540D4","calldata":"0xb147f40c","executor":"0x3ffFbAdAF827559da092217e474760E2b2c3CeDd"},"raw":{"target":"0x3ffFbAdAF827559da092217e474760E2b2c3CeDd","value":0,"data":"0x1cff79cd00000000000000000000000047a85c0a118127f3968a6a1a61e2a326517540d400000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000004b147f40c00000000000000000000000000000000000000000000000000000000","delay":259200}},{"id":"0x0b8dc4a8b99d2302c77e4eaeb1b06dd4038dd796bd8e5016dcb292018543ef91","decoded":{"chain":"ethereum","contractName":"ArbOneAIP4844Action","function":"perform","inputs":[],"address":"0x76D8e97Cd4514bebBc21d2044fF4a8d9eA1f0CC4","calldata":"0xb147f40c","executor":"0x3ffFbAdAF827559da092217e474760E2b2c3CeDd"},"raw":{"target":"0x3ffFbAdAF827559da092217e474760E2b2c3CeDd","value":0,"data":"0x1cff79cd00000000000000000000000076d8e97cd4514bebbc21d2044ff4a8d9ea1f0cc400000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000004b147f40c00000000000000000000000000000000000000000000000000000000","delay":259200}},{"id":"0x0b8dc4a8b99d2302c77e4eaeb1b06dd4038dd796bd8e5016dcb292018543ef91","decoded":{"chain":"ethereum","contractName":"ArbOneSetBatchPosterManagerAction","function":"perform","inputs":[],"address":"0xCe0aF261EB511CB41b8D0A2e31DF80BA37e265aB","calldata":"0xb147f40c","executor":"0x3ffFbAdAF827559da092217e474760E2b2c3CeDd"},"raw":{"target":"0x3ffFbAdAF827559da092217e474760E2b2c3CeDd","value":0,"data":"0x1cff79cd000000000000000000000000ce0af261eb511cb41b8d0a2e31df80ba37e265ab00000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000004b147f40c00000000000000000000000000000000000000000000000000000000","delay":259200}},{"id":"0x0b8dc4a8b99d2302c77e4eaeb1b06dd4038dd796bd8e5016dcb292018543ef91","decoded":{"chain":"ethereum","contractName":"NovaAIP4844Action","function":"perform","inputs":[],"address":"0x874356173CFd6C739aeab1F5ABfB5F3AFB3d4d33","calldata":"0xb147f40c","executor":"0x3ffFbAdAF827559da092217e474760E2b2c3CeDd"},"raw":{"target":"0x3ffFbAdAF827559da092217e474760E2b2c3CeDd","value":0,"data":"0x1cff79cd000000000000000000000000874356173cfd6c739aeab1f5abfb5f3afb3d4d3300000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000004b147f40c00000000000000000000000000000000000000000000000000000000","delay":259200}},{"id":"0x0b8dc4a8b99d2302c77e4eaeb1b06dd4038dd796bd8e5016dcb292018543ef91","decoded":{"chain":"ethereum","contractName":"NovaSetBatchPosterManagerAction","function":"perform","inputs":[],"address":"0x501f30810D2b0EaEC15Cc3785dBB29e4a8a92a70","calldata":"0xb147f40c","executor":"0x3ffFbAdAF827559da092217e474760E2b2c3CeDd"},"raw":{"target":"0x3ffFbAdAF827559da092217e474760E2b2c3CeDd","value":0,"data":"0x1cff79cd000000000000000000000000501f30810d2b0eaec15cc3785dbb29e4a8a92a7000000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000004b147f40c00000000000000000000000000000000000000000000000000000000","delay":259200}},{"id":"0x0b8dc4a8b99d2302c77e4eaeb1b06dd4038dd796bd8e5016dcb292018543ef91","decoded":{"chain":"arbitrum","contractName":"SetArbOS20VersionAction","function":"perform","inputs":[],"address":"0x3E313Eeed58E851CA3841C6109697B9eb35C7726","calldata":"0xb147f40c","executor":"0xCF57572261c7c2BCF21ffD220ea7d1a27D40A827","inboxOnEthereum":"0x4Dbd4fc535Ac27206064B68FfCf827b0A60BAB3f"},"raw":{"target":"0xa723C008e76E379c55599D2E4d93879BeaFDa79C","value":0,"data":"0x0000000000000000000000004dbd4fc535ac27206064b68ffcf827b0a60bab3f000000000000000000000000cf57572261c7c2bcf21ffd220ea7d1a27d40a82700000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000c000000000000000000000000000000000000000000000000000000000000000841cff79cd0000000000000000000000003e313eeed58e851ca3841c6109697b9eb35c772600000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000004b147f40c0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000","delay":259200}},{"id":"0x0b8dc4a8b99d2302c77e4eaeb1b06dd4038dd796bd8e5016dcb292018543ef91","decoded":{"chain":"nova","address":"0x3E313Eeed58E851CA3841C6109697B9eb35C7726","calldata":"0xb147f40c","executor":"0x86a02dD71363c440b21F4c0E5B2Ad01Ffe1A7482","inboxOnEthereum":"0xc4448b71118c9071Bcb9734A0EAc55D18A153949"},"raw":{"target":"0xa723C008e76E379c55599D2E4d93879BeaFDa79C","value":0,"data":"0x000000000000000000000000c4448b71118c9071bcb9734a0eac55d18a15394900000000000000000000000086a02dd71363c440b21f4c0e5b2ad01ffe1a748200000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000c000000000000000000000000000000000000000000000000000000000000000841cff79cd0000000000000000000000003e313eeed58e851ca3841c6109697b9eb35c772600000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000004b147f40c0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000","delay":259200}},{"id":"0xdda98e62c0827b0ea976efa9fa7eab4086f6ecc5aa6715e02868bb2972b12cad","decoded":{"chain":"arbitrum","contractName":"ArbOneSetAtlasL1PricingRewardAction","function":"perform","inputs":[],"address":"0x36D0170D92F66e8949eB276C3AC4FEA64f83704d","calldata":"0xb147f40c","executor":"0xCF57572261c7c2BCF21ffD220ea7d1a27D40A827","inboxOnEthereum":"0x4Dbd4fc535Ac27206064B68FfCf827b0A60BAB3f"},"raw":{"target":"0xa723C008e76E379c55599D2E4d93879BeaFDa79C","value":0,"data":"0x0000000000000000000000004dbd4fc535ac27206064b68ffcf827b0a60bab3f000000000000000000000000cf57572261c7c2bcf21ffd220ea7d1a27d40a82700000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000c000000000000000000000000000000000000000000000000000000000000000841cff79cd00000000000000000000000036d0170d92f66e8949eb276c3ac4fea64f83704d00000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000004b147f40c0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000","delay":259200}},{"id":"0xdda98e62c0827b0ea976efa9fa7eab4086f6ecc5aa6715e02868bb2972b12cad","decoded":{"chain":"arbitrum","contractName":"ArbOneSetAtlasMinBaseFeeAction","function":"perform","inputs":[],"address":"0x849E360a247132F961c9CBE95Ba39106c72e1268","calldata":"0xb147f40c","executor":"0xCF57572261c7c2BCF21ffD220ea7d1a27D40A827","inboxOnEthereum":"0x4Dbd4fc535Ac27206064B68FfCf827b0A60BAB3f"},"raw":{"target":"0xa723C008e76E379c55599D2E4d93879BeaFDa79C","value":0,"data":"0x0000000000000000000000004dbd4fc535ac27206064b68ffcf827b0a60bab3f000000000000000000000000cf57572261c7c2bcf21ffd220ea7d1a27d40a82700000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000c000000000000000000000000000000000000000000000000000000000000000841cff79cd000000000000000000000000849e360a247132f961c9cbe95ba39106c72e126800000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000004b147f40c0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000","delay":259200}},{"id":"0xd1eea9e87f3c665209dcd7f963295df40e79119668d6417794d36891994a3bad","decoded":{"chain":"ethereum","contractName":"SecurityCouncilMemberSyncAction","function":"perform","inputs":[{"name":"_securityCouncil","value":"0xF06E95eF589D9c38af242a8AAee8375f14023F85"},{"name":"_updatedMembers","value":["0x3Bd8e2AC65ad6f0F094BA6766cBd9484AB49eF23","0xf8e1492255d9428c2Fc20A98A1DeB1215C8ffEfd","0xb07dc9103328A51128bC6Cc1049d1137035f5E28","0x3E286452b1C66abB08Eb5494c3894F40aB5a59AF","0xb71ca4FFbB7b58d75Ba29891ab45e9Dc12B444Ed","0x8F10e3413586c4a8DCfcE19D009872b19e9cd8E3","0xe40D80Bd58CEE55DCC2598724d7F1e03E206581D","0xB3b60932E598fe946169EC209A197184Bad760B7","0xee7Fb91D5b776C326a728dc70e917F82d6809E3C","0x475816ca2a31D601B4e336f5c2418A67978aBf09","0xa0683d725420e2F75415806352Cd9c3fE10Fa960","0x0275b3D54a5dDbf8205A75984796eFE8b7357Bae"]},{"name":"_nonce","value":2}],"address":"0x9BF7b8884Fa381a45f8CB2525905fb36C996297a","calldata":"0x536d8944000000000000000000000000f06e95ef589d9c38af242a8aaee8375f14023f8500000000000000000000000000000000000000000000000000000000000000600000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000000c0000000000000000000000003bd8e2ac65ad6f0f094ba6766cbd9484ab49ef23000000000000000000000000f8e1492255d9428c2fc20a98a1deb1215c8ffefd000000000000000000000000b07dc9103328a51128bc6cc1049d1137035f5e280000000000000000000000003e286452b1c66abb08eb5494c3894f40ab5a59af000000000000000000000000b71ca4ffbb7b58d75ba29891ab45e9dc12b444ed0000000000000000000000008f10e3413586c4a8dcfce19d009872b19e9cd8e3000000000000000000000000e40d80bd58cee55dcc2598724d7f1e03e206581d000000000000000000000000b3b60932e598fe946169ec209a197184bad760b7000000000000000000000000ee7fb91d5b776c326a728dc70e917f82d6809e3c000000000000000000000000475816ca2a31d601b4e336f5c2418a67978abf09000000000000000000000000a0683d725420e2f75415806352cd9c3fe10fa9600000000000000000000000000275b3d54a5ddbf8205a75984796efe8b7357bae","executor":"0x3ffFbAdAF827559da092217e474760E2b2c3CeDd"},"raw":{"target":"0x3ffFbAdAF827559da092217e474760E2b2c3CeDd","value":0,"data":"0x1cff79cd0000000000000000000000009bf7b8884fa381a45f8cb2525905fb36c996297a00000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000204536d8944000000000000000000000000f06e95ef589d9c38af242a8aaee8375f14023f8500000000000000000000000000000000000000000000000000000000000000600000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000000c0000000000000000000000003bd8e2ac65ad6f0f094ba6766cbd9484ab49ef23000000000000000000000000f8e1492255d9428c2fc20a98a1deb1215c8ffefd000000000000000000000000b07dc9103328a51128bc6cc1049d1137035f5e280000000000000000000000003e286452b1c66abb08eb5494c3894f40ab5a59af000000000000000000000000b71ca4ffbb7b58d75ba29891ab45e9dc12b444ed0000000000000000000000008f10e3413586c4a8dcfce19d009872b19e9cd8e3000000000000000000000000e40d80bd58cee55dcc2598724d7f1e03e206581d000000000000000000000000b3b60932e598fe946169ec209a197184bad760b7000000000000000000000000ee7fb91d5b776c326a728dc70e917f82d6809e3c000000000000000000000000475816ca2a31d601b4e336f5c2418a67978abf09000000000000000000000000a0683d725420e2f75415806352cd9c3fe10fa9600000000000000000000000000275b3d54a5ddbf8205a75984796efe8b7357bae00000000000000000000000000000000000000000000000000000000","delay":259200}},{"id":"0xd1eea9e87f3c665209dcd7f963295df40e79119668d6417794d36891994a3bad","decoded":{"chain":"arbitrum","contractName":"SecurityCouncilMemberSyncAction","function":"perform","inputs":[{"name":"_securityCouncil","value":"0x423552c0F05baCCac5Bfa91C6dCF1dc53a0A1641"},{"name":"_updatedMembers","value":["0x3Bd8e2AC65ad6f0F094BA6766cBd9484AB49eF23","0xf8e1492255d9428c2Fc20A98A1DeB1215C8ffEfd","0xb07dc9103328A51128bC6Cc1049d1137035f5E28","0x3E286452b1C66abB08Eb5494c3894F40aB5a59AF","0xb71ca4FFbB7b58d75Ba29891ab45e9Dc12B444Ed","0x8F10e3413586c4a8DCfcE19D009872b19e9cd8E3","0xe40D80Bd58CEE55DCC2598724d7F1e03E206581D","0xB3b60932E598fe946169EC209A197184Bad760B7","0xee7Fb91D5b776C326a728dc70e917F82d6809E3C","0x475816ca2a31D601B4e336f5c2418A67978aBf09","0xa0683d725420e2F75415806352Cd9c3fE10Fa960","0x0275b3D54a5dDbf8205A75984796eFE8b7357Bae"]},{"name":"_nonce","value":2}],"address":"0x9BF7b8884Fa381a45f8CB2525905fb36C996297a","calldata":"0x536d8944000000000000000000000000423552c0f05baccac5bfa91c6dcf1dc53a0a164100000000000000000000000000000000000000000000000000000000000000600000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000000c0000000000000000000000003bd8e2ac65ad6f0f094ba6766cbd9484ab49ef23000000000000000000000000f8e1492255d9428c2fc20a98a1deb1215c8ffefd000000000000000000000000b07dc9103328a51128bc6cc1049d1137035f5e280000000000000000000000003e286452b1c66abb08eb5494c3894f40ab5a59af000000000000000000000000b71ca4ffbb7b58d75ba29891ab45e9dc12b444ed0000000000000000000000008f10e3413586c4a8dcfce19d009872b19e9cd8e3000000000000000000000000e40d80bd58cee55dcc2598724d7f1e03e206581d000000000000000000000000b3b60932e598fe946169ec209a197184bad760b7000000000000000000000000ee7fb91d5b776c326a728dc70e917f82d6809e3c000000000000000000000000475816ca2a31d601b4e336f5c2418a67978abf09000000000000000000000000a0683d725420e2f75415806352cd9c3fe10fa9600000000000000000000000000275b3d54a5ddbf8205a75984796efe8b7357bae","executor":"0xCF57572261c7c2BCF21ffD220ea7d1a27D40A827","inboxOnEthereum":"0x4Dbd4fc535Ac27206064B68FfCf827b0A60BAB3f"},"raw":{"target":"0xa723C008e76E379c55599D2E4d93879BeaFDa79C","value":0,"data":"0x0000000000000000000000004dbd4fc535ac27206064b68ffcf827b0a60bab3f000000000000000000000000cf57572261c7c2bcf21ffd220ea7d1a27d40a82700000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000c000000000000000000000000000000000000000000000000000000000000002841cff79cd0000000000000000000000009bf7b8884fa381a45f8cb2525905fb36c996297a00000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000204536d8944000000000000000000000000423552c0f05baccac5bfa91c6dcf1dc53a0a164100000000000000000000000000000000000000000000000000000000000000600000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000000c0000000000000000000000003bd8e2ac65ad6f0f094ba6766cbd9484ab49ef23000000000000000000000000f8e1492255d9428c2fc20a98a1deb1215c8ffefd000000000000000000000000b07dc9103328a51128bc6cc1049d1137035f5e280000000000000000000000003e286452b1c66abb08eb5494c3894f40ab5a59af000000000000000000000000b71ca4ffbb7b58d75ba29891ab45e9dc12b444ed0000000000000000000000008f10e3413586c4a8dcfce19d009872b19e9cd8e3000000000000000000000000e40d80bd58cee55dcc2598724d7f1e03e206581d000000000000000000000000b3b60932e598fe946169ec209a197184bad760b7000000000000000000000000ee7fb91d5b776c326a728dc70e917f82d6809e3c000000000000000000000000475816ca2a31d601b4e336f5c2418a67978abf09000000000000000000000000a0683d725420e2f75415806352cd9c3fe10fa9600000000000000000000000000275b3d54a5ddbf8205a75984796efe8b7357bae0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000","delay":259200}},{"id":"0xd1eea9e87f3c665209dcd7f963295df40e79119668d6417794d36891994a3bad","decoded":{"chain":"nova","address":"0x9BF7b8884Fa381a45f8CB2525905fb36C996297a","calldata":"0x536d8944000000000000000000000000c232ee726e3c51b86778bb4dbe61c52cc07a60f300000000000000000000000000000000000000000000000000000000000000600000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000000c0000000000000000000000003bd8e2ac65ad6f0f094ba6766cbd9484ab49ef23000000000000000000000000f8e1492255d9428c2fc20a98a1deb1215c8ffefd000000000000000000000000b07dc9103328a51128bc6cc1049d1137035f5e280000000000000000000000003e286452b1c66abb08eb5494c3894f40ab5a59af000000000000000000000000b71ca4ffbb7b58d75ba29891ab45e9dc12b444ed0000000000000000000000008f10e3413586c4a8dcfce19d009872b19e9cd8e3000000000000000000000000e40d80bd58cee55dcc2598724d7f1e03e206581d000000000000000000000000b3b60932e598fe946169ec209a197184bad760b7000000000000000000000000ee7fb91d5b776c326a728dc70e917f82d6809e3c000000000000000000000000475816ca2a31d601b4e336f5c2418a67978abf09000000000000000000000000a0683d725420e2f75415806352cd9c3fe10fa9600000000000000000000000000275b3d54a5ddbf8205a75984796efe8b7357bae","executor":"0x86a02dD71363c440b21F4c0E5B2Ad01Ffe1A7482","inboxOnEthereum":"0xc4448b71118c9071Bcb9734A0EAc55D18A153949"},"raw":{"target":"0xa723C008e76E379c55599D2E4d93879BeaFDa79C","value":0,"data":"0x000000000000000000000000c4448b71118c9071bcb9734a0eac55d18a15394900000000000000000000000086a02dd71363c440b21f4c0e5b2ad01ffe1a748200000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000c000000000000000000000000000000000000000000000000000000000000002841cff79cd0000000000000000000000009bf7b8884fa381a45f8cb2525905fb36c996297a00000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000204536d8944000000000000000000000000c232ee726e3c51b86778bb4dbe61c52cc07a60f300000000000000000000000000000000000000000000000000000000000000600000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000000c0000000000000000000000003bd8e2ac65ad6f0f094ba6766cbd9484ab49ef23000000000000000000000000f8e1492255d9428c2fc20a98a1deb1215c8ffefd000000000000000000000000b07dc9103328a51128bc6cc1049d1137035f5e280000000000000000000000003e286452b1c66abb08eb5494c3894f40ab5a59af000000000000000000000000b71ca4ffbb7b58d75ba29891ab45e9dc12b444ed0000000000000000000000008f10e3413586c4a8dcfce19d009872b19e9cd8e3000000000000000000000000e40d80bd58cee55dcc2598724d7f1e03e206581d000000000000000000000000b3b60932e598fe946169ec209a197184bad760b7000000000000000000000000ee7fb91d5b776c326a728dc70e917f82d6809e3c000000000000000000000000475816ca2a31d601b4e336f5c2418a67978abf09000000000000000000000000a0683d725420e2f75415806352cd9c3fe10fa9600000000000000000000000000275b3d54a5ddbf8205a75984796efe8b7357bae0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000","delay":259200}},{"id":"0xd1eea9e87f3c665209dcd7f963295df40e79119668d6417794d36891994a3bad","decoded":{"chain":"arbitrum","contractName":"SecurityCouncilMemberSyncAction","function":"perform","inputs":[{"name":"_securityCouncil","value":"0xADd68bCb0f66878aB9D37a447C7b9067C5dfa941"},{"name":"_updatedMembers","value":["0x3Bd8e2AC65ad6f0F094BA6766cBd9484AB49eF23","0xf8e1492255d9428c2Fc20A98A1DeB1215C8ffEfd","0xb07dc9103328A51128bC6Cc1049d1137035f5E28","0x3E286452b1C66abB08Eb5494c3894F40aB5a59AF","0xb71ca4FFbB7b58d75Ba29891ab45e9Dc12B444Ed","0x8F10e3413586c4a8DCfcE19D009872b19e9cd8E3","0xe40D80Bd58CEE55DCC2598724d7F1e03E206581D","0xB3b60932E598fe946169EC209A197184Bad760B7","0xee7Fb91D5b776C326a728dc70e917F82d6809E3C","0x475816ca2a31D601B4e336f5c2418A67978aBf09","0xa0683d725420e2F75415806352Cd9c3fE10Fa960","0x0275b3D54a5dDbf8205A75984796eFE8b7357Bae"]},{"name":"_nonce","value":2}],"address":"0x9BF7b8884Fa381a45f8CB2525905fb36C996297a","calldata":"0x536d8944000000000000000000000000add68bcb0f66878ab9d37a447c7b9067c5dfa94100000000000000000000000000000000000000000000000000000000000000600000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000000c0000000000000000000000003bd8e2ac65ad6f0f094ba6766cbd9484ab49ef23000000000000000000000000f8e1492255d9428c2fc20a98a1deb1215c8ffefd000000000000000000000000b07dc9103328a51128bc6cc1049d1137035f5e280000000000000000000000003e286452b1c66abb08eb5494c3894f40ab5a59af000000000000000000000000b71ca4ffbb7b58d75ba29891ab45e9dc12b444ed0000000000000000000000008f10e3413586c4a8dcfce19d009872b19e9cd8e3000000000000000000000000e40d80bd58cee55dcc2598724d7f1e03e206581d000000000000000000000000b3b60932e598fe946169ec209a197184bad760b7000000000000000000000000ee7fb91d5b776c326a728dc70e917f82d6809e3c000000000000000000000000475816ca2a31d601b4e336f5c2418a67978abf09000000000000000000000000a0683d725420e2f75415806352cd9c3fe10fa9600000000000000000000000000275b3d54a5ddbf8205a75984796efe8b7357bae","executor":"0xCF57572261c7c2BCF21ffD220ea7d1a27D40A827","inboxOnEthereum":"0x4Dbd4fc535Ac27206064B68FfCf827b0A60BAB3f"},"raw":{"target":"0xa723C008e76E379c55599D2E4d93879BeaFDa79C","value":0,"data":"0x0000000000000000000000004dbd4fc535ac27206064b68ffcf827b0a60bab3f000000000000000000000000cf57572261c7c2bcf21ffd220ea7d1a27d40a82700000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000c000000000000000000000000000000000000000000000000000000000000002841cff79cd0000000000000000000000009bf7b8884fa381a45f8cb2525905fb36c996297a00000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000204536d8944000000000000000000000000add68bcb0f66878ab9d37a447c7b9067c5dfa94100000000000000000000000000000000000000000000000000000000000000600000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000000c0000000000000000000000003bd8e2ac65ad6f0f094ba6766cbd9484ab49ef23000000000000000000000000f8e1492255d9428c2fc20a98a1deb1215c8ffefd000000000000000000000000b07dc9103328a51128bc6cc1049d1137035f5e280000000000000000000000003e286452b1c66abb08eb5494c3894f40ab5a59af000000000000000000000000b71ca4ffbb7b58d75ba29891ab45e9dc12b444ed0000000000000000000000008f10e3413586c4a8dcfce19d009872b19e9cd8e3000000000000000000000000e40d80bd58cee55dcc2598724d7f1e03e206581d000000000000000000000000b3b60932e598fe946169ec209a197184bad760b7000000000000000000000000ee7fb91d5b776c326a728dc70e917f82d6809e3c000000000000000000000000475816ca2a31d601b4e336f5c2418a67978abf09000000000000000000000000a0683d725420e2f75415806352cd9c3fe10fa9600000000000000000000000000275b3d54a5ddbf8205a75984796efe8b7357bae0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000","delay":259200}},{"id":"0x1f8af0aacf32f1bedd2ad0a5527055a13adcb894deeeb123c9495811dac3f5d9","decoded":{"chain":"arbitrum","contractName":"AIPIncreaseNonEmergencySCThresholdAction","function":"perform","inputs":[],"address":"0x25afB879bb5364cB3f7e0b607AD280C0F52B0D82","calldata":"0xb147f40c","executor":"0xCF57572261c7c2BCF21ffD220ea7d1a27D40A827","inboxOnEthereum":"0x4Dbd4fc535Ac27206064B68FfCf827b0A60BAB3f"},"raw":{"target":"0xa723C008e76E379c55599D2E4d93879BeaFDa79C","value":0,"data":"0x0000000000000000000000004dbd4fc535ac27206064b68ffcf827b0a60bab3f000000000000000000000000cf57572261c7c2bcf21ffd220ea7d1a27d40a82700000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000c000000000000000000000000000000000000000000000000000000000000000841cff79cd00000000000000000000000025afb879bb5364cb3f7e0b607ad280c0f52b0d8200000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000004b147f40c0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000","delay":259200}},{"id":"0xb12265ee4fd64bcd070e991a40b4200f82114e2d238d0a5f2e37c8acb6c25f1d","decoded":{"chain":"arbitrum","contractName":"SwitchManagerRolesAction","function":"perform","inputs":[],"address":"0x29f3c6b8c98488FBAE0677AB3d2Eb29c77D6aD8a","calldata":"0xb147f40c","executor":"0xCF57572261c7c2BCF21ffD220ea7d1a27D40A827","inboxOnEthereum":"0x4Dbd4fc535Ac27206064B68FfCf827b0A60BAB3f"},"raw":{"target":"0xa723C008e76E379c55599D2E4d93879BeaFDa79C","value":0,"data":"0x0000000000000000000000004dbd4fc535ac27206064b68ffcf827b0a60bab3f000000000000000000000000cf57572261c7c2bcf21ffd220ea7d1a27d40a82700000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000c000000000000000000000000000000000000000000000000000000000000000841cff79cd00000000000000000000000029f3c6b8c98488fbae0677ab3d2eb29c77d6ad8a00000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000004b147f40c0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000","delay":259200}},{"id":"0x2262aecef1f65c9daa1f3116b89433b6181e93d53cbdc5b11d0fc0e29dfbfeb8","decoded":{"chain":"ethereum","contractName":"SecurityCouncilMemberSyncAction","function":"perform","inputs":[{"name":"_securityCouncil","value":"0xF06E95eF589D9c38af242a8AAee8375f14023F85"},{"name":"_updatedMembers","value":["0x3Bd8e2AC65ad6f0F094BA6766cBd9484AB49eF23","0xf8e1492255d9428c2Fc20A98A1DeB1215C8ffEfd","0xb07dc9103328A51128bC6Cc1049d1137035f5E28","0x3E286452b1C66abB08Eb5494c3894F40aB5a59AF","0xb71ca4FFbB7b58d75Ba29891ab45e9Dc12B444Ed","0x8F10e3413586c4a8DCfcE19D009872b19e9cd8E3","0x0275b3D54a5dDbf8205A75984796eFE8b7357Bae","0x5DD2205C3aac13E592F0a3D85188c948D1781df1","0x5a09A94eE8198D3c474d723337aa58023810022C","0x475816ca2a31D601B4e336f5c2418A67978aBf09","0xA821c8c245d1F3A257e3B0DEC99268cA05144422","0x70C006fC86A392c16D7E085cefc0Ad1FF7de6C75"]},{"name":"_nonce","value":6}],"address":"0x9BF7b8884Fa381a45f8CB2525905fb36C996297a","calldata":"0x536d8944000000000000000000000000f06e95ef589d9c38af242a8aaee8375f14023f8500000000000000000000000000000000000000000000000000000000000000600000000000000000000000000000000000000000000000000000000000000006000000000000000000000000000000000000000000000000000000000000000c0000000000000000000000003bd8e2ac65ad6f0f094ba6766cbd9484ab49ef23000000000000000000000000f8e1492255d9428c2fc20a98a1deb1215c8ffefd000000000000000000000000b07dc9103328a51128bc6cc1049d1137035f5e280000000000000000000000003e286452b1c66abb08eb5494c3894f40ab5a59af000000000000000000000000b71ca4ffbb7b58d75ba29891ab45e9dc12b444ed0000000000000000000000008f10e3413586c4a8dcfce19d009872b19e9cd8e30000000000000000000000000275b3d54a5ddbf8205a75984796efe8b7357bae0000000000000000000000005dd2205c3aac13e592f0a3d85188c948d1781df10000000000000000000000005a09a94ee8198d3c474d723337aa58023810022c000000000000000000000000475816ca2a31d601b4e336f5c2418a67978abf09000000000000000000000000a821c8c245d1f3a257e3b0dec99268ca0514442200000000000000000000000070c006fc86a392c16d7e085cefc0ad1ff7de6c75","executor":"0x3ffFbAdAF827559da092217e474760E2b2c3CeDd"},"raw":{"target":"0x3ffFbAdAF827559da092217e474760E2b2c3CeDd","value":0,"data":"0x1cff79cd0000000000000000000000009bf7b8884fa381a45f8cb2525905fb36c996297a00000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000204536d8944000000000000000000000000f06e95ef589d9c38af242a8aaee8375f14023f8500000000000000000000000000000000000000000000000000000000000000600000000000000000000000000000000000000000000000000000000000000006000000000000000000000000000000000000000000000000000000000000000c0000000000000000000000003bd8e2ac65ad6f0f094ba6766cbd9484ab49ef23000000000000000000000000f8e1492255d9428c2fc20a98a1deb1215c8ffefd000000000000000000000000b07dc9103328a51128bc6cc1049d1137035f5e280000000000000000000000003e286452b1c66abb08eb5494c3894f40ab5a59af000000000000000000000000b71ca4ffbb7b58d75ba29891ab45e9dc12b444ed0000000000000000000000008f10e3413586c4a8dcfce19d009872b19e9cd8e30000000000000000000000000275b3d54a5ddbf8205a75984796efe8b7357bae0000000000000000000000005dd2205c3aac13e592f0a3d85188c948d1781df10000000000000000000000005a09a94ee8198d3c474d723337aa58023810022c000000000000000000000000475816ca2a31d601b4e336f5c2418a67978abf09000000000000000000000000a821c8c245d1f3a257e3b0dec99268ca0514442200000000000000000000000070c006fc86a392c16d7e085cefc0ad1ff7de6c7500000000000000000000000000000000000000000000000000000000","delay":259200}},{"id":"0x2262aecef1f65c9daa1f3116b89433b6181e93d53cbdc5b11d0fc0e29dfbfeb8","decoded":{"chain":"arbitrum","contractName":"SecurityCouncilMemberSyncAction","function":"perform","inputs":[{"name":"_securityCouncil","value":"0x423552c0F05baCCac5Bfa91C6dCF1dc53a0A1641"},{"name":"_updatedMembers","value":["0x3Bd8e2AC65ad6f0F094BA6766cBd9484AB49eF23","0xf8e1492255d9428c2Fc20A98A1DeB1215C8ffEfd","0xb07dc9103328A51128bC6Cc1049d1137035f5E28","0x3E286452b1C66abB08Eb5494c3894F40aB5a59AF","0xb71ca4FFbB7b58d75Ba29891ab45e9Dc12B444Ed","0x8F10e3413586c4a8DCfcE19D009872b19e9cd8E3","0x0275b3D54a5dDbf8205A75984796eFE8b7357Bae","0x5DD2205C3aac13E592F0a3D85188c948D1781df1","0x5a09A94eE8198D3c474d723337aa58023810022C","0x475816ca2a31D601B4e336f5c2418A67978aBf09","0xA821c8c245d1F3A257e3B0DEC99268cA05144422","0x70C006fC86A392c16D7E085cefc0Ad1FF7de6C75"]},{"name":"_nonce","value":6}],"address":"0x9BF7b8884Fa381a45f8CB2525905fb36C996297a","calldata":"0x536d8944000000000000000000000000423552c0f05baccac5bfa91c6dcf1dc53a0a164100000000000000000000000000000000000000000000000000000000000000600000000000000000000000000000000000000000000000000000000000000006000000000000000000000000000000000000000000000000000000000000000c0000000000000000000000003bd8e2ac65ad6f0f094ba6766cbd9484ab49ef23000000000000000000000000f8e1492255d9428c2fc20a98a1deb1215c8ffefd000000000000000000000000b07dc9103328a51128bc6cc1049d1137035f5e280000000000000000000000003e286452b1c66abb08eb5494c3894f40ab5a59af000000000000000000000000b71ca4ffbb7b58d75ba29891ab45e9dc12b444ed0000000000000000000000008f10e3413586c4a8dcfce19d009872b19e9cd8e30000000000000000000000000275b3d54a5ddbf8205a75984796efe8b7357bae0000000000000000000000005dd2205c3aac13e592f0a3d85188c948d1781df10000000000000000000000005a09a94ee8198d3c474d723337aa58023810022c000000000000000000000000475816ca2a31d601b4e336f5c2418a67978abf09000000000000000000000000a821c8c245d1f3a257e3b0dec99268ca0514442200000000000000000000000070c006fc86a392c16d7e085cefc0ad1ff7de6c75","executor":"0xCF57572261c7c2BCF21ffD220ea7d1a27D40A827","inboxOnEthereum":"0x4Dbd4fc535Ac27206064B68FfCf827b0A60BAB3f"},"raw":{"target":"0xa723C008e76E379c55599D2E4d93879BeaFDa79C","value":0,"data":"0x0000000000000000000000004dbd4fc535ac27206064b68ffcf827b0a60bab3f000000000000000000000000cf57572261c7c2bcf21ffd220ea7d1a27d40a82700000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000c000000000000000000000000000000000000000000000000000000000000002841cff79cd0000000000000000000000009bf7b8884fa381a45f8cb2525905fb36c996297a00000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000204536d8944000000000000000000000000423552c0f05baccac5bfa91c6dcf1dc53a0a164100000000000000000000000000000000000000000000000000000000000000600000000000000000000000000000000000000000000000000000000000000006000000000000000000000000000000000000000000000000000000000000000c0000000000000000000000003bd8e2ac65ad6f0f094ba6766cbd9484ab49ef23000000000000000000000000f8e1492255d9428c2fc20a98a1deb1215c8ffefd000000000000000000000000b07dc9103328a51128bc6cc1049d1137035f5e280000000000000000000000003e286452b1c66abb08eb5494c3894f40ab5a59af000000000000000000000000b71ca4ffbb7b58d75ba29891ab45e9dc12b444ed0000000000000000000000008f10e3413586c4a8dcfce19d009872b19e9cd8e30000000000000000000000000275b3d54a5ddbf8205a75984796efe8b7357bae0000000000000000000000005dd2205c3aac13e592f0a3d85188c948d1781df10000000000000000000000005a09a94ee8198d3c474d723337aa58023810022c000000000000000000000000475816ca2a31d601b4e336f5c2418a67978abf09000000000000000000000000a821c8c245d1f3a257e3b0dec99268ca0514442200000000000000000000000070c006fc86a392c16d7e085cefc0ad1ff7de6c750000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000","delay":259200}},{"id":"0x2262aecef1f65c9daa1f3116b89433b6181e93d53cbdc5b11d0fc0e29dfbfeb8","decoded":{"chain":"nova","address":"0x9BF7b8884Fa381a45f8CB2525905fb36C996297a","calldata":"0x536d8944000000000000000000000000c232ee726e3c51b86778bb4dbe61c52cc07a60f300000000000000000000000000000000000000000000000000000000000000600000000000000000000000000000000000000000000000000000000000000006000000000000000000000000000000000000000000000000000000000000000c0000000000000000000000003bd8e2ac65ad6f0f094ba6766cbd9484ab49ef23000000000000000000000000f8e1492255d9428c2fc20a98a1deb1215c8ffefd000000000000000000000000b07dc9103328a51128bc6cc1049d1137035f5e280000000000000000000000003e286452b1c66abb08eb5494c3894f40ab5a59af000000000000000000000000b71ca4ffbb7b58d75ba29891ab45e9dc12b444ed0000000000000000000000008f10e3413586c4a8dcfce19d009872b19e9cd8e30000000000000000000000000275b3d54a5ddbf8205a75984796efe8b7357bae0000000000000000000000005dd2205c3aac13e592f0a3d85188c948d1781df10000000000000000000000005a09a94ee8198d3c474d723337aa58023810022c000000000000000000000000475816ca2a31d601b4e336f5c2418a67978abf09000000000000000000000000a821c8c245d1f3a257e3b0dec99268ca0514442200000000000000000000000070c006fc86a392c16d7e085cefc0ad1ff7de6c75","executor":"0x86a02dD71363c440b21F4c0E5B2Ad01Ffe1A7482","inboxOnEthereum":"0xc4448b71118c9071Bcb9734A0EAc55D18A153949"},"raw":{"target":"0xa723C008e76E379c55599D2E4d93879BeaFDa79C","value":0,"data":"0x000000000000000000000000c4448b71118c9071bcb9734a0eac55d18a15394900000000000000000000000086a02dd71363c440b21f4c0e5b2ad01ffe1a748200000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000c000000000000000000000000000000000000000000000000000000000000002841cff79cd0000000000000000000000009bf7b8884fa381a45f8cb2525905fb36c996297a00000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000204536d8944000000000000000000000000c232ee726e3c51b86778bb4dbe61c52cc07a60f300000000000000000000000000000000000000000000000000000000000000600000000000000000000000000000000000000000000000000000000000000006000000000000000000000000000000000000000000000000000000000000000c0000000000000000000000003bd8e2ac65ad6f0f094ba6766cbd9484ab49ef23000000000000000000000000f8e1492255d9428c2fc20a98a1deb1215c8ffefd000000000000000000000000b07dc9103328a51128bc6cc1049d1137035f5e280000000000000000000000003e286452b1c66abb08eb5494c3894f40ab5a59af000000000000000000000000b71ca4ffbb7b58d75ba29891ab45e9dc12b444ed0000000000000000000000008f10e3413586c4a8dcfce19d009872b19e9cd8e30000000000000000000000000275b3d54a5ddbf8205a75984796efe8b7357bae0000000000000000000000005dd2205c3aac13e592f0a3d85188c948d1781df10000000000000000000000005a09a94ee8198d3c474d723337aa58023810022c000000000000000000000000475816ca2a31d601b4e336f5c2418a67978abf09000000000000000000000000a821c8c245d1f3a257e3b0dec99268ca0514442200000000000000000000000070c006fc86a392c16d7e085cefc0ad1ff7de6c750000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000","delay":259200}},{"id":"0x2262aecef1f65c9daa1f3116b89433b6181e93d53cbdc5b11d0fc0e29dfbfeb8","decoded":{"chain":"arbitrum","contractName":"SecurityCouncilMemberSyncAction","function":"perform","inputs":[{"name":"_securityCouncil","value":"0xADd68bCb0f66878aB9D37a447C7b9067C5dfa941"},{"name":"_updatedMembers","value":["0x3Bd8e2AC65ad6f0F094BA6766cBd9484AB49eF23","0xf8e1492255d9428c2Fc20A98A1DeB1215C8ffEfd","0xb07dc9103328A51128bC6Cc1049d1137035f5E28","0x3E286452b1C66abB08Eb5494c3894F40aB5a59AF","0xb71ca4FFbB7b58d75Ba29891ab45e9Dc12B444Ed","0x8F10e3413586c4a8DCfcE19D009872b19e9cd8E3","0x0275b3D54a5dDbf8205A75984796eFE8b7357Bae","0x5DD2205C3aac13E592F0a3D85188c948D1781df1","0x5a09A94eE8198D3c474d723337aa58023810022C","0x475816ca2a31D601B4e336f5c2418A67978aBf09","0xA821c8c245d1F3A257e3B0DEC99268cA05144422","0x70C006fC86A392c16D7E085cefc0Ad1FF7de6C75"]},{"name":"_nonce","value":6}],"address":"0x9BF7b8884Fa381a45f8CB2525905fb36C996297a","calldata":"0x536d8944000000000000000000000000add68bcb0f66878ab9d37a447c7b9067c5dfa94100000000000000000000000000000000000000000000000000000000000000600000000000000000000000000000000000000000000000000000000000000006000000000000000000000000000000000000000000000000000000000000000c0000000000000000000000003bd8e2ac65ad6f0f094ba6766cbd9484ab49ef23000000000000000000000000f8e1492255d9428c2fc20a98a1deb1215c8ffefd000000000000000000000000b07dc9103328a51128bc6cc1049d1137035f5e280000000000000000000000003e286452b1c66abb08eb5494c3894f40ab5a59af000000000000000000000000b71ca4ffbb7b58d75ba29891ab45e9dc12b444ed0000000000000000000000008f10e3413586c4a8dcfce19d009872b19e9cd8e30000000000000000000000000275b3d54a5ddbf8205a75984796efe8b7357bae0000000000000000000000005dd2205c3aac13e592f0a3d85188c948d1781df10000000000000000000000005a09a94ee8198d3c474d723337aa58023810022c000000000000000000000000475816ca2a31d601b4e336f5c2418a67978abf09000000000000000000000000a821c8c245d1f3a257e3b0dec99268ca0514442200000000000000000000000070c006fc86a392c16d7e085cefc0ad1ff7de6c75","executor":"0xCF57572261c7c2BCF21ffD220ea7d1a27D40A827","inboxOnEthereum":"0x4Dbd4fc535Ac27206064B68FfCf827b0A60BAB3f"},"raw":{"target":"0xa723C008e76E379c55599D2E4d93879BeaFDa79C","value":0,"data":"0x0000000000000000000000004dbd4fc535ac27206064b68ffcf827b0a60bab3f000000000000000000000000cf57572261c7c2bcf21ffd220ea7d1a27d40a82700000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000c000000000000000000000000000000000000000000000000000000000000002841cff79cd0000000000000000000000009bf7b8884fa381a45f8cb2525905fb36c996297a00000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000204536d8944000000000000000000000000add68bcb0f66878ab9d37a447c7b9067c5dfa94100000000000000000000000000000000000000000000000000000000000000600000000000000000000000000000000000000000000000000000000000000006000000000000000000000000000000000000000000000000000000000000000c0000000000000000000000003bd8e2ac65ad6f0f094ba6766cbd9484ab49ef23000000000000000000000000f8e1492255d9428c2fc20a98a1deb1215c8ffefd000000000000000000000000b07dc9103328a51128bc6cc1049d1137035f5e280000000000000000000000003e286452b1c66abb08eb5494c3894f40ab5a59af000000000000000000000000b71ca4ffbb7b58d75ba29891ab45e9dc12b444ed0000000000000000000000008f10e3413586c4a8dcfce19d009872b19e9cd8e30000000000000000000000000275b3d54a5ddbf8205a75984796efe8b7357bae0000000000000000000000005dd2205c3aac13e592f0a3d85188c948d1781df10000000000000000000000005a09a94ee8198d3c474d723337aa58023810022c000000000000000000000000475816ca2a31d601b4e336f5c2418a67978abf09000000000000000000000000a821c8c245d1f3a257e3b0dec99268ca0514442200000000000000000000000070c006fc86a392c16d7e085cefc0ad1ff7de6c750000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000","delay":259200}},{"id":"0x904f7d2e59a51e8c374447b71d8ae5eceb5ca7e77334ddecc8e965934735ffda","decoded":{"chain":"ethereum","contractName":"ArbOneAIPArbOS31UpgradeChallengeManagerAction","function":"perform","inputs":[],"address":"0x19b715cF310C28C9020e53AAA11Ce9dF42E718b5","calldata":"0xb147f40c","executor":"0x3ffFbAdAF827559da092217e474760E2b2c3CeDd"},"raw":{"target":"0x3ffFbAdAF827559da092217e474760E2b2c3CeDd","value":0,"data":"0x1cff79cd00000000000000000000000019b715cf310c28c9020e53aaa11ce9df42e718b500000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000004b147f40c00000000000000000000000000000000000000000000000000000000","delay":259200}},{"id":"0x904f7d2e59a51e8c374447b71d8ae5eceb5ca7e77334ddecc8e965934735ffda","decoded":{"chain":"ethereum","contractName":"NovaAIPArbOS31UpgradeChallengeManagerAction","function":"perform","inputs":[],"address":"0x658AFc9d5Ec4476Fa6bb7033eA465F9901FBfF27","calldata":"0xb147f40c","executor":"0x3ffFbAdAF827559da092217e474760E2b2c3CeDd"},"raw":{"target":"0x3ffFbAdAF827559da092217e474760E2b2c3CeDd","value":0,"data":"0x1cff79cd000000000000000000000000658afc9d5ec4476fa6bb7033ea465f9901fbff2700000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000004b147f40c00000000000000000000000000000000000000000000000000000000","delay":259200}},{"id":"0x904f7d2e59a51e8c374447b71d8ae5eceb5ca7e77334ddecc8e965934735ffda","decoded":{"chain":"arbitrum","contractName":"SetArbOS31VersionAction","function":"perform","inputs":[],"address":"0xaF81C82Ec98f86D0017d78cD66F1026f1A5Cf1Db","calldata":"0xb147f40c","executor":"0xCF57572261c7c2BCF21ffD220ea7d1a27D40A827","inboxOnEthereum":"0x4Dbd4fc535Ac27206064B68FfCf827b0A60BAB3f"},"raw":{"target":"0xa723C008e76E379c55599D2E4d93879BeaFDa79C","value":0,"data":"0x0000000000000000000000004dbd4fc535ac27206064b68ffcf827b0a60bab3f000000000000000000000000cf57572261c7c2bcf21ffd220ea7d1a27d40a82700000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000c000000000000000000000000000000000000000000000000000000000000000841cff79cd000000000000000000000000af81c82ec98f86d0017d78cd66f1026f1a5cf1db00000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000004b147f40c0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000","delay":259200}},{"id":"0x904f7d2e59a51e8c374447b71d8ae5eceb5ca7e77334ddecc8e965934735ffda","decoded":{"chain":"arbitrum","contractName":"ArbOneAIPArbOS31AddWasmCacheManagerAction","function":"perform","inputs":[],"address":"0xb040b105A4a0C7a9CC290164AcCBC32855368322","calldata":"0xb147f40c","executor":"0xCF57572261c7c2BCF21ffD220ea7d1a27D40A827","inboxOnEthereum":"0x4Dbd4fc535Ac27206064B68FfCf827b0A60BAB3f"},"raw":{"target":"0xa723C008e76E379c55599D2E4d93879BeaFDa79C","value":0,"data":"0x0000000000000000000000004dbd4fc535ac27206064b68ffcf827b0a60bab3f000000000000000000000000cf57572261c7c2bcf21ffd220ea7d1a27d40a82700000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000c000000000000000000000000000000000000000000000000000000000000000841cff79cd000000000000000000000000b040b105a4a0c7a9cc290164accbc3285536832200000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000004b147f40c0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000","delay":259200}},{"id":"0x904f7d2e59a51e8c374447b71d8ae5eceb5ca7e77334ddecc8e965934735ffda","decoded":{"chain":"nova","address":"0x6dD43360d2a69BB9FfFC5349F2511f2A3bCbC2da","calldata":"0xb147f40c","executor":"0x86a02dD71363c440b21F4c0E5B2Ad01Ffe1A7482","inboxOnEthereum":"0xc4448b71118c9071Bcb9734A0EAc55D18A153949"},"raw":{"target":"0xa723C008e76E379c55599D2E4d93879BeaFDa79C","value":0,"data":"0x000000000000000000000000c4448b71118c9071bcb9734a0eac55d18a15394900000000000000000000000086a02dd71363c440b21f4c0e5b2ad01ffe1a748200000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000c000000000000000000000000000000000000000000000000000000000000000841cff79cd0000000000000000000000006dd43360d2a69bb9fffc5349f2511f2a3bcbc2da00000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000004b147f40c0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000","delay":259200}},{"id":"0x904f7d2e59a51e8c374447b71d8ae5eceb5ca7e77334ddecc8e965934735ffda","decoded":{"chain":"nova","address":"0x61703Bf337341f2e09d96Dd6488c2907718A8E26","calldata":"0xb147f40c","executor":"0x86a02dD71363c440b21F4c0E5B2Ad01Ffe1A7482","inboxOnEthereum":"0xc4448b71118c9071Bcb9734A0EAc55D18A153949"},"raw":{"target":"0xa723C008e76E379c55599D2E4d93879BeaFDa79C","value":0,"data":"0x000000000000000000000000c4448b71118c9071bcb9734a0eac55d18a15394900000000000000000000000086a02dd71363c440b21f4c0e5b2ad01ffe1a748200000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000c000000000000000000000000000000000000000000000000000000000000000841cff79cd00000000000000000000000061703bf337341f2e09d96dd6488c2907718a8e2600000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000004b147f40c0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000","delay":259200}},{"id":"0x904f7d2e59a51e8c374447b71d8ae5eceb5ca7e77334ddecc8e965934735ffda","decoded":{"chain":"nova","address":"0x849E360a247132F961c9CBE95Ba39106c72e1268","calldata":"0xb147f40c","executor":"0x86a02dD71363c440b21F4c0E5B2Ad01Ffe1A7482","inboxOnEthereum":"0xc4448b71118c9071Bcb9734A0EAc55D18A153949"},"raw":{"target":"0xa723C008e76E379c55599D2E4d93879BeaFDa79C","value":0,"data":"0x000000000000000000000000c4448b71118c9071bcb9734a0eac55d18a15394900000000000000000000000086a02dd71363c440b21f4c0e5b2ad01ffe1a748200000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000c000000000000000000000000000000000000000000000000000000000000000841cff79cd000000000000000000000000849e360a247132f961c9cbe95ba39106c72e126800000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000004b147f40c0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000","delay":259200}},{"id":"0xbf3be160a5b8d10510a05f0bb2a976bef48895f2dd097852c6b0059f36debed6","decoded":{"chain":"arbitrum","contractName":"CoreGovTimelockUpdateDelayEightDayAction","function":"perform","inputs":[],"address":"0x5B947D8bF197467be7ef381b7cAfEE0A7B35737A","calldata":"0xb147f40c","executor":"0xCF57572261c7c2BCF21ffD220ea7d1a27D40A827","inboxOnEthereum":"0x4Dbd4fc535Ac27206064B68FfCf827b0A60BAB3f"},"raw":{"target":"0xa723C008e76E379c55599D2E4d93879BeaFDa79C","value":0,"data":"0x0000000000000000000000004dbd4fc535ac27206064b68ffcf827b0a60bab3f000000000000000000000000cf57572261c7c2bcf21ffd220ea7d1a27d40a82700000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000c000000000000000000000000000000000000000000000000000000000000000841cff79cd0000000000000000000000005b947d8bf197467be7ef381b7cafee0a7b35737a00000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000004b147f40c0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000","delay":259200}},{"id":"0x304646fcc77edfed197cfc18bacc3241063f45301b0719476ef27339ddf3527a","decoded":{"chain":"ethereum","contractName":"SecurityCouncilMemberSyncAction","function":"perform","inputs":[{"name":"_securityCouncil","value":"0xF06E95eF589D9c38af242a8AAee8375f14023F85"},{"name":"_updatedMembers","value":["0x3Bd8e2AC65ad6f0F094BA6766cBd9484AB49eF23","0xf8e1492255d9428c2Fc20A98A1DeB1215C8ffEfd","0xb07dc9103328A51128bC6Cc1049d1137035f5E28","0x3E286452b1C66abB08Eb5494c3894F40aB5a59AF","0xb71ca4FFbB7b58d75Ba29891ab45e9Dc12B444Ed","0x8F10e3413586c4a8DCfcE19D009872b19e9cd8E3","0x0275b3D54a5dDbf8205A75984796eFE8b7357Bae","0x5DD2205C3aac13E592F0a3D85188c948D1781df1","0x5a09A94eE8198D3c474d723337aa58023810022C","0x475816ca2a31D601B4e336f5c2418A67978aBf09","0x70C006fC86A392c16D7E085cefc0Ad1FF7de6C75","0x9316ca66f5f936E3239e4fD2AAAEA5C7b6f3C4cC"]},{"name":"_nonce","value":7}],"address":"0x9BF7b8884Fa381a45f8CB2525905fb36C996297a","calldata":"0x536d8944000000000000000000000000f06e95ef589d9c38af242a8aaee8375f14023f8500000000000000000000000000000000000000000000000000000000000000600000000000000000000000000000000000000000000000000000000000000007000000000000000000000000000000000000000000000000000000000000000c0000000000000000000000003bd8e2ac65ad6f0f094ba6766cbd9484ab49ef23000000000000000000000000f8e1492255d9428c2fc20a98a1deb1215c8ffefd000000000000000000000000b07dc9103328a51128bc6cc1049d1137035f5e280000000000000000000000003e286452b1c66abb08eb5494c3894f40ab5a59af000000000000000000000000b71ca4ffbb7b58d75ba29891ab45e9dc12b444ed0000000000000000000000008f10e3413586c4a8dcfce19d009872b19e9cd8e30000000000000000000000000275b3d54a5ddbf8205a75984796efe8b7357bae0000000000000000000000005dd2205c3aac13e592f0a3d85188c948d1781df10000000000000000000000005a09a94ee8198d3c474d723337aa58023810022c000000000000000000000000475816ca2a31d601b4e336f5c2418a67978abf0900000000000000000000000070c006fc86a392c16d7e085cefc0ad1ff7de6c750000000000000000000000009316ca66f5f936e3239e4fd2aaaea5c7b6f3c4cc","executor":"0x3ffFbAdAF827559da092217e474760E2b2c3CeDd"},"raw":{"target":"0x3ffFbAdAF827559da092217e474760E2b2c3CeDd","value":0,"data":"0x1cff79cd0000000000000000000000009bf7b8884fa381a45f8cb2525905fb36c996297a00000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000204536d8944000000000000000000000000f06e95ef589d9c38af242a8aaee8375f14023f8500000000000000000000000000000000000000000000000000000000000000600000000000000000000000000000000000000000000000000000000000000007000000000000000000000000000000000000000000000000000000000000000c0000000000000000000000003bd8e2ac65ad6f0f094ba6766cbd9484ab49ef23000000000000000000000000f8e1492255d9428c2fc20a98a1deb1215c8ffefd000000000000000000000000b07dc9103328a51128bc6cc1049d1137035f5e280000000000000000000000003e286452b1c66abb08eb5494c3894f40ab5a59af000000000000000000000000b71ca4ffbb7b58d75ba29891ab45e9dc12b444ed0000000000000000000000008f10e3413586c4a8dcfce19d009872b19e9cd8e30000000000000000000000000275b3d54a5ddbf8205a75984796efe8b7357bae0000000000000000000000005dd2205c3aac13e592f0a3d85188c948d1781df10000000000000000000000005a09a94ee8198d3c474d723337aa58023810022c000000000000000000000000475816ca2a31d601b4e336f5c2418a67978abf0900000000000000000000000070c006fc86a392c16d7e085cefc0ad1ff7de6c750000000000000000000000009316ca66f5f936e3239e4fd2aaaea5c7b6f3c4cc00000000000000000000000000000000000000000000000000000000","delay":259200}},{"id":"0x304646fcc77edfed197cfc18bacc3241063f45301b0719476ef27339ddf3527a","decoded":{"chain":"arbitrum","contractName":"SecurityCouncilMemberSyncAction","function":"perform","inputs":[{"name":"_securityCouncil","value":"0x423552c0F05baCCac5Bfa91C6dCF1dc53a0A1641"},{"name":"_updatedMembers","value":["0x3Bd8e2AC65ad6f0F094BA6766cBd9484AB49eF23","0xf8e1492255d9428c2Fc20A98A1DeB1215C8ffEfd","0xb07dc9103328A51128bC6Cc1049d1137035f5E28","0x3E286452b1C66abB08Eb5494c3894F40aB5a59AF","0xb71ca4FFbB7b58d75Ba29891ab45e9Dc12B444Ed","0x8F10e3413586c4a8DCfcE19D009872b19e9cd8E3","0x0275b3D54a5dDbf8205A75984796eFE8b7357Bae","0x5DD2205C3aac13E592F0a3D85188c948D1781df1","0x5a09A94eE8198D3c474d723337aa58023810022C","0x475816ca2a31D601B4e336f5c2418A67978aBf09","0x70C006fC86A392c16D7E085cefc0Ad1FF7de6C75","0x9316ca66f5f936E3239e4fD2AAAEA5C7b6f3C4cC"]},{"name":"_nonce","value":7}],"address":"0x9BF7b8884Fa381a45f8CB2525905fb36C996297a","calldata":"0x536d8944000000000000000000000000423552c0f05baccac5bfa91c6dcf1dc53a0a164100000000000000000000000000000000000000000000000000000000000000600000000000000000000000000000000000000000000000000000000000000007000000000000000000000000000000000000000000000000000000000000000c0000000000000000000000003bd8e2ac65ad6f0f094ba6766cbd9484ab49ef23000000000000000000000000f8e1492255d9428c2fc20a98a1deb1215c8ffefd000000000000000000000000b07dc9103328a51128bc6cc1049d1137035f5e280000000000000000000000003e286452b1c66abb08eb5494c3894f40ab5a59af000000000000000000000000b71ca4ffbb7b58d75ba29891ab45e9dc12b444ed0000000000000000000000008f10e3413586c4a8dcfce19d009872b19e9cd8e30000000000000000000000000275b3d54a5ddbf8205a75984796efe8b7357bae0000000000000000000000005dd2205c3aac13e592f0a3d85188c948d1781df10000000000000000000000005a09a94ee8198d3c474d723337aa58023810022c000000000000000000000000475816ca2a31d601b4e336f5c2418a67978abf0900000000000000000000000070c006fc86a392c16d7e085cefc0ad1ff7de6c750000000000000000000000009316ca66f5f936e3239e4fd2aaaea5c7b6f3c4cc","executor":"0xCF57572261c7c2BCF21ffD220ea7d1a27D40A827","inboxOnEthereum":"0x4Dbd4fc535Ac27206064B68FfCf827b0A60BAB3f"},"raw":{"target":"0xa723C008e76E379c55599D2E4d93879BeaFDa79C","value":0,"data":"0x0000000000000000000000004dbd4fc535ac27206064b68ffcf827b0a60bab3f000000000000000000000000cf57572261c7c2bcf21ffd220ea7d1a27d40a82700000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000c000000000000000000000000000000000000000000000000000000000000002841cff79cd0000000000000000000000009bf7b8884fa381a45f8cb2525905fb36c996297a00000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000204536d8944000000000000000000000000423552c0f05baccac5bfa91c6dcf1dc53a0a164100000000000000000000000000000000000000000000000000000000000000600000000000000000000000000000000000000000000000000000000000000007000000000000000000000000000000000000000000000000000000000000000c0000000000000000000000003bd8e2ac65ad6f0f094ba6766cbd9484ab49ef23000000000000000000000000f8e1492255d9428c2fc20a98a1deb1215c8ffefd000000000000000000000000b07dc9103328a51128bc6cc1049d1137035f5e280000000000000000000000003e286452b1c66abb08eb5494c3894f40ab5a59af000000000000000000000000b71ca4ffbb7b58d75ba29891ab45e9dc12b444ed0000000000000000000000008f10e3413586c4a8dcfce19d009872b19e9cd8e30000000000000000000000000275b3d54a5ddbf8205a75984796efe8b7357bae0000000000000000000000005dd2205c3aac13e592f0a3d85188c948d1781df10000000000000000000000005a09a94ee8198d3c474d723337aa58023810022c000000000000000000000000475816ca2a31d601b4e336f5c2418a67978abf0900000000000000000000000070c006fc86a392c16d7e085cefc0ad1ff7de6c750000000000000000000000009316ca66f5f936e3239e4fd2aaaea5c7b6f3c4cc0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000","delay":259200}},{"id":"0x304646fcc77edfed197cfc18bacc3241063f45301b0719476ef27339ddf3527a","decoded":{"chain":"nova","address":"0x9BF7b8884Fa381a45f8CB2525905fb36C996297a","calldata":"0x536d8944000000000000000000000000c232ee726e3c51b86778bb4dbe61c52cc07a60f300000000000000000000000000000000000000000000000000000000000000600000000000000000000000000000000000000000000000000000000000000007000000000000000000000000000000000000000000000000000000000000000c0000000000000000000000003bd8e2ac65ad6f0f094ba6766cbd9484ab49ef23000000000000000000000000f8e1492255d9428c2fc20a98a1deb1215c8ffefd000000000000000000000000b07dc9103328a51128bc6cc1049d1137035f5e280000000000000000000000003e286452b1c66abb08eb5494c3894f40ab5a59af000000000000000000000000b71ca4ffbb7b58d75ba29891ab45e9dc12b444ed0000000000000000000000008f10e3413586c4a8dcfce19d009872b19e9cd8e30000000000000000000000000275b3d54a5ddbf8205a75984796efe8b7357bae0000000000000000000000005dd2205c3aac13e592f0a3d85188c948d1781df10000000000000000000000005a09a94ee8198d3c474d723337aa58023810022c000000000000000000000000475816ca2a31d601b4e336f5c2418a67978abf0900000000000000000000000070c006fc86a392c16d7e085cefc0ad1ff7de6c750000000000000000000000009316ca66f5f936e3239e4fd2aaaea5c7b6f3c4cc","executor":"0x86a02dD71363c440b21F4c0E5B2Ad01Ffe1A7482","inboxOnEthereum":"0xc4448b71118c9071Bcb9734A0EAc55D18A153949"},"raw":{"target":"0xa723C008e76E379c55599D2E4d93879BeaFDa79C","value":0,"data":"0x000000000000000000000000c4448b71118c9071bcb9734a0eac55d18a15394900000000000000000000000086a02dd71363c440b21f4c0e5b2ad01ffe1a748200000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000c000000000000000000000000000000000000000000000000000000000000002841cff79cd0000000000000000000000009bf7b8884fa381a45f8cb2525905fb36c996297a00000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000204536d8944000000000000000000000000c232ee726e3c51b86778bb4dbe61c52cc07a60f300000000000000000000000000000000000000000000000000000000000000600000000000000000000000000000000000000000000000000000000000000007000000000000000000000000000000000000000000000000000000000000000c0000000000000000000000003bd8e2ac65ad6f0f094ba6766cbd9484ab49ef23000000000000000000000000f8e1492255d9428c2fc20a98a1deb1215c8ffefd000000000000000000000000b07dc9103328a51128bc6cc1049d1137035f5e280000000000000000000000003e286452b1c66abb08eb5494c3894f40ab5a59af000000000000000000000000b71ca4ffbb7b58d75ba29891ab45e9dc12b444ed0000000000000000000000008f10e3413586c4a8dcfce19d009872b19e9cd8e30000000000000000000000000275b3d54a5ddbf8205a75984796efe8b7357bae0000000000000000000000005dd2205c3aac13e592f0a3d85188c948d1781df10000000000000000000000005a09a94ee8198d3c474d723337aa58023810022c000000000000000000000000475816ca2a31d601b4e336f5c2418a67978abf0900000000000000000000000070c006fc86a392c16d7e085cefc0ad1ff7de6c750000000000000000000000009316ca66f5f936e3239e4fd2aaaea5c7b6f3c4cc0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000","delay":259200}},{"id":"0x304646fcc77edfed197cfc18bacc3241063f45301b0719476ef27339ddf3527a","decoded":{"chain":"arbitrum","contractName":"SecurityCouncilMemberSyncAction","function":"perform","inputs":[{"name":"_securityCouncil","value":"0xADd68bCb0f66878aB9D37a447C7b9067C5dfa941"},{"name":"_updatedMembers","value":["0x3Bd8e2AC65ad6f0F094BA6766cBd9484AB49eF23","0xf8e1492255d9428c2Fc20A98A1DeB1215C8ffEfd","0xb07dc9103328A51128bC6Cc1049d1137035f5E28","0x3E286452b1C66abB08Eb5494c3894F40aB5a59AF","0xb71ca4FFbB7b58d75Ba29891ab45e9Dc12B444Ed","0x8F10e3413586c4a8DCfcE19D009872b19e9cd8E3","0x0275b3D54a5dDbf8205A75984796eFE8b7357Bae","0x5DD2205C3aac13E592F0a3D85188c948D1781df1","0x5a09A94eE8198D3c474d723337aa58023810022C","0x475816ca2a31D601B4e336f5c2418A67978aBf09","0x70C006fC86A392c16D7E085cefc0Ad1FF7de6C75","0x9316ca66f5f936E3239e4fD2AAAEA5C7b6f3C4cC"]},{"name":"_nonce","value":7}],"address":"0x9BF7b8884Fa381a45f8CB2525905fb36C996297a","calldata":"0x536d8944000000000000000000000000add68bcb0f66878ab9d37a447c7b9067c5dfa94100000000000000000000000000000000000000000000000000000000000000600000000000000000000000000000000000000000000000000000000000000007000000000000000000000000000000000000000000000000000000000000000c0000000000000000000000003bd8e2ac65ad6f0f094ba6766cbd9484ab49ef23000000000000000000000000f8e1492255d9428c2fc20a98a1deb1215c8ffefd000000000000000000000000b07dc9103328a51128bc6cc1049d1137035f5e280000000000000000000000003e286452b1c66abb08eb5494c3894f40ab5a59af000000000000000000000000b71ca4ffbb7b58d75ba29891ab45e9dc12b444ed0000000000000000000000008f10e3413586c4a8dcfce19d009872b19e9cd8e30000000000000000000000000275b3d54a5ddbf8205a75984796efe8b7357bae0000000000000000000000005dd2205c3aac13e592f0a3d85188c948d1781df10000000000000000000000005a09a94ee8198d3c474d723337aa58023810022c000000000000000000000000475816ca2a31d601b4e336f5c2418a67978abf0900000000000000000000000070c006fc86a392c16d7e085cefc0ad1ff7de6c750000000000000000000000009316ca66f5f936e3239e4fd2aaaea5c7b6f3c4cc","executor":"0xCF57572261c7c2BCF21ffD220ea7d1a27D40A827","inboxOnEthereum":"0x4Dbd4fc535Ac27206064B68FfCf827b0A60BAB3f"},"raw":{"target":"0xa723C008e76E379c55599D2E4d93879BeaFDa79C","value":0,"data":"0x0000000000000000000000004dbd4fc535ac27206064b68ffcf827b0a60bab3f000000000000000000000000cf57572261c7c2bcf21ffd220ea7d1a27d40a82700000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000c000000000000000000000000000000000000000000000000000000000000002841cff79cd0000000000000000000000009bf7b8884fa381a45f8cb2525905fb36c996297a00000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000204536d8944000000000000000000000000add68bcb0f66878ab9d37a447c7b9067c5dfa94100000000000000000000000000000000000000000000000000000000000000600000000000000000000000000000000000000000000000000000000000000007000000000000000000000000000000000000000000000000000000000000000c0000000000000000000000003bd8e2ac65ad6f0f094ba6766cbd9484ab49ef23000000000000000000000000f8e1492255d9428c2fc20a98a1deb1215c8ffefd000000000000000000000000b07dc9103328a51128bc6cc1049d1137035f5e280000000000000000000000003e286452b1c66abb08eb5494c3894f40ab5a59af000000000000000000000000b71ca4ffbb7b58d75ba29891ab45e9dc12b444ed0000000000000000000000008f10e3413586c4a8dcfce19d009872b19e9cd8e30000000000000000000000000275b3d54a5ddbf8205a75984796efe8b7357bae0000000000000000000000005dd2205c3aac13e592f0a3d85188c948d1781df10000000000000000000000005a09a94ee8198d3c474d723337aa58023810022c000000000000000000000000475816ca2a31d601b4e336f5c2418a67978abf0900000000000000000000000070c006fc86a392c16d7e085cefc0ad1ff7de6c750000000000000000000000009316ca66f5f936e3239e4fd2aaaea5c7b6f3c4cc0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000","delay":259200}},{"id":"0xc7e9a8a492569cc6ffce2992be72416fe2fb2a9260a839f5a78ffd0de91d709d","decoded":{"chain":"ethereum","contractName":"RegisterAndSetArbCustomGatewayAction","function":"perform","inputs":[{"name":"_l1Tokens","value":["0xFca59Cd816aB1eaD66534D82bc21E7515cE441CF"]},{"name":"_l2Tokens","value":["0xCf78572A8fE97b2B9a4B9709f6a7D9a863c1b8E0"]},{"name":"_maxGasForRegister","value":0},{"name":"_gasPriceBidForRegister","value":0},{"name":"_maxSubmissionCostForRegister","value":500000000000000},{"name":"_maxGasForSetGateway","value":0},{"name":"_gasPriceBidForSetGateway","value":0},{"name":"_maxSubmissionCostForSetGateway","value":500000000000000}],"address":"0x997668Ee3C575dC060F80B06db0a8B04C9558969","calldata":"0xc177385c00000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000000140000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000001c6bf52634000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000001c6bf526340000000000000000000000000000000000000000000000000000000000000000001000000000000000000000000fca59cd816ab1ead66534d82bc21e7515ce441cf0000000000000000000000000000000000000000000000000000000000000001000000000000000000000000cf78572a8fe97b2b9a4b9709f6a7d9a863c1b8e0","executor":"0x3ffFbAdAF827559da092217e474760E2b2c3CeDd"},"raw":{"target":"0x3ffFbAdAF827559da092217e474760E2b2c3CeDd","value":1000000000000000,"data":"0x1cff79cd000000000000000000000000997668ee3c575dc060f80b06db0a8b04c955896900000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000184c177385c00000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000000140000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000001c6bf52634000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000001c6bf526340000000000000000000000000000000000000000000000000000000000000000001000000000000000000000000fca59cd816ab1ead66534d82bc21e7515ce441cf0000000000000000000000000000000000000000000000000000000000000001000000000000000000000000cf78572a8fe97b2b9a4b9709f6a7d9a863c1b8e000000000000000000000000000000000000000000000000000000000","delay":259200}},{"id":"0xca38878436c6e9ac58f4f3a27ddc93437c3aacb59575f30e082f8d60c8410be1","decoded":{"chain":"ethereum","contractName":"SecurityCouncilMemberSyncAction","function":"perform","inputs":[{"name":"_securityCouncil","value":"0xF06E95eF589D9c38af242a8AAee8375f14023F85"},{"name":"_updatedMembers","value":["0x882c6FCb3D358b9d70B97c6999159cea64168B6F","0xeA4A4A886aCA47DD0167B4aEE5B1345e18D20Ee5","0x1716C1C037e4968D5A06d4d080904F9B7a6508f2","0x33ddb82e68940f0e4C1050885BcE8faF5Ddd1b93","0x3E286452b1C66abB08Eb5494c3894F40aB5a59AF","0xe2e9d5B97d8C0457B1cf80BC93802bce4DF03e33","0x0275b3D54a5dDbf8205A75984796eFE8b7357Bae","0x5DD2205C3aac13E592F0a3D85188c948D1781df1","0x5a09A94eE8198D3c474d723337aa58023810022C","0x475816ca2a31D601B4e336f5c2418A67978aBf09","0x70C006fC86A392c16D7E085cefc0Ad1FF7de6C75","0x9316ca66f5f936E3239e4fD2AAAEA5C7b6f3C4cC"]},{"name":"_nonce","value":8}],"address":"0x9BF7b8884Fa381a45f8CB2525905fb36C996297a","calldata":"0x536d8944000000000000000000000000f06e95ef589d9c38af242a8aaee8375f14023f8500000000000000000000000000000000000000000000000000000000000000600000000000000000000000000000000000000000000000000000000000000008000000000000000000000000000000000000000000000000000000000000000c000000000000000000000000882c6fcb3d358b9d70b97c6999159cea64168b6f000000000000000000000000ea4a4a886aca47dd0167b4aee5b1345e18d20ee50000000000000000000000001716c1c037e4968d5a06d4d080904f9b7a6508f200000000000000000000000033ddb82e68940f0e4c1050885bce8faf5ddd1b930000000000000000000000003e286452b1c66abb08eb5494c3894f40ab5a59af000000000000000000000000e2e9d5b97d8c0457b1cf80bc93802bce4df03e330000000000000000000000000275b3d54a5ddbf8205a75984796efe8b7357bae0000000000000000000000005dd2205c3aac13e592f0a3d85188c948d1781df10000000000000000000000005a09a94ee8198d3c474d723337aa58023810022c000000000000000000000000475816ca2a31d601b4e336f5c2418a67978abf0900000000000000000000000070c006fc86a392c16d7e085cefc0ad1ff7de6c750000000000000000000000009316ca66f5f936e3239e4fd2aaaea5c7b6f3c4cc","executor":"0x3ffFbAdAF827559da092217e474760E2b2c3CeDd"},"raw":{"target":"0x3ffFbAdAF827559da092217e474760E2b2c3CeDd","value":0,"data":"0x1cff79cd0000000000000000000000009bf7b8884fa381a45f8cb2525905fb36c996297a00000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000204536d8944000000000000000000000000f06e95ef589d9c38af242a8aaee8375f14023f8500000000000000000000000000000000000000000000000000000000000000600000000000000000000000000000000000000000000000000000000000000008000000000000000000000000000000000000000000000000000000000000000c000000000000000000000000882c6fcb3d358b9d70b97c6999159cea64168b6f000000000000000000000000ea4a4a886aca47dd0167b4aee5b1345e18d20ee50000000000000000000000001716c1c037e4968d5a06d4d080904f9b7a6508f200000000000000000000000033ddb82e68940f0e4c1050885bce8faf5ddd1b930000000000000000000000003e286452b1c66abb08eb5494c3894f40ab5a59af000000000000000000000000e2e9d5b97d8c0457b1cf80bc93802bce4df03e330000000000000000000000000275b3d54a5ddbf8205a75984796efe8b7357bae0000000000000000000000005dd2205c3aac13e592f0a3d85188c948d1781df10000000000000000000000005a09a94ee8198d3c474d723337aa58023810022c000000000000000000000000475816ca2a31d601b4e336f5c2418a67978abf0900000000000000000000000070c006fc86a392c16d7e085cefc0ad1ff7de6c750000000000000000000000009316ca66f5f936e3239e4fd2aaaea5c7b6f3c4cc00000000000000000000000000000000000000000000000000000000","delay":259200}},{"id":"0xca38878436c6e9ac58f4f3a27ddc93437c3aacb59575f30e082f8d60c8410be1","decoded":{"chain":"arbitrum","contractName":"SecurityCouncilMemberSyncAction","function":"perform","inputs":[{"name":"_securityCouncil","value":"0x423552c0F05baCCac5Bfa91C6dCF1dc53a0A1641"},{"name":"_updatedMembers","value":["0x882c6FCb3D358b9d70B97c6999159cea64168B6F","0xeA4A4A886aCA47DD0167B4aEE5B1345e18D20Ee5","0x1716C1C037e4968D5A06d4d080904F9B7a6508f2","0x33ddb82e68940f0e4C1050885BcE8faF5Ddd1b93","0x3E286452b1C66abB08Eb5494c3894F40aB5a59AF","0xe2e9d5B97d8C0457B1cf80BC93802bce4DF03e33","0x0275b3D54a5dDbf8205A75984796eFE8b7357Bae","0x5DD2205C3aac13E592F0a3D85188c948D1781df1","0x5a09A94eE8198D3c474d723337aa58023810022C","0x475816ca2a31D601B4e336f5c2418A67978aBf09","0x70C006fC86A392c16D7E085cefc0Ad1FF7de6C75","0x9316ca66f5f936E3239e4fD2AAAEA5C7b6f3C4cC"]},{"name":"_nonce","value":8}],"address":"0x9BF7b8884Fa381a45f8CB2525905fb36C996297a","calldata":"0x536d8944000000000000000000000000423552c0f05baccac5bfa91c6dcf1dc53a0a164100000000000000000000000000000000000000000000000000000000000000600000000000000000000000000000000000000000000000000000000000000008000000000000000000000000000000000000000000000000000000000000000c000000000000000000000000882c6fcb3d358b9d70b97c6999159cea64168b6f000000000000000000000000ea4a4a886aca47dd0167b4aee5b1345e18d20ee50000000000000000000000001716c1c037e4968d5a06d4d080904f9b7a6508f200000000000000000000000033ddb82e68940f0e4c1050885bce8faf5ddd1b930000000000000000000000003e286452b1c66abb08eb5494c3894f40ab5a59af000000000000000000000000e2e9d5b97d8c0457b1cf80bc93802bce4df03e330000000000000000000000000275b3d54a5ddbf8205a75984796efe8b7357bae0000000000000000000000005dd2205c3aac13e592f0a3d85188c948d1781df10000000000000000000000005a09a94ee8198d3c474d723337aa58023810022c000000000000000000000000475816ca2a31d601b4e336f5c2418a67978abf0900000000000000000000000070c006fc86a392c16d7e085cefc0ad1ff7de6c750000000000000000000000009316ca66f5f936e3239e4fd2aaaea5c7b6f3c4cc","executor":"0xCF57572261c7c2BCF21ffD220ea7d1a27D40A827","inboxOnEthereum":"0x4Dbd4fc535Ac27206064B68FfCf827b0A60BAB3f"},"raw":{"target":"0xa723C008e76E379c55599D2E4d93879BeaFDa79C","value":0,"data":"0x0000000000000000000000004dbd4fc535ac27206064b68ffcf827b0a60bab3f000000000000000000000000cf57572261c7c2bcf21ffd220ea7d1a27d40a82700000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000c000000000000000000000000000000000000000000000000000000000000002841cff79cd0000000000000000000000009bf7b8884fa381a45f8cb2525905fb36c996297a00000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000204536d8944000000000000000000000000423552c0f05baccac5bfa91c6dcf1dc53a0a164100000000000000000000000000000000000000000000000000000000000000600000000000000000000000000000000000000000000000000000000000000008000000000000000000000000000000000000000000000000000000000000000c000000000000000000000000882c6fcb3d358b9d70b97c6999159cea64168b6f000000000000000000000000ea4a4a886aca47dd0167b4aee5b1345e18d20ee50000000000000000000000001716c1c037e4968d5a06d4d080904f9b7a6508f200000000000000000000000033ddb82e68940f0e4c1050885bce8faf5ddd1b930000000000000000000000003e286452b1c66abb08eb5494c3894f40ab5a59af000000000000000000000000e2e9d5b97d8c0457b1cf80bc93802bce4df03e330000000000000000000000000275b3d54a5ddbf8205a75984796efe8b7357bae0000000000000000000000005dd2205c3aac13e592f0a3d85188c948d1781df10000000000000000000000005a09a94ee8198d3c474d723337aa58023810022c000000000000000000000000475816ca2a31d601b4e336f5c2418a67978abf0900000000000000000000000070c006fc86a392c16d7e085cefc0ad1ff7de6c750000000000000000000000009316ca66f5f936e3239e4fd2aaaea5c7b6f3c4cc0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000","delay":259200}},{"id":"0xca38878436c6e9ac58f4f3a27ddc93437c3aacb59575f30e082f8d60c8410be1","decoded":{"chain":"nova","address":"0x9BF7b8884Fa381a45f8CB2525905fb36C996297a","calldata":"0x536d8944000000000000000000000000c232ee726e3c51b86778bb4dbe61c52cc07a60f300000000000000000000000000000000000000000000000000000000000000600000000000000000000000000000000000000000000000000000000000000008000000000000000000000000000000000000000000000000000000000000000c000000000000000000000000882c6fcb3d358b9d70b97c6999159cea64168b6f000000000000000000000000ea4a4a886aca47dd0167b4aee5b1345e18d20ee50000000000000000000000001716c1c037e4968d5a06d4d080904f9b7a6508f200000000000000000000000033ddb82e68940f0e4c1050885bce8faf5ddd1b930000000000000000000000003e286452b1c66abb08eb5494c3894f40ab5a59af000000000000000000000000e2e9d5b97d8c0457b1cf80bc93802bce4df03e330000000000000000000000000275b3d54a5ddbf8205a75984796efe8b7357bae0000000000000000000000005dd2205c3aac13e592f0a3d85188c948d1781df10000000000000000000000005a09a94ee8198d3c474d723337aa58023810022c000000000000000000000000475816ca2a31d601b4e336f5c2418a67978abf0900000000000000000000000070c006fc86a392c16d7e085cefc0ad1ff7de6c750000000000000000000000009316ca66f5f936e3239e4fd2aaaea5c7b6f3c4cc","executor":"0x86a02dD71363c440b21F4c0E5B2Ad01Ffe1A7482","inboxOnEthereum":"0xc4448b71118c9071Bcb9734A0EAc55D18A153949"},"raw":{"target":"0xa723C008e76E379c55599D2E4d93879BeaFDa79C","value":0,"data":"0x000000000000000000000000c4448b71118c9071bcb9734a0eac55d18a15394900000000000000000000000086a02dd71363c440b21f4c0e5b2ad01ffe1a748200000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000c000000000000000000000000000000000000000000000000000000000000002841cff79cd0000000000000000000000009bf7b8884fa381a45f8cb2525905fb36c996297a00000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000204536d8944000000000000000000000000c232ee726e3c51b86778bb4dbe61c52cc07a60f300000000000000000000000000000000000000000000000000000000000000600000000000000000000000000000000000000000000000000000000000000008000000000000000000000000000000000000000000000000000000000000000c000000000000000000000000882c6fcb3d358b9d70b97c6999159cea64168b6f000000000000000000000000ea4a4a886aca47dd0167b4aee5b1345e18d20ee50000000000000000000000001716c1c037e4968d5a06d4d080904f9b7a6508f200000000000000000000000033ddb82e68940f0e4c1050885bce8faf5ddd1b930000000000000000000000003e286452b1c66abb08eb5494c3894f40ab5a59af000000000000000000000000e2e9d5b97d8c0457b1cf80bc93802bce4df03e330000000000000000000000000275b3d54a5ddbf8205a75984796efe8b7357bae0000000000000000000000005dd2205c3aac13e592f0a3d85188c948d1781df10000000000000000000000005a09a94ee8198d3c474d723337aa58023810022c000000000000000000000000475816ca2a31d601b4e336f5c2418a67978abf0900000000000000000000000070c006fc86a392c16d7e085cefc0ad1ff7de6c750000000000000000000000009316ca66f5f936e3239e4fd2aaaea5c7b6f3c4cc0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000","delay":259200}},{"id":"0xca38878436c6e9ac58f4f3a27ddc93437c3aacb59575f30e082f8d60c8410be1","decoded":{"chain":"arbitrum","contractName":"SecurityCouncilMemberSyncAction","function":"perform","inputs":[{"name":"_securityCouncil","value":"0xADd68bCb0f66878aB9D37a447C7b9067C5dfa941"},{"name":"_updatedMembers","value":["0x882c6FCb3D358b9d70B97c6999159cea64168B6F","0xeA4A4A886aCA47DD0167B4aEE5B1345e18D20Ee5","0x1716C1C037e4968D5A06d4d080904F9B7a6508f2","0x33ddb82e68940f0e4C1050885BcE8faF5Ddd1b93","0x3E286452b1C66abB08Eb5494c3894F40aB5a59AF","0xe2e9d5B97d8C0457B1cf80BC93802bce4DF03e33","0x0275b3D54a5dDbf8205A75984796eFE8b7357Bae","0x5DD2205C3aac13E592F0a3D85188c948D1781df1","0x5a09A94eE8198D3c474d723337aa58023810022C","0x475816ca2a31D601B4e336f5c2418A67978aBf09","0x70C006fC86A392c16D7E085cefc0Ad1FF7de6C75","0x9316ca66f5f936E3239e4fD2AAAEA5C7b6f3C4cC"]},{"name":"_nonce","value":8}],"address":"0x9BF7b8884Fa381a45f8CB2525905fb36C996297a","calldata":"0x536d8944000000000000000000000000add68bcb0f66878ab9d37a447c7b9067c5dfa94100000000000000000000000000000000000000000000000000000000000000600000000000000000000000000000000000000000000000000000000000000008000000000000000000000000000000000000000000000000000000000000000c000000000000000000000000882c6fcb3d358b9d70b97c6999159cea64168b6f000000000000000000000000ea4a4a886aca47dd0167b4aee5b1345e18d20ee50000000000000000000000001716c1c037e4968d5a06d4d080904f9b7a6508f200000000000000000000000033ddb82e68940f0e4c1050885bce8faf5ddd1b930000000000000000000000003e286452b1c66abb08eb5494c3894f40ab5a59af000000000000000000000000e2e9d5b97d8c0457b1cf80bc93802bce4df03e330000000000000000000000000275b3d54a5ddbf8205a75984796efe8b7357bae0000000000000000000000005dd2205c3aac13e592f0a3d85188c948d1781df10000000000000000000000005a09a94ee8198d3c474d723337aa58023810022c000000000000000000000000475816ca2a31d601b4e336f5c2418a67978abf0900000000000000000000000070c006fc86a392c16d7e085cefc0ad1ff7de6c750000000000000000000000009316ca66f5f936e3239e4fd2aaaea5c7b6f3c4cc","executor":"0xCF57572261c7c2BCF21ffD220ea7d1a27D40A827","inboxOnEthereum":"0x4Dbd4fc535Ac27206064B68FfCf827b0A60BAB3f"},"raw":{"target":"0xa723C008e76E379c55599D2E4d93879BeaFDa79C","value":0,"data":"0x0000000000000000000000004dbd4fc535ac27206064b68ffcf827b0a60bab3f000000000000000000000000cf57572261c7c2bcf21ffd220ea7d1a27d40a82700000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000c000000000000000000000000000000000000000000000000000000000000002841cff79cd0000000000000000000000009bf7b8884fa381a45f8cb2525905fb36c996297a00000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000204536d8944000000000000000000000000add68bcb0f66878ab9d37a447c7b9067c5dfa94100000000000000000000000000000000000000000000000000000000000000600000000000000000000000000000000000000000000000000000000000000008000000000000000000000000000000000000000000000000000000000000000c000000000000000000000000882c6fcb3d358b9d70b97c6999159cea64168b6f000000000000000000000000ea4a4a886aca47dd0167b4aee5b1345e18d20ee50000000000000000000000001716c1c037e4968d5a06d4d080904f9b7a6508f200000000000000000000000033ddb82e68940f0e4c1050885bce8faf5ddd1b930000000000000000000000003e286452b1c66abb08eb5494c3894f40ab5a59af000000000000000000000000e2e9d5b97d8c0457b1cf80bc93802bce4df03e330000000000000000000000000275b3d54a5ddbf8205a75984796efe8b7357bae0000000000000000000000005dd2205c3aac13e592f0a3d85188c948d1781df10000000000000000000000005a09a94ee8198d3c474d723337aa58023810022c000000000000000000000000475816ca2a31d601b4e336f5c2418a67978abf0900000000000000000000000070c006fc86a392c16d7e085cefc0ad1ff7de6c750000000000000000000000009316ca66f5f936e3239e4fd2aaaea5c7b6f3c4cc0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000","delay":259200}},{"id":"0xd0258e7181e0e16c61b990becf1f42e07e78a1f62b687fe1394dd20522c6ebc8","decoded":{"chain":"ethereum","contractName":"SecurityCouncilMemberSyncAction","function":"perform","inputs":[{"name":"_securityCouncil","value":"0xF06E95eF589D9c38af242a8AAee8375f14023F85"},{"name":"_updatedMembers","value":["0x882c6FCb3D358b9d70B97c6999159cea64168B6F","0x9A301de96b15Db3aB778E2969Bf6cAa909cA56E8","0x78bB97d2F3811256D7F0041E81Aaf4B426eF3b67","0x33ddb82e68940f0e4C1050885BcE8faF5Ddd1b93","0xe2e9d5B97d8C0457B1cf80BC93802bce4DF03e33","0x59c8535419BbCb8AdFFDB3C835435E907e3B183B","0x0275b3D54a5dDbf8205A75984796eFE8b7357Bae","0x5DD2205C3aac13E592F0a3D85188c948D1781df1","0x5a09A94eE8198D3c474d723337aa58023810022C","0x475816ca2a31D601B4e336f5c2418A67978aBf09","0x9316ca66f5f936E3239e4fD2AAAEA5C7b6f3C4cC","0x444EDf8B90763bE7015F1F099a0dA0ef10250c71"]},{"name":"_nonce","value":12}],"address":"0x9BF7b8884Fa381a45f8CB2525905fb36C996297a","calldata":"0x536d8944000000000000000000000000f06e95ef589d9c38af242a8aaee8375f14023f850000000000000000000000000000000000000000000000000000000000000060000000000000000000000000000000000000000000000000000000000000000c000000000000000000000000000000000000000000000000000000000000000c000000000000000000000000882c6fcb3d358b9d70b97c6999159cea64168b6f0000000000000000000000009a301de96b15db3ab778e2969bf6caa909ca56e800000000000000000000000078bb97d2f3811256d7f0041e81aaf4b426ef3b6700000000000000000000000033ddb82e68940f0e4c1050885bce8faf5ddd1b93000000000000000000000000e2e9d5b97d8c0457b1cf80bc93802bce4df03e3300000000000000000000000059c8535419bbcb8adffdb3c835435e907e3b183b0000000000000000000000000275b3d54a5ddbf8205a75984796efe8b7357bae0000000000000000000000005dd2205c3aac13e592f0a3d85188c948d1781df10000000000000000000000005a09a94ee8198d3c474d723337aa58023810022c000000000000000000000000475816ca2a31d601b4e336f5c2418a67978abf090000000000000000000000009316ca66f5f936e3239e4fd2aaaea5c7b6f3c4cc000000000000000000000000444edf8b90763be7015f1f099a0da0ef10250c71","executor":"0x3ffFbAdAF827559da092217e474760E2b2c3CeDd"},"raw":{"target":"0x3ffFbAdAF827559da092217e474760E2b2c3CeDd","value":0,"data":"0x1cff79cd0000000000000000000000009bf7b8884fa381a45f8cb2525905fb36c996297a00000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000204536d8944000000000000000000000000f06e95ef589d9c38af242a8aaee8375f14023f850000000000000000000000000000000000000000000000000000000000000060000000000000000000000000000000000000000000000000000000000000000c000000000000000000000000000000000000000000000000000000000000000c000000000000000000000000882c6fcb3d358b9d70b97c6999159cea64168b6f0000000000000000000000009a301de96b15db3ab778e2969bf6caa909ca56e800000000000000000000000078bb97d2f3811256d7f0041e81aaf4b426ef3b6700000000000000000000000033ddb82e68940f0e4c1050885bce8faf5ddd1b93000000000000000000000000e2e9d5b97d8c0457b1cf80bc93802bce4df03e3300000000000000000000000059c8535419bbcb8adffdb3c835435e907e3b183b0000000000000000000000000275b3d54a5ddbf8205a75984796efe8b7357bae0000000000000000000000005dd2205c3aac13e592f0a3d85188c948d1781df10000000000000000000000005a09a94ee8198d3c474d723337aa58023810022c000000000000000000000000475816ca2a31d601b4e336f5c2418a67978abf090000000000000000000000009316ca66f5f936e3239e4fd2aaaea5c7b6f3c4cc000000000000000000000000444edf8b90763be7015f1f099a0da0ef10250c7100000000000000000000000000000000000000000000000000000000","delay":259200}},{"id":"0xd0258e7181e0e16c61b990becf1f42e07e78a1f62b687fe1394dd20522c6ebc8","decoded":{"chain":"arbitrum","contractName":"SecurityCouncilMemberSyncAction","function":"perform","inputs":[{"name":"_securityCouncil","value":"0x423552c0F05baCCac5Bfa91C6dCF1dc53a0A1641"},{"name":"_updatedMembers","value":["0x882c6FCb3D358b9d70B97c6999159cea64168B6F","0x9A301de96b15Db3aB778E2969Bf6cAa909cA56E8","0x78bB97d2F3811256D7F0041E81Aaf4B426eF3b67","0x33ddb82e68940f0e4C1050885BcE8faF5Ddd1b93","0xe2e9d5B97d8C0457B1cf80BC93802bce4DF03e33","0x59c8535419BbCb8AdFFDB3C835435E907e3B183B","0x0275b3D54a5dDbf8205A75984796eFE8b7357Bae","0x5DD2205C3aac13E592F0a3D85188c948D1781df1","0x5a09A94eE8198D3c474d723337aa58023810022C","0x475816ca2a31D601B4e336f5c2418A67978aBf09","0x9316ca66f5f936E3239e4fD2AAAEA5C7b6f3C4cC","0x444EDf8B90763bE7015F1F099a0dA0ef10250c71"]},{"name":"_nonce","value":12}],"address":"0x9BF7b8884Fa381a45f8CB2525905fb36C996297a","calldata":"0x536d8944000000000000000000000000423552c0f05baccac5bfa91c6dcf1dc53a0a16410000000000000000000000000000000000000000000000000000000000000060000000000000000000000000000000000000000000000000000000000000000c000000000000000000000000000000000000000000000000000000000000000c000000000000000000000000882c6fcb3d358b9d70b97c6999159cea64168b6f0000000000000000000000009a301de96b15db3ab778e2969bf6caa909ca56e800000000000000000000000078bb97d2f3811256d7f0041e81aaf4b426ef3b6700000000000000000000000033ddb82e68940f0e4c1050885bce8faf5ddd1b93000000000000000000000000e2e9d5b97d8c0457b1cf80bc93802bce4df03e3300000000000000000000000059c8535419bbcb8adffdb3c835435e907e3b183b0000000000000000000000000275b3d54a5ddbf8205a75984796efe8b7357bae0000000000000000000000005dd2205c3aac13e592f0a3d85188c948d1781df10000000000000000000000005a09a94ee8198d3c474d723337aa58023810022c000000000000000000000000475816ca2a31d601b4e336f5c2418a67978abf090000000000000000000000009316ca66f5f936e3239e4fd2aaaea5c7b6f3c4cc000000000000000000000000444edf8b90763be7015f1f099a0da0ef10250c71","executor":"0xCF57572261c7c2BCF21ffD220ea7d1a27D40A827","inboxOnEthereum":"0x4Dbd4fc535Ac27206064B68FfCf827b0A60BAB3f"},"raw":{"target":"0xa723C008e76E379c55599D2E4d93879BeaFDa79C","value":0,"data":"0x0000000000000000000000004dbd4fc535ac27206064b68ffcf827b0a60bab3f000000000000000000000000cf57572261c7c2bcf21ffd220ea7d1a27d40a82700000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000c000000000000000000000000000000000000000000000000000000000000002841cff79cd0000000000000000000000009bf7b8884fa381a45f8cb2525905fb36c996297a00000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000204536d8944000000000000000000000000423552c0f05baccac5bfa91c6dcf1dc53a0a16410000000000000000000000000000000000000000000000000000000000000060000000000000000000000000000000000000000000000000000000000000000c000000000000000000000000000000000000000000000000000000000000000c000000000000000000000000882c6fcb3d358b9d70b97c6999159cea64168b6f0000000000000000000000009a301de96b15db3ab778e2969bf6caa909ca56e800000000000000000000000078bb97d2f3811256d7f0041e81aaf4b426ef3b6700000000000000000000000033ddb82e68940f0e4c1050885bce8faf5ddd1b93000000000000000000000000e2e9d5b97d8c0457b1cf80bc93802bce4df03e3300000000000000000000000059c8535419bbcb8adffdb3c835435e907e3b183b0000000000000000000000000275b3d54a5ddbf8205a75984796efe8b7357bae0000000000000000000000005dd2205c3aac13e592f0a3d85188c948d1781df10000000000000000000000005a09a94ee8198d3c474d723337aa58023810022c000000000000000000000000475816ca2a31d601b4e336f5c2418a67978abf090000000000000000000000009316ca66f5f936e3239e4fd2aaaea5c7b6f3c4cc000000000000000000000000444edf8b90763be7015f1f099a0da0ef10250c710000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000","delay":259200}},{"id":"0xd0258e7181e0e16c61b990becf1f42e07e78a1f62b687fe1394dd20522c6ebc8","decoded":{"chain":"nova","address":"0x9BF7b8884Fa381a45f8CB2525905fb36C996297a","calldata":"0x536d8944000000000000000000000000c232ee726e3c51b86778bb4dbe61c52cc07a60f30000000000000000000000000000000000000000000000000000000000000060000000000000000000000000000000000000000000000000000000000000000c000000000000000000000000000000000000000000000000000000000000000c000000000000000000000000882c6fcb3d358b9d70b97c6999159cea64168b6f0000000000000000000000009a301de96b15db3ab778e2969bf6caa909ca56e800000000000000000000000078bb97d2f3811256d7f0041e81aaf4b426ef3b6700000000000000000000000033ddb82e68940f0e4c1050885bce8faf5ddd1b93000000000000000000000000e2e9d5b97d8c0457b1cf80bc93802bce4df03e3300000000000000000000000059c8535419bbcb8adffdb3c835435e907e3b183b0000000000000000000000000275b3d54a5ddbf8205a75984796efe8b7357bae0000000000000000000000005dd2205c3aac13e592f0a3d85188c948d1781df10000000000000000000000005a09a94ee8198d3c474d723337aa58023810022c000000000000000000000000475816ca2a31d601b4e336f5c2418a67978abf090000000000000000000000009316ca66f5f936e3239e4fd2aaaea5c7b6f3c4cc000000000000000000000000444edf8b90763be7015f1f099a0da0ef10250c71","executor":"0x86a02dD71363c440b21F4c0E5B2Ad01Ffe1A7482","inboxOnEthereum":"0xc4448b71118c9071Bcb9734A0EAc55D18A153949"},"raw":{"target":"0xa723C008e76E379c55599D2E4d93879BeaFDa79C","value":0,"data":"0x000000000000000000000000c4448b71118c9071bcb9734a0eac55d18a15394900000000000000000000000086a02dd71363c440b21f4c0e5b2ad01ffe1a748200000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000c000000000000000000000000000000000000000000000000000000000000002841cff79cd0000000000000000000000009bf7b8884fa381a45f8cb2525905fb36c996297a00000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000204536d8944000000000000000000000000c232ee726e3c51b86778bb4dbe61c52cc07a60f30000000000000000000000000000000000000000000000000000000000000060000000000000000000000000000000000000000000000000000000000000000c000000000000000000000000000000000000000000000000000000000000000c000000000000000000000000882c6fcb3d358b9d70b97c6999159cea64168b6f0000000000000000000000009a301de96b15db3ab778e2969bf6caa909ca56e800000000000000000000000078bb97d2f3811256d7f0041e81aaf4b426ef3b6700000000000000000000000033ddb82e68940f0e4c1050885bce8faf5ddd1b93000000000000000000000000e2e9d5b97d8c0457b1cf80bc93802bce4df03e3300000000000000000000000059c8535419bbcb8adffdb3c835435e907e3b183b0000000000000000000000000275b3d54a5ddbf8205a75984796efe8b7357bae0000000000000000000000005dd2205c3aac13e592f0a3d85188c948d1781df10000000000000000000000005a09a94ee8198d3c474d723337aa58023810022c000000000000000000000000475816ca2a31d601b4e336f5c2418a67978abf090000000000000000000000009316ca66f5f936e3239e4fd2aaaea5c7b6f3c4cc000000000000000000000000444edf8b90763be7015f1f099a0da0ef10250c710000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000","delay":259200}},{"id":"0xd0258e7181e0e16c61b990becf1f42e07e78a1f62b687fe1394dd20522c6ebc8","decoded":{"chain":"arbitrum","contractName":"SecurityCouncilMemberSyncAction","function":"perform","inputs":[{"name":"_securityCouncil","value":"0xADd68bCb0f66878aB9D37a447C7b9067C5dfa941"},{"name":"_updatedMembers","value":["0x882c6FCb3D358b9d70B97c6999159cea64168B6F","0x9A301de96b15Db3aB778E2969Bf6cAa909cA56E8","0x78bB97d2F3811256D7F0041E81Aaf4B426eF3b67","0x33ddb82e68940f0e4C1050885BcE8faF5Ddd1b93","0xe2e9d5B97d8C0457B1cf80BC93802bce4DF03e33","0x59c8535419BbCb8AdFFDB3C835435E907e3B183B","0x0275b3D54a5dDbf8205A75984796eFE8b7357Bae","0x5DD2205C3aac13E592F0a3D85188c948D1781df1","0x5a09A94eE8198D3c474d723337aa58023810022C","0x475816ca2a31D601B4e336f5c2418A67978aBf09","0x9316ca66f5f936E3239e4fD2AAAEA5C7b6f3C4cC","0x444EDf8B90763bE7015F1F099a0dA0ef10250c71"]},{"name":"_nonce","value":12}],"address":"0x9BF7b8884Fa381a45f8CB2525905fb36C996297a","calldata":"0x536d8944000000000000000000000000add68bcb0f66878ab9d37a447c7b9067c5dfa9410000000000000000000000000000000000000000000000000000000000000060000000000000000000000000000000000000000000000000000000000000000c000000000000000000000000000000000000000000000000000000000000000c000000000000000000000000882c6fcb3d358b9d70b97c6999159cea64168b6f0000000000000000000000009a301de96b15db3ab778e2969bf6caa909ca56e800000000000000000000000078bb97d2f3811256d7f0041e81aaf4b426ef3b6700000000000000000000000033ddb82e68940f0e4c1050885bce8faf5ddd1b93000000000000000000000000e2e9d5b97d8c0457b1cf80bc93802bce4df03e3300000000000000000000000059c8535419bbcb8adffdb3c835435e907e3b183b0000000000000000000000000275b3d54a5ddbf8205a75984796efe8b7357bae0000000000000000000000005dd2205c3aac13e592f0a3d85188c948d1781df10000000000000000000000005a09a94ee8198d3c474d723337aa58023810022c000000000000000000000000475816ca2a31d601b4e336f5c2418a67978abf090000000000000000000000009316ca66f5f936e3239e4fd2aaaea5c7b6f3c4cc000000000000000000000000444edf8b90763be7015f1f099a0da0ef10250c71","executor":"0xCF57572261c7c2BCF21ffD220ea7d1a27D40A827","inboxOnEthereum":"0x4Dbd4fc535Ac27206064B68FfCf827b0A60BAB3f"},"raw":{"target":"0xa723C008e76E379c55599D2E4d93879BeaFDa79C","value":0,"data":"0x0000000000000000000000004dbd4fc535ac27206064b68ffcf827b0a60bab3f000000000000000000000000cf57572261c7c2bcf21ffd220ea7d1a27d40a82700000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000c000000000000000000000000000000000000000000000000000000000000002841cff79cd0000000000000000000000009bf7b8884fa381a45f8cb2525905fb36c996297a00000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000204536d8944000000000000000000000000add68bcb0f66878ab9d37a447c7b9067c5dfa9410000000000000000000000000000000000000000000000000000000000000060000000000000000000000000000000000000000000000000000000000000000c000000000000000000000000000000000000000000000000000000000000000c000000000000000000000000882c6fcb3d358b9d70b97c6999159cea64168b6f0000000000000000000000009a301de96b15db3ab778e2969bf6caa909ca56e800000000000000000000000078bb97d2f3811256d7f0041e81aaf4b426ef3b6700000000000000000000000033ddb82e68940f0e4c1050885bce8faf5ddd1b93000000000000000000000000e2e9d5b97d8c0457b1cf80bc93802bce4df03e3300000000000000000000000059c8535419bbcb8adffdb3c835435e907e3b183b0000000000000000000000000275b3d54a5ddbf8205a75984796efe8b7357bae0000000000000000000000005dd2205c3aac13e592f0a3d85188c948d1781df10000000000000000000000005a09a94ee8198d3c474d723337aa58023810022c000000000000000000000000475816ca2a31d601b4e336f5c2418a67978abf090000000000000000000000009316ca66f5f936e3239e4fd2aaaea5c7b6f3c4cc000000000000000000000000444edf8b90763be7015f1f099a0da0ef10250c710000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000","delay":259200}}]
      values.timelockAdminAC:
+        ["0x3ffFbAdAF827559da092217e474760E2b2c3CeDd"]
      template:
+        "orbitstack/Timelock"
      description:
+        "A timelock with access control. The current minimum delay is 3d. Proposals that passed their minimum delay can be executed by the anyone."
      fieldMeta:
+        {"Executor":{"severity":"HIGH","description":"Executing proposals is only open to all addresses if this resolves to the 0x0 address"}}
    }
```

```diff
    contract SecurityCouncil (0xF06E95eF589D9c38af242a8AAee8375f14023F85) {
    +++ description: None
      template:
-        "GnosisSafe"
+        "orbitstack/SecurityCouncil"
      receivedPermissions:
+        [{"permission":"interact","from":"0xE6841D92B0C345144506576eC13ECf5103aC7f49","description":"cancel queued transactions.","via":[{"address":"0x3ffFbAdAF827559da092217e474760E2b2c3CeDd"}]},{"permission":"interact","from":"0xE6841D92B0C345144506576eC13ECf5103aC7f49","description":"update the minimum delay of the timelock.","via":[{"address":"0x3ffFbAdAF827559da092217e474760E2b2c3CeDd"}]},{"permission":"interact","from":"0xFb209827c58283535b744575e11953DCC4bEAD88","description":"Pause and unpause and set important roles and parameters in the system contracts: Can delegate Sequencer management to a BatchPosterManager address, manage data availability and DACs, set the Sequencer-only window, introduce an allowList to the bridge and whitelist Inboxes/Outboxes.","via":[{"address":"0x3ffFbAdAF827559da092217e474760E2b2c3CeDd"}]},{"permission":"upgrade","from":"0x211E1c4c7f1bF5351Ac850Ed10FD68CFfCF6c21b","via":[{"address":"0x71D78dC7cCC0e037e12de1E50f5470903ce37148"},{"address":"0x3ffFbAdAF827559da092217e474760E2b2c3CeDd"}]},{"permission":"upgrade","from":"0x23122da8C581AA7E0d07A36Ff1f16F799650232f","via":[{"address":"0xa8f7DdEd54a726eB873E98bFF2C95ABF2d03e560"},{"address":"0x3ffFbAdAF827559da092217e474760E2b2c3CeDd"}]},{"permission":"upgrade","from":"0x304807A7ed6c1296df2128E6ff3836e477329CD2","via":[{"address":"0x71D78dC7cCC0e037e12de1E50f5470903ce37148"},{"address":"0x3ffFbAdAF827559da092217e474760E2b2c3CeDd"}]},{"permission":"upgrade","from":"0x3ffFbAdAF827559da092217e474760E2b2c3CeDd","via":[{"address":"0x5613AF0474EB9c528A34701A5b1662E3C8FA0678"},{"address":"0x3ffFbAdAF827559da092217e474760E2b2c3CeDd"}]},{"permission":"upgrade","from":"0xA59075221b50C598aED0Eae0bB9869639513af0D","via":[{"address":"0x71D78dC7cCC0e037e12de1E50f5470903ce37148"},{"address":"0x3ffFbAdAF827559da092217e474760E2b2c3CeDd"}]},{"permission":"upgrade","from":"0xB2535b988dcE19f9D71dfB22dB6da744aCac21bf","via":[{"address":"0xa8f7DdEd54a726eB873E98bFF2C95ABF2d03e560"},{"address":"0x3ffFbAdAF827559da092217e474760E2b2c3CeDd"}]},{"permission":"upgrade","from":"0xC1Ebd02f738644983b6C4B2d440b8e77DdE276Bd","via":[{"address":"0x71D78dC7cCC0e037e12de1E50f5470903ce37148"},{"address":"0x3ffFbAdAF827559da092217e474760E2b2c3CeDd"}]},{"permission":"upgrade","from":"0xc4448b71118c9071Bcb9734A0EAc55D18A153949","via":[{"address":"0x71D78dC7cCC0e037e12de1E50f5470903ce37148"},{"address":"0x3ffFbAdAF827559da092217e474760E2b2c3CeDd"}]},{"permission":"upgrade","from":"0xC840838Bc438d73C16c2f8b22D2Ce3669963cD48","via":[{"address":"0xa8f7DdEd54a726eB873E98bFF2C95ABF2d03e560"},{"address":"0x3ffFbAdAF827559da092217e474760E2b2c3CeDd"}]},{"permission":"upgrade","from":"0xD4B80C3D7240325D18E645B49e6535A3Bf95cc58","via":[{"address":"0x71D78dC7cCC0e037e12de1E50f5470903ce37148"},{"address":"0x3ffFbAdAF827559da092217e474760E2b2c3CeDd"}]},{"permission":"upgrade","from":"0xE6841D92B0C345144506576eC13ECf5103aC7f49","via":[{"address":"0x5613AF0474EB9c528A34701A5b1662E3C8FA0678"},{"address":"0x3ffFbAdAF827559da092217e474760E2b2c3CeDd"}]},{"permission":"upgrade","from":"0xFb209827c58283535b744575e11953DCC4bEAD88","via":[{"address":"0x3ffFbAdAF827559da092217e474760E2b2c3CeDd"}]}]
      references:
+        [{"text":"Security Council members - Arbitrum Foundation Docs","href":"https://docs.arbitrum.foundation/security-council-members"}]
    }
```

```diff
    contract RollupProxy (0xFb209827c58283535b744575e11953DCC4bEAD88) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      issuedPermissions.16:
+        {"permission":"validate","to":"0xE27d4Ed355e5273A3D4855c8e11BC4a8d3e39b87","description":"Can propose new state roots (called nodes) and challenge state roots on the host chain.","via":[]}
      issuedPermissions.15:
+        {"permission":"validate","to":"0xDfB23DFE9De7dcC974467195C8B7D5cd21C9d7cB","description":"Can propose new state roots (called nodes) and challenge state roots on the host chain.","via":[]}
      issuedPermissions.14.to:
-        "0xE27d4Ed355e5273A3D4855c8e11BC4a8d3e39b87"
+        "0xdDf2F71Ab206C0138A8eceEb54386567D5abF01E"
      issuedPermissions.13.to:
-        "0xDfB23DFE9De7dcC974467195C8B7D5cd21C9d7cB"
+        "0xB51EDdfc9A945e2B909905e4F242C4796Ac0C61d"
      issuedPermissions.12.to:
-        "0xdDf2F71Ab206C0138A8eceEb54386567D5abF01E"
+        "0xAB1A39332e934300eBCc57B5f95cA90631a347FF"
      issuedPermissions.11.to:
-        "0xB51EDdfc9A945e2B909905e4F242C4796Ac0C61d"
+        "0x658e8123722462F888b6fa01a7dbcEFe1D6DD709"
      issuedPermissions.10.to:
-        "0xAB1A39332e934300eBCc57B5f95cA90631a347FF"
+        "0x610Aa279989F440820e14248BD3879B148717974"
      issuedPermissions.9.to:
-        "0x658e8123722462F888b6fa01a7dbcEFe1D6DD709"
+        "0x57004b440Cc4eb2FEd8c4d1865FaC907F9150C76"
      issuedPermissions.8.to:
-        "0x610Aa279989F440820e14248BD3879B148717974"
+        "0x54c0D3d6C101580dB3be8763A2aE2c6bb9dc840c"
      issuedPermissions.7.to:
-        "0x57004b440Cc4eb2FEd8c4d1865FaC907F9150C76"
+        "0x3B0369CAD35d257793F51c28213a4Cf4001397AC"
      issuedPermissions.6.to:
-        "0x54c0D3d6C101580dB3be8763A2aE2c6bb9dc840c"
+        "0x24Ca61c31C7f9Af3ab104dB6B9A444F28e9071e3"
      issuedPermissions.5.to:
-        "0x3B0369CAD35d257793F51c28213a4Cf4001397AC"
+        "0x1732BE6738117e9d22A84181AF68C8d09Cd4FF23"
      issuedPermissions.4.to:
-        "0x24Ca61c31C7f9Af3ab104dB6B9A444F28e9071e3"
+        "0x0fF813f6BD577c3D1cDbE435baC0621BE6aE34B4"
      issuedPermissions.3.permission:
-        "validate"
+        "upgrade"
      issuedPermissions.3.to:
-        "0x1732BE6738117e9d22A84181AF68C8d09Cd4FF23"
+        "0xF06E95eF589D9c38af242a8AAee8375f14023F85"
      issuedPermissions.3.description:
-        "Can propose new state roots (called nodes) and challenge state roots on the host chain."
      issuedPermissions.3.via.0:
+        {"address":"0x3ffFbAdAF827559da092217e474760E2b2c3CeDd"}
      issuedPermissions.2.permission:
-        "validate"
+        "upgrade"
      issuedPermissions.2.to:
-        "0x0fF813f6BD577c3D1cDbE435baC0621BE6aE34B4"
+        "0xE6841D92B0C345144506576eC13ECf5103aC7f49"
      issuedPermissions.2.description:
-        "Can propose new state roots (called nodes) and challenge state roots on the host chain."
      issuedPermissions.2.via.0:
+        {"address":"0x3ffFbAdAF827559da092217e474760E2b2c3CeDd"}
      issuedPermissions.1.permission:
-        "upgrade"
+        "interact"
      issuedPermissions.1.to:
-        "0xE6841D92B0C345144506576eC13ECf5103aC7f49"
+        "0xF06E95eF589D9c38af242a8AAee8375f14023F85"
      issuedPermissions.1.description:
+        "Pause and unpause and set important roles and parameters in the system contracts: Can delegate Sequencer management to a BatchPosterManager address, manage data availability and DACs, set the Sequencer-only window, introduce an allowList to the bridge and whitelist Inboxes/Outboxes."
    }
```

Generated with discovered.json: 0xea4fa7ccf590d971383137c823e544c9ddc56d0e

# Diff at Tue, 04 Feb 2025 12:31:45 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@145553eed7ba44636411ecb25e4099728acd02f9 block: 21628479
- current block number: 21628479

## Description

Rename 'configure' permission to 'interact'

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21628479 (main branch discovery), not current.

```diff
    contract SequencerInbox (0x211E1c4c7f1bF5351Ac850Ed10FD68CFfCF6c21b) {
    +++ description: A sequencer (registered in this contract) can submit transaction batches or commitments here.
      issuedPermissions.0.permission:
-        "configure"
+        "interact"
    }
```

```diff
    contract UpgradeExecutor (0x3ffFbAdAF827559da092217e474760E2b2c3CeDd) {
    +++ description: Central contract defining the access control permissions for upgrading the system contract implementations.
      directlyReceivedPermissions.4.permission:
-        "configure"
+        "interact"
    }
```

```diff
    contract BatchPosterManagerMultisig (0xd0FDA6925f502a3a94986dfe7C92FE19EBbD679B) {
    +++ description: None
      receivedPermissions.0.permission:
-        "configure"
+        "interact"
    }
```

```diff
    contract L1Timelock (0xE6841D92B0C345144506576eC13ECf5103aC7f49) {
    +++ description: None
      receivedPermissions.0.permission:
-        "configure"
+        "interact"
    }
```

```diff
    contract RollupProxy (0xFb209827c58283535b744575e11953DCC4bEAD88) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      issuedPermissions.0.permission:
-        "configure"
+        "interact"
    }
```

Generated with discovered.json: 0x6594438a752649a3abf16bf00f056998cf9e8c19

# Diff at Mon, 20 Jan 2025 11:09:48 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@2c8b4f3d9910bb6371be9b4df87b70856e7d8c64 block: 21628479
- current block number: 21628479

## Description

Rerun on the same block number. Applies fixes to permissions and via field. Renames permission's target to to/from.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21628479 (main branch discovery), not current.

```diff
    contract ValidatorWallet (0x1732BE6738117e9d22A84181AF68C8d09Cd4FF23) {
    +++ description: None
      issuedPermissions.0.target:
-        "0xd3132d052C9045D7cB0236586C9E2276e654343D"
      issuedPermissions.0.via.0.delay:
-        0
      issuedPermissions.0.to:
+        "0xd3132d052C9045D7cB0236586C9E2276e654343D"
      receivedPermissions.0.target:
-        "0xFb209827c58283535b744575e11953DCC4bEAD88"
      receivedPermissions.0.from:
+        "0xFb209827c58283535b744575e11953DCC4bEAD88"
    }
```

```diff
    contract SequencerInbox (0x211E1c4c7f1bF5351Ac850Ed10FD68CFfCF6c21b) {
    +++ description: A sequencer (registered in this contract) can submit transaction batches or commitments here.
      issuedPermissions.3.target:
-        "0xE6841D92B0C345144506576eC13ECf5103aC7f49"
      issuedPermissions.3.via.1.delay:
-        0
      issuedPermissions.3.via.0.delay:
-        0
      issuedPermissions.3.to:
+        "0xE6841D92B0C345144506576eC13ECf5103aC7f49"
      issuedPermissions.2.target:
-        "0xC1b634853Cb333D3aD8663715b08f41A3Aec47cc"
      issuedPermissions.2.to:
+        "0xC1b634853Cb333D3aD8663715b08f41A3Aec47cc"
      issuedPermissions.2.description:
+        "Can submit transaction batches or commitments to the SequencerInbox contract on the host chain."
      issuedPermissions.1.target:
-        "0x0C5911d57B24FCF1DC8B2608eFbAe57C7098E32D"
      issuedPermissions.1.to:
+        "0x0C5911d57B24FCF1DC8B2608eFbAe57C7098E32D"
      issuedPermissions.1.description:
+        "Can submit transaction batches or commitments to the SequencerInbox contract on the host chain."
      issuedPermissions.0.target:
-        "0xd0FDA6925f502a3a94986dfe7C92FE19EBbD679B"
      issuedPermissions.0.to:
+        "0xd0FDA6925f502a3a94986dfe7C92FE19EBbD679B"
      issuedPermissions.0.description:
+        "Add/remove batchPosters (Sequencers)."
    }
```

```diff
    contract L1CustomGateway (0x23122da8C581AA7E0d07A36Ff1f16F799650232f) {
    +++ description: Escrows deposited assets for the canonical bridge that are externally governed or need custom token contracts with e.g. minting rights or upgradeability.
      issuedPermissions.0.target:
-        "0xE6841D92B0C345144506576eC13ECf5103aC7f49"
      issuedPermissions.0.via.1.delay:
-        0
      issuedPermissions.0.via.0.delay:
-        0
      issuedPermissions.0.to:
+        "0xE6841D92B0C345144506576eC13ECf5103aC7f49"
    }
```

```diff
    contract ValidatorWallet (0x24Ca61c31C7f9Af3ab104dB6B9A444F28e9071e3) {
    +++ description: None
      issuedPermissions.0.target:
-        "0x9de97C570c1214f6c0ba08c2321d6a5F20D85a47"
      issuedPermissions.0.via.0.delay:
-        0
      issuedPermissions.0.to:
+        "0x9de97C570c1214f6c0ba08c2321d6a5F20D85a47"
      receivedPermissions.0.target:
-        "0xFb209827c58283535b744575e11953DCC4bEAD88"
      receivedPermissions.0.from:
+        "0xFb209827c58283535b744575e11953DCC4bEAD88"
    }
```

```diff
    contract RollupEventInbox (0x304807A7ed6c1296df2128E6ff3836e477329CD2) {
    +++ description: None
      issuedPermissions.0.target:
-        "0xE6841D92B0C345144506576eC13ECf5103aC7f49"
      issuedPermissions.0.via.1.delay:
-        0
      issuedPermissions.0.via.0.delay:
-        0
      issuedPermissions.0.to:
+        "0xE6841D92B0C345144506576eC13ECf5103aC7f49"
    }
```

```diff
    contract Validator (0x3B0369CAD35d257793F51c28213a4Cf4001397AC) {
    +++ description: None
      issuedPermissions.0.target:
-        "0x5B3E4404d05339D41A7E672BC912CBf511Cca294"
      issuedPermissions.0.via.0.delay:
-        0
      issuedPermissions.0.to:
+        "0x5B3E4404d05339D41A7E672BC912CBf511Cca294"
      receivedPermissions.0.target:
-        "0xFb209827c58283535b744575e11953DCC4bEAD88"
      receivedPermissions.0.from:
+        "0xFb209827c58283535b744575e11953DCC4bEAD88"
    }
```

```diff
    contract UpgradeExecutor (0x3ffFbAdAF827559da092217e474760E2b2c3CeDd) {
    +++ description: Central contract defining the access control permissions for upgrading the system contract implementations.
      issuedPermissions.0.target:
-        "0xE6841D92B0C345144506576eC13ECf5103aC7f49"
      issuedPermissions.0.via.1.delay:
-        0
      issuedPermissions.0.via.0.delay:
-        0
      issuedPermissions.0.to:
+        "0xE6841D92B0C345144506576eC13ECf5103aC7f49"
      directlyReceivedPermissions.5.target:
-        "0xFb209827c58283535b744575e11953DCC4bEAD88"
      directlyReceivedPermissions.5.from:
+        "0xFb209827c58283535b744575e11953DCC4bEAD88"
      directlyReceivedPermissions.4.target:
-        "0xFb209827c58283535b744575e11953DCC4bEAD88"
      directlyReceivedPermissions.4.from:
+        "0xFb209827c58283535b744575e11953DCC4bEAD88"
      directlyReceivedPermissions.3.target:
-        "0xF06E95eF589D9c38af242a8AAee8375f14023F85"
      directlyReceivedPermissions.3.from:
+        "0xF06E95eF589D9c38af242a8AAee8375f14023F85"
      directlyReceivedPermissions.2.target:
-        "0xa8f7DdEd54a726eB873E98bFF2C95ABF2d03e560"
      directlyReceivedPermissions.2.from:
+        "0xa8f7DdEd54a726eB873E98bFF2C95ABF2d03e560"
      directlyReceivedPermissions.1.target:
-        "0x71D78dC7cCC0e037e12de1E50f5470903ce37148"
      directlyReceivedPermissions.1.from:
+        "0x71D78dC7cCC0e037e12de1E50f5470903ce37148"
      directlyReceivedPermissions.0.target:
-        "0x5613AF0474EB9c528A34701A5b1662E3C8FA0678"
      directlyReceivedPermissions.0.from:
+        "0x5613AF0474EB9c528A34701A5b1662E3C8FA0678"
    }
```

```diff
    contract ProxyAdmin 2 (0x5613AF0474EB9c528A34701A5b1662E3C8FA0678) {
    +++ description: None
      directlyReceivedPermissions.1.target:
-        "0xE6841D92B0C345144506576eC13ECf5103aC7f49"
      directlyReceivedPermissions.1.from:
+        "0xE6841D92B0C345144506576eC13ECf5103aC7f49"
      directlyReceivedPermissions.0.target:
-        "0x3ffFbAdAF827559da092217e474760E2b2c3CeDd"
      directlyReceivedPermissions.0.from:
+        "0x3ffFbAdAF827559da092217e474760E2b2c3CeDd"
    }
```

```diff
    contract ValidatorWallet (0x57004b440Cc4eb2FEd8c4d1865FaC907F9150C76) {
    +++ description: None
      issuedPermissions.0.target:
-        "0xC234E41AE2cb00311956Aa7109fC801ae8c80941"
      issuedPermissions.0.via.0.delay:
-        0
      issuedPermissions.0.to:
+        "0xC234E41AE2cb00311956Aa7109fC801ae8c80941"
      receivedPermissions.0.target:
-        "0xFb209827c58283535b744575e11953DCC4bEAD88"
      receivedPermissions.0.from:
+        "0xFb209827c58283535b744575e11953DCC4bEAD88"
    }
```

```diff
    contract ValidatorWallet (0x658e8123722462F888b6fa01a7dbcEFe1D6DD709) {
    +++ description: None
      issuedPermissions.0.target:
-        "0xDfB23DFE9De7dcC974467195C8B7D5cd21C9d7cB"
      issuedPermissions.0.via.0.delay:
-        0
      issuedPermissions.0.to:
+        "0xDfB23DFE9De7dcC974467195C8B7D5cd21C9d7cB"
      receivedPermissions.0.target:
-        "0xFb209827c58283535b744575e11953DCC4bEAD88"
      receivedPermissions.0.from:
+        "0xFb209827c58283535b744575e11953DCC4bEAD88"
    }
```

```diff
    contract ProxyAdmin (0x71D78dC7cCC0e037e12de1E50f5470903ce37148) {
    +++ description: None
      directlyReceivedPermissions.5.target:
-        "0xD4B80C3D7240325D18E645B49e6535A3Bf95cc58"
      directlyReceivedPermissions.5.from:
+        "0xD4B80C3D7240325D18E645B49e6535A3Bf95cc58"
      directlyReceivedPermissions.4.target:
-        "0xc4448b71118c9071Bcb9734A0EAc55D18A153949"
      directlyReceivedPermissions.4.from:
+        "0xc4448b71118c9071Bcb9734A0EAc55D18A153949"
      directlyReceivedPermissions.3.target:
-        "0xC1Ebd02f738644983b6C4B2d440b8e77DdE276Bd"
      directlyReceivedPermissions.3.from:
+        "0xC1Ebd02f738644983b6C4B2d440b8e77DdE276Bd"
      directlyReceivedPermissions.2.target:
-        "0xA59075221b50C598aED0Eae0bB9869639513af0D"
      directlyReceivedPermissions.2.from:
+        "0xA59075221b50C598aED0Eae0bB9869639513af0D"
      directlyReceivedPermissions.1.target:
-        "0x304807A7ed6c1296df2128E6ff3836e477329CD2"
      directlyReceivedPermissions.1.from:
+        "0x304807A7ed6c1296df2128E6ff3836e477329CD2"
      directlyReceivedPermissions.0.target:
-        "0x211E1c4c7f1bF5351Ac850Ed10FD68CFfCF6c21b"
      directlyReceivedPermissions.0.from:
+        "0x211E1c4c7f1bF5351Ac850Ed10FD68CFfCF6c21b"
    }
```

```diff
    contract ProxyAdmin (0x8f6b82D007C0Ff4fd85fE84a5BFa89C00A4e6d2B) {
    +++ description: None
      directlyReceivedPermissions.0.target:
-        "0x658e8123722462F888b6fa01a7dbcEFe1D6DD709"
      directlyReceivedPermissions.0.from:
+        "0x658e8123722462F888b6fa01a7dbcEFe1D6DD709"
    }
```

```diff
    contract ChallengeManager (0xA59075221b50C598aED0Eae0bB9869639513af0D) {
    +++ description: Contract that allows challenging state roots. Can be called through the RollupProxy by Validators or the UpgradeExecutor.
      issuedPermissions.0.target:
-        "0xE6841D92B0C345144506576eC13ECf5103aC7f49"
      issuedPermissions.0.via.1.delay:
-        0
      issuedPermissions.0.via.0.delay:
-        0
      issuedPermissions.0.to:
+        "0xE6841D92B0C345144506576eC13ECf5103aC7f49"
    }
```

```diff
    contract ProxyAdmin 3 (0xa8f7DdEd54a726eB873E98bFF2C95ABF2d03e560) {
    +++ description: None
      directlyReceivedPermissions.2.target:
-        "0xC840838Bc438d73C16c2f8b22D2Ce3669963cD48"
      directlyReceivedPermissions.2.from:
+        "0xC840838Bc438d73C16c2f8b22D2Ce3669963cD48"
      directlyReceivedPermissions.1.target:
-        "0xB2535b988dcE19f9D71dfB22dB6da744aCac21bf"
      directlyReceivedPermissions.1.from:
+        "0xB2535b988dcE19f9D71dfB22dB6da744aCac21bf"
      directlyReceivedPermissions.0.target:
-        "0x23122da8C581AA7E0d07A36Ff1f16F799650232f"
      directlyReceivedPermissions.0.from:
+        "0x23122da8C581AA7E0d07A36Ff1f16F799650232f"
    }
```

```diff
    contract ProxyAdmin (0xAd3a14Fc16751d9E7FCa2A99aF85bf4d135e878d) {
    +++ description: None
      directlyReceivedPermissions.0.target:
-        "0x1732BE6738117e9d22A84181AF68C8d09Cd4FF23"
      directlyReceivedPermissions.0.from:
+        "0x1732BE6738117e9d22A84181AF68C8d09Cd4FF23"
    }
```

```diff
    contract L1ERC20Gateway (0xB2535b988dcE19f9D71dfB22dB6da744aCac21bf) {
    +++ description: Escrows deposited ERC-20 assets for the canonical Bridge. Upon depositing, a generic token representation will be minted at the destination. Withdrawals are initiated by the Outbox contract.
      issuedPermissions.0.target:
-        "0xE6841D92B0C345144506576eC13ECf5103aC7f49"
      issuedPermissions.0.via.1.delay:
-        0
      issuedPermissions.0.via.0.delay:
-        0
      issuedPermissions.0.to:
+        "0xE6841D92B0C345144506576eC13ECf5103aC7f49"
    }
```

```diff
    contract ProxyAdmin (0xb31407BCf91d54AbFC0B7ef61bFc71b8b71F0678) {
    +++ description: None
      directlyReceivedPermissions.0.target:
-        "0x24Ca61c31C7f9Af3ab104dB6B9A444F28e9071e3"
      directlyReceivedPermissions.0.from:
+        "0x24Ca61c31C7f9Af3ab104dB6B9A444F28e9071e3"
    }
```

```diff
    contract ProxyAdmin (0xb85e18C8F552c823CdA4DCd9056213bDc970f9AE) {
    +++ description: None
      directlyReceivedPermissions.0.target:
-        "0x3B0369CAD35d257793F51c28213a4Cf4001397AC"
      directlyReceivedPermissions.0.from:
+        "0x3B0369CAD35d257793F51c28213a4Cf4001397AC"
    }
```

```diff
    contract Bridge (0xC1Ebd02f738644983b6C4B2d440b8e77DdE276Bd) {
    +++ description: Escrow contract for the project's gas token (can be different from ETH). Keeps a list of allowed Inboxes and Outboxes for canonical bridge messaging.
      issuedPermissions.0.target:
-        "0xE6841D92B0C345144506576eC13ECf5103aC7f49"
      issuedPermissions.0.via.1.delay:
-        0
      issuedPermissions.0.via.0.delay:
-        0
      issuedPermissions.0.to:
+        "0xE6841D92B0C345144506576eC13ECf5103aC7f49"
    }
```

```diff
    contract ValidatorOwnerMultisig (0xC234E41AE2cb00311956Aa7109fC801ae8c80941) {
    +++ description: None
      receivedPermissions.1.target:
-        "0xE27d4Ed355e5273A3D4855c8e11BC4a8d3e39b87"
      receivedPermissions.1.from:
+        "0xE27d4Ed355e5273A3D4855c8e11BC4a8d3e39b87"
      receivedPermissions.0.target:
-        "0x57004b440Cc4eb2FEd8c4d1865FaC907F9150C76"
      receivedPermissions.0.from:
+        "0x57004b440Cc4eb2FEd8c4d1865FaC907F9150C76"
      directlyReceivedPermissions.1.target:
-        "0xF32e5B5Ad94c0c0F83E0023b0AC48A93A8a2a428"
      directlyReceivedPermissions.1.from:
+        "0xF32e5B5Ad94c0c0F83E0023b0AC48A93A8a2a428"
      directlyReceivedPermissions.0.target:
-        "0xE4d0Ba69d082Fdf6f51b8fc8F92c19bF00B1a1B4"
      directlyReceivedPermissions.0.from:
+        "0xE4d0Ba69d082Fdf6f51b8fc8F92c19bF00B1a1B4"
    }
```

```diff
    contract Inbox (0xc4448b71118c9071Bcb9734A0EAc55D18A153949) {
    +++ description: None
      issuedPermissions.0.target:
-        "0xE6841D92B0C345144506576eC13ECf5103aC7f49"
      issuedPermissions.0.via.1.delay:
-        0
      issuedPermissions.0.via.0.delay:
-        0
      issuedPermissions.0.to:
+        "0xE6841D92B0C345144506576eC13ECf5103aC7f49"
    }
```

```diff
    contract L1GatewayRouter (0xC840838Bc438d73C16c2f8b22D2Ce3669963cD48) {
    +++ description: This routing contract maps tokens to the correct escrow (gateway) to be then bridged with canonical messaging.
      issuedPermissions.0.target:
-        "0xE6841D92B0C345144506576eC13ECf5103aC7f49"
      issuedPermissions.0.via.1.delay:
-        0
      issuedPermissions.0.via.0.delay:
-        0
      issuedPermissions.0.to:
+        "0xE6841D92B0C345144506576eC13ECf5103aC7f49"
    }
```

```diff
    contract BatchPosterManagerMultisig (0xd0FDA6925f502a3a94986dfe7C92FE19EBbD679B) {
    +++ description: None
      receivedPermissions.0.target:
-        "0x211E1c4c7f1bF5351Ac850Ed10FD68CFfCF6c21b"
      receivedPermissions.0.from:
+        "0x211E1c4c7f1bF5351Ac850Ed10FD68CFfCF6c21b"
    }
```

```diff
    contract Outbox (0xD4B80C3D7240325D18E645B49e6535A3Bf95cc58) {
    +++ description: Facilitates L2 to L1 contract calls: Messages initiated from L2 (for example withdrawal messages) eventually resolve in execution on L1.
      issuedPermissions.0.target:
-        "0xE6841D92B0C345144506576eC13ECf5103aC7f49"
      issuedPermissions.0.via.1.delay:
-        0
      issuedPermissions.0.via.0.delay:
-        0
      issuedPermissions.0.to:
+        "0xE6841D92B0C345144506576eC13ECf5103aC7f49"
    }
```

```diff
    contract ValidatorWallet (0xE27d4Ed355e5273A3D4855c8e11BC4a8d3e39b87) {
    +++ description: None
      issuedPermissions.0.target:
-        "0xC234E41AE2cb00311956Aa7109fC801ae8c80941"
      issuedPermissions.0.via.0.delay:
-        0
      issuedPermissions.0.to:
+        "0xC234E41AE2cb00311956Aa7109fC801ae8c80941"
      receivedPermissions.0.target:
-        "0xFb209827c58283535b744575e11953DCC4bEAD88"
      receivedPermissions.0.from:
+        "0xFb209827c58283535b744575e11953DCC4bEAD88"
    }
```

```diff
    contract ProxyAdmin (0xE4d0Ba69d082Fdf6f51b8fc8F92c19bF00B1a1B4) {
    +++ description: None
      directlyReceivedPermissions.0.target:
-        "0xE27d4Ed355e5273A3D4855c8e11BC4a8d3e39b87"
      directlyReceivedPermissions.0.from:
+        "0xE27d4Ed355e5273A3D4855c8e11BC4a8d3e39b87"
    }
```

```diff
    contract L1Timelock (0xE6841D92B0C345144506576eC13ECf5103aC7f49) {
    +++ description: None
      issuedPermissions.0.target:
-        "0xE6841D92B0C345144506576eC13ECf5103aC7f49"
      issuedPermissions.0.via.1.delay:
-        0
      issuedPermissions.0.via.0.delay:
-        0
      issuedPermissions.0.to:
+        "0xE6841D92B0C345144506576eC13ECf5103aC7f49"
      receivedPermissions.12.target:
-        "0xFb209827c58283535b744575e11953DCC4bEAD88"
      receivedPermissions.12.from:
+        "0xFb209827c58283535b744575e11953DCC4bEAD88"
      receivedPermissions.11.target:
-        "0xE6841D92B0C345144506576eC13ECf5103aC7f49"
      receivedPermissions.11.from:
+        "0xE6841D92B0C345144506576eC13ECf5103aC7f49"
      receivedPermissions.10.target:
-        "0xD4B80C3D7240325D18E645B49e6535A3Bf95cc58"
      receivedPermissions.10.from:
+        "0xD4B80C3D7240325D18E645B49e6535A3Bf95cc58"
      receivedPermissions.9.target:
-        "0xC840838Bc438d73C16c2f8b22D2Ce3669963cD48"
      receivedPermissions.9.from:
+        "0xC840838Bc438d73C16c2f8b22D2Ce3669963cD48"
      receivedPermissions.8.target:
-        "0xc4448b71118c9071Bcb9734A0EAc55D18A153949"
      receivedPermissions.8.from:
+        "0xc4448b71118c9071Bcb9734A0EAc55D18A153949"
      receivedPermissions.7.target:
-        "0xC1Ebd02f738644983b6C4B2d440b8e77DdE276Bd"
      receivedPermissions.7.from:
+        "0xC1Ebd02f738644983b6C4B2d440b8e77DdE276Bd"
      receivedPermissions.6.target:
-        "0xB2535b988dcE19f9D71dfB22dB6da744aCac21bf"
      receivedPermissions.6.from:
+        "0xB2535b988dcE19f9D71dfB22dB6da744aCac21bf"
      receivedPermissions.5.target:
-        "0xA59075221b50C598aED0Eae0bB9869639513af0D"
      receivedPermissions.5.from:
+        "0xA59075221b50C598aED0Eae0bB9869639513af0D"
      receivedPermissions.4.target:
-        "0x3ffFbAdAF827559da092217e474760E2b2c3CeDd"
      receivedPermissions.4.from:
+        "0x3ffFbAdAF827559da092217e474760E2b2c3CeDd"
      receivedPermissions.3.target:
-        "0x304807A7ed6c1296df2128E6ff3836e477329CD2"
      receivedPermissions.3.from:
+        "0x304807A7ed6c1296df2128E6ff3836e477329CD2"
      receivedPermissions.2.target:
-        "0x23122da8C581AA7E0d07A36Ff1f16F799650232f"
      receivedPermissions.2.from:
+        "0x23122da8C581AA7E0d07A36Ff1f16F799650232f"
      receivedPermissions.1.target:
-        "0x211E1c4c7f1bF5351Ac850Ed10FD68CFfCF6c21b"
      receivedPermissions.1.from:
+        "0x211E1c4c7f1bF5351Ac850Ed10FD68CFfCF6c21b"
      receivedPermissions.0.target:
-        "0xFb209827c58283535b744575e11953DCC4bEAD88"
      receivedPermissions.0.from:
+        "0xFb209827c58283535b744575e11953DCC4bEAD88"
      directlyReceivedPermissions.0.target:
-        "0x3ffFbAdAF827559da092217e474760E2b2c3CeDd"
      directlyReceivedPermissions.0.from:
+        "0x3ffFbAdAF827559da092217e474760E2b2c3CeDd"
    }
```

```diff
    contract SecurityCouncil (0xF06E95eF589D9c38af242a8AAee8375f14023F85) {
    +++ description: None
      directlyReceivedPermissions.0.target:
-        "0x3ffFbAdAF827559da092217e474760E2b2c3CeDd"
      directlyReceivedPermissions.0.from:
+        "0x3ffFbAdAF827559da092217e474760E2b2c3CeDd"
    }
```

```diff
    contract ProxyAdmin (0xF32e5B5Ad94c0c0F83E0023b0AC48A93A8a2a428) {
    +++ description: None
      directlyReceivedPermissions.0.target:
-        "0x57004b440Cc4eb2FEd8c4d1865FaC907F9150C76"
      directlyReceivedPermissions.0.from:
+        "0x57004b440Cc4eb2FEd8c4d1865FaC907F9150C76"
    }
```

```diff
    contract RollupProxy (0xFb209827c58283535b744575e11953DCC4bEAD88) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      issuedPermissions.14.target:
-        "0xE27d4Ed355e5273A3D4855c8e11BC4a8d3e39b87"
      issuedPermissions.14.to:
+        "0xE27d4Ed355e5273A3D4855c8e11BC4a8d3e39b87"
      issuedPermissions.14.description:
+        "Can propose new state roots (called nodes) and challenge state roots on the host chain."
      issuedPermissions.13.target:
-        "0xDfB23DFE9De7dcC974467195C8B7D5cd21C9d7cB"
      issuedPermissions.13.to:
+        "0xDfB23DFE9De7dcC974467195C8B7D5cd21C9d7cB"
      issuedPermissions.13.description:
+        "Can propose new state roots (called nodes) and challenge state roots on the host chain."
      issuedPermissions.12.target:
-        "0xdDf2F71Ab206C0138A8eceEb54386567D5abF01E"
      issuedPermissions.12.to:
+        "0xdDf2F71Ab206C0138A8eceEb54386567D5abF01E"
      issuedPermissions.12.description:
+        "Can propose new state roots (called nodes) and challenge state roots on the host chain."
      issuedPermissions.11.target:
-        "0xB51EDdfc9A945e2B909905e4F242C4796Ac0C61d"
      issuedPermissions.11.to:
+        "0xB51EDdfc9A945e2B909905e4F242C4796Ac0C61d"
      issuedPermissions.11.description:
+        "Can propose new state roots (called nodes) and challenge state roots on the host chain."
      issuedPermissions.10.target:
-        "0xAB1A39332e934300eBCc57B5f95cA90631a347FF"
      issuedPermissions.10.to:
+        "0xAB1A39332e934300eBCc57B5f95cA90631a347FF"
      issuedPermissions.10.description:
+        "Can propose new state roots (called nodes) and challenge state roots on the host chain."
      issuedPermissions.9.target:
-        "0x658e8123722462F888b6fa01a7dbcEFe1D6DD709"
      issuedPermissions.9.to:
+        "0x658e8123722462F888b6fa01a7dbcEFe1D6DD709"
      issuedPermissions.9.description:
+        "Can propose new state roots (called nodes) and challenge state roots on the host chain."
      issuedPermissions.8.target:
-        "0x610Aa279989F440820e14248BD3879B148717974"
      issuedPermissions.8.to:
+        "0x610Aa279989F440820e14248BD3879B148717974"
      issuedPermissions.8.description:
+        "Can propose new state roots (called nodes) and challenge state roots on the host chain."
      issuedPermissions.7.target:
-        "0x57004b440Cc4eb2FEd8c4d1865FaC907F9150C76"
      issuedPermissions.7.to:
+        "0x57004b440Cc4eb2FEd8c4d1865FaC907F9150C76"
      issuedPermissions.7.description:
+        "Can propose new state roots (called nodes) and challenge state roots on the host chain."
      issuedPermissions.6.target:
-        "0x54c0D3d6C101580dB3be8763A2aE2c6bb9dc840c"
      issuedPermissions.6.to:
+        "0x54c0D3d6C101580dB3be8763A2aE2c6bb9dc840c"
      issuedPermissions.6.description:
+        "Can propose new state roots (called nodes) and challenge state roots on the host chain."
      issuedPermissions.5.target:
-        "0x3B0369CAD35d257793F51c28213a4Cf4001397AC"
      issuedPermissions.5.to:
+        "0x3B0369CAD35d257793F51c28213a4Cf4001397AC"
      issuedPermissions.5.description:
+        "Can propose new state roots (called nodes) and challenge state roots on the host chain."
      issuedPermissions.4.target:
-        "0x24Ca61c31C7f9Af3ab104dB6B9A444F28e9071e3"
      issuedPermissions.4.to:
+        "0x24Ca61c31C7f9Af3ab104dB6B9A444F28e9071e3"
      issuedPermissions.4.description:
+        "Can propose new state roots (called nodes) and challenge state roots on the host chain."
      issuedPermissions.3.target:
-        "0x1732BE6738117e9d22A84181AF68C8d09Cd4FF23"
      issuedPermissions.3.to:
+        "0x1732BE6738117e9d22A84181AF68C8d09Cd4FF23"
      issuedPermissions.3.description:
+        "Can propose new state roots (called nodes) and challenge state roots on the host chain."
      issuedPermissions.2.target:
-        "0x0fF813f6BD577c3D1cDbE435baC0621BE6aE34B4"
      issuedPermissions.2.to:
+        "0x0fF813f6BD577c3D1cDbE435baC0621BE6aE34B4"
      issuedPermissions.2.description:
+        "Can propose new state roots (called nodes) and challenge state roots on the host chain."
      issuedPermissions.1.target:
-        "0xE6841D92B0C345144506576eC13ECf5103aC7f49"
      issuedPermissions.1.via.0.delay:
-        0
      issuedPermissions.1.to:
+        "0xE6841D92B0C345144506576eC13ECf5103aC7f49"
      issuedPermissions.0.target:
-        "0xE6841D92B0C345144506576eC13ECf5103aC7f49"
      issuedPermissions.0.via.0.delay:
-        0
      issuedPermissions.0.via.0.description:
-        "Pause and unpause and set important roles and parameters in the system contracts: Can delegate Sequencer management to a BatchPosterManager address, manage data availability and DACs, set the Sequencer-only window, introduce an allowList to the bridge and whitelist Inboxes/Outboxes."
      issuedPermissions.0.to:
+        "0xE6841D92B0C345144506576eC13ECf5103aC7f49"
      issuedPermissions.0.description:
+        "Pause and unpause and set important roles and parameters in the system contracts: Can delegate Sequencer management to a BatchPosterManager address, manage data availability and DACs, set the Sequencer-only window, introduce an allowList to the bridge and whitelist Inboxes/Outboxes."
    }
```

Generated with discovered.json: 0x5b634fbc6780fb20f3f2468ec719309a306b3959

# Diff at Wed, 15 Jan 2025 07:47:07 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@3ea176aee1470e5ec80e65adfc81a954f84584d8 block: 21579692
- current block number: 21628479

## Description

Config related: displayName.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21579692 (main branch discovery), not current.

```diff
    contract ProxyAdmin 2 (0x5613AF0474EB9c528A34701A5b1662E3C8FA0678) {
    +++ description: None
      displayName:
+        "ProxyAdmin"
    }
```

```diff
    contract ProxyAdmin 3 (0xa8f7DdEd54a726eB873E98bFF2C95ABF2d03e560) {
    +++ description: None
      displayName:
+        "ProxyAdmin"
    }
```

Generated with discovered.json: 0x9bfed01e3eec698c905f63e740b988a76f5e376f

# Diff at Wed, 08 Jan 2025 12:15:39 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@3e3597c92f09cb5fc5a7ac01db63929f663c026f block: 21465192
- current block number: 21579692

## Description

SC sync / member address rotation.

## Watched changes

```diff
    contract SecurityCouncil (0xF06E95eF589D9c38af242a8AAee8375f14023F85) {
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

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21465192 (main branch discovery), not current.

```diff
    contract Bridge (0xC1Ebd02f738644983b6C4B2d440b8e77DdE276Bd) {
    +++ description: Escrow contract for the project's gas token (can be different from ETH). Keeps a list of allowed Inboxes and Outboxes for canonical bridge messaging.
      description:
-        "Escrow contract for the project's gas token (Can be different from ETH). Keeps a list of allowed Inboxes and Outboxes for canonical bridge messaging."
+        "Escrow contract for the project's gas token (can be different from ETH). Keeps a list of allowed Inboxes and Outboxes for canonical bridge messaging."
    }
```

Generated with discovered.json: 0xd19504573def441fb1707494e4476428dce86fb9

# Diff at Mon, 23 Dec 2024 12:30:40 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@18325a975c44684702f30ee366361589e4c2ed8c block: 21292425
- current block number: 21465192

## Description

Config related: Celestia-Nitro wmroot added.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21292425 (main branch discovery), not current.

```diff
    contract RollupProxy (0xFb209827c58283535b744575e11953DCC4bEAD88) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      usedTypes.0.arg.0xe81f986823a85105c5fd91bb53b4493d38c0c26652d23f76a7405ac889908287:
+        "Celestia Nitro 3.2.1 wasmModuleRoot"
    }
```

Generated with discovered.json: 0xa3f4ed824abfc1336f01b545136be2b814c11c25

# Diff at Fri, 06 Dec 2024 08:09:47 GMT:

- author: Piotr Szlachciak (<szlachciak.piotr@gmail.com>)
- comparing to: main@f9ded76f7930b0c86788e4c4595d553b165b87d1 block: 21292425
- current block number: 21292425

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21292425 (main branch discovery), not current.

```diff
    contract ValidatorUtils (0x2B081fbaB646D9013f2699BebEf62B7e7d7F0976) {
    +++ description: This contract implements view only utilities for validators.
      template:
+        "orbitstack/ValidatorUtils"
      description:
+        "This contract implements view only utilities for validators."
    }
```

Generated with discovered.json: 0xd2fa6299dc91b7746ed05988dd21b9f11697aa5d

# Diff at Fri, 29 Nov 2024 11:28:42 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@9776abb8b1f960f6f1ec6ec27558b5eff7eb5b87 block: 21292425
- current block number: 21292425

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21292425 (main branch discovery), not current.

```diff
    contract SequencerInbox (0x211E1c4c7f1bF5351Ac850Ed10FD68CFfCF6c21b) {
    +++ description: A sequencer (registered in this contract) can submit transaction batches or commitments here.
      issuedPermissions.3:
+        {"permission":"upgrade","target":"0xE6841D92B0C345144506576eC13ECf5103aC7f49","via":[{"address":"0x3ffFbAdAF827559da092217e474760E2b2c3CeDd","delay":0},{"address":"0x71D78dC7cCC0e037e12de1E50f5470903ce37148","delay":0}]}
      issuedPermissions.2.permission:
-        "upgrade"
+        "sequence"
      issuedPermissions.2.target:
-        "0xE6841D92B0C345144506576eC13ECf5103aC7f49"
+        "0xC1b634853Cb333D3aD8663715b08f41A3Aec47cc"
      issuedPermissions.2.via.1:
-        {"address":"0x71D78dC7cCC0e037e12de1E50f5470903ce37148","delay":0}
      issuedPermissions.2.via.0:
-        {"address":"0x3ffFbAdAF827559da092217e474760E2b2c3CeDd","delay":0}
      issuedPermissions.1.target:
-        "0xC1b634853Cb333D3aD8663715b08f41A3Aec47cc"
+        "0x0C5911d57B24FCF1DC8B2608eFbAe57C7098E32D"
      issuedPermissions.0.permission:
-        "sequence"
+        "configure"
      issuedPermissions.0.target:
-        "0x0C5911d57B24FCF1DC8B2608eFbAe57C7098E32D"
+        "0xd0FDA6925f502a3a94986dfe7C92FE19EBbD679B"
    }
```

```diff
    contract UpgradeExecutor (0x3ffFbAdAF827559da092217e474760E2b2c3CeDd) {
    +++ description: Central contract defining the access control permissions for upgrading the system contract implementations.
      directlyReceivedPermissions.4.description:
-        "can pause and unpause and set important roles and parameters in the system contracts: Can delegate Sequencer management to a BatchPosterManager address, manage data availability and DACs, set the Sequencer-only window, introduce an allowList to the bridge and whitelist Inboxes/Outboxes."
+        "Pause and unpause and set important roles and parameters in the system contracts: Can delegate Sequencer management to a BatchPosterManager address, manage data availability and DACs, set the Sequencer-only window, introduce an allowList to the bridge and whitelist Inboxes/Outboxes."
    }
```

```diff
    contract BatchPosterManagerMultisig (0xd0FDA6925f502a3a94986dfe7C92FE19EBbD679B) {
    +++ description: None
      receivedPermissions:
+        [{"permission":"configure","target":"0x211E1c4c7f1bF5351Ac850Ed10FD68CFfCF6c21b","description":"Add/remove batchPosters (Sequencers)."}]
    }
```

```diff
    contract L1Timelock (0xE6841D92B0C345144506576eC13ECf5103aC7f49) {
    +++ description: None
      receivedPermissions.0.description:
-        "can pause and unpause and set important roles and parameters in the system contracts: Can delegate Sequencer management to a BatchPosterManager address, manage data availability and DACs, set the Sequencer-only window, introduce an allowList to the bridge and whitelist Inboxes/Outboxes."
+        "Pause and unpause and set important roles and parameters in the system contracts: Can delegate Sequencer management to a BatchPosterManager address, manage data availability and DACs, set the Sequencer-only window, introduce an allowList to the bridge and whitelist Inboxes/Outboxes."
    }
```

```diff
    contract RollupProxy (0xFb209827c58283535b744575e11953DCC4bEAD88) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      issuedPermissions.0.via.0.description:
-        "can pause and unpause and set important roles and parameters in the system contracts: Can delegate Sequencer management to a BatchPosterManager address, manage data availability and DACs, set the Sequencer-only window, introduce an allowList to the bridge and whitelist Inboxes/Outboxes."
+        "Pause and unpause and set important roles and parameters in the system contracts: Can delegate Sequencer management to a BatchPosterManager address, manage data availability and DACs, set the Sequencer-only window, introduce an allowList to the bridge and whitelist Inboxes/Outboxes."
      fieldMeta.minimumAssertionPeriod:
+        {"description":"Minimum time delta between newly created nodes (stateUpdates). This is checked on `stakeOnNewNode()`. Format is number of ETHEREUM blocks, even for L3s. "}
    }
```

Generated with discovered.json: 0xb9119f206f868065d67dae4fd296d62a198034b5

# Diff at Fri, 29 Nov 2024 09:22:24 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@c60f4ba86fcd7b86d6876d1634b83081095f33d7 block: 21234620
- current block number: 21292425

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21234620 (main branch discovery), not current.

```diff
    contract SequencerInbox (0x211E1c4c7f1bF5351Ac850Ed10FD68CFfCF6c21b) {
    +++ description: A sequencer (registered in this contract) can submit transaction batches or commitments here.
      issuedPermissions.2.target:
-        "0x3ffFbAdAF827559da092217e474760E2b2c3CeDd"
+        "0xE6841D92B0C345144506576eC13ECf5103aC7f49"
      issuedPermissions.2.via.1:
+        {"address":"0x71D78dC7cCC0e037e12de1E50f5470903ce37148","delay":0}
      issuedPermissions.2.via.0.address:
-        "0x71D78dC7cCC0e037e12de1E50f5470903ce37148"
+        "0x3ffFbAdAF827559da092217e474760E2b2c3CeDd"
+++ description: Settable by the Rollup Owner. Transactions can only be force-included after the `delayBlocks` window (Sequencer-only) has passed.
      values.maxTimeVariation:
-        [5760,64,86400,768]
+        {"delayBlocks":5760,"futureBlocks":64,"delaySeconds":86400,"futureSeconds":768}
      values.postsBlobs:
+        false
      values.setIsBatchPosterCount:
+        3
      template:
+        "orbitstack/SequencerInbox"
      description:
+        "A sequencer (registered in this contract) can submit transaction batches or commitments here."
      fieldMeta:
+        {"maxTimeVariation":{"description":"Settable by the Rollup Owner. Transactions can only be force-included after the `delayBlocks` window (Sequencer-only) has passed."}}
    }
```

```diff
    contract L1CustomGateway (0x23122da8C581AA7E0d07A36Ff1f16F799650232f) {
    +++ description: Escrows deposited assets for the canonical bridge that are externally governed or need custom token contracts with e.g. minting rights or upgradeability.
      issuedPermissions.0.target:
-        "0x3ffFbAdAF827559da092217e474760E2b2c3CeDd"
+        "0xE6841D92B0C345144506576eC13ECf5103aC7f49"
      issuedPermissions.0.via.1:
+        {"address":"0xa8f7DdEd54a726eB873E98bFF2C95ABF2d03e560","delay":0}
      issuedPermissions.0.via.0.address:
-        "0xa8f7DdEd54a726eB873E98bFF2C95ABF2d03e560"
+        "0x3ffFbAdAF827559da092217e474760E2b2c3CeDd"
    }
```

```diff
    contract RollupEventInbox (0x304807A7ed6c1296df2128E6ff3836e477329CD2) {
    +++ description: None
      issuedPermissions.0.target:
-        "0x3ffFbAdAF827559da092217e474760E2b2c3CeDd"
+        "0xE6841D92B0C345144506576eC13ECf5103aC7f49"
      issuedPermissions.0.via.1:
+        {"address":"0x71D78dC7cCC0e037e12de1E50f5470903ce37148","delay":0}
      issuedPermissions.0.via.0.address:
-        "0x71D78dC7cCC0e037e12de1E50f5470903ce37148"
+        "0x3ffFbAdAF827559da092217e474760E2b2c3CeDd"
    }
```

```diff
    contract Validator (0x3B0369CAD35d257793F51c28213a4Cf4001397AC) {
    +++ description: None
      issuedPermissions.0.target:
-        "0xb85e18C8F552c823CdA4DCd9056213bDc970f9AE"
+        "0x5B3E4404d05339D41A7E672BC912CBf511Cca294"
      issuedPermissions.0.via.0:
+        {"address":"0xb85e18C8F552c823CdA4DCd9056213bDc970f9AE","delay":0}
    }
```

```diff
    contract UpgradeExecutor (0x3ffFbAdAF827559da092217e474760E2b2c3CeDd) {
    +++ description: Central contract defining the access control permissions for upgrading the system contract implementations.
      issuedPermissions.0.target:
-        "0x3ffFbAdAF827559da092217e474760E2b2c3CeDd"
+        "0xE6841D92B0C345144506576eC13ECf5103aC7f49"
      issuedPermissions.0.via.1:
+        {"address":"0x5613AF0474EB9c528A34701A5b1662E3C8FA0678","delay":0}
      issuedPermissions.0.via.0.address:
-        "0x5613AF0474EB9c528A34701A5b1662E3C8FA0678"
+        "0x3ffFbAdAF827559da092217e474760E2b2c3CeDd"
      receivedPermissions:
-        [{"permission":"configure","target":"0xFb209827c58283535b744575e11953DCC4bEAD88","description":"can pause and unpause and set important roles and parameters in the system contracts: Can delegate Sequencer management to a BatchPosterManager address, manage data availability and DACs, set the Sequencer-only window, introduce an allowList to the bridge and whitelist Inboxes/Outboxes."},{"permission":"upgrade","target":"0x211E1c4c7f1bF5351Ac850Ed10FD68CFfCF6c21b","via":[{"address":"0x71D78dC7cCC0e037e12de1E50f5470903ce37148"}]},{"permission":"upgrade","target":"0x23122da8C581AA7E0d07A36Ff1f16F799650232f","via":[{"address":"0xa8f7DdEd54a726eB873E98bFF2C95ABF2d03e560"}]},{"permission":"upgrade","target":"0x304807A7ed6c1296df2128E6ff3836e477329CD2","via":[{"address":"0x71D78dC7cCC0e037e12de1E50f5470903ce37148"}]},{"permission":"upgrade","target":"0x3ffFbAdAF827559da092217e474760E2b2c3CeDd","via":[{"address":"0x5613AF0474EB9c528A34701A5b1662E3C8FA0678"}]},{"permission":"upgrade","target":"0xA59075221b50C598aED0Eae0bB9869639513af0D","via":[{"address":"0x71D78dC7cCC0e037e12de1E50f5470903ce37148"}]},{"permission":"upgrade","target":"0xB2535b988dcE19f9D71dfB22dB6da744aCac21bf","via":[{"address":"0xa8f7DdEd54a726eB873E98bFF2C95ABF2d03e560"}]},{"permission":"upgrade","target":"0xC1Ebd02f738644983b6C4B2d440b8e77DdE276Bd","via":[{"address":"0x71D78dC7cCC0e037e12de1E50f5470903ce37148"}]},{"permission":"upgrade","target":"0xc4448b71118c9071Bcb9734A0EAc55D18A153949","via":[{"address":"0x71D78dC7cCC0e037e12de1E50f5470903ce37148"}]},{"permission":"upgrade","target":"0xC840838Bc438d73C16c2f8b22D2Ce3669963cD48","via":[{"address":"0xa8f7DdEd54a726eB873E98bFF2C95ABF2d03e560"}]},{"permission":"upgrade","target":"0xD4B80C3D7240325D18E645B49e6535A3Bf95cc58","via":[{"address":"0x71D78dC7cCC0e037e12de1E50f5470903ce37148"}]},{"permission":"upgrade","target":"0xE6841D92B0C345144506576eC13ECf5103aC7f49","via":[{"address":"0x5613AF0474EB9c528A34701A5b1662E3C8FA0678"}]},{"permission":"upgrade","target":"0xFb209827c58283535b744575e11953DCC4bEAD88"}]
      directlyReceivedPermissions.5:
+        {"permission":"upgrade","target":"0xFb209827c58283535b744575e11953DCC4bEAD88"}
      directlyReceivedPermissions.4:
+        {"permission":"configure","target":"0xFb209827c58283535b744575e11953DCC4bEAD88","description":"can pause and unpause and set important roles and parameters in the system contracts: Can delegate Sequencer management to a BatchPosterManager address, manage data availability and DACs, set the Sequencer-only window, introduce an allowList to the bridge and whitelist Inboxes/Outboxes."}
      values.executors:
+        ["0xE6841D92B0C345144506576eC13ECf5103aC7f49","0xF06E95eF589D9c38af242a8AAee8375f14023F85"]
      template:
+        "orbitstack/UpgradeExecutor"
      description:
+        "Central contract defining the access control permissions for upgrading the system contract implementations."
    }
```

```diff
    contract ChallengeManager (0xA59075221b50C598aED0Eae0bB9869639513af0D) {
    +++ description: Contract that allows challenging state roots. Can be called through the RollupProxy by Validators or the UpgradeExecutor.
      issuedPermissions.0.target:
-        "0x3ffFbAdAF827559da092217e474760E2b2c3CeDd"
+        "0xE6841D92B0C345144506576eC13ECf5103aC7f49"
      issuedPermissions.0.via.1:
+        {"address":"0x71D78dC7cCC0e037e12de1E50f5470903ce37148","delay":0}
      issuedPermissions.0.via.0.address:
-        "0x71D78dC7cCC0e037e12de1E50f5470903ce37148"
+        "0x3ffFbAdAF827559da092217e474760E2b2c3CeDd"
    }
```

```diff
    contract L1ERC20Gateway (0xB2535b988dcE19f9D71dfB22dB6da744aCac21bf) {
    +++ description: Escrows deposited ERC-20 assets for the canonical Bridge. Upon depositing, a generic token representation will be minted at the destination. Withdrawals are initiated by the Outbox contract.
      issuedPermissions.0.target:
-        "0x3ffFbAdAF827559da092217e474760E2b2c3CeDd"
+        "0xE6841D92B0C345144506576eC13ECf5103aC7f49"
      issuedPermissions.0.via.1:
+        {"address":"0xa8f7DdEd54a726eB873E98bFF2C95ABF2d03e560","delay":0}
      issuedPermissions.0.via.0.address:
-        "0xa8f7DdEd54a726eB873E98bFF2C95ABF2d03e560"
+        "0x3ffFbAdAF827559da092217e474760E2b2c3CeDd"
      template:
+        "orbitstack/ERC20Gateway"
      displayName:
+        "ERC20Gateway"
      description:
+        "Escrows deposited ERC-20 assets for the canonical Bridge. Upon depositing, a generic token representation will be minted at the destination. Withdrawals are initiated by the Outbox contract."
    }
```

```diff
-   Status: DELETED
    contract  (0xb5f6951AB2504442c3F6dD37fF1E1D1d253C5097)
    +++ description: None
```

```diff
    contract ProxyAdmin (0xb85e18C8F552c823CdA4DCd9056213bDc970f9AE) {
    +++ description: None
      receivedPermissions:
-        [{"permission":"upgrade","target":"0x3B0369CAD35d257793F51c28213a4Cf4001397AC"}]
      template:
+        "global/ProxyAdmin"
      directlyReceivedPermissions:
+        [{"permission":"upgrade","target":"0x3B0369CAD35d257793F51c28213a4Cf4001397AC"}]
    }
```

```diff
    contract Bridge (0xC1Ebd02f738644983b6C4B2d440b8e77DdE276Bd) {
    +++ description: Escrow contract for the project's gas token (Can be different from ETH). Keeps a list of allowed Inboxes and Outboxes for canonical bridge messaging.
      issuedPermissions.0.target:
-        "0x3ffFbAdAF827559da092217e474760E2b2c3CeDd"
+        "0xE6841D92B0C345144506576eC13ECf5103aC7f49"
      issuedPermissions.0.via.1:
+        {"address":"0x71D78dC7cCC0e037e12de1E50f5470903ce37148","delay":0}
      issuedPermissions.0.via.0.address:
-        "0x71D78dC7cCC0e037e12de1E50f5470903ce37148"
+        "0x3ffFbAdAF827559da092217e474760E2b2c3CeDd"
      template:
+        "orbitstack/Bridge"
      description:
+        "Escrow contract for the project's gas token (Can be different from ETH). Keeps a list of allowed Inboxes and Outboxes for canonical bridge messaging."
    }
```

```diff
    contract Inbox (0xc4448b71118c9071Bcb9734A0EAc55D18A153949) {
    +++ description: None
      issuedPermissions.0.target:
-        "0x3ffFbAdAF827559da092217e474760E2b2c3CeDd"
+        "0xE6841D92B0C345144506576eC13ECf5103aC7f49"
      issuedPermissions.0.via.1:
+        {"address":"0x71D78dC7cCC0e037e12de1E50f5470903ce37148","delay":0}
      issuedPermissions.0.via.0.address:
-        "0x71D78dC7cCC0e037e12de1E50f5470903ce37148"
+        "0x3ffFbAdAF827559da092217e474760E2b2c3CeDd"
    }
```

```diff
    contract L1GatewayRouter (0xC840838Bc438d73C16c2f8b22D2Ce3669963cD48) {
    +++ description: This routing contract maps tokens to the correct escrow (gateway) to be then bridged with canonical messaging.
      issuedPermissions.0.target:
-        "0x3ffFbAdAF827559da092217e474760E2b2c3CeDd"
+        "0xE6841D92B0C345144506576eC13ECf5103aC7f49"
      issuedPermissions.0.via.1:
+        {"address":"0xa8f7DdEd54a726eB873E98bFF2C95ABF2d03e560","delay":0}
      issuedPermissions.0.via.0.address:
-        "0xa8f7DdEd54a726eB873E98bFF2C95ABF2d03e560"
+        "0x3ffFbAdAF827559da092217e474760E2b2c3CeDd"
    }
```

```diff
    contract Outbox (0xD4B80C3D7240325D18E645B49e6535A3Bf95cc58) {
    +++ description: Facilitates L2 to L1 contract calls: Messages initiated from L2 (for example withdrawal messages) eventually resolve in execution on L1.
      issuedPermissions.0.target:
-        "0x3ffFbAdAF827559da092217e474760E2b2c3CeDd"
+        "0xE6841D92B0C345144506576eC13ECf5103aC7f49"
      issuedPermissions.0.via.1:
+        {"address":"0x71D78dC7cCC0e037e12de1E50f5470903ce37148","delay":0}
      issuedPermissions.0.via.0.address:
-        "0x71D78dC7cCC0e037e12de1E50f5470903ce37148"
+        "0x3ffFbAdAF827559da092217e474760E2b2c3CeDd"
      template:
+        "orbitstack/Outbox"
      description:
+        "Facilitates L2 to L1 contract calls: Messages initiated from L2 (for example withdrawal messages) eventually resolve in execution on L1."
    }
```

```diff
    contract L1Timelock (0xE6841D92B0C345144506576eC13ECf5103aC7f49) {
    +++ description: None
      issuedPermissions.0.target:
-        "0x3ffFbAdAF827559da092217e474760E2b2c3CeDd"
+        "0xE6841D92B0C345144506576eC13ECf5103aC7f49"
      issuedPermissions.0.via.1:
+        {"address":"0x5613AF0474EB9c528A34701A5b1662E3C8FA0678","delay":0}
      issuedPermissions.0.via.0.address:
-        "0x5613AF0474EB9c528A34701A5b1662E3C8FA0678"
+        "0x3ffFbAdAF827559da092217e474760E2b2c3CeDd"
      receivedPermissions:
+        [{"permission":"configure","target":"0xFb209827c58283535b744575e11953DCC4bEAD88","description":"can pause and unpause and set important roles and parameters in the system contracts: Can delegate Sequencer management to a BatchPosterManager address, manage data availability and DACs, set the Sequencer-only window, introduce an allowList to the bridge and whitelist Inboxes/Outboxes.","via":[{"address":"0x3ffFbAdAF827559da092217e474760E2b2c3CeDd"}]},{"permission":"upgrade","target":"0x211E1c4c7f1bF5351Ac850Ed10FD68CFfCF6c21b","via":[{"address":"0x71D78dC7cCC0e037e12de1E50f5470903ce37148"},{"address":"0x3ffFbAdAF827559da092217e474760E2b2c3CeDd"}]},{"permission":"upgrade","target":"0x23122da8C581AA7E0d07A36Ff1f16F799650232f","via":[{"address":"0xa8f7DdEd54a726eB873E98bFF2C95ABF2d03e560"},{"address":"0x3ffFbAdAF827559da092217e474760E2b2c3CeDd"}]},{"permission":"upgrade","target":"0x304807A7ed6c1296df2128E6ff3836e477329CD2","via":[{"address":"0x71D78dC7cCC0e037e12de1E50f5470903ce37148"},{"address":"0x3ffFbAdAF827559da092217e474760E2b2c3CeDd"}]},{"permission":"upgrade","target":"0x3ffFbAdAF827559da092217e474760E2b2c3CeDd","via":[{"address":"0x5613AF0474EB9c528A34701A5b1662E3C8FA0678"},{"address":"0x3ffFbAdAF827559da092217e474760E2b2c3CeDd"}]},{"permission":"upgrade","target":"0xA59075221b50C598aED0Eae0bB9869639513af0D","via":[{"address":"0x71D78dC7cCC0e037e12de1E50f5470903ce37148"},{"address":"0x3ffFbAdAF827559da092217e474760E2b2c3CeDd"}]},{"permission":"upgrade","target":"0xB2535b988dcE19f9D71dfB22dB6da744aCac21bf","via":[{"address":"0xa8f7DdEd54a726eB873E98bFF2C95ABF2d03e560"},{"address":"0x3ffFbAdAF827559da092217e474760E2b2c3CeDd"}]},{"permission":"upgrade","target":"0xC1Ebd02f738644983b6C4B2d440b8e77DdE276Bd","via":[{"address":"0x71D78dC7cCC0e037e12de1E50f5470903ce37148"},{"address":"0x3ffFbAdAF827559da092217e474760E2b2c3CeDd"}]},{"permission":"upgrade","target":"0xc4448b71118c9071Bcb9734A0EAc55D18A153949","via":[{"address":"0x71D78dC7cCC0e037e12de1E50f5470903ce37148"},{"address":"0x3ffFbAdAF827559da092217e474760E2b2c3CeDd"}]},{"permission":"upgrade","target":"0xC840838Bc438d73C16c2f8b22D2Ce3669963cD48","via":[{"address":"0xa8f7DdEd54a726eB873E98bFF2C95ABF2d03e560"},{"address":"0x3ffFbAdAF827559da092217e474760E2b2c3CeDd"}]},{"permission":"upgrade","target":"0xD4B80C3D7240325D18E645B49e6535A3Bf95cc58","via":[{"address":"0x71D78dC7cCC0e037e12de1E50f5470903ce37148"},{"address":"0x3ffFbAdAF827559da092217e474760E2b2c3CeDd"}]},{"permission":"upgrade","target":"0xE6841D92B0C345144506576eC13ECf5103aC7f49","via":[{"address":"0x5613AF0474EB9c528A34701A5b1662E3C8FA0678"},{"address":"0x3ffFbAdAF827559da092217e474760E2b2c3CeDd"}]},{"permission":"upgrade","target":"0xFb209827c58283535b744575e11953DCC4bEAD88","via":[{"address":"0x3ffFbAdAF827559da092217e474760E2b2c3CeDd"}]}]
      directlyReceivedPermissions:
+        [{"permission":"act","target":"0x3ffFbAdAF827559da092217e474760E2b2c3CeDd"}]
    }
```

```diff
    contract SecurityCouncil (0xF06E95eF589D9c38af242a8AAee8375f14023F85) {
    +++ description: None
      directlyReceivedPermissions:
+        [{"permission":"act","target":"0x3ffFbAdAF827559da092217e474760E2b2c3CeDd"}]
    }
```

```diff
    contract RollupProxy (0xFb209827c58283535b744575e11953DCC4bEAD88) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      issuedPermissions.1.target:
-        "0x3ffFbAdAF827559da092217e474760E2b2c3CeDd"
+        "0xE6841D92B0C345144506576eC13ECf5103aC7f49"
      issuedPermissions.1.via.0:
+        {"address":"0x3ffFbAdAF827559da092217e474760E2b2c3CeDd","delay":0}
      issuedPermissions.0.target:
-        "0x3ffFbAdAF827559da092217e474760E2b2c3CeDd"
+        "0xE6841D92B0C345144506576eC13ECf5103aC7f49"
      issuedPermissions.0.via.0:
+        {"address":"0x3ffFbAdAF827559da092217e474760E2b2c3CeDd","delay":0,"description":"can pause and unpause and set important roles and parameters in the system contracts: Can delegate Sequencer management to a BatchPosterManager address, manage data availability and DACs, set the Sequencer-only window, introduce an allowList to the bridge and whitelist Inboxes/Outboxes."}
    }
```

Generated with discovered.json: 0x1502a60cb688101e60c8bc6f7493cd812b852c75

# Diff at Thu, 21 Nov 2024 07:29:34 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@de1745323b367dd0fbb18ad6c862147dd90e90b0 block: 21093343
- current block number: 21234620

## Description

Provide description of changes. This section will be preserved.

## Watched changes

```diff
    contract SecurityCouncil (0xF06E95eF589D9c38af242a8AAee8375f14023F85) {
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

Generated with discovered.json: 0x94859a2265fef62a397bdf438d5c7b76367ced8a

# Diff at Tue, 12 Nov 2024 15:34:19 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@b2d1031f386ed9987b07f83babe4993700b00d33 block: 21093343
- current block number: 21093343

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21093343 (main branch discovery), not current.

```diff
    contract ValidatorWallet (0x1732BE6738117e9d22A84181AF68C8d09Cd4FF23) {
    +++ description: None
      receivedPermissions.1:
-        {"permission":"propose","target":"0xFb209827c58283535b744575e11953DCC4bEAD88","description":"can submit state roots to the RollupProxy contract on the host chain."}
      receivedPermissions.0.permission:
-        "challenge"
+        "validate"
      receivedPermissions.0.description:
-        "can challenge state roots on the host chain."
+        "Can propose new state roots (called nodes) and challenge state roots on the host chain."
    }
```

```diff
    contract L1CustomGateway (0x23122da8C581AA7E0d07A36Ff1f16F799650232f) {
    +++ description: Escrows deposited assets for the canonical bridge that are externally governed or need custom token contracts with e.g. minting rights or upgradeability.
      template:
+        "orbitstack/CustomGateway"
      displayName:
+        "CustomGateway"
      description:
+        "Escrows deposited assets for the canonical bridge that are externally governed or need custom token contracts with e.g. minting rights or upgradeability."
    }
```

```diff
    contract ValidatorWallet (0x24Ca61c31C7f9Af3ab104dB6B9A444F28e9071e3) {
    +++ description: None
      receivedPermissions.1:
-        {"permission":"propose","target":"0xFb209827c58283535b744575e11953DCC4bEAD88","description":"can submit state roots to the RollupProxy contract on the host chain."}
      receivedPermissions.0.permission:
-        "challenge"
+        "validate"
      receivedPermissions.0.description:
-        "can challenge state roots on the host chain."
+        "Can propose new state roots (called nodes) and challenge state roots on the host chain."
    }
```

```diff
    contract Validator (0x3B0369CAD35d257793F51c28213a4Cf4001397AC) {
    +++ description: None
      receivedPermissions.1:
-        {"permission":"propose","target":"0xFb209827c58283535b744575e11953DCC4bEAD88","description":"can submit state roots to the RollupProxy contract on the host chain."}
      receivedPermissions.0.permission:
-        "challenge"
+        "validate"
      receivedPermissions.0.description:
-        "can challenge state roots on the host chain."
+        "Can propose new state roots (called nodes) and challenge state roots on the host chain."
    }
```

```diff
    contract ValidatorWallet (0x57004b440Cc4eb2FEd8c4d1865FaC907F9150C76) {
    +++ description: None
      receivedPermissions.1:
-        {"permission":"propose","target":"0xFb209827c58283535b744575e11953DCC4bEAD88","description":"can submit state roots to the RollupProxy contract on the host chain."}
      receivedPermissions.0.permission:
-        "challenge"
+        "validate"
      receivedPermissions.0.description:
-        "can challenge state roots on the host chain."
+        "Can propose new state roots (called nodes) and challenge state roots on the host chain."
    }
```

```diff
    contract ValidatorWallet (0x658e8123722462F888b6fa01a7dbcEFe1D6DD709) {
    +++ description: None
      receivedPermissions.1:
-        {"permission":"propose","target":"0xFb209827c58283535b744575e11953DCC4bEAD88","description":"can submit state roots to the RollupProxy contract on the host chain."}
      receivedPermissions.0.permission:
-        "challenge"
+        "validate"
      receivedPermissions.0.description:
-        "can challenge state roots on the host chain."
+        "Can propose new state roots (called nodes) and challenge state roots on the host chain."
    }
```

```diff
    contract L1GatewayRouter (0xC840838Bc438d73C16c2f8b22D2Ce3669963cD48) {
    +++ description: This routing contract maps tokens to the correct escrow (gateway) to be then bridged with canonical messaging.
      template:
+        "orbitstack/GatewayRouter"
      displayName:
+        "GatewayRouter"
      description:
+        "This routing contract maps tokens to the correct escrow (gateway) to be then bridged with canonical messaging."
    }
```

```diff
    contract ValidatorWallet (0xE27d4Ed355e5273A3D4855c8e11BC4a8d3e39b87) {
    +++ description: None
      receivedPermissions.1:
-        {"permission":"propose","target":"0xFb209827c58283535b744575e11953DCC4bEAD88","description":"can submit state roots to the RollupProxy contract on the host chain."}
      receivedPermissions.0.permission:
-        "challenge"
+        "validate"
      receivedPermissions.0.description:
-        "can challenge state roots on the host chain."
+        "Can propose new state roots (called nodes) and challenge state roots on the host chain."
    }
```

```diff
    contract RollupProxy (0xFb209827c58283535b744575e11953DCC4bEAD88) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      issuedPermissions.27:
-        {"permission":"upgrade","target":"0x3ffFbAdAF827559da092217e474760E2b2c3CeDd","via":[]}
      issuedPermissions.26:
-        {"permission":"propose","target":"0xE27d4Ed355e5273A3D4855c8e11BC4a8d3e39b87","via":[]}
      issuedPermissions.25:
-        {"permission":"propose","target":"0xDfB23DFE9De7dcC974467195C8B7D5cd21C9d7cB","via":[]}
      issuedPermissions.24:
-        {"permission":"propose","target":"0xdDf2F71Ab206C0138A8eceEb54386567D5abF01E","via":[]}
      issuedPermissions.23:
-        {"permission":"propose","target":"0xB51EDdfc9A945e2B909905e4F242C4796Ac0C61d","via":[]}
      issuedPermissions.22:
-        {"permission":"propose","target":"0xAB1A39332e934300eBCc57B5f95cA90631a347FF","via":[]}
      issuedPermissions.21:
-        {"permission":"propose","target":"0x658e8123722462F888b6fa01a7dbcEFe1D6DD709","via":[]}
      issuedPermissions.20:
-        {"permission":"propose","target":"0x610Aa279989F440820e14248BD3879B148717974","via":[]}
      issuedPermissions.19:
-        {"permission":"propose","target":"0x57004b440Cc4eb2FEd8c4d1865FaC907F9150C76","via":[]}
      issuedPermissions.18:
-        {"permission":"propose","target":"0x54c0D3d6C101580dB3be8763A2aE2c6bb9dc840c","via":[]}
      issuedPermissions.17:
-        {"permission":"propose","target":"0x3B0369CAD35d257793F51c28213a4Cf4001397AC","via":[]}
      issuedPermissions.16:
-        {"permission":"propose","target":"0x24Ca61c31C7f9Af3ab104dB6B9A444F28e9071e3","via":[]}
      issuedPermissions.15:
-        {"permission":"propose","target":"0x1732BE6738117e9d22A84181AF68C8d09Cd4FF23","via":[]}
      issuedPermissions.14.permission:
-        "propose"
+        "validate"
      issuedPermissions.14.target:
-        "0x0fF813f6BD577c3D1cDbE435baC0621BE6aE34B4"
+        "0xE27d4Ed355e5273A3D4855c8e11BC4a8d3e39b87"
      issuedPermissions.13.permission:
-        "configure"
+        "validate"
      issuedPermissions.13.target:
-        "0x3ffFbAdAF827559da092217e474760E2b2c3CeDd"
+        "0xDfB23DFE9De7dcC974467195C8B7D5cd21C9d7cB"
      issuedPermissions.12.permission:
-        "challenge"
+        "validate"
      issuedPermissions.12.target:
-        "0xE27d4Ed355e5273A3D4855c8e11BC4a8d3e39b87"
+        "0xdDf2F71Ab206C0138A8eceEb54386567D5abF01E"
      issuedPermissions.11.permission:
-        "challenge"
+        "validate"
      issuedPermissions.11.target:
-        "0xDfB23DFE9De7dcC974467195C8B7D5cd21C9d7cB"
+        "0xB51EDdfc9A945e2B909905e4F242C4796Ac0C61d"
      issuedPermissions.10.permission:
-        "challenge"
+        "validate"
      issuedPermissions.10.target:
-        "0xdDf2F71Ab206C0138A8eceEb54386567D5abF01E"
+        "0xAB1A39332e934300eBCc57B5f95cA90631a347FF"
      issuedPermissions.9.permission:
-        "challenge"
+        "validate"
      issuedPermissions.9.target:
-        "0xB51EDdfc9A945e2B909905e4F242C4796Ac0C61d"
+        "0x658e8123722462F888b6fa01a7dbcEFe1D6DD709"
      issuedPermissions.8.permission:
-        "challenge"
+        "validate"
      issuedPermissions.8.target:
-        "0xAB1A39332e934300eBCc57B5f95cA90631a347FF"
+        "0x610Aa279989F440820e14248BD3879B148717974"
      issuedPermissions.7.permission:
-        "challenge"
+        "validate"
      issuedPermissions.7.target:
-        "0x658e8123722462F888b6fa01a7dbcEFe1D6DD709"
+        "0x57004b440Cc4eb2FEd8c4d1865FaC907F9150C76"
      issuedPermissions.6.permission:
-        "challenge"
+        "validate"
      issuedPermissions.6.target:
-        "0x610Aa279989F440820e14248BD3879B148717974"
+        "0x54c0D3d6C101580dB3be8763A2aE2c6bb9dc840c"
      issuedPermissions.5.permission:
-        "challenge"
+        "validate"
      issuedPermissions.5.target:
-        "0x57004b440Cc4eb2FEd8c4d1865FaC907F9150C76"
+        "0x3B0369CAD35d257793F51c28213a4Cf4001397AC"
      issuedPermissions.4.permission:
-        "challenge"
+        "validate"
      issuedPermissions.4.target:
-        "0x54c0D3d6C101580dB3be8763A2aE2c6bb9dc840c"
+        "0x24Ca61c31C7f9Af3ab104dB6B9A444F28e9071e3"
      issuedPermissions.3.permission:
-        "challenge"
+        "validate"
      issuedPermissions.3.target:
-        "0x3B0369CAD35d257793F51c28213a4Cf4001397AC"
+        "0x1732BE6738117e9d22A84181AF68C8d09Cd4FF23"
      issuedPermissions.2.permission:
-        "challenge"
+        "validate"
      issuedPermissions.2.target:
-        "0x24Ca61c31C7f9Af3ab104dB6B9A444F28e9071e3"
+        "0x0fF813f6BD577c3D1cDbE435baC0621BE6aE34B4"
      issuedPermissions.1.permission:
-        "challenge"
+        "upgrade"
      issuedPermissions.1.target:
-        "0x1732BE6738117e9d22A84181AF68C8d09Cd4FF23"
+        "0x3ffFbAdAF827559da092217e474760E2b2c3CeDd"
      issuedPermissions.0.permission:
-        "challenge"
+        "configure"
      issuedPermissions.0.target:
-        "0x0fF813f6BD577c3D1cDbE435baC0621BE6aE34B4"
+        "0x3ffFbAdAF827559da092217e474760E2b2c3CeDd"
    }
```

Generated with discovered.json: 0x57bd571ea09c31a66246c88f42cc412021aec9e2

# Diff at Mon, 04 Nov 2024 07:57:32 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@950c85bf556f084c302d2b03100375cf3c7ed376 block: 21093343
- current block number: 21093343

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21093343 (main branch discovery), not current.

```diff
    contract UpgradeExecutor (0x3ffFbAdAF827559da092217e474760E2b2c3CeDd) {
    +++ description: None
      receivedPermissions.12:
+        {"permission":"upgrade","target":"0xFb209827c58283535b744575e11953DCC4bEAD88"}
      receivedPermissions.11.target:
-        "0xFb209827c58283535b744575e11953DCC4bEAD88"
+        "0xE6841D92B0C345144506576eC13ECf5103aC7f49"
      receivedPermissions.11.via:
+        [{"address":"0x5613AF0474EB9c528A34701A5b1662E3C8FA0678"}]
      receivedPermissions.10.target:
-        "0xE6841D92B0C345144506576eC13ECf5103aC7f49"
+        "0xD4B80C3D7240325D18E645B49e6535A3Bf95cc58"
      receivedPermissions.10.via.0.address:
-        "0x5613AF0474EB9c528A34701A5b1662E3C8FA0678"
+        "0x71D78dC7cCC0e037e12de1E50f5470903ce37148"
      receivedPermissions.9.target:
-        "0xD4B80C3D7240325D18E645B49e6535A3Bf95cc58"
+        "0xC840838Bc438d73C16c2f8b22D2Ce3669963cD48"
      receivedPermissions.9.via.0.address:
-        "0x71D78dC7cCC0e037e12de1E50f5470903ce37148"
+        "0xa8f7DdEd54a726eB873E98bFF2C95ABF2d03e560"
      receivedPermissions.8.target:
-        "0xC840838Bc438d73C16c2f8b22D2Ce3669963cD48"
+        "0xc4448b71118c9071Bcb9734A0EAc55D18A153949"
      receivedPermissions.8.via.0.address:
-        "0xa8f7DdEd54a726eB873E98bFF2C95ABF2d03e560"
+        "0x71D78dC7cCC0e037e12de1E50f5470903ce37148"
      receivedPermissions.7.target:
-        "0xc4448b71118c9071Bcb9734A0EAc55D18A153949"
+        "0xC1Ebd02f738644983b6C4B2d440b8e77DdE276Bd"
      receivedPermissions.6.target:
-        "0xC1Ebd02f738644983b6C4B2d440b8e77DdE276Bd"
+        "0xB2535b988dcE19f9D71dfB22dB6da744aCac21bf"
      receivedPermissions.6.via.0.address:
-        "0x71D78dC7cCC0e037e12de1E50f5470903ce37148"
+        "0xa8f7DdEd54a726eB873E98bFF2C95ABF2d03e560"
      receivedPermissions.5.target:
-        "0xB2535b988dcE19f9D71dfB22dB6da744aCac21bf"
+        "0xA59075221b50C598aED0Eae0bB9869639513af0D"
      receivedPermissions.5.via.0.address:
-        "0xa8f7DdEd54a726eB873E98bFF2C95ABF2d03e560"
+        "0x71D78dC7cCC0e037e12de1E50f5470903ce37148"
      receivedPermissions.4.target:
-        "0xA59075221b50C598aED0Eae0bB9869639513af0D"
+        "0x3ffFbAdAF827559da092217e474760E2b2c3CeDd"
      receivedPermissions.4.via.0.address:
-        "0x71D78dC7cCC0e037e12de1E50f5470903ce37148"
+        "0x5613AF0474EB9c528A34701A5b1662E3C8FA0678"
      receivedPermissions.3.target:
-        "0x3ffFbAdAF827559da092217e474760E2b2c3CeDd"
+        "0x304807A7ed6c1296df2128E6ff3836e477329CD2"
      receivedPermissions.3.via.0.address:
-        "0x5613AF0474EB9c528A34701A5b1662E3C8FA0678"
+        "0x71D78dC7cCC0e037e12de1E50f5470903ce37148"
      receivedPermissions.2.target:
-        "0x304807A7ed6c1296df2128E6ff3836e477329CD2"
+        "0x23122da8C581AA7E0d07A36Ff1f16F799650232f"
      receivedPermissions.2.via.0.address:
-        "0x71D78dC7cCC0e037e12de1E50f5470903ce37148"
+        "0xa8f7DdEd54a726eB873E98bFF2C95ABF2d03e560"
      receivedPermissions.1.target:
-        "0x23122da8C581AA7E0d07A36Ff1f16F799650232f"
+        "0x211E1c4c7f1bF5351Ac850Ed10FD68CFfCF6c21b"
      receivedPermissions.1.via.0.address:
-        "0xa8f7DdEd54a726eB873E98bFF2C95ABF2d03e560"
+        "0x71D78dC7cCC0e037e12de1E50f5470903ce37148"
      receivedPermissions.0.permission:
-        "upgrade"
+        "configure"
      receivedPermissions.0.target:
-        "0x211E1c4c7f1bF5351Ac850Ed10FD68CFfCF6c21b"
+        "0xFb209827c58283535b744575e11953DCC4bEAD88"
      receivedPermissions.0.via:
-        [{"address":"0x71D78dC7cCC0e037e12de1E50f5470903ce37148"}]
      receivedPermissions.0.description:
+        "can pause and unpause and set important roles and parameters in the system contracts: Can delegate Sequencer management to a BatchPosterManager address, manage data availability and DACs, set the Sequencer-only window, introduce an allowList to the bridge and whitelist Inboxes/Outboxes."
    }
```

```diff
    contract RollupProxy (0xFb209827c58283535b744575e11953DCC4bEAD88) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      issuedPermissions.27:
+        {"permission":"upgrade","target":"0x3ffFbAdAF827559da092217e474760E2b2c3CeDd","via":[]}
      issuedPermissions.26.permission:
-        "upgrade"
+        "propose"
      issuedPermissions.26.target:
-        "0x3ffFbAdAF827559da092217e474760E2b2c3CeDd"
+        "0xE27d4Ed355e5273A3D4855c8e11BC4a8d3e39b87"
      issuedPermissions.25.target:
-        "0xE27d4Ed355e5273A3D4855c8e11BC4a8d3e39b87"
+        "0xDfB23DFE9De7dcC974467195C8B7D5cd21C9d7cB"
      issuedPermissions.24.target:
-        "0xDfB23DFE9De7dcC974467195C8B7D5cd21C9d7cB"
+        "0xdDf2F71Ab206C0138A8eceEb54386567D5abF01E"
      issuedPermissions.23.target:
-        "0xdDf2F71Ab206C0138A8eceEb54386567D5abF01E"
+        "0xB51EDdfc9A945e2B909905e4F242C4796Ac0C61d"
      issuedPermissions.22.target:
-        "0xB51EDdfc9A945e2B909905e4F242C4796Ac0C61d"
+        "0xAB1A39332e934300eBCc57B5f95cA90631a347FF"
      issuedPermissions.21.target:
-        "0xAB1A39332e934300eBCc57B5f95cA90631a347FF"
+        "0x658e8123722462F888b6fa01a7dbcEFe1D6DD709"
      issuedPermissions.20.target:
-        "0x658e8123722462F888b6fa01a7dbcEFe1D6DD709"
+        "0x610Aa279989F440820e14248BD3879B148717974"
      issuedPermissions.19.target:
-        "0x610Aa279989F440820e14248BD3879B148717974"
+        "0x57004b440Cc4eb2FEd8c4d1865FaC907F9150C76"
      issuedPermissions.18.target:
-        "0x57004b440Cc4eb2FEd8c4d1865FaC907F9150C76"
+        "0x54c0D3d6C101580dB3be8763A2aE2c6bb9dc840c"
      issuedPermissions.17.target:
-        "0x54c0D3d6C101580dB3be8763A2aE2c6bb9dc840c"
+        "0x3B0369CAD35d257793F51c28213a4Cf4001397AC"
      issuedPermissions.16.target:
-        "0x3B0369CAD35d257793F51c28213a4Cf4001397AC"
+        "0x24Ca61c31C7f9Af3ab104dB6B9A444F28e9071e3"
      issuedPermissions.15.target:
-        "0x24Ca61c31C7f9Af3ab104dB6B9A444F28e9071e3"
+        "0x1732BE6738117e9d22A84181AF68C8d09Cd4FF23"
      issuedPermissions.14.target:
-        "0x1732BE6738117e9d22A84181AF68C8d09Cd4FF23"
+        "0x0fF813f6BD577c3D1cDbE435baC0621BE6aE34B4"
      issuedPermissions.13.permission:
-        "propose"
+        "configure"
      issuedPermissions.13.target:
-        "0x0fF813f6BD577c3D1cDbE435baC0621BE6aE34B4"
+        "0x3ffFbAdAF827559da092217e474760E2b2c3CeDd"
    }
```

Generated with discovered.json: 0x20dd5819c67c82506f4bf3ade13ab769bb9f3827

# Diff at Fri, 01 Nov 2024 14:19:11 GMT:

- author: vincfurc (<10850139+vincfurc@users.noreply.github.com>)
- comparing to: main@cd1f0e71bb08ce16b2084a11b768538e8aa6ba8c block: 21041841
- current block number: 21093343

## Description

Changed member of the security council.

## Watched changes

```diff
    contract SecurityCouncil (0xF06E95eF589D9c38af242a8AAee8375f14023F85) {
    +++ description: None
      values.$members.1:
-        "0xA821c8c245d1F3A257e3B0DEC99268cA05144422"
+        "0x70C006fC86A392c16D7E085cefc0Ad1FF7de6C75"
      values.$members.0:
-        "0x70C006fC86A392c16D7E085cefc0Ad1FF7de6C75"
+        "0x9316ca66f5f936E3239e4fD2AAAEA5C7b6f3C4cC"
    }
```

Generated with discovered.json: 0xbe447ea937e33e940ac8e7dd2e4ea4d6918eff49

# Diff at Tue, 29 Oct 2024 13:14:12 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@7b3fc9dc9074e1d423b48522c3f0273c86aab54a block: 21041841
- current block number: 21041841

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21041841 (main branch discovery), not current.

```diff
    contract OneStepProverMath (0x2c785E954c376be0CEfF4a7Db92E053B0830F7c9) {
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
      template:
+        "orbitstack/OneStepProverMath"
      description:
+        "One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine."
    }
```

```diff
    contract OneStepProverMemory (0x5C9F8663583Ad0A1c0009c871f8253DBF4767A18) {
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
      template:
+        "orbitstack/OneStepProverMemory"
      description:
+        "One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine."
    }
```

```diff
    contract OneStepProverHostIo (0x8D78382913467Cd25374C75BA918b0A723Bc2544) {
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
      template:
+        "orbitstack/OneStepProverHostIo"
      description:
+        "One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine."
    }
```

```diff
    contract OneStepProofEntry (0xa328BAF257A937b7934429a5d8458d98693C6FC7) {
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
      template:
+        "orbitstack/OneStepProofEntry"
      description:
+        "One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine."
    }
```

```diff
    contract ChallengeManager (0xA59075221b50C598aED0Eae0bB9869639513af0D) {
    +++ description: Contract that allows challenging state roots. Can be called through the RollupProxy by Validators or the UpgradeExecutor.
      template:
+        "orbitstack/ChallengeManager"
      description:
+        "Contract that allows challenging state roots. Can be called through the RollupProxy by Validators or the UpgradeExecutor."
    }
```

```diff
    contract OneStepProver0 (0xD0465e3356213869f1Fae38b3E67CBF4E873c5B6) {
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
      template:
+        "orbitstack/OneStepProver0"
      description:
+        "One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine."
    }
```

```diff
    contract RollupProxy (0xFb209827c58283535b744575e11953DCC4bEAD88) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      fieldMeta.confirmPeriodBlocks.description:
-        "Challenge period. (Number of blocks until a node is confirmed)."
+        "Challenge period. (Number of ETHEREUM blocks until a node is confirmed, even for L3s)."
    }
```

Generated with discovered.json: 0x8bc055520ea172da455e3f384fd60ddb5b1fcbe6

# Diff at Fri, 25 Oct 2024 09:50:23 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@e7501f424c0cea9b5438386ee76e509448999836 block: 20912894
- current block number: 21041841

## Description

Config related.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20912894 (main branch discovery), not current.

```diff
    contract ValidatorWallet (0x1732BE6738117e9d22A84181AF68C8d09Cd4FF23) {
    +++ description: None
      issuedPermissions.0.target:
-        "0xAd3a14Fc16751d9E7FCa2A99aF85bf4d135e878d"
+        "0xd3132d052C9045D7cB0236586C9E2276e654343D"
      issuedPermissions.0.via.0:
+        {"address":"0xAd3a14Fc16751d9E7FCa2A99aF85bf4d135e878d","delay":0}
    }
```

```diff
    contract SequencerInbox (0x211E1c4c7f1bF5351Ac850Ed10FD68CFfCF6c21b) {
    +++ description: None
      issuedPermissions.2.target:
-        "0x71D78dC7cCC0e037e12de1E50f5470903ce37148"
+        "0x3ffFbAdAF827559da092217e474760E2b2c3CeDd"
      issuedPermissions.2.via.0:
+        {"address":"0x71D78dC7cCC0e037e12de1E50f5470903ce37148","delay":0}
    }
```

```diff
    contract L1CustomGateway (0x23122da8C581AA7E0d07A36Ff1f16F799650232f) {
    +++ description: None
      issuedPermissions.0.target:
-        "0xa8f7DdEd54a726eB873E98bFF2C95ABF2d03e560"
+        "0x3ffFbAdAF827559da092217e474760E2b2c3CeDd"
      issuedPermissions.0.via.0:
+        {"address":"0xa8f7DdEd54a726eB873E98bFF2C95ABF2d03e560","delay":0}
    }
```

```diff
    contract ValidatorWallet (0x24Ca61c31C7f9Af3ab104dB6B9A444F28e9071e3) {
    +++ description: None
      issuedPermissions.0.target:
-        "0xb31407BCf91d54AbFC0B7ef61bFc71b8b71F0678"
+        "0x9de97C570c1214f6c0ba08c2321d6a5F20D85a47"
      issuedPermissions.0.via.0:
+        {"address":"0xb31407BCf91d54AbFC0B7ef61bFc71b8b71F0678","delay":0}
    }
```

```diff
    contract RollupEventInbox (0x304807A7ed6c1296df2128E6ff3836e477329CD2) {
    +++ description: None
      issuedPermissions.0.target:
-        "0x71D78dC7cCC0e037e12de1E50f5470903ce37148"
+        "0x3ffFbAdAF827559da092217e474760E2b2c3CeDd"
      issuedPermissions.0.via.0:
+        {"address":"0x71D78dC7cCC0e037e12de1E50f5470903ce37148","delay":0}
    }
```

```diff
    contract UpgradeExecutor (0x3ffFbAdAF827559da092217e474760E2b2c3CeDd) {
    +++ description: None
      receivedPermissions.11:
+        {"permission":"upgrade","target":"0xFb209827c58283535b744575e11953DCC4bEAD88"}
      receivedPermissions.10:
+        {"permission":"upgrade","target":"0xE6841D92B0C345144506576eC13ECf5103aC7f49","via":[{"address":"0x5613AF0474EB9c528A34701A5b1662E3C8FA0678"}]}
      receivedPermissions.9:
+        {"permission":"upgrade","target":"0xD4B80C3D7240325D18E645B49e6535A3Bf95cc58","via":[{"address":"0x71D78dC7cCC0e037e12de1E50f5470903ce37148"}]}
      receivedPermissions.8:
+        {"permission":"upgrade","target":"0xC840838Bc438d73C16c2f8b22D2Ce3669963cD48","via":[{"address":"0xa8f7DdEd54a726eB873E98bFF2C95ABF2d03e560"}]}
      receivedPermissions.7:
+        {"permission":"upgrade","target":"0xc4448b71118c9071Bcb9734A0EAc55D18A153949","via":[{"address":"0x71D78dC7cCC0e037e12de1E50f5470903ce37148"}]}
      receivedPermissions.6:
+        {"permission":"upgrade","target":"0xC1Ebd02f738644983b6C4B2d440b8e77DdE276Bd","via":[{"address":"0x71D78dC7cCC0e037e12de1E50f5470903ce37148"}]}
      receivedPermissions.5:
+        {"permission":"upgrade","target":"0xB2535b988dcE19f9D71dfB22dB6da744aCac21bf","via":[{"address":"0xa8f7DdEd54a726eB873E98bFF2C95ABF2d03e560"}]}
      receivedPermissions.4:
+        {"permission":"upgrade","target":"0xA59075221b50C598aED0Eae0bB9869639513af0D","via":[{"address":"0x71D78dC7cCC0e037e12de1E50f5470903ce37148"}]}
      receivedPermissions.3:
+        {"permission":"upgrade","target":"0x3ffFbAdAF827559da092217e474760E2b2c3CeDd","via":[{"address":"0x5613AF0474EB9c528A34701A5b1662E3C8FA0678"}]}
      receivedPermissions.2.target:
-        "0xFb209827c58283535b744575e11953DCC4bEAD88"
+        "0x304807A7ed6c1296df2128E6ff3836e477329CD2"
      receivedPermissions.2.via:
+        [{"address":"0x71D78dC7cCC0e037e12de1E50f5470903ce37148"}]
      receivedPermissions.1.target:
-        "0xE6841D92B0C345144506576eC13ECf5103aC7f49"
+        "0x23122da8C581AA7E0d07A36Ff1f16F799650232f"
      receivedPermissions.1.via.0.address:
-        "0x5613AF0474EB9c528A34701A5b1662E3C8FA0678"
+        "0xa8f7DdEd54a726eB873E98bFF2C95ABF2d03e560"
      receivedPermissions.0.target:
-        "0x3ffFbAdAF827559da092217e474760E2b2c3CeDd"
+        "0x211E1c4c7f1bF5351Ac850Ed10FD68CFfCF6c21b"
      receivedPermissions.0.via.0.address:
-        "0x5613AF0474EB9c528A34701A5b1662E3C8FA0678"
+        "0x71D78dC7cCC0e037e12de1E50f5470903ce37148"
      directlyReceivedPermissions.3:
+        {"permission":"act","target":"0xF06E95eF589D9c38af242a8AAee8375f14023F85"}
      directlyReceivedPermissions.2:
+        {"permission":"act","target":"0xa8f7DdEd54a726eB873E98bFF2C95ABF2d03e560"}
      directlyReceivedPermissions.1.target:
-        "0xF06E95eF589D9c38af242a8AAee8375f14023F85"
+        "0x71D78dC7cCC0e037e12de1E50f5470903ce37148"
    }
```

```diff
    contract ValidatorWallet (0x57004b440Cc4eb2FEd8c4d1865FaC907F9150C76) {
    +++ description: None
      issuedPermissions.0.target:
-        "0xF32e5B5Ad94c0c0F83E0023b0AC48A93A8a2a428"
+        "0xC234E41AE2cb00311956Aa7109fC801ae8c80941"
      issuedPermissions.0.via.0:
+        {"address":"0xF32e5B5Ad94c0c0F83E0023b0AC48A93A8a2a428","delay":0}
    }
```

```diff
    contract ValidatorWallet (0x658e8123722462F888b6fa01a7dbcEFe1D6DD709) {
    +++ description: None
      issuedPermissions.0.target:
-        "0x8f6b82D007C0Ff4fd85fE84a5BFa89C00A4e6d2B"
+        "0xDfB23DFE9De7dcC974467195C8B7D5cd21C9d7cB"
      issuedPermissions.0.via.0:
+        {"address":"0x8f6b82D007C0Ff4fd85fE84a5BFa89C00A4e6d2B","delay":0}
    }
```

```diff
    contract ProxyAdmin (0x71D78dC7cCC0e037e12de1E50f5470903ce37148) {
    +++ description: None
      receivedPermissions:
-        [{"permission":"upgrade","target":"0x211E1c4c7f1bF5351Ac850Ed10FD68CFfCF6c21b"},{"permission":"upgrade","target":"0x304807A7ed6c1296df2128E6ff3836e477329CD2"},{"permission":"upgrade","target":"0xA59075221b50C598aED0Eae0bB9869639513af0D"},{"permission":"upgrade","target":"0xC1Ebd02f738644983b6C4B2d440b8e77DdE276Bd"},{"permission":"upgrade","target":"0xc4448b71118c9071Bcb9734A0EAc55D18A153949"},{"permission":"upgrade","target":"0xD4B80C3D7240325D18E645B49e6535A3Bf95cc58"}]
      template:
+        "global/ProxyAdmin"
      directlyReceivedPermissions:
+        [{"permission":"upgrade","target":"0x211E1c4c7f1bF5351Ac850Ed10FD68CFfCF6c21b"},{"permission":"upgrade","target":"0x304807A7ed6c1296df2128E6ff3836e477329CD2"},{"permission":"upgrade","target":"0xA59075221b50C598aED0Eae0bB9869639513af0D"},{"permission":"upgrade","target":"0xC1Ebd02f738644983b6C4B2d440b8e77DdE276Bd"},{"permission":"upgrade","target":"0xc4448b71118c9071Bcb9734A0EAc55D18A153949"},{"permission":"upgrade","target":"0xD4B80C3D7240325D18E645B49e6535A3Bf95cc58"}]
    }
```

```diff
    contract ProxyAdmin (0x8f6b82D007C0Ff4fd85fE84a5BFa89C00A4e6d2B) {
    +++ description: None
      receivedPermissions:
-        [{"permission":"upgrade","target":"0x658e8123722462F888b6fa01a7dbcEFe1D6DD709"}]
      template:
+        "global/ProxyAdmin"
      directlyReceivedPermissions:
+        [{"permission":"upgrade","target":"0x658e8123722462F888b6fa01a7dbcEFe1D6DD709"}]
    }
```

```diff
    contract ChallengeManager (0xA59075221b50C598aED0Eae0bB9869639513af0D) {
    +++ description: None
      issuedPermissions.0.target:
-        "0x71D78dC7cCC0e037e12de1E50f5470903ce37148"
+        "0x3ffFbAdAF827559da092217e474760E2b2c3CeDd"
      issuedPermissions.0.via.0:
+        {"address":"0x71D78dC7cCC0e037e12de1E50f5470903ce37148","delay":0}
    }
```

```diff
    contract ProxyAdmin 3 (0xa8f7DdEd54a726eB873E98bFF2C95ABF2d03e560) {
    +++ description: None
      receivedPermissions:
-        [{"permission":"upgrade","target":"0x23122da8C581AA7E0d07A36Ff1f16F799650232f"},{"permission":"upgrade","target":"0xB2535b988dcE19f9D71dfB22dB6da744aCac21bf"},{"permission":"upgrade","target":"0xC840838Bc438d73C16c2f8b22D2Ce3669963cD48"}]
      template:
+        "global/ProxyAdmin"
      directlyReceivedPermissions:
+        [{"permission":"upgrade","target":"0x23122da8C581AA7E0d07A36Ff1f16F799650232f"},{"permission":"upgrade","target":"0xB2535b988dcE19f9D71dfB22dB6da744aCac21bf"},{"permission":"upgrade","target":"0xC840838Bc438d73C16c2f8b22D2Ce3669963cD48"}]
    }
```

```diff
    contract ProxyAdmin (0xAd3a14Fc16751d9E7FCa2A99aF85bf4d135e878d) {
    +++ description: None
      receivedPermissions:
-        [{"permission":"upgrade","target":"0x1732BE6738117e9d22A84181AF68C8d09Cd4FF23"}]
      template:
+        "global/ProxyAdmin"
      directlyReceivedPermissions:
+        [{"permission":"upgrade","target":"0x1732BE6738117e9d22A84181AF68C8d09Cd4FF23"}]
    }
```

```diff
    contract L1ERC20Gateway (0xB2535b988dcE19f9D71dfB22dB6da744aCac21bf) {
    +++ description: None
      issuedPermissions.0.target:
-        "0xa8f7DdEd54a726eB873E98bFF2C95ABF2d03e560"
+        "0x3ffFbAdAF827559da092217e474760E2b2c3CeDd"
      issuedPermissions.0.via.0:
+        {"address":"0xa8f7DdEd54a726eB873E98bFF2C95ABF2d03e560","delay":0}
    }
```

```diff
    contract ProxyAdmin (0xb31407BCf91d54AbFC0B7ef61bFc71b8b71F0678) {
    +++ description: None
      receivedPermissions:
-        [{"permission":"upgrade","target":"0x24Ca61c31C7f9Af3ab104dB6B9A444F28e9071e3"}]
      template:
+        "global/ProxyAdmin"
      directlyReceivedPermissions:
+        [{"permission":"upgrade","target":"0x24Ca61c31C7f9Af3ab104dB6B9A444F28e9071e3"}]
    }
```

```diff
    contract Bridge (0xC1Ebd02f738644983b6C4B2d440b8e77DdE276Bd) {
    +++ description: None
      issuedPermissions.0.target:
-        "0x71D78dC7cCC0e037e12de1E50f5470903ce37148"
+        "0x3ffFbAdAF827559da092217e474760E2b2c3CeDd"
      issuedPermissions.0.via.0:
+        {"address":"0x71D78dC7cCC0e037e12de1E50f5470903ce37148","delay":0}
    }
```

```diff
    contract ValidatorOwnerMultisig (0xC234E41AE2cb00311956Aa7109fC801ae8c80941) {
    +++ description: None
      receivedPermissions:
+        [{"permission":"upgrade","target":"0x57004b440Cc4eb2FEd8c4d1865FaC907F9150C76","via":[{"address":"0xF32e5B5Ad94c0c0F83E0023b0AC48A93A8a2a428"}]},{"permission":"upgrade","target":"0xE27d4Ed355e5273A3D4855c8e11BC4a8d3e39b87","via":[{"address":"0xE4d0Ba69d082Fdf6f51b8fc8F92c19bF00B1a1B4"}]}]
      directlyReceivedPermissions:
+        [{"permission":"act","target":"0xE4d0Ba69d082Fdf6f51b8fc8F92c19bF00B1a1B4"},{"permission":"act","target":"0xF32e5B5Ad94c0c0F83E0023b0AC48A93A8a2a428"}]
    }
```

```diff
    contract Inbox (0xc4448b71118c9071Bcb9734A0EAc55D18A153949) {
    +++ description: None
      issuedPermissions.0.target:
-        "0x71D78dC7cCC0e037e12de1E50f5470903ce37148"
+        "0x3ffFbAdAF827559da092217e474760E2b2c3CeDd"
      issuedPermissions.0.via.0:
+        {"address":"0x71D78dC7cCC0e037e12de1E50f5470903ce37148","delay":0}
    }
```

```diff
    contract L1GatewayRouter (0xC840838Bc438d73C16c2f8b22D2Ce3669963cD48) {
    +++ description: None
      issuedPermissions.0.target:
-        "0xa8f7DdEd54a726eB873E98bFF2C95ABF2d03e560"
+        "0x3ffFbAdAF827559da092217e474760E2b2c3CeDd"
      issuedPermissions.0.via.0:
+        {"address":"0xa8f7DdEd54a726eB873E98bFF2C95ABF2d03e560","delay":0}
    }
```

```diff
    contract Outbox (0xD4B80C3D7240325D18E645B49e6535A3Bf95cc58) {
    +++ description: None
      issuedPermissions.0.target:
-        "0x71D78dC7cCC0e037e12de1E50f5470903ce37148"
+        "0x3ffFbAdAF827559da092217e474760E2b2c3CeDd"
      issuedPermissions.0.via.0:
+        {"address":"0x71D78dC7cCC0e037e12de1E50f5470903ce37148","delay":0}
    }
```

```diff
    contract ValidatorWallet (0xE27d4Ed355e5273A3D4855c8e11BC4a8d3e39b87) {
    +++ description: None
      issuedPermissions.0.target:
-        "0xE4d0Ba69d082Fdf6f51b8fc8F92c19bF00B1a1B4"
+        "0xC234E41AE2cb00311956Aa7109fC801ae8c80941"
      issuedPermissions.0.via.0:
+        {"address":"0xE4d0Ba69d082Fdf6f51b8fc8F92c19bF00B1a1B4","delay":0}
    }
```

```diff
    contract ProxyAdmin (0xE4d0Ba69d082Fdf6f51b8fc8F92c19bF00B1a1B4) {
    +++ description: None
      receivedPermissions:
-        [{"permission":"upgrade","target":"0xE27d4Ed355e5273A3D4855c8e11BC4a8d3e39b87"}]
      template:
+        "global/ProxyAdmin"
      directlyReceivedPermissions:
+        [{"permission":"upgrade","target":"0xE27d4Ed355e5273A3D4855c8e11BC4a8d3e39b87"}]
    }
```

```diff
    contract ProxyAdmin (0xF32e5B5Ad94c0c0F83E0023b0AC48A93A8a2a428) {
    +++ description: None
      receivedPermissions:
-        [{"permission":"upgrade","target":"0x57004b440Cc4eb2FEd8c4d1865FaC907F9150C76"}]
      template:
+        "global/ProxyAdmin"
      directlyReceivedPermissions:
+        [{"permission":"upgrade","target":"0x57004b440Cc4eb2FEd8c4d1865FaC907F9150C76"}]
    }
```

Generated with discovered.json: 0x5ef6344a2b777d058867d9cb1de5c700c08f0cdb

# Diff at Wed, 23 Oct 2024 14:36:09 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@9cc37d16a5f0b172bb41f98d8a970963e5ca4afb block: 20912894
- current block number: 20912894

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20912894 (main branch discovery), not current.

```diff
    contract ValidatorWallet (0x1732BE6738117e9d22A84181AF68C8d09Cd4FF23) {
    +++ description: None
      receivedPermissions.1:
+        {"permission":"propose","target":"0xFb209827c58283535b744575e11953DCC4bEAD88","description":"can submit state roots to the RollupProxy contract on the host chain."}
      receivedPermissions.0.permission:
-        "validate"
+        "challenge"
      receivedPermissions.0.description:
+        "can challenge state roots on the host chain."
    }
```

```diff
    contract ValidatorWallet (0x24Ca61c31C7f9Af3ab104dB6B9A444F28e9071e3) {
    +++ description: None
      receivedPermissions.1:
+        {"permission":"propose","target":"0xFb209827c58283535b744575e11953DCC4bEAD88","description":"can submit state roots to the RollupProxy contract on the host chain."}
      receivedPermissions.0.permission:
-        "validate"
+        "challenge"
      receivedPermissions.0.description:
+        "can challenge state roots on the host chain."
    }
```

```diff
    contract Validator (0x3B0369CAD35d257793F51c28213a4Cf4001397AC) {
    +++ description: None
      receivedPermissions.1:
+        {"permission":"propose","target":"0xFb209827c58283535b744575e11953DCC4bEAD88","description":"can submit state roots to the RollupProxy contract on the host chain."}
      receivedPermissions.0.permission:
-        "validate"
+        "challenge"
      receivedPermissions.0.description:
+        "can challenge state roots on the host chain."
    }
```

```diff
    contract ValidatorWallet (0x57004b440Cc4eb2FEd8c4d1865FaC907F9150C76) {
    +++ description: None
      receivedPermissions.1:
+        {"permission":"propose","target":"0xFb209827c58283535b744575e11953DCC4bEAD88","description":"can submit state roots to the RollupProxy contract on the host chain."}
      receivedPermissions.0.permission:
-        "validate"
+        "challenge"
      receivedPermissions.0.description:
+        "can challenge state roots on the host chain."
    }
```

```diff
    contract ValidatorWallet (0x658e8123722462F888b6fa01a7dbcEFe1D6DD709) {
    +++ description: None
      receivedPermissions.1:
+        {"permission":"propose","target":"0xFb209827c58283535b744575e11953DCC4bEAD88","description":"can submit state roots to the RollupProxy contract on the host chain."}
      receivedPermissions.0.permission:
-        "validate"
+        "challenge"
      receivedPermissions.0.description:
+        "can challenge state roots on the host chain."
    }
```

```diff
-   Status: DELETED
    contract ValidatorWallet (0x6Ab7A2f1a4febCD40A58b0205bFDA9CAf614b779)
    +++ description: None
```

```diff
-   Status: DELETED
    contract ValidatorWalletCreator (0xe05465Aab36ba1277dAE36aa27a7B74830e74DE4)
    +++ description: None
```

```diff
    contract ValidatorWallet (0xE27d4Ed355e5273A3D4855c8e11BC4a8d3e39b87) {
    +++ description: None
      receivedPermissions.1:
+        {"permission":"propose","target":"0xFb209827c58283535b744575e11953DCC4bEAD88","description":"can submit state roots to the RollupProxy contract on the host chain."}
      receivedPermissions.0.permission:
-        "validate"
+        "challenge"
      receivedPermissions.0.description:
+        "can challenge state roots on the host chain."
    }
```

```diff
    contract RollupProxy (0xFb209827c58283535b744575e11953DCC4bEAD88) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      description:
-        "Manages rollup components, list of Stakers and Validators. Entry point for Validators creating new Rollup Nodes (state commits) and Challengers submitting fraud proofs."
+        "Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators)."
      issuedPermissions.26:
+        {"permission":"upgrade","target":"0x3ffFbAdAF827559da092217e474760E2b2c3CeDd","via":[]}
      issuedPermissions.25:
+        {"permission":"propose","target":"0xE27d4Ed355e5273A3D4855c8e11BC4a8d3e39b87","via":[]}
      issuedPermissions.24:
+        {"permission":"propose","target":"0xDfB23DFE9De7dcC974467195C8B7D5cd21C9d7cB","via":[]}
      issuedPermissions.23:
+        {"permission":"propose","target":"0xdDf2F71Ab206C0138A8eceEb54386567D5abF01E","via":[]}
      issuedPermissions.22:
+        {"permission":"propose","target":"0xB51EDdfc9A945e2B909905e4F242C4796Ac0C61d","via":[]}
      issuedPermissions.21:
+        {"permission":"propose","target":"0xAB1A39332e934300eBCc57B5f95cA90631a347FF","via":[]}
      issuedPermissions.20:
+        {"permission":"propose","target":"0x658e8123722462F888b6fa01a7dbcEFe1D6DD709","via":[]}
      issuedPermissions.19:
+        {"permission":"propose","target":"0x610Aa279989F440820e14248BD3879B148717974","via":[]}
      issuedPermissions.18:
+        {"permission":"propose","target":"0x57004b440Cc4eb2FEd8c4d1865FaC907F9150C76","via":[]}
      issuedPermissions.17:
+        {"permission":"propose","target":"0x54c0D3d6C101580dB3be8763A2aE2c6bb9dc840c","via":[]}
      issuedPermissions.16:
+        {"permission":"propose","target":"0x3B0369CAD35d257793F51c28213a4Cf4001397AC","via":[]}
      issuedPermissions.15:
+        {"permission":"propose","target":"0x24Ca61c31C7f9Af3ab104dB6B9A444F28e9071e3","via":[]}
      issuedPermissions.14:
+        {"permission":"propose","target":"0x1732BE6738117e9d22A84181AF68C8d09Cd4FF23","via":[]}
      issuedPermissions.13.permission:
-        "validate"
+        "propose"
      issuedPermissions.13.target:
-        "0xE27d4Ed355e5273A3D4855c8e11BC4a8d3e39b87"
+        "0x0fF813f6BD577c3D1cDbE435baC0621BE6aE34B4"
      issuedPermissions.12.permission:
-        "validate"
+        "challenge"
      issuedPermissions.12.target:
-        "0xDfB23DFE9De7dcC974467195C8B7D5cd21C9d7cB"
+        "0xE27d4Ed355e5273A3D4855c8e11BC4a8d3e39b87"
      issuedPermissions.11.permission:
-        "validate"
+        "challenge"
      issuedPermissions.11.target:
-        "0xdDf2F71Ab206C0138A8eceEb54386567D5abF01E"
+        "0xDfB23DFE9De7dcC974467195C8B7D5cd21C9d7cB"
      issuedPermissions.10.permission:
-        "validate"
+        "challenge"
      issuedPermissions.10.target:
-        "0xB51EDdfc9A945e2B909905e4F242C4796Ac0C61d"
+        "0xdDf2F71Ab206C0138A8eceEb54386567D5abF01E"
      issuedPermissions.9.permission:
-        "validate"
+        "challenge"
      issuedPermissions.9.target:
-        "0xAB1A39332e934300eBCc57B5f95cA90631a347FF"
+        "0xB51EDdfc9A945e2B909905e4F242C4796Ac0C61d"
      issuedPermissions.8.permission:
-        "validate"
+        "challenge"
      issuedPermissions.8.target:
-        "0x658e8123722462F888b6fa01a7dbcEFe1D6DD709"
+        "0xAB1A39332e934300eBCc57B5f95cA90631a347FF"
      issuedPermissions.7.permission:
-        "validate"
+        "challenge"
      issuedPermissions.7.target:
-        "0x610Aa279989F440820e14248BD3879B148717974"
+        "0x658e8123722462F888b6fa01a7dbcEFe1D6DD709"
      issuedPermissions.6.permission:
-        "validate"
+        "challenge"
      issuedPermissions.6.target:
-        "0x57004b440Cc4eb2FEd8c4d1865FaC907F9150C76"
+        "0x610Aa279989F440820e14248BD3879B148717974"
      issuedPermissions.5.permission:
-        "validate"
+        "challenge"
      issuedPermissions.5.target:
-        "0x54c0D3d6C101580dB3be8763A2aE2c6bb9dc840c"
+        "0x57004b440Cc4eb2FEd8c4d1865FaC907F9150C76"
      issuedPermissions.4.permission:
-        "validate"
+        "challenge"
      issuedPermissions.4.target:
-        "0x3B0369CAD35d257793F51c28213a4Cf4001397AC"
+        "0x54c0D3d6C101580dB3be8763A2aE2c6bb9dc840c"
      issuedPermissions.3.permission:
-        "validate"
+        "challenge"
      issuedPermissions.3.target:
-        "0x24Ca61c31C7f9Af3ab104dB6B9A444F28e9071e3"
+        "0x3B0369CAD35d257793F51c28213a4Cf4001397AC"
      issuedPermissions.2.permission:
-        "validate"
+        "challenge"
      issuedPermissions.2.target:
-        "0x1732BE6738117e9d22A84181AF68C8d09Cd4FF23"
+        "0x24Ca61c31C7f9Af3ab104dB6B9A444F28e9071e3"
      issuedPermissions.1.permission:
-        "validate"
+        "challenge"
      issuedPermissions.1.target:
-        "0x0fF813f6BD577c3D1cDbE435baC0621BE6aE34B4"
+        "0x1732BE6738117e9d22A84181AF68C8d09Cd4FF23"
      issuedPermissions.0.permission:
-        "upgrade"
+        "challenge"
      issuedPermissions.0.target:
-        "0x3ffFbAdAF827559da092217e474760E2b2c3CeDd"
+        "0x0fF813f6BD577c3D1cDbE435baC0621BE6aE34B4"
+++ description: Root hash of the WASM module used for execution, like a fingerprint of the L2 logic. Can be associated with ArbOS versions.
      values.wasmModuleRoot:
-        "ArbOS v32 wasmModuleRoot"
+        "0x184884e1eb9fefdc158f6c8ac912bb183bf3cf83f0090317e0bc4ac5860baa39"
+++ description: ArbOS version derived from known wasmModuleRoots.
      values.arbOsFromWmRoot:
+        "ArbOS v32 wasmModuleRoot"
      fieldMeta.arbOsFromWmRoot:
+        {"description":"ArbOS version derived from known wasmModuleRoots."}
      fieldMeta.setValidatorCount:
+        {"description":"Increments on each Validator change."}
      fieldMeta.challenges:
+        {"description":"Emitted on createChallenge() in RollupUserLogic."}
    }
```

Generated with discovered.json: 0x4f31a47800c47436284e70cf8a65cd2fc30f8cac

# Diff at Mon, 21 Oct 2024 12:46:28 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@e660599f23a07618fe949a07be1f516ce44f1914 block: 20912894
- current block number: 20912894

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20912894 (main branch discovery), not current.

```diff
    contract RollupProxy (0xFb209827c58283535b744575e11953DCC4bEAD88) {
    +++ description: Manages rollup components, list of Stakers and Validators. Entry point for Validators creating new Rollup Nodes (state commits) and Challengers submitting fraud proofs.
      descriptions:
-        ["Manages rollup components, list of Stakers and Validators. Entry point for Validators creating new Rollup Nodes (state commits) and Challengers submitting fraud proofs."]
      description:
+        "Manages rollup components, list of Stakers and Validators. Entry point for Validators creating new Rollup Nodes (state commits) and Challengers submitting fraud proofs."
    }
```

Generated with discovered.json: 0xd540a7bd99b81fc39f021dce487d499f5b1d9fd5

# Diff at Mon, 21 Oct 2024 11:08:12 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@8895d33866f5665c4c710f4ddaa32bfa63cc3c78 block: 20912894
- current block number: 20912894

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20912894 (main branch discovery), not current.

```diff
    contract ValidatorWallet (0x1732BE6738117e9d22A84181AF68C8d09Cd4FF23) {
    +++ description: None
      values.$pastUpgrades.0.2:
+        ["0x6Ab7A2f1a4febCD40A58b0205bFDA9CAf614b779"]
      values.$pastUpgrades.0.1:
-        ["0x6Ab7A2f1a4febCD40A58b0205bFDA9CAf614b779"]
+        "0x9cc7c8b3b42a17c143c64cbc7a61a42ba6358b9f4b2fc3fef4b2e6d87a5c065e"
    }
```

```diff
    contract SequencerInbox (0x211E1c4c7f1bF5351Ac850Ed10FD68CFfCF6c21b) {
    +++ description: None
      values.$pastUpgrades.5.2:
+        ["0x31DA64D19Cd31A19CD09F4070366Fe2144792cf7"]
      values.$pastUpgrades.5.1:
-        ["0x31DA64D19Cd31A19CD09F4070366Fe2144792cf7"]
+        "0x51b492ac498a88565639cfe3df77be8729d61f1c413d00b66530d4022a13c36a"
      values.$pastUpgrades.4.2:
+        ["0xD03bFe2CE83632F4E618a97299cc91B1335BB2d9"]
      values.$pastUpgrades.4.1:
-        ["0xD03bFe2CE83632F4E618a97299cc91B1335BB2d9"]
+        "0x0f4db1811c997e979b8f7be3cd8509b5ea0bb6a366a1848a0905f9c7f50c8612"
      values.$pastUpgrades.3.2:
+        ["0xcc4e9E22AcDf93192cf7E149D7563F6d660E9Afc"]
      values.$pastUpgrades.3.1:
-        ["0xcc4e9E22AcDf93192cf7E149D7563F6d660E9Afc"]
+        "0xbfd8f54bf6b44ea4bcd76306d74b63602ee654e6a344bccca1825a388050988b"
      values.$pastUpgrades.2.2:
+        ["0x16242595cAfA3a207E9354E3bdb000B59bA82875"]
      values.$pastUpgrades.2.1:
-        ["0x16242595cAfA3a207E9354E3bdb000B59bA82875"]
+        "0x07bbd6efdc155699ab2807c0d1509e98e06aa58ce25f208f09c03899f3a128cd"
      values.$pastUpgrades.1.2:
+        ["0x2e3367cc9bd83959EF103AdF6fFea6200D0A15f0"]
      values.$pastUpgrades.1.1:
-        ["0x2e3367cc9bd83959EF103AdF6fFea6200D0A15f0"]
+        "0xffde6d577ce304fd07cac66a0034e0bf92674612609ee8dd482d9a77fe29f51e"
      values.$pastUpgrades.0.2:
+        ["0x9f80b449014B50DC2BB5b93598eb50030A0cA1aD"]
      values.$pastUpgrades.0.1:
-        ["0x9f80b449014B50DC2BB5b93598eb50030A0cA1aD"]
+        "0x5c5a7f1fa570de81fb9c2bf590cda328424071dac3f51681fa9825dcd6c16d27"
    }
```

```diff
    contract L1CustomGateway (0x23122da8C581AA7E0d07A36Ff1f16F799650232f) {
    +++ description: None
      values.$pastUpgrades.1.2:
+        ["0xC8D26aB9e132C79140b3376a0Ac7932E4680Aa45"]
      values.$pastUpgrades.1.1:
-        ["0xC8D26aB9e132C79140b3376a0Ac7932E4680Aa45"]
+        "0xf2ba2551709d23686f52c3a3ecc65ae8347f1bab1877265c57ba260e8222bf33"
      values.$pastUpgrades.0.2:
+        ["0x97367486f5905c2B7EE7b58330Fb4EB52639db17"]
      values.$pastUpgrades.0.1:
-        ["0x97367486f5905c2B7EE7b58330Fb4EB52639db17"]
+        "0x14fd84ed3f09649a2b7a19d2b51a4e4340bf85244b2e14c4a779ad3e7d70c4c3"
    }
```

```diff
    contract ValidatorWallet (0x24Ca61c31C7f9Af3ab104dB6B9A444F28e9071e3) {
    +++ description: None
      values.$pastUpgrades.0.2:
+        ["0x6Ab7A2f1a4febCD40A58b0205bFDA9CAf614b779"]
      values.$pastUpgrades.0.1:
-        ["0x6Ab7A2f1a4febCD40A58b0205bFDA9CAf614b779"]
+        "0x4d707837c6aaa93677887f0aecf5ba0d24cc1eba52edfb39d417310448199773"
    }
```

```diff
    contract RollupEventInbox (0x304807A7ed6c1296df2128E6ff3836e477329CD2) {
    +++ description: None
      values.$pastUpgrades.0.2:
+        ["0x32642eE509001D02615951090c7c56D6000e22C2"]
      values.$pastUpgrades.0.1:
-        ["0x32642eE509001D02615951090c7c56D6000e22C2"]
+        "0x5c5a7f1fa570de81fb9c2bf590cda328424071dac3f51681fa9825dcd6c16d27"
    }
```

```diff
    contract UpgradeExecutor (0x3ffFbAdAF827559da092217e474760E2b2c3CeDd) {
    +++ description: None
      values.$pastUpgrades.0.2:
+        ["0x86f0cf42Ad673B3D666d103E009EC142D1298a17"]
      values.$pastUpgrades.0.1:
-        ["0x86f0cf42Ad673B3D666d103E009EC142D1298a17"]
+        "0x9826d4f30361ad867030f94b0987567baf54040c39b661d8a825e945dc221eec"
    }
```

```diff
    contract ValidatorWallet (0x57004b440Cc4eb2FEd8c4d1865FaC907F9150C76) {
    +++ description: None
      values.$pastUpgrades.0.2:
+        ["0x6Ab7A2f1a4febCD40A58b0205bFDA9CAf614b779"]
      values.$pastUpgrades.0.1:
-        ["0x6Ab7A2f1a4febCD40A58b0205bFDA9CAf614b779"]
+        "0xd048f67976f98731daa0dfd8b2d392d7b7b6ec760d74b01a99505c8be552a336"
    }
```

```diff
    contract ValidatorWallet (0x658e8123722462F888b6fa01a7dbcEFe1D6DD709) {
    +++ description: None
      values.$pastUpgrades.0.2:
+        ["0x6Ab7A2f1a4febCD40A58b0205bFDA9CAf614b779"]
      values.$pastUpgrades.0.1:
-        ["0x6Ab7A2f1a4febCD40A58b0205bFDA9CAf614b779"]
+        "0x6f767742fd8afb4154aa98ead989132131bd9a9051fdf4c0e1c3b745918eed02"
    }
```

```diff
    contract ChallengeManager (0xA59075221b50C598aED0Eae0bB9869639513af0D) {
    +++ description: None
      values.$pastUpgrades.2.2:
+        ["0x914B7b3053B35B84A24df08D7c9ceBCaEA4E2948"]
      values.$pastUpgrades.2.1:
-        ["0x914B7b3053B35B84A24df08D7c9ceBCaEA4E2948"]
+        "0x1462f79e3920cc7c99a886743cb86aa6b05b16d92babc23fe7349e2543bb7b32"
      values.$pastUpgrades.1.2:
+        ["0xE129b8Aa61dF65cBDbAE4345eE3fb40168DfD566"]
      values.$pastUpgrades.1.1:
-        ["0xE129b8Aa61dF65cBDbAE4345eE3fb40168DfD566"]
+        "0x51b492ac498a88565639cfe3df77be8729d61f1c413d00b66530d4022a13c36a"
      values.$pastUpgrades.0.2:
+        ["0x7a18bB9DbAF1202F3fc977e42E3C360d522e4566"]
      values.$pastUpgrades.0.1:
-        ["0x7a18bB9DbAF1202F3fc977e42E3C360d522e4566"]
+        "0x5c5a7f1fa570de81fb9c2bf590cda328424071dac3f51681fa9825dcd6c16d27"
    }
```

```diff
    contract L1ERC20Gateway (0xB2535b988dcE19f9D71dfB22dB6da744aCac21bf) {
    +++ description: None
      values.$pastUpgrades.1.2:
+        ["0xb4299A1F5f26fF6a98B7BA35572290C359fde900"]
      values.$pastUpgrades.1.1:
-        ["0xb4299A1F5f26fF6a98B7BA35572290C359fde900"]
+        "0xf2ba2551709d23686f52c3a3ecc65ae8347f1bab1877265c57ba260e8222bf33"
      values.$pastUpgrades.0.2:
+        ["0xf852de96aD5Ca30d54b40b9cE5c8C6DE56C0Ef4B"]
      values.$pastUpgrades.0.1:
-        ["0xf852de96aD5Ca30d54b40b9cE5c8C6DE56C0Ef4B"]
+        "0x26c2f0175775f3474d63281e8f30e0217b49840f6646210011eedbcb974dc41f"
    }
```

```diff
    contract Bridge (0xC1Ebd02f738644983b6C4B2d440b8e77DdE276Bd) {
    +++ description: None
      values.$pastUpgrades.1.2:
+        ["0x1066CEcC8880948FE55e427E94F1FF221d626591"]
      values.$pastUpgrades.1.1:
-        ["0x1066CEcC8880948FE55e427E94F1FF221d626591"]
+        "0x07bbd6efdc155699ab2807c0d1509e98e06aa58ce25f208f09c03899f3a128cd"
      values.$pastUpgrades.0.2:
+        ["0xd4254a4d136203dAd7AE5Ee05D6BD65B8d13157d"]
      values.$pastUpgrades.0.1:
-        ["0xd4254a4d136203dAd7AE5Ee05D6BD65B8d13157d"]
+        "0x5c5a7f1fa570de81fb9c2bf590cda328424071dac3f51681fa9825dcd6c16d27"
    }
```

```diff
    contract Inbox (0xc4448b71118c9071Bcb9734A0EAc55D18A153949) {
    +++ description: None
      values.$pastUpgrades.3.2:
+        ["0x1b2676D32E2f7430a564DD4560641F990dFE3D6a"]
      values.$pastUpgrades.3.1:
-        ["0x1b2676D32E2f7430a564DD4560641F990dFE3D6a"]
+        "0xbfd8f54bf6b44ea4bcd76306d74b63602ee654e6a344bccca1825a388050988b"
      values.$pastUpgrades.2.2:
+        ["0xB46e8571760Da0CFaEB9c9689C449Eb7dD7cB3e7"]
      values.$pastUpgrades.2.1:
-        ["0xB46e8571760Da0CFaEB9c9689C449Eb7dD7cB3e7"]
+        "0x470fdfe6bca3542698cf680412e97c28d47be43c4b53afd39bab1cf75bd72e85"
      values.$pastUpgrades.1.2:
+        ["0x0f9866dEb74C0Aa3448c27606ed69c7Ad651B554"]
      values.$pastUpgrades.1.1:
-        ["0x0f9866dEb74C0Aa3448c27606ed69c7Ad651B554"]
+        "0x061e8b23bf8776e3af8026e6d8858f24bca5b5f5ac3e7607be8630679e5c186b"
      values.$pastUpgrades.0.2:
+        ["0x320bB4633BB62027D4b1d7827dDc81CC73458639"]
      values.$pastUpgrades.0.1:
-        ["0x320bB4633BB62027D4b1d7827dDc81CC73458639"]
+        "0x5c5a7f1fa570de81fb9c2bf590cda328424071dac3f51681fa9825dcd6c16d27"
    }
```

```diff
    contract L1GatewayRouter (0xC840838Bc438d73C16c2f8b22D2Ce3669963cD48) {
    +++ description: None
      values.$pastUpgrades.2.2:
+        ["0x52595021fA01B3E14EC6C88953AFc8E35dFf423c"]
      values.$pastUpgrades.2.1:
-        ["0x52595021fA01B3E14EC6C88953AFc8E35dFf423c"]
+        "0x0f4db1811c997e979b8f7be3cd8509b5ea0bb6a366a1848a0905f9c7f50c8612"
      values.$pastUpgrades.1.2:
+        ["0x6D1c576Fe3e54313990450f5Fa322306B4cCB47B"]
      values.$pastUpgrades.1.1:
-        ["0x6D1c576Fe3e54313990450f5Fa322306B4cCB47B"]
+        "0xf2ba2551709d23686f52c3a3ecc65ae8347f1bab1877265c57ba260e8222bf33"
      values.$pastUpgrades.0.2:
+        ["0xa9610559f1E5BB0Eab9a25e21137D39426fd477E"]
      values.$pastUpgrades.0.1:
-        ["0xa9610559f1E5BB0Eab9a25e21137D39426fd477E"]
+        "0xc9c47a10713cf548d69b58b6b6d28b08460adbd5b9f63c3f98ef7327962fff60"
    }
```

```diff
    contract Outbox (0xD4B80C3D7240325D18E645B49e6535A3Bf95cc58) {
    +++ description: None
      values.$pastUpgrades.1.2:
+        ["0x7439d8d4F3b9d9B6222f3E9760c75a47e08a7b3f"]
      values.$pastUpgrades.1.1:
-        ["0x7439d8d4F3b9d9B6222f3E9760c75a47e08a7b3f"]
+        "0x3f3b15e2fd68a9fb1067ebae60151118a5a44294c354d04cafe9352b92ad7816"
      values.$pastUpgrades.0.2:
+        ["0x476C807954b1ef8cF1Cb642E093fcF323557D721"]
      values.$pastUpgrades.0.1:
-        ["0x476C807954b1ef8cF1Cb642E093fcF323557D721"]
+        "0x5c5a7f1fa570de81fb9c2bf590cda328424071dac3f51681fa9825dcd6c16d27"
    }
```

```diff
    contract ValidatorWallet (0xE27d4Ed355e5273A3D4855c8e11BC4a8d3e39b87) {
    +++ description: None
      values.$pastUpgrades.0.2:
+        ["0x6Ab7A2f1a4febCD40A58b0205bFDA9CAf614b779"]
      values.$pastUpgrades.0.1:
-        ["0x6Ab7A2f1a4febCD40A58b0205bFDA9CAf614b779"]
+        "0x5cd8f9a87739648afbe00201b13aea80ec8b659ee540ffacab16a2999c9001cd"
    }
```

```diff
    contract L1Timelock (0xE6841D92B0C345144506576eC13ECf5103aC7f49) {
    +++ description: None
      values.$pastUpgrades.1.2:
+        ["0x61dC65001A8De4138DAD5167e43FF0FB0AB8D3B3"]
      values.$pastUpgrades.1.1:
-        ["0x61dC65001A8De4138DAD5167e43FF0FB0AB8D3B3"]
+        "0x84c81ca768ba6e8c9a81bd060ac455d8a9488e3f6e7ef34f4e0bd3cb74d53140"
      values.$pastUpgrades.0.2:
+        ["0x962d70fc48F3465404bC77B03f104746B25a1d1b"]
      values.$pastUpgrades.0.1:
-        ["0x962d70fc48F3465404bC77B03f104746B25a1d1b"]
+        "0x9826d4f30361ad867030f94b0987567baf54040c39b661d8a825e945dc221eec"
    }
```

```diff
    contract RollupProxy (0xFb209827c58283535b744575e11953DCC4bEAD88) {
    +++ description: Manages rollup components, list of Stakers and Validators. Entry point for Validators creating new Rollup Nodes (state commits) and Challengers submitting fraud proofs.
      values.$pastUpgrades.2.2:
+        ["0x72f193d0F305F532C87a4B9D0A2F407a3F4f585f","0xA0Ed0562629D45B88A34a342f20dEb58c46C15ff"]
      values.$pastUpgrades.2.1:
-        ["0x72f193d0F305F532C87a4B9D0A2F407a3F4f585f","0xA0Ed0562629D45B88A34a342f20dEb58c46C15ff"]
+        "0x0f4db1811c997e979b8f7be3cd8509b5ea0bb6a366a1848a0905f9c7f50c8612"
      values.$pastUpgrades.1.2:
+        ["0x72f193d0F305F532C87a4B9D0A2F407a3F4f585f","0x5E7147d34EaB8c86b19DEd94C00F82181B5580eF"]
      values.$pastUpgrades.1.1:
-        ["0x72f193d0F305F532C87a4B9D0A2F407a3F4f585f","0x5E7147d34EaB8c86b19DEd94C00F82181B5580eF"]
+        "0xbfd8f54bf6b44ea4bcd76306d74b63602ee654e6a344bccca1825a388050988b"
      values.$pastUpgrades.0.2:
+        ["0x309f49bD32B1098F4dF20a9DD51954e8680d77B1","0xFb333bac71f639de467872aFE02F7896F22F368d"]
      values.$pastUpgrades.0.1:
-        ["0x309f49bD32B1098F4dF20a9DD51954e8680d77B1","0xFb333bac71f639de467872aFE02F7896F22F368d"]
+        "0x5c5a7f1fa570de81fb9c2bf590cda328424071dac3f51681fa9825dcd6c16d27"
    }
```

Generated with discovered.json: 0xb0eb7da8ea9b5208e43c64cfc9d564b9d07c9a80

# Diff at Fri, 18 Oct 2024 10:57:54 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@0295165a89d86b7450439f24f100d1baa74381fc block: 20912894
- current block number: 20912894

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20912894 (main branch discovery), not current.

```diff
    contract UpgradeExecutor (0x3ffFbAdAF827559da092217e474760E2b2c3CeDd) {
    +++ description: None
      directlyReceivedPermissions.1:
+        {"permission":"act","target":"0xF06E95eF589D9c38af242a8AAee8375f14023F85"}
    }
```

Generated with discovered.json: 0x3badd761110bcdc893c46d4a4e76fa20374d77be

# Diff at Wed, 16 Oct 2024 11:38:22 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@a3d139b799cc0b28e5e912febb17464d4e5aef5d block: 20912894
- current block number: 20912894

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20912894 (main branch discovery), not current.

```diff
    contract ValidatorWallet (0x1732BE6738117e9d22A84181AF68C8d09Cd4FF23) {
    +++ description: None
      roles:
-        ["Validator"]
      receivedPermissions:
+        [{"permission":"validate","target":"0xFb209827c58283535b744575e11953DCC4bEAD88"}]
    }
```

```diff
    contract SequencerInbox (0x211E1c4c7f1bF5351Ac850Ed10FD68CFfCF6c21b) {
    +++ description: None
      issuedPermissions.2:
+        {"permission":"upgrade","target":"0x71D78dC7cCC0e037e12de1E50f5470903ce37148","via":[]}
      issuedPermissions.1:
+        {"permission":"sequence","target":"0xC1b634853Cb333D3aD8663715b08f41A3Aec47cc","via":[]}
      issuedPermissions.0.permission:
-        "upgrade"
+        "sequence"
      issuedPermissions.0.target:
-        "0x71D78dC7cCC0e037e12de1E50f5470903ce37148"
+        "0x0C5911d57B24FCF1DC8B2608eFbAe57C7098E32D"
    }
```

```diff
    contract ValidatorWallet (0x24Ca61c31C7f9Af3ab104dB6B9A444F28e9071e3) {
    +++ description: None
      roles:
-        ["Validator"]
      receivedPermissions:
+        [{"permission":"validate","target":"0xFb209827c58283535b744575e11953DCC4bEAD88"}]
    }
```

```diff
    contract Validator (0x3B0369CAD35d257793F51c28213a4Cf4001397AC) {
    +++ description: None
      roles:
-        ["Validator"]
      receivedPermissions:
+        [{"permission":"validate","target":"0xFb209827c58283535b744575e11953DCC4bEAD88"}]
    }
```

```diff
    contract ValidatorWallet (0x57004b440Cc4eb2FEd8c4d1865FaC907F9150C76) {
    +++ description: None
      roles:
-        ["Validator"]
      receivedPermissions:
+        [{"permission":"validate","target":"0xFb209827c58283535b744575e11953DCC4bEAD88"}]
    }
```

```diff
    contract ValidatorWallet (0x658e8123722462F888b6fa01a7dbcEFe1D6DD709) {
    +++ description: None
      roles:
-        ["Validator"]
      receivedPermissions:
+        [{"permission":"validate","target":"0xFb209827c58283535b744575e11953DCC4bEAD88"}]
    }
```

```diff
    contract ValidatorWallet (0xE27d4Ed355e5273A3D4855c8e11BC4a8d3e39b87) {
    +++ description: None
      roles:
-        ["Validator"]
      receivedPermissions:
+        [{"permission":"validate","target":"0xFb209827c58283535b744575e11953DCC4bEAD88"}]
    }
```

```diff
    contract RollupProxy (0xFb209827c58283535b744575e11953DCC4bEAD88) {
    +++ description: Manages rollup components, list of Stakers and Validators. Entry point for Validators creating new Rollup Nodes (state commits) and Challengers submitting fraud proofs.
      issuedPermissions.13:
+        {"permission":"validate","target":"0xE27d4Ed355e5273A3D4855c8e11BC4a8d3e39b87","via":[]}
      issuedPermissions.12:
+        {"permission":"validate","target":"0xDfB23DFE9De7dcC974467195C8B7D5cd21C9d7cB","via":[]}
      issuedPermissions.11:
+        {"permission":"validate","target":"0xdDf2F71Ab206C0138A8eceEb54386567D5abF01E","via":[]}
      issuedPermissions.10:
+        {"permission":"validate","target":"0xB51EDdfc9A945e2B909905e4F242C4796Ac0C61d","via":[]}
      issuedPermissions.9:
+        {"permission":"validate","target":"0xAB1A39332e934300eBCc57B5f95cA90631a347FF","via":[]}
      issuedPermissions.8:
+        {"permission":"validate","target":"0x658e8123722462F888b6fa01a7dbcEFe1D6DD709","via":[]}
      issuedPermissions.7:
+        {"permission":"validate","target":"0x610Aa279989F440820e14248BD3879B148717974","via":[]}
      issuedPermissions.6:
+        {"permission":"validate","target":"0x57004b440Cc4eb2FEd8c4d1865FaC907F9150C76","via":[]}
      issuedPermissions.5:
+        {"permission":"validate","target":"0x54c0D3d6C101580dB3be8763A2aE2c6bb9dc840c","via":[]}
      issuedPermissions.4:
+        {"permission":"validate","target":"0x3B0369CAD35d257793F51c28213a4Cf4001397AC","via":[]}
      issuedPermissions.3:
+        {"permission":"validate","target":"0x24Ca61c31C7f9Af3ab104dB6B9A444F28e9071e3","via":[]}
      issuedPermissions.2:
+        {"permission":"validate","target":"0x1732BE6738117e9d22A84181AF68C8d09Cd4FF23","via":[]}
      issuedPermissions.1:
+        {"permission":"validate","target":"0x0fF813f6BD577c3D1cDbE435baC0621BE6aE34B4","via":[]}
    }
```

Generated with discovered.json: 0x714a5e8b52606ce01773a0395c12e69acc0a9ac8

# Diff at Mon, 14 Oct 2024 10:53:24 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@1afc77ff111ceb0970e7d09efcc7b2f376b0c281 block: 20912894
- current block number: 20912894

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20912894 (main branch discovery), not current.

```diff
    contract ValidatorWallet (0x1732BE6738117e9d22A84181AF68C8d09Cd4FF23) {
    +++ description: None
      sourceHashes:
+        ["0xa7e3f6c355703ed46fcb2156862c4f01792b87beb10a87a81ce3bd5beee79b67","0xdb71d504c2071bc4b28756ad1f12fb3faf0537767b5019cfa7912d4fc078e8a9"]
    }
```

```diff
    contract SequencerInbox (0x211E1c4c7f1bF5351Ac850Ed10FD68CFfCF6c21b) {
    +++ description: None
      sourceHashes:
+        ["0xa7e3f6c355703ed46fcb2156862c4f01792b87beb10a87a81ce3bd5beee79b67","0x0bb7cd360bb26d8a487130df151eb05ce4afe4fd3452fcdbdd3cfa432e17cbb5"]
    }
```

```diff
    contract L1CustomGateway (0x23122da8C581AA7E0d07A36Ff1f16F799650232f) {
    +++ description: None
      sourceHashes:
+        ["0xa7e3f6c355703ed46fcb2156862c4f01792b87beb10a87a81ce3bd5beee79b67","0x60484a2ada75640a2144b3ecaae3bb7b51973a2494281beebf898308ffc35e90"]
    }
```

```diff
    contract ValidatorWallet (0x24Ca61c31C7f9Af3ab104dB6B9A444F28e9071e3) {
    +++ description: None
      sourceHashes:
+        ["0xa7e3f6c355703ed46fcb2156862c4f01792b87beb10a87a81ce3bd5beee79b67","0xdb71d504c2071bc4b28756ad1f12fb3faf0537767b5019cfa7912d4fc078e8a9"]
    }
```

```diff
    contract ValidatorUtils (0x2B081fbaB646D9013f2699BebEf62B7e7d7F0976) {
    +++ description: None
      sourceHashes:
+        ["0xd9b36ec321be937cc727b5bdb0afa0e1a0a28448ef1a202d4f181a01ce57bdc8"]
    }
```

```diff
    contract OneStepProverMath (0x2c785E954c376be0CEfF4a7Db92E053B0830F7c9) {
    +++ description: None
      sourceHashes:
+        ["0x3de1ddc210fe283d7298c5f06879df577c6a475329a206b1928c74d10db656d5"]
    }
```

```diff
    contract RollupEventInbox (0x304807A7ed6c1296df2128E6ff3836e477329CD2) {
    +++ description: None
      sourceHashes:
+        ["0xa7e3f6c355703ed46fcb2156862c4f01792b87beb10a87a81ce3bd5beee79b67","0x402f850c95fbd0952bbece5f3aa7033adeb81c0e7ad69753178c19fb4252bbdd"]
    }
```

```diff
    contract Validator (0x3B0369CAD35d257793F51c28213a4Cf4001397AC) {
    +++ description: None
      sourceHashes:
+        ["0x26f6b72513d780b4c7f3855e9b8c63f3ea90b9d15ce1cf38534887619daaa18b","0x9aa2eeef4b673e98d9f83d6fde3f3adec875839409b6d1788fab21323992a11a"]
    }
```

```diff
    contract UpgradeExecutor (0x3ffFbAdAF827559da092217e474760E2b2c3CeDd) {
    +++ description: None
      issuedPermissions.0.target:
-        "0x5613AF0474EB9c528A34701A5b1662E3C8FA0678"
+        "0x3ffFbAdAF827559da092217e474760E2b2c3CeDd"
      issuedPermissions.0.via.0:
+        {"address":"0x5613AF0474EB9c528A34701A5b1662E3C8FA0678","delay":0}
      receivedPermissions.2:
+        {"permission":"upgrade","target":"0xFb209827c58283535b744575e11953DCC4bEAD88"}
      receivedPermissions.1:
+        {"permission":"upgrade","target":"0xE6841D92B0C345144506576eC13ECf5103aC7f49","via":[{"address":"0x5613AF0474EB9c528A34701A5b1662E3C8FA0678"}]}
      receivedPermissions.0.target:
-        "0xFb209827c58283535b744575e11953DCC4bEAD88"
+        "0x3ffFbAdAF827559da092217e474760E2b2c3CeDd"
      receivedPermissions.0.via:
+        [{"address":"0x5613AF0474EB9c528A34701A5b1662E3C8FA0678"}]
      sourceHashes:
+        ["0xd87f004d37330210f1eb137e4498b14ba6340f079eaa0e9e7a22c1d4f76dde7d","0x17d2fa21e1bf7dff5e335a08bb2b6b996e34c00b1175c3711875720dde509401"]
      directlyReceivedPermissions:
+        [{"permission":"act","target":"0x5613AF0474EB9c528A34701A5b1662E3C8FA0678"}]
    }
```

```diff
    contract ProxyAdmin 2 (0x5613AF0474EB9c528A34701A5b1662E3C8FA0678) {
    +++ description: None
      receivedPermissions:
-        [{"permission":"upgrade","target":"0x3ffFbAdAF827559da092217e474760E2b2c3CeDd"},{"permission":"upgrade","target":"0xE6841D92B0C345144506576eC13ECf5103aC7f49"}]
      template:
+        "global/ProxyAdmin"
      sourceHashes:
+        ["0xae641c7d7a83bba7fa913b9544f946dc23ca0527c2f4abb9c6a3496f49375218"]
      directlyReceivedPermissions:
+        [{"permission":"upgrade","target":"0x3ffFbAdAF827559da092217e474760E2b2c3CeDd"},{"permission":"upgrade","target":"0xE6841D92B0C345144506576eC13ECf5103aC7f49"}]
    }
```

```diff
    contract ValidatorWallet (0x57004b440Cc4eb2FEd8c4d1865FaC907F9150C76) {
    +++ description: None
      sourceHashes:
+        ["0xa7e3f6c355703ed46fcb2156862c4f01792b87beb10a87a81ce3bd5beee79b67","0xdb71d504c2071bc4b28756ad1f12fb3faf0537767b5019cfa7912d4fc078e8a9"]
    }
```

```diff
    contract OneStepProverMemory (0x5C9F8663583Ad0A1c0009c871f8253DBF4767A18) {
    +++ description: None
      sourceHashes:
+        ["0x3955092d1dbd80f0910d7782a25da1e3da45533c7890928a1c6c63cbf5def5bf"]
    }
```

```diff
    contract ValidatorWallet (0x658e8123722462F888b6fa01a7dbcEFe1D6DD709) {
    +++ description: None
      sourceHashes:
+        ["0xa7e3f6c355703ed46fcb2156862c4f01792b87beb10a87a81ce3bd5beee79b67","0xdb71d504c2071bc4b28756ad1f12fb3faf0537767b5019cfa7912d4fc078e8a9"]
    }
```

```diff
    contract ValidatorWallet (0x6Ab7A2f1a4febCD40A58b0205bFDA9CAf614b779) {
    +++ description: None
      sourceHashes:
+        ["0xdb71d504c2071bc4b28756ad1f12fb3faf0537767b5019cfa7912d4fc078e8a9"]
    }
```

```diff
    contract ProxyAdmin (0x71D78dC7cCC0e037e12de1E50f5470903ce37148) {
    +++ description: None
      sourceHashes:
+        ["0xf944f88083f41ff959fefbdcd6fc3ae633692b072b8497fb14cbdd843eded490"]
    }
```

```diff
    contract OneStepProverHostIo (0x8D78382913467Cd25374C75BA918b0A723Bc2544) {
    +++ description: None
      sourceHashes:
+        ["0x2e969e0e83aea53307795f6826413e39bb416a64bc6da18f3a339ffeef444d32"]
    }
```

```diff
    contract ProxyAdmin (0x8f6b82D007C0Ff4fd85fE84a5BFa89C00A4e6d2B) {
    +++ description: None
      sourceHashes:
+        ["0xf944f88083f41ff959fefbdcd6fc3ae633692b072b8497fb14cbdd843eded490"]
    }
```

```diff
    contract L1DaiGateway (0x97f63339374fCe157Aa8Ee27830172d2AF76A786) {
    +++ description: None
      sourceHashes:
+        ["0x2bfb3c9871d8a7db172d350d7b4678c49eb33a98483f71cb89d3d059a7322efb"]
    }
```

```diff
    contract L1Escrow (0xA2e996f0cb33575FA0E36e8f62fCd4a9b897aAd3) {
    +++ description: None
      sourceHashes:
+        ["0x0169e3ff6f3a2faeac5a4c76b30fbf87198a211ee683a1b22d33db036f863ee8"]
    }
```

```diff
    contract OneStepProofEntry (0xa328BAF257A937b7934429a5d8458d98693C6FC7) {
    +++ description: None
      sourceHashes:
+        ["0x96f85480073b58d0e985cd6c68956f4a52f5ed8b2ce751b18868e2e830be3678"]
    }
```

```diff
    contract ChallengeManager (0xA59075221b50C598aED0Eae0bB9869639513af0D) {
    +++ description: None
      sourceHashes:
+        ["0xa7e3f6c355703ed46fcb2156862c4f01792b87beb10a87a81ce3bd5beee79b67","0x1a095768302d7d1c3d02375eaa3341833b4f1aaac707e1c608bce478c87cbf27"]
    }
```

```diff
    contract ProxyAdmin 3 (0xa8f7DdEd54a726eB873E98bFF2C95ABF2d03e560) {
    +++ description: None
      sourceHashes:
+        ["0xf944f88083f41ff959fefbdcd6fc3ae633692b072b8497fb14cbdd843eded490"]
    }
```

```diff
    contract ProxyAdmin (0xAd3a14Fc16751d9E7FCa2A99aF85bf4d135e878d) {
    +++ description: None
      sourceHashes:
+        ["0xf944f88083f41ff959fefbdcd6fc3ae633692b072b8497fb14cbdd843eded490"]
    }
```

```diff
    contract L1ERC20Gateway (0xB2535b988dcE19f9D71dfB22dB6da744aCac21bf) {
    +++ description: None
      sourceHashes:
+        ["0xa7e3f6c355703ed46fcb2156862c4f01792b87beb10a87a81ce3bd5beee79b67","0x019cdda76fc455f2628f7f7f87fae92c1264e1d2e32cd2d47e6494780c790c61"]
    }
```

```diff
    contract ProxyAdmin (0xb31407BCf91d54AbFC0B7ef61bFc71b8b71F0678) {
    +++ description: None
      sourceHashes:
+        ["0xf944f88083f41ff959fefbdcd6fc3ae633692b072b8497fb14cbdd843eded490"]
    }
```

```diff
    contract ProxyAdmin (0xb85e18C8F552c823CdA4DCd9056213bDc970f9AE) {
    +++ description: None
      sourceHashes:
+        ["0x579c6df39480618101e39d5b997df14c347d7f8a880df6cf0e1ae526771a0444"]
    }
```

```diff
    contract Bridge (0xC1Ebd02f738644983b6C4B2d440b8e77DdE276Bd) {
    +++ description: None
      sourceHashes:
+        ["0xa7e3f6c355703ed46fcb2156862c4f01792b87beb10a87a81ce3bd5beee79b67","0x5dbde25ce90571f7dd8e189ec68615bd76cab9ddb0ba7690b721e9e03c70b6ed"]
    }
```

```diff
    contract ValidatorOwnerMultisig (0xC234E41AE2cb00311956Aa7109fC801ae8c80941) {
    +++ description: None
      sourceHashes:
+        ["0x81a7349eebb98ac33b0bc6842e3cb258034a8f2a4ba004570bb8e2e25947f9ff","0xd42bbf9f7dcd3720a7fc6bdc6edfdfae8800a37d6dd4decfa0ef6ca4a2e88940"]
    }
```

```diff
    contract Inbox (0xc4448b71118c9071Bcb9734A0EAc55D18A153949) {
    +++ description: None
      sourceHashes:
+        ["0xa7e3f6c355703ed46fcb2156862c4f01792b87beb10a87a81ce3bd5beee79b67","0xabb863bfb2deec26e0b5122fb9149b8e2cecdeb199204582ec86ce8df90a4212"]
    }
```

```diff
    contract L1GatewayRouter (0xC840838Bc438d73C16c2f8b22D2Ce3669963cD48) {
    +++ description: None
      sourceHashes:
+        ["0xa7e3f6c355703ed46fcb2156862c4f01792b87beb10a87a81ce3bd5beee79b67","0x265fc73d2eec7f0b459f92a25a37b145c8db22527232f08f3022d5cc18d6af9d"]
    }
```

```diff
    contract OneStepProver0 (0xD0465e3356213869f1Fae38b3E67CBF4E873c5B6) {
    +++ description: None
      sourceHashes:
+        ["0x642d283934aef1189cf62e1bcd34a5081762b33fdd3ec8e823f304f874e48748"]
    }
```

```diff
    contract BatchPosterManagerMultisig (0xd0FDA6925f502a3a94986dfe7C92FE19EBbD679B) {
    +++ description: None
      sourceHashes:
+        ["0x81a7349eebb98ac33b0bc6842e3cb258034a8f2a4ba004570bb8e2e25947f9ff","0xd42bbf9f7dcd3720a7fc6bdc6edfdfae8800a37d6dd4decfa0ef6ca4a2e88940"]
    }
```

```diff
    contract Outbox (0xD4B80C3D7240325D18E645B49e6535A3Bf95cc58) {
    +++ description: None
      sourceHashes:
+        ["0xa7e3f6c355703ed46fcb2156862c4f01792b87beb10a87a81ce3bd5beee79b67","0x9f764f06f42aed913df011cc8dc09d70319d488074f11885eed5edbb66c6f5b4"]
    }
```

```diff
    contract ValidatorWalletCreator (0xe05465Aab36ba1277dAE36aa27a7B74830e74DE4) {
    +++ description: None
      sourceHashes:
+        ["0x4ef3473c840bed3b4c6258271a494794c1545f0d0f13c6a386d1e39e6180d67c"]
    }
```

```diff
    contract ValidatorWallet (0xE27d4Ed355e5273A3D4855c8e11BC4a8d3e39b87) {
    +++ description: None
      sourceHashes:
+        ["0xa7e3f6c355703ed46fcb2156862c4f01792b87beb10a87a81ce3bd5beee79b67","0xdb71d504c2071bc4b28756ad1f12fb3faf0537767b5019cfa7912d4fc078e8a9"]
    }
```

```diff
    contract ProxyAdmin (0xE4d0Ba69d082Fdf6f51b8fc8F92c19bF00B1a1B4) {
    +++ description: None
      sourceHashes:
+        ["0xf944f88083f41ff959fefbdcd6fc3ae633692b072b8497fb14cbdd843eded490"]
    }
```

```diff
    contract L1Timelock (0xE6841D92B0C345144506576eC13ECf5103aC7f49) {
    +++ description: None
      issuedPermissions.0.target:
-        "0x5613AF0474EB9c528A34701A5b1662E3C8FA0678"
+        "0x3ffFbAdAF827559da092217e474760E2b2c3CeDd"
      issuedPermissions.0.via.0:
+        {"address":"0x5613AF0474EB9c528A34701A5b1662E3C8FA0678","delay":0}
      sourceHashes:
+        ["0xd87f004d37330210f1eb137e4498b14ba6340f079eaa0e9e7a22c1d4f76dde7d","0x2b1c83d005613e3b0fd4bc9ef90faf86e00bc099fd61088045e83ee3892c6f5e"]
    }
```

```diff
    contract SecurityCouncil (0xF06E95eF589D9c38af242a8AAee8375f14023F85) {
    +++ description: None
      sourceHashes:
+        ["0x81a7349eebb98ac33b0bc6842e3cb258034a8f2a4ba004570bb8e2e25947f9ff","0xd42bbf9f7dcd3720a7fc6bdc6edfdfae8800a37d6dd4decfa0ef6ca4a2e88940"]
    }
```

```diff
    contract ProxyAdmin (0xF32e5B5Ad94c0c0F83E0023b0AC48A93A8a2a428) {
    +++ description: None
      sourceHashes:
+        ["0xf944f88083f41ff959fefbdcd6fc3ae633692b072b8497fb14cbdd843eded490"]
    }
```

```diff
    contract RollupProxy (0xFb209827c58283535b744575e11953DCC4bEAD88) {
    +++ description: Manages rollup components, list of Stakers and Validators. Entry point for Validators creating new Rollup Nodes (state commits) and Challengers submitting fraud proofs.
      sourceHashes:
+        ["0x3506a940a2992678b9fcc3b6b8e53228dbf1c1dec54fa57a53620698131d5fce","0xabf06072746c465404cbb92f513666e15a5409faccce7f76f4880a9b125b8a2e","0x714cd478f69088c5274871f1be4e27736aedacf59858caeb9dbea9e47d23d213"]
    }
```

Generated with discovered.json: 0xb40edb20ec925b36f46670b3e3c3f763d991c341

# Diff at Tue, 01 Oct 2024 10:53:26 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@bd754dc73c66120164006054f8d25c5fae9cd910 block: 20826367
- current block number: 20826367

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20826367 (main branch discovery), not current.

```diff
    contract ValidatorWallet (0x1732BE6738117e9d22A84181AF68C8d09Cd4FF23) {
    +++ description: None
      values.$pastUpgrades:
+        [["2022-08-08T09:12:52.000Z",["0x6Ab7A2f1a4febCD40A58b0205bFDA9CAf614b779"]]]
    }
```

```diff
    contract SequencerInbox (0x211E1c4c7f1bF5351Ac850Ed10FD68CFfCF6c21b) {
    +++ description: None
      values.$pastUpgrades:
+        [["2022-06-24T05:59:13.000Z",["0x9f80b449014B50DC2BB5b93598eb50030A0cA1aD"]],["2022-08-01T19:16:35.000Z",["0x2e3367cc9bd83959EF103AdF6fFea6200D0A15f0"]],["2022-08-31T02:31:26.000Z",["0x16242595cAfA3a207E9354E3bdb000B59bA82875"]],["2022-09-14T03:08:00.000Z",["0xcc4e9E22AcDf93192cf7E149D7563F6d660E9Afc"]],["2022-11-08T16:47:59.000Z",["0xD03bFe2CE83632F4E618a97299cc91B1335BB2d9"]],["2024-03-14T13:41:59.000Z",["0x31DA64D19Cd31A19CD09F4070366Fe2144792cf7"]]]
    }
```

```diff
    contract L1CustomGateway (0x23122da8C581AA7E0d07A36Ff1f16F799650232f) {
    +++ description: None
      values.$pastUpgrades:
+        [["2022-06-27T06:54:53.000Z",["0x97367486f5905c2B7EE7b58330Fb4EB52639db17"]],["2022-08-08T17:02:04.000Z",["0xC8D26aB9e132C79140b3376a0Ac7932E4680Aa45"]]]
    }
```

```diff
    contract ValidatorWallet (0x24Ca61c31C7f9Af3ab104dB6B9A444F28e9071e3) {
    +++ description: None
      values.$pastUpgrades:
+        [["2022-08-08T22:20:41.000Z",["0x6Ab7A2f1a4febCD40A58b0205bFDA9CAf614b779"]]]
    }
```

```diff
    contract RollupEventInbox (0x304807A7ed6c1296df2128E6ff3836e477329CD2) {
    +++ description: None
      values.$pastUpgrades:
+        [["2022-06-24T05:59:13.000Z",["0x32642eE509001D02615951090c7c56D6000e22C2"]]]
    }
```

```diff
    contract Validator (0x3B0369CAD35d257793F51c28213a4Cf4001397AC) {
    +++ description: None
      values.$pastUpgrades:
+        []
    }
```

```diff
    contract UpgradeExecutor (0x3ffFbAdAF827559da092217e474760E2b2c3CeDd) {
    +++ description: None
      values.$pastUpgrades:
+        [["2023-03-16T12:08:35.000Z",["0x86f0cf42Ad673B3D666d103E009EC142D1298a17"]]]
    }
```

```diff
    contract ValidatorWallet (0x57004b440Cc4eb2FEd8c4d1865FaC907F9150C76) {
    +++ description: None
      values.$pastUpgrades:
+        [["2022-07-13T18:12:59.000Z",["0x6Ab7A2f1a4febCD40A58b0205bFDA9CAf614b779"]]]
    }
```

```diff
    contract ValidatorWallet (0x658e8123722462F888b6fa01a7dbcEFe1D6DD709) {
    +++ description: None
      values.$pastUpgrades:
+        [["2022-08-09T20:48:12.000Z",["0x6Ab7A2f1a4febCD40A58b0205bFDA9CAf614b779"]]]
    }
```

```diff
    contract ChallengeManager (0xA59075221b50C598aED0Eae0bB9869639513af0D) {
    +++ description: None
      values.$pastUpgrades:
+        [["2022-06-24T05:59:13.000Z",["0x7a18bB9DbAF1202F3fc977e42E3C360d522e4566"]],["2024-03-14T13:41:59.000Z",["0xE129b8Aa61dF65cBDbAE4345eE3fb40168DfD566"]],["2024-08-28T01:37:11.000Z",["0x914B7b3053B35B84A24df08D7c9ceBCaEA4E2948"]]]
    }
```

```diff
    contract L1ERC20Gateway (0xB2535b988dcE19f9D71dfB22dB6da744aCac21bf) {
    +++ description: None
      values.$pastUpgrades:
+        [["2022-06-27T06:53:25.000Z",["0xf852de96aD5Ca30d54b40b9cE5c8C6DE56C0Ef4B"]],["2022-08-08T17:02:04.000Z",["0xb4299A1F5f26fF6a98B7BA35572290C359fde900"]]]
    }
```

```diff
    contract Bridge (0xC1Ebd02f738644983b6C4B2d440b8e77DdE276Bd) {
    +++ description: None
      values.$pastUpgrades:
+        [["2022-06-24T05:59:13.000Z",["0xd4254a4d136203dAd7AE5Ee05D6BD65B8d13157d"]],["2022-08-31T02:31:26.000Z",["0x1066CEcC8880948FE55e427E94F1FF221d626591"]]]
    }
```

```diff
    contract Inbox (0xc4448b71118c9071Bcb9734A0EAc55D18A153949) {
    +++ description: None
      values.$pastUpgrades:
+        [["2022-06-24T05:59:13.000Z",["0x320bB4633BB62027D4b1d7827dDc81CC73458639"]],["2022-06-28T22:31:20.000Z",["0x0f9866dEb74C0Aa3448c27606ed69c7Ad651B554"]],["2022-07-26T13:39:57.000Z",["0xB46e8571760Da0CFaEB9c9689C449Eb7dD7cB3e7"]],["2022-09-14T03:08:00.000Z",["0x1b2676D32E2f7430a564DD4560641F990dFE3D6a"]]]
    }
```

```diff
    contract L1GatewayRouter (0xC840838Bc438d73C16c2f8b22D2Ce3669963cD48) {
    +++ description: None
      values.$pastUpgrades:
+        [["2022-06-27T06:52:28.000Z",["0xa9610559f1E5BB0Eab9a25e21137D39426fd477E"]],["2022-08-08T17:02:04.000Z",["0x6D1c576Fe3e54313990450f5Fa322306B4cCB47B"]],["2022-11-08T16:47:59.000Z",["0x52595021fA01B3E14EC6C88953AFc8E35dFf423c"]]]
    }
```

```diff
    contract Outbox (0xD4B80C3D7240325D18E645B49e6535A3Bf95cc58) {
    +++ description: None
      values.$pastUpgrades:
+        [["2022-06-24T05:59:13.000Z",["0x476C807954b1ef8cF1Cb642E093fcF323557D721"]],["2022-06-25T01:31:40.000Z",["0x7439d8d4F3b9d9B6222f3E9760c75a47e08a7b3f"]]]
    }
```

```diff
    contract ValidatorWallet (0xE27d4Ed355e5273A3D4855c8e11BC4a8d3e39b87) {
    +++ description: None
      values.$pastUpgrades:
+        [["2022-06-26T04:26:25.000Z",["0x6Ab7A2f1a4febCD40A58b0205bFDA9CAf614b779"]]]
    }
```

```diff
    contract L1Timelock (0xE6841D92B0C345144506576eC13ECf5103aC7f49) {
    +++ description: None
      values.$pastUpgrades:
+        [["2023-03-16T12:08:35.000Z",["0x962d70fc48F3465404bC77B03f104746B25a1d1b"]],["2023-09-21T00:36:59.000Z",["0x61dC65001A8De4138DAD5167e43FF0FB0AB8D3B3"]]]
    }
```

```diff
    contract RollupProxy (0xFb209827c58283535b744575e11953DCC4bEAD88) {
    +++ description: Manages rollup components, list of Stakers and Validators. Entry point for Validators creating new Rollup Nodes (state commits) and Challengers submitting fraud proofs.
      values.$pastUpgrades:
+        [["2022-06-24T05:59:13.000Z",["0x309f49bD32B1098F4dF20a9DD51954e8680d77B1","0xFb333bac71f639de467872aFE02F7896F22F368d"]],["2022-09-14T03:08:00.000Z",["0x72f193d0F305F532C87a4B9D0A2F407a3F4f585f","0x5E7147d34EaB8c86b19DEd94C00F82181B5580eF"]],["2022-11-08T16:47:59.000Z",["0x72f193d0F305F532C87a4B9D0A2F407a3F4f585f","0xA0Ed0562629D45B88A34a342f20dEb58c46C15ff"]]]
      values.$upgradeCount:
+        3
    }
```

Generated with discovered.json: 0xecbd350675b51a58f7ae019eed67c0a873bbc8e6

# Diff at Wed, 25 Sep 2024 08:16:33 GMT:

- author: sekuba (<sekuba@users.noreply.github.com>)
- comparing to: main@e8c4fe6b10f7918ebbd761bc35018ba84053b08c block: 20627688
- current block number: 20826367

## Description

Emergency upgrade of the wasmModuleRoot to ArbOS 32 ([compare here](https://github.com/OffchainLabs/nitro/blob/master/Dockerfile)). 

Changelog below from telegram, post-mortem will follow: 
(1) a mispricing issue in Arbitrum Stylus, which could have caused a denial of service attack, (2) an issue that would allow a malicious contract to cause nodes to crash and (3) a mispricing error in which Stylus contracts were overcharged for SLOAD operations

## Watched changes

```diff
    contract RollupProxy (0xFb209827c58283535b744575e11953DCC4bEAD88) {
    +++ description: Manages rollup components, list of Stakers and Validators. Entry point for Validators creating new Rollup Nodes (state commits) and Challengers submitting fraud proofs.
+++ description: Root hash of the WASM module used for execution, like a fingerprint of the L2 logic. Can be associated with ArbOS versions.
      values.wasmModuleRoot:
-        "ArbOS v31 wasmModuleRoot"
+        "ArbOS v32 wasmModuleRoot"
    }
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20627688 (main branch discovery), not current.

```diff
    contract RollupProxy (0xFb209827c58283535b744575e11953DCC4bEAD88) {
    +++ description: Manages rollup components, list of Stakers and Validators. Entry point for Validators creating new Rollup Nodes (state commits) and Challengers submitting fraud proofs.
      usedTypes.0.arg.0x184884e1eb9fefdc158f6c8ac912bb183bf3cf83f0090317e0bc4ac5860baa39:
+        "ArbOS v32 wasmModuleRoot"
    }
```

Generated with discovered.json: 0x96627cfed5d55f2d01fbf08e7663584d782e0326

# Diff at Sun, 01 Sep 2024 08:45:26 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@bee35b6cff7c52634ae8667cbb331e18ad4ec17a block: 20627688
- current block number: 20627688

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20627688 (main branch discovery), not current.

```diff
    contract RollupProxy (0xFb209827c58283535b744575e11953DCC4bEAD88) {
    +++ description: Manages rollup components, list of Stakers and Validators. Entry point for Validators creating new Rollup Nodes (state commits) and Challengers submitting fraud proofs.
+++ description: Root hash of the WASM module used for execution, like a fingerprint of the L2 logic. Can be associated with ArbOS versions.
      values.wasmModuleRoot:
-        "0x260f5fa5c3176a856893642e149cf128b5a8de9f828afec8d11184415dd8dc69"
+        "ArbOS v31 wasmModuleRoot"
      usedTypes:
+        [{"typeCaster":"Mapping","arg":{"0xbb9d58e9527566138b682f3a207c0976d5359837f6e330f4017434cca983ff41":"ArbOS v1-rc1 wasmModuleRoot","0x9d68e40c47e3b87a8a7e6368cc52915720a6484bb2f47ceabad7e573e3a11232":"ArbOS v2.1 wasmModuleRoot","0x53c288a0ca7100c0f2db8ab19508763a51c7fd1be125d376d940a65378acaee7":"ArbOS v3 wasmModuleRoot","0x588762be2f364be15d323df2aa60ffff60f2b14103b34823b6f7319acd1ae7a3":"ArbOS v3.1 wasmModuleRoot","0xcfba6a883c50a1b4475ab909600fa88fc9cceed9e3ff6f43dccd2d27f6bd57cf":"ArbOS v3.2 wasmModuleRoot","0xa24ccdb052d92c5847e8ea3ce722442358db4b00985a9ee737c4e601b6ed9876":"ArbOS v4 wasmModuleRoot","0x1e09e6d9e35b93f33ed22b2bc8dc10bbcf63fdde5e8a1fb8cc1bcd1a52f14bd0":"ArbOS v5 wasmModuleRoot","0x3848eff5e0356faf1fc9cafecb789584c5e7f4f8f817694d842ada96613d8bab":"ArbOS v6 wasmModuleRoot","0x53dd4b9a3d807a8cbb4d58fbfc6a0857c3846d46956848cae0a1cc7eca2bb5a8":"ArbOS v7 wasmModuleRoot","0x2b20e1490d1b06299b222f3239b0ae07e750d8f3b4dedd19f500a815c1548bbc":"ArbOS v7.1 wasmModuleRoot","0xd1842bfbe047322b3f3b3635b5fe62eb611557784d17ac1d2b1ce9c170af6544":"ArbOS v9 wasmModuleRoot","0x6b94a7fc388fd8ef3def759297828dc311761e88d8179c7ee8d3887dc554f3c3":"ArbOS v10 wasmModuleRoot","0xda4e3ad5e7feacb817c21c8d0220da7650fe9051ece68a3f0b1c5d38bbb27b21":"ArbOS v10.1 wasmModuleRoot","0x0754e09320c381566cc0449904c377a52bd34a6b9404432e80afd573b67f7b17":"ArbOS v10.2 wasmModuleRoot","0xf559b6d4fa869472dabce70fe1c15221bdda837533dfd891916836975b434dec":"ArbOS v10.3 wasmModuleRoot","0xf4389b835497a910d7ba3ebfb77aa93da985634f3c052de1290360635be40c4a":"ArbOS v11 wasmModuleRoot","0x68e4fe5023f792d4ef584796c84d710303a5e12ea02d6e37e2b5e9c4332507c4":"ArbOS v11.1 wasmModuleRoot","0x8b104a2e80ac6165dc58b9048de12f301d70b02a0ab51396c22b4b4b802a16a4":"ArbOS v20 wasmModuleRoot","0xb0de9cb89e4d944ae6023a3b62276e54804c242fd8c4c2d8e6cc4450f5fa8b1b":"ArbOS v30 wasmModuleRoot","0x260f5fa5c3176a856893642e149cf128b5a8de9f828afec8d11184415dd8dc69":"ArbOS v31 wasmModuleRoot"}}]
    }
```

Generated with discovered.json: 0x3b281c5eff40c4840d8409fd115c3d1e2d70675b

# Diff at Fri, 30 Aug 2024 07:54:03 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@6c1bd1f41fadf5f2cb1c1805b5a2c6138a3ed35a block: 20627688
- current block number: 20627688

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20627688 (main branch discovery), not current.

```diff
    contract UpgradeExecutor (0x3ffFbAdAF827559da092217e474760E2b2c3CeDd) {
    +++ description: None
      receivedPermissions.0.via:
-        []
    }
```

```diff
    contract ProxyAdmin 2 (0x5613AF0474EB9c528A34701A5b1662E3C8FA0678) {
    +++ description: None
      receivedPermissions.1.via:
-        []
      receivedPermissions.0.via:
-        []
    }
```

```diff
    contract ProxyAdmin (0x71D78dC7cCC0e037e12de1E50f5470903ce37148) {
    +++ description: None
      receivedPermissions.5.via:
-        []
      receivedPermissions.4.via:
-        []
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
    contract ProxyAdmin (0x8f6b82D007C0Ff4fd85fE84a5BFa89C00A4e6d2B) {
    +++ description: None
      receivedPermissions.0.via:
-        []
    }
```

```diff
    contract ProxyAdmin 3 (0xa8f7DdEd54a726eB873E98bFF2C95ABF2d03e560) {
    +++ description: None
      receivedPermissions.2.via:
-        []
      receivedPermissions.1.via:
-        []
      receivedPermissions.0.via:
-        []
    }
```

```diff
    contract ProxyAdmin (0xAd3a14Fc16751d9E7FCa2A99aF85bf4d135e878d) {
    +++ description: None
      receivedPermissions.0.via:
-        []
    }
```

```diff
    contract ProxyAdmin (0xb31407BCf91d54AbFC0B7ef61bFc71b8b71F0678) {
    +++ description: None
      receivedPermissions.0.via:
-        []
    }
```

```diff
    contract ProxyAdmin (0xb85e18C8F552c823CdA4DCd9056213bDc970f9AE) {
    +++ description: None
      receivedPermissions.0.via:
-        []
    }
```

```diff
    contract ProxyAdmin (0xE4d0Ba69d082Fdf6f51b8fc8F92c19bF00B1a1B4) {
    +++ description: None
      receivedPermissions.0.via:
-        []
    }
```

```diff
    contract ProxyAdmin (0xF32e5B5Ad94c0c0F83E0023b0AC48A93A8a2a428) {
    +++ description: None
      receivedPermissions.0.via:
-        []
    }
```

Generated with discovered.json: 0x324bfd28aa5c957c43a8191866f766899657ef17

# Diff at Wed, 28 Aug 2024 14:29:47 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@0fa673a678e6e769a295956285789968836b97a6 block: 20406615
- current block number: 20627688

## Description

Scheduled transactions related to ArbOS 31 "Bianca" are executed. The release notes [in the docs](https://docs.arbitrum.io/run-arbitrum-node/arbos-releases/arbos31) and [on Github](https://github.com/OffchainLabs/nitro/releases/tag/v3.1.1) give a good overview over the changes: Stylus, Passkeys, Fast Withdrawals for AnyTrust chains.

The default wasmModuleRoot is upgraded to ArbOS 31.

Nova shares its new implementation contracts with Arbitrum One.

## Watched changes

```diff
-   Status: DELETED
    contract OneStepProverMath (0x221CCc45985Fdd24e33c3f19c6b7D48C02d5DCAa)
    +++ description: None
```

```diff
-   Status: DELETED
    contract OneStepProver0 (0xA174e12Ff8C6b18B37fecA77d6d350D89379A58C)
    +++ description: None
```

```diff
    contract ChallengeManager (0xA59075221b50C598aED0Eae0bB9869639513af0D) {
    +++ description: None
      values.$implementation:
-        "0xE129b8Aa61dF65cBDbAE4345eE3fb40168DfD566"
+        "0x914B7b3053B35B84A24df08D7c9ceBCaEA4E2948"
      values.$upgradeCount:
-        2
+        3
      values.osp:
-        "0xC6E1E6dB03c3F475bC760FE20ed93401EC5c4F7e"
+        "0xa328BAF257A937b7934429a5d8458d98693C6FC7"
    }
```

```diff
-   Status: DELETED
    contract OneStepProverMemory (0xb602D056BD6BA78c3A320660d1a45D1cc8bbD3ED)
    +++ description: None
```

```diff
-   Status: DELETED
    contract OneStepProofEntry (0xC6E1E6dB03c3F475bC760FE20ed93401EC5c4F7e)
    +++ description: None
```

```diff
-   Status: DELETED
    contract OneStepProverHostIo (0xd7f12E7418B007Ad7A5c7ACBbF460D3Cfe92A63e)
    +++ description: None
```

```diff
    contract RollupProxy (0xFb209827c58283535b744575e11953DCC4bEAD88) {
    +++ description: Manages rollup components, list of Stakers and Validators. Entry point for Validators creating new Rollup Nodes (state commits) and Challengers submitting fraud proofs.
+++ description: Root hash of the WASM module used for execution, like a fingerprint of the L2 logic. Can be associated with ArbOS versions.
      values.wasmModuleRoot:
-        "0x8b104a2e80ac6165dc58b9048de12f301d70b02a0ab51396c22b4b4b802a16a4"
+        "0x260f5fa5c3176a856893642e149cf128b5a8de9f828afec8d11184415dd8dc69"
    }
```

```diff
+   Status: CREATED
    contract OneStepProverMath (0x2c785E954c376be0CEfF4a7Db92E053B0830F7c9)
    +++ description: None
```

```diff
+   Status: CREATED
    contract OneStepProverMemory (0x5C9F8663583Ad0A1c0009c871f8253DBF4767A18)
    +++ description: None
```

```diff
+   Status: CREATED
    contract OneStepProverHostIo (0x8D78382913467Cd25374C75BA918b0A723Bc2544)
    +++ description: None
```

```diff
+   Status: CREATED
    contract OneStepProofEntry (0xa328BAF257A937b7934429a5d8458d98693C6FC7)
    +++ description: None
```

```diff
+   Status: CREATED
    contract OneStepProver0 (0xD0465e3356213869f1Fae38b3E67CBF4E873c5B6)
    +++ description: None
```

## Source code changes

```diff
.../ChallengeManager/ChallengeManager.sol          | 404 ++++++----
 .../OneStepProofEntry.sol                          | 485 +++++++++--
 .../{.flat@20406615 => .flat}/OneStepProver0.sol   | 765 +++++++++++++-----
 .../OneStepProverHostIo.sol                        | 892 +++++++++++++++++----
 .../OneStepProverMath.sol                          |  65 +-
 .../OneStepProverMemory.sol                        | 315 ++++++--
 6 files changed, 2246 insertions(+), 680 deletions(-)
```

Generated with discovered.json: 0x6c69cb852e3e0c2dbec68fa598d5458299317858

# Diff at Fri, 23 Aug 2024 09:53:37 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@67597c7d6c810bc726594446890178150240711e block: 20406615
- current block number: 20406615

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20406615 (main branch discovery), not current.

```diff
    contract ValidatorWallet (0x1732BE6738117e9d22A84181AF68C8d09Cd4FF23) {
    +++ description: None
      values.$upgradeCount:
+        1
    }
```

```diff
    contract SequencerInbox (0x211E1c4c7f1bF5351Ac850Ed10FD68CFfCF6c21b) {
    +++ description: None
      values.$upgradeCount:
+        6
    }
```

```diff
    contract L1CustomGateway (0x23122da8C581AA7E0d07A36Ff1f16F799650232f) {
    +++ description: None
      values.$upgradeCount:
+        2
    }
```

```diff
    contract ValidatorWallet (0x24Ca61c31C7f9Af3ab104dB6B9A444F28e9071e3) {
    +++ description: None
      values.$upgradeCount:
+        1
    }
```

```diff
    contract RollupEventInbox (0x304807A7ed6c1296df2128E6ff3836e477329CD2) {
    +++ description: None
      values.$upgradeCount:
+        1
    }
```

```diff
    contract Validator (0x3B0369CAD35d257793F51c28213a4Cf4001397AC) {
    +++ description: None
      values.$upgradeCount:
+        0
    }
```

```diff
    contract UpgradeExecutor (0x3ffFbAdAF827559da092217e474760E2b2c3CeDd) {
    +++ description: None
      values.$upgradeCount:
+        1
    }
```

```diff
    contract ValidatorWallet (0x57004b440Cc4eb2FEd8c4d1865FaC907F9150C76) {
    +++ description: None
      values.$upgradeCount:
+        1
    }
```

```diff
    contract ValidatorWallet (0x658e8123722462F888b6fa01a7dbcEFe1D6DD709) {
    +++ description: None
      values.$upgradeCount:
+        1
    }
```

```diff
    contract ChallengeManager (0xA59075221b50C598aED0Eae0bB9869639513af0D) {
    +++ description: None
      values.$upgradeCount:
+        2
    }
```

```diff
    contract L1ERC20Gateway (0xB2535b988dcE19f9D71dfB22dB6da744aCac21bf) {
    +++ description: None
      values.$upgradeCount:
+        2
    }
```

```diff
    contract Bridge (0xC1Ebd02f738644983b6C4B2d440b8e77DdE276Bd) {
    +++ description: None
      values.$upgradeCount:
+        2
    }
```

```diff
    contract Inbox (0xc4448b71118c9071Bcb9734A0EAc55D18A153949) {
    +++ description: None
      values.$upgradeCount:
+        4
    }
```

```diff
    contract L1GatewayRouter (0xC840838Bc438d73C16c2f8b22D2Ce3669963cD48) {
    +++ description: None
      values.$upgradeCount:
+        3
    }
```

```diff
    contract Outbox (0xD4B80C3D7240325D18E645B49e6535A3Bf95cc58) {
    +++ description: None
      values.$upgradeCount:
+        2
    }
```

```diff
    contract ValidatorWallet (0xE27d4Ed355e5273A3D4855c8e11BC4a8d3e39b87) {
    +++ description: None
      values.$upgradeCount:
+        1
    }
```

```diff
    contract L1Timelock (0xE6841D92B0C345144506576eC13ECf5103aC7f49) {
    +++ description: None
      values.$upgradeCount:
+        2
    }
```

Generated with discovered.json: 0x46fd535ec6ef9bb3ee4e22104ba4c211f2ad7502

# Diff at Wed, 21 Aug 2024 13:25:51 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@63cb0bd5d55a6dfae0e2e22590983dd8344be4a3 block: 20406615
- current block number: 20406615

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20406615 (main branch discovery), not current.

```diff
    contract SequencerInbox (0x211E1c4c7f1bF5351Ac850Ed10FD68CFfCF6c21b) {
    +++ description: None
      values.dacKeyset.blsSignatures:
+        ["YAbcteVnZLty5qRebeswHKhdjEMVwdou+imSfyrI+yVXHOMdLWA3Nf4DGW9tVry/mhmZqJp01TaYIsREXWdsFe1S5QCNqnddyag5yZ/5Y6GZRqx0BXmHTaxPY5kHrhvGnwxmlJVbUk1xjKRFgxxTdTk3c0AfM3JaeWYTed3avV//KGGdwHC+/Z7XPWmeXCNsGhY75YuoEAK2EwcJvAZK9de6lHEwtyBWvxcmOADxo6siacalEO+OdBL9VtHvG5FqEwbjsdnILAmTcb2YYVgqyq2joW6d/uXQ685hCWWYqC8RLQqTXoyrXEjYLjEEsMe6eRV9rRoBmj5/atB3uOYwixFv7A9YI5YiRjw2MfoB4rQnJAkhW4AJQiwWcV2+3lkJBg==","YAbOg53k1qOuAvJbQIlTHmo9LeVWvQBr0wzy00CLl30Y8XVt1KG8PADbkALw2O8a9Q+6ppWd7L7By+I0zG72JwoDM5CQ4COPisn4oY9EuHNMjzthI90SiuSKCGO5p/bYgwIENoF3LCt581DBS8nXsY5XjHlcp2klznvSiR0Jqjf+LOHqL/5MA4/vIvZuKJlcYQkCIehqM2j7bWcar8GQAfQif5LzZxr2pgs9sShaFC9JwfRQt2/rmxrvGlUehY5LcwLGzxyn+sBbmTujddgYP5DAifqKPfMaRD0uCo7xkwZwaPv8yizvI0z22cm1iE72lwWnGBClZlFybKO3rN+v/fq5soRLTqaHK0P/m32i4QouI6eRMMPExwqK0Kd+stUfFg==","YA+HK4mKT9G4rnNRX30zzXvh6XHOGJaqvvL4km5YbEJI3A23/XhRQCwUFJ3D3ITzgww0YWfDnlMjlxrDQEFfCi6wVKmo4KXVA6Ks/s690d9xrurDs4JgSAxpm8CZNPCRPg7lquq9VzEyhSB+uJNmtBEobPPxxeMOt+NV9VOFMIuR1YByhDI+6JqXQ8cGdvSUlQTO0+1BYSy/2gatVSAMHHfT+zcABZvv1kxEvEpXy1Z+wUge5WTPbNbPHy9KLe5tsAxUfDhACrEY3tror9W6uTtwP3agmRuqXUP7sSUZTAa1Rh+Mc4o8Qnij2Y5UVq7AcgiDwNKJGVN6NuL/1fcx50K2ZTVX0VTBZOBo75g7Nn72Jvqu1G9Orey7ErflXyMXXQ==","YALC7DeOtroXqegbj9RCY9aZw0cZSSpOzx7napQrwiR4+3qflOLxWCJjDy1hbDKjNAOHEY5LluJtbkHbqrn+J61gi9gjoUL5iPfamZzeygirSv7baz2i1NsgjMC6kb/UThU71zc2t98BNBeAqqfxhfyg06R437U7YS7ZHwVEFt571ixZ05tO5gTqlstC89aqIBEhl7S5rPc25H+0TPAMvjclIn2K6lvKHvu7iUwcu1ZqerG3Aegdr9W58wd85Piy+AAKBH+4jcXc+K/udljfD5hTM6MVFvumIgB2D+QlbAJgsZmUlzf7iPd9dcNd6kNJJhIT7mvrv/NQIEr/fNhGFlG+1Xy0VRhLkKv1ahuyPe/+qbsl2uxc0r6dfOAQcZudWg==","YBN+CWUmeRP56vhb/yLjzl9Euxv67XZ5sWgKzRVDaoQyXrp/KWLKRpN8y/Rtme3JRANM3Ze8T7HY3DrducNIQxqZl1lZ5qyCODdq8x8D51T6PDFZJ81oYCZeyObpfaQKlQkyd3PnqlvPrvdpDXaQYzNvbVIQp95V4OvyUf/VP23KAiJn+8P/wI5HCeNBSpa4BAVt1+f/w4kn2KPYpcD0ao5zfWOOie9clvxd/nmiHaCitcvQwbsulcqbv/HUFlhcLAEZtnbcBTxauzsLTWDq+gZXFaLDAajVi6yHHfg238DrjU7eGRyrTPZlVFGjfJzzdggqZdXyO4GMGFxWsWzpgLb+DWiDj95nePzGUs9oE/79Ids3J0VN9ZrTvnRl1gUHqg==","YAR40SbOOU71LW/8aEVnLfztsU1Mq+dqzZ7/8liSsx3DLYvSFCZXXwijCxuEu4wfZQeBDiXUeFLx8qBrZrU0HQLXSBoczgElfnaKoaWbaDoo9veUZnRUHw9OI2Q9Md/X6QlYo2HH24a2KP4HXZTIXixD+FjT82g9U2mof3azkCwHZd3IyQTjdbD1dA210uJfGxWalm4gWWsaOP8xG1Nl13CcxnmZEwfWkhUs/0mHZmPzFeCB9MC8hcOKZvIZjVOQFwwnXiPphD6nSgRrPnCEqqHVPG/GyGIiUNy4EtREw0GoRw30ssLsOrDUqlY7EBoxUg1x3wycHuxIGMuuyzJKwrkEWusxa7H0xsmqySR/HsP7gkJH84WNG5xgMUE6EaewWQ=="]
    }
```

Generated with discovered.json: 0xe79f128c4e4e55d1776dd7c67dc13695c56ed64f

# Diff at Wed, 21 Aug 2024 10:04:25 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@2f6dde3357bf5d79196b6e94f79d853a6c4ec72b block: 20406615
- current block number: 20406615

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20406615 (main branch discovery), not current.

```diff
    contract ValidatorWallet (0x1732BE6738117e9d22A84181AF68C8d09Cd4FF23) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0xAd3a14Fc16751d9E7FCa2A99aF85bf4d135e878d","via":[]}]
    }
```

```diff
    contract SequencerInbox (0x211E1c4c7f1bF5351Ac850Ed10FD68CFfCF6c21b) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x71D78dC7cCC0e037e12de1E50f5470903ce37148","via":[]}]
    }
```

```diff
    contract L1CustomGateway (0x23122da8C581AA7E0d07A36Ff1f16F799650232f) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0xa8f7DdEd54a726eB873E98bFF2C95ABF2d03e560","via":[]}]
    }
```

```diff
    contract ValidatorWallet (0x24Ca61c31C7f9Af3ab104dB6B9A444F28e9071e3) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0xb31407BCf91d54AbFC0B7ef61bFc71b8b71F0678","via":[]}]
    }
```

```diff
    contract RollupEventInbox (0x304807A7ed6c1296df2128E6ff3836e477329CD2) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x71D78dC7cCC0e037e12de1E50f5470903ce37148","via":[]}]
    }
```

```diff
    contract Validator (0x3B0369CAD35d257793F51c28213a4Cf4001397AC) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0xb85e18C8F552c823CdA4DCd9056213bDc970f9AE","via":[]}]
    }
```

```diff
    contract UpgradeExecutor (0x3ffFbAdAF827559da092217e474760E2b2c3CeDd) {
    +++ description: None
      assignedPermissions:
-        {"upgrade":["0xFb209827c58283535b744575e11953DCC4bEAD88"]}
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x5613AF0474EB9c528A34701A5b1662E3C8FA0678","via":[]}]
      receivedPermissions:
+        [{"permission":"upgrade","target":"0xFb209827c58283535b744575e11953DCC4bEAD88","via":[]}]
    }
```

```diff
    contract ProxyAdmin 2 (0x5613AF0474EB9c528A34701A5b1662E3C8FA0678) {
    +++ description: None
      assignedPermissions:
-        {"upgrade":["0x3ffFbAdAF827559da092217e474760E2b2c3CeDd","0xE6841D92B0C345144506576eC13ECf5103aC7f49"]}
      receivedPermissions:
+        [{"permission":"upgrade","target":"0x3ffFbAdAF827559da092217e474760E2b2c3CeDd","via":[]},{"permission":"upgrade","target":"0xE6841D92B0C345144506576eC13ECf5103aC7f49","via":[]}]
    }
```

```diff
    contract ValidatorWallet (0x57004b440Cc4eb2FEd8c4d1865FaC907F9150C76) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0xF32e5B5Ad94c0c0F83E0023b0AC48A93A8a2a428","via":[]}]
    }
```

```diff
    contract ValidatorWallet (0x658e8123722462F888b6fa01a7dbcEFe1D6DD709) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x8f6b82D007C0Ff4fd85fE84a5BFa89C00A4e6d2B","via":[]}]
    }
```

```diff
    contract ProxyAdmin (0x71D78dC7cCC0e037e12de1E50f5470903ce37148) {
    +++ description: None
      assignedPermissions:
-        {"upgrade":["0x211E1c4c7f1bF5351Ac850Ed10FD68CFfCF6c21b","0x304807A7ed6c1296df2128E6ff3836e477329CD2","0xA59075221b50C598aED0Eae0bB9869639513af0D","0xC1Ebd02f738644983b6C4B2d440b8e77DdE276Bd","0xD4B80C3D7240325D18E645B49e6535A3Bf95cc58","0xc4448b71118c9071Bcb9734A0EAc55D18A153949"]}
      receivedPermissions:
+        [{"permission":"upgrade","target":"0x211E1c4c7f1bF5351Ac850Ed10FD68CFfCF6c21b","via":[]},{"permission":"upgrade","target":"0x304807A7ed6c1296df2128E6ff3836e477329CD2","via":[]},{"permission":"upgrade","target":"0xA59075221b50C598aED0Eae0bB9869639513af0D","via":[]},{"permission":"upgrade","target":"0xC1Ebd02f738644983b6C4B2d440b8e77DdE276Bd","via":[]},{"permission":"upgrade","target":"0xc4448b71118c9071Bcb9734A0EAc55D18A153949","via":[]},{"permission":"upgrade","target":"0xD4B80C3D7240325D18E645B49e6535A3Bf95cc58","via":[]}]
    }
```

```diff
    contract ProxyAdmin (0x8f6b82D007C0Ff4fd85fE84a5BFa89C00A4e6d2B) {
    +++ description: None
      assignedPermissions:
-        {"upgrade":["0x658e8123722462F888b6fa01a7dbcEFe1D6DD709"]}
      receivedPermissions:
+        [{"permission":"upgrade","target":"0x658e8123722462F888b6fa01a7dbcEFe1D6DD709","via":[]}]
    }
```

```diff
    contract ChallengeManager (0xA59075221b50C598aED0Eae0bB9869639513af0D) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x71D78dC7cCC0e037e12de1E50f5470903ce37148","via":[]}]
    }
```

```diff
    contract ProxyAdmin 3 (0xa8f7DdEd54a726eB873E98bFF2C95ABF2d03e560) {
    +++ description: None
      assignedPermissions:
-        {"upgrade":["0x23122da8C581AA7E0d07A36Ff1f16F799650232f","0xB2535b988dcE19f9D71dfB22dB6da744aCac21bf","0xC840838Bc438d73C16c2f8b22D2Ce3669963cD48"]}
      receivedPermissions:
+        [{"permission":"upgrade","target":"0x23122da8C581AA7E0d07A36Ff1f16F799650232f","via":[]},{"permission":"upgrade","target":"0xB2535b988dcE19f9D71dfB22dB6da744aCac21bf","via":[]},{"permission":"upgrade","target":"0xC840838Bc438d73C16c2f8b22D2Ce3669963cD48","via":[]}]
    }
```

```diff
    contract ProxyAdmin (0xAd3a14Fc16751d9E7FCa2A99aF85bf4d135e878d) {
    +++ description: None
      assignedPermissions:
-        {"upgrade":["0x1732BE6738117e9d22A84181AF68C8d09Cd4FF23"]}
      receivedPermissions:
+        [{"permission":"upgrade","target":"0x1732BE6738117e9d22A84181AF68C8d09Cd4FF23","via":[]}]
    }
```

```diff
    contract L1ERC20Gateway (0xB2535b988dcE19f9D71dfB22dB6da744aCac21bf) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0xa8f7DdEd54a726eB873E98bFF2C95ABF2d03e560","via":[]}]
    }
```

```diff
    contract ProxyAdmin (0xb31407BCf91d54AbFC0B7ef61bFc71b8b71F0678) {
    +++ description: None
      assignedPermissions:
-        {"upgrade":["0x24Ca61c31C7f9Af3ab104dB6B9A444F28e9071e3"]}
      receivedPermissions:
+        [{"permission":"upgrade","target":"0x24Ca61c31C7f9Af3ab104dB6B9A444F28e9071e3","via":[]}]
    }
```

```diff
    contract ProxyAdmin (0xb85e18C8F552c823CdA4DCd9056213bDc970f9AE) {
    +++ description: None
      assignedPermissions:
-        {"upgrade":["0x3B0369CAD35d257793F51c28213a4Cf4001397AC"]}
      receivedPermissions:
+        [{"permission":"upgrade","target":"0x3B0369CAD35d257793F51c28213a4Cf4001397AC","via":[]}]
    }
```

```diff
    contract Bridge (0xC1Ebd02f738644983b6C4B2d440b8e77DdE276Bd) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x71D78dC7cCC0e037e12de1E50f5470903ce37148","via":[]}]
    }
```

```diff
    contract Inbox (0xc4448b71118c9071Bcb9734A0EAc55D18A153949) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x71D78dC7cCC0e037e12de1E50f5470903ce37148","via":[]}]
    }
```

```diff
    contract L1GatewayRouter (0xC840838Bc438d73C16c2f8b22D2Ce3669963cD48) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0xa8f7DdEd54a726eB873E98bFF2C95ABF2d03e560","via":[]}]
    }
```

```diff
    contract Outbox (0xD4B80C3D7240325D18E645B49e6535A3Bf95cc58) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x71D78dC7cCC0e037e12de1E50f5470903ce37148","via":[]}]
    }
```

```diff
    contract ValidatorWallet (0xE27d4Ed355e5273A3D4855c8e11BC4a8d3e39b87) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0xE4d0Ba69d082Fdf6f51b8fc8F92c19bF00B1a1B4","via":[]}]
    }
```

```diff
    contract ProxyAdmin (0xE4d0Ba69d082Fdf6f51b8fc8F92c19bF00B1a1B4) {
    +++ description: None
      assignedPermissions:
-        {"upgrade":["0xE27d4Ed355e5273A3D4855c8e11BC4a8d3e39b87"]}
      receivedPermissions:
+        [{"permission":"upgrade","target":"0xE27d4Ed355e5273A3D4855c8e11BC4a8d3e39b87","via":[]}]
    }
```

```diff
    contract L1Timelock (0xE6841D92B0C345144506576eC13ECf5103aC7f49) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x5613AF0474EB9c528A34701A5b1662E3C8FA0678","via":[]}]
    }
```

```diff
    contract ProxyAdmin (0xF32e5B5Ad94c0c0F83E0023b0AC48A93A8a2a428) {
    +++ description: None
      assignedPermissions:
-        {"upgrade":["0x57004b440Cc4eb2FEd8c4d1865FaC907F9150C76"]}
      receivedPermissions:
+        [{"permission":"upgrade","target":"0x57004b440Cc4eb2FEd8c4d1865FaC907F9150C76","via":[]}]
    }
```

```diff
    contract RollupProxy (0xFb209827c58283535b744575e11953DCC4bEAD88) {
    +++ description: Manages rollup components, list of Stakers and Validators. Entry point for Validators creating new Rollup Nodes (state commits) and Challengers submitting fraud proofs.
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x3ffFbAdAF827559da092217e474760E2b2c3CeDd","via":[]}]
    }
```

Generated with discovered.json: 0x898a4c69c2bdae7d51cc052f951c35400091df6d

# Diff at Fri, 09 Aug 2024 12:00:46 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@bf40aa32f030fd312056ca0ef198c8550467d1d7 block: 20406615
- current block number: 20406615

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20406615 (main branch discovery), not current.

```diff
    contract ProxyAdmin (0x71D78dC7cCC0e037e12de1E50f5470903ce37148) {
    +++ description: None
      assignedPermissions.upgrade.5:
-        "0x211E1c4c7f1bF5351Ac850Ed10FD68CFfCF6c21b"
+        "0xc4448b71118c9071Bcb9734A0EAc55D18A153949"
      assignedPermissions.upgrade.4:
-        "0xC1Ebd02f738644983b6C4B2d440b8e77DdE276Bd"
+        "0xD4B80C3D7240325D18E645B49e6535A3Bf95cc58"
      assignedPermissions.upgrade.3:
-        "0x304807A7ed6c1296df2128E6ff3836e477329CD2"
+        "0xC1Ebd02f738644983b6C4B2d440b8e77DdE276Bd"
      assignedPermissions.upgrade.2:
-        "0xD4B80C3D7240325D18E645B49e6535A3Bf95cc58"
+        "0xA59075221b50C598aED0Eae0bB9869639513af0D"
      assignedPermissions.upgrade.1:
-        "0xc4448b71118c9071Bcb9734A0EAc55D18A153949"
+        "0x304807A7ed6c1296df2128E6ff3836e477329CD2"
      assignedPermissions.upgrade.0:
-        "0xA59075221b50C598aED0Eae0bB9869639513af0D"
+        "0x211E1c4c7f1bF5351Ac850Ed10FD68CFfCF6c21b"
    }
```

```diff
    contract ProxyAdmin 3 (0xa8f7DdEd54a726eB873E98bFF2C95ABF2d03e560) {
    +++ description: None
      assignedPermissions.upgrade.2:
-        "0xB2535b988dcE19f9D71dfB22dB6da744aCac21bf"
+        "0xC840838Bc438d73C16c2f8b22D2Ce3669963cD48"
      assignedPermissions.upgrade.1:
-        "0x23122da8C581AA7E0d07A36Ff1f16F799650232f"
+        "0xB2535b988dcE19f9D71dfB22dB6da744aCac21bf"
      assignedPermissions.upgrade.0:
-        "0xC840838Bc438d73C16c2f8b22D2Ce3669963cD48"
+        "0x23122da8C581AA7E0d07A36Ff1f16F799650232f"
    }
```

Generated with discovered.json: 0xffe38757b76ac47d79d3c1f13b9a384b23ce5767

# Diff at Fri, 09 Aug 2024 10:10:50 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@1f0da1d0aab7bc6b3b5e54e7e93480bd98e57035 block: 20406615
- current block number: 20406615

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20406615 (main branch discovery), not current.

```diff
    contract UpgradeExecutor (0x3ffFbAdAF827559da092217e474760E2b2c3CeDd) {
    +++ description: None
      assignedPermissions.admin:
-        ["0xFb209827c58283535b744575e11953DCC4bEAD88"]
      assignedPermissions.upgrade:
+        ["0xFb209827c58283535b744575e11953DCC4bEAD88"]
    }
```

```diff
    contract ProxyAdmin 2 (0x5613AF0474EB9c528A34701A5b1662E3C8FA0678) {
    +++ description: None
      assignedPermissions.admin:
-        ["0x3ffFbAdAF827559da092217e474760E2b2c3CeDd","0xE6841D92B0C345144506576eC13ECf5103aC7f49"]
      assignedPermissions.upgrade:
+        ["0x3ffFbAdAF827559da092217e474760E2b2c3CeDd","0xE6841D92B0C345144506576eC13ECf5103aC7f49"]
    }
```

```diff
    contract ProxyAdmin (0x71D78dC7cCC0e037e12de1E50f5470903ce37148) {
    +++ description: None
      assignedPermissions.admin:
-        ["0x211E1c4c7f1bF5351Ac850Ed10FD68CFfCF6c21b","0x304807A7ed6c1296df2128E6ff3836e477329CD2","0xA59075221b50C598aED0Eae0bB9869639513af0D","0xC1Ebd02f738644983b6C4B2d440b8e77DdE276Bd","0xD4B80C3D7240325D18E645B49e6535A3Bf95cc58","0xc4448b71118c9071Bcb9734A0EAc55D18A153949"]
      assignedPermissions.upgrade:
+        ["0xA59075221b50C598aED0Eae0bB9869639513af0D","0xc4448b71118c9071Bcb9734A0EAc55D18A153949","0xD4B80C3D7240325D18E645B49e6535A3Bf95cc58","0x304807A7ed6c1296df2128E6ff3836e477329CD2","0xC1Ebd02f738644983b6C4B2d440b8e77DdE276Bd","0x211E1c4c7f1bF5351Ac850Ed10FD68CFfCF6c21b"]
    }
```

```diff
    contract ProxyAdmin (0x8f6b82D007C0Ff4fd85fE84a5BFa89C00A4e6d2B) {
    +++ description: None
      assignedPermissions.admin:
-        ["0x658e8123722462F888b6fa01a7dbcEFe1D6DD709"]
      assignedPermissions.upgrade:
+        ["0x658e8123722462F888b6fa01a7dbcEFe1D6DD709"]
    }
```

```diff
    contract ProxyAdmin 3 (0xa8f7DdEd54a726eB873E98bFF2C95ABF2d03e560) {
    +++ description: None
      assignedPermissions.admin:
-        ["0x23122da8C581AA7E0d07A36Ff1f16F799650232f","0xB2535b988dcE19f9D71dfB22dB6da744aCac21bf","0xC840838Bc438d73C16c2f8b22D2Ce3669963cD48"]
      assignedPermissions.upgrade:
+        ["0xC840838Bc438d73C16c2f8b22D2Ce3669963cD48","0x23122da8C581AA7E0d07A36Ff1f16F799650232f","0xB2535b988dcE19f9D71dfB22dB6da744aCac21bf"]
    }
```

```diff
    contract ProxyAdmin (0xAd3a14Fc16751d9E7FCa2A99aF85bf4d135e878d) {
    +++ description: None
      assignedPermissions.admin:
-        ["0x1732BE6738117e9d22A84181AF68C8d09Cd4FF23"]
      assignedPermissions.upgrade:
+        ["0x1732BE6738117e9d22A84181AF68C8d09Cd4FF23"]
    }
```

```diff
    contract ProxyAdmin (0xb31407BCf91d54AbFC0B7ef61bFc71b8b71F0678) {
    +++ description: None
      assignedPermissions.admin:
-        ["0x24Ca61c31C7f9Af3ab104dB6B9A444F28e9071e3"]
      assignedPermissions.upgrade:
+        ["0x24Ca61c31C7f9Af3ab104dB6B9A444F28e9071e3"]
    }
```

```diff
    contract ProxyAdmin (0xb85e18C8F552c823CdA4DCd9056213bDc970f9AE) {
    +++ description: None
      assignedPermissions.admin:
-        ["0x3B0369CAD35d257793F51c28213a4Cf4001397AC"]
      assignedPermissions.upgrade:
+        ["0x3B0369CAD35d257793F51c28213a4Cf4001397AC"]
    }
```

```diff
    contract ValidatorOwnerMultisig (0xC234E41AE2cb00311956Aa7109fC801ae8c80941) {
    +++ description: None
      values.$multisigThreshold:
-        "4 of 6 (67%)"
      values.getOwners:
-        ["0x375906ADFD34D93236084F462BB2dB0D92129Fe1","0xfE2bf40f2A9183774BF8E871d634A4E50255158B","0x64379Dee676ab442B48925Ed603771f386510Ee7","0x290Aa3E7533c873B3326DabFe7579e86ed951428","0x4d9A23BD4DBBdC04A88B99d8d2ac450EB6b8f49C","0x79D3Bb67EA7aB77E015af3dA885E8ed9C48a9fCe"]
      values.getThreshold:
-        4
      values.$members:
+        ["0x375906ADFD34D93236084F462BB2dB0D92129Fe1","0xfE2bf40f2A9183774BF8E871d634A4E50255158B","0x64379Dee676ab442B48925Ed603771f386510Ee7","0x290Aa3E7533c873B3326DabFe7579e86ed951428","0x4d9A23BD4DBBdC04A88B99d8d2ac450EB6b8f49C","0x79D3Bb67EA7aB77E015af3dA885E8ed9C48a9fCe"]
      values.$threshold:
+        4
      values.multisigThreshold:
+        "4 of 6 (67%)"
    }
```

```diff
    contract BatchPosterManagerMultisig (0xd0FDA6925f502a3a94986dfe7C92FE19EBbD679B) {
    +++ description: None
      values.$multisigThreshold:
-        "4 of 6 (67%)"
      values.getOwners:
-        ["0x375906ADFD34D93236084F462BB2dB0D92129Fe1","0xfE2bf40f2A9183774BF8E871d634A4E50255158B","0x64379Dee676ab442B48925Ed603771f386510Ee7","0x290Aa3E7533c873B3326DabFe7579e86ed951428","0x4d9A23BD4DBBdC04A88B99d8d2ac450EB6b8f49C","0x79D3Bb67EA7aB77E015af3dA885E8ed9C48a9fCe"]
      values.getThreshold:
-        4
      values.$members:
+        ["0x375906ADFD34D93236084F462BB2dB0D92129Fe1","0xfE2bf40f2A9183774BF8E871d634A4E50255158B","0x64379Dee676ab442B48925Ed603771f386510Ee7","0x290Aa3E7533c873B3326DabFe7579e86ed951428","0x4d9A23BD4DBBdC04A88B99d8d2ac450EB6b8f49C","0x79D3Bb67EA7aB77E015af3dA885E8ed9C48a9fCe"]
      values.$threshold:
+        4
      values.multisigThreshold:
+        "4 of 6 (67%)"
    }
```

```diff
    contract ProxyAdmin (0xE4d0Ba69d082Fdf6f51b8fc8F92c19bF00B1a1B4) {
    +++ description: None
      assignedPermissions.admin:
-        ["0xE27d4Ed355e5273A3D4855c8e11BC4a8d3e39b87"]
      assignedPermissions.upgrade:
+        ["0xE27d4Ed355e5273A3D4855c8e11BC4a8d3e39b87"]
    }
```

```diff
    contract SecurityCouncil (0xF06E95eF589D9c38af242a8AAee8375f14023F85) {
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
    contract ProxyAdmin (0xF32e5B5Ad94c0c0F83E0023b0AC48A93A8a2a428) {
    +++ description: None
      assignedPermissions.admin:
-        ["0x57004b440Cc4eb2FEd8c4d1865FaC907F9150C76"]
      assignedPermissions.upgrade:
+        ["0x57004b440Cc4eb2FEd8c4d1865FaC907F9150C76"]
    }
```

Generated with discovered.json: 0x91c3df0b3713b5068c31ace1f2c7c86c9d7c612b

# Diff at Tue, 30 Jul 2024 11:13:06 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@b2b6471ff62871f4956541f42ec025c356c08f7e block: 20406615
- current block number: 20406615

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20406615 (main branch discovery), not current.

```diff
    contract RollupProxy (0xFb209827c58283535b744575e11953DCC4bEAD88) {
    +++ description: Manages rollup components, list of Stakers and Validators. Entry point for Validators creating new Rollup Nodes (state commits) and Challengers submitting fraud proofs.
      fieldMeta:
+        {"confirmPeriodBlocks":{"description":"Challenge period. (Number of blocks until a node is confirmed)."},"wasmModuleRoot":{"description":"Root hash of the WASM module used for execution, like a fingerprint of the L2 logic. Can be associated with ArbOS versions."}}
    }
```

Generated with discovered.json: 0xf44d03c7115a41e7b70885b746bb3fa529a6b6cd

# Diff at Sun, 28 Jul 2024 17:43:23 GMT:

- author: sekuba (<sekuba@users.noreply.github.com>)
- comparing to: main@04dc4c7d175d5f4d1388774094bdb962fe7b7423 block: 20377214
- current block number: 20406615

## Description

1) SecurityCouncil signer rotation completed.
2) Changed naming to be consistent with the diagram.

## Watched changes

```diff
    contract SecurityCouncil (0xF06E95eF589D9c38af242a8AAee8375f14023F85) {
    +++ description: None
      values.getOwners.3:
-        "0xe40D80Bd58CEE55DCC2598724d7F1e03E206581D"
+        "0x5DD2205C3aac13E592F0a3D85188c948D1781df1"
      values.getOwners.2:
-        "0xB3b60932E598fe946169EC209A197184Bad760B7"
+        "0x5a09A94eE8198D3c474d723337aa58023810022C"
      values.getOwners.1:
-        "0xee7Fb91D5b776C326a728dc70e917F82d6809E3C"
+        "0xA821c8c245d1F3A257e3B0DEC99268cA05144422"
      values.getOwners.0:
-        "0xa0683d725420e2F75415806352Cd9c3fE10Fa960"
+        "0x70C006fC86A392c16D7E085cefc0Ad1FF7de6C75"
    }
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20377214 (main branch discovery), not current.

```diff
    contract L1ArbitrumTimelock (0xE6841D92B0C345144506576eC13ECf5103aC7f49) {
    +++ description: None
      name:
-        "L1ArbitrumTimelock"
+        "L1Timelock"
    }
```

Generated with discovered.json: 0x2d8674eaceb027327df8573b1d851f63d76771f7

# Diff at Tue, 21 May 2024 06:35:33 GMT:

- author: sekuba (<sekuba@users.noreply.github.com>)
- comparing to: main@fb4c64221d00d53ed6ec1609ef10dc99f1842087 block: 19883604
- current block number: 19916529

## Description

Scheduled transactions for the new SecurityCouncil cohort are executed.

## Watched changes

```diff
    contract SecurityCouncil (0xF06E95eF589D9c38af242a8AAee8375f14023F85) {
    +++ description: None
      values.getOwners.10:
-        "0xf6B6F07862A02C85628B3A9688beae07fEA9C863"
+        "0x0275b3D54a5dDbf8205A75984796eFE8b7357Bae"
      values.getOwners.9:
-        "0x5A1FD562271aAC2Dadb51BAAb7760b949D9D81dF"
+        "0xf8e1492255d9428c2Fc20A98A1DeB1215C8ffEfd"
      values.getOwners.8:
-        "0x0275b3D54a5dDbf8205A75984796eFE8b7357Bae"
+        "0x3Bd8e2AC65ad6f0F094BA6766cBd9484AB49eF23"
      values.getOwners.7:
-        "0x5280406912EB8Ec677Df66C326BE48f938DC2e44"
+        "0xb07dc9103328A51128bC6Cc1049d1137035f5E28"
      values.getOwners.6:
-        "0x566a07C3c932aE6AF74d77c29e5c30D8B1853710"
+        "0x3E286452b1C66abB08Eb5494c3894F40aB5a59AF"
      values.getOwners.5:
-        "0xf8e1492255d9428c2Fc20A98A1DeB1215C8ffEfd"
+        "0xb71ca4FFbB7b58d75Ba29891ab45e9Dc12B444Ed"
      values.getOwners.4:
-        "0x3Bd8e2AC65ad6f0F094BA6766cBd9484AB49eF23"
+        "0x8F10e3413586c4a8DCfcE19D009872b19e9cd8E3"
      values.getOwners.3:
-        "0xb07dc9103328A51128bC6Cc1049d1137035f5E28"
+        "0xe40D80Bd58CEE55DCC2598724d7F1e03E206581D"
      values.getOwners.2:
-        "0x3E286452b1C66abB08Eb5494c3894F40aB5a59AF"
+        "0xB3b60932E598fe946169EC209A197184Bad760B7"
      values.getOwners.1:
-        "0xb71ca4FFbB7b58d75Ba29891ab45e9Dc12B444Ed"
+        "0xee7Fb91D5b776C326a728dc70e917F82d6809E3C"
      values.getOwners.0:
-        "0x8F10e3413586c4a8DCfcE19D009872b19e9cd8E3"
+        "0xa0683d725420e2F75415806352Cd9c3fE10Fa960"
    }
```

Generated with discovered.json: 0x14d481f36a76e3853d048fce96b26891fb8f5ce4

# Diff at Wed, 15 May 2024 12:20:50 GMT:

- author: sekuba (<sekuba@users.noreply.github.com>)
- comparing to: main@2a68252776877f0b82e9f7cf6261b744952be771 block: 19532012
- current block number: 19875341

## Description

Config related: Renamed two contracts to make them more descriptive.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19532012 (main branch discovery), not current.

```diff
    contract ProxyAdmin 1 (0x71D78dC7cCC0e037e12de1E50f5470903ce37148) {
    +++ description: None
      name:
-        "ProxyAdmin 1"
+        "ProxyAdmin"
    }
```

```diff
    contract GnosisSafe (0xF06E95eF589D9c38af242a8AAee8375f14023F85) {
    +++ description: None
      name:
-        "GnosisSafe"
+        "SecurityCouncil"
    }
```

Generated with discovered.json: 0xf7fb7f83bf7de129d4215d9d4d56037bafd44bf7

# Diff at Thu, 28 Mar 2024 10:28:23 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@dd32bb06b292cc8459fb09925454ee3a90f5c27e block: 19488869
- current block number: 19532012

## Description

Update discovery to include the multisig threshold.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19488869 (main branch discovery), not current.

```diff
    contract ValidatorOwnerMultisig (0xC234E41AE2cb00311956Aa7109fC801ae8c80941) {
    +++ description: None
      upgradeability.threshold:
+        "4 of 6 (67%)"
    }
```

```diff
    contract BatchPosterManagerMultisig (0xd0FDA6925f502a3a94986dfe7C92FE19EBbD679B) {
    +++ description: None
      upgradeability.threshold:
+        "4 of 6 (67%)"
    }
```

```diff
    contract GnosisSafe (0xF06E95eF589D9c38af242a8AAee8375f14023F85) {
    +++ description: None
      upgradeability.threshold:
+        "9 of 12 (75%)"
    }
```

Generated with discovered.json: 0xdab66b0648ddfea385056c8353105da61cbb132b

# Diff at Fri, 22 Mar 2024 08:07:54 GMT:

- author: vincfurc (<10850139+vincfurc@users.noreply.github.com>)
- comparing to: main@173befb1ef4ba15605c92f5f89227f2ffd2af3eb block: 19390070
- current block number: 19488869

## Description

- added a batchPosterManager multisig. It can update whether an address is authorized to be a batch poster at the sequencer inbox. The DAO still has the same ability to revoke the Sequencer role; i.e., the DAO could update the batch poster manager (along with any batch posters).
- changed SequencerInbox implementation - added flag readers. The data posted has initial bytes used as certificate for certain flags, such as to show the data has used a certain merkelization strategy, or compression scheme: https://github.com/OffchainLabs/nitro/blob/69de0603abf6f900a4128cab7933df60cad54ded/arbstate/das_reader.go
- added check if sequencerInbox is deployed on an Arbitrum chain (for L3s?). If data is posted with eip4844 format, since EIP 4844 is not supported on Arbitrum chains, it will revert.
- set the batch poster manager multisig that can rotate batcher keys.

## Watched changes

```diff
-   Status: DELETED
    contract OneStepProverMath (0x1efb116EBC38CE895Eb2E5e009234E0E0836f2F5)
    +++ description: None
```

```diff
    contract SequencerInbox (0x211E1c4c7f1bF5351Ac850Ed10FD68CFfCF6c21b) {
    +++ description: None
      upgradeability.implementation:
-        "0xD03bFe2CE83632F4E618a97299cc91B1335BB2d9"
+        "0x31DA64D19Cd31A19CD09F4070366Fe2144792cf7"
      implementations.0:
-        "0xD03bFe2CE83632F4E618a97299cc91B1335BB2d9"
+        "0x31DA64D19Cd31A19CD09F4070366Fe2144792cf7"
      values.maxTimeVariation.3:
-        3600
+        768
      values.maxTimeVariation.1:
-        12
+        64
      values.batchPosterManager:
+        "0xd0FDA6925f502a3a94986dfe7C92FE19EBbD679B"
      values.BROTLI_MESSAGE_HEADER_FLAG:
+        "0x00"
      values.DAS_MESSAGE_HEADER_FLAG:
+        "0x80"
      values.DATA_BLOB_HEADER_FLAG:
+        "0x50"
      values.isUsingFeeToken:
+        false
      values.maxDataSize:
+        117964
      values.reader4844:
+        "0xb5f6951AB2504442c3F6dD37fF1E1D1d253C5097"
      values.TREE_DAS_MESSAGE_HEADER_FLAG:
+        "0x08"
      values.ZERO_HEAVY_MESSAGE_HEADER_FLAG:
+        "0x20"
    }
```

```diff
-   Status: DELETED
    contract OneStepProverMemory (0x7a6C0503107858f82a790E481024134092e19979)
    +++ description: None
```

```diff
-   Status: DELETED
    contract OneStepProofEntry (0x7AdcA86896c4220f19B2f7f9746e7A99E57B0Fc5)
    +++ description: None
```

```diff
-   Status: DELETED
    contract OneStepProver0 (0x8323B58C522690E6aFae94044825F0c79A93d236)
    +++ description: None
```

```diff
-   Status: DELETED
    contract OneStepProverHostIo (0x9CBC3F14a57CE6eAD0e770F528E2f1E8b8C37613)
    +++ description: None
```

```diff
    contract ChallengeManager (0xA59075221b50C598aED0Eae0bB9869639513af0D) {
    +++ description: None
      upgradeability.implementation:
-        "0x7a18bB9DbAF1202F3fc977e42E3C360d522e4566"
+        "0xE129b8Aa61dF65cBDbAE4345eE3fb40168DfD566"
      implementations.0:
-        "0x7a18bB9DbAF1202F3fc977e42E3C360d522e4566"
+        "0xE129b8Aa61dF65cBDbAE4345eE3fb40168DfD566"
      values.osp:
-        "0x7AdcA86896c4220f19B2f7f9746e7A99E57B0Fc5"
+        "0xC6E1E6dB03c3F475bC760FE20ed93401EC5c4F7e"
    }
```

```diff
    contract RollupProxy (0xFb209827c58283535b744575e11953DCC4bEAD88) {
    +++ description: None
      values.wasmModuleRoot:
-        "0xf4389b835497a910d7ba3ebfb77aa93da985634f3c052de1290360635be40c4a"
+        "0x8b104a2e80ac6165dc58b9048de12f301d70b02a0ab51396c22b4b4b802a16a4"
    }
```

```diff
+   Status: CREATED
    contract OneStepProverMath (0x221CCc45985Fdd24e33c3f19c6b7D48C02d5DCAa)
    +++ description: None
```

```diff
+   Status: CREATED
    contract OneStepProver0 (0xA174e12Ff8C6b18B37fecA77d6d350D89379A58C)
    +++ description: None
```

```diff
+   Status: CREATED
    contract  (0xb5f6951AB2504442c3F6dD37fF1E1D1d253C5097)
    +++ description: None
```

```diff
+   Status: CREATED
    contract OneStepProverMemory (0xb602D056BD6BA78c3A320660d1a45D1cc8bbD3ED)
    +++ description: None
```

```diff
+   Status: CREATED
    contract OneStepProofEntry (0xC6E1E6dB03c3F475bC760FE20ed93401EC5c4F7e)
    +++ description: None
```

```diff
+   Status: CREATED
    contract BatchPosterManagerMultisig (0xd0FDA6925f502a3a94986dfe7C92FE19EBbD679B)
    +++ description: None
```

```diff
+   Status: CREATED
    contract OneStepProverHostIo (0xd7f12E7418B007Ad7A5c7ACBbF460D3Cfe92A63e)
    +++ description: None
```

## Source code changes

```diff
.../implementation/contracts/GnosisSafe.sol        | 422 +++++++++++++++
 .../implementation/contracts/base/Executor.sol     |  27 +
 .../contracts/base/FallbackManager.sol             |  53 ++
 .../implementation/contracts/base/GuardManager.sol |  50 ++
 .../contracts/base/ModuleManager.sol               | 133 +++++
 .../implementation/contracts/base/OwnerManager.sol | 149 ++++++
 .../implementation/contracts/common/Enum.sol       |   8 +
 .../contracts/common/EtherPaymentFallback.sol      |  13 +
 .../contracts/common/SecuredTokenTransfer.sol      |  35 ++
 .../contracts/common/SelfAuthorized.sol            |  16 +
 .../contracts/common/SignatureDecoder.sol          |  36 ++
 .../implementation/contracts/common/Singleton.sol  |  11 +
 .../contracts/common/StorageAccessible.sol         |  47 ++
 .../contracts/external/GnosisSafeMath.sol          |  54 ++
 .../contracts/interfaces/ISignatureValidator.sol   |  20 +
 .../implementation/meta.txt                        |   2 +
 .../proxy/GnosisSafeProxy.sol                      | 155 ++++++
 .../BatchPosterManagerMultisig/proxy/meta.txt      |   2 +
 .../ChallengeManager/implementation/meta.txt       |   2 +-
 .../implementation/src/bridge/IBridge.sol          | 124 +++--
 .../src/bridge/IDelayedMessageProvider.sol         |   5 +-
 .../implementation/src/bridge/IOwnable.sol         |   5 +-
 .../implementation/src/bridge/ISequencerInbox.sol  | 215 ++++++--
 .../implementation/src/challenge/ChallengeLib.sol  |   2 +-
 .../src/challenge/ChallengeManager.sol             |  19 +-
 .../src/challenge/IChallengeManager.sol            |   4 +-
 .../src/challenge/IChallengeResultReceiver.sol     |   2 +-
 .../implementation/src/libraries/Constants.sol     |   8 +-
 .../src/libraries/DelegateCallAware.sol            |   2 +-
 .../implementation/src/libraries/Error.sol         | 167 +++++-
 .../implementation/src/libraries/IGasRefunder.sol  |  26 +-
 .../implementation/src/osp/IOneStepProofEntry.sol  |   2 +-
 .../implementation/src/osp/IOneStepProver.sol      |   3 +-
 .../src/state/Deserialize.sol => /dev/null         | 302 -----------
 .../implementation/src/state/GlobalState.sol       |   9 +-
 .../implementation/src/state/Instructions.sol      |   2 +-
 .../implementation/src/state/Machine.sol           |   2 +-
 .../src/state/MerkleProof.sol => /dev/null         |  99 ----
 .../implementation/src/state/Module.sol            |   6 +-
 .../src/state/ModuleMemory.sol => /dev/null        |  43 --
 .../src/state/ModuleMemoryCompact.sol              |  17 +
 .../implementation/src/state/StackFrame.sol        |   2 +-
 .../implementation/src/state/Value.sol             |   2 +-
 .../implementation/src/state/ValueArray.sol        |   2 +-
 .../implementation/src/state/ValueStack.sol        |   2 +-
 .../OneStepProofEntry/meta.txt                     |   2 +-
 .../OneStepProofEntry/src/bridge/IBridge.sol       | 124 +++--
 .../src/bridge/IDelayedMessageProvider.sol         |   5 +-
 .../OneStepProofEntry/src/bridge/IOwnable.sol      |   5 +-
 .../src/bridge/ISequencerInbox.sol                 | 215 ++++++--
 .../src/libraries/Error.sol => /dev/null           |  44 --
 .../src/libraries/IGasRefunder.sol                 |  26 +-
 .../src/osp/IOneStepProofEntry.sol                 |   2 +-
 .../OneStepProofEntry/src/osp/IOneStepProver.sol   |   3 +-
 .../src/osp/OneStepProofEntry.sol                  |   2 +-
 .../OneStepProofEntry/src/state/Deserialize.sol    |   4 +-
 .../OneStepProofEntry/src/state/GlobalState.sol    |   9 +-
 .../OneStepProofEntry/src/state/Instructions.sol   |   2 +-
 .../OneStepProofEntry/src/state/Machine.sol        |   2 +-
 .../OneStepProofEntry/src/state/MerkleProof.sol    |   2 +-
 .../OneStepProofEntry/src/state/Module.sol         |   6 +-
 .../src/state/ModuleMemory.sol => /dev/null        |  43 --
 .../src/state/ModuleMemoryCompact.sol              |  17 +
 .../OneStepProofEntry/src/state/StackFrame.sol     |   2 +-
 .../OneStepProofEntry/src/state/Value.sol          |   2 +-
 .../OneStepProofEntry/src/state/ValueArray.sol     |   2 +-
 .../OneStepProofEntry/src/state/ValueStack.sol     |   2 +-
 .../OneStepProver0/meta.txt                        |   2 +-
 .../OneStepProver0/src/bridge/IBridge.sol          | 124 +++--
 .../src/bridge/IDelayedMessageProvider.sol         |   5 +-
 .../OneStepProver0/src/bridge/IOwnable.sol         |   5 +-
 .../OneStepProver0/src/bridge/ISequencerInbox.sol  | 215 ++++++--
 .../src/libraries/Error.sol => /dev/null           |  44 --
 .../OneStepProver0/src/libraries/IGasRefunder.sol  |  26 +-
 .../OneStepProver0/src/osp/IOneStepProver.sol      |   3 +-
 .../OneStepProver0/src/osp/OneStepProver0.sol      |   2 +-
 .../OneStepProver0/src/state/Deserialize.sol       |   4 +-
 .../OneStepProver0/src/state/GlobalState.sol       |   9 +-
 .../OneStepProver0/src/state/Instructions.sol      |   2 +-
 .../OneStepProver0/src/state/Machine.sol           |   2 +-
 .../OneStepProver0/src/state/MerkleProof.sol       |   2 +-
 .../OneStepProver0/src/state/Module.sol            |   6 +-
 .../src/state/ModuleMemory.sol => /dev/null        |  43 --
 .../src/state/ModuleMemoryCompact.sol              |  17 +
 .../OneStepProver0/src/state/StackFrame.sol        |   2 +-
 .../OneStepProver0/src/state/Value.sol             |   2 +-
 .../OneStepProver0/src/state/ValueArray.sol        |   2 +-
 .../OneStepProver0/src/state/ValueStack.sol        |   2 +-
 .../OneStepProverHostIo/meta.txt                   |   2 +-
 .../OneStepProverHostIo/src/bridge/IBridge.sol     | 124 +++--
 .../src/bridge/IDelayedMessageProvider.sol         |   5 +-
 .../OneStepProverHostIo/src/bridge/IOwnable.sol    |   5 +-
 .../src/bridge/ISequencerInbox.sol                 | 215 ++++++--
 .../OneStepProverHostIo/src/bridge/Messages.sol    |   2 +-
 .../src/libraries/Error.sol => /dev/null           |  44 --
 .../src/libraries/IGasRefunder.sol                 |  26 +-
 .../OneStepProverHostIo/src/osp/IOneStepProver.sol |   3 +-
 .../src/osp/OneStepProverHostIo.sol                | 110 +++-
 .../OneStepProverHostIo/src/state/Deserialize.sol  |   4 +-
 .../OneStepProverHostIo/src/state/GlobalState.sol  |   9 +-
 .../OneStepProverHostIo/src/state/Instructions.sol |   2 +-
 .../OneStepProverHostIo/src/state/Machine.sol      |   2 +-
 .../OneStepProverHostIo/src/state/MerkleProof.sol  |   2 +-
 .../OneStepProverHostIo/src/state/Module.sol       |   6 +-
 .../OneStepProverHostIo/src/state/ModuleMemory.sol |  11 +-
 .../src/state/ModuleMemoryCompact.sol              |  17 +
 .../OneStepProverHostIo/src/state/StackFrame.sol   |   2 +-
 .../OneStepProverHostIo/src/state/Value.sol        |   2 +-
 .../OneStepProverHostIo/src/state/ValueArray.sol   |   2 +-
 .../OneStepProverHostIo/src/state/ValueStack.sol   |   2 +-
 .../OneStepProverMath/meta.txt                     |   2 +-
 .../OneStepProverMath/src/bridge/IBridge.sol       | 124 +++--
 .../src/bridge/IDelayedMessageProvider.sol         |   5 +-
 .../OneStepProverMath/src/bridge/IOwnable.sol      |   5 +-
 .../src/bridge/ISequencerInbox.sol                 | 215 ++++++--
 .../src/libraries/Error.sol => /dev/null           |  44 --
 .../src/libraries/IGasRefunder.sol                 |  26 +-
 .../OneStepProverMath/src/osp/IOneStepProver.sol   |   3 +-
 .../src/osp/OneStepProverMath.sol                  |   2 +-
 .../OneStepProverMath/src/state/Deserialize.sol    |   4 +-
 .../OneStepProverMath/src/state/GlobalState.sol    |   9 +-
 .../OneStepProverMath/src/state/Instructions.sol   |   2 +-
 .../OneStepProverMath/src/state/Machine.sol        |   2 +-
 .../OneStepProverMath/src/state/MerkleProof.sol    |   2 +-
 .../OneStepProverMath/src/state/Module.sol         |   6 +-
 .../src/state/ModuleMemory.sol => /dev/null        |  43 --
 .../src/state/ModuleMemoryCompact.sol              |  17 +
 .../OneStepProverMath/src/state/StackFrame.sol     |   2 +-
 .../OneStepProverMath/src/state/Value.sol          |   2 +-
 .../OneStepProverMath/src/state/ValueArray.sol     |   2 +-
 .../OneStepProverMath/src/state/ValueStack.sol     |   2 +-
 .../OneStepProverMemory/meta.txt                   |   2 +-
 .../OneStepProverMemory/src/bridge/IBridge.sol     | 124 +++--
 .../src/bridge/IDelayedMessageProvider.sol         |   5 +-
 .../OneStepProverMemory/src/bridge/IOwnable.sol    |   5 +-
 .../src/bridge/ISequencerInbox.sol                 | 215 ++++++--
 .../src/libraries/Error.sol => /dev/null           |  44 --
 .../src/libraries/IGasRefunder.sol                 |  26 +-
 .../OneStepProverMemory/src/osp/IOneStepProver.sol |   3 +-
 .../src/osp/OneStepProverMemory.sol                |   3 +-
 .../OneStepProverMemory/src/state/Deserialize.sol  |   4 +-
 .../OneStepProverMemory/src/state/GlobalState.sol  |   9 +-
 .../OneStepProverMemory/src/state/Instructions.sol |   2 +-
 .../OneStepProverMemory/src/state/Machine.sol      |   2 +-
 .../OneStepProverMemory/src/state/MerkleProof.sol  |   2 +-
 .../OneStepProverMemory/src/state/Module.sol       |   6 +-
 .../OneStepProverMemory/src/state/ModuleMemory.sol |  11 +-
 .../src/state/ModuleMemoryCompact.sol              |  17 +
 .../OneStepProverMemory/src/state/StackFrame.sol   |   2 +-
 .../OneStepProverMemory/src/state/Value.sol        |   2 +-
 .../OneStepProverMemory/src/state/ValueArray.sol   |   2 +-
 .../OneStepProverMemory/src/state/ValueStack.sol   |   2 +-
 .../SequencerInbox/implementation/meta.txt         |   2 +-
 .../implementation/src/bridge/IBridge.sol          |  41 +-
 .../src/bridge/IDelayedMessageProvider.sol         |   2 +-
 .../implementation/src/bridge/IERC20Bridge.sol     |  37 ++
 .../src/bridge/IInbox.sol => /dev/null             | 193 -------
 .../implementation/src/bridge/IInboxBase.sol       |  86 +++
 .../implementation/src/bridge/IOutbox.sol          |  12 +-
 .../implementation/src/bridge/IOwnable.sol         |   2 +-
 .../implementation/src/bridge/ISequencerInbox.sol  | 117 ++++-
 .../implementation/src/bridge/Messages.sol         |   2 +-
 .../implementation/src/bridge/SequencerInbox.sol   | 582 ++++++++++++++++-----
 .../implementation/src/challenge/ChallengeLib.sol  |   2 +-
 .../src/challenge/IChallengeManager.sol            |   2 +-
 .../src/challenge/IChallengeResultReceiver.sol     |   2 +-
 .../src/libraries/ArbitrumChecker.sol              |  16 +
 .../src/libraries/Constants.sol => /dev/null       |  13 -
 .../src/libraries/DelegateCallAware.sol            |   2 +-
 .../implementation/src/libraries/Error.sol         |  51 +-
 .../src/libraries/GasRefundEnabled.sol             |  52 ++
 .../implementation/src/libraries/IGasRefunder.sol  |  30 +-
 .../implementation/src/libraries/IReader4844.sol   |  13 +
 .../implementation/src/libraries/MessageTypes.sol  |   2 +-
 .../implementation/src/osp/IOneStepProofEntry.sol  |   2 +-
 .../implementation/src/osp/IOneStepProver.sol      |   3 +-
 .../implementation/src/precompiles/ArbGasInfo.sol  | 152 ++++++
 .../implementation/src/precompiles/ArbSys.sol      | 152 ++++++
 .../implementation/src/rollup/IRollupCore.sol      |  19 +-
 .../src/rollup/IRollupEventInbox.sol               |   6 +-
 .../implementation/src/rollup/IRollupLogic.sol     | 136 +----
 .../implementation/src/rollup/Node.sol             |  16 +-
 .../src/rollup/RollupLib.sol => /dev/null          | 151 ------
 .../src/state/Deserialize.sol => /dev/null         | 302 -----------
 .../implementation/src/state/GlobalState.sol       |   2 +-
 .../implementation/src/state/Instructions.sol      |   2 +-
 .../implementation/src/state/Machine.sol           |   2 +-
 .../src/state/MerkleProof.sol => /dev/null         |  99 ----
 .../implementation/src/state/Module.sol            |   6 +-
 .../src/state/ModuleMemory.sol => /dev/null        |  43 --
 .../src/state/ModuleMemoryCompact.sol              |  17 +
 .../implementation/src/state/StackFrame.sol        |   2 +-
 .../implementation/src/state/Value.sol             |   2 +-
 .../implementation/src/state/ValueArray.sol        |   2 +-
 .../implementation/src/state/ValueStack.sol        |   2 +-
 .../null => discovery/nova/ethereum/.code/meta.txt |   2 +
 196 files changed, 4487 insertions(+), 2845 deletions(-)
```

Generated with discovered.json: 0xce1846ca8a71c542f62d345e25419cdb72e8f071

# Diff at Fri, 08 Mar 2024 11:12:54 GMT:

- author: torztomasz (<tomasz.torz@l2beat.com>)
- comparing to: main@f09f798ebd2ae57f4c76e08114d608edf0a51c7b block: 19132347
- current block number: 19390070

## Description

The ArbitrumDACKeysetHandler has been changed in a way to make values more readable. No values were changed inside smart contracts, only the handler.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19132347 (main branch discovery), not current.

```diff
    contract SequencerInbox (0x211E1c4c7f1bF5351Ac850Ed10FD68CFfCF6c21b) {
    +++ description: None
      values.dacKeyset.threshold:
-        2
      values.dacKeyset.keyCount:
-        6
      values.dacKeyset.requiredSignatures:
+        5
      values.dacKeyset.membersCount:
+        6
    }
```

Generated with discovered.json: 0x11137089528e466103478529e9825c95fb2f9c20

# Diff at Thu, 01 Feb 2024 08:18:12 GMT:

- author: Luca Donno (<donnoh99@gmail.com>)
- comparing to: main@74040c3a8f43c630b3d31cc8376e84f5f9acda5c block: 18564156
- current block number: 19132347

## Description

Add the SequencerInboxVersion handler. Updated OS version to ArbOS 11. Added other useful handlers.

## Watched changes

```diff
    contract SequencerInbox (0x211E1c4c7f1bF5351Ac850Ed10FD68CFfCF6c21b) {
      values.dacKeyset.keyCount:
-        8
+        6
      values.keySetUpdates:
-        10
+        11
    }
```

```diff
    contract ValidatorOwnerMultisig (0xC234E41AE2cb00311956Aa7109fC801ae8c80941) {
      values.getOwners.0:
-        "0x702105E66C468b5191553702cD6BF3D6Bbfa4C6b"
+        "0x375906ADFD34D93236084F462BB2dB0D92129Fe1"
    }
```

```diff
    contract RollupProxy (0xFb209827c58283535b744575e11953DCC4bEAD88) {
      values.wasmModuleRoot:
-        "0x6b94a7fc388fd8ef3def759297828dc311761e88d8179c7ee8d3887dc554f3c3"
+        "0xf4389b835497a910d7ba3ebfb77aa93da985634f3c052de1290360635be40c4a"
    }
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 18564156 (main branch discovery), not current.

```diff
    contract SequencerInbox (0x211E1c4c7f1bF5351Ac850Ed10FD68CFfCF6c21b) {
      values.batchPosters:
+        ["0x0C5911d57B24FCF1DC8B2608eFbAe57C7098E32D","0xC1b634853Cb333D3aD8663715b08f41A3Aec47cc"]
      values.dacKeyset:
+        {"threshold":2,"keyCount":8}
      values.keySetUpdates:
+        10
      values.sequencerVersion:
+        "0x88"
      derivedName:
+        "SequencerInbox"
    }
```

```diff
    contract ArbitrumProxy (0xFb209827c58283535b744575e11953DCC4bEAD88) {
      name:
-        "ArbitrumProxy"
+        "RollupProxy"
      values.challenges:
+        []
      values.setValidatorCount:
+        6
      values.validators:
+        ["0x0fF813f6BD577c3D1cDbE435baC0621BE6aE34B4","0x1732BE6738117e9d22A84181AF68C8d09Cd4FF23","0x24Ca61c31C7f9Af3ab104dB6B9A444F28e9071e3","0x3B0369CAD35d257793F51c28213a4Cf4001397AC","0x54c0D3d6C101580dB3be8763A2aE2c6bb9dc840c","0x57004b440Cc4eb2FEd8c4d1865FaC907F9150C76","0x610Aa279989F440820e14248BD3879B148717974","0x658e8123722462F888b6fa01a7dbcEFe1D6DD709","0xAB1A39332e934300eBCc57B5f95cA90631a347FF","0xB51EDdfc9A945e2B909905e4F242C4796Ac0C61d","0xDfB23DFE9De7dcC974467195C8B7D5cd21C9d7cB","0xE27d4Ed355e5273A3D4855c8e11BC4a8d3e39b87","0xdDf2F71Ab206C0138A8eceEb54386567D5abF01E"]
      derivedName:
+        "ArbitrumProxy"
    }
```

```diff
+   Status: CREATED
    contract ValidatorWallet (0x1732BE6738117e9d22A84181AF68C8d09Cd4FF23) {
    }
```

```diff
+   Status: CREATED
    contract ValidatorWallet (0x24Ca61c31C7f9Af3ab104dB6B9A444F28e9071e3) {
    }
```

```diff
+   Status: CREATED
    contract Validator (0x3B0369CAD35d257793F51c28213a4Cf4001397AC) {
    }
```

```diff
+   Status: CREATED
    contract ValidatorWallet (0x57004b440Cc4eb2FEd8c4d1865FaC907F9150C76) {
    }
```

```diff
+   Status: CREATED
    contract ValidatorWallet (0x658e8123722462F888b6fa01a7dbcEFe1D6DD709) {
    }
```

```diff
+   Status: CREATED
    contract ProxyAdmin (0x8f6b82D007C0Ff4fd85fE84a5BFa89C00A4e6d2B) {
    }
```

```diff
+   Status: CREATED
    contract ProxyAdmin (0xAd3a14Fc16751d9E7FCa2A99aF85bf4d135e878d) {
    }
```

```diff
+   Status: CREATED
    contract ProxyAdmin (0xb31407BCf91d54AbFC0B7ef61bFc71b8b71F0678) {
    }
```

```diff
+   Status: CREATED
    contract ProxyAdmin (0xb85e18C8F552c823CdA4DCd9056213bDc970f9AE) {
    }
```

```diff
+   Status: CREATED
    contract ValidatorOwnerMultisig (0xC234E41AE2cb00311956Aa7109fC801ae8c80941) {
    }
```

```diff
+   Status: CREATED
    contract ValidatorWallet (0xE27d4Ed355e5273A3D4855c8e11BC4a8d3e39b87) {
    }
```

```diff
+   Status: CREATED
    contract ProxyAdmin (0xE4d0Ba69d082Fdf6f51b8fc8F92c19bF00B1a1B4) {
    }
```

```diff
+   Status: CREATED
    contract ProxyAdmin (0xF32e5B5Ad94c0c0F83E0023b0AC48A93A8a2a428) {
    }
```

# Diff at Mon, 13 Nov 2023 16:26:39 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: master@a45348c9ae2e765b872be3f217168f73b62d35a6

## Description

Some of the Security Council members were replaced.

Names of the owners of the EOAs listed below were manually found on public Arbitrum forums,
so they may be incorrect.

Removed EOAs:

- 0x526C0DA9970E7331d171f86AeD28FAFB5D8A49EF (Mo Dong?)
- 0x0E5011001cF9c89b0259BC3B050785067495eBf5 (Diane Dai?)
- 0x8688515028955734350067695939423222009623 (Celeb Lau?)
- 0x88910996671162953E89DdcE5C8137f9077da217 (??)
- 0x8e6247239CBeB3Eaf9d9a691D01A67e2A9Fea3C5 (Bryan Pellegrino?)

Added EOAs:

- 0x8F10e3413586c4a8DCfcE19D009872b19e9cd8E3 (Patrick McCorry?)
- 0xb71ca4FFbB7b58d75Ba29891ab45e9Dc12B444Ed (0xhombre?)
- 0x3E286452b1C66abB08Eb5494c3894F40aB5a59AF (John Morrow?)
- 0xb07dc9103328A51128bC6Cc1049d1137035f5E28 (Omer Goldberg?)
- 0x3Bd8e2AC65ad6f0F094BA6766cBd9484AB49eF23 (Matt Fiebach?)

## Watched changes

```diff
    contract GnosisSafe (0xF06E95eF589D9c38af242a8AAee8375f14023F85) {
      values.getOwners.5:
-        "0x8e6247239CBeB3Eaf9d9a691D01A67e2A9Fea3C5"
+        "0xf8e1492255d9428c2Fc20A98A1DeB1215C8ffEfd"
      values.getOwners.4:
-        "0x88910996671162953E89DdcE5C8137f9077da217"
+        "0x3Bd8e2AC65ad6f0F094BA6766cBd9484AB49eF23"
      values.getOwners.3:
-        "0x8688515028955734350067695939423222009623"
+        "0xb07dc9103328A51128bC6Cc1049d1137035f5E28"
      values.getOwners.2:
-        "0x0E5011001cF9c89b0259BC3B050785067495eBf5"
+        "0x3E286452b1C66abB08Eb5494c3894F40aB5a59AF"
      values.getOwners.1:
-        "0xf8e1492255d9428c2Fc20A98A1DeB1215C8ffEfd"
+        "0xb71ca4FFbB7b58d75Ba29891ab45e9Dc12B444Ed"
      values.getOwners.0:
-        "0x526C0DA9970E7331d171f86AeD28FAFB5D8A49EF"
+        "0x8F10e3413586c4a8DCfcE19D009872b19e9cd8E3"
    }
```

# Diff at Fri, 22 Sep 2023 07:25:53 GMT:

- author: Luca Donno (<donnoh99@gmail.com>)
- comparing to: master@3a33c063dab8666dc32b4ec15a81995020325b49

## Watched changes

```diff
    contract L1ArbitrumTimelock (0xE6841D92B0C345144506576eC13ECf5103aC7f49) {
      upgradeability.implementation:
-        "0x962d70fc48F3465404bC77B03f104746B25a1d1b"
+        "0x61dC65001A8De4138DAD5167e43FF0FB0AB8D3B3"
    }
```
