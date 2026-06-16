Generated with discovered.json: 0x02f0fa465869e5e623c2d58227a8c68b9eb52aa0

# Diff at Mon, 15 Jun 2026 13:58:14 GMT:

- author: vincfurc (<vincfurc@users.noreply.github.com>)
- comparing to: main@254df558db0f4fcb5b0e269facd77fad1c7d2ddb block: 1780557929
- current timestamp: 1781531783

## Description

Guardian role on OptimismPortal2, SystemConfig and SuperchainConfig moved from Conduit Multisig 1 to the joint Ronin/Conduit Safe (RoninConduitOwner): SuperchainConfig was re-initialized via the standard StorageSetter→same-impl pattern, bumping `initVersion` 1 → 2 and setting the new guardian address. Conduit Multisig 1 remains challenger in DGF.

## Watched changes

```diff
    contract Conduit Multisig 1 (eth:0x4a4962275DF8C60a80d3a25faEc5AA7De116A746) [GnosisSafe] {
    +++ description: None
      values.$members.4:
-        "eth:0x65D1d44B8B2fE15d45A03708E0835C7E98a56007"
      values.$members.8:
-        "eth:0xa4000bDD2bB92ce6750b31F1eeda47Bd1cB8e6e4"
      values.multisigThreshold:
-        "4 of 12 (33%)"
+        "4 of 10 (40%)"
      receivedPermissions.1:
-        {"permission":"interact","from":"eth:0xEE552e802A50d855bD08E93dfcc69228FC7B9E2c","description":"Allowed to pause withdrawals. In op stack systems with a proof system, the Guardian can also blacklist dispute games and set the respected game type (permissioned / permissionless).","role":".guardian"}
    }
```

```diff
    contract OptimismPortal2 (eth:0x652CD53eCf9466E5Fb00D0E11d6CBf6469a56D77) [opstack/OptimismPortal2] {
    +++ description: The OptimismPortal contract is the main entry point to deposit funds from L1 to L2. It also allows to prove and finalize withdrawals. It specifies which game type can be used for withdrawals, which currently is the PermissionedDisputeGame.
      values.guardian:
-        "eth:0x4a4962275DF8C60a80d3a25faEc5AA7De116A746"
+        "eth:0xE9Ad9723C24d946958f9FD3Bc861BbF983525607"
    }
```

```diff
    contract SystemConfig (eth:0xc4f4F908C36C8119f1FBd52CebbDB30C6f2a23C1) [opstack/SystemConfig] {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      values.guardian:
-        "eth:0x4a4962275DF8C60a80d3a25faEc5AA7De116A746"
+        "eth:0xE9Ad9723C24d946958f9FD3Bc861BbF983525607"
    }
```

```diff
    contract RoninConduitOwner (eth:0xE9Ad9723C24d946958f9FD3Bc861BbF983525607) [GnosisSafe] {
    +++ description: 5-of-6 joint Ronin/Conduit Safe.
      receivedPermissions.2:
+        {"permission":"interact","from":"eth:0xEE552e802A50d855bD08E93dfcc69228FC7B9E2c","description":"Allowed to pause withdrawals. In op stack systems with a proof system, the Guardian can also blacklist dispute games and set the respected game type (permissioned / permissionless).","role":".guardian"}
    }
```

```diff
    contract SuperchainConfig (eth:0xEE552e802A50d855bD08E93dfcc69228FC7B9E2c) [opstack/SuperchainConfigFake_expiry] {
    +++ description: This is NOT the shared SuperchainConfig contract of the OP stack Superchain but rather a local fork. It manages pause states for each chain connected to it, as well as a global pause state for all chains. The guardian role can pause either separately, but each pause expires after 3mo 1d if left untouched.
      values.$pastUpgrades.1:
+        ["2026-06-09T07:02:35.000Z","0x7e9202c4d6cb60aa8f0d86f9524f58cc3b5edb505495f61503d9374e3859cdb6",["eth:0x6322C2f2D6a4305Fc033754d486A5A067Ee5F9b1"]]
      values.$pastUpgrades.2:
+        ["2026-06-09T07:02:35.000Z","0x7e9202c4d6cb60aa8f0d86f9524f58cc3b5edb505495f61503d9374e3859cdb6",["eth:0xb08Cc720F511062537ca78BdB0AE691F04F5a957"]]
      values.$upgradeCount:
-        1
+        3
      values.guardian:
-        "eth:0x4a4962275DF8C60a80d3a25faEc5AA7De116A746"
+        "eth:0xE9Ad9723C24d946958f9FD3Bc861BbF983525607"
    }
```

