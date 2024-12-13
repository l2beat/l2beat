Generated with discovered.json: 0x7066c482913892a0d5497dd83af41388af955677

# Diff at Sun, 08 Dec 2024 13:29:13 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@59fd7a30471906b5a479f280731621e94e22f17c block: 278553826
- current block number: 282642841

## Description

Nodelicense that reverts in the mint() function and prevents minting of new node licenses.

## Watched changes

```diff
    contract NodeLicenseRegistry (0xbc14d8563b248B79689ECbc43bBa53290e0b6b66) {
    +++ description: This is the contract where Xai Sentry Keys to run a node are minted.
      sourceHashes.1:
-        "0x1b5b7bb8aa9932be3a7e263d3905e78382f86318e4252b53a05c67152ede1de1"
+        "0xc408ffd6d9b25f5dccbe9efa0caca71b711c95f903420227c41605fc4672a46c"
      values.$implementation:
-        "0xfD6Bb931D2Ee134E70568ca36584c043cB278734"
+        "0xE6E5356423516C9b75d4Dfb1fCa3973c5B695be8"
      values.$pastUpgrades.8:
+        ["2024-12-06T17:52:34.000Z","0x394e784074ba95b55fdcea26980e75c894d6fe1295153b97cdb456d010c2a3a0",["0xE6E5356423516C9b75d4Dfb1fCa3973c5B695be8"]]
      values.$upgradeCount:
-        8
+        9
      derivedName:
-        "NodeLicense5"
+        "NodeLicense7"
    }
```

## Source code changes

```diff
.../NodeLicenseRegistry/NodeLicense7.sol}          | 152 +++++++++++----------
 1 file changed, 83 insertions(+), 69 deletions(-)
```

Generated with discovered.json: 0x284b3b6a1df229a44060d915d13bb4957fa8a862

# Diff at Fri, 06 Dec 2024 08:10:01 GMT:

- author: Piotr Szlachciak (<szlachciak.piotr@gmail.com>)
- comparing to: main@f9ded76f7930b0c86788e4c4595d553b165b87d1 block: 278553826
- current block number: 278553826

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 278553826 (main branch discovery), not current.

```diff
    contract ValidatorUtils (0x6c21303F5986180B1394d2C89f3e883890E2867b) {
    +++ description: This contract implements view only utilities for validators.
      template:
+        "orbitstack/ValidatorUtils"
      description:
+        "This contract implements view only utilities for validators."
    }
```

Generated with discovered.json: 0x0f344b80eac1e20b044a684c87716c33458d120b

# Diff at Fri, 29 Nov 2024 11:28:53 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@9776abb8b1f960f6f1ec6ec27558b5eff7eb5b87 block: 278553826
- current block number: 278553826

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 278553826 (main branch discovery), not current.

```diff
    contract XaiMultisig2 (0x000d8C5A70B8805DF02f409F2715d05B9A63E871) {
    +++ description: None
      directlyReceivedPermissions:
+        [{"permission":"configure","target":"0x995a9d3ca121D48d21087eDE20bc8acb2398c8B1","description":"Add/remove batchPosters (Sequencers)."}]
    }
```

```diff
    contract UpgradeExecutor (0x0EE7AD3Cc291343C9952fFd8844e86d294fa513F) {
    +++ description: Central contract defining the access control permissions for upgrading the system contract implementations.
      directlyReceivedPermissions.1.description:
-        "can pause and unpause and set important roles and parameters in the system contracts: Can delegate Sequencer management to a BatchPosterManager address, manage data availability and DACs, set the Sequencer-only window, introduce an allowList to the bridge and whitelist Inboxes/Outboxes."
+        "Pause and unpause and set important roles and parameters in the system contracts: Can delegate Sequencer management to a BatchPosterManager address, manage data availability and DACs, set the Sequencer-only window, introduce an allowList to the bridge and whitelist Inboxes/Outboxes."
    }
```

```diff
    contract XaiMultisig (0x4972A8EF186Ee42A14Cdd3c47f52ec06a6dc495E) {
    +++ description: None
      receivedPermissions.0.description:
-        "can pause and unpause and set important roles and parameters in the system contracts: Can delegate Sequencer management to a BatchPosterManager address, manage data availability and DACs, set the Sequencer-only window, introduce an allowList to the bridge and whitelist Inboxes/Outboxes."
+        "Pause and unpause and set important roles and parameters in the system contracts: Can delegate Sequencer management to a BatchPosterManager address, manage data availability and DACs, set the Sequencer-only window, introduce an allowList to the bridge and whitelist Inboxes/Outboxes."
    }
```

```diff
    contract SequencerInbox (0x995a9d3ca121D48d21087eDE20bc8acb2398c8B1) {
    +++ description: A sequencer (registered in this contract) can submit transaction batches or commitments here.
      issuedPermissions.4:
+        {"permission":"upgrade","target":"0x4972A8EF186Ee42A14Cdd3c47f52ec06a6dc495E","via":[{"address":"0x0EE7AD3Cc291343C9952fFd8844e86d294fa513F","delay":0},{"address":"0x041F85dD87c46B941dc9b15c6628B19ee5358485","delay":0}]}
      issuedPermissions.3:
+        {"permission":"sequence","target":"0x7F68dba68E72a250004812fe04F1123Fca89aBa9","via":[]}
      issuedPermissions.2:
+        {"permission":"configure","target":"0xc7185e37A4aB4Af0E77bC08249CD2590AE3E1b51","via":[{"address":"0x000d8C5A70B8805DF02f409F2715d05B9A63E871","delay":0,"description":"Add/remove batchPosters (Sequencers)."}]}
      issuedPermissions.1.permission:
-        "upgrade"
+        "configure"
      issuedPermissions.1.target:
-        "0x4972A8EF186Ee42A14Cdd3c47f52ec06a6dc495E"
+        "0x7f910C718bAF6698FBF9b56e047ECd52d157bAD6"
      issuedPermissions.1.via.1:
-        {"address":"0x041F85dD87c46B941dc9b15c6628B19ee5358485","delay":0}
      issuedPermissions.1.via.0.address:
-        "0x0EE7AD3Cc291343C9952fFd8844e86d294fa513F"
+        "0x000d8C5A70B8805DF02f409F2715d05B9A63E871"
      issuedPermissions.1.via.0.description:
+        "Add/remove batchPosters (Sequencers)."
      issuedPermissions.0.permission:
-        "sequence"
+        "configure"
      issuedPermissions.0.target:
-        "0x7F68dba68E72a250004812fe04F1123Fca89aBa9"
+        "0x2B95cdD1adD34461Fe737800c0D5A68d556B51b4"
      issuedPermissions.0.via.0:
+        {"address":"0x000d8C5A70B8805DF02f409F2715d05B9A63E871","delay":0,"description":"Add/remove batchPosters (Sequencers)."}
    }
```

```diff
    contract RollupProxy (0xC47DacFbAa80Bd9D8112F4e8069482c2A3221336) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      issuedPermissions.0.via.0.description:
-        "can pause and unpause and set important roles and parameters in the system contracts: Can delegate Sequencer management to a BatchPosterManager address, manage data availability and DACs, set the Sequencer-only window, introduce an allowList to the bridge and whitelist Inboxes/Outboxes."
+        "Pause and unpause and set important roles and parameters in the system contracts: Can delegate Sequencer management to a BatchPosterManager address, manage data availability and DACs, set the Sequencer-only window, introduce an allowList to the bridge and whitelist Inboxes/Outboxes."
      fieldMeta.minimumAssertionPeriod:
+        {"description":"Minimum time delta between newly created nodes (stateUpdates). This is checked on `stakeOnNewNode()`. Format is number of ETHEREUM blocks, even for L3s. "}
    }
```

Generated with discovered.json: 0x6318fba4ca93fe72e6cb3df7399d001df64639b8

# Diff at Wed, 27 Nov 2024 13:46:30 GMT:

- author: vincfurc (<10850139+vincfurc@users.noreply.github.com>)
- comparing to: main@3b9391cfe483e60a1853eeae6e47b4de475aac4e block: 269220300
- current block number: 278553826

## Description

Move to discodriven data.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 269220300 (main branch discovery), not current.

```diff
    contract XaiMultisig2 (0x000d8C5A70B8805DF02f409F2715d05B9A63E871) {
    +++ description: None
      name:
-        "GnosisSafeAdminMember"
+        "XaiMultisig2"
    }
```

```diff
-   Status: DELETED
    contract BucketTracker (0x1582e73D95F33E39B421F9224D9e7daF4508408E)
    +++ description: None
```

```diff
    contract ERC20Outbox (0x1E400568AD4840dbE50FB32f306B842e9ddeF726) {
    +++ description: Facilitates L2 to L1 contract calls: Messages initiated from L2 (for example withdrawal messages) eventually resolve in execution on L1.
      name:
-        "Outbox"
+        "ERC20Outbox"
      displayName:
+        "Outbox"
    }
```

```diff
    contract L1OrbitGatewayRouter (0x22CCA5Dc96a4Ac1EC32c9c7C5ad4D66254a24C35) {
    +++ description: This routing contract maps tokens to the correct escrow (gateway) to be then bridged with canonical messaging.
      name:
-        "L1GatewayRouter"
+        "L1OrbitGatewayRouter"
    }
```

```diff
-   Status: DELETED
    contract StakingPool (0x599C8489256Fb17b66d499d907F30b8022a29443)
    +++ description: None
```

```diff
-   Status: DELETED
    contract PoolBeacon (0x5f9D168d3435747335b1B3dC7e4d42e3510087C7)
    +++ description: None
```

```diff
    contract PoolProxyDeployer (0x68D78D1E81379EfD9C61f8E9131D52CE571AF4fD) {
    +++ description: Manages beacon addresses for the v2 staking pools.
      description:
+        "Manages beacon addresses for the v2 staking pools."
    }
```

```diff
-   Status: DELETED
    contract PoolBeacon (0x6Bc4e6B2c13Ba42e933b23AFAb8a58bbbBa5D02B)
    +++ description: None
```

```diff
    contract ERC20Bridge (0x7dd8A76bdAeBE3BBBaCD7Aa87f1D4FDa1E60f94f) {
    +++ description: Escrow contract for the project's gas token (Can be different from ETH). Keeps a list of allowed Inboxes and Outboxes for canonical bridge messaging.
      name:
-        "Bridge"
+        "ERC20Bridge"
      displayName:
+        "Bridge"
    }
```

```diff
-   Status: DELETED
    contract GnosisSafeL2 (0x7eC7e03563f781ED4c56BBC4c5F28C1B4dB932ff)
    +++ description: None
```

```diff
-   Status: DELETED
    contract BucketTracker (0xa83825Dc4D94513d1C907b319EE8224FA63A29B2)
    +++ description: None
```

```diff
    contract ERC20Inbox (0xaE21fDA3de92dE2FDAF606233b2863782Ba046F9) {
    +++ description: Facilitates sending L1 to L2 messages like depositing ETH, but does not escrow funds.
      name:
-        "Inbox"
+        "ERC20Inbox"
      displayName:
+        "Inbox"
    }
```

```diff
    contract L1OrbitERC20Gateway (0xb591cE747CF19cF30e11d656EB94134F523A9e77) {
    +++ description: Escrows deposited ERC-20 assets for the canonical Bridge. Upon depositing, a generic token representation will be minted at the destination. Withdrawals are initiated by the Outbox contract.
      name:
-        "L1ERC20Gateway"
+        "L1OrbitERC20Gateway"
    }
```

```diff
    contract NodeLicenseRegistry (0xbc14d8563b248B79689ECbc43bBa53290e0b6b66) {
    +++ description: This is the contract where Xai Sentry Keys to run a node are minted.
      description:
+        "This is the contract where Xai Sentry Keys to run a node are minted."
    }
```

```diff
    contract ProxyAdmin (0xD88c8E0aE21beA6adE41A41130Bb4cd43e6b1723) {
    +++ description: None
      name:
-        "StakingProxyAdmin"
+        "ProxyAdmin"
    }
```

```diff
    contract PoolFactory (0xF9E08660223E2dbb1c0b28c82942aB6B5E38b8E5) {
    +++ description: The PoolFactory allows creating and managing staking pools for V2 staking. Users can stake esXAI (and / or Sentry Keys) in pools. This contract's address is whitelisted in the esXAI token contract, which allows it to initiate arbitrary esXAI token transfers. V2 staking through this contract is currently set to true.
      description:
+        "The PoolFactory allows creating and managing staking pools for V2 staking. Users can stake esXAI (and / or Sentry Keys) in pools. This contract's address is whitelisted in the esXAI token contract, which allows it to initiate arbitrary esXAI token transfers. V2 staking through this contract is currently set to true."
    }
```

```diff
-   Status: DELETED
    contract PoolBeacon (0xfB93c2e5E41BD0ffd2E99A88e6d2A8D4F542d39a)
    +++ description: None
```

```diff
    contract XaiFundsReiceiverMultisig (0xFCF7248C495d6fd3641eE43F861c48Ebe402c878) {
    +++ description: The designated fundsReceiver in the NodeLicenseRegistry. Receives all ETH from 'Sentry Node License' mints.
      name:
-        "FundsReiceiverMultisig"
+        "XaiFundsReiceiverMultisig"
    }
```

```diff
    contract SentryReferee (0xfD41041180571C5D371BEA3D9550E55653671198) {
    +++ description: The referee contract manages the Xai Sentry protocol. Sentry nodes that are tasked to watch the state transitions on Xai receive esXAI rewards for their service. These watchers participate in a game with a central 'challenger' by posting their assertions to make sure they are actually watching. In case of a malicious state transition, sentries are supposed to raise an alarm offchain. The referee contract is also a whitelisted address in the esXAI token contract, which allows it to initiate arbitrary esXAI token transfers. New staking through this contract is disabled in favor of the new v2 staking. V1 Stakers can continue to get staking rewards here or withdraw/migrate their assets.
      values.accessControl:
-        {"DEFAULT_ADMIN_ROLE":{"adminRole":"DEFAULT_ADMIN_ROLE","members":["0x7C94E07bbf73518B0E25D1Be200a5b58F46F9dC7","0xfeBC06428a15C6618Baa5589C3E9C40ACF71aA79"]},"CHALLENGER_ROLE":{"adminRole":"DEFAULT_ADMIN_ROLE","members":["0xC74c1e08963CEEf0e1F2F2a2eeB879f443e86836"]},"KYC_ADMIN_ROLE":{"adminRole":"DEFAULT_ADMIN_ROLE","members":["0x7eC7e03563f781ED4c56BBC4c5F28C1B4dB932ff","0xCBA55AAD91BB119794C48AF09A734Fc31A4CDF56","0x83f396d217820386464e8E99205DCf090d0DD04c"]}}
      description:
+        "The referee contract manages the Xai Sentry protocol. Sentry nodes that are tasked to watch the state transitions on Xai receive esXAI rewards for their service. These watchers participate in a game with a central 'challenger' by posting their assertions to make sure they are actually watching. In case of a malicious state transition, sentries are supposed to raise an alarm offchain. The referee contract is also a whitelisted address in the esXAI token contract, which allows it to initiate arbitrary esXAI token transfers. New staking through this contract is disabled in favor of the new v2 staking. V1 Stakers can continue to get staking rewards here or withdraw/migrate their assets."
    }
```

```diff
-   Status: DELETED
    contract GnosisSafeL2 (0xfeBC06428a15C6618Baa5589C3E9C40ACF71aA79)
    +++ description: None
```

Generated with discovered.json: 0xd2d78e1158c0f33ba3269855cf148129a9947d3d

# Diff at Fri, 15 Nov 2024 08:18:21 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@a00c2a67d12a174a45864b549412045028598606 block: 269220300
- current block number: 269220300

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 269220300 (main branch discovery), not current.

```diff
    contract UpgradeExecutor (0x0EE7AD3Cc291343C9952fFd8844e86d294fa513F) {
    +++ description: Central contract defining the access control permissions for upgrading the system contract implementations.
      description:
-        "Central contract defining the access control for upgrading the system contract implementations."
+        "Central contract defining the access control permissions for upgrading the system contract implementations."
    }
```

```diff
    contract L1GatewayRouter (0x22CCA5Dc96a4Ac1EC32c9c7C5ad4D66254a24C35) {
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
    contract ERC20RollupEventInbox (0x36aDe24988E4C47602e38BD9a0Bd89031eF807a8) {
    +++ description: Helper contract sending configuration data over the bridge during the systems initialization.
      template:
+        "orbitstack/RollupEventInbox"
      displayName:
+        "RollupEventInbox"
      description:
+        "Helper contract sending configuration data over the bridge during the systems initialization."
    }
```

```diff
    contract SequencerInbox (0x995a9d3ca121D48d21087eDE20bc8acb2398c8B1) {
    +++ description: A sequencer (registered in this contract) can submit transaction batches or commitments here.
      fieldMeta.maxTimeVariation.description:
-        "Settable by the Rollup Owner. Transactions can only be force-included after `delayBlocks` window (Sequencer-only) has passed."
+        "Settable by the Rollup Owner. Transactions can only be force-included after the `delayBlocks` window (Sequencer-only) has passed."
    }
```

```diff
    contract RollupProxy (0xC47DacFbAa80Bd9D8112F4e8069482c2A3221336) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      issuedPermissions.3:
-        {"permission":"upgrade","target":"0x4972A8EF186Ee42A14Cdd3c47f52ec06a6dc495E","via":[{"address":"0x0EE7AD3Cc291343C9952fFd8844e86d294fa513F","delay":0}]}
      issuedPermissions.2.permission:
-        "propose"
+        "validate"
      issuedPermissions.1.permission:
-        "configure"
+        "upgrade"
      issuedPermissions.1.via.0.description:
-        "can pause and unpause and set important roles and parameters in the system contracts: Can delegate Sequencer management to a BatchPosterManager address, manage data availability and DACs, set the Sequencer-only window, introduce an allowList to the bridge and whitelist Inboxes/Outboxes."
      issuedPermissions.0.permission:
-        "challenge"
+        "configure"
      issuedPermissions.0.target:
-        "0x25EA41f0bDa921a0eBf48291961B1F10b59BC6b8"
+        "0x4972A8EF186Ee42A14Cdd3c47f52ec06a6dc495E"
      issuedPermissions.0.via.0:
+        {"address":"0x0EE7AD3Cc291343C9952fFd8844e86d294fa513F","delay":0,"description":"can pause and unpause and set important roles and parameters in the system contracts: Can delegate Sequencer management to a BatchPosterManager address, manage data availability and DACs, set the Sequencer-only window, introduce an allowList to the bridge and whitelist Inboxes/Outboxes."}
    }
```

Generated with discovered.json: 0x4d1a24a017cf5ac5c2b9d5e6c4e322d445fe9cf2

# Diff at Mon, 04 Nov 2024 08:11:16 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@950c85bf556f084c302d2b03100375cf3c7ed376 block: 269220300
- current block number: 269220300

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 269220300 (main branch discovery), not current.

```diff
    contract UpgradeExecutor (0x0EE7AD3Cc291343C9952fFd8844e86d294fa513F) {
    +++ description: Central contract defining the access control for upgrading the system contract implementations.
      directlyReceivedPermissions.2:
+        {"permission":"upgrade","target":"0xC47DacFbAa80Bd9D8112F4e8069482c2A3221336"}
      directlyReceivedPermissions.1.permission:
-        "upgrade"
+        "configure"
      directlyReceivedPermissions.1.description:
+        "can pause and unpause and set important roles and parameters in the system contracts: Can delegate Sequencer management to a BatchPosterManager address, manage data availability and DACs, set the Sequencer-only window, introduce an allowList to the bridge and whitelist Inboxes/Outboxes."
    }
```

```diff
    contract XaiMultisig (0x4972A8EF186Ee42A14Cdd3c47f52ec06a6dc495E) {
    +++ description: None
      receivedPermissions.10:
+        {"permission":"upgrade","target":"0xC47DacFbAa80Bd9D8112F4e8069482c2A3221336","via":[{"address":"0x0EE7AD3Cc291343C9952fFd8844e86d294fa513F"}]}
      receivedPermissions.9.target:
-        "0xC47DacFbAa80Bd9D8112F4e8069482c2A3221336"
+        "0xb591cE747CF19cF30e11d656EB94134F523A9e77"
      receivedPermissions.9.via.1:
+        {"address":"0x0EE7AD3Cc291343C9952fFd8844e86d294fa513F"}
      receivedPermissions.9.via.0.address:
-        "0x0EE7AD3Cc291343C9952fFd8844e86d294fa513F"
+        "0x041F85dD87c46B941dc9b15c6628B19ee5358485"
      receivedPermissions.8.target:
-        "0xb591cE747CF19cF30e11d656EB94134F523A9e77"
+        "0xaE21fDA3de92dE2FDAF606233b2863782Ba046F9"
      receivedPermissions.7.target:
-        "0xaE21fDA3de92dE2FDAF606233b2863782Ba046F9"
+        "0x995a9d3ca121D48d21087eDE20bc8acb2398c8B1"
      receivedPermissions.6.target:
-        "0x995a9d3ca121D48d21087eDE20bc8acb2398c8B1"
+        "0x7dd8A76bdAeBE3BBBaCD7Aa87f1D4FDa1E60f94f"
      receivedPermissions.5.target:
-        "0x7dd8A76bdAeBE3BBBaCD7Aa87f1D4FDa1E60f94f"
+        "0x3a3f62034a42a35eA1686B199bB73006aa525eE4"
      receivedPermissions.4.target:
-        "0x3a3f62034a42a35eA1686B199bB73006aa525eE4"
+        "0x36aDe24988E4C47602e38BD9a0Bd89031eF807a8"
      receivedPermissions.3.target:
-        "0x36aDe24988E4C47602e38BD9a0Bd89031eF807a8"
+        "0x22CCA5Dc96a4Ac1EC32c9c7C5ad4D66254a24C35"
      receivedPermissions.2.target:
-        "0x22CCA5Dc96a4Ac1EC32c9c7C5ad4D66254a24C35"
+        "0x1E400568AD4840dbE50FB32f306B842e9ddeF726"
      receivedPermissions.1.target:
-        "0x1E400568AD4840dbE50FB32f306B842e9ddeF726"
+        "0x0EE7AD3Cc291343C9952fFd8844e86d294fa513F"
      receivedPermissions.0.permission:
-        "upgrade"
+        "configure"
      receivedPermissions.0.target:
-        "0x0EE7AD3Cc291343C9952fFd8844e86d294fa513F"
+        "0xC47DacFbAa80Bd9D8112F4e8069482c2A3221336"
      receivedPermissions.0.via.1:
-        {"address":"0x0EE7AD3Cc291343C9952fFd8844e86d294fa513F"}
      receivedPermissions.0.via.0.address:
-        "0x041F85dD87c46B941dc9b15c6628B19ee5358485"
+        "0x0EE7AD3Cc291343C9952fFd8844e86d294fa513F"
      receivedPermissions.0.description:
+        "can pause and unpause and set important roles and parameters in the system contracts: Can delegate Sequencer management to a BatchPosterManager address, manage data availability and DACs, set the Sequencer-only window, introduce an allowList to the bridge and whitelist Inboxes/Outboxes."
    }
```

```diff
    contract SequencerInbox (0x995a9d3ca121D48d21087eDE20bc8acb2398c8B1) {
    +++ description: A sequencer (registered in this contract) can submit transaction batches or commitments here.
+++ description: Settable by the Rollup Owner. Transactions can only be force-included after `delayBlocks` window (Sequencer-only) has passed.
      values.maxTimeVariation:
-        [5760,96,86400,3600]
+        {"delayBlocks":5760,"futureBlocks":96,"delaySeconds":86400,"futureSeconds":3600}
      values.postsBlobs:
+        false
      fieldMeta.maxTimeVariation.description:
-        "Struct: delayBlocks, futureBlocks, delaySeconds, futureSeconds. onlyRollupOwner settable. Transactions can only be force-included after `delayBlocks` window (Sequencer-only) has passed."
+        "Settable by the Rollup Owner. Transactions can only be force-included after `delayBlocks` window (Sequencer-only) has passed."
    }
```

```diff
    contract RollupProxy (0xC47DacFbAa80Bd9D8112F4e8069482c2A3221336) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      issuedPermissions.3:
+        {"permission":"upgrade","target":"0x4972A8EF186Ee42A14Cdd3c47f52ec06a6dc495E","via":[{"address":"0x0EE7AD3Cc291343C9952fFd8844e86d294fa513F","delay":0}]}
      issuedPermissions.2.permission:
-        "upgrade"
+        "propose"
      issuedPermissions.2.target:
-        "0x4972A8EF186Ee42A14Cdd3c47f52ec06a6dc495E"
+        "0x25EA41f0bDa921a0eBf48291961B1F10b59BC6b8"
      issuedPermissions.2.via.0:
-        {"address":"0x0EE7AD3Cc291343C9952fFd8844e86d294fa513F","delay":0}
      issuedPermissions.1.permission:
-        "propose"
+        "configure"
      issuedPermissions.1.target:
-        "0x25EA41f0bDa921a0eBf48291961B1F10b59BC6b8"
+        "0x4972A8EF186Ee42A14Cdd3c47f52ec06a6dc495E"
      issuedPermissions.1.via.0:
+        {"address":"0x0EE7AD3Cc291343C9952fFd8844e86d294fa513F","delay":0,"description":"can pause and unpause and set important roles and parameters in the system contracts: Can delegate Sequencer management to a BatchPosterManager address, manage data availability and DACs, set the Sequencer-only window, introduce an allowList to the bridge and whitelist Inboxes/Outboxes."}
    }
```

Generated with discovered.json: 0xa3f994ed9f8edef595618f281e564b7afb6e9c6a

# Diff at Wed, 30 Oct 2024 12:11:38 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@0a8a53530022c6c5edd257c3682a3e7f80d0c550 block: 267504356
- current block number: 269220300

## Description

Minor upgrade to the SentryReferee that adds an admin-permissioned `closeCurrentChallenge()` function and migrates the math from inside the SentryReferee to a separate RefereeCalculations contract.

## Watched changes

```diff
    contract StakingProxyAdmin (0xD88c8E0aE21beA6adE41A41130Bb4cd43e6b1723) {
    +++ description: None
      directlyReceivedPermissions.5:
+        {"permission":"upgrade","target":"0xfD41041180571C5D371BEA3D9550E55653671198"}
      directlyReceivedPermissions.4.target:
-        "0xfD41041180571C5D371BEA3D9550E55653671198"
+        "0xF9E08660223E2dbb1c0b28c82942aB6B5E38b8E5"
      directlyReceivedPermissions.3.target:
-        "0xF9E08660223E2dbb1c0b28c82942aB6B5E38b8E5"
+        "0xCd62360854aecf6285Fa310D69C5EBaf4Cd5e95F"
    }
```

```diff
    contract SentryReferee (0xfD41041180571C5D371BEA3D9550E55653671198) {
    +++ description: None
      sourceHashes.1:
-        "0xf01cd4fba1b7619d893eac322f11d01c25dec45cec99f03c7c3dac3db562d011"
+        "0x049618a11ae7ca2b4087908a6cb43e2102853e1798710e66a169be6fd6d4ed99"
      values.$implementation:
-        "0x609152cb742916E0F7FBC4391Be750C458b049fe"
+        "0xfCa2657FC4456Ac256A78A31aAB1128F5e1d2D40"
      values.$pastUpgrades.8:
+        ["2024-10-29T18:27:08.000Z","0x526befebd96c284baeeb94980c3561d88cc1ba40fb12c1c8b8db78b29b18ce20",["0xfCa2657FC4456Ac256A78A31aAB1128F5e1d2D40"]]
      values.$upgradeCount:
-        8
+        9
      values.refereeCalculationsAddress:
+        "0xCd62360854aecf6285Fa310D69C5EBaf4Cd5e95F"
      derivedName:
-        "Referee8"
+        "Referee9"
    }
```

```diff
+   Status: CREATED
    contract RefereeCalculations (0xCd62360854aecf6285Fa310D69C5EBaf4Cd5e95F)
    +++ description: None
```

## Source code changes

```diff
.../RefereeCalculations/RefereeCalculations.sol    | 1770 ++++++++++++++++++++
 .../TransparentUpgradeableProxy.p.sol              |  695 ++++++++
 .../SentryReferee/Referee9.sol}                    |  605 ++-----
 3 files changed, 2576 insertions(+), 494 deletions(-)
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 267504356 (main branch discovery), not current.

```diff
    contract SentryReferee (0xfD41041180571C5D371BEA3D9550E55653671198) {
    +++ description: None
      values.accessControl:
+        {"DEFAULT_ADMIN_ROLE":{"adminRole":"DEFAULT_ADMIN_ROLE","members":["0x7C94E07bbf73518B0E25D1Be200a5b58F46F9dC7","0xfeBC06428a15C6618Baa5589C3E9C40ACF71aA79"]},"CHALLENGER_ROLE":{"adminRole":"DEFAULT_ADMIN_ROLE","members":["0xC74c1e08963CEEf0e1F2F2a2eeB879f443e86836"]},"KYC_ADMIN_ROLE":{"adminRole":"DEFAULT_ADMIN_ROLE","members":["0x7eC7e03563f781ED4c56BBC4c5F28C1B4dB932ff","0xCBA55AAD91BB119794C48AF09A734Fc31A4CDF56","0x83f396d217820386464e8E99205DCf090d0DD04c"]}}
    }
