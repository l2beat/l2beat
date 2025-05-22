Generated with discovered.json: 0x3f690191525a5f77be58b6828f40f505b7163581

# Diff at Mon, 12 May 2025 12:17:17 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@43865580b95b7ff3abb4f43944aed50cc5d69ee3 block: 22438139
- current block number: 22467145

## Description

vkeys updated.

## Watched changes

```diff
    contract OPSuccinctL2OutputOracle (0xb45440830bd8D288bB2B5B01Be303ae60fc855d8) {
    +++ description: Contains a list of proposed state roots which Proposers assert to be a result of block execution. The SuccinctL2OutputOracle modifies the L2OutputOracle to support whenNotOptimistic mode, in which a validity proof can be passed as input argument to the proposeL2Output function.
      values.aggregationVkey:
-        "0x001af5448a91ee21b97b3efdea14deb54acca359d368628d21bb4b14adabe552"
+        "0x00a4fec570ddb93572e5312e1debb095562fea9ae099622c6f7c9d145d87517f"
      values.rangeVkeyCommitment:
-        "0x5c50d96d27a21e1a4c24736d404c7ead0f4ee056517bbe2c32e2557a5bb44436"
+        "0x5614b4dc4d7a1c33681c404a27aa1db265ea84b75047859667fed5a303a8dc43"
    }
```

Generated with discovered.json: 0x3739031654784ad577eb4fe7552c5a0cd3a28bf8

# Diff at Fri, 09 May 2025 10:09:10 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@c3a1d49c07f4092914d62c65181e5fec18a88318 block: 22438139
- current block number: 22438139

## Description

Config related: Move IFs to the editable string for condition configs (yeet IFs from the automatic resolver).

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22438139 (main branch discovery), not current.

```diff
    EOA Optimism EOA 1 (0x352f1defB49718e7Ea411687E850aA8d6299F7aC) {
    +++ description: None
      receivedPermissions.2.via.0.condition:
-        "restricted to the global pause function"
+        "though restricted to the global pause function"
      receivedPermissions.1.via.3.condition:
-        "not revoked by the Security Council"
+        "if not revoked by the Security Council"
      receivedPermissions.1.via.1.address:
-        "0x126a736B18E0a64fBA19D421647A530E327E112C"
+        "0x09f7150D8c019BeF34450d6920f6B3608ceFdAf2"
      receivedPermissions.1.via.1.condition:
-        "restricted to the global pause function"
      receivedPermissions.1.via.0.address:
-        "0x09f7150D8c019BeF34450d6920f6B3608ceFdAf2"
+        "0x126a736B18E0a64fBA19D421647A530E327E112C"
      receivedPermissions.1.via.0.condition:
+        "though restricted to the global pause function"
      receivedPermissions.0.via.0.condition:
-        "restricted to the global pause function"
+        "though restricted to the global pause function"
      directlyReceivedPermissions.0.condition:
-        "restricted to the global pause function"
+        "though restricted to the global pause function"
    }
```

```diff
    contract OpFoundationUpgradeSafe (0x847B5c174615B1B7fDF770882256e2D3E95b9D92) {
    +++ description: None
      receivedPermissions.0.via.0.condition:
-        "the number of 0xc2819DC788505Aac350142A7A707BF9D03E3Bd03 members falls below 8."
+        "if the number of 0xc2819DC788505Aac350142A7A707BF9D03E3Bd03 members falls below 8."
      directlyReceivedPermissions.0.condition:
-        "the number of 0xc2819DC788505Aac350142A7A707BF9D03E3Bd03 members falls below 8."
+        "if the number of 0xc2819DC788505Aac350142A7A707BF9D03E3Bd03 members falls below 8."
    }
```

```diff
    contract OpFoundationOperationsSafe (0x9BA6e03D8B90dE867373Db8cF1A58d2F7F006b3A) {
    +++ description: None
      receivedPermissions.1.via.1.condition:
-        "not revoked by the Security Council"
+        "if not revoked by the Security Council"
      directlyReceivedPermissions.0.condition:
-        "not revoked by the Security Council"
+        "if not revoked by the Security Council"
    }
```

Generated with discovered.json: 0x86de04e8c2bd9466cd43bdf8141b1d819fb2a890

# Diff at Thu, 08 May 2025 10:53:13 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@ac8d52c849084548030762e31e48a2eb3c90bf3e block: 22188866
- current block number: 22438139

## Description

OPSuccinctL2OutputOracle upgraded (minor changes).

superchain guardian connected, but not full superchain gov.

OP stack DeputyPauser upgrade (see op mainnet for more info).

## Watched changes

```diff
    contract OpFoundationOperationsSafe (0x9BA6e03D8B90dE867373Db8cF1A58d2F7F006b3A) {
    +++ description: None
      values.getModules.0:
+        "0x126a736B18E0a64fBA19D421647A530E327E112C"
      values.GnosisSafe_modules.0:
+        "0x126a736B18E0a64fBA19D421647A530E327E112C"
      receivedPermissions.2:
+        {"permission":"guard","from":"0x96B124841Eff4Ab1b3C1F654D60402a1405fF51A"}
      receivedPermissions.1.from:
-        "0x96B124841Eff4Ab1b3C1F654D60402a1405fF51A"
+        "0x95703e0982140D16f8ebA6d158FccEde42f04a4C"
      receivedPermissions.1.via:
+        [{"address":"0x09f7150D8c019BeF34450d6920f6B3608ceFdAf2"},{"address":"0xc6901F65369FC59fC1B4D6D6bE7A2318Ff38dB5B","condition":"not revoked by the Security Council"}]
      directlyReceivedPermissions:
+        [{"permission":"act","from":"0xc6901F65369FC59fC1B4D6D6bE7A2318Ff38dB5B","condition":"not revoked by the Security Council"}]
    }
```

```diff
    contract OPSuccinctL2OutputOracle (0xb45440830bd8D288bB2B5B01Be303ae60fc855d8) {
    +++ description: Contains a list of proposed state roots which Proposers assert to be a result of block execution. The SuccinctL2OutputOracle modifies the L2OutputOracle to support whenNotOptimistic mode, in which a validity proof can be passed as input argument to the proposeL2Output function.
      sourceHashes.1:
-        "0x709a766c251331fb7c079ad2f2bd400a1e94ef7a1cbb118dc889fd93d8233165"
+        "0x0cbf9fd4f1cadeb8c5634791b6829ce6dd91e6f46e87df410020715870a92006"
      values.$implementation:
-        "0xE41997Df2A412ed5B56ac9f3997A72B6BeE9d888"
+        "0xd010fBdBd77a3314bCED75E1AE8E7aDD42c9d580"
      values.$pastUpgrades.2:
+        ["2024-12-16T22:15:47.000Z","0x8eee30c3b3f633d3e3c94e00a250bd324e2da6863f227acac127cb6cbc668f85",["0x35A37B01CeCb9544a72e251328F9B36F98b023B1"]]
      values.$pastUpgrades.1.2:
-        "0x8eee30c3b3f633d3e3c94e00a250bd324e2da6863f227acac127cb6cbc668f85"
+        "2025-05-07T08:36:11.000Z"
      values.$pastUpgrades.1.1:
-        "2024-12-16T22:15:47.000Z"
+        ["0xd010fBdBd77a3314bCED75E1AE8E7aDD42c9d580"]
      values.$pastUpgrades.1.0:
-        ["0x35A37B01CeCb9544a72e251328F9B36F98b023B1"]
+        "0x82e8aeceec726d7cf643b1a548090bfa12bca8fdb7443cdc9a3a4e0d25793c19"
      values.$upgradeCount:
-        2
+        3
      values.aggregationVkey:
-        "0x004f113a89b4e8d162197047643c9d710b42a30e7da7052703855d5c4716a81d"
+        "0x001af5448a91ee21b97b3efdea14deb54acca359d368628d21bb4b14adabe552"
      values.rangeVkeyCommitment:
-        "0x1dfce47807a22e50513d7a9a130af9de3d1844625b54c4815e46ca5437eb9ba9"
+        "0x5c50d96d27a21e1a4c24736d404c7ead0f4ee056517bbe2c32e2557a5bb44436"
      values.rollupConfigHash:
-        "0xb687221eb250467cf026eaaeef39f33ca2af3ebea6c8eaabc7c7a2634d111ccd"
+        "0x2aee88f2b7f9f1edfab6c535edeb8a7d969c162fe974650fc3c1e4d3c75ecb8b"
      values.version:
-        "v1.0.0-rc2"
+        "v2.0.0"
      implementationNames.0xE41997Df2A412ed5B56ac9f3997A72B6BeE9d888:
-        "OPSuccinctL2OutputOracle"
      implementationNames.0xd010fBdBd77a3314bCED75E1AE8E7aDD42c9d580:
+        "OPSuccinctL2OutputOracle"
    }
```

```diff
+   Status: CREATED
    contract LivenessModule (0x0454092516c9A4d636d3CAfA1e82161376C8a748)
    +++ description: used to remove members inactive for 98d while making sure that the threshold remains above 75%. If the number of members falls below 8, the 0x847B5c174615B1B7fDF770882256e2D3E95b9D92 takes ownership of the multisig
```

```diff
+   Status: CREATED
    contract Optimism Guardian Multisig (0x09f7150D8c019BeF34450d6920f6B3608ceFdAf2)
    +++ description: None
```

```diff
+   Status: CREATED
    contract DeputyPauseModule (0x126a736B18E0a64fBA19D421647A530E327E112C)
    +++ description: Allows 0x352f1defB49718e7Ea411687E850aA8d6299F7aC, called the deputy pauser, to act on behalf of the 0x9BA6e03D8B90dE867373Db8cF1A58d2F7F006b3A if set as its Safe module.
```

```diff
+   Status: CREATED
    contract LivenessGuard (0x24424336F04440b1c28685a38303aC33C9D14a25)
    +++ description: None
```

