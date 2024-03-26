Generated with discovered.json: 0x00e8f6fe2ff1e801c73b28ac65367c537e9b2588

# Diff at Tue, 26 Mar 2024 10:19:30 GMT:

- author: sekuba (<sekuba@users.noreply.github.com>)
- comparing to: main@e6ff14fa637ed6c3a674ff43e070f1cf65f4aa1e block: 19482562
- current block number: 19517972

## Description

One new router is added by the Connext Fee Multisig. Ignore Fee Multisig nonce.

## Watched changes

```diff
    contract ConnextBridge (0x8898B472C54c31894e3B9bb83cEA802a5d0e63C6) {
    +++ description: None
      values.ROUTERS.27:
+        "0xc82C7d826b1eD0b2A4E9A2bE72B445416f901FD1"
    }
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19482562 (main branch discovery), not current.

```diff
    contract Connext Fee Multisig (0x7bE978Cc84612E08f7844672B0E6A6F367FE2b6A) {
    +++ description: None
      values.nonce:
-        1
    }
```

Generated with discovered.json: 0x2b9a2dbfa0e1df2aabd59731d5051595c6415516

# Diff at Thu, 21 Mar 2024 10:53:07 GMT:

- author: sekuba (<sekuba@users.noreply.githum.com>)
- comparing to: main@3d626df8a3d129805d6a0f5894ea1a2e437970ee block: 19441852
- current block number: 19482562

## Description

Add two routers and change the relayer fee vault from the Gnosis Safe (Multisig 2) to a different one.
The new fee vault Multisig has a 1/5 threshold (old one 3/5) and only keeps 2 of the old signers.

## Watched changes

```diff
    contract ConnextBridge (0x8898B472C54c31894e3B9bb83cEA802a5d0e63C6) {
    +++ description: None
+++ description: This address receives the bridge fees
+++ severity: LOW
      values.relayerFeeVault:
-        "0xf2964cCcB7CDA9e808aaBe8DB0DDDAF7890dd378"
+        "0x7bE978Cc84612E08f7844672B0E6A6F367FE2b6A"
      values.ROUTERS.26:
+        "0xc770eC66052fe77ff2eF9edF9558236e2D1C41Ef"
      values.ROUTERS.25:
+        "0x5f4E31F4F402E368743bF29954f80f7C4655EA68"
    }
```

```diff
-   Status: DELETED
    contract GnosisSafe (0xf2964cCcB7CDA9e808aaBe8DB0DDDAF7890dd378)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Connext Fee Multisig (0x7bE978Cc84612E08f7844672B0E6A6F367FE2b6A)
    +++ description: None
```

## Source code changes

```diff
.../implementation/contracts/Safe.sol}             | 289 +++++++++++----------
 .../implementation/contracts/SafeL2.sol            |  74 ++++++
 .../implementation/contracts/base/Executor.sol     |  19 +-
 .../contracts/base/FallbackManager.sol             |  82 ++++++
 .../implementation/contracts/base/GuardManager.sol |  79 ++++++
 .../contracts/base/ModuleManager.sol               | 191 ++++++++++++++
 .../implementation/contracts/base/OwnerManager.sol |  96 ++++---
 .../implementation/contracts/common/Enum.sol       |  13 +
 .../common/NativeCurrencyPaymentFallback.sol       |  18 ++
 .../contracts/common/SecuredTokenTransfer.sol      |  38 +++
 .../contracts/common/SelfAuthorized.sol            |  18 ++
 .../contracts/common/SignatureDecoder.sol          |  36 +++
 .../implementation/contracts/common/Singleton.sol  |  13 +
 .../contracts/common/StorageAccessible.sol         |  14 +-
 .../contracts/external/SafeMath.sol}               |  28 +-
 .../contracts/interfaces/IERC165.sol               |  15 ++
 .../contracts/interfaces/ISignatureValidator.sol   |   6 +-
 .../Connext Fee Multisig/implementation/meta.txt   |   2 +
 .../proxy/contracts/proxies/SafeProxy.sol          |  50 ++++
 .../.code/Connext Fee Multisig/proxy/meta.txt      |   2 +
 .../implementation/contracts/GnosisSafe.sol        |   0
 .../implementation/contracts/base/Executor.sol     |   0
 .../contracts/base/FallbackManager.sol             |   0
 .../implementation/contracts/base/GuardManager.sol |   0
 .../contracts/base/ModuleManager.sol               |   0
 .../implementation/contracts/base/OwnerManager.sol |   0
 .../implementation/contracts/common/Enum.sol       |   0
 .../contracts/common/EtherPaymentFallback.sol      |   0
 .../contracts/common/SecuredTokenTransfer.sol      |   0
 .../contracts/common/SelfAuthorized.sol            |   0
 .../contracts/common/SignatureDecoder.sol          |   0
 .../implementation/contracts/common/Singleton.sol  |   0
 .../contracts/common/StorageAccessible.sol         |   0
 .../contracts/external/GnosisSafeMath.sol          |   0
 .../contracts/interfaces/ISignatureValidator.sol   |   0
 .../GnosisSafe}/implementation/meta.txt            |   0
 .../GnosisSafe}/proxy/Proxy.sol                    |   0
 .../GnosisSafe}/proxy/meta.txt                     |   0
 .../base/FallbackManager.sol => /dev/null          |  53 ----
 .../contracts/base/GuardManager.sol => /dev/null   |  50 ----
 .../contracts/base/ModuleManager.sol => /dev/null  | 133 ----------
 .../contracts/common/Enum.sol => /dev/null         |   8 -
 .../common/EtherPaymentFallback.sol => /dev/null   |  13 -
 .../common/SecuredTokenTransfer.sol => /dev/null   |  35 ---
 .../common/SelfAuthorized.sol => /dev/null         |  16 --
 .../common/SignatureDecoder.sol => /dev/null       |  36 ---
 .../contracts/common/Singleton.sol => /dev/null    |  11 -
 .../implementation/meta.txt => /dev/null           |   2 -
 .../proxy/GnosisSafeProxy.sol => /dev/null         | 155 -----------
 .../proxy/meta.txt => /dev/null                    |   2 -
 50 files changed, 886 insertions(+), 711 deletions(-)
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19441852 (main branch discovery), not current.