Generated with discovered.json: 0x8ad704aa9cad63433de68fbaa561468f7c9c8ff0

# Diff at Tue, 09 Jun 2026 12:43:38 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@ae67a38d37457ad735e5d55080d2e5479d5df7dc block: 1780557929
- current timestamp: 1780557929

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 1780557929 (main branch discovery), not current.

```diff
    contract Conduit Multisig 1 (eth:0x4a4962275DF8C60a80d3a25faEc5AA7De116A746) [GnosisSafe] {
    +++ description: None
      receivedPermissions.0.description:
+        "Allowed to challenge or delete state roots proposed by a Proposer."
      receivedPermissions.0.permission:
-        "challenge"
+        "interact"
      receivedPermissions.1.description:
+        "Allowed to pause withdrawals. In op stack systems with a proof system, the Guardian can also blacklist dispute games and set the respected game type (permissioned / permissionless)."
      receivedPermissions.1.permission:
-        "guard"
+        "interact"
    }
```

```diff
    EOA  (eth:0x9aA8feACbB42659a806cDD6933ab3982586824F1) {
    +++ description: None
      receivedPermissions.0.description:
+        "Allowed to commit transactions from the current layer to the host chain."
      receivedPermissions.0.permission:
-        "sequence"
+        "interact"
    }
```

```diff
    EOA  (eth:0xD379de941E78Ab394d4D4917FcCE1CC45b6cd620) {
    +++ description: None
      receivedPermissions.0.description:
+        "Allowed to post new state roots of the current layer to the host chain."
      receivedPermissions.0.permission:
-        "propose"
+        "interact"
    }
```

Generated with discovered.json: 0x42dab6958b58d31079004d1f0f6333426235069a

# Diff at Thu, 04 Jun 2026 20:29:53 GMT:

- author: vincfurc (<vincfurc@users.noreply.github.com>)
- comparing to: main@8ad83b88dd9180e282e419267cebe10e93daf01d block: 1779399734
- current timestamp: 1780557929

## Description

Kailua (RISC Zero ZK fault-proof) deployed but not yet active.
DisputeGameFactory registered game type 1337 → KailuaTreasury (`eth:0xc7EaCDd1…`).
OptimismPortal2 and AnchorStateRegistry still have respectedGameType = 1 (PermissionedDisputeGame); cutover requires a separate change.

Ronin KailuaTreasury (v1.2.0, `eth:0xc7EaCDd1…`): verifier extracted to a separate `KAILUA_VERIFIER` proxy, bond accounting reworked. Diff vs BOB v0.1.0 baseline: https://disco.l2beat.com/diff/eth:0xc7EaCDd1E755d2823463Abc4434CA445F752b336/eth:0x9B3E1661bccAF907893B71e4016c01513ae9263C.

RoninConduitOwner got admin over the KailuaVerifier proxy (`eth:0x6b49976a…`), so the verifier proxy is upgradable along the same path as the other OP Stack contracts.

RiscZeroVerifierRouter (`eth:0x8EaB2D97…`) is the shared RISC Zero verifier-selector router. Owner is a TimelockController (`eth:0x0b144E07…`, 3d delay) governed by Safe `eth:0x2E5bcc…`. Both are shared RISC Zero infrastructure, not Ronin-specific.

## Watched changes

```diff
    contract DisputeGameFactory (eth:0x45dA2CD511DA5FEAa535eBF166E628314a65843a) [opstack/DisputeGameFactory] {
    +++ description: The dispute game factory allows the creation of dispute games, used to propose state roots and eventually challenge them.
+++ severity: HIGH
      values.game1337:
-        "eth:0x0000000000000000000000000000000000000000"
+        "eth:0xc7EaCDd1E755d2823463Abc4434CA445F752b336"
    }
```

```diff
    contract Conduit Multisig 1 (eth:0x4a4962275DF8C60a80d3a25faEc5AA7De116A746) [GnosisSafe] {
    +++ description: None
      values.$members.0:
+        "eth:0xcdC931935768c0562AfE989A366a3Dc4d52F4853"
      values.$members.8:
-        "eth:0x3840f487A17A41100DD1Bf0946c34f132a57Fd5f"
    }
```

```diff
    contract RoninConduitOwner (eth:0xE9Ad9723C24d946958f9FD3Bc861BbF983525607) [GnosisSafe] {
    +++ description: 5-of-6 joint Ronin/Conduit Safe.
      receivedPermissions.8:
+        {"permission":"upgrade","from":"eth:0x6b49976a7340D0A3C00d1bEBE0E36E2367D89c7C","role":"admin"}
    }
```