```

```diff
+   Status: CREATED
    contract GnosisSafeL2 (0x7eC7e03563f781ED4c56BBC4c5F28C1B4dB932ff)
    +++ description: None
```

```diff
+   Status: CREATED
    contract GnosisSafeL2 (0xfeBC06428a15C6618Baa5589C3E9C40ACF71aA79)
    +++ description: None
```

Generated with discovered.json: 0x8f8970beaded181d35f0b5f8369891a3dd7914df

# Diff at Tue, 29 Oct 2024 13:22:44 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@7b3fc9dc9074e1d423b48522c3f0273c86aab54a block: 267504356
- current block number: 267504356

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 267504356 (main branch discovery), not current.

```diff
    contract Outbox (0x1E400568AD4840dbE50FB32f306B842e9ddeF726) {
    +++ description: Facilitates L2 to L1 contract calls: Messages initiated from L2 (for example withdrawal messages) eventually resolve in execution on L1.
      description:
-        "Facilitates L2 to L1 contract calls: Messages initiated from L2 (for example withdrawal messages) which eventually resolve in execution on L1."
+        "Facilitates L2 to L1 contract calls: Messages initiated from L2 (for example withdrawal messages) eventually resolve in execution on L1."
    }
```

```diff
    contract Bridge (0x7dd8A76bdAeBE3BBBaCD7Aa87f1D4FDa1E60f94f) {
    +++ description: Escrow contract for the project's gas token (Can be different from ETH). Keeps a list of allowed Inboxes and Outboxes for canonical bridge messaging.
      description:
-        "Escrow contract for the project's gas token (Can be different from ETH). Keeps a list of allowed Inboxes and Outboxes for bridge messaging."
+        "Escrow contract for the project's gas token (Can be different from ETH). Keeps a list of allowed Inboxes and Outboxes for canonical bridge messaging."
    }
```

```diff
    contract L1ERC20Gateway (0xb591cE747CF19cF30e11d656EB94134F523A9e77) {
    +++ description: Escrows deposited ERC-20 assets for the canonical Bridge. Upon depositing, a generic token representation will be minted at the destination. Withdrawals are initiated by the Outbox contract.
      template:
+        "orbitstack/ERC20Gateway"
      displayName:
+        "ERC20Gateway"
      description:
+        "Escrows deposited ERC-20 assets for the canonical Bridge. Upon depositing, a generic token representation will be minted at the destination. Withdrawals are initiated by the Outbox contract."
    }
```

```diff
    contract RollupProxy (0xC47DacFbAa80Bd9D8112F4e8069482c2A3221336) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      fieldMeta.confirmPeriodBlocks.description:
-        "Challenge period. (Number of blocks until a node is confirmed)."
+        "Challenge period. (Number of ETHEREUM blocks until a node is confirmed, even for L3s)."
    }
```

Generated with discovered.json: 0xef8bab53abb276a58638ac615dc61d07b21c760b

# Diff at Tue, 29 Oct 2024 08:54:48 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@dd2750779d294ea31d352eac7a7f2e0e655f6440 block: 267504356
- current block number: 267504356

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 267504356 (main branch discovery), not current.

```diff
    contract UpgradeExecutor (0x0EE7AD3Cc291343C9952fFd8844e86d294fa513F) {
    +++ description: Central contract defining the access control for upgrading the system contract implementations.
      issuedPermissions.0.target:
-        "0x0EE7AD3Cc291343C9952fFd8844e86d294fa513F"
+        "0x4972A8EF186Ee42A14Cdd3c47f52ec06a6dc495E"
      issuedPermissions.0.via.1:
+        {"address":"0x041F85dD87c46B941dc9b15c6628B19ee5358485","delay":0}
      issuedPermissions.0.via.0.address:
-        "0x041F85dD87c46B941dc9b15c6628B19ee5358485"
+        "0x0EE7AD3Cc291343C9952fFd8844e86d294fa513F"
      receivedPermissions:
-        [{"permission":"upgrade","target":"0x0EE7AD3Cc291343C9952fFd8844e86d294fa513F","via":[{"address":"0x041F85dD87c46B941dc9b15c6628B19ee5358485"}]},{"permission":"upgrade","target":"0x1E400568AD4840dbE50FB32f306B842e9ddeF726","via":[{"address":"0x041F85dD87c46B941dc9b15c6628B19ee5358485"}]},{"permission":"upgrade","target":"0x22CCA5Dc96a4Ac1EC32c9c7C5ad4D66254a24C35","via":[{"address":"0x041F85dD87c46B941dc9b15c6628B19ee5358485"}]},{"permission":"upgrade","target":"0x36aDe24988E4C47602e38BD9a0Bd89031eF807a8","via":[{"address":"0x041F85dD87c46B941dc9b15c6628B19ee5358485"}]},{"permission":"upgrade","target":"0x3a3f62034a42a35eA1686B199bB73006aa525eE4","via":[{"address":"0x041F85dD87c46B941dc9b15c6628B19ee5358485"}]},{"permission":"upgrade","target":"0x7dd8A76bdAeBE3BBBaCD7Aa87f1D4FDa1E60f94f","via":[{"address":"0x041F85dD87c46B941dc9b15c6628B19ee5358485"}]},{"permission":"upgrade","target":"0x995a9d3ca121D48d21087eDE20bc8acb2398c8B1","via":[{"address":"0x041F85dD87c46B941dc9b15c6628B19ee5358485"}]},{"permission":"upgrade","target":"0xaE21fDA3de92dE2FDAF606233b2863782Ba046F9","via":[{"address":"0x041F85dD87c46B941dc9b15c6628B19ee5358485"}]},{"permission":"upgrade","target":"0xb591cE747CF19cF30e11d656EB94134F523A9e77","via":[{"address":"0x041F85dD87c46B941dc9b15c6628B19ee5358485"}]},{"permission":"upgrade","target":"0xC47DacFbAa80Bd9D8112F4e8069482c2A3221336"}]
      directlyReceivedPermissions.1:
+        {"permission":"upgrade","target":"0xC47DacFbAa80Bd9D8112F4e8069482c2A3221336"}
    }
```

```diff
    contract Outbox (0x1E400568AD4840dbE50FB32f306B842e9ddeF726) {
    +++ description: Facilitates L2 to L1 contract calls: Messages initiated from L2 (for example withdrawal messages) which eventually resolve in execution on L1.
      issuedPermissions.0.target:
-        "0x0EE7AD3Cc291343C9952fFd8844e86d294fa513F"
+        "0x4972A8EF186Ee42A14Cdd3c47f52ec06a6dc495E"
      issuedPermissions.0.via.1:
+        {"address":"0x041F85dD87c46B941dc9b15c6628B19ee5358485","delay":0}
      issuedPermissions.0.via.0.address:
-        "0x041F85dD87c46B941dc9b15c6628B19ee5358485"
+        "0x0EE7AD3Cc291343C9952fFd8844e86d294fa513F"
    }
```

```diff
    contract L1GatewayRouter (0x22CCA5Dc96a4Ac1EC32c9c7C5ad4D66254a24C35) {
    +++ description: None
      issuedPermissions.0.target:
-        "0x0EE7AD3Cc291343C9952fFd8844e86d294fa513F"
+        "0x4972A8EF186Ee42A14Cdd3c47f52ec06a6dc495E"
      issuedPermissions.0.via.1:
+        {"address":"0x041F85dD87c46B941dc9b15c6628B19ee5358485","delay":0}
      issuedPermissions.0.via.0.address:
-        "0x041F85dD87c46B941dc9b15c6628B19ee5358485"
+        "0x0EE7AD3Cc291343C9952fFd8844e86d294fa513F"
    }
```

```diff
    contract ERC20RollupEventInbox (0x36aDe24988E4C47602e38BD9a0Bd89031eF807a8) {
    +++ description: None
      issuedPermissions.0.target:
-        "0x0EE7AD3Cc291343C9952fFd8844e86d294fa513F"
+        "0x4972A8EF186Ee42A14Cdd3c47f52ec06a6dc495E"
      issuedPermissions.0.via.1:
+        {"address":"0x041F85dD87c46B941dc9b15c6628B19ee5358485","delay":0}
      issuedPermissions.0.via.0.address:
-        "0x041F85dD87c46B941dc9b15c6628B19ee5358485"
+        "0x0EE7AD3Cc291343C9952fFd8844e86d294fa513F"
    }
```

```diff
    contract ChallengeManager (0x3a3f62034a42a35eA1686B199bB73006aa525eE4) {
    +++ description: Contract that allows challenging state roots. Can be called through the RollupProxy by Validators or the UpgradeExecutor.
      issuedPermissions.0.target:
-        "0x0EE7AD3Cc291343C9952fFd8844e86d294fa513F"
+        "0x4972A8EF186Ee42A14Cdd3c47f52ec06a6dc495E"
      issuedPermissions.0.via.1:
+        {"address":"0x041F85dD87c46B941dc9b15c6628B19ee5358485","delay":0}
      issuedPermissions.0.via.0.address:
-        "0x041F85dD87c46B941dc9b15c6628B19ee5358485"
+        "0x0EE7AD3Cc291343C9952fFd8844e86d294fa513F"
    }
```

```diff
    contract XaiMultisig (0x4972A8EF186Ee42A14Cdd3c47f52ec06a6dc495E) {
    +++ description: None
      receivedPermissions:
+        [{"permission":"upgrade","target":"0x0EE7AD3Cc291343C9952fFd8844e86d294fa513F","via":[{"address":"0x041F85dD87c46B941dc9b15c6628B19ee5358485"},{"address":"0x0EE7AD3Cc291343C9952fFd8844e86d294fa513F"}]},{"permission":"upgrade","target":"0x1E400568AD4840dbE50FB32f306B842e9ddeF726","via":[{"address":"0x041F85dD87c46B941dc9b15c6628B19ee5358485"},{"address":"0x0EE7AD3Cc291343C9952fFd8844e86d294fa513F"}]},{"permission":"upgrade","target":"0x22CCA5Dc96a4Ac1EC32c9c7C5ad4D66254a24C35","via":[{"address":"0x041F85dD87c46B941dc9b15c6628B19ee5358485"},{"address":"0x0EE7AD3Cc291343C9952fFd8844e86d294fa513F"}]},{"permission":"upgrade","target":"0x36aDe24988E4C47602e38BD9a0Bd89031eF807a8","via":[{"address":"0x041F85dD87c46B941dc9b15c6628B19ee5358485"},{"address":"0x0EE7AD3Cc291343C9952fFd8844e86d294fa513F"}]},{"permission":"upgrade","target":"0x3a3f62034a42a35eA1686B199bB73006aa525eE4","via":[{"address":"0x041F85dD87c46B941dc9b15c6628B19ee5358485"},{"address":"0x0EE7AD3Cc291343C9952fFd8844e86d294fa513F"}]},{"permission":"upgrade","target":"0x7dd8A76bdAeBE3BBBaCD7Aa87f1D4FDa1E60f94f","via":[{"address":"0x041F85dD87c46B941dc9b15c6628B19ee5358485"},{"address":"0x0EE7AD3Cc291343C9952fFd8844e86d294fa513F"}]},{"permission":"upgrade","target":"0x995a9d3ca121D48d21087eDE20bc8acb2398c8B1","via":[{"address":"0x041F85dD87c46B941dc9b15c6628B19ee5358485"},{"address":"0x0EE7AD3Cc291343C9952fFd8844e86d294fa513F"}]},{"permission":"upgrade","target":"0xaE21fDA3de92dE2FDAF606233b2863782Ba046F9","via":[{"address":"0x041F85dD87c46B941dc9b15c6628B19ee5358485"},{"address":"0x0EE7AD3Cc291343C9952fFd8844e86d294fa513F"}]},{"permission":"upgrade","target":"0xb591cE747CF19cF30e11d656EB94134F523A9e77","via":[{"address":"0x041F85dD87c46B941dc9b15c6628B19ee5358485"},{"address":"0x0EE7AD3Cc291343C9952fFd8844e86d294fa513F"}]},{"permission":"upgrade","target":"0xC47DacFbAa80Bd9D8112F4e8069482c2A3221336","via":[{"address":"0x0EE7AD3Cc291343C9952fFd8844e86d294fa513F"}]}]
      directlyReceivedPermissions:
+        [{"permission":"act","target":"0x0EE7AD3Cc291343C9952fFd8844e86d294fa513F"}]
    }
```

```diff
    contract Bridge (0x7dd8A76bdAeBE3BBBaCD7Aa87f1D4FDa1E60f94f) {
    +++ description: Escrow contract for the project's gas token (Can be different from ETH). Keeps a list of allowed Inboxes and Outboxes for bridge messaging.
      issuedPermissions.0.target:
-        "0x0EE7AD3Cc291343C9952fFd8844e86d294fa513F"
+        "0x4972A8EF186Ee42A14Cdd3c47f52ec06a6dc495E"
      issuedPermissions.0.via.1:
+        {"address":"0x041F85dD87c46B941dc9b15c6628B19ee5358485","delay":0}
      issuedPermissions.0.via.0.address:
-        "0x041F85dD87c46B941dc9b15c6628B19ee5358485"
+        "0x0EE7AD3Cc291343C9952fFd8844e86d294fa513F"
    }
```

```diff
    contract SequencerInbox (0x995a9d3ca121D48d21087eDE20bc8acb2398c8B1) {
    +++ description: A sequencer (registered in this contract) can submit transaction batches or commitments here.
      issuedPermissions.1.target:
-        "0x0EE7AD3Cc291343C9952fFd8844e86d294fa513F"
+        "0x4972A8EF186Ee42A14Cdd3c47f52ec06a6dc495E"
      issuedPermissions.1.via.1:
+        {"address":"0x041F85dD87c46B941dc9b15c6628B19ee5358485","delay":0}
      issuedPermissions.1.via.0.address:
-        "0x041F85dD87c46B941dc9b15c6628B19ee5358485"
+        "0x0EE7AD3Cc291343C9952fFd8844e86d294fa513F"
    }
```

```diff
    contract Inbox (0xaE21fDA3de92dE2FDAF606233b2863782Ba046F9) {
    +++ description: Facilitates sending L1 to L2 messages like depositing ETH, but does not escrow funds.
      issuedPermissions.0.target:
-        "0x0EE7AD3Cc291343C9952fFd8844e86d294fa513F"
+        "0x4972A8EF186Ee42A14Cdd3c47f52ec06a6dc495E"
      issuedPermissions.0.via.1:
+        {"address":"0x041F85dD87c46B941dc9b15c6628B19ee5358485","delay":0}
      issuedPermissions.0.via.0.address:
-        "0x041F85dD87c46B941dc9b15c6628B19ee5358485"
+        "0x0EE7AD3Cc291343C9952fFd8844e86d294fa513F"
    }
```

```diff
    contract L1ERC20Gateway (0xb591cE747CF19cF30e11d656EB94134F523A9e77) {
    +++ description: None
      issuedPermissions.0.target:
-        "0x0EE7AD3Cc291343C9952fFd8844e86d294fa513F"
+        "0x4972A8EF186Ee42A14Cdd3c47f52ec06a6dc495E"
      issuedPermissions.0.via.1:
+        {"address":"0x041F85dD87c46B941dc9b15c6628B19ee5358485","delay":0}
      issuedPermissions.0.via.0.address:
-        "0x041F85dD87c46B941dc9b15c6628B19ee5358485"
+        "0x0EE7AD3Cc291343C9952fFd8844e86d294fa513F"
    }
```

```diff
    contract RollupProxy (0xC47DacFbAa80Bd9D8112F4e8069482c2A3221336) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      issuedPermissions.2.target:
-        "0x0EE7AD3Cc291343C9952fFd8844e86d294fa513F"
+        "0x4972A8EF186Ee42A14Cdd3c47f52ec06a6dc495E"
      issuedPermissions.2.via.0:
+        {"address":"0x0EE7AD3Cc291343C9952fFd8844e86d294fa513F","delay":0}
    }
```

Generated with discovered.json: 0x25eba4cce019484120774b6c76119a92197b5be9

# Diff at Mon, 28 Oct 2024 14:09:33 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@846d03afee15838cf7b18315c02ebdb6a2071f6c block: 267504356
- current block number: 267504356

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 267504356 (main branch discovery), not current.

```diff
    contract UpgradeExecutor (0x0EE7AD3Cc291343C9952fFd8844e86d294fa513F) {
    +++ description: Central contract defining the access control for upgrading the system contract implementations.
      values.executors:
+        ["0x4972A8EF186Ee42A14Cdd3c47f52ec06a6dc495E"]
    }
```

Generated with discovered.json: 0xdf92bba31fd4453d1e9ef630a9dd359a4d1ac4da

# Diff at Fri, 25 Oct 2024 12:22:59 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@e7501f424c0cea9b5438386ee76e509448999836 block: 264372912
- current block number: 267504356

## Description

Renamed ExecutorMultisig to XaiMultisig.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 264372912 (main branch discovery), not current.

```diff
    contract ProxyAdmin (0x041F85dD87c46B941dc9b15c6628B19ee5358485) {
    +++ description: None
      receivedPermissions:
-        [{"permission":"upgrade","target":"0x0EE7AD3Cc291343C9952fFd8844e86d294fa513F"},{"permission":"upgrade","target":"0x1E400568AD4840dbE50FB32f306B842e9ddeF726"},{"permission":"upgrade","target":"0x22CCA5Dc96a4Ac1EC32c9c7C5ad4D66254a24C35"},{"permission":"upgrade","target":"0x36aDe24988E4C47602e38BD9a0Bd89031eF807a8"},{"permission":"upgrade","target":"0x3a3f62034a42a35eA1686B199bB73006aa525eE4"},{"permission":"upgrade","target":"0x7dd8A76bdAeBE3BBBaCD7Aa87f1D4FDa1E60f94f"},{"permission":"upgrade","target":"0x995a9d3ca121D48d21087eDE20bc8acb2398c8B1"},{"permission":"upgrade","target":"0xaE21fDA3de92dE2FDAF606233b2863782Ba046F9"},{"permission":"upgrade","target":"0xb591cE747CF19cF30e11d656EB94134F523A9e77"}]
      template:
+        "global/ProxyAdmin"
      directlyReceivedPermissions:
+        [{"permission":"upgrade","target":"0x0EE7AD3Cc291343C9952fFd8844e86d294fa513F"},{"permission":"upgrade","target":"0x1E400568AD4840dbE50FB32f306B842e9ddeF726"},{"permission":"upgrade","target":"0x22CCA5Dc96a4Ac1EC32c9c7C5ad4D66254a24C35"},{"permission":"upgrade","target":"0x36aDe24988E4C47602e38BD9a0Bd89031eF807a8"},{"permission":"upgrade","target":"0x3a3f62034a42a35eA1686B199bB73006aa525eE4"},{"permission":"upgrade","target":"0x7dd8A76bdAeBE3BBBaCD7Aa87f1D4FDa1E60f94f"},{"permission":"upgrade","target":"0x995a9d3ca121D48d21087eDE20bc8acb2398c8B1"},{"permission":"upgrade","target":"0xaE21fDA3de92dE2FDAF606233b2863782Ba046F9"},{"permission":"upgrade","target":"0xb591cE747CF19cF30e11d656EB94134F523A9e77"}]
    }
```

```diff
    contract UpgradeExecutor (0x0EE7AD3Cc291343C9952fFd8844e86d294fa513F) {
    +++ description: Central contract defining the access control for upgrading the system contract implementations.
      issuedPermissions.0.target:
-        "0x041F85dD87c46B941dc9b15c6628B19ee5358485"
+        "0x0EE7AD3Cc291343C9952fFd8844e86d294fa513F"
      issuedPermissions.0.via.0:
+        {"address":"0x041F85dD87c46B941dc9b15c6628B19ee5358485","delay":0}
      receivedPermissions.9:
+        {"permission":"upgrade","target":"0xC47DacFbAa80Bd9D8112F4e8069482c2A3221336"}
      receivedPermissions.8:
+        {"permission":"upgrade","target":"0xb591cE747CF19cF30e11d656EB94134F523A9e77","via":[{"address":"0x041F85dD87c46B941dc9b15c6628B19ee5358485"}]}
      receivedPermissions.7:
+        {"permission":"upgrade","target":"0xaE21fDA3de92dE2FDAF606233b2863782Ba046F9","via":[{"address":"0x041F85dD87c46B941dc9b15c6628B19ee5358485"}]}
      receivedPermissions.6:
+        {"permission":"upgrade","target":"0x995a9d3ca121D48d21087eDE20bc8acb2398c8B1","via":[{"address":"0x041F85dD87c46B941dc9b15c6628B19ee5358485"}]}
      receivedPermissions.5:
+        {"permission":"upgrade","target":"0x7dd8A76bdAeBE3BBBaCD7Aa87f1D4FDa1E60f94f","via":[{"address":"0x041F85dD87c46B941dc9b15c6628B19ee5358485"}]}
      receivedPermissions.4:
+        {"permission":"upgrade","target":"0x3a3f62034a42a35eA1686B199bB73006aa525eE4","via":[{"address":"0x041F85dD87c46B941dc9b15c6628B19ee5358485"}]}
      receivedPermissions.3:
+        {"permission":"upgrade","target":"0x36aDe24988E4C47602e38BD9a0Bd89031eF807a8","via":[{"address":"0x041F85dD87c46B941dc9b15c6628B19ee5358485"}]}
      receivedPermissions.2:
+        {"permission":"upgrade","target":"0x22CCA5Dc96a4Ac1EC32c9c7C5ad4D66254a24C35","via":[{"address":"0x041F85dD87c46B941dc9b15c6628B19ee5358485"}]}
      receivedPermissions.1:
+        {"permission":"upgrade","target":"0x1E400568AD4840dbE50FB32f306B842e9ddeF726","via":[{"address":"0x041F85dD87c46B941dc9b15c6628B19ee5358485"}]}
      receivedPermissions.0.target:
-        "0xC47DacFbAa80Bd9D8112F4e8069482c2A3221336"
+        "0x0EE7AD3Cc291343C9952fFd8844e86d294fa513F"
      receivedPermissions.0.via:
+        [{"address":"0x041F85dD87c46B941dc9b15c6628B19ee5358485"}]
      directlyReceivedPermissions:
+        [{"permission":"act","target":"0x041F85dD87c46B941dc9b15c6628B19ee5358485"}]
    }
```

```diff
    contract Outbox (0x1E400568AD4840dbE50FB32f306B842e9ddeF726) {
    +++ description: Facilitates L2 to L1 contract calls: Messages initiated from L2 (for example withdrawal messages) which eventually resolve in execution on L1.
      issuedPermissions.0.target:
-        "0x041F85dD87c46B941dc9b15c6628B19ee5358485"
+        "0x0EE7AD3Cc291343C9952fFd8844e86d294fa513F"
      issuedPermissions.0.via.0:
+        {"address":"0x041F85dD87c46B941dc9b15c6628B19ee5358485","delay":0}
    }
```

```diff
    contract L1GatewayRouter (0x22CCA5Dc96a4Ac1EC32c9c7C5ad4D66254a24C35) {
    +++ description: None
      issuedPermissions.0.target:
-        "0x041F85dD87c46B941dc9b15c6628B19ee5358485"
+        "0x0EE7AD3Cc291343C9952fFd8844e86d294fa513F"
      issuedPermissions.0.via.0:
+        {"address":"0x041F85dD87c46B941dc9b15c6628B19ee5358485","delay":0}
    }
```

```diff
    contract ERC20RollupEventInbox (0x36aDe24988E4C47602e38BD9a0Bd89031eF807a8) {
    +++ description: None
      issuedPermissions.0.target:
-        "0x041F85dD87c46B941dc9b15c6628B19ee5358485"
+        "0x0EE7AD3Cc291343C9952fFd8844e86d294fa513F"
      issuedPermissions.0.via.0:
+        {"address":"0x041F85dD87c46B941dc9b15c6628B19ee5358485","delay":0}
    }
```

```diff
    contract ChallengeManager (0x3a3f62034a42a35eA1686B199bB73006aa525eE4) {
    +++ description: Contract that allows challenging state roots. Can be called through the RollupProxy by Validators or the UpgradeExecutor.
      issuedPermissions.0.target:
-        "0x041F85dD87c46B941dc9b15c6628B19ee5358485"
+        "0x0EE7AD3Cc291343C9952fFd8844e86d294fa513F"
      issuedPermissions.0.via.0:
+        {"address":"0x041F85dD87c46B941dc9b15c6628B19ee5358485","delay":0}
    }
```

```diff
    contract XaiMultisig (0x4972A8EF186Ee42A14Cdd3c47f52ec06a6dc495E) {
    +++ description: None
      name:
-        "ExecutorMultisig"
+        "XaiMultisig"
    }
```

```diff
    contract Bridge (0x7dd8A76bdAeBE3BBBaCD7Aa87f1D4FDa1E60f94f) {
    +++ description: Escrow contract for the project's gas token (Can be different from ETH). Keeps a list of allowed Inboxes and Outboxes for bridge messaging.
      issuedPermissions.0.target:
-        "0x041F85dD87c46B941dc9b15c6628B19ee5358485"
+        "0x0EE7AD3Cc291343C9952fFd8844e86d294fa513F"
      issuedPermissions.0.via.0:
+        {"address":"0x041F85dD87c46B941dc9b15c6628B19ee5358485","delay":0}
    }
```

```diff
    contract SequencerInbox (0x995a9d3ca121D48d21087eDE20bc8acb2398c8B1) {
    +++ description: A sequencer (registered in this contract) can submit transaction batches or commitments here.
      issuedPermissions.1.target:
-        "0x041F85dD87c46B941dc9b15c6628B19ee5358485"
+        "0x0EE7AD3Cc291343C9952fFd8844e86d294fa513F"
      issuedPermissions.1.via.0:
+        {"address":"0x041F85dD87c46B941dc9b15c6628B19ee5358485","delay":0}
    }
```

```diff
    contract Inbox (0xaE21fDA3de92dE2FDAF606233b2863782Ba046F9) {
    +++ description: Facilitates sending L1 to L2 messages like depositing ETH, but does not escrow funds.
      issuedPermissions.0.target:
-        "0x041F85dD87c46B941dc9b15c6628B19ee5358485"
+        "0x0EE7AD3Cc291343C9952fFd8844e86d294fa513F"
      issuedPermissions.0.via.0:
+        {"address":"0x041F85dD87c46B941dc9b15c6628B19ee5358485","delay":0}
    }
```

```diff
    contract L1ERC20Gateway (0xb591cE747CF19cF30e11d656EB94134F523A9e77) {
    +++ description: None
      issuedPermissions.0.target:
-        "0x041F85dD87c46B941dc9b15c6628B19ee5358485"
+        "0x0EE7AD3Cc291343C9952fFd8844e86d294fa513F"
      issuedPermissions.0.via.0:
+        {"address":"0x041F85dD87c46B941dc9b15c6628B19ee5358485","delay":0}
    }
```

Generated with discovered.json: 0x1b1d882b71a41fc8e5b7c5f0bc2a7fa69662ca21

# Diff at Wed, 23 Oct 2024 14:37:16 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@9cc37d16a5f0b172bb41f98d8a970963e5ca4afb block: 264372912
- current block number: 264372912

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 264372912 (main branch discovery), not current.

```diff
    contract UpgradeExecutor (0x0EE7AD3Cc291343C9952fFd8844e86d294fa513F) {
    +++ description: Central contract defining the access control for upgrading the system contract implementations.
      template:
+        "orbitstack/UpgradeExecutor"
      description:
+        "Central contract defining the access control for upgrading the system contract implementations."
    }
```

```diff
    contract Outbox (0x1E400568AD4840dbE50FB32f306B842e9ddeF726) {
    +++ description: Facilitates L2 to L1 contract calls: Messages initiated from L2 (for example withdrawal messages) which eventually resolve in execution on L1.
      template:
+        "orbitstack/Outbox"
      description:
+        "Facilitates L2 to L1 contract calls: Messages initiated from L2 (for example withdrawal messages) which eventually resolve in execution on L1."
    }
```

```diff
-   Status: DELETED
    contract ValidatorWalletCreator (0x2b0E04Dc90e3fA58165CB41E2834B44A56E766aF)
    +++ description: None