```diff
    contract Connext Multisig 2 (0xf2964cCcB7CDA9e808aaBe8DB0DDDAF7890dd378) {
    +++ description: None
      name:
-        "Connext Multisig 2"
+        "GnosisSafe"
    }
```

Generated with discovered.json: 0xb76dcd04bed4c034b382d58f57e071221946805c

# Diff at Wed, 13 Mar 2024 08:08:25 GMT:

- author: sekuba (<sekuba@users.noreply.github.com>)
- comparing to: main@800d2d30954e8bfb14ad062b9806c50997706541 block: 19317899
- current block number: 19424856

## Description

New Connector 'OptimismHubConnector' added, matches the source code of existing connector in index 4 (OP Mainnet connector).
This connector is for the op stack L2 Mode Network and now renamed to 'ModeHubConnector'.

## Watched changes

```diff
    contract RootManager (0x523AB7424AD126809b1d7A134eb6E0ee414C9B3A) {
    +++ description: None
      values.connectors[12]:
+        "0x7b2bE683266909A6a4068e743083dd40621d663E"
+++ description: Hash of all connectors' addresses. Changes when a connector is added or removed.
+++ severity: LOW
      values.connectorsHash:
-        "0x14b530936915b09786ec041c63aa2b1ec72eb6cdefd18fe41d79b92b93aa90bd"
+        "0x13d3fa9798ffd60797858bd05e95cbe3c3d7ebb6ee02922f0625e12f8bcbe51c"
    }
```

```diff
+   Status: CREATED
    contract ModeHubConnector (0x7b2bE683266909A6a4068e743083dd40621d663E)
    +++ description: None
```

## Source code changes

```diff
.../@openzeppelin/contracts/utils/Address.sol      | 244 +++++++++++++++++++++
 .../contracts/messaging/connectors/Connector.sol   | 216 ++++++++++++++++++
 .../contracts/messaging/connectors/GasCap.sol      |  61 ++++++
 .../messaging/connectors/HubConnector.sol          |  44 ++++
 .../messaging/connectors/optimism/BaseOptimism.sol |  28 +++
 .../connectors/optimism/OptimismHubConnector.sol   | 148 +++++++++++++
 .../messaging/connectors/optimism/lib/Types.sol    |  84 +++++++
 .../contracts/messaging/interfaces/IConnector.sol  |  64 ++++++
 .../messaging/interfaces/IRootManager.sol          |  22 ++
 .../interfaces/ambs/optimism/IOptimismPortal.sol   |  25 +++
 .../interfaces/ambs/optimism/OptimismAmb.sol       |  28 +++
 .../contracts/shared/ProposedOwnable.sol           | 172 +++++++++++++++
 .../shared/interfaces/IProposedOwnable.sol         |  42 ++++
 .../ethereum/.code/ModeHubConnector/meta.txt       |   2 +
 14 files changed, 1180 insertions(+)
```

Generated with discovered.json: 0xedbcbcd69c61aab19a00452e1a0f26ed281f8f56

# Diff at Tue, 27 Feb 2024 09:09:39 GMT:

- author: Radina Talanova (<nt.radina@gmail.com>)
- comparing to: main@4f9617ef0b726c0af67b0e31e0d1ed434f10f1ef block: 19267405
- current block number: 19317899

## Description

Two Watcher addresses are changed.

## Watched changes

```diff
    contract WatcherManager (0x79e6E0242405A66B2dd8B96DEd3b2F0216Fd417d) {
      values.WATCHERS.1:
-        "0x917133b1dE100E9fF8F03E24c43F9272dD6A8E99"
+        "0x151Ea574C62b505aEe2F89f33D8c152E28A956b0"
      values.WATCHERS.0:
-        "0x9c77788d761ee0347Ab550883237CeD274a0F248"
+        "0x56dD71fffD089EdAdbA8eCdaaDb94269713f8f4d"
    }
```

Generated with discovered.json: 0x76284a08ee267ddde579dbc4f104ea8865a380fa

# Diff at Tue, 20 Feb 2024 07:23:08 GMT:

- author: Radina Talanova (<nt.radina@gmail.com>)
- comparing to: main@308930b4cc7f93870a161e88abb1361d44caae90 block: 19176699
- current block number: 19267405

## Description

A new proposal is submitted, related to identifier update, and a new relayer is added.

## Watched changes

```diff
    contract GovernorV2 (0x7b292034084A41B9D441B71b6E3557Edd0463fa8) {
      values.numProposals:
-        198
+        199
    }
```

```diff
    contract ConnextBridge (0x8898B472C54c31894e3B9bb83cEA802a5d0e63C6) {
      values.RELAYERS[13]:
+        "0xF9D64d54D32EE2BDceAAbFA60C4C438E224427d0"
    }
```

Generated with discovered.json: 0x658319b9c3fe837c9e09311f58fef75b5fc7adcd

# Diff at Wed, 07 Feb 2024 13:46:24 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@70a2c5f9336d4d624160533a78c31ce52c7bbe58 block: 19126411
- current block number: 19176699

## Description

Removed ZkSyncHubConnector.

## Watched changes

```diff
    contract RootManager (0x523AB7424AD126809b1d7A134eb6E0ee414C9B3A) {
      values.connectors[12]:
-        "0x9Ba7D2Ab079Bd1924859e2fECDAD1bEBe5B119Fa"
      values.connectors.8:
-        "0x63C6c79F3E79406B62f8623881cBFD7B2Ec1E8cB"
+        "0x9Ba7D2Ab079Bd1924859e2fECDAD1bEBe5B119Fa"
      values.connectorsHash:
-        "0x14c4bf163ae7a6600a7ae29528ef8d2fe05fb8d77cf4be6201ac10f3c92fcb2e"
+        "0x14b530936915b09786ec041c63aa2b1ec72eb6cdefd18fe41d79b92b93aa90bd"
    }
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19126411 (main branch discovery), not current.

```diff
-   Status: DELETED
    contract ZkSyncHubConnector (0x63C6c79F3E79406B62f8623881cBFD7B2Ec1E8cB) {
    }