```diff
+   Status: CREATED
    contract TimelockController (eth:0x0b144E07A0826182B6b59788c34b32Bfa86Fb711) [global/TimelockController]
    +++ description: A timelock with access control. The current minimum delay is 3d.
```

```diff
+   Status: CREATED
    contract RiscZeroVerifierEmergencyStop (eth:0x1efDd13f831ceeEa14940806705A53D3211CD698) [risc0/RiscZeroVerifierEmergencyStop]
    +++ description: A verifier wrapper for the eth:0xafB31f5b70623CDF4b20Ada3f7230916A5A79df9 that allows pausing (emergency stop) the verifier by its owner.
```

```diff
+   Status: CREATED
    contract RiscZeroGroth16Verifier (eth:0x20ff7C2Cf391a5F096A2Cc181cb41916680f8E97) [taiko/RiscZeroGroth16Verifier]
    +++ description: Verifier contract for RISC Zero Groth16 proofs (version 2.0.0-rc.3).
```

```diff
+   Status: CREATED
    contract RiscZeroGroth16Verifier (eth:0x2a098988600d87650Fb061FfAff08B97149Fa84D) [taiko/RiscZeroGroth16Verifier]
    +++ description: Verifier contract for RISC Zero Groth16 proofs (version 3.0.0).
```

```diff
+   Status: CREATED
    contract Safe (eth:0x2E5bcc9959dB5F5016F830E47943b07242CB2609) [GnosisSafe]
    +++ description: None
```

```diff
+   Status: CREATED
    contract RiscZeroVerifierEmergencyStop (eth:0x44c220f0598345195cE99AD6A57aDfFcb9Ea33e7) [risc0/RiscZeroVerifierEmergencyStop]
    +++ description: A verifier wrapper for the eth:0xf70aBAb028Eb6F4100A24B203E113D94E87DE93C that allows pausing (emergency stop) the verifier by its owner.
```

```diff
+   Status: CREATED
    contract RiscZeroSetVerifier (eth:0x5005aBa3DFf7C940fcc1e48DccCAD611a80eEB85) [risc0/RiscZeroSetVerifier]
    +++ description: Set verifier contract for RISC Zero proofs (version 0.9.0). It allows verifying a whole set of proofs identified with a Merkle root at once, afterwards each individual proof could be efficiently verified just by checking Merkle inclusion against the verified root.
```

```diff
+   Status: CREATED
    contract RiscZeroGroth16Verifier (eth:0x54aCE3ED46529B4d4F3770C8Bad5dDC48717B9bF) [N/A]
    +++ description: None
```

```diff
+   Status: CREATED
    contract RiscZeroVerifierEmergencyStop (eth:0x68dC2cB4e61774873971c499D9b239ec5Ac540E3) [risc0/RiscZeroVerifierEmergencyStop]
    +++ description: A verifier wrapper for the eth:0x20ff7C2Cf391a5F096A2Cc181cb41916680f8E97 that allows pausing (emergency stop) the verifier by its owner.
```

```diff
+   Status: CREATED
    contract KailuaVerifier (eth:0x6b49976a7340D0A3C00d1bEBE0E36E2367D89c7C) [N/A]
    +++ description: Proxy in front of the Kailua proof verifier; routes verification requests to the canonical RiscZeroVerifierRouter and asserts the chain-specific rollup config and FPVM image ID.
```

```diff
+   Status: CREATED
    contract RiscZeroVerifierEmergencyStop (eth:0x844D5f01161E3559d36f23d0Aa9E9620949aF782) [risc0/RiscZeroVerifierEmergencyStop]
    +++ description: A verifier wrapper for the eth:0x5005aBa3DFf7C940fcc1e48DccCAD611a80eEB85 that allows pausing (emergency stop) the verifier by its owner.
```

```diff
+   Status: CREATED
    contract RiscZeroVerifierRouter (eth:0x8EaB2D97Dfce405A1692a21b3ff3A172d593D319) [risc0/RiscZeroVerifierRouter]
    +++ description: A router proxy that routes to verifiers based on selectors. The mapping can be changed by a permissioned owner (eth:0x0b144E07A0826182B6b59788c34b32Bfa86Fb711).
```

```diff
+   Status: CREATED
    contract RiscZeroVerifierEmergencyStop (eth:0x9F9994Eb4Cb5200198FEfb470f8b50301662e696) [risc0/RiscZeroVerifierEmergencyStop]
    +++ description: A verifier wrapper for the eth:0x2a098988600d87650Fb061FfAff08B97149Fa84D that allows pausing (emergency stop) the verifier by its owner.
```

