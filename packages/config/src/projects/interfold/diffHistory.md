Generated with discovered.json: 0x54c930d603ca0c5b57bab5605f540ecc5a177391

# Diff at Tue, 01 Sep 2026 14:42:58 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@dfe2e020d57a240857add0385299600fbc2a51fb block: 1787833077
- current timestamp: 1788273501

## Description

2026-08-28 upgrade of the Interfold, CiphernodeRegistry and BondingRegistry proxies, now fully reviewed from verified source. Discovery is back on templates: new shapes for the three upgraded implementations and new ChainlinkVrfRandomnessProvider and NodeReleaseRegistry templates replace the interim explicit-handler overrides in config.jsonc.

- Sortition entropy now comes from a Chainlink VRF v2.5 subscription consumer (RandomnessProvider) instead of EIP-2935 blockhashes. All its VRF parameters are immutable (native-ETH-paid subscription, 1 ETH minimum balance, 64 confirmations); the DAO owner can only replace the coordinator. The registry accepts a response only within a 1h timeout window bound to the request, and a timed-out request permissionlessly trips a circuit breaker that zeroes the provider, disabling new E3 requests until governance re-sets it (only possible while requests are paused and no committees are outstanding).
- The formerly unknown 16th pricing parameter is randomnessFlatFee (5 USDS): a non-refundable request-time fee credited to the protocol treasury to reimburse the VRF subscription, exempt from the margin markup and required to be nonzero.
- NodeReleaseRegistry (DAO-owned, Ownable2Step, renounce disabled) gates operator eligibility on self-attested software releases: operators must attest the exact required protocol version (currently 1) and at least the required node generation (currently 1). The DAO can only raise the requirement, only while paused and drained, and each raise (like the wiring-in itself, which bumped the eligibility-configuration version 4 -> 5) instantly invalidates every operator's cached active status.
- Requester cancellation was narrowed: an E3 can now only be cancelled after its randomness request times out without a result (classified as CommitteeFormationTimeout); mid-flight cancellation of active E3s was removed.
- BondingRegistry's external interface is unchanged (internal refactor into libraries plus the node-release eligibility hook); requestsPaused remains true.

## Watched changes

```diff
-   Status: DELETED
    contract  (eth:0x0000F90827F1C53a10cb7A02335B175320002935) [N/A]
    +++ description: None
```

```diff
    contract BondingRegistry (eth:0x0ec90465095C21830BEcED07e032809A2Bd2915F) [interfold/BondingRegistry] {
    +++ description: Collateral registry for ciphernode operators. Operators become eligible by depositing ticket collateral backed by sUSDS and a FOLD bond, and by attesting a current software release in the NodeReleaseRegistry; the contract also enforces exits, committee obligations, bans and slashing debits.
      sourceHashes.1:
-        "0x2f4ffa441ee6931aaf10dc75ea17d88ac1e02780b5802234253f4732f19706ae"
+        "0xb97dc60ab9865caddf8025162df9c53ea501692873fbef50c57733bea73c86ab"
      values.$implementation:
-        "eth:0x4FF6e77A10E8f06C11a4DD2A71b6AB55394640e4"
+        "eth:0xd89D3fE1b53eF95111c0E68A8CeFDfd20EcCA53a"
      values.$pastUpgrades.2:
+        ["2026-08-28T00:23:35.000Z","0xb72b8bc214a3416a90f0d84cf34dc833251a669b1e0201f70924805f7fa18b58",["eth:0xd89D3fE1b53eF95111c0E68A8CeFDfd20EcCA53a"]]
      values.$upgradeCount:
-        2
+        3
+++ description: Operator keys currently active under the collateral, release-attestation and ban rules, reconstructed from activation events. Eligibility-configuration bumps invalidate all cached statuses without emitting events, so entries here may still await re-activation.
      values.activeOperators.11:
+        "eth:0xc798b5f60150FbB2Db9b061817831DF62D2b269C"
+++ description: Operator keys currently active under the collateral, release-attestation and ban rules, reconstructed from activation events. Eligibility-configuration bumps invalidate all cached statuses without emitting events, so entries here may still await re-activation.
      values.activeOperators.12:
+        "eth:0xB6Bb517ca0bD9a8b0eD2817e604b327d31626190"
      values.bondOwners.eth:0xc798b5f60150FbB2Db9b061817831DF62D2b269C:
+        "eth:0x97843608a00e2bbc75ab0C1911387E002565DEDE"
      values.bondOwners.eth:0x12c75ce176D5a58d2a72e85Af158Cbd8749fE1D8:
+        "eth:0x0b304924fAa64b0f040dcA67bC5175Dd6078db52"
      values.bondOwners.eth:0xcb6ce8C3a16DeF797167e8A2aED7998A065f2513:
+        "eth:0xcb6ce8C3a16DeF797167e8A2aED7998A065f2513"
      values.bondOwners.eth:0x819a1D34873eC46e8DD6c7DE14429F5a07E47Ff9:
+        "eth:0x819a1D34873eC46e8DD6c7DE14429F5a07E47Ff9"
      values.bondOwners.eth:0xB6Bb517ca0bD9a8b0eD2817e604b327d31626190:
+        "eth:0x8Dcb4a4e9621C492A82c0e3E105aB69124c401a2"
      values.bondOwners.eth:0x1dF428833f2C9FB1eF098754e5D710432450d706:
+        "eth:0x1dF428833f2C9FB1eF098754e5D710432450d706"
+++ description: Number of operators whose active status is valid under the current eligibility-configuration version.
      values.numActiveOperators:
-        11
+        9
      values.numRegisteredOperators:
-        11
+        16
      implementationNames.eth:0x4FF6e77A10E8f06C11a4DD2A71b6AB55394640e4:
-        "BondingRegistry"
      implementationNames.eth:0xd89D3fE1b53eF95111c0E68A8CeFDfd20EcCA53a:
+        "BondingRegistry"
    }
```