```diff
+   Status: CREATED
    contract SuperchainProxyAdmin (0x543bA4AADBAb8f9025686Bd03993043599c6fB04)
    +++ description: None
```

```diff
+   Status: CREATED
    contract SuperchainProxyAdminOwner (0x5a0Aae59D09fccBdDb6C6CcEB07B7279367C3d2A)
    +++ description: None
```

```diff
+   Status: CREATED
    contract OpFoundationUpgradeSafe (0x847B5c174615B1B7fDF770882256e2D3E95b9D92)
    +++ description: None
```

```diff
+   Status: CREATED
    contract SuperchainConfig (0x95703e0982140D16f8ebA6d158FccEde42f04a4C)
    +++ description: Used to manage global configuration values for multiple OP Chains within a single Superchain network. The SuperchainConfig contract manages the `PAUSED_SLOT`, a boolean value indicating whether the Superchain is paused, and `GUARDIAN_SLOT`, the address of the guardian which can pause and unpause the system.
```

```diff
+   Status: CREATED
    contract Optimism Security Council (0xc2819DC788505Aac350142A7A707BF9D03E3Bd03)
    +++ description: None
```

```diff
+   Status: CREATED
    contract DeputyGuardianModule (0xc6901F65369FC59fC1B4D6D6bE7A2318Ff38dB5B)
    +++ description: allows the 0x9BA6e03D8B90dE867373Db8cF1A58d2F7F006b3A, called the deputy guardian, to act on behalf of the Gnosis Safe.
```

```diff
+   Status: CREATED
    contract AddressManager (0xdE1FCfB0851916CA5101820A69b13a4E276bd81F)
    +++ description: Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts.
```

## Source code changes

```diff
...0x51D5C516c818dcf63E67B28cB2516166D8578c06.sol} |    0
 ...-0xdE1FCfB0851916CA5101820A69b13a4E276bd81F.sol |  152 +++
 .../phala/ethereum/.flat/DeputyGuardianModule.sol  |  156 +++
 .../phala/ethereum/.flat/DeputyPauseModule.sol     | 1338 ++++++++++++++++++++
 .../phala/ethereum/.flat/LivenessGuard.sol         |  582 +++++++++
 .../phala/ethereum/.flat/LivenessModule.sol        |  258 ++++
 .../OPSuccinctL2OutputOracle.sol                   |   69 +-
 .../.flat/OpFoundationUpgradeSafe/GnosisSafe.sol   |  953 ++++++++++++++
 .../OpFoundationUpgradeSafe/GnosisSafeProxy.p.sol  |   35 +
 .../Optimism Guardian Multisig/GnosisSafe.sol      |  953 ++++++++++++++
 .../GnosisSafeProxy.p.sol                          |   35 +
 .../.flat/Optimism Security Council/GnosisSafe.sol |  953 ++++++++++++++
 .../GnosisSafeProxy.p.sol                          |   35 +
 .../Proxy.p.sol                                    |    0
 .../SuperchainConfig.sol                           |  477 +++++++
 .../Proxy.p.sol                                    |  200 +++
 .../SuperchainConfig.sol                           |    0
 .../phala/ethereum/.flat/SuperchainProxyAdmin.sol  |  298 +++++
 .../.flat/SuperchainProxyAdminOwner/GnosisSafe.sol |  953 ++++++++++++++
 .../GnosisSafeProxy.p.sol                          |   35 +
 20 files changed, 7462 insertions(+), 20 deletions(-)
```

Generated with discovered.json: 0x706aae3242decc857baf3011b5ee440f7bb9a74a

# Diff at Tue, 29 Apr 2025 08:19:09 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@ef7477af00fe0b57a2f7cacf7e958c12494af662 block: 22188866
- current block number: 22188866

## Description

Field .issuedPermissions is removed from the output as no longer needed. Added 'permissionsConfigHash' due to refactoring of the modelling process (into a separate command).

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22188866 (main branch discovery), not current.

```diff
    contract SP1VerifierGateway (0x3B6041173B80E77f038f3F2C0f9744f04837185e) {
    +++ description: This contract is the router for zk proof verification. It stores the mapping between identifiers and the address of onchain verifier contracts, routing each identifier to the corresponding verifier contract.
      issuedPermissions:
-        [{"permission":"interact","to":"0xCafEf00d348Adbd57c37d1B77e0619C6244C6878","description":"holds the power to affect the liveness and safety of the gateway - can transfer ownership, add and freeze verifier routes.","via":[]}]
    }
```

```diff
    contract AddressManager (0x51D5C516c818dcf63E67B28cB2516166D8578c06) {
    +++ description: Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts.
      issuedPermissions:
-        [{"permission":"interact","to":"0x4a4962275DF8C60a80d3a25faEc5AA7De116A746","description":"set and change address mappings.","via":[{"address":"0x198A8e0c220f29d8aF956e4c8A9E8b552096Ab2E"}]}]
    }
```

```diff
    contract L1StandardBridge (0x6A3444d11cA2697fe4A19AC8995ABDd8Dd301521) {
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain.
      issuedPermissions:
-        [{"permission":"upgrade","to":"0x4a4962275DF8C60a80d3a25faEc5AA7De116A746","description":"upgrading the bridge implementation can give access to all funds escrowed therein.","via":[{"address":"0x198A8e0c220f29d8aF956e4c8A9E8b552096Ab2E"}]}]
    }
```

```diff
    contract OptimismPortal (0x96B124841Eff4Ab1b3C1F654D60402a1405fF51A) {
    +++ description: The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals.
      issuedPermissions:
-        [{"permission":"guard","to":"0x9BA6e03D8B90dE867373Db8cF1A58d2F7F006b3A","via":[]},{"permission":"upgrade","to":"0x4a4962275DF8C60a80d3a25faEc5AA7De116A746","via":[{"address":"0x198A8e0c220f29d8aF956e4c8A9E8b552096Ab2E"}]}]
    }
```

```diff
    contract L1ERC721Bridge (0xa010dE167788ed7d95c770AC478997D3207236AF) {
    +++ description: Used to bridge ERC-721 tokens from host chain to this chain.
      issuedPermissions:
-        [{"permission":"upgrade","to":"0x4a4962275DF8C60a80d3a25faEc5AA7De116A746","via":[{"address":"0x198A8e0c220f29d8aF956e4c8A9E8b552096Ab2E"}]}]
    }
```

```diff
    contract OPSuccinctL2OutputOracle (0xb45440830bd8D288bB2B5B01Be303ae60fc855d8) {
    +++ description: Contains a list of proposed state roots which Proposers assert to be a result of block execution. The SuccinctL2OutputOracle modifies the L2OutputOracle to support whenNotOptimistic mode, in which a validity proof can be passed as input argument to the proposeL2Output function.
      issuedPermissions:
-        [{"permission":"interact","to":"0x4a4962275DF8C60a80d3a25faEc5AA7De116A746","description":"can toggle between the optimistic mode and not optimistic (ZK) mode.","via":[]},{"permission":"upgrade","to":"0x4a4962275DF8C60a80d3a25faEc5AA7De116A746","via":[{"address":"0x198A8e0c220f29d8aF956e4c8A9E8b552096Ab2E"}]}]
    }
```

```diff
    contract SystemConfig (0xeBf5859b7646ca9cf8A981613569bF28394F2571) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      issuedPermissions:
-        [{"permission":"interact","to":"0x4a4962275DF8C60a80d3a25faEc5AA7De116A746","description":"it can update the preconfer address, the batch submitter (Sequencer) address and the gas configuration of the system.","via":[]},{"permission":"sequence","to":"0x9Fb23129982c993743Eb9bB156af8CC8Fa2aC761","via":[]},{"permission":"upgrade","to":"0x4a4962275DF8C60a80d3a25faEc5AA7De116A746","via":[{"address":"0x198A8e0c220f29d8aF956e4c8A9E8b552096Ab2E"}]}]
    }
```

```diff
    contract SuperchainConfig (0xeDe0D2f74e71bD43459e92D90c434D8cA5E597B8) {
    +++ description: This is NOT the shared SuperchainConfig contract of the OP stack Superchain but rather a local fork. It manages the `PAUSED_SLOT`, a boolean value indicating whether the local chain is paused, and `GUARDIAN_SLOT`, the address of the guardian which can pause and unpause the system.
      issuedPermissions:
-        [{"permission":"guard","to":"0x9BA6e03D8B90dE867373Db8cF1A58d2F7F006b3A","via":[]},{"permission":"upgrade","to":"0x4a4962275DF8C60a80d3a25faEc5AA7De116A746","via":[{"address":"0x198A8e0c220f29d8aF956e4c8A9E8b552096Ab2E"}]}]
    }
```

```diff
    contract OptimismMintableERC20Factory (0xF8e8E783fa7A5CCDB77EddC3335cDb00066B515e) {
    +++ description: A helper contract that generates OptimismMintableERC20 contracts on the network it's deployed to. OptimismMintableERC20 is a standard extension of the base ERC20 token contract designed to allow the L1StandardBridge contracts to mint and burn tokens. This makes it possible to use an OptimismMintablERC20 as this chain's representation of a token on the host chain, or vice-versa.
      issuedPermissions:
-        [{"permission":"upgrade","to":"0x4a4962275DF8C60a80d3a25faEc5AA7De116A746","via":[{"address":"0x198A8e0c220f29d8aF956e4c8A9E8b552096Ab2E"}]}]
    }
```

Generated with discovered.json: 0x0c80ea15a0383258aad603a64aca4fba5d53c4ae

# Diff at Thu, 24 Apr 2025 10:30:37 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@564f772ef796772c9952d7432df8286347a08d9e block: 22188866
- current block number: 22188866

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22188866 (main branch discovery), not current.

