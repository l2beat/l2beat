Generated with discovered.json: 0x5b56243eeed4ffa66ccf73bbfbb0878a2bad55f1

# Diff at Thu, 13 Mar 2025 09:38:55 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@9dd209f83894c1f6612b7ed3bb249aa61692d929 block: 22030561
- current block number: 22037103

## Description

Sub-MS signer changes.

## Watched changes

```diff
    contract GnosisSafe (0x55c671BcE13120387Ded710A1d1b80C0e3d8E857) {
    +++ description: None
      values.$members.7:
+        "0x7461633b1Fc7CdAa64A5B7bAb1b1F0145Acd7953"
      values.$members.6:
+        "0x227230CD05e89f41E67df3E5fC61B18411d147A9"
      values.$members.5:
+        "0xb799FF3DeF706045B5061B22d748E8F52737415d"
      values.$members.4:
+        "0x8b0c64CcaB94d4618Ef834F396F622f61F2b013D"
      values.$members.3:
+        "0x0e621b0A275A207211e161Ee997aA80661Bc1bcf"
      values.$members.2:
+        "0x160669864cDe95c190364ad01eDfbAA32E9DA430"
      values.$members.1:
+        "0x3620B9e7c75E09cCC37458c7B6EE6c23D8Ee4f0f"
      values.$members.0:
-        "0xD9b0579e2B8387fE153201631EBC4be9dEFA1A6d"
+        "0xa376AaF645dbd9b4f501B2A8a97bc21DcA15B001"
      values.$threshold:
-        1
+        5
      values.multisigThreshold:
-        "1 of 1 (100%)"
+        "5 of 8 (63%)"
    }
```

Generated with discovered.json: 0x6efbd6780b58fc5887ada743f9acb8c8882483e8

# Diff at Wed, 12 Mar 2025 11:43:19 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@d56fc86cf5944647644b8653ca9717b11d4adae8 block: 22022274
- current block number: 22030561

## Description

Part of the protocol version 26 upgrade: New L2 logic [deployed to the STM](https://app.blocksec.com/explorer/tx/eth/0x93e4efe078b08019c40dc11046abaa531b75263f297ec014c2d7901c0e1ff243), from where it will be distributed to the zk stack chains:
- `setNewVersionUpgrade()` called: diamond cut data for the v26 upgrade for existing chains
- `setChainCreationParams()` called: new genesis diamond cut data for new zk stack chains
- `setValidatorTimelock()` called: adds the new ValidatorTimelock as a reference to the STM

ML MS signer change.

## Watched changes

```diff
    contract EraAdminProxy (0x2cf3bD6a9056b39999F3883955E183F655345063) {
    +++ description: None
+++ description: Timestamps for new protocol version upgrades can be registered here (NOT enforced)
      values.upgradeTimestamps.2:
+        {"_protocolVersion":111669149696,"_upgradeTimestamp":1741773600}
    }
```

```diff
    contract Matter Labs Multisig (0x4e4943346848c4867F81dFb37c4cA9C5715A7828) {
    +++ description: None
      values.$members.7:
+        "0x700DA14328eC2F81053E5B6aAE4803E16BEdF1df"
      values.$members.6:
-        "0x700DA14328eC2F81053E5B6aAE4803E16BEdF1df"
+        "0xfd03dA3aeb6807a98db96C1704Ea4CFf031BaEd2"
      values.$members.5:
-        "0xfd03dA3aeb6807a98db96C1704Ea4CFf031BaEd2"
+        "0xFAdb20191Ab38362C50f52909817B74214CA79AE"
      values.$members.4:
-        "0xFAdb20191Ab38362C50f52909817B74214CA79AE"
+        "0x702caCafA54B88e9c54449563Fb2e496e85c78b7"
      values.$members.3:
-        "0x702caCafA54B88e9c54449563Fb2e496e85c78b7"
+        "0x3068415e0F857A5eEd03302A1F7E44f67468d2Bc"
      values.$members.2:
-        "0x3068415e0F857A5eEd03302A1F7E44f67468d2Bc"
+        "0x8A23548a640De1137e58e2D9600e1c5913E3D674"
      values.$members.1:
-        "0x8A23548a640De1137e58e2D9600e1c5913E3D674"
+        "0x3F0009D00cc78979d00Eb635490F23E8d6aCc481"
      values.$members.0:
-        "0x3F0009D00cc78979d00Eb635490F23E8d6aCc481"
+        "0x4A333c167Ce76C46149c6B0197977ae02aaeC929"
      values.$threshold:
-        4
+        5
      values.multisigThreshold:
-        "4 of 7 (57%)"
+        "5 of 8 (63%)"
    }
```

```diff
-   Status: DELETED
    contract GenesisUpgrade (0x6e2BC597F1e83F9fC7c1f69157F2C12476873971)
    +++ description: Helper contract that defines diamondcut data to initialize a new diamond implementation for the chain-specific system contracts.
```

```diff
    contract StateTransitionManager (0xc2eE6b6af7d616f6e27ce7F4A451Aedc2b0F5f5C) {
    +++ description: Defines L2 diamond contract creation and upgrade data, the proof system for the `ZKsync diamond` contract connected to it (and other L2 diamond contracts that share the logic).
      values.genesisUpgrade:
-        "0x6e2BC597F1e83F9fC7c1f69157F2C12476873971"
+        "0x0000000000000000000000000000000000000001"
      values.getSemverProtocolVersion.1:
-        25
+        26
      values.initialCutHash:
-        "0x0b30ec2102ea8e2cf92d22857c347d3b29bde8dfaf6f2ae19045f19c5a94ba5a"
+        "0xaf3397d2d574e3fb4a729df5b561afe890323a5eab21980fe9aae230f5934458"
      values.protocolVersion:
-        107374182400
+        111669149696
      values.storedBatchZero:
-        "0x83325e26523f69ee6ea60aea582325d22f3c6a85db5e4890e14d62a377635a6b"
+        "0xbb3c62fb5577f094f9290297114948e6f6fb8d04083a366ba3dadb3569fb5c4f"
      values.validatorTimelock:
-        "0x5D8ba173Dc6C3c90C8f7C04C9288BeF5FDbAd06E"
+        "0x8c0Bfc04AdA21fd496c55B8C50331f904306F564"
    }
```

```diff
+   Status: CREATED
    contract undefined (0x0000000000000000000000000000000000000001)
    +++ description: None
```

```diff
+   Status: CREATED
    contract undefined (0x4A333c167Ce76C46149c6B0197977ae02aaeC929)
    +++ description: None
```

## Source code changes

```diff
.../.flat@22022274/GenesisUpgrade.sol => /dev/null | 2806 --------------------
 1 file changed, 2806 deletions(-)
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22022274 (main branch discovery), not current.

```diff
    contract ProtocolUpgradeHandler (0xE30Dca3047B37dc7d88849dE4A4Dc07937ad5Ab3) {
    +++ description: The central upgrade contract and Governance proxy for all ZK stack contracts. Accepts successful DAO proposals from L2, emergency proposals from the EmergencyUpgradeBoard. The three members of the EmergencyUpgradeBoard also have special roles and permissions in this contract.
+++ severity: HIGH
      values.emergencyUpgradeProposals:
+        ["0xa34bdc028de549c0fbd0374e64eb5977e78f62331f6a55f4f2211348c4902d13"]
      fieldMeta.emergencyUpgradeProposals:
+        {"severity":"HIGH"}
    }
```

Generated with discovered.json: 0x7a9585ff0df7f4aa277f5502d867069cae9ccba3

# Diff at Tue, 11 Mar 2025 07:55:57 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@6186a4f8e3a9e415d081d4e3e85c2deceaa5530c block: 21944239
- current block number: 22022274

## Description

update 03/11: old owner (PUH) is fully transfered, new contracts are governing.

Onchain execution of [[ZIP-5] Upgrade Governance Contracts](https://www.tally.xyz/gov/zksync/proposal/32477831455745537024214395992964479454779258818502397012096084176779102554510?govId=eip155:324:0x76705327e682F2d96943280D99464Ab61219e34f).

SC and Guardians redeployed in the same configuration, new ProtocolUpgradeHandler deployed as a proxy referencing and the new ProtocolGovernor on L2.

Currently the new ProtocolUpgradeHandler is the upgrade admin, Elastic Chain admin and pending owner of the shared contracts, and the old PUH remains the owner.

This complicates showing discodriven perms correctly, as the permissions are the same as before but the contracts are doubled.
Since the old governance contracts on L1 only have the 'owner' role in the shared contracts until the next upgrade, we hide them from the frontend.

## Watched changes

```diff
    contract BridgeHub (0x303a465B659cBB0ab36eE643eA362c509EEb5213) {
    +++ description: Sits between the shared bridge and the StateTransitionManager(s) and relays L1 <-> L2 messages from the shared bridge or other ZK stack chains to their respective destinations.
      issuedPermissions.1.to:
-        "0xdEFd1eDEE3E8c5965216bd59C866f7f5307C9b29"
+        "0xECE8e30bFc92c2A8e11e6cb2e17B70868572E3f6"
      issuedPermissions.1.via.0.address:
-        "0x8f7a9912416e8AdC4D9c21FAe1415D3318A11897"
+        "0xE30Dca3047B37dc7d88849dE4A4Dc07937ad5Ab3"
      values.owner:
-        "0x8f7a9912416e8AdC4D9c21FAe1415D3318A11897"
+        "0xE30Dca3047B37dc7d88849dE4A4Dc07937ad5Ab3"
    }
```

```diff
-   Status: DELETED
    contract ProtocolTimelockController(L2->L1)_deprecated (0x3701fB675bCd4A85eb11A2467628BBe193F6e6A8)
    +++ description: None
```

```diff
-   Status: DELETED
    contract ProtocolUpgradeHandler_deprecated (0x8f7a9912416e8AdC4D9c21FAe1415D3318A11897)
    +++ description: The central upgrade contract and Governance proxy for all ZK stack contracts. Accepts successful DAO proposals from L2, emergency proposals from the EmergencyUpgradeBoard. The three members of the EmergencyUpgradeBoard also have special roles and permissions in this contract.
```

```diff
-   Status: DELETED
    contract SecurityCouncil_deprecated (0xBDFfCC71FE84020238F2990a6D2954e87355De0D)
    +++ description: Custom Multisig implementation that has a general threshold of 9 but also specific thresholds for upgrade approvals (6) or soft freezes (3).
```

```diff
    contract ProxyAdmin (0xC2a36181fB524a6bEfE639aFEd37A67e77d62cf1) {
    +++ description: None
      values.owner:
-        "0x8f7a9912416e8AdC4D9c21FAe1415D3318A11897"
+        "0xE30Dca3047B37dc7d88849dE4A4Dc07937ad5Ab3"
    }
```

```diff
    contract StateTransitionManager (0xc2eE6b6af7d616f6e27ce7F4A451Aedc2b0F5f5C) {
    +++ description: Defines L2 diamond contract creation and upgrade data, the proof system for the `ZKsync diamond` contract connected to it (and other L2 diamond contracts that share the logic).
      issuedPermissions.1.to:
-        "0xdEFd1eDEE3E8c5965216bd59C866f7f5307C9b29"
+        "0xECE8e30bFc92c2A8e11e6cb2e17B70868572E3f6"
      issuedPermissions.1.via.0.address:
-        "0x8f7a9912416e8AdC4D9c21FAe1415D3318A11897"
+        "0xE30Dca3047B37dc7d88849dE4A4Dc07937ad5Ab3"
      values.owner:
-        "0x8f7a9912416e8AdC4D9c21FAe1415D3318A11897"
+        "0xE30Dca3047B37dc7d88849dE4A4Dc07937ad5Ab3"
    }
```

```diff
-   Status: DELETED
    contract Guardians_deprecated (0xD677e09324F8Bb3cC64F009973693f751c33A888)
    +++ description: Custom Multisig implementation that has a general threshold of 5 and a specific threshold for extending the legal voting period of 2.
```

```diff
    contract L1SharedBridge (0xD7f9f54194C633F36CCD5F3da84ad4a1c38cB2cB) {
    +++ description: This bridge contract escrows all ERC-20s and ETH that are deposited to registered ZK stack chains like ZKsync Era.
      issuedPermissions.1.to:
-        "0xdEFd1eDEE3E8c5965216bd59C866f7f5307C9b29"
+        "0xECE8e30bFc92c2A8e11e6cb2e17B70868572E3f6"
      issuedPermissions.1.via.0.address:
-        "0x8f7a9912416e8AdC4D9c21FAe1415D3318A11897"
+        "0xE30Dca3047B37dc7d88849dE4A4Dc07937ad5Ab3"
      values.owner:
-        "0x8f7a9912416e8AdC4D9c21FAe1415D3318A11897"
+        "0xE30Dca3047B37dc7d88849dE4A4Dc07937ad5Ab3"
    }
```

```diff
-   Status: DELETED
    contract EmergencyUpgradeBoard_deprecated (0xdEFd1eDEE3E8c5965216bd59C866f7f5307C9b29)
    +++ description: A custom contract allowing a 3/3 of 0xBDFfCC71FE84020238F2990a6D2954e87355De0D, 0xbC1653bd3829dfEc575AfC3816D4899cd103B51c and 0xD677e09324F8Bb3cC64F009973693f751c33A888 to `executeEmergencyUpgrade()` via the 0x8f7a9912416e8AdC4D9c21FAe1415D3318A11897.
```

```diff
+   Status: CREATED
    contract ProtocolTimelockController(L2->L1) (0x085b8B6407f150D62adB1EF926F7f304600ec714)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ProxyAdmin (0x1e4c534e7ce1FF5621Ea506D99b367D7d8EFbE3e)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Guardians (0x600dA620Ab29F41ABC6596a15981e14cE58c86b8)
    +++ description: Custom Multisig implementation that has a general threshold of 5 and a specific threshold for extending the legal voting period of 2.
```

```diff
+   Status: CREATED
    contract SecurityCouncil (0x66E4431266DC7E04E7d8b7FE9d2181253df7F410)
    +++ description: Custom Multisig implementation that has a general threshold of 9 but also specific thresholds for upgrade approvals (6) or soft freezes (3).
```

```diff
+   Status: CREATED
    contract ProtocolUpgradeHandler (0xE30Dca3047B37dc7d88849dE4A4Dc07937ad5Ab3)
    +++ description: The central upgrade contract and Governance proxy for all ZK stack contracts. Accepts successful DAO proposals from L2, emergency proposals from the EmergencyUpgradeBoard. The three members of the EmergencyUpgradeBoard also have special roles and permissions in this contract.
```

```diff
+   Status: CREATED
    contract EmergencyUpgradeBoard (0xECE8e30bFc92c2A8e11e6cb2e17B70868572E3f6)
    +++ description: A custom contract allowing a 3/3 of 0x66E4431266DC7E04E7d8b7FE9d2181253df7F410, 0xbC1653bd3829dfEc575AfC3816D4899cd103B51c and 0x600dA620Ab29F41ABC6596a15981e14cE58c86b8 to `executeEmergencyUpgrade()` via the 0xE30Dca3047B37dc7d88849dE4A4Dc07937ad5Ab3.
```

## Source code changes

```diff
.../EmergencyUpgradeBoard.sol}                     |   0
 .../Guardians.sol}                                 |   0
 .../ProtocolUpgradeHandler.sol}                    | 222 +++++++-
 .../TransparentUpgradeableProxy.p.sol              | 581 +++++++++++++++++++++
 ...-0x1e4c534e7ce1FF5621Ea506D99b367D7d8EFbE3e.sol | 132 +++++
 ...0xC2a36181fB524a6bEfE639aFEd37A67e77d62cf1.sol} |   0
 .../SecurityCouncil.sol}                           |   0
 7 files changed, 917 insertions(+), 18 deletions(-)
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21944239 (main branch discovery), not current.

```diff
    contract ProtocolTimelockController(L2->L1)_deprecated (0x3701fB675bCd4A85eb11A2467628BBe193F6e6A8) {
    +++ description: None
      name:
-        "ProtocolTimelockController(L2->L1)"
+        "ProtocolTimelockController(L2->L1)_deprecated"
      category:
+        {"name":"Spam","priority":-1}
    }
```

```diff
    contract ProtocolUpgradeHandler_deprecated (0x8f7a9912416e8AdC4D9c21FAe1415D3318A11897) {
    +++ description: The central upgrade contract and Governance proxy for all ZK stack contracts. Accepts successful DAO proposals from L2, emergency proposals from the EmergencyUpgradeBoard. The three members of the EmergencyUpgradeBoard also have special roles and permissions in this contract.
      name:
-        "ProtocolUpgradeHandler"
+        "ProtocolUpgradeHandler_deprecated"
      category.name:
-        "Shared Infrastructure"
+        "Spam"
      category.priority:
-        4
+        -1
    }
```

```diff
    contract SecurityCouncil_deprecated (0xBDFfCC71FE84020238F2990a6D2954e87355De0D) {
    +++ description: Custom Multisig implementation that has a general threshold of 9 but also specific thresholds for upgrade approvals (6) or soft freezes (3).
      name:
-        "SecurityCouncil"
+        "SecurityCouncil_deprecated"
      category.name:
-        "Governance"
+        "Spam"
      category.priority:
-        3
+        -1
    }
```

```diff
    contract Guardians_deprecated (0xD677e09324F8Bb3cC64F009973693f751c33A888) {
    +++ description: Custom Multisig implementation that has a general threshold of 5 and a specific threshold for extending the legal voting period of 2.
      name:
-        "Guardians"
+        "Guardians_deprecated"
      category.name:
-        "Governance"
+        "Spam"
      category.priority:
-        3
+        -1
    }
```

```diff
    contract EmergencyUpgradeBoard_deprecated (0xdEFd1eDEE3E8c5965216bd59C866f7f5307C9b29) {
    +++ description: A custom contract allowing a 3/3 of 0xBDFfCC71FE84020238F2990a6D2954e87355De0D, 0xbC1653bd3829dfEc575AfC3816D4899cd103B51c and 0xD677e09324F8Bb3cC64F009973693f751c33A888 to `executeEmergencyUpgrade()` via the 0x8f7a9912416e8AdC4D9c21FAe1415D3318A11897.
      name:
-        "EmergencyUpgradeBoard"
+        "EmergencyUpgradeBoard_deprecated"
      category.name:
-        "Governance"
+        "Spam"
      category.priority:
-        3
+        -1
    }
```

Generated with discovered.json: 0x82a5bd749b650d76f521b2037179ad7ead672671

# Diff at Tue, 04 Mar 2025 10:39:54 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@98d260b45fe0d2195ce5e629bd7b200c8706e8ba block: 21944239
- current block number: 21944239

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21944239 (main branch discovery), not current.

```diff
    contract GnosisSafe (0x015318c16AE443a20DE0A776dB06a59F0D279057) {
    +++ description: None
      sinceBlock:
+        20292687
    }
```

```diff
    contract GnosisSafe (0x13f07d9BF17615f6a17F272fe1A913168C275A66) {
    +++ description: None
      sinceBlock:
+        20372302
    }
```

```diff
    contract GnosisSafe (0x178D8Eb1A1fb81B5102808A83318Bb04C6a9fC6D) {
    +++ description: None
      sinceBlock:
+        20292681
    }
```

```diff
    contract GnosisSafe (0x2A90830083C5Ca1f18d7AA7fCDC2998f93475384) {
    +++ description: None
      sinceBlock:
+        20292637
    }
```

```diff
    contract EraAdminProxy (0x2cf3bD6a9056b39999F3883955E183F655345063) {
    +++ description: None
      sinceBlock:
+        20427018
    }
```

```diff
    contract BridgeHub (0x303a465B659cBB0ab36eE643eA362c509EEb5213) {
    +++ description: Sits between the shared bridge and the StateTransitionManager(s) and relays L1 <-> L2 messages from the shared bridge or other ZK stack chains to their respective destinations.
      sinceBlock:
+        20019828
    }
```

```diff
    contract GnosisSafe (0x34Ea62D4b9bBB8AD927eFB6ab31E3Ab3474aC93a) {
    +++ description: None
      sinceBlock:
+        20390079
    }
```

```diff
    contract GnosisSafe (0x35eA56fd9eAd2567F339Eb9564B6940b9DD5653F) {
    +++ description: None
      sinceBlock:
+        20422264
    }
```

```diff
    contract GnosisSafe (0x3888777686F0b0d8c3108fc22ad8DE9E049bE26F) {
    +++ description: None
      sinceBlock:
+        20406309
    }
```

```diff
    contract Matter Labs Multisig (0x4e4943346848c4867F81dFb37c4cA9C5715A7828) {
    +++ description: None
      sinceBlock:
+        15839298
    }
```

```diff
    contract GnosisSafe (0x538612F6eba6ff80FBD95D60dCDee16b8FfF2c0f) {
    +++ description: None
      sinceBlock:
+        20292668
    }
```

```diff
    contract GnosisSafe (0x55c671BcE13120387Ded710A1d1b80C0e3d8E857) {
    +++ description: None
      sinceBlock:
+        20292673
    }
```

```diff
    contract GnosisSafe (0x590926dBCDfD19627c3BbD2A6Eb96DeC7a3AbF69) {
    +++ description: None
      sinceBlock:
+        20292656
    }
```