```diff
    contract Interfold (eth:0x28cF63B459e6218C69EA97ea7D90541cf648c715) [interfold/Interfold] {
    +++ description: Coordinator for Encrypted Execution Environments (E3s). It accepts requests for allowlisted programs, selects a ciphernode committee, snapshots the configured proof system, and verifies the encrypted result and threshold decryption before publishing plaintext output.
      sourceHashes.1:
-        "0x25830faa7c9d8c4aecf3d78f04ce54c52aae87769713d3e9ad951ca08abd4277"
+        "0xd3737346baa5d40f73aea8a15668e65fc210c6fbb56ddf2c8d8f6a0386d0a6f9"
      values.$implementation:
-        "eth:0x8AcBf712513C802eFFc255FEa588ED21DC7A61bA"
+        "eth:0xA7e1f2693b3b5038e505396Dbd21d6c26ECa8aA2"
      values.$pastUpgrades.1:
+        ["2026-08-28T00:23:35.000Z","0xb72b8bc214a3416a90f0d84cf34dc833251a669b1e0201f70924805f7fa18b58",["eth:0xA7e1f2693b3b5038e505396Dbd21d6c26ECa8aA2"]]
      values.$upgradeCount:
-        1
+        2
      values.getPricingConfig.randomnessFlatFee:
+        "5000000000000000000"
+++ description: Registry controlling which self-attested ciphernode software releases remain eligible for new E3s. Replacing it requires paused requests and no active E3s, and instantly invalidates every operator's cached eligibility.
      values.nodeReleaseRegistry:
+        "eth:0x9E1C6B433CFbC8f28d80EAB583C428B01d083b0A"
      implementationNames.eth:0x8AcBf712513C802eFFc255FEa588ED21DC7A61bA:
-        "Interfold"
      implementationNames.eth:0xA7e1f2693b3b5038e505396Dbd21d6c26ECa8aA2:
+        "Interfold"
    }
```

```diff
    contract InterfoldSafeA (eth:0x5429D8c7fD14023f3c414126F94BbE25A05fC018) [GnosisSafe] {
    +++ description: None
      receivedPermissions.15:
+        {"permission":"interact","from":"eth:0x9E1C6B433CFbC8f28d80EAB583C428B01d083b0A","description":"raise the required ciphernode protocol version and node generation, which instantly invalidates every operator's cached eligibility until they attest the new release. The requirement can only increase, and only while new E3 requests are paused and no E3s or committees are active.","role":".owner","via":[{"address":"eth:0x652a31c669f9AB37f6040f279139a75D04F2679e"}]}
      receivedPermissions.30:
+        {"permission":"interact","from":"eth:0xa0273f884816dfF0BE9B5ED50aB3AA29D6AaA712","description":"replace the Chainlink VRF coordinator that delivers the sortition entropy.","role":".owner","via":[{"address":"eth:0x652a31c669f9AB37f6040f279139a75D04F2679e"}]}
    }
```

```diff
    contract InterfoldDAO (eth:0x652a31c669f9AB37f6040f279139a75D04F2679e) [zama/ZamaDAO] {
    +++ description: Aragon DAO that stores governance state and executes proposal action batches.
      directlyReceivedPermissions.20:
+        {"permission":"interact","from":"eth:0x9E1C6B433CFbC8f28d80EAB583C428B01d083b0A","description":"raise the required ciphernode protocol version and node generation, which instantly invalidates every operator's cached eligibility until they attest the new release. The requirement can only increase, and only while new E3 requests are paused and no E3s or committees are active.","role":".owner"}
      directlyReceivedPermissions.21:
+        {"permission":"interact","from":"eth:0xa0273f884816dfF0BE9B5ED50aB3AA29D6AaA712","description":"replace the Chainlink VRF coordinator that delivers the sortition entropy.","role":".owner"}
    }
```

```diff
    contract InterfoldSafeB (eth:0x8B43b2852fc5031D01DDfCDF702973D93A2FF593) [GnosisSafe] {
    +++ description: None
      receivedPermissions.15:
+        {"permission":"interact","from":"eth:0x9E1C6B433CFbC8f28d80EAB583C428B01d083b0A","description":"raise the required ciphernode protocol version and node generation, which instantly invalidates every operator's cached eligibility until they attest the new release. The requirement can only increase, and only while new E3 requests are paused and no E3s or committees are active.","role":".owner","via":[{"address":"eth:0x652a31c669f9AB37f6040f279139a75D04F2679e"}]}
      receivedPermissions.30:
+        {"permission":"interact","from":"eth:0xa0273f884816dfF0BE9B5ED50aB3AA29D6AaA712","description":"replace the Chainlink VRF coordinator that delivers the sortition entropy.","role":".owner","via":[{"address":"eth:0x652a31c669f9AB37f6040f279139a75D04F2679e"}]}
    }
```

```diff
    contract PublicStagedProposalProcessor (eth:0x9c0Ff283399Bd1D3111E6c9C689066759b7AccDb) [interfold/StagedProposalProcessor] {
    +++ description: Upgradeable Aragon staged-proposal plugin that executes DAO actions after proposals pass its configured sequence of voting or manual bodies, thresholds and timing windows.
      receivedPermissions.17:
+        {"permission":"interact","from":"eth:0x9E1C6B433CFbC8f28d80EAB583C428B01d083b0A","description":"raise the required ciphernode protocol version and node generation, which instantly invalidates every operator's cached eligibility until they attest the new release. The requirement can only increase, and only while new E3 requests are paused and no E3s or committees are active.","role":".owner","via":[{"address":"eth:0x652a31c669f9AB37f6040f279139a75D04F2679e"}]}
      receivedPermissions.32:
+        {"permission":"interact","from":"eth:0xa0273f884816dfF0BE9B5ED50aB3AA29D6AaA712","description":"replace the Chainlink VRF coordinator that delivers the sortition entropy.","role":".owner","via":[{"address":"eth:0x652a31c669f9AB37f6040f279139a75D04F2679e"}]}
    }
```