```

```diff
    contract ChallengeManager (0x3a3f62034a42a35eA1686B199bB73006aa525eE4) {
    +++ description: Contract that allows challenging state roots. Can be called through the RollupProxy by Validators or the UpgradeExecutor.
      template:
+        "orbitstack/ChallengeManager"
      description:
+        "Contract that allows challenging state roots. Can be called through the RollupProxy by Validators or the UpgradeExecutor."
    }
```

```diff
    contract OneStepProverMemory (0x526a6E634aD36bB0007c4422586c135F1F9B525a) {
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
      template:
+        "orbitstack/OneStepProverMemory"
      description:
+        "One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine."
    }
```

```diff
    contract Bridge (0x7dd8A76bdAeBE3BBBaCD7Aa87f1D4FDa1E60f94f) {
    +++ description: Escrow contract for the project's gas token (Can be different from ETH). Keeps a list of allowed Inboxes and Outboxes for bridge messaging.
      template:
+        "orbitstack/Bridge"
      description:
+        "Escrow contract for the project's gas token (Can be different from ETH). Keeps a list of allowed Inboxes and Outboxes for bridge messaging."
    }
```

```diff
    contract OneStepProver0 (0x800dA62bE6626127F71B34E795286C34C04D6712) {
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
      template:
+        "orbitstack/OneStepProver0"
      description:
+        "One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine."
    }
```

```diff
-   Status: DELETED
    contract  (0x82709E8564ce17707a7C8420c9e48e9a8A88bfc1)
    +++ description: None
```

```diff
    contract SequencerInbox (0x995a9d3ca121D48d21087eDE20bc8acb2398c8B1) {
    +++ description: A sequencer (registered in this contract) can submit transaction batches or commitments here.
      description:
-        "State batches / commitments get posted here."
+        "A sequencer (registered in this contract) can submit transaction batches or commitments here."
    }
```

```diff
    contract Inbox (0xaE21fDA3de92dE2FDAF606233b2863782Ba046F9) {
    +++ description: Facilitates sending L1 to L2 messages like depositing ETH, but does not escrow funds.
      template:
+        "orbitstack/Inbox"
      description:
+        "Facilitates sending L1 to L2 messages like depositing ETH, but does not escrow funds."
    }
```

```diff
    contract OneStepProofEntry (0xb20107bfB36D3B5AcA534aCAfbd8857b10b402a8) {
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
      template:
+        "orbitstack/OneStepProofEntry"
      description:
+        "One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine."
    }
```

```diff
    contract RollupProxy (0xC47DacFbAa80Bd9D8112F4e8069482c2A3221336) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      description:
-        "Manages rollup components, list of Stakers and Validators. Entry point for Validators creating new Rollup Nodes (state commits) and Challengers submitting fraud proofs."
+        "Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators)."
      issuedPermissions.2:
+        {"permission":"upgrade","target":"0x0EE7AD3Cc291343C9952fFd8844e86d294fa513F","via":[]}
      issuedPermissions.1.permission:
-        "validate"
+        "propose"
      issuedPermissions.0.permission:
-        "upgrade"
+        "challenge"
      issuedPermissions.0.target:
-        "0x0EE7AD3Cc291343C9952fFd8844e86d294fa513F"
+        "0x25EA41f0bDa921a0eBf48291961B1F10b59BC6b8"
+++ description: Root hash of the WASM module used for execution, like a fingerprint of the L2 logic. Can be associated with ArbOS versions.
      values.wasmModuleRoot:
-        "ArbOS v20 wasmModuleRoot"
+        "0x8b104a2e80ac6165dc58b9048de12f301d70b02a0ab51396c22b4b4b802a16a4"
+++ description: ArbOS version derived from known wasmModuleRoots.
      values.arbOsFromWmRoot:
+        "ArbOS v20 wasmModuleRoot"
      fieldMeta.arbOsFromWmRoot:
+        {"description":"ArbOS version derived from known wasmModuleRoots."}
      fieldMeta.setValidatorCount:
+        {"description":"Increments on each Validator change."}
      fieldMeta.challenges:
+        {"description":"Emitted on createChallenge() in RollupUserLogic."}
    }
```

```diff
    contract OneStepProverHostIo (0xc555b2F1D559Fbb854569b33640990D178F94747) {
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
      template:
+        "orbitstack/OneStepProverHostIo"
      description:
+        "One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine."
    }
```

```diff
    contract OneStepProverMath (0xe8709022B9C9D7347856c75910fe07e10C904446) {
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
      template:
+        "orbitstack/OneStepProverMath"
      description:
+        "One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine."
    }
```

Generated with discovered.json: 0x094786dfa596db327c89b23dfe756529f00898f8

# Diff at Mon, 21 Oct 2024 12:51:58 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@e660599f23a07618fe949a07be1f516ce44f1914 block: 264372912
- current block number: 264372912

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 264372912 (main branch discovery), not current.

```diff
    contract SequencerInbox (0x995a9d3ca121D48d21087eDE20bc8acb2398c8B1) {
    +++ description: State batches / commitments get posted here.
      descriptions:
-        ["State batches / commitments get posted here."]
      description:
+        "State batches / commitments get posted here."
    }
```

```diff
    contract RollupProxy (0xC47DacFbAa80Bd9D8112F4e8069482c2A3221336) {
    +++ description: Manages rollup components, list of Stakers and Validators. Entry point for Validators creating new Rollup Nodes (state commits) and Challengers submitting fraud proofs.
      descriptions:
-        ["Manages rollup components, list of Stakers and Validators. Entry point for Validators creating new Rollup Nodes (state commits) and Challengers submitting fraud proofs."]
      description:
+        "Manages rollup components, list of Stakers and Validators. Entry point for Validators creating new Rollup Nodes (state commits) and Challengers submitting fraud proofs."
    }
```

```diff
    contract FundsReiceiverMultisig (0xFCF7248C495d6fd3641eE43F861c48Ebe402c878) {
    +++ description: The designated fundsReceiver in the NodeLicenseRegistry. Receives all ETH from 'Sentry Node License' mints.
      descriptions:
-        ["The designated fundsReceiver in the NodeLicenseRegistry. Receives all ETH from 'Sentry Node License' mints."]
      description:
+        "The designated fundsReceiver in the NodeLicenseRegistry. Receives all ETH from 'Sentry Node License' mints."
    }
```

Generated with discovered.json: 0x9e25fb70ef2abe1f78253d59f383dbe128acfabd

# Diff at Mon, 21 Oct 2024 11:13:46 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@8895d33866f5665c4c710f4ddaa32bfa63cc3c78 block: 264372912
- current block number: 264372912

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 264372912 (main branch discovery), not current.

```diff
    contract UpgradeExecutor (0x0EE7AD3Cc291343C9952fFd8844e86d294fa513F) {
    +++ description: None
      values.$pastUpgrades.0.2:
+        ["0x660ea1675F7323dC3Ba0c8dDFB593225Eb01E3C1"]
      values.$pastUpgrades.0.1:
-        ["0x660ea1675F7323dC3Ba0c8dDFB593225Eb01E3C1"]
+        "0xcefe7ebaac7f573d70560f840c228fd589c04b9f6fbcfc85a9bf28b8d96d89e5"
    }
```

```diff
    contract Outbox (0x1E400568AD4840dbE50FB32f306B842e9ddeF726) {
    +++ description: None
      values.$pastUpgrades.0.2:
+        ["0x302275067251F5FcdB9359Bda735fD8f7A4A54c0"]
      values.$pastUpgrades.0.1:
-        ["0x302275067251F5FcdB9359Bda735fD8f7A4A54c0"]
+        "0xcefe7ebaac7f573d70560f840c228fd589c04b9f6fbcfc85a9bf28b8d96d89e5"
    }
```

```diff
    contract L1GatewayRouter (0x22CCA5Dc96a4Ac1EC32c9c7C5ad4D66254a24C35) {
    +++ description: None
      values.$pastUpgrades.0.2:
+        ["0xd106EC93D2c1adaA65C4B17ffc7bB166Ce30DDAe"]
      values.$pastUpgrades.0.1:
-        ["0xd106EC93D2c1adaA65C4B17ffc7bB166Ce30DDAe"]
+        "0x95b16bf92d7d8be9f95d0b1c9080f1b7ced6fe028b8db3aef5d5ebfadd330ea4"
    }
```

```diff
    contract ERC20RollupEventInbox (0x36aDe24988E4C47602e38BD9a0Bd89031eF807a8) {
    +++ description: None
      values.$pastUpgrades.0.2:
+        ["0x18FD37A4FB9E1F06d9383958aFd236771F15A8cb"]
      values.$pastUpgrades.0.1:
-        ["0x18FD37A4FB9E1F06d9383958aFd236771F15A8cb"]
+        "0xcefe7ebaac7f573d70560f840c228fd589c04b9f6fbcfc85a9bf28b8d96d89e5"
    }
```

```diff
    contract ChallengeManager (0x3a3f62034a42a35eA1686B199bB73006aa525eE4) {
    +++ description: None
      values.$pastUpgrades.1.2:
+        ["0x5cA988F213EfbCB86ED7e2AACB0C15c91e648f8d"]
      values.$pastUpgrades.1.1:
-        ["0x5cA988F213EfbCB86ED7e2AACB0C15c91e648f8d"]
+        "0x6c1bbf992f2fe7d5bb565a16a55f85bda8e565c4b26cb742a6f841ca8a5d9f80"
      values.$pastUpgrades.0.2:
+        ["0x09824fe72BFF474d16D9c2774432E381BBD60662"]
      values.$pastUpgrades.0.1:
-        ["0x09824fe72BFF474d16D9c2774432E381BBD60662"]
+        "0xcefe7ebaac7f573d70560f840c228fd589c04b9f6fbcfc85a9bf28b8d96d89e5"
    }
```

```diff
    contract PoolProxyDeployer (0x68D78D1E81379EfD9C61f8E9131D52CE571AF4fD) {
    +++ description: None
      values.$pastUpgrades.0.2:
+        ["0xb6773d5bF5b908B58ff5B7Bd36A7F06Da2EeeEc7"]
      values.$pastUpgrades.0.1:
-        ["0xb6773d5bF5b908B58ff5B7Bd36A7F06Da2EeeEc7"]
+        "0x1d33f114f23d1a440e30f20492a1db93ff86ae4f2962fb63880ceeb8286aaa4d"
    }
```

```diff
    contract Bridge (0x7dd8A76bdAeBE3BBBaCD7Aa87f1D4FDa1E60f94f) {
    +++ description: None
      values.$pastUpgrades.0.2:
+        ["0x2a6DD4433ffa96dc1755814FC0d9cc83A5F68DeC"]
      values.$pastUpgrades.0.1:
-        ["0x2a6DD4433ffa96dc1755814FC0d9cc83A5F68DeC"]
+        "0xcefe7ebaac7f573d70560f840c228fd589c04b9f6fbcfc85a9bf28b8d96d89e5"
    }
```

```diff
    contract GasSubsidy (0x94F4aBC83eae00b693286B6eDCa09e1D76183C97) {
    +++ description: None
      values.$pastUpgrades.0.2:
+        ["0xF208798482F0b12c8767Bc03cC0F145D18BeCe6A"]
      values.$pastUpgrades.0.1:
-        ["0xF208798482F0b12c8767Bc03cC0F145D18BeCe6A"]
+        "0x27bfccd3c53bc633ff2c6a39fcb5fbf16af67dc64f9d0d52ede0b3e560c569aa"
    }
```

```diff
    contract SequencerInbox (0x995a9d3ca121D48d21087eDE20bc8acb2398c8B1) {
    +++ description: State batches / commitments get posted here.
      values.$pastUpgrades.1.2:
+        ["0x7a299aD29499736994Aa3a9aFa3f476445FAEB2c"]
      values.$pastUpgrades.1.1:
-        ["0x7a299aD29499736994Aa3a9aFa3f476445FAEB2c"]
+        "0x6c1bbf992f2fe7d5bb565a16a55f85bda8e565c4b26cb742a6f841ca8a5d9f80"
      values.$pastUpgrades.0.2:
+        ["0x1c6ACCd9d66f3B993928E7439c9A2d67b94a445F"]
      values.$pastUpgrades.0.1:
-        ["0x1c6ACCd9d66f3B993928E7439c9A2d67b94a445F"]
+        "0xcefe7ebaac7f573d70560f840c228fd589c04b9f6fbcfc85a9bf28b8d96d89e5"
    }
```

```diff
    contract Inbox (0xaE21fDA3de92dE2FDAF606233b2863782Ba046F9) {
    +++ description: None
      values.$pastUpgrades.0.2:
+        ["0x7EfcB76D0e2E776A298aAa603d433336e5F8b6ab"]
      values.$pastUpgrades.0.1:
-        ["0x7EfcB76D0e2E776A298aAa603d433336e5F8b6ab"]
+        "0xcefe7ebaac7f573d70560f840c228fd589c04b9f6fbcfc85a9bf28b8d96d89e5"
    }
```

```diff
    contract L1ERC20Gateway (0xb591cE747CF19cF30e11d656EB94134F523A9e77) {
    +++ description: None
      values.$pastUpgrades.0.2:
+        ["0x8b73Ef238ADaB31EBC7c05423d243c345241a22f"]
      values.$pastUpgrades.0.1:
-        ["0x8b73Ef238ADaB31EBC7c05423d243c345241a22f"]
+        "0x95b16bf92d7d8be9f95d0b1c9080f1b7ced6fe028b8db3aef5d5ebfadd330ea4"
    }
```

```diff
    contract NodeLicenseRegistry (0xbc14d8563b248B79689ECbc43bBa53290e0b6b66) {
    +++ description: None
      values.$pastUpgrades.7.2:
+        ["0xfD6Bb931D2Ee134E70568ca36584c043cB278734"]
      values.$pastUpgrades.7.1:
-        ["0xfD6Bb931D2Ee134E70568ca36584c043cB278734"]
+        "0xf68ea634ab9dcdd7613e3037be47fbf0daf5e6814a95b3fe32c8f2d077d01444"
      values.$pastUpgrades.6.2:
+        ["0xa2815b0F4A99799aeb9d5cb73501E43f5197dDD1"]
      values.$pastUpgrades.6.1:
-        ["0xa2815b0F4A99799aeb9d5cb73501E43f5197dDD1"]
+        "0xc51ad222fec5ee76441a0324273ecc4ded2d9dd605fa57523c7f6dc61ef8d8f1"
      values.$pastUpgrades.5.2:
+        ["0xfD6Bb931D2Ee134E70568ca36584c043cB278734"]
      values.$pastUpgrades.5.1:
-        ["0xfD6Bb931D2Ee134E70568ca36584c043cB278734"]
+        "0x905ed5655eb2c04a8da6680ec35d9d7c1ab3aaa090535303cc102d9780fa845c"
      values.$pastUpgrades.4.2:
+        ["0xAED4aF101d3e64114051E63F12265403d6Cb9B10"]
      values.$pastUpgrades.4.1:
-        ["0xAED4aF101d3e64114051E63F12265403d6Cb9B10"]
+        "0x89f6075f97adb62d17be41a8999871a4bb5c1cdeb6e401a1576778cd20349374"
      values.$pastUpgrades.3.2:
+        ["0xC2b691250fD85bF7eC91Dd4f13eF1e76678395B2"]
      values.$pastUpgrades.3.1:
-        ["0xC2b691250fD85bF7eC91Dd4f13eF1e76678395B2"]
+        "0x2b66dc25759528967307ed0312d2e93df71090403ce9e8fd5bbac911422832e8"
      values.$pastUpgrades.2.2:
+        ["0x471f1a92a8099f7011Aa3f2E011569618bD754EC"]
      values.$pastUpgrades.2.1:
-        ["0x471f1a92a8099f7011Aa3f2E011569618bD754EC"]
+        "0xd725096169b7a13791098567acf188d77352be120daefb359dad64e29f6bfa9b"
      values.$pastUpgrades.1.2:
+        ["0x471f1a92a8099f7011Aa3f2E011569618bD754EC"]
      values.$pastUpgrades.1.1:
-        ["0x471f1a92a8099f7011Aa3f2E011569618bD754EC"]
+        "0x9ae9ee043ee573f154f2492f6c27d5ca0cc9d1f47782d4b24e80cd39bb0ae378"
      values.$pastUpgrades.0.2:
+        ["0xf765452e587Ad0AE785Dc984963897c05d4c8c71"]
      values.$pastUpgrades.0.1:
-        ["0xf765452e587Ad0AE785Dc984963897c05d4c8c71"]
+        "0x1e84fa92f23fbccf9cf1643c17925016357a95e123d7d14cc9a77d029d8dbac2"
    }
```

```diff
    contract RollupProxy (0xC47DacFbAa80Bd9D8112F4e8069482c2A3221336) {
    +++ description: Manages rollup components, list of Stakers and Validators. Entry point for Validators creating new Rollup Nodes (state commits) and Challengers submitting fraud proofs.
      values.$pastUpgrades.0.2:
+        ["0xEe9E5546A11Cb5b4A86e92DA05f2ef75C26E4754","0x0aE4dD666748bF0F6dB5c149Eab1D8aD27820A6A"]
      values.$pastUpgrades.0.1:
-        ["0xEe9E5546A11Cb5b4A86e92DA05f2ef75C26E4754","0x0aE4dD666748bF0F6dB5c149Eab1D8aD27820A6A"]
+        "0xcefe7ebaac7f573d70560f840c228fd589c04b9f6fbcfc85a9bf28b8d96d89e5"
    }
```

```diff
    contract PoolFactory (0xF9E08660223E2dbb1c0b28c82942aB6B5E38b8E5) {
    +++ description: None
      values.$pastUpgrades.0.2:
+        ["0x21EEC6626f15d02A8896ebB7EDD68ff3CB61e89E"]
      values.$pastUpgrades.0.1:
-        ["0x21EEC6626f15d02A8896ebB7EDD68ff3CB61e89E"]
+        "0x36bec95cbfc75ccbf4d52c9bb080ebbbc2a9ecebffe7134574a4ea3bfdab8260"
    }
```

```diff
    contract SentryReferee (0xfD41041180571C5D371BEA3D9550E55653671198) {
    +++ description: None
      values.$pastUpgrades.7.2:
+        ["0x609152cb742916E0F7FBC4391Be750C458b049fe"]
      values.$pastUpgrades.7.1:
-        ["0x609152cb742916E0F7FBC4391Be750C458b049fe"]
+        "0xb9e3b5041f4683bafc0939b4a657467a6f545194ef17d3ba6980093138e3a6e5"
      values.$pastUpgrades.6.2:
+        ["0xFf38Aa9D553bE47eee329F968ADF0C74A01D021c"]
      values.$pastUpgrades.6.1:
-        ["0xFf38Aa9D553bE47eee329F968ADF0C74A01D021c"]
+        "0x6abdf6ba925c03704c581f1b0ad7de9da84cbb70945bdd2da22c8b0eb7e98a8b"
      values.$pastUpgrades.5.2:
+        ["0x680F4a9f47E4Cfea124a5654E759cB3b0a0C837c"]
      values.$pastUpgrades.5.1:
-        ["0x680F4a9f47E4Cfea124a5654E759cB3b0a0C837c"]
+        "0xa614a91d07acd9279e9676411ba9cf79c16ba271d28e537fed96f909da45dc8b"
      values.$pastUpgrades.4.2:
+        ["0x5538622Ad2F14bf781Af032542F7f00f080EB4CD"]
      values.$pastUpgrades.4.1:
-        ["0x5538622Ad2F14bf781Af032542F7f00f080EB4CD"]
+        "0xa0be7103c9cb256cddfce11ea243bc9b9db3c96bc4be86603939805841cc84fa"
      values.$pastUpgrades.3.2:
+        ["0x254954e3F6BD7443444036BeA2d8fE88fdf496c1"]
      values.$pastUpgrades.3.1:
-        ["0x254954e3F6BD7443444036BeA2d8fE88fdf496c1"]
+        "0x2c90459e0d4cc3d399dc71cee133be9c5cecf13d92d036e73a004cfa9798a5c0"
      values.$pastUpgrades.2.2:
+        ["0x10edA49fA8C6594cC6783CA5d7a6677d9e3236c1"]
      values.$pastUpgrades.2.1:
-        ["0x10edA49fA8C6594cC6783CA5d7a6677d9e3236c1"]
+        "0xe2508a91718906def7b9c9454e03328ee73ae67606aa32092c762b040007ad55"
      values.$pastUpgrades.1.2:
+        ["0x4110251275f1b1f8e6Ce7114139D69597fdAd474"]
      values.$pastUpgrades.1.1:
-        ["0x4110251275f1b1f8e6Ce7114139D69597fdAd474"]
+        "0x3bb7393b7a848ccd4e966dce1cbbf23673975e226ec96131851fb88daf8b3625"
      values.$pastUpgrades.0.2:
+        ["0x29A7b907FdF4a9235F46d891b7Aa1e7d3D35A3b6"]
      values.$pastUpgrades.0.1:
-        ["0x29A7b907FdF4a9235F46d891b7Aa1e7d3D35A3b6"]
+        "0xd22a7b97d2044a20b20a8105857d435ba98254e2a147c0890140ffe3fc55ebdf"
    }
```

Generated with discovered.json: 0xa79e28eafe7aa00c6a20abe4e9dd5913aa6098fd

# Diff at Wed, 16 Oct 2024 11:44:52 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@a3d139b799cc0b28e5e912febb17464d4e5aef5d block: 264372912
- current block number: 264372912

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 264372912 (main branch discovery), not current.

```diff
    contract SequencerInbox (0x995a9d3ca121D48d21087eDE20bc8acb2398c8B1) {
    +++ description: State batches / commitments get posted here.
      issuedPermissions.1:
+        {"permission":"upgrade","target":"0x041F85dD87c46B941dc9b15c6628B19ee5358485","via":[]}
      issuedPermissions.0.permission:
-        "upgrade"
+        "sequence"
      issuedPermissions.0.target:
-        "0x041F85dD87c46B941dc9b15c6628B19ee5358485"
+        "0x7F68dba68E72a250004812fe04F1123Fca89aBa9"
    }
```

```diff
    contract RollupProxy (0xC47DacFbAa80Bd9D8112F4e8069482c2A3221336) {
    +++ description: Manages rollup components, list of Stakers and Validators. Entry point for Validators creating new Rollup Nodes (state commits) and Challengers submitting fraud proofs.
      issuedPermissions.1:
+        {"permission":"validate","target":"0x25EA41f0bDa921a0eBf48291961B1F10b59BC6b8","via":[]}
    }
```

Generated with discovered.json: 0xe49dfcc5b5c247e9cc66efda2d2ea8197628013f

# Diff at Wed, 16 Oct 2024 09:53:33 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@b6ff61526cf3d704839d0155008ae72cc9070de8 block: 257934975
- current block number: 264372912

## Description

DAC keys changed to 5/7.

## Watched changes

```diff
    contract SequencerInbox (0x995a9d3ca121D48d21087eDE20bc8acb2398c8B1) {
    +++ description: State batches / commitments get posted here.
      values.dacKeyset.requiredSignatures:
-        8
+        5
      values.dacKeyset.membersCount:
-        9
+        7
      values.dacKeyset.blsSignatures.8:
-        "YBHz50DGYvPi02ynzcvcJS9K2nhXWKKSIZdDtXqxxoD3a1s2Fh2he79bMUWZ6M6qEhHM52HZr3l5jLoU4kOTBN+Q87yo0ljgZJYaphdYrHb+jabsPUcR+xdauJKAoKSkjQz8BWC9b2QZ3F7LK+Ro3cpWgkHR9SQlt86mk+eM71AWRl3ybwlRaxwAzYwOd9TRkQYARTY8fjvRmhChCY5lz7FtY0ttPrbJ3Mc2VXy5r0yyIoNFAQjg/jMNoablUOOIZRn+4KGLBQSPKcnl/Nv/0ZNdT563sLPj6mP3qLPlvwAhFpI5vIhSpGdpgJ8n8Ns3uxJyYsPD8qaHQciNLNTzYWGEze40CPMkxEeGRqi8yRoK8iuK5kse/+kqhBOyR3NVJg=="
      values.dacKeyset.blsSignatures.7:
-        "YA+ljLY01rxIncmXWl8bIZduwLObm0LKJIjzdyXjzH5FLN4Y+sUF2zjvF07aUPHOyADiV0y/+ztNO/iTpKLCVUzPzRHTtsukZaE3SUY+IIYU6NvUYdMXfhcKnHH3VU+iVRaSfiK2hw7OCfsge8AQcucdNlgaHSrdvlDmzAIx7jsemsLh8ov5dpywIVkWWZGY6wIwVh2/zUWBMZ4O3V3OYWppRttXZr2ukmwIDU5hQ4qtKRKemHaHSgb18QTuUsowMhkLwx2eW5hMOIYyzLV+NyUTyaQhkD0EtYISRBhHM7RinbP9LQWbLm0dnueZ9O3AkwnbH8w6/h3jkshPZx8hqJ6QH33SwbML1KIvOTEFvgBs7dnj9gbcfMq+17Bu3/YkWw=="
      values.dacKeyset.blsSignatures.6:
-        "YBWhdxIOTQsrGcRQF8bHAEauHwl6F64farjSibsWDNPgplumU8MFRPn6X0jtBBMR1hH/aXso0ftQEI0edQVEB5dJkB4gymdhxq6hFCbYZpxsb8Ipr4lJe05WNmJRX1VeTRIu9WaeVLZlm+RMtvSuzbXXKJyNUnSZ420JaMKyR8Wt9M05nFZ832+eqer4eOtKDBX6gPBzdbUG+WRYdQlvFMkH/Nwo7LyKlHx231VIXKEIeuYXBmMxdtd0++QT7wi7PRN1XLjxGC8osyHYh3rksjBjG6urtgt4b/tVWyNevNaHT5YuO5MBPMMoQFgUqeV6dQiU3v2aXCwnnInTCjEvNbI5PUdwOosJi8JcdY7N1Vpm9jn8Gm89pCdwc8avTGWU5A=="
+        "YBHz50DGYvPi02ynzcvcJS9K2nhXWKKSIZdDtXqxxoD3a1s2Fh2he79bMUWZ6M6qEhHM52HZr3l5jLoU4kOTBN+Q87yo0ljgZJYaphdYrHb+jabsPUcR+xdauJKAoKSkjQz8BWC9b2QZ3F7LK+Ro3cpWgkHR9SQlt86mk+eM71AWRl3ybwlRaxwAzYwOd9TRkQYARTY8fjvRmhChCY5lz7FtY0ttPrbJ3Mc2VXy5r0yyIoNFAQjg/jMNoablUOOIZRn+4KGLBQSPKcnl/Nv/0ZNdT563sLPj6mP3qLPlvwAhFpI5vIhSpGdpgJ8n8Ns3uxJyYsPD8qaHQciNLNTzYWGEze40CPMkxEeGRqi8yRoK8iuK5kse/+kqhBOyR3NVJg=="
      values.dacKeyset.blsSignatures.5:
-        "YAX5RGkb2ssH+fb3F+MTg0p+7jF3Le5BT8W/hIR7iSsgHvN2l435zpiSVuqOZNaIaQ/wyuGPur4m2hoiJ1d0J+r/VvbEYQGFCxPe6oi5JzIuAb/QlRA9lT+B1Rup8HKhcAAnSGaIowju3bSosv0LG04H0NlZOSRdJSFOIBA3WyfiK1867Nju+ZqfWF/TLUvR4AnIz2uNkZ7TzuIiA6mQnDHvpKSKsAUvhhAovG8Y8TI0iC1W/LSX1G9VVqFBeI2k1gDX3vzit2yN2PjskBfh5+N6bsIRSECZPRXBqskekNytvRlFveesFOwpXOmiyRPmFAwaYLtsQtSVjz94Ev5rabPQim7x1y9s6AEtV/Q/ggRU7/lTha1SVmMCRdYWWu3Igg=="
+        "YA+ljLY01rxIncmXWl8bIZduwLObm0LKJIjzdyXjzH5FLN4Y+sUF2zjvF07aUPHOyADiV0y/+ztNO/iTpKLCVUzPzRHTtsukZaE3SUY+IIYU6NvUYdMXfhcKnHH3VU+iVRaSfiK2hw7OCfsge8AQcucdNlgaHSrdvlDmzAIx7jsemsLh8ov5dpywIVkWWZGY6wIwVh2/zUWBMZ4O3V3OYWppRttXZr2ukmwIDU5hQ4qtKRKemHaHSgb18QTuUsowMhkLwx2eW5hMOIYyzLV+NyUTyaQhkD0EtYISRBhHM7RinbP9LQWbLm0dnueZ9O3AkwnbH8w6/h3jkshPZx8hqJ6QH33SwbML1KIvOTEFvgBs7dnj9gbcfMq+17Bu3/YkWw=="
      values.dacKeyset.blsSignatures.4:
-        "YAuqwKcqcyPp5E3tp9vVoeBVx6gURQyV0XhwNaooWS2k/2VWHtrUuZdDdBiBRMq62Qf6cKtlqn5aGTqIq0jZJRbEcd0dkmlHLcrFJ96+/8FHu4jGabROamNoQxG5xcDpiwHi3WmI1pUaZVumUUXo+P+av0gKxemR2OSyKIOM8ERfQAWzZkDUw+dvo7Ga4PIsIwcyJ9rTjeq4S7fyD6qym9tEK2vOyhAAab7s9qC9TFnGbFkeSI/NY3tOrmhEqee0qwRz7eCR5Uf2sZBpYEGHAHadBFhoGPJCpQyBFu673o4kEWgMMKE7t9S4KR/Dgji2RAsI+xUaz3Wdvwfeoa/SAPdCd4j6PoqTuD/b74KiL9TqHtEQgk//j25bZK2778n5yA=="
+        "YBWhdxIOTQsrGcRQF8bHAEauHwl6F64farjSibsWDNPgplumU8MFRPn6X0jtBBMR1hH/aXso0ftQEI0edQVEB5dJkB4gymdhxq6hFCbYZpxsb8Ipr4lJe05WNmJRX1VeTRIu9WaeVLZlm+RMtvSuzbXXKJyNUnSZ420JaMKyR8Wt9M05nFZ832+eqer4eOtKDBX6gPBzdbUG+WRYdQlvFMkH/Nwo7LyKlHx231VIXKEIeuYXBmMxdtd0++QT7wi7PRN1XLjxGC8osyHYh3rksjBjG6urtgt4b/tVWyNevNaHT5YuO5MBPMMoQFgUqeV6dQiU3v2aXCwnnInTCjEvNbI5PUdwOosJi8JcdY7N1Vpm9jn8Gm89pCdwc8avTGWU5A=="
      values.dacKeyset.blsSignatures.3:
-        "YAKvb8hRiZPIAext4QCk7ngBMmDVkAcQoAqc/BSXtU7/gUDohCF6RI29uc5OlOXIIhifqDOAe+RIDnUrkMJuXKM3f+21bngw9rgjuSoGfaXfqLffFlR3eIQs0QY0XQeG0RKYArEpJ/D/hOt7YPOddAXGn62x4ryWuyqt5mkyyWzfGrncElFsqT6Ni+hAjwjDOABlbMG6rvSrm6uyznjdL233pYO0DTe8S95wgYOcGLP8xSDHlN341schNnHTQyJAcxddkM3BEocKI7ymH9PNp12Ax5Y5SVZEXKkLFAECOwihaMjjH0brzYxdGbaPEEAgDQQbx8bvW09h5AnTEXPrz6oYWFRep/drK92rK9LtDM8NgnjzMLv+AeSd93X1DmZPpA=="
+        "YAX5RGkb2ssH+fb3F+MTg0p+7jF3Le5BT8W/hIR7iSsgHvN2l435zpiSVuqOZNaIaQ/wyuGPur4m2hoiJ1d0J+r/VvbEYQGFCxPe6oi5JzIuAb/QlRA9lT+B1Rup8HKhcAAnSGaIowju3bSosv0LG04H0NlZOSRdJSFOIBA3WyfiK1867Nju+ZqfWF/TLUvR4AnIz2uNkZ7TzuIiA6mQnDHvpKSKsAUvhhAovG8Y8TI0iC1W/LSX1G9VVqFBeI2k1gDX3vzit2yN2PjskBfh5+N6bsIRSECZPRXBqskekNytvRlFveesFOwpXOmiyRPmFAwaYLtsQtSVjz94Ev5rabPQim7x1y9s6AEtV/Q/ggRU7/lTha1SVmMCRdYWWu3Igg=="
      values.dacKeyset.blsSignatures.2:
-        "YA1wn7+Q7YfmWm4B63iIDrEzquUCqvuQAXCeq+e5pzVb4AQp2pOUkboz4+GIhKB4rQ77pOEK7RQVDl52V7CYEMtO5koML9h9OOU9o8rQzKCZlN0uuh97hLmn3uClp9i9BBgu5d9ptNNVjuX6CGWNw23GfyxIhx/uYKO+Lngpekmnc/gvNQ7iZmFT3pOd7cnkDwKVYCO0K4AdCiK/n92I4J2ZLN/dPU9cb56BorMRCQ9LWIy4069ZXcZsU+z1RR/KkAb74lp6FvZsqImmkQjoKv03XiuGU6syNkO5lOmX5vLX/+ttSjvWYo5yuNOBEams/A+6Aaqr8AaiVoytLAYidWkn9c4JkPTXh3Vhj//1fiuUD93NfpvZVFxOmNphqqHLaQ=="
+        "YAKvb8hRiZPIAext4QCk7ngBMmDVkAcQoAqc/BSXtU7/gUDohCF6RI29uc5OlOXIIhifqDOAe+RIDnUrkMJuXKM3f+21bngw9rgjuSoGfaXfqLffFlR3eIQs0QY0XQeG0RKYArEpJ/D/hOt7YPOddAXGn62x4ryWuyqt5mkyyWzfGrncElFsqT6Ni+hAjwjDOABlbMG6rvSrm6uyznjdL233pYO0DTe8S95wgYOcGLP8xSDHlN341schNnHTQyJAcxddkM3BEocKI7ymH9PNp12Ax5Y5SVZEXKkLFAECOwihaMjjH0brzYxdGbaPEEAgDQQbx8bvW09h5AnTEXPrz6oYWFRep/drK92rK9LtDM8NgnjzMLv+AeSd93X1DmZPpA=="
      values.keySetUpdates:
-        5
+        6
    }
