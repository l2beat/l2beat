# Diff at Fri, 05 Jan 2024 13:12:40 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: master@9b1911b38ffdc811ae8c1518aae762bfe4831370 block: 18620064
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
- comparing to: master@9f0318505c4ed8d37a7f843ad157191e2e5c6ee2

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
- comparing to: master@bcbd5d376f2f1df169f0ac5ce430862eef6be17f

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
- comparing to: master@10dbc30af490bd7af5cfca51b827ce3f10182f4d

## Watched changes

```diff
    contract Connext Multisig 2 (0xf2964cCcB7CDA9e808aaBe8DB0DDDAF7890dd378) {
      values.getThreshold:
-        1
+        3
    }
```