```diff
    contract CiphernodeRegistry (eth:0xC927A5B2d8F68697bC28C0670df05178c93df2d7) [interfold/CiphernodeRegistry] {
    +++ description: Registry of ciphernodes and E3 committees. It performs ticket-weighted committee selection, records DKG (distributed key generation) proof anchors and the committee public key (to which cyphertexts can be encrypted), and tracks committee viability. Sortition entropy is supplied asynchronously by a governance-set randomness provider.
      sourceHashes.1:
-        "0x181143fe8736537b7086ceca31a6731ebb34e2e2612a63c3ff66ef5c7f3816af"
+        "0x993dbb9f6f7d08758f2b721cf9a1c301f9a7234933ca34d0430901203f34f1cf"
      values.$implementation:
-        "eth:0xB06Aaf9EF87984192490E947078D2f3563399b7B"
+        "eth:0xFff476751949a7e1B784b5c88648833c1e8dD69c"
+++ description: Current registered ciphernode operator keys reconstructed from add and remove events. For each E3, the active configuration selects three of these keys; $threshold applies to that selected committee, not to the full registry.
      values.$members.11:
+        "eth:0xc798b5f60150FbB2Db9b061817831DF62D2b269C"
+++ description: Current registered ciphernode operator keys reconstructed from add and remove events. For each E3, the active configuration selects three of these keys; $threshold applies to that selected committee, not to the full registry.
      values.$members.12:
+        "eth:0x12c75ce176D5a58d2a72e85Af158Cbd8749fE1D8"
+++ description: Current registered ciphernode operator keys reconstructed from add and remove events. For each E3, the active configuration selects three of these keys; $threshold applies to that selected committee, not to the full registry.
      values.$members.13:
+        "eth:0xcb6ce8C3a16DeF797167e8A2aED7998A065f2513"
+++ description: Current registered ciphernode operator keys reconstructed from add and remove events. For each E3, the active configuration selects three of these keys; $threshold applies to that selected committee, not to the full registry.
      values.$members.14:
+        "eth:0xB6Bb517ca0bD9a8b0eD2817e604b327d31626190"
+++ description: Current registered ciphernode operator keys reconstructed from add and remove events. For each E3, the active configuration selects three of these keys; $threshold applies to that selected committee, not to the full registry.
      values.$members.15:
+        "eth:0x1dF428833f2C9FB1eF098754e5D710432450d706"
      values.$pastUpgrades.1:
+        ["2026-08-28T00:23:35.000Z","0xb72b8bc214a3416a90f0d84cf34dc833251a669b1e0201f70924805f7fa18b58",["eth:0xFff476751949a7e1B784b5c88648833c1e8dD69c"]]
      values.$upgradeCount:
-        1
+        2
      values.BLOCKHASH_HISTORY:
-        "eth:0x0000F90827F1C53a10cb7A02335B175320002935"
      values.exitDelayFloor:
-        600
+        4200
+++ description: Number of currently registered ciphernode keys.
      values.numCiphernodes:
-        11
+        16
      values.sortitionEntropyBlocks:
-        [0,0,0,0,0]
      values.sortitionSeedResolved:
-        [false,false,false,false,false]
+++ description: Contract that supplies the asynchronous sortition entropy for committee selection. Automatically reset to zero, which disables new E3 requests, if a randomness request expires without a usable response (circuit breaker). Replacing it requires paused requests, no outstanding committees, and that the new provider names this registry as its only requester.
+++ severity: HIGH
      values.randomnessProvider:
+        "eth:0xa0273f884816dfF0BE9B5ED50aB3AA29D6AaA712"
+++ description: Time window in which the randomness provider must deliver sortition entropy for an E3, bounded between 60 seconds and 1 day.
      values.randomnessRequestTimeout:
+        3600
      errors:
-        {"sortitionEntropyBlocks":"Processing error occurred.","sortitionSeedResolved":"Processing error occurred."}
      implementationNames.eth:0xB06Aaf9EF87984192490E947078D2f3563399b7B:
-        "CiphernodeRegistryOwnable"
      implementationNames.eth:0xFff476751949a7e1B784b5c88648833c1e8dD69c:
+        "CiphernodeRegistryOwnable"
    }
```

```diff
    contract AdminPlugin (eth:0xF21e25455988887EE797050080141eba67B33920) [interfold/AdminPlugin] {
    +++ description: Non-upgradeable Aragon Admin plugin. Holders of its DAO-granted EXECUTE_PROPOSAL permission can submit actions that the plugin forwards immediately, without a vote or onchain delay.
      receivedPermissions.16:
+        {"permission":"interact","from":"eth:0x9E1C6B433CFbC8f28d80EAB583C428B01d083b0A","description":"raise the required ciphernode protocol version and node generation, which instantly invalidates every operator's cached eligibility until they attest the new release. The requirement can only increase, and only while new E3 requests are paused and no E3s or committees are active.","role":".owner","via":[{"address":"eth:0x652a31c669f9AB37f6040f279139a75D04F2679e"}]}
      receivedPermissions.31:
+        {"permission":"interact","from":"eth:0xa0273f884816dfF0BE9B5ED50aB3AA29D6AaA712","description":"replace the Chainlink VRF coordinator that delivers the sortition entropy.","role":".owner","via":[{"address":"eth:0x652a31c669f9AB37f6040f279139a75D04F2679e"}]}
    }
```

```diff
+   Status: CREATED
    EOA  (eth:0x1dF428833f2C9FB1eF098754e5D710432450d706)
    +++ description: None
```

```diff
+   Status: CREATED
    contract NodeReleaseRegistry (eth:0x9E1C6B433CFbC8f28d80EAB583C428B01d083b0A) [interfold/NodeReleaseRegistry]
    +++ description: Registry of ciphernode software releases. Operators self-attest the release they run; staying eligible for new E3 committees requires an attestation matching the exact governance-set protocol version and at least the required node generation. Raising the requirement instantly invalidates every operator's cached eligibility until they re-attest.
```

```diff
+   Status: CREATED
    contract RandomnessProvider (eth:0xa0273f884816dfF0BE9B5ED50aB3AA29D6AaA712) [interfold/ChainlinkVrfRandomnessProvider]
    +++ description: Supplies committee-sortition entropy as a Chainlink VRF v2.5 subscription consumer. Only its fixed requester (the CiphernodeRegistry) can request randomness, each E3 can be served exactly once, and requests revert while the funding subscription balance is below the configured minimum. All VRF parameters are immutable.
```

```diff
+   Status: CREATED
    EOA  (eth:0xcb6ce8C3a16DeF797167e8A2aED7998A065f2513)
    +++ description: None
```

## Source code changes