```

Generated with discovered.json: 0x1f7fa40b4f66805ff97fdef9d48c20dbe9daa37c

# Diff at Mon, 14 Oct 2024 10:59:27 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@1afc77ff111ceb0970e7d09efcc7b2f376b0c281 block: 257934975
- current block number: 257934975

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 257934975 (main branch discovery), not current.

```diff
    contract GnosisSafeAdminMember (0x000d8C5A70B8805DF02f409F2715d05B9A63E871) {
    +++ description: None
      sourceHashes:
+        ["0x81a7349eebb98ac33b0bc6842e3cb258034a8f2a4ba004570bb8e2e25947f9ff","0x59fe14e95a8aa7f52213f18bae5c9329cf583a7ba31194698b15eddb97d5e825"]
    }
```

```diff
    contract ProxyAdmin (0x041F85dD87c46B941dc9b15c6628B19ee5358485) {
    +++ description: None
      sourceHashes:
+        ["0xf944f88083f41ff959fefbdcd6fc3ae633692b072b8497fb14cbdd843eded490"]
    }
```

```diff
    contract UpgradeExecutor (0x0EE7AD3Cc291343C9952fFd8844e86d294fa513F) {
    +++ description: None
      sourceHashes:
+        ["0xa7e3f6c355703ed46fcb2156862c4f01792b87beb10a87a81ce3bd5beee79b67","0xa7ff878cfd433a428d567d3b90fe1df400a048a1af5298f22cd4cd4fc25bdecd"]
    }
```

```diff
    contract BucketTracker (0x1582e73D95F33E39B421F9224D9e7daF4508408E) {
    +++ description: None
      sourceHashes:
+        ["0x24f4060d81bbea737c636f9646fa1a2ee2a40035bd6a40e58fed39d5867928e6"]
    }
```

```diff
    contract Outbox (0x1E400568AD4840dbE50FB32f306B842e9ddeF726) {
    +++ description: None
      sourceHashes:
+        ["0xa7e3f6c355703ed46fcb2156862c4f01792b87beb10a87a81ce3bd5beee79b67","0x3073f29910dee50069a001fb20e58cca3dcc1b3c8da4b91809af2dd356ef0c8c"]
    }
```

```diff
    contract L1GatewayRouter (0x22CCA5Dc96a4Ac1EC32c9c7C5ad4D66254a24C35) {
    +++ description: None
      sourceHashes:
+        ["0x36a2777510f3b20063560bdcb7f657da283bcfdc484a19b0a0f77d18f6a8b5e1","0x33422e0ac90902db5dad442b006c9df60e262556d8ad286808d133b5429a3eb0"]
    }
```

```diff
    contract ValidatorWalletCreator (0x2b0E04Dc90e3fA58165CB41E2834B44A56E766aF) {
    +++ description: None
      sourceHashes:
+        ["0x4ef3473c840bed3b4c6258271a494794c1545f0d0f13c6a386d1e39e6180d67c"]
    }
```

```diff
    contract ERC20RollupEventInbox (0x36aDe24988E4C47602e38BD9a0Bd89031eF807a8) {
    +++ description: None
      sourceHashes:
+        ["0xa7e3f6c355703ed46fcb2156862c4f01792b87beb10a87a81ce3bd5beee79b67","0x88c3a2fa81cad2f98a156402c78de0fc804b2a1866ea4f449aa90ae92ceabc6c"]
    }
```

```diff
    contract ChallengeManager (0x3a3f62034a42a35eA1686B199bB73006aa525eE4) {
    +++ description: None
      sourceHashes:
+        ["0xa7e3f6c355703ed46fcb2156862c4f01792b87beb10a87a81ce3bd5beee79b67","0x58a6261c83c2766f749641902ad6fdb695ea189d2747f073b57a8f35b9a547e5"]
    }
```

```diff
    contract ExecutorMultisig (0x4972A8EF186Ee42A14Cdd3c47f52ec06a6dc495E) {
    +++ description: None
      sourceHashes:
+        ["0x81a7349eebb98ac33b0bc6842e3cb258034a8f2a4ba004570bb8e2e25947f9ff","0x59fe14e95a8aa7f52213f18bae5c9329cf583a7ba31194698b15eddb97d5e825"]
    }
```

```diff
    contract OneStepProverMemory (0x526a6E634aD36bB0007c4422586c135F1F9B525a) {
    +++ description: None
      sourceHashes:
+        ["0x731b4466319a83c95ce227d1a6c85aa03864f5d2bed03bda186843033a8b8d61"]
    }
```

```diff
    contract StakingPool (0x599C8489256Fb17b66d499d907F30b8022a29443) {
    +++ description: None
      sourceHashes:
+        ["0x5fab3d0f8f434afcc4313dcfd8583d24b79a87e93701172b3b17451ded52f00e"]
    }
```

```diff
    contract PoolBeacon (0x5f9D168d3435747335b1B3dC7e4d42e3510087C7) {
    +++ description: None
      sourceHashes:
+        ["0xbc25202c962ba06d0d9766c3d0f0752bebe0e04c3e81c8e524f1bb56c511f344"]
    }
```

```diff
    contract PoolProxyDeployer (0x68D78D1E81379EfD9C61f8E9131D52CE571AF4fD) {
    +++ description: None
      issuedPermissions.0.target:
-        "0xD88c8E0aE21beA6adE41A41130Bb4cd43e6b1723"
+        "0x7C94E07bbf73518B0E25D1Be200a5b58F46F9dC7"
      issuedPermissions.0.via.0:
+        {"address":"0xD88c8E0aE21beA6adE41A41130Bb4cd43e6b1723","delay":0}
      sourceHashes:
+        ["0x36a2777510f3b20063560bdcb7f657da283bcfdc484a19b0a0f77d18f6a8b5e1","0xfe7d4f8b4f6b1198e1260974eeca86c30dbb95347dd52003ca893a8421f63f2f"]
    }
```

```diff
    contract PoolBeacon (0x6Bc4e6B2c13Ba42e933b23AFAb8a58bbbBa5D02B) {
    +++ description: None
      sourceHashes:
+        ["0xbc25202c962ba06d0d9766c3d0f0752bebe0e04c3e81c8e524f1bb56c511f344"]
    }
```

```diff
    contract ValidatorUtils (0x6c21303F5986180B1394d2C89f3e883890E2867b) {
    +++ description: None
      sourceHashes:
+        ["0xd9b36ec321be937cc727b5bdb0afa0e1a0a28448ef1a202d4f181a01ce57bdc8"]
    }
```

```diff
    contract Bridge (0x7dd8A76bdAeBE3BBBaCD7Aa87f1D4FDa1E60f94f) {
    +++ description: None
      sourceHashes:
+        ["0xa7e3f6c355703ed46fcb2156862c4f01792b87beb10a87a81ce3bd5beee79b67","0x057de68a7007d55f4394ba6eafb2c802efcaf13583ff9342ea4d0ee3924d9be1"]
    }
```

```diff
    contract OneStepProver0 (0x800dA62bE6626127F71B34E795286C34C04D6712) {
    +++ description: None
      sourceHashes:
+        ["0x20330713abbbcf0219ef7d1c0aa3a6ede1b421f14c9d21b25c973e54fb75f5df"]
    }
```

```diff
    contract GasSubsidy (0x94F4aBC83eae00b693286B6eDCa09e1D76183C97) {
    +++ description: None
      issuedPermissions.0.target:
-        "0xD88c8E0aE21beA6adE41A41130Bb4cd43e6b1723"
+        "0x7C94E07bbf73518B0E25D1Be200a5b58F46F9dC7"
      issuedPermissions.0.via.0:
+        {"address":"0xD88c8E0aE21beA6adE41A41130Bb4cd43e6b1723","delay":0}
      sourceHashes:
+        ["0x36a2777510f3b20063560bdcb7f657da283bcfdc484a19b0a0f77d18f6a8b5e1","0x4fb5ce09fed416c49adb85057e748a97d8987e93d10a84ab6c10c85217a9d4ad"]
    }
```

```diff
    contract SequencerInbox (0x995a9d3ca121D48d21087eDE20bc8acb2398c8B1) {
    +++ description: State batches / commitments get posted here.
      sourceHashes:
+        ["0xa7e3f6c355703ed46fcb2156862c4f01792b87beb10a87a81ce3bd5beee79b67","0x50cf57b01499408fa99da27cf0fee96ec30f0d40667d1aa090c442bc80f0636b"]
    }
```

```diff
    contract BucketTracker (0xa83825Dc4D94513d1C907b319EE8224FA63A29B2) {
    +++ description: None
      sourceHashes:
+        ["0x24f4060d81bbea737c636f9646fa1a2ee2a40035bd6a40e58fed39d5867928e6"]
    }
```

```diff
    contract Inbox (0xaE21fDA3de92dE2FDAF606233b2863782Ba046F9) {
    +++ description: None
      sourceHashes:
+        ["0xa7e3f6c355703ed46fcb2156862c4f01792b87beb10a87a81ce3bd5beee79b67","0xcb390b491549387c8fcc09fb22fbea7adf54cc74b7247a0c738369ddd7049b92"]
    }
```

```diff
    contract OneStepProofEntry (0xb20107bfB36D3B5AcA534aCAfbd8857b10b402a8) {
    +++ description: None
      sourceHashes:
+        ["0xf3479c667d20b1c17ea2573dc7fe09e4315a3e20bc09d31bc92603520cc962cc"]
    }
```

```diff
    contract L1ERC20Gateway (0xb591cE747CF19cF30e11d656EB94134F523A9e77) {
    +++ description: None
      sourceHashes:
+        ["0x36a2777510f3b20063560bdcb7f657da283bcfdc484a19b0a0f77d18f6a8b5e1","0x17c9d8bf5017982cb88ab1d4f22a085c097ab9c7a910fa109fe9e7204840bef8"]
    }
```

```diff
    contract NodeLicenseRegistry (0xbc14d8563b248B79689ECbc43bBa53290e0b6b66) {
    +++ description: None
      issuedPermissions.0.target:
-        "0xD88c8E0aE21beA6adE41A41130Bb4cd43e6b1723"
+        "0x7C94E07bbf73518B0E25D1Be200a5b58F46F9dC7"
      issuedPermissions.0.via.0:
+        {"address":"0xD88c8E0aE21beA6adE41A41130Bb4cd43e6b1723","delay":0}
      sourceHashes:
+        ["0x36a2777510f3b20063560bdcb7f657da283bcfdc484a19b0a0f77d18f6a8b5e1","0x1b5b7bb8aa9932be3a7e263d3905e78382f86318e4252b53a05c67152ede1de1"]
    }
```

```diff
    contract RollupProxy (0xC47DacFbAa80Bd9D8112F4e8069482c2A3221336) {
    +++ description: Manages rollup components, list of Stakers and Validators. Entry point for Validators creating new Rollup Nodes (state commits) and Challengers submitting fraud proofs.
      sourceHashes:
+        ["0xb8da0b3748daac768860783e8555198fd2d1bbdffb775b81557a7124890c7eca","0x8b48118fe606012c0dcac2ccc1821785935aec89fab8f219f47b32c482b0017e","0xef94a66bd5339efd18fb9ca1f8031482e7ef7bbe6c5a0a10fae254ab83712406"]
    }
```

```diff
    contract OneStepProverHostIo (0xc555b2F1D559Fbb854569b33640990D178F94747) {
    +++ description: None
      sourceHashes:
+        ["0x5b0a5e16100b7e163dcf39dc6a9034f12a7bad7a475cdffc73054b937be0683d"]
    }
```

```diff
    contract StakingProxyAdmin (0xD88c8E0aE21beA6adE41A41130Bb4cd43e6b1723) {
    +++ description: None
      receivedPermissions:
-        [{"permission":"upgrade","target":"0x68D78D1E81379EfD9C61f8E9131D52CE571AF4fD"},{"permission":"upgrade","target":"0x94F4aBC83eae00b693286B6eDCa09e1D76183C97"},{"permission":"upgrade","target":"0xbc14d8563b248B79689ECbc43bBa53290e0b6b66"},{"permission":"upgrade","target":"0xF9E08660223E2dbb1c0b28c82942aB6B5E38b8E5"},{"permission":"upgrade","target":"0xfD41041180571C5D371BEA3D9550E55653671198"}]
      template:
+        "global/ProxyAdmin"
      sourceHashes:
+        ["0x68f689a23d3badd91255602a1eb13d4789baedc16d904c3103244642fc78ca8f"]
      directlyReceivedPermissions:
+        [{"permission":"upgrade","target":"0x68D78D1E81379EfD9C61f8E9131D52CE571AF4fD"},{"permission":"upgrade","target":"0x94F4aBC83eae00b693286B6eDCa09e1D76183C97"},{"permission":"upgrade","target":"0xbc14d8563b248B79689ECbc43bBa53290e0b6b66"},{"permission":"upgrade","target":"0xF9E08660223E2dbb1c0b28c82942aB6B5E38b8E5"},{"permission":"upgrade","target":"0xfD41041180571C5D371BEA3D9550E55653671198"}]
    }
```

```diff
    contract OneStepProverMath (0xe8709022B9C9D7347856c75910fe07e10C904446) {
    +++ description: None
      sourceHashes:
+        ["0xb2555ede3dfe7d6df28bd96d12a0113b658c213c7ce4e34fa539df7497bc51a1"]
    }
```

```diff
    contract PoolFactory (0xF9E08660223E2dbb1c0b28c82942aB6B5E38b8E5) {
    +++ description: None
      issuedPermissions.0.target:
-        "0xD88c8E0aE21beA6adE41A41130Bb4cd43e6b1723"
+        "0x7C94E07bbf73518B0E25D1Be200a5b58F46F9dC7"
      issuedPermissions.0.via.0:
+        {"address":"0xD88c8E0aE21beA6adE41A41130Bb4cd43e6b1723","delay":0}
      sourceHashes:
+        ["0x36a2777510f3b20063560bdcb7f657da283bcfdc484a19b0a0f77d18f6a8b5e1","0x317ab76b0d59c8c31385b5239fb1bdfff324c9629c5e8d74b82808349fbb169a"]
    }
```

```diff
    contract PoolBeacon (0xfB93c2e5E41BD0ffd2E99A88e6d2A8D4F542d39a) {
    +++ description: None
      sourceHashes:
+        ["0xbc25202c962ba06d0d9766c3d0f0752bebe0e04c3e81c8e524f1bb56c511f344"]
    }
```

```diff
    contract FundsReiceiverMultisig (0xFCF7248C495d6fd3641eE43F861c48Ebe402c878) {
    +++ description: The designated fundsReceiver in the NodeLicenseRegistry. Receives all ETH from 'Sentry Node License' mints.
      sourceHashes:
+        ["0x81a7349eebb98ac33b0bc6842e3cb258034a8f2a4ba004570bb8e2e25947f9ff","0x59fe14e95a8aa7f52213f18bae5c9329cf583a7ba31194698b15eddb97d5e825"]
    }
```

```diff
    contract SentryReferee (0xfD41041180571C5D371BEA3D9550E55653671198) {
    +++ description: None
      issuedPermissions.0.target:
-        "0xD88c8E0aE21beA6adE41A41130Bb4cd43e6b1723"
+        "0x7C94E07bbf73518B0E25D1Be200a5b58F46F9dC7"
      issuedPermissions.0.via.0:
+        {"address":"0xD88c8E0aE21beA6adE41A41130Bb4cd43e6b1723","delay":0}
      sourceHashes:
+        ["0x36a2777510f3b20063560bdcb7f657da283bcfdc484a19b0a0f77d18f6a8b5e1","0xf01cd4fba1b7619d893eac322f11d01c25dec45cec99f03c7c3dac3db562d011"]
    }
```

Generated with discovered.json: 0x27f1434926aea5bafbefc4c676e09195e92605df

# Diff at Tue, 01 Oct 2024 11:13:08 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@bd754dc73c66120164006054f8d25c5fae9cd910 block: 257934975
- current block number: 257934975

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 257934975 (main branch discovery), not current.

```diff
    contract UpgradeExecutor (0x0EE7AD3Cc291343C9952fFd8844e86d294fa513F) {
    +++ description: None
      values.$pastUpgrades:
+        [["2024-01-03T19:16:11.000Z",["0x660ea1675F7323dC3Ba0c8dDFB593225Eb01E3C1"]]]
    }
```

```diff
    contract Outbox (0x1E400568AD4840dbE50FB32f306B842e9ddeF726) {
    +++ description: None
      values.$pastUpgrades:
+        [["2024-01-03T19:16:11.000Z",["0x302275067251F5FcdB9359Bda735fD8f7A4A54c0"]]]
    }
```

```diff
    contract L1GatewayRouter (0x22CCA5Dc96a4Ac1EC32c9c7C5ad4D66254a24C35) {
    +++ description: None
      values.$pastUpgrades:
+        [["2024-01-05T17:33:40.000Z",["0xd106EC93D2c1adaA65C4B17ffc7bB166Ce30DDAe"]]]
    }
```

```diff
    contract ERC20RollupEventInbox (0x36aDe24988E4C47602e38BD9a0Bd89031eF807a8) {
    +++ description: None
      values.$pastUpgrades:
+        [["2024-01-03T19:16:11.000Z",["0x18FD37A4FB9E1F06d9383958aFd236771F15A8cb"]]]
    }
```

```diff
    contract ChallengeManager (0x3a3f62034a42a35eA1686B199bB73006aa525eE4) {
    +++ description: None
      values.$pastUpgrades:
+        [["2024-01-03T19:16:11.000Z",["0x09824fe72BFF474d16D9c2774432E381BBD60662"]],["2024-08-20T17:31:00.000Z",["0x5cA988F213EfbCB86ED7e2AACB0C15c91e648f8d"]]]
    }
```

```diff
    contract PoolProxyDeployer (0x68D78D1E81379EfD9C61f8E9131D52CE571AF4fD) {
    +++ description: None
      values.$pastUpgrades:
+        [["2024-04-11T20:05:43.000Z",["0xb6773d5bF5b908B58ff5B7Bd36A7F06Da2EeeEc7"]]]
    }
```

```diff
    contract Bridge (0x7dd8A76bdAeBE3BBBaCD7Aa87f1D4FDa1E60f94f) {
    +++ description: None
      values.$pastUpgrades:
+        [["2024-01-03T19:16:11.000Z",["0x2a6DD4433ffa96dc1755814FC0d9cc83A5F68DeC"]]]
    }
```

```diff
    contract GasSubsidy (0x94F4aBC83eae00b693286B6eDCa09e1D76183C97) {
    +++ description: None
      values.$pastUpgrades:
+        [["2023-12-05T18:33:39.000Z",["0xF208798482F0b12c8767Bc03cC0F145D18BeCe6A"]]]
    }
```

```diff
    contract SequencerInbox (0x995a9d3ca121D48d21087eDE20bc8acb2398c8B1) {
    +++ description: State batches / commitments get posted here.
      values.$pastUpgrades:
+        [["2024-01-03T19:16:11.000Z",["0x1c6ACCd9d66f3B993928E7439c9A2d67b94a445F"]],["2024-08-20T17:31:00.000Z",["0x7a299aD29499736994Aa3a9aFa3f476445FAEB2c"]]]
    }
```

```diff
    contract Inbox (0xaE21fDA3de92dE2FDAF606233b2863782Ba046F9) {
    +++ description: None
      values.$pastUpgrades:
+        [["2024-01-03T19:16:11.000Z",["0x7EfcB76D0e2E776A298aAa603d433336e5F8b6ab"]]]
    }
```

```diff
    contract L1ERC20Gateway (0xb591cE747CF19cF30e11d656EB94134F523A9e77) {
    +++ description: None
      values.$pastUpgrades:
+        [["2024-01-05T17:33:40.000Z",["0x8b73Ef238ADaB31EBC7c05423d243c345241a22f"]]]
    }
```

```diff
    contract NodeLicenseRegistry (0xbc14d8563b248B79689ECbc43bBa53290e0b6b66) {
    +++ description: None
      values.$pastUpgrades:
+        [["2023-12-05T18:34:03.000Z",["0xf765452e587Ad0AE785Dc984963897c05d4c8c71"]],["2023-12-06T04:00:01.000Z",["0x471f1a92a8099f7011Aa3f2E011569618bD754EC"]],["2023-12-11T19:39:24.000Z",["0x471f1a92a8099f7011Aa3f2E011569618bD754EC"]],["2023-12-11T20:19:48.000Z",["0xC2b691250fD85bF7eC91Dd4f13eF1e76678395B2"]],["2023-12-19T21:11:23.000Z",["0xAED4aF101d3e64114051E63F12265403d6Cb9B10"]],["2023-12-22T18:33:23.000Z",["0xfD6Bb931D2Ee134E70568ca36584c043cB278734"]],["2023-12-22T22:21:26.000Z",["0xa2815b0F4A99799aeb9d5cb73501E43f5197dDD1"]],["2023-12-22T23:54:26.000Z",["0xfD6Bb931D2Ee134E70568ca36584c043cB278734"]]]
    }
```

```diff
    contract RollupProxy (0xC47DacFbAa80Bd9D8112F4e8069482c2A3221336) {
    +++ description: Manages rollup components, list of Stakers and Validators. Entry point for Validators creating new Rollup Nodes (state commits) and Challengers submitting fraud proofs.
      values.$pastUpgrades:
+        [["2024-01-03T19:16:11.000Z",["0xEe9E5546A11Cb5b4A86e92DA05f2ef75C26E4754","0x0aE4dD666748bF0F6dB5c149Eab1D8aD27820A6A"]]]
      values.$upgradeCount:
+        1
    }
```

```diff
    contract PoolFactory (0xF9E08660223E2dbb1c0b28c82942aB6B5E38b8E5) {
    +++ description: None
      values.$pastUpgrades:
+        [["2024-04-11T20:05:40.000Z",["0x21EEC6626f15d02A8896ebB7EDD68ff3CB61e89E"]]]
    }
```

```diff
    contract SentryReferee (0xfD41041180571C5D371BEA3D9550E55653671198) {
    +++ description: None
      values.$pastUpgrades:
+        [["2023-12-05T18:33:46.000Z",["0x29A7b907FdF4a9235F46d891b7Aa1e7d3D35A3b6"]],["2024-02-27T20:49:59.000Z",["0x4110251275f1b1f8e6Ce7114139D69597fdAd474"]],["2024-03-01T18:50:49.000Z",["0x10edA49fA8C6594cC6783CA5d7a6677d9e3236c1"]],["2024-03-01T19:37:28.000Z",["0x254954e3F6BD7443444036BeA2d8fE88fdf496c1"]],["2024-04-11T20:05:47.000Z",["0x5538622Ad2F14bf781Af032542F7f00f080EB4CD"]],["2024-04-16T14:51:04.000Z",["0x680F4a9f47E4Cfea124a5654E759cB3b0a0C837c"]],["2024-05-16T18:01:22.000Z",["0xFf38Aa9D553bE47eee329F968ADF0C74A01D021c"]],["2024-06-07T17:57:03.000Z",["0x609152cb742916E0F7FBC4391Be750C458b049fe"]]]
    }