```diff
+   Status: CREATED
    contract RiscZeroGroth16Verifier (eth:0xafB31f5b70623CDF4b20Ada3f7230916A5A79df9) [taiko/RiscZeroGroth16Verifier]
    +++ description: Verifier contract for RISC Zero Groth16 proofs (version 2.2.0).
```

```diff
+   Status: CREATED
    contract KailuaTreasury (eth:0xc7EaCDd1E755d2823463Abc4434CA445F752b336) [risc0/KailuaTreasury]
    +++ description: Kailua (RISC Zero ZK fault-proof) game implementation registered as game type 1337 in the DisputeGameFactory. Deployed but NOT yet active. Bonds confiscated from eliminated proposers are split 1/3 to the prover, 1/3 to the tournament winner, 1/3 burned.
```

```diff
+   Status: CREATED
    contract RiscZeroVerifierEmergencyStop (eth:0xDa8f3de6fBBdb261Ac771B813a578A7aBdA6B2b1) [risc0/RiscZeroVerifierEmergencyStop]
    +++ description: A verifier wrapper for the eth:0x54aCE3ED46529B4d4F3770C8Bad5dDC48717B9bF that allows pausing (emergency stop) the verifier by its owner.
```

```diff
+   Status: CREATED
    contract RiscZeroGroth16Verifier (eth:0xf70aBAb028Eb6F4100A24B203E113D94E87DE93C) [N/A]
    +++ description: None
```

## Source code changes

```diff
.../projects/roninnetwork/.flat/KailuaTreasury.sol | 3617 ++++++++++++++++++++
 .../.flat/KailuaVerifier/KailuaVerifier.sol        |  509 +++
 .../roninnetwork/.flat/KailuaVerifier/Proxy.p.sol  |  120 +
 ...:0x20ff7C2Cf391a5F096A2Cc181cb41916680f8E97.sol | 1767 ++++++++++
 ...:0x2a098988600d87650Fb061FfAff08B97149Fa84D.sol | 1780 ++++++++++
 ...:0x54aCE3ED46529B4d4F3770C8Bad5dDC48717B9bF.sol | 1779 ++++++++++
 ...:0xafB31f5b70623CDF4b20Ada3f7230916A5A79df9.sol | 1780 ++++++++++
 ...:0xf70aBAb028Eb6F4100A24B203E113D94E87DE93C.sol | 1760 ++++++++++
 .../roninnetwork/.flat/RiscZeroSetVerifier.sol     |  900 +++++
 ...:0x1efDd13f831ceeEa14940806705A53D3211CD698.sol |  366 ++
 ...:0x44c220f0598345195cE99AD6A57aDfFcb9Ea33e7.sol |  366 ++
 ...:0x68dC2cB4e61774873971c499D9b239ec5Ac540E3.sol |  366 ++
 ...:0x844D5f01161E3559d36f23d0Aa9E9620949aF782.sol |  366 ++
 ...:0x9F9994Eb4Cb5200198FEfb470f8b50301662e696.sol |  366 ++
 ...:0xDa8f3de6fBBdb261Ac771B813a578A7aBdA6B2b1.sol |  366 ++
 .../roninnetwork/.flat/RiscZeroVerifierRouter.sol  |  282 ++
 .../src/projects/roninnetwork/.flat/Safe/Safe.sol  | 1216 +++++++
 .../roninnetwork/.flat/Safe/SafeProxy.p.sol        |   42 +
 .../roninnetwork/.flat/TimelockController.sol      | 1111 ++++++
 19 files changed, 18859 insertions(+)
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 1779399734 (main branch discovery), not current.

```diff
    contract OptimismPortal2 (eth:0x652CD53eCf9466E5Fb00D0E11d6CBf6469a56D77) [opstack/OptimismPortal2] {
    +++ description: The OptimismPortal contract is the main entry point to deposit funds from L1 to L2. It also allows to prove and finalize withdrawals. It specifies which game type can be used for withdrawals, which currently is the PermissionedDisputeGame.
      usedTypes.0.arg.621:
+        "AggregateVerifier"
    }
```

```diff
    contract RoninConduitOwner (eth:0xE9Ad9723C24d946958f9FD3Bc861BbF983525607) [GnosisSafe] {
    +++ description: 5-of-6 joint Ronin/Conduit Safe.
      name:
-        "Safe"
+        "RoninConduitOwner"
      description:
+        "5-of-6 joint Ronin/Conduit Safe."
    }