```diff
    contract SP1VerifierGateway (0x3B6041173B80E77f038f3F2C0f9744f04837185e) {
    +++ description: This contract is the router for zk proof verification. It stores the mapping between identifiers and the address of onchain verifier contracts, routing each identifier to the corresponding verifier contract.
+++ description: The verifier contract address for SP1, and whether it is frozen (true if frozen). This verifier route was frozen on 2024-09-04.
      values.oldVerifier:
-        ["0xc350F063C13a3Ca21331610fe159E697a5c9c2FB",true]
+        {"verifier":"0xc350F063C13a3Ca21331610fe159E697a5c9c2FB","frozen":true}
+++ description: The verifier contract address for SP1, and whether it is frozen (true if frozen). This prover route was frozen on 2024-09-21.
      values.oldVerifier2:
-        ["0x6B6A7Ded061567d8A56279801DEA5cFB79be5bFc",true]
+        {"verifier":"0x6B6A7Ded061567d8A56279801DEA5cFB79be5bFc","frozen":true}
+++ description: The verifier contract address for SP1, and whether it is frozen (true if frozen). This prover route was frozen on 2024-11-01.
      values.oldVerifier3:
-        ["0x6A87EFd4e6B2Db1ed73129A8b9c51aaA583d49e3",true]
+        {"prover":"0x6A87EFd4e6B2Db1ed73129A8b9c51aaA583d49e3","frozen":true}
+++ description: The verifier contract address for SP1, and whether it is frozen (true if frozen). This prover route was frozen on 2024-11-08.
      values.oldVerifier4:
-        ["0x1764C29FBd94865198588f10FC75D4f6636d158d",true]
+        {"verifier":"0x1764C29FBd94865198588f10FC75D4f6636d158d","frozen":true}
+++ description: The prover contract address for SP1, and whether it is frozen (true if frozen). This prover route was frozen on 2025-01-15.
      values.oldVerifier5:
-        ["0xd2832Cf1fC8bA210FfABF62Db9A8781153131d16",true]
+        {"prover":"0xd2832Cf1fC8bA210FfABF62Db9A8781153131d16","frozen":true}
      values.opSuccinctVerifier:
-        ["0xE00a3cBFC45241b33c0A44C78e26168CBc55EC63",false]
+        {"verifier":"0xE00a3cBFC45241b33c0A44C78e26168CBc55EC63","frozen":false}
+++ description: The prover contract address for SP1, and whether it is frozen (true if frozen).
      values.verifier:
-        ["0xE00a3cBFC45241b33c0A44C78e26168CBc55EC63",false]
+        {"prover":"0xE00a3cBFC45241b33c0A44C78e26168CBc55EC63","frozen":false}
    }
```

Generated with discovered.json: 0x4650c8d5c9dd866400fba172bd09ac13cd135ca3

# Diff at Wed, 23 Apr 2025 13:20:55 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@2f39eabda7f7e886e8b7711bdb4fc317e976d746 block: 22188866
- current block number: 22188866

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22188866 (main branch discovery), not current.

```diff
    contract SP1VerifierGatewayMultisig (0xCafEf00d348Adbd57c37d1B77e0619C6244C6878) {
    +++ description: None
      name:
-        "Succinct Multisig 1"
+        "SP1VerifierGatewayMultisig"
    }
```

Generated with discovered.json: 0x3f1ab78a7039f639a7a94a74f6f074e52b8eab2f

# Diff at Thu, 03 Apr 2025 14:54:56 GMT:

- author: vincfurc (<10850139+vincfurc@users.noreply.github.com>)
- comparing to: main@87156896058912c79002d4129b054942ff1352e9 block: 22046074
- current block number: 22188866

## Description

Renamed SP1SuccinctGateway to SP1VerifierGateway.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22046074 (main branch discovery), not current.

```diff
    contract SP1VerifierGateway (0x3B6041173B80E77f038f3F2C0f9744f04837185e) {
    +++ description: This contract is the router for zk proof verification. It stores the mapping between identifiers and the address of onchain verifier contracts, routing each identifier to the corresponding verifier contract.
      template:
-        "succinct/SP1SuccinctGateway"
+        "succinct/SP1VerifierGateway"
      issuedPermissions.1:
-        {"permission":"interact","to":"0xE00a3cBFC45241b33c0A44C78e26168CBc55EC63","description":"can verify proofs for the header range [latestBlock, targetBlock] proof.","via":[]}
    }
```

```diff
-   Status: DELETED
    contract SP1Verifier (0xd2832Cf1fC8bA210FfABF62Db9A8781153131d16)
    +++ description: None
```

```diff
    contract SP1Verifier (0xE00a3cBFC45241b33c0A44C78e26168CBc55EC63) {
    +++ description: SP1Verifier is a contract used to verify proofs given public values and verification key.
      receivedPermissions:
-        [{"permission":"interact","from":"0x3B6041173B80E77f038f3F2C0f9744f04837185e","description":"can verify proofs for the header range [latestBlock, targetBlock] proof."}]
      template:
+        "succinct/SP1Verifier"
      description:
+        "SP1Verifier is a contract used to verify proofs given public values and verification key."
    }
```

Generated with discovered.json: 0xebb7a52724301b02d6933d04aa529f7f0dfdd4fc

# Diff at Thu, 27 Mar 2025 11:14:53 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@8cc2e36080df3a74dfd8475d41c64f46203f5218 block: 22046074
- current block number: 22046074

## Description

Config related: add guardian description details, hide some noisy values, hide AddressManager as spam cat, add proposer / challenger to permissioned opfp chains.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22046074 (main branch discovery), not current.

```diff
    contract AddressManager (0x51D5C516c818dcf63E67B28cB2516166D8578c06) {
    +++ description: Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts.
      category:
+        {"name":"Spam","priority":-1}
    }
```

Generated with discovered.json: 0x4693131761e8dd71313c3bb9a53c29209776c981

# Diff at Tue, 18 Mar 2025 08:13:33 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@4ef7a8dbcec1cd9fec77aae2b73d81347a4ffb13 block: 22046074
- current block number: 22046074

## Description

Config: change Multisig names.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22046074 (main branch discovery), not current.

```diff
    contract Conduit Multisig 1 (0x4a4962275DF8C60a80d3a25faEc5AA7De116A746) {
    +++ description: None
      name:
-        "ConduitMultisig"
+        "Conduit Multisig 1"
    }
```

```diff
    contract Succinct Multisig 1 (0xCafEf00d348Adbd57c37d1B77e0619C6244C6878) {
    +++ description: None
      name:
-        "SuccinctGatewaySP1Multisig"
+        "Succinct Multisig 1"
    }
```

Generated with discovered.json: 0x3a0c5fda3ddbd2c9440a9dc1ee38055c29c2c622

# Diff at Fri, 14 Mar 2025 15:41:26 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@002bac09dea3b1154ecc36736323fb7552478ce4 block: 21872538
- current block number: 22046074

## Description

Conduit MS changes.

## Watched changes

```diff
    contract ConduitMultisig (0x4a4962275DF8C60a80d3a25faEc5AA7De116A746) {
    +++ description: None
      values.$members.9:
+        "0x4D8007a0E9f293e62E2b0F43C6Cf4C4B9e135BAe"
      values.$members.8:
-        "0x4D8007a0E9f293e62E2b0F43C6Cf4C4B9e135BAe"
+        "0xefCf0c8faFB425997870f845e26fC6cA6EE6dD5C"
      values.$members.7:
-        "0xefCf0c8faFB425997870f845e26fC6cA6EE6dD5C"
+        "0xa0C600a6e85bf225958FFAcC70B5FDDF9A059038"
      values.$members.6:
-        "0xa0C600a6e85bf225958FFAcC70B5FDDF9A059038"
+        "0x3840f487A17A41100DD1Bf0946c34f132a57Fd5f"
      values.$members.5:
-        "0x3840f487A17A41100DD1Bf0946c34f132a57Fd5f"
+        "0xa4000bDD2bB92ce6750b31F1eeda47Bd1cB8e6e4"
      values.$members.4:
-        "0xa4000bDD2bB92ce6750b31F1eeda47Bd1cB8e6e4"
+        "0xF0B77EaE7F2dabCC2571c7418406A0dCA3afA4f0"
      values.$members.3:
-        "0xF0B77EaE7F2dabCC2571c7418406A0dCA3afA4f0"
+        "0xF3313C48BD8E17b823d5498D62F37019dFEA647D"
      values.$members.2:
-        "0xF3313C48BD8E17b823d5498D62F37019dFEA647D"
+        "0xA0737fea60F0601A192E3d2c98865A883ab0bda2"
      values.$members.1:
-        "0xA0737fea60F0601A192E3d2c98865A883ab0bda2"
+        "0x50930d652266EF4127FA3A1906B7Cb9951076628"
      values.$members.0:
-        "0x50930d652266EF4127FA3A1906B7Cb9951076628"
+        "0x860e06Fe384D1A3340111e7D142E02642178c053"
      values.multisigThreshold:
-        "4 of 9 (44%)"
+        "4 of 10 (40%)"
    }
```

Generated with discovered.json: 0xfa49f0f8601eb9d37f3a518d4d9b659715b45010

# Diff at Tue, 04 Mar 2025 11:26:09 GMT:

- author: Michał Podsiadły (<michal.podsiadly@l2beat.com>)
- comparing to: main@be38e12d3ff947ca8de40f3a23a9ba1875a54f5a block: 21872538
- current block number: 21872538

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21872538 (main branch discovery), not current.

```diff
    contract SystemConfig (0xeBf5859b7646ca9cf8A981613569bF28394F2571) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      values.opStackDA.isSomeTxsLengthEqualToCelestiaDAExample:
-        false
      values.opStackDA.isUsingCelestia:
+        false
    }
```

Generated with discovered.json: 0xe85e846e3109d7abae7477a753d1524655396c2a

# Diff at Tue, 04 Mar 2025 10:39:37 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@98d260b45fe0d2195ce5e629bd7b200c8706e8ba block: 21872538
- current block number: 21872538

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21872538 (main branch discovery), not current.