```

Generated with discovered.json: 0xc60d9601603d1745ef64be31957253d1052854fe

# Diff at Fri, 27 Sep 2024 15:36:08 GMT:

- author: sekuba (<sekuba@users.noreply.github.com>)
- comparing to: main@4cb14cc1bdc343d171a7988f9f91f11edbf568a8 block: 245317770
- current block number: 257934975

## Description

Config.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 245317770 (main branch discovery), not current.

```diff
    contract RollupProxy (0xC47DacFbAa80Bd9D8112F4e8069482c2A3221336) {
    +++ description: Manages rollup components, list of Stakers and Validators. Entry point for Validators creating new Rollup Nodes (state commits) and Challengers submitting fraud proofs.
      usedTypes.0.arg.0x184884e1eb9fefdc158f6c8ac912bb183bf3cf83f0090317e0bc4ac5860baa39:
+        "ArbOS v32 wasmModuleRoot"
    }
```

Generated with discovered.json: 0xf8fff7d5f2217ce9f51b12a3bbff3e72a81996ba

# Diff at Sun, 01 Sep 2024 08:47:44 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@bee35b6cff7c52634ae8667cbb331e18ad4ec17a block: 245317770
- current block number: 245317770

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 245317770 (main branch discovery), not current.

```diff
    contract RollupProxy (0xC47DacFbAa80Bd9D8112F4e8069482c2A3221336) {
    +++ description: Manages rollup components, list of Stakers and Validators. Entry point for Validators creating new Rollup Nodes (state commits) and Challengers submitting fraud proofs.
+++ description: Root hash of the WASM module used for execution, like a fingerprint of the L2 logic. Can be associated with ArbOS versions.
      values.wasmModuleRoot:
-        "0x8b104a2e80ac6165dc58b9048de12f301d70b02a0ab51396c22b4b4b802a16a4"
+        "ArbOS v20 wasmModuleRoot"
      usedTypes:
+        [{"typeCaster":"Mapping","arg":{"0xbb9d58e9527566138b682f3a207c0976d5359837f6e330f4017434cca983ff41":"ArbOS v1-rc1 wasmModuleRoot","0x9d68e40c47e3b87a8a7e6368cc52915720a6484bb2f47ceabad7e573e3a11232":"ArbOS v2.1 wasmModuleRoot","0x53c288a0ca7100c0f2db8ab19508763a51c7fd1be125d376d940a65378acaee7":"ArbOS v3 wasmModuleRoot","0x588762be2f364be15d323df2aa60ffff60f2b14103b34823b6f7319acd1ae7a3":"ArbOS v3.1 wasmModuleRoot","0xcfba6a883c50a1b4475ab909600fa88fc9cceed9e3ff6f43dccd2d27f6bd57cf":"ArbOS v3.2 wasmModuleRoot","0xa24ccdb052d92c5847e8ea3ce722442358db4b00985a9ee737c4e601b6ed9876":"ArbOS v4 wasmModuleRoot","0x1e09e6d9e35b93f33ed22b2bc8dc10bbcf63fdde5e8a1fb8cc1bcd1a52f14bd0":"ArbOS v5 wasmModuleRoot","0x3848eff5e0356faf1fc9cafecb789584c5e7f4f8f817694d842ada96613d8bab":"ArbOS v6 wasmModuleRoot","0x53dd4b9a3d807a8cbb4d58fbfc6a0857c3846d46956848cae0a1cc7eca2bb5a8":"ArbOS v7 wasmModuleRoot","0x2b20e1490d1b06299b222f3239b0ae07e750d8f3b4dedd19f500a815c1548bbc":"ArbOS v7.1 wasmModuleRoot","0xd1842bfbe047322b3f3b3635b5fe62eb611557784d17ac1d2b1ce9c170af6544":"ArbOS v9 wasmModuleRoot","0x6b94a7fc388fd8ef3def759297828dc311761e88d8179c7ee8d3887dc554f3c3":"ArbOS v10 wasmModuleRoot","0xda4e3ad5e7feacb817c21c8d0220da7650fe9051ece68a3f0b1c5d38bbb27b21":"ArbOS v10.1 wasmModuleRoot","0x0754e09320c381566cc0449904c377a52bd34a6b9404432e80afd573b67f7b17":"ArbOS v10.2 wasmModuleRoot","0xf559b6d4fa869472dabce70fe1c15221bdda837533dfd891916836975b434dec":"ArbOS v10.3 wasmModuleRoot","0xf4389b835497a910d7ba3ebfb77aa93da985634f3c052de1290360635be40c4a":"ArbOS v11 wasmModuleRoot","0x68e4fe5023f792d4ef584796c84d710303a5e12ea02d6e37e2b5e9c4332507c4":"ArbOS v11.1 wasmModuleRoot","0x8b104a2e80ac6165dc58b9048de12f301d70b02a0ab51396c22b4b4b802a16a4":"ArbOS v20 wasmModuleRoot","0xb0de9cb89e4d944ae6023a3b62276e54804c242fd8c4c2d8e6cc4450f5fa8b1b":"ArbOS v30 wasmModuleRoot","0x260f5fa5c3176a856893642e149cf128b5a8de9f828afec8d11184415dd8dc69":"ArbOS v31 wasmModuleRoot"}}]
    }
```

Generated with discovered.json: 0x436689bb090568a54c0d02a4580150816807ff9c

# Diff at Fri, 30 Aug 2024 08:06:26 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@6c1bd1f41fadf5f2cb1c1805b5a2c6138a3ed35a block: 245317770
- current block number: 245317770

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 245317770 (main branch discovery), not current.

```diff
    contract ProxyAdmin (0x041F85dD87c46B941dc9b15c6628B19ee5358485) {
    +++ description: None
      receivedPermissions.8.via:
-        []
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
    contract UpgradeExecutor (0x0EE7AD3Cc291343C9952fFd8844e86d294fa513F) {
    +++ description: None
      receivedPermissions.0.via:
-        []
    }
```

```diff
    contract StakingProxyAdmin (0xD88c8E0aE21beA6adE41A41130Bb4cd43e6b1723) {
    +++ description: None
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

Generated with discovered.json: 0x48e70b5ac8d08d0f94fd6e9d7be833cd1b08d83f

# Diff at Fri, 23 Aug 2024 09:57:25 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@67597c7d6c810bc726594446890178150240711e block: 245317770
- current block number: 245317770

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 245317770 (main branch discovery), not current.

```diff
    contract UpgradeExecutor (0x0EE7AD3Cc291343C9952fFd8844e86d294fa513F) {
    +++ description: None
      values.$upgradeCount:
+        1
    }
```

```diff
    contract Outbox (0x1E400568AD4840dbE50FB32f306B842e9ddeF726) {
    +++ description: None
      values.$upgradeCount:
+        1
    }
```

```diff
    contract L1GatewayRouter (0x22CCA5Dc96a4Ac1EC32c9c7C5ad4D66254a24C35) {
    +++ description: None
      values.$upgradeCount:
+        1
    }
```

```diff
    contract ERC20RollupEventInbox (0x36aDe24988E4C47602e38BD9a0Bd89031eF807a8) {
    +++ description: None
      values.$upgradeCount:
+        1
    }
```

```diff
    contract ChallengeManager (0x3a3f62034a42a35eA1686B199bB73006aa525eE4) {
    +++ description: None
      values.$upgradeCount:
+        2
    }
```

```diff
    contract PoolProxyDeployer (0x68D78D1E81379EfD9C61f8E9131D52CE571AF4fD) {
    +++ description: None
      values.$upgradeCount:
+        1
    }
```

```diff
    contract Bridge (0x7dd8A76bdAeBE3BBBaCD7Aa87f1D4FDa1E60f94f) {
    +++ description: None
      values.$upgradeCount:
+        1
    }
```

```diff
    contract GasSubsidy (0x94F4aBC83eae00b693286B6eDCa09e1D76183C97) {
    +++ description: None
      values.$upgradeCount:
+        1
    }
```

```diff
    contract SequencerInbox (0x995a9d3ca121D48d21087eDE20bc8acb2398c8B1) {
    +++ description: State batches / commitments get posted here.
      values.$upgradeCount:
+        2
    }
```

```diff
    contract Inbox (0xaE21fDA3de92dE2FDAF606233b2863782Ba046F9) {
    +++ description: None
      values.$upgradeCount:
+        1
    }
```

```diff
    contract L1ERC20Gateway (0xb591cE747CF19cF30e11d656EB94134F523A9e77) {
    +++ description: None
      values.$upgradeCount:
+        1
    }
```

```diff
    contract NodeLicenseRegistry (0xbc14d8563b248B79689ECbc43bBa53290e0b6b66) {
    +++ description: None
      values.$upgradeCount:
+        8
    }
```

```diff
    contract PoolFactory (0xF9E08660223E2dbb1c0b28c82942aB6B5E38b8E5) {
    +++ description: None
      values.$upgradeCount:
+        1
    }
```

```diff
    contract SentryReferee (0xfD41041180571C5D371BEA3D9550E55653671198) {
    +++ description: None
      values.$upgradeCount:
+        8
    }
```

Generated with discovered.json: 0x6a38021bd085573f986e6fdb2c6fe583e4f5d431

# Diff at Wed, 21 Aug 2024 21:56:14 GMT:

- author: vincfurc (<10850139+vincfurc@users.noreply.github.com>)
- comparing to: main@a84e39efa4f1e38eb52ca8ca005fb438919e951f block: 229959335
- current block number: 245317770

## Description

Xai upgraded to [ArbOS Version 20 "Atlas"](https://forum.arbitrum.foundation/t/aip-arbos-version-20-atlas/20957).
This upgrade comes with blobs support (but Xai is an L3 on Arbitrum, it is still posting calldata) and was reviewed thoroughly in `packages/backend/discovery/arbitrum/ethereum/diffHistory.md` at "Diff at Fri, 22 Mar 2024 07:51:09 GMT:".

## Watched changes

```diff
-   Status: DELETED
    contract OneStepProver0 (0x1135265fE014D3FA32B3507E325642B92aFFeAEb)
    +++ description: None
```

```diff
    contract ChallengeManager (0x3a3f62034a42a35eA1686B199bB73006aa525eE4) {
    +++ description: None
      values.$implementation:
-        "0x09824fe72BFF474d16D9c2774432E381BBD60662"
+        "0x5cA988F213EfbCB86ED7e2AACB0C15c91e648f8d"
      values.osp:
-        "0x99a2A31300816C1FA3f40818AC9280fe7271F878"
+        "0xb20107bfB36D3B5AcA534aCAfbd8857b10b402a8"
    }
```

```diff
-   Status: DELETED
    contract OneStepProverMath (0x4811500e0d376Fa8d2EA3CCb7c61E0afB4F5A7f1)
    +++ description: None
```

```diff
-   Status: DELETED
    contract OneStepProverHostIo (0x89AF7C4C2198c426cFe6E86de0680A0850503e06)
    +++ description: None
```

```diff
    contract SequencerInbox (0x995a9d3ca121D48d21087eDE20bc8acb2398c8B1) {
    +++ description: State batches / commitments get posted here.
      values.$implementation:
-        "0x1c6ACCd9d66f3B993928E7439c9A2d67b94a445F"
+        "0x7a299aD29499736994Aa3a9aFa3f476445FAEB2c"
+++ description: Struct: delayBlocks, futureBlocks, delaySeconds, futureSeconds. onlyRollupOwner settable. Transactions can only be force-included after `delayBlocks` window (Sequencer-only) has passed.
      values.maxTimeVariation:
-        {"delayBlocks":5760,"futureBlocks":96,"delaySeconds":86400,"futureSeconds":3600}
+        [5760,96,86400,3600]
      values.batchPosterManager:
+        "0x000d8C5A70B8805DF02f409F2715d05B9A63E871"
      values.BROTLI_MESSAGE_HEADER_FLAG:
+        "0x00"
      values.DAS_MESSAGE_HEADER_FLAG:
+        "0x80"
      values.DATA_BLOB_HEADER_FLAG:
+        "0x50"
      values.isUsingFeeToken:
+        true
      values.reader4844:
+        "0x0000000000000000000000000000000000000000"
      values.TREE_DAS_MESSAGE_HEADER_FLAG:
+        "0x08"
      values.ZERO_HEAVY_MESSAGE_HEADER_FLAG:
+        "0x20"
    }
```

```diff
-   Status: DELETED
    contract OneStepProofEntry (0x99a2A31300816C1FA3f40818AC9280fe7271F878)
    +++ description: None
```

```diff
    contract RollupProxy (0xC47DacFbAa80Bd9D8112F4e8069482c2A3221336) {
    +++ description: Manages rollup components, list of Stakers and Validators. Entry point for Validators creating new Rollup Nodes (state commits) and Challengers submitting fraud proofs.
+++ description: Root hash of the WASM module used for execution, like a fingerprint of the L2 logic. Can be associated with ArbOS versions.
      values.wasmModuleRoot:
-        "0x68e4fe5023f792d4ef584796c84d710303a5e12ea02d6e37e2b5e9c4332507c4"
+        "0x8b104a2e80ac6165dc58b9048de12f301d70b02a0ab51396c22b4b4b802a16a4"
    }
```

```diff
-   Status: DELETED
    contract OneStepProverMemory (0xDf94F0474F205D086dbc2e66D69a856FCf520622)
    +++ description: None
```

```diff
+   Status: CREATED
    contract OneStepProverMemory (0x526a6E634aD36bB0007c4422586c135F1F9B525a)
    +++ description: None
```

```diff
+   Status: CREATED
    contract OneStepProver0 (0x800dA62bE6626127F71B34E795286C34C04D6712)
    +++ description: None
```

```diff
+   Status: CREATED
    contract OneStepProofEntry (0xb20107bfB36D3B5AcA534aCAfbd8857b10b402a8)
    +++ description: None
```

```diff
+   Status: CREATED
    contract OneStepProverHostIo (0xc555b2F1D559Fbb854569b33640990D178F94747)
    +++ description: None
```

```diff
+   Status: CREATED
    contract OneStepProverMath (0xe8709022B9C9D7347856c75910fe07e10C904446)
    +++ description: None
```

## Source code changes

```diff
.../ChallengeManager/ChallengeManager.sol          |   6 +
 .../OneStepProverHostIo.sol                        | 107 +++-
 .../SequencerInbox/SequencerInbox.sol              | 662 ++++++++++++++++-----
 3 files changed, 611 insertions(+), 164 deletions(-)
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 229959335 (main branch discovery), not current.

```diff
    contract SequencerInbox (0x995a9d3ca121D48d21087eDE20bc8acb2398c8B1) {
    +++ description: State batches / commitments get posted here.
      values.dacKeyset.blsSignatures:
+        ["YAaEnUny7I1Stgrqdkdn5ob8omB9Id5dh2xtP87ifNORqK2gdi8NLU9Lw4PAXlg/pwPcmuYrAp8OZOPAw02Z5NOUhTKS+udcc7iSEST/tJ6CI1KeH2jXoToqA5FADD4hrwt7qHtu0RK56+zb3voUzyGnjt838DQH0UZSAMmsEZq8k/KCZPeej6IP03lSQOPxSQAAzbxLd3GZKk0V9tYEF9HCHxHjyJHHN7whXqovNDOE/vcw87RZzBlBeP9fOQ8HKRdEvB70DjshSupH/QeU5Znd034y+4NGiMvaCIkoZGb0/tZxHFc9yxp2Uy2HpaVVDxMmZYLSAsWIdsfkAMHKLmQ2ZtqW8Khd9M/uXOaEqTSu6yjJyizIDyXbA3FUuoW8uQ==","YBnmxAj50xHWx74c8TEJQ4hMxDc8au4r/8ZjDdm9VZZeVz30yudFDkKd5gzt/bnDkxL/fS3uO/uyV5IK/x5g53D7ZBMcrVJF3UMriIitIvf/jriRsnCi1TSZVG+RpGoMNAAji+ipTEVV5YnQPi/AVGQIGwmoEzhA/giQH7evlxzC1Q876MQqHTwwfIrX63UZ5hPEs84OyTq5gHvR71UYbI7TEzHRNi3RJTfgsidx8Q1v2jndA5HfYUq2pxmmPPkIoxHSK+Syt24Fe9q/6dIMN76BXMDpbXu1+r0QdQMPLEfSWm/aquMI6sN1ljaa958XThaluC1z+iqrR9b5e8LoEq1OliZf2qCHnv9MFX51KCF42zEQiz493XQrf0HUJIfCag==","YA1wn7+Q7YfmWm4B63iIDrEzquUCqvuQAXCeq+e5pzVb4AQp2pOUkboz4+GIhKB4rQ77pOEK7RQVDl52V7CYEMtO5koML9h9OOU9o8rQzKCZlN0uuh97hLmn3uClp9i9BBgu5d9ptNNVjuX6CGWNw23GfyxIhx/uYKO+Lngpekmnc/gvNQ7iZmFT3pOd7cnkDwKVYCO0K4AdCiK/n92I4J2ZLN/dPU9cb56BorMRCQ9LWIy4069ZXcZsU+z1RR/KkAb74lp6FvZsqImmkQjoKv03XiuGU6syNkO5lOmX5vLX/+ttSjvWYo5yuNOBEams/A+6Aaqr8AaiVoytLAYidWkn9c4JkPTXh3Vhj//1fiuUD93NfpvZVFxOmNphqqHLaQ==","YAKvb8hRiZPIAext4QCk7ngBMmDVkAcQoAqc/BSXtU7/gUDohCF6RI29uc5OlOXIIhifqDOAe+RIDnUrkMJuXKM3f+21bngw9rgjuSoGfaXfqLffFlR3eIQs0QY0XQeG0RKYArEpJ/D/hOt7YPOddAXGn62x4ryWuyqt5mkyyWzfGrncElFsqT6Ni+hAjwjDOABlbMG6rvSrm6uyznjdL233pYO0DTe8S95wgYOcGLP8xSDHlN341schNnHTQyJAcxddkM3BEocKI7ymH9PNp12Ax5Y5SVZEXKkLFAECOwihaMjjH0brzYxdGbaPEEAgDQQbx8bvW09h5AnTEXPrz6oYWFRep/drK92rK9LtDM8NgnjzMLv+AeSd93X1DmZPpA==","YAuqwKcqcyPp5E3tp9vVoeBVx6gURQyV0XhwNaooWS2k/2VWHtrUuZdDdBiBRMq62Qf6cKtlqn5aGTqIq0jZJRbEcd0dkmlHLcrFJ96+/8FHu4jGabROamNoQxG5xcDpiwHi3WmI1pUaZVumUUXo+P+av0gKxemR2OSyKIOM8ERfQAWzZkDUw+dvo7Ga4PIsIwcyJ9rTjeq4S7fyD6qym9tEK2vOyhAAab7s9qC9TFnGbFkeSI/NY3tOrmhEqee0qwRz7eCR5Uf2sZBpYEGHAHadBFhoGPJCpQyBFu673o4kEWgMMKE7t9S4KR/Dgji2RAsI+xUaz3Wdvwfeoa/SAPdCd4j6PoqTuD/b74KiL9TqHtEQgk//j25bZK2778n5yA==","YAX5RGkb2ssH+fb3F+MTg0p+7jF3Le5BT8W/hIR7iSsgHvN2l435zpiSVuqOZNaIaQ/wyuGPur4m2hoiJ1d0J+r/VvbEYQGFCxPe6oi5JzIuAb/QlRA9lT+B1Rup8HKhcAAnSGaIowju3bSosv0LG04H0NlZOSRdJSFOIBA3WyfiK1867Nju+ZqfWF/TLUvR4AnIz2uNkZ7TzuIiA6mQnDHvpKSKsAUvhhAovG8Y8TI0iC1W/LSX1G9VVqFBeI2k1gDX3vzit2yN2PjskBfh5+N6bsIRSECZPRXBqskekNytvRlFveesFOwpXOmiyRPmFAwaYLtsQtSVjz94Ev5rabPQim7x1y9s6AEtV/Q/ggRU7/lTha1SVmMCRdYWWu3Igg==","YBWhdxIOTQsrGcRQF8bHAEauHwl6F64farjSibsWDNPgplumU8MFRPn6X0jtBBMR1hH/aXso0ftQEI0edQVEB5dJkB4gymdhxq6hFCbYZpxsb8Ipr4lJe05WNmJRX1VeTRIu9WaeVLZlm+RMtvSuzbXXKJyNUnSZ420JaMKyR8Wt9M05nFZ832+eqer4eOtKDBX6gPBzdbUG+WRYdQlvFMkH/Nwo7LyKlHx231VIXKEIeuYXBmMxdtd0++QT7wi7PRN1XLjxGC8osyHYh3rksjBjG6urtgt4b/tVWyNevNaHT5YuO5MBPMMoQFgUqeV6dQiU3v2aXCwnnInTCjEvNbI5PUdwOosJi8JcdY7N1Vpm9jn8Gm89pCdwc8avTGWU5A==","YA+ljLY01rxIncmXWl8bIZduwLObm0LKJIjzdyXjzH5FLN4Y+sUF2zjvF07aUPHOyADiV0y/+ztNO/iTpKLCVUzPzRHTtsukZaE3SUY+IIYU6NvUYdMXfhcKnHH3VU+iVRaSfiK2hw7OCfsge8AQcucdNlgaHSrdvlDmzAIx7jsemsLh8ov5dpywIVkWWZGY6wIwVh2/zUWBMZ4O3V3OYWppRttXZr2ukmwIDU5hQ4qtKRKemHaHSgb18QTuUsowMhkLwx2eW5hMOIYyzLV+NyUTyaQhkD0EtYISRBhHM7RinbP9LQWbLm0dnueZ9O3AkwnbH8w6/h3jkshPZx8hqJ6QH33SwbML1KIvOTEFvgBs7dnj9gbcfMq+17Bu3/YkWw==","YBHz50DGYvPi02ynzcvcJS9K2nhXWKKSIZdDtXqxxoD3a1s2Fh2he79bMUWZ6M6qEhHM52HZr3l5jLoU4kOTBN+Q87yo0ljgZJYaphdYrHb+jabsPUcR+xdauJKAoKSkjQz8BWC9b2QZ3F7LK+Ro3cpWgkHR9SQlt86mk+eM71AWRl3ybwlRaxwAzYwOd9TRkQYARTY8fjvRmhChCY5lz7FtY0ttPrbJ3Mc2VXy5r0yyIoNFAQjg/jMNoablUOOIZRn+4KGLBQSPKcnl/Nv/0ZNdT563sLPj6mP3qLPlvwAhFpI5vIhSpGdpgJ8n8Ns3uxJyYsPD8qaHQciNLNTzYWGEze40CPMkxEeGRqi8yRoK8iuK5kse/+kqhBOyR3NVJg=="]
    }
```

Generated with discovered.json: 0x9d1531a8a871919c7817c0327741c8f8d189e2b5

# Diff at Wed, 21 Aug 2024 10:07:48 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@2f6dde3357bf5d79196b6e94f79d853a6c4ec72b block: 229959335
- current block number: 229959335

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 229959335 (main branch discovery), not current.

```diff
    contract ProxyAdmin (0x041F85dD87c46B941dc9b15c6628B19ee5358485) {
    +++ description: None
      assignedPermissions:
-        {"upgrade":["0x0EE7AD3Cc291343C9952fFd8844e86d294fa513F","0x1E400568AD4840dbE50FB32f306B842e9ddeF726","0x22CCA5Dc96a4Ac1EC32c9c7C5ad4D66254a24C35","0x36aDe24988E4C47602e38BD9a0Bd89031eF807a8","0x3a3f62034a42a35eA1686B199bB73006aa525eE4","0x7dd8A76bdAeBE3BBBaCD7Aa87f1D4FDa1E60f94f","0x995a9d3ca121D48d21087eDE20bc8acb2398c8B1","0xaE21fDA3de92dE2FDAF606233b2863782Ba046F9","0xb591cE747CF19cF30e11d656EB94134F523A9e77"]}
      receivedPermissions:
+        [{"permission":"upgrade","target":"0x0EE7AD3Cc291343C9952fFd8844e86d294fa513F","via":[]},{"permission":"upgrade","target":"0x1E400568AD4840dbE50FB32f306B842e9ddeF726","via":[]},{"permission":"upgrade","target":"0x22CCA5Dc96a4Ac1EC32c9c7C5ad4D66254a24C35","via":[]},{"permission":"upgrade","target":"0x36aDe24988E4C47602e38BD9a0Bd89031eF807a8","via":[]},{"permission":"upgrade","target":"0x3a3f62034a42a35eA1686B199bB73006aa525eE4","via":[]},{"permission":"upgrade","target":"0x7dd8A76bdAeBE3BBBaCD7Aa87f1D4FDa1E60f94f","via":[]},{"permission":"upgrade","target":"0x995a9d3ca121D48d21087eDE20bc8acb2398c8B1","via":[]},{"permission":"upgrade","target":"0xaE21fDA3de92dE2FDAF606233b2863782Ba046F9","via":[]},{"permission":"upgrade","target":"0xb591cE747CF19cF30e11d656EB94134F523A9e77","via":[]}]
    }
```

```diff
    contract UpgradeExecutor (0x0EE7AD3Cc291343C9952fFd8844e86d294fa513F) {
    +++ description: None
      assignedPermissions:
-        {"upgrade":["0xC47DacFbAa80Bd9D8112F4e8069482c2A3221336"]}
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x041F85dD87c46B941dc9b15c6628B19ee5358485","via":[]}]
      receivedPermissions:
+        [{"permission":"upgrade","target":"0xC47DacFbAa80Bd9D8112F4e8069482c2A3221336","via":[]}]
    }
```

```diff
    contract Outbox (0x1E400568AD4840dbE50FB32f306B842e9ddeF726) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x041F85dD87c46B941dc9b15c6628B19ee5358485","via":[]}]
    }
```

```diff
    contract L1GatewayRouter (0x22CCA5Dc96a4Ac1EC32c9c7C5ad4D66254a24C35) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x041F85dD87c46B941dc9b15c6628B19ee5358485","via":[]}]
    }
```

```diff
    contract ERC20RollupEventInbox (0x36aDe24988E4C47602e38BD9a0Bd89031eF807a8) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x041F85dD87c46B941dc9b15c6628B19ee5358485","via":[]}]
    }
```

```diff
    contract ChallengeManager (0x3a3f62034a42a35eA1686B199bB73006aa525eE4) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x041F85dD87c46B941dc9b15c6628B19ee5358485","via":[]}]
    }
```

```diff
    contract PoolProxyDeployer (0x68D78D1E81379EfD9C61f8E9131D52CE571AF4fD) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0xD88c8E0aE21beA6adE41A41130Bb4cd43e6b1723","via":[]}]
    }
```

```diff
    contract Bridge (0x7dd8A76bdAeBE3BBBaCD7Aa87f1D4FDa1E60f94f) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x041F85dD87c46B941dc9b15c6628B19ee5358485","via":[]}]
    }
```

```diff
    contract GasSubsidy (0x94F4aBC83eae00b693286B6eDCa09e1D76183C97) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0xD88c8E0aE21beA6adE41A41130Bb4cd43e6b1723","via":[]}]
    }
```

```diff
    contract SequencerInbox (0x995a9d3ca121D48d21087eDE20bc8acb2398c8B1) {
    +++ description: State batches / commitments get posted here.
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x041F85dD87c46B941dc9b15c6628B19ee5358485","via":[]}]
    }
```

```diff
    contract Inbox (0xaE21fDA3de92dE2FDAF606233b2863782Ba046F9) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x041F85dD87c46B941dc9b15c6628B19ee5358485","via":[]}]
    }
```

```diff
    contract L1ERC20Gateway (0xb591cE747CF19cF30e11d656EB94134F523A9e77) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x041F85dD87c46B941dc9b15c6628B19ee5358485","via":[]}]
    }
```

```diff
    contract NodeLicenseRegistry (0xbc14d8563b248B79689ECbc43bBa53290e0b6b66) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0xD88c8E0aE21beA6adE41A41130Bb4cd43e6b1723","via":[]}]
    }
```

```diff
    contract RollupProxy (0xC47DacFbAa80Bd9D8112F4e8069482c2A3221336) {
    +++ description: Manages rollup components, list of Stakers and Validators. Entry point for Validators creating new Rollup Nodes (state commits) and Challengers submitting fraud proofs.
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x0EE7AD3Cc291343C9952fFd8844e86d294fa513F","via":[]}]
    }
```

```diff
    contract StakingProxyAdmin (0xD88c8E0aE21beA6adE41A41130Bb4cd43e6b1723) {
    +++ description: None
      assignedPermissions:
-        {"upgrade":["0x68D78D1E81379EfD9C61f8E9131D52CE571AF4fD","0x94F4aBC83eae00b693286B6eDCa09e1D76183C97","0xF9E08660223E2dbb1c0b28c82942aB6B5E38b8E5","0xbc14d8563b248B79689ECbc43bBa53290e0b6b66","0xfD41041180571C5D371BEA3D9550E55653671198"]}
      receivedPermissions:
+        [{"permission":"upgrade","target":"0x68D78D1E81379EfD9C61f8E9131D52CE571AF4fD","via":[]},{"permission":"upgrade","target":"0x94F4aBC83eae00b693286B6eDCa09e1D76183C97","via":[]},{"permission":"upgrade","target":"0xbc14d8563b248B79689ECbc43bBa53290e0b6b66","via":[]},{"permission":"upgrade","target":"0xF9E08660223E2dbb1c0b28c82942aB6B5E38b8E5","via":[]},{"permission":"upgrade","target":"0xfD41041180571C5D371BEA3D9550E55653671198","via":[]}]
    }