```diff
.../BondingRegistry/BondingRegistry.sol            |   423 +-
 .../CiphernodeRegistryOwnable.sol                  |   946 +-
 .../Interfold/Interfold.sol                        |   452 +-
 .../interfold/.flat/NodeReleaseRegistry.sol        | 10352 +++++++++++++++++
 .../interfold/.flat/RandomnessProvider.sol         | 11193 +++++++++++++++++++
 5 files changed, 22942 insertions(+), 424 deletions(-)
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 1787833077 (main branch discovery), not current.

```diff
    contract BondingRegistry (eth:0x0ec90465095C21830BEcED07e032809A2Bd2915F) [interfold/BondingRegistry] {
    +++ description: Collateral registry for ciphernode operators. Operators become eligible by depositing ticket collateral backed by sUSDS and a FOLD bond, and by attesting a current software release in the NodeReleaseRegistry; the contract also enforces exits, committee obligations, bans and slashing debits.
      description:
-        "Collateral registry for ciphernode operators. Operators become eligible by depositing ticket collateral backed by sUSDS and a FOLD bond; the contract also enforces exits, committee obligations, bans and slashing debits."
+        "Collateral registry for ciphernode operators. Operators become eligible by depositing ticket collateral backed by sUSDS and a FOLD bond, and by attesting a current software release in the NodeReleaseRegistry; the contract also enforces exits, committee obligations, bans and slashing debits."
      fieldMeta.activeOperators.description:
-        "Operator keys currently active under the collateral and ban rules, reconstructed from activation events."
+        "Operator keys currently active under the collateral, release-attestation and ban rules, reconstructed from activation events. Eligibility-configuration bumps invalidate all cached statuses without emitting events, so entries here may still await re-activation."
      fieldMeta.exitDelay.description:
-        "Delay before queued ticket collateral and FOLD bond exits can be claimed."
+        "Delay before queued ticket collateral and FOLD bond exits can be claimed. Must exceed the randomness timeout plus the sortition submission window."
      fieldMeta.eligibilityConfigurationVersion:
+        {"description":"Version counter of the operator-eligibility configuration. Each bump instantly invalidates every operator's cached active status until it refreshes under the new version. The configured NodeReleaseRegistry can bump it to force re-attestation during a release cutover."}
      fieldMeta.numActiveOperators:
+        {"description":"Number of operators whose active status is valid under the current eligibility-configuration version."}
    }
```

```diff
    contract Interfold (eth:0x28cF63B459e6218C69EA97ea7D90541cf648c715) [interfold/Interfold] {
    +++ description: Coordinator for Encrypted Execution Environments (E3s). It accepts requests for allowlisted programs, selects a ciphernode committee, snapshots the configured proof system, and verifies the encrypted result and threshold decryption before publishing plaintext output.
      fieldMeta.bfvDecryptionThreshold.severity:
+        "HIGH"
      fieldMeta.bfvCommitteeSize.severity:
+        "HIGH"
      fieldMeta.bfvParamSet.severity:
+        "HIGH"
      fieldMeta.bfvPkVerifier.severity:
+        "HIGH"
      fieldMeta.bfvDecryptionVerifier.severity:
+        "HIGH"
      fieldMeta.bfvCiphertextVerifier.severity:
+        "HIGH"
      fieldMeta.activeCryptoConfigId.severity:
+        "HIGH"
      fieldMeta.getPricingConfig.description:
-        "Fee model and fee split applied to new E3s, including minimum committee and threshold constraints."
+        "Fee model and fee split applied to new E3s, including minimum committee and threshold constraints. The randomnessFlatFee is a non-refundable request-time fee credited to the protocol treasury to reimburse the protocol-funded Chainlink VRF subscription."
      fieldMeta.nodeReleaseRegistry:
+        {"description":"Registry controlling which self-attested ciphernode software releases remain eligible for new E3s. Replacing it requires paused requests and no active E3s, and instantly invalidates every operator's cached eligibility.","type":"CODE_CHANGE"}
    }
```

```diff
    contract InterfoldSafeA (eth:0x5429D8c7fD14023f3c414126F94BbE25A05fC018) [GnosisSafe] {
    +++ description: None
      receivedPermissions.2.description:
-        "pause or unpause new requests; replace the registry, bonding, slashing and refund dependencies; allow fee assets and E3 programs; replace proof verifiers; and change pricing, timeouts, parameter sets and committee thresholds without an onchain delay."
+        "pause or unpause new requests; replace the registry, bonding, slashing, refund and node-release dependencies; allow fee assets and E3 programs; replace proof verifiers; and change pricing (including the flat randomness fee), timeouts, parameter sets and committee thresholds without an onchain delay."
      receivedPermissions.30.description:
-        "replace the coordinator, bonding and slashing dependencies; add or remove ciphernodes; change the sortition window; and update the DKG verifier and accusation-vote validity parameters. DKG-verifier replacement and risk-reducing accusation-window changes use a two-day propose/commit delay, while other changes are immediate."
+        "replace the coordinator, bonding, slashing and randomness-provider dependencies; add or remove ciphernodes; change the sortition window and randomness timeout; and update the DKG verifier and accusation-vote validity parameters. DKG-verifier replacement and risk-reducing accusation-window changes use a two-day propose/commit delay, while other changes are immediate. Randomness settings can only change while new requests are paused and no committees are outstanding."
    }
```

```diff
    contract InterfoldDAO (eth:0x652a31c669f9AB37f6040f279139a75D04F2679e) [zama/ZamaDAO] {
    +++ description: Aragon DAO that stores governance state and executes proposal action batches.
      directlyReceivedPermissions.7.description:
-        "pause or unpause new requests; replace the registry, bonding, slashing and refund dependencies; allow fee assets and E3 programs; replace proof verifiers; and change pricing, timeouts, parameter sets and committee thresholds without an onchain delay."
+        "pause or unpause new requests; replace the registry, bonding, slashing, refund and node-release dependencies; allow fee assets and E3 programs; replace proof verifiers; and change pricing (including the flat randomness fee), timeouts, parameter sets and committee thresholds without an onchain delay."
      directlyReceivedPermissions.21.description:
-        "replace the coordinator, bonding and slashing dependencies; add or remove ciphernodes; change the sortition window; and update the DKG verifier and accusation-vote validity parameters. DKG-verifier replacement and risk-reducing accusation-window changes use a two-day propose/commit delay, while other changes are immediate."
+        "replace the coordinator, bonding, slashing and randomness-provider dependencies; add or remove ciphernodes; change the sortition window and randomness timeout; and update the DKG verifier and accusation-vote validity parameters. DKG-verifier replacement and risk-reducing accusation-window changes use a two-day propose/commit delay, while other changes are immediate. Randomness settings can only change while new requests are paused and no committees are outstanding."
    }