```

Generated with discovered.json: 0x3173a709fca8a83c7486e3febdd1d1700357d694

# Diff at Wed, 31 Jan 2024 12:18:08 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@8530982d7716e84f0c3870f09585b94f46c2e4bc block: 18990101
- current block number: 19126411

## Description

Added six new connectors, but in reality only four of them are unique. New and
unique connectors are:

- MantleHubConnector
- ZkSyncHubConnector
- PolygonZkHubConnector
- OptimismV0HubConnector

OptimismV0 uses a pre-bedrock version of the optimism contracts. There are two
_new_ connectors that in reality are just the same code - no diff between the
new and old - from WormholeHubConnector and OptimismHubConnector.

## Watched changes

```diff
    contract RootManager (0x523AB7424AD126809b1d7A134eb6E0ee414C9B3A) {
      values.connectors[12]:
+        "0x9Ba7D2Ab079Bd1924859e2fECDAD1bEBe5B119Fa"
      values.connectors[11]:
+        "0x7ed49D0a13255802A281C08688563bd8D5f726b1"
      values.connectors[10]:
+        "0x23b7abe4cc664F24Eb68E80cFAdc572857799a94"
      values.connectors[9]:
+        "0x5B0E1a507E786f0a7c11C972ad5F4dd254661e24"
      values.connectors[8]:
+        "0x63C6c79F3E79406B62f8623881cBFD7B2Ec1E8cB"
      values.connectors[7]:
+        "0xf5a3372ed529FCD0690b6013EAaE04170ec0626b"
      values.connectorsHash:
-        "0xec2e6a01e97f05ecaf76a70e989737bba3d7b1e9b1409ace525f00a0ee16c137"
+        "0x14c4bf163ae7a6600a7ae29528ef8d2fe05fb8d77cf4be6201ac10f3c92fcb2e"
    }
```

```diff
+   Status: CREATED
    contract NewOptimismHubConnector (0x23b7abe4cc664F24Eb68E80cFAdc572857799a94) {
    }
```

```diff
+   Status: CREATED
    contract MantleHubConnector (0x5B0E1a507E786f0a7c11C972ad5F4dd254661e24) {
    }
```

```diff
+   Status: CREATED
    contract ZkSyncHubConnector (0x63C6c79F3E79406B62f8623881cBFD7B2Ec1E8cB) {
    }
```

```diff
+   Status: CREATED
    contract PolygonZkHubConnector (0x7ed49D0a13255802A281C08688563bd8D5f726b1) {
    }
```

```diff
+   Status: CREATED
    contract OptimismV0HubConnector (0x9Ba7D2Ab079Bd1924859e2fECDAD1bEBe5B119Fa) {
    }
```

```diff
+   Status: CREATED
    contract NewWormholeHubConnector (0xf5a3372ed529FCD0690b6013EAaE04170ec0626b) {
    }