```

```diff
    contract PoolFactory (0xF9E08660223E2dbb1c0b28c82942aB6B5E38b8E5) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0xD88c8E0aE21beA6adE41A41130Bb4cd43e6b1723","via":[]}]
    }
```

```diff
    contract SentryReferee (0xfD41041180571C5D371BEA3D9550E55653671198) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0xD88c8E0aE21beA6adE41A41130Bb4cd43e6b1723","via":[]}]
    }
```

Generated with discovered.json: 0x7b8a6757d6c48e41e20a5e5c0634962f35462ee9

# Diff at Fri, 09 Aug 2024 12:03:55 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@bf40aa32f030fd312056ca0ef198c8550467d1d7 block: 229959335
- current block number: 229959335

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 229959335 (main branch discovery), not current.

```diff
    contract ProxyAdmin (0x041F85dD87c46B941dc9b15c6628B19ee5358485) {
    +++ description: None
      assignedPermissions.upgrade.8:
-        "0x3a3f62034a42a35eA1686B199bB73006aa525eE4"
+        "0xb591cE747CF19cF30e11d656EB94134F523A9e77"
      assignedPermissions.upgrade.7:
-        "0x1E400568AD4840dbE50FB32f306B842e9ddeF726"
+        "0xaE21fDA3de92dE2FDAF606233b2863782Ba046F9"
      assignedPermissions.upgrade.6:
-        "0x36aDe24988E4C47602e38BD9a0Bd89031eF807a8"
+        "0x995a9d3ca121D48d21087eDE20bc8acb2398c8B1"
      assignedPermissions.upgrade.5:
-        "0x0EE7AD3Cc291343C9952fFd8844e86d294fa513F"
+        "0x7dd8A76bdAeBE3BBBaCD7Aa87f1D4FDa1E60f94f"
      assignedPermissions.upgrade.4:
-        "0x995a9d3ca121D48d21087eDE20bc8acb2398c8B1"
+        "0x3a3f62034a42a35eA1686B199bB73006aa525eE4"
      assignedPermissions.upgrade.3:
-        "0x22CCA5Dc96a4Ac1EC32c9c7C5ad4D66254a24C35"
+        "0x36aDe24988E4C47602e38BD9a0Bd89031eF807a8"
      assignedPermissions.upgrade.2:
-        "0x7dd8A76bdAeBE3BBBaCD7Aa87f1D4FDa1E60f94f"
+        "0x22CCA5Dc96a4Ac1EC32c9c7C5ad4D66254a24C35"
      assignedPermissions.upgrade.1:
-        "0xb591cE747CF19cF30e11d656EB94134F523A9e77"
+        "0x1E400568AD4840dbE50FB32f306B842e9ddeF726"
      assignedPermissions.upgrade.0:
-        "0xaE21fDA3de92dE2FDAF606233b2863782Ba046F9"
+        "0x0EE7AD3Cc291343C9952fFd8844e86d294fa513F"
    }
```

```diff
    contract StakingProxyAdmin (0xD88c8E0aE21beA6adE41A41130Bb4cd43e6b1723) {
    +++ description: None
      assignedPermissions.upgrade.4:
-        "0x94F4aBC83eae00b693286B6eDCa09e1D76183C97"
+        "0xfD41041180571C5D371BEA3D9550E55653671198"
      assignedPermissions.upgrade.3:
-        "0xfD41041180571C5D371BEA3D9550E55653671198"
+        "0xbc14d8563b248B79689ECbc43bBa53290e0b6b66"
      assignedPermissions.upgrade.2:
-        "0x68D78D1E81379EfD9C61f8E9131D52CE571AF4fD"
+        "0xF9E08660223E2dbb1c0b28c82942aB6B5E38b8E5"
      assignedPermissions.upgrade.1:
-        "0xbc14d8563b248B79689ECbc43bBa53290e0b6b66"
+        "0x94F4aBC83eae00b693286B6eDCa09e1D76183C97"
      assignedPermissions.upgrade.0:
-        "0xF9E08660223E2dbb1c0b28c82942aB6B5E38b8E5"
+        "0x68D78D1E81379EfD9C61f8E9131D52CE571AF4fD"
    }
```

Generated with discovered.json: 0xb6fb732543d7b6e7dcfc257cff9ad3be60d75b34

# Diff at Fri, 09 Aug 2024 10:13:55 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@1f0da1d0aab7bc6b3b5e54e7e93480bd98e57035 block: 229959335
- current block number: 229959335

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 229959335 (main branch discovery), not current.

```diff
    contract GnosisSafeAdminMember (0x000d8C5A70B8805DF02f409F2715d05B9A63E871) {
    +++ description: None
      values.$multisigThreshold:
-        "1 of 3 (33%)"
      values.getOwners:
-        ["0xc7185e37A4aB4Af0E77bC08249CD2590AE3E1b51","0x2B95cdD1adD34461Fe737800c0D5A68d556B51b4","0x7f910C718bAF6698FBF9b56e047ECd52d157bAD6"]
      values.getThreshold:
-        1
      values.$members:
+        ["0xc7185e37A4aB4Af0E77bC08249CD2590AE3E1b51","0x2B95cdD1adD34461Fe737800c0D5A68d556B51b4","0x7f910C718bAF6698FBF9b56e047ECd52d157bAD6"]
      values.$threshold:
+        1
      values.multisigThreshold:
+        "1 of 3 (33%)"
    }
```

```diff
    contract ProxyAdmin (0x041F85dD87c46B941dc9b15c6628B19ee5358485) {
    +++ description: None
      assignedPermissions.admin:
-        ["0x0EE7AD3Cc291343C9952fFd8844e86d294fa513F","0x1E400568AD4840dbE50FB32f306B842e9ddeF726","0x22CCA5Dc96a4Ac1EC32c9c7C5ad4D66254a24C35","0x36aDe24988E4C47602e38BD9a0Bd89031eF807a8","0x3a3f62034a42a35eA1686B199bB73006aa525eE4","0x7dd8A76bdAeBE3BBBaCD7Aa87f1D4FDa1E60f94f","0x995a9d3ca121D48d21087eDE20bc8acb2398c8B1","0xaE21fDA3de92dE2FDAF606233b2863782Ba046F9","0xb591cE747CF19cF30e11d656EB94134F523A9e77"]
      assignedPermissions.upgrade:
+        ["0xaE21fDA3de92dE2FDAF606233b2863782Ba046F9","0xb591cE747CF19cF30e11d656EB94134F523A9e77","0x7dd8A76bdAeBE3BBBaCD7Aa87f1D4FDa1E60f94f","0x22CCA5Dc96a4Ac1EC32c9c7C5ad4D66254a24C35","0x995a9d3ca121D48d21087eDE20bc8acb2398c8B1","0x0EE7AD3Cc291343C9952fFd8844e86d294fa513F","0x36aDe24988E4C47602e38BD9a0Bd89031eF807a8","0x1E400568AD4840dbE50FB32f306B842e9ddeF726","0x3a3f62034a42a35eA1686B199bB73006aa525eE4"]
    }
```

```diff
    contract UpgradeExecutor (0x0EE7AD3Cc291343C9952fFd8844e86d294fa513F) {
    +++ description: None
      assignedPermissions.admin:
-        ["0xC47DacFbAa80Bd9D8112F4e8069482c2A3221336"]
      assignedPermissions.upgrade:
+        ["0xC47DacFbAa80Bd9D8112F4e8069482c2A3221336"]
    }
```

```diff
    contract ExecutorMultisig (0x4972A8EF186Ee42A14Cdd3c47f52ec06a6dc495E) {
    +++ description: None
      values.$multisigThreshold:
-        "3 of 5 (60%)"
      values.getOwners:
-        ["0x000d8C5A70B8805DF02f409F2715d05B9A63E871","0xa2E7768789921a36eCFe8c239dBd8213120fFF83","0xD766Abf27CEc67393FF475f7fE969902f5D0A80A","0x08a361fE449b1371cC21b286d88F69eF6d205809","0xd4318D959B46d555143f56E03077028aB94D85d2"]
      values.getThreshold:
-        3
      values.$members:
+        ["0x000d8C5A70B8805DF02f409F2715d05B9A63E871","0xa2E7768789921a36eCFe8c239dBd8213120fFF83","0xD766Abf27CEc67393FF475f7fE969902f5D0A80A","0x08a361fE449b1371cC21b286d88F69eF6d205809","0xd4318D959B46d555143f56E03077028aB94D85d2"]
      values.$threshold:
+        3
      values.multisigThreshold:
+        "3 of 5 (60%)"
    }
```

```diff
    contract StakingProxyAdmin (0xD88c8E0aE21beA6adE41A41130Bb4cd43e6b1723) {
    +++ description: None
      assignedPermissions.admin:
-        ["0x68D78D1E81379EfD9C61f8E9131D52CE571AF4fD","0x94F4aBC83eae00b693286B6eDCa09e1D76183C97","0xF9E08660223E2dbb1c0b28c82942aB6B5E38b8E5","0xbc14d8563b248B79689ECbc43bBa53290e0b6b66","0xfD41041180571C5D371BEA3D9550E55653671198"]
      assignedPermissions.upgrade:
+        ["0xF9E08660223E2dbb1c0b28c82942aB6B5E38b8E5","0xbc14d8563b248B79689ECbc43bBa53290e0b6b66","0x68D78D1E81379EfD9C61f8E9131D52CE571AF4fD","0xfD41041180571C5D371BEA3D9550E55653671198","0x94F4aBC83eae00b693286B6eDCa09e1D76183C97"]
    }
```

```diff
    contract FundsReiceiverMultisig (0xFCF7248C495d6fd3641eE43F861c48Ebe402c878) {
    +++ description: The designated fundsReceiver in the NodeLicenseRegistry. Receives all ETH from 'Sentry Node License' mints.
      values.$multisigThreshold:
-        "3 of 7 (43%)"
      values.getOwners:
-        ["0x90D77E3a3B660E54E04cD622937765d2375FB2e3","0xd427165292B2E39cdac102eD963B14fFBACc964a","0x1f097F3f928415cD28e1B2cC6f0F3960f4fCa6fc","0xbBE90F6748C82623F130A4486722a436c5a72440","0xE529a3271f9CC84B1FE9107ab4764a8dF177782a","0x807daF80b03Fd3C2709FFe0AeBEED617BC0a347c","0xfc6F0d26f817Bd31AeD0e8922575d1fb8bD7A894"]
      values.getThreshold:
-        3
      values.$members:
+        ["0x90D77E3a3B660E54E04cD622937765d2375FB2e3","0xd427165292B2E39cdac102eD963B14fFBACc964a","0x1f097F3f928415cD28e1B2cC6f0F3960f4fCa6fc","0xbBE90F6748C82623F130A4486722a436c5a72440","0xE529a3271f9CC84B1FE9107ab4764a8dF177782a","0x807daF80b03Fd3C2709FFe0AeBEED617BC0a347c","0xfc6F0d26f817Bd31AeD0e8922575d1fb8bD7A894"]
      values.$threshold:
+        3
      values.multisigThreshold:
+        "3 of 7 (43%)"
    }
```

Generated with discovered.json: 0x8432578b74785d5e1b27a30cb7a961436824e845

# Diff at Tue, 30 Jul 2024 11:17:30 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@b2b6471ff62871f4956541f42ec025c356c08f7e block: 229959335
- current block number: 229959335

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 229959335 (main branch discovery), not current.

```diff
    contract SequencerInbox (0x995a9d3ca121D48d21087eDE20bc8acb2398c8B1) {
    +++ description: State batches / commitments get posted here.
      fieldMeta:
+        {"maxTimeVariation":{"description":"Struct: delayBlocks, futureBlocks, delaySeconds, futureSeconds. onlyRollupOwner settable. Transactions can only be force-included after `delayBlocks` window (Sequencer-only) has passed."}}
    }
```

```diff
    contract RollupProxy (0xC47DacFbAa80Bd9D8112F4e8069482c2A3221336) {
    +++ description: Manages rollup components, list of Stakers and Validators. Entry point for Validators creating new Rollup Nodes (state commits) and Challengers submitting fraud proofs.
      fieldMeta:
+        {"confirmPeriodBlocks":{"description":"Challenge period. (Number of blocks until a node is confirmed)."},"wasmModuleRoot":{"description":"Root hash of the WASM module used for execution, like a fingerprint of the L2 logic. Can be associated with ArbOS versions."}}
    }
```

Generated with discovered.json: 0x8eda29eca3bc19f576e3d50691f3d1342fb0b5bb

# Diff at Mon, 08 Jul 2024 06:15:46 GMT:

- author: sekuba (<sekuba@users.noreply.github.com>)
- comparing to: main@e192ffbc9e265fdc44012a487bab5f0859ffe881 block: 228630604
- current block number: 229959335

## Description

Xai's dacKeyset is hardened with 8/9 threshold.

## Watched changes

```diff
    contract SequencerInbox (0x995a9d3ca121D48d21087eDE20bc8acb2398c8B1) {
    +++ description: State batches / commitments get posted here.
      values.dacKeyset.requiredSignatures:
-        5
+        8
      values.dacKeyset.membersCount:
-        6
+        9
      values.keySetUpdates:
-        4
+        5
    }
```

Generated with discovered.json: 0x04c6637b971b5f8ed7b913205d28eff08ed758d0

# Diff at Thu, 04 Jul 2024 09:41:56 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@5e880b32f603c98cd7ec9cadedc3a383e26a650a block: 225981844
- current block number: 228630604

## Description

Add one new signer to the FundsReceiver multisig.

## Watched changes

```diff
    contract FundsReiceiverMultisig (0xFCF7248C495d6fd3641eE43F861c48Ebe402c878) {
    +++ description: The designated fundsReceiver in the NodeLicenseRegistry. Receives all ETH from 'Sentry Node License' mints.
      upgradeability.threshold:
-        "3 of 6 (50%)"
+        "3 of 7 (43%)"
      values.getOwners.6:
+        "0xfc6F0d26f817Bd31AeD0e8922575d1fb8bD7A894"
      values.getOwners.5:
-        "0xfc6F0d26f817Bd31AeD0e8922575d1fb8bD7A894"
+        "0x807daF80b03Fd3C2709FFe0AeBEED617BC0a347c"
      values.getOwners.4:
-        "0x807daF80b03Fd3C2709FFe0AeBEED617BC0a347c"
+        "0xE529a3271f9CC84B1FE9107ab4764a8dF177782a"
      values.getOwners.3:
-        "0xE529a3271f9CC84B1FE9107ab4764a8dF177782a"
+        "0xbBE90F6748C82623F130A4486722a436c5a72440"
      values.getOwners.2:
-        "0xbBE90F6748C82623F130A4486722a436c5a72440"
+        "0x1f097F3f928415cD28e1B2cC6f0F3960f4fCa6fc"
      values.getOwners.1:
-        "0x1f097F3f928415cD28e1B2cC6f0F3960f4fCa6fc"
+        "0xd427165292B2E39cdac102eD963B14fFBACc964a"
      values.getOwners.0:
-        "0xd427165292B2E39cdac102eD963B14fFBACc964a"
+        "0x90D77E3a3B660E54E04cD622937765d2375FB2e3"
    }
```

Generated with discovered.json: 0x3d98a55a46dfb2c1aea08baba4d876d06a769918

# Diff at Fri, 21 Jun 2024 07:41:42 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@1ba6434de248c46d9e6b140264866a3072082af4 block: 220738640
- current block number: 224114463

## Description

Ignore token/nft related values from NodeLicenseRegistry.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 220738640 (main branch discovery), not current.

```diff
    contract NodeLicenseRegistry (0xbc14d8563b248B79689ECbc43bBa53290e0b6b66) {
    +++ description: None
      values.getApproved:
-        []
      values.getAverageCost:
-        []
      values.getMintTimestamp:
-        []
      values.ownerOf:
-        []
      values.tokenURI:
-        []
    }
```

Generated with discovered.json: 0x385764a3dd28cad9e8c9e780ace3e871e4504fcb

# Diff at Tue, 11 Jun 2024 13:13:52 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@4b482f34b787e8546115b599d38d66643fc47a24 block: 220354113
- current block number: 220738640

## Description

Provide description of changes. This section will be preserved.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 220354113 (main branch discovery), not current.

```diff
    contract SequencerInbox (0x995a9d3ca121D48d21087eDE20bc8acb2398c8B1) {
    +++ description: State batches / commitments get posted here.
+++ description: Struct: delayBlocks, futureBlocks, delaySeconds, futureSeconds. onlyRollupOwner settable. Transactions can only be force-included after `delayBlocks` window (Sequencer-only) has passed.
      values.maxTimeVariation:
-        [5760,96,86400,3600]
+        {"delayBlocks":5760,"futureBlocks":96,"delaySeconds":86400,"futureSeconds":3600}
    }
```

Generated with discovered.json: 0x4a7364665d9e06f245594622bb335fbbb164c684

# Diff at Mon, 10 Jun 2024 10:27:14 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@a695176fbb0fada448fda5610aee2cfe2ad4bb92 block: 215638135
- current block number: 220354113

## Description

The fundsreceiver multisig that currently holds USD 3M in ETH from Sentry Node License mints, has a new signer.
The SentryReferee contract is upgraded to identical code with new initial parameters for staking and esXai emissions.

## Watched changes

```diff
    contract FundsReiceiverMultisig (0xFCF7248C495d6fd3641eE43F861c48Ebe402c878) {
    +++ description: The designated fundsReceiver in the NodeLicenseRegistry. Receives all ETH from 'Sentry Node License' mints.
      upgradeability.threshold:
-        "3 of 5 (60%)"
+        "3 of 6 (50%)"
      values.getOwners.5:
+        "0xfc6F0d26f817Bd31AeD0e8922575d1fb8bD7A894"
      values.getOwners.4:
-        "0xa2E7768789921a36eCFe8c239dBd8213120fFF83"
+        "0x807daF80b03Fd3C2709FFe0AeBEED617BC0a347c"
      values.getOwners.3:
-        "0x807daF80b03Fd3C2709FFe0AeBEED617BC0a347c"
+        "0xE529a3271f9CC84B1FE9107ab4764a8dF177782a"
      values.getOwners.2:
-        "0xE529a3271f9CC84B1FE9107ab4764a8dF177782a"
+        "0xbBE90F6748C82623F130A4486722a436c5a72440"
      values.getOwners.1:
-        "0xbBE90F6748C82623F130A4486722a436c5a72440"
+        "0x1f097F3f928415cD28e1B2cC6f0F3960f4fCa6fc"
      values.getOwners.0:
-        "0x1f097F3f928415cD28e1B2cC6f0F3960f4fCa6fc"
+        "0xd427165292B2E39cdac102eD963B14fFBACc964a"
    }
```

```diff
    contract SentryReferee (0xfD41041180571C5D371BEA3D9550E55653671198) {
    +++ description: None
      upgradeability.implementation:
-        "0xFf38Aa9D553bE47eee329F968ADF0C74A01D021c"
+        "0x609152cb742916E0F7FBC4391Be750C458b049fe"
      implementations.0:
-        "0xFf38Aa9D553bE47eee329F968ADF0C74A01D021c"
+        "0x609152cb742916E0F7FBC4391Be750C458b049fe"
      values.maxKeysPerPool:
-        750
+        1000
      values.maxStakeAmountPerLicense:
-        "10000000000000000000000"
+        "20000000000000000000000"
      values.stakeAmountBoostFactors.3:
-        600
+        700
      values.stakeAmountTierThresholds.3:
-        "5500000000000000000000000"
+        "8000000000000000000000000"
      values.stakeAmountTierThresholds.2:
-        "500000000000000000000000"
+        "4000000000000000000000000"
      values.stakeAmountTierThresholds.1:
-        "100000000000000000000000"
+        "2000000000000000000000000"
      values.stakeAmountTierThresholds.0:
-        "10000000000000000000000"
+        "30000000000000000000000"
      derivedName:
-        "Referee7"
+        "Referee8"
    }
```

## Source code changes

```diff
.../Referee7.sol => .flat/SentryReferee/Referee8.sol}   | 17 ++++++++++++++++-
 1 file changed, 16 insertions(+), 1 deletion(-)
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 215638135 (main branch discovery), not current.

```diff
    contract GnosisSafeL2 (0xFCF7248C495d6fd3641eE43F861c48Ebe402c878) {
    +++ description: None
      name:
-        "GnosisSafeL2"
+        "FundsReiceiverMultisig"
    }
```

Generated with discovered.json: 0x264bd861a65349ee79e7d213b146fb2d90f6005d

# Diff at Mon, 27 May 2024 17:44:30 GMT:

- author: sekuba (<sekuba@users.noreply.github.com>)
- comparing to: main@dbc274621a752b9a0e3943e430166c617d1edd06 block: 213468283
- current block number: 215638135

## Description

Updated the SequencerInbox template, no onchain changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 213468283 (main branch discovery), not current.

```diff
    contract SequencerInbox (0x995a9d3ca121D48d21087eDE20bc8acb2398c8B1) {
    +++ description: State batches / commitments get posted here.
      values.IS_HARDCODED_SEQUENCER_BATCH_POSTER:
-        false
    }
```

Generated with discovered.json: 0x848bbae5e04966290420d336f30aabdbbe60a00e

# Diff at Fri, 17 May 2024 08:40:54 GMT:

- author: sekuba (<sekuba@users.noreply.github.com>)
- comparing to: main@cf6498d339a075296e717008e17a69561c236726 block: 211899322
- current block number: 212134037

## Description

Minor changes in the SentryReferee contract:
- Expire challenge rewards after 270 instead of 180 days
- 'stakeAmountTierThresholds[]' values deleted from initializer, but can be set anytime by admin with updateStakingTier()

## Watched changes

```diff
    contract SentryReferee (0xfD41041180571C5D371BEA3D9550E55653671198) {
    +++ description: None
      upgradeability.implementation:
-        "0x680F4a9f47E4Cfea124a5654E759cB3b0a0C837c"
+        "0xFf38Aa9D553bE47eee329F968ADF0C74A01D021c"
      implementations.0:
-        "0x680F4a9f47E4Cfea124a5654E759cB3b0a0C837c"
+        "0xFf38Aa9D553bE47eee329F968ADF0C74A01D021c"
      derivedName:
-        "Referee6"
+        "Referee7"
    }
```

## Source code changes

```diff
.../SentryReferee/Referee7.sol}                    | 53 +++++++++-------------
 1 file changed, 21 insertions(+), 32 deletions(-)
```

Generated with discovered.json: 0x897a47e36aae203ad1b76427051d8c24b7bc8dfe

# Diff at Fri, 26 Apr 2024 14:19:34 GMT:

- author: sekuba (<sekuba@users.noreply.githum.com>)
- comparing to: main@03ab04b156e445d49b5b266d48c3382aeac8d1ab block: 198866013
- current block number: 205037041

## Description

### Staking Pools upgrade

This implementation uprade adds support for esXAI staking pools and removes the support for adding to normal staking (Withdrawals and rewards from normal staking remain enabled). Since staking V2 is still disabled and some contracts are still managed by the deployer, a new assessment of admin roles is necessary as soon as staking V2 is enabled.
edit: Staking pools are active now and the [Xai Deployer EOA](https://arbiscan.io/address/0x7C94E07bbf73518B0E25D1Be200a5b58F46F9dC7) is admin (via owner or ProxyAdmin) of all the staking-related contracts.

#### Referee5

The SentryReferee has a new implementation: Referee5.
This contract has no external `stake()` function so non-pooled (V1) staking is not possible anymore. The new staking entry contract is now `PoolFactory`, which calls the new `onlyPoolFactory`-modified functions inside Referee5. Unstaking of V1 non-pool staked esXAI is still possible with the external `unstake()` function in Referee5.

Referee5 now supports batching of assertions `submitMultipleAssertions()` and rewards `claimMultipleRewards()`.

New mappings are added to assist the assigning of (staking/kyc)-keys to pools, as the number of keys associated with a pool determines the maximum of esXAI that can be staked inside.

#### PoolFactory

The new staking pools get created here (`createPool()`). Pool creators need at least one staking key to create a pool and are able to define a delegate owner address that can post assertions (node duties) on their behalf. The PoolFactory has plenty of pool managing functions (staking/unstaking keys, updating metadata, managing shares), available to the pool creator. 'Shares' of a pool can be allocated by the pool creator within defined bounds to 3 different recipients: 1) The pool creator / owner, 2) Owners of keys staked in the pool, 3) Stakers of esXAI in the pool. This will direct the esXAI rewards to the different recipients. Claiming of rewards is delegated to the pools themselves.

#### StakingPool

Each staking pool is managed in such a contract.

#### BucketTracker

Imported by the StakingPools: Tracks the virtual balances of participants in a staking pool. (Needed for calculation and distribution of dividends)

## Watched changes

```diff
+   Status: CREATED
    contract BucketTracker (0x1582e73D95F33E39B421F9224D9e7daF4508408E)
    +++ description: None
```

```diff
+   Status: CREATED
    contract StakingPool (0x599C8489256Fb17b66d499d907F30b8022a29443)
    +++ description: None
```

```diff
+   Status: CREATED
    contract PoolBeacon (0x5f9D168d3435747335b1B3dC7e4d42e3510087C7)
    +++ description: None
```

```diff
+   Status: CREATED
    contract PoolProxyDeployer (0x68D78D1E81379EfD9C61f8E9131D52CE571AF4fD)
    +++ description: None
```

```diff
+   Status: CREATED
    contract PoolBeacon (0x6Bc4e6B2c13Ba42e933b23AFAb8a58bbbBa5D02B)
    +++ description: None
```

```diff
+   Status: CREATED
    contract GasSubsidy (0x94F4aBC83eae00b693286B6eDCa09e1D76183C97)
    +++ description: None
```

```diff
+   Status: CREATED
    contract BucketTracker (0xa83825Dc4D94513d1C907b319EE8224FA63A29B2)
    +++ description: None
```

```diff
+   Status: CREATED
    contract NodeLicenseRegistry (0xbc14d8563b248B79689ECbc43bBa53290e0b6b66)
    +++ description: None
```

```diff
+   Status: CREATED
    contract StakingProxyAdmin (0xD88c8E0aE21beA6adE41A41130Bb4cd43e6b1723)
    +++ description: None
```

```diff
+   Status: CREATED
    contract PoolFactory (0xF9E08660223E2dbb1c0b28c82942aB6B5E38b8E5)
    +++ description: None
```

```diff
+   Status: CREATED
    contract PoolBeacon (0xfB93c2e5E41BD0ffd2E99A88e6d2A8D4F542d39a)
    +++ description: None
```

```diff
+   Status: CREATED
    contract GnosisSafeL2 (0xFCF7248C495d6fd3641eE43F861c48Ebe402c878)
    +++ description: None
```

```diff
+   Status: CREATED
    contract SentryReferee (0xfD41041180571C5D371BEA3D9550E55653671198)
    +++ description: None
```

## Source code changes