```

Generated with discovered.json: 0xb249eb2d3cd58c2b0e7671ced0b0d72c1f5a5a21

# Diff at Thu, 21 May 2026 21:43:21 GMT:

- author: vincfurc (<vincfurc@users.noreply.github.com>)
- comparing to: main@af480cdcac217110f9e99ef400ba0185c35a6c55 block: 1779204482
- current timestamp: 1779399734

## Description

ProxyAdminOwner / `owner` rotated from Conduit Multisig 1 to a new 5-of-6 Safe (`eth:0xE9Ad9723…`) that is a joint Ronin/Conduit multisig (per Ronin team: 4 Ronin signers + 2 Conduit signers retained from Conduit Multisig 1). Affects AnchorStateRegistry, L1ERC721Bridge, DisputeGameFactory (owner + proxyAdminOwner), and the other Ronin contracts under that ProxyAdmin.

## Watched changes

```diff
    contract AnchorStateRegistry (eth:0x0B95fF1d1B113bac3E29Ac0BBF2089126C9aE81A) [opstack/AnchorStateRegistry_post13] {
    +++ description: Contains the latest confirmed state root that can be used as a starting point in a dispute game. It specifies which game type can be used for withdrawals, which currently is the PermissionedDisputeGame.
      values.proxyAdminOwner:
-        "eth:0x4a4962275DF8C60a80d3a25faEc5AA7De116A746"
+        "eth:0xE9Ad9723C24d946958f9FD3Bc861BbF983525607"
    }
```

```diff
    contract L1ERC721Bridge (eth:0x3a63087B36Ad5a2fD89C7C8517832dE067Fe4959) [opstack/L1ERC721Bridge] {
    +++ description: Used to bridge ERC-721 tokens from host chain to this chain.
      values.proxyAdminOwner:
-        "eth:0x4a4962275DF8C60a80d3a25faEc5AA7De116A746"
+        "eth:0xE9Ad9723C24d946958f9FD3Bc861BbF983525607"
    }
```

```diff
    contract DisputeGameFactory (eth:0x45dA2CD511DA5FEAa535eBF166E628314a65843a) [opstack/DisputeGameFactory] {
    +++ description: The dispute game factory allows the creation of dispute games, used to propose state roots and eventually challenge them.
      values.owner:
-        "eth:0x4a4962275DF8C60a80d3a25faEc5AA7De116A746"
+        "eth:0xE9Ad9723C24d946958f9FD3Bc861BbF983525607"
      values.proxyAdminOwner:
-        "eth:0x4a4962275DF8C60a80d3a25faEc5AA7De116A746"
+        "eth:0xE9Ad9723C24d946958f9FD3Bc861BbF983525607"
    }
```

```diff
    contract Conduit Multisig 1 (eth:0x4a4962275DF8C60a80d3a25faEc5AA7De116A746) [GnosisSafe] {
    +++ description: None
      receivedPermissions.2:
-        {"permission":"interact","from":"eth:0x6FFbcf498CcF81111f397fa6065dEA13A47E573C","description":"set and change address mappings.","role":".owner","via":[{"address":"eth:0x757077Ddf12B652430DCE8fF3e4c749F5Ca861fC"}]}
      receivedPermissions.3:
-        {"permission":"interact","from":"eth:0xc4f4F908C36C8119f1FBd52CebbDB30C6f2a23C1","description":"it can update the preconfer address, the batch submitter (Sequencer) address and the gas configuration of the system.","role":".owner"}
      receivedPermissions.4:
-        {"permission":"upgrade","from":"eth:0x0B95fF1d1B113bac3E29Ac0BBF2089126C9aE81A","role":"admin","via":[{"address":"eth:0x757077Ddf12B652430DCE8fF3e4c749F5Ca861fC"}]}
      receivedPermissions.5:
-        {"permission":"upgrade","from":"eth:0x3a63087B36Ad5a2fD89C7C8517832dE067Fe4959","role":"admin","via":[{"address":"eth:0x757077Ddf12B652430DCE8fF3e4c749F5Ca861fC"}]}
      receivedPermissions.6:
-        {"permission":"upgrade","from":"eth:0x45dA2CD511DA5FEAa535eBF166E628314a65843a","role":"admin","via":[{"address":"eth:0x757077Ddf12B652430DCE8fF3e4c749F5Ca861fC"}]}
      receivedPermissions.7:
-        {"permission":"upgrade","from":"eth:0x51639D151456d0384285C6974e441A5D2B784B7D","role":"admin","via":[{"address":"eth:0x757077Ddf12B652430DCE8fF3e4c749F5Ca861fC"}]}
      receivedPermissions.8:
-        {"permission":"upgrade","from":"eth:0x652CD53eCf9466E5Fb00D0E11d6CBf6469a56D77","role":"admin","via":[{"address":"eth:0x757077Ddf12B652430DCE8fF3e4c749F5Ca861fC"}]}
      receivedPermissions.9:
-        {"permission":"upgrade","from":"eth:0x69Fcd2E75af364295EaF48Dc058338F80CFfb434","role":"admin","via":[{"address":"eth:0x757077Ddf12B652430DCE8fF3e4c749F5Ca861fC"}]}
      receivedPermissions.10:
-        {"permission":"upgrade","from":"eth:0x85Ce2Ccef125aa8d018c298d5eA0f2FB5E5063c1","description":"upgrading the bridge implementation can give access to all funds escrowed therein.","role":".$admin","via":[{"address":"eth:0x757077Ddf12B652430DCE8fF3e4c749F5Ca861fC"}]}
      receivedPermissions.11:
-        {"permission":"upgrade","from":"eth:0xc4f4F908C36C8119f1FBd52CebbDB30C6f2a23C1","role":"admin","via":[{"address":"eth:0x757077Ddf12B652430DCE8fF3e4c749F5Ca861fC"}]}
      receivedPermissions.12:
-        {"permission":"upgrade","from":"eth:0xEE552e802A50d855bD08E93dfcc69228FC7B9E2c","role":"admin","via":[{"address":"eth:0x502e993a5aFC9fE59b00B07ee500729D71092E34"}]}
      receivedPermissions.13:
-        {"permission":"upgrade","from":"eth:0xF9aD628d9F907ad5d46Ab80100dacDf09EAc9A8e","role":"admin","via":[{"address":"eth:0x757077Ddf12B652430DCE8fF3e4c749F5Ca861fC"}]}
      directlyReceivedPermissions:
-        [{"permission":"act","from":"eth:0x502e993a5aFC9fE59b00B07ee500729D71092E34","role":".owner"},{"permission":"act","from":"eth:0x757077Ddf12B652430DCE8fF3e4c749F5Ca861fC","role":".owner"}]
    }