```diff
    contract GnosisSafe (0x69462a81ba94D64c404575f1899a464F123497A2) {
    +++ description: None
      sinceBlock:
+        20425173
    }
```

```diff
    contract GnosisSafe (0x6D26874130A174839b9cd8CB87Ed4E09D0c1a5f0) {
    +++ description: None
      sinceBlock:
+        20292645
    }
```

```diff
    contract GenesisUpgrade (0x6e2BC597F1e83F9fC7c1f69157F2C12476873971) {
    +++ description: Helper contract that defines diamondcut data to initialize a new diamond implementation for the chain-specific system contracts.
      sinceBlock:
+        21087222
    }
```

```diff
    contract GnosisSafe (0x725065b4eB99294BaaE57AdDA9c32e42F453FA8A) {
    +++ description: None
      sinceBlock:
+        20378889
    }
```

```diff
    contract GnosisSafe (0x84BF0Ac41Eeb74373Ddddae8b7055Bf2bD3CE6E0) {
    +++ description: None
      sinceBlock:
+        20370671
    }
```

```diff
    contract ProtocolUpgradeHandler (0x8f7a9912416e8AdC4D9c21FAe1415D3318A11897) {
    +++ description: The central upgrade contract and Governance proxy for all ZK stack contracts. Accepts successful DAO proposals from L2, emergency proposals from the EmergencyUpgradeBoard. The three members of the EmergencyUpgradeBoard also have special roles and permissions in this contract.
      sinceBlock:
+        20486023
    }
```

```diff
    contract GnosisSafe (0x9B39Ea22e838B316Ea7D74e7C4B07d91D51ccA88) {
    +++ description: None
      sinceBlock:
+        20370122
    }
```

```diff
    contract GnosisSafe (0x9B8Be3278B7F0168D82059eb6BAc5991DcdfA803) {
    +++ description: None
      sinceBlock:
+        20386973
    }
```

```diff
    contract GnosisSafe (0xB7aC3A79A23B148c85fba259712c5A1e7ad0ca44) {
    +++ description: None
      sinceBlock:
+        20372086
    }
```

```diff
    contract ZkFoundationMultisig (0xbC1653bd3829dfEc575AfC3816D4899cd103B51c) {
    +++ description: None
      sinceBlock:
+        20363246
    }
```

```diff
    contract SecurityCouncil (0xBDFfCC71FE84020238F2990a6D2954e87355De0D) {
    +++ description: Custom Multisig implementation that has a general threshold of 9 but also specific thresholds for upgrade approvals (6) or soft freezes (3).
      sinceBlock:
+        20486034
    }
```

```diff
    contract ProxyAdmin (0xC2a36181fB524a6bEfE639aFEd37A67e77d62cf1) {
    +++ description: None
      sinceBlock:
+        20019827
    }
```

```diff
    contract StateTransitionManager (0xc2eE6b6af7d616f6e27ce7F4A451Aedc2b0F5f5C) {
    +++ description: Defines L2 diamond contract creation and upgrade data, the proof system for the `ZKsync diamond` contract connected to it (and other L2 diamond contracts that share the logic).
      sinceBlock:
+        20019830
    }
```

```diff
    contract GnosisSafe (0xc3Abc9f9AA75Be8341E831482cdA0125a7B1A23e) {
    +++ description: None
      sinceBlock:
+        20393837
    }
```

```diff
    contract GnosisSafe (0xCe7a3dFcc35602155809920Ff65e093aa726f6cf) {
    +++ description: None
      sinceBlock:
+        20292663
    }
```

```diff
    contract Guardians (0xD677e09324F8Bb3cC64F009973693f751c33A888) {
    +++ description: Custom Multisig implementation that has a general threshold of 5 and a specific threshold for extending the legal voting period of 2.
      sinceBlock:
+        20486034
    }
```

```diff
    contract L1SharedBridge (0xD7f9f54194C633F36CCD5F3da84ad4a1c38cB2cB) {
    +++ description: This bridge contract escrows all ERC-20s and ETH that are deposited to registered ZK stack chains like ZKsync Era.
      sinceBlock:
+        20019898
    }
```

```diff
    contract EmergencyUpgradeBoard (0xdEFd1eDEE3E8c5965216bd59C866f7f5307C9b29) {
    +++ description: A custom contract allowing a 3/3 of 0xBDFfCC71FE84020238F2990a6D2954e87355De0D, 0xbC1653bd3829dfEc575AfC3816D4899cd103B51c and 0xD677e09324F8Bb3cC64F009973693f751c33A888 to `executeEmergencyUpgrade()` via the 0x8f7a9912416e8AdC4D9c21FAe1415D3318A11897.
      sinceBlock:
+        20486038
    }
```

```diff
    contract GnosisSafe (0xFB90Da9DC45378A1B50775Beb03aD10C7E8DC231) {
    +++ description: None
      sinceBlock:
+        20390387
    }
```

Generated with discovered.json: 0xd6e875cc8e83e0d38c0bba2253c8bb8ef4021044

# Diff at Fri, 28 Feb 2025 10:27:08 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@a673c79f7be232b805781e844ed3929c5c5bb288 block: 21802976
- current block number: 21944239

## Description

Two new chains created: lumoz and zkcandy. The former is live.

