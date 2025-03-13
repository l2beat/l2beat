Generated with discovered.json: 0x4e6f4753085b1c670a0bf84577515c07a1defe0c

# Diff at Wed, 12 Mar 2025 17:26:59 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@cb0d52d231353da1376fff224fb8499878921029 block: 21892618
- current block number: 22032270

## Description

rediscover to try fix inreview status.

## Watched changes

```diff
    contract SequencerInbox (0x1c479675ad559DC151F6Ec7ed3FbF8ceE79582B6) {
    +++ description: A sequencer (registered in this contract) can submit transaction batches or commitments here.
      values.postsBlobs:
-        true
+        false
    }
```

Generated with discovered.json: 0xf2981e85d59eacef4706cc48609f84a6d5118868

# Diff at Wed, 12 Mar 2025 16:12:48 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@83f499294acff3972f9246f27e07b7a531a5d4d2 block: 21892618
- current block number: 21892618

## Description

Discovery rerun on the same block number with only config-related changes.
Removed delay on Timelock's ADMIN interact permission.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21892618 (main branch discovery), not current.

```diff
    contract Outbox (0x0B9857ae2D4A3DBe74ffE1d7DF045bb7F96E4840) {
    +++ description: Facilitates L2 to L1 contract calls: Messages initiated from L2 (for example withdrawal messages) eventually resolve in execution on L1. Is also used to relay governance action messages from Arbitrum One to Ethereum, allowing the L2Timelock and its Governance actors on L2 to act as this address and inherit all its listed permissions.
      receivedPermissions.3.description:
-        "propose transactions."
+        "update the minimum delay and manage all access control roles of the timelock."
      receivedPermissions.3.via.2:
+        {"address":"0x8315177aB297bA92A06054cE80a67Ed4DBd7ed3a"}
      receivedPermissions.3.via.1:
+        {"address":"0xE6841D92B0C345144506576eC13ECf5103aC7f49","delay":259200}
      receivedPermissions.3.via.0.address:
-        "0x8315177aB297bA92A06054cE80a67Ed4DBd7ed3a"
+        "0x3ffFbAdAF827559da092217e474760E2b2c3CeDd"
      receivedPermissions.2.description:
-        "cancel queued transactions."
+        "propose transactions."
      receivedPermissions.2.via.2:
-        {"address":"0x8315177aB297bA92A06054cE80a67Ed4DBd7ed3a"}
      receivedPermissions.2.via.1:
-        {"address":"0xE6841D92B0C345144506576eC13ECf5103aC7f49","delay":259200}
      receivedPermissions.2.via.0.address:
-        "0x3ffFbAdAF827559da092217e474760E2b2c3CeDd"
+        "0x8315177aB297bA92A06054cE80a67Ed4DBd7ed3a"
      receivedPermissions.1.delay:
-        259200
      receivedPermissions.1.description:
-        "update the minimum delay and manage all access control roles of the timelock."
+        "cancel queued transactions."
    }
```

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
      issuedPermissions.2.via.2:
+        {"address":"0x3ffFbAdAF827559da092217e474760E2b2c3CeDd"}
      issuedPermissions.2.via.1:
+        {"address":"0xE6841D92B0C345144506576eC13ECf5103aC7f49","delay":259200}
      issuedPermissions.1.description:
-        "cancel queued transactions."
+        "propose transactions."
      issuedPermissions.1.via.2:
-        {"address":"0x3ffFbAdAF827559da092217e474760E2b2c3CeDd"}
      issuedPermissions.1.via.1:
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
      receivedPermissions.2.description:
-        "cancel queued transactions."
+        "update the minimum delay and manage all access control roles of the timelock."
      receivedPermissions.1.delay:
-        259200
      receivedPermissions.1.description:
-        "update the minimum delay and manage all access control roles of the timelock."
+        "cancel queued transactions."
    }
```

Generated with discovered.json: 0x3480e18612df53e760ea0d668dd67d5343120562

# Diff at Wed, 12 Mar 2025 15:36:00 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@b11c73a301a3caaf2488c0ab0cbbdc2e138d506a block: 21892618
- current block number: 21892618

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21892618 (main branch discovery), not current.

```diff
    contract Outbox (0x0B9857ae2D4A3DBe74ffE1d7DF045bb7F96E4840) {
    +++ description: Facilitates L2 to L1 contract calls: Messages initiated from L2 (for example withdrawal messages) eventually resolve in execution on L1. Is also used to relay governance action messages from Arbitrum One to Ethereum, allowing the L2Timelock and its Governance actors on L2 to act as this address and inherit all its listed permissions.
      receivedPermissions.17:
+        {"permission":"upgrade","from":"0xE6841D92B0C345144506576eC13ECf5103aC7f49","via":[{"address":"0x5613AF0474EB9c528A34701A5b1662E3C8FA0678"},{"address":"0x3ffFbAdAF827559da092217e474760E2b2c3CeDd"},{"address":"0xE6841D92B0C345144506576eC13ECf5103aC7f49","delay":259200},{"address":"0x8315177aB297bA92A06054cE80a67Ed4DBd7ed3a"}]}
      receivedPermissions.16.from:
-        "0xE6841D92B0C345144506576eC13ECf5103aC7f49"
+        "0xcEe284F754E854890e311e3280b767F80797180d"
      receivedPermissions.16.via.0.address:
-        "0x5613AF0474EB9c528A34701A5b1662E3C8FA0678"
+        "0x9aD46fac0Cf7f790E5be05A0F15223935A0c0aDa"
      receivedPermissions.15.from:
-        "0xcEe284F754E854890e311e3280b767F80797180d"
+        "0xA5565d266c3c3Ee90B16Be8A5b13d587ef559fB0"
      receivedPermissions.15.via.0.address:
-        "0x9aD46fac0Cf7f790E5be05A0F15223935A0c0aDa"
+        "0x554723262467F125Ac9e1cDFa9Ce15cc53822dbD"
      receivedPermissions.14.from:
-        "0xA5565d266c3c3Ee90B16Be8A5b13d587ef559fB0"
+        "0xa3A7B6F88361F48403514059F1F16C8E78d60EeC"
      receivedPermissions.14.via.0.address:
-        "0x554723262467F125Ac9e1cDFa9Ce15cc53822dbD"
+        "0x9aD46fac0Cf7f790E5be05A0F15223935A0c0aDa"
      receivedPermissions.13.from:
-        "0xa3A7B6F88361F48403514059F1F16C8E78d60EeC"
+        "0x8315177aB297bA92A06054cE80a67Ed4DBd7ed3a"
      receivedPermissions.13.via.0.address:
-        "0x9aD46fac0Cf7f790E5be05A0F15223935A0c0aDa"
+        "0x554723262467F125Ac9e1cDFa9Ce15cc53822dbD"
      receivedPermissions.12.from:
-        "0x8315177aB297bA92A06054cE80a67Ed4DBd7ed3a"
+        "0x760723CD2e632826c38Fef8CD438A4CC7E7E1A40"
      receivedPermissions.11.from:
-        "0x760723CD2e632826c38Fef8CD438A4CC7E7E1A40"
+        "0x72Ce9c846789fdB6fC1f34aC4AD25Dd9ef7031ef"
      receivedPermissions.11.via.0.address:
-        "0x554723262467F125Ac9e1cDFa9Ce15cc53822dbD"
+        "0x9aD46fac0Cf7f790E5be05A0F15223935A0c0aDa"
      receivedPermissions.10.from:
-        "0x72Ce9c846789fdB6fC1f34aC4AD25Dd9ef7031ef"
+        "0x667e23ABd27E623c11d4CC00ca3EC4d0bD63337a"
      receivedPermissions.10.via.0.address:
-        "0x9aD46fac0Cf7f790E5be05A0F15223935A0c0aDa"
+        "0x554723262467F125Ac9e1cDFa9Ce15cc53822dbD"
      receivedPermissions.9.from:
-        "0x667e23ABd27E623c11d4CC00ca3EC4d0bD63337a"
+        "0x57Bd336d579A51938619271a7Cc137a46D0501B1"
      receivedPermissions.8.from:
-        "0x57Bd336d579A51938619271a7Cc137a46D0501B1"
+        "0x4DCeB440657f21083db8aDd07665f8ddBe1DCfc0"
      receivedPermissions.8.via.3:
-        {"address":"0x8315177aB297bA92A06054cE80a67Ed4DBd7ed3a"}
      receivedPermissions.8.via.2.address:
-        "0xE6841D92B0C345144506576eC13ECf5103aC7f49"
+        "0x8315177aB297bA92A06054cE80a67Ed4DBd7ed3a"
      receivedPermissions.8.via.2.delay:
-        259200
      receivedPermissions.8.via.1.address:
-        "0x3ffFbAdAF827559da092217e474760E2b2c3CeDd"
+        "0xE6841D92B0C345144506576eC13ECf5103aC7f49"
      receivedPermissions.8.via.1.delay:
+        259200
      receivedPermissions.8.via.0.address:
-        "0x554723262467F125Ac9e1cDFa9Ce15cc53822dbD"
+        "0x3ffFbAdAF827559da092217e474760E2b2c3CeDd"
      receivedPermissions.7.from:
-        "0x4DCeB440657f21083db8aDd07665f8ddBe1DCfc0"
+        "0x4Dbd4fc535Ac27206064B68FfCf827b0A60BAB3f"
      receivedPermissions.7.via.3:
+        {"address":"0x8315177aB297bA92A06054cE80a67Ed4DBd7ed3a"}
      receivedPermissions.7.via.2.address:
-        "0x8315177aB297bA92A06054cE80a67Ed4DBd7ed3a"
+        "0xE6841D92B0C345144506576eC13ECf5103aC7f49"
      receivedPermissions.7.via.2.delay:
+        259200
      receivedPermissions.7.via.1.address:
-        "0xE6841D92B0C345144506576eC13ECf5103aC7f49"
+        "0x3ffFbAdAF827559da092217e474760E2b2c3CeDd"
      receivedPermissions.7.via.1.delay:
-        259200
      receivedPermissions.7.via.0.address:
-        "0x3ffFbAdAF827559da092217e474760E2b2c3CeDd"
+        "0x554723262467F125Ac9e1cDFa9Ce15cc53822dbD"
      receivedPermissions.6.from:
-        "0x4Dbd4fc535Ac27206064B68FfCf827b0A60BAB3f"
+        "0x3ffFbAdAF827559da092217e474760E2b2c3CeDd"
      receivedPermissions.6.via.0.address:
-        "0x554723262467F125Ac9e1cDFa9Ce15cc53822dbD"
+        "0x5613AF0474EB9c528A34701A5b1662E3C8FA0678"
      receivedPermissions.5.from:
-        "0x3ffFbAdAF827559da092217e474760E2b2c3CeDd"
+        "0x1c479675ad559DC151F6Ec7ed3FbF8ceE79582B6"
      receivedPermissions.5.via.0.address:
-        "0x5613AF0474EB9c528A34701A5b1662E3C8FA0678"
+        "0x554723262467F125Ac9e1cDFa9Ce15cc53822dbD"
      receivedPermissions.4.from:
-        "0x1c479675ad559DC151F6Ec7ed3FbF8ceE79582B6"
+        "0x0B9857ae2D4A3DBe74ffE1d7DF045bb7F96E4840"
      receivedPermissions.3.permission:
-        "upgrade"
+        "interact"
      receivedPermissions.3.from:
-        "0x0B9857ae2D4A3DBe74ffE1d7DF045bb7F96E4840"
+        "0xE6841D92B0C345144506576eC13ECf5103aC7f49"
      receivedPermissions.3.via.3:
-        {"address":"0x8315177aB297bA92A06054cE80a67Ed4DBd7ed3a"}
      receivedPermissions.3.via.2:
-        {"address":"0xE6841D92B0C345144506576eC13ECf5103aC7f49","delay":259200}
      receivedPermissions.3.via.1:
-        {"address":"0x3ffFbAdAF827559da092217e474760E2b2c3CeDd"}
      receivedPermissions.3.via.0.address:
-        "0x554723262467F125Ac9e1cDFa9Ce15cc53822dbD"
+        "0x8315177aB297bA92A06054cE80a67Ed4DBd7ed3a"
      receivedPermissions.3.description:
+        "propose transactions."
      receivedPermissions.2.description:
-        "propose transactions."
+        "cancel queued transactions."
      receivedPermissions.2.via.2:
+        {"address":"0x8315177aB297bA92A06054cE80a67Ed4DBd7ed3a"}
      receivedPermissions.2.via.1:
+        {"address":"0xE6841D92B0C345144506576eC13ECf5103aC7f49","delay":259200}
      receivedPermissions.2.via.0.address:
-        "0x8315177aB297bA92A06054cE80a67Ed4DBd7ed3a"
+        "0x3ffFbAdAF827559da092217e474760E2b2c3CeDd"
    }
```

```diff
    contract UpgradeExecutor (0x3ffFbAdAF827559da092217e474760E2b2c3CeDd) {
    +++ description: Central contract defining the access control permissions for upgrading the system contract implementations.
      directlyReceivedPermissions.6:
+        {"permission":"upgrade","from":"0x4DCeB440657f21083db8aDd07665f8ddBe1DCfc0"}
      directlyReceivedPermissions.5.permission:
-        "upgrade"
+        "interact"
      directlyReceivedPermissions.5.from:
-        "0x4DCeB440657f21083db8aDd07665f8ddBe1DCfc0"
+        "0xE6841D92B0C345144506576eC13ECf5103aC7f49"
      directlyReceivedPermissions.5.description:
+        "cancel queued transactions."
    }
```

```diff
    contract L1Timelock (0xE6841D92B0C345144506576eC13ECf5103aC7f49) {
    +++ description: A timelock with access control. The current minimum delay is 3d. Proposals that passed their minimum delay can be executed by the anyone.
      issuedPermissions.6:
+        {"permission":"upgrade","to":"0xF06E95eF589D9c38af242a8AAee8375f14023F85","via":[{"address":"0x3ffFbAdAF827559da092217e474760E2b2c3CeDd"},{"address":"0x5613AF0474EB9c528A34701A5b1662E3C8FA0678"}]}
      issuedPermissions.5:
+        {"permission":"upgrade","to":"0x0B9857ae2D4A3DBe74ffE1d7DF045bb7F96E4840","via":[{"address":"0x8315177aB297bA92A06054cE80a67Ed4DBd7ed3a"},{"address":"0xE6841D92B0C345144506576eC13ECf5103aC7f49","delay":259200},{"address":"0x3ffFbAdAF827559da092217e474760E2b2c3CeDd"},{"address":"0x5613AF0474EB9c528A34701A5b1662E3C8FA0678"}]}
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
-        "0x0B9857ae2D4A3DBe74ffE1d7DF045bb7F96E4840"
+        "0xF06E95eF589D9c38af242a8AAee8375f14023F85"
      issuedPermissions.3.via.3:
-        {"address":"0x5613AF0474EB9c528A34701A5b1662E3C8FA0678"}
      issuedPermissions.3.via.2:
-        {"address":"0x3ffFbAdAF827559da092217e474760E2b2c3CeDd"}
      issuedPermissions.3.via.1:
-        {"address":"0xE6841D92B0C345144506576eC13ECf5103aC7f49","delay":259200}
      issuedPermissions.3.via.0.address:
-        "0x8315177aB297bA92A06054cE80a67Ed4DBd7ed3a"
+        "0x3ffFbAdAF827559da092217e474760E2b2c3CeDd"
      issuedPermissions.3.delay:
+        259200
      issuedPermissions.3.description:
+        "update the minimum delay and manage all access control roles of the timelock."
      issuedPermissions.2.to:
-        "0xF06E95eF589D9c38af242a8AAee8375f14023F85"
+        "0x0B9857ae2D4A3DBe74ffE1d7DF045bb7F96E4840"
      issuedPermissions.2.delay:
-        259200
      issuedPermissions.2.description:
-        "update the minimum delay and manage all access control roles of the timelock."
+        "propose transactions."
      issuedPermissions.2.via.0.address:
-        "0x3ffFbAdAF827559da092217e474760E2b2c3CeDd"
+        "0x8315177aB297bA92A06054cE80a67Ed4DBd7ed3a"
      issuedPermissions.1.description:
-        "propose transactions."
+        "cancel queued transactions."
      issuedPermissions.1.via.2:
+        {"address":"0x3ffFbAdAF827559da092217e474760E2b2c3CeDd"}
      issuedPermissions.1.via.1:
+        {"address":"0xE6841D92B0C345144506576eC13ECf5103aC7f49","delay":259200}
    }
```

```diff
    contract SecurityCouncil (0xF06E95eF589D9c38af242a8AAee8375f14023F85) {
    +++ description: None
      receivedPermissions.16:
+        {"permission":"upgrade","from":"0xE6841D92B0C345144506576eC13ECf5103aC7f49","via":[{"address":"0x5613AF0474EB9c528A34701A5b1662E3C8FA0678"},{"address":"0x3ffFbAdAF827559da092217e474760E2b2c3CeDd"}]}
      receivedPermissions.15.from:
-        "0xE6841D92B0C345144506576eC13ECf5103aC7f49"
+        "0xcEe284F754E854890e311e3280b767F80797180d"
      receivedPermissions.15.via.0.address:
-        "0x5613AF0474EB9c528A34701A5b1662E3C8FA0678"
+        "0x9aD46fac0Cf7f790E5be05A0F15223935A0c0aDa"
      receivedPermissions.14.from:
-        "0xcEe284F754E854890e311e3280b767F80797180d"
+        "0xA5565d266c3c3Ee90B16Be8A5b13d587ef559fB0"
      receivedPermissions.14.via.0.address:
-        "0x9aD46fac0Cf7f790E5be05A0F15223935A0c0aDa"
+        "0x554723262467F125Ac9e1cDFa9Ce15cc53822dbD"
      receivedPermissions.13.from:
-        "0xA5565d266c3c3Ee90B16Be8A5b13d587ef559fB0"
+        "0xa3A7B6F88361F48403514059F1F16C8E78d60EeC"
      receivedPermissions.13.via.0.address:
-        "0x554723262467F125Ac9e1cDFa9Ce15cc53822dbD"
+        "0x9aD46fac0Cf7f790E5be05A0F15223935A0c0aDa"
      receivedPermissions.12.from:
-        "0xa3A7B6F88361F48403514059F1F16C8E78d60EeC"
+        "0x8315177aB297bA92A06054cE80a67Ed4DBd7ed3a"
      receivedPermissions.12.via.0.address:
-        "0x9aD46fac0Cf7f790E5be05A0F15223935A0c0aDa"
+        "0x554723262467F125Ac9e1cDFa9Ce15cc53822dbD"
      receivedPermissions.11.from:
-        "0x8315177aB297bA92A06054cE80a67Ed4DBd7ed3a"
+        "0x760723CD2e632826c38Fef8CD438A4CC7E7E1A40"
      receivedPermissions.10.from:
-        "0x760723CD2e632826c38Fef8CD438A4CC7E7E1A40"
+        "0x72Ce9c846789fdB6fC1f34aC4AD25Dd9ef7031ef"
      receivedPermissions.10.via.0.address:
-        "0x554723262467F125Ac9e1cDFa9Ce15cc53822dbD"
+        "0x9aD46fac0Cf7f790E5be05A0F15223935A0c0aDa"
      receivedPermissions.9.from:
-        "0x72Ce9c846789fdB6fC1f34aC4AD25Dd9ef7031ef"
+        "0x667e23ABd27E623c11d4CC00ca3EC4d0bD63337a"
      receivedPermissions.9.via.0.address:
-        "0x9aD46fac0Cf7f790E5be05A0F15223935A0c0aDa"
+        "0x554723262467F125Ac9e1cDFa9Ce15cc53822dbD"
      receivedPermissions.8.from:
-        "0x667e23ABd27E623c11d4CC00ca3EC4d0bD63337a"
+        "0x57Bd336d579A51938619271a7Cc137a46D0501B1"
      receivedPermissions.7.from:
-        "0x57Bd336d579A51938619271a7Cc137a46D0501B1"
+        "0x4DCeB440657f21083db8aDd07665f8ddBe1DCfc0"
      receivedPermissions.7.via.1:
-        {"address":"0x3ffFbAdAF827559da092217e474760E2b2c3CeDd"}
      receivedPermissions.7.via.0.address:
-        "0x554723262467F125Ac9e1cDFa9Ce15cc53822dbD"
+        "0x3ffFbAdAF827559da092217e474760E2b2c3CeDd"
      receivedPermissions.6.from:
-        "0x4DCeB440657f21083db8aDd07665f8ddBe1DCfc0"
+        "0x4Dbd4fc535Ac27206064B68FfCf827b0A60BAB3f"
      receivedPermissions.6.via.1:
+        {"address":"0x3ffFbAdAF827559da092217e474760E2b2c3CeDd"}
      receivedPermissions.6.via.0.address:
-        "0x3ffFbAdAF827559da092217e474760E2b2c3CeDd"
+        "0x554723262467F125Ac9e1cDFa9Ce15cc53822dbD"
      receivedPermissions.5.from:
-        "0x4Dbd4fc535Ac27206064B68FfCf827b0A60BAB3f"
+        "0x3ffFbAdAF827559da092217e474760E2b2c3CeDd"
      receivedPermissions.5.via.0.address:
-        "0x554723262467F125Ac9e1cDFa9Ce15cc53822dbD"
+        "0x5613AF0474EB9c528A34701A5b1662E3C8FA0678"
      receivedPermissions.4.from:
-        "0x3ffFbAdAF827559da092217e474760E2b2c3CeDd"
+        "0x1c479675ad559DC151F6Ec7ed3FbF8ceE79582B6"
      receivedPermissions.4.via.0.address:
-        "0x5613AF0474EB9c528A34701A5b1662E3C8FA0678"
+        "0x554723262467F125Ac9e1cDFa9Ce15cc53822dbD"
      receivedPermissions.3.from:
-        "0x1c479675ad559DC151F6Ec7ed3FbF8ceE79582B6"
+        "0x0B9857ae2D4A3DBe74ffE1d7DF045bb7F96E4840"
      receivedPermissions.2.permission:
-        "upgrade"
+        "interact"
      receivedPermissions.2.from:
-        "0x0B9857ae2D4A3DBe74ffE1d7DF045bb7F96E4840"
+        "0xE6841D92B0C345144506576eC13ECf5103aC7f49"
      receivedPermissions.2.via.1:
-        {"address":"0x3ffFbAdAF827559da092217e474760E2b2c3CeDd"}
      receivedPermissions.2.via.0.address:
-        "0x554723262467F125Ac9e1cDFa9Ce15cc53822dbD"
+        "0x3ffFbAdAF827559da092217e474760E2b2c3CeDd"
      receivedPermissions.2.description:
+        "cancel queued transactions."
    }
```

Generated with discovered.json: 0xcd985530eaa52a2fb8a6f16e6209f5bb13ea82c1

# Diff at Thu, 06 Mar 2025 15:18:06 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@64eed24a033030dd2d128180f3ee3f87c3c39f7c block: 21892618
- current block number: 21892618

## Description

config: updates timelock templates, added starknet proghashes to global config.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21892618 (main branch discovery), not current.

```diff
    contract Outbox (0x0B9857ae2D4A3DBe74ffE1d7DF045bb7F96E4840) {
    +++ description: Facilitates L2 to L1 contract calls: Messages initiated from L2 (for example withdrawal messages) eventually resolve in execution on L1. Is also used to relay governance action messages from Arbitrum One to Ethereum, allowing the L2Timelock and its Governance actors on L2 to act as this address and inherit all its listed permissions.
      receivedPermissions.17:
-        {"permission":"upgrade","from":"0xE6841D92B0C345144506576eC13ECf5103aC7f49","via":[{"address":"0x5613AF0474EB9c528A34701A5b1662E3C8FA0678"},{"address":"0x3ffFbAdAF827559da092217e474760E2b2c3CeDd"},{"address":"0xE6841D92B0C345144506576eC13ECf5103aC7f49","delay":259200},{"address":"0x8315177aB297bA92A06054cE80a67Ed4DBd7ed3a"}]}
      receivedPermissions.16.from:
-        "0xcEe284F754E854890e311e3280b767F80797180d"
+        "0xE6841D92B0C345144506576eC13ECf5103aC7f49"
      receivedPermissions.16.via.0.address:
-        "0x9aD46fac0Cf7f790E5be05A0F15223935A0c0aDa"
+        "0x5613AF0474EB9c528A34701A5b1662E3C8FA0678"
      receivedPermissions.15.from:
-        "0xA5565d266c3c3Ee90B16Be8A5b13d587ef559fB0"
+        "0xcEe284F754E854890e311e3280b767F80797180d"
      receivedPermissions.15.via.0.address:
-        "0x554723262467F125Ac9e1cDFa9Ce15cc53822dbD"
+        "0x9aD46fac0Cf7f790E5be05A0F15223935A0c0aDa"
      receivedPermissions.14.from:
-        "0xa3A7B6F88361F48403514059F1F16C8E78d60EeC"
+        "0xA5565d266c3c3Ee90B16Be8A5b13d587ef559fB0"
      receivedPermissions.14.via.0.address:
-        "0x9aD46fac0Cf7f790E5be05A0F15223935A0c0aDa"
+        "0x554723262467F125Ac9e1cDFa9Ce15cc53822dbD"
      receivedPermissions.13.from:
-        "0x8315177aB297bA92A06054cE80a67Ed4DBd7ed3a"
+        "0xa3A7B6F88361F48403514059F1F16C8E78d60EeC"
      receivedPermissions.13.via.0.address:
-        "0x554723262467F125Ac9e1cDFa9Ce15cc53822dbD"
+        "0x9aD46fac0Cf7f790E5be05A0F15223935A0c0aDa"
      receivedPermissions.12.from:
-        "0x760723CD2e632826c38Fef8CD438A4CC7E7E1A40"
+        "0x8315177aB297bA92A06054cE80a67Ed4DBd7ed3a"
      receivedPermissions.11.from:
-        "0x72Ce9c846789fdB6fC1f34aC4AD25Dd9ef7031ef"
+        "0x760723CD2e632826c38Fef8CD438A4CC7E7E1A40"
      receivedPermissions.11.via.0.address:
-        "0x9aD46fac0Cf7f790E5be05A0F15223935A0c0aDa"
+        "0x554723262467F125Ac9e1cDFa9Ce15cc53822dbD"
      receivedPermissions.10.from:
-        "0x667e23ABd27E623c11d4CC00ca3EC4d0bD63337a"
+        "0x72Ce9c846789fdB6fC1f34aC4AD25Dd9ef7031ef"
      receivedPermissions.10.via.0.address:
-        "0x554723262467F125Ac9e1cDFa9Ce15cc53822dbD"
+        "0x9aD46fac0Cf7f790E5be05A0F15223935A0c0aDa"
      receivedPermissions.9.from:
-        "0x57Bd336d579A51938619271a7Cc137a46D0501B1"
+        "0x667e23ABd27E623c11d4CC00ca3EC4d0bD63337a"
      receivedPermissions.8.from:
-        "0x4DCeB440657f21083db8aDd07665f8ddBe1DCfc0"
+        "0x57Bd336d579A51938619271a7Cc137a46D0501B1"
      receivedPermissions.8.via.3:
+        {"address":"0x8315177aB297bA92A06054cE80a67Ed4DBd7ed3a"}
      receivedPermissions.8.via.2.address:
-        "0x8315177aB297bA92A06054cE80a67Ed4DBd7ed3a"
+        "0xE6841D92B0C345144506576eC13ECf5103aC7f49"
      receivedPermissions.8.via.2.delay:
+        259200
      receivedPermissions.8.via.1.address:
-        "0xE6841D92B0C345144506576eC13ECf5103aC7f49"
+        "0x3ffFbAdAF827559da092217e474760E2b2c3CeDd"
      receivedPermissions.8.via.1.delay:
-        259200
      receivedPermissions.8.via.0.address:
-        "0x3ffFbAdAF827559da092217e474760E2b2c3CeDd"
+        "0x554723262467F125Ac9e1cDFa9Ce15cc53822dbD"
      receivedPermissions.7.from:
-        "0x4Dbd4fc535Ac27206064B68FfCf827b0A60BAB3f"
+        "0x4DCeB440657f21083db8aDd07665f8ddBe1DCfc0"
      receivedPermissions.7.via.3:
-        {"address":"0x8315177aB297bA92A06054cE80a67Ed4DBd7ed3a"}
      receivedPermissions.7.via.2.address:
-        "0xE6841D92B0C345144506576eC13ECf5103aC7f49"
+        "0x8315177aB297bA92A06054cE80a67Ed4DBd7ed3a"
      receivedPermissions.7.via.2.delay:
-        259200
      receivedPermissions.7.via.1.address:
-        "0x3ffFbAdAF827559da092217e474760E2b2c3CeDd"
+        "0xE6841D92B0C345144506576eC13ECf5103aC7f49"
      receivedPermissions.7.via.1.delay:
+        259200
      receivedPermissions.7.via.0.address:
-        "0x554723262467F125Ac9e1cDFa9Ce15cc53822dbD"
+        "0x3ffFbAdAF827559da092217e474760E2b2c3CeDd"
      receivedPermissions.6.from:
-        "0x3ffFbAdAF827559da092217e474760E2b2c3CeDd"
+        "0x4Dbd4fc535Ac27206064B68FfCf827b0A60BAB3f"
      receivedPermissions.6.via.0.address:
-        "0x5613AF0474EB9c528A34701A5b1662E3C8FA0678"
+        "0x554723262467F125Ac9e1cDFa9Ce15cc53822dbD"
      receivedPermissions.5.from:
-        "0x1c479675ad559DC151F6Ec7ed3FbF8ceE79582B6"
+        "0x3ffFbAdAF827559da092217e474760E2b2c3CeDd"
      receivedPermissions.5.via.0.address:
-        "0x554723262467F125Ac9e1cDFa9Ce15cc53822dbD"
+        "0x5613AF0474EB9c528A34701A5b1662E3C8FA0678"
      receivedPermissions.4.from:
-        "0x0B9857ae2D4A3DBe74ffE1d7DF045bb7F96E4840"
+        "0x1c479675ad559DC151F6Ec7ed3FbF8ceE79582B6"
      receivedPermissions.3.permission:
-        "interact"
+        "upgrade"
      receivedPermissions.3.from:
-        "0xE6841D92B0C345144506576eC13ECf5103aC7f49"
+        "0x0B9857ae2D4A3DBe74ffE1d7DF045bb7F96E4840"
      receivedPermissions.3.description:
-        "update the minimum delay of the timelock."
      receivedPermissions.3.via.3:
+        {"address":"0x8315177aB297bA92A06054cE80a67Ed4DBd7ed3a"}
      receivedPermissions.3.via.2.address:
-        "0x8315177aB297bA92A06054cE80a67Ed4DBd7ed3a"
+        "0xE6841D92B0C345144506576eC13ECf5103aC7f49"
      receivedPermissions.3.via.2.delay:
+        259200
      receivedPermissions.3.via.1.address:
-        "0xE6841D92B0C345144506576eC13ECf5103aC7f49"
+        "0x3ffFbAdAF827559da092217e474760E2b2c3CeDd"
      receivedPermissions.3.via.1.delay:
-        259200
      receivedPermissions.3.via.0.address:
-        "0x3ffFbAdAF827559da092217e474760E2b2c3CeDd"
+        "0x554723262467F125Ac9e1cDFa9Ce15cc53822dbD"
      receivedPermissions.1.description:
-        "cancel queued transactions."
+        "update the minimum delay and manage all access control roles of the timelock."
      receivedPermissions.1.delay:
+        259200
    }
```

```diff
    contract UpgradeExecutor (0x3ffFbAdAF827559da092217e474760E2b2c3CeDd) {
    +++ description: Central contract defining the access control permissions for upgrading the system contract implementations.
      directlyReceivedPermissions.6:
-        {"permission":"upgrade","from":"0x4DCeB440657f21083db8aDd07665f8ddBe1DCfc0"}
      directlyReceivedPermissions.5.permission:
-        "interact"
+        "upgrade"
      directlyReceivedPermissions.5.from:
-        "0xE6841D92B0C345144506576eC13ECf5103aC7f49"
+        "0x4DCeB440657f21083db8aDd07665f8ddBe1DCfc0"
      directlyReceivedPermissions.5.description:
-        "update the minimum delay of the timelock."
      directlyReceivedPermissions.4.description:
-        "cancel queued transactions."
+        "update the minimum delay and manage all access control roles of the timelock."
      directlyReceivedPermissions.4.delay:
+        259200
    }
```

```diff
    contract L1Timelock (0xE6841D92B0C345144506576eC13ECf5103aC7f49) {
    +++ description: A timelock with access control. The current minimum delay is 3d. Proposals that passed their minimum delay can be executed by the anyone.
      issuedPermissions.6:
-        {"permission":"upgrade","to":"0xF06E95eF589D9c38af242a8AAee8375f14023F85","via":[{"address":"0x3ffFbAdAF827559da092217e474760E2b2c3CeDd"},{"address":"0x5613AF0474EB9c528A34701A5b1662E3C8FA0678"}]}
      issuedPermissions.5:
-        {"permission":"upgrade","to":"0x0B9857ae2D4A3DBe74ffE1d7DF045bb7F96E4840","via":[{"address":"0x8315177aB297bA92A06054cE80a67Ed4DBd7ed3a"},{"address":"0xE6841D92B0C345144506576eC13ECf5103aC7f49","delay":259200},{"address":"0x3ffFbAdAF827559da092217e474760E2b2c3CeDd"},{"address":"0x5613AF0474EB9c528A34701A5b1662E3C8FA0678"}]}
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
+        "0x0B9857ae2D4A3DBe74ffE1d7DF045bb7F96E4840"
      issuedPermissions.3.description:
-        "cancel queued transactions."
      issuedPermissions.3.via.3:
+        {"address":"0x5613AF0474EB9c528A34701A5b1662E3C8FA0678"}
      issuedPermissions.3.via.2:
+        {"address":"0x3ffFbAdAF827559da092217e474760E2b2c3CeDd"}
      issuedPermissions.3.via.1:
+        {"address":"0xE6841D92B0C345144506576eC13ECf5103aC7f49","delay":259200}
      issuedPermissions.3.via.0.address:
-        "0x3ffFbAdAF827559da092217e474760E2b2c3CeDd"
+        "0x8315177aB297bA92A06054cE80a67Ed4DBd7ed3a"
      issuedPermissions.2.to:
-        "0x0B9857ae2D4A3DBe74ffE1d7DF045bb7F96E4840"
+        "0xF06E95eF589D9c38af242a8AAee8375f14023F85"
      issuedPermissions.2.description:
-        "update the minimum delay of the timelock."
+        "update the minimum delay and manage all access control roles of the timelock."
      issuedPermissions.2.via.2:
-        {"address":"0x3ffFbAdAF827559da092217e474760E2b2c3CeDd"}
      issuedPermissions.2.via.1:
-        {"address":"0xE6841D92B0C345144506576eC13ECf5103aC7f49","delay":259200}
      issuedPermissions.2.via.0.address:
-        "0x8315177aB297bA92A06054cE80a67Ed4DBd7ed3a"
+        "0x3ffFbAdAF827559da092217e474760E2b2c3CeDd"
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
      receivedPermissions.16:
-        {"permission":"upgrade","from":"0xE6841D92B0C345144506576eC13ECf5103aC7f49","via":[{"address":"0x5613AF0474EB9c528A34701A5b1662E3C8FA0678"},{"address":"0x3ffFbAdAF827559da092217e474760E2b2c3CeDd"}]}
      receivedPermissions.15.from:
-        "0xcEe284F754E854890e311e3280b767F80797180d"
+        "0xE6841D92B0C345144506576eC13ECf5103aC7f49"
      receivedPermissions.15.via.0.address:
-        "0x9aD46fac0Cf7f790E5be05A0F15223935A0c0aDa"
+        "0x5613AF0474EB9c528A34701A5b1662E3C8FA0678"
      receivedPermissions.14.from:
-        "0xA5565d266c3c3Ee90B16Be8A5b13d587ef559fB0"
+        "0xcEe284F754E854890e311e3280b767F80797180d"
      receivedPermissions.14.via.0.address:
-        "0x554723262467F125Ac9e1cDFa9Ce15cc53822dbD"
+        "0x9aD46fac0Cf7f790E5be05A0F15223935A0c0aDa"
      receivedPermissions.13.from:
-        "0xa3A7B6F88361F48403514059F1F16C8E78d60EeC"
+        "0xA5565d266c3c3Ee90B16Be8A5b13d587ef559fB0"
      receivedPermissions.13.via.0.address:
-        "0x9aD46fac0Cf7f790E5be05A0F15223935A0c0aDa"
+        "0x554723262467F125Ac9e1cDFa9Ce15cc53822dbD"
      receivedPermissions.12.from:
-        "0x8315177aB297bA92A06054cE80a67Ed4DBd7ed3a"
+        "0xa3A7B6F88361F48403514059F1F16C8E78d60EeC"
      receivedPermissions.12.via.0.address:
-        "0x554723262467F125Ac9e1cDFa9Ce15cc53822dbD"
+        "0x9aD46fac0Cf7f790E5be05A0F15223935A0c0aDa"
      receivedPermissions.11.from:
-        "0x760723CD2e632826c38Fef8CD438A4CC7E7E1A40"
+        "0x8315177aB297bA92A06054cE80a67Ed4DBd7ed3a"
      receivedPermissions.10.from:
-        "0x72Ce9c846789fdB6fC1f34aC4AD25Dd9ef7031ef"
+        "0x760723CD2e632826c38Fef8CD438A4CC7E7E1A40"
      receivedPermissions.10.via.0.address:
-        "0x9aD46fac0Cf7f790E5be05A0F15223935A0c0aDa"
+        "0x554723262467F125Ac9e1cDFa9Ce15cc53822dbD"
      receivedPermissions.9.from:
-        "0x667e23ABd27E623c11d4CC00ca3EC4d0bD63337a"
+        "0x72Ce9c846789fdB6fC1f34aC4AD25Dd9ef7031ef"
      receivedPermissions.9.via.0.address:
-        "0x554723262467F125Ac9e1cDFa9Ce15cc53822dbD"
+        "0x9aD46fac0Cf7f790E5be05A0F15223935A0c0aDa"
      receivedPermissions.8.from:
-        "0x57Bd336d579A51938619271a7Cc137a46D0501B1"
+        "0x667e23ABd27E623c11d4CC00ca3EC4d0bD63337a"
      receivedPermissions.7.from:
-        "0x4DCeB440657f21083db8aDd07665f8ddBe1DCfc0"
+        "0x57Bd336d579A51938619271a7Cc137a46D0501B1"
      receivedPermissions.7.via.1:
+        {"address":"0x3ffFbAdAF827559da092217e474760E2b2c3CeDd"}
      receivedPermissions.7.via.0.address:
-        "0x3ffFbAdAF827559da092217e474760E2b2c3CeDd"
+        "0x554723262467F125Ac9e1cDFa9Ce15cc53822dbD"
      receivedPermissions.6.from:
-        "0x4Dbd4fc535Ac27206064B68FfCf827b0A60BAB3f"
+        "0x4DCeB440657f21083db8aDd07665f8ddBe1DCfc0"
      receivedPermissions.6.via.1:
-        {"address":"0x3ffFbAdAF827559da092217e474760E2b2c3CeDd"}
      receivedPermissions.6.via.0.address:
-        "0x554723262467F125Ac9e1cDFa9Ce15cc53822dbD"
+        "0x3ffFbAdAF827559da092217e474760E2b2c3CeDd"
      receivedPermissions.5.from:
-        "0x3ffFbAdAF827559da092217e474760E2b2c3CeDd"
+        "0x4Dbd4fc535Ac27206064B68FfCf827b0A60BAB3f"
      receivedPermissions.5.via.0.address:
-        "0x5613AF0474EB9c528A34701A5b1662E3C8FA0678"
+        "0x554723262467F125Ac9e1cDFa9Ce15cc53822dbD"
      receivedPermissions.4.from:
-        "0x1c479675ad559DC151F6Ec7ed3FbF8ceE79582B6"
+        "0x3ffFbAdAF827559da092217e474760E2b2c3CeDd"
      receivedPermissions.4.via.0.address:
-        "0x554723262467F125Ac9e1cDFa9Ce15cc53822dbD"
+        "0x5613AF0474EB9c528A34701A5b1662E3C8FA0678"
      receivedPermissions.3.from:
-        "0x0B9857ae2D4A3DBe74ffE1d7DF045bb7F96E4840"
+        "0x1c479675ad559DC151F6Ec7ed3FbF8ceE79582B6"
      receivedPermissions.2.permission:
-        "interact"
+        "upgrade"
      receivedPermissions.2.from:
-        "0xE6841D92B0C345144506576eC13ECf5103aC7f49"
+        "0x0B9857ae2D4A3DBe74ffE1d7DF045bb7F96E4840"
      receivedPermissions.2.description:
-        "update the minimum delay of the timelock."
      receivedPermissions.2.via.1:
+        {"address":"0x3ffFbAdAF827559da092217e474760E2b2c3CeDd"}
      receivedPermissions.2.via.0.address:
-        "0x3ffFbAdAF827559da092217e474760E2b2c3CeDd"
+        "0x554723262467F125Ac9e1cDFa9Ce15cc53822dbD"
      receivedPermissions.1.description:
-        "cancel queued transactions."
+        "update the minimum delay and manage all access control roles of the timelock."
      receivedPermissions.1.delay:
+        259200
    }
```

Generated with discovered.json: 0x6be3da72bffcea676a63969f1088efc534ac0f95

# Diff at Thu, 06 Mar 2025 09:38:57 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@7119c715545bc86a4194761f42815f811ac6307a block: 21892618
- current block number: 21892618

## Description

Config related: set severity for arbitrum inbox/outbox changes to high and add historical In- and Outboxes via events.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21892618 (main branch discovery), not current.

```diff
    contract Bridge (0x8315177aB297bA92A06054cE80a67Ed4DBd7ed3a) {
    +++ description: Escrow contract for the project's gas token (can be different from ETH). Keeps a list of allowed Inboxes and Outboxes for canonical bridge messaging.
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

Generated with discovered.json: 0x9339e2ca805ee3ee8aab9cd35f4fa9ad598fef56

# Diff at Tue, 04 Mar 2025 10:38:56 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@98d260b45fe0d2195ce5e629bd7b200c8706e8ba block: 21892618
- current block number: 21892618

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21892618 (main branch discovery), not current.

```diff
    contract Outbox (0x0B9857ae2D4A3DBe74ffE1d7DF045bb7F96E4840) {
    +++ description: Facilitates L2 to L1 contract calls: Messages initiated from L2 (for example withdrawal messages) eventually resolve in execution on L1. Is also used to relay governance action messages from Arbitrum One to Ethereum, allowing the L2Timelock and its Governance actors on L2 to act as this address and inherit all its listed permissions.
      sinceBlock:
+        15411056
    }
```

```diff
    contract wstETHEscrow (0x0F25c1DC2a9922304f2eac71DCa9B07E310e8E5a) {
    +++ description: None
      sinceBlock:
+        15275328
    }
```

```diff
    contract UpgradeableBeacon (0x14797f5432f699Cb4d4dB04DF599B74952d78d7b) {
    +++ description: None
      sinceBlock:
+        12525700
    }
```

```diff
    contract SequencerInbox (0x1c479675ad559DC151F6Ec7ed3FbF8ceE79582B6) {
    +++ description: A sequencer (registered in this contract) can submit transaction batches or commitments here.
      sinceBlock:
+        15411056
    }
```

```diff
    contract OneStepProver0 (0x35FBC5F03d86E88973B06Fb9C5a913D54AbdF731) {
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
      sinceBlock:
+        21418842
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
    contract ParentToChildRewardRouter (0x40Cd7D713D7ae463f95cE5d342Ea6E7F5cF7C999) {
    +++ description: Collects the excess stake when rival nodes are created and allows to send them to the L2 treasury.
      sinceBlock:
+        20320563
    }
```

```diff
    contract OneStepProofEntry (0x4397fE1E959Ba81B9D5f1A9679Ddd891955A42d6) {
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
      sinceBlock:
+        21418888
    }
```

```diff
    contract Inbox (0x4Dbd4fc535Ac27206064B68FfCf827b0A60BAB3f) {
    +++ description: Facilitates sending L1 to L2 messages like depositing ETH, but does not escrow funds.
      sinceBlock:
+        12525700
    }
```

```diff
    contract RollupProxy (0x4DCeB440657f21083db8aDd07665f8ddBe1DCfc0) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new assertions (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both called Validators).
      sinceBlock:
+        21830860
    }
```

```diff
    contract ArbitrumProxyAdmin (0x554723262467F125Ac9e1cDFa9Ce15cc53822dbD) {
    +++ description: None
      sinceBlock:
+        15411056
    }
```

```diff
    contract UpgradeExecutorAdmin (0x5613AF0474EB9c528A34701A5b1662E3C8FA0678) {
    +++ description: None
      sinceBlock:
+        16840300
    }
```

```diff
    contract RollupEventInbox (0x57Bd336d579A51938619271a7Cc137a46D0501B1) {
    +++ description: Helper contract sending configuration data over the bridge during the systems initialization.
      sinceBlock:
+        15411056
    }
```

```diff
    contract OutboxV0 (0x667e23ABd27E623c11d4CC00ca3EC4d0bD63337a) {
    +++ description: None
      sinceBlock:
+        12525700
    }
```

```diff
    contract LPTL1Escrow (0x6A23F4940BD5BA117Da261f98aae51A8BFfa210A) {
    +++ description: None
      sinceBlock:
+        14199409
    }
```

```diff
    contract GatewayRouter (0x72Ce9c846789fdB6fC1f34aC4AD25Dd9ef7031ef) {
    +++ description: This routing contract maps tokens to the correct escrow (gateway) to be then bridged with canonical messaging.
      sinceBlock:
+        12640865
    }
```

```diff
    contract OutboxV1 (0x760723CD2e632826c38Fef8CD438A4CC7E7E1A40) {
    +++ description: None
      sinceBlock:
+        13124585
    }
```

```diff
    contract Bridge (0x8315177aB297bA92A06054cE80a67Ed4DBd7ed3a) {
    +++ description: Escrow contract for the project's gas token (can be different from ETH). Keeps a list of allowed Inboxes and Outboxes for canonical bridge messaging.
      sinceBlock:
+        15411056
    }
```

```diff
    contract GatewaysAdmin (0x9aD46fac0Cf7f790E5be05A0F15223935A0c0aDa) {
    +++ description: None
      sinceBlock:
+        12640863
    }
```

```diff
    contract OneStepProverHostIo (0xa07cD154340CC74EcF156FFB9fb378Ee29Ca71Cf) {
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
      sinceBlock:
+        21418875
    }
```

```diff
    contract L1Escrow (0xA10c7CE4b876998858b1a9E12b10092229539400) {
    +++ description: None
      sinceBlock:
+        13262081
    }
```

```diff
    contract L1ERC20Gateway (0xa3A7B6F88361F48403514059F1F16C8E78d60EeC) {
    +++ description: Escrows deposited ERC-20 assets for the canonical Bridge. Upon depositing, a generic token representation will be minted at the destination. Withdrawals are initiated by the Outbox contract.
      sinceBlock:
+        12640867
    }
```

```diff
    contract EdgeChallengeManager (0xA5565d266c3c3Ee90B16Be8A5b13d587ef559fB0) {
    +++ description: Contract that implements the main challenge protocol logic of the fraud proof system.
      sinceBlock:
+        21830860
    }
```

```diff
    contract OneStepProverMath (0xaB9596a0aaF28bc798c453434EC2DC0F8F0bF921) {
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
      sinceBlock:
+        21418863
    }
```

```diff
    contract OutboxEntry (0xc4940069140142236D4065b866018f7b2BeC77fD) {
    +++ description: None
      sinceBlock:
+        13116271
    }
```

```diff
    contract L1CustomGateway (0xcEe284F754E854890e311e3280b767F80797180d) {
    +++ description: Escrows deposited assets for the canonical bridge that are externally governed or need custom token contracts with e.g. minting rights or upgradeability.
      sinceBlock:
+        12647126
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
    contract L1DaiGateway (0xD3B5b60020504bc3489D6949d545893982BA3011) {
    +++ description: Counterpart of the L2DaiGateway. Allows for bridging DAI from L1 to L2.
      sinceBlock:
+        13262087
    }
```

```diff
    contract OneStepProverMemory (0xe0ba77e0E24de5369e3B268Ea79fDe716e2EC48b) {
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
      sinceBlock:
+        21418853
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

Generated with discovered.json: 0x4753e89929a90ebf5d09fbcd7e54508ddba42aaa

# Diff at Thu, 27 Feb 2025 11:45:22 GMT:

- author: Michał Podsiadły (<michal.podsiadly@l2beat.com>)
- comparing to: main@a4b50e45bb44f8ceeea29f9236088d26a843c885 block: 21892618
- current block number: 21892618

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21892618 (main branch discovery), not current.

```diff
    contract GatewayRouter (0x72Ce9c846789fdB6fC1f34aC4AD25Dd9ef7031ef) {
    +++ description: This routing contract maps tokens to the correct escrow (gateway) to be then bridged with canonical messaging.
      name:
-        "L1GatewayRouter"
+        "GatewayRouter"
      displayName:
-        "GatewayRouter"
    }
```

Generated with discovered.json: 0x229ebd49117bef73bcdc5e6a9184bfad5306b5b6

# Diff at Fri, 21 Feb 2025 12:11:24 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@d219f271711b2cf7a164e3443bead5e4957d13a8 block: 21892618
- current block number: 21892618

## Description

Config related: Set orbit stack contract categories.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21892618 (main branch discovery), not current.

```diff
    contract Outbox (0x0B9857ae2D4A3DBe74ffE1d7DF045bb7F96E4840) {
    +++ description: Facilitates L2 to L1 contract calls: Messages initiated from L2 (for example withdrawal messages) eventually resolve in execution on L1. Is also used to relay governance action messages from Arbitrum One to Ethereum, allowing the L2Timelock and its Governance actors on L2 to act as this address and inherit all its listed permissions.
      category:
+        {"name":"Canonical Bridges","priority":2}
    }
```

```diff
    contract wstETHEscrow (0x0F25c1DC2a9922304f2eac71DCa9B07E310e8E5a) {
    +++ description: None
      category:
+        {"name":"External Bridges","priority":1}
    }
```

```diff
    contract UpgradeableBeacon (0x14797f5432f699Cb4d4dB04DF599B74952d78d7b) {
    +++ description: None
      category:
+        {"name":"Spam","priority":-1}
    }
```

```diff
    contract SequencerInbox (0x1c479675ad559DC151F6Ec7ed3FbF8ceE79582B6) {
    +++ description: A sequencer (registered in this contract) can submit transaction batches or commitments here.
      category:
+        {"name":"Local Infrastructure","priority":5}
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
    contract Inbox (0x4Dbd4fc535Ac27206064B68FfCf827b0A60BAB3f) {
    +++ description: Facilitates sending L1 to L2 messages like depositing ETH, but does not escrow funds.
      category:
+        {"name":"Canonical Bridges","priority":2}
    }
```

```diff
    contract RollupProxy (0x4DCeB440657f21083db8aDd07665f8ddBe1DCfc0) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new assertions (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both called Validators).
      category:
+        {"name":"Local Infrastructure","priority":5}
    }
```

```diff
    contract ArbitrumProxyAdmin (0x554723262467F125Ac9e1cDFa9Ce15cc53822dbD) {
    +++ description: None
      category:
+        {"name":"Spam","priority":-1}
    }
```

```diff
    contract UpgradeExecutorAdmin (0x5613AF0474EB9c528A34701A5b1662E3C8FA0678) {
    +++ description: None
      category:
+        {"name":"Spam","priority":-1}
    }
```

```diff
    contract LPTL1Escrow (0x6A23F4940BD5BA117Da261f98aae51A8BFfa210A) {
    +++ description: None
      category:
+        {"name":"External Bridges","priority":1}
    }
```

```diff
    contract L1GatewayRouter (0x72Ce9c846789fdB6fC1f34aC4AD25Dd9ef7031ef) {
    +++ description: This routing contract maps tokens to the correct escrow (gateway) to be then bridged with canonical messaging.
      category:
+        {"name":"External Bridges","priority":1}
    }
```

```diff
    contract Bridge (0x8315177aB297bA92A06054cE80a67Ed4DBd7ed3a) {
    +++ description: Escrow contract for the project's gas token (can be different from ETH). Keeps a list of allowed Inboxes and Outboxes for canonical bridge messaging.
      category:
+        {"name":"Local Infrastructure","priority":5}
    }
```

```diff
    contract GatewaysAdmin (0x9aD46fac0Cf7f790E5be05A0F15223935A0c0aDa) {
    +++ description: None
      category:
+        {"name":"Spam","priority":-1}
    }
```

```diff
    contract L1Escrow (0xA10c7CE4b876998858b1a9E12b10092229539400) {
    +++ description: None
      category:
+        {"name":"External Bridges","priority":1}
    }
```

```diff
    contract L1ERC20Gateway (0xa3A7B6F88361F48403514059F1F16C8E78d60EeC) {
    +++ description: Escrows deposited ERC-20 assets for the canonical Bridge. Upon depositing, a generic token representation will be minted at the destination. Withdrawals are initiated by the Outbox contract.
      category:
+        {"name":"Canonical Bridges","priority":2}
    }
```

```diff
    contract EdgeChallengeManager (0xA5565d266c3c3Ee90B16Be8A5b13d587ef559fB0) {
    +++ description: Contract that implements the main challenge protocol logic of the fraud proof system.
      category:
+        {"name":"Local Infrastructure","priority":5}
    }
```

```diff
    contract OutboxEntry (0xc4940069140142236D4065b866018f7b2BeC77fD) {
    +++ description: None
      category:
+        {"name":"Spam","priority":-1}
    }
```

```diff
    contract L1CustomGateway (0xcEe284F754E854890e311e3280b767F80797180d) {
    +++ description: Escrows deposited assets for the canonical bridge that are externally governed or need custom token contracts with e.g. minting rights or upgradeability.
      category:
+        {"name":"External Bridges","priority":1}
    }
```

```diff
    contract L1DaiGateway (0xD3B5b60020504bc3489D6949d545893982BA3011) {
    +++ description: Counterpart of the L2DaiGateway. Allows for bridging DAI from L1 to L2.
      category:
+        {"name":"External Bridges","priority":1}
    }
```

```diff
    contract L1Timelock (0xE6841D92B0C345144506576eC13ECf5103aC7f49) {
    +++ description: A timelock with access control. The current minimum delay is 3d. Proposals that passed their minimum delay can be executed by the anyone.
      category:
+        {"name":"Governance","priority":3}
    }
```

Generated with discovered.json: 0x54903cdfb5b0dbabfa14e0e80e389547805489b9

# Diff at Fri, 21 Feb 2025 05:52:53 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@72fe705e53307d22cfc60842c4313d545aee913e block: 21887731
- current block number: 21892618

## Description

Config related: All permissions from the Bridge are moved to the Outbox and a description is added to explain why the permissions are stuck there (and not on L2).

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21887731 (main branch discovery), not current.

```diff
    contract Outbox (0x0B9857ae2D4A3DBe74ffE1d7DF045bb7F96E4840) {
    +++ description: Facilitates L2 to L1 contract calls: Messages initiated from L2 (for example withdrawal messages) eventually resolve in execution on L1. Is also used to relay governance action messages from Arbitrum One to Ethereum, allowing the L2Timelock and its Governance actors on L2 to act as this address and inherit all its listed permissions.
      description:
-        "Facilitates L2 to L1 contract calls: Messages initiated from L2 (for example withdrawal messages) eventually resolve in execution on L1."
+        "Facilitates L2 to L1 contract calls: Messages initiated from L2 (for example withdrawal messages) eventually resolve in execution on L1. Is also used to relay governance action messages from Arbitrum One to Ethereum, allowing the L2Timelock and its Governance actors on L2 to act as this address and inherit all its listed permissions."
      issuedPermissions.0.to:
-        "0x8315177aB297bA92A06054cE80a67Ed4DBd7ed3a"
+        "0x0B9857ae2D4A3DBe74ffE1d7DF045bb7F96E4840"
      issuedPermissions.0.via.3:
+        {"address":"0x554723262467F125Ac9e1cDFa9Ce15cc53822dbD"}
      issuedPermissions.0.via.2.address:
-        "0x554723262467F125Ac9e1cDFa9Ce15cc53822dbD"
+        "0x3ffFbAdAF827559da092217e474760E2b2c3CeDd"
      issuedPermissions.0.via.1.address:
-        "0x3ffFbAdAF827559da092217e474760E2b2c3CeDd"
+        "0xE6841D92B0C345144506576eC13ECf5103aC7f49"
      issuedPermissions.0.via.1.delay:
+        259200
      issuedPermissions.0.via.0.address:
-        "0xE6841D92B0C345144506576eC13ECf5103aC7f49"
+        "0x8315177aB297bA92A06054cE80a67Ed4DBd7ed3a"
      issuedPermissions.0.via.0.delay:
-        259200
      receivedPermissions:
+        [{"permission":"interact","from":"0x4DCeB440657f21083db8aDd07665f8ddBe1DCfc0","description":"Pause and unpause and set important roles and parameters in the system contracts: Can delegate Sequencer management to a BatchPosterManager address, manage data availability and DACs, set the Sequencer-only window, introduce an allowList to the bridge and whitelist Inboxes/Outboxes.","via":[{"address":"0x3ffFbAdAF827559da092217e474760E2b2c3CeDd"},{"address":"0xE6841D92B0C345144506576eC13ECf5103aC7f49","delay":259200},{"address":"0x8315177aB297bA92A06054cE80a67Ed4DBd7ed3a"}]},{"permission":"interact","from":"0xE6841D92B0C345144506576eC13ECf5103aC7f49","description":"cancel queued transactions.","via":[{"address":"0x3ffFbAdAF827559da092217e474760E2b2c3CeDd"},{"address":"0xE6841D92B0C345144506576eC13ECf5103aC7f49","delay":259200},{"address":"0x8315177aB297bA92A06054cE80a67Ed4DBd7ed3a"}]},{"permission":"interact","from":"0xE6841D92B0C345144506576eC13ECf5103aC7f49","description":"propose transactions.","via":[{"address":"0x8315177aB297bA92A06054cE80a67Ed4DBd7ed3a"}]},{"permission":"interact","from":"0xE6841D92B0C345144506576eC13ECf5103aC7f49","description":"update the minimum delay of the timelock.","via":[{"address":"0x3ffFbAdAF827559da092217e474760E2b2c3CeDd"},{"address":"0xE6841D92B0C345144506576eC13ECf5103aC7f49","delay":259200},{"address":"0x8315177aB297bA92A06054cE80a67Ed4DBd7ed3a"}]},{"permission":"upgrade","from":"0x0B9857ae2D4A3DBe74ffE1d7DF045bb7F96E4840","via":[{"address":"0x554723262467F125Ac9e1cDFa9Ce15cc53822dbD"},{"address":"0x3ffFbAdAF827559da092217e474760E2b2c3CeDd"},{"address":"0xE6841D92B0C345144506576eC13ECf5103aC7f49","delay":259200},{"address":"0x8315177aB297bA92A06054cE80a67Ed4DBd7ed3a"}]},{"permission":"upgrade","from":"0x1c479675ad559DC151F6Ec7ed3FbF8ceE79582B6","via":[{"address":"0x554723262467F125Ac9e1cDFa9Ce15cc53822dbD"},{"address":"0x3ffFbAdAF827559da092217e474760E2b2c3CeDd"},{"address":"0xE6841D92B0C345144506576eC13ECf5103aC7f49","delay":259200},{"address":"0x8315177aB297bA92A06054cE80a67Ed4DBd7ed3a"}]},{"permission":"upgrade","from":"0x3ffFbAdAF827559da092217e474760E2b2c3CeDd","via":[{"address":"0x5613AF0474EB9c528A34701A5b1662E3C8FA0678"},{"address":"0x3ffFbAdAF827559da092217e474760E2b2c3CeDd"},{"address":"0xE6841D92B0C345144506576eC13ECf5103aC7f49","delay":259200},{"address":"0x8315177aB297bA92A06054cE80a67Ed4DBd7ed3a"}]},{"permission":"upgrade","from":"0x4Dbd4fc535Ac27206064B68FfCf827b0A60BAB3f","via":[{"address":"0x554723262467F125Ac9e1cDFa9Ce15cc53822dbD"},{"address":"0x3ffFbAdAF827559da092217e474760E2b2c3CeDd"},{"address":"0xE6841D92B0C345144506576eC13ECf5103aC7f49","delay":259200},{"address":"0x8315177aB297bA92A06054cE80a67Ed4DBd7ed3a"}]},{"permission":"upgrade","from":"0x4DCeB440657f21083db8aDd07665f8ddBe1DCfc0","via":[{"address":"0x3ffFbAdAF827559da092217e474760E2b2c3CeDd"},{"address":"0xE6841D92B0C345144506576eC13ECf5103aC7f49","delay":259200},{"address":"0x8315177aB297bA92A06054cE80a67Ed4DBd7ed3a"}]},{"permission":"upgrade","from":"0x57Bd336d579A51938619271a7Cc137a46D0501B1","via":[{"address":"0x554723262467F125Ac9e1cDFa9Ce15cc53822dbD"},{"address":"0x3ffFbAdAF827559da092217e474760E2b2c3CeDd"},{"address":"0xE6841D92B0C345144506576eC13ECf5103aC7f49","delay":259200},{"address":"0x8315177aB297bA92A06054cE80a67Ed4DBd7ed3a"}]},{"permission":"upgrade","from":"0x667e23ABd27E623c11d4CC00ca3EC4d0bD63337a","via":[{"address":"0x554723262467F125Ac9e1cDFa9Ce15cc53822dbD"},{"address":"0x3ffFbAdAF827559da092217e474760E2b2c3CeDd"},{"address":"0xE6841D92B0C345144506576eC13ECf5103aC7f49","delay":259200},{"address":"0x8315177aB297bA92A06054cE80a67Ed4DBd7ed3a"}]},{"permission":"upgrade","from":"0x72Ce9c846789fdB6fC1f34aC4AD25Dd9ef7031ef","via":[{"address":"0x9aD46fac0Cf7f790E5be05A0F15223935A0c0aDa"},{"address":"0x3ffFbAdAF827559da092217e474760E2b2c3CeDd"},{"address":"0xE6841D92B0C345144506576eC13ECf5103aC7f49","delay":259200},{"address":"0x8315177aB297bA92A06054cE80a67Ed4DBd7ed3a"}]},{"permission":"upgrade","from":"0x760723CD2e632826c38Fef8CD438A4CC7E7E1A40","via":[{"address":"0x554723262467F125Ac9e1cDFa9Ce15cc53822dbD"},{"address":"0x3ffFbAdAF827559da092217e474760E2b2c3CeDd"},{"address":"0xE6841D92B0C345144506576eC13ECf5103aC7f49","delay":259200},{"address":"0x8315177aB297bA92A06054cE80a67Ed4DBd7ed3a"}]},{"permission":"upgrade","from":"0x8315177aB297bA92A06054cE80a67Ed4DBd7ed3a","via":[{"address":"0x554723262467F125Ac9e1cDFa9Ce15cc53822dbD"},{"address":"0x3ffFbAdAF827559da092217e474760E2b2c3CeDd"},{"address":"0xE6841D92B0C345144506576eC13ECf5103aC7f49","delay":259200},{"address":"0x8315177aB297bA92A06054cE80a67Ed4DBd7ed3a"}]},{"permission":"upgrade","from":"0xa3A7B6F88361F48403514059F1F16C8E78d60EeC","via":[{"address":"0x9aD46fac0Cf7f790E5be05A0F15223935A0c0aDa"},{"address":"0x3ffFbAdAF827559da092217e474760E2b2c3CeDd"},{"address":"0xE6841D92B0C345144506576eC13ECf5103aC7f49","delay":259200},{"address":"0x8315177aB297bA92A06054cE80a67Ed4DBd7ed3a"}]},{"permission":"upgrade","from":"0xA5565d266c3c3Ee90B16Be8A5b13d587ef559fB0","via":[{"address":"0x554723262467F125Ac9e1cDFa9Ce15cc53822dbD"},{"address":"0x3ffFbAdAF827559da092217e474760E2b2c3CeDd"},{"address":"0xE6841D92B0C345144506576eC13ECf5103aC7f49","delay":259200},{"address":"0x8315177aB297bA92A06054cE80a67Ed4DBd7ed3a"}]},{"permission":"upgrade","from":"0xcEe284F754E854890e311e3280b767F80797180d","via":[{"address":"0x9aD46fac0Cf7f790E5be05A0F15223935A0c0aDa"},{"address":"0x3ffFbAdAF827559da092217e474760E2b2c3CeDd"},{"address":"0xE6841D92B0C345144506576eC13ECf5103aC7f49","delay":259200},{"address":"0x8315177aB297bA92A06054cE80a67Ed4DBd7ed3a"}]},{"permission":"upgrade","from":"0xE6841D92B0C345144506576eC13ECf5103aC7f49","via":[{"address":"0x5613AF0474EB9c528A34701A5b1662E3C8FA0678"},{"address":"0x3ffFbAdAF827559da092217e474760E2b2c3CeDd"},{"address":"0xE6841D92B0C345144506576eC13ECf5103aC7f49","delay":259200},{"address":"0x8315177aB297bA92A06054cE80a67Ed4DBd7ed3a"}]}]
      directlyReceivedPermissions:
+        [{"permission":"act","from":"0x8315177aB297bA92A06054cE80a67Ed4DBd7ed3a"}]
    }
```

```diff
    contract SequencerInbox (0x1c479675ad559DC151F6Ec7ed3FbF8ceE79582B6) {
    +++ description: A sequencer (registered in this contract) can submit transaction batches or commitments here.
      issuedPermissions.3.to:
-        "0x8315177aB297bA92A06054cE80a67Ed4DBd7ed3a"
+        "0x0B9857ae2D4A3DBe74ffE1d7DF045bb7F96E4840"
      issuedPermissions.3.via.3:
+        {"address":"0x554723262467F125Ac9e1cDFa9Ce15cc53822dbD"}
      issuedPermissions.3.via.2.address:
-        "0x554723262467F125Ac9e1cDFa9Ce15cc53822dbD"
+        "0x3ffFbAdAF827559da092217e474760E2b2c3CeDd"
      issuedPermissions.3.via.1.address:
-        "0x3ffFbAdAF827559da092217e474760E2b2c3CeDd"
+        "0xE6841D92B0C345144506576eC13ECf5103aC7f49"
      issuedPermissions.3.via.1.delay:
+        259200
      issuedPermissions.3.via.0.address:
-        "0xE6841D92B0C345144506576eC13ECf5103aC7f49"
+        "0x8315177aB297bA92A06054cE80a67Ed4DBd7ed3a"
      issuedPermissions.3.via.0.delay:
-        259200
    }
```

```diff
-   Status: DELETED
    contract FundRetriever (0x34d45e99f7D8c45ed05B5cA72D54bbD1fb3F98f0)
    +++ description: None
```

```diff
    contract UpgradeExecutor (0x3ffFbAdAF827559da092217e474760E2b2c3CeDd) {
    +++ description: Central contract defining the access control permissions for upgrading the system contract implementations.
      issuedPermissions.0.to:
-        "0x8315177aB297bA92A06054cE80a67Ed4DBd7ed3a"
+        "0x0B9857ae2D4A3DBe74ffE1d7DF045bb7F96E4840"
      issuedPermissions.0.via.3:
+        {"address":"0x5613AF0474EB9c528A34701A5b1662E3C8FA0678"}
      issuedPermissions.0.via.2.address:
-        "0x5613AF0474EB9c528A34701A5b1662E3C8FA0678"
+        "0x3ffFbAdAF827559da092217e474760E2b2c3CeDd"
      issuedPermissions.0.via.1.address:
-        "0x3ffFbAdAF827559da092217e474760E2b2c3CeDd"
+        "0xE6841D92B0C345144506576eC13ECf5103aC7f49"
      issuedPermissions.0.via.1.delay:
+        259200
      issuedPermissions.0.via.0.address:
-        "0xE6841D92B0C345144506576eC13ECf5103aC7f49"
+        "0x8315177aB297bA92A06054cE80a67Ed4DBd7ed3a"
      issuedPermissions.0.via.0.delay:
-        259200
    }
```

```diff
    contract Inbox (0x4Dbd4fc535Ac27206064B68FfCf827b0A60BAB3f) {
    +++ description: Facilitates sending L1 to L2 messages like depositing ETH, but does not escrow funds.
      issuedPermissions.0.to:
-        "0x8315177aB297bA92A06054cE80a67Ed4DBd7ed3a"
+        "0x0B9857ae2D4A3DBe74ffE1d7DF045bb7F96E4840"
      issuedPermissions.0.via.3:
+        {"address":"0x554723262467F125Ac9e1cDFa9Ce15cc53822dbD"}
      issuedPermissions.0.via.2.address:
-        "0x554723262467F125Ac9e1cDFa9Ce15cc53822dbD"
+        "0x3ffFbAdAF827559da092217e474760E2b2c3CeDd"
      issuedPermissions.0.via.1.address:
-        "0x3ffFbAdAF827559da092217e474760E2b2c3CeDd"
+        "0xE6841D92B0C345144506576eC13ECf5103aC7f49"
      issuedPermissions.0.via.1.delay:
+        259200
      issuedPermissions.0.via.0.address:
-        "0xE6841D92B0C345144506576eC13ECf5103aC7f49"
+        "0x8315177aB297bA92A06054cE80a67Ed4DBd7ed3a"
      issuedPermissions.0.via.0.delay:
-        259200
    }
```

```diff
    contract RollupProxy (0x4DCeB440657f21083db8aDd07665f8ddBe1DCfc0) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new assertions (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both called Validators).
      issuedPermissions.2.to:
-        "0x8315177aB297bA92A06054cE80a67Ed4DBd7ed3a"
+        "0x0B9857ae2D4A3DBe74ffE1d7DF045bb7F96E4840"
      issuedPermissions.2.via.2:
+        {"address":"0x3ffFbAdAF827559da092217e474760E2b2c3CeDd"}
      issuedPermissions.2.via.1.address:
-        "0x3ffFbAdAF827559da092217e474760E2b2c3CeDd"
+        "0xE6841D92B0C345144506576eC13ECf5103aC7f49"
      issuedPermissions.2.via.1.delay:
+        259200
      issuedPermissions.2.via.0.address:
-        "0xE6841D92B0C345144506576eC13ECf5103aC7f49"
+        "0x8315177aB297bA92A06054cE80a67Ed4DBd7ed3a"
      issuedPermissions.2.via.0.delay:
-        259200
      issuedPermissions.0.to:
-        "0x8315177aB297bA92A06054cE80a67Ed4DBd7ed3a"
+        "0x0B9857ae2D4A3DBe74ffE1d7DF045bb7F96E4840"
      issuedPermissions.0.via.2:
+        {"address":"0x3ffFbAdAF827559da092217e474760E2b2c3CeDd"}
      issuedPermissions.0.via.1.address:
-        "0x3ffFbAdAF827559da092217e474760E2b2c3CeDd"
+        "0xE6841D92B0C345144506576eC13ECf5103aC7f49"
      issuedPermissions.0.via.1.delay:
+        259200
      issuedPermissions.0.via.0.address:
-        "0xE6841D92B0C345144506576eC13ECf5103aC7f49"
+        "0x8315177aB297bA92A06054cE80a67Ed4DBd7ed3a"
      issuedPermissions.0.via.0.delay:
-        259200
    }
```

```diff
    contract RollupEventInbox (0x57Bd336d579A51938619271a7Cc137a46D0501B1) {
    +++ description: Helper contract sending configuration data over the bridge during the systems initialization.
      issuedPermissions.0.to:
-        "0x8315177aB297bA92A06054cE80a67Ed4DBd7ed3a"
+        "0x0B9857ae2D4A3DBe74ffE1d7DF045bb7F96E4840"
      issuedPermissions.0.via.3:
+        {"address":"0x554723262467F125Ac9e1cDFa9Ce15cc53822dbD"}
      issuedPermissions.0.via.2.address:
-        "0x554723262467F125Ac9e1cDFa9Ce15cc53822dbD"
+        "0x3ffFbAdAF827559da092217e474760E2b2c3CeDd"
      issuedPermissions.0.via.1.address:
-        "0x3ffFbAdAF827559da092217e474760E2b2c3CeDd"
+        "0xE6841D92B0C345144506576eC13ECf5103aC7f49"
      issuedPermissions.0.via.1.delay:
+        259200
      issuedPermissions.0.via.0.address:
-        "0xE6841D92B0C345144506576eC13ECf5103aC7f49"
+        "0x8315177aB297bA92A06054cE80a67Ed4DBd7ed3a"
      issuedPermissions.0.via.0.delay:
-        259200
    }
```

```diff
    contract OutboxV0 (0x667e23ABd27E623c11d4CC00ca3EC4d0bD63337a) {
    +++ description: None
      issuedPermissions.0.to:
-        "0x8315177aB297bA92A06054cE80a67Ed4DBd7ed3a"
+        "0x0B9857ae2D4A3DBe74ffE1d7DF045bb7F96E4840"
      issuedPermissions.0.via.3:
+        {"address":"0x554723262467F125Ac9e1cDFa9Ce15cc53822dbD"}
      issuedPermissions.0.via.2.address:
-        "0x554723262467F125Ac9e1cDFa9Ce15cc53822dbD"
+        "0x3ffFbAdAF827559da092217e474760E2b2c3CeDd"
      issuedPermissions.0.via.1.address:
-        "0x3ffFbAdAF827559da092217e474760E2b2c3CeDd"
+        "0xE6841D92B0C345144506576eC13ECf5103aC7f49"
      issuedPermissions.0.via.1.delay:
+        259200
      issuedPermissions.0.via.0.address:
-        "0xE6841D92B0C345144506576eC13ECf5103aC7f49"
+        "0x8315177aB297bA92A06054cE80a67Ed4DBd7ed3a"
      issuedPermissions.0.via.0.delay:
-        259200
    }
```

```diff
    contract L1GatewayRouter (0x72Ce9c846789fdB6fC1f34aC4AD25Dd9ef7031ef) {
    +++ description: This routing contract maps tokens to the correct escrow (gateway) to be then bridged with canonical messaging.
      issuedPermissions.0.to:
-        "0x8315177aB297bA92A06054cE80a67Ed4DBd7ed3a"
+        "0x0B9857ae2D4A3DBe74ffE1d7DF045bb7F96E4840"
      issuedPermissions.0.via.3:
+        {"address":"0x9aD46fac0Cf7f790E5be05A0F15223935A0c0aDa"}
      issuedPermissions.0.via.2.address:
-        "0x9aD46fac0Cf7f790E5be05A0F15223935A0c0aDa"
+        "0x3ffFbAdAF827559da092217e474760E2b2c3CeDd"
      issuedPermissions.0.via.1.address:
-        "0x3ffFbAdAF827559da092217e474760E2b2c3CeDd"
+        "0xE6841D92B0C345144506576eC13ECf5103aC7f49"
      issuedPermissions.0.via.1.delay:
+        259200
      issuedPermissions.0.via.0.address:
-        "0xE6841D92B0C345144506576eC13ECf5103aC7f49"
+        "0x8315177aB297bA92A06054cE80a67Ed4DBd7ed3a"
      issuedPermissions.0.via.0.delay:
-        259200
    }
```

```diff
    contract OutboxV1 (0x760723CD2e632826c38Fef8CD438A4CC7E7E1A40) {
    +++ description: None
      issuedPermissions.0.to:
-        "0x8315177aB297bA92A06054cE80a67Ed4DBd7ed3a"
+        "0x0B9857ae2D4A3DBe74ffE1d7DF045bb7F96E4840"
      issuedPermissions.0.via.3:
+        {"address":"0x554723262467F125Ac9e1cDFa9Ce15cc53822dbD"}
      issuedPermissions.0.via.2.address:
-        "0x554723262467F125Ac9e1cDFa9Ce15cc53822dbD"
+        "0x3ffFbAdAF827559da092217e474760E2b2c3CeDd"
      issuedPermissions.0.via.1.address:
-        "0x3ffFbAdAF827559da092217e474760E2b2c3CeDd"
+        "0xE6841D92B0C345144506576eC13ECf5103aC7f49"
      issuedPermissions.0.via.1.delay:
+        259200
      issuedPermissions.0.via.0.address:
-        "0xE6841D92B0C345144506576eC13ECf5103aC7f49"
+        "0x8315177aB297bA92A06054cE80a67Ed4DBd7ed3a"
      issuedPermissions.0.via.0.delay:
-        259200
    }
```

```diff
    contract Bridge (0x8315177aB297bA92A06054cE80a67Ed4DBd7ed3a) {
    +++ description: Escrow contract for the project's gas token (can be different from ETH). Keeps a list of allowed Inboxes and Outboxes for canonical bridge messaging.
      issuedPermissions.0.to:
-        "0x8315177aB297bA92A06054cE80a67Ed4DBd7ed3a"
+        "0x0B9857ae2D4A3DBe74ffE1d7DF045bb7F96E4840"
      issuedPermissions.0.via.3:
+        {"address":"0x554723262467F125Ac9e1cDFa9Ce15cc53822dbD"}
      issuedPermissions.0.via.2.address:
-        "0x554723262467F125Ac9e1cDFa9Ce15cc53822dbD"
+        "0x3ffFbAdAF827559da092217e474760E2b2c3CeDd"
      issuedPermissions.0.via.1.address:
-        "0x3ffFbAdAF827559da092217e474760E2b2c3CeDd"
+        "0xE6841D92B0C345144506576eC13ECf5103aC7f49"
      issuedPermissions.0.via.1.delay:
+        259200
      issuedPermissions.0.via.0.address:
-        "0xE6841D92B0C345144506576eC13ECf5103aC7f49"
+        "0x8315177aB297bA92A06054cE80a67Ed4DBd7ed3a"
      issuedPermissions.0.via.0.delay:
-        259200
      receivedPermissions:
-        [{"permission":"interact","from":"0x4DCeB440657f21083db8aDd07665f8ddBe1DCfc0","description":"Pause and unpause and set important roles and parameters in the system contracts: Can delegate Sequencer management to a BatchPosterManager address, manage data availability and DACs, set the Sequencer-only window, introduce an allowList to the bridge and whitelist Inboxes/Outboxes.","via":[{"address":"0x3ffFbAdAF827559da092217e474760E2b2c3CeDd"},{"address":"0xE6841D92B0C345144506576eC13ECf5103aC7f49","delay":259200}]},{"permission":"interact","from":"0xE6841D92B0C345144506576eC13ECf5103aC7f49","description":"cancel queued transactions.","via":[{"address":"0x3ffFbAdAF827559da092217e474760E2b2c3CeDd"},{"address":"0xE6841D92B0C345144506576eC13ECf5103aC7f49","delay":259200}]},{"permission":"interact","from":"0xE6841D92B0C345144506576eC13ECf5103aC7f49","description":"propose transactions."},{"permission":"interact","from":"0xE6841D92B0C345144506576eC13ECf5103aC7f49","description":"update the minimum delay of the timelock.","via":[{"address":"0x3ffFbAdAF827559da092217e474760E2b2c3CeDd"},{"address":"0xE6841D92B0C345144506576eC13ECf5103aC7f49","delay":259200}]},{"permission":"upgrade","from":"0x0B9857ae2D4A3DBe74ffE1d7DF045bb7F96E4840","via":[{"address":"0x554723262467F125Ac9e1cDFa9Ce15cc53822dbD"},{"address":"0x3ffFbAdAF827559da092217e474760E2b2c3CeDd"},{"address":"0xE6841D92B0C345144506576eC13ECf5103aC7f49","delay":259200}]},{"permission":"upgrade","from":"0x1c479675ad559DC151F6Ec7ed3FbF8ceE79582B6","via":[{"address":"0x554723262467F125Ac9e1cDFa9Ce15cc53822dbD"},{"address":"0x3ffFbAdAF827559da092217e474760E2b2c3CeDd"},{"address":"0xE6841D92B0C345144506576eC13ECf5103aC7f49","delay":259200}]},{"permission":"upgrade","from":"0x3ffFbAdAF827559da092217e474760E2b2c3CeDd","via":[{"address":"0x5613AF0474EB9c528A34701A5b1662E3C8FA0678"},{"address":"0x3ffFbAdAF827559da092217e474760E2b2c3CeDd"},{"address":"0xE6841D92B0C345144506576eC13ECf5103aC7f49","delay":259200}]},{"permission":"upgrade","from":"0x4Dbd4fc535Ac27206064B68FfCf827b0A60BAB3f","via":[{"address":"0x554723262467F125Ac9e1cDFa9Ce15cc53822dbD"},{"address":"0x3ffFbAdAF827559da092217e474760E2b2c3CeDd"},{"address":"0xE6841D92B0C345144506576eC13ECf5103aC7f49","delay":259200}]},{"permission":"upgrade","from":"0x4DCeB440657f21083db8aDd07665f8ddBe1DCfc0","via":[{"address":"0x3ffFbAdAF827559da092217e474760E2b2c3CeDd"},{"address":"0xE6841D92B0C345144506576eC13ECf5103aC7f49","delay":259200}]},{"permission":"upgrade","from":"0x57Bd336d579A51938619271a7Cc137a46D0501B1","via":[{"address":"0x554723262467F125Ac9e1cDFa9Ce15cc53822dbD"},{"address":"0x3ffFbAdAF827559da092217e474760E2b2c3CeDd"},{"address":"0xE6841D92B0C345144506576eC13ECf5103aC7f49","delay":259200}]},{"permission":"upgrade","from":"0x667e23ABd27E623c11d4CC00ca3EC4d0bD63337a","via":[{"address":"0x554723262467F125Ac9e1cDFa9Ce15cc53822dbD"},{"address":"0x3ffFbAdAF827559da092217e474760E2b2c3CeDd"},{"address":"0xE6841D92B0C345144506576eC13ECf5103aC7f49","delay":259200}]},{"permission":"upgrade","from":"0x72Ce9c846789fdB6fC1f34aC4AD25Dd9ef7031ef","via":[{"address":"0x9aD46fac0Cf7f790E5be05A0F15223935A0c0aDa"},{"address":"0x3ffFbAdAF827559da092217e474760E2b2c3CeDd"},{"address":"0xE6841D92B0C345144506576eC13ECf5103aC7f49","delay":259200}]},{"permission":"upgrade","from":"0x760723CD2e632826c38Fef8CD438A4CC7E7E1A40","via":[{"address":"0x554723262467F125Ac9e1cDFa9Ce15cc53822dbD"},{"address":"0x3ffFbAdAF827559da092217e474760E2b2c3CeDd"},{"address":"0xE6841D92B0C345144506576eC13ECf5103aC7f49","delay":259200}]},{"permission":"upgrade","from":"0x8315177aB297bA92A06054cE80a67Ed4DBd7ed3a","via":[{"address":"0x554723262467F125Ac9e1cDFa9Ce15cc53822dbD"},{"address":"0x3ffFbAdAF827559da092217e474760E2b2c3CeDd"},{"address":"0xE6841D92B0C345144506576eC13ECf5103aC7f49","delay":259200}]},{"permission":"upgrade","from":"0xa3A7B6F88361F48403514059F1F16C8E78d60EeC","via":[{"address":"0x9aD46fac0Cf7f790E5be05A0F15223935A0c0aDa"},{"address":"0x3ffFbAdAF827559da092217e474760E2b2c3CeDd"},{"address":"0xE6841D92B0C345144506576eC13ECf5103aC7f49","delay":259200}]},{"permission":"upgrade","from":"0xA5565d266c3c3Ee90B16Be8A5b13d587ef559fB0","via":[{"address":"0x554723262467F125Ac9e1cDFa9Ce15cc53822dbD"},{"address":"0x3ffFbAdAF827559da092217e474760E2b2c3CeDd"},{"address":"0xE6841D92B0C345144506576eC13ECf5103aC7f49","delay":259200}]},{"permission":"upgrade","from":"0xcEe284F754E854890e311e3280b767F80797180d","via":[{"address":"0x9aD46fac0Cf7f790E5be05A0F15223935A0c0aDa"},{"address":"0x3ffFbAdAF827559da092217e474760E2b2c3CeDd"},{"address":"0xE6841D92B0C345144506576eC13ECf5103aC7f49","delay":259200}]},{"permission":"upgrade","from":"0xE6841D92B0C345144506576eC13ECf5103aC7f49","via":[{"address":"0x5613AF0474EB9c528A34701A5b1662E3C8FA0678"},{"address":"0x3ffFbAdAF827559da092217e474760E2b2c3CeDd"},{"address":"0xE6841D92B0C345144506576eC13ECf5103aC7f49","delay":259200}]}]
      directlyReceivedPermissions.1:
+        {"permission":"interact","from":"0xE6841D92B0C345144506576eC13ECf5103aC7f49","description":"propose transactions."}
      values.mainOutboxAddress:
+        "0x0B9857ae2D4A3DBe74ffE1d7DF045bb7F96E4840"
    }
```

```diff
-   Status: DELETED
    contract ProxyAdmin (0x9F43ab02cACc8e709b05936a92dC85b76D1523c4)
    +++ description: None
```

```diff
    contract L1ERC20Gateway (0xa3A7B6F88361F48403514059F1F16C8E78d60EeC) {
    +++ description: Escrows deposited ERC-20 assets for the canonical Bridge. Upon depositing, a generic token representation will be minted at the destination. Withdrawals are initiated by the Outbox contract.
      issuedPermissions.0.to:
-        "0x8315177aB297bA92A06054cE80a67Ed4DBd7ed3a"
+        "0x0B9857ae2D4A3DBe74ffE1d7DF045bb7F96E4840"
      issuedPermissions.0.via.3:
+        {"address":"0x9aD46fac0Cf7f790E5be05A0F15223935A0c0aDa"}
      issuedPermissions.0.via.2.address:
-        "0x9aD46fac0Cf7f790E5be05A0F15223935A0c0aDa"
+        "0x3ffFbAdAF827559da092217e474760E2b2c3CeDd"
      issuedPermissions.0.via.1.address:
-        "0x3ffFbAdAF827559da092217e474760E2b2c3CeDd"
+        "0xE6841D92B0C345144506576eC13ECf5103aC7f49"
      issuedPermissions.0.via.1.delay:
+        259200
      issuedPermissions.0.via.0.address:
-        "0xE6841D92B0C345144506576eC13ECf5103aC7f49"
+        "0x8315177aB297bA92A06054cE80a67Ed4DBd7ed3a"
      issuedPermissions.0.via.0.delay:
-        259200
    }
```

```diff
    contract EdgeChallengeManager (0xA5565d266c3c3Ee90B16Be8A5b13d587ef559fB0) {
    +++ description: Contract that implements the main challenge protocol logic of the fraud proof system.
      issuedPermissions.0.to:
-        "0x8315177aB297bA92A06054cE80a67Ed4DBd7ed3a"
+        "0x0B9857ae2D4A3DBe74ffE1d7DF045bb7F96E4840"
      issuedPermissions.0.via.3:
+        {"address":"0x554723262467F125Ac9e1cDFa9Ce15cc53822dbD"}
      issuedPermissions.0.via.2.address:
-        "0x554723262467F125Ac9e1cDFa9Ce15cc53822dbD"
+        "0x3ffFbAdAF827559da092217e474760E2b2c3CeDd"
      issuedPermissions.0.via.1.address:
-        "0x3ffFbAdAF827559da092217e474760E2b2c3CeDd"
+        "0xE6841D92B0C345144506576eC13ECf5103aC7f49"
      issuedPermissions.0.via.1.delay:
+        259200
      issuedPermissions.0.via.0.address:
-        "0xE6841D92B0C345144506576eC13ECf5103aC7f49"
+        "0x8315177aB297bA92A06054cE80a67Ed4DBd7ed3a"
      issuedPermissions.0.via.0.delay:
-        259200
    }
```

```diff
    contract L1CustomGateway (0xcEe284F754E854890e311e3280b767F80797180d) {
    +++ description: Escrows deposited assets for the canonical bridge that are externally governed or need custom token contracts with e.g. minting rights or upgradeability.
      issuedPermissions.0.to:
-        "0x8315177aB297bA92A06054cE80a67Ed4DBd7ed3a"
+        "0x0B9857ae2D4A3DBe74ffE1d7DF045bb7F96E4840"
      issuedPermissions.0.via.3:
+        {"address":"0x9aD46fac0Cf7f790E5be05A0F15223935A0c0aDa"}
      issuedPermissions.0.via.2.address:
-        "0x9aD46fac0Cf7f790E5be05A0F15223935A0c0aDa"
+        "0x3ffFbAdAF827559da092217e474760E2b2c3CeDd"
      issuedPermissions.0.via.1.address:
-        "0x3ffFbAdAF827559da092217e474760E2b2c3CeDd"
+        "0xE6841D92B0C345144506576eC13ECf5103aC7f49"
      issuedPermissions.0.via.1.delay:
+        259200
      issuedPermissions.0.via.0.address:
-        "0xE6841D92B0C345144506576eC13ECf5103aC7f49"
+        "0x8315177aB297bA92A06054cE80a67Ed4DBd7ed3a"
      issuedPermissions.0.via.0.delay:
-        259200
    }
```

```diff
    contract L1Timelock (0xE6841D92B0C345144506576eC13ECf5103aC7f49) {
    +++ description: A timelock with access control. The current minimum delay is 3d. Proposals that passed their minimum delay can be executed by the anyone.
      issuedPermissions.5.to:
-        "0x8315177aB297bA92A06054cE80a67Ed4DBd7ed3a"
+        "0x0B9857ae2D4A3DBe74ffE1d7DF045bb7F96E4840"
      issuedPermissions.5.via.3:
+        {"address":"0x5613AF0474EB9c528A34701A5b1662E3C8FA0678"}
      issuedPermissions.5.via.2.address:
-        "0x5613AF0474EB9c528A34701A5b1662E3C8FA0678"
+        "0x3ffFbAdAF827559da092217e474760E2b2c3CeDd"
      issuedPermissions.5.via.1.address:
-        "0x3ffFbAdAF827559da092217e474760E2b2c3CeDd"
+        "0xE6841D92B0C345144506576eC13ECf5103aC7f49"
      issuedPermissions.5.via.1.delay:
+        259200
      issuedPermissions.5.via.0.address:
-        "0xE6841D92B0C345144506576eC13ECf5103aC7f49"
+        "0x8315177aB297bA92A06054cE80a67Ed4DBd7ed3a"
      issuedPermissions.5.via.0.delay:
-        259200
      issuedPermissions.2.to:
-        "0x8315177aB297bA92A06054cE80a67Ed4DBd7ed3a"
+        "0x0B9857ae2D4A3DBe74ffE1d7DF045bb7F96E4840"
      issuedPermissions.2.via.2:
+        {"address":"0x3ffFbAdAF827559da092217e474760E2b2c3CeDd"}
      issuedPermissions.2.via.1.address:
-        "0x3ffFbAdAF827559da092217e474760E2b2c3CeDd"
+        "0xE6841D92B0C345144506576eC13ECf5103aC7f49"
      issuedPermissions.2.via.1.delay:
+        259200
      issuedPermissions.2.via.0.address:
-        "0xE6841D92B0C345144506576eC13ECf5103aC7f49"
+        "0x8315177aB297bA92A06054cE80a67Ed4DBd7ed3a"
      issuedPermissions.2.via.0.delay:
-        259200
      issuedPermissions.1.to:
-        "0x8315177aB297bA92A06054cE80a67Ed4DBd7ed3a"
+        "0x0B9857ae2D4A3DBe74ffE1d7DF045bb7F96E4840"
      issuedPermissions.1.via.0:
+        {"address":"0x8315177aB297bA92A06054cE80a67Ed4DBd7ed3a"}
      issuedPermissions.0.to:
-        "0x8315177aB297bA92A06054cE80a67Ed4DBd7ed3a"
+        "0x0B9857ae2D4A3DBe74ffE1d7DF045bb7F96E4840"
      issuedPermissions.0.via.2:
+        {"address":"0x3ffFbAdAF827559da092217e474760E2b2c3CeDd"}
      issuedPermissions.0.via.1.address:
-        "0x3ffFbAdAF827559da092217e474760E2b2c3CeDd"
+        "0xE6841D92B0C345144506576eC13ECf5103aC7f49"
      issuedPermissions.0.via.1.delay:
+        259200
      issuedPermissions.0.via.0.address:
-        "0xE6841D92B0C345144506576eC13ECf5103aC7f49"
+        "0x8315177aB297bA92A06054cE80a67Ed4DBd7ed3a"
      issuedPermissions.0.via.0.delay:
-        259200
    }
```

```diff
-   Status: DELETED
    contract ProxyAdmin (0xf716C9Ee355d7684Ef41d61388ed9C7B3673Bd9C)
    +++ description: None
```

Generated with discovered.json: 0x0599209835b4077475f0422fe398ff56ac0b4079

# Diff at Thu, 20 Feb 2025 12:37:16 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@e2b8072d8f4ddd728fac7a5e6cf8717962af378f block: 21815910
- current block number: 21887612

## Description

Config related: Bold templates added

## Watched changes

```diff
    contract Outbox (0x0B9857ae2D4A3DBe74ffE1d7DF045bb7F96E4840) {
    +++ description: Facilitates L2 to L1 contract calls: Messages initiated from L2 (for example withdrawal messages) eventually resolve in execution on L1.
      sourceHashes.1:
-        "0xc90d60d6db95e55c93637eee14d0d8f4034a14d5f50fc0e8561e389073c9816a"
+        "0x9e054d18af00f58f7fa36e7a0fd5b04b9dacfb8c411d84c3591e57aa72faff9d"
      values.$implementation:
-        "0x0eA7372338a589e7f0b00E463a53AA464ef04e17"
+        "0x3FFf9BdC3ce99d3D587b0d06Aa7C4a10075193b4"
      values.$pastUpgrades.1:
+        ["2025-02-12T14:00:11.000Z","0xe9788a104f8443b5900e54f8c887f0522d121487fc343a1ff90e1e6ed987967e",["0x3FFf9BdC3ce99d3D587b0d06Aa7C4a10075193b4"]]
      values.$upgradeCount:
-        1
+        2
      values.l2ToL1OutputId:
-        "0x0000000000000000000000000000000000000000000000000000000000000000"
+        "0x00000000000000000000000000000000ffffffffffffffffffffffffffffffff"
      values.rollup:
-        "0x5eF0D09d1E6204141B4d37530808eD19f60FBa35"
+        "0x4DCeB440657f21083db8aDd07665f8ddBe1DCfc0"
    }
```

```diff
-   Status: DELETED
    contract ProxyAdmin (0x0ea6999172c1B4563695F76A52de73c848587b17)
    +++ description: None
```

```diff
    contract SequencerInbox (0x1c479675ad559DC151F6Ec7ed3FbF8ceE79582B6) {
    +++ description: A sequencer (registered in this contract) can submit transaction batches or commitments here.
      sourceHashes.1:
-        "0x0bb7cd360bb26d8a487130df151eb05ce4afe4fd3452fcdbdd3cfa432e17cbb5"
+        "0x2ed1d03b24d3bd002e3beedd7f0891a044867ed42912798e50803900c26fd0b8"
      values.$implementation:
-        "0x31DA64D19Cd31A19CD09F4070366Fe2144792cf7"
+        "0x98a58ADAb0f8A66A1BF4544d804bc0475dff32c7"
      values.$pastUpgrades.5:
+        ["2025-02-12T14:00:11.000Z","0xe9788a104f8443b5900e54f8c887f0522d121487fc343a1ff90e1e6ed987967e",["0x98a58ADAb0f8A66A1BF4544d804bc0475dff32c7"]]
      values.$upgradeCount:
-        5
+        6
      values.maxTimeVariation.delayBlocks:
-        5760
+        7200
      values.reader4844:
-        "0xb5f6951AB2504442c3F6dD37fF1E1D1d253C5097"
+        "0x15b25E3fb8419dA4848a6f193bb9b43519D0d4ca"
      values.rollup:
-        "0x5eF0D09d1E6204141B4d37530808eD19f60FBa35"
+        "0x4DCeB440657f21083db8aDd07665f8ddBe1DCfc0"
      values.buffer:
+        {"bufferBlocks":14400,"max":14400,"threshold":150,"prevBlockNumber":21887498,"replenishRateInBasis":500,"prevSequencedBlockNumber":21887553}
      values.isDelayBufferable:
+        true
    }
```

```diff
-   Status: DELETED
    contract OneStepProverMath (0x2c785E954c376be0CEfF4a7Db92E053B0830F7c9)
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
```

```diff
-   Status: DELETED
    contract ProxyAdmin (0x3f92814930f43c6a1C6B133E5945E7B3338F33a6)
    +++ description: None
```

```diff
    contract UpgradeExecutor (0x3ffFbAdAF827559da092217e474760E2b2c3CeDd) {
    +++ description: Central contract defining the access control permissions for upgrading the system contract implementations.
      directlyReceivedPermissions.6.from:
-        "0x5eF0D09d1E6204141B4d37530808eD19f60FBa35"
+        "0x4DCeB440657f21083db8aDd07665f8ddBe1DCfc0"
      directlyReceivedPermissions.3.from:
-        "0x5eF0D09d1E6204141B4d37530808eD19f60FBa35"
+        "0x4DCeB440657f21083db8aDd07665f8ddBe1DCfc0"
    }
```

```diff
-   Status: DELETED
    contract ProxyAdmin (0x4561A4cDA2CB8a61ED023785bc1817fdf685dcb3)
    +++ description: None
```

```diff
    contract Inbox (0x4Dbd4fc535Ac27206064B68FfCf827b0A60BAB3f) {
    +++ description: Facilitates sending L1 to L2 messages like depositing ETH, but does not escrow funds.
      sourceHashes.1:
-        "0x6014bf86ee4c408054ad942b00365111c902b30d650ad8ed97b0cd56ca1d1e20"
+        "0x421aa98d340c2ad3e475ce29bb1e72660c213f0997591e567c0fd3d3ae2365a8"
      values.$implementation:
-        "0x5aED5f8A1e3607476F1f81c3d8fe126deB0aFE94"
+        "0x7C058ad1D0Ee415f7e7f30e62DB1BCf568470a10"
      values.$pastUpgrades.9:
+        ["2025-02-12T14:00:11.000Z","0xe9788a104f8443b5900e54f8c887f0522d121487fc343a1ff90e1e6ed987967e",["0x7C058ad1D0Ee415f7e7f30e62DB1BCf568470a10"]]
      values.$upgradeCount:
-        9
+        10
      values.getProxyAdmin:
+        "0x554723262467F125Ac9e1cDFa9Ce15cc53822dbD"
      values.maxDataSize:
+        117964
    }
```

```diff
-   Status: DELETED
    contract ProxyAdmin (0x509E3CDc218d163DB9A03678107b72e00163b061)
    +++ description: None
```

```diff
    contract ArbitrumProxyAdmin (0x554723262467F125Ac9e1cDFa9Ce15cc53822dbD) {
    +++ description: None
      directlyReceivedPermissions.7.from:
-        "0xe5896783a2F463446E1f624e64Aa6836BE4C6f58"
+        "0xA5565d266c3c3Ee90B16Be8A5b13d587ef559fB0"
    }
```

```diff
-   Status: DELETED
    contract ValidatorWallet (0x56D83349c2B8DCF74d7E92D5b6B33d0BADD52D78)
    +++ description: None
```

```diff
    contract RollupEventInbox (0x57Bd336d579A51938619271a7Cc137a46D0501B1) {
    +++ description: Helper contract sending configuration data over the bridge during the systems initialization.
      sourceHashes.1:
-        "0xcb5aa9193bb40ce04bdf027377926cf735cd52ee9823923cb55fce302ad76513"
+        "0x6ce471861570d55dc6e9a09337d990c13efb0c7abb47f36a5de48a9a7086f6e8"
      values.$implementation:
-        "0x806421D09cDb253aa9d128a658e60c0B95eFFA01"
+        "0x6D576E220Cb44C3E8eF75D0EfBeb1Ff041e2E4A5"
      values.$pastUpgrades.1:
+        ["2025-02-12T14:00:11.000Z","0xe9788a104f8443b5900e54f8c887f0522d121487fc343a1ff90e1e6ed987967e",["0x6D576E220Cb44C3E8eF75D0EfBeb1Ff041e2E4A5"]]
      values.$upgradeCount:
-        1
+        2
      values.rollup:
-        "0x5eF0D09d1E6204141B4d37530808eD19f60FBa35"
+        "0x4DCeB440657f21083db8aDd07665f8ddBe1DCfc0"
    }
```

```diff
-   Status: DELETED
    contract OneStepProverMemory (0x5C9F8663583Ad0A1c0009c871f8253DBF4767A18)
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
```

```diff
-   Status: DELETED
    contract RollupProxy (0x5eF0D09d1E6204141B4d37530808eD19f60FBa35)
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
```

```diff
-   Status: DELETED
    contract Validator (0x758C6bB08B3ea5889B5cddbdeF9A45b3a983c398)
    +++ description: None
```

```diff
-   Status: DELETED
    contract ValidatorWallet (0x7CF3d537733F6Ba4183A833c9B021265716cE9d0)
    +++ description: None
```

```diff
    contract Bridge (0x8315177aB297bA92A06054cE80a67Ed4DBd7ed3a) {
    +++ description: Escrow contract for the project's gas token (can be different from ETH). Keeps a list of allowed Inboxes and Outboxes for canonical bridge messaging.
      template:
-        "orbitstack/ArbitrumBridge"
+        "orbitstack/Bridge"
      sourceHashes.1:
-        "0x5dbde25ce90571f7dd8e189ec68615bd76cab9ddb0ba7690b721e9e03c70b6ed"
+        "0xbce819ea96dfba398ca731b4457e9b9a01621df028c459eb74b15b6a687130b1"
      description:
-        "Contract used to relay governance action messages from Arbitrum One to Ethereum. It is also an escrow contract for the project's gas token (can be different from ETH). Keeps a list of allowed Inboxes and Outboxes for canonical bridge messaging."
+        "Escrow contract for the project's gas token (can be different from ETH). Keeps a list of allowed Inboxes and Outboxes for canonical bridge messaging."
      receivedPermissions.16.from:
-        "0xe5896783a2F463446E1f624e64Aa6836BE4C6f58"
+        "0xcEe284F754E854890e311e3280b767F80797180d"
      receivedPermissions.16.via.0.address:
-        "0x554723262467F125Ac9e1cDFa9Ce15cc53822dbD"
+        "0x9aD46fac0Cf7f790E5be05A0F15223935A0c0aDa"
      receivedPermissions.15.from:
-        "0xcEe284F754E854890e311e3280b767F80797180d"
+        "0xA5565d266c3c3Ee90B16Be8A5b13d587ef559fB0"
      receivedPermissions.15.via.0.address:
-        "0x9aD46fac0Cf7f790E5be05A0F15223935A0c0aDa"
+        "0x554723262467F125Ac9e1cDFa9Ce15cc53822dbD"
      receivedPermissions.9.from:
-        "0x5eF0D09d1E6204141B4d37530808eD19f60FBa35"
+        "0x57Bd336d579A51938619271a7Cc137a46D0501B1"
      receivedPermissions.9.via.2:
+        {"address":"0xE6841D92B0C345144506576eC13ECf5103aC7f49","delay":259200}
      receivedPermissions.9.via.1.address:
-        "0xE6841D92B0C345144506576eC13ECf5103aC7f49"
+        "0x3ffFbAdAF827559da092217e474760E2b2c3CeDd"
      receivedPermissions.9.via.1.delay:
-        259200
      receivedPermissions.9.via.0.address:
-        "0x3ffFbAdAF827559da092217e474760E2b2c3CeDd"
+        "0x554723262467F125Ac9e1cDFa9Ce15cc53822dbD"
      receivedPermissions.8.from:
-        "0x57Bd336d579A51938619271a7Cc137a46D0501B1"
+        "0x4DCeB440657f21083db8aDd07665f8ddBe1DCfc0"
      receivedPermissions.8.via.2:
-        {"address":"0xE6841D92B0C345144506576eC13ECf5103aC7f49","delay":259200}
      receivedPermissions.8.via.1.address:
-        "0x3ffFbAdAF827559da092217e474760E2b2c3CeDd"
+        "0xE6841D92B0C345144506576eC13ECf5103aC7f49"
      receivedPermissions.8.via.1.delay:
+        259200
      receivedPermissions.8.via.0.address:
-        "0x554723262467F125Ac9e1cDFa9Ce15cc53822dbD"
+        "0x3ffFbAdAF827559da092217e474760E2b2c3CeDd"
      receivedPermissions.0.from:
-        "0x5eF0D09d1E6204141B4d37530808eD19f60FBa35"
+        "0x4DCeB440657f21083db8aDd07665f8ddBe1DCfc0"
      values.$implementation:
-        "0x1066CEcC8880948FE55e427E94F1FF221d626591"
+        "0x93e8f92327bFa8096F5F6ee5f2a49183D3B3b898"
      values.$pastUpgrades.2:
+        ["2025-02-12T14:00:11.000Z","0xe9788a104f8443b5900e54f8c887f0522d121487fc343a1ff90e1e6ed987967e",["0x93e8f92327bFa8096F5F6ee5f2a49183D3B3b898"]]
      values.$upgradeCount:
-        2
+        3
      values.rollup:
-        "0x5eF0D09d1E6204141B4d37530808eD19f60FBa35"
+        "0x4DCeB440657f21083db8aDd07665f8ddBe1DCfc0"
    }
```

```diff
-   Status: DELETED
    contract ValidatorWallet (0x83215480dB2C6A7E56f9E99EF93AB9B36F8A3DD5)
    +++ description: None
```

```diff
-   Status: DELETED
    contract OneStepProverHostIo (0x8D78382913467Cd25374C75BA918b0A723Bc2544)
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
```

```diff
-   Status: DELETED
    contract ValidatorUtils (0x9E40625F52829Cf04bC4839F186D621ee33b0E67)
    +++ description: This contract implements view only utilities for validators.
```

```diff
-   Status: DELETED
    contract OneStepProofEntry (0xa328BAF257A937b7934429a5d8458d98693C6FC7)
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
```

```diff
-   Status: DELETED
    contract ProxyAdmin (0xAb33350E0319466A81D2AE6DC5CdF2518123f766)
    +++ description: None
```

```diff
-   Status: DELETED
    contract ValidatorWallet (0xB0CB1384e3f4a9a9b2447e39b05e10631E1D34B0)
    +++ description: None
```

```diff
-   Status: DELETED
    contract ValidatorOwnerMultisig (0xC234E41AE2cb00311956Aa7109fC801ae8c80941)
    +++ description: None
```

```diff
-   Status: DELETED
    contract ProxyAdmin (0xCcadc6B174BEcf31a35b818373e90391971a1C0c)
    +++ description: None
```

```diff
-   Status: DELETED
    contract OneStepProver0 (0xD0465e3356213869f1Fae38b3E67CBF4E873c5B6)
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
```

```diff
-   Status: DELETED
    contract ChallengeManager (0xe5896783a2F463446E1f624e64Aa6836BE4C6f58)
    +++ description: Contract that allows challenging state roots. Can be called through the RollupProxy by Validators or the UpgradeExecutor.
```

```diff
    contract SecurityCouncil (0xF06E95eF589D9c38af242a8AAee8375f14023F85) {
    +++ description: None
      receivedPermissions.15.from:
-        "0xe5896783a2F463446E1f624e64Aa6836BE4C6f58"
+        "0xcEe284F754E854890e311e3280b767F80797180d"
      receivedPermissions.15.via.0.address:
-        "0x554723262467F125Ac9e1cDFa9Ce15cc53822dbD"
+        "0x9aD46fac0Cf7f790E5be05A0F15223935A0c0aDa"
      receivedPermissions.14.from:
-        "0xcEe284F754E854890e311e3280b767F80797180d"
+        "0xA5565d266c3c3Ee90B16Be8A5b13d587ef559fB0"
      receivedPermissions.14.via.0.address:
-        "0x9aD46fac0Cf7f790E5be05A0F15223935A0c0aDa"
+        "0x554723262467F125Ac9e1cDFa9Ce15cc53822dbD"
      receivedPermissions.8.from:
-        "0x5eF0D09d1E6204141B4d37530808eD19f60FBa35"
+        "0x57Bd336d579A51938619271a7Cc137a46D0501B1"
      receivedPermissions.8.via.1:
+        {"address":"0x3ffFbAdAF827559da092217e474760E2b2c3CeDd"}
      receivedPermissions.8.via.0.address:
-        "0x3ffFbAdAF827559da092217e474760E2b2c3CeDd"
+        "0x554723262467F125Ac9e1cDFa9Ce15cc53822dbD"
      receivedPermissions.7.from:
-        "0x57Bd336d579A51938619271a7Cc137a46D0501B1"
+        "0x4DCeB440657f21083db8aDd07665f8ddBe1DCfc0"
      receivedPermissions.7.via.1:
-        {"address":"0x3ffFbAdAF827559da092217e474760E2b2c3CeDd"}
      receivedPermissions.7.via.0.address:
-        "0x554723262467F125Ac9e1cDFa9Ce15cc53822dbD"
+        "0x3ffFbAdAF827559da092217e474760E2b2c3CeDd"
      receivedPermissions.0.from:
-        "0x5eF0D09d1E6204141B4d37530808eD19f60FBa35"
+        "0x4DCeB440657f21083db8aDd07665f8ddBe1DCfc0"
    }
```

```diff
-   Status: DELETED
    contract ValidatorWallet (0xf59caf75e8A4bFBA4e6e07aD86C7E498E4d2519b)
    +++ description: None
```

```diff
+   Status: CREATED
    contract OneStepProver0 (0x35FBC5F03d86E88973B06Fb9C5a913D54AbdF731)
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
```

```diff
+   Status: CREATED
    contract ParentToChildRewardRouter (0x40Cd7D713D7ae463f95cE5d342Ea6E7F5cF7C999)
    +++ description: Collects the excess stake when rival nodes are created and allows to send them to the L2 treasury.
```

```diff
+   Status: CREATED
    contract OneStepProofEntry (0x4397fE1E959Ba81B9D5f1A9679Ddd891955A42d6)
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
```

```diff
+   Status: CREATED
    contract RollupProxy (0x4DCeB440657f21083db8aDd07665f8ddBe1DCfc0)
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new assertions (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both called Validators).
```

```diff
+   Status: CREATED
    contract OneStepProverHostIo (0xa07cD154340CC74EcF156FFB9fb378Ee29Ca71Cf)
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
```

```diff
+   Status: CREATED
    contract EdgeChallengeManager (0xA5565d266c3c3Ee90B16Be8A5b13d587ef559fB0)
    +++ description: Contract that implements the main challenge protocol logic of the fraud proof system.
```

```diff
+   Status: CREATED
    contract OneStepProverMath (0xaB9596a0aaF28bc798c453434EC2DC0F8F0bF921)
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
```

```diff
+   Status: CREATED
    contract OneStepProverMemory (0xe0ba77e0E24de5369e3B268Ea79fDe716e2EC48b)
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
```

## Source code changes

```diff
.../{.flat@21815910 => .flat}/Bridge/Bridge.sol    |  579 ++-
 .../ChallengeManager.sol => /dev/null              |  994 -----
 .../TransparentUpgradeableProxy.p.sol => /dev/null |  629 ---
 .../EdgeChallengeManager/EdgeChallengeManager.sol  | 3193 ++++++++++++++
 .../TransparentUpgradeableProxy.p.sol              |   18 +-
 .../{.flat@21815910 => .flat}/Inbox/Inbox.sol      | 1450 +++---
 .../OneStepProofEntry.sol                          |  656 +--
 .../{.flat@21815910 => .flat}/OneStepProver0.sol   |  502 ++-
 .../OneStepProverHostIo.sol                        |  643 +--
 .../OneStepProverMath.sol                          |  101 +-
 .../OneStepProverMemory.sol                        |  421 +-
 .../{.flat@21815910 => .flat}/Outbox/Outbox.sol    |  332 +-
 .../ethereum/.flat/ParentToChildRewardRouter.sol   |  514 +++
 .../dev/null                                       |  140 -
 .../dev/null                                       |  140 -
 .../dev/null                                       |  140 -
 .../dev/null                                       |  140 -
 .../dev/null                                       |  132 -
 .../dev/null                                       |  140 -
 .../RollupEventInbox/RollupEventInbox.sol          |  115 +-
 .../RollupProxy/RollupAdminLogic.1.sol             | 2739 ++++++------
 .../RollupProxy/RollupProxy.p.sol                  |  106 +-
 .../RollupProxy/RollupUserLogic.2.sol              | 4620 ++++++++++----------
 .../SequencerInbox/SequencerInbox.sol              | 1008 +++--
 .../TransparentUpgradeableProxy.p.sol => /dev/null |  443 --
 .../Validator/Validator.sol => /dev/null           |  554 ---
 .../GnosisSafe.sol => /dev/null                    |  953 ----
 .../GnosisSafeProxy.p.sol => /dev/null             |   35 -
 .../.flat@21815910/ValidatorUtils.sol => /dev/null |  323 --
 .../ValidatorWallet.sol => /dev/null               |  769 ----
 .../TransparentUpgradeableProxy.p.sol => /dev/null |  629 ---
 .../ValidatorWallet.sol => /dev/null               |  769 ----
 .../TransparentUpgradeableProxy.p.sol => /dev/null |  629 ---
 .../ValidatorWallet.sol => /dev/null               |  769 ----
 .../TransparentUpgradeableProxy.p.sol => /dev/null |  629 ---
 .../ValidatorWallet.sol => /dev/null               |  769 ----
 .../TransparentUpgradeableProxy.p.sol => /dev/null |  629 ---
 .../ValidatorWallet.sol => /dev/null               |  769 ----
 38 files changed, 11011 insertions(+), 17110 deletions(-)
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21815910 (main branch discovery), not current.

```diff
    contract RollupProxy (0x5eF0D09d1E6204141B4d37530808eD19f60FBa35) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      values.isPostBoLD:
+        false
    }
```

Generated with discovered.json: 0x199f45c208ed1e8e6ec0d90b461838a057d5fa5e

# Diff at Wed, 12 Feb 2025 18:43:34 GMT:

- author: vincfurc (<10850139+vincfurc@users.noreply.github.com>)
- comparing to: main@2b0c549e9be2ec1627969531e2ff05c01d31a788 block: 21802817
- current block number: 21815910

## Description

Make Arbitrum discovery driven.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21802817 (main branch discovery), not current.

```diff
    contract Outbox (0x0B9857ae2D4A3DBe74ffE1d7DF045bb7F96E4840) {
    +++ description: Facilitates L2 to L1 contract calls: Messages initiated from L2 (for example withdrawal messages) eventually resolve in execution on L1.
      issuedPermissions.1:
+        {"permission":"upgrade","to":"0xF06E95eF589D9c38af242a8AAee8375f14023F85","via":[{"address":"0x3ffFbAdAF827559da092217e474760E2b2c3CeDd"},{"address":"0x554723262467F125Ac9e1cDFa9Ce15cc53822dbD"}]}
      issuedPermissions.0.to:
-        "0xE6841D92B0C345144506576eC13ECf5103aC7f49"
+        "0x8315177aB297bA92A06054cE80a67Ed4DBd7ed3a"
      issuedPermissions.0.via.2:
+        {"address":"0x554723262467F125Ac9e1cDFa9Ce15cc53822dbD"}
      issuedPermissions.0.via.1.address:
-        "0x554723262467F125Ac9e1cDFa9Ce15cc53822dbD"
+        "0x3ffFbAdAF827559da092217e474760E2b2c3CeDd"
      issuedPermissions.0.via.0.address:
-        "0x3ffFbAdAF827559da092217e474760E2b2c3CeDd"
+        "0xE6841D92B0C345144506576eC13ECf5103aC7f49"
      issuedPermissions.0.via.0.delay:
+        259200
    }
```

```diff
    contract SequencerInbox (0x1c479675ad559DC151F6Ec7ed3FbF8ceE79582B6) {
    +++ description: A sequencer (registered in this contract) can submit transaction batches or commitments here.
      issuedPermissions.4:
+        {"permission":"upgrade","to":"0xF06E95eF589D9c38af242a8AAee8375f14023F85","via":[{"address":"0x3ffFbAdAF827559da092217e474760E2b2c3CeDd"},{"address":"0x554723262467F125Ac9e1cDFa9Ce15cc53822dbD"}]}
      issuedPermissions.3.to:
-        "0xE6841D92B0C345144506576eC13ECf5103aC7f49"
+        "0x8315177aB297bA92A06054cE80a67Ed4DBd7ed3a"
      issuedPermissions.3.via.2:
+        {"address":"0x554723262467F125Ac9e1cDFa9Ce15cc53822dbD"}
      issuedPermissions.3.via.1.address:
-        "0x554723262467F125Ac9e1cDFa9Ce15cc53822dbD"
+        "0x3ffFbAdAF827559da092217e474760E2b2c3CeDd"
      issuedPermissions.3.via.0.address:
-        "0x3ffFbAdAF827559da092217e474760E2b2c3CeDd"
+        "0xE6841D92B0C345144506576eC13ECf5103aC7f49"
      issuedPermissions.3.via.0.delay:
+        259200
    }
```

```diff
    contract UpgradeExecutor (0x3ffFbAdAF827559da092217e474760E2b2c3CeDd) {
    +++ description: Central contract defining the access control permissions for upgrading the system contract implementations.
      issuedPermissions.1:
+        {"permission":"upgrade","to":"0xF06E95eF589D9c38af242a8AAee8375f14023F85","via":[{"address":"0x3ffFbAdAF827559da092217e474760E2b2c3CeDd"},{"address":"0x5613AF0474EB9c528A34701A5b1662E3C8FA0678"}]}
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
      directlyReceivedPermissions.6:
+        {"permission":"upgrade","from":"0x5eF0D09d1E6204141B4d37530808eD19f60FBa35"}
      directlyReceivedPermissions.5.permission:
-        "upgrade"
+        "interact"
      directlyReceivedPermissions.5.from:
-        "0x5eF0D09d1E6204141B4d37530808eD19f60FBa35"
+        "0xE6841D92B0C345144506576eC13ECf5103aC7f49"
      directlyReceivedPermissions.5.description:
+        "update the minimum delay of the timelock."
      directlyReceivedPermissions.4.from:
-        "0x5eF0D09d1E6204141B4d37530808eD19f60FBa35"
+        "0xE6841D92B0C345144506576eC13ECf5103aC7f49"
      directlyReceivedPermissions.4.description:
-        "Pause and unpause and set important roles and parameters in the system contracts: Can delegate Sequencer management to a BatchPosterManager address, manage data availability and DACs, set the Sequencer-only window, introduce an allowList to the bridge and whitelist Inboxes/Outboxes."
+        "cancel queued transactions."
      directlyReceivedPermissions.3.permission:
-        "act"
+        "interact"
      directlyReceivedPermissions.3.from:
-        "0xF06E95eF589D9c38af242a8AAee8375f14023F85"
+        "0x5eF0D09d1E6204141B4d37530808eD19f60FBa35"
      directlyReceivedPermissions.3.description:
+        "Pause and unpause and set important roles and parameters in the system contracts: Can delegate Sequencer management to a BatchPosterManager address, manage data availability and DACs, set the Sequencer-only window, introduce an allowList to the bridge and whitelist Inboxes/Outboxes."
    }
```

```diff
    contract Inbox (0x4Dbd4fc535Ac27206064B68FfCf827b0A60BAB3f) {
    +++ description: Facilitates sending L1 to L2 messages like depositing ETH, but does not escrow funds.
      issuedPermissions.1:
+        {"permission":"upgrade","to":"0xF06E95eF589D9c38af242a8AAee8375f14023F85","via":[{"address":"0x3ffFbAdAF827559da092217e474760E2b2c3CeDd"},{"address":"0x554723262467F125Ac9e1cDFa9Ce15cc53822dbD"}]}
      issuedPermissions.0.to:
-        "0xE6841D92B0C345144506576eC13ECf5103aC7f49"
+        "0x8315177aB297bA92A06054cE80a67Ed4DBd7ed3a"
      issuedPermissions.0.via.2:
+        {"address":"0x554723262467F125Ac9e1cDFa9Ce15cc53822dbD"}
      issuedPermissions.0.via.1.address:
-        "0x554723262467F125Ac9e1cDFa9Ce15cc53822dbD"
+        "0x3ffFbAdAF827559da092217e474760E2b2c3CeDd"
      issuedPermissions.0.via.0.address:
-        "0x3ffFbAdAF827559da092217e474760E2b2c3CeDd"
+        "0xE6841D92B0C345144506576eC13ECf5103aC7f49"
      issuedPermissions.0.via.0.delay:
+        259200
    }
```

```diff
    contract RollupEventInbox (0x57Bd336d579A51938619271a7Cc137a46D0501B1) {
    +++ description: Helper contract sending configuration data over the bridge during the systems initialization.
      issuedPermissions.1:
+        {"permission":"upgrade","to":"0xF06E95eF589D9c38af242a8AAee8375f14023F85","via":[{"address":"0x3ffFbAdAF827559da092217e474760E2b2c3CeDd"},{"address":"0x554723262467F125Ac9e1cDFa9Ce15cc53822dbD"}]}
      issuedPermissions.0.to:
-        "0xE6841D92B0C345144506576eC13ECf5103aC7f49"
+        "0x8315177aB297bA92A06054cE80a67Ed4DBd7ed3a"
      issuedPermissions.0.via.2:
+        {"address":"0x554723262467F125Ac9e1cDFa9Ce15cc53822dbD"}
      issuedPermissions.0.via.1.address:
-        "0x554723262467F125Ac9e1cDFa9Ce15cc53822dbD"
+        "0x3ffFbAdAF827559da092217e474760E2b2c3CeDd"
      issuedPermissions.0.via.0.address:
-        "0x3ffFbAdAF827559da092217e474760E2b2c3CeDd"
+        "0xE6841D92B0C345144506576eC13ECf5103aC7f49"
      issuedPermissions.0.via.0.delay:
+        259200
    }
```

```diff
    contract RollupProxy (0x5eF0D09d1E6204141B4d37530808eD19f60FBa35) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      issuedPermissions.17:
+        {"permission":"validate","to":"0xF8D3E1cF58386c92B27710C6a0D8A54c76BC6ab5","description":"Can propose new state roots (called nodes) and challenge state roots on the host chain.","via":[]}
      issuedPermissions.16:
+        {"permission":"validate","to":"0xf59caf75e8A4bFBA4e6e07aD86C7E498E4d2519b","description":"Can propose new state roots (called nodes) and challenge state roots on the host chain.","via":[]}
      issuedPermissions.15.to:
-        "0xF8D3E1cF58386c92B27710C6a0D8A54c76BC6ab5"
+        "0xdDf2F71Ab206C0138A8eceEb54386567D5abF01E"
      issuedPermissions.14.to:
-        "0xf59caf75e8A4bFBA4e6e07aD86C7E498E4d2519b"
+        "0xB51EDdfc9A945e2B909905e4F242C4796Ac0C61d"
      issuedPermissions.13.to:
-        "0xdDf2F71Ab206C0138A8eceEb54386567D5abF01E"
+        "0xB0CB1384e3f4a9a9b2447e39b05e10631E1D34B0"
      issuedPermissions.12.to:
-        "0xB51EDdfc9A945e2B909905e4F242C4796Ac0C61d"
+        "0xAB1A39332e934300eBCc57B5f95cA90631a347FF"
      issuedPermissions.11.to:
-        "0xB0CB1384e3f4a9a9b2447e39b05e10631E1D34B0"
+        "0x83215480dB2C6A7E56f9E99EF93AB9B36F8A3DD5"
      issuedPermissions.10.to:
-        "0xAB1A39332e934300eBCc57B5f95cA90631a347FF"
+        "0x7CF3d537733F6Ba4183A833c9B021265716cE9d0"
      issuedPermissions.9.to:
-        "0x83215480dB2C6A7E56f9E99EF93AB9B36F8A3DD5"
+        "0x758C6bB08B3ea5889B5cddbdeF9A45b3a983c398"
      issuedPermissions.8.to:
-        "0x7CF3d537733F6Ba4183A833c9B021265716cE9d0"
+        "0x6Fb914de4653eC5592B7c15F4d9466Cbd03F2104"
      issuedPermissions.7.to:
-        "0x758C6bB08B3ea5889B5cddbdeF9A45b3a983c398"
+        "0x610Aa279989F440820e14248BD3879B148717974"
      issuedPermissions.6.to:
-        "0x6Fb914de4653eC5592B7c15F4d9466Cbd03F2104"
+        "0x56D83349c2B8DCF74d7E92D5b6B33d0BADD52D78"
      issuedPermissions.5.to:
-        "0x610Aa279989F440820e14248BD3879B148717974"
+        "0x54c0D3d6C101580dB3be8763A2aE2c6bb9dc840c"
      issuedPermissions.4.to:
-        "0x56D83349c2B8DCF74d7E92D5b6B33d0BADD52D78"
+        "0x0fF813f6BD577c3D1cDbE435baC0621BE6aE34B4"
      issuedPermissions.3.permission:
-        "validate"
+        "upgrade"
      issuedPermissions.3.to:
-        "0x54c0D3d6C101580dB3be8763A2aE2c6bb9dc840c"
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
+        "0x8315177aB297bA92A06054cE80a67Ed4DBd7ed3a"
      issuedPermissions.2.description:
-        "Can propose new state roots (called nodes) and challenge state roots on the host chain."
      issuedPermissions.2.via.1:
+        {"address":"0x3ffFbAdAF827559da092217e474760E2b2c3CeDd"}
      issuedPermissions.2.via.0:
+        {"address":"0xE6841D92B0C345144506576eC13ECf5103aC7f49","delay":259200}
      issuedPermissions.1.permission:
-        "upgrade"
+        "interact"
      issuedPermissions.1.to:
-        "0xE6841D92B0C345144506576eC13ECf5103aC7f49"
+        "0xF06E95eF589D9c38af242a8AAee8375f14023F85"
      issuedPermissions.1.description:
+        "Pause and unpause and set important roles and parameters in the system contracts: Can delegate Sequencer management to a BatchPosterManager address, manage data availability and DACs, set the Sequencer-only window, introduce an allowList to the bridge and whitelist Inboxes/Outboxes."
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
    contract OutboxV0 (0x667e23ABd27E623c11d4CC00ca3EC4d0bD63337a) {
    +++ description: None
      issuedPermissions.1:
+        {"permission":"upgrade","to":"0xF06E95eF589D9c38af242a8AAee8375f14023F85","via":[{"address":"0x3ffFbAdAF827559da092217e474760E2b2c3CeDd"},{"address":"0x554723262467F125Ac9e1cDFa9Ce15cc53822dbD"}]}
      issuedPermissions.0.to:
-        "0xE6841D92B0C345144506576eC13ECf5103aC7f49"
+        "0x8315177aB297bA92A06054cE80a67Ed4DBd7ed3a"
      issuedPermissions.0.via.2:
+        {"address":"0x554723262467F125Ac9e1cDFa9Ce15cc53822dbD"}
      issuedPermissions.0.via.1.address:
-        "0x554723262467F125Ac9e1cDFa9Ce15cc53822dbD"
+        "0x3ffFbAdAF827559da092217e474760E2b2c3CeDd"
      issuedPermissions.0.via.0.address:
-        "0x3ffFbAdAF827559da092217e474760E2b2c3CeDd"
+        "0xE6841D92B0C345144506576eC13ECf5103aC7f49"
      issuedPermissions.0.via.0.delay:
+        259200
    }
```

```diff
    contract L1GatewayRouter (0x72Ce9c846789fdB6fC1f34aC4AD25Dd9ef7031ef) {
    +++ description: This routing contract maps tokens to the correct escrow (gateway) to be then bridged with canonical messaging.
      issuedPermissions.1:
+        {"permission":"upgrade","to":"0xF06E95eF589D9c38af242a8AAee8375f14023F85","via":[{"address":"0x3ffFbAdAF827559da092217e474760E2b2c3CeDd"},{"address":"0x9aD46fac0Cf7f790E5be05A0F15223935A0c0aDa"}]}
      issuedPermissions.0.to:
-        "0xE6841D92B0C345144506576eC13ECf5103aC7f49"
+        "0x8315177aB297bA92A06054cE80a67Ed4DBd7ed3a"
      issuedPermissions.0.via.2:
+        {"address":"0x9aD46fac0Cf7f790E5be05A0F15223935A0c0aDa"}
      issuedPermissions.0.via.1.address:
-        "0x9aD46fac0Cf7f790E5be05A0F15223935A0c0aDa"
+        "0x3ffFbAdAF827559da092217e474760E2b2c3CeDd"
      issuedPermissions.0.via.0.address:
-        "0x3ffFbAdAF827559da092217e474760E2b2c3CeDd"
+        "0xE6841D92B0C345144506576eC13ECf5103aC7f49"
      issuedPermissions.0.via.0.delay:
+        259200
    }
```

```diff
    contract OutboxV1 (0x760723CD2e632826c38Fef8CD438A4CC7E7E1A40) {
    +++ description: None
      issuedPermissions.1:
+        {"permission":"upgrade","to":"0xF06E95eF589D9c38af242a8AAee8375f14023F85","via":[{"address":"0x3ffFbAdAF827559da092217e474760E2b2c3CeDd"},{"address":"0x554723262467F125Ac9e1cDFa9Ce15cc53822dbD"}]}
      issuedPermissions.0.to:
-        "0xE6841D92B0C345144506576eC13ECf5103aC7f49"
+        "0x8315177aB297bA92A06054cE80a67Ed4DBd7ed3a"
      issuedPermissions.0.via.2:
+        {"address":"0x554723262467F125Ac9e1cDFa9Ce15cc53822dbD"}
      issuedPermissions.0.via.1.address:
-        "0x554723262467F125Ac9e1cDFa9Ce15cc53822dbD"
+        "0x3ffFbAdAF827559da092217e474760E2b2c3CeDd"
      issuedPermissions.0.via.0.address:
-        "0x3ffFbAdAF827559da092217e474760E2b2c3CeDd"
+        "0xE6841D92B0C345144506576eC13ECf5103aC7f49"
      issuedPermissions.0.via.0.delay:
+        259200
    }
```

```diff
    contract Bridge (0x8315177aB297bA92A06054cE80a67Ed4DBd7ed3a) {
    +++ description: Contract used to relay governance action messages from Arbitrum One to Ethereum. It is also an escrow contract for the project's gas token (can be different from ETH). Keeps a list of allowed Inboxes and Outboxes for canonical bridge messaging.
      template:
-        "orbitstack/Bridge"
+        "orbitstack/ArbitrumBridge"
      description:
-        "Escrow contract for the project's gas token (can be different from ETH). Keeps a list of allowed Inboxes and Outboxes for canonical bridge messaging."
+        "Contract used to relay governance action messages from Arbitrum One to Ethereum. It is also an escrow contract for the project's gas token (can be different from ETH). Keeps a list of allowed Inboxes and Outboxes for canonical bridge messaging."
      issuedPermissions.1:
+        {"permission":"upgrade","to":"0xF06E95eF589D9c38af242a8AAee8375f14023F85","via":[{"address":"0x3ffFbAdAF827559da092217e474760E2b2c3CeDd"},{"address":"0x554723262467F125Ac9e1cDFa9Ce15cc53822dbD"}]}
      issuedPermissions.0.to:
-        "0xE6841D92B0C345144506576eC13ECf5103aC7f49"
+        "0x8315177aB297bA92A06054cE80a67Ed4DBd7ed3a"
      issuedPermissions.0.via.2:
+        {"address":"0x554723262467F125Ac9e1cDFa9Ce15cc53822dbD"}
      issuedPermissions.0.via.1.address:
-        "0x554723262467F125Ac9e1cDFa9Ce15cc53822dbD"
+        "0x3ffFbAdAF827559da092217e474760E2b2c3CeDd"
      issuedPermissions.0.via.0.address:
-        "0x3ffFbAdAF827559da092217e474760E2b2c3CeDd"
+        "0xE6841D92B0C345144506576eC13ECf5103aC7f49"
      issuedPermissions.0.via.0.delay:
+        259200
      receivedPermissions:
+        [{"permission":"interact","from":"0x5eF0D09d1E6204141B4d37530808eD19f60FBa35","description":"Pause and unpause and set important roles and parameters in the system contracts: Can delegate Sequencer management to a BatchPosterManager address, manage data availability and DACs, set the Sequencer-only window, introduce an allowList to the bridge and whitelist Inboxes/Outboxes.","via":[{"address":"0x3ffFbAdAF827559da092217e474760E2b2c3CeDd"},{"address":"0xE6841D92B0C345144506576eC13ECf5103aC7f49","delay":259200}]},{"permission":"interact","from":"0xE6841D92B0C345144506576eC13ECf5103aC7f49","description":"cancel queued transactions.","via":[{"address":"0x3ffFbAdAF827559da092217e474760E2b2c3CeDd"},{"address":"0xE6841D92B0C345144506576eC13ECf5103aC7f49","delay":259200}]},{"permission":"interact","from":"0xE6841D92B0C345144506576eC13ECf5103aC7f49","description":"propose transactions."},{"permission":"interact","from":"0xE6841D92B0C345144506576eC13ECf5103aC7f49","description":"update the minimum delay of the timelock.","via":[{"address":"0x3ffFbAdAF827559da092217e474760E2b2c3CeDd"},{"address":"0xE6841D92B0C345144506576eC13ECf5103aC7f49","delay":259200}]},{"permission":"upgrade","from":"0x0B9857ae2D4A3DBe74ffE1d7DF045bb7F96E4840","via":[{"address":"0x554723262467F125Ac9e1cDFa9Ce15cc53822dbD"},{"address":"0x3ffFbAdAF827559da092217e474760E2b2c3CeDd"},{"address":"0xE6841D92B0C345144506576eC13ECf5103aC7f49","delay":259200}]},{"permission":"upgrade","from":"0x1c479675ad559DC151F6Ec7ed3FbF8ceE79582B6","via":[{"address":"0x554723262467F125Ac9e1cDFa9Ce15cc53822dbD"},{"address":"0x3ffFbAdAF827559da092217e474760E2b2c3CeDd"},{"address":"0xE6841D92B0C345144506576eC13ECf5103aC7f49","delay":259200}]},{"permission":"upgrade","from":"0x3ffFbAdAF827559da092217e474760E2b2c3CeDd","via":[{"address":"0x5613AF0474EB9c528A34701A5b1662E3C8FA0678"},{"address":"0x3ffFbAdAF827559da092217e474760E2b2c3CeDd"},{"address":"0xE6841D92B0C345144506576eC13ECf5103aC7f49","delay":259200}]},{"permission":"upgrade","from":"0x4Dbd4fc535Ac27206064B68FfCf827b0A60BAB3f","via":[{"address":"0x554723262467F125Ac9e1cDFa9Ce15cc53822dbD"},{"address":"0x3ffFbAdAF827559da092217e474760E2b2c3CeDd"},{"address":"0xE6841D92B0C345144506576eC13ECf5103aC7f49","delay":259200}]},{"permission":"upgrade","from":"0x57Bd336d579A51938619271a7Cc137a46D0501B1","via":[{"address":"0x554723262467F125Ac9e1cDFa9Ce15cc53822dbD"},{"address":"0x3ffFbAdAF827559da092217e474760E2b2c3CeDd"},{"address":"0xE6841D92B0C345144506576eC13ECf5103aC7f49","delay":259200}]},{"permission":"upgrade","from":"0x5eF0D09d1E6204141B4d37530808eD19f60FBa35","via":[{"address":"0x3ffFbAdAF827559da092217e474760E2b2c3CeDd"},{"address":"0xE6841D92B0C345144506576eC13ECf5103aC7f49","delay":259200}]},{"permission":"upgrade","from":"0x667e23ABd27E623c11d4CC00ca3EC4d0bD63337a","via":[{"address":"0x554723262467F125Ac9e1cDFa9Ce15cc53822dbD"},{"address":"0x3ffFbAdAF827559da092217e474760E2b2c3CeDd"},{"address":"0xE6841D92B0C345144506576eC13ECf5103aC7f49","delay":259200}]},{"permission":"upgrade","from":"0x72Ce9c846789fdB6fC1f34aC4AD25Dd9ef7031ef","via":[{"address":"0x9aD46fac0Cf7f790E5be05A0F15223935A0c0aDa"},{"address":"0x3ffFbAdAF827559da092217e474760E2b2c3CeDd"},{"address":"0xE6841D92B0C345144506576eC13ECf5103aC7f49","delay":259200}]},{"permission":"upgrade","from":"0x760723CD2e632826c38Fef8CD438A4CC7E7E1A40","via":[{"address":"0x554723262467F125Ac9e1cDFa9Ce15cc53822dbD"},{"address":"0x3ffFbAdAF827559da092217e474760E2b2c3CeDd"},{"address":"0xE6841D92B0C345144506576eC13ECf5103aC7f49","delay":259200}]},{"permission":"upgrade","from":"0x8315177aB297bA92A06054cE80a67Ed4DBd7ed3a","via":[{"address":"0x554723262467F125Ac9e1cDFa9Ce15cc53822dbD"},{"address":"0x3ffFbAdAF827559da092217e474760E2b2c3CeDd"},{"address":"0xE6841D92B0C345144506576eC13ECf5103aC7f49","delay":259200}]},{"permission":"upgrade","from":"0xa3A7B6F88361F48403514059F1F16C8E78d60EeC","via":[{"address":"0x9aD46fac0Cf7f790E5be05A0F15223935A0c0aDa"},{"address":"0x3ffFbAdAF827559da092217e474760E2b2c3CeDd"},{"address":"0xE6841D92B0C345144506576eC13ECf5103aC7f49","delay":259200}]},{"permission":"upgrade","from":"0xcEe284F754E854890e311e3280b767F80797180d","via":[{"address":"0x9aD46fac0Cf7f790E5be05A0F15223935A0c0aDa"},{"address":"0x3ffFbAdAF827559da092217e474760E2b2c3CeDd"},{"address":"0xE6841D92B0C345144506576eC13ECf5103aC7f49","delay":259200}]},{"permission":"upgrade","from":"0xe5896783a2F463446E1f624e64Aa6836BE4C6f58","via":[{"address":"0x554723262467F125Ac9e1cDFa9Ce15cc53822dbD"},{"address":"0x3ffFbAdAF827559da092217e474760E2b2c3CeDd"},{"address":"0xE6841D92B0C345144506576eC13ECf5103aC7f49","delay":259200}]},{"permission":"upgrade","from":"0xE6841D92B0C345144506576eC13ECf5103aC7f49","via":[{"address":"0x5613AF0474EB9c528A34701A5b1662E3C8FA0678"},{"address":"0x3ffFbAdAF827559da092217e474760E2b2c3CeDd"},{"address":"0xE6841D92B0C345144506576eC13ECf5103aC7f49","delay":259200}]}]
      directlyReceivedPermissions:
+        [{"permission":"act","from":"0xE6841D92B0C345144506576eC13ECf5103aC7f49","delay":259200}]
    }
```

```diff
    contract L1ERC20Gateway (0xa3A7B6F88361F48403514059F1F16C8E78d60EeC) {
    +++ description: Escrows deposited ERC-20 assets for the canonical Bridge. Upon depositing, a generic token representation will be minted at the destination. Withdrawals are initiated by the Outbox contract.
      template:
-        "orbitstack/ERC20Gateway"
+        "orbitstack/ERC20Gateway2"
      issuedPermissions.1:
+        {"permission":"upgrade","to":"0xF06E95eF589D9c38af242a8AAee8375f14023F85","via":[{"address":"0x3ffFbAdAF827559da092217e474760E2b2c3CeDd"},{"address":"0x9aD46fac0Cf7f790E5be05A0F15223935A0c0aDa"}]}
      issuedPermissions.0.to:
-        "0xE6841D92B0C345144506576eC13ECf5103aC7f49"
+        "0x8315177aB297bA92A06054cE80a67Ed4DBd7ed3a"
      issuedPermissions.0.via.2:
+        {"address":"0x9aD46fac0Cf7f790E5be05A0F15223935A0c0aDa"}
      issuedPermissions.0.via.1.address:
-        "0x9aD46fac0Cf7f790E5be05A0F15223935A0c0aDa"
+        "0x3ffFbAdAF827559da092217e474760E2b2c3CeDd"
      issuedPermissions.0.via.0.address:
-        "0x3ffFbAdAF827559da092217e474760E2b2c3CeDd"
+        "0xE6841D92B0C345144506576eC13ECf5103aC7f49"
      issuedPermissions.0.via.0.delay:
+        259200
      values.whitelist:
-        "0xD485e5c28AA4985b23f6DF13dA03caa766dcd459"
    }
```

```diff
    contract L1CustomGateway (0xcEe284F754E854890e311e3280b767F80797180d) {
    +++ description: Escrows deposited assets for the canonical bridge that are externally governed or need custom token contracts with e.g. minting rights or upgradeability.
      template:
-        "orbitstack/CustomGateway"
+        "orbitstack/CustomGateway2"
      issuedPermissions.1:
+        {"permission":"upgrade","to":"0xF06E95eF589D9c38af242a8AAee8375f14023F85","via":[{"address":"0x3ffFbAdAF827559da092217e474760E2b2c3CeDd"},{"address":"0x9aD46fac0Cf7f790E5be05A0F15223935A0c0aDa"}]}
      issuedPermissions.0.to:
-        "0xE6841D92B0C345144506576eC13ECf5103aC7f49"
+        "0x8315177aB297bA92A06054cE80a67Ed4DBd7ed3a"
      issuedPermissions.0.via.2:
+        {"address":"0x9aD46fac0Cf7f790E5be05A0F15223935A0c0aDa"}
      issuedPermissions.0.via.1.address:
-        "0x9aD46fac0Cf7f790E5be05A0F15223935A0c0aDa"
+        "0x3ffFbAdAF827559da092217e474760E2b2c3CeDd"
      issuedPermissions.0.via.0.address:
-        "0x3ffFbAdAF827559da092217e474760E2b2c3CeDd"
+        "0xE6841D92B0C345144506576eC13ECf5103aC7f49"
      issuedPermissions.0.via.0.delay:
+        259200
      values.whitelist:
-        "0xD485e5c28AA4985b23f6DF13dA03caa766dcd459"
    }
```

```diff
    contract L1DaiGateway (0xD3B5b60020504bc3489D6949d545893982BA3011) {
    +++ description: Counterpart of the L2DaiGateway. Allows for bridging DAI from L1 to L2.
      template:
+        "orbitstack/L1DaiGateway"
      description:
+        "Counterpart of the L2DaiGateway. Allows for bridging DAI from L1 to L2."
    }
```

```diff
-   Status: DELETED
    contract Whitelist (0xD485e5c28AA4985b23f6DF13dA03caa766dcd459)
    +++ description: None
```

```diff
    contract ChallengeManager (0xe5896783a2F463446E1f624e64Aa6836BE4C6f58) {
    +++ description: Contract that allows challenging state roots. Can be called through the RollupProxy by Validators or the UpgradeExecutor.
      issuedPermissions.1:
+        {"permission":"upgrade","to":"0xF06E95eF589D9c38af242a8AAee8375f14023F85","via":[{"address":"0x3ffFbAdAF827559da092217e474760E2b2c3CeDd"},{"address":"0x554723262467F125Ac9e1cDFa9Ce15cc53822dbD"}]}
      issuedPermissions.0.to:
-        "0xE6841D92B0C345144506576eC13ECf5103aC7f49"
+        "0x8315177aB297bA92A06054cE80a67Ed4DBd7ed3a"
      issuedPermissions.0.via.2:
+        {"address":"0x554723262467F125Ac9e1cDFa9Ce15cc53822dbD"}
      issuedPermissions.0.via.1.address:
-        "0x554723262467F125Ac9e1cDFa9Ce15cc53822dbD"
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
      issuedPermissions.5:
+        {"permission":"upgrade","to":"0x8315177aB297bA92A06054cE80a67Ed4DBd7ed3a","via":[{"address":"0xE6841D92B0C345144506576eC13ECf5103aC7f49","delay":259200},{"address":"0x3ffFbAdAF827559da092217e474760E2b2c3CeDd"},{"address":"0x5613AF0474EB9c528A34701A5b1662E3C8FA0678"}]}
      issuedPermissions.4:
+        {"permission":"interact","to":"0xF06E95eF589D9c38af242a8AAee8375f14023F85","description":"update the minimum delay of the timelock.","via":[{"address":"0x3ffFbAdAF827559da092217e474760E2b2c3CeDd"}]}
      issuedPermissions.3:
+        {"permission":"interact","to":"0xF06E95eF589D9c38af242a8AAee8375f14023F85","description":"cancel queued transactions.","via":[{"address":"0x3ffFbAdAF827559da092217e474760E2b2c3CeDd"}]}
      issuedPermissions.2:
+        {"permission":"interact","to":"0x8315177aB297bA92A06054cE80a67Ed4DBd7ed3a","description":"update the minimum delay of the timelock.","via":[{"address":"0xE6841D92B0C345144506576eC13ECf5103aC7f49","delay":259200},{"address":"0x3ffFbAdAF827559da092217e474760E2b2c3CeDd"}]}
      issuedPermissions.1:
+        {"permission":"interact","to":"0x8315177aB297bA92A06054cE80a67Ed4DBd7ed3a","description":"propose transactions.","via":[]}
      issuedPermissions.0.permission:
-        "upgrade"
+        "interact"
      issuedPermissions.0.to:
-        "0xE6841D92B0C345144506576eC13ECf5103aC7f49"
+        "0x8315177aB297bA92A06054cE80a67Ed4DBd7ed3a"
      issuedPermissions.0.via.1.address:
-        "0x5613AF0474EB9c528A34701A5b1662E3C8FA0678"
+        "0x3ffFbAdAF827559da092217e474760E2b2c3CeDd"
      issuedPermissions.0.via.0.address:
-        "0x3ffFbAdAF827559da092217e474760E2b2c3CeDd"
+        "0xE6841D92B0C345144506576eC13ECf5103aC7f49"
      issuedPermissions.0.via.0.delay:
+        259200
      issuedPermissions.0.description:
+        "cancel queued transactions."
      receivedPermissions:
-        [{"permission":"interact","from":"0x5eF0D09d1E6204141B4d37530808eD19f60FBa35","description":"Pause and unpause and set important roles and parameters in the system contracts: Can delegate Sequencer management to a BatchPosterManager address, manage data availability and DACs, set the Sequencer-only window, introduce an allowList to the bridge and whitelist Inboxes/Outboxes.","via":[{"address":"0x3ffFbAdAF827559da092217e474760E2b2c3CeDd"}]},{"permission":"upgrade","from":"0x0B9857ae2D4A3DBe74ffE1d7DF045bb7F96E4840","via":[{"address":"0x554723262467F125Ac9e1cDFa9Ce15cc53822dbD"},{"address":"0x3ffFbAdAF827559da092217e474760E2b2c3CeDd"}]},{"permission":"upgrade","from":"0x1c479675ad559DC151F6Ec7ed3FbF8ceE79582B6","via":[{"address":"0x554723262467F125Ac9e1cDFa9Ce15cc53822dbD"},{"address":"0x3ffFbAdAF827559da092217e474760E2b2c3CeDd"}]},{"permission":"upgrade","from":"0x3ffFbAdAF827559da092217e474760E2b2c3CeDd","via":[{"address":"0x5613AF0474EB9c528A34701A5b1662E3C8FA0678"},{"address":"0x3ffFbAdAF827559da092217e474760E2b2c3CeDd"}]},{"permission":"upgrade","from":"0x4Dbd4fc535Ac27206064B68FfCf827b0A60BAB3f","via":[{"address":"0x554723262467F125Ac9e1cDFa9Ce15cc53822dbD"},{"address":"0x3ffFbAdAF827559da092217e474760E2b2c3CeDd"}]},{"permission":"upgrade","from":"0x57Bd336d579A51938619271a7Cc137a46D0501B1","via":[{"address":"0x554723262467F125Ac9e1cDFa9Ce15cc53822dbD"},{"address":"0x3ffFbAdAF827559da092217e474760E2b2c3CeDd"}]},{"permission":"upgrade","from":"0x5eF0D09d1E6204141B4d37530808eD19f60FBa35","via":[{"address":"0x3ffFbAdAF827559da092217e474760E2b2c3CeDd"}]},{"permission":"upgrade","from":"0x667e23ABd27E623c11d4CC00ca3EC4d0bD63337a","via":[{"address":"0x554723262467F125Ac9e1cDFa9Ce15cc53822dbD"},{"address":"0x3ffFbAdAF827559da092217e474760E2b2c3CeDd"}]},{"permission":"upgrade","from":"0x72Ce9c846789fdB6fC1f34aC4AD25Dd9ef7031ef","via":[{"address":"0x9aD46fac0Cf7f790E5be05A0F15223935A0c0aDa"},{"address":"0x3ffFbAdAF827559da092217e474760E2b2c3CeDd"}]},{"permission":"upgrade","from":"0x760723CD2e632826c38Fef8CD438A4CC7E7E1A40","via":[{"address":"0x554723262467F125Ac9e1cDFa9Ce15cc53822dbD"},{"address":"0x3ffFbAdAF827559da092217e474760E2b2c3CeDd"}]},{"permission":"upgrade","from":"0x8315177aB297bA92A06054cE80a67Ed4DBd7ed3a","via":[{"address":"0x554723262467F125Ac9e1cDFa9Ce15cc53822dbD"},{"address":"0x3ffFbAdAF827559da092217e474760E2b2c3CeDd"}]},{"permission":"upgrade","from":"0xa3A7B6F88361F48403514059F1F16C8E78d60EeC","via":[{"address":"0x9aD46fac0Cf7f790E5be05A0F15223935A0c0aDa"},{"address":"0x3ffFbAdAF827559da092217e474760E2b2c3CeDd"}]},{"permission":"upgrade","from":"0xcEe284F754E854890e311e3280b767F80797180d","via":[{"address":"0x9aD46fac0Cf7f790E5be05A0F15223935A0c0aDa"},{"address":"0x3ffFbAdAF827559da092217e474760E2b2c3CeDd"}]},{"permission":"upgrade","from":"0xe5896783a2F463446E1f624e64Aa6836BE4C6f58","via":[{"address":"0x554723262467F125Ac9e1cDFa9Ce15cc53822dbD"},{"address":"0x3ffFbAdAF827559da092217e474760E2b2c3CeDd"}]},{"permission":"upgrade","from":"0xE6841D92B0C345144506576eC13ECf5103aC7f49","via":[{"address":"0x5613AF0474EB9c528A34701A5b1662E3C8FA0678"},{"address":"0x3ffFbAdAF827559da092217e474760E2b2c3CeDd"}]}]
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
+        [{"permission":"interact","from":"0x5eF0D09d1E6204141B4d37530808eD19f60FBa35","description":"Pause and unpause and set important roles and parameters in the system contracts: Can delegate Sequencer management to a BatchPosterManager address, manage data availability and DACs, set the Sequencer-only window, introduce an allowList to the bridge and whitelist Inboxes/Outboxes.","via":[{"address":"0x3ffFbAdAF827559da092217e474760E2b2c3CeDd"}]},{"permission":"interact","from":"0xE6841D92B0C345144506576eC13ECf5103aC7f49","description":"cancel queued transactions.","via":[{"address":"0x3ffFbAdAF827559da092217e474760E2b2c3CeDd"}]},{"permission":"interact","from":"0xE6841D92B0C345144506576eC13ECf5103aC7f49","description":"update the minimum delay of the timelock.","via":[{"address":"0x3ffFbAdAF827559da092217e474760E2b2c3CeDd"}]},{"permission":"upgrade","from":"0x0B9857ae2D4A3DBe74ffE1d7DF045bb7F96E4840","via":[{"address":"0x554723262467F125Ac9e1cDFa9Ce15cc53822dbD"},{"address":"0x3ffFbAdAF827559da092217e474760E2b2c3CeDd"}]},{"permission":"upgrade","from":"0x1c479675ad559DC151F6Ec7ed3FbF8ceE79582B6","via":[{"address":"0x554723262467F125Ac9e1cDFa9Ce15cc53822dbD"},{"address":"0x3ffFbAdAF827559da092217e474760E2b2c3CeDd"}]},{"permission":"upgrade","from":"0x3ffFbAdAF827559da092217e474760E2b2c3CeDd","via":[{"address":"0x5613AF0474EB9c528A34701A5b1662E3C8FA0678"},{"address":"0x3ffFbAdAF827559da092217e474760E2b2c3CeDd"}]},{"permission":"upgrade","from":"0x4Dbd4fc535Ac27206064B68FfCf827b0A60BAB3f","via":[{"address":"0x554723262467F125Ac9e1cDFa9Ce15cc53822dbD"},{"address":"0x3ffFbAdAF827559da092217e474760E2b2c3CeDd"}]},{"permission":"upgrade","from":"0x57Bd336d579A51938619271a7Cc137a46D0501B1","via":[{"address":"0x554723262467F125Ac9e1cDFa9Ce15cc53822dbD"},{"address":"0x3ffFbAdAF827559da092217e474760E2b2c3CeDd"}]},{"permission":"upgrade","from":"0x5eF0D09d1E6204141B4d37530808eD19f60FBa35","via":[{"address":"0x3ffFbAdAF827559da092217e474760E2b2c3CeDd"}]},{"permission":"upgrade","from":"0x667e23ABd27E623c11d4CC00ca3EC4d0bD63337a","via":[{"address":"0x554723262467F125Ac9e1cDFa9Ce15cc53822dbD"},{"address":"0x3ffFbAdAF827559da092217e474760E2b2c3CeDd"}]},{"permission":"upgrade","from":"0x72Ce9c846789fdB6fC1f34aC4AD25Dd9ef7031ef","via":[{"address":"0x9aD46fac0Cf7f790E5be05A0F15223935A0c0aDa"},{"address":"0x3ffFbAdAF827559da092217e474760E2b2c3CeDd"}]},{"permission":"upgrade","from":"0x760723CD2e632826c38Fef8CD438A4CC7E7E1A40","via":[{"address":"0x554723262467F125Ac9e1cDFa9Ce15cc53822dbD"},{"address":"0x3ffFbAdAF827559da092217e474760E2b2c3CeDd"}]},{"permission":"upgrade","from":"0x8315177aB297bA92A06054cE80a67Ed4DBd7ed3a","via":[{"address":"0x554723262467F125Ac9e1cDFa9Ce15cc53822dbD"},{"address":"0x3ffFbAdAF827559da092217e474760E2b2c3CeDd"}]},{"permission":"upgrade","from":"0xa3A7B6F88361F48403514059F1F16C8E78d60EeC","via":[{"address":"0x9aD46fac0Cf7f790E5be05A0F15223935A0c0aDa"},{"address":"0x3ffFbAdAF827559da092217e474760E2b2c3CeDd"}]},{"permission":"upgrade","from":"0xcEe284F754E854890e311e3280b767F80797180d","via":[{"address":"0x9aD46fac0Cf7f790E5be05A0F15223935A0c0aDa"},{"address":"0x3ffFbAdAF827559da092217e474760E2b2c3CeDd"}]},{"permission":"upgrade","from":"0xe5896783a2F463446E1f624e64Aa6836BE4C6f58","via":[{"address":"0x554723262467F125Ac9e1cDFa9Ce15cc53822dbD"},{"address":"0x3ffFbAdAF827559da092217e474760E2b2c3CeDd"}]},{"permission":"upgrade","from":"0xE6841D92B0C345144506576eC13ECf5103aC7f49","via":[{"address":"0x5613AF0474EB9c528A34701A5b1662E3C8FA0678"},{"address":"0x3ffFbAdAF827559da092217e474760E2b2c3CeDd"}]}]
      references:
+        [{"text":"Security Council members - Arbitrum Foundation Docs","href":"https://docs.arbitrum.foundation/security-council-members"}]
    }
```

```diff
+   Status: CREATED
    contract FundRetriever (0x34d45e99f7D8c45ed05B5cA72D54bbD1fb3F98f0)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ProxyAdmin (0x9F43ab02cACc8e709b05936a92dC85b76D1523c4)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ProxyAdmin (0xf716C9Ee355d7684Ef41d61388ed9C7B3673Bd9C)
    +++ description: None
```

Generated with discovered.json: 0xea5b5bc4a8232966e957c881763381f7a0dd0dc1

# Diff at Sat, 08 Feb 2025 15:54:14 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@ef01ea79812e0d524af00be3fae1170cef6fd662 block: 21786855
- current block number: 21802817

## Description

BoLD upgrade and related txes scheduled (🥳).

## Watched changes

```diff
    contract L1Timelock (0xE6841D92B0C345144506576eC13ECf5103aC7f49) {
    +++ description: None
      values.scheduledTransactions.64:
+        {"id":"0xc6e80bb1ee3617c9b589540ce96a19e3ca887fd675081a017803473b45fad5d6","decoded":{"chain":"ethereum","contractName":"SetValidatorsAction","function":"perform","inputs":[{"name":"_validators","value":["0x0fF813f6BD577c3D1cDbE435baC0621BE6aE34B4"]},{"name":"_values","value":[true]}],"address":"0xBF94aFEbFBf062A88615bC012da39d0822670aBa","calldata":"0x4f71a50e0000000000000000000000000000000000000000000000000000000000000040000000000000000000000000000000000000000000000000000000000000008000000000000000000000000000000000000000000000000000000000000000010000000000000000000000000ff813f6bd577c3d1cdbe435bac0621be6ae34b400000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000001","executor":"0x3ffFbAdAF827559da092217e474760E2b2c3CeDd"},"raw":{"target":"0x3ffFbAdAF827559da092217e474760E2b2c3CeDd","value":0,"data":"0x1cff79cd000000000000000000000000bf94afebfbf062a88615bc012da39d0822670aba000000000000000000000000000000000000000000000000000000000000004000000000000000000000000000000000000000000000000000000000000000c44f71a50e0000000000000000000000000000000000000000000000000000000000000040000000000000000000000000000000000000000000000000000000000000008000000000000000000000000000000000000000000000000000000000000000010000000000000000000000000ff813f6bd577c3d1cdbe435bac0621be6ae34b40000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000","delay":259200}}
      values.scheduledTransactions.63:
+        {"id":"0xc6e80bb1ee3617c9b589540ce96a19e3ca887fd675081a017803473b45fad5d6","decoded":{"chain":"ethereum","contractName":"BOLDUpgradeAction","function":"perform","inputs":[{"name":"validators","value":["0x1732BE6738117e9d22A84181AF68C8d09Cd4FF23","0x3B0369CAD35d257793F51c28213a4Cf4001397AC","0x54c0D3d6C101580dB3be8763A2aE2c6bb9dc840c","0x658e8123722462F888b6fa01a7dbcEFe1D6DD709","0xDfB23DFE9De7dcC974467195C8B7D5cd21C9d7cB","0xE27d4Ed355e5273A3D4855c8e11BC4a8d3e39b87","0x57004b440Cc4eb2FEd8c4d1865FaC907F9150C76","0x24Ca61c31C7f9Af3ab104dB6B9A444F28e9071e3","0xB51EDdfc9A945e2B909905e4F242C4796Ac0C61d"]}],"address":"0xd25B258B55765c9fb5567eCABB6114b03b0f78b5","calldata":"0xebe03a93000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000000090000000000000000000000001732be6738117e9d22a84181af68c8d09cd4ff230000000000000000000000003b0369cad35d257793f51c28213a4cf4001397ac00000000000000000000000054c0d3d6c101580db3be8763a2ae2c6bb9dc840c000000000000000000000000658e8123722462f888b6fa01a7dbcefe1d6dd709000000000000000000000000dfb23dfe9de7dcc974467195c8b7d5cd21c9d7cb000000000000000000000000e27d4ed355e5273a3d4855c8e11bc4a8d3e39b8700000000000000000000000057004b440cc4eb2fed8c4d1865fac907f9150c7600000000000000000000000024ca61c31c7f9af3ab104db6b9a444f28e9071e3000000000000000000000000b51eddfc9a945e2b909905e4f242c4796ac0c61d","executor":"0x3ffFbAdAF827559da092217e474760E2b2c3CeDd"},"raw":{"target":"0x3ffFbAdAF827559da092217e474760E2b2c3CeDd","value":0,"data":"0x1cff79cd000000000000000000000000d25b258b55765c9fb5567ecabb6114b03b0f78b500000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000164ebe03a93000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000000090000000000000000000000001732be6738117e9d22a84181af68c8d09cd4ff230000000000000000000000003b0369cad35d257793f51c28213a4cf4001397ac00000000000000000000000054c0d3d6c101580db3be8763a2ae2c6bb9dc840c000000000000000000000000658e8123722462f888b6fa01a7dbcefe1d6dd709000000000000000000000000dfb23dfe9de7dcc974467195c8b7d5cd21c9d7cb000000000000000000000000e27d4ed355e5273a3d4855c8e11bc4a8d3e39b8700000000000000000000000057004b440cc4eb2fed8c4d1865fac907f9150c7600000000000000000000000024ca61c31c7f9af3ab104db6b9a444f28e9071e3000000000000000000000000b51eddfc9a945e2b909905e4f242c4796ac0c61d00000000000000000000000000000000000000000000000000000000","delay":259200}}
      values.scheduledTransactions.62:
+        {"id":"0xc6e80bb1ee3617c9b589540ce96a19e3ca887fd675081a017803473b45fad5d6","decoded":{"chain":"ethereum","contractName":"BOLDUpgradeAction","function":"perform","inputs":[{"name":"validators","value":[]}],"address":"0xf795ec38701234664f69Dbd761Ee9c511F25ac1D","calldata":"0xebe03a9300000000000000000000000000000000000000000000000000000000000000200000000000000000000000000000000000000000000000000000000000000000","executor":"0x3ffFbAdAF827559da092217e474760E2b2c3CeDd"},"raw":{"target":"0x3ffFbAdAF827559da092217e474760E2b2c3CeDd","value":0,"data":"0x1cff79cd000000000000000000000000f795ec38701234664f69dbd761ee9c511f25ac1d00000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000044ebe03a930000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000","delay":259200}}
      values.scheduledTransactions.61:
+        {"id":"0xc6e80bb1ee3617c9b589540ce96a19e3ca887fd675081a017803473b45fad5d6","decoded":{"chain":"ethereum","contractName":"RollupUpgradeSecondaryAction","function":"perform","inputs":[{"name":"newSecondaryLogic","value":"0x5c93BAB9Ff2Fa3884b643bd8545C625De0633517"}],"address":"0x8E1c1555b2Fe22870e7a0A454789b0c92e494ADC","calldata":"0xb38ed43b0000000000000000000000005c93bab9ff2fa3884b643bd8545c625de0633517","executor":"0x3ffFbAdAF827559da092217e474760E2b2c3CeDd"},"raw":{"target":"0x3ffFbAdAF827559da092217e474760E2b2c3CeDd","value":0,"data":"0x1cff79cd0000000000000000000000008e1c1555b2fe22870e7a0a454789b0c92e494adc00000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000024b38ed43b0000000000000000000000005c93bab9ff2fa3884b643bd8545c625de063351700000000000000000000000000000000000000000000000000000000","delay":259200}}
      values.scheduledTransactions.60:
+        {"id":"0xc6e80bb1ee3617c9b589540ce96a19e3ca887fd675081a017803473b45fad5d6","decoded":{"chain":"ethereum","contractName":"RollupUpgradeSecondaryAction","function":"perform","inputs":[{"name":"newSecondaryLogic","value":"0x5c93BAB9Ff2Fa3884b643bd8545C625De0633517"}],"address":"0x2A3a4BDbC7c00d5115d297d83A31358B317d4740","calldata":"0xb38ed43b0000000000000000000000005c93bab9ff2fa3884b643bd8545c625de0633517","executor":"0x3ffFbAdAF827559da092217e474760E2b2c3CeDd"},"raw":{"target":"0x3ffFbAdAF827559da092217e474760E2b2c3CeDd","value":0,"data":"0x1cff79cd0000000000000000000000002a3a4bdbc7c00d5115d297d83a31358b317d474000000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000024b38ed43b0000000000000000000000005c93bab9ff2fa3884b643bd8545c625de063351700000000000000000000000000000000000000000000000000000000","delay":259200}}
      values.scheduledTransactions.59:
+        {"id":"0xc6e80bb1ee3617c9b589540ce96a19e3ca887fd675081a017803473b45fad5d6","decoded":{"chain":"ethereum","contractName":"OfficeHoursAction","function":"perform","inputs":[],"address":"0x0dA0E898d593b330a63044492FFbBF4A553Ee915","calldata":"0xb147f40c","executor":"0x3ffFbAdAF827559da092217e474760E2b2c3CeDd"},"raw":{"target":"0x3ffFbAdAF827559da092217e474760E2b2c3CeDd","value":0,"data":"0x1cff79cd0000000000000000000000000da0e898d593b330a63044492ffbbf4a553ee91500000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000004b147f40c00000000000000000000000000000000000000000000000000000000","delay":259200}}
    }
```

Generated with discovered.json: 0x6e56e8d0f85652deb4b454894728f5f36af77113

# Diff at Tue, 04 Feb 2025 12:30:48 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@145553eed7ba44636411ecb25e4099728acd02f9 block: 21628418
- current block number: 21628418

## Description

Rename 'configure' permission to 'interact'

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21628418 (main branch discovery), not current.

```diff
    contract SequencerInbox (0x1c479675ad559DC151F6Ec7ed3FbF8ceE79582B6) {
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
    contract RollupProxy (0x5eF0D09d1E6204141B4d37530808eD19f60FBa35) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      issuedPermissions.0.permission:
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

Generated with discovered.json: 0x323516636a16746f4a50fc564463e0685d289795

# Diff at Mon, 20 Jan 2025 11:09:16 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@2c8b4f3d9910bb6371be9b4df87b70856e7d8c64 block: 21628418
- current block number: 21628418

## Description

Rerun on the same block number. Applies fixes to permissions and via field. Renames permission's target to to/from.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21628418 (main branch discovery), not current.

```diff
    contract Outbox (0x0B9857ae2D4A3DBe74ffE1d7DF045bb7F96E4840) {
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
    contract ProxyAdmin (0x0ea6999172c1B4563695F76A52de73c848587b17) {
    +++ description: None
      directlyReceivedPermissions.0.target:
-        "0x83215480dB2C6A7E56f9E99EF93AB9B36F8A3DD5"
      directlyReceivedPermissions.0.from:
+        "0x83215480dB2C6A7E56f9E99EF93AB9B36F8A3DD5"
    }
```

```diff
    contract SequencerInbox (0x1c479675ad559DC151F6Ec7ed3FbF8ceE79582B6) {
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
    contract ProxyAdmin (0x3f92814930f43c6a1C6B133E5945E7B3338F33a6) {
    +++ description: None
      directlyReceivedPermissions.0.target:
-        "0x7CF3d537733F6Ba4183A833c9B021265716cE9d0"
      directlyReceivedPermissions.0.from:
+        "0x7CF3d537733F6Ba4183A833c9B021265716cE9d0"
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
-        "0x5eF0D09d1E6204141B4d37530808eD19f60FBa35"
      directlyReceivedPermissions.5.from:
+        "0x5eF0D09d1E6204141B4d37530808eD19f60FBa35"
      directlyReceivedPermissions.4.target:
-        "0x5eF0D09d1E6204141B4d37530808eD19f60FBa35"
      directlyReceivedPermissions.4.from:
+        "0x5eF0D09d1E6204141B4d37530808eD19f60FBa35"
      directlyReceivedPermissions.3.target:
-        "0xF06E95eF589D9c38af242a8AAee8375f14023F85"
      directlyReceivedPermissions.3.from:
+        "0xF06E95eF589D9c38af242a8AAee8375f14023F85"
      directlyReceivedPermissions.2.target:
-        "0x9aD46fac0Cf7f790E5be05A0F15223935A0c0aDa"
      directlyReceivedPermissions.2.from:
+        "0x9aD46fac0Cf7f790E5be05A0F15223935A0c0aDa"
      directlyReceivedPermissions.1.target:
-        "0x5613AF0474EB9c528A34701A5b1662E3C8FA0678"
      directlyReceivedPermissions.1.from:
+        "0x5613AF0474EB9c528A34701A5b1662E3C8FA0678"
      directlyReceivedPermissions.0.target:
-        "0x554723262467F125Ac9e1cDFa9Ce15cc53822dbD"
      directlyReceivedPermissions.0.from:
+        "0x554723262467F125Ac9e1cDFa9Ce15cc53822dbD"
    }
```

```diff
    contract ProxyAdmin (0x4561A4cDA2CB8a61ED023785bc1817fdf685dcb3) {
    +++ description: None
      directlyReceivedPermissions.0.target:
-        "0x56D83349c2B8DCF74d7E92D5b6B33d0BADD52D78"
      directlyReceivedPermissions.0.from:
+        "0x56D83349c2B8DCF74d7E92D5b6B33d0BADD52D78"
    }
```

```diff
    contract Inbox (0x4Dbd4fc535Ac27206064B68FfCf827b0A60BAB3f) {
    +++ description: Facilitates sending L1 to L2 messages like depositing ETH, but does not escrow funds.
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
    contract ProxyAdmin (0x509E3CDc218d163DB9A03678107b72e00163b061) {
    +++ description: None
      directlyReceivedPermissions.0.target:
-        "0xB0CB1384e3f4a9a9b2447e39b05e10631E1D34B0"
      directlyReceivedPermissions.0.from:
+        "0xB0CB1384e3f4a9a9b2447e39b05e10631E1D34B0"
    }
```

```diff
    contract ArbitrumProxyAdmin (0x554723262467F125Ac9e1cDFa9Ce15cc53822dbD) {
    +++ description: None
      directlyReceivedPermissions.7.target:
-        "0xe5896783a2F463446E1f624e64Aa6836BE4C6f58"
      directlyReceivedPermissions.7.from:
+        "0xe5896783a2F463446E1f624e64Aa6836BE4C6f58"
      directlyReceivedPermissions.6.target:
-        "0x8315177aB297bA92A06054cE80a67Ed4DBd7ed3a"
      directlyReceivedPermissions.6.from:
+        "0x8315177aB297bA92A06054cE80a67Ed4DBd7ed3a"
      directlyReceivedPermissions.5.target:
-        "0x760723CD2e632826c38Fef8CD438A4CC7E7E1A40"
      directlyReceivedPermissions.5.from:
+        "0x760723CD2e632826c38Fef8CD438A4CC7E7E1A40"
      directlyReceivedPermissions.4.target:
-        "0x667e23ABd27E623c11d4CC00ca3EC4d0bD63337a"
      directlyReceivedPermissions.4.from:
+        "0x667e23ABd27E623c11d4CC00ca3EC4d0bD63337a"
      directlyReceivedPermissions.3.target:
-        "0x57Bd336d579A51938619271a7Cc137a46D0501B1"
      directlyReceivedPermissions.3.from:
+        "0x57Bd336d579A51938619271a7Cc137a46D0501B1"
      directlyReceivedPermissions.2.target:
-        "0x4Dbd4fc535Ac27206064B68FfCf827b0A60BAB3f"
      directlyReceivedPermissions.2.from:
+        "0x4Dbd4fc535Ac27206064B68FfCf827b0A60BAB3f"
      directlyReceivedPermissions.1.target:
-        "0x1c479675ad559DC151F6Ec7ed3FbF8ceE79582B6"
      directlyReceivedPermissions.1.from:
+        "0x1c479675ad559DC151F6Ec7ed3FbF8ceE79582B6"
      directlyReceivedPermissions.0.target:
-        "0x0B9857ae2D4A3DBe74ffE1d7DF045bb7F96E4840"
      directlyReceivedPermissions.0.from:
+        "0x0B9857ae2D4A3DBe74ffE1d7DF045bb7F96E4840"
    }
```

```diff
    contract UpgradeExecutorAdmin (0x5613AF0474EB9c528A34701A5b1662E3C8FA0678) {
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
    contract ValidatorWallet (0x56D83349c2B8DCF74d7E92D5b6B33d0BADD52D78) {
    +++ description: None
      issuedPermissions.0.target:
-        "0x194DAFaB3B9B24B181a63F81eE42b322Cd0Db6E5"
      issuedPermissions.0.via.0.delay:
-        0
      issuedPermissions.0.to:
+        "0x194DAFaB3B9B24B181a63F81eE42b322Cd0Db6E5"
      receivedPermissions.0.target:
-        "0x5eF0D09d1E6204141B4d37530808eD19f60FBa35"
      receivedPermissions.0.from:
+        "0x5eF0D09d1E6204141B4d37530808eD19f60FBa35"
    }
```

```diff
    contract RollupEventInbox (0x57Bd336d579A51938619271a7Cc137a46D0501B1) {
    +++ description: Helper contract sending configuration data over the bridge during the systems initialization.
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
    contract RollupProxy (0x5eF0D09d1E6204141B4d37530808eD19f60FBa35) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      issuedPermissions.15.target:
-        "0xF8D3E1cF58386c92B27710C6a0D8A54c76BC6ab5"
      issuedPermissions.15.to:
+        "0xF8D3E1cF58386c92B27710C6a0D8A54c76BC6ab5"
      issuedPermissions.15.description:
+        "Can propose new state roots (called nodes) and challenge state roots on the host chain."
      issuedPermissions.14.target:
-        "0xf59caf75e8A4bFBA4e6e07aD86C7E498E4d2519b"
      issuedPermissions.14.to:
+        "0xf59caf75e8A4bFBA4e6e07aD86C7E498E4d2519b"
      issuedPermissions.14.description:
+        "Can propose new state roots (called nodes) and challenge state roots on the host chain."
      issuedPermissions.13.target:
-        "0xdDf2F71Ab206C0138A8eceEb54386567D5abF01E"
      issuedPermissions.13.to:
+        "0xdDf2F71Ab206C0138A8eceEb54386567D5abF01E"
      issuedPermissions.13.description:
+        "Can propose new state roots (called nodes) and challenge state roots on the host chain."
      issuedPermissions.12.target:
-        "0xB51EDdfc9A945e2B909905e4F242C4796Ac0C61d"
      issuedPermissions.12.to:
+        "0xB51EDdfc9A945e2B909905e4F242C4796Ac0C61d"
      issuedPermissions.12.description:
+        "Can propose new state roots (called nodes) and challenge state roots on the host chain."
      issuedPermissions.11.target:
-        "0xB0CB1384e3f4a9a9b2447e39b05e10631E1D34B0"
      issuedPermissions.11.to:
+        "0xB0CB1384e3f4a9a9b2447e39b05e10631E1D34B0"
      issuedPermissions.11.description:
+        "Can propose new state roots (called nodes) and challenge state roots on the host chain."
      issuedPermissions.10.target:
-        "0xAB1A39332e934300eBCc57B5f95cA90631a347FF"
      issuedPermissions.10.to:
+        "0xAB1A39332e934300eBCc57B5f95cA90631a347FF"
      issuedPermissions.10.description:
+        "Can propose new state roots (called nodes) and challenge state roots on the host chain."
      issuedPermissions.9.target:
-        "0x83215480dB2C6A7E56f9E99EF93AB9B36F8A3DD5"
      issuedPermissions.9.to:
+        "0x83215480dB2C6A7E56f9E99EF93AB9B36F8A3DD5"
      issuedPermissions.9.description:
+        "Can propose new state roots (called nodes) and challenge state roots on the host chain."
      issuedPermissions.8.target:
-        "0x7CF3d537733F6Ba4183A833c9B021265716cE9d0"
      issuedPermissions.8.to:
+        "0x7CF3d537733F6Ba4183A833c9B021265716cE9d0"
      issuedPermissions.8.description:
+        "Can propose new state roots (called nodes) and challenge state roots on the host chain."
      issuedPermissions.7.target:
-        "0x758C6bB08B3ea5889B5cddbdeF9A45b3a983c398"
      issuedPermissions.7.to:
+        "0x758C6bB08B3ea5889B5cddbdeF9A45b3a983c398"
      issuedPermissions.7.description:
+        "Can propose new state roots (called nodes) and challenge state roots on the host chain."
      issuedPermissions.6.target:
-        "0x6Fb914de4653eC5592B7c15F4d9466Cbd03F2104"
      issuedPermissions.6.to:
+        "0x6Fb914de4653eC5592B7c15F4d9466Cbd03F2104"
      issuedPermissions.6.description:
+        "Can propose new state roots (called nodes) and challenge state roots on the host chain."
      issuedPermissions.5.target:
-        "0x610Aa279989F440820e14248BD3879B148717974"
      issuedPermissions.5.to:
+        "0x610Aa279989F440820e14248BD3879B148717974"
      issuedPermissions.5.description:
+        "Can propose new state roots (called nodes) and challenge state roots on the host chain."
      issuedPermissions.4.target:
-        "0x56D83349c2B8DCF74d7E92D5b6B33d0BADD52D78"
      issuedPermissions.4.to:
+        "0x56D83349c2B8DCF74d7E92D5b6B33d0BADD52D78"
      issuedPermissions.4.description:
+        "Can propose new state roots (called nodes) and challenge state roots on the host chain."
      issuedPermissions.3.target:
-        "0x54c0D3d6C101580dB3be8763A2aE2c6bb9dc840c"
      issuedPermissions.3.to:
+        "0x54c0D3d6C101580dB3be8763A2aE2c6bb9dc840c"
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

```diff
    contract OutboxV0 (0x667e23ABd27E623c11d4CC00ca3EC4d0bD63337a) {
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
    contract L1GatewayRouter (0x72Ce9c846789fdB6fC1f34aC4AD25Dd9ef7031ef) {
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
    contract Validator (0x758C6bB08B3ea5889B5cddbdeF9A45b3a983c398) {
    +++ description: None
      issuedPermissions.0.target:
-        "0xE89eACE17073663D9c6337Cc2Ca25bc28e5fc82E"
      issuedPermissions.0.via.0.delay:
-        0
      issuedPermissions.0.to:
+        "0xE89eACE17073663D9c6337Cc2Ca25bc28e5fc82E"
      receivedPermissions.0.target:
-        "0x5eF0D09d1E6204141B4d37530808eD19f60FBa35"
      receivedPermissions.0.from:
+        "0x5eF0D09d1E6204141B4d37530808eD19f60FBa35"
    }
```

```diff
    contract OutboxV1 (0x760723CD2e632826c38Fef8CD438A4CC7E7E1A40) {
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
    contract ValidatorWallet (0x7CF3d537733F6Ba4183A833c9B021265716cE9d0) {
    +++ description: None
      issuedPermissions.0.target:
-        "0xC234E41AE2cb00311956Aa7109fC801ae8c80941"
      issuedPermissions.0.via.0.delay:
-        0
      issuedPermissions.0.to:
+        "0xC234E41AE2cb00311956Aa7109fC801ae8c80941"
      receivedPermissions.0.target:
-        "0x5eF0D09d1E6204141B4d37530808eD19f60FBa35"
      receivedPermissions.0.from:
+        "0x5eF0D09d1E6204141B4d37530808eD19f60FBa35"
    }
```

```diff
    contract Bridge (0x8315177aB297bA92A06054cE80a67Ed4DBd7ed3a) {
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
    contract ValidatorWallet (0x83215480dB2C6A7E56f9E99EF93AB9B36F8A3DD5) {
    +++ description: None
      issuedPermissions.0.target:
-        "0xC234E41AE2cb00311956Aa7109fC801ae8c80941"
      issuedPermissions.0.via.0.delay:
-        0
      issuedPermissions.0.to:
+        "0xC234E41AE2cb00311956Aa7109fC801ae8c80941"
      receivedPermissions.0.target:
-        "0x5eF0D09d1E6204141B4d37530808eD19f60FBa35"
      receivedPermissions.0.from:
+        "0x5eF0D09d1E6204141B4d37530808eD19f60FBa35"
    }
```

```diff
    contract GatewaysAdmin (0x9aD46fac0Cf7f790E5be05A0F15223935A0c0aDa) {
    +++ description: None
      directlyReceivedPermissions.2.target:
-        "0xcEe284F754E854890e311e3280b767F80797180d"
      directlyReceivedPermissions.2.from:
+        "0xcEe284F754E854890e311e3280b767F80797180d"
      directlyReceivedPermissions.1.target:
-        "0xa3A7B6F88361F48403514059F1F16C8E78d60EeC"
      directlyReceivedPermissions.1.from:
+        "0xa3A7B6F88361F48403514059F1F16C8E78d60EeC"
      directlyReceivedPermissions.0.target:
-        "0x72Ce9c846789fdB6fC1f34aC4AD25Dd9ef7031ef"
      directlyReceivedPermissions.0.from:
+        "0x72Ce9c846789fdB6fC1f34aC4AD25Dd9ef7031ef"
    }
```

```diff
    contract L1ERC20Gateway (0xa3A7B6F88361F48403514059F1F16C8E78d60EeC) {
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
    contract ProxyAdmin (0xAb33350E0319466A81D2AE6DC5CdF2518123f766) {
    +++ description: None
      directlyReceivedPermissions.0.target:
-        "0x758C6bB08B3ea5889B5cddbdeF9A45b3a983c398"
      directlyReceivedPermissions.0.from:
+        "0x758C6bB08B3ea5889B5cddbdeF9A45b3a983c398"
    }
```

```diff
    contract ValidatorWallet (0xB0CB1384e3f4a9a9b2447e39b05e10631E1D34B0) {
    +++ description: None
      issuedPermissions.0.target:
-        "0xd3132d052C9045D7cB0236586C9E2276e654343D"
      issuedPermissions.0.via.0.delay:
-        0
      issuedPermissions.0.to:
+        "0xd3132d052C9045D7cB0236586C9E2276e654343D"
      receivedPermissions.0.target:
-        "0x5eF0D09d1E6204141B4d37530808eD19f60FBa35"
      receivedPermissions.0.from:
+        "0x5eF0D09d1E6204141B4d37530808eD19f60FBa35"
    }
```

```diff
    contract ValidatorOwnerMultisig (0xC234E41AE2cb00311956Aa7109fC801ae8c80941) {
    +++ description: None
      receivedPermissions.1.target:
-        "0x83215480dB2C6A7E56f9E99EF93AB9B36F8A3DD5"
      receivedPermissions.1.from:
+        "0x83215480dB2C6A7E56f9E99EF93AB9B36F8A3DD5"
      receivedPermissions.0.target:
-        "0x7CF3d537733F6Ba4183A833c9B021265716cE9d0"
      receivedPermissions.0.from:
+        "0x7CF3d537733F6Ba4183A833c9B021265716cE9d0"
      directlyReceivedPermissions.1.target:
-        "0x3f92814930f43c6a1C6B133E5945E7B3338F33a6"
      directlyReceivedPermissions.1.from:
+        "0x3f92814930f43c6a1C6B133E5945E7B3338F33a6"
      directlyReceivedPermissions.0.target:
-        "0x0ea6999172c1B4563695F76A52de73c848587b17"
      directlyReceivedPermissions.0.from:
+        "0x0ea6999172c1B4563695F76A52de73c848587b17"
    }
```

```diff
    contract ProxyAdmin (0xCcadc6B174BEcf31a35b818373e90391971a1C0c) {
    +++ description: None
      directlyReceivedPermissions.0.target:
-        "0xf59caf75e8A4bFBA4e6e07aD86C7E498E4d2519b"
      directlyReceivedPermissions.0.from:
+        "0xf59caf75e8A4bFBA4e6e07aD86C7E498E4d2519b"
    }
```

```diff
    contract L1CustomGateway (0xcEe284F754E854890e311e3280b767F80797180d) {
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
    contract BatchPosterManagerMultisig (0xd0FDA6925f502a3a94986dfe7C92FE19EBbD679B) {
    +++ description: None
      receivedPermissions.0.target:
-        "0x1c479675ad559DC151F6Ec7ed3FbF8ceE79582B6"
      receivedPermissions.0.from:
+        "0x1c479675ad559DC151F6Ec7ed3FbF8ceE79582B6"
    }
```

```diff
    contract ChallengeManager (0xe5896783a2F463446E1f624e64Aa6836BE4C6f58) {
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
      receivedPermissions.14.target:
-        "0xE6841D92B0C345144506576eC13ECf5103aC7f49"
      receivedPermissions.14.from:
+        "0xE6841D92B0C345144506576eC13ECf5103aC7f49"
      receivedPermissions.13.target:
-        "0xe5896783a2F463446E1f624e64Aa6836BE4C6f58"
      receivedPermissions.13.from:
+        "0xe5896783a2F463446E1f624e64Aa6836BE4C6f58"
      receivedPermissions.12.target:
-        "0xcEe284F754E854890e311e3280b767F80797180d"
      receivedPermissions.12.from:
+        "0xcEe284F754E854890e311e3280b767F80797180d"
      receivedPermissions.11.target:
-        "0xa3A7B6F88361F48403514059F1F16C8E78d60EeC"
      receivedPermissions.11.from:
+        "0xa3A7B6F88361F48403514059F1F16C8E78d60EeC"
      receivedPermissions.10.target:
-        "0x8315177aB297bA92A06054cE80a67Ed4DBd7ed3a"
      receivedPermissions.10.from:
+        "0x8315177aB297bA92A06054cE80a67Ed4DBd7ed3a"
      receivedPermissions.9.target:
-        "0x760723CD2e632826c38Fef8CD438A4CC7E7E1A40"
      receivedPermissions.9.from:
+        "0x760723CD2e632826c38Fef8CD438A4CC7E7E1A40"
      receivedPermissions.8.target:
-        "0x72Ce9c846789fdB6fC1f34aC4AD25Dd9ef7031ef"
      receivedPermissions.8.from:
+        "0x72Ce9c846789fdB6fC1f34aC4AD25Dd9ef7031ef"
      receivedPermissions.7.target:
-        "0x667e23ABd27E623c11d4CC00ca3EC4d0bD63337a"
      receivedPermissions.7.from:
+        "0x667e23ABd27E623c11d4CC00ca3EC4d0bD63337a"
      receivedPermissions.6.target:
-        "0x5eF0D09d1E6204141B4d37530808eD19f60FBa35"
      receivedPermissions.6.from:
+        "0x5eF0D09d1E6204141B4d37530808eD19f60FBa35"
      receivedPermissions.5.target:
-        "0x57Bd336d579A51938619271a7Cc137a46D0501B1"
      receivedPermissions.5.from:
+        "0x57Bd336d579A51938619271a7Cc137a46D0501B1"
      receivedPermissions.4.target:
-        "0x4Dbd4fc535Ac27206064B68FfCf827b0A60BAB3f"
      receivedPermissions.4.from:
+        "0x4Dbd4fc535Ac27206064B68FfCf827b0A60BAB3f"
      receivedPermissions.3.target:
-        "0x3ffFbAdAF827559da092217e474760E2b2c3CeDd"
      receivedPermissions.3.from:
+        "0x3ffFbAdAF827559da092217e474760E2b2c3CeDd"
      receivedPermissions.2.target:
-        "0x1c479675ad559DC151F6Ec7ed3FbF8ceE79582B6"
      receivedPermissions.2.from:
+        "0x1c479675ad559DC151F6Ec7ed3FbF8ceE79582B6"
      receivedPermissions.1.target:
-        "0x0B9857ae2D4A3DBe74ffE1d7DF045bb7F96E4840"
      receivedPermissions.1.from:
+        "0x0B9857ae2D4A3DBe74ffE1d7DF045bb7F96E4840"
      receivedPermissions.0.target:
-        "0x5eF0D09d1E6204141B4d37530808eD19f60FBa35"
      receivedPermissions.0.from:
+        "0x5eF0D09d1E6204141B4d37530808eD19f60FBa35"
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
    contract ValidatorWallet (0xf59caf75e8A4bFBA4e6e07aD86C7E498E4d2519b) {
    +++ description: None
      issuedPermissions.0.target:
-        "0xcd6BeDC12de2bF49afDE86cc91031d207318F207"
      issuedPermissions.0.via.0.delay:
-        0
      issuedPermissions.0.to:
+        "0xcd6BeDC12de2bF49afDE86cc91031d207318F207"
      receivedPermissions.0.target:
-        "0x5eF0D09d1E6204141B4d37530808eD19f60FBa35"
      receivedPermissions.0.from:
+        "0x5eF0D09d1E6204141B4d37530808eD19f60FBa35"
    }
```

Generated with discovered.json: 0x64942666c81b67e9fa8b22b6d59c15ece7d4854d

# Diff at Wed, 15 Jan 2025 07:35:33 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@3ea176aee1470e5ec80e65adfc81a954f84584d8 block: 21579690
- current block number: 21628418

## Description

Config related: displayName.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21579690 (main branch discovery), not current.

```diff
    contract ArbitrumProxyAdmin (0x554723262467F125Ac9e1cDFa9Ce15cc53822dbD) {
    +++ description: None
      displayName:
+        "ProxyAdmin"
    }
```

```diff
    contract UpgradeExecutorAdmin (0x5613AF0474EB9c528A34701A5b1662E3C8FA0678) {
    +++ description: None
      displayName:
+        "ProxyAdmin"
    }
```

```diff
    contract GatewaysAdmin (0x9aD46fac0Cf7f790E5be05A0F15223935A0c0aDa) {
    +++ description: None
      displayName:
+        "ProxyAdmin"
    }
```

Generated with discovered.json: 0x0f78aa65d5d96e91d8b5246ed92a299cecafc200

# Diff at Wed, 08 Jan 2025 12:15:21 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@3e3597c92f09cb5fc5a7ac01db63929f663c026f block: 21465139
- current block number: 21579690

## Description

Schedule SC member sync actions for L1, nova and arbitrum L2. The key rotation notice can be found [in the forum](https://forum.arbitrum.foundation/t/non-emergency-actions-to-facilitate-key-rotation-of-security-council-december-2024/27973).

## Watched changes

```diff
    contract L1Timelock (0xE6841D92B0C345144506576eC13ECf5103aC7f49) {
    +++ description: None
      values.scheduledTransactions.58:
+        {"id":"0xd0258e7181e0e16c61b990becf1f42e07e78a1f62b687fe1394dd20522c6ebc8","decoded":{"chain":"arbitrum","contractName":"SecurityCouncilMemberSyncAction","function":"perform","inputs":[{"name":"_securityCouncil","value":"0xADd68bCb0f66878aB9D37a447C7b9067C5dfa941"},{"name":"_updatedMembers","value":["0x882c6FCb3D358b9d70B97c6999159cea64168B6F","0x9A301de96b15Db3aB778E2969Bf6cAa909cA56E8","0x78bB97d2F3811256D7F0041E81Aaf4B426eF3b67","0x33ddb82e68940f0e4C1050885BcE8faF5Ddd1b93","0xe2e9d5B97d8C0457B1cf80BC93802bce4DF03e33","0x59c8535419BbCb8AdFFDB3C835435E907e3B183B","0x0275b3D54a5dDbf8205A75984796eFE8b7357Bae","0x5DD2205C3aac13E592F0a3D85188c948D1781df1","0x5a09A94eE8198D3c474d723337aa58023810022C","0x475816ca2a31D601B4e336f5c2418A67978aBf09","0x9316ca66f5f936E3239e4fD2AAAEA5C7b6f3C4cC","0x444EDf8B90763bE7015F1F099a0dA0ef10250c71"]},{"name":"_nonce","value":12}],"address":"0x9BF7b8884Fa381a45f8CB2525905fb36C996297a","calldata":"0x536d8944000000000000000000000000add68bcb0f66878ab9d37a447c7b9067c5dfa9410000000000000000000000000000000000000000000000000000000000000060000000000000000000000000000000000000000000000000000000000000000c000000000000000000000000000000000000000000000000000000000000000c000000000000000000000000882c6fcb3d358b9d70b97c6999159cea64168b6f0000000000000000000000009a301de96b15db3ab778e2969bf6caa909ca56e800000000000000000000000078bb97d2f3811256d7f0041e81aaf4b426ef3b6700000000000000000000000033ddb82e68940f0e4c1050885bce8faf5ddd1b93000000000000000000000000e2e9d5b97d8c0457b1cf80bc93802bce4df03e3300000000000000000000000059c8535419bbcb8adffdb3c835435e907e3b183b0000000000000000000000000275b3d54a5ddbf8205a75984796efe8b7357bae0000000000000000000000005dd2205c3aac13e592f0a3d85188c948d1781df10000000000000000000000005a09a94ee8198d3c474d723337aa58023810022c000000000000000000000000475816ca2a31d601b4e336f5c2418a67978abf090000000000000000000000009316ca66f5f936e3239e4fd2aaaea5c7b6f3c4cc000000000000000000000000444edf8b90763be7015f1f099a0da0ef10250c71","executor":"0xCF57572261c7c2BCF21ffD220ea7d1a27D40A827","inboxOnEthereum":"0x4Dbd4fc535Ac27206064B68FfCf827b0A60BAB3f"},"raw":{"target":"0xa723C008e76E379c55599D2E4d93879BeaFDa79C","value":0,"data":"0x0000000000000000000000004dbd4fc535ac27206064b68ffcf827b0a60bab3f000000000000000000000000cf57572261c7c2bcf21ffd220ea7d1a27d40a82700000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000c000000000000000000000000000000000000000000000000000000000000002841cff79cd0000000000000000000000009bf7b8884fa381a45f8cb2525905fb36c996297a00000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000204536d8944000000000000000000000000add68bcb0f66878ab9d37a447c7b9067c5dfa9410000000000000000000000000000000000000000000000000000000000000060000000000000000000000000000000000000000000000000000000000000000c000000000000000000000000000000000000000000000000000000000000000c000000000000000000000000882c6fcb3d358b9d70b97c6999159cea64168b6f0000000000000000000000009a301de96b15db3ab778e2969bf6caa909ca56e800000000000000000000000078bb97d2f3811256d7f0041e81aaf4b426ef3b6700000000000000000000000033ddb82e68940f0e4c1050885bce8faf5ddd1b93000000000000000000000000e2e9d5b97d8c0457b1cf80bc93802bce4df03e3300000000000000000000000059c8535419bbcb8adffdb3c835435e907e3b183b0000000000000000000000000275b3d54a5ddbf8205a75984796efe8b7357bae0000000000000000000000005dd2205c3aac13e592f0a3d85188c948d1781df10000000000000000000000005a09a94ee8198d3c474d723337aa58023810022c000000000000000000000000475816ca2a31d601b4e336f5c2418a67978abf090000000000000000000000009316ca66f5f936e3239e4fd2aaaea5c7b6f3c4cc000000000000000000000000444edf8b90763be7015f1f099a0da0ef10250c710000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000","delay":259200}}
      values.scheduledTransactions.57:
+        {"id":"0xd0258e7181e0e16c61b990becf1f42e07e78a1f62b687fe1394dd20522c6ebc8","decoded":{"chain":"nova","address":"0x9BF7b8884Fa381a45f8CB2525905fb36C996297a","calldata":"0x536d8944000000000000000000000000c232ee726e3c51b86778bb4dbe61c52cc07a60f30000000000000000000000000000000000000000000000000000000000000060000000000000000000000000000000000000000000000000000000000000000c000000000000000000000000000000000000000000000000000000000000000c000000000000000000000000882c6fcb3d358b9d70b97c6999159cea64168b6f0000000000000000000000009a301de96b15db3ab778e2969bf6caa909ca56e800000000000000000000000078bb97d2f3811256d7f0041e81aaf4b426ef3b6700000000000000000000000033ddb82e68940f0e4c1050885bce8faf5ddd1b93000000000000000000000000e2e9d5b97d8c0457b1cf80bc93802bce4df03e3300000000000000000000000059c8535419bbcb8adffdb3c835435e907e3b183b0000000000000000000000000275b3d54a5ddbf8205a75984796efe8b7357bae0000000000000000000000005dd2205c3aac13e592f0a3d85188c948d1781df10000000000000000000000005a09a94ee8198d3c474d723337aa58023810022c000000000000000000000000475816ca2a31d601b4e336f5c2418a67978abf090000000000000000000000009316ca66f5f936e3239e4fd2aaaea5c7b6f3c4cc000000000000000000000000444edf8b90763be7015f1f099a0da0ef10250c71","executor":"0x86a02dD71363c440b21F4c0E5B2Ad01Ffe1A7482","inboxOnEthereum":"0xc4448b71118c9071Bcb9734A0EAc55D18A153949"},"raw":{"target":"0xa723C008e76E379c55599D2E4d93879BeaFDa79C","value":0,"data":"0x000000000000000000000000c4448b71118c9071bcb9734a0eac55d18a15394900000000000000000000000086a02dd71363c440b21f4c0e5b2ad01ffe1a748200000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000c000000000000000000000000000000000000000000000000000000000000002841cff79cd0000000000000000000000009bf7b8884fa381a45f8cb2525905fb36c996297a00000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000204536d8944000000000000000000000000c232ee726e3c51b86778bb4dbe61c52cc07a60f30000000000000000000000000000000000000000000000000000000000000060000000000000000000000000000000000000000000000000000000000000000c000000000000000000000000000000000000000000000000000000000000000c000000000000000000000000882c6fcb3d358b9d70b97c6999159cea64168b6f0000000000000000000000009a301de96b15db3ab778e2969bf6caa909ca56e800000000000000000000000078bb97d2f3811256d7f0041e81aaf4b426ef3b6700000000000000000000000033ddb82e68940f0e4c1050885bce8faf5ddd1b93000000000000000000000000e2e9d5b97d8c0457b1cf80bc93802bce4df03e3300000000000000000000000059c8535419bbcb8adffdb3c835435e907e3b183b0000000000000000000000000275b3d54a5ddbf8205a75984796efe8b7357bae0000000000000000000000005dd2205c3aac13e592f0a3d85188c948d1781df10000000000000000000000005a09a94ee8198d3c474d723337aa58023810022c000000000000000000000000475816ca2a31d601b4e336f5c2418a67978abf090000000000000000000000009316ca66f5f936e3239e4fd2aaaea5c7b6f3c4cc000000000000000000000000444edf8b90763be7015f1f099a0da0ef10250c710000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000","delay":259200}}
      values.scheduledTransactions.56:
+        {"id":"0xd0258e7181e0e16c61b990becf1f42e07e78a1f62b687fe1394dd20522c6ebc8","decoded":{"chain":"arbitrum","contractName":"SecurityCouncilMemberSyncAction","function":"perform","inputs":[{"name":"_securityCouncil","value":"0x423552c0F05baCCac5Bfa91C6dCF1dc53a0A1641"},{"name":"_updatedMembers","value":["0x882c6FCb3D358b9d70B97c6999159cea64168B6F","0x9A301de96b15Db3aB778E2969Bf6cAa909cA56E8","0x78bB97d2F3811256D7F0041E81Aaf4B426eF3b67","0x33ddb82e68940f0e4C1050885BcE8faF5Ddd1b93","0xe2e9d5B97d8C0457B1cf80BC93802bce4DF03e33","0x59c8535419BbCb8AdFFDB3C835435E907e3B183B","0x0275b3D54a5dDbf8205A75984796eFE8b7357Bae","0x5DD2205C3aac13E592F0a3D85188c948D1781df1","0x5a09A94eE8198D3c474d723337aa58023810022C","0x475816ca2a31D601B4e336f5c2418A67978aBf09","0x9316ca66f5f936E3239e4fD2AAAEA5C7b6f3C4cC","0x444EDf8B90763bE7015F1F099a0dA0ef10250c71"]},{"name":"_nonce","value":12}],"address":"0x9BF7b8884Fa381a45f8CB2525905fb36C996297a","calldata":"0x536d8944000000000000000000000000423552c0f05baccac5bfa91c6dcf1dc53a0a16410000000000000000000000000000000000000000000000000000000000000060000000000000000000000000000000000000000000000000000000000000000c000000000000000000000000000000000000000000000000000000000000000c000000000000000000000000882c6fcb3d358b9d70b97c6999159cea64168b6f0000000000000000000000009a301de96b15db3ab778e2969bf6caa909ca56e800000000000000000000000078bb97d2f3811256d7f0041e81aaf4b426ef3b6700000000000000000000000033ddb82e68940f0e4c1050885bce8faf5ddd1b93000000000000000000000000e2e9d5b97d8c0457b1cf80bc93802bce4df03e3300000000000000000000000059c8535419bbcb8adffdb3c835435e907e3b183b0000000000000000000000000275b3d54a5ddbf8205a75984796efe8b7357bae0000000000000000000000005dd2205c3aac13e592f0a3d85188c948d1781df10000000000000000000000005a09a94ee8198d3c474d723337aa58023810022c000000000000000000000000475816ca2a31d601b4e336f5c2418a67978abf090000000000000000000000009316ca66f5f936e3239e4fd2aaaea5c7b6f3c4cc000000000000000000000000444edf8b90763be7015f1f099a0da0ef10250c71","executor":"0xCF57572261c7c2BCF21ffD220ea7d1a27D40A827","inboxOnEthereum":"0x4Dbd4fc535Ac27206064B68FfCf827b0A60BAB3f"},"raw":{"target":"0xa723C008e76E379c55599D2E4d93879BeaFDa79C","value":0,"data":"0x0000000000000000000000004dbd4fc535ac27206064b68ffcf827b0a60bab3f000000000000000000000000cf57572261c7c2bcf21ffd220ea7d1a27d40a82700000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000c000000000000000000000000000000000000000000000000000000000000002841cff79cd0000000000000000000000009bf7b8884fa381a45f8cb2525905fb36c996297a00000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000204536d8944000000000000000000000000423552c0f05baccac5bfa91c6dcf1dc53a0a16410000000000000000000000000000000000000000000000000000000000000060000000000000000000000000000000000000000000000000000000000000000c000000000000000000000000000000000000000000000000000000000000000c000000000000000000000000882c6fcb3d358b9d70b97c6999159cea64168b6f0000000000000000000000009a301de96b15db3ab778e2969bf6caa909ca56e800000000000000000000000078bb97d2f3811256d7f0041e81aaf4b426ef3b6700000000000000000000000033ddb82e68940f0e4c1050885bce8faf5ddd1b93000000000000000000000000e2e9d5b97d8c0457b1cf80bc93802bce4df03e3300000000000000000000000059c8535419bbcb8adffdb3c835435e907e3b183b0000000000000000000000000275b3d54a5ddbf8205a75984796efe8b7357bae0000000000000000000000005dd2205c3aac13e592f0a3d85188c948d1781df10000000000000000000000005a09a94ee8198d3c474d723337aa58023810022c000000000000000000000000475816ca2a31d601b4e336f5c2418a67978abf090000000000000000000000009316ca66f5f936e3239e4fd2aaaea5c7b6f3c4cc000000000000000000000000444edf8b90763be7015f1f099a0da0ef10250c710000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000","delay":259200}}
      values.scheduledTransactions.55:
+        {"id":"0xd0258e7181e0e16c61b990becf1f42e07e78a1f62b687fe1394dd20522c6ebc8","decoded":{"chain":"ethereum","contractName":"SecurityCouncilMemberSyncAction","function":"perform","inputs":[{"name":"_securityCouncil","value":"0xF06E95eF589D9c38af242a8AAee8375f14023F85"},{"name":"_updatedMembers","value":["0x882c6FCb3D358b9d70B97c6999159cea64168B6F","0x9A301de96b15Db3aB778E2969Bf6cAa909cA56E8","0x78bB97d2F3811256D7F0041E81Aaf4B426eF3b67","0x33ddb82e68940f0e4C1050885BcE8faF5Ddd1b93","0xe2e9d5B97d8C0457B1cf80BC93802bce4DF03e33","0x59c8535419BbCb8AdFFDB3C835435E907e3B183B","0x0275b3D54a5dDbf8205A75984796eFE8b7357Bae","0x5DD2205C3aac13E592F0a3D85188c948D1781df1","0x5a09A94eE8198D3c474d723337aa58023810022C","0x475816ca2a31D601B4e336f5c2418A67978aBf09","0x9316ca66f5f936E3239e4fD2AAAEA5C7b6f3C4cC","0x444EDf8B90763bE7015F1F099a0dA0ef10250c71"]},{"name":"_nonce","value":12}],"address":"0x9BF7b8884Fa381a45f8CB2525905fb36C996297a","calldata":"0x536d8944000000000000000000000000f06e95ef589d9c38af242a8aaee8375f14023f850000000000000000000000000000000000000000000000000000000000000060000000000000000000000000000000000000000000000000000000000000000c000000000000000000000000000000000000000000000000000000000000000c000000000000000000000000882c6fcb3d358b9d70b97c6999159cea64168b6f0000000000000000000000009a301de96b15db3ab778e2969bf6caa909ca56e800000000000000000000000078bb97d2f3811256d7f0041e81aaf4b426ef3b6700000000000000000000000033ddb82e68940f0e4c1050885bce8faf5ddd1b93000000000000000000000000e2e9d5b97d8c0457b1cf80bc93802bce4df03e3300000000000000000000000059c8535419bbcb8adffdb3c835435e907e3b183b0000000000000000000000000275b3d54a5ddbf8205a75984796efe8b7357bae0000000000000000000000005dd2205c3aac13e592f0a3d85188c948d1781df10000000000000000000000005a09a94ee8198d3c474d723337aa58023810022c000000000000000000000000475816ca2a31d601b4e336f5c2418a67978abf090000000000000000000000009316ca66f5f936e3239e4fd2aaaea5c7b6f3c4cc000000000000000000000000444edf8b90763be7015f1f099a0da0ef10250c71","executor":"0x3ffFbAdAF827559da092217e474760E2b2c3CeDd"},"raw":{"target":"0x3ffFbAdAF827559da092217e474760E2b2c3CeDd","value":0,"data":"0x1cff79cd0000000000000000000000009bf7b8884fa381a45f8cb2525905fb36c996297a00000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000204536d8944000000000000000000000000f06e95ef589d9c38af242a8aaee8375f14023f850000000000000000000000000000000000000000000000000000000000000060000000000000000000000000000000000000000000000000000000000000000c000000000000000000000000000000000000000000000000000000000000000c000000000000000000000000882c6fcb3d358b9d70b97c6999159cea64168b6f0000000000000000000000009a301de96b15db3ab778e2969bf6caa909ca56e800000000000000000000000078bb97d2f3811256d7f0041e81aaf4b426ef3b6700000000000000000000000033ddb82e68940f0e4c1050885bce8faf5ddd1b93000000000000000000000000e2e9d5b97d8c0457b1cf80bc93802bce4df03e3300000000000000000000000059c8535419bbcb8adffdb3c835435e907e3b183b0000000000000000000000000275b3d54a5ddbf8205a75984796efe8b7357bae0000000000000000000000005dd2205c3aac13e592f0a3d85188c948d1781df10000000000000000000000005a09a94ee8198d3c474d723337aa58023810022c000000000000000000000000475816ca2a31d601b4e336f5c2418a67978abf090000000000000000000000009316ca66f5f936e3239e4fd2aaaea5c7b6f3c4cc000000000000000000000000444edf8b90763be7015f1f099a0da0ef10250c7100000000000000000000000000000000000000000000000000000000","delay":259200}}
    }
```

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
discovery. Values are for block 21465139 (main branch discovery), not current.

```diff
    contract Bridge (0x8315177aB297bA92A06054cE80a67Ed4DBd7ed3a) {
    +++ description: Escrow contract for the project's gas token (can be different from ETH). Keeps a list of allowed Inboxes and Outboxes for canonical bridge messaging.
      description:
-        "Escrow contract for the project's gas token (Can be different from ETH). Keeps a list of allowed Inboxes and Outboxes for canonical bridge messaging."
+        "Escrow contract for the project's gas token (can be different from ETH). Keeps a list of allowed Inboxes and Outboxes for canonical bridge messaging."
    }
```

Generated with discovered.json: 0x2c6c1509b6d988827f03dc4a7f815d52f0240379

# Diff at Mon, 23 Dec 2024 12:21:03 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@18325a975c44684702f30ee366361589e4c2ed8c block: 21292271
- current block number: 21465139

## Description

Config related: Celestia-Nitro wmroot added.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21292271 (main branch discovery), not current.

```diff
    contract RollupProxy (0x5eF0D09d1E6204141B4d37530808eD19f60FBa35) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      usedTypes.0.arg.0xe81f986823a85105c5fd91bb53b4493d38c0c26652d23f76a7405ac889908287:
+        "Celestia Nitro 3.2.1 wasmModuleRoot"
    }
```

Generated with discovered.json: 0x5d93c55a988948c251a2389063d25903b589fe52

# Diff at Fri, 06 Dec 2024 08:09:40 GMT:

- author: Piotr Szlachciak (<szlachciak.piotr@gmail.com>)
- comparing to: main@f9ded76f7930b0c86788e4c4595d553b165b87d1 block: 21292271
- current block number: 21292271

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21292271 (main branch discovery), not current.

```diff
    contract ValidatorUtils (0x9E40625F52829Cf04bC4839F186D621ee33b0E67) {
    +++ description: This contract implements view only utilities for validators.
      template:
+        "orbitstack/ValidatorUtils"
      description:
+        "This contract implements view only utilities for validators."
    }
```

Generated with discovered.json: 0xb73df37622950b7a510cb205e84e421c90c7008c

# Diff at Fri, 29 Nov 2024 11:28:37 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@9776abb8b1f960f6f1ec6ec27558b5eff7eb5b87 block: 21292271
- current block number: 21292271

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21292271 (main branch discovery), not current.

```diff
    contract SequencerInbox (0x1c479675ad559DC151F6Ec7ed3FbF8ceE79582B6) {
    +++ description: A sequencer (registered in this contract) can submit transaction batches or commitments here.
      issuedPermissions.3:
+        {"permission":"upgrade","target":"0xE6841D92B0C345144506576eC13ECf5103aC7f49","via":[{"address":"0x3ffFbAdAF827559da092217e474760E2b2c3CeDd","delay":0},{"address":"0x554723262467F125Ac9e1cDFa9Ce15cc53822dbD","delay":0}]}
      issuedPermissions.2.permission:
-        "upgrade"
+        "sequence"
      issuedPermissions.2.target:
-        "0xE6841D92B0C345144506576eC13ECf5103aC7f49"
+        "0xC1b634853Cb333D3aD8663715b08f41A3Aec47cc"
      issuedPermissions.2.via.1:
-        {"address":"0x554723262467F125Ac9e1cDFa9Ce15cc53822dbD","delay":0}
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
    contract RollupProxy (0x5eF0D09d1E6204141B4d37530808eD19f60FBa35) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      issuedPermissions.0.via.0.description:
-        "can pause and unpause and set important roles and parameters in the system contracts: Can delegate Sequencer management to a BatchPosterManager address, manage data availability and DACs, set the Sequencer-only window, introduce an allowList to the bridge and whitelist Inboxes/Outboxes."
+        "Pause and unpause and set important roles and parameters in the system contracts: Can delegate Sequencer management to a BatchPosterManager address, manage data availability and DACs, set the Sequencer-only window, introduce an allowList to the bridge and whitelist Inboxes/Outboxes."
      fieldMeta.minimumAssertionPeriod:
+        {"description":"Minimum time delta between newly created nodes (stateUpdates). This is checked on `stakeOnNewNode()`. Format is number of ETHEREUM blocks, even for L3s. "}
    }
```

```diff
    contract BatchPosterManagerMultisig (0xd0FDA6925f502a3a94986dfe7C92FE19EBbD679B) {
    +++ description: None
      receivedPermissions:
+        [{"permission":"configure","target":"0x1c479675ad559DC151F6Ec7ed3FbF8ceE79582B6","description":"Add/remove batchPosters (Sequencers)."}]
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

Generated with discovered.json: 0x96dd39fb696694e141ac3f3f3d83c6e3f2cfc394

# Diff at Fri, 29 Nov 2024 08:51:30 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@c60f4ba86fcd7b86d6876d1634b83081095f33d7 block: 21234618
- current block number: 21292271

## Description

Config changes: add source shapes for arbitrum contracts on ethereum where applicable.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21234618 (main branch discovery), not current.

```diff
    contract Outbox (0x0B9857ae2D4A3DBe74ffE1d7DF045bb7F96E4840) {
    +++ description: Facilitates L2 to L1 contract calls: Messages initiated from L2 (for example withdrawal messages) eventually resolve in execution on L1.
      issuedPermissions.0.target:
-        "0x3ffFbAdAF827559da092217e474760E2b2c3CeDd"
+        "0xE6841D92B0C345144506576eC13ECf5103aC7f49"
      issuedPermissions.0.via.1:
+        {"address":"0x554723262467F125Ac9e1cDFa9Ce15cc53822dbD","delay":0}
      issuedPermissions.0.via.0.address:
-        "0x554723262467F125Ac9e1cDFa9Ce15cc53822dbD"
+        "0x3ffFbAdAF827559da092217e474760E2b2c3CeDd"
      template:
+        "orbitstack/Outbox"
      description:
+        "Facilitates L2 to L1 contract calls: Messages initiated from L2 (for example withdrawal messages) eventually resolve in execution on L1."
    }
```

```diff
    contract SequencerInbox (0x1c479675ad559DC151F6Ec7ed3FbF8ceE79582B6) {
    +++ description: A sequencer (registered in this contract) can submit transaction batches or commitments here.
      issuedPermissions.2.target:
-        "0x3ffFbAdAF827559da092217e474760E2b2c3CeDd"
+        "0xE6841D92B0C345144506576eC13ECf5103aC7f49"
      issuedPermissions.2.via.1:
+        {"address":"0x554723262467F125Ac9e1cDFa9Ce15cc53822dbD","delay":0}
      issuedPermissions.2.via.0.address:
-        "0x554723262467F125Ac9e1cDFa9Ce15cc53822dbD"
+        "0x3ffFbAdAF827559da092217e474760E2b2c3CeDd"
      values.IS_HARDCODED_SEQUENCER_BATCH_POSTER:
-        true
+++ description: Settable by the Rollup Owner. Transactions can only be force-included after the `delayBlocks` window (Sequencer-only) has passed.
      values.maxTimeVariation:
-        [5760,64,86400,768]
+        {"delayBlocks":5760,"futureBlocks":64,"delaySeconds":86400,"futureSeconds":768}
      values.dacKeyset:
+        {"requiredSignatures":0,"membersCount":0,"blsSignatures":[]}
      template:
+        "orbitstack/SequencerInbox"
      description:
+        "A sequencer (registered in this contract) can submit transaction batches or commitments here."
      fieldMeta:
+        {"maxTimeVariation":{"description":"Settable by the Rollup Owner. Transactions can only be force-included after the `delayBlocks` window (Sequencer-only) has passed."}}
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
-        [{"permission":"configure","target":"0x5eF0D09d1E6204141B4d37530808eD19f60FBa35","description":"can pause and unpause and set important roles and parameters in the system contracts: Can delegate Sequencer management to a BatchPosterManager address, manage data availability and DACs, set the Sequencer-only window, introduce an allowList to the bridge and whitelist Inboxes/Outboxes."},{"permission":"upgrade","target":"0x0B9857ae2D4A3DBe74ffE1d7DF045bb7F96E4840","via":[{"address":"0x554723262467F125Ac9e1cDFa9Ce15cc53822dbD"}]},{"permission":"upgrade","target":"0x1c479675ad559DC151F6Ec7ed3FbF8ceE79582B6","via":[{"address":"0x554723262467F125Ac9e1cDFa9Ce15cc53822dbD"}]},{"permission":"upgrade","target":"0x3ffFbAdAF827559da092217e474760E2b2c3CeDd","via":[{"address":"0x5613AF0474EB9c528A34701A5b1662E3C8FA0678"}]},{"permission":"upgrade","target":"0x4Dbd4fc535Ac27206064B68FfCf827b0A60BAB3f","via":[{"address":"0x554723262467F125Ac9e1cDFa9Ce15cc53822dbD"}]},{"permission":"upgrade","target":"0x57Bd336d579A51938619271a7Cc137a46D0501B1","via":[{"address":"0x554723262467F125Ac9e1cDFa9Ce15cc53822dbD"}]},{"permission":"upgrade","target":"0x5eF0D09d1E6204141B4d37530808eD19f60FBa35"},{"permission":"upgrade","target":"0x667e23ABd27E623c11d4CC00ca3EC4d0bD63337a","via":[{"address":"0x554723262467F125Ac9e1cDFa9Ce15cc53822dbD"}]},{"permission":"upgrade","target":"0x760723CD2e632826c38Fef8CD438A4CC7E7E1A40","via":[{"address":"0x554723262467F125Ac9e1cDFa9Ce15cc53822dbD"}]},{"permission":"upgrade","target":"0x8315177aB297bA92A06054cE80a67Ed4DBd7ed3a","via":[{"address":"0x554723262467F125Ac9e1cDFa9Ce15cc53822dbD"}]},{"permission":"upgrade","target":"0xe5896783a2F463446E1f624e64Aa6836BE4C6f58","via":[{"address":"0x554723262467F125Ac9e1cDFa9Ce15cc53822dbD"}]},{"permission":"upgrade","target":"0xE6841D92B0C345144506576eC13ECf5103aC7f49","via":[{"address":"0x5613AF0474EB9c528A34701A5b1662E3C8FA0678"}]}]
      directlyReceivedPermissions.5:
+        {"permission":"upgrade","target":"0x5eF0D09d1E6204141B4d37530808eD19f60FBa35"}
      directlyReceivedPermissions.4:
+        {"permission":"configure","target":"0x5eF0D09d1E6204141B4d37530808eD19f60FBa35","description":"can pause and unpause and set important roles and parameters in the system contracts: Can delegate Sequencer management to a BatchPosterManager address, manage data availability and DACs, set the Sequencer-only window, introduce an allowList to the bridge and whitelist Inboxes/Outboxes."}
      directlyReceivedPermissions.3:
+        {"permission":"act","target":"0xF06E95eF589D9c38af242a8AAee8375f14023F85"}
      directlyReceivedPermissions.2.target:
-        "0xF06E95eF589D9c38af242a8AAee8375f14023F85"
+        "0x9aD46fac0Cf7f790E5be05A0F15223935A0c0aDa"
      values.executors:
+        ["0xE6841D92B0C345144506576eC13ECf5103aC7f49","0xF06E95eF589D9c38af242a8AAee8375f14023F85"]
      template:
+        "orbitstack/UpgradeExecutor"
      description:
+        "Central contract defining the access control permissions for upgrading the system contract implementations."
    }
```

```diff
    contract Inbox (0x4Dbd4fc535Ac27206064B68FfCf827b0A60BAB3f) {
    +++ description: Facilitates sending L1 to L2 messages like depositing ETH, but does not escrow funds.
      issuedPermissions.0.target:
-        "0x3ffFbAdAF827559da092217e474760E2b2c3CeDd"
+        "0xE6841D92B0C345144506576eC13ECf5103aC7f49"
      issuedPermissions.0.via.1:
+        {"address":"0x554723262467F125Ac9e1cDFa9Ce15cc53822dbD","delay":0}
      issuedPermissions.0.via.0.address:
-        "0x554723262467F125Ac9e1cDFa9Ce15cc53822dbD"
+        "0x3ffFbAdAF827559da092217e474760E2b2c3CeDd"
      template:
+        "orbitstack/Inbox"
      description:
+        "Facilitates sending L1 to L2 messages like depositing ETH, but does not escrow funds."
    }
```

```diff
    contract RollupEventInbox (0x57Bd336d579A51938619271a7Cc137a46D0501B1) {
    +++ description: Helper contract sending configuration data over the bridge during the systems initialization.
      issuedPermissions.0.target:
-        "0x3ffFbAdAF827559da092217e474760E2b2c3CeDd"
+        "0xE6841D92B0C345144506576eC13ECf5103aC7f49"
      issuedPermissions.0.via.1:
+        {"address":"0x554723262467F125Ac9e1cDFa9Ce15cc53822dbD","delay":0}
      issuedPermissions.0.via.0.address:
-        "0x554723262467F125Ac9e1cDFa9Ce15cc53822dbD"
+        "0x3ffFbAdAF827559da092217e474760E2b2c3CeDd"
    }
```

```diff
    contract RollupProxy (0x5eF0D09d1E6204141B4d37530808eD19f60FBa35) {
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

```diff
    contract OutboxV0 (0x667e23ABd27E623c11d4CC00ca3EC4d0bD63337a) {
    +++ description: None
      issuedPermissions.0.target:
-        "0x3ffFbAdAF827559da092217e474760E2b2c3CeDd"
+        "0xE6841D92B0C345144506576eC13ECf5103aC7f49"
      issuedPermissions.0.via.1:
+        {"address":"0x554723262467F125Ac9e1cDFa9Ce15cc53822dbD","delay":0}
      issuedPermissions.0.via.0.address:
-        "0x554723262467F125Ac9e1cDFa9Ce15cc53822dbD"
+        "0x3ffFbAdAF827559da092217e474760E2b2c3CeDd"
    }
```

```diff
    contract L1GatewayRouter (0x72Ce9c846789fdB6fC1f34aC4AD25Dd9ef7031ef) {
    +++ description: This routing contract maps tokens to the correct escrow (gateway) to be then bridged with canonical messaging.
      issuedPermissions.0.target:
-        "0x9aD46fac0Cf7f790E5be05A0F15223935A0c0aDa"
+        "0xE6841D92B0C345144506576eC13ECf5103aC7f49"
      issuedPermissions.0.via.1:
+        {"address":"0x9aD46fac0Cf7f790E5be05A0F15223935A0c0aDa","delay":0}
      issuedPermissions.0.via.0:
+        {"address":"0x3ffFbAdAF827559da092217e474760E2b2c3CeDd","delay":0}
    }
```

```diff
    contract Validator (0x758C6bB08B3ea5889B5cddbdeF9A45b3a983c398) {
    +++ description: None
      issuedPermissions.0.target:
-        "0xAb33350E0319466A81D2AE6DC5CdF2518123f766"
+        "0xE89eACE17073663D9c6337Cc2Ca25bc28e5fc82E"
      issuedPermissions.0.via.0:
+        {"address":"0xAb33350E0319466A81D2AE6DC5CdF2518123f766","delay":0}
    }
```

```diff
    contract OutboxV1 (0x760723CD2e632826c38Fef8CD438A4CC7E7E1A40) {
    +++ description: None
      issuedPermissions.0.target:
-        "0x3ffFbAdAF827559da092217e474760E2b2c3CeDd"
+        "0xE6841D92B0C345144506576eC13ECf5103aC7f49"
      issuedPermissions.0.via.1:
+        {"address":"0x554723262467F125Ac9e1cDFa9Ce15cc53822dbD","delay":0}
      issuedPermissions.0.via.0.address:
-        "0x554723262467F125Ac9e1cDFa9Ce15cc53822dbD"
+        "0x3ffFbAdAF827559da092217e474760E2b2c3CeDd"
    }
```

```diff
    contract Bridge (0x8315177aB297bA92A06054cE80a67Ed4DBd7ed3a) {
    +++ description: Escrow contract for the project's gas token (Can be different from ETH). Keeps a list of allowed Inboxes and Outboxes for canonical bridge messaging.
      issuedPermissions.0.target:
-        "0x3ffFbAdAF827559da092217e474760E2b2c3CeDd"
+        "0xE6841D92B0C345144506576eC13ECf5103aC7f49"
      issuedPermissions.0.via.1:
+        {"address":"0x554723262467F125Ac9e1cDFa9Ce15cc53822dbD","delay":0}
      issuedPermissions.0.via.0.address:
-        "0x554723262467F125Ac9e1cDFa9Ce15cc53822dbD"
+        "0x3ffFbAdAF827559da092217e474760E2b2c3CeDd"
      template:
+        "orbitstack/Bridge"
      description:
+        "Escrow contract for the project's gas token (Can be different from ETH). Keeps a list of allowed Inboxes and Outboxes for canonical bridge messaging."
    }
```

```diff
    contract GatewaysAdmin (0x9aD46fac0Cf7f790E5be05A0F15223935A0c0aDa) {
    +++ description: None
      receivedPermissions:
-        [{"permission":"upgrade","target":"0x72Ce9c846789fdB6fC1f34aC4AD25Dd9ef7031ef"},{"permission":"upgrade","target":"0xa3A7B6F88361F48403514059F1F16C8E78d60EeC"},{"permission":"upgrade","target":"0xcEe284F754E854890e311e3280b767F80797180d"}]
      template:
+        "global/ProxyAdmin"
      directlyReceivedPermissions:
+        [{"permission":"upgrade","target":"0x72Ce9c846789fdB6fC1f34aC4AD25Dd9ef7031ef"},{"permission":"upgrade","target":"0xa3A7B6F88361F48403514059F1F16C8E78d60EeC"},{"permission":"upgrade","target":"0xcEe284F754E854890e311e3280b767F80797180d"}]
    }
```

```diff
    contract L1ERC20Gateway (0xa3A7B6F88361F48403514059F1F16C8E78d60EeC) {
    +++ description: Escrows deposited ERC-20 assets for the canonical Bridge. Upon depositing, a generic token representation will be minted at the destination. Withdrawals are initiated by the Outbox contract.
      issuedPermissions.0.target:
-        "0x9aD46fac0Cf7f790E5be05A0F15223935A0c0aDa"
+        "0xE6841D92B0C345144506576eC13ECf5103aC7f49"
      issuedPermissions.0.via.1:
+        {"address":"0x9aD46fac0Cf7f790E5be05A0F15223935A0c0aDa","delay":0}
      issuedPermissions.0.via.0:
+        {"address":"0x3ffFbAdAF827559da092217e474760E2b2c3CeDd","delay":0}
      template:
+        "orbitstack/ERC20Gateway"
      displayName:
+        "ERC20Gateway"
      description:
+        "Escrows deposited ERC-20 assets for the canonical Bridge. Upon depositing, a generic token representation will be minted at the destination. Withdrawals are initiated by the Outbox contract."
    }
```

```diff
    contract ProxyAdmin (0xAb33350E0319466A81D2AE6DC5CdF2518123f766) {
    +++ description: None
      receivedPermissions:
-        [{"permission":"upgrade","target":"0x758C6bB08B3ea5889B5cddbdeF9A45b3a983c398"}]
      template:
+        "global/ProxyAdmin"
      directlyReceivedPermissions:
+        [{"permission":"upgrade","target":"0x758C6bB08B3ea5889B5cddbdeF9A45b3a983c398"}]
    }
```

```diff
-   Status: DELETED
    contract  (0xb5f6951AB2504442c3F6dD37fF1E1D1d253C5097)
    +++ description: None
```

```diff
    contract L1CustomGateway (0xcEe284F754E854890e311e3280b767F80797180d) {
    +++ description: Escrows deposited assets for the canonical bridge that are externally governed or need custom token contracts with e.g. minting rights or upgradeability.
      issuedPermissions.0.target:
-        "0x9aD46fac0Cf7f790E5be05A0F15223935A0c0aDa"
+        "0xE6841D92B0C345144506576eC13ECf5103aC7f49"
      issuedPermissions.0.via.1:
+        {"address":"0x9aD46fac0Cf7f790E5be05A0F15223935A0c0aDa","delay":0}
      issuedPermissions.0.via.0:
+        {"address":"0x3ffFbAdAF827559da092217e474760E2b2c3CeDd","delay":0}
    }
```

```diff
    contract ChallengeManager (0xe5896783a2F463446E1f624e64Aa6836BE4C6f58) {
    +++ description: Contract that allows challenging state roots. Can be called through the RollupProxy by Validators or the UpgradeExecutor.
      issuedPermissions.0.target:
-        "0x3ffFbAdAF827559da092217e474760E2b2c3CeDd"
+        "0xE6841D92B0C345144506576eC13ECf5103aC7f49"
      issuedPermissions.0.via.1:
+        {"address":"0x554723262467F125Ac9e1cDFa9Ce15cc53822dbD","delay":0}
      issuedPermissions.0.via.0.address:
-        "0x554723262467F125Ac9e1cDFa9Ce15cc53822dbD"
+        "0x3ffFbAdAF827559da092217e474760E2b2c3CeDd"
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
+        [{"permission":"configure","target":"0x5eF0D09d1E6204141B4d37530808eD19f60FBa35","description":"can pause and unpause and set important roles and parameters in the system contracts: Can delegate Sequencer management to a BatchPosterManager address, manage data availability and DACs, set the Sequencer-only window, introduce an allowList to the bridge and whitelist Inboxes/Outboxes.","via":[{"address":"0x3ffFbAdAF827559da092217e474760E2b2c3CeDd"}]},{"permission":"upgrade","target":"0x0B9857ae2D4A3DBe74ffE1d7DF045bb7F96E4840","via":[{"address":"0x554723262467F125Ac9e1cDFa9Ce15cc53822dbD"},{"address":"0x3ffFbAdAF827559da092217e474760E2b2c3CeDd"}]},{"permission":"upgrade","target":"0x1c479675ad559DC151F6Ec7ed3FbF8ceE79582B6","via":[{"address":"0x554723262467F125Ac9e1cDFa9Ce15cc53822dbD"},{"address":"0x3ffFbAdAF827559da092217e474760E2b2c3CeDd"}]},{"permission":"upgrade","target":"0x3ffFbAdAF827559da092217e474760E2b2c3CeDd","via":[{"address":"0x5613AF0474EB9c528A34701A5b1662E3C8FA0678"},{"address":"0x3ffFbAdAF827559da092217e474760E2b2c3CeDd"}]},{"permission":"upgrade","target":"0x4Dbd4fc535Ac27206064B68FfCf827b0A60BAB3f","via":[{"address":"0x554723262467F125Ac9e1cDFa9Ce15cc53822dbD"},{"address":"0x3ffFbAdAF827559da092217e474760E2b2c3CeDd"}]},{"permission":"upgrade","target":"0x57Bd336d579A51938619271a7Cc137a46D0501B1","via":[{"address":"0x554723262467F125Ac9e1cDFa9Ce15cc53822dbD"},{"address":"0x3ffFbAdAF827559da092217e474760E2b2c3CeDd"}]},{"permission":"upgrade","target":"0x5eF0D09d1E6204141B4d37530808eD19f60FBa35","via":[{"address":"0x3ffFbAdAF827559da092217e474760E2b2c3CeDd"}]},{"permission":"upgrade","target":"0x667e23ABd27E623c11d4CC00ca3EC4d0bD63337a","via":[{"address":"0x554723262467F125Ac9e1cDFa9Ce15cc53822dbD"},{"address":"0x3ffFbAdAF827559da092217e474760E2b2c3CeDd"}]},{"permission":"upgrade","target":"0x72Ce9c846789fdB6fC1f34aC4AD25Dd9ef7031ef","via":[{"address":"0x9aD46fac0Cf7f790E5be05A0F15223935A0c0aDa"},{"address":"0x3ffFbAdAF827559da092217e474760E2b2c3CeDd"}]},{"permission":"upgrade","target":"0x760723CD2e632826c38Fef8CD438A4CC7E7E1A40","via":[{"address":"0x554723262467F125Ac9e1cDFa9Ce15cc53822dbD"},{"address":"0x3ffFbAdAF827559da092217e474760E2b2c3CeDd"}]},{"permission":"upgrade","target":"0x8315177aB297bA92A06054cE80a67Ed4DBd7ed3a","via":[{"address":"0x554723262467F125Ac9e1cDFa9Ce15cc53822dbD"},{"address":"0x3ffFbAdAF827559da092217e474760E2b2c3CeDd"}]},{"permission":"upgrade","target":"0xa3A7B6F88361F48403514059F1F16C8E78d60EeC","via":[{"address":"0x9aD46fac0Cf7f790E5be05A0F15223935A0c0aDa"},{"address":"0x3ffFbAdAF827559da092217e474760E2b2c3CeDd"}]},{"permission":"upgrade","target":"0xcEe284F754E854890e311e3280b767F80797180d","via":[{"address":"0x9aD46fac0Cf7f790E5be05A0F15223935A0c0aDa"},{"address":"0x3ffFbAdAF827559da092217e474760E2b2c3CeDd"}]},{"permission":"upgrade","target":"0xe5896783a2F463446E1f624e64Aa6836BE4C6f58","via":[{"address":"0x554723262467F125Ac9e1cDFa9Ce15cc53822dbD"},{"address":"0x3ffFbAdAF827559da092217e474760E2b2c3CeDd"}]},{"permission":"upgrade","target":"0xE6841D92B0C345144506576eC13ECf5103aC7f49","via":[{"address":"0x5613AF0474EB9c528A34701A5b1662E3C8FA0678"},{"address":"0x3ffFbAdAF827559da092217e474760E2b2c3CeDd"}]}]
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

Generated with discovered.json: 0xb0c07e1ce77bf6c1978ad8f6afef6ed1408d63e7

# Diff at Thu, 21 Nov 2024 07:29:14 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@de1745323b367dd0fbb18ad6c862147dd90e90b0 block: 21215832
- current block number: 21234618

## Description

SC september cohort (6 members) are added/rotated.

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

Generated with discovered.json: 0xf39954b70be05335c11ec5588b7c6de61f75905d

# Diff at Mon, 18 Nov 2024 16:35:49 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@34fda47d61b6da3e75f65e51d9549662ce3f9478 block: 21122709
- current block number: 21215832

## Description

SC member syncs for the recently-elected september cohort are queued in the L1Timelock.

## Watched changes

```diff
    contract L1Timelock (0xE6841D92B0C345144506576eC13ECf5103aC7f49) {
    +++ description: None
      values.scheduledTransactions.54:
+        {"id":"0xca38878436c6e9ac58f4f3a27ddc93437c3aacb59575f30e082f8d60c8410be1","decoded":{"chain":"arbitrum","contractName":"SecurityCouncilMemberSyncAction","function":"perform","inputs":[{"name":"_securityCouncil","value":"0xADd68bCb0f66878aB9D37a447C7b9067C5dfa941"},{"name":"_updatedMembers","value":["0x882c6FCb3D358b9d70B97c6999159cea64168B6F","0xeA4A4A886aCA47DD0167B4aEE5B1345e18D20Ee5","0x1716C1C037e4968D5A06d4d080904F9B7a6508f2","0x33ddb82e68940f0e4C1050885BcE8faF5Ddd1b93","0x3E286452b1C66abB08Eb5494c3894F40aB5a59AF","0xe2e9d5B97d8C0457B1cf80BC93802bce4DF03e33","0x0275b3D54a5dDbf8205A75984796eFE8b7357Bae","0x5DD2205C3aac13E592F0a3D85188c948D1781df1","0x5a09A94eE8198D3c474d723337aa58023810022C","0x475816ca2a31D601B4e336f5c2418A67978aBf09","0x70C006fC86A392c16D7E085cefc0Ad1FF7de6C75","0x9316ca66f5f936E3239e4fD2AAAEA5C7b6f3C4cC"]},{"name":"_nonce","value":8}],"address":"0x9BF7b8884Fa381a45f8CB2525905fb36C996297a","calldata":"0x536d8944000000000000000000000000add68bcb0f66878ab9d37a447c7b9067c5dfa94100000000000000000000000000000000000000000000000000000000000000600000000000000000000000000000000000000000000000000000000000000008000000000000000000000000000000000000000000000000000000000000000c000000000000000000000000882c6fcb3d358b9d70b97c6999159cea64168b6f000000000000000000000000ea4a4a886aca47dd0167b4aee5b1345e18d20ee50000000000000000000000001716c1c037e4968d5a06d4d080904f9b7a6508f200000000000000000000000033ddb82e68940f0e4c1050885bce8faf5ddd1b930000000000000000000000003e286452b1c66abb08eb5494c3894f40ab5a59af000000000000000000000000e2e9d5b97d8c0457b1cf80bc93802bce4df03e330000000000000000000000000275b3d54a5ddbf8205a75984796efe8b7357bae0000000000000000000000005dd2205c3aac13e592f0a3d85188c948d1781df10000000000000000000000005a09a94ee8198d3c474d723337aa58023810022c000000000000000000000000475816ca2a31d601b4e336f5c2418a67978abf0900000000000000000000000070c006fc86a392c16d7e085cefc0ad1ff7de6c750000000000000000000000009316ca66f5f936e3239e4fd2aaaea5c7b6f3c4cc","executor":"0xCF57572261c7c2BCF21ffD220ea7d1a27D40A827","inboxOnEthereum":"0x4Dbd4fc535Ac27206064B68FfCf827b0A60BAB3f"},"raw":{"target":"0xa723C008e76E379c55599D2E4d93879BeaFDa79C","value":0,"data":"0x0000000000000000000000004dbd4fc535ac27206064b68ffcf827b0a60bab3f000000000000000000000000cf57572261c7c2bcf21ffd220ea7d1a27d40a82700000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000c000000000000000000000000000000000000000000000000000000000000002841cff79cd0000000000000000000000009bf7b8884fa381a45f8cb2525905fb36c996297a00000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000204536d8944000000000000000000000000add68bcb0f66878ab9d37a447c7b9067c5dfa94100000000000000000000000000000000000000000000000000000000000000600000000000000000000000000000000000000000000000000000000000000008000000000000000000000000000000000000000000000000000000000000000c000000000000000000000000882c6fcb3d358b9d70b97c6999159cea64168b6f000000000000000000000000ea4a4a886aca47dd0167b4aee5b1345e18d20ee50000000000000000000000001716c1c037e4968d5a06d4d080904f9b7a6508f200000000000000000000000033ddb82e68940f0e4c1050885bce8faf5ddd1b930000000000000000000000003e286452b1c66abb08eb5494c3894f40ab5a59af000000000000000000000000e2e9d5b97d8c0457b1cf80bc93802bce4df03e330000000000000000000000000275b3d54a5ddbf8205a75984796efe8b7357bae0000000000000000000000005dd2205c3aac13e592f0a3d85188c948d1781df10000000000000000000000005a09a94ee8198d3c474d723337aa58023810022c000000000000000000000000475816ca2a31d601b4e336f5c2418a67978abf0900000000000000000000000070c006fc86a392c16d7e085cefc0ad1ff7de6c750000000000000000000000009316ca66f5f936e3239e4fd2aaaea5c7b6f3c4cc0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000","delay":259200}}
      values.scheduledTransactions.53:
+        {"id":"0xca38878436c6e9ac58f4f3a27ddc93437c3aacb59575f30e082f8d60c8410be1","decoded":{"chain":"nova","address":"0x9BF7b8884Fa381a45f8CB2525905fb36C996297a","calldata":"0x536d8944000000000000000000000000c232ee726e3c51b86778bb4dbe61c52cc07a60f300000000000000000000000000000000000000000000000000000000000000600000000000000000000000000000000000000000000000000000000000000008000000000000000000000000000000000000000000000000000000000000000c000000000000000000000000882c6fcb3d358b9d70b97c6999159cea64168b6f000000000000000000000000ea4a4a886aca47dd0167b4aee5b1345e18d20ee50000000000000000000000001716c1c037e4968d5a06d4d080904f9b7a6508f200000000000000000000000033ddb82e68940f0e4c1050885bce8faf5ddd1b930000000000000000000000003e286452b1c66abb08eb5494c3894f40ab5a59af000000000000000000000000e2e9d5b97d8c0457b1cf80bc93802bce4df03e330000000000000000000000000275b3d54a5ddbf8205a75984796efe8b7357bae0000000000000000000000005dd2205c3aac13e592f0a3d85188c948d1781df10000000000000000000000005a09a94ee8198d3c474d723337aa58023810022c000000000000000000000000475816ca2a31d601b4e336f5c2418a67978abf0900000000000000000000000070c006fc86a392c16d7e085cefc0ad1ff7de6c750000000000000000000000009316ca66f5f936e3239e4fd2aaaea5c7b6f3c4cc","executor":"0x86a02dD71363c440b21F4c0E5B2Ad01Ffe1A7482","inboxOnEthereum":"0xc4448b71118c9071Bcb9734A0EAc55D18A153949"},"raw":{"target":"0xa723C008e76E379c55599D2E4d93879BeaFDa79C","value":0,"data":"0x000000000000000000000000c4448b71118c9071bcb9734a0eac55d18a15394900000000000000000000000086a02dd71363c440b21f4c0e5b2ad01ffe1a748200000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000c000000000000000000000000000000000000000000000000000000000000002841cff79cd0000000000000000000000009bf7b8884fa381a45f8cb2525905fb36c996297a00000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000204536d8944000000000000000000000000c232ee726e3c51b86778bb4dbe61c52cc07a60f300000000000000000000000000000000000000000000000000000000000000600000000000000000000000000000000000000000000000000000000000000008000000000000000000000000000000000000000000000000000000000000000c000000000000000000000000882c6fcb3d358b9d70b97c6999159cea64168b6f000000000000000000000000ea4a4a886aca47dd0167b4aee5b1345e18d20ee50000000000000000000000001716c1c037e4968d5a06d4d080904f9b7a6508f200000000000000000000000033ddb82e68940f0e4c1050885bce8faf5ddd1b930000000000000000000000003e286452b1c66abb08eb5494c3894f40ab5a59af000000000000000000000000e2e9d5b97d8c0457b1cf80bc93802bce4df03e330000000000000000000000000275b3d54a5ddbf8205a75984796efe8b7357bae0000000000000000000000005dd2205c3aac13e592f0a3d85188c948d1781df10000000000000000000000005a09a94ee8198d3c474d723337aa58023810022c000000000000000000000000475816ca2a31d601b4e336f5c2418a67978abf0900000000000000000000000070c006fc86a392c16d7e085cefc0ad1ff7de6c750000000000000000000000009316ca66f5f936e3239e4fd2aaaea5c7b6f3c4cc0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000","delay":259200}}
      values.scheduledTransactions.52:
+        {"id":"0xca38878436c6e9ac58f4f3a27ddc93437c3aacb59575f30e082f8d60c8410be1","decoded":{"chain":"arbitrum","contractName":"SecurityCouncilMemberSyncAction","function":"perform","inputs":[{"name":"_securityCouncil","value":"0x423552c0F05baCCac5Bfa91C6dCF1dc53a0A1641"},{"name":"_updatedMembers","value":["0x882c6FCb3D358b9d70B97c6999159cea64168B6F","0xeA4A4A886aCA47DD0167B4aEE5B1345e18D20Ee5","0x1716C1C037e4968D5A06d4d080904F9B7a6508f2","0x33ddb82e68940f0e4C1050885BcE8faF5Ddd1b93","0x3E286452b1C66abB08Eb5494c3894F40aB5a59AF","0xe2e9d5B97d8C0457B1cf80BC93802bce4DF03e33","0x0275b3D54a5dDbf8205A75984796eFE8b7357Bae","0x5DD2205C3aac13E592F0a3D85188c948D1781df1","0x5a09A94eE8198D3c474d723337aa58023810022C","0x475816ca2a31D601B4e336f5c2418A67978aBf09","0x70C006fC86A392c16D7E085cefc0Ad1FF7de6C75","0x9316ca66f5f936E3239e4fD2AAAEA5C7b6f3C4cC"]},{"name":"_nonce","value":8}],"address":"0x9BF7b8884Fa381a45f8CB2525905fb36C996297a","calldata":"0x536d8944000000000000000000000000423552c0f05baccac5bfa91c6dcf1dc53a0a164100000000000000000000000000000000000000000000000000000000000000600000000000000000000000000000000000000000000000000000000000000008000000000000000000000000000000000000000000000000000000000000000c000000000000000000000000882c6fcb3d358b9d70b97c6999159cea64168b6f000000000000000000000000ea4a4a886aca47dd0167b4aee5b1345e18d20ee50000000000000000000000001716c1c037e4968d5a06d4d080904f9b7a6508f200000000000000000000000033ddb82e68940f0e4c1050885bce8faf5ddd1b930000000000000000000000003e286452b1c66abb08eb5494c3894f40ab5a59af000000000000000000000000e2e9d5b97d8c0457b1cf80bc93802bce4df03e330000000000000000000000000275b3d54a5ddbf8205a75984796efe8b7357bae0000000000000000000000005dd2205c3aac13e592f0a3d85188c948d1781df10000000000000000000000005a09a94ee8198d3c474d723337aa58023810022c000000000000000000000000475816ca2a31d601b4e336f5c2418a67978abf0900000000000000000000000070c006fc86a392c16d7e085cefc0ad1ff7de6c750000000000000000000000009316ca66f5f936e3239e4fd2aaaea5c7b6f3c4cc","executor":"0xCF57572261c7c2BCF21ffD220ea7d1a27D40A827","inboxOnEthereum":"0x4Dbd4fc535Ac27206064B68FfCf827b0A60BAB3f"},"raw":{"target":"0xa723C008e76E379c55599D2E4d93879BeaFDa79C","value":0,"data":"0x0000000000000000000000004dbd4fc535ac27206064b68ffcf827b0a60bab3f000000000000000000000000cf57572261c7c2bcf21ffd220ea7d1a27d40a82700000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000c000000000000000000000000000000000000000000000000000000000000002841cff79cd0000000000000000000000009bf7b8884fa381a45f8cb2525905fb36c996297a00000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000204536d8944000000000000000000000000423552c0f05baccac5bfa91c6dcf1dc53a0a164100000000000000000000000000000000000000000000000000000000000000600000000000000000000000000000000000000000000000000000000000000008000000000000000000000000000000000000000000000000000000000000000c000000000000000000000000882c6fcb3d358b9d70b97c6999159cea64168b6f000000000000000000000000ea4a4a886aca47dd0167b4aee5b1345e18d20ee50000000000000000000000001716c1c037e4968d5a06d4d080904f9b7a6508f200000000000000000000000033ddb82e68940f0e4c1050885bce8faf5ddd1b930000000000000000000000003e286452b1c66abb08eb5494c3894f40ab5a59af000000000000000000000000e2e9d5b97d8c0457b1cf80bc93802bce4df03e330000000000000000000000000275b3d54a5ddbf8205a75984796efe8b7357bae0000000000000000000000005dd2205c3aac13e592f0a3d85188c948d1781df10000000000000000000000005a09a94ee8198d3c474d723337aa58023810022c000000000000000000000000475816ca2a31d601b4e336f5c2418a67978abf0900000000000000000000000070c006fc86a392c16d7e085cefc0ad1ff7de6c750000000000000000000000009316ca66f5f936e3239e4fd2aaaea5c7b6f3c4cc0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000","delay":259200}}
      values.scheduledTransactions.51:
+        {"id":"0xca38878436c6e9ac58f4f3a27ddc93437c3aacb59575f30e082f8d60c8410be1","decoded":{"chain":"ethereum","contractName":"SecurityCouncilMemberSyncAction","function":"perform","inputs":[{"name":"_securityCouncil","value":"0xF06E95eF589D9c38af242a8AAee8375f14023F85"},{"name":"_updatedMembers","value":["0x882c6FCb3D358b9d70B97c6999159cea64168B6F","0xeA4A4A886aCA47DD0167B4aEE5B1345e18D20Ee5","0x1716C1C037e4968D5A06d4d080904F9B7a6508f2","0x33ddb82e68940f0e4C1050885BcE8faF5Ddd1b93","0x3E286452b1C66abB08Eb5494c3894F40aB5a59AF","0xe2e9d5B97d8C0457B1cf80BC93802bce4DF03e33","0x0275b3D54a5dDbf8205A75984796eFE8b7357Bae","0x5DD2205C3aac13E592F0a3D85188c948D1781df1","0x5a09A94eE8198D3c474d723337aa58023810022C","0x475816ca2a31D601B4e336f5c2418A67978aBf09","0x70C006fC86A392c16D7E085cefc0Ad1FF7de6C75","0x9316ca66f5f936E3239e4fD2AAAEA5C7b6f3C4cC"]},{"name":"_nonce","value":8}],"address":"0x9BF7b8884Fa381a45f8CB2525905fb36C996297a","calldata":"0x536d8944000000000000000000000000f06e95ef589d9c38af242a8aaee8375f14023f8500000000000000000000000000000000000000000000000000000000000000600000000000000000000000000000000000000000000000000000000000000008000000000000000000000000000000000000000000000000000000000000000c000000000000000000000000882c6fcb3d358b9d70b97c6999159cea64168b6f000000000000000000000000ea4a4a886aca47dd0167b4aee5b1345e18d20ee50000000000000000000000001716c1c037e4968d5a06d4d080904f9b7a6508f200000000000000000000000033ddb82e68940f0e4c1050885bce8faf5ddd1b930000000000000000000000003e286452b1c66abb08eb5494c3894f40ab5a59af000000000000000000000000e2e9d5b97d8c0457b1cf80bc93802bce4df03e330000000000000000000000000275b3d54a5ddbf8205a75984796efe8b7357bae0000000000000000000000005dd2205c3aac13e592f0a3d85188c948d1781df10000000000000000000000005a09a94ee8198d3c474d723337aa58023810022c000000000000000000000000475816ca2a31d601b4e336f5c2418a67978abf0900000000000000000000000070c006fc86a392c16d7e085cefc0ad1ff7de6c750000000000000000000000009316ca66f5f936e3239e4fd2aaaea5c7b6f3c4cc","executor":"0x3ffFbAdAF827559da092217e474760E2b2c3CeDd"},"raw":{"target":"0x3ffFbAdAF827559da092217e474760E2b2c3CeDd","value":0,"data":"0x1cff79cd0000000000000000000000009bf7b8884fa381a45f8cb2525905fb36c996297a00000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000204536d8944000000000000000000000000f06e95ef589d9c38af242a8aaee8375f14023f8500000000000000000000000000000000000000000000000000000000000000600000000000000000000000000000000000000000000000000000000000000008000000000000000000000000000000000000000000000000000000000000000c000000000000000000000000882c6fcb3d358b9d70b97c6999159cea64168b6f000000000000000000000000ea4a4a886aca47dd0167b4aee5b1345e18d20ee50000000000000000000000001716c1c037e4968d5a06d4d080904f9b7a6508f200000000000000000000000033ddb82e68940f0e4c1050885bce8faf5ddd1b930000000000000000000000003e286452b1c66abb08eb5494c3894f40ab5a59af000000000000000000000000e2e9d5b97d8c0457b1cf80bc93802bce4df03e330000000000000000000000000275b3d54a5ddbf8205a75984796efe8b7357bae0000000000000000000000005dd2205c3aac13e592f0a3d85188c948d1781df10000000000000000000000005a09a94ee8198d3c474d723337aa58023810022c000000000000000000000000475816ca2a31d601b4e336f5c2418a67978abf0900000000000000000000000070c006fc86a392c16d7e085cefc0ad1ff7de6c750000000000000000000000009316ca66f5f936e3239e4fd2aaaea5c7b6f3c4cc00000000000000000000000000000000000000000000000000000000","delay":259200}}
    }
```

Generated with discovered.json: 0x93910d0c61840241ea03ec8fd42f6e07e0049d1e

# Diff at Tue, 12 Nov 2024 15:33:45 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@b2d1031f386ed9987b07f83babe4993700b00d33 block: 21122709
- current block number: 21122709

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21122709 (main branch discovery), not current.

```diff
    contract ValidatorWallet (0x56D83349c2B8DCF74d7E92D5b6B33d0BADD52D78) {
    +++ description: None
      receivedPermissions.1:
-        {"permission":"propose","target":"0x5eF0D09d1E6204141B4d37530808eD19f60FBa35","description":"can submit state roots to the RollupProxy contract on the host chain."}
      receivedPermissions.0.permission:
-        "challenge"
+        "validate"
      receivedPermissions.0.description:
-        "can challenge state roots on the host chain."
+        "Can propose new state roots (called nodes) and challenge state roots on the host chain."
    }
```

```diff
    contract RollupEventInbox (0x57Bd336d579A51938619271a7Cc137a46D0501B1) {
    +++ description: Helper contract sending configuration data over the bridge during the systems initialization.
      template:
+        "orbitstack/RollupEventInbox"
      description:
+        "Helper contract sending configuration data over the bridge during the systems initialization."
    }
```

```diff
    contract RollupProxy (0x5eF0D09d1E6204141B4d37530808eD19f60FBa35) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      issuedPermissions.29:
-        {"permission":"upgrade","target":"0x3ffFbAdAF827559da092217e474760E2b2c3CeDd","via":[]}
      issuedPermissions.28:
-        {"permission":"propose","target":"0xF8D3E1cF58386c92B27710C6a0D8A54c76BC6ab5","via":[]}
      issuedPermissions.27:
-        {"permission":"propose","target":"0xf59caf75e8A4bFBA4e6e07aD86C7E498E4d2519b","via":[]}
      issuedPermissions.26:
-        {"permission":"propose","target":"0xdDf2F71Ab206C0138A8eceEb54386567D5abF01E","via":[]}
      issuedPermissions.25:
-        {"permission":"propose","target":"0xB51EDdfc9A945e2B909905e4F242C4796Ac0C61d","via":[]}
      issuedPermissions.24:
-        {"permission":"propose","target":"0xB0CB1384e3f4a9a9b2447e39b05e10631E1D34B0","via":[]}
      issuedPermissions.23:
-        {"permission":"propose","target":"0xAB1A39332e934300eBCc57B5f95cA90631a347FF","via":[]}
      issuedPermissions.22:
-        {"permission":"propose","target":"0x83215480dB2C6A7E56f9E99EF93AB9B36F8A3DD5","via":[]}
      issuedPermissions.21:
-        {"permission":"propose","target":"0x7CF3d537733F6Ba4183A833c9B021265716cE9d0","via":[]}
      issuedPermissions.20:
-        {"permission":"propose","target":"0x758C6bB08B3ea5889B5cddbdeF9A45b3a983c398","via":[]}
      issuedPermissions.19:
-        {"permission":"propose","target":"0x6Fb914de4653eC5592B7c15F4d9466Cbd03F2104","via":[]}
      issuedPermissions.18:
-        {"permission":"propose","target":"0x610Aa279989F440820e14248BD3879B148717974","via":[]}
      issuedPermissions.17:
-        {"permission":"propose","target":"0x56D83349c2B8DCF74d7E92D5b6B33d0BADD52D78","via":[]}
      issuedPermissions.16:
-        {"permission":"propose","target":"0x54c0D3d6C101580dB3be8763A2aE2c6bb9dc840c","via":[]}
      issuedPermissions.15.permission:
-        "propose"
+        "validate"
      issuedPermissions.15.target:
-        "0x0fF813f6BD577c3D1cDbE435baC0621BE6aE34B4"
+        "0xF8D3E1cF58386c92B27710C6a0D8A54c76BC6ab5"
      issuedPermissions.14.permission:
-        "configure"
+        "validate"
      issuedPermissions.14.target:
-        "0x3ffFbAdAF827559da092217e474760E2b2c3CeDd"
+        "0xf59caf75e8A4bFBA4e6e07aD86C7E498E4d2519b"
      issuedPermissions.13.permission:
-        "challenge"
+        "validate"
      issuedPermissions.13.target:
-        "0xF8D3E1cF58386c92B27710C6a0D8A54c76BC6ab5"
+        "0xdDf2F71Ab206C0138A8eceEb54386567D5abF01E"
      issuedPermissions.12.permission:
-        "challenge"
+        "validate"
      issuedPermissions.12.target:
-        "0xf59caf75e8A4bFBA4e6e07aD86C7E498E4d2519b"
+        "0xB51EDdfc9A945e2B909905e4F242C4796Ac0C61d"
      issuedPermissions.11.permission:
-        "challenge"
+        "validate"
      issuedPermissions.11.target:
-        "0xdDf2F71Ab206C0138A8eceEb54386567D5abF01E"
+        "0xB0CB1384e3f4a9a9b2447e39b05e10631E1D34B0"
      issuedPermissions.10.permission:
-        "challenge"
+        "validate"
      issuedPermissions.10.target:
-        "0xB51EDdfc9A945e2B909905e4F242C4796Ac0C61d"
+        "0xAB1A39332e934300eBCc57B5f95cA90631a347FF"
      issuedPermissions.9.permission:
-        "challenge"
+        "validate"
      issuedPermissions.9.target:
-        "0xB0CB1384e3f4a9a9b2447e39b05e10631E1D34B0"
+        "0x83215480dB2C6A7E56f9E99EF93AB9B36F8A3DD5"
      issuedPermissions.8.permission:
-        "challenge"
+        "validate"
      issuedPermissions.8.target:
-        "0xAB1A39332e934300eBCc57B5f95cA90631a347FF"
+        "0x7CF3d537733F6Ba4183A833c9B021265716cE9d0"
      issuedPermissions.7.permission:
-        "challenge"
+        "validate"
      issuedPermissions.7.target:
-        "0x83215480dB2C6A7E56f9E99EF93AB9B36F8A3DD5"
+        "0x758C6bB08B3ea5889B5cddbdeF9A45b3a983c398"
      issuedPermissions.6.permission:
-        "challenge"
+        "validate"
      issuedPermissions.6.target:
-        "0x7CF3d537733F6Ba4183A833c9B021265716cE9d0"
+        "0x6Fb914de4653eC5592B7c15F4d9466Cbd03F2104"
      issuedPermissions.5.permission:
-        "challenge"
+        "validate"
      issuedPermissions.5.target:
-        "0x758C6bB08B3ea5889B5cddbdeF9A45b3a983c398"
+        "0x610Aa279989F440820e14248BD3879B148717974"
      issuedPermissions.4.permission:
-        "challenge"
+        "validate"
      issuedPermissions.4.target:
-        "0x6Fb914de4653eC5592B7c15F4d9466Cbd03F2104"
+        "0x56D83349c2B8DCF74d7E92D5b6B33d0BADD52D78"
      issuedPermissions.3.permission:
-        "challenge"
+        "validate"
      issuedPermissions.3.target:
-        "0x610Aa279989F440820e14248BD3879B148717974"
+        "0x54c0D3d6C101580dB3be8763A2aE2c6bb9dc840c"
      issuedPermissions.2.permission:
-        "challenge"
+        "validate"
      issuedPermissions.2.target:
-        "0x56D83349c2B8DCF74d7E92D5b6B33d0BADD52D78"
+        "0x0fF813f6BD577c3D1cDbE435baC0621BE6aE34B4"
      issuedPermissions.1.permission:
-        "challenge"
+        "upgrade"
      issuedPermissions.1.target:
-        "0x54c0D3d6C101580dB3be8763A2aE2c6bb9dc840c"
+        "0x3ffFbAdAF827559da092217e474760E2b2c3CeDd"
      issuedPermissions.0.permission:
-        "challenge"
+        "configure"
      issuedPermissions.0.target:
-        "0x0fF813f6BD577c3D1cDbE435baC0621BE6aE34B4"
+        "0x3ffFbAdAF827559da092217e474760E2b2c3CeDd"
    }
```

```diff
    contract L1GatewayRouter (0x72Ce9c846789fdB6fC1f34aC4AD25Dd9ef7031ef) {
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
    contract Validator (0x758C6bB08B3ea5889B5cddbdeF9A45b3a983c398) {
    +++ description: None
      receivedPermissions.1:
-        {"permission":"propose","target":"0x5eF0D09d1E6204141B4d37530808eD19f60FBa35","description":"can submit state roots to the RollupProxy contract on the host chain."}
      receivedPermissions.0.permission:
-        "challenge"
+        "validate"
      receivedPermissions.0.description:
-        "can challenge state roots on the host chain."
+        "Can propose new state roots (called nodes) and challenge state roots on the host chain."
    }
```

```diff
    contract ValidatorWallet (0x7CF3d537733F6Ba4183A833c9B021265716cE9d0) {
    +++ description: None
      receivedPermissions.1:
-        {"permission":"propose","target":"0x5eF0D09d1E6204141B4d37530808eD19f60FBa35","description":"can submit state roots to the RollupProxy contract on the host chain."}
      receivedPermissions.0.permission:
-        "challenge"
+        "validate"
      receivedPermissions.0.description:
-        "can challenge state roots on the host chain."
+        "Can propose new state roots (called nodes) and challenge state roots on the host chain."
    }
```

```diff
    contract ValidatorWallet (0x83215480dB2C6A7E56f9E99EF93AB9B36F8A3DD5) {
    +++ description: None
      receivedPermissions.1:
-        {"permission":"propose","target":"0x5eF0D09d1E6204141B4d37530808eD19f60FBa35","description":"can submit state roots to the RollupProxy contract on the host chain."}
      receivedPermissions.0.permission:
-        "challenge"
+        "validate"
      receivedPermissions.0.description:
-        "can challenge state roots on the host chain."
+        "Can propose new state roots (called nodes) and challenge state roots on the host chain."
    }
```

```diff
    contract ValidatorWallet (0xB0CB1384e3f4a9a9b2447e39b05e10631E1D34B0) {
    +++ description: None
      receivedPermissions.1:
-        {"permission":"propose","target":"0x5eF0D09d1E6204141B4d37530808eD19f60FBa35","description":"can submit state roots to the RollupProxy contract on the host chain."}
      receivedPermissions.0.permission:
-        "challenge"
+        "validate"
      receivedPermissions.0.description:
-        "can challenge state roots on the host chain."
+        "Can propose new state roots (called nodes) and challenge state roots on the host chain."
    }
```

```diff
    contract L1CustomGateway (0xcEe284F754E854890e311e3280b767F80797180d) {
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
    contract ValidatorWallet (0xf59caf75e8A4bFBA4e6e07aD86C7E498E4d2519b) {
    +++ description: None
      receivedPermissions.1:
-        {"permission":"propose","target":"0x5eF0D09d1E6204141B4d37530808eD19f60FBa35","description":"can submit state roots to the RollupProxy contract on the host chain."}
      receivedPermissions.0.permission:
-        "challenge"
+        "validate"
      receivedPermissions.0.description:
-        "can challenge state roots on the host chain."
+        "Can propose new state roots (called nodes) and challenge state roots on the host chain."
    }
```

Generated with discovered.json: 0x38084f4892c537f1a98d76e93894349a02897105

# Diff at Tue, 05 Nov 2024 16:42:27 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@5e6ce51851b57187ccdd52c4944a82e2a8ab1e88 block: 21092328
- current block number: 21122709

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21092328 (main branch discovery), not current.

```diff
    contract UpgradeExecutor (0x3ffFbAdAF827559da092217e474760E2b2c3CeDd) {
    +++ description: None
      receivedPermissions.11:
+        {"permission":"upgrade","target":"0xE6841D92B0C345144506576eC13ECf5103aC7f49","via":[{"address":"0x5613AF0474EB9c528A34701A5b1662E3C8FA0678"}]}
      receivedPermissions.10.target:
-        "0xE6841D92B0C345144506576eC13ECf5103aC7f49"
+        "0xe5896783a2F463446E1f624e64Aa6836BE4C6f58"
      receivedPermissions.10.via.0.address:
-        "0x5613AF0474EB9c528A34701A5b1662E3C8FA0678"
+        "0x554723262467F125Ac9e1cDFa9Ce15cc53822dbD"
      receivedPermissions.9.target:
-        "0xe5896783a2F463446E1f624e64Aa6836BE4C6f58"
+        "0x8315177aB297bA92A06054cE80a67Ed4DBd7ed3a"
      receivedPermissions.8.target:
-        "0x8315177aB297bA92A06054cE80a67Ed4DBd7ed3a"
+        "0x760723CD2e632826c38Fef8CD438A4CC7E7E1A40"
      receivedPermissions.7.target:
-        "0x760723CD2e632826c38Fef8CD438A4CC7E7E1A40"
+        "0x667e23ABd27E623c11d4CC00ca3EC4d0bD63337a"
      receivedPermissions.6.target:
-        "0x667e23ABd27E623c11d4CC00ca3EC4d0bD63337a"
+        "0x5eF0D09d1E6204141B4d37530808eD19f60FBa35"
      receivedPermissions.6.via:
-        [{"address":"0x554723262467F125Ac9e1cDFa9Ce15cc53822dbD"}]
      receivedPermissions.5.target:
-        "0x5eF0D09d1E6204141B4d37530808eD19f60FBa35"
+        "0x57Bd336d579A51938619271a7Cc137a46D0501B1"
      receivedPermissions.5.via:
+        [{"address":"0x554723262467F125Ac9e1cDFa9Ce15cc53822dbD"}]
      receivedPermissions.4.target:
-        "0x57Bd336d579A51938619271a7Cc137a46D0501B1"
+        "0x4Dbd4fc535Ac27206064B68FfCf827b0A60BAB3f"
      receivedPermissions.3.target:
-        "0x4Dbd4fc535Ac27206064B68FfCf827b0A60BAB3f"
+        "0x3ffFbAdAF827559da092217e474760E2b2c3CeDd"
      receivedPermissions.3.via.0.address:
-        "0x554723262467F125Ac9e1cDFa9Ce15cc53822dbD"
+        "0x5613AF0474EB9c528A34701A5b1662E3C8FA0678"
      receivedPermissions.2.target:
-        "0x3ffFbAdAF827559da092217e474760E2b2c3CeDd"
+        "0x1c479675ad559DC151F6Ec7ed3FbF8ceE79582B6"
      receivedPermissions.2.via.0.address:
-        "0x5613AF0474EB9c528A34701A5b1662E3C8FA0678"
+        "0x554723262467F125Ac9e1cDFa9Ce15cc53822dbD"
      receivedPermissions.1.target:
-        "0x1c479675ad559DC151F6Ec7ed3FbF8ceE79582B6"
+        "0x0B9857ae2D4A3DBe74ffE1d7DF045bb7F96E4840"
      receivedPermissions.0.permission:
-        "upgrade"
+        "configure"
      receivedPermissions.0.target:
-        "0x0B9857ae2D4A3DBe74ffE1d7DF045bb7F96E4840"
+        "0x5eF0D09d1E6204141B4d37530808eD19f60FBa35"
      receivedPermissions.0.via:
-        [{"address":"0x554723262467F125Ac9e1cDFa9Ce15cc53822dbD"}]
      receivedPermissions.0.description:
+        "can pause and unpause and set important roles and parameters in the system contracts: Can delegate Sequencer management to a BatchPosterManager address, manage data availability and DACs, set the Sequencer-only window, introduce an allowList to the bridge and whitelist Inboxes/Outboxes."
    }
```

```diff
    contract RollupProxy (0x5eF0D09d1E6204141B4d37530808eD19f60FBa35) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      issuedPermissions.29:
+        {"permission":"upgrade","target":"0x3ffFbAdAF827559da092217e474760E2b2c3CeDd","via":[]}
      issuedPermissions.28.permission:
-        "upgrade"
+        "propose"
      issuedPermissions.28.target:
-        "0x3ffFbAdAF827559da092217e474760E2b2c3CeDd"
+        "0xF8D3E1cF58386c92B27710C6a0D8A54c76BC6ab5"
      issuedPermissions.27.target:
-        "0xF8D3E1cF58386c92B27710C6a0D8A54c76BC6ab5"
+        "0xf59caf75e8A4bFBA4e6e07aD86C7E498E4d2519b"
      issuedPermissions.26.target:
-        "0xf59caf75e8A4bFBA4e6e07aD86C7E498E4d2519b"
+        "0xdDf2F71Ab206C0138A8eceEb54386567D5abF01E"
      issuedPermissions.25.target:
-        "0xdDf2F71Ab206C0138A8eceEb54386567D5abF01E"
+        "0xB51EDdfc9A945e2B909905e4F242C4796Ac0C61d"
      issuedPermissions.24.target:
-        "0xB51EDdfc9A945e2B909905e4F242C4796Ac0C61d"
+        "0xB0CB1384e3f4a9a9b2447e39b05e10631E1D34B0"
      issuedPermissions.23.target:
-        "0xB0CB1384e3f4a9a9b2447e39b05e10631E1D34B0"
+        "0xAB1A39332e934300eBCc57B5f95cA90631a347FF"
      issuedPermissions.22.target:
-        "0xAB1A39332e934300eBCc57B5f95cA90631a347FF"
+        "0x83215480dB2C6A7E56f9E99EF93AB9B36F8A3DD5"
      issuedPermissions.21.target:
-        "0x83215480dB2C6A7E56f9E99EF93AB9B36F8A3DD5"
+        "0x7CF3d537733F6Ba4183A833c9B021265716cE9d0"
      issuedPermissions.20.target:
-        "0x7CF3d537733F6Ba4183A833c9B021265716cE9d0"
+        "0x758C6bB08B3ea5889B5cddbdeF9A45b3a983c398"
      issuedPermissions.19.target:
-        "0x758C6bB08B3ea5889B5cddbdeF9A45b3a983c398"
+        "0x6Fb914de4653eC5592B7c15F4d9466Cbd03F2104"
      issuedPermissions.18.target:
-        "0x6Fb914de4653eC5592B7c15F4d9466Cbd03F2104"
+        "0x610Aa279989F440820e14248BD3879B148717974"
      issuedPermissions.17.target:
-        "0x610Aa279989F440820e14248BD3879B148717974"
+        "0x56D83349c2B8DCF74d7E92D5b6B33d0BADD52D78"
      issuedPermissions.16.target:
-        "0x56D83349c2B8DCF74d7E92D5b6B33d0BADD52D78"
+        "0x54c0D3d6C101580dB3be8763A2aE2c6bb9dc840c"
      issuedPermissions.15.target:
-        "0x54c0D3d6C101580dB3be8763A2aE2c6bb9dc840c"
+        "0x0fF813f6BD577c3D1cDbE435baC0621BE6aE34B4"
      issuedPermissions.14.permission:
-        "propose"
+        "configure"
      issuedPermissions.14.target:
-        "0x0fF813f6BD577c3D1cDbE435baC0621BE6aE34B4"
+        "0x3ffFbAdAF827559da092217e474760E2b2c3CeDd"
    }
```

Generated with discovered.json: 0x48e1458ea67abceee5b44143d3117f3296961bac

# Diff at Fri, 01 Nov 2024 10:54:45 GMT:

- author: vincfurc (<10850139+vincfurc@users.noreply.github.com>)
- comparing to: main@cd1f0e71bb08ce16b2084a11b768538e8aa6ba8c block: 21069878
- current block number: 21092328

## Description

Multisig member change.

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

Generated with discovered.json: 0x2ee8d3e3fd17932ee217727c61e81da24bc8cfc7

# Diff at Tue, 29 Oct 2024 13:04:06 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@7b3fc9dc9074e1d423b48522c3f0273c86aab54a block: 21041823
- current block number: 21069878

## Description

Arbitrum scheduled transactions:
- SC member changes (sync)
- add custom gateway for RARI token

## Watched changes

```diff
    contract L1Timelock (0xE6841D92B0C345144506576eC13ECf5103aC7f49) {
    +++ description: None
      values.scheduledTransactions.50:
+        {"id":"0xc7e9a8a492569cc6ffce2992be72416fe2fb2a9260a839f5a78ffd0de91d709d","decoded":{"chain":"ethereum","contractName":"RegisterAndSetArbCustomGatewayAction","function":"perform","inputs":[{"name":"_l1Tokens","value":["0xFca59Cd816aB1eaD66534D82bc21E7515cE441CF"]},{"name":"_l2Tokens","value":["0xCf78572A8fE97b2B9a4B9709f6a7D9a863c1b8E0"]},{"name":"_maxGasForRegister","value":0},{"name":"_gasPriceBidForRegister","value":0},{"name":"_maxSubmissionCostForRegister","value":500000000000000},{"name":"_maxGasForSetGateway","value":0},{"name":"_gasPriceBidForSetGateway","value":0},{"name":"_maxSubmissionCostForSetGateway","value":500000000000000}],"address":"0x997668Ee3C575dC060F80B06db0a8B04C9558969","calldata":"0xc177385c00000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000000140000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000001c6bf52634000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000001c6bf526340000000000000000000000000000000000000000000000000000000000000000001000000000000000000000000fca59cd816ab1ead66534d82bc21e7515ce441cf0000000000000000000000000000000000000000000000000000000000000001000000000000000000000000cf78572a8fe97b2b9a4b9709f6a7d9a863c1b8e0","executor":"0x3ffFbAdAF827559da092217e474760E2b2c3CeDd"},"raw":{"target":"0x3ffFbAdAF827559da092217e474760E2b2c3CeDd","value":1000000000000000,"data":"0x1cff79cd000000000000000000000000997668ee3c575dc060f80b06db0a8b04c955896900000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000184c177385c00000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000000140000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000001c6bf52634000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000001c6bf526340000000000000000000000000000000000000000000000000000000000000000001000000000000000000000000fca59cd816ab1ead66534d82bc21e7515ce441cf0000000000000000000000000000000000000000000000000000000000000001000000000000000000000000cf78572a8fe97b2b9a4b9709f6a7d9a863c1b8e000000000000000000000000000000000000000000000000000000000","delay":259200}}
      values.scheduledTransactions.49:
+        {"id":"0x304646fcc77edfed197cfc18bacc3241063f45301b0719476ef27339ddf3527a","decoded":{"chain":"arbitrum","contractName":"SecurityCouncilMemberSyncAction","function":"perform","inputs":[{"name":"_securityCouncil","value":"0xADd68bCb0f66878aB9D37a447C7b9067C5dfa941"},{"name":"_updatedMembers","value":["0x3Bd8e2AC65ad6f0F094BA6766cBd9484AB49eF23","0xf8e1492255d9428c2Fc20A98A1DeB1215C8ffEfd","0xb07dc9103328A51128bC6Cc1049d1137035f5E28","0x3E286452b1C66abB08Eb5494c3894F40aB5a59AF","0xb71ca4FFbB7b58d75Ba29891ab45e9Dc12B444Ed","0x8F10e3413586c4a8DCfcE19D009872b19e9cd8E3","0x0275b3D54a5dDbf8205A75984796eFE8b7357Bae","0x5DD2205C3aac13E592F0a3D85188c948D1781df1","0x5a09A94eE8198D3c474d723337aa58023810022C","0x475816ca2a31D601B4e336f5c2418A67978aBf09","0x70C006fC86A392c16D7E085cefc0Ad1FF7de6C75","0x9316ca66f5f936E3239e4fD2AAAEA5C7b6f3C4cC"]},{"name":"_nonce","value":7}],"address":"0x9BF7b8884Fa381a45f8CB2525905fb36C996297a","calldata":"0x536d8944000000000000000000000000add68bcb0f66878ab9d37a447c7b9067c5dfa94100000000000000000000000000000000000000000000000000000000000000600000000000000000000000000000000000000000000000000000000000000007000000000000000000000000000000000000000000000000000000000000000c0000000000000000000000003bd8e2ac65ad6f0f094ba6766cbd9484ab49ef23000000000000000000000000f8e1492255d9428c2fc20a98a1deb1215c8ffefd000000000000000000000000b07dc9103328a51128bc6cc1049d1137035f5e280000000000000000000000003e286452b1c66abb08eb5494c3894f40ab5a59af000000000000000000000000b71ca4ffbb7b58d75ba29891ab45e9dc12b444ed0000000000000000000000008f10e3413586c4a8dcfce19d009872b19e9cd8e30000000000000000000000000275b3d54a5ddbf8205a75984796efe8b7357bae0000000000000000000000005dd2205c3aac13e592f0a3d85188c948d1781df10000000000000000000000005a09a94ee8198d3c474d723337aa58023810022c000000000000000000000000475816ca2a31d601b4e336f5c2418a67978abf0900000000000000000000000070c006fc86a392c16d7e085cefc0ad1ff7de6c750000000000000000000000009316ca66f5f936e3239e4fd2aaaea5c7b6f3c4cc","executor":"0xCF57572261c7c2BCF21ffD220ea7d1a27D40A827","inboxOnEthereum":"0x4Dbd4fc535Ac27206064B68FfCf827b0A60BAB3f"},"raw":{"target":"0xa723C008e76E379c55599D2E4d93879BeaFDa79C","value":0,"data":"0x0000000000000000000000004dbd4fc535ac27206064b68ffcf827b0a60bab3f000000000000000000000000cf57572261c7c2bcf21ffd220ea7d1a27d40a82700000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000c000000000000000000000000000000000000000000000000000000000000002841cff79cd0000000000000000000000009bf7b8884fa381a45f8cb2525905fb36c996297a00000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000204536d8944000000000000000000000000add68bcb0f66878ab9d37a447c7b9067c5dfa94100000000000000000000000000000000000000000000000000000000000000600000000000000000000000000000000000000000000000000000000000000007000000000000000000000000000000000000000000000000000000000000000c0000000000000000000000003bd8e2ac65ad6f0f094ba6766cbd9484ab49ef23000000000000000000000000f8e1492255d9428c2fc20a98a1deb1215c8ffefd000000000000000000000000b07dc9103328a51128bc6cc1049d1137035f5e280000000000000000000000003e286452b1c66abb08eb5494c3894f40ab5a59af000000000000000000000000b71ca4ffbb7b58d75ba29891ab45e9dc12b444ed0000000000000000000000008f10e3413586c4a8dcfce19d009872b19e9cd8e30000000000000000000000000275b3d54a5ddbf8205a75984796efe8b7357bae0000000000000000000000005dd2205c3aac13e592f0a3d85188c948d1781df10000000000000000000000005a09a94ee8198d3c474d723337aa58023810022c000000000000000000000000475816ca2a31d601b4e336f5c2418a67978abf0900000000000000000000000070c006fc86a392c16d7e085cefc0ad1ff7de6c750000000000000000000000009316ca66f5f936e3239e4fd2aaaea5c7b6f3c4cc0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000","delay":259200}}
      values.scheduledTransactions.48:
+        {"id":"0x304646fcc77edfed197cfc18bacc3241063f45301b0719476ef27339ddf3527a","decoded":{"chain":"nova","address":"0x9BF7b8884Fa381a45f8CB2525905fb36C996297a","calldata":"0x536d8944000000000000000000000000c232ee726e3c51b86778bb4dbe61c52cc07a60f300000000000000000000000000000000000000000000000000000000000000600000000000000000000000000000000000000000000000000000000000000007000000000000000000000000000000000000000000000000000000000000000c0000000000000000000000003bd8e2ac65ad6f0f094ba6766cbd9484ab49ef23000000000000000000000000f8e1492255d9428c2fc20a98a1deb1215c8ffefd000000000000000000000000b07dc9103328a51128bc6cc1049d1137035f5e280000000000000000000000003e286452b1c66abb08eb5494c3894f40ab5a59af000000000000000000000000b71ca4ffbb7b58d75ba29891ab45e9dc12b444ed0000000000000000000000008f10e3413586c4a8dcfce19d009872b19e9cd8e30000000000000000000000000275b3d54a5ddbf8205a75984796efe8b7357bae0000000000000000000000005dd2205c3aac13e592f0a3d85188c948d1781df10000000000000000000000005a09a94ee8198d3c474d723337aa58023810022c000000000000000000000000475816ca2a31d601b4e336f5c2418a67978abf0900000000000000000000000070c006fc86a392c16d7e085cefc0ad1ff7de6c750000000000000000000000009316ca66f5f936e3239e4fd2aaaea5c7b6f3c4cc","executor":"0x86a02dD71363c440b21F4c0E5B2Ad01Ffe1A7482","inboxOnEthereum":"0xc4448b71118c9071Bcb9734A0EAc55D18A153949"},"raw":{"target":"0xa723C008e76E379c55599D2E4d93879BeaFDa79C","value":0,"data":"0x000000000000000000000000c4448b71118c9071bcb9734a0eac55d18a15394900000000000000000000000086a02dd71363c440b21f4c0e5b2ad01ffe1a748200000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000c000000000000000000000000000000000000000000000000000000000000002841cff79cd0000000000000000000000009bf7b8884fa381a45f8cb2525905fb36c996297a00000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000204536d8944000000000000000000000000c232ee726e3c51b86778bb4dbe61c52cc07a60f300000000000000000000000000000000000000000000000000000000000000600000000000000000000000000000000000000000000000000000000000000007000000000000000000000000000000000000000000000000000000000000000c0000000000000000000000003bd8e2ac65ad6f0f094ba6766cbd9484ab49ef23000000000000000000000000f8e1492255d9428c2fc20a98a1deb1215c8ffefd000000000000000000000000b07dc9103328a51128bc6cc1049d1137035f5e280000000000000000000000003e286452b1c66abb08eb5494c3894f40ab5a59af000000000000000000000000b71ca4ffbb7b58d75ba29891ab45e9dc12b444ed0000000000000000000000008f10e3413586c4a8dcfce19d009872b19e9cd8e30000000000000000000000000275b3d54a5ddbf8205a75984796efe8b7357bae0000000000000000000000005dd2205c3aac13e592f0a3d85188c948d1781df10000000000000000000000005a09a94ee8198d3c474d723337aa58023810022c000000000000000000000000475816ca2a31d601b4e336f5c2418a67978abf0900000000000000000000000070c006fc86a392c16d7e085cefc0ad1ff7de6c750000000000000000000000009316ca66f5f936e3239e4fd2aaaea5c7b6f3c4cc0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000","delay":259200}}
      values.scheduledTransactions.47:
+        {"id":"0x304646fcc77edfed197cfc18bacc3241063f45301b0719476ef27339ddf3527a","decoded":{"chain":"arbitrum","contractName":"SecurityCouncilMemberSyncAction","function":"perform","inputs":[{"name":"_securityCouncil","value":"0x423552c0F05baCCac5Bfa91C6dCF1dc53a0A1641"},{"name":"_updatedMembers","value":["0x3Bd8e2AC65ad6f0F094BA6766cBd9484AB49eF23","0xf8e1492255d9428c2Fc20A98A1DeB1215C8ffEfd","0xb07dc9103328A51128bC6Cc1049d1137035f5E28","0x3E286452b1C66abB08Eb5494c3894F40aB5a59AF","0xb71ca4FFbB7b58d75Ba29891ab45e9Dc12B444Ed","0x8F10e3413586c4a8DCfcE19D009872b19e9cd8E3","0x0275b3D54a5dDbf8205A75984796eFE8b7357Bae","0x5DD2205C3aac13E592F0a3D85188c948D1781df1","0x5a09A94eE8198D3c474d723337aa58023810022C","0x475816ca2a31D601B4e336f5c2418A67978aBf09","0x70C006fC86A392c16D7E085cefc0Ad1FF7de6C75","0x9316ca66f5f936E3239e4fD2AAAEA5C7b6f3C4cC"]},{"name":"_nonce","value":7}],"address":"0x9BF7b8884Fa381a45f8CB2525905fb36C996297a","calldata":"0x536d8944000000000000000000000000423552c0f05baccac5bfa91c6dcf1dc53a0a164100000000000000000000000000000000000000000000000000000000000000600000000000000000000000000000000000000000000000000000000000000007000000000000000000000000000000000000000000000000000000000000000c0000000000000000000000003bd8e2ac65ad6f0f094ba6766cbd9484ab49ef23000000000000000000000000f8e1492255d9428c2fc20a98a1deb1215c8ffefd000000000000000000000000b07dc9103328a51128bc6cc1049d1137035f5e280000000000000000000000003e286452b1c66abb08eb5494c3894f40ab5a59af000000000000000000000000b71ca4ffbb7b58d75ba29891ab45e9dc12b444ed0000000000000000000000008f10e3413586c4a8dcfce19d009872b19e9cd8e30000000000000000000000000275b3d54a5ddbf8205a75984796efe8b7357bae0000000000000000000000005dd2205c3aac13e592f0a3d85188c948d1781df10000000000000000000000005a09a94ee8198d3c474d723337aa58023810022c000000000000000000000000475816ca2a31d601b4e336f5c2418a67978abf0900000000000000000000000070c006fc86a392c16d7e085cefc0ad1ff7de6c750000000000000000000000009316ca66f5f936e3239e4fd2aaaea5c7b6f3c4cc","executor":"0xCF57572261c7c2BCF21ffD220ea7d1a27D40A827","inboxOnEthereum":"0x4Dbd4fc535Ac27206064B68FfCf827b0A60BAB3f"},"raw":{"target":"0xa723C008e76E379c55599D2E4d93879BeaFDa79C","value":0,"data":"0x0000000000000000000000004dbd4fc535ac27206064b68ffcf827b0a60bab3f000000000000000000000000cf57572261c7c2bcf21ffd220ea7d1a27d40a82700000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000c000000000000000000000000000000000000000000000000000000000000002841cff79cd0000000000000000000000009bf7b8884fa381a45f8cb2525905fb36c996297a00000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000204536d8944000000000000000000000000423552c0f05baccac5bfa91c6dcf1dc53a0a164100000000000000000000000000000000000000000000000000000000000000600000000000000000000000000000000000000000000000000000000000000007000000000000000000000000000000000000000000000000000000000000000c0000000000000000000000003bd8e2ac65ad6f0f094ba6766cbd9484ab49ef23000000000000000000000000f8e1492255d9428c2fc20a98a1deb1215c8ffefd000000000000000000000000b07dc9103328a51128bc6cc1049d1137035f5e280000000000000000000000003e286452b1c66abb08eb5494c3894f40ab5a59af000000000000000000000000b71ca4ffbb7b58d75ba29891ab45e9dc12b444ed0000000000000000000000008f10e3413586c4a8dcfce19d009872b19e9cd8e30000000000000000000000000275b3d54a5ddbf8205a75984796efe8b7357bae0000000000000000000000005dd2205c3aac13e592f0a3d85188c948d1781df10000000000000000000000005a09a94ee8198d3c474d723337aa58023810022c000000000000000000000000475816ca2a31d601b4e336f5c2418a67978abf0900000000000000000000000070c006fc86a392c16d7e085cefc0ad1ff7de6c750000000000000000000000009316ca66f5f936e3239e4fd2aaaea5c7b6f3c4cc0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000","delay":259200}}
      values.scheduledTransactions.46:
+        {"id":"0x304646fcc77edfed197cfc18bacc3241063f45301b0719476ef27339ddf3527a","decoded":{"chain":"ethereum","contractName":"SecurityCouncilMemberSyncAction","function":"perform","inputs":[{"name":"_securityCouncil","value":"0xF06E95eF589D9c38af242a8AAee8375f14023F85"},{"name":"_updatedMembers","value":["0x3Bd8e2AC65ad6f0F094BA6766cBd9484AB49eF23","0xf8e1492255d9428c2Fc20A98A1DeB1215C8ffEfd","0xb07dc9103328A51128bC6Cc1049d1137035f5E28","0x3E286452b1C66abB08Eb5494c3894F40aB5a59AF","0xb71ca4FFbB7b58d75Ba29891ab45e9Dc12B444Ed","0x8F10e3413586c4a8DCfcE19D009872b19e9cd8E3","0x0275b3D54a5dDbf8205A75984796eFE8b7357Bae","0x5DD2205C3aac13E592F0a3D85188c948D1781df1","0x5a09A94eE8198D3c474d723337aa58023810022C","0x475816ca2a31D601B4e336f5c2418A67978aBf09","0x70C006fC86A392c16D7E085cefc0Ad1FF7de6C75","0x9316ca66f5f936E3239e4fD2AAAEA5C7b6f3C4cC"]},{"name":"_nonce","value":7}],"address":"0x9BF7b8884Fa381a45f8CB2525905fb36C996297a","calldata":"0x536d8944000000000000000000000000f06e95ef589d9c38af242a8aaee8375f14023f8500000000000000000000000000000000000000000000000000000000000000600000000000000000000000000000000000000000000000000000000000000007000000000000000000000000000000000000000000000000000000000000000c0000000000000000000000003bd8e2ac65ad6f0f094ba6766cbd9484ab49ef23000000000000000000000000f8e1492255d9428c2fc20a98a1deb1215c8ffefd000000000000000000000000b07dc9103328a51128bc6cc1049d1137035f5e280000000000000000000000003e286452b1c66abb08eb5494c3894f40ab5a59af000000000000000000000000b71ca4ffbb7b58d75ba29891ab45e9dc12b444ed0000000000000000000000008f10e3413586c4a8dcfce19d009872b19e9cd8e30000000000000000000000000275b3d54a5ddbf8205a75984796efe8b7357bae0000000000000000000000005dd2205c3aac13e592f0a3d85188c948d1781df10000000000000000000000005a09a94ee8198d3c474d723337aa58023810022c000000000000000000000000475816ca2a31d601b4e336f5c2418a67978abf0900000000000000000000000070c006fc86a392c16d7e085cefc0ad1ff7de6c750000000000000000000000009316ca66f5f936e3239e4fd2aaaea5c7b6f3c4cc","executor":"0x3ffFbAdAF827559da092217e474760E2b2c3CeDd"},"raw":{"target":"0x3ffFbAdAF827559da092217e474760E2b2c3CeDd","value":0,"data":"0x1cff79cd0000000000000000000000009bf7b8884fa381a45f8cb2525905fb36c996297a00000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000204536d8944000000000000000000000000f06e95ef589d9c38af242a8aaee8375f14023f8500000000000000000000000000000000000000000000000000000000000000600000000000000000000000000000000000000000000000000000000000000007000000000000000000000000000000000000000000000000000000000000000c0000000000000000000000003bd8e2ac65ad6f0f094ba6766cbd9484ab49ef23000000000000000000000000f8e1492255d9428c2fc20a98a1deb1215c8ffefd000000000000000000000000b07dc9103328a51128bc6cc1049d1137035f5e280000000000000000000000003e286452b1c66abb08eb5494c3894f40ab5a59af000000000000000000000000b71ca4ffbb7b58d75ba29891ab45e9dc12b444ed0000000000000000000000008f10e3413586c4a8dcfce19d009872b19e9cd8e30000000000000000000000000275b3d54a5ddbf8205a75984796efe8b7357bae0000000000000000000000005dd2205c3aac13e592f0a3d85188c948d1781df10000000000000000000000005a09a94ee8198d3c474d723337aa58023810022c000000000000000000000000475816ca2a31d601b4e336f5c2418a67978abf0900000000000000000000000070c006fc86a392c16d7e085cefc0ad1ff7de6c750000000000000000000000009316ca66f5f936e3239e4fd2aaaea5c7b6f3c4cc00000000000000000000000000000000000000000000000000000000","delay":259200}}
    }
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21041823 (main branch discovery), not current.

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
    contract RollupProxy (0x5eF0D09d1E6204141B4d37530808eD19f60FBa35) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      fieldMeta.confirmPeriodBlocks.description:
-        "Challenge period. (Number of blocks until a node is confirmed)."
+        "Challenge period. (Number of ETHEREUM blocks until a node is confirmed, even for L3s)."
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
    contract OneStepProver0 (0xD0465e3356213869f1Fae38b3E67CBF4E873c5B6) {
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
      template:
+        "orbitstack/OneStepProver0"
      description:
+        "One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine."
    }
```

```diff
    contract ChallengeManager (0xe5896783a2F463446E1f624e64Aa6836BE4C6f58) {
    +++ description: Contract that allows challenging state roots. Can be called through the RollupProxy by Validators or the UpgradeExecutor.
      template:
+        "orbitstack/ChallengeManager"
      description:
+        "Contract that allows challenging state roots. Can be called through the RollupProxy by Validators or the UpgradeExecutor."
    }
```

Generated with discovered.json: 0x0e84e60281e9bd0caa80ded9d50c991ca952ab64

# Diff at Fri, 25 Oct 2024 09:46:58 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@e7501f424c0cea9b5438386ee76e509448999836 block: 21027338
- current block number: 21041823

## Description

Config related.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21027338 (main branch discovery), not current.

```diff
    contract Outbox (0x0B9857ae2D4A3DBe74ffE1d7DF045bb7F96E4840) {
    +++ description: None
      issuedPermissions.0.target:
-        "0x554723262467F125Ac9e1cDFa9Ce15cc53822dbD"
+        "0x3ffFbAdAF827559da092217e474760E2b2c3CeDd"
      issuedPermissions.0.via.0:
+        {"address":"0x554723262467F125Ac9e1cDFa9Ce15cc53822dbD","delay":0}
    }
```

```diff
    contract ProxyAdmin (0x0ea6999172c1B4563695F76A52de73c848587b17) {
    +++ description: None
      receivedPermissions:
-        [{"permission":"upgrade","target":"0x83215480dB2C6A7E56f9E99EF93AB9B36F8A3DD5"}]
      template:
+        "global/ProxyAdmin"
      directlyReceivedPermissions:
+        [{"permission":"upgrade","target":"0x83215480dB2C6A7E56f9E99EF93AB9B36F8A3DD5"}]
    }
```

```diff
    contract SequencerInbox (0x1c479675ad559DC151F6Ec7ed3FbF8ceE79582B6) {
    +++ description: None
      issuedPermissions.2.target:
-        "0x554723262467F125Ac9e1cDFa9Ce15cc53822dbD"
+        "0x3ffFbAdAF827559da092217e474760E2b2c3CeDd"
      issuedPermissions.2.via.0:
+        {"address":"0x554723262467F125Ac9e1cDFa9Ce15cc53822dbD","delay":0}
    }
```

```diff
    contract ProxyAdmin (0x3f92814930f43c6a1C6B133E5945E7B3338F33a6) {
    +++ description: None
      receivedPermissions:
-        [{"permission":"upgrade","target":"0x7CF3d537733F6Ba4183A833c9B021265716cE9d0"}]
      template:
+        "global/ProxyAdmin"
      directlyReceivedPermissions:
+        [{"permission":"upgrade","target":"0x7CF3d537733F6Ba4183A833c9B021265716cE9d0"}]
    }
```

```diff
    contract UpgradeExecutor (0x3ffFbAdAF827559da092217e474760E2b2c3CeDd) {
    +++ description: None
      receivedPermissions.10:
+        {"permission":"upgrade","target":"0xE6841D92B0C345144506576eC13ECf5103aC7f49","via":[{"address":"0x5613AF0474EB9c528A34701A5b1662E3C8FA0678"}]}
      receivedPermissions.9:
+        {"permission":"upgrade","target":"0xe5896783a2F463446E1f624e64Aa6836BE4C6f58","via":[{"address":"0x554723262467F125Ac9e1cDFa9Ce15cc53822dbD"}]}
      receivedPermissions.8:
+        {"permission":"upgrade","target":"0x8315177aB297bA92A06054cE80a67Ed4DBd7ed3a","via":[{"address":"0x554723262467F125Ac9e1cDFa9Ce15cc53822dbD"}]}
      receivedPermissions.7:
+        {"permission":"upgrade","target":"0x760723CD2e632826c38Fef8CD438A4CC7E7E1A40","via":[{"address":"0x554723262467F125Ac9e1cDFa9Ce15cc53822dbD"}]}
      receivedPermissions.6:
+        {"permission":"upgrade","target":"0x667e23ABd27E623c11d4CC00ca3EC4d0bD63337a","via":[{"address":"0x554723262467F125Ac9e1cDFa9Ce15cc53822dbD"}]}
      receivedPermissions.5:
+        {"permission":"upgrade","target":"0x5eF0D09d1E6204141B4d37530808eD19f60FBa35"}
      receivedPermissions.4:
+        {"permission":"upgrade","target":"0x57Bd336d579A51938619271a7Cc137a46D0501B1","via":[{"address":"0x554723262467F125Ac9e1cDFa9Ce15cc53822dbD"}]}
      receivedPermissions.3:
+        {"permission":"upgrade","target":"0x4Dbd4fc535Ac27206064B68FfCf827b0A60BAB3f","via":[{"address":"0x554723262467F125Ac9e1cDFa9Ce15cc53822dbD"}]}
      receivedPermissions.2.target:
-        "0xE6841D92B0C345144506576eC13ECf5103aC7f49"
+        "0x3ffFbAdAF827559da092217e474760E2b2c3CeDd"
      receivedPermissions.1.target:
-        "0x5eF0D09d1E6204141B4d37530808eD19f60FBa35"
+        "0x1c479675ad559DC151F6Ec7ed3FbF8ceE79582B6"
      receivedPermissions.1.via:
+        [{"address":"0x554723262467F125Ac9e1cDFa9Ce15cc53822dbD"}]
      receivedPermissions.0.target:
-        "0x3ffFbAdAF827559da092217e474760E2b2c3CeDd"
+        "0x0B9857ae2D4A3DBe74ffE1d7DF045bb7F96E4840"
      receivedPermissions.0.via.0.address:
-        "0x5613AF0474EB9c528A34701A5b1662E3C8FA0678"
+        "0x554723262467F125Ac9e1cDFa9Ce15cc53822dbD"
      directlyReceivedPermissions.2:
+        {"permission":"act","target":"0xF06E95eF589D9c38af242a8AAee8375f14023F85"}
      directlyReceivedPermissions.1.target:
-        "0xF06E95eF589D9c38af242a8AAee8375f14023F85"
+        "0x5613AF0474EB9c528A34701A5b1662E3C8FA0678"
      directlyReceivedPermissions.0.target:
-        "0x5613AF0474EB9c528A34701A5b1662E3C8FA0678"
+        "0x554723262467F125Ac9e1cDFa9Ce15cc53822dbD"
    }
```

```diff
    contract ProxyAdmin (0x4561A4cDA2CB8a61ED023785bc1817fdf685dcb3) {
    +++ description: None
      receivedPermissions:
-        [{"permission":"upgrade","target":"0x56D83349c2B8DCF74d7E92D5b6B33d0BADD52D78"}]
      template:
+        "global/ProxyAdmin"
      directlyReceivedPermissions:
+        [{"permission":"upgrade","target":"0x56D83349c2B8DCF74d7E92D5b6B33d0BADD52D78"}]
    }
```

```diff
    contract Inbox (0x4Dbd4fc535Ac27206064B68FfCf827b0A60BAB3f) {
    +++ description: None
      issuedPermissions.0.target:
-        "0x554723262467F125Ac9e1cDFa9Ce15cc53822dbD"
+        "0x3ffFbAdAF827559da092217e474760E2b2c3CeDd"
      issuedPermissions.0.via.0:
+        {"address":"0x554723262467F125Ac9e1cDFa9Ce15cc53822dbD","delay":0}
    }
```

```diff
    contract ProxyAdmin (0x509E3CDc218d163DB9A03678107b72e00163b061) {
    +++ description: None
      receivedPermissions:
-        [{"permission":"upgrade","target":"0xB0CB1384e3f4a9a9b2447e39b05e10631E1D34B0"}]
      template:
+        "global/ProxyAdmin"
      directlyReceivedPermissions:
+        [{"permission":"upgrade","target":"0xB0CB1384e3f4a9a9b2447e39b05e10631E1D34B0"}]
    }
```

```diff
    contract ArbitrumProxyAdmin (0x554723262467F125Ac9e1cDFa9Ce15cc53822dbD) {
    +++ description: None
      receivedPermissions:
-        [{"permission":"upgrade","target":"0x0B9857ae2D4A3DBe74ffE1d7DF045bb7F96E4840"},{"permission":"upgrade","target":"0x1c479675ad559DC151F6Ec7ed3FbF8ceE79582B6"},{"permission":"upgrade","target":"0x4Dbd4fc535Ac27206064B68FfCf827b0A60BAB3f"},{"permission":"upgrade","target":"0x57Bd336d579A51938619271a7Cc137a46D0501B1"},{"permission":"upgrade","target":"0x667e23ABd27E623c11d4CC00ca3EC4d0bD63337a"},{"permission":"upgrade","target":"0x760723CD2e632826c38Fef8CD438A4CC7E7E1A40"},{"permission":"upgrade","target":"0x8315177aB297bA92A06054cE80a67Ed4DBd7ed3a"},{"permission":"upgrade","target":"0xe5896783a2F463446E1f624e64Aa6836BE4C6f58"}]
      template:
+        "global/ProxyAdmin"
      directlyReceivedPermissions:
+        [{"permission":"upgrade","target":"0x0B9857ae2D4A3DBe74ffE1d7DF045bb7F96E4840"},{"permission":"upgrade","target":"0x1c479675ad559DC151F6Ec7ed3FbF8ceE79582B6"},{"permission":"upgrade","target":"0x4Dbd4fc535Ac27206064B68FfCf827b0A60BAB3f"},{"permission":"upgrade","target":"0x57Bd336d579A51938619271a7Cc137a46D0501B1"},{"permission":"upgrade","target":"0x667e23ABd27E623c11d4CC00ca3EC4d0bD63337a"},{"permission":"upgrade","target":"0x760723CD2e632826c38Fef8CD438A4CC7E7E1A40"},{"permission":"upgrade","target":"0x8315177aB297bA92A06054cE80a67Ed4DBd7ed3a"},{"permission":"upgrade","target":"0xe5896783a2F463446E1f624e64Aa6836BE4C6f58"}]
    }
```

```diff
    contract ValidatorWallet (0x56D83349c2B8DCF74d7E92D5b6B33d0BADD52D78) {
    +++ description: None
      issuedPermissions.0.target:
-        "0x4561A4cDA2CB8a61ED023785bc1817fdf685dcb3"
+        "0x194DAFaB3B9B24B181a63F81eE42b322Cd0Db6E5"
      issuedPermissions.0.via.0:
+        {"address":"0x4561A4cDA2CB8a61ED023785bc1817fdf685dcb3","delay":0}
    }
```

```diff
    contract RollupEventInbox (0x57Bd336d579A51938619271a7Cc137a46D0501B1) {
    +++ description: None
      issuedPermissions.0.target:
-        "0x554723262467F125Ac9e1cDFa9Ce15cc53822dbD"
+        "0x3ffFbAdAF827559da092217e474760E2b2c3CeDd"
      issuedPermissions.0.via.0:
+        {"address":"0x554723262467F125Ac9e1cDFa9Ce15cc53822dbD","delay":0}
    }
```

```diff
    contract OutboxV0 (0x667e23ABd27E623c11d4CC00ca3EC4d0bD63337a) {
    +++ description: None
      issuedPermissions.0.target:
-        "0x554723262467F125Ac9e1cDFa9Ce15cc53822dbD"
+        "0x3ffFbAdAF827559da092217e474760E2b2c3CeDd"
      issuedPermissions.0.via.0:
+        {"address":"0x554723262467F125Ac9e1cDFa9Ce15cc53822dbD","delay":0}
    }
```

```diff
    contract OutboxV1 (0x760723CD2e632826c38Fef8CD438A4CC7E7E1A40) {
    +++ description: None
      issuedPermissions.0.target:
-        "0x554723262467F125Ac9e1cDFa9Ce15cc53822dbD"
+        "0x3ffFbAdAF827559da092217e474760E2b2c3CeDd"
      issuedPermissions.0.via.0:
+        {"address":"0x554723262467F125Ac9e1cDFa9Ce15cc53822dbD","delay":0}
    }
```

```diff
    contract ValidatorWallet (0x7CF3d537733F6Ba4183A833c9B021265716cE9d0) {
    +++ description: None
      issuedPermissions.0.target:
-        "0x3f92814930f43c6a1C6B133E5945E7B3338F33a6"
+        "0xC234E41AE2cb00311956Aa7109fC801ae8c80941"
      issuedPermissions.0.via.0:
+        {"address":"0x3f92814930f43c6a1C6B133E5945E7B3338F33a6","delay":0}
    }
```

```diff
    contract Bridge (0x8315177aB297bA92A06054cE80a67Ed4DBd7ed3a) {
    +++ description: None
      issuedPermissions.0.target:
-        "0x554723262467F125Ac9e1cDFa9Ce15cc53822dbD"
+        "0x3ffFbAdAF827559da092217e474760E2b2c3CeDd"
      issuedPermissions.0.via.0:
+        {"address":"0x554723262467F125Ac9e1cDFa9Ce15cc53822dbD","delay":0}
    }
```

```diff
    contract ValidatorWallet (0x83215480dB2C6A7E56f9E99EF93AB9B36F8A3DD5) {
    +++ description: None
      issuedPermissions.0.target:
-        "0x0ea6999172c1B4563695F76A52de73c848587b17"
+        "0xC234E41AE2cb00311956Aa7109fC801ae8c80941"
      issuedPermissions.0.via.0:
+        {"address":"0x0ea6999172c1B4563695F76A52de73c848587b17","delay":0}
    }
```

```diff
    contract ValidatorWallet (0xB0CB1384e3f4a9a9b2447e39b05e10631E1D34B0) {
    +++ description: None
      issuedPermissions.0.target:
-        "0x509E3CDc218d163DB9A03678107b72e00163b061"
+        "0xd3132d052C9045D7cB0236586C9E2276e654343D"
      issuedPermissions.0.via.0:
+        {"address":"0x509E3CDc218d163DB9A03678107b72e00163b061","delay":0}
    }
```

```diff
    contract ValidatorOwnerMultisig (0xC234E41AE2cb00311956Aa7109fC801ae8c80941) {
    +++ description: None
      receivedPermissions:
+        [{"permission":"upgrade","target":"0x7CF3d537733F6Ba4183A833c9B021265716cE9d0","via":[{"address":"0x3f92814930f43c6a1C6B133E5945E7B3338F33a6"}]},{"permission":"upgrade","target":"0x83215480dB2C6A7E56f9E99EF93AB9B36F8A3DD5","via":[{"address":"0x0ea6999172c1B4563695F76A52de73c848587b17"}]}]
      directlyReceivedPermissions:
+        [{"permission":"act","target":"0x0ea6999172c1B4563695F76A52de73c848587b17"},{"permission":"act","target":"0x3f92814930f43c6a1C6B133E5945E7B3338F33a6"}]
    }
```

```diff
    contract ProxyAdmin (0xCcadc6B174BEcf31a35b818373e90391971a1C0c) {
    +++ description: None
      receivedPermissions:
-        [{"permission":"upgrade","target":"0xf59caf75e8A4bFBA4e6e07aD86C7E498E4d2519b"}]
      template:
+        "global/ProxyAdmin"
      directlyReceivedPermissions:
+        [{"permission":"upgrade","target":"0xf59caf75e8A4bFBA4e6e07aD86C7E498E4d2519b"}]
    }
```

```diff
    contract ChallengeManager (0xe5896783a2F463446E1f624e64Aa6836BE4C6f58) {
    +++ description: None
      issuedPermissions.0.target:
-        "0x554723262467F125Ac9e1cDFa9Ce15cc53822dbD"
+        "0x3ffFbAdAF827559da092217e474760E2b2c3CeDd"
      issuedPermissions.0.via.0:
+        {"address":"0x554723262467F125Ac9e1cDFa9Ce15cc53822dbD","delay":0}
    }
```

```diff
    contract ValidatorWallet (0xf59caf75e8A4bFBA4e6e07aD86C7E498E4d2519b) {
    +++ description: None
      issuedPermissions.0.target:
-        "0xCcadc6B174BEcf31a35b818373e90391971a1C0c"
+        "0xcd6BeDC12de2bF49afDE86cc91031d207318F207"
      issuedPermissions.0.via.0:
+        {"address":"0xCcadc6B174BEcf31a35b818373e90391971a1C0c","delay":0}
    }
```

Generated with discovered.json: 0x652e372f2410121c6860d417e6909dbdde4af08e

# Diff at Wed, 23 Oct 2024 14:35:44 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@9cc37d16a5f0b172bb41f98d8a970963e5ca4afb block: 20826339
- current block number: 21027338

## Description

The 'prolong L2 Timelock' tx is queued on L1.

## Watched changes

```diff
    contract L1Timelock (0xE6841D92B0C345144506576eC13ECf5103aC7f49) {
    +++ description: None
      values.scheduledTransactions.45:
+        {"id":"0xbf3be160a5b8d10510a05f0bb2a976bef48895f2dd097852c6b0059f36debed6","decoded":{"chain":"arbitrum","contractName":"CoreGovTimelockUpdateDelayEightDayAction","function":"perform","inputs":[],"address":"0x5B947D8bF197467be7ef381b7cAfEE0A7B35737A","calldata":"0xb147f40c","executor":"0xCF57572261c7c2BCF21ffD220ea7d1a27D40A827","inboxOnEthereum":"0x4Dbd4fc535Ac27206064B68FfCf827b0A60BAB3f"},"raw":{"target":"0xa723C008e76E379c55599D2E4d93879BeaFDa79C","value":0,"data":"0x0000000000000000000000004dbd4fc535ac27206064b68ffcf827b0a60bab3f000000000000000000000000cf57572261c7c2bcf21ffd220ea7d1a27d40a82700000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000c000000000000000000000000000000000000000000000000000000000000000841cff79cd0000000000000000000000005b947d8bf197467be7ef381b7cafee0a7b35737a00000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000004b147f40c0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000","delay":259200}}
    }
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20826339 (main branch discovery), not current.

```diff
    contract ValidatorWallet (0x56D83349c2B8DCF74d7E92D5b6B33d0BADD52D78) {
    +++ description: None
      receivedPermissions.1:
+        {"permission":"propose","target":"0x5eF0D09d1E6204141B4d37530808eD19f60FBa35","description":"can submit state roots to the RollupProxy contract on the host chain."}
      receivedPermissions.0.permission:
-        "validate"
+        "challenge"
      receivedPermissions.0.description:
+        "can challenge state roots on the host chain."
    }
```

```diff
-   Status: DELETED
    contract ValidatorWallet (0x5Bc5FB83950bBbF156E433c5c098bFe533Db4021)
    +++ description: None
```

```diff
    contract RollupProxy (0x5eF0D09d1E6204141B4d37530808eD19f60FBa35) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      description:
-        "Manages rollup components, list of Stakers and Validators. Entry point for Validators creating new Rollup Nodes (state commits) and Challengers submitting fraud proofs."
+        "Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators)."
      issuedPermissions.28:
+        {"permission":"upgrade","target":"0x3ffFbAdAF827559da092217e474760E2b2c3CeDd","via":[]}
      issuedPermissions.27:
+        {"permission":"propose","target":"0xF8D3E1cF58386c92B27710C6a0D8A54c76BC6ab5","via":[]}
      issuedPermissions.26:
+        {"permission":"propose","target":"0xf59caf75e8A4bFBA4e6e07aD86C7E498E4d2519b","via":[]}
      issuedPermissions.25:
+        {"permission":"propose","target":"0xdDf2F71Ab206C0138A8eceEb54386567D5abF01E","via":[]}
      issuedPermissions.24:
+        {"permission":"propose","target":"0xB51EDdfc9A945e2B909905e4F242C4796Ac0C61d","via":[]}
      issuedPermissions.23:
+        {"permission":"propose","target":"0xB0CB1384e3f4a9a9b2447e39b05e10631E1D34B0","via":[]}
      issuedPermissions.22:
+        {"permission":"propose","target":"0xAB1A39332e934300eBCc57B5f95cA90631a347FF","via":[]}
      issuedPermissions.21:
+        {"permission":"propose","target":"0x83215480dB2C6A7E56f9E99EF93AB9B36F8A3DD5","via":[]}
      issuedPermissions.20:
+        {"permission":"propose","target":"0x7CF3d537733F6Ba4183A833c9B021265716cE9d0","via":[]}
      issuedPermissions.19:
+        {"permission":"propose","target":"0x758C6bB08B3ea5889B5cddbdeF9A45b3a983c398","via":[]}
      issuedPermissions.18:
+        {"permission":"propose","target":"0x6Fb914de4653eC5592B7c15F4d9466Cbd03F2104","via":[]}
      issuedPermissions.17:
+        {"permission":"propose","target":"0x610Aa279989F440820e14248BD3879B148717974","via":[]}
      issuedPermissions.16:
+        {"permission":"propose","target":"0x56D83349c2B8DCF74d7E92D5b6B33d0BADD52D78","via":[]}
      issuedPermissions.15:
+        {"permission":"propose","target":"0x54c0D3d6C101580dB3be8763A2aE2c6bb9dc840c","via":[]}
      issuedPermissions.14.permission:
-        "validate"
+        "propose"
      issuedPermissions.14.target:
-        "0xF8D3E1cF58386c92B27710C6a0D8A54c76BC6ab5"
+        "0x0fF813f6BD577c3D1cDbE435baC0621BE6aE34B4"
      issuedPermissions.13.permission:
-        "validate"
+        "challenge"
      issuedPermissions.13.target:
-        "0xf59caf75e8A4bFBA4e6e07aD86C7E498E4d2519b"
+        "0xF8D3E1cF58386c92B27710C6a0D8A54c76BC6ab5"
      issuedPermissions.12.permission:
-        "validate"
+        "challenge"
      issuedPermissions.12.target:
-        "0xdDf2F71Ab206C0138A8eceEb54386567D5abF01E"
+        "0xf59caf75e8A4bFBA4e6e07aD86C7E498E4d2519b"
      issuedPermissions.11.permission:
-        "validate"
+        "challenge"
      issuedPermissions.11.target:
-        "0xB51EDdfc9A945e2B909905e4F242C4796Ac0C61d"
+        "0xdDf2F71Ab206C0138A8eceEb54386567D5abF01E"
      issuedPermissions.10.permission:
-        "validate"
+        "challenge"
      issuedPermissions.10.target:
-        "0xB0CB1384e3f4a9a9b2447e39b05e10631E1D34B0"
+        "0xB51EDdfc9A945e2B909905e4F242C4796Ac0C61d"
      issuedPermissions.9.permission:
-        "validate"
+        "challenge"
      issuedPermissions.9.target:
-        "0xAB1A39332e934300eBCc57B5f95cA90631a347FF"
+        "0xB0CB1384e3f4a9a9b2447e39b05e10631E1D34B0"
      issuedPermissions.8.permission:
-        "validate"
+        "challenge"
      issuedPermissions.8.target:
-        "0x83215480dB2C6A7E56f9E99EF93AB9B36F8A3DD5"
+        "0xAB1A39332e934300eBCc57B5f95cA90631a347FF"
      issuedPermissions.7.permission:
-        "validate"
+        "challenge"
      issuedPermissions.7.target:
-        "0x7CF3d537733F6Ba4183A833c9B021265716cE9d0"
+        "0x83215480dB2C6A7E56f9E99EF93AB9B36F8A3DD5"
      issuedPermissions.6.permission:
-        "validate"
+        "challenge"
      issuedPermissions.6.target:
-        "0x758C6bB08B3ea5889B5cddbdeF9A45b3a983c398"
+        "0x7CF3d537733F6Ba4183A833c9B021265716cE9d0"
      issuedPermissions.5.permission:
-        "validate"
+        "challenge"
      issuedPermissions.5.target:
-        "0x6Fb914de4653eC5592B7c15F4d9466Cbd03F2104"
+        "0x758C6bB08B3ea5889B5cddbdeF9A45b3a983c398"
      issuedPermissions.4.permission:
-        "validate"
+        "challenge"
      issuedPermissions.4.target:
-        "0x610Aa279989F440820e14248BD3879B148717974"
+        "0x6Fb914de4653eC5592B7c15F4d9466Cbd03F2104"
      issuedPermissions.3.permission:
-        "validate"
+        "challenge"
      issuedPermissions.3.target:
-        "0x56D83349c2B8DCF74d7E92D5b6B33d0BADD52D78"
+        "0x610Aa279989F440820e14248BD3879B148717974"
      issuedPermissions.2.permission:
-        "validate"
+        "challenge"
      issuedPermissions.2.target:
-        "0x54c0D3d6C101580dB3be8763A2aE2c6bb9dc840c"
+        "0x56D83349c2B8DCF74d7E92D5b6B33d0BADD52D78"
      issuedPermissions.1.permission:
-        "validate"
+        "challenge"
      issuedPermissions.1.target:
-        "0x0fF813f6BD577c3D1cDbE435baC0621BE6aE34B4"
+        "0x54c0D3d6C101580dB3be8763A2aE2c6bb9dc840c"
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

```diff
    contract Validator (0x758C6bB08B3ea5889B5cddbdeF9A45b3a983c398) {
    +++ description: None
      receivedPermissions.1:
+        {"permission":"propose","target":"0x5eF0D09d1E6204141B4d37530808eD19f60FBa35","description":"can submit state roots to the RollupProxy contract on the host chain."}
      receivedPermissions.0.permission:
-        "validate"
+        "challenge"
      receivedPermissions.0.description:
+        "can challenge state roots on the host chain."
    }
```

```diff
    contract ValidatorWallet (0x7CF3d537733F6Ba4183A833c9B021265716cE9d0) {
    +++ description: None
      receivedPermissions.1:
+        {"permission":"propose","target":"0x5eF0D09d1E6204141B4d37530808eD19f60FBa35","description":"can submit state roots to the RollupProxy contract on the host chain."}
      receivedPermissions.0.permission:
-        "validate"
+        "challenge"
      receivedPermissions.0.description:
+        "can challenge state roots on the host chain."
    }
```

```diff
    contract ValidatorWallet (0x83215480dB2C6A7E56f9E99EF93AB9B36F8A3DD5) {
    +++ description: None
      receivedPermissions.1:
+        {"permission":"propose","target":"0x5eF0D09d1E6204141B4d37530808eD19f60FBa35","description":"can submit state roots to the RollupProxy contract on the host chain."}
      receivedPermissions.0.permission:
-        "validate"
+        "challenge"
      receivedPermissions.0.description:
+        "can challenge state roots on the host chain."
    }
```

```diff
-   Status: DELETED
    contract ValidatorWalletCreator (0x960953f7c69cd2BC2322Db9223A815C680ccc7ea)
    +++ description: None
```

```diff
    contract ValidatorWallet (0xB0CB1384e3f4a9a9b2447e39b05e10631E1D34B0) {
    +++ description: None
      receivedPermissions.1:
+        {"permission":"propose","target":"0x5eF0D09d1E6204141B4d37530808eD19f60FBa35","description":"can submit state roots to the RollupProxy contract on the host chain."}
      receivedPermissions.0.permission:
-        "validate"
+        "challenge"
      receivedPermissions.0.description:
+        "can challenge state roots on the host chain."
    }
```

```diff
    contract ValidatorWallet (0xf59caf75e8A4bFBA4e6e07aD86C7E498E4d2519b) {
    +++ description: None
      receivedPermissions.1:
+        {"permission":"propose","target":"0x5eF0D09d1E6204141B4d37530808eD19f60FBa35","description":"can submit state roots to the RollupProxy contract on the host chain."}
      receivedPermissions.0.permission:
-        "validate"
+        "challenge"
      receivedPermissions.0.description:
+        "can challenge state roots on the host chain."
    }
```

Generated with discovered.json: 0x352c1216d0112b3cf53c7440e2c09ba86f3448ad

# Diff at Mon, 21 Oct 2024 12:42:47 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@e660599f23a07618fe949a07be1f516ce44f1914 block: 20826339
- current block number: 20826339

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20826339 (main branch discovery), not current.

```diff
    contract RollupProxy (0x5eF0D09d1E6204141B4d37530808eD19f60FBa35) {
    +++ description: Manages rollup components, list of Stakers and Validators. Entry point for Validators creating new Rollup Nodes (state commits) and Challengers submitting fraud proofs.
      descriptions:
-        ["Manages rollup components, list of Stakers and Validators. Entry point for Validators creating new Rollup Nodes (state commits) and Challengers submitting fraud proofs."]
      description:
+        "Manages rollup components, list of Stakers and Validators. Entry point for Validators creating new Rollup Nodes (state commits) and Challengers submitting fraud proofs."
    }
```

Generated with discovered.json: 0x86e01d867f9e56c8bb2f76691dfb127b6d97cc46

# Diff at Mon, 21 Oct 2024 11:04:23 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@8895d33866f5665c4c710f4ddaa32bfa63cc3c78 block: 20826339
- current block number: 20826339

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20826339 (main branch discovery), not current.

```diff
    contract Outbox (0x0B9857ae2D4A3DBe74ffE1d7DF045bb7F96E4840) {
    +++ description: None
      values.$pastUpgrades.0.2:
+        ["0x0eA7372338a589e7f0b00E463a53AA464ef04e17"]
      values.$pastUpgrades.0.1:
-        ["0x0eA7372338a589e7f0b00E463a53AA464ef04e17"]
+        "0x248787fbf0415ff1da68ba618da0cbdd5dcc7c6029be38709f95ea837211edc5"
    }
```

```diff
    contract wstETHEscrow (0x0F25c1DC2a9922304f2eac71DCa9B07E310e8E5a) {
    +++ description: None
      values.$pastUpgrades.0.2:
+        ["0xc4E3ff0b5B106f88Fc64c43031BE8b076ee9F21C"]
      values.$pastUpgrades.0.1:
-        ["0xc4E3ff0b5B106f88Fc64c43031BE8b076ee9F21C"]
+        "0x912fc5992f5a24c2ffe5e230ac51fcc4724cb3e4a23535b04eec34f99f77e3a8"
    }
```

```diff
    contract SequencerInbox (0x1c479675ad559DC151F6Ec7ed3FbF8ceE79582B6) {
    +++ description: None
      values.$pastUpgrades.4.2:
+        ["0x31DA64D19Cd31A19CD09F4070366Fe2144792cf7"]
      values.$pastUpgrades.4.1:
-        ["0x31DA64D19Cd31A19CD09F4070366Fe2144792cf7"]
+        "0x51b492ac498a88565639cfe3df77be8729d61f1c413d00b66530d4022a13c36a"
      values.$pastUpgrades.3.2:
+        ["0xD03bFe2CE83632F4E618a97299cc91B1335BB2d9"]
      values.$pastUpgrades.3.1:
-        ["0xD03bFe2CE83632F4E618a97299cc91B1335BB2d9"]
+        "0x0f4db1811c997e979b8f7be3cd8509b5ea0bb6a366a1848a0905f9c7f50c8612"
      values.$pastUpgrades.2.2:
+        ["0xcc4e9E22AcDf93192cf7E149D7563F6d660E9Afc"]
      values.$pastUpgrades.2.1:
-        ["0xcc4e9E22AcDf93192cf7E149D7563F6d660E9Afc"]
+        "0xbfd8f54bf6b44ea4bcd76306d74b63602ee654e6a344bccca1825a388050988b"
      values.$pastUpgrades.1.2:
+        ["0x16242595cAfA3a207E9354E3bdb000B59bA82875"]
      values.$pastUpgrades.1.1:
-        ["0x16242595cAfA3a207E9354E3bdb000B59bA82875"]
+        "0x07bbd6efdc155699ab2807c0d1509e98e06aa58ce25f208f09c03899f3a128cd"
      values.$pastUpgrades.0.2:
+        ["0xbe04Ab2728c924D678f9FC833E379688c6eFA317"]
      values.$pastUpgrades.0.1:
-        ["0xbe04Ab2728c924D678f9FC833E379688c6eFA317"]
+        "0x248787fbf0415ff1da68ba618da0cbdd5dcc7c6029be38709f95ea837211edc5"
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
    contract Inbox (0x4Dbd4fc535Ac27206064B68FfCf827b0A60BAB3f) {
    +++ description: None
      values.$pastUpgrades.8.2:
+        ["0x5aED5f8A1e3607476F1f81c3d8fe126deB0aFE94"]
      values.$pastUpgrades.8.1:
-        ["0x5aED5f8A1e3607476F1f81c3d8fe126deB0aFE94"]
+        "0x0bd4aae6c69f7e6aae36a112aae4793716f23620ed242027cc84c9236f170836"
      values.$pastUpgrades.7.2:
+        ["0x931E1770BEC7827841f3989bda43319adACD62db"]
      values.$pastUpgrades.7.1:
-        ["0x931E1770BEC7827841f3989bda43319adACD62db"]
+        "0xd2638d4092738bced51f259ca8ab228c21763fd0e5d85657a75aec811c2c51f3"
      values.$pastUpgrades.6.2:
+        ["0x1b2676D32E2f7430a564DD4560641F990dFE3D6a"]
      values.$pastUpgrades.6.1:
-        ["0x1b2676D32E2f7430a564DD4560641F990dFE3D6a"]
+        "0xbfd8f54bf6b44ea4bcd76306d74b63602ee654e6a344bccca1825a388050988b"
      values.$pastUpgrades.5.2:
+        ["0x3E2198A77FC6B266082b92859092170763548730"]
      values.$pastUpgrades.5.1:
-        ["0x3E2198A77FC6B266082b92859092170763548730"]
+        "0x7dfb8f1f20815629a78dc16a8657306b6d200041624c4f3410d659cbdab2bc9f"
      values.$pastUpgrades.4.2:
+        ["0xe4B8015Ea98fc86D7fDe16CdfD1B7A250cD93e2B"]
      values.$pastUpgrades.4.1:
-        ["0xe4B8015Ea98fc86D7fDe16CdfD1B7A250cD93e2B"]
+        "0xe679c9810cdff738114c551b47b1c30b5445f684a12a25dfaf27dac2e613591a"
      values.$pastUpgrades.3.2:
+        ["0xc23E3F20340f8ef09c8861a724C29dB43bA3eeD4"]
      values.$pastUpgrades.3.1:
-        ["0xc23E3F20340f8ef09c8861a724C29dB43bA3eeD4"]
+        "0x3e8e23623e0dbda0b428efd30e71ef7b0e61622fc036db4943ce78bbfd129f91"
      values.$pastUpgrades.2.2:
+        ["0x048cc108763de75E080Ad717bD284003aa49eA15"]
      values.$pastUpgrades.2.1:
-        ["0x048cc108763de75E080Ad717bD284003aa49eA15"]
+        "0x37915ab37a7161dbc2f41340849491bcfc77eddce6fa3bce2918b1277e40597b"
      values.$pastUpgrades.1.2:
+        ["0xE5dB9273e7279F1485b30D8553183E3E29532ca3"]
      values.$pastUpgrades.1.1:
-        ["0xE5dB9273e7279F1485b30D8553183E3E29532ca3"]
+        "0xc71c860df401495251ad1f549dbfd4995f4284e40454765f32e2e873f4aa63dc"
      values.$pastUpgrades.0.2:
+        ["0xB38634F1192fd4A4864b99a4C9100339815c6450"]
      values.$pastUpgrades.0.1:
-        ["0xB38634F1192fd4A4864b99a4C9100339815c6450"]
+        "0x2a41e48a9927eddb62c3d45d7a2eb0304281d4b9e7db8d52022c3ff80f7751df"
    }
```

```diff
    contract ValidatorWallet (0x56D83349c2B8DCF74d7E92D5b6B33d0BADD52D78) {
    +++ description: None
      values.$pastUpgrades.0.2:
+        ["0x5Bc5FB83950bBbF156E433c5c098bFe533Db4021"]
      values.$pastUpgrades.0.1:
-        ["0x5Bc5FB83950bBbF156E433c5c098bFe533Db4021"]
+        "0x6f06c2c00cc93a2fb3df84164645432cc807db29d6184e504bc5d377139982c5"
    }
```

```diff
    contract RollupEventInbox (0x57Bd336d579A51938619271a7Cc137a46D0501B1) {
    +++ description: None
      values.$pastUpgrades.0.2:
+        ["0x806421D09cDb253aa9d128a658e60c0B95eFFA01"]
      values.$pastUpgrades.0.1:
-        ["0x806421D09cDb253aa9d128a658e60c0B95eFFA01"]
+        "0x248787fbf0415ff1da68ba618da0cbdd5dcc7c6029be38709f95ea837211edc5"
    }
```

```diff
    contract RollupProxy (0x5eF0D09d1E6204141B4d37530808eD19f60FBa35) {
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
+        ["0x75fc5465c4BaD74B367ac917f7298aD66c308Fb8","0x4C5960936f1635765e37Ff1a220D7344b27D7046"]
      values.$pastUpgrades.0.1:
-        ["0x75fc5465c4BaD74B367ac917f7298aD66c308Fb8","0x4C5960936f1635765e37Ff1a220D7344b27D7046"]
+        "0x248787fbf0415ff1da68ba618da0cbdd5dcc7c6029be38709f95ea837211edc5"
    }
```

```diff
    contract OutboxV0 (0x667e23ABd27E623c11d4CC00ca3EC4d0bD63337a) {
    +++ description: None
      values.$pastUpgrades.1.2:
+        ["0x263a68002876E307804168795519da0B32CC62fE"]
      values.$pastUpgrades.1.1:
-        ["0x263a68002876E307804168795519da0B32CC62fE"]
+        "0xe679c9810cdff738114c551b47b1c30b5445f684a12a25dfaf27dac2e613591a"
      values.$pastUpgrades.0.2:
+        ["0xb91f4bE773F5a1b9b0dC1085663b3535A6EBeEE2"]
      values.$pastUpgrades.0.1:
-        ["0xb91f4bE773F5a1b9b0dC1085663b3535A6EBeEE2"]
+        "0xe63e93e3aeaeab596c9b5f306d0f9b42f5afdc11035d4b247278916ee39376cd"
    }
```

```diff
    contract L1GatewayRouter (0x72Ce9c846789fdB6fC1f34aC4AD25Dd9ef7031ef) {
    +++ description: None
      values.$pastUpgrades.7.2:
+        ["0x52595021fA01B3E14EC6C88953AFc8E35dFf423c"]
      values.$pastUpgrades.7.1:
-        ["0x52595021fA01B3E14EC6C88953AFc8E35dFf423c"]
+        "0x0f4db1811c997e979b8f7be3cd8509b5ea0bb6a366a1848a0905f9c7f50c8612"
      values.$pastUpgrades.6.2:
+        ["0x6D1c576Fe3e54313990450f5Fa322306B4cCB47B"]
      values.$pastUpgrades.6.1:
-        ["0x6D1c576Fe3e54313990450f5Fa322306B4cCB47B"]
+        "0xf2ba2551709d23686f52c3a3ecc65ae8347f1bab1877265c57ba260e8222bf33"
      values.$pastUpgrades.5.2:
+        ["0x2e8e3e55cE12F981EbF8E545Cb263aB238e19715"]
      values.$pastUpgrades.5.1:
-        ["0x2e8e3e55cE12F981EbF8E545Cb263aB238e19715"]
+        "0x656bdf44374b1fc07ce0a01b9645e2b03a4f134b35dfe41fd3e2045cfe082411"
      values.$pastUpgrades.4.2:
+        ["0x32f39fa08c1E0bbA551CBDa4197e543C53b3fC53"]
      values.$pastUpgrades.4.1:
-        ["0x32f39fa08c1E0bbA551CBDa4197e543C53b3fC53"]
+        "0x14a48840cec5b16e7e909ddbe69eec7edaeafde958c866a97a048b2daf9f9c1f"
      values.$pastUpgrades.3.2:
+        ["0x594393B6A6A46190dF3E479304bbC63572c6830a"]
      values.$pastUpgrades.3.1:
-        ["0x594393B6A6A46190dF3E479304bbC63572c6830a"]
+        "0x92bf07ee654ad93ad41c093f045cde6cd4b839d0e3a6b0532a8ab18090208f35"
      values.$pastUpgrades.2.2:
+        ["0x62285266B5ec3d5B8867c84B807b79B2c13892EC"]
      values.$pastUpgrades.2.1:
-        ["0x62285266B5ec3d5B8867c84B807b79B2c13892EC"]
+        "0x29c02be0f39043d705dd8d3eb2af9e3b3ae5e94251aa294e7c4e919252f80ab0"
      values.$pastUpgrades.1.2:
+        ["0x555d10f9E4d1b60B9c3F87F4E835119B2C65c8B0"]
      values.$pastUpgrades.1.1:
-        ["0x555d10f9E4d1b60B9c3F87F4E835119B2C65c8B0"]
+        "0x5dc6e34fc33a880f60903032ae94b8bb11973c0102c7959490bbc0ea124f11e9"
      values.$pastUpgrades.0.2:
+        ["0x4b2Cf3BE8677096310b32a648b0Bdb8c5A8dDC94"]
      values.$pastUpgrades.0.1:
-        ["0x4b2Cf3BE8677096310b32a648b0Bdb8c5A8dDC94"]
+        "0xb143deb4f1396daa96ea8e5be22dc6b188a09653bdf300b1f40573cce7ad01f0"
    }
```

```diff
    contract OutboxV1 (0x760723CD2e632826c38Fef8CD438A4CC7E7E1A40) {
    +++ description: None
      values.$pastUpgrades.0.2:
+        ["0x360861b7b245c968128F0a53d281aDb1Df760711"]
      values.$pastUpgrades.0.1:
-        ["0x360861b7b245c968128F0a53d281aDb1Df760711"]
+        "0xe679c9810cdff738114c551b47b1c30b5445f684a12a25dfaf27dac2e613591a"
    }
```

```diff
    contract ValidatorWallet (0x7CF3d537733F6Ba4183A833c9B021265716cE9d0) {
    +++ description: None
      values.$pastUpgrades.0.2:
+        ["0x5Bc5FB83950bBbF156E433c5c098bFe533Db4021"]
      values.$pastUpgrades.0.1:
-        ["0x5Bc5FB83950bBbF156E433c5c098bFe533Db4021"]
+        "0x9342ae98b270103161a5ce054e900cd845d8b23ef47e4e2426620b02dc7657d4"
    }
```

```diff
    contract Bridge (0x8315177aB297bA92A06054cE80a67Ed4DBd7ed3a) {
    +++ description: None
      values.$pastUpgrades.1.2:
+        ["0x1066CEcC8880948FE55e427E94F1FF221d626591"]
      values.$pastUpgrades.1.1:
-        ["0x1066CEcC8880948FE55e427E94F1FF221d626591"]
+        "0x07bbd6efdc155699ab2807c0d1509e98e06aa58ce25f208f09c03899f3a128cd"
      values.$pastUpgrades.0.2:
+        ["0xfCEa474C6bD5Dd4eDF5f37EE6Bea5567F0B52A08"]
      values.$pastUpgrades.0.1:
-        ["0xfCEa474C6bD5Dd4eDF5f37EE6Bea5567F0B52A08"]
+        "0x248787fbf0415ff1da68ba618da0cbdd5dcc7c6029be38709f95ea837211edc5"
    }
```

```diff
    contract ValidatorWallet (0x83215480dB2C6A7E56f9E99EF93AB9B36F8A3DD5) {
    +++ description: None
      values.$pastUpgrades.0.2:
+        ["0x5Bc5FB83950bBbF156E433c5c098bFe533Db4021"]
      values.$pastUpgrades.0.1:
-        ["0x5Bc5FB83950bBbF156E433c5c098bFe533Db4021"]
+        "0x58433a1b7892a406490cf6d915b8ebebf3dc5fce3fde509f05b17ccabc14a5b0"
    }
```

```diff
    contract L1ERC20Gateway (0xa3A7B6F88361F48403514059F1F16C8E78d60EeC) {
    +++ description: None
      values.$pastUpgrades.6.2:
+        ["0xb4299A1F5f26fF6a98B7BA35572290C359fde900"]
      values.$pastUpgrades.6.1:
-        ["0xb4299A1F5f26fF6a98B7BA35572290C359fde900"]
+        "0xf2ba2551709d23686f52c3a3ecc65ae8347f1bab1877265c57ba260e8222bf33"
      values.$pastUpgrades.5.2:
+        ["0xa83520Ae8d05bDBd20770c3d7268F66AcAcb6d43"]
      values.$pastUpgrades.5.1:
-        ["0xa83520Ae8d05bDBd20770c3d7268F66AcAcb6d43"]
+        "0xec47d4c470dffaa2f23005fb51acbd27a42f04067edf9dffb45d456da947e321"
      values.$pastUpgrades.4.2:
+        ["0xd710c475216999184DB1737aAd197fC855255AD7"]
      values.$pastUpgrades.4.1:
-        ["0xd710c475216999184DB1737aAd197fC855255AD7"]
+        "0x14a48840cec5b16e7e909ddbe69eec7edaeafde958c866a97a048b2daf9f9c1f"
      values.$pastUpgrades.3.2:
+        ["0x0aCb04878B3675EF40b2e9392622CE3C1E9CC99E"]
      values.$pastUpgrades.3.1:
-        ["0x0aCb04878B3675EF40b2e9392622CE3C1E9CC99E"]
+        "0xbe4a3a9dd5b909eb699c07aec0a5d190a8433b3c65544b85521cab827f80d481"
      values.$pastUpgrades.2.2:
+        ["0xE317c204Fa7C3150af24aa20264b983fc82b7BBd"]
      values.$pastUpgrades.2.1:
-        ["0xE317c204Fa7C3150af24aa20264b983fc82b7BBd"]
+        "0xc93128ad2d69bac5c0c5ebe77abe4ead2cdb0ece637ff8db193e7c894933d8f7"
      values.$pastUpgrades.1.2:
+        ["0x41AC92014C66C38bBBDEF8cCF5A060CCa5634fd5"]
      values.$pastUpgrades.1.1:
-        ["0x41AC92014C66C38bBBDEF8cCF5A060CCa5634fd5"]
+        "0xa3c53b23f347613b517160eb732174e54f3b28d8e63646d14b8e39394c449ae2"
      values.$pastUpgrades.0.2:
+        ["0x553524e576a0E92beC7CC24843C04bF51493A5db"]
      values.$pastUpgrades.0.1:
-        ["0x553524e576a0E92beC7CC24843C04bF51493A5db"]
+        "0x289c1529f29f00f7b67f99074061d971a2d33ffc15a6fe5d7fa8ed533a6d8698"
    }
```

```diff
    contract ValidatorWallet (0xB0CB1384e3f4a9a9b2447e39b05e10631E1D34B0) {
    +++ description: None
      values.$pastUpgrades.0.2:
+        ["0x5Bc5FB83950bBbF156E433c5c098bFe533Db4021"]
      values.$pastUpgrades.0.1:
-        ["0x5Bc5FB83950bBbF156E433c5c098bFe533Db4021"]
+        "0xf3f38237dd68d6215694c388c57d1efe16556dadd723d24fef7ee6f47d204eff"
    }
```

```diff
    contract L1CustomGateway (0xcEe284F754E854890e311e3280b767F80797180d) {
    +++ description: None
      values.$pastUpgrades.7.2:
+        ["0xC8D26aB9e132C79140b3376a0Ac7932E4680Aa45"]
      values.$pastUpgrades.7.1:
-        ["0xC8D26aB9e132C79140b3376a0Ac7932E4680Aa45"]
+        "0xf2ba2551709d23686f52c3a3ecc65ae8347f1bab1877265c57ba260e8222bf33"
      values.$pastUpgrades.6.2:
+        ["0xe8B0e562269EF963AA7b4c92645ff06E72CA02E6"]
      values.$pastUpgrades.6.1:
-        ["0xe8B0e562269EF963AA7b4c92645ff06E72CA02E6"]
+        "0xec47d4c470dffaa2f23005fb51acbd27a42f04067edf9dffb45d456da947e321"
      values.$pastUpgrades.5.2:
+        ["0x73bd0a2476b40A6aE04497D36efc85affeD3516b"]
      values.$pastUpgrades.5.1:
-        ["0x73bd0a2476b40A6aE04497D36efc85affeD3516b"]
+        "0x14a48840cec5b16e7e909ddbe69eec7edaeafde958c866a97a048b2daf9f9c1f"
      values.$pastUpgrades.4.2:
+        ["0x98659BDffa4fEF82cD37771CDBFF3ddDa21EE8e9"]
      values.$pastUpgrades.4.1:
-        ["0x98659BDffa4fEF82cD37771CDBFF3ddDa21EE8e9"]
+        "0x4134f1974f5b4c4f95cb2e8a9f7ce56a055a672911c09a7918497f8f14f117da"
      values.$pastUpgrades.3.2:
+        ["0x79f01C581bfd44aF8B0721029Bf594B30592675F"]
      values.$pastUpgrades.3.1:
-        ["0x79f01C581bfd44aF8B0721029Bf594B30592675F"]
+        "0xf79ceb2e28ffd89853dc992cfba0ce69ab77c711b31b251608112bf703cf7a98"
      values.$pastUpgrades.2.2:
+        ["0xc5199b28d5267F80A7FA7a3313357D50Cf4Dba6C"]
      values.$pastUpgrades.2.1:
-        ["0xc5199b28d5267F80A7FA7a3313357D50Cf4Dba6C"]
+        "0xff67b0e76d27e79cc9e251a34c1511df39bb5769c4e30956d945f8bafc08f40c"
      values.$pastUpgrades.1.2:
+        ["0x304c13E8d2353f57076f2f8B8Dd4e29e347841EB"]
      values.$pastUpgrades.1.1:
-        ["0x304c13E8d2353f57076f2f8B8Dd4e29e347841EB"]
+        "0x92f6e1e0af1cfede9c7253d4fe72400ea1215985686cb0a25da2a1d7c8d614b0"
      values.$pastUpgrades.0.2:
+        ["0x20c9d24EDcF5CC943BE6eC55CbE786AbF05354c0"]
      values.$pastUpgrades.0.1:
-        ["0x20c9d24EDcF5CC943BE6eC55CbE786AbF05354c0"]
+        "0xd0f181f40b470dbd3d2c44474725ea0babcc54c6a035b33e090229e133b40456"
    }
```

```diff
    contract ChallengeManager (0xe5896783a2F463446E1f624e64Aa6836BE4C6f58) {
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
+        ["0x1c78B622961f27Ccc2f9BA65E2ba5d5eB301a445"]
      values.$pastUpgrades.0.1:
-        ["0x1c78B622961f27Ccc2f9BA65E2ba5d5eB301a445"]
+        "0x248787fbf0415ff1da68ba618da0cbdd5dcc7c6029be38709f95ea837211edc5"
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
    contract ValidatorWallet (0xf59caf75e8A4bFBA4e6e07aD86C7E498E4d2519b) {
    +++ description: None
      values.$pastUpgrades.0.2:
+        ["0x5Bc5FB83950bBbF156E433c5c098bFe533Db4021"]
      values.$pastUpgrades.0.1:
-        ["0x5Bc5FB83950bBbF156E433c5c098bFe533Db4021"]
+        "0x477d0790d2e696b3a1687157de68d59bd0fdaa633dda3772226470dbdfe9af8d"
    }
```

Generated with discovered.json: 0x31e4cdbe0725daf1a4ec519d5ce51028c9bacfe0

# Diff at Fri, 18 Oct 2024 10:54:12 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@0295165a89d86b7450439f24f100d1baa74381fc block: 20826339
- current block number: 20826339

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20826339 (main branch discovery), not current.

```diff
    contract UpgradeExecutor (0x3ffFbAdAF827559da092217e474760E2b2c3CeDd) {
    +++ description: None
      directlyReceivedPermissions.1:
+        {"permission":"act","target":"0xF06E95eF589D9c38af242a8AAee8375f14023F85"}
    }
```

Generated with discovered.json: 0xcd0d99f1bb19f0703585101c12f42bcf5b0a8424

# Diff at Wed, 16 Oct 2024 11:34:53 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@a3d139b799cc0b28e5e912febb17464d4e5aef5d block: 20826339
- current block number: 20826339

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20826339 (main branch discovery), not current.

```diff
    contract SequencerInbox (0x1c479675ad559DC151F6Ec7ed3FbF8ceE79582B6) {
    +++ description: None
      issuedPermissions.2:
+        {"permission":"upgrade","target":"0x554723262467F125Ac9e1cDFa9Ce15cc53822dbD","via":[]}
      issuedPermissions.1:
+        {"permission":"sequence","target":"0xC1b634853Cb333D3aD8663715b08f41A3Aec47cc","via":[]}
      issuedPermissions.0.permission:
-        "upgrade"
+        "sequence"
      issuedPermissions.0.target:
-        "0x554723262467F125Ac9e1cDFa9Ce15cc53822dbD"
+        "0x0C5911d57B24FCF1DC8B2608eFbAe57C7098E32D"
    }
```

```diff
    contract ValidatorWallet (0x56D83349c2B8DCF74d7E92D5b6B33d0BADD52D78) {
    +++ description: None
      roles:
-        ["Validator"]
      receivedPermissions:
+        [{"permission":"validate","target":"0x5eF0D09d1E6204141B4d37530808eD19f60FBa35"}]
    }
```

```diff
    contract RollupProxy (0x5eF0D09d1E6204141B4d37530808eD19f60FBa35) {
    +++ description: Manages rollup components, list of Stakers and Validators. Entry point for Validators creating new Rollup Nodes (state commits) and Challengers submitting fraud proofs.
      issuedPermissions.14:
+        {"permission":"validate","target":"0xF8D3E1cF58386c92B27710C6a0D8A54c76BC6ab5","via":[]}
      issuedPermissions.13:
+        {"permission":"validate","target":"0xf59caf75e8A4bFBA4e6e07aD86C7E498E4d2519b","via":[]}
      issuedPermissions.12:
+        {"permission":"validate","target":"0xdDf2F71Ab206C0138A8eceEb54386567D5abF01E","via":[]}
      issuedPermissions.11:
+        {"permission":"validate","target":"0xB51EDdfc9A945e2B909905e4F242C4796Ac0C61d","via":[]}
      issuedPermissions.10:
+        {"permission":"validate","target":"0xB0CB1384e3f4a9a9b2447e39b05e10631E1D34B0","via":[]}
      issuedPermissions.9:
+        {"permission":"validate","target":"0xAB1A39332e934300eBCc57B5f95cA90631a347FF","via":[]}
      issuedPermissions.8:
+        {"permission":"validate","target":"0x83215480dB2C6A7E56f9E99EF93AB9B36F8A3DD5","via":[]}
      issuedPermissions.7:
+        {"permission":"validate","target":"0x7CF3d537733F6Ba4183A833c9B021265716cE9d0","via":[]}
      issuedPermissions.6:
+        {"permission":"validate","target":"0x758C6bB08B3ea5889B5cddbdeF9A45b3a983c398","via":[]}
      issuedPermissions.5:
+        {"permission":"validate","target":"0x6Fb914de4653eC5592B7c15F4d9466Cbd03F2104","via":[]}
      issuedPermissions.4:
+        {"permission":"validate","target":"0x610Aa279989F440820e14248BD3879B148717974","via":[]}
      issuedPermissions.3:
+        {"permission":"validate","target":"0x56D83349c2B8DCF74d7E92D5b6B33d0BADD52D78","via":[]}
      issuedPermissions.2:
+        {"permission":"validate","target":"0x54c0D3d6C101580dB3be8763A2aE2c6bb9dc840c","via":[]}
      issuedPermissions.1:
+        {"permission":"validate","target":"0x0fF813f6BD577c3D1cDbE435baC0621BE6aE34B4","via":[]}
    }
```

```diff
    contract Validator (0x758C6bB08B3ea5889B5cddbdeF9A45b3a983c398) {
    +++ description: None
      roles:
-        ["Validator"]
      receivedPermissions:
+        [{"permission":"validate","target":"0x5eF0D09d1E6204141B4d37530808eD19f60FBa35"}]
    }
```

```diff
    contract ValidatorWallet (0x7CF3d537733F6Ba4183A833c9B021265716cE9d0) {
    +++ description: None
      roles:
-        ["Validator"]
      receivedPermissions:
+        [{"permission":"validate","target":"0x5eF0D09d1E6204141B4d37530808eD19f60FBa35"}]
    }
```

```diff
    contract ValidatorWallet (0x83215480dB2C6A7E56f9E99EF93AB9B36F8A3DD5) {
    +++ description: None
      roles:
-        ["Validator"]
      receivedPermissions:
+        [{"permission":"validate","target":"0x5eF0D09d1E6204141B4d37530808eD19f60FBa35"}]
    }
```

```diff
    contract ValidatorWallet (0xB0CB1384e3f4a9a9b2447e39b05e10631E1D34B0) {
    +++ description: None
      roles:
-        ["Validator"]
      receivedPermissions:
+        [{"permission":"validate","target":"0x5eF0D09d1E6204141B4d37530808eD19f60FBa35"}]
    }
```

```diff
    contract ValidatorWallet (0xf59caf75e8A4bFBA4e6e07aD86C7E498E4d2519b) {
    +++ description: None
      roles:
-        ["Validator"]
      receivedPermissions:
+        [{"permission":"validate","target":"0x5eF0D09d1E6204141B4d37530808eD19f60FBa35"}]
    }
```

Generated with discovered.json: 0x43f2cc6e737c65f224882920fff4b091cded6ce3

# Diff at Mon, 14 Oct 2024 10:49:27 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@1afc77ff111ceb0970e7d09efcc7b2f376b0c281 block: 20826339
- current block number: 20826339

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20826339 (main branch discovery), not current.

```diff
    contract Outbox (0x0B9857ae2D4A3DBe74ffE1d7DF045bb7F96E4840) {
    +++ description: None
      sourceHashes:
+        ["0xa7e3f6c355703ed46fcb2156862c4f01792b87beb10a87a81ce3bd5beee79b67","0xc90d60d6db95e55c93637eee14d0d8f4034a14d5f50fc0e8561e389073c9816a"]
    }
```

```diff
    contract ProxyAdmin (0x0ea6999172c1B4563695F76A52de73c848587b17) {
    +++ description: None
      sourceHashes:
+        ["0xf944f88083f41ff959fefbdcd6fc3ae633692b072b8497fb14cbdd843eded490"]
    }
```

```diff
    contract wstETHEscrow (0x0F25c1DC2a9922304f2eac71DCa9B07E310e8E5a) {
    +++ description: None
      sourceHashes:
+        ["0x698ae88793265d087e07a445b69bf16b450cdcf636b9073b86221936e912a135","0xbd9ad3a060bba138bf31ab27d9c9a59159aeddab49620a728f0485165d7cb05d"]
    }
```

```diff
    contract UpgradeableBeacon (0x14797f5432f699Cb4d4dB04DF599B74952d78d7b) {
    +++ description: None
      sourceHashes:
+        ["0xc8db6bf1c1522e439ab4b7d52970913a9d905bb60e32473199eb4ad572932bad"]
    }
```

```diff
    contract SequencerInbox (0x1c479675ad559DC151F6Ec7ed3FbF8ceE79582B6) {
    +++ description: None
      sourceHashes:
+        ["0xa7e3f6c355703ed46fcb2156862c4f01792b87beb10a87a81ce3bd5beee79b67","0x0bb7cd360bb26d8a487130df151eb05ce4afe4fd3452fcdbdd3cfa432e17cbb5"]
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
    contract ProxyAdmin (0x3f92814930f43c6a1C6B133E5945E7B3338F33a6) {
    +++ description: None
      sourceHashes:
+        ["0xf944f88083f41ff959fefbdcd6fc3ae633692b072b8497fb14cbdd843eded490"]
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
+        {"permission":"upgrade","target":"0xE6841D92B0C345144506576eC13ECf5103aC7f49","via":[{"address":"0x5613AF0474EB9c528A34701A5b1662E3C8FA0678"}]}
      receivedPermissions.1:
+        {"permission":"upgrade","target":"0x5eF0D09d1E6204141B4d37530808eD19f60FBa35"}
      receivedPermissions.0.target:
-        "0x5eF0D09d1E6204141B4d37530808eD19f60FBa35"
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
    contract ProxyAdmin (0x4561A4cDA2CB8a61ED023785bc1817fdf685dcb3) {
    +++ description: None
      sourceHashes:
+        ["0xf944f88083f41ff959fefbdcd6fc3ae633692b072b8497fb14cbdd843eded490"]
    }
```

```diff
    contract Inbox (0x4Dbd4fc535Ac27206064B68FfCf827b0A60BAB3f) {
    +++ description: None
      sourceHashes:
+        ["0x26f6b72513d780b4c7f3855e9b8c63f3ea90b9d15ce1cf38534887619daaa18b","0x6014bf86ee4c408054ad942b00365111c902b30d650ad8ed97b0cd56ca1d1e20"]
    }
```

```diff
    contract ProxyAdmin (0x509E3CDc218d163DB9A03678107b72e00163b061) {
    +++ description: None
      sourceHashes:
+        ["0xf944f88083f41ff959fefbdcd6fc3ae633692b072b8497fb14cbdd843eded490"]
    }
```

```diff
    contract ArbitrumProxyAdmin (0x554723262467F125Ac9e1cDFa9Ce15cc53822dbD) {
    +++ description: None
      sourceHashes:
+        ["0xf944f88083f41ff959fefbdcd6fc3ae633692b072b8497fb14cbdd843eded490"]
    }
```

```diff
    contract UpgradeExecutorAdmin (0x5613AF0474EB9c528A34701A5b1662E3C8FA0678) {
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
    contract ValidatorWallet (0x56D83349c2B8DCF74d7E92D5b6B33d0BADD52D78) {
    +++ description: None
      sourceHashes:
+        ["0xa7e3f6c355703ed46fcb2156862c4f01792b87beb10a87a81ce3bd5beee79b67","0xdb71d504c2071bc4b28756ad1f12fb3faf0537767b5019cfa7912d4fc078e8a9"]
    }
```

```diff
    contract RollupEventInbox (0x57Bd336d579A51938619271a7Cc137a46D0501B1) {
    +++ description: None
      sourceHashes:
+        ["0xa7e3f6c355703ed46fcb2156862c4f01792b87beb10a87a81ce3bd5beee79b67","0xcb5aa9193bb40ce04bdf027377926cf735cd52ee9823923cb55fce302ad76513"]
    }
```

```diff
    contract ValidatorWallet (0x5Bc5FB83950bBbF156E433c5c098bFe533Db4021) {
    +++ description: None
      sourceHashes:
+        ["0xdb71d504c2071bc4b28756ad1f12fb3faf0537767b5019cfa7912d4fc078e8a9"]
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
    contract RollupProxy (0x5eF0D09d1E6204141B4d37530808eD19f60FBa35) {
    +++ description: Manages rollup components, list of Stakers and Validators. Entry point for Validators creating new Rollup Nodes (state commits) and Challengers submitting fraud proofs.
      sourceHashes:
+        ["0x076bd7e6390d8972c7245bb0643be3afbae09a7f5813e5011fb86efe9b8f01a1","0xabf06072746c465404cbb92f513666e15a5409faccce7f76f4880a9b125b8a2e","0x714cd478f69088c5274871f1be4e27736aedacf59858caeb9dbea9e47d23d213"]
    }
```

```diff
    contract OutboxV0 (0x667e23ABd27E623c11d4CC00ca3EC4d0bD63337a) {
    +++ description: None
      sourceHashes:
+        ["0x26f6b72513d780b4c7f3855e9b8c63f3ea90b9d15ce1cf38534887619daaa18b","0x20497774f6f2ef1febbb63646e0eb3b2ed5190f6a53f178032f86d972f0ca99d"]
    }
```

```diff
    contract LPTL1Escrow (0x6A23F4940BD5BA117Da261f98aae51A8BFfa210A) {
    +++ description: None
      sourceHashes:
+        ["0x4f07cd3e0e2a2e8245a865324089db39bdb6d4831707d7dcee18af0545c716c3"]
    }
```

```diff
    contract L1GatewayRouter (0x72Ce9c846789fdB6fC1f34aC4AD25Dd9ef7031ef) {
    +++ description: None
      sourceHashes:
+        ["0x26f6b72513d780b4c7f3855e9b8c63f3ea90b9d15ce1cf38534887619daaa18b","0x265fc73d2eec7f0b459f92a25a37b145c8db22527232f08f3022d5cc18d6af9d"]
    }
```

```diff
    contract Validator (0x758C6bB08B3ea5889B5cddbdeF9A45b3a983c398) {
    +++ description: None
      sourceHashes:
+        ["0x26f6b72513d780b4c7f3855e9b8c63f3ea90b9d15ce1cf38534887619daaa18b","0x9aa2eeef4b673e98d9f83d6fde3f3adec875839409b6d1788fab21323992a11a"]
    }
```

```diff
    contract OutboxV1 (0x760723CD2e632826c38Fef8CD438A4CC7E7E1A40) {
    +++ description: None
      sourceHashes:
+        ["0x26f6b72513d780b4c7f3855e9b8c63f3ea90b9d15ce1cf38534887619daaa18b","0x00ef6edf5319c5f35e60c03df0fb64df6d630fb23373f9a084d86a868812b4ed"]
    }
```

```diff
    contract ValidatorWallet (0x7CF3d537733F6Ba4183A833c9B021265716cE9d0) {
    +++ description: None
      sourceHashes:
+        ["0xa7e3f6c355703ed46fcb2156862c4f01792b87beb10a87a81ce3bd5beee79b67","0xdb71d504c2071bc4b28756ad1f12fb3faf0537767b5019cfa7912d4fc078e8a9"]
    }
```

```diff
    contract Bridge (0x8315177aB297bA92A06054cE80a67Ed4DBd7ed3a) {
    +++ description: None
      sourceHashes:
+        ["0xa7e3f6c355703ed46fcb2156862c4f01792b87beb10a87a81ce3bd5beee79b67","0x5dbde25ce90571f7dd8e189ec68615bd76cab9ddb0ba7690b721e9e03c70b6ed"]
    }
```

```diff
    contract ValidatorWallet (0x83215480dB2C6A7E56f9E99EF93AB9B36F8A3DD5) {
    +++ description: None
      sourceHashes:
+        ["0xa7e3f6c355703ed46fcb2156862c4f01792b87beb10a87a81ce3bd5beee79b67","0xdb71d504c2071bc4b28756ad1f12fb3faf0537767b5019cfa7912d4fc078e8a9"]
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
    contract ValidatorWalletCreator (0x960953f7c69cd2BC2322Db9223A815C680ccc7ea) {
    +++ description: None
      sourceHashes:
+        ["0x4ef3473c840bed3b4c6258271a494794c1545f0d0f13c6a386d1e39e6180d67c"]
    }
```

```diff
    contract GatewaysAdmin (0x9aD46fac0Cf7f790E5be05A0F15223935A0c0aDa) {
    +++ description: None
      sourceHashes:
+        ["0x579c6df39480618101e39d5b997df14c347d7f8a880df6cf0e1ae526771a0444"]
    }
```

```diff
    contract ValidatorUtils (0x9E40625F52829Cf04bC4839F186D621ee33b0E67) {
    +++ description: None
      sourceHashes:
+        ["0xd9b36ec321be937cc727b5bdb0afa0e1a0a28448ef1a202d4f181a01ce57bdc8"]
    }
```

```diff
    contract L1Escrow (0xA10c7CE4b876998858b1a9E12b10092229539400) {
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
    contract L1ERC20Gateway (0xa3A7B6F88361F48403514059F1F16C8E78d60EeC) {
    +++ description: None
      sourceHashes:
+        ["0x26f6b72513d780b4c7f3855e9b8c63f3ea90b9d15ce1cf38534887619daaa18b","0x019cdda76fc455f2628f7f7f87fae92c1264e1d2e32cd2d47e6494780c790c61"]
    }
```

```diff
    contract ProxyAdmin (0xAb33350E0319466A81D2AE6DC5CdF2518123f766) {
    +++ description: None
      sourceHashes:
+        ["0x579c6df39480618101e39d5b997df14c347d7f8a880df6cf0e1ae526771a0444"]
    }
```

```diff
    contract ValidatorWallet (0xB0CB1384e3f4a9a9b2447e39b05e10631E1D34B0) {
    +++ description: None
      sourceHashes:
+        ["0xa7e3f6c355703ed46fcb2156862c4f01792b87beb10a87a81ce3bd5beee79b67","0xdb71d504c2071bc4b28756ad1f12fb3faf0537767b5019cfa7912d4fc078e8a9"]
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
    contract OutboxEntry (0xc4940069140142236D4065b866018f7b2BeC77fD) {
    +++ description: None
      sourceHashes:
+        ["0xf27ca2839702248340daceb1e5c995144cb5ad3f636f7bc4057e20e142aeb2fe"]
    }
```

```diff
    contract ProxyAdmin (0xCcadc6B174BEcf31a35b818373e90391971a1C0c) {
    +++ description: None
      sourceHashes:
+        ["0xf944f88083f41ff959fefbdcd6fc3ae633692b072b8497fb14cbdd843eded490"]
    }
```

```diff
    contract L1CustomGateway (0xcEe284F754E854890e311e3280b767F80797180d) {
    +++ description: None
      sourceHashes:
+        ["0x26f6b72513d780b4c7f3855e9b8c63f3ea90b9d15ce1cf38534887619daaa18b","0x60484a2ada75640a2144b3ecaae3bb7b51973a2494281beebf898308ffc35e90"]
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
    contract L1DaiGateway (0xD3B5b60020504bc3489D6949d545893982BA3011) {
    +++ description: None
      sourceHashes:
+        ["0x2bfb3c9871d8a7db172d350d7b4678c49eb33a98483f71cb89d3d059a7322efb"]
    }
```

```diff
    contract Whitelist (0xD485e5c28AA4985b23f6DF13dA03caa766dcd459) {
    +++ description: None
      sourceHashes:
+        ["0x4016fd19b875c72082c2e4f25e6487143f8a6832ffa5cb3281aa08beb598d44e"]
    }
```

```diff
    contract ChallengeManager (0xe5896783a2F463446E1f624e64Aa6836BE4C6f58) {
    +++ description: None
      sourceHashes:
+        ["0xa7e3f6c355703ed46fcb2156862c4f01792b87beb10a87a81ce3bd5beee79b67","0x1a095768302d7d1c3d02375eaa3341833b4f1aaac707e1c608bce478c87cbf27"]
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
    contract ValidatorWallet (0xf59caf75e8A4bFBA4e6e07aD86C7E498E4d2519b) {
    +++ description: None
      sourceHashes:
+        ["0xa7e3f6c355703ed46fcb2156862c4f01792b87beb10a87a81ce3bd5beee79b67","0xdb71d504c2071bc4b28756ad1f12fb3faf0537767b5019cfa7912d4fc078e8a9"]
    }
```

Generated with discovered.json: 0x8b70dea02e816aaad9841ee855b9df4dff5f7335

# Diff at Tue, 01 Oct 2024 10:49:50 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@bd754dc73c66120164006054f8d25c5fae9cd910 block: 20826339
- current block number: 20826339

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20826339 (main branch discovery), not current.

```diff
    contract Outbox (0x0B9857ae2D4A3DBe74ffE1d7DF045bb7F96E4840) {
    +++ description: None
      values.$pastUpgrades:
+        [["2022-08-25T20:05:44.000Z",["0x0eA7372338a589e7f0b00E463a53AA464ef04e17"]]]
    }
```

```diff
    contract wstETHEscrow (0x0F25c1DC2a9922304f2eac71DCa9B07E310e8E5a) {
    +++ description: None
      values.$pastUpgrades:
+        [["2022-08-04T10:26:31.000Z",["0xc4E3ff0b5B106f88Fc64c43031BE8b076ee9F21C"]]]
    }
```

```diff
    contract SequencerInbox (0x1c479675ad559DC151F6Ec7ed3FbF8ceE79582B6) {
    +++ description: None
      values.$pastUpgrades:
+        [["2022-08-25T20:05:44.000Z",["0xbe04Ab2728c924D678f9FC833E379688c6eFA317"]],["2022-08-31T02:31:26.000Z",["0x16242595cAfA3a207E9354E3bdb000B59bA82875"]],["2022-09-14T03:08:00.000Z",["0xcc4e9E22AcDf93192cf7E149D7563F6d660E9Afc"]],["2022-11-08T16:47:59.000Z",["0xD03bFe2CE83632F4E618a97299cc91B1335BB2d9"]],["2024-03-14T13:41:59.000Z",["0x31DA64D19Cd31A19CD09F4070366Fe2144792cf7"]]]
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
    contract Inbox (0x4Dbd4fc535Ac27206064B68FfCf827b0A60BAB3f) {
    +++ description: None
      values.$pastUpgrades:
+        [["2021-05-29T19:37:16.000Z",["0xB38634F1192fd4A4864b99a4C9100339815c6450"]],["2021-08-28T21:50:10.000Z",["0xE5dB9273e7279F1485b30D8553183E3E29532ca3"]],["2021-08-30T01:43:28.000Z",["0x048cc108763de75E080Ad717bD284003aa49eA15"]],["2022-04-30T15:50:28.000Z",["0xc23E3F20340f8ef09c8861a724C29dB43bA3eeD4"]],["2022-08-26T16:50:55.000Z",["0xe4B8015Ea98fc86D7fDe16CdfD1B7A250cD93e2B"]],["2022-08-31T14:32:22.000Z",["0x3E2198A77FC6B266082b92859092170763548730"]],["2022-09-14T03:08:00.000Z",["0x1b2676D32E2f7430a564DD4560641F990dFE3D6a"]],["2022-11-18T17:04:23.000Z",["0x931E1770BEC7827841f3989bda43319adACD62db"]],["2022-12-15T15:58:59.000Z",["0x5aED5f8A1e3607476F1f81c3d8fe126deB0aFE94"]]]
    }
```

```diff
    contract ValidatorWallet (0x56D83349c2B8DCF74d7E92D5b6B33d0BADD52D78) {
    +++ description: None
      values.$pastUpgrades:
+        [["2022-09-05T09:07:35.000Z",["0x5Bc5FB83950bBbF156E433c5c098bFe533Db4021"]]]
    }
```

```diff
    contract RollupEventInbox (0x57Bd336d579A51938619271a7Cc137a46D0501B1) {
    +++ description: None
      values.$pastUpgrades:
+        [["2022-08-25T20:05:44.000Z",["0x806421D09cDb253aa9d128a658e60c0B95eFFA01"]]]
    }
```

```diff
    contract RollupProxy (0x5eF0D09d1E6204141B4d37530808eD19f60FBa35) {
    +++ description: Manages rollup components, list of Stakers and Validators. Entry point for Validators creating new Rollup Nodes (state commits) and Challengers submitting fraud proofs.
      values.$pastUpgrades:
+        [["2022-08-25T20:05:44.000Z",["0x75fc5465c4BaD74B367ac917f7298aD66c308Fb8","0x4C5960936f1635765e37Ff1a220D7344b27D7046"]],["2022-09-14T03:08:00.000Z",["0x72f193d0F305F532C87a4B9D0A2F407a3F4f585f","0x5E7147d34EaB8c86b19DEd94C00F82181B5580eF"]],["2022-11-08T16:47:59.000Z",["0x72f193d0F305F532C87a4B9D0A2F407a3F4f585f","0xA0Ed0562629D45B88A34a342f20dEb58c46C15ff"]]]
      values.$upgradeCount:
+        3
    }
```

```diff
    contract OutboxV0 (0x667e23ABd27E623c11d4CC00ca3EC4d0bD63337a) {
    +++ description: None
      values.$pastUpgrades:
+        [["2021-08-28T21:55:13.000Z",["0xb91f4bE773F5a1b9b0dC1085663b3535A6EBeEE2"]],["2022-08-26T16:50:55.000Z",["0x263a68002876E307804168795519da0B32CC62fE"]]]
    }
```

```diff
    contract L1GatewayRouter (0x72Ce9c846789fdB6fC1f34aC4AD25Dd9ef7031ef) {
    +++ description: None
      values.$pastUpgrades:
+        [["2021-07-01T21:07:36.000Z",["0x4b2Cf3BE8677096310b32a648b0Bdb8c5A8dDC94"]],["2021-08-26T16:05:39.000Z",["0x555d10f9E4d1b60B9c3F87F4E835119B2C65c8B0"]],["2021-08-30T17:40:11.000Z",["0x62285266B5ec3d5B8867c84B807b79B2c13892EC"]],["2021-09-17T19:52:13.000Z",["0x594393B6A6A46190dF3E479304bbC63572c6830a"]],["2021-10-14T14:36:02.000Z",["0x32f39fa08c1E0bbA551CBDa4197e543C53b3fC53"]],["2021-10-22T17:59:20.000Z",["0x2e8e3e55cE12F981EbF8E545Cb263aB238e19715"]],["2022-08-08T17:02:04.000Z",["0x6D1c576Fe3e54313990450f5Fa322306B4cCB47B"]],["2022-11-08T16:47:59.000Z",["0x52595021fA01B3E14EC6C88953AFc8E35dFf423c"]]]
    }
```

```diff
    contract Validator (0x758C6bB08B3ea5889B5cddbdeF9A45b3a983c398) {
    +++ description: None
      values.$pastUpgrades:
+        []
    }
```

```diff
    contract OutboxV1 (0x760723CD2e632826c38Fef8CD438A4CC7E7E1A40) {
    +++ description: None
      values.$pastUpgrades:
+        [["2022-08-26T16:50:55.000Z",["0x360861b7b245c968128F0a53d281aDb1Df760711"]]]
    }
```

```diff
    contract ValidatorWallet (0x7CF3d537733F6Ba4183A833c9B021265716cE9d0) {
    +++ description: None
      values.$pastUpgrades:
+        [["2022-08-31T16:44:18.000Z",["0x5Bc5FB83950bBbF156E433c5c098bFe533Db4021"]]]
    }
```

```diff
    contract Bridge (0x8315177aB297bA92A06054cE80a67Ed4DBd7ed3a) {
    +++ description: None
      values.$pastUpgrades:
+        [["2022-08-25T20:05:44.000Z",["0xfCEa474C6bD5Dd4eDF5f37EE6Bea5567F0B52A08"]],["2022-08-31T02:31:26.000Z",["0x1066CEcC8880948FE55e427E94F1FF221d626591"]]]
    }
```

```diff
    contract ValidatorWallet (0x83215480dB2C6A7E56f9E99EF93AB9B36F8A3DD5) {
    +++ description: None
      values.$pastUpgrades:
+        [["2022-08-31T16:07:39.000Z",["0x5Bc5FB83950bBbF156E433c5c098bFe533Db4021"]]]
    }
```

```diff
    contract L1ERC20Gateway (0xa3A7B6F88361F48403514059F1F16C8E78d60EeC) {
    +++ description: None
      values.$pastUpgrades:
+        [["2021-06-26T14:01:05.000Z",["0x553524e576a0E92beC7CC24843C04bF51493A5db"]],["2021-07-30T22:39:51.000Z",["0x41AC92014C66C38bBBDEF8cCF5A060CCa5634fd5"]],["2021-08-26T16:06:05.000Z",["0xE317c204Fa7C3150af24aa20264b983fc82b7BBd"]],["2021-08-30T17:41:24.000Z",["0x0aCb04878B3675EF40b2e9392622CE3C1E9CC99E"]],["2021-10-14T14:36:02.000Z",["0xd710c475216999184DB1737aAd197fC855255AD7"]],["2021-12-10T23:03:45.000Z",["0xa83520Ae8d05bDBd20770c3d7268F66AcAcb6d43"]],["2022-08-08T17:02:04.000Z",["0xb4299A1F5f26fF6a98B7BA35572290C359fde900"]]]
    }
```

```diff
    contract ValidatorWallet (0xB0CB1384e3f4a9a9b2447e39b05e10631E1D34B0) {
    +++ description: None
      values.$pastUpgrades:
+        [["2022-10-06T19:28:35.000Z",["0x5Bc5FB83950bBbF156E433c5c098bFe533Db4021"]]]
    }
```

```diff
    contract L1CustomGateway (0xcEe284F754E854890e311e3280b767F80797180d) {
    +++ description: None
      values.$pastUpgrades:
+        [["2021-06-26T14:01:15.000Z",["0x20c9d24EDcF5CC943BE6eC55CbE786AbF05354c0"]],["2021-07-01T20:58:25.000Z",["0x304c13E8d2353f57076f2f8B8Dd4e29e347841EB"]],["2021-07-30T22:39:19.000Z",["0xc5199b28d5267F80A7FA7a3313357D50Cf4Dba6C"]],["2021-08-26T16:06:31.000Z",["0x79f01C581bfd44aF8B0721029Bf594B30592675F"]],["2021-08-30T17:41:37.000Z",["0x98659BDffa4fEF82cD37771CDBFF3ddDa21EE8e9"]],["2021-10-14T14:36:02.000Z",["0x73bd0a2476b40A6aE04497D36efc85affeD3516b"]],["2021-12-10T23:03:45.000Z",["0xe8B0e562269EF963AA7b4c92645ff06E72CA02E6"]],["2022-08-08T17:02:04.000Z",["0xC8D26aB9e132C79140b3376a0Ac7932E4680Aa45"]]]
    }
```

```diff
    contract ChallengeManager (0xe5896783a2F463446E1f624e64Aa6836BE4C6f58) {
    +++ description: None
      values.$pastUpgrades:
+        [["2022-08-25T20:05:44.000Z",["0x1c78B622961f27Ccc2f9BA65E2ba5d5eB301a445"]],["2024-03-14T13:41:59.000Z",["0xE129b8Aa61dF65cBDbAE4345eE3fb40168DfD566"]],["2024-08-28T01:37:11.000Z",["0x914B7b3053B35B84A24df08D7c9ceBCaEA4E2948"]]]
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
    contract ValidatorWallet (0xf59caf75e8A4bFBA4e6e07aD86C7E498E4d2519b) {
    +++ description: None
      values.$pastUpgrades:
+        [["2022-09-28T08:06:11.000Z",["0x5Bc5FB83950bBbF156E433c5c098bFe533Db4021"]]]
    }
```

Generated with discovered.json: 0x6fb49fa9f653a03748769b71130514d6b11e57cb

# Diff at Wed, 25 Sep 2024 08:10:46 GMT:

- author: sekuba (<sekuba@users.noreply.github.com>)
- comparing to: main@e8c4fe6b10f7918ebbd761bc35018ba84053b08c block: 20669257
- current block number: 20826339

## Description

Emergency upgrade of the wasmModuleRoot to ArbOS 32 ([compare here](https://github.com/OffchainLabs/nitro/blob/master/Dockerfile)). 

Changelog below from telegram, post-mortem will follow: 
(1) a mispricing issue in Arbitrum Stylus, which could have caused a denial of service attack, (2) an issue that would allow a malicious contract to cause nodes to crash and (3) a mispricing error in which Stylus contracts were overcharged for SLOAD operations

## Watched changes

```diff
    contract RollupProxy (0x5eF0D09d1E6204141B4d37530808eD19f60FBa35) {
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
discovery. Values are for block 20669257 (main branch discovery), not current.

```diff
    contract RollupProxy (0x5eF0D09d1E6204141B4d37530808eD19f60FBa35) {
    +++ description: Manages rollup components, list of Stakers and Validators. Entry point for Validators creating new Rollup Nodes (state commits) and Challengers submitting fraud proofs.
      usedTypes.0.arg.0x184884e1eb9fefdc158f6c8ac912bb183bf3cf83f0090317e0bc4ac5860baa39:
+        "ArbOS v32 wasmModuleRoot"
    }
```

Generated with discovered.json: 0x90ed8b3337543681e2de654c139eb284e40c5948

# Diff at Sun, 01 Sep 2024 08:43:35 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@bee35b6cff7c52634ae8667cbb331e18ad4ec17a block: 20627159
- current block number: 20627159

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20627159 (main branch discovery), not current.

```diff
    contract RollupProxy (0x5eF0D09d1E6204141B4d37530808eD19f60FBa35) {
    +++ description: Manages rollup components, list of Stakers and Validators. Entry point for Validators creating new Rollup Nodes (state commits) and Challengers submitting fraud proofs.
+++ description: Root hash of the WASM module used for execution, like a fingerprint of the L2 logic. Can be associated with ArbOS versions.
      values.wasmModuleRoot:
-        "0x260f5fa5c3176a856893642e149cf128b5a8de9f828afec8d11184415dd8dc69"
+        "ArbOS v31 wasmModuleRoot"
      usedTypes:
+        [{"typeCaster":"Mapping","arg":{"0xbb9d58e9527566138b682f3a207c0976d5359837f6e330f4017434cca983ff41":"ArbOS v1-rc1 wasmModuleRoot","0x9d68e40c47e3b87a8a7e6368cc52915720a6484bb2f47ceabad7e573e3a11232":"ArbOS v2.1 wasmModuleRoot","0x53c288a0ca7100c0f2db8ab19508763a51c7fd1be125d376d940a65378acaee7":"ArbOS v3 wasmModuleRoot","0x588762be2f364be15d323df2aa60ffff60f2b14103b34823b6f7319acd1ae7a3":"ArbOS v3.1 wasmModuleRoot","0xcfba6a883c50a1b4475ab909600fa88fc9cceed9e3ff6f43dccd2d27f6bd57cf":"ArbOS v3.2 wasmModuleRoot","0xa24ccdb052d92c5847e8ea3ce722442358db4b00985a9ee737c4e601b6ed9876":"ArbOS v4 wasmModuleRoot","0x1e09e6d9e35b93f33ed22b2bc8dc10bbcf63fdde5e8a1fb8cc1bcd1a52f14bd0":"ArbOS v5 wasmModuleRoot","0x3848eff5e0356faf1fc9cafecb789584c5e7f4f8f817694d842ada96613d8bab":"ArbOS v6 wasmModuleRoot","0x53dd4b9a3d807a8cbb4d58fbfc6a0857c3846d46956848cae0a1cc7eca2bb5a8":"ArbOS v7 wasmModuleRoot","0x2b20e1490d1b06299b222f3239b0ae07e750d8f3b4dedd19f500a815c1548bbc":"ArbOS v7.1 wasmModuleRoot","0xd1842bfbe047322b3f3b3635b5fe62eb611557784d17ac1d2b1ce9c170af6544":"ArbOS v9 wasmModuleRoot","0x6b94a7fc388fd8ef3def759297828dc311761e88d8179c7ee8d3887dc554f3c3":"ArbOS v10 wasmModuleRoot","0xda4e3ad5e7feacb817c21c8d0220da7650fe9051ece68a3f0b1c5d38bbb27b21":"ArbOS v10.1 wasmModuleRoot","0x0754e09320c381566cc0449904c377a52bd34a6b9404432e80afd573b67f7b17":"ArbOS v10.2 wasmModuleRoot","0xf559b6d4fa869472dabce70fe1c15221bdda837533dfd891916836975b434dec":"ArbOS v10.3 wasmModuleRoot","0xf4389b835497a910d7ba3ebfb77aa93da985634f3c052de1290360635be40c4a":"ArbOS v11 wasmModuleRoot","0x68e4fe5023f792d4ef584796c84d710303a5e12ea02d6e37e2b5e9c4332507c4":"ArbOS v11.1 wasmModuleRoot","0x8b104a2e80ac6165dc58b9048de12f301d70b02a0ab51396c22b4b4b802a16a4":"ArbOS v20 wasmModuleRoot","0xb0de9cb89e4d944ae6023a3b62276e54804c242fd8c4c2d8e6cc4450f5fa8b1b":"ArbOS v30 wasmModuleRoot","0x260f5fa5c3176a856893642e149cf128b5a8de9f828afec8d11184415dd8dc69":"ArbOS v31 wasmModuleRoot"}}]
    }
```

Generated with discovered.json: 0xa94285061eb9d5c6c658c1f3cb710aa2e61af99b

# Diff at Fri, 30 Aug 2024 07:51:22 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@6c1bd1f41fadf5f2cb1c1805b5a2c6138a3ed35a block: 20627159
- current block number: 20627159

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20627159 (main branch discovery), not current.

```diff
    contract ProxyAdmin (0x0ea6999172c1B4563695F76A52de73c848587b17) {
    +++ description: None
      receivedPermissions.0.via:
-        []
    }
```

```diff
    contract ProxyAdmin (0x3f92814930f43c6a1C6B133E5945E7B3338F33a6) {
    +++ description: None
      receivedPermissions.0.via:
-        []
    }
```

```diff
    contract UpgradeExecutor (0x3ffFbAdAF827559da092217e474760E2b2c3CeDd) {
    +++ description: None
      receivedPermissions.0.via:
-        []
    }
```

```diff
    contract ProxyAdmin (0x4561A4cDA2CB8a61ED023785bc1817fdf685dcb3) {
    +++ description: None
      receivedPermissions.0.via:
-        []
    }
```

```diff
    contract ProxyAdmin (0x509E3CDc218d163DB9A03678107b72e00163b061) {
    +++ description: None
      receivedPermissions.0.via:
-        []
    }
```

```diff
    contract ArbitrumProxyAdmin (0x554723262467F125Ac9e1cDFa9Ce15cc53822dbD) {
    +++ description: None
      receivedPermissions.7.via:
-        []
      receivedPermissions.6.via:
-        []
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
    contract UpgradeExecutorAdmin (0x5613AF0474EB9c528A34701A5b1662E3C8FA0678) {
    +++ description: None
      receivedPermissions.1.via:
-        []
      receivedPermissions.0.via:
-        []
    }
```

```diff
    contract GatewaysAdmin (0x9aD46fac0Cf7f790E5be05A0F15223935A0c0aDa) {
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
    contract ProxyAdmin (0xAb33350E0319466A81D2AE6DC5CdF2518123f766) {
    +++ description: None
      receivedPermissions.0.via:
-        []
    }
```

```diff
    contract ProxyAdmin (0xCcadc6B174BEcf31a35b818373e90391971a1C0c) {
    +++ description: None
      receivedPermissions.0.via:
-        []
    }
```

Generated with discovered.json: 0x51c5044d558c3ee3a826ba7879e12f568c285426

# Diff at Wed, 28 Aug 2024 12:44:07 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@0fa673a678e6e769a295956285789968836b97a6 block: 20612763
- current block number: 20627159

## Description

Scheduled transactions related to ArbOS 31 "Bianca" are executed. The release notes [in the docs](https://docs.arbitrum.io/run-arbitrum-node/arbos-releases/arbos31) and [on Github](https://github.com/OffchainLabs/nitro/releases/tag/v3.1.1) give a good overview over the changes: Stylus, Passkeys, Fast Withdrawals for AnyTrust chains.

The default wasmModuleRoot is upgraded to ArbOS 31.

### ChallengeManager.sol

- new mapping `ospCond` (conditional OSP, and `function getOsp()`) is introduced to keep compatibility with non-stylus OneStepProvers (OSPs). They are mapped by their old `wasmModuleRoot`'s.
- library changes (MultiStackLib added -> chatGPT: 'for managing multiple stacks (execution threads) within the Machine struct, representing the state of the virtual machine being challenged')

### OSP contracts

The state is now handled in 'multiStacks' (see above)

## Watched changes

```diff
-   Status: DELETED
    contract OneStepProverMath (0x221CCc45985Fdd24e33c3f19c6b7D48C02d5DCAa)
    +++ description: None
```

```diff
    contract RollupProxy (0x5eF0D09d1E6204141B4d37530808eD19f60FBa35) {
    +++ description: Manages rollup components, list of Stakers and Validators. Entry point for Validators creating new Rollup Nodes (state commits) and Challengers submitting fraud proofs.
+++ description: Root hash of the WASM module used for execution, like a fingerprint of the L2 logic. Can be associated with ArbOS versions.
      values.wasmModuleRoot:
-        "0x8b104a2e80ac6165dc58b9048de12f301d70b02a0ab51396c22b4b4b802a16a4"
+        "0x260f5fa5c3176a856893642e149cf128b5a8de9f828afec8d11184415dd8dc69"
    }
```

```diff
-   Status: DELETED
    contract OneStepProver0 (0xA174e12Ff8C6b18B37fecA77d6d350D89379A58C)
    +++ description: None
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
    contract ChallengeManager (0xe5896783a2F463446E1f624e64Aa6836BE4C6f58) {
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
 .../{.flat@20612763 => .flat}/OneStepProver0.sol   | 765 +++++++++++++-----
 .../OneStepProverHostIo.sol                        | 892 +++++++++++++++++----
 .../OneStepProverMath.sol                          |  65 +-
 .../OneStepProverMemory.sol                        | 315 ++++++--
 6 files changed, 2246 insertions(+), 680 deletions(-)
```

Generated with discovered.json: 0x3b304b23e7435bcf5162820eb3069225ddd76649

# Diff at Mon, 26 Aug 2024 12:28:20 GMT:

- author: Radina Talanova (<nt.radina@gmail.com>)
- comparing to: main@646701d3f781bf7f15a5e70ee7d3eef4aa810061 block: 20406543
- current block number: 20612763

## Description

Scheduled calls related to enabling ArbOS 31 "Bianca" on Arbitrum One and Nova: https://forum.arbitrum.foundation/t/aip-arbos-31-proposal-review/26000
There is a 3-day delay, should be executed on Wednesday. https://www.tally.xyz/gov/arbitrum/proposal/108288822474129076868455956066667369439381709547570289793612729242368710728616

## Watched changes

```diff
    contract L1Timelock (0xE6841D92B0C345144506576eC13ECf5103aC7f49) {
    +++ description: None
      values.scheduledTransactions.44:
+        {"id":"0x904f7d2e59a51e8c374447b71d8ae5eceb5ca7e77334ddecc8e965934735ffda","decoded":{"chain":"nova","address":"0x849E360a247132F961c9CBE95Ba39106c72e1268","calldata":"0xb147f40c","executor":"0x86a02dD71363c440b21F4c0E5B2Ad01Ffe1A7482","inboxOnEthereum":"0xc4448b71118c9071Bcb9734A0EAc55D18A153949"},"raw":{"target":"0xa723C008e76E379c55599D2E4d93879BeaFDa79C","value":0,"data":"0x000000000000000000000000c4448b71118c9071bcb9734a0eac55d18a15394900000000000000000000000086a02dd71363c440b21f4c0e5b2ad01ffe1a748200000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000c000000000000000000000000000000000000000000000000000000000000000841cff79cd000000000000000000000000849e360a247132f961c9cbe95ba39106c72e126800000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000004b147f40c0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000","delay":259200}}
      values.scheduledTransactions.43:
+        {"id":"0x904f7d2e59a51e8c374447b71d8ae5eceb5ca7e77334ddecc8e965934735ffda","decoded":{"chain":"nova","address":"0x61703Bf337341f2e09d96Dd6488c2907718A8E26","calldata":"0xb147f40c","executor":"0x86a02dD71363c440b21F4c0E5B2Ad01Ffe1A7482","inboxOnEthereum":"0xc4448b71118c9071Bcb9734A0EAc55D18A153949"},"raw":{"target":"0xa723C008e76E379c55599D2E4d93879BeaFDa79C","value":0,"data":"0x000000000000000000000000c4448b71118c9071bcb9734a0eac55d18a15394900000000000000000000000086a02dd71363c440b21f4c0e5b2ad01ffe1a748200000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000c000000000000000000000000000000000000000000000000000000000000000841cff79cd00000000000000000000000061703bf337341f2e09d96dd6488c2907718a8e2600000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000004b147f40c0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000","delay":259200}}
      values.scheduledTransactions.42:
+        {"id":"0x904f7d2e59a51e8c374447b71d8ae5eceb5ca7e77334ddecc8e965934735ffda","decoded":{"chain":"nova","address":"0x6dD43360d2a69BB9FfFC5349F2511f2A3bCbC2da","calldata":"0xb147f40c","executor":"0x86a02dD71363c440b21F4c0E5B2Ad01Ffe1A7482","inboxOnEthereum":"0xc4448b71118c9071Bcb9734A0EAc55D18A153949"},"raw":{"target":"0xa723C008e76E379c55599D2E4d93879BeaFDa79C","value":0,"data":"0x000000000000000000000000c4448b71118c9071bcb9734a0eac55d18a15394900000000000000000000000086a02dd71363c440b21f4c0e5b2ad01ffe1a748200000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000c000000000000000000000000000000000000000000000000000000000000000841cff79cd0000000000000000000000006dd43360d2a69bb9fffc5349f2511f2a3bcbc2da00000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000004b147f40c0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000","delay":259200}}
      values.scheduledTransactions.41:
+        {"id":"0x904f7d2e59a51e8c374447b71d8ae5eceb5ca7e77334ddecc8e965934735ffda","decoded":{"chain":"arbitrum","contractName":"ArbOneAIPArbOS31AddWasmCacheManagerAction","function":"perform","inputs":[],"address":"0xb040b105A4a0C7a9CC290164AcCBC32855368322","calldata":"0xb147f40c","executor":"0xCF57572261c7c2BCF21ffD220ea7d1a27D40A827","inboxOnEthereum":"0x4Dbd4fc535Ac27206064B68FfCf827b0A60BAB3f"},"raw":{"target":"0xa723C008e76E379c55599D2E4d93879BeaFDa79C","value":0,"data":"0x0000000000000000000000004dbd4fc535ac27206064b68ffcf827b0a60bab3f000000000000000000000000cf57572261c7c2bcf21ffd220ea7d1a27d40a82700000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000c000000000000000000000000000000000000000000000000000000000000000841cff79cd000000000000000000000000b040b105a4a0c7a9cc290164accbc3285536832200000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000004b147f40c0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000","delay":259200}}
      values.scheduledTransactions.40:
+        {"id":"0x904f7d2e59a51e8c374447b71d8ae5eceb5ca7e77334ddecc8e965934735ffda","decoded":{"chain":"arbitrum","contractName":"SetArbOS31VersionAction","function":"perform","inputs":[],"address":"0xaF81C82Ec98f86D0017d78cD66F1026f1A5Cf1Db","calldata":"0xb147f40c","executor":"0xCF57572261c7c2BCF21ffD220ea7d1a27D40A827","inboxOnEthereum":"0x4Dbd4fc535Ac27206064B68FfCf827b0A60BAB3f"},"raw":{"target":"0xa723C008e76E379c55599D2E4d93879BeaFDa79C","value":0,"data":"0x0000000000000000000000004dbd4fc535ac27206064b68ffcf827b0a60bab3f000000000000000000000000cf57572261c7c2bcf21ffd220ea7d1a27d40a82700000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000c000000000000000000000000000000000000000000000000000000000000000841cff79cd000000000000000000000000af81c82ec98f86d0017d78cd66f1026f1a5cf1db00000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000004b147f40c0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000","delay":259200}}
      values.scheduledTransactions.39:
+        {"id":"0x904f7d2e59a51e8c374447b71d8ae5eceb5ca7e77334ddecc8e965934735ffda","decoded":{"chain":"ethereum","contractName":"NovaAIPArbOS31UpgradeChallengeManagerAction","function":"perform","inputs":[],"address":"0x658AFc9d5Ec4476Fa6bb7033eA465F9901FBfF27","calldata":"0xb147f40c","executor":"0x3ffFbAdAF827559da092217e474760E2b2c3CeDd"},"raw":{"target":"0x3ffFbAdAF827559da092217e474760E2b2c3CeDd","value":0,"data":"0x1cff79cd000000000000000000000000658afc9d5ec4476fa6bb7033ea465f9901fbff2700000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000004b147f40c00000000000000000000000000000000000000000000000000000000","delay":259200}}
      values.scheduledTransactions.38:
+        {"id":"0x904f7d2e59a51e8c374447b71d8ae5eceb5ca7e77334ddecc8e965934735ffda","decoded":{"chain":"ethereum","contractName":"ArbOneAIPArbOS31UpgradeChallengeManagerAction","function":"perform","inputs":[],"address":"0x19b715cF310C28C9020e53AAA11Ce9dF42E718b5","calldata":"0xb147f40c","executor":"0x3ffFbAdAF827559da092217e474760E2b2c3CeDd"},"raw":{"target":"0x3ffFbAdAF827559da092217e474760E2b2c3CeDd","value":0,"data":"0x1cff79cd00000000000000000000000019b715cf310c28c9020e53aaa11ce9df42e718b500000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000004b147f40c00000000000000000000000000000000000000000000000000000000","delay":259200}}
    }
```

Generated with discovered.json: 0x10bd87743822e8c178d0d360e7776eae2becd68a

# Diff at Fri, 23 Aug 2024 09:51:13 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@67597c7d6c810bc726594446890178150240711e block: 20406543
- current block number: 20406543

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20406543 (main branch discovery), not current.

```diff
    contract Outbox (0x0B9857ae2D4A3DBe74ffE1d7DF045bb7F96E4840) {
    +++ description: None
      values.$upgradeCount:
+        1
    }
```

```diff
    contract wstETHEscrow (0x0F25c1DC2a9922304f2eac71DCa9B07E310e8E5a) {
    +++ description: None
      values.$upgradeCount:
+        1
    }
```

```diff
    contract SequencerInbox (0x1c479675ad559DC151F6Ec7ed3FbF8ceE79582B6) {
    +++ description: None
      values.$upgradeCount:
+        5
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
    contract Inbox (0x4Dbd4fc535Ac27206064B68FfCf827b0A60BAB3f) {
    +++ description: None
      values.$upgradeCount:
+        9
    }
```

```diff
    contract ValidatorWallet (0x56D83349c2B8DCF74d7E92D5b6B33d0BADD52D78) {
    +++ description: None
      values.$upgradeCount:
+        1
    }
```

```diff
    contract RollupEventInbox (0x57Bd336d579A51938619271a7Cc137a46D0501B1) {
    +++ description: None
      values.$upgradeCount:
+        1
    }
```

```diff
    contract OutboxV0 (0x667e23ABd27E623c11d4CC00ca3EC4d0bD63337a) {
    +++ description: None
      values.$upgradeCount:
+        2
    }
```

```diff
    contract L1GatewayRouter (0x72Ce9c846789fdB6fC1f34aC4AD25Dd9ef7031ef) {
    +++ description: None
      values.$upgradeCount:
+        8
    }
```

```diff
    contract Validator (0x758C6bB08B3ea5889B5cddbdeF9A45b3a983c398) {
    +++ description: None
      values.$upgradeCount:
+        0
    }
```

```diff
    contract OutboxV1 (0x760723CD2e632826c38Fef8CD438A4CC7E7E1A40) {
    +++ description: None
      values.$upgradeCount:
+        1
    }
```

```diff
    contract ValidatorWallet (0x7CF3d537733F6Ba4183A833c9B021265716cE9d0) {
    +++ description: None
      values.$upgradeCount:
+        1
    }
```

```diff
    contract Bridge (0x8315177aB297bA92A06054cE80a67Ed4DBd7ed3a) {
    +++ description: None
      values.$upgradeCount:
+        2
    }
```

```diff
    contract ValidatorWallet (0x83215480dB2C6A7E56f9E99EF93AB9B36F8A3DD5) {
    +++ description: None
      values.$upgradeCount:
+        1
    }
```

```diff
    contract L1ERC20Gateway (0xa3A7B6F88361F48403514059F1F16C8E78d60EeC) {
    +++ description: None
      values.$upgradeCount:
+        7
    }
```

```diff
    contract ValidatorWallet (0xB0CB1384e3f4a9a9b2447e39b05e10631E1D34B0) {
    +++ description: None
      values.$upgradeCount:
+        1
    }
```

```diff
    contract L1CustomGateway (0xcEe284F754E854890e311e3280b767F80797180d) {
    +++ description: None
      values.$upgradeCount:
+        8
    }
```

```diff
    contract ChallengeManager (0xe5896783a2F463446E1f624e64Aa6836BE4C6f58) {
    +++ description: None
      values.$upgradeCount:
+        2
    }
```

```diff
    contract L1Timelock (0xE6841D92B0C345144506576eC13ECf5103aC7f49) {
    +++ description: None
      values.$upgradeCount:
+        2
    }
```

```diff
    contract ValidatorWallet (0xf59caf75e8A4bFBA4e6e07aD86C7E498E4d2519b) {
    +++ description: None
      values.$upgradeCount:
+        1
    }
```

Generated with discovered.json: 0x20627f6b49f2524159ad26e42eecce278f36c3d4

# Diff at Wed, 21 Aug 2024 10:01:58 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@2f6dde3357bf5d79196b6e94f79d853a6c4ec72b block: 20406543
- current block number: 20406543

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20406543 (main branch discovery), not current.

```diff
    contract Outbox (0x0B9857ae2D4A3DBe74ffE1d7DF045bb7F96E4840) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x554723262467F125Ac9e1cDFa9Ce15cc53822dbD","via":[]}]
    }
```

```diff
    contract ProxyAdmin (0x0ea6999172c1B4563695F76A52de73c848587b17) {
    +++ description: None
      assignedPermissions:
-        {"upgrade":["0x83215480dB2C6A7E56f9E99EF93AB9B36F8A3DD5"]}
      receivedPermissions:
+        [{"permission":"upgrade","target":"0x83215480dB2C6A7E56f9E99EF93AB9B36F8A3DD5","via":[]}]
    }
```

```diff
    contract SequencerInbox (0x1c479675ad559DC151F6Ec7ed3FbF8ceE79582B6) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x554723262467F125Ac9e1cDFa9Ce15cc53822dbD","via":[]}]
    }
```

```diff
    contract ProxyAdmin (0x3f92814930f43c6a1C6B133E5945E7B3338F33a6) {
    +++ description: None
      assignedPermissions:
-        {"upgrade":["0x7CF3d537733F6Ba4183A833c9B021265716cE9d0"]}
      receivedPermissions:
+        [{"permission":"upgrade","target":"0x7CF3d537733F6Ba4183A833c9B021265716cE9d0","via":[]}]
    }
```

```diff
    contract UpgradeExecutor (0x3ffFbAdAF827559da092217e474760E2b2c3CeDd) {
    +++ description: None
      assignedPermissions:
-        {"upgrade":["0x5eF0D09d1E6204141B4d37530808eD19f60FBa35"]}
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x5613AF0474EB9c528A34701A5b1662E3C8FA0678","via":[]}]
      receivedPermissions:
+        [{"permission":"upgrade","target":"0x5eF0D09d1E6204141B4d37530808eD19f60FBa35","via":[]}]
    }
```

```diff
    contract ProxyAdmin (0x4561A4cDA2CB8a61ED023785bc1817fdf685dcb3) {
    +++ description: None
      assignedPermissions:
-        {"upgrade":["0x56D83349c2B8DCF74d7E92D5b6B33d0BADD52D78"]}
      receivedPermissions:
+        [{"permission":"upgrade","target":"0x56D83349c2B8DCF74d7E92D5b6B33d0BADD52D78","via":[]}]
    }
```

```diff
    contract Inbox (0x4Dbd4fc535Ac27206064B68FfCf827b0A60BAB3f) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x554723262467F125Ac9e1cDFa9Ce15cc53822dbD","via":[]}]
    }
```

```diff
    contract ProxyAdmin (0x509E3CDc218d163DB9A03678107b72e00163b061) {
    +++ description: None
      assignedPermissions:
-        {"upgrade":["0xB0CB1384e3f4a9a9b2447e39b05e10631E1D34B0"]}
      receivedPermissions:
+        [{"permission":"upgrade","target":"0xB0CB1384e3f4a9a9b2447e39b05e10631E1D34B0","via":[]}]
    }
```

```diff
    contract ArbitrumProxyAdmin (0x554723262467F125Ac9e1cDFa9Ce15cc53822dbD) {
    +++ description: None
      assignedPermissions:
-        {"upgrade":["0x0B9857ae2D4A3DBe74ffE1d7DF045bb7F96E4840","0x1c479675ad559DC151F6Ec7ed3FbF8ceE79582B6","0x4Dbd4fc535Ac27206064B68FfCf827b0A60BAB3f","0x57Bd336d579A51938619271a7Cc137a46D0501B1","0x667e23ABd27E623c11d4CC00ca3EC4d0bD63337a","0x760723CD2e632826c38Fef8CD438A4CC7E7E1A40","0x8315177aB297bA92A06054cE80a67Ed4DBd7ed3a","0xe5896783a2F463446E1f624e64Aa6836BE4C6f58"]}
      receivedPermissions:
+        [{"permission":"upgrade","target":"0x0B9857ae2D4A3DBe74ffE1d7DF045bb7F96E4840","via":[]},{"permission":"upgrade","target":"0x1c479675ad559DC151F6Ec7ed3FbF8ceE79582B6","via":[]},{"permission":"upgrade","target":"0x4Dbd4fc535Ac27206064B68FfCf827b0A60BAB3f","via":[]},{"permission":"upgrade","target":"0x57Bd336d579A51938619271a7Cc137a46D0501B1","via":[]},{"permission":"upgrade","target":"0x667e23ABd27E623c11d4CC00ca3EC4d0bD63337a","via":[]},{"permission":"upgrade","target":"0x760723CD2e632826c38Fef8CD438A4CC7E7E1A40","via":[]},{"permission":"upgrade","target":"0x8315177aB297bA92A06054cE80a67Ed4DBd7ed3a","via":[]},{"permission":"upgrade","target":"0xe5896783a2F463446E1f624e64Aa6836BE4C6f58","via":[]}]
    }
```

```diff
    contract UpgradeExecutorAdmin (0x5613AF0474EB9c528A34701A5b1662E3C8FA0678) {
    +++ description: None
      assignedPermissions:
-        {"upgrade":["0x3ffFbAdAF827559da092217e474760E2b2c3CeDd","0xE6841D92B0C345144506576eC13ECf5103aC7f49"]}
      receivedPermissions:
+        [{"permission":"upgrade","target":"0x3ffFbAdAF827559da092217e474760E2b2c3CeDd","via":[]},{"permission":"upgrade","target":"0xE6841D92B0C345144506576eC13ECf5103aC7f49","via":[]}]
    }
```

```diff
    contract ValidatorWallet (0x56D83349c2B8DCF74d7E92D5b6B33d0BADD52D78) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x4561A4cDA2CB8a61ED023785bc1817fdf685dcb3","via":[]}]
    }
```

```diff
    contract RollupEventInbox (0x57Bd336d579A51938619271a7Cc137a46D0501B1) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x554723262467F125Ac9e1cDFa9Ce15cc53822dbD","via":[]}]
    }
```

```diff
    contract RollupProxy (0x5eF0D09d1E6204141B4d37530808eD19f60FBa35) {
    +++ description: Manages rollup components, list of Stakers and Validators. Entry point for Validators creating new Rollup Nodes (state commits) and Challengers submitting fraud proofs.
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x3ffFbAdAF827559da092217e474760E2b2c3CeDd","via":[]}]
    }
```

```diff
    contract OutboxV0 (0x667e23ABd27E623c11d4CC00ca3EC4d0bD63337a) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x554723262467F125Ac9e1cDFa9Ce15cc53822dbD","via":[]}]
    }
```

```diff
    contract L1GatewayRouter (0x72Ce9c846789fdB6fC1f34aC4AD25Dd9ef7031ef) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x9aD46fac0Cf7f790E5be05A0F15223935A0c0aDa","via":[]}]
    }
```

```diff
    contract Validator (0x758C6bB08B3ea5889B5cddbdeF9A45b3a983c398) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0xAb33350E0319466A81D2AE6DC5CdF2518123f766","via":[]}]
    }
```

```diff
    contract OutboxV1 (0x760723CD2e632826c38Fef8CD438A4CC7E7E1A40) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x554723262467F125Ac9e1cDFa9Ce15cc53822dbD","via":[]}]
    }
```

```diff
    contract ValidatorWallet (0x7CF3d537733F6Ba4183A833c9B021265716cE9d0) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x3f92814930f43c6a1C6B133E5945E7B3338F33a6","via":[]}]
    }
```

```diff
    contract Bridge (0x8315177aB297bA92A06054cE80a67Ed4DBd7ed3a) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x554723262467F125Ac9e1cDFa9Ce15cc53822dbD","via":[]}]
    }
```

```diff
    contract ValidatorWallet (0x83215480dB2C6A7E56f9E99EF93AB9B36F8A3DD5) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x0ea6999172c1B4563695F76A52de73c848587b17","via":[]}]
    }
```

```diff
    contract GatewaysAdmin (0x9aD46fac0Cf7f790E5be05A0F15223935A0c0aDa) {
    +++ description: None
      assignedPermissions:
-        {"upgrade":["0x72Ce9c846789fdB6fC1f34aC4AD25Dd9ef7031ef","0xa3A7B6F88361F48403514059F1F16C8E78d60EeC","0xcEe284F754E854890e311e3280b767F80797180d"]}
      receivedPermissions:
+        [{"permission":"upgrade","target":"0x72Ce9c846789fdB6fC1f34aC4AD25Dd9ef7031ef","via":[]},{"permission":"upgrade","target":"0xa3A7B6F88361F48403514059F1F16C8E78d60EeC","via":[]},{"permission":"upgrade","target":"0xcEe284F754E854890e311e3280b767F80797180d","via":[]}]
    }
```

```diff
    contract L1ERC20Gateway (0xa3A7B6F88361F48403514059F1F16C8E78d60EeC) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x9aD46fac0Cf7f790E5be05A0F15223935A0c0aDa","via":[]}]
    }
```

```diff
    contract ProxyAdmin (0xAb33350E0319466A81D2AE6DC5CdF2518123f766) {
    +++ description: None
      assignedPermissions:
-        {"upgrade":["0x758C6bB08B3ea5889B5cddbdeF9A45b3a983c398"]}
      receivedPermissions:
+        [{"permission":"upgrade","target":"0x758C6bB08B3ea5889B5cddbdeF9A45b3a983c398","via":[]}]
    }
```

```diff
    contract ValidatorWallet (0xB0CB1384e3f4a9a9b2447e39b05e10631E1D34B0) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x509E3CDc218d163DB9A03678107b72e00163b061","via":[]}]
    }
```

```diff
    contract ProxyAdmin (0xCcadc6B174BEcf31a35b818373e90391971a1C0c) {
    +++ description: None
      assignedPermissions:
-        {"upgrade":["0xf59caf75e8A4bFBA4e6e07aD86C7E498E4d2519b"]}
      receivedPermissions:
+        [{"permission":"upgrade","target":"0xf59caf75e8A4bFBA4e6e07aD86C7E498E4d2519b","via":[]}]
    }
```

```diff
    contract L1CustomGateway (0xcEe284F754E854890e311e3280b767F80797180d) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x9aD46fac0Cf7f790E5be05A0F15223935A0c0aDa","via":[]}]
    }
```

```diff
    contract ChallengeManager (0xe5896783a2F463446E1f624e64Aa6836BE4C6f58) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x554723262467F125Ac9e1cDFa9Ce15cc53822dbD","via":[]}]
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
    contract ValidatorWallet (0xf59caf75e8A4bFBA4e6e07aD86C7E498E4d2519b) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0xCcadc6B174BEcf31a35b818373e90391971a1C0c","via":[]}]
    }
```

Generated with discovered.json: 0xf3d7b4fd7812de28dba3563e68320b2cb08e6b8d

# Diff at Fri, 09 Aug 2024 11:58:31 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@bf40aa32f030fd312056ca0ef198c8550467d1d7 block: 20406543
- current block number: 20406543

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20406543 (main branch discovery), not current.

```diff
    contract ArbitrumProxyAdmin (0x554723262467F125Ac9e1cDFa9Ce15cc53822dbD) {
    +++ description: None
      assignedPermissions.upgrade.7:
-        "0x760723CD2e632826c38Fef8CD438A4CC7E7E1A40"
+        "0xe5896783a2F463446E1f624e64Aa6836BE4C6f58"
      assignedPermissions.upgrade.6:
-        "0x667e23ABd27E623c11d4CC00ca3EC4d0bD63337a"
+        "0x8315177aB297bA92A06054cE80a67Ed4DBd7ed3a"
      assignedPermissions.upgrade.5:
-        "0x1c479675ad559DC151F6Ec7ed3FbF8ceE79582B6"
+        "0x760723CD2e632826c38Fef8CD438A4CC7E7E1A40"
      assignedPermissions.upgrade.4:
-        "0x8315177aB297bA92A06054cE80a67Ed4DBd7ed3a"
+        "0x667e23ABd27E623c11d4CC00ca3EC4d0bD63337a"
      assignedPermissions.upgrade.1:
-        "0xe5896783a2F463446E1f624e64Aa6836BE4C6f58"
+        "0x1c479675ad559DC151F6Ec7ed3FbF8ceE79582B6"
    }
```

```diff
    contract GatewaysAdmin (0x9aD46fac0Cf7f790E5be05A0F15223935A0c0aDa) {
    +++ description: None
      assignedPermissions.upgrade.2:
-        "0x72Ce9c846789fdB6fC1f34aC4AD25Dd9ef7031ef"
+        "0xcEe284F754E854890e311e3280b767F80797180d"
      assignedPermissions.upgrade.0:
-        "0xcEe284F754E854890e311e3280b767F80797180d"
+        "0x72Ce9c846789fdB6fC1f34aC4AD25Dd9ef7031ef"
    }
```

Generated with discovered.json: 0x71e1629b84badc6ff874a78b9a1bab8c308c13fb

# Diff at Fri, 09 Aug 2024 10:08:37 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@1f0da1d0aab7bc6b3b5e54e7e93480bd98e57035 block: 20406543
- current block number: 20406543

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20406543 (main branch discovery), not current.

```diff
    contract ProxyAdmin (0x0ea6999172c1B4563695F76A52de73c848587b17) {
    +++ description: None
      assignedPermissions.admin:
-        ["0x83215480dB2C6A7E56f9E99EF93AB9B36F8A3DD5"]
      assignedPermissions.upgrade:
+        ["0x83215480dB2C6A7E56f9E99EF93AB9B36F8A3DD5"]
    }
```

```diff
    contract ProxyAdmin (0x3f92814930f43c6a1C6B133E5945E7B3338F33a6) {
    +++ description: None
      assignedPermissions.admin:
-        ["0x7CF3d537733F6Ba4183A833c9B021265716cE9d0"]
      assignedPermissions.upgrade:
+        ["0x7CF3d537733F6Ba4183A833c9B021265716cE9d0"]
    }
```

```diff
    contract UpgradeExecutor (0x3ffFbAdAF827559da092217e474760E2b2c3CeDd) {
    +++ description: None
      assignedPermissions.admin:
-        ["0x5eF0D09d1E6204141B4d37530808eD19f60FBa35"]
      assignedPermissions.upgrade:
+        ["0x5eF0D09d1E6204141B4d37530808eD19f60FBa35"]
    }
```

```diff
    contract ProxyAdmin (0x4561A4cDA2CB8a61ED023785bc1817fdf685dcb3) {
    +++ description: None
      assignedPermissions.admin:
-        ["0x56D83349c2B8DCF74d7E92D5b6B33d0BADD52D78"]
      assignedPermissions.upgrade:
+        ["0x56D83349c2B8DCF74d7E92D5b6B33d0BADD52D78"]
    }
```

```diff
    contract ProxyAdmin (0x509E3CDc218d163DB9A03678107b72e00163b061) {
    +++ description: None
      assignedPermissions.admin:
-        ["0xB0CB1384e3f4a9a9b2447e39b05e10631E1D34B0"]
      assignedPermissions.upgrade:
+        ["0xB0CB1384e3f4a9a9b2447e39b05e10631E1D34B0"]
    }
```

```diff
    contract ArbitrumProxyAdmin (0x554723262467F125Ac9e1cDFa9Ce15cc53822dbD) {
    +++ description: None
      assignedPermissions.admin:
-        ["0x0B9857ae2D4A3DBe74ffE1d7DF045bb7F96E4840","0x1c479675ad559DC151F6Ec7ed3FbF8ceE79582B6","0x4Dbd4fc535Ac27206064B68FfCf827b0A60BAB3f","0x57Bd336d579A51938619271a7Cc137a46D0501B1","0x667e23ABd27E623c11d4CC00ca3EC4d0bD63337a","0x760723CD2e632826c38Fef8CD438A4CC7E7E1A40","0x8315177aB297bA92A06054cE80a67Ed4DBd7ed3a","0xe5896783a2F463446E1f624e64Aa6836BE4C6f58"]
      assignedPermissions.upgrade:
+        ["0x0B9857ae2D4A3DBe74ffE1d7DF045bb7F96E4840","0xe5896783a2F463446E1f624e64Aa6836BE4C6f58","0x4Dbd4fc535Ac27206064B68FfCf827b0A60BAB3f","0x57Bd336d579A51938619271a7Cc137a46D0501B1","0x8315177aB297bA92A06054cE80a67Ed4DBd7ed3a","0x1c479675ad559DC151F6Ec7ed3FbF8ceE79582B6","0x667e23ABd27E623c11d4CC00ca3EC4d0bD63337a","0x760723CD2e632826c38Fef8CD438A4CC7E7E1A40"]
    }
```

```diff
    contract UpgradeExecutorAdmin (0x5613AF0474EB9c528A34701A5b1662E3C8FA0678) {
    +++ description: None
      assignedPermissions.admin:
-        ["0x3ffFbAdAF827559da092217e474760E2b2c3CeDd","0xE6841D92B0C345144506576eC13ECf5103aC7f49"]
      assignedPermissions.upgrade:
+        ["0x3ffFbAdAF827559da092217e474760E2b2c3CeDd","0xE6841D92B0C345144506576eC13ECf5103aC7f49"]
    }
```

```diff
    contract GatewaysAdmin (0x9aD46fac0Cf7f790E5be05A0F15223935A0c0aDa) {
    +++ description: None
      assignedPermissions.admin:
-        ["0x72Ce9c846789fdB6fC1f34aC4AD25Dd9ef7031ef","0xa3A7B6F88361F48403514059F1F16C8E78d60EeC","0xcEe284F754E854890e311e3280b767F80797180d"]
      assignedPermissions.upgrade:
+        ["0xcEe284F754E854890e311e3280b767F80797180d","0xa3A7B6F88361F48403514059F1F16C8E78d60EeC","0x72Ce9c846789fdB6fC1f34aC4AD25Dd9ef7031ef"]
    }
```

```diff
    contract ProxyAdmin (0xAb33350E0319466A81D2AE6DC5CdF2518123f766) {
    +++ description: None
      assignedPermissions.admin:
-        ["0x758C6bB08B3ea5889B5cddbdeF9A45b3a983c398"]
      assignedPermissions.upgrade:
+        ["0x758C6bB08B3ea5889B5cddbdeF9A45b3a983c398"]
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
    contract ProxyAdmin (0xCcadc6B174BEcf31a35b818373e90391971a1C0c) {
    +++ description: None
      assignedPermissions.admin:
-        ["0xf59caf75e8A4bFBA4e6e07aD86C7E498E4d2519b"]
      assignedPermissions.upgrade:
+        ["0xf59caf75e8A4bFBA4e6e07aD86C7E498E4d2519b"]
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

Generated with discovered.json: 0xbc6a09bfd69840e959912e3a5722812f214d1290

# Diff at Tue, 30 Jul 2024 11:10:54 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@b2b6471ff62871f4956541f42ec025c356c08f7e block: 20406543
- current block number: 20406543

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20406543 (main branch discovery), not current.

```diff
    contract RollupProxy (0x5eF0D09d1E6204141B4d37530808eD19f60FBa35) {
    +++ description: Manages rollup components, list of Stakers and Validators. Entry point for Validators creating new Rollup Nodes (state commits) and Challengers submitting fraud proofs.
      fieldMeta:
+        {"confirmPeriodBlocks":{"description":"Challenge period. (Number of blocks until a node is confirmed)."},"wasmModuleRoot":{"description":"Root hash of the WASM module used for execution, like a fingerprint of the L2 logic. Can be associated with ArbOS versions."}}
    }
```

Generated with discovered.json: 0xaed1b82772109b0ea6ba804d217c116d46f7af09

# Diff at Sun, 28 Jul 2024 17:29:12 GMT:

- author: sekuba (<sekuba@users.noreply.github.com>)
- comparing to: main@04dc4c7d175d5f4d1388774094bdb962fe7b7423 block: 20389094
- current block number: 20406543

## Description

1) SecurityCouncil signer rotation completed
2) Changed timelock name in conf to be consistent with the new diagram

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
discovery. Values are for block 20389094 (main branch discovery), not current.

```diff
    contract L1ArbitrumTimelock (0xE6841D92B0C345144506576eC13ECf5103aC7f49) {
    +++ description: None
      name:
-        "L1ArbitrumTimelock"
+        "L1Timelock"
    }
```

Generated with discovered.json: 0x37615e14764a11f47d4ee5e6dbf8137e9b5501a0

# Diff at Fri, 26 Jul 2024 07:02:36 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@f98f9bf0ba32e20ec33942af664ae6ed27e8172d block: 20339507
- current block number: 20389094

## Description

These scheduled transactions sync the 4 changed SC signers to ethereum and nova. Refer to the arbitrum/arbitrum diffHistory for the initial scheduled transactions.
[--> gov forum post](https://forum.arbitrum.foundation/t/non-emergency-actions-to-facilitate-key-rotation-of-security-council-june-2024/25140)

## Watched changes

```diff
    contract L1ArbitrumTimelock (0xE6841D92B0C345144506576eC13ECf5103aC7f49) {
    +++ description: None
      values.scheduledTransactions.37:
+        {"id":"0x2262aecef1f65c9daa1f3116b89433b6181e93d53cbdc5b11d0fc0e29dfbfeb8","decoded":{"chain":"arbitrum","contractName":"SecurityCouncilMemberSyncAction","function":"perform","inputs":[{"name":"_securityCouncil","value":"0xADd68bCb0f66878aB9D37a447C7b9067C5dfa941"},{"name":"_updatedMembers","value":["0x3Bd8e2AC65ad6f0F094BA6766cBd9484AB49eF23","0xf8e1492255d9428c2Fc20A98A1DeB1215C8ffEfd","0xb07dc9103328A51128bC6Cc1049d1137035f5E28","0x3E286452b1C66abB08Eb5494c3894F40aB5a59AF","0xb71ca4FFbB7b58d75Ba29891ab45e9Dc12B444Ed","0x8F10e3413586c4a8DCfcE19D009872b19e9cd8E3","0x0275b3D54a5dDbf8205A75984796eFE8b7357Bae","0x5DD2205C3aac13E592F0a3D85188c948D1781df1","0x5a09A94eE8198D3c474d723337aa58023810022C","0x475816ca2a31D601B4e336f5c2418A67978aBf09","0xA821c8c245d1F3A257e3B0DEC99268cA05144422","0x70C006fC86A392c16D7E085cefc0Ad1FF7de6C75"]},{"name":"_nonce","value":6}],"address":"0x9BF7b8884Fa381a45f8CB2525905fb36C996297a","calldata":"0x536d8944000000000000000000000000add68bcb0f66878ab9d37a447c7b9067c5dfa94100000000000000000000000000000000000000000000000000000000000000600000000000000000000000000000000000000000000000000000000000000006000000000000000000000000000000000000000000000000000000000000000c0000000000000000000000003bd8e2ac65ad6f0f094ba6766cbd9484ab49ef23000000000000000000000000f8e1492255d9428c2fc20a98a1deb1215c8ffefd000000000000000000000000b07dc9103328a51128bc6cc1049d1137035f5e280000000000000000000000003e286452b1c66abb08eb5494c3894f40ab5a59af000000000000000000000000b71ca4ffbb7b58d75ba29891ab45e9dc12b444ed0000000000000000000000008f10e3413586c4a8dcfce19d009872b19e9cd8e30000000000000000000000000275b3d54a5ddbf8205a75984796efe8b7357bae0000000000000000000000005dd2205c3aac13e592f0a3d85188c948d1781df10000000000000000000000005a09a94ee8198d3c474d723337aa58023810022c000000000000000000000000475816ca2a31d601b4e336f5c2418a67978abf09000000000000000000000000a821c8c245d1f3a257e3b0dec99268ca0514442200000000000000000000000070c006fc86a392c16d7e085cefc0ad1ff7de6c75","executor":"0xCF57572261c7c2BCF21ffD220ea7d1a27D40A827","inboxOnEthereum":"0x4Dbd4fc535Ac27206064B68FfCf827b0A60BAB3f"},"raw":{"target":"0xa723C008e76E379c55599D2E4d93879BeaFDa79C","value":0,"data":"0x0000000000000000000000004dbd4fc535ac27206064b68ffcf827b0a60bab3f000000000000000000000000cf57572261c7c2bcf21ffd220ea7d1a27d40a82700000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000c000000000000000000000000000000000000000000000000000000000000002841cff79cd0000000000000000000000009bf7b8884fa381a45f8cb2525905fb36c996297a00000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000204536d8944000000000000000000000000add68bcb0f66878ab9d37a447c7b9067c5dfa94100000000000000000000000000000000000000000000000000000000000000600000000000000000000000000000000000000000000000000000000000000006000000000000000000000000000000000000000000000000000000000000000c0000000000000000000000003bd8e2ac65ad6f0f094ba6766cbd9484ab49ef23000000000000000000000000f8e1492255d9428c2fc20a98a1deb1215c8ffefd000000000000000000000000b07dc9103328a51128bc6cc1049d1137035f5e280000000000000000000000003e286452b1c66abb08eb5494c3894f40ab5a59af000000000000000000000000b71ca4ffbb7b58d75ba29891ab45e9dc12b444ed0000000000000000000000008f10e3413586c4a8dcfce19d009872b19e9cd8e30000000000000000000000000275b3d54a5ddbf8205a75984796efe8b7357bae0000000000000000000000005dd2205c3aac13e592f0a3d85188c948d1781df10000000000000000000000005a09a94ee8198d3c474d723337aa58023810022c000000000000000000000000475816ca2a31d601b4e336f5c2418a67978abf09000000000000000000000000a821c8c245d1f3a257e3b0dec99268ca0514442200000000000000000000000070c006fc86a392c16d7e085cefc0ad1ff7de6c750000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000","delay":259200}}
      values.scheduledTransactions.36:
+        {"id":"0x2262aecef1f65c9daa1f3116b89433b6181e93d53cbdc5b11d0fc0e29dfbfeb8","decoded":{"chain":"nova","address":"0x9BF7b8884Fa381a45f8CB2525905fb36C996297a","calldata":"0x536d8944000000000000000000000000c232ee726e3c51b86778bb4dbe61c52cc07a60f300000000000000000000000000000000000000000000000000000000000000600000000000000000000000000000000000000000000000000000000000000006000000000000000000000000000000000000000000000000000000000000000c0000000000000000000000003bd8e2ac65ad6f0f094ba6766cbd9484ab49ef23000000000000000000000000f8e1492255d9428c2fc20a98a1deb1215c8ffefd000000000000000000000000b07dc9103328a51128bc6cc1049d1137035f5e280000000000000000000000003e286452b1c66abb08eb5494c3894f40ab5a59af000000000000000000000000b71ca4ffbb7b58d75ba29891ab45e9dc12b444ed0000000000000000000000008f10e3413586c4a8dcfce19d009872b19e9cd8e30000000000000000000000000275b3d54a5ddbf8205a75984796efe8b7357bae0000000000000000000000005dd2205c3aac13e592f0a3d85188c948d1781df10000000000000000000000005a09a94ee8198d3c474d723337aa58023810022c000000000000000000000000475816ca2a31d601b4e336f5c2418a67978abf09000000000000000000000000a821c8c245d1f3a257e3b0dec99268ca0514442200000000000000000000000070c006fc86a392c16d7e085cefc0ad1ff7de6c75","executor":"0x86a02dD71363c440b21F4c0E5B2Ad01Ffe1A7482","inboxOnEthereum":"0xc4448b71118c9071Bcb9734A0EAc55D18A153949"},"raw":{"target":"0xa723C008e76E379c55599D2E4d93879BeaFDa79C","value":0,"data":"0x000000000000000000000000c4448b71118c9071bcb9734a0eac55d18a15394900000000000000000000000086a02dd71363c440b21f4c0e5b2ad01ffe1a748200000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000c000000000000000000000000000000000000000000000000000000000000002841cff79cd0000000000000000000000009bf7b8884fa381a45f8cb2525905fb36c996297a00000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000204536d8944000000000000000000000000c232ee726e3c51b86778bb4dbe61c52cc07a60f300000000000000000000000000000000000000000000000000000000000000600000000000000000000000000000000000000000000000000000000000000006000000000000000000000000000000000000000000000000000000000000000c0000000000000000000000003bd8e2ac65ad6f0f094ba6766cbd9484ab49ef23000000000000000000000000f8e1492255d9428c2fc20a98a1deb1215c8ffefd000000000000000000000000b07dc9103328a51128bc6cc1049d1137035f5e280000000000000000000000003e286452b1c66abb08eb5494c3894f40ab5a59af000000000000000000000000b71ca4ffbb7b58d75ba29891ab45e9dc12b444ed0000000000000000000000008f10e3413586c4a8dcfce19d009872b19e9cd8e30000000000000000000000000275b3d54a5ddbf8205a75984796efe8b7357bae0000000000000000000000005dd2205c3aac13e592f0a3d85188c948d1781df10000000000000000000000005a09a94ee8198d3c474d723337aa58023810022c000000000000000000000000475816ca2a31d601b4e336f5c2418a67978abf09000000000000000000000000a821c8c245d1f3a257e3b0dec99268ca0514442200000000000000000000000070c006fc86a392c16d7e085cefc0ad1ff7de6c750000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000","delay":259200}}
      values.scheduledTransactions.35:
+        {"id":"0x2262aecef1f65c9daa1f3116b89433b6181e93d53cbdc5b11d0fc0e29dfbfeb8","decoded":{"chain":"arbitrum","contractName":"SecurityCouncilMemberSyncAction","function":"perform","inputs":[{"name":"_securityCouncil","value":"0x423552c0F05baCCac5Bfa91C6dCF1dc53a0A1641"},{"name":"_updatedMembers","value":["0x3Bd8e2AC65ad6f0F094BA6766cBd9484AB49eF23","0xf8e1492255d9428c2Fc20A98A1DeB1215C8ffEfd","0xb07dc9103328A51128bC6Cc1049d1137035f5E28","0x3E286452b1C66abB08Eb5494c3894F40aB5a59AF","0xb71ca4FFbB7b58d75Ba29891ab45e9Dc12B444Ed","0x8F10e3413586c4a8DCfcE19D009872b19e9cd8E3","0x0275b3D54a5dDbf8205A75984796eFE8b7357Bae","0x5DD2205C3aac13E592F0a3D85188c948D1781df1","0x5a09A94eE8198D3c474d723337aa58023810022C","0x475816ca2a31D601B4e336f5c2418A67978aBf09","0xA821c8c245d1F3A257e3B0DEC99268cA05144422","0x70C006fC86A392c16D7E085cefc0Ad1FF7de6C75"]},{"name":"_nonce","value":6}],"address":"0x9BF7b8884Fa381a45f8CB2525905fb36C996297a","calldata":"0x536d8944000000000000000000000000423552c0f05baccac5bfa91c6dcf1dc53a0a164100000000000000000000000000000000000000000000000000000000000000600000000000000000000000000000000000000000000000000000000000000006000000000000000000000000000000000000000000000000000000000000000c0000000000000000000000003bd8e2ac65ad6f0f094ba6766cbd9484ab49ef23000000000000000000000000f8e1492255d9428c2fc20a98a1deb1215c8ffefd000000000000000000000000b07dc9103328a51128bc6cc1049d1137035f5e280000000000000000000000003e286452b1c66abb08eb5494c3894f40ab5a59af000000000000000000000000b71ca4ffbb7b58d75ba29891ab45e9dc12b444ed0000000000000000000000008f10e3413586c4a8dcfce19d009872b19e9cd8e30000000000000000000000000275b3d54a5ddbf8205a75984796efe8b7357bae0000000000000000000000005dd2205c3aac13e592f0a3d85188c948d1781df10000000000000000000000005a09a94ee8198d3c474d723337aa58023810022c000000000000000000000000475816ca2a31d601b4e336f5c2418a67978abf09000000000000000000000000a821c8c245d1f3a257e3b0dec99268ca0514442200000000000000000000000070c006fc86a392c16d7e085cefc0ad1ff7de6c75","executor":"0xCF57572261c7c2BCF21ffD220ea7d1a27D40A827","inboxOnEthereum":"0x4Dbd4fc535Ac27206064B68FfCf827b0A60BAB3f"},"raw":{"target":"0xa723C008e76E379c55599D2E4d93879BeaFDa79C","value":0,"data":"0x0000000000000000000000004dbd4fc535ac27206064b68ffcf827b0a60bab3f000000000000000000000000cf57572261c7c2bcf21ffd220ea7d1a27d40a82700000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000c000000000000000000000000000000000000000000000000000000000000002841cff79cd0000000000000000000000009bf7b8884fa381a45f8cb2525905fb36c996297a00000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000204536d8944000000000000000000000000423552c0f05baccac5bfa91c6dcf1dc53a0a164100000000000000000000000000000000000000000000000000000000000000600000000000000000000000000000000000000000000000000000000000000006000000000000000000000000000000000000000000000000000000000000000c0000000000000000000000003bd8e2ac65ad6f0f094ba6766cbd9484ab49ef23000000000000000000000000f8e1492255d9428c2fc20a98a1deb1215c8ffefd000000000000000000000000b07dc9103328a51128bc6cc1049d1137035f5e280000000000000000000000003e286452b1c66abb08eb5494c3894f40ab5a59af000000000000000000000000b71ca4ffbb7b58d75ba29891ab45e9dc12b444ed0000000000000000000000008f10e3413586c4a8dcfce19d009872b19e9cd8e30000000000000000000000000275b3d54a5ddbf8205a75984796efe8b7357bae0000000000000000000000005dd2205c3aac13e592f0a3d85188c948d1781df10000000000000000000000005a09a94ee8198d3c474d723337aa58023810022c000000000000000000000000475816ca2a31d601b4e336f5c2418a67978abf09000000000000000000000000a821c8c245d1f3a257e3b0dec99268ca0514442200000000000000000000000070c006fc86a392c16d7e085cefc0ad1ff7de6c750000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000","delay":259200}}
      values.scheduledTransactions.34:
+        {"id":"0x2262aecef1f65c9daa1f3116b89433b6181e93d53cbdc5b11d0fc0e29dfbfeb8","decoded":{"chain":"ethereum","contractName":"SecurityCouncilMemberSyncAction","function":"perform","inputs":[{"name":"_securityCouncil","value":"0xF06E95eF589D9c38af242a8AAee8375f14023F85"},{"name":"_updatedMembers","value":["0x3Bd8e2AC65ad6f0F094BA6766cBd9484AB49eF23","0xf8e1492255d9428c2Fc20A98A1DeB1215C8ffEfd","0xb07dc9103328A51128bC6Cc1049d1137035f5E28","0x3E286452b1C66abB08Eb5494c3894F40aB5a59AF","0xb71ca4FFbB7b58d75Ba29891ab45e9Dc12B444Ed","0x8F10e3413586c4a8DCfcE19D009872b19e9cd8E3","0x0275b3D54a5dDbf8205A75984796eFE8b7357Bae","0x5DD2205C3aac13E592F0a3D85188c948D1781df1","0x5a09A94eE8198D3c474d723337aa58023810022C","0x475816ca2a31D601B4e336f5c2418A67978aBf09","0xA821c8c245d1F3A257e3B0DEC99268cA05144422","0x70C006fC86A392c16D7E085cefc0Ad1FF7de6C75"]},{"name":"_nonce","value":6}],"address":"0x9BF7b8884Fa381a45f8CB2525905fb36C996297a","calldata":"0x536d8944000000000000000000000000f06e95ef589d9c38af242a8aaee8375f14023f8500000000000000000000000000000000000000000000000000000000000000600000000000000000000000000000000000000000000000000000000000000006000000000000000000000000000000000000000000000000000000000000000c0000000000000000000000003bd8e2ac65ad6f0f094ba6766cbd9484ab49ef23000000000000000000000000f8e1492255d9428c2fc20a98a1deb1215c8ffefd000000000000000000000000b07dc9103328a51128bc6cc1049d1137035f5e280000000000000000000000003e286452b1c66abb08eb5494c3894f40ab5a59af000000000000000000000000b71ca4ffbb7b58d75ba29891ab45e9dc12b444ed0000000000000000000000008f10e3413586c4a8dcfce19d009872b19e9cd8e30000000000000000000000000275b3d54a5ddbf8205a75984796efe8b7357bae0000000000000000000000005dd2205c3aac13e592f0a3d85188c948d1781df10000000000000000000000005a09a94ee8198d3c474d723337aa58023810022c000000000000000000000000475816ca2a31d601b4e336f5c2418a67978abf09000000000000000000000000a821c8c245d1f3a257e3b0dec99268ca0514442200000000000000000000000070c006fc86a392c16d7e085cefc0ad1ff7de6c75","executor":"0x3ffFbAdAF827559da092217e474760E2b2c3CeDd"},"raw":{"target":"0x3ffFbAdAF827559da092217e474760E2b2c3CeDd","value":0,"data":"0x1cff79cd0000000000000000000000009bf7b8884fa381a45f8cb2525905fb36c996297a00000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000204536d8944000000000000000000000000f06e95ef589d9c38af242a8aaee8375f14023f8500000000000000000000000000000000000000000000000000000000000000600000000000000000000000000000000000000000000000000000000000000006000000000000000000000000000000000000000000000000000000000000000c0000000000000000000000003bd8e2ac65ad6f0f094ba6766cbd9484ab49ef23000000000000000000000000f8e1492255d9428c2fc20a98a1deb1215c8ffefd000000000000000000000000b07dc9103328a51128bc6cc1049d1137035f5e280000000000000000000000003e286452b1c66abb08eb5494c3894f40ab5a59af000000000000000000000000b71ca4ffbb7b58d75ba29891ab45e9dc12b444ed0000000000000000000000008f10e3413586c4a8dcfce19d009872b19e9cd8e30000000000000000000000000275b3d54a5ddbf8205a75984796efe8b7357bae0000000000000000000000005dd2205c3aac13e592f0a3d85188c948d1781df10000000000000000000000005a09a94ee8198d3c474d723337aa58023810022c000000000000000000000000475816ca2a31d601b4e336f5c2418a67978abf09000000000000000000000000a821c8c245d1f3a257e3b0dec99268ca0514442200000000000000000000000070c006fc86a392c16d7e085cefc0ad1ff7de6c7500000000000000000000000000000000000000000000000000000000","delay":259200}}
    }
```

Generated with discovered.json: 0x664bb82fe6fb82d716ed58ddcbec9a37336954b4

# Diff at Fri, 19 Jul 2024 08:54:22 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@e818aac724e8e67da6b05262134684a79d6fb217 block: 20324730
- current block number: 20339507

## Description

Rename bridge to fit the naming of other orbitstack chains.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20324730 (main branch discovery), not current.

```diff
    contract OutboxV2 (0x0B9857ae2D4A3DBe74ffE1d7DF045bb7F96E4840) {
    +++ description: None
      name:
-        "OutboxV2"
+        "Outbox"
    }
```

```diff
    contract ArbitrumOneBridge (0x8315177aB297bA92A06054cE80a67Ed4DBd7ed3a) {
    +++ description: None
      name:
-        "ArbitrumOneBridge"
+        "Bridge"
    }
```

Generated with discovered.json: 0x124394f90189b0bf956954b217f601a07a5265db

# Diff at Wed, 17 Jul 2024 07:23:47 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@f46e1b9319335587ca32b6e85f9d2f0c7ab7a729 block: 20289738
- current block number: 20324730

## Description

Use the new handler to check if it's posting blobs.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20289738 (main branch discovery), not current.

```diff
    contract SequencerInbox (0x1c479675ad559DC151F6Ec7ed3FbF8ceE79582B6) {
    +++ description: None
      values.postsBlobs:
+        true
    }
```

Generated with discovered.json: 0xa1e00fdc80fd5a87605ec534b24fed82c3d81449

# Diff at Fri, 12 Jul 2024 10:11:30 GMT:

- author: sekuba (<sekuba@users.noreply.github.com>)
- comparing to: main@48ec906f1df3ec8351c0e2324170592091f7c1db block: 20174994
- current block number: 20289738

## Description

This timelock transaction is queued and executed, calling the `SwitchManagerRolesAction` on L2.

Decription from the contract:
`Grant the non emergency council the MEMBER_ADDER_ROLE, MEMBER_REPLACER_ROLE, MEMBER_ROTATOR_ROLE and MEMBER_REMOVER_ROLE on the SecurityCouncilManager. Revoke those same roles from the emergency council.`

Tx: https://app.blocksec.com/explorer/tx/arbitrum/0xf2929a5ee3c2a073de95293f91f163b4d743fdec38e4dceaa7c4796e090783c3

## Watched changes

```diff
    contract L1ArbitrumTimelock (0xE6841D92B0C345144506576eC13ECf5103aC7f49) {
    +++ description: None
      values.scheduledTransactions.33:
+        {"id":"0xb12265ee4fd64bcd070e991a40b4200f82114e2d238d0a5f2e37c8acb6c25f1d","decoded":{"chain":"arbitrum","contractName":"SwitchManagerRolesAction","function":"perform","inputs":[],"address":"0x29f3c6b8c98488FBAE0677AB3d2Eb29c77D6aD8a","calldata":"0xb147f40c","executor":"0xCF57572261c7c2BCF21ffD220ea7d1a27D40A827","inboxOnEthereum":"0x4Dbd4fc535Ac27206064B68FfCf827b0A60BAB3f"},"raw":{"target":"0xa723C008e76E379c55599D2E4d93879BeaFDa79C","value":0,"data":"0x0000000000000000000000004dbd4fc535ac27206064b68ffcf827b0a60bab3f000000000000000000000000cf57572261c7c2bcf21ffd220ea7d1a27d40a82700000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000c000000000000000000000000000000000000000000000000000000000000000841cff79cd00000000000000000000000029f3c6b8c98488fbae0677ab3d2eb29c77d6ad8a00000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000004b147f40c0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000","delay":259200}}
    }
```

Generated with discovered.json: 0x0eea4dbfba93f8d9aee0c617653335f8d79993cc

# Diff at Wed, 26 Jun 2024 09:34:43 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@cb9200e010745e10244c0b3851b3acf21fe41f31 block: 20124808
- current block number: 20174994

## Description

Added LPT (Livepeer token) L1 escrow. The rest is spam.

## Watched changes

```diff
    contract L1ArbitrumTimelock (0xE6841D92B0C345144506576eC13ECf5103aC7f49) {
    +++ description: None
      values.scheduledTransactions:
+        [{"id":"0x85368b7ca2ee99b3d479ddff6298f69f0ce7d35227a731b70e8bc689074ba0af","decoded":{"chain":"arbitrum","contractName":"AIP1Point2Action","function":"perform","inputs":[],"address":"0x6274106eedD4848371D2C09e0352d67B795ED516","calldata":"0xb147f40c","executor":"0xCF57572261c7c2BCF21ffD220ea7d1a27D40A827","inboxOnEthereum":"0x4Dbd4fc535Ac27206064B68FfCf827b0A60BAB3f"},"raw":{"target":"0xa723C008e76E379c55599D2E4d93879BeaFDa79C","value":0,"data":"0x0000000000000000000000004dbd4fc535ac27206064b68ffcf827b0a60bab3f000000000000000000000000cf57572261c7c2bcf21ffd220ea7d1a27d40a82700000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000c000000000000000000000000000000000000000000000000000000000000000841cff79cd0000000000000000000000006274106eedd4848371d2c09e0352d67b795ed51600000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000004b147f40c0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000","delay":259200}},{"id":"0x6f801c57f0acf08c9688585c8b1cbb4b36f7053267befee7b2ee996b58592f2f","decoded":{"chain":"arbitrum","contractName":"AIP4Action","function":"perform","inputs":[],"address":"0x85792f6BF346e3Bfd3A275318aDd2c44A1058447","calldata":"0xb147f40c","executor":"0xCF57572261c7c2BCF21ffD220ea7d1a27D40A827","inboxOnEthereum":"0x4Dbd4fc535Ac27206064B68FfCf827b0A60BAB3f"},"raw":{"target":"0xa723C008e76E379c55599D2E4d93879BeaFDa79C","value":0,"data":"0x0000000000000000000000004dbd4fc535ac27206064b68ffcf827b0a60bab3f000000000000000000000000cf57572261c7c2bcf21ffd220ea7d1a27d40a82700000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000c000000000000000000000000000000000000000000000000000000000000000841cff79cd00000000000000000000000085792f6bf346e3bfd3a275318add2c44a105844700000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000004b147f40c0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000","delay":259200}},{"id":"0x0a0e8ebc47cd2cc5c020dc6a52e1c0c349165c7133547d811956c973e6b03ee2","decoded":{"chain":"ethereum","contractName":"L1SCMgmtActivationAction","function":"perform","inputs":[],"address":"0x22EC545357162C342F643bDdb2eD4c3FB6B42eb0","calldata":"0xb147f40c","executor":"0x3ffFbAdAF827559da092217e474760E2b2c3CeDd"},"raw":{"target":"0x3ffFbAdAF827559da092217e474760E2b2c3CeDd","value":0,"data":"0x1cff79cd00000000000000000000000022ec545357162c342f643bddb2ed4c3fb6b42eb000000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000004b147f40c00000000000000000000000000000000000000000000000000000000","delay":259200}},{"id":"0x0a0e8ebc47cd2cc5c020dc6a52e1c0c349165c7133547d811956c973e6b03ee2","decoded":{"chain":"arbitrum","contractName":"GovernanceChainSCMgmtActivationAction","function":"perform","inputs":[],"address":"0x1015c1Ae166C4C39D18a1151b7029bAC1530c9aa","calldata":"0xb147f40c","executor":"0xCF57572261c7c2BCF21ffD220ea7d1a27D40A827","inboxOnEthereum":"0x4Dbd4fc535Ac27206064B68FfCf827b0A60BAB3f"},"raw":{"target":"0xa723C008e76E379c55599D2E4d93879BeaFDa79C","value":0,"data":"0x0000000000000000000000004dbd4fc535ac27206064b68ffcf827b0a60bab3f000000000000000000000000cf57572261c7c2bcf21ffd220ea7d1a27d40a82700000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000c000000000000000000000000000000000000000000000000000000000000000841cff79cd0000000000000000000000001015c1ae166c4c39d18a1151b7029bac1530c9aa00000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000004b147f40c0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000","delay":259200}},{"id":"0x0a0e8ebc47cd2cc5c020dc6a52e1c0c349165c7133547d811956c973e6b03ee2","decoded":{"chain":"nova","address":"0x22EC545357162C342F643bDdb2eD4c3FB6B42eb0","calldata":"0xb147f40c","executor":"0x86a02dD71363c440b21F4c0E5B2Ad01Ffe1A7482","inboxOnEthereum":"0xc4448b71118c9071Bcb9734A0EAc55D18A153949"},"raw":{"target":"0xa723C008e76E379c55599D2E4d93879BeaFDa79C","value":0,"data":"0x000000000000000000000000c4448b71118c9071bcb9734a0eac55d18a15394900000000000000000000000086a02dd71363c440b21f4c0e5b2ad01ffe1a748200000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000c000000000000000000000000000000000000000000000000000000000000000841cff79cd00000000000000000000000022ec545357162c342f643bddb2ed4c3fb6b42eb000000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000004b147f40c0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000","delay":259200}},{"id":"0x57ae5d951014e5b6dad9718af7c1b2fd41172f8957de355c15fbdd9a6e28395f","decoded":{"chain":"arbitrum","contractName":"UpdateGasChargeAction","function":"perform","inputs":[],"address":"0x7B1247f443359d1447Cf25e73380Bc9b99F2628f","calldata":"0xb147f40c","executor":"0xCF57572261c7c2BCF21ffD220ea7d1a27D40A827","inboxOnEthereum":"0x4Dbd4fc535Ac27206064B68FfCf827b0A60BAB3f"},"raw":{"target":"0xa723C008e76E379c55599D2E4d93879BeaFDa79C","value":0,"data":"0x0000000000000000000000004dbd4fc535ac27206064b68ffcf827b0a60bab3f000000000000000000000000cf57572261c7c2bcf21ffd220ea7d1a27d40a82700000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000c000000000000000000000000000000000000000000000000000000000000000841cff79cd0000000000000000000000007b1247f443359d1447cf25e73380bc9b99f2628f00000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000004b147f40c0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000","delay":259200}},{"id":"0x57ae5d951014e5b6dad9718af7c1b2fd41172f8957de355c15fbdd9a6e28395f","decoded":{"chain":"arbitrum","contractName":"SetSweepReceiverAction","function":"perform","inputs":[],"address":"0xBabA4DAf5800B9746f58C724F05E03880850D578","calldata":"0xb147f40c","executor":"0xCF57572261c7c2BCF21ffD220ea7d1a27D40A827","inboxOnEthereum":"0x4Dbd4fc535Ac27206064B68FfCf827b0A60BAB3f"},"raw":{"target":"0xa723C008e76E379c55599D2E4d93879BeaFDa79C","value":0,"data":"0x0000000000000000000000004dbd4fc535ac27206064b68ffcf827b0a60bab3f000000000000000000000000cf57572261c7c2bcf21ffd220ea7d1a27d40a82700000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000c000000000000000000000000000000000000000000000000000000000000000841cff79cd000000000000000000000000baba4daf5800b9746f58c724f05e03880850d57800000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000004b147f40c0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000","delay":259200}},{"id":"0x57ae5d951014e5b6dad9718af7c1b2fd41172f8957de355c15fbdd9a6e28395f","decoded":{"chain":"ethereum","contractName":"UpdateL1CoreTimelockAction","function":"perform","inputs":[],"address":"0xBabA4DAf5800B9746f58C724F05E03880850D578","calldata":"0xb147f40c","executor":"0x3ffFbAdAF827559da092217e474760E2b2c3CeDd"},"raw":{"target":"0x3ffFbAdAF827559da092217e474760E2b2c3CeDd","value":0,"data":"0x1cff79cd000000000000000000000000baba4daf5800b9746f58c724f05e03880850d57800000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000004b147f40c00000000000000000000000000000000000000000000000000000000","delay":259200}},{"id":"0x4de857395557aa68ca8e4ac5c12a0a8427b39b01c33e27882d473c25ed69cd93","decoded":{"chain":"ethereum","contractName":"SecurityCouncilMemberSyncAction","function":"perform","inputs":[{"name":"_securityCouncil","value":"0xF06E95eF589D9c38af242a8AAee8375f14023F85"},{"name":"_updatedMembers","value":["0x3Bd8e2AC65ad6f0F094BA6766cBd9484AB49eF23","0xf8e1492255d9428c2Fc20A98A1DeB1215C8ffEfd","0xb07dc9103328A51128bC6Cc1049d1137035f5E28","0x3E286452b1C66abB08Eb5494c3894F40aB5a59AF","0xb71ca4FFbB7b58d75Ba29891ab45e9Dc12B444Ed","0x8F10e3413586c4a8DCfcE19D009872b19e9cd8E3","0x566a07C3c932aE6AF74d77c29e5c30D8B1853710","0x5280406912EB8Ec677Df66C326BE48f938DC2e44","0x0275b3D54a5dDbf8205A75984796eFE8b7357Bae","0x5A1FD562271aAC2Dadb51BAAb7760b949D9D81dF","0xf6B6F07862A02C85628B3A9688beae07fEA9C863","0x475816ca2a31D601B4e336f5c2418A67978aBf09"]},{"name":"_nonce","value":1}],"address":"0x9BF7b8884Fa381a45f8CB2525905fb36C996297a","calldata":"0x536d8944000000000000000000000000f06e95ef589d9c38af242a8aaee8375f14023f8500000000000000000000000000000000000000000000000000000000000000600000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000000c0000000000000000000000003bd8e2ac65ad6f0f094ba6766cbd9484ab49ef23000000000000000000000000f8e1492255d9428c2fc20a98a1deb1215c8ffefd000000000000000000000000b07dc9103328a51128bc6cc1049d1137035f5e280000000000000000000000003e286452b1c66abb08eb5494c3894f40ab5a59af000000000000000000000000b71ca4ffbb7b58d75ba29891ab45e9dc12b444ed0000000000000000000000008f10e3413586c4a8dcfce19d009872b19e9cd8e3000000000000000000000000566a07c3c932ae6af74d77c29e5c30d8b18537100000000000000000000000005280406912eb8ec677df66c326be48f938dc2e440000000000000000000000000275b3d54a5ddbf8205a75984796efe8b7357bae0000000000000000000000005a1fd562271aac2dadb51baab7760b949d9d81df000000000000000000000000f6b6f07862a02c85628b3a9688beae07fea9c863000000000000000000000000475816ca2a31d601b4e336f5c2418a67978abf09","executor":"0x3ffFbAdAF827559da092217e474760E2b2c3CeDd"},"raw":{"target":"0x3ffFbAdAF827559da092217e474760E2b2c3CeDd","value":0,"data":"0x1cff79cd0000000000000000000000009bf7b8884fa381a45f8cb2525905fb36c996297a00000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000204536d8944000000000000000000000000f06e95ef589d9c38af242a8aaee8375f14023f8500000000000000000000000000000000000000000000000000000000000000600000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000000c0000000000000000000000003bd8e2ac65ad6f0f094ba6766cbd9484ab49ef23000000000000000000000000f8e1492255d9428c2fc20a98a1deb1215c8ffefd000000000000000000000000b07dc9103328a51128bc6cc1049d1137035f5e280000000000000000000000003e286452b1c66abb08eb5494c3894f40ab5a59af000000000000000000000000b71ca4ffbb7b58d75ba29891ab45e9dc12b444ed0000000000000000000000008f10e3413586c4a8dcfce19d009872b19e9cd8e3000000000000000000000000566a07c3c932ae6af74d77c29e5c30d8b18537100000000000000000000000005280406912eb8ec677df66c326be48f938dc2e440000000000000000000000000275b3d54a5ddbf8205a75984796efe8b7357bae0000000000000000000000005a1fd562271aac2dadb51baab7760b949d9d81df000000000000000000000000f6b6f07862a02c85628b3a9688beae07fea9c863000000000000000000000000475816ca2a31d601b4e336f5c2418a67978abf0900000000000000000000000000000000000000000000000000000000","delay":259200}},{"id":"0x4de857395557aa68ca8e4ac5c12a0a8427b39b01c33e27882d473c25ed69cd93","decoded":{"chain":"arbitrum","contractName":"SecurityCouncilMemberSyncAction","function":"perform","inputs":[{"name":"_securityCouncil","value":"0x423552c0F05baCCac5Bfa91C6dCF1dc53a0A1641"},{"name":"_updatedMembers","value":["0x3Bd8e2AC65ad6f0F094BA6766cBd9484AB49eF23","0xf8e1492255d9428c2Fc20A98A1DeB1215C8ffEfd","0xb07dc9103328A51128bC6Cc1049d1137035f5E28","0x3E286452b1C66abB08Eb5494c3894F40aB5a59AF","0xb71ca4FFbB7b58d75Ba29891ab45e9Dc12B444Ed","0x8F10e3413586c4a8DCfcE19D009872b19e9cd8E3","0x566a07C3c932aE6AF74d77c29e5c30D8B1853710","0x5280406912EB8Ec677Df66C326BE48f938DC2e44","0x0275b3D54a5dDbf8205A75984796eFE8b7357Bae","0x5A1FD562271aAC2Dadb51BAAb7760b949D9D81dF","0xf6B6F07862A02C85628B3A9688beae07fEA9C863","0x475816ca2a31D601B4e336f5c2418A67978aBf09"]},{"name":"_nonce","value":1}],"address":"0x9BF7b8884Fa381a45f8CB2525905fb36C996297a","calldata":"0x536d8944000000000000000000000000423552c0f05baccac5bfa91c6dcf1dc53a0a164100000000000000000000000000000000000000000000000000000000000000600000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000000c0000000000000000000000003bd8e2ac65ad6f0f094ba6766cbd9484ab49ef23000000000000000000000000f8e1492255d9428c2fc20a98a1deb1215c8ffefd000000000000000000000000b07dc9103328a51128bc6cc1049d1137035f5e280000000000000000000000003e286452b1c66abb08eb5494c3894f40ab5a59af000000000000000000000000b71ca4ffbb7b58d75ba29891ab45e9dc12b444ed0000000000000000000000008f10e3413586c4a8dcfce19d009872b19e9cd8e3000000000000000000000000566a07c3c932ae6af74d77c29e5c30d8b18537100000000000000000000000005280406912eb8ec677df66c326be48f938dc2e440000000000000000000000000275b3d54a5ddbf8205a75984796efe8b7357bae0000000000000000000000005a1fd562271aac2dadb51baab7760b949d9d81df000000000000000000000000f6b6f07862a02c85628b3a9688beae07fea9c863000000000000000000000000475816ca2a31d601b4e336f5c2418a67978abf09","executor":"0xCF57572261c7c2BCF21ffD220ea7d1a27D40A827","inboxOnEthereum":"0x4Dbd4fc535Ac27206064B68FfCf827b0A60BAB3f"},"raw":{"target":"0xa723C008e76E379c55599D2E4d93879BeaFDa79C","value":0,"data":"0x0000000000000000000000004dbd4fc535ac27206064b68ffcf827b0a60bab3f000000000000000000000000cf57572261c7c2bcf21ffd220ea7d1a27d40a82700000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000c000000000000000000000000000000000000000000000000000000000000002841cff79cd0000000000000000000000009bf7b8884fa381a45f8cb2525905fb36c996297a00000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000204536d8944000000000000000000000000423552c0f05baccac5bfa91c6dcf1dc53a0a164100000000000000000000000000000000000000000000000000000000000000600000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000000c0000000000000000000000003bd8e2ac65ad6f0f094ba6766cbd9484ab49ef23000000000000000000000000f8e1492255d9428c2fc20a98a1deb1215c8ffefd000000000000000000000000b07dc9103328a51128bc6cc1049d1137035f5e280000000000000000000000003e286452b1c66abb08eb5494c3894f40ab5a59af000000000000000000000000b71ca4ffbb7b58d75ba29891ab45e9dc12b444ed0000000000000000000000008f10e3413586c4a8dcfce19d009872b19e9cd8e3000000000000000000000000566a07c3c932ae6af74d77c29e5c30d8b18537100000000000000000000000005280406912eb8ec677df66c326be48f938dc2e440000000000000000000000000275b3d54a5ddbf8205a75984796efe8b7357bae0000000000000000000000005a1fd562271aac2dadb51baab7760b949d9d81df000000000000000000000000f6b6f07862a02c85628b3a9688beae07fea9c863000000000000000000000000475816ca2a31d601b4e336f5c2418a67978abf090000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000","delay":259200}},{"id":"0x4de857395557aa68ca8e4ac5c12a0a8427b39b01c33e27882d473c25ed69cd93","decoded":{"chain":"nova","address":"0x9BF7b8884Fa381a45f8CB2525905fb36C996297a","calldata":"0x536d8944000000000000000000000000c232ee726e3c51b86778bb4dbe61c52cc07a60f300000000000000000000000000000000000000000000000000000000000000600000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000000c0000000000000000000000003bd8e2ac65ad6f0f094ba6766cbd9484ab49ef23000000000000000000000000f8e1492255d9428c2fc20a98a1deb1215c8ffefd000000000000000000000000b07dc9103328a51128bc6cc1049d1137035f5e280000000000000000000000003e286452b1c66abb08eb5494c3894f40ab5a59af000000000000000000000000b71ca4ffbb7b58d75ba29891ab45e9dc12b444ed0000000000000000000000008f10e3413586c4a8dcfce19d009872b19e9cd8e3000000000000000000000000566a07c3c932ae6af74d77c29e5c30d8b18537100000000000000000000000005280406912eb8ec677df66c326be48f938dc2e440000000000000000000000000275b3d54a5ddbf8205a75984796efe8b7357bae0000000000000000000000005a1fd562271aac2dadb51baab7760b949d9d81df000000000000000000000000f6b6f07862a02c85628b3a9688beae07fea9c863000000000000000000000000475816ca2a31d601b4e336f5c2418a67978abf09","executor":"0x86a02dD71363c440b21F4c0E5B2Ad01Ffe1A7482","inboxOnEthereum":"0xc4448b71118c9071Bcb9734A0EAc55D18A153949"},"raw":{"target":"0xa723C008e76E379c55599D2E4d93879BeaFDa79C","value":0,"data":"0x000000000000000000000000c4448b71118c9071bcb9734a0eac55d18a15394900000000000000000000000086a02dd71363c440b21f4c0e5b2ad01ffe1a748200000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000c000000000000000000000000000000000000000000000000000000000000002841cff79cd0000000000000000000000009bf7b8884fa381a45f8cb2525905fb36c996297a00000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000204536d8944000000000000000000000000c232ee726e3c51b86778bb4dbe61c52cc07a60f300000000000000000000000000000000000000000000000000000000000000600000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000000c0000000000000000000000003bd8e2ac65ad6f0f094ba6766cbd9484ab49ef23000000000000000000000000f8e1492255d9428c2fc20a98a1deb1215c8ffefd000000000000000000000000b07dc9103328a51128bc6cc1049d1137035f5e280000000000000000000000003e286452b1c66abb08eb5494c3894f40ab5a59af000000000000000000000000b71ca4ffbb7b58d75ba29891ab45e9dc12b444ed0000000000000000000000008f10e3413586c4a8dcfce19d009872b19e9cd8e3000000000000000000000000566a07c3c932ae6af74d77c29e5c30d8b18537100000000000000000000000005280406912eb8ec677df66c326be48f938dc2e440000000000000000000000000275b3d54a5ddbf8205a75984796efe8b7357bae0000000000000000000000005a1fd562271aac2dadb51baab7760b949d9d81df000000000000000000000000f6b6f07862a02c85628b3a9688beae07fea9c863000000000000000000000000475816ca2a31d601b4e336f5c2418a67978abf090000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000","delay":259200}},{"id":"0x4de857395557aa68ca8e4ac5c12a0a8427b39b01c33e27882d473c25ed69cd93","decoded":{"chain":"arbitrum","contractName":"SecurityCouncilMemberSyncAction","function":"perform","inputs":[{"name":"_securityCouncil","value":"0xADd68bCb0f66878aB9D37a447C7b9067C5dfa941"},{"name":"_updatedMembers","value":["0x3Bd8e2AC65ad6f0F094BA6766cBd9484AB49eF23","0xf8e1492255d9428c2Fc20A98A1DeB1215C8ffEfd","0xb07dc9103328A51128bC6Cc1049d1137035f5E28","0x3E286452b1C66abB08Eb5494c3894F40aB5a59AF","0xb71ca4FFbB7b58d75Ba29891ab45e9Dc12B444Ed","0x8F10e3413586c4a8DCfcE19D009872b19e9cd8E3","0x566a07C3c932aE6AF74d77c29e5c30D8B1853710","0x5280406912EB8Ec677Df66C326BE48f938DC2e44","0x0275b3D54a5dDbf8205A75984796eFE8b7357Bae","0x5A1FD562271aAC2Dadb51BAAb7760b949D9D81dF","0xf6B6F07862A02C85628B3A9688beae07fEA9C863","0x475816ca2a31D601B4e336f5c2418A67978aBf09"]},{"name":"_nonce","value":1}],"address":"0x9BF7b8884Fa381a45f8CB2525905fb36C996297a","calldata":"0x536d8944000000000000000000000000add68bcb0f66878ab9d37a447c7b9067c5dfa94100000000000000000000000000000000000000000000000000000000000000600000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000000c0000000000000000000000003bd8e2ac65ad6f0f094ba6766cbd9484ab49ef23000000000000000000000000f8e1492255d9428c2fc20a98a1deb1215c8ffefd000000000000000000000000b07dc9103328a51128bc6cc1049d1137035f5e280000000000000000000000003e286452b1c66abb08eb5494c3894f40ab5a59af000000000000000000000000b71ca4ffbb7b58d75ba29891ab45e9dc12b444ed0000000000000000000000008f10e3413586c4a8dcfce19d009872b19e9cd8e3000000000000000000000000566a07c3c932ae6af74d77c29e5c30d8b18537100000000000000000000000005280406912eb8ec677df66c326be48f938dc2e440000000000000000000000000275b3d54a5ddbf8205a75984796efe8b7357bae0000000000000000000000005a1fd562271aac2dadb51baab7760b949d9d81df000000000000000000000000f6b6f07862a02c85628b3a9688beae07fea9c863000000000000000000000000475816ca2a31d601b4e336f5c2418a67978abf09","executor":"0xCF57572261c7c2BCF21ffD220ea7d1a27D40A827","inboxOnEthereum":"0x4Dbd4fc535Ac27206064B68FfCf827b0A60BAB3f"},"raw":{"target":"0xa723C008e76E379c55599D2E4d93879BeaFDa79C","value":0,"data":"0x0000000000000000000000004dbd4fc535ac27206064b68ffcf827b0a60bab3f000000000000000000000000cf57572261c7c2bcf21ffd220ea7d1a27d40a82700000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000c000000000000000000000000000000000000000000000000000000000000002841cff79cd0000000000000000000000009bf7b8884fa381a45f8cb2525905fb36c996297a00000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000204536d8944000000000000000000000000add68bcb0f66878ab9d37a447c7b9067c5dfa94100000000000000000000000000000000000000000000000000000000000000600000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000000c0000000000000000000000003bd8e2ac65ad6f0f094ba6766cbd9484ab49ef23000000000000000000000000f8e1492255d9428c2fc20a98a1deb1215c8ffefd000000000000000000000000b07dc9103328a51128bc6cc1049d1137035f5e280000000000000000000000003e286452b1c66abb08eb5494c3894f40ab5a59af000000000000000000000000b71ca4ffbb7b58d75ba29891ab45e9dc12b444ed0000000000000000000000008f10e3413586c4a8dcfce19d009872b19e9cd8e3000000000000000000000000566a07c3c932ae6af74d77c29e5c30d8b18537100000000000000000000000005280406912eb8ec677df66c326be48f938dc2e440000000000000000000000000275b3d54a5ddbf8205a75984796efe8b7357bae0000000000000000000000005a1fd562271aac2dadb51baab7760b949d9d81df000000000000000000000000f6b6f07862a02c85628b3a9688beae07fea9c863000000000000000000000000475816ca2a31d601b4e336f5c2418a67978abf090000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000","delay":259200}},{"id":"0x492a8fccff029378b8566bdb6157123d1626cbfe2530a9b1f0ad5df688c10471","decoded":{"chain":"ethereum","contractName":"AddNovaKeysetAction","function":"perform","inputs":[],"address":"0xDef5CfE3246882BC7f65F9346a8b974BA27D3F4E","calldata":"0xb147f40c","executor":"0x3ffFbAdAF827559da092217e474760E2b2c3CeDd"},"raw":{"target":"0x3ffFbAdAF827559da092217e474760E2b2c3CeDd","value":0,"data":"0x1cff79cd000000000000000000000000def5cfe3246882bc7f65f9346a8b974ba27d3f4e00000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000004b147f40c00000000000000000000000000000000000000000000000000000000","delay":259200}},{"id":"0xbcda99fe98a7c479aafb3eb3eab0f154f9fdd169f28c11adf6eefda3bef7c04e","decoded":{"chain":"ethereum","contractName":"SetArbOneArbOS11ModuleRootAciton","function":"perform","inputs":[],"address":"0x3b70f2Da6F3b01F9a53dCBcB3e59AD3ad8bed924","calldata":"0xb147f40c","executor":"0x3ffFbAdAF827559da092217e474760E2b2c3CeDd"},"raw":{"target":"0x3ffFbAdAF827559da092217e474760E2b2c3CeDd","value":0,"data":"0x1cff79cd0000000000000000000000003b70f2da6f3b01f9a53dcbcb3e59ad3ad8bed92400000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000004b147f40c00000000000000000000000000000000000000000000000000000000","delay":259200}},{"id":"0xbcda99fe98a7c479aafb3eb3eab0f154f9fdd169f28c11adf6eefda3bef7c04e","decoded":{"chain":"ethereum","contractName":"SetNovaArbOS11ModuleRootAction","function":"perform","inputs":[],"address":"0x54c2C372943572Ac2a8E84D502ebc13F14B62246","calldata":"0xb147f40c","executor":"0x3ffFbAdAF827559da092217e474760E2b2c3CeDd"},"raw":{"target":"0x3ffFbAdAF827559da092217e474760E2b2c3CeDd","value":0,"data":"0x1cff79cd00000000000000000000000054c2c372943572ac2a8e84d502ebc13f14b6224600000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000004b147f40c00000000000000000000000000000000000000000000000000000000","delay":259200}},{"id":"0xbcda99fe98a7c479aafb3eb3eab0f154f9fdd169f28c11adf6eefda3bef7c04e","decoded":{"chain":"arbitrum","contractName":"SetArbOS11VersionAction","function":"perform","inputs":[],"address":"0xF6c7Dc6eaE78aBF2f32df899654ca425Dfa99481","calldata":"0xb147f40c","executor":"0xCF57572261c7c2BCF21ffD220ea7d1a27D40A827","inboxOnEthereum":"0x4Dbd4fc535Ac27206064B68FfCf827b0A60BAB3f"},"raw":{"target":"0xa723C008e76E379c55599D2E4d93879BeaFDa79C","value":0,"data":"0x0000000000000000000000004dbd4fc535ac27206064b68ffcf827b0a60bab3f000000000000000000000000cf57572261c7c2bcf21ffd220ea7d1a27d40a82700000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000c000000000000000000000000000000000000000000000000000000000000000841cff79cd000000000000000000000000f6c7dc6eae78abf2f32df899654ca425dfa9948100000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000004b147f40c0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000","delay":259200}},{"id":"0xbcda99fe98a7c479aafb3eb3eab0f154f9fdd169f28c11adf6eefda3bef7c04e","decoded":{"chain":"nova","address":"0x5357f4D3e8f8250A77bcddd5E58886AD1358220c","calldata":"0xb147f40c","executor":"0x86a02dD71363c440b21F4c0E5B2Ad01Ffe1A7482","inboxOnEthereum":"0xc4448b71118c9071Bcb9734A0EAc55D18A153949"},"raw":{"target":"0xa723C008e76E379c55599D2E4d93879BeaFDa79C","value":0,"data":"0x000000000000000000000000c4448b71118c9071bcb9734a0eac55d18a15394900000000000000000000000086a02dd71363c440b21f4c0e5b2ad01ffe1a748200000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000c000000000000000000000000000000000000000000000000000000000000000841cff79cd0000000000000000000000005357f4d3e8f8250a77bcddd5e58886ad1358220c00000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000004b147f40c0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000","delay":259200}},{"id":"0xe4f81d02f2581e9b7a8815af6925d3c277859994fde496629554989b7c91d254","decoded":{"chain":"arbitrum","contractName":"NomineeGovernorV2UpgradeAction","function":"perform","inputs":[],"address":"0xd9a2e0E5d7509F0BF1B2d33884F8C1b4D4490879","calldata":"0xb147f40c","executor":"0xCF57572261c7c2BCF21ffD220ea7d1a27D40A827","inboxOnEthereum":"0x4Dbd4fc535Ac27206064B68FfCf827b0A60BAB3f"},"raw":{"target":"0xa723C008e76E379c55599D2E4d93879BeaFDa79C","value":0,"data":"0x0000000000000000000000004dbd4fc535ac27206064b68ffcf827b0a60bab3f000000000000000000000000cf57572261c7c2bcf21ffd220ea7d1a27d40a82700000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000c000000000000000000000000000000000000000000000000000000000000000841cff79cd000000000000000000000000d9a2e0e5d7509f0bf1b2d33884f8c1b4d449087900000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000004b147f40c0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000","delay":259200}},{"id":"0x0b8dc4a8b99d2302c77e4eaeb1b06dd4038dd796bd8e5016dcb292018543ef91","decoded":{"chain":"ethereum","contractName":"AIPSetSequencerInboxMaxTimeVariationArbOneAction","function":"perform","inputs":[],"address":"0x3E313Eeed58E851CA3841C6109697B9eb35C7726","calldata":"0xb147f40c","executor":"0x3ffFbAdAF827559da092217e474760E2b2c3CeDd"},"raw":{"target":"0x3ffFbAdAF827559da092217e474760E2b2c3CeDd","value":0,"data":"0x1cff79cd0000000000000000000000003e313eeed58e851ca3841c6109697b9eb35c772600000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000004b147f40c00000000000000000000000000000000000000000000000000000000","delay":259200}},{"id":"0x0b8dc4a8b99d2302c77e4eaeb1b06dd4038dd796bd8e5016dcb292018543ef91","decoded":{"chain":"ethereum","contractName":"AIPSetSequencerInboxMaxTimeVariationNovaAction","function":"perform","inputs":[],"address":"0x47a85C0a118127F3968A6A1A61e2a326517540D4","calldata":"0xb147f40c","executor":"0x3ffFbAdAF827559da092217e474760E2b2c3CeDd"},"raw":{"target":"0x3ffFbAdAF827559da092217e474760E2b2c3CeDd","value":0,"data":"0x1cff79cd00000000000000000000000047a85c0a118127f3968a6a1a61e2a326517540d400000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000004b147f40c00000000000000000000000000000000000000000000000000000000","delay":259200}},{"id":"0x0b8dc4a8b99d2302c77e4eaeb1b06dd4038dd796bd8e5016dcb292018543ef91","decoded":{"chain":"ethereum","contractName":"ArbOneAIP4844Action","function":"perform","inputs":[],"address":"0x76D8e97Cd4514bebBc21d2044fF4a8d9eA1f0CC4","calldata":"0xb147f40c","executor":"0x3ffFbAdAF827559da092217e474760E2b2c3CeDd"},"raw":{"target":"0x3ffFbAdAF827559da092217e474760E2b2c3CeDd","value":0,"data":"0x1cff79cd00000000000000000000000076d8e97cd4514bebbc21d2044ff4a8d9ea1f0cc400000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000004b147f40c00000000000000000000000000000000000000000000000000000000","delay":259200}},{"id":"0x0b8dc4a8b99d2302c77e4eaeb1b06dd4038dd796bd8e5016dcb292018543ef91","decoded":{"chain":"ethereum","contractName":"ArbOneSetBatchPosterManagerAction","function":"perform","inputs":[],"address":"0xCe0aF261EB511CB41b8D0A2e31DF80BA37e265aB","calldata":"0xb147f40c","executor":"0x3ffFbAdAF827559da092217e474760E2b2c3CeDd"},"raw":{"target":"0x3ffFbAdAF827559da092217e474760E2b2c3CeDd","value":0,"data":"0x1cff79cd000000000000000000000000ce0af261eb511cb41b8d0a2e31df80ba37e265ab00000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000004b147f40c00000000000000000000000000000000000000000000000000000000","delay":259200}},{"id":"0x0b8dc4a8b99d2302c77e4eaeb1b06dd4038dd796bd8e5016dcb292018543ef91","decoded":{"chain":"ethereum","contractName":"NovaAIP4844Action","function":"perform","inputs":[],"address":"0x874356173CFd6C739aeab1F5ABfB5F3AFB3d4d33","calldata":"0xb147f40c","executor":"0x3ffFbAdAF827559da092217e474760E2b2c3CeDd"},"raw":{"target":"0x3ffFbAdAF827559da092217e474760E2b2c3CeDd","value":0,"data":"0x1cff79cd000000000000000000000000874356173cfd6c739aeab1f5abfb5f3afb3d4d3300000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000004b147f40c00000000000000000000000000000000000000000000000000000000","delay":259200}},{"id":"0x0b8dc4a8b99d2302c77e4eaeb1b06dd4038dd796bd8e5016dcb292018543ef91","decoded":{"chain":"ethereum","contractName":"NovaSetBatchPosterManagerAction","function":"perform","inputs":[],"address":"0x501f30810D2b0EaEC15Cc3785dBB29e4a8a92a70","calldata":"0xb147f40c","executor":"0x3ffFbAdAF827559da092217e474760E2b2c3CeDd"},"raw":{"target":"0x3ffFbAdAF827559da092217e474760E2b2c3CeDd","value":0,"data":"0x1cff79cd000000000000000000000000501f30810d2b0eaec15cc3785dbb29e4a8a92a7000000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000004b147f40c00000000000000000000000000000000000000000000000000000000","delay":259200}},{"id":"0x0b8dc4a8b99d2302c77e4eaeb1b06dd4038dd796bd8e5016dcb292018543ef91","decoded":{"chain":"arbitrum","contractName":"SetArbOS20VersionAction","function":"perform","inputs":[],"address":"0x3E313Eeed58E851CA3841C6109697B9eb35C7726","calldata":"0xb147f40c","executor":"0xCF57572261c7c2BCF21ffD220ea7d1a27D40A827","inboxOnEthereum":"0x4Dbd4fc535Ac27206064B68FfCf827b0A60BAB3f"},"raw":{"target":"0xa723C008e76E379c55599D2E4d93879BeaFDa79C","value":0,"data":"0x0000000000000000000000004dbd4fc535ac27206064b68ffcf827b0a60bab3f000000000000000000000000cf57572261c7c2bcf21ffd220ea7d1a27d40a82700000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000c000000000000000000000000000000000000000000000000000000000000000841cff79cd0000000000000000000000003e313eeed58e851ca3841c6109697b9eb35c772600000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000004b147f40c0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000","delay":259200}},{"id":"0x0b8dc4a8b99d2302c77e4eaeb1b06dd4038dd796bd8e5016dcb292018543ef91","decoded":{"chain":"nova","address":"0x3E313Eeed58E851CA3841C6109697B9eb35C7726","calldata":"0xb147f40c","executor":"0x86a02dD71363c440b21F4c0E5B2Ad01Ffe1A7482","inboxOnEthereum":"0xc4448b71118c9071Bcb9734A0EAc55D18A153949"},"raw":{"target":"0xa723C008e76E379c55599D2E4d93879BeaFDa79C","value":0,"data":"0x000000000000000000000000c4448b71118c9071bcb9734a0eac55d18a15394900000000000000000000000086a02dd71363c440b21f4c0e5b2ad01ffe1a748200000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000c000000000000000000000000000000000000000000000000000000000000000841cff79cd0000000000000000000000003e313eeed58e851ca3841c6109697b9eb35c772600000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000004b147f40c0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000","delay":259200}},{"id":"0xdda98e62c0827b0ea976efa9fa7eab4086f6ecc5aa6715e02868bb2972b12cad","decoded":{"chain":"arbitrum","contractName":"ArbOneSetAtlasL1PricingRewardAction","function":"perform","inputs":[],"address":"0x36D0170D92F66e8949eB276C3AC4FEA64f83704d","calldata":"0xb147f40c","executor":"0xCF57572261c7c2BCF21ffD220ea7d1a27D40A827","inboxOnEthereum":"0x4Dbd4fc535Ac27206064B68FfCf827b0A60BAB3f"},"raw":{"target":"0xa723C008e76E379c55599D2E4d93879BeaFDa79C","value":0,"data":"0x0000000000000000000000004dbd4fc535ac27206064b68ffcf827b0a60bab3f000000000000000000000000cf57572261c7c2bcf21ffd220ea7d1a27d40a82700000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000c000000000000000000000000000000000000000000000000000000000000000841cff79cd00000000000000000000000036d0170d92f66e8949eb276c3ac4fea64f83704d00000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000004b147f40c0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000","delay":259200}},{"id":"0xdda98e62c0827b0ea976efa9fa7eab4086f6ecc5aa6715e02868bb2972b12cad","decoded":{"chain":"arbitrum","contractName":"ArbOneSetAtlasMinBaseFeeAction","function":"perform","inputs":[],"address":"0x849E360a247132F961c9CBE95Ba39106c72e1268","calldata":"0xb147f40c","executor":"0xCF57572261c7c2BCF21ffD220ea7d1a27D40A827","inboxOnEthereum":"0x4Dbd4fc535Ac27206064B68FfCf827b0A60BAB3f"},"raw":{"target":"0xa723C008e76E379c55599D2E4d93879BeaFDa79C","value":0,"data":"0x0000000000000000000000004dbd4fc535ac27206064b68ffcf827b0a60bab3f000000000000000000000000cf57572261c7c2bcf21ffd220ea7d1a27d40a82700000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000c000000000000000000000000000000000000000000000000000000000000000841cff79cd000000000000000000000000849e360a247132f961c9cbe95ba39106c72e126800000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000004b147f40c0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000","delay":259200}},{"id":"0xd1eea9e87f3c665209dcd7f963295df40e79119668d6417794d36891994a3bad","decoded":{"chain":"ethereum","contractName":"SecurityCouncilMemberSyncAction","function":"perform","inputs":[{"name":"_securityCouncil","value":"0xF06E95eF589D9c38af242a8AAee8375f14023F85"},{"name":"_updatedMembers","value":["0x3Bd8e2AC65ad6f0F094BA6766cBd9484AB49eF23","0xf8e1492255d9428c2Fc20A98A1DeB1215C8ffEfd","0xb07dc9103328A51128bC6Cc1049d1137035f5E28","0x3E286452b1C66abB08Eb5494c3894F40aB5a59AF","0xb71ca4FFbB7b58d75Ba29891ab45e9Dc12B444Ed","0x8F10e3413586c4a8DCfcE19D009872b19e9cd8E3","0xe40D80Bd58CEE55DCC2598724d7F1e03E206581D","0xB3b60932E598fe946169EC209A197184Bad760B7","0xee7Fb91D5b776C326a728dc70e917F82d6809E3C","0x475816ca2a31D601B4e336f5c2418A67978aBf09","0xa0683d725420e2F75415806352Cd9c3fE10Fa960","0x0275b3D54a5dDbf8205A75984796eFE8b7357Bae"]},{"name":"_nonce","value":2}],"address":"0x9BF7b8884Fa381a45f8CB2525905fb36C996297a","calldata":"0x536d8944000000000000000000000000f06e95ef589d9c38af242a8aaee8375f14023f8500000000000000000000000000000000000000000000000000000000000000600000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000000c0000000000000000000000003bd8e2ac65ad6f0f094ba6766cbd9484ab49ef23000000000000000000000000f8e1492255d9428c2fc20a98a1deb1215c8ffefd000000000000000000000000b07dc9103328a51128bc6cc1049d1137035f5e280000000000000000000000003e286452b1c66abb08eb5494c3894f40ab5a59af000000000000000000000000b71ca4ffbb7b58d75ba29891ab45e9dc12b444ed0000000000000000000000008f10e3413586c4a8dcfce19d009872b19e9cd8e3000000000000000000000000e40d80bd58cee55dcc2598724d7f1e03e206581d000000000000000000000000b3b60932e598fe946169ec209a197184bad760b7000000000000000000000000ee7fb91d5b776c326a728dc70e917f82d6809e3c000000000000000000000000475816ca2a31d601b4e336f5c2418a67978abf09000000000000000000000000a0683d725420e2f75415806352cd9c3fe10fa9600000000000000000000000000275b3d54a5ddbf8205a75984796efe8b7357bae","executor":"0x3ffFbAdAF827559da092217e474760E2b2c3CeDd"},"raw":{"target":"0x3ffFbAdAF827559da092217e474760E2b2c3CeDd","value":0,"data":"0x1cff79cd0000000000000000000000009bf7b8884fa381a45f8cb2525905fb36c996297a00000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000204536d8944000000000000000000000000f06e95ef589d9c38af242a8aaee8375f14023f8500000000000000000000000000000000000000000000000000000000000000600000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000000c0000000000000000000000003bd8e2ac65ad6f0f094ba6766cbd9484ab49ef23000000000000000000000000f8e1492255d9428c2fc20a98a1deb1215c8ffefd000000000000000000000000b07dc9103328a51128bc6cc1049d1137035f5e280000000000000000000000003e286452b1c66abb08eb5494c3894f40ab5a59af000000000000000000000000b71ca4ffbb7b58d75ba29891ab45e9dc12b444ed0000000000000000000000008f10e3413586c4a8dcfce19d009872b19e9cd8e3000000000000000000000000e40d80bd58cee55dcc2598724d7f1e03e206581d000000000000000000000000b3b60932e598fe946169ec209a197184bad760b7000000000000000000000000ee7fb91d5b776c326a728dc70e917f82d6809e3c000000000000000000000000475816ca2a31d601b4e336f5c2418a67978abf09000000000000000000000000a0683d725420e2f75415806352cd9c3fe10fa9600000000000000000000000000275b3d54a5ddbf8205a75984796efe8b7357bae00000000000000000000000000000000000000000000000000000000","delay":259200}},{"id":"0xd1eea9e87f3c665209dcd7f963295df40e79119668d6417794d36891994a3bad","decoded":{"chain":"arbitrum","contractName":"SecurityCouncilMemberSyncAction","function":"perform","inputs":[{"name":"_securityCouncil","value":"0x423552c0F05baCCac5Bfa91C6dCF1dc53a0A1641"},{"name":"_updatedMembers","value":["0x3Bd8e2AC65ad6f0F094BA6766cBd9484AB49eF23","0xf8e1492255d9428c2Fc20A98A1DeB1215C8ffEfd","0xb07dc9103328A51128bC6Cc1049d1137035f5E28","0x3E286452b1C66abB08Eb5494c3894F40aB5a59AF","0xb71ca4FFbB7b58d75Ba29891ab45e9Dc12B444Ed","0x8F10e3413586c4a8DCfcE19D009872b19e9cd8E3","0xe40D80Bd58CEE55DCC2598724d7F1e03E206581D","0xB3b60932E598fe946169EC209A197184Bad760B7","0xee7Fb91D5b776C326a728dc70e917F82d6809E3C","0x475816ca2a31D601B4e336f5c2418A67978aBf09","0xa0683d725420e2F75415806352Cd9c3fE10Fa960","0x0275b3D54a5dDbf8205A75984796eFE8b7357Bae"]},{"name":"_nonce","value":2}],"address":"0x9BF7b8884Fa381a45f8CB2525905fb36C996297a","calldata":"0x536d8944000000000000000000000000423552c0f05baccac5bfa91c6dcf1dc53a0a164100000000000000000000000000000000000000000000000000000000000000600000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000000c0000000000000000000000003bd8e2ac65ad6f0f094ba6766cbd9484ab49ef23000000000000000000000000f8e1492255d9428c2fc20a98a1deb1215c8ffefd000000000000000000000000b07dc9103328a51128bc6cc1049d1137035f5e280000000000000000000000003e286452b1c66abb08eb5494c3894f40ab5a59af000000000000000000000000b71ca4ffbb7b58d75ba29891ab45e9dc12b444ed0000000000000000000000008f10e3413586c4a8dcfce19d009872b19e9cd8e3000000000000000000000000e40d80bd58cee55dcc2598724d7f1e03e206581d000000000000000000000000b3b60932e598fe946169ec209a197184bad760b7000000000000000000000000ee7fb91d5b776c326a728dc70e917f82d6809e3c000000000000000000000000475816ca2a31d601b4e336f5c2418a67978abf09000000000000000000000000a0683d725420e2f75415806352cd9c3fe10fa9600000000000000000000000000275b3d54a5ddbf8205a75984796efe8b7357bae","executor":"0xCF57572261c7c2BCF21ffD220ea7d1a27D40A827","inboxOnEthereum":"0x4Dbd4fc535Ac27206064B68FfCf827b0A60BAB3f"},"raw":{"target":"0xa723C008e76E379c55599D2E4d93879BeaFDa79C","value":0,"data":"0x0000000000000000000000004dbd4fc535ac27206064b68ffcf827b0a60bab3f000000000000000000000000cf57572261c7c2bcf21ffd220ea7d1a27d40a82700000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000c000000000000000000000000000000000000000000000000000000000000002841cff79cd0000000000000000000000009bf7b8884fa381a45f8cb2525905fb36c996297a00000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000204536d8944000000000000000000000000423552c0f05baccac5bfa91c6dcf1dc53a0a164100000000000000000000000000000000000000000000000000000000000000600000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000000c0000000000000000000000003bd8e2ac65ad6f0f094ba6766cbd9484ab49ef23000000000000000000000000f8e1492255d9428c2fc20a98a1deb1215c8ffefd000000000000000000000000b07dc9103328a51128bc6cc1049d1137035f5e280000000000000000000000003e286452b1c66abb08eb5494c3894f40ab5a59af000000000000000000000000b71ca4ffbb7b58d75ba29891ab45e9dc12b444ed0000000000000000000000008f10e3413586c4a8dcfce19d009872b19e9cd8e3000000000000000000000000e40d80bd58cee55dcc2598724d7f1e03e206581d000000000000000000000000b3b60932e598fe946169ec209a197184bad760b7000000000000000000000000ee7fb91d5b776c326a728dc70e917f82d6809e3c000000000000000000000000475816ca2a31d601b4e336f5c2418a67978abf09000000000000000000000000a0683d725420e2f75415806352cd9c3fe10fa9600000000000000000000000000275b3d54a5ddbf8205a75984796efe8b7357bae0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000","delay":259200}},{"id":"0xd1eea9e87f3c665209dcd7f963295df40e79119668d6417794d36891994a3bad","decoded":{"chain":"nova","address":"0x9BF7b8884Fa381a45f8CB2525905fb36C996297a","calldata":"0x536d8944000000000000000000000000c232ee726e3c51b86778bb4dbe61c52cc07a60f300000000000000000000000000000000000000000000000000000000000000600000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000000c0000000000000000000000003bd8e2ac65ad6f0f094ba6766cbd9484ab49ef23000000000000000000000000f8e1492255d9428c2fc20a98a1deb1215c8ffefd000000000000000000000000b07dc9103328a51128bc6cc1049d1137035f5e280000000000000000000000003e286452b1c66abb08eb5494c3894f40ab5a59af000000000000000000000000b71ca4ffbb7b58d75ba29891ab45e9dc12b444ed0000000000000000000000008f10e3413586c4a8dcfce19d009872b19e9cd8e3000000000000000000000000e40d80bd58cee55dcc2598724d7f1e03e206581d000000000000000000000000b3b60932e598fe946169ec209a197184bad760b7000000000000000000000000ee7fb91d5b776c326a728dc70e917f82d6809e3c000000000000000000000000475816ca2a31d601b4e336f5c2418a67978abf09000000000000000000000000a0683d725420e2f75415806352cd9c3fe10fa9600000000000000000000000000275b3d54a5ddbf8205a75984796efe8b7357bae","executor":"0x86a02dD71363c440b21F4c0E5B2Ad01Ffe1A7482","inboxOnEthereum":"0xc4448b71118c9071Bcb9734A0EAc55D18A153949"},"raw":{"target":"0xa723C008e76E379c55599D2E4d93879BeaFDa79C","value":0,"data":"0x000000000000000000000000c4448b71118c9071bcb9734a0eac55d18a15394900000000000000000000000086a02dd71363c440b21f4c0e5b2ad01ffe1a748200000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000c000000000000000000000000000000000000000000000000000000000000002841cff79cd0000000000000000000000009bf7b8884fa381a45f8cb2525905fb36c996297a00000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000204536d8944000000000000000000000000c232ee726e3c51b86778bb4dbe61c52cc07a60f300000000000000000000000000000000000000000000000000000000000000600000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000000c0000000000000000000000003bd8e2ac65ad6f0f094ba6766cbd9484ab49ef23000000000000000000000000f8e1492255d9428c2fc20a98a1deb1215c8ffefd000000000000000000000000b07dc9103328a51128bc6cc1049d1137035f5e280000000000000000000000003e286452b1c66abb08eb5494c3894f40ab5a59af000000000000000000000000b71ca4ffbb7b58d75ba29891ab45e9dc12b444ed0000000000000000000000008f10e3413586c4a8dcfce19d009872b19e9cd8e3000000000000000000000000e40d80bd58cee55dcc2598724d7f1e03e206581d000000000000000000000000b3b60932e598fe946169ec209a197184bad760b7000000000000000000000000ee7fb91d5b776c326a728dc70e917f82d6809e3c000000000000000000000000475816ca2a31d601b4e336f5c2418a67978abf09000000000000000000000000a0683d725420e2f75415806352cd9c3fe10fa9600000000000000000000000000275b3d54a5ddbf8205a75984796efe8b7357bae0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000","delay":259200}},{"id":"0xd1eea9e87f3c665209dcd7f963295df40e79119668d6417794d36891994a3bad","decoded":{"chain":"arbitrum","contractName":"SecurityCouncilMemberSyncAction","function":"perform","inputs":[{"name":"_securityCouncil","value":"0xADd68bCb0f66878aB9D37a447C7b9067C5dfa941"},{"name":"_updatedMembers","value":["0x3Bd8e2AC65ad6f0F094BA6766cBd9484AB49eF23","0xf8e1492255d9428c2Fc20A98A1DeB1215C8ffEfd","0xb07dc9103328A51128bC6Cc1049d1137035f5E28","0x3E286452b1C66abB08Eb5494c3894F40aB5a59AF","0xb71ca4FFbB7b58d75Ba29891ab45e9Dc12B444Ed","0x8F10e3413586c4a8DCfcE19D009872b19e9cd8E3","0xe40D80Bd58CEE55DCC2598724d7F1e03E206581D","0xB3b60932E598fe946169EC209A197184Bad760B7","0xee7Fb91D5b776C326a728dc70e917F82d6809E3C","0x475816ca2a31D601B4e336f5c2418A67978aBf09","0xa0683d725420e2F75415806352Cd9c3fE10Fa960","0x0275b3D54a5dDbf8205A75984796eFE8b7357Bae"]},{"name":"_nonce","value":2}],"address":"0x9BF7b8884Fa381a45f8CB2525905fb36C996297a","calldata":"0x536d8944000000000000000000000000add68bcb0f66878ab9d37a447c7b9067c5dfa94100000000000000000000000000000000000000000000000000000000000000600000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000000c0000000000000000000000003bd8e2ac65ad6f0f094ba6766cbd9484ab49ef23000000000000000000000000f8e1492255d9428c2fc20a98a1deb1215c8ffefd000000000000000000000000b07dc9103328a51128bc6cc1049d1137035f5e280000000000000000000000003e286452b1c66abb08eb5494c3894f40ab5a59af000000000000000000000000b71ca4ffbb7b58d75ba29891ab45e9dc12b444ed0000000000000000000000008f10e3413586c4a8dcfce19d009872b19e9cd8e3000000000000000000000000e40d80bd58cee55dcc2598724d7f1e03e206581d000000000000000000000000b3b60932e598fe946169ec209a197184bad760b7000000000000000000000000ee7fb91d5b776c326a728dc70e917f82d6809e3c000000000000000000000000475816ca2a31d601b4e336f5c2418a67978abf09000000000000000000000000a0683d725420e2f75415806352cd9c3fe10fa9600000000000000000000000000275b3d54a5ddbf8205a75984796efe8b7357bae","executor":"0xCF57572261c7c2BCF21ffD220ea7d1a27D40A827","inboxOnEthereum":"0x4Dbd4fc535Ac27206064B68FfCf827b0A60BAB3f"},"raw":{"target":"0xa723C008e76E379c55599D2E4d93879BeaFDa79C","value":0,"data":"0x0000000000000000000000004dbd4fc535ac27206064b68ffcf827b0a60bab3f000000000000000000000000cf57572261c7c2bcf21ffd220ea7d1a27d40a82700000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000c000000000000000000000000000000000000000000000000000000000000002841cff79cd0000000000000000000000009bf7b8884fa381a45f8cb2525905fb36c996297a00000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000204536d8944000000000000000000000000add68bcb0f66878ab9d37a447c7b9067c5dfa94100000000000000000000000000000000000000000000000000000000000000600000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000000c0000000000000000000000003bd8e2ac65ad6f0f094ba6766cbd9484ab49ef23000000000000000000000000f8e1492255d9428c2fc20a98a1deb1215c8ffefd000000000000000000000000b07dc9103328a51128bc6cc1049d1137035f5e280000000000000000000000003e286452b1c66abb08eb5494c3894f40ab5a59af000000000000000000000000b71ca4ffbb7b58d75ba29891ab45e9dc12b444ed0000000000000000000000008f10e3413586c4a8dcfce19d009872b19e9cd8e3000000000000000000000000e40d80bd58cee55dcc2598724d7f1e03e206581d000000000000000000000000b3b60932e598fe946169ec209a197184bad760b7000000000000000000000000ee7fb91d5b776c326a728dc70e917f82d6809e3c000000000000000000000000475816ca2a31d601b4e336f5c2418a67978abf09000000000000000000000000a0683d725420e2f75415806352cd9c3fe10fa9600000000000000000000000000275b3d54a5ddbf8205a75984796efe8b7357bae0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000","delay":259200}},{"id":"0x1f8af0aacf32f1bedd2ad0a5527055a13adcb894deeeb123c9495811dac3f5d9","decoded":{"chain":"arbitrum","contractName":"AIPIncreaseNonEmergencySCThresholdAction","function":"perform","inputs":[],"address":"0x25afB879bb5364cB3f7e0b607AD280C0F52B0D82","calldata":"0xb147f40c","executor":"0xCF57572261c7c2BCF21ffD220ea7d1a27D40A827","inboxOnEthereum":"0x4Dbd4fc535Ac27206064B68FfCf827b0A60BAB3f"},"raw":{"target":"0xa723C008e76E379c55599D2E4d93879BeaFDa79C","value":0,"data":"0x0000000000000000000000004dbd4fc535ac27206064b68ffcf827b0a60bab3f000000000000000000000000cf57572261c7c2bcf21ffd220ea7d1a27d40a82700000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000c000000000000000000000000000000000000000000000000000000000000000841cff79cd00000000000000000000000025afb879bb5364cb3f7e0b607ad280c0f52b0d8200000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000004b147f40c0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000","delay":259200}}]
      errors:
-        {"scheduledTransactions":"Assertion Error: Unknown chain: arbitrum"}
    }
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20124808 (main branch discovery), not current.

```diff
    contract L1ArbitrumTimelock (0xE6841D92B0C345144506576eC13ECf5103aC7f49) {
    +++ description: None
      values.scheduledTransactions:
-        [{"id":"0x85368b7ca2ee99b3d479ddff6298f69f0ce7d35227a731b70e8bc689074ba0af","decoded":{"chain":"arbitrum","contractName":"AIP1Point2Action","function":"perform","inputs":[],"address":"0x6274106eedD4848371D2C09e0352d67B795ED516","calldata":"0xb147f40c","executor":"0xCF57572261c7c2BCF21ffD220ea7d1a27D40A827","inboxOnEthereum":"0x4Dbd4fc535Ac27206064B68FfCf827b0A60BAB3f"},"raw":{"target":"0xa723C008e76E379c55599D2E4d93879BeaFDa79C","value":0,"data":"0x0000000000000000000000004dbd4fc535ac27206064b68ffcf827b0a60bab3f000000000000000000000000cf57572261c7c2bcf21ffd220ea7d1a27d40a82700000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000c000000000000000000000000000000000000000000000000000000000000000841cff79cd0000000000000000000000006274106eedd4848371d2c09e0352d67b795ed51600000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000004b147f40c0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000","delay":259200}},{"id":"0x6f801c57f0acf08c9688585c8b1cbb4b36f7053267befee7b2ee996b58592f2f","decoded":{"chain":"arbitrum","contractName":"AIP4Action","function":"perform","inputs":[],"address":"0x85792f6BF346e3Bfd3A275318aDd2c44A1058447","calldata":"0xb147f40c","executor":"0xCF57572261c7c2BCF21ffD220ea7d1a27D40A827","inboxOnEthereum":"0x4Dbd4fc535Ac27206064B68FfCf827b0A60BAB3f"},"raw":{"target":"0xa723C008e76E379c55599D2E4d93879BeaFDa79C","value":0,"data":"0x0000000000000000000000004dbd4fc535ac27206064b68ffcf827b0a60bab3f000000000000000000000000cf57572261c7c2bcf21ffd220ea7d1a27d40a82700000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000c000000000000000000000000000000000000000000000000000000000000000841cff79cd00000000000000000000000085792f6bf346e3bfd3a275318add2c44a105844700000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000004b147f40c0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000","delay":259200}},{"id":"0x0a0e8ebc47cd2cc5c020dc6a52e1c0c349165c7133547d811956c973e6b03ee2","decoded":{"chain":"ethereum","contractName":"L1SCMgmtActivationAction","function":"perform","inputs":[],"address":"0x22EC545357162C342F643bDdb2eD4c3FB6B42eb0","calldata":"0xb147f40c","executor":"0x3ffFbAdAF827559da092217e474760E2b2c3CeDd"},"raw":{"target":"0x3ffFbAdAF827559da092217e474760E2b2c3CeDd","value":0,"data":"0x1cff79cd00000000000000000000000022ec545357162c342f643bddb2ed4c3fb6b42eb000000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000004b147f40c00000000000000000000000000000000000000000000000000000000","delay":259200}},{"id":"0x0a0e8ebc47cd2cc5c020dc6a52e1c0c349165c7133547d811956c973e6b03ee2","decoded":{"chain":"arbitrum","contractName":"GovernanceChainSCMgmtActivationAction","function":"perform","inputs":[],"address":"0x1015c1Ae166C4C39D18a1151b7029bAC1530c9aa","calldata":"0xb147f40c","executor":"0xCF57572261c7c2BCF21ffD220ea7d1a27D40A827","inboxOnEthereum":"0x4Dbd4fc535Ac27206064B68FfCf827b0A60BAB3f"},"raw":{"target":"0xa723C008e76E379c55599D2E4d93879BeaFDa79C","value":0,"data":"0x0000000000000000000000004dbd4fc535ac27206064b68ffcf827b0a60bab3f000000000000000000000000cf57572261c7c2bcf21ffd220ea7d1a27d40a82700000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000c000000000000000000000000000000000000000000000000000000000000000841cff79cd0000000000000000000000001015c1ae166c4c39d18a1151b7029bac1530c9aa00000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000004b147f40c0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000","delay":259200}},{"id":"0x0a0e8ebc47cd2cc5c020dc6a52e1c0c349165c7133547d811956c973e6b03ee2","decoded":{"chain":"nova","address":"0x22EC545357162C342F643bDdb2eD4c3FB6B42eb0","calldata":"0xb147f40c","executor":"0x86a02dD71363c440b21F4c0E5B2Ad01Ffe1A7482","inboxOnEthereum":"0xc4448b71118c9071Bcb9734A0EAc55D18A153949"},"raw":{"target":"0xa723C008e76E379c55599D2E4d93879BeaFDa79C","value":0,"data":"0x000000000000000000000000c4448b71118c9071bcb9734a0eac55d18a15394900000000000000000000000086a02dd71363c440b21f4c0e5b2ad01ffe1a748200000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000c000000000000000000000000000000000000000000000000000000000000000841cff79cd00000000000000000000000022ec545357162c342f643bddb2ed4c3fb6b42eb000000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000004b147f40c0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000","delay":259200}},{"id":"0x57ae5d951014e5b6dad9718af7c1b2fd41172f8957de355c15fbdd9a6e28395f","decoded":{"chain":"arbitrum","contractName":"UpdateGasChargeAction","function":"perform","inputs":[],"address":"0x7B1247f443359d1447Cf25e73380Bc9b99F2628f","calldata":"0xb147f40c","executor":"0xCF57572261c7c2BCF21ffD220ea7d1a27D40A827","inboxOnEthereum":"0x4Dbd4fc535Ac27206064B68FfCf827b0A60BAB3f"},"raw":{"target":"0xa723C008e76E379c55599D2E4d93879BeaFDa79C","value":0,"data":"0x0000000000000000000000004dbd4fc535ac27206064b68ffcf827b0a60bab3f000000000000000000000000cf57572261c7c2bcf21ffd220ea7d1a27d40a82700000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000c000000000000000000000000000000000000000000000000000000000000000841cff79cd0000000000000000000000007b1247f443359d1447cf25e73380bc9b99f2628f00000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000004b147f40c0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000","delay":259200}},{"id":"0x57ae5d951014e5b6dad9718af7c1b2fd41172f8957de355c15fbdd9a6e28395f","decoded":{"chain":"arbitrum","contractName":"SetSweepReceiverAction","function":"perform","inputs":[],"address":"0xBabA4DAf5800B9746f58C724F05E03880850D578","calldata":"0xb147f40c","executor":"0xCF57572261c7c2BCF21ffD220ea7d1a27D40A827","inboxOnEthereum":"0x4Dbd4fc535Ac27206064B68FfCf827b0A60BAB3f"},"raw":{"target":"0xa723C008e76E379c55599D2E4d93879BeaFDa79C","value":0,"data":"0x0000000000000000000000004dbd4fc535ac27206064b68ffcf827b0a60bab3f000000000000000000000000cf57572261c7c2bcf21ffd220ea7d1a27d40a82700000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000c000000000000000000000000000000000000000000000000000000000000000841cff79cd000000000000000000000000baba4daf5800b9746f58c724f05e03880850d57800000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000004b147f40c0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000","delay":259200}},{"id":"0x57ae5d951014e5b6dad9718af7c1b2fd41172f8957de355c15fbdd9a6e28395f","decoded":{"chain":"ethereum","contractName":"UpdateL1CoreTimelockAction","function":"perform","inputs":[],"address":"0xBabA4DAf5800B9746f58C724F05E03880850D578","calldata":"0xb147f40c","executor":"0x3ffFbAdAF827559da092217e474760E2b2c3CeDd"},"raw":{"target":"0x3ffFbAdAF827559da092217e474760E2b2c3CeDd","value":0,"data":"0x1cff79cd000000000000000000000000baba4daf5800b9746f58c724f05e03880850d57800000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000004b147f40c00000000000000000000000000000000000000000000000000000000","delay":259200}},{"id":"0x4de857395557aa68ca8e4ac5c12a0a8427b39b01c33e27882d473c25ed69cd93","decoded":{"chain":"ethereum","contractName":"SecurityCouncilMemberSyncAction","function":"perform","inputs":[{"name":"_securityCouncil","value":"0xF06E95eF589D9c38af242a8AAee8375f14023F85"},{"name":"_updatedMembers","value":["0x3Bd8e2AC65ad6f0F094BA6766cBd9484AB49eF23","0xf8e1492255d9428c2Fc20A98A1DeB1215C8ffEfd","0xb07dc9103328A51128bC6Cc1049d1137035f5E28","0x3E286452b1C66abB08Eb5494c3894F40aB5a59AF","0xb71ca4FFbB7b58d75Ba29891ab45e9Dc12B444Ed","0x8F10e3413586c4a8DCfcE19D009872b19e9cd8E3","0x566a07C3c932aE6AF74d77c29e5c30D8B1853710","0x5280406912EB8Ec677Df66C326BE48f938DC2e44","0x0275b3D54a5dDbf8205A75984796eFE8b7357Bae","0x5A1FD562271aAC2Dadb51BAAb7760b949D9D81dF","0xf6B6F07862A02C85628B3A9688beae07fEA9C863","0x475816ca2a31D601B4e336f5c2418A67978aBf09"]},{"name":"_nonce","value":1}],"address":"0x9BF7b8884Fa381a45f8CB2525905fb36C996297a","calldata":"0x536d8944000000000000000000000000f06e95ef589d9c38af242a8aaee8375f14023f8500000000000000000000000000000000000000000000000000000000000000600000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000000c0000000000000000000000003bd8e2ac65ad6f0f094ba6766cbd9484ab49ef23000000000000000000000000f8e1492255d9428c2fc20a98a1deb1215c8ffefd000000000000000000000000b07dc9103328a51128bc6cc1049d1137035f5e280000000000000000000000003e286452b1c66abb08eb5494c3894f40ab5a59af000000000000000000000000b71ca4ffbb7b58d75ba29891ab45e9dc12b444ed0000000000000000000000008f10e3413586c4a8dcfce19d009872b19e9cd8e3000000000000000000000000566a07c3c932ae6af74d77c29e5c30d8b18537100000000000000000000000005280406912eb8ec677df66c326be48f938dc2e440000000000000000000000000275b3d54a5ddbf8205a75984796efe8b7357bae0000000000000000000000005a1fd562271aac2dadb51baab7760b949d9d81df000000000000000000000000f6b6f07862a02c85628b3a9688beae07fea9c863000000000000000000000000475816ca2a31d601b4e336f5c2418a67978abf09","executor":"0x3ffFbAdAF827559da092217e474760E2b2c3CeDd"},"raw":{"target":"0x3ffFbAdAF827559da092217e474760E2b2c3CeDd","value":0,"data":"0x1cff79cd0000000000000000000000009bf7b8884fa381a45f8cb2525905fb36c996297a00000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000204536d8944000000000000000000000000f06e95ef589d9c38af242a8aaee8375f14023f8500000000000000000000000000000000000000000000000000000000000000600000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000000c0000000000000000000000003bd8e2ac65ad6f0f094ba6766cbd9484ab49ef23000000000000000000000000f8e1492255d9428c2fc20a98a1deb1215c8ffefd000000000000000000000000b07dc9103328a51128bc6cc1049d1137035f5e280000000000000000000000003e286452b1c66abb08eb5494c3894f40ab5a59af000000000000000000000000b71ca4ffbb7b58d75ba29891ab45e9dc12b444ed0000000000000000000000008f10e3413586c4a8dcfce19d009872b19e9cd8e3000000000000000000000000566a07c3c932ae6af74d77c29e5c30d8b18537100000000000000000000000005280406912eb8ec677df66c326be48f938dc2e440000000000000000000000000275b3d54a5ddbf8205a75984796efe8b7357bae0000000000000000000000005a1fd562271aac2dadb51baab7760b949d9d81df000000000000000000000000f6b6f07862a02c85628b3a9688beae07fea9c863000000000000000000000000475816ca2a31d601b4e336f5c2418a67978abf0900000000000000000000000000000000000000000000000000000000","delay":259200}},{"id":"0x4de857395557aa68ca8e4ac5c12a0a8427b39b01c33e27882d473c25ed69cd93","decoded":{"chain":"arbitrum","contractName":"SecurityCouncilMemberSyncAction","function":"perform","inputs":[{"name":"_securityCouncil","value":"0x423552c0F05baCCac5Bfa91C6dCF1dc53a0A1641"},{"name":"_updatedMembers","value":["0x3Bd8e2AC65ad6f0F094BA6766cBd9484AB49eF23","0xf8e1492255d9428c2Fc20A98A1DeB1215C8ffEfd","0xb07dc9103328A51128bC6Cc1049d1137035f5E28","0x3E286452b1C66abB08Eb5494c3894F40aB5a59AF","0xb71ca4FFbB7b58d75Ba29891ab45e9Dc12B444Ed","0x8F10e3413586c4a8DCfcE19D009872b19e9cd8E3","0x566a07C3c932aE6AF74d77c29e5c30D8B1853710","0x5280406912EB8Ec677Df66C326BE48f938DC2e44","0x0275b3D54a5dDbf8205A75984796eFE8b7357Bae","0x5A1FD562271aAC2Dadb51BAAb7760b949D9D81dF","0xf6B6F07862A02C85628B3A9688beae07fEA9C863","0x475816ca2a31D601B4e336f5c2418A67978aBf09"]},{"name":"_nonce","value":1}],"address":"0x9BF7b8884Fa381a45f8CB2525905fb36C996297a","calldata":"0x536d8944000000000000000000000000423552c0f05baccac5bfa91c6dcf1dc53a0a164100000000000000000000000000000000000000000000000000000000000000600000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000000c0000000000000000000000003bd8e2ac65ad6f0f094ba6766cbd9484ab49ef23000000000000000000000000f8e1492255d9428c2fc20a98a1deb1215c8ffefd000000000000000000000000b07dc9103328a51128bc6cc1049d1137035f5e280000000000000000000000003e286452b1c66abb08eb5494c3894f40ab5a59af000000000000000000000000b71ca4ffbb7b58d75ba29891ab45e9dc12b444ed0000000000000000000000008f10e3413586c4a8dcfce19d009872b19e9cd8e3000000000000000000000000566a07c3c932ae6af74d77c29e5c30d8b18537100000000000000000000000005280406912eb8ec677df66c326be48f938dc2e440000000000000000000000000275b3d54a5ddbf8205a75984796efe8b7357bae0000000000000000000000005a1fd562271aac2dadb51baab7760b949d9d81df000000000000000000000000f6b6f07862a02c85628b3a9688beae07fea9c863000000000000000000000000475816ca2a31d601b4e336f5c2418a67978abf09","executor":"0xCF57572261c7c2BCF21ffD220ea7d1a27D40A827","inboxOnEthereum":"0x4Dbd4fc535Ac27206064B68FfCf827b0A60BAB3f"},"raw":{"target":"0xa723C008e76E379c55599D2E4d93879BeaFDa79C","value":0,"data":"0x0000000000000000000000004dbd4fc535ac27206064b68ffcf827b0a60bab3f000000000000000000000000cf57572261c7c2bcf21ffd220ea7d1a27d40a82700000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000c000000000000000000000000000000000000000000000000000000000000002841cff79cd0000000000000000000000009bf7b8884fa381a45f8cb2525905fb36c996297a00000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000204536d8944000000000000000000000000423552c0f05baccac5bfa91c6dcf1dc53a0a164100000000000000000000000000000000000000000000000000000000000000600000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000000c0000000000000000000000003bd8e2ac65ad6f0f094ba6766cbd9484ab49ef23000000000000000000000000f8e1492255d9428c2fc20a98a1deb1215c8ffefd000000000000000000000000b07dc9103328a51128bc6cc1049d1137035f5e280000000000000000000000003e286452b1c66abb08eb5494c3894f40ab5a59af000000000000000000000000b71ca4ffbb7b58d75ba29891ab45e9dc12b444ed0000000000000000000000008f10e3413586c4a8dcfce19d009872b19e9cd8e3000000000000000000000000566a07c3c932ae6af74d77c29e5c30d8b18537100000000000000000000000005280406912eb8ec677df66c326be48f938dc2e440000000000000000000000000275b3d54a5ddbf8205a75984796efe8b7357bae0000000000000000000000005a1fd562271aac2dadb51baab7760b949d9d81df000000000000000000000000f6b6f07862a02c85628b3a9688beae07fea9c863000000000000000000000000475816ca2a31d601b4e336f5c2418a67978abf090000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000","delay":259200}},{"id":"0x4de857395557aa68ca8e4ac5c12a0a8427b39b01c33e27882d473c25ed69cd93","decoded":{"chain":"nova","address":"0x9BF7b8884Fa381a45f8CB2525905fb36C996297a","calldata":"0x536d8944000000000000000000000000c232ee726e3c51b86778bb4dbe61c52cc07a60f300000000000000000000000000000000000000000000000000000000000000600000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000000c0000000000000000000000003bd8e2ac65ad6f0f094ba6766cbd9484ab49ef23000000000000000000000000f8e1492255d9428c2fc20a98a1deb1215c8ffefd000000000000000000000000b07dc9103328a51128bc6cc1049d1137035f5e280000000000000000000000003e286452b1c66abb08eb5494c3894f40ab5a59af000000000000000000000000b71ca4ffbb7b58d75ba29891ab45e9dc12b444ed0000000000000000000000008f10e3413586c4a8dcfce19d009872b19e9cd8e3000000000000000000000000566a07c3c932ae6af74d77c29e5c30d8b18537100000000000000000000000005280406912eb8ec677df66c326be48f938dc2e440000000000000000000000000275b3d54a5ddbf8205a75984796efe8b7357bae0000000000000000000000005a1fd562271aac2dadb51baab7760b949d9d81df000000000000000000000000f6b6f07862a02c85628b3a9688beae07fea9c863000000000000000000000000475816ca2a31d601b4e336f5c2418a67978abf09","executor":"0x86a02dD71363c440b21F4c0E5B2Ad01Ffe1A7482","inboxOnEthereum":"0xc4448b71118c9071Bcb9734A0EAc55D18A153949"},"raw":{"target":"0xa723C008e76E379c55599D2E4d93879BeaFDa79C","value":0,"data":"0x000000000000000000000000c4448b71118c9071bcb9734a0eac55d18a15394900000000000000000000000086a02dd71363c440b21f4c0e5b2ad01ffe1a748200000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000c000000000000000000000000000000000000000000000000000000000000002841cff79cd0000000000000000000000009bf7b8884fa381a45f8cb2525905fb36c996297a00000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000204536d8944000000000000000000000000c232ee726e3c51b86778bb4dbe61c52cc07a60f300000000000000000000000000000000000000000000000000000000000000600000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000000c0000000000000000000000003bd8e2ac65ad6f0f094ba6766cbd9484ab49ef23000000000000000000000000f8e1492255d9428c2fc20a98a1deb1215c8ffefd000000000000000000000000b07dc9103328a51128bc6cc1049d1137035f5e280000000000000000000000003e286452b1c66abb08eb5494c3894f40ab5a59af000000000000000000000000b71ca4ffbb7b58d75ba29891ab45e9dc12b444ed0000000000000000000000008f10e3413586c4a8dcfce19d009872b19e9cd8e3000000000000000000000000566a07c3c932ae6af74d77c29e5c30d8b18537100000000000000000000000005280406912eb8ec677df66c326be48f938dc2e440000000000000000000000000275b3d54a5ddbf8205a75984796efe8b7357bae0000000000000000000000005a1fd562271aac2dadb51baab7760b949d9d81df000000000000000000000000f6b6f07862a02c85628b3a9688beae07fea9c863000000000000000000000000475816ca2a31d601b4e336f5c2418a67978abf090000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000","delay":259200}},{"id":"0x4de857395557aa68ca8e4ac5c12a0a8427b39b01c33e27882d473c25ed69cd93","decoded":{"chain":"arbitrum","contractName":"SecurityCouncilMemberSyncAction","function":"perform","inputs":[{"name":"_securityCouncil","value":"0xADd68bCb0f66878aB9D37a447C7b9067C5dfa941"},{"name":"_updatedMembers","value":["0x3Bd8e2AC65ad6f0F094BA6766cBd9484AB49eF23","0xf8e1492255d9428c2Fc20A98A1DeB1215C8ffEfd","0xb07dc9103328A51128bC6Cc1049d1137035f5E28","0x3E286452b1C66abB08Eb5494c3894F40aB5a59AF","0xb71ca4FFbB7b58d75Ba29891ab45e9Dc12B444Ed","0x8F10e3413586c4a8DCfcE19D009872b19e9cd8E3","0x566a07C3c932aE6AF74d77c29e5c30D8B1853710","0x5280406912EB8Ec677Df66C326BE48f938DC2e44","0x0275b3D54a5dDbf8205A75984796eFE8b7357Bae","0x5A1FD562271aAC2Dadb51BAAb7760b949D9D81dF","0xf6B6F07862A02C85628B3A9688beae07fEA9C863","0x475816ca2a31D601B4e336f5c2418A67978aBf09"]},{"name":"_nonce","value":1}],"address":"0x9BF7b8884Fa381a45f8CB2525905fb36C996297a","calldata":"0x536d8944000000000000000000000000add68bcb0f66878ab9d37a447c7b9067c5dfa94100000000000000000000000000000000000000000000000000000000000000600000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000000c0000000000000000000000003bd8e2ac65ad6f0f094ba6766cbd9484ab49ef23000000000000000000000000f8e1492255d9428c2fc20a98a1deb1215c8ffefd000000000000000000000000b07dc9103328a51128bc6cc1049d1137035f5e280000000000000000000000003e286452b1c66abb08eb5494c3894f40ab5a59af000000000000000000000000b71ca4ffbb7b58d75ba29891ab45e9dc12b444ed0000000000000000000000008f10e3413586c4a8dcfce19d009872b19e9cd8e3000000000000000000000000566a07c3c932ae6af74d77c29e5c30d8b18537100000000000000000000000005280406912eb8ec677df66c326be48f938dc2e440000000000000000000000000275b3d54a5ddbf8205a75984796efe8b7357bae0000000000000000000000005a1fd562271aac2dadb51baab7760b949d9d81df000000000000000000000000f6b6f07862a02c85628b3a9688beae07fea9c863000000000000000000000000475816ca2a31d601b4e336f5c2418a67978abf09","executor":"0xCF57572261c7c2BCF21ffD220ea7d1a27D40A827","inboxOnEthereum":"0x4Dbd4fc535Ac27206064B68FfCf827b0A60BAB3f"},"raw":{"target":"0xa723C008e76E379c55599D2E4d93879BeaFDa79C","value":0,"data":"0x0000000000000000000000004dbd4fc535ac27206064b68ffcf827b0a60bab3f000000000000000000000000cf57572261c7c2bcf21ffd220ea7d1a27d40a82700000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000c000000000000000000000000000000000000000000000000000000000000002841cff79cd0000000000000000000000009bf7b8884fa381a45f8cb2525905fb36c996297a00000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000204536d8944000000000000000000000000add68bcb0f66878ab9d37a447c7b9067c5dfa94100000000000000000000000000000000000000000000000000000000000000600000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000000c0000000000000000000000003bd8e2ac65ad6f0f094ba6766cbd9484ab49ef23000000000000000000000000f8e1492255d9428c2fc20a98a1deb1215c8ffefd000000000000000000000000b07dc9103328a51128bc6cc1049d1137035f5e280000000000000000000000003e286452b1c66abb08eb5494c3894f40ab5a59af000000000000000000000000b71ca4ffbb7b58d75ba29891ab45e9dc12b444ed0000000000000000000000008f10e3413586c4a8dcfce19d009872b19e9cd8e3000000000000000000000000566a07c3c932ae6af74d77c29e5c30d8b18537100000000000000000000000005280406912eb8ec677df66c326be48f938dc2e440000000000000000000000000275b3d54a5ddbf8205a75984796efe8b7357bae0000000000000000000000005a1fd562271aac2dadb51baab7760b949d9d81df000000000000000000000000f6b6f07862a02c85628b3a9688beae07fea9c863000000000000000000000000475816ca2a31d601b4e336f5c2418a67978abf090000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000","delay":259200}},{"id":"0x492a8fccff029378b8566bdb6157123d1626cbfe2530a9b1f0ad5df688c10471","decoded":{"chain":"ethereum","contractName":"AddNovaKeysetAction","function":"perform","inputs":[],"address":"0xDef5CfE3246882BC7f65F9346a8b974BA27D3F4E","calldata":"0xb147f40c","executor":"0x3ffFbAdAF827559da092217e474760E2b2c3CeDd"},"raw":{"target":"0x3ffFbAdAF827559da092217e474760E2b2c3CeDd","value":0,"data":"0x1cff79cd000000000000000000000000def5cfe3246882bc7f65f9346a8b974ba27d3f4e00000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000004b147f40c00000000000000000000000000000000000000000000000000000000","delay":259200}},{"id":"0xbcda99fe98a7c479aafb3eb3eab0f154f9fdd169f28c11adf6eefda3bef7c04e","decoded":{"chain":"ethereum","contractName":"SetArbOneArbOS11ModuleRootAciton","function":"perform","inputs":[],"address":"0x3b70f2Da6F3b01F9a53dCBcB3e59AD3ad8bed924","calldata":"0xb147f40c","executor":"0x3ffFbAdAF827559da092217e474760E2b2c3CeDd"},"raw":{"target":"0x3ffFbAdAF827559da092217e474760E2b2c3CeDd","value":0,"data":"0x1cff79cd0000000000000000000000003b70f2da6f3b01f9a53dcbcb3e59ad3ad8bed92400000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000004b147f40c00000000000000000000000000000000000000000000000000000000","delay":259200}},{"id":"0xbcda99fe98a7c479aafb3eb3eab0f154f9fdd169f28c11adf6eefda3bef7c04e","decoded":{"chain":"ethereum","contractName":"SetNovaArbOS11ModuleRootAction","function":"perform","inputs":[],"address":"0x54c2C372943572Ac2a8E84D502ebc13F14B62246","calldata":"0xb147f40c","executor":"0x3ffFbAdAF827559da092217e474760E2b2c3CeDd"},"raw":{"target":"0x3ffFbAdAF827559da092217e474760E2b2c3CeDd","value":0,"data":"0x1cff79cd00000000000000000000000054c2c372943572ac2a8e84d502ebc13f14b6224600000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000004b147f40c00000000000000000000000000000000000000000000000000000000","delay":259200}},{"id":"0xbcda99fe98a7c479aafb3eb3eab0f154f9fdd169f28c11adf6eefda3bef7c04e","decoded":{"chain":"arbitrum","contractName":"SetArbOS11VersionAction","function":"perform","inputs":[],"address":"0xF6c7Dc6eaE78aBF2f32df899654ca425Dfa99481","calldata":"0xb147f40c","executor":"0xCF57572261c7c2BCF21ffD220ea7d1a27D40A827","inboxOnEthereum":"0x4Dbd4fc535Ac27206064B68FfCf827b0A60BAB3f"},"raw":{"target":"0xa723C008e76E379c55599D2E4d93879BeaFDa79C","value":0,"data":"0x0000000000000000000000004dbd4fc535ac27206064b68ffcf827b0a60bab3f000000000000000000000000cf57572261c7c2bcf21ffd220ea7d1a27d40a82700000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000c000000000000000000000000000000000000000000000000000000000000000841cff79cd000000000000000000000000f6c7dc6eae78abf2f32df899654ca425dfa9948100000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000004b147f40c0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000","delay":259200}},{"id":"0xbcda99fe98a7c479aafb3eb3eab0f154f9fdd169f28c11adf6eefda3bef7c04e","decoded":{"chain":"nova","address":"0x5357f4D3e8f8250A77bcddd5E58886AD1358220c","calldata":"0xb147f40c","executor":"0x86a02dD71363c440b21F4c0E5B2Ad01Ffe1A7482","inboxOnEthereum":"0xc4448b71118c9071Bcb9734A0EAc55D18A153949"},"raw":{"target":"0xa723C008e76E379c55599D2E4d93879BeaFDa79C","value":0,"data":"0x000000000000000000000000c4448b71118c9071bcb9734a0eac55d18a15394900000000000000000000000086a02dd71363c440b21f4c0e5b2ad01ffe1a748200000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000c000000000000000000000000000000000000000000000000000000000000000841cff79cd0000000000000000000000005357f4d3e8f8250a77bcddd5e58886ad1358220c00000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000004b147f40c0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000","delay":259200}},{"id":"0xe4f81d02f2581e9b7a8815af6925d3c277859994fde496629554989b7c91d254","decoded":{"chain":"arbitrum","contractName":"NomineeGovernorV2UpgradeAction","function":"perform","inputs":[],"address":"0xd9a2e0E5d7509F0BF1B2d33884F8C1b4D4490879","calldata":"0xb147f40c","executor":"0xCF57572261c7c2BCF21ffD220ea7d1a27D40A827","inboxOnEthereum":"0x4Dbd4fc535Ac27206064B68FfCf827b0A60BAB3f"},"raw":{"target":"0xa723C008e76E379c55599D2E4d93879BeaFDa79C","value":0,"data":"0x0000000000000000000000004dbd4fc535ac27206064b68ffcf827b0a60bab3f000000000000000000000000cf57572261c7c2bcf21ffd220ea7d1a27d40a82700000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000c000000000000000000000000000000000000000000000000000000000000000841cff79cd000000000000000000000000d9a2e0e5d7509f0bf1b2d33884f8c1b4d449087900000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000004b147f40c0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000","delay":259200}},{"id":"0x0b8dc4a8b99d2302c77e4eaeb1b06dd4038dd796bd8e5016dcb292018543ef91","decoded":{"chain":"ethereum","contractName":"AIPSetSequencerInboxMaxTimeVariationArbOneAction","function":"perform","inputs":[],"address":"0x3E313Eeed58E851CA3841C6109697B9eb35C7726","calldata":"0xb147f40c","executor":"0x3ffFbAdAF827559da092217e474760E2b2c3CeDd"},"raw":{"target":"0x3ffFbAdAF827559da092217e474760E2b2c3CeDd","value":0,"data":"0x1cff79cd0000000000000000000000003e313eeed58e851ca3841c6109697b9eb35c772600000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000004b147f40c00000000000000000000000000000000000000000000000000000000","delay":259200}},{"id":"0x0b8dc4a8b99d2302c77e4eaeb1b06dd4038dd796bd8e5016dcb292018543ef91","decoded":{"chain":"ethereum","contractName":"AIPSetSequencerInboxMaxTimeVariationNovaAction","function":"perform","inputs":[],"address":"0x47a85C0a118127F3968A6A1A61e2a326517540D4","calldata":"0xb147f40c","executor":"0x3ffFbAdAF827559da092217e474760E2b2c3CeDd"},"raw":{"target":"0x3ffFbAdAF827559da092217e474760E2b2c3CeDd","value":0,"data":"0x1cff79cd00000000000000000000000047a85c0a118127f3968a6a1a61e2a326517540d400000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000004b147f40c00000000000000000000000000000000000000000000000000000000","delay":259200}},{"id":"0x0b8dc4a8b99d2302c77e4eaeb1b06dd4038dd796bd8e5016dcb292018543ef91","decoded":{"chain":"ethereum","contractName":"ArbOneAIP4844Action","function":"perform","inputs":[],"address":"0x76D8e97Cd4514bebBc21d2044fF4a8d9eA1f0CC4","calldata":"0xb147f40c","executor":"0x3ffFbAdAF827559da092217e474760E2b2c3CeDd"},"raw":{"target":"0x3ffFbAdAF827559da092217e474760E2b2c3CeDd","value":0,"data":"0x1cff79cd00000000000000000000000076d8e97cd4514bebbc21d2044ff4a8d9ea1f0cc400000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000004b147f40c00000000000000000000000000000000000000000000000000000000","delay":259200}},{"id":"0x0b8dc4a8b99d2302c77e4eaeb1b06dd4038dd796bd8e5016dcb292018543ef91","decoded":{"chain":"ethereum","contractName":"ArbOneSetBatchPosterManagerAction","function":"perform","inputs":[],"address":"0xCe0aF261EB511CB41b8D0A2e31DF80BA37e265aB","calldata":"0xb147f40c","executor":"0x3ffFbAdAF827559da092217e474760E2b2c3CeDd"},"raw":{"target":"0x3ffFbAdAF827559da092217e474760E2b2c3CeDd","value":0,"data":"0x1cff79cd000000000000000000000000ce0af261eb511cb41b8d0a2e31df80ba37e265ab00000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000004b147f40c00000000000000000000000000000000000000000000000000000000","delay":259200}},{"id":"0x0b8dc4a8b99d2302c77e4eaeb1b06dd4038dd796bd8e5016dcb292018543ef91","decoded":{"chain":"ethereum","contractName":"NovaAIP4844Action","function":"perform","inputs":[],"address":"0x874356173CFd6C739aeab1F5ABfB5F3AFB3d4d33","calldata":"0xb147f40c","executor":"0x3ffFbAdAF827559da092217e474760E2b2c3CeDd"},"raw":{"target":"0x3ffFbAdAF827559da092217e474760E2b2c3CeDd","value":0,"data":"0x1cff79cd000000000000000000000000874356173cfd6c739aeab1f5abfb5f3afb3d4d3300000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000004b147f40c00000000000000000000000000000000000000000000000000000000","delay":259200}},{"id":"0x0b8dc4a8b99d2302c77e4eaeb1b06dd4038dd796bd8e5016dcb292018543ef91","decoded":{"chain":"ethereum","contractName":"NovaSetBatchPosterManagerAction","function":"perform","inputs":[],"address":"0x501f30810D2b0EaEC15Cc3785dBB29e4a8a92a70","calldata":"0xb147f40c","executor":"0x3ffFbAdAF827559da092217e474760E2b2c3CeDd"},"raw":{"target":"0x3ffFbAdAF827559da092217e474760E2b2c3CeDd","value":0,"data":"0x1cff79cd000000000000000000000000501f30810d2b0eaec15cc3785dbb29e4a8a92a7000000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000004b147f40c00000000000000000000000000000000000000000000000000000000","delay":259200}},{"id":"0x0b8dc4a8b99d2302c77e4eaeb1b06dd4038dd796bd8e5016dcb292018543ef91","decoded":{"chain":"arbitrum","contractName":"SetArbOS20VersionAction","function":"perform","inputs":[],"address":"0x3E313Eeed58E851CA3841C6109697B9eb35C7726","calldata":"0xb147f40c","executor":"0xCF57572261c7c2BCF21ffD220ea7d1a27D40A827","inboxOnEthereum":"0x4Dbd4fc535Ac27206064B68FfCf827b0A60BAB3f"},"raw":{"target":"0xa723C008e76E379c55599D2E4d93879BeaFDa79C","value":0,"data":"0x0000000000000000000000004dbd4fc535ac27206064b68ffcf827b0a60bab3f000000000000000000000000cf57572261c7c2bcf21ffd220ea7d1a27d40a82700000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000c000000000000000000000000000000000000000000000000000000000000000841cff79cd0000000000000000000000003e313eeed58e851ca3841c6109697b9eb35c772600000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000004b147f40c0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000","delay":259200}},{"id":"0x0b8dc4a8b99d2302c77e4eaeb1b06dd4038dd796bd8e5016dcb292018543ef91","decoded":{"chain":"nova","address":"0x3E313Eeed58E851CA3841C6109697B9eb35C7726","calldata":"0xb147f40c","executor":"0x86a02dD71363c440b21F4c0E5B2Ad01Ffe1A7482","inboxOnEthereum":"0xc4448b71118c9071Bcb9734A0EAc55D18A153949"},"raw":{"target":"0xa723C008e76E379c55599D2E4d93879BeaFDa79C","value":0,"data":"0x000000000000000000000000c4448b71118c9071bcb9734a0eac55d18a15394900000000000000000000000086a02dd71363c440b21f4c0e5b2ad01ffe1a748200000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000c000000000000000000000000000000000000000000000000000000000000000841cff79cd0000000000000000000000003e313eeed58e851ca3841c6109697b9eb35c772600000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000004b147f40c0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000","delay":259200}},{"id":"0xdda98e62c0827b0ea976efa9fa7eab4086f6ecc5aa6715e02868bb2972b12cad","decoded":{"chain":"arbitrum","contractName":"ArbOneSetAtlasL1PricingRewardAction","function":"perform","inputs":[],"address":"0x36D0170D92F66e8949eB276C3AC4FEA64f83704d","calldata":"0xb147f40c","executor":"0xCF57572261c7c2BCF21ffD220ea7d1a27D40A827","inboxOnEthereum":"0x4Dbd4fc535Ac27206064B68FfCf827b0A60BAB3f"},"raw":{"target":"0xa723C008e76E379c55599D2E4d93879BeaFDa79C","value":0,"data":"0x0000000000000000000000004dbd4fc535ac27206064b68ffcf827b0a60bab3f000000000000000000000000cf57572261c7c2bcf21ffd220ea7d1a27d40a82700000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000c000000000000000000000000000000000000000000000000000000000000000841cff79cd00000000000000000000000036d0170d92f66e8949eb276c3ac4fea64f83704d00000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000004b147f40c0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000","delay":259200}},{"id":"0xdda98e62c0827b0ea976efa9fa7eab4086f6ecc5aa6715e02868bb2972b12cad","decoded":{"chain":"arbitrum","contractName":"ArbOneSetAtlasMinBaseFeeAction","function":"perform","inputs":[],"address":"0x849E360a247132F961c9CBE95Ba39106c72e1268","calldata":"0xb147f40c","executor":"0xCF57572261c7c2BCF21ffD220ea7d1a27D40A827","inboxOnEthereum":"0x4Dbd4fc535Ac27206064B68FfCf827b0A60BAB3f"},"raw":{"target":"0xa723C008e76E379c55599D2E4d93879BeaFDa79C","value":0,"data":"0x0000000000000000000000004dbd4fc535ac27206064b68ffcf827b0a60bab3f000000000000000000000000cf57572261c7c2bcf21ffd220ea7d1a27d40a82700000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000c000000000000000000000000000000000000000000000000000000000000000841cff79cd000000000000000000000000849e360a247132f961c9cbe95ba39106c72e126800000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000004b147f40c0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000","delay":259200}},{"id":"0xd1eea9e87f3c665209dcd7f963295df40e79119668d6417794d36891994a3bad","decoded":{"chain":"ethereum","contractName":"SecurityCouncilMemberSyncAction","function":"perform","inputs":[{"name":"_securityCouncil","value":"0xF06E95eF589D9c38af242a8AAee8375f14023F85"},{"name":"_updatedMembers","value":["0x3Bd8e2AC65ad6f0F094BA6766cBd9484AB49eF23","0xf8e1492255d9428c2Fc20A98A1DeB1215C8ffEfd","0xb07dc9103328A51128bC6Cc1049d1137035f5E28","0x3E286452b1C66abB08Eb5494c3894F40aB5a59AF","0xb71ca4FFbB7b58d75Ba29891ab45e9Dc12B444Ed","0x8F10e3413586c4a8DCfcE19D009872b19e9cd8E3","0xe40D80Bd58CEE55DCC2598724d7F1e03E206581D","0xB3b60932E598fe946169EC209A197184Bad760B7","0xee7Fb91D5b776C326a728dc70e917F82d6809E3C","0x475816ca2a31D601B4e336f5c2418A67978aBf09","0xa0683d725420e2F75415806352Cd9c3fE10Fa960","0x0275b3D54a5dDbf8205A75984796eFE8b7357Bae"]},{"name":"_nonce","value":2}],"address":"0x9BF7b8884Fa381a45f8CB2525905fb36C996297a","calldata":"0x536d8944000000000000000000000000f06e95ef589d9c38af242a8aaee8375f14023f8500000000000000000000000000000000000000000000000000000000000000600000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000000c0000000000000000000000003bd8e2ac65ad6f0f094ba6766cbd9484ab49ef23000000000000000000000000f8e1492255d9428c2fc20a98a1deb1215c8ffefd000000000000000000000000b07dc9103328a51128bc6cc1049d1137035f5e280000000000000000000000003e286452b1c66abb08eb5494c3894f40ab5a59af000000000000000000000000b71ca4ffbb7b58d75ba29891ab45e9dc12b444ed0000000000000000000000008f10e3413586c4a8dcfce19d009872b19e9cd8e3000000000000000000000000e40d80bd58cee55dcc2598724d7f1e03e206581d000000000000000000000000b3b60932e598fe946169ec209a197184bad760b7000000000000000000000000ee7fb91d5b776c326a728dc70e917f82d6809e3c000000000000000000000000475816ca2a31d601b4e336f5c2418a67978abf09000000000000000000000000a0683d725420e2f75415806352cd9c3fe10fa9600000000000000000000000000275b3d54a5ddbf8205a75984796efe8b7357bae","executor":"0x3ffFbAdAF827559da092217e474760E2b2c3CeDd"},"raw":{"target":"0x3ffFbAdAF827559da092217e474760E2b2c3CeDd","value":0,"data":"0x1cff79cd0000000000000000000000009bf7b8884fa381a45f8cb2525905fb36c996297a00000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000204536d8944000000000000000000000000f06e95ef589d9c38af242a8aaee8375f14023f8500000000000000000000000000000000000000000000000000000000000000600000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000000c0000000000000000000000003bd8e2ac65ad6f0f094ba6766cbd9484ab49ef23000000000000000000000000f8e1492255d9428c2fc20a98a1deb1215c8ffefd000000000000000000000000b07dc9103328a51128bc6cc1049d1137035f5e280000000000000000000000003e286452b1c66abb08eb5494c3894f40ab5a59af000000000000000000000000b71ca4ffbb7b58d75ba29891ab45e9dc12b444ed0000000000000000000000008f10e3413586c4a8dcfce19d009872b19e9cd8e3000000000000000000000000e40d80bd58cee55dcc2598724d7f1e03e206581d000000000000000000000000b3b60932e598fe946169ec209a197184bad760b7000000000000000000000000ee7fb91d5b776c326a728dc70e917f82d6809e3c000000000000000000000000475816ca2a31d601b4e336f5c2418a67978abf09000000000000000000000000a0683d725420e2f75415806352cd9c3fe10fa9600000000000000000000000000275b3d54a5ddbf8205a75984796efe8b7357bae00000000000000000000000000000000000000000000000000000000","delay":259200}},{"id":"0xd1eea9e87f3c665209dcd7f963295df40e79119668d6417794d36891994a3bad","decoded":{"chain":"arbitrum","contractName":"SecurityCouncilMemberSyncAction","function":"perform","inputs":[{"name":"_securityCouncil","value":"0x423552c0F05baCCac5Bfa91C6dCF1dc53a0A1641"},{"name":"_updatedMembers","value":["0x3Bd8e2AC65ad6f0F094BA6766cBd9484AB49eF23","0xf8e1492255d9428c2Fc20A98A1DeB1215C8ffEfd","0xb07dc9103328A51128bC6Cc1049d1137035f5E28","0x3E286452b1C66abB08Eb5494c3894F40aB5a59AF","0xb71ca4FFbB7b58d75Ba29891ab45e9Dc12B444Ed","0x8F10e3413586c4a8DCfcE19D009872b19e9cd8E3","0xe40D80Bd58CEE55DCC2598724d7F1e03E206581D","0xB3b60932E598fe946169EC209A197184Bad760B7","0xee7Fb91D5b776C326a728dc70e917F82d6809E3C","0x475816ca2a31D601B4e336f5c2418A67978aBf09","0xa0683d725420e2F75415806352Cd9c3fE10Fa960","0x0275b3D54a5dDbf8205A75984796eFE8b7357Bae"]},{"name":"_nonce","value":2}],"address":"0x9BF7b8884Fa381a45f8CB2525905fb36C996297a","calldata":"0x536d8944000000000000000000000000423552c0f05baccac5bfa91c6dcf1dc53a0a164100000000000000000000000000000000000000000000000000000000000000600000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000000c0000000000000000000000003bd8e2ac65ad6f0f094ba6766cbd9484ab49ef23000000000000000000000000f8e1492255d9428c2fc20a98a1deb1215c8ffefd000000000000000000000000b07dc9103328a51128bc6cc1049d1137035f5e280000000000000000000000003e286452b1c66abb08eb5494c3894f40ab5a59af000000000000000000000000b71ca4ffbb7b58d75ba29891ab45e9dc12b444ed0000000000000000000000008f10e3413586c4a8dcfce19d009872b19e9cd8e3000000000000000000000000e40d80bd58cee55dcc2598724d7f1e03e206581d000000000000000000000000b3b60932e598fe946169ec209a197184bad760b7000000000000000000000000ee7fb91d5b776c326a728dc70e917f82d6809e3c000000000000000000000000475816ca2a31d601b4e336f5c2418a67978abf09000000000000000000000000a0683d725420e2f75415806352cd9c3fe10fa9600000000000000000000000000275b3d54a5ddbf8205a75984796efe8b7357bae","executor":"0xCF57572261c7c2BCF21ffD220ea7d1a27D40A827","inboxOnEthereum":"0x4Dbd4fc535Ac27206064B68FfCf827b0A60BAB3f"},"raw":{"target":"0xa723C008e76E379c55599D2E4d93879BeaFDa79C","value":0,"data":"0x0000000000000000000000004dbd4fc535ac27206064b68ffcf827b0a60bab3f000000000000000000000000cf57572261c7c2bcf21ffd220ea7d1a27d40a82700000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000c000000000000000000000000000000000000000000000000000000000000002841cff79cd0000000000000000000000009bf7b8884fa381a45f8cb2525905fb36c996297a00000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000204536d8944000000000000000000000000423552c0f05baccac5bfa91c6dcf1dc53a0a164100000000000000000000000000000000000000000000000000000000000000600000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000000c0000000000000000000000003bd8e2ac65ad6f0f094ba6766cbd9484ab49ef23000000000000000000000000f8e1492255d9428c2fc20a98a1deb1215c8ffefd000000000000000000000000b07dc9103328a51128bc6cc1049d1137035f5e280000000000000000000000003e286452b1c66abb08eb5494c3894f40ab5a59af000000000000000000000000b71ca4ffbb7b58d75ba29891ab45e9dc12b444ed0000000000000000000000008f10e3413586c4a8dcfce19d009872b19e9cd8e3000000000000000000000000e40d80bd58cee55dcc2598724d7f1e03e206581d000000000000000000000000b3b60932e598fe946169ec209a197184bad760b7000000000000000000000000ee7fb91d5b776c326a728dc70e917f82d6809e3c000000000000000000000000475816ca2a31d601b4e336f5c2418a67978abf09000000000000000000000000a0683d725420e2f75415806352cd9c3fe10fa9600000000000000000000000000275b3d54a5ddbf8205a75984796efe8b7357bae0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000","delay":259200}},{"id":"0xd1eea9e87f3c665209dcd7f963295df40e79119668d6417794d36891994a3bad","decoded":{"chain":"nova","address":"0x9BF7b8884Fa381a45f8CB2525905fb36C996297a","calldata":"0x536d8944000000000000000000000000c232ee726e3c51b86778bb4dbe61c52cc07a60f300000000000000000000000000000000000000000000000000000000000000600000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000000c0000000000000000000000003bd8e2ac65ad6f0f094ba6766cbd9484ab49ef23000000000000000000000000f8e1492255d9428c2fc20a98a1deb1215c8ffefd000000000000000000000000b07dc9103328a51128bc6cc1049d1137035f5e280000000000000000000000003e286452b1c66abb08eb5494c3894f40ab5a59af000000000000000000000000b71ca4ffbb7b58d75ba29891ab45e9dc12b444ed0000000000000000000000008f10e3413586c4a8dcfce19d009872b19e9cd8e3000000000000000000000000e40d80bd58cee55dcc2598724d7f1e03e206581d000000000000000000000000b3b60932e598fe946169ec209a197184bad760b7000000000000000000000000ee7fb91d5b776c326a728dc70e917f82d6809e3c000000000000000000000000475816ca2a31d601b4e336f5c2418a67978abf09000000000000000000000000a0683d725420e2f75415806352cd9c3fe10fa9600000000000000000000000000275b3d54a5ddbf8205a75984796efe8b7357bae","executor":"0x86a02dD71363c440b21F4c0E5B2Ad01Ffe1A7482","inboxOnEthereum":"0xc4448b71118c9071Bcb9734A0EAc55D18A153949"},"raw":{"target":"0xa723C008e76E379c55599D2E4d93879BeaFDa79C","value":0,"data":"0x000000000000000000000000c4448b71118c9071bcb9734a0eac55d18a15394900000000000000000000000086a02dd71363c440b21f4c0e5b2ad01ffe1a748200000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000c000000000000000000000000000000000000000000000000000000000000002841cff79cd0000000000000000000000009bf7b8884fa381a45f8cb2525905fb36c996297a00000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000204536d8944000000000000000000000000c232ee726e3c51b86778bb4dbe61c52cc07a60f300000000000000000000000000000000000000000000000000000000000000600000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000000c0000000000000000000000003bd8e2ac65ad6f0f094ba6766cbd9484ab49ef23000000000000000000000000f8e1492255d9428c2fc20a98a1deb1215c8ffefd000000000000000000000000b07dc9103328a51128bc6cc1049d1137035f5e280000000000000000000000003e286452b1c66abb08eb5494c3894f40ab5a59af000000000000000000000000b71ca4ffbb7b58d75ba29891ab45e9dc12b444ed0000000000000000000000008f10e3413586c4a8dcfce19d009872b19e9cd8e3000000000000000000000000e40d80bd58cee55dcc2598724d7f1e03e206581d000000000000000000000000b3b60932e598fe946169ec209a197184bad760b7000000000000000000000000ee7fb91d5b776c326a728dc70e917f82d6809e3c000000000000000000000000475816ca2a31d601b4e336f5c2418a67978abf09000000000000000000000000a0683d725420e2f75415806352cd9c3fe10fa9600000000000000000000000000275b3d54a5ddbf8205a75984796efe8b7357bae0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000","delay":259200}},{"id":"0xd1eea9e87f3c665209dcd7f963295df40e79119668d6417794d36891994a3bad","decoded":{"chain":"arbitrum","contractName":"SecurityCouncilMemberSyncAction","function":"perform","inputs":[{"name":"_securityCouncil","value":"0xADd68bCb0f66878aB9D37a447C7b9067C5dfa941"},{"name":"_updatedMembers","value":["0x3Bd8e2AC65ad6f0F094BA6766cBd9484AB49eF23","0xf8e1492255d9428c2Fc20A98A1DeB1215C8ffEfd","0xb07dc9103328A51128bC6Cc1049d1137035f5E28","0x3E286452b1C66abB08Eb5494c3894F40aB5a59AF","0xb71ca4FFbB7b58d75Ba29891ab45e9Dc12B444Ed","0x8F10e3413586c4a8DCfcE19D009872b19e9cd8E3","0xe40D80Bd58CEE55DCC2598724d7F1e03E206581D","0xB3b60932E598fe946169EC209A197184Bad760B7","0xee7Fb91D5b776C326a728dc70e917F82d6809E3C","0x475816ca2a31D601B4e336f5c2418A67978aBf09","0xa0683d725420e2F75415806352Cd9c3fE10Fa960","0x0275b3D54a5dDbf8205A75984796eFE8b7357Bae"]},{"name":"_nonce","value":2}],"address":"0x9BF7b8884Fa381a45f8CB2525905fb36C996297a","calldata":"0x536d8944000000000000000000000000add68bcb0f66878ab9d37a447c7b9067c5dfa94100000000000000000000000000000000000000000000000000000000000000600000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000000c0000000000000000000000003bd8e2ac65ad6f0f094ba6766cbd9484ab49ef23000000000000000000000000f8e1492255d9428c2fc20a98a1deb1215c8ffefd000000000000000000000000b07dc9103328a51128bc6cc1049d1137035f5e280000000000000000000000003e286452b1c66abb08eb5494c3894f40ab5a59af000000000000000000000000b71ca4ffbb7b58d75ba29891ab45e9dc12b444ed0000000000000000000000008f10e3413586c4a8dcfce19d009872b19e9cd8e3000000000000000000000000e40d80bd58cee55dcc2598724d7f1e03e206581d000000000000000000000000b3b60932e598fe946169ec209a197184bad760b7000000000000000000000000ee7fb91d5b776c326a728dc70e917f82d6809e3c000000000000000000000000475816ca2a31d601b4e336f5c2418a67978abf09000000000000000000000000a0683d725420e2f75415806352cd9c3fe10fa9600000000000000000000000000275b3d54a5ddbf8205a75984796efe8b7357bae","executor":"0xCF57572261c7c2BCF21ffD220ea7d1a27D40A827","inboxOnEthereum":"0x4Dbd4fc535Ac27206064B68FfCf827b0A60BAB3f"},"raw":{"target":"0xa723C008e76E379c55599D2E4d93879BeaFDa79C","value":0,"data":"0x0000000000000000000000004dbd4fc535ac27206064b68ffcf827b0a60bab3f000000000000000000000000cf57572261c7c2bcf21ffd220ea7d1a27d40a82700000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000c000000000000000000000000000000000000000000000000000000000000002841cff79cd0000000000000000000000009bf7b8884fa381a45f8cb2525905fb36c996297a00000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000204536d8944000000000000000000000000add68bcb0f66878ab9d37a447c7b9067c5dfa94100000000000000000000000000000000000000000000000000000000000000600000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000000c0000000000000000000000003bd8e2ac65ad6f0f094ba6766cbd9484ab49ef23000000000000000000000000f8e1492255d9428c2fc20a98a1deb1215c8ffefd000000000000000000000000b07dc9103328a51128bc6cc1049d1137035f5e280000000000000000000000003e286452b1c66abb08eb5494c3894f40ab5a59af000000000000000000000000b71ca4ffbb7b58d75ba29891ab45e9dc12b444ed0000000000000000000000008f10e3413586c4a8dcfce19d009872b19e9cd8e3000000000000000000000000e40d80bd58cee55dcc2598724d7f1e03e206581d000000000000000000000000b3b60932e598fe946169ec209a197184bad760b7000000000000000000000000ee7fb91d5b776c326a728dc70e917f82d6809e3c000000000000000000000000475816ca2a31d601b4e336f5c2418a67978abf09000000000000000000000000a0683d725420e2f75415806352cd9c3fe10fa9600000000000000000000000000275b3d54a5ddbf8205a75984796efe8b7357bae0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000","delay":259200}},{"id":"0x1f8af0aacf32f1bedd2ad0a5527055a13adcb894deeeb123c9495811dac3f5d9","decoded":{"chain":"arbitrum","contractName":"AIPIncreaseNonEmergencySCThresholdAction","function":"perform","inputs":[],"address":"0x25afB879bb5364cB3f7e0b607AD280C0F52B0D82","calldata":"0xb147f40c","executor":"0xCF57572261c7c2BCF21ffD220ea7d1a27D40A827","inboxOnEthereum":"0x4Dbd4fc535Ac27206064B68FfCf827b0A60BAB3f"},"raw":{"target":"0xa723C008e76E379c55599D2E4d93879BeaFDa79C","value":0,"data":"0x0000000000000000000000004dbd4fc535ac27206064b68ffcf827b0a60bab3f000000000000000000000000cf57572261c7c2bcf21ffd220ea7d1a27d40a82700000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000c000000000000000000000000000000000000000000000000000000000000000841cff79cd00000000000000000000000025afb879bb5364cb3f7e0b607ad280c0f52b0d8200000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000004b147f40c0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000","delay":259200}}]
      errors:
+        {"scheduledTransactions":"Assertion Error: Unknown chain: arbitrum"}
    }
```

```diff
+   Status: CREATED
    contract LPTL1Escrow (0x6A23F4940BD5BA117Da261f98aae51A8BFfa210A)
    +++ description: None
```

Generated with discovered.json: 0x42667cb2231c5c4d9e966f4a1b4c2e70b7614289

# Diff at Wed, 19 Jun 2024 09:16:11 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@8fa0a456becead1002fbe41b5a2a1fee09a9dcd2 block: 19916498
- current block number: 20124808

## Description

Scheduled tx to increase the threshold of the non-emergency SecurityCouncil.
Context: [Constitutional AIP - Security Council Improvement Proposal ](https://www.tally.xyz/gov/arbitrum/proposal/108365944612843449282647711225577270624871742641825297712833904029381791489297)

## Watched changes

```diff
    contract L1ArbitrumTimelock (0xE6841D92B0C345144506576eC13ECf5103aC7f49) {
    +++ description: None
      values.scheduledTransactions.32:
+        {"id":"0x1f8af0aacf32f1bedd2ad0a5527055a13adcb894deeeb123c9495811dac3f5d9","decoded":{"chain":"arbitrum","contractName":"AIPIncreaseNonEmergencySCThresholdAction","function":"perform","inputs":[],"address":"0x25afB879bb5364cB3f7e0b607AD280C0F52B0D82","calldata":"0xb147f40c","executor":"0xCF57572261c7c2BCF21ffD220ea7d1a27D40A827","inboxOnEthereum":"0x4Dbd4fc535Ac27206064B68FfCf827b0A60BAB3f"},"raw":{"target":"0xa723C008e76E379c55599D2E4d93879BeaFDa79C","value":0,"data":"0x0000000000000000000000004dbd4fc535ac27206064b68ffcf827b0a60bab3f000000000000000000000000cf57572261c7c2bcf21ffd220ea7d1a27d40a82700000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000c000000000000000000000000000000000000000000000000000000000000000841cff79cd00000000000000000000000025afb879bb5364cb3f7e0b607ad280c0f52b0d8200000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000004b147f40c0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000","delay":259200}}
    }
```

Generated with discovered.json: 0x6ce55025ce524cc3e6a7c57f354c2648de2f30f2

# Diff at Tue, 21 May 2024 06:29:38 GMT:

- author: sekuba (<sekuba@users.noreply.github.com>)
- comparing to: main@fb4c64221d00d53ed6ec1609ef10dc99f1842087 block: 19910351
- current block number: 19916498

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

Generated with discovered.json: 0x9c1c1032afab9a1137d2ecf0e3c47e3bd79c2a08

# Diff at Mon, 20 May 2024 09:50:51 GMT:

- author: sekuba (<sekuba@users.noreply.github.com>)
- comparing to: main@477e1ce9602e5cbd6b592ca2ad6cfcdb8e416b72 block: 19883612
- current block number: 19910351

## Description

Scheduled txs to update SecurityCouncil members: See also the result of the elections in `discovery/arbitrum/arbitrum/diffHistory.md`.

## Watched changes

```diff
    contract L1ArbitrumTimelock (0xE6841D92B0C345144506576eC13ECf5103aC7f49) {
    +++ description: None
      values.scheduledTransactions.31:
+        {"id":"0xd1eea9e87f3c665209dcd7f963295df40e79119668d6417794d36891994a3bad","decoded":{"chain":"arbitrum","contractName":"SecurityCouncilMemberSyncAction","function":"perform","inputs":[{"name":"_securityCouncil","value":"0xADd68bCb0f66878aB9D37a447C7b9067C5dfa941"},{"name":"_updatedMembers","value":["0x3Bd8e2AC65ad6f0F094BA6766cBd9484AB49eF23","0xf8e1492255d9428c2Fc20A98A1DeB1215C8ffEfd","0xb07dc9103328A51128bC6Cc1049d1137035f5E28","0x3E286452b1C66abB08Eb5494c3894F40aB5a59AF","0xb71ca4FFbB7b58d75Ba29891ab45e9Dc12B444Ed","0x8F10e3413586c4a8DCfcE19D009872b19e9cd8E3","0xe40D80Bd58CEE55DCC2598724d7F1e03E206581D","0xB3b60932E598fe946169EC209A197184Bad760B7","0xee7Fb91D5b776C326a728dc70e917F82d6809E3C","0x475816ca2a31D601B4e336f5c2418A67978aBf09","0xa0683d725420e2F75415806352Cd9c3fE10Fa960","0x0275b3D54a5dDbf8205A75984796eFE8b7357Bae"]},{"name":"_nonce","value":2}],"address":"0x9BF7b8884Fa381a45f8CB2525905fb36C996297a","calldata":"0x536d8944000000000000000000000000add68bcb0f66878ab9d37a447c7b9067c5dfa94100000000000000000000000000000000000000000000000000000000000000600000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000000c0000000000000000000000003bd8e2ac65ad6f0f094ba6766cbd9484ab49ef23000000000000000000000000f8e1492255d9428c2fc20a98a1deb1215c8ffefd000000000000000000000000b07dc9103328a51128bc6cc1049d1137035f5e280000000000000000000000003e286452b1c66abb08eb5494c3894f40ab5a59af000000000000000000000000b71ca4ffbb7b58d75ba29891ab45e9dc12b444ed0000000000000000000000008f10e3413586c4a8dcfce19d009872b19e9cd8e3000000000000000000000000e40d80bd58cee55dcc2598724d7f1e03e206581d000000000000000000000000b3b60932e598fe946169ec209a197184bad760b7000000000000000000000000ee7fb91d5b776c326a728dc70e917f82d6809e3c000000000000000000000000475816ca2a31d601b4e336f5c2418a67978abf09000000000000000000000000a0683d725420e2f75415806352cd9c3fe10fa9600000000000000000000000000275b3d54a5ddbf8205a75984796efe8b7357bae","executor":"0xCF57572261c7c2BCF21ffD220ea7d1a27D40A827","inboxOnEthereum":"0x4Dbd4fc535Ac27206064B68FfCf827b0A60BAB3f"},"raw":{"target":"0xa723C008e76E379c55599D2E4d93879BeaFDa79C","value":0,"data":"0x0000000000000000000000004dbd4fc535ac27206064b68ffcf827b0a60bab3f000000000000000000000000cf57572261c7c2bcf21ffd220ea7d1a27d40a82700000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000c000000000000000000000000000000000000000000000000000000000000002841cff79cd0000000000000000000000009bf7b8884fa381a45f8cb2525905fb36c996297a00000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000204536d8944000000000000000000000000add68bcb0f66878ab9d37a447c7b9067c5dfa94100000000000000000000000000000000000000000000000000000000000000600000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000000c0000000000000000000000003bd8e2ac65ad6f0f094ba6766cbd9484ab49ef23000000000000000000000000f8e1492255d9428c2fc20a98a1deb1215c8ffefd000000000000000000000000b07dc9103328a51128bc6cc1049d1137035f5e280000000000000000000000003e286452b1c66abb08eb5494c3894f40ab5a59af000000000000000000000000b71ca4ffbb7b58d75ba29891ab45e9dc12b444ed0000000000000000000000008f10e3413586c4a8dcfce19d009872b19e9cd8e3000000000000000000000000e40d80bd58cee55dcc2598724d7f1e03e206581d000000000000000000000000b3b60932e598fe946169ec209a197184bad760b7000000000000000000000000ee7fb91d5b776c326a728dc70e917f82d6809e3c000000000000000000000000475816ca2a31d601b4e336f5c2418a67978abf09000000000000000000000000a0683d725420e2f75415806352cd9c3fe10fa9600000000000000000000000000275b3d54a5ddbf8205a75984796efe8b7357bae0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000","delay":259200}}
      values.scheduledTransactions.30:
+        {"id":"0xd1eea9e87f3c665209dcd7f963295df40e79119668d6417794d36891994a3bad","decoded":{"chain":"nova","address":"0x9BF7b8884Fa381a45f8CB2525905fb36C996297a","calldata":"0x536d8944000000000000000000000000c232ee726e3c51b86778bb4dbe61c52cc07a60f300000000000000000000000000000000000000000000000000000000000000600000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000000c0000000000000000000000003bd8e2ac65ad6f0f094ba6766cbd9484ab49ef23000000000000000000000000f8e1492255d9428c2fc20a98a1deb1215c8ffefd000000000000000000000000b07dc9103328a51128bc6cc1049d1137035f5e280000000000000000000000003e286452b1c66abb08eb5494c3894f40ab5a59af000000000000000000000000b71ca4ffbb7b58d75ba29891ab45e9dc12b444ed0000000000000000000000008f10e3413586c4a8dcfce19d009872b19e9cd8e3000000000000000000000000e40d80bd58cee55dcc2598724d7f1e03e206581d000000000000000000000000b3b60932e598fe946169ec209a197184bad760b7000000000000000000000000ee7fb91d5b776c326a728dc70e917f82d6809e3c000000000000000000000000475816ca2a31d601b4e336f5c2418a67978abf09000000000000000000000000a0683d725420e2f75415806352cd9c3fe10fa9600000000000000000000000000275b3d54a5ddbf8205a75984796efe8b7357bae","executor":"0x86a02dD71363c440b21F4c0E5B2Ad01Ffe1A7482","inboxOnEthereum":"0xc4448b71118c9071Bcb9734A0EAc55D18A153949"},"raw":{"target":"0xa723C008e76E379c55599D2E4d93879BeaFDa79C","value":0,"data":"0x000000000000000000000000c4448b71118c9071bcb9734a0eac55d18a15394900000000000000000000000086a02dd71363c440b21f4c0e5b2ad01ffe1a748200000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000c000000000000000000000000000000000000000000000000000000000000002841cff79cd0000000000000000000000009bf7b8884fa381a45f8cb2525905fb36c996297a00000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000204536d8944000000000000000000000000c232ee726e3c51b86778bb4dbe61c52cc07a60f300000000000000000000000000000000000000000000000000000000000000600000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000000c0000000000000000000000003bd8e2ac65ad6f0f094ba6766cbd9484ab49ef23000000000000000000000000f8e1492255d9428c2fc20a98a1deb1215c8ffefd000000000000000000000000b07dc9103328a51128bc6cc1049d1137035f5e280000000000000000000000003e286452b1c66abb08eb5494c3894f40ab5a59af000000000000000000000000b71ca4ffbb7b58d75ba29891ab45e9dc12b444ed0000000000000000000000008f10e3413586c4a8dcfce19d009872b19e9cd8e3000000000000000000000000e40d80bd58cee55dcc2598724d7f1e03e206581d000000000000000000000000b3b60932e598fe946169ec209a197184bad760b7000000000000000000000000ee7fb91d5b776c326a728dc70e917f82d6809e3c000000000000000000000000475816ca2a31d601b4e336f5c2418a67978abf09000000000000000000000000a0683d725420e2f75415806352cd9c3fe10fa9600000000000000000000000000275b3d54a5ddbf8205a75984796efe8b7357bae0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000","delay":259200}}
      values.scheduledTransactions.29:
+        {"id":"0xd1eea9e87f3c665209dcd7f963295df40e79119668d6417794d36891994a3bad","decoded":{"chain":"arbitrum","contractName":"SecurityCouncilMemberSyncAction","function":"perform","inputs":[{"name":"_securityCouncil","value":"0x423552c0F05baCCac5Bfa91C6dCF1dc53a0A1641"},{"name":"_updatedMembers","value":["0x3Bd8e2AC65ad6f0F094BA6766cBd9484AB49eF23","0xf8e1492255d9428c2Fc20A98A1DeB1215C8ffEfd","0xb07dc9103328A51128bC6Cc1049d1137035f5E28","0x3E286452b1C66abB08Eb5494c3894F40aB5a59AF","0xb71ca4FFbB7b58d75Ba29891ab45e9Dc12B444Ed","0x8F10e3413586c4a8DCfcE19D009872b19e9cd8E3","0xe40D80Bd58CEE55DCC2598724d7F1e03E206581D","0xB3b60932E598fe946169EC209A197184Bad760B7","0xee7Fb91D5b776C326a728dc70e917F82d6809E3C","0x475816ca2a31D601B4e336f5c2418A67978aBf09","0xa0683d725420e2F75415806352Cd9c3fE10Fa960","0x0275b3D54a5dDbf8205A75984796eFE8b7357Bae"]},{"name":"_nonce","value":2}],"address":"0x9BF7b8884Fa381a45f8CB2525905fb36C996297a","calldata":"0x536d8944000000000000000000000000423552c0f05baccac5bfa91c6dcf1dc53a0a164100000000000000000000000000000000000000000000000000000000000000600000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000000c0000000000000000000000003bd8e2ac65ad6f0f094ba6766cbd9484ab49ef23000000000000000000000000f8e1492255d9428c2fc20a98a1deb1215c8ffefd000000000000000000000000b07dc9103328a51128bc6cc1049d1137035f5e280000000000000000000000003e286452b1c66abb08eb5494c3894f40ab5a59af000000000000000000000000b71ca4ffbb7b58d75ba29891ab45e9dc12b444ed0000000000000000000000008f10e3413586c4a8dcfce19d009872b19e9cd8e3000000000000000000000000e40d80bd58cee55dcc2598724d7f1e03e206581d000000000000000000000000b3b60932e598fe946169ec209a197184bad760b7000000000000000000000000ee7fb91d5b776c326a728dc70e917f82d6809e3c000000000000000000000000475816ca2a31d601b4e336f5c2418a67978abf09000000000000000000000000a0683d725420e2f75415806352cd9c3fe10fa9600000000000000000000000000275b3d54a5ddbf8205a75984796efe8b7357bae","executor":"0xCF57572261c7c2BCF21ffD220ea7d1a27D40A827","inboxOnEthereum":"0x4Dbd4fc535Ac27206064B68FfCf827b0A60BAB3f"},"raw":{"target":"0xa723C008e76E379c55599D2E4d93879BeaFDa79C","value":0,"data":"0x0000000000000000000000004dbd4fc535ac27206064b68ffcf827b0a60bab3f000000000000000000000000cf57572261c7c2bcf21ffd220ea7d1a27d40a82700000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000c000000000000000000000000000000000000000000000000000000000000002841cff79cd0000000000000000000000009bf7b8884fa381a45f8cb2525905fb36c996297a00000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000204536d8944000000000000000000000000423552c0f05baccac5bfa91c6dcf1dc53a0a164100000000000000000000000000000000000000000000000000000000000000600000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000000c0000000000000000000000003bd8e2ac65ad6f0f094ba6766cbd9484ab49ef23000000000000000000000000f8e1492255d9428c2fc20a98a1deb1215c8ffefd000000000000000000000000b07dc9103328a51128bc6cc1049d1137035f5e280000000000000000000000003e286452b1c66abb08eb5494c3894f40ab5a59af000000000000000000000000b71ca4ffbb7b58d75ba29891ab45e9dc12b444ed0000000000000000000000008f10e3413586c4a8dcfce19d009872b19e9cd8e3000000000000000000000000e40d80bd58cee55dcc2598724d7f1e03e206581d000000000000000000000000b3b60932e598fe946169ec209a197184bad760b7000000000000000000000000ee7fb91d5b776c326a728dc70e917f82d6809e3c000000000000000000000000475816ca2a31d601b4e336f5c2418a67978abf09000000000000000000000000a0683d725420e2f75415806352cd9c3fe10fa9600000000000000000000000000275b3d54a5ddbf8205a75984796efe8b7357bae0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000","delay":259200}}
      values.scheduledTransactions.28:
+        {"id":"0xd1eea9e87f3c665209dcd7f963295df40e79119668d6417794d36891994a3bad","decoded":{"chain":"ethereum","contractName":"SecurityCouncilMemberSyncAction","function":"perform","inputs":[{"name":"_securityCouncil","value":"0xF06E95eF589D9c38af242a8AAee8375f14023F85"},{"name":"_updatedMembers","value":["0x3Bd8e2AC65ad6f0F094BA6766cBd9484AB49eF23","0xf8e1492255d9428c2Fc20A98A1DeB1215C8ffEfd","0xb07dc9103328A51128bC6Cc1049d1137035f5E28","0x3E286452b1C66abB08Eb5494c3894F40aB5a59AF","0xb71ca4FFbB7b58d75Ba29891ab45e9Dc12B444Ed","0x8F10e3413586c4a8DCfcE19D009872b19e9cd8E3","0xe40D80Bd58CEE55DCC2598724d7F1e03E206581D","0xB3b60932E598fe946169EC209A197184Bad760B7","0xee7Fb91D5b776C326a728dc70e917F82d6809E3C","0x475816ca2a31D601B4e336f5c2418A67978aBf09","0xa0683d725420e2F75415806352Cd9c3fE10Fa960","0x0275b3D54a5dDbf8205A75984796eFE8b7357Bae"]},{"name":"_nonce","value":2}],"address":"0x9BF7b8884Fa381a45f8CB2525905fb36C996297a","calldata":"0x536d8944000000000000000000000000f06e95ef589d9c38af242a8aaee8375f14023f8500000000000000000000000000000000000000000000000000000000000000600000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000000c0000000000000000000000003bd8e2ac65ad6f0f094ba6766cbd9484ab49ef23000000000000000000000000f8e1492255d9428c2fc20a98a1deb1215c8ffefd000000000000000000000000b07dc9103328a51128bc6cc1049d1137035f5e280000000000000000000000003e286452b1c66abb08eb5494c3894f40ab5a59af000000000000000000000000b71ca4ffbb7b58d75ba29891ab45e9dc12b444ed0000000000000000000000008f10e3413586c4a8dcfce19d009872b19e9cd8e3000000000000000000000000e40d80bd58cee55dcc2598724d7f1e03e206581d000000000000000000000000b3b60932e598fe946169ec209a197184bad760b7000000000000000000000000ee7fb91d5b776c326a728dc70e917f82d6809e3c000000000000000000000000475816ca2a31d601b4e336f5c2418a67978abf09000000000000000000000000a0683d725420e2f75415806352cd9c3fe10fa9600000000000000000000000000275b3d54a5ddbf8205a75984796efe8b7357bae","executor":"0x3ffFbAdAF827559da092217e474760E2b2c3CeDd"},"raw":{"target":"0x3ffFbAdAF827559da092217e474760E2b2c3CeDd","value":0,"data":"0x1cff79cd0000000000000000000000009bf7b8884fa381a45f8cb2525905fb36c996297a00000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000204536d8944000000000000000000000000f06e95ef589d9c38af242a8aaee8375f14023f8500000000000000000000000000000000000000000000000000000000000000600000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000000c0000000000000000000000003bd8e2ac65ad6f0f094ba6766cbd9484ab49ef23000000000000000000000000f8e1492255d9428c2fc20a98a1deb1215c8ffefd000000000000000000000000b07dc9103328a51128bc6cc1049d1137035f5e280000000000000000000000003e286452b1c66abb08eb5494c3894f40ab5a59af000000000000000000000000b71ca4ffbb7b58d75ba29891ab45e9dc12b444ed0000000000000000000000008f10e3413586c4a8dcfce19d009872b19e9cd8e3000000000000000000000000e40d80bd58cee55dcc2598724d7f1e03e206581d000000000000000000000000b3b60932e598fe946169ec209a197184bad760b7000000000000000000000000ee7fb91d5b776c326a728dc70e917f82d6809e3c000000000000000000000000475816ca2a31d601b4e336f5c2418a67978abf09000000000000000000000000a0683d725420e2f75415806352cd9c3fe10fa9600000000000000000000000000275b3d54a5ddbf8205a75984796efe8b7357bae00000000000000000000000000000000000000000000000000000000","delay":259200}}
    }
```

Generated with discovered.json: 0x2942b7b4de0af0b24013741eee5e4178e28668d4

# Diff at Thu, 04 Apr 2024 09:48:09 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@867bb633ffb1ced5b037cf9e9116dcf019a58dbf block: 19488784
- current block number: 19581597

## Description

Human-readable multisig thresholds were automatically added by new version of
discovery.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19488784 (main branch discovery), not current.

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
    contract SecurityCouncil (0xF06E95eF589D9c38af242a8AAee8375f14023F85) {
    +++ description: None
      upgradeability.threshold:
+        "9 of 12 (75%)"
    }
```

Generated with discovered.json: 0x3ea08e093c4fc78a79b685a42dbbadc7258c49c0

# Diff at Fri, 22 Mar 2024 07:51:09 GMT:

- author: vincfurc (<10850139+vincfurc@users.noreply.github.com>)
- comparing to: main@173befb1ef4ba15605c92f5f89227f2ffd2af3eb block: 19419824
- current block number: 19488784

## Description

- changed futureBlocks from 12 to 64, changed futureSeconds from 3600 to 768. The futureBlocks value in the SequencerInbox enforces a max block height that a batch can be posted relative to the current block (likewise with futureSeconds). A small value for future blocks means that a relatively small L1 reorg can cause an otherwise valid batch to revert. The increase to 64, two epochs, is in line with Ethereum’s finality guarantees. The futureSeconds value is set to correspond to the new futureBlocks value (64\*12s).
- added a batchPosterManager multisig. It can update whether an address is authorized to be a batch poster at the sequencer inbox. The DAO still has the same ability to revoke the Sequencer role; i.e., the DAO could update the batch poster manager (along with any batch posters).
- updated wasmModuleRoot to ArbOS v20. List of changes:
  https://forum.arbitrum.foundation/t/aip-arbos-version-20-atlas/20957
- redeployed OneStepProofEntry, OneStepProverHostIo, OneStepProverMath, OneStepProver0, OneStepProverMemory to be compatible with EIP-4844
- changed ChallengeManager implementation - set the new OneStepProver for EIP-4844
- changed SequencerInbox implementation:
- added flag readers. The data posted has initial bytes used as certificate for certain flags, such as to show the data has used a certain merkelization strategy, or compression scheme: https://github.com/OffchainLabs/nitro/blob/69de0603abf6f900a4128cab7933df60cad54ded/arbstate/das_reader.go - removed already deprecated function - added check if sequencerInbox is deployed on an Arbitrum chain (for L3s?). If data is posted with eip4844 format, since EIP 4844 is not supported on Arbitrum chains, it will revert. - set the batch poster manager multisig that can rotate batcher keys.
- timelock transactions:
- arbitrum: - AIP1Point2Action.perform - AIP4Action.perform - GovernanceChainSCMgmtActivationAction.perform - UpdateGasChargeAction.perform - SetSweepReceiverAction.perform - SecurityCouncilMemberSyncAction.perform - SetArbOS11VersionAction.perform - NomineeGovernorV2UpgradeAction.perform - SetArbOS20VersionAction - ArbOneSetAtlasL1PricingRewardAction - ArbOneSetAtlasMinBaseFeeAction
- ethereum: - L1SCMgmtActivationAction.perform - UpdateL1CoreTimelockAction.perform - SecurityCouncilMemberSyncAction.perform - AddNovaKeysetAction.perform - SetArbOneArbOS11ModuleRootAciton.perform - SetNovaArbOS11ModuleRootAction.perform - AIPSetSequencerInboxMaxTimeVariationArbOneAction - AIPSetSequencerInboxMaxTimeVariationNovaAction - ArbOneAIP4844Action - ArbOneSetBatchPosterManagerAction - NovaSetBatchPosterManagerAction
- nova: - NonGovernanceChainSCMgmtActivationAction.perfom - SecurityCouncilMemberSyncAction - SetArbOS11VersionAction - NovaAIP4844Action - SetArbOS20VersionAction

## Watched changes

```diff
    contract SequencerInbox (0x1c479675ad559DC151F6Ec7ed3FbF8ceE79582B6) {
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
    contract OneStepProofEntry (0x3E1f62AA8076000c3218493FE3e0Ae40bcB9A1DF)
    +++ description: None
```

```diff
-   Status: DELETED
    contract OneStepProver0 (0x499A4f574f2e4F8837E242adEc86223Ef7DeEfcC)
    +++ description: None
```

```diff
    contract RollupProxy (0x5eF0D09d1E6204141B4d37530808eD19f60FBa35) {
    +++ description: None
      values.wasmModuleRoot:
-        "0xf4389b835497a910d7ba3ebfb77aa93da985634f3c052de1290360635be40c4a"
+        "0x8b104a2e80ac6165dc58b9048de12f301d70b02a0ab51396c22b4b4b802a16a4"
    }
```

```diff
-   Status: DELETED
    contract OneStepProverMemory (0xb556F3Bb0FdCFeAf81a1c393e024a69a3327B676)
    +++ description: None
```

```diff
-   Status: DELETED
    contract OneStepProverHostIo (0xb965b08A826D4C7634e0Df4c5eF5E1d1f9b5D13A)
    +++ description: None
```

```diff
-   Status: DELETED
    contract OneStepProverMath (0xd315Ac3a82E8EDAA84b347F478e0F59801747970)
    +++ description: None
```

```diff
    contract ChallengeManager (0xe5896783a2F463446E1f624e64Aa6836BE4C6f58) {
    +++ description: None
      upgradeability.implementation:
-        "0x1c78B622961f27Ccc2f9BA65E2ba5d5eB301a445"
+        "0xE129b8Aa61dF65cBDbAE4345eE3fb40168DfD566"
      implementations.0:
-        "0x1c78B622961f27Ccc2f9BA65E2ba5d5eB301a445"
+        "0xE129b8Aa61dF65cBDbAE4345eE3fb40168DfD566"
      values.osp:
-        "0x3E1f62AA8076000c3218493FE3e0Ae40bcB9A1DF"
+        "0xC6E1E6dB03c3F475bC760FE20ed93401EC5c4F7e"
    }
```

```diff
    contract L1ArbitrumTimelock (0xE6841D92B0C345144506576eC13ECf5103aC7f49) {
    +++ description: None
      values.scheduledTransactions.27:
+        {"id":"0xdda98e62c0827b0ea976efa9fa7eab4086f6ecc5aa6715e02868bb2972b12cad","decoded":{"chain":"arbitrum","contractName":"ArbOneSetAtlasMinBaseFeeAction","function":"perform","inputs":[],"address":"0x849E360a247132F961c9CBE95Ba39106c72e1268","calldata":"0xb147f40c","executor":"0xCF57572261c7c2BCF21ffD220ea7d1a27D40A827","inboxOnEthereum":"0x4Dbd4fc535Ac27206064B68FfCf827b0A60BAB3f"},"raw":{"target":"0xa723C008e76E379c55599D2E4d93879BeaFDa79C","value":0,"data":"0x0000000000000000000000004dbd4fc535ac27206064b68ffcf827b0a60bab3f000000000000000000000000cf57572261c7c2bcf21ffd220ea7d1a27d40a82700000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000c000000000000000000000000000000000000000000000000000000000000000841cff79cd000000000000000000000000849e360a247132f961c9cbe95ba39106c72e126800000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000004b147f40c0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000","delay":259200}}
      values.scheduledTransactions.26:
+        {"id":"0xdda98e62c0827b0ea976efa9fa7eab4086f6ecc5aa6715e02868bb2972b12cad","decoded":{"chain":"arbitrum","contractName":"ArbOneSetAtlasL1PricingRewardAction","function":"perform","inputs":[],"address":"0x36D0170D92F66e8949eB276C3AC4FEA64f83704d","calldata":"0xb147f40c","executor":"0xCF57572261c7c2BCF21ffD220ea7d1a27D40A827","inboxOnEthereum":"0x4Dbd4fc535Ac27206064B68FfCf827b0A60BAB3f"},"raw":{"target":"0xa723C008e76E379c55599D2E4d93879BeaFDa79C","value":0,"data":"0x0000000000000000000000004dbd4fc535ac27206064b68ffcf827b0a60bab3f000000000000000000000000cf57572261c7c2bcf21ffd220ea7d1a27d40a82700000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000c000000000000000000000000000000000000000000000000000000000000000841cff79cd00000000000000000000000036d0170d92f66e8949eb276c3ac4fea64f83704d00000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000004b147f40c0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000","delay":259200}}
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
 .../implementation/src/bridge/IBridge.sol          |  48 +-
 .../src/bridge/IDelayedMessageProvider.sol         |   2 +-
 .../implementation/src/bridge/IOwnable.sol         |   2 +-
 .../implementation/src/bridge/ISequencerInbox.sol  | 124 ++++-
 .../implementation/src/challenge/ChallengeLib.sol  |   2 +-
 .../src/challenge/ChallengeManager.sol             |  19 +-
 .../src/challenge/IChallengeManager.sol            |   4 +-
 .../src/challenge/IChallengeResultReceiver.sol     |   2 +-
 .../implementation/src/libraries/Constants.sol     |   8 +-
 .../src/libraries/DelegateCallAware.sol            |   2 +-
 .../implementation/src/libraries/Error.sol         |  60 ++-
 .../implementation/src/libraries/IGasRefunder.sol  |  24 +-
 .../implementation/src/osp/IOneStepProofEntry.sol  |   2 +-
 .../implementation/src/osp/IOneStepProver.sol      |   3 +-
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
 .../OneStepProofEntry/meta.txt                     |   2 +-
 .../OneStepProofEntry/src/bridge/IBridge.sol       |  48 +-
 .../src/bridge/IDelayedMessageProvider.sol         |   2 +-
 .../OneStepProofEntry/src/bridge/IOwnable.sol      |   2 +-
 .../src/bridge/ISequencerInbox.sol                 | 124 ++++-
 .../src/libraries/IGasRefunder.sol                 |  24 +-
 .../src/osp/IOneStepProofEntry.sol                 |   2 +-
 .../OneStepProofEntry/src/osp/IOneStepProver.sol   |   3 +-
 .../src/osp/OneStepProofEntry.sol                  |   2 +-
 .../OneStepProofEntry/src/state/Deserialize.sol    |   4 +-
 .../OneStepProofEntry/src/state/GlobalState.sol    |   2 +-
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
 .../OneStepProver0/src/bridge/IBridge.sol          |  48 +-
 .../src/bridge/IDelayedMessageProvider.sol         |   2 +-
 .../OneStepProver0/src/bridge/IOwnable.sol         |   2 +-
 .../OneStepProver0/src/bridge/ISequencerInbox.sol  | 124 ++++-
 .../OneStepProver0/src/libraries/IGasRefunder.sol  |  24 +-
 .../OneStepProver0/src/osp/IOneStepProver.sol      |   3 +-
 .../OneStepProver0/src/osp/OneStepProver0.sol      |   2 +-
 .../OneStepProver0/src/state/Deserialize.sol       |   4 +-
 .../OneStepProver0/src/state/GlobalState.sol       |   2 +-
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
 .../OneStepProverHostIo/src/bridge/IBridge.sol     |  48 +-
 .../src/bridge/IDelayedMessageProvider.sol         |   2 +-
 .../OneStepProverHostIo/src/bridge/IOwnable.sol    |   2 +-
 .../src/bridge/ISequencerInbox.sol                 | 124 ++++-
 .../OneStepProverHostIo/src/bridge/Messages.sol    |   2 +-
 .../src/libraries/IGasRefunder.sol                 |  24 +-
 .../OneStepProverHostIo/src/osp/IOneStepProver.sol |   3 +-
 .../src/osp/OneStepProverHostIo.sol                | 110 +++-
 .../OneStepProverHostIo/src/state/Deserialize.sol  |   4 +-
 .../OneStepProverHostIo/src/state/GlobalState.sol  |   2 +-
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
 .../OneStepProverMath/src/bridge/IBridge.sol       |  48 +-
 .../src/bridge/IDelayedMessageProvider.sol         |   2 +-
 .../OneStepProverMath/src/bridge/IOwnable.sol      |   2 +-
 .../src/bridge/ISequencerInbox.sol                 | 124 ++++-
 .../src/libraries/IGasRefunder.sol                 |  24 +-
 .../OneStepProverMath/src/osp/IOneStepProver.sol   |   3 +-
 .../src/osp/OneStepProverMath.sol                  |   2 +-
 .../OneStepProverMath/src/state/Deserialize.sol    |   4 +-
 .../OneStepProverMath/src/state/GlobalState.sol    |   2 +-
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
 .../OneStepProverMemory/src/bridge/IBridge.sol     |  48 +-
 .../src/bridge/IDelayedMessageProvider.sol         |   2 +-
 .../OneStepProverMemory/src/bridge/IOwnable.sol    |   2 +-
 .../src/bridge/ISequencerInbox.sol                 | 124 ++++-
 .../src/libraries/IGasRefunder.sol                 |  24 +-
 .../OneStepProverMemory/src/osp/IOneStepProver.sol |   3 +-
 .../src/osp/OneStepProverMemory.sol                |   3 +-
 .../OneStepProverMemory/src/state/Deserialize.sol  |   4 +-
 .../OneStepProverMemory/src/state/GlobalState.sol  |   2 +-
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
 .../arbitrum/ethereum/.code/meta.txt               |   2 +
 191 files changed, 3654 insertions(+), 2259 deletions(-)
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19419824 (main branch discovery), not current.

```diff
    contract L1ArbitrumTimelock (0xE6841D92B0C345144506576eC13ECf5103aC7f49) {
    +++ description: None
      values.scheduledTransactions.25.target:
-        "0xa723C008e76E379c55599D2E4d93879BeaFDa79C"
      values.scheduledTransactions.25.value:
-        0
      values.scheduledTransactions.25.data:
-        "0x000000000000000000000000c4448b71118c9071bcb9734a0eac55d18a15394900000000000000000000000086a02dd71363c440b21f4c0e5b2ad01ffe1a748200000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000c000000000000000000000000000000000000000000000000000000000000000841cff79cd0000000000000000000000003e313eeed58e851ca3841c6109697b9eb35c772600000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000004b147f40c0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000"
      values.scheduledTransactions.25.delay:
-        259200
      values.scheduledTransactions.25.decoded:
+        {"chain":"nova","address":"0x3E313Eeed58E851CA3841C6109697B9eb35C7726","calldata":"0xb147f40c","executor":"0x86a02dD71363c440b21F4c0E5B2Ad01Ffe1A7482","inboxOnEthereum":"0xc4448b71118c9071Bcb9734A0EAc55D18A153949"}
      values.scheduledTransactions.25.raw:
+        {"target":"0xa723C008e76E379c55599D2E4d93879BeaFDa79C","value":0,"data":"0x000000000000000000000000c4448b71118c9071bcb9734a0eac55d18a15394900000000000000000000000086a02dd71363c440b21f4c0e5b2ad01ffe1a748200000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000c000000000000000000000000000000000000000000000000000000000000000841cff79cd0000000000000000000000003e313eeed58e851ca3841c6109697b9eb35c772600000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000004b147f40c0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000","delay":259200}
      values.scheduledTransactions.24.target:
-        "0xa723C008e76E379c55599D2E4d93879BeaFDa79C"
      values.scheduledTransactions.24.value:
-        0
      values.scheduledTransactions.24.data:
-        "0x0000000000000000000000004dbd4fc535ac27206064b68ffcf827b0a60bab3f000000000000000000000000cf57572261c7c2bcf21ffd220ea7d1a27d40a82700000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000c000000000000000000000000000000000000000000000000000000000000000841cff79cd0000000000000000000000003e313eeed58e851ca3841c6109697b9eb35c772600000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000004b147f40c0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000"
      values.scheduledTransactions.24.delay:
-        259200
      values.scheduledTransactions.24.decoded:
+        {"chain":"arbitrum","contractName":"SetArbOS20VersionAction","function":"perform","inputs":[],"address":"0x3E313Eeed58E851CA3841C6109697B9eb35C7726","calldata":"0xb147f40c","executor":"0xCF57572261c7c2BCF21ffD220ea7d1a27D40A827","inboxOnEthereum":"0x4Dbd4fc535Ac27206064B68FfCf827b0A60BAB3f"}
      values.scheduledTransactions.24.raw:
+        {"target":"0xa723C008e76E379c55599D2E4d93879BeaFDa79C","value":0,"data":"0x0000000000000000000000004dbd4fc535ac27206064b68ffcf827b0a60bab3f000000000000000000000000cf57572261c7c2bcf21ffd220ea7d1a27d40a82700000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000c000000000000000000000000000000000000000000000000000000000000000841cff79cd0000000000000000000000003e313eeed58e851ca3841c6109697b9eb35c772600000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000004b147f40c0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000","delay":259200}
      values.scheduledTransactions.23.target:
-        "0x3ffFbAdAF827559da092217e474760E2b2c3CeDd"
      values.scheduledTransactions.23.value:
-        0
      values.scheduledTransactions.23.data:
-        "0x1cff79cd000000000000000000000000501f30810d2b0eaec15cc3785dbb29e4a8a92a7000000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000004b147f40c00000000000000000000000000000000000000000000000000000000"
      values.scheduledTransactions.23.delay:
-        259200
      values.scheduledTransactions.23.decoded:
+        {"chain":"ethereum","contractName":"NovaSetBatchPosterManagerAction","function":"perform","inputs":[],"address":"0x501f30810D2b0EaEC15Cc3785dBB29e4a8a92a70","calldata":"0xb147f40c","executor":"0x3ffFbAdAF827559da092217e474760E2b2c3CeDd"}
      values.scheduledTransactions.23.raw:
+        {"target":"0x3ffFbAdAF827559da092217e474760E2b2c3CeDd","value":0,"data":"0x1cff79cd000000000000000000000000501f30810d2b0eaec15cc3785dbb29e4a8a92a7000000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000004b147f40c00000000000000000000000000000000000000000000000000000000","delay":259200}
      values.scheduledTransactions.22.target:
-        "0x3ffFbAdAF827559da092217e474760E2b2c3CeDd"
      values.scheduledTransactions.22.value:
-        0
      values.scheduledTransactions.22.data:
-        "0x1cff79cd000000000000000000000000874356173cfd6c739aeab1f5abfb5f3afb3d4d3300000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000004b147f40c00000000000000000000000000000000000000000000000000000000"
      values.scheduledTransactions.22.delay:
-        259200
      values.scheduledTransactions.22.decoded:
+        {"chain":"ethereum","contractName":"NovaAIP4844Action","function":"perform","inputs":[],"address":"0x874356173CFd6C739aeab1F5ABfB5F3AFB3d4d33","calldata":"0xb147f40c","executor":"0x3ffFbAdAF827559da092217e474760E2b2c3CeDd"}
      values.scheduledTransactions.22.raw:
+        {"target":"0x3ffFbAdAF827559da092217e474760E2b2c3CeDd","value":0,"data":"0x1cff79cd000000000000000000000000874356173cfd6c739aeab1f5abfb5f3afb3d4d3300000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000004b147f40c00000000000000000000000000000000000000000000000000000000","delay":259200}
      values.scheduledTransactions.21.target:
-        "0x3ffFbAdAF827559da092217e474760E2b2c3CeDd"
      values.scheduledTransactions.21.value:
-        0
      values.scheduledTransactions.21.data:
-        "0x1cff79cd000000000000000000000000ce0af261eb511cb41b8d0a2e31df80ba37e265ab00000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000004b147f40c00000000000000000000000000000000000000000000000000000000"
      values.scheduledTransactions.21.delay:
-        259200
      values.scheduledTransactions.21.decoded:
+        {"chain":"ethereum","contractName":"ArbOneSetBatchPosterManagerAction","function":"perform","inputs":[],"address":"0xCe0aF261EB511CB41b8D0A2e31DF80BA37e265aB","calldata":"0xb147f40c","executor":"0x3ffFbAdAF827559da092217e474760E2b2c3CeDd"}
      values.scheduledTransactions.21.raw:
+        {"target":"0x3ffFbAdAF827559da092217e474760E2b2c3CeDd","value":0,"data":"0x1cff79cd000000000000000000000000ce0af261eb511cb41b8d0a2e31df80ba37e265ab00000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000004b147f40c00000000000000000000000000000000000000000000000000000000","delay":259200}
      values.scheduledTransactions.20.target:
-        "0x3ffFbAdAF827559da092217e474760E2b2c3CeDd"
      values.scheduledTransactions.20.value:
-        0
      values.scheduledTransactions.20.data:
-        "0x1cff79cd00000000000000000000000076d8e97cd4514bebbc21d2044ff4a8d9ea1f0cc400000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000004b147f40c00000000000000000000000000000000000000000000000000000000"
      values.scheduledTransactions.20.delay:
-        259200
      values.scheduledTransactions.20.decoded:
+        {"chain":"ethereum","contractName":"ArbOneAIP4844Action","function":"perform","inputs":[],"address":"0x76D8e97Cd4514bebBc21d2044fF4a8d9eA1f0CC4","calldata":"0xb147f40c","executor":"0x3ffFbAdAF827559da092217e474760E2b2c3CeDd"}
      values.scheduledTransactions.20.raw:
+        {"target":"0x3ffFbAdAF827559da092217e474760E2b2c3CeDd","value":0,"data":"0x1cff79cd00000000000000000000000076d8e97cd4514bebbc21d2044ff4a8d9ea1f0cc400000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000004b147f40c00000000000000000000000000000000000000000000000000000000","delay":259200}
      values.scheduledTransactions.19.target:
-        "0x3ffFbAdAF827559da092217e474760E2b2c3CeDd"
      values.scheduledTransactions.19.value:
-        0
      values.scheduledTransactions.19.data:
-        "0x1cff79cd00000000000000000000000047a85c0a118127f3968a6a1a61e2a326517540d400000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000004b147f40c00000000000000000000000000000000000000000000000000000000"
      values.scheduledTransactions.19.delay:
-        259200
      values.scheduledTransactions.19.decoded:
+        {"chain":"ethereum","contractName":"AIPSetSequencerInboxMaxTimeVariationNovaAction","function":"perform","inputs":[],"address":"0x47a85C0a118127F3968A6A1A61e2a326517540D4","calldata":"0xb147f40c","executor":"0x3ffFbAdAF827559da092217e474760E2b2c3CeDd"}
      values.scheduledTransactions.19.raw:
+        {"target":"0x3ffFbAdAF827559da092217e474760E2b2c3CeDd","value":0,"data":"0x1cff79cd00000000000000000000000047a85c0a118127f3968a6a1a61e2a326517540d400000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000004b147f40c00000000000000000000000000000000000000000000000000000000","delay":259200}
      values.scheduledTransactions.18.target:
-        "0x3ffFbAdAF827559da092217e474760E2b2c3CeDd"
      values.scheduledTransactions.18.value:
-        0
      values.scheduledTransactions.18.data:
-        "0x1cff79cd0000000000000000000000003e313eeed58e851ca3841c6109697b9eb35c772600000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000004b147f40c00000000000000000000000000000000000000000000000000000000"
      values.scheduledTransactions.18.delay:
-        259200
      values.scheduledTransactions.18.decoded:
+        {"chain":"ethereum","contractName":"AIPSetSequencerInboxMaxTimeVariationArbOneAction","function":"perform","inputs":[],"address":"0x3E313Eeed58E851CA3841C6109697B9eb35C7726","calldata":"0xb147f40c","executor":"0x3ffFbAdAF827559da092217e474760E2b2c3CeDd"}
      values.scheduledTransactions.18.raw:
+        {"target":"0x3ffFbAdAF827559da092217e474760E2b2c3CeDd","value":0,"data":"0x1cff79cd0000000000000000000000003e313eeed58e851ca3841c6109697b9eb35c772600000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000004b147f40c00000000000000000000000000000000000000000000000000000000","delay":259200}
      values.scheduledTransactions.17.target:
-        "0xa723C008e76E379c55599D2E4d93879BeaFDa79C"
      values.scheduledTransactions.17.value:
-        0
      values.scheduledTransactions.17.data:
-        "0x0000000000000000000000004dbd4fc535ac27206064b68ffcf827b0a60bab3f000000000000000000000000cf57572261c7c2bcf21ffd220ea7d1a27d40a82700000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000c000000000000000000000000000000000000000000000000000000000000000841cff79cd000000000000000000000000d9a2e0e5d7509f0bf1b2d33884f8c1b4d449087900000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000004b147f40c0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000"
      values.scheduledTransactions.17.delay:
-        259200
      values.scheduledTransactions.17.decoded:
+        {"chain":"arbitrum","contractName":"NomineeGovernorV2UpgradeAction","function":"perform","inputs":[],"address":"0xd9a2e0E5d7509F0BF1B2d33884F8C1b4D4490879","calldata":"0xb147f40c","executor":"0xCF57572261c7c2BCF21ffD220ea7d1a27D40A827","inboxOnEthereum":"0x4Dbd4fc535Ac27206064B68FfCf827b0A60BAB3f"}
      values.scheduledTransactions.17.raw:
+        {"target":"0xa723C008e76E379c55599D2E4d93879BeaFDa79C","value":0,"data":"0x0000000000000000000000004dbd4fc535ac27206064b68ffcf827b0a60bab3f000000000000000000000000cf57572261c7c2bcf21ffd220ea7d1a27d40a82700000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000c000000000000000000000000000000000000000000000000000000000000000841cff79cd000000000000000000000000d9a2e0e5d7509f0bf1b2d33884f8c1b4d449087900000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000004b147f40c0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000","delay":259200}
      values.scheduledTransactions.16.target:
-        "0xa723C008e76E379c55599D2E4d93879BeaFDa79C"
      values.scheduledTransactions.16.value:
-        0
      values.scheduledTransactions.16.data:
-        "0x000000000000000000000000c4448b71118c9071bcb9734a0eac55d18a15394900000000000000000000000086a02dd71363c440b21f4c0e5b2ad01ffe1a748200000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000c000000000000000000000000000000000000000000000000000000000000000841cff79cd0000000000000000000000005357f4d3e8f8250a77bcddd5e58886ad1358220c00000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000004b147f40c0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000"
      values.scheduledTransactions.16.delay:
-        259200
      values.scheduledTransactions.16.decoded:
+        {"chain":"nova","address":"0x5357f4D3e8f8250A77bcddd5E58886AD1358220c","calldata":"0xb147f40c","executor":"0x86a02dD71363c440b21F4c0E5B2Ad01Ffe1A7482","inboxOnEthereum":"0xc4448b71118c9071Bcb9734A0EAc55D18A153949"}
      values.scheduledTransactions.16.raw:
+        {"target":"0xa723C008e76E379c55599D2E4d93879BeaFDa79C","value":0,"data":"0x000000000000000000000000c4448b71118c9071bcb9734a0eac55d18a15394900000000000000000000000086a02dd71363c440b21f4c0e5b2ad01ffe1a748200000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000c000000000000000000000000000000000000000000000000000000000000000841cff79cd0000000000000000000000005357f4d3e8f8250a77bcddd5e58886ad1358220c00000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000004b147f40c0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000","delay":259200}
      values.scheduledTransactions.15.target:
-        "0xa723C008e76E379c55599D2E4d93879BeaFDa79C"
      values.scheduledTransactions.15.value:
-        0
      values.scheduledTransactions.15.data:
-        "0x0000000000000000000000004dbd4fc535ac27206064b68ffcf827b0a60bab3f000000000000000000000000cf57572261c7c2bcf21ffd220ea7d1a27d40a82700000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000c000000000000000000000000000000000000000000000000000000000000000841cff79cd000000000000000000000000f6c7dc6eae78abf2f32df899654ca425dfa9948100000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000004b147f40c0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000"
      values.scheduledTransactions.15.delay:
-        259200
      values.scheduledTransactions.15.decoded:
+        {"chain":"arbitrum","contractName":"SetArbOS11VersionAction","function":"perform","inputs":[],"address":"0xF6c7Dc6eaE78aBF2f32df899654ca425Dfa99481","calldata":"0xb147f40c","executor":"0xCF57572261c7c2BCF21ffD220ea7d1a27D40A827","inboxOnEthereum":"0x4Dbd4fc535Ac27206064B68FfCf827b0A60BAB3f"}
      values.scheduledTransactions.15.raw:
+        {"target":"0xa723C008e76E379c55599D2E4d93879BeaFDa79C","value":0,"data":"0x0000000000000000000000004dbd4fc535ac27206064b68ffcf827b0a60bab3f000000000000000000000000cf57572261c7c2bcf21ffd220ea7d1a27d40a82700000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000c000000000000000000000000000000000000000000000000000000000000000841cff79cd000000000000000000000000f6c7dc6eae78abf2f32df899654ca425dfa9948100000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000004b147f40c0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000","delay":259200}
      values.scheduledTransactions.14.target:
-        "0x3ffFbAdAF827559da092217e474760E2b2c3CeDd"
      values.scheduledTransactions.14.value:
-        0
      values.scheduledTransactions.14.data:
-        "0x1cff79cd00000000000000000000000054c2c372943572ac2a8e84d502ebc13f14b6224600000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000004b147f40c00000000000000000000000000000000000000000000000000000000"
      values.scheduledTransactions.14.delay:
-        259200
      values.scheduledTransactions.14.decoded:
+        {"chain":"ethereum","contractName":"SetNovaArbOS11ModuleRootAction","function":"perform","inputs":[],"address":"0x54c2C372943572Ac2a8E84D502ebc13F14B62246","calldata":"0xb147f40c","executor":"0x3ffFbAdAF827559da092217e474760E2b2c3CeDd"}
      values.scheduledTransactions.14.raw:
+        {"target":"0x3ffFbAdAF827559da092217e474760E2b2c3CeDd","value":0,"data":"0x1cff79cd00000000000000000000000054c2c372943572ac2a8e84d502ebc13f14b6224600000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000004b147f40c00000000000000000000000000000000000000000000000000000000","delay":259200}
      values.scheduledTransactions.13.target:
-        "0x3ffFbAdAF827559da092217e474760E2b2c3CeDd"
      values.scheduledTransactions.13.value:
-        0
      values.scheduledTransactions.13.data:
-        "0x1cff79cd0000000000000000000000003b70f2da6f3b01f9a53dcbcb3e59ad3ad8bed92400000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000004b147f40c00000000000000000000000000000000000000000000000000000000"
      values.scheduledTransactions.13.delay:
-        259200
      values.scheduledTransactions.13.decoded:
+        {"chain":"ethereum","contractName":"SetArbOneArbOS11ModuleRootAciton","function":"perform","inputs":[],"address":"0x3b70f2Da6F3b01F9a53dCBcB3e59AD3ad8bed924","calldata":"0xb147f40c","executor":"0x3ffFbAdAF827559da092217e474760E2b2c3CeDd"}
      values.scheduledTransactions.13.raw:
+        {"target":"0x3ffFbAdAF827559da092217e474760E2b2c3CeDd","value":0,"data":"0x1cff79cd0000000000000000000000003b70f2da6f3b01f9a53dcbcb3e59ad3ad8bed92400000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000004b147f40c00000000000000000000000000000000000000000000000000000000","delay":259200}
      values.scheduledTransactions.12.target:
-        "0x3ffFbAdAF827559da092217e474760E2b2c3CeDd"
      values.scheduledTransactions.12.value:
-        0
      values.scheduledTransactions.12.data:
-        "0x1cff79cd000000000000000000000000def5cfe3246882bc7f65f9346a8b974ba27d3f4e00000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000004b147f40c00000000000000000000000000000000000000000000000000000000"
      values.scheduledTransactions.12.delay:
-        259200
      values.scheduledTransactions.12.decoded:
+        {"chain":"ethereum","contractName":"AddNovaKeysetAction","function":"perform","inputs":[],"address":"0xDef5CfE3246882BC7f65F9346a8b974BA27D3F4E","calldata":"0xb147f40c","executor":"0x3ffFbAdAF827559da092217e474760E2b2c3CeDd"}
      values.scheduledTransactions.12.raw:
+        {"target":"0x3ffFbAdAF827559da092217e474760E2b2c3CeDd","value":0,"data":"0x1cff79cd000000000000000000000000def5cfe3246882bc7f65f9346a8b974ba27d3f4e00000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000004b147f40c00000000000000000000000000000000000000000000000000000000","delay":259200}
      values.scheduledTransactions.11.target:
-        "0xa723C008e76E379c55599D2E4d93879BeaFDa79C"
      values.scheduledTransactions.11.value:
-        0
      values.scheduledTransactions.11.data:
-        "0x0000000000000000000000004dbd4fc535ac27206064b68ffcf827b0a60bab3f000000000000000000000000cf57572261c7c2bcf21ffd220ea7d1a27d40a82700000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000c000000000000000000000000000000000000000000000000000000000000002841cff79cd0000000000000000000000009bf7b8884fa381a45f8cb2525905fb36c996297a00000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000204536d8944000000000000000000000000add68bcb0f66878ab9d37a447c7b9067c5dfa94100000000000000000000000000000000000000000000000000000000000000600000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000000c0000000000000000000000003bd8e2ac65ad6f0f094ba6766cbd9484ab49ef23000000000000000000000000f8e1492255d9428c2fc20a98a1deb1215c8ffefd000000000000000000000000b07dc9103328a51128bc6cc1049d1137035f5e280000000000000000000000003e286452b1c66abb08eb5494c3894f40ab5a59af000000000000000000000000b71ca4ffbb7b58d75ba29891ab45e9dc12b444ed0000000000000000000000008f10e3413586c4a8dcfce19d009872b19e9cd8e3000000000000000000000000566a07c3c932ae6af74d77c29e5c30d8b18537100000000000000000000000005280406912eb8ec677df66c326be48f938dc2e440000000000000000000000000275b3d54a5ddbf8205a75984796efe8b7357bae0000000000000000000000005a1fd562271aac2dadb51baab7760b949d9d81df000000000000000000000000f6b6f07862a02c85628b3a9688beae07fea9c863000000000000000000000000475816ca2a31d601b4e336f5c2418a67978abf090000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000"
      values.scheduledTransactions.11.delay:
-        259200
      values.scheduledTransactions.11.decoded:
+        {"chain":"arbitrum","contractName":"SecurityCouncilMemberSyncAction","function":"perform","inputs":[{"name":"_securityCouncil","value":"0xADd68bCb0f66878aB9D37a447C7b9067C5dfa941"},{"name":"_updatedMembers","value":["0x3Bd8e2AC65ad6f0F094BA6766cBd9484AB49eF23","0xf8e1492255d9428c2Fc20A98A1DeB1215C8ffEfd","0xb07dc9103328A51128bC6Cc1049d1137035f5E28","0x3E286452b1C66abB08Eb5494c3894F40aB5a59AF","0xb71ca4FFbB7b58d75Ba29891ab45e9Dc12B444Ed","0x8F10e3413586c4a8DCfcE19D009872b19e9cd8E3","0x566a07C3c932aE6AF74d77c29e5c30D8B1853710","0x5280406912EB8Ec677Df66C326BE48f938DC2e44","0x0275b3D54a5dDbf8205A75984796eFE8b7357Bae","0x5A1FD562271aAC2Dadb51BAAb7760b949D9D81dF","0xf6B6F07862A02C85628B3A9688beae07fEA9C863","0x475816ca2a31D601B4e336f5c2418A67978aBf09"]},{"name":"_nonce","value":1}],"address":"0x9BF7b8884Fa381a45f8CB2525905fb36C996297a","calldata":"0x536d8944000000000000000000000000add68bcb0f66878ab9d37a447c7b9067c5dfa94100000000000000000000000000000000000000000000000000000000000000600000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000000c0000000000000000000000003bd8e2ac65ad6f0f094ba6766cbd9484ab49ef23000000000000000000000000f8e1492255d9428c2fc20a98a1deb1215c8ffefd000000000000000000000000b07dc9103328a51128bc6cc1049d1137035f5e280000000000000000000000003e286452b1c66abb08eb5494c3894f40ab5a59af000000000000000000000000b71ca4ffbb7b58d75ba29891ab45e9dc12b444ed0000000000000000000000008f10e3413586c4a8dcfce19d009872b19e9cd8e3000000000000000000000000566a07c3c932ae6af74d77c29e5c30d8b18537100000000000000000000000005280406912eb8ec677df66c326be48f938dc2e440000000000000000000000000275b3d54a5ddbf8205a75984796efe8b7357bae0000000000000000000000005a1fd562271aac2dadb51baab7760b949d9d81df000000000000000000000000f6b6f07862a02c85628b3a9688beae07fea9c863000000000000000000000000475816ca2a31d601b4e336f5c2418a67978abf09","executor":"0xCF57572261c7c2BCF21ffD220ea7d1a27D40A827","inboxOnEthereum":"0x4Dbd4fc535Ac27206064B68FfCf827b0A60BAB3f"}
      values.scheduledTransactions.11.raw:
+        {"target":"0xa723C008e76E379c55599D2E4d93879BeaFDa79C","value":0,"data":"0x0000000000000000000000004dbd4fc535ac27206064b68ffcf827b0a60bab3f000000000000000000000000cf57572261c7c2bcf21ffd220ea7d1a27d40a82700000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000c000000000000000000000000000000000000000000000000000000000000002841cff79cd0000000000000000000000009bf7b8884fa381a45f8cb2525905fb36c996297a00000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000204536d8944000000000000000000000000add68bcb0f66878ab9d37a447c7b9067c5dfa94100000000000000000000000000000000000000000000000000000000000000600000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000000c0000000000000000000000003bd8e2ac65ad6f0f094ba6766cbd9484ab49ef23000000000000000000000000f8e1492255d9428c2fc20a98a1deb1215c8ffefd000000000000000000000000b07dc9103328a51128bc6cc1049d1137035f5e280000000000000000000000003e286452b1c66abb08eb5494c3894f40ab5a59af000000000000000000000000b71ca4ffbb7b58d75ba29891ab45e9dc12b444ed0000000000000000000000008f10e3413586c4a8dcfce19d009872b19e9cd8e3000000000000000000000000566a07c3c932ae6af74d77c29e5c30d8b18537100000000000000000000000005280406912eb8ec677df66c326be48f938dc2e440000000000000000000000000275b3d54a5ddbf8205a75984796efe8b7357bae0000000000000000000000005a1fd562271aac2dadb51baab7760b949d9d81df000000000000000000000000f6b6f07862a02c85628b3a9688beae07fea9c863000000000000000000000000475816ca2a31d601b4e336f5c2418a67978abf090000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000","delay":259200}
      values.scheduledTransactions.10.target:
-        "0xa723C008e76E379c55599D2E4d93879BeaFDa79C"
      values.scheduledTransactions.10.value:
-        0
      values.scheduledTransactions.10.data:
-        "0x000000000000000000000000c4448b71118c9071bcb9734a0eac55d18a15394900000000000000000000000086a02dd71363c440b21f4c0e5b2ad01ffe1a748200000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000c000000000000000000000000000000000000000000000000000000000000002841cff79cd0000000000000000000000009bf7b8884fa381a45f8cb2525905fb36c996297a00000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000204536d8944000000000000000000000000c232ee726e3c51b86778bb4dbe61c52cc07a60f300000000000000000000000000000000000000000000000000000000000000600000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000000c0000000000000000000000003bd8e2ac65ad6f0f094ba6766cbd9484ab49ef23000000000000000000000000f8e1492255d9428c2fc20a98a1deb1215c8ffefd000000000000000000000000b07dc9103328a51128bc6cc1049d1137035f5e280000000000000000000000003e286452b1c66abb08eb5494c3894f40ab5a59af000000000000000000000000b71ca4ffbb7b58d75ba29891ab45e9dc12b444ed0000000000000000000000008f10e3413586c4a8dcfce19d009872b19e9cd8e3000000000000000000000000566a07c3c932ae6af74d77c29e5c30d8b18537100000000000000000000000005280406912eb8ec677df66c326be48f938dc2e440000000000000000000000000275b3d54a5ddbf8205a75984796efe8b7357bae0000000000000000000000005a1fd562271aac2dadb51baab7760b949d9d81df000000000000000000000000f6b6f07862a02c85628b3a9688beae07fea9c863000000000000000000000000475816ca2a31d601b4e336f5c2418a67978abf090000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000"
      values.scheduledTransactions.10.delay:
-        259200
      values.scheduledTransactions.10.decoded:
+        {"chain":"nova","address":"0x9BF7b8884Fa381a45f8CB2525905fb36C996297a","calldata":"0x536d8944000000000000000000000000c232ee726e3c51b86778bb4dbe61c52cc07a60f300000000000000000000000000000000000000000000000000000000000000600000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000000c0000000000000000000000003bd8e2ac65ad6f0f094ba6766cbd9484ab49ef23000000000000000000000000f8e1492255d9428c2fc20a98a1deb1215c8ffefd000000000000000000000000b07dc9103328a51128bc6cc1049d1137035f5e280000000000000000000000003e286452b1c66abb08eb5494c3894f40ab5a59af000000000000000000000000b71ca4ffbb7b58d75ba29891ab45e9dc12b444ed0000000000000000000000008f10e3413586c4a8dcfce19d009872b19e9cd8e3000000000000000000000000566a07c3c932ae6af74d77c29e5c30d8b18537100000000000000000000000005280406912eb8ec677df66c326be48f938dc2e440000000000000000000000000275b3d54a5ddbf8205a75984796efe8b7357bae0000000000000000000000005a1fd562271aac2dadb51baab7760b949d9d81df000000000000000000000000f6b6f07862a02c85628b3a9688beae07fea9c863000000000000000000000000475816ca2a31d601b4e336f5c2418a67978abf09","executor":"0x86a02dD71363c440b21F4c0E5B2Ad01Ffe1A7482","inboxOnEthereum":"0xc4448b71118c9071Bcb9734A0EAc55D18A153949"}
      values.scheduledTransactions.10.raw:
+        {"target":"0xa723C008e76E379c55599D2E4d93879BeaFDa79C","value":0,"data":"0x000000000000000000000000c4448b71118c9071bcb9734a0eac55d18a15394900000000000000000000000086a02dd71363c440b21f4c0e5b2ad01ffe1a748200000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000c000000000000000000000000000000000000000000000000000000000000002841cff79cd0000000000000000000000009bf7b8884fa381a45f8cb2525905fb36c996297a00000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000204536d8944000000000000000000000000c232ee726e3c51b86778bb4dbe61c52cc07a60f300000000000000000000000000000000000000000000000000000000000000600000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000000c0000000000000000000000003bd8e2ac65ad6f0f094ba6766cbd9484ab49ef23000000000000000000000000f8e1492255d9428c2fc20a98a1deb1215c8ffefd000000000000000000000000b07dc9103328a51128bc6cc1049d1137035f5e280000000000000000000000003e286452b1c66abb08eb5494c3894f40ab5a59af000000000000000000000000b71ca4ffbb7b58d75ba29891ab45e9dc12b444ed0000000000000000000000008f10e3413586c4a8dcfce19d009872b19e9cd8e3000000000000000000000000566a07c3c932ae6af74d77c29e5c30d8b18537100000000000000000000000005280406912eb8ec677df66c326be48f938dc2e440000000000000000000000000275b3d54a5ddbf8205a75984796efe8b7357bae0000000000000000000000005a1fd562271aac2dadb51baab7760b949d9d81df000000000000000000000000f6b6f07862a02c85628b3a9688beae07fea9c863000000000000000000000000475816ca2a31d601b4e336f5c2418a67978abf090000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000","delay":259200}
      values.scheduledTransactions.9.target:
-        "0xa723C008e76E379c55599D2E4d93879BeaFDa79C"
      values.scheduledTransactions.9.value:
-        0
      values.scheduledTransactions.9.data:
-        "0x0000000000000000000000004dbd4fc535ac27206064b68ffcf827b0a60bab3f000000000000000000000000cf57572261c7c2bcf21ffd220ea7d1a27d40a82700000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000c000000000000000000000000000000000000000000000000000000000000002841cff79cd0000000000000000000000009bf7b8884fa381a45f8cb2525905fb36c996297a00000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000204536d8944000000000000000000000000423552c0f05baccac5bfa91c6dcf1dc53a0a164100000000000000000000000000000000000000000000000000000000000000600000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000000c0000000000000000000000003bd8e2ac65ad6f0f094ba6766cbd9484ab49ef23000000000000000000000000f8e1492255d9428c2fc20a98a1deb1215c8ffefd000000000000000000000000b07dc9103328a51128bc6cc1049d1137035f5e280000000000000000000000003e286452b1c66abb08eb5494c3894f40ab5a59af000000000000000000000000b71ca4ffbb7b58d75ba29891ab45e9dc12b444ed0000000000000000000000008f10e3413586c4a8dcfce19d009872b19e9cd8e3000000000000000000000000566a07c3c932ae6af74d77c29e5c30d8b18537100000000000000000000000005280406912eb8ec677df66c326be48f938dc2e440000000000000000000000000275b3d54a5ddbf8205a75984796efe8b7357bae0000000000000000000000005a1fd562271aac2dadb51baab7760b949d9d81df000000000000000000000000f6b6f07862a02c85628b3a9688beae07fea9c863000000000000000000000000475816ca2a31d601b4e336f5c2418a67978abf090000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000"
      values.scheduledTransactions.9.delay:
-        259200
      values.scheduledTransactions.9.decoded:
+        {"chain":"arbitrum","contractName":"SecurityCouncilMemberSyncAction","function":"perform","inputs":[{"name":"_securityCouncil","value":"0x423552c0F05baCCac5Bfa91C6dCF1dc53a0A1641"},{"name":"_updatedMembers","value":["0x3Bd8e2AC65ad6f0F094BA6766cBd9484AB49eF23","0xf8e1492255d9428c2Fc20A98A1DeB1215C8ffEfd","0xb07dc9103328A51128bC6Cc1049d1137035f5E28","0x3E286452b1C66abB08Eb5494c3894F40aB5a59AF","0xb71ca4FFbB7b58d75Ba29891ab45e9Dc12B444Ed","0x8F10e3413586c4a8DCfcE19D009872b19e9cd8E3","0x566a07C3c932aE6AF74d77c29e5c30D8B1853710","0x5280406912EB8Ec677Df66C326BE48f938DC2e44","0x0275b3D54a5dDbf8205A75984796eFE8b7357Bae","0x5A1FD562271aAC2Dadb51BAAb7760b949D9D81dF","0xf6B6F07862A02C85628B3A9688beae07fEA9C863","0x475816ca2a31D601B4e336f5c2418A67978aBf09"]},{"name":"_nonce","value":1}],"address":"0x9BF7b8884Fa381a45f8CB2525905fb36C996297a","calldata":"0x536d8944000000000000000000000000423552c0f05baccac5bfa91c6dcf1dc53a0a164100000000000000000000000000000000000000000000000000000000000000600000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000000c0000000000000000000000003bd8e2ac65ad6f0f094ba6766cbd9484ab49ef23000000000000000000000000f8e1492255d9428c2fc20a98a1deb1215c8ffefd000000000000000000000000b07dc9103328a51128bc6cc1049d1137035f5e280000000000000000000000003e286452b1c66abb08eb5494c3894f40ab5a59af000000000000000000000000b71ca4ffbb7b58d75ba29891ab45e9dc12b444ed0000000000000000000000008f10e3413586c4a8dcfce19d009872b19e9cd8e3000000000000000000000000566a07c3c932ae6af74d77c29e5c30d8b18537100000000000000000000000005280406912eb8ec677df66c326be48f938dc2e440000000000000000000000000275b3d54a5ddbf8205a75984796efe8b7357bae0000000000000000000000005a1fd562271aac2dadb51baab7760b949d9d81df000000000000000000000000f6b6f07862a02c85628b3a9688beae07fea9c863000000000000000000000000475816ca2a31d601b4e336f5c2418a67978abf09","executor":"0xCF57572261c7c2BCF21ffD220ea7d1a27D40A827","inboxOnEthereum":"0x4Dbd4fc535Ac27206064B68FfCf827b0A60BAB3f"}
      values.scheduledTransactions.9.raw:
+        {"target":"0xa723C008e76E379c55599D2E4d93879BeaFDa79C","value":0,"data":"0x0000000000000000000000004dbd4fc535ac27206064b68ffcf827b0a60bab3f000000000000000000000000cf57572261c7c2bcf21ffd220ea7d1a27d40a82700000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000c000000000000000000000000000000000000000000000000000000000000002841cff79cd0000000000000000000000009bf7b8884fa381a45f8cb2525905fb36c996297a00000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000204536d8944000000000000000000000000423552c0f05baccac5bfa91c6dcf1dc53a0a164100000000000000000000000000000000000000000000000000000000000000600000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000000c0000000000000000000000003bd8e2ac65ad6f0f094ba6766cbd9484ab49ef23000000000000000000000000f8e1492255d9428c2fc20a98a1deb1215c8ffefd000000000000000000000000b07dc9103328a51128bc6cc1049d1137035f5e280000000000000000000000003e286452b1c66abb08eb5494c3894f40ab5a59af000000000000000000000000b71ca4ffbb7b58d75ba29891ab45e9dc12b444ed0000000000000000000000008f10e3413586c4a8dcfce19d009872b19e9cd8e3000000000000000000000000566a07c3c932ae6af74d77c29e5c30d8b18537100000000000000000000000005280406912eb8ec677df66c326be48f938dc2e440000000000000000000000000275b3d54a5ddbf8205a75984796efe8b7357bae0000000000000000000000005a1fd562271aac2dadb51baab7760b949d9d81df000000000000000000000000f6b6f07862a02c85628b3a9688beae07fea9c863000000000000000000000000475816ca2a31d601b4e336f5c2418a67978abf090000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000","delay":259200}
      values.scheduledTransactions.8.target:
-        "0x3ffFbAdAF827559da092217e474760E2b2c3CeDd"
      values.scheduledTransactions.8.value:
-        0
      values.scheduledTransactions.8.data:
-        "0x1cff79cd0000000000000000000000009bf7b8884fa381a45f8cb2525905fb36c996297a00000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000204536d8944000000000000000000000000f06e95ef589d9c38af242a8aaee8375f14023f8500000000000000000000000000000000000000000000000000000000000000600000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000000c0000000000000000000000003bd8e2ac65ad6f0f094ba6766cbd9484ab49ef23000000000000000000000000f8e1492255d9428c2fc20a98a1deb1215c8ffefd000000000000000000000000b07dc9103328a51128bc6cc1049d1137035f5e280000000000000000000000003e286452b1c66abb08eb5494c3894f40ab5a59af000000000000000000000000b71ca4ffbb7b58d75ba29891ab45e9dc12b444ed0000000000000000000000008f10e3413586c4a8dcfce19d009872b19e9cd8e3000000000000000000000000566a07c3c932ae6af74d77c29e5c30d8b18537100000000000000000000000005280406912eb8ec677df66c326be48f938dc2e440000000000000000000000000275b3d54a5ddbf8205a75984796efe8b7357bae0000000000000000000000005a1fd562271aac2dadb51baab7760b949d9d81df000000000000000000000000f6b6f07862a02c85628b3a9688beae07fea9c863000000000000000000000000475816ca2a31d601b4e336f5c2418a67978abf0900000000000000000000000000000000000000000000000000000000"
      values.scheduledTransactions.8.delay:
-        259200
      values.scheduledTransactions.8.decoded:
+        {"chain":"ethereum","contractName":"SecurityCouncilMemberSyncAction","function":"perform","inputs":[{"name":"_securityCouncil","value":"0xF06E95eF589D9c38af242a8AAee8375f14023F85"},{"name":"_updatedMembers","value":["0x3Bd8e2AC65ad6f0F094BA6766cBd9484AB49eF23","0xf8e1492255d9428c2Fc20A98A1DeB1215C8ffEfd","0xb07dc9103328A51128bC6Cc1049d1137035f5E28","0x3E286452b1C66abB08Eb5494c3894F40aB5a59AF","0xb71ca4FFbB7b58d75Ba29891ab45e9Dc12B444Ed","0x8F10e3413586c4a8DCfcE19D009872b19e9cd8E3","0x566a07C3c932aE6AF74d77c29e5c30D8B1853710","0x5280406912EB8Ec677Df66C326BE48f938DC2e44","0x0275b3D54a5dDbf8205A75984796eFE8b7357Bae","0x5A1FD562271aAC2Dadb51BAAb7760b949D9D81dF","0xf6B6F07862A02C85628B3A9688beae07fEA9C863","0x475816ca2a31D601B4e336f5c2418A67978aBf09"]},{"name":"_nonce","value":1}],"address":"0x9BF7b8884Fa381a45f8CB2525905fb36C996297a","calldata":"0x536d8944000000000000000000000000f06e95ef589d9c38af242a8aaee8375f14023f8500000000000000000000000000000000000000000000000000000000000000600000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000000c0000000000000000000000003bd8e2ac65ad6f0f094ba6766cbd9484ab49ef23000000000000000000000000f8e1492255d9428c2fc20a98a1deb1215c8ffefd000000000000000000000000b07dc9103328a51128bc6cc1049d1137035f5e280000000000000000000000003e286452b1c66abb08eb5494c3894f40ab5a59af000000000000000000000000b71ca4ffbb7b58d75ba29891ab45e9dc12b444ed0000000000000000000000008f10e3413586c4a8dcfce19d009872b19e9cd8e3000000000000000000000000566a07c3c932ae6af74d77c29e5c30d8b18537100000000000000000000000005280406912eb8ec677df66c326be48f938dc2e440000000000000000000000000275b3d54a5ddbf8205a75984796efe8b7357bae0000000000000000000000005a1fd562271aac2dadb51baab7760b949d9d81df000000000000000000000000f6b6f07862a02c85628b3a9688beae07fea9c863000000000000000000000000475816ca2a31d601b4e336f5c2418a67978abf09","executor":"0x3ffFbAdAF827559da092217e474760E2b2c3CeDd"}
      values.scheduledTransactions.8.raw:
+        {"target":"0x3ffFbAdAF827559da092217e474760E2b2c3CeDd","value":0,"data":"0x1cff79cd0000000000000000000000009bf7b8884fa381a45f8cb2525905fb36c996297a00000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000204536d8944000000000000000000000000f06e95ef589d9c38af242a8aaee8375f14023f8500000000000000000000000000000000000000000000000000000000000000600000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000000c0000000000000000000000003bd8e2ac65ad6f0f094ba6766cbd9484ab49ef23000000000000000000000000f8e1492255d9428c2fc20a98a1deb1215c8ffefd000000000000000000000000b07dc9103328a51128bc6cc1049d1137035f5e280000000000000000000000003e286452b1c66abb08eb5494c3894f40ab5a59af000000000000000000000000b71ca4ffbb7b58d75ba29891ab45e9dc12b444ed0000000000000000000000008f10e3413586c4a8dcfce19d009872b19e9cd8e3000000000000000000000000566a07c3c932ae6af74d77c29e5c30d8b18537100000000000000000000000005280406912eb8ec677df66c326be48f938dc2e440000000000000000000000000275b3d54a5ddbf8205a75984796efe8b7357bae0000000000000000000000005a1fd562271aac2dadb51baab7760b949d9d81df000000000000000000000000f6b6f07862a02c85628b3a9688beae07fea9c863000000000000000000000000475816ca2a31d601b4e336f5c2418a67978abf0900000000000000000000000000000000000000000000000000000000","delay":259200}
      values.scheduledTransactions.7.target:
-        "0x3ffFbAdAF827559da092217e474760E2b2c3CeDd"
      values.scheduledTransactions.7.value:
-        0
      values.scheduledTransactions.7.data:
-        "0x1cff79cd000000000000000000000000baba4daf5800b9746f58c724f05e03880850d57800000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000004b147f40c00000000000000000000000000000000000000000000000000000000"
      values.scheduledTransactions.7.delay:
-        259200
      values.scheduledTransactions.7.decoded:
+        {"chain":"ethereum","contractName":"UpdateL1CoreTimelockAction","function":"perform","inputs":[],"address":"0xBabA4DAf5800B9746f58C724F05E03880850D578","calldata":"0xb147f40c","executor":"0x3ffFbAdAF827559da092217e474760E2b2c3CeDd"}
      values.scheduledTransactions.7.raw:
+        {"target":"0x3ffFbAdAF827559da092217e474760E2b2c3CeDd","value":0,"data":"0x1cff79cd000000000000000000000000baba4daf5800b9746f58c724f05e03880850d57800000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000004b147f40c00000000000000000000000000000000000000000000000000000000","delay":259200}
      values.scheduledTransactions.6.target:
-        "0xa723C008e76E379c55599D2E4d93879BeaFDa79C"
      values.scheduledTransactions.6.value:
-        0
      values.scheduledTransactions.6.data:
-        "0x0000000000000000000000004dbd4fc535ac27206064b68ffcf827b0a60bab3f000000000000000000000000cf57572261c7c2bcf21ffd220ea7d1a27d40a82700000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000c000000000000000000000000000000000000000000000000000000000000000841cff79cd000000000000000000000000baba4daf5800b9746f58c724f05e03880850d57800000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000004b147f40c0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000"
      values.scheduledTransactions.6.delay:
-        259200
      values.scheduledTransactions.6.decoded:
+        {"chain":"arbitrum","contractName":"SetSweepReceiverAction","function":"perform","inputs":[],"address":"0xBabA4DAf5800B9746f58C724F05E03880850D578","calldata":"0xb147f40c","executor":"0xCF57572261c7c2BCF21ffD220ea7d1a27D40A827","inboxOnEthereum":"0x4Dbd4fc535Ac27206064B68FfCf827b0A60BAB3f"}
      values.scheduledTransactions.6.raw:
+        {"target":"0xa723C008e76E379c55599D2E4d93879BeaFDa79C","value":0,"data":"0x0000000000000000000000004dbd4fc535ac27206064b68ffcf827b0a60bab3f000000000000000000000000cf57572261c7c2bcf21ffd220ea7d1a27d40a82700000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000c000000000000000000000000000000000000000000000000000000000000000841cff79cd000000000000000000000000baba4daf5800b9746f58c724f05e03880850d57800000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000004b147f40c0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000","delay":259200}
      values.scheduledTransactions.5.target:
-        "0xa723C008e76E379c55599D2E4d93879BeaFDa79C"
      values.scheduledTransactions.5.value:
-        0
      values.scheduledTransactions.5.data:
-        "0x0000000000000000000000004dbd4fc535ac27206064b68ffcf827b0a60bab3f000000000000000000000000cf57572261c7c2bcf21ffd220ea7d1a27d40a82700000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000c000000000000000000000000000000000000000000000000000000000000000841cff79cd0000000000000000000000007b1247f443359d1447cf25e73380bc9b99f2628f00000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000004b147f40c0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000"
      values.scheduledTransactions.5.delay:
-        259200
      values.scheduledTransactions.5.decoded:
+        {"chain":"arbitrum","contractName":"UpdateGasChargeAction","function":"perform","inputs":[],"address":"0x7B1247f443359d1447Cf25e73380Bc9b99F2628f","calldata":"0xb147f40c","executor":"0xCF57572261c7c2BCF21ffD220ea7d1a27D40A827","inboxOnEthereum":"0x4Dbd4fc535Ac27206064B68FfCf827b0A60BAB3f"}
      values.scheduledTransactions.5.raw:
+        {"target":"0xa723C008e76E379c55599D2E4d93879BeaFDa79C","value":0,"data":"0x0000000000000000000000004dbd4fc535ac27206064b68ffcf827b0a60bab3f000000000000000000000000cf57572261c7c2bcf21ffd220ea7d1a27d40a82700000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000c000000000000000000000000000000000000000000000000000000000000000841cff79cd0000000000000000000000007b1247f443359d1447cf25e73380bc9b99f2628f00000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000004b147f40c0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000","delay":259200}
      values.scheduledTransactions.4.target:
-        "0xa723C008e76E379c55599D2E4d93879BeaFDa79C"
      values.scheduledTransactions.4.value:
-        0
      values.scheduledTransactions.4.data:
-        "0x000000000000000000000000c4448b71118c9071bcb9734a0eac55d18a15394900000000000000000000000086a02dd71363c440b21f4c0e5b2ad01ffe1a748200000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000c000000000000000000000000000000000000000000000000000000000000000841cff79cd00000000000000000000000022ec545357162c342f643bddb2ed4c3fb6b42eb000000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000004b147f40c0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000"
      values.scheduledTransactions.4.delay:
-        259200
      values.scheduledTransactions.4.decoded:
+        {"chain":"nova","address":"0x22EC545357162C342F643bDdb2eD4c3FB6B42eb0","calldata":"0xb147f40c","executor":"0x86a02dD71363c440b21F4c0E5B2Ad01Ffe1A7482","inboxOnEthereum":"0xc4448b71118c9071Bcb9734A0EAc55D18A153949"}
      values.scheduledTransactions.4.raw:
+        {"target":"0xa723C008e76E379c55599D2E4d93879BeaFDa79C","value":0,"data":"0x000000000000000000000000c4448b71118c9071bcb9734a0eac55d18a15394900000000000000000000000086a02dd71363c440b21f4c0e5b2ad01ffe1a748200000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000c000000000000000000000000000000000000000000000000000000000000000841cff79cd00000000000000000000000022ec545357162c342f643bddb2ed4c3fb6b42eb000000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000004b147f40c0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000","delay":259200}
      values.scheduledTransactions.3.target:
-        "0xa723C008e76E379c55599D2E4d93879BeaFDa79C"
      values.scheduledTransactions.3.value:
-        0
      values.scheduledTransactions.3.data:
-        "0x0000000000000000000000004dbd4fc535ac27206064b68ffcf827b0a60bab3f000000000000000000000000cf57572261c7c2bcf21ffd220ea7d1a27d40a82700000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000c000000000000000000000000000000000000000000000000000000000000000841cff79cd0000000000000000000000001015c1ae166c4c39d18a1151b7029bac1530c9aa00000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000004b147f40c0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000"
      values.scheduledTransactions.3.delay:
-        259200
      values.scheduledTransactions.3.decoded:
+        {"chain":"arbitrum","contractName":"GovernanceChainSCMgmtActivationAction","function":"perform","inputs":[],"address":"0x1015c1Ae166C4C39D18a1151b7029bAC1530c9aa","calldata":"0xb147f40c","executor":"0xCF57572261c7c2BCF21ffD220ea7d1a27D40A827","inboxOnEthereum":"0x4Dbd4fc535Ac27206064B68FfCf827b0A60BAB3f"}
      values.scheduledTransactions.3.raw:
+        {"target":"0xa723C008e76E379c55599D2E4d93879BeaFDa79C","value":0,"data":"0x0000000000000000000000004dbd4fc535ac27206064b68ffcf827b0a60bab3f000000000000000000000000cf57572261c7c2bcf21ffd220ea7d1a27d40a82700000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000c000000000000000000000000000000000000000000000000000000000000000841cff79cd0000000000000000000000001015c1ae166c4c39d18a1151b7029bac1530c9aa00000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000004b147f40c0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000","delay":259200}
      values.scheduledTransactions.2.target:
-        "0x3ffFbAdAF827559da092217e474760E2b2c3CeDd"
      values.scheduledTransactions.2.value:
-        0
      values.scheduledTransactions.2.data:
-        "0x1cff79cd00000000000000000000000022ec545357162c342f643bddb2ed4c3fb6b42eb000000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000004b147f40c00000000000000000000000000000000000000000000000000000000"
      values.scheduledTransactions.2.delay:
-        259200
      values.scheduledTransactions.2.decoded:
+        {"chain":"ethereum","contractName":"L1SCMgmtActivationAction","function":"perform","inputs":[],"address":"0x22EC545357162C342F643bDdb2eD4c3FB6B42eb0","calldata":"0xb147f40c","executor":"0x3ffFbAdAF827559da092217e474760E2b2c3CeDd"}
      values.scheduledTransactions.2.raw:
+        {"target":"0x3ffFbAdAF827559da092217e474760E2b2c3CeDd","value":0,"data":"0x1cff79cd00000000000000000000000022ec545357162c342f643bddb2ed4c3fb6b42eb000000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000004b147f40c00000000000000000000000000000000000000000000000000000000","delay":259200}
      values.scheduledTransactions.1.target:
-        "0xa723C008e76E379c55599D2E4d93879BeaFDa79C"
      values.scheduledTransactions.1.value:
-        0
      values.scheduledTransactions.1.data:
-        "0x0000000000000000000000004dbd4fc535ac27206064b68ffcf827b0a60bab3f000000000000000000000000cf57572261c7c2bcf21ffd220ea7d1a27d40a82700000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000c000000000000000000000000000000000000000000000000000000000000000841cff79cd00000000000000000000000085792f6bf346e3bfd3a275318add2c44a105844700000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000004b147f40c0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000"
      values.scheduledTransactions.1.delay:
-        259200
      values.scheduledTransactions.1.decoded:
+        {"chain":"arbitrum","contractName":"AIP4Action","function":"perform","inputs":[],"address":"0x85792f6BF346e3Bfd3A275318aDd2c44A1058447","calldata":"0xb147f40c","executor":"0xCF57572261c7c2BCF21ffD220ea7d1a27D40A827","inboxOnEthereum":"0x4Dbd4fc535Ac27206064B68FfCf827b0A60BAB3f"}
      values.scheduledTransactions.1.raw:
+        {"target":"0xa723C008e76E379c55599D2E4d93879BeaFDa79C","value":0,"data":"0x0000000000000000000000004dbd4fc535ac27206064b68ffcf827b0a60bab3f000000000000000000000000cf57572261c7c2bcf21ffd220ea7d1a27d40a82700000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000c000000000000000000000000000000000000000000000000000000000000000841cff79cd00000000000000000000000085792f6bf346e3bfd3a275318add2c44a105844700000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000004b147f40c0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000","delay":259200}
      values.scheduledTransactions.0.target:
-        "0xa723C008e76E379c55599D2E4d93879BeaFDa79C"
      values.scheduledTransactions.0.value:
-        0
      values.scheduledTransactions.0.data:
-        "0x0000000000000000000000004dbd4fc535ac27206064b68ffcf827b0a60bab3f000000000000000000000000cf57572261c7c2bcf21ffd220ea7d1a27d40a82700000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000c000000000000000000000000000000000000000000000000000000000000000841cff79cd0000000000000000000000006274106eedd4848371d2c09e0352d67b795ed51600000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000004b147f40c0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000"
      values.scheduledTransactions.0.delay:
-        259200
      values.scheduledTransactions.0.decoded:
+        {"chain":"arbitrum","contractName":"AIP1Point2Action","function":"perform","inputs":[],"address":"0x6274106eedD4848371D2C09e0352d67B795ED516","calldata":"0xb147f40c","executor":"0xCF57572261c7c2BCF21ffD220ea7d1a27D40A827","inboxOnEthereum":"0x4Dbd4fc535Ac27206064B68FfCf827b0A60BAB3f"}
      values.scheduledTransactions.0.raw:
+        {"target":"0xa723C008e76E379c55599D2E4d93879BeaFDa79C","value":0,"data":"0x0000000000000000000000004dbd4fc535ac27206064b68ffcf827b0a60bab3f000000000000000000000000cf57572261c7c2bcf21ffd220ea7d1a27d40a82700000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000c000000000000000000000000000000000000000000000000000000000000000841cff79cd0000000000000000000000006274106eedd4848371d2c09e0352d67b795ed51600000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000004b147f40c0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000","delay":259200}
    }
```

Generated with discovered.json: 0x36d7536b6e26bf57903930da87521158a9d1c787

# Diff at Tue, 12 Mar 2024 15:15:15 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@800d2d30954e8bfb14ad062b9806c50997706541 block: 19140307
- current block number: 19419824

## Description

Multiple transactions have been scheduled in L1ArbitrumTimelock as part of the
following approved governance proposals:

- id: 0xe4f8...: [Changes to the Constitution and the Security Council Election Process](https://www.tally.xyz/gov/arbitrum/proposal/28300903567340237987946172947371304329455149918972967618773111648600015289785) - Proposed on: Feb 7th, 2024
  - Add an additional 7 day window for contenders to add themselves before voting starts.
  - Only allow contenders to add themselves by signature, ensuring they are an EOA that can sign on all chains.
- id: 0x0b8dc...: [AIP: ArbOS 20 “Atlas” - Arbitrum Support for Dencun + Batch Poster Improvements](https://www.tally.xyz/gov/arbitrum/proposal/46905320292877192134536823079608810426433248493109520384601548724615383601450) - Proposed on: Feb 14th, 2024
  - Support posting batches of transactions as blobs to L1 Ethereum
  - Enable partial support for Dencun Execution Layer
  - Batch Poster Manager and Sequencer Inbox Finality Fix

## Watched changes

```diff
    contract L1ArbitrumTimelock (0xE6841D92B0C345144506576eC13ECf5103aC7f49) {
    +++ description: None
      values.scheduledTransactions.25:
+        {"id":"0x0b8dc4a8b99d2302c77e4eaeb1b06dd4038dd796bd8e5016dcb292018543ef91","target":"0xa723C008e76E379c55599D2E4d93879BeaFDa79C","value":0,"data":"0x000000000000000000000000c4448b71118c9071bcb9734a0eac55d18a15394900000000000000000000000086a02dd71363c440b21f4c0e5b2ad01ffe1a748200000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000c000000000000000000000000000000000000000000000000000000000000000841cff79cd0000000000000000000000003e313eeed58e851ca3841c6109697b9eb35c772600000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000004b147f40c0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000","delay":259200}
      values.scheduledTransactions.24:
+        {"id":"0x0b8dc4a8b99d2302c77e4eaeb1b06dd4038dd796bd8e5016dcb292018543ef91","target":"0xa723C008e76E379c55599D2E4d93879BeaFDa79C","value":0,"data":"0x0000000000000000000000004dbd4fc535ac27206064b68ffcf827b0a60bab3f000000000000000000000000cf57572261c7c2bcf21ffd220ea7d1a27d40a82700000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000c000000000000000000000000000000000000000000000000000000000000000841cff79cd0000000000000000000000003e313eeed58e851ca3841c6109697b9eb35c772600000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000004b147f40c0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000","delay":259200}
      values.scheduledTransactions.23:
+        {"id":"0x0b8dc4a8b99d2302c77e4eaeb1b06dd4038dd796bd8e5016dcb292018543ef91","target":"0x3ffFbAdAF827559da092217e474760E2b2c3CeDd","value":0,"data":"0x1cff79cd000000000000000000000000501f30810d2b0eaec15cc3785dbb29e4a8a92a7000000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000004b147f40c00000000000000000000000000000000000000000000000000000000","delay":259200}
      values.scheduledTransactions.22:
+        {"id":"0x0b8dc4a8b99d2302c77e4eaeb1b06dd4038dd796bd8e5016dcb292018543ef91","target":"0x3ffFbAdAF827559da092217e474760E2b2c3CeDd","value":0,"data":"0x1cff79cd000000000000000000000000874356173cfd6c739aeab1f5abfb5f3afb3d4d3300000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000004b147f40c00000000000000000000000000000000000000000000000000000000","delay":259200}
      values.scheduledTransactions.21:
+        {"id":"0x0b8dc4a8b99d2302c77e4eaeb1b06dd4038dd796bd8e5016dcb292018543ef91","target":"0x3ffFbAdAF827559da092217e474760E2b2c3CeDd","value":0,"data":"0x1cff79cd000000000000000000000000ce0af261eb511cb41b8d0a2e31df80ba37e265ab00000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000004b147f40c00000000000000000000000000000000000000000000000000000000","delay":259200}
      values.scheduledTransactions.20:
+        {"id":"0x0b8dc4a8b99d2302c77e4eaeb1b06dd4038dd796bd8e5016dcb292018543ef91","target":"0x3ffFbAdAF827559da092217e474760E2b2c3CeDd","value":0,"data":"0x1cff79cd00000000000000000000000076d8e97cd4514bebbc21d2044ff4a8d9ea1f0cc400000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000004b147f40c00000000000000000000000000000000000000000000000000000000","delay":259200}
      values.scheduledTransactions.19:
+        {"id":"0x0b8dc4a8b99d2302c77e4eaeb1b06dd4038dd796bd8e5016dcb292018543ef91","target":"0x3ffFbAdAF827559da092217e474760E2b2c3CeDd","value":0,"data":"0x1cff79cd00000000000000000000000047a85c0a118127f3968a6a1a61e2a326517540d400000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000004b147f40c00000000000000000000000000000000000000000000000000000000","delay":259200}
      values.scheduledTransactions.18:
+        {"id":"0x0b8dc4a8b99d2302c77e4eaeb1b06dd4038dd796bd8e5016dcb292018543ef91","target":"0x3ffFbAdAF827559da092217e474760E2b2c3CeDd","value":0,"data":"0x1cff79cd0000000000000000000000003e313eeed58e851ca3841c6109697b9eb35c772600000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000004b147f40c00000000000000000000000000000000000000000000000000000000","delay":259200}
      values.scheduledTransactions.17:
+        {"id":"0xe4f81d02f2581e9b7a8815af6925d3c277859994fde496629554989b7c91d254","target":"0xa723C008e76E379c55599D2E4d93879BeaFDa79C","value":0,"data":"0x0000000000000000000000004dbd4fc535ac27206064b68ffcf827b0a60bab3f000000000000000000000000cf57572261c7c2bcf21ffd220ea7d1a27d40a82700000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000c000000000000000000000000000000000000000000000000000000000000000841cff79cd000000000000000000000000d9a2e0e5d7509f0bf1b2d33884f8c1b4d449087900000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000004b147f40c0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000","delay":259200}
    }
```

Generated with discovered.json: 0x8719a11829c6e6325ba2ef228b77a827c2cacf3a

# Diff at Fri, 02 Feb 2024 11:08:25 GMT:

- author: Luca Donno (<donnoh99@gmail.com>)
- comparing to: main@d4d9bc19cc4a1e4baaadb947f4ad7e44e6c21ac9 block: 19119504
- current block number: 19140307

## Description

The nonce is now ignored. Start tracking the keySetUpdates.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19119504 (main branch discovery), not current.

```diff
    contract SequencerInbox (0x1c479675ad559DC151F6Ec7ed3FbF8ceE79582B6) {
      values.keySetUpdates:
+        0
    }
```

```diff
    contract GnosisSafe (0xC234E41AE2cb00311956Aa7109fC801ae8c80941) {
      name:
-        "GnosisSafe"
+        "ValidatorOwnerMultisig"
      derivedName:
+        "GnosisSafe"
    }
```

Generated with discovered.json: 0x64a4811e26385036e4496726627304e6f3ddd353

# Diff at Tue, 30 Jan 2024 13:04:34 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@ceb6abb9c987b0d53dd547a79c3ebbf3480a024b block: 19069754
- current block number: 19119504

## Description

Add the SequencerInboxVersion handler.
ArbOS11 Upgrade.

## Watched changes

```diff
    contract RollupProxy (0x5eF0D09d1E6204141B4d37530808eD19f60FBa35) {
      values.wasmModuleRoot:
-        "0x6b94a7fc388fd8ef3def759297828dc311761e88d8179c7ee8d3887dc554f3c3"
+        "0xf4389b835497a910d7ba3ebfb77aa93da985634f3c052de1290360635be40c4a"
    }
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19069754 (main branch discovery), not current.

```diff
    contract SequencerInbox (0x1c479675ad559DC151F6Ec7ed3FbF8ceE79582B6) {
      values.sequencerVersion:
+        "0x00"
    }
```

Generated with discovered.json: 0xe996eeb6cd08d695db9b13369e8aded556ec9bb2

# Diff at Tue, 23 Jan 2024 13:46:20 GMT:

- author: Luca Donno (<donnoh99@gmail.com>)
- comparing to: main@74040c3a8f43c630b3d31cc8376e84f5f9acda5c block: 18691623
- current block number: 19069754

## Description

Provide description of changes. This section will be preserved.

## Watched changes

```diff
    contract GnosisSafe (0xC234E41AE2cb00311956Aa7109fC801ae8c80941) {
      values.getOwners.0:
-        "0x702105E66C468b5191553702cD6BF3D6Bbfa4C6b"
+        "0x375906ADFD34D93236084F462BB2dB0D92129Fe1"
      values.nonce:
-        170
+        179
    }
```

```diff
    contract L1ArbitrumTimelock (0xE6841D92B0C345144506576eC13ECf5103aC7f49) {
      values.scheduledTransactions[16]:
+        {"id":"0xbcda99fe98a7c479aafb3eb3eab0f154f9fdd169f28c11adf6eefda3bef7c04e","target":"0xa723C008e76E379c55599D2E4d93879BeaFDa79C","value":0,"data":"0x000000000000000000000000c4448b71118c9071bcb9734a0eac55d18a15394900000000000000000000000086a02dd71363c440b21f4c0e5b2ad01ffe1a748200000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000c000000000000000000000000000000000000000000000000000000000000000841cff79cd0000000000000000000000005357f4d3e8f8250a77bcddd5e58886ad1358220c00000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000004b147f40c0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000","delay":259200}
      values.scheduledTransactions[15]:
+        {"id":"0xbcda99fe98a7c479aafb3eb3eab0f154f9fdd169f28c11adf6eefda3bef7c04e","target":"0xa723C008e76E379c55599D2E4d93879BeaFDa79C","value":0,"data":"0x0000000000000000000000004dbd4fc535ac27206064b68ffcf827b0a60bab3f000000000000000000000000cf57572261c7c2bcf21ffd220ea7d1a27d40a82700000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000c000000000000000000000000000000000000000000000000000000000000000841cff79cd000000000000000000000000f6c7dc6eae78abf2f32df899654ca425dfa9948100000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000004b147f40c0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000","delay":259200}
      values.scheduledTransactions[14]:
+        {"id":"0xbcda99fe98a7c479aafb3eb3eab0f154f9fdd169f28c11adf6eefda3bef7c04e","target":"0x3ffFbAdAF827559da092217e474760E2b2c3CeDd","value":0,"data":"0x1cff79cd00000000000000000000000054c2c372943572ac2a8e84d502ebc13f14b6224600000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000004b147f40c00000000000000000000000000000000000000000000000000000000","delay":259200}
      values.scheduledTransactions[13]:
+        {"id":"0xbcda99fe98a7c479aafb3eb3eab0f154f9fdd169f28c11adf6eefda3bef7c04e","target":"0x3ffFbAdAF827559da092217e474760E2b2c3CeDd","value":0,"data":"0x1cff79cd0000000000000000000000003b70f2da6f3b01f9a53dcbcb3e59ad3ad8bed92400000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000004b147f40c00000000000000000000000000000000000000000000000000000000","delay":259200}
    }
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 18691623 (main branch discovery), not current.

```diff
    contract SequencerInbox (0x1c479675ad559DC151F6Ec7ed3FbF8ceE79582B6) {
      values.batchPosters:
+        ["0x0C5911d57B24FCF1DC8B2608eFbAe57C7098E32D","0xC1b634853Cb333D3aD8663715b08f41A3Aec47cc"]
    }
```

```diff
    contract RollupProxy (0x5eF0D09d1E6204141B4d37530808eD19f60FBa35) {
      values.validators:
+        ["0x0fF813f6BD577c3D1cDbE435baC0621BE6aE34B4","0x54c0D3d6C101580dB3be8763A2aE2c6bb9dc840c","0x56D83349c2B8DCF74d7E92D5b6B33d0BADD52D78","0x610Aa279989F440820e14248BD3879B148717974","0x6Fb914de4653eC5592B7c15F4d9466Cbd03F2104","0x758C6bB08B3ea5889B5cddbdeF9A45b3a983c398","0x7CF3d537733F6Ba4183A833c9B021265716cE9d0","0x83215480dB2C6A7E56f9E99EF93AB9B36F8A3DD5","0xAB1A39332e934300eBCc57B5f95cA90631a347FF","0xB0CB1384e3f4a9a9b2447e39b05e10631E1D34B0","0xB51EDdfc9A945e2B909905e4F242C4796Ac0C61d","0xF8D3E1cF58386c92B27710C6a0D8A54c76BC6ab5","0xdDf2F71Ab206C0138A8eceEb54386567D5abF01E","0xf59caf75e8A4bFBA4e6e07aD86C7E498E4d2519b"]
    }
```

```diff
+   Status: CREATED
    contract ProxyAdmin (0x0ea6999172c1B4563695F76A52de73c848587b17) {
    }
```

```diff
+   Status: CREATED
    contract ProxyAdmin (0x3f92814930f43c6a1C6B133E5945E7B3338F33a6) {
    }
```

```diff
+   Status: CREATED
    contract ProxyAdmin (0x4561A4cDA2CB8a61ED023785bc1817fdf685dcb3) {
    }
```

```diff
+   Status: CREATED
    contract ProxyAdmin (0x509E3CDc218d163DB9A03678107b72e00163b061) {
    }
```

```diff
+   Status: CREATED
    contract ValidatorWallet (0x56D83349c2B8DCF74d7E92D5b6B33d0BADD52D78) {
    }
```

```diff
+   Status: CREATED
    contract Validator (0x758C6bB08B3ea5889B5cddbdeF9A45b3a983c398) {
    }
```

```diff
+   Status: CREATED
    contract ValidatorWallet (0x7CF3d537733F6Ba4183A833c9B021265716cE9d0) {
    }
```

```diff
+   Status: CREATED
    contract ValidatorWallet (0x83215480dB2C6A7E56f9E99EF93AB9B36F8A3DD5) {
    }
```

```diff
+   Status: CREATED
    contract ProxyAdmin (0xAb33350E0319466A81D2AE6DC5CdF2518123f766) {
    }
```

```diff
+   Status: CREATED
    contract ValidatorWallet (0xB0CB1384e3f4a9a9b2447e39b05e10631E1D34B0) {
    }
```

```diff
+   Status: CREATED
    contract GnosisSafe (0xC234E41AE2cb00311956Aa7109fC801ae8c80941) {
    }
```

```diff
+   Status: CREATED
    contract ProxyAdmin (0xCcadc6B174BEcf31a35b818373e90391971a1C0c) {
    }
```

```diff
+   Status: CREATED
    contract ValidatorWallet (0xf59caf75e8A4bFBA4e6e07aD86C7E498E4d2519b) {
    }
```

# Diff at Fri, 24 Nov 2023 10:04:53 GMT:

- author: Radina Talanova (<nt.radina@gmail.com>)
- comparing to: main@34d3533152f3f3d3d80344ca84d4d9a3744c3f17

## Description

New scheduled transaction - there is a DAC update about to be executed by the Upgrade Executer with a delay of 72 hours. It will call the perform() function of the AddNovaKeysetAction (0xDef5CfE3246882BC7f65F9346a8b974BA27D3F4E) contract to add a new keyset as valid batch submitter for Arbitrum Nova. That's related to Security Council's decision to remove Reddit from the Data Availability Committee (DAC) since they plan on winding down their Arbitrum Nova DAC infrastructure, and also remove Offchain Labs secondary key from the DAC.

## Watched changes

```diff
    contract L1ArbitrumTimelock (0xE6841D92B0C345144506576eC13ECf5103aC7f49) {
      values.scheduledTransactions[12]:
+        {"id":"0x492a8fccff029378b8566bdb6157123d1626cbfe2530a9b1f0ad5df688c10471","target":"0x3ffFbAdAF827559da092217e474760E2b2c3CeDd","value":0,"data":"0x1cff79cd000000000000000000000000def5cfe3246882bc7f65f9346a8b974ba27d3f4e00000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000004b147f40c00000000000000000000000000000000000000000000000000000000","delay":259200}
    }
```

# Diff at Mon, 13 Nov 2023 15:23:11 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@a45348c9ae2e765b872be3f217168f73b62d35a6

## Description

Transactions were executed via L1ArbitrumTimelock to replace some of the Security Council members.

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
    contract L1ArbitrumTimelock (0xE6841D92B0C345144506576eC13ECf5103aC7f49) {
      values.scheduledTransactions[11]:
+        {"id":"0x4de857395557aa68ca8e4ac5c12a0a8427b39b01c33e27882d473c25ed69cd93","target":"0xa723C008e76E379c55599D2E4d93879BeaFDa79C","value":0,"data":"0x0000000000000000000000004dbd4fc535ac27206064b68ffcf827b0a60bab3f000000000000000000000000cf57572261c7c2bcf21ffd220ea7d1a27d40a82700000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000c000000000000000000000000000000000000000000000000000000000000002841cff79cd0000000000000000000000009bf7b8884fa381a45f8cb2525905fb36c996297a00000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000204536d8944000000000000000000000000add68bcb0f66878ab9d37a447c7b9067c5dfa94100000000000000000000000000000000000000000000000000000000000000600000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000000c0000000000000000000000003bd8e2ac65ad6f0f094ba6766cbd9484ab49ef23000000000000000000000000f8e1492255d9428c2fc20a98a1deb1215c8ffefd000000000000000000000000b07dc9103328a51128bc6cc1049d1137035f5e280000000000000000000000003e286452b1c66abb08eb5494c3894f40ab5a59af000000000000000000000000b71ca4ffbb7b58d75ba29891ab45e9dc12b444ed0000000000000000000000008f10e3413586c4a8dcfce19d009872b19e9cd8e3000000000000000000000000566a07c3c932ae6af74d77c29e5c30d8b18537100000000000000000000000005280406912eb8ec677df66c326be48f938dc2e440000000000000000000000000275b3d54a5ddbf8205a75984796efe8b7357bae0000000000000000000000005a1fd562271aac2dadb51baab7760b949d9d81df000000000000000000000000f6b6f07862a02c85628b3a9688beae07fea9c863000000000000000000000000475816ca2a31d601b4e336f5c2418a67978abf090000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000","delay":259200}
      values.scheduledTransactions[10]:
+        {"id":"0x4de857395557aa68ca8e4ac5c12a0a8427b39b01c33e27882d473c25ed69cd93","target":"0xa723C008e76E379c55599D2E4d93879BeaFDa79C","value":0,"data":"0x000000000000000000000000c4448b71118c9071bcb9734a0eac55d18a15394900000000000000000000000086a02dd71363c440b21f4c0e5b2ad01ffe1a748200000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000c000000000000000000000000000000000000000000000000000000000000002841cff79cd0000000000000000000000009bf7b8884fa381a45f8cb2525905fb36c996297a00000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000204536d8944000000000000000000000000c232ee726e3c51b86778bb4dbe61c52cc07a60f300000000000000000000000000000000000000000000000000000000000000600000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000000c0000000000000000000000003bd8e2ac65ad6f0f094ba6766cbd9484ab49ef23000000000000000000000000f8e1492255d9428c2fc20a98a1deb1215c8ffefd000000000000000000000000b07dc9103328a51128bc6cc1049d1137035f5e280000000000000000000000003e286452b1c66abb08eb5494c3894f40ab5a59af000000000000000000000000b71ca4ffbb7b58d75ba29891ab45e9dc12b444ed0000000000000000000000008f10e3413586c4a8dcfce19d009872b19e9cd8e3000000000000000000000000566a07c3c932ae6af74d77c29e5c30d8b18537100000000000000000000000005280406912eb8ec677df66c326be48f938dc2e440000000000000000000000000275b3d54a5ddbf8205a75984796efe8b7357bae0000000000000000000000005a1fd562271aac2dadb51baab7760b949d9d81df000000000000000000000000f6b6f07862a02c85628b3a9688beae07fea9c863000000000000000000000000475816ca2a31d601b4e336f5c2418a67978abf090000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000","delay":259200}
      values.scheduledTransactions[9]:
+        {"id":"0x4de857395557aa68ca8e4ac5c12a0a8427b39b01c33e27882d473c25ed69cd93","target":"0xa723C008e76E379c55599D2E4d93879BeaFDa79C","value":0,"data":"0x0000000000000000000000004dbd4fc535ac27206064b68ffcf827b0a60bab3f000000000000000000000000cf57572261c7c2bcf21ffd220ea7d1a27d40a82700000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000c000000000000000000000000000000000000000000000000000000000000002841cff79cd0000000000000000000000009bf7b8884fa381a45f8cb2525905fb36c996297a00000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000204536d8944000000000000000000000000423552c0f05baccac5bfa91c6dcf1dc53a0a164100000000000000000000000000000000000000000000000000000000000000600000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000000c0000000000000000000000003bd8e2ac65ad6f0f094ba6766cbd9484ab49ef23000000000000000000000000f8e1492255d9428c2fc20a98a1deb1215c8ffefd000000000000000000000000b07dc9103328a51128bc6cc1049d1137035f5e280000000000000000000000003e286452b1c66abb08eb5494c3894f40ab5a59af000000000000000000000000b71ca4ffbb7b58d75ba29891ab45e9dc12b444ed0000000000000000000000008f10e3413586c4a8dcfce19d009872b19e9cd8e3000000000000000000000000566a07c3c932ae6af74d77c29e5c30d8b18537100000000000000000000000005280406912eb8ec677df66c326be48f938dc2e440000000000000000000000000275b3d54a5ddbf8205a75984796efe8b7357bae0000000000000000000000005a1fd562271aac2dadb51baab7760b949d9d81df000000000000000000000000f6b6f07862a02c85628b3a9688beae07fea9c863000000000000000000000000475816ca2a31d601b4e336f5c2418a67978abf090000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000","delay":259200}
      values.scheduledTransactions[8]:
+        {"id":"0x4de857395557aa68ca8e4ac5c12a0a8427b39b01c33e27882d473c25ed69cd93","target":"0x3ffFbAdAF827559da092217e474760E2b2c3CeDd","value":0,"data":"0x1cff79cd0000000000000000000000009bf7b8884fa381a45f8cb2525905fb36c996297a00000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000204536d8944000000000000000000000000f06e95ef589d9c38af242a8aaee8375f14023f8500000000000000000000000000000000000000000000000000000000000000600000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000000c0000000000000000000000003bd8e2ac65ad6f0f094ba6766cbd9484ab49ef23000000000000000000000000f8e1492255d9428c2fc20a98a1deb1215c8ffefd000000000000000000000000b07dc9103328a51128bc6cc1049d1137035f5e280000000000000000000000003e286452b1c66abb08eb5494c3894f40ab5a59af000000000000000000000000b71ca4ffbb7b58d75ba29891ab45e9dc12b444ed0000000000000000000000008f10e3413586c4a8dcfce19d009872b19e9cd8e3000000000000000000000000566a07c3c932ae6af74d77c29e5c30d8b18537100000000000000000000000005280406912eb8ec677df66c326be48f938dc2e440000000000000000000000000275b3d54a5ddbf8205a75984796efe8b7357bae0000000000000000000000005a1fd562271aac2dadb51baab7760b949d9d81df000000000000000000000000f6b6f07862a02c85628b3a9688beae07fea9c863000000000000000000000000475816ca2a31d601b4e336f5c2418a67978abf0900000000000000000000000000000000000000000000000000000000","delay":259200}
    }
```

```diff
    contract SecurityCouncil (0xF06E95eF589D9c38af242a8AAee8375f14023F85) {
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

# Diff at Tue, 26 Sep 2023 07:54:37 GMT:

- author: Luca Donno (<donnoh99@gmail.com>)
- comparing to: main@cfd4e281f2af40c7c69302b16c1308c0c5651be0

## Watched changes

```diff
    contract RollupProxy (0x5eF0D09d1E6204141B4d37530808eD19f60FBa35) {
      values.challenges:
+        []
    }
```

```diff
    contract ChallengeManager (0xe5896783a2F463446E1f624e64Aa6836BE4C6f58) {
      derivedName:
+        "ChallengeManager"
    }
```

# Diff at Fri, 22 Sep 2023 09:02:08 GMT:

- author: Luca Donno (<donnoh99@gmail.com>)
- comparing to: main@3a33c063dab8666dc32b4ec15a81995020325b49

## Watched changes

```diff
    contract L1ArbitrumTimelock (0xE6841D92B0C345144506576eC13ECf5103aC7f49) {
      values.scheduledTransactions:
+        [{"id":"0x85368b7ca2ee99b3d479ddff6298f69f0ce7d35227a731b70e8bc689074ba0af","target":"0xa723C008e76E379c55599D2E4d93879BeaFDa79C","value":0,"data":"0x0000000000000000000000004dbd4fc535ac27206064b68ffcf827b0a60bab3f000000000000000000000000cf57572261c7c2bcf21ffd220ea7d1a27d40a82700000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000c000000000000000000000000000000000000000000000000000000000000000841cff79cd0000000000000000000000006274106eedd4848371d2c09e0352d67b795ed51600000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000004b147f40c0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000","delay":259200},{"id":"0x6f801c57f0acf08c9688585c8b1cbb4b36f7053267befee7b2ee996b58592f2f","target":"0xa723C008e76E379c55599D2E4d93879BeaFDa79C","value":0,"data":"0x0000000000000000000000004dbd4fc535ac27206064b68ffcf827b0a60bab3f000000000000000000000000cf57572261c7c2bcf21ffd220ea7d1a27d40a82700000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000c000000000000000000000000000000000000000000000000000000000000000841cff79cd00000000000000000000000085792f6bf346e3bfd3a275318add2c44a105844700000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000004b147f40c0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000","delay":259200},{"id":"0x0a0e8ebc47cd2cc5c020dc6a52e1c0c349165c7133547d811956c973e6b03ee2","target":"0x3ffFbAdAF827559da092217e474760E2b2c3CeDd","value":0,"data":"0x1cff79cd00000000000000000000000022ec545357162c342f643bddb2ed4c3fb6b42eb000000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000004b147f40c00000000000000000000000000000000000000000000000000000000","delay":259200},{"id":"0x0a0e8ebc47cd2cc5c020dc6a52e1c0c349165c7133547d811956c973e6b03ee2","target":"0xa723C008e76E379c55599D2E4d93879BeaFDa79C","value":0,"data":"0x0000000000000000000000004dbd4fc535ac27206064b68ffcf827b0a60bab3f000000000000000000000000cf57572261c7c2bcf21ffd220ea7d1a27d40a82700000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000c000000000000000000000000000000000000000000000000000000000000000841cff79cd0000000000000000000000001015c1ae166c4c39d18a1151b7029bac1530c9aa00000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000004b147f40c0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000","delay":259200},{"id":"0x0a0e8ebc47cd2cc5c020dc6a52e1c0c349165c7133547d811956c973e6b03ee2","target":"0xa723C008e76E379c55599D2E4d93879BeaFDa79C","value":0,"data":"0x000000000000000000000000c4448b71118c9071bcb9734a0eac55d18a15394900000000000000000000000086a02dd71363c440b21f4c0e5b2ad01ffe1a748200000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000c000000000000000000000000000000000000000000000000000000000000000841cff79cd00000000000000000000000022ec545357162c342f643bddb2ed4c3fb6b42eb000000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000004b147f40c0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000","delay":259200},{"id":"0x57ae5d951014e5b6dad9718af7c1b2fd41172f8957de355c15fbdd9a6e28395f","target":"0xa723C008e76E379c55599D2E4d93879BeaFDa79C","value":0,"data":"0x0000000000000000000000004dbd4fc535ac27206064b68ffcf827b0a60bab3f000000000000000000000000cf57572261c7c2bcf21ffd220ea7d1a27d40a82700000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000c000000000000000000000000000000000000000000000000000000000000000841cff79cd0000000000000000000000007b1247f443359d1447cf25e73380bc9b99f2628f00000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000004b147f40c0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000","delay":259200},{"id":"0x57ae5d951014e5b6dad9718af7c1b2fd41172f8957de355c15fbdd9a6e28395f","target":"0xa723C008e76E379c55599D2E4d93879BeaFDa79C","value":0,"data":"0x0000000000000000000000004dbd4fc535ac27206064b68ffcf827b0a60bab3f000000000000000000000000cf57572261c7c2bcf21ffd220ea7d1a27d40a82700000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000c000000000000000000000000000000000000000000000000000000000000000841cff79cd000000000000000000000000baba4daf5800b9746f58c724f05e03880850d57800000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000004b147f40c0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000","delay":259200},{"id":"0x57ae5d951014e5b6dad9718af7c1b2fd41172f8957de355c15fbdd9a6e28395f","target":"0x3ffFbAdAF827559da092217e474760E2b2c3CeDd","value":0,"data":"0x1cff79cd000000000000000000000000baba4daf5800b9746f58c724f05e03880850d57800000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000004b147f40c00000000000000000000000000000000000000000000000000000000","delay":259200}]
    }
```

# Diff at Thu, 21 Sep 2023 14:53:24 GMT:

- author: Luca Donno (<donnoh99@gmail.com>)
- comparing to: main@7579713bbe334d225f845fec749fd69636fe060a

## Watched changes

```diff
    contract L1ArbitrumTimelock (0xE6841D92B0C345144506576eC13ECf5103aC7f49) {
      upgradeability.implementation:
-        "0x962d70fc48F3465404bC77B03f104746B25a1d1b"
+        "0x61dC65001A8De4138DAD5167e43FF0FB0AB8D3B3"
    }
```