```

```diff
    contract InterfoldSafeB (eth:0x8B43b2852fc5031D01DDfCDF702973D93A2FF593) [GnosisSafe] {
    +++ description: None
      receivedPermissions.2.description:
-        "pause or unpause new requests; replace the registry, bonding, slashing and refund dependencies; allow fee assets and E3 programs; replace proof verifiers; and change pricing, timeouts, parameter sets and committee thresholds without an onchain delay."
+        "pause or unpause new requests; replace the registry, bonding, slashing, refund and node-release dependencies; allow fee assets and E3 programs; replace proof verifiers; and change pricing (including the flat randomness fee), timeouts, parameter sets and committee thresholds without an onchain delay."
      receivedPermissions.30.description:
-        "replace the coordinator, bonding and slashing dependencies; add or remove ciphernodes; change the sortition window; and update the DKG verifier and accusation-vote validity parameters. DKG-verifier replacement and risk-reducing accusation-window changes use a two-day propose/commit delay, while other changes are immediate."
+        "replace the coordinator, bonding, slashing and randomness-provider dependencies; add or remove ciphernodes; change the sortition window and randomness timeout; and update the DKG verifier and accusation-vote validity parameters. DKG-verifier replacement and risk-reducing accusation-window changes use a two-day propose/commit delay, while other changes are immediate. Randomness settings can only change while new requests are paused and no committees are outstanding."
    }
```

```diff
    contract PublicStagedProposalProcessor (eth:0x9c0Ff283399Bd1D3111E6c9C689066759b7AccDb) [interfold/StagedProposalProcessor] {
    +++ description: Upgradeable Aragon staged-proposal plugin that executes DAO actions after proposals pass its configured sequence of voting or manual bodies, thresholds and timing windows.
      receivedPermissions.2.description:
-        "pause or unpause new requests; replace the registry, bonding, slashing and refund dependencies; allow fee assets and E3 programs; replace proof verifiers; and change pricing, timeouts, parameter sets and committee thresholds without an onchain delay."
+        "pause or unpause new requests; replace the registry, bonding, slashing, refund and node-release dependencies; allow fee assets and E3 programs; replace proof verifiers; and change pricing (including the flat randomness fee), timeouts, parameter sets and committee thresholds without an onchain delay."
      receivedPermissions.32.description:
-        "replace the coordinator, bonding and slashing dependencies; add or remove ciphernodes; change the sortition window; and update the DKG verifier and accusation-vote validity parameters. DKG-verifier replacement and risk-reducing accusation-window changes use a two-day propose/commit delay, while other changes are immediate."
+        "replace the coordinator, bonding, slashing and randomness-provider dependencies; add or remove ciphernodes; change the sortition window and randomness timeout; and update the DKG verifier and accusation-vote validity parameters. DKG-verifier replacement and risk-reducing accusation-window changes use a two-day propose/commit delay, while other changes are immediate. Randomness settings can only change while new requests are paused and no committees are outstanding."
    }
```

```diff
    contract CiphernodeRegistry (eth:0xC927A5B2d8F68697bC28C0670df05178c93df2d7) [interfold/CiphernodeRegistry] {
    +++ description: Registry of ciphernodes and E3 committees. It performs ticket-weighted committee selection, records DKG (distributed key generation) proof anchors and the committee public key (to which cyphertexts can be encrypted), and tracks committee viability. Sortition entropy is supplied asynchronously by a governance-set randomness provider.
      description:
-        "Registry of ciphernodes and E3 committees. It performs ticket-weighted committee selection, records DKG (distributed key generation) proof anchors and the committee public key (to which cyphertexts can be encrypted), and tracks committee viability."
+        "Registry of ciphernodes and E3 committees. It performs ticket-weighted committee selection, records DKG (distributed key generation) proof anchors and the committee public key (to which cyphertexts can be encrypted), and tracks committee viability. Sortition entropy is supplied asynchronously by a governance-set randomness provider."
      values.sortitionEntropyBlocks:
+        [0,0,0,0,0]
      values.sortitionSeedResolved:
+        [false,false,false,false,false]
      fieldMeta.dkgFoldAttestationVerifier.severity:
+        "HIGH"
      fieldMeta.pendingDkgFoldAttestationVerifier:
+        {"description":"DKG-fold verifier proposed under the two-day timelock (zero when none is pending).","type":"CODE_CHANGE"}
      fieldMeta.pendingAccusationVoteValidity:
+        {"description":"Accusation-vote validity window proposed under the two-day timelock (zero when none is pending).","type":"RISK_PARAMETER"}
      fieldMeta.randomnessProvider:
+        {"severity":"HIGH","description":"Contract that supplies the asynchronous sortition entropy for committee selection. Automatically reset to zero, which disables new E3 requests, if a randomness request expires without a usable response (circuit breaker). Replacing it requires paused requests, no outstanding committees, and that the new provider names this registry as its only requester.","type":"CODE_CHANGE"}
      fieldMeta.randomnessRequestTimeout:
+        {"description":"Time window in which the randomness provider must deliver sortition entropy for an E3, bounded between 60 seconds and 1 day.","type":"RISK_PARAMETER"}
      errors:
+        {"sortitionEntropyBlocks":"Processing error occurred.","sortitionSeedResolved":"Processing error occurred."}
    }
```

```diff
    contract AdminPlugin (eth:0xF21e25455988887EE797050080141eba67B33920) [interfold/AdminPlugin] {
    +++ description: Non-upgradeable Aragon Admin plugin. Holders of its DAO-granted EXECUTE_PROPOSAL permission can submit actions that the plugin forwards immediately, without a vote or onchain delay.
      receivedPermissions.2.description:
-        "pause or unpause new requests; replace the registry, bonding, slashing and refund dependencies; allow fee assets and E3 programs; replace proof verifiers; and change pricing, timeouts, parameter sets and committee thresholds without an onchain delay."
+        "pause or unpause new requests; replace the registry, bonding, slashing, refund and node-release dependencies; allow fee assets and E3 programs; replace proof verifiers; and change pricing (including the flat randomness fee), timeouts, parameter sets and committee thresholds without an onchain delay."
      receivedPermissions.31.description:
-        "replace the coordinator, bonding and slashing dependencies; add or remove ciphernodes; change the sortition window; and update the DKG verifier and accusation-vote validity parameters. DKG-verifier replacement and risk-reducing accusation-window changes use a two-day propose/commit delay, while other changes are immediate."
+        "replace the coordinator, bonding, slashing and randomness-provider dependencies; add or remove ciphernodes; change the sortition window and randomness timeout; and update the DKG verifier and accusation-vote validity parameters. DKG-verifier replacement and risk-reducing accusation-window changes use a two-day propose/commit delay, while other changes are immediate. Randomness settings can only change while new requests are paused and no committees are outstanding."
    }
```

```diff
+   Status: CREATED
    contract  (eth:0x0000F90827F1C53a10cb7A02335B175320002935) [N/A]
    +++ description: None