Current ZK stack chains (BH.getAllHyperchains array): 
1) ZKsync Era 324 RU 0x32400084C286CF3E17e7B677ea9583e60a000324 ETH 🚀✅
2) CronosZkEvm 388 Validium 0x7b2DA4e77BAE0e0d23c53C3BE6650497d0576CFc zkCRO 🚀✅
3) Sophon 50104 Validium 0x05eDE6aD1f39B7A16C949d5C33a0658c9C7241e3 SOPH 🚀
4) ZeroNetwork 543210 RU 0xdbD849acC6bA61F461CB8A41BBaeE2D673CA02d9 ETH 🚀✅
5) [Abstract](docs.abs.xyz) 2741 RU 0x2EDc71E9991A962c7FE172212d1aA9E50480fBb9 ETH 🚀
6) [GRVT](https://grvt.gitbook.io/grvt/introduction/architecture-overview) 325 Validium 0xe3e310cd8EE0C808794810AB50FE4BcCC5c7D89E GBT (GRVTBaseToken) 🚀
7) [Treasure Chain](https://docs.treasure.lol/chain) 61166 Validium 0x5e64D248Eab336AB3Fd0BeC0CFe31D4AAE32E879 MAGIC 🚀✅
8) Unknown 1345 Validium 0x89f90748A9a36C30A324481133fa198f4E16A824 ozETH
9) [lumoz](https://docs.lumoz.org/introduction/lumoz-chain) 9637 RU 0xC8C4cB5AF7c723c7EfD360898B47920679f92C92 MOZ 🚀
10) [zkcandy](https://zkcandy.io/) 320 RU 0xF2704433d11842d15aa76BBF0E00407267a99C92

## Watched changes

```diff
    contract BridgeHub (0x303a465B659cBB0ab36eE643eA362c509EEb5213) {
    +++ description: Sits between the shared bridge and the StateTransitionManager(s) and relays L1 <-> L2 messages from the shared bridge or other ZK stack chains to their respective destinations.
+++ description: All new chains created go thorugh the central bridgehub and are thus stored here with their respective STMs.
      values.chainsCreated.9:
+        {"chainId":320,"stateTransitionManager":"0xc2eE6b6af7d616f6e27ce7F4A451Aedc2b0F5f5C","chainGovernance":"0x309EfA797ec5cd324Cb473F141F95214F3a25ab2"}
+++ description: All new chains created go thorugh the central bridgehub and are thus stored here with their respective STMs.
      values.chainsCreated.8:
+        {"chainId":9637,"stateTransitionManager":"0xc2eE6b6af7d616f6e27ce7F4A451Aedc2b0F5f5C","chainGovernance":"0x9381D943BcC1254723F85E9A85FFcc4Bb3C8deF6"}
    }
```

```diff
    contract StateTransitionManager (0xc2eE6b6af7d616f6e27ce7F4A451Aedc2b0F5f5C) {
    +++ description: Defines L2 diamond contract creation and upgrade data, the proof system for the `ZKsync diamond` contract connected to it (and other L2 diamond contracts that share the logic).
      values.getAllHyperchainChainIDs.9:
+        320
      values.getAllHyperchainChainIDs.8:
+        9637
      values.getAllHyperchains.9:
+        "0xF2704433d11842d15aa76BBF0E00407267a99C92"
      values.getAllHyperchains.8:
+        "0xC8C4cB5AF7c723c7EfD360898B47920679f92C92"
    }
```

Generated with discovered.json: 0x8240be23b7c2deb2da1c1ec6b7dcf4a49cf73f04

# Diff at Wed, 26 Feb 2025 10:33:08 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@18513668f913fbe57a197f43655b19111df0e627 block: 21802976
- current block number: 21802976

## Description

config related: added categories for all opstack, op stack and polygoncdk stack templates.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21802976 (main branch discovery), not current.

```diff
    contract EraAdminProxy (0x2cf3bD6a9056b39999F3883955E183F655345063) {
    +++ description: None
      category:
+        {"name":"Governance","priority":3}
    }
```

```diff
    contract BridgeHub (0x303a465B659cBB0ab36eE643eA362c509EEb5213) {
    +++ description: Sits between the shared bridge and the StateTransitionManager(s) and relays L1 <-> L2 messages from the shared bridge or other ZK stack chains to their respective destinations.
      category:
+        {"name":"Shared Infrastructure","priority":4}
    }
```

```diff
    contract ProtocolUpgradeHandler (0x8f7a9912416e8AdC4D9c21FAe1415D3318A11897) {
    +++ description: The central upgrade contract and Governance proxy for all ZK stack contracts. Accepts successful DAO proposals from L2, emergency proposals from the EmergencyUpgradeBoard. The three members of the EmergencyUpgradeBoard also have special roles and permissions in this contract.
      category:
+        {"name":"Shared Infrastructure","priority":4}
    }
```

```diff
    contract SecurityCouncil (0xBDFfCC71FE84020238F2990a6D2954e87355De0D) {
    +++ description: Custom Multisig implementation that has a general threshold of 9 but also specific thresholds for upgrade approvals (6) or soft freezes (3).
      category:
+        {"name":"Governance","priority":3}
    }
```

```diff
    contract StateTransitionManager (0xc2eE6b6af7d616f6e27ce7F4A451Aedc2b0F5f5C) {
    +++ description: Defines L2 diamond contract creation and upgrade data, the proof system for the `ZKsync diamond` contract connected to it (and other L2 diamond contracts that share the logic).
      category:
+        {"name":"Shared Infrastructure","priority":4}
    }
```

```diff
    contract Guardians (0xD677e09324F8Bb3cC64F009973693f751c33A888) {
    +++ description: Custom Multisig implementation that has a general threshold of 5 and a specific threshold for extending the legal voting period of 2.
      category:
+        {"name":"Governance","priority":3}
    }
```

```diff
    contract L1SharedBridge (0xD7f9f54194C633F36CCD5F3da84ad4a1c38cB2cB) {
    +++ description: This bridge contract escrows all ERC-20s and ETH that are deposited to registered ZK stack chains like ZKsync Era.
      category:
+        {"name":"Shared Infrastructure","priority":4}
    }
```

```diff
    contract EmergencyUpgradeBoard (0xdEFd1eDEE3E8c5965216bd59C866f7f5307C9b29) {
    +++ description: A custom contract allowing a 3/3 of 0xBDFfCC71FE84020238F2990a6D2954e87355De0D, 0xbC1653bd3829dfEc575AfC3816D4899cd103B51c and 0xD677e09324F8Bb3cC64F009973693f751c33A888 to `executeEmergencyUpgrade()` via the 0x8f7a9912416e8AdC4D9c21FAe1415D3318A11897.
      category:
+        {"name":"Governance","priority":3}
    }
```

Generated with discovered.json: 0xeaf42c32ac714e06060a1a87b07efbfd885d6659

# Diff at Fri, 21 Feb 2025 09:00:11 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@1cf9ec35847912163c4b663a633e258a434c0bca block: 21802976
- current block number: 21802976

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21802976 (main branch discovery), not current.

```diff
    contract GnosisSafe (0x015318c16AE443a20DE0A776dB06a59F0D279057) {
    +++ description: None
      category:
+        {"name":"Spam","priority":-1}
    }
```

```diff
    contract GnosisSafe (0x13f07d9BF17615f6a17F272fe1A913168C275A66) {
    +++ description: None
      category:
+        {"name":"Spam","priority":-1}
    }
```

```diff
    contract GnosisSafe (0x178D8Eb1A1fb81B5102808A83318Bb04C6a9fC6D) {
    +++ description: None
      category:
+        {"name":"Spam","priority":-1}
    }
```

```diff
    contract GnosisSafe (0x2A90830083C5Ca1f18d7AA7fCDC2998f93475384) {
    +++ description: None
      category:
+        {"name":"Spam","priority":-1}
    }
```

```diff
    contract GnosisSafe (0x34Ea62D4b9bBB8AD927eFB6ab31E3Ab3474aC93a) {
    +++ description: None
      category:
+        {"name":"Spam","priority":-1}
    }
```

```diff
    contract GnosisSafe (0x35eA56fd9eAd2567F339Eb9564B6940b9DD5653F) {
    +++ description: None
      category:
+        {"name":"Spam","priority":-1}
    }
```

```diff
    contract GnosisSafe (0x3888777686F0b0d8c3108fc22ad8DE9E049bE26F) {
    +++ description: None
      category:
+        {"name":"Spam","priority":-1}
    }
```

```diff
    contract GnosisSafe (0x538612F6eba6ff80FBD95D60dCDee16b8FfF2c0f) {
    +++ description: None
      category:
+        {"name":"Spam","priority":-1}
    }
```

```diff
    contract GnosisSafe (0x55c671BcE13120387Ded710A1d1b80C0e3d8E857) {
    +++ description: None
      category:
+        {"name":"Spam","priority":-1}
    }
```

```diff
    contract GnosisSafe (0x590926dBCDfD19627c3BbD2A6Eb96DeC7a3AbF69) {
    +++ description: None
      category:
+        {"name":"Spam","priority":-1}
    }
```

```diff
    contract GnosisSafe (0x69462a81ba94D64c404575f1899a464F123497A2) {
    +++ description: None
      category:
+        {"name":"Spam","priority":-1}
    }
```

```diff
    contract GnosisSafe (0x6D26874130A174839b9cd8CB87Ed4E09D0c1a5f0) {
    +++ description: None
      category:
+        {"name":"Spam","priority":-1}
    }
```

```diff
    contract GnosisSafe (0x725065b4eB99294BaaE57AdDA9c32e42F453FA8A) {
    +++ description: None
      category:
+        {"name":"Spam","priority":-1}
    }
```

```diff
    contract GnosisSafe (0x84BF0Ac41Eeb74373Ddddae8b7055Bf2bD3CE6E0) {
    +++ description: None
      category:
+        {"name":"Spam","priority":-1}
    }
```

```diff
    contract GnosisSafe (0x9B39Ea22e838B316Ea7D74e7C4B07d91D51ccA88) {
    +++ description: None
      category:
+        {"name":"Spam","priority":-1}
    }
```

```diff
    contract GnosisSafe (0x9B8Be3278B7F0168D82059eb6BAc5991DcdfA803) {
    +++ description: None
      category:
+        {"name":"Spam","priority":-1}
    }
```

```diff
    contract GnosisSafe (0xB7aC3A79A23B148c85fba259712c5A1e7ad0ca44) {
    +++ description: None
      category:
+        {"name":"Spam","priority":-1}
    }
```

```diff
    contract GnosisSafe (0xc3Abc9f9AA75Be8341E831482cdA0125a7B1A23e) {
    +++ description: None
      category:
+        {"name":"Spam","priority":-1}
    }
```

```diff
    contract GnosisSafe (0xCe7a3dFcc35602155809920Ff65e093aa726f6cf) {
    +++ description: None
      category:
+        {"name":"Spam","priority":-1}
    }
```

```diff
    contract GnosisSafe (0xFB90Da9DC45378A1B50775Beb03aD10C7E8DC231) {
    +++ description: None
      category:
+        {"name":"Spam","priority":-1}
    }
```

Generated with discovered.json: 0x62dfffb7ceda3a33bfad682c9fc990bd6ac8ef22

# Diff at Sat, 08 Feb 2025 16:26:08 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@ef01ea79812e0d524af00be3fae1170cef6fd662 block: 21744163
- current block number: 21802976

## Description

sub-MS signer change.

## Watched changes

```diff
    contract GnosisSafe (0xc3Abc9f9AA75Be8341E831482cdA0125a7B1A23e) {
    +++ description: None
      values.$members.4:
-        "0x0298512Bf8e7AC383c0A353354E3Ff66216654Ac"
      values.$members.3:
-        "0xb9e3C7BbC0677dD018254C74B5ed2Ad90a0dba9F"
+        "0x0298512Bf8e7AC383c0A353354E3Ff66216654Ac"
      values.$members.2:
-        "0x310E84b3063bBC5C86ED4Bf4D25E2fc3DF1B9735"
+        "0xb9e3C7BbC0677dD018254C74B5ed2Ad90a0dba9F"
      values.$members.1:
-        "0xB5676D771b538D8E184EaCB1Cc7a963a4bF99252"
+        "0x310E84b3063bBC5C86ED4Bf4D25E2fc3DF1B9735"
      values.$members.0:
-        "0x5B87156f1e4Da117c5B49571aa80C836b007e479"
+        "0xB5676D771b538D8E184EaCB1Cc7a963a4bF99252"
      values.multisigThreshold:
-        "1 of 5 (20%)"
+        "1 of 4 (25%)"
    }
```

Generated with discovered.json: 0x055311d62bd21b26f6dbf2254bfc3b445ccb2b0d

# Diff at Tue, 04 Feb 2025 12:32:33 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@145553eed7ba44636411ecb25e4099728acd02f9 block: 21744163
- current block number: 21744163

## Description

Rename 'configure' permission to 'interact'

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21744163 (main branch discovery), not current.

```diff
    contract EraAdminProxy (0x2cf3bD6a9056b39999F3883955E183F655345063) {
    +++ description: None
      directlyReceivedPermissions.2.permission:
-        "configure"
+        "interact"
      directlyReceivedPermissions.1.permission:
-        "configure"
+        "interact"
      directlyReceivedPermissions.0.permission:
-        "configure"
+        "interact"
    }
```

```diff
    contract BridgeHub (0x303a465B659cBB0ab36eE643eA362c509EEb5213) {
    +++ description: Sits between the shared bridge and the StateTransitionManager(s) and relays L1 <-> L2 messages from the shared bridge or other ZK stack chains to their respective destinations.
      issuedPermissions.0.permission:
-        "configure"
+        "interact"
    }
```

```diff
    contract Matter Labs Multisig (0x4e4943346848c4867F81dFb37c4cA9C5715A7828) {
    +++ description: None
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
    contract ProtocolUpgradeHandler (0x8f7a9912416e8AdC4D9c21FAe1415D3318A11897) {
    +++ description: The central upgrade contract and Governance proxy for all ZK stack contracts. Accepts successful DAO proposals from L2, emergency proposals from the EmergencyUpgradeBoard. The three members of the EmergencyUpgradeBoard also have special roles and permissions in this contract.
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

```diff
    contract SecurityCouncil (0xBDFfCC71FE84020238F2990a6D2954e87355De0D) {
    +++ description: Custom Multisig implementation that has a general threshold of 9 but also specific thresholds for upgrade approvals (6) or soft freezes (3).
      receivedPermissions.0.permission:
-        "configure"
+        "interact"
    }
```

```diff
    contract StateTransitionManager (0xc2eE6b6af7d616f6e27ce7F4A451Aedc2b0F5f5C) {
    +++ description: Defines L2 diamond contract creation and upgrade data, the proof system for the `ZKsync diamond` contract connected to it (and other L2 diamond contracts that share the logic).
      issuedPermissions.0.permission:
-        "configure"
+        "interact"
    }
```

```diff
    contract Guardians (0xD677e09324F8Bb3cC64F009973693f751c33A888) {
    +++ description: Custom Multisig implementation that has a general threshold of 5 and a specific threshold for extending the legal voting period of 2.
      receivedPermissions.0.permission:
-        "configure"
+        "interact"
    }
```

```diff
    contract L1SharedBridge (0xD7f9f54194C633F36CCD5F3da84ad4a1c38cB2cB) {
    +++ description: This bridge contract escrows all ERC-20s and ETH that are deposited to registered ZK stack chains like ZKsync Era.
      issuedPermissions.0.permission:
-        "configure"
+        "interact"
    }
```

Generated with discovered.json: 0x31b0dacc814f04df8b051448dbb2ffe2ec1fefa2

# Diff at Fri, 31 Jan 2025 11:18:51 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@84b1296dd423a2ef9361874d922cd6911109ba10 block: 21716805
- current block number: 21744163

## Description

sub-MS member changes.

## Watched changes

```diff
    contract GnosisSafe (0x9B39Ea22e838B316Ea7D74e7C4B07d91D51ccA88) {
    +++ description: None
      values.$members.2:
+        "0xcD6998D20876155D37aEC0dB4C19d63EEAEf058F"
      values.$members.1:
-        "0xDfe6610c2357a0BfECF788e52697554aF5F35174"
+        "0xd9f8460f3081dC29dF1e3b6e5404B245B96F4A30"
      values.$members.0:
-        "0xcD6998D20876155D37aEC0dB4C19d63EEAEf058F"
+        "0x438Df339934B6Fb9dA8E0DC6f0Ba0bca22B8A7b5"
      values.multisigThreshold:
-        "1 of 2 (50%)"
+        "1 of 3 (33%)"
    }
```

Generated with discovered.json: 0x03c5af13478d02516b582a390c63107b0fe8a114

# Diff at Tue, 28 Jan 2025 06:34:19 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@3683d6e8b703ed59c2657f83d1b54955644c5977 block: 21715649
- current block number: 21716805

## Description

discodrive!

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21715649 (main branch discovery), not current.

```diff
    contract EraAdminProxy (0x2cf3bD6a9056b39999F3883955E183F655345063) {
    +++ description: None
      name:
-        "EraChainAdminProxy"
+        "EraAdminProxy"
      directlyReceivedPermissions:
+        [{"permission":"configure","from":"0x303a465B659cBB0ab36eE643eA362c509EEb5213","description":"register new tokens in the BridgeHub and create new chains sharing the Elastic Chain contracts."},{"permission":"configure","from":"0xc2eE6b6af7d616f6e27ce7F4A451Aedc2b0F5f5C","description":"manage the shared ValidatorTimelock contract address, revert batches and set permissioned validators for all chains connected to the StateTransitionManager."},{"permission":"configure","from":"0xD7f9f54194C633F36CCD5F3da84ad4a1c38cB2cB","description":"register new Elastic Chains in the shared bridge."}]
    }
```

```diff
    contract BridgeHub (0x303a465B659cBB0ab36eE643eA362c509EEb5213) {
    +++ description: Sits between the shared bridge and the StateTransitionManager(s) and relays L1 <-> L2 messages from the shared bridge or other ZK stack chains to their respective destinations.
      issuedPermissions.1:
+        {"permission":"upgrade","to":"0xdEFd1eDEE3E8c5965216bd59C866f7f5307C9b29","via":[{"address":"0x8f7a9912416e8AdC4D9c21FAe1415D3318A11897"},{"address":"0xC2a36181fB524a6bEfE639aFEd37A67e77d62cf1"}]}
      issuedPermissions.0.permission:
-        "upgrade"
+        "configure"
      issuedPermissions.0.to:
-        "0xC2a36181fB524a6bEfE639aFEd37A67e77d62cf1"
+        "0x4e4943346848c4867F81dFb37c4cA9C5715A7828"
      issuedPermissions.0.via.0:
+        {"address":"0x2cf3bD6a9056b39999F3883955E183F655345063"}
      issuedPermissions.0.description:
+        "register new tokens in the BridgeHub and create new chains sharing the Elastic Chain contracts."
      template:
+        "shared-zk-stack/BridgeHub"
      description:
+        "Sits between the shared bridge and the StateTransitionManager(s) and relays L1 <-> L2 messages from the shared bridge or other ZK stack chains to their respective destinations."
    }
```

```diff
    contract Matter Labs Multisig (0x4e4943346848c4867F81dFb37c4cA9C5715A7828) {
    +++ description: None
      description:
-        "Can instantly upgrade all contracts and roles in the zksync Era contracts"
      fieldMeta:
-        {"getOwners":{"severity":"LOW","description":"Signers of the multisig","type":"PERMISSION"},"getThreshold":{"severity":"HIGH","description":"Should be 4/8 per official docs","type":"PERMISSION"}}
      receivedPermissions:
+        [{"permission":"configure","from":"0x303a465B659cBB0ab36eE643eA362c509EEb5213","description":"register new tokens in the BridgeHub and create new chains sharing the Elastic Chain contracts.","via":[{"address":"0x2cf3bD6a9056b39999F3883955E183F655345063"}]},{"permission":"configure","from":"0xc2eE6b6af7d616f6e27ce7F4A451Aedc2b0F5f5C","description":"manage the shared ValidatorTimelock contract address, revert batches and set permissioned validators for all chains connected to the StateTransitionManager.","via":[{"address":"0x2cf3bD6a9056b39999F3883955E183F655345063"}]},{"permission":"configure","from":"0xD7f9f54194C633F36CCD5F3da84ad4a1c38cB2cB","description":"register new Elastic Chains in the shared bridge.","via":[{"address":"0x2cf3bD6a9056b39999F3883955E183F655345063"}]}]
      directlyReceivedPermissions:
+        [{"permission":"act","from":"0x2cf3bD6a9056b39999F3883955E183F655345063"}]
    }
```

```diff
-   Status: DELETED
    contract ValidatorTimelock (0x5D8ba173Dc6C3c90C8f7C04C9288BeF5FDbAd06E)
    +++ description: None
```

```diff
    contract GenesisUpgrade (0x6e2BC597F1e83F9fC7c1f69157F2C12476873971) {
    +++ description: Helper contract that defines diamondcut data to initialize a new diamond implementation for the chain-specific system contracts.
      template:
+        "shared-zk-stack/GenesisUpgrade"
      description:
+        "Helper contract that defines diamondcut data to initialize a new diamond implementation for the chain-specific system contracts."
    }
```

```diff
    contract ProtocolUpgradeHandler (0x8f7a9912416e8AdC4D9c21FAe1415D3318A11897) {
    +++ description: The central upgrade contract and Governance proxy for all ZK stack contracts. Accepts successful DAO proposals from L2, emergency proposals from the EmergencyUpgradeBoard. The three members of the EmergencyUpgradeBoard also have special roles and permissions in this contract.
      template:
+        "shared-zk-stack/ProtocolUpgradeHandler"
      description:
+        "The central upgrade contract and Governance proxy for all ZK stack contracts. Accepts successful DAO proposals from L2, emergency proposals from the EmergencyUpgradeBoard. The three members of the EmergencyUpgradeBoard also have special roles and permissions in this contract."
      issuedPermissions:
+        [{"permission":"configure","to":"0x3701fB675bCd4A85eb11A2467628BBe193F6e6A8","description":"start (queue) upgrades.","via":[]},{"permission":"configure","to":"0xBDFfCC71FE84020238F2990a6D2954e87355De0D","description":"soft freeze, hard freeze, approve a protocol upgrade.","via":[]},{"permission":"configure","to":"0xD677e09324F8Bb3cC64F009973693f751c33A888","description":"extend the legal veto period, approve a protocol upgrade.","via":[]}]
      directlyReceivedPermissions:
+        [{"permission":"act","from":"0xC2a36181fB524a6bEfE639aFEd37A67e77d62cf1"}]
    }
```

```diff
    contract SecurityCouncil (0xBDFfCC71FE84020238F2990a6D2954e87355De0D) {
    +++ description: Custom Multisig implementation that has a general threshold of 9 but also specific thresholds for upgrade approvals (6) or soft freezes (3).
      values.members:
-        ["0x13f07d9BF17615f6a17F272fe1A913168C275A66","0x34Ea62D4b9bBB8AD927eFB6ab31E3Ab3474aC93a","0x35eA56fd9eAd2567F339Eb9564B6940b9DD5653F","0x3888777686F0b0d8c3108fc22ad8DE9E049bE26F","0x69462a81ba94D64c404575f1899a464F123497A2","0x725065b4eB99294BaaE57AdDA9c32e42F453FA8A","0x84BF0Ac41Eeb74373Ddddae8b7055Bf2bD3CE6E0","0x9B39Ea22e838B316Ea7D74e7C4B07d91D51ccA88","0x9B8Be3278B7F0168D82059eb6BAc5991DcdfA803","0xB7aC3A79A23B148c85fba259712c5A1e7ad0ca44","0xc3Abc9f9AA75Be8341E831482cdA0125a7B1A23e","0xFB90Da9DC45378A1B50775Beb03aD10C7E8DC231"]
      values.$members:
+        ["0x13f07d9BF17615f6a17F272fe1A913168C275A66","0x34Ea62D4b9bBB8AD927eFB6ab31E3Ab3474aC93a","0x35eA56fd9eAd2567F339Eb9564B6940b9DD5653F","0x3888777686F0b0d8c3108fc22ad8DE9E049bE26F","0x69462a81ba94D64c404575f1899a464F123497A2","0x725065b4eB99294BaaE57AdDA9c32e42F453FA8A","0x84BF0Ac41Eeb74373Ddddae8b7055Bf2bD3CE6E0","0x9B39Ea22e838B316Ea7D74e7C4B07d91D51ccA88","0x9B8Be3278B7F0168D82059eb6BAc5991DcdfA803","0xB7aC3A79A23B148c85fba259712c5A1e7ad0ca44","0xc3Abc9f9AA75Be8341E831482cdA0125a7B1A23e","0xFB90Da9DC45378A1B50775Beb03aD10C7E8DC231"]
      values.$threshold:
+        9
      template:
+        "shared-zk-stack/SecurityCouncil"
      description:
+        "Custom Multisig implementation that has a general threshold of 9 but also specific thresholds for upgrade approvals (6) or soft freezes (3)."
      receivedPermissions:
+        [{"permission":"configure","from":"0x8f7a9912416e8AdC4D9c21FAe1415D3318A11897","description":"soft freeze, hard freeze, approve a protocol upgrade."}]
      references:
+        [{"text":"Security Council members - ZK Nation docs","href":"https://docs.zknation.io/zksync-governance/schedule-3-zksync-security-council"}]
    }
```

```diff
    contract ProxyAdmin (0xC2a36181fB524a6bEfE639aFEd37A67e77d62cf1) {
    +++ description: None
      receivedPermissions:
-        [{"permission":"upgrade","from":"0x303a465B659cBB0ab36eE643eA362c509EEb5213"},{"permission":"upgrade","from":"0xc2eE6b6af7d616f6e27ce7F4A451Aedc2b0F5f5C"},{"permission":"upgrade","from":"0xD7f9f54194C633F36CCD5F3da84ad4a1c38cB2cB"}]
      template:
+        "global/ProxyAdmin"
      directlyReceivedPermissions:
+        [{"permission":"upgrade","from":"0x303a465B659cBB0ab36eE643eA362c509EEb5213"},{"permission":"upgrade","from":"0xc2eE6b6af7d616f6e27ce7F4A451Aedc2b0F5f5C"},{"permission":"upgrade","from":"0xD7f9f54194C633F36CCD5F3da84ad4a1c38cB2cB"}]
    }
```

```diff
    contract StateTransitionManager (0xc2eE6b6af7d616f6e27ce7F4A451Aedc2b0F5f5C) {
    +++ description: Defines L2 diamond contract creation and upgrade data, the proof system for the `ZKsync diamond` contract connected to it (and other L2 diamond contracts that share the logic).
      issuedPermissions.1:
+        {"permission":"upgrade","to":"0xdEFd1eDEE3E8c5965216bd59C866f7f5307C9b29","via":[{"address":"0x8f7a9912416e8AdC4D9c21FAe1415D3318A11897"},{"address":"0xC2a36181fB524a6bEfE639aFEd37A67e77d62cf1"}]}
      issuedPermissions.0.permission:
-        "upgrade"
+        "configure"
      issuedPermissions.0.to:
-        "0xC2a36181fB524a6bEfE639aFEd37A67e77d62cf1"
+        "0x4e4943346848c4867F81dFb37c4cA9C5715A7828"
      issuedPermissions.0.via.0:
+        {"address":"0x2cf3bD6a9056b39999F3883955E183F655345063"}
      issuedPermissions.0.description:
+        "manage the shared ValidatorTimelock contract address, revert batches and set permissioned validators for all chains connected to the StateTransitionManager."
      template:
+        "shared-zk-stack/StateTransitionManager"
      description:
+        "Defines L2 diamond contract creation and upgrade data, the proof system for the `ZKsync diamond` contract connected to it (and other L2 diamond contracts that share the logic)."
    }
```

```diff
    contract Guardians (0xD677e09324F8Bb3cC64F009973693f751c33A888) {
    +++ description: Custom Multisig implementation that has a general threshold of 5 and a specific threshold for extending the legal voting period of 2.
      values.members:
-        ["0x015318c16AE443a20DE0A776dB06a59F0D279057","0x178D8Eb1A1fb81B5102808A83318Bb04C6a9fC6D","0x2A90830083C5Ca1f18d7AA7fCDC2998f93475384","0x538612F6eba6ff80FBD95D60dCDee16b8FfF2c0f","0x55c671BcE13120387Ded710A1d1b80C0e3d8E857","0x590926dBCDfD19627c3BbD2A6Eb96DeC7a3AbF69","0x6D26874130A174839b9cd8CB87Ed4E09D0c1a5f0","0xCe7a3dFcc35602155809920Ff65e093aa726f6cf"]
      values.$members:
+        ["0x015318c16AE443a20DE0A776dB06a59F0D279057","0x178D8Eb1A1fb81B5102808A83318Bb04C6a9fC6D","0x2A90830083C5Ca1f18d7AA7fCDC2998f93475384","0x538612F6eba6ff80FBD95D60dCDee16b8FfF2c0f","0x55c671BcE13120387Ded710A1d1b80C0e3d8E857","0x590926dBCDfD19627c3BbD2A6Eb96DeC7a3AbF69","0x6D26874130A174839b9cd8CB87Ed4E09D0c1a5f0","0xCe7a3dFcc35602155809920Ff65e093aa726f6cf"]
      values.$threshold:
+        5
      template:
+        "shared-zk-stack/Guardians"
      description:
+        "Custom Multisig implementation that has a general threshold of 5 and a specific threshold for extending the legal voting period of 2."
      receivedPermissions:
+        [{"permission":"configure","from":"0x8f7a9912416e8AdC4D9c21FAe1415D3318A11897","description":"extend the legal veto period, approve a protocol upgrade."}]
      references:
+        [{"text":"Guardians - ZK Nation docs","href":"https://docs.zknation.io/zksync-governance/schedule-4-zksync-guardians"}]
    }
```

```diff
    contract L1SharedBridge (0xD7f9f54194C633F36CCD5F3da84ad4a1c38cB2cB) {
    +++ description: This bridge contract escrows all ERC-20s and ETH that are deposited to registered ZK stack chains like ZKsync Era.
      issuedPermissions.1:
+        {"permission":"upgrade","to":"0xdEFd1eDEE3E8c5965216bd59C866f7f5307C9b29","via":[{"address":"0x8f7a9912416e8AdC4D9c21FAe1415D3318A11897"},{"address":"0xC2a36181fB524a6bEfE639aFEd37A67e77d62cf1"}]}
      issuedPermissions.0.permission:
-        "upgrade"
+        "configure"
      issuedPermissions.0.to:
-        "0xC2a36181fB524a6bEfE639aFEd37A67e77d62cf1"
+        "0x4e4943346848c4867F81dFb37c4cA9C5715A7828"
      issuedPermissions.0.via.0:
+        {"address":"0x2cf3bD6a9056b39999F3883955E183F655345063"}
      issuedPermissions.0.description:
+        "register new Elastic Chains in the shared bridge."
      template:
+        "shared-zk-stack/L1SharedBridge"
      description:
+        "This bridge contract escrows all ERC-20s and ETH that are deposited to registered ZK stack chains like ZKsync Era."
    }
```

```diff
    contract EmergencyUpgradeBoard (0xdEFd1eDEE3E8c5965216bd59C866f7f5307C9b29) {
    +++ description: A custom contract allowing a 3/3 of 0xBDFfCC71FE84020238F2990a6D2954e87355De0D, 0xbC1653bd3829dfEc575AfC3816D4899cd103B51c and 0xD677e09324F8Bb3cC64F009973693f751c33A888 to `executeEmergencyUpgrade()` via the 0x8f7a9912416e8AdC4D9c21FAe1415D3318A11897.
      template:
+        "shared-zk-stack/EmergencyUpgradeBoard"
      description:
+        "A custom contract allowing a 3/3 of 0xBDFfCC71FE84020238F2990a6D2954e87355De0D, 0xbC1653bd3829dfEc575AfC3816D4899cd103B51c and 0xD677e09324F8Bb3cC64F009973693f751c33A888 to `executeEmergencyUpgrade()` via the 0x8f7a9912416e8AdC4D9c21FAe1415D3318A11897."
      receivedPermissions:
+        [{"permission":"upgrade","from":"0x303a465B659cBB0ab36eE643eA362c509EEb5213","via":[{"address":"0xC2a36181fB524a6bEfE639aFEd37A67e77d62cf1"},{"address":"0x8f7a9912416e8AdC4D9c21FAe1415D3318A11897"}]},{"permission":"upgrade","from":"0xc2eE6b6af7d616f6e27ce7F4A451Aedc2b0F5f5C","via":[{"address":"0xC2a36181fB524a6bEfE639aFEd37A67e77d62cf1"},{"address":"0x8f7a9912416e8AdC4D9c21FAe1415D3318A11897"}]},{"permission":"upgrade","from":"0xD7f9f54194C633F36CCD5F3da84ad4a1c38cB2cB","via":[{"address":"0xC2a36181fB524a6bEfE639aFEd37A67e77d62cf1"},{"address":"0x8f7a9912416e8AdC4D9c21FAe1415D3318A11897"}]}]
      directlyReceivedPermissions:
+        [{"permission":"act","from":"0x8f7a9912416e8AdC4D9c21FAe1415D3318A11897"}]
    }
```

Generated with discovered.json: 0x1bea2349b623e76e37cd29e9fb16f8a540badb4f

# Diff at Mon, 27 Jan 2025 11:46:12 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@43cb526d71ed01f024dced9d5aea2a30cf306714 block: 21630370
- current block number: 21715649

## Description

new zk stack chain added:

🚀: posting batches
✅: officially launched 

Current ZK stack chains (BH.getAllHyperchains array): 
1) ZKsync Era 324 RU 0x32400084C286CF3E17e7B677ea9583e60a000324 ETH 🚀✅
2) CronosZkEvm 388 Validium 0x7b2DA4e77BAE0e0d23c53C3BE6650497d0576CFc zkCRO 🚀✅
3) Sophon 50104 Validium 0x05eDE6aD1f39B7A16C949d5C33a0658c9C7241e3 SOPH 🚀
4) ZeroNetwork 543210 RU 0xdbD849acC6bA61F461CB8A41BBaeE2D673CA02d9 ETH 🚀✅
5) [Abstract](docs.abs.xyz) 2741 RU 0x2EDc71E9991A962c7FE172212d1aA9E50480fBb9 ETH 🚀
6) [GRVT](https://grvt.gitbook.io/grvt/introduction/architecture-overview) 325 Validium 0xe3e310cd8EE0C808794810AB50FE4BcCC5c7D89E GBT (GRVTBaseToken) 🚀
7) [Treasure Chain](https://docs.treasure.lol/chain) 61166 Validium 0x5e64D248Eab336AB3Fd0BeC0CFe31D4AAE32E879 MAGIC 🚀✅
8) Unknown 1345 Validium 0x89f90748A9a36C30A324481133fa198f4E16A824 ozETH

abstract will launch today.

## Watched changes

```diff
    contract BridgeHub (0x303a465B659cBB0ab36eE643eA362c509EEb5213) {
    +++ description: None
+++ description: All new chains created go thorugh the central bridgehub and are thus stored here with their respective STMs.
      values.chainsCreated.7:
+        {"chainId":1345,"stateTransitionManager":"0xc2eE6b6af7d616f6e27ce7F4A451Aedc2b0F5f5C","chainGovernance":"0x49664fFe2c2335c28631629606E26a6971aEf261"}
    }
```

```diff
    contract StateTransitionManager (0xc2eE6b6af7d616f6e27ce7F4A451Aedc2b0F5f5C) {
    +++ description: None
      values.getAllHyperchainChainIDs.7:
+        1345
      values.getAllHyperchains.7:
+        "0x89f90748A9a36C30A324481133fa198f4E16A824"
    }
```

Generated with discovered.json: 0x5fd268f6b8cd64ea74979363d5fc9b7bc1f7fbf5

# Diff at Mon, 27 Jan 2025 08:45:23 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@19f9c78c593bd40f9a0b28c3dce98eac1bd1d1b8 block: 21630370
- current block number: 21630370

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21630370 (main branch discovery), not current.

```diff
    contract ValidatorTimelock (0x5D8ba173Dc6C3c90C8f7C04C9288BeF5FDbAd06E) {
    +++ description: None
      values.cronosValidatorsAdded:
-        ["0xACBD581D1BedB2F71d2F5F01f881586e0623d591","0xE4F4FdaD61f192EBe9a32b2d2fB47A5802891e14","0xb9d48DaF26F3CBE01A959F09f98E8a2eC8204122","0x7fEA26A181A792B5107ee0a31e434F5dBcbBe0B7"]
      values.cronosValidatorsRemoved:
-        ["0xE4F4FdaD61f192EBe9a32b2d2fB47A5802891e14","0xACBD581D1BedB2F71d2F5F01f881586e0623d591"]
      values.grvtValidatorsAdded:
-        ["0x58D14960E0a2be353eDdE61ad719196A2b816522","0x0b114d4675Cb79507e68F2616c93e124122c6ef0"]
      values.grvtValidatorsRemoved:
-        []
      values.sophonValidatorsAdded:
-        ["0x4cc87B0A504047967CeD9A955431B3229237e7de","0xf3b07F6744e06cd5074b7D15ed2c33760837CE1f"]
      values.sophonValidatorsRemoved:
-        []
      values.treasureValidatorsAdded:
-        ["0x2572835e02b59078711aa0800490e80975e4169d","0x4131719fb0FA1CB3e3A052A4A309ea7575d8c283"]
      values.treasureValidatorsRemoved:
-        []
      values.zeronetworkValidatorsAdded:
-        ["0x0F9B807d5B0cE12450059B425Dc35C727D65CB2F","0x479B7c95b9509E1A834C994fc94e3581aA8A73B9"]
      values.zeronetworkValidatorsRemoved:
-        []
      values.zksyncValidatorsAdded:
-        ["0x0D3250c3D5FAcb74Ac15834096397a3Ef790ec99","0x3527439923a63F8C13CF72b8Fe80a77f6e572092"]
      values.zksyncValidatorsRemoved:
-        []
      values.cronosValidators:
+        ["0xb9d48DaF26F3CBE01A959F09f98E8a2eC8204122","0x7fEA26A181A792B5107ee0a31e434F5dBcbBe0B7"]
      values.grvtValidators:
+        ["0x58D14960E0a2be353eDdE61ad719196A2b816522","0x0b114d4675Cb79507e68F2616c93e124122c6ef0"]
      values.sophonValidators:
+        ["0x4cc87B0A504047967CeD9A955431B3229237e7de","0xf3b07F6744e06cd5074b7D15ed2c33760837CE1f"]
      values.treasureValidators:
+        ["0x2572835e02b59078711aa0800490e80975e4169d","0x4131719fb0FA1CB3e3A052A4A309ea7575d8c283"]
      values.zeronetworkValidators:
+        ["0x0F9B807d5B0cE12450059B425Dc35C727D65CB2F","0x479B7c95b9509E1A834C994fc94e3581aA8A73B9"]
      values.zksyncValidators:
+        ["0x0D3250c3D5FAcb74Ac15834096397a3Ef790ec99","0x3527439923a63F8C13CF72b8Fe80a77f6e572092"]
    }
```

Generated with discovered.json: 0xddf66763fd2f8f422ceeeff1382e701e28511520

# Diff at Mon, 20 Jan 2025 11:10:06 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@2c8b4f3d9910bb6371be9b4df87b70856e7d8c64 block: 21630370
- current block number: 21630370

## Description

Rerun on the same block number. Applies fixes to permissions and via field. Renames permission's target to to/from.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21630370 (main branch discovery), not current.

```diff
    contract BridgeHub (0x303a465B659cBB0ab36eE643eA362c509EEb5213) {
    +++ description: None
      issuedPermissions.0.target:
-        "0xC2a36181fB524a6bEfE639aFEd37A67e77d62cf1"
      issuedPermissions.0.to:
+        "0xC2a36181fB524a6bEfE639aFEd37A67e77d62cf1"
    }
```

```diff
    contract ProxyAdmin (0xC2a36181fB524a6bEfE639aFEd37A67e77d62cf1) {
    +++ description: None
      receivedPermissions.2.target:
-        "0xD7f9f54194C633F36CCD5F3da84ad4a1c38cB2cB"
      receivedPermissions.2.from:
+        "0xD7f9f54194C633F36CCD5F3da84ad4a1c38cB2cB"
      receivedPermissions.1.target:
-        "0xc2eE6b6af7d616f6e27ce7F4A451Aedc2b0F5f5C"
      receivedPermissions.1.from:
+        "0xc2eE6b6af7d616f6e27ce7F4A451Aedc2b0F5f5C"
      receivedPermissions.0.target:
-        "0x303a465B659cBB0ab36eE643eA362c509EEb5213"
      receivedPermissions.0.from:
+        "0x303a465B659cBB0ab36eE643eA362c509EEb5213"
    }
```

```diff
    contract StateTransitionManager (0xc2eE6b6af7d616f6e27ce7F4A451Aedc2b0F5f5C) {
    +++ description: None
      issuedPermissions.0.target:
-        "0xC2a36181fB524a6bEfE639aFEd37A67e77d62cf1"
      issuedPermissions.0.to:
+        "0xC2a36181fB524a6bEfE639aFEd37A67e77d62cf1"
    }
```

```diff
    contract L1SharedBridge (0xD7f9f54194C633F36CCD5F3da84ad4a1c38cB2cB) {
    +++ description: None
      issuedPermissions.0.target:
-        "0xC2a36181fB524a6bEfE639aFEd37A67e77d62cf1"
      issuedPermissions.0.to:
+        "0xC2a36181fB524a6bEfE639aFEd37A67e77d62cf1"
    }
```

Generated with discovered.json: 0x9689f25484248ef4dcada49eedef9676e5c7572e

# Diff at Mon, 20 Jan 2025 09:25:22 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@82d3b5c180381f7d2d0e30406b2ac10025d0614f block: 21630370
- current block number: 21630370

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21630370 (main branch discovery), not current.

```diff
    contract Matter Labs Multisig (0x4e4943346848c4867F81dFb37c4cA9C5715A7828) {
    +++ description: Can instantly upgrade all contracts and roles in the zksync Era contracts
      fieldMeta.getOwners.type:
+        "PERMISSION"
      fieldMeta.getThreshold.type:
+        "PERMISSION"
    }
```

Generated with discovered.json: 0x089edefbfba6e10c0a05b5f4799e7ef7af5a1815

# Diff at Fri, 10 Jan 2025 11:44:13 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@e594a564c9c62a7edef1a6e3f64f955bf70aa8eb block: 21585244
- current block number: 21593851

## Description

UpgradeTimestamp added for the latest ZKsync Protocol Upgrade v25 (QoL upgrade, partly reviewed below).

## Watched changes

```diff
    contract EraChainAdminProxy (0x2cf3bD6a9056b39999F3883955E183F655345063) {
    +++ description: None
+++ description: Timestamps for new protocol version upgrades can be registered here (NOT enforced)
      values.upgradeTimestamps.1:
+        {"_protocolVersion":107374182400,"_upgradeTimestamp":1736517600}
    }
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21585244 (main branch discovery), not current.

```diff
    contract BridgeHub (0x303a465B659cBB0ab36eE643eA362c509EEb5213) {
    +++ description: None
      values.GrvtDiamond:
+        "0xe3e310cd8EE0C808794810AB50FE4BcCC5c7D89E"
      values.GrvtSTM:
+        "0xc2eE6b6af7d616f6e27ce7F4A451Aedc2b0F5f5C"
    }
```

```diff
    contract ValidatorTimelock (0x5D8ba173Dc6C3c90C8f7C04C9288BeF5FDbAd06E) {
    +++ description: None
      values.grvtThirdBatchTS:
-        1733327159
      values.grvtValidatorsAdded:
+        ["0x58D14960E0a2be353eDdE61ad719196A2b816522","0x0b114d4675Cb79507e68F2616c93e124122c6ef0"]
      values.grvtValidatorsRemoved:
+        []
      fieldMeta.grvtThirdBatchTS:
-        {"severity":"MEDIUM","description":"If non-zero, the third batch has been posted (launch monitor)."}
    }
```

Generated with discovered.json: 0x403fce2f16a4bdb19d6487a08be2ae753e9a6875

# Diff at Thu, 09 Jan 2025 06:50:39 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@edc6acaed84d40aabd5185e0a0b5ebaf1c90143b block: 21543858
- current block number: 21585244

## Description

Upgrade BridgeHub, StateTransitionManager, L1SharedBridge. [Tally proposal](https://www.tally.xyz/gov/zksync/proposal/39897055470405054808751466940888279812739313934036970931300785151980460250983?govId=eip155:324:0x76705327e682F2d96943280D99464Ab61219e34f).

Minor changes only (replacing `require()` with `if(revert()))` and adding docs).

## Watched changes

```diff
    contract BridgeHub (0x303a465B659cBB0ab36eE643eA362c509EEb5213) {
    +++ description: None
      sourceHashes.1:
-        "0x0d42e482e85877d75871eacd767228a9e735bb3e0478cb2b80235d6f428ba055"
+        "0x568d6f26c34f7da5f4ac55957f99d9e66cbf967d550fa27ec431fb66bbd36a0b"
      values.$implementation:
-        "0x509dA1BE24432F8804C4A9FF4a3c3f80284CDd13"
+        "0x0029e562c0b54C0b88cB22adF4346DbfEC87400c"
      values.$pastUpgrades.2:
+        ["2025-01-08T16:00:35.000Z","0xc90d135e4b8ab58304853f3be34b2fefd18c2a817d3d250e7b669e024d5277c5",["0x0029e562c0b54C0b88cB22adF4346DbfEC87400c"]]
      values.$upgradeCount:
-        2
+        3
    }
```

```diff
-   Status: DELETED
    contract GenesisUpgrade (0x3dDD7ED2AeC0758310A4C6596522FCAeD108DdA2)
    +++ description: None
```

```diff
    contract StateTransitionManager (0xc2eE6b6af7d616f6e27ce7F4A451Aedc2b0F5f5C) {
    +++ description: None
      sourceHashes.1:
-        "0x96877e17c5bb84aa94de97c0a9764405e673c26bbf2c649349984d825b326940"
+        "0x2322249822d1ffda838f7005dd4137d161f15f2cc3553e9bffba7c04a44d9226"
      values.$implementation:
-        "0xed1Dc7F0Be2B19cb02a2476150C8ea24A37c5274"
+        "0xb39B175a5E0945F2FB6A7F31764c0e31D9cF5b75"
      values.$pastUpgrades.2:
+        ["2025-01-08T16:00:35.000Z","0xc90d135e4b8ab58304853f3be34b2fefd18c2a817d3d250e7b669e024d5277c5",["0xb39B175a5E0945F2FB6A7F31764c0e31D9cF5b75"]]
      values.$upgradeCount:
-        2
+        3
      values.genesisUpgrade:
-        "0x3dDD7ED2AeC0758310A4C6596522FCAeD108DdA2"
+        "0x6e2BC597F1e83F9fC7c1f69157F2C12476873971"
      values.getSemverProtocolVersion.2:
-        2
+        0
      values.getSemverProtocolVersion.1:
-        24
+        25
      values.initialCutHash:
-        "0x88acf7bca5d9b0309546e053ad035bd6d8da5f13f39ca1d8f8ffab1a8d4aa60f"
+        "0x0b30ec2102ea8e2cf92d22857c347d3b29bde8dfaf6f2ae19045f19c5a94ba5a"
      values.protocolVersion:
-        103079215106
+        107374182400
      values.storedBatchZero:
-        "0x1574fa776dec8da2071e5f20d71840bfcbd82c2bca9ad68680edfedde1710bc4"
+        "0x83325e26523f69ee6ea60aea582325d22f3c6a85db5e4890e14d62a377635a6b"
    }
```

```diff
    contract L1SharedBridge (0xD7f9f54194C633F36CCD5F3da84ad4a1c38cB2cB) {
    +++ description: None
      sourceHashes.1:
-        "0xee3958605e4357a1803d3eb2c6d0d455fdbcc9c550a55b801834030d2a39cef8"
+        "0x23ebe4dfc517328a5acc1f6f8aa84be593be5db9d6357fcdcd69c62ca60853f7"
      values.$implementation:
-        "0xb56A8225A745756DD215faf22E4796f373561AcD"
+        "0xF5A14DCdde1143443f06033200D345c2a2828A99"
      values.$pastUpgrades.2:
+        ["2025-01-08T16:00:35.000Z","0xc90d135e4b8ab58304853f3be34b2fefd18c2a817d3d250e7b669e024d5277c5",["0xF5A14DCdde1143443f06033200D345c2a2828A99"]]
      values.$upgradeCount:
-        2
+        3
      values.ERA_CHAIN_ID:
-        324
      values.ERA_DIAMOND_PROXY:
-        "0x32400084C286CF3E17e7B677ea9583e60a000324"
    }
```

```diff
+   Status: CREATED
    contract GenesisUpgrade (0x6e2BC597F1e83F9fC7c1f69157F2C12476873971)
    +++ description: None
```

## Source code changes

```diff
.../BridgeHub/Bridgehub.sol                        | 143 ++++++---
 .../{.flat@21543858 => .flat}/GenesisUpgrade.sol   | 352 +++++++++++++++------
 .../L1SharedBridge/L1SharedBridge.sol              | 278 +++++++++++-----
 .../StateTransitionManager.sol                     | 126 ++++++--
 4 files changed, 645 insertions(+), 254 deletions(-)
```

Generated with discovered.json: 0x630ceb70bec843b173e2618cf268f7e1adda1539

# Diff at Fri, 03 Jan 2025 12:08:58 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@f2f208ac8a91552305da5e03332108446838b892 block: 21421036
- current block number: 21543858

## Description

Multisig signer changes.

## Watched changes

```diff
    contract GnosisSafe (0x84BF0Ac41Eeb74373Ddddae8b7055Bf2bD3CE6E0) {
    +++ description: None
      values.$members.5:
-        "0x3133781381bC58564D5e9888c208ED0b7BD7721F"
      values.$members.4:
-        "0xDFbD13B78010BF2110a168FA59b682c8a6D96564"
+        "0x3133781381bC58564D5e9888c208ED0b7BD7721F"
      values.$members.3:
-        "0xB2Be7F1957Fe3C3Be912e8C736d7e6e8459d386c"
+        "0xDFbD13B78010BF2110a168FA59b682c8a6D96564"
      values.$members.2:
-        "0x0F3F84b0aaaA6f577468F6708e7A5E09e59dbfA1"
+        "0xB2Be7F1957Fe3C3Be912e8C736d7e6e8459d386c"
      values.$members.1:
-        "0x2Fd57fdFba5aABbFdc43Fd450c2817D1401E72F2"
+        "0x0F3F84b0aaaA6f577468F6708e7A5E09e59dbfA1"
      values.$members.0:
-        "0x09040e439Ca5F1CF50CF4e9BE9b1F1FB8ef1ce07"
+        "0x2Fd57fdFba5aABbFdc43Fd450c2817D1401E72F2"
      values.multisigThreshold:
-        "2 of 6 (33%)"
+        "2 of 5 (40%)"
    }
```

Generated with discovered.json: 0x689e4270aa9108022db71e3b0f874b583a00bdef

# Diff at Thu, 12 Dec 2024 11:47:09 GMT:

- author: vincfurc (<10850139+vincfurc@users.noreply.github.com>)
- comparing to: main@fa5a98638066331a8ea6329a256a3462e7da2b3a block: 21357589
- current block number: 21386218

## Description

Config related changes. Adding Sophon discovery.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21357589 (main branch discovery), not current.

```diff
    contract ValidatorTimelock (0x5D8ba173Dc6C3c90C8f7C04C9288BeF5FDbAd06E) {
    +++ description: None
      values.treasureThirdBatchTS:
-        1732907795
      values.treasureValidatorsAdded:
+        ["0x2572835e02b59078711aa0800490e80975e4169d","0x4131719fb0FA1CB3e3A052A4A309ea7575d8c283"]
      values.treasureValidatorsRemoved:
+        []
      fieldMeta.treasureThirdBatchTS:
-        {"severity":"MEDIUM","description":"If non-zero, the third batch has been posted (launch monitor)."}
    }
```

Generated with discovered.json: 0x94a03248b7c968a9228f4c918b302f081aaa268f

# Diff at Tue, 10 Dec 2024 11:08:21 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@9ed5a41ddcad978cfdf826bc7a4827bf4a91c814 block: 21357589
- current block number: 21357589

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21357589 (main branch discovery), not current.

```diff
+   Status: CREATED
    contract GnosisSafe (0x13f07d9BF17615f6a17F272fe1A913168C275A66)
    +++ description: None
```

```diff
+   Status: CREATED
    contract GnosisSafe (0x34Ea62D4b9bBB8AD927eFB6ab31E3Ab3474aC93a)
    +++ description: None
```

```diff
+   Status: CREATED
    contract GnosisSafe (0x35eA56fd9eAd2567F339Eb9564B6940b9DD5653F)
    +++ description: None
```

```diff
+   Status: CREATED
    contract GnosisSafe (0x3888777686F0b0d8c3108fc22ad8DE9E049bE26F)
    +++ description: None
```

```diff
+   Status: CREATED
    contract GnosisSafe (0x69462a81ba94D64c404575f1899a464F123497A2)
    +++ description: None
```

```diff
+   Status: CREATED
    contract GnosisSafe (0x725065b4eB99294BaaE57AdDA9c32e42F453FA8A)
    +++ description: None
```

```diff
+   Status: CREATED
    contract GnosisSafe (0x84BF0Ac41Eeb74373Ddddae8b7055Bf2bD3CE6E0)
    +++ description: None
```

```diff
+   Status: CREATED
    contract GnosisSafe (0x9B39Ea22e838B316Ea7D74e7C4B07d91D51ccA88)
    +++ description: None
```

```diff
+   Status: CREATED
    contract GnosisSafe (0x9B8Be3278B7F0168D82059eb6BAc5991DcdfA803)
    +++ description: None
```

```diff
+   Status: CREATED
    contract GnosisSafe (0xB7aC3A79A23B148c85fba259712c5A1e7ad0ca44)
    +++ description: None
```

```diff
+   Status: CREATED
    contract GnosisSafe (0xc3Abc9f9AA75Be8341E831482cdA0125a7B1A23e)
    +++ description: None
```

```diff
+   Status: CREATED
    contract GnosisSafe (0xFB90Da9DC45378A1B50775Beb03aD10C7E8DC231)
    +++ description: None
```

Generated with discovered.json: 0x84b9b6d9912626f624bbec1ed2469d79f770962f

# Diff at Sun, 08 Dec 2024 11:51:53 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@59fd7a30471906b5a479f280731621e94e22f17c block: 21334370
- current block number: 21357589

## Description

ML MS single member change.

## Watched changes

```diff
    contract Matter Labs Multisig (0x4e4943346848c4867F81dFb37c4cA9C5715A7828) {
    +++ description: Can instantly upgrade all contracts and roles in the zksync Era contracts
      values.$members.1:
-        "0xe79af29d618141Ffef951B240b250d47030D56d7"
+        "0x8A23548a640De1137e58e2D9600e1c5913E3D674"
    }
```

Generated with discovered.json: 0x130741beb8896a212215e004768fdc2a13bfb95d

# Diff at Thu, 05 Dec 2024 06:01:51 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@7dc480bf5499525d0b44afce03521538ecc8ec73 block: 21313606
- current block number: 21334370

## Description

GRVT chain is active (chainId says mainnet). No launch announcement yet.

## Watched changes

```diff
    contract ValidatorTimelock (0x5D8ba173Dc6C3c90C8f7C04C9288BeF5FDbAd06E) {
    +++ description: None
+++ description: If non-zero, the third batch has been posted (launch monitor).
+++ severity: MEDIUM
      values.grvtThirdBatchTS:
-        0
+        1733327159
    }
```

Generated with discovered.json: 0xc3e18d834ba499a857aacbf4ae99de7db3c45493

# Diff at Mon, 02 Dec 2024 08:23:33 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@0cac24376573663e0a362b2f340a124e5238a2bc block: 21242824
- current block number: 21313606

## Description

Treasure.lol is now actively sending batches. No launch announcement yet.

## Watched changes

```diff
    contract ValidatorTimelock (0x5D8ba173Dc6C3c90C8f7C04C9288BeF5FDbAd06E) {
    +++ description: None
+++ description: If non-zero, the third batch has been posted (launch monitor).
+++ severity: MEDIUM
      values.treasureThirdBatchTS:
-        0
+        1732907795
    }
```

Generated with discovered.json: 0xed104435ef55701aeca108a1798bf308db31f8d9

# Diff at Fri, 22 Nov 2024 10:58:41 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@47360b3fe185e6a526c31e0dfe4ad128b9d7db9f block: 21178397
- current block number: 21242824

## Description

New chain deployed: Treasure Chain

🚀: posting batches
✅: officially launched 

Current ZK stack chains (BH.getAllHyperchains array): 
1) ZKsync Era 324 RU 0x32400084C286CF3E17e7B677ea9583e60a000324 ETH 🚀✅
2) CronosZkEvm 388 Validium 0x7b2DA4e77BAE0e0d23c53C3BE6650497d0576CFc zkCRO 🚀✅
3) Sophon 50104 Validium 0x05eDE6aD1f39B7A16C949d5C33a0658c9C7241e3 SOPH 🚀
4) ZeroNetwork 543210 RU 0xdbD849acC6bA61F461CB8A41BBaeE2D673CA02d9 ETH 🚀✅
5) [Abstract](docs.abs.xyz) 2741 RU 0x2EDc71E9991A962c7FE172212d1aA9E50480fBb9 ETH 🚀
6) [GRVT](https://grvt.gitbook.io/grvt/introduction/architecture-overview) 325 Validium 0xe3e310cd8EE0C808794810AB50FE4BcCC5c7D89E GBT (GRVTBaseToken)
7) [Treasure Chain](https://docs.treasure.lol/chain) 61166 Validium 0x5e64D248Eab336AB3Fd0BeC0CFe31D4AAE32E879 EDU

## Watched changes

```diff
    contract BridgeHub (0x303a465B659cBB0ab36eE643eA362c509EEb5213) {
    +++ description: None
+++ description: All new chains created go thorugh the central bridgehub and are thus stored here with their respective STMs.
      values.chainsCreated.6:
+        {"chainId":61166,"stateTransitionManager":"0xc2eE6b6af7d616f6e27ce7F4A451Aedc2b0F5f5C","chainGovernance":"0x97440Bf040f0dfA402cf5D4F1e0f574309Ace871"}
    }
```

```diff
    contract StateTransitionManager (0xc2eE6b6af7d616f6e27ce7F4A451Aedc2b0F5f5C) {
    +++ description: None
      values.getAllHyperchainChainIDs.6:
+        61166
      values.getAllHyperchains.6:
+        "0x5e64D248Eab336AB3Fd0BeC0CFe31D4AAE32E879"
    }
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21178397 (main branch discovery), not current.

```diff
    contract ValidatorTimelock (0x5D8ba173Dc6C3c90C8f7C04C9288BeF5FDbAd06E) {
    +++ description: None
+++ description: If non-zero, the third batch has been posted (launch monitor).
+++ severity: MEDIUM
      values.treasureThirdBatchTS:
+        0
      fieldMeta.treasureThirdBatchTS:
+        {"severity":"MEDIUM","description":"If non-zero, the third batch has been posted (launch monitor)."}
    }
```

Generated with discovered.json: 0x5cb3ef8489e38292ed93e28a0a458eea902c4bb1

# Diff at Wed, 13 Nov 2024 11:13:12 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@52436269c628b928351a43e9d5c374c442a5c66d block: 21077285
- current block number: 21178397

## Description

New ZK stack chain deployed (native token is called GBT - GRVTBaseToken)

Current ZK stack chains (BH.getAllHyperchains array):
1) ZKsync Era 324 RU 0x32400084C286CF3E17e7B677ea9583e60a000324 ETH
2) CronosZkEvm 388 Validium 0x7b2DA4e77BAE0e0d23c53C3BE6650497d0576CFc zkCRO
3) Sophon 50104 Validium 0x05eDE6aD1f39B7A16C949d5C33a0658c9C7241e3 SOPH
4) ZeroNetwork 543210 RU 0xdbD849acC6bA61F461CB8A41BBaeE2D673CA02d9 ETH
5) [Abstract](docs.abs.xyz) 2741 RU 0x2EDc71E9991A962c7FE172212d1aA9E50480fBb9 ETH
6) [GRVT](https://grvt.gitbook.io/grvt/introduction/architecture-overview) 325 Validium 0xe3e310cd8EE0C808794810AB50FE4BcCC5c7D89E GBT (GRVTBaseToken)

## Watched changes

```diff
    contract BridgeHub (0x303a465B659cBB0ab36eE643eA362c509EEb5213) {
    +++ description: None
+++ description: All new chains created go thorugh the central bridgehub and are thus stored here with their respective STMs.
      values.chainsCreated.5:
+        {"chainId":325,"stateTransitionManager":"0xc2eE6b6af7d616f6e27ce7F4A451Aedc2b0F5f5C","chainGovernance":"0x6308ee1Ebdb8D5E60bB88D3EA3b56CE326193e7D"}
    }
```

```diff
    contract ValidatorTimelock (0x5D8ba173Dc6C3c90C8f7C04C9288BeF5FDbAd06E) {
    +++ description: None
+++ description: If non-zero, the third batch has been posted (launch monitor).
+++ severity: MEDIUM
      values.abstractThirdBatchTS:
-        0
+        1730348459
    }
```

```diff
    contract StateTransitionManager (0xc2eE6b6af7d616f6e27ce7F4A451Aedc2b0F5f5C) {
    +++ description: None
      values.getAllHyperchainChainIDs.5:
+        325
      values.getAllHyperchains.5:
+        "0xe3e310cd8EE0C808794810AB50FE4BcCC5c7D89E"
    }
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21077285 (main branch discovery), not current.

```diff
-   Status: DELETED
    contract Safe (0x2e5BE1479cF661eeD9F526b7926eA87F6A5dD6a9)
    +++ description: None
```

```diff
    contract ValidatorTimelock (0x5D8ba173Dc6C3c90C8f7C04C9288BeF5FDbAd06E) {
    +++ description: None
      values.sophonTenthBatchTS:
-        1730241371
      values.zeronetworkTenthBatchTS:
-        1729719755
+++ description: If non-zero, the third batch has been posted (launch monitor).
+++ severity: MEDIUM
      values.abstractThirdBatchTS:
+        0
+++ description: If non-zero, the third batch has been posted (launch monitor).
+++ severity: MEDIUM
      values.grvtThirdBatchTS:
+        0
      fieldMeta.zeronetworkTenthBatchTS:
-        {"severity":"MEDIUM","description":"If non-zero, the first batch has been posted."}
      fieldMeta.sophonTenthBatchTS:
-        {"severity":"MEDIUM","description":"If non-zero, the first batch has been posted."}
      fieldMeta.abstractThirdBatchTS:
+        {"severity":"MEDIUM","description":"If non-zero, the third batch has been posted (launch monitor)."}
      fieldMeta.grvtThirdBatchTS:
+        {"severity":"MEDIUM","description":"If non-zero, the third batch has been posted (launch monitor)."}
    }
```

```diff
-   Status: DELETED
    contract Safe (0x7F3EaB9ccf1d8B9705F7ede895d3b4aC1b631063)
    +++ description: None
```

```diff
-   Status: DELETED
    contract ChainAdmin (0xA1f75f491f630037C4Ccaa2bFA22363CEC05a661)
    +++ description: None
```

```diff
-   Status: DELETED
    contract ChainAdmin (0xCA8faaF5BA885fEC8C2c8CD49bADAa7589D173b3)
    +++ description: None
```

```diff
-   Status: DELETED
    contract ChainAdmin (0xE1eeA4D6443b19D373Fe99De838b930Ef0ac2Ad3)
    +++ description: None
```

```diff
-   Status: DELETED
    contract Safe (0xe4644b6d106A18062344c0A853666bc0B8f052d1)
    +++ description: None
```

Generated with discovered.json: 0xde45bfbb66b4c0ba71900ab28b3dcd0ed29ac97c

# Diff at Wed, 30 Oct 2024 08:32:41 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@133f6bdd684278299c8df162b697d52fa91f3aef block: 21064368
- current block number: 21077285

## Description

Sophon tenth batch committed, project PR is ready, waiting for them.

## Watched changes

```diff
    contract ValidatorTimelock (0x5D8ba173Dc6C3c90C8f7C04C9288BeF5FDbAd06E) {
    +++ description: None
+++ description: If non-zero, the first batch has been posted.
+++ severity: MEDIUM
      values.sophonTenthBatchTS:
-        0
+        1730241371
    }
```

Generated with discovered.json: 0x49be4a26135f66dff4b13920e7b71330ccc21716

# Diff at Mon, 28 Oct 2024 13:16:57 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@00bd1d18460d612b1f06ce2339854c105cd41bd5 block: 21027403
- current block number: 21064368

## Description

New chainID 2741 deployed.

## Watched changes

```diff
    contract BridgeHub (0x303a465B659cBB0ab36eE643eA362c509EEb5213) {
    +++ description: None
+++ description: All new chains created go thorugh the central bridgehub and are thus stored here with their respective STMs.
      values.chainsCreated.4:
+        {"chainId":2741,"stateTransitionManager":"0xc2eE6b6af7d616f6e27ce7F4A451Aedc2b0F5f5C","chainGovernance":"0xA1f75f491f630037C4Ccaa2bFA22363CEC05a661"}
    }
```

```diff
    contract ValidatorTimelock (0x5D8ba173Dc6C3c90C8f7C04C9288BeF5FDbAd06E) {
    +++ description: None
+++ description: If non-zero, the first batch has been posted.
+++ severity: MEDIUM
      values.zeronetworkTenthBatchTS:
-        0
+        1729719755
    }
```

```diff
    contract StateTransitionManager (0xc2eE6b6af7d616f6e27ce7F4A451Aedc2b0F5f5C) {
    +++ description: None
      values.getAllHyperchainChainIDs.4:
+        2741
      values.getAllHyperchains.4:
+        "0x2EDc71E9991A962c7FE172212d1aA9E50480fBb9"
    }
```

```diff
+   Status: CREATED
    contract Safe (0x7F3EaB9ccf1d8B9705F7ede895d3b4aC1b631063)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ChainAdmin (0xA1f75f491f630037C4Ccaa2bFA22363CEC05a661)
    +++ description: None
```

## Source code changes

```diff
...-0xA1f75f491f630037C4Ccaa2bFA22363CEC05a661.sol |  222 ++++
 .../Safe.sol                                       | 1088 ++++++++++++++++++++
 .../SafeProxy.p.sol                                |   37 +
 3 files changed, 1347 insertions(+)
```

Generated with discovered.json: 0x579cb2d4a94299bd6e5baab4aadab66f01057f9e

# Diff at Wed, 23 Oct 2024 09:31:05 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@2734bfe28641dfdb3277a5800faf0a057c08a58f block: 21013457
- current block number: 21027403

## Description

ChainAdmin change for Sophon and Zero network. Both produced first batches already, not officially launched yet though.

## Watched changes

```diff
-   Status: DELETED
    contract Safe (0x5e6C5551C1b0626e9061fD4Daca6DA866Fd405aC)
    +++ description: None
```

```diff
    contract ChainAdmin (0xCA8faaF5BA885fEC8C2c8CD49bADAa7589D173b3) {
    +++ description: None
      values.owner:
-        "0x5e6C5551C1b0626e9061fD4Daca6DA866Fd405aC"
+        "0x2e5BE1479cF661eeD9F526b7926eA87F6A5dD6a9"
      values.pendingOwner:
-        "0x2e5BE1479cF661eeD9F526b7926eA87F6A5dD6a9"
+        "0x0000000000000000000000000000000000000000"
    }
```

```diff
    contract ChainAdmin (0xE1eeA4D6443b19D373Fe99De838b930Ef0ac2Ad3) {
    +++ description: None
      values.owner:
-        "0x5e6C5551C1b0626e9061fD4Daca6DA866Fd405aC"
+        "0xe4644b6d106A18062344c0A853666bc0B8f052d1"
      values.pendingOwner:
-        "0xe4644b6d106A18062344c0A853666bc0B8f052d1"
+        "0x0000000000000000000000000000000000000000"
    }
```

## Source code changes

```diff
.../Safe.sol => /dev/null                          | 1088 --------------------
 .../SafeProxy.p.sol => /dev/null                   |   37 -
 2 files changed, 1125 deletions(-)
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21013457 (main branch discovery), not current.

```diff
    contract Safe (0x2e5BE1479cF661eeD9F526b7926eA87F6A5dD6a9) {
    +++ description: None
      values.getOwners:
-        ["0xA167ca2984F7e08EFd4DDf9c5a4A21D66c07813E","0xc858a504d6c267fe2d462D240b68A7D939B1fEC9","0xF322467cec88d3CDFa9376B19bD5AD40da665277","0x3Bc72A56F9036B94ad14BF082bF93731e0545255","0x3Ec90fA056A39e7281a5b4c8c044B86667D770e1"]
      values.getThreshold:
-        3
      template:
+        "GnosisSafe"
    }
```

```diff
    contract ValidatorTimelock (0x5D8ba173Dc6C3c90C8f7C04C9288BeF5FDbAd06E) {
    +++ description: None
      values.sophonFirstBatchTS:
-        0
      values.zeronetworkFirstBatchTS:
-        0
+++ description: If non-zero, the first batch has been posted.
+++ severity: MEDIUM
      values.sophonTenthBatchTS:
+        0
+++ description: If non-zero, the first batch has been posted.
+++ severity: MEDIUM
      values.zeronetworkTenthBatchTS:
+        0
      fieldMeta.zeronetworkFirstBatchTS:
-        {"severity":"MEDIUM","description":"If non-zero, the first batch has been posted."}
      fieldMeta.sophonFirstBatchTS:
-        {"severity":"MEDIUM","description":"If non-zero, the first batch has been posted."}
      fieldMeta.zeronetworkTenthBatchTS:
+        {"severity":"MEDIUM","description":"If non-zero, the first batch has been posted."}
      fieldMeta.sophonTenthBatchTS:
+        {"severity":"MEDIUM","description":"If non-zero, the first batch has been posted."}
    }
```

```diff
    contract Safe (0x5e6C5551C1b0626e9061fD4Daca6DA866Fd405aC) {
    +++ description: None
      values.getOwners:
-        ["0xf2BFa7c00aDDF7765B40e83Fc4207b16EBD6db89","0xD767A6058c34E88Dc4Ce49114C362C8FAc265A76","0x2AF852529DDF5D3cF3130423b56DF8Db50A11b6B","0x090268B1b2170eB5964402321aDa988D7c75a90e"]
      values.getThreshold:
-        2
      template:
+        "GnosisSafe"
    }
```

```diff
    contract Safe (0xe4644b6d106A18062344c0A853666bc0B8f052d1) {
    +++ description: None
      values.getOwners:
-        ["0x3b6036d410cA018661324766680674921a8b2d89","0x20719Abd2E63518e68D30a295388cAd6B542dCEf","0x14574dfC6B7aF658c5033BA95673864947956521","0x90E10C37d8d9e854e7775B0069728642A1F88610","0x7f413262Cb811B034d077d9184b5Efda6943f2c3","0xd89b0f620E0C72BD82e0447dE07FB0A0Abe01F69"]
      values.getThreshold:
-        3
      template:
+        "GnosisSafe"
    }
```

Generated with discovered.json: 0x0e6c70c0ef9c01d3fdef20ceb46ed231ce43f024

# Diff at Mon, 21 Oct 2024 12:48:28 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@e660599f23a07618fe949a07be1f516ce44f1914 block: 21013457
- current block number: 21013457

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21013457 (main branch discovery), not current.

```diff
    contract Matter Labs Multisig (0x4e4943346848c4867F81dFb37c4cA9C5715A7828) {
    +++ description: Can instantly upgrade all contracts and roles in the zksync Era contracts
      descriptions:
-        ["Can instantly upgrade all contracts and roles in the zksync Era contracts"]
      description:
+        "Can instantly upgrade all contracts and roles in the zksync Era contracts"
    }
```

Generated with discovered.json: 0x4c413eb9e9afd24611089408ad364cabe7a1703c

# Diff at Mon, 21 Oct 2024 11:30:46 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@89bb82544503b2bb7544ceb7dedf56a03e0c5339 block: 21013457
- current block number: 21013457

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21013457 (main branch discovery), not current.

```diff
    contract BridgeHub (0x303a465B659cBB0ab36eE643eA362c509EEb5213) {
    +++ description: None
      values.$pastUpgrades.1.2:
+        ["0x509dA1BE24432F8804C4A9FF4a3c3f80284CDd13"]
      values.$pastUpgrades.1.1:
-        ["0x509dA1BE24432F8804C4A9FF4a3c3f80284CDd13"]
+        "0x21aec24a9df97ce4886d699314be627b0818da4d1987349421fb3df102c43f2b"
      values.$pastUpgrades.0.2:
+        ["0x12f893689f9603991a8c22C249FFd0509Be95661"]
      values.$pastUpgrades.0.1:
-        ["0x12f893689f9603991a8c22C249FFd0509Be95661"]
+        "0xdbb03a14ea223de3db4ac0916e78123bd0a1dde68e98952326d8382d29ac4d61"
    }
```

```diff
    contract StateTransitionManager (0xc2eE6b6af7d616f6e27ce7F4A451Aedc2b0F5f5C) {
    +++ description: None
      values.$pastUpgrades.1.2:
+        ["0xed1Dc7F0Be2B19cb02a2476150C8ea24A37c5274"]
      values.$pastUpgrades.1.1:
-        ["0xed1Dc7F0Be2B19cb02a2476150C8ea24A37c5274"]
+        "0xc1e73b06359759201b76ab7654e0bd49011f33c0230dfc24423985fbf36ea817"
      values.$pastUpgrades.0.2:
+        ["0x8279B7E48fA074f966385d87AEf29Bd031e54fD5"]
      values.$pastUpgrades.0.1:
-        ["0x8279B7E48fA074f966385d87AEf29Bd031e54fD5"]
+        "0x514bbf46d227eee8567825bf5c8ee1855aa8a1916f7fee7b191e2e3d5ecba849"
    }
```

```diff
    contract L1SharedBridge (0xD7f9f54194C633F36CCD5F3da84ad4a1c38cB2cB) {
    +++ description: None
      values.$pastUpgrades.1.2:
+        ["0xb56A8225A745756DD215faf22E4796f373561AcD"]
      values.$pastUpgrades.1.1:
-        ["0xb56A8225A745756DD215faf22E4796f373561AcD"]
+        "0xaec33529b74f8f9d56d7aa568c6358be299228a85e49ea85cb106eca5af7367c"
      values.$pastUpgrades.0.2:
+        ["0xCba1aF8f0bB223b2544F8eB8f69d1c7960f788dB"]
      values.$pastUpgrades.0.1:
-        ["0xCba1aF8f0bB223b2544F8eB8f69d1c7960f788dB"]
+        "0xce3d72f23297a281cb58502dcc6a6c029489316a2faf9c4ef83141b1b254017c"
    }
```

Generated with discovered.json: 0x03f189e9a43739247b980d79767b1d27ad6069b3

# Diff at Mon, 21 Oct 2024 10:48:51 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@8895d33866f5665c4c710f4ddaa32bfa63cc3c78 block: 20998125
- current block number: 21013457

## Description

Add metadata and triggers for the two new ZK stack chains launching soon.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20998125 (main branch discovery), not current.

```diff
    contract BridgeHub (0x303a465B659cBB0ab36eE643eA362c509EEb5213) {
    +++ description: None
      values.SophonDiamond:
+        "0x05eDE6aD1f39B7A16C949d5C33a0658c9C7241e3"
      values.SophonSTM:
+        "0xc2eE6b6af7d616f6e27ce7F4A451Aedc2b0F5f5C"
      values.ZeroNetworkDiamond:
+        "0xdbD849acC6bA61F461CB8A41BBaeE2D673CA02d9"
      values.ZeroNetworkSTM:
+        "0xc2eE6b6af7d616f6e27ce7F4A451Aedc2b0F5f5C"
    }
```

```diff
    contract ValidatorTimelock (0x5D8ba173Dc6C3c90C8f7C04C9288BeF5FDbAd06E) {
    +++ description: None
+++ description: If non-zero, the first batch has been posted.
+++ severity: MEDIUM
      values.sophonFirstBatchTS:
+        0
      values.sophonValidatorsAdded:
+        ["0x4cc87B0A504047967CeD9A955431B3229237e7de","0xf3b07F6744e06cd5074b7D15ed2c33760837CE1f"]
      values.sophonValidatorsRemoved:
+        []
+++ description: If non-zero, the first batch has been posted.
+++ severity: MEDIUM
      values.zeronetworkFirstBatchTS:
+        0
      values.zeronetworkValidatorsAdded:
+        ["0x0F9B807d5B0cE12450059B425Dc35C727D65CB2F","0x479B7c95b9509E1A834C994fc94e3581aA8A73B9"]
      values.zeronetworkValidatorsRemoved:
+        []
      fieldMeta:
+        {"zeronetworkFirstBatchTS":{"severity":"MEDIUM","description":"If non-zero, the first batch has been posted."},"sophonFirstBatchTS":{"severity":"MEDIUM","description":"If non-zero, the first batch has been posted."}}
    }
```

Generated with discovered.json: 0x32eed5a1b6eaf7441ca6eafe6f85ee2e932531ab

# Diff at Sat, 19 Oct 2024 07:29:48 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@493c96785a6a32c6417182bb9548d3a990297dbe block: 20777100
- current block number: 20998125

## Description

Two new ZK stack Validiums are added that share the zksync/cronos implementation, verifier and STM.
* ['Sophon', Validium](https://sophon.xyz/) with chainID 50104, diamond 0x05ede6ad1f39b7a16c949d5c33a0658c9c7241e3, baseToken SOPH
* [Zerion(?), ZK Rollup](https://docs.zero.network/build-on-zero/network-information) with chainID 543210, diamond 0xdbd849acc6ba61f461cb8a41bbaee2d673ca02d9, baseToken ETH

Will add them underreview/full on monday ;)

## Watched changes

```diff
    contract BridgeHub (0x303a465B659cBB0ab36eE643eA362c509EEb5213) {
    +++ description: None
+++ description: All new chains created go thorugh the central bridgehub and are thus stored here with their respective STMs.
      values.chainsCreated.3:
+        {"chainId":543210,"stateTransitionManager":"0xc2eE6b6af7d616f6e27ce7F4A451Aedc2b0F5f5C","chainGovernance":"0xCA8faaF5BA885fEC8C2c8CD49bADAa7589D173b3"}
+++ description: All new chains created go thorugh the central bridgehub and are thus stored here with their respective STMs.
      values.chainsCreated.2:
+        {"chainId":50104,"stateTransitionManager":"0xc2eE6b6af7d616f6e27ce7F4A451Aedc2b0F5f5C","chainGovernance":"0xE1eeA4D6443b19D373Fe99De838b930Ef0ac2Ad3"}
    }
```

```diff
    contract StateTransitionManager (0xc2eE6b6af7d616f6e27ce7F4A451Aedc2b0F5f5C) {
    +++ description: None
      values.getAllHyperchainChainIDs.3:
+        543210
      values.getAllHyperchainChainIDs.2:
+        50104
      values.getAllHyperchains.3:
+        "0xdbD849acC6bA61F461CB8A41BBaeE2D673CA02d9"
      values.getAllHyperchains.2:
+        "0x05eDE6aD1f39B7A16C949d5C33a0658c9C7241e3"
    }
```

```diff
+   Status: CREATED
    contract Safe (0x2e5BE1479cF661eeD9F526b7926eA87F6A5dD6a9)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Safe (0x5e6C5551C1b0626e9061fD4Daca6DA866Fd405aC)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ChainAdmin (0xCA8faaF5BA885fEC8C2c8CD49bADAa7589D173b3)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ChainAdmin (0xE1eeA4D6443b19D373Fe99De838b930Ef0ac2Ad3)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Safe (0xe4644b6d106A18062344c0A853666bc0B8f052d1)
    +++ description: None
```

## Source code changes

```diff
...-0xCA8faaF5BA885fEC8C2c8CD49bADAa7589D173b3.sol |  222 ++++
 ...-0xE1eeA4D6443b19D373Fe99De838b930Ef0ac2Ad3.sol |  222 ++++
 .../Safe.sol                                       | 1088 ++++++++++++++++++++
 .../SafeProxy.p.sol                                |   37 +
 .../Safe.sol                                       | 1088 ++++++++++++++++++++
 .../SafeProxy.p.sol                                |   37 +
 .../Safe.sol                                       | 1088 ++++++++++++++++++++
 .../SafeProxy.p.sol                                |   37 +
 8 files changed, 3819 insertions(+)
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20777100 (main branch discovery), not current.

```diff
    contract EraChainAdminProxy (0x2cf3bD6a9056b39999F3883955E183F655345063) {
    +++ description: None
      template:
+        "shared-zk-stack/ChainAdmin"
    }
```

Generated with discovered.json: 0x4919b628b23d822b85c121a07aa57e64591cfdb8

# Diff at Mon, 14 Oct 2024 10:55:49 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@1afc77ff111ceb0970e7d09efcc7b2f376b0c281 block: 20777100
- current block number: 20777100

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20777100 (main branch discovery), not current.

```diff
    contract GnosisSafe (0x015318c16AE443a20DE0A776dB06a59F0D279057) {
    +++ description: None
      sourceHashes:
+        ["0x81a7349eebb98ac33b0bc6842e3cb258034a8f2a4ba004570bb8e2e25947f9ff","0xd42bbf9f7dcd3720a7fc6bdc6edfdfae8800a37d6dd4decfa0ef6ca4a2e88940"]
    }
```

```diff
    contract GnosisSafe (0x178D8Eb1A1fb81B5102808A83318Bb04C6a9fC6D) {
    +++ description: None
      sourceHashes:
+        ["0x81a7349eebb98ac33b0bc6842e3cb258034a8f2a4ba004570bb8e2e25947f9ff","0xd42bbf9f7dcd3720a7fc6bdc6edfdfae8800a37d6dd4decfa0ef6ca4a2e88940"]
    }
```

```diff
    contract GnosisSafe (0x2A90830083C5Ca1f18d7AA7fCDC2998f93475384) {
    +++ description: None
      sourceHashes:
+        ["0x81a7349eebb98ac33b0bc6842e3cb258034a8f2a4ba004570bb8e2e25947f9ff","0xd42bbf9f7dcd3720a7fc6bdc6edfdfae8800a37d6dd4decfa0ef6ca4a2e88940"]
    }
```

```diff
    contract EraChainAdminProxy (0x2cf3bD6a9056b39999F3883955E183F655345063) {
    +++ description: None
      sourceHashes:
+        ["0x3423f941c413d4f07703ba62723b05600f2a33f8725e8d89a53194efb05f4086"]
    }
```

```diff
    contract BridgeHub (0x303a465B659cBB0ab36eE643eA362c509EEb5213) {
    +++ description: None
      sourceHashes:
+        ["0x993403059c5620e6c91110514f9f4a2f2331c55dab587699c67c19edddab92ad","0x0d42e482e85877d75871eacd767228a9e735bb3e0478cb2b80235d6f428ba055"]
    }
```

```diff
    contract GenesisUpgrade (0x3dDD7ED2AeC0758310A4C6596522FCAeD108DdA2) {
    +++ description: None
      sourceHashes:
+        ["0xc9967ed702de956442f294c09e62b4c0a2c4c86707e081af1c4ae4b0119ac3fb"]
    }
```

```diff
    contract Matter Labs Multisig (0x4e4943346848c4867F81dFb37c4cA9C5715A7828) {
    +++ description: Can instantly upgrade all contracts and roles in the zksync Era contracts
      sourceHashes:
+        ["0x81a7349eebb98ac33b0bc6842e3cb258034a8f2a4ba004570bb8e2e25947f9ff","0xd42bbf9f7dcd3720a7fc6bdc6edfdfae8800a37d6dd4decfa0ef6ca4a2e88940"]
    }
```

```diff
    contract GnosisSafe (0x538612F6eba6ff80FBD95D60dCDee16b8FfF2c0f) {
    +++ description: None
      sourceHashes:
+        ["0x81a7349eebb98ac33b0bc6842e3cb258034a8f2a4ba004570bb8e2e25947f9ff","0xd42bbf9f7dcd3720a7fc6bdc6edfdfae8800a37d6dd4decfa0ef6ca4a2e88940"]
    }
```

```diff
    contract GnosisSafe (0x55c671BcE13120387Ded710A1d1b80C0e3d8E857) {
    +++ description: None
      sourceHashes:
+        ["0x81a7349eebb98ac33b0bc6842e3cb258034a8f2a4ba004570bb8e2e25947f9ff","0xd42bbf9f7dcd3720a7fc6bdc6edfdfae8800a37d6dd4decfa0ef6ca4a2e88940"]
    }
```

```diff
    contract GnosisSafe (0x590926dBCDfD19627c3BbD2A6Eb96DeC7a3AbF69) {
    +++ description: None
      sourceHashes:
+        ["0x81a7349eebb98ac33b0bc6842e3cb258034a8f2a4ba004570bb8e2e25947f9ff","0xd42bbf9f7dcd3720a7fc6bdc6edfdfae8800a37d6dd4decfa0ef6ca4a2e88940"]
    }
```

```diff
    contract ValidatorTimelock (0x5D8ba173Dc6C3c90C8f7C04C9288BeF5FDbAd06E) {
    +++ description: None
      sourceHashes:
+        ["0x5c435b3eaf489b61e623af2356a751079cfa87c079c12e5d93108d007d3b4c97"]
    }
```

```diff
    contract GnosisSafe (0x6D26874130A174839b9cd8CB87Ed4E09D0c1a5f0) {
    +++ description: None
      sourceHashes:
+        ["0x81a7349eebb98ac33b0bc6842e3cb258034a8f2a4ba004570bb8e2e25947f9ff","0xd42bbf9f7dcd3720a7fc6bdc6edfdfae8800a37d6dd4decfa0ef6ca4a2e88940"]
    }
```

```diff
    contract ProtocolUpgradeHandler (0x8f7a9912416e8AdC4D9c21FAe1415D3318A11897) {
    +++ description: None
      sourceHashes:
+        ["0xe59fe71de493915d874d4d22b4637434d86b42759b4d5fd2dddf4f25cfdd1544"]
    }
```

```diff
    contract ZkFoundationMultisig (0xbC1653bd3829dfEc575AfC3816D4899cd103B51c) {
    +++ description: None
      sourceHashes:
+        ["0x81a7349eebb98ac33b0bc6842e3cb258034a8f2a4ba004570bb8e2e25947f9ff","0xd42bbf9f7dcd3720a7fc6bdc6edfdfae8800a37d6dd4decfa0ef6ca4a2e88940"]
    }
```

```diff
    contract SecurityCouncil (0xBDFfCC71FE84020238F2990a6D2954e87355De0D) {
    +++ description: None
      sourceHashes:
+        ["0x153a01097ad00f13ce2cb9f0178a19858cb44dd75a40132d64d7fb1450cc0bf5"]
    }
```

```diff
    contract ProxyAdmin (0xC2a36181fB524a6bEfE639aFEd37A67e77d62cf1) {
    +++ description: None
      sourceHashes:
+        ["0x04a556db1ea1a651e1174247090ad4c7105b455feab1a9672d5c4cd113b9ff0b"]
    }
```

```diff
    contract StateTransitionManager (0xc2eE6b6af7d616f6e27ce7F4A451Aedc2b0F5f5C) {
    +++ description: None
      sourceHashes:
+        ["0x993403059c5620e6c91110514f9f4a2f2331c55dab587699c67c19edddab92ad","0x96877e17c5bb84aa94de97c0a9764405e673c26bbf2c649349984d825b326940"]
    }
```

```diff
    contract GnosisSafe (0xCe7a3dFcc35602155809920Ff65e093aa726f6cf) {
    +++ description: None
      sourceHashes:
+        ["0x81a7349eebb98ac33b0bc6842e3cb258034a8f2a4ba004570bb8e2e25947f9ff","0xd42bbf9f7dcd3720a7fc6bdc6edfdfae8800a37d6dd4decfa0ef6ca4a2e88940"]
    }
```

```diff
    contract Guardians (0xD677e09324F8Bb3cC64F009973693f751c33A888) {
    +++ description: None
      sourceHashes:
+        ["0xe702d26fd65786b2e88bd0998f300af1fa11cd1a733a78e5da7ec0699a60e5ce"]
    }
```

```diff
    contract L1SharedBridge (0xD7f9f54194C633F36CCD5F3da84ad4a1c38cB2cB) {
    +++ description: None
      sourceHashes:
+        ["0x993403059c5620e6c91110514f9f4a2f2331c55dab587699c67c19edddab92ad","0xee3958605e4357a1803d3eb2c6d0d455fdbcc9c550a55b801834030d2a39cef8"]
    }
```

```diff
    contract EmergencyUpgradeBoard (0xdEFd1eDEE3E8c5965216bd59C866f7f5307C9b29) {
    +++ description: None
      sourceHashes:
+        ["0x15445918f67256c3edb446079c491b396c922a20fb0dc931fa7aaa6095f19aa6"]
    }
```

Generated with discovered.json: 0xd97b2cb4e179850b9ec5569ebc16941e345ce95c

# Diff at Tue, 01 Oct 2024 10:55:13 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@bd754dc73c66120164006054f8d25c5fae9cd910 block: 20777100
- current block number: 20777100

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20777100 (main branch discovery), not current.

```diff
    contract BridgeHub (0x303a465B659cBB0ab36eE643eA362c509EEb5213) {
    +++ description: None
      values.$pastUpgrades:
+        [["2024-06-04T17:03:59.000Z",["0x12f893689f9603991a8c22C249FFd0509Be95661"]],["2024-09-09T13:09:23.000Z",["0x509dA1BE24432F8804C4A9FF4a3c3f80284CDd13"]]]
    }
```

```diff
    contract StateTransitionManager (0xc2eE6b6af7d616f6e27ce7F4A451Aedc2b0F5f5C) {
    +++ description: None
      values.$pastUpgrades:
+        [["2024-06-04T17:04:23.000Z",["0x8279B7E48fA074f966385d87AEf29Bd031e54fD5"]],["2024-08-06T08:56:59.000Z",["0xed1Dc7F0Be2B19cb02a2476150C8ea24A37c5274"]]]
    }
```

```diff
    contract L1SharedBridge (0xD7f9f54194C633F36CCD5F3da84ad4a1c38cB2cB) {
    +++ description: None
      values.$pastUpgrades:
+        [["2024-06-04T17:17:59.000Z",["0xCba1aF8f0bB223b2544F8eB8f69d1c7960f788dB"]],["2024-08-26T07:51:11.000Z",["0xb56A8225A745756DD215faf22E4796f373561AcD"]]]
    }
```

Generated with discovered.json: 0xc9681e2069081f5380a59667639df35872f0358c

# Diff at Wed, 18 Sep 2024 11:12:36 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@14dc1d5395aaa4aca4e79a08fd6132e42e3cf1a4 block: 20741455
- current block number: 20777100

## Description

Renamed for clarity. (has both ChainAdmin and Elastic Chain Operator roles)

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20741455 (main branch discovery), not current.

```diff
    contract EraChainAdminProxy (0x2cf3bD6a9056b39999F3883955E183F655345063) {
    +++ description: None
      name:
-        "ChainAdmin"
+        "EraChainAdminProxy"
    }
```

Generated with discovered.json: 0x87075ab461d044a431c2143eca3e60ab362bc7ad

# Diff at Fri, 13 Sep 2024 11:40:40 GMT:

- author: sekuba (<sekuba@users.noreply.github.com>)
- comparing to: main@f3f080827a9c9144630c7d8b5f28745b2029ead2 block: 20725957
- current block number: 20741455

## Description

Ownership of the four shared ZK stack contracts and their ProxyAdmin has been fully transferred to the ProtocolUpgradeHandler.

## Watched changes

```diff
-   Status: DELETED
    contract Governance (0x0b622A2061EaccAE1c664eBC3E868b8438e03F61)
    +++ description: None
```

```diff
    contract BridgeHub (0x303a465B659cBB0ab36eE643eA362c509EEb5213) {
    +++ description: None
      values.owner:
-        "0x0b622A2061EaccAE1c664eBC3E868b8438e03F61"
+        "0x8f7a9912416e8AdC4D9c21FAe1415D3318A11897"
      values.pendingOwner:
-        "0x8f7a9912416e8AdC4D9c21FAe1415D3318A11897"
+        "0x0000000000000000000000000000000000000000"
    }
```

```diff
    contract ValidatorTimelock (0x5D8ba173Dc6C3c90C8f7C04C9288BeF5FDbAd06E) {
    +++ description: None
      values.owner:
-        "0x0b622A2061EaccAE1c664eBC3E868b8438e03F61"
+        "0x8f7a9912416e8AdC4D9c21FAe1415D3318A11897"
      values.pendingOwner:
-        "0x8f7a9912416e8AdC4D9c21FAe1415D3318A11897"
+        "0x0000000000000000000000000000000000000000"
    }
```

```diff
    contract ProxyAdmin (0xC2a36181fB524a6bEfE639aFEd37A67e77d62cf1) {
    +++ description: None
      values.owner:
-        "0x0b622A2061EaccAE1c664eBC3E868b8438e03F61"
+        "0x8f7a9912416e8AdC4D9c21FAe1415D3318A11897"
    }
```

```diff
    contract StateTransitionManager (0xc2eE6b6af7d616f6e27ce7F4A451Aedc2b0F5f5C) {
    +++ description: None
      values.owner:
-        "0x0b622A2061EaccAE1c664eBC3E868b8438e03F61"
+        "0x8f7a9912416e8AdC4D9c21FAe1415D3318A11897"
      values.pendingOwner:
-        "0x8f7a9912416e8AdC4D9c21FAe1415D3318A11897"
+        "0x0000000000000000000000000000000000000000"
    }
```

```diff
    contract L1SharedBridge (0xD7f9f54194C633F36CCD5F3da84ad4a1c38cB2cB) {
    +++ description: None
      values.owner:
-        "0x0b622A2061EaccAE1c664eBC3E868b8438e03F61"
+        "0x8f7a9912416e8AdC4D9c21FAe1415D3318A11897"
      values.pendingOwner:
-        "0x8f7a9912416e8AdC4D9c21FAe1415D3318A11897"
+        "0x0000000000000000000000000000000000000000"
    }
```

## Source code changes

```diff
.../.flat@20725957/Governance.sol => /dev/null     | 440 ---------------------
 1 file changed, 440 deletions(-)
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20725957 (main branch discovery), not current.

```diff
-   Status: DELETED
    contract GnosisSafe (0x13f07d9BF17615f6a17F272fe1A913168C275A66)
    +++ description: None
```

```diff
-   Status: DELETED
    contract GnosisSafe (0x34Ea62D4b9bBB8AD927eFB6ab31E3Ab3474aC93a)
    +++ description: None
```

```diff
-   Status: DELETED
    contract GnosisSafe (0x35eA56fd9eAd2567F339Eb9564B6940b9DD5653F)
    +++ description: None
```

```diff
-   Status: DELETED
    contract GnosisSafe (0x3888777686F0b0d8c3108fc22ad8DE9E049bE26F)
    +++ description: None
```

```diff
-   Status: DELETED
    contract GnosisSafe (0x69462a81ba94D64c404575f1899a464F123497A2)
    +++ description: None
```

```diff
-   Status: DELETED
    contract GnosisSafe (0x725065b4eB99294BaaE57AdDA9c32e42F453FA8A)
    +++ description: None
```

```diff
-   Status: DELETED
    contract GnosisSafe (0x84BF0Ac41Eeb74373Ddddae8b7055Bf2bD3CE6E0)
    +++ description: None
```

```diff
    contract ProtocolUpgradeHandler (0x8f7a9912416e8AdC4D9c21FAe1415D3318A11897) {
    +++ description: None
      values.EXTENDED_LEGAL_VETO_PERIOD:
+        604800
      values.HARD_FREEZE_PERIOD:
+        604800
      values.SOFT_FREEZE_PERIOD:
+        43200
      values.STANDARD_LEGAL_VETO_PERIOD:
+        259200
      values.UPGRADE_DELAY_PERIOD:
+        86400
      values.UPGRADE_WAIT_OR_EXPIRE_PERIOD:
+        2592000
      fieldMeta:
+        {"protocolFrozenUntil":{"severity":"HIGH","description":"Timestamp until which ALL Hyperchains connected to the main STM are frozen. (Mailbox and Executor facets blocked)"}}
    }
```

```diff
-   Status: DELETED
    contract GnosisSafe (0x9B39Ea22e838B316Ea7D74e7C4B07d91D51ccA88)
    +++ description: None
```

```diff
-   Status: DELETED
    contract GnosisSafe (0x9B8Be3278B7F0168D82059eb6BAc5991DcdfA803)
    +++ description: None
```

```diff
-   Status: DELETED
    contract GnosisSafe (0xB7aC3A79A23B148c85fba259712c5A1e7ad0ca44)
    +++ description: None
```

```diff
    contract ZkFoundationMultisig (0xbC1653bd3829dfEc575AfC3816D4899cd103B51c) {
    +++ description: None
      name:
-        "GnosisSafe"
+        "ZkFoundationMultisig"
    }
```

```diff
    contract SecurityCouncil (0xBDFfCC71FE84020238F2990a6D2954e87355De0D) {
    +++ description: None
      fieldMeta:
+        {"softFreezeNonce":{"severity":"HIGH","description":"Increments with each softFreeze (freezes ALL Hyperchains (blocks Mailbox and Executor facets) connected to the main STM for SOFT_FREEZE_PERIOD"},"hardFreezeNonce":{"severity":"HIGH","description":"Increments with each hardFreeze (freezes ALL Hyperchains (blocks Mailbox and Executor facets) connected to the main STM for HARD_FREEZE_PERIOD"}}
    }
```

```diff
-   Status: DELETED
    contract GnosisSafe (0xc3Abc9f9AA75Be8341E831482cdA0125a7B1A23e)
    +++ description: None
```

```diff
-   Status: DELETED
    contract GnosisSafe (0xFB90Da9DC45378A1B50775Beb03aD10C7E8DC231)
    +++ description: None
```

Generated with discovered.json: 0x5316f6730537230399f403d045aae371108b264d

# Diff at Wed, 11 Sep 2024 07:44:15 GMT:

- author: sekuba (<sekuba@users.noreply.github.com>)
- comparing to: main@407590ebfbad0b4f799badc3ad5fce90a7eaed11 block: 20713619
- current block number: 20725957

## Description

Two child-multisigs of the SecurityCouncil have signer-changes.

## Watched changes

```diff
    contract GnosisSafe (0x69462a81ba94D64c404575f1899a464F123497A2) {
    +++ description: None
      values.$members.11:
+        "0x663ec2BfB273447DC236A646d6dAAA333aAB08f7"
      values.$members.10:
-        "0x663ec2BfB273447DC236A646d6dAAA333aAB08f7"
+        "0x670B24610DF99b1685aEAC0dfD5307B92e0cF4d7"
      values.$members.9:
-        "0x670B24610DF99b1685aEAC0dfD5307B92e0cF4d7"
+        "0x7be0FF978bB8C96F78fb1B1fC6c04b5b572a80B8"
      values.$members.8:
-        "0x7be0FF978bB8C96F78fb1B1fC6c04b5b572a80B8"
+        "0xe968FB773e54f77350A427B057FDB44e6592E338"
      values.$members.7:
-        "0xe968FB773e54f77350A427B057FDB44e6592E338"
+        "0x6754CaFCe32a1bD1A8c88ABc19a113365b85917F"
      values.$members.6:
-        "0x6754CaFCe32a1bD1A8c88ABc19a113365b85917F"
+        "0x23aaaD48A6409d98Fcc2e9061CD2F437ff4E5839"
      values.$members.5:
-        "0x23aaaD48A6409d98Fcc2e9061CD2F437ff4E5839"
+        "0x371F6E45784E7DFBEA2dc18Edb68cD90aD530E6c"
      values.$members.4:
-        "0x371F6E45784E7DFBEA2dc18Edb68cD90aD530E6c"
+        "0xF3d913D11dd577DDe5da4f2AA9611Aa799185C46"
      values.$members.3:
-        "0xF3d913D11dd577DDe5da4f2AA9611Aa799185C46"
+        "0x7e0d106fD2Cee9aa846bc419944f5eD8F2935135"
      values.$members.2:
-        "0x7e0d106fD2Cee9aa846bc419944f5eD8F2935135"
+        "0x5F18752518d81E4AFbB28341EDFba9Aa0E16707C"
      values.$members.1:
-        "0x5F18752518d81E4AFbB28341EDFba9Aa0E16707C"
+        "0xaaAdAa000867fb883089B7e528d7eA96937b777f"
      values.$members.0:
-        "0xaaAdAa000867fb883089B7e528d7eA96937b777f"
+        "0x3766Ae19984f845bb149E05b6F7E14FFB4f85a1A"
      values.multisigThreshold:
-        "1 of 11 (9%)"
+        "1 of 12 (8%)"
    }
```

```diff
    contract GnosisSafe (0xB7aC3A79A23B148c85fba259712c5A1e7ad0ca44) {
    +++ description: None
      values.$members.4:
+        "0x57855BeeB39C56ca4Ff41C1D039B0F022ED08cea"
      values.$members.3:
-        "0x57855BeeB39C56ca4Ff41C1D039B0F022ED08cea"
+        "0xA1AF6Ed43eDeE80F1913ea44E9DC2A93A738EB44"
      values.$members.2:
-        "0xA1AF6Ed43eDeE80F1913ea44E9DC2A93A738EB44"
+        "0x896E7D2108245ae8d5Aa7E4763024b3945AEd77F"
      values.$members.1:
-        "0x896E7D2108245ae8d5Aa7E4763024b3945AEd77F"
+        "0x6c25cda91Bef3A4Ba1e4488b4ac276aA02921D67"
      values.$members.0:
-        "0x6c25cda91Bef3A4Ba1e4488b4ac276aA02921D67"
+        "0xdF28907A6A272fa06333a197d7F0379A0f8f00aa"
      values.multisigThreshold:
-        "1 of 4 (25%)"
+        "1 of 5 (20%)"
    }
```

Generated with discovered.json: 0xfebdc41677b04bf109847e17a5320f23bd01c291

# Diff at Mon, 09 Sep 2024 14:22:30 GMT:

- author: sekuba (<sekuba@users.noreply.github.com>)
- comparing to: main@92161a8609a409a7bea80cf1d38924cd21e5bc7f block: 20692926
- current block number: 20713619

## Description

BridgeHub upgrade (one-line diff):
* `addToken()` (acts as a global token whitelist for the shared bridge) now can only be called by the owner (not the admin). Currently those two roles are still held by the same address anyway.

## Watched changes

```diff
    contract Governance (0x0b622A2061EaccAE1c664eBC3E868b8438e03F61) {
    +++ description: None
      values.scheduledTransactions.64:
+        {"delay":0,"operation":{"calls":[{"target":"0xC2a36181fB524a6bEfE639aFEd37A67e77d62cf1","value":"0","function":"upgrade","inputs":[{"name":"proxy","value":"0x303a465B659cBB0ab36eE643eA362c509EEb5213"},{"name":"implementation","value":"0x509dA1BE24432F8804C4A9FF4a3c3f80284CDd13"}]}],"predecessor":"0x0000000000000000000000000000000000000000000000000000000000000000","salt":"0x0000000000000000000000000000000000000000000000000000000000000000"}}
    }
```

```diff
    contract BridgeHub (0x303a465B659cBB0ab36eE643eA362c509EEb5213) {
    +++ description: None
      values.$implementation:
-        "0x12f893689f9603991a8c22C249FFd0509Be95661"
+        "0x509dA1BE24432F8804C4A9FF4a3c3f80284CDd13"
      values.$upgradeCount:
-        1
+        2
    }
```

## Source code changes

```diff
.../ethereum/{.flat@20692926 => .flat}/BridgeHub/Bridgehub.sol          | 2 +-
 1 file changed, 1 insertion(+), 1 deletion(-)
```

Generated with discovered.json: 0x954bbe4a7a75f6047280a13af0431f31d4dc3168

# Diff at Fri, 06 Sep 2024 17:05:06 GMT:

- author: sekuba (<sekuba@users.noreply.github.com>)
- comparing to: main@fd881462cca0d7ef4519f907f3c6cfd5fe1cde8f block: 20663562
- current block number: 20692926

## Description

This update introduces a new ProtocolUpgradeHandler contract, with a new attached Governance system. The ProtocolUpgradeHandler is pendingOwner in all shared ZK stack contracts and will supposedly be used as the new owner of the central ProxyAdmin. It currently has no gov roles assigned (yet).

The L2 part of the Governance will be added in a separate config / PR.

### ProtocolUpgradeHandler.sol

Keeps track of the upgrade stages, executes upgrades, freezes contracts (all ZK shared contracts). (needs ProxyAdmin Owner and owner permissions)

check out my ART:
```
                     +----------------+
                     |     START      |
                     | (UpgradeState  |
                     |     .None)     |
                     +----------------+
                              |
      L2_PROTOCOL_GOVERNOR    |  (Currently timelock with 3 L2 Gov contracts)
                              v
                     +----------------+
                     |    Proposal    |
                     | (UpgradeState  |
                     |     .None)     |
                     +----------------+
                              |
    Timelock L2 (minDelay 0)  | message to L1
                              v
         +---------------------------------------------+
         |           Legal Veto Period                 |
         | (3 days, extendable to 7 days by Guardians) |
         |        (UpgradeState.LegalVetoPeriod)       |
         +---------------------------------------------+
                              |
                              | Time passes
                              v 
                     +----------------+ nobody   +----------------------+
                     |    Waiting     | approves |                      |
                     | (UpgradeState  |--------> | UpgradeState.expired |
                     |   .Waiting)    | 30 days  |                      |
                     +----------------+          +----------------------+
                         /        \
     Security Council  /            \ Guardians approve within
approves (immediate)  /              \  waiting period (+ 30d !!)
                     v                v 
         +---------------------------------+ 
         |       Execution Pending         | 
         | (UpgradeState.ExecutionPending) | 
         +---------------------------------+ 
                          |
                          | 1 day
                          v  
                 +-----------------+
                 |      Ready      |
                 | (UpgradeState   |
                 |    .Ready)      |
                 +-----------------+
                 | 
                 |        
                 |  Executor   or
                 |  Security Council
                 v 
         +-----------------+
         |    Executed     |
         | (UpgradeState   |
         |     .Done)      |
         +-----------------+

Actors:
- L2 Timelock Governors: Initiate the upgrade proposal
- Guardians: Can extend legal veto period and/or approve within 30d delay
- Security Council: Can approve immediately after legal waiting (3d)
- Executor: Specified address that can execute the upgrade when ready

UpgradeState Enum:
- None: Initial state or non-existent upgrade
- LegalVetoPeriod: During the legal veto period
- Waiting: Waiting for approval by SC or Guardians
- ExecutionPending: Approved, waiting for execution delay (1d)
- Ready: Ready for execution
- Done: Upgrade executed
- Expired: Upgrade expired without execution
```

Apart from this non-emergency track, there is `executeEmergencyUpgrade()` which has no delay. For this, SC, ZK_FOUNDATION MS and Guardians must all approve. (Uses eip712 standard)

Delay with current vars: 
- L2 proposal, then SC: messageToL1delay+3d+1d = ~5d (The ProtocolUpgradeHandler calls `proveL2MessageInclusion()` which needs the upgrade message batch from L2 to be executed on L1, thus currently ~1d messageToL1delay)
- L2 Proposal, then Guardians: messageToL1delay+3d+30d+1d = ~35d
- L1 'emergency' proposal by SC, ZK_FOUNDATION MS, Guardians = No delay

### EmergencyUpgradeBoard.sol

Uses eip712 standard to check signatures from SC, ZK_FOUNDATION MS and Guardians to push emergency approvals through the ProtocolUpgradeHandler.

### SecurityCouncil

12 signers custom multisig (some signers are MS themselves) with varying thresholds for certain actions. (3-9) Has eip712 support.

### Guardians

8 signers custom multisig (all signers are 1/1 GnosisSafes) with eip712 support. `"APPROVE_UPGRADE_GUARDIANS_THRESHOLD": 5`

### ZK Foundation Safe

New 3/5 GnosisSafe currently only used in by the EmergencyUpgradeBoard.

### Various GnosisSafes in the diff

Belong to Guardians or SC signers, there are no superfluous contracts in the config.

## Watched changes

```diff
    contract Governance (0x0b622A2061EaccAE1c664eBC3E868b8438e03F61) {
    +++ description: None
      values.scheduledTransactions.63:
+        {"delay":0,"operation":{"calls":[{"target":"0xD7f9f54194C633F36CCD5F3da84ad4a1c38cB2cB","value":"0","function":"transferOwnership","inputs":[{"name":"newOwner","value":"0x8f7a9912416e8AdC4D9c21FAe1415D3318A11897"}]},{"target":"0x303a465B659cBB0ab36eE643eA362c509EEb5213","value":"0","function":"transferOwnership","inputs":[{"name":"newOwner","value":"0x8f7a9912416e8AdC4D9c21FAe1415D3318A11897"}]},{"target":"0xc2eE6b6af7d616f6e27ce7F4A451Aedc2b0F5f5C","value":"0","function":"transferOwnership","inputs":[{"name":"newOwner","value":"0x8f7a9912416e8AdC4D9c21FAe1415D3318A11897"}]},{"target":"0x5D8ba173Dc6C3c90C8f7C04C9288BeF5FDbAd06E","value":"0","function":"transferOwnership","inputs":[{"name":"newOwner","value":"0x8f7a9912416e8AdC4D9c21FAe1415D3318A11897"}]}],"predecessor":"0x0000000000000000000000000000000000000000000000000000000000000000","salt":"0x0000000000000000000000000000000000000000000000000000000000000000"}}
    }
```

```diff
    contract BridgeHub (0x303a465B659cBB0ab36eE643eA362c509EEb5213) {
    +++ description: None
      values.pendingOwner:
-        "0x0000000000000000000000000000000000000000"
+        "0x8f7a9912416e8AdC4D9c21FAe1415D3318A11897"
    }
```

```diff
    contract ValidatorTimelock (0x5D8ba173Dc6C3c90C8f7C04C9288BeF5FDbAd06E) {
    +++ description: None
      values.pendingOwner:
-        "0x0000000000000000000000000000000000000000"
+        "0x8f7a9912416e8AdC4D9c21FAe1415D3318A11897"
    }
```

```diff
    contract StateTransitionManager (0xc2eE6b6af7d616f6e27ce7F4A451Aedc2b0F5f5C) {
    +++ description: None
      values.pendingOwner:
-        "0x0000000000000000000000000000000000000000"
+        "0x8f7a9912416e8AdC4D9c21FAe1415D3318A11897"
    }
```

```diff
    contract L1SharedBridge (0xD7f9f54194C633F36CCD5F3da84ad4a1c38cB2cB) {
    +++ description: None
      values.pendingOwner:
-        "0x0000000000000000000000000000000000000000"
+        "0x8f7a9912416e8AdC4D9c21FAe1415D3318A11897"
    }
```

```diff
+   Status: CREATED
    contract GnosisSafe (0x015318c16AE443a20DE0A776dB06a59F0D279057)
    +++ description: None
```

```diff
+   Status: CREATED
    contract GnosisSafe (0x13f07d9BF17615f6a17F272fe1A913168C275A66)
    +++ description: None
```

```diff
+   Status: CREATED
    contract GnosisSafe (0x178D8Eb1A1fb81B5102808A83318Bb04C6a9fC6D)
    +++ description: None
```

```diff
+   Status: CREATED
    contract GnosisSafe (0x2A90830083C5Ca1f18d7AA7fCDC2998f93475384)
    +++ description: None
```

```diff
+   Status: CREATED
    contract GnosisSafe (0x34Ea62D4b9bBB8AD927eFB6ab31E3Ab3474aC93a)
    +++ description: None
```

```diff
+   Status: CREATED
    contract GnosisSafe (0x35eA56fd9eAd2567F339Eb9564B6940b9DD5653F)
    +++ description: None
```

```diff
+   Status: CREATED
    contract GnosisSafe (0x3888777686F0b0d8c3108fc22ad8DE9E049bE26F)
    +++ description: None
```

```diff
+   Status: CREATED
    contract GnosisSafe (0x538612F6eba6ff80FBD95D60dCDee16b8FfF2c0f)
    +++ description: None
```

```diff
+   Status: CREATED
    contract GnosisSafe (0x55c671BcE13120387Ded710A1d1b80C0e3d8E857)
    +++ description: None
```

```diff
+   Status: CREATED
    contract GnosisSafe (0x590926dBCDfD19627c3BbD2A6Eb96DeC7a3AbF69)
    +++ description: None
```

```diff
+   Status: CREATED
    contract GnosisSafe (0x69462a81ba94D64c404575f1899a464F123497A2)
    +++ description: None
```

```diff
+   Status: CREATED
    contract GnosisSafe (0x6D26874130A174839b9cd8CB87Ed4E09D0c1a5f0)
    +++ description: None
```

```diff
+   Status: CREATED
    contract GnosisSafe (0x725065b4eB99294BaaE57AdDA9c32e42F453FA8A)
    +++ description: None
```

```diff
+   Status: CREATED
    contract GnosisSafe (0x84BF0Ac41Eeb74373Ddddae8b7055Bf2bD3CE6E0)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ProtocolUpgradeHandler (0x8f7a9912416e8AdC4D9c21FAe1415D3318A11897)
    +++ description: None
```

```diff
+   Status: CREATED
    contract GnosisSafe (0x9B39Ea22e838B316Ea7D74e7C4B07d91D51ccA88)
    +++ description: None
```

```diff
+   Status: CREATED
    contract GnosisSafe (0x9B8Be3278B7F0168D82059eb6BAc5991DcdfA803)
    +++ description: None
```

```diff
+   Status: CREATED
    contract GnosisSafe (0xB7aC3A79A23B148c85fba259712c5A1e7ad0ca44)
    +++ description: None
```

```diff
+   Status: CREATED
    contract GnosisSafe (0xbC1653bd3829dfEc575AfC3816D4899cd103B51c)
    +++ description: None
```

```diff
+   Status: CREATED
    contract SecurityCouncil (0xBDFfCC71FE84020238F2990a6D2954e87355De0D)
    +++ description: None
```

```diff
+   Status: CREATED
    contract GnosisSafe (0xc3Abc9f9AA75Be8341E831482cdA0125a7B1A23e)
    +++ description: None
```

```diff
+   Status: CREATED
    contract GnosisSafe (0xCe7a3dFcc35602155809920Ff65e093aa726f6cf)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Guardians (0xD677e09324F8Bb3cC64F009973693f751c33A888)
    +++ description: None
```

```diff
+   Status: CREATED
    contract EmergencyUpgradeBoard (0xdEFd1eDEE3E8c5965216bd59C866f7f5307C9b29)
    +++ description: None
```

```diff
+   Status: CREATED
    contract GnosisSafe (0xFB90Da9DC45378A1B50775Beb03aD10C7E8DC231)
    +++ description: None
```

## Source code changes

```diff
.../ethereum/.flat/EmergencyUpgradeBoard.sol       | 1233 +++++++++++++++++
 .../GnosisSafe.sol                                 |  953 +++++++++++++
 .../GnosisSafeProxy.p.sol                          |   35 +
 .../GnosisSafe.sol                                 |  953 +++++++++++++
 .../GnosisSafeProxy.p.sol                          |   35 +
 .../GnosisSafe.sol                                 |  953 +++++++++++++
 .../GnosisSafeProxy.p.sol                          |   35 +
 .../GnosisSafe.sol                                 |  953 +++++++++++++
 .../GnosisSafeProxy.p.sol                          |   35 +
 .../GnosisSafe.sol                                 |  953 +++++++++++++
 .../GnosisSafeProxy.p.sol                          |   35 +
 .../GnosisSafe.sol                                 |  953 +++++++++++++
 .../GnosisSafeProxy.p.sol                          |   35 +
 .../GnosisSafe.sol                                 |  953 +++++++++++++
 .../GnosisSafeProxy.p.sol                          |   35 +
 .../GnosisSafe.sol                                 |  953 +++++++++++++
 .../GnosisSafeProxy.p.sol                          |   35 +
 .../GnosisSafe.sol                                 |  953 +++++++++++++
 .../GnosisSafeProxy.p.sol                          |   35 +
 .../GnosisSafe.sol                                 |  953 +++++++++++++
 .../GnosisSafeProxy.p.sol                          |   35 +
 .../GnosisSafe.sol                                 |  953 +++++++++++++
 .../GnosisSafeProxy.p.sol                          |   35 +
 .../GnosisSafe.sol                                 |  953 +++++++++++++
 .../GnosisSafeProxy.p.sol                          |   35 +
 .../GnosisSafe.sol                                 |  953 +++++++++++++
 .../GnosisSafeProxy.p.sol                          |   35 +
 .../GnosisSafe.sol                                 |  953 +++++++++++++
 .../GnosisSafeProxy.p.sol                          |   35 +
 .../GnosisSafe.sol                                 |  953 +++++++++++++
 .../GnosisSafeProxy.p.sol                          |   35 +
 .../GnosisSafe.sol                                 |  953 +++++++++++++
 .../GnosisSafeProxy.p.sol                          |   35 +
 .../GnosisSafe.sol                                 |  953 +++++++++++++
 .../GnosisSafeProxy.p.sol                          |   35 +
 .../GnosisSafe.sol                                 |  953 +++++++++++++
 .../GnosisSafeProxy.p.sol                          |   35 +
 .../GnosisSafe.sol                                 |  953 +++++++++++++
 .../GnosisSafeProxy.p.sol                          |   35 +
 .../GnosisSafe.sol                                 |  953 +++++++++++++
 .../GnosisSafeProxy.p.sol                          |   35 +
 .../GnosisSafe.sol                                 |  953 +++++++++++++
 .../GnosisSafeProxy.p.sol                          |   35 +
 .../shared-zk-stack/ethereum/.flat/Guardians.sol   | 1439 ++++++++++++++++++++
 .../ethereum/.flat/ProtocolUpgradeHandler.sol      |  605 ++++++++
 .../ethereum/.flat/SecurityCouncil.sol             | 1389 +++++++++++++++++++
 46 files changed, 25414 insertions(+)
```

Generated with discovered.json: 0xe131f21db446bf93a860e4e5e83e4f27e772bd97

# Diff at Fri, 30 Aug 2024 08:00:41 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@6c1bd1f41fadf5f2cb1c1805b5a2c6138a3ed35a block: 20618759
- current block number: 20618759

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20618759 (main branch discovery), not current.

```diff
    contract ProxyAdmin (0xC2a36181fB524a6bEfE639aFEd37A67e77d62cf1) {
    +++ description: None
      receivedPermissions.2.via:
-        []
      receivedPermissions.1.via:
-        []
      receivedPermissions.0.via:
-        []
    }
```

Generated with discovered.json: 0xfddab7e20377594ae29665447bb6672e87b6f07a

# Diff at Tue, 27 Aug 2024 08:35:30 GMT:

- author: Radina Talanova (<nt.radina@gmail.com>)
- comparing to: main@cf2dd34fdc5bce846ae811aa246ba203fc03f637 block: 20585030
- current block number: 20618759

## Description

The transactions were executed immediately and update the implementation of the shared bridge contract to introduce the ability to set an admin that can initialize new chains to the shared bridge (can set a chain's l2 bridge address) or add a new pending admin. The `onlyOwnerOrAdmin` is added for this purpose, so the two functions are also callable by the owner (matter labs gov).

## Watched changes

```diff
    contract Governance (0x0b622A2061EaccAE1c664eBC3E868b8438e03F61) {
    +++ description: None
      values.scheduledTransactions.62:
+        {"delay":0,"operation":{"calls":[{"target":"0xD7f9f54194C633F36CCD5F3da84ad4a1c38cB2cB","value":"0","function":"setPendingAdmin","inputs":[{"name":"_newPendingAdmin","value":"0x2cf3bD6a9056b39999F3883955E183F655345063"}]}],"predecessor":"0x0000000000000000000000000000000000000000000000000000000000000000","salt":"0x0000000000000000000000000000000000000000000000000000000000000000"}}
      values.scheduledTransactions.61:
+        {"delay":0,"operation":{"calls":[{"target":"0xC2a36181fB524a6bEfE639aFEd37A67e77d62cf1","value":"0","function":"upgrade","inputs":[{"name":"proxy","value":"0xD7f9f54194C633F36CCD5F3da84ad4a1c38cB2cB"},{"name":"implementation","value":"0xb56A8225A745756DD215faf22E4796f373561AcD"}]}],"predecessor":"0x0000000000000000000000000000000000000000000000000000000000000000","salt":"0x0000000000000000000000000000000000000000000000000000000000000000"}}
      values.scheduledTransactions.60:
+        {"delay":0,"operation":{"calls":[{"target":"0x303a465B659cBB0ab36eE643eA362c509EEb5213","value":"0","function":"requestL2TransactionDirect","inputs":[{"name":"_request","value":[388,"8000000000000000000","0x898B3560AFFd6D955b1574D87EE09e46669c60eA",0,"0xb71bcf9000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000c0000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000005457468657200000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000034554480000000000000000000000000000000000000000000000000000000000",1600000,800,[],"0x143524d0ac8D7f35a2133b6B0a7567e0E3393137"]}]}],"predecessor":"0x0000000000000000000000000000000000000000000000000000000000000000","salt":"0x0000000000000000000000000000000000000000000000000000000000000000"}}
    }
```

```diff
    contract L1SharedBridge (0xD7f9f54194C633F36CCD5F3da84ad4a1c38cB2cB) {
    +++ description: None
      values.$implementation:
-        "0xCba1aF8f0bB223b2544F8eB8f69d1c7960f788dB"
+        "0xb56A8225A745756DD215faf22E4796f373561AcD"
      values.$upgradeCount:
-        1
+        2
      values.admin:
+        "0x2cf3bD6a9056b39999F3883955E183F655345063"
      values.pendingAdmin:
+        "0x0000000000000000000000000000000000000000"
    }
```

## Source code changes

```diff
.../L1SharedBridge/L1SharedBridge.sol              | 68 +++++++++++++++++++++-
 1 file changed, 67 insertions(+), 1 deletion(-)
```

Generated with discovered.json: 0x3f5e72eeb57d7ed748830fda356242452bae1bd4

# Diff at Fri, 23 Aug 2024 09:55:29 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@67597c7d6c810bc726594446890178150240711e block: 20585030
- current block number: 20585030

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20585030 (main branch discovery), not current.

```diff
    contract BridgeHub (0x303a465B659cBB0ab36eE643eA362c509EEb5213) {
    +++ description: None
      values.$upgradeCount:
+        1
    }
```

```diff
    contract StateTransitionManager (0xc2eE6b6af7d616f6e27ce7F4A451Aedc2b0F5f5C) {
    +++ description: None
      values.$upgradeCount:
+        2
    }
```

```diff
    contract L1SharedBridge (0xD7f9f54194C633F36CCD5F3da84ad4a1c38cB2cB) {
    +++ description: None
      values.$upgradeCount:
+        1
    }
```

Generated with discovered.json: 0x4640fe69b924e5b47a41d891a603415d05e47cc1

# Diff at Thu, 22 Aug 2024 15:26:28 GMT:

- author: Radina Talanova (<nt.radina@gmail.com>)
- comparing to: main@08f0832a5dea29e7c493cd50bda4bf1729aa03ae block: 20577647
- current block number: 20585030

## Description

Config changes related to trust permissions.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20577647 (main branch discovery), not current.

```diff
    contract BridgeHub (0x303a465B659cBB0ab36eE643eA362c509EEb5213) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0xC2a36181fB524a6bEfE639aFEd37A67e77d62cf1","via":[]}]
    }