```diff
.../access/AccessControlUpgradeable.sol            |  261 +++++
 .../access/IAccessControlUpgradeable.sol           |   88 ++
 .../proxy/utils/Initializable.sol                  |  166 ++++
 .../utils/AddressUpgradeable.sol                   |  244 +++++
 .../utils/ContextUpgradeable.sol                   |   37 +
 .../utils/StringsUpgradeable.sol                   |   85 ++
 .../utils/introspection/ERC165Upgradeable.sol      |   42 +
 .../utils/introspection/IERC165Upgradeable.sol     |   25 +
 .../utils/math/MathUpgradeable.sol                 |  339 +++++++
 .../utils/math/SignedMathUpgradeable.sol           |   43 +
 .../utils/structs/EnumerableSetUpgradeable.sol     |  378 ++++++++
 .../contracts/staking-v2/BucketTracker.sol         |  321 +++++++
 .../meta.txt                                       |    2 +
 .../access/AccessControlUpgradeable.sol            |  261 +++++
 .../access/IAccessControlUpgradeable.sol           |   88 ++
 .../proxy/utils/Initializable.sol                  |  166 ++++
 .../utils/AddressUpgradeable.sol                   |  244 +++++
 .../utils/ContextUpgradeable.sol                   |   37 +
 .../utils/StringsUpgradeable.sol                   |   85 ++
 .../utils/introspection/ERC165Upgradeable.sol      |   42 +
 .../utils/introspection/IERC165Upgradeable.sol     |   25 +
 .../utils/math/MathUpgradeable.sol                 |  339 +++++++
 .../utils/math/SignedMathUpgradeable.sol           |   43 +
 .../utils/structs/EnumerableSetUpgradeable.sol     |  378 ++++++++
 .../contracts/staking-v2/BucketTracker.sol         |  321 +++++++
 .../meta.txt                                       |    2 +
 .../access/AccessControlUpgradeable.sol            |  261 +++++
 .../access/IAccessControlUpgradeable.sol           |   88 ++
 .../proxy/utils/Initializable.sol                  |  166 ++++
 .../token/ERC20/IERC20Upgradeable.sol              |   78 ++
 .../utils/AddressUpgradeable.sol                   |  244 +++++
 .../utils/ContextUpgradeable.sol                   |   37 +
 .../utils/StringsUpgradeable.sol                   |   85 ++
 .../utils/introspection/ERC165Upgradeable.sol      |   42 +
 .../utils/introspection/IERC165Upgradeable.sol     |   25 +
 .../utils/math/MathUpgradeable.sol                 |  339 +++++++
 .../utils/math/SignedMathUpgradeable.sol           |   43 +
 .../implementation/contracts/GasSubsidy.sol        |   38 +
 .../.code/GasSubsidy/implementation/meta.txt       |    2 +
 .../@openzeppelin/contracts/access/Ownable.sol     |   83 ++
 .../contracts/interfaces/IERC1967.sol              |   26 +
 .../contracts/interfaces/draft-IERC1822.sol        |   20 +
 .../contracts/proxy/ERC1967/ERC1967Proxy.sol       |   32 +
 .../contracts/proxy/ERC1967/ERC1967Upgrade.sol     |  171 ++++
 .../proxy/@openzeppelin/contracts/proxy/Proxy.sol  |   86 ++
 .../contracts/proxy/beacon/BeaconProxy.sol         |   61 ++
 .../contracts/proxy/beacon/IBeacon.sol             |   16 +
 .../contracts/proxy/beacon/UpgradeableBeacon.sol   |   65 ++
 .../contracts/proxy/transparent/ProxyAdmin.sol     |   81 ++
 .../transparent/TransparentUpgradeableProxy.sol    |  193 ++++
 .../@openzeppelin/contracts/utils/Address.sol      |  244 +++++
 .../@openzeppelin/contracts/utils/Context.sol      |   24 +
 .../@openzeppelin/contracts/utils/StorageSlot.sol  |   88 ++
 .../xai/arbitrum/.code/GasSubsidy/proxy/meta.txt   |    2 +
 .../implementation/contracts/GnosisSafe.sol        |  422 ++++++++
 .../implementation/contracts/GnosisSafeL2.sol      |   86 ++
 .../implementation/contracts/base/Executor.sol     |   27 +
 .../contracts/base/FallbackManager.sol             |   53 ++
 .../implementation/contracts/base/GuardManager.sol |   50 +
 .../contracts/base/ModuleManager.sol               |  133 +++
 .../implementation/contracts/base/OwnerManager.sol |  149 +++
 .../implementation/contracts/common/Enum.sol       |    8 +
 .../contracts/common/EtherPaymentFallback.sol      |   13 +
 .../contracts/common/SecuredTokenTransfer.sol      |   35 +
 .../contracts/common/SelfAuthorized.sol            |   16 +
 .../contracts/common/SignatureDecoder.sol          |   36 +
 .../implementation/contracts/common/Singleton.sol  |   11 +
 .../contracts/common/StorageAccessible.sol         |   47 +
 .../contracts/external/GnosisSafeMath.sol          |   54 ++
 .../contracts/interfaces/ISignatureValidator.sol   |   20 +
 .../.code/GnosisSafeL2/implementation/meta.txt     |    2 +
 .../.code/GnosisSafeL2/proxy/GnosisSafeProxy.sol   |  159 ++++
 .../xai/arbitrum/.code/GnosisSafeL2/proxy/meta.txt |    2 +
 .../access/AccessControlUpgradeable.sol            |  261 +++++
 .../access/IAccessControlUpgradeable.sol           |   88 ++
 .../proxy/utils/Initializable.sol                  |  166 ++++
 .../token/ERC721/ERC721Upgradeable.sol             |  478 ++++++++++
 .../token/ERC721/IERC721ReceiverUpgradeable.sol    |   27 +
 .../token/ERC721/IERC721Upgradeable.sol            |  132 +++
 .../extensions/ERC721EnumerableUpgradeable.sol     |  172 ++++
 .../extensions/IERC721EnumerableUpgradeable.sol    |   29 +
 .../extensions/IERC721MetadataUpgradeable.sol      |   27 +
 .../utils/AddressUpgradeable.sol                   |  244 +++++
 .../utils/Base64Upgradeable.sol                    |   92 ++
 .../utils/ContextUpgradeable.sol                   |   37 +
 .../utils/CountersUpgradeable.sol                  |   43 +
 .../utils/StringsUpgradeable.sol                   |   85 ++
 .../utils/introspection/ERC165Upgradeable.sol      |   42 +
 .../utils/introspection/IERC165Upgradeable.sol     |   25 +
 .../utils/math/MathUpgradeable.sol                 |  339 +++++++
 .../utils/math/SignedMathUpgradeable.sol           |   43 +
 .../upgrades/node-license/NodeLicense5.sol         |  465 +++++++++
 .../NodeLicenseRegistry/implementation/meta.txt    |    2 +
 .../@openzeppelin/contracts/access/Ownable.sol     |   83 ++
 .../contracts/interfaces/IERC1967.sol              |   26 +
 .../contracts/interfaces/draft-IERC1822.sol        |   20 +
 .../contracts/proxy/ERC1967/ERC1967Proxy.sol       |   32 +
 .../contracts/proxy/ERC1967/ERC1967Upgrade.sol     |  171 ++++
 .../proxy/@openzeppelin/contracts/proxy/Proxy.sol  |   86 ++
 .../contracts/proxy/beacon/BeaconProxy.sol         |   61 ++
 .../contracts/proxy/beacon/IBeacon.sol             |   16 +
 .../contracts/proxy/beacon/UpgradeableBeacon.sol   |   65 ++
 .../contracts/proxy/transparent/ProxyAdmin.sol     |   81 ++
 .../transparent/TransparentUpgradeableProxy.sol    |  193 ++++
 .../@openzeppelin/contracts/utils/Address.sol      |  244 +++++
 .../@openzeppelin/contracts/utils/Context.sol      |   24 +
 .../@openzeppelin/contracts/utils/StorageSlot.sol  |   88 ++
 .../.code/NodeLicenseRegistry/proxy/meta.txt       |    2 +
 .../@openzeppelin/contracts/access/Ownable.sol     |   83 ++
 .../contracts/proxy/beacon/IBeacon.sol             |   16 +
 .../contracts/proxy/beacon/UpgradeableBeacon.sol   |   65 ++
 .../@openzeppelin/contracts/utils/Address.sol      |  244 +++++
 .../@openzeppelin/contracts/utils/Context.sol      |   24 +
 .../contracts/staking-v2/PoolBeacon.sol            |   22 +
 .../meta.txt                                       |    2 +
 .../@openzeppelin/contracts/access/Ownable.sol     |   83 ++
 .../contracts/proxy/beacon/IBeacon.sol             |   16 +
 .../contracts/proxy/beacon/UpgradeableBeacon.sol   |   65 ++
 .../@openzeppelin/contracts/utils/Address.sol      |  244 +++++
 .../@openzeppelin/contracts/utils/Context.sol      |   24 +
 .../contracts/staking-v2/PoolBeacon.sol            |   22 +
 .../meta.txt                                       |    2 +
 .../@openzeppelin/contracts/access/Ownable.sol     |   83 ++
 .../contracts/proxy/beacon/IBeacon.sol             |   16 +
 .../contracts/proxy/beacon/UpgradeableBeacon.sol   |   65 ++
 .../@openzeppelin/contracts/utils/Address.sol      |  244 +++++
 .../@openzeppelin/contracts/utils/Context.sol      |   24 +
 .../contracts/staking-v2/PoolBeacon.sol            |   22 +
 .../meta.txt                                       |    2 +
 .../@openzeppelin/contracts/access/Ownable.sol     |   83 ++
 .../contracts/interfaces/IERC1967.sol              |   26 +
 .../contracts/interfaces/draft-IERC1822.sol        |   20 +
 .../contracts/proxy/ERC1967/ERC1967Upgrade.sol     |  157 +++
 .../@openzeppelin/contracts/proxy/Proxy.sol        |   86 ++
 .../contracts/proxy/beacon/BeaconProxy.sol         |   61 ++
 .../contracts/proxy/beacon/IBeacon.sol             |   16 +
 .../contracts/proxy/beacon/UpgradeableBeacon.sol   |   65 ++
 .../@openzeppelin/contracts/utils/Address.sol      |  244 +++++
 .../@openzeppelin/contracts/utils/Context.sol      |   24 +
 .../@openzeppelin/contracts/utils/StorageSlot.sol  |  138 +++
 .../@openzeppelin/contracts/utils/math/Math.sol    |  339 +++++++
 .../access/AccessControlEnumerableUpgradeable.sol  |   77 ++
 .../access/AccessControlUpgradeable.sol            |  261 +++++
 .../access/IAccessControlEnumerableUpgradeable.sol |   31 +
 .../access/IAccessControlUpgradeable.sol           |   88 ++
 .../proxy/utils/Initializable.sol                  |  166 ++++
 .../token/ERC20/ERC20Upgradeable.sol               |  377 ++++++++
 .../token/ERC20/IERC20Upgradeable.sol              |   78 ++
 .../ERC20/extensions/ERC20BurnableUpgradeable.sol  |   52 +
 .../ERC20/extensions/IERC20MetadataUpgradeable.sol |   28 +
 .../token/ERC721/ERC721Upgradeable.sol             |  478 ++++++++++
 .../token/ERC721/IERC721ReceiverUpgradeable.sol    |   27 +
 .../token/ERC721/IERC721Upgradeable.sol            |  132 +++
 .../extensions/ERC721EnumerableUpgradeable.sol     |  172 ++++
 .../extensions/IERC721EnumerableUpgradeable.sol    |   29 +
 .../extensions/IERC721MetadataUpgradeable.sol      |   27 +
 .../utils/AddressUpgradeable.sol                   |  244 +++++
 .../utils/Base64Upgradeable.sol                    |   92 ++
 .../utils/ContextUpgradeable.sol                   |   37 +
 .../utils/CountersUpgradeable.sol                  |   43 +
 .../utils/StringsUpgradeable.sol                   |   85 ++
 .../utils/introspection/ERC165Upgradeable.sol      |   42 +
 .../utils/introspection/IERC165Upgradeable.sol     |   25 +
 .../utils/math/MathUpgradeable.sol                 |  339 +++++++
 .../utils/math/SignedMathUpgradeable.sol           |   43 +
 .../utils/structs/EnumerableSetUpgradeable.sol     |  378 ++++++++
 .../implementation/contracts/NodeLicense.sol       |  418 ++++++++
 .../PoolFactory/implementation/contracts/Xai.sol   |   69 ++
 .../PoolFactory/implementation/contracts/esXai.sol |  238 +++++
 .../contracts/nitro-contracts/bridge/IBridge.sol   |  115 +++
 .../bridge/IDelayedMessageProvider.sol             |   15 +
 .../contracts/nitro-contracts/bridge/IInbox.sol    |  193 ++++
 .../contracts/nitro-contracts/bridge/IOutbox.sol   |  120 +++
 .../contracts/nitro-contracts/bridge/IOwnable.sol  |   10 +
 .../nitro-contracts/bridge/ISequencerInbox.sol     |  178 ++++
 .../nitro-contracts/challenge/ChallengeLib.sol     |  133 +++
 .../challenge/IChallengeManager.sol                |   73 ++
 .../challenge/IChallengeResultReceiver.sol         |   13 +
 .../nitro-contracts/libraries/IGasRefunder.sol     |   39 +
 .../nitro-contracts/osp/IOneStepProofEntry.sol     |   20 +
 .../nitro-contracts/osp/IOneStepProver.sol         |   27 +
 .../nitro-contracts/rollup/IRollupCore.sol         |  191 ++++
 .../nitro-contracts/rollup/IRollupEventInbox.sol   |   17 +
 .../contracts/nitro-contracts/rollup/Node.sol      |  113 +++
 .../nitro-contracts/state/GlobalState.sol          |   51 +
 .../nitro-contracts/state/Instructions.sol         |  153 +++
 .../contracts/nitro-contracts/state/Machine.sol    |   61 ++
 .../contracts/nitro-contracts/state/Module.sol     |   33 +
 .../nitro-contracts/state/ModuleMemoryCompact.sol  |   17 +
 .../contracts/nitro-contracts/state/StackFrame.sol |   63 ++
 .../contracts/nitro-contracts/state/Value.sol      |   64 ++
 .../contracts/nitro-contracts/state/ValueArray.sol |   47 +
 .../contracts/nitro-contracts/state/ValueStack.sol |   39 +
 .../contracts/staking-v2/BucketTracker.sol         |  321 +++++++
 .../contracts/staking-v2/PoolBeacon.sol            |   22 +
 .../contracts/staking-v2/PoolFactory.sol           |  593 ++++++++++++
 .../contracts/staking-v2/PoolProxyDeployer.sol     |   46 +
 .../contracts/staking-v2/StakingPool.sol           |  536 +++++++++++
 .../contracts/upgrades/referee/Referee5.sol        | 1003 ++++++++++++++++++++
 .../.code/PoolFactory/implementation/meta.txt      |    2 +
 .../@openzeppelin/contracts/access/Ownable.sol     |   83 ++
 .../contracts/interfaces/IERC1967.sol              |   26 +
 .../contracts/interfaces/draft-IERC1822.sol        |   20 +
 .../contracts/proxy/ERC1967/ERC1967Proxy.sol       |   32 +
 .../contracts/proxy/ERC1967/ERC1967Upgrade.sol     |  171 ++++
 .../proxy/@openzeppelin/contracts/proxy/Proxy.sol  |   86 ++
 .../contracts/proxy/beacon/BeaconProxy.sol         |   61 ++
 .../contracts/proxy/beacon/IBeacon.sol             |   16 +
 .../contracts/proxy/beacon/UpgradeableBeacon.sol   |   65 ++
 .../contracts/proxy/transparent/ProxyAdmin.sol     |   81 ++
 .../transparent/TransparentUpgradeableProxy.sol    |  193 ++++
 .../@openzeppelin/contracts/utils/Address.sol      |  244 +++++
 .../@openzeppelin/contracts/utils/Context.sol      |   24 +
 .../@openzeppelin/contracts/utils/StorageSlot.sol  |   88 ++
 .../xai/arbitrum/.code/PoolFactory/proxy/meta.txt  |    2 +
 .../@openzeppelin/contracts/access/Ownable.sol     |   83 ++
 .../contracts/interfaces/IERC1967.sol              |   26 +
 .../contracts/interfaces/draft-IERC1822.sol        |   20 +
 .../contracts/proxy/ERC1967/ERC1967Upgrade.sol     |  157 +++
 .../@openzeppelin/contracts/proxy/Proxy.sol        |   86 ++
 .../contracts/proxy/beacon/BeaconProxy.sol         |   61 ++
 .../contracts/proxy/beacon/IBeacon.sol             |   16 +
 .../contracts/proxy/beacon/UpgradeableBeacon.sol   |   65 ++
 .../@openzeppelin/contracts/utils/Address.sol      |  244 +++++
 .../@openzeppelin/contracts/utils/Context.sol      |   24 +
 .../@openzeppelin/contracts/utils/StorageSlot.sol  |  138 +++
 .../access/AccessControlEnumerableUpgradeable.sol  |   77 ++
 .../access/AccessControlUpgradeable.sol            |  261 +++++
 .../access/IAccessControlEnumerableUpgradeable.sol |   31 +
 .../access/IAccessControlUpgradeable.sol           |   88 ++
 .../proxy/utils/Initializable.sol                  |  166 ++++
 .../utils/AddressUpgradeable.sol                   |  244 +++++
 .../utils/ContextUpgradeable.sol                   |   37 +
 .../utils/StringsUpgradeable.sol                   |   85 ++
 .../utils/introspection/ERC165Upgradeable.sol      |   42 +
 .../utils/introspection/IERC165Upgradeable.sol     |   25 +
 .../utils/math/MathUpgradeable.sol                 |  339 +++++++
 .../utils/math/SignedMathUpgradeable.sol           |   43 +
 .../utils/structs/EnumerableSetUpgradeable.sol     |  378 ++++++++
 .../contracts/staking-v2/PoolBeacon.sol            |   22 +
 .../contracts/staking-v2/PoolProxyDeployer.sol     |   46 +
 .../PoolProxyDeployer/implementation/meta.txt      |    2 +
 .../@openzeppelin/contracts/access/Ownable.sol     |   83 ++
 .../contracts/interfaces/IERC1967.sol              |   26 +
 .../contracts/interfaces/draft-IERC1822.sol        |   20 +
 .../contracts/proxy/ERC1967/ERC1967Proxy.sol       |   32 +
 .../contracts/proxy/ERC1967/ERC1967Upgrade.sol     |  171 ++++
 .../proxy/@openzeppelin/contracts/proxy/Proxy.sol  |   86 ++
 .../contracts/proxy/beacon/BeaconProxy.sol         |   61 ++
 .../contracts/proxy/beacon/IBeacon.sol             |   16 +
 .../contracts/proxy/beacon/UpgradeableBeacon.sol   |   65 ++
 .../contracts/proxy/transparent/ProxyAdmin.sol     |   81 ++
 .../transparent/TransparentUpgradeableProxy.sol    |  193 ++++
 .../@openzeppelin/contracts/utils/Address.sol      |  244 +++++
 .../@openzeppelin/contracts/utils/Context.sol      |   24 +
 .../@openzeppelin/contracts/utils/StorageSlot.sol  |   88 ++
 .../.code/PoolProxyDeployer/proxy/meta.txt         |    2 +
 .../@openzeppelin/contracts/access/Ownable.sol     |   83 ++
 .../contracts/interfaces/IERC1967.sol              |   26 +
 .../contracts/interfaces/draft-IERC1822.sol        |   20 +
 .../contracts/proxy/ERC1967/ERC1967Upgrade.sol     |  157 +++
 .../@openzeppelin/contracts/proxy/Proxy.sol        |   86 ++
 .../contracts/proxy/beacon/BeaconProxy.sol         |   61 ++
 .../contracts/proxy/beacon/IBeacon.sol             |   16 +
 .../contracts/proxy/beacon/UpgradeableBeacon.sol   |   65 ++
 .../@openzeppelin/contracts/utils/Address.sol      |  244 +++++
 .../@openzeppelin/contracts/utils/Context.sol      |   24 +
 .../@openzeppelin/contracts/utils/StorageSlot.sol  |  138 +++
 .../@openzeppelin/contracts/utils/math/Math.sol    |  339 +++++++
 .../access/AccessControlEnumerableUpgradeable.sol  |   77 ++
 .../access/AccessControlUpgradeable.sol            |  261 +++++
 .../access/IAccessControlEnumerableUpgradeable.sol |   31 +
 .../access/IAccessControlUpgradeable.sol           |   88 ++
 .../proxy/utils/Initializable.sol                  |  166 ++++
 .../token/ERC20/ERC20Upgradeable.sol               |  377 ++++++++
 .../token/ERC20/IERC20Upgradeable.sol              |   78 ++
 .../ERC20/extensions/ERC20BurnableUpgradeable.sol  |   52 +
 .../ERC20/extensions/IERC20MetadataUpgradeable.sol |   28 +
 .../token/ERC721/ERC721Upgradeable.sol             |  478 ++++++++++
 .../token/ERC721/IERC721ReceiverUpgradeable.sol    |   27 +
 .../token/ERC721/IERC721Upgradeable.sol            |  132 +++
 .../extensions/ERC721EnumerableUpgradeable.sol     |  172 ++++
 .../extensions/IERC721EnumerableUpgradeable.sol    |   29 +
 .../extensions/IERC721MetadataUpgradeable.sol      |   27 +
 .../utils/AddressUpgradeable.sol                   |  244 +++++
 .../utils/Base64Upgradeable.sol                    |   92 ++
 .../utils/ContextUpgradeable.sol                   |   37 +
 .../utils/CountersUpgradeable.sol                  |   43 +
 .../utils/StringsUpgradeable.sol                   |   85 ++
 .../utils/introspection/ERC165Upgradeable.sol      |   42 +
 .../utils/introspection/IERC165Upgradeable.sol     |   25 +
 .../utils/math/MathUpgradeable.sol                 |  339 +++++++
 .../utils/math/SignedMathUpgradeable.sol           |   43 +
 .../utils/structs/EnumerableSetUpgradeable.sol     |  378 ++++++++
 .../implementation/contracts/NodeLicense.sol       |  418 ++++++++
 .../SentryReferee/implementation/contracts/Xai.sol |   69 ++
 .../implementation/contracts/esXai.sol             |  238 +++++
 .../contracts/nitro-contracts/bridge/IBridge.sol   |  115 +++
 .../bridge/IDelayedMessageProvider.sol             |   15 +
 .../contracts/nitro-contracts/bridge/IInbox.sol    |  193 ++++
 .../contracts/nitro-contracts/bridge/IOutbox.sol   |  120 +++
 .../contracts/nitro-contracts/bridge/IOwnable.sol  |   10 +
 .../nitro-contracts/bridge/ISequencerInbox.sol     |  178 ++++
 .../nitro-contracts/challenge/ChallengeLib.sol     |  133 +++
 .../challenge/IChallengeManager.sol                |   73 ++
 .../challenge/IChallengeResultReceiver.sol         |   13 +
 .../nitro-contracts/libraries/IGasRefunder.sol     |   39 +
 .../nitro-contracts/osp/IOneStepProofEntry.sol     |   20 +
 .../nitro-contracts/osp/IOneStepProver.sol         |   27 +
 .../nitro-contracts/rollup/IRollupCore.sol         |  191 ++++
 .../nitro-contracts/rollup/IRollupEventInbox.sol   |   17 +
 .../contracts/nitro-contracts/rollup/Node.sol      |  113 +++
 .../nitro-contracts/state/GlobalState.sol          |   51 +
 .../nitro-contracts/state/Instructions.sol         |  153 +++
 .../contracts/nitro-contracts/state/Machine.sol    |   61 ++
 .../contracts/nitro-contracts/state/Module.sol     |   33 +
 .../nitro-contracts/state/ModuleMemoryCompact.sol  |   17 +
 .../contracts/nitro-contracts/state/StackFrame.sol |   63 ++
 .../contracts/nitro-contracts/state/Value.sol      |   64 ++
 .../contracts/nitro-contracts/state/ValueArray.sol |   47 +
 .../contracts/nitro-contracts/state/ValueStack.sol |   39 +
 .../contracts/staking-v2/BucketTracker.sol         |  321 +++++++
 .../contracts/staking-v2/PoolBeacon.sol            |   22 +
 .../contracts/staking-v2/PoolFactory.sol           |  593 ++++++++++++
 .../contracts/staking-v2/PoolProxyDeployer.sol     |   46 +
 .../contracts/staking-v2/StakingPool.sol           |  536 +++++++++++
 .../contracts/upgrades/referee/Referee5.sol        | 1003 ++++++++++++++++++++
 .../contracts/upgrades/referee/Referee6.sol        | 1003 ++++++++++++++++++++
 .../.code/SentryReferee/implementation/meta.txt    |    2 +
 .../@openzeppelin/contracts/access/Ownable.sol     |   83 ++
 .../contracts/interfaces/IERC1967.sol              |   26 +
 .../contracts/interfaces/draft-IERC1822.sol        |   20 +
 .../contracts/proxy/ERC1967/ERC1967Proxy.sol       |   32 +
 .../contracts/proxy/ERC1967/ERC1967Upgrade.sol     |  171 ++++
 .../proxy/@openzeppelin/contracts/proxy/Proxy.sol  |   86 ++
 .../contracts/proxy/beacon/BeaconProxy.sol         |   61 ++
 .../contracts/proxy/beacon/IBeacon.sol             |   16 +
 .../contracts/proxy/beacon/UpgradeableBeacon.sol   |   65 ++
 .../contracts/proxy/transparent/ProxyAdmin.sol     |   81 ++
 .../transparent/TransparentUpgradeableProxy.sol    |  193 ++++
 .../@openzeppelin/contracts/utils/Address.sol      |  244 +++++
 .../@openzeppelin/contracts/utils/Context.sol      |   24 +
 .../@openzeppelin/contracts/utils/StorageSlot.sol  |   88 ++
 .../arbitrum/.code/SentryReferee/proxy/meta.txt    |    2 +
 .../@openzeppelin/contracts/access/Ownable.sol     |   83 ++
 .../contracts/interfaces/IERC1967.sol              |   26 +
 .../contracts/interfaces/draft-IERC1822.sol        |   20 +
 .../contracts/proxy/ERC1967/ERC1967Upgrade.sol     |  157 +++
 .../@openzeppelin/contracts/proxy/Proxy.sol        |   86 ++
 .../contracts/proxy/beacon/BeaconProxy.sol         |   61 ++
 .../contracts/proxy/beacon/IBeacon.sol             |   16 +
 .../contracts/proxy/beacon/UpgradeableBeacon.sol   |   65 ++
 .../@openzeppelin/contracts/utils/Address.sol      |  244 +++++
 .../@openzeppelin/contracts/utils/Context.sol      |   24 +
 .../@openzeppelin/contracts/utils/StorageSlot.sol  |  138 +++
 .../@openzeppelin/contracts/utils/math/Math.sol    |  339 +++++++
 .../access/AccessControlEnumerableUpgradeable.sol  |   77 ++
 .../access/AccessControlUpgradeable.sol            |  261 +++++
 .../access/IAccessControlEnumerableUpgradeable.sol |   31 +
 .../access/IAccessControlUpgradeable.sol           |   88 ++
 .../proxy/utils/Initializable.sol                  |  166 ++++
 .../token/ERC20/ERC20Upgradeable.sol               |  377 ++++++++
 .../token/ERC20/IERC20Upgradeable.sol              |   78 ++
 .../ERC20/extensions/ERC20BurnableUpgradeable.sol  |   52 +
 .../ERC20/extensions/IERC20MetadataUpgradeable.sol |   28 +
 .../token/ERC721/ERC721Upgradeable.sol             |  478 ++++++++++
 .../token/ERC721/IERC721ReceiverUpgradeable.sol    |   27 +
 .../token/ERC721/IERC721Upgradeable.sol            |  132 +++
 .../extensions/ERC721EnumerableUpgradeable.sol     |  172 ++++
 .../extensions/IERC721EnumerableUpgradeable.sol    |   29 +
 .../extensions/IERC721MetadataUpgradeable.sol      |   27 +
 .../utils/AddressUpgradeable.sol                   |  244 +++++
 .../utils/Base64Upgradeable.sol                    |   92 ++
 .../utils/ContextUpgradeable.sol                   |   37 +
 .../utils/CountersUpgradeable.sol                  |   43 +
 .../utils/StringsUpgradeable.sol                   |   85 ++
 .../utils/introspection/ERC165Upgradeable.sol      |   42 +
 .../utils/introspection/IERC165Upgradeable.sol     |   25 +
 .../utils/math/MathUpgradeable.sol                 |  339 +++++++
 .../utils/math/SignedMathUpgradeable.sol           |   43 +
 .../utils/structs/EnumerableSetUpgradeable.sol     |  378 ++++++++
 .../.code/StakingPool/contracts/NodeLicense.sol    |  418 ++++++++
 .../arbitrum/.code/StakingPool/contracts/Xai.sol   |   69 ++
 .../arbitrum/.code/StakingPool/contracts/esXai.sol |  238 +++++
 .../contracts/nitro-contracts/bridge/IBridge.sol   |  115 +++
 .../bridge/IDelayedMessageProvider.sol             |   15 +
 .../contracts/nitro-contracts/bridge/IInbox.sol    |  193 ++++
 .../contracts/nitro-contracts/bridge/IOutbox.sol   |  120 +++
 .../contracts/nitro-contracts/bridge/IOwnable.sol  |   10 +
 .../nitro-contracts/bridge/ISequencerInbox.sol     |  178 ++++
 .../nitro-contracts/challenge/ChallengeLib.sol     |  133 +++
 .../challenge/IChallengeManager.sol                |   73 ++
 .../challenge/IChallengeResultReceiver.sol         |   13 +
 .../nitro-contracts/libraries/IGasRefunder.sol     |   39 +
 .../nitro-contracts/osp/IOneStepProofEntry.sol     |   20 +
 .../nitro-contracts/osp/IOneStepProver.sol         |   27 +
 .../nitro-contracts/rollup/IRollupCore.sol         |  191 ++++
 .../nitro-contracts/rollup/IRollupEventInbox.sol   |   17 +
 .../contracts/nitro-contracts/rollup/Node.sol      |  113 +++
 .../nitro-contracts/state/GlobalState.sol          |   51 +
 .../nitro-contracts/state/Instructions.sol         |  153 +++
 .../contracts/nitro-contracts/state/Machine.sol    |   61 ++
 .../contracts/nitro-contracts/state/Module.sol     |   33 +
 .../nitro-contracts/state/ModuleMemoryCompact.sol  |   17 +
 .../contracts/nitro-contracts/state/StackFrame.sol |   63 ++
 .../contracts/nitro-contracts/state/Value.sol      |   64 ++
 .../contracts/nitro-contracts/state/ValueArray.sol |   47 +
 .../contracts/nitro-contracts/state/ValueStack.sol |   39 +
 .../contracts/staking-v2/BucketTracker.sol         |  321 +++++++
 .../contracts/staking-v2/PoolBeacon.sol            |   22 +
 .../contracts/staking-v2/PoolFactory.sol           |  593 ++++++++++++
 .../contracts/staking-v2/PoolProxyDeployer.sol     |   46 +
 .../contracts/staking-v2/StakingPool.sol           |  536 +++++++++++
 .../contracts/upgrades/referee/Referee5.sol        | 1003 ++++++++++++++++++++
 .../xai/arbitrum/.code/StakingPool/meta.txt        |    2 +
 .../@openzeppelin/contracts/access/Ownable.sol     |   83 ++
 .../contracts/interfaces/IERC1967.sol              |   26 +
 .../contracts/interfaces/draft-IERC1822.sol        |   20 +
 .../contracts/proxy/ERC1967/ERC1967Proxy.sol       |   32 +
 .../contracts/proxy/ERC1967/ERC1967Upgrade.sol     |  171 ++++
 .../@openzeppelin/contracts/proxy/Proxy.sol        |   86 ++
 .../contracts/proxy/beacon/BeaconProxy.sol         |   61 ++
 .../contracts/proxy/beacon/IBeacon.sol             |   16 +
 .../contracts/proxy/beacon/UpgradeableBeacon.sol   |   65 ++
 .../contracts/proxy/transparent/ProxyAdmin.sol     |   81 ++
 .../transparent/TransparentUpgradeableProxy.sol    |  193 ++++
 .../@openzeppelin/contracts/utils/Address.sol      |  244 +++++
 .../@openzeppelin/contracts/utils/Context.sol      |   24 +
 .../@openzeppelin/contracts/utils/StorageSlot.sol  |   88 ++
 .../xai/arbitrum/.code/StakingProxyAdmin/meta.txt  |    2 +
 430 files changed, 50888 insertions(+)
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 198866013 (main branch discovery), not current.

```diff
-   Status: DELETED
    contract GnosisSafeL2 (0x1F941F7Fb552215af81e6bE87F59578C18783483)
    +++ description: None