```diff
    contract L1CrossDomainMessenger (0x1549Dd6f86f5bBf0b1Bc691407DE64e8104c1544) {
    +++ description: Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function.
      sinceBlock:
+        21418005
    }
```

```diff
    contract ProxyAdmin (0x198A8e0c220f29d8aF956e4c8A9E8b552096Ab2E) {
    +++ description: None
      sinceBlock:
+        21418004
    }
```

```diff
    contract SP1VerifierGateway (0x3B6041173B80E77f038f3F2C0f9744f04837185e) {
    +++ description: This contract is the router for zk proof verification. It stores the mapping between identifiers and the address of onchain verifier contracts, routing each identifier to the corresponding verifier contract.
      sinceBlock:
+        20233410
    }
```

```diff
    contract GnosisSafe (0x42d27eEA1AD6e22Af6284F609847CB3Cd56B9c64) {
    +++ description: None
      sinceBlock:
+        16780617
    }
```

```diff
    contract ConduitMultisig (0x4a4962275DF8C60a80d3a25faEc5AA7De116A746) {
    +++ description: None
      sinceBlock:
+        16990669
    }
```

```diff
    contract AddressManager (0x51D5C516c818dcf63E67B28cB2516166D8578c06) {
    +++ description: Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts.
      sinceBlock:
+        21418004
    }
```

```diff
    contract L1StandardBridge (0x6A3444d11cA2697fe4A19AC8995ABDd8Dd301521) {
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain.
      sinceBlock:
+        21418005
    }
```

```diff
    contract OptimismPortal (0x96B124841Eff4Ab1b3C1F654D60402a1405fF51A) {
    +++ description: The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals.
      sinceBlock:
+        21418005
    }
```

```diff
    contract OpFoundationOperationsSafe (0x9BA6e03D8B90dE867373Db8cF1A58d2F7F006b3A) {
    +++ description: None
      sinceBlock:
+        11670007
    }
```

```diff
    contract L1ERC721Bridge (0xa010dE167788ed7d95c770AC478997D3207236AF) {
    +++ description: Used to bridge ERC-721 tokens from host chain to this chain.
      sinceBlock:
+        21418007
    }
```

```diff
    contract OPSuccinctL2OutputOracle (0xb45440830bd8D288bB2B5B01Be303ae60fc855d8) {
    +++ description: Contains a list of proposed state roots which Proposers assert to be a result of block execution. The SuccinctL2OutputOracle modifies the L2OutputOracle to support whenNotOptimistic mode, in which a validity proof can be passed as input argument to the proposeL2Output function.
      sinceBlock:
+        21418007
    }
```

```diff
    contract SuccinctGatewaySP1Multisig (0xCafEf00d348Adbd57c37d1B77e0619C6244C6878) {
    +++ description: None
      sinceBlock:
+        20573748
    }
```

```diff
    contract SP1Verifier (0xd2832Cf1fC8bA210FfABF62Db9A8781153131d16) {
    +++ description: None
      sinceBlock:
+        21031662
    }
```

```diff
    contract SP1Verifier (0xE00a3cBFC45241b33c0A44C78e26168CBc55EC63) {
    +++ description: None
      sinceBlock:
+        21547470
    }
```

```diff
    contract SystemConfig (0xeBf5859b7646ca9cf8A981613569bF28394F2571) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      sinceBlock:
+        21418005
    }
```

```diff
    contract SuperchainConfig (0xeDe0D2f74e71bD43459e92D90c434D8cA5E597B8) {
    +++ description: This is NOT the shared SuperchainConfig contract of the OP stack Superchain but rather a local fork. It manages the `PAUSED_SLOT`, a boolean value indicating whether the local chain is paused, and `GUARDIAN_SLOT`, the address of the guardian which can pause and unpause the system.
      sinceBlock:
+        21418004
    }
```

```diff
    contract OptimismMintableERC20Factory (0xF8e8E783fa7A5CCDB77EddC3335cDb00066B515e) {
    +++ description: A helper contract that generates OptimismMintableERC20 contracts on the network it's deployed to. OptimismMintableERC20 is a standard extension of the base ERC20 token contract designed to allow the L1StandardBridge contracts to mint and burn tokens. This makes it possible to use an OptimismMintablERC20 as this chain's representation of a token on the host chain, or vice-versa.
      sinceBlock:
+        21418006
    }
```

Generated with discovered.json: 0x41b5b2ed137cbd0492bce7a22a0b50dc36401171

# Diff at Wed, 26 Feb 2025 10:32:58 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@18513668f913fbe57a197f43655b19111df0e627 block: 21872538
- current block number: 21872538

## Description

config related: added categories for all opstack, op stack and polygoncdk stack templates.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21872538 (main branch discovery), not current.

```diff
    contract L1CrossDomainMessenger (0x1549Dd6f86f5bBf0b1Bc691407DE64e8104c1544) {
    +++ description: Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function.
      category:
+        {"name":"Canonical Bridges","priority":2}
    }
```

```diff
    contract L1StandardBridge (0x6A3444d11cA2697fe4A19AC8995ABDd8Dd301521) {
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain.
      category:
+        {"name":"Canonical Bridges","priority":2}
    }
```

```diff
    contract OptimismPortal (0x96B124841Eff4Ab1b3C1F654D60402a1405fF51A) {
    +++ description: The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals.
      category:
+        {"name":"Local Infrastructure","priority":5}
    }
```

```diff
    contract L1ERC721Bridge (0xa010dE167788ed7d95c770AC478997D3207236AF) {
    +++ description: Used to bridge ERC-721 tokens from host chain to this chain.
      category:
+        {"name":"Canonical Bridges","priority":2}
    }
```

```diff
    contract SystemConfig (0xeBf5859b7646ca9cf8A981613569bF28394F2571) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      category:
+        {"name":"Local Infrastructure","priority":5}
    }
```

```diff
    contract SuperchainConfig (0xeDe0D2f74e71bD43459e92D90c434D8cA5E597B8) {
    +++ description: This is NOT the shared SuperchainConfig contract of the OP stack Superchain but rather a local fork. It manages the `PAUSED_SLOT`, a boolean value indicating whether the local chain is paused, and `GUARDIAN_SLOT`, the address of the guardian which can pause and unpause the system.
      category:
+        {"name":"Governance","priority":3}
    }
```

Generated with discovered.json: 0x08e22fe845d04500df9b8d136c4d929df5dcc23b

# Diff at Fri, 21 Feb 2025 08:59:55 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@1cf9ec35847912163c4b663a633e258a434c0bca block: 21872538
- current block number: 21872538

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21872538 (main branch discovery), not current.

```diff
    contract L1CrossDomainMessenger (0x1549Dd6f86f5bBf0b1Bc691407DE64e8104c1544) {
    +++ description: Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function.
      categories:
-        ["Core"]
    }
```

```diff
    contract L1StandardBridge (0x6A3444d11cA2697fe4A19AC8995ABDd8Dd301521) {
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain.
      categories:
-        ["Gateways&Escrows"]
    }
```

```diff
    contract SuperchainConfig (0xeDe0D2f74e71bD43459e92D90c434D8cA5E597B8) {
    +++ description: This is NOT the shared SuperchainConfig contract of the OP stack Superchain but rather a local fork. It manages the `PAUSED_SLOT`, a boolean value indicating whether the local chain is paused, and `GUARDIAN_SLOT`, the address of the guardian which can pause and unpause the system.
      categories:
-        ["Upgrades&Governance"]
    }
```

Generated with discovered.json: 0xaf4f1193d931496fa675865a7065094238add87e

# Diff at Tue, 18 Feb 2025 10:03:47 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@aff7e43e1c06f559de916763e04088cc23b3e08e block: 21845212
- current block number: 21872538

## Description

rangeVkeyCommitment, aggregationVkey changed, rollupConfigHash and verifier unchanged.

## Watched changes

```diff
    contract OPSuccinctL2OutputOracle (0xb45440830bd8D288bB2B5B01Be303ae60fc855d8) {
    +++ description: Contains a list of proposed state roots which Proposers assert to be a result of block execution. The SuccinctL2OutputOracle modifies the L2OutputOracle to support whenNotOptimistic mode, in which a validity proof can be passed as input argument to the proposeL2Output function.
      values.aggregationVkey:
-        "0x008deea30a17c13a2fa7200fa0609b668b1673a3401a3eb7121c2a4692409736"
+        "0x004f113a89b4e8d162197047643c9d710b42a30e7da7052703855d5c4716a81d"
      values.rangeVkeyCommitment:
-        "0x72f2aa2345210ed43468b3084102ca212311b456482025bd0fed05294d3d6138"
+        "0x1dfce47807a22e50513d7a9a130af9de3d1844625b54c4815e46ca5437eb9ba9"
    }
```

Generated with discovered.json: 0x37f149776ddb33fd322cc1d4505433966f005a4d

# Diff at Fri, 14 Feb 2025 14:11:54 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@166dc249bfa78df836dc8592e4a420bb82432150 block: 21637082
- current block number: 21845212

## Description

vKey and verifier upgrade.

## Watched changes

```diff
-   Status: DELETED
    contract SP1VerifierGateway (0x397A5f7f3dBd538f23DE225B51f532c34448dA9B)
    +++ description: This contract is the router for zk proof verification. It stores the mapping between identifiers and the address of onchain verifier contracts, routing each identifier to the corresponding verifier contract.
```