```

```diff
    contract ProxyAdmin (0xC2a36181fB524a6bEfE639aFEd37A67e77d62cf1) {
    +++ description: None
      assignedPermissions:
-        {"upgrade":["0x303a465B659cBB0ab36eE643eA362c509EEb5213","0xD7f9f54194C633F36CCD5F3da84ad4a1c38cB2cB","0xc2eE6b6af7d616f6e27ce7F4A451Aedc2b0F5f5C"]}
      receivedPermissions:
+        [{"permission":"upgrade","target":"0x303a465B659cBB0ab36eE643eA362c509EEb5213","via":[]},{"permission":"upgrade","target":"0xc2eE6b6af7d616f6e27ce7F4A451Aedc2b0F5f5C","via":[]},{"permission":"upgrade","target":"0xD7f9f54194C633F36CCD5F3da84ad4a1c38cB2cB","via":[]}]
    }
```

```diff
    contract StateTransitionManager (0xc2eE6b6af7d616f6e27ce7F4A451Aedc2b0F5f5C) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0xC2a36181fB524a6bEfE639aFEd37A67e77d62cf1","via":[]}]
    }
```

```diff
    contract L1SharedBridge (0xD7f9f54194C633F36CCD5F3da84ad4a1c38cB2cB) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0xC2a36181fB524a6bEfE639aFEd37A67e77d62cf1","via":[]}]
    }