```

Generated with discovered.json: 0x30e6cceeabb38f5ce3cd923ac26150d74c1e7d85

# Diff at Thu, 27 Aug 2026 12:19:25 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@07685e2b690dd5d880203f3696ff2e1bc300a13d block: 1787653815
- current timestamp: 1787833077

## Description

Operators added, still paused.

## Watched changes

```diff
    contract BondingRegistry (eth:0x0ec90465095C21830BEcED07e032809A2Bd2915F) [interfold/BondingRegistry] {
    +++ description: Collateral registry for ciphernode operators. Operators become eligible by depositing ticket collateral backed by sUSDS and a FOLD bond; the contract also enforces exits, committee obligations, bans and slashing debits.
+++ description: Operator keys currently active under the collateral and ban rules, reconstructed from activation events.
      values.activeOperators.7:
+        "eth:0x2179a7A0bE3EB10c45A9aeec11F260E2bC4B1A7C"
+++ description: Operator keys currently active under the collateral and ban rules, reconstructed from activation events.
      values.activeOperators.8:
+        "eth:0xCdc8B4379dDF736f8e34B0A65585E07dE7060A84"
+++ description: Operator keys currently active under the collateral and ban rules, reconstructed from activation events.
      values.activeOperators.9:
+        "eth:0x18F98f8F44a37d4179888f286191f4F856CB4663"
+++ description: Operator keys currently active under the collateral and ban rules, reconstructed from activation events.
      values.activeOperators.10:
+        "eth:0x18ddBf8Aa6F72FC4D9E1911527d0CE1E9f3597d8"
      values.bondOwners.eth:0x2179a7A0bE3EB10c45A9aeec11F260E2bC4B1A7C:
+        "eth:0x2179a7A0bE3EB10c45A9aeec11F260E2bC4B1A7C"
      values.bondOwners.eth:0x18F98f8F44a37d4179888f286191f4F856CB4663:
+        "eth:0x2DeB5Ff7d2CdfA92A73f0b0B534e51875c81a5Ed"
      values.bondOwners.eth:0x9e6d627D60183276Bcd528D634e660f0c56EaDeE:
+        "eth:0x9e6d627D60183276Bcd528D634e660f0c56EaDeE"
      values.bondOwners.eth:0x65eb99fdd2a7508D34c6D17b874da8566d8E19c5:
+        "eth:0x65eb99fdd2a7508D34c6D17b874da8566d8E19c5"
      values.bondOwners.eth:0x0EebbDa2423b58e59Df0F4969e6Ce96af69BEFC3:
+        "eth:0x0EebbDa2423b58e59Df0F4969e6Ce96af69BEFC3"
      values.numActiveOperators:
-        7
+        11
      values.numRegisteredOperators:
-        7
+        11
    }
```

```diff
    contract CiphernodeRegistry (eth:0xC927A5B2d8F68697bC28C0670df05178c93df2d7) [interfold/CiphernodeRegistry] {
    +++ description: Registry of ciphernodes and E3 committees. It performs ticket-weighted committee selection, records DKG (distributed key generation) proof anchors and the committee public key (to which cyphertexts can be encrypted), and tracks committee viability.
+++ description: Current registered ciphernode operator keys reconstructed from add and remove events. For each E3, the active configuration selects three of these keys; $threshold applies to that selected committee, not to the full registry.
      values.$members.7:
+        "eth:0x2179a7A0bE3EB10c45A9aeec11F260E2bC4B1A7C"
+++ description: Current registered ciphernode operator keys reconstructed from add and remove events. For each E3, the active configuration selects three of these keys; $threshold applies to that selected committee, not to the full registry.
      values.$members.8:
+        "eth:0xCdc8B4379dDF736f8e34B0A65585E07dE7060A84"
+++ description: Current registered ciphernode operator keys reconstructed from add and remove events. For each E3, the active configuration selects three of these keys; $threshold applies to that selected committee, not to the full registry.
      values.$members.9:
+        "eth:0x18F98f8F44a37d4179888f286191f4F856CB4663"
+++ description: Current registered ciphernode operator keys reconstructed from add and remove events. For each E3, the active configuration selects three of these keys; $threshold applies to that selected committee, not to the full registry.
      values.$members.10:
+        "eth:0x18ddBf8Aa6F72FC4D9E1911527d0CE1E9f3597d8"
+++ description: Number of currently registered ciphernode keys.
      values.numCiphernodes:
-        7
+        11
    }
```

```diff
+   Status: CREATED
    EOA  (eth:0x0EebbDa2423b58e59Df0F4969e6Ce96af69BEFC3)
    +++ description: None
```

Generated with discovered.json: 0xd3a4075ede581d3d9135e6069c8d7387c91fcb89

# Diff at Tue, 25 Aug 2026 12:24:41 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- current timestamp: 1787653815

## Description

Interfold coordinates ephemeral encrypted computations on Ethereum using allowlisted application contracts and a ticket-selected committee of bonded ciphernodes (who do offchain execution). Users publish encrypted inputs, an offchain compute provider produces a proof-backed encrypted result, and a 2-of-3 committee of cyphernodes threshold-decrypts it into a publicly posted plaintext output. RISC Zero verifies the application-specific encrypted computation, while Honk proofs bind distributed key generation and threshold decryption to the selected committee and E3. New programs, verifiers and core configuration are DAO-controlled, and confidentiality depends on fewer than two selected committee members colluding. Protocol is paused atm.

## Initial discovery

```diff
+   Status: CREATED
    contract BondedVotes (eth:0x028deEA644258c78b1B5B2eacF469F5D781Fb43E) [interfold/BondedVotes]
    +++ description: Voting-power adapter used by PublicTokenVoting. It counts voting-escrow power, FOLD bonded to ciphernode operators, and eligible vesting-locked wallet FOLD while using FOLD total supply as the quorum denominator.
```

```diff
+   Status: CREATED
    contract VotingEscrowGaugeVoter (eth:0x0A32454FC578e3CAFeE86F6E03f267b25ad0bAf0) [interfold/VotingEscrowGaugeVoter]
    +++ description: Upgradeable, currently paused gauge-voting plugin connected to VotingEscrow. It can update voting state used by escrow lock operations but is not the Interfold DAO proposal-voting plugin.