```diff
    contract OPSuccinctL2OutputOracle (0xb45440830bd8D288bB2B5B01Be303ae60fc855d8) {
    +++ description: Contains a list of proposed state roots which Proposers assert to be a result of block execution. The SuccinctL2OutputOracle modifies the L2OutputOracle to support whenNotOptimistic mode, in which a validity proof can be passed as input argument to the proposeL2Output function.
      values.aggregationVkey:
-        "0x001758559af75612b9d16de030ed47309d7d28fadd3839a3addaa78d2d4e2754"
+        "0x008deea30a17c13a2fa7200fa0609b668b1673a3401a3eb7121c2a4692409736"
      values.rangeVkeyCommitment:
-        "0x39979c7850d2d3f00c30b29a503c80e245af53ce02a1202518ae0d3c1f8691d0"
+        "0x72f2aa2345210ed43468b3084102ca212311b456482025bd0fed05294d3d6138"
      values.rollupConfigHash:
-        "0x60875d3128003350b1726b6a370c2ab6fa8b8ff7802134ed77fb2caa1f1d3db8"
+        "0xb687221eb250467cf026eaaeef39f33ca2af3ebea6c8eaabc7c7a2634d111ccd"
      values.verifier:
-        "0x397A5f7f3dBd538f23DE225B51f532c34448dA9B"
+        "0x3B6041173B80E77f038f3F2C0f9744f04837185e"
    }
```

```diff
    contract SuccinctGatewaySP1Multisig (0xCafEf00d348Adbd57c37d1B77e0619C6244C6878) {
    +++ description: None
      receivedPermissions.0.from:
-        "0x397A5f7f3dBd538f23DE225B51f532c34448dA9B"
+        "0x3B6041173B80E77f038f3F2C0f9744f04837185e"
    }
```

```diff
+   Status: CREATED
    contract SP1VerifierGateway (0x3B6041173B80E77f038f3F2C0f9744f04837185e)
    +++ description: This contract is the router for zk proof verification. It stores the mapping between identifiers and the address of onchain verifier contracts, routing each identifier to the corresponding verifier contract.
```

```diff
+   Status: CREATED
    contract SP1Verifier (0xd2832Cf1fC8bA210FfABF62Db9A8781153131d16)
    +++ description: None
```

```diff
+   Status: CREATED
    contract SP1Verifier (0xE00a3cBFC45241b33c0A44C78e26168CBc55EC63)
    +++ description: None
```

## Source code changes

```diff
...-0xE00a3cBFC45241b33c0A44C78e26168CBc55EC63.sol | 1432 ++++++++++++++++++++
 ...-0xd2832Cf1fC8bA210FfABF62Db9A8781153131d16.sol | 1432 ++++++++++++++++++++
 2 files changed, 2864 insertions(+)
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21637082 (main branch discovery), not current.

```diff
    contract SP1VerifierGateway (0x397A5f7f3dBd538f23DE225B51f532c34448dA9B) {
    +++ description: This contract is the router for zk proof verification. It stores the mapping between identifiers and the address of onchain verifier contracts, routing each identifier to the corresponding verifier contract.
      name:
-        "SuccinctGateway"
+        "SP1VerifierGateway"
      description:
-        "This contract is the router for the bridge proofs verification. It stores the mapping between the identifier of the bridge circuit and the address of the onchain verifier contract."
+        "This contract is the router for zk proof verification. It stores the mapping between identifiers and the address of onchain verifier contracts, routing each identifier to the corresponding verifier contract."
      issuedPermissions.0.description:
-        "holds the power to affect the liveness and safety of the bridge - can transfer ownership, add and freeze verifier routes."
+        "holds the power to affect the liveness and safety of the gateway - can transfer ownership, add and freeze verifier routes."
      values.opSuccinctVerifier:
-        ["0xa27A057CAb1a4798c6242F6eE5b2416B7Cd45E5D",false]
    }
```

```diff
-   Status: DELETED
    contract SP1Verifier (0xa27A057CAb1a4798c6242F6eE5b2416B7Cd45E5D)
    +++ description: None
```

```diff
    contract SuccinctGatewaySP1Multisig (0xCafEf00d348Adbd57c37d1B77e0619C6244C6878) {
    +++ description: None
      receivedPermissions.0.description:
-        "holds the power to affect the liveness and safety of the bridge - can transfer ownership, add and freeze verifier routes."
+        "holds the power to affect the liveness and safety of the gateway - can transfer ownership, add and freeze verifier routes."
    }
```

Generated with discovered.json: 0xf76688119ca801a5b0d9c0f04894d7301faea09b

# Diff at Mon, 10 Feb 2025 19:04:26 GMT:

- author: Michał Podsiadły (<michal.podsiadly@l2beat.com>)
- comparing to: main@3756adff7c1ac86d8af3374a90a75c1999aae2b3 block: 21637082
- current block number: 21637082

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21637082 (main branch discovery), not current.

```diff
    contract SystemConfig (0xeBf5859b7646ca9cf8A981613569bF28394F2571) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      values.opStackDA.isUsingEigenDA:
+        false
    }
```

Generated with discovered.json: 0x6ec5c6a7a3b29800edc3dc3172491548defa3cc6

# Diff at Tue, 04 Feb 2025 12:31:51 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@145553eed7ba44636411ecb25e4099728acd02f9 block: 21637082
- current block number: 21637082

## Description

Rename 'configure' permission to 'interact'

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21637082 (main branch discovery), not current.

```diff
    contract ProxyAdmin (0x198A8e0c220f29d8aF956e4c8A9E8b552096Ab2E) {
    +++ description: None
      directlyReceivedPermissions.0.permission:
-        "configure"
+        "interact"
    }
```

```diff
    contract SuccinctGateway (0x397A5f7f3dBd538f23DE225B51f532c34448dA9B) {
    +++ description: This contract is the router for the bridge proofs verification. It stores the mapping between the identifier of the bridge circuit and the address of the onchain verifier contract.
      issuedPermissions.0.permission:
-        "configure"
+        "interact"
    }
```

```diff
    contract ConduitMultisig (0x4a4962275DF8C60a80d3a25faEc5AA7De116A746) {
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
    contract AddressManager (0x51D5C516c818dcf63E67B28cB2516166D8578c06) {
    +++ description: Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts.
      issuedPermissions.0.permission:
-        "configure"
+        "interact"
    }
```

```diff
    contract OPSuccinctL2OutputOracle (0xb45440830bd8D288bB2B5B01Be303ae60fc855d8) {
    +++ description: Contains a list of proposed state roots which Proposers assert to be a result of block execution. The SuccinctL2OutputOracle modifies the L2OutputOracle to support whenNotOptimistic mode, in which a validity proof can be passed as input argument to the proposeL2Output function.
      issuedPermissions.0.permission:
-        "configure"
+        "interact"
    }
```

```diff
    contract SuccinctGatewaySP1Multisig (0xCafEf00d348Adbd57c37d1B77e0619C6244C6878) {
    +++ description: None
      receivedPermissions.0.permission:
-        "configure"
+        "interact"
    }
```

```diff
    contract SystemConfig (0xeBf5859b7646ca9cf8A981613569bF28394F2571) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      issuedPermissions.0.permission:
-        "configure"
+        "interact"
    }
```

Generated with discovered.json: 0x2d427380ae784be12e7346665a392005750143c3

# Diff at Mon, 20 Jan 2025 11:09:54 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@2c8b4f3d9910bb6371be9b4df87b70856e7d8c64 block: 21637082
- current block number: 21637082

## Description

Rerun on the same block number. Applies fixes to permissions and via field. Renames permission's target to to/from.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21637082 (main branch discovery), not current.

```diff
    contract ProxyAdmin (0x198A8e0c220f29d8aF956e4c8A9E8b552096Ab2E) {
    +++ description: None
      directlyReceivedPermissions.7.target:
-        "0xF8e8E783fa7A5CCDB77EddC3335cDb00066B515e"
      directlyReceivedPermissions.7.from:
+        "0xF8e8E783fa7A5CCDB77EddC3335cDb00066B515e"
      directlyReceivedPermissions.6.target:
-        "0xeDe0D2f74e71bD43459e92D90c434D8cA5E597B8"
      directlyReceivedPermissions.6.from:
+        "0xeDe0D2f74e71bD43459e92D90c434D8cA5E597B8"
      directlyReceivedPermissions.5.target:
-        "0xeBf5859b7646ca9cf8A981613569bF28394F2571"
      directlyReceivedPermissions.5.from:
+        "0xeBf5859b7646ca9cf8A981613569bF28394F2571"
      directlyReceivedPermissions.4.target:
-        "0xb45440830bd8D288bB2B5B01Be303ae60fc855d8"
      directlyReceivedPermissions.4.from:
+        "0xb45440830bd8D288bB2B5B01Be303ae60fc855d8"
      directlyReceivedPermissions.3.target:
-        "0xa010dE167788ed7d95c770AC478997D3207236AF"
      directlyReceivedPermissions.3.from:
+        "0xa010dE167788ed7d95c770AC478997D3207236AF"
      directlyReceivedPermissions.2.target:
-        "0x96B124841Eff4Ab1b3C1F654D60402a1405fF51A"
      directlyReceivedPermissions.2.from:
+        "0x96B124841Eff4Ab1b3C1F654D60402a1405fF51A"
      directlyReceivedPermissions.1.target:
-        "0x6A3444d11cA2697fe4A19AC8995ABDd8Dd301521"
      directlyReceivedPermissions.1.from:
+        "0x6A3444d11cA2697fe4A19AC8995ABDd8Dd301521"
      directlyReceivedPermissions.0.target:
-        "0x51D5C516c818dcf63E67B28cB2516166D8578c06"
      directlyReceivedPermissions.0.from:
+        "0x51D5C516c818dcf63E67B28cB2516166D8578c06"
    }
```

```diff
    contract SuccinctGateway (0x397A5f7f3dBd538f23DE225B51f532c34448dA9B) {
    +++ description: This contract is the router for the bridge proofs verification. It stores the mapping between the identifier of the bridge circuit and the address of the onchain verifier contract.
      issuedPermissions.0.target:
-        "0xCafEf00d348Adbd57c37d1B77e0619C6244C6878"
      issuedPermissions.0.to:
+        "0xCafEf00d348Adbd57c37d1B77e0619C6244C6878"
      issuedPermissions.0.description:
+        "holds the power to affect the liveness and safety of the bridge - can transfer ownership, add and freeze verifier routes."
    }