```

Generated with discovered.json: 0x21457d5a4d6030a99808e98536320926080b462b

# Diff at Wed, 21 Aug 2024 14:40:15 GMT:

- author: Radina Talanova (<nt.radina@gmail.com>)
- comparing to: main@9ff9ee2b2fd37e2cdd4a4bcebdcefcb5e61b1e6c block: 20469956
- current block number: 20577647

## Description

10 zkCRO tokens were transferred from the Matter Labs Multisig to the Governance contract and then 2 of them deposited to the bridge.

## Watched changes

```diff
    contract Governance (0x0b622A2061EaccAE1c664eBC3E868b8438e03F61) {
    +++ description: None
      values.scheduledTransactions.59:
+        {"delay":0,"operation":{"calls":[{"target":"0x28Ff2E4dD1B58efEB0fC138602A28D5aE81e44e2","value":"0","function":"approve","inputs":[{"name":"spender","value":"0xD7f9f54194C633F36CCD5F3da84ad4a1c38cB2cB"},{"name":"value","value":"10000000000000000000"}]},{"target":"0x303a465B659cBB0ab36eE643eA362c509EEb5213","value":"0","function":"requestL2TransactionDirect","inputs":[{"name":"_request","value":[388,"2000000000000000000","0x898B3560AFFd6D955b1574D87EE09e46669c60eA",0,"0xb71bcf9000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000c0000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000005457468657200000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000034554480000000000000000000000000000000000000000000000000000000000",400000,800,[],"0x143524d0ac8D7f35a2133b6B0a7567e0E3393137"]}]}],"predecessor":"0x0000000000000000000000000000000000000000000000000000000000000000","salt":"0x0000000000000000000000000000000000000000000000000000000000000000"}}
    }
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20469956 (main branch discovery), not current.