```

## Source code changes

```diff
.../@openzeppelin/contracts/utils/Address.sol      | 244 ++++++++
 .../contracts/messaging/connectors/Connector.sol   | 216 +++++++
 .../contracts/messaging/connectors/GasCap.sol      |  61 ++
 .../messaging/connectors/HubConnector.sol          |  44 ++
 .../connectors/mantle/MantleHubConnector.sol       | 187 ++++++
 .../connectors/optimism-v0/BaseOptimismV0.sol      |  28 +
 .../connectors/optimism-v0/lib/BytesUtils.sol      | 135 ++++
 .../connectors/optimism-v0/lib/MerkleTrie.sol      | 291 +++++++++
 .../connectors/optimism-v0/lib/OVMCodec.sol        |  40 ++
 .../optimism-v0/lib/PredeployAddresses.sol         |  21 +
 .../connectors/optimism-v0/lib/RLPReader.sol       | 381 ++++++++++++
 .../optimism-v0/lib/SecureMerkleTrie.sol           |  68 ++
 .../contracts/messaging/interfaces/IConnector.sol  |  64 ++
 .../messaging/interfaces/IRootManager.sol          |  22 +
 .../ambs/mantle/IStateCommitmentChain.sol          | 102 +++
 .../interfaces/ambs/optimism/OptimismAmb.sol       |  28 +
 .../contracts/shared/ProposedOwnable.sol           | 172 +++++
 .../shared/interfaces/IProposedOwnable.sol         |  42 ++
 .../contracts/shared/libraries/TypedMemView.sol    | 687 ++++++++++++++++++++
 .../ethereum/.code/MantleHubConnector/meta.txt     |   2 +
 .../@openzeppelin/contracts/utils/Address.sol      | 244 ++++++++
 .../contracts/messaging/connectors/Connector.sol   | 216 +++++++
 .../contracts/messaging/connectors/GasCap.sol      |  61 ++
 .../messaging/connectors/HubConnector.sol          |  44 ++
 .../messaging/connectors/optimism/BaseOptimism.sol |  28 +
 .../connectors/optimism/OptimismHubConnector.sol   | 148 +++++
 .../messaging/connectors/optimism/lib/Types.sol    |  84 +++
 .../contracts/messaging/interfaces/IConnector.sol  |  64 ++
 .../messaging/interfaces/IRootManager.sol          |  22 +
 .../interfaces/ambs/optimism/IOptimismPortal.sol   |  25 +
 .../interfaces/ambs/optimism/OptimismAmb.sol       |  28 +
 .../contracts/shared/ProposedOwnable.sol           | 172 +++++
 .../shared/interfaces/IProposedOwnable.sol         |  42 ++
 .../.code/NewOptimismHubConnector/meta.txt         |   2 +
 .../@openzeppelin/contracts/utils/Address.sol      | 244 ++++++++
 .../contracts/messaging/connectors/Connector.sol   | 216 +++++++
 .../contracts/messaging/connectors/GasCap.sol      |  61 ++
 .../messaging/connectors/HubConnector.sol          |  44 ++
 .../messaging/connectors/wormhole/BaseWormhole.sol | 137 ++++
 .../connectors/wormhole/WormholeHubConnector.sol   |  69 ++
 .../contracts/messaging/interfaces/IConnector.sol  |  64 ++
 .../messaging/interfaces/IRootManager.sol          |  22 +
 .../interfaces/ambs/wormhole/IWormholeReceiver.sol |  49 ++
 .../interfaces/ambs/wormhole/IWormholeRelayer.sol  | 691 +++++++++++++++++++++
 .../contracts/shared/ProposedOwnable.sol           | 172 +++++
 .../shared/interfaces/IProposedOwnable.sol         |  42 ++
 .../.code/NewWormholeHubConnector/meta.txt         |   2 +
 .../@openzeppelin/contracts/utils/Address.sol      | 244 ++++++++
 .../contracts/messaging/connectors/Connector.sol   | 216 +++++++
 .../contracts/messaging/connectors/GasCap.sol      |  61 ++
 .../messaging/connectors/HubConnector.sol          |  44 ++
 .../connectors/optimism-v0/BaseOptimismV0.sol      |  28 +
 .../optimism-v0/OptimismV0HubConnector.sol         | 186 ++++++
 .../connectors/optimism-v0/lib/BytesUtils.sol      | 135 ++++
 .../connectors/optimism-v0/lib/MerkleTrie.sol      | 291 +++++++++
 .../connectors/optimism-v0/lib/OVMCodec.sol        |  40 ++
 .../optimism-v0/lib/PredeployAddresses.sol         |  21 +
 .../connectors/optimism-v0/lib/RLPReader.sol       | 381 ++++++++++++
 .../optimism-v0/lib/SecureMerkleTrie.sol           |  68 ++
 .../contracts/messaging/interfaces/IConnector.sol  |  64 ++
 .../messaging/interfaces/IRootManager.sol          |  22 +
 .../interfaces/ambs/optimism/OptimismAmb.sol       |  28 +
 .../ambs/optimism-v0/IStateCommitmentChain.sol     | 101 +++
 .../contracts/shared/ProposedOwnable.sol           | 172 +++++
 .../shared/interfaces/IProposedOwnable.sol         |  42 ++
 .../contracts/shared/libraries/TypedMemView.sol    | 687 ++++++++++++++++++++
 .../ethereum/.code/OptimismV0HubConnector/meta.txt |   2 +
 .../@openzeppelin/contracts/utils/Address.sol      | 244 ++++++++
 .../contracts/messaging/connectors/Connector.sol   | 216 +++++++
 .../contracts/messaging/connectors/GasCap.sol      |  61 ++
 .../messaging/connectors/HubConnector.sol          |  44 ++
 .../connectors/polygonzk/BasePolygonZk.sol         |  67 ++
 .../connectors/polygonzk/PolygonZkHubConnector.sol |  42 ++
 .../contracts/messaging/interfaces/IConnector.sol  |  64 ++
 .../messaging/interfaces/IRootManager.sol          |  22 +
 .../ambs/polygonzk/IBridgeMessageReceiver.sol      |   9 +
 .../ambs/polygonzk/IPolygonZkEVMBridge.sol         | 117 ++++
 .../contracts/shared/ProposedOwnable.sol           | 172 +++++
 .../shared/interfaces/IProposedOwnable.sol         |  42 ++
 .../ethereum/.code/PolygonZkHubConnector/meta.txt  |   2 +
 .../@openzeppelin/contracts/utils/Address.sol      | 244 ++++++++
 .../contracts/messaging/connectors/Connector.sol   | 216 +++++++
 .../contracts/messaging/connectors/GasCap.sol      |  61 ++
 .../messaging/connectors/HubConnector.sol          |  44 ++
 .../connectors/zksync/ZkSyncHubConnector.sol       | 138 ++++
 .../contracts/messaging/interfaces/IConnector.sol  |  64 ++
 .../messaging/interfaces/IRootManager.sol          |  22 +
 .../messaging/interfaces/ambs/zksync/IZkSync.sol   | 191 ++++++
 .../contracts/shared/ProposedOwnable.sol           | 172 +++++
 .../shared/interfaces/IProposedOwnable.sol         |  42 ++
 .../ethereum/.code/ZkSyncHubConnector/meta.txt     |   2 +
 91 files changed, 10959 insertions(+)
```

Generated with discovered.json: 0x2205517d3479bdc0b356b55a229b76d5deb3faea

# Diff at Fri, 12 Jan 2024 10:04:41 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@29bf7dab0273e12e067979db6a3b622e6e34f64f block: 18941290
- current block number: 18990101

## Description

New router, empty at the time of discovering this

## Watched changes

```diff
    contract ConnextBridge (0x8898B472C54c31894e3B9bb83cEA802a5d0e63C6) {
      values.ROUTERS[24]:
+        "0xBa11aA59645a56031fedBcCF60D4f111534f2502"
    }