```

```diff
    contract ConduitMultisig (0x4a4962275DF8C60a80d3a25faEc5AA7De116A746) {
    +++ description: None
      receivedPermissions.9.target:
-        "0xF8e8E783fa7A5CCDB77EddC3335cDb00066B515e"
      receivedPermissions.9.from:
+        "0xF8e8E783fa7A5CCDB77EddC3335cDb00066B515e"
      receivedPermissions.8.target:
-        "0xeDe0D2f74e71bD43459e92D90c434D8cA5E597B8"
      receivedPermissions.8.from:
+        "0xeDe0D2f74e71bD43459e92D90c434D8cA5E597B8"
      receivedPermissions.7.target:
-        "0xeBf5859b7646ca9cf8A981613569bF28394F2571"
      receivedPermissions.7.from:
+        "0xeBf5859b7646ca9cf8A981613569bF28394F2571"
      receivedPermissions.6.target:
-        "0xb45440830bd8D288bB2B5B01Be303ae60fc855d8"
      receivedPermissions.6.from:
+        "0xb45440830bd8D288bB2B5B01Be303ae60fc855d8"
      receivedPermissions.5.target:
-        "0xa010dE167788ed7d95c770AC478997D3207236AF"
      receivedPermissions.5.from:
+        "0xa010dE167788ed7d95c770AC478997D3207236AF"
      receivedPermissions.4.target:
-        "0x96B124841Eff4Ab1b3C1F654D60402a1405fF51A"
      receivedPermissions.4.from:
+        "0x96B124841Eff4Ab1b3C1F654D60402a1405fF51A"
      receivedPermissions.3.target:
-        "0x6A3444d11cA2697fe4A19AC8995ABDd8Dd301521"
      receivedPermissions.3.from:
+        "0x6A3444d11cA2697fe4A19AC8995ABDd8Dd301521"
      receivedPermissions.2.target:
-        "0xeBf5859b7646ca9cf8A981613569bF28394F2571"
      receivedPermissions.2.from:
+        "0xeBf5859b7646ca9cf8A981613569bF28394F2571"
      receivedPermissions.1.target:
-        "0xb45440830bd8D288bB2B5B01Be303ae60fc855d8"
      receivedPermissions.1.from:
+        "0xb45440830bd8D288bB2B5B01Be303ae60fc855d8"
      receivedPermissions.0.target:
-        "0x51D5C516c818dcf63E67B28cB2516166D8578c06"
      receivedPermissions.0.from:
+        "0x51D5C516c818dcf63E67B28cB2516166D8578c06"
      directlyReceivedPermissions.0.target:
-        "0x198A8e0c220f29d8aF956e4c8A9E8b552096Ab2E"
      directlyReceivedPermissions.0.from:
+        "0x198A8e0c220f29d8aF956e4c8A9E8b552096Ab2E"
    }
```

```diff
    contract AddressManager (0x51D5C516c818dcf63E67B28cB2516166D8578c06) {
    +++ description: Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts.
      issuedPermissions.0.target:
-        "0x4a4962275DF8C60a80d3a25faEc5AA7De116A746"
      issuedPermissions.0.via.0.delay:
-        0
      issuedPermissions.0.via.0.description:
-        "set and change address mappings."
      issuedPermissions.0.to:
+        "0x4a4962275DF8C60a80d3a25faEc5AA7De116A746"
      issuedPermissions.0.description:
+        "set and change address mappings."
    }
```

```diff
    contract L1StandardBridge (0x6A3444d11cA2697fe4A19AC8995ABDd8Dd301521) {
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain.
      issuedPermissions.0.target:
-        "0x4a4962275DF8C60a80d3a25faEc5AA7De116A746"
      issuedPermissions.0.via.0.delay:
-        0
      issuedPermissions.0.via.0.description:
-        "upgrading the bridge implementation can give access to all funds escrowed therein."
      issuedPermissions.0.to:
+        "0x4a4962275DF8C60a80d3a25faEc5AA7De116A746"
      issuedPermissions.0.description:
+        "upgrading the bridge implementation can give access to all funds escrowed therein."
    }
```

```diff
    contract OptimismPortal (0x96B124841Eff4Ab1b3C1F654D60402a1405fF51A) {
    +++ description: The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals.
      issuedPermissions.1.target:
-        "0x4a4962275DF8C60a80d3a25faEc5AA7De116A746"
      issuedPermissions.1.via.0.delay:
-        0
      issuedPermissions.1.to:
+        "0x4a4962275DF8C60a80d3a25faEc5AA7De116A746"
      issuedPermissions.0.target:
-        "0x9BA6e03D8B90dE867373Db8cF1A58d2F7F006b3A"
      issuedPermissions.0.to:
+        "0x9BA6e03D8B90dE867373Db8cF1A58d2F7F006b3A"
    }
```

```diff
    contract OpFoundationOperationsSafe (0x9BA6e03D8B90dE867373Db8cF1A58d2F7F006b3A) {
    +++ description: None
      receivedPermissions.1.target:
-        "0xeDe0D2f74e71bD43459e92D90c434D8cA5E597B8"
      receivedPermissions.1.from:
+        "0xeDe0D2f74e71bD43459e92D90c434D8cA5E597B8"
      receivedPermissions.0.target:
-        "0x96B124841Eff4Ab1b3C1F654D60402a1405fF51A"
      receivedPermissions.0.from:
+        "0x96B124841Eff4Ab1b3C1F654D60402a1405fF51A"
    }
```

```diff
    contract L1ERC721Bridge (0xa010dE167788ed7d95c770AC478997D3207236AF) {
    +++ description: Used to bridge ERC-721 tokens from host chain to this chain.
      issuedPermissions.0.target:
-        "0x4a4962275DF8C60a80d3a25faEc5AA7De116A746"
      issuedPermissions.0.via.0.delay:
-        0
      issuedPermissions.0.to:
+        "0x4a4962275DF8C60a80d3a25faEc5AA7De116A746"
    }
```

```diff
    contract OPSuccinctL2OutputOracle (0xb45440830bd8D288bB2B5B01Be303ae60fc855d8) {
    +++ description: Contains a list of proposed state roots which Proposers assert to be a result of block execution. The SuccinctL2OutputOracle modifies the L2OutputOracle to support whenNotOptimistic mode, in which a validity proof can be passed as input argument to the proposeL2Output function.
      issuedPermissions.1.target:
-        "0x4a4962275DF8C60a80d3a25faEc5AA7De116A746"
      issuedPermissions.1.via.0.delay:
-        0
      issuedPermissions.1.to:
+        "0x4a4962275DF8C60a80d3a25faEc5AA7De116A746"
      issuedPermissions.0.target:
-        "0x4a4962275DF8C60a80d3a25faEc5AA7De116A746"
      issuedPermissions.0.to:
+        "0x4a4962275DF8C60a80d3a25faEc5AA7De116A746"
      issuedPermissions.0.description:
+        "can toggle between the optimistic mode and not optimistic (ZK) mode."
    }
```

```diff
    contract SuccinctGatewaySP1Multisig (0xCafEf00d348Adbd57c37d1B77e0619C6244C6878) {
    +++ description: None
      receivedPermissions.0.target:
-        "0x397A5f7f3dBd538f23DE225B51f532c34448dA9B"
      receivedPermissions.0.from:
+        "0x397A5f7f3dBd538f23DE225B51f532c34448dA9B"
    }
```

```diff
    contract SystemConfig (0xeBf5859b7646ca9cf8A981613569bF28394F2571) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      issuedPermissions.2.target:
-        "0x4a4962275DF8C60a80d3a25faEc5AA7De116A746"
      issuedPermissions.2.via.0.delay:
-        0
      issuedPermissions.2.to:
+        "0x4a4962275DF8C60a80d3a25faEc5AA7De116A746"
      issuedPermissions.1.target:
-        "0x9Fb23129982c993743Eb9bB156af8CC8Fa2aC761"
      issuedPermissions.1.to:
+        "0x9Fb23129982c993743Eb9bB156af8CC8Fa2aC761"
      issuedPermissions.0.target:
-        "0x4a4962275DF8C60a80d3a25faEc5AA7De116A746"
      issuedPermissions.0.to:
+        "0x4a4962275DF8C60a80d3a25faEc5AA7De116A746"
      issuedPermissions.0.description:
+        "it can update the preconfer address, the batch submitter (Sequencer) address and the gas configuration of the system."
    }
```

```diff
    contract SuperchainConfig (0xeDe0D2f74e71bD43459e92D90c434D8cA5E597B8) {
    +++ description: This is NOT the shared SuperchainConfig contract of the OP stack Superchain but rather a local fork. It manages the `PAUSED_SLOT`, a boolean value indicating whether the local chain is paused, and `GUARDIAN_SLOT`, the address of the guardian which can pause and unpause the system.
      issuedPermissions.1.target:
-        "0x4a4962275DF8C60a80d3a25faEc5AA7De116A746"
      issuedPermissions.1.via.0.delay:
-        0
      issuedPermissions.1.to:
+        "0x4a4962275DF8C60a80d3a25faEc5AA7De116A746"
      issuedPermissions.0.target:
-        "0x9BA6e03D8B90dE867373Db8cF1A58d2F7F006b3A"
      issuedPermissions.0.to:
+        "0x9BA6e03D8B90dE867373Db8cF1A58d2F7F006b3A"
    }