```diff
    contract BridgeHub (0x303a465B659cBB0ab36eE643eA362c509EEb5213) {
    +++ description: None
      issuedPermissions:
-        [{"permission":"upgrade","target":"0xC2a36181fB524a6bEfE639aFEd37A67e77d62cf1","via":[]}]
    }
```

```diff
    contract ProxyAdmin (0xC2a36181fB524a6bEfE639aFEd37A67e77d62cf1) {
    +++ description: None
      receivedPermissions:
-        [{"permission":"upgrade","target":"0x303a465B659cBB0ab36eE643eA362c509EEb5213","via":[]},{"permission":"upgrade","target":"0xc2eE6b6af7d616f6e27ce7F4A451Aedc2b0F5f5C","via":[]},{"permission":"upgrade","target":"0xD7f9f54194C633F36CCD5F3da84ad4a1c38cB2cB","via":[]}]
      assignedPermissions:
+        {"upgrade":["0x303a465B659cBB0ab36eE643eA362c509EEb5213","0xD7f9f54194C633F36CCD5F3da84ad4a1c38cB2cB","0xc2eE6b6af7d616f6e27ce7F4A451Aedc2b0F5f5C"]}
    }
```

```diff
    contract StateTransitionManager (0xc2eE6b6af7d616f6e27ce7F4A451Aedc2b0F5f5C) {
    +++ description: None
      issuedPermissions:
-        [{"permission":"upgrade","target":"0xC2a36181fB524a6bEfE639aFEd37A67e77d62cf1","via":[]}]
    }
```