```

```diff
    contract ProxyAdmin (eth:0x502e993a5aFC9fE59b00B07ee500729D71092E34) [global/ProxyAdmin] {
    +++ description: None
      values.owner:
-        "eth:0x4a4962275DF8C60a80d3a25faEc5AA7De116A746"
+        "eth:0xE9Ad9723C24d946958f9FD3Bc861BbF983525607"
    }
```

```diff
    contract OptimismPortal2 (eth:0x652CD53eCf9466E5Fb00D0E11d6CBf6469a56D77) [opstack/OptimismPortal2] {
    +++ description: The OptimismPortal contract is the main entry point to deposit funds from L1 to L2. It also allows to prove and finalize withdrawals. It specifies which game type can be used for withdrawals, which currently is the PermissionedDisputeGame.
      values.proxyAdminOwner:
-        "eth:0x4a4962275DF8C60a80d3a25faEc5AA7De116A746"
+        "eth:0xE9Ad9723C24d946958f9FD3Bc861BbF983525607"
    }
```

```diff
    contract DelayedWETH (eth:0x69Fcd2E75af364295EaF48Dc058338F80CFfb434) [opstack/DelayedWETH] {
    +++ description: Contract designed to hold the bonded ETH for each game. It is designed as a wrapper around WETH to allow an owner to function as a backstop if a game would incorrectly distribute funds.
      values.proxyAdminOwner:
-        "eth:0x4a4962275DF8C60a80d3a25faEc5AA7De116A746"
+        "eth:0xE9Ad9723C24d946958f9FD3Bc861BbF983525607"
    }
```

```diff
    contract ProxyAdmin (eth:0x757077Ddf12B652430DCE8fF3e4c749F5Ca861fC) [global/ProxyAdmin] {
    +++ description: None
      values.owner:
-        "eth:0x4a4962275DF8C60a80d3a25faEc5AA7De116A746"
+        "eth:0xE9Ad9723C24d946958f9FD3Bc861BbF983525607"
    }
```

```diff
    contract L1StandardBridge (eth:0x85Ce2Ccef125aa8d018c298d5eA0f2FB5E5063c1) [opstack/L1StandardBridge] {
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain.
      values.proxyAdminOwner:
-        "eth:0x4a4962275DF8C60a80d3a25faEc5AA7De116A746"
+        "eth:0xE9Ad9723C24d946958f9FD3Bc861BbF983525607"
    }