```

```diff
    contract OptimismMintableERC20Factory (0xF8e8E783fa7A5CCDB77EddC3335cDb00066B515e) {
    +++ description: A helper contract that generates OptimismMintableERC20 contracts on the network it's deployed to. OptimismMintableERC20 is a standard extension of the base ERC20 token contract designed to allow the L1StandardBridge contracts to mint and burn tokens. This makes it possible to use an OptimismMintablERC20 as this chain's representation of a token on the host chain, or vice-versa.
      issuedPermissions.0.target:
-        "0x4a4962275DF8C60a80d3a25faEc5AA7De116A746"
      issuedPermissions.0.via.0.delay:
-        0
      issuedPermissions.0.to:
+        "0x4a4962275DF8C60a80d3a25faEc5AA7De116A746"
    }
```

Generated with discovered.json: 0x72dbc41fcdadae7a49670a9dfb8db474b913d572

# Diff at Thu, 16 Jan 2025 12:36:07 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@b471de2d691e0c6d99ad89859efde79edd3d4dfb block: 21630146
- current block number: 21637082

## Description

ConduitMultisig signer changes.

## Watched changes

```diff
    contract SuccinctGateway (0x397A5f7f3dBd538f23DE225B51f532c34448dA9B) {
    +++ description: This contract is the router for the bridge proofs verification. It stores the mapping between the identifier of the bridge circuit and the address of the onchain verifier contract.
+++ description: The verifier contract address for SP1, and whether it is frozen (true if frozen). This prover route was frozen on 2024-11-01.
      values.oldVerifier3.1:
-        false
+        true
    }
```

```diff
    contract ConduitMultisig (0x4a4962275DF8C60a80d3a25faEc5AA7De116A746) {
    +++ description: None
      values.$members.8:
+        "0x4D8007a0E9f293e62E2b0F43C6Cf4C4B9e135BAe"
      values.$members.7:
-        "0x4D8007a0E9f293e62E2b0F43C6Cf4C4B9e135BAe"
+        "0xefCf0c8faFB425997870f845e26fC6cA6EE6dD5C"
      values.$members.6:
-        "0xefCf0c8faFB425997870f845e26fC6cA6EE6dD5C"
+        "0xa0C600a6e85bf225958FFAcC70B5FDDF9A059038"
      values.$members.5:
-        "0xa0C600a6e85bf225958FFAcC70B5FDDF9A059038"
+        "0x3840f487A17A41100DD1Bf0946c34f132a57Fd5f"
      values.$members.4:
-        "0x3840f487A17A41100DD1Bf0946c34f132a57Fd5f"
+        "0xa4000bDD2bB92ce6750b31F1eeda47Bd1cB8e6e4"
      values.$members.3:
-        "0xa4000bDD2bB92ce6750b31F1eeda47Bd1cB8e6e4"
+        "0xF0B77EaE7F2dabCC2571c7418406A0dCA3afA4f0"
      values.$members.2:
-        "0xF0B77EaE7F2dabCC2571c7418406A0dCA3afA4f0"
+        "0xF3313C48BD8E17b823d5498D62F37019dFEA647D"
      values.$members.1:
-        "0xF3313C48BD8E17b823d5498D62F37019dFEA647D"
+        "0xA0737fea60F0601A192E3d2c98865A883ab0bda2"
      values.$members.0:
-        "0xA0737fea60F0601A192E3d2c98865A883ab0bda2"
+        "0x50930d652266EF4127FA3A1906B7Cb9951076628"
      values.multisigThreshold:
-        "4 of 8 (50%)"
+        "4 of 9 (44%)"
    }
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21630146 (main branch discovery), not current.

```diff
    contract SuccinctGateway (0x397A5f7f3dBd538f23DE225B51f532c34448dA9B) {
    +++ description: This contract is the router for the bridge proofs verification. It stores the mapping between the identifier of the bridge circuit and the address of the onchain verifier contract.
+++ description: The prover contract address for SP1, and whether it is frozen (true if frozen). This prover route was frozen on 2025-01-15.
      values.oldVerifier5:
+        ["0x0000000000000000000000000000000000000000",false]
      fieldMeta.oldVerifier5:
+        {"description":"The prover contract address for SP1, and whether it is frozen (true if frozen). This prover route was frozen on 2025-01-15."}
    }
```

Generated with discovered.json: 0xff38e9b6faa818266f23fb8e14753a64a9cc048e

# Diff at Wed, 15 Jan 2025 13:22:11 GMT:

- author: vincfurc (<10850139+vincfurc@users.noreply.github.com>)
- comparing to: main@1189a75f4d0a644ce19ab86fd322d93dd0ecf4ae block: 21586240
- current block number: 21630146

## Description

Full discovery.

## Watched changes

```diff
    contract OPSuccinctL2OutputOracle (0xb45440830bd8D288bB2B5B01Be303ae60fc855d8) {
    +++ description: Contains a list of proposed state roots which Proposers assert to be a result of block execution. The SuccinctL2OutputOracle modifies the L2OutputOracle to support whenNotOptimistic mode, in which a validity proof can be passed as input argument to the proposeL2Output function.
      values.aggregationVkey:
-        "0x00d4e72bc998d0528b0722a53bedd9c6f0143c9157af194ad4bb2502e37a496f"
+        "0x001758559af75612b9d16de030ed47309d7d28fadd3839a3addaa78d2d4e2754"
      values.rangeVkeyCommitment:
-        "0x33e3678015df481724af3aac49d000923caeec277027610b1490f857769f9459"
+        "0x39979c7850d2d3f00c30b29a503c80e245af53ce02a1202518ae0d3c1f8691d0"
    }
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21586240 (main branch discovery), not current.

```diff
    contract ProxyAdmin (0x198A8e0c220f29d8aF956e4c8A9E8b552096Ab2E) {
    +++ description: None
      directlyReceivedPermissions.10:
-        {"permission":"upgrade","target":"0xF8e8E783fa7A5CCDB77EddC3335cDb00066B515e"}
      directlyReceivedPermissions.9:
-        {"permission":"upgrade","target":"0xf69D0f1faDd169CF7CD2b856cafBba01B1909a3f"}
      directlyReceivedPermissions.8:
-        {"permission":"upgrade","target":"0xeDe0D2f74e71bD43459e92D90c434D8cA5E597B8"}
      directlyReceivedPermissions.7.target:
-        "0xeBf5859b7646ca9cf8A981613569bF28394F2571"
+        "0xF8e8E783fa7A5CCDB77EddC3335cDb00066B515e"
      directlyReceivedPermissions.6.target:
-        "0xb45440830bd8D288bB2B5B01Be303ae60fc855d8"
+        "0xeDe0D2f74e71bD43459e92D90c434D8cA5E597B8"
      directlyReceivedPermissions.5.target:
-        "0xa010dE167788ed7d95c770AC478997D3207236AF"
+        "0xeBf5859b7646ca9cf8A981613569bF28394F2571"
      directlyReceivedPermissions.4.target:
-        "0x96B124841Eff4Ab1b3C1F654D60402a1405fF51A"
+        "0xb45440830bd8D288bB2B5B01Be303ae60fc855d8"
      directlyReceivedPermissions.3.target:
-        "0x8F7901A8974198cb62D3B78e79a21988CEBfF7E9"
+        "0xa010dE167788ed7d95c770AC478997D3207236AF"
      directlyReceivedPermissions.2.target:
-        "0x6A3444d11cA2697fe4A19AC8995ABDd8Dd301521"
+        "0x96B124841Eff4Ab1b3C1F654D60402a1405fF51A"
      directlyReceivedPermissions.2.description:
-        "upgrading the bridge implementation can give access to all funds escrowed therein."
      directlyReceivedPermissions.1.target:
-        "0x396ac7A2e8d0ac12DeDeB6BCeDC31C585e0038FE"
+        "0x6A3444d11cA2697fe4A19AC8995ABDd8Dd301521"
      directlyReceivedPermissions.1.description:
+        "upgrading the bridge implementation can give access to all funds escrowed therein."
    }
```

```diff
-   Status: DELETED
    contract DisputeGameFactory (0x396ac7A2e8d0ac12DeDeB6BCeDC31C585e0038FE)
    +++ description: The dispute game factory allows the creation of dispute games, used to propose state roots and eventually challenge them.
```

```diff
    contract SuccinctGateway (0x397A5f7f3dBd538f23DE225B51f532c34448dA9B) {
    +++ description: This contract is the router for the bridge proofs verification. It stores the mapping between the identifier of the bridge circuit and the address of the onchain verifier contract.
      name:
-        "SP1VerifierGateway"
+        "SuccinctGateway"
      values.opSuccinctVerifier:
+        ["0xa27A057CAb1a4798c6242F6eE5b2416B7Cd45E5D",false]
    }