```diff
    contract L1SharedBridge (0xD7f9f54194C633F36CCD5F3da84ad4a1c38cB2cB) {
    +++ description: None
      issuedPermissions:
-        [{"permission":"upgrade","target":"0xC2a36181fB524a6bEfE639aFEd37A67e77d62cf1","via":[]}]
    }
```

Generated with discovered.json: 0xa9240a22791f73d566140a9cdc4236fe6c458128

# Diff at Wed, 21 Aug 2024 10:05:50 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@2f6dde3357bf5d79196b6e94f79d853a6c4ec72b block: 20469956
- current block number: 20469956

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20469956 (main branch discovery), not current.

```diff
    contract BridgeHub (0x303a465B659cBB0ab36eE643eA362c509EEb5213) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0xC2a36181fB524a6bEfE639aFEd37A67e77d62cf1","via":[]}]
    }
```

```diff
    contract ProxyAdmin (0xC2a36181fB524a6bEfE639aFEd37A67e77d62cf1) {
    +++ description: None
      assignedPermissions:
-        {"upgrade":["0x303a465B659cBB0ab36eE643eA362c509EEb5213","0xD7f9f54194C633F36CCD5F3da84ad4a1c38cB2cB","0xc2eE6b6af7d616f6e27ce7F4A451Aedc2b0F5f5C"]}
      receivedPermissions:
+        [{"permission":"upgrade","target":"0x303a465B659cBB0ab36eE643eA362c509EEb5213","via":[]},{"permission":"upgrade","target":"0xc2eE6b6af7d616f6e27ce7F4A451Aedc2b0F5f5C","via":[]},{"permission":"upgrade","target":"0xD7f9f54194C633F36CCD5F3da84ad4a1c38cB2cB","via":[]}]
    }
```