```

```diff
-   Status: DELETED
    contract esXai (0x4C749d097832DE2FEcc989ce18fDc5f1BD76700c)
    +++ description: None
```

```diff
-   Status: DELETED
    contract Xai (0x4Cb9a7AE498CEDcBb5EAe9f25736aE7d428C9D66)
    +++ description: None
```

```diff
-   Status: DELETED
    contract GasSubsidy (0x94F4aBC83eae00b693286B6eDCa09e1D76183C97)
    +++ description: None
```

```diff
-   Status: DELETED
    contract NodeLicenseRegistry (0xbc14d8563b248B79689ECbc43bBa53290e0b6b66)
    +++ description: None
```

```diff
-   Status: DELETED
    contract ProxyAdmin (0xD88c8E0aE21beA6adE41A41130Bb4cd43e6b1723)
    +++ description: None
```

```diff
-   Status: DELETED
    contract GnosisSafeL2 (0xFCF7248C495d6fd3641eE43F861c48Ebe402c878)
    +++ description: None
```

```diff
-   Status: DELETED
    contract SentryReferee (0xfD41041180571C5D371BEA3D9550E55653671198)
    +++ description: None
```

Generated with discovered.json: 0x1bcf28a5e142cbf6032c6876ac9ccbb3fb9baa4e

# Diff at Thu, 28 Mar 2024 11:33:35 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@21187e63b9b90823a55c461c331868a470ce17eb block: 192980353
- current block number: 195077564

## Description

Update discovery to include the multisig threshold.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 192980353 (main branch discovery), not current.

```diff
    contract GnosisSafeAdminMember (0x000d8C5A70B8805DF02f409F2715d05B9A63E871) {
    +++ description: None
      upgradeability.threshold:
+        "1 of 3 (33%)"
    }
```

```diff
    contract GnosisSafeL2 (0x1F941F7Fb552215af81e6bE87F59578C18783483) {
    +++ description: None
      upgradeability.threshold:
+        "3 of 5 (60%)"
    }
```

```diff
    contract ExecutorMultisig (0x4972A8EF186Ee42A14Cdd3c47f52ec06a6dc495E) {
    +++ description: None
      upgradeability.threshold:
+        "3 of 5 (60%)"
    }
```

```diff
    contract GnosisSafeL2 (0xFCF7248C495d6fd3641eE43F861c48Ebe402c878) {
    +++ description: None
      upgradeability.threshold:
+        "3 of 5 (60%)"
    }
```

Generated with discovered.json: 0x79aaa42a48912c230dee5335fb64046b27683ad0

# Diff at Thu, 14 Mar 2024 14:56:12 GMT:

- author: vincfurc (<10850139+vincfurc@users.noreply.github.com>)
- comparing to: main@4f6a54f5fa748334d34176673b2c233534ce2fbc block: 181262302
- current block number: 190317868

## Description

- Modified the redemption function that allows esXAI to be redeemed for XAI. If the user redeems before the maximum redemption period, a percentage of the esXAI will be burned. This modification adds that half of the would-be burned esXai amount will be minted as XAI to the esXaiBurnFoundationRecipient.

- Added a whitelisted address (the Referee address) to esXAI . Only whitelisted addresses are able to initiate esXAI token transfers.

- Changed wasmModuleRoot to orbOS version 11.

- Added Referee4 smart contract. The referree contract allows to create new challenges (state root reports) from the permissioned challenger, collects assertions from sentry nodes, and gives out rewards to participants of a challenge. This is the contract that distributes esXAI rewards for operating a sentry node.
  The role of sentry nodes is to basically verify (assert) the submitted state root after it has been submitted. There is no integrated way to flag an invalid state root, sentry nodes will have to raise the alarm by external means. This makes them just observation nodes.

## Watched changes

```diff
    contract esXai (0x4C749d097832DE2FEcc989ce18fDc5f1BD76700c) {
    +++ description: None
      upgradeability.implementation:
-        "0x8d6C063656b00E5c37CE007C0f99848D58F19d6B"
+        "0xb38E2EDda6c31D9972Cac770f3F404CD0D7B55Df"
      implementations.0:
-        "0x8d6C063656b00E5c37CE007C0f99848D58F19d6B"
+        "0xb38E2EDda6c31D9972Cac770f3F404CD0D7B55Df"
      values.getWhitelistCount:
-        0
+        1
      values.getWhitelistedAddressAtIndex[0]:
+        "0xfD41041180571C5D371BEA3D9550E55653671198"
      values.esXaiBurnFoundationBasePoints:
+        500
      values.esXaiBurnFoundationRecipient:
+        "0x1F941F7Fb552215af81e6bE87F59578C18783483"
      derivedName:
-        "esXai"
+        "esXai2"
    }
```

```diff
    contract SequencerInbox (0x995a9d3ca121D48d21087eDE20bc8acb2398c8B1) {
    +++ description: None
      values.dacKeyset.requiredSignatures:
-        4
+        5
      values.dacKeyset.membersCount:
-        5
+        6
      values.keySetUpdates:
-        3
+        4
    }
```

```diff
    contract RollupProxy (0xC47DacFbAa80Bd9D8112F4e8069482c2A3221336) {
    +++ description: None
      values.wasmModuleRoot:
-        "0xf4389b835497a910d7ba3ebfb77aa93da985634f3c052de1290360635be40c4a"
+        "0x68e4fe5023f792d4ef584796c84d710303a5e12ea02d6e37e2b5e9c4332507c4"
    }
```

```diff
+   Status: CREATED
    contract GnosisSafeL2 (0x1F941F7Fb552215af81e6bE87F59578C18783483)
    +++ description: None
```

```diff
+   Status: CREATED
    contract GasSubsidy (0x94F4aBC83eae00b693286B6eDCa09e1D76183C97)
    +++ description: None
```

```diff
+   Status: CREATED
    contract NodeLicenseRegistry (0xbc14d8563b248B79689ECbc43bBa53290e0b6b66)
    +++ description: None
```

```diff
+   Status: CREATED
    contract GnosisSafeL2 (0xFCF7248C495d6fd3641eE43F861c48Ebe402c878)
    +++ description: None
```

```diff
+   Status: CREATED
    contract SentryReferee (0xfD41041180571C5D371BEA3D9550E55653671198)
    +++ description: None
```

## Source code changes

```diff
.../access/AccessControlUpgradeable.sol            | 261 +++++++
 .../access/IAccessControlUpgradeable.sol           |  88 +++
 .../proxy/utils/Initializable.sol                  | 166 +++++
 .../token/ERC20/IERC20Upgradeable.sol              |  78 ++
 .../utils/AddressUpgradeable.sol                   | 244 +++++++
 .../utils/ContextUpgradeable.sol                   |  37 +
 .../utils/StringsUpgradeable.sol                   |  85 +++
 .../utils/introspection/ERC165Upgradeable.sol      |  42 ++
 .../utils/introspection/IERC165Upgradeable.sol     |  25 +
 .../utils/math/MathUpgradeable.sol                 | 339 +++++++++
 .../utils/math/SignedMathUpgradeable.sol           |  43 ++
 .../implementation/contracts/GasSubsidy.sol        |  38 +
 .../.code/GasSubsidy/implementation/meta.txt       |   2 +
 .../@openzeppelin/contracts/access/Ownable.sol     |  83 +++
 .../contracts/interfaces/IERC1967.sol              |  26 +
 .../contracts/interfaces/draft-IERC1822.sol        |  20 +
 .../contracts/proxy/ERC1967/ERC1967Proxy.sol       |  32 +
 .../contracts/proxy/ERC1967/ERC1967Upgrade.sol     | 171 +++++
 .../proxy/@openzeppelin/contracts/proxy/Proxy.sol  |  86 +++
 .../contracts/proxy/beacon/BeaconProxy.sol         |  61 ++
 .../contracts/proxy/beacon/IBeacon.sol             |  16 +
 .../contracts/proxy/beacon/UpgradeableBeacon.sol   |  65 ++
 .../contracts/proxy/transparent/ProxyAdmin.sol     |  81 +++
 .../transparent/TransparentUpgradeableProxy.sol    | 193 +++++
 .../@openzeppelin/contracts/utils/Address.sol      | 244 +++++++
 .../@openzeppelin/contracts/utils/Context.sol      |  24 +
 .../@openzeppelin/contracts/utils/StorageSlot.sol  |  88 +++
 .../xai/arbitrum/.code/GasSubsidy/proxy/meta.txt   |   2 +
 .../implementation/contracts/GnosisSafe.sol        | 422 +++++++++++
 .../implementation/contracts/GnosisSafeL2.sol      |  86 +++
 .../implementation/contracts/base/Executor.sol     |  27 +
 .../contracts/base/FallbackManager.sol             |  53 ++
 .../implementation/contracts/base/GuardManager.sol |  50 ++
 .../contracts/base/ModuleManager.sol               | 133 ++++
 .../implementation/contracts/base/OwnerManager.sol | 149 ++++
 .../implementation/contracts/common/Enum.sol       |   8 +
 .../contracts/common/EtherPaymentFallback.sol      |  13 +
 .../contracts/common/SecuredTokenTransfer.sol      |  35 +
 .../contracts/common/SelfAuthorized.sol            |  16 +
 .../contracts/common/SignatureDecoder.sol          |  36 +
 .../implementation/contracts/common/Singleton.sol  |  11 +
 .../contracts/common/StorageAccessible.sol         |  47 ++
 .../contracts/external/GnosisSafeMath.sol          |  54 ++
 .../contracts/interfaces/ISignatureValidator.sol   |  20 +
 .../implementation/meta.txt                        |   2 +
 .../proxy/GnosisSafeProxy.sol                      | 159 ++++
 .../proxy/meta.txt                                 |   2 +
 .../implementation/contracts/GnosisSafe.sol        | 422 +++++++++++
 .../implementation/contracts/GnosisSafeL2.sol      |  86 +++
 .../implementation/contracts/base/Executor.sol     |  27 +
 .../contracts/base/FallbackManager.sol             |  53 ++
 .../implementation/contracts/base/GuardManager.sol |  50 ++
 .../contracts/base/ModuleManager.sol               | 133 ++++
 .../implementation/contracts/base/OwnerManager.sol | 149 ++++
 .../implementation/contracts/common/Enum.sol       |   8 +
 .../contracts/common/EtherPaymentFallback.sol      |  13 +
 .../contracts/common/SecuredTokenTransfer.sol      |  35 +
 .../contracts/common/SelfAuthorized.sol            |  16 +
 .../contracts/common/SignatureDecoder.sol          |  36 +
 .../implementation/contracts/common/Singleton.sol  |  11 +
 .../contracts/common/StorageAccessible.sol         |  47 ++
 .../contracts/external/GnosisSafeMath.sol          |  54 ++
 .../contracts/interfaces/ISignatureValidator.sol   |  20 +
 .../implementation/meta.txt                        |   2 +
 .../proxy/GnosisSafeProxy.sol                      | 159 ++++
 .../proxy/meta.txt                                 |   2 +
 .../access/AccessControlUpgradeable.sol            | 261 +++++++
 .../access/IAccessControlUpgradeable.sol           |  88 +++
 .../proxy/utils/Initializable.sol                  | 166 +++++
 .../token/ERC721/ERC721Upgradeable.sol             | 478 +++++++++++++
 .../token/ERC721/IERC721ReceiverUpgradeable.sol    |  27 +
 .../token/ERC721/IERC721Upgradeable.sol            | 132 ++++
 .../extensions/ERC721EnumerableUpgradeable.sol     | 172 +++++
 .../extensions/IERC721EnumerableUpgradeable.sol    |  29 +
 .../extensions/IERC721MetadataUpgradeable.sol      |  27 +
 .../utils/AddressUpgradeable.sol                   | 244 +++++++
 .../utils/Base64Upgradeable.sol                    |  92 +++
 .../utils/ContextUpgradeable.sol                   |  37 +
 .../utils/CountersUpgradeable.sol                  |  43 ++
 .../utils/StringsUpgradeable.sol                   |  85 +++
 .../utils/introspection/ERC165Upgradeable.sol      |  42 ++
 .../utils/introspection/IERC165Upgradeable.sol     |  25 +
 .../utils/math/MathUpgradeable.sol                 | 339 +++++++++
 .../utils/math/SignedMathUpgradeable.sol           |  43 ++
 .../upgrades/node-license/NodeLicense5.sol         | 465 ++++++++++++
 .../NodeLicenseRegistry/implementation/meta.txt    |   2 +
 .../@openzeppelin/contracts/access/Ownable.sol     |  83 +++
 .../contracts/interfaces/IERC1967.sol              |  26 +
 .../contracts/interfaces/draft-IERC1822.sol        |  20 +
 .../contracts/proxy/ERC1967/ERC1967Proxy.sol       |  32 +
 .../contracts/proxy/ERC1967/ERC1967Upgrade.sol     | 171 +++++
 .../proxy/@openzeppelin/contracts/proxy/Proxy.sol  |  86 +++
 .../contracts/proxy/beacon/BeaconProxy.sol         |  61 ++
 .../contracts/proxy/beacon/IBeacon.sol             |  16 +
 .../contracts/proxy/beacon/UpgradeableBeacon.sol   |  65 ++
 .../contracts/proxy/transparent/ProxyAdmin.sol     |  81 +++
 .../transparent/TransparentUpgradeableProxy.sol    | 193 +++++
 .../@openzeppelin/contracts/utils/Address.sol      | 244 +++++++
 .../@openzeppelin/contracts/utils/Context.sol      |  24 +
 .../@openzeppelin/contracts/utils/StorageSlot.sol  |  88 +++
 .../.code/NodeLicenseRegistry/proxy/meta.txt       |   2 +
 .../@openzeppelin/contracts/utils/math/Math.sol    | 339 +++++++++
 .../access/AccessControlEnumerableUpgradeable.sol  |  77 ++
 .../access/AccessControlUpgradeable.sol            | 261 +++++++
 .../access/IAccessControlEnumerableUpgradeable.sol |  31 +
 .../access/IAccessControlUpgradeable.sol           |  88 +++
 .../proxy/utils/Initializable.sol                  | 166 +++++
 .../token/ERC20/ERC20Upgradeable.sol               | 377 ++++++++++
 .../token/ERC20/IERC20Upgradeable.sol              |  78 ++
 .../ERC20/extensions/ERC20BurnableUpgradeable.sol  |  52 ++
 .../ERC20/extensions/IERC20MetadataUpgradeable.sol |  28 +
 .../token/ERC721/ERC721Upgradeable.sol             | 478 +++++++++++++
 .../token/ERC721/IERC721ReceiverUpgradeable.sol    |  27 +
 .../token/ERC721/IERC721Upgradeable.sol            | 132 ++++
 .../extensions/ERC721EnumerableUpgradeable.sol     | 172 +++++
 .../extensions/IERC721EnumerableUpgradeable.sol    |  29 +
 .../extensions/IERC721MetadataUpgradeable.sol      |  27 +
 .../utils/AddressUpgradeable.sol                   | 244 +++++++
 .../utils/Base64Upgradeable.sol                    |  92 +++
 .../utils/ContextUpgradeable.sol                   |  37 +
 .../utils/CountersUpgradeable.sol                  |  43 ++
 .../utils/StringsUpgradeable.sol                   |  85 +++
 .../utils/introspection/ERC165Upgradeable.sol      |  42 ++
 .../utils/introspection/IERC165Upgradeable.sol     |  25 +
 .../utils/math/MathUpgradeable.sol                 | 339 +++++++++
 .../utils/math/SignedMathUpgradeable.sol           |  43 ++
 .../utils/structs/EnumerableSetUpgradeable.sol     | 378 ++++++++++
 .../implementation/contracts/NodeLicense.sol       | 418 +++++++++++
 .../SentryReferee/implementation/contracts/Xai.sol |  69 ++
 .../implementation/contracts/esXai.sol             | 238 ++++++
 .../contracts/nitro-contracts/bridge/IBridge.sol   | 115 +++
 .../bridge/IDelayedMessageProvider.sol             |  15 +
 .../contracts/nitro-contracts/bridge/IInbox.sol    | 193 +++++
 .../contracts/nitro-contracts/bridge/IOutbox.sol   | 120 ++++
 .../contracts/nitro-contracts/bridge/IOwnable.sol  |  10 +
 .../nitro-contracts/bridge/ISequencerInbox.sol     | 178 +++++
 .../nitro-contracts/challenge/ChallengeLib.sol     | 133 ++++
 .../challenge/IChallengeManager.sol                |  73 ++
 .../challenge/IChallengeResultReceiver.sol         |  13 +
 .../nitro-contracts/libraries/IGasRefunder.sol     |  39 +
 .../nitro-contracts/osp/IOneStepProofEntry.sol     |  20 +
 .../nitro-contracts/osp/IOneStepProver.sol         |  27 +
 .../nitro-contracts/rollup/IRollupCore.sol         | 191 +++++
 .../nitro-contracts/rollup/IRollupEventInbox.sol   |  17 +
 .../contracts/nitro-contracts/rollup/Node.sol      | 113 +++
 .../nitro-contracts/state/GlobalState.sol          |  51 ++
 .../nitro-contracts/state/Instructions.sol         | 153 ++++
 .../contracts/nitro-contracts/state/Machine.sol    |  61 ++
 .../contracts/nitro-contracts/state/Module.sol     |  33 +
 .../nitro-contracts/state/ModuleMemoryCompact.sol  |  17 +
 .../contracts/nitro-contracts/state/StackFrame.sol |  63 ++
 .../contracts/nitro-contracts/state/Value.sol      |  64 ++
 .../contracts/nitro-contracts/state/ValueArray.sol |  47 ++
 .../contracts/nitro-contracts/state/ValueStack.sol |  39 +
 .../contracts/upgrades/referee/Referee4.sol        | 796 +++++++++++++++++++++
 .../.code/SentryReferee/implementation/meta.txt    |   2 +
 .../@openzeppelin/contracts/access/Ownable.sol     |  83 +++
 .../contracts/interfaces/IERC1967.sol              |  26 +
 .../contracts/interfaces/draft-IERC1822.sol        |  20 +
 .../contracts/proxy/ERC1967/ERC1967Proxy.sol       |  32 +
 .../contracts/proxy/ERC1967/ERC1967Upgrade.sol     | 171 +++++
 .../proxy/@openzeppelin/contracts/proxy/Proxy.sol  |  86 +++
 .../contracts/proxy/beacon/BeaconProxy.sol         |  61 ++
 .../contracts/proxy/beacon/IBeacon.sol             |  16 +
 .../contracts/proxy/beacon/UpgradeableBeacon.sol   |  65 ++
 .../contracts/proxy/transparent/ProxyAdmin.sol     |  81 +++
 .../transparent/TransparentUpgradeableProxy.sol    | 193 +++++
 .../@openzeppelin/contracts/utils/Address.sol      | 244 +++++++
 .../@openzeppelin/contracts/utils/Context.sol      |  24 +
 .../@openzeppelin/contracts/utils/StorageSlot.sol  |  88 +++
 .../arbitrum/.code/SentryReferee/proxy/meta.txt    |   2 +
 .../contracts/upgrades/esXai/esXai2.sol            | 270 +++++++
 .../esXai/implementation/meta.txt                  |   4 +-
 173 files changed, 17737 insertions(+), 2 deletions(-)
```

Generated with discovered.json: 0xcf1fb3429d4e6e0b7364715240da72013f3ab0de

# Diff at Fri, 16 Feb 2024 07:26:55 GMT:

- author: Radina Talanova (<nt.radina@gmail.com>)
- comparing to: main@a6356b2783ea71be1ce7003098f574ebc90b553b block: 177621512
- current block number: 181262302

## Description

Update in nonce, now ignored.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 177621512 (main branch discovery), not current.

```diff
    contract GnosisSafeL2 (0x4972A8EF186Ee42A14Cdd3c47f52ec06a6dc495E) {
      name:
-        "GnosisSafeL2"
+        "ExecutorMultisig"
      values.nonce:
-        2
    }
```

Generated with discovered.json: 0x1331038a7bf98dc70733792489ed180c671bcb35

# Diff at Mon, 05 Feb 2024 08:16:18 GMT:

- author: Luca Donno (<donnoh99@gmail.com>)
- comparing to: main@7095f5c6435baaba0d0084960e2593a905aaf947 block: 175991369
- current block number: 177621512

## Description

Update discovery to include the multisig threshold.

## Watched changes

```diff
    contract GnosisSafeL2 (0x4972A8EF186Ee42A14Cdd3c47f52ec06a6dc495E) {
      values.nonce:
-        1
+        2
    }
```

```diff
    contract SequencerInbox (0x995a9d3ca121D48d21087eDE20bc8acb2398c8B1) {
      values.dacKeyset.keyCount:
-        3
+        5
      values.keySetUpdates:
-        2
+        3
    }
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 175991369 (main branch discovery), not current.

```diff
    contract SequencerInbox (0x995a9d3ca121D48d21087eDE20bc8acb2398c8B1) {
      values.dacKeyset:
+        {"threshold":2,"keyCount":3}
      values.sequencerVersion:
+        "0x88"
    }
```

```diff
+   Status: CREATED
    contract L1GatewayRouter (0x22CCA5Dc96a4Ac1EC32c9c7C5ad4D66254a24C35) {
    }
```

```diff
+   Status: CREATED
    contract L1ERC20Gateway (0xb591cE747CF19cF30e11d656EB94134F523A9e77) {
    }
```

Generated with discovered.json: 0x598a2a43b1e79400ea587313e0534a96d5a69336

# Diff at Wed, 31 Jan 2024 08:11:59 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@367f818d32ce6c1ab18696a1cbeb7a6f368b6d78 block: 175366965
- current block number: 175991369

## Description

Start tracking the keySetUpdates.
Ignore totalSupply and nonce in watch mode.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 175366965 (main branch discovery), not current.

```diff
    contract GnosisSafeL2 (0x000d8C5A70B8805DF02f409F2715d05B9A63E871) {
      name:
-        "GnosisSafeL2"
+        "GnosisSafeAdminMember"
      values.nonce:
-        5
      derivedName:
+        "GnosisSafeL2"
    }
```

```diff
    contract esXai (0x4C749d097832DE2FEcc989ce18fDc5f1BD76700c) {
      derivedName:
+        "esXai"
    }
```

```diff
    contract Xai (0x4Cb9a7AE498CEDcBb5EAe9f25736aE7d428C9D66) {
      derivedName:
+        "Xai"
    }
```

```diff
    contract SequencerInbox (0x995a9d3ca121D48d21087eDE20bc8acb2398c8B1) {
      values.keySetUpdates:
+        2
    }
```

Generated with discovered.json: 0xc92ae2df53624132eb65c022f197837314f8a495

# Diff at Mon, 29 Jan 2024 11:22:06 GMT:

- author: Luca Donno (<donnoh99@gmail.com>)
- current block number: 175366965

## Description

Add initial XAI config.

## Initial discovery

```diff
+   Status: CREATED
    contract GnosisSafeL2 (0x000d8C5A70B8805DF02f409F2715d05B9A63E871) {
    }
```

```diff
+   Status: CREATED
    contract ProxyAdmin (0x041F85dD87c46B941dc9b15c6628B19ee5358485) {
    }
```

```diff
+   Status: CREATED
    contract UpgradeExecutor (0x0EE7AD3Cc291343C9952fFd8844e86d294fa513F) {
    }
```

```diff
+   Status: CREATED
    contract OneStepProver0 (0x1135265fE014D3FA32B3507E325642B92aFFeAEb) {
    }
```

```diff
+   Status: CREATED
    contract Outbox (0x1E400568AD4840dbE50FB32f306B842e9ddeF726) {
    }
```

```diff
+   Status: CREATED
    contract ValidatorWalletCreator (0x2b0E04Dc90e3fA58165CB41E2834B44A56E766aF) {
    }
```

```diff
+   Status: CREATED
    contract ERC20RollupEventInbox (0x36aDe24988E4C47602e38BD9a0Bd89031eF807a8) {
    }
```

```diff
+   Status: CREATED
    contract ChallengeManager (0x3a3f62034a42a35eA1686B199bB73006aa525eE4) {
    }
```

```diff
+   Status: CREATED
    contract OneStepProverMath (0x4811500e0d376Fa8d2EA3CCb7c61E0afB4F5A7f1) {
    }
```

```diff
+   Status: CREATED
    contract GnosisSafeL2 (0x4972A8EF186Ee42A14Cdd3c47f52ec06a6dc495E) {
    }
```

```diff
+   Status: CREATED
    contract esXai (0x4C749d097832DE2FEcc989ce18fDc5f1BD76700c) {
    }
```

```diff
+   Status: CREATED
    contract Xai (0x4Cb9a7AE498CEDcBb5EAe9f25736aE7d428C9D66) {
    }
```

```diff
+   Status: CREATED
    contract ValidatorUtils (0x6c21303F5986180B1394d2C89f3e883890E2867b) {
    }
```

```diff
+   Status: CREATED
    contract Bridge (0x7dd8A76bdAeBE3BBBaCD7Aa87f1D4FDa1E60f94f) {
    }
```

```diff
+   Status: CREATED
    contract  (0x82709E8564ce17707a7C8420c9e48e9a8A88bfc1) {
    }
```

```diff
+   Status: CREATED
    contract OneStepProverHostIo (0x89AF7C4C2198c426cFe6E86de0680A0850503e06) {
    }
```

```diff
+   Status: CREATED
    contract SequencerInbox (0x995a9d3ca121D48d21087eDE20bc8acb2398c8B1) {
    }
```

```diff
+   Status: CREATED
    contract OneStepProofEntry (0x99a2A31300816C1FA3f40818AC9280fe7271F878) {
    }
```

```diff
+   Status: CREATED
    contract Inbox (0xaE21fDA3de92dE2FDAF606233b2863782Ba046F9) {
    }
```

```diff
+   Status: CREATED
    contract RollupProxy (0xC47DacFbAa80Bd9D8112F4e8069482c2A3221336) {
    }
```

```diff
+   Status: CREATED
    contract ProxyAdmin (0xD88c8E0aE21beA6adE41A41130Bb4cd43e6b1723) {
    }
```

```diff
+   Status: CREATED
    contract OneStepProverMemory (0xDf94F0474F205D086dbc2e66D69a856FCf520622) {
    }
```