```

```diff
    contract SystemConfig (eth:0xc4f4F908C36C8119f1FBd52CebbDB30C6f2a23C1) [opstack/SystemConfig] {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      values.owner:
-        "eth:0x4a4962275DF8C60a80d3a25faEc5AA7De116A746"
+        "eth:0xE9Ad9723C24d946958f9FD3Bc861BbF983525607"
      values.proxyAdminOwner:
-        "eth:0x4a4962275DF8C60a80d3a25faEc5AA7De116A746"
+        "eth:0xE9Ad9723C24d946958f9FD3Bc861BbF983525607"
    }
```

```diff
    contract SuperchainConfig (eth:0xEE552e802A50d855bD08E93dfcc69228FC7B9E2c) [opstack/SuperchainConfigFake_expiry] {
    +++ description: This is NOT the shared SuperchainConfig contract of the OP stack Superchain but rather a local fork. It manages pause states for each chain connected to it, as well as a global pause state for all chains. The guardian role can pause either separately, but each pause expires after 3mo 1d if left untouched.
      values.proxyAdminOwner:
-        "eth:0x4a4962275DF8C60a80d3a25faEc5AA7De116A746"
+        "eth:0xE9Ad9723C24d946958f9FD3Bc861BbF983525607"
    }
```

```diff
    contract L1CrossDomainMessenger (eth:0xF9aD628d9F907ad5d46Ab80100dacDf09EAc9A8e) [opstack/L1CrossDomainMessenger] {
    +++ description: Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function.
      values.proxyAdminOwner:
-        "eth:0x4a4962275DF8C60a80d3a25faEc5AA7De116A746"
+        "eth:0xE9Ad9723C24d946958f9FD3Bc861BbF983525607"
    }
```

```diff
+   Status: CREATED
    contract PreimageOracle (eth:0x1fb8cdFc6831fc866Ed9C51aF8817Da5c287aDD3) [opstack/PreimageOracle]
    +++ description: The PreimageOracle contract is used to load the required data from L1 for a dispute game.
```

```diff
+   Status: CREATED
    contract MIPS (eth:0x6463dEE3828677F6270d83d45408044fc5eDB908) [opstack/MIPS]
    +++ description: The MIPS contract is used to execute the final step of the dispute game which objectively determines the winner of the dispute.
```

```diff
+   Status: CREATED
    contract Safe (eth:0xE9Ad9723C24d946958f9FD3Bc861BbF983525607) [GnosisSafe]
    +++ description: None
```

## Source code changes

```diff
.../src/projects/roninnetwork/.flat/MIPS.sol       | 3274 ++++++++++++++++++++
 .../projects/roninnetwork/.flat/PreimageOracle.sol | 1463 +++++++++
 .../src/projects/roninnetwork/.flat/Safe/Safe.sol  | 1216 ++++++++
 .../roninnetwork/.flat/Safe/SafeProxy.p.sol        |   42 +
 4 files changed, 5995 insertions(+)
```

Generated with discovered.json: 0xea0a603c0f304f12e8c7a1b9e5047758ae7f946b

# Diff at Mon, 18 May 2026 09:19:34 GMT:

- author: vincfurc (<vincfurc@users.noreply.github.com>)
- current timestamp: 1779095885

## Description

Initial discovery.

## Initial discovery

```diff
+   Status: CREATED
    contract AnchorStateRegistry (eth:0x0B95fF1d1B113bac3E29Ac0BBF2089126C9aE81A) [opstack/AnchorStateRegistry_post13]
    +++ description: Contains the latest confirmed state root that can be used as a starting point in a dispute game. It specifies which game type can be used for withdrawals, which currently is the PermissionedDisputeGame.
```

```diff
+   Status: CREATED
    contract MainchainBridgeManager (eth:0x2Cf3CFb17774Ce0CFa34bB3f3761904e7fc3FaDB) [N/A]
    +++ description: Governance and proxy-admin contract for the legacy MainchainGateway bridge. Holds the operator/governor set, tallies stake-weighted votes for bridge proposals (operator rotations, threshold changes, withdrawals).
```

```diff
+   Status: CREATED
    contract L1ERC721Bridge (eth:0x3a63087B36Ad5a2fD89C7C8517832dE067Fe4959) [opstack/L1ERC721Bridge]
    +++ description: Used to bridge ERC-721 tokens from host chain to this chain.
```

```diff
+   Status: CREATED
    contract DisputeGameFactory (eth:0x45dA2CD511DA5FEAa535eBF166E628314a65843a) [opstack/DisputeGameFactory]
    +++ description: The dispute game factory allows the creation of dispute games, used to propose state roots and eventually challenge them.
```

```diff
+   Status: CREATED
    contract Conduit Multisig 1 (eth:0x4a4962275DF8C60a80d3a25faEc5AA7De116A746) [GnosisSafe]
    +++ description: None