```diff
    contract StateTransitionManager (0xc2eE6b6af7d616f6e27ce7F4A451Aedc2b0F5f5C) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0xC2a36181fB524a6bEfE639aFEd37A67e77d62cf1","via":[]}]
    }
```

```diff
    contract L1SharedBridge (0xD7f9f54194C633F36CCD5F3da84ad4a1c38cB2cB) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0xC2a36181fB524a6bEfE639aFEd37A67e77d62cf1","via":[]}]
    }
```

Generated with discovered.json: 0xda40aa4c78260b726a113b92cf0b6ad67b96c8e1

# Diff at Fri, 09 Aug 2024 12:02:15 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@bf40aa32f030fd312056ca0ef198c8550467d1d7 block: 20469956
- current block number: 20469956

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20469956 (main branch discovery), not current.

```diff
    contract ProxyAdmin (0xC2a36181fB524a6bEfE639aFEd37A67e77d62cf1) {
    +++ description: None
      assignedPermissions.upgrade.1:
-        "0x303a465B659cBB0ab36eE643eA362c509EEb5213"
+        "0xD7f9f54194C633F36CCD5F3da84ad4a1c38cB2cB"
      assignedPermissions.upgrade.0:
-        "0xD7f9f54194C633F36CCD5F3da84ad4a1c38cB2cB"
+        "0x303a465B659cBB0ab36eE643eA362c509EEb5213"
    }
```

Generated with discovered.json: 0xf03a299dddbd127d2d553cbfff574e6d581ee856

# Diff at Fri, 09 Aug 2024 10:12:14 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@1f0da1d0aab7bc6b3b5e54e7e93480bd98e57035 block: 20469956
- current block number: 20469956

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20469956 (main branch discovery), not current.

```diff
    contract Matter Labs Multisig (0x4e4943346848c4867F81dFb37c4cA9C5715A7828) {
    +++ description: Can instantly upgrade all contracts and roles in the zksync Era contracts
      values.$multisigThreshold:
-        "4 of 7 (57%)"
+++ description: Signers of the multisig
+++ severity: LOW
      values.getOwners:
-        ["0x3F0009D00cc78979d00Eb635490F23E8d6aCc481","0xe79af29d618141Ffef951B240b250d47030D56d7","0x3068415e0F857A5eEd03302A1F7E44f67468d2Bc","0x702caCafA54B88e9c54449563Fb2e496e85c78b7","0xFAdb20191Ab38362C50f52909817B74214CA79AE","0xfd03dA3aeb6807a98db96C1704Ea4CFf031BaEd2","0x700DA14328eC2F81053E5B6aAE4803E16BEdF1df"]
+++ description: Should be 4/8 per official docs
+++ severity: HIGH
      values.getThreshold:
-        4
      values.$members:
+        ["0x3F0009D00cc78979d00Eb635490F23E8d6aCc481","0xe79af29d618141Ffef951B240b250d47030D56d7","0x3068415e0F857A5eEd03302A1F7E44f67468d2Bc","0x702caCafA54B88e9c54449563Fb2e496e85c78b7","0xFAdb20191Ab38362C50f52909817B74214CA79AE","0xfd03dA3aeb6807a98db96C1704Ea4CFf031BaEd2","0x700DA14328eC2F81053E5B6aAE4803E16BEdF1df"]
      values.$threshold:
+        4
      values.multisigThreshold:
+        "4 of 7 (57%)"
    }
```

```diff
    contract ProxyAdmin (0xC2a36181fB524a6bEfE639aFEd37A67e77d62cf1) {
    +++ description: None
      assignedPermissions.admin:
-        ["0x303a465B659cBB0ab36eE643eA362c509EEb5213","0xD7f9f54194C633F36CCD5F3da84ad4a1c38cB2cB","0xc2eE6b6af7d616f6e27ce7F4A451Aedc2b0F5f5C"]
      assignedPermissions.upgrade:
+        ["0xD7f9f54194C633F36CCD5F3da84ad4a1c38cB2cB","0x303a465B659cBB0ab36eE643eA362c509EEb5213","0xc2eE6b6af7d616f6e27ce7F4A451Aedc2b0F5f5C"]
    }
```

Generated with discovered.json: 0xa996360228c16c8eb5c8e3493c4f01c107b710c8

# Diff at Tue, 06 Aug 2024 13:54:21 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@08572cac0b099c9871f6e5b417260b029c0e9393 block: 20432409
- current block number: 20469956

## Description

The shared ZK stack contracts BridgeHub and StateTransitionManager (used by cronos and ZKsync Era) and also the ZKsync Era diamond proxy are moved to new admin contract called 'ChainAdmin' (owner is Matter Labs MS). The STM is upgraded to a new implementation with marginal diff (one added event).

The scheduled tx is immediately executed.

This upgrade does not change net permissions at the moment but will probably be used in the future once more ZK stack chains are used or something like a SecurityCouncil is added.

### New ChainAdmin contract

This contract is very simple with the most important functions being:
- `multicall` (onlyOwner): Does what the name suggests
- `setTokenMultiplier` (callable by `tokenMultiplierSetter`): Used for the custom gas tokens of ZK stack chains
- `setUpgradeTimestamp` (onlyOwner): sets a public expected upgrade timestamp for a new protocol version (like the one used for this upgrade `103079215106`), this var is only informative and not enforced so far

The contract is set as admin (NOT upgradeability admin, see upgrades&gov diagram) for the BridgeHub, the STM and the ZKsync Era diamond at the moment.
The Governance contract still has its former upgradeabilityAdmin role.


## Watched changes

```diff
    contract Governance (0x0b622A2061EaccAE1c664eBC3E868b8438e03F61) {
    +++ description: None
      values.scheduledTransactions.58:
+        {"delay":0,"operation":{"calls":[{"target":"0xc2eE6b6af7d616f6e27ce7F4A451Aedc2b0F5f5C","value":"0","function":"setNewVersionUpgrade","inputs":[{"name":"_cutData","value":[[],"0x4d376798Ba8F69cEd59642c3AE8687c7457e855d","0x08284e5700000000000000000000000000000000000000000000000000000000000000200000000000000000000000000000000000000000000000000000000000000180000000000000000000000000000000000000000000000000000000000000048000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000004a000000000000000000000000000000000000000000000000000000000000004c00000000000000000000000000000000000000000000000000000000066ab923f0000000000000000000000000000000000000000000000000000001800000002000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000260000000000000000000000000000000000000000000000000000000000000028000000000000000000000000000000000000000000000000000000000000002a000000000000000000000000000000000000000000000000000000000000002c000000000000000000000000000000000000000000000000000000000000002e000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000"]},{"name":"_oldProtocolVersion","value":103079215105},{"name":"_oldProtocolVersionDeadline","value":"115792089237316195423570985008687907853269984665640564039457584007913129639935"},{"name":"_newProtocolVersion","value":103079215106}]}],"predecessor":"0x0000000000000000000000000000000000000000000000000000000000000000","salt":"0x0000000000000000000000000000000000000000000000000000000000000000"}}
      values.scheduledTransactions.57:
+        {"delay":0,"operation":{"calls":[{"target":"0xC2a36181fB524a6bEfE639aFEd37A67e77d62cf1","value":"0","function":"upgrade","inputs":[{"name":"proxy","value":"0xc2eE6b6af7d616f6e27ce7F4A451Aedc2b0F5f5C"},{"name":"implementation","value":"0xed1Dc7F0Be2B19cb02a2476150C8ea24A37c5274"}]},{"target":"0x32400084C286CF3E17e7B677ea9583e60a000324","value":"0","function":"setPendingAdmin","inputs":[{"name":"_newPendingAdmin","value":"0x2cf3bD6a9056b39999F3883955E183F655345063"}]},{"target":"0x303a465B659cBB0ab36eE643eA362c509EEb5213","value":"0","function":"setPendingAdmin","inputs":[{"name":"_newPendingAdmin","value":"0x2cf3bD6a9056b39999F3883955E183F655345063"}]},{"target":"0xc2eE6b6af7d616f6e27ce7F4A451Aedc2b0F5f5C","value":"0","function":"setPendingAdmin","inputs":[{"name":"_newPendingAdmin","value":"0x2cf3bD6a9056b39999F3883955E183F655345063"}]}],"predecessor":"0x0000000000000000000000000000000000000000000000000000000000000000","salt":"0x0000000000000000000000000000000000000000000000000000000000000000"}}
    }
```

```diff
    contract BridgeHub (0x303a465B659cBB0ab36eE643eA362c509EEb5213) {
    +++ description: None
      values.admin:
-        "0x0b622A2061EaccAE1c664eBC3E868b8438e03F61"
+        "0x2cf3bD6a9056b39999F3883955E183F655345063"
    }
```

```diff
    contract Matter Labs Multisig (0x4e4943346848c4867F81dFb37c4cA9C5715A7828) {
    +++ description: Can instantly upgrade all contracts and roles in the zksync Era contracts
+++ description: Signers of the multisig
+++ severity: LOW
      values.getOwners.4:
-        "0x9dF8bc0918F357c766A5697E031fF5237c05747A"
+        "0xFAdb20191Ab38362C50f52909817B74214CA79AE"
    }
```

```diff
    contract StateTransitionManager (0xc2eE6b6af7d616f6e27ce7F4A451Aedc2b0F5f5C) {
    +++ description: None
      values.$implementation:
-        "0x8279B7E48fA074f966385d87AEf29Bd031e54fD5"
+        "0xed1Dc7F0Be2B19cb02a2476150C8ea24A37c5274"
      values.admin:
-        "0x0b622A2061EaccAE1c664eBC3E868b8438e03F61"
+        "0x2cf3bD6a9056b39999F3883955E183F655345063"
      values.getSemverProtocolVersion.2:
-        1
+        2
      values.protocolVersion:
-        103079215105
+        103079215106
    }
```

```diff
+   Status: CREATED
    contract ChainAdmin (0x2cf3bD6a9056b39999F3883955E183F655345063)
    +++ description: None
```

## Source code changes

```diff
.../shared-zk-stack/ethereum/.flat/ChainAdmin.sol  | 214 +++++++++++++++++++++
 .../StateTransitionManager.sol                     |  24 ++-
 2 files changed, 228 insertions(+), 10 deletions(-)
```

Generated with discovered.json: 0x71be9779a8f3457a1989249b52a4cdb17a231835

# Diff at Wed, 31 Jul 2024 10:26:45 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- current block number: 20425929

## Description

Initial discovery of the shared config.

Two governance transactions (no delay) add the new Cronos zkEVM (First ZK stack chain). It shares the StateTransitionManager, ValidatorTimelock and Verifier with ZKsync Era, thus sharing the L2 logic. For DA it uses ValidiumMode. (https://etherscan.io/tx/0xb2a1d8913ebe7b4a8a21064c994801ad036fc85da1f378f35b57956df72f0131)
Four new Validators are registered with the Timelock, of which two are removed, leaving two new ones and two each for ZKsync Era and Cronos zkEVM.

The Cronos DiamondProxy is not yet verified.

## Initial discovery

```diff
+   Status: CREATED
    contract Governance (0x0b622A2061EaccAE1c664eBC3E868b8438e03F61)
    +++ description: None
```

```diff
+   Status: CREATED
    contract BridgeHub (0x303a465B659cBB0ab36eE643eA362c509EEb5213)
    +++ description: None
```

```diff
+   Status: CREATED
    contract GenesisUpgrade (0x3dDD7ED2AeC0758310A4C6596522FCAeD108DdA2)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Matter Labs Multisig (0x4e4943346848c4867F81dFb37c4cA9C5715A7828)
    +++ description: Can instantly upgrade all contracts and roles in the zksync Era contracts
```

```diff
+   Status: CREATED
    contract ValidatorTimelock (0x5D8ba173Dc6C3c90C8f7C04C9288BeF5FDbAd06E)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ProxyAdmin (0xC2a36181fB524a6bEfE639aFEd37A67e77d62cf1)
    +++ description: None
```

```diff
+   Status: CREATED
    contract StateTransitionManager (0xc2eE6b6af7d616f6e27ce7F4A451Aedc2b0F5f5C)
    +++ description: None
```

```diff
+   Status: CREATED
    contract L1SharedBridge (0xD7f9f54194C633F36CCD5F3da84ad4a1c38cB2cB)
    +++ description: None
```