```

# Diff at Fri, 05 Jan 2024 13:12:40 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@9b1911b38ffdc811ae8c1518aae762bfe4831370 block: 18620064
- current block number: 18941290

## Description

This update is for the Bacco upgrade.
Read [this blog post](https://medium.com/connext/introducing-the-bacco-network-upgrade-73ad19cee9ed) before continuing to read further.

An example of Optimistic root proposal, finalization and submission into the Mainnet spoke.
A root is proposed [here](https://ethtx.info/mainnet/0x8623518d4c60d5cc85d817c3d7b17bafa24a3699756ff43d4c519dfe4e624397/).
After around 30 minutes it is [finalized](https://ethtx.info/mainnet/0x1dd1482174233218b482bcd6ccf971b52e021d5920254335fb46ea57e0e72f22/).
After some time, the root gets saved to the MainnetSpokeConnector [here](https://ethtx.info/mainnet/0x67415da90ec170de7c7138081b5446903258f0337ffe012228bbf0da8b5f6f3a/).

Any watcher can enable the Slow Mode which reverts back to the original behaviour of root propagation.
Only the owner can re-enable the optimistic mode.
There is no on-chain fraud proof, if the watcher believes that the proposed root is invalid he can put the bridge into the Slow Mode thus invalidating the proposed root.
There is no penalty (slashing) for invalidating a proposed root that is not fraudulent which allows for risk-minimized censoring.

### MainnetSpokeConnector

Connector allows to withdraw funds with the `withdrawFunds` function, emits an `FundsWithdrawn` event.

- MainnetSpokeConnector:

Saves the aggregated root while in Optimistic Mode.
Proposing and finalizing the aggregated root is deprecated in this contract.

- SpokeConnector:

Many new similar helper functions/values as in `RootManager`.

### RootManager

- Queue: Simpler check for removedItems, bool instead of counting.
- WatcherClient: Calling `renounceOwnership` now reverts instead of doing nothing.
- WatcherManager: Calling `renounceOwnership` now reverts instead of doing nothing.
- MerkleTreeManager: Now saving leaf and nonce status. Leaves have this FSM: None -> Proven -> Processed.
- RootManager:

Now keeps track of values that are required to operate in optimistic mode.
For example: the number of blocks that watchers have to claim a dispute, the proposed root hash as well as the list of white listed proposers.
Introduced functions to add/remove proposers, set new values for minimum dispute block length and the actual dispute block length.
Optimistic proposal of a root has the following path: `proposeAggregateRoot()` -> `finalize()`.
This workflow does not require the call to `propagate()`, but if someone calls that it's going to skip the Mainnet Spoke because it would use `sendMessage()` which is intended for Slow Mode only.
To send the aggregated root while the system is in Optimistic Mode one should use `sendRootToHubSpoke()`.
As written above, any watcher can enable Slow Mode, thus invalidating the proposed root hash, but only the owner can re-enable the Optimistic Mode.

Potential for an issue, in `setMinDisputeBlocks` the owner can set the
`minDisputeBlocks` but it does not check if the new value is less-or-equal than the `disputeBlocks`.

### WatcherManager

Calling `renounceOwnership` now reverts instead of doing nothing.

### ArbitrumHubConnector

Connector allows to withdraw funds with the `withdrawFunds` function, emits an `FundsWithdrawn` event.

### GnosisHubConnector

Introduced a lower gas threshold that needs to be breached to send a message to Gnosis.
Connector allows to withdraw funds with the `withdrawFunds` function, emits an `FundsWithdrawn` event.
Gas cap is now made public.

### LineaHubConnector

Connector allows to withdraw funds with the `withdrawFunds` function, emits an `FundsWithdrawn` event.

### OptimismHubConnector

The way the message root is recovered is simplified.
I'd assume that is because Optimism restructured their message binary packing.
Connector allows to withdraw funds with the `withdrawFunds` function, emits an `FundsWithdrawn` event.
Gas cap is now made public.

### PolygonHubConnector

Adds a check to make sure that it does not process the same message root twice.
Connector allows to withdraw funds with the `withdrawFunds` function, emits an `FundsWithdrawn` event.

### WormholeHubConnector

Connector allows to withdraw funds with the `withdrawFunds` function, emits an `FundsWithdrawn` event.
Gas cap is now made public.

## Watched changes

```diff
-   Status: DELETED
    contract LineaHubConnector OLD (0x076cD2B25cb1Ed7272d716bdeb4A8551CF606a3D) {
    }
```

```diff
-   Status: DELETED
    contract GnosisHubConnector OLD (0x245F757d660C3ec65416168690431076d58d6413) {
    }
```

```diff
    contract Connext Multisig (0x4d50a469fc788a3c0CdC8Fd67868877dCb246625) {
      values.getOwners.2:
-        "0xaBcC62f573963F0B1aD9334CaEd3f4Acab8d3FEA"
+        "0x450BCD84a040E6975a8092114A09cD37fA140873"
    }
```

```diff
-   Status: DELETED
    contract OptimismHubConnector OLD (0x66a425f09cfd613d40A986B3ef800AA7604C8eeE) {
    }
```

```diff
-   Status: DELETED
    contract WormholeHubConnector OLD (0x69009c6f567590d8B469dbF4C8808e8ee32b8a45) {
    }
```

```diff
-   Status: DELETED
    contract WatcherManager (0x6a595E41893a5ACBA9dBf8288B92eb71106Ba7A6) {
    }
```

```diff
    contract GnosisSafe (0x8180D59b7175d4064bDFA8138A58e9baBFFdA44a) {
      values.getOwners[3]:
+        "0x837219D7a9C666F5542c4559Bf17D7B804E5c5fe"
      values.getOwners.2:
-        "0x837219D7a9C666F5542c4559Bf17D7B804E5c5fe"
+        "0x1d933Fd71FF07E69f066d50B39a7C34EB3b69F05"
      values.getOwners.1:
-        "0x1d933Fd71FF07E69f066d50B39a7C34EB3b69F05"
+        "0xcc400c09ecBAC3e0033e4587BdFAABB26223e37d"
      values.getOwners.0:
-        "0xcc400c09ecBAC3e0033e4587BdFAABB26223e37d"
+        "0x363605C0bdE9F1F5053aDA30618d95dbFc109Bf5"
    }
```

```diff
    contract ConnextBridge (0x8898B472C54c31894e3B9bb83cEA802a5d0e63C6) {
      values.RELAYERS[12]:
+        "0xB4F8D176466f5F544bAd53737bffAaeA17185c05"
      values.xAppConnectionManager:
-        "0xF7c4d7dcEc2c09A15f2Db5831d6d25eAEf0a296c"
+        "0x02fdF04AF077687CDA03Bd3162388b7972A4a1Cc"
    }
```

```diff
-   Status: DELETED
    contract PolygonHubConnector OLD (0xB01BC38909413f5dbb8F18a9b5787A62ce1282aE) {
    }
```

```diff
-   Status: DELETED
    contract ArbitrumHubConnector OLD (0xd151C9ef49cE2d30B829a98A07767E3280F70961) {
    }