```

```diff
+   Status: CREATED
    contract BondingRegistry (eth:0x0ec90465095C21830BEcED07e032809A2Bd2915F) [interfold/BondingRegistry]
    +++ description: Collateral registry for ciphernode operators. Operators become eligible by depositing ticket collateral backed by sUSDS and a FOLD bond; the contract also enforces exits, committee obligations, bans and slashing debits.
```

```diff
+   Status: CREATED
    EOA  (eth:0x11E91FB4793047a68dFff29158387229eA313ffE)
    +++ description: None
```

```diff
+   Status: CREATED
    contract E3RefundManager (eth:0x1940eF168f4E0B3dA24BEca539856684793B0F6e) [interfold/E3RefundManager]
    +++ description: Upgradeable accounting contract that snapshots the refund policy for each E3 and distributes request fees and routed slashed funds between the requester, honest committee members, protocol treasury and reserve.
```

```diff
+   Status: CREATED
    contract Interfold (eth:0x28cF63B459e6218C69EA97ea7D90541cf648c715) [interfold/Interfold]
    +++ description: Coordinator for Encrypted Execution Environments (E3s). It accepts requests for allowlisted programs, selects a ciphernode committee, snapshots the configured proof system, and verifies the encrypted result and threshold decryption before publishing plaintext output.
```

```diff
+   Status: CREATED
    contract ProxyAdmin (eth:0x2DFb93A8C3cE68Be3d8129479d7870646d89aDa7) [global/ProxyAdmin]
    +++ description: None
```

```diff
+   Status: CREATED
    EOA  (eth:0x2F3A1d13525748D2e6CC8EEA715CEFCF5B8ff833)
    +++ description: None
```

```diff
+   Status: CREATED
    EOA  (eth:0x34aA3F359A9D614239015126635CE7732c18fDF3)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Risc0BfvCiphertextVerifier (eth:0x40a18Fc27ac4a4d86fA70385c6814e453b6BFF2c) [N/A]
    +++ description: Unverified wrapper that accepts a RISC Zero receipt for the immutable guest image ID and the E3-specific journal constructed by Interfold.
```

```diff
+   Status: CREATED
    contract MockE3Program (eth:0x4976E5E47852eFCe6851d35B95A1A2E19456F3D7) [interfold/MockE3Program]
    +++ description: Permanently allowlisted test E3 application. It accepts arbitrary input and returns successful validation and output verification, so requests using it exercise the protocol proof pipeline without application-level correctness checks.
```

```diff
+   Status: CREATED
    contract DecryptionAggregatorVerifier (eth:0x53Fc34b412E16A1aE05A86934b821F82ca2a10da) [interfold/DecryptionAggregatorVerifier]
    +++ description: Immutable generated Honk verifier for the BFV threshold-decryption aggregation circuit.
```

```diff
+   Status: CREATED
    contract InterfoldSafeA (eth:0x5429D8c7fD14023f3c414126F94BbE25A05fC018) [GnosisSafe]
    +++ description: None
```

```diff
+   Status: CREATED
    contract AragonExecutor (eth:0x56ce4D8006292Abf418291FaE813C1E3769240A4) [interfold/AragonExecutor]
    +++ description: Immutable Aragon action executor used as a delegatecall target by PublicTokenVoting. It executes proposal action batches in the calling plugin's context.
```

```diff
+   Status: CREATED
    EOA  (eth:0x60Ca282757BA67f3aDbF21F3ba2eBe4Ab3eb01fc)
    +++ description: None
```

```diff
+   Status: CREATED
    contract InterfoldDAO (eth:0x652a31c669f9AB37f6040f279139a75D04F2679e) [zama/ZamaDAO]
    +++ description: Aragon DAO that stores governance state and executes proposal action batches.
```

```diff
+   Status: CREATED
    contract VotingEscrow (eth:0x71360F335e4Ec9c010e29bA7171bc62c9B4c1F12) [interfold/VotingEscrow]
    +++ description: veFOLD escrow that custodies locked FOLD, issues lock NFTs and calculates the voting power consumed by BondedVotes through EscrowVotesAdapter.
```

```diff
+   Status: CREATED
    contract VotingEscrowExitQueue (eth:0x8095C0B90Be4abCBF5CA7371f588fe1637E02b7f) [interfold/VotingEscrowExitQueue]
    +++ description: Queue applying cooldowns and optional fees to withdrawals from VotingEscrow.
```

```diff
+   Status: CREATED
    contract CRISPProgram (eth:0x847A22303639017bcDB7F7E49EEa4a4629c1169f) [N/A]
    +++ description: CRISP encrypted-ballot application. It verifies ballot eligibility and encryption proofs, commits ciphertext inputs, checks that a RISC Zero tally is bound to its input root and parameters, and decodes the threshold-decrypted tally.
```

```diff
+   Status: CREATED
    contract GnosisSafe (eth:0x8B405dBf2F30844B608b08DaD20447A6955A6C6E) [GnosisSafe]
    +++ description: None
```

```diff
+   Status: CREATED
    contract InterfoldSafeB (eth:0x8B43b2852fc5031D01DDfCDF702973D93A2FF593) [GnosisSafe]
    +++ description: None
```

```diff
+   Status: CREATED
    EOA  (eth:0x8d138c01765483cB79d787ce5933F609CbFDabcF)
    +++ description: None
```

```diff
+   Status: CREATED
    contract EscrowVotesAdapter (eth:0x8f141B4D294d39e7D1530916A3eD65B3970C6FEc) [interfold/EscrowVotesAdapter]
    +++ description: Upgradeable IVotes adapter that exposes voting power from veFOLD locks. BondedVotes uses it as its primary voting-power source.
```

```diff
+   Status: CREATED
    contract ProxyAdmin (eth:0x9393573a9EF85c9A37d91E32702a340084A48b6E) [global/ProxyAdmin]
    +++ description: None
```

```diff
+   Status: CREATED
    contract SlashingManager (eth:0x974E865B1BB24AF2a9ef8204AdEA9251Cc7C5FD9) [interfold/SlashingManager]
    +++ description: Policy and evidence router for ciphernode penalties, appeals and bans. Slashing is effective only for reasons with an enabled policy and through a manager authorized by the BondingRegistry.
```

```diff
+   Status: CREATED
    contract GnosisSafe (eth:0x97843608a00e2bbc75ab0C1911387E002565DEDE) [GnosisSafe]
    +++ description: None
```

```diff
+   Status: CREATED
    contract PublicStagedProposalProcessor (eth:0x9c0Ff283399Bd1D3111E6c9C689066759b7AccDb) [interfold/StagedProposalProcessor]
    +++ description: Upgradeable Aragon staged-proposal plugin that executes DAO actions after proposals pass its configured sequence of voting or manual bodies, thresholds and timing windows.
