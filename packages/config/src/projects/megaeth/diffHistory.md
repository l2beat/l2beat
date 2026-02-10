Generated with discovered.json: 0x3f9928ccc9fed0fd44fe5e34cffe0d300da2d9bf

# Diff at Tue, 10 Feb 2026 14:12:07 GMT:

- author: vincfurc (<vincfurc@users.noreply.github.com>)
- comparing to: main@3ed515d72a3ee13169bc3e44f3cacfb40ed698a3 block: 1769535661
- current timestamp: 1770732659

## Description

Major update: MegaETH transitions to onchain EigenDA certificate verification via a new BunnyInbox contract.

**SystemConfig upgrade (v2.5.0 → v2.7.0):**
Upgraded implementation from 0x2425EB to 0x7f84fE. The only code change is the addition of a new `setBatchInbox(address)` function allowing the owner to change the batch inbox address on-chain ([diff](https://disco.l2beat.com/diff/eth:0x2425EB983A470eDE96E33c4E969Ac5440a80a639/eth:0x7f84fEb1cEb9C91844ee80C63d153d9128Fb40e9)). The batchInbox was changed from the old EOA (0x00656C) to the new BunnyInbox contract (0x02B8d1). blobbasefeeScalar set to 0.

**BunnyInbox (new, 0x02B8d1):**
New upgradeable contract serving as the batch inbox. Its `fallback()` function strips a 4-byte prefix from calldata, RLP-decodes an EigenDACertV3 struct, and calls `EigenDACertVerifier.checkDACertReverts()` to validate the EigenDA certificate on-chain. This means every batch submission now verifies the EigenDA data availability certificate on L1.

**EigenDACertVerifier (new, 0xa4F386) + EigenDA/EigenLayer infrastructure:**
An immutable EigenDA V3 certificate verifier referenced by BunnyInbox. It verifies batch data attestations against operator signatures and stake thresholds via the EigenDAServiceManager. 

**Stale proof system config:**
The KailuaGame and KailuaTreasury have an immutable `ROLLUP_CONFIG_HASH` (0x16ebac7d...) that commits to the rollup config including the batch inbox address. Since the batch inbox changed from the old EOA (0x00656C) to BunnyInbox (0x02B8d1), but the games were NOT redeployed, the on-chain `ROLLUP_CONFIG_HASH` no longer matches the current chain config. Any ZK proof generated against the current derivation pipeline would produce a different config hash and fail on-chain verification. Additionally, the `FPVM_IMAGE_ID` likely needs updating so the prover program rejects reverted BunnyInbox transactions - otherwise the batcher could submit invalid DA certs that revert on L1 but are still picked up by derivation. The games should be redeployed with updated `ROLLUP_CONFIG_HASH` and `FPVM_IMAGE_ID`.

**Governance changes:**
- MegaETH Safe multisig changed from 4/8 (50%) to 6/10 (60%) threshold
- Two new members added: a 1-of-3 nested Safe (0x63eC, nonce 0) and an EOA (0x0D17)
- ProxyAdmin owners (0x15fC, 0xab48) transferred from EOA (0x0A38) to the MegaETH Safe (0x92e0) - this is a positive decentralization step
- DisputeGameFactory and DelayedWETH ownership also transferred to the Safe
- Guardian role on SuperchainConfig and OptimismPortal2 transferred from EOA (0x0A38) to Safe (0xB2A9, a 1-of-1 Safe owned by the same EOA 0x0A38)
- MegaUSDmPreDeposit deposits deactivated (isDepositActive: false)

## Watched changes

```diff
    contract SystemConfig (eth:0x1ED92E1bc9A2735216540EDdD0191144681cb77E) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      sourceHashes.1:
-        "0x5f25d989fb6ccdc8dcf6fec90727faecf13ba2e3a9cc2d4ca902a5be71e10b9a"
+        "0x18ecfc662e320a3cf78978511db8f7d6f3819d32a52e70d74cc636c9a43335e8"
      values.$implementation:
-        "eth:0x2425EB983A470eDE96E33c4E969Ac5440a80a639"
+        "eth:0x7f84fEb1cEb9C91844ee80C63d153d9128Fb40e9"
      values.$pastUpgrades.1:
+        ["2026-02-09T04:47:59.000Z","0x9c539698c6852b92c7289498f8b808d3ede8c412362dbb31c485c94e09e0cd10",["eth:0x7f84fEb1cEb9C91844ee80C63d153d9128Fb40e9"]]
      values.$upgradeCount:
-        1
+        2
      values.batchInbox:
-        "eth:0x00656C604FC470e6a566A695B74455e18a6D75D3"
+        "eth:0x02B8d1329B653d6f53A8420C8DDbBbb5518F51b2"
      values.sequencerInbox:
-        "eth:0x00656C604FC470e6a566A695B74455e18a6D75D3"
+        "eth:0x02B8d1329B653d6f53A8420C8DDbBbb5518F51b2"
      values.version:
-        "2.5.0"
+        "2.7.0"
      implementationNames.eth:0x2425EB983A470eDE96E33c4E969Ac5440a80a639:
-        "SystemConfig"
      implementationNames.eth:0x7f84fEb1cEb9C91844ee80C63d153d9128Fb40e9:
+        "SystemConfig"
    }
```

```diff
    contract Safe (eth:0x92e0E0B15e3e99b32c9ED9AD284F939553C7b7d6) {
    +++ description: None
      values.$members.0:
+        "eth:0x63eCafD27E0B86B37903c8aA64beD47244Ad909A"
      values.$members.1:
+        "eth:0x0D173c5d6d6018075f63F4977ae7561f7F9A40eF"
      values.$threshold:
-        4
+        6
      values.multisigThreshold:
-        "4 of 8 (50%)"
+        "6 of 10 (60%)"
      receivedPermissions.3:
+        {"permission":"upgrade","from":"eth:0x02B8d1329B653d6f53A8420C8DDbBbb5518F51b2","role":"admin"}
    }
```

```diff
+   Status: CREATED
    contract EigenDAOperationsMultisig (eth:0x002721B4790d97dC140a049936aA710152Ba92D5)
    +++ description: None
```

```diff
+   Status: CREATED
    contract StakeRegistry (eth:0x006124Ae7976137266feeBFb3F4D2BE4C073139D)
    +++ description: Keeps track of the total stake of each operator.
```

```diff
+   Status: CREATED
    contract BLSApkRegistry (eth:0x00A5Fd09F6CeE6AE9C8b0E5e33287F7c82880505)
    +++ description: Keeps track of the BLS public keys of each operator and the quorum aggregated keys.
```

```diff
+   Status: CREATED
    contract BunnyInbox (eth:0x02B8d1329B653d6f53A8420C8DDbBbb5518F51b2)
    +++ description: Onchain EigenDA certificate verification inbox. Receives batch data, strips 4-byte prefix, RLP-decodes EigenDACertV3 and calls the EigenDACertVerifier to validate the certificate. Used as the batch inbox for EigenDA-based data availability.
```

```diff
+   Status: CREATED
    contract RegistryCoordinator (eth:0x0BAAc79acD45A023E19345c352d8a7a83C4e5656)
    +++ description: Operators register here with an AVS: The coordinator has three registries: 1) a `StakeRegistry` that keeps track of operators' stakes, 2) a `BLSApkRegistry` that keeps track of operators' BLS public keys and aggregate BLS public keys for each quorum, 3) an `IndexRegistry` that keeps track of an ordered list of operators for each quorum.
```

```diff
+   Status: CREATED
    contract PauserRegistry (eth:0x0c431C66F4dE941d089625E5B423D00707977060)
    +++ description: Defines and stores pauser and unpauser roles for EigenDA contracts.
```

```diff
+   Status: CREATED
    contract EjectionManager (eth:0x130d8EA0052B45554e4C99079B84df292149Bd5E)
    +++ description: Contract used for ejection of operators from the RegistryCoordinator for violating the Service Legal Agreement (SLA).
```

```diff
+   Status: CREATED
    reference AVSDirectory (eth:0x135DDa560e946695d6f155dACaFC6f1F25C1F5AF)
    +++ description: None
```

```diff
+   Status: CREATED
    contract EigenLayerRewardsInitiatorMultisig (eth:0x178eeeA9E0928dA2153A1d7951FBe30CF8371b8A)
    +++ description: None
```

```diff
+   Status: CREATED
    contract EigenDA Multisig (eth:0x338477FfaF63c04AC06048787f910671eC914B34)
    +++ description: None
```

```diff
+   Status: CREATED
    reference EigenLayerOwningMultisig (eth:0x369e6F597e22EaB55fFb173C6d9cD234BD699111)
    +++ description: None
```

```diff
+   Status: CREATED
    reference DelegationManager (eth:0x39053D51B77DC0d36036Fc1fCc8Cb819df8Ef37A)
    +++ description: None
```

```diff
+   Status: CREATED
    reference EigenLayerPauserMultisig (eth:0x5050389572f2d220ad927CcbeA0D406831012390)
    +++ description: None
```

```diff
+   Status: CREATED
    contract SocketRegistry (eth:0x5a3eD432f2De9645940333e4474bBAAB8cf64cf2)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Safe (eth:0x63eCafD27E0B86B37903c8aA64beD47244Ad909A)
    +++ description: None
```

```diff
+   Status: CREATED
    contract EigenDADisperserRegistry (eth:0x78cb05379a3b66E5227f2C1496432D7FFE794Fad)
    +++ description: Registry for EigenDA disperser info such as disperser key to address mapping.
```

```diff
+   Status: CREATED
    contract ProxyAdmin (eth:0x8247EF5705d3345516286B72bFE6D690197C2E99)
    +++ description: None
```

```diff
+   Status: CREATED
    contract EigenDAServiceManager (eth:0x870679E138bCdf293b7Ff14dD44b70FC97e12fc0)
    +++ description: Bridge contract that accepts blob batches data availability attestations. Batches availability is attested by EigenDA operators signatures and relayed to the service manager contract by the EigenDA disperser.
```

```diff
+   Status: CREATED
    contract EigenDACertVerifier (eth:0xa4F38615e6a1846ccD7ff08E8179CBdAC8F5ff3B)
    +++ description: A DA verifier contract for EigenDA V2 certificates. The verifier is used to verify the certificate against operator signatures and stake thresholds.
```

```diff
+   Status: CREATED
    contract PaymentVault (eth:0xb2e7ef419a2A399472ae22ef5cFcCb8bE97A4B05)
    +++ description: Entrypoint for making reservations and on demand payments for EigenDA.
```

```diff
+   Status: CREATED
    contract IndexRegistry (eth:0xBd35a7a1CDeF403a6a99e4E8BA0974D198455030)
    +++ description: A registry contract that keeps track of an ordered list of operators for each quorum.
```

```diff
+   Status: CREATED
    reference EigenLayerOperationsMultisig (eth:0xBE1685C81aA44FF9FB319dD389addd9374383e90)
    +++ description: None
```

```diff
+   Status: CREATED
    contract EigenDARelayRegistry (eth:0xD160e6C1543f562fc2B0A5bf090aED32640Ec55B)
    +++ description: Registry for EigenDA relay keys, maps key to address.
```

```diff
+   Status: CREATED
    contract EigenDAThresholdRegistry (eth:0xdb4c89956eEa6F606135E7d366322F2bDE609F15)
    +++ description: Registry of EigenDA threshold (i.e, adversary and confirmation threshold percentage for a quorum)
```

## Source code changes

```diff
.../.flat/BLSApkRegistry/BLSApkRegistry.sol        | 1038 +++++++
 .../TransparentUpgradeableProxy.p.sol              |  631 +++++
 .../megaeth/.flat/BunnyInbox/BunnyInbox.sol        | 1402 ++++++++++
 .../BunnyInbox/TransparentUpgradeableProxy.p.sol   |  631 +++++
 .../megaeth/.flat/EigenDA Multisig/Safe.sol        | 1088 ++++++++
 .../megaeth/.flat/EigenDA Multisig/SafeProxy.p.sol |   37 +
 .../projects/megaeth/.flat/EigenDACertVerifier.sol | 1329 +++++++++
 .../EigenDADisperserRegistry.sol                   |  410 +++
 .../TransparentUpgradeableProxy.p.sol              |  631 +++++
 .../.flat/EigenDAOperationsMultisig/Safe.sol       | 1088 ++++++++
 .../EigenDAOperationsMultisig/SafeProxy.p.sol      |   37 +
 .../EigenDARelayRegistry/EigenDARelayRegistry.sol  |  420 +++
 .../TransparentUpgradeableProxy.p.sol              |  631 +++++
 .../EigenDAServiceManager.sol                      | 2699 +++++++++++++++++++
 .../TransparentUpgradeableProxy.p.sol              |  631 +++++
 .../EigenDAThresholdRegistry.sol                   |  715 +++++
 .../TransparentUpgradeableProxy.p.sol              |  631 +++++
 .../GnosisSafe.sol                                 |  953 +++++++
 .../GnosisSafeProxy.p.sol                          |   35 +
 .../.flat/EjectionManager/EjectionManager.sol      |  593 ++++
 .../TransparentUpgradeableProxy.p.sol              |  631 +++++
 .../megaeth/.flat/IndexRegistry/IndexRegistry.sol  |  724 +++++
 .../TransparentUpgradeableProxy.p.sol              |  631 +++++
 .../src/projects/megaeth/.flat/PauserRegistry.sol  |   58 +
 .../megaeth/.flat/PaymentVault/PaymentVault.sol    |  594 ++++
 .../PaymentVault/TransparentUpgradeableProxy.p.sol |  631 +++++
 ...:0x8247EF5705d3345516286B72bFE6D690197C2E99.sol |  147 +
 .../RegistryCoordinator/RegistryCoordinator.sol    | 2847 ++++++++++++++++++++
 .../TransparentUpgradeableProxy.p.sol              |  631 +++++
 .../Safe.sol                                       | 1088 ++++++++
 .../SafeProxy.p.sol                                |   37 +
 .../.flat/SocketRegistry/SocketRegistry.sol        |   53 +
 .../TransparentUpgradeableProxy.p.sol              |  631 +++++
 .../megaeth/.flat/StakeRegistry/StakeRegistry.sol  | 1176 ++++++++
 .../TransparentUpgradeableProxy.p.sol              |  631 +++++
 .../SystemConfig/SystemConfig.sol                  |   16 +-
 36 files changed, 26154 insertions(+), 2 deletions(-)
```

Generated with discovered.json: 0x3e3c2ac5fc6f4de059ee493adb99384715acc81c

# Diff at Wed, 21 Jan 2026 10:06:24 GMT:

- author: vincfurc (<vincfurc@users.noreply.github.com>)
- comparing to: main@a72aa7d50f1dddc0c7a6eae7f60679fc94e4eabf block: 1767341266
- current timestamp: 1768989919

## Description

New member added to MegaETH Safe multisig (now 4/8, previously 4/7).

## Watched changes

```diff
    contract Safe (eth:0x92e0E0B15e3e99b32c9ED9AD284F939553C7b7d6) {
    +++ description: None
      values.$members.0:
+        "eth:0x070Cf79fB8D0A0BcBe2d017c6A059148705c9800"
      values.multisigThreshold:
-        "4 of 7 (57%)"
+        "4 of 8 (50%)"
    }
```

Generated with discovered.json: 0x7c45d450fb2bdc3b24ca26628384d125cdc2ff16

# Diff at Fri, 02 Jan 2026 08:09:15 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@af64ce90718299c8e665957964f0083baa176a36 block: 1764760164
- current timestamp: 1767341266

## Description

Initial discovery. Untemplatized contracts diff with most similar templatized:
- SystemConfig:                                                                                                                                                                                                       
  https://disco.l2beat.com/diff/eth:0x340f923E5c7cbB2171146f64169EC9d5a9FfE647/eth:0x2425EB983A470eDE96E33c4E969Ac5440a80a639  (higher gas limit)
- OptimismPortal2:                                                                                                                                                                                              
  https://disco.l2beat.com/diff/eth:0xB250566074B3c0f1B109A531A83f3d9B1a579273/eth:0x55400445e384393f9c1BE23e7E734e8d44Ed9fd9  (no constructor params, system address)
- SuperchainConfig:                                                                                                                                                                                                   
  https://disco.l2beat.com/diff/eth:0x4da82a327773965b8d4D85Fa3dB8249b387458E7/eth:0x2F64d234f1Ec6bA2eA6914d943c99b45fFF14E89  (guardian transfer functions)

basti 12/22: the verifier contract source is now available. looks like an older risc0groth16 verifier: https://disco.l2beat.com/diff/eth:0xafB31f5b70623CDF4b20Ada3f7230916A5A79df9/eth:0x411e56a890c5fe0712f6F345977815Ba8E7785C3

state validation: assuming the `0xf0ce5d15fa89991210ca2667b7f7a8bb740ce551c0f2b20cc76f9debc55d22c2` program hash corresponds to a valid kailua program that also verifies the eigenDA v2 commitments, the proof system is a standard kailua hybrid validity / fp system as deployed for BOB. The single large difference would be that the vanguard advantage is uint max and therefore the proof system can be delayed ~indefinitely by the vanguard.

## Watched changes

```diff
    EOA  (eth:0x0A383fF8387CF07315f476D1686E95b1a97adc97) {
    +++ description: None
      receivedPermissions.0:
-        {"permission":"guard","from":"eth:0x5d0Ff601BC8580D8682c0462df55343Cb0b99285","role":".guardian"}
      receivedPermissions.1.via:
+        [{"address":"eth:0xB2A9EB0c7b729c3EC704e843eF260084B3caE67F"}]
      receivedPermissions.1.role:
-        ".owner"
+        ".guardian"
      receivedPermissions.1.description:
-        "can pull funds from the contract in case of emergency."
      receivedPermissions.1.from:
-        "eth:0x86183e7b1D908D9A5C3Bc59cC2232F2ffE4E7145"
+        "eth:0x5d0Ff601BC8580D8682c0462df55343Cb0b99285"
      receivedPermissions.1.permission:
-        "interact"
+        "guard"
      receivedPermissions.3:
-        {"permission":"interact","from":"eth:0x9754fD3D63B3EAC3fd62b6D54DE4f61b00D6E0Df","description":"set and change address mappings.","role":".owner","via":[{"address":"eth:0x15fCB0120D414f246ead019cA4BdF97447cd8d90"}]}
      receivedPermissions.4:
-        {"permission":"upgrade","from":"eth:0x0CA3A2FBC3D770b578223FBB6b062fa875a2eE75","description":"upgrading the bridge implementation can give access to all funds escrowed therein.","role":".$admin","via":[{"address":"eth:0x15fCB0120D414f246ead019cA4BdF97447cd8d90"}]}
      receivedPermissions.5:
-        {"permission":"upgrade","from":"eth:0x1ED92E1bc9A2735216540EDdD0191144681cb77E","role":"admin","via":[{"address":"eth:0x15fCB0120D414f246ead019cA4BdF97447cd8d90"}]}
      receivedPermissions.6:
-        {"permission":"upgrade","from":"eth:0x3D8ee269F87A7f3F0590c5C0d825FFF06212A242","role":"admin","via":[{"address":"eth:0x15fCB0120D414f246ead019cA4BdF97447cd8d90"}]}
      receivedPermissions.7:
-        {"permission":"upgrade","from":"eth:0x5d0Ff601BC8580D8682c0462df55343Cb0b99285","role":"admin","via":[{"address":"eth:0xab48b73a9e59aF01AfE91e18cA0774295581d07A"}]}
      receivedPermissions.8:
-        {"permission":"upgrade","from":"eth:0x6C7198250087B29A8040eC63903Bc130f4831Cc9","role":"admin","via":[{"address":"eth:0x15fCB0120D414f246ead019cA4BdF97447cd8d90"}]}
      receivedPermissions.9:
-        {"permission":"upgrade","from":"eth:0x7f82f57F0Dd546519324392e408b01fcC7D709e8","role":"admin","via":[{"address":"eth:0x15fCB0120D414f246ead019cA4BdF97447cd8d90"}]}
      receivedPermissions.10:
-        {"permission":"upgrade","from":"eth:0x8546840adF796875cD9AAcc5B3B048f6B2c9D563","role":"admin","via":[{"address":"eth:0x15fCB0120D414f246ead019cA4BdF97447cd8d90"}]}
      receivedPermissions.11:
-        {"permission":"upgrade","from":"eth:0x86183e7b1D908D9A5C3Bc59cC2232F2ffE4E7145","role":"admin","via":[{"address":"eth:0x15fCB0120D414f246ead019cA4BdF97447cd8d90"}]}
      receivedPermissions.12:
-        {"permission":"upgrade","from":"eth:0xEEd67E139CC7721EC656B449F01B7b4D7dCFD671","role":"admin","via":[{"address":"eth:0x15fCB0120D414f246ead019cA4BdF97447cd8d90"}]}
      receivedPermissions.13:
-        {"permission":"upgrade","from":"eth:0xF875030B9464001fC0f964E47546b0AFEEbD7C61","role":"admin","via":[{"address":"eth:0x15fCB0120D414f246ead019cA4BdF97447cd8d90"}]}
      controlsMajorityOfUpgradePermissions:
-        true
      directlyReceivedPermissions:
-        [{"permission":"act","from":"eth:0x15fCB0120D414f246ead019cA4BdF97447cd8d90","role":".owner"},{"permission":"act","from":"eth:0xab48b73a9e59aF01AfE91e18cA0774295581d07A","role":".owner"}]
    }
```

```diff
    contract ProxyAdmin (eth:0x15fCB0120D414f246ead019cA4BdF97447cd8d90) {
    +++ description: None
      values.owner:
-        "eth:0x0A383fF8387CF07315f476D1686E95b1a97adc97"
+        "eth:0x92e0E0B15e3e99b32c9ED9AD284F939553C7b7d6"
    }
```

```diff
    contract SystemConfig (eth:0x1ED92E1bc9A2735216540EDdD0191144681cb77E) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      values.blobbasefeeScalar:
-        801949
+        0
      values.owner:
-        "eth:0x5785Df5b4234Fc63F9D6ecFe30C40b6b44619fd2"
+        "eth:0x92e0E0B15e3e99b32c9ED9AD284F939553C7b7d6"
    }
```

```diff
    contract MegaUSDmPreDeposit (eth:0x46D6Eba3AECD215a3e703cdA963820d4520b45D6) {
    +++ description: Predeposit Escrow, not connected to an L2: Users can deposit USDC. The system uses off-chain permit signatures to ensure only KYC'd users can deposit. Withdrawals can only be made by eth:0xCB264DEf50D166d4aE7cF60188eC0038819fb719 to eth:0x22cfa62eD71922781984aA2AcffEfA9a82593071.
      values.isDepositActive:
-        true
+        false
    }
```

```diff
    contract SuperchainConfig (eth:0x5d0Ff601BC8580D8682c0462df55343Cb0b99285) {
    +++ description: This is NOT the shared SuperchainConfig contract of the OP stack Superchain but rather a local fork. It manages the `PAUSED_SLOT`, a boolean value indicating whether the local chain is paused, and `GUARDIAN_SLOT`, the address of the guardian which can pause and unpause the system.
      sourceHashes.1:
-        "0x03dba37173051b02bc81487e181c791bcf1aef664c249e5d035f11f488bdd686"
+        "0xcfa8bfbe522f3a85a5385ccb76753907d2f839d7bc257f742c9781269d7cce4d"
      values.$implementation:
-        "eth:0x4da82a327773965b8d4D85Fa3dB8249b387458E7"
+        "eth:0x2F64d234f1Ec6bA2eA6914d943c99b45fFF14E89"
      values.$pastUpgrades.1:
+        ["2025-12-18T02:00:35.000Z","0xcf4419b7fd683f75f9619984db245eca086853395d6f033099ad7e00b0eb4518",["eth:0x2F64d234f1Ec6bA2eA6914d943c99b45fFF14E89"]]
      values.$upgradeCount:
-        1
+        2
      values.guardian:
-        "eth:0x0A383fF8387CF07315f476D1686E95b1a97adc97"
+        "eth:0xB2A9EB0c7b729c3EC704e843eF260084B3caE67F"
      values.version:
-        "1.2.0"
+        "1.3.0"
      values.PENDING_GUARDIAN_SLOT:
+        "0xd27e97cacf895026d8121da1df07f0476456b12320e92b2a622d646c7a54955c"
      values.pendingGuardian:
+        "eth:0x0000000000000000000000000000000000000000"
      implementationNames.eth:0x4da82a327773965b8d4D85Fa3dB8249b387458E7:
-        "SuperchainConfig"
      implementationNames.eth:0x2F64d234f1Ec6bA2eA6914d943c99b45fFF14E89:
+        "SuperchainConfig"
    }
```

```diff
    contract OptimismPortal2 (eth:0x7f82f57F0Dd546519324392e408b01fcC7D709e8) {
    +++ description: The OptimismPortal contract is the main entry point to deposit funds from L1 to L2. It also allows to prove and finalize withdrawals. It specifies which game type can be used for withdrawals, which currently is the KailuaGame.
      sourceHashes.1:
-        "0x8f2cec012bf54c7d3bf484bd41d932fbb47b7977bce894ea2138262e61905a92"
+        "0x2cb05d8405b381db83cf08312454b15a474ae2344ca5b34a2c69b3e2f3c1c87e"
      values.$implementation:
-        "eth:0x31f6E6a37ce650723EBf082EC59A48779be9Af99"
+        "eth:0x55400445e384393f9c1BE23e7E734e8d44Ed9fd9"
      values.$pastUpgrades.1:
+        ["2025-12-18T01:52:23.000Z","0x79b2cfcd6e5c08d9912d7450c4f77db522be234ea86b4c7db6c10fc0b711b353",["eth:0x55400445e384393f9c1BE23e7E734e8d44Ed9fd9"]]
      values.$upgradeCount:
-        1
+        2
      values.guardian:
-        "eth:0x0A383fF8387CF07315f476D1686E95b1a97adc97"
+        "eth:0xB2A9EB0c7b729c3EC704e843eF260084B3caE67F"
      values.version:
-        "3.14.0"
+        "3.15.2"
      values.RespectedGameString:
+        "KailuaGame"
      implementationNames.eth:0x31f6E6a37ce650723EBf082EC59A48779be9Af99:
-        "OptimismPortal2"
      implementationNames.eth:0x55400445e384393f9c1BE23e7E734e8d44Ed9fd9:
+        "OptimismPortal2"
      template:
+        "opstack/OptimismPortal2"
      description:
+        "The OptimismPortal contract is the main entry point to deposit funds from L1 to L2. It also allows to prove and finalize withdrawals. It specifies which game type can be used for withdrawals, which currently is the KailuaGame."
      fieldMeta:
+        {"respectedGameType":{"severity":"HIGH"},"paused":{"severity":"HIGH","description":"Whether the contract is paused or not. Determined by the SuperchainConfig contract PAUSED_SLOT. Here it pauses withdrawals. If this is paused, also the L1CrossDomainMessenger and ERC-20, ERC-721 deposits are paused."}}
      usedTypes:
+        [{"typeCaster":"Mapping","arg":{"0":"FaultDisputeGame","1":"PermissionedDisputeGame","1337":"KailuaGame"}}]
      category:
+        {"name":"Local Infrastructure","priority":5}
    }
```

```diff
    contract DisputeGameFactory (eth:0x8546840adF796875cD9AAcc5B3B048f6B2c9D563) {
    +++ description: The dispute game factory allows the creation of dispute games, used to propose state roots and eventually challenge them.
      values.owner:
-        "eth:0x0A383fF8387CF07315f476D1686E95b1a97adc97"
+        "eth:0x92e0E0B15e3e99b32c9ED9AD284F939553C7b7d6"
    }
```

```diff
    contract DelayedWETH (eth:0x86183e7b1D908D9A5C3Bc59cC2232F2ffE4E7145) {
    +++ description: Contract designed to hold the bonded ETH for each game. It is designed as a wrapper around WETH to allow an owner to function as a backstop if a game would incorrectly distribute funds.
      values.owner:
-        "eth:0x0A383fF8387CF07315f476D1686E95b1a97adc97"
+        "eth:0x92e0E0B15e3e99b32c9ED9AD284F939553C7b7d6"
    }
```

```diff
    contract ProxyAdmin (eth:0xab48b73a9e59aF01AfE91e18cA0774295581d07A) {
    +++ description: None
      values.owner:
-        "eth:0x0A383fF8387CF07315f476D1686E95b1a97adc97"
+        "eth:0x92e0E0B15e3e99b32c9ED9AD284F939553C7b7d6"
    }
```

```diff
+   Status: CREATED
    contract Safe (eth:0x92e0E0B15e3e99b32c9ED9AD284F939553C7b7d6)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Safe (eth:0xB2A9EB0c7b729c3EC704e843eF260084B3caE67F)
    +++ description: None
```

## Source code changes

```diff
.../OptimismPortal2/OptimismPortal2.sol            |   15 +-
 .../Safe.sol                                       |    0
 .../SafeProxy.p.sol                                |    0
 .../Safe.sol                                       | 1088 ++++++++++++++++++++
 .../SafeProxy.p.sol                                |   37 +
 .../Safe.sol                                       | 1088 ++++++++++++++++++++
 .../SafeProxy.p.sol                                |   37 +
 .../SuperchainConfig/SuperchainConfig.sol          |   49 +-
 8 files changed, 2307 insertions(+), 7 deletions(-)
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 1764760164 (main branch discovery), not current.

```diff
    EOA  (eth:0x0A383fF8387CF07315f476D1686E95b1a97adc97) {
    +++ description: None
      receivedPermissions:
+        [{"permission":"guard","from":"eth:0x5d0Ff601BC8580D8682c0462df55343Cb0b99285","role":".guardian"},{"permission":"interact","from":"eth:0x86183e7b1D908D9A5C3Bc59cC2232F2ffE4E7145","description":"can pull funds from the contract in case of emergency.","role":".owner"},{"permission":"interact","from":"eth:0x910b159F79288DD706789ec7768E979d4D88C057","description":"add/remove verifiers and the selectors they are mapped to.","role":".owner"},{"permission":"interact","from":"eth:0x9754fD3D63B3EAC3fd62b6D54DE4f61b00D6E0Df","description":"set and change address mappings.","role":".owner","via":[{"address":"eth:0x15fCB0120D414f246ead019cA4BdF97447cd8d90"}]},{"permission":"upgrade","from":"eth:0x0CA3A2FBC3D770b578223FBB6b062fa875a2eE75","description":"upgrading the bridge implementation can give access to all funds escrowed therein.","role":".$admin","via":[{"address":"eth:0x15fCB0120D414f246ead019cA4BdF97447cd8d90"}]},{"permission":"upgrade","from":"eth:0x1ED92E1bc9A2735216540EDdD0191144681cb77E","role":"admin","via":[{"address":"eth:0x15fCB0120D414f246ead019cA4BdF97447cd8d90"}]},{"permission":"upgrade","from":"eth:0x3D8ee269F87A7f3F0590c5C0d825FFF06212A242","role":"admin","via":[{"address":"eth:0x15fCB0120D414f246ead019cA4BdF97447cd8d90"}]},{"permission":"upgrade","from":"eth:0x5d0Ff601BC8580D8682c0462df55343Cb0b99285","role":"admin","via":[{"address":"eth:0xab48b73a9e59aF01AfE91e18cA0774295581d07A"}]},{"permission":"upgrade","from":"eth:0x6C7198250087B29A8040eC63903Bc130f4831Cc9","role":"admin","via":[{"address":"eth:0x15fCB0120D414f246ead019cA4BdF97447cd8d90"}]},{"permission":"upgrade","from":"eth:0x7f82f57F0Dd546519324392e408b01fcC7D709e8","role":"admin","via":[{"address":"eth:0x15fCB0120D414f246ead019cA4BdF97447cd8d90"}]},{"permission":"upgrade","from":"eth:0x8546840adF796875cD9AAcc5B3B048f6B2c9D563","role":"admin","via":[{"address":"eth:0x15fCB0120D414f246ead019cA4BdF97447cd8d90"}]},{"permission":"upgrade","from":"eth:0x86183e7b1D908D9A5C3Bc59cC2232F2ffE4E7145","role":"admin","via":[{"address":"eth:0x15fCB0120D414f246ead019cA4BdF97447cd8d90"}]},{"permission":"upgrade","from":"eth:0xEEd67E139CC7721EC656B449F01B7b4D7dCFD671","role":"admin","via":[{"address":"eth:0x15fCB0120D414f246ead019cA4BdF97447cd8d90"}]},{"permission":"upgrade","from":"eth:0xF875030B9464001fC0f964E47546b0AFEEbD7C61","role":"admin","via":[{"address":"eth:0x15fCB0120D414f246ead019cA4BdF97447cd8d90"}]}]
      controlsMajorityOfUpgradePermissions:
+        true
      directlyReceivedPermissions:
+        [{"permission":"act","from":"eth:0x15fCB0120D414f246ead019cA4BdF97447cd8d90","role":".owner"},{"permission":"act","from":"eth:0xab48b73a9e59aF01AfE91e18cA0774295581d07A","role":".owner"}]
    }
```

```diff
+   Status: CREATED
    contract L1StandardBridge (eth:0x0CA3A2FBC3D770b578223FBB6b062fa875a2eE75)
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain.
```

```diff
+   Status: CREATED
    contract ProxyAdmin (eth:0x15fCB0120D414f246ead019cA4BdF97447cd8d90)
    +++ description: None
```

```diff
+   Status: CREATED
    contract SystemConfig (eth:0x1ED92E1bc9A2735216540EDdD0191144681cb77E)
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
```

```diff
+   Status: CREATED
    contract PreimageOracle (eth:0x1fb8cdFc6831fc866Ed9C51aF8817Da5c287aDD3)
    +++ description: The PreimageOracle contract is used to load the required data from L1 for a dispute game.
```

```diff
+   Status: CREATED
    contract L1ERC721Bridge (eth:0x3D8ee269F87A7f3F0590c5C0d825FFF06212A242)
    +++ description: Used to bridge ERC-721 tokens from host chain to this chain.
```

```diff
+   Status: CREATED
    contract RiscZeroGroth16Verifier (eth:0x411e56a890c5fe0712f6F345977815Ba8E7785C3)
    +++ description: Verifier contract for RISC Zero Groth16 proofs (version 2.0.0-rc.3).
```

```diff
+   Status: CREATED
    contract SuperchainConfig (eth:0x5d0Ff601BC8580D8682c0462df55343Cb0b99285)
    +++ description: This is NOT the shared SuperchainConfig contract of the OP stack Superchain but rather a local fork. It manages the `PAUSED_SLOT`, a boolean value indicating whether the local chain is paused, and `GUARDIAN_SLOT`, the address of the guardian which can pause and unpause the system.
```

```diff
+   Status: CREATED
    contract L1CrossDomainMessenger (eth:0x6C7198250087B29A8040eC63903Bc130f4831Cc9)
    +++ description: Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function.
```

```diff
+   Status: CREATED
    contract KailuaGame (eth:0x78F8F8FED1d589b7098EC4B47220465A9Fa071C9)
    +++ description: Implementation of the KailuaGame with type 1337. Based on this implementation, new KailuaGames are created with every new state root proposal.
```

```diff
+   Status: CREATED
    contract OptimismPortal2 (eth:0x7f82f57F0Dd546519324392e408b01fcC7D709e8)
    +++ description: None
```

```diff
+   Status: CREATED
    contract DisputeGameFactory (eth:0x8546840adF796875cD9AAcc5B3B048f6B2c9D563)
    +++ description: The dispute game factory allows the creation of dispute games, used to propose state roots and eventually challenge them.
```

```diff
+   Status: CREATED
    contract DelayedWETH (eth:0x86183e7b1D908D9A5C3Bc59cC2232F2ffE4E7145)
    +++ description: Contract designed to hold the bonded ETH for each game. It is designed as a wrapper around WETH to allow an owner to function as a backstop if a game would incorrectly distribute funds.
```

```diff
+   Status: CREATED
    contract RiscZeroVerifierRouter (eth:0x910b159F79288DD706789ec7768E979d4D88C057)
    +++ description: A router proxy that routes to verifiers based on selectors. The mapping can be changed by a permissioned owner (eth:0x0A383fF8387CF07315f476D1686E95b1a97adc97).
```

```diff
+   Status: CREATED
    contract AddressManager (eth:0x9754fD3D63B3EAC3fd62b6D54DE4f61b00D6E0Df)
    +++ description: Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts.
```

```diff
+   Status: CREATED
    contract ProxyAdmin (eth:0xab48b73a9e59aF01AfE91e18cA0774295581d07A)
    +++ description: None
```

```diff
+   Status: CREATED
    contract PermissionedDisputeGame (eth:0xB2E4D20ECF58f2cE6a8d3bf0c982c2c77BE42152)
    +++ description: Same as FaultDisputeGame, but only two permissioned addresses are designated as proposer and challenger.
```

```diff
+   Status: CREATED
    contract KailuaTreasury (eth:0xE4e456c64B9b0de5FE8a90d809180cA71534D623)
    +++ description: Entrypoint for state root proposals. Manages bonds (currently 0.00001 ETH) and tournaments for the OP Kailua state validation system, wrapping the OP stack native DisputeGameFactory.
```

```diff
+   Status: CREATED
    contract AnchorStateRegistry (eth:0xEEd67E139CC7721EC656B449F01B7b4D7dCFD671)
    +++ description: Contains the latest confirmed state root that can be used as a starting point in a dispute game.
```

```diff
+   Status: CREATED
    contract MIPS (eth:0xF027F4A985560fb13324e943edf55ad6F1d15Dc1)
    +++ description: The MIPS contract is used to execute the final step of the dispute game which objectively determines the winner of the dispute.
```

```diff
+   Status: CREATED
    contract OptimismMintableERC20Factory (eth:0xF875030B9464001fC0f964E47546b0AFEEbD7C61)
    +++ description: A helper contract that generates OptimismMintableERC20 contracts on the network it's deployed to. OptimismMintableERC20 is a standard extension of the base ERC20 token contract designed to allow the L1StandardBridge contracts to mint and burn tokens. This makes it possible to use an OptimismMintableERC20 as this chain's representation of a token on the host chain, or vice-versa.
```

Generated with discovered.json: 0x2b5b1b5f11f0a81947406627fc2b7a6122c03ac5

# Diff at Wed, 03 Dec 2025 11:25:59 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@cb61f5ec5bdfe1b0d99f8a8bbf88c803aa243605 block: 1764165346
- current timestamp: 1764760164

## Description

refund contract deployed, refunds completed.

## Watched changes

```diff
    contract MegaUSDmPreDeposit (eth:0x46D6Eba3AECD215a3e703cdA963820d4520b45D6) {
    +++ description: Predeposit Escrow, not connected to an L2: Users can deposit USDC. The system uses off-chain permit signatures to ensure only KYC'd users can deposit. Withdrawals can only be made by eth:0xCB264DEf50D166d4aE7cF60188eC0038819fb719 to eth:0x22cfa62eD71922781984aA2AcffEfA9a82593071.
      description:
-        "Predeposit Escrow, not connected to an L2: Users can deposit USDC. The system uses off-chain permit signatures to ensure only KYC'd users can deposit. Withdrawals can only be made by eth:0xCB264DEf50D166d4aE7cF60188eC0038819fb719 to eth:0xCB264DEf50D166d4aE7cF60188eC0038819fb719."
+        "Predeposit Escrow, not connected to an L2: Users can deposit USDC. The system uses off-chain permit signatures to ensure only KYC'd users can deposit. Withdrawals can only be made by eth:0xCB264DEf50D166d4aE7cF60188eC0038819fb719 to eth:0x22cfa62eD71922781984aA2AcffEfA9a82593071."
      values.treasury:
-        "eth:0xCB264DEf50D166d4aE7cF60188eC0038819fb719"
+        "eth:0x22cfa62eD71922781984aA2AcffEfA9a82593071"
    }
```

```diff
+   Status: CREATED
    contract MegaPreDepositVaultRefund (eth:0x22cfa62eD71922781984aA2AcffEfA9a82593071)
    +++ description: Refund escrow designed to hold the funds extracted from the predeposit vault and send them back to the users listed in the vault.
```

```diff
+   Status: CREATED
    contract Safe (eth:0xe8344867AB6387e17b7cAE2dE52C63BCf501BD98)
    +++ description: None
```

## Source code changes

```diff
.../megaeth/.flat/MegaPreDepositVaultRefund.sol    | 1029 ++++++++++++++++++
 .../src/projects/megaeth/.flat/Safe/Safe.sol       | 1088 ++++++++++++++++++++
 .../projects/megaeth/.flat/Safe/SafeProxy.p.sol    |   37 +
 3 files changed, 2154 insertions(+)
```

Generated with discovered.json: 0xf9cd8338d39ae28745c59c2f01082a705999a80a

# Diff at Wed, 26 Nov 2025 10:21:01 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- current timestamp: 1764152153

## Description

Add Megaeth predeposit contract and TVS.

## Initial discovery

```diff
+   Status: CREATED
    contract MegaUSDmPreDeposit (eth:0x46D6Eba3AECD215a3e703cdA963820d4520b45D6)
    +++ description: Predeposit Escrow, not connected to an L2: Users can deposit USDC. The system uses off-chain permit signatures to ensure only KYC'd users can deposit. Withdrawals can only be made by eth:0xCB264DEf50D166d4aE7cF60188eC0038819fb719 to eth:0xCB264DEf50D166d4aE7cF60188eC0038819fb719.
```

```diff
+   Status: CREATED
    contract Megaeth Multisig (eth:0xCB264DEf50D166d4aE7cF60188eC0038819fb719)
    +++ description: None
```