```

```diff
-   Status: DELETED
    contract RootManager (0xd5d61E9dfb6680Cba8353988Ba0337802811C2e1) {
    }
```

```diff
-   Status: DELETED
    contract MainnetSpokeConnector (0xF7c4d7dcEc2c09A15f2Db5831d6d25eAEf0a296c) {
    }
```

```diff
+   Status: CREATED
    contract MainnetSpokeConnector (0x02fdF04AF077687CDA03Bd3162388b7972A4a1Cc) {
    }
```

```diff
+   Status: CREATED
    contract RootManager (0x523AB7424AD126809b1d7A134eb6E0ee414C9B3A) {
    }
```

```diff
+   Status: CREATED
    contract LineaHubConnector (0x56Ab287e5c33Ee70158c951f34818bd095446255) {
    }
```

```diff
+   Status: CREATED
    contract OptimismHubConnector (0x5c2149869146DeA55cDD1CF2DD828e4e1548bb2A) {
    }
```

```diff
+   Status: CREATED
    contract WatcherManager (0x79e6E0242405A66B2dd8B96DEd3b2F0216Fd417d) {
    }
```

```diff
+   Status: CREATED
    contract ArbitrumHubConnector (0x83096c7455f24E593aaC9A7c73f849d36d3EEb82) {
    }
```

```diff
+   Status: CREATED
    contract WormholeHubConnector (0xae6B9cDE6191b710F5A18D82f751Ba52B78a99DA) {
    }
```

```diff
+   Status: CREATED
    contract GnosisHubConnector (0xF1c78967584D5E0ffF66dA103b8eb06c82EC020d) {
    }
```

## Source code changes

```diff
.../crosschain/arbitrum/LibArbitrumL1.sol          |   0
 .../@openzeppelin/contracts/crosschain/errors.sol  |   0
 .../@openzeppelin/contracts/utils/Address.sol      | 244 ++++++++
 .../contracts/vendor/arbitrum/IBridge.sol          |   0
 .../contracts/vendor/arbitrum/IOutbox.sol          |   0
 .../contracts/messaging/connectors/Connector.sol   |  23 +
 .../messaging/connectors/HubConnector.sol          |   0
 .../connectors/arbitrum/ArbitrumHubConnector.sol   |   0
 .../contracts/messaging/interfaces/IConnector.sol  |   0
 .../messaging/interfaces/IRootManager.sol          |   0
 .../interfaces/ambs/arbitrum/IArbitrumInbox.sol    |   0
 .../interfaces/ambs/arbitrum/IArbitrumOutbox.sol   |   0
 .../interfaces/ambs/arbitrum/IArbitrumRollup.sol   |   0
 .../contracts/shared/ProposedOwnable.sol           |   0
 .../shared/interfaces/IProposedOwnable.sol         |   0
 .../contracts/shared/libraries/TypedMemView.sol    |   0
 .../ethereum/.code/ArbitrumHubConnector/meta.txt   |   2 +
 .../ArbitrumHubConnector OLD/meta.txt => /dev/null |   2 -
 .../@openzeppelin/contracts/utils/Address.sol      | 244 ++++++++
 .../contracts}/messaging/connectors/Connector.sol  |  23 +
 .../contracts}/messaging/connectors/GasCap.sol     |   7 +-
 .../messaging/connectors/HubConnector.sol          |   0
 .../messaging/connectors/gnosis/GnosisBase.sol     |  29 +
 .../connectors/gnosis/GnosisHubConnector.sol       |   0
 .../contracts}/messaging/interfaces/IConnector.sol |   0
 .../messaging/interfaces/IRootManager.sol          |   0
 .../messaging/interfaces/ambs/GnosisAmb.sol        |   0
 .../contracts}/shared/ProposedOwnable.sol          |   0
 .../shared/interfaces/IProposedOwnable.sol         |   0
 .../ethereum/.code/GnosisHubConnector/meta.txt     |   2 +
 .../GnosisHubConnector OLD/meta.txt => /dev/null   |   2 -
 .../@openzeppelin/contracts/utils/Address.sol      | 244 ++++++++
 .../contracts}/messaging/connectors/Connector.sol  |  23 +
 .../messaging/connectors/HubConnector.sol          |   0
 .../messaging/connectors/linea/LineaBase.sol       |   0
 .../connectors/linea/LineaHubConnector.sol         |   0
 .../contracts}/messaging/interfaces/IConnector.sol |   0
 .../messaging/interfaces/IRootManager.sol          |   0
 .../messaging/interfaces/ambs/LineaAmb.sol         |   0
 .../contracts}/shared/ProposedOwnable.sol          |   0
 .../shared/interfaces/IProposedOwnable.sol         |   0
 .../ethereum/.code/LineaHubConnector/meta.txt      |   2 +
 .../LineaHubConnector OLD/meta.txt => /dev/null    |   2 -
 .../contracts/messaging/MerkleTreeManager.sol      |  66 +-
 .../contracts/messaging/WatcherClient.sol          |   4 +-
 .../contracts/messaging/WatcherManager.sol         |   4 +-
 .../contracts/messaging/connectors/Connector.sol   |  23 +
 .../messaging/connectors/SpokeConnector.sol        | 508 ++++++++++++---
 .../connectors/mainnet/MainnetSpokeConnector.sol   |  83 ++-
 .../messaging/interfaces/IHubSpokeConnector.sol    |   6 +
 .../contracts/messaging/interfaces/IOutbox.sol     |   5 +
 .../contracts/messaging/libraries/SnapshotId.sol   |  25 +
 .../MainnetSpokeConnector/meta.txt                 |   2 +-
 .../@openzeppelin/contracts/utils/Address.sol      | 244 ++++++++
 .../contracts}/messaging/connectors/Connector.sol  |  23 +
 .../contracts}/messaging/connectors/GasCap.sol     |   7 +-
 .../messaging/connectors/HubConnector.sol          |   0
 .../messaging/connectors/optimism/BaseOptimism.sol |   0
 .../connectors/optimism/OptimismHubConnector.sol   |  14 +-
 .../messaging/connectors/optimism/lib/Types.sol    |   0
 .../contracts}/messaging/interfaces/IConnector.sol |   0
 .../messaging/interfaces/IRootManager.sol          |   0
 .../interfaces/ambs/optimism/IOptimismPortal.sol   |   0
 .../interfaces/ambs/optimism/OptimismAmb.sol       |   0
 .../contracts}/shared/ProposedOwnable.sol          |   0
 .../shared/interfaces/IProposedOwnable.sol         |   0
 .../ethereum/.code/OptimismHubConnector/meta.txt   |   2 +
 .../OptimismHubConnector OLD/meta.txt => /dev/null |   2 -
 .../shared/libraries/TypedMemView.sol => /dev/null | 687 ---------------------
 .../connectors/Connector.sol => /dev/null          | 193 ------
 .../polygon/PolygonHubConnector.sol => /dev/null   |  65 --
 .../polygon/lib/ExitPayloadReader.sol => /dev/null | 164 -----
 .../connectors/polygon/lib/Merkle.sol => /dev/null |  40 --
 .../lib/MerklePatriciaProof.sol => /dev/null       | 153 -----
 .../polygon/lib/RLPReader.sol => /dev/null         | 342 ----------
 .../tunnel/FxBaseRootTunnel.sol => /dev/null       | 180 ------
 .../PolygonHubConnector OLD/meta.txt => /dev/null  |   2 -
 .../@openzeppelin/contracts/utils/Address.sol      | 244 ++++++++
 .../contracts/messaging/MerkleTreeManager.sol      |  66 +-
 .../contracts/messaging/RootManager.sol            | 487 ++++++++++++++-
 .../contracts/messaging/WatcherClient.sol          |   4 +-
 .../contracts/messaging/WatcherManager.sol         |   4 +-
 .../messaging/interfaces/IHubSpokeConnector.sol    |   6 +
 .../contracts/messaging/libraries/Queue.sol        |   8 +-
 .../contracts/messaging/libraries/SnapshotId.sol   |  25 +
 .../{.code@18620064 => .code}/RootManager/meta.txt |   2 +-
 .../WatcherManager/messaging/WatcherManager.sol    |   4 +-
 .../WatcherManager/meta.txt                        |   2 +-
 .../@openzeppelin/contracts/utils/Address.sol      | 244 ++++++++
 .../contracts/messaging/connectors/Connector.sol   | 216 +++++++
 .../contracts}/messaging/connectors/GasCap.sol     |   7 +-
 .../messaging/connectors/HubConnector.sol          |   0
 .../messaging/connectors/wormhole/BaseWormhole.sol |   0
 .../connectors/wormhole/WormholeHubConnector.sol   |   0
 .../contracts}/messaging/interfaces/IConnector.sol |   0
 .../messaging/interfaces/IRootManager.sol          |   0
 .../interfaces/ambs/wormhole/IWormholeReceiver.sol |   0
 .../interfaces/ambs/wormhole/IWormholeRelayer.sol  |   0
 .../contracts}/shared/ProposedOwnable.sol          |   0
 .../shared/interfaces/IProposedOwnable.sol         |   0
 .../ethereum/.code/WormholeHubConnector/meta.txt   |   2 +
 .../connectors/Connector.sol => /dev/null          | 193 ------
 .../connectors/HubConnector.sol => /dev/null       |  44 --
 .../interfaces/IConnector.sol => /dev/null         |  64 --
 .../interfaces/IRootManager.sol => /dev/null       |  22 -
 .../WormholeHubConnector OLD/meta.txt => /dev/null |   2 -
 .../shared/ProposedOwnable.sol => /dev/null        | 172 ------
 .../interfaces/IProposedOwnable.sol => /dev/null   |  42 --
 108 files changed, 2990 insertions(+), 2563 deletions(-)