```

```diff
+   Status: CREATED
    contract DkgAggregatorVerifier (eth:0x9e58443eB40A1B08D07f89D36bf69909d401a542) [interfold/DkgAggregatorVerifier]
    +++ description: Immutable generated Honk verifier for the BFV distributed-key-generation aggregation circuit.
```

```diff
+   Status: CREATED
    contract VotingEscrowDAO (eth:0x9e9617418DFb9E4daD00E2D1e8f21e214901989B) [zama/ZamaDAO]
    +++ description: Aragon DAO that stores governance state and executes proposal action batches.
```

```diff
+   Status: CREATED
    contract ProxyAdmin (eth:0xB3985D7fF844FA0F5E0aaC5feb5DD8BE15e88580) [global/ProxyAdmin]
    +++ description: None
```

```diff
+   Status: CREATED
    contract BfvPkVerifier (eth:0xBA1854fDA7A5c127606572e43Dc7B37b7A15bdFf) [interfold/BfvPkVerifier]
    +++ description: BFV public-key proof wrapper. It binds the generated circuit verifier to the expected DKG-fold and C5 verification-key hashes.
```

```diff
+   Status: CREATED
    contract InterfoldTicketToken (eth:0xC0B5b49a3949eC4B520eF21BaCFE16e3695F3B5D) [interfold/InterfoldTicketToken]
    +++ description: Non-transferable ERC-20 Votes wrapper for sUSDS used as ciphernode ticket collateral. Only the configured BondingRegistry can deposit, mint, burn, withdraw or pay out the underlying asset.
```

```diff
+   Status: CREATED
    contract CiphernodeRegistry (eth:0xC927A5B2d8F68697bC28C0670df05178c93df2d7) [interfold/CiphernodeRegistry]
    +++ description: Registry of ciphernodes and E3 committees. It performs ticket-weighted committee selection, records DKG (distributed key generation) proof anchors and the committee public key (to which cyphertexts can be encrypted), and tracks committee viability.
```

```diff
+   Status: CREATED
    contract VotingEscrowClock (eth:0xc9707d36C07c3E0C4215a4574DB760b4e0E79166) [interfold/VotingEscrowClock]
    +++ description: Timestamp clock defining veFOLD epochs, checkpoint cadence and gauge-voting windows.
```

```diff
+   Status: CREATED
    contract PublicProposalCondition (eth:0xD0C2A1f94f7c584f0BF5588a519E82AD71dC1EC2) [interfold/SPPRuleCondition]
    +++ description: Aragon condition attached to the public CREATE_PROPOSAL permission. Its mutable rule program determines which callers and proposal calls qualify for the otherwise-public grant.
```

```diff
+   Status: CREATED
    contract BondedCheckpoints (eth:0xDbCaeec5B040A134314FfD43aA2ca0D16006f963) [interfold/BondedCheckpoints]
    +++ description: Voting-power checkpoint store updated exclusively by the BondingRegistry so FOLD bonded to ciphernode operators remains visible to governance snapshots.
```

```diff
+   Status: CREATED
    contract VotingEscrowMultisig (eth:0xDE2C723Ada1363575c716aFB9477A777B2a2bd7C) [zama/Multisig]
    +++ description: Aragon multisig plugin for creating proposals and collecting approvals against a configurable threshold.
```

```diff
+   Status: CREATED
    contract VotingEscrowMemberCondition (eth:0xde423A95f7955CcA8848e0eDCA773F6A2FBA2d76) [interfold/ListedCheckCondition]
    +++ description: Immutable Aragon condition on the voting-escrow multisig's public proposal grant. When the multisig is configured as only-listed, it restricts proposal creators to current listed members. The associated Multisig address is embedded immutably in bytecode.
```

```diff
+   Status: CREATED
    contract FOLD (eth:0xE172e9B6cfBeeB5593bDcE3f077356FDb33af904) [interfold/InterfoldToken]
    +++ description: Fixed-cap FOLD governance and ciphernode-bond token. Minting and pre-TGE transfer controls are disabled after the one-way TGE transition, while lock-policy administration can continue until the immutable lock cutoff.
```

```diff
+   Status: CREATED
    contract DkgFoldAttestationVerifier (eth:0xE5657c0756B772B600D6c73eDbF046f32129c770) [interfold/DkgFoldAttestationVerifier]
    +++ description: Immutable verifier for EIP-712 attestations that bind selected ciphernode operator keys to the party commitments folded into an E3 distributed-key-generation proof.
```

```diff
+   Status: CREATED
    contract VotingPowerCurve (eth:0xf023390C78CF95a77A8910187d5B09BBC05F37e9) [interfold/VotingPowerCurve]
    +++ description: Curve that converts veFOLD lock amount and duration into voting power.
```

```diff
+   Status: CREATED
    contract BfvDecryptionVerifier (eth:0xf143b969ea481Ccf251194D15F82007C67AABc53) [interfold/BfvDecryptionVerifier]
    +++ description: Threshold-decryption proof wrapper. It checks the generated circuit proof and binds its parties and public-key context to the committee recorded by CiphernodeRegistry.
```

```diff
+   Status: CREATED
    contract ProxyAdmin (eth:0xf1511Fc32abf7Bd3a3213ddCF08C07259b53972b) [global/ProxyAdmin]
    +++ description: None
```

```diff
+   Status: CREATED
    contract AdminPlugin (eth:0xF21e25455988887EE797050080141eba67B33920) [interfold/AdminPlugin]
    +++ description: Non-upgradeable Aragon Admin plugin. Holders of its DAO-granted EXECUTE_PROPOSAL permission can submit actions that the plugin forwards immediately, without a vote or onchain delay.
```

```diff
+   Status: CREATED
    contract VotingEscrowLockNFT (eth:0xF3eeE0f5E721b8c0073C8d85bf26A3d6EC293A0E) [interfold/VotingEscrowLockNFT]
    +++ description: ERC-721 whose tokens represent individual veFOLD lock positions.
```

```diff
+   Status: CREATED
    contract PublicTokenVoting (eth:0xfb4e1e518E5F7F8903233e639662110F31Db0BDC) [interfold/TokenVoting]
    +++ description: Upgradeable Aragon majority-voting plugin used as the voting body in Interfold's public staged proposal path. Voting power comes from the immutable BondedVotes adapter.
```