```

```diff
    contract ConduitMultisig (0x4a4962275DF8C60a80d3a25faEc5AA7De116A746) {
    +++ description: None
      receivedPermissions.11:
-        {"permission":"upgrade","target":"0xF8e8E783fa7A5CCDB77EddC3335cDb00066B515e","via":[{"address":"0x198A8e0c220f29d8aF956e4c8A9E8b552096Ab2E"}]}
      receivedPermissions.10:
-        {"permission":"upgrade","target":"0xf69D0f1faDd169CF7CD2b856cafBba01B1909a3f","via":[{"address":"0x198A8e0c220f29d8aF956e4c8A9E8b552096Ab2E"}]}
      receivedPermissions.9.target:
-        "0xeDe0D2f74e71bD43459e92D90c434D8cA5E597B8"
+        "0xF8e8E783fa7A5CCDB77EddC3335cDb00066B515e"
      receivedPermissions.8.target:
-        "0xeBf5859b7646ca9cf8A981613569bF28394F2571"
+        "0xeDe0D2f74e71bD43459e92D90c434D8cA5E597B8"
      receivedPermissions.7.target:
-        "0xb45440830bd8D288bB2B5B01Be303ae60fc855d8"
+        "0xeBf5859b7646ca9cf8A981613569bF28394F2571"
      receivedPermissions.6.target:
-        "0xa010dE167788ed7d95c770AC478997D3207236AF"
+        "0xb45440830bd8D288bB2B5B01Be303ae60fc855d8"
      receivedPermissions.5.target:
-        "0x96B124841Eff4Ab1b3C1F654D60402a1405fF51A"
+        "0xa010dE167788ed7d95c770AC478997D3207236AF"
      receivedPermissions.4.target:
-        "0x8F7901A8974198cb62D3B78e79a21988CEBfF7E9"
+        "0x96B124841Eff4Ab1b3C1F654D60402a1405fF51A"
      receivedPermissions.2.permission:
-        "upgrade"
+        "configure"
      receivedPermissions.2.target:
-        "0x396ac7A2e8d0ac12DeDeB6BCeDC31C585e0038FE"
+        "0xeBf5859b7646ca9cf8A981613569bF28394F2571"
      receivedPermissions.2.via:
-        [{"address":"0x198A8e0c220f29d8aF956e4c8A9E8b552096Ab2E"}]
      receivedPermissions.2.description:
+        "it can update the preconfer address, the batch submitter (Sequencer) address and the gas configuration of the system."
      receivedPermissions.1.target:
-        "0xeBf5859b7646ca9cf8A981613569bF28394F2571"
+        "0xb45440830bd8D288bB2B5B01Be303ae60fc855d8"
      receivedPermissions.1.description:
-        "it can update the preconfer address, the batch submitter (Sequencer) address and the gas configuration of the system."
+        "can toggle between the optimistic mode and not optimistic (ZK) mode."
    }
```

```diff
-   Status: DELETED
    contract DelayedWETH (0x8F7901A8974198cb62D3B78e79a21988CEBfF7E9)
    +++ description: Contract designed to hold the bonded ETH for each game. It is designed as a wrapper around WETH to allow an owner to function as a backstop if a game would incorrectly distribute funds.
```

```diff
-   Status: DELETED
    contract MIPS (0x99F4f5651FF808107A84F279ed8b79e0870F1f39)
    +++ description: None
```

```diff
    contract OPSuccinctL2OutputOracle (0xb45440830bd8D288bB2B5B01Be303ae60fc855d8) {
    +++ description: Contains a list of proposed state roots which Proposers assert to be a result of block execution. The SuccinctL2OutputOracle modifies the L2OutputOracle to support whenNotOptimistic mode, in which a validity proof can be passed as input argument to the proposeL2Output function.
      issuedPermissions.1:
+        {"permission":"upgrade","target":"0x4a4962275DF8C60a80d3a25faEc5AA7De116A746","via":[{"address":"0x198A8e0c220f29d8aF956e4c8A9E8b552096Ab2E","delay":0}]}
      issuedPermissions.0.permission:
-        "upgrade"
+        "configure"
      issuedPermissions.0.via.0:
-        {"address":"0x198A8e0c220f29d8aF956e4c8A9E8b552096Ab2E","delay":0}
      values.additionalProposers:
+        ["0xb6c7448Ad01AfAF34217FFd0eCaCf2c29bdc38fE"]
      template:
+        "succinct/OPSuccinct/OPSuccinctL2OutputOracle"
      description:
+        "Contains a list of proposed state roots which Proposers assert to be a result of block execution. The SuccinctL2OutputOracle modifies the L2OutputOracle to support whenNotOptimistic mode, in which a validity proof can be passed as input argument to the proposeL2Output function."
    }
```

```diff
-   Status: DELETED
    contract FaultDisputeGame (0xB6846927447e4764acd53b0b354BEd939f9220d7)
    +++ description: None
```

```diff
    contract SuccinctGatewaySP1Multisig (0xCafEf00d348Adbd57c37d1B77e0619C6244C6878) {
    +++ description: None
      name:
-        "GnosisSafe"
+        "SuccinctGatewaySP1Multisig"
    }
```

```diff
-   Status: DELETED
    contract PreimageOracle (0xE7Fd68F6a389DE7D7C9cFCfCE15486885abeDD44)
    +++ description: None
```

```diff
-   Status: DELETED
    contract GnosisSafe (0xe805B5dD6487f1528CCb204d76d007cB4699aEF3)
    +++ description: None
```

```diff
-   Status: DELETED
    contract PermissionedDisputeGame (0xF27d54dB0587442b01d6036C0F7f67CDaaBa1743)
    +++ description: None
```

```diff
-   Status: DELETED
    contract AnchorStateRegistry (0xf69D0f1faDd169CF7CD2b856cafBba01B1909a3f)
    +++ description: Contains the latest confirmed state root that can be used as a starting point in a dispute game.
```

```diff
+   Status: CREATED
    contract SP1Verifier (0xa27A057CAb1a4798c6242F6eE5b2416B7Cd45E5D)
    +++ description: None
```

Generated with discovered.json: 0xf403cc7f6e4417f0cf53bf159056fb905ed9ab0e

# Diff at Thu, 09 Jan 2025 10:11:31 GMT:

- author: vincfurc (<10850139+vincfurc@users.noreply.github.com>)
- current block number: 21586240

## Description

Initial discovery.

## Initial discovery

```diff
+   Status: CREATED
    contract L1CrossDomainMessenger (0x1549Dd6f86f5bBf0b1Bc691407DE64e8104c1544)
    +++ description: Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function.
```

```diff
+   Status: CREATED
    contract ProxyAdmin (0x198A8e0c220f29d8aF956e4c8A9E8b552096Ab2E)
    +++ description: None
```

```diff
+   Status: CREATED
    contract DisputeGameFactory (0x396ac7A2e8d0ac12DeDeB6BCeDC31C585e0038FE)
    +++ description: The dispute game factory allows the creation of dispute games, used to propose state roots and eventually challenge them.
```

```diff
+   Status: CREATED
    contract SP1VerifierGateway (0x397A5f7f3dBd538f23DE225B51f532c34448dA9B)
    +++ description: This contract is the router for the bridge proofs verification. It stores the mapping between the identifier of the bridge circuit and the address of the onchain verifier contract.
```

```diff
+   Status: CREATED
    contract GnosisSafe (0x42d27eEA1AD6e22Af6284F609847CB3Cd56B9c64)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ConduitMultisig (0x4a4962275DF8C60a80d3a25faEc5AA7De116A746)
    +++ description: None
```

```diff
+   Status: CREATED
    contract AddressManager (0x51D5C516c818dcf63E67B28cB2516166D8578c06)
    +++ description: Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts.
```

```diff
+   Status: CREATED
    contract L1StandardBridge (0x6A3444d11cA2697fe4A19AC8995ABDd8Dd301521)
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain.
```

```diff
+   Status: CREATED
    contract DelayedWETH (0x8F7901A8974198cb62D3B78e79a21988CEBfF7E9)
    +++ description: Contract designed to hold the bonded ETH for each game. It is designed as a wrapper around WETH to allow an owner to function as a backstop if a game would incorrectly distribute funds.
```

```diff
+   Status: CREATED
    contract OptimismPortal (0x96B124841Eff4Ab1b3C1F654D60402a1405fF51A)
    +++ description: The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals.
```

```diff
+   Status: CREATED
    contract MIPS (0x99F4f5651FF808107A84F279ed8b79e0870F1f39)
    +++ description: None
```

```diff
+   Status: CREATED
    contract OpFoundationOperationsSafe (0x9BA6e03D8B90dE867373Db8cF1A58d2F7F006b3A)
    +++ description: None
```

```diff
+   Status: CREATED
    contract L1ERC721Bridge (0xa010dE167788ed7d95c770AC478997D3207236AF)
    +++ description: Used to bridge ERC-721 tokens from host chain to this chain.
```

```diff
+   Status: CREATED
    contract OPSuccinctL2OutputOracle (0xb45440830bd8D288bB2B5B01Be303ae60fc855d8)
    +++ description: None
```

```diff
+   Status: CREATED
    contract FaultDisputeGame (0xB6846927447e4764acd53b0b354BEd939f9220d7)
    +++ description: None
```

```diff
+   Status: CREATED
    contract GnosisSafe (0xCafEf00d348Adbd57c37d1B77e0619C6244C6878)
    +++ description: None
```

```diff
+   Status: CREATED
    contract PreimageOracle (0xE7Fd68F6a389DE7D7C9cFCfCE15486885abeDD44)
    +++ description: None
```

```diff
+   Status: CREATED
    contract GnosisSafe (0xe805B5dD6487f1528CCb204d76d007cB4699aEF3)
    +++ description: None
```

```diff
+   Status: CREATED
    contract SystemConfig (0xeBf5859b7646ca9cf8A981613569bF28394F2571)
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
```

```diff
+   Status: CREATED
    contract SuperchainConfig (0xeDe0D2f74e71bD43459e92D90c434D8cA5E597B8)
    +++ description: This is NOT the shared SuperchainConfig contract of the OP stack Superchain but rather a local fork. It manages the `PAUSED_SLOT`, a boolean value indicating whether the local chain is paused, and `GUARDIAN_SLOT`, the address of the guardian which can pause and unpause the system.
```

```diff
+   Status: CREATED
    contract PermissionedDisputeGame (0xF27d54dB0587442b01d6036C0F7f67CDaaBa1743)
    +++ description: None
```

```diff
+   Status: CREATED
    contract AnchorStateRegistry (0xf69D0f1faDd169CF7CD2b856cafBba01B1909a3f)
    +++ description: Contains the latest confirmed state root that can be used as a starting point in a dispute game.
```

```diff
+   Status: CREATED
    contract OptimismMintableERC20Factory (0xF8e8E783fa7A5CCDB77EddC3335cDb00066B515e)
    +++ description: A helper contract that generates OptimismMintableERC20 contracts on the network it's deployed to. OptimismMintableERC20 is a standard extension of the base ERC20 token contract designed to allow the L1StandardBridge contracts to mint and burn tokens. This makes it possible to use an OptimismMintablERC20 as this chain's representation of a token on the host chain, or vice-versa.
```