```

## Config related changes

Following changes come from updates made to the config file,
not from differences found during discovery. Values are
for block 18620064 (main branch discovery), not current.

```diff
    contract LineaHubConnector (0x076cD2B25cb1Ed7272d716bdeb4A8551CF606a3D) {
      name:
-        "LineaHubConnector"
+        "LineaHubConnector OLD"
    }
```

```diff
    contract OptimisticGovernor (0x172fB6b07D6aB708dd67392a09e1c40d16dA0460) {
      upgradeability.type:
-        "immutable"
+        "gnosis safe zodiac module"
      upgradeability.avatar:
+        "0x4d50a469fc788a3c0CdC8Fd67868877dCb246625"
      upgradeability.target:
+        "0x4d50a469fc788a3c0CdC8Fd67868877dCb246625"
      upgradeability.guard:
+        "0x0000000000000000000000000000000000000000"
    }
```

```diff
    contract GnosisHubConnector (0x245F757d660C3ec65416168690431076d58d6413) {
      name:
-        "GnosisHubConnector"
+        "GnosisHubConnector OLD"
    }
```

```diff
    contract OptimismHubConnector (0x66a425f09cfd613d40A986B3ef800AA7604C8eeE) {
      name:
-        "OptimismHubConnector"
+        "OptimismHubConnector OLD"
    }
```

```diff
    contract WormholeHubConnector (0x69009c6f567590d8B469dbF4C8808e8ee32b8a45) {
      name:
-        "WormholeHubConnector"
+        "WormholeHubConnector OLD"
    }
```

```diff
    contract PolygonHubConnector (0xB01BC38909413f5dbb8F18a9b5787A62ce1282aE) {
      name:
-        "PolygonHubConnector"
+        "PolygonHubConnector OLD"
    }
```

```diff
    contract ArbitrumHubConnector (0xd151C9ef49cE2d30B829a98A07767E3280F70961) {
      name:
-        "ArbitrumHubConnector"
+        "ArbitrumHubConnector OLD"
    }