```

```diff
+   Status: CREATED
    contract ProxyAdmin (eth:0x502e993a5aFC9fE59b00B07ee500729D71092E34) [global/ProxyAdmin]
    +++ description: None
```

```diff
+   Status: CREATED
    contract OptimismMintableERC20Factory (eth:0x51639D151456d0384285C6974e441A5D2B784B7D) [opstack/OptimismMintableERC20Factory]
    +++ description: A helper contract that generates OptimismMintableERC20 contracts on the network it's deployed to. OptimismMintableERC20 is a standard extension of the base ERC20 token contract designed to allow the L1StandardBridge contracts to mint and burn tokens. This makes it possible to use an OptimismMintableERC20 as this chain's representation of a token on the host chain, or vice-versa.
```

```diff
+   Status: CREATED
    contract LegacyBridgeOwner (eth:0x51F6696Ae42C6C40CA9F5955EcA2aaaB1Cefb26e) [GnosisSafe]
    +++ description: None
```

```diff
+   Status: CREATED
    contract PermissionedDisputeGame (eth:0x58bf355C5d4EdFc723eF89d99582ECCfd143266A) [opstack/PermissionedDisputeGame]
    +++ description: Same as FaultDisputeGame, but only two permissioned addresses are designated as proposer and challenger.
```

```diff
+   Status: CREATED
    contract MainchainGateway (eth:0x64192819Ac13Ef72bF6b5AE239AC672B43a9AF08) [N/A]
    +++ description: Legacy multi-sig-secured Ronin bridge contract holding the L1 side of deposits made before the April 2025 Chainlink CCIP migration. Still custodies residual user balances (ETH backing legacy WETH on Ronin, the deprecated WBTC contract, and dust). Withdrawals authorised by the Ronin BridgeOperator stake-weighted threshold via MainchainBridgeManager.
```

```diff
+   Status: CREATED
    contract OptimismPortal2 (eth:0x652CD53eCf9466E5Fb00D0E11d6CBf6469a56D77) [opstack/OptimismPortal2]
    +++ description: The OptimismPortal contract is the main entry point to deposit funds from L1 to L2. It also allows to prove and finalize withdrawals. It specifies which game type can be used for withdrawals, which currently is the PermissionedDisputeGame.
```

```diff
+   Status: CREATED
    contract DelayedWETH (eth:0x69Fcd2E75af364295EaF48Dc058338F80CFfb434) [opstack/DelayedWETH]
    +++ description: Contract designed to hold the bonded ETH for each game. It is designed as a wrapper around WETH to allow an owner to function as a backstop if a game would incorrectly distribute funds.
```

```diff
+   Status: CREATED
    contract AddressManager (eth:0x6FFbcf498CcF81111f397fa6065dEA13A47E573C) [opstack/AddressManager]
    +++ description: Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts.
```

```diff
+   Status: CREATED
    contract ProxyAdmin (eth:0x757077Ddf12B652430DCE8fF3e4c749F5Ca861fC) [global/ProxyAdmin]
    +++ description: None
```

```diff
+   Status: CREATED
    contract L1StandardBridge (eth:0x85Ce2Ccef125aa8d018c298d5eA0f2FB5E5063c1) [opstack/L1StandardBridge]
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain.
```

```diff
+   Status: CREATED
    contract Wrapped Ether Token (eth:0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2) [N/A]
    +++ description: None
```

```diff
+   Status: CREATED
    contract SystemConfig (eth:0xc4f4F908C36C8119f1FBd52CebbDB30C6f2a23C1) [opstack/SystemConfig]
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
```

```diff
+   Status: CREATED
    contract SuperchainConfig (eth:0xEE552e802A50d855bD08E93dfcc69228FC7B9E2c) [opstack/SuperchainConfigFake_expiry]
    +++ description: This is NOT the shared SuperchainConfig contract of the OP stack Superchain but rather a local fork. It manages pause states for each chain connected to it, as well as a global pause state for all chains. The guardian role can pause either separately, but each pause expires after 3mo 1d if left untouched.
```

```diff
+   Status: CREATED
    contract PauseEnforcer (eth:0xF184a6Cd470Cac2CF5cD4fBa34e20D482D6A6062) [N/A]
    +++ description: Immutable emergency-pause contract for the legacy MainchainGateway. Holders of the SENTRY_ROLE can flip MainchainGateway into a paused state to halt deposits and withdrawals in an emergency.
```

```diff
+   Status: CREATED
    contract L1CrossDomainMessenger (eth:0xF9aD628d9F907ad5d46Ab80100dacDf09EAc9A8e) [opstack/L1CrossDomainMessenger]
    +++ description: Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function.
```