```

# Diff at Tue, 21 Nov 2023 12:24:08 GMT:

- author: Luca Donno (<donnoh99@gmail.com>)
- comparing to: main@9f0318505c4ed8d37a7f843ad157191e2e5c6ee2

## Description

Added connector for Linea.

## Watched changes

```diff
    contract RootManager (0xd5d61E9dfb6680Cba8353988Ba0337802811C2e1) {
      values.connectors[6]:
+        "0x076cD2B25cb1Ed7272d716bdeb4A8551CF606a3D"
      values.connectorsHash:
-        "0x1ab775b9545e9c3175b57958dc75c2a1cf76c3d166d0527bbf7d51fe434efa00"
+        "0x9e95f76ad984f886dd7a8431e8fa5c405fce573b4b2a4671aeb68d7464ab164b"
    }
```

```diff
+   Status: CREATED
    contract LineaHubConnector (0x076cD2B25cb1Ed7272d716bdeb4A8551CF606a3D) {
    }
```

## Source code changes

```diff
.../messaging/connectors/Connector.sol             | 193 +++++++++++++++++++++
 .../messaging/connectors/HubConnector.sol          |  44 +++++
 .../messaging/connectors/linea/LineaBase.sol       |  16 ++
 .../connectors/linea/LineaHubConnector.sol         |  73 ++++++++
 .../messaging/interfaces/IConnector.sol            |  64 +++++++
 .../messaging/interfaces/IRootManager.sol          |  22 +++
 .../messaging/interfaces/ambs/LineaAmb.sol         |  88 ++++++++++
 .../ethereum/.code/LineaHubConnector/meta.txt      |   2 +
 .../LineaHubConnector/shared/ProposedOwnable.sol   | 172 ++++++++++++++++++
 .../shared/interfaces/IProposedOwnable.sol         |  42 +++++
 10 files changed, 716 insertions(+)
```

# Diff at Tue, 07 Nov 2023 11:21:30 GMT:

- author: Amin Latifi (<a.latifi.al@gmail.com>)
- comparing to: main@bcbd5d376f2f1df169f0ac5ce430862eef6be17f

## Description

There are changes in the owners of Connext Multisig and WormholeHubConnector contracts.

## Watched changes

```diff
-   Status: DELETED
    contract Connext Multisig Member (0x278F956cde8D0816786A83Aea58dc7F76c13AD8e) {
    }
```

```diff
    contract Connext Multisig (0x4d50a469fc788a3c0CdC8Fd67868877dCb246625) {
      values.getOwners[14]:
-        "0x9b903Ae440CB1f01c342466D6DB6b57A5BF98C3f"
      values.getOwners[13]:
-        "0x48fda6a16dEe5954bb0989b5B581d0623b48F06A"
      values.getOwners[12]:
-        "0xf8d8aF083aC452b05b0D2eb4499AD900324b5754"
      values.getOwners.11:
-        "0x3d7dF98257E5CEe5f032fd06a0aA510F89A19A2e"
+        "0x9b903Ae440CB1f01c342466D6DB6b57A5BF98C3f"
      values.getOwners.10:
-        "0x7fB1B8D2C4a8186426Fb12a4Ae483f0093ED2315"
+        "0xf8d8aF083aC452b05b0D2eb4499AD900324b5754"
      values.getOwners.0:
-        "0x278F956cde8D0816786A83Aea58dc7F76c13AD8e"
+        "0xdFa28361aC40679cC5D8EFa74c0421961397f2Eb"
    }
```

```diff
    contract WormholeHubConnector (0x69009c6f567590d8B469dbF4C8808e8ee32b8a45) {
      values.owner:
-        "0xade09131C6f43fe22C2CbABb759636C43cFc181e"
+        "0x4d50a469fc788a3c0CdC8Fd67868877dCb246625"
    }
```

## Source code changes

```diff
Error with git diff: warning: in the working copy of 'packages/backend/discovery/amarok/ethereum/.code@18263156/Connext Multisig/proxy/GnosisSafeProxy.sol', CRLF will be replaced by LF the next time Git touches it
warning: in the working copy of 'packages/backend/discovery/amarok/ethereum/.code/Connext Multisig/proxy/GnosisSafeProxy.sol', CRLF will be replaced by LF the next time Git touches it
warning: in the working copy of 'packages/backend/discovery/amarok/ethereum/.code@18263156/Connext Multisig 2/proxy/GnosisSafeProxy.sol', CRLF will be replaced by LF the next time Git touches it
warning: in the working copy of 'packages/backend/discovery/amarok/ethereum/.code/Connext Multisig 2/proxy/GnosisSafeProxy.sol', CRLF will be replaced by LF the next time Git touches it
warning: in the working copy of 'packages/backend/discovery/amarok/ethereum/.code@18263156/Finder/Finder.sol', CRLF will be replaced by LF the next time Git touches it
warning: in the working copy of 'packages/backend/discovery/amarok/ethereum/.code/Finder/Finder.sol', CRLF will be replaced by LF the next time Git touches it
warning: in the working copy of 'packages/backend/discovery/amarok/ethereum/.code@18263156/GnosisSafe/proxy/Proxy.sol', CRLF will be replaced by LF the next time Git touches it
warning: in the working copy of 'packages/backend/discovery/amarok/ethereum/.code/GnosisSafe/proxy/Proxy.sol', CRLF will be replaced by LF the next time Git touches it
warning: in the working copy of 'packages/backend/discovery/amarok/ethereum/.code@18263156/VotingToken/VotingToken.sol', CRLF will be replaced by LF the next time Git touches it
warning: in the working copy of 'packages/backend/discovery/amarok/ethereum/.code/VotingToken/VotingToken.sol', CRLF will be replaced by LF the next time Git touches it
warning: in the working copy of 'packages/backend/discovery/amarok/ethereum/.code@18263156/Connext Multisig Member/proxy/GnosisSafeProxy.sol', CRLF will be replaced by LF the next time Git touches it

```

# Diff at Mon, 02 Oct 2023 13:31:00 GMT:

- author: Luca Donno (<donnoh99@gmail.com>)
- comparing to: main@10dbc30af490bd7af5cfca51b827ce3f10182f4d

## Watched changes

```diff
    contract Connext Multisig 2 (0xf2964cCcB7CDA9e808aaBe8DB0DDDAF7890dd378) {
      values.getThreshold:
-        1
+        3
    }
```
